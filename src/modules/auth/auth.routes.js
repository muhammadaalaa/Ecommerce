import { Router } from "express";
import * as AV from "./auth.Validation.js";
import * as AC from "./auth.controller.js";
import { validation } from "../../middleware/validation.js";
const router = Router();

router.post("/createUser", validation(AV.createUser), AC.createUser);
router.get(
  "/confirmEmail/:token",
  validation(AV.confirmEmail),
  AC.confirmEmail
);
router.get( 
  "/reConfirmEmail/:refToken",
  validation(AV.reConfirmEmail),
  AC.reConfirmEmail
);
router.post(
  "/forgetPassword",
  validation(AV.forgetPassword),
  AC.forgetPassword
);

router.put(
  "/restPassword",
  validation(AV.restPassword),
  AC.restPassword
  );
export default router;
