// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLNonNull,
} = pkg;

// ** Types
import { productType } from "../Types/productType.js";
import {
  productVariantInputType,
  variantInputType,
} from "../Types/variantType.js";

// ** Models
import Products from "../../models/products.js";

export const products = {
  type: productType,
  description: "To add or update products",
  args: {
    id: { type: GraphQLString },
    title: { type: new GraphQLNonNull(GraphQLString) },
    desc: { type: GraphQLString },
    category: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    regularPrice: { type: GraphQLFloat },
    salePrice: { type: GraphQLFloat },
    tax: { type: GraphQLFloat },
    totalStocks: { type: GraphQLInt },
    inStock: { type: GraphQLBoolean },
    productType: { type: new GraphQLNonNull(GraphQLString) },
    variantsOptions: { type: new GraphQLList(variantInputType) },
    variants: { type: new GraphQLList(productVariantInputType) },
  },
  resolve: async (_, args) => {
    try {
      let response;

      if (args.productType === "simple") {
        // Checking whether sale price is lesser than regular price or not (Simple product)
        if (args.salePrice > args.regularPrice) {
          return {
            status: 400,
            message: "Sale price can't be greater than regular price",
          };
        }

        if (args.inStock && !args.totalStocks > 0) {
          return {
            status: 400,
            message: "Please increase the total limit or disable the item!",
          };
        }
      } else {
        // Checking whether sale price is lesser than regular price or not (Variable product)
        for (let i = 0; i < args.variants?.length; i++) {
          if (args.variants[i].salePrice > args.variants[i].regularPrice) {
            return {
              status: 400,
              message: "Sale price can't be greater than regular price",
            };
          }

          if (args.variants[i].inStock && !args.variants[i].totalStocks > 0) {
            return {
              status: 400,
              message: "Please increase the total limit or disable the item!",
            };
          }
        }
      }

      // Checking for id, if not found, creating the product
      if (args.id) {
        response = await Products.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        response = await Products.create(args);
      }

      // If response is null, returning a error, this occurs when id passed in args that is not available in database
      if (response === null) {
        return {
          status: 400,
          message: "Error occurred",
        };
      }

      return {
        ...response.toObject(),
        status: 200,
        message: args.id ? "Updated successfully" : "Added successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getProductsByIds = {
  type: new GraphQLList(productType),
  description: "To fetch products depending on ids ",
  args: {
    ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
  resolve: async (_, args) => {
    try {
      const products = await Products.find({
        _id: {
          $in: args.ids,
        },
      }).populate({
        path: "reviews",
        populate: {
          path: "customer",
          model: "Customers",
          select: "firstName lastName",
        },
      });

      return products;
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};

export const getProductsByCategory = {
  type: new GraphQLList(productType),
  description: "To fetch products depending on category ",
  args: {
    category: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const products = await Products.find({
        category: args.category,
      }).populate({
        path: "reviews",
        populate: {
          path: "customer",
          model: "Customers",
          select: "firstName lastName",
        },
      });

      return products;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const setTrendingProduct = {
  type: productType,
  description: "To set a trending product",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    trending: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Products.findByIdAndUpdate(
        args.id,
        {
          $set: args,
        },
        { new: true }
      );

      return {
        _id: response._id,
        trending: response.trending,
        status: 200,
        message: "Success",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const deleteProduct = {
  type: productType,
  description: "To delete a product",
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      const response = await Products.findByIdAndDelete(args.id);

      return {
        _id: response._id,
        status: 200,
        message: "Deleted successfully",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
