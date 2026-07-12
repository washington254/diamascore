-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('Shopify', 'WordPress');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "platform" "Platform" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "registeredAt" TIMESTAMP(3) NOT NULL,
    "popupOpens" INTEGER NOT NULL DEFAULT 0,
    "popupCloses" INTEGER NOT NULL DEFAULT 0,
    "popupSuccess" INTEGER NOT NULL DEFAULT 0,
    "popupRejection" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
