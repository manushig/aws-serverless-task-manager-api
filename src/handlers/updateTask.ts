// src/handlers/updateTask.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { Task } from "../models/Task";
import { handleError, ValidationError } from "../utils/errorHandling";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const updateTask: APIGatewayProxyHandler = async (event) => {
  try {
    const taskId = event.pathParameters?.id;
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    const requestBody = JSON.parse(event.body || "{}");
    const updates: Partial<Task> = {};

    if (requestBody.title !== undefined) {
      if (typeof requestBody.title !== "string" || requestBody.title.trim().length === 0) {
        throw new ValidationError("Title must be a non-empty string");
      }
      updates.title = requestBody.title.trim();
    }

    if (requestBody.description !== undefined) {
      if (typeof requestBody.description !== "string") {
        throw new ValidationError("Description must be a string");
      }
      updates.description = requestBody.description.trim();
    }

    if (requestBody.status !== undefined) {
      if (!["pending", "in_progress", "completed"].includes(requestBody.status)) {
        throw new ValidationError("Invalid status value");
      }
      updates.status = requestBody.status;
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError("No valid updates provided");
    }

    await dynamoDBService.updateTask(taskId, updates);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task updated successfully" }),
    };
  } catch (error) {
    return handleError(error);
  }
};
