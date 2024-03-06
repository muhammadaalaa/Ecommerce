import { Router } from "express";
import { headers, validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import { multerCloudinary } from "../../utils/multerCloudinary.js";
import { validExtension } from "../../utils/validExtension.js";
import * as PV from "./product.Validation.js";
import * as PC from "./product.Controller.js";
import { auth } from "../../middleware/auth.js";
//==>> merge params// const router = Router({ mergeParams: true }); //==>> url will be like   localhost:3000/category/categoryId/SubCategory/any api
const router = Router();
router.get(
  "/",
  PC.Product
);
router.post(
  "/createProduct",
  validation(headers.headers),
  auth(validRoles.Admin),
  multerCloudinary(validExtension.image).array("images",5),
  validation(PV.createProduct),
  PC.createProduct
);
router.patch(
  "/addToWishList/:productId",
  auth(validRoles.Admin),
  validation(PV.addToWishList),
  PC.addToWishList
);
router.get(
  "/handling",
  PC.handlingProduct
);
router.patch(
  "/removeFromWishList/:productId",
  auth(validRoles.Admin),
  validation(PV.removeFromWishList),
  PC.removeFromWishList
);
export default router;
