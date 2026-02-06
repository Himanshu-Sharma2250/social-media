import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", verifyJWT, getProfile);
authRouter.post("/logout", verifyJWT, logoutUser);

export default authRouter;