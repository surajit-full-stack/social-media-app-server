import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

export const createToken = (user) => {
  const accessToken = sign(
    { userName: user.userName, id: user.userId },
    process.env.JWT_SECRET_KEY
  );

  return accessToken;
};

export const varifyToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];
  console.log('accessToken', accessToken)
  if (!accessToken)
    return res.status(400).json({ msg: "User Not Authorized!" });
  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET_KEY);
    if (validToken) {
      req.athenticated = true;
      return next();
    }
  } catch (error) {
    return req.status(400).json(error);
  }
};
