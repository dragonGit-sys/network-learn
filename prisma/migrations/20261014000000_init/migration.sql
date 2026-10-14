-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "subbab_progress" (
    "id" SERIAL NOT NULL,
    "subbab" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "answers" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subbab_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_meta" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_meta_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "subbab_progress_subbab_key" ON "subbab_progress"("subbab");

