import express from "express";
import { requireAuth } from "../middleware.js";
import { syncUserStats } from "../services/authService.js";
import {
  createReviewSession,
  getDashboard,
  getHistory,
  getLesson,
  getNotificationSettings,
  getRanking,
  getReview,
  getTrack,
  listCourses,
  startCourse,
  submitLesson,
  updateNotificationSettings
} from "../services/courseService.js";
import { sendError, sendSuccess } from "../utils/http.js";

export const studentRouter = express.Router();

studentRouter.get("/courses", async (_request, response) => {
  try {
    const data = await listCourses();
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.post("/courses/:courseId/start", requireAuth, async (request, response) => {
  try {
    const data = await startCourse(request.user.id, request.params.courseId);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/courses/:courseId/track", requireAuth, async (request, response) => {
  try {
    const data = await getTrack(request.user.id, request.params.courseId);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/lessons/:lessonId", requireAuth, async (request, response) => {
  try {
    const data = await getLesson(request.user.id, request.params.lessonId);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.post("/lessons/:lessonId/submit", requireAuth, async (request, response) => {
  try {
    const data = await submitLesson(
      request.user.id,
      request.params.lessonId,
      request.body.answers ?? {},
      request.body.studyMeta ?? {}
    );
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/me/dashboard", requireAuth, async (request, response) => {
  try {
    const data = await getDashboard(request.user.id);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/me/history", requireAuth, async (request, response) => {
  try {
    const data = await getHistory(request.user.id);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/me/review/:courseId", requireAuth, async (request, response) => {
  try {
    const data = await getReview(request.user.id, request.params.courseId);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.post("/me/review/:courseId/session", requireAuth, async (request, response) => {
  try {
    const data = await createReviewSession(request.user.id, request.params.courseId);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/me/notifications", requireAuth, async (request, response) => {
  try {
    const data = await getNotificationSettings(request.user.id);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.put("/me/notifications", requireAuth, async (request, response) => {
  try {
    const data = await updateNotificationSettings(request.user.id, request.body);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.get("/ranking", requireAuth, async (_request, response) => {
  try {
    const data = await getRanking();
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});

studentRouter.put("/me/stats", requireAuth, async (request, response) => {
  try {
    const data = await syncUserStats(request.user.id, request.body);
    sendSuccess(response, data);
  } catch (error) {
    sendError(response, error);
  }
});
