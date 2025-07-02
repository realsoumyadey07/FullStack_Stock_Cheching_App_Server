import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { AsyncHandler } from "./AsyncHandler.js";
import { User } from "../models/user.js";

export const IsAuthenticated = AsyncHandler(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token)
    return res.status(401).json({
      success: false,
      message: "Token is not found. Please log in!",
    });

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
  const user = await User.findById(decoded?.id).select("-password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid access token!",
    });
  }

  req.user = user;
  next();
});
