import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowerCase:true
    },
    slug: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    customPath: {
      type: String,
    },
    Logo: Object,
    addedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "category",
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "subCategory",
    },
  },
  {
    timestamps: true,
  }
);

const brandModel = model("brand", brandSchema);

export default brandModel;
