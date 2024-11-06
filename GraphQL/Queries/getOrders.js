// ** Graphql
import pkg from "graphql";
const { GraphQLList } = pkg;

// ** Types
import { ordersType } from "../Types/ordersType.js";

// ** Models
import Orders from "../../models/orders.js";

export const getOrders = {
  type: new GraphQLList(ordersType),
  description: "To get all orders",

  resolve: async () => {
    try {
      const orders = await Orders.find()
        .sort({ createdAt: -1 })
        .populate("products.product", "-__v")
        .exec();

      return orders;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getRevenue = {
  type: new GraphQLList(ordersType),
  description: "To get revenue - admin",
  resolve: async () => {
    try {
      const totalRevenue = await Orders.find().select("totalAmount");

      return totalRevenue;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getSoldProducts = {
  type: new GraphQLList(ordersType),
  description: "To get sold products - admin",
  resolve: async () => {
    try {
      const date = new Date();
      const previousMonth = new Date(date.setMonth(date.getMonth() - 1)); //To get last 30 days only

      const productsSold = await Orders.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("products");

      return productsSold;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getPrevMonthOrders = {
  type: new GraphQLList(ordersType),
  description: "To get last 60 days orders - admin",
  resolve: async () => {
    try {
      const date = new Date();
      const previousMonth = new Date(date.setMonth(date.getMonth() - 2)); //To get last 60 days only

      const orders = await Orders.find({
        createdAt: {
          $gte: previousMonth,
        },
      }).select("createdAt");

      return orders;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getLastQuarterRevenue = {
  type: new GraphQLList(ordersType),
  description: "To get last 90 days orders - admin",
  resolve: async () => {
    try {
      const date = new Date();
      const quarter = new Date(date.setMonth(date.getMonth() - 3)); //To get last 90 days only

      const orders = await Orders.find({
        createdAt: {
          $gte: quarter,
        },
      }).select("totalAmount createdAt");

      return orders;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
