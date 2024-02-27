import { Router } from "express";
import { headers, validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import { multerCloudinary } from "../../utils/multerCloudinary.js";
import { validExtension } from "../../utils/validExtension.js";
import * as BV from "./brand.Validation.js";
import * as BC from "./brand.Controller.js";
import { auth } from "../../middleware/auth.js";
//==>> merge params// const router = Router({ mergeParams: true }); //==>> url will be like   localhost:3000/category/categoryId/SubCategory/any api
const router = Router(); 
router.post(
  "/createBrand/:categoryId/:subCategoryId",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("Logo"),
  validation(BV.createBrand),
  BC.createBrand
);
router.put(
  "/updateBrand",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).single("Logo"),
  validation(BV.updateBrand),
  BC.updateBrand
);


export default router;
