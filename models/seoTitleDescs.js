// ** Essential imports
import mongoose from "mongoose";

const SeoTitleDescSchema = new mongoose.Schema(
  {
    pageName: { type: String },
    title: { type: String },
    desc: { type: String },
  },
  { timestamps: true }
);

const SeoTitleDescs = mongoose.model("SeoTitleDescs", SeoTitleDescSchema);

export default SeoTitleDescs;
