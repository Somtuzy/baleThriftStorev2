import BaseService from "./base.service";
import User from "../models/user.model";

const userService = new BaseService(User);

export { userService };