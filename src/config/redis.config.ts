import { Redis } from "ioredis"; 
import  Redlock from "redlock";
import { serverConfig } from "./index.js";

// Initialize using the named class
export const redisClient = new Redis(
  serverConfig.REDIS_SERVER_URL
);


export const redlock = new Redlock(
  [redisClient as unknown as ConstructorParameters<typeof Redlock>[0][number]],
  {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200,
  }
);