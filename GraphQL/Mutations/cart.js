// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import cartType from "../Types/cartType.js";

// ** Models
import Cart from "../../models/carts.js";
import Products from "../../models/products.js";

// ** Third party imports
import { v4 as uuidv4 } from "uuid";

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
        variantName: foundVariant.variantName,
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

export const addToCart = {
  type: cartType,
  description: "To add a item to cart",
  args: {
    customerId: { type: GraphQLString },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: GraphQLString },
    variantName: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      let customerId;

      let cart;

      const uuid = uuidv4();

      const productId = args.productId;

      // Checking whether admin is logged or not
      if (context.req.raw.admins) {
        return {
          status: 403,
          message: "Logout from admin, then try again",
        };
      }

      // Checking the customer is logged or guest customer
      if (context.req.raw.customer) {
        customerId = context.req.raw.customer.id;
      } else if (args.customerId) {
        customerId = args.customerId;
      } else {
        customerId = uuid;
      }

      // Cart data
      let cartData = {
        customerId,
        products: [
          {
            product: productId,
            variant: args.variantId,
            variantName: args.variantName,
            quantity: 1, // default
          },
        ],
      };

      //  Checking whether the customer has cart or not
      const isCart = await Cart.findOne({ customerId });

      //  If the customer has cart, updating it, if not present, creating the cart
      if (isCart !== null) {
        // To check product is already present or not
        const isProductExist = isCart.products.find((product) => {
          if (args.variantId) {
            return (
              product.product.toString() === productId &&
              product.variant === args.variantId
            );
          } else {
            return (
              product.product.toString() === productId &&
              product.variant === undefined
            );
          }
        });

        if (isProductExist) {
          isProductExist.quantity = isProductExist.quantity + 1;

          const foundIndex = isCart.products.findIndex((product) => {
            if (args.variantId) {
              return (
                product.product.toString() === productId &&
                product.variant === args.variantId
              );
            } else {
              return (
                product.product.toString() === productId &&
                product.variant === undefined
              );
            }
          });

          isCart.products[foundIndex] = isProductExist;

          let sameProduct = {
            customerId,
            products: isCart.products,
          };

          cart = await Cart.findOneAndUpdate(
            { customerId: customerId },
            {
              $set: sameProduct,
            },
            { new: true }
          )
            .populate("products.product", "-__v")
            .exec();

          return {
            _id: cart.id,
            customerId: cart.customerId,
            products: getProductDetails(cart.products),
            status: 200,
            message: "Successfully updated the cart",
          };
        } else {
          // New product
          isCart.products.map((product) => cartData.products.unshift(product));

          cart = await Cart.findOneAndUpdate(
            { customerId: customerId },
            {
              $set: cartData,
            },
            { new: true }
          )
            .populate("products.product", "-__v")
            .exec();

          return {
            _id: cart.id,
            customerId: cart.customerId,
            products: getProductDetails(cart.products),
            status: 200,
            message: "Successfully updated the cart",
          };
        }
      } else {
        //  Creating the cart
        const response = await Cart.create(cartData);

        cart = await Cart.findById(response._id)
          .populate("products.product", "-__v")
          .exec();

        return {
          _id: cart.id,
          customerId: cart.customerId,
          products: getProductDetails(cart.products),
          status: 200,
          message: "Successfully created the cart",
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

export const changeCartQuantity = {
  type: cartType,
  description: "To change a cart item quantity",
  args: {
    customerId: { type: GraphQLString },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: GraphQLString },
    action: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      let customerId;

      let cart;

      const productId = args.productId;

      // Checking the customer is logged or a guest customer
      if (context.req.raw.customer) {
        customerId = context.req.raw.customer.id;
      } else {
        customerId = args.customerId;
      }

      // Product totalStocks
      let totalStocks;

      if (args.variantId) {
        const currentProduct = await Products.findById(productId);

        if (currentProduct) {
          const currentVariant = currentProduct.variants.find(
            (v) => v._id.toString() === args.variantId
          );

          if (currentVariant) {
            totalStocks = currentVariant.totalStocks;
          }
        }
      } else {
        const currentProduct = await Products.findById(productId).select(
          "totalStocks"
        );

        totalStocks = currentProduct?.totalStocks;
      }

      //  Checking whether the customer has cart or not
      const isCart = await Cart.findOne({ customerId });

      if (isCart === null) {
        return {
          status: 400,
          message: "Cart not available",
        };
      }

      // Cart data
      let cartData = {
        customerId,
        products: isCart.products,
      };

      const filteredProduct = isCart.products.find((product) => {
        if (args.variantId) {
          return (
            product.product.toString() === productId &&
            product.variant === args.variantId
          );
        } else {
          return (
            product.product.toString() === productId &&
            product.variant === undefined
          );
        }
      });

      // Item not found
      if (!filteredProduct) {
        return {
          status: 400,
          message: "Items not available",
        };
      }

      if (args.action === "decrement") {
        if (filteredProduct.quantity > 1) {
          filteredProduct.quantity = filteredProduct.quantity - 1;
        } else {
          filteredProduct.quantity = 1;
        }
      } else {
        // Checking stock availability
        if (filteredProduct.quantity === totalStocks) {
          return {
            status: 400,
            message: `Only ${totalStocks} items available`,
          };
        } else {
          filteredProduct.quantity = filteredProduct.quantity + 1;
        }
      }

      const foundIndex = isCart.products.findIndex((product) => {
        if (args.variantId) {
          return (
            product.product.toString() === productId &&
            product.variant === args.variantId
          );
        } else {
          return (
            product.product.toString() === productId &&
            product.variant === undefined
          );
        }
      });

      isCart.products[foundIndex] = filteredProduct;

      cart = await Cart.findOneAndUpdate(
        { customerId: customerId },
        {
          $set: cartData,
        },
        { new: true }
      )
        .populate("products.product", "-__v")
        .exec();

      return {
        _id: cart.id,
        customerId: cart.customerId,
        products: getProductDetails(cart.products),
        status: 200,
        message: "Successfully changed the quantity",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export const deleteFromCart = {
  type: cartType,
  description: "To delete a item in a cart",
  args: {
    customerId: { type: GraphQLString },
    productId: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: GraphQLString },
  },
  resolve: async (_, args, context) => {
    try {
      let customerId;

      let cart;

      const productId = args.productId;

      // Checking the customer is logged or guest customer
      if (context.req.raw.customer) {
        customerId = context.req.raw.customer.id;
      } else {
        customerId = args.customerId;
      }

      //  Checking whether the customer has cart or not
      const isCart = await Cart.findOne({ customerId });

      const foundIndex = isCart.products.findIndex((product) => {
        if (args.variantId) {
          return (
            product.product.toString() === productId &&
            product.variant === args.variantId
          );
        } else {
          return (
            product.product.toString() === productId &&
            product.variant === undefined
          );
        }
      });

      // Item not found
      if (foundIndex === -1) {
        return {
          status: 400,
          message: "Items not available",
        };
      }

      isCart.products.splice(foundIndex, 1);

      // Cart data
      let cartData = {
        customerId,
        products: isCart.products,
      };

      //  If cart has no products, deleting the cart, else update the cart
      if (cartData.products.length > 0) {
        cart = await Cart.findOneAndUpdate(
          { customerId },
          {
            $set: cartData,
          },
          { new: true }
        )
          .populate("products.product", "-__v")
          .exec();

        return {
          _id: cart.id,
          customerId: cart.customerId,
          products: getProductDetails(cart.products),
          status: 200,
          message: "Successfully updated the cart",
        };
      } else {
        cart = await Cart.findOneAndDelete({ customerId }, { new: true });

        return {
          _id: cart.id,
          customerId: cart.customerId,
          products: [],
          status: 200,
          message: "Successfully deleted the cart",
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
