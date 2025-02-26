import { Router } from "express";
import * as authController from "controllers/auth.js";

const authRouter = Router();

authRouter
  .post("/login", authController.login)
  .post("/register", authController.register)
  .get("/profile", authController.profile)
  .post("/refresh", authController.refresh);

export default authRouter;
