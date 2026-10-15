import type { Part } from './types';

export const part27: Part = {
  id: '27',
  number: 'PART 27',
  title: 'Zabbix + Grafana',
  phaseId: 'fase-5',
  description: 'Integrasi Zabbix sebagai datasource Grafana: membangun dashboard network traffic, router health, firewall, availability, dan capacity planning yang siap pakai di NOC.',
  repoFolder: 'part-27-zabbix-grafana',
  objectives: [
    'Mengintegrasikan Zabbix sebagai datasource Grafana via plugin dan API.',
    'Mengimpor dan menyesuaikan dashboard komunitas untuk kebutuhan jaringan.',
    'Membangun dashboard kustom: network traffic, router health, dan firewall.',
    'Membuat dashboard availability/SLA dan capacity planning untuk manajemen.',
    'Menerapkan praktik dashboard-as-code (JSON export) untuk versioning.',
  ],
  prerequisites: 'Part 23–26.',
  subbabs: [
    {
      id: '27.1',
      title: 'Integrasi Zabbix',
      body: `<p><b>Integrasi Zabbix + Grafana</b> menyambungkan "dapur data" (Zabbix) ke "restoran visual" (Grafana). Hasilnya: dashboard yang membaca metrik Zabbix secara real-time via API — tanpa duplikasi data.</p>
<h3>Arsitektur Integrasi (Alur Data Lengkap)</h3>
<pre>[R1 192.168.99.1 / FW1 192.168.99.2]
   │ SNMP (UDP 161) — dikumpulkan Zabbix
   ▼
[Zabbix Server 192.168.99.10] ──▶ [Database Zabbix]
                                          │ JSON-RPC API
                                          │ (dibaca plugin Grafana)
                                          ▼
                                   [Grafana 192.168.99.20]
                                          │ render
                                          ▼
                                   [Browser NOC / TV dinding]

ALASAN IP terpisah (.20): Grafana di host/VM sendiri agar beban query dashboard
tidak mengganggu polling Zabbix — prinsip pemisahan fungsi (23.3).</pre>
<h3>Langkah Integrasi (ringkasan 26.3 + praktik)</h3>
<pre>1. Install Grafana di 192.168.99.20 (VM/container terpisah)
2. grafana-cli plugins install alexanderzobnin-zabbix-app && systemctl restart grafana-server
3. Di Zabbix: buat user "grafana-reader" (role read-only) — ALASAN: least privilege
4. Di Grafana: Add data source → Zabbix →
   URL: http://192.168.99.10/zabbix/api_jsonrpc.php
   user grafana-reader → Save & Test → "Success"
5. Verifikasi: buat panel test → pilih host R1-Jakarta → item CPU → tampil grafik
   Expected: garis CPU muncul = integrasi VALID end-to-end</pre>
<h3>Troubleshooting Integrasi</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Penyebab Umum</th><th>Solusi</th></tr>
<tr><td>"Test failed"</td><td>URL salah / Zabbix tidak bisa dijangkau</td><td>Cek URL api_jsonrpc.php; ping/telnet 80 dari Grafana</td></tr>
<tr><td>Login gagal</td><td>User salah / bukan read-only yang cukup</td><td>Test login manual di web Zabbix dengan user itu</td></tr>
<tr><td>Panel kosong</td><td>Item tidak ada / time range salah</td><td>Pilih item yang pasti ada datanya; perlebar time range</td></tr>
<tr><td>Lambat</td><td>Query terlalu berat</td><td>Kecilkan range, kurangi panel, naikkan interval refresh</td></tr>
</table></div>`,
      terms: [
        ['Integrasi Zabbix-Grafana', 'Zabbix sebagai datasource Grafana via plugin + JSON-RPC API.'],
        ['grafana-reader', 'Akun Zabbix read-only khusus untuk datasource Grafana.'],
        ['api_jsonrpc.php', 'Endpoint API Zabbix yang dibaca plugin Grafana.'],
      ],
      scenario: 'Tim memasang Grafana satu VM dengan Zabbix untuk "hemat". Saat dashboard NOC dibuka 10 orang bersamaan, polling Zabbix tersendat — data telat 5 menit. Setelah Grafana dipindah ke VM sendiri (.20), keduanya stabil. Pelajaran: hemat yang salah tempat = masalah di dua sistem.',
      bestPractices: 'Dokumentasikan versi plugin Zabbix-Grafana yang dipakai — update plugin kadang butuh penyesuaian dashboard.',
      security: 'Batasi firewall: Grafana (.20) hanya boleh ke API Zabbix (.10); tidak perlu akses ke device jaringan langsung.',
      challenge: 'Lakukan integrasi di lab-mu mengikuti 5 langkah di atas. Catat waktu tiap langkah dan kendala yang kamu temui (jika ada).',
      interviewQ: 'Q: "Jelaskan alur data dari router sampai tampil di dashboard Grafana." — A: Router → SNMP → Zabbix server polling → database Zabbix → JSON-RPC API → plugin Grafana membaca → Grafana server memformat → browser me-render panel.',
      quiz: [
        {
          q: 'Grafana membaca data Zabbix melalui…',
          options: [
            'Kabel langsung ke router',
            'Plugin Zabbix via JSON-RPC API (api_jsonrpc.php)',
            'Email',
            'Bluetooth',
          ],
          answer: 1,
          explain: 'Plugin menerjemahkan query Grafana menjadi panggilan API Zabbix.',
        },
        {
          q: 'Mengapa Grafana disarankan di host/VM terpisah dari Zabbix?',
          options: [
            'Agar terlihat profesional',
            'Beban query dashboard tidak mengganggu polling Zabbix — pemisahan fungsi',
            'Wajib lisensi',
            'Agar lebih lambat',
          ],
          answer: 1,
          explain: 'Query dashboard yang berat bisa menyendat polling jika satu mesin.',
        },
        {
          q: 'Akun Zabbix untuk integrasi Grafana harus…',
          options: [
            'Akun Admin',
            'Akun khusus read-only (grafana-reader) — least privilege',
            'Tanpa password',
            'Akun bersama tim',
          ],
          answer: 1,
          explain: 'Grafana hanya membaca; hak lebih = risiko keamanan yang tidak perlu.',
        },
      ],
    },
    {
      id: '27.2',
      title: 'Datasource',
      body: `<p>Pendalaman konfigurasi datasource Zabbix di Grafana: opsi lanjutan yang menentukan <b>keamanan, performa, dan keandalan</b> koneksi — bukan sekadar "Save & Test berhasil".</p>
<h3>Opsi Penting</h3>
<div class="tblwrap"><table>
<tr><th>Opsi</th><th>Rekomendasi</th><th>Alasan</th></tr>
<tr><td><b>URL</b></td><td><code>http://192.168.99.10/zabbix/api_jsonrpc.php</code></td><td>Endpoint API yang tepat; HTTPS di production</td></tr>
<tr><td><b>Auth</b></td><td>Username + password (basic)</td><td>Token API Zabbix 7.x juga didukung — lebih aman dari password</td></tr>
<tr><td><b>Cache</b></td><td>Aktifkan (default plugin)</td><td>Mengurangi query berulang ke API untuk panel yang sama</td></tr>
<tr><td><b>Timeout</b></td><td>30–60 detik</td><td>Query rentang panjang butuh waktu; timeout pendek = panel gagal</td></tr>
<tr><td><b>Trends</b></td><td>Aktifkan "use trends"</td><td>Untuk rentang &gt;7 hari, baca tabel trends (jauh lebih cepat!)</td></tr>
</table></div>
<h3>Trends vs History di Query Grafana</h3>
<pre>Rentang dashboard 24 jam   → baca HISTORY (detail per menit)  → akurat & cepat
Rentang dashboard 90 hari  → baca TRENDS (agregat per jam)    → 100x lebih ringan

ALASAN: plugin otomatis memilih berdasar rentang JIKA "use trends" aktif.
Tanpa ini, dashboard 1 tahun = query jutaan baris = timeout/panel kosong.

Verifikasi: buat panel dengan range "Last 90 days" → inspect query (Query inspector)
→ pastikan ia membaca trends, bukan history.</pre>
<h3>Multi-Datasource (Persiapan Dashboard Lintas-Sumber)</h3>
<p>Tambahkan datasource kedua untuk latihan: <b>TestData</b> atau <b>MySQL</b> berisi data dummy billing. Tujuannya: dashboard 27.9 akan menggabungkan "traffic (Zabbix)" vs "tagihan ISP (SQL)" dalam 1 layar — inilah nilai unik Grafana.</p>
<div class="callout"><div class="t">Token API vs Password</div><p style="margin:4px 0 0">Zabbix 6.4+ mendukung <b>API token</b> (Users → API tokens) — lebih aman dari password karena bisa di-revoke per token dan diberi masa berlaku. Untuk integrasi production, pakai token, bukan password user.</p></div>`,
      terms: [
        ['API token', 'Kredensial API Zabbix yang bisa di-revoke per token — lebih aman dari password.'],
        ['Use trends', 'Opsi plugin: baca tabel agregat untuk rentang panjang.'],
        ['Query inspector', 'Fitur Grafana melihat query mentah & waktu eksekusi per panel.'],
      ],
      scenario: 'Dashboard "Tren Tahunan" selalu timeout. Query inspector menunjukkan ia membaca history (jutaan baris) untuk 365 hari. Setelah "use trends" diaktifkan, loading turun dari 60 detik menjadi 3 detik — data agregat per jam sudah cukup untuk tren tahunan.',
      bestPractices: 'Untuk dashboard eksekutif (rentang bulanan/tahunan), SELALU pastikan memakai trends — detail per menit tidak terlihat di skala itu anyway.',
      security: 'Gunakan API token dengan masa berlaku untuk integrasi; catat tanggal expired-nya agar tidak tiba-tiba putus.',
      challenge: 'Bandingkan waktu loading panel "traffic 7 hari" vs "traffic 90 hari" di lab-mu (lihat Query inspector). Berapa detik masing-masing? Apakah trends aktif untuk yang 90 hari?',
      interviewQ: 'Q: "Dashboard rentang 1 tahun timeout — apa solusinya?" — A: Pastikan plugin memakai trends (agregat per jam) bukan history untuk rentang panjang; kecilkan jumlah panel; naikkan timeout datasource.',
      quiz: [
        {
          q: 'Opsi "use trends" pada datasource Zabbix berfungsi untuk…',
          options: [
            'Menghapus data lama',
            'Rentang panjang membaca tabel agregat per jam — jauh lebih cepat dari history',
            'Mengganti tema',
            'Menambah user',
          ],
          answer: 1,
          explain: 'Trends 100x lebih ringan; cocok untuk dashboard bulanan/tahunan.',
        },
        {
          q: 'Untuk integrasi production, kredensial yang lebih aman adalah…',
          options: [
            'Password Admin',
            'API token — bisa di-revoke per token dan diberi masa berlaku',
            'Tanpa autentikasi',
            'Password yang sama untuk semua',
          ],
          answer: 1,
          explain: 'Token = least privilege + revocable + expirable; password user = akses penuh akun.',
        },
        {
          q: 'Query inspector berguna untuk…',
          options: [
            'Melihat password',
            'Melihat query mentah & waktu eksekusi — diagnosis panel lambat/kosong',
            'Menghapus dashboard',
            'Menambah panel',
          ],
          answer: 1,
          explain: 'Inspector membuktikan apa yang sebenarnya dikirim ke datasource dan berapa lama.',
        },
      ],
    },
    {
      id: '27.3',
      title: 'Import Dashboard',
      body: `<p>Komunitas Grafana menyediakan <b>ribuan dashboard siap pakai</b> (grafana.com/dashboards) — termasuk untuk Zabbix + network. Mengimpor jauh lebih cepat daripada membuat dari nol, lalu sesuaikan dengan lingkunganmu.</p>
<h3>Cara Import</h3>
<pre>1. Buka grafana.com/dashboards → cari "zabbix network" / "mikrotik" / "snmp"
   ALASAN cari yang spesifik: dashboard generik perlu banyak penyesuaian
2. Catat Dashboard ID (mis. 12345) atau unduh file JSON-nya
3. Di Grafana: Dashboards → New → Import →
   - Masukkan ID → Load, ATAU upload file JSON
   - Pilih datasource Zabbix-mu saat diminta (mapping!)
   ALASAN mapping: dashboard impor merujuk nama datasource pembuatnya —
   harus dipetakan ke datasource-MU agar query jalan
4. Import → dashboard muncul → JANGAN langsung pakai untuk NOC:
   sesuaikan dulu (langkah di bawah)</pre>
<h3>Penyesuaian Wajib Setelah Import</h3>
<div class="tblwrap"><table>
<tr><th>Cek</th><th>Alasan</th></tr>
<tr><td>Nama host/item sesuai?</td><td>Dashboard pembuat memakai nama host berbeda — petakan via variabel</td></tr>
<tr><td>Satuan benar? (bps vs Bps)</td><td>Salah satuan = salah baca 8x (26.5)</td></tr>
<tr><td>Threshold sesuai kebijakanmu?</td><td>Ambang pembuat mungkin tidak cocok untuk SLA-mu</td></tr>
<tr><td>Ada panel yang tidak relevan?</td><td>Hapus — dashboard ramping = cepat & jelas</td></tr>
<tr><td>Refresh interval wajar?</td><td>Impor sering memakai 5s — naikkan ke 30s (26.4)</td></tr>
</table></div>
<div class="callout"><div class="t">Dashboard Impor = Titik Awal, Bukan Produk Jadi</div><p style="margin:4px 0 0">Tidak ada dashboard komunitas yang 100% cocok dengan lingkunganmu (nama host, ambang, kebutuhan). Impor menghemat 70% kerja — 30% sisanya adalah penyesuaian yang menentukan apakah ia berguna.</p></div>`,
      terms: [
        ['Dashboard ID', 'Nomor unik dashboard komunitas di grafana.com/dashboards.'],
        ['Datasource mapping', 'Pemetaan datasource dashboard impor ke datasource lokal saat import.'],
      ],
      scenario: 'Engineer mengimpor dashboard "MikroTik full" dan langsung menampilkannya di TV NOC. Seminggu kemudian ketahuan: separuh panel kosong (nama item beda), satuan salah (MBps dibaca sebagai Mbps), dan refresh 5 detik membebani Zabbix. Setelah 2 jam penyesuaian, dashboard itu menjadi andalan — pelajarannya: impor ≠ selesai.',
      bestPractices: 'Simpan file JSON dashboard impor yang ASLI sebelum diubah — jika penyesuaianmu merusak, kamu bisa import ulang.',
      security: 'Periksa dashboard impor sebelum dipakai: pastikan tidak ada panel yang mengquery data sensitif yang tidak seharusnya tampil di TV NOC.',
      challenge: 'Impor satu dashboard Zabbix-network dari grafana.com ke lab-mu. Dokumentasikan: berapa panel yang langsung jalan, berapa yang perlu diperbaiki, dan apa saja perbaikannya?',
      interviewQ: 'Q: "Apa yang harus dicek setelah mengimpor dashboard komunitas?" — A: Mapping datasource, kesesuaian nama host/item, kebenaran satuan, threshold sesuai kebijakan, hapus panel tak relevan, dan wajarkan refresh interval.',
      quiz: [
        {
          q: 'Saat import dashboard, langkah "pilih datasource" (mapping) bertujuan…',
          options: [
            'Mempercepat import',
            'Memetakan datasource pembuat dashboard ke datasource lokal agar query berjalan',
            'Mengganti password',
            'Wajib pajak',
          ],
          answer: 1,
          explain: 'Dashboard impor merujuk nama datasource asing; tanpa mapping, semua query gagal.',
        },
        {
          q: 'Dashboard impor sebaiknya diperlakukan sebagai…',
          options: [
            'Produk jadi siap pakai',
            'Titik awal (hemat 70% kerja) — 30% penyesuaian menentukan kegunaannya',
            'Sampah',
            'Pengganti dokumentasi',
          ],
          answer: 1,
          explain: 'Lingkungan tiap orang berbeda (nama, ambang, kebutuhan) — penyesuaian wajib.',
        },
        {
          q: 'Sebelum mengubah dashboard impor, sebaiknya…',
          options: [
            'Langsung ubah',
            'Simpan file JSON aslinya — cadangan jika penyesuaian merusak',
            'Hapus dulu',
            'Share ke publik',
          ],
          answer: 1,
          explain: 'Backup memungkinkan rollback cepat ke versi impor yang bersih.',
        },
      ],
    },
    {
      id: '27.4',
      title: 'Create Custom Dashboard',
      body: `<p>Sekarang bangun dashboard kustom dari nol — <b>"Network Health"</b> — memakai pola terbaik Part 26: variabel, panel tepat guna, dan hierarki piramida.</p>
<h3>Objective</h3>
<p>Dashboard "Network Health" dengan variabel $device, 6 panel, siap untuk TV NOC.</p>
<h3>Configuration (langkah)</h3>
<pre>1. Buat dashboard baru → Settings → Variables:
   - $device: query Zabbix "hosts in group Routers+Firewalls"
     ALASAN: satu dashboard untuk R1 dan FW1 (ganti dropdown)
2. Baris 1 — STATUS (5 detik rule):
   - Panel Stat: "Availability $device" → icmpping (value mapping 1=UP hijau)
   - Panel Gauge: "CPU $device" → 0-100, threshold 70/90
   - Panel Gauge: "Memory $device" → 0-100, threshold 80/90
3. Baris 2 — KONTEKS:
   - Panel Time series: "Traffic $device" → in/out bps (2 deret, warna hijau/biru)
   - Panel Stat: "Active sessions" (hanya bermakna untuk FW1 — pakai repeat?)
4. Baris 3 — DETAIL:
   - Panel Alert list: problems untuk $device (severity ≥ Warning)
5. Atur: time range "Last 6h", refresh "30s", judul tiap panel bermakna
   ALASAN 30s: cukup segar untuk NOC, tidak membebani API (26.4)
6. Save ke folder "NOC" dengan deskripsi yang jelas</pre>
<h3>Verification</h3>
<pre># Uji 5-detik rule: minta rekan melihat dashboard 10 detik → tanya "ada masalah?"
# Uji variabel: ganti $device R1 → FW1 → semua panel ikut berubah?
# Uji respons: picu beban/CPU buatan → gauge CPU bergerak dalam ≤1 menit?
# Expected: ketiga uji lolos. Jika tidak → revisi (itulah desain iteratif).</pre>
<div class="callout blue"><div class="t">Dashboard-as-Code</div><p style="margin:4px 0 0">Setiap dashboard bisa di-<b>export sebagai JSON</b> (Settings → JSON Model → copy). Simpan JSON ini di Git — inilah <b>versioning dashboard</b>: perubahan terlacak, bisa di-review, bisa di-restore. Praktik ini dibahas sebagai pola di 27.9.</p></div>`,
      terms: [
        ['Dashboard-as-code', 'Menyimpan definisi dashboard (JSON) di version control.'],
        ['JSON Model', 'Representasi JSON dari dashboard Grafana — bisa di-export/import.'],
        ['Panel repeat', 'Fitur menggandakan panel otomatis per nilai variabel.'],
      ],
      scenario: 'Dashboard NOC "hilang" setelah seseorang salah edit dan save. Tanpa backup, dibuat ulang 3 jam. Setelah pola dashboard-as-code (JSON di Git), insiden berikutnya: git revert 2 menit. Pelajaran: dashboard adalah kode — perlakukan seperti kode.',
      bestPractices: 'Setiap dashboard production: export JSON → commit ke Git dengan pesan yang jelas. Jadikan bagian dari change management.',
      security: 'JSON dashboard bisa berisi nama host/IP internal — perlakukan repo-nya sebagai internal, bukan publik, kecuali sudah disanitasi.',
      challenge: 'Bangun dashboard "Network Health" di lab-mu mengikuti 6 langkah di atas. Export JSON-nya dan simpan — ini artefak portfolio pertamamu untuk Part 27.',
      interviewQ: 'Q: "Apa itu dashboard-as-code dan mengapa penting?" — A: Menyimpan definisi dashboard (JSON) di Git: perubahan terlacak, bisa di-review dan di-restore via revert — dashboard diperlakukan seperti kode aplikasi.',
      quiz: [
        {
          q: 'Dashboard-as-code berarti…',
          options: [
            'Menulis dashboard dengan Python saja',
            'Menyimpan definisi dashboard (JSON) di version control — terlacak, bisa di-review & restore',
            'Dashboard tanpa UI',
            'Membeli lisensi',
          ],
          answer: 1,
          explain: 'JSON di Git = change management untuk dashboard, sama seperti kode.',
        },
        {
          q: 'Struktur piramida dashboard yang dibangun adalah…',
          options: [
            'Detail dulu baru status',
            'Status (baris 1) → konteks (baris 2) → detail/problems (baris 3)',
            'Acak',
            'Satu baris saja',
          ],
          answer: 1,
          explain: 'Hierarki atas→bawah mengikuti cara mata membaca dan prioritas informasi.',
        },
        {
          q: 'Variabel $device pada dashboard ini memungkinkan…',
          options: [
            'Menambah user',
            'Satu dashboard melayani R1 dan FW1 — ganti dropdown, semua panel ikut',
            'Menghapus data',
            'Mempercepat internet',
          ],
          answer: 1,
          explain: 'Parameterisasi = tanpa duplikasi dashboard per device.',
        },
      ],
    },
    {
      id: '27.5',
      title: 'Network Traffic Dashboard',
      body: `<p>Dashboard <b>Network Traffic</b>: fokus tunggal pada throughput - "berapa banyak data mengalir, di mana, dan apakah mendekati batas". Ini dashboard yang paling sering dibuka saat user lapor "lambat".</p>
<h3>Panel-panel Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Jenis</th><th>Query (Zabbix)</th></tr>
<tr><td>WAN In/Out sekarang</td><td>Stat</td><td>last() traffic ether1/wan1</td></tr>
<tr><td>Grafik WAN 24 jam</td><td>Time series</td><td>in/out bps, mean() per 5m</td></tr>
<tr><td>Utilisasi WAN</td><td>Gauge 0-100%</td><td>calculated: traffic / {$WAN_MAX} x 100</td></tr>
<tr><td>Top 5 interface tersibuk</td><td>Table</td><td>semua interface + transform sort desc limit 5</td></tr>
<tr><td>Heatmap jam sibuk 30 hari</td><td>Heatmap</td><td>traffic per jam - pola kapasitas</td></tr>
</table></div>
<h3>Teknik: Calculated di Grafana</h3>
<pre>Untuk utilisasi, dua opsi:
a) Buat calculated item di ZABBIX (sekali, dipakai semua dashboard) - RECOMMENDED
   ALASAN: logika di satu tempat (Zabbix), Grafana tinggal tampilkan
b) Expression di Grafana ($A / $WAN_MAX * 100)
   ALASAN b: cepat untuk eksperimen, tapi hanya berlaku di dashboard itu

Aturan: metrik yang dipakai BANYAK dashboard -> definisikan di Zabbix;
eksperimen sekali pakai -> boleh di Grafana.</pre>
<h3>Verification</h3>
<p>Bandingkan angka panel "WAN sekarang" dengan: (1) grafik Zabbix untuk item yang sama, (2) speedtest sesaat. Ketiganya harus konsisten (toleransi satuan!). Jika beda, cek agregasi dan satuan.</p>
<div class="callout"><div class="t">Satu Angka, Tiga Sumber</div><p style="margin:4px 0 0">Validasi silang (Grafana vs Zabbix vs speedtest) adalah cara tercepat menangkap kesalahan satuan/agregasi - lakukan tiap membuat dashboard traffic baru.</p></div>`,
      terms: [
        ['Top talkers', 'Daftar interface/host dengan traffic tertinggi.'],
        ['Validasi silang', 'Membandingkan satu metrik dari beberapa sumber untuk memastikan benar.'],
      ],
      scenario: 'User VIP lapor "internet lambat". NOC buka dashboard traffic: WAN 95%, top talkers menunjukkan 1 IP office menyedot 600 Mbps (backup pribadi ke cloud). IP dihubungi, backup dihentikan - keluhan selesai 10 menit tanpa menyentuh router. Dashboard yang tepat = troubleshooting tanpa CLI.',
      bestPractices: 'Sediakan panel top-talkers di dashboard traffic - 80% kasus "lambat" terjawab oleh "siapa yang menyedot bandwidth".',
      security: 'Top talkers menampilkan IP internal - batasi akses dashboard ini untuk tim yang berhak.',
      challenge: 'Buat dashboard traffic minimal (3 panel) di lab-mu dan lakukan validasi silang 3 sumber. Dokumentasikan hasilnya.',
      interviewQ: 'Q: "User lapor lambat - apa yang kamu lihat pertama di dashboard traffic?" - A: Utilisasi WAN (penuh atau tidak), lalu top talkers (siapa yang menyedot), lalu pola waktu (tiba-tiba atau pola rutin) - tiga panel menjawab 80% kasus.',
      quiz: [
        {
          q: 'Panel "top talkers" menjawab pertanyaan...',
          options: [
            'Berapa harga bandwidth',
            '"Siapa yang menyedot bandwidth?" - 80% kasus lambat terjawab di sini',
            'Siapa yang login',
            'Kapan maintenance',
          ],
          answer: 1,
          explain: 'Identifikasi konsumen terbesar = langkah pertama troubleshooting keluhan lambat.',
        },
        {
          q: 'Metrik utilisasi yang dipakai banyak dashboard sebaiknya didefinisikan di...',
          options: [
            'Tiap dashboard Grafana satu per satu',
            'Zabbix sebagai calculated item - satu definisi untuk semua konsumen',
            'Diingat-ingat',
            'Spreadsheet',
          ],
          answer: 1,
          explain: 'Single source of truth di Zabbix; Grafana hanya menampilkan.',
        },
        {
          q: 'Validasi silang dashboard traffic memakai...',
          options: [
            'Perasaan',
            'Grafana vs grafik Zabbix vs speedtest - ketiganya harus konsisten',
            'Satu sumber cukup',
            'Menebak',
          ],
          answer: 1,
          explain: 'Tiga sumber independen menangkap kesalahan satuan/agregasi dengan cepat.',
        },
      ],
    },
    {
      id: '27.6',
      title: 'Router Health Dashboard',
      body: `<p>Dashboard <b>Router Health</b>: "apakah router-router kita sehat?" - CPU, memory, uptime, error interface, dan status - dalam satu layar untuk semua router (variabel $router).</p>
<h3>Panel-panel Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Jenis</th><th>Fungsi</th></tr>
<tr><td>Status $router</td><td>Stat + value mapping</td><td>UP/DOWN sekilas</td></tr>
<tr><td>Uptime</td><td>Stat</td><td>"42 hari" - uptime pendek = baru reboot = investigasi</td></tr>
<tr><td>CPU dan Memory</td><td>Time series 24j</td><td>Tren - korelasikan keduanya</td></tr>
<tr><td>Interface errors</td><td>Time series</td><td>Error/discard per interface - masalah fisik</td></tr>
<tr><td>Ping latency dan loss</td><td>Time series</td><td>Kualitas jalur ke router</td></tr>
<tr><td>Problems</td><td>Alert list</td><td>Masalah aktif router ini</td></tr>
</table></div>
<h3>Membaca "Kesehatan" Sekilas</h3>
<pre>Router SEHAT : uptime panjang + CPU/memory stabil + error 0 + loss 0%
Router SAKIT : uptime PENDEK (baru reboot!) + CPU spike + error naik
Router ANEH  : semua hijau tapi traffic NOL di jam kerja = "hidup tapi tak bekerja"

ALASAN uptime penting: router yang reboot sendiri semalam tanpa sepengetahuan
adalah temuan - bisa jadi power issue, crash, atau seseorang me-reboot tanpa izin.</pre>
<h3>Verification</h3>
<p>Reboot R1 di lab (terjadwal!) lalu amati dashboard: uptime reset ke 0, status sempat DOWN lalu UP, problems mencatatnya. Ini sekaligus menguji rantai monitoring-mu.</p>
<div class="callout"><div class="t">Uptime Pendek = Cerita</div><p style="margin:4px 0 0">Setiap reboot yang tidak terjadwal adalah insiden mini yang harus bisa dijelaskan. Dashboard health membuat "reboot misterius" langsung terlihat - bukan ketahuan bulan depan saat audit.</p></div>`,
      terms: [
        ['Uptime', 'Lama device hidup sejak boot terakhir - indikator stabilitas.'],
        ['Interface errors', 'Counter error/discard - indikator masalah fisik Layer 1/2.'],
      ],
      scenario: 'Audit menemukan router cabang reboot 11 kali dalam sebulan - tidak ada yang sadar karena "hanya sebentar". Grafik uptime Zabbix membuktikannya; penyebab: UPS rusak. Tanpa monitoring uptime, instabilitas kronis tidak pernah terlihat.',
      bestPractices: 'Buat alert "uptime < 24 jam" (device baru reboot) - setiap reboot tak terjadwal harus bisa dijelaskan.',
      security: 'Reboot tak terjadwal bisa berarti kompromi (penyerang me-reboot setelah memasang persistence) - korelasikan dengan log.',
      challenge: 'Cek uptime semua device di lab-mu sekarang. Adakah yang reboot tanpa kamu sadari? Cari tahu penyebabnya.',
      interviewQ: 'Q: "Mengapa uptime dipantau, bukan hanya up/down saat ini?" - A: Uptime pendek = device baru reboot = peristiwa yang harus dijelaskan (power, crash, atau tindakan tak resmi). Status "up" saat ini tidak menceritakan itu.',
      quiz: [
        {
          q: 'Router dengan uptime 2 jam padahal tidak ada maintenance terjadwal mengindikasikan...',
          options: [
            'Kondisi ideal',
            'Reboot tak terjadwal - investigasi: power issue, crash, atau tindakan tak resmi',
            'Hemat listrik',
            'Normal',
          ],
          answer: 1,
          explain: 'Setiap reboot tak terjadwal adalah peristiwa yang harus bisa dijelaskan.',
        },
        {
          q: 'Kombinasi "semua hijau tapi traffic NOL di jam kerja" berarti...',
          options: [
            'Sempurna',
            '"Hidup tapi tak bekerja" - butuh investigasi fungsi, bukan sekadar status',
            'Hari libur pasti',
            'Abaikan',
          ],
          answer: 1,
          explain: 'Status hijau tidak menjamin fungsi; traffic nol di jam kerja = anomali.',
        },
        {
          q: 'Interface errors yang naik bersamaan dengan keluhan lambat mengarah ke...',
          options: [
            'Masalah kapasitas - tambah bandwidth',
            'Masalah fisik Layer 1/2 (kabel, SFP, duplex) - bukan murni kapasitas',
            'Virus',
            'Salah dashboard',
          ],
          answer: 1,
          explain: 'Error = frame rusak di fisik/data-link; kapasitas murni tidak menaikkan error.',
        },
      ],
    },
    {
      id: '27.7',
      title: 'Firewall Dashboard',
      body: `<p>Dashboard <b>Firewall</b>: "apakah perimeter kita aman dan berfungsi?" - session, CPU/memory, traffic per zona, dan tripwire anomali - dengan variabel $firewall.</p>
<h3>Panel-panel Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Jenis</th><th>Fungsi</th></tr>
<tr><td>Active sessions</td><td>Stat + gauge vs kapasitas</td><td>Detak jantung firewall (25.6)</td></tr>
<tr><td>Session trend 24j</td><td>Time series</td><td>Pola vs spike (serangan)</td></tr>
<tr><td>CPU / Memory</td><td>Gauge</td><td>Beban inspeksi + risiko conserve mode</td></tr>
<tr><td>Traffic per zona</td><td>Time series (3 deret)</td><td>wan/lan/dmz - baca per zona (25.7)</td></tr>
<tr><td>DMZ outbound</td><td>Stat + threshold</td><td>Tripwire exfiltrasi - merah jika anomali</td></tr>
<tr><td>Problems</td><td>Alert list</td><td>Masalah aktif firewall ini</td></tr>
</table></div>
<h3>Panel "Security Posture" (Nilai Tambah)</h3>
<p>Tambahkan panel khusus keamanan yang tidak ada di dashboard router:</p>
<pre>- "Conserve mode risk": gauge memory dengan threshold MERAH di 85%
  ALASAN: di atas itu proteksi dikorbankan (25.5)
- "Session vs capacity": stat "412rb / 1,3jt (32%)"
  ALASAN: persentase kapasitas = bahasa manajemen ("masih aman" vs angka mentah)
- "Top denied": jika ada data log (via Loki/datasource log) - IP paling sering di-deny
  ALASAN: menunjukkan firewall BEKERJA (memblokir), bukan sekadar diam</pre>
<h3>Verification</h3>
<p>Picu spike session buatan di lab (buka banyak koneksi cepat) - amati: stat session naik, trend menunjukkan spike, gauge bergerak. Bandingkan dengan angka CLI (diagnose sys session stat).</p>
<div class="callout"><div class="t">Dashboard untuk SOC</div><p style="margin:4px 0 0">Dashboard firewall melayani DUA tim: NOC (apakah jalan?) dan SOC (apakah aman?). Panel tripwire dan "top denied" adalah bahasa SOC - libatkan mereka saat mendesain.</p></div>`,
      terms: [
        ['Security posture', 'Gambaran tingkat keamanan/risiko dalam satu tampilan.'],
        ['Top denied', 'Daftar sumber yang paling sering diblokir firewall.'],
      ],
      scenario: 'SOC membuka dashboard firewall tiap pagi: session normal, DMZ outbound hijau, top denied menunjukkan 1 IP asing diblokir 50rb kali semalam (scan otomatis yang gagal). Tanpa dashboard ini, upaya serangan itu tidak terlihat - "tidak ada insiden" bukan berarti "tidak ada serangan".',
      bestPractices: 'Libatkan tim SOC dalam review dashboard firewall tiap kuartal - kebutuhan mereka (threat intel) berbeda dari NOC (ketersediaan).',
      security: 'Dashboard firewall JANGAN di-share ke link publik - ia membeberkan postur keamanan (kapasitas, pola, zona).',
      challenge: 'Tambahkan panel "Session vs capacity %" ke dashboard firewall lab-mu. Berapa % kapasitas FW1-mu saat jam sibuk?',
      interviewQ: 'Q: "Apa beda dashboard firewall vs dashboard router?" - A: Router fokus ketersediaan dan kapasitas; firewall tambah dimensi keamanan: session, tripwire anomali per zona, risiko conserve mode, dan panel untuk SOC (top denied).',
      quiz: [
        {
          q: 'Panel "DMZ outbound" dengan threshold merah berfungsi sebagai...',
          options: [
            'Hiasan',
            'Tripwire exfiltrasi - server DMZ seharusnya tidak upload besar misterius',
            'Pengukur suhu',
            'Jam',
          ],
          answer: 1,
          explain: 'Anomali outbound DMZ = pola klasik kompromi server publik.',
        },
        {
          q: 'Menampilkan session sebagai persentase kapasitas ("32%") berguna karena...',
          options: [
            'Terlihat canggih',
            'Bahasa manajemen: "masih aman" vs angka mentah yang butuh konteks datasheet',
            'Wajib Grafana',
            'Lebih cepat',
          ],
          answer: 1,
          explain: 'Persentase memberi makna langsung tanpa perlu tahu kapasitas model.',
        },
        {
          q: 'Dashboard firewall sebaiknya tidak di-share publik karena...',
          options: [
            'Grafana melarang',
            'Membeberkan postur keamanan: kapasitas, pola traffic, dan zona',
            'Terlalu besar',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Informasi keamanan = intelijen untuk penyerang; batasi akses internal berhak.',
        },
      ],
    },
    {
      id: '27.8',
      title: 'Availability Dashboard',
      body: `<p>Dashboard <b>Availability</b>: bahasa bisnis monitoring - "berapa persen layanan kita hidup?" - untuk manajemen dan laporan SLA. Data dari trigger Zabbix (23.16), divisualkan di Grafana agar bisa digabung dengan data lain.</p>
<h3>Panel-panel Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Jenis</th><th>Sumber</th></tr>
<tr><td>Internet availability (bulan ini)</td><td>Stat besar % + threshold</td><td>Trigger "R1 unreachable" (Zabbix)</td></tr>
<tr><td>Downtime timeline</td><td>State timeline</td><td>Riwayat OK/PROBLEM per layanan</td></tr>
<tr><td>Perbandingan cabang</td><td>Bar gauge</td><td>Availability per site (multi-site)</td></tr>
<tr><td>SLA target vs aktual</td><td>Stat berdampingan</td><td>"Target 99,9% | Aktual 99,87%" + selisih</td></tr>
<tr><td>Insiden bulan ini</td><td>Table</td><td>Daftar PROBLEM: mulai, durasi, penyebab</td></tr>
</table></div>
<h3>Menghitung Availability di Grafana</h3>
<pre>Opsi A (mudah): pakai data SLA Zabbix via API - plugin Zabbix bisa query
"availability" per trigger untuk periode tertentu.
ALASAN: Zabbix sudah menghitungnya dengan benar (exclude maintenance dll.)

Opsi B: hitung dari state timeline - proporsi waktu OK vs total.
ALASAN B: fleksibel untuk definisi kustom, tapi harus hati-hati dengan
maintenance window (jangan hitung sebagai downtime!).

Rekomendasi: Opsi A untuk laporan resmi; Opsi B untuk eksplorasi.</pre>
<h3>Untuk Manajemen: Bahasa Bisnis</h3>
<ul>
<li>Tampilkan <b>% dan menit downtime</b> ("99,87% - 58 menit"), bukan grafik teknis.</li>
<li>Sertakan <b>penyebab & tindak lanjut</b> per insiden - manajemen butuh narasi, bukan angka.</li>
<li>Refresh 5 menit cukup - laporan, bukan wall display.</li>
</ul>
<div class="callout blue"><div class="t">Jujur Itu Strategi</div><p style="margin:4px 0 0">Jangan "mempercantik" angka availability (mis. menghapus downtime yang memalukan). Sekali ketahuan, kepercayaan pada SELURUH sistem monitoring runtuh - dan kepercayaan adalah mata uang NOC ke manajemen.</p></div>`,
      terms: [
        ['State timeline', 'Panel Grafana menampilkan status (OK/PROBLEM) terhadap waktu.'],
        ['Bar gauge', 'Panel bar horizontal untuk perbandingan banyak item.'],
      ],
      scenario: 'Meeting kuartalan: dashboard availability menunjukkan 99,87% (di bawah target 99,9%) dengan 2 insiden terdokumentasi + rencana perbaikan (jalur backup ISP). Manajemen menyetujui budget backup link karena datanya jujur dan lengkap - bukan karena "katanya perlu".',
      bestPractices: 'Arsipkan snapshot dashboard availability tiap akhir bulan (PDF) - bukti historis SLA untuk kontrak dan audit.',
      security: 'Laporan availability menunjukkan kapan jaringan lemah - batasi distribusinya; jangan kirim ke milis umum.',
      challenge: 'Buat panel availability 1 layanan di lab-mu (mis. "R1") untuk 7 hari terakhir. Berapa % nya? Adakah downtime yang tidak kamu sadari?',
      interviewQ: 'Q: "Bagaimana kamu melaporkan availability ke manajemen yang non-teknis?" - A: Persentase + menit downtime + narasi penyebab dan tindak lanjut per insiden - bukan grafik teknis; jujur apa adanya karena kepercayaan adalah mata uangnya.',
      quiz: [
        {
          q: 'Untuk laporan SLA resmi, sumber perhitungan availability yang direkomendasikan adalah...',
          options: [
            'Perkiraan manual',
            'Data SLA/trigger Zabbix via API - sudah menangani maintenance window dengan benar',
            'Menebak dari ingatan',
            'Kata vendor',
          ],
          answer: 1,
          explain: 'Zabbix menghitung dengan benar termasuk excluded downtime; hitung manual rawan salah.',
        },
        {
          q: 'Dashboard untuk manajemen sebaiknya menampilkan...',
          options: [
            'Grafik teknis mentah',
            '% dan menit downtime + narasi penyebab dan tindak lanjut - bahasa bisnis',
            'Kode program',
            'Log mentah',
          ],
          answer: 1,
          explain: 'Manajemen butuh makna bisnis dan akuntabilitas, bukan detail teknis.',
        },
        {
          q: 'Mempercantik angka availability (menghapus downtime memalukan) berakibat...',
          options: [
            'Bonus',
            'Runtuhnya kepercayaan pada seluruh sistem monitoring sekali ketahuan',
            'Tidak ada',
            'Dipuji',
          ],
          answer: 1,
          explain: 'Integritas data = fondasi kredibilitas NOC; sekali rusak sulit dipulihkan.',
        },
      ],
    },
    {
      id: '27.9',
      title: 'Capacity Dashboard',
      body: `<p>Dashboard <b>Capacity</b>: "kapan kita harus upgrade?" - tren jangka panjang (bulanan/tahunan) untuk perencanaan anggaran. Ini dashboard yang <b>menghasilkan uang</b>: justifikasi belanja berbasis data.</p>
<h3>Panel-panel Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Jenis</th><th>Fungsi</th></tr>
<tr><td>Tren traffic WAN 12 bulan</td><td>Time series (trends!)</td><td>Pertumbuhan dari waktu ke waktu</td></tr>
<tr><td>Proyeksi kejenuhan</td><td>Time series + trend line</td><td>"Kapan menyentuh 80%?" - forecast visual</td></tr>
<tr><td>95th percentile per bulan</td><td>Bar chart</td><td>Dasar negosiasi kontrak ISP (23.15)</td></tr>
<tr><td>Traffic vs tagihan ISP</td><td>Time series (2 datasource!)</td><td>Zabbix (traffic) + SQL (tagihan) - apakah tagihan wajar?</td></tr>
<tr><td>Kapasitas per site</td><td>Table</td><td>Utilisasi puncak tiap cabang - prioritas upgrade</td></tr>
</table></div>
<h3>Teknik: Trend Line & Forecast</h3>
<pre>Di panel time series: tambahkan "trend line" (linear regression) pada data 12 bulan.
- Garis tren NAIK memotong garis 80% di "Agustus 2027"
  = "kita butuh upgrade SEBELUM Agustus 2027"
- ALASAN powerful: mengubah grafik historis menjadi ARGUMEN BUDGET dengan tanggal.

Pastikan query memakai TRENDS (27.2) - 12 bulan history = timeout!</pre>
<h3>Dashboard Lintas-Datasource (Nilai Unik Grafana)</h3>
<p>Panel "Traffic vs tagihan": datasource Zabbix (traffic, 95th percentile) + datasource MySQL (data tagihan ISP per bulan). Jika tagihan naik tapi traffic datar = negosiasi ulang. <b>Ini yang tidak bisa dilakukan dashboard Zabbix murni</b> - alasan utama Part 27 ada.</p>
<h3>Menutup Fase 5</h3>
<p>Kamu kini punya tumpukan monitoring lengkap: Zabbix mengumpulkan (23), MikroTik terpantau (24), FortiGate terpantau (25), Grafana memvisualkan (26), dan semuanya terintegrasi (27). Fase 6 akan memakai data ini untuk troubleshooting sistematis (Part 28) - monitoring yang baik membuat troubleshooting 10x lebih cepat.</p>
<div class="callout"><div class="t">Capacity Planning = Bahasa Uang</div><p style="margin:4px 0 0">"Traffic naik 15%/kuartal, menyentuh 80% pada Agustus 2027, upgrade Rp X menghindari overage Rp Y/bulan" - kalimat ini disetujui budget-nya. "Kayaknya perlu upgrade deh" - tidak.</p></div>`,
      terms: [
        ['Capacity planning', 'Perencanaan kapasitas berbasis tren data - kapan upgrade dibutuhkan.'],
        ['Trend line', 'Garis regresi linear untuk proyeksi pertumbuhan.'],
        ['Lintas-datasource', 'Panel yang menggabungkan data dari 2+ sumber (kekuatan Grafana).'],
      ],
      diagram: `<pre>        DARI DATA KE KEPUTUSAN BUDGET

[Trend 12 bulan] --trend line--> [Proyeksi: 80% di Agu 2027]
       +                                    |
[95th percentile/bulan]                     v
       +                         [Proposal: upgrade Q2 2027]
[Tagihan ISP vs traffic]                    |
       =                                    v
[Justifikasi: hindari overage]   [Budget DISETUJUI]</pre>`,
      scenario: 'Setiap tahun perdebatan "perlu upgrade bandwidth tidak?" diselesaikan dengan opini. Tahun ini engineer membawa dashboard capacity: tren 15%/kuartal, proyeksi jenuh 8 bulan lagi, perbandingan overage vs upgrade. Budget disetujui dalam 1 meeting - pertama kalinya tanpa debat.',
      bestPractices: 'Update dashboard capacity tiap kuartal dan presentasikan ke manajemen - jadikan ritual, bukan proyek sekali jalan.',
      security: 'Data capacity berisi rencana belanja perusahaan - perlakukan sebagai dokumen internal.',
      challenge: 'Buat panel tren 30 hari (atau sebanyak data yang kamu punya) untuk WAN lab-mu + trend line. Kapan garisnya menyentuh 80%? Tulis "laporan capacity" 1 paragraf.',
      interviewQ: 'Q: "Bagaimana kamu meyakinkan manajemen untuk budget upgrade bandwidth?" - A: Dengan data: tren pertumbuhan, proyeksi tanggal kejenuhan, perbandingan biaya overage vs upgrade - dashboard capacity mengubah opini menjadi argumen.',
      quiz: [
        {
          q: 'Panel tren 12 bulan HARUS memakai...',
          options: [
            'Data history mentah',
            'Tabel trends (agregat per jam) - history mentah 12 bulan = timeout',
            'Data tebakan',
            'Screenshot',
          ],
          answer: 1,
          explain: 'Agregat per jam cukup untuk tren tahunan dan 100x lebih ringan.',
        },
        {
          q: 'Nilai unik panel "traffic vs tagihan ISP" adalah...',
          options: [
            'Terlihat keren',
            'Menggabungkan 2 datasource (Zabbix + SQL) - tidak bisa dilakukan dashboard Zabbix murni',
            'Menghemat listrik',
            'Otomatis bayar tagihan',
          ],
          answer: 1,
          explain: 'Lintas-datasource = alasan utama memakai Grafana di samping Zabbix.',
        },
        {
          q: 'Trend line pada grafik capacity berfungsi untuk...',
          options: [
            'Dekorasi',
            'Proyeksi kapan utilisasi menyentuh ambang - mengubah histori menjadi argumen budget bertanggal',
            'Menghapus data lama',
            'Menambah panel',
          ],
          answer: 1,
          explain: 'Proyeksi bertanggal = dasar perencanaan anggaran yang konkret.',
        },
      ],
    },
  ],
};