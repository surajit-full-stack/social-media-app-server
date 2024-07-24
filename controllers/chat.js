import mongoose from "mongoose";
import { decodeJwt } from "../JWT.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db.js";
const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants: [String],
  conversation_id: String,
  participants_data: {
    type: Schema.Types.Mixed,
    default: {},
  },
});

conversationSchema.index({ participants: 1 }, { unique: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

export const getConversationId = async (req, res) => {
  try {
    const { friendId } = req.params;
    const accessToken = req.cookies["access-token"];
    const { userName, profilePicture, userId } = await decodeJwt(accessToken);

    const data = await Conversation.findOne({
      participants: { $all: [userName, friendId] },
    });

    if (!data) {
      const getFriendDp = () => {
        return new Promise((resolve, reject) => {
          const query =
            "select profilePicture,userId from Users where userName = ?";
          db.query(query, [friendId], async (err, results) => {
            if (err) reject(err);
            if(results.length===0) reject(new Error("no user exists"))
            resolve(results[0]); // Handle results properly
          });
        });
      };

      const { profilePicture: friendDp, userId: friendUserId } =
        await getFriendDp();
const conversation_id=uuidv4()
      const dpObject = {};
      // first user
      dpObject[userName] = {
        profilePicture,
        userId,
        userName,
        conversation_id
      };

      // second user
      dpObject[friendId] = {
        profilePicture: friendDp,
        userId: friendUserId,
        userName: friendId,
        conversation_id
      };

      const newConversation = new Conversation({
        participants: [userName, friendId],
        conversation_id ,
        participants_data: dpObject, // Assign dpObject directly
      });

      const savedConversation = await newConversation.save();
      return res
        .status(200)
        .json({ conversation_id: savedConversation.conversation_id });
    } else {
      console.log("Existing data:", data);
      return res.status(200).json({ conversation_id: data.conversation_id });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ msg: error.message });
  }
};
export const getParticipants = async (req, res) => {
  try {
    const accessToken = req.cookies["access-token"];
    const { userName } = await decodeJwt(accessToken);
    const data = await Conversation.find({
      participants: userName,
    });
    return res.status(200).json(data);
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
