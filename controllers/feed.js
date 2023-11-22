import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const getFeed = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);

  const q = `SELECT pr.type, p.*,u2.profilePicture  FROM  
  Follower f 
  join Users u on f.follower_id =u.userId
  join Posts p on f.following_id  =p.author_id 
  join Users u2
  on u2.userId = f.following_id 
  left join PostReaction pr on p.post_id = pr.postId and pr.reactorId = ?
  WHERE  f.follower_id  =?
  ORDER BY CreatedAt DESC
  LIMIT 30`;
  db.query(q, [userId,userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
