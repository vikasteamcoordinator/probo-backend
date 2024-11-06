//** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

//** Types
import seoTitleDescType from "../Types/seoTitleDescType.js";

//** Model
import SeoTitleDescs from "../../models/seoTitleDescs.js";

const getSeoTitleDescs = {
  type: new GraphQLList(seoTitleDescType),
  description: "To get the seo title and desc values",
  resolve: async () => {
    try {
      const seoTitleDesc = await SeoTitleDescs.find();

      return seoTitleDesc;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getSeoTitleDescs;
