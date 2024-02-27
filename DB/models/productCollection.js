import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    customPath: {
      type: String,
      required: true,
    },
    images: [Object],
    price: { type: Number, required: true },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: { type: Number, required: true },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    stock: { type: Number, required: true }, // how many items are available in the store
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
    brandId: {
      type: Types.ObjectId,
      ref: "brand",
    },
    totalReviewers: {
      type: Number,
      default: 0,
    },
    averageRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = model("product", productSchema);
export default productModel;
