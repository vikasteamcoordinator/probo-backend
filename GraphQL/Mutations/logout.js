//** Types
import { customerType } from "../Types/customerType.js";

const logout = {
  type: customerType,
  description: "To logout the customer or admin",
  resolve: async (_, args, context) => {
    try {
      if (context.req.raw.customer) {
        // Clearing access token
        context.req.raw.res.clearCookie("access_token", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });

        // Clearing customer token
        context.req.raw.res.clearCookie("fabyoh_customer", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });
      } else {
        // Clearing access token of admins
        context.req.raw.res.clearCookie("access_token", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });

        // Clearing role of admins
        context.req.raw.res.clearCookie("role", {
          domain: new URL(process.env.CLIENT_URL1).hostname, // store domain
          path: "/",
        });
      }

      return {
        status: 200,
        message: "Successfully logged out",
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  },
};

export default logout;
