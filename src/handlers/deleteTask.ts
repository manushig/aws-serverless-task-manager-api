// src/handlers/deleteTask.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { handleError, ValidationError, NotFoundError } from "../utils/errorHandling";
import { authenticate } from "../middleware/auth";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const deleteTask: APIGatewayProxyHandler = async (event) => {
  try {
    // Call the authenticate middleware
    await authenticate(event);

    // If authentication passes, proceed with task deletion
    const taskId = event.pathParameters?.id;
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    await dynamoDBService.deleteTask(taskId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task deleted successfully" }),
    };
  } catch (error) {
    return handleError(error);
  }
};
