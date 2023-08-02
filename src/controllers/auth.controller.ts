import { Request, Response } from "express"
import { userService } from "../services/create.service";
import { hashPassword, verifyPassword } from "../services/bcrypt.service";
import { generateToken } from "../services/jwt.service";
import { generateRandomAvatar } from "../utils/avatar.utils";
import sendMail from "../services/mail.service";
import Mails from "../configs/mails.constant.config";
import { IUser } from "../interfaces/user.interface";

class AuthenticateController {
  async signup(req: Request, res: Response) {
    try {
      // Checks for existing user
      const existingUser = await userService.findOne({ email: req.body.email });

      if (existingUser && existingUser.deleted === true) {
        return res.status(403).json({
          message: `This email is taken or belongs to a disabled account. Please visit https://balethriftstore.onrender.com/api/v1/auth/recover to reactivate your account if it belongs to you.`,
          success: false,
        });
      }

      if (existingUser && existingUser.email === req.body.email) {
        return res.status(403).json({
          message: `Oops, it seems like this email is taken. Try a different email or sign in if you're the one registered with this email`,
          success: false,
        });
      }

      // Generates a random avatar for the user
      const avatarUrl = await generateRandomAvatar(req.body.email);

      // Hashes the user password
      const hashedPassword = await hashPassword(req.body.password);

      req.body.role && req.body.role === process.env.ADMIN_SECRET
        ? (req.body.role = "admin")
        : (req.body.role = "user");

      // Creates a new user
      const newUser = await userService.create({
        fullname: req.body.fullname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
        avatar: avatarUrl,
        role: req?.body?.role,
      });

      // Generates a token for the user
      const token = await generateToken({
        _id: newUser._id,
        fullname: newUser.fullname,
      });

      // Saves the user
      await newUser.save();

      // Saves the token as a cookie
      res.cookie("token", token, { httpOnly: true });

      // Returning the fields to the client side
      const signedUpUser: IUser = newUser.toObject();
      delete signedUpUser.password

      console.log('Signed up User:', signedUpUser);

      const fullname = signedUpUser.fullname as string
      const email = signedUpUser.email as string

      // Sends an email notification
      await sendMail(
        fullname,
        email,
        Mails.accountCreated.subject,
        Mails.accountCreated.body
      );

      await sendMail(
        fullname,
        email,
        Mails.welcome.subject,
        Mails.welcome.body
      );

      // Retuns credentials to the client side
      return res
      .header("Authorization", `Bearer ${token}`)
      .status(200).json({
        success: true,
        message: "User signed up successfully!",
        data: signedUpUser
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "User sign up failed.",
        errormessage: err,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Checks if the user already exists
      const existingUser = await userService.findOne({ email: req.body.email });

      // Returns a message if user doesn't exist
      if (!existingUser) {
        return res.status(404).json({
          message: `User does not exist, would you like to sign up instead?`,
          success: false,
        });
      }

      if (existingUser && existingUser.deleted === true) {
        return res.status(403).json({
          message: `This email belongs to a disabled account. Please visit https://balethriftstore.onrender.com/api/v1/auth/recover to reactivate your account if it belongs to you.`,
          success: false,
        });
      }

      // Checks if the password input by the client matches the protected password of the returned user
      const isValidPassword = await verifyPassword(
        req.body.password as string,
        existingUser.password as string
      );

      // Sends a message if the input password doesn't match
      if (!isValidPassword) {
        return res.status(401).json({
          message: `Incorrect password, please retype your password`,
          success: false,
        });
      }

      // Stores the returned user's unique id in an object to generate a token for the user
      const token = await generateToken({
        _id: existingUser._id,
        fullname: existingUser.fullname,
      });

      // This saves the token as a cookie
      res.cookie("token", token, { httpOnly: true });

      const loggedInUser: IUser = existingUser.toObject()
      delete loggedInUser.password

      console.log('Logged in User:', loggedInUser);

      // Sends email notification
      await sendMail(
        loggedInUser.fullname as string,
        loggedInUser.email as string,
        Mails.loggedIn.subject,
        Mails.loggedIn.body
      );

      // Retuns credentials to the client side
      return res
      .header("Authorization", `Bearer ${token}`)
      .status(200).json({
        success: true,
        message: "User logged in successfully!",
        data: loggedInUser
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "User login failed. ",
        errormessage: err,
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = "";

      // This saves the token as a cookie for the duration of its validity just to simulate how the request header works for the purpose of testing.
      res.cookie("token", token, { httpOnly: true });

      // Sends email notification
      await sendMail(
        req.session.user.fullname,
        req.session.user.email as string,
        Mails.loggedOut.subject,
        Mails.loggedOut.body
      );

      // Sends success message on the console
      console.log(`User logged out successfully `);
      req.session.user;

      // Returning the fields to the client side
      return res
      .header("Authorization", "")
      .status(200).json({
        success: true,
        message: "User logged out successfully!",
        data: req.session.user
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "User not logged out successfully",
        errormessage: err,
      });
    }
  }

  async recover(req: Request, res: Response) {
    try {
      const existingUser = await userService.findOne({
        email: req.body.email as string,
      });

      if (existingUser && existingUser.deleted === false)
        return res.status(403).json({
          success: false,
          message: `This email belongs to an active user, please sign in instead`,
        });

      // Returns a message if user doesn't exist
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: `User does not exist, would you like to sign up instead?`,
        });
      }

      // Checks if the password input by the client matches the protected password of the returned user
      const isValid = await verifyPassword(
        req.body.password,
        existingUser.password as string
      );

      // Sends a message if the input password doesn't match
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: `Incorrect password, please retype your password`,
        });
      }

      existingUser.deleted = false;
      await existingUser.save();

      // Stores the returned user's unique id in an object to generate a token for the user
      const token = await generateToken({
        _id: existingUser._id,
        fullname: existingUser.fullname as string,
      });

      // This saves the token as a cookie
      res.cookie("token", token, { httpOnly: true });

      // Removes password from output
      const recoveredUser: IUser = existingUser.toObject();
      delete recoveredUser.password

      console.log('Recovered user:', recoveredUser);

      // Sends email notification
      await sendMail(
        recoveredUser.fullname as string,
        recoveredUser.email as string,
        Mails.recovered.subject,
        Mails.recovered.body
      );

      // Retuns credentials to the client side
      return res
      .header("Authorization", `Bearer ${token}`)
      .status(200).json({
        success: true,
        message: "Account reactivated successfully!",
        data: recoveredUser
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Account recovery failed.",
        errormessage: err,
      });
    }
  }
}

export default new AuthenticateController();