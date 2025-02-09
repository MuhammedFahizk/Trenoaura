import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CustomError from "../config/errors/CustomError.js";
dotenv.config();

const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
  expiry: "15m",
};

const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  expiry: "7d",
};

// const RESET_PASSWORD_TOKEN = {
//   expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
// };

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: { required: true, type: String },
    },
  ],
  role: {
    type: String,
    enum: ["admin", "user", "vender "],
    default: "user",
  },
});

UserSchema.pre("save", function (next) {
  if (
    this.isModified("username") ||
    this.isModified("email") ||
    this.isModified("password")
  ) {
    this.updatedAt = Date.now();
  }
  next();
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

/* 
1. GENERATE  ACCESS TOKEN
 */
UserSchema.methods.generateAccessToken = function () {
  const user = this;

  if (!ACCESS_TOKEN) {
    throw new Error("Access token secret is not defined");
  }
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      username: `${user.username}`,
      email: user.email,
    },
    ACCESS_TOKEN.secret,
    {
      expiresIn: ACCESS_TOKEN.expiry,
    }
  );

  return accessToken;
};

/*
2. GENERATE  REFRESH TOKEN
 */
UserSchema.methods.generateRefreshToken = async function () {
  const user = this;

  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    REFRESH_TOKEN.secret,
    {
      expiresIn: REFRESH_TOKEN.expiry,
    }
  );

  user.tokens.push({ token: refreshToken });
  await user.save();

  return refreshToken;
};

/* 
3. ATTACH CUSTOM STATIC METHODS
 */
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user)
    throw new CustomError(
      "Wrong credentials!",
      400,
      "Email or password is wrong!"
    );
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError(
      "Wrong credentials!!",
      400,
      "Email or password is wrong!"
    );
  return user;
};

/* 
.4 Compare the given password with the stored hashed password
*/
UserSchema.methods.comparePassword = async  function(candidatePassword)  {
  try {
    console.log(this);
    
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    
    throw new CustomError("Password comparison failed", 500, error.message);
  }
};

export const User = model("User", UserSchema);
