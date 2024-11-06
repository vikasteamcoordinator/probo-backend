// ** Essential imports
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        variant: { type: String },
        variantName: { type: String },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const Carts = mongoose.model("Carts", CartSchema);

export default Carts;
