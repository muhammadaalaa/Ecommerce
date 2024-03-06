import joi from "joi";
import { Types } from "mongoose";

const comingData = ["body", "params", "query", "file", "files", "headers"];

const objectIdValidation = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.message("invalid id");
};
export const generalFiled = {
  email: joi
    .string()
    .email({ tlds: { allow: ["outlook", "com"] }, minDomainSegments: 2 })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  rePassword: joi.string().valid(joi.ref("password")).required(),
  file: joi.object().keys({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  id: joi.string().custom(objectIdValidation),
};

export const headers = {
  headers: joi.object({
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
    token: joi.string().required(),
  }),
};

export const validation = (Schema) => {
  return (req, res, next) => {
    let Errors = [];
    // let arr2 = [];
    for (const key of comingData) {
      if (Schema[key]) {
        const { error } = Schema[key].validate(req[key], { abortEarly: false });
        if (error?.details) {
          // console.log(error);
          error.details.forEach((e) => {
            Errors.push(e.message);
          });
          // console.log(error.details);
        }
      }
    }
    if (Errors.length) {
      return res.status(400).json({ err: Errors });
    }
    next();
  };
};
export const graphQLValidation = (Schema, data) => {
  let Errors = [];
  // let arr2 = [];

  const { error } = Schema.validate(data, { abortEarly: false });
  if (error?.details) 
  throw new Error(error)
};
