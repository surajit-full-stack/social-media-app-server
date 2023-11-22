import express from "express";
import {
  editPost,
  getIPreactor,
  getPost,
  getProfilePosts,
  getReactor,
  postAdd,
} from "../controllers/post.js";
import { varifyToken } from "../JWT.js";

const router = express.Router();
router.post("/add-post", varifyToken, postAdd);
router.get("/get-post/:postId", varifyToken, getPost);
router.get("/get-profile-posts/:userName", varifyToken, getProfilePosts);
router.post("/edit-post/:postId", varifyToken, editPost);

router.get("/get-reactors/:postId", varifyToken, getReactor);
router.get("/get-important-reactors/:postId", varifyToken, getIPreactor);
export default router;
