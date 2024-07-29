import express from "express";
import { varifyToken } from "../JWT.js";
import { getNotifications } from "../controllers/notification.js";
const router = express.Router();

router.get("get-notifications", varifyToken, getNotifications);

export default router