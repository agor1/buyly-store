import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getMyOrders,
  deleteOrder,
} from "../services/orders.service.js";
import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest.js";

// Get all orders controller
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = typeof req.query.search === "string" ? req.query.search : "";

    const orders = await getOrders({
      page,
      limit,
      search: search.trim() || undefined,
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Create order controller
export const createNewOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { items, shippingAddress, shippingType, paymentType } = req.body;
    const order = await createOrder({
      userId: req.userId,
      shippingAddress,
      shippingType,
      paymentType,
      items,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return res
        .status(400)
        .json({ error: "Nie znaleziono produktu z koszyka." });
    }

    if (error instanceof Error && error.message === "PRODUCT_IS_NOT_ACTIVE") {
      return res.status(400).json({
        error: "Produkt nie jest juz dostepny.",
      });
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return res.status(400).json({
        error: "Brak wystarczającej ilości produktu w magazynie.",
      });
    }

    res.status(500).json({ error: "Failed to create order" });
  }
};

// Update order status controller
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const updatedOrder = await updateOrderStatus(id, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ error: "Order not found" });
    }

    if (error instanceof Error && error.message === "ORDER_ALREADY_CANCELLED") {
      return res.status(400).json({
        error: "Cancelled order cannot be reactivated.",
      });
    }

    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Delete order controller
export const removeOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    await deleteOrder(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(500).json({ error: "Failed to delete order" });
  }
};

// Get my orders controller
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orders = await getMyOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
};
