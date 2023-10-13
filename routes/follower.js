import express from 'express';
import { varifyToken } from '../JWT.js';
import { followingUser, unFollowUser } from '../controllers/follower.js';

const router=express.Router()
router.post("/follow/:followingId",varifyToken,followingUser)
router.post("/unfollow/:followingId",varifyToken,unFollowUser)

export default router