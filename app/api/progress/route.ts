import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPart, PARTS } from '@/lib/parts';
import {
  sanitizePartProgress,
  sanitizeAllProgress,
  type AllProgress,
  type PartProgressState,
} from '@/lib/progress';

function toJsonPart(s: PartProgressState) {
  return { passed: s.passed, answers: s.answers, current: s.current };
}

/**
 * GET /api/progress — muat seluruh progress dari PostgreSQL lokal.
 * 503 bila database tidak terjangkau (client lalu memakai mode fallback browser).
 */
export async function GET() {
  try {
    const [rows, metas] = await Promise.all([
      prisma.subbabProgress.findMany(),
      prisma.appMeta.findMany(),
    ]);
    const raw: Record<string, unknown> = {};
    for (const r of rows) {
      const p = ((raw[r.partId] ??= {}) as Record<string, unknown>);
      const pp = ((p.passed ??= {}) as Record<string, unknown>);
      const an = ((p.answers ??= {}) as Record<string, unknown>);
      if (r.passed) pp[r.subbab] = true;
      if (r.answers) an[r.subbab] = r.answers;
    }
    for (const m of metas) {
      if (m.key.startsWith('current:')) {
        const pid = m.key.slice('current:'.length);
        const p = ((raw[pid] ??= {}) as Record<string, unknown>);
        p.current = m.value;
      }
    }
    const clean = sanitizeAllProgress(raw, PARTS);
    const parts: AllProgress = {};
    for (const [pid, st] of Object.entries(clean)) parts[pid] = toJsonPart(st);
    return NextResponse.json({ ok: true, persisted: true, parts });
  } catch {
    return NextResponse.json(
      { ok: false, persisted: false, error: 'Database tidak terjangkau.' },
      { status: 503 },
    );
  }
}

/**
 * POST /api/progress — simpan progress satu part.
 * Body: { partId: '02', passed: {subbabId: true}, answers: {subbabId: {qIdx: optIdx}}, current: subbabId }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      partId?: unknown;
      passed?: unknown;
      answers?: unknown;
      current?: unknown;
    };
    const partId = typeof body.partId === 'string' ? body.partId : '';
    const part = getPart(partId);
    if (!part) {
      return NextResponse.json({ ok: false, error: 'partId tidak dikenal.' }, { status: 400 });
    }
    const clean = sanitizePartProgress(body, part);

    await prisma.$transaction(async (tx) => {
      await tx.subbabProgress.deleteMany({ where: { partId } });
      const touched = new Set<string>([
        ...Object.keys(clean.passed),
        ...Object.keys(clean.answers),
      ]);
      for (const sid of touched) {
        await tx.subbabProgress.create({
          data: {
            partId,
            subbab: sid,
            passed: !!clean.passed[sid],
            answers: clean.answers[sid] ?? undefined,
          },
        });
      }
      await tx.appMeta.upsert({
        where: { key: `current:${partId}` },
        update: { value: clean.current },
        create: { key: `current:${partId}`, value: clean.current },
      });
    });

    return NextResponse.json({ ok: true, persisted: true, partId, ...toJsonPart(clean) });
  } catch {
    return NextResponse.json(
      { ok: false, persisted: false, error: 'Gagal menyimpan ke database.' },
      { status: 503 },
    );
  }
}

/**
 * DELETE /api/progress — reset progress.
 * ?partId=xx → hanya part itu; tanpa param → seluruh progress.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partId = searchParams.get('partId');
    if (partId) {
      await prisma.$transaction([
        prisma.subbabProgress.deleteMany({ where: { partId } }),
        prisma.appMeta.deleteMany({ where: { key: `current:${partId}` } }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.subbabProgress.deleteMany(),
        prisma.appMeta.deleteMany(),
      ]);
    }
    return NextResponse.json({ ok: true, persisted: true });
  } catch {
    return NextResponse.json(
      { ok: false, persisted: false, error: 'Gagal mereset database.' },
      { status: 503 },
    );
  }
}
