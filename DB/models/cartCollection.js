import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
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
      },
    ],
    userId: {
      type: Types.ObjectId,
      ref: "user",
    }, 
  },
  {
    timestamps: true,
  }
);

const cartModel = model("cart", cartSchema);

export default cartModel;
