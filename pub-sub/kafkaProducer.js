import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "api-server:producer",
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
});
export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

