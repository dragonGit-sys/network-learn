"use client";

import { useEffect, useRef, useState } from "react";
import {
  LESSONS,
  DIAGRAMS,
  EXTRAS,
  PROJECT_HTML,
  LESSON_COUNT,
  type Lesson,
} from "@/lib/data";
import {
  sanitizeProgress,
  emptyProgress,
  isUnlocked,
  STORAGE_KEY,
  type ProgressState,
} from "@/lib/progress";
import PhaseBar from "@/components/PhaseBar";
import Footer from "@/components/Footer";

const metaFor = (i: number) => ({
  quizLength: LESSONS[i]?.quiz.length ?? 0,
  optionCount: (qIdx: number) => LESSONS[i]?.quiz[qIdx]?.o.length ?? 0,
});

type View = number | "project";
type StorageMode = "db" | "browser";

/* ---------- port faithful: termsHtml ---------- */
function termsHtml(terms: [string, string][]): string {
  if (!terms || !terms.length) return "";
  return (
    "<h3>Terminologi Penting</h3><div class=\"terms\">" +
    terms
      .map(
        (t) =>
          '<div class="term"><div class="w">' +
          t[0] +
          '</div><div class="d">' +
          t[1] +
          "</div></div>",
      )
      .join("") +
    "</div>"
  );
}

/* ---------- port faithful: closingHtml ---------- */
function closingHtml(l: Lesson): string {
  const e = EXTRAS[l.id];
  if (!e) return "";
  const dg = DIAGRAMS[l.id] ? "<h3>Diagram / Topology</h3>" + DIAGRAMS[l.id] : "";
  const doc =
    "<h3>Dokumentasi &amp; Portfolio Artifact</h3><p>Catat pemahaman sub-bab ini di repository GitHub-mu (<code>network-engineer-lab/part-01-fundamental/</code>) sebagai file <code>notes-" +
    l.id +
    ".md</code>: definisi dengan kata-katamu sendiri, 1 diagram versi gambarmu, dan hasil challenge di bawah. Kebiasaan mendokumentasikan setiap sub-bab inilah yang di Part 38 menjadi sistem dokumentasi enterprise penuh — dan yang membedakan portfolio-mu dari sekadar sertifikat.</p>";
  return (
    dg +
    "<h3>Skenario Dunia Nyata</h3><p>" +
    e.s +
    "</p>" +
    "<h3>Best Practices</h3><p>" +
    e.bp +
    "</p>" +
    "<h3>Security Consideration</h3><p>" +
    e.sec +
    "</p>" +
    '<h3>Challenge — Uji Pemahamanmu</h3><div class="callout"><p style="margin:0">' +
    e.ch +
    "</p></div>" +
    "<h3>Interview Question</h3><p>" +
    e.iq +
    "</p>" +
    doc +
    "<h3>Summary</h3><p>Sub-bab " +
    l.id +
    " membangun satu fondasi: <b>" +
    l.t +
    "</b>. Pastikan kamu bisa menjelaskannya dengan kata-katamu sendiri — bukan menghafal — sebelum menekan tombol quiz. Itulah standar yang dipakai di seluruh 39 part lab ini.</p>"
  );
}

function nowStamp(): string {
  const t = new Date();
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return `${hh}.${mm}`;
}

