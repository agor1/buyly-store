import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import routes from "./src/routes/index.js";

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ status: "ok", userCount: count });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
