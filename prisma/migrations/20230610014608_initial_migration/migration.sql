-- CreateTable
CREATE TABLE "file_storage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id")
);
