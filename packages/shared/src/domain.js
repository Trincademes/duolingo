import { ACHIEVEMENTS, COURSES } from "./content.js";

// Este pacote concentra regras compartilhadas entre API e clientes.
function resolveCatalog(catalog) {
  return catalog ?? COURSES;
}

function startOfUtcDay(value) {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getDayDifference(left, right) {
  return Math.floor((startOfUtcDay(left) - startOfUtcDay(right)) / (1000 * 60 * 60 * 24));
}

function toUtcDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

export function normalizeUserRecord(user) {
  return {
    ...user,
    xp: user?.xp ?? 0,
    level: user?.level ?? calculateLevel(user?.xp ?? 0),
    streak: user?.streak ?? 0,
    rankingOptIn: user?.rankingOptIn ?? false,
    achievements: user?.achievements ?? [],
    notificationSettings: {
      enabled: true,
      dailyReminderTime: "19:00",
      ...(user?.notificationSettings ?? {})
    }
  };
}

export function getResolvedStreak(user, referenceDate = new Date().toISOString()) {
  const normalizedUser = normalizeUserRecord(user);

  if (!normalizedUser.lastStudyDate) {
    return 0;
  }

  const diffInDays = getDayDifference(referenceDate, normalizedUser.lastStudyDate);
  return diffInDays <= 1 ? normalizedUser.streak : 0;
}

export function hydrateUserState(user, referenceDate = new Date().toISOString()) {
  const normalizedUser = normalizeUserRecord(user);
  return {
    ...normalizedUser,
    streak: getResolvedStreak(normalizedUser, referenceDate)
  };
}

export function getCourseById(courseId, catalog) {
  return resolveCatalog(catalog).find((course) => course.id === courseId) ?? null;
}

export function listAllLessons(courseId, catalog) {
  const course = getCourseById(courseId, catalog);

  if (!course) {
    return [];
  }

  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      courseId: course.id,
      courseName: course.name
    }))
  );
}

export function getLessonById(lessonId, catalog) {
  for (const course of resolveCatalog(catalog)) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((item) => item.id === lessonId);

      if (lesson) {
        return {
          ...lesson,
          moduleId: module.id,
          moduleTitle: module.title,
          courseId: course.id,
          courseName: course.name
        };
      }
    }
  }

  return null;
}

export function createInitialUserProfile({ id, name, email, passwordHash, role = "student" }) {
  return {
    id,
    name,
    email,
    passwordHash,
    role,
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    rankingOptIn: false,
    achievements: [],
    notificationSettings: {
      enabled: true,
      dailyReminderTime: "19:00"
    },
    createdAt: new Date().toISOString()
  };
}

export function calculateLevel(xp) {
  return Math.max(1, Math.floor(xp / 120) + 1);
}

export function evaluateExercise(exercise, answer) {
  // Exercicios compostos comparam arrays/objetos; exercicios simples usam igualdade direta.
  if (exercise.type === "order_steps") {
    return JSON.stringify(answer) === JSON.stringify(exercise.correctAnswer);
  }

  if (exercise.type === "matching") {
    return JSON.stringify(answer) === JSON.stringify(exercise.correctAnswer);
  }

  return answer === exercise.correctAnswer;
}

export function evaluateLessonSubmission(lesson, answers) {
  const results = lesson.exercises.map((exercise) => {
    const answer = answers[exercise.id];
    const isCorrect = evaluateExercise(exercise, answer);

    return {
      exerciseId: exercise.id,
      answer,
      isCorrect,
      explanation: exercise.explanation,
      reviewTags: lesson.reviewTags
    };
  });

  const correctAnswers = results.filter((item) => item.isCorrect).length;
  const passed = correctAnswers >= lesson.minCorrectAnswers;
  const accuracyRate = lesson.exercises.length === 0 ? 0 : correctAnswers / lesson.exercises.length;

  return {
    correctAnswers,
    totalExercises: lesson.exercises.length,
    accuracyRate,
    passed,
    xpEarned: passed ? lesson.xpReward : Math.round(lesson.xpReward / 3),
    results
  };
}

export function isLessonUnlocked(course, progress, lessonId, catalog) {
  const lessons = listAllLessons(course.id, catalog);
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);

  if (lessonIndex <= 0) {
    return true;
  }

  const previousLesson = lessons[lessonIndex - 1];
  return progress.completedLessonIds.includes(previousLesson.id);
}

