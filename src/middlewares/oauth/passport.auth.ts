import { Request, Response} from "express"
import { generateToken } from "../../services/jwt.service";
import sendMail from "../../services/mail.service";
import Mails from "../../configs/mails.constant.config";

const createUserToken = async (req: Request, res: Response) => {
  if (req.user && req?.user?.exists === "alreadyExistsWithSameEmailAndAPassword") {
    return res.status(403).json({
      status: false,
      message:
        "This email belongs to an active user, if this is you, login with your email and password to continue.",
    });
  }

  const token = await generateToken({
    _id: req.user._id,
    fullname: req.user.fullname,
  });

  if (req.user && req.user.exists === "true") {
    // sends login notification
    await sendMail(
      req.user.fullname,
      req.user.email,
      Mails.loggedIn.subject,
      Mails.loggedIn.body
    );

    console.log("User logged in successfully:", req.user);

    // Returns credentials to the client side
    const encodedUser = encodeURIComponent(req.user._id);
    const encodedToken = encodeURIComponent(token);

    const productPage = `${process.env.BASE_URL}/product-page?userId=${encodedUser}&token=${encodedToken}`;
    return res.redirect(302, productPage);
  }

  // sends signup notification
  await sendMail(
    req.user.fullname,
    req.user.email,
    Mails.accountCreated.subject,
    Mails.accountCreated.body
  );

  console.log("User signed up successfully:", req.user);

  const encodedUser = encodeURIComponent(req.user._id);
  const encodedToken = encodeURIComponent(token);

  const productPage = `${process.env.BASE_URL}/product-page?user=${encodedUser}&token=${encodedToken}`;
  return res.redirect(302, productPage);
};

export default createUserToken;