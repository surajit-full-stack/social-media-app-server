import express from "express";
import { varifyToken } from "../JWT.js";
import { getFeed } from "../controllers/feed.js";

const router = express.Router();
router.get("/feed", varifyToken, getFeed);
export default router;
