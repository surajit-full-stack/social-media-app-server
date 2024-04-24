import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const createToken = (user) => {
  const accessToken = sign(
    {
      userName: user.userName,
      id: user.userId,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );

  return accessToken;
};
export const createRefreashToken = (user) => {
  const accessToken = sign(
    {
      userName: user.userName,
      id: user.userId,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_REFREASH_KEY,
    { expiresIn: "10d" }
  );

  return accessToken;
};
export const createChatToken = (user) => {
  const accessToken = sign(
    {
      userName: user.userName,
      id: user.userId,
      profilePicture: user.profilePicture,
    },
    process.env.JWT_CHAT_KEY,
    { expiresIn: "1m" }
  );

  return accessToken;
};

export const varifyToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  // console.log('accessToken', accessToken)
  if (!accessToken)
    return res.status(401).json({ msg: "User Not Authorized!" });
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET_KEY);
    if (validToken) {
      req.athenticated = true;
      return next();
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

export const decodeJwt = async (token) => {
  const secretkey = process.env.JWT_SECRET_KEY;
  try {
    const tokenData = verify(token, secretkey);
    if (tokenData) {
      return {
        userId: tokenData.id,
        userName: tokenData.userName,
        profilePicture: tokenData.profilePicture,
      };
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
