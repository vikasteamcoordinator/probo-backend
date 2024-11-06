// ** Essential imports
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true },
    token: { type: String, required: true, unique: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900, // this is the expiry time in seconds (15 mins)
    },
  },
  { timestamps: true }
);

const Tokens = mongoose.model("Tokens", TokenSchema);

export default Tokens;
