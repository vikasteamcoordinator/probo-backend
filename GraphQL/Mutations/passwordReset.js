// ** Graphql
import pkg from "graphql";
const { GraphQLString, GraphQLNonNull } = pkg;

// ** Types
import { customerType } from "../Types/customerType.js";

// ** Models
import Tokens from "../../models/tokens.js";
import Customers from "../../models/customers.js";

//** Send Email
import forgotPasswordEmail from "../../emails/forgotPasswordEmail.js";
import passwordChangedEmail from "../../emails/passwordChangedEmail.js";

// ** Third Party Imports
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export const forgotPassword = {
  type: customerType,
  description: "Customer forgot password",
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args, context) => {
    try {
      // Checking email exist in database or not, if exist proceeding to next step
      const customer = await Customers.findOne({ email: args.email });

      if (customer) {
        // Deleting a previous token
        context.req.raw.res.clearCookie("access_token");
        // Deleting a customer token
        context.req.raw.res.clearCookie("fabyoh_customer");

        // Creating a token to save it in database
        const generateAccessToken = (payload) => {
          const iat = Math.floor(Date.now() / 1000);

          return new SignJWT({ ...payload })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .setExpirationTime(process.env.JWT_RESET_PASSWORD_EXPIRY)
            .sign(
              new TextEncoder().encode(process.env.JWT_RESET_PASSWORD_SECRET)
            );
        };

        const resetToken = await generateAccessToken({
          id: customer._id,
          role: "customer",
        });

        const isToken = await Tokens.findOne({ customerId: customer._id });

        // To prevent sending multiple times reset emails
        if (isToken) {
          return {
            status: 400,
            message: "Reset email already sent or try again after 15 mins",
          };
        } else {
          Tokens.create({
            customerId: customer._id,
            token: resetToken,
          });

          // Send reset link email
          const link = `${process.env.CLIENT_URL1}/reset-password/token=${resetToken}`;

          const receiver = customer.email;

          forgotPasswordEmail(link, receiver);

          return {
            status: 200,
            message: "Reset email sent to your inbox",
          };
        }
      } else {
        return {
          status: 400,
          message: "Email not exist",
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

export const updatePassword = {
  type: customerType,
  description: "Forgot password",
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const token = args.token;
      const newPassword = args.password;

      //step 1 - verifying token
      const secret = new TextEncoder().encode(
        process.env.JWT_RESET_PASSWORD_SECRET
      );

      const { payload } = await jwtVerify(token, secret);

      //step 2 - checking token is present in database or not
      const tokenData = await Tokens.findOne({ token });

      // step 3 updating the customer password with new one
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

      if (tokenData && payload.role === "customer") {
        const response = await Customers.findOneAndUpdate(
          { _id: tokenData.customerId },
          { $set: { password: hashedPassword } },
          { new: true }
        );

        //step 4 send password changed email to customer
        passwordChangedEmail(response.email);

        //step 5 delete token after successful password change
        await Tokens.findOneAndDelete({ token });

        return {
          status: 200,
          message: "Password changed",
        };
      } else {
        return {
          status: 400,
          message: "Link expired",
        };
      }
    } catch (error) {
      // Jose error code for expired tokens
      if (error.code === "ERR_JWT_EXPIRED") {
        return {
          status: 400,
          message: "Link expired",
        };
      } else {
        return {
          status: 500,
          message: error,
        };
      }
    }
  },
};

export const checkResetToken = {
  type: customerType,
  description: "Forgot password",
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_, args) => {
    try {
      const token = args.token;

      //checking token is present in database or not
      const tokenData = await Tokens.findOne({ token });

      if (tokenData) {
        return {
          status: 200,
          message: "Token exist",
        };
      } else {
        return {
          status: 400,
          message: "Token not exist",
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
