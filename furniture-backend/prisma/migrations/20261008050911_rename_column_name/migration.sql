/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pirce` on the `Product` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" RENAME COLUMN "totalAmount"  to "totalPrice";
-- AlterTable
ALTER TABLE "Product" RENAME COLUMN "pirce" to "price";
