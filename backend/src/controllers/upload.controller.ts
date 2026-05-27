import { Response } from "express";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { BadRequestError } from "../errors/app-error.js";
import { AuthRequest } from "../types/authRequest.js";
import { updateCurrentUserAvatar } from "../services/auth.service.js";
import { requireUserId } from "../utils/auth.utils.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer: Buffer, folder: string) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
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

  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    process.env.CLOUDINARY_PRODUCTS_FOLDER || "buyly/products",
  );

  res.status(201).json({
    imageUrl: result.secure_url,
    publicId: result.public_id,
  });
};

export const uploadUserAvatar = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("Zdjęcie avataru jest wymagane.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new BadRequestError("Brak konfiguracji Cloudinary.");
  }

  const userId = requireUserId(req);
  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    process.env.CLOUDINARY_AVATARS_FOLDER || "buyly/avatars",
  );
  const user = await updateCurrentUserAvatar(userId, result.secure_url);

  res.status(201).json({
    imageUrl: result.secure_url,
    publicId: result.public_id,
    user,
  });
};
