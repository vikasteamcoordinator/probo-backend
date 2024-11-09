// ** Essential imports
import "dotenv/config";
import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./GraphQL/schema.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logosUpload from "./Routes/logosUpload.js";
import homeImgUpload from "./Routes/homeImgUpload.js";
import productImgUpload from "./Routes/productImgUpload.js";
import profileUpload from "./Routes/profileUpload.js";
import reviewMediaUpload from "./Routes/reviewMediaUpload.js";
import stripePayment from "./Routes/stripePayment.js";
import razorpay from "./Routes/razorpay.js";
import { googleAuth } from "./Routes/oauth.js";
import verifyToken from "./middlewares/verifyToken.js";

const app = express();
const port = process.env.PORT || 5000;

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL1 || 'https://probo-admin.onrender.com',
  process.env.CLIENT_URL2 || 'https://probo-web.onrender.com'
];

// Middlewares
app.use(express.json());

// Single CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from allowed origins or non-browser clients (no origin)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
  })
);

// Cookie parser
app.use(cookieParser());

// JWT token verification
app.use(verifyToken);

// Public folder
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.send("Hello world");
});

// GraphQL endpoint
app.all(
  "/graphql",
  (req, res, next) => {
    req.res = res; // Attach res to req object
    next();
  },
  createHandler({
    schema,
    context: (req) => {
      return {
        req,
        res: req.res,
      };
    },
  })
);

// Routes
logosUpload(app);
homeImgUpload(app);
productImgUpload(app);
profileUpload(app);
reviewMediaUpload(app);
stripePayment(app);
razorpay(app);
googleAuth(app);

// MongoDB connection
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb DB Connected Successfully 🚀");
  })
  .catch((error) => {
    console.log(error);
  });

// Start server on specified port
app.listen(port, () => {
  console.log(`Backend Server Running On Port ${port} 🚀`);
});

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS Error: Access Denied' });
  } else {
    next(err);
  }
});
