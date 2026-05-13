import { Request, Response } from "express";
import {
  getProduct,
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/product.service.js";

// Get product controller
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await getProduct(slug);
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
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const categoryId =
      typeof req.query.categoryId === "string" ? req.query.categoryId : "";
    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const sort =
      req.query.sort === "price-asc" ||
      req.query.sort === "price-desc" ||
      req.query.sort === "newest"
        ? req.query.sort
        : "relevance";

    const products = await getProducts({
      page,
      limit,
      search: search.trim() || undefined,
      categoryId: categoryId.trim() || undefined,
      minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
      sort,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Create new product controller
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, imageUrl, price, stock, categoryId } = req.body;

    const newProduct = await addProduct({
      name,
      slug,
      description,
      imageUrl,
      price,
      stock,
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

// Update product controller
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, imageUrl, price, stock, categoryId } = req.body;
    const updatedProduct = await updateProduct(id, {
      name,
      slug,
      description,
      imageUrl,
      price,
      stock,
      categoryId,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return res.status(404).json({ error: "Product not found" });
      } else if (error.message === "CATEGORY_NOT_FOUND") {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    res.status(500).json({ error: "Failed to update product" });
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
