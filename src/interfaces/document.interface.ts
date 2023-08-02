import { ObjectId, Schema, Document} from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export default interface IDocument extends Document {
  fullname: string,
  googleId?:string,
  avatar: string,
  email: string,
  phoneNumber?: string,
  password?: string,
  birthday?: Date,
  address?: string,
  role: string,
  verified?: boolean,
  deleted: boolean,
  name?: string,
  title?: string,
  details: {}[],
  size: string,
  price: number,
  status: string,
  images: string[],
  category: ObjectId,
  vendor: ObjectId,
  exists?: string
} 