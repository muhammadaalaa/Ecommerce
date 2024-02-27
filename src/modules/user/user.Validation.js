import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";
//************createUserValidation**************** */
export const signInValidation = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ tlds: { allow: ["outlook", "com"] }, minDomainSegments: 2 }),
      recoveryEmail: joi
        .string()
        .email({ tlds: { allow: ["outlook", "com"] }, minDomainSegments: 2 }),
      password: joi.string(),
      mobileNumber: joi
        .string()
        .pattern(/^(?:\+20|20)?(10|11|12|15)\d{8}$/)
        .messages({
          "string.pattern.base": "Invalid mobile number format for Egypt",
          "any.required": "Mobile number is required",
        }),
    })
    .xor("email", "phoneNumber", "recoveryEmail")
    .with("email", "password")
    .with("phoneNumber", "password") // If mobileNumber is present, password is required
    .with("recoveryEmail", "password") // If mobileNumber is present, password is required
    .messages({
      "object.missing": "u have to enter at least one of [email,phoneNumber,recoveryEmail]",
    })
    .required(),
};
