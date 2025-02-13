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
  



/**
 * 2. 
 * @function getProfile
 * @description Fetches the authenticated user's profile
 * @param {Object} user - The authenticated user object from context
 * @returns {Object} - User profile data
 * @throws {CustomError} - Throws a `CustomError` if user is not found
 */
export const getProfile = async (user) => {
  try {
    if (!user) {
      throw new CustomError(
        "Authentication required!",
        "UNAUTHORIZED",
        401,
        "Please log in."
      );
    }

    const foundUser = await User.findById(user.id).select("-password"); // Exclude password field

    if (!foundUser) {
      throw new CustomError(
        "User not found!",
        "NOT_FOUND",
        404,
        "Profile data not available."
      );
    }

    return {
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    };
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error instanceof CustomError ? error : new CustomError(
      "Something went wrong while fetching the profile!",
      "INTERNAL_SERVER_ERROR",
      500,
      error.message
    );
  }
};



/*
.3 
*/

export const refreshAccessToken = async ( refreshToken ) => {
    try {
        if (!refreshToken) {
            throw new CustomError(
              "Refresh token is missing!",
              "UNAUTHORIZED",
              401,
              "Please provide a valid refresh token."
            );
          }

          const user = await User.verifyRefreshToken(refreshToken);

          if (!user) {
            throw new CustomError(
              "Refresh token is invalid!",
              "UNAUTHORIZED",
              401,
              "Please log in again."
            );
          }

        const newAccessToken = user.generateAccessToken();
        
        return { accessToken: newAccessToken };

    }
    catch (error) {
        console.error("Error in refreshAccessToken:", error);
        throw error instanceof CustomError ? error : new CustomError(
            "Something went wrong while generate access token !",
            "INTERNAL_SERVER_ERROR",
            500,
            error.message
          );
        }
    
}
 