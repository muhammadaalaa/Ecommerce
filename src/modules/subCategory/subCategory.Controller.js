import bcrypt, { hash } from "bcrypt";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import userModel from "../../../DB/models/userCollection.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmail.js";
import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/categoryCollection.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../DB/models/subCategoryCollection.js";
//*************************************createSubCategory ****************************** */
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
    addedBy: req.user._id,
  });
  if (!categoryExist) throw new AppError("can't find this category", 401);
  const SubCategoryExist = await subCategoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (SubCategoryExist) {
    return next(new AppError("category is already existed", 500));
  }
  const slug = slugify(name, { replacement: "_", lower: true });
  const customPath = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${customPath}`,
    }
  );
  const createSubCategory = await subCategoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    addedBy: req.user._id,
    categoryId,
    customPath,
  });
  if (!createSubCategory) {
    await cloudinary.uploader.destroy(public_id);
  }
  createSubCategory
    ? res.status(200).json({ msg: "done", createSubCategory })
    : next(new AppError("can't create this category", 400));
});
//*************************************update SubCategory ****************************** */
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;

  const categoryExist = await categoryModel.findOne({
    _id: categoryId,
  });
  if (!categoryExist) {
    return next(new AppError("can't find this category ", 404));
  }
  const subCategoryExist = await subCategoryModel.findOne({
    _id: req.params.id,
  });
  if (!subCategoryExist) {
    return next(new AppError("can't find this category ", 404));
  }
  if (name) {
    if (name == subCategoryExist.name) {
      next(new AppError("this name match old name ", 400));
    }
    if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
      next(new AppError("name is already exist in dataBase ", 400));
    }
    const slug = slugify(name, { replacement: "_" });
    subCategoryExist.name = name;
    subCategoryExist.slug = slug;
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}`,
      }
    );
    await cloudinary.uploader.destroy(subCategoryExist.image.public_id);
    subCategoryExist.image = { secure_url, public_id };
  }
  if (!subCategoryExist) {
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  }
  await subCategoryExist.save();
  subCategoryExist
    ? res.status(200).json({ msg: "done", subCategoryExist })
    : next(new AppError("can't update this category ", 400));
});
//*************************************update SubCategory ****************************** */
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  });
  if (!categoryExist) {
    return next(new AppError("can't find this category ", 404));
  }
  if (name) {
    if (name == categoryExist.name) {
      next(new AppError("this name match old name ", 400));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      next(new AppError("name is already exist in dataBase ", 400));
    }
    const slug = slugify(name, { replacement: "_" });
    categoryExist.name = name;
    categoryExist.slug = slug;
  }
  if (req.file) {
    await cloudinary.uploader.destroy(categoryExist.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce/category/${categoryExist.customPath}`,
      }
    );
    categoryExist.image = { secure_url, public_id };
  }
  if (!categoryExist) {
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }
  }
  await categoryExist.save();
  categoryExist
    ? res.status(200).json({ msg: "done", categoryExist })
    : next(new AppError("can't update this category ", 400));
});
