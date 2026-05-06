import { Request, Response, NextFunction } from "express";
import {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
} from "../services/products.service";

// Get product controller
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProduct(id);
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }
};

// Get all products controller
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Create new product controller
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, categoryId } = req.body;

    const newProduct = await addProduct({
      name,
      slug,
      description,
      price,
      categoryId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      res.status(400).json({ error: "Invalid category ID" });
    } else {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
};

// Delete product controller
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
};
