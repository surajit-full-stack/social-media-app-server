import express from "express";
import { varifyToken } from "../JWT.js";
import { commentReaction, postReacton } from "../controllers/like.js";

const router = express.Router();
router.post("/reaction/post/:postId", varifyToken, postReacton);
router.post("/reaction/comment/:commentId", varifyToken,commentReaction);
export default router;
