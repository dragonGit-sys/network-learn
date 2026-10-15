// Tipe + validasi + puzzle-gating progress MULTI-PART.
// Dipakai API route (server) dan viewer part (client).
// Validasi penting: data dari DB / localStorage / network tidak pernah dipercaya mentah.

import { PART_ORDER, type Part } from './parts/types';

export interface PartProgressState {
  /** subbab id -> true bila quiz-nya lulus */
  passed: Record<string, true>;
  /** subbab id -> { index soal -> index opsi yang dipilih } */
  answers: Record<string, Record<number, number>>;
  /** id sub-bab terakhir dibuka */
  current: string;
}

/** partId -> progress part tersebut */
export type AllProgress = Record<string, PartProgressState>;

export const emptyPartProgress = (): PartProgressState => ({
  passed: {},
  answers: {},
  current: '',
});

export const emptyAllProgress = (): AllProgress => ({});

export interface SubbabQuizMeta {
  quizLength: number;
  optionCount: (qIdx: number) => number;
}

/**
 * Bersihkan & validasi progress satu part terhadap struktur quiz aktualnya.
 */
export function sanitizePartProgress(raw: unknown, part: Part): PartProgressState {
  const clean = emptyPartProgress();
  if (!raw || typeof raw !== 'object') return clean;
  const d = raw as Record<string, unknown>;
  const ids = new Set(part.subbabs.map((s) => s.id));
  const metaFor = (id: string): SubbabQuizMeta => {
    const sb = part.subbabs.find((s) => s.id === id);
    return {
      quizLength: sb?.quiz.length ?? 0,
      optionCount: (qIdx: number) => sb?.quiz[qIdx]?.options.length ?? 0,
    };
  };

  if (d.passed && typeof d.passed === 'object') {
    for (const k of Object.keys(d.passed)) {
      if ((d.passed as Record<string, unknown>)[k] && ids.has(k)) {
        clean.passed[k] = true;
      }
    }
  }

  if (d.answers && typeof d.answers === 'object') {
    for (const k of Object.keys(d.answers)) {
      if (!ids.has(k)) continue;
      const ans = (d.answers as Record<string, unknown>)[k];
      if (!ans || typeof ans !== 'object') continue;
      const meta = metaFor(k);
      const perQ: Record<number, number> = {};
      for (const q of Object.keys(ans)) {
        const qi = parseInt(q, 10);
        const oi = (ans as Record<string, unknown>)[q];
        if (
          Number.isInteger(qi) && qi >= 0 && qi < meta.quizLength &&
          typeof oi === 'number' && Number.isInteger(oi) && oi >= 0 && oi < meta.optionCount(qi)
        ) {
          perQ[qi] = oi;
        }
      }
      if (Object.keys(perQ).length > 0) clean.answers[k] = perQ;
    }
  }

  if (typeof d.current === 'string' && ids.has(d.current)) {
    clean.current = d.current;
  }
  return clean;
}

/** Validasi seluruh map progress terhadap daftar part yang dikenal. */
export function sanitizeAllProgress(raw: unknown, parts: Part[]): AllProgress {
  const clean: AllProgress = {};
  if (!raw || typeof raw !== 'object') return clean;
  const byId = new Map(parts.map((p) => [p.id, p]));
  for (const [pid, pstate] of Object.entries(raw as Record<string, unknown>)) {
    const part = byId.get(pid);
    if (part) clean[pid] = sanitizePartProgress(pstate, part);
  }
  return clean;
}

export function prevPartId(partId: string): string | null {
  const i = PART_ORDER.indexOf(partId);
  return i > 0 ? PART_ORDER[i - 1] : null;
}

export function nextPartId(partId: string): string | null {
  const i = PART_ORDER.indexOf(partId);
  return i >= 0 && i < PART_ORDER.length - 1 ? PART_ORDER[i + 1] : null;
}

/**
 * Part terbuka bila ia part pertama, atau sub-bab TERAKHIR part sebelumnya lulus.
 * getPart: lookup part dari registry (menghindari circular import).
 */
export function isPartUnlocked(
  partId: string,
  all: AllProgress,
  getPart: (id: string) => Part | undefined,
): boolean {
  if (partId === PART_ORDER[0]) return true;
  const prev = prevPartId(partId);
  if (!prev) return true;
  const prevPart = getPart(prev);
  if (!prevPart || prevPart.subbabs.length === 0) return false;
  const lastId = prevPart.subbabs[prevPart.subbabs.length - 1].id;
  return !!all[prev]?.passed[lastId];
}

/** Sub-bab idx terbuka bila idx==0 (dan part-nya terbuka) atau sub-bab sebelumnya lulus. */
export function isSubbabUnlocked(
  part: Part,
  idx: number,
  all: AllProgress,
  getPart: (id: string) => Part | undefined,
): boolean {
  if (idx === 0) return isPartUnlocked(part.id, all, getPart);
  const prevId = part.subbabs[idx - 1].id;
  return !!all[part.id]?.passed[prevId];
}

/** Jumlah sub-bab lulus dalam satu part. */
export function partProgressCount(part: Part, all: AllProgress): number {
  const st = all[part.id];
  if (!st) return 0;
  return part.subbabs.filter((s) => st.passed[s.id]).length;
}

/** Apakah seluruh part tuntas (semua sub-bab lulus). */
export function isPartComplete(part: Part, all: AllProgress): boolean {
  return partProgressCount(part, all) === part.subbabs.length && part.subbabs.length > 0;
}

export const STORAGE_KEY = 'nevl-progress-v2';
/** Key lama (Part 01 saja) — dipakai sekali untuk migrasi ke v2. */
export const LEGACY_STORAGE_KEY = 'nevl-part01-progress-v1';
