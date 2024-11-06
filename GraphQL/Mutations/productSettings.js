// ** Graphql
import pkg from "graphql";
const { GraphQLNonNull, GraphQLList, GraphQLString } = pkg;

// ** Types
import productSettingsType from "../Types/productSettingsType.js";
import { variantInputType } from "../Types/variantType.js";

// ** Models
import { ProductSettings } from "../../models/productSettings.js";

export const productSettings = {
  type: productSettingsType,
  description: "To store values of product settings",
  args: {
    id: { type: GraphQLString },
    categories: { type: new GraphQLList(GraphQLString) },
    productCardType: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      let response;

      // Checking for id, if not found, creating the product settings
      if (args.id) {
        response = await ProductSettings.findByIdAndUpdate(
          args.id,
          {
            $set: args,
          },
          { new: true }
        );
      } else {
        // If product settings  is already present in database, returning a error
        const isProductSettingsExist = await ProductSettings.find();

        if (isProductSettingsExist?.length > 0) {
          // Already exist
          return {
            status: 400,
            message: "Product settings already exist",
          };
        } else {
          // Not exist
          response = await ProductSettings.create({
            categories: args.categories,
            productCardType: args.productCardType,
          });
        }
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

export const productVariants = {
  type: productSettingsType,
  description: "To store values of product settings (variants)",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    variant: { type: new GraphQLNonNull(variantInputType) },
  },
  resolve: async (_, args) => {
    try {
      let response = await ProductSettings.findOne({ _id: args.id });

      const existingVariant = response.variants.find(
        (v) => v._id.toString() === args.variant.id
      );

      // If variant is exist in database, add it to the variants array, else add a variant
      if (existingVariant) {
        existingVariant.name = args.variant.name;
        existingVariant.options = args.variant.options;
      } else {
        response.variants.push({
          name: args.variant.name,
          options: args.variant.options,
        });
      }

      await response.save();

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

export const deleteProductVariant = {
  type: productSettingsType,
  description: "To delete a product variant",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await ProductSettings.findOneAndUpdate(
        { _id: args.id },
        { $pull: { variants: { _id: args.variantId } } },
        { new: true }
      );

      // If response is null, returning a error, this occurs when product ID or variant name passed in args that is not available in database
      if (response === null) {
        return {
          status: 400,
          message: "Error occurred",
        };
      }

      return {
        ...response.toObject(),
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
