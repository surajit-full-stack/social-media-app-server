import express from "express";
import { varifyToken } from "../JWT.js";
import { commentReaction, postReacton, unReactComment, unReactPost } from "../controllers/like.js";

const router = express.Router();
router.post("/reaction/post/:postId", varifyToken, postReacton);
router.post("/un-reaction/post/:postId", varifyToken, unReactPost);
router.post("/reaction/comment/:commentId", varifyToken,commentReaction);
router.post("/un-reaction/comment/:commentId", varifyToken, unReactComment);
export default router;
