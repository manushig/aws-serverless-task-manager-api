// src/handlers/subscribeToSNS.ts

import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";

const sns = new AWS.SNS();

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing request body" }),
    };
  }

  const { email } = JSON.parse(event.body);

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email is required" }),
    };
  }

  const params: AWS.SNS.SubscribeInput = {
    Protocol: "email",
    TopicArn: process.env.SNS_TOPIC_ARN || "",
    Endpoint: email,
  };

  try {
    const result = await sns.subscribe(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscription request sent", subscriptionArn: result.SubscriptionArn }),
    };
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error subscribing to topic", error: (error as Error).message }),
    };
  }
};
