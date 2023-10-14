import express from "express";
import { varifyToken } from "../JWT.js";
import { commentReaction, postReacton, unReactPost } from "../controllers/like.js";

const router = express.Router();
router.post("/reaction/post/:postId", varifyToken, postReacton);
router.post("/un-reaction/post/:postId", varifyToken, unReactPost);
router.post("/reaction/comment/:commentId", varifyToken,commentReaction);
export default router;
