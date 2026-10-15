'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getPart,
  getPhase,
  nextPartId,
  PARTS,
  type Part,
  type QuizQuestion,
  type SubBab,
} from '@/lib/parts';
import {
  sanitizePartProgress,
  sanitizeAllProgress,
  emptyPartProgress,
  isSubbabUnlocked,
  isPartUnlocked,
  isPartComplete,
  partProgressCount,
  prevPartId,
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  type AllProgress,
  type PartProgressState,
} from '@/lib/progress';
import PhaseBar from '@/components/PhaseBar';
import Footer from '@/components/Footer';

const VIEW_PROJECT = 'project';
type Mode = 'db' | 'browser';

/** Ambang lulus quiz: 2/3 (faithful dengan Part 01: minimal 2 dari 3 benar). */
function passThreshold(quizLen: number): number {
  return Math.max(1, Math.ceil((quizLen * 2) / 3));
}

/* ---------- port faithful: termsHtml ---------- */
function termsHtml(terms?: [string, string][]): string {
  if (!terms || !terms.length) return '';
  return (
    '<h3>Terminologi Penting</h3><div class="terms">' +
    terms
      .map(
        (t) =>
          '<div class="term"><div class="w">' +
          t[0] +
          '</div><div class="d">' +
          t[1] +
          '</div></div>',
      )
      .join('') +
    '</div>'
  );
}

/* ---------- port faithful: closingHtml (field opsional dirender bila ada) ---------- */
function closingHtml(part: Part, sb: SubBab): string {
  const h3p = (t: string, b?: string) => (b ? `<h3>${t}</h3><p>${b}</p>` : '');
  const dg = sb.diagram ? '<h3>Diagram / Topology</h3>' + sb.diagram : '';
  const ch = sb.challenge
    ? '<h3>Challenge — Uji Pemahamanmu</h3><div class="callout"><p style="margin:0">' +
      sb.challenge +
      '</p></div>'
    : '';
  const doc =
    '<h3>Dokumentasi &amp; Portfolio Artifact</h3><p>Catat pemahaman sub-bab ini di repository GitHub-mu (<code>network-engineer-lab/' +
    part.repoFolder +
    '/</code>) sebagai file <code>notes-' +
    sb.id +
    '.md</code>: definisi dengan kata-katamu sendiri, 1 diagram versi gambarmu, dan hasil challenge di atas bila ada. Kebiasaan mendokumentasikan setiap sub-bab inilah yang di Part 38 menjadi sistem dokumentasi enterprise penuh — dan yang membedakan portfolio-mu dari sekadar sertifikat.</p>';
  const summary =
    '<h3>Summary</h3><p>Sub-bab ' +
    sb.id +
    ' membangun satu fondasi: <b>' +
    sb.title +
    '</b>. Pastikan kamu bisa menjelaskannya dengan kata-katamu sendiri — bukan menghafal — sebelum menekan tombol quiz. Itulah standar yang dipakai di seluruh 39 part lab ini.</p>';
  return (
    dg +
    h3p('Skenario Dunia Nyata', sb.scenario) +
    h3p('Best Practices', sb.bestPractices) +
    h3p('Security Consideration', sb.security) +
    ch +
    h3p('Interview Question', sb.interviewQ) +
    doc +
    summary
  );
}

