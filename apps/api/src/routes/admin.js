import express from "express";
import { requireAdmin, requireAuth } from "../middleware.js";
import {
  createCourse,
  createExercise,
  createLesson,
  createModule,
  deleteCourse,
  deleteExercise,
  deleteLesson,
  deleteModule,
  listAdminCourses,
  updateCourse,
  updateExercise,
  updateLesson,
  updateModule
} from "../services/adminService.js";
import { getUsageReport } from "../services/reportService.js";
import { sendError, sendSuccess } from "../utils/http.js";

export const adminRouter = express.Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/courses", async (_request, response) => {
  try {
    sendSuccess(response, await listAdminCourses());
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.post("/courses", async (request, response) => {
  try {
    sendSuccess(response, await createCourse(request.body), 201);
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.put("/courses/:courseId", async (request, response) => {
  try {
    sendSuccess(response, await updateCourse(request.params.courseId, request.body));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.delete("/courses/:courseId", async (request, response) => {
  try {
    sendSuccess(response, await deleteCourse(request.params.courseId));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.post("/modules", async (request, response) => {
  try {
    sendSuccess(response, await createModule(request.body), 201);
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.put("/modules/:moduleId", async (request, response) => {
  try {
    sendSuccess(response, await updateModule(request.params.moduleId, request.body));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.delete("/modules/:moduleId", async (request, response) => {
  try {
    sendSuccess(response, await deleteModule(request.params.moduleId));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.post("/lessons", async (request, response) => {
  try {
    sendSuccess(response, await createLesson(request.body), 201);
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.put("/lessons/:lessonId", async (request, response) => {
  try {
    sendSuccess(response, await updateLesson(request.params.lessonId, request.body));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.delete("/lessons/:lessonId", async (request, response) => {
  try {
    sendSuccess(response, await deleteLesson(request.params.lessonId));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.post("/exercises", async (request, response) => {
  try {
    sendSuccess(response, await createExercise(request.body), 201);
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.put("/exercises/:exerciseId", async (request, response) => {
  try {
    sendSuccess(response, await updateExercise(request.params.exerciseId, request.body));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.delete("/exercises/:exerciseId", async (request, response) => {
  try {
    sendSuccess(response, await deleteExercise(request.params.exerciseId));
  } catch (error) {
    sendError(response, error);
  }
});

adminRouter.get("/reports", async (_request, response) => {
  try {
    sendSuccess(response, await getUsageReport());
  } catch (error) {
    sendError(response, error);
  }
});

