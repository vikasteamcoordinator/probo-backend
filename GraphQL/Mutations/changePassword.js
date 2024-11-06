// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../Types/customerType.js";
import adminType from "../Types/adminType.js";

// ** Models
import Customers from "../../models/customers.js";
import Admins from "../../models/admins.js";

// ** Third Party Imports
import bcrypt from "bcrypt";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export const changeCustomerPassword = {
  type: customerType,
  description: "To change password of a customer",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      const newPassword = bcrypt.hashSync(args.password, saltRounds);

      const response = await Customers.findOneAndUpdate(
        { _id: args.id },
        { $set: { password: newPassword } },
        { new: true }
      );

      // Clearing access token
      context.req.raw.res.clearCookie("access_token");

      // Clearing customer token
      context.req.raw.res.clearCookie("fabyoh_customer");

      if (!response) {
        return {
          status: 200,
          message: "Error occurred",
        };
      }

      return {
        status: 200,
        message: "Password changed",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const changeAdminPassword = {
  type: adminType,
  description: "To change admin password",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    confirmNewPassword: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      const admin = await Admins.findById(context.req.raw.admins.id);

      if (admin.email === args.email) {
        if (args.newPassword === args.confirmNewPassword) {
          //  Updating the user password
          const password = bcrypt.hashSync(args.confirmNewPassword, saltRounds);

          await Admins.findByIdAndUpdate(
            context.req.raw.admins.id,
            { password },
            { new: true }
          );

          // Clearing access token
          context.req.raw.res.clearCookie("access_token");

          // Clearing the role
          context.req.raw.res.clearCookie("role");

          return {
            status: 200,
            message: "Password changed",
          };
        } else {
          return {
            status: 403,
            message: "Password doesn't match",
          };
        }
      } else {
        return {
          status: 403,
          message: "Please enter your current email address",
        };
      }
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
