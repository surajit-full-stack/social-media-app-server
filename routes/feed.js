import express from "express";
import { varifyToken } from "../JWT.js";
import { getFeed, userAutoComplete } from "../controllers/feed.js";

const router = express.Router();
router.get("/feed", varifyToken, getFeed);
router.get("/user-autocomplete/:name", varifyToken, userAutoComplete);
export default router;
