import bcrypt, { hash } from "bcrypt";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import userModel from "../../../DB/models/userCollection.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmail.js";
import { nanoid } from "nanoid";
//*************************************create User ****************************** */
export const createUser = asyncHandler(async (req, res, next) => {
  const {
    userName,
    email,
    password,
    age,
    gender,
    recoveryEmail,
    role,
    phoneNumber,
    address,
  } = req.body;
  if (email == recoveryEmail) {
    return next(new AppError("Email and recoveryEmail must be different", 500));
  }
  const userExist = await userModel.findOne({
    $or: [{ email }, { phoneNumber }, { recoveryEmail }],
  });
  if (userExist) {
    return next(new AppError("Email or Phone number already existed", 500));
  }
  const token = jwt.sign({ email }, process.env.SIGNATURE, {
    expiresIn: 3 * 60,
  });
  const link = `http://localhost:3000/auth/confirmEmail/${token}`;
  const refToken = jwt.sign({ email }, process.env.SIGNATURE);
  const refLink = `http://localhost:3000/auth/reConfirmEmail/${refToken}`;
  const sendingEmail = sendEmail({
    email,
    subject: "confirm Email",
    html: `<a href = '${link}'>press here to confirm your account</a><br>
    <a href = '${refLink}'>press here to resend token to confirm your account</a>`,
  });
  if (!sendingEmail) {
    return next(new AppError("Failed sending email to this user", 500));
  }
  const hash = bcrypt.hashSync(password, +process.env.SaltRound);
  const user = await userModel.create({
    userName,
    email,
    password: hash,
    age,
    gender,
    recoveryEmail,
    role,
    phoneNumber,
    address,
  });
  user
    ? res.status(200).json({ msg: "done", user })
    : next(new AppError("can't create this user", 400));
});
//*************************************confirm Email ****************************** */
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.SIGNATURE);
  if (!decoded?.email) {
    return next(new AppError("invalidToken", 500));
  }
  const updateConfirm = await userModel.findOne({
    $and: [{ email: decoded.email }, { Confirmed: false }],
  });
  await userModel.updateOne({ email: decoded.email }, { Confirmed: true });
  updateConfirm
    ? res.status(201).json({ msg: "Done" })
    : next(new AppError("This email is confirmed please login", 400));
});
//*******************************************refreshToken***************************************** */
export const reConfirmEmail = asyncHandler(async (req, res, next) => {
  const { refToken } = req.params;
  const decoded = jwt.verify(refToken, process.env.SIGNATURE);
  if (!decoded.email) {
    return next(new AppError("invalidToken", 500));
  }
  const user = await userModel.findOne({
    email: decoded.email,
    Confirmed: false,
  });
  if (!user) {
    return next(new AppError("already confirmed", 500));
  }
  const token = jwt.sign({ email: user.email }, process.env.SIGNATURE, {
    expiresIn: 20 * 60,
  });
  const link = `http://localhost:3000/auth/ConfirmEmail/${token}`;

  const sendingEmail = sendEmail({
    email: user.email,
    subject: "confirm Email",
    html: `<a href = '${link}'>press here to confirm your account</a>`,
  });
  if (!sendingEmail) {
    return next(new AppError("Failed sending email to this user", 500));
  }
  return res.status(200).json({ msg: "done" });
});
//*********************************forgetPassword ***************************/
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  const checkExistence = await userModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (!checkExistence) {
    return next(new AppError("can't find this user", 404));
  }
  if (checkExistence.code) {
    return next(new AppError("this user already has a code", 404));
  }
  const code = nanoid(4);
  const sendingEmail = sendEmail({
    email: email,
    subject: "restorePassword",
    html: `<h1>ur code is ${code} </h1>`,
  });
  if (!sendingEmail) {
    return next(new AppError("failed to send code to this email", 404));
  }
  await userModel.updateOne(
    { email: checkExistence.email },
    { code, recoveryCodeSentAt: new Date() }
  );
  return res.status(200).json({ msg: "done" });
});
//*********************************restPassword ***************************/
export const restPassword = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, newPassword, code } = req.body;
  const checkExistence = await userModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (!checkExistence) {
    return next(new AppError("can't find this user", 404));
  }
  if (!checkExistence.code) {
    return next(
      new AppError("please press forget code first to send u a code", 404)
    );
  }
  const expirationTime = 60 * 3000; // e.g 3 min in mille sec
  const recoveryCodeSentAtInMilleSec = new Date(
    checkExistence.recoveryCodeSentAt
  ).getTime();
  const currentTime = new Date().getTime();
  if (currentTime - recoveryCodeSentAtInMilleSec > expirationTime) {
    checkExistence.code = "";
    await checkExistence.save();
    return next(new AppError("the code is expired ", 400));
  }
  if (checkExistence.code !== code) {
    return next(new AppError("the code is not correct", 404));
  }
  const hash = bcrypt.hashSync(newPassword,+process.env.SaltRound);
  await userModel.updateOne(
    { email: checkExistence.email },
    { password: hash, code: "" ,changePasswordAt:new Date.now()}
  );
  return res.status(200).json({ msg: "done" });
});
//*