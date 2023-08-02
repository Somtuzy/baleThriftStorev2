import { Router } from 'express';
import passport from 'passport';
import createUserToken from '../middlewares/oauth/passport.auth';

import '../middlewares/oauth/passport.middleware'
const googleAuthRouter = Router();

googleAuthRouter.get("/", passport.authenticate("google", { scope: ["email", "profile"] }));

googleAuthRouter.get("/callback", passport.authenticate("google", { failureRedirect: "/login" }), createUserToken);

export default googleAuthRouter;