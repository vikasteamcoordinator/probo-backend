// ** Graphql
import pkg from "graphql";
const { GraphQLInputObjectType, GraphQLString, GraphQLFloat } = pkg;

const reviewsInputType = new GraphQLInputObjectType({
  name: "reviewsInputType",
  fields: () => ({
    orderId: { type: GraphQLString },
    rating: { type: GraphQLFloat },
    comment: { type: GraphQLString },
    media: { type: GraphQLString },
  }),
});
export default reviewsInputType;
