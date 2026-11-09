// import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

export const getUserByPhone = async (phoneNum: string) => {
  return prisma.user.findUnique({
    where: { phone: phoneNum },
  });
};

export const createOtp = async (otpData: any) => {
  return prisma.otp.create({
    data: otpData,
  });
};

export const getOtpByPhone = async (phoneNum: string) => {
  return prisma.otp.findUnique({
    where: { phone: phoneNum },
  });
};

export const updateOtp = async (id: number, otpData: any) => {
  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};

export const createUser = async (otpData: any) => {
  return prisma.user.create({
    data: otpData,
  });
};

export const updateUser = async (id: number, userData: any) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
