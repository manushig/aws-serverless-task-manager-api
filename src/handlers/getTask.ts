// src/handlers/getTask.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { handleError, ValidationError, NotFoundError } from "../utils/errorHandling";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const getTask: APIGatewayProxyHandler = async (event) => {
  try {
    const taskId = event.pathParameters?.id;
    if (!taskId) {
      throw new ValidationError("Task ID is required");
    }

    const task = await dynamoDBService.getTask(taskId);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(task),
    };
  } catch (error) {
    return handleError(error);
  }
};