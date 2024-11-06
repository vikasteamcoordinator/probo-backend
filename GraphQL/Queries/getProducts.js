// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} = pkg;

//** Types
import { productsType, productType } from "../Types/productType.js";

// ** Models
import Products from "../../models/products.js";

const getSortField = (sortOption) => {
  switch (sortOption) {
    case "Newest":
      return "createdAt";
    case "PriceLowToHigh":
      return "salePrice";
    case "PriceHighToLow":
      return "-salePrice";
    default:
      return "createdAt"; // Default sorting by newest if no valid sort option provided
  }
};

const getSortDirection = (sortOption) => {
  if (sortOption !== "PriceHighToLow") {
    return "desc";
  }
  return "asc";
};

export const getProducts = {
  type: productsType,
  description: "To fetch products from database with limit",
  args: {
    page: { type: new GraphQLNonNull(GraphQLInt) },
    limit: { type: new GraphQLNonNull(GraphQLInt) },
    category: { type: new GraphQLList(GraphQLString) },
    priceRange: { type: new GraphQLList(GraphQLString) },
    trending: { type: GraphQLBoolean },
    inStock: { type: GraphQLBoolean },
    sortBy: { type: GraphQLString },
  },
  resolve: async (
    _,
    { category, priceRange, trending, inStock, sortBy, page, limit }
  ) => {
    try {
      let query = {};

      if (category?.length > 0) {
        query.category = { $in: category };
      }

      if (priceRange?.length > 0) {
        const priceRangeQueries = priceRange.map((range) => {
          const [minPrice, maxPrice] = range.split("/");
          return {
            $or: [
              {
                salePrice: {
                  $gte: parseInt(minPrice),
                  $lte: parseInt(maxPrice),
                },
              },
              {
                variants: {
                  $elemMatch: {
                    salePrice: {
                      $gte: parseInt(minPrice),
                      $lte: parseInt(maxPrice),
                    },
                  },
                },
              },
            ],
          };
        });

        query.$or = [...priceRangeQueries];
      }

      if (inStock) {
        query.$or = [
          { inStock },
          {
            variants: {
              $elemMatch: { inStock },
            },
          },
        ];
      }

      if (trending) {
        query.trending = trending;
      }

      let sort = {};

      if (sortBy) {
        const sortField = getSortField(sortBy);
        const sortDirection = getSortDirection(sortBy);
        sort[sortField] = sortDirection;
      } else {
        // On initial load
        sort["createdAt"] = "desc";
      }

      const skip = page * limit;

      const products = await Products.find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "reviews",
          populate: {
            path: "customer",
            model: "Customers",
            select: "firstName lastName",
          },
        })
        .sort(sort);

      const totalCount = await Products.countDocuments(query);

      return { totalCount, products };
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getNewProducts = {
  type: new GraphQLList(productType),
  description: "To fetch new products from database",
  resolve: async () => {
    try {
      const date = new Date();
      const previousMonth = new Date(date.setMonth(date.getMonth() - 1));

      const newProducts = await Products.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("title");

      return newProducts;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getOutOfStockProducts = {
  type: new GraphQLList(productType),
  description: "To fetch out of stock products from database",
  resolve: async () => {
    try {
      const products = await Products.find({ inStock: false }).select(
        "inStock"
      );

      return products;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};
