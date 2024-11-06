// ** Graphql
import pkg from "graphql";
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
} = pkg;

// ** Types
import { cartProductsType } from "./cartProductsType.js";
import { addressInputType, addressType } from "./addressType.js";

export const ordersType = new GraphQLObjectType({
  name: "ordersType",
  description: "To add or edit a order",
  fields: () => ({
    _id: { type: GraphQLString },
    customer: { type: orderCustomerType },
    products: { type: new GraphQLList(cartProductsType) },
    appliedCoupon: { type: GraphQLString },
    couponDiscount: { type: GraphQLInt },
    paymentMethod: { type: GraphQLString },
    paymentStatus: { type: GraphQLString },
    deliveryStatus: { type: GraphQLString },
    dateOfPurchase: { type: GraphQLString },
    mrp: { type: GraphQLFloat },
    taxes: { type: GraphQLFloat },
    totalAmount: { type: GraphQLFloat },
    shippingFees: { type: GraphQLString },
    expectedDelivery: { type: GraphQLString },
    trackingLink: { type: GraphQLString },
    limit: { type: GraphQLInt }, // Not available in db
    offset: { type: GraphQLInt }, // Not available in db
    createdAt: { type: GraphQLString },
    status: { type: GraphQLInt },
    message: { type: GraphQLString },
  }),
});

export const orderProductInputType = new GraphQLInputObjectType({
  name: "orderProductInputType",
  fields: () => ({
    product: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    variant: { type: GraphQLString },
    variantName: { type: GraphQLString },
  }),
});

export const orderCustomerType = new GraphQLObjectType({
  name: "orderCustomerType",
  fields: () => ({
    customerId: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    address: { type: addressType },
  }),
});

export const orderCustomerInputType = new GraphQLInputObjectType({
  name: "orderCustomerInputType",
  fields: () => ({
    customerId: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    address: { type: addressInputType },
  }),
});
