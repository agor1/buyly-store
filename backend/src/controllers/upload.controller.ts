import { Response } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { BadRequestError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer: Buffer) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_PRODUCTS_FOLDER || "buyly/products",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });

export const uploadProductImage = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("Zdjęcie jest wymagane.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new BadRequestError("Brak konfiguracji Cloudinary.");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer);

  res.status(201).json({
    imageUrl: result.secure_url,
    publicId: result.public_id,
  });
};
