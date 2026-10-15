// Registry part Network Engineer Virtual Lab.
// Dirakit dari file-file lib/parts/part-XX.ts. Urutan mengikuti PART_ORDER.
import { PART_ORDER, PHASES, type Part, type Phase } from './types';
import { HERO_HTML, FOOTER_HTML } from './meta';
import { part01 } from './part-01';
import { part02 } from './part-02';
import { part03 } from './part-03';
import { part04 } from './part-04';
import { part05 } from './part-05';
import { part06 } from './part-06';
import { part07 } from './part-07';
import { part08 } from './part-08';
import { part09 } from './part-09';
import { part10 } from './part-10';
import { part11 } from './part-11';
import { part12 } from './part-12';
import { part13 } from './part-13';
import { part14 } from './part-14';
import { part15 } from './part-15';
import { part16 } from './part-16';
import { part17 } from './part-17';
import { part18 } from './part-18';
import { part19 } from './part-19';
import { part20 } from './part-20';
import { part21 } from './part-21';
import { part22 } from './part-22';
import { part23 } from './part-23';
import { part24 } from './part-24';
import { part25 } from './part-25';
import { part26 } from './part-26';
import { part27 } from './part-27';
import { part28 } from './part-28';
import { part29 } from './part-29';
import { part30 } from './part-30';
import { part31 } from './part-31';
import { part32 } from './part-32';
import { part33 } from './part-33';
import { part34 } from './part-34';
import { part35 } from './part-35';
import { part36 } from './part-36';
import { part37 } from './part-37';
import { part38 } from './part-38';
import { part39 } from './part-39';

export { PART_ORDER, PHASES, HERO_HTML, FOOTER_HTML };
export type { Part, Phase };
export type { SubBab, QuizQuestion, PartProject } from './types';

const _parts: Part[] = [
  part01,
  part02,
  part03,
  part04,
  part05,
  part06,
  part07,
  part08,
  part09,
  part10,
  part11,
  part12,
  part13,
  part14,
  part15,
  part16,
  part17,
  part18,
  part19,
  part20,
  part21,
  part22,
  part23,
  part24,
  part25,
  part26,
  part27,
  part28,
  part29,
  part30,
  part31,
  part32,
  part33,
  part34,
  part35,
  part36,
  part37,
  part38,
  part39,
];

export const PART_MAP: Record<string, Part> = Object.fromEntries(
  _parts.map((p) => [p.id, p]),
);

export function getPart(id: string): Part | undefined {
  return PART_MAP[id];
}

/** Semua part yang terdaftar, berurutan sesuai PART_ORDER. */
export const PARTS: Part[] = PART_ORDER.map((id) => PART_MAP[id]).filter(
  (p): p is Part => !!p,
);

export function getPhase(phaseId: string): Phase | undefined {
  return PHASES.find((p) => p.id === phaseId);
}

/** Part berikutnya dalam urutan kurikulum (null bila ini part terakhir). */
export function nextPartId(id: string): string | null {
  const i = PART_ORDER.indexOf(id);
  return i >= 0 && i < PART_ORDER.length - 1 ? PART_ORDER[i + 1] : null;
}

/** Part sebelumnya dalam urutan kurikulum (null bila ini part pertama). */
export function prevPartId(id: string): string | null {
  const i = PART_ORDER.indexOf(id);
  return i > 0 ? PART_ORDER[i - 1] : null;
}
