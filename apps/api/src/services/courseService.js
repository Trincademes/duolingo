import crypto from "node:crypto";
import {
  ACHIEVEMENTS,
  COURSES,
  buildAdaptiveReviewSession,
  buildReviewSuggestions,
  buildTrack,
  calculateCourseProgress,
  calculateModuleProgress,
  createInitialCourseProgress,
  getCourseById,
  getLessonById,
  hydrateUserState,
  mergeLessonProgress,
  evaluateLessonSubmission
} from "@duolingo-tech/shared";
import { readDb, updateDb } from "./store.js";
import { sanitizeUser } from "./authService.js";

function getCatalog(db) {
  return db.catalog ?? COURSES;
}

function findProgress(db, userId, courseId) {
  return db.progress.find((item) => item.userId === userId && item.courseId === courseId) ?? null;
}

export async function listCourses() {
  const db = await readDb();
  return getCatalog(db)
    .filter((course) => !course.archivedAt)
    .map((course) => ({
    id: course.id,
    name: course.name,
    description: course.description,
    color: course.color,
    modulesCount: course.modules.length,
    lessonsCount: course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
    }));
}

export async function startCourse(userId, courseId) {
  const currentDb = await readDb();
  const catalog = getCatalog(currentDb);
  const course = getCourseById(courseId, catalog);

  if (!course || course.archivedAt) {
    throw new Error("Curso nao encontrado.");
  }

  const db = await updateDb((draft) => {
    const existing = findProgress(draft, userId, courseId);

    if (!existing) {
      draft.progress.push(createInitialCourseProgress(userId, courseId, getCatalog(draft)));
    }

    return draft;
  });

  const progress = findProgress(db, userId, courseId);

  return {
    progress,
    track: buildTrack(courseId, progress, getCatalog(db))
  };
}

export async function getTrack(userId, courseId) {
  const db = await readDb();
  const progress = findProgress(db, userId, courseId);

  if (!progress) {
    throw new Error("Curso ainda nao iniciado.");
  }

  return {
    track: buildTrack(courseId, progress, getCatalog(db)),
    progress: {
      course: calculateCourseProgress(courseId, progress, getCatalog(db)),
      modules: calculateModuleProgress(courseId, progress, getCatalog(db))
    }
  };
}

export async function getLesson(userId, lessonId) {
  const db = await readDb();
  const lesson = getLessonById(lessonId, getCatalog(db));

  if (!lesson) {
    throw new Error("Licao nao encontrada.");
  }

  const progress = findProgress(db, userId, lesson.courseId);

  if (!progress) {
    throw new Error("Inicie o curso antes de acessar a licao.");
  }

  const track = buildTrack(lesson.courseId, progress, getCatalog(db));
  const module = track.modules.find((item) => item.id === lesson.moduleId);
  const trackLesson = module.lessons.find((item) => item.id === lesson.id);

  if (!trackLesson.unlocked) {
    throw new Error("Esta licao ainda esta bloqueada.");
  }

  return lesson;
}

export async function submitLesson(userId, lessonId, answers, studyMeta = {}) {
  const db = await readDb();
  const catalog = getCatalog(db);
  const lesson = getLessonById(lessonId, catalog);

  if (!lesson) {
    throw new Error("Licao nao encontrada.");
  }

  const progress = findProgress(db, userId, lesson.courseId);
  const user = db.users.find((item) => item.id === userId);

  if (!progress || !user) {
    throw new Error("Usuario ou progresso nao encontrado.");
  }

  const submission = evaluateLessonSubmission(lesson, answers);
  const merged = mergeLessonProgress({
    user,
    progress,
    lesson,
    submission,
    catalog,
    studyDate: studyMeta.submittedAt ?? new Date().toISOString()
  });

  await updateDb((draft) => {
    const userIndex = draft.users.findIndex((item) => item.id === userId);
    const progressIndex = draft.progress.findIndex((item) => item.userId === userId && item.courseId === lesson.courseId);

    draft.users[userIndex] = merged.user;
    draft.progress[progressIndex] = merged.progress;

    draft.notificationsLog.push({
      id: crypto.randomUUID(),
      type: "lesson-completed",
      userId,
      message: submission.passed
        ? `Parabens! Voce concluiu ${lesson.title}.`
        : `Revise ${lesson.title} para tentar novamente.`,
      createdAt: new Date().toISOString()
    });

    if (!draft.studySessions) {
      draft.studySessions = [];
    }

    draft.studySessions.push({
      id: crypto.randomUUID(),
      userId,
      courseId: lesson.courseId,
      lessonId: lesson.id,
      startedAt: studyMeta.startedAt ?? new Date().toISOString(),
      submittedAt: studyMeta.submittedAt ?? new Date().toISOString(),
      durationSeconds: Number.isFinite(studyMeta.durationSeconds) ? studyMeta.durationSeconds : 0,
      passed: submission.passed,
      accuracyRate: submission.accuracyRate
    });

    return draft;
  });

  return {
    submission,
    unlockedAchievements: merged.unlockedAchievements.map((achievementId) =>
      ACHIEVEMENTS.find((achievement) => achievement.id === achievementId)
    ),
    updatedUser: sanitizeUser(merged.user),
    updatedProgress: {
      course: calculateCourseProgress(lesson.courseId, merged.progress, catalog),
      modules: calculateModuleProgress(lesson.courseId, merged.progress, catalog)
    }
  };
}

export async function getDashboard(userId) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  const userProgress = db.progress.filter((item) => item.userId === userId);

  return {
    user: sanitizeUser(user),
    courseProgress: userProgress.map((progress) => ({
      courseId: progress.courseId,
      ...calculateCourseProgress(progress.courseId, progress, getCatalog(db)),
      modules: calculateModuleProgress(progress.courseId, progress, getCatalog(db))
    })),
    achievements: ACHIEVEMENTS.filter((achievement) => user.achievements.includes(achievement.id))
  };
}

export async function getHistory(userId) {
  const db = await readDb();
  return db.progress
    .filter((item) => item.userId === userId)
    .flatMap((progress) => progress.lessonHistory.map((historyItem) => ({
      ...historyItem,
      courseId: progress.courseId
    })))
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt));
}

export async function getReview(userId, courseId) {
  const db = await readDb();
  const progress = findProgress(db, userId, courseId);

  if (!progress) {
    throw new Error("Curso ainda nao iniciado.");
  }

  return buildReviewSuggestions(progress);
}

export async function createReviewSession(userId, courseId) {
  const db = await readDb();
  const progress = findProgress(db, userId, courseId);

  if (!progress) {
    throw new Error("Curso ainda nao iniciado.");
  }

  return buildAdaptiveReviewSession(courseId, progress, getCatalog(db));
}

export async function getNotificationSettings(userId) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId);
  return user.notificationSettings;
}

export async function updateNotificationSettings(userId, settings) {
  const db = await updateDb((draft) => {
    const user = draft.users.find((item) => item.id === userId);

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    user.notificationSettings = {
      ...user.notificationSettings,
      ...settings
    };

    return draft;
  });

  const user = db.users.find((item) => item.id === userId);
  return user.notificationSettings;
}

export async function getRanking() {
  const db = await readDb();
  return db.users
    .map((user) => hydrateUserState(user))
    .filter((user) => user.role === "student" && user.rankingOptIn)
    .sort((left, right) => right.xp - left.xp)
    .slice(0, 10)
    .map((user) => ({
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak
    }));
}
