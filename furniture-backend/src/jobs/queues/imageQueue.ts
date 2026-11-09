import { redis } from "../../config/redisClient.js";
import { Queue } from "bullmq";

const ImageQueue = new Queue("imageQueue", { connection: redis });
export default ImageQueue;
