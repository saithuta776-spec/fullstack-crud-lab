import { Worker } from "bullmq";
import { redis } from "../../config/redisClient.js";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a worker to do Image Optimization Task
const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    console.log("🔥 JOB RECEIVED:", job.id);
    const { filePath, fileName, width, height, quality } = job.data;

    console.log("📁 File path:", filePath);
    console.log("📝 File name:", fileName);

    const optimizedImage = path.join(
      __dirname,
      "../../..",
      "uploads/optimize/",
      fileName,
    );
    await sharp(filePath)
      .resize(width, height)
      .webp({ quality: quality })
      .toFile(optimizedImage);
  },
  { connection: redis },
);

//FilePath = Sharpလုပ်ရမယ့် imageရှိတဲ့ fileလမ်းကြောင်း
//fileName = Imageရဲ့name

imageWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

imageWorker.on("failed", (job: any, err) => {
  console.log(`Jon ${job.id} failed with ${err.message}`);
});
console.log("🔥 IMAGE WORKER STARTED");
