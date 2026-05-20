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
import type { GetOrdersQuery } from "../schemas/order.schema.js";

export const getAllOrders = async (_req: Request, res: Response) => {
  const query = res.locals.query as GetOrdersQuery;
  const orders = await getOrders(query);

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
