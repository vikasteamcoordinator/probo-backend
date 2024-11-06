// ** Graphql
import pkg from "graphql";
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
} = pkg;

export const cartProductsType = new GraphQLObjectType({
  name: "cartProductsType",
  fields: () => ({
    product: { type: cartProductType },
    variant: { type: GraphQLString },
    variantName: { type: GraphQLString },
    quantity: {
      type: GraphQLInt,
    },
  }),
});

export const cartProductType = new GraphQLObjectType({
  name: "cartProductType",
  fields: () => ({
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLInt },
    inStock: { type: GraphQLBoolean },
  }),
});
