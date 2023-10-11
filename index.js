import express from "express";
import userRoute from "./routes/userData.js";
import auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { db } from "./db.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
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
