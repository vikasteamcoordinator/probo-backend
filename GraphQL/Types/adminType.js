// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

// ** Types
import { roleType } from "./roleType.js";

const adminType = new GraphQLObjectType({
  name: "adminType",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: roleType },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default adminType;
