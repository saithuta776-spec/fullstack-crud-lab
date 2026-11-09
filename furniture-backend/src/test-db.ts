import "dotenv/config";

import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function test() {
  try {
    console.log("Testing database connection...");

    const users = await prisma.user.findMany({
      take: 1,
    });

    console.log("Database connection works!");
    console.log(users);
  } catch (error) {
    console.error("DATABASE TEST ERROR:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
