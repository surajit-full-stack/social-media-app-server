import express from 'express';
import { varifyToken } from '../JWT.js';
import { followingUser, getFollower, unFollowUser } from '../controllers/follower.js';

const router=express.Router()
router.post("/follow/:followingId",varifyToken,followingUser)
router.post("/unfollow/:followingId",varifyToken,unFollowUser)
router.get("/get-follower/:userId",varifyToken,getFollower)

export default router