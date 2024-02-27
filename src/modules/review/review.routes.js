import { Router } from "express";
import {  validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import * as RV from "./review.Validation.js";
import * as RC from "./review.Controller.js";
import { auth } from "../../middleware/auth.js";
const router = Router();
router.post(
  "/createReview/:productId",
  auth(validRoles.Admin),
  validation(RV.createReview),
  RC.createReview
);
router.delete(
  "/removeReview/:productId",
  auth(validRoles.Admin),
  validation(RV.removeReview),
  RC.removeReview
);
export default router;
