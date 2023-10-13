import express from 'express';
import { varifyToken } from '../JWT.js';
import { addCommentToPost, addReply } from '../controllers/comment.js';

const router = express.Router();

router.post("/add-comment/:postId",varifyToken,addCommentToPost)
router.post("/add-reply/:commentId",varifyToken,addReply)

export default router;