-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(16) NOT NULL,
    "name" TEXT NOT NULL,
    "flipnoteTotal" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Flipnote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Flipnote_id_key" ON "Flipnote"("id");

-- AddForeignKey
ALTER TABLE "Flipnote" ADD CONSTRAINT "Flipnote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
