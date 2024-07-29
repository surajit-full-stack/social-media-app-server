import { decodeJwt } from "../JWT.js";

export const getNotifications = async (req, res) => {
  try {
    const accessToken = req.cookies["access-token"];
    const { userId } = await decodeJwt(accessToken);
    const collection = mongoose.connection.collection("notification-indie");
    const notifications = await collection.find({ socketId: userId });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
