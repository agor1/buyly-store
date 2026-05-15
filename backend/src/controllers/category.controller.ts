import { Request, Response } from "express";
import { getCategories, getCategory } from "../services/category.service.js";

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await getCategories();

  res.status(200).json(categories);
};

export const getSingleCategory = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await getCategory(slug);

  res.status(200).json(category);
};
