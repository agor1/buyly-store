import type { SignOptions } from "jsonwebtoken";

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const requiredMinLengthEnv = (name: string, minLength: number): string => {
  const value = requiredEnv(name);

  if (value.length < minLength) {
    throw new Error(
      `${name} must be at least ${minLength} characters long`,
    );
  }

  return value;
};

export const env = {
  JWT_SECRET: requiredMinLengthEnv("JWT_SECRET", 32),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ??
    "7d") as SignOptions["expiresIn"],
};
