// ** Graphql
import pkg from "graphql";
const { GraphQLString } = pkg;

//** Types
import countType from "../Types/countType.js";

// ** Models
import Products from "../../models/products.js";
import Orders from "../../models/orders.js";
import Customers from "../../models/customers.js";

const getCount = {
  type: countType,
  description: "To get total documents for the collection",
  args: {
    model: { type: GraphQLString },
  },
  resolve: async (_, { model }) => {
    try {
      let count;

      if (model === "products") {
        count = await Products.count();
      }

      if (model === "orders") {
        count = await Orders.count();
      }

      if (model === "customers") {
        count = await Customers.count();
      }
      return {
        count,
        status: 200,
        message: "Fetched total count of collection successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default getCount;
