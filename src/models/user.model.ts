import { model, Schema } from "mongoose";
import IDocument from "../interfaces/document.interface";

const userSchema = new Schema<IDocument>(
  {
    fullname: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    googleId: {
      type: String,
      trim: true,
    },
    avatar: String,
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      minlength: 11,
      maxlength: 14,
      required: false,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
    },
    birthday: {
      type: Date,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    exists: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const User = model<IDocument>("User", userSchema);
export default User;