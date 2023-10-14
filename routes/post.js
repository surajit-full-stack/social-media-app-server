import express from "express";
import { editPost, getPost, getProfilePosts, postAdd } from "../controllers/post.js";
import { varifyToken } from "../JWT.js";

const router = express.Router();
router.post("/add-post", varifyToken, postAdd);
router.get("/get-post/:postId", varifyToken, getPost);
router.get("/get-profile-posts/:userName", varifyToken, getProfilePosts);
router.post("/edit-post/:postId", varifyToken, editPost);
export default router;
