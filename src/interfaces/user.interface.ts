import { ObjectId, Schema, Document} from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export interface IUser{
  _id: ObjectId | string;
  fullname?: string;
  googleId?: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  birthday?: string;
  address?: string;
  role?: string;
  verified?: boolean;
  deleted: boolean;
  $or?: [{ googleId: string }, { email: string }];
  exists: string;
}

export interface ICreateUser {
  fullname: string,
  googleId?:string,
  avatar: string,
  email: string,
  phoneNumber?: string,
  password?: string,
  birthday?: Date,
  address?: string,
  role?: string,
  verified?: boolean,
  deleted?: boolean,
  exists?: string;
}

export interface IUpdateUser {
  fullname?: string,
  avatar?: string,
  email?: string,
  phoneNumber?: string,
  password?: string,
  birthday?: Date,
  address?: string,
  role?: string,
  verified?: boolean,
  deleted?: boolean,
}