import { Request, Response } from "express";
import { getCategories, getCategory } from "../services/category.service";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await getCategory(slug);
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  }
};
