// Part 21 — Fase D: Fiber Optic Enterprise Topology (materi, tanpa project)
import type { Part } from './types';

export const part21: Part = {
  id: '21',
  number: 'PART 21',
  title: 'Fiber Optic Enterprise Topology',
  phaseId: 'fase-4',
  description:
    'Merancang backbone fiber enterprise: desain antar gedung, ODF/OTB, patch cord, SFP, link budget, redundansi, dan dokumentasi fiber.',
  repoFolder: 'part-21-fiber-enterprise',
  objectives: [
    'Merancang topologi backbone fiber antar gedung (core-to-distribution).',
    'Menjelaskan fungsi ODF, OTB, patch cord, dan SFP serta cara memilihnya.',
    'Menghitung link budget sederhana untuk memastikan link fiber layak.',
    'Merancang redundansi dan dokumentasi fiber yang siap operasional.',
  ],
  prerequisites:
    'Part 07 (dasar kabel & fiber), Part 19 (arsitektur enterprise — core/distribution). Tidak butuh perangkat fiber fisik; konsep bisa dipelajari dari dokumentasi dan simulasi.',
  subbabs: [
    {
      id: '21.1',
      title: 'Designing Fiber Backbone',
      body: `
<p><b>Fiber backbone</b> adalah tulang punggung fisik jaringan enterprise: kabel serat optik yang menghubungkan core–distribution antar gedung. Jika Part 19 adalah denah rumah, Part 21 adalah fondasi betonnya — digali dan ditanam sekali, dipakai 15–20 tahun.</p>
<h3>Mengapa Fiber (Bukan Tembaga) untuk Backbone?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Fiber Optik</th><th>Tembaga (UTP)</th></tr>
<tr><td>Jarak</td><td>550 m – 80 km+ (tergantung tipe)</td><td>Maks 100 m</td></tr>
<tr><td>Kecepatan</td><td>10G/40G/100G+ umum</td><td>10G maks, jarak pendek</td></tr>
<tr><td>Gangguan elektromagnetik</td><td>Kebal total (cahaya, bukan listrik)</td><td>Rentan (dekat listrik, petir)</td></tr>
<tr><td>Keamanan sadap</td><td>Sulit disadap tanpa terdeteksi</td><td>Relatif mudah di-tap</td></tr>
<tr><td>Biaya</td><td>Mahal (kabel + SFP + terminasi)</td><td>Murah</td></tr>
</table></div>
<h3>Prinsip Desain Backbone</h3>
<ul>
<li><b>Star/physical ring antar gedung</b> — tiap gedung (distribution) punya minimal 2 jalur fiber berbeda ke core (redundansi fisik, bukan hanya logis).</li>
<li><b>Spare core</b> — tanam kabel dengan core (serat) cadangan: butuh 4, tanam 12. Menggali ulang 10x lebih mahal daripada kelebihan serat.</li>
<li><b>Jalur terpisah</b> — dua link redundan harus lewat rute fisik berbeda (satu lewat utara, satu lewat selatan). Dua kabel dalam satu galian = satu cangkul memutus keduanya.</li>
<li><b>Pertumbuhan</b> — desain untuk 10 tahun: kebutuhan bandwidth enterprise naik ~30–50%/tahun.</li>
</ul>
<h3>Hubungan dengan OSI</h3>
<p>Fiber adalah <b>Layer 1</b> (fisik). Semua kecanggihan VLAN, routing, firewall di layer atas <b>runtuh</b> jika Layer 1 putus. Itulah mengapa desain fiber dibuat paling hati-hati — ia yang paling mahal diperbaiki.</p>
<div class="callout blue"><div class="t">Aturan Investasi</div><p style="margin:4px 0 0">Kabel fiber = investasi 15–20 tahun; perangkat aktif (switch/SFP) = 5–7 tahun. Maka: hemat di perangkat boleh (bisa diganti), pelit di kabel jangan (gali ulang = mahal + downtime).</p></div>`,
      terms: [
        ['Fiber backbone', 'Jaringan serat optik utama yang menghubungkan core–distribution antar gedung.'],
        ['Core (serat)', 'Helai serat individu di dalam kabel fiber — jangan dikacaukan dengan core layer jaringan.'],
        ['Spare core', 'Serat cadangan yang ditanam tapi belum dipakai — untuk pertumbuhan/perbaikan.'],
        ['Redundansi fisik', 'Dua jalur kabel lewat rute berbeda; bukan sekadar dua kabel satu galian.'],
      ],
      diagram: `<pre>        FIBER BACKBONE ANTAR GEDUNG

              [ Core Site ]
              /           \\
   rute utara /             \\ rute selatan (beda galian!)
            /               \\
   [ Gedung A ]         [ Gedung B ]
   (Distribution)       (Distribution)

Kabel: 12 core (pakai 4, spare 8). SFP 10G.
Satu rute putus → traffic lewat rute satunya.</pre>`,
      scenario:
        'Kampus menanam fiber 4 core tanpa cadangan antar gedung. Lima tahun kemudian butuh upgrade ke 40G (butuh 8 serat) — terpaksa gali ulang jalan kampus: biaya 10x lipat + 2 minggu downtime parsial. Jika dulu tanam 12 core, upgrade hanya ganti SFP.',
      bestPractices:
        'Selalu tanam minimal 2–3x kebutuhan serat saat ini. Dokumentasikan rute galian dengan patok/koordinat. Pisahkan rute redundan secara fisik sejak perencanaan.',
      security:
        'Rute fiber adalah informasi sensitif — peta galian tidak disebar sembarangan (sabotase fisik). ODF di ruang terkunci; akses tercatat.',
      challenge:
        'Kampus 4 gedung, jarak 300–800 m antar gedung. Tentukan: topologi (star/ring), jumlah core per kabel, dan tipe fiber (multimode/single-mode) — dengan alasan jarak dan biaya.',
      interviewQ:
        'Q: "Mengapa backbone enterprise memakai fiber, bukan UTP?" — A: Jarak (UTP maks 100 m, antar gedung butuh ratusan meter), kecepatan (10G+), kebal interferensi elektromagnetik, dan sulit disadap. UTP tetap dipakai di access layer (ke user) karena murah dan cukup.',
      quiz: [
        {
          q: 'Mengapa kabel fiber ditanam dengan spare core jauh di atas kebutuhan saat ini?',
          options: [
            'Agar terlihat canggih',
            'Menggali ulang jauh lebih mahal daripada kelebihan serat — spare untuk pertumbuhan 10–15 tahun',
            'Karena serat cepat rusak',
            'Aturan pemerintah',
          ],
          answer: 1,
          explain: 'Biaya galian/terminasi ulang 10x lipat dibanding harga serat tambahan; spare core adalah asuransi murah untuk pertumbuhan.',
        },
        {
          q: 'Dua link redundan dalam satu galian yang sama…',
          options: [
            'Sudah cukup redundant',
            'Bukan redundansi fisik yang benar — satu galian putus mematikan keduanya; rute harus terpisah',
            'Lebih hemat dan disarankan',
            'Tidak masalah sama sekali',
          ],
          answer: 1,
          explain: 'Redundansi sejati butuh jalur fisik berbeda; satu cangkul/galian bisa memutus dua kabel sekaligus jika satu rute.',
        },
        {
          q: 'Fiber berada di layer OSI mana dan apa implikasinya?',
          options: [
            'Layer 7 — hanya soal aplikasi',
            'Layer 1 (fisik) — jika putus, semua layer di atasnya runtuh; desainnya paling hati-hati karena paling mahal diperbaiki',
            'Layer 3 — soal routing',
            'Tidak terkait OSI',
          ],
          answer: 1,
          explain: 'Semua logika jaringan berdiri di atas fisik; fiber backbone yang putus melumpuhkan segalanya dan perbaikannya mahal (galian, splicing).',
        },
      ],
    },
    {
      id: '21.2',
      title: 'Core-to-Distribution',
      body: `
<p><b>Core-to-distribution</b> adalah link fiber yang menghubungkan core switch ke distribution switch — "jalan tol" tempat traffic antar gedung mengalir. Desainnya menentukan kapasitas dan ketahanan seluruh site.</p>
<h3>Spesifikasi Link</h3>
<ul>
<li><b>Kecepatan</b>: minimal 10G per link di enterprise modern (1G hanya untuk site sangat kecil). Hitung dari agregat traffic distribution (Part 19.2: oversubscription 4:1).</li>
<li><b>Jumlah link</b>: minimal 2 link fisik per distribution (dual-homing) — satu ke tiap core (19.2).</li>
<li><b>Agregasi</b>: dua link 10G bisa digabung jadi 20G logis dengan <b>LAG/LACP</b> (Link Aggregation) — sekaligus redundansi: satu putus, sisa 10G tetap jalan.</li>
</ul>
<h3>Packet Flow di Link Ini</h3>
<pre>PC Gedung A → Server Gedung B:
Access(A) → Dist(A) → [fiber 10G] → Core → [fiber 10G] → Dist(B)
→ Access(B) → Server
Link fiber hanya meneruskan frame — secepat mungkin, tanpa inspeksi.</pre>
<h3>Single-Mode vs Multi-Mode</h3>
<div class="tblwrap"><table>
<tr><th></th><th>Single-Mode (OS2)</th><th>Multi-Mode (OM3/OM4)</th></tr>
<tr><td>Jarak 10G</td><td>10 km+ (sangat jauh)</td><td>300–550 m</td></tr>
<tr><td>Harga kabel</td><td>Murah (kabelnya)</td><td>Mahal</td></tr>
<tr><td>Harga SFP</td><td>Mahal</td><td>Murah</td></tr>
<tr><td>Pakai kapan</td><td>Antar gedung/kampus/kota</td><td>Dalam gedung / antar lantai</td></tr>
</table></div>
<p>Aturan praktis: <b>antar gedung = single-mode</b> (jarak + masa depan). Multi-mode hanya untuk dalam gedung jarak pendek.</p>`,
      terms: [
        ['Dual-homing', 'Satu distribution terhubung ke dua core via dua link terpisah.'],
        ['LAG/LACP', 'Link Aggregation — menggabung beberapa link fisik menjadi satu logis (tambah bandwidth + redundansi).'],
        ['Single-mode', 'Fiber satu jalur cahaya; jarak jauh (km), untuk antar gedung.'],
        ['Multi-mode', 'Fiber banyak jalur cahaya; jarak pendek (ratusan meter), untuk dalam gedung.'],
        ['Oversubscription', 'Rasio kapasitas access vs uplink (mis. 4:1) — asumsi tidak semua user penuh bersamaan.'],
      ],
      diagram: `<pre>        CORE-TO-DISTRIBUTION LINK

[Dist-A] ═══════╗
   | 10G fiber   ║  LAG/LACP: 2x10G = 20G logis
   | (single-    ║  satu putus → 10G tersisa
   |  mode OS2)  ║
[Dist-A] ═══════╝
      \\           //
       \\         //
      [ Core-1 ] [ Core-2 ]

Dual-homing: tiap distribution ke KEDUA core.</pre>`,
      scenario:
        'Gedung baru dihubungkan ke core dengan 1 link fiber 1G "sementara". Tiga tahun kemudian gedung itu punya 300 user dan link 1G jenuh setiap jam 9 pagi — upgrade butuh tarik kabel baru (galian lagi). Jika sejak awal 2x10G single-mode, upgrade hanya ganti SFP.',
      bestPractices:
        'Standarkan single-mode OS2 untuk semua antar-gedung (satu standar = satu stok SFP cadangan). Selalu dual-homing + LAG. Ukur utilisasi link tiap kuartal.',
      security:
        'Link core-distribution membawa semua VLAN (termasuk 99). Pastikan tidak ada tap ilegal: periksa loss budget berkala (tap menambah loss) — dibahas di 21.7.',
      challenge:
        'Distribution melayani 400 user @ 2 Mbps rata-rata jam sibuk, oversubscription 4:1. Hitung kebutuhan uplink ke core dan tentukan: 1x10G cukup? 2x10G LAG? Tulis perhitungannya.',
      interviewQ:
        'Q: "Kapan memakai single-mode vs multi-mode?" — A: Single-mode untuk antar gedung/jarak jauh (km) — kabel murah, SFP mahal, future-proof. Multi-mode untuk dalam gedung <550 m — SFP murah. Standar enterprise modern: single-mode untuk semua backbone baru.',
      quiz: [
        {
          q: 'Apa keuntungan LAG/LACP pada link core-distribution?',
          options: [
            'Mengurangi jumlah kabel',
            'Menggabung bandwidth beberapa link sekaligus memberi redundansi — satu link putus, sisanya tetap jalan',
            'Menghilangkan butuh SFP',
            'Membuat fiber lebih murah',
          ],
          answer: 1,
          explain: 'LAG = agregasi + failover dalam satu fitur: 2x10G menjadi 20G logis, dan putusnya satu link tidak mematikan koneksi.',
        },
        {
          q: 'Untuk fiber antar gedung (500 m), pilihan yang tepat adalah…',
          options: [
            'Multi-mode, karena SFP-nya murah',
            'Single-mode OS2 — standar future-proof untuk antar gedung, jarak jauh, dan upgrade mudah',
            'Kabel UTP Cat6',
            'Kabel listrik',
          ],
          answer: 1,
          explain: 'Antar gedung = single-mode: jarak jauh, kebal upgrade kecepatan (cukup ganti SFP), satu standar untuk seluruh backbone.',
        },
        {
          q: 'Apa itu dual-homing pada distribution switch?',
          options: [
            'Dua kabel ke satu core yang sama',
            'Terhubung ke dua core berbeda via link terpisah — satu core mati, satunya mengambil alih',
            'Dua IP address',
            'Dua VLAN',
          ],
          answer: 1,
          explain: 'Dual-homing menghilangkan single point of failure di core: tiap distribution punya jalur ke Core-1 dan Core-2.',
        },
      ],
    },
    {
      id: '21.3',
      title: 'ODF',
      body: `
<p><b>ODF</b> (Optical Distribution Frame) adalah <b>panel/rak tempat kabel fiber backbone diakhiri (terminasi)</b> dan didistribusikan ke perangkat via patch cord. Ini "terminal bus" fiber di tiap gedung/ruang server.</p>
<h3>Fungsi ODF</h3>
<ul>
<li><b>Terminasi</b> — ujung kabel backbone (yang disambung/splice) diakhiri di adapter rapi, bukan menjuntai mentah.</li>
<li><b>Distribusi</b> — dari ODF, teknisi menyambung <b>patch cord</b> ke SFP di switch (21.5–21.6).</li>
<li><b>Proteksi</b> — splice dan konektor sensitif dilindungi di dalam box tertutup dari debu dan sentuhan.</li>
<li><b>Dokumentasi fisik</b> — tiap port ODF dilabel: dari mana, ke mana, core berapa.</li>
</ul>
<h3>Komponen di Dalam ODF</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Fungsi</th></tr>
<tr><td>Splice tray</td><td>Tempat sambungan splice (fusion) antar serat — dilindungi</td></tr>
<tr><td>Adapter/panel</td><td>Konektor (LC/SC) tempat patch cord dicolok</td></tr>
<tr><td>Pigtail</td><td>Serat pendek berkonektor yang di-splice ke kabel backbone</td></tr>
<tr><td>Label port</td><td>Identitas tiap port: asal–tujuan–nomor core</td></tr>
</table></div>
<h3>Alur Koneksi via ODF</h3>
<pre>Kabel backbone ──splice──▶ pigtail ──▶ adapter ODF ◀── patch cord ──▶ SFP switch
                 (di splice tray)      (port 07)         (kuning, LC-LC)

Teknisi tidak pernah menyentuh kabel backbone langsung —
semua kerja lewat patch cord di ODF. Backbone aman.</pre>
<div class="callout"><div class="t">Mengapa Tidak Langsung ke Switch?</div><p style="margin:4px 0 0">Kabel backbone kaku dan mahal; mencolok-cabut langsung merusaknya. ODF menjadi <b>titik demarkasi</b>: sisi backbone (jarang disentuh, stabil) vs sisi patch (sering diubah, fleksibel). Kerusakan patch cord = ganti Rp ratusan ribu; kerusakan backbone = splice ulang + downtime.</p></div>`,
      terms: [
        ['ODF', 'Optical Distribution Frame — panel terminasi dan distribusi fiber di tiap lokasi.'],
        ['Terminasi', 'Pengakhiran kabel fiber di konektor/adapter yang rapi.'],
        ['Pigtail', 'Serat pendek berkonektor yang di-splice ke ujung kabel backbone.'],
        ['Splice tray', 'Baki pelindung tempat sambungan splice disimpan rapi.'],
        ['Titik demarkasi', 'Batas tanggung jawab: sisi backbone vs sisi patch/user.'],
      ],
      diagram: `<pre>              ANATOMI ODF

┌─────────────── ODF Box (terkunci) ───────────────┐
│ [Splice tray: backbone──splice──pigtail]          │
│ [Panel adapter: port 01-24, konektor LC]         │
│   Port 07: "BB-CORE1→GED-A, core 3-4" (label!)   │
└──────────────────────────────────────────────────┘
        ▲ backbone (jarang disentuh)
        │ patch cord kuning LC-LC (sering diubah)
        ▼
   [SFP di switch]</pre>`,
      scenario:
        'Teknisi butuh memindahkan uplink dari switch lama ke baru. Karena ada ODF, ia cukup mencabut patch cord dan colok ke switch baru — 2 menit, tanpa menyentuh backbone. Tanpa ODF (backbone langsung ke switch), ia harus splice ulang: 2 jam + risiko merusak kabel.',
      bestPractices:
        'Label SEMUA port ODF di kedua ujung dengan format konsisten (asal–tujuan–core). Kunci ODF; catat setiap buka-tutup. Jangan tekuk patch cord melebihi radius tekuk minimum.',
      security:
        'ODF yang tidak terkunci = akses fisik ke seluruh backbone. Kunci + log akses. Peta ODF adalah dokumen sensitif (jangan ditempel di dinding publik).',
      challenge:
        'Rancang label untuk ODF 24 port di Gedung A yang menerima 2 kabel backbone (12 core tiap kabel) dari Core Site. Buat skema penomoran + format label tiap port.',
      interviewQ:
        'Q: "Apa fungsi ODF dan mengapa backbone tidak langsung dicolok ke switch?" — A: ODF adalah titik terminasi & distribusi: melindungi splice, menjadi demarkasi (backbone stabil vs patch fleksibel), dan memudahkan perubahan tanpa menyentuh kabel backbone yang mahal/rapuh.',
      quiz: [
        {
          q: 'Apa fungsi utama ODF?',
          options: [
            'Memperkuat sinyal fiber',
            'Terminasi kabel backbone yang rapi + titik distribusi ke perangkat via patch cord + proteksi splice',
            'Menggantikan switch',
            'Menyimpan kabel cadangan',
          ],
          answer: 1,
          explain: 'ODF = terminal fiber: backbone diakhiri rapi di sini, lalu didistribusikan via patch cord yang mudah diubah tanpa menyentuh backbone.',
        },
        {
          q: 'Mengapa ada titik demarkasi antara backbone dan patch cord?',
          options: [
            'Agar terlihat profesional',
            'Backbone mahal/rapuh dan jarang diubah; patch cord murah/fleksibel — kerusakan patch tidak merembet ke backbone',
            'Karena aturan vendor',
            'Agar lebih cepat',
          ],
          answer: 1,
          explain: 'Demarkasi memisahkan yang stabil (backbone) dari yang dinamis (patch); ganti patch cord = murah dan cepat, tanpa risiko ke backbone.',
        },
        {
          q: 'Apa itu pigtail dalam konteks ODF?',
          options: [
            'Kabel power untuk ODF',
            'Serat pendek berkonektor yang di-splice ke ujung kabel backbone lalu dicolok ke adapter',
            'Alat pembersih konektor',
            'Jenis switch',
          ],
          answer: 1,
          explain: 'Pigtail menjembatani kabel backbone (tanpa konektor) ke panel adapter — disambung via fusion splice di splice tray.',
        },
      ],
    },
    {
      id: '21.4',
      title: 'OTB',
      body: `
<p><b>OTB</b> (Optical Termination Box) adalah <b>versi kecil ODF</b> — box terminasi fiber untuk titik-titik kecil: ujung gedung, lantai, atau outdoor (tiang/façade). Fungsinya sama dengan ODF, skalanya mini.</p>
<h3>ODF vs OTB</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>ODF</th><th>OTB</th></tr>
<tr><td>Kapasitas</td><td>24–144 port (rak)</td><td>4–24 port (box kecil)</td></tr>
<tr><td>Lokasi</td><td>Ruang server / data center</td><td>Wiring closet, tiang, dinding outdoor</td></tr>
<tr><td>Fungsi</td><td>Distribusi utama</td><td>Terminasi ujung / titik transisi</td></tr>
</table></div>
<h3>Kapan Memakai OTB?</h3>
<ul>
<li><b>Transisi outdoor→indoor</b> — kabel outdoor (keras, anti-UV) diakhiri di OTB di dinding luar, lalu disambung kabel indoor yang fleksibel ke dalam gedung.</li>
<li><b>Percabangan kecil</b> — satu gedung kecil hanya butuh 4 core; OTB cukup, ODF rak terlalu besar.</li>
<li><b>Titik splice lapangan</b> — menyambung dua segmen kabel di tengah rute.</li>
</ul>
<h3>Hierarki Fisik</h3>
<pre>[Core ODF] ══backbone══▶ [OTB Gedung B] ══indoor══▶ [ODF ruang server B]
   (rak besar)      (transisi outdoor)         (distribusi ke switch)

Aturan: tiap transisi (ODF→OTB→ODF) menambah loss (redaman) —
dihitung di link budget (21.7). Jangan terlalu banyak titik.</pre>
<div class="callout"><div class="t">OTB Outdoor</div><p style="margin:4px 0 0">OTB outdoor harus <b>IP65</b> (tahan air/debu) dan tahan UV. Salah pilih box = air masuk = korosi konektor = loss naik perlahan sampai link putus saat hujan deras. Selalu cek rating outdoor.</p></div>`,
      terms: [
        ['OTB', 'Optical Termination Box — box terminasi fiber skala kecil untuk titik ujung/transisi.'],
        ['IP65', 'Rating proteksi: tahan debu total dan semprotan air — standar box outdoor.'],
        ['Transisi outdoor-indoor', 'Titik pergantian kabel outdoor (kaku, anti-UV) ke kabel indoor (fleksibel).'],
      ],
      diagram: `<pre>           ODF vs OTB

[Core Site: ODF rak 96 port]
       │ backbone outdoor
       ▼
[Dinding Gedung B: OTB 8 port, IP65] ← transisi outdoor→indoor
       │ kabel indoor
       ▼
[Ruang server B: ODF 24 port] → patch cord → switch

Makin sedikit titik transisi, makin kecil total loss.</pre>`,
      scenario:
        'ISP menarik fiber ke ruko pelanggan: kabel outdoor berhenti di OTB kecil di dinding luar ruko, lalu teknisi sambung kabel indoor ke router dalam. Saat router pindah ruangan, cukup ganti patch indoor — OTB dan kabel outdoor tidak tersentuh.',
      bestPractices:
        'Minimalkan titik transisi (tiap titik = loss + titik kegagalan). Label OTB sama ketatnya dengan ODF. Untuk outdoor: pastikan IP65 dan grounding benar.',
      security:
        'OTB outdoor di tempat publik rawan dibuka orang — pakai box yang bisa digembok dan pasang di ketinggian/posisi tidak mudah dijangkau.',
      challenge:
        'Rute fiber melewati 2 OTB transisi sebelum sampai ODF tujuan. Tiap konektor menambah ~0.5 dB loss. Hitung tambahan loss total dan tentukan apakah masih dalam budget (lihat 21.7).',
      interviewQ:
        'Q: "Apa bedanya ODF dan OTB, kapan memakai OTB?" — A: ODF = panel distribusi besar di ruang server; OTB = box terminasi kecil untuk titik ujung/transisi (outdoor→indoor, gedung kecil, splice lapangan). Fungsinya sama (terminasi rapi), skalanya beda.',
      quiz: [
        {
          q: 'Kapan OTB dipakai alih-alih ODF?',
          options: [
            'Selalu — ODF sudah usang',
            'Titik kecil: transisi outdoor→indoor, gedung kecil, atau splice lapangan — kapasitas 4–24 port cukup',
            'Tidak pernah',
            'Hanya di data center',
          ],
          answer: 1,
          explain: 'OTB adalah ODF mini untuk titik ujung/transisi; ODF rak tetap dipakai untuk distribusi utama di ruang server.',
        },
        {
          q: 'Mengapa tiap titik transisi (OTB/ODF) perlu dihitung dalam link budget?',
          options: [
            'Karena menambah biaya',
            'Tiap konektor/splice menambah redaman (loss) — terlalu banyak titik bisa membuat sinyal terlalu lemah',
            'Karena memperlambat teknisi',
            'Tidak perlu dihitung',
          ],
          answer: 1,
          explain: 'Setiap sambungan menambah loss ~0.3–0.5 dB; akumulasi titik yang banyak bisa melampaui budget dan membuat link gagal.',
        },
        {
          q: 'Syarat penting OTB yang dipasang outdoor adalah…',
          options: [
            'Warna yang menarik',
            'Rating IP65 (tahan air/debu) dan tahan UV — air masuk menyebabkan korosi dan loss naik',
            'Ukuran sebesar mungkin',
            'Harus transparan',
          ],
          answer: 1,
          explain: 'Box outdoor tanpa proteksi = air dan debu masuk, konektor korosi, loss naik perlahan hingga link putus.',
        },
      ],
    },
    {
      id: '21.5',
      title: 'Fiber Patch',
      body: `
<p><b>Fiber patch cord</b> (kabel patch fiber) adalah kabel fiber pendek fleksibel yang menghubungkan <b>port ODF ke SFP di switch</b> (atau antar panel). Ini komponen yang paling sering disentuh — dan paling sering jadi sumber masalah.</p>
<h3>Jenis Patch Cord</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Pilihan</th><th>Catatan</th></tr>
<tr><td>Mode</td><td>Single-mode (kuning) / Multi-mode (aqua/oranye)</td><td><b>Harus sama</b> dengan backbone & SFP!</td></tr>
<tr><td>Konektor</td><td>LC (kecil, umum di SFP), SC (lebih besar, di ODF lama)</td><td>Sesuaikan kedua ujung (LC-LC, LC-SC…)</td></tr>
<tr><td>Polish</td><td>UPC (biru, ujung datar) / APC (hijau, ujung miring 8°)</td><td><b>Jangan campur!</b> UPC↔APC merusak dan loss besar</td></tr>
<tr><td>Jumlah serat</td><td>Duplex (2 serat: kirim+terima) / Simplex</td><td>Umumnya duplex untuk switch</td></tr>
</table></div>
<h3>Aturan Emas Patch Cord</h3>
<ul>
<li><b>Jangan campur mode</b> — patch multi-mode di link single-mode = link gagal total.</li>
<li><b>Jangan campur UPC/APC</b> — konektor hijau (APC) hanya dengan hijau; biru (UPC) dengan biru.</li>
<li><b>Jaga kebersihan</b> — debu sekecil apa pun di ujung konektor menambah loss besar. Bersihkan dengan <b>pen cleaner</b> khusus sebelum colok; <b>jangan tiup</b> (air liur = kontaminasi).</li>
<li><b>Hormati bend radius</b> — jangan tekuk tajam; tekukan merusak serat (micro-bend → loss).</li>
<li><b>Tutup dengan dust cap</b> — port/konektor yang tidak dipakai selalu bertutup.</li>
</ul>
<div class="callout"><div class="t">Fakta Lapangan</div><p style="margin:4px 0 0">Mayoritas gangguan fiber "misterius" (link flapping, CRC error) ternyata <b>konektor kotor</b> — bukan kabel putus. Pembersihan 30 detik sering menyelesaikan "gangguan" yang dikira butuh splice ulang. Selalu bersihkan dulu sebelum mengganti.</p></div>`,
      terms: [
        ['Patch cord', 'Kabel fiber pendek fleksibel penghubung ODF–perangkat.'],
        ['UPC / APC', 'Jenis polish ujung konektor: UPC biru (datar), APC hijau (miring 8°) — tidak boleh dicampur.'],
        ['Bend radius', 'Radius tekuk minimum kabel fiber; tekukan tajam merusak serat.'],
        ['Dust cap', 'Tutup pelindung konektor/port yang tidak dipakai.'],
      ],
      diagram: `<pre>        PATCH CORD YANG BENAR

[ODF port 07] ──(patch duplex LC-LC, kuning/SM, UPC biru)──▶ [SFP switch]
   Tx ──────────▶ Rx
   Rx ◀────────── Tx     ← Tx satu ujung ke Rx ujung lain (crossover
                           alami duplex; jangan sampai Tx-Tx!)

Cek sebelum colok: mode sama? konektor sama? UPC/APC sama? bersih?</pre>`,
      scenario:
        'Link fiber 10G flapping setiap beberapa menit. Teknisi hendak splice ulang (rencana 4 jam). Senior datang, cabut patch cord, bersihkan dengan pen cleaner, colok kembali — link stabil. Total: 5 menit. Debu adalah musuh nomor satu fiber.',
      bestPractices:
        'Stok pen cleaner dan dust cap di setiap site. Label patch cord (dari–ke). Jangan mencabut patch dengan menarik kabelnya — pegang konektornya.',
      security:
        'Patch cord yang menjuntai keluar rak rawan dicabut iseng/sabotase. Rapikan dengan cable management; ODF/rak selalu terkunci.',
      challenge:
        'Link tidak up setelah ganti patch cord. Buat checklist diagnosis 6 langkah berurutan (mulai dari yang paling mungkin/termurah): apa yang dicek dan dengan apa?',
      interviewQ:
        'Q: "Link fiber flapping, apa yang kamu cek pertama?" — A: Kebersihan konektor (bersihkan kedua ujung + SFP), lalu kecocokan mode/konektor/UPC-APC patch cord, lalu Tx/Rx tidak tertukar, baru kemudian ukur daya (light meter) dan OTDR untuk kabel backbone.',
      quiz: [
        {
          q: 'Apa penyebab paling umum link fiber flapping/CRC error?',
          options: [
            'Kabel backbone putus',
            'Konektor kotor — debu di ujung serat menambah loss besar',
            'Switch terlalu panas',
            'VLAN salah',
          ],
          answer: 1,
          explain: 'Pengalaman lapangan: mayoritas "gangguan misterius" fiber selesai dengan pembersihan konektor 30 detik — selalu cek ini dulu.',
        },
        {
          q: 'Mengapa konektor UPC (biru) dan APC (hijau) tidak boleh dicampur?',
          options: [
            'Warnanya tidak cocok',
            'Bentuk ujung berbeda (datar vs miring 8°) — dipaksa campur merusak konektor dan menimbulkan loss besar',
            'Harganya beda',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'UPC datar vs APC miring: disambung paksa membuat celah udara/kerusakan fisik — refleksi tinggi dan loss besar.',
        },
        {
          q: 'Mengapa tidak boleh meniup konektor fiber untuk membersihkannya?',
          options: [
            'Karena tidak sopan',
            'Udara dari mulut mengandung uap air/partikel yang justru mengkontaminasi ujung serat',
            'Karena terlalu pelan',
            'Boleh saja sebenarnya',
          ],
          answer: 1,
          explain: 'Gunakan pen cleaner khusus fiber; tiupan mulut menambah kontaminasi (kelembapan) di permukaan yang harus steril optik.',
        },
      ],
    },
    {
      id: '21.6',
      title: 'SFP',
      body: `
<p><b>SFP</b> (Small Form-factor Pluggable) adalah <b>modul transceiver</b> kecil yang dicolok ke switch — mengubah sinyal listrik menjadi cahaya (dan sebaliknya). SFP menentukan <b>kecepatan, jarak, dan tipe fiber</b> suatu port.</p>
<h3>Jenis SFP (Pilih Sesuai Kebutuhan)</h3>
<div class="tblwrap"><table>
<tr><th>Tipe</th><th>Kecepatan</th><th>Fiber</th><th>Jarak tipikal</th></tr>
<tr><td>1000BASE-SX</td><td>1G</td><td>Multi-mode</td><td>550 m</td></tr>
<tr><td>1000BASE-LX</td><td>1G</td><td>Single-mode</td><td>10 km</td></tr>
<tr><td>10GBASE-SR</td><td>10G</td><td>Multi-mode OM3</td><td>300 m</td></tr>
<tr><td>10GBASE-LR</td><td>10G</td><td>Single-mode</td><td>10 km</td></tr>
<tr><td>25G/40G/100G</td><td>25G+</td><td>Single-mode</td><td>10 km+</td></tr>
</table></div>
<h3>Aturan Memilih & Memasang SFP</h3>
<ul>
<li><b>Pasangan harus sejenis</b> — 10GBASE-LR hanya dengan 10GBASE-LR di ujung lain. Beda tipe = tidak link.</li>
<li><b>Sesuai dengan fiber</b> — SFP single-mode wajib kabel single-mode (dan sebaliknya).</li>
<li><b>Perhatikan wavelength</b> — pasangan BiDi (satu serat) harus TX/RX berpasangan (mis. 1310/1550 nm).</li>
<li><b>Kompatibilitas vendor</b> — switch kadang menolak SFP non-original ("unsupported transceiver"). Cek compatibility matrix; SFP third-party berkualitas + coding yang tepat biasanya OK dan jauh lebih murah.</li>
<li><b>Jangan lihat langsung ke SFP aktif!</b> — cahaya laser (terutama single-mode) tak terlihat tapi merusak mata. Selalu asumsikan ada cahaya.</li>
</ul>
<h3>Diagnosis via DOM/DDM</h3>
<p>SFP modern punya <b>DOM</b> (Digital Optical Monitoring): switch bisa membaca <b>Tx power, Rx power, suhu, voltase</b>. Rx power yang turun perlahan = indikasi konektor kotor atau fiber bermasalah — deteksi dini sebelum link putus.</p>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">SFP adalah <b>Layer 1</b>: ia hanya mengubah listrik↔cahaya. Ia tidak tahu VLAN/IP. Gangguan SFP (power turun, suhu tinggi) muncul sebagai error Layer 1–2: link flapping, CRC error, input errors naik.</p></div>`,
      terms: [
        ['SFP', 'Small Form-factor Pluggable — modul transceiver listrik↔cahaya yang dicolok ke switch.'],
        ['Transceiver', 'Perangkat yang mengirim (transmit) dan menerima (receive) sinyal.'],
        ['DOM/DDM', 'Digital Optical Monitoring — sensor di SFP yang melaporkan daya Tx/Rx, suhu, voltase.'],
        ['Wavelength', 'Panjang gelombang cahaya laser (mis. 1310 nm) — pasangan BiDi harus komplementer.'],
        ['BiDi', 'Bidirectional — satu serat untuk kirim-terima dengan wavelength berbeda tiap arah.'],
      ],
      diagram: `<pre>            SFP DI SWITCH

┌────────── Switch ──────────┐
│ [port SFP] ◀──▶ [SFP 10G-LR] ◀── patch LC ──▶ [ODF]
│   listrik ↕ cahaya (transceiver)   Tx/Rx power bisa
└──────────────────────────────┘    dibaca via DOM

Pasangan: LR↔LR, SM↔SM, UPC↔UPC. Jangan intip laser!</pre>`,
      scenario:
        'Upgrade backbone 1G→10G: kabel single-mode antar gedung tidak diganti (masih bagus), hanya SFP diganti dari 1000BASE-LX ke 10GBASE-LR di kedua ujung — 30 menit per site, tanpa galian. Inilah gunanya menanam single-mode sejak awal.',
      bestPractices:
        'Stok SFP cadangan 1–2 per tipe yang dipakai (SFP adalah komponen yang cukup sering gagal). Catat serial number SFP per port. Jangan cabut SFP dengan patch masih tercolok.',
      security:
        'SFP third-party dari sumber tak jelas berisiko (firmware jahat pernah ditemukan). Beli dari supplier tepercaya; untuk infrastruktur kritis pertimbangkan original.',
      challenge:
        'Butuh link 10G sejauh 2 km antar gedung dengan kabel single-mode OS2. Pilih tipe SFP yang tepat, hitung jumlah yang dibutuhkan (termasuk cadangan), dan perkirakan komponen lain yang perlu dicek kompatibilitasnya.',
      interviewQ:
        'Q: "Link fiber tidak up setelah ganti SFP. Apa yang kamu cek?" — A: Tipe SFP sama di kedua ujung? Sesuai dengan mode fiber? Kompatibel dengan switch (unsupported transceiver)? Tx/Rx tidak tertukar? Bersihkan konektor, lalu cek DOM (Rx power masuk akal?).',
      quiz: [
        {
          q: 'Syarat agar link fiber dengan SFP bisa up adalah…',
          options: [
            'SFP mahal',
            'Tipe SFP sama di kedua ujung DAN sesuai dengan mode fiber yang dipakai',
            'Switch harus merk sama',
            'Kabel harus baru',
          ],
          answer: 1,
          explain: 'LR hanya bicara dengan LR; SFP single-mode butuh fiber single-mode. Ketidakcocokan = link tidak akan up.',
        },
        {
          q: 'Apa fungsi DOM pada SFP?',
          options: [
            'Mempercepat SFP',
            'Monitoring digital: membaca Tx/Rx power, suhu, voltase — untuk deteksi dini penurunan kualitas',
            'Mengenkripsi data',
            'Menghemat daya',
          ],
          answer: 1,
          explain: 'DOM memberi visibilitas Layer 1: Rx power turun perlahan = peringatan dini sebelum link benar-benar putus.',
        },
        {
          q: 'Mengapa tidak boleh melihat langsung ke SFP yang aktif?',
          options: [
            'Karena silau',
            'Cahaya laser (terutama single-mode) tak terlihat mata tapi dapat merusak retina permanen',
            'Karena melanggar garansi',
            'Tidak ada bahaya',
          ],
          answer: 1,
          explain: 'Laser inframerah tidak memicu refleks kedip tapi tetap merusak mata — selalu asumsikan SFP aktif memancarkan cahaya.',
        },
      ],
    },
    {
      id: '21.7',
      title: 'Fiber Link Budget',
      body: `
<p><b>Link budget</b> (anggaran link) adalah perhitungan <b>apakah sinyal cahaya cukup kuat</b> sampai ke ujung penerima setelah dikurangi semua redaman (loss) di sepanjang jalur. Analogi: kamu punya uang Rp100rb (daya Tx), tiap "tol" memotong sekian (loss), sisa di ujung harus cukup untuk "parkir" (sensitivitas Rx).</p>
<h3>Komponen Perhitungan</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Contoh Nilai</th><th>Keterangan</th></tr>
<tr><td>Tx power (SFP)</td><td>-2 dBm</td><td>Kekuatan pancar (dari datasheet/DOM)</td></tr>
<tr><td>Rx sensitivity</td><td>-14 dBm</td><td>Batas lemah minimum yang masih terbaca</td></tr>
<tr><td>Loss kabel</td><td>0.4 dB/km (SM)</td><td>Redaman per km × jarak</td></tr>
<tr><td>Loss konektor</td><td>0.5 dB / pasang</td><td>Tiap pasang konektor (ODF, patch)</td></tr>
<tr><td>Loss splice</td><td>0.1 dB / splice</td><td>Tiap sambungan fusion</td></tr>
<tr><td>Safety margin</td><td>3 dB</td><td>Cadangan untuk penuaan/kotoran masa depan</td></tr>
</table></div>
<h3>Contoh Hitung (Single-Mode, 2 km)</h3>
<pre>Budget tersedia = Tx - Rx sensitivity = (-2) - (-14) = 12 dB
Loss total:
  Kabel:    2 km x 0.4 dB   = 0.8 dB
  Konektor: 4 pasang x 0.5  = 2.0 dB
  Splice:   2 x 0.1 dB      = 0.2 dB
  Margin:                   = 3.0 dB
  TOTAL LOSS                = 6.0 dB
Sisa = 12 - 6 = 6 dB  →  LINK LAYAK (sisa positif besar)

Jika sisa negatif/mepet (di bawah 3 dB): link berisiko — kurangi titik
konektor, perpendek rute, atau pakai SFP berdaya lebih besar.</pre>
<h3>Mengapa Ini Penting?</h3>
<p>Link yang "mepet budget" mungkin <b>up saat instalasi</b> tapi <b>flapping setahun kemudian</b> saat konektor kotor/menua. Link budget dengan margin 3 dB adalah <b>asuransi masa depan</b> — dan bukti profesionalisme saat serah terima project.</p>
<div class="callout blue"><div class="t">dB vs dBm</div><p style="margin:4px 0 0"><b>dBm</b> = daya absolut (relatif ke 1 mW): Tx/Rx power. <b>dB</b> = selisih/rasio: loss. Rumus praktis: dBm − dB = dBm. Tidak perlu kalkulator logaritma untuk link budget dasar — cukup tambah-kurang.</p></div>`,
      terms: [
        ['Link budget', 'Perhitungan daya sinyal vs total redaman untuk memastikan link layak.'],
        ['Tx power', 'Daya pancar SFP (dBm) — "modal" awal link.'],
        ['Rx sensitivity', 'Daya minimum yang masih bisa dibaca penerima (dBm).'],
        ['Loss/redaman', 'Penurunan daya sinyal (dB) akibat kabel, konektor, splice.'],
        ['Safety margin', 'Cadangan dB untuk degradasi masa depan (standar ~3 dB).'],
        ['dB / dBm', 'dB = rasio/selisih; dBm = daya absolut relatif terhadap 1 mW.'],
      ],
      diagram: `<pre>        KONSEP LINK BUDGET

Tx (-2 dBm) → [kabel 0.8dB] → [konektor 2.0dB] → [splice 0.2dB]
     → [margin 3dB] → Rx (-8 dBm) vs sensitivitas (-14 dBm)
                                             ▲
                                   sisa 6 dB → AMAN

Ibarat perjalanan: bensin (Tx) harus cukup melewati semua tol (loss)
dengan cadangan (margin) sampai tujuan (Rx sensitivity).</pre>`,
      scenario:
        'Kontraktor serah terima link fiber "up" tanpa link budget. Setahun kemudian link flapping tiap siang (panas memuai konektor). Pengukuran ulang: sisa budget hanya 1 dB — tidak ada margin. Perbaikan: ganti 2 patch cord berkualitas + bersihkan semua konektor, margin kembali 4 dB. Pelajaran: minta OTDR + link budget di setiap serah terima.',
      bestPractices:
        'Selalu hitung link budget sebelum instalasi dan ukur ulang (light source + power meter / OTDR) setelah instalasi. Simpan hasil ukur sebagai baseline — perbandingan di masa depan mempercepat diagnosis.',
      security:
        'Penurunan Rx power tiba-tiba tanpa sebab fisik bisa indikasi tap ilegal (penyadapan menambah loss). Baseline pengukuran membantumu membedakan "kotor" vs "disadap".',
      challenge:
        'Hitung link budget: SFP Tx −3 dBm, Rx sensitivity −15 dBm, jarak 5 km SM (0.4 dB/km), 6 pasang konektor, 4 splice, margin 3 dB. Layak atau tidak? Berapa sisanya?',
      interviewQ:
        'Q: "Apa itu link budget dan mengapa perlu safety margin?" — A: Perhitungan daya Tx dikurangi semua loss (kabel, konektor, splice) harus masih di atas sensitivitas Rx. Margin 3 dB menampung degradasi masa depan (kotoran, penuaan) agar link yang up hari ini tetap up 5 tahun lagi.',
      quiz: [
        {
          q: 'Apa yang dimaksud link budget?',
          options: [
            'Anggaran belanja kabel fiber',
            'Perhitungan daya sinyal vs total redaman untuk memastikan sinyal cukup kuat sampai penerima',
            'Biaya jasa instalasi',
            'Harga SFP',
          ],
          answer: 1,
          explain: 'Link budget = Tx power − semua loss ≥ Rx sensitivity (+ margin). Ini pembuktian teknis bahwa link layak, bukan sekadar "up".',
        },
        {
          q: 'Mengapa safety margin ~3 dB diperlukan?',
          options: [
            'Agar laporan terlihat bagus',
            'Menampung degradasi masa depan (konektor kotor, penuaan) agar link tetap stabil bertahun-tahun',
            'Syarat vendor SFP',
            'Agar teknisi dapat bonus',
          ],
          answer: 1,
          explain: 'Link tanpa margin mungkin up hari ini tapi flapping setahun kemudian saat kondisi memburuk — margin adalah asuransi.',
        },
        {
          q: 'Apa bedanya dB dan dBm?',
          options: [
            'Sama saja',
            'dBm = daya absolut (Tx/Rx power); dB = selisih/rasio (loss). Rumus: dBm − dB = dBm',
            'dB untuk kabel, dBm untuk SFP saja',
            'Tidak ada yang benar',
          ],
          answer: 1,
          explain: 'dBm mengukur daya terhadap 1 mW (absolut); dB mengukur perbandingan/selisih (relatif) — dipakai untuk loss.',
        },
      ],
    },
    {
      id: '21.8',
      title: 'Fiber Redundancy',
      body: `
<p><b>Fiber redundancy</b> (redundansi fiber) memastikan <b>satu kegagalan fisik tidak mematikan jaringan</b>. Redundansi harus dirancang di <b>tiga lapis</b>: jalur fisik, perangkat, dan logika.</p>
<h3>Tiga Lapis Redundansi</h3>
<div class="tblwrap"><table>
<tr><th>Lapis</th><th>Implementasi</th><th>Melindungi dari</th></tr>
<tr><td><b>Fisik</b></td><td>2 rute kabel berbeda (21.1)</td><td>Galian putus, banjir, kebakaran</td></tr>
<tr><td><b>Perangkat</b></td><td>Dual core, dual SFP, dual power</td><td>Switch/SFP mati</td></tr>
<tr><td><b>Logika</b></td><td>LAG/LACP, STP, routing failover</td><td>Link down — pindah otomatis</td></tr>
</table></div>
<p>Redundansi yang hanya di satu lapis adalah <b>ilusi</b>: dua link LAG dalam satu kabel yang putus = tetap down. Audit redundansi selalu tanya: "kegagalan tunggal apa yang masih mematikan saya?"</p>
<h3>Failover Otomatis</h3>
<p>Redundansi fisik tidak berguna tanpa <b>deteksi + perpindahan otomatis</b>: LAG memindahkan traffic dalam milidetik saat satu member down; routing protocol (OSPF, Part 12) menghitung ulang jalur. Uji failover <b>sebelum</b> dibutuhkan — kabel cadangan yang tidak pernah diuji sering ternyata rusak saat darurat.</p>
<h3>Topologi Ring vs Dual-Star</h3>
<pre>DUAL-STAR (disarankan): tiap distribution punya 2 jalur langsung ke core.
RING: gedung A→B→C→core — satu putus, traffic memutar jauh (latency naik),
      dua putus = ada yang terisolasi. Ring hanya untuk hemat kabel.</pre>
<div class="callout"><div class="t">Uji Rutin</div><p style="margin:4px 0 0">Jadwalkan <b>uji failover tiap 6 bulan</b>: cabut satu link fiber (di maintenance window), pastikan traffic pindah otomatis dan tidak ada alarm aneh. Redundansi yang tidak diuji = asumsi, bukan jaminan.</p></div>`,
      terms: [
        ['Redundansi', 'Cadangan berlapis agar satu kegagalan tidak melumpuhkan sistem.'],
        ['Failover', 'Perpindahan otomatis ke jalur/perangkat cadangan saat yang utama gagal.'],
        ['Dual-star', 'Topologi tiap distribution punya 2 jalur langsung ke core.'],
        ['Single point of failure', 'Satu titik yang jika gagal melumpuhkan semua — musuh redundansi.'],
      ],
      diagram: `<pre>        REDUNDANSI TIGA LAPIS

Fisik    : [Dist] ==rute utara==>> [Core]
           [Dist] ==rute selatan==>> [Core]   ← beda galian!
Perangkat: Core-1 & Core-2, dual SFP, dual PSU
Logika   : LAG (2 link = 1 logis), failover otomatis

Satu cangkul, satu SFP mati, satu link down → tetap jalan.</pre>`,
      scenario:
        'Bank punya "redundant link" ke data center — tapi audit menemukan kedua fiber lewat jembatan yang sama. Saat jembatan direnovasi, kedua kabel putus bersamaan: ATM offline 4 jam. Redundansi fisik yang benar butuh rute berbeda, bukan sekadar dua kabel.',
      bestPractices:
        'Desain redundansi tiga lapis sejak awal; dokumentasikan "apa yang terjadi jika X gagal" per komponen; uji failover berkala di maintenance window.',
      security:
        'Jalur redundan juga butuh pengamanan fisik sama (ODF terkunci, rute dirahasiakan). Penyerang yang tahu kedua rute bisa menargetkan keduanya.',
      challenge:
        'Audit topologi: 3 gedung ring fiber single link + single core. Identifikasi semua single point of failure dan rancang upgrade ke dual-star dengan estimasi prioritas (apa dulu yang diperbaiki?).',
      interviewQ:
        'Q: "Apa bedanya redundansi dan failover?" — A: Redundansi = adanya cadangan (kabel kedua, perangkat kedua). Failover = mekanisme pindah otomatis ke cadangan saat kegagalan. Cadangan tanpa failover otomatis = downtime manual.',
      quiz: [
        {
          q: 'Mengapa dua link dalam satu galian bukan redundansi yang benar?',
          options: [
            'Karena lebih mahal',
            'Satu kejadian fisik (galian putus) mematikan keduanya — redundansi butuh rute fisik terpisah',
            'Karena melanggar standar',
            'Tidak ada masalah',
          ],
          answer: 1,
          explain: 'Redundansi melindungi dari kegagalan; jika kedua link berbagi satu titik kegagalan fisik, perlindungannya ilusi.',
        },
        {
          q: 'Apa tiga lapis redundansi fiber?',
          options: [
            'Kabel, konektor, dan patch cord',
            'Fisik (rute berbeda), perangkat (dual core/SFP/power), logika (LAG/failover otomatis)',
            'Pagi, siang, dan malam',
            'Vendor A, B, dan C',
          ],
          answer: 1,
          explain: 'Ketiga lapis harus ada: jalur cadangan, perangkat cadangan, dan mekanisme pindah otomatis — satu lapis hilang = lubang.',
        },
        {
          q: 'Mengapa jalur cadangan harus diuji berkala?',
          options: [
            'Agar teknisi sibuk',
            'Kabel/port cadangan yang tidak pernah dipakai bisa rusak tanpa disadari — baru ketahuan saat darurat',
            'Syarat asuransi',
            'Tidak perlu diuji',
          ],
          answer: 1,
          explain: 'Redundansi yang tidak diuji hanyalah asumsi; uji failover berkala memastikan cadangan benar-benar berfungsi saat dibutuhkan.',
        },
      ],
    },
    {
      id: '21.9',
      title: 'Documentation',
      body: `
<p><b>Dokumentasi fiber</b> adalah peta lengkap infrastruktur fisik: rute, ODF, core, hasil ukur. Tanpa dokumentasi, setiap gangguan fiber menjadi ekspedisi pencarian — "kabelnya lewat mana ya?"</p>
<h3>Yang Wajib Didokumentasikan</h3>
<div class="tblwrap"><table>
<tr><th>Dokumen</th><th>Isi</th><th>Update Kapan</th></tr>
<tr><td>Peta rute</td><td>Jalur galian, patok, koordinat, kedalaman</td><td>Saat instalasi/perubahan rute</td></tr>
<tr><td>Skema ODF/OTB</td><td>Port, label asal–tujuan, nomor core</td><td>Tiap tambah/pindah koneksi</td></tr>
<tr><td>Core allocation</td><td>Core mana dipakai/spare/rusak</td><td>Tiap perubahan</td></tr>
<tr><td>Hasil ukur (OTDR/power)</td><td>Loss per segmen, baseline awal</td><td>Serah terima + tahunan</td></tr>
<tr><td>Link budget</td><td>Perhitungan per link (21.7)</td><td>Desain + tiap upgrade SFP</td></tr>
<tr><td>Kontak darurat</td><td>Kontraktor fiber, vendor SFP, pemilik lahan</td><td>Tiap ada perubahan</td></tr>
</table></div>
<h3>Format Praktis</h3>
<ul>
<li><b>Satu spreadsheet master</b> (atau IPAM/DCIM): tiap baris = satu link fiber (dari–ke, jarak, core, SFP, hasil ukur).</li>
<li><b>Foto ODF terlabel</b> — foto kondisi rapi sebagai referensi "seharusnya seperti ini".</li>
<li><b>As-built drawing</b> — gambar rute aktual (bukan rencana) setelah instalasi selesai.</li>
<li><b>Change log</b> — setiap buka ODF, ganti patch, atau splice dicatat: kapan, siapa, apa.</li>
</ul>
<h3>Dampak Nyata</h3>
<pre>Tanpa dokumentasi: "link Gedung B down" → 3 jam mencari ODF mana,
kabel mana, core berapa → baru mulai perbaiki.
Dengan dokumentasi: buka spreadsheet → "Link BB-02, ODF-B port 07,
core 3-4, baseline loss 2.1 dB" → ukur → ketahuan loss 8 dB di
segmen 2 → langsung ke titik masalah. 30 menit.</pre>
<div class="callout blue"><div class="t">Dokumentasi = Portfolio</div><p style="margin:4px 0 0">Dokumentasi fiber yang rapi adalah <b>artefak portfolio</b> yang kuat: menunjukkan kamu berpikir seperti engineer profesional, bukan sekadar bisa konfigurasi. Simpan contoh (dianonimkan) untuk interview.</p></div>`,
      terms: [
        ['As-built drawing', 'Gambar rute/konstruksi aktual setelah instalasi — bukan gambar rencana.'],
        ['OTDR', 'Optical Time Domain Reflectometer — alat ukur loss dan lokasi putus di sepanjang fiber.'],
        ['Baseline', 'Hasil ukur awal sebagai pembanding untuk diagnosis di masa depan.'],
        ['Change log', 'Catatan setiap perubahan: kapan, siapa, apa yang diubah.'],
      ],
      diagram: `<pre>        CONTOH BARIS DOKUMENTASI LINK

Link ID : BB-02
Dari    : ODF Core Site port 07 → Ke: ODF Gedung B port 03
Kabel   : SM OS2 12 core, 850 m, rute: utara (patok P1-P7)
Core    : 3-4 aktif (10G-LR), 5-12 spare, 1-2 rusak (2024)
SFP     : 10GBASE-LR s/n X123 (core) / Y456 (ged B)
Ukur    : 2026-01-10, loss 2.1 dB (baseline), OTDR terlampir
Kontak  : Kontraktor PT Maju Fiber — 0812-xxxx</pre>`,
      scenario:
        'Gangguan fiber jam 2 pagi. NOC membuka dokumentasi: langsung tahu link mana, ODF mana, core berapa, dan nomor kontraktor darurat. Teknisi tiba dengan info lengkap — perbaikan 1 jam. Tanpa dokumentasi, malam itu akan dihabiskan untuk "mencari tahu dulu".',
      bestPractices:
        'Dokumentasi dibuat SAAT instalasi (bukan "nanti"). Satu sumber kebenaran (spreadsheet/wiki), bukan foto WhatsApp tersebar. Review tahunan: cocokkan dokumen vs kondisi aktual.',
      security:
        'Peta rute fiber detail adalah informasi sensitif — simpan dengan akses terbatas (tim network + manajemen). Versi ringkas untuk NOC (cukup untuk troubleshooting, tanpa detail galian).',
      challenge:
        'Buat template spreadsheet dokumentasi fiber untuk 5 link: tentukan 10 kolom wajib dan isi 2 baris contoh dari desain Part 19–21 (Core→Gedung A/B).',
      interviewQ:
        'Q: "Apa saja yang kamu dokumentasikan untuk infrastruktur fiber dan mengapa?" — A: Peta rute, skema ODF, alokasi core, hasil ukur/baseline, link budget, dan kontak darurat. Tujuannya: troubleshooting cepat (tahu persis apa-di mana), perencanaan upgrade, dan serah terima profesional.',
      quiz: [
        {
          q: 'Mengapa hasil ukur awal (baseline) disimpan sebagai dokumentasi?',
          options: [
            'Untuk arsip saja',
            'Sebagai pembanding: penurunan kualitas di masa depan terdeteksi dengan membandingkan ukur baru vs baseline',
            'Syarat garansi toko',
            'Tidak ada gunanya',
          ],
          answer: 1,
          explain: 'Tanpa baseline kamu tidak tahu apakah loss 5 dB itu "normal sejak awal" atau "baru memburuk" — baseline membuat diagnosis objektif.',
        },
        {
          q: 'Apa itu as-built drawing?',
          options: [
            'Gambar rencana sebelum proyek',
            'Gambar rute/konstruksi aktual setelah instalasi selesai — yang benar-benar dibangun',
            'Gambar 3D gedung',
            'Logo kontraktor',
          ],
          answer: 1,
          explain: 'Rencana sering berubah di lapangan; as-built mencatat realitas — inilah yang dipakai troubleshooting bertahun-tahun kemudian.',
        },
        {
          q: 'Kapan dokumentasi fiber sebaiknya dibuat?',
          options: [
            'Nanti kalau sempat',
            'Saat instalasi berlangsung — menunda berarti detail hilang dan tidak pernah dibuat',
            'Setelah 5 tahun',
            'Tidak perlu dibuat',
          ],
          answer: 1,
          explain: 'Detail (nomor core, hasil ukur, rute aktual) hanya diketahui saat pengerjaan; menunda = mengandalkan ingatan yang pudar.',
        },
      ],
    },
  ],
};