export default function Part01() {
  const [view, setView] = useState<View>(0);
  const [passed, setPassed] = useState<Record<number, true>>({});
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({});
  const [checked, setChecked] = useState<Record<number, { score: number }>>({});
  const [resetArmed, setResetArmed] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Memuat progress…");
  const [mode, setMode] = useState<StorageMode>("db");

  const modeRef = useRef<StorageMode>("db");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLElement>(null);

  const setModeBoth = (m: StorageMode) => {
    modeRef.current = m;
    setMode(m);
  };

  /* ---------- persistence ---------- */
  const persist = async (s: ProgressState) => {
    if (modeRef.current === "db") {
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            passed: s.passed,
            answers: s.answers,
            current: s.current,
          }),
        });
        if (!res.ok) throw new Error("api " + res.status);
        setSaveStatus(`✓ Progress tersimpan di database lokal · ${nowStamp()}`);
        return;
      } catch {
        setModeBoth("browser");
      }
    }
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ passed: s.passed, answers: s.answers, current: s.current, savedAt: Date.now() }),
      );
      setSaveStatus("⚠ Database tidak terjangkau — progress tersimpan di browser ini.");
    } catch {
      setSaveStatus("⚠ Penyimpanan tidak tersedia — progress berlaku sesi ini saja.");
    }
  };

  /* ---------- init: muat progress ---------- */
  useEffect(() => {
    (async () => {
      const applyState = (clean: ProgressState, hadSaved: boolean, dbMode: boolean) => {
        let cur = clean.current;
        if (!isUnlocked(cur, clean.passed)) cur = 0;
        setPassed(clean.passed);
        setAnswers(clean.answers);
        setView(cur);
        setModeBoth(dbMode ? "db" : "browser");
        if (dbMode) {
          setSaveStatus(
            hadSaved
              ? "✓ Progress sebelumnya dimuat dari database lokal."
              : "✓ Progress tersimpan di database lokal.",
          );
        } else {
          setSaveStatus(
            hadSaved
              ? "⚠ Database tidak terjangkau — progress sebelumnya dimuat dari browser ini."
              : "⚠ Database tidak terjangkau — progress tersimpan di browser ini.",
          );
        }
        // sinkronkan current yang tervalidasi kembali
        persist({ passed: clean.passed, answers: clean.answers, current: cur }).catch(() => {});
      };

      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error("api " + res.status);
        const d: unknown = await res.json();
        const clean = sanitizeProgress(d, LESSON_COUNT, metaFor);
        const hadSaved =
          Object.keys(clean.passed).length > 0 || Object.keys(clean.answers).length > 0;
        applyState(clean, hadSaved, true);
      } catch {
        // fallback: localStorage (mode browser) — aplikasi tetap jalan
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const clean = sanitizeProgress(raw ? JSON.parse(raw) : null, LESSON_COUNT, metaFor);
          const hadSaved =
            Object.keys(clean.passed).length > 0 || Object.keys(clean.answers).length > 0;
          applyState(clean, hadSaved, false);
        } catch {
          applyState(emptyProgress(), false, false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToPanel = () => {
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  /* ---------- aksi ---------- */
  const openLesson = (i: number) => {
    setView(i);
    setChecked({});
    persist({ passed, answers, current: i });
    scrollToPanel();
  };

  const openProject = () => {
    setView("project");
    scrollToPanel();
  };

  const selectOpt = (i: number, q: number, o: number) => {
    const na = { ...answers, [i]: { ...(answers[i] ?? {}), [q]: o } };
    setAnswers(na);
    const cur = typeof view === "number" ? view : 0;
    persist({ passed, answers: na, current: cur });
  };

  const checkQuiz = (i: number) => {
    const l = LESSONS[i];
    const sel = answers[i] ?? {};
    if (Object.keys(sel).length < l.quiz.length) {
      setChecked({ ...checked, [i]: { score: -1 } });
      return;
    }
    let score = 0;
    l.quiz.forEach((q, qi) => {
      if (sel[qi] === q.a) score++;
    });
    setChecked({ ...checked, [i]: { score } });
    const cur = typeof view === "number" ? view : 0;
    if (score >= 2 && !passed[i]) {
      const np = { ...passed, [i]: true as const };
      setPassed(np);
      persist({ passed: np, answers, current: cur });
    } else {
      persist({ passed, answers, current: cur });
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
    setView(0);
    if (modeRef.current === "db") {
      try {
        await fetch("/api/progress", { method: "DELETE" });
      } catch {
        /* abaikan — localStorage di bawah tetap dibersihkan */
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan */
    }
    setSaveStatus("Progress direset — mulai lagi dari sub-bab 1.1.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- render ---------- */
  const done = Object.keys(passed).length;
  const allDone = done === LESSON_COUNT;

  return (
    <>
      <div className="wrap">
        <PhaseBar />
        <div className="layout">
          <aside className="side">
            <h2>Part 01 — Fundamental Networking</h2>
            <p className="sub">
              Selesaikan quiz di akhir setiap sub-bab (minimal 2 dari 3 benar)
              untuk membuka sub-bab berikutnya — seperti puzzle, berurutan dan
              tidak bisa dilompati.
            </p>
            <div className="prog">
              <i style={{ width: `${(done / LESSON_COUNT) * 100}%` }} />
            </div>
            <div className="prog-txt">
              Progress: {done} / {LESSONS.length} sub-bab
              {allDone ? " — Part 01 tuntas! 🎉" : ""}
            </div>
            <div className="savebox">
              <div className={`savetxt${mode === "browser" ? " warn" : ""}`}>{saveStatus}</div>
              <button
                className={`btn ghost resetbtn${resetArmed ? " armed" : ""}`}
                type="button"
                onClick={doReset}
              >
                {resetArmed ? "Yakin? Klik sekali lagi untuk menghapus semua progress" : "↺ Reset progress"}
              </button>
            </div>
            <div className="lesson-list">
              {LESSONS.map((l, i) => {
                const un = isUnlocked(i, passed);
                const dn = !!passed[i];
                const cls =
                  "lbtn" + (view === i ? " active" : "") + (dn ? " done" : "") + (un ? "" : " locked");
                const st = dn
                  ? "✓ Quiz lulus — selesai"
                  : un
                    ? "Terbuka — klik untuk belajar"
                    : `🔒 Terkunci — lulus quiz ${LESSONS[i - 1].id} dulu`;
                return (
                  <button key={l.id} className={cls} disabled={!un} onClick={() => openLesson(i)}>
                    <span className="num">{l.id}</span>
                    <span>
                      <span className="tt">{l.t}</span>
                      <br />
                      <span className="st">{st}</span>
                    </span>
                  </button>
                );
              })}
              {passed[LESSON_COUNT - 1] ? (
                <button className="lbtn" onClick={openProject}>
                  <span className="num">★</span>
                  <span>
                    <span className="tt">Project Part 01 — Portfolio GitHub</span>
                    <br />
                    <span className="st">Terbuka — semua quiz lulus</span>
                  </span>
                </button>
              ) : (
                <button className="lbtn locked" disabled>
                  <span className="num">★</span>
                  <span>
                    <span className="tt">Project Part 01 — Portfolio GitHub</span>
                    <br />
                    <span className="st">🔒 Terkunci — selesaikan semua sub-bab</span>
                  </span>
                </button>
              )}
            </div>
          </aside>

          <main>
            <section className="panel" ref={panelRef}>
              {view === "project" ? (
                <ProjectView onBack={() => openLesson(LESSON_COUNT - 1)} />
              ) : (
                <LessonView
                  idx={view}
                  sel={answers[view] ?? {}}
                  chk={checked[view] ?? null}
                  passedThis={!!passed[view]}
                  onSelect={(q, o) => selectOpt(view, q, o)}
                  onCheck={() => checkQuiz(view)}
                  onPrev={() => openLesson(view - 1)}
                  onNext={() => openLesson(view + 1)}
                  onProject={openProject}
                />
              )}
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* ================= LESSON VIEW ================= */
function LessonView({
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
  const l = LESSONS[idx];
  const titleShort = l.t.replace(/—.*$/, "").trim();
  const bodyHtml = l.html + termsHtml(l.terms) + closingHtml(l);

  let resultEl: React.ReactNode = null;
  if (chk) {
    if (chk.score === -1) {
      resultEl = (
        <div className="quiz-result fail">
          ⚠️ Kamu belum menjawab semua soal ({Object.keys(sel).length} dari {l.quiz.length}).
          Lengkapi dulu, ya.
        </div>
      );
    } else if (chk.score >= 2) {
      resultEl = (
        <div className="quiz-result pass">
          ✅ <b>Lulus! Skor {chk.score} / {l.quiz.length}.</b>{" "}
          {idx < LESSON_COUNT - 1 ? (
            <>
              Sub-bab <b>{LESSONS[idx + 1].id} — {LESSONS[idx + 1].t}</b> sekarang
              terbuka. Klik tombol di bawah atau pilih di daftar kiri.
            </>
          ) : (
            <>
              Ini sub-bab terakhir Part 01 — <b>Project Portfolio Part 01</b>{" "}
              sekarang terbuka!
            </>
          )}
        </div>
      );
    } else {
      resultEl = (
        <div className="quiz-result fail">
          ❌ <b>Skor {chk.score} / {l.quiz.length} — belum lulus</b> (butuh minimal
          2). Pilihan hijau adalah jawaban benar. Baca ulang bagian materinya,
          pahami alasannya, lalu coba lagi.
        </div>
      );
    }
  }

  return (
    <>
      <div className="crumb">PART 01 — FUNDAMENTAL NETWORKING · SUB-BAB {l.id} / 1.15</div>
      <h2>
        {l.id} {l.t}
      </h2>
      <div className="obj">
        <div className="t">Learning Objectives</div>
        <ul>
          <li>
            Memahami konsep <b>{titleShort}</b> dari definisi sederhana sampai teknis.
          </li>
          <li>Mampu menjelaskan kembali dengan kata sendiri — standar interview.</li>
          <li>Menghubungkan konsep ini dengan praktik NOC &amp; part-part berikutnya.</li>
        </ul>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)" }}>
        <b>Prerequisites:</b>{" "}
        {idx === 0
          ? "Tidak ada — ini titik awal kurikulum. Cukup rasa ingin tahu dan (opsional) secangkir kopi."
          : `Sub-bab ${LESSONS[idx - 1].id} (${LESSONS[idx - 1].t}) — sudah kamu lulus quiznya.`}
      </p>

      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

      <div className="quiz">
        <h3>Quiz {l.id} — Gerbang ke Sub-bab Berikutnya</h3>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Jawab semua soal. Minimal <b>2 dari 3 benar</b> untuk membuka sub-bab
          berikutnya. Salah? Baca ulang materinya dan coba lagi — tidak ada batas
          percobaan.
        </p>
        {l.quiz.map((q, qi) => (
          <div className="q" key={qi}>
            <div className="qt">
              {qi + 1}. {q.q}
            </div>
            {q.o.map((o, oi) => {
              let cls = "opt";
              if (sel[qi] === oi) cls += " sel";
              if (chk && chk.score !== -1) {
                if (oi === q.a) cls += " right";
                else if (sel[qi] === oi) cls += " wrong";
              }
              return (
                <button key={oi} className={cls} onClick={() => onSelect(qi, oi)}>
                  {String.fromCharCode(65 + oi)}. {o}
                </button>
              );
            })}
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
          {passedThis && idx < LESSON_COUNT - 1 && (
            <button className="btn" onClick={onNext}>
              Lanjut ke {LESSONS[idx + 1].id} →
            </button>
          )}
          {passedThis && idx === LESSON_COUNT - 1 && (
            <button className="btn" onClick={onProject}>
              Lihat Project Part 01 ★
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= PROJECT VIEW ================= */
function ProjectView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className="crumb">PART 01 — FUNDAMENTAL NETWORKING · PROJECT PORTFOLIO</div>
      <h2>★ Project Part 01 — Dokumentasi &amp; Analisis Jaringan</h2>
      <p style={{ color: "var(--muted)" }}>
        Selamat — kamu menuntaskan seluruh rantai konsep Part 01: dari definisi
        network engineering sampai lima parameter kualitas jaringan. Project ini
        mengubah pemahaman itu menjadi artefak portfolio nyata.
      </p>
      <div dangerouslySetInnerHTML={{ __html: PROJECT_HTML }} />
      <div className="callout">
        <div className="t">Setelah Project Selesai</div>
        <p style={{ margin: "4px 0 0" }}>
          Tandai project ini selesai di repository GitHub-mu, lalu minta lanjut ke{" "}
          <b>Part 02 — OSI Model &amp; TCP/IP</b>. Di sana kita bedah perjalanan
          satu paket dari PC ke server, layer demi layer — fondasi untuk semua lab
          GNS3 berikutnya.
        </p>
      </div>
      <div className="navrow">
        <button className="btn ghost" onClick={onBack}>
          ← Kembali ke 1.15
        </button>
      </div>
    </>
  );
}
