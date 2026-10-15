// Skema konten terpusat Network Engineer Virtual Lab.
// Satu Part = satu file di lib/parts/part-XX.ts yang mengekspor `export const partXX: Part`.
// JANGAN ubah interface ini tanpa mengoordinasikan dengan semua file part.

export interface QuizQuestion {
  q: string;
  /** Tepat 4 opsi (A–D). */
  options: string[];
  /** Index jawaban benar, 0..3. */
  answer: number;
  /** Penjelasan jawaban benar (opsional; Part 01 tidak punya). */
  explain?: string;
}

export interface SubBab {
  /** id sub-bab, mis. '2.1' */
  id: string;
  title: string;
  /**
   * HTML materi utama. Gunakan: <p>, <h3>, <ul>/<ol><li>, <code>,
   * <div class="tblwrap"><table>...</table></div> untuk tabel,
   * <pre>...</pre> untuk diagram ASCII / output command,
   * <div class="callout"><div class="t">Judul</div><p>...</p></div> untuk callout
   * (tambah class "blue" untuk varian biru).
   * JANGAN tulis bagian Ringkasan/Summary di body — viewer menampilkannya otomatis.
   * JANGAN tulis bagian Dokumentasi/Portfolio — viewer menampilkannya otomatis.
   */
  body: string;
  /** Terminologi penting: [istilah, penjelasan]. */
  terms?: [string, string][];
  /** Diagram/topologi ASCII dalam tag <pre> (opsional, tampil di bawah materi). */
  diagram?: string;
  /** Skenario dunia nyata. */
  scenario?: string;
  bestPractices?: string;
  /** Security consideration. */
  security?: string;
  /** Challenge — uji pemahaman. */
  challenge?: string;
  /** Format "Q: ... — A: ...". */
  interviewQ?: string;
  /** Tepat 3 soal per sub-bab (gerbang puzzle). */
  quiz: QuizQuestion[];
}

export interface PartProject {
  title: string;
  /** HTML: deskripsi tugas + langkah + panduan upload GitHub + kriteria selesai. */
  html: string;
}

export interface Part {
  /** '02' */
  id: string;
  /** 'PART 02' */
  number: string;
  title: string;
  /** 'fase-1' */
  phaseId: string;
  description: string;
  /** folder repo GitHub, mis. 'part-02-osi-tcpip' */
  repoFolder: string;
  objectives: string[];
  prerequisites: string;
  subbabs: SubBab[];
  /** Hanya untuk part yang butuh hands-on/project. */
  project?: PartProject;
}

export interface Phase {
  id: string;
  n: string;
  t: string;
  d: string;
}

/**
 * Urutan part resmi kurikulum: 39 part berurutan (01–39),
 * termasuk Part 34 (Python), 36 (Ansible), dan 37 (Automation Project & API).
 */
export const PART_ORDER: string[] = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
  '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
  '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36',
  '37', '38', '39',
];

export const PHASES: Phase[] = [
  { id: 'fase-1', n: 'FASE 1', t: 'Fundamental', d: 'Part 01–07 · Konsep dasar, OSI, IP, kabel & fiber' },
  { id: 'fase-2', n: 'FASE 2', t: 'Switching & Routing', d: 'Part 08–12 · VLAN, STP, OSPF' },
  { id: 'fase-3', n: 'FASE 3', t: 'Platform & Security', d: 'Part 13–18 · MikroTik, GNS3, FortiGate' },
  { id: 'fase-4', n: 'FASE 4', t: 'Enterprise Design', d: 'Part 19–22 · Arsitektur & services' },
  { id: 'fase-5', n: 'FASE 5', t: 'Monitoring', d: 'Part 23–27 · Zabbix & Grafana' },
  { id: 'fase-6', n: 'FASE 6', t: 'Troubleshooting & Security', d: 'Part 28–31 · Methodologi, HA, VPN' },
  { id: 'fase-7', n: 'FASE 7', t: 'Automation & Final', d: 'Part 32–39 · Linux, Python, Ansible, automation project, final lab' },
];
