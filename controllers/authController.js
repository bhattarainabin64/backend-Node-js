const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const customErrorHandler = require("../middlewares/errorHandler");

exports.registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new customErrorHandler("Email already exist", 400);
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token: generateToken(user._id),
      });
    } else {
      throw new customErrorHandler("Password doesn't match", 400);
    }
  } catch (error) {
    return next(error);
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { username } = req.body;

  try {
    if (!username) {
      throw new customErrorHandler("Username is required", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { username } },
      { new: true, runValidators: true, context: "query" }
    ).select("-password,");

    if (!updatedUser) {
      throw new customErrorHandler("User not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
