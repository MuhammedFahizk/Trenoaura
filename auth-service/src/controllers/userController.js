import CustomError from "../config/errors/CustomError.js";
import { User } from "../models/user.js";

export const registerUser = async ({ userName, email, password, role = "user" }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("existing user");

      throw new CustomError(
        "Email already exists!",
        "VALIDATION_ERROR",
        400,
        "Try logging in."
      );
    }

    const newUser = new User({
      username: userName,
      email,
      password,
      role,
    });

    await newUser.save();

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    return {
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Registration Error:", error);
    if (error instanceof CustomError || error.extensions?.code) {
      throw error;
    }
    throw new CustomError(
      "Something went wrong during registration!",
      "INTERNAL_SERVER_ERROR",
      500,
      error.message || "An unexpected error occurred."
    );
  }
};


export const signInUser = async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError(
          "User not found!",
          "NOT_FOUND",
          404,
          "Check your email or register."
        );
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new CustomError(
          "Invalid credentials!",
          "INVALID_CREDENTIAL",
          401,
          "Incorrect password."
        );
      }
  
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
  
      return {
        message: "Login successful!",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error in signInUser:", error);
      if (error instanceof CustomError || error.extensions?.code) {
        throw error;
      }
      throw new CustomError(
        "Something went wrong during sign-in!",
        "INTERNAL_SERVER_ERROR",
        500,
        error.message || "An unexpected error occurred."
      );
    }
  };
  
export const getProfile = async (_, args, { user }) => {
  if (!user) {
    throw new CustomError("Authentication required!", 401, "Please log in.");
  }
  return getProfile(user.id);
};