export function createInitialCourseProgress(userId, courseId, catalog) {
  return {
    userId,
    courseId,
    currentModuleId: getCourseById(courseId, catalog)?.modules[0]?.id ?? null,
    currentLessonId: listAllLessons(courseId, catalog)[0]?.id ?? null,
    xpAccumulated: 0,
    completedLessonIds: [],
    lessonHistory: [],
    errorLog: {},
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function updateStreak(user, studyDate) {
  const normalizedUser = normalizeUserRecord(user);
  const currentDate = new Date(studyDate);
  const previousDate = normalizedUser.lastStudyDate ? new Date(normalizedUser.lastStudyDate) : null;

  if (!previousDate) {
    return {
      streak: 1,
      lastStudyDate: currentDate.toISOString()
    };
  }

  const diffInDays = getDayDifference(currentDate, previousDate);

  if (diffInDays === 0) {
    return {
      streak: user.streak,
      lastStudyDate: previousDate.toISOString()
    };
  }

  if (diffInDays === 1) {
    return {
      streak: normalizedUser.streak + 1,
      lastStudyDate: currentDate.toISOString()
    };
  }

  return {
    streak: 1,
    lastStudyDate: currentDate.toISOString()
  };
}

export function buildTrack(courseId, progress, catalog) {
  const course = getCourseById(courseId, catalog);

  if (!course) {
    return null;
  }

  return {
    ...course,
    modules: course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        unlocked: isLessonUnlocked(course, progress, lesson.id, catalog),
        completed: progress.completedLessonIds.includes(lesson.id),
        current: progress.currentLessonId === lesson.id
      }))
    }))
  };
}

export function mergeLessonProgress({
  user,
  progress,
  lesson,
  submission,
  catalog,
  studyDate = new Date().toISOString()
}) {
  // Consolida uma submissao de licao em progresso, XP, streak, erros e conquistas.
  const normalizedUser = normalizeUserRecord(user);
  const completedLessonIds = submission.passed && !progress.completedLessonIds.includes(lesson.id)
    ? [...progress.completedLessonIds, lesson.id]
    : progress.completedLessonIds;

  const lessons = listAllLessons(progress.courseId, catalog);
  const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = lessons[currentIndex + 1] ?? null;

  const updatedErrorLog = { ...progress.errorLog };

  for (const result of submission.results) {
    if (!updatedErrorLog[result.exerciseId]) {
      updatedErrorLog[result.exerciseId] = {
        attempts: 0,
        errors: 0,
        reviewTags: result.reviewTags
      };
    }

    updatedErrorLog[result.exerciseId].attempts += 1;

    if (!result.isCorrect) {
      updatedErrorLog[result.exerciseId].errors += 1;
    }
  }

  const updatedUserXp = normalizedUser.xp + submission.xpEarned;
  const streakPayload = updateStreak(normalizedUser, studyDate);
  const updatedUser = {
    ...normalizedUser,
    xp: updatedUserXp,
    level: calculateLevel(updatedUserXp),
    streak: streakPayload.streak,
    lastStudyDate: streakPayload.lastStudyDate
  };

  const updatedProgress = {
    ...progress,
    currentLessonId: submission.passed ? nextLesson?.id ?? lesson.id : lesson.id,
    currentModuleId: nextLesson?.moduleId ?? progress.currentModuleId,
    xpAccumulated: progress.xpAccumulated + submission.xpEarned,
    completedLessonIds,
    errorLog: updatedErrorLog,
    lessonHistory: [
      ...progress.lessonHistory,
      {
        lessonId: lesson.id,
        title: lesson.title,
        moduleId: lesson.moduleId,
        score: submission.correctAnswers,
        total: submission.totalExercises,
        accuracyRate: submission.accuracyRate,
        passed: submission.passed,
        completedAt: studyDate
      }
    ],
    updatedAt: studyDate
  };

  const unlockedAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (updatedUser.achievements.includes(achievement.id)) {
      return false;
    }

    if (achievement.type === "streak") {
      return updatedUser.streak >= achievement.threshold;
    }

    if (achievement.type === "module_completion") {
      return countCompletedModules(progress.courseId, updatedProgress, catalog) >= achievement.threshold;
    }

    return false;
  }).map((achievement) => achievement.id);

  updatedUser.achievements = [...updatedUser.achievements, ...unlockedAchievements];

  return {
    user: updatedUser,
    progress: updatedProgress,
    unlockedAchievements
  };
}

