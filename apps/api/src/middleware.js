import { sendError } from "./utils/http.js";
import { verifyToken } from "./utils/security.js";
import { findUserById } from "./services/authService.js";

export async function requireAuth(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new Error("Token nao informado.");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = verifyToken(token);
    const user = await findUserById(payload.sub);

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    request.user = user;
    next();
  } catch (error) {
    sendError(response, error, 401);
  }
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== "admin") {
    return sendError(response, new Error("Acesso restrito ao administrador."), 403);
  }

  next();
}

