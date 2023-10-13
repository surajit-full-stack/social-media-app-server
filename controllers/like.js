import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const postReacton = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const userId = await decodeJwt(accessToken);
  const postId = req.params.postId;
  if (!req.body.hasOwnProperty("type"))
    return res.status(500).json("Invalid body");
  const { type } = req.body;

  //check post already reacted by the user
  const reactionCheackQuery = `select reactionId from PostReaction where reactorId=? and postId=?`;

  db.query(reactionCheackQuery, [userId, postId], (err, data) => {
    if (err) return res.status(500).json(err);
    //check if already user liked the post if (update) else (insert)
    if (data.length > 0) {
      const updateQuery =
        "UPDATE PostReaction SET type = ? WHERE reactorId=? AND postId =?";

      db.query(updateQuery, [type, userId, postId], (err, response) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Reaction updated!");
        return true;
      });
    }

    // if post to be reacted for first time by the user
    else {
      const Insertquery = `INSERT INTO PostReaction (reactorId,postId,type) VALUES (?,?,?);`;
      db.query(Insertquery, [userId, postId, type], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post reacted!");
      });
    }
  });
};

export const commentReaction = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const userId = await decodeJwt(accessToken);
  const commentId = req.params.commentId;
  if (!req.body.hasOwnProperty("type"))
    return res.status(500).json("Invalid body");
  const { type } = req.body;

  //check post already reacted by the user
  const reactionCheackQuery = `select reactionId from CommentReaction where reactorId=? and CommentId=?`;

  db.query(reactionCheackQuery, [userId, commentId], (err, data) => {
    if (err) return res.status(500).json(err);
    //check if already user liked the post if (update) else (insert)
    if (data.length > 0) {
      const updateQuery =
        "UPDATE CommentReaction SET type = ? WHERE reactorId=? AND CommentId =?";

      db.query(updateQuery, [type, userId, commentId], (err, response) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Reaction updated!");
        return true;
      });
    }

    // if post to be reacted for first time by the user
    else {
      const Insertquery = `INSERT INTO CommentReaction (reactorId,CommentId,type) VALUES (?,?,?);`;
      db.query(Insertquery, [userId, commentId, type], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment reacted!");
      });
    }
  });
};
