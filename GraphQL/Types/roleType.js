// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = pkg;

export const roleType = new GraphQLObjectType({
  name: "roleType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    privileges: { type: new GraphQLList(GraphQLString) },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
