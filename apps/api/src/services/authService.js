import crypto from "node:crypto";
import {
  createInitialUserProfile,
  hydrateUserState,
  normalizeUserRecord
} from "@duolingo-tech/shared";
import { readDb, updateDb } from "./store.js";
import { comparePassword, createToken, hashPassword } from "../utils/security.js";

export async function registerUser({ name, email, password, role = "student" }) {
  // Emails sao normalizados para impedir contas duplicadas por maiusculas/espacos.
  const normalizedEmail = email.trim().toLowerCase();
  const db = await readDb();
  const existing = db.users.find((user) => user.email === normalizedEmail);

  if (existing) {
    throw new Error("Este email ja esta cadastrado.");
  }

  const user = createInitialUserProfile({
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    role
  });

  await updateDb((draft) => {
    draft.users.push(user);
    return draft;
  });

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await readDb();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user || !comparePassword(password, user.passwordHash)) {
    throw new Error("Credenciais invalidas.");
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
}

export async function createRecoveryRequest({ email }) {
  const normalizedEmail = email.trim().toLowerCase();
  const db = await readDb();
  const user = db.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    throw new Error("Nao existe conta cadastrada com este email.");
  }

  const recoveryToken = crypto.randomUUID();

  // Em ambiente academico o token retorna na resposta; em producao seria enviado por email.
  await updateDb((draft) => {
    draft.recoveryRequests.push({
      id: crypto.randomUUID(),
      email: normalizedEmail,
      token: recoveryToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
      usedAt: null
    });
    return draft;
  });

  return {
    message: "Solicitacao registrada. Use o token exibido em ambiente academico para redefinir a senha.",
    recoveryToken
  };
}

export async function resetPassword({ token, password }) {
  await updateDb((draft) => {
    const recovery = draft.recoveryRequests.find((item) => item.token === token);

    if (!recovery) {
      throw new Error("Token de recuperacao invalido.");
    }

    if (recovery.usedAt) {
      throw new Error("Este token ja foi utilizado.");
    }

    if (new Date(recovery.expiresAt) < new Date()) {
      throw new Error("Este token expirou.");
    }

    const user = draft.users.find((item) => item.email === recovery.email);

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    user.passwordHash = hashPassword(password);
    recovery.usedAt = new Date().toISOString();
    return draft;
  });

  return {
    message: "Senha redefinida com sucesso."
  };
}

export async function updateProfile(userId, payload) {
  const db = await updateDb((draft) => {
    const user = draft.users.find((item) => item.id === userId);

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    if (payload.name) {
      user.name = payload.name;
    }

    if (payload.password) {
      user.passwordHash = hashPassword(payload.password);
    }

    if (typeof payload.rankingOptIn === "boolean") {
      user.rankingOptIn = payload.rankingOptIn;
    }

    return draft;
  });

  const user = db.users.find((item) => item.id === userId);
  return sanitizeUser(user);
}

export async function syncUserStats(userId, payload) {
  const db = await updateDb((draft) => {
    const user = draft.users.find((item) => item.id === userId);

    if (!user) {
      throw new Error("Usuario nao encontrado.");
    }

    const xp = Number(payload.xp);
    const level = Number(payload.level);
    const streak = Number(payload.streak);

    // A API aceita apenas numeros validos para impedir progresso corrompido.
    if (Number.isFinite(xp) && xp >= 0) {
      user.xp = Math.floor(xp);
    }

    if (Number.isFinite(level) && level >= 1) {
      user.level = Math.floor(level);
    }

    if (Number.isFinite(streak) && streak >= 0) {
      user.streak = Math.floor(streak);
    }

    if (payload.lastStudyDate) {
      user.lastStudyDate = payload.lastStudyDate;
    }

    if (typeof payload.rankingOptIn === "boolean") {
      user.rankingOptIn = payload.rankingOptIn;
    }

    return draft;
  });

  const user = db.users.find((item) => item.id === userId);
  return sanitizeUser(user);
}

export async function findUserById(userId) {
  const db = await readDb();
  const user = db.users.find((item) => item.id === userId) ?? null;
  return user ? normalizeUserRecord(user) : null;
}

export function sanitizeUser(user) {
  // Nunca devolve o hash da senha para o mobile/admin.
  const { passwordHash, ...safeUser } = user;
  return hydrateUserState(safeUser);
}
