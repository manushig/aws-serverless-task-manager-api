// src/handlers/getTasks.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { handleError } from "../utils/errorHandling";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");

export const getTasks: APIGatewayProxyHandler = async () => {
  try {
    const tasks = await dynamoDBService.getAllTasks();
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    return handleError(error);
  }
};
