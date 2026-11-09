import { redis } from "../../src/config/redisClient.js";

export const getOrSetCache = async (key: any, cb: any) => {
  try {
    const cachedData = await redis.get(key);

    if (cachedData) {
      console.log("Cache Hit");
      return JSON.parse(cachedData);
    }
    console.log("Cache Miss");

    const freshData = await cb();
    await redis.setex(key, 3600, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    console.error("Redis error: ", error);
    throw error;
  }
};
