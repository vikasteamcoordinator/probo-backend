// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = pkg;

//** Types
import { cartProductsType } from "./cartProductsType.js";

const cartType = new GraphQLObjectType({
  name: "cartType",
  fields: () => ({
    _id: { type: GraphQLString },
    customerId: { type: GraphQLString },
    products: { type: new GraphQLList(cartProductsType) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default cartType;
