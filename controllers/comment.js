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
    if (err) console.log(err);
    return;
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
  const { CommentText } = req.body;
  const q =
    "INSERT INTO Comments (ParentCommentID,CommentText,UserID) VALUES (?,?,?)";
  db.query(q, [commentID, CommentText, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("reply added!");
  });
};

export const getCommnets = (req, res) => {
  const postId = req.params.postId;
  const q = `SELECT c.*,u.userName,u.profilePicture FROM Comments c JOIN Users u ON c.UserId=u.userId WHERE PostID=?  ORDER BY c.Timestamp DESC`;
  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
