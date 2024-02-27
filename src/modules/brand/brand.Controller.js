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
import brandModel from "../../../DB/models/brandCollection.js";
//*************************************create brand ****************************** */
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name, desc } = req.body;

  const { categoryId, subCategoryId } = req.params;
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
    name: name.toLowerCase(),
    addedBy: req.user._id,
  })
  if (brandExist) {
    return next(new AppError("brand is already existed", 500));
  }
  const slug = slugify(name, { replacement: "_", lower: true });
  const customPath = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${customPath}`,
    }
  );
  const createBrand = await brandModel.create({
    name: name.toLowerCase(),
    slug,
    desc,
    Logo: { secure_url, public_id },
    addedBy: req.user._id,
    categoryId: categoryExist._id,
    subCategoryId: subCategoryExist._id,
    customPath,
  });
  // const createBrand = null
  if (!createBrand) {
    await cloudinary.api.delete_resources_by_prefix(
      `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${customPath}`
    );
    await cloudinary.api.delete_folder(
      `eCommerce/category/${categoryExist.customPath}/Sub-Categories/${subCategoryExist.customPath}/brands/${customPath}`
    );
  }
  createBrand
    ? res.status(200).json({ msg: "done", createBrand })
    : next(new AppError("can't create this brand", 400));
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
  // console.log(brandExist);
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
