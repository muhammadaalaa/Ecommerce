import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import couponModel from "../../../DB/models/couponCollection.js";
//*************************************createCoupon ****************************** */
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode, couponAmount, formDate, toDate } = req.body;
  const couponExist = await couponModel.findOne({
    couponCode: couponCode.toLowerCase(),
  });
  if (couponExist) {
    return next(new AppError("coupon is already existed", 500));
  }
  const createdCoupon = await couponModel.create({
    couponCode: couponCode.toLowerCase(),
    couponAmount,
    formDate,
    toDate,
    addedBy: req.user._id,
  });
  createdCoupon
    ? res.status(200).json({ msg: "done", createdCoupon })
    : next(new AppError("can't create this coupon", 400));
});
//*************************************updateCoupon ****************************** */
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode, couponAmount, formDate, toDate } = req.body;
  const couponExist = await couponModel.findById(req.params.id);
  if (!couponExist) {
    return next(new AppError("can't find this coupon", 500));
  }
  if (couponCode) {
    if (couponCode.toLowerCase() == couponExist.couponCode) {
      return next(new AppError("coupon match old name", 500));
    }
    if (await couponModel.findOne({ couponCode: couponCode.toLowerCase() })) {
      return next(new AppError("coupon is already exist", 500));
    }
    couponExist.couponCode = couponCode;
  }
  if (formDate || toDate) {
    if (
      await couponModel.findOne({
        _id: req.params.id,
        $or: [{ formDate: formDate }, { toDate: toDate }],
      })
    ) {
      return next(new AppError("this is matching old Date", 500));
    }
    couponExist.formDate = formDate;
    couponExist.toDate = toDate;
  }
  if (couponAmount) {
    if (couponExist.couponAmount == couponAmount) {
      return next(
        new AppError("updated please change this value to update again", 500)
      );
    }
  }
  await couponExist.save();
  couponExist
    ? res.status(200).json({ msg: "done", couponExist })
    : next(new AppError("can't create this coupon", 400));
});
//*************************************************************************************** */