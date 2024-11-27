// src/middleware/auth.ts

import { APIGatewayProxyEvent } from "aws-lambda";
import { verifyToken } from "../utils/jwt";
import { ValidationError } from "../utils/errorHandling";

export async function authenticate(event: APIGatewayProxyEvent): Promise<void> {
  const authHeader = event.headers.Authorization || event.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Invalid or missing Authorization header:", authHeader);
    throw new ValidationError("Authorization header is missing or invalid");
  }

  const token = authHeader.split(" ")[1];

  const isValid = verifyToken(token);

  if (!isValid) {
    console.error("Token validation failed");
    throw new ValidationError("Invalid token");
  }

  console.log("Authentication successful");
}
