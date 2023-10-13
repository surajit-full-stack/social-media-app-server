import { db } from "../db.js";
import bcrypt from "bcrypt";
import { createToken } from "../JWT.js";
export const registerUser = (req, res) => {
  console.log("req.body", req.body);

  const { password } = req.body;
  if (password.length < 5) {
    res.status(500).json({ msg: "password should be 5 character long" });
    return;
  }
  const querry =
    "INSERT INTO Users (userName,password,profilePicture) VALUES (?, ?, ?)";

  // encrypt password

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing the password:", err);
      res
        .status(500)
        .json( "Password encryption failed. Plaese try again!" );
    } else {
      registerQuerry(querry, { ...req.body, hash }, res);
    }
  });
};

function registerQuerry(q, userData, res) {
  userData.userName=userData.userName.split(" ").join("")
  userData.userName=userData.userName.split("/").join("")

  const { userName, profilePicture, hash } = userData;
  db.query(q, [userName, hash, profilePicture], (err, data) => {
    console.log("data", data);
    if (err) {
      const error = { ...err };
      if (err.code === "ER_DUP_ENTRY")
        error.msg = "userName is already exist !!!";
      res.status(400).json(error);
      return;
    }
    const user = {
      userId: data.insertId,
      userName,
    };
    const accessToken = createToken(user);
    console.log("accessToken", accessToken);
    res.cookie("access-token", accessToken, {
      maxAge: 60 * 60 * 24 * 1000 * 7,
    });
    res.status(200).json({ ...user, profilePicture });
  });
}

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  if (!userName | !password) {
    res.status(500).json( "enter userId or password!" );
    return;
  }
  const q = "select * from Users where userName = ?";

  db.query(q, [userName], (err, data) => {
    if (err) res.status(500).json(err);
    else if (data.length == 0)
      res.status(404).json( "user  not found!" );
    else {
      console.log("data", data);
      const hashed = data[0].password;
      bcrypt.compare(password, hashed, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            const accessToken = createToken(data[0]);
            res.cookie("access-token", accessToken, {
              maxAge: 60 * 60 * 24 * 1000 * 7,
            });
            const { password, ...rest } = data[0];
            res
              .status(200)
              .json({  userData: rest });
          } else {
            res.status(400).json("Password is incorrect");
          }
        }
      });
    }
  });
};
