import { createClient, RedisClientType } from "redis";

declare global {
  var redisDbClient: any;
}

async function getRedisClient(): Promise<RedisClientType> {
  if (!global.redisDbClient) {
    global.redisDbClient = createClient({
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    await global.redisDbClient.connect();
  }
  return global.redisDbClient;
}

const client = await getRedisClient();

client.on("error", (err: any) => console.log("Redis Client Error", err));

export { client as redisDbClient };
