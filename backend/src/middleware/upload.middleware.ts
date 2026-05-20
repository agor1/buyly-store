import multer from "multer";
import { BadRequestError } from "../errors/app-error.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new BadRequestError("Dozwolone formaty zdjęć: JPG, PNG, WEBP."));
      return;
    }

    callback(null, true);
  },
});
