import Redis from "ioredis";
import moment from 'moment'
const redisOptions = {
  host: process.env.PUB_SUB_REDIS_HOST ?? "localhost",
  port: process.env.PUB_SUB_REDIS_PORT ?? 6300,
  // password: "notification-pub-sub-redis",
};

const publisher = new Redis(redisOptions);
export const publish = (data, type) => {
  publisher.publish(
    "notification:" + type,
    JSON.stringify({...data,timestamp:moment()}),
    (err, reply) => {
      if (err) {
        console.error("Error publishing message:", err);
      } else {
        console.log("Message published:", type + reply);
      }
    }
  );
};

// Listen for the 'error' event to handle any errors
publisher.on("error", (err) => {
  console.error("Redis publisher client error:", err);
});
