import CustomError from "../config/errors/CustomError.js";
import { User } from "../models/user.js";

export const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",
  },

  Mutation: {
    /**
     * .1 . Create a new user
     * @mutation registerUser
     * @description User Registration Mutation
     * @access Public
     * @param {Object} _ - GraphQL parent object (not used here)
     * @param {Object} args - Arguments for user registration
     * @param {string} args.userName - The username of the new user
     * @param {string} args.email - The email of the new user
     * @param {string} args.password - The password for the new user
     * @param {string} [args.role="user"] - The role of the new user (default: user)
     * @returns {Object} Response object containing success message, tokens, and user details
     * @throws {CustomError} Throws a `CustomError` if registration fails
     */

    registerUser: async (_, { userName, email, password, role = "user" }) => {
      try {
        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new CustomError("Email already exists!", 400, "Try logging in.");
        }

        // Hash the password before saving
        const hashedPassword = await User.hashPassword(password);

        // Create new user instance
        const newUser = new User({
          username: userName,
          email,
          password: hashedPassword, // Store hashed password
          role,
        });

        await newUser.save();

        // Generate tokens
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

        if (error instanceof CustomError) {
          throw error;
        }

        throw new CustomError("Registration failed!", 500, error.message);
      }
    },

    /**
     * .2 . Login User
     * @mutation signInUser
     * @description User Login Mutation
     * @access Public
     * @param {Object} _ - GraphQL parent object (not used here)
     * @param {Object} args - Arguments for user Sign-in
     * @param {string} args.email - The email of the  user
     * @param {string} args.password - The password for the  user
     * @returns {Object} Response object containing success message and tokens
     * @throws {CustomError} Throws a `CustomError` if sign-in fails
     */

    signInUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new CustomError("User not found!", 404, "Check your email or register.");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new CustomError("Invalid credentials!", 401, "Incorrect password.");
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

        if (error instanceof CustomError) {
          throw error;
        }

        throw new CustomError("Something went wrong during sign-in!", 500, error.message);
      }
    },
  },
};
