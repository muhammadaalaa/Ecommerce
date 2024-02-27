import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    recoveryEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    Confirmed: {
      type: Boolean,
      default: false,     
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    code:{
      type: String,
    },
    recoveryCodeSentAt:{
      type: Date,
    },
    changePasswordAt:{
      type: Date,
    },
    wishList: [
      {
        type: Types.ObjectId, 
        ref: "Product", 
      }
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = model("user", userSchema);

export default userModel;
