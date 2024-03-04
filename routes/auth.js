import express from "express";
import { chatAccessToken, genChatToken, logOut, loginUser, refreashToken, registerUser } from "../controllers/auth.js";




const router = express.Router();
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logOut);
router.get("/auth/refreash-token", refreashToken);
router.get("/auth/chat-token", genChatToken);
router.get("/auth/chat-access-token", chatAccessToken);

export default router;
