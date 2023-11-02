import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const postReacton = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
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
      const likeCountQuery =
        "UPDATE Posts SET reaction_count=reaction_count + 1 WHERE post_id=?";

      db.beginTransaction((err) => {
        if (err) console.log(err);
        return;
      });
      db.query(Insertquery, [userId, postId, type], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post reacted!");
      });
      db.query(likeCountQuery, [postId], (err, data) => {
        if (err) return res.status(500).json(data);
      });
      db.commit((err) => {
        if (err) {
          db.rollback();
        } else {
          console.log("Transaction successfull");
        }
      });
    }
  });
};

export const commentReaction = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
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
      const reactionUpdateQuery = `UPDATE Comments SET reactionCount=reactionCount + 1 WHERE CommentId=?`;
      db.beginTransaction((err) => {
        if (err) return res.status(500).json(err);
      });

      db.query(Insertquery, [userId, commentId, type], (err, result) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment reacted!");
      });
      db.query(reactionUpdateQuery, [commentId], (err, result) => {
        if (err) return res.status(500).json(err);
      });
      db.commit((err) => {
        if (err) {
          db.rollback();
        } else {
          console.log("Transaction successfull");
        }
      });
    }
  });
};

export const unReactPost = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  console.log("userId", userId);
  const postId = req.params.postId;

  const deleteQuery = `DELETE FROM PostReaction WHERE reactorId=? and postId=?`;
  const likeCountQuery =
    "UPDATE Posts SET reaction_count=reaction_count - 1 WHERE post_id=?";
  db.beginTransaction((err) => {
    if (err) console.log(err);
    return;
  });
  db.query(deleteQuery, [userId, postId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post UnReacted!");
  });
  db.query(likeCountQuery, [postId], (err, data) => {
    if (err) return res.status(500).json(data);
  });
  db.commit((err) => {
    if (err) {
      db.rollback();
    } else {
      console.log("Transaction successfull-");
    }
  });
};

export const unReactComment = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  console.log("userId", userId);
  const commentId = req.params.commentId;

  const deleteQuery = `DELETE FROM CommentReaction WHERE reactorId=? and CommentId=?`;
  const likeCountQuery =
    "UPDATE Posts SET reactionCount=reactionCount - 1 WHERE commentId=?";
  db.beginTransaction((err) => {
    if (err) console.log(err);
    return;
  });
  db.query(deleteQuery, [userId, commentId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post UnReacted!");
  });
  db.query(likeCountQuery, [commentId], (err, data) => {
    if (err) return res.status(500).json(data);
  });
  db.commit((err) => {
    if (err) {
      db.rollback();
    } else {
      console.log("Transaction successfull-");
    }
  });
};
