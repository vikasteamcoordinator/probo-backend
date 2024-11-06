// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLNonNull, GraphQLString } = pkg;

//** Types
import { productType } from "../Types/productType.js";

// ** Models
import Products from "../../models/products.js";

const getSearchResults = {
  type: new GraphQLList(productType),
  description: "To fetch products based on search results",
  args: {
    searchTerm: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, { searchTerm }) => {
    try {
      const results = await Products.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { desc: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
        ],
      });

      return results;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getSearchResults;
