import mongoose from "mongoose";

const checkoutSchema = mongoose.Schema(
  {
    shop: {
      type: "String",
      required: true,
    },
    config: {
      type: "Object",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Checkout", checkoutSchema);
