import mongoose from "mongoose";
import { decodeJwt } from "../JWT.js";
import { v4 as uuidv4 } from "uuid";
const conversationSchema = mongoose.Schema({
  participants: [String],
  conversation_id: String,
});
conversationSchema.index({ participants: 1 }, { unique: true });
const Conversation = mongoose.model("Conversation", conversationSchema);
export const getConversationId = async (req, res) => {
  try {
    const { friendId } = req.params;
    const accessToken = req.cookies["access-token"];
    const { userName } = await decodeJwt(accessToken);
    const data = await Conversation.findOne({
      participants: { $in: [userName, friendId] },
    });
    if (!data) {
      const d = new Conversation({
        participants: [userName, friendId],
        conversation_id: uuidv4(),
      });
      const newId = await d.save();
      return res.status(200).json({ conversation_id: newId.conversation_id });
    }
    console.log("data", data);
    return res.status(200).json({ conversation_id: data.conversation_id });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
export const getChats = async (req, res) => {
  try {
    const { conversation_id } = req.params;
    const { skip = 0 } = req.query;
    console.log("conversation_id", conversation_id);
    const collection = mongoose.connection.collection("messages");

    // Use await here to wait for the result of find()
    const docs = await collection
      .find({ conversation_id })
      .skip(Number(skip))
      .toArray();

  
    return res.status(200).json({ msg: docs });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
