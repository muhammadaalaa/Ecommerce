import bcrypt, { hash } from "bcrypt";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import userModel from "../../../DB/models/userCollection.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmail.js";
import { nanoid } from "nanoid";
import categoryModel from "../../../DB/models/categoryCollection.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import brandModel from "../../../DB/models/brandCollection.js";
import subCategoryModel from "../../../DB/models/subCategoryCollection.js";
//*************************************createCategory ****************************** */
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (categoryExist) {
    return next(new AppError("category is already existed", 500));
  }
  const customPath = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce/categories/${customPath}`,
    }
  );
  req.file = `eCommerce/categories/${customPath}`;
  // const x =4
  // x=5
  const slug = slugify(name, { replacement: "_", lower: true });

  const createdCategory = await categoryModel.create({
    name,
    slug,
    image: { secure_url, public_id },
    addedBy: req.user._id,
    customPath,
  });
  req.savedDocument = {
    model:categoryModel,
    id: createdCategory._id,
  };
  // const x = 4;
  // x = 5;
  createdCategory
    ? res.status(200).json({ msg: "done", createdCategory })
    : next(new AppError("can't create this category", 400));
});
//*************************************update category ****************************** */
export const updateCategory = asyncHandler(async (req, res, next) => {
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
//*************************************delete category ****************************** */
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  const categoryExist = await categoryModel.findOneAndDelete({
    _id: id,
    addedBy: req.user._id,
  });
  if (!categoryExist) {
    return next(new AppError("can't find this category ", 404));
  }
  //Delete form subCategory
  const inSubCategory = await subCategoryModel.deleteMany({
    categoryId: id,
    addedBy: req.user._id,
  });
  if (!inSubCategory) {
    return next(new AppError("can't find this subCategory ", 404));
  }
  //Delete form subCategory
  const inBrand = await brandModel.deleteMany({ categoryId: id });
  if (!inBrand) {
    return next(new AppError("can't find this brand ", 404));
  }
  //delete from Cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `eCommerce/category/${categoryExist.customPath}`
  );
  await cloudinary.api.delete_folder(`eCommerce/category`);
  return res.status(204).json({ msg: "done" });
});
