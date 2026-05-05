import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "duolingo-tech-secret";

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function comparePassword(password, passwordHash) {
  return hashPassword(password) === passwordHash;
}

export function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

