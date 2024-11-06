// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import seoTitleDescType from "../Types/seoTitleDescType.js";

// ** Models
import SeoTitleDescs from "../../models/seoTitleDescs.js";

export const seoTitleDescs = {
  type: seoTitleDescType,
  description: "To store values of seo title and description",
  args: {
    id: { type: GraphQLString },
    pageName: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    desc: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      //If page name is already exist, then returning a error
      const isPageExist = await SeoTitleDescs.findOne({
        pageName: { $regex: new RegExp(args.pageName, "i") },
      });

      if (isPageExist && !args.id) {
        return {
          status: 400,
          message: "Seo for this page already exist",
        };
      }

      // Checking for id, if not found, creating the seo title & desc
      let response;

      args.id
        ? (response = await SeoTitleDescs.findByIdAndUpdate(
            args.id,
            {
              $set: args,
            },
            { new: true }
          ))
        : (response = await SeoTitleDescs.create(args));

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

export const deleteSeoTitleDesc = {
  type: seoTitleDescType,
  description: "To delete a seo title & desc",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await SeoTitleDescs.findByIdAndDelete(args.id);

      return {
        _id: response._id,
        status: 200,
        message: "Deleted successfully",
      };
    } catch (error) {
      return {
        status: 400,
        message: error,
      };
    }
  },
};
