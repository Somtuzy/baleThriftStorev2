import Joi from "joi";

export const SignUpUserSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(40).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(11).max(14).required(),
  password: Joi.string().min(8).required(),
  birthday: Joi.string().optional(),
  address: Joi.string().optional(),
  role: Joi.string().optional(),
});

export const UpdateUserSchema = Joi.object({
  fullname: Joi.string().min(3).max(40).trim().optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().min(11).max(14).optional(),
  password: Joi.string().min(8).optional(),
  newPassword: Joi.string().min(8).max(20).optional(),
  birthday: Joi.string().optional(),
  address: Joi.string().optional(),
});

export const LoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
