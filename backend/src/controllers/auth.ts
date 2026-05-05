import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: req.body.name || email.split("@")[0],
        password_hash: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      (process.env.JWT_SECRET as string) || "default-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN } as any,
    );

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      (process.env.JWT_SECRET as string) || "default-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN } as any,
    );

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
