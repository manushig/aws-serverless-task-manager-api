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