/** Konversi progress lama Part 01 (key v1, index numerik) ke format v2. */
function migrateV1(part: Part, v1: unknown): PartProgressState | null {
  if (!v1 || typeof v1 !== 'object') return null;
  const d = v1 as Record<string, unknown>;
  const clean = emptyPartProgress();
  const sbAt = (i: number) => part.subbabs[i];
  if (d.passed && typeof d.passed === 'object') {
    for (const k of Object.keys(d.passed)) {
      const sb = sbAt(parseInt(k, 10));
      if (sb && (d.passed as Record<string, unknown>)[k]) clean.passed[sb.id] = true;
    }
  }
  if (d.answers && typeof d.answers === 'object') {
    for (const k of Object.keys(d.answers)) {
      const sb = sbAt(parseInt(k, 10));
      if (!sb) continue;
      const ans = (d.answers as Record<string, unknown>)[k];
      if (!ans || typeof ans !== 'object') continue;
      const perQ: Record<number, number> = {};
      for (const q of Object.keys(ans)) {
        const qi = parseInt(q, 10);
        const oi = (ans as Record<string, unknown>)[q];
        if (
          Number.isInteger(qi) && qi >= 0 && qi < sb.quiz.length &&
          typeof oi === 'number' && Number.isInteger(oi) && oi >= 0 &&
          oi < (sb.quiz[qi]?.options.length ?? 0)
        ) {
          perQ[qi] = oi;
        }
      }
      if (Object.keys(perQ).length > 0) clean.answers[sb.id] = perQ;
    }
  }
  const curSb = typeof d.current === 'number' ? sbAt(d.current) : undefined;
  if (curSb) clean.current = curSb.id;
  if (Object.keys(clean.passed).length === 0 && Object.keys(clean.answers).length === 0) return null;
  return clean;
}

function nowStamp(): string {
  const t = new Date();
  return `${String(t.getHours()).padStart(2, '0')}.${String(t.getMinutes()).padStart(2, '0')}`;
}

/* ================= LESSON VIEW ================= */

