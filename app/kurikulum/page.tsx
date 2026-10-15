'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPart, PARTS, PHASES } from '@/lib/parts';
import {
  sanitizeAllProgress,
  isPartUnlocked,
  isPartComplete,
  partProgressCount,
  STORAGE_KEY,
  type AllProgress,
} from '@/lib/progress';
import PhaseBar from '@/components/PhaseBar';
import Footer from '@/components/Footer';

export default function Kurikulum() {
  const [all, setAll] = useState<AllProgress>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/progress');
        if (!res.ok) throw new Error('api');
        const d = await res.json();
        setAll(sanitizeAllProgress(d.parts, PARTS));
      } catch {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setAll(sanitizeAllProgress(raw ? JSON.parse(raw).parts : null, PARTS));
        } catch {
          setAll({});
        }
      }
      setLoaded(true);
    })();
  }, []);

  const unlockedCount = PARTS.filter((p) => isPartUnlocked(p.id, all, getPart)).length;
  const doneParts = PARTS.filter((p) => isPartComplete(p, all)).length;

  return (
    <>
      <div className="wrap">
        <PhaseBar />
        <section className="roadmap" style={{ marginTop: 0 }}>
          <h2>Roadmap Lengkap — {PARTS.length} Part</h2>
          <p className="sub">
            Seluruh peta belajar ditampilkan sejak awal agar kamu tahu arah akhirnya.
            Part terbuka berurutan seperti puzzle: luluskan quiz tiap sub-bab untuk membuka
            sub-bab berikutnya, dan tuntaskan satu part untuk membuka part berikutnya.
            {loaded && (
              <> Saat ini <b>{unlockedCount}</b> part terbuka, <b>{doneParts}</b> tuntas.</>
            )}
          </p>

          {PHASES.map((phase) => {
            const parts = PARTS.filter((p) => p.phaseId === phase.id);
            if (parts.length === 0) return null;
            return (
              <div key={phase.id} style={{ marginTop: 28 }}>
                <h3 style={{ color: '#e2e8f0', fontSize: 17, marginBottom: 4 }}>
                  {phase.n} — {phase.t}
                </h3>
                <p className="sub" style={{ marginTop: 0, marginBottom: 12 }}>{phase.d}</p>
                <div className="rgrid">
                  {parts.map((p) => {
                    const unlocked = loaded ? isPartUnlocked(p.id, all, getPart) : p.id === '01';
                    const complete = isPartComplete(p, all);
                    const done = partProgressCount(p, all);
                    const total = p.subbabs.length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    const inner = (
                      <>
                        <div className="pn">{p.number}</div>
                        <div className="pt">{p.title}</div>
                        <div className="pd">{p.description}</div>
                        {loaded && (
                          <div style={{ margin: '10px 0 4px' }}>
                            <div style={{ height: 6, background: '#1e293b', borderRadius: 3 }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: '100%',
                                  borderRadius: 3,
                                  background: complete ? '#34d399' : '#38bdf8',
                                }}
                              />
                            </div>
                            <div style={{ fontSize: 12, color: '#9fb3c8', marginTop: 4 }}>
                              {done}/{total} sub-bab
                            </div>
                          </div>
                        )}
                        {complete ? (
                          <span className="badge open">✓ TUNTAS</span>
                        ) : unlocked ? (
                          <span className="badge open">● TERBUKA</span>
                        ) : (
                          <span className="badge lock">🔒 TERKUNCI — selesaikan part sebelumnya</span>
                        )}
                      </>
                    );
                    return unlocked ? (
                      <Link key={p.id} href={`/part/${p.id}`} className="rcard open">
                        {inner}
                      </Link>
                    ) : (
                      <div key={p.id} className="rcard locked">
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>
      </div>
      <Footer />
    </>
  );
}
