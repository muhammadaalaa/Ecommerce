import Jwt from "jsonwebtoken";
import userModel from "../../DB/models/userCollection.js";
import { AppError } from "../utils/HandlingError.js";

export const auth = (roles = []) => {
  return async (req, res, next) => {
    const { token } = req.headers;
    //   console.log(token);
    if (!token) {
      return res.json({ msg: "cant find the token" });
    }
    if (!token.startsWith(process.env.BARER_KEY)) {
      return next(new AppError("invalid token", 400));
    }
    //   console.log(token);
    const baseToken = token.split(process.env.BARER_KEY)[1];
    if (!baseToken) {
      return res.json({ msg: "invalid barer key" });
    }
    // console.log(baseToken);
    const decoded = Jwt.verify(baseToken, process.env.SIGNATURE);
    // console.log(decoded);
    if (!decoded) {
      return res.json({ msg: "invalid signature" });
    }
    // console.log(decoded);
    if (!decoded.id) {
      // return res.status(400).json({ msg: "invalid token" });
      return next(new AppError("invalid token", 400));
    }
    // console.log(decoded.id);
    const user = await userModel.findById(decoded.id);
    //   console.log(user);
    if (!user) {
      return res.status(404).json({ msg: "can't find this user" });
    }
    if (user.status == "offline") {
      return res.status(404).json({ msg: "please log in first" });
    }
    if (user.Confirmed == false) {
      return res.status(404).json({ msg: "please confirm u email first" });
    }
    // console.log(user);
    if (!roles.includes(user.role)) {
      return res.status(404).json({ msg: "not auth" });
    }
    // console.log(decoded.iat);
    // console.log(parseInt(user.changePasswordAt.getTime() / 1000));
    if (parseInt(user?.changePasswordAt?.getTime() / 1000) > decoded.iat) {
      return res.status(404).json({ msg: "not auth" });
    }

    req.user = user;
    next();
  };
};
export const graphAuth = async (token, roles = []) => {
  //   console.log(token);
  if (!token) {
    throw new Error("cant find the token");
  }
  if (!token.startsWith(process.env.BARER_KEY)) {
    throw new Error("invalid token");
  }
  //   console.log(token);
  const baseToken = token.split(process.env.BARER_KEY)[1];
  if (!baseToken) {
    throw new Error("invalid barer key");
  }
  // console.log(baseToken);
  const decoded = Jwt.verify(baseToken, process.env.SIGNATURE);
  // console.log(decoded);
  if (!decoded) {
    throw new Error("invalid signature");
  }
  // console.log(decoded);
  if (!decoded.id) {
    // return res.status(400).json({ msg: "invalid token" });
    return next(new AppError("invalid token", 400));
  }
  // console.log(decoded.id);
  const user = await userModel.findById(decoded.id);
  //   console.log(user);
  if (!user) {
    throw new Error("can't find this user");
  }
  if (user.status == "offline") {
    throw new Error("please login first");
  }
  if (user.Confirmed == false) {
    throw new Error("please confirm u email first");
  }
  // console.log(user);
  if (!roles.includes(user.role)) {
    throw new Error("not auth");
  }
  // console.log(decoded.iat);
  // console.log(parseInt(user.changePasswordAt.getTime() / 1000));
  if (parseInt(user?.changePasswordAt?.getTime() / 1000) > decoded.iat) {
    throw new Error("not auth");
  }
  return user;
};
