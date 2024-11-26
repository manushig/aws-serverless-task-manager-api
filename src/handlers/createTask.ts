// src/handlers/createTask.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBService } from "../services/dynamoDBService";
import { Task } from "../models/Task";
import { handleError, ValidationError } from "../utils/errorHandling";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const createTask: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const requestBody = JSON.parse(event.body);

    if (!requestBody.title || typeof requestBody.title !== "string" || requestBody.title.trim().length === 0) {
      throw new ValidationError("Title is required and must be a non-empty string");
    }

    if (requestBody.description && typeof requestBody.description !== "string") {
      throw new ValidationError("Description must be a string");
    }

    const taskId = uuidv4();

    const newTask: Task = {
      id: taskId,
      title: requestBody.title.trim(),
      description: requestBody.description ? requestBody.description.trim() : "",
      status: "pending",
    };

    await dynamoDBService.createTask(newTask);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Task created successfully", taskId }),
    };
  } catch (error) {
    return handleError(error);
  }
};
