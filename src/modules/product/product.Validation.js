import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createProduct = {
  body: joi.object().required().keys({
    title: joi.string().required().lowercase(),
    slug: joi.string().lowercase(),
    desc: joi.string().lowercase(),
    price: joi.number().required(),
    discount: joi.number().min(1).max(100).required(),
    stock: joi.number().min(1).required(),
    priceAfterDiscount: joi.number(),
    categoryId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
    brandId: generalFiled.id.required(),
  }),
  files: joi.array().items(generalFiled.file.required()).required(),
};

//********************************************* */
export const addToWishList = {
  params: joi.object().required().keys({
    productId: generalFiled.id.required(),
  }),
  headers: headers.headers
};
export const removeFromWishList = {
  params: joi.object().required().keys({
    productId: generalFiled.id.required(),
  }),
  headers: headers.headers
};
// name, categoryId, subCategoryId, id
//=====================================================================
export const updateProductQL =  joi.object().required().keys({
    id: generalFiled.id.required(),
    price: joi.number().integer().positive().required(),
    token:joi.string().required()
  })
