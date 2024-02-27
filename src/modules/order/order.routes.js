import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import * as OV from "./order.Validation.js";
import * as OC from "./order.Controller.js";
import { auth } from "../../middleware/auth.js";
const router = Router();
router.post(
  "/createOrder",
  auth(validRoles.Admin),
  validation(OV.createOrder),
  OC.createOrder
);
export default router;
