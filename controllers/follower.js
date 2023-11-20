import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const followingUser = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const followedId = req.params.followingId;
  if (userId == followedId)
    return res.status(500).json("self following is not allowed");
  const q = "INSERT INTO Follower (follower_id,following_id) VALUES (?,?)";

  db.query(q, [userId, followedId], (err, data) => {
    if (err) return res.status(500).json(req);
    res.status(200).json(userId);
  });
};

export const unFollowUser = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const followedId = req.params.followingId;
  if (userId == followedId)
    return res.status(500).json("self following is not allowed");
  const q = "DELETE FROM Follower WHERE follower_id=? AND following_id=?";

  db.query(q, [userId, followedId], (err, data) => {
    if (err) return res.status(500).json(req);
    res.status(200).json(userId);
  });
};

export const getFollower = async (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT u.userName , u.userId ,u.profilePicture,f.moment FROM 
    Follower f 
    join Users u on f.follower_id =u.userId
    WHERE  f.following_id =?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
export const getFollowings = async (req, res) => {
  const userId = req.params.userId;

  const q = `SELECT u.userName , u.userId ,u.profilePicture,f.moment FROM 
    Follower f 
    join Users u on f.following_id =u.userId
    WHERE  f.follower_id =?`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};



export const followerSuggetion = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const q = `with getFollowing as (
    SELECT * FROM Follower f 
    WHERE f.follower_id =?
    )
    
    SELECT u.*  from Users u 
    left join getFollowing gf on gf.following_id= u.userId
    WHERE gf.follower_id is NULL AND u.userId !=?
    `;
  db.query(q, [userId, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
