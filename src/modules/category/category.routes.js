import { Router } from "express";
import { headers, validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import { multerCloudinary } from "../../utils/multerCloudinary.js";
import { validExtension } from "../../utils/validExtension.js";
import * as CV from "./category.Validation.js";
import * as CC from "./category.Controller.js";
import { auth } from "../../middleware/auth.js";
// import subCategoryRoutes from "../subCategory/subCategory.routes.js"
const router = Router();

// router.use("/:categoryId/subCategory",subCategoryRoutes) //==>> for merge params
router.post(
  "/createCategory",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("image"),
  validation(CV.createCategory),
  CC.createCategory
);
router.put(
  "/updateCategory/:id",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("image"),
  validation(CV.updateCategory),
  CC.updateCategory
);
router.delete(
  "/deleteCategory",
  auth(validRoles.Admin),
  validation(CV.deleteCategory),
  CC.deleteCategory
);
export default router;
