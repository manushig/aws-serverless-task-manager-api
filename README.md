# AWS Serverless Task Manager API

## Overview

This project implements a serverless task management API using AWS Lambda, API Gateway, and DynamoDB. It provides CRUD operations for tasks, with features like authentication, pagination, and rate limiting.

## Features

- Create, read, update, and delete tasks
- JWT-based authentication
- Pagination for listing tasks
- Rate limiting to prevent API abuse
- Error handling and logging

## Technologies Used

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- AWS CloudWatch
- AWS SNS (Simple Notification Service)
- Serverless Framework
- Node.js with TypeScript

## Getting Started

### Prerequisites

- AWS account
- Node.js and npm installed
- Serverless Framework CLI installed (`npm install -g serverless`)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/aws-serverless-task-manager-api.git
   cd aws-serverless-task-manager-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your AWS credentials:
   ```
   serverless config credentials --provider aws --key YOUR_AWS_KEY --secret YOUR_AWS_SECRET
   ```

### Deployment

Deploy the application to AWS:

```
serverless deploy
```

## API Endpoints

- POST /tasks - Create a new task
- GET /tasks - List tasks (with pagination)
- GET /tasks/{id} - Get a specific task
- PUT /tasks/{id} - Update a task
- DELETE /tasks/{id} - Delete a task

For detailed API documentation, refer to the Swagger documentation generated for the project.

## Configuration

Environment variables and other configurations can be found in the `serverless.yml` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

Manushi
