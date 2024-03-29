import { db } from "../db.js";
import bcrypt from "bcrypt";
import { createToken } from "../JWT.js";
const cookieOpt={
  domain: '.localhost',
  path: '/',
  maxAge: 60 * 60 * 24 * 1000 * 7, // 7 days
  secure: false, // Set to true if serving over HTTPS
  httpOnly: true,
  sameSite: 'Lax'
}
export const registerUser = (req, res) => {
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
      res.status(500).json("Password encryption failed. Plaese try again!");
    } else {
      registerQuerry(querry, { ...req.body, hash }, res);
    }
  });
};

function registerQuerry(q, userData, res) {
  userData.userName = userData.userName.split(" ").join("");
  userData.userName = userData.userName.split("/").join("");

  const { userName, profilePicture, hash } = userData;
  db.query(q, [userName, hash, profilePicture], (err, data) => {
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
      profilePicture
    };
    const accessToken = createToken(user);

    res.cookie("access-token", accessToken, cookieOpt);
    res.status(200).json({ ...user, profilePicture });
  });
}

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  if (!userName | !password) {
    res.status(500).json("enter userId or password!");
    return;
  }
  const q = "select * from Users where userName = ?";

  db.query(q, [userName], (err, data) => {
    if (err) res.status(500).json(err);
    else if (data.length == 0) res.status(404).json("user  not found!");
    else {
      const hashed = data[0].password;
      bcrypt.compare(password, hashed, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            console.log('data[0]', data[0])
            const accessToken = createToken(data[0]);
            res.cookie("access-token", accessToken, cookieOpt);
            console.log('accessToken', accessToken)
            const { password, ...rest } = data[0];
            res.status(200).json({ userData: rest, accessToken });
          } else {
            res.status(400).json("Password is incorrect");
          }
        }
      });
    }
  });
};

export const logOut = (req, res) => {
  res.clearCookie("access-token");
  res.status(200).json("logged out!");
};
