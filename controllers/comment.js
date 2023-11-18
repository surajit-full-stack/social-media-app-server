import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const addCommentToPost = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const PostID = req.params.postId;
  //? BODY VALIDATION
  if (!req.body.hasOwnProperty("CommentText"))
    return res.status(500).json("CommentText is required");
  const { CommentText } = req.body;
  const q = "INSERT INTO Comments (PostID,CommentText,UserID) VALUES (?,?,?)";
  const commentCountQuery =
    "UPDATE Posts SET comments_count=comments_count + 1 WHERE post_id=?";
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);
  });

  db.query(q, [PostID, CommentText, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("comment added!");
  });

  db.query(commentCountQuery, [PostID], (err, data) => {
    if (err) return res.status(500).json(err);
  });

  db.commit((err, data) => {
    if (err) {
      db.rollback();
    } else {
      console.log("Transaction successfull");
    }
  });
};

export const addReply = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const commentID = req.params.commentId;

  //? BODY VALIDATION
  if (!req.body.hasOwnProperty("CommentText"))
    return res.status(500).json("CommentText is required");
  const { CommentText, replyTo, postId } = req.body;

  db.beginTransaction((err) => {
    console.log("start");
    if (err) return res.status(500).json(err);
  });

  // Add reply

  const q =
    "INSERT INTO Comments (ParentCommentID,CommentText,UserID,replyTo) VALUES (?,?,?,?)";
  db.query(q, [commentID, CommentText, userId, replyTo], (err, data) => {
    if (err) return res.status(500).json(err);
  });
  // post count inc
  const postCntIncQuerry = `UPDATE Posts SET comments_count=comments_count+1 WHERE post_id=?`;
  db.query(postCntIncQuerry, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
  });

  // reply count
  const countIncQuerry = `UPDATE Comments SET replycount = replycount+1 WHERE CommentID=?`;
  db.query(countIncQuerry, [commentID], (err, data) => {
    if (err) return res.status(500).json(err);
  });

  // commit and rollback

  db.commit((err, data) => {
    if (err) {
      db.rollback();
    } else {
      return res.status(200).json("reply added!");
    }
  });
};

export const getCommnets = (req, res) => {
  const postId = req.params.postId;
  const q = `SELECT cr.type ,c.*,u.userName,u.profilePicture FROM Comments c JOIN Users u ON c.UserId=u.userId LEFT join CommentReaction cr on u.userId =cr.reactorId AND c.CommentID=cr.CommentId WHERE PostID=?  ORDER BY c.Timestamp DESC
  `;
  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
export const getReplies = (req, res) => {
  const commentId = req.params.commentId;
  const q = `SELECT cr.type, c.*,u.userName,u.profilePicture FROM Comments c JOIN Users u ON c.UserId=u.userId LEFT JOIN CommentReaction cr on u.userId=cr.reactorId AND c.CommentID=cr.CommentId WHERE ParentCommentID=?  ORDER BY c.Timestamp`;
  db.query(q, [commentId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};

export const editComments = async (req, res) => {
  const commentId = req.params.commentId;
  const { CommentText } = req.body;
  const accessToken = req.cookies["access-token"];
  const { userId } = await decodeJwt(accessToken);
  const editQ = `UPDATE Comments SET CommentText=? WHERE CommentID = ? AND UserID=?`;
  db.query(editQ, [CommentText, commentId, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json("updated");
  });
};
