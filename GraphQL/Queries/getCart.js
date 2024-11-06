// ** Graphql
import pkg from "graphql";
const { GraphQLString } = pkg;

//** Types
import cartType from "../Types/cartType.js";

// ** Models
import Cart from "../../models/carts.js";

// To get the required products details
const getProductDetails = (products) => {
  const productsDetails = [];

  products.map((product) => {
    if (product.variant) {
      // Variable product
      const foundVariant = product.product.variants.find((item) => {
        return item._id.toString() === product.variant;
      });

      productsDetails.push({
        product: {
          _id: product.product._id,
          title: product.product.title,
          images: foundVariant?.images,
          salePrice: foundVariant?.salePrice,
          tax: foundVariant?.tax,
          inStock: foundVariant?.inStock,
        },
        variant: product.variant,
        variantName: product.variantName,
        quantity: product.quantity,
      });
    } else {
      // Simple product
      productsDetails.push({
        product: {
          _id: product.product._id,
          title: product.product.title,
          images: product.product.images,
          salePrice: product.product.salePrice,
          tax: product.product.tax,
          inStock: product.product.inStock,
        },
        quantity: product.quantity,
      });
    }
  });

  return productsDetails;
};

const getCart = {
  type: cartType,
  description: "To get the cart based on customer id",
  args: {
    customerId: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      // Checking whether the customer is logged in or a guest customer
      const customerId = context.req.raw.customer
        ? context.req.raw.customer.id
        : args.customerId;

      const cart = await Cart.findOne({ customerId })
        .populate("products.product", "-__v")
        .exec();

      if (cart === null) {
        return {
          products: [],
        };
      } else {
        return {
          _id: cart.id,
          customerId: cart.customerId,
          products: getProductDetails(cart.products),
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

export default getCart;
