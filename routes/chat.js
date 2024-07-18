import express from "express";
import { varifyToken } from "../JWT.js";
import { getChats, getConversationId, getParticipants } from "../controllers/chat.js";

const router = express.Router();
router.get("/conversations/:conversation_id", varifyToken, getChats);
router.get("/participants", varifyToken, getParticipants);
router.get("/get-conversationId/:friendId", varifyToken, getConversationId);

export default router;
