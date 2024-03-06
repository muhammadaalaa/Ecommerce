import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import {
  productFieldsFindOneElement,
  productsFieldsFindOneElement,
} from "./feilds.js";
import productModel from "../../../../DB/models/productCollection.js";
import { updateProductQL } from "../product.Validation.js";
import { graphQLValidation } from "../../../middleware/validation.js";
import { graphAuth } from "../../../middleware/auth.js";
import { validRoles } from "../../../utils/validRoles.js";

export const productType = {
  type: new GraphQLObjectType({
    name: "product",
    fields: productFieldsFindOneElement,
  }),
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const product = await productModel.findById(args.id);
    return product;
  },
};
//==============================productsType=======================================
export const productsType = {
  type: new GraphQLList(
    new GraphQLObjectType({
      name: "products",
      fields: productsFieldsFindOneElement,
    })
  ),
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent, args) => {
    const products = await productModel.find();
    return products;
  },
};

//==========================updateProduct===========================================
export const updateProduct = {
  type: new GraphQLObjectType({
    name: "updateProduct",
    fields: productsFieldsFindOneElement,
  }),
  args: {
    id: { type: GraphQLID },
    price: { type: GraphQLInt },
    token: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
   await graphQLValidation(updateProductQL, args);
    await graphAuth(args.token, validRoles.Admin);
    const product = await productModel.findOneAndUpdate(
      { subCategoryId: args.id },
      { price: args.price },
      { new: true }
    );
    return product;
  },
};
