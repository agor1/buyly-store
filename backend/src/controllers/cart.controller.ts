import { Response } from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart.service.js";
import { UnauthorizedError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";

const requireUserId = (req: AuthRequest) => {
  if (!req.userId) {
    throw new UnauthorizedError();
  }

  return req.userId;
};

export const getUserCart = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const cart = await getCart(userId);

  res.status(200).json(cart);
};

export const addItemToCart = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { productId, quantity } = req.body;
  const cart = await addCartItem(userId, productId, quantity ?? 1);

  res.status(200).json(cart);
};

export const updateItemInCart = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await updateCartItem(userId, productId, quantity);

  res.status(200).json(cart);
};

export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { productId } = req.params;
  const cart = await removeCartItem(userId, productId);

  res.status(200).json(cart);
};

export const clearUserCart = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const cart = await clearCart(userId);

  res.status(200).json(cart);
};