function LessonView({
  part,
  sb,
  idx,
  sel,
  chk,
  passedThis,
  onSelect,
  onCheck,
  onPrev,
  onNext,
  onProject,
}: {
  part: Part;
  sb: SubBab;
  idx: number;
  sel: Record<number, number>;
  chk: { score: number } | null;
  passedThis: boolean;
  onSelect: (q: number, o: number) => void;
  onCheck: () => void;
  onPrev: () => void;
  onNext: () => void;
  onProject: () => void;
}) {
  const total = part.subbabs.length;
  const lastId = part.subbabs[total - 1]?.id ?? '';
  const threshold = passThreshold(sb.quiz.length);
  const bodyHtml = sb.body + termsHtml(sb.terms) + closingHtml(part, sb);

  let resultEl: React.ReactNode = null;
  if (chk) {
    if (chk.score >= threshold) {
      resultEl = (
        <div className="quiz-result pass">
          ✅ <b>Lulus! Skor {chk.score} / {sb.quiz.length}.</b>{' '}
          {idx < total - 1 ? (
            <>
              Sub-bab <b>{part.subbabs[idx + 1].id} — {part.subbabs[idx + 1].title}</b> sekarang
              terbuka. Klik tombol di bawah atau pilih di daftar kiri.
            </>
          ) : part.project ? (
            <>
              Ini sub-bab terakhir {part.number} — <b>{part.project.title}</b>{' '}
              sekarang terbuka!
            </>
          ) : (
            <>Ini sub-bab terakhir {part.number} — part ini tuntas! 🎉</>
          )}
        </div>
      );
    } else {
      resultEl = (
        <div className="quiz-result fail">
          ❌ <b>Skor {chk.score} / {sb.quiz.length} — belum lulus</b> (butuh minimal{' '}
          {threshold}). Pilihan hijau adalah jawaban benar. Baca ulang bagian materinya,
          pahami alasannya, lalu coba lagi.
        </div>
      );
    }
  }

  return (
    <>
      <div className="crumb">{part.number} — {part.title.toUpperCase()} · SUB-BAB {sb.id} / {lastId}</div>
      <h2>
        <span className="num">{sb.id}</span> {sb.title}
      </h2>

      {idx === 0 ? (
        <div className="callout blue obj">
          <div className="t">LEARNING OBJECTIVES</div>
          <ul>
            {part.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
          <div className="t" style={{ marginTop: 12 }}>PREREQUISITES</div>
          <p style={{ margin: '4px 0 0' }}>{part.prerequisites}</p>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          <b>Prerequisites:</b>{' '}
          {`Sub-bab ${part.subbabs[idx - 1].id} (${part.subbabs[idx - 1].title}) — sudah kamu lulus quiznya.`}
        </p>
      )}

      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <div className="quiz">
        <h3>Quiz {sb.id} — Gerbang ke Sub-bab Berikutnya</h3>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>
          Jawab semua soal. Minimal <b>{threshold} dari {sb.quiz.length} benar</b> untuk membuka
          sub-bab berikutnya. Salah? Baca ulang materinya dan coba lagi — tidak ada batas
          percobaan.
        </p>
        {sb.quiz.map((q: QuizQuestion, qi: number) => (
          <div className="q" key={qi}>
            <div className="qt">
              {qi + 1}. {q.q}
            </div>
            {q.options.map((o, oi) => {
              let cls = 'opt';
              if (sel[qi] === oi) cls += ' sel';
              if (chk) {
                if (oi === q.answer) cls += ' right';
                else if (sel[qi] === oi) cls += ' wrong';
              }
              return (
                <button key={oi} className={cls} onClick={() => onSelect(qi, oi)}>
                  {String.fromCharCode(65 + oi)}. {o}
                </button>
              );
            })}
            {chk && q.explain && (
              <div style={{ marginTop: 8, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                💡 {q.explain}
              </div>
            )}
          </div>
        ))}
        <button className="btn" onClick={onCheck}>
          Periksa Jawaban
        </button>
        {resultEl}
        <div className="navrow">
          {idx > 0 && (
            <button className="btn ghost" onClick={onPrev}>
              ← Sub-bab sebelumnya
            </button>
          )}
          {passedThis && idx < total - 1 && (
            <button className="btn" onClick={onNext}>
              Lanjut ke {part.subbabs[idx + 1].id} →
            </button>
          )}
          {passedThis && idx === total - 1 && part.project && (
            <button className="btn" onClick={onProject}>
              Lihat Project {part.number} ★
            </button>
          )}
          {passedThis && idx === total - 1 && !part.project && nextPartId(part.id) && (
            <a className="btn" href={`/part/${nextPartId(part.id)}`}>
              Lanjut ke Part {nextPartId(part.id)} →
            </a>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= PROJECT VIEW ================= */

function ProjectView({ part, onBack }: { part: Part; onBack: () => void }) {
  if (!part.project) return null;
  const next = nextPartId(part.id);
  const nextPart = next ? getPart(next) : undefined;
  const total = part.subbabs.length;
  return (
    <>
      <div className="crumb">{part.number} — {part.title.toUpperCase()} · PROJECT PORTFOLIO</div>
      <h2>★ {part.project.title}</h2>
      <p style={{ color: 'var(--muted)' }}>
        Selamat — kamu menuntaskan seluruh sub-bab {part.number}. Project ini mengubah
        pemahaman itu menjadi artefak portfolio nyata.
      </p>
      <div dangerouslySetInnerHTML={{ __html: part.project.html }} />
      <div className="callout">
        <div className="t">Setelah Project Selesai</div>
        <p style={{ margin: '4px 0 0' }}>
          Tandai project ini selesai di repository GitHub-mu
          {next && nextPart ? (
            <>, lalu lanjut ke <b>Part {next} — {nextPart.title}</b>.</>
          ) : (
            <>. 🎉 Ini part terakhir — kamu menuntaskan seluruh kurikulum!</>
          )}
        </p>
      </div>
      <div className="navrow">
        <button className="btn ghost" onClick={onBack}>
          ← Kembali ke {part.subbabs[total - 1]?.id}
        </button>
        {next && (
          <a className="btn" href={`/part/${next}`}>
            Part {next} — {nextPart?.title} →
          </a>
        )}
      </div>
    </>
  );
}

/* ================= VIEWER UTAMA ================= */

export default function PartViewer({ partId }: { partId: string }) {
  const part = getPart(partId);
  if (!part) throw new Error(`Part tidak dikenal: ${partId}`);
  const firstId = part.subbabs[0]?.id ?? '';
  const lastId = part.subbabs[part.subbabs.length - 1]?.id ?? '';

  const [view, setView] = useState<string>(firstId);
  const [passed, setPassed] = useState<Record<string, true>>({});
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});
  const [checked, setChecked] = useState<Record<string, { score: number }>>({});
  const [all, setAll] = useState<AllProgress>({});
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('db');
  const [saveStatus, setSaveStatus] = useState('Memuat progress…');
  const [resetArmed, setResetArmed] = useState(false);

  const modeRef = useRef<Mode>('db');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  const setModeBoth = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
  };

  const writeLocal = (st: PartProgressState) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const doc = raw ? JSON.parse(raw) : {};
      doc.parts = doc.parts ?? {};
      doc.parts[partId] = { passed: st.passed, answers: st.answers, current: st.current };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
    } catch { /* abaikan */ }
  };

  /* ---------- persistence ---------- */
  const persist = async (st: PartProgressState) => {
    writeLocal(st); // salinan browser selalu ditulis (cadangan offline)
    if (modeRef.current === 'db') {
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partId,
            passed: st.passed,
            answers: st.answers,
            current: st.current,
          }),
        });
        if (!res.ok) throw new Error('api ' + res.status);
        setSaveStatus(`✓ Progress tersimpan di database lokal · ${nowStamp()}`);
        return;
      } catch {
        setModeBoth('browser');
      }
    }
    setSaveStatus('⚠ Database tidak terjangkau — progress tersimpan di browser ini.');
  };

  /* ---------- init ---------- */
  useEffect(() => {
    (async () => {
      const applyState = (st: PartProgressState, allClean: AllProgress, dbMode: boolean) => {
        // validasi current: harus sub-bab yang terbuka
        let cur = st.current;
        const idx = part.subbabs.findIndex((s) => s.id === cur);
        if (idx < 0 || !isSubbabUnlocked(part, idx, allClean, getPart)) {
          // mundur ke sub-bab terbuka terakhir yang masuk akal
          const fallback =
            [...part.subbabs].reverse().find((s, ri) =>
              isSubbabUnlocked(part, part.subbabs.length - 1 - ri, allClean, getPart),
            )?.id ?? firstId;
          cur = fallback;
        }
        const final = { ...st, current: cur };
        setAll(allClean);
        setPassed(final.passed);
        setAnswers(final.answers);
        setView(cur);
        setModeBoth(dbMode ? 'db' : 'browser');
        const hadSaved =
          Object.keys(final.passed).length > 0 || Object.keys(final.answers).length > 0;
        if (dbMode) {
          setSaveStatus(
            hadSaved
              ? '✓ Progress sebelumnya dimuat dari database lokal.'
              : '✓ Progress tersimpan di database lokal.',
          );
        } else {
          setSaveStatus(
            hadSaved
              ? '⚠ Database tidak terjangkau — progress sebelumnya dimuat dari browser ini.'
              : '⚠ Database tidak terjangkau — progress tersimpan di browser ini.',
          );
        }
        setReady(true);
        persist(final).catch(() => {});
      };

      try {
        const res = await fetch('/api/progress');
        if (!res.ok) throw new Error('api ' + res.status);
        const d: unknown = await res.json();
        const allClean = sanitizeAllProgress((d as { parts?: unknown }).parts, PARTS);
        applyState(allClean[partId] ?? emptyPartProgress(), allClean, true);
      } catch {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const allClean = sanitizeAllProgress(raw ? JSON.parse(raw).parts : null, PARTS);
          // migrasi satu kali dari key lama Part 01 (v1)
          if (partId === '01' && !allClean['01']) {
            try {
              const v1raw = localStorage.getItem(LEGACY_STORAGE_KEY);
              if (v1raw) {
                const conv = migrateV1(part, JSON.parse(v1raw));
                if (conv) {
                  allClean['01'] = conv;
                  localStorage.removeItem(LEGACY_STORAGE_KEY);
                }
              }
            } catch { /* abaikan */ }
          }
          applyState(allClean[partId] ?? emptyPartProgress(), allClean, false);
        } catch {
          applyState(emptyPartProgress(), {}, false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partId]);

  const scrollToPanel = () => {
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  /* ---------- aksi ---------- */
  const openLesson = (id: string) => {
    setView(id);
    setChecked({});
    const st = { passed, answers, current: id };
    setAll((prev) => ({ ...prev, [partId]: st }));
    persist(st);
    scrollToPanel();
  };

  const openProject = () => {
    setView(VIEW_PROJECT);
    const st = { passed, answers, current: lastId };
    setAll((prev) => ({ ...prev, [partId]: st }));
    persist(st);
    scrollToPanel();
  };

  const selectOpt = (sid: string, q: number, o: number) => {
    const na = { ...answers, [sid]: { ...(answers[sid] ?? {}), [q]: o } };
    setAnswers(na);
    const st = { passed, answers: na, current: sid };
    setAll((prev) => ({ ...prev, [partId]: st }));
    persist(st);
  };

  const checkQuiz = (sid: string) => {
    const sb = part.subbabs.find((s) => s.id === sid);
    if (!sb) return;
    const sel = answers[sid] ?? {};
    let score = 0;
    sb.quiz.forEach((q, qi) => {
      if (sel[qi] === q.answer) score += 1;
    });
    setChecked({ ...checked, [sid]: { score } });
    const threshold = passThreshold(sb.quiz.length);
    if (score >= threshold && !passed[sid]) {
      const np = { ...passed, [sid]: true as const };
      setPassed(np);
      const st = { passed: np, answers, current: sid };
      setAll((prev) => ({ ...prev, [partId]: st }));
      persist(st);
    } else {
      persist({ passed, answers, current: sid });
    }
  };

  const disarmReset = () => {
    setResetArmed(false);
    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }
  };

  const doReset = async () => {
    if (!resetArmed) {
      setResetArmed(true);
      resetTimer.current = setTimeout(disarmReset, 4000);
      return;
    }
    disarmReset();
    setPassed({});
    setAnswers({});
    setChecked({});
    setView(firstId);
    const clean = emptyPartProgress();
    setAll((prev) => ({ ...prev, [partId]: clean }));
    if (modeRef.current === 'db') {
      try {
        await fetch(`/api/progress?partId=${encodeURIComponent(partId)}`, { method: 'DELETE' });
      } catch { /* abaikan — local di bawah tetap dibersihkan */ }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const doc = JSON.parse(raw);
        if (doc.parts) delete doc.parts[partId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      }
    } catch { /* abaikan */ }
    setSaveStatus(`Progress ${part.number} direset — mulai lagi dari sub-bab ${firstId}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- render ---------- */
  const phase = getPhase(part.phaseId);
  const done = partProgressCount(part, { ...all, [partId]: { passed, answers, current: view } });
  const total = part.subbabs.length;
  const complete = isPartComplete(part, { ...all, [partId]: { passed, answers, current: view } });
  const partLocked = ready && !isPartUnlocked(part.id, all, getPart);
  const prevP = prevPartId(part.id);

  if (!ready) {
    return (
      <div className="wrap">
        <PhaseBar phase={phase ? `${phase.n} — ${phase.t}` : ''} part={part.number} />
        <p style={{ padding: 40, color: 'var(--muted)' }}>Memuat progress…</p>
        <Footer />
      </div>
    );
  }

  if (partLocked) {
    return (
      <div className="wrap">
        <PhaseBar phase={phase ? `${phase.n} — ${phase.t}` : ''} part={part.number} />
        <section className="panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48 }}>🔒</div>
          <h2>{part.number} Terkunci</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Selesaikan dulu seluruh quiz {prevP ? `Part ${prevP}` : 'part sebelumnya'} untuk
            membuka part ini. Kurikulum ini berjalan seperti puzzle — berurutan.
          </p>
          <a href="/kurikulum" className="btn" style={{ marginTop: 16, display: 'inline-block' }}>
            ← Kembali ke Kurikulum
          </a>
        </section>
        <Footer />
      </div>
    );
  }

  const curIdx = part.subbabs.findIndex((s) => s.id === view);
  const curSb = curIdx >= 0 ? part.subbabs[curIdx] : undefined;

  return (
    <div className="wrap">
      <PhaseBar phase={phase ? `${phase.n} — ${phase.t}` : ''} part={part.number} />
      <div className="layout">
        <aside className="side">
          <h2>{part.number} — {part.title}</h2>
          <p className="sub">
            Selesaikan quiz di akhir setiap sub-bab (minimal 2 dari 3 benar)
            untuk membuka sub-bab berikutnya — seperti puzzle, berurutan dan
            tidak bisa dilompati.
          </p>
          <div className="prog">
            <i style={{ width: `${(done / Math.max(total, 1)) * 100}%` }} />
          </div>
          <div className="prog-txt">
            Progress: {done} / {total} sub-bab
            {complete ? ` — ${part.number} tuntas! 🎉` : ''}
          </div>
          <div className="savebox">
            <div className={`savetxt${mode === 'browser' ? ' warn' : ''}`}>{saveStatus}</div>
            <button
              className={`btn ghost resetbtn${resetArmed ? ' armed' : ''}`}
              type="button"
              onClick={doReset}
            >
              {resetArmed ? 'Yakin? Klik sekali lagi untuk menghapus progress part ini' : '↺ Reset progress'}
            </button>
          </div>
          <div className="lesson-list">
            {part.subbabs.map((s, i) => {
              const un = isSubbabUnlocked(part, i, all, getPart);
              const dn = !!passed[s.id];
              const cls =
                'lbtn' + (view === s.id ? ' active' : '') + (dn ? ' done' : '') + (un ? '' : ' locked');
              const st = dn
                ? '✓ Quiz lulus — selesai'
                : un
                  ? 'Terbuka — klik untuk belajar'
                  : `🔒 Terkunci — lulus quiz ${part.subbabs[i - 1].id} dulu`;
              return (
                <button key={s.id} className={cls} disabled={!un} onClick={() => openLesson(s.id)}>
                  <span className="num">{s.id}</span>
                  <span>
                    <span className="tt">{s.title}</span>
                    <br />
                    <span className="st">{st}</span>
                  </span>
                </button>
              );
            })}
            {part.project ? (
              complete ? (
                <button className="lbtn" onClick={openProject}>
                  <span className="num">★</span>
                  <span>
                    <span className="tt">{part.project.title}</span>
                    <br />
                    <span className="st">Terbuka — semua quiz lulus</span>
                  </span>
                </button>
              ) : (
                <button className="lbtn locked" disabled>
                  <span className="num">★</span>
                  <span>
                    <span className="tt">{part.project.title}</span>
                    <br />
                    <span className="st">🔒 Terkunci — selesaikan semua sub-bab</span>
                  </span>
                </button>
              )
            ) : null}
          </div>
        </aside>

        <main>
          <section className="panel" ref={panelRef}>
            {view === VIEW_PROJECT ? (
              <ProjectView part={part} onBack={() => openLesson(lastId)} />
            ) : curSb ? (
              <LessonView
                part={part}
                sb={curSb}
                idx={curIdx}
                sel={answers[curSb.id] ?? {}}
                chk={checked[curSb.id] ?? null}
                passedThis={!!passed[curSb.id]}
                onSelect={(q, o) => selectOpt(curSb.id, q, o)}
                onCheck={() => checkQuiz(curSb.id)}
                onPrev={() => openLesson(part.subbabs[curIdx - 1].id)}
                onNext={() => openLesson(part.subbabs[curIdx + 1].id)}
                onProject={openProject}
              />
            ) : null}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