export function countCompletedModules(courseId, progress, catalog) {
  const course = getCourseById(courseId, catalog);

  if (!course) {
    return 0;
  }

  return course.modules.filter((module) =>
    module.lessons.every((lesson) => progress.completedLessonIds.includes(lesson.id))
  ).length;
}

export function calculateCourseProgress(courseId, progress, catalog) {
  const lessons = listAllLessons(courseId, catalog);
  const total = lessons.length;
  const completed = lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;

  return {
    totalLessons: total,
    completedLessons: completed,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
  };
}

export function calculateModuleProgress(courseId, progress, catalog) {
  const course = getCourseById(courseId, catalog);

  if (!course) {
    return [];
  }

  return course.modules.map((module) => {
    const total = module.lessons.length;
    const completed = module.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;

    return {
      moduleId: module.id,
      title: module.title,
      totalLessons: total,
      completedLessons: completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  });
}

export function buildReviewSuggestions(progress) {
  // A revisao adaptativa prioriza exercicios com maior taxa de erro.
  return Object.entries(progress.errorLog)
    .map(([exerciseId, stats]) => ({
      exerciseId,
      attempts: stats.attempts,
      errors: stats.errors,
      errorRate: stats.attempts === 0 ? 0 : Number((stats.errors / stats.attempts).toFixed(2)),
      reviewTags: stats.reviewTags
    }))
    .filter((item) => item.errors > 0)
    .sort((left, right) => right.errorRate - left.errorRate);
}

export function buildAdaptiveReviewSession(courseId, progress, catalog) {
  const weakestTopics = buildReviewSuggestions(progress).slice(0, 3);
  const lessons = listAllLessons(courseId, catalog);

  return weakestTopics.flatMap((topic) =>
    lessons.flatMap((lesson) =>
      lesson.exercises.filter((exercise) =>
        lesson.reviewTags.some((tag) => topic.reviewTags.includes(tag))
      )
    )
  ).slice(0, 6);
}

function aggregateCourseCompletion(progressList, catalog) {
  const grouped = new Map();

  for (const progress of progressList) {
    const current = grouped.get(progress.courseId) ?? {
      courseId: progress.courseId,
      totalLessons: 0,
      completedLessons: 0
    };
    const progressSnapshot = calculateCourseProgress(progress.courseId, progress, catalog);
    current.totalLessons += progressSnapshot.totalLessons;
    current.completedLessons += progressSnapshot.completedLessons;
    grouped.set(progress.courseId, current);
  }

  return [...grouped.values()].map((entry) => ({
    ...entry,
    percentage: entry.totalLessons === 0 ? 0 : Math.round((entry.completedLessons / entry.totalLessons) * 100)
  }));
}

function aggregateExerciseAccuracy(progressList) {
  const exerciseStats = new Map();

  for (const progress of progressList) {
    for (const [exerciseId, stats] of Object.entries(progress.errorLog ?? {})) {
      const current = exerciseStats.get(exerciseId) ?? {
        exerciseId,
        attempts: 0,
        errors: 0,
        reviewTags: stats.reviewTags ?? []
      };
      current.attempts += stats.attempts;
      current.errors += stats.errors;
      exerciseStats.set(exerciseId, current);
    }
  }

  const perExercise = [...exerciseStats.values()].map((entry) => ({
    ...entry,
    accuracyRate: entry.attempts === 0 ? 0 : Number((((entry.attempts - entry.errors) / entry.attempts) * 100).toFixed(2))
  }));

  const totals = perExercise.reduce((accumulator, entry) => {
    accumulator.attempts += entry.attempts;
    accumulator.errors += entry.errors;
    return accumulator;
  }, { attempts: 0, errors: 0 });

  return {
    overallAccuracyRate: totals.attempts === 0
      ? 100
      : Number((((totals.attempts - totals.errors) / totals.attempts) * 100).toFixed(2)),
    perExercise: perExercise.sort((left, right) => left.accuracyRate - right.accuracyRate).slice(0, 10)
  };
}

function calculateModuleCompletionRate(progressList, catalog) {
  const moduleSnapshots = progressList.flatMap((progress) => calculateModuleProgress(progress.courseId, progress, catalog));

  if (moduleSnapshots.length === 0) {
    return 0;
  }

  const completedModules = moduleSnapshots.filter((module) => module.completedLessons === module.totalLessons).length;
  return Number(((completedModules / moduleSnapshots.length) * 100).toFixed(2));
}

function collectUserActivityDates(user, progressList, studySessions) {
  const dates = new Set();

  for (const progress of progressList.filter((item) => item.userId === user.id)) {
    for (const lesson of progress.lessonHistory) {
      dates.add(toUtcDateKey(lesson.completedAt));
    }
  }

  for (const session of studySessions.filter((item) => item.userId === user.id)) {
    dates.add(toUtcDateKey(session.submittedAt ?? session.startedAt));
  }

  if (user.lastStudyDate) {
    dates.add(toUtcDateKey(user.lastStudyDate));
  }

  return dates;
}

function calculateRetention(users, progressList, studySessions, days) {
  if (users.length === 0) {
    return 0;
  }

  const retainedUsers = users.filter((user) => {
    const targetDate = new Date(user.createdAt);
    targetDate.setUTCDate(targetDate.getUTCDate() + days);
    const activityDates = collectUserActivityDates(user, progressList, studySessions);
    return activityDates.has(toUtcDateKey(targetDate));
  }).length;

  return Number(((retainedUsers / users.length) * 100).toFixed(2));
}

function calculateAverageDailyUseMinutes(studySessions) {
  if (studySessions.length === 0) {
    return 0;
  }

  const sessionsByDay = new Map();

  for (const session of studySessions) {
    const key = `${session.userId}:${toUtcDateKey(session.submittedAt ?? session.startedAt)}`;
    sessionsByDay.set(key, (sessionsByDay.get(key) ?? 0) + (session.durationSeconds ?? 0));
  }

  if (sessionsByDay.size === 0) {
    return 0;
  }

  const totalSeconds = [...sessionsByDay.values()].reduce((sum, value) => sum + value, 0);
  return Number(((totalSeconds / 60) / sessionsByDay.size).toFixed(2));
}

export function buildUsageReport(users, progressList, catalog, studySessions = []) {
  // KPIs consumidos pelo painel administrativo.
  const normalizedUsers = users.map((user) => hydrateUserState(user));
  const today = toUtcDateKey(new Date().toISOString());
  const totalUsers = normalizedUsers.length;
  const activeToday = normalizedUsers.filter((user) => user.lastStudyDate && toUtcDateKey(user.lastStudyDate) === today).length;
  const averageLessonsPerUser = totalUsers === 0
    ? 0
    : Number((progressList.reduce((sum, progress) => sum + progress.lessonHistory.length, 0) / totalUsers).toFixed(2));
  const averageAccuracy = progressList.flatMap((progress) => progress.lessonHistory).length === 0
    ? 0
    : Number((
      progressList
        .flatMap((progress) => progress.lessonHistory)
        .reduce((sum, lesson) => sum + lesson.accuracyRate, 0) /
      progressList.flatMap((progress) => progress.lessonHistory).length
    * 100).toFixed(2));
  const exerciseAccuracy = aggregateExerciseAccuracy(progressList);

  return {
    totalUsers,
    activeToday,
    averageLessonsPerUser,
    averageStreak: totalUsers === 0
      ? 0
      : Number((normalizedUsers.reduce((sum, user) => sum + user.streak, 0) / totalUsers).toFixed(2)),
    streakMaintenanceRate: totalUsers === 0
      ? 0
      : Number(((normalizedUsers.filter((user) => user.streak > 0).length / totalUsers) * 100).toFixed(2)),
    averageDailyUseMinutes: calculateAverageDailyUseMinutes(studySessions),
    averageAccuracy,
    moduleCompletionRate: calculateModuleCompletionRate(progressList, catalog),
    retention: {
      d1: calculateRetention(normalizedUsers, progressList, studySessions, 1),
      d7: calculateRetention(normalizedUsers, progressList, studySessions, 7),
      d30: calculateRetention(normalizedUsers, progressList, studySessions, 30)
    },
    exerciseAccuracy,
    courseCompletion: aggregateCourseCompletion(progressList, catalog)
  };
}
