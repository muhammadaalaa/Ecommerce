import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createCart = {
  body: joi
    .object()
    .required()
    .keys({
      productId: generalFiled.id.required(),
      quantity: joi.number().required().min(1),
    }),
  headers: headers.headers,
};

//*********************updateCategory************************ */
export const removeCart = {
  body: joi.object().required().keys({
    id: generalFiled.id,
  }),
  headers: headers.headers,
};
//*********************deleteCategory************************ */
export const clearCart = {
  headers: headers.headers,
};
