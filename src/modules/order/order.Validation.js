import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createOrder = {
  body: joi
    .object()
    .required()
    .keys({
      productId: generalFiled.id,
      quantity: joi.number().min(1),
      address: joi.string().max(256).required(),
      paymentMethod: joi.string().valid("card", "cash"),
      couponCode: joi.string(),
      status: joi
        .string()
        .valid("placed", "waitPayment", "delivered", "cancelled"),
      phoneNumber: joi
        .array()
        .items(
          joi
            .string()
            .pattern(/^(?:\+20|20)?(10|11|12|15)\d{8}$/)
            .required()
        )
        .required(),
    })
    .with("productId", "quantity")
    .required(),

  headers: headers.headers,
};
