import type { SignOptions } from "jsonwebtoken";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"],
};
