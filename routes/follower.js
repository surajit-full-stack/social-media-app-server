import express from 'express';
import { varifyToken } from '../JWT.js';
import { followerSuggetion, followingUser, getFollower, getFollowings, unFollowUser } from '../controllers/follower.js';

const router=express.Router()
router.post("/follow/:followingId",varifyToken,followingUser)
router.post("/unfollow/:followingId",varifyToken,unFollowUser)
router.get("/get-follower/:userId",varifyToken,getFollower)
router.get("/get-following/:userId",varifyToken,getFollowings)
router.get("/get-following",varifyToken,getFollowings)
router.get("/get-follower-suggestion",varifyToken,followerSuggetion)

export default router