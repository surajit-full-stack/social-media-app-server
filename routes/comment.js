import express from 'express';
import { varifyToken } from '../JWT.js';
import { addCommentToPost, addReply, deleteComments, editComments, getCommentReactions, getCommnets, getReplies } from '../controllers/comment.js';

const router = express.Router();

router.post("/add-comment/:postId",varifyToken,addCommentToPost)
router.post("/edit-comment/:commentId",varifyToken,editComments)
router.post("/delete-comment/:commentId",varifyToken,deleteComments)
router.get("/get-comments/:postId",varifyToken,getCommnets)
router.post("/add-reply/:commentId",varifyToken,addReply)
router.get("/get-replies/:commentId",varifyToken,getReplies)
router.get("/get-comment-reactions/:cmntId",varifyToken,getCommentReactions)

export default router;