// src/handlers/getTasks.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { handleError } from "../utils/errorHandling";
import { authenticate } from "../middleware/auth";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const getTasks: APIGatewayProxyHandler = async (event) => {
  try {
    // Call the authenticate middleware
    await authenticate(event);

    // If authentication passes, proceed with fetching tasks
    const tasks = await dynamoDBService.getAllTasks();
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    return handleError(error);
  }
};
