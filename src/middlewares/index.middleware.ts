import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";

import asyncError from "./errors.middleware";
import indexRoute from "../routes/index.route";
import { morganConfig, corsConfig, sessionConfig } from "../configs/middleware.config"

import './oauth/passport.middleware'
import database from "../configs/db.config";
database()

export default (app: Application) => {
  app.use(morgan(morganConfig));
  app.use(cors(corsConfig));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(asyncError);
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
  indexRoute(app);
};
