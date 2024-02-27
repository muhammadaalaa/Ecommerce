import bcrypt, { hash } from "bcrypt";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/categoryCollection.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../DB/models/subCategoryCollection.js";
import brandModel from "../../../DB/models/brandCollection.js";
import productModel from "../../../DB/models/productCollection.js";
import userModel from "../../../DB/models/userCollection.js";
import ApiFeatures from "../../utils/apiFeatures.js";
//*************************************create brand ****************************** */
export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    title,
    desc,
    price,
    discount,
    stock,
    categoryId,
    subCategoryId,
    brandId,
  } = req.body;
  const isAvailable = stock > 0;
  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
    addedBy: req.user._id,
  });
  if (!categoryExist) {
    throw new AppError("can't find this category", 401);
  }
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategoryId,
    addedBy: req.user._id,
  });
  if (!subCategoryExist) {
    throw new AppError("can't find this subCategory", 401);
  }
  const brandExist = await brandModel.findOne({
    _id: brandId,
    addedBy: req.user._id,
  });
  if (!brandExist) {
    return next(new AppError("can't find this brand ", 500));
  }
  const productExist = await productModel.findOne({
    title: title.toLowerCase(),
    addedBy: req.user._id,
  });
  if (productExist) {
    return next(new AppError("product is already exist", 500));
  }
  const slug = slugify(title, { replacement: "_", lower: true });
  const customPath = nanoid(5);
  let arr = [];
  let arrIds = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${brandExist.customPath}/products/${customPath}`,
      }
    );
    arr.push({ secure_url, public_id });
    arrIds.push(public_id);
  }
  let priceAfterDiscount = price - price * ((discount || 0) / 100);
  const createProduct = await productModel.create({
    title: title.toLowerCase(),
    slug,
    desc,
    images: arr,
    discount,
    priceAfterDiscount,
    stock,
    isAvailable,
    price,
    addedBy: req.user._id,
    categoryId: categoryId,
    subCategoryId: subCategoryId,
    brandId: brandId,
    customPath,
  });
  // const createBrand = null
  if (!createProduct) {
    await cloudinary.api.delete_resources(arrIds);
    await cloudinary.api.delete_folder(
      `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${brandExist.customPath}/product`
    );
  }
  createProduct
    ? res.status(200).json({ msg: "done", createProduct })
    : next(new AppError("can't create this Product", 400));
});
//*************************************update brand ****************************** */
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId, id } = req.body;

  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
  });
  if (!categoryExist) {
    return next(new AppError("can't find this category ", 404));
  }
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategoryId,
  });
  if (!subCategoryExist) {
    return next(new AppError("can't find this category ", 404));
  }

  const brandExist = await brandModel.findOne({
    _id: id,
  });
  if (!brandExist) {
    return next(new AppError("can't find this brand ", 404));
  }
  if (name) {
    if (name == brandExist.name) {
      next(new AppError("this name match old name ", 400));
    }
    if (await brandModel.findOne({ name: name.toLowerCase() })) {
      next(new AppError("name is already exist in dataBase ", 400));
    }
    const slug = slugify(name, { replacement: "_" });
    brandExist.name = name;
    brandExist.slug = slug;
  }
  console.log(brandExist);
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${brandExist.customPath}`,
      }
    );
    await cloudinary.uploader.destroy(brandExist.Logo.public_id);
    brandExist.image = { secure_url, public_id };
  }
  if (!brandExist) {
    if (brandExist.Logo.public_id) {
      await cloudinary.uploader.destroy(brandExist.Logo.public_id);
    }
  }
  await brandExist.save();
  brandExist
    ? res.status(200).json({ msg: "done", brandExist })
    : next(new AppError("can't update this brand ", 400));
});
//*************************************wishList ****************************** */
export const addToWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const productCheck = await productModel.findOne({
    _id: productId,
  });
  if (!productCheck) {
    return next(new AppError("can't find this product ", 404));
  }
  const addProductToWishList = await userModel.findOneAndUpdate(
    { _id: req.user._id, wishList: { $nin: [productId] } },
    { $addToSet: { wishList: productId } },
    { new: true }
  );
  addProductToWishList
    ? res.status(200).json({ msg: "done", addProductToWishList })
    : next(new AppError("can't  ", 400));
});
//*************************************wishList ****************************** */
export const removeFromWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const productCheck = await productModel.findOne({
    _id: productId,
  });
  if (!productCheck) {
    return next(new AppError("can't find this product ", 404));
  }
  const removeProductToWishList = await userModel.findOneAndUpdate(
    { _id: req.user._id, wishList: { $in: [productId] } },
    { $pull: { wishList: productId } },
    { new: true }
  );
  removeProductToWishList
    ? res.status(200).json({ msg: "done", removeProductToWishList })
    : next(new AppError("can't  ", 400));
});
//******************************************************************************* */
export const handlingProduct = asyncHandler(async (req, res, next) => {
  // filter
  // sort
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .select()
    .search()
    .sort()
    .filter();

  const product = await apiFeatures.mongooseQuery;
  
  res.status(200).json({ msg: "done", product });
});
