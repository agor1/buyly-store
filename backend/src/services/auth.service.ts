import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Register service
export const registerUser = async (data: RegisterData) => {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password_hash: hashedPassword,
      name: name || email.split("@")[0],
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    (process.env.JWT_SECRET as string) || "default-secret-key",
    { expiresIn: process.env.JWT_EXPIRES_IN } as any,
  );

  return { user, token };
};

// Login service
export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    (process.env.JWT_SECRET as string) || "default-secret-key",
    { expiresIn: process.env.JWT_EXPIRES_IN } as any,
  );

  return { user, token };
};

// Change user role (only admin)
export const changeUserRole = async (userId: string, role: "ADMIN" | "CUSTOMER") => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUser;
};
