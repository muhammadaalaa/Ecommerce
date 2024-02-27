import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
    },
    orderId: {
      type: Types.ObjectId,
      ref: "order",
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = model("review", reviewSchema);
export default reviewModel;
