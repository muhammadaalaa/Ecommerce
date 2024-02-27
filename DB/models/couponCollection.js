import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique:true
    },
    couponAmount: {
      type: String,
      required: true,
      min: 1,
      max: 100,
    },
    usersUsedThisCoupon: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    formDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    addedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = model("coupon", couponSchema);

export default couponModel;
