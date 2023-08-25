/*
  Warnings:

  - You are about to drop the column `flipnoteTotal` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "flipnoteTotal";

-- CreateTable
CREATE TABLE "StarCount" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "StarCount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StarCount" ADD CONSTRAINT "StarCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
