import express from "express";
import { getUserData } from "../controllers/userData.js";
import { varifyToken } from "../JWT.js";


const router = express.Router();
router.get("/user-info/:id", varifyToken,getUserData);

export default router;
