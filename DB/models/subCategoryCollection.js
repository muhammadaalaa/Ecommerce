import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: Object,
    addedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "category",
    },
    customPath:{
      type:String, 
      min:5
    }
  },
  {
    timestamps: true,
  }
);

const subCategoryModel = model("subCategory", subCategorySchema);

export default subCategoryModel;
