import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const getFeed = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const {userId} = await decodeJwt(accessToken);

  const q = `SELECT p.*  FROM  
    Follower f 
    join Users u on f.follower_id =u.userId
    join Posts p on u.userId =p.author_id 
    WHERE  f.following_id =?
    LIMIT 10`;
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
