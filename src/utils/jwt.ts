// src/utils/jwt.ts

import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "fallback-secret-key-for-development";

export function generateToken(payload: object, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token: string): string | JwtPayload | null {
  console.log("Verifying token with SECRET_KEY:", SECRET_KEY);
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token verified successfully. Decoded payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
