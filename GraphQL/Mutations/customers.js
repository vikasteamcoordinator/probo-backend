// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../Types/customerType.js";
import { addressInputType } from "../Types/addressType.js";

// ** Models
import Customers from "../../models/customers.js";

export const customers = {
  type: customerType,
  description: "To update a user",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    avatar: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    address: { type: addressInputType },
    wishlist: { type: new GraphQLList(GraphQLString) },
    customerStatus: { type: GraphQLString },
    stripeCusId: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      // Updating the customer
      const response = await Customers.findByIdAndUpdate(
        args.id,
        { $set: args },
        { new: true }
      )
        .populate("wishlist", "-__v")
        .exec();

      return {
        ...response.toObject(),
        status: 200,
        message: "Profile updated",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getCustomerById = {
  type: customerType,
  description: "To get a customer by id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const customer = await Customers.findById(args.id)
        .populate("wishlist", "-__v")
        .exec();

      return customer;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const addToWishlist = {
  type: customerType,
  description: "To add a product to customer wishlist",
  args: {
    productId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Checking customer is logged in or not
      if (!context.req.raw.customer) {
        return {
          status: 401,
          message: "Login in to wishlist products",
        };
      }

      // Customer
      const customerId = context.req.raw.customer.id;
      const customer = await Customers.findOne({ _id: customerId });

      if (!customer) {
        return {
          status: 404,
          message: "Customer not found",
        };
      }

      const productId = args.productId;

      if (customer.wishlist.includes(productId)) {
        return {
          email: customer.email,
          status: 200,
          message: "Product is already in wishlist",
        };
      }

      customer.wishlist.push(productId);

      const response = await Customers.findOneAndUpdate(
        { _id: customerId },
        { $set: customer }
      );

      if (response) {
        return {
          status: 200,
          message: "Added to wishlist",
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
