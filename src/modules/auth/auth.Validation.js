import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";
//************createUserValidation**************** */
export const createUser = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().required(),
      email: generalFiled.email,
      password: generalFiled.password,
      rePassword: generalFiled.rePassword,
      recoveryEmail: joi
        .string()
        .email({ tlds: { allow: ["outlook", "com"] }, minDomainSegments: 2 })
        .required(),
      phoneNumber: joi
        .string()
        .pattern(/^(?:\+20|20)?(10|11|12|15)\d{8}$/)
        .required()
        .messages({
          "string.pattern.base": "Invalid mobile number format for Egypt",
          "any.required": "Mobile number is required",
        }),
      age: joi.string().required().min(1),
      address: joi.string().required().min(4),
      gender: joi.string().required().valid("male", "female"),
      role: joi.string().required().valid("User", "Admin"),
    }),
};

export const confirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const reConfirmEmail = {
  params: joi.object().required().keys({
    refToken: joi.string().required(),
  }),
};
//********************************************* */
export const forgetPassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ tlds: { allow: ["outlook", "com"] }, minDomainSegments: 2 }),
      phoneNumber: joi
        .string()
        .pattern(/^(?:\+20|20)?(10|11|12|15)\d{8}$/)
        .messages({
          "string.pattern.base": "Invalid mobile number format for Egypt",
          "any.required": "Mobile number is required",
        }),
    }),
};
export const restPassword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .required()
        .email({
          tlds: { allow: ["outlook", "com"] },
          minDomainSegments: 2,
        }),
      phoneNumber: joi
        .string()
        .pattern(/^(?:\+20|20)?(10|11|12|15)\d{8}$/)
        .messages({
          "string.pattern.base": "Invalid mobile number format for Egypt",
          "any.required": "Mobile number is required",
        }),
      newPassword: joi
        .string()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        .required(),
      rePassword: joi.string().valid(joi.ref("newPassword")).required(),
      code: joi.string().required(),
    }),
};
