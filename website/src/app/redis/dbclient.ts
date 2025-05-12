import { createClient  , RedisClientType} from "redis";

declare global {
  var redisDbClient: any;
}

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

async function getRedisClient() : Promise<RedisClientType> {
  if (!global.redisDbClient) {
    global.redisDbClient = createClient({
      url: redisUrl,
    });
    await global.redisDbClient.connect();
  }
  return global.redisDbClient;
}

const client = await getRedisClient();
client.on("error", (err: any) => console.log("Redis Client Error", err));

export { client as redisDbClient };
