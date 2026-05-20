import { Response } from "express";
import {
  addFavoriteItem,
  clearFavorites,
  getFavorites,
  removeFavoriteItem,
} from "../services/favorite.service.js";
import { AuthRequest } from "../types/authRequest.js";
import { requireUserId } from "../utils/auth.utils.js";

export const getUserFavorites = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const favorites = await getFavorites(userId);

  res.status(200).json(favorites);
};

export const addItemToFavorites = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const { productId } = req.body;
  const favorites = await addFavoriteItem(userId, productId);

  res.status(200).json(favorites);
};

export const removeItemFromFavorites = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = requireUserId(req);
  const { productId } = req.params;
  const favorites = await removeFavoriteItem(userId, productId);

  res.status(200).json(favorites);
};

export const clearUserFavorites = async (req: AuthRequest, res: Response) => {
  const userId = requireUserId(req);
  const favorites = await clearFavorites(userId);

  res.status(200).json(favorites);
};
