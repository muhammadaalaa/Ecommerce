import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          // unique:true,
          required: true,
        },
        finalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Types.ObjectId,
      ref: "coupon",
    },
    address: {
      type: String,
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    phoneNumber: [
      {
        type: String,
        required: true,
      },
    ],
    paymentMethod: { type: String, enum: ["cash", "card"], required: true },
    status: {
      type: String,
      enum: ["placed", "waitPayment", "delivered", "cancelled"],
      default: "pending",
    },
    cancelledBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = model("order", orderSchema);

export default orderModel;
