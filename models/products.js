// ** Essential imports
import mongoose from "mongoose";
import { VariantSchema } from "./productSettings.js";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    category: { type: String },
    images: { type: Array },
    regularPrice: { type: Number },
    salePrice: { type: Number },
    tax: { type: Number },
    totalStocks: { type: Number },
    inStock: { type: Boolean },
    productType: { type: String, default: "simple" },
    variantsOptions: [{ type: VariantSchema }],
    variants: [
      {
        variantName: { type: String },
        variantsId: { type: Array },
        images: {
          type: Array,
        },
        regularPrice: { type: Number },
        salePrice: { type: Number },
        tax: { type: Number },
        totalStocks: {
          type: Number,
        },
        inStock: { type: Boolean },
      },
    ],
    trending: { type: Boolean },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reviews" }],
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", ProductSchema);

export default Products;
