import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createSubCategory = {
  body: joi.object().required().keys({
    name: joi.string().required().lowercase(),
    slug: joi.string().lowercase(),
    }),
  file: generalFiled.file.required(),
  params: joi.object().keys({
    categoryId: generalFiled.id.required(),
  }),
};

//********************************************* */
export const updateSubCategory = {
  body: joi.object().required().keys({
    name: joi.string().lowercase(),
    slug: joi.string().lowercase(),
    categoryId: generalFiled.id.required(),
  }),
  file: generalFiled.file.required(),
 
};
