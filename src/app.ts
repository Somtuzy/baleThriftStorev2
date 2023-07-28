import express from "express";
import startDb from "./configs/db.config"

const app = express();
startDb()

export default app;