// PART 39 — Final Enterprise Lab (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part39: Part = {
  id: '39',
  number: 'PART 39',
  title: 'Final Enterprise Lab',
  phaseId: 'fase-7',
  description: 'Puncak kurikulum: rancang dan bangun enterprise network lengkap — GNS3, CHR, FortiGate, VLAN, fiber, Zabbix, Grafana, automation, dokumentasi.',
  repoFolder: 'part-39-final-enterprise-lab',
  objectives: [
    'Merancang enterprise network end-to-end dari requirement: topologi, IP plan, VLAN plan, keamanan, monitoring, dan automation.',
    'Mengimplementasikan desain di GNS3 dengan MikroTik CHR (routing/VLAN), FortiGate (firewall), dan switching.',
    'Membangun monitoring lengkap (Zabbix + Grafana) dan automation (backup, audit, provisioning, validasi) di atas lab.',
    'Melakukan testing menyeluruh termasuk failure testing dan troubleshooting sistematis.',
    'Menghasilkan dokumentasi lengkap dan mempublikasikannya ke GitHub sebagai portfolio utama.',
  ],
  prerequisites: 'SELURUH kurikulum Part 01–38. Ini proyek puncak: setiap part sebelumnya adalah bahan bakunya. Pastikan nyaman dengan: VLAN dan IP plan (01, 08-12), MikroTik (13), GNS3 (14), FortiGate (16-18), Zabbix dan Grafana (23-27), Linux (33), automation (32, 35), dan dokumentasi (38).',
  subbabs: [
    {
      id: '39.1',
      title: 'Project Requirement',
      body: `<p>Setiap proyek enterprise dimulai dari <b>requirement</b> — bukan dari belanja perangkat. Requirement adalah kontrak: apa yang harus bisa dilakukan jaringan ini, untuk siapa, dengan batasan apa. Tanpa requirement yang jelas, desain menjadi tebak-tebakan dan proyek gagal di tengah jalan.</p>
<h3>Skenario Proyek: PT MajuNet (Fiktif)</h3>
<p>Perusahaan logistik 250 karyawan, 2 gedung (Kantor Pusat + Gudang, jarak 2 km), butuh jaringan baru:</p>
<div class="tblwrap"><table>
<tr><th>Kategori</th><th>Requirement</th><th>Implikasi Desain</th></tr>
<tr><td>Pengguna</td><td>250 user (200 kantor, 50 gudang), 40 CCTV, 30 printer/IoT</td><td>Kapasitas port dan DHCP scope</td></tr>
<tr><td>Segmentasi</td><td>Pisahkan: CCTV, Office, Server, Guest, Management</td><td>VLAN 10/20/30/40/99 (skema kurikulum)</td></tr>
<tr><td>Ketersediaan</td><td>Sistem gudang tidak boleh mati lebih dari 15 menit</td><td>Redundansi link dan device kritis</td></tr>
<tr><td>Keamanan</td><td>Tamu terisolasi; server hanya dari office; audit tiap perubahan</td><td>FortiGate + zone policy</td></tr>
<tr><td>Monitoring</td><td>NOC tahu masalah kurang dari 5 menit, dashboard real-time</td><td>Zabbix + Grafana</td></tr>
<tr><td>Operasional</td><td>Perubahan massal via automation; semua terdokumentasi</td><td>Toolkit Part 35 + dokumen Part 38</td></tr>
<tr><td>Batasan</td><td>Lab: GNS3 + CHR + FortiGate VM; budget simulasi</td><td>Desain harus lab-feasible</td></tr>
</table></div>
<h3>Requirement yang Baik: SMART</h3>
<p><b>S</b>pecific (jelas), <b>M</b>easurable (bisa diuji, mis. tidak mati lebih dari 15 menit), <b>A</b>chievable (masuk akal di lab), <b>R</b>elevant (mendukung bisnis), <b>T</b>ime-bound (ada deadline). Kalimat "jaringan harus cepat" bukan requirement. Kalimat "latency antar gedung di bawah 5ms, diukur via Zabbix" adalah requirement.</p>
<div class="callout blue"><div class="t">Requirement menjadi Desain menjadi Bukti</div><p style="margin:4px 0 0">Sub-bab 39.2 sampai 39.7 menurunkan requirement per aspek; 39.8 mengubahnya menjadi desain; 39.9 sampai 39.19 membangunnya; 39.20 sampai 39.24 membuktikan ia bekerja. Rantai ini tidak boleh putus: tiap keputusan desain harus bisa ditelusur ke requirement.</p></div>`,
      terms: [
        ['Requirement', 'Pernyataan kebutuhan yang spesifik dan terukur — kontrak proyek.'],
        ['SMART', 'Specific, Measurable, Achievable, Relevant, Time-bound — kriteria requirement baik.'],
        ['Scope', 'Batasan ruang lingkup: apa yang termasuk dan tidak termasuk proyek.'],
      ],
      scenario: 'Proyek nyata gagal: "bangun jaringan gudang baru" tanpa requirement tertulis. Hasil: switch dibeli kurang 20 port, tidak ada VLAN untuk CCTV (bongkar ulang), tidak ada monitoring (ketahuan mati dari user). Biaya rework 3x lipat. Requirement 2 halaman di awal akan mencegah semuanya.',
      bestPractices: 'Tulis requirement SEBELUM membuka GNS3. Libatkan stakeholder (simulasikan). Setiap requirement harus bisa diuji — itulah test case di 39.20.',
      security: 'Requirement keamanan harus eksplisit sejak awal (isolasi tamu, audit) — keamanan yang ditambal belakangan selalu berlubang.',
      challenge: 'Tulis 10 requirement untuk lab pribadimu dengan format SMART. Tandai mana yang functional (fitur) dan non-functional (performa, keamanan, operasional).',
      interviewQ: 'Q: Mengapa proyek jaringan harus dimulai dari requirement, bukan dari perangkat? — A: Karena perangkat adalah solusi; tanpa memahami masalah (requirement), solusi bisa salah sasaran — kurang kapasitas, salah segmentasi, tanpa monitoring. Requirement yang terukur juga menjadi test case verifikasi.',
      quiz: [
        { q: 'Manakah yang merupakan requirement yang BAIK?', options: ['Jaringan harus cepat', 'Latency antar gedung di bawah 5ms, diukur via Zabbix tiap menit', 'Pakai perangkat mahal', 'Jaringan jangan mati'], answer: 1, explain: 'SMART: spesifik (< 5ms), terukur (via Zabbix), bisa diuji. Kata "cepat" tidak bisa diverifikasi.' },
        { q: 'Apa risiko terbesar proyek tanpa requirement tertulis?', options: ['Tidak ada', 'Desain tebak-tebakan: salah kapasitas, salah segmentasi, rework mahal di tengah jalan', 'Proyek lebih cepat', 'Hemat kertas'], answer: 1, explain: 'Requirement mencegah rework: contoh nyata switch kurang port + CCTV tanpa VLAN = bongkar ulang 3x biaya.' },
        { q: 'Apa hubungan requirement dengan testing (39.20)?', options: ['Tidak ada', 'Setiap requirement yang terukur menjadi test case — apakah yang dijanjikan benar-benar bekerja?', 'Testing hanya untuk software', 'Requirement hanya formalitas'], answer: 1, explain: 'Rantai: requirement → desain → implementasi → verifikasi. Requirement yang tidak bisa diuji = janji kosong.' },
      ],
    },
    {
      id: '39.2',
      title: 'Network Requirement',
      body: `<p>Turunan teknis dari 39.1: <b>berapa banyak, seberapa cepat, seberapa andal</b> — angka-angka yang menjadi fondasi desain topologi (39.8).</p>
<h3>Kapasitas dan Performa</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Angka</th><th>Alasan</th></tr>
<tr><td>Total endpoint</td><td>Sekitar 320 (250 user + 40 CCTV + 30 IoT/printer)</td><td>Menentukan jumlah switch dan ukuran DHCP</td></tr>
<tr><td>Uplink antar gedung</td><td>10 Gbps fiber (2 km)</td><td>Agregat trafik CCTV + office; fiber untuk jarak jauh</td></tr>
<tr><td>Akses per user</td><td>1 Gbps</td><td>Standar kantor modern</td></tr>
<tr><td>Internet</td><td>2x 1 Gbps (2 ISP, aktif-pasif)</td><td>Redundansi sesuai requirement ketersediaan</td></tr>
<tr><td>Latency target</td><td>Di bawah 2ms antar gedung, di bawah 5ms ke server</td><td>Diukur dan dimonitor (39.16)</td></tr>
</table></div>
<h3>Ketersediaan (Availability)</h3>
<ul>
<li><b>Core:</b> dual device (2 CHR core dengan VRRP) — tidak boleh ada single point of failure di core.</li>
<li><b>Uplink:</b> dual fiber dengan rute fisik berbeda (satu putus, satu bertahan).</li>
<li><b>Power:</b> dual UPS untuk rack utama.</li>
<li><b>Target:</b> failover otomatis di bawah 1 menit; perbaikan manual di bawah 15 menit (spare ready).</li>
</ul>
<h3>Skalabilitas</h3>
<p>Desain untuk 2x lipat: IP plan /24 per VLAN menampung 250 host, slot rack kosong 30 persen, core fiber spare 50 persen (38.7). Prinsipnya: <b>murah menambah kapasitas di atas kertas; mahal membongkar yang sudah jadi.</b></p>`,
      terms: [
        ['Kapasitas', 'Berapa banyak yang bisa ditampung (port, bandwidth, host).'],
        ['Availability', 'Tingkat ketersediaan layanan; ditingkatkan via redundansi.'],
        ['VRRP', 'Virtual Router Redundancy Protocol — dua router berbagi satu IP virtual; satu mati, satu mengambil alih.'],
        ['Skalabilitas', 'Kemampuan tumbuh tanpa desain ulang.'],
      ],
      diagram: `<pre>        REDUNDANSI CORE (konsep)

         [ISP-1]     [ISP-2]
            \\         /
             \\       /
        ┌─────────────┐     ┌─────────────┐
        │ CHR-CORE-01 │═════│ CHR-CORE-02 │  VRRP: satu IP virtual
        │  (aktif)    │link │  (standby)  │  192.168.99.1
        └──────┬──────┘     └──────┬──────┘
               │ trunk            │ trunk
        ┌──────▼──────┐     ┌──────▼──────┐
        │ SW-CORE-01  │═════│ SW-CORE-02  │
        └─────────────┘     └─────────────┘
        Satu mati → yang lain ambil alih &lt; 1 menit.</pre>`,
      scenario: 'Perusahaan tumbuh 250 menjadi 400 user dalam 2 tahun. Karena IP plan /24 dan slot rack 30 persen kosong, ekspansi = tambah switch + colok. Tanpa perencanaan: subnet penuh lalu renumbering 400 device (mimpi buruk 2 minggu).',
      bestPractices: 'Desain untuk 2x kebutuhan saat ini di aspek yang mahal diubah (subnet, fiber, rack). Redundansi di core dan uplink dulu; access bisa menyusul.',
      security: 'Redundansi juga untuk keamanan: single firewall mati = seluruh proteksi hilang. Dual FortiGate (HA) untuk edge kritis.',
      challenge: 'Hitung kebutuhan port PT MajuNet: berapa switch 24-port untuk 200 user kantor + 40 CCTV + uplink? Tambahkan 20 persen cadangan.',
      interviewQ: 'Q: Bagaimana menentukan ukuran subnet tiap VLAN? — A: Dari jumlah endpoint saat ini dikali faktor tumbuh (2x), dibulatkan ke subnet CIDR terdekat. /24 untuk 250 user memberi ruang tumbuh tanpa renumbering.',
      quiz: [
        { q: 'Mengapa uplink antar gedung memakai fiber, bukan UTP?', options: ['Agar mahal', 'Jarak 2 km melampaui batas UTP (100m); fiber imun interferensi dan bandwidth besar', 'UTP sudah punah', 'Tidak ada alasan'], answer: 1, explain: 'UTP Cat6 maksimal ~100m (55m untuk 10G); antar gedung 2km wajib fiber. Bonus: fiber imun interferensi elektromagnetik.' },
        { q: 'Apa fungsi VRRP di desain ini?', options: ['Mempercepat internet', 'Dua router berbagi IP virtual — bila yang aktif mati, yang standby mengambil alih otomatis', 'Enkripsi data', 'Menghemat listrik'], answer: 1, explain: 'VRRP menghilangkan single point of failure di gateway: user tidak perlu ganti gateway saat router mati.' },
        { q: 'Prinsip skalabilitas yang benar?', options: ['Desain pas-pasan agar hemat', 'Desain untuk sekitar 2x kebutuhan di aspek yang mahal diubah (subnet, fiber, rack space)', 'Beli perangkat terbesar selalu', 'Abaikan masa depan'], answer: 1, explain: 'Aspek "mahal diubah" (renumbering IP, gelar fiber baru) dilebihkan sejak awal; yang murah (tambah switch) bisa menyusul.' },
      ],
    },
    {
      id: '39.3',
      title: 'IP Planning',
      body: `<p><b>IP planning</b> final proyek: alokasi lengkap semua subnet PT MajuNet — konsisten dengan skema kurikulum (192.168.x.0/24 per VLAN) dan siap menjadi <code>desired.yaml</code> untuk automation.</p>
<h3>Master IP Plan</h3>
<div class="tblwrap"><table>
<tr><th>Subnet</th><th>VLAN</th><th>Gateway (.1)</th><th>Alokasi</th></tr>
<tr><td>192.168.10.0/24</td><td>10 CCTV</td><td>192.168.10.1</td><td>.2–.49 kamera statis; .50 NVR; .100 server rekam cadangan</td></tr>
<tr><td>192.168.20.0/24</td><td>20 OFFICE</td><td>192.168.20.1</td><td>.10–.200 DHCP; .201–.220 printer statis; .221–.230 reservation khusus</td></tr>
<tr><td>192.168.30.0/24</td><td>30 SERVER</td><td>192.168.30.1</td><td>.10 Zabbix, .11 Grafana, .12 NVR-app, .20 DB, .30 file server (semua statis)</td></tr>
<tr><td>192.168.40.0/24</td><td>40 GUEST</td><td>192.168.40.1</td><td>.10–.200 DHCP, lease 1 jam, isolasi client</td></tr>
<tr><td>192.168.99.0/24</td><td>99 MGMT</td><td>192.168.99.1</td><td>.1–.2 core, .11–.20 switch, .30 FortiGate, .100 NOC</td></tr>
<tr><td>192.168.60.0/24</td><td>60 GUDANG</td><td>192.168.60.1</td><td>Subnet khusus gudang: .10–.100 DHCP scanner/handheld</td></tr>
<tr><td>10.0.0.0/30</td><td>— (P2P)</td><td>—</td><td>Link point-to-point antar core: 10.0.0.1 – 10.0.0.2</td></tr>
</table></div>
<p><b>Catatan desain (ALASAN perluasan):</b> VLAN 60 (GUDANG, 192.168.60.0/24) adalah <b>perluasan skema yang disengaja</b>: gudang butuh policy berbeda (perangkat handheld, jam operasional, isolasi dari office) sehingga pantas menjadi VLAN sendiri, bukan menumpang OFFICE. Skema inti 10/20/30/40/99 tetap utuh — konsistensi dijaga, perluasan didokumentasikan di sini dan di VLAN table (39.4).</p>
<h3>Aturan Alokasi (Ditegakkan!)</h3>
<ul>
<li>.1 = gateway di semua VLAN (konsistensi kurikulum).</li>
<li>Infrastruktur = statis + tercatat (38.4); user = DHCP.</li>
<li>Tidak ada IP di luar tabel — "IP liar" = temuan audit (35.5).</li>
<li>IP plan ini = <code>desired.yaml</code> → dibaca script provision dan validator (35.8–35.11).</li>
</ul>`,
      terms: [
        ['IP plan', 'Dokumen resmi alokasi subnet — di sini juga menjadi desired state automation.'],
        ['Point-to-point /30', 'Subnet 2 host untuk link antar router (hemat alamat).'],
      ],
      diagram: `<pre>        PETA SUBNET PT MAJUNET

  192.168.10.0/24 ── VLAN 10 CCTV ──► kamera, NVR
  192.168.20.0/24 ── VLAN 20 OFFICE ──► 200 user kantor
  192.168.30.0/24 ── VLAN 30 SERVER ──► Zabbix .10, Grafana .11
  192.168.40.0/24 ── VLAN 40 GUEST ──► tamu (isolasi)
  192.168.60.0/24 ── VLAN 60 GUDANG ──► scanner, handheld
  192.168.99.0/24 ── VLAN 99 MGMT ──► semua IP management
  10.0.0.0/30 ── link P2P antar core

  Aturan: .1 = gateway di semua VLAN. Tanpa kecuali.</pre>`,
      scenario: 'Ekspansi gudang butuh 60 IP baru. Karena 192.168.60.0/24 sudah dialokasikan sejak awal (walau belum dipakai penuh), ekspansi = nyalakan DHCP scope. Tanpa perencanaan: berebut sisa IP VLAN 20 → conflict dengan printer statis.',
      bestPractices: 'Alokasikan subnet untuk kebutuhan 2 tahun ke depan, bukan hari ini. Dokumentasikan ALASAN tiap subnet (seperti catatan VLAN 60 di atas) — engineer berikutnya perlu tahu kenapa.',
      security: 'Subnet management (99) tidak boleh di-route ke user VLAN tanpa firewall; GUEST tidak boleh mencapai subnet apapun kecuali internet.',
      challenge: 'Buat desired.yaml dari tabel di atas (vlans + ips). Validasi dengan Python ipaddress bahwa tidak ada subnet yang overlap.',
      interviewQ: 'Q: Kapan boleh menyimpang dari skema VLAN/IP standar (seperti penambahan VLAN 60)? — A: Boleh, bila ada alasan bisnis/teknis jelas (policy berbeda, isolasi) DAN didokumentasikan (alasan + tabel + update automation). Yang dilarang: menyimpang diam-diam tanpa catatan.',
      quiz: [
        { q: 'Mengapa VLAN 60 (GUDANG) ditambahkan padahal skema inti 10/20/30/40/99 sudah ada?', options: ['Agar banyak VLAN', 'Gudang butuh policy berbeda (handheld, isolasi) sehingga pantas jadi VLAN sendiri — perluasan yang didokumentasikan alasannya', 'Karena VLAN 20 penuh', 'Asal saja'], answer: 1, explain: 'Perluasan skema boleh bila ada alasan jelas + dokumentasi. Skema inti tetap utuh; yang berubah tercatat.' },
        { q: 'Mengapa memakai /30 untuk link point-to-point antar core?', options: ['Agar cepat', 'Hanya butuh 2 host address — /30 hemat alamat dan jelas menandakan "link P2P"', 'Wajib hukum', 'Agar aman'], answer: 1, explain: '/30 = 2 host usable, pas untuk P2P. Juga konvensi yang langsung terbaca: "ini link antar router".' },
        { q: 'Apa hubungan IP plan ini dengan automation?', options: ['Tidak ada', 'IP plan menjadi desired.yaml — dibaca script provisioning (35.8–35.9) dan validator drift (35.11)', 'Hanya hiasan', 'Diganti tiap hari'], answer: 1, explain: 'Satu sumber kebenaran melayani manusia (tabel) dan mesin (YAML) — prinsip source of truth Part 32.' },
      ],
    },
    {
      id: '39.4',
      title: 'VLAN Planning',
      body: `<p><b>VLAN planning</b> final: definisi lengkap tiap VLAN — ID, nama, subnet, tujuan, dan kebijakan trunk. Ini adalah <b>kontrak segmentasi</b> PT MajuNet yang akan diimplementasikan di 39.13 dan diaudit otomatis selamanya.</p>
<h3>Master VLAN Table</h3>
<div class="tblwrap"><table>
<tr><th>ID</th><th>Nama</th><th>Subnet</th><th>Tujuan</th><th>Diizinkan di</th></tr>
<tr><td>10</td><td>VLAN10-CCTV</td><td>192.168.10.0/24</td><td>40 kamera + NVR; trafik multicast berat, prioritas</td><td>Core, ACC-01/02, SRV-01</td></tr>
<tr><td>20</td><td>VLAN20-OFFICE</td><td>192.168.20.0/24</td><td>200 user kantor</td><td>Core, ACC-01/02</td></tr>
<tr><td>30</td><td>VLAN30-SERVER</td><td>192.168.30.0/24</td><td>Server + Zabbix + Grafana</td><td>Core, SRV-01</td></tr>
<tr><td>40</td><td>VLAN40-GUEST</td><td>192.168.40.0/24</td><td>Tamu; isolasi total dari internal</td><td>Core, ACC-01/02 (port AP)</td></tr>
<tr><td>60</td><td>VLAN60-GUDANG</td><td>192.168.60.0/24</td><td>50 user + scanner gudang</td><td>Core, ACC-GD-01</td></tr>
<tr><td>99</td><td>VLAN99-MGMT</td><td>192.168.99.0/24</td><td>Management semua perangkat</td><td>Semua switch (trunk)</td></tr>
</table></div>
<h3>Kebijakan Trunk (Pruning)</h3>
<ul>
<li><b>Prinsip:</b> trunk hanya membawa VLAN yang dibutuhkan di sisi seberang (least privilege Layer 2).</li>
<li>Contoh: trunk ke ACC-01 membawa 10,20,40,99 — <b>tanpa</b> 30 dan 60 (server & gudang tidak ada di sana).</li>
<li><b>Native VLAN:</b> 99 (bukan 1!) — dan tidak ada trafik user untagged di trunk.</li>
<li><b>VLAN 1:</b> tidak dipakai di mana pun; port tak terpakai = shutdown + VLAN 999 (kuburan).</li>
</ul>
<h3>Alasan Desain (Traceability ke Requirement)</h3>
<p>CCTV dipisah (bukan gabung OFFICE) karena: trafik multicast berat + butuh QoS prioritas + kamera adalah IoT yang rentan (isolasi keamanan). GUEST dipisah total karena: pihak eksternal, policy deny ke internal (39.5). SERVER dipisah karena: aset paling kritis, akses dibatasi via firewall.</p>`,
      terms: [
        ['VLAN pruning', 'Membatasi VLAN yang diizinkan lewat trunk — hanya yang dibutuhkan.'],
        ['Least privilege (L2)', 'Tiap segmen hanya mendapat akses minimal yang dibutuhkan — di Layer 2 via pruning.'],
      ],
      scenario: 'Broadcast storm dari satu kamera rusak (VLAN 10) — karena CCTV terisolasi di VLAN sendiri, user OFFICE tidak merasakan apa-apa. Tanpa segmentasi: satu device rusak = 250 user terganggu. Isolasi VLAN adalah "sekat anti bocor".',
      bestPractices: 'Setiap VLAN punya "alasan eksistensi" tertulis. Prune trunk agresif. Review tahunan: VLAN tak terpakai = hapus (bukan dibiarkan).',
      security: 'VLAN hopping dimitigasi via: native VLAN bukan 1, pruning, dan port access tidak trunk. Dokumentasikan sebagai kontrol keamanan (39.5).',
      challenge: 'Gambar matriks VLAN vs switch: baris = 6 VLAN, kolom = tiap switch; isi "ya/tidak" untuk trunk. Pastikan konsisten dengan tabel di atas.',
      interviewQ: 'Q: Mengapa CCTV dipisah ke VLAN sendiri, bukan digabung dengan OFFICE? — A: Tiga alasan: trafik (multicast berat butuh QoS), keamanan (kamera = IoT rentan, isolasi membatasi blast radius), dan operasional (troubleshooting terisolasi). Satu VLAN = satu blast radius.',
      quiz: [
        { q: 'Apa itu VLAN pruning dan mengapa dilakukan?', options: ['Memangkas kabel', 'Membatasi VLAN yang lewat trunk hanya yang dibutuhkan — mengurangi broadcast domain dan permukaan serangan Layer 2', 'Menghapus VLAN', 'Mempercepat switch'], answer: 1, explain: 'Pruning = least privilege di L2: VLAN yang tidak perlu tidak dibawa — broadcast/serangan tidak menyebar ke mana-mana.' },
        { q: 'Mengapa native VLAN dipilih 99, bukan 1?', options: ['Karena 99 lebih besar', 'VLAN 1 adalah target umum serangan VLAN hopping; native khusus yang bukan VLAN user menutup vektor double-tagging', 'Agar unik', 'Tidak ada alasan'], answer: 1, explain: 'Serangan VLAN hopping mengeksploitasi native VLAN; memakai VLAN khusus non-user + pruning adalah mitigasi standar.' },
        { q: 'Bagaimana perlakuan port switch yang tidak terpakai?', options: ['Biarkan aktif', 'Shutdown + masuk VLAN 999 (kuburan) — mencegah perangkat liar langsung dapat jaringan', 'Cabut switch', 'Jadikan trunk'], answer: 1, explain: 'Port aktif default = pintu terbuka. Shutdown + VLAN isolasi = port mati yang aman.' },
      ],
    },
    {
      id: '39.5',
      title: 'Security Requirement',
      body: `<p><b>Security requirement</b> PT MajuNet: apa yang harus dilindungi, dari siapa, dan bagaimana membuktikannya. Keamanan dirancang <b>sejak awal</b> (bukan ditempel belakangan) dan setiap kontrol bisa ditelusur ke requirement.</p>
<h3>Matriks Kebijakan Antar Zone (FortiGate)</h3>
<div class="tblwrap"><table>
<tr><th>Dari → Ke</th><th>OFFICE (20)</th><th>SERVER (30)</th><th>GUEST (40)</th><th>CCTV (10)</th><th>MGMT (99)</th><th>Internet</th></tr>
<tr><td><b>OFFICE (20)</b></td><td>—</td><td>ALLOW (app)</td><td>DENY</td><td>DENY</td><td>DENY</td><td>ALLOW</td></tr>
<tr><td><b>SERVER (30)</b></td><td>ALLOW (balasan)</td><td>—</td><td>DENY</td><td>ALLOW (NVR)</td><td>ALLOW</td><td>DENY*</td></tr>
<tr><td><b>GUEST (40)</b></td><td>DENY</td><td>DENY</td><td>— (isolasi client)</td><td>DENY</td><td>DENY</td><td>ALLOW</td></tr>
<tr><td><b>CCTV (10)</b></td><td>DENY</td><td>ALLOW (ke NVR)</td><td>DENY</td><td>—</td><td>DENY</td><td>DENY</td></tr>
<tr><td><b>MGMT (99)</b></td><td>DENY</td><td>ALLOW</td><td>DENY</td><td>ALLOW</td><td>—</td><td>DENY</td></tr>
</table></div>
<p>*Server boleh ke internet hanya untuk update via proxy (terbatas).</p>
<h3>Kontrol Keamanan Berlapis</h3>
<ul>
<li><b>Perimeter:</b> FortiGate HA di edge — IPS, antivirus, web filter untuk trafik internet.</li>
<li><b>Segmentasi:</b> firewall antar-VLAN sesuai matriks (deny by default, allow eksplisit).</li>
<li><b>Akses device:</b> SSH key-only, user per-teknisi, privilege minimal; management hanya dari VLAN 99.</li>
<li><b>Monitoring keamanan:</b> log auth terpusat, alert login gagal, audit config berkala (35.11).</li>
<li><b>Fisik:</b> rack terkunci, CCTV ruang server, label tidak membocorkan info sensitif.</li>
</ul>
<h3>Prinsip: Deny by Default</h3>
<p>Aturan terakhir di setiap policy = DENY ALL + log. Setiap ALLOW harus punya alasan tertulis (tiket). "Buka dulu, amankan nanti" adalah cara tercepat memiliki insiden.</p>`,
      terms: [
        ['Zone policy', 'Aturan firewall antar zona/VLAN: siapa boleh ke mana.'],
        ['Deny by default', 'Prinsip: tolak semua kecuali yang diizinkan eksplisit.'],
        ['Blast radius', 'Luas dampak insiden — segmentasi memperkecilnya.'],
      ],
      scenario: 'Laptop tamu terinfeksi malware di VLAN 40. Karena matriks GUEST = DENY ke semua internal + isolasi client, malware tidak bisa menyebar ke office/server. Insiden selesai di "akuarium" tamu. Tanpa segmentasi: ransomware menyebar ke 250 PC.',
      bestPractices: 'Dokumentasikan ALASAN tiap rule ALLOW (tiket). Review rule tiap kuartal — rule tanpa pemilik = hapus. Uji matriks dengan testing (39.20): coba langgar tiap DENY.',
      security: 'Matriks ini adalah dokumen keamanan sensitif — akses terbatas. Uji penetrasi berkala untuk validasi (apakah DENY benar-benar DENY?).',
      challenge: 'Tulis 5 test case dari matriks: "dari GUEST coba ping server (harus GAGAL)", dst. Ini menjadi bagian 39.20.',
      interviewQ: 'Q: Apa itu deny by default dan mengapa penting? — A: Prinsip menolak semua trafik kecuali yang diizinkan eksplisit. Penting karena "allow by default + blokir yang jahat" mustahil lengkap — kita tidak bisa mendaftar semua yang jahat, tapi bisa mendaftar yang dibutuhkan.',
      quiz: [
        { q: 'Mengapa GUEST (40) di-DENY ke semua VLAN internal?', options: ['Agar hemat bandwidth', 'Tamu adalah pihak eksternal tak terpercaya — isolasi total memperkecil blast radius bila device tamu terinfeksi', 'Karena tamu tidak butuh internet', 'Agar konfigurasi pendek'], answer: 1, explain: 'Zero trust untuk tamu: mereka hanya butuh internet. Akses internal = risiko tanpa manfaat.' },
        { q: 'Apa arti deny by default dalam firewall policy?', options: ['Blokir semua selamanya', 'Tolak semua kecuali yang diizinkan eksplisit dengan alasan tertulis', 'Izinkan semua kecuali yang diblokir', 'Tidak pakai firewall'], answer: 1, explain: 'Daftar "yang dibutuhkan" jauh lebih pendek dan terkontrol dari daftar "yang jahat" (tak terbatas).' },
        { q: 'Server (30) ke internet dibatasi via proxy. Mengapa?', options: ['Agar lambat', 'Server tidak butuh browsing bebas; akses terbatas untuk update mengurangi risiko malware/C2', 'Hemat kuota', 'Tidak ada alasan'], answer: 1, explain: 'Server yang bisa akses internet bebas bisa mengunduh malware atau menjadi bot. Egress filtering = kontrol penting yang sering dilupakan.' },
      ],
    },
    {
      id: '39.6',
      title: 'Monitoring Requirement',
      body: `<p><b>Monitoring requirement:</b> apa yang dipantau, seberapa sering, dan kapan NOC dibangunkan. Prinsip: <b>NOC tahu sebelum user komplain</b> — setiap requirement di sini menjadi item Zabbix (39.16) dan panel Grafana (39.17).</p>
<h3>Apa yang Dipantau (dan Mengapa)</h3>
<div class="tblwrap"><table>
<tr><th>Kategori</th><th>Metrik</th><th>Interval</th><th>Threshold Alert</th></tr>
<tr><td>Ketersediaan</td><td>Ping ke semua gateway & device kritis</td><td>1 menit</td><td>Down &gt; 3 menit = KRITIS</td></tr>
<tr><td>Resource</td><td>CPU, memory, disk tiap CHR/switch/server</td><td>1 menit</td><td>CPU &gt; 80%, disk &gt; 85%</td></tr>
<tr><td>Interface</td><td>Status up/down, error counter, throughput</td><td>1 menit</td><td>Down, error naik &gt; 100/jam</td></tr>
<tr><td>Layanan</td><td>DHCP, DNS, HTTP portal, REST API</td><td>2 menit</td><td>Check gagal = KRITIS</td></tr>
<tr><td>Keamanan</td><td>Login gagal, config berubah</td><td>real-time</td><td>5 gagal/5 menit; change tak terjadwal</td></tr>
<tr><td>Kapasitas</td><td>DHCP pool usage, bandwidth 95th percentile</td><td>5 menit</td><td>Pool &gt; 80%, tren naik</td></tr>
</table></div>
<h3>Alur Data Monitoring (Wajib Paham!)</h3>
<pre>Device (CHR/switch/server)
  │  via: SNMP / Zabbix agent / ICMP / API
  ▼
Collector (Zabbix server/proxy) — mengambil & menyimpan
  │  ke:
  ▼
Database (history & trends)
  │  dibaca oleh:
  ▼
Dashboard (Grafana) + Alerting (trigger → Telegram/email)
  │  dilihat oleh:
  ▼
NOC (manusia) → aksi</pre>
<p><b>ALASAN</b> memahami alur: saat "grafik kosong", kamu tahu di lapisan mana mencari — device tidak kirim? collector mati? database penuh? Tiap lapisan punya cara diagnosis berbeda (Part 23–27).</p>
<h3>Aturan Alert</h3>
<ul>
<li><b>Alert = aksi:</b> tiap alert harus jelas "siapa melakukan apa". Alert tanpa aksi = noise (matikan!).</li>
<li><b>Severity:</b> KRITIS (bangunkan orang), WARNING (tiket pagi), INFO (dashboard saja).</li>
<li><b>Target:</b> deteksi &lt; 5 menit, notifikasi &lt; 1 menit setelah deteksi (requirement 39.1).</li>
</ul>`,
      terms: [
        ['Collector', 'Komponen yang mengambil data dari device (Zabbix server/proxy, SNMP poller).'],
        ['Trigger', 'Aturan "bila metrik melewati threshold, maka alert" di Zabbix.'],
        ['95th percentile', 'Ukuran bandwidth yang mengabaikan 5% lonjakan tertinggi — adil untuk billing/kapasitas.'],
      ],
      scenario: 'Tanpa monitoring: link ke gudang putus 3 jam, ketahuan saat sopir lapor scanner mati. Dengan monitoring: ping ke gateway gudang gagal 3 menit → alert KRITIS → teknisi dispatch sebelum jam operasional. Selisih: 3 jam downtime vs 20 menit.',
      bestPractices: 'Monitor dari perspektif user (layanan), bukan hanya device (ping). Setiap alert harus punya runbook ("bila ini bunyi, lakukan itu"). Review alert mingguan: matikan yang tidak pernah ditindaklanjuti.',
      security: 'Data monitoring = peta jaringan real-time; amankan akses Zabbix/Grafana (MFA, VLAN management). Jangan expose dashboard ke internet tanpa auth.',
      challenge: 'Buat daftar 15 item monitoring untuk lab-mu (device + metrik + threshold). Tandai 5 yang KRITIS.',
      interviewQ: 'Q: Jelaskan alur data dari device sampai ke dashboard NOC. — A: Device → (SNMP/agent/API) → collector (Zabbix server) → database (history/trends) → Grafana dashboard + alerting → NOC. Tiap lapisan bisa gagal sendiri-sendiri — diagnosis mengikuti alur ini.',
      quiz: [
        { q: 'Mengapa ada aturan "alert = aksi"?', options: ['Agar sibuk', 'Alert tanpa tindakan yang jelas adalah noise yang menyebabkan alert fatigue — alert penting jadi diabaikan', 'Agar banyak notifikasi', 'Tidak penting'], answer: 1, explain: 'Setiap alert harus menjawab "siapa melakukan apa". Yang tidak bisa dijawab = matikan atau turunkan severity.' },
        { q: 'Saat grafik Grafana kosong, di mana mulai diagnosis?', options: ['Reinstall semua', 'Ikuti alur data: device kirim? collector hidup? database penuh? — tiap lapisan dicek berurutan', 'Tunggu sampai penuh sendiri', 'Salahkan ISP'], answer: 1, explain: 'Alur device→collector→DB→dashboard memberi urutan diagnosis sistematis; tebak-tebakan membuang waktu.' },
        { q: 'Mengapa memonitor layanan (DHCP/DNS/HTTP), bukan hanya ping device?', options: ['Agar keren', 'Device "up" belum tentu layanan jalan — user merasakan layanan, bukan ping. Monitor dari perspektif user.', 'Ping sudah cukup', 'Tidak ada bedanya'], answer: 1, explain: 'Server bisa ping OK tapi service-nya hang. Synthetic check layanan = deteksi yang benar-benar dirasakan user.' },
      ],
    },
    {
      id: '39.7',
      title: 'Automation Requirement',
      body: `<p><b>Automation requirement:</b> tugas operasional apa yang di-automate di PT MajuNet, dengan jaminan keamanan apa. Ini adalah "job description" untuk toolkit Part 35 yang di-deploy di proyek final.</p>
<h3>Daftar Automation (dan Alasannya)</h3>
<div class="tblwrap"><table>
<tr><th>Automation</th><th>Jadwal</th><th>Alasan</th><th>Pengaman</th></tr>
<tr><td>Backup config harian</td><td>02:00</td><td>No backup, no change</td><td>Housekeeping, uji restore kuartalan</td></tr>
<tr><td>Audit interface/IP/route</td><td>Tiap jam</td><td>Deteksi dini deviasi</td><td>Read-only, report-only</td></tr>
<tr><td>Validator drift vs desired.yaml</td><td>Harian 06:00</td><td>Audit compliance otomatis</td><td>Report-only; enforce manual</td></tr>
<tr><td>Health check resource</td><td>Tiap 15 menit</td><td>Cegah penuh/hang</td><td>Threshold dari data historis</td></tr>
<tr><td>Provisioning VLAN/IP</td><td>On-demand (change)</td><td>Konsistensi massal</td><td>Dry-run + approval + change window</td></tr>
<tr><td>Laporan harian NOC</td><td>07:00</td><td>Situational awareness</td><td>Review manusia</td></tr>
</table></div>
<h3>Arsitektur Automation Proyek</h3>
<pre>┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
│ desired.yaml │───▶│  Toolkit     │───▶│  Device          │
│ inventory    │    │  (Part 35)   │    │  CHR/FortiGate   │
│ (Git)        │    │  backup/audit│    │  via SSH/REST    │
└──────────────┘    │  provision/  │    └──────────────────┘
                    │  validate    │
                    └──────┬───────┘
                           ▼
                    ┌──────────────┐
                    │ Log + laporan│──▶ NOC / Git
                    └──────────────┘
   Scheduler: systemd timer di server NOC (VLAN 99).</pre>
<h3>Batasan Tegas (LAB vs Production)</h3>
<ul>
<li><b>Read automation</b> (backup, audit, health): boleh terjadwal otomatis.</li>
<li><b>Write automation</b> (provisioning, enforce): HANYA on-demand, dengan dry-run + approval manusia + change window. <b>Tidak ada script write yang berjalan sendiri terjadwal.</b></li>
<li>Kredensial: Vault (production) / env var (lab). Tidak ada hardcode.</li>
</ul>`,
      terms: [
        ['Runbook', 'Dokumen "bila X terjadi, lakukan Y" — pasangan alert monitoring.'],
        ['On-demand', 'Dijalankan manual saat dibutuhkan (change), bukan terjadwal.'],
      ],
      scenario: 'Audit menemukan script provisioning lama yang terjadwal tiap malam "untuk memastikan config benar" — tanpa sepengetahuan tim baru. Suatu malam ia menimpa emergency fix manual. Pelajaran: write automation terjadwal tanpa pengawasan = bom waktu. Aturan baru: write = on-demand + approval.',
      bestPractices: 'Pisahkan jadwal read vs write. Setiap automation punya owner (penanggung jawab). Dokumentasikan di README toolkit: apa, kapan, mengapa, risikonya.',
      security: 'Server automation = kunci kerajaan: hardening, akses terbatas, log semua eksekusi. Kompromi server ini = kompromi seluruh jaringan.',
      challenge: 'Buat matriks automation untuk lab-mu: daftar 6 automation, jadwal, read/write, dan pengamannya — seperti tabel di atas.',
      interviewQ: 'Q: Mengapa write automation tidak boleh terjadwal otomatis? — A: Karena perubahan config butuh konteks manusia (apakah ada emergency fix manual? apakah change window?) — script buta konteks bisa menimpa perbaikan sah atau mengeksekusi di waktu salah. Write = on-demand + approval.',
      quiz: [
        { q: 'Apa perbedaan perlakuan read automation vs write automation?', options: ['Tidak ada', 'Read (backup/audit) boleh terjadwal; write (provisioning) hanya on-demand dengan dry-run + approval + change window', 'Write lebih aman', 'Read dilarang'], answer: 1, explain: 'Read tidak mengubah keadaan (aman terjadwal); write mengubah (butuh konteks & persetujuan manusia tiap kali).' },
        { q: 'Mengapa setiap automation butuh owner?', options: ['Formalitas', 'Agar ada yang bertanggung jawab saat gagal/bermasalah — automation tanpa pemilik = tidak ada yang memperbaiki saat rusak', 'Agar keren', 'Tidak perlu'], answer: 1, explain: 'Script yang tidak dimiliki = tidak dipelihara = membusuk diam-diam lalu gagal di saat kritis.' },
        { q: 'Di mana kredensial automation disimpan di production?', options: ['Di script', 'Di Vault/secret manager — tidak pernah hardcode', 'Di sticky note', 'Di nama file'], answer: 1, explain: 'Prinsip 32.9: pisahkan secret dari code; Vault memberi enkripsi, audit akses, dan rotasi.' },
      ],
    },
    {
      id: '39.8',
      title: 'Topology Design',
      body: `<p><b>Topology design</b> menerjemahkan semua requirement (39.1–39.7) menjadi <b>gambar dan daftar perangkat</b> — blueprint yang akan dibangun di GNS3 (39.9). Desain 3-layer klasik: <b>core – distribution – access</b>.</p>
<h3>Desain Fisik (GNS3 Lab)</h3>
<pre>                         [Internet: 2 ISP cloud]
                               │         │
                        ┌────────▼─────────▼────────┐
                        │      FortiGate-EDGE       │  FW-EDGE-01 (.99.30)
                        │   (VM, HA bila mampu)    │  Zone policy 39.5
                        └────────────┬─────────────┘
                                     │ trunk
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
     ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
     │  CHR-CORE-01    │════│  CHR-CORE-02    │    │   SW-SRV-01     │
     │  .99.1 (VRRP)   │P2P │  .99.2 (VRRP)   │    │   .99.13        │
     │  router core    │10G │  router core    │    │   VLAN 10,30    │
     └────────┬────────┘    └────────┬────────┘    └─────────────────┘
              │ trunk                │ trunk
     ┌────────▼────────┐    ┌────────▼────────┐    ┌─────────────────┐
     │  SW-ACC-01      │    │  SW-ACC-GD-01   │    │  Server farm    │
     │  .99.11         │    │  .99.14 (gudang)│    │  Zabbix .30.10  │
     │  VLAN 10,20,40 │    │  VLAN 60        │    │  Grafana .30.11 │
     └─────────────────┘    └─────────────────┘    └─────────────────┘
     Kantor Pusat                                    NOC srv .99.100</pre>
<h3>Daftar Perangkat Lab</h3>
<div class="tblwrap"><table>
<tr><th>Hostname</th><th>Peran</th><th>Platform Lab</th><th>IP MGMT</th></tr>
<tr><td>CHR-CORE-01/02</td><td>Core router (VRRP)</td><td>CHR di GNS3</td><td>192.168.99.1/.2</td></tr>
<tr><td>FW-EDGE-01</td><td>Edge firewall</td><td>FortiGate VM</td><td>192.168.99.30</td></tr>
<tr><td>SW-CORE-01</td><td>Core switch</td><td>Switch GNS3/VM</td><td>192.168.99.11</td></tr>
<tr><td>SW-ACC-01</td><td>Access kantor</td><td>Switch GNS3/VM</td><td>192.168.99.12</td></tr>
<tr><td>SW-ACC-GD-01</td><td>Access gudang</td><td>Switch GNS3/VM</td><td>192.168.99.14</td></tr>
<tr><td>ZABBIX/GRAFANA</td><td>Monitoring</td><td>VM Linux</td><td>192.168.30.10/.11</td></tr>
<tr><td>NOC-AUTO</td><td>Automation server</td><td>VM Linux</td><td>192.168.99.100</td></tr>
</table></div>
<h3>Keputusan Desain Kunci (dengan ALASAN)</h3>
<ul>
<li><b>Router-on-a-stick vs L3 switch:</b> CHR sebagai router antar-VLAN (lab-friendly, konsisten dengan Part 13).</li>
<li><b>FortiGate di edge, bukan di core:</b> pemisahan peran — CHR routing internal cepat, FortiGate fokus security perimeter.</li>
<li><b>Dual core di lab:</b> 2 CHR untuk latihan VRRP/failover (39.21) — di production wajib, di lab untuk belajar.</li>
</ul>`,
      terms: [
        ['3-layer design', 'Core (tulang punggung cepat) – Distribution (policy/routing) – Access (user).'],
        ['Router-on-a-stick', 'Satu router dengan sub-interface VLAN untuk routing antar-VLAN.'],
      ],
      scenario: 'Desain awal menaruh FortiGate sebagai router antar-VLAN juga — review menemukan throughput FortiGate VM lab tidak cukup untuk trafik CCTV multicast. Keputusan: CHR untuk routing internal, FortiGate murni edge. Review desain menghemat 2 minggu rework.',
      bestPractices: 'Desain di kertas dulu (draw.io), review dengan "musuh" (minta orang lain mencari lubang), baru bangun. Setiap garis di gambar harus punya alasan.',
      security: 'Desain harus menunjukkan choke point: semua trafik antar zone lewat titik yang bisa di-firewall dan di-log — tidak ada "jalan tikus".',
      challenge: 'Gambar topologi lab versimu sendiri di draw.io: minimal 1 router, 1 firewall, 2 switch, 3 VLAN. Tulis 3 keputusan desain + alasannya.',
      interviewQ: 'Q: Mengapa memisahkan peran CHR (routing) dan FortiGate (edge security)? — A: Separation of concern: CHR unggul routing antar-VLAN cepat; FortiGate unggul inspeksi keamanan. Satu device untuk semua = single point of failure + performa kompromi.',
      quiz: [
        { q: 'Apa peran tiap layer dalam desain 3-layer?', options: ['Sama semua', 'Core = tulang punggung cepat; distribution = policy/routing; access = konek user', 'Core untuk user', 'Tidak ada arti'], answer: 1, explain: 'Pemisahan peran = skalabilitas & troubleshooting terarah: masalah user → cek access; masalah antar site → cek core.' },
        { q: 'Mengapa desain menaruh dual CHR core (bukan satu)?', options: ['Agar mahal', 'Menghilangkan single point of failure di jantung jaringan + melatih VRRP/failover', 'Agar cepat 2x', 'Tidak ada alasan'], answer: 1, explain: 'Core mati = semua mati. Dual + VRRP = failover otomatis; di lab juga menjadi materi failure testing.' },
        { q: 'Kapan desain topologi dianggap selesai?', options: ['Saat gambar bagus', 'Saat tiap garis/perangkat punya alasan yang tertelusur ke requirement + sudah di-review orang lain', 'Saat di-print', 'Tidak pernah'], answer: 1, explain: 'Desain = keputusan beralasan, bukan gambar. Review menangkap lubang yang tidak terlihat pembuatnya.' },
      ],
    },
    {
      id: '39.9',
      title: 'GNS3 Implementation',
      body: `<p><b>Membangun topologi 39.8 di GNS3</b> — dari gambar menjadi lab hidup. Ikuti struktur hands-on: Topology → Objective → Configuration → Verification → Failure Injection → Troubleshooting → Fix → Final Verification.</p>
<h3>Topology & Objective</h3>
<p>Topologi: gambar 39.8. Objective: semua node bisa dibuat, di-link, dan di-start; CHR bisa diakses via cloud NAT untuk download package bila perlu.</p>
<h3>Configuration (Step-by-Step)</h3>
<pre>1. Buat project baru: "final-enterprise-lab" di GNS3.
2. Tambah template: 2x CHR (RouterOS 7.x), 1x FortiGate VM, 3x switch
   (gunakan Ethernet switch bawaan GNS3 atau VM switch bila butuh VLAN).
   ALASAN versi dicatat: beda versi = beda perilaku (Part 13!).
3. Hubungkan sesuai 39.8:
   - CHR-CORE-01 ether1 → SW-CORE-01 (trunk)
   - CHR-CORE-01 ether2 ↔ CHR-CORE-02 ether2 (link P2P 10.0.0.0/30)
   - FortiGate port1 → ISP cloud; port2 → CHR-CORE-01 ether3
   - SW-ACC-01 uplink → SW-CORE-01; SW-ACC-GD-01 uplink → SW-CORE-01
4. Tambah cloud NAT untuk akses internet lab (update package, NTP).
   ALASAN cloud terpisah: lab tetap terisolasi; internet hanya untuk kebutuhan build.
5. Tambah 2 VM Linux: ZABBIX (.30.10) dan NOC-AUTO (.99.100).
6. Snapshot: "tahap-0-topologi". ALASAN: tiap tahap punya snapshot = time machine.</pre>
<h3>Verification</h3>
<p>Semua node status hijau (running). Dari CHR-CORE-01: <code>/ping 10.0.0.2</code> (P2P ke core-02) sukses. Snapshot tersimpan.</p>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<p><b>Injeksi:</b> stop paksa CHR-CORE-02 lalu start lagi dengan RAM dikurangi setengah (simulasi resource contention). <b>Gejala:</b> boot lambat, GNS3 warning. <b>Troubleshooting:</b> cek resource host (<code>top</code> di host), alokasi RAM per node. <b>Fix:</b> sesuaikan alokasi; dokumentasikan kebutuhan resource minimum tiap node di README lab. <b>Final verification:</b> semua node boot < 3 menit, snapshot "tahap-0-ok".</p>
<div class="callout"><div class="t">Disiplin Snapshot</div><p style="margin:4px 0 0">Snapshot per tahap (topologi → VLAN → routing → firewall → monitoring → automation). Aturan: <b>snapshot sebelum eksperimen berisiko</b>. Rollback 1 menit vs rebuild 3 jam — tidak ada alasan melewatkannya.</p></div>`,
      terms: [
        ['GNS3 project', 'File proyek berisi topologi, node, dan link lab.'],
        ['Snapshot', 'Titik pemulihan keadaan lab — time machine eksperimen.'],
        ['Cloud NAT', 'Node GNS3 yang menjembatani lab ke internet host via NAT.'],
      ],
      scenario: 'Eksperimen firewall salah config mengunci akses ke semua CHR. Tanpa snapshot: rebuild 4 jam. Dengan snapshot "tahap-3-routing": restore 2 menit, ulangi eksperimen dengan benar. Snapshot adalah asuransi termurah di lab.',
      bestPractices: 'Catat versi tiap image (CHR, FortiGate) di README. Alokasikan resource host realistis. Satu project GNS3 = satu tujuan (jangan campur lab lain).',
      security: 'Cloud NAT = jembatan ke internet: pastikan firewall lab default-deny ke arah lab dari internet. Jangan bridge lab langsung ke LAN kantor tanpa firewall.',
      challenge: 'Bangun topologi 39.8 versi minimal (1 CHR, 1 switch, 2 VLAN, 1 VM Linux). Snapshot tiap tahap dan catat waktu boot tiap node.',
      interviewQ: 'Q: Mengapa snapshot per tahap penting di lab? — A: Karena eksperimen (terutama failure testing) sengaja merusak; snapshot memungkinkan iterasi cepat — coba, rusak, kembalikan dalam menit — tanpa takut kehilangan progres.',
      quiz: [
        { q: 'Kapan harus membuat snapshot GNS3?', options: ['Setahun sekali', 'Per tahap build dan SEBELUM eksperimen berisiko — rollback menit vs rebuild jam', 'Tidak pernah', 'Hanya saat ingat'], answer: 1, explain: 'Snapshot = asuransi; failure testing (39.21) sengaja merusak lab — tanpa snapshot tiap iterasi mahal.' },
        { q: 'Mengapa versi image (CHR/FortiGate) dicatat?', options: ['Formalitas', 'Beda versi = beda perilaku fitur; dokumentasi versi membuat lab reproducible dan troubleshooting tepat', 'Agar keren', 'Tidak penting'], answer: 1, explain: 'Lab yang tidak reproducible = tidak bisa di-debug orang lain ("di saya bisa"). Versi adalah bagian dari definisi lab.' },
        { q: 'Apa fungsi cloud NAT di topologi lab?', options: ['Menambah kecepatan', 'Jembatan terkontrol lab ke internet (update, NTP) tanpa mengekspos lab langsung', 'Pengganti firewall', 'Tidak ada'], answer: 1, explain: 'Lab butuh internet untuk package/update, tapi tetap terisolasi — NAT memberi akses keluar tanpa membuka akses masuk.' },
      ],
    },
    {
      id: '39.10',
      title: 'MikroTik Implementation',
      body: `<p><b>Konfigurasi dasar CHR-CORE-01/02</b>: identity, user, service, dan persiapan VRRP. Ini fondasi sebelum VLAN (39.13) dan routing (39.14).</p>
<h3>Configuration (CHR-CORE-01)</h3>
<pre>/system identity set name=CHR-CORE-01
# ALASAN: hostname konsisten = identifikasi di log, monitoring, dan dokumen.

/user add name=noc-admin password=... group=full
/user add name=automation password=... group=read
# ALASAN dua user: manusia (full) vs script (read dulu — naikkan saat provisioning).

/ip service set ssh port=22 disabled=no
/ip service set www-ssl disabled=no port=443
/ip service set telnet disabled=yes
/ip service set ftp disabled=yes
# ALASAN: hanya layanan yang dibutuhkan yang aktif (least privilege).
# www-ssl untuk REST API automation (Part 32.5).

/system clock set time-zone-name=Asia/Jakarta
/system ntp client set enabled=yes server-dns-names=time.google.com
# ALASAN NTP: log & sertifikat butuh waktu akurat; troubleshooting tanpa timestamp benar = buta.

/ip address add address=10.0.0.1/30 interface=ether2
# Link P2P ke CHR-CORE-02 (rencana 39.3). CHR-CORE-02: 10.0.0.2/30.</pre>
<h3>Persiapan VRRP (IP Virtual)</h3>
<pre>/interface vrrp add name=vrrp-mgmt interface=ether1 vrid=99 priority=200
/ip address add address=192.168.99.1/24 interface=vrrp-mgmt
# ALASAN VRRP: 192.168.99.1 adalah IP VIRTUAL milik "siapa yang aktif".
# priority 200 (core-01, master) vs 100 (core-02, backup).
# User/gateway menunjuk .99.1 — tidak peduli router fisik mana yang aktif.</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> <code>/ip address print</code> menunjukkan .99.1 di vrrp-mgmt; <code>/interface vrrp print</code> status RM (master) di core-01. <b>Failure injection:</b> stop CHR-CORE-01 → dalam &lt; 1 menit core-02 menjadi master (cek <code>vrrp print</code>), gateway .99.1 tetap hidup. <b>Troubleshooting:</b> bila tidak failover: cek VRID sama? interface benar? multicast VRRP tidak difilter? <b>Fix & final:</b> start core-01 → ia merebut kembali master (preempt); dokumentasikan waktu failover.</p>
<div class="callout"><div class="t">VRRP: Ilusi Satu Router</div><p style="margin:4px 0 0">Bagi seluruh jaringan, hanya ada "192.168.99.1". Di baliknya dua router fisik saling memantau via multicast. Inilah high availability paling sederhana dan paling penting dipahami.</p></div>`,
      terms: [
        ['VRRP', 'Protokol redundansi gateway: IP virtual pindah otomatis ke router standby.'],
        ['Preempt', 'Master kembali merebut peran setelah pulih (bila dikonfigurasi).'],
        ['VRID', 'Virtual Router ID — pengelompokan VRRP; harus sama di pasangan.'],
      ],
      scenario: 'Maintenance firmware CHR-CORE-01 siang hari: karena VRRP, upgrade dilakukan tanpa downtime — backup mengambil alih, master di-upgrade, lalu kembali. Tanpa VRRP: maintenance = downtime = lembur malam hari.',
      bestPractices: 'Uji failover SEBELUM dibutuhkan (jadwalkan tiap kuartal). Dokumentasikan waktu failover aktual. Priority bedakan jelas (200 vs 100).',
      security: 'VRRP tanpa autentikasi bisa di-hijack (rogue router klaim master). Aktifkan VRRP authentication bila didukung; batasi multicast VRRP di switch.',
      challenge: 'Implementasikan VRRP di 2 CHR lab-mu. Ukur waktu failover (ping gateway saat master dimatikan — hitung paket hilang).',
      interviewQ: 'Q: Bagaimana VRRP mencapai failover tanpa mengubah gateway di client? — A: IP virtual (.99.1) dan MAC virtual dimiliki "peran master", bukan device fisik. Saat master mati, backup mengambil alih IP+MAC virtual via gratuitous ARP — client tidak sadar pergantian.',
      quiz: [
        { q: 'Apa fungsi IP virtual 192.168.99.1 dalam VRRP?', options: ['IP tambahan biasa', 'IP milik "peran master" — pindah otomatis ke router standby saat master mati, client tidak perlu ganti gateway', 'IP untuk internet', 'Tidak ada fungsi'], answer: 1, explain: 'Abstraksi: client menunjuk ke peran, bukan device. Failover = peran pindah device.' },
        { q: 'Bagaimana router backup tahu master mati?', options: ['Diberitahu user', 'Master mengirim hello multicast berkala; bila berhenti (timeout), backup mengambil alih', 'Dengan menebak', 'Tidak bisa tahu'], answer: 1, explain: 'Heartbeat multicast VRRP; hilangnya hello = master dianggap mati = failover. Sederhana dan cepat.' },
        { q: 'Mengapa NTP penting di router?', options: ['Agar jam bagus', 'Log, sertifikat, dan korelasi insiden antar device butuh waktu akurat dan sinkron', 'Tidak penting', 'Hanya untuk cantik'], answer: 1, explain: 'Tanpa waktu sinkron, log 2 router tidak bisa dikorelasikan ("kejadian A dulu atau B dulu?") — troubleshooting buta.' },
      ],
    },
    {
      id: '39.11',
      title: 'FortiGate Implementation',
      body: `<p><b>FortiGate sebagai edge firewall</b>: zone, policy sesuai matriks 39.5, NAT, dan DHCP untuk GUEST. Dijelaskan via <b>GUI dan CLI</b> — keduanya harus dikuasai.</p>
<h3>Konsep: Zone & Policy (GUI = Policy & Objects)</h3>
<p>FortiGate berpikir dalam <b>zone</b> (kumpulan interface) dan <b>policy</b> (aturan antar zone, dibaca <b>berurutan dari atas</b> — first match wins!).</p>
<h3>Configuration</h3>
<p><b>GUI:</b> Network → Interfaces → buat zone: <code>LAN-OFFICE</code> (port2), <code>LAN-GUEST</code> (port3), <code>WAN</code> (port1). Policy & Objects → Firewall Policy → buat sesuai matriks 39.5, urutan: ALLOW spesifik dulu, DENY ALL terakhir.</p>
<p><b>CLI (setara):</b></p>
<pre>config firewall policy
    edit 1
        set name "GUEST-to-Internet"
        set srcintf "LAN-GUEST"      # ALASAN srcintf/dstintf: policy FortiGate
        set dstintf "WAN"            # berbasis ZONE, bukan IP — lebih ekspresif.
        set srcaddr "all"
        set dstaddr "all"
        set service "ALL"
        set action accept
        set nat enable               # ALASAN NAT: IP privat guest → 1 IP publik WAN
        set logtraffic all           # ALASAN log: policy tanpa log = tidak bisa diaudit!
    next
    edit 2
        set name "GUEST-deny-internal"
        set srcintf "LAN-GUEST"
        set dstintf "LAN-OFFICE" "LAN-SERVER" "LAN-MGNT"
        set action deny
        set logtraffic all
    next
end
# URUTAN: policy dibaca dari atas; DENY ALL harus PALING BAWAH (implisit ada,
# tapi eksplisit + log lebih baik untuk audit).</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> dari GUEST: ping 8.8.8.8 OK, ping 192.168.20.1 GAGAL (deny). Cek <code>diagnose firewall iprope list 100004</code> / GUI Log. <b>Failure injection:</b> pindahkan DENY ke atas ALLOW (urutan salah) → internet guest mati. <b>Troubleshooting:</b> <code>diagnose debug flow</code> untuk trace paket ("policy mana yang match?"). <b>Fix:</b> kembalikan urutan; dokumentasikan "urutan policy = bagian dari config".</p>
<div class="callout"><div class="t">First Match Wins</div><p style="margin:4px 0 0">FortiGate memakai policy PERTAMA yang cocok (bukan "paling spesifik"). Rule ALLOW ANY yang tidak sengaja di atas akan mengalahkan DENY di bawahnya — penyebab klasik "kok bisa lolos?". Selalu review urutan, bukan hanya isi rule.</p></div>`,
      terms: [
        ['Zone', 'Pengelompokan interface FortiGate sebagai basis policy.'],
        ['Firewall policy', 'Aturan srcintf→dstintf: action accept/deny + NAT + log.'],
        ['First match wins', 'Policy pertama yang cocok dipakai; urutan = bagian dari keamanan.'],
      ],
      scenario: 'Insiden: guest bisa akses server. Penyebab: rule "GUEST-to-Internet" memakai dstintf WAN tapi ada rule ALLOW ANY di atasnya dari migrasi lama. Solusi: audit urutan policy + hapus rule yatim. Pelajaran: review policy = review urutan.',
      bestPractices: 'Tiap policy: nama deskriptif + log aktif + komentar alasan (tiket). DENY ALL eksplisit di bawah. Review kuartalan.',
      security: 'Default password FortiGate WAJIB diganti sebelum konek internet. HTTPS admin hanya dari MGMT. Backup config terenkripsi.',
      challenge: 'Implementasikan 3 policy dari matriks 39.5 di FortiGate lab (GUI atau CLI). Uji tiap ALLOW dan DENY-nya dengan ping/curl.',
      interviewQ: 'Q: Mengapa urutan firewall policy penting di FortiGate? — A: Karena first match wins — policy pertama yang cocok menentukan nasib paket. Rule longgar di atas membatalkan rule ketat di bawahnya.',
      quiz: [
        { q: 'Apa arti "first match wins" pada FortiGate?', options: ['Rule tercepat menang', 'Policy pertama (dari atas) yang cocok dengan paket yang dipakai — urutan menentukan', 'Rule terakhir menang', 'Acak'], answer: 1, explain: 'Berbeda dari "paling spesifik menang"; di FortiGate urutan = logika. Review harus mencakup urutan.' },
        { q: 'Mengapa set logtraffic all di tiap policy?', options: ['Agar lambat', 'Policy tanpa log tidak bisa diaudit/di-troubleshoot — "siapa lolos, kapan, ke mana" harus tercatat', 'Wajib pabrik', 'Tidak penting'], answer: 1, explain: 'Log adalah bukti dan alat diagnosis; insiden tanpa log = investigasi buta.' },
        { q: 'Di mana posisi DENY ALL yang benar?', options: ['Paling atas', 'Paling bawah — sebagai jaring pengaman terakhir setelah semua ALLOW spesifik', 'Di tengah', 'Tidak perlu'], answer: 1, explain: 'Deny by default diwujudkan sebagai rule terakhir; menaruhnya di atas memblokir semua ALLOW di bawahnya.' },
      ],
    },
    {
      id: '39.12',
      title: 'Switching Implementation',
      body: `<p><b>Konfigurasi switching</b>: peran tiap switch, STP, dan hardening dasar. Switch adalah fondasi Layer 2 — salah config di sini, VLAN (39.13) tidak akan jalan.</p>
<h3>Peran & Prioritas STP</h3>
<div class="tblwrap"><table>
<tr><th>Switch</th><th>Peran</th><th>STP Priority</th><th>Alasan</th></tr>
<tr><td>SW-CORE-01</td><td>Root bridge</td><td>4096</td><td>Harus jadi pusat STP (paling terhubung)</td></tr>
<tr><td>SW-ACC-01</td><td>Access kantor</td><td>32768 (default)</td><td>—</td></tr>
<tr><td>SW-ACC-GD-01</td><td>Access gudang</td><td>32768</td><td>—</td></tr>
<tr><td>SW-SRV-01</td><td>Server</td><td>16384</td><td>Kedua setelah core</td></tr>
</table></div>
<h3>Configuration (Contoh Konsep per Switch)</h3>
<pre># 1. Identity & management IP (VLAN 99) — fondasi 38.4
# 2. STP: pastikan root bridge = SW-CORE-01 (priority 4096)
#    ALASAN: root yang salah (switch access jadi root) = path trafik memutar.
# 3. Portfast di port access (skip listening/learning):
#    ALASAN: PC/printer tidak butuh 30 detik STP; tapi JANGAN di port trunk/uplink!
# 4. BPDU guard di port access:
#    ALASAN: bila ada yang colok switch liar, port langsung shutdown (anti loop).
# 5. Storm control (broadcast/multicast):
#    ALASAN: batasi badai broadcast (pelajaran skenario 39.4!) agar tidak melumpuhkan switch.
# 6. Port tak terpakai: shutdown (38.6).</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> topologi STP: root = SW-CORE-01 (cek via status STP); tidak ada port blocking yang aneh. <b>Failure injection:</b> buat loop fisik (hubungkan 2 port access yang sama-sama aktif) → storm control + BPDU guard harus bereaksi; amati log. <b>Troubleshooting:</b> bila loop melumpuhkan: identifikasi port via traffic spike, shutdown manual. <b>Fix:</b> pastikan guard aktif di semua port access; dokumentasikan.</p>
<div class="callout"><div class="t">STP: Asuransi yang Tak Terlihat</div><p style="margin:4px 0 0">STP tidak menambah kecepatan — ia mencegah kiamat (loop). Root bridge yang benar + BPDU guard + storm control = tiga lapis pertahanan Layer 2.</p></div>`,
      terms: [
        ['Root bridge', 'Switch pusat STP; semua path dihitung darinya.'],
        ['BPDU guard', 'Shutdown port access bila menerima BPDU (indikasi switch liar/loop).'],
        ['Storm control', 'Batasan rate broadcast/multicast per port.'],
        ['Portfast', 'Port access langsung forwarding (tanpa tunggu STP) — hanya untuk endpoint.'],
      ],
      scenario: 'Karyawan colok switch kecil di bawah meja (loop ke 2 port dinding). Tanpa BPDU guard: broadcast storm melumpuhkan 1 lantai 2 jam. Dengan guard: port shutdown otomatis dalam detik + alert. Perbedaannya = konfigurasi 5 menit saat implementasi.',
      bestPractices: 'Root bridge eksplisit (jangan serahkan ke default/MAC terkecil). BPDU guard + storm control di SEMUA port access. Dokumentasikan topologi STP.',
      security: 'BPDU guard juga anti "switch jahat" yang mencoba menjadi root (STP manipulation). Port-security sebagai lapisan tambahan.',
      challenge: 'Di lab: tentukan root bridge manual, aktifkan BPDU guard di 1 port access, dan simulasikan loop terkontrol — amati reaksinya.',
      interviewQ: 'Q: Mengapa root bridge harus ditentukan manual, bukan dibiarkan default? — A: Default = MAC terkecil menang — bisa jadi switch access tua di pojok menjadi root, membuat path trafik memutar dan tidak optimal. Root harus switch paling terhubung (core).',
      quiz: [
        { q: 'Apa fungsi BPDU guard?', options: ['Mempercepat STP', 'Men-shutdown port access yang menerima BPDU — mencegah loop/switch liar', 'Mengganti kabel', 'Tidak ada fungsi'], answer: 1, explain: 'Port access seharusnya hanya endpoint; BPDU di sana = ada switch (potensi loop) → matikan port sebelum bencana.' },
        { q: 'Kapan boleh memakai portfast?', options: ['Di semua port', 'Hanya di port access ke endpoint (PC/printer) — TIDAK PERNAH di trunk/uplink', 'Di port fiber saja', 'Tidak pernah'], answer: 1, explain: 'Portfast melewati STP check; di trunk/uplink itu menghilangkan proteksi loop antar switch.' },
        { q: 'Apa fungsi storm control?', options: ['Menambah kecepatan', 'Membatasi rate broadcast/multicast per port agar badai tidak melumpuhkan switch', 'Mematikan switch', 'Tidak penting'], answer: 1, explain: 'Satu device rusak bisa membanjiri broadcast; storm control memangkasnya di port sumber.' },
      ],
    },
    {
      id: '39.13',
      title: 'VLAN Implementation',
      body: `<p><b>Implementasi VLAN</b> sesuai master table 39.4 — memakai script automation Part 35 (bukan manual!) sebagai pembuktian konsep. Inilah saat teori menjadi praktik massal.</p>
<h3>Configuration: via Automation (Disarankan)</h3>
<pre># desired.yaml (sumber: 39.4)
vlans:
  - {id: 10, name: VLAN10-CCTV, subnet: 192.168.10.0/24}
  - {id: 20, name: VLAN20-OFFICE, subnet: 192.168.20.0/24}
  - {id: 30, name: VLAN30-SERVER, subnet: 192.168.30.0/24}
  - {id: 40, name: VLAN40-GUEST, subnet: 192.168.40.0/24}
  - {id: 60, name: VLAN60-GUDANG, subnet: 192.168.60.0/24}
  - {id: 99, name: VLAN99-MGMT, subnet: 192.168.99.0/24}

# Jalankan (pola 35.8 + 35.10):
# 1. backup.py  → backup dulu (no backup, no change)
# 2. provision.py --dry-run  → review apa yang akan dibuat
# 3. provision.py  → eksekusi idempotent ke CHR-CORE-01/02
# 4. validate.py  → pastikan semua VLAN ada</pre>
<h3>Trunk Pruning (Manual/Terkonfirmasi)</h3>
<p>Setelah VLAN ada: atur trunk tiap switch sesuai 39.4 (hanya VLAN yang dibutuhkan). Di CHR: <code>/interface bridge vlan</code> atau VLAN filtering sesuai platform switch lab.</p>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> <code>/interface vlan print</code> di kedua CHR = 6 VLAN; client di tiap VLAN dapat IP benar (DHCP/sesuai 39.3). <b>Failure injection:</b> hapus VLAN 40 di satu CHR → validate.py mendeteksi drift (35.11); user guest di switch itu kehilangan IP. <b>Troubleshooting:</b> cek trunk (apakah VLAN di-prune berlebihan?), cek DHCP. <b>Fix:</b> provision ulang (idempotent — hanya yang hilang dibuat); final: validate = VALID.</p>
<div class="callout blue"><div class="t">Manual vs Automation di Proyek Nyata</div><p style="margin:4px 0 0">Proyek ini mensyaratkan: VLAN di-deploy via script (provision.py), bukan ketik manual. Alasannya: konsistensi antar device + audit trail + bukti untuk portfolio ("saya deploy 6 VLAN ke 2 router via automation, idempotent, terverifikasi").</p></div>`,
      terms: [
        ['Provisioning', 'Pembuatan konfigurasi massal dari source of truth via automation.'],
      ],
      scenario: 'Deploy VLAN ke 2 core + 4 switch: manual = 6 device × 6 VLAN = 36 entri (satu salah ketik = troubleshooting 1 jam). Automation: 1x run, 36/36 benar, laporan verifikasi otomatis. Inilah ROI Part 35 di proyek nyata.',
      bestPractices: 'Urutan: backup → dry-run → eksekusi → validasi. Jangan prune VLAN management (99) dari trunk antar switch — kamu akan mengunci diri sendiri.',
      security: 'Verifikasi pruning: pastikan VLAN 30 (server) tidak bocor ke access switch yang tidak butuh. Test dengan client di tiap VLAN.',
      challenge: 'Deploy 6 VLAN ke CHR lab-mu via script idempotent (35.8). Buktikan: run 2x, run ke-2 no-op. Lalu uji pruning 1 trunk.',
      interviewQ: 'Q: Mengapa VLAN di-deploy via automation, bukan manual, di proyek ini? — A: Konsistensi (data tunggal), kecepatan (36 entri sekaligus), verifikasi otomatis, dan audit trail — plus menjadi bukti skill automation di portfolio.',
      quiz: [
        { q: 'Urutan aman deploy VLAN massal?', options: ['Langsung eksekusi', 'Backup → dry-run → eksekusi → validasi', 'Validasi dulu baru backup', 'Eksekusi lalu backup'], answer: 1, explain: 'Backup = jalan pulang; dry-run = review; eksekusi; validasi = bukti. Urutan ini tidak bisa ditawar.' },
        { q: 'Apa yang TIDAK boleh di-prune dari trunk antar switch?', options: ['VLAN CCTV', 'VLAN management (99) — kamu butuh jalur management ke semua switch', 'VLAN guest', 'Semua boleh'], answer: 1, explain: 'Prune VLAN 99 = memutus akses management ke switch di seberang = mengunci diri sendiri.' },
        { q: 'Bagaimana membuktikan deploy VLAN idempotent?', options: ['Katanya saja', 'Jalankan script 2x: run ke-2 harus no-op ("sudah ada — lewati") dan validate tetap VALID', 'Restart router', 'Tidak bisa dibuktikan'], answer: 1, explain: 'Idempotency = klaim yang bisa diuji: eksekusi ulang tidak mengubah apa pun. Ini test case 39.20.' },
      ],
    },
    {
      id: '39.14',
      title: 'Routing Implementation',
      body: `<p><b>Routing antar-VLAN dan ke internet</b>: gateway .1 di tiap VLAN (39.3), static route antar core, dan default route ke FortiGate. Prinsip: <b>setiap subnet tahu jalan ke semua subnet</b> (sesuai policy 39.5).</p>
<h3>Configuration (CHR-CORE-01)</h3>
<pre># 1. IP gateway tiap VLAN (pola 35.9 — via script idempotent!)
/ip address add address=192.168.10.1/24 interface=VLAN10-CCTV
/ip address add address=192.168.20.1/24 interface=VLAN20-OFFICE
/ip address add address=192.168.30.1/24 interface=VLAN30-SERVER
/ip address add address=192.168.40.1/24 interface=VLAN40-GUEST
/ip address add address=192.168.60.1/24 interface=VLAN60-GUDANG
# ALASAN .1 konsisten: gateway = network+1 di semua VLAN (39.3).

# 2. Default route ke FortiGate (edge)
/ip route add dst-address=0.0.0.0/0 gateway=192.168.99.30
# ALASAN via FortiGate: semua trafik internet harus lewat inspeksi firewall (39.5).

# 3. Route ke subnet di balik core-02 (bila ada) via P2P
/ip route add dst-address=192.168.60.0/24 gateway=10.0.0.2
# (Contoh bila VLAN 60 di-routing via core-02; sesuaikan topologi aktual.)</pre>
<h3>Packet Flow: PC Office ke Server</h3>
<pre>PC (192.168.20.50) → gateway .20.1 (CHR, VLAN 20 interface)
  → CHR cek routing table: 192.168.30.0/24 = connected (VLAN 30)
  → CHR cek firewall: policy 20→30 ALLOW? (di CHR: filter rule; antar-VLAN via FortiGate bila desain demikian)
  → forward ke 192.168.30.10 (Zabbix) via VLAN 30 interface
  → balasan: cek route kembali + firewall state (established)
# ALASAN paham flow: troubleshooting "tidak bisa akses" = telusuri hop ini satu per satu.</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> dari tiap VLAN: ping gateway sendiri OK; ping gateway VLAN lain OK (routing); ping 8.8.8.8 OK (default route + NAT FortiGate). <b>Failure injection:</b> hapus default route → internet mati tapi antar-VLAN hidup (isolasi: masalah di edge, bukan routing internal). <b>Troubleshooting:</b> <code>/ip route print</code> (route ada & active?), <code>/tool traceroute</code> (berhenti di hop mana?). <b>Fix:</b> kembalikan route; final: semua ping OK.</p>`,
      terms: [
        ['Inter-VLAN routing', 'Routing antar VLAN via gateway L3 (di sini CHR).'],
        ['Default route', '0.0.0.0/0 — jalan ke internet via FortiGate.'],
      ],
      scenario: 'User office tidak bisa buka aplikasi server, tapi ping gateway OK. Packet flow: paket sampai CHR (.20.1), route ke .30.0/24 ada, tapi firewall rule 20→30 hilang setelah reboot (belum di-save permanen!). Solusi: re-apply + pastikan persistent. Pelajaran: verifikasi tiap hop, dan pastikan config tersimpan.',
      bestPractices: 'Deploy IP via script (35.9) agar konsisten. Dokumentasikan tiap static route + alasannya. Uji packet flow tiap pasangan VLAN penting (matriks 39.5).',
      security: 'Routing tanpa firewall = jalan tol tanpa gerbang. Pastikan tiap jalur antar-VLAN melewati policy check (di CHR atau FortiGate sesuai desain).',
      challenge: 'Gambar packet flow lengkap untuk: GUEST → internet (lewat NAT FortiGate). Tandai tiap hop + di mana policy di-cek.',
      interviewQ: 'Q: Bagaimana men-troubleshoot "bisa ping gateway tapi tidak bisa ke server"? — A: Telusuri packet flow: route ke subnet tujuan ada & active? firewall mengizinkan? ARP tujuan resolved? server-nya sendiri hidup? Uji tiap hop dengan ping/traceroute berurutan.',
      quiz: [
        { q: 'Mengapa default route mengarah ke FortiGate, bukan langsung ke ISP?', options: ['Agar jauh', 'Agar semua trafik internet melewati inspeksi firewall (IPS, web filter, logging)', 'Karena wajib', 'Agar lambat'], answer: 1, explain: 'Edge firewall adalah choke point keamanan; bypass = trafik tanpa inspeksi = lubang keamanan.' },
        { q: 'PC bisa ping gateway VLAN-nya tapi tidak bisa ping gateway VLAN lain. Kemungkinan?', options: ['Kabel putus', 'Route antar-VLAN hilang/tidak active, atau firewall memblokir antar-VLAN', 'PC rusak', 'Internet mati'], answer: 1, explain: 'Ping gateway OK = L1-L3 lokal sehat. Gagal ke VLAN lain = masalah di router (route) atau policy (firewall).' },
        { q: 'Apa gunanya memahami packet flow hop-by-hop?', options: ['Hanya teori', 'Troubleshooting sistematis: tahu di hop mana paket seharusnya berada → tahu di mana ia hilang', 'Agar keren', 'Tidak ada'], answer: 1, explain: 'Tanpa peta flow, troubleshooting = tebak-tebakan. Dengan flow, tiap hop bisa diuji satu per satu.' },
      ],
    },
    {
      id: '39.15',
      title: 'Fiber Backbone Design',
      body: `<p><b>Desain backbone fiber</b> PT MajuNet: menghubungkan Kantor Pusat – Gudang (2 km) dengan kapasitas, redundansi, dan dokumentasi yang benar (38.7). Di lab GNS3 ini disimulasikan; desainnya tetap harus real.</p>
<h3>Desain Link</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Pilihan</th><th>Alasan</th></tr>
<tr><td>Media</td><td>Single-mode OS2, 12 core</td><td>Jarak 2 km + spare 50% (8 core cadangan)</td></tr>
<tr><td>Kecepatan</td><td>10 Gbps (SFP+ LR)</td><td>Agregat CCTV + office; LR untuk 2 km</td></tr>
<tr><td>Rute</td><td>2 path fisik berbeda (Path A & B)</td><td>Redundansi: galian di satu rute tidak mematikan keduanya</td></tr>
<tr><td>Terminasi</td><td>Patch panel di tiap ujung, label per core</td><td>38.7: core mapping</td></tr>
</table></div>
<h3>Core Mapping Backbone (Contoh)</h3>
<pre>Kabel FB-01 (Path A, 12 core): core 1-2 = uplink aktif (10G),
  core 3-4 = spare siap pakai, core 5-12 = spare ekspansi.
Kabel FB-02 (Path B, 12 core): core 1-2 = uplink standby,
  sisanya spare.
Baseline redaman: diukur saat instalasi (OTDR), disimpan di dokumen.
Failover: bila Path A putus → trafik pindah ke Path B (di lab: simulasikan
dengan men-disable link dan amati convergence).</pre>
<h3>Simulasi di Lab</h3>
<p>Di GNS3: dua link virtual paralel antara site (simulasi Path A/B). Uji: putuskan satu → ukur waktu convergence & packet loss (ping kontinyu). Dokumentasikan hasilnya sebagai "bukti ketahanan desain".</p>
<div class="callout blue"><div class="t">Fiber = Investasi Jangka Panjang</div><p style="margin:4px 0 0">Kabel fiber yang ditanam hari ini dipakai 15–20 tahun. Karena itu: single-mode (future-proof ke 100G), core banyak (spare murah saat gelar, mahal belakangan), dan dokumentasi sempurna (38.7).</p></div>`,
      terms: [
        ['Single-mode OS2', 'Fiber untuk jarak jauh (km) — pilihan backbone.'],
        ['SFP+ LR', 'Transceiver 10G untuk jarak jauh (Long Reach).'],
        ['Path diversity', 'Dua rute fisik berbeda untuk redundansi.'],
      ],
      scenario: 'Proyek real: kontraktor menanam 1 kabel 4 core tanpa spare dan tanpa dokumentasi. 3 tahun kemudian butuh upgrade + 1 core putus = gelar ulang total (biaya 5x lipat + 2 minggu downtime parsial). Desain yang benar di awal = murah.',
      bestPractices: 'Selalu: single-mode untuk backbone baru, spare ≥ 50%, 2 path, baseline OTDR, core mapping (38.7).',
      security: 'Jalur fiber fisik = target sabotase/penyadapan; rute dan peta fiber adalah dokumen sensitif. Pertimbangkan diverse path juga untuk keamanan.',
      challenge: 'Buat fiber core mapping lengkap untuk 2 path backbone PT MajuNet (tabel 38.7). Simulasikan failover path di GNS3 dan catat convergence time.',
      interviewQ: 'Q: Mengapa backbone baru memakai single-mode, bukan multi-mode? — A: Single-mode mendukung jarak jauh (km) dan upgrade ke 40/100G di masa depan tanpa ganti kabel — future-proof untuk investasi 15–20 tahun.',
      quiz: [
        { q: 'Mengapa backbone memakai 2 path fisik berbeda?', options: ['Agar mahal', 'Path diversity: kerusakan fisik (galian) di satu rute tidak mematikan keduanya', 'Agar cepat 2x', 'Tidak perlu'], answer: 1, explain: 'Redundansi sejati butuh jalur fisik terpisah; dua kabel dalam satu galian = satu titik kegagalan.' },
        { q: 'Kapan baseline redaman (OTDR) diukur?', options: ['Saat rusak', 'Saat instalasi — sebagai pembanding untuk deteksi degradasi di masa depan', 'Tidak pernah', 'Setiap jam'], answer: 1, explain: 'Tanpa baseline, pengukuran kemudian tidak bermakna. Baseline = "sehat itu seperti apa".' },
        { q: 'Mengapa single-mode dipilih untuk backbone?', options: ['Lebih murah', 'Jarak jauh + siap upgrade ke kecepatan lebih tinggi tanpa ganti kabel (future-proof)', 'Lebih lentur', 'Tidak ada alasan'], answer: 1, explain: 'Investasi kabel 15–20 tahun; single-mode melindungi dari kebutuhan gelar ulang saat upgrade bandwidth.' },
      ],
    },
    {
      id: '39.16',
      title: 'Zabbix Implementation',
      body: `<p><b>Implementasi Zabbix</b> sesuai requirement 39.6: semua device & layanan PT MajuNet terpantau, alert < 5 menit. Alur data: device → (SNMP/agent/ICMP) → Zabbix server → database → trigger → alert.</p>
<h3>Configuration (Step-by-Step)</h3>
<pre>1. Install Zabbix server di VM 192.168.30.10 (VLAN 30 SERVER).
   ALASAN di VLAN server: terisolasi, hanya diakses dari MGMT/NOC.
2. Tambah host: tiap CHR, switch, FortiGate, server.
   - CHR: SNMP (aktifkan /snmp di RouterOS) + ICMP ping.
   - Server Linux: Zabbix agent.
   - FortiGate: SNMP.
3. Template: pakai template bawaan (MikroTik SNMP, Linux agent) lalu sesuaikan.
4. Item kunci per host: icmp ping, CPU, memory, disk, interface status & throughput.
5. Trigger (contoh):
   - {host:icmpping.count(3m)}=0  → "HOST DOWN" (KRITIS)
   - {host:system.cpu.util[,avg1].avg(5m)}>80  → "CPU tinggi" (WARNING)
   - {host:vfs.fs.size[/,pused].last()}>85  → "Disk penuh" (WARNING)
   ALASAN threshold: dari 39.6; sesuaikan setelah 2 minggu data.
6. Media & action: alert KRITIS → Telegram/email NOC; WARNING → tiket.
7. Dashboard: peta per site + daftar masalah aktif.</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> semua host hijau; trigger test (matikan 1 host → alert muncul < 5 menit). <b>Failure injection:</b> penuhi disk Zabbix server sendiri → history berhenti (monitoring buta!). <b>Troubleshooting:</b> housekeeping Zabbix (housekeeper settings), cek database. <b>Fix:</b> atur retensi & partisi; monitor Zabbix-nya sendiri (self-monitoring!). <b>Final:</b> semua item 39.6 terpenuhi; uji alert end-to-end.</p>
<div class="callout"><div class="t">Monitor the Monitor</div><p style="margin:4px 0 0">Zabbix yang mati diam-diam = seluruh monitoring mati. Wajib: self-monitoring (Zabbix memantau dirinya), dan heartbeat eksternal ("apakah Zabbix masih lapor?").</p></div>`,
      terms: [
        ['Template', 'Paket item+trigger+graph siap pakai per jenis device.'],
        ['Item', 'Satu metrik yang dipantau (mis. CPU).'],
        ['Trigger', 'Kondisi yang memicu alert.'],
        ['Self-monitoring', 'Sistem monitoring memantau dirinya sendiri.'],
      ],
      scenario: 'Jumat malam: disk Zabbix penuh, history berhenti, tidak ada alert (karena yang alert = Zabbix itu sendiri). Senin pagi: 2 insiden akhir pekan tidak tercatat. Solusi: housekeeping + self-monitoring + alert "Zabbix tidak lapor" dari sistem eksternal.',
      bestPractices: 'Mulai dari template bawaan, sesuaikan threshold dari data. Setiap trigger = ada aksi (runbook). Dokumentasikan tiap host & template (38.9).',
      security: 'Kredensial SNMP (community/string) bukan default! SNMP v3 dengan auth bila memungkinkan. Akses UI Zabbix: MFA + dari MGMT saja.',
      challenge: 'Deploy Zabbix di lab: monitor 1 CHR (SNMP+ping) + 1 VM Linux (agent). Buat 3 trigger dan uji semuanya dengan failure injection.',
      interviewQ: 'Q: Apa itu self-monitoring dan mengapa penting? — A: Monitoring memantau dirinya sendiri (service hidup? database penuh? masih mengirim data?). Tanpa itu, kegagalan sistem monitoring tidak terdeteksi — buta total tanpa sadar.',
      quiz: [
        { q: 'Urutkan alur data monitoring yang benar:', options: ['Dashboard → device → database', 'Device → collector (Zabbix server) → database → trigger/dashboard → NOC', 'NOC → device langsung', 'Database → device'], answer: 1, explain: 'Alur: ambil (collector) → simpan (DB) → nilai (trigger) → tampil (dashboard) → aksi (NOC). Diagnosis mengikuti alur ini.' },
        { q: 'Trigger "HOST DOWN" memakai icmpping.count(3m)=0. Mengapa 3 menit, bukan langsung?', options: ['Agar lambat', 'Menghindari false positive dari 1-2 ping loss sesaat; 3 menit = keyakinan memadai sesuai target deteksi < 5 menit', 'Acak', 'Wajib 3'], answer: 1, explain: 'Keseimbangan: terlalu cepat = alert palsu; terlalu lama = melanggar SLA deteksi. 3 menit dalam target < 5 menit.' },
        { q: 'Mengapa community string SNMP default harus diganti?', options: ['Agar keren', 'Community default (public/private) diketahui semua orang = akses baca (bahkan tulis) ke device oleh siapa pun', 'Tidak perlu', 'Agar cepat'], answer: 1, explain: 'SNMP dengan community default = pintu terbuka. Gunakan string kuat / SNMPv3 dengan autentikasi.' },
      ],
    },
    {
      id: '39.17',
      title: 'Grafana Implementation',
      body: `<p><b>Grafana</b> = wajah monitoring: dashboard visual yang membaca database Zabbix (dan sumber lain). Zabbix hebat mengumpulkan & alert; Grafana hebat <b>menampilkan</b> — tren, perbandingan, peta. Keduanya pasangan, bukan pesaing.</p>
<h3>Arsitektur Data</h3>
<pre>[Zabbix DB] ──(plugin/datasource)──▶ [Grafana 192.168.30.11]
      ▲                                        │
      │                                        ▼
[device…]                              [Dashboard NOC]
                                       ┌─────────────────────┐
                                       │ Status site (peta)  │
                                       │ Tren bandwidth/core │
                                       │ Top interface       │
                                       │ Kapasitas DHCP      │
                                       └─────────────────────┘
ALASAN Grafana di atas Zabbix: satu dashboard untuk banyak sumber
(Zabbix + database lain + API) — "satu kaca" NOC.</pre>
<h3>Configuration</h3>
<pre>1. Install Grafana di 192.168.30.11; tambah datasource Zabbix plugin.
   ALASAN plugin resmi: query teroptimasi, bukan scraping mentah.
2. Buat dashboard "NOC Overview":
   - Stat: host up/down (angka besar, warna merah bila > 0 down).
   - Time series: throughput uplink core (bit/s) 24 jam.
   - Tabel: top 10 interface by utilization.
   - Gauge: DHCP pool usage per VLAN.
3. Variabel dashboard: $site (pusat/gudang), $device — satu dashboard untuk semua.
   ALASAN variabel: tanpa ini, butuh 20 dashboard duplikat.
4. Alert Grafana untuk tren (mis. "diprediksi penuh 7 hari") — pelengkap trigger Zabbix.
5. Akses: dari VLAN 99/NOC; tampilkan di TV NOC (kiosk mode).</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> angka dashboard = angka Zabbix (cross-check 3 metrik). <b>Failure injection:</b> stop Zabbix → panel Grafana "no data" (bedakan: "no data" vs "0"! Keduanya tampil beda dan artinya beda). <b>Troubleshooting:</b> cek datasource connection; query inspector. <b>Fix & final:</b> dashboard akurat; dokumentasikan definisi tiap panel (apa artinya, threshold apa).</p>
<div class="callout blue"><div class="t">"No Data" vs "0"</div><p style="margin:4px 0 0">"0" = terukur nol (interface idle). "No data" = tidak ada pengukuran (collector mati / device down). Dashboard yang baik membedakan keduanya — salah baca = salah diagnosis.</p></div>`,
      terms: [
        ['Datasource', 'Koneksi Grafana ke sumber data (Zabbix, Prometheus, database).'],
        ['Dashboard variable', 'Filter dinamis ($site, $device) agar satu dashboard melayani banyak objek.'],
        ['Kiosk mode', 'Tampilan dashboard fullscreen untuk TV NOC.'],
      ],
      scenario: 'Direksi minta "laporan jaringan bulanan". Dulu: kumpulkan manual 3 hari. Kini: dashboard Grafana "Executive" (uptime %, insiden, tren kapasitas) → export PDF 5 menit. Monitoring yang baik melayani 2 audiens: NOC (teknis) dan manajemen (ringkas).',
      bestPractices: 'Satu dashboard per audiens (NOC teknis, exec ringkas). Beri judul & satuan yang jelas di tiap panel. Versioning dashboard (JSON di Git).',
      security: 'Grafana = jendela ke seluruh infrastruktur: auth kuat, batasi datasource permission per role (viewer vs admin).',
      challenge: 'Buat 1 dashboard dengan 4 panel dari data lab-mu (bisa dari Zabbix atau data dummy CSV): stat, time series, tabel, gauge.',
      interviewQ: 'Q: Apa perbedaan peran Zabbix dan Grafana? — A: Zabbix = pengumpul data + alerting (engine); Grafana = visualisasi (wajah). Zabbix menyimpan history; Grafana membaca dan menampilkannya indah lintas sumber. Keduanya komplementer.',
      quiz: [
        { q: 'Apa beda "no data" dan "0" di dashboard?', options: ['Sama saja', '"0" = terukur nol (idle normal); "no data" = tidak ada pengukuran (collector/device bermasalah) — diagnosisnya beda', 'No data lebih baik', 'Tidak penting'], answer: 1, explain: 'Salah baca = salah diagnosis: mengira "aman (0)" padahal "buta (no data)".' },
        { q: 'Apa fungsi dashboard variable ($site)?', options: ['Hiasan', 'Satu dashboard bisa difilter untuk banyak site/device — tanpa duplikasi dashboard', 'Mempercepat query', 'Tidak ada'], answer: 1, explain: 'DRY untuk dashboard: 1 definisi × N nilai variabel, bukan N dashboard copy-paste yang membusuk.' },
        { q: 'Mengapa dashboard untuk direksi berbeda dari untuk NOC?', options: ['Agar sibuk', 'Audiens beda butuh info beda: exec = ringkas (uptime, tren); NOC = teknis (per interface, per trigger)', 'Tidak perlu beda', 'Formalitas'], answer: 1, explain: 'Dashboard = komunikasi; metrik yang tepat untuk pengambil keputusan berbeda dari untuk troubleshooter.' },
      ],
    },
    {
      id: '39.18',
      title: 'Automation Implementation',
      body: `<p><b>Deploy toolkit Part 35 ke proyek final</b>: inventory & desired state PT MajuNet, jadwal systemd timer, dan bukti operasional. Ini adalah automation yang <b>melayani proyek nyata</b>, bukan latihan.</p>
<h3>Configuration</h3>
<pre># 1. inventory.yaml — semua device proyek (dari 39.8)
devices:
  - {name: CHR-CORE-01, host: 192.168.99.1, role: core}
  - {name: CHR-CORE-02, host: 192.168.99.2, role: core}
  - {name: FW-EDGE-01, host: 192.168.99.30, role: edge}

# 2. desired.yaml — dari 39.3 & 39.4 (IP plan + VLAN table)
# 3. Deploy di NOC-AUTO (192.168.99.100):
#    - clone toolkit Part 35, sesuaikan inventory/desired
#    - export MIKROTIK_PASS via systemd EnvironmentFile (bukan di script!)

# 4. Jadwal (systemd timer, pola 33.7):
#    backup   : harian 02:00   (read+write ke router: backup)
#    audit    : tiap jam       (read-only)
#    validate : harian 06:00   (read-only, report-only)
#    health   : tiap 15 menit  (read-only)
#    laporan  : harian 07:00   (rangkuman untuk NOC)
#    provision: ON-DEMAND saja (tidak dijadwalkan! — 39.7)</pre>
<h3>Verification → Failure Injection → Fix</h3>
<p><b>Verification:</b> tiap timer berjalan (systemctl list-timers); log tiap eksekusi ada; laporan harian terkirim. <b>Failure injection:</b> ubah 1 VLAN manual di CHR → validate pagi berikutnya melapor drift. <b>Troubleshooting:</b> timer gagal → journalctl; kredensial salah → auth log. <b>Fix:</b> perbaiki; pastikan alert sampai ke NOC. <b>Final:</b> 7 hari berjalan tanpa intervensi = bukti operasional (screenshot log sebagai portfolio!).</p>
<div class="callout"><div class="t">Bukti Operasional</div><p style="margin:4px 0 0">Portfolio kuat bukan "saya bisa coding" tapi "sistem ini berjalan 7 hari, menangkap 2 drift, backup 14 file". Kumpulkan bukti: log timer, laporan harian, screenshot alert drift yang terdeteksi.</p></div>`,
      terms: [
        ['EnvironmentFile', 'File systemd berisi environment variable (untuk secret, bukan di unit file).'],
        ['Bukti operasional', 'Log/laporan yang membuktikan automation bekerja di dunia nyata.'],
      ],
      scenario: 'Minggu pertama operasi: validate mendeteksi 2 drift (teknisi ubah manual saat emergency, lupa catat). Keduanya menjadi change log retroaktif + desired.yaml di-update (disengaja, approved). Sistem bekerja persis seperti dirancang: deteksi → manusia menilai → selaraskan.',
      bestPractices: 'Mulai dengan read-only dulu 1 minggu sebelum mengaktifkan write on-demand. Review log tiap pagi minggu pertama. Dokumentasikan tiap timer (apa, kapan, owner).',
      security: 'NOC-AUTO di VLAN 99, akses SSH key-only, tidak ada layanan publik. Audit: siapa login, apa dijalankan.',
      challenge: 'Deploy 1 timer (audit tiap jam) di lab-mu selama 3 hari. Kumpulkan log-nya sebagai bukti operasional pertamamu.',
      interviewQ: 'Q: Bagaimana membuktikan automation "bekerja" ke atasan, bukan sekadar "ada script"? — A: Dengan bukti operasional: log eksekusi terjadwal, laporan yang dihasilkan, insiden/drift yang tertangkap, dan metrik (waktu hemat, error turun).',
      quiz: [
        { q: 'Mengapa provision tidak dijadwalkan otomatis?', options: ['Agar hemat listrik', 'Write automation butuh konteks & approval manusia tiap eksekusi (39.7) — terjadwal = risiko menimpa perubahan sah', 'Karena lambat', 'Tidak ada alasan'], answer: 1, explain: 'Prinsip 39.7: read boleh terjadwal, write on-demand. Script buta konteks tidak boleh mengubah production sendiri.' },
        { q: 'Di mana secret (password) disimpan untuk timer systemd?', options: ['Di script', 'Di EnvironmentFile systemd (terpisah, permission ketat) — bukan di script/unit file', 'Di nama timer', 'Di log'], answer: 1, explain: 'Pisahkan secret dari code DAN dari definisi service; EnvironmentFile 600 hanya dibaca root.' },
        { q: 'Apa itu "bukti operasional" dan mengapa penting untuk portfolio?', options: ['Sertifikat', 'Log/laporan/metrik yang membuktikan sistem bekerja nyata (bukan sekadar code) — inilah yang meyakinkan perekrut', 'Foto', 'Tidak penting'], answer: 1, explain: 'Perekrut membedakan "pernah nulis script" vs "mengoperasikan automation": bukti = log 7 hari, drift tertangkap, laporan terkirim.' },
      ],
    },
    {
      id: '39.19',
      title: 'Security Implementation',
      body: `<p><b>Implementasi keamanan end-to-end</b> sesuai 39.5: hardening device, verifikasi matriks policy, dan audit. Keamanan = lapisan, bukan satu produk.</p>
<h3>Checklist Implementasi</h3>
<div class="tblwrap"><table>
<tr><th>Lapisan</th><th>Kontrol</th><th>Verifikasi</th></tr>
<tr><td>Device</td><td>Password kuat, SSH key-only, service tak perlu mati, user per-teknisi</td><td>Audit 35.11 + coba login password (harus gagal)</td></tr>
<tr><td>Segmentasi</td><td>VLAN + pruning sesuai 39.4</td><td>Test matriks 39.5 (tiap DENY dicoba dilanggar)</td></tr>
<tr><td>Perimeter</td><td>FortiGate policy + IPS + NAT (39.11)</td><td>Uji penetrasi dasar dari GUEST & internet</td></tr>
<tr><td>Monitoring</td><td>Alert login gagal, change detection (39.6)</td><td>Simulasikan brute force → alert muncul?</td></tr>
<tr><td>Operasional</td><td>Change log, backup terenkripsi (38.10–38.11)</td><td>Audit: tiap change ada jejaknya?</td></tr>
</table></div>
<h3>Uji Pelanggaran Matriks (Wajib!)</h3>
<p>Keamanan yang tidak diuji = asumsi. Untuk tiap sel DENY di matriks 39.5, <b>coba langgar</b>: dari GUEST ping server (harus gagal), dari OFFICE akses MGMT (harus gagal), dst. Catat hasil di test report (39.20). DENY yang "bisa ditembus" = temuan kritis.</p>
<div class="callout"><div class="t">Asumsi adalah Musuh Keamanan</div><p style="margin:4px 0 0">"Seharusnya di-deny" bukan bukti. Hanya test pelanggaran yang membuktikan. Jadwalkan re-test tiap ada perubahan firewall.</p></div>`,
      terms: [
        ['Hardening', 'Pengerasan: menutup yang tak perlu, menguatkan yang tersisa.'],
        ['Uji pelanggaran', 'Sengaja mencoba melanggar policy untuk membuktikan ia bekerja.'],
      ],
      scenario: 'Uji pelanggaran menemukan: dari VLAN 60 (gudang) bisa ping server — rule ALLOW terlalu longgar ("dari gudang ke server untuk aplikasi X" ternyata allow ALL). Perbaiki menjadi spesifik port. Tanpa uji, lubang ini hidup selamanya.',
      bestPractices: 'Test DENY tiap perubahan firewall. Prinsip least privilege di semua lapisan. Dokumentasikan tiap kontrol + hasil ujinya.',
      security: 'Keamanan berlapis (defense in depth): jebol satu lapis ≠ jebol semua. Review independen (orang berbeda dari yang config).',
      challenge: 'Lakukan 5 uji pelanggaran di lab-mu (pilih dari matriks 39.5). Dokumentasikan: harapan vs hasil.',
      interviewQ: 'Q: Apa itu defense in depth? — A: Keamanan berlapis (device, segmentasi, perimeter, monitoring, operasional) sehingga satu lapis jebol tidak berarti total kompromi. Tiap lapis diuji independen.',
      quiz: [
        { q: 'Mengapa tiap sel DENY di matriks harus diuji dengan cara dilanggar?', options: ['Iseng', 'Keamanan yang tidak diuji = asumsi; hanya test pelanggaran yang membuktikan DENY benar-benar bekerja', 'Agar sibuk', 'Tidak perlu'], answer: 1, explain: 'Banyak insiden berasal dari "kukira sudah di-deny". Test = bukti, bukan keyakinan.' },
        { q: 'Apa itu defense in depth?', options: ['Satu firewall mahal', 'Keamanan berlapis sehingga jebolnya satu lapis tidak berarti total kompromi', 'Banyak password', 'Tidak ada artinya'], answer: 1, explain: 'Lapisan: device, segmentasi, perimeter, monitoring, operasional — penyerang harus menembus semuanya.' },
        { q: 'Siapa sebaiknya me-review konfigurasi keamanan?', options: ['Yang membuat (dia paling paham)', 'Orang berbeda (review independen) — pembuat buta terhadap kesalahannya sendiri', 'Tidak perlu review', 'Vendor saja'], answer: 1, explain: 'Four-eyes principle: reviewer independen menangkap asumsi dan typo yang tak terlihat pembuatnya.' },
      ],
    },
    {
      id: '39.20',
      title: 'Testing',
      body: `<p><b>Testing menyeluruh</b>: membuktikan setiap requirement (39.1) terpenuhi. Setiap test = <b>requirement → cara uji → hasil yang diharapkan → hasil aktual → lulus/gagal</b>. Tanpa test report, "selesai" hanya opini.</p>
<h3>Test Plan (Contoh)</h3>
<div class="tblwrap"><table>
<tr><th>ID</th><th>Requirement</th><th>Cara Uji</th><th>Harapan</th></tr>
<tr><td>T-01</td><td>User office akses server</td><td>Ping + curl dari VLAN 20 ke 192.168.30.10</td><td>OK</td></tr>
<tr><td>T-02</td><td>Guest terisolasi</td><td>Dari VLAN 40: ping .20.1, .30.10, .99.1</td><td>Semua GAGAL; ping 8.8.8.8 OK</td></tr>
<tr><td>T-03</td><td>CCTV ke NVR</td><td>Dari VLAN 10 ke 192.168.10.50</td><td>OK; ke office GAGAL</td></tr>
<tr><td>T-04</td><td>Failover &lt; 1 menit</td><td>Matikan CHR-CORE-01, ping gateway kontinyu</td><td>Putus &lt; 60 detik</td></tr>
<tr><td>T-05</td><td>Deteksi &lt; 5 menit</td><td>Matikan 1 switch, ukur waktu alert Zabbix</td><td>Alert &lt; 5 menit</td></tr>
<tr><td>T-06</td><td>Backup harian</td><td>Cek file backup 7 hari terakhir</td><td>Ada & valid</td></tr>
<tr><td>T-07</td><td>Provisioning idempotent</td><td>Run provision 2x</td><td>Run ke-2 no-op</td></tr>
</table></div>
<h3>Aturan Testing</h3>
<ul>
<li><b>Uji yang negatif juga:</b> "seharusnya GAGAL" sama pentingnya dengan "seharusnya OK" (T-02!).</li>
<li><b>Dokumentasikan hasil aktual</b> (screenshot/log), bukan hanya "lulus".</li>
<li><b>Gagal = temuan:</b> buat tiket, perbaiki, uji ulang. Test report tanpa temuan = mencurigakan.</li>
<li><b>Regression:</b> setelah perbaikan, uji ulang test terkait (jangan sampai fix merusak yang lain).</li>
</ul>`,
      terms: [
        ['Test plan', 'Daftar test: requirement, cara uji, harapan, hasil.'],
        ['Negative test', 'Uji bahwa yang seharusnya GAGAL memang gagal (mis. isolasi).'],
        ['Regression test', 'Uji ulang area terkait setelah perbaikan.'],
      ],
      scenario: 'Test T-02 menemukan: dari GUEST bisa ping gateway MGMT (.99.1)! Investigasi: rule FortiGate kurang satu. Tanpa negative test, lubang ini lolos ke production. Test report dengan 2 temuan kritis = proyek tertunda 1 minggu TAPI aman.',
      bestPractices: 'Tulis test plan SEBELUM implementasi selesai (dari requirement). Libatkan "user" untuk user-acceptance test. Simpan bukti tiap test.',
      security: 'Negative test keamanan = uji pelanggaran (39.19). Test report keamanan = dokumen sensitif.',
      challenge: 'Buat test plan 10 test untuk lab-mu (campur positif & negatif). Eksekusi dan catat hasilnya dalam tabel.',
      interviewQ: 'Q: Mengapa negative test penting dalam proyek jaringan? — A: Karena keamanan & isolasi didefinisikan oleh "yang dilarang". Tanpa menguji yang dilarang, kita tidak tahu apakah larangan bekerja — hanya berasumsi.',
      quiz: [
        { q: 'Apa komponen wajib tiap test case?', options: ['Hanya judul', 'Requirement, cara uji, hasil yang diharapkan, hasil aktual, status lulus/gagal', 'Hanya hasil', 'Tanggal saja'], answer: 1, explain: 'Test tanpa harapan = tidak bisa dinilai; tanpa hasil aktual = tidak bisa dibuktikan. Lengkap = akuntabel.' },
        { q: 'Test gagal sebaiknya diperlakukan sebagai...', options: ['Kegagalan pribadi', 'Temuan: buat tiket, perbaiki, uji ulang — test report tanpa temuan justru mencurigakan', 'Disembunyikan', 'Diabaikan'], answer: 1, explain: 'Tujuan testing = menemukan masalah sebelum production. Temuan = testing bekerja, bukan orang gagal.' },
        { q: 'Apa itu regression test?', options: ['Test yang mundur', 'Uji ulang area terkait setelah perbaikan — memastikan fix tidak merusak yang lain', 'Test lama', 'Tidak penting'], answer: 1, explain: 'Perbaikan di satu tempat bisa merusak di tempat lain; regression test menangkapnya sebelum production.' },
      ],
    },
    {
      id: '39.21',
      title: 'Failure Testing',
      body: `<p><b>Failure testing</b> = <b>sengaja merusak</b> lab untuk membuktikan ketahanan desain. Bedanya dengan 39.20: testing biasa membuktikan "yang normal bekerja"; failure testing membuktikan <b>"yang rusak bisa pulih"</b>. Ini adalah bagian paling seru — dan paling mendidik — proyek ini.</p>
<h3>Skenario Failure (Wajib Dicoba!)</h3>
<div class="tblwrap"><table>
<tr><th>ID</th><th>Kegagalan</th><th>Harapan</th><th>Cara Ukur</th></tr>
<tr><td>F-01</td><td>Matikan CHR-CORE-01</td><td>VRRP failover &lt; 1 menit</td><td>Ping gateway kontinyu, hitung loss</td></tr>
<tr><td>F-02</td><td>Putus uplink Path A</td><td>Trafik pindah Path B</td><td>Traceroute + ping; catat convergence</td></tr>
<tr><td>F-03</td><td>Loop di port access</td><td>BPDU guard shutdown port</td><td>Log switch; jaringan tetap hidup</td></tr>
<tr><td>F-04</td><td>Penuhi disk CHR (backup menumpuk)</td><td>Alert disk; backup baru tetap jalan/housekeeping</td><td>Script 35.7 + Zabbix</td></tr>
<tr><td>F-05</td><td>Matikan Zabbix server</td><td>Grafana "no data" (bukan angka ngawur); heartbeat alert</td><td>Dashboard + alert eksternal</td></tr>
<tr><td>F-06</td><td>Hapus VLAN 40 manual</td><td>Validator drift melapor &lt; 24 jam</td><td>Laporan validate.py</td></tr>
<tr><td>F-07</td><td>Brute force SSH ke CHR</td><td>Alert login gagal; key-only tetap aman</td><td>Log + alert</td></tr>
</table></div>
<h3>Protokol Aman Merusak Lab</h3>
<ul>
<li><b>Snapshot dulu</b> (39.9) — selalu ada jalan pulang.</li>
<li><b>Satu failure per sesi:</b> jangan campur; tiap failure = satu laporan.</li>
<li><b>Catat:</b> waktu mulai, gejala, waktu deteksi (monitoring), waktu pulih, pelajaran.</li>
<li><b>Di production ini = chaos engineering terjadwal</b> dengan approval — di lab, lakukan bebas tapi terdokumentasi.</li>
</ul>
<div class="callout"><div class="t">Tujuan: Percaya Diri, Bukan Sekadar Lulus</div><p style="margin:4px 0 0">Engineer yang pernah mematikan core-nya sendiri dan melihat failover bekerja TIDAK PANIK saat kejadian nyata. Failure testing melatih otot yang tidak bisa dilatih dengan membaca.</p></div>`,
      terms: [
        ['Failure testing', 'Uji ketahanan dengan sengaja menyebabkan kegagalan.'],
        ['Convergence time', 'Waktu yang dibutuhkan jaringan pulih ke keadaan stabil setelah failure.'],
        ['Chaos engineering', 'Disiplin uji ketahanan terjadwal di production (dengan kontrol).'],
      ],
      scenario: 'F-01 pertama: failover VRRP ternyata 4 menit (bukan < 1 menit)! Investigasi: timer VRRP default terlalu lambat + switch butuh waktu MAC re-learn. Tuning: turunkan interval + gratuitous ARP agresif → 35 detik. Tanpa failure testing, angka "4 menit" baru ketahuan saat bencana nyata.',
      bestPractices: 'Jadwalkan failure test berkala (kuartalan) — ketahanan membusuk tanpa latihan. Tiap failure = laporan tertulis. Rayakan temuan (bukan disembunyikan).',
      security: 'Failure test keamanan (F-07) hanya di lab / dengan otorisasi tertulis. Jangan brute-force sistem orang lain — itu serangan, bukan testing.',
      challenge: 'Eksekusi F-01, F-03, dan F-06 di lab-mu. Buat laporan 1 halaman per failure: harapan vs aktual vs pelajaran.',
      interviewQ: 'Q: Apa beda testing biasa dan failure testing? — A: Testing biasa membuktikan skenario normal bekerja (requirement terpenuhi); failure testing membuktikan sistem pulih dari kegagalan (ketahanan). Keduanya wajib — yang kedua sering dilupakan.',
      quiz: [
        { q: 'Apa tujuan utama failure testing?', options: ['Merusak untuk senang-senang', 'Membuktikan sistem pulih dari kegagalan + melatih respons — ketahanan yang tidak diuji = asumsi', 'Mencari kambing hitam', 'Tidak ada'], answer: 1, explain: 'Failover "seharusnya < 1 menit" baru jadi fakta setelah diuji. Failure testing mengubah asumsi menjadi bukti.' },
        { q: 'Mengapa satu failure per sesi?', options: ['Agar lama', 'Agar sebab-akibat jelas: tiap failure = satu laporan yang bisa dianalisis tanpa campur aduk', 'Aturan main', 'Tidak penting'], answer: 1, explain: 'Dua failure bersamaan = tidak tahu mana menyebabkan apa. Isolasi variabel = diagnosis bersih.' },
        { q: 'Apa yang wajib dilakukan SEBELUM failure test?', options: ['Berdoa', 'Snapshot lab — selalu ada jalan pulang bila failure merusak lebih dari rencana', 'Matikan monitoring', 'Tidak ada'], answer: 1, explain: 'Failure testing sengaja merusak; snapshot memastikan eksperimen tidak menghancurkan progres berminggu-minggu.' },
      ],
    },
    {
      id: '39.22',
      title: 'Troubleshooting',
      body: `<p><b>Metodologi troubleshooting proyek</b>: saat sesuatu gagal di lab final (dan PASTI ada yang gagal), ini cara sistematis menaklukkannya — kompilasi seluruh skill troubleshooting kurikulum.</p>
<h3>Metodologi 7 Langkah</h3>
<pre>1. DEFINISIKAN: apa tepatnya yang gagal? ("VLAN 20 tidak bisa ke server"
   lebih baik dari "jaringan rusak"). Tulis gejalanya.
2. KUMPULKAN FAKTA: apa yang BERHASIL? (ping gateway OK? VLAN lain OK?)
   Fakta mempersempit; asumsi menyesatkan.
3. ISOLASI LAPISAN: ikuti OSI dari bawah —
   fisik (link?) → L2 (VLAN/STP?) → L3 (IP/route?) → L4 (firewall/port?) → layanan.
4. HIPOTESIS: satu dugaan paling mungkin ("route ke .30 hilang").
5. UJI: satu test untuk hipotesis itu (/ip route print).
6. PERBAIKI & VERIFIKASI: fix, lalu uji ulang + regression test area terkait.
7. DOKUMENTASIKAN: tulis troubleshooting log (38.12) — tim berikutnya berterima kasih.</pre>
<h3>Toolkit Diagnosis Cepat</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Command/Tool</th><th>Mencari Apa</th></tr>
<tr><td>Tidak bisa ping gateway</td><td>ip link, ip addr (33.10)</td><td>Interface UP? IP benar?</td></tr>
<tr><td>Gateway OK, tujuan tidak</td><td>traceroute, /ip route print</td><td>Berhenti di hop mana? route active?</td></tr>
<tr><td>Intermiten</td><td>ping -c 100, tcpdump</td><td>Loss pattern? duplikat IP? loop?</td></tr>
<tr><td>Lambat</td><td>ping (mdev), ss, /interface monitor</td><td>Jitter? congesti? error counter?</td></tr>
<tr><td>"Tiba-tiba" mati</td><td>change log (38.11) + log</td><td>Apa yang berubah terakhir?</td></tr>
</table></div>
<h3>Aturan Emas</h3>
<p><b>"Apa yang berubah terakhir?"</b> — 80% insiden berkorelasi dengan change terakhir (itulah gunanya change log). Dan: <b>ubah satu hal dalam satu waktu</b> saat troubleshooting; kalau tidak, kamu tidak tahu mana yang memperbaiki.</p>`,
      terms: [
        ['Metodologi troubleshooting', 'Langkah sistematis: definisi → fakta → isolasi → hipotesis → uji → fix → dokumentasi.'],
        ['Isolasi lapisan', 'Mempersempit masalah mengikuti layer OSI dari bawah.'],
      ],
      scenario: 'Kasus nyata lab: setelah tambah VLAN 60, user office komplain lambat. Fakta: hanya jam 09:00–10:00. Isolasi: bukan routing (ping OK), tapi throughput drop. Hipotesis: broadcast dari scanner gudang. tcpdump: membanjiri multicast! Solusi: storm control + isolasi multicast. Tanpa metodologi: 3 hari tebak-tebakan.',
      bestPractices: 'Tulis gejala sebelum menyentuh apa pun. Satu perubahan per waktu. Dokumentasikan tiap insiden (38.12) — troubleshooting log adalah kompas tim.',
      security: 'Troubleshooting darurat sering "membuka" sesuatu (disable firewall sementara) — catat dan KEMBALIKAN setelahnya. Jalan pintas yang lupa ditutup = lubang permanen.',
      challenge: 'Ambil 1 masalah lab-mu minggu ini, selesaikan dengan 7 langkah di atas, dan tulis troubleshooting log-nya. Bandingkan dengan caramu yang lama.',
      interviewQ: 'Q: Jelaskan metodologi troubleshooting-mu saat menghadapi insiden. — A: Definisikan gejala presisi → kumpulkan fakta (apa yang masih berhasil) → isolasi per layer OSI dari bawah → hipotesis tunggal → uji → perbaiki + verifikasi + regression → dokumentasikan di troubleshooting log.',
      quiz: [
        { q: 'Pertanyaan pertama saat insiden menurut metodologi?', options: ['Siapa yang salah?', 'Apa tepatnya yang gagal (definisi gejala presisi) + apa yang BERHASIL (fakta penyempit)?', 'Langsung reboot', 'Tunggu'], answer: 1, explain: 'Definisi presisi + fakta "yang masih berhasil" mempersempit ruang pencarian lebih dari apapun.' },
        { q: 'Mengapa "apa yang berubah terakhir?" pertanyaan emas?', options: ['Kepo', '80% insiden berkorelasi dengan change terakhir — change log langsung menunjuk tersangka utama', 'Formalitas', 'Tidak penting'], answer: 1, explain: 'Jaringan yang kemarin baik-baik saja jarang rusak sendiri; change log (38.11) adalah daftar tersangka.' },
        { q: 'Mengapa hanya boleh ubah satu hal dalam satu waktu saat troubleshooting?', options: ['Agar lama', 'Agar tahu persis mana yang memperbaiki — kalau tidak, diagnosis tidak valid dan masalah bisa "sembuh misterius" lalu kambuh', 'Aturan main', 'Tidak penting'], answer: 1, explain: 'Multi-perubahan = tidak tahu penyebab sebenarnya = fix yang tidak dipahami = insiden berulang.' },
      ],
    },
    {
      id: '39.23',
      title: 'Optimization',
      body: `<p><b>Optimization</b>: setelah semua bekerja (39.20–39.22), buat lebih baik — lebih cepat, lebih hemat resource, lebih mudah dirawat. Optimasi dilakukan <b>setelah</b> benar, tidak sebelumnya (premature optimization = menambah bug).</p>
<h3>Area Optimasi Proyek</h3>
<div class="tblwrap"><table>
<tr><th>Area</th><th>Sebelum</th><th>Sesudah (Optimasi)</th><th>Ukur Dengan</th></tr>
<tr><td>Convergence VRRP</td><td>4 menit (default)</td><td>35 detik (tuning timer)</td><td>F-01 (39.21)</td></tr>
<tr><td>Polling Zabbix</td><td>Tiap 30 detik semua</td><td>Kritis 1 mnt, biasa 5 mnt</td><td>Beban server Zabbix</td></tr>
<tr><td>DHCP lease guest</td><td>8 jam</td><td>1 jam (pool cepat kembali)</td><td>Pool usage Grafana</td></tr>
<tr><td>Backup</td><td>Full tiap hari</td><td>Full harian + export Git (diff kecil)</td><td>Ukuran & waktu</td></tr>
<tr><td>Log firewall</td><td>Log semua (penuh!)</td><td>Log DENY + sampling ALLOW</td><td>Disk log</td></tr>
<tr><td>Script audit</td><td>Sekuenial 5 menit</td><td>Paralel 1 menit (35.10)</td><td>Waktu eksekusi</td></tr>
</table></div>
<h3>Prinsip Optimasi</h3>
<ul>
<li><b>Ukur dulu:</b> tanpa baseline, "lebih baik" tidak bisa dibuktikan. Catat sebelum–sesudah.</li>
<li><b>Satu per satu:</b> seperti troubleshooting — ubah satu, ukur, baru lanjut.</li>
<li><b>Trade-off sadar:</b> polling cepat = beban tinggi; log lengkap = disk penuh. Tiap optimasi punya harga — pilih dengan data.</li>
<li><b>Jangan optimalkan yang tidak bermasalah:</b> fokus ke bottleneck terukur (top talker, resource tertinggi).</li>
</ul>
<div class="callout blue"><div class="t">Optimasi Terakhir: Dokumentasi</div><p style="margin:4px 0 0">Optimasi terbaik sering bukan teknis: runbook yang jelas, dashboard yang terbaca, alert yang tepat. "Mudah dirawat" adalah bentuk optimasi yang paling awet.</p></div>`,
      terms: [
        ['Baseline', 'Pengukuran awal sebagai pembanding hasil optimasi.'],
        ['Bottleneck', 'Titik tersempit yang membatasi performa keseluruhan.'],
        ['Trade-off', 'Pertukaran: memperbaiki satu aspek mengorbankan aspek lain.'],
      ],
      scenario: 'Polling Zabbix tiap 30 detik untuk 500 item membuat server CPU 90%. Analisis: 80% item tidak butuh secepat itu. Optimasi interval berdasar kritikalitas → CPU 35%, alert tetap < 5 menit untuk yang kritis. Optimasi = alokasi cerdas, bukan sekadar "lebih cepat".',
      bestPractices: 'Optimasi = ukur → hipotesis → ubah satu → ukur lagi → dokumentasikan. Simpan baseline tiap area penting.',
      security: 'Optimasi tidak boleh mengorbankan keamanan: "matikan log agar hemat disk" = buta. Cari trade-off yang aman (sampling, agregasi).',
      challenge: 'Pilih 1 area lab-mu, ukur baseline-nya, optimalkan, ukur lagi. Tulis laporan sebelum–sesudah 1 halaman.',
      interviewQ: 'Q: Kapan optimasi dilakukan dan mengapa tidak di awal? — A: Setelah sistem benar dan stabil. Optimasi prematur menambah kompleksitas & bug pada fondasi yang belum terbukti; ukur dulu bottleneck nyata, bukan dugaan.',
      quiz: [
        { q: 'Prinsip pertama optimasi?', options: ['Langsung ubah yang terlihat lambat', 'Ukur baseline dulu — tanpa angka awal, perbaikan tidak bisa dibuktikan', 'Beli perangkat baru', 'Tebak saja'], answer: 1, explain: 'Optimasi tanpa baseline = tidak tahu apakah membaik, dan tidak bisa menjelaskan trade-off ke stakeholder.' },
        { q: 'Mengapa polling Zabbix dibedakan intervalnya (kritis vs biasa)?', options: ['Agar rumit', 'Trade-off sadar: yang kritis butuh deteksi cepat (harga: beban), yang biasa cukup lambat (hemat resource)', 'Acak', 'Wajib'], answer: 1, explain: 'Tidak semua metrik sama pentingnya; alokasi interval berdasar kritikalitas = resource dipakai di tempat yang paling berarti.' },
        { q: 'Apa yang dimaksud "jangan optimalkan yang tidak bermasalah"?', options: ['Malas', 'Fokus ke bottleneck terukur; mengutak-atik yang sehat menambah risiko tanpa manfaat', 'Hemat waktu saja', 'Tidak penting'], answer: 1, explain: 'Setiap perubahan punya risiko; tanpa masalah terukur, risiko > manfaat. Temukan bottleneck dengan data.' },
      ],
    },
    {
      id: '39.24',
      title: 'Documentation',
      body: `<p><b>Dokumentasi final proyek</b>: merangkum SEMUA dokumen Part 38 untuk PT MajuNet menjadi satu paket yang konsisten, berversion, dan siap diserahkan (atau dipublikasikan sebagai portfolio).</p>
<h3>Paket Dokumentasi Proyek</h3>
<div class="tblwrap"><table>
<tr><th>Dokumen</th><th>Isi Proyek</th><th>Sumber</th></tr>
<tr><td>Physical diagram</td><td>Topologi 39.8 + rack layout</td><td>38.1, 38.3</td></tr>
<tr><td>Logical diagram</td><td>6 VLAN + routing + zone policy</td><td>38.2, 39.4, 39.5</td></tr>
<tr><td>IP & VLAN table</td><td>Master plan 39.3–39.4</td><td>38.4, 38.5</td></tr>
<tr><td>Port mapping</td><td>Tiap switch proyek</td><td>38.6</td></tr>
<tr><td>Fiber & cable schedule</td><td>Backbone 39.15</td><td>38.7, 38.8</td></tr>
<tr><td>Inventory</td><td>Semua device + firmware</td><td>38.9</td></tr>
<tr><td>Backup log</td><td>Jadwal + hasil uji restore</td><td>38.10</td></tr>
<tr><td>Change log</td><td>Semua change proyek</td><td>38.11</td></tr>
<tr><td>Test report</td><td>Hasil 39.20 + failure test 39.21</td><td>38.12</td></tr>
<tr><td>Runbook NOC</td><td>"Bila alert X, lakukan Y" per trigger</td><td>39.6, 39.16</td></tr>
<tr><td>README proyek</td><td>Ringkas: apa, mengapa, cara pakai</td><td>Semua</td></tr>
</table></div>
<h3>Standar Kualitas Dokumentasi</h3>
<ul>
<li><b>Konsisten:</b> hostname/IP di semua dokumen SAMA (satu sumber kebenaran).</li>
<li><b>Berversion:</b> di Git; tiap change = commit + update dokumen terkait.</li>
<li><b>Dapat ditemukan:</b> index/README yang menunjuk ke tiap dokumen.</li>
<li><b>Akurat:</b> audit silang — diagram vs config nyata vs tabel (tidak boleh ada yang beda).</li>
<li><b>Bermanfaat:</b> teknisi baru bisa memahami jaringan hanya dari dokumen ini (uji sebenarnya!).</li>
</ul>
<div class="callout blue"><div class="t">Dokumentasi = Produk</div><p style="margin:4px 0 0">Di proyek enterprise, dokumentasi BUKAN pelengkap — ia adalah deliverable setara perangkat yang menyala. Proyek tanpa dokumentasi = proyek yang belum selesai. Dan untuk portfolio-mu: dokumentasi yang rapi adalah pembeda utama dari sekadar "bisa config".</p></div>`,
      terms: [
        ['Paket dokumentasi', 'Kumpulan dokumen proyek yang konsisten & berversion.'],
        ['Runbook', 'Panduan respons per alert/insiden untuk NOC.'],
      ],
      diagram: `<pre>        DOKUMENTASI SEBAGAI SISTEM (bukan tumpukan file)

  [Source of truth: desired.yaml + IP/VLAN table (Git)]
        │         │              │
        ▼         ▼              ▼
  [Diagram]  [Automation]  [Monitoring]
  (38.1-3)   (35.x)        (39.16-17)
        │         │              │
        └─────────┴──────────────┘
                  ▼
         KONSISTEN: satu perubahan →
         update ketiganya + commit.

  Uji kualitas: "bisakah teknisi baru memahami
  jaringan HANYA dari dokumen ini?"</pre>`,
      scenario: 'Serah terima proyek ke tim operasional: 40 halaman dokumentasi + repo Git. 6 bulan kemudian insiden besar — tim baru menyelesaikan dari runbook tanpa menelepon pembuatnya (yang sudah resign). Itulah dokumentasi yang bekerja: pengetahuan tidak ikut pergi bersama orangnya.',
      bestPractices: 'Dokumentasikan SEIRING build (bukan di akhir — di akhir sudah lupa). Review dokumentasi seperti review code. Uji "teknisi baru" bila memungkinkan.',
      security: 'Paket dokumen = peta lengkap; akses terbatas, jangan publikasi yang sensitif (serial, password, peta fiber detail) ke repo publik — sanitasi untuk portfolio!',
      challenge: 'Buat paket dokumentasi mini untuk lab-mu: 1 diagram + 1 tabel IP + 1 runbook (1 alert). Minta teman membacanya: apakah ia paham tanpa penjelasanmu?',
      interviewQ: 'Q: Bagaimana menilai kualitas dokumentasi jaringan? — A: Lima kriteria: konsisten (sama di semua dokumen), berversion (Git), dapat ditemukan (index), akurat (cocok dengan config nyata), bermanfaat (teknisi baru paham tanpa bantuan).',
      quiz: [
        { q: 'Kapan dokumentasi proyek sebaiknya ditulis?', options: ['Di akhir proyek', 'Seiring build — di akhir sudah banyak yang lupa; dokumentasi = bagian dari tiap tahap', 'Tidak perlu', 'Setahun kemudian'], answer: 1, explain: 'Dokumentasi akhir proyek = rekonstruksi dari ingatan (tidak akurat). Seiring build = akurat dan menjadi kebiasaan.' },
        { q: 'Apa uji sebenarnya kualitas dokumentasi?', options: ['Tebal halamannya', 'Teknisi baru bisa memahami dan mengoperasikan jaringan HANYA dari dokumen itu', 'Banyak gambar', 'Bahasa Inggris'], answer: 1, explain: 'Dokumentasi untuk transfer pengetahuan; bila butuh penjelasan lisan terus, dokumennya gagal.' },
        { q: 'Apa yang harus disanitasi sebelum dokumentasi dipublikasikan sebagai portfolio?', options: ['Tidak ada', 'Data sensitif: password, serial number, peta fiber detail, IP publik — publikasi hanya yang aman', 'Semua gambar', 'Nama perusahaan saja'], answer: 1, explain: 'Portfolio publik ≠ dokumen internal. Sanitasi menjaga keamanan sambil tetap menunjukkan skill.' },
      ],
    },
  ],
  project: {
    title: 'Project: Final Enterprise Lab (Portfolio Utama)',
    html: `<p><b>Misi puncak kurikulum:</b> rancang, bangun, uji, dan dokumentasikan <b>enterprise network lengkap PT MajuNet</b> (skenario 39.1) di GNS3 — lalu publikasikan sebagai <b>portfolio utama</b> di GitHub. Ini adalah bukti kamu lulusan kurikulum 39 part.</p>
<h3>Struktur Repo: final-enterprise-lab</h3>
<pre>final-enterprise-lab/
├── README.md                    # ringkasan proyek + arsitektur + cara replikasi
├── docs/
│   ├── 01-requirement.md        # 39.1–39.7 (SMART requirements)
│   ├── 02-topology.md           # diagram fisik + logis (39.8)
│   ├── 03-ip-vlan-plan.md       # master IP & VLAN table (39.3–39.4)
│   ├── 04-security-matrix.md    # matriks zone policy (39.5)
│   ├── 05-fiber-backbone.md     # desain + core mapping (39.15)
│   ├── 06-test-report.md        # hasil 39.20 (tiap test + bukti)
│   ├── 07-failure-report.md     # hasil 39.21 (tiap failure + pelajaran)
│   └── 08-runbook.md            # runbook NOC per alert
├── gns3/
│   └── final-enterprise-lab.gns3 # file proyek GNS3 + README resource
├── configs/
│   ├── CHR-CORE-01.rsc          # export (SANITASI: tanpa password!)
│   ├── CHR-CORE-02.rsc
│   └── fortigate-policy.conf    # (sanitasi)
├── automation/                  # toolkit Part 35 versi proyek
│   ├── inventory.yaml
│   ├── desired.yaml
│   └── *.py
├── monitoring/
│   ├── zabbix-templates.md      # item/trigger yang dipakai
│   └── grafana-dashboard.json   # export dashboard
└── evidence/
    ├── screenshots/             # bukti tiap tahap (topologi, VLAN, dashboard, alert)
    └── logs/                    # log timer 7 hari, laporan drift</pre>
<h3>Tahapan Pengerjaan (8–12 minggu, santai)</h3>
<ol>
<li><b>Minggu 1–2:</b> requirement + desain (39.1–39.8). Tulis docs/01–02. Review sendiri.</li>
<li><b>Minggu 3–4:</b> GNS3 + CHR + VLAN + routing (39.9–39.10, 39.12–39.14). Snapshot tiap tahap.</li>
<li><b>Minggu 5:</b> FortiGate + switching hardening + security (39.11, 39.19).</li>
<li><b>Minggu 6:</b> fiber design (39.15, dokumen) + Zabbix + Grafana (39.16–39.17).</li>
<li><b>Minggu 7:</b> automation deploy + 7 hari bukti operasional (39.18).</li>
<li><b>Minggu 8:</b> testing + failure testing + troubleshooting (39.20–39.22). Tulis report.</li>
<li><b>Minggu 9:</b> optimasi (39.23) + dokumentasi final (39.24) + sanitasi.</li>
<li><b>Minggu 10+:</b> publikasi GitHub + tulis artikel ringkas (LinkedIn/blog).</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio Utama)</h3>
<ol>
<li><b>Sanitasi dulu:</b> grep seluruh repo untuk password/secret/IP publik; hapus atau samarkan. Config .rsc tanpa password. Ini WAJIB sebelum publik.</li>
<li>Repo publik: <code>final-enterprise-lab</code> dengan deskripsi: "Enterprise network lab: dual-core VRRP, 6 VLAN, FortiGate segmentation, Zabbix+Grafana, Python automation — designed, built, tested, documented."</li>
<li>README = "landing page": masalah → arsitektur (diagram!) → teknologi → hasil terukur (failover 35 detik, deteksi &lt; 5 menit, 7 hari bukti operasional) → cara replikasi.</li>
<li>Sertakan evidence/: screenshot dashboard, alert drift tertangkap, laporan failure test — bukti mengalahkan klaim.</li>
<li>Pin repo ini di profil GitHub (pin 1). Tautkan di CV/LinkedIn dengan 2–3 kalimat hasil.</li>
<li>Commit history yang rapi (per tahap) menunjukkan proses berpikir — jangan squash jadi 1 commit.</li>
</ol>
<h3>Kriteria Selesai (Definisi "Lulus")</h3>
<ul>
<li>Semua requirement 39.1 terpenuhi dan terbukti di test report (39.20) — termasuk negative test.</li>
<li>Minimal 5 failure test (39.21) dieksekusi dengan laporan.</li>
<li>Automation berjalan 7 hari dengan bukti log; 1 drift berhasil terdeteksi.</li>
<li>Paket dokumentasi lengkap (39.24) dan konsisten; sudah disanitasi.</li>
<li>Repo GitHub publik, README memukau, dan kamu bisa menjelaskan TIAP keputusan desain saat interview.</li>
</ul>
<p><b>Standar kelulusan:</b> bila pewawancara bertanya "mengapa desainnya begini?" untuk tiap keputusan dan kamu bisa menjawab dengan alasan + bukti — kamu lulus. Selamat, Network Engineer.</p>`,
  },
};
