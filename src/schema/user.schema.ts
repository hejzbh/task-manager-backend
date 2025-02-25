import mongoose from "mongoose";
import bcrypt from "bcrypt";

import {
  EMAIL_MAX_LENGTH,
  PW_MAX_LENGTH,
  PW_MIN_LENGTH,
} from "constants/index.js";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

// User schema
const userSchema = new mongoose.Schema({
  id: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxLength: EMAIL_MAX_LENGTH,
  },
  password: {
    type: String,
    required: true,
    minLength: PW_MIN_LENGTH,
    maxLength: PW_MAX_LENGTH,
  },
  role: {
    type: String,
    default: UserRole.USER,
    enum: [UserRole.USER, UserRole.ADMIN],
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
/*userSchema.methods.comparePws = async function (plainTextPw: string) {
  return await bcrypt.compare(plainTextPw, this.password);
};
 */
// Create and export User Model
const User = mongoose.model("User", userSchema);

export default User;
