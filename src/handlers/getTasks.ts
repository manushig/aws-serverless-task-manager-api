// src/handlers/getTasks.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBService } from "../services/dynamoDBService";
import { handleError } from "../utils/errorHandling";
import { authenticate } from "../middleware/auth";

const dynamoDBService = new DynamoDBService(process.env.TASKS_TABLE || "");
const DEFAULT_LIMIT = parseInt(process.env.DEFAULT_PAGINATION_LIMIT || "20", 10);
export const getTasks: APIGatewayProxyHandler = async (event) => {
  try {
    // Call the authenticate middleware
    await authenticate(event);

    // Parse query string parameters, using the DEFAULT_LIMIT if not provided
    const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit, 10) : DEFAULT_LIMIT;

    const nextToken = event.queryStringParameters?.nextToken;

    // Validate the limit
    if (isNaN(limit) || limit <= 0) {
      throw new Error("Invalid limit parameter");
    }

    // If authentication passes, proceed with fetching tasks
    const { tasks, nextToken: newNextToken } = await dynamoDBService.getAllTasks(limit, nextToken);

    return {
      statusCode: 200,
      body: JSON.stringify({
        tasks,
        nextToken: newNextToken,
      }),
    };
  } catch (error) {
    const response = handleError(error);
    console.error("Error in getTasks:", error);
    return response;
  }
};
