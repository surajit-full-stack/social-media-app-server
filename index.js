import express from "express";
import userRoute from "./routes/userData.js";
import auth from "./routes/auth.js";
import postRoute from "./routes/post.js";
import reactionRoute from "./routes/like.js";
import CommentRoute from "./routes/comment.js";
import followRouter from "./routes/follower.js";
import feedRouter from "./routes/feed.js";
import cookieParser from "cookie-parser";
import { db } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const corsOptions = {
  methods: "GET,POST",
  credentials: true,
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/user", postRoute);
app.use("/api/user", reactionRoute);
app.use("/api/user", CommentRoute);
app.use("/api/user", followRouter);
app.use("/api/user", feedRouter);
app.use("/api/user", auth);

app.listen(8000, () => {
  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    console.log("Connected to MySQL database");
  });
  console.log("server running on 8000");
});
