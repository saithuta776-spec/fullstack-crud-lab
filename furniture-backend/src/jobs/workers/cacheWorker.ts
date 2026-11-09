import { Worker } from "bullmq";
import { redis } from "../../config/redisClient.js";
import { cache } from "sharp";

export const cacheWorker = new Worker(
  "cache-invalidation",
  async (job) => {
    const { pattern } = job.data;
    await invalidateCache(pattern);
  },
  { connection: redis },
);

cacheWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

cacheWorker.on("failed", (job: any, err) => {
  console.log(`Job ${job.id} failed with ${err.message}`);
});

const invalidateCache = async (pattern: string) => {
  try {
    const stream = redis.scanStream({
      match: pattern,
      count: 1000,
    });

    const pipeline = redis.pipeline();
    let totalKeys = 0;

    stream.on("data", (keys: string[]) => {
      if (keys.length > 0) {
        keys.forEach((key) => {
          pipeline.del(key);
          totalKeys++;
        });
      }
    });

    const streamFinished = new Promise<void>((resolve, reject) => {
      stream.on("end", async () => {
        try {
          if (totalKeys > 0) {
            await pipeline.exec();
            console.log(`Invalidated ${totalKeys} keys`);
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });

    await streamFinished;
  } catch (error) {
    console.error("Cache Invalidation error: ", error);
    throw error;
  }
};
