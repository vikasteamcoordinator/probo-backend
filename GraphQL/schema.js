// ** Graphql
import pkg from "graphql";
const { GraphQLSchema, GraphQLObjectType } = pkg;

// ** Queries
import getAdmins from "./Queries/getAdmins.js";
import getRolesPrivileges from "./Queries/getRolesPrivileges.js";
import getSiteSettings from "./Queries/getSiteSettings.js";
import getCoupons from "./Queries/getCoupons.js";
import getStaticPages from "./Queries/getStaticPages.js";
import getHomepage from "./Queries/getHomepage.js";
import getSeoTitleDescs from "./Queries/getSeoTitleDescs.js";
import getShipping from "./Queries/getShipping.js";
import getProductSettings from "./Queries/getProductSettings.js";
import getCount from "./Queries/getCount.js";
import {
  getCustomer,
  getCustomers,
  getNewCustomers,
  getSuspendedCustomers,
} from "./Queries/getCustomers.js";
import getCart from "./Queries/getCart.js";
import {
  getProducts,
  getNewProducts,
  getOutOfStockProducts,
} from "./Queries/getProducts.js";
import {
  getOrders,
  getRevenue,
  getSoldProducts,
  getPrevMonthOrders,
  getLastQuarterRevenue,
} from "./Queries/getOrders.js";
import getSearchResults from "./Queries/getSearchResults.js";

// ** Mutations
import { adminLogin, admins, deleteAdmin } from "./Mutations/admins.js";
import { rolesPrivileges, deleteRole } from "./Mutations/rolesPrivileges.js";
import siteSettings from "./Mutations/siteSettings.js";
import { coupons, deleteCoupon, checkCoupon } from "./Mutations/coupons.js";
import {
  changeCustomerPassword,
  changeAdminPassword,
} from "./Mutations/changePassword.js";
import { staticPages, deleteStaticPage } from "./Mutations/staticPages.js";
import homepage from "./Mutations/homepage.js";
import {
  seoTitleDescs,
  deleteSeoTitleDesc,
} from "./Mutations/seoTitleDescs.js";
import shipping from "./Mutations/shipping.js";
import {
  productSettings,
  productVariants,
  deleteProductVariant,
} from "./Mutations/productSettings.js";
import {
  products,
  deleteProduct,
  getProductsByCategory,
  getProductsByIds,
  setTrendingProduct,
} from "./Mutations/products.js";
import authRegister from "./Mutations/authRegister.js";
import authLogin from "./Mutations/authLogin.js";
import logout from "./Mutations/logout.js";
import {
  customers,
  getCustomerById,
  addToWishlist,
} from "./Mutations/customers.js";
import {
  addToCart,
  deleteFromCart,
  changeCartQuantity,
} from "./Mutations/cart.js";
import {
  createOrder,
  editOrder,
  getOrdersByCustomer,
  getOrderById,
} from "./Mutations/orders.js";
import {
  forgotPassword,
  updatePassword,
  checkResetToken,
} from "./Mutations/passwordReset.js";
import customerEnquiry from "./Mutations/customerEnquiry.js";
import newsletter from "./Mutations/newsletter.js";
import addProductReview from "./Mutations/reviews.js";

const query = new GraphQLObjectType({
  name: "Queries",
  fields: () => ({
    getAdmins,
    getRolesPrivileges,
    getSiteSettings,
    getCoupons,
    getStaticPages,
    getHomepage,
    getSeoTitleDescs,
    getShipping,
    getProducts,
    getNewProducts,
    getOutOfStockProducts,
    getProductSettings,
    getCount,
    getCustomer,
    getCustomers,
    getNewCustomers,
    getSuspendedCustomers,
    getCart,
    getOrders,
    getRevenue,
    getSoldProducts,
    getPrevMonthOrders,
    getLastQuarterRevenue,
    getSearchResults,
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    adminLogin,
    admins,
    deleteAdmin,
    rolesPrivileges,
    deleteRole,
    changeCustomerPassword,
    changeAdminPassword,
    siteSettings,
    coupons,
    deleteCoupon,
    checkCoupon,
    staticPages,
    deleteStaticPage,
    homepage,
    seoTitleDescs,
    deleteSeoTitleDesc,
    shipping,
    productSettings,
    productVariants,
    deleteProductVariant,
    products,
    getProductsByCategory,
    getProductsByIds,
    setTrendingProduct,
    deleteProduct,
    checkCoupon,
    authRegister,
    authLogin,
    logout,
    customers,
    getCustomerById,
    addToWishlist,
    changeCustomerPassword,
    addToCart,
    deleteFromCart,
    changeCartQuantity,
    createOrder,
    editOrder,
    getOrdersByCustomer,
    getOrderById,
    forgotPassword,
    updatePassword,
    checkResetToken,
    customerEnquiry,
    newsletter,
    addProductReview,
  }),
});

const schema = new GraphQLSchema({
  query: query,
  mutation: mutation,
});

export default schema;
