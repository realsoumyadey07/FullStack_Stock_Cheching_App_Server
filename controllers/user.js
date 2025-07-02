import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { User } from "../models/user.js";

export const userRegister = AsyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((i) => i?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        // user exists
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong while registering user!",
      });
    }
    const access_token = await generateAccessToken(createdUser._id);
    const cookiesOption = {
      httpOnly: true,
      secure: false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxAge: 10 * 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .cookie("access_token", access_token, cookiesOption)
      .json({
        success: true,
        user: createdUser,
        access_token,
        message: "User successfully created!",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const access_token = await user.signAccessToken();
    return access_token;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while generating acess token!"
    );
  }
};

export const userLogin = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((i) => i?.trim === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    if (req.cookies.access_token) {
      return res.status(200).json({
        success: true,
        message: "User is already loggedin!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exists",
      });
    }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Password is not corrent!",
      });
    }
    const access_token = await generateAccessToken(user._id);
    const loggedinUser = await User.findById(user._id).select("-password");
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxAge: 10 * 24 * 60 * 60 * 1000,
    };
    return res
      .status(200)
      .cookie("access_token", access_token, cookiesOption)
      .json({
        success: true,
        user: loggedinUser,
        access_token,
        message: "User loggedin successfully!",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "internal server error!",
    });
  }
});

export const userLogout = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    }
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };
    return res.status(200).clearCookie("access_token", cookiesOption).json({
      success: true,
      user,
      message: "User logged out successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});
