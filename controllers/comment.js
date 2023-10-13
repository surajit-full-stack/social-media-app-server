import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";

export const addCommentToPost = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const userId = await decodeJwt(accessToken);
  const PostID = req.params.postId;
  //? BODY VALIDATION
  if (!req.body.hasOwnProperty("CommentText"))
    return res.status(500).json("CommentText is required");
  const {  CommentText } = req.body;
  const q = "INSERT INTO Comments (PostID,CommentText,UserID) VALUES (?,?,?)";
  db.query(q, [PostID, CommentText, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("comment added!");
  });
};


export const addReply=async (req,res)=>{
    const accessToken = req.cookies["access-token"];
    const userId = await decodeJwt(accessToken);
    const commentID = req.params.commentId;
    //? BODY VALIDATION
    if (!req.body.hasOwnProperty("CommentText"))
      return res.status(500).json("CommentText is required");
    const {  CommentText } = req.body;
    const q = "INSERT INTO Comments (ParentCommentID,CommentText,UserID) VALUES (?,?,?)";
    db.query(q, [commentID, CommentText, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("reply added!");
    });
}