import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import couponModel from "../../../DB/models/couponCollection.js";
import orderModel from "../../../DB/models/orderCollection.js";
import reviewModel from "../../../DB/models/reviewCollection.js";
import productModel from "../../../DB/models/productCollection.js";
//*************************************createCoupon ****************************** */
export const createReview = asyncHandler(async (req, res, next) => {
  const { orderId, comment, rate } = req.body;
  const { productId } = req.params;

  const product = await productModel.findOne({ _id: productId });
  if (!product) throw new AppError("Product not found", 404);
  const orderCheck = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
    status: "delivered",
  });
  if (!orderCheck) {
    return next(new AppError("no order found", 500));
  }
  const reviewCheck = await reviewModel.findOne({
    userId: req.user._id,
    productId: productId,
    orderId: orderId,
  });
  if (reviewCheck) {
    return next(new AppError("you already review this product!", 401));
  }
  const createdReview = await reviewModel.create({
    comment,
    rate,
    userId: req.user._id,
    productId,
    orderId,
  });

  // const reviews = await reviewModel.find({ productId });

  // let sum = 0;
  // for (const review of reviews) {
  //   sum += review.rate;
  // }
  let sum = product.totalReviewers * product.averageRate;
  sum = sum + rate;

  product.averageRate = sum / (product.totalReviewers + 1);
  product.totalReviewers += 1;
  await product.save();
  createdReview
    ? res.status(200).json({ msg: "done", createdReview })
    : next(new AppError("can't create this coupon", 400));
});
//*************************************createCoupon ****************************** */
export const removeReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;
  const { productId } = req.params;

  const product = await productModel.findOne({ _id: productId });
  if (!product) throw new AppError("Product not found", 404);

  const reviewExist = await reviewModel.findOneAndDelete({
    userId: req.user._id,
    productId,
    orderId,
  });

  let sum = product.totalReviewers * product.averageRate;
  sum = sum - reviewExist.rate;

  product.averageRate = sum / (product.totalReviewers - 1);
  product.totalReviewers -= 1;
  await product.save();
  reviewExist
    ? res.status(200).json({ msg: "done" })
    : next(new AppError("can't create this coupon", 400));
});
