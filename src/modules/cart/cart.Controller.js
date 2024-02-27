import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import couponModel from "../../../DB/models/couponCollection.js";
import cartModel from "../../../DB/models/cartCollection.js";
import productModel from "../../../DB/models/productCollection.js";
//*************************************createCart ****************************** */
export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cartExist = await cartModel.findOne({ userId: req.user._id });
  if (!cartExist) {
    await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
  }
  // if (await productModel.findById(productId).then((prod) => prod.stock < quantity)) {
  const product = await productModel.findOne({
    _id: productId,
    stock: {
      $gte: quantity,
    },
  });
  if (!product) {
    return next(
      new AppError(
        "can't find this product or this quantity is bigger than product of the stock",
        500
      )
    );
  }
  if (!cartExist) {
    const cart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    res.status(201).json({ msg: "done", cart });
  }
  let flag = false;

  for (const product of cartExist.products) {
    if (product.productId == productId) {
      // toObject
      product.quantity = quantity;
      flag = true;
      break;
    }
  }
  if (!flag) {
    cartExist.products.push({ productId, quantity });
  }
  await cartExist.save();
  res.status(200).json({ msg: "done", cartExist });
});
//*************************************updateCoupon ******************************
export const removeCart = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const cartExist = await cartModel.findOneAndUpdate(
    {
      "products.productId": id,
      userId: req.user._id,
    },
    {
      $pull: { products: { productId: id } },
    },
    { new: true }
  );
  res.status(200).json({ msg: "done", cartExist });
});
//*************************************updateCoupon ******************************
export const clearCart = asyncHandler(async (req, res, next) => {
  const cartExist = await cartModel.findOneAndUpdate(
    {
      userId: req.user._id,
    },
    {
      products: [],
    },
    { new: true }
  );
  res.status(200).json({ msg: "done", cartExist });
});
//*************************************updateCoupon ******************************
