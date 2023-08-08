import mongoose from "mongoose";

const SettingSchema = mongoose.Schema(
  {
    shop: {
      type: "String",
      required: true,
    },
    settings: {
      type: "Object",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("setting", SettingSchema);
