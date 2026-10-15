// Part 07 — Fiber Optic Networking.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
import type { Part } from './types';

export const part07: Part = {
  id: '07',
  number: 'PART 07',
  title: 'Fiber Optic Networking',
  phaseId: 'fase-1',
  description: 'Serat optik: struktur, jenis fiber, konektor, transceiver, link budget, dan OTDR.',
  repoFolder: 'part-07-fiber-optic',
  objectives: [
    'Menjelaskan prinsip kerja fiber optic dan struktur core, cladding, dan coating.',
    'Membedakan single mode vs multimode serta kode OS1/OS2/OM1–OM4 dan pemakaiannya.',
    'Mengidentifikasi komponen instalasi: ODF, OTB, patch cord, pigtail, konektor, dan splicing.',
    'Membedakan transceiver SFP, SFP+, dan QSFP serta menghitung link budget sederhana.',
    'Merancang topologi fiber virtual: memilih jenis fiber, menghitung loss, dan membaca OTDR.',
  ],
  prerequisites: 'Part 06 — Network Cabling (konsep Layer 1, attenuation, instalasi). Part 01 — bandwidth & latency.',
  subbabs: [
    {
      id: '7.1',
      title: 'Apa Itu Fiber Optic?',
      body: `<p><b>Fiber optic</b> (serat optik) adalah media transmisi berupa <b>serat kaca/plastik sehalus rambut</b> yang membawa data sebagai <b>pulsa cahaya</b> — bukan sinyal listrik seperti kabel tembaga. Ia bekerja di <b>Layer 1</b> dan menjadi tulang punggung internet modern.</p>
<h3>Mengapa Cahaya, Bukan Listrik?</h3>
<ul>
<li><b>Kecepatan & kapasitas:</b> satu serat bisa membawa <b>terabit per detik</b> (dengan DWDM — banyak warna cahaya sekaligus). Tembaga mentok di puluhan Gbps jarak pendek.</li>
<li><b>Jarak jauh:</b> puluhan kilometer <b>tanpa repeater</b> (vs 100 m tembaga). Kabel bawah laut antar-benua = fiber.</li>
<li><b>Kebal EMI total:</b> cahaya tidak terpengaruh medan elektromagnetik — lewat samping kabel listrik tegangan tinggi pun aman. Juga <b>tidak memancarkan</b> sinyal yang bisa disadap (keamanan fisik).</li>
<li><b>Ringan & tipis:</b> ratusan serat muat di kabel sebesar lengan — vs tembaga yang butuh kabel sebesar paha untuk kapasitas setara.</li>
</ul>
<h3>Harga yang Dibayar</h3>
<p>Instalasi butuh <b>ketelitian bedah</b>: serat kaca mudah patah, konektor harus bersih mikroskopis, splicing butuh alat khusus (fusion splicer), dan <b>tidak bisa di-"krimping" sembarangan</b> seperti RJ45. Skill fiber = skill spesialis yang mahal — dan dibayar mahal.</p>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Tembaga (UTP)</th><th>Fiber Optic</th></tr>
<tr><td>Pembawa</td><td>Sinyal listrik</td><td>Pulsa cahaya</td></tr>
<tr><td>Jarak</td><td>100 m</td><td>550 m – 100+ km</td></tr>
<tr><td>Kecepatan umum</td><td>1–10 Gbps</td><td>10 Gbps – 800 Gbps</td></tr>
<tr><td>EMI</td><td>Rentan</td><td>Kebal total</td></tr>
<tr><td>Instalasi</td><td>Mudah (krimping)</td><td>Spesialis (splicing)</td></tr>
</table></div>`,
      terms: [
        ['Fiber optic', 'Serat kaca/plastik pembawa pulsa cahaya; media Layer 1 untuk jarak jauh & cepat.'],
        ['DWDM', 'Dense Wavelength Division Multiplexing — banyak warna cahaya dalam satu serat (kapasitas terabit).'],
      ],
      diagram: `<pre>         FIBER vs TEMBAGA (prinsip)

   Tembaga: [listrik] ~~kabel~~ [listrik]   max 100 m, rentan EMI
   Fiber:   [cahaya]  ·serat kaca·  [cahaya] puluhan km, kebal EMI

   Internet antar-benua = kabel fiber di dasar laut.</pre>`,
      scenario: 'Kampus dengan 5 gedung (jarak 300–800 m) butuh backbone 10 Gbps. Tembaga mustahil (>100 m). Solusi: fiber single mode antar-gedung + multimode di dalam gedung. Satu keputusan media yang tepat menghemat ratusan juta dibanding "memaksakan tembaga dengan repeater tiap 100 m".',
      bestPractices: 'Aturan praktis: &lt;100 m & 1 Gbps = tembaga cukup; &gt;100 m atau ≥10 Gbps backbone = pertimbangkan fiber. Hitung TCO, bukan harga kabel.',
      security: 'Fiber sulit disadap (harus membengkokkan/memotong serat — terdeteksi sebagai loss), tapi BUKAN mustahil. Data sensitif tetap wajib enkripsi.',
      challenge: 'Cari tahu: kabel bawah laut mana yang menghubungkan Indonesia ke dunia? Tulis 2 nama + kapasitasnya (riset 10 menit).',
      interviewQ: 'Q: "Mengapa fiber optic dipilih untuk backbone?" — A: Empat alasan: kapasitas (terabit via DWDM), jarak (puluhan km tanpa repeater), kebal EMI total, dan ringan/ringkas. Harganya: instalasi butuh ketelitian spesialis (splicing, kebersihan konektor).',
      quiz: [
        { q: 'Fiber optic membawa data sebagai…', options: ['Sinyal listrik', 'Pulsa cahaya di serat kaca', 'Gelombang radio', 'Sinyal suara'], answer: 1, explain: 'Cahaya = kebal EMI, jarak jauh, kapasitas besar.' },
        { q: 'Keunggulan utama fiber atas tembaga untuk backbone adalah…', options: ['Lebih murah selalu', 'Jarak jauh + kapasitas besar + kebal EMI', 'Bisa dikrimping sendiri', 'Tanpa perawatan'], answer: 1, explain: 'Tiga keunggulan fisik cahaya atas listrik.' },
        { q: 'Kelemahan utama instalasi fiber adalah…', options: ['Tidak ada standar', 'Butuh ketelitian spesialis: mudah patah, konektor harus bersih, splicing alat khusus', 'Tidak bisa 10 Gbps', 'Rentan EMI'], answer: 1, explain: 'Skill & kerapian instalasi = harga yang dibayar untuk keunggulan fiber.' },
      ],
    },
    {
      id: '7.2',
      title: 'Struktur Fiber Optic',
      body: `<p>Satu serat optik terdiri dari <b>tiga lapisan konsentris</b> — seperti kabel koaksial versi cahaya. Memahami ketiganya adalah fondasi semua sub-bab fiber berikutnya.</p>
<h3>Tiga Lapisan</h3>
<pre>Penampang melintang serat:

        ╔═══════════════════════╗
        ║      COATING          ║  ← plastik pelindung (250 µm)
        ║   ┌───────────────┐   ║
        ║   │   CLADDING    │   ║  ← kaca pembungkus (125 µm)
        ║   │  ┌─────────┐  │   ║
        ║   │  │  CORE   │  │   ║  ← kaca inti, jalan cahaya
        ║   │  │ (9/50µm)│  │   ║     (9 µm SM / 50 µm MM)
        ║   │  └─────────┘  │   ║
        ║   └───────────────┘   ║
        ╚═══════════════════════╝</pre>
<ol>
<li><b>Core</b> (inti): kaca murni tempat <b>cahaya merambat</b>. Diameternya menentukan jenis fiber: <b>9 µm</b> (single mode) atau <b>50/62.5 µm</b> (multimode).</li>
<li><b>Cladding</b>: kaca dengan <b>indeks bias lebih rendah</b> yang membungkus core — "dinding" yang memantulkan cahaya kembali ke core (<b>total internal reflection</b>).</li>
<li><b>Coating/buffer</b>: plastik pelindung dari <b>goresan & kelembapan</b> — lapisan mekanis, bukan optis. (Jangan tertukar dengan jaket kabel terluar!)</li>
</ol>
<p><b>Alasan tiga lapis:</b> core membawa, cladding mengurung (cahaya tidak bocor keluar), coating melindungi (kaca telanjang rapuh). Hilangkan satu = fiber tidak berfungsi atau langsung rusak.</p>`,
      terms: [
        ['Core', 'Inti kaca tempat cahaya merambat (9 µm SM, 50/62.5 µm MM).'],
        ['Cladding', 'Kaca pembungkus berindeks bias rendah — memantulkan cahaya ke core.'],
        ['Coating', 'Lapisan plastik pelindung mekanis (250 µm).'],
        ['Total internal reflection', 'Pemantulan sempurna cahaya di batas core-cladding — prinsip penuntun cahaya.'],
      ],
      scenario: 'Teknisi mengupas coating terlalu agresif hingga menggores cladding — serat itu "bocor" cahaya (micro-bend loss) dan link flapping. Satu goresan mikroskopis = link 10G tidak stabil. Inilah mengapa teknisi fiber memakai stripper presisi, bukan cutter biasa.',
      bestPractices: 'Gunakan tool khusus fiber (stripper, cleaver) — jangan pakai tool tembaga. Satu goresan = satu link bermasalah.',
      security: 'Struktur berlapis fiber menyulitkan penyadapan tanpa terdeteksi (memotong serat = loss terukur) — tapi bukan mustahil; data sensitif tetap wajib enkripsi.',
      challenge: 'Gambar penampang serat dari ingatan: 3 lapisan + ukurannya untuk single mode. Cocokkan dengan diagram di atas.',
      interviewQ: 'Q: "Sebutkan 3 lapisan serat optik dan fungsinya." — A: Core (kaca inti, jalan cahaya — 9 µm SM / 50 µm MM), cladding (kaca indeks bias rendah, memantulkan cahaya kembali via total internal reflection), coating (plastik pelindung mekanis dari goresan).',
      quiz: [
        { q: 'Lapisan tempat cahaya merambat adalah…', options: ['Cladding', 'Core', 'Coating', 'Jaket'], answer: 1, explain: 'Core = inti kaca, jalan cahaya.' },
        { q: 'Fungsi cladding adalah…', options: ['Pelindung plastik', 'Kaca indeks bias rendah yang memantulkan cahaya kembali ke core', 'Membawa data', 'Pewarna'], answer: 1, explain: 'Total internal reflection di batas core-cladding mengurung cahaya.' },
        { q: 'Diameter core single mode vs multimode adalah…', options: ['Sama 50 µm', '9 µm (SM) vs 50/62.5 µm (MM)', '125 µm keduanya', '250 µm keduanya'], answer: 1, explain: 'Core sempit = satu mode cahaya (SM); lebar = banyak mode (MM).' },
      ],
    },
    {
      id: '7.3',
      title: 'Core',
      body: `<p><b>Core</b> adalah <b>jantung serat optik</b>: silinder kaca murni (silika) tempat <b>pulsa cahaya</b> benar-benar berjalan. Semua karakteristik transmisi fiber ditentukan oleh <b>diameter core</b> ini.</p>
<h3>Dua Ukuran, Dua Dunia</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Diameter Core</th><th>Sumber Cahaya</th><th>Akibat</th></tr>
<tr><td><b>Single Mode</b></td><td>9 µm</td><td>Laser</td><td>Satu jalur cahaya → jarak sangat jauh, mahal</td></tr>
<tr><td><b>Multimode</b></td><td>50 / 62.5 µm</td><td>LED / VCSEL</td><td>Banyak jalur → jarak pendek, murah</td></tr>
</table></div>
<p>Untuk perbandingan: rambut manusia ±70 µm — core single mode <b>8x lebih tipis dari rambut</b>! Inilah alasan konektor fiber butuh kebersihan mikroskopis: debu 10 µm sudah menutupi seluruh core SM.</p>
<h3>Mengapa Diameter Menentukan Jarak?</h3>
<p>Core lebar (MM) memungkinkan cahaya masuk dengan <b>banyak sudut</b> → banyak "mode" (jalur) → tiap mode tiba <b>di waktu berbeda</b> (<b>modal dispersion</b>) → pulsa melebar → jarak & kecepatan terbatas. Core sempit (SM) hanya muat <b>satu mode</b> → tidak ada dispersion → pulsa tetap tajam puluhan kilometer.</p>
<div class="callout blue"><div class="t">Inti Satu Sub-bab</div><p style="margin:4px 0 0"><b>Core kecil = satu mode = jauh & mahal. Core besar = banyak mode = dekat & murah.</b> Satu kalimat ini menjelaskan seluruh perbedaan SM vs MM — dan menjadi dasar pemilihan di setiap desain.</p></div>`,
      terms: [
        ['Core', 'Inti kaca serat; diameternya (9 vs 50 µm) menentukan single/multimode.'],
        ['Mode', 'Satu jalur perambatan cahaya dalam core.'],
        ['Modal dispersion', 'Pelebaran pulsa karena tiap mode tiba di waktu berbeda — pembatas MM.'],
      ],
      scenario: 'Engineer memesan transceiver single mode untuk fiber multimode yang sudah terpasang — core 9 µm laser ke core 50 µm: cahaya "tenggelam" dan tidak fokus → link tidak nyala. Kerugian puluhan juta + delay proyek. Pelajaran: cocokkan SELALU jenis transceiver dengan jenis fiber (cek label OS/OM di kabel!).',
      bestPractices: 'Sebelum beli transceiver: cek label kabel (OS2/OM3/OM4) dan cocokkan. Dokumentasikan jenis fiber tiap link di as-built.',
      security: 'Core 9 µm yang sempit membuat tap ilegal sulit dipasang tanpa loss terdeteksi — keunggulan keamanan fisik bawaan single mode.',
      challenge: 'Jelaskan dengan kata-katamu: mengapa core yang LEBIH KECIL justru bisa LEBIH JAUH? (Petunjuk: modal dispersion.)',
      interviewQ: 'Q: "Apa hubungan diameter core dengan jarak transmisi?" — A: Core besar (multimode) → banyak mode cahaya → modal dispersion (tiba tidak bersamaan) → pulsa melebar → jarak pendek. Core kecil (single mode, 9 µm) → satu mode → tanpa dispersion → jarak puluhan km.',
      quiz: [
        { q: 'Diameter core single mode adalah…', options: ['50 µm', '9 µm', '62.5 µm', '125 µm'], answer: 1, explain: '9 µm — 8x lebih tipis dari rambut manusia.' },
        { q: 'Penyebab utama jarak multimode terbatas adalah…', options: ['Harga laser', 'Modal dispersion — tiap mode tiba di waktu berbeda', 'Warna jaket', 'Konektor'], answer: 1, explain: 'Banyak jalur = pulsa melebar = batas kecepatan×jarak.' },
        { q: 'Debu 10 µm pada konektor single mode berakibat…', options: ['Tidak masalah', 'Menutupi seluruh core 9 µm — link gagal total', 'Menambah kecepatan', 'Membersihkan otomatis'], answer: 1, explain: 'Toleransi mikroskopis = kebersihan adalah segalanya.' },
      ],
    },
    {
      id: '7.4',
      title: 'Cladding',
      body: `<p><b>Cladding</b> adalah lapisan kaca yang membungkus core — dengan <b>indeks bias lebih rendah</b> dari core. Perbedaan indeks inilah yang menciptakan <b>total internal reflection</b>: cahaya yang mencoba keluar core <b>dipantulkan sempurna kembali</b>, seperti cermin.</p>
<h3>Prinsip: Cermin untuk Cahaya</h3>
<pre>         core (indeks tinggi, n1)
   ──▶  ·························  ──▶  cahaya merambat
         ╲                     ╱
          ╲  dipantulkan!     ╱   ← total internal reflection
           ╲                 ╱       di batas core-cladding
            ················
         cladding (indeks rendah, n2 < n1)</pre>
<p><b>Analogi:</b> seperti selang air — air (cahaya) tetap di dalam selang (core) karena dinding (cladding) tidak bocor. Tanpa cladding, cahaya menyebar keluar dan hilang dalam sentimeter.</p>
<h3>Ukuran Standar: 125 µm</h3>
<p>Cladding (core+cladding) hampir selalu <b>125 µm</b> — baik SM (9/125) maupun MM (50/125). <b>Alasan standardisasi:</b> konektor, splicer, dan alat ukur bisa memakai <b>satu ukuran ferrule</b> untuk semua jenis fiber. Notasi <code>9/125</code> dibaca: core 9 µm / cladding 125 µm.</p>
<div class="callout"><div class="t">Cladding Rusak = Fiber Bocor</div><p style="margin:4px 0 0">Goresan/tekukan tajam pada cladding mengganggu pemantulan → cahaya bocor (<b>micro/macro-bend loss</b>). Inilah alasan ada <b>radius tekuk minimum</b> (umumnya 20x diameter kabel) — tekuk tajam = link bermasalah.</p></div>`,
      terms: [
        ['Cladding', 'Kaca pembungkus core berindeks bias rendah; menciptakan total internal reflection.'],
        ['Indeks bias', 'Ukuran kemampuan material membelokkan cahaya; beda indeks = pemantulan.'],
        ['Bend loss', 'Kehilangan cahaya akibat tekukan — micro (kecil) / macro (tajam).'],
        ['9/125', 'Notasi: core 9 µm / cladding 125 µm.'],
      ],
      scenario: 'Kabel fiber ditekuk tajam 90° di sudut rak agar "rapi" — link 10G flapping. OTDR menunjukkan loss besar tepat di tekukan (macro-bend). Solusi: longgarkan tekukan sesuai radius minimum, loss kembali normal. Kerapian yang melanggar fisika = masalah.',
      bestPractices: 'Hormati radius tekuk minimum (cek datasheet, umum 20x diameter). Gunakan bend-insensitive fiber (G.657) untuk instalasi indoor yang sempit.',
      security: 'Tekukan tajam yang disengaja (untuk tap) menimbulkan bend loss khas — monitor baseline loss untuk mendeteksi penyadapan fisik.',
      challenge: 'Jelaskan analogi selang air untuk cladding kepada teman non-teknis dalam 3 kalimat.',
      interviewQ: 'Q: "Apa fungsi cladding?" — A: Kaca pembungkus core dengan indeks bias lebih rendah, menciptakan total internal reflection sehingga cahaya terpantul sempurna kembali ke core dan tidak bocor. Ukuran standar 125 µm (notasi 9/125, 50/125).',
      quiz: [
        { q: 'Cahaya tetap di dalam core karena…', options: ['Lem khusus', 'Total internal reflection di batas core-cladding (beda indeks bias)', 'Magnet', 'Tekanan udara'], answer: 1, explain: 'Cladding indeks lebih rendah = cermin sempurna untuk cahaya.' },
        { q: 'Notasi "50/125" artinya…', options: ['50 km / 125 km', 'Core 50 µm / cladding 125 µm', 'Harga 50/125', '50 core / 125 cladding'], answer: 1, explain: 'Notasi standar: diameter core / diameter cladding dalam µm.' },
        { q: 'Tekukan tajam pada fiber menyebabkan…', options: ['Tidak masalah', 'Bend loss — cahaya bocor di tekukan', 'Kecepatan naik', 'Warna berubah'], answer: 1, explain: 'Tekukan merusak sudut pemantulan → cahaya lolos dari core.' },
      ],
    },
    {
      id: '7.5',
      title: 'Coating',
      body: `<p><b>Coating</b> (juga disebut <i>buffer coating</i>) adalah <b>lapisan plastik</b> (biasanya akrilat) setebal <b>250 µm</b> yang membungkus cladding — <b>pelindung mekanis</b> pertama serat dari goresan, kelembapan, dan tekanan.</p>
<h3>Coating vs Jaket: Jangan Tertukar!</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Coating</th><th>Jaket Kabel</th></tr>
<tr><td>Posisi</td><td>Langsung di cladding (per serat)</td><td>Terluar (per kabel)</td></tr>
<tr><td>Bahan</td><td>Plastik tipis (akrilat)</td><td>PVC/LSZH tebal</td></tr>
<tr><td>Fungsi</td><td>Lindungi serat individu</td><td>Lindungi seluruh kabel</td></tr>
<tr><td>Warna</td><td>Kode warna serat (biru, oranye, ...)</td><td>Kuning (SM) / aqua (MM)</td></tr>
</table></div>
<h3>Peran dalam Instalasi</h3>
<ul>
<li><b>Kode warna:</b> 12 warna standar (biru, oranye, hijau, coklat, ...) mengidentifikasi serat 1–12 dalam kabel multi-core — krusial saat splicing (7.19).</li>
<li><b>Dikupas saat splicing:</b> sebelum fusion splice, coating dikupas dengan <b>stripper presisi</b> (±2–3 cm), lalu serat dibersihkan alkohol.</li>
<li><b>Tight buffer vs loose tube:</b> coating 900 µm (tight buffer) untuk indoor/patch; loose tube (serat longgar dalam tabung gel) untuk outdoor — tabung melindungi dari air & tekanan tanah.</li>
</ul>
<div class="callout blue"><div class="t">Detail Kecil, Dampak Besar</div><p style="margin:4px 0 0">Sisa coating yang tidak bersih sempurna sebelum splicing = splice loss tinggi. Teknisi fiber profesional menghabiskan 80% waktu untuk <b>persiapan</b> (strip, clean, cleave) dan 20% untuk splicing itu sendiri.</p></div>`,
      terms: [
        ['Coating', 'Lapisan plastik 250 µm pelindung mekanis serat; berkode warna.'],
        ['Tight buffer', 'Coating tebal 900 µm untuk indoor — serat "ketat".'],
        ['Loose tube', 'Serat longgar dalam tabung gel — untuk outdoor, anti air & tekanan.'],
      ],
      scenario: 'Splicing outdoor: teknisi memakai kabel tight-buffer indoor untuk jalur luar gedung — 6 bulan kemudian air merembes, puluhan splice korosi, loss naik massal. Seharusnya loose tube untuk outdoor. Salah pilih konstruksi kabel = bom waktu.',
      bestPractices: 'Outdoor = loose tube (+ gel/water blocking). Indoor/patch = tight buffer. Jangan tertukar — lingkungan menentukan konstruksi.',
      security: 'Salah pilih konstruksi (indoor untuk outdoor) menyebabkan degradasi yang bisa disalahartikan sebagai serangan — spesifikasi yang tepat mengurangi false alarm.',
      challenge: 'Hafalkan 4 warna pertama kode serat: biru, oranye, hijau, coklat. Untuk apa kode warna ini dipakai?',
      interviewQ: 'Q: "Apa beda coating dan jaket kabel?" — A: Coating = plastik tipis 250 µm langsung di cladding, melindungi tiap serat individu + kode warna. Jaket = lapisan terluar tebal (PVC/LSZH) melindungi seluruh kabel. Keduanya pelindung mekanis di level berbeda.',
      quiz: [
        { q: 'Fungsi utama coating adalah…', options: ['Membawa cahaya', 'Pelindung mekanis tiap serat + kode warna identifikasi', 'Memantulkan cahaya', 'Konektor'], answer: 1, explain: 'Coating = plastik 250 µm anti gores; warnanya mengidentifikasi serat.' },
        { q: 'Untuk instalasi outdoor, konstruksi yang tepat adalah…', options: ['Tight buffer', 'Loose tube (tabung gel, anti air & tekanan)', 'Tanpa coating', 'Patch cord'], answer: 1, explain: 'Outdoor butuh proteksi air/tekanan tanah — loose tube.' },
        { q: 'Sebelum fusion splicing, coating harus…', options: ['Dibiarkan', 'Dikupas dengan stripper presisi lalu dibersihkan', 'Dipanaskan', 'Dicat'], answer: 1, explain: 'Persiapan bersih = splice loss rendah; 80% waktu teknisi di sini.' },
      ],
    },
    {
      id: '7.6',
      title: 'Single Mode Fiber',
      body: `<p><b>Single Mode Fiber (SMF)</b> adalah serat dengan <b>core 9 µm</b> yang hanya melewatkan <b>satu mode cahaya</b> (satu jalur lurus). Sumber cahayanya <b>laser</b> — mahal tapi presisi.</p>
<h3>Karakteristik</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Single Mode</th></tr>
<tr><td>Core / cladding</td><td>9 / 125 µm</td></tr>
<tr><td>Sumber cahaya</td><td>Laser (1310 / 1550 nm)</td></tr>
<tr><td>Jarak</td><td><b>10 km – 100+ km</b> (tanpa repeater)</td></tr>
<tr><td>Bandwidth</td><td>Praktis tak terbatas (DWDM terabit)</td></tr>
<tr><td>Biaya</td><td>Kabel murah, <b>transceiver mahal</b></td></tr>
<tr><td>Warna jaket</td><td><b>Kuning</b> (standar)</td></tr>
</table></div>
<h3>Kapan Memakai SMF?</h3>
<ul>
<li><b>Antar-gedung / antar-kota:</b> backbone kampus, metro, long-haul — wilayah alaminya.</li>
<li><b>Future-proof:</b> kabel SMF yang dipasang hari ini bisa upgrade 10G → 100G → 400G <b>hanya dengan ganti transceiver</b> — fiber-nya tidak perlu diganti. Investasi 20+ tahun.</li>
<li>Data center modern: banyak yang langsung SMF untuk semua (harga transceiver SMF makin turun).</li>
</ul>
<div class="callout"><div class="t">Mitos: "SMF Selalu Lebih Mahal"</div><p style="margin:4px 0 0">Kabel SMF justru <b>lebih murah</b> dari MMF! Yang mahal = <b>transceiver laser</b>. Total cost untuk jarak pendek sering dimenangkan MMF (transceiver VCSEL murah); untuk jarak jauh & masa depan, SMF menang telak.</p></div>`,
      terms: [
        ['Single Mode Fiber', 'Serat core 9 µm, satu mode cahaya, laser; jarak puluhan km.'],
        ['nm', 'Nanometer — satuan panjang gelombang cahaya (1310/1550 nm untuk SMF).'],
      ],
      diagram: `<pre>      SINGLE MODE: SATU JALUR LURUS

   Laser ──▶ ······························· ──▶
             core 9 µm (satu mode saja)
             = tanpa modal dispersion = jarak jauh

   Jaket KUNING = single mode (hafalkan warna!)</pre>`,
      scenario: 'Kampus memasang backbone SMF antar 8 gedung (terjauh 2 km) tahun 2018 untuk 10G. Tahun 2026 upgrade ke 100G: cukup ganti transceiver — kabel tetap. Jika dulu memakai MMF, kabel harus diganti total (MMF tidak sampai 100G di 2 km). Keputusan 2018 menghemat miliaran di 2026.',
      bestPractices: 'Untuk backbone antar-gedung: default SMF OS2. Pikirkan 15 tahun ke depan, bukan kebutuhan hari ini.',
      security: 'Kabel SMF yang future-proof mengurangi kebutuhan penggalian ulang — setiap penggalian adalah jendela risiko akses fisik tak terotorisasi.',
      challenge: 'Jelaskan mengapa kabel SMF lebih murah tapi transceiver-nya lebih mahal dibanding MMF.',
      interviewQ: 'Q: "Kapan memilih single mode fiber?" — A: Untuk jarak jauh (antar-gedung/kota, >550 m) dan future-proof: core 9 µm + laser = tanpa modal dispersion, jarak puluhan km, dan upgrade kecepatan cukup ganti transceiver tanpa ganti kabel.',
      quiz: [
        { q: 'Ciri single mode fiber adalah…', options: ['Core 50 µm + LED', 'Core 9 µm + laser, satu mode', 'Core 62.5 µm', 'Tanpa cladding'], answer: 1, explain: '9/125 µm, laser 1310/1550 nm, satu jalur cahaya.' },
        { q: 'Warna jaket standar single mode adalah…', options: ['Aqua', 'Kuning', 'Magenta', 'Oranye'], answer: 1, explain: 'Kuning = SM; aqua/magenta = MM.' },
        { q: 'Keunggulan investasi SMF untuk backbone adalah…', options: ['Transceiver murah', 'Upgrade kecepatan cukup ganti transceiver — kabel tahan 20+ tahun', 'Bisa dikrimping', 'Tanpa perawatan'], answer: 1, explain: 'Fiber-nya future-proof; yang diganti hanya elektronik di ujung.' },
      ],
    },
    {
      id: '7.7',
      title: 'Multimode Fiber',
      body: `<p><b>Multimode Fiber (MMF)</b> adalah serat dengan <b>core lebar (50/62.5 µm)</b> yang melewatkan <b>banyak mode cahaya</b> sekaligus. Sumbernya <b>LED/VCSEL</b> — murah dan hemat daya.</p>
<h3>Karakteristik</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Multimode</th></tr>
<tr><td>Core / cladding</td><td>50 / 125 µm (atau 62.5/125)</td></tr>
<tr><td>Sumber cahaya</td><td>LED / VCSEL 850 nm (murah!)</td></tr>
<tr><td>Jarak</td><td><b>300–550 m</b> (tergantung grade & kecepatan)</td></tr>
<tr><td>Biaya</td><td>Kabel mahal, <b>transceiver murah</b></td></tr>
<tr><td>Warna jaket</td><td><b>Aqua</b> (OM3/OM4) / oranye (OM1/OM2 lama)</td></tr>
</table></div>
<h3>Kapan Memakai MMF?</h3>
<ul>
<li><b>Dalam gedung / data center:</b> jarak antar-rak &lt;300 m — wilayah alaminya.</li>
<li><b>Budget terbatas untuk 10G jarak pendek:</b> transceiver SR (short range) VCSEL jauh lebih murah dari LR laser.</li>
</ul>
<h3>Batasan yang Harus Diingat</h3>
<p><b>Modal dispersion</b> (7.3) membatasi kombinasi kecepatan×jarak: makin cepat, makin pendek. OM4 10G = 550 m, tapi OM4 40G = 150 m, 100G = 100 m. <b>Alasan:</b> pulsa yang melebar harus tetap terbaca dalam 1 bit time yang makin sempit di kecepatan tinggi.</p>
<div class="callout blue"><div class="t">Aturan Memilih: Jarak Menentukan</div><p style="margin:4px 0 0"><b>&lt; 550 m + budget ketat</b> → MMF (OM3/OM4). <b>&gt; 550 m atau future-proof</b> → SMF (OS2). Di tengah (300–550 m): hitung TCO 5 tahun termasuk rencana upgrade kecepatan.</p></div>`,
      terms: [
        ['Multimode Fiber', 'Serat core 50/62.5 µm, banyak mode, VCSEL murah; jarak 300–550 m.'],
        ['VCSEL', 'Vertical-Cavity Surface-Emitting Laser — laser murah untuk MMF jarak pendek.'],
      ],
      diagram: `<pre>      MULTIMODE: BANYAK JALUR (mode)

   VCSEL ──▶ ╲··╱··╲··╱ ──▶  banyak mode,
              ╲··╱··╲··╱      tiba tak bersamaan
              core 50 µm      = modal dispersion
                              = jarak terbatas

   Jaket AQUA = OM3/OM4 (hafalkan warna!)</pre>`,
      scenario: 'Data center dengan 200 link antar-rak (jarak 50–150 m) butuh 10G. Pilihan MMF OM4 + transceiver SR: total hemat 40% dibanding SMF + LR. Jarak pendek = MMF menang. Sebaliknya backbone antar-gedung 1 km dengan MMF = mustahil (melebihi batas). Jarak menentukan pemenang.',
      bestPractices: 'Dalam gedung/data center (<300 m): MMF OM4 default. Antar-gedung: SMF OS2. Jangan tertukar — batas fisik tidak bisa dinegosiasi.',
      security: 'Batas jarak MMF yang dilanggar menyebabkan link flapping — gejala yang bisa disalahartikan sebagai DoS; hormati batas fisik.',
      challenge: 'Untuk link 400 m 10G: pilih MMF atau SMF? Untuk link 400 m dengan rencana 40G tahun depan?',
      interviewQ: 'Q: "Kapan memilih multimode fiber?" — A: Jarak pendek dalam gedung/data center (<550 m) dengan budget terbatas: core 50 µm + VCSEL murah. Batasnya: modal dispersion membatasi kombinasi kecepatan×jarak (makin cepat makin pendek) — untuk jarak jauh/future-proof pilih single mode.',
      quiz: [
        { q: 'Sumber cahaya multimode umumnya adalah…', options: ['Laser 1550 nm mahal', 'LED/VCSEL 850 nm yang murah', 'Lampu neon', 'Sinar matahari'], answer: 1, explain: 'VCSEL murah = keunggulan biaya MMF untuk jarak pendek.' },
        { q: 'Batas jarak tipikal MMF untuk 10G (OM4) adalah…', options: ['100 km', '550 m', '100 m', '10 km'], answer: 1, explain: 'Modal dispersion membatasi; OM4 10G = 550 m.' },
        { q: 'Warna jaket OM3/OM4 adalah…', options: ['Kuning', 'Aqua', 'Merah', 'Hitam'], answer: 1, explain: 'Aqua = OM3/OM4 laser-optimized; kuning = SM.' },
      ],
    },
    {
      id: '7.8',
      title: 'OS1',
      body: `<p><b>OS1</b> (<i>Optical Single-mode 1</i>) adalah klasifikasi standar <b>single mode untuk indoor</b> (standar <b>ISO/IEC 11801</b>; padanan ITU-T <b>G.652A/B</b>).</p>
<h3>Karakteristik</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OS1</th></tr>
<tr><td>Jenis</td><td>Single mode 9/125 µm</td></tr>
<tr><td>Lingkungan</td><td><b>Indoor</b> (tight buffer)</td></tr>
<tr><td>Attenuation maks</td><td>1.0 dB/km @ 1310/1550 nm</td></tr>
<tr><td>Pemakaian</td><td>Backbone dalam gedung, kampus indoor</td></tr>
</table></div>
<h3>OS1 vs OS2</h3>
<p>Perbedaan utamanya <b>bukan kecepatan</b> — keduanya SMF 9 µm yang mampu 100G+. Bedanya: <b>konstruksi & attenuation</b>. OS1 = tight-buffer indoor, attenuation ≤1.0 dB/km. OS2 = loose-tube outdoor, attenuation ≤0.4 dB/km (lebih rendah!). <b>Alasan praktis:</b> untuk link pendek indoor, bedanya tidak terasa — tapi untuk link kilometer, OS2 menghemat budget loss.</p>
<div class="callout"><div class="t">Membaca Label Kabel</div><p style="margin:4px 0 0">Kabel SMF indoor berlabel "OS1" = pakai transceiver SMF biasa (LR/ER). Jangan bingung: OS1/OS2 <b>bukan kecepatan</b> — kecepatan ditentukan <b>transceiver</b> (SFP/SFP+, 7.22–7.24), bukan kabelnya!</p></div>`,
      terms: [
        ['OS1', 'Single mode indoor (tight buffer); attenuation ≤1.0 dB/km.'],
        ['G.652', 'Standar ITU-T untuk SMF konvensional (OS1 ≈ G.652A/B).'],
      ],
      scenario: 'Kontraktor memasang OS1 untuk jalur antar-gedung outdoor (seharusnya OS2 loose tube). Dua musim hujan kemudian: air merembes ke tight buffer, loss naik, link flapping. Ganti total ke OS2. Pelajaran: OS1 = indoor saja, tanpa kecuali.',
      bestPractices: 'Indoor = OS1 boleh; outdoor/antar-gedung = OS2. Cek label sebelum terima barang.',
      security: 'Pastikan label OS1 asli — kabel palsu dengan attenuation berlebih menyebabkan degradasi yang sulit dilacak; beli dari distributor resmi.',
      challenge: 'Apa arti label "OS1 9/125 G.652D" pada kabel? Uraikan tiap bagiannya.',
      interviewQ: 'Q: "Apa beda OS1 dan OS2?" — A: Keduanya single mode 9 µm. OS1 = indoor (tight buffer), attenuation ≤1.0 dB/km. OS2 = outdoor (loose tube), attenuation ≤0.4 dB/km — lebih baik untuk jarak jauh. Kecepatan ditentukan transceiver, bukan OS-nya.',
      quiz: [
        { q: 'OS1 adalah fiber single mode untuk…', options: ['Outdoor bawah laut', 'Indoor (tight buffer)', 'Satelit', 'Bawah tanah dalam'], answer: 1, explain: 'OS1 = indoor; outdoor = OS2.' },
        { q: 'Attenuation maksimum OS1 adalah…', options: ['0.4 dB/km', '1.0 dB/km', '3.0 dB/km', '10 dB/km'], answer: 1, explain: 'OS1 ≤1.0 dB/km; OS2 lebih baik (≤0.4).' },
        { q: 'Kecepatan link fiber ditentukan oleh…', options: ['Kode OS/OM kabel', 'Transceiver (SFP/SFP+/QSFP)', 'Warna jaket', 'Panjang gelombang saja'], answer: 1, explain: 'Kabel = media; elektronik di ujung (transceiver) menentukan kecepatan.' },
      ],
    },
    {
      id: '7.9',
      title: 'OS2',
      body: `<p><b>OS2</b> (<i>Optical Single-mode 2</i>) adalah single mode untuk <b>outdoor</b> (loose tube; padanan ITU-T <b>G.652D / G.657</b> untuk bend-insensitive) dengan attenuation lebih rendah: <b>≤0.4 dB/km</b>.</p>
<h3>OS1 vs OS2 Head-to-Head</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OS1</th><th>OS2</th></tr>
<tr><td>Lingkungan</td><td>Indoor (tight buffer)</td><td><b>Outdoor</b> (loose tube)</td></tr>
<tr><td>Attenuation</td><td>≤1.0 dB/km</td><td><b>≤0.4 dB/km</b></td></tr>
<tr><td>Jarak praktis</td><td>Pendek–menengah</td><td><b>Panjang (km)</b></td></tr>
<tr><td>Harga kabel</td><td>Lebih murah</td><td>Lebih mahal (konstruksi outdoor)</td></tr>
</table></div>
<h3>Mengapa Attenuation Penting?</h3>
<p>Selisih 0.6 dB/km terdengar kecil — tapi di <b>40 km</b> = selisih <b>24 dB</b>! Itu perbedaan antara link yang hidup dan mati (link budget tipikal 20–30 dB). <b>Alasan:</b> setiap desibel menentukan berapa jauh cahaya bertahan sebelum terlalu lemah dibaca receiver (7.27).</p>
<h3>Kapan OS2?</h3>
<ul>
<li><b>Antar-gedung outdoor</b> (tanah/udara) — konstruksi loose tube tahan air & tekanan.</li>
<li><b>Link >2 km</b> — hemat budget loss.</li>
<li><b>Bend-insensitive (G.657):</b> varian OS2 yang tahan tekukan tajam — ideal untuk instalasi indoor sempit (FTTH ke rumah).</li>
</ul>
<div class="callout blue"><div class="t">Default Backbone Modern</div><p style="margin:4px 0 0"><b>OS2 adalah default backbone antar-gedung/kota saat ini.</b> Jika ragu antara OS1/OS2 untuk jalur yang keluar gedung — pilih OS2. Selisih harga kabel tidak sebanding dengan risiko ganti total.</p></div>`,
      terms: [
        ['OS2', 'Single mode outdoor (loose tube); attenuation ≤0.4 dB/km; standar backbone.'],
        ['G.657', 'Varian SMF bend-insensitive — tahan tekukan tajam (FTTH).'],
      ],
      scenario: 'ISP menarik backbone 15 km antar-kota. Dengan OS1 (1.0 dB/km) = 15 dB loss kabel saja — belum konektor & splice — melebihi budget transceiver standar. Dengan OS2 (0.4 dB/km) = 6 dB — aman dengan margin besar. Pemilihan OS menentukan apakah link butuh repeater mahal di tengah.',
      bestPractices: 'Untuk setiap link >2 km: hitung link budget (7.27) DENGAN angka attenuation OS2. Jangan asumsi "pasti cukup".',
      security: 'Backbone OS2 antar-gedung melewati area publik — pastikan jalur terkunci/terpantau; dokumentasikan setiap handhole/splice closure.',
      challenge: 'Hitung loss kabel untuk 25 km: OS1 vs OS2. Berapa selisihnya dalam dB? (Petunjuk: dB/km × km.)',
      interviewQ: 'Q: "Kapan memilih OS2 dibanding OS1?" — A: Untuk outdoor/antar-gedung (loose tube tahan air) dan link panjang: attenuation OS2 (≤0.4 dB/km) jauh lebih rendah dari OS1 (≤1.0) — selisihnya menentukan di link berkilometer. OS2 adalah default backbone modern.',
      quiz: [
        { q: 'Attenuation maksimum OS2 adalah…', options: ['1.0 dB/km', '0.4 dB/km', '3.5 dB/km', '0.1 dB/km'], answer: 1, explain: 'OS2 ≤0.4 dB/km — 2.5x lebih baik dari OS1.' },
        { q: 'Konstruksi kabel OS2 umumnya…', options: ['Tight buffer indoor', 'Loose tube outdoor (tahan air & tekanan)', 'Tanpa jaket', 'Patch cord'], answer: 1, explain: 'Loose tube = serat longgar dalam tabung gel untuk outdoor.' },
        { q: 'Untuk link 25 km, selisih loss kabel OS1 vs OS2 adalah…', options: ['0 dB', '15 dB (25 vs 10 dB)', '1 dB', '100 dB'], answer: 1, explain: 'OS1: 25×1.0=25 dB; OS2: 25×0.4=10 dB; selisih 15 dB — sangat signifikan.' },
      ],
    },
    {
      id: '7.10',
      title: 'OM1',
      body: `<p><b>OM1</b> (<i>Optical Multimode 1</i>) adalah <b>multimode generasi lama</b>: core <b>62.5/125 µm</b>, jaket <b>oranye</b>. Dulu standar (1990-an), kini <b>legacy</b>.</p>
<h3>Spesifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OM1</th></tr>
<tr><td>Core</td><td>62.5 / 125 µm</td></tr>
<tr><td>Sumber</td><td>LED 850/1300 nm</td></tr>
<tr><td>1 Gbps</td><td>300 m</td></tr>
<tr><td>10 Gbps</td><td><b>33 m</b> (sangat pendek!)</td></tr>
<tr><td>Status</td><td><b>Legacy — jangan pasang baru</b></td></tr>
</table></div>
<h3>Mengapa OM1 Tertinggal?</h3>
<p>Core 62.5 µm yang lebar + LED = <b>modal dispersion besar</b>. Di era 10G, jangkauannya hanya 33 m — tidak berguna untuk backbone gedung. OM2/OM3/OM4 (core 50 µm + laser VCSEL) menggantikannya.</p>
<h3>Masih Relevan?</h3>
<p><b>Ya — sebagai warisan:</b> banyak gedung lama masih penuh OM1 oranye. Saat upgrade ke 10G, pilihannya: ganti kabel (mahal) atau <b>mode-conditioning patch cord</b> (solusi transisi, terbatas). <b>Alasan dipelajari:</b> kamu akan menemui jaket oranye di lapangan — harus tahu batasnya (33 m @ 10G) agar tidak salah desain.</p>
<div class="callout"><div class="t">Jangan Beli OM1 Baru</div><p style="margin:4px 0 0">Tidak ada alasan memasang OM1 di 2026. Minimum untuk instalasi MMF baru = <b>OM3</b> (atau OM4). OM1 hanya untuk dipahami (warisan) — bukan dibeli.</p></div>`,
      terms: [
        ['OM1', 'Multimode legacy: 62.5/125 µm, jaket oranye; 10G hanya 33 m.'],
      ],
      scenario: 'Gedung 2005 dengan backbone OM1 oranye ingin upgrade ke 10G antar-lantai (jarak 80 m). OM1 tidak sampai (33 m) — proyek tertunda 3 bulan untuk ganti ke OM4. Jika dulu dipasang OM3, upgrade tinggal ganti transceiver. Warisan kabel menentukan masa depan upgrade.',
      bestPractices: 'Saat survei site: catat OM1 yang terpasang dan tandai "tidak 10G-ready" di dokumentasi. Rencanakan penggantian bertahap.',
      security: 'Infrastruktur OM1 warisan sering tidak terdokumentasi — audit dan petakan sebelum menjadi titik buta keamanan fisik.',
      challenge: 'Mengapa OM1 (62.5 µm) lebih buruk dari OM3 (50 µm) padahal core-nya LEBIH BESAR? (Petunjuk: modal dispersion.)',
      interviewQ: 'Q: "Apa itu OM1 dan mengapa tidak dipakai lagi?" — A: Multimode generasi lama (62.5/125 µm, jaket oranye, sumber LED). Modal dispersion besar → 10G hanya 33 m. Digantikan OM2/OM3/OM4 (50 µm + VCSEL). Masih ditemui sebagai warisan di gedung lama.',
      quiz: [
        { q: 'Ciri OM1 adalah…', options: ['Core 50 µm, jaket aqua', 'Core 62.5 µm, jaket oranye, legacy', 'Core 9 µm', 'Single mode'], answer: 1, explain: 'OM1 = 62.5/125 µm, oranye, generasi lama.' },
        { q: 'Jarak OM1 untuk 10 Gbps hanya…', options: ['550 m', '300 m', '33 m', '10 km'], answer: 2, explain: 'Modal dispersion parah di 10G — praktis tidak berguna.' },
        { q: 'Untuk instalasi MMF baru di 2026, minimum yang dipasang adalah…', options: ['OM1', 'OM2', 'OM3 (atau OM4)', 'OS1'], answer: 2, explain: 'OM3/OM4 laser-optimized untuk 10G+; OM1/OM2 jangan dibeli baru.' },
      ],
    },
    {
      id: '7.11',
      title: 'OM2',
      body: `<p><b>OM2</b> (<i>Optical Multimode 2</i>) adalah <b>transisi</b>: core <b>50/125 µm</b> (seperti OM3/4) tetapi masih untuk <b>LED</b>, jaket <b>oranye</b>.</p>
<h3>Spesifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OM2</th></tr>
<tr><td>Core</td><td>50 / 125 µm</td></tr>
<tr><td>1 Gbps</td><td>600 m</td></tr>
<tr><td>10 Gbps</td><td><b>82 m</b></td></tr>
<tr><td>Status</td><td>Transisi — jarang dipasang baru</td></tr>
</table></div>
<h3>Posisi OM2</h3>
<p>OM2 memperbaiki OM1 (core 50 µm → dispersion lebih kecil) tapi belum <b>laser-optimized</b> seperti OM3/4 — sehingga 10G hanya 82 m. Ia adalah "jembatan" yang cepat dilampaui.</p>
<div class="callout blue"><div class="t">Praktisnya</div><p style="margin:4px 0 0">Jika menemukan OM2 di lapangan: ia <b>lebih baik dari OM1</b> (10G sampai 82 m — cukup untuk antar-rak dekat) tapi tetap rencanakan upgrade ke OM3/4. Jangan beli OM2 baru — selisih harga ke OM3 kecil, selisih performa besar.</p></div>`,
      terms: [
        ['OM2', 'Multimode transisi: 50/125 µm, LED; 10G = 82 m.'],
      ],
      scenario: 'Ruang server lama memakai OM2 antar-rak (jarak 30 m). Upgrade ke 10G: OM2 masih cukup (82 m)! Tidak perlu ganti kabel — hemat besar. Inilah nilai memahami spesifikasi warisan: keputusan berbasis data, bukan "ganti semua".',
      bestPractices: 'Ukur jarak aktual vs batas OM2 (82 m @ 10G) sebelum memutuskan ganti. Data mengalahkan asumsi.',
      security: 'Sama seperti OM1: kabel warisan tanpa dokumentasi = titik buta. Petakan dan rencanakan penggantian.',
      challenge: 'Urutkan OM1–OM4 berdasarkan jarak 10G dari terpendek ke terjauh (tanpa melihat tabel!).',
      interviewQ: 'Q: "Apa beda OM1, OM2, OM3?" — A: OM1: 62.5 µm LED, 10G=33 m (legacy). OM2: 50 µm LED, 10G=82 m (transisi). OM3: 50 µm laser-optimized (VCSEL), 10G=300 m. Makin baru: core lebih presisi + sumber laser = dispersion lebih kecil = jarak lebih jauh.',
      quiz: [
        { q: 'OM2 memiliki core…', options: ['62.5 µm', '50 µm', '9 µm', '100 µm'], answer: 1, explain: 'OM2 = 50/125 µm (seperti OM3/4) tapi untuk LED.' },
        { q: 'Jarak OM2 untuk 10 Gbps adalah…', options: ['33 m', '82 m', '300 m', '550 m'], answer: 1, explain: 'Belum laser-optimized → 82 m.' },
        { q: 'Antar-rak 30 m dengan kabel OM2 ingin 10G. Keputusan tepat…', options: ['Wajib ganti OM4', 'OM2 masih cukup (82 m) — tidak perlu ganti kabel', 'Turun ke 1G', 'Pakai tembaga'], answer: 1, explain: '30 m < 82 m → data bilang cukup; ganti hanya jika perlu.' },
      ],
    },
    {
      id: '7.12',
      title: 'OM3',
      body: `<p><b>OM3</b> (<i>Optical Multimode 3</i>) adalah <b>multimode laser-optimized</b pertama: core 50/125 µm yang dirancang untuk <b>VCSEL 850 nm</b>, jaket <b>aqua</b>. Standar minimum MMF modern.</p>
<h3>Spesifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OM3</th></tr>
<tr><td>Core</td><td>50 / 125 µm (laser-optimized)</td></tr>
<tr><td>Sumber</td><td><b>VCSEL 850 nm</b></td></tr>
<tr><td>1 Gbps</td><td>1000 m</td></tr>
<tr><td>10 Gbps</td><td><b>300 m</b></td></tr>
<tr><td>40/100 Gbps</td><td>100 m</td></tr>
<tr><td>Warna jaket</td><td><b>Aqua</b></td></tr>
</table></div>
<h3>Apa Arti "Laser-Optimized"?</h3>
<p>Profil indeks bias core direkayasa agar <b>banyak mode tiba hampir bersamaan</b> (disebut <i>differential mode delay</i> terkontrol) saat disinari laser VCSEL yang sempit — bukan LED yang melebar. <b>Alasan:</b> cahaya laser yang terfokus + core yang "disetel" = dispersion minimal = jarak jauh.</p>
<h3>Kapan OM3?</h3>
<ul>
<li><b>Default MMF baru</b> untuk data center/kampus (jika tidak langsung OM4).</li>
<li>10G sampai 300 m — mencakup hampir semua kebutuhan dalam gedung.</li>
</ul>
<div class="callout"><div class="t">OM3 vs OM4</div><p style="margin:4px 0 0">Selisih harga OM3–OM4 kecil; selisih performa (300 m vs 550 m @ 10G) lumayan. Untuk instalasi baru yang ingin tenang 10 tahun: <b>langsung OM4</b>. OM3 tetap valid jika budget ketat dan jarak &lt;200 m.</p></div>`,
      terms: [
        ['OM3', 'Multimode laser-optimized: 50/125 µm, VCSEL; 10G = 300 m; jaket aqua.'],
        ['Laser-optimized', 'Profil core direkayasa untuk sumber laser (minim dispersion).'],
        ['VCSEL', 'Laser murah 850 nm untuk MMF jarak pendek.'],
      ],
      scenario: 'Data center baru: kontraktor menawarkan OM3 vs OM4 (selisih 15%). Konsultan menghitung: dengan OM4, 40G nanti mencapai 150 m vs 100 m OM3 — mencakup seluruh hall. Selisih 15% hari ini vs ganti kabel 5 tahun lagi. Keputusan: OM4. Pola pikir TCO lagi.',
      bestPractices: 'Instalasi MMF baru: OM4 default; OM3 jika budget ketat & jarak <200 m. Jangan OM1/OM2.',
      security: 'Dokumentasikan grade OM3 di as-built — 10 tahun lagi engineer berikutnya harus tahu batasnya tanpa menebak.',
      challenge: 'Mengapa OM3 (50 µm) mengalahkan OM1 (62.5 µm) padahal core-nya lebih kecil? Jelaskan 2 faktor.',
      interviewQ: 'Q: "Apa itu laser-optimized fiber?" — A: Serat multimode (OM3/OM4) dengan profil indeks core direkayasa agar mode-mode cahaya tiba hampir bersamaan saat disinari laser VCSEL 850 nm — meminimalkan modal dispersion sehingga 10G mencapai 300 m (OM3) / 550 m (OM4).',
      quiz: [
        { q: 'Jarak OM3 untuk 10 Gbps adalah…', options: ['33 m', '82 m', '300 m', '10 km'], answer: 2, explain: 'Laser-optimized + VCSEL = 300 m.' },
        { q: 'Warna jaket OM3 adalah…', options: ['Kuning', 'Oranye', 'Aqua', 'Merah'], answer: 2, explain: 'Aqua = OM3/OM4; oranye = OM1/OM2; kuning = SM.' },
        { q: '"Laser-optimized" artinya…', options: ['Kabel mengandung laser', 'Profil core direkayasa untuk sumber laser VCSEL (minim dispersion)', 'Hanya untuk laser mahal', 'Tanpa core'], answer: 1, explain: 'Rekayasa profil indeks + cahaya terfokus = jarak jauh.' },
      ],
    },
    {
      id: '7.13',
      title: 'OM4',
      body: `<p><b>OM4</b> adalah <b>multimode terbaik</b> saat ini: laser-optimized seperti OM3 tetapi dengan <b>bandwidth modal lebih tinggi</b> (4700 MHz·km vs 2000) — 10G sampai <b>550 m</b>, jaket <b>aqua</b> (atau magenta/violet untuk OM4+).</p>
<h3>OM3 vs OM4</h3>
<div class="tblwrap"><table>
<tr><th>Kecepatan</th><th>OM3</th><th>OM4</th></tr>
<tr><td>10 Gbps</td><td>300 m</td><td><b>550 m</b></td></tr>
<tr><td>40 Gbps</td><td>100 m</td><td><b>150 m</b></td></tr>
<tr><td>100 Gbps</td><td>100 m</td><td><b>150 m</b></td></tr>
<tr><td>Harga</td><td>Dasar</td><td>Sedikit lebih mahal</td></tr>
</table></div>
<h3>Kapan OM4 Wajib?</h3>
<ul>
<li><b>Data center modern:</b> 40/100G antar-baris rak.</li>
<li><b>Backbone kampus dalam-gedung</b> yang butuh >300 m @ 10G.</li>
<li><b>Instalasi "sekali untuk 15 tahun":</b> selisih harga kecil, ketenangan besar.</li>
</ul>
<div class="callout blue"><div class="t">Ringkasan OM (Hafalkan!)</div><p style="margin:4px 0 0">OM1: 62.5 µm oranye, 10G=33 m (legacy). OM2: 50 µm oranye, 10G=82 m. OM3: 50 µm aqua laser-optimized, 10G=300 m. OM4: 50 µm aqua, 10G=550 m (terbaik). <b>Baru = OM3/OM4. Lama = OM1/OM2 (warisan).</b></p></div>`,
      terms: [
        ['OM4', 'Multimode terbaik: bandwidth modal 4700 MHz·km; 10G = 550 m.'],
        ['Bandwidth modal', 'Kapasitas fiber multimode (MHz·km) — makin tinggi makin jauh/cepat.'],
      ],
      scenario: 'Rumah sakit membangun backbone antar-gedung dalam kompleks (jarak 400 m) untuk 10G dengan rencana 40G. OM3 tidak cukup (300 m). Pilihan: OM4 (550 m ✓) atau OS2. Karena dalam kompleks & budget transceiver SR murah: OM4 menang. Satu tabel jarak menentukan seluruh desain.',
      bestPractices: 'Default MMF baru = OM4. Dokumentasikan grade di as-built — 10 tahun lagi engineer berikutnya berterima kasih.',
      security: 'Investasi OM4 yang terdokumentasi mencegah "upgrade buta" — setiap keputusan berbasis data grade yang tercatat.',
      challenge: 'Buat flashcard: satu kartu per OM (1–4) berisi core, warna, jarak 10G. Hafalkan sampai lancar.',
      interviewQ: 'Q: "Kapan memilih OM4 dibanding OM3?" — A: Saat butuh jarak lebih (550 m vs 300 m @ 10G) atau bersiap 40/100G (150 m vs 100 m): data center modern dan backbone dalam-gedung >300 m. Selisih harga kecil dibanding biaya ganti kabel.',
      quiz: [
        { q: 'Jarak OM4 untuk 10 Gbps adalah…', options: ['300 m', '550 m', '33 m', '10 km'], answer: 1, explain: 'Bandwidth modal 4700 MHz·km = 550 m @ 10G.' },
        { q: 'Urutan OM dari terlama ke terbaru:…', options: ['OM4→OM1', 'OM1→OM2→OM3→OM4', 'OM2→OM1→OM4→OM3', 'Acak'], answer: 1, explain: 'Generasi berurutan: 62.5 µm LED → 50 µm LED → 50 µm laser-optimized.' },
        { q: 'Untuk instalasi MMF baru yang future-proof, pilihan default adalah…', options: ['OM1', 'OM2', 'OM4', 'OS1'], answer: 2, explain: 'OM4 = terbaik saat ini; selisih harga kecil.' },
      ],
    },
    {
      id: '7.14',
      title: 'Fiber Core Count (1/2/4/8/12/24/48/96 Core)',
      body: `<p>Kabel fiber jarang berisi 1 serat — umumnya <b>multi-core</b>: 2, 4, 8, 12, 24, 48, 96, hingga ratusan serat dalam satu kabel. Jumlah core = <b>kapasitas & cadangan</b>.</p>
<h3>Mengapa Perlu Banyak Core?</h3>
<ul>
<li><b>Satu link butuh 2 serat</b> (TX & RX — <i>duplex</i>): 1 core saja tidak cukup untuk komunikasi dua arah normal!</li>
<li><b>Cadangan:</b> serat bisa rusak; tarik kabel baru = mahal. Praktik: <b>pakai 50%, cadangkan 50%</b>.</li>
<li><b>Pertumbuhan:</b> 12 core hari ini = 6 link; besok butuh link ke-7? Sudah tersedia.</li>
<li><b>Topologi:</b> satu kabel bisa bercabang ke beberapa tujuan (via ODF).</li>
</ul>
<h3>Panduan Memilih</h3>
<div class="tblwrap"><table>
<tr><th>Kebutuhan</th><th>Core Count</th><th>Alasan</th></tr>
<tr><td>1 link point-to-point</td><td><b>4 core</b> (min!)</td><td>2 pakai + 2 cadangan</td></tr>
<tr><td>Backbone gedung</td><td>12–24 core</td><td>Beberapa link + cadangan</td></tr>
<tr><td>Backbone kampus/kota</td><td>48–96 core</td><td>Banyak tujuan + growth 10 tahun</td></tr>
</table></div>
<div class="callout"><div class="t">Aturan: Jangan Pasang 2 Core!</div><p style="margin:4px 0 0">Kabel 2 core = tanpa cadangan. Satu serat rusak = tarik ulang. Selisih harga 2→4 core kecil; biaya penarikan ulang besar. <b>Minimum praktis: 4 core</b> untuk link apa pun.</p></div>`,
      terms: [
        ['Core count', 'Jumlah serat dalam satu kabel fiber (2, 4, 12, 24, 48, 96...).'],
        ['Duplex', 'Komunikasi dua arah memakai 2 serat (TX & RX).'],
        ['Dark fiber', 'Serat cadangan yang belum dipakai ("gelap").'],
      ],
      diagram: `<pre>        MENGAPA BUTUH BANYAK CORE?

   Link normal (duplex):
   [A] ──TX──▶── core 1 ──▶──RX── [B]
   [A] ◀──RX──── core 2 ──◀──TX── [B]
   + core 3,4 = CADANGAN (dark fiber)

   Kabel 4 core = 1 link + cadangan. Minimum!</pre>`,
      scenario: 'Kabel 2 core antar-gedung: satu serat putus digigit tikus — link mati total, tidak ada cadangan. Darurat: sewa splicing malam hari + tarik kabel baru 2 minggu. Jika dulu 4 core: pindah ke cadangan dalam 1 jam. Selisih investasi awal: tidak sampai sejuta.',
      bestPractices: 'Minimum 4 core per link; backbone 12+. Dokumentasikan pemakaian tiap core (core 1-2: link A, 3-4: cadangan) di as-built.',
      security: 'Core cadangan (dark fiber) juga aset — dokumentasikan & amankan akses ODF-nya. Serat gelap bisa "dinyalakan" pihak tak berwenang.',
      challenge: 'Rancang: kampus 4 gedung butuh 3 link antar-gedung + cadangan 50%. Berapa core count kabel backbone yang kamu pesan? Tunjukkan hitungannya.',
      interviewQ: 'Q: "Mengapa kabel fiber tidak cukup 1 core?" — A: Satu link duplex butuh 2 serat (TX & RX). Plus cadangan untuk kerusakan & pertumbuhan (praktik 50%). Minimum praktis 4 core per link — selisih harga kecil dibanding biaya tarik ulang.',
      quiz: [
        { q: 'Satu link fiber duplex membutuhkan…', options: ['1 serat', '2 serat (TX & RX)', '4 serat', '12 serat'], answer: 1, explain: 'TX satu arah per serat; dua arah = 2 serat.' },
        { q: 'Minimum core count praktis untuk satu link adalah…', options: ['2', '4 (2 pakai + 2 cadangan)', '1', '96'], answer: 1, explain: 'Tanpa cadangan = satu kerusakan = tarik ulang.' },
        { q: 'Serat cadangan yang belum dipakai disebut…', options: ['Bright fiber', 'Dark fiber', 'Dead fiber', 'Ghost fiber'], answer: 1, explain: 'Dark fiber = "gelap", menunggu dipakai.' },
      ],
    },
    {
      id: '7.15',
      title: 'ODF',
      body: `<p><b>ODF</b> (<i>Optical Distribution Frame</i>) adalah <b>panel/rak terminasi fiber</b> — tempat kabel fiber multi-core <b>di-splice ke pigtail</b> dan diatur menjadi port-port konektor yang rapi. Ia adalah "patch panel"-nya fiber.</p>
<h3>Fungsi</h3>
<ul>
<li><b>Terminasi:</b> kabel outdoor (loose tube, tidak berkonektor) di-splice ke pigtail berkonektor di dalam ODF.</li>
<li><b>Organisasi:</b> puluhan/hingga ratusan core diatur per tray splice + adapter panel depan.</li>
<li><b>Titik patching:</b> teknisi menyambung patch cord dari adapter ODF ke transceiver — tanpa menyentuh splice sensitif.</li>
<li><b>Proteksi:</b> splice tray melindungi sambungan dari debu & tekanan.</li>
</ul>
<h3>Alur di ODF</h3>
<pre>[Kabel 24 core] ─masuk ODF─▶ [Splice tray: 24 splice ke pigtail]
                                              │
                              [Adapter panel depan: 24 port LC]
                                              │
                              [Patch cord] ─▶ [Transceiver switch]</pre>
<div class="callout blue"><div class="t">ODF vs Patch Panel Tembaga</div><p style="margin:4px 0 0">Konsep sama (terminasi terpusat), tetapi ODF <b>tidak bisa di-punch-down</b> — harus <b>splicing</b> (fusion). Karena itu instalasi ODF butuh teknisi bersertifikat fiber, bukan teknisi tembaga biasa.</p></div>`,
      terms: [
        ['ODF', 'Optical Distribution Frame — rak/panel terminasi & distribusi fiber.'],
        ['Splice tray', 'Baki pelindung tempat sambungan splice diatur di ODF.'],
        ['Adapter panel', 'Panel konektor di depan ODF untuk patch cord.'],
      ],
      scenario: 'NOC menerima alarm link down. Teknisi ke ODF: adapter berdebu (konektor tak terpasang tutup) — dibersihkan dengan cleaner khusus, link kembali. 70% gangguan fiber = konektor kotor di ODF, bukan kabel putus. ODF yang tertata + tutup debu = MTTR pendek.',
      bestPractices: 'Selalu pasang dust cap pada adapter tak terpakai. Labeli tiap adapter (tujuan + core). Dokumentasikan peta ODF.',
      security: 'ODF = titik akses fisik ke semua serat — kunci rak ODF dan batasi akses. Penyadap bisa memasang tap di patch cord ODF.',
      challenge: 'Gambar alur kabel dari backbone 24 core hingga ke switch, sebutkan di mana ODF, pigtail, dan patch cord berada.',
      interviewQ: 'Q: "Apa fungsi ODF?" — A: Titik terminasi & distribusi fiber: kabel multi-core di-splice ke pigtail di splice tray, keluar sebagai port konektor di adapter panel untuk di-patch ke transceiver. Melindungi splice sensitif dan menata puluhan core.',
      quiz: [
        { q: 'Di dalam ODF, kabel multi-core dihubungkan ke pigtail dengan cara…', options: ['Punch-down', 'Splicing (fusion)', 'Krimping RJ45', 'Lem'], answer: 1, explain: 'Fiber tidak bisa punch-down/krimping — harus splice.' },
        { q: 'Penyebab umum gangguan di ODF adalah…', options: ['Kabel putus di tanah', 'Konektor/adapter kotor berdebu', 'Petir', 'Virus'], answer: 1, explain: '70% masalah fiber = konektor kotor; bersihkan dulu sebelum vonis lain.' },
        { q: 'Adapter tak terpakai di ODF harus…', options: ['Dibiarkan terbuka', 'Dipasang dust cap (tutup debu)', 'Dipotong', 'Dicat'], answer: 1, explain: 'Debu = musuh #1 konektor fiber.' },
      ],
    },
    {
      id: '7.16',
      title: 'OTB',
      body: `<p><b>OTB</b> (<i>Optical Termination Box</i>) adalah <b>kotak terminasi fiber kecil</b> untuk di dinding/meja — versi mini ODF untuk <b>1–12 core</b>. Dipakai di ujung pelanggan atau ruangan kecil.</p>
<h3>ODF vs OTB</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>ODF</th><th>OTB</th></tr>
<tr><td>Kapasitas</td><td>24–288+ core (rak)</td><td>1–12 core (dinding)</td></tr>
<tr><td>Lokasi</td><td>Ruang server / sentral</td><td>Dinding ruangan / pelanggan</td></tr>
<tr><td>Fungsi</td><td>Distribusi besar</td><td>Terminasi ujung</td></tr>
</table></div>
<h3>Pemakaian Umum</h3>
<ul>
<li><b>FTTH:</b> OTB di dinding rumah pelanggan — fiber dari jalan di-splice, keluar patch cord ke ONT/modem.</li>
<li><b>Ruangan kecil:</b> 1–2 link fiber di-terminasi rapi tanpa butuh rak ODF.</li>
<li><b>Titik transisi:</b> outdoor ke indoor (kabel tanah masuk gedung → OTB → patch ke indoor).</li>
</ul>
<div class="callout"><div class="t">Praktis Lapangan</div><p style="margin:4px 0 0">Saat instalasi FTTH, teknisi membawa OTB + fusion splicer portable: splice di tempat, tutup box, selesai dalam 1 jam. OTB membuat fiber "sampai ke dinding rumah" dengan rapi dan aman.</p></div>`,
      terms: [
        ['OTB', 'Optical Termination Box — kotak terminasi fiber kecil (1–12 core) di dinding.'],
        ['FTTH', 'Fiber To The Home — fiber sampai ke rumah pelanggan.'],
        ['ONT', 'Optical Network Terminal — modem fiber di pelanggan.'],
      ],
      scenario: 'Pelanggan korporat butuh 2 link fiber ke ruang server kecilnya (tanpa rak). Solusi: OTB 4-port di dinding — rapi, murah, tidak butuh rak 19-inch. Tepat guna: ODF akan berlebihan (overkill).',
      bestPractices: 'Pilih OTB vs ODF berdasarkan skala: ≤12 core & dinding = OTB; lebih = ODF. Jangan overkill.',
      security: 'OTB di area publik harus terkunci — kotak terbuka = akses fisik ke serat.',
      challenge: 'Untuk kantor cabang kecil (2 link fiber), rancang: ODF atau OTB? Di mana diletakkan? Tulis alasannya.',
      interviewQ: 'Q: "Apa beda ODF dan OTB?" — A: Keduanya titik terminasi fiber. ODF = besar (rak, 24+ core) untuk distribusi sentral. OTB = kecil (kotak dinding, 1–12 core) untuk ujung/pelanggan. Pilih berdasarkan skala kebutuhan.',
      quiz: [
        { q: 'OTB cocok untuk…', options: ['Data center 500 core', 'Terminasi kecil 1–12 core di dinding (FTTH/ruangan kecil)', 'Kabel bawah laut', 'Satelit'], answer: 1, explain: 'OTB = mini ODF untuk ujung.' },
        { q: 'Dalam instalasi FTTH, OTB dipasang di…', options: ['Dasar laut', 'Dinding rumah pelanggan', 'Satelit', 'Menara BTS saja'], answer: 1, explain: 'Titik terminasi di premises pelanggan → patch ke ONT.' },
        { q: 'Kriteria memilih OTB vs ODF adalah…', options: ['Warna', 'Skala: ≤12 core dinding = OTB; lebih besar = ODF', 'Harga kabel', 'Merek'], answer: 1, explain: 'Tepat guna — jangan overkill ODF untuk 2 link.' },
      ],
    },
    {
      id: '7.17',
      title: 'Fiber Patch Cord',
      body: `<p><b>Fiber patch cord</b> adalah kabel fiber <b>pendek fleksibel berkonektor di kedua ujung</b> — penghubung ODF ke transceiver (atau antar-perangkat). Padanan patch cord tembaga, tetapi untuk cahaya.</p>
<h3>Membaca Spesifikasi Patch Cord</h3>
<pre>Contoh label: "LC-LC Duplex OS2 9/125 2m Yellow"
               │    │      │    │       │   └─ warna jaket
               │    │      │    │       └─ panjang
               │    │      │    └─ core/cladding
               │    │      └─ jenis fiber (OS2 = single mode!)
               │    └─ duplex (2 serat: TX+RX)
               └─ konektor kedua ujung (LC ke LC)</pre>
<h3>Kode Warna Jaket (Hafalkan!)</h3>
<div class="tblwrap"><table>
<tr><th>Warna</th><th>Jenis Fiber</th></tr>
<tr><td><b>Kuning</b></td><td>Single mode (OS1/OS2)</td></tr>
<tr><td><b>Aqua</b></td><td>Multimode OM3/OM4</td></tr>
<tr><td><b>Oranye</b></td><td>Multimode OM1/OM2 (lama)</td></tr>
<tr><td><b>Magenta/Violet</b></td><td>OM4+ / wideband</td></tr>
</table></div>
<h3>Aturan Pemakaian</h3>
<ul>
<li><b>Samakan jenis:</b> patch cord OS2 untuk link SMF; OM4 untuk link MMF — <b>jangan campur</b> (7.3)!</li>
<li><b>Simplex vs duplex:</b> simplex = 1 serat (untuk BiDi); duplex = 2 serat (normal TX/RX).</li>
<li><b>UPC vs APC:</b> konektor <b>hijau</b> = APC (miring 8°, untuk FTTH/PON) — <b>jangan colok APC ke UPC</b> (rusak & loss tinggi)! Biru = UPC standar.</li>
<li><b>Jangan tekuk tajam:</b> pakai bend-insensitive patch cord di rak padat.</li>
</ul>
<div class="callout"><div class="t">Jebakan Klasik: Campur Patch Cord</div><p style="margin:4px 0 0">Link SMF dipasang patch cord OM4 oranye "karena yang ada itu" → tidak nyala. Atau konektor hijau (APC) dipaksa ke biru (UPC) → ferrule rusak permanen. <b>Selalu baca label & warna sebelum colok.</b></p></div>`,
      terms: [
        ['Fiber patch cord', 'Kabel fiber pendek berkonektor dua ujung; ODF ↔ transceiver.'],
        ['Simplex/duplex', '1 serat / 2 serat (TX+RX).'],
        ['UPC/APC', 'Ujung konektor: UPC biru (datar), APC hijau (miring 8°) — jangan campur!'],
      ],
      scenario: 'Migrasi data center: teknisi mencolok patch cord APC (hijau) ke transceiver UPC (biru) karena "bentuknya sama LC". Hasil: loss 5 dB + ferrule tergores — transceiver 15 juta rusak. 30 detik tidak membaca warna = kerugian besar.',
      bestPractices: 'Stok patch cord per jenis & panjang; labeli; JANGAN campur SMF/MMF atau UPC/APC. "Yang penting nyolok" bukan SOP.',
      security: 'Stok patch cord tak berlabel mengundang salah colok (SMF ke MMF) yang bisa disalahartikan sebagai serangan — labeli dan kunci stok cadangan.',
      challenge: 'Uraikan label: "SC-LC Duplex OM4 50/125 3m Aqua". Apa arti tiap bagiannya?',
      interviewQ: 'Q: "Bagaimana memilih fiber patch cord yang benar?" — A: Samakan 4 hal: (1) jenis fiber dengan link (OS2 untuk SMF, OM4 untuk MMF); (2) konektor sesuai perangkat (LC/SC); (3) duplex untuk TX/RX normal; (4) polish sesuai (UPC biru vs APC hijau — jangan campur). Baca label & warna jaket.',
      quiz: [
        { q: 'Patch cord kuning menandakan…', options: ['Multimode OM4', 'Single mode (OS1/OS2)', 'Kabel rusak', 'Khusus outdoor'], answer: 1, explain: 'Kuning = SM; aqua = OM3/4; oranye = OM1/2.' },
        { q: 'Mencolok konektor APC (hijau) ke port UPC (biru) berakibat…', options: ['Normal', 'Loss tinggi + ferrule bisa rusak permanen', 'Lebih cepat', 'Otomatis menyesuaikan'], answer: 1, explain: 'Sudut 8° vs datar tidak kompatibel — jangan dipaksa.' },
        { q: 'Patch cord duplex artinya…', options: ['Dua kali lebih cepat', '2 serat: satu TX satu RX', 'Dua warna', 'Untuk 2 gedung'], answer: 1, explain: 'Duplex = sepasang serat untuk komunikasi dua arah.' },
      ],
    },
    {
      id: '7.18',
      title: 'Pigtail',
      body: `<p><b>Pigtail</b> adalah <b>serat pendek berkonektor di SATU ujung</b> saja — ujung lainnya serat telanjang untuk <b>di-splice</b> ke kabel utama. Ia adalah "jembatan" antara dunia splice dan dunia konektor.</p>
<h3>Pigtail vs Patch Cord</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Pigtail</th><th>Patch Cord</th></tr>
<tr><td>Konektor</td><td><b>Satu ujung</b></td><td>Kedua ujung</td></tr>
<tr><td>Ujung lain</td><td>Serat telanjang → <b>di-splice</b></td><td>Konektor → langsung colok</td></tr>
<tr><td>Pemakaian</td><td>Terminasi di <b>ODF/OTB</b></td><td>ODF → transceiver</td></tr>
</table></div>
<h3>Alur di ODF</h3>
<pre>[Kabel 12 core] ──fusion splice── [12 pigtail] ──konektor──▶ [Adapter ODF]
   (tanpa konektor)    (di splice tray)   (satu ujung)      (siap di-patch)</pre>
<p><b>Mengapa tidak langsung konektor di lapangan?</b> Memasang konektor fiber di lapangan (field termination) sulit mencapai kualitas pabrik. Pigtail dibuat <b>di pabrik</b> dengan presisi sempurna — teknisi lapangan hanya perlu <b>splice</b> (yang hasilnya terukur & konsisten) daripada merakit konektor manual.</p>`,
      terms: [
        ['Pigtail', 'Serat pendek berkonektor satu ujung; ujung lain di-splice ke kabel.'],
      ],
      scenario: 'Instalasi 48 core: teknisi memakai pigtail pabrikan + fusion splice — semua splice <0.05 dB, selesai 1 hari. Rekannya mencoba field-connector manual — loss bervariasi 0.3–1.0 dB, 3 hari, beberapa harus diulang. Kualitas pabrik + splice mengalahkan kerajinan lapangan.',
      bestPractices: 'Untuk terminasi >4 core: selalu pigtail + fusion splice. Field connector hanya untuk darurat/1–2 core.',
      security: 'Pigtail cadangan tak terdokumentasi di ODF bisa dipakai pihak tak berwenang untuk menyadap — catat semua pigtail terpasang di peta ODF.',
      challenge: 'Jelaskan mengapa pigtail + splice lebih baik dari field connector untuk instalasi 24 core.',
      interviewQ: 'Q: "Apa itu pigtail dan mengapa dipakai di ODF?" — A: Serat pendek berkonektor satu ujung; ujung telanjangnya di-splice ke kabel multi-core di ODF. Dipakai karena konektor pabrikan presisinya jauh lebih baik dari rakitan lapangan — teknisi hanya melakukan splice yang hasilnya konsisten.',
      quiz: [
        { q: 'Pigtail berbeda dari patch cord karena…', options: ['Lebih panjang', 'Berkonektor satu ujung; ujung lain di-splice', 'Tanpa serat', 'Untuk tembaga'], answer: 1, explain: 'Pigtail = jembatan splice ↔ konektor.' },
        { q: 'Keunggulan pigtail pabrikan atas field connector adalah…', options: ['Lebih murah selalu', 'Presisi pabrik — loss konsisten rendah', 'Bisa dipasang tanpa alat', 'Tanpa splice'], answer: 1, explain: 'Konektor pabrik dirakit di lingkungan terkontrol.' },
        { q: 'Pigtail umumnya dipakai di…', options: ['Antar-switch langsung', 'Terminasi ODF/OTB (splice ke kabel utama)', 'Kabel listrik', 'Antena'], answer: 1, explain: 'Dunia splice (kabel) bertemu dunia konektor (patch).' },
      ],
    },
    {
      id: '7.19',
      title: 'Splicing',
      body: `<p><b>Splicing</b> adalah <b>penyambungan permanen dua serat optik</b> — seperti "menyambung kabel", tetapi untuk cahaya dengan presisi mikron. Ada dua metode:</p>
<h3>Fusion vs Mechanical</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Fusion Splicing</th><th>Mechanical Splicing</th></tr>
<tr><td>Cara</td><td><b>Lelehan listrik</b> (arc) menyatu kaca</td><td>Serat dijepit sejajar + gel index-matching</td></tr>
<tr><td>Loss tipikal</td><td><b>&lt;0.05 dB</b> (sangat rendah)</td><td>0.1–0.3 dB</td></tr>
<tr><td>Kekuatan</td><td>Kuat (seperti serat utuh)</td><td>Lemah (butuh proteksi ekstra)</td></tr>
<tr><td>Alat</td><td>Fusion splicer (mahal)</td><td>Murah</td></tr>
<tr><td>Pemakaian</td><td><b>Standar backbone/profesional</b></td><td>Darurat / sementara</td></tr>
</table></div>
<h3>Langkah Fusion Splicing</h3>
<pre>1. STRIP   : kupas coating (±3 cm) dengan stripper presisi
2. CLEAN   : bersihkan dengan alkohol + lap bebas serat
3. CLEAVE  : potong TEGAK LURUS dengan cleaver (sudut <1°!)
4. FUSE    : masukkan ke splicer → arc listrik melelehkan → menyatu
5. PROTECT : pasang heat-shrink sleeve + panaskan
6. TEST    : splicer menampilkan estimasi loss (harus <0.1 dB)</pre>
<p><b>80% kualitas ditentukan langkah 1–3</b> (persiapan!) — cleave yang miring 2° saja bisa menaikkan loss berkali lipat. Splicer hanya melelehkan; ia tidak bisa memperbaiki persiapan yang buruk.</p>`,
      terms: [
        ['Splicing', 'Penyambungan permanen dua serat optik.'],
        ['Fusion splicing', 'Sambung dengan lelehan arc listrik; loss <0.05 dB; standar profesional.'],
        ['Mechanical splicing', 'Sambung jepit + gel; loss lebih tinggi; untuk darurat.'],
        ['Cleave', 'Pemotongan serat tegak lurus presisi sebelum splice.'],
      ],
      diagram: `<pre>        FUSION SPLICING (6 langkah)

   [strip] → [clean] → [cleave 90°] → [FUSE: arc!]
                                                   │
                          ┌── heat-shrink ─────────┘
                          ▼
                   serat menyatu, loss <0.05 dB ✓

   Kunci: 80% kualitas = persiapan (strip/clean/cleave).</pre>`,
      scenario: 'Teknisi buru-buru: cleave miring, tidak dibersihkan — hasil splice 0.5 dB × 20 splice = 10 dB hilang sia-sia, link tidak nyala. Ulangi 20 splice dengan persiapan benar: total 0.8 dB, link nyala. 2 jam "hemat" persiapan = 1 hari mengulang.',
      bestPractices: 'Jangan pernah skip clean & inspeksi cleave (splicer menampilkan sudutnya). Target: <0.1 dB per splice, ideal <0.05 dB.',
      security: 'Splice yang buruk (loss tinggi) melemahkan link dan bisa disalahartikan sebagai DoS — target <0.1 dB dan dokumentasikan hasil tiap splice.',
      challenge: 'Urutkan 6 langkah fusion splicing dari ingatan. Langkah mana yang paling menentukan kualitas? Mengapa?',
      interviewQ: 'Q: "Jelaskan perbedaan fusion dan mechanical splicing." — A: Fusion: lelehan arc listrik menyatukan kaca — loss <0.05 dB, kuat, standar profesional (butuh splicer mahal). Mechanical: dijepit sejajar + gel — loss 0.1–0.3 dB, lemah, untuk darurat/sementara. Kualitas fusion 80% ditentukan persiapan (strip, clean, cleave).',
      quiz: [
        { q: 'Loss tipikal fusion splicing yang baik adalah…', options: ['1.0 dB', '<0.05 dB', '3 dB', '10 dB'], answer: 1, explain: 'Fusion yang baik hampir seperti serat utuh.' },
        { q: 'Faktor terpenting kualitas splice adalah…', options: ['Merek splicer', 'Persiapan: strip, clean, cleave yang sempurna', 'Kecepatan', 'Suhu ruangan'], answer: 1, explain: '80% kualitas = persiapan; splicer tak bisa perbaiki cleave miring.' },
        { q: 'Mechanical splicing dipakai untuk…', options: ['Backbone utama', 'Darurat/sementara (loss lebih tinggi)', 'Kabel tembaga', 'Selamanya'], answer: 1, explain: 'Cepat & murah tapi loss 0.1–0.3 dB dan lemah.' },
      ],
    },
    {
      id: '7.20',
      title: 'Fusion Splicer',
      body: `<p><b>Fusion splicer</b> adalah alat yang <b>menyelaraskan dua serat (presisi mikron) lalu melelehkannya</b> dengan busur listrik — "mesin jahit" fiber optik. Harganya puluhan hingga ratusan juta rupiah.</p>
<h3>Cara Kerja</h3>
<pre>1. ALIGN   : kamera + motor mikro menyelaraskan core (lihat di layar!)
2. ARC     : elektroda melepas busur listrik (~2000°C, 1–2 detik)
3. FUSE    : kaca meleleh & menyatu
4. ESTIMATE: alat mengukur & menampilkan estimasi loss (dB)
5. (Otomatis: uji tarik ringan untuk kekuatan)</pre>
<h3>Jenis Splicer</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Metode Align</th><th>Akurasi</th><th>Pemakaian</th></tr>
<tr><td><b>Core alignment</b></td><td>Kamera melihat core langsung</td><td>Tertinggi</td><td>Backbone, SMF</td></tr>
<tr><td>Cladding alignment</td><td>Selaraskan cladding luar</td><td>Cukup</td><td>MMF, budget</td></tr>
</table></div>
<h3>Perawatan (Sering Diabaikan!)</h3>
<ul>
<li><b>Elektroda aus</b> → arc lemah → splice buruk. Ganti berkala (ribuan arc).</li>
<li><b>Cermin/kamera kotor</b> → alignment gagal. Bersihkan rutin.</li>
<li><b>Kalibrasi arc</b> berkala sesuai ketinggian/suhu (udara memengaruhi busur!).</li>
</ul>
<div class="callout blue"><div class="t">Sewa vs Beli</div><p style="margin:4px 0 0">Splicer core-alignment bisa Rp 100 jt+. Untuk proyek sesekali: <b>sewa</b> (harian) atau pakai jasa splicing. Beli jika tim fiber aktif mingguan. Hitung break-even dengan jujur.</p></div>`,
      terms: [
        ['Fusion splicer', 'Alat penyambung serat: align presisi + lelehan arc listrik.'],
        ['Core alignment', 'Penyelarasan berdasar core (kamera) — akurasi tertinggi.'],
        ['Elektroda', 'Pembangkit busur listrik; aus dan harus diganti berkala.'],
      ],
      scenario: 'Splice loss tiba-tiba memburuk di semua titik (0.3 dB). Teknisi menyalahkan serat — ternyata elektroda sudah 5000 arc tanpa diganti. Ganti elektroda 10 menit: loss kembali <0.05 dB. Perawatan alat = kualitas hasil.',
      bestPractices: 'Catat jumlah arc elektroda; bersihkan kamera/mirror tiap hari pakai; kalibrasi arc saat pindah lokasi (ketinggian!).',
      security: 'Splicer adalah aset mahal dan alat potensial penyadapan (bisa dipakai memasang tap) — amankan akses fisiknya seperti perangkat jaringan.',
      challenge: 'Jika proyek butuh 200 splice dalam 2 hari: sewa atau beli splicer? Hitung kasar break-even-nya.',
      interviewQ: 'Q: "Bagaimana fusion splicer bekerja?" — A: (1) Kamera + motor mikro menyelaraskan core dua serat presisi mikron; (2) elektroda melepas busur listrik melelehkan kaca; (3) serat menyatu; (4) alat menampilkan estimasi loss. Tipe core-alignment paling akurat untuk SMF/backbone.',
      quiz: [
        { q: 'Fusion splicer menyambung serat dengan…', options: ['Lem', 'Busur listrik yang melelehkan kaca setelah alignment presisi', 'Jepitan', 'Lilitan'], answer: 1, explain: 'Align (kamera+motor) → arc (~2000°C) → fuse.' },
        { q: 'Tipe splicer paling akurat untuk single mode adalah…', options: ['Cladding alignment', 'Core alignment (kamera melihat core langsung)', 'Manual', 'Tanpa alignment'], answer: 1, explain: 'Core alignment = presisi tertinggi untuk SMF.' },
        { q: 'Elektroda splicer yang aus menyebabkan…', options: ['Lebih cepat', 'Arc lemah → splice loss memburuk', 'Tidak masalah', 'Hemat listrik'], answer: 1, explain: 'Ganti elektroda berkala (per ribuan arc).' },
      ],
    },
    {
      id: '7.21',
      title: 'Fiber Connector (LC, SC, ST)',
      body: `<p>Konektor fiber adalah <b>ujung presisi</b> yang mempertemukan dua serat dengan akurasi mikron. Tiga tipe dominan — <b>hafalkan bentuk & pemakaiannya</b>:</p>
<h3>Tiga Konektor Utama</h3>
<div class="tblwrap"><table>
<tr><th>Konektor</th><th>Ciri</th><th>Ukuran</th><th>Pemakaian</th></tr>
<tr><td><b>LC</b> (<i>Lucent</i>)</td><td>Kecil, klip seperti RJ45</td><td>1.25 mm ferrule</td><td><b>Transceiver SFP/SFP+ (standar modern)</b></td></tr>
<tr><td><b>SC</b> (<i>Subscriber</i>)</td><td>Kotak, push-pull</td><td>2.5 mm ferrule</td><td>ODF lama, FTTH, media converter</td></tr>
<tr><td><b>ST</b> (<i>Straight Tip</i>)</td><td>Bulat, <b>bayonet (putar-kunci)</b></td><td>2.5 mm ferrule</td><td>Legacy (1990-an), masih di beberapa site lama</td></tr>
</table></div>
<h3>UPC vs APC (Penting!)</h3>
<pre>UPC (biru):  ujung DATAR ────▌   standar umum
APC (hijau): ujung MIRING 8° ───╱▌  FTTH/PON (memantulkan balik minimal)
             ⚠ JANGAN campur! (7.17)</pre>
<p><b>Mengapa APC miring?</b> Pantulan cahaya kembali (<i>back reflection</i>) mengganggu laser — ujung miring memantulkan cahaya <b>ke cladding</b> (dibuang), bukan kembali ke laser. Rugi sedikit loss, untung besar stabilitas.</p>
<h3>Aturan Kebersihan (Hukum #1 Fiber)</h3>
<ol>
<li><b>Selalu inspect</b> sebelum colok (mikroskop fiber).</li>
<li><b>Bersihkan</b> dengan cleaner khusus (one-click cleaner / kaset).</li>
<li><b>Jangan sentuh</b> ujung ferrule dengan jari.</li>
<li><b>Pasang dust cap</b> saat tidak dipakai.</li>
</ol>
<div class="callout"><div class="t">80% Masalah = Kotor</div><p style="margin:4px 0 0">Statistik lapangan: mayoritas gangguan fiber <b>bukan</b> kabel putus, melainkan <b>konektor kotor</b>. Prosedur "inspect-clean-connect" menyelesaikan lebih banyak tiket daripada OTDR.</p></div>`,
      terms: [
        ['LC/SC/ST', 'Tipe konektor fiber: LC kecil (transceiver), SC kotak (ODF/FTTH), ST bayonet (legacy).'],
        ['Ferrule', 'Silinder keramik presisi yang memegang ujung serat di konektor.'],
        ['UPC/APC', 'Polish ujung: datar (biru) vs miring 8° (hijau, anti back-reflection).'],
        ['Back reflection', 'Cahaya yang memantul kembali ke laser — diatasi polish APC.'],
      ],
      diagram: `<pre>      TIGA KONEKTOR (hafalkan bentuk!)

   LC:  [▭] kecil, klip RJ45  → SFP/SFP+ (modern)
   SC:  [▭▭] kotak push-pull  → ODF, FTTH
   ST:  (○) bulat bayonet     → legacy

   Warna: BIRU = UPC (datar) · HIJAU = APC (miring 8°)</pre>`,
      scenario: 'Link 10G baru tidak nyala. OTDR: kabel bagus. Splicing: bagus. Ternyata konektor LC di transceiver kotor (debu dari kantong tanpa cap). Satu klik cleaner: link nyala. 3 jam troubleshooting vs 10 detik pembersihan — urutan "inspect dulu" menghemat segalanya.',
      bestPractices: 'SOP wajib: inspect → clean → connect. Setiap kali. Tanpa kecuali. Sediakan one-click cleaner di setiap tas teknisi.',
      security: 'Konektor tak bertutup di area publik = titik penyadapan potensial — pasang dust cap dan kunci ODF/rak.',
      challenge: 'Lihat konektor fiber di sekitarmu (atau gambar): identifikasi tipenya (LC/SC/ST) dan polish-nya (biru/hijau). Cocok dengan perangkatnya?',
      interviewQ: 'Q: "Sebutkan 3 konektor fiber dan pemakaiannya." — A: LC (kecil 1.25 mm, klip seperti RJ45 — standar transceiver SFP/SFP+ modern), SC (kotak push-pull 2.5 mm — ODF lama & FTTH), ST (bulat bayonet — legacy). Plus: biru = UPC datar, hijau = APC miring 8° (jangan campur).',
      quiz: [
        { q: 'Konektor standar untuk transceiver SFP/SFP+ modern adalah…', options: ['ST', 'SC', 'LC', 'RJ45'], answer: 2, explain: 'LC kecil (1.25 mm) = standar transceiver modern.' },
        { q: 'Konektor hijau (APC) memiliki ujung…', options: ['Datar', 'Miring 8° untuk meminimalkan back reflection', 'Bulat', 'Berlubang'], answer: 1, explain: 'Miring = pantulan dibuang ke cladding, bukan ke laser.' },
        { q: 'Penyebab #1 gangguan fiber di lapangan adalah…', options: ['Kabel putus', 'Konektor kotor', 'Petir', 'Salah wavelength'], answer: 1, explain: 'Inspect-clean-connect menyelesaikan mayoritas tiket fiber.' },
      ],
    },
    {
      id: '7.22',
      title: 'SFP',
      body: `<p><b>SFP</b> (<i>Small Form-factor Pluggable</i>) adalah <b>modul transceiver hot-swappable</b> — "converter" kecil yang mengubah <b>sinyal listrik ↔ cahaya</b>. Dicolok ke port switch/router, bukan disolder.</p>
<h3>Anatomi & Fungsi</h3>
<pre>        ┌─────────────┐
        │    SFP      │◀── colok ke port switch (listrik)
        │  ┌───────┐  │
        │  │ LASER │──┼──▶ cahaya ke fiber TX
        │  │   +   │  │
        │  │RECEIVER│◀─┼── cahaya dari fiber RX
        │  └───────┘  │
        └──────┬──────┘
               │ LC duplex
               ▼
           [Fiber patch cord]</pre>
<h3>Spesifikasi SFP (1 Gbps)</h3>
<div class="tblwrap"><table>
<tr><th>Varian</th><th>Media</th><th>Jarak</th><th>Kode</th></tr>
<tr><td>1000BASE-T</td><td>Tembaga RJ45</td><td>100 m</td><td>T</td></tr>
<tr><td>1000BASE-SX</td><td>MMF 850 nm</td><td>550 m</td><td>SX = short</td></tr>
<tr><td>1000BASE-LX</td><td>SMF 1310 nm</td><td>10 km</td><td>LX = long</td></tr>
<tr><td>1000BASE-EX/ZX</td><td>SMF 1550 nm</td><td>40–80 km</td><td>Extended</td></tr>
<tr><td>BiDi</td><td>SMF 1 serat</td><td>10–20 km</td><td>TX/RX beda wavelength</td></tr>
</table></div>
<p><b>Membaca kode:</b> SX = short (MMF), LX = long (SMF 10 km), EX/ZX = extended (puluhan km). <b>BiDi</b> (<i>bidirectional</i>): TX & RX dalam <b>1 serat</b> memakai wavelength berbeda (mis. 1310/1490 nm) — hemat 50% serat! Syarat: <b>pasangan</b> (A: TX1310/RX1490 ↔ B: TX1490/RX1310).</p>
<div class="callout blue"><div class="t">Cocokkan Tiga Hal!</div><p style="margin:4px 0 0">SFP harus cocok: <b>(1)</b> dengan fiber (SX↔MMF, LX↔SMF), <b>(2)</b> antar-ujung (LX↔LX, BiDi A↔B), <b>(3)</b> dengan switch (kompatibilitas vendor/coding). Salah satu = tidak nyala.</p></div>`,
      terms: [
        ['SFP', 'Small Form-factor Pluggable — transceiver 1G hot-swappable (listrik ↔ cahaya).'],
        ['Transceiver', 'Transmitter + receiver — mengubah sinyal listrik ke cahaya dan sebaliknya.'],
        ['SX/LX/EX', 'Kode jarak SFP: short (MMF), long 10 km (SMF), extended 40–80 km.'],
        ['BiDi', 'Bidirectional — 1 serat untuk TX+RX via wavelength berbeda (pasangan A/B).'],
        ['Hot-swappable', 'Bisa dicabut-pasang tanpa mematikan perangkat.'],
      ],
      scenario: 'Dua gedung 8 km: dibeli SFP LX 10 km (SMF) — cocok dengan OS2 yang terpasang. Jika salah beli SX (MMF): tidak nyala sama sekali (beda media & jarak). Jika beli EX 40 km: nyala tapi boros 3x harga. Tepat guna = baca jarak & fiber dulu.',
      bestPractices: 'Beli SFP sesuai: jarak aktual + margin, jenis fiber, dan coding kompatibel switch. Simpan stok 1–2 cadangan per tipe kritis.',
      security: 'SFP third-party tanpa verifikasi bisa mengandung firmware jahat (supply-chain) — beli dari sumber tepercaya dan verifikasi DDM-nya normal.',
      challenge: 'Untuk link 500 m MMF OM4: pilih SX atau LX? Untuk 15 km SMF dengan hanya 1 core tersisa?',
      interviewQ: 'Q: "Apa itu SFP dan bagaimana memilihnya?" — A: Modul transceiver hot-swappable pengubah listrik↔cahaya. Pilih dengan mencocokkan: (1) media & jarak (SX=MMF pendek, LX=SMF 10 km, EX=40 km+), (2) pasangan ujung sama (atau BiDi A↔B), (3) kompatibilitas/coding dengan switch.',
      quiz: [
        { q: 'Fungsi SFP adalah…', options: ['Penguat sinyal', 'Mengubah sinyal listrik ↔ cahaya (transceiver hot-swappable)', 'Router mini', 'Konektor kabel'], answer: 1, explain: 'Transmitter + receiver dalam modul colok.' },
        { q: 'Untuk link 8 km single mode, SFP yang tepat adalah…', options: ['SX (MMF)', 'LX (SMF 10 km)', 'T (tembaga)', 'BiDi tanpa pasangan'], answer: 1, explain: 'LX = long 10 km SMF; SX hanya MMF pendek.' },
        { q: 'Keunggulan SFP BiDi adalah…', options: ['Lebih cepat', 'Hemat 50% serat: 1 serat untuk TX+RX via wavelength berbeda', 'Tanpa laser', 'Untuk tembaga'], answer: 1, explain: 'Syarat: pasangan A/B dengan wavelength silang.' },
      ],
    },
    {
      id: '7.23',
      title: 'SFP+',
      body: `<p><b>SFP+</b> adalah penerus SFP untuk <b>10 Gbps</b> — <b>bentuk fisik SAMA</b> dengan SFP (bisa masuk ke port SFP+), tetapi elektroniknya untuk 10G. <b>Jangan tertukar!</b></p>
<h3>SFP vs SFP+</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>SFP</th><th>SFP+</th></tr>
<tr><td>Kecepatan</td><td><b>1 Gbps</b></td><td><b>10 Gbps</b></td></tr>
<tr><td>Bentuk fisik</td><td colspan="2"><b>SAMA</b> (kompatibel slot)</td></tr>
<tr><td>Bisa campur?</td><td colspan="2"><b>Tidak sembarang!</b> SFP di port SFP+ kadang bisa (1G), SFP+ di port SFP <b>tidak bisa</b></td></tr>
<tr><td>Varian</td><td>SX/LX/EX/T</td><td><b>SR/LR/ER</b>/T</td></tr>
</table></div>
<h3>Varian SFP+ (10G)</h3>
<div class="tblwrap"><table>
<tr><th>Varian</th><th>Media</th><th>Jarak</th></tr>
<tr><td><b>SR</b> (Short Range)</td><td>MMF OM3/OM4 850 nm</td><td>300 m / 400 m</td></tr>
<tr><td><b>LR</b> (Long Range)</td><td>SMF 1310 nm</td><td>10 km</td></tr>
<tr><td><b>ER</b> (Extended Range)</td><td>SMF 1550 nm</td><td>40 km</td></tr>
<tr><td><b>T</b></td><td>Cat6A RJ45</td><td>30 m (boros daya!)</td></tr>
<tr><td><b>DAC</b></td><td>Kabel tembaga langsung</td><td>1–5 m (antar-rak, murah!)</td></tr>
</table></div>
<p><b>DAC</b> (<i>Direct Attach Copper</i>): kabel SFP+ ke SFP+ <b>tanpa fiber & tanpa transceiver optik</b> — murah untuk antar-rak <5 m. <b>SFP+ T</b> (RJ45): nyaman tapi <b>boros daya & panas</b> (±2.5W vs 1W) — batasi jumlahnya per switch!</p>
<div class="callout"><div class="t">Jebakan Kompatibilitas</div><p style="margin:4px 0 0">SFP+ <b>coding vendor</b>: banyak switch hanya menerima SFP+ "bermerek" sesuai (atau perlu perintah <code>service unsupported-transceiver</code>). Selalu konfirmasi kompatibilitas SEBELUM beli — SFP+ third-party yang bagus jauh lebih murah.</p></div>`,
      terms: [
        ['SFP+', 'Penerus SFP untuk 10 Gbps; fisik sama dengan SFP.'],
        ['SR/LR/ER', 'Varian 10G: short (MMF), long 10 km (SMF), extended 40 km.'],
        ['DAC', 'Direct Attach Copper — kabel SFP+ langsung tanpa optik (murah, <5 m).'],
        ['Coding vendor', 'Firmware identitas di SFP; switch bisa menolak yang tidak dikenal.'],
      ],
      scenario: 'Upgrade 10G antar-rak (3 m): pilihan SFP+ SR + OM4 (mahal) vs DAC (murah 80%). Jarak 3 m = DAC menang telak. Tapi untuk uplink 300 m ke gedung sebelah: DAC mustahil → SR + OM4. Jarak menentukan teknologi — lagi dan lagi.',
      bestPractices: '<5 m antar-rak = DAC. >5 m = fiber + SR/LR. SFP+ T (RJ45) hanya jika terpaksa (panas & boros daya). Selalu cek coding kompatibel.',
      security: 'Keterbatasan daya SFP+ T bisa dipakai untuk DoS termal (memanaskan switch) — batasi jumlahnya dan monitor suhu.',
      challenge: 'Rancang konektivitas 10G: 8 link antar-rak (2 m), 2 uplink gedung (400 m MMF), 1 link kota (12 km SMF). Pilih transceiver/kabel tiap link + perkiraan alasan.',
      interviewQ: 'Q: "Apa beda SFP dan SFP+? Bisakah dicampur?" — A: Fisik sama, kecepatan beda (1G vs 10G). SFP di port SFP+ kadang bisa turun ke 1G (tergantung switch), tapi SFP+ di port SFP tidak bisa. Varian 10G: SR (MMF), LR (10 km SMF), ER (40 km), DAC (<5 m tembaga), T (RJ45, boros daya).',
      quiz: [
        { q: 'Perbedaan utama SFP dan SFP+ adalah…', options: ['Bentuk fisik', 'Kecepatan: 1 Gbps vs 10 Gbps (fisik sama)', 'Warna', 'Jumlah pin'], answer: 1, explain: 'Fisik kompatibel slot; elektronik 10x.' },
        { q: 'Untuk koneksi 10G antar-rak sejauh 3 m, pilihan paling ekonomis adalah…', options: ['SFP+ LR + OS2', 'DAC (Direct Attach Copper)', 'SFP+ ER', 'Kabel UTP Cat5e'], answer: 1, explain: 'DAC: tanpa optik, murah, untuk <5 m.' },
        { q: 'Kelemahan SFP+ T (RJ45 10G) adalah…', options: ['Terlalu murah', 'Boros daya & panas (±2.5W) — batasi per switch', 'Tidak ada', 'Terlalu kecil'], answer: 1, explain: '10GBASE-T haus daya; fiber SFP+ lebih efisien.' },
      ],
    },
    {
      id: '7.24',
      title: 'QSFP',
      body: `<p><b>QSFP</b> (<i>Quad Small Form-factor Pluggable</i>) adalah transceiver untuk <b>40/100 Gbps ke atas</b> — "Q" = <b>quad</b> (4 channel). Satu QSFP28 = 4×25G = <b>100G</b>.</p>
<h3>Keluarga QSFP</h3>
<div class="tblwrap"><table>
<tr><th>Tipe</th><th>Kecepatan</th><th>Komposisi</th><th>Pemakaian</th></tr>
<tr><td><b>QSFP+</b></td><td>40 Gbps</td><td>4×10G</td><td>Uplink agregasi 40G</td></tr>
<tr><td><b>QSFP28</b></td><td>100 Gbps</td><td>4×25G</td><td><b>Standar data center modern</b></td></tr>
<tr><td><b>QSFP-DD</b></td><td>400 Gbps</td><td>8×50G</td><td>Core/AI cluster</td></tr>
</table></div>
<h3>Varian Jarak (mirip SFP+)</h3>
<ul>
<li><b>SR4:</b> MMF MPO-12, 100 m @ 100G — 4 serat TX + 4 RX (<b>8 serat</b>, konektor MPO!).</li>
<li><b>LR4:</b> SMF duplex, 10 km — 4 wavelength dalam 1 serat (WDM).</li>
<li><b>Breakout:</b> 1× QSFP+ 40G → <b>4× SFP+ 10G</b> (kabel breakout MPO→4×LC) — migrasi bertahap!</li>
</ul>
<h3>Konektor MPO/MTP</h3>
<p>Untuk paralel 8/12 serat, konektornya <b>MPO</b> (bukan LC duplex) — satu konektor untuk banyak serat. <b>Polaritas MPO</b> (Tipe A/B/C) menentukan TX ketemu RX — salah polaritas = tidak nyala. Ini topik spesialis (cukup tahu: ada, dan harus diperhatikan).</p>
<div class="callout blue"><div class="t">Kapan Bertemu QSFP?</div><p style="margin:4px 0 0">Di enterprise umum: uplink core switch & data center. Kamu tidak butuh hafal detailnya sekarang — cukup paham <b>konsep quad-channel, varian SR4/LR4, dan breakout</b>. Detail menjadi relevan di Part 20 (enterprise design).</p></div>`,
      terms: [
        ['QSFP', 'Quad SFP — transceiver 40/100/400G (4/8 channel paralel).'],
        ['QSFP28', 'QSFP untuk 100G (4×25G) — standar data center modern.'],
        ['MPO', 'Konektor multi-serat (8/12/24) untuk paralel optik.'],
        ['Breakout', 'Memecah 1×40G menjadi 4×10G via kabel khusus.'],
      ],
      scenario: 'Core switch butuh uplink 100G ke data center 8 km: QSFP28 LR4 (SMF duplex, 10 km) — satu modul, satu pasang serat. Alternatif lama: 10× SFP+ 10G (10 pasang serat + 10 port). QSFP menghemat port, serat, dan daya — agregasi adalah trennya.',
      bestPractices: 'Rencanakan migrasi: breakout cable memungkinkan 40G hari ini, 4×10G ke switch lama — tanpa forklift upgrade.',
      security: 'Port 100G yang tidak dipakai sebaiknya dimatikan — kapasitas besar yang terbuka = jalan tol bagi eksfiltrasi data.',
      challenge: 'Jelaskan konsep "4×25G = 100G" kepada teman. Mengapa paralel lebih praktis dari satu channel 100G?',
      interviewQ: 'Q: "Apa itu QSFP28?" — A: Transceiver quad-channel untuk 100 Gbps (4×25G). Varian: SR4 (MMF MPO, 100 m) dan LR4 (SMF duplex 10 km, 4 wavelength). Bisa breakout menjadi 4×10G/25G untuk migrasi bertahap.',
      quiz: [
        { q: 'Huruf "Q" pada QSFP artinya…', options: ['Quality', 'Quad — 4 channel paralel', 'Quick', 'Quantum'], answer: 1, explain: 'QSFP28 = 4×25G = 100G.' },
        { q: 'Untuk 100G sejauh 8 km single mode, pilih…', options: ['QSFP28 SR4', 'QSFP28 LR4 (SMF, 10 km)', 'SFP+ SR', 'DAC'], answer: 1, explain: 'LR4 = long range 10 km SMF duplex.' },
        { q: 'Kabel breakout QSFP+ memungkinkan…', options: ['Menambah kecepatan 2x', '1×40G menjadi 4×10G (migrasi bertahap)', 'Mengubah SMF ke MMF', 'Tanpa kabel'], answer: 1, explain: 'MPO→4×LC: agregasi hari ini, pecah ke switch 10G lama.' },
      ],
    },
    {
      id: '7.25',
      title: 'Optical Power',
      body: `<p><b>Optical power</b> adalah <b>daya cahaya</b> di fiber, diukur dalam <b>dBm</b> — "bahan bakar" link optik. Dua angka kunci setiap link: <b>TX power</b> (berapa kuat cahaya dikirim) dan <b>RX power</b> (berapa kuat cahaya diterima).</p>
<h3>TX vs RX</h3>
<div class="tblwrap"><table>
<tr><th>Parameter</th><th>Arti</th><th>Contoh SFP LX</th></tr>
<tr><td><b>TX power</b></td><td>Daya pancar laser (keluar transceiver)</td><td>-3 dBm</td></tr>
<tr><td><b>RX power</b></td><td>Daya terima di ujung (setelah loss)</td><td>-15 dBm (terukur)</td></tr>
<tr><td><b>RX sensitivity</b></td><td>Daya <b>minimum</b> agar receiver masih membaca</td><td>-21 dBm</td></tr>
<tr><td><b>Overload</b></td><td>Daya <b>maksimum</b> sebelum receiver "silau"</td><td>-3 dBm</td></tr>
</table></div>
<h3>Membaca DDM/DOM</h3>
<p>Transceiver modern punya <b>DDM</b> (<i>Digital Diagnostic Monitoring</i>): baca TX/RX power live dari switch!</p>
<pre>Switch# show interfaces transceiver
  Port  TX Power    RX Power    Status
  1/1   -2.8 dBm    -14.2 dBm   OK ✓
  1/2   -2.9 dBm    -28.5 dBm   LOW! ⚠ (di bawah sensitivity)</pre>
<p><b>Mengapa ini powerful?</b> Tanpa ke lapangan, kamu tahu link bermasalah (RX rendah) atau sehat — diagnosis jarak jauh dalam detik. DDM adalah "speedometer" link fiber.</p>
<div class="callout"><div class="t">RX Terlalu KUAT Juga Masalah!</div><p style="margin:4px 0 0">Link pendek (2 m) dengan transceiver LR (10 km): RX bisa <b>overload</b> (terlalu kuat → "silau"). Solusi: <b>attenuator</b> (peredam, mis. 5 dB) dipasang di patch cord. Jangan heran: kadang link perlu <i>dilemahkan</i> agar nyala.</p></div>`,
      terms: [
        ['Optical power', 'Daya cahaya di fiber (dBm); TX = pancar, RX = terima.'],
        ['RX sensitivity', 'Daya minimum yang masih bisa dibaca receiver.'],
        ['Overload', 'Daya maksimum sebelum receiver silau/rusak.'],
        ['DDM/DOM', 'Digital Diagnostic Monitoring — baca TX/RX power live dari switch.'],
        ['Attenuator', 'Peredam optik untuk link yang terlalu kuat (anti overload).'],
      ],
      scenario: 'Link 10G baru 500 m tidak nyala. DDM: TX -3 dBm (normal), RX -28 dBm (jauh di bawah sensitivity -21 dBm) — loss 25 dB untuk 500 m = tidak wajar! Investigasi: patch cord terjepit pintu rak (macro-bend). Luruskan: RX naik ke -12 dBm, link nyala. DDM mengubah "tebakan" menjadi "pengukuran".',
      bestPractices: 'Jadikan cek DDM sebagai langkah pertama diagnosis fiber — sebelum ke lapangan. Catat baseline RX tiap link penting.',
      security: 'Monitor DDM RX sebagai deteksi anomali: penurunan tiba-tiba bisa = tap/penyadapan, bukan sekadar kotor — selidiki sebelum membersihkan bukti.',
      challenge: 'Jika ada akses switch: tampilkan DDM satu port fiber. Catat TX & RX-nya — masih dalam batas normal?',
      interviewQ: 'Q: "Bagaimana cara memeriksa kesehatan link fiber dari jauh?" — A: Via DDM (Digital Diagnostic Monitoring): baca TX power dan RX power live dari switch. RX di bawah sensitivity = loss berlebih; RX di atas overload = terlalu kuat (butuh attenuator).',
      quiz: [
        { q: 'RX power -28 dBm dengan sensitivity -21 dBm artinya…', options: ['Normal', 'Terlalu lemah — di bawah batas baca receiver (link bermasalah)', 'Terlalu kuat', 'Sempurna'], answer: 1, explain: 'RX < sensitivity = receiver tidak bisa membaca bit dengan benar.' },
        { q: 'Fungsi DDM pada transceiver adalah…', options: ['Mengenkripsi data', 'Memantau TX/RX power (dan suhu/tegangan) secara live dari switch', 'Menambah kecepatan', 'Mengganti fiber'], answer: 1, explain: 'DDM = speedometer link fiber untuk diagnosis jarak jauh.' },
        { q: 'Link sangat pendek dengan transceiver long-range bisa mengalami…', options: ['Tidak masalah', 'Overload — RX terlalu kuat; solusinya attenuator', 'Kekurangan daya', 'Putus'], answer: 1, explain: 'Receiver "silau"; peredam optik menyeimbangkan.' },
      ],
    },
    {
      id: '7.26',
      title: 'dBm',
      body: `<p><b>dBm</b> adalah satuan daya <b>logaritmik</b> relatif terhadap <b>1 milliwatt</b>: <code>dBm = 10 × log10(P / 1 mW)</code>. Semua pengukuran optik memakai dBm — wajib nyaman membacanya.</p>
<h3>Angka Kunci (Hafalkan!)</h3>
<div class="tblwrap"><table>
<tr><th>dBm</th><th>Daya (mW)</th><th>Artinya</th></tr>
<tr><td><b>0 dBm</b></td><td>1 mW</td><td>Referensi</td></tr>
<tr><td><b>-3 dBm</b></td><td>≈0.5 mW</td><td>TX tipikal SFP</td></tr>
<tr><td><b>-10 dBm</b></td><td>0.1 mW</td><td>—</td></tr>
<tr><td><b>-20 dBm</b></td><td>0.01 mW</td><td>Dekat sensitivity</td></tr>
<tr><td><b>-30 dBm</b></td><td>0.001 mW</td><td>Sangat lemah</td></tr>
</table></div>
<h3>Aturan Main Logaritmik</h3>
<ul>
<li><b>±3 dB = 2x / ½x daya.</b> -3 dBm = setengah dari 0 dBm. +3 dB = dua kali lipat.</li>
<li><b>±10 dB = 10x / ⅒x daya.</b> -10 dBm = sepersepuluh 0 dBm.</li>
<li><b>dB (tanpa "m") = SELISIH/rasio</b> (mis. loss 5 dB). <b>dBm = ABSOLUT</b> (mis. TX -3 dBm).</li>
<li><b>Loss dihitung dengan PENGURANGAN sederhana:</b> TX (-3 dBm) − loss (12 dB) = RX (-15 dBm). Inilah keindahan logaritmik!</li>
</ul>
<div class="callout blue"><div class="t">Mengapa Logaritmik?</div><p style="margin:4px 0 0">Daya optik merentang jutaan kali lipat (1 mW → 0.000001 mW) — skala linear tidak praktis. Logaritmik memampatkan rentang raksasa menjadi angka -30..0 yang mudah dihitung (cukup tambah-kurang).</p></div>`,
      terms: [
        ['dBm', 'Satuan daya logaritmik vs 1 mW; 0 dBm = 1 mW.'],
        ['dB', 'Satuan rasio/selisih (tanpa m) — untuk loss/gain.'],
      ],
      diagram: `<pre>         dBm: TANGGA LOGARITMIK (hafalkan!)

    0 dBm  = 1 mW        ─┐
   -3 dBm  = 0.5 mW         │ tiap -3 dB = setengah daya
  -10 dBm  = 0.1 mW      ─┤ tiap -10 dB = sepersepuluh
  -20 dBm  = 0.01 mW     ─┘
  -30 dBm  = 0.001 mW

   Loss: PENGURANGAN → TX(-3) − loss(12) = RX(-15) ✓</pre>`,
      scenario: 'Engineer menghitung: TX -2 dBm, total loss 18 dB → RX = -20 dBm. Sensitivity -21 dBm → margin hanya 1 dB = terlalu mepet! Keputusan: ganti ke transceiver ER atau tambah repeater. Satu pengurangan sederhana mencegah link yang "nyala tapi tidak stabil".',
      bestPractices: 'Hafalkan: 0, -3, -10, -20, -30 dBm + aturan 3 dB/10 dB. Ini "perkalian" dunia fiber.',
      security: 'Kesalahan hitung dB/dBm (mis. 10x vs 2x) menyebabkan link under-design yang rapuh — selalu verifikasi hitungan dengan rekan (four-eyes).',
      challenge: 'Hitung: TX -5 dBm, loss total 14 dB → RX? Jika sensitivity -24 dBm, berapa margin-nya? Aman?',
      interviewQ: 'Q: "Apa beda dB dan dBm?" — A: dBm = daya absolut relatif 1 mW (0 dBm = 1 mW; negatif = di bawah 1 mW). dB = rasio/selisih tanpa referensi (untuk loss/gain). Loss dihitung dengan pengurangan: RX (dBm) = TX (dBm) − loss (dB). Aturan: 3 dB = 2x, 10 dB = 10x.',
      quiz: [
        { q: '0 dBm setara dengan…', options: ['0 mW', '1 mW', '10 mW', '1 W'], answer: 1, explain: 'Definisi: 0 dBm = 1 milliwatt (referensi).' },
        { q: 'TX -3 dBm dengan total loss 12 dB menghasilkan RX…', options: ['9 dBm', '-15 dBm', '-9 dBm', '15 dBm'], answer: 1, explain: '-3 − 12 = -15 dBm (pengurangan logaritmik).' },
        { q: 'Selisih 10 dB artinya perbedaan daya…', options: ['2x lipat', '10x lipat', '100x lipat', 'Sama'], answer: 1, explain: 'Aturan: 10 dB = 10x; 3 dB = 2x.' },
      ],
    },
    {
      id: '7.27',
      title: 'Link Budget',
      body: `<p><b>Link budget</b> adalah <b>perhitungan "apakah cahaya cukup sampai"</b>: daya pancar (TX) dikurangi <b>semua loss</b> di jalan harus masih di atas sensitivity receiver — <b>dengan margin aman</b>.</p>
<h3>Rumus</h3>
<pre>Margin = TX power − Total loss − RX sensitivity
         (dBm)       (dB)          (dBm)

Aturan: Margin ≥ 3 dB  →  AMAN ✓
        Margin < 3 dB   →  RISIKO ⚠ (penuaan, kotor, suhu bisa mematikan)</pre>
<h3>Contoh Lengkap</h3>
<pre>Link: 8 km OS2, SFP LX (TX -3 dBm, sensitivity -21 dBm)
  Kabel      : 8 km × 0.4 dB/km      = 3.2 dB
  Konektor   : 4 × 0.5 dB            = 2.0 dB
  Splice     : 2 × 0.1 dB            = 0.2 dB
  ─────────────────────────────────────────
  Total loss                         = 5.4 dB
  Margin = -3 − 5.4 − (-21) = 12.6 dB  ✓✓ SANGAT AMAN</pre>
<h3>Nilai Loss Standar (untuk estimasi)</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Loss Tipikal</th></tr>
<tr><td>Kabel SMF (OS2)</td><td>0.4 dB/km</td></tr>
<tr><td>Kabel MMF</td><td>3.0 dB/km @ 850 nm</td></tr>
<tr><td>Konektor (pasangan)</td><td>0.5 dB</td></tr>
<tr><td>Fusion splice</td><td>0.1 dB</td></tr>
<tr><td>Mechanical splice</td><td>0.3 dB</td></tr>
</table></div>
<div class="callout"><div class="t">Margin 3 dB = Asuransi</div><p style="margin:4px 0 0">Konektor mengotori (+1 dB), splice menua, suhu berubah — margin menyerap degradasi alami. Link dengan margin 0.5 dB <b>akan</b> mati dalam 1–2 tahun. Engineer profesional tidak merancang "pas-pasan".</p></div>`,
      terms: [
        ['Link budget', 'Perhitungan TX − loss vs sensitivity + margin; penentu link hidup/mati.'],
        ['Margin', 'Cadangan dB di atas sensitivity; aman jika ≥3 dB.'],
      ],
      diagram: `<pre>         LINK BUDGET (contoh 8 km OS2)

   TX -3 dBm ──▶ [kabel 3.2][konektor 2.0][splice 0.2]
                    total loss 5.4 dB
              ──▶ RX = -8.4 dBm
                    sensitivity -21 dBm
                    MARGIN = 12.6 dB ✓✓

   Batas: margin ≥ 3 dB (asuransi degradasi).</pre>`,
      scenario: 'Penawaran kontraktor: link 20 km "dijamin nyala" dengan transceiver standar. Hitungan engineer: loss kabel 8 dB + konektor/splice 3 dB = 11 dB; TX -3, sensitivity -21 → margin 7 dB ✓. Tapi untuk 40 km: loss 19 dB → margin -1 dB ✗ — butuh transceiver ER/ZX atau repeater. Hitungan 5 menit menggagalkan janji manis kontraktor.',
      bestPractices: 'Hitung link budget untuk SETIAP link >2 km SEBELUM beli transceiver. Simpan perhitungannya di dokumentasi.',
      security: 'Link budget tanpa margin = link yang akan gagal saat degradasi — dan kegagalan "misterius" sering disalahartikan sebagai serangan. Margin 3 dB adalah keamanan operasional.',
      challenge: 'Hitung link budget: 12 km OS2, TX -2 dBm, sensitivity -23 dBm, 4 konektor, 3 fusion splice. Margin? Aman?',
      interviewQ: 'Q: "Apa itu link budget dan berapa margin aman?" — A: Perhitungan apakah daya cahaya cukup: Margin = TX − total loss − RX sensitivity. Aman jika ≥3 dB (cadangan untuk degradasi: kotor, penuaan, suhu). Total loss = kabel (dB/km × km) + konektor (0.5 dB) + splice (0.1 dB).',
      quiz: [
        { q: 'Rumus link budget margin adalah…', options: ['TX + loss + sensitivity', 'TX − total loss − RX sensitivity', 'TX × loss', 'Loss − TX'], answer: 1, explain: 'Sisa daya di atas batas baca receiver.' },
        { q: 'Margin aman minimum untuk link fiber adalah…', options: ['0 dB', '≥3 dB', '10 dB', 'Bebas'], answer: 1, explain: '3 dB = asuransi degradasi alami (kotor, penuaan, suhu).' },
        { q: 'Link dengan margin 0.5 dB sebaiknya…', options: ['Dibiarkan — masih nyala', 'Diperbaiki: margin terlalu mepet, akan mati saat degradasi', 'Ditambah kabel', 'Dikurangi TX'], answer: 1, explain: '"Nyala hari ini" ≠ "andal"; degradasi alami akan mematikannya.' },
      ],
    },
    {
      id: '7.28',
      title: 'Fiber Loss',
      body: `<p><b>Fiber loss</b> adalah <b>semua penyebab cahaya berkurang</b> di sepanjang link — "bocornya ember" yang harus dihitung di link budget. Kenali jenisnya agar bisa mendiagnosis.</p>
<h3>Jenis-jenis Loss</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Penyebab</th><th>Nilai Tipikal</th><th>Solusi</th></tr>
<tr><td><b>Attenuation</b></td><td>Penyerapan alami kaca per km</td><td>0.4 dB/km (OS2)</td><td>Pilih OS2 / batasi jarak</td></tr>
<tr><td><b>Connector loss</b></td><td>Celah/kotor di konektor</td><td>0.5 dB (kotor: 2–5 dB!)</td><td><b>Bersihkan!</b></td></tr>
<tr><td><b>Splice loss</b></td><td>Sambungan tidak sempurna</td><td>0.1 dB (fusion baik)</td><td>Splice ulang jika >0.3</td></tr>
<tr><td><b>Bend loss</b></td><td>Tekukan (macro/micro)</td><td>Bervariasi (bisa 10+ dB!)</td><td>Longgarkan tekukan</td></tr>
<tr><td><b>Dirty connector</b></td><td>Debu/minyak di ferrule</td><td><b>1–10 dB</b></td><td>Inspect-clean-connect</td></tr>
</table></div>
<h3>Musuh #1: Kotoran</h3>
<p>Perhatikan: <b>konektor kotor</b> (1–10 dB) bisa mengalahkan <b>20 km kabel OS2</b> (8 dB)! Prioritas diagnosis: <b>bersihkan dulu</b> (gratis, 10 detik), baru curigai kabel/splice (mahal, berjam-jam).</p>
<h3>Urutan Diagnosis Loss</h3>
<pre>1. DDM: RX rendah? → ya, ada loss berlebih
2. Bersihkan SEMUA konektor di jalur → cek DDM lagi
3. Masih rendah? → OTDR untuk lokalisasi (7.29)
4. OTDR tunjuk titik → perbaiki (luruskan tekukan / splice ulang)</pre>
<div class="callout blue"><div class="t">Hukum Diagnosis Fiber</div><p style="margin:4px 0 0"><b>Murah dulu, mahal kemudian. Dekat dulu, jauh kemudian.</b> Bersihkan konektor (gratis) → cek patch cord (murah) → OTDR (alat) → gali kabel (mahal). 90% kasus selesai di langkah 1–2.</p></div>`,
      terms: [
        ['Fiber loss', 'Semua penyebab berkurangnya daya cahaya: attenuation, konektor, splice, bend, kotor.'],
        ['Attenuation', 'Pelemahan alami per km (0.4 dB/km OS2; 3 dB/km MMF @850nm).'],
      ],
      scenario: 'Link 5 km mati total. Kontraktor mengusulkan "ganti kabel 5 km" (Rp 50 jt). Engineer membersihkan konektor dulu: RX naik dari -30 ke -12 dBm — link nyala. Total biaya: 1 cleaner Rp 200 ribu. Urutan diagnosis yang benar menghemat 49.8 juta.',
      bestPractices: 'Catat baseline DDM tiap link. Kenaikan loss bertahap = early warning (kotor/menua) sebelum link mati.',
      security: 'Kenaikan loss mendadak bisa juga indikasi <b>penyadapan</b> (tap membengkokkan serat)! Selidiki loss aneh yang tak dapat dijelaskan.',
      challenge: 'Susun ulang tabel loss di atas dari yang paling mudah diperbaiki ke tersulit. Cocokkan dengan urutan diagnosis.',
      interviewQ: 'Q: "Sebutkan jenis-jenis fiber loss dan urutan diagnosisnya." — A: Attenuation kabel, connector loss, splice loss, bend loss, dan konektor kotor (terbesar & termudah!). Urutan: DDM → bersihkan konektor → cek patch cord → OTDR lokalisasi → perbaiki titik. Murah dulu, mahal kemudian.',
      quiz: [
        { q: 'Penyebab loss terbesar & termudah diperbaiki adalah…', options: ['Attenuation kabel', 'Konektor kotor (1–10 dB!) — bersihkan dulu', 'Splice buruk', 'Petir'], answer: 1, explain: 'Kotor mengalahkan 20 km kabel; pembersihan gratis 10 detik.' },
        { q: 'Urutan diagnosis fiber yang benar adalah…', options: ['Langsung ganti kabel', 'DDM → bersihkan konektor → OTDR lokalisasi → perbaiki titik', 'OTDR dulu selalu', 'Tebak'], answer: 1, explain: 'Murah dulu (bersih), mahal kemudian (gali kabel).' },
        { q: 'Kenaikan loss mendadak yang tak dapat dijelaskan perlu dicurigai sebagai…', options: ['Hal biasa', 'Kemungkinan penyadapan (tap) — selidiki', 'Cuaca', 'Umur kabel'], answer: 1, explain: 'Tap membengkokkan serat = loss aneh; aspek keamanan fisik.' },
      ],
    },
    {
      id: '7.29',
      title: 'OTDR',
      body: `<p><b>OTDR</b> (<i>Optical Time-Domain Reflectometer</i>) adalah <b>"radar" fiber</b>: mengirim pulsa cahaya dan mengukur <b>pantulan</b> yang kembali — dari waktu & kekuatannya, ia memetakan <b>di mana</b> setiap sambungan, tekukan, dan putusnya kabel.</p>
<h3>Cara Kerja</h3>
<pre>OTDR ──pulsa cahaya──▶ ════════════ fiber ════════════
         ◀──pantulan kecil── (hamburan alami Rayleigh)
         ◀──PANTULAN BESAR── (konektor / splice / putus!)

  Waktu pantulan → JARAK titik (cahaya ~200.000 km/s di kaca)
  Besar pantulan → JENIS & loss titik</pre>
<h3>Membaca Trace OTDR</h3>
<pre>Loss
(dB) │╲
     │  ╲___╲___╲___╲  ← garis landai = attenuation kabel
     │      │   │   │
     │     drop drop │   ← drop kecil = splice (0.1 dB)
     │              │←─── drop+lonjakan = konektor
     │              ╲___  ← garis DATAR = ??? (putus? ujung?)
     └────────────────── jarak (km)
         2km  4km  6km</pre>
<ul>
<li><b>Garis landai turun:</b> attenuation normal kabel.</li>
<li><b>Drop kecil tanpa lonjakan:</b> fusion splice (bagus!).</li>
<li><b>Lonjakan + drop:</b> konektor / mechanical splice (reflektif).</li>
<li><b>Lonjakan besar lalu datar:</b> <b>putus / ujung kabel</b> — pantulan Fresnel.</li>
<li><b>Drop tanpa lonjakan di satu titik:</b> curigai <b>bend loss / tap</b>!</li>
</ul>
<h3>Dead Zone: Keterbatasan</h3>
<p>Setelah pantulan besar, OTDR "buta" sesaat (<b>dead zone</b>, ±meter) — event kecil tepat setelah konektor bisa terlewat. <b>Alasan:</b> detektor jenuh oleh pantulan kuat. Solusi: ukur dari <b>dua arah</b> dan rata-ratakan (praktik standar).</p>
<div class="callout"><div class="t">OTDR vs Power Meter</div><p style="margin:4px 0 0"><b>Power meter + sumber cahaya:</b> mengukur <b>total loss</b> (berapa), murah. <b>OTDR:</b> menunjukkan <b>di mana</b> loss terjadi, mahal. Keduanya komplementer: power meter untuk sertifikasi, OTDR untuk troubleshooting.</p></div>`,
      terms: [
        ['OTDR', 'Optical Time-Domain Reflectometer — radar fiber: lokalisasi event via pantulan.'],
        ['Trace', 'Grafik hasil OTDR: loss vs jarak.'],
        ['Dead zone', 'Area buta OTDR setelah pantulan besar (±meter).'],
        ['Pantulan Fresnel', 'Pantulan kuat di ujung/putusnya serat.'],
      ],
      diagram: `<pre>        MEMBACA TRACE OTDR

   dB │╲___╲___╲___╲___
      │    │   │   │   ╲___
      │  splice konektor putus?
      │  (drop) (lonjak+drop) (lonjak besar→datar)
      └─────────────────────── km
      Landai = kabel normal · Drop kecil = splice OK</pre>`,
      scenario: 'Backbone 12 km loss 15 dB (harusnya ~7 dB). OTDR: drop 6 dB tepat di km 7.2 — lokasi galian proyek drainase minggu lalu! Teknisi ke titik itu: kabel terjepit alat berat (belum putus). Perbaiki 1 titik vs ganti 12 km. OTDR mengubah "kabel rusak" menjadi "koordinat perbaikan".',
      bestPractices: 'Simpan trace OTDR awal (baseline) tiap backbone — perbandingan trace lama vs baru menunjukkan degradasi & lokasi tepatnya.',
      security: 'Bandingkan trace berkala: event reflektif BARU yang tak dikenal bisa = upaya penyadapan. OTDR sebagai alat audit fisik.',
      challenge: 'Pada trace di atas: di km berapa kemungkinan putus? Bagaimana membedakan splice baik vs konektor kotor dari bentuk trace?',
      interviewQ: 'Q: "Apa itu OTDR dan bagaimana membaca trace-nya?" — A: Radar fiber: kirim pulsa, ukur pantulan — waktu = jarak, besar = jenis event. Garis landai = attenuation normal; drop kecil = splice; lonjakan+drop = konektor; lonjakan besar lalu datar = putus/ujung. Keterbatasan: dead zone setelah pantulan besar — ukur dua arah.',
      quiz: [
        { q: 'OTDR menentukan LOKASI gangguan dengan cara…', options: ['Menebak', 'Mengukur waktu pantulan cahaya kembali (waktu = jarak)', 'GPS', 'Bertanya ke router'], answer: 1, explain: 'Radar: pulsa → pantulan; delay × kecepatan cahaya = jarak.' },
        { q: 'Pada trace OTDR, lonjakan besar diikuti garis datar menandakan…', options: ['Splice bagus', 'Putus/ujung kabel (pantulan Fresnel)', 'Kabel normal', 'Konektor bersih'], answer: 1, explain: 'Ujung/putus memantulkan kuat lalu tidak ada lagi serat.' },
        { q: 'Dead zone pada OTDR adalah…', options: ['Area tanpa kabel', 'Kebutaan sementara setelah pantulan besar — event kecil bisa terlewat', 'Zona berbahaya', 'Kabel mati'], answer: 1, explain: 'Detektor jenuh; solusi: ukur dari dua arah.' },
      ],
    },
    {
      id: '7.30',
      title: 'Hands-On: Virtual Fiber Topology',
      body: `<p>Tidak punya fiber fisik? Tidak masalah. Lab ini melatih <b>otak desain fiber</b>: memilih jenis fiber, menghitung link budget, dan merancang topologi — skill yang dipakai SEBELUM satu meter kabel dibeli.</p>
<h3>Topologi (Studi Kasus)</h3>
<pre>PT Maju Bersama — kampus 3 gedung:

  [Gedung A] ──450 m── [Gedung B] ──1.2 km── [Gedung C]
  (pusat)              (kantor)              (gudang/data)
  Kebutuhan: 10 Gbps antar-gedung, siap 40G 5 tahun ke depan.
  Anggaran: menengah. Kondisi: jalur outdoor antar-gedung.</pre>
<h3>Objective</h3>
<p>Menghasilkan <b>desain fiber lengkap</b>: jenis fiber, core count, transceiver, link budget per segmen, dan BoM — mengikuti alur Topology → Objective → Configuration → Verification → Failure Injection → Troubleshooting → Fix → Final Verification.</p>
<h3>Configuration (Keputusan Desain)</h3>
<div class="tblwrap"><table>
<tr><th>Keputusan</th><th>Pilihan</th><th>Alasan</th></tr>
<tr><td>Jenis fiber</td><td><b>OS2 single mode</b></td><td>Outdoor + >550 m + siap 40G (MMF tidak sampai)</td></tr>
<tr><td>Core count</td><td><b>24 core</b></td><td>2 link (4 serat) + cadangan 50% + growth</td></tr>
<tr><td>Transceiver A–B (450 m)</td><td>SFP+ <b>LR</b> 10 km</td><td>SMF <10 km; SR tidak cocok (MMF)</td></tr>
<tr><td>Transceiver B–C (1.2 km)</td><td>SFP+ <b>LR</b> 10 km</td><td>Sama; margin besar</td></tr>
<tr><td>Konektor</td><td><b>LC UPC</b> duplex</td><td>Standar transceiver; UPC (biru)</td></tr>
<tr><td>Terminasi</td><td><b>ODF</b> tiap gedung</td><td>24 core = skala ODF</td></tr>
</table></div>
<h3>Verification (Link Budget)</h3>
<pre>Segmen B–C: 1.2 km OS2, SFP+ LR (TX -2 dBm, sens -14 dBm*)
  Kabel    : 1.2 × 0.4 = 0.48 dB
  Konektor : 4 × 0.5   = 2.0 dB
  Splice   : 4 × 0.1   = 0.4 dB
  Total    : 2.88 dB
  Margin   : -2 − 2.88 − (-14) = 9.12 dB  ✓ AMAN
  (*angka contoh — selalu cek datasheet transceiver asli!)</pre>
<h3>Failure Injection</h3>
<p><b>Injeksi 1:</b> "kontraktor menawarkan OM4 agar murah" → hitung: OM4 10G maks 550 m < 1200 m → <b>gagal total</b>. <b>Injeksi 2:</b> "pakai SFP+ SR karena murah" → SR = MMF, fiber OS2 = SMF → <b>tidak kompatibel</b>. <b>Injeksi 3:</b> core count 4 → tanpa cadangan & growth → <b>risiko operasional</b>.</p>
<h3>Troubleshooting (Menolak Tawaran Buruk)</h3>
<p>Untuk tiap injeksi: tunjukkan <b>angka</b> yang menggugurkan (jarak vs batas, kompatibilitas, cadangan). Engineer yang berargumen dengan angka tidak bisa ditekan salesman.</p>
<h3>Fix & Final Verification</h3>
<p>Desain final: OS2 24 core + SFP+ LR + ODF + LC UPC, link budget ≥9 dB tiap segmen. <b>Verifikasi akhir:</b> checklist — jenis fiber ✓, jarak vs batas ✓, kompatibilitas transceiver ✓, margin ≥3 dB ✓, core cadangan ✓, BoM lengkap ✓.</p>
<div class="callout blue"><div class="t">Dari Virtual ke Nyata</div><p style="margin:4px 0 0">Dokumen desain ini (topologi + link budget + BoM) adalah <b>deliverable profesional</b> yang diminta setiap proyek fiber. Simpan sebagai template — kamu akan memakainya lagi di Part 20 & 39.</p></div>`,
      terms: [
        ['BoM', 'Bill of Materials — daftar belanja komponen proyek.'],
        ['As-built', 'Dokumentasi "sebagaimana terpasang" — hasil akhir vs rencana.'],
      ],
      diagram: `<pre>        DESAIN FINAL (studi kasus)

   [Gedung A] ══ OS2 24 core, 450 m ══ [Gedung B] ══ OS2 24 core, 1.2 km ══ [Gedung C]
      ODF ←→ SFP+ LR ←→ ODF ←→ SFP+ LR ←→ ODF
      LC UPC duplex · margin 9+ dB · siap 40G (ganti transceiver)</pre>`,
      scenario: 'Konsultan junior menyetujui penawaran "fiber 10G termurah" tanpa link budget — ternyata OM3 untuk 900 m (melebihi 300 m!). Proyek gagal uji terima, kontraktor menyalahkan "kondisi lapangan". Senior yang menghitung 5 menit di awal akan menolak penawaran itu di meja, bukan di lapangan.',
      bestPractices: 'Tidak ada pembelian fiber tanpa: (1) jenis fiber vs jarak, (2) link budget, (3) kompatibilitas transceiver. Tiga cek ini mencegah 90% kegagalan proyek.',
      security: 'Sertakan dalam BoM: dust cap, cleaner, dan kunci ODF — keamanan fisik adalah bagian desain, bukan tambahan.',
      challenge: 'Ubah studi kasus: jarak B–C menjadi 300 m INDOOR. Apa yang berubah? (Jenis fiber? Transceiver? ODF?) Tulis desain revisinya.',
      interviewQ: 'Q: "Rancang link fiber 10G sejauh 1.2 km outdoor. Apa pilihanmu?" — A: OS2 single mode (outdoor, >550 m, siap 40G), minimal 24 core (cadangan+growth), SFP+ LR 10 km (SMF), LC UPC duplex, ODF tiap ujung, dan hitung link budget (target margin ≥3 dB, ideal 9+ dB). Tolak OM4/SR dengan angka batas jaraknya.',
      quiz: [
        { q: 'Untuk link 1.2 km outdoor 10G, pilihan TEPAT adalah…', options: ['OM4 + SFP+ SR', 'OS2 + SFP+ LR', 'Cat6A', 'OM1 + SX'], answer: 1, explain: 'OM4 maks 550 m; SR = MMF. OS2 + LR = kombinasi yang benar.' },
        { q: 'Tawaran "OM4 murah" untuk 1.2 km digugurkan karena…', options: ['Harga', 'Angka: OM4 10G maks 550 m < 1200 m — fisika tidak bisa dinegosiasi', 'Warna', 'Merek'], answer: 1, explain: 'Argumen angka mengalahkan argumen harga.' },
        { q: 'Dokumen yang wajib ada sebelum pembelian fiber adalah…', options: ['Brosur', 'Desain: jenis fiber vs jarak + link budget + kompatibilitas transceiver', 'Foto', 'Iklan'], answer: 1, explain: 'Tiga cek mencegah 90% kegagalan proyek fiber.' },
      ],
    },
  ],
  project: {
    title: 'Project Part 07 — Fiber Link Design & Link Budget (Portfolio)',
    html: `<div class="proj">
<h3>Project Part 07 — Fiber Link Design & Link Budget</h3>
<p><b>Tugasmu:</b> buat <b>dokumen desain fiber profesional</b> untuk skenario pilihanmu: (a) kampus 3 gedung (seperti 7.30), ATAU (b) gedung kantormu sendiri (ukur jarak antar-titik). Dokumen ini meniru deliverable konsultan nyata.</p>
<p><b>Isi dokumen (fiber-design.md):</b></p>
<ol>
<li>Topologi (ASCII/draw.io): gedung, jarak tiap segmen, kebutuhan kecepatan + rencana 5 tahun.</li>
<li>Tabel keputusan: jenis fiber (OS2/OM4 + alasan), core count (+ alasan), transceiver per segmen, konektor, ODF/OTB.</li>
<li>Link budget per segmen: tabel komponen loss + margin (target ≥3 dB) — tunjukkan hitungan lengkap.</li>
<li>BoM (Bill of Materials): daftar belanja — kabel, transceiver, patch cord, ODF, pigtail, attenuator (jika perlu), cleaner.</li>
<li>Analisis "tawaran buruk": 2 alternatif yang kamu TOLAK beserta angka yang menggugurkannya (seperti failure injection 7.30).</li>
<li>Rencana pemeliharaan: jadwal pembersihan konektor, baseline DDM/OTDR, dan peta ODF.</li>
</ol>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Di repository <code>network-engineer-lab</code>, buat folder <code>part-07-fiber-optic/</code>.</span></li>
<li><span class="n">2</span><span>Isi dengan <code>README.md</code> (ringkasan eksekutif) dan <code>fiber-design.md</code> (desain lengkap).</span></li>
<li><span class="n">3</span><span>Commit <code>"Part 07: fiber link design & link budget"</code> lalu push.</span></li>
</ol>
<p><b>Kriteria selesai:</b> pilihan fiber/transceiver tepat untuk jarak (dengan angka batas), link budget tiap segmen terhitung dengan margin ≥3 dB, minimal 2 "tawaran buruk" ditolak dengan argumen angka, BoM lengkap termasuk perawatan, dan kode warna/konektor konsisten (tidak campur SMF/MMF atau UPC/APC).</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 07</div>
<p style="margin:6px 0 0">1) Kapan pilih single mode vs multimode? &nbsp;2) Apa beda OS1/OS2 dan OM1–OM4? &nbsp;3) Jelaskan link budget dan margin aman. &nbsp;4) Apa penyebab #1 gangguan fiber? &nbsp;5) Bagaimana OTDR menemukan lokasi putus? — Kuasai kelimanya: ini modal interview posisi NOC/field engineer.</p></div>`,
  },
};
