import { Request, Response } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/product.service.js";
import type { GetProductsQuery } from "../schemas/product.schemas.js";

export const getSingleProduct = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = await getProduct(slug);

  res.status(200).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const query = res.locals.query as GetProductsQuery;
  const products = await getProducts(query);

  res.status(200).json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    slug,
    description,
    imageUrl,
    price,
    promoPrice,
    promoStartsAt,
    promoEndsAt,
    stock,
    categoryId,
  } = req.body;
  const newProduct = await addProduct({
    name,
    slug,
    description,
    imageUrl,
    price,
    promoPrice,
    promoStartsAt,
    promoEndsAt,
    stock,
    categoryId,
  });

  res.status(201).json(newProduct);
};

export const updateProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    imageUrl,
    price,
    promoPrice,
    promoStartsAt,
    promoEndsAt,
    stock,
    categoryId,
  } = req.body;
  const updatedProduct = await updateProduct(id, {
    name,
    slug,
    description,
    imageUrl,
    price,
    promoPrice,
    promoStartsAt,
    promoEndsAt,
    stock,
    categoryId,
  });

  res.status(200).json(updatedProduct);
};

export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteProduct(id);

  res.status(204).send();
};
