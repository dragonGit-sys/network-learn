import { PHASES } from "@/lib/data";

export default function PhaseBar() {
  return (
    <div className="phasebar">
      {PHASES.map((p) => (
        <div className="phase" key={p.n}>
          <div className="pn">{p.n}</div>
          <div className="pt">{p.t}</div>
          <div className="pd">{p.d}</div>
        </div>
      ))}
    </div>
  );
}
