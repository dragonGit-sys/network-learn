// Part 30 — High Availability (Fase 6).
import type { Part } from './types';

export const part30: Part = {
  id: '30',
  number: 'PART 30',
  title: 'High Availability',
  phaseId: 'fase-6',
  description: 'Merancang jaringan yang tetap hidup saat ada kegagalan: SPOF, redundancy, HSRP/VRRP/GLBP, dual ISP, dan failover.',
  repoFolder: 'part-30-high-availability',
  objectives: [
    'Menjelaskan konsep high availability (downtime, SLA, "nine") dan mengidentifikasi single point of failure dalam sebuah desain.',
    'Menerapkan gateway redundancy dengan HSRP, VRRP, dan GLBP di Cisco IOS (serta VRRP di MikroTik), termasuk perbedaan LAB vs production.',
    'Merancang redundancy di level link (LACP) dan level WAN (dual ISP) beserta mekanisme failover-nya.',
    'Menguji failover secara aman dan terdokumentasi.',
  ],
  prerequisites: 'Part 01–29 (terutama IP & gateway, VLAN, routing, dan troubleshooting — HA adalah "asuransi" untuk semua itu).',
  subbabs: [
    {
      id: '30.1',
      title: 'Mengapa HA?',
      body: `<p><b>High Availability (HA)</b> adalah praktik merancang sistem agar <b>tetap beroperasi walaupun ada komponen yang gagal</b> — dengan cara tidak bergantung pada satu komponen saja. Sederhananya: <i>"kalau yang ini mati, yang satunya langsung ambil alih tanpa user sadar."</i></p>
<h3>Mengapa Dibutuhkan? (Bahasa Bisnis)</h3>
<ul>
<li><b>Downtime = uang hilang:</b> kasir tidak bisa transaksi, pabrik berhenti, e-commerce kehilangan order tiap menit. Di NOC, kamu akan ditanya "berapa lama down?" — bukan "kenapa down?"</li>
<li><b>Reputasi:</b> bank yang mobile banking-nya sering down kehilangan kepercayaan — dan nasabah.</li>
<li><b>Keselamatan:</b> di rumah sakit atau bandara, jaringan yang down bisa berarti nyawa.</li>
</ul>
<h3>Mengukur HA: "Nine" & SLA</h3>
<div class="tblwrap"><table>
<tr><th>Availability</th><th>Sebutan</th><th>Downtime Maks/Tahun</th><th>Artinya</th></tr>
<tr><td>99%</td><td>two nines</td><td>~3,65 hari</td><td>Tanpa redundancy serius</td></tr>
<tr><td>99,9%</td><td>three nines</td><td>~8,8 jam</td><td>Redundancy dasar (target umum enterprise)</td></tr>
<tr><td>99,99%</td><td>four nines</td><td>~53 menit</td><td>Redundancy penuh + proses matang</td></tr>
<tr><td>99,999%</td><td>five nines</td><td>~5 menit</td><td>Carrier-grade (operator telekomunikasi)</td></tr>
</table></div>
<p><b>SLA (Service Level Agreement)</b> adalah janji tertulis: "jaringan tersedia 99,9% per bulan". Setiap menit downtime dihitung — dan bisa berujung penalti kontrak. Inilah alasan bisnis di balik semua teknologi di part ini.</p>
<div class="callout blue"><div class="t">HA ≠ Tidak Pernah Gagal</div><p style="margin:4px 0 0">HA tidak berarti komponen tidak pernah rusak — melainkan <b>kegagalan tidak terasa oleh user</b> karena ada cadangan yang langsung mengambil alih. Komponen tetap bisa (dan akan) rusak; yang dihilangkan adalah <i>dampaknya</i>.</p></div>`,
      terms: [
        ['High Availability (HA)', 'Desain agar layanan tetap jalan meski ada komponen gagal — via redundancy & failover otomatis.'],
        ['Downtime', 'Durasi layanan tidak tersedia — diukur dan ditagih dalam SLA.'],
        ['SLA', 'Service Level Agreement — janji tertulis tingkat layanan (mis. 99,9% uptime).'],
        ['Nine', 'Sebutan jumlah angka 9 di availability: 99,9% = three nines.'],
      ],
      diagram: `<pre>   TANPA HA vs DENGAN HA (saat router mati)

   TANPA HA:                              DENGAN HA:
   [User] ──▶ [R1 ✖ MATI] ──▶ [Internet]  [User] ──▶ [R1 ✖ MATI] ──▶ [Internet]
                 │                                        ╲
                 ▼                                         ╲▶ [R2 ✔] ──▶ [Internet]
              SEMUA DOWN                                  (ambil alih otomatis,
                                                           user tak sadar)</pre>`,
      scenario: 'Promo e-commerce 12.12: router edge tunggal overheat dan mati 40 menit — kerugian miliaran + trending buruk di media sosial. Investigasi: tidak ada redundancy karena "menghemat budget". Biaya satu router cadangan vs kerugian 40 menit downtime — matematikanya jelas setelah kejadian. Moral: HA dibeli <i>sebelum</i> bencana, bukan sesudah.',
      bestPractices: 'Hitung biaya downtime per jam untuk bisnismu — angka ini menjadi justifikasi budget redundancy yang paling meyakinkan bagi manajemen.',
      security: 'Redundancy juga pertahanan keamanan: serangan yang melumpuhkan satu device (mis. DDoS ke satu link) tidak melumpuhkan layanan bila ada jalur cadangan.',
      challenge: 'Hitung: jika tokomu rugi Rp500 ribu per jam downtime dan target three nines (8,8 jam/tahun), berapa potensi kerugian tahunan? Bandingkan dengan harga satu router cadangan.',
      interviewQ: 'Q: "Apa itu high availability dan bagaimana mengukurnya?" — A: Desain agar layanan tetap jalan saat komponen gagal (redundancy + failover otomatis). Diukur dengan availability % ("nines") dan downtime per tahun, diikat dalam SLA.',
      quiz: [
        { q: '"Three nines" (99,9%) berarti downtime maksimal sekitar…', options: ['3,6 hari/tahun', '8,8 jam/tahun', '53 menit/tahun', '5 menit/tahun'], answer: 1, explain: '0,1% × 8760 jam ≈ 8,76 jam — target umum enterprise dengan redundancy dasar.' },
        { q: 'HA pada dasarnya berarti…', options: ['Komponen tidak pernah rusak', 'Kegagalan komponen tidak terasa user karena ada cadangan yang ambil alih', 'Tanpa maintenance', 'Gratis'], answer: 1, explain: 'Komponen tetap bisa rusak; yang dihilangkan HA adalah dampaknya ke layanan.' },
        { q: 'SLA berkaitan dengan HA karena…', options: ['SLA mengatur gaji', 'SLA adalah janji tertulis availability — downtime dihitung & bisa berpenalti', 'SLA hanya untuk ISP', 'Tidak berkaitan'], answer: 1, explain: 'SLA mengikat target availability secara kontrak; HA adalah cara teknis memenuhinya.' },
      ],
    },
    {
      id: '30.2',
      title: 'Single Point of Failure',
      body: `<p><b>Single Point of Failure (SPOF)</b> adalah komponen yang, jika gagal, <b>menjatuhkan seluruh (atau sebagian besar) layanan</b> — tidak ada cadangan. Menemukan SPOF adalah langkah pertama <i>sebelum</i> membeli redundancy: kamu tidak bisa melindungi apa yang tidak kamu ketahui.</p>
<h3>Cara Menemukan SPOF: "What If" Walkthrough</h3>
<p>Telusuri diagram topologimu dan tanyakan untuk <b>setiap</b> komponen: <i>"kalau ini mati sekarang, apa yang ikut mati?"</i></p>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Kalau Mati…</th><th>SPOF?</th><th>Solusi (dibahas berikut)</th></tr>
<tr><td>Router edge tunggal</td><td>Seluruh site putus internet</td><td>YA</td><td>Dual router + VRRP/HSRP (30.5–30.7)</td></tr>
<tr><td>Core switch tunggal</td><td>Semua VLAN lumpuh</td><td>YA</td><td>Stack / dua core (30.3)</td></tr>
<tr><td>Link tunggal ke ISP</td><td>Internet putus</td><td>YA</td><td>Dual ISP (30.9)</td></tr>
<tr><td>Satu kabel uplink</td><td>Segmen terisolasi</td><td>YA (parsial)</td><td>EtherChannel/LACP (30.8)</td></tr>
<tr><td>Satu power supply</td><td>Device mati saat PSU rusak</td><td>YA</td><td>Dual PSU</td></tr>
<tr><td>Satu DNS server</td><td>"Internet mati" bagi user</td><td>YA (logis)</td><td>DNS sekunder (28.11)</td></tr>
</table></div>
<h3>SPOF Tidak Selalu Perangkat</h3>
<ul>
<li><b>SPOF manusia:</b> hanya satu orang yang paham konfigurasi core ("bus factor 1") — solusinya dokumentasi + cross-training.</li>
<li><b>SPOF listrik:</b> dua router cadangan tetapi satu jalur listrik yang sama — mati lampu = dua-duanya mati. Solusi: UPS + jalur listrik berbeda.</li>
<li><b>SPOF fisik:</b> dua link fiber cadangan tetapi lewat <b>satu duct/gorong-gorong</b> yang sama — satu galian = dua-duanya putus. Solusi: diverse path (jalur fisik berbeda).</li>
</ul>
<div class="callout"><div class="t">Redundancy Palsu</div><p style="margin:4px 0 0">Cadangan yang berbagi nasib dengan yang utama <b>bukan</b> redundancy: dua ISP yang ternyata satu infrastruktur, dua power supply satu MCB, dua link satu duct. Selalu tanya: <i>"apa yang bisa mematikan keduanya sekaligus?"</i></p></div>`,
      terms: [
        ['SPOF', 'Single Point of Failure — komponen tunggal yang kejatuhannya melumpuhkan layanan.'],
        ['Blast radius', 'Seberapa luas dampak satu kegagalan — SPOF = blast radius maksimal.'],
        ['Diverse path', 'Jalur fisik berbeda untuk link cadangan agar tak berbagi risiko galian/bencana.'],
        ['Bus factor', 'Jumlah orang yang "hilang" sebelum pengetahuan kritis ikut hilang — jangan sampai 1.'],
      ],
      diagram: `<pre>   MENEMUKAN SPOF: tanya "what if" tiap komponen

   [User]──[SW]──[R1]──[ISP-A]──[Internet]     [User]──[SW]──[R1]──[ISP-A]
                 ▲▲                                     ▲▲      ╲
                 ││ SPOF?                                ││ SPOF? ╲▶ [ISP-B]
              satu R1 = YA                           satu R1 = YA   bukan SPOF
              satu ISP = YA                          (tambah R2+VRRP)

   SPOF non-perangkat: 1 jalur listrik, 1 duct fiber, 1 orang paham config.</pre>`,
      scenario: 'Dua link "cadangan" ke data center ternyata lewat satu jembatan yang sama. Truk menabrak jembatan → kedua fiber putus → site isolasi total 6 jam. Setelahnya: audit diverse path untuk semua link kritis. Moral: redundancy di atas kertas ≠ redundancy di lapangan — verifikasi fisiknya.',
      bestPractices: 'Buat "SPOF register": daftar tiap SPOF + dampak + rencana mitigasi + prioritas. Review tiap ada perubahan topologi. Ini dokumen 1 halaman yang sangat dihargai auditor.',
      security: 'SPOF adalah target serangan: penyerang yang tahu satu DNS server / satu firewall akan fokus ke sana. Menghilangkan SPOF = menghilangkan target empuk.',
      challenge: 'Gambar topologi lab/kantormu dan lingkari semua SPOF dengan warna merah. Untuk tiap lingkaran, tulis satu kalimat mitigasi. Hitung: berapa SPOF tersisa?',
      interviewQ: 'Q: "Bagaimana kamu menemukan SPOF di sebuah jaringan?" — A: What-if walkthrough tiap komponen ("kalau ini mati, apa ikut mati?") — termasuk SPOF non-perangkat: listrik, jalur fisik, dan manusia (bus factor).',
      quiz: [
        { q: 'SPOF adalah…', options: ['Titik akses Wi-Fi', 'Komponen tunggal yang kejatuhannya melumpuhkan layanan karena tak ada cadangan', 'Kabel cadangan', 'Jenis serangan'], answer: 1, explain: 'Single Point of Failure = satu titik yang mematikan semua; langkah pertama HA adalah menemukannya.' },
        { q: 'Contoh "redundancy palsu"?', options: ['Dua router beda lokasi', 'Dua link fiber lewat satu duct yang sama — satu galian memutus keduanya', 'Dual PSU beda MCB', 'Dua ISP beda infrastruktur'], answer: 1, explain: 'Cadangan yang berbagi nasib (jalur fisik, listrik, infrastruktur) bukan redundancy sejati.' },
        { q: 'SPOF yang bukan perangkat contohnya…', options: ['Switch', 'Hanya satu orang paham konfigurasi core (bus factor 1)', 'Router', 'Kabel'], answer: 1, explain: 'Pengetahuan kritis di satu kepala = SPOF manusia; solusinya dokumentasi + cross-training.' },
      ],
    },
    {
      id: '30.3',
      title: 'Redundancy',
      body: `<p><b>Redundancy</b> adalah penyediaan <b>komponen cadangan</b> yang siap mengambil alih saat yang utama gagal. Ia adalah jawaban atas SPOF (30.2). Tetapi redundancy bukan sekadar "beli dua" — ada arsitektur dan trade-off yang harus dipahami.</p>
<h3>Dua Model Redundancy</h3>
<div class="tblwrap"><table>
<tr><th>Model</th><th>Cara Kerja</th><th>Kelebihan</th><th>Kekurangan</th></tr>
<tr><td><b>Active–Standby</b></td><td>Satu aktif, satu diam menunggu; failover saat aktif mati</td><td>Sederhana, tak ada konflik</td><td>Kapasitas cadangan menganggur (bayar 2, pakai 1)</td></tr>
<tr><td><b>Active–Active</b></td><td>Keduanya aktif berbagi beban; satu mati → sisanya menanggung semua</td><td>Efisien, throughput gabungan</td><td>Kompleks (butuh load sharing seperti GLBP/LACP)</td></tr>
</table></div>
<h3>Redundancy di Tiap Lapisan</h3>
<ul>
<li><b>Device:</b> dual router (VRRP/HSRP), switch stack, dual firewall, dual PSU.</li>
<li><b>Link:</b> EtherChannel/LACP — 2+ kabel jadi satu pipa logis (30.8).</li>
<li><b>Path:</b> routing protocol otomatis cari jalan lain (OSPF); dual ISP (30.9).</li>
<li><b>Gateway:</b> virtual IP gateway (30.4–30.7) — PC tidak perlu tahu router mana yang aktif.</li>
<li><b>Daya:</b> UPS + genset; dual power feed.</li>
</ul>
<h3>Biaya Redundancy (Jujur)</h3>
<ul>
<li><b>Uang:</b> perangkat ganda, link ganda, lisensi ganda.</li>
<li><b>Kompleksitas:</b> failover yang salah konfigurasi bisa <i>menyebabkan</i> outage (split-brain: dua-duanya mengklaim aktif!).</li>
<li><b>Operasional:</b> dua device = dua firmware di-patch, dua konfigurasi disinkronkan.</li>
</ul>
<p>Karena itu redundancy diprioritaskan: <b>hilangkan SPOF yang dampaknya terbesar dulu</b> (pakai SPOF register dari 30.2), bukan semua sekaligus.</p>
<div class="callout blue"><div class="t">Redundancy Tanpa Failover Test = Asumsi</div><p style="margin:4px 0 0">Cadangan yang belum pernah diuji failover-nya <b>belum tentu</b> berfungsi saat dibutuhkan (config tak sinkron, kabel salah). Jadwalkan <b>failover test</b> berkala di maintenance window (30.10). "Punya cadangan" ≠ "siap failover".</p></div>`,
      terms: [
        ['Redundancy', 'Komponen/link cadangan siap ambil alih — jawaban atas SPOF.'],
        ['Active–standby', 'Satu aktif, satu siaga. Sederhana; kapasitas siaga menganggur.'],
        ['Active–active', 'Keduanya aktif berbagi beban. Efisien; lebih kompleks.'],
        ['Split-brain', 'Kondisi gagal di mana dua node sama-sama mengklaim sebagai yang aktif — berbahaya.'],
        ['Failover', 'Peralihan otomatis dari komponen utama ke cadangan saat kegagalan.'],
      ],
      diagram: `<pre>   ACTIVE-STANDBY vs ACTIVE-ACTIVE

   Active–Standby:                 Active–Active:
   [User] ──┬──▶ [R1 AKTIF]        [User] ──┬──▶ [R1 AKTIF] ◀──┐
            │         │                     │         │         │ (berbagi beban)
            │    [R2 SIAGA] (diam)          │    [R2 AKTIF] ────┘
            │         │                     │
   R1 mati → R2 bangun & ambil alih    R1 mati → R2 menanggung semua
   (sederhana, 50% kapasitas nganggur)  (efisien, butuh mekanisme sharing)</pre>`,
      scenario: 'Data center punya firewall HA active-standby yang "tidak pernah dites". Saat firewall utama mati, standby mengambil alih — tetapi dengan konfigurasi 6 bulan lalu (tak tersinkron). Hasil: policy baru hilang, setengah aplikasi tertolak. Moral: redundancy + config sync + failover test = HA. Kurang satu = ilusi.',
      bestPractices: 'Untuk tiap pasangan redundancy: dokumentasikan siapa aktif, bagaimana failover dipicu, bagaimana config disinkronkan, dan kapan terakhir dites. Satu halaman per pasangan.',
      security: 'Failover yang aman harus mempertahankan <i>kebijakan keamanan</i>: firewall standby wajib punya policy identik — kalau tidak, failover justru membuka celah.',
      challenge: 'Pilih satu SPOF dari latihan 30.2 dan rancang redundancy-nya: model apa (active-standby/active-active)? Apa pemicunya? Bagaimana config disinkronkan? Tulis 1 paragraf desain.',
      interviewQ: 'Q: "Apa beda active-standby dan active-active, dan kapan memilih masing-masing?" — A: Standby = sederhana, satu diam menunggu (cocok firewall/VRRP); active-active = berbagi beban, efisien (cocok link aggregation/load balancer) tetapi lebih kompleks dan butuh mekanisme sharing.',
      quiz: [
        { q: 'Kekurangan utama model active-standby adalah…', options: ['Terlalu cepat', 'Kapasitas cadangan menganggur — bayar 2, pakai 1', 'Tidak bisa failover', 'Hanya untuk Wi-Fi'], answer: 1, explain: 'Siaga diam = investasi menganggur; kelebihannya kesederhanaan dan tidak ada konflik.' },
        { q: 'Bahaya "split-brain" pada redundancy adalah…', options: ['Kabel putus', 'Dua node sama-sama mengklaim aktif → konflik & data rusak', 'Listrik hemat', 'Tidak ada bahaya'], answer: 1, explain: 'Gagalnya mekanisme "siapa aktif" membuat dua otak memerintah — harus dicegah dengan quorum/heartbeat yang benar.' },
        { q: 'Mengapa cadangan harus diuji failover berkala?', options: ['Agar sibuk', 'Config bisa tak sinkron / kabel salah — cadangan yang tak teruji belum tentu berfungsi', 'Syarat garansi', 'Agar cepat rusak'], answer: 1, explain: '"Punya cadangan" ≠ "siap failover"; hanya tes nyata yang membuktikan.' },
      ],
    },
    {
      id: '30.4',
      title: 'Gateway Redundancy',
      body: `<p>Setiap PC punya <b>satu default gateway</b> (mis. 192.168.20.1). Kalau router pemilik IP itu mati → <b>seluruh VLAN kehilangan jalan keluar</b>, meski ada router cadangan di sebelahnya — karena PC tidak tahu harus pindah ke mana. <b>Gateway redundancy</b> memecahkan ini dengan <b>IP virtual</b>: satu IP gateway yang <i>dimiliki bersama</i> dua router fisik.</p>
<h3>Konsep: Virtual IP & Virtual MAC</h3>
<ul>
<li>Dua router fisik (R1: 192.168.20.2, R2: 192.168.20.3) <b>berbagi</b> satu <b>virtual IP 192.168.20.1</b> + <b>virtual MAC</b>.</li>
<li>PC dikonfigurasi gateway 192.168.20.1 seperti biasa — <b>tidak tahu</b> ada dua router.</li>
<li>Satu router jadi <b>active/master</b> (menjawab ARP untuk virtual IP & meneruskan paket); satunya <b>standby/backup</b> (mengawasi via hello).</li>
<li>Active mati → standby mengambil alih virtual IP/MAC <b>dalam hitungan detik</b> → PC tidak perlu diubah apa pun.</li>
</ul>
<h3>Mengapa Virtual MAC Juga?</h3>
<p>PC menyimpan pemetaan <i>IP gateway → MAC</i> di ARP table (28.8). Jika hanya IP yang pindah tetapi MAC beda, PC harus menunggu ARP timeout. Dengan <b>virtual MAC yang ikut pindah</b> ke router baru, ARP table PC tetap valid — failover nyaris tanpa jeda. <i>Inilah detail cerdas yang membuat failover mulus.</i></p>
<h3>Tiga Protokol (Pilih Satu)</h3>
<div class="tblwrap"><table>
<tr><th>Protokol</th><th>Sifat</th><th>Model</th><th>Dibahas</th></tr>
<tr><td><b>HSRP</b></td><td>Cisco proprietary</td><td>Active–standby</td><td>30.5</td></tr>
<tr><td><b>VRRP</b></td><td>Standar terbuka (IETF)</td><td>Master–backup</td><td>30.6 (Cisco + MikroTik)</td></tr>
<tr><td><b>GLBP</b></td><td>Cisco proprietary</td><td>Active–active (load balancing!)</td><td>30.7</td></tr>
</table></div>
<div class="callout blue"><div class="t">Satu Gateway, Banyak Router</div><p style="margin:4px 0 0">Tanpa gateway redundancy, tiap PC butuh "rute cadangan manual" (tidak praktis) atau router cadangan menganggur. Dengan virtual IP, redundancy gateway menjadi <b>transparan</b> bagi seluruh endpoint — inilah syarat HA di level akses user.</p></div>`,
      terms: [
        ['Virtual IP (VIP)', 'IP gateway bersama yang dimiliki bergantian oleh router fisik — yang dikonfigurasi di PC.'],
        ['Virtual MAC', 'MAC bersama yang ikut pindah saat failover agar ARP table PC tetap valid.'],
        ['Active / Standby (Master / Backup)', 'Peran router dalam grup redundancy: yang melayani vs yang siaga.'],
        ['Hello / heartbeat', 'Paket periodik antar-router untuk saling mengawasi ("saya masih hidup").'],
      ],
      diagram: `<pre>   GATEWAY REDUNDANCY: satu IP virtual, dua router fisik

            Virtual IP: 192.168.20.1  (yang dikenal PC)
            Virtual MAC: 0000.0c07.ac01 (ikut pindah saat failover)
               ┌──────────────┴──────────────┐
         [R1 .2 ACTIVE] ◀──hello──▶ [R2 .3 STANDBY]
               │  melayani VIP/MAC            │  mengawasi, diam
   [PC] gateway 192.168.20.1 ─────────┘
               │
   R1 MATI → R2 ambil alih VIP+MAC (detik) → PC tak perlu diubah.
   ARP table PC tetap valid karena MAC-nya SAMA (virtual).</pre>`,
      scenario: 'Router kantor mati jam 10 pagi. Tanpa gateway redundancy: 150 PC harus diganti gateway manual satu per satu (atau menunggu DHCP baru) — 2 jam chaos. Dengan VRRP: 3 detik failover, user hanya merasakan "internet kedip". Perbedaannya = satu fitur yang dikonfigurasi sekali, melindungi selamanya.',
      bestPractices: 'Virtual IP <b>tidak boleh</b> sama dengan IP fisik salah satu router — pakai IP ketiga yang didedikasikan. Dokumentasikan: siapa active, siapa standby, dan prioritasnya.',
      security: 'Pesan hello antar-router bisa dipalsukan (rogue router mengklaim jadi master). Proteksi: autentikasi HSRP/VRRP + port yang hanya terhubung antar-router terpercaya.',
      challenge: 'Jelaskan dengan kata-katamu: mengapa failover gateway butuh virtual MAC, bukan cukup virtual IP? (Petunjuk: ARP table PC.) Tulis 3 kalimat.',
      interviewQ: 'Q: "Mengapa PC tidak bisa sekadar punya dua gateway, dan apa solusi industrinya?" — A: Stack IP PC memakai satu default gateway; solusi = virtual IP/MAC bersama (HSRP/VRRP/GLBP) — redundancy transparan bagi endpoint dengan failover hitungan detik.',
      quiz: [
        { q: 'Fungsi virtual IP pada gateway redundancy adalah…', options: ['Mempercepat router', 'Satu IP gateway dipakai bersama; PC tak perlu tahu/tidak perlu diubah saat failover', 'Mengganti DHCP', 'Enkripsi'], answer: 1, explain: 'VIP = titik tetap bagi PC; router fisik di belakangnya boleh berganti tanpa PC sadar.' },
        { q: 'Mengapa virtual MAC ikut pindah saat failover?', options: ['Agar cantik', 'Agar ARP table PC tetap valid — tanpa menunggu timeout ARP', 'Agar hemat listrik', 'Tidak perlu'], answer: 1, explain: 'PC memetakan IP→MAC; MAC virtual yang sama di router baru = komunikasi lanjut tanpa jeda ARP.' },
        { q: 'Router standby tahu kapan mengambil alih melalui…', options: ['Telepon admin', 'Hello/heartbeat yang berhenti datang dari active', 'Jadwal harian', 'Tebakan'], answer: 1, explain: 'Hello periodik = "saya hidup"; berhenti = pemicu failover otomatis.' },
      ],
    },
    {
      id: '30.5',
      title: 'HSRP',
      body: `<p><b>HSRP (Hot Standby Router Protocol)</b> adalah protokol gateway redundancy milik <b>Cisco</b> (proprietary — hanya jalan di perangkat Cisco). Cara kerjanya mengikuti konsep 30.4: sekelompok router berbagi virtual IP/MAC, satu <b>active</b> melayani, satu <b>standby</b> siaga, sisanya <i>listen</i>.</p>
<h3>Konsep Kunci</h3>
<ul>
<li><b>Group number:</b> router-router dalam satu grup (mis. grup 20 untuk VLAN 20) berbagi satu virtual IP. Tiap VLAN biasanya punya grup sendiri.</li>
<li><b>Priority (0–255, default 100):</b> tertinggi menjadi active. <i>Alasan:</i> menentukan siapa utama secara deterministik.</li>
<li><b>Preempt:</b> bila router prioritas lebih tinggi <i>kembali hidup</i>, ia merebut kembali peran active. <i>Alasan:</i> mengembalikan ke desain awal (R1 utama) setelah recovery — tanpa preempt, R2 tetap active selamanya.</li>
<li><b>Virtual MAC HSRP:</b> <code>0000.0c07.acXX</code> (XX = nomor grup heksa). Inilah MAC yang dilihat PC di ARP table.</li>
<li><b>Hello:</b> multicast 224.0.0.2, tiap 3 detik; standby mengambil alih bila hello hilang ~10 detik (<i>hold time</i>).</li>
</ul>
<h3>Contoh Konfigurasi (Cisco IOS) + Penjelasan per Baris</h3>
<pre>! R1 (utama) — interface ke VLAN 20 OFFICE
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.20.2 255.255.255.0
  !＾IP FISIK R1 — beda dengan virtual IP (.1). Jangan disamakan!
R1(config-if)# standby 20 ip 192.168.20.1
  !＾Buat grup HSRP 20 dengan virtual IP .1 — inilah gateway yang dipakai PC.
R1(config-if)# standby 20 priority 110
  !＾Prioritas 110 > default 100 → R1 menang menjadi ACTIVE. Alasan: deterministik.
R1(config-if)# standby 20 preempt
  !＾Bila R1 sempat mati lalu hidup lagi, ia merebut kembali peran active.
R1(config-if)# standby 20 authentication md5 key-string HsrpKu4t!
  !＾Autentikasi antar-router — mencegah rogue router menyusup jadi active.

! R2 (cadangan) — konfigurasi cermin, prioritas default
R2(config)# interface GigabitEthernet0/0
R2(config-if)# ip address 192.168.20.3 255.255.255.0
R2(config-if)# standby 20 ip 192.168.20.1
R2(config-if)# standby 20 preempt
R2(config-if)# standby 20 authentication md5 key-string HsrpKu4t!
  !＾Tanpa "priority", R2 = 100 → standby. Preempt tetap diset agar simetris.</pre>
<h3>Verifikasi</h3>
<pre>R1# show standby brief
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gi0/0       20   110 P Active   local           192.168.20.3    192.168.20.1
  !＾P = preempt aktif. State Active di R1 = desain benar. Uji: matikan R1,
  ! ping dari PC ke 8.8.8.8 harus lanjut via R2 (failover ±10 detik default).</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab (GNS3):</b> HSRP tanpa autentikasi boleh untuk belajar — fokus ke konsep priority/preempt. <b>Production:</b> wajib autentikasi MD5 + dokumentasikan grup & prioritas tiap VLAN. Hold time default 10 detik bisa diturunkan (dengan <code>standby 20 timers 1 3</code>) bila butuh failover lebih cepat — tetapi hello agresif menambah beban CPU.</p></div>`,
      terms: [
        ['HSRP', 'Hot Standby Router Protocol — gateway redundancy proprietary Cisco (active/standby).'],
        ['Priority', 'Nilai 0–255 penentu peran; tertinggi = active.'],
        ['Preempt', 'Fitur merebut kembali peran active saat router prioritas tinggi pulih.'],
        ['Hold time', 'Batas waktu tanpa hello sebelum standby mengambil alih (default ~10 detik).'],
      ],
      diagram: `<pre>   HSRP grup 20 — VLAN 20 OFFICE (192.168.20.0/24)

                VIP 192.168.20.1  ← gateway di semua PC
                VMAC 0000.0c07.ac14
              ┌─────────┴─────────┐
   [R1 .2 pri 110 P] ◀─hello─▶ [R2 .3 pri 100 P]
     STATE: ACTIVE                STATE: STANDBY
     (melayani VIP)               (mengawasi)

   R1 mati → hello hilang 10 dtk → R2 jadi ACTIVE → VIP/MAC pindah.
   R1 hidup lagi → preempt → R1 kembali ACTIVE (desain awal pulih).</pre>`,
      scenario: 'Maintenance: R1 perlu diganti PSU. Tanpa HSRP = downtime terjadwal untuk 150 user. Dengan HSRP: turunkan prioritas R1 (atau shutdown interface) → R2 ambil alih mulus → ganti PSU dengan tenang → kembalikan. Inilah "maintenance tanpa downtime" — alasan operasional utama HA.',
      bestPractices: 'Satu grup HSRP per VLAN, prioritas didokumentasikan (R1 selalu 110, R2 selalu 100), preempt aktif di keduanya, dan autentikasi MD5. Konsisten di semua site.',
      security: 'Tanpa autentikasi, siapa pun yang tersambung ke VLAN bisa menjalankan HSRP palsu berprioritas 255 dan menjadi gateway — lalu menyadap semua traffic (MITM). Autentikasi MD5 menutup celah ini.',
      challenge: 'Di GNS3: bangun 2 router + 1 switch + 1 PC dengan HSRP grup 20. Verifikasi active/standby, lalu matikan R1 dan ukur berapa lama ping terputus. Hidupkan lagi dan amati preempt.',
      interviewQ: 'Q: "Jelaskan peran priority dan preempt di HSRP." — A: Priority menentukan siapa active (tertinggi menang); preempt memastikan router prioritas tertinggi merebut kembali peran active setelah pulih — mengembalikan desain awal.',
      quiz: [
        { q: 'Router dengan priority tertinggi di grup HSRP akan menjadi…', options: ['Standby selamanya', 'Active (selama preempt memungkinkan)', 'Listen saja', 'Mati'], answer: 1, explain: 'Tertinggi = active; preempt mengatur apakah ia merebut kembali peran setelah pulih.' },
        { q: 'Fungsi "standby 20 preempt" adalah…', options: ['Mempercepat boot', 'Router prioritas lebih tinggi merebut kembali peran active saat pulih', 'Mematikan HSRP', 'Ganti IP'], answer: 1, explain: 'Tanpa preempt, standby yang sedang active tetap active selamanya meski yang utama sudah pulih.' },
        { q: 'Mengapa HSRP production wajib pakai autentikasi MD5?', options: ['Agar cepat', 'Mencegah rogue router prioritas tinggi menyusup jadi gateway (MITM)', 'Syarat lisensi', 'Agar hemat'], answer: 1, explain: 'Tanpa auth, penyerang di VLAN bisa mengklaim active dengan priority 255 dan menyadap traffic.' },
      ],
    },
    {
      id: '30.6',
      title: 'VRRP',
      body: `<p><b>VRRP (Virtual Router Redundancy Protocol)</b> adalah padanan HSRP yang <b>standar terbuka (IETF RFC 5798)</b> — artinya jalan di <b>banyak vendor</b>: Cisco, MikroTik, Juniper, dan lainnya. Konsepnya sama (virtual IP, master/backup, priority, preempt), sehingga skill-nya portabel lintas platform. <b>Rekomendasi kurikulum: kuasai VRRP</b> karena bisa dipakai di Cisco maupun MikroTik.</p>
<h3>Istilah VRRP vs HSRP</h3>
<div class="tblwrap"><table>
<tr><th>Konsep</th><th>HSRP (Cisco)</th><th>VRRP (standar)</th></tr>
<tr><td>Yang melayani</td><td>Active</td><td><b>Master</b></td></tr>
<tr><td>Cadangan</td><td>Standby</td><td><b>Backup</b></td></tr>
<tr><td>Virtual MAC</td><td>0000.0c07.acXX</td><td><b>0000.5e00.01XX</b> (XX = VRID)</td></tr>
<tr><td>Hello</td><td>Multicast 224.0.0.2</td><td><b>Multicast 224.0.0.18</b></td></tr>
<tr><td>Priority default</td><td>100</td><td><b>100</b> (0 & 255 reserved)</td></tr>
</table></div>
<h3>Contoh: Cisco IOS + Penjelasan</h3>
<pre>! R1 (utama) — VLAN 20
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.20.2 255.255.255.0
R1(config-if)# vrrp 20 ip 192.168.20.1
  !＾Grup VRRP 20 (VRID 20) + virtual IP .1 — analog "standby 20 ip".
R1(config-if)# vrrp 20 priority 110
  !＾Prioritas 110 → menjadi MASTER. Konsep identik HSRP.
R1(config-if)# vrrp 20 preempt
  !＾Rebut kembali peran master setelah pulih (default VRRP memang preempt).
R1(config-if)# vrrp 20 authentication md5 key-string VrrpKu4t!
  !＾Autentikasi antar-router (prinsip sama seperti HSRP).</pre>
<h3>Contoh: MikroTik (RouterOS) + Penjelasan per Baris</h3>
<pre>[admin@R1] &gt; /interface vrrp add name=vrrp20 interface=bridge-office vrid=20 priority=110
  !＾Buat interface VRRP: nama vrrp20, menempel di bridge-office (VLAN 20),
  ! VRID 20 (harus SAMA di kedua router!), priority 110 → master.
[admin@R1] &gt; /ip address add address=192.168.20.1/24 interface=vrrp20
  !＾Virtual IP dipasang BUKAN di bridge, melainkan di interface VRRP.
  ! Alasan: IP ini "mengambang" — pindah mengikuti siapa yang master.
[admin@R2] &gt; /interface vrrp add name=vrrp20 interface=bridge-office vrid=20 priority=100
[admin@R2] &gt; /ip address add address=192.168.20.1/24 interface=vrrp20
  !＾R2: VRID sama (20), priority 100 → backup. Virtual IP SAMA PERSIS.
[admin@R1] &gt; /interface vrrp print
  !＾Kolom RM (running master) / RB (running backup) menunjukkan peran aktual.</pre>
<div class="callout"><div class="t">Catatan MikroTik</div><p style="margin:4px 0 0">Di RouterOS, VRRP versi default mengikuti versi IP interface. Pastikan <b>VRID sama</b> dan <b>interface fisik sama-sama up</b> di kedua router — dua kesalahan konfigurasi paling umum. Untuk autentikasi, gunakan <code>authentication=ah</code> + password bila versi mendukungnya.</p></div>`,
      terms: [
        ['VRRP', 'Virtual Router Redundancy Protocol — gateway redundancy standar terbuka (master/backup).'],
        ['VRID', 'Virtual Router ID — nomor grup VRRP; harus sama di semua anggota.'],
        ['Master / Backup', 'Istilah VRRP untuk active / standby.'],
      ],
      diagram: `<pre>   VRRP VRID 20 — sama di Cisco & MikroTik

        VIP 192.168.20.1 (di interface vrrp20 / grup vrrp 20)
        VMAC 0000.5e00.0114
       ┌──────────────┴──────────────┐
   [R1 pri 110] ◀── hello ──▶ [R2 pri 100]
    MASTER (melayani)          BACKUP (siaga)
    multicast 224.0.0.18

   Gagal → backup ambil alih. Pulih → preempt kembalikan master.</pre>`,
      scenario: 'Kantor cabang memakai MikroTik, kantor pusat Cisco — keduanya butuh gateway redundancy. Karena VRRP standar terbuka, desainnya identik di dua vendor: VRID, priority, virtual IP yang sama. Engineer tidak perlu belajar dua protokol berbeda. Moral: standar terbuka = skill portabel = tim fleksibel.',
      bestPractices: 'Pilih SATU protokol per organisasi (disarankan VRRP untuk multi-vendor) dan standarkan VRID/priority di semua site. Konsistensi = troubleshooting cepat.',
      security: 'Sama seperti HSRP: aktifkan autentikasi VRRP dan pastikan hanya router terpercaya di segmen VRRP (VLAN 99 untuk hello antar-router bila memungkinkan).',
      challenge: 'Bangun VRRP di dua MikroTik CHR (GNS3/EVE-NG): VRID 20, priority 110/100, VIP 192.168.20.1. Uji failover dengan ping kontinu dari PC dan catat durasi putusnya.',
      interviewQ: 'Q: "Kapan memilih VRRP dibanding HSRP?" — A: VRRP saat multi-vendor (standar terbuka, jalan di Cisco+MikroTik+lainnya); HSRP hanya bila murni Cisco dan butuh fitur spesifik Cisco. Konsepnya identik.',
      quiz: [
        { q: 'Keunggulan utama VRRP dibanding HSRP adalah…', options: ['Lebih cepat 10x', 'Standar terbuka — jalan di banyak vendor (Cisco, MikroTik, dll)', 'Tanpa konfigurasi', 'Gratis lisensi Cisco'], answer: 1, explain: 'VRRP (RFC 5798) multi-vendor; HSRP proprietary Cisco. Skill VRRP portabel.' },
        { q: 'Di MikroTik, virtual IP dipasang di…', options: ['Interface bridge fisik', 'Interface VRRP (agar mengambang mengikuti master)', 'Interface WAN', 'Tidak perlu IP'], answer: 1, explain: 'IP di interface VRRP = "mengambang": aktif di whoever sedang master.' },
        { q: 'Syarat agar dua router VRRP bisa bekerja sama?', options: ['Merek sama', 'VRID sama, prioritas berbeda, virtual IP sama', 'IP fisik sama', 'Kabel berbeda'], answer: 1, explain: 'VRID menyatukan grup; priority menentukan peran; VIP harus identik di keduanya.' },
      ],
    },
    {
      id: '30.7',
      title: 'GLBP',
      body: `<p><b>GLBP (Gateway Load Balancing Protocol)</b> adalah protokol Cisco yang istimewa: selain redundancy, ia juga <b>load balancing</b> — <i>semua</i> router aktif berbagi beban (model <b>active–active</b>, lihat 30.3). Jika HSRP/VRRP "membayar 2 memakai 1", GLBP "membayar 2 memakai 2".</p>
<h3>Cara Kerja: AVG & AVF</h3>
<ul>
<li><b>AVG (Active Virtual Gateway):</b> satu router terpilih (prioritas tertinggi) menjadi "mandor" — dialah yang menjawab semua ARP request untuk virtual IP.</li>
<li><b>AVF (Active Virtual Forwarder):</b> <i>setiap</i> router (termasuk AVG) menjadi forwarder dengan <b>virtual MAC masing-masing</b> (hingga 4).</li>
<li>Saat PC bertanya "MAC-nya 192.168.20.1?", AVG menjawab dengan <b>virtual MAC yang berbeda-beda</b> (round-robin) → PC1 memakai R1, PC2 memakai R2, PC3 kembali ke R1… <b>beban terbagi otomatis!</b></li>
<li>Satu router mati → AVG mendistribusikan ulang MAC-nya ke forwarder yang hidup → failover tetap mulus.</li>
</ul>
<h3>Contoh Konfigurasi (Cisco IOS) + Penjelasan</h3>
<pre>! R1 — VLAN 20
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.20.2 255.255.255.0
R1(config-if)# glbp 20 ip 192.168.20.1
  !＾Grup GLBP 20 + virtual IP .1 (sama seperti HSRP/VRRP dari sisi PC).
R1(config-if)# glbp 20 priority 110
  !＾Prioritas 110 → R1 menjadi AVG (mandor ARP).
R1(config-if)# glbp 20 preempt
  !＾Rebut kembali peran AVG setelah pulih.
R1(config-if)# glbp 20 load-balancing round-robin
  !＾Metode bagi beban: round-robin (bergantian). Alternatif: weighted
  ! (bagi berdasar bobot — untuk router beda kapasitas) atau host-dependent
  ! (satu PC selalu ke forwarder sama — untuk aplikasi sensitif sesi).</pre>
<p>R2 dikonfigurasi cermin dengan priority default (100) — otomatis menjadi AVF + standby AVG.</p>
<h3>Kapan Memakai GLBP?</h3>
<div class="tblwrap"><table>
<tr><th>Kondisi</th><th>Pilihan</th></tr>
<tr><td>Murni Cisco + butuh efisiensi (dua link/WAN aktif semua)</td><td><b>GLBP</b> — active-active</td></tr>
<tr><td>Multi-vendor (Cisco + MikroTik)</td><td><b>VRRP</b> — GLBP tak jalan di MikroTik</td></tr>
<tr><td>Butuh sederhana & predictable (failover jelas)</td><td><b>HSRP/VRRP</b> — active-standby</td></tr>
</table></div>
<div class="callout"><div class="t">Catatan Jujur</div><p style="margin:4px 0 0">GLBP powerful tetapi proprietary & lebih kompleks di-troubleshoot (banyak virtual MAC). Banyak enterprise tetap memilih VRRP/HSRP yang sederhana — karena <i>failover yang mudah dipahami</i> sering lebih berharga daripada <i>load balancing gateway</i>. Pahami GLBP untuk interview & ujian; pakai VRRP untuk produksi multi-vendor.</p></div>`,
      terms: [
        ['GLBP', 'Gateway Load Balancing Protocol — gateway redundancy + load balancing (Cisco).'],
        ['AVG', 'Active Virtual Gateway — mandor yang menjawab ARP dan membagi virtual MAC.'],
        ['AVF', 'Active Virtual Forwarder — tiap router yang meneruskan traffic dengan MAC virtualnya.'],
        ['Round-robin / weighted', 'Metode bagi beban: bergantian merata / berdasar bobot kapasitas.'],
      ],
      diagram: `<pre>   GLBP: AVG membagi-bagi virtual MAC (load balancing!)

              VIP 192.168.20.1
       ┌───────────┴───────────┐
   [R1 AVG, pri 110]    [R2 AVF, pri 100]
   VMAC-1 0007.b400.1401  VMAC-2 0007.b400.1402
       │                      │
   PC1 tanya ARP → AVG beri VMAC-1 → PC1 lewat R1
   PC2 tanya ARP → AVG beri VMAC-2 → PC2 lewat R2
   PC3 tanya ARP → AVG beri VMAC-1 → PC3 lewat R1 … (round-robin)

   R2 mati → AVG alihkan VMAC-2 ke R1 → semua via R1 (failover).</pre>`,
      scenario: 'Kantor punya dua link ISP 100 Mbps. Dengan HSRP, satu link 100 Mbps menganggur (waste 50%). Dengan GLBP + dua default route, kedua link aktif: throughput gabungan ~200 Mbps, dan satu link mati → semua otomatis lewat sisanya. Moral: GLBP mengubah "cadangan menganggur" menjadi "kapasitas produktif".',
      bestPractices: 'Untuk GLBP weighted, set bobot proporsional dengan kapasitas nyata (mis. link 200 Mbps vs 100 Mbps = bobot 200:100). Monitor distribusi beban — load balancing yang timpang = salah konfigurasi.',
      security: 'Banyak virtual MAC = permukaan ARP lebih luas; pastikan autentikasi GLBP aktif (<code>glbp 20 authentication md5</code>) agar AVG palsu tidak bisa membajak pembagian beban.',
      challenge: 'Bandingkan di kertas: untuk kantormu, hitung "waste" HSRP (satu router nganggur) vs kompleksitas GLBP. Kapan waste itu layak dibayar demi kesederhanaan? Tulis keputusanmu + alasannya.',
      interviewQ: 'Q: "Apa beda GLBP dengan HSRP/VRRP?" — A: HSRP/VRRP active-standby (satu melayani); GLBP active-active — AVG membagi virtual MAC ke tiap AVF sehingga beban terbagi (load balancing) plus tetap ada failover.',
      quiz: [
        { q: 'Peran AVG pada GLBP adalah…', options: ['Meneruskan semua paket', '"Mandor" yang menjawab ARP request dan membagikan virtual MAC ke tiap forwarder', 'Backup pasif', 'DHCP server'], answer: 1, explain: 'AVG mengatur pembagian; AVF (termasuk AVG sendiri) yang meneruskan traffic dengan MAC masing-masing.' },
        { q: 'Keunggulan GLBP dibanding HSRP/VRRP?', options: ['Lebih murah', 'Active-active: semua router berbagi beban (load balancing), bukan satu menganggur', 'Tanpa konfigurasi', 'Multi-vendor'], answer: 1, explain: 'GLBP memakai semua forwarder sekaligus; HSRP/VRRP hanya satu aktif.' },
        { q: 'Kapan memilih VRRP daripada GLBP?', options: ['Tidak pernah', 'Lingkungan multi-vendor (GLBP proprietary Cisco) atau saat mengutamakan kesederhanaan failover', 'Saat butuh lambat', 'Saat single router'], answer: 1, explain: 'GLBP tak jalan di MikroTik; dan failover active-standby lebih mudah dipahami/di-troubleshoot.' },
      ],
    },
    {
      id: '30.8',
      title: 'Link Redundancy',
      body: `<p><b>Link redundancy</b> memastikan tidak ada <b>satu kabel</b> yang menjadi SPOF: bila satu link putus, traffic otomatis lewat link lain — <b>tanpa putus</b>. Dua teknologinya: <b>EtherChannel/LACP</b> (menggabung kabel jadi satu pipa) dan <b>redundant link via STP</b> (satu aktif, satu standby).</p>
<h3>EtherChannel / LACP: Active–Active di Level Kabel</h3>
<ul>
<li><b>2–8 kabel fisik</b> digabung menjadi <b>satu link logis</b> (mis. 4×1 Gbps = 4 Gbps). <i>Alasan:</i> kapasitas bertambah <i>dan</i> satu kabel putus = sisa kabel menanggung (failover tanpa jeda).</li>
<li><b>LACP (802.3ad)</b> adalah protokol negosiasi standar agar kedua sisi sepakat membentuk bundle. Mode: <i>active</i> (mengajak) vs <i>passive</i> (menunggu) — minimal satu sisi active.</li>
<li>Load balancing per <b>flow</b> (bukan per paket): satu koneksi selalu lewat satu kabel (mencegah paket out-of-order).</li>
</ul>
<h3>Contoh (Cisco IOS) + Penjelasan</h3>
<pre>Switch(config)# interface range Gi0/23-24
Switch(config-if-range)# channel-group 1 mode active
  !＾Gabungkan 2 port ke group 1 dengan LACP active (mengajak negosiasi).
  ! Sisi lawan: minimal "passive" (atau active juga). Jangan campur dengan "on"
  ! (static, tanpa negosiasi) — mismatch = bundle gagal / loop!
Switch(config-if-range)# exit
Switch(config)# interface port-channel 1
Switch(config-if)# switchport mode trunk
  !＾Konfigurasi VLAN/trunk dipasang di interface LOGIS (port-channel),
  ! bukan di tiap fisik — sekali setting berlaku untuk bundle.</pre>
<h3>Link Redundant via STP (Active–Standby)</h3>
<p>Alternatif sederhana: dua uplink, <b>STP memblokir satu</b> (30.2 di Part 10). Satu putus → STP membuka yang standby (~30–50 detik dengan STP klasik, ~1–2 detik dengan RSTP). <i>Alasan pakai:</i> sederhana, tanpa konfigurasi agregasi — tetapi <b>kapasitas standby menganggur</b> dan failover lebih lambat dari EtherChannel.</p>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Model</th><th>Failover</th><th>Kapan</th></tr>
<tr><td>EtherChannel/LACP</td><td>Active–active</td><td>Nyaris tanpa jeda</td><td>Uplink antar-switch, ke server (kapasitas + HA)</td></tr>
<tr><td>Redundant + STP/RSTP</td><td>Active–standby</td><td>Detik (RSTP)</td><td>Cadangan murah antar gedung</td></tr>
</table></div>
<div class="callout"><div class="t">BAHAYA: Jangan Asal Colok Dua Kabel!</div><p style="margin:4px 0 0">Dua kabel paralel <b>tanpa</b> EtherChannel dan <b>tanpa</b> STP = <b>loop Layer 2 → broadcast storm</b> (skenario 14, 28.19). Setiap link redundant WAJIB salah satu: jadi member EtherChannel, atau dikelola STP. Tidak ada opsi ketiga.</p></div>`,
      terms: [
        ['EtherChannel', 'Penggabungan beberapa link fisik menjadi satu link logis (Cisco).'],
        ['LACP', 'Link Aggregation Control Protocol (802.3ad) — negosiasi pembentukan bundle antar-switch.'],
        ['Port-channel', 'Interface logis hasil agregasi; tempat konfigurasi VLAN/trunk dipasang.'],
        ['RSTP', 'Rapid STP — versi cepat STP; failover link dalam ~1–2 detik.'],
      ],
      diagram: `<pre>   ETHERCHANNEL: 2 kabel = 1 pipa logis 4 Gbps (contoh 2x1G → 2G)

   [SW-A] ═══════════ [SW-B]
          Gi0/23 ╲    ╱ Gi0/23
                  ╲  ╱
          Gi0/24 ╲╱╲╱  Gi0/24
              port-channel 1 (logis)

   Satu kabel putus → traffic otomatis lewat sisa kabel (tanpa jeda).
   Konfigurasi (trunk/VLAN) cukup sekali di port-channel 1.</pre>`,
      scenario: 'Uplink 1 Gbps ke core penuh (95%) tiap jam sibuk + kabelnya sempat putus digigit tikus → 2 jam down. Solusi: 2×1 Gbps LACP ke core via jalur berbeda: kapasitas 2 Gbps <i>dan</i> satu kabel putus = tetap jalan 1 Gbps. Satu proyek menyelesaikan dua masalah: kapasitas + redundancy.',
      bestPractices: 'Gunakan LACP (mode active) bukan "on" statis — negosiasi mendeteksi misconfig sebelum menjadi loop. Sebar member EtherChannel ke modul/port berbeda bila switch modular.',
      security: 'Port-channel ke server hypervisor: pastikan VLAN trunk-nya tepat — satu VLAN salah di port-channel = bocor ke semua VM host itu.',
      challenge: 'Di GNS3: buat EtherChannel 2 link antar-switch, verifikasi dengan show etherchannel summary (harus P - bundled). Cabut satu kabel dan amati ping tetap jalan.',
      interviewQ: 'Q: "Apa beda EtherChannel dengan dua link redundant biasa (STP)?" — A: EtherChannel active-active: kapasitas gabungan + failover tanpa jeda; redundant+STP active-standby: satu menganggur, failover butuh konvergensi STP. Keduanya mencegah loop — jangan asal colok dua kabel tanpa salah satunya.',
      quiz: [
        { q: 'Keuntungan EtherChannel/LACP dibanding satu kabel adalah…', options: ['Lebih murah', 'Kapasitas gabungan + failover nyaris tanpa jeda bila satu kabel putus', 'Tanpa konfigurasi', 'Anti petir'], answer: 1, explain: 'Bundle = pipa logis: n kabel aktif semua; satu putus = sisanya menanggung otomatis.' },
        { q: 'Dua kabel paralel tanpa EtherChannel dan tanpa STP menyebabkan…', options: ['Internet cepat 2x', 'Loop Layer 2 → broadcast storm', 'Tidak ada efek', 'Otomatis jadi EtherChannel'], answer: 1, explain: 'Dua jalur paralel tanpa agregasi/STP = loop klasik — storm melumpuhkan LAN.' },
        { q: 'Konfigurasi VLAN/trunk untuk member EtherChannel dipasang di…', options: ['Tiap port fisik satu per satu', 'Interface logis port-channel (berlaku untuk seluruh bundle)', 'Tidak perlu', 'Di PC'], answer: 1, explain: 'Port-channel adalah interface logisnya; setting di sana mewarisi ke semua member.' },
      ],
    },
    {
      id: '30.9',
      title: 'Dual ISP',
      body: `<p><b>Dual ISP</b> = berlangganan <b>dua provider internet berbeda</b> sebagai cadangan satu sama lain. Ini adalah redundancy di level <b>WAN</b>: bila ISP-A down (gangguan massal, fiber putus, maintenance), traffic otomatis pindah ke ISP-B. Tanpa ini, satu gangguan ISP = seluruh perusahaan offline.</p>
<h3>Desain Dual ISP</h3>
<ul>
<li><b>Dua link fisik</b> ke dua ISP berbeda — idealnya masuk gedung via <b>jalur berbeda</b> (diverse path, 30.2).</li>
<li><b>Active–standby:</b> ISP-A utama, ISP-B siaga. Sederhana; ISP-B menganggur. Cocok untuk kantor kecil.</li>
<li><b>Active–active:</b> keduanya dipakai (load sharing via policy routing / BGP). Efisien; lebih kompleks.</li>
<li><b>Failover otomatis</b> via: <i>floating static route</i> (rute cadangan dengan AD lebih besar), <i>IP SLA + tracking</i> (cek kesehatan link via ping), atau <i>BGP</i> (enterprise besar).</li>
</ul>
<h3>Contoh: Floating Static Route + IP SLA (Cisco) + Penjelasan</h3>
<pre>! Rute utama via ISP-A (AD default 1), cadangan via ISP-B (AD 10 = "mengambang")
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
  !＾Default via ISP-A — selalu menang selama ada (AD 1 < 10).
R1(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 10
  !＾"Floating": AD 10 → hanya dipakai bila rute AD 1 hilang. Alasan angka 10:
  ! lebih besar dari 1 (kalah) tapi lebih kecil dari OSPF 110 (tetap prioritas).
! --- IP SLA: deteksi ISP-A mati meski interface fisik masih up ---
R1(config)# ip sla 1
R1(config)#  icmp-echo 8.8.8.8 source-ip 203.0.113.2
  !＾Ping berkala ke internet VIA ISP-A. Alasan: interface bisa "up" tetapi
  ! ISP-nya bermasalah di hulu — ping membuktikan konektivitas BENERAN.
R1(config)# ip sla schedule 1 life forever start-time now
R1(config)# track 1 ip sla 1 reachability
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1
  !＾Rute utama kini TERIKAT ke hasil ping: ping gagal → rute dicabut →
  ! floating route via ISP-B otomatis naik. Failover cerdas!</pre>
<h3>Catatan NAT & DNS</h3>
<ul>
<li><b>NAT:</b> pastikan aturan NAT berlaku untuk <b>kedua</b> interface WAN (atau pakai route-map). Failover tanpa NAT = paket keluar dengan IP privat = dibuang ISP.</li>
<li><b>DNS:</b> jika memakai DNS server ISP-A, siapkan DNS publik cadangan (8.8.8.8) — kalau tidak, "internet via ISP-B" tetap terasa mati bagi user (ingat 28.11!).</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> simulasikan dua ISP dengan dua router/ISP cloud di GNS3 — cukup floating static route. <b>Production:</b> tambah IP SLA tracking (interface up ≠ ISP sehat!), uji failover tiap kuartal, dan pastikan kontrak ISP-B benar-benar <i>aktif</i> (banyak "cadangan" ternyata nonaktif saat dibutuhkan).</p></div>`,
      terms: [
        ['Dual ISP', 'Dua provider internet sebagai cadangan — redundancy level WAN.'],
        ['Floating static route', 'Rute cadangan dengan AD besar; aktif hanya bila rute utama hilang.'],
        ['IP SLA + tracking', 'Ping/monitor berkala + pengikat rute — failover berdasar kesehatan nyata, bukan status interface.'],
        ['Failback', 'Kembali ke jalur utama setelah pulih — rencanakan agar tidak flapping.'],
      ],
      diagram: `<pre>   DUAL ISP dengan floating route + IP SLA tracking

                    ┌── [ISP-A 203.0.113.1] ── (AD 1, track ping 8.8.8.8)
   [LAN] ── [R1] ──┤     utama: sehat? ping OK → pakai ini
                    └── [ISP-B 198.51.100.1] ─ (AD 10, floating)
                          cadangan: naik otomatis bila ping ISP-A gagal

   + NAT untuk KEDUA WAN + DNS cadangan (jangan lupa!).</pre>`,
      scenario: 'Gangguan massal ISP-A se-Jawa (fiber backbone putus). Kantor tanpa dual ISP: down 5 jam, semua transaksi berhenti. Kantor dengan dual ISP + IP SLA: 30 detik pindah ke ISP-B, user hanya lapor "internet sempat lambat sebentar". Perbedaannya = satu kontrak ISP cadangan + 10 baris konfigurasi.',
      bestPractices: 'Pilih dua ISP dengan <b>infrastruktur berbeda</b> (jangan dua brand yang ternyata sewa backbone sama). Uji failover tiap kuartal; monitor kualitas kedua link via Zabbix.',
      security: 'Pastikan firewall policy & NAT identik untuk kedua WAN — failover tidak boleh membuka celah ("jalur cadangan tanpa firewall").',
      challenge: 'Di GNS3: simulasikan 2 ISP, konfigurasi floating route + IP SLA. Matikan "ISP-A" dan ukur waktu failover. Lalu hidupkan lagi dan amati failback.',
      interviewQ: 'Q: "Mengapa IP SLA tracking lebih baik dari sekadar floating route biasa?" — A: Floating route hanya bereaksi bila interface down; IP SLA mendeteksi ISP bermasalah <i>di hulu</i> meski interface lokal masih up — failover berdasar kesehatan nyata.',
      quiz: [
        { q: 'Fungsi angka 10 pada "ip route 0.0.0.0 0.0.0.0 198.51.100.1 10" adalah…', options: ['Bandwidth 10 Mbps', 'Administrative distance — rute cadangan yang hanya aktif bila rute AD lebih kecil hilang', 'Prioritas tertinggi', 'Jumlah hop'], answer: 1, explain: 'AD 10 > AD 1: "mengambang" di bawah rute utama; naik otomatis saat rute utama dicabut.' },
        { q: 'Mengapa IP SLA dibutuhkan padahal sudah ada floating route?', options: ['Agar mahal', 'Interface bisa up tetapi ISP bermasalah di hulu — IP SLA membuktikan konektivitas nyata via ping', 'Tidak dibutuhkan', 'Agar cepat boot'], answer: 1, explain: 'Status interface ≠ kesehatan ISP; tracking mencabut rute utama saat ping gagal.' },
        { q: 'Dua hal yang sering terlupa saat failover dual ISP?', options: ['Warna kabel', 'NAT untuk WAN cadangan + DNS cadangan (bukan DNS ISP-A saja)', 'Nama router', 'Jam dinding'], answer: 1, explain: 'Failover tanpa NAT = paket dibuang; tanpa DNS cadangan = "internet mati" bagi user meski link hidup.' },
      ],
    },
    {
      id: '30.10',
      title: 'Failover',
      body: `<p><b>Failover</b> adalah <i>kejadian</i> peralihan dari komponen utama ke cadangan — dan <b>mengujinya</b> adalah bagian tak terpisahkan dari HA. Prinsip pahit: <b>failover yang belum pernah diuji = failover yang belum tentu bekerja.</b> Sub-bab ini adalah SOP pengujiannya.</p>
<h3>Jenis Failover</h3>
<ul>
<li><b>Otomatis:</b> VRRP/HSRP, IP SLA tracking, LACP — dipicu deteksi kegagalan (hello hilang, ping gagal). Target: detik–menit tanpa campur tangan.</li>
<li><b>Manual:</b> engineer memindahkan peran (maintenance: "pindahkan active ke R2 dulu"). Terkendali, terjadwal.</li>
<li><b>Failback:</b> kembali ke utama setelah pulih (via preempt). <i>Waspada flapping:</i> jangan failback ke link yang masih labil — beri jeda/stabilisasi.</li>
</ul>
<h3>SOP Failover Test (Maintenance Window)</h3>
<ol>
<li><b>Rencanakan:</b> tulis skenario (apa yang dimatikan, ekspektasi berapa lama putus), siapa standby, dan <b>rollback plan</b>.</li>
<li><b>Baseline:</b> catat kondisi normal (siapa active, ping latency, session).</li>
<li><b>Eksekusi satu skenario dalam satu waktu:</b> matikan R1 (cabut kabel / shutdown interface) — JANGAN dua skenario sekaligus.</li>
<li><b>Ukur:</b> berapa detik traffic terputus? Apakah semua layanan pulih? Cek dari sisi user (bukan hanya dari console!).</li>
<li><b>Failback:</b> hidupkan R1, pastikan peran kembali (preempt) dan tidak ada anomali.</li>
<li><b>Dokumentasikan:</b> hasil (waktu failover aktual), temuan (config tak sinkron? timer terlalu lama?), dan tindak lanjut.</li>
</ol>
<h3>Checklist Verifikasi Umum</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Verifikasi</th></tr>
<tr><td>Konektivitas</td><td>Ping kontinu dari PC selama failover — hitung paket hilang</td></tr>
<tr><td>Sesi aplikasi</td><td>Apakah user harus login ulang? (stateful failover ideal: tidak)</td></tr>
<tr><td>Config sync</td><td>Bandingkan config active vs standby — harus identik (kecuali identitas)</td></tr>
<tr><td>Monitoring</td><td>Apakah Zabbix alarm berbunyi dengan benar saat failover? (alarm yang diam = buta)</td></tr>
<tr><td>Log</td><td>Apakah peristiwa failover tercatat dengan timestamp benar?</td></tr>
</table></div>
<div class="callout"><div class="t">Jadwal Test Rutin</div><p style="margin:4px 0 0">Jadwalkan failover test <b>tiap kuartal</b> di maintenance window: gateway (VRRP), ISP (cabut/simulasi down), link (cabut satu member EtherChannel), power (cabut satu PSU). Hasilnya masuk laporan HA. Cadangan yang dites rutin = cadangan yang bisa dipercaya.</p></div>`,
      terms: [
        ['Failover', 'Peralihan ke cadangan saat utama gagal — harus diuji berkala.'],
        ['Failback', 'Kembali ke komponen utama setelah pulih.'],
        ['Flapping', 'Bolak-balik failover/failback cepat karena kondisi labil — dicegah dengan jeda/stabilisasi.'],
        ['Maintenance window', 'Jendela waktu terjadwal untuk pengujian/perubahan berisiko.'],
        ['Rollback plan', 'Rencana pembatalan — cara kembali ke kondisi semula bila tes gagal.'],
      ],
      diagram: `<pre>   SOP FAILOVER TEST (satu skenario dalam satu waktu!)

   1. RENCANA ── skenario + ekspektasi + rollback plan
   2. BASELINE ─ siapa active? latency? sesi?
   3. EKSEKUSI ─ matikan R1 (shutdown/cabut) ──▶ UKUR detik terputus
   4. VERIFIKASI ─ ping user? login ulang? alarm bunyi? config sync?
   5. FAILBACK ─ hidupkan R1 → peran kembali? anomali?
   6. DOKUMEN ─ hasil + temuan + tindak lanjut → laporan HA

   Jadwal: tiap kuartal — gateway, ISP, link, power.</pre>`,
      scenario: 'Failover test kuartalan: mematikan R1 utama. Hasil: failover VRRP 4 detik (bagus!), TETAPI: 1) alarm Zabbix tidak bunyi (SNMP trap belum dikonfigurasi di R2!), 2) satu policy firewall baru belum tersinkron ke R2. Dua temuan kritis yang <i>hanya</i> ditemukan lewat tes — bukan lewat "yakin sudah benar". Inilah nilai failover test.',
      bestPractices: 'Perlakukan failover test seperti latihan kebakaran: terjadwal, diskenario, diukur, didokumentasikan. "Pernah dites" adalah jawaban yang diharapkan auditor saat bertanya tentang HA.',
      security: 'Saat failover test, pastikan kebijakan keamanan tetap tegak di sisi cadangan (policy, ACL, logging). Test juga mencakup: "apakah serangan tetap terblokir selama failover?"',
      challenge: 'Rancang skenario failover test untuk lab-mu: pilih 1 (VRRP/link/ISP), tulis 6 langkah SOP di atas dengan ekspektasimu, lalu eksekusi dan bandingkan hasil aktual vs ekspektasi.',
      interviewQ: 'Q: "Bagaimana kamu memastikan HA benar-benar bekerja, bukan sekadar terkonfigurasi?" — A: Failover test berkala di maintenance window: eksekusi satu skenario, ukur durasi putus, verifikasi dari sisi user (konektivitas, sesi, alarm, config sync), lalu dokumentasikan temuan.',
      quiz: [
        { q: 'Aturan utama saat failover test adalah…', options: ['Matikan semua sekaligus', 'Satu skenario dalam satu waktu + rollback plan + di maintenance window', 'Tanpa dokumentasi', 'Saat jam sibuk'], answer: 1, explain: 'Satu variabel = kesimpulan jelas; rollback plan = jaring pengaman; window = dampak minimal.' },
        { q: 'Selain konektivitas, apa yang wajib diverifikasi saat failover?', options: ['Warna LED', 'Sesi aplikasi, config sync, alarm monitoring berbunyi, dan log tercatat', 'Suhu ruangan saja', 'Tidak ada'], answer: 1, explain: 'HA yang baik = user tak sadar (sesi lanjut), config identik, dan NOC mendapat alarm yang benar.' },
        { q: 'Bahaya failback terburu-buru ke link yang masih labil?', options: ['Tidak ada', 'Flapping — bolak-balik failover yang mengganggu layanan', 'Hemat listrik', 'Lebih cepat'], answer: 1, explain: 'Failback butuh kondisi stabil; beri jeda/stabilisasi agar tidak ayun-mengayun.' },
      ],
    },
  ],
};
