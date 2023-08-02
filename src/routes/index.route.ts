import { Application } from "express";
import authRouter from "../routes/auth.route";
import googleAuthRouter from "../routes/auth.google.route";

const basePath = "/api/v1";

export default (app: Application) => {;
  app.use(`${basePath}/auth`, authRouter);
  app.use(`${basePath}/auth/google`, googleAuthRouter);
};