import Link from "next/link";
import { PARTS } from "@/lib/data";
import PhaseBar from "@/components/PhaseBar";
import Footer from "@/components/Footer";

export default function Kurikulum() {
  return (
    <>
      <div className="wrap">
        <PhaseBar />
        <section className="roadmap" style={{ marginTop: 0 }}>
          <h2>Roadmap Lengkap — 39 Part</h2>
          <p className="sub">
            Seluruh peta belajar ditampilkan sejak awal agar kamu tahu arah
            akhirnya. Konten dibuka bertahap per part: saat ini{" "}
            <b>Part 01</b> yang aktif. Part berikutnya ditambahkan setelah Part
            01 tuntas (quiz + project portfolio).
          </p>
          <div className="rgrid">
            {PARTS.map((p) => {
              const inner = (
                <>
                  <div className="pn">PART {String(p.num).padStart(2, "0")}</div>
                  <div className="pt">{p.title}</div>
                  <div className="pd">{p.desc}</div>
                  {p.open ? (
                    <span className="badge open">● SEDANG BERJALAN</span>
                  ) : (
                    <span className="badge lock">
                      🔒 TERKUNCI — selesaikan part sebelumnya
                    </span>
                  )}
                </>
              );
              return p.open ? (
                <Link
                  key={p.num}
                  href="/part-01"
                  className="rcard open"
                >
                  {inner}
                </Link>
              ) : (
                <div key={p.num} className="rcard locked">
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
