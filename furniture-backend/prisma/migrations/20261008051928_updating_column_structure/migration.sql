/*
  Warnings:

  - You are about to alter the column `key` on the `Setting` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
  - You are about to alter the column `value` on the `Setting` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(200)`.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Type` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "key" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "value" SET DATA TYPE VARCHAR(200);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
