import crypto from "node:crypto";
import { COURSES } from "@duolingo-tech/shared";
import { readDb, updateDb } from "./store.js";

function cloneCoursesFromShared() {
  return structuredClone(COURSES);
}

function stampArchive(entity) {
  entity.archivedAt = entity.archivedAt ?? new Date().toISOString();
}

async function ensureCatalog() {
  return updateDb((draft) => {
    if (!draft.catalog) {
      draft.catalog = cloneCoursesFromShared();
    }

    return draft;
  });
}

export async function listAdminCourses() {
  const db = await ensureCatalog();
  return db.catalog;
}

export async function createCourse(payload) {
  const db = await ensureCatalog();
  const course = {
    id: payload.id ?? crypto.randomUUID(),
    name: payload.name,
    description: payload.description,
    color: payload.color ?? "#2563eb",
    archivedAt: null,
    modules: []
  };

  db.catalog.push(course);
  await updateDb(() => db);
  return course;
}

export async function updateCourse(courseId, payload) {
  const db = await ensureCatalog();
  const course = db.catalog.find((item) => item.id === courseId);

  if (!course) {
    throw new Error("Curso nao encontrado.");
  }

  Object.assign(course, payload);
  await updateDb(() => db);
  return course;
}

export async function deleteCourse(courseId) {
  const db = await ensureCatalog();
  const course = db.catalog.find((item) => item.id === courseId);

  if (!course) {
    throw new Error("Curso nao encontrado.");
  }

  stampArchive(course);
  await updateDb(() => db);
  return { success: true, archived: true };
}

export async function createModule(payload) {
  const db = await ensureCatalog();
  const course = db.catalog.find((item) => item.id === payload.courseId);

  if (!course) {
    throw new Error("Curso nao encontrado.");
  }

  const module = {
    id: payload.id ?? crypto.randomUUID(),
    title: payload.title,
    order: payload.order ?? course.modules.length + 1,
    archivedAt: null,
    lessons: []
  };

  course.modules.push(module);
  await updateDb(() => db);
  return module;
}

export async function updateModule(moduleId, payload) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    const module = course.modules.find((item) => item.id === moduleId);

    if (module) {
      Object.assign(module, payload);
      await updateDb(() => db);
      return module;
    }
  }

  throw new Error("Modulo nao encontrado.");
}

export async function deleteModule(moduleId) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    const module = course.modules.find((item) => item.id === moduleId);

    if (module) {
      stampArchive(module);
      await updateDb(() => db);
      return { success: true, archived: true };
    }
  }

  throw new Error("Modulo nao encontrado.");
}

export async function createLesson(payload) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    const module = course.modules.find((item) => item.id === payload.moduleId);

    if (module) {
      const lesson = {
        id: payload.id ?? crypto.randomUUID(),
        title: payload.title,
        order: payload.order ?? module.lessons.length + 1,
        minCorrectAnswers: payload.minCorrectAnswers ?? 1,
        xpReward: payload.xpReward ?? 40,
        explanation: payload.explanation ?? "",
        reviewTags: payload.reviewTags ?? [],
        archivedAt: null,
        exercises: []
      };

      module.lessons.push(lesson);
      await updateDb(() => db);
      return lesson;
    }
  }

  throw new Error("Modulo nao encontrado.");
}

export async function updateLesson(lessonId, payload) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((item) => item.id === lessonId);

      if (lesson) {
        Object.assign(lesson, payload);
        await updateDb(() => db);
        return lesson;
      }
    }
  }

  throw new Error("Licao nao encontrada.");
}

export async function deleteLesson(lessonId) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((item) => item.id === lessonId);

      if (lesson) {
        stampArchive(lesson);
        await updateDb(() => db);
        return { success: true, archived: true };
      }
    }
  }

  throw new Error("Licao nao encontrada.");
}

export async function createExercise(payload) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    for (const module of course.modules) {
      const lesson = module.lessons.find((item) => item.id === payload.lessonId);

      if (lesson) {
        const exercise = {
          id: payload.id ?? crypto.randomUUID(),
          type: payload.type,
          prompt: payload.prompt,
          options: payload.options ?? [],
          correctAnswer: payload.correctAnswer,
          explanation: payload.explanation ?? "",
          snippet: payload.snippet ?? "",
          archivedAt: null
        };

        lesson.exercises.push(exercise);
        await updateDb(() => db);
        return exercise;
      }
    }
  }

  throw new Error("Licao nao encontrada.");
}

export async function updateExercise(exerciseId, payload) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const exercise = lesson.exercises.find((item) => item.id === exerciseId);

        if (exercise) {
          Object.assign(exercise, payload);
          await updateDb(() => db);
          return exercise;
        }
      }
    }
  }

  throw new Error("Exercicio nao encontrado.");
}

export async function deleteExercise(exerciseId) {
  const db = await ensureCatalog();

  for (const course of db.catalog) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const exercise = lesson.exercises.find((item) => item.id === exerciseId);

        if (exercise) {
          stampArchive(exercise);
          await updateDb(() => db);
          return { success: true, archived: true };
        }
      }
    }
  }

  throw new Error("Exercicio nao encontrado.");
}
