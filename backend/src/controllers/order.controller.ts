import { Request, Response } from "express";
import {
  createOrder,
  deleteOrder,
  getMyOrderDetails,
  getMyOrders,
  getOrderDetails,
  getOrders,
  updateOrderStatus,
} from "../services/orders.service.js";
import { BadRequestError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";
import { requireUserId } from "../utils/auth.utils.js";

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const search = typeof req.query.search === "string" ? req.query.search : "";
  const orders = await getOrders({
    page,
    limit,
    search: search.trim() || undefined,
  });

  res.status(200).json(orders);
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Order ID is required");
  }

  const order = await getOrderDetails(id);

  res.status(200).json(order);
};

export const createNewOrder = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { items, shippingAddress, shippingType, paymentType } = req.body;
  const order = await createOrder({
    userId,
    shippingAddress,
    shippingType,
    paymentType,
    items,
  });

  res.status(201).json(order);
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    throw new BadRequestError("Order ID is required");
  }

  const updatedOrder = await updateOrderStatus(id, status);
  res.status(200).json(updatedOrder);
};

export const removeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Order ID is required");
  }

  await deleteOrder(id);

  res.status(204).send();
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const orders = await getMyOrders(userId);

  res.status(200).json(orders);
};

export const getUserOrder = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Order ID is required");
  }

  const order = await getMyOrderDetails(userId, id);

  res.status(200).json(order);
};
