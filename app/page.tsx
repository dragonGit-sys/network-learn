import Link from "next/link";
import { HERO_HTML } from "@/lib/data";
import PhaseBar from "@/components/PhaseBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <header className="hero">
        <div dangerouslySetInnerHTML={{ __html: HERO_HTML }} />
        <div className="hero-in">
          <div className="cta-row">
            <Link className="btn" href="/part-01">
              Mulai Part 01 →
            </Link>
            <Link className="btn ghost" href="/kurikulum">
              Lihat Kurikulum 39 Part
            </Link>
          </div>
        </div>
      </header>

      <div className="wrap">
        <PhaseBar />

        <div className="layout" style={{ gridTemplateColumns: "1fr" }}>
          <main>
            <section className="panel">
              <div className="crumb">CARA BELAJAR</div>
              <h2>Belajar Seperti Puzzle — Berurutan, Tidak Bisa Dilompati</h2>
              <p>
                Setiap part dibagi menjadi sub-bab. Setiap sub-bab ditutup{" "}
                <b>quiz 3 soal</b> — minimal <b>2 dari 3 benar</b> untuk membuka
                sub-bab berikutnya. Part ditutup dengan <b>project portfolio</b>{" "}
                yang kamu upload ke GitHub.
              </p>
              <div className="method" style={{ marginTop: 14 }}>
                <b>LEARN</b>
                <i>→</i>
                <b>BUILD</b>
                <i>→</i>
                <b>TEST</b>
                <i>→</i>
                <b>BREAK</b>
                <i>→</i>
                <b>TROUBLESHOOT</b>
                <i>→</i>
                <b>FIX</b>
                <i>→</i>
                <b>DOCUMENT</b>
                <i>→</i>
                <b>PORTFOLIO</b>
              </div>
              <p style={{ marginTop: 14 }}>
                Progress belajarmu tersimpan di <b>database PostgreSQL lokal</b>{" "}
                di perangkat ini — tetap aman walau halaman di-refresh atau
                laptop dimatikan, dan tetap berfungsi <b>offline penuh</b>.
              </p>
              <div className="navrow">
                <Link className="btn" href="/part-01">
                  Mulai dari Sub-bab 1.1 →
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
