import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createCategory = {
  body: joi.object().required().keys({
    name: joi.string().required().lowercase(),
    slug: joi.string().lowercase(),
    image: generalFiled.file,
  }),
  file: generalFiled.file,
};

//*********************updateCategory************************ */
export const updateCategory = {
  body: joi.object().required().keys({
    name: joi.string().required().lowercase(),
    slug: joi.string().lowercase(),
    image: generalFiled.file,
  }),
  params: joi.object().keys({
    id: generalFiled.id.required(),
  }),
};
//*********************deleteCategory************************ */
export const deleteCategory = {
  body: joi.object().required().keys({
    id: generalFiled.id.required(),
  }),
  headers: headers.headers,
};
