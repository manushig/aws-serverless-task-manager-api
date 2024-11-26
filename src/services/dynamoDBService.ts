// src/services/dynamoDBService.ts

import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Task } from "../models/Task";
import { ValidationError, NotFoundError } from "../utils/errorHandling";

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

export class DynamoDBService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async createTask(task: Task): Promise<void> {
    if (!task.id || !task.title || !task.status) {
      throw new ValidationError("Invalid task data");
    }

    const params = {
      TableName: this.tableName,
      Item: {
        id: { S: task.id },
        title: { S: task.title },
        description: { S: task.description || "" },
        status: { S: task.status },
      },
      ConditionExpression: "attribute_not_exists(id)",
    };

    try {
      await dynamoDbClient.send(new PutItemCommand(params));
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new ValidationError(`Task with ID ${task.id} already exists`);
      }
      throw error;
    }
  }

  async getTask(id: string): Promise<Task | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    };

    try {
      const result = await dynamoDbClient.send(new GetItemCommand(params));
      if (result.Item) {
        return {
          id: result.Item.id.S || "",
          title: result.Item.title.S || "",
          description: result.Item.description.S || "",
          status: result.Item.status.S || "",
        };
      }
      return null;
    } catch (error) {
      throw new Error("Error fetching task from the database");
    }
  }

  async getAllTasks(): Promise<Task[]> {
    const params = { TableName: this.tableName };

    try {
      const result = await dynamoDbClient.send(new ScanCommand(params));
      return result.Items
        ? result.Items.map((item) => ({
            id: item.id.S || "",
            title: item.title.S || "",
            description: item.description.S || "",
            status: item.status.S || "",
          }))
        : [];
    } catch (error) {
      throw new Error("Error fetching tasks from the database");
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    if (Object.keys(updates).length === 0) {
      throw new ValidationError("No updates provided");
    }

    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value], index) => {
      if (value !== undefined) {
        const placeholder = `#attr${index}`;
        const valuePlaceholder = `:value${index}`;
        updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
        expressionAttributeNames[placeholder] = key;
        expressionAttributeValues[valuePlaceholder] = { S: value as string };
      }
    });

    if (updateExpressions.length === 0) {
      throw new ValidationError("No valid updates provided");
    }

    const updateExpression = "SET " + updateExpressions.join(", ");

    const params = {
      TableName: this.tableName,
      Key: { id: { S: taskId } },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: "attribute_exists(id)",
    };

    try {
      await dynamoDbClient.send(new UpdateItemCommand(params));
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new NotFoundError(`Task with ID ${taskId} not found`);
      }
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: { S: id } },
      ConditionExpression: "attribute_exists(id)",
    };

    try {
      await dynamoDbClient.send(new DeleteItemCommand(params));
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new NotFoundError(`Task with ID ${id} not found`);
      }
      throw new Error("Error deleting task from the database");
    }
  }
}
