// ** Graphql
import pkg from "graphql";
const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = pkg;

export const variantType = new GraphQLObjectType({
  name: "variantType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    options: { type: new GraphQLList(variantOptionType) },
  }),
});

const variantOptionType = new GraphQLObjectType({
  name: "variantOptionType",
  fields: () => ({
    _id: { type: GraphQLString }, // For fetching variant id
    variantId: { type: GraphQLString }, // For products model
    value: { type: GraphQLString },
    meta: { type: GraphQLString },
  }),
});

export const variantInputType = new GraphQLInputObjectType({
  name: "variantInputType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    options: { type: new GraphQLList(variantOptionInputType) },
  }),
});

const variantOptionInputType = new GraphQLInputObjectType({
  name: "variantOptionInputType",
  fields: () => ({
    variantId: { type: GraphQLString }, // For products model
    value: { type: GraphQLString },
    meta: { type: GraphQLString },
  }),
});

export const productVariantType = new GraphQLObjectType({
  name: "productVariantType",
  fields: () => ({
    _id: { type: GraphQLString },
    variantsId: { type: new GraphQLList(GraphQLString) },
    variantName: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    totalStocks: { type: GraphQLInt },
    inStock: { type: GraphQLBoolean },
  }),
});

export const productVariantInputType = new GraphQLInputObjectType({
  name: "productVariantInputType",
  fields: () => ({
    variantsId: { type: new GraphQLList(GraphQLString) },
    variantName: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    totalStocks: { type: GraphQLInt },
    inStock: { type: GraphQLBoolean },
  }),
});
