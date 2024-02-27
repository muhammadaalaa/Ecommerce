import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createReview = {
  body: joi
    .object()
    .required()
    .keys({
      comment: joi.string().required(),
      rate: joi.number().min(1).max(5).required(),
      orderId: generalFiled.id.required(),
    }),
  headers: headers.headers,
};

//*********************updateCategory************************ */
export const removeReview = {
  body: joi.object().required().keys({
    orderId: generalFiled.id,
  }),
  headers: headers.headers,
  params: joi.object().keys({
    productId: generalFiled.id,
  }),
};
//*********************deleteCategory************************ */
export const deleteCategory = {
  body: joi.object().required().keys({
    id: generalFiled.id.required(),
  }),
  headers: headers.headers,
};
