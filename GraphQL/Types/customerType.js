// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = pkg;

// ** Types
import { addressType } from "./addressType.js";
import { productType } from "./productType.js";

export const customerType = new GraphQLObjectType({
  name: "customerType",
  fields: () => ({
    _id: { type: GraphQLString },
    customerId: { type: GraphQLString }, // Not available in db
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    avatar: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    address: { type: addressType },
    wishlist: { type: new GraphQLList(productType) },
    stripeCusId: { type: GraphQLString },
    joinedOn: { type: GraphQLString },
    customerStatus: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});
