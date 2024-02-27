import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      lowerCase: true,
    },
    slug: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
      lowerCase: true,
      required: true,
    },
    image: Object,
    addedBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    customPath:{
      type: String,
      unique: true,
      minlength: 5
    }
  },
  {
    timestamps: true,
  }
);

const categoryModel = model("category", categorySchema);

export default categoryModel;
