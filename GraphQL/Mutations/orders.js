// ** Graphql
import pkg from "graphql";
const { GraphQLList, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull } =
  pkg;

// ** Types
import {
  ordersType,
  orderProductInputType,
  orderCustomerInputType,
} from "../Types/ordersType.js";

// ** Models
import Orders from "../../models/orders.js";
import Cart from "../../models/carts.js";
import Products from "../../models/products.js";

// ** Emails
import orderConfirmationEmail from "../../emails/orderConfirmationEmail.js";
import newOrderRequestEmail from "../../emails/newOrderRequestEmail.js";
import orderDeliveredEmail from "../../emails/orderDeliveredEmail.js";
import orderShippedEmail from "../../emails/orderShippedEmail.js";

// To get the required products details
const getProductDetails = (products) => {
  const productsDetails = [];

  products.map((item) => {
    if (item.variant) {
      // Variable product
      const foundVariant = item.product.variants.find((variant) => {
        return variant._id.toString() === item.variant;
      });

      productsDetails.push({
        product: {
          _id: item.product._id,
          title: item.product.title,
          images: foundVariant?.images,
          salePrice: foundVariant?.salePrice,
          tax: foundVariant?.tax,
          inStock: foundVariant?.inStock,
        },
        variant: item.variant,
        variantName: foundVariant.variantName,
        quantity: item.quantity,
      });
    } else {
      // Simple product
      productsDetails.push({
        product: {
          _id: item.product._id,
          title: item.product.title,
          images: item.product.images,
          salePrice: item.product.salePrice,
          tax: item.product.tax,
          inStock: item.product.inStock,
        },
        quantity: item.quantity,
      });
    }
  });

  return productsDetails;
};

export const createOrder = {
  type: ordersType,
  description: "To create a order",
  args: {
    customer: { type: new GraphQLNonNull(orderCustomerInputType) },
    products: {
      type: new GraphQLNonNull(new GraphQLList(orderProductInputType)),
    },
    appliedCoupon: { type: GraphQLString },
    couponDiscount: { type: GraphQLInt },
    paymentMethod: { type: new GraphQLNonNull(GraphQLString) },
    paymentStatus: { type: new GraphQLNonNull(GraphQLString) },
    deliveryStatus: { type: GraphQLString },
    mrp: { type: new GraphQLNonNull(GraphQLFloat) },
    taxes: { type: new GraphQLNonNull(GraphQLFloat) },
    totalAmount: { type: new GraphQLNonNull(GraphQLFloat) },
    shippingFees: { type: new GraphQLNonNull(GraphQLString) },
    expectedDelivery: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Orders.create(args);

      const order = await Orders.findById(response._id)
        .populate("products.product", "-__v")
        .exec();

      // get customer details
      const customer = order.customer;

      // Removing customer cart after successful order
      await Cart.findOneAndDelete(
        { customerId: customer.customerId },
        { new: true }
      );

      // Reduce product quantity
      order.products.map(async (product) => {
        if (product.variant) {
          // Reduce totalStocks of the specific variant
          const result = await Products.findOneAndUpdate(
            {
              _id: product.product,
              "variants._id": product.variant,
            },
            {
              $inc: { "variants.$.totalStocks": -product.quantity },
            },
            { new: true }
          ).select("variants");

          const variant = result.variants.find((v) =>
            v._id.equals(product.variant)
          );

          if (variant.totalStocks === 0) {
            await Products.findOneAndUpdate(
              {
                _id: product.product,
                "variants._id": product.variant,
              },
              { $set: { "variants.$.inStock": false } }
            );
          }
        } else {
          // Reduce totalStocks of the main product
          const result = await Products.findByIdAndUpdate(
            product.product,
            {
              $inc: { totalStocks: -product.quantity },
            },
            { new: true }
          ).select("totalStocks");

          if (result.totalStocks === 0) {
            await Products.findByIdAndUpdate(result.id, { inStock: false });
          }
        }
      });

      // send order confirmation email to customer and admin
      orderConfirmationEmail(order, customer);
      newOrderRequestEmail(order, customer);

      return {
        ...order.toObject(),
        status: 200,
        message: "Successfully created the order",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const editOrder = {
  type: ordersType,
  description: "To update a order",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    paymentStatus: { type: GraphQLString },
    deliveryStatus: { type: GraphQLString },
    trackingLink: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    try {
      const order = await Orders.findByIdAndUpdate(
        args.id,
        {
          $set: args,
        },
        { new: true }
      )
        .populate("products.product", "-__v")
        .exec();

      const products = getProductDetails(order.products);

      delete order.products;

      const response = { ...order.toObject(), products };

      // get customer details
      const customer = response.customer;

      // send order shipped email to customer
      if (response.deliveryStatus === "shipped") {
        orderShippedEmail(response, customer);
      }

      // send order delivered email to customer
      if (response.deliveryStatus === "delivered") {
        orderDeliveredEmail(response, customer);
      }

      return {
        ...response,
        status: 200,
        message: "Successfully updated the order",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getOrdersByCustomer = {
  type: new GraphQLList(ordersType),
  description: "To get order by customer id",
  args: {
    customerId: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const response = await Orders.find({
        "customer.customerId": args.customerId,
      })
        .sort({ createdAt: -1 })
        .populate("products.product", "-__v")
        .exec();

      const orders = [];

      response.map((order) => {
        const products = getProductDetails(order.products);

        delete order.products;

        const updatedOrder = { ...order.toObject(), products };

        orders.push(updatedOrder);
      });

      return orders;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const getOrderById = {
  type: ordersType,
  description: "To get order by order id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const order = await Orders.findById(args.id)
        .populate("products.product", "-__v")
        .exec();

      const products = getProductDetails(order.products);

      delete order.products;

      const updatedOrder = { ...order.toObject(), products };

      return updatedOrder;
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};
