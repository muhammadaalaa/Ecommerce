import multer from "multer";
import { validExtension } from "./validExtension.js";
import { AppError } from "./HandlingError.js";

export const multerCloudinary = (customValidation) => {
  if (!customValidation) {
    customValidation = validExtension.image;
  }
  const storage = multer.diskStorage({});
  const fileFilter = function (req, file, cb) {
    // console.log(file.mimetype);
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    console.log(file.mimetype);
    cb(new AppError("invalid type"), false);
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};
