import express from "express";
import {
  createRecoveryRequest,
  loginUser,
  registerUser,
  resetPassword,
  updateProfile
} from "../services/authService.js";
import { requireAuth } from "../middleware.js";
import { sendError, sendSuccess } from "../utils/http.js";

export const authRouter = express.Router();

authRouter.post("/register", async (request, response) => {
  try {
    const result = await registerUser(request.body);
    sendSuccess(response, result, 201);
  } catch (error) {
    sendError(response, error);
  }
});

authRouter.post("/login", async (request, response) => {
  try {
    const result = await loginUser(request.body);
    sendSuccess(response, result);
  } catch (error) {
    sendError(response, error, 401);
  }
});

authRouter.post("/forgot-password", async (request, response) => {
  try {
    const result = await createRecoveryRequest(request.body);
    sendSuccess(response, result);
  } catch (error) {
    sendError(response, error);
  }
});

authRouter.post("/reset-password", async (request, response) => {
  try {
    const result = await resetPassword(request.body);
    sendSuccess(response, result);
  } catch (error) {
    sendError(response, error);
  }
});

authRouter.put("/profile", requireAuth, async (request, response) => {
  try {
    const result = await updateProfile(request.user.id, request.body);
    sendSuccess(response, result);
  } catch (error) {
    sendError(response, error);
  }
});
