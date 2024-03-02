import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { validRoles } from "../../utils/validRoles.js";
import  express  from "express";
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
router.post(
  "/cancelOrder/:orderId",
  auth(validRoles.Admin),
  OC.cancelOrder
);


router.post('/webhook', express.raw({type: 'application/json'}), OC.webhook);


export default router;
