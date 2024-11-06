// ** Essential imports
import mongoose from "mongoose";

// Variant schema
export const VariantSchema = new mongoose.Schema({
  name: { type: String },
  options: [
    {
      variantId: { type: String },
      value: { type: String },
      meta: { type: String },
    },
  ],
});

const ProductSettingsSchema = new mongoose.Schema(
  {
    categories: { type: Array },
    variants: [{ type: VariantSchema }],
    productCardType: { type: String },
  },
  { timestamps: true }
);

export const ProductSettings = mongoose.model(
  "ProductSettings",
  ProductSettingsSchema
);
