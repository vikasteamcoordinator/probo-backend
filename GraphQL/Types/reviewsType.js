// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLFloat } = pkg;

// ** Types
import { customerType } from "./customerType.js";

const reviewsType = new GraphQLObjectType({
  name: "reviewsType",
  fields: () => ({
    customer: { type: customerType },
    orderId: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    media: { type: GraphQLString },
  }),
});
export default reviewsType;
