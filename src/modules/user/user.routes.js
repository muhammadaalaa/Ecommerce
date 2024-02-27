import { Router } from "express";
import * as UC from "./user.controller.js";
import * as UV from "./user.Validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router();


router.post(
    "/signIn",
    validation(UV.signInValidation),
    UC.signIn
    );


export default router;
