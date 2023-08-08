import mongoose from "mongoose";

const FaqSettingSchema = mongoose.Schema(
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

export default mongoose.model("faq-setting", FaqSettingSchema);
