import { Kafka } from "kafkajs";
import moment from "moment";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

// const kafka = new Kafka({
//   clientId: "api-server",
//   brokers: [process.env.KAFKA_BROKER],
//   ssl: {
//     ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
//   },
//   sasl: {
//     username: "avnadmin",
//     password: "AVNS_bnqqmTwAqTaBAm3sHq6",
//     mechanism: "plain",
//   },
// });

const kafka = new Kafka({
  clientId: "api-server",
  brokers: [process.env.KAFKA_BROKER],
});
const admin = kafka.admin();
const producer = kafka.producer();
export const kafkaInit = async () => {
  try {

    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: "notification-new",
        },
        {
          topic: "notification-others",
        },
      ],
    });
    await admin.disconnect();

    await producer.connect();

    console.log("\nKafka Producer Ready...\n");

  } catch (error) {
    console.log("Kafka Producer Error: ", error);
  }
};

export const publish = async (data, type) => {
  const topic = type === "new" ? "notification-new" : "notification-others";
  console.log("type", topic);
  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify({ ...data, timestamp: moment() }),
        },
      ],
    });
    console.log('send')
  } catch (error) {
    console.log("Kafka Notification Failed", error);
  }
};
