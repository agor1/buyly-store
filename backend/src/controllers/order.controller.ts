import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getMyOrders,
} from "../services/orders.service.js";
import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest.js";

// Get all orders controller
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await getOrders();
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

    const { items, shippingAddress } = req.body;
    const order = await createOrder({
      userId: req.userId,
      shippingAddress,
      items,
    });

    res.status(201).json(order);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to update order status" });
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
