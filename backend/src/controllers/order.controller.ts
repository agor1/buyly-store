import {
  getOrders,
  createOrder,
  updateOrderStatus,
  getMyOrders,
} from "../services/orders.service";
import { Request, Response } from "express";

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

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
export const createNewOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items } = req.body;
    const shippingAddress = req.body.shippingAddress;
    const order = await createOrder({ userId, shippingAddress, items });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Update order status controller
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const updatedOrder = await updateOrderStatus(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Get my orders controller
export const getUserOrders = async (req: OrderRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orders = await getMyOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
};
