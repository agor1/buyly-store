import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors/app-error.js";

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateCurrentUserData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Register service
export const registerUser = async (data: RegisterData) => {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError("Email already in use");
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
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  return { user, token };
};

// Login service
export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  return { user, token };
};

// Get me service
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

// Update current user profile
export const updateCurrentUser = async (
  userId: string,
  data: UpdateCurrentUserData,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updateData: { name?: string; password_hash?: string } = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.newPassword) {
    const valid = await bcrypt.compare(
      data.currentPassword ?? "",
      user.password_hash,
    );

    if (!valid) {
      throw new BadRequestError("Current password is invalid");
    }

    updateData.password_hash = await bcrypt.hash(data.newPassword, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true,
    },
  });
};

// Change user role (only admin)
export const changeUserRole = async (
  userId: string,
  role: "ADMIN" | "CUSTOMER",
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return updatedUser;
};
