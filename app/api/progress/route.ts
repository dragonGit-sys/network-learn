import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LESSONS } from "@/lib/data";
import { sanitizeProgress, type ProgressState } from "@/lib/progress";

const metaFor = (i: number) => ({
  quizLength: LESSONS[i]?.quiz.length ?? 0,
  optionCount: (qIdx: number) => LESSONS[i]?.quiz[qIdx]?.o.length ?? 0,
});

function toJson(state: ProgressState) {
  return { passed: state.passed, answers: state.answers, current: state.current };
}

/**
 * GET /api/progress — muat seluruh progress dari PostgreSQL lokal.
 * 503 bila database tidak terjangkau (client lalu memakai mode fallback browser).
 */
export async function GET() {
  try {
    const [rows, meta] = await Promise.all([
      prisma.subbabProgress.findMany(),
      prisma.appMeta.findUnique({ where: { key: "current" } }),
    ]);
    const raw: Record<string, unknown> = { passed: {}, answers: {}, current: 0 };
    for (const r of rows) {
      if (r.passed) (raw.passed as Record<string, unknown>)[String(r.subbab)] = true;
      if (r.answers) (raw.answers as Record<string, unknown>)[String(r.subbab)] = r.answers;
    }
    if (meta) raw.current = parseInt(meta.value, 10);
    const clean = sanitizeProgress(raw, LESSONS.length, metaFor);
    return NextResponse.json({ ok: true, persisted: true, ...toJson(clean) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, persisted: false, error: "Database tidak terjangkau." },
      { status: 503 },
    );
  }
}

/**
 * POST /api/progress — simpan progress.
 * Body: { passed: {idx: true}, answers: {idx: {qIdx: optIdx}}, current: idx }
 */
export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const clean = sanitizeProgress(body, LESSONS.length, metaFor);

    await prisma.$transaction(async (tx) => {
      await tx.subbabProgress.deleteMany();
      const touched = new Set<number>([
        ...Object.keys(clean.passed).map(Number),
        ...Object.keys(clean.answers).map(Number),
      ]);
      for (const i of touched) {
        await tx.subbabProgress.create({
          data: {
            subbab: i,
            passed: !!clean.passed[i],
            answers: clean.answers[i] ?? undefined,
          },
        });
      }
      await tx.appMeta.upsert({
        where: { key: "current" },
        update: { value: String(clean.current) },
        create: { key: "current", value: String(clean.current) },
      });
    });

    return NextResponse.json({ ok: true, persisted: true, ...toJson(clean) });
  } catch (e) {
    return NextResponse.json(
      { ok: false, persisted: false, error: "Gagal menyimpan ke database." },
      { status: 503 },
    );
  }
}

/** DELETE /api/progress — hapus seluruh progress (reset). */
export async function DELETE() {
  try {
    await prisma.$transaction([
      prisma.subbabProgress.deleteMany(),
      prisma.appMeta.deleteMany(),
    ]);
    return NextResponse.json({ ok: true, persisted: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, persisted: false, error: "Gagal mereset database." },
      { status: 503 },
    );
  }
}
