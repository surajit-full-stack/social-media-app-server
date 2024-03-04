import { db } from "../db.js";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
const { verify } = pkg;
import {
  createChatToken,
  createRefreashToken,
  createToken,
  decodeJwt,
} from "../JWT.js";
const cookieOpt = {
  domain: ".localhost",
  secure: true,
  httpOnly: true,
  sameSite: "Strict",
};

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
      profilePicture,
    };
    const accessToken = createToken(user);
    const refreashToken = createRefreashToken(user);
    res.cookie("access-token", accessToken, cookieOpt);
    res.cookie("refreash-token", refreashToken, cookieOpt);
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
            const accessToken = createToken(data[0]);
            res.cookie("access-token", accessToken, cookieOpt);
            const refreashToken = createRefreashToken(data[0]);
            res.cookie("refreash-token", refreashToken, cookieOpt);
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
  res.clearCookie("refreash-token");
  res.status(200).json("logged out!");
};

export const refreashToken = (req, res) => {
  const refreashToken = req.cookies["refreash-token"];
  if (!refreashToken)
    return res.status(440).json({ msg: "User Not Authorized!" });
  try {
    const validToken = verify(refreashToken, process.env.JWT_REFREASH_KEY);
    if (validToken) {
      res.clearCookie("access-token");
      const { id, ...rest } = validToken;
      const accessToken = createToken({ ...rest, userId: id });
      res.cookie("access-token", accessToken, cookieOpt);
      return res.status(200).json("nt");
    }
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(440).json({ msg: "refreash-token expire" });
    }
    console.log("error", error);
    return res.status(500).json(error);
  }
};

export const genChatToken = async(req, res) => {
  const accessToken = req.cookies["access-token"];
  if (!accessToken) {
    return res.status(401).json("un-authorized");
  }
  const user =await decodeJwt(accessToken);

  if (!user) {
    return res.status(401).json("un-authorized");
  }
  const chatToken = createChatToken(user);
  res.status(200).json({ token: chatToken });
};

export const chatAccessToken = (req, res) => {
  const { token } = req.query;

  try {
    const tokenData = verify(token, process.env.JWT_CHAT_KEY);
    
    if (tokenData) {
      const accessToken = createToken({
        userId: tokenData.id,
        userName: tokenData.userName,
        profilePicture: tokenData.profilePicture,
      });

      res.cookie("access-token", accessToken, cookieOpt);
      const refreashToken = createRefreashToken({
        userId: tokenData.id,
        userName: tokenData.userName,
        profilePicture: tokenData.profilePicture,
      });
      res.cookie("refreash-token", refreashToken, cookieOpt);

      const q = "select * from Users where userName = ?";
    
      db.query(q, [tokenData.userName], (err, data) => {
        if (err) return res.status(500).json({ msg: "Internal Server Error" });
        const {password,...rest}=data[0]
        
        return res.status(200).json({ userData:rest });
      });
    } else {
      return res.status(401).json("un-authorized");
    }
  } catch (error) {
    console.log('error', error)
    return res.status(401).json("un-authorized");
  }
};
