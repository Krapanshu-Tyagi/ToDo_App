import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not configured");
}

const client = createClient({ url: redisUrl });

client.on("error", (err) => console.error("Redis connection error:", err));
client.on("connect", () => console.info("Redis connected"));

await client.connect();

export default client;
