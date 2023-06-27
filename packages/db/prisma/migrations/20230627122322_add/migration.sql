-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_name" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "create_time" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ToDoList" (
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_time" DATETIME NOT NULL,
    "update_time" DATETIME NOT NULL,
    CONSTRAINT "ToDoList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ToDoList_user_id_key" ON "ToDoList"("user_id");
