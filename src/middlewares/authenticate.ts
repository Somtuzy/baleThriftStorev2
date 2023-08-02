import { Request, Response, NextFunction } from "express"
import { verifyToken, checkTokenValidity } from "../services/jwt.service";
import { userService } from "../services/create.service";
import { JwtPayload } from "jsonwebtoken";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeaders = req.header("Authorization");
    const token: string =
      authHeaders && authHeaders.substring(0, 7) === "Bearer "
        ? authHeaders.replace("Bearer ", "")
        : req.cookies.token;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'You must be signed in to continue'
      })
    }

    // Extracts the expiration date from the token available
    const isValidToken = await checkTokenValidity(token);

    // Checks if the token is expired
    if (!isValidToken) {
      // Stores the users current page in the session parameter then sends them to sign in
      return res.status(403).json({
        success: false,
        message: 'Session expired, sign in to continue'
      })
    }

    // Decode the user token to get user credentials
    const decoded = await verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token provided'
      })
    }

    // Searches for an existing user with the decoded credentials
    const user = await userService.findOne({ _id: (decoded as JwtPayload).id, deleted: false });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(`Authentication for ${user.fullname} successful`);

    // The user is then added to the request
    const { _id, fullname, email } = user
    const exists = user.exists as string
    const requestUser = {_id, fullname, exists, email}

    req.user = requestUser
    req.session.user = requestUser;
    req.token = token;

    next();
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default authenticate;