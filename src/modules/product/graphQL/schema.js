import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import productModel from "../../../../DB/models/productCollection.js";
import { productsFieldsFindOneElement } from "./feilds.js";
import { productType, productsType, updateProduct } from "./types.js";

export const productSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "getProducts",
    fields: {
      getProduct: productType,
      getProducts: productsType,
    },
  }),
  mutation: new GraphQLObjectType({ name: "updateProducts", fields: {
    update:updateProduct
  } }),
});
