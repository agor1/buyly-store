import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import ordersRoutes from "./src/routes/order.routes.js";
import { authMiddleware } from "./src/middleware/auth.middleware.js";

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api", authMiddleware, roleMiddleware(["CUSTOMER", "ADMIN"]), routes);

// Health check
app.get("/health", authMiddleware, async (req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ status: "ok", userCount: count });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authMiddleware, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
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
