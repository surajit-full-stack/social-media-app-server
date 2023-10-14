import express from "express";
import { logOut, loginUser, registerUser } from "../controllers/auth.js";
import { varifyToken } from "../JWT.js";



const router = express.Router();
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logOut);

export default router;
