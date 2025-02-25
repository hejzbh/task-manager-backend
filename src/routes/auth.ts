import { Router } from "express";
import * as authController from "controllers/auth.js";

const authRouter = Router();

authRouter
  .post("/login", authController.login)
  .post("/register", authController.register);

export default authRouter;
