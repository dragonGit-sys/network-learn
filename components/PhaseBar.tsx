import { PHASES } from '@/lib/parts';

/**
 * Bilah fase. Tanpa props: tampilkan semua 7 fase (dipakai halaman utama & kurikulum).
 * Dengan props phase/part: tampilkan konteks part yang sedang dibuka (dipakai viewer).
 */
export default function PhaseBar({ phase, part }: { phase?: string; part?: string }) {
  if (phase) {
    return (
      <div className="phasebar">
        <div className="phase">
          <div className="pn">{part ?? ''}</div>
          <div className="pt">{phase}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="phasebar">
      {PHASES.map((p) => (
        <div className="phase" key={p.id}>
          <div className="pn">{p.n}</div>
          <div className="pt">{p.t}</div>
          <div className="pd">{p.d}</div>
        </div>
      ))}
    </div>
  );
}
