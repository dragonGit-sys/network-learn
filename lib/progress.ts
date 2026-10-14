// Tipe + validasi data progress. Dipakai API route (server) dan halaman Part 01 (client).
// Validasi penting: data dari DB / localStorage / network tidak pernah dipercaya mentah.

export interface ProgressState {
  /** index sub-bab -> true bila quiz-nya lulus */
  passed: Record<number, true>;
  /** index sub-bab -> { index soal -> index opsi yang dipilih } */
  answers: Record<number, Record<number, number>>;
  /** index sub-bab terakhir dibuka */
  current: number;
}

export const emptyProgress = (): ProgressState => ({ passed: {}, answers: {}, current: 0 });

export interface LessonMeta {
  quizLength: number;
  optionCount: (qIdx: number) => number;
}

/**
 * Bersihkan & validasi state progress terhadap struktur quiz aktual.
 * Mengembalikan state yang aman dipakai; field tak valid dibuang.
 */
export function sanitizeProgress(
  raw: unknown,
  lessonCount: number,
  metaFor: (i: number) => LessonMeta,
): ProgressState {
  const clean = emptyProgress();
  if (!raw || typeof raw !== 'object') return clean;
  const d = raw as Record<string, unknown>;

  if (d.passed && typeof d.passed === 'object') {
    for (const k of Object.keys(d.passed)) {
      const i = parseInt(k, 10);
      if ((d.passed as Record<string, unknown>)[k] && Number.isInteger(i) && i >= 0 && i < lessonCount) {
        clean.passed[i] = true;
      }
    }
  }

  if (d.answers && typeof d.answers === 'object') {
    for (const k of Object.keys(d.answers)) {
      const i = parseInt(k, 10);
      const ans = (d.answers as Record<string, unknown>)[k];
      if (!Number.isInteger(i) || i < 0 || i >= lessonCount || !ans || typeof ans !== 'object') continue;
      const meta = metaFor(i);
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
      if (Object.keys(perQ).length > 0) clean.answers[i] = perQ;
    }
  }

  if (typeof d.current === 'number' && Number.isInteger(d.current) && d.current >= 0 && d.current < lessonCount) {
    clean.current = d.current;
  }
  return clean;
}

/** Sub-bab i terbuka bila i==0 atau sub-bab i-1 sudah lulus (puzzle gating). */
export function isUnlocked(i: number, passed: Record<number, true>): boolean {
  return i === 0 || !!passed[i - 1];
}

export const STORAGE_KEY = 'nevl-part01-progress-v1';
