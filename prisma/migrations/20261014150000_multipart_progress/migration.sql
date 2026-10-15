-- Migrasi progress ke model MULTI-PART (Part 01–39).
-- Skema lama hanya mengenal Part 01 (subbab INTEGER, id SERIAL); data lama
-- tidak dipertahankan karena struktur part/subbab ditulis ulang.

-- DropTable
DROP TABLE "subbab_progress";

-- Hapus meta lama (key "current" format tunggal) agar tidak tercampur.
DELETE FROM "app_meta";

-- CreateTable (baru: composite key partId + subbab)
CREATE TABLE "subbab_progress" (
    "partId" TEXT NOT NULL,
    "subbab" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "answers" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subbab_progress_pkey" PRIMARY KEY ("partId", "subbab")
);
