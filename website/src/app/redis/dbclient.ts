import { createClient } from "redis";

declare global {
  var redisDbClient: any;
}

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

async function getRedisClient() {
  if (!global.redisDbClient) {
    global.redisDbClient = createClient({
      url: redisUrl,
    });
    await client.connect();
  }
  return global.redisDbClient;
}

const client = await getRedisClient();
client.on("error", (err: any) => console.log("Redis Client Error", err));

export { client as redisDbClient };
