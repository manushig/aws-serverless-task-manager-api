// scripts/generateToken.ts

import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import { generateToken } from "../src/utils/jwt";

console.log("Environment variables loaded. JWT_SECRET:", process.env.JWT_SECRET);

const payload = {
  user_id: "123",
  role: "admin",
};

const token = generateToken(payload);
console.log("Generated token:", token);
