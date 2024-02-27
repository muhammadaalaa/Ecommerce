import bcrypt from "bcrypt";
import { AppError, asyncHandler } from "../../utils/HandlingError.js";
import userModel from "../../../DB/models/userCollection.js";
import jwt from "jsonwebtoken";
//********************************signIn********************** */
export const signIn = asyncHandler(async (req, res, next) => {
  const { phoneNumber, email, password, recoveryEmail } = req.body;
  const userExist = await userModel.findOne({
    $or: [{ email }, { phoneNumber }, { recoveryEmail }],
  });
  if (!userExist) {
    return next(new AppError("can't find this user", 500));
  }
  const isMatch = bcrypt.compareSync(password, userExist.password);
  if (!isMatch) {
    return res.status(200).json({ msg: "password is not correct" });
  }
  userExist.isLoggedIn = true;
  await userExist.save();
  const createToken = jwt.sign(
    {
      id: userExist._id,
      userName: userExist.userName,
      email: userExist.email,
      recoveryEmail: userExist.recoveryEmail,
      phoneNumber: userExist.phoneNumber,
      age: userExist.age,
      address: userExist.address,
      role: userExist.role,
      isConfirmed: userExist.isConfirmed,
      isLoggedIn: userExist.isLoggedIn,
    },
    process.env.SIGNATURE
  );
  createToken
    ? res.status(200).json({ msg: "done", createToken })
    : next(new AppError("can't create this token", 400));
});
//**********************updateUser************************** */
