// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
} = pkg;

//** Types
import reviewsType from "./reviewsType.js";
import { productVariantType, variantType } from "./variantType.js";

export const productsType = new GraphQLObjectType({
  name: "productsType",
  description: "To fetch all products",
  fields: () => ({
    totalCount: { type: GraphQLInt },
    products: { type: new GraphQLList(productType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const productType = new GraphQLObjectType({
  name: "productType",
  description: "To add or edit a product",
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    category: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    totalStocks: { type: GraphQLInt },
    inStock: { type: GraphQLBoolean },
    productType: { type: GraphQLString },
    variantsOptions: { type: new GraphQLList(variantType) },
    variants: { type: new GraphQLList(productVariantType) },
    trending: { type: GraphQLBoolean },
    reviews: { type: new GraphQLList(reviewsType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
