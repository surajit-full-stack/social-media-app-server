import { decodeJwt } from "../JWT.js";
import { db } from "../db.js";
import cheackBody from "./utils/FieldChecker.js";
const fields = ["isDp", "post_caption", "post_media_link", "visibility"];

export const postAdd = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const {userId,userName} = await decodeJwt(accessToken);

  if (!userId) return res.status(401).json("Not Authorized");

  const checkFailed = cheackBody(req.body, fields);
  if (checkFailed) return res.status(400).json(`${checkFailed}`);

  const { isDp, post_caption, post_media_link, visibility } = req.body;

  const q = `INSERT INTO Posts
  (isDp, post_caption, post_media_link, author_name, author_id,visibility)
  VALUES (?, ?, ?, ?, ?,?)`;
  db.query(
    q,
    [isDp, post_caption, post_media_link,userName, userId, visibility],
    (err, data) => {
      if (err) return res.status(500).json(err);
      console.log("data", data);
      res.status(200).json("posted");
    }
  );
};

//? Single post
export const getPost = async (req, res) => {
  const postId = req.params.postId;

  const q = "SELECT * FROM Posts WHERE post_id=? ";
  db.query(q, [postId], (err, data) => {
 
    if (err) return res.status(500).json(err);
    if (data.length === 0) res.status(404).json("Post not found!");
    return res.status(200).json(data[0]);
  });
};

export const editPost = async (req, res) => {
  const accessToken = req.cookies["access-token"];
  const {userId} = await decodeJwt(accessToken);

  //validation
  if (
    !req.body.hasOwnProperty("post_caption") &&
    !req.body.hasOwnProperty("visibility")
  ) {
    res.status(500).json("Provide Update");
  }

  const postId = req.params.postId;

  // Check Post Author
  db.query(
    "select author_id from Posts where post_id = ?",
    [postId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) res.status(404).json("Post not found!");
      const { author_id } = data[0];
      if (author_id != userId)
        return res.status(402).json("Unknown authorization");

      editQuery(req.body, postId, res);
    }
  );
};

const editQuery = (UpdateData, postId, res) => {
  const filter = Object.keys(UpdateData).filter(
    (it) => it !== "post_caption" && it !== "visibility"
  );
  if (filter.length > 0)
    return res.status(500).json(`${filter.join(" & ")} cannot be upadated!`);
  const clause = Object.keys(UpdateData)
    .map((it) => `\`${it}\` = ?`)
    .join(",");

  console.log("clause", clause);

  const q = `UPDATE Posts
    SET ${clause}
    WHERE post_id=?;`;
  db.query(q, [...Object.values(UpdateData), postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post Updated Successfully!");
  });
};

export const getProfilePosts=async(req,res)=>{
  const accessToken = req.cookies["access-token"];
  const {userId} = await decodeJwt(accessToken);
 const userName=req.params.userName;
const q=`SELECT p.*,pr.type,u.profilePicture FROM Posts p 
left join PostReaction pr on p.post_id = pr.postId and pr.reactorId = ?
JOIN Users u on p.author_id =u.userId 
where p.author_name=? ORDER BY CreatedAt DESC`
 
 db.query(q,[userId,userName],(err,data)=>{
  if(err) return res.status(500).json(err);
  res.status(200).json(data);
 })

}