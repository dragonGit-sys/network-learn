// PART 38 — Network Documentation (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part38: Part = {
  id: '38',
  number: 'PART 38',
  title: 'Network Documentation',
  phaseId: 'fase-7',
  description: 'Dokumentasi jaringan yang benar: diagram fisik/logis/rack, tabel IP & VLAN, port mapping, inventory, backup, dan change log.',
  repoFolder: 'part-38-network-documentation',
  objectives: [
    'Menjelaskan mengapa dokumentasi adalah bagian tak terpisahkan dari network engineering (bukan "tugas tambahan").',
    'Membuat diagram fisik, logis, dan rack yang akurat dan mudah dibaca.',
    'Menyusun tabel IP address, VLAN, port mapping, fiber core mapping, dan cable schedule memakai skema kurikulum.',
    'Mengelola device inventory, configuration backup, change log, dan troubleshooting log yang audit-ready.',
  ],
  prerequisites: 'Part 01–35 (terutama skema VLAN 10/20/30/40/99 dan subnet 192.168.x.0/24 yang dipakai di semua template part ini). Part 32 (source of truth & Git) sangat membantu.',
  subbabs: [
    {
      id: '38.1',
      title: 'Physical Diagram',
      body: `<p><b>Physical diagram</b> menggambarkan <b>wujud fisik</b> jaringan: perangkat apa, di mana lokasinya, terhubung via kabel/port apa. Ini peta untuk teknisi lapangan ("kabel mana yang dicabut?") dan dasar semua diagram lain.</p>
<h3>Yang Wajib Ada</h3>
<ul>
<li><b>Perangkat:</b> hostname, model, lokasi (gedung/lantai/rack).</li>
<li><b>Koneksi:</b> dari port apa ke port apa (mis. <code>CHR-CORE-01:ether2 → SW-DIST-01:Gi0/1</code>), tipe media (UTP Cat6 / fiber OM4 / SFP+ DAC).</li>
<li><b>Label kabel:</b> setiap kabel punya ID unik yang sama dengan label fisiknya (lihat 38.8).</li>
<li><b>Power:</b> sumber listrik & UPS per rack (sering dilupakan, fatal saat mati lampu).</li>
</ul>
<h3>Contoh (Skema Kurikulum)</h3>
<pre>  [Rack R1 — Ruang Server Lt.2]
  ┌──────────────┐  fiber OM4 duplex (CBL-F01)   ┌──────────────┐
  │ CHR-CORE-01  │  ether1 ───────────────────▶ │ SW-CORE-01   │
  │ 192.168.99.1 │  SFP+ 10G                     │ 192.168.99.2 │
  └──────────────┘                               └──────┬───────┘
                                                        │ trunk (semua VLAN)
                                          ┌─────────────┼─────────────┐
                                     Gi0/1│        Gi0/2│        Gi0/3│
                                   ┌──────▼───┐  ┌──────▼───┐  ┌──────▼───┐
                                   │SW-ACC-01 │  │SW-ACC-02 │  │SW-SRV-01 │
                                   │.99.11    │  │.99.12    │  │.99.13    │
                                   └──────────┘  └──────────┘  └──────────┘
  Setiap garis = satu kabel fisik berlabel. Tanpa label, diagram ini hanya gambar hiasan.</pre>
<h3>Aturan Praktis</h3>
<p>Satu diagram = satu <b>site</b> (jangan campur 5 gedung dalam 1 gambar). Update <b>saat perubahan terjadi</b> (bukan "nanti"), versioning di Git. Tool: draw.io/diagrams.net (gratis), atau ASCII untuk repo teks.</p>`,
      terms: [
        ['Physical diagram', 'Peta wujud fisik: perangkat, lokasi, port, kabel, dan power.'],
        ['Rack', 'Lemari standar 19 inci tempat perangkat di-mount (diukur dalam U).'],
        ['Label kabel', 'ID unik di tiap kabel yang cocok dengan dokumentasi.'],
      ],
      diagram: `<pre>        HIERARKI DOKUMENTASI DIAGRAM

  Physical (38.1):  BAGAIMANA terhubung (kabel, port, lokasi)
        ↓ dasar untuk
  Logical (38.2):   APA fungsinya (VLAN, subnet, routing)
        ↓ dilengkapi
  Rack (38.3):      DIMANA tepatnya (posisi U di lemari)

  Ketiganya harus KONSISTEN: satu perubahan fisik
  = update ketiga diagram + tabel terkait.</pre>`,
      scenario: 'Internet mati tengah malam. Teknisi on-call membuka physical diagram: uplink fiber dari ISP masuk ke patch panel PP-01 port 12 → ke CHR ether1. Di lokasi: kabel di port 12 kendor. 15 menit selesai. Tanpa diagram: 2 jam trial-and-error mencabut kabel acak.',
      bestPractices: 'Label fisik dan diagram harus 1:1 (audit label berkala). Simpan diagram sebagai file berversion (draw.io XML di Git), bukan hanya PNG.',
      security: 'Physical diagram = peta lengkap infrastruktur; akses terbatas untuk tim netops. Jangan tempel di dinding publik atau share ke vendor tanpa NDA.',
      challenge: 'Gambar physical diagram lab GNS3-mu (3 CHR + switch): hostname, IP management, port koneksi, dan tipe link. Simpan sebagai draw.io atau ASCII.',
      interviewQ: 'Q: Apa beda physical dan logical diagram? — A: Physical = wujud fisik (perangkat, lokasi, kabel, port) untuk teknisi lapangan; logical = fungsi (VLAN, subnet, routing, aliran trafik) untuk desain dan troubleshooting. Keduanya harus konsisten.',
      quiz: [
        { q: 'Informasi apa yang WAJIB ada di physical diagram?', options: ['Warna favorit admin', 'Hostname, lokasi, port-to-port connection, tipe media, dan label kabel', 'Hanya nama gedung', 'Password perangkat'], answer: 1, explain: 'Physical diagram adalah peta kerja teknisi: tanpa port dan label kabel yang akurat, ia tidak bisa dipakai saat insiden.' },
        { q: 'Mengapa label kabel fisik harus cocok dengan dokumentasi?', options: ['Agar rapi difoto', 'Agar teknisi bisa menemukan kabel yang benar dalam hitungan detik saat insiden — label ngawur = cabut kabel yang salah', 'Tidak penting', 'Agar mahal'], answer: 1, explain: 'Saat darurat, teknisi mengikuti label; label yang tidak cocok dengan diagram bisa menyebabkan kabel production tercabut.' },
        { q: 'Kapan physical diagram harus di-update?', options: ['Setahun sekali', 'Saat perubahan terjadi — diagram kedaluwarsa lebih berbahaya dari tidak ada diagram (menyesatkan)', 'Tidak pernah', 'Saat audit saja'], answer: 1, explain: 'Diagram basi = informasi salah yang dipercaya; teknisi mengikuti peta salah ke lokasi salah. Update = bagian dari change, bukan tugas terpisah.' },
      ],
    },
    {
      id: '38.2',
      title: 'Logical Diagram',
      body: `<p><b>Logical diagram</b> menggambarkan <b>fungsi logis</b>: VLAN, subnet, routing, firewall zone, dan aliran trafik — <b>tanpa</b> peduli kabel fisiknya lewat mana. Ini peta untuk desain dan troubleshooting Layer 2/3 ("kenapa VLAN 20 tidak bisa ke server?").</p>
<h3>Contoh: Logical Lab Kurikulum</h3>
<pre>                          ┌─────────────────────────────┐
                          │        CHR-CORE-01            │
                          │     (router + firewall)       │
                          │      192.168.99.1             │
                          └──────────────┬──────────────┘
              ┌────────────┬──────────────┼──────────────┬────────────┐
              │VLAN 10     │VLAN 20       │VLAN 30       │VLAN 40     │VLAN 99
              │CCTV        │OFFICE        │SERVER        │GUEST       │MGMT
              │.10.0/24    │.20.0/24      │.30.0/24      │.40.0/24    │.99.0/24
              │gw .10.1    │gw .20.1      │gw .30.1      │gw .40.1    │gw .99.1
        ┌─────┴─────┐ ┌────┴──────┐ ┌─────┴──────┐ ┌─────┴─────┐ ┌─────┴──────┐
        │ NVR       │ │ PC user   │ │ Zabbix     │ │ AP Tamu   │ │ SW/CHR     │
        │ .10.10    │ │ .20.10+   │ │ .30.10     │ │ .40.10    │ │ .99.11+    │
        └───────────┘ └───────────┘ └────────────┘ └───────────┘ └────────────┘
  Firewall policy (contoh): GUEST (40) → DENY ke semua VLAN internal, ALLOW ke internet.
                            CCTV (10) → ALLOW ke NVR saja; MGMT (99) → ALLOW dari NOC saja.</pre>
<h3>Yang Wajib Ada</h3>
<ul>
<li>Setiap VLAN: ID, nama, subnet, gateway.</li>
<li>Routing: static/OSPF, default route ke mana.</li>
<li>Firewall zone & policy antar-VLAN (aturan tingkat tinggi).</li>
<li>Service kritis: DHCP, DNS di mana; monitoring mencakup apa.</li>
</ul>
<p><b>Hubungan dengan OSI:</b> logical diagram hidup di Layer 2 (VLAN, STP) dan Layer 3 (subnet, routing) — dengan catatan policy Layer 4 (port yang diizinkan antar zone).</p>`,
      terms: [
        ['Logical diagram', 'Peta fungsi logis: VLAN, subnet, routing, firewall zone, aliran trafik.'],
        ['Firewall zone', 'Pengelompokan logis interface/VLAN dengan policy keamanan antar zone.'],
      ],
      scenario: 'User GUEST bisa akses server internal — pelanggaran keamanan. Logical diagram menunjukkan policy yang SEHARUSNYA (GUEST deny ke internal). Cek FortiGate: rule-nya ada tapi di bawah rule allow-any (urutan salah). Diagram menjadi "kebenaran yang diharapkan" untuk membandingkan konfigurasi nyata.',
      bestPractices: 'Satu logical diagram per site + satu end-to-end antar site. Cantumkan tanggal update dan versi. Sinkron dengan firewall policy nyata (audit berkala).',
      security: 'Logical diagram membocorkan arsitektur keamanan (zone, policy) — perlakukan sebagai dokumen internal sensitif.',
      challenge: 'Buat logical diagram lab-mu: 5 VLAN + subnet + gateway + 1 contoh firewall policy antar zone. Pastikan angkanya sama dengan physical diagram (38.1).',
      interviewQ: 'Q: Kapan memakai logical diagram vs physical diagram saat troubleshooting? — A: Logical untuk masalah Layer 2/3 (VLAN, routing, firewall policy — "kenapa tidak bisa nyambung"); physical untuk masalah Layer 1 (kabel, port, lokasi — "kabel mana yang bermasalah").',
      quiz: [
        { q: 'Apa fokus utama logical diagram?', options: ['Warna kabel', 'Fungsi logis: VLAN, subnet, routing, firewall zone, aliran trafik', 'Merek perangkat', 'Harga perangkat'], answer: 1, explain: 'Logical = APA fungsinya (L2/L3/L4), bukan BAGAIMANA wujud fisiknya. Untuk desain dan troubleshooting logis.' },
        { q: 'Mengapa firewall policy dicantumkan di logical diagram?', options: ['Agar gambar penuh', 'Agar ada "kebenaran yang diharapkan" untuk dibandingkan dengan konfigurasi nyata saat audit/troubleshooting', 'Wajib hukum', 'Tidak perlu'], answer: 1, explain: 'Diagram menjadi acuan: policy nyata yang menyimpang dari diagram = temuan (salah config atau perubahan tak terdokumentasi).' },
        { q: 'Logical diagram yang baik mencakup layer OSI apa?', options: ['Hanya Layer 1', 'Layer 2 (VLAN/STP), Layer 3 (subnet/routing), plus catatan policy Layer 4', 'Hanya Layer 7', 'Semua layer detail'], answer: 1, explain: 'Logical diagram hidup di L2-L4; detail L1 ada di physical diagram, detail aplikasi bukan ranah diagram jaringan.' },
      ],
    },
    {
      id: '38.3',
      title: 'Rack Diagram',
      body: `<p><b>Rack diagram</b> menunjukkan <b>posisi fisik tiap perangkat di dalam rack</b> (lemari 19"), diukur dalam <b>U</b> (unit, 1U = 4,445 cm). Tampak sepele — tapi saat instalasi, audit aset, atau perencanaan power/cooling, ini dokumen yang dibuka pertama.</p>
<h3>Contoh: Rack R1 (Ruang Server Lt.2)</h3>
<pre>  U42 ┌─────────────────────────┐
      │ Patch Panel PP-01 (24p) │  ← terminasi kabel UTP dari user
  U41 ├─────────────────────────┤
      │ Patch Panel PP-02 (24p) │
  U40 ├─────────────────────────┤
      │ Fiber Panel FP-01       │  ← terminasi fiber OM4
  U39 ├─────────────────────────┤
      │ (kosong — airflow)      │
  U38 ├─────────────────────────┤
      │ SW-CORE-01              │  ← 1U switch
  U37 ├─────────────────────────┤
      │ CHR-CORE-01 (VM host)   │  ← 2U server (U36-U37)
  U36 │                         │
  U35 ├─────────────────────────┤
      │ UPS-01                  │  ← 2U UPS (paling bawah: berat!)
      └─────────────────────────┘
  Aturan: berat di BAWAH (UPS, server), patch panel di ATAS (dekat kabel masuk),
  sisakan ruang kosong untuk airflow & ekspansi (jangan padatkan 100%).</pre>
<h3>Yang Wajib Dicatat per U</h3>
<ul>
<li>Hostname + model + serial number (untuk inventory 38.9).</li>
<li>Konsumsi daya (watt) — untuk perhitungan UPS & cooling.</li>
<li>Kabel power ke UPS/PDU mana (jalur A/B untuk redundansi).</li>
</ul>`,
      terms: [
        ['Rack diagram', 'Denah posisi perangkat per U di dalam rack 19 inci.'],
        ['U (unit)', 'Satuan tinggi rack: 1U = 4,445 cm.'],
        ['PDU', 'Power Distribution Unit — terminal listrik di dalam rack.'],
      ],
      scenario: 'Rencana tambah 2 server baru. Rack diagram menunjukkan U38-U42 penuh, sisa U20-U25 kosong tapi PDU-B sudah 90% beban. Keputusan: server dipasang di U24-U25 dengan power dialihkan sebagian ke PDU-A. Tanpa diagram + data daya: server dipasang asal, PDU trip, setengah rack mati.',
      bestPractices: 'Foto rack tiap ada perubahan (bukti visual). Catat daya per device. Jangan isi >80% kapasitas rack — sisakan untuk airflow dan ekspansi.',
      security: 'Rack harus terkunci; akses fisik = akses total (reset password via console). Catat siapa membuka rack (log akses ruang server).',
      challenge: 'Buat rack diagram untuk "rack" lab-mu (bisa virtual): alokasikan U untuk tiap CHR/switch/patch panel dengan aturan berat-di-bawah.',
      interviewQ: 'Q: Mengapa UPS diletakkan di bawah rack? — A: Karena paling berat — menaruh beban berat di atas membuat rack tidak stabil (risiko roboh) dan menyulitkan perawatan. Aturan umum: berat di bawah, patch panel di atas.',
      quiz: [
        { q: 'Apa itu 1U dalam rack?', options: ['1 user', 'Satuan tinggi 4,445 cm untuk mengukur perangkat rack 19 inci', '1 kabel', '1 volt'], answer: 1, explain: 'U = unit tinggi standar; perangkat 1U/2U/4U dirancang pas dengan rel rack.' },
        { q: 'Mengapa tidak boleh mengisi rack sampai 100% penuh?', options: ['Agar terlihat lega', 'Butuh ruang untuk airflow (pendinginan) dan ekspansi masa depan', 'Aturan pabrik cat', 'Tidak ada alasan'], answer: 1, explain: 'Rack padat = panas terjebak = perangkat overheat; tanpa slot kosong, ekspansi butuh bongkar total.' },
        { q: 'Data apa yang wajib dicatat per posisi rack selain hostname?', options: ['Warna LED', 'Model, serial number, konsumsi daya, dan jalur power (UPS/PDU A/B)', 'Nama teknisi favorit', 'Tanggal beli kabel'], answer: 1, explain: 'Serial = inventory/audit; daya = perencanaan UPS/cooling; jalur power = redundansi. Ini data operasional, bukan hiasan.' },
      ],
    },
    {
      id: '38.4',
      title: 'IP Address Table',
      body: `<p><b>IP Address Table (IP plan)</b> adalah <b>daftar resmi</b> alokasi setiap alamat IP: subnet apa, dipakai oleh apa, di device mana. Ini <b>source of truth</b> pengalamatan — acuan script audit otomatis (Part 35.5) dan pencegah IP conflict.</p>
<h3>Template: IP Plan Kurikulum</h3>
<div class="tblwrap"><table>
<tr><th>Subnet</th><th>VLAN</th><th>Gateway</th><th>Range DHCP/Statis</th><th>Contoh Penghuni</th></tr>
<tr><td>192.168.10.0/24</td><td>10 CCTV</td><td>192.168.10.1</td><td>.2–.49 statis (kamera), .50–.99 NVR</td><td>NVR .10.10, CAM-01 .10.11</td></tr>
<tr><td>192.168.20.0/24</td><td>20 OFFICE</td><td>192.168.20.1</td><td>.10–.200 DHCP, .201–.254 statis (printer)</td><td>PC-001 .20.10, PRN-01 .20.201</td></tr>
<tr><td>192.168.30.0/24</td><td>30 SERVER</td><td>192.168.30.1</td><td>.2–.99 statis semua (server!)</td><td>Zabbix .30.10, Grafana .30.11</td></tr>
<tr><td>192.168.40.0/24</td><td>40 GUEST</td><td>192.168.40.1</td><td>.10–.200 DHCP (lease pendek 1 jam)</td><td>Tamu (dinamis)</td></tr>
<tr><td>192.168.99.0/24</td><td>99 MGMT</td><td>192.168.99.1</td><td>.2–.50 statis infrastruktur</td><td>CHR-CORE-01 .99.1, SW-CORE-01 .99.2</td></tr>
</table></div>
<h3>Detail Alokasi per Subnet (contoh VLAN 99)</h3>
<div class="tblwrap"><table>
<tr><th>IP</th><th>Hostname</th><th>Peran</th><th>Catatan</th></tr>
<tr><td>192.168.99.1</td><td>CHR-CORE-01</td><td>Router/firewall utama</td><td>Gateway VLAN 99</td></tr>
<tr><td>192.168.99.2</td><td>SW-CORE-01</td><td>Core switch</td><td>Management IP</td></tr>
<tr><td>192.168.99.11–13</td><td>SW-ACC-01–03</td><td>Access switch</td><td>Management IP</td></tr>
<tr><td>192.168.99.100</td><td>NOC-LAPTOP</td><td>Workstation NOC</td><td>DHCP reservation</td></tr>
</table></div>
<p><b>Aturan:</b> .1 selalu gateway (konsisten di semua VLAN — mudah diingat, mudah di-script). Infrastruktur = statis; user = DHCP. Setiap IP statis wajib tercatat di tabel ini <b>sebelum</b> dipasang.</p>`,
      terms: [
        ['IP plan', 'Dokumen resmi alokasi subnet dan alamat IP — source of truth pengalamatan.'],
        ['DHCP reservation', 'IP "dinamis" yang selalu diberikan ke MAC tertentu — perpaduan fleksibilitas & kepastian.'],
      ],
      scenario: 'IP conflict misterius di VLAN 30: dua server berebut 192.168.30.20. IP table menunjukkan .30.20 sudah dialokasikan ke "DB-01" — ternyata teknisi memasang "DB-02" dengan IP hafalan tanpa cek tabel. Solusi: alokasi ulang + SOP "cek tabel dulu". Sejak itu conflict = 0.',
      bestPractices: '.1 = gateway di semua VLAN (konsistensi). Pisahkan range statis vs DHCP per subnet. Tabel di Git/spreadsheet berversion; perubahan = update tabel DULU, pasang kemudian.',
      security: 'IP table lengkap = peta jaringan; akses terbatas tim netops. Jangan sertakan di dokumen yang disebar ke pihak luar.',
      challenge: 'Buat IP table untuk lab-mu: tiap CHR/switch/VM dapat baris (IP, hostname, peran). Pastikan tidak ada yang "hafalan di luar tabel".',
      interviewQ: 'Q: Mengapa IP .1 dijadikan gateway di semua VLAN? — A: Konsistensi: mudah diingat manusia, mudah di-generate script (gateway = network+1), dan mengurangi kesalahan config. Standar yang konsisten > standar yang "pintar".',
      quiz: [
        { q: 'Apa fungsi utama IP Address Table?', options: ['Hiasan dokumentasi', 'Source of truth alokasi IP: mencegah conflict/duplikat dan menjadi acuan audit otomatis', 'Pengganti DHCP', 'Daftar password'], answer: 1, explain: 'Setiap IP statis tercatat sebelum dipasang; script audit (35.5) membandingkan realita vs tabel ini.' },
        { q: 'Mengapa server memakai IP statis tercatat, bukan DHCP?', options: ['Karena DHCP rusak', 'Server harus punya alamat pasti untuk monitoring, DNS, dan firewall rule — DHCP reservation minimal, statis lebih baik', 'Agar cepat', 'Tidak ada alasan'], answer: 1, explain: 'Infrastruktur butuh determinisme: monitoring, DNS record, dan firewall rule semuanya merujuk ke IP yang tidak berubah.' },
        { q: 'Kapan IP table di-update?', options: ['Setahun sekali', 'SEBELUM IP dipasang — alokasi dulu, pakai kemudian', 'Setelah ingat', 'Tidak perlu'], answer: 1, explain: 'Alur benar: cek ketersediaan di tabel → catat alokasi → baru konfigurasi. Kebalikannya = conflict.' },
      ],
    },
    {
      id: '38.5',
      title: 'VLAN Table',
      body: `<p><b>VLAN Table</b> mendefinisikan setiap VLAN: ID, nama, subnet, tujuan, dan di mana ia diizinkan (trunk). Ini adalah <b>kontrak segmentasi</b> jaringan — acuan konfigurasi switch (Part 08–12) dan script provisioning (Part 35.8).</p>
<h3>Template: VLAN Table Kurikulum</h3>
<div class="tblwrap"><table>
<tr><th>VLAN ID</th><th>Nama</th><th>Subnet</th><th>Gateway</th><th>Tujuan</th><th>Trunk ke</th></tr>
<tr><td>10</td><td>CCTV</td><td>192.168.10.0/24</td><td>192.168.10.1</td><td>Kamera & NVR (isolasi, bandwidth prioritas)</td><td>Core, ACC-01/02, SRV</td></tr>
<tr><td>20</td><td>OFFICE</td><td>192.168.20.0/24</td><td>192.168.20.1</td><td>PC/laptop karyawan</td><td>Core, ACC-01/02</td></tr>
<tr><td>30</td><td>SERVER</td><td>192.168.30.0/24</td><td>192.168.30.1</td><td>Server & monitoring</td><td>Core, SRV-01</td></tr>
<tr><td>40</td><td>GUEST</td><td>192.168.40.0/24</td><td>192.168.40.1</td><td>Tamu (isolasi total dari internal)</td><td>Core, ACC-01/02 (AP)</td></tr>
<tr><td>99</td><td>MANAGEMENT</td><td>192.168.99.0/24</td><td>192.168.99.1</td><td>Management IP perangkat</td><td>Semua switch</td></tr>
</table></div>
<h3>Aturan Penamaan & ID</h3>
<ul>
<li><b>Nama huruf kapital, deskriptif:</b> <code>VLAN10-CCTV</code> — terbaca di config tanpa buka tabel.</li>
<li><b>ID bermakna:</b> 10/20/30/40 berurutan per fungsi; 99 khusus management (konvensi umum). Hindari VLAN 1 (default, tidak aman).</li>
<li><b>Native VLAN:</b> jangan pakai 1; gunakan 99 atau VLAN khusus yang tidak dipakai user (mitigasi VLAN hopping).</li>
<li><b>Dokumentasikan yang TIDAK di-trunk juga:</b> "VLAN 30 tidak diizinkan di ACC-01" sama pentingnya dengan yang diizinkan.</li>
</ul>`,
      terms: [
        ['VLAN table', 'Dokumen resmi definisi VLAN: ID, nama, subnet, tujuan, trunk.'],
        ['Native VLAN', 'VLAN untuk trafik untagged di trunk — jangan pakai VLAN 1 atau VLAN user.'],
        ['VLAN hopping', 'Serangan meloncat antar VLAN via manipulasi tagging — dimitigasi dengan native VLAN tepat & pruning.'],
      ],
      scenario: 'VLAN baru "IOT" (ID 50) dibutuhkan untuk 200 sensor. Tanpa tabel: tiap switch dikonfigurasi dengan nama/ID berbeda-beda ("iot", "IOT", "50", "60") → chaos. Dengan tabel: ID 50, nama VLAN50-IOT, subnet 192.168.50.0/24 ditetapkan dulu, baru provisioning massal — konsisten di semua switch.',
      bestPractices: 'Satu VLAN = satu baris = satu kebenaran. Perubahan VLAN = update tabel + Git + baru konfigurasi. Review tabel tiap kuartal (VLAN tak terpakai = hapus).',
      security: 'Prune VLAN yang tidak dibutuhkan dari trunk (least privilege Layer 2). Dokumentasikan alasan tiap VLAN — VLAN tanpa tujuan jelas adalah kandidat serangan.',
      challenge: 'Buat VLAN table untuk lab-mu persis seperti template, lalu verifikasi: apakah konfigurasi VLAN di CHR-mu cocok 100% dengan tabel? (Ini mini-audit manual.)',
      interviewQ: 'Q: Mengapa VLAN 1 tidak boleh dipakai untuk user/management? — A: VLAN 1 adalah default di semua switch (sering tidak bisa dihapus total) dan menjadi target umum serangan VLAN hopping; best practice: biarkan 1 tak terpakai, pakai VLAN khusus untuk native dan management.',
      quiz: [
        { q: 'Informasi apa yang wajib ada di tiap baris VLAN table?', options: ['Hanya ID', 'ID, nama, subnet, gateway, tujuan, dan trunk ke mana', 'Hanya nama', 'Warna kabel'], answer: 1, explain: 'Baris lengkap = kontrak: cukup untuk mengkonfigurasi switch mana pun tanpa bertanya ke siapa pun.' },
        { q: 'Mengapa native VLAN tidak boleh VLAN 1 atau VLAN user?', options: ['Agar hemat', 'Mitigasi VLAN hopping: VLAN 1 adalah target umum serangan; native yang tepat + pruning menutup celah double-tagging', 'Karena lambat', 'Tidak ada alasan'], answer: 1, explain: 'Serangan VLAN hopping mengeksploitasi native VLAN; memakai VLAN khusus yang tidak membawa trafik user menutup vektor ini.' },
        { q: 'Apa hubungan VLAN table dengan automation Part 35?', options: ['Tidak ada', 'VLAN table (sebagai YAML) adalah source of truth yang dibaca script provisioning 35.8 — tabel yang rapi = provisioning yang benar', 'Automation tidak butuh tabel', 'Tabel hanya untuk manusia'], answer: 1, explain: 'Data yang sama melayani dua tuan: manusia (tabel) dan mesin (YAML). Satu sumber, dua presentasi — tidak ada duplikasi kebenaran.' },
      ],
    },
    {
      id: '38.6',
      title: 'Port Mapping',
      body: `<p><b>Port mapping</b> mencatat <b>setiap port</b> di setiap switch: mode (access/trunk), VLAN, terhubung ke apa, dan status. Ini adalah "KTP" tiap port — dokumen yang dibuka saat: user pindah meja, port bermasalah, atau audit keamanan ("port ini seharusnya kosong, kenapa ada yang colok?").</p>
<h3>Template: Port Mapping SW-ACC-01</h3>
<div class="tblwrap"><table>
<tr><th>Port</th><th>Mode</th><th>VLAN</th><th>Terhubung ke</th><th>Status</th><th>Catatan</th></tr>
<tr><td>Gi0/1</td><td>Trunk</td><td>10,20,40,99</td><td>SW-CORE-01:Gi0/1</td><td>Up</td><td>Uplink (prune: tanpa 30)</td></tr>
<tr><td>Gi0/2</td><td>Access</td><td>20</td><td>PC-001 (Keuangan)</td><td>Up</td><td>Port-security: 1 MAC</td></tr>
<tr><td>Gi0/3</td><td>Access</td><td>20</td><td>PC-002 (Keuangan)</td><td>Up</td><td></td></tr>
<tr><td>Gi0/4</td><td>Access</td><td>10</td><td>CAM-01 (Parkir)</td><td>Up</td><td>PoE</td></tr>
<tr><td>Gi0/5</td><td>Access</td><td>40</td><td>AP-GUEST-01</td><td>Up</td><td>AP tamu</td></tr>
<tr><td>Gi0/6–24</td><td>—</td><td>—</td><td>(kosong)</td><td>Shutdown</td><td>Port tak terpakai = MATI</td></tr>
</table></div>
<h3>Aturan Penting</h3>
<ul>
<li><b>Port tak terpakai = shutdown + masuk VLAN "kuburan"</b> (mis. VLAN 999): mencegah orang colok sembarangan dan langsung dapat jaringan.</li>
<li><b>Deskripsi di config</b> (<code>description</code>) harus cocok dengan tabel — config adalah dokumentasi yang hidup.</li>
<li><b>Update saat user pindah:</b> "PC-001 pindah ke Gi0/7" = update tabel + description, bukan hanya cabut-colok.</li>
</ul>`,
      terms: [
        ['Port mapping', 'Dokumentasi per-port: mode, VLAN, koneksi, status.'],
        ['Port-security', 'Fitur membatasi MAC per port — cegah colok perangkat liar.'],
        ['VLAN kuburan (blackhole)', 'VLAN isolasi untuk port tak terpakai.'],
      ],
      scenario: 'Laptop asing ditemukan tercolok di ruang meeting dan mendapat IP kantor. Investigasi port mapping: Gi0/12 tercatat "kosong/shutdown" tapi status Up — seseorang mengaktifkan manual tanpa update. Sejak itu: port tak terpakai shutdown + port-security + audit mapping bulanan.',
      bestPractices: 'Deskripsi port di config = cermin tabel. Audit fisik vs tabel tiap kuartal. Port kosong: shutdown + VLAN kuburan + (ideal) port-security.',
      security: 'Port mapping adalah dokumen keamanan: port aktif tak dikenal = insiden. Batasi akses tabel ini untuk netops; jangan pajang di area publik.',
      challenge: 'Buat port mapping untuk 1 switch lab-mu (atau virtual): tiap port: mode, VLAN, terhubung ke apa. Tandai port tak terpakai sebagai shutdown.',
      interviewQ: 'Q: Bagaimana port mapping membantu keamanan? — A: Ia mendefinisikan "seharusnya": port yang Up tapi tercatat kosong = anomali (perangkat liar); port tak terpakai yang shutdown = permukaan serangan minimal. Tanpa baseline, anomali tidak terlihat.',
      quiz: [
        { q: 'Bagaimana perlakuan yang benar untuk port switch tak terpakai?', options: ['Biarkan aktif default', 'Shutdown + masukkan ke VLAN isolasi ("kuburan") — mencegah colok sembarangan langsung dapat jaringan', 'Cabut switch-nya', 'Tidak perlu apa-apa'], answer: 1, explain: 'Port aktif default = pintu terbuka untuk siapa pun yang colok kabel. Shutdown + VLAN kuburan = pintu terkunci.' },
        { q: 'Mengapa description di config harus cocok dengan port mapping?', options: ['Agar cantik', 'Config adalah dokumentasi yang hidup — saat troubleshooting via CLI, description memberi konteks tanpa buka tabel', 'Wajib vendor', 'Tidak penting'], answer: 1, explain: 'show interface description yang akurat menghemat waktu diagnosis; deskripsi basi menyesatkan.' },
        { q: 'Port tercatat "kosong/shutdown" tapi status Up. Artinya?', options: ['Normal', 'Anomali keamanan: ada yang mengaktifkan/mencolok tanpa otorisasi — investigasi', 'Switch rusak', 'Abaikan'], answer: 1, explain: 'Deviasi dari baseline port mapping = temuan keamanan. Mungkin teknisi lupa update, mungkin perangkat liar — keduanya harus jelas.' },
      ],
    },
    {
      id: '38.7',
      title: 'Fiber Core Mapping',
      body: `<p><b>Fiber core mapping</b> mencatat <b>setiap core (serat)</b> dalam kabel fiber: core nomor berapa, dari panel mana ke panel mana, dipakai untuk apa, dan statusnya. Satu kabel fiber berisi 4–144 core; tanpa mapping, mencari "core mana yang ke gedung B" = menebak dalam gelap.</p>
<h3>Template: Fiber Backbone</h3>
<div class="tblwrap"><table>
<tr><th>Kabel</th><th>Core</th><th>Warna</th><th>Dari</th><th>Ke</th><th>Pakai Untuk</th><th>Status</th></tr>
<tr><td>FB-01 (12 core)</td><td>1–2</td><td>Biru–Oranye</td><td>R1:FP-01 p1–2</td><td>R2:FP-01 p1–2</td><td>Uplink core↔dist (10G)</td><td>Up</td></tr>
<tr><td>FB-01</td><td>3–4</td><td>Hijau–Coklat</td><td>R1:FP-01 p3–4</td><td>R2:FP-01 p3–4</td><td>Cadangan (spare)</td><td>Spare</td></tr>
<tr><td>FB-01</td><td>5–12</td><td>—</td><td>—</td><td>—</td><td>Spare untuk ekspansi</td><td>Spare</td></tr>
<tr><td>FB-02 (12 core)</td><td>1–2</td><td>Biru–Oranye</td><td>R1:FP-01 p5–6</td><td>R3:FP-01 p1–2</td><td>Uplink ke Gedung B</td><td>Up</td></tr>
</table></div>
<h3>Aturan</h3>
<ul>
<li><b>Selalu sisakan spare:</b> minimal 50% core cadangan — splicing ulang itu mahal dan lama.</li>
<li><b>Catat redaman (dB):</b> hasil OTDR/test tiap core saat instalasi = baseline; kenaikan redaman = degradasi.</li>
<li><b>Tx/Rx jangan tertukar:</b> dokumentasikan polaritas (A→B: Tx core 1 = Rx core 2 di ujung).</li>
<li><b>Label panel:</b> tiap port panel fiber berlabel permanen sesuai tabel.</li>
</ul>
<div class="callout blue"><div class="t">Fiber untuk NOC</div><p style="margin:4px 0 0">Gangguan fiber ("putus total tiba-tiba") 90% penyebabnya fisik: galian, gigitan tikus, konektor kotor. Mapping + baseline redaman membuat diagnosis "core 3-4 putus di KM 2,1" (dari OTDR) langsung bisa dipetakan ke "itu uplink ke Gedung B".</p></div>`,
      terms: [
        ['Core', 'Satu serat kaca dalam kabel fiber; unit terkecil yang dipetakan.'],
        ['OTDR', 'Optical Time Domain Reflectometer — alat mengukur redaman & lokasi putus fiber.'],
        ['Redaman (dB)', 'Pelemahan sinyal cahaya; naik = kualitas turun.'],
        ['Spare core', 'Core cadangan yang belum dipakai — untuk ekspansi/darurat.'],
      ],
      scenario: 'Backhoe memutus kabel fiber ke Gedung B. OTDR menunjukkan putus di 2,1 km. Core mapping: core 1–2 FB-02 = uplink Gedung B. Teknisi splicing darurat memakai core spare 3–4 (sudah tercatat!) — layanan pulih 3 jam, bukan 3 hari menunggu kabel baru.',
      bestPractices: 'Dokumentasikan SAAT instalasi (setelah itu tidak ada yang ingat). Simpan hasil OTDR awal sebagai baseline. Spare minimal 50%.',
      security: 'Jalur fiber = jalur data; peta fiber menunjukkan "di mana menyadap paling mudah". Batasi akses dokumen ini.',
      challenge: 'Buat fiber core mapping untuk backbone lab-mu (bisa virtual): 1 kabel, 6 core, 2 dipakai, sisanya spare. Tentukan warna dan panel.',
      interviewQ: 'Q: Mengapa perlu core cadangan (spare) dalam jumlah besar? — A: Karena menambah core baru berarti gelar kabel baru (mahal, lama, butuh izin galian). Spare = ekspansi/perbaikan dalam hitungan jam tanpa konstruksi.',
      quiz: [
        { q: 'Apa itu fiber core mapping?', options: ['Peta warna kabel', 'Dokumentasi tiap core fiber: nomor, warna, panel asal-tujuan, fungsi, status', 'Daftar harga fiber', 'Jadwal maintenance'], answer: 1, explain: 'Tanpa mapping per-core, troubleshooting fiber ("core mana yang putus?") menjadi tebak-tebakan.' },
        { q: 'Mengapa hasil pengukuran redaman awal (baseline) disimpan?', options: ['Untuk arsip saja', 'Sebagai pembanding: kenaikan redaman di kemudian hari menandakan degradasi/konektor kotor/sambungan buruk', 'Wajib pabrik', 'Tidak penting'], answer: 1, explain: 'Tanpa baseline, "redaman 0,8 dB" tidak bermakna; dengan baseline 0,3 dB, jelas ada degradasi yang perlu ditindak.' },
        { q: 'Berapa minimal core spare yang disarankan dan mengapa?', options: ['Tidak perlu spare', 'Minimal ~50% — splicing/gelar kabel baru mahal dan lama; spare memungkinkan perbaikan/ekspansi cepat', '1 core cukup', '100% harus spare'], answer: 1, explain: 'Spare = asuransi: putus atau butuh kapasitas baru bisa dialihkan ke core cadangan dalam jam, bukan minggu.' },
      ],
    },
    {
      id: '38.8',
      title: 'Cable Schedule',
      body: `<p><b>Cable schedule</b> adalah <b>daftar induk semua kabel</b>: ID unik, jenis, dari–ke (port presisi), panjang, dan tanggal instalasi. Jika physical diagram adalah peta, cable schedule adalah <b>daftar inventaris</b> setiap jalan di peta itu.</p>
<h3>Template</h3>
<div class="tblwrap"><table>
<tr><th>ID Kabel</th><th>Jenis</th><th>Dari</th><th>Ke</th><th>Panjang</th><th>Tgl Pasang</th><th>Status</th></tr>
<tr><td>CBL-F01</td><td>Fiber OM4 duplex</td><td>R1:FP-01 p1–2</td><td>R2:FP-01 p1–2</td><td>85 m</td><td>2026-03-10</td><td>Aktif</td></tr>
<tr><td>CBL-U015</td><td>UTP Cat6</td><td>R1:PP-01 p15</td><td>Ruang 201:PC-007</td><td>32 m</td><td>2026-03-12</td><td>Aktif</td></tr>
<tr><td>CBL-U016</td><td>UTP Cat6</td><td>R1:PP-01 p16</td><td>— (spare)</td><td>30 m</td><td>2026-03-12</td><td>Spare</td></tr>
<tr><td>CBL-D02</td><td>SFP+ DAC 3m</td><td>CHR-CORE-01:sfp1</td><td>SW-CORE-01:sfp1</td><td>3 m</td><td>2026-05-01</td><td>Aktif</td></tr>
</table></div>
<h3>Standar Penomoran ID</h3>
<p>Buat skema yang terbaca: <code>CBL-[jenis][nomor]</code> — F=fiber, U=UTP, D=DAC, C=coax. Label fisik di <b>kedua ujung</b> kabel harus sama dengan ID di tabel. Kabel tanpa label = kabel hantu (tidak boleh ada).</p>
<h3>Panjang: Bukan Sekadar Arsip</h3>
<p>Panjang tercatat berguna saat: estimasi redaman, memastikan <b>batas maksimum</b> (UTP 100 m, OM4 10G ~400 m), dan perencanaan penggantian ("kabel 12 tahun, prioritas ganti").</p>`,
      terms: [
        ['Cable schedule', 'Daftar induk semua kabel: ID, jenis, rute port-to-port, panjang, status.'],
        ['ID kabel', 'Nomor unik yang sama di label fisik dan dokumentasi.'],
      ],
      scenario: 'Renovasi lantai 2: kontraktor butuh tahu kabel mana yang boleh dipindah. Cable schedule: 40 kabel teridentifikasi dalam 10 menit (ID → rute → status). Tanpa itu: tiap kabel harus di-trace manual (2 hari) atau diputus dengan risiko mematikan layanan.',
      bestPractices: 'Label kedua ujung saat instalasi (tidak bisa "nanti"). Catat panjang aktual. Retire (bukan hapus) kabel yang dicabut — history berguna untuk audit.',
      security: 'Kabel yang tidak tercatat = blind spot. Audit kabel vs schedule tiap tahun; kabel asing = investigasi.',
      challenge: 'Buat cable schedule untuk 10 "kabel" lab-mu (termasuk virtual): beri ID, jenis, dari-ke, dan panjang. Cetak label-nya (kertas pun jadi) dan tempel.',
      interviewQ: 'Q: Apa beda cable schedule dan physical diagram? — A: Physical diagram = peta visual (letak & koneksi); cable schedule = daftar inventaris rinci tiap kabel (ID, jenis, panjang, tanggal). Keduanya cross-reference via ID kabel.',
      quiz: [
        { q: 'Mengapa setiap kabel butuh ID unik yang sama di label fisik dan tabel?', options: ['Agar mahal', 'Agar teknisi bisa mencocokkan kabel fisik dengan dokumentasi dalam detik — tanpa itu, trace kabel = tebak-tebakan', 'Hanya formalitas', 'Agar berwarna'], answer: 1, explain: 'ID adalah jembatan fisik↔dokumen; kabel tanpa label yang cocok = "kabel hantu" yang tidak bisa di-troubleshoot sistematis.' },
        { q: 'Mengapa panjang kabel dicatat?', options: ['Untuk ditimbang', 'Untuk estimasi redaman, verifikasi batas maksimum media (UTP 100m), dan perencanaan penggantian', 'Tidak penting', 'Untuk pamer'], answer: 1, explain: 'Panjang menentukan kelayakan teknis (batas media) dan prioritas refresh; kabel 15 tahun 95 meter = kandidat masalah.' },
        { q: 'Kabel yang sudah dicabut sebaiknya...', options: ['Dihapus dari tabel agar bersih', 'Di-retire (status pensiun) bukan dihapus — history-nya berguna untuk audit dan referensi', 'Dibuang tabelnya', 'Dibiarkan tercatat aktif'], answer: 1, explain: 'Retire mempertahankan jejak ("kabel ini pernah ada, dicabut tanggal X oleh siapa") — penting untuk audit dan menghindari kebingungan.' },
      ],
    },
    {
      id: '38.9',
      title: 'Device Inventory',
      body: `<p><b>Device inventory</b> adalah <b>daftar aset</b>: setiap perangkat jaringan yang dimiliki — hostname, model, serial, firmware, lokasi, status garansi, dan tanggal beli. Ini dokumen <b>manajemen</b> (bukan teknis): untuk budgeting, garansi, refresh cycle, dan audit.</p>
<h3>Template</h3>
<div class="tblwrap"><table>
<tr><th>Hostname</th><th>Model</th><th>Serial</th><th>Firmware</th><th>Lokasi</th><th>Tgl Beli</th><th>Garansi s/d</th><th>Status</th></tr>
<tr><td>CHR-CORE-01</td><td>CHR (VM)</td><td>VM-2026-001</td><td>RouterOS 7.14</td><td>R1-U36/37</td><td>2026-01-15</td><td>— (lisensi)</td><td>Aktif</td></tr>
<tr><td>SW-CORE-01</td><td>CRS328-24P</td><td>SN-HD210045</td><td>RouterOS 7.14</td><td>R1-U38</td><td>2025-11-02</td><td>2027-11-02</td><td>Aktif</td></tr>
<tr><td>SW-ACC-02</td><td>CSS610-8P</td><td>SN-KA190077</td><td>SwOS 2.18</td><td>R2-U38</td><td>2024-06-20</td><td>2026-06-20</td><td>Aktif (garansi habis!)</td></tr>
<tr><td>FW-EDGE-01</td><td>FortiGate 60F</td><td>FGT60F-8899</td><td>FortiOS 7.4.3</td><td>R1-U35</td><td>2025-02-10</td><td>2028-02-10</td><td>Aktif</td></tr>
</table></div>
<h3>Yang Membuat Inventory Hidup</h3>
<ul>
<li><b>Firmware terpusat:</b> kolom firmware = dasar rencana upgrade massal (perangkat dengan firmware lama = target).</li>
<li><b>Garansi & EOL:</b> flag otomatis "garansi habis < 90 hari" dan "model EOL" → bahan budgeting tahunan.</li>
<li><b>Cross-reference:</b> hostname di inventory = hostname di diagram, IP table, dan monitoring (satu nama di mana-mana).</li>
<li><b>Barang cadangan (spare):</b> catat juga unit spare di gudang — saat device mati, yang dicari pertama adalah "spare apa yang ready".</li>
</ul>`,
      terms: [
        ['Inventory', 'Daftar aset perangkat: identitas, firmware, lokasi, garansi, status.'],
        ['EOL (End of Life)', 'Status produk yang tidak lagi didukung vendor — harus diganti.'],
        ['Refresh cycle', 'Siklus penggantian perangkat terjadwal (umumnya 5 tahun).'],
      ],
      scenario: 'Switch access mati total jam 9 pagi. Inventory: model CSS610-8P, garansi habis 4 bulan lalu, ada 1 unit spare di gudang (tercatat!). Teknisi ambil spare, restore config dari backup (38.10), config port dari port mapping (38.6) — layanan pulih 1 jam. Tanpa inventory+backup: indent barang 2 minggu.',
      bestPractices: 'Satu hostname konsisten di semua dokumen. Review firmware tiap kuartal. Budget refresh dari data EOL/garansi — bukan dari "rasa-rasanya sudah tua".',
      security: 'Serial number + firmware = informasi sensitif (membantu penyerang menargetkan CVE spesifik). Batasi akses inventory.',
      challenge: 'Buat inventory untuk semua "perangkat" lab-mu (termasuk VM): hostname, model, versi software, lokasi. Tandai yang firmwarenya tertinggal.',
      interviewQ: 'Q: Bagaimana inventory membantu perencanaan budget IT? — A: Data garansi/EOL/firmware menunjukkan perangkat mana yang butuh diganti tahun ini — budget berbasis data, bukan perkiraan. Plus mempercepat RMA (garansi) dan replacement (spare tercatat).',
      quiz: [
        { q: 'Mengapa kolom firmware penting di inventory?', options: ['Untuk pamer versi', 'Sebagai dasar rencana upgrade massal dan identifikasi perangkat rentan (CVE per versi)', 'Tidak penting', 'Agar tabel penuh'], answer: 1, explain: 'Firmware = permukaan serangan; inventory menunjukkan "siapa tertinggal" untuk upgrade terjadwal, bukan reaktif.' },
        { q: 'Apa itu EOL dan mengapa dipantau?', options: ['End of Line — kabel habis', 'End of Life: produk tak didukung vendor lagi (tanpa patch keamanan) — harus masuk rencana penggantian', 'Awal garansi', 'Tidak penting'], answer: 1, explain: 'Perangkat EOL tidak dapat patch keamanan = risiko yang tidak bisa ditambal. Harus diganti terjadwal.' },
        { q: 'Mengapa unit spare di gudang juga dicatat di inventory?', options: ['Agar gudang penuh', 'Agar saat device mati, tim langsung tahu spare apa yang ready — mempercepat recovery dari minggu menjadi jam', 'Formalitas', 'Tidak perlu'], answer: 1, explain: 'Recovery cepat butuh 3 hal: tahu apa yang rusak (monitoring), config cadangannya (backup), dan barang penggantinya (spare tercatat).' },
      ],
    },
    {
      id: '38.10',
      title: 'Configuration Backup',
      body: `<p><b>Configuration backup</b> yang terdokumentasi menjawab: <b>backup apa, di mana, kapan, dan apakah bisa di-restore?</b> Backup tanpa dokumentasi = berharap file-nya ketemu saat dibutuhkan. Bagian ini menstandarkan <i>manajemen</i> backup (teknik backup-nya di Part 35.3).</p>
<h3>Standar Dokumentasi Backup</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Standar</th><th>Contoh</th></tr>
<tr><td>Nama file</th><td>HOSTNAME_YYYYMMDD-HHMM.(backup/rsc)</td><td>CHR-CORE-01_20261014-0200.rsc</td></tr>
<tr><td>Jadwal</th><td>Harian otomatis (02:00) + sebelum setiap change</td><td>Timer 35.3 + pre-change manual</td></tr>
<tr><td>Lokasi</td><td>3-2-1: 3 salinan, 2 media, 1 offsite</td><td>Router + server backup + cloud/offsite</td></tr>
<tr><td>Retensi</th><td>Harian 30 hari, mingguan 12 minggu, bulanan 12 bulan</td><td>Housekeeping otomatis</td></tr>
<tr><td>Uji restore</th><td>Tiap kuartal di lab</td><td>Jadwal kalender + berita acara</td></tr>
</table></div>
<h3>Backup Log (Contoh)</h3>
<div class="tblwrap"><table>
<tr><th>Tanggal</th><th>Device</th><th>File</th><th>Ukuran</th><th>Restore Test</th><th>Oleh</th></tr>
<tr><td>2026-10-14</td><td>CHR-CORE-01</td><td>CHR-CORE-01_20261014-0200.rsc</td><td>48 KB</td><td>—</td><td>otomatis</td></tr>
<tr><td>2026-10-01</td><td>CHR-CORE-01</td><td>CHR-CORE-01_20261001-0200.backup</td><td>2,1 MB</td><td>OK (lab, 2026-10-05)</td><td>noc-admin</td></tr>
</table></div>
<p><b>3-2-1 rule:</b> 3 salinan data, di 2 media berbeda, 1 di lokasi berbeda (offsite). Ransomware mengenkripsi server backup lokal? Salinan offsite menyelamatkanmu.</p>
<div class="callout"><div class="t">Backup ≠ Arsip Config di Kepala</div><p style="margin:4px 0 0">"Saya ingat config-nya" bukan backup. "Ada file-nya tapi tidak tahu yang mana yang terakhir dan belum pernah diuji" juga bukan backup. Backup = file yang tepat + terdokumentasi + teruji restore-nya.</p></div>`,
      terms: [
        ['3-2-1 rule', '3 salinan, 2 media berbeda, 1 offsite — standar ketahanan backup.'],
        ['Retensi', 'Berapa lama backup disimpan (harian/mingguan/bulanan).'],
        ['Restore test', 'Uji berkala bahwa file backup benar-benar bisa menghidupkan kembali device.'],
      ],
      scenario: 'Ransomware mengenkripsi server + NAS backup lokal. Satu-satunya yang selamat: salinan offsite mingguan (sesuai 3-2-1). Recovery 2 hari dari offsite vs membangun ulang dari nol (berminggu-minggu). Aturan 3-2-1 terbukti bukan teori.',
      bestPractices: 'Otomatiskan jadwal + housekeeping (35.3). Dokumentasikan setiap backup penting di log. Uji restore terjadwal — masukkan ke kalender seperti maintenance lain.',
      security: 'Backup berisi secret (password, key, cert): enkripsi salinan offsite, batasi akses, jangan kirim via channel tak terenkripsi.',
      challenge: 'Buat backup log untuk lab-mu: catat 1 backup manual tiap CHR (nama file, ukuran, tanggal). Jadwalkan uji restore 1 file ke CHR cadangan bulan ini.',
      interviewQ: 'Q: Apa itu 3-2-1 rule dan mengapa offsite penting? — A: 3 salinan, 2 media, 1 offsite. Offsite melindungi dari bencana lokal (kebakaran, banjir, ransomware) yang menghancurkan salinan di satu lokasi.',
      quiz: [
        { q: 'Apa isi 3-2-1 rule?', options: ['3 router, 2 switch, 1 firewall', '3 salinan data, 2 media berbeda, 1 salinan di lokasi berbeda (offsite)', '3x backup sehari', 'Tidak ada artinya'], answer: 1, explain: 'Redundansi berlapis: kegagalan satu media/lokasi tidak menghilangkan semua salinan.' },
        { q: 'Mengapa restore test wajib terjadwal?', options: ['Agar sibuk', 'Karena file backup bisa korup/tidak lengkap — hanya uji restore yang membuktikan backup benar-benar bisa dipakai', 'Wajib vendor', 'Tidak perlu'], answer: 1, explain: '"Punya file backup" ≠ "bisa recovery". Banyak insiden gagal recovery karena backup tidak pernah diuji.' },
        { q: 'Kapan backup harus dibuat selain jadwal harian?', options: ['Tidak pernah', 'SEBELUM setiap perubahan (change) — agar ada jalan kembali bila change gagal', 'Hanya saat ingat', 'Setahun sekali'], answer: 1, explain: 'Pre-change backup = tiket pulang. Aturan 35.3: no backup, no change.' },
      ],
    },
    {
      id: '38.11',
      title: 'Change Log',
      body: `<p><b>Change log</b> mencatat <b>setiap perubahan</b>: apa, di mana, kapan, oleh siapa, mengapa, dan bagaimana cara kembali. Ini adalah <b>memori kolektif</b> tim — saat insiden terjadi jam 2 pagi, change log menjawab "apa yang berubah semalam?"</p>
<h3>Template Entri Change</h3>
<div class="tblwrap"><table>
<tr><th>Field</th><th>Contoh</th></tr>
<tr><td>ID / Tanggal</td><td>CHG-2026-1042 / 2026-10-13 22:00–23:00</td></tr>
<tr><td>Pelaksana</td><td>noc-admin (di-approve: lead-net)</td></tr>
<tr><td>Device & target</td><td>CHR-CORE-01 — tambah VLAN 40 (GUEST)</td></tr>
<tr><td>Alasan</td><td>Request gedung baru (tiket REQ-881)</td></tr>
<tr><td>Perubahan</td><td>/interface vlan add name=VLAN40-GUEST vlan-id=40 interface=ether2</td></tr>
<tr><td>Backup pre-change</td><td>CHR-CORE-01_20261013-2155.backup ✓</td></tr>
<tr><td>Verifikasi</td><td>VLAN 40 muncul di print; client tamu dapat DHCP ✓</td></tr>
<tr><td>Rollback plan</td><td>/interface vlan remove [find vlan-id=40]</td></tr>
<tr><td>Hasil</td><td>SUKSES</td></tr>
</table></div>
<h3>Aturan Change Management Ringkas</h3>
<ul>
<li><b>Tidak ada change tanpa tiket & approval</b> (kecuali emergency — yang tetap dicatat <i>setelahnya</i>).</li>
<li><b>Change window:</b> jam resmi perubahan (mis. 22:00–02:00) — di luar itu hanya emergency.</li>
<li><b>Verifikasi & rollback plan wajib</b> ditulis SEBELUM eksekusi, bukan sesudah.</li>
<li><b>Post-change review:</b> change gagal = blameless postmortem (38.12), bukan cari kambing hitam.</li>
</ul>`,
      terms: [
        ['Change log', 'Catatan setiap perubahan: apa, di mana, kapan, siapa, mengapa, rollback.'],
        ['Change window', 'Jadwal resmi kapan perubahan production boleh dilakukan.'],
        ['Rollback plan', 'Langkah kembali ke keadaan semula bila change gagal — ditulis sebelum eksekusi.'],
      ],
      scenario: 'Senin pagi: VLAN 20 lambat. Change log akhir pekan: CHG-2026-1041 "QoS tuning di SW-CORE-01" oleh teknisi X, verifikasi "OK". Tim membuka entri itu, me-review perubahan QoS, menemukan queue salah prioritas — rollback 10 menit. Tanpa change log: troubleshooting buta 4 jam.',
      bestPractices: 'Catat SEBELUM lupa (maksimal H+1). Kaitkan ke tiket. Review change log mingguan di tim — pola kegagalan terlihat dari sini.',
      security: 'Change log = jejak audit: siapa mengubah firewall kapan. Lindungi dari modifikasi (append-only ideal); review berkala untuk change tak terotorisasi.',
      challenge: 'Mulai change log untuk lab-mu hari ini: catat 3 perubahan terakhir yang kamu lakukan (dari ingatan) dengan template di atas. Rasakan bedanya: yang tidak tercatat = tidak terjadi (bagi tim).',
      interviewQ: 'Q: Mengapa rollback plan harus ditulis SEBELUM change dieksekusi? — A: Karena saat change gagal (sering tengah malam, dalam tekanan), manusia tidak berpikir jernih. Rencana yang ditulis saat tenang = eksekusi yang benar saat panik.',
      quiz: [
        { q: 'Field apa yang paling sering dilupakan di change log tapi paling penting saat gagal?', options: ['Nama pelaksana', 'Rollback plan — jalan kembali yang disiapkan sebelum eksekusi', 'Tanggal', 'ID tiket'], answer: 1, explain: 'Saat change gagal dalam tekanan, rollback plan yang sudah ditulis adalah penyelamat; tanpanya tim improvisasi dalam panik.' },
        { q: 'Bagaimana mencatat emergency change yang tidak sempat approval?', options: ['Tidak perlu dicatat', 'Tetap dicatat SETELAHNYA lengkap dengan alasan emergency — tidak ada change tanpa jejak', 'Rahasiakan', 'Hapus log'], answer: 1, explain: 'Emergency = alasan melewati prosedur, bukan alasan menghilangkan jejak. Post-hoc documentation wajib.' },
        { q: 'Apa itu blameless postmortem?', options: ['Tidak ada evaluasi', 'Evaluasi kegagalan yang fokus ke sistem/proses (mengapa bisa terjadi) bukan menyalahkan orang — agar orang berani lapor', 'Menyalahkan vendor', 'Rapat rahasia'], answer: 1, explain: 'Budaya menyalahkan membuat orang menyembunyikan kesalahan; blameless membuat kegagalan menjadi pelajaran sistem.' },
      ],
    },
    {
      id: '38.12',
      title: 'Troubleshooting Log',
      body: `<p><b>Troubleshooting log</b> mencatat <b>setiap insiden</b>: gejala, diagnosis, akar masalah, solusi, dan pelajaran. Bedanya dengan change log: change log = perubahan <i>terencana</i>; troubleshooting log = masalah <i>tak terduga</i> dan cara menaklukkannya. Ini adalah <b>bank pengetahuan</b> tim NOC.</p>
<h3>Template Entri Insiden</h3>
<div class="tblwrap"><table>
<tr><th>Field</th><th>Contoh</th></tr>
<tr><td>ID / Waktu</td><td>INC-2026-0771 / 2026-10-12 14:23 (deteksi) – 15:40 (pulih)</td></tr>
<tr><td>Gejala</td><td>User VLAN 20 tidak bisa akses server (VLAN 30); ping gateway OK</td></tr>
<tr><td>Dampak</td><td>120 user, 77 menit</td></tr>
<tr><td>Diagnosis</td><td>Traceroute berhenti di CHR; /ip firewall filter print → rule drop baru (CHG-2026-1039) memblokir forward 20→30</td></tr>
<tr><td>Akar masalah</td><td>Rule firewall terlalu luas (drop semua forward, bukan hanya yang dimaksud)</td></tr>
<tr><td>Solusi</td><td>Perbaiki rule menjadi spesifik; verifikasi ping 20→30 OK</td></tr>
<tr><td>Pelajaran</td><td>Review firewall rule butuh 2 orang; tambah validasi otomatis policy (35.11)</td></tr>
<tr><td>Tindak lanjut</td><td>Tiket FLW-112: buat validator firewall mingguan</td></tr>
</table></div>
<h3>Dari Log Menjadi Knowledge Base</h3>
<p>Troubleshooting log yang baik bisa di-<b>search</b>: insiden baru → cari gejala serupa → solusi lama sering langsung cocok (MTTR turun drastis). Pola yang muncul berulang = <b>masalah sistemik</b> yang butuh perbaikan permanen (bukan sekadar fix insiden).</p>
<div class="callout blue"><div class="t">Lima Dokumen, Satu Ekosistem</div><p style="margin:4px 0 0">Diagram (38.1–38.3) = peta. Tabel (38.4–38.8) = detail. Inventory (38.9) = aset. Backup (38.10) = penyelamat. <b>Change log + troubleshooting log = memori.</b> Engineer hebat bukan yang hafal semua — tapi yang membangun sistem agar tim tidak perlu menghafal.</p></div>`,
      terms: [
        ['Troubleshooting log', 'Catatan insiden: gejala, diagnosis, akar masalah, solusi, pelajaran.'],
        ['MTTR', 'Mean Time To Repair — rata-rata waktu pemulihan; knowledge base menurunkannya.'],
        ['Akar masalah (root cause)', 'Penyebab fundamental, bukan gejala — yang diperbaiki agar tidak terulang.'],
      ],
      scenario: 'Insiden "VLAN 20 tidak bisa ke server" terulang 6 bulan kemudian — dengan teknisi berbeda. Troubleshooting log: search "VLAN 20 server" → INC-2026-0771 muncul dengan diagnosis lengkap. Solusi diterapkan 15 menit (vs 77 menit dulu). Itulah ROI dokumentasi: pengetahuan tidak ikut resign bersama orangnya.',
      bestPractices: 'Tulis saat masih segar (maksimal H+1). Fokus ke root cause, bukan gejala. Tindak lanjut harus jadi tiket nyata — pelajaran tanpa aksi = arsip mati.',
      security: 'Log insiden bisa berisi info sensitif (IP, celah yang ditemukan) — akses internal tim. Sanitiasi sebelum dibagikan ke pihak luar.',
      challenge: 'Tulis troubleshooting log untuk 1 masalah terakhir yang kamu alami di lab (mis. CHR tidak bisa ping): ikuti template — gejala, diagnosis, akar masalah, solusi, pelajaran.',
      interviewQ: 'Q: Bagaimana troubleshooting log menurunkan MTTR? — A: Insiden berulang diselesaikan dari pengetahuan lama (search gejala → solusi terbukti) tanpa diagnosis dari nol; pola berulang mengungkap masalah sistemik untuk perbaikan permanen.',
      quiz: [
        { q: 'Apa beda change log dan troubleshooting log?', options: ['Sama saja', 'Change log = perubahan terencana (dengan approval & rollback plan); troubleshooting log = insiden tak terduga + diagnosis + pelajaran', 'Troubleshooting log untuk hardware saja', 'Change log tidak penting'], answer: 1, explain: 'Keduanya "memori tim" dari dua sisi: yang direncanakan dan yang mengejutkan. Insiden sering bermula dari change — keduanya cross-reference.' },
        { q: 'Mengapa root cause (bukan gejala) yang wajib dicatat?', options: ['Agar panjang', 'Karena memperbaiki gejala tanpa root cause = insiden akan terulang; root cause mengarah ke perbaikan permanen', 'Formalitas', 'Tidak penting'], answer: 1, explain: 'Gejala = "tidak bisa akses"; root cause = "rule firewall terlalu luas". Hanya yang kedua mencegah pengulangan.' },
        { q: 'Apa tindak lanjut yang benar dari pelajaran di troubleshooting log?', options: ['Disimpan saja', 'Menjadi tiket aksi nyata (mis. buat validator) — pelajaran tanpa aksi = arsip mati', 'Dihapus', 'Diperingatkan lisan'], answer: 1, explain: 'Loop tertutup: insiden → pelajaran → tiket perbaikan sistem → verifikasi. Tanpa ini, log hanya kuburan pengetahuan.' },
      ],
    },
  ],
};
