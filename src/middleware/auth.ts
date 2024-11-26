// src/middleware/auth.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { verifyToken } from "../utils/jwt";
import { handleError, ValidationError } from "../utils/errorHandling";

export async function authenticate(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult | null> {
  const authHeader = event.headers.Authorization || event.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ValidationError("Authorization header is missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new ValidationError("Invalid token");
  }

  // Attach user info to event if needed
  // event.requestContext.authorizer = decoded;

  return null; // Continue processing if authenticated
}
