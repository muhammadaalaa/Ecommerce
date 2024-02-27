import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createCoupon = {
  body: joi
    .object()
    .required()
    .keys({
      couponCode: joi.string().required().lowercase(),
      couponAmount: joi.number().min(1).max(100).required(),
      formDate: joi.date().greater(Date.now()).required(),
      toDate: joi.date().greater(joi.ref("formDate")).required(),
    }),
  headers: headers.headers,
};

//*********************updateCategory************************ */
export const updateCoupon = {
  body: joi
    .object()
    .required()
    .keys({
      couponCode: joi.string().lowercase(),
      couponAmount: joi.number().min(1).max(100),
      formDate: joi.date().greater(Date.now()-24*60*60*1000), //one day less than current date and time
      toDate: joi.date().greater(joi.ref("formDate")),
    }),
  headers: headers.headers,
  params: joi.object().keys({
    id: generalFiled.id,
  }).with("formDate", "formDate"),
};
//*********************deleteCategory************************ */
export const deleteCategory = {
  body: joi.object().required().keys({
    id: generalFiled.id.required(),
  }),
  headers: headers.headers,
};
