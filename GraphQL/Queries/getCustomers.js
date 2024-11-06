// ** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

// ** Types
import { customerType } from "../Types/customerType.js";

// ** Models
import Customers from "../../models/customers.js";

export const getCustomer = {
  type: customerType,
  description: "To get the user based on user id",
  resolve: async (_, args, context) => {
    try {
      const customerId = context.req.raw.customer.id;

      const customer = await Customers.findById(customerId)
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

export const getCustomers = {
  type: new GraphQLList(customerType),
  description: "To get all customers",
  resolve: async () => {
    try {
      const customers = await Customers.find()
        .populate("wishlist", "-__v")
        .exec();

      return customers;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getNewCustomers = {
  type: new GraphQLList(customerType),
  description: "To fetch new customers from database",
  resolve: async () => {
    try {
      const date = new Date();
      const previousMonth = new Date(date.setMonth(date.getMonth() - 1));

      const response = await Customers.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("email");

      return response;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getSuspendedCustomers = {
  type: new GraphQLList(customerType),
  description: "To get suspended customers",
  resolve: async () => {
    try {
      const response = await Customers.find({
        status: "suspended",
      }).select("email");

      return response;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
