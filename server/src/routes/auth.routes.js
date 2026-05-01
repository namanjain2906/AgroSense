import { Router } from "express";
import {
  getMe,
  getRefreshToken,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authControllers.js";
import { authLimiter } from "../middlewares/securityMiddleware.js";

const authRouter = Router();

authRouter.post("/register", authLimiter, registerUser);
authRouter.post("/login", authLimiter, loginUser);
authRouter.post("/refresh", getRefreshToken);
authRouter.get("/refresh", getRefreshToken);
authRouter.get("/get-me", getMe);
authRouter.post("/logout", logoutUser);
authRouter.get("/logout", logoutUser);

export default authRouter;
