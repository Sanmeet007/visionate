import { createClient } from "redis";

/**
 * Database client for redis ( in memory db )
 */
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

export { client as redisDbClient };
