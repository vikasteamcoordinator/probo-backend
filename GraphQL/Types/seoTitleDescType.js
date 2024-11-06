// ** Graphql
import pkg from "graphql";
const { GraphQLObjectType, GraphQLString, GraphQLInt } = pkg;

const seoTitleDescType = new GraphQLObjectType({
  name: "seoTitleDescType",
  description: "To store values of seo title and description",
  fields: () => ({
    _id: { type: GraphQLString },
    pageName: { type: GraphQLString },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export default seoTitleDescType;
