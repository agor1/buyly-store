import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/app-error.js";
import { sendPasswordResetRequestEmail } from "./mail.service.js";

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

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

const currentUserSelect = {
  id: true,
  email: true,
  name: true,
  avatar_url: true,
  role: true,
  created_at: true,
} as const;

const PASSWORD_RESET_TOKEN_EXPIRES_IN_MS = 60 * 60 * 1000;

const hashPasswordResetToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const getPasswordResetUrl = (token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
};

// Register service
export const registerUser = async (data: RegisterData) => {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new BadRequestError("Nie udało się utworzyć konta z podanymi danymi.");
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
    select: currentUserSelect,
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
      throw new BadRequestError("Obecne hasło jest nieprawidłowe");
    }

    updateData.password_hash = await bcrypt.hash(data.newPassword, 10);
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: currentUserSelect,
  });
};

export const updateCurrentUserAvatar = async (
  userId: string,
  avatarUrl: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { avatar_url: avatarUrl },
    select: currentUserSelect,
  });
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return;
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRES_IN_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: {
        user_id: user.id,
        used_at: null,
      },
    }),
    prisma.passwordResetToken.create({
      data: {
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      },
    }),
  ]);

  try {
    await sendPasswordResetRequestEmail({
      email: user.email,
      name: user.name,
      resetUrl: getPasswordResetUrl(token),
    });
  } catch (error) {
    console.error("Failed to send password reset request email", error);
  }
};

export const resetPassword = async ({
  token,
  newPassword,
}: ResetPasswordData) => {
  const tokenHash = hashPasswordResetToken(token);
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token_hash: tokenHash,
      used_at: null,
      expires_at: {
        gt: new Date(),
      },
    },
  });

  if (!resetToken) {
    throw new BadRequestError("Token resetu hasła jest nieprawidłowy lub wygasł.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const usedAt = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.user_id },
      data: { password_hash: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used_at: usedAt },
    }),
    prisma.passwordResetToken.deleteMany({
      where: {
        user_id: resetToken.user_id,
        used_at: null,
      },
    }),
  ]);
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
