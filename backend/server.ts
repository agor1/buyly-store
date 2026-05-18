import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./src/lib/prisma.js";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import ordersRoutes from "./src/routes/order.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import { authMiddleware } from "./src/middleware/auth.middleware.js";
import cookieParser from "cookie-parser";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/error.middleware.js";

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api", authMiddleware, roleMiddleware(["CUSTOMER", "ADMIN"]), routes);

// Health check
app.get("/health", authMiddleware, async (req: Request, res: Response) => {
  const count = await prisma.user.count();
  res.json({ status: "ok", userCount: count });
});

// Routes
app.use("/api/auth", authMiddleware, authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", authMiddleware, cartRoutes);
app.use("/api/orders", authMiddleware, ordersRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
