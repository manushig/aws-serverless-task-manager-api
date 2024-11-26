// src/utils/jwt.ts

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(payload: object, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
