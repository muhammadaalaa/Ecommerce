import { Router } from "express";
import { headers, validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import { multerCloudinary } from "../../utils/multerCloudinary.js";
import { validExtension } from "../../utils/validExtension.js";
import * as CV from "./subCategory.Validation.js";
import * as CC from "./subCategory.Controller.js";
import { auth } from "../../middleware/auth.js";
//==>> merge params// const router = Router({ mergeParams: true }); //==>> url will be like   localhost:3000/category/categoryId/SubCategory/any api
const router = Router(); 
router.post(
  "/createSubCategory/:categoryId",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("image"),
  validation(CV.createSubCategory),
  CC.createSubCategory
);
router.put(
  "/updateSubCategory/:id",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("image"),
  validation(CV.updateSubCategory),
  CC.updateSubCategory
);

export default router;
