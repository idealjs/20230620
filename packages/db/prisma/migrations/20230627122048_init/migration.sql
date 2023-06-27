-- CreateTable
CREATE TABLE "Hello" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "Hello_id_key" ON "Hello"("id");
