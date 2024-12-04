import * as AWS from "aws-sdk";

const region = process.env.CUSTOM_REGION;
const cloudWatchLogs = new AWS.CloudWatchLogs({ region });

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export function handleError(error: unknown): { statusCode: number; body: string } {
  console.error("Error:", error);

  // Log the error to CloudWatch Logs
  const logGroupName = `/aws/lambda/${process.env.AWS_LAMBDA_FUNCTION_NAME}`;
  const logStreamName = "error-stream";
  const logEvent = {
    logGroupName,
    logStreamName,
    logEvents: [
      {
        timestamp: new Date().getTime(),
        message: JSON.stringify(error),
      },
    ],
  };

  cloudWatchLogs.createLogStream({ logGroupName, logStreamName }, (err, data) => {
    if (err) console.error("Error creating log stream:", err);
    else {
      cloudWatchLogs.putLogEvents(logEvent, (err, data) => {
        if (err) console.error("Error putting log events:", err);
      });
    }
  });

  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: error.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ message: "Internal server error" }),
  };
}
