import { GraphQLID, GraphQLInt, GraphQLString } from "graphql";

export const productFieldsFindOneElement = {
  title: { type: GraphQLString },
  subCategoryId: { type: GraphQLID },
  categoryId: { type: GraphQLID },
};
export const productsFieldsFindOneElement = {
  title: { type: GraphQLString },
  subCategoryId: { type: GraphQLID },
  categoryId: { type: GraphQLID },
  price: { type: GraphQLInt },
};
