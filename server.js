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

const allowedOrigins = [
  'https://probo-admin.onrender.com', 
  'https://probo-web.onrender.com'
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}));

// Cookie parser
app.use(cookieParser());

// JSON middleware
app.use(express.json());

// Static public folder
app.use(express.static("public"));

// JWT verification
app.use(verifyToken);

// Home route
app.get("/", (req, res) => {
  res.send("Hello world");
});

// GraphQL handler
app.all(
  "/graphql",
  (req, res, next) => {
    req.res = res; // Attach res to req object
    next();
  },
  createHandler({
    schema,
    context: (req) => ({
      req,
      res: req.res,
    }),
  })
);

// Image upload and payment routes
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
    console.error("MongoDB connection error:", error);
  });

// Start server
app.listen(port, () => {
  console.log(`Backend Server Running On Port ${port} 🚀`);
});
