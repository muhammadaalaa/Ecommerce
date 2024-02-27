import joi from "joi";
import { generalFiled, headers } from "../../middleware/validation.js";
//************createCategoryValidation**************** */
export const createBrand = {
  body: joi.object().required().keys({
    name: joi.string().required().lowercase(),
    slug: joi.string().lowercase(),
    desc: joi.string().lowercase(),
  }),
  file: generalFiled.file.required(),
  params: joi.object().required().keys({
    categoryId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
  }),
};

//********************************************* */
export const updateBrand = {
  body: joi.object().required().keys({
    name: joi.string().lowercase(),
    slug: joi.string().lowercase(),
    categoryId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
    id: generalFiled.id.required(),
    
  }),
  file: generalFiled.file.required(),
};
// name, categoryId, subCategoryId, id