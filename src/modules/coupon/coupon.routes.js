import { Router } from "express";
import {  validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import * as CV from "./coupon.Validation.js";
import * as CC from "./coupon.Controller.js";
import { auth } from "../../middleware/auth.js";
const router = Router();
router.post(
  "/createCoupon",
  auth(validRoles.Admin),
  validation(CV.createCoupon),
  CC.createCoupon
);
router.put(
  "/updateCoupon/:id",
  auth(validRoles.Admin),
  validation(CV.updateCoupon),
  CC.updateCoupon
);
export default router;
