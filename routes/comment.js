import express from 'express';
import { varifyToken } from '../JWT.js';
import { addCommentToPost, addReply, getCommnets, getReplies } from '../controllers/comment.js';

const router = express.Router();

router.post("/add-comment/:postId",varifyToken,addCommentToPost)
router.get("/get-comments/:postId",varifyToken,getCommnets)
router.post("/add-reply/:commentId",varifyToken,addReply)
router.get("/get-replies/:commentId",varifyToken,getReplies)

export default router;