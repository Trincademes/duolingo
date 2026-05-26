import { EXPO_LESSONS } from "../data/expoCourse";

// Regras locais de progresso usadas pelo MVP mobile mesmo sem conexao constante.
export function findLesson(lessonId) {
  return EXPO_LESSONS.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getNextLesson(completedLessons) {
  return EXPO_LESSONS.find((lesson) => !completedLessons.includes(lesson.id)) ?? EXPO_LESSONS[EXPO_LESSONS.length - 1];
}

export function getCourseProgress(completedLessons) {
  return Math.round((completedLessons.length / EXPO_LESSONS.length) * 100);
}

export function isLessonUnlocked(lessonId, completedLessons) {
  const index = EXPO_LESSONS.findIndex((lesson) => lesson.id === lessonId);

  if (index <= 0) {
    return true;
  }

  return completedLessons.includes(EXPO_LESSONS[index - 1].id);
}

export function isCorrect(exercise, answer) {
  if (exercise.type === "order") {
    return JSON.stringify(answer) === JSON.stringify(exercise.answer);
  }

  return answer === exercise.answer;
}

export function scoreLesson(lesson, answers, completedLessons) {
  // Recalcula a pontuacao a partir das respostas atuais, sem confiar em estado visual.
  const checks = lesson.exercises.map((exercise) => ({
    exercise,
    answer: answers[exercise.id],
    correct: isCorrect(exercise, answers[exercise.id])
  }));
  const correctCount = checks.filter((item) => item.correct).length;
  const passed = correctCount >= lesson.minCorrect;
  const accuracy = Math.round((correctCount / lesson.exercises.length) * 100);
  const alreadyDone = completedLessons.includes(lesson.id);
  const earnedXp = passed && !alreadyDone ? lesson.xp : passed ? Math.round(lesson.xp / 4) : 0;

  return {
    accuracy,
    checks,
    correctCount,
    earnedXp,
    passed,
    total: lesson.exercises.length
  };
}

export function completeLesson(current, lesson, score) {
  // Aplica XP, streak, historico e revisao em uma unica transicao de estado.
  const today = toDateKey(new Date());
  const streak = score.passed ? nextStreak(current.user.streak, current.user.lastStudyDate, today) : current.user.streak;
  const completedLessons = score.passed && !current.completedLessons.includes(lesson.id)
    ? [...current.completedLessons, lesson.id]
    : current.completedLessons;
  const xp = current.user.xp + score.earnedXp;
  const mistakes = score.checks
    .filter((item) => !item.correct)
    .map((item) => ({
      exerciseId: item.exercise.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      prompt: item.exercise.prompt,
      count: 1
    }));

  return {
    ...current,
    user: {
      ...current.user,
      xp,
      streak,
      level: Math.floor(xp / 100) + 1,
      lastStudyDate: score.passed ? today : current.user.lastStudyDate
    },
    completedLessons,
    mistakes: mergeMistakes(current.mistakes, mistakes),
    history: [
      {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        accuracy: score.accuracy,
        xp: score.earnedXp,
        passed: score.passed,
        completedAt: new Date().toISOString()
      },
      ...current.history
    ]
  };
}

export function getReviewItems(appState) {
  return appState.mistakes.slice(0, 5);
}

export function getAchievements(appState) {
  const achievements = [];

  if (appState.completedLessons.length >= 1) {
    achievements.push({
      id: "first",
      short: "1",
      title: "Primeira licao",
      description: "Voce concluiu a primeira microlicao de Expo."
    });
  }

  if (appState.user.streak >= 2) {
    achievements.push({
      id: "streak",
      short: "2",
      title: "Ofensiva ativa",
      description: "Voce estudou em dias seguidos."
    });
  }

  if (appState.user.xp >= 100) {
    achievements.push({
      id: "xp",
      short: "3",
      title: "100 XP",
      description: "Voce acumulou XP suficiente para subir de nivel."
    });
  }

  if (appState.completedLessons.length === EXPO_LESSONS.length) {
    achievements.push({
      id: "finish",
      short: "4",
      title: "Trilha Expo completa",
      description: "O MVP inteiro foi finalizado."
    });
  }

  return achievements;
}

function nextStreak(currentStreak, lastStudyDate, today) {
  if (lastStudyDate === today) {
    return Math.max(1, currentStreak);
  }

  if (lastStudyDate === shiftDate(today, -1)) {
    return currentStreak + 1;
  }

  return 1;
}

function mergeMistakes(existing, incoming) {
  const map = new Map(existing.map((item) => [item.exerciseId, item]));

  incoming.forEach((item) => {
    const previous = map.get(item.exerciseId);
    map.set(item.exerciseId, {
      ...item,
      count: previous ? previous.count + 1 : 1
    });
  });

  return Array.from(map.values()).sort((left, right) => right.count - left.count);
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDate(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
}
