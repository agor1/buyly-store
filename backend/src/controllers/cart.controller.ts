import { Response } from "express";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart.service.js";
import { AuthRequest } from "../types/authRequest.js";

const handleCartError = (error: unknown, res: Response) => {
  if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
    return res.status(404).json({ error: "Produkt nie istnieje." });
  }

  if (error instanceof Error && error.message === "CART_ITEM_NOT_FOUND") {
    return res.status(404).json({ error: "Produktu nie ma w koszyku." });
  }

  if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
    return res.status(400).json({
      error: "Brak wystarczającej ilości produktu w magazynie.",
    });
  }

  return res.status(500).json({ error: "Nie udało się obsłużyć koszyka." });
};

export const getUserCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cart = await getCart(req.userId);
    res.status(200).json(cart);
  } catch (error) {
    handleCartError(error, res);
  }
};

export const addItemToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId, quantity } = req.body;
    const cart = await addCartItem(req.userId, productId, quantity ?? 1);

    res.status(200).json(cart);
  } catch (error) {
    handleCartError(error, res);
  }
};

export const updateItemInCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await updateCartItem(req.userId, productId, quantity);

    res.status(200).json(cart);
  } catch (error) {
    handleCartError(error, res);
  }
};

export const removeItemFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;
    const cart = await removeCartItem(req.userId, productId);

    res.status(200).json(cart);
  } catch (error) {
    handleCartError(error, res);
  }
};

export const clearUserCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cart = await clearCart(req.userId);

    res.status(200).json(cart);
  } catch (error) {
    handleCartError(error, res);
  }
};
