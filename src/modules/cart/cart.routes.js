import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import * as CV from "./cart.Validation.js";
import * as CC from "./cart.Controller.js";
import { auth } from "../../middleware/auth.js";
const router = Router();
router.post(
  "/createCart",
  auth(validRoles.Admin),
  validation(CV.createCart),
  CC.createCart
);
router.patch(
  "/removeCart",
  auth(validRoles.Admin),
  validation(CV.removeCart),
  CC.removeCart
);
router.patch(
  "/clear",
  auth(validRoles.Admin),
  validation(CV.clearCart),
  CC.clearCart
);
export default router;
