import type { Part } from './types';

export const part26: Part = {
  id: '26',
  number: 'PART 26',
  title: 'Grafana',
  phaseId: 'fase-5',
  description: 'Platform visualisasi open-source: arsitektur Grafana, datasource, dashboard, panel, query, variables, alerting, dan prinsip desain dashboard yang efektif untuk NOC.',
  repoFolder: 'part-26-grafana',
  objectives: [
    'Menjelaskan peran Grafana sebagai lapisan visualisasi di atas berbagai datasource.',
    'Menggambarkan arsitektur Grafana dan alur query dari dashboard ke datasource.',
    'Membuat dashboard dengan panel, query, variables, dan visualisasi yang tepat.',
    'Mengonfigurasi alerting Grafana dan memahami bedanya dengan alert Zabbix.',
    'Menerapkan prinsip desain dashboard yang efektif untuk NOC dan manajemen.',
  ],
  prerequisites: 'Part 23 — Zabbix.',
  subbabs: [
    {
      id: '26.1',
      title: 'Apa Itu Grafana?',
      body: `<p><b>Grafana</b> adalah platform <b>visualisasi dan observability</b> open-source. Posisinya: Zabbix <i>mengumpulkan & menyimpan</i> data, Grafana <i>menampilkannya dengan indah dan fleksibel</i>. Satu dashboard Grafana bisa menggabungkan data dari <b>banyak sumber sekaligus</b>: Zabbix, Prometheus, database SQL, bahkan spreadsheet.</p>
<h3>Mengapa Butuh Grafana Kalau Zabbix Sudah Punya Dashboard?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Dashboard Zabbix</th><th>Grafana</th></tr>
<tr><td>Sumber data</td><td>Hanya Zabbix</td><td>Banyak: Zabbix, Prometheus, MySQL, dll. dalam 1 dashboard</td></tr>
<tr><td>Fleksibilitas visual</td><td>Widget standar</td><td>Sangat kaya: heatmap, geomap, stat, tabel transformasi</td></tr>
<tr><td>Eksplorasi ad-hoc</td><td>Terbatas</td><td>Query builder + explore mode yang powerful</td></tr>
<tr><td>Sharing</td><td>Butuh login Zabbix</td><td>Snapshot, link publik, embed iframe</td></tr>
</table></div>
<p><b>Analogi:</b> Zabbix = dapur yang memasak dan menyimpan bahan (data). Grafana = restoran dengan plating cantik yang bisa menyajikan hidangan dari banyak dapur sekaligus.</p>
<h3>Kapan Memakai yang Mana?</h3>
<ul>
<li><b>Dashboard Zabbix:</b> operasional harian NOC yang datanya murni dari Zabbix — cepat dibuat, terintegrasi dengan problems & trigger.</li>
<li><b>Grafana:</b> dashboard eksekutif/lintas-sumber ("bandingkan traffic Zabbix vs data billing dari database SQL"), visualisasi kompleks, atau saat tim sudah memakai Grafana untuk sistem lain.</li>
</ul>
<div class="callout blue"><div class="t">Grafana Bukan Pengganti Zabbix</div><p style="margin:4px 0 0">Grafana <b>tidak mengumpulkan data sendiri</b> — ia hanya membaca dari datasource. Tanpa Zabbix/Prometheus di belakangnya, Grafana adalah kanvas kosong. Keduanya komplemen, bukan kompetitor.</p></div>`,
      terms: [
        ['Grafana', 'Platform visualisasi open-source yang membaca data dari banyak datasource.'],
        ['Datasource', 'Sumber data yang disambungkan ke Grafana (Zabbix, Prometheus, SQL, dll.).'],
        ['Observability platform', 'Peran Grafana: menggabungkan metrik/log/trace dalam satu tampilan.'],
      ],
      scenario: 'Manajemen minta satu layar yang menunjukkan: traffic jaringan (dari Zabbix), jumlah transaksi aplikasi (dari database SQL), dan status server cloud (dari Prometheus). Dashboard Zabbix tidak bisa — datanya dari 3 dunia berbeda. Satu dashboard Grafana dengan 3 datasource menjawabnya dalam 1 layar.',
      bestPractices: 'Jangan duplikasi semua dashboard Zabbix ke Grafana — pilih yang memberi nilai tambah (lintas-sumber, visual kompleks, untuk non-teknis). Duplikasi = beban perawatan ganda.',
      security: 'Grafana menyimpan kredensial datasource — amankan seperti Zabbix: HTTPS, di VLAN management, dan batasi siapa yang bisa menambah datasource.',
      challenge: 'Sebutkan 3 dashboard di tempat kerjamu: mana yang cukup di Zabbix, mana yang butuh Grafana? Tulis alasannya per dashboard.',
      interviewQ: 'Q: "Apa beda Grafana dan Zabbix?" — A: Zabbix mengumpulkan, menyimpan, dan memberi alert atas data monitoring; Grafana memvisualisasikan data dari banyak sumber (termasuk Zabbix) dengan fleksibilitas tinggi. Grafana tidak mengumpulkan data sendiri.',
      quiz: [
        {
          q: 'Peran utama Grafana dalam stack monitoring adalah…',
          options: [
            'Mengumpulkan data SNMP dari device',
            'Visualisasi: menampilkan data dari banyak datasource dalam dashboard fleksibel',
            'Menggantikan firewall',
            'Menyimpan backup konfigurasi',
          ],
          answer: 1,
          explain: 'Grafana adalah lapisan visualisasi; pengumpulan tetap oleh Zabbix/Prometheus/dll.',
        },
        {
          q: 'Kapan Grafana lebih tepat daripada dashboard Zabbix?',
          options: [
            'Selalu — Zabbix tidak berguna',
            'Saat butuh menggabungkan banyak sumber data dalam 1 dashboard atau visualisasi kompleks',
            'Tidak pernah',
            'Hanya untuk printer',
          ],
          answer: 1,
          explain: 'Kekuatan Grafana = multi-datasource dan fleksibilitas visual; untuk data murni Zabbix, dashboard Zabbix sudah cukup.',
        },
        {
          q: 'Tanpa datasource (Zabbix/Prometheus/dll), Grafana adalah…',
          options: [
            'Tetap bisa monitoring mandiri',
            'Kanvas kosong — ia tidak mengumpulkan data sendiri',
            'Bisa SNMP langsung ke semua device',
            'Database',
          ],
          answer: 1,
          explain: 'Grafana hanya membaca; sumber data wajib ada di belakangnya.',
        },
      ],
    },
    {
      id: '26.2',
      title: 'Grafana Architecture',
      body: `<p>Arsitektur Grafana sederhana: <b>browser → Grafana server → datasource(s)</b>. Grafana server adalah perantara: ia meneruskan query dari dashboard ke datasource, lalu memformat hasilnya menjadi visual. Ia <b>tidak menyimpan data metrik</b> — hanya menyimpan definisi dashboard, user, dan konfigurasi (di database kecil SQLite/Postgres).</p>
<h3>Alur Data Lengkap (Zabbix → Grafana)</h3>
<pre>[Device: R1/FW1]
   │ SNMP/ICMP
   ▼
[Zabbix Server] ──▶ [Database Zabbix] ──▶ [Zabbix API]
   (kumpul)            (simpan)               │
                                             │ query via plugin/API
                                             ▼
                                      [Grafana Server] ──▶ [Browser: Dashboard]
                                      (tidak simpan metrik,   (render visual)
                                       hanya definisi
                                       dashboard + user)</pre>
<h3>Komponen</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Peran</th></tr>
<tr><td><b>Grafana server</b></td><td>Melayani web UI, meneruskan query ke datasource, evaluasi alert</td></tr>
<tr><td><b>Database internal</b></td><td>SQLite (default lab) / Postgres / MySQL — simpan dashboard, user, datasource config</td></tr>
<tr><td><b>Datasource plugin</b></td><td>Konektor ke tiap sumber (plugin Zabbix, Prometheus bawaan, dsb.)</td></tr>
<tr><td><b>Alerting engine</b></td><td>Evaluasi aturan alert dari hasil query (terpisah dari alert Zabbix!)</td></tr>
</table></div>
<h3>Implikasi Arsitektur</h3>
<ul>
<li><b>Grafana down ≠ data hilang:</b> data tetap terkumpul di Zabbix; yang hilang hanya tampilannya.</li>
<li><b>Beban query:</b> dashboard dengan 20 panel yang auto-refresh 5 detik = 20 query/5 detik ke Zabbix API — desain dashboard yang boros bisa membebani Zabbix!</li>
<li><b>Skala:</b> satu Grafana bisa membaca banyak Zabbix (multi-site) dalam satu dashboard.</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> Grafana satu VM kecil dengan SQLite cukup. <b>Production:</b> database internal pakai Postgres, HTTPS wajib, dan pertimbangkan beban query ke Zabbix API (cache & interval refresh yang wajar).</p></div>`,
      terms: [
        ['Grafana server', 'Perantara query: browser → Grafana → datasource.'],
        ['Datasource plugin', 'Konektor Grafana ke tiap jenis sumber data.'],
        ['Database internal', 'Menyimpan definisi dashboard & user — BUKAN data metrik.'],
      ],
      scenario: 'Dashboard Grafana NOC tiba-tiba kosong semua panel. Panik? Tidak — cek Zabbix: data tetap terkumpul normal. Ternyata service Grafana restart dan plugin Zabbix belum aktif. Data tidak hilang satu pun; hanya tampilannya. Inilah bedanya "penyimpan" vs "penampil".',
      bestPractices: 'Monitor Grafana itu sendiri (apakah service hidup) — tapi jangan panik jika ia down: data historis aman di datasource.',
      security: 'Kredensial datasource tersimpan di database internal Grafana — enkripsi secret key Grafana dan backup dengan aman.',
      challenge: 'Gambar arsitektur monitoring lengkap lab-mu: device → Zabbix → Grafana → browser. Tandai di mana data metrik disimpan vs di mana definisi dashboard disimpan.',
      interviewQ: 'Q: "Grafana down — apakah data monitoring hilang?" — A: Tidak. Grafana tidak menyimpan data metrik; data tetap terkumpul di Zabbix/datasource. Yang hilang hanya lapisan tampilannya.',
      quiz: [
        {
          q: 'Database internal Grafana menyimpan…',
          options: [
            'Semua data metrik jaringan',
            'Definisi dashboard, user, dan konfigurasi datasource — BUKAN data metrik',
            'Backup router',
            'Log firewall',
          ],
          answer: 1,
          explain: 'Data metrik tetap di datasource (Zabbix); Grafana hanya menyimpan "cetakan" tampilannya.',
        },
        {
          q: 'Dashboard dengan 20 panel auto-refresh 5 detik berdampak…',
          options: [
            'Tidak ada dampak',
            '20 query per 5 detik ke Zabbix API — bisa membebani Zabbix jika berlebihan',
            'Menambah data',
            'Mempercepat Zabbix',
          ],
          answer: 1,
          explain: 'Setiap panel = query ke datasource; desain boros = beban API yang nyata.',
        },
        {
          q: 'Alur query dashboard Grafana yang benar adalah…',
          options: [
            'Browser → device langsung',
            'Browser → Grafana server → datasource (Zabbix API) → kembali untuk divisualkan',
            'Datasource → browser langsung',
            'Database internal → device',
          ],
          answer: 1,
          explain: 'Grafana server menjadi perantara: meneruskan query dan memformat hasil.',
        },
      ],
    },
    {
      id: '26.3',
      title: 'Datasource',
      body: `<p><b>Datasource</b> adalah "sambungan" Grafana ke sumber data. Tiap datasource memakai <b>plugin</b> yang menerjemahkan bahasa query Grafana ke bahasa sumbernya (Zabbix API, PromQL, SQL). Satu Grafana bisa punya banyak datasource — dan satu dashboard bisa memakai beberapa sekaligus.</p>
<h3>Menambah Zabbix sebagai Datasource</h3>
<pre>1. Install plugin: grafana-cli plugins install alexanderzobnin-zabbix-app
   ALASAN: plugin Zabbix BUKAN bawaan — harus dipasang manual (restart grafana-server)
2. Configuration → Data sources → Add → "Zabbix"
3. URL: http://192.168.99.10/zabbix/api_jsonrpc.php
   ALASAN: Grafana berbicara ke Zabbix via JSON-RPC API (sama seperti automation)
4. Username/Password: user Zabbix KHUSUS untuk Grafana (mis. "grafana-reader")
   ALASAN: akun khusus berhak read-only — jika kredensial Grafana bocor,
   penyerang hanya bisa MEMBACA, tidak mengubah konfigurasi Zabbix
5. Save & Test → "Success" = koneksi OK
   ALASAN test: memastikan URL, kredensial, dan versi API cocok SEBELUM buat dashboard</pre>
<h3>Jenis Datasource Umum</h3>
<div class="tblwrap"><table>
<tr><th>Datasource</th><th>Bahasa Query</th><th>Kegunaan Khas</th></tr>
<tr><td>Zabbix (plugin)</td><td>Item/trigger picker</td><td>Metrik jaringan yang sudah ada</td></tr>
<tr><td>Prometheus</td><td>PromQL</td><td>Monitoring cloud-native/Kubernetes</td></tr>
<tr><td>MySQL/Postgres</td><td>SQL</td><td>Data bisnis, billing, inventory</td></tr>
<tr><td>Loki</td><td>LogQL</td><td>Log terpusat</td></tr>
<tr><td>TestData / CSV</td><td>—</td><td>Latihan & mockup dashboard</td></tr>
</table></div>
<div class="callout"><div class="t">Akun Khusus Grafana</div><p style="margin:4px 0 0">Jangan pakai akun <b>Admin</b> Zabbix untuk datasource Grafana. Buat user <code>grafana-reader</code> dengan role read-only — prinsip <i>least privilege</i>: Grafana hanya butuh baca.</p></div>`,
      terms: [
        ['Datasource', 'Sambungan terkonfigurasi Grafana ke satu sumber data.'],
        ['Plugin', 'Konektor yang menerjemahkan query Grafana ke bahasa sumber data.'],
        ['api_jsonrpc.php', 'Endpoint JSON-RPC API Zabbix yang dipakai plugin Grafana.'],
        ['Least privilege', 'Hak akses seminimal yang dibutuhkan — read-only untuk Grafana.'],
      ],
      scenario: 'Kredensial Admin Zabbix dipakai untuk datasource Grafana yang bisa diakses banyak orang. Satu pengguna iseng menemukan ia bisa mengubah konfigurasi Zabbix lewat UI Grafana (karena plugin memakai hak akun itu). Insiden menjadi pelajaran least privilege: akun grafana-reader read-only dibuat, Admin tidak pernah dipakai untuk integrasi.',
      bestPractices: 'Beri nama datasource yang jelas ("Zabbix-Production", bukan "Zabbix1") — dashboard yang memakai datasource salah = data salah tanpa disadari.',
      security: 'Rotasi password akun grafana-reader berkala; pastikan ia tidak punya hak tulis apa pun di Zabbix.',
      challenge: 'Buat user "grafana-reader" di Zabbix lab-mu dengan role read-only, lalu sambungkan sebagai datasource di Grafana. Verifikasi: bisakah user itu mengubah trigger? (Seharusnya TIDAK.)',
      interviewQ: 'Q: "Mengapa datasource Grafana memakai akun read-only khusus, bukan Admin?" — A: Least privilege — Grafana hanya butuh membaca data; jika kredensialnya bocor, penyerang tidak bisa mengubah konfigurasi monitoring.',
      quiz: [
        {
          q: 'Plugin Zabbix untuk Grafana…',
          options: [
            'Sudah bawaan sejak install',
            'Harus dipasang manual via grafana-cli lalu restart service',
            'Tidak ada',
            'Otomatis terinstall saat buka dashboard',
          ],
          answer: 1,
          explain: 'Plugin komunitas (alexanderzobnin-zabbix-app) dipasang manual — bukan bawaan.',
        },
        {
          q: 'Akun Zabbix untuk datasource Grafana sebaiknya…',
          options: [
            'Akun Admin agar semua bisa diakses',
            'Akun khusus read-only (mis. grafana-reader) — least privilege',
            'Tanpa akun',
            'Akun tamu tanpa password',
          ],
          answer: 1,
          explain: 'Grafana hanya membaca; akun Admin memberi hak ubah yang tidak dibutuhkan dan berbahaya.',
        },
        {
          q: 'Satu dashboard Grafana bisa memakai…',
          options: [
            'Hanya 1 datasource',
            'Banyak datasource sekaligus — mis. Zabbix + MySQL dalam 1 layar',
            'Tidak ada datasource',
            'Hanya TestData',
          ],
          answer: 1,
          explain: 'Multi-datasource per dashboard adalah kekuatan utama Grafana.',
        },
      ],
    },
    {
      id: '26.4',
      title: 'Dashboard',
      body: `<p><b>Dashboard</b> Grafana adalah kumpulan <b>panel</b> yang disusun dalam baris, dengan rentang waktu global dan variabel. Bedanya dengan dashboard Zabbix: jauh lebih fleksibel dalam layout, templating, dan sumber data campuran.</p>
<h3>Anatomi Dashboard</h3>
<pre>┌─────────────────────────────────────────────────┐
│ [Time range: Last 6h] [Refresh: 30s] [Variables]│  ← kontrol global
├──────────────┬──────────────────────────────────┤
│ PANEL 1      │ PANEL 2                          │  ← panel dalam baris
│ (stat)       │ (time series)                    │
├──────────────┴──────────────────────────────────┤
│ PANEL 3 (table: top talkers)                    │
└─────────────────────────────────────────────────┘
- Time range global: semua panel mengikuti (kecuali di-override per panel)
- Refresh: interval query ulang (jangan terlalu agresif — lihat 26.2!)
- Variables: dropdown (mis. pilih router) yang mengubah SEMUA panel sekaligus</pre>
<h3>Membuat Dashboard Pertama</h3>
<pre>1. Dashboards → New → Add visualization → pilih datasource "Zabbix-Production"
2. Pilih panel pertama: metrik CPU R1 → visualisasi "Stat" (angka besar)
3. Add panel kedua: traffic ether1 → visualisasi "Time series"
4. Atur time range "Last 6 hours", refresh "30s"
   ALASAN 30s: cukup segar untuk NOC tanpa membanjiri API (5s = 6x beban!)
5. Save dengan nama "Network Overview" + deskripsi
   ALASAN deskripsi: 6 bulan lagi kamu lupa dashboard ini untuk apa</pre>
<h3>Folder & Permissions</h3>
<ul>
<li><b>Folder:</b> kelompokkan ("NOC", "Capacity Planning", "Executive") — dashboard tanpa folder = berantakan.</li>
<li><b>Permissions:</b> siapa boleh view/edit per folder — tim NOC edit dashboard NOC; manajemen hanya view "Executive".</li>
<li><b>Versioning:</b> Grafana menyimpan riwayat versi dashboard — bisa rollback jika ada yang merusak.</li>
</ul>`,
      terms: [
        ['Panel', 'Satu kotak visualisasi dalam dashboard (grafik, angka, tabel).'],
        ['Time range', 'Rentang waktu global yang diikuti semua panel.'],
        ['Folder', 'Pengelompokan dashboard + dasar permission.'],
      ],
      scenario: 'Tim NOC membuat 40 dashboard tanpa folder dan tanpa deskripsi. Setahun kemudian tidak ada yang tahu mana yang masih dipakai — "dashboard kuburan". Setelah dirapikan ke 3 folder + review tiap 6 bulan, hanya 12 yang bertahan. Moral: dashboard juga butuh housekeeping.',
      bestPractices: 'Aturan refresh: NOC wall display 30s–1m; dashboard analisis manual saja (tanpa auto-refresh); eksekutif 5m. Refresh agresif = beban API sia-sia.',
      security: 'Jangan tampilkan data sensitif (IP internal detail, nama user) di dashboard yang di-share via link publik/snapshot.',
      challenge: 'Buat dashboard "Network Overview" pertamamu di Grafana lab: 3 panel (stat CPU R1, time series traffic ether1, daftar problems). Screenshot hasilnya.',
      interviewQ: 'Q: "Apa yang perlu diperhatikan saat mengatur auto-refresh dashboard?" — A: Tiap refresh = query ke datasource; refresh 5 detik dengan banyak panel membebani Zabbix API — sesuaikan dengan kebutuhan (NOC 30s–1m, analisis manual saja).',
      quiz: [
        {
          q: 'Time range global di dashboard Grafana berfungsi untuk…',
          options: [
            'Mengatur jam server',
            'Semua panel mengikuti rentang waktu yang sama (kecuali di-override)',
            'Menghapus data lama',
            'Menambah user',
          ],
          answer: 1,
          explain: 'Satu kontrol waktu untuk seluruh dashboard — konsisten antar panel.',
        },
        {
          q: 'Refresh 5 detik untuk dashboard NOC dengan 20 panel adalah…',
          options: [
            'Praktik terbaik',
            'Boros — 20 query/5 detik ke API; gunakan 30s–1m kecuali benar-benar butuh',
            'Wajib',
            'Tidak berpengaruh',
          ],
          answer: 1,
          explain: 'Beban query nyata ke Zabbix API; sesuaikan refresh dengan kebutuhan.',
        },
        {
          q: 'Manfaat folder dashboard adalah…',
          options: [
            'Mempercepat query',
            'Pengelompokan + dasar permission (siapa boleh view/edit)',
            'Menambah storage',
            'Wajib lisensi',
          ],
          answer: 1,
          explain: 'Folder = organisasi dan kontrol akses per kelompok dashboard.',
        },
      ],
    },
    {
      id: '26.5',
      title: 'Panel',
      body: `<p><b>Panel</b> adalah unit visualisasi terkecil: satu query (atau lebih) + satu jenis tampilan + opsi format. Memilih jenis panel yang tepat = setengah dari "dashboard yang bagus".</p>
<h3>Jenis Panel & Kapan Memakainya</h3>
<div class="tblwrap"><table>
<tr><th>Panel</th><th>Cocok Untuk</th><th>Contoh Jaringan</th></tr>
<tr><td><b>Time series</b></td><td>Tren terhadap waktu</td><td>Traffic 24 jam, CPU seminggu</td></tr>
<tr><td><b>Stat</b></td><td>Angka besar saat ini</td><td>"CPU R1: 34%", "Session: 8.412"</td></tr>
<tr><td><b>Gauge</b></td><td>Nilai vs ambang (seperti speedometer)</td><td>Utilisasi WAN vs 80%</td></tr>
<tr><td><b>Table</b></td><td>Daftar terurut</td><td>Top 10 interface tersibuk</td></tr>
<tr><td><b>Pie chart</b></td><td>Komposisi</td><td>Distribusi traffic per VLAN</td></tr>
<tr><td><b>Heatmap</b></td><td>Pola kepadatan waktu</td><td>Jam sibuk selama sebulan</td></tr>
<tr><td><b>Geomap</b></td><td>Lokasi geografis</td><td>Status cabang di peta</td></tr>
<tr><td><b>Alert list</b></td><td>Daftar alert aktif</td><td>Problems dari Zabbix</td></tr>
</table></div>
<h3>Opsi Penting per Panel</h3>
<ul>
<li><b>Unit:</b> atur dengan benar (bits/s vs bytes/s!) — salah unit = salah baca 8x lipat.</li>
<li><b>Min/Max:</b> untuk gauge CPU: 0–100; untuk utilisasi: 0–100%.</li>
<li><b>Thresholds:</b> warna hijau/kuning/merah pada nilai — panel "berbicara" tanpa dibaca angkanya.</li>
<li><b>Legend & tooltip:</b> beri nama deret yang jelas ("ether1-in"), bukan "Series A".</li>
</ul>
<div class="callout"><div class="t">Kesalahan Klasik</div><p style="margin:4px 0 0">Memakai <b>pie chart untuk tren waktu</b> atau <b>time series untuk satu angka saat ini</b>. Aturan praktis: tren→time series, nilai kini→stat/gauge, perbandingan→table/bar, komposisi→pie.</p></div>`,
      terms: [
        ['Panel', 'Unit visualisasi: query + jenis tampilan + opsi.'],
        ['Thresholds', 'Ambang warna pada panel (hijau/kuning/merah).'],
        ['Legend', 'Keterangan nama tiap deret data di grafik.'],
      ],
      scenario: 'Dashboard eksekutif menampilkan time series 30 hari untuk pertanyaan "berapa uptime bulan ini?" — direksi bingung membaca grafik. Diganti satu panel Stat besar "99,87%" dengan threshold hijau/merah — pertanyaan terjawab dalam 2 detik. Pelajaran: jenis panel harus sesuai pertanyaan.',
      bestPractices: 'Setiap panel menjawab SATU pertanyaan yang jelas. Jika kamu tidak bisa merumuskan pertanyaannya dalam 1 kalimat, panel itu tidak dibutuhkan.',
      security: 'Panel table "top talkers" bisa membocorkan IP internal — batasi dashboard yang memuatnya hanya untuk tim yang berhak.',
      challenge: 'Untuk 5 pertanyaan ini pilih jenis panelnya: (1) CPU R1 sekarang, (2) tren traffic seminggu, (3) 10 interface tersibuk, (4) % traffic per VLAN, (5) status semua cabang. Tulis pilihanmu.',
      interviewQ: 'Q: "Kapan memakai Stat vs Time series?" — A: Stat untuk nilai saat ini yang butuh dibaca sekilas (berapa sekarang?); time series untuk tren/pola terhadap waktu (bagaimana perkembangannya?).',
      quiz: [
        {
          q: 'Untuk pertanyaan "berapa CPU R1 SEKARANG?", panel yang tepat adalah…',
          options: ['Time series', 'Stat (angka besar) — nilai saat ini sekilas', 'Heatmap', 'Geomap'],
          answer: 1,
          explain: 'Stat = satu angka kini; time series untuk tren waktu.',
        },
        {
          q: 'Fungsi thresholds warna (hijau/kuning/merah) pada panel adalah…',
          options: [
            'Dekorasi',
            'Panel "berbicara" tanpa dibaca angkanya — status terlihat sekilas',
            'Mempercepat query',
            'Syarat Grafana',
          ],
          answer: 1,
          explain: 'Warna = pre-attentive processing; operator tahu status sebelum membaca angka.',
        },
        {
          q: 'Kesalahan umum dalam memilih panel adalah…',
          options: [
            'Memakai terlalu sedikit panel',
            'Pie chart untuk tren waktu / time series untuk satu angka kini — jenis tidak sesuai pertanyaan',
            'Memakai warna',
            'Memberi judul',
          ],
          answer: 1,
          explain: 'Jenis visual harus sesuai jenis pertanyaan; salah pilih = sulit dibaca.',
        },
      ],
    },
    {
      id: '26.6',
      title: 'Query',
      body: `<p><b>Query</b> adalah "pertanyaan" yang diajukan panel ke datasource: "berikan saya data X untuk rentang waktu Y". Di Grafana+Zabbix, query disusun lewat <b>query builder</b> (pilih grup → host → item) tanpa menulis kode — tapi memahami yang terjadi di belakangnya penting untuk troubleshooting.</p>
<h3>Yang Terjadi di Balik Query Builder</h3>
<pre>1. Kamu pilih: Group "Routers" → Host "R1-Jakarta" → Item "CPU utilization"
2. Grafana menerjemahkan ke panggilan Zabbix API:
   "beri history item X dari jam A sampai jam B"
3. Zabbix mengembalikan ribuan titik data mentah
4. Grafana menerapkan FUNGSI di sisi panel:
   - mean()   → rata-rata per interval (menghaluskan)
   - max()    → nilai maksimum (menangkap spike)
   - last()   → nilai terakhir (untuk Stat)
   ALASAN fungsi: ribuan titik tidak bisa digambar satu per satu —
   harus diagregat per interval piksel layar</pre>
<h3>Fungsi Agregasi: Pilih yang Jujur</h3>
<div class="tblwrap"><table>
<tr><th>Fungsi</th><th>Efek</th><th>Kapan</th></tr>
<tr><td><b>mean</b></td><td>Rata-rata — menghaluskan</td><td>Tren umum (default aman)</td></tr>
<tr><td><b>max</b></td><td>Tertinggi — menangkap lonjakan</td><td>"Apakah pernah menyentuh 100%?"</td></tr>
<tr><td><b>min</b></td><td>Terendah</td><td>"Apakah pernah drop ke 0?"</td></tr>
<tr><td><b>last</b></td><td>Terakhir</td><td>Panel Stat/angka kini</td></tr>
</table></div>
<p><b>Jebakan:</b> grafik CPU dengan mean() terlihat tenang di 40% — padahal max() menunjukkan spike 100% tiap jam. Agregasi yang salah <b>menyembunyikan masalah</b>. Untuk metrik kritis, tampilkan mean + max bersamaan.</p>
<div class="callout blue"><div class="t">Query vs Trigger</div><p style="margin:4px 0 0">Query Grafana hanya <b>membaca & menampilkan</b> — ia tidak mengevaluasi "apakah ini masalah" (itu tugas trigger Zabbix). Jangan andalkan "dilihat di Grafana" sebagai pengganti alert.</p></div>`,
      terms: [
        ['Query', 'Permintaan data dari panel ke datasource untuk rentang waktu tertentu.'],
        ['Query builder', 'Antarmuka pilih-klik untuk menyusun query tanpa kode.'],
        ['Agregasi', 'Penggabungan banyak titik data menjadi satu (mean/max/min) per interval.'],
      ],
      scenario: 'Laporan "CPU tidak pernah di atas 50%" dipertanyakan saat server crash karena overload. Ternyata dashboard memakai mean() per 1 jam — spike 100% selama 10 menit "terencerkan" menjadi 55%. Grafik max() menunjukkan kebenaran: spike 100% tiap jam 2 siang. Agregasi menentukan cerita.',
      bestPractices: 'Untuk dashboard troubleshooting, sediakan toggle mean/max — "rata-rata untuk tren, maksimum untuk kebenaran".',
      security: 'Query yang terlalu berat (rentang 1 tahun, ribuan item) bisa DoS Zabbix API sendiri — batasi rentang maksimal per dashboard.',
      challenge: 'Di dashboard lab-mu, tampilkan CPU R1 dengan mean() dan max() berdampingan selama 24 jam. Apakah ada spike yang disembunyikan mean? Catat temuanmu.',
      interviewQ: 'Q: "Grafik mean terlihat normal tapi server crash overload — apa yang terjadi?" — A: Agregasi mean mengencerkan spike singkat; spike 100% selama 10 menit hilang dalam rata-rata 1 jam — gunakan max() untuk menangkap lonjakan.',
      quiz: [
        {
          q: 'Fungsi agregasi max() pada query berguna untuk…',
          options: [
            'Menghaluskan grafik',
            'Menangkap lonjakan (spike) tertinggi yang disembunyikan rata-rata',
            'Menghapus data',
            'Mempercepat query',
          ],
          answer: 1,
          explain: 'max() menjawab "apakah pernah menyentuh nilai ekstrem?" — yang mean() sembunyikan.',
        },
        {
          q: 'Query Grafana berbeda dari trigger Zabbix karena…',
          options: [
            'Tidak ada bedanya',
            'Query hanya membaca/menampilkan; trigger yang mengevaluasi masalah dan memicu alert',
            'Query lebih cepat',
            'Trigger tidak bisa grafik',
          ],
          answer: 1,
          explain: 'Grafana = tampil; Zabbix trigger = nilai + alert. Jangan ganti alert dengan "dilihat manual".',
        },
        {
          q: 'Ribuan titik data mentah harus diagregat karena…',
          options: [
            'Zabbix melarang',
            'Layar hanya punya ratusan piksel — titik harus digabung per interval agar bisa digambar',
            'Agar mahal',
            'Syarat browser',
          ],
          answer: 1,
          explain: 'Agregasi menyesuaikan resolusi data dengan resolusi tampilan.',
        },
      ],
    },
    {
      id: '26.7',
      title: 'Variables',
      body: `<p><b>Variables</b> adalah dropdown di atas dashboard yang membuat <b>satu dashboard melayani banyak pilihan</b>: pilih router "R1" → semua panel menampilkan R1; ganti ke "R2" → semua ikut berubah. Tanpa variables, kamu butuh 1 dashboard per device.</p>
<h3>Cara Kerja</h3>
<pre>1. Dashboard settings → Variables → New:
   - Name: router
   - Type: Query → Datasource Zabbix → Query: "hosts in group Routers"
   ALASAN: daftar terisi OTOMATIS dari Zabbix — tambah router baru = otomatis muncul
2. Di tiap query panel, ganti host tetap menjadi $router:
   Host: $router  (bukan "R1-Jakarta")
   ALASAN: $router diganti nilai dropdown saat dashboard dibuka
3. Hasil: dropdown "router: [R1-Jakarta ▾]" di atas dashboard

Variabel berantai (chained):
  $group → $router → $interface
  ALASAN: pilih grup dulu, daftar router menyempit, daftar interface menyempit lagi.
  Satu dashboard "Interface Detail" melayani SEMUA interface SEMUA router!</pre>
<h3>Pola Variables Umum</h3>
<div class="tblwrap"><table>
<tr><th>Variabel</th><th>Isi</th><th>Efek</th></tr>
<tr><td>$router</td><td>Host dalam grup Routers</td><td>1 dashboard untuk semua router</td></tr>
<tr><td>$interface</td><td>Interface milik $router</td><td>1 panel traffic untuk semua port</td></tr>
<tr><td>$interval</td><td>10s, 1m, 1h (custom)</td><td>User atur kehalusan grafik</td></tr>
</table></div>
<div class="callout"><div class="t">Satu Dashboard, Banyak Device</div><p style="margin:4px 0 0">Pola emas: <b>1 dashboard template + variables</b> menggantikan puluhan dashboard duplikat. Perawatan 1x, manfaat untuk semua device — prinsip yang sama dengan template Zabbix (23.19).</p></div>`,
      terms: [
        ['Variables', 'Dropdown parameter dashboard yang mengubah semua query sekaligus.'],
        ['Chained variables', 'Variabel bertingkat: pilihan satu menyempitkan pilihan berikutnya.'],
        ['$router', 'Sintaks memakai variabel dalam query panel.'],
      ],
      scenario: 'NOC punya 25 dashboard "Traffic Router X" — tiap tambah router, buat dashboard baru manual. Setelah diubah ke 1 dashboard + variabel $router, tambah router = otomatis muncul di dropdown. Waktu pembuatan dashboard baru: dari 30 menit menjadi 0.',
      bestPractices: 'Selalu sediakan opsi "All" pada variabel (multi-value) agar bisa membandingkan semua device dalam 1 grafik.',
      security: 'Variabel query berjalan dengan hak akun datasource — pastikan akun read-only (26.3) agar variabel tidak bisa dipakai untuk eksplorasi destruktif.',
      challenge: 'Buat dashboard "Router Detail" dengan variabel $router di lab-mu: 4 panel (CPU stat, memory gauge, traffic time series, problems). Uji dengan 2 host berbeda.',
      interviewQ: 'Q: "Apa keuntungan variables di Grafana?" — A: Satu dashboard melayani banyak device/pilihan — mengurangi duplikasi, perawatan terpusat, dan daftar terisi otomatis dari datasource.',
      quiz: [
        {
          q: 'Fungsi utama variables adalah…',
          options: [
            'Mempercepat query',
            'Satu dashboard dinamis untuk banyak pilihan (device/interface) — tanpa duplikasi dashboard',
            'Menambah user',
            'Backup otomatis',
          ],
          answer: 1,
          explain: 'Variables = parameterisasi dashboard; ganti dropdown, semua panel ikut.',
        },
        {
          q: 'Chained variables ($group → $router → $interface) berguna untuk…',
          options: [
            'Mempersulit',
            'Pilihan bertingkat yang saling menyempit — navigasi alami dari umum ke detail',
            'Hanya dekorasi',
            'Wajib lisensi',
          ],
          answer: 1,
          explain: 'Rantai menyempitkan opsi secara logis mengikuti hierarki infrastruktur.',
        },
        {
          q: 'Daftar variabel sebaiknya terisi…',
          options: [
            'Diketik manual dan tidak pernah diubah',
            'Otomatis dari query datasource — device baru langsung muncul',
            'Dari ingatan',
            'Dari spreadsheet',
          ],
          answer: 1,
          explain: 'Query-driven = selalu sinkron dengan kondisi nyata di Zabbix.',
        },
      ],
    },
    {
      id: '26.8',
      title: 'Visualization',
      body: `<p><b>Visualization</b> = seni memilih representasi visual yang tepat. Grafana punya puluhan jenis; sub-bab ini membahas yang paling berdampak untuk monitoring jaringan plus teknik tingkat lanjut: <b>transformasi</b> dan <b>override</b>.</p>
<h3>Teknik Tingkat Lanjut</h3>
<ul>
<li><b>Transformations:</b> olah data SETELAH query — mis. "gabungkan 2 query", "hitung % dari total", "urutkan top 10". Contoh: query traffic semua interface → transform "sort by max desc, limit 10" = tabel top talkers tanpa query rumit.</li>
<li><b>Field override:</b> aturan khusus per deret — mis. deret "ether1-in" selalu hijau, "ether1-out" selalu biru; atau sembunyikan deret tertentu dari legend.</li>
<li><b>Value mapping:</b> ubah angka jadi teks bermakna: 1 → "UP" (hijau), 0 → "DOWN" (merah), 2 → "TESTING". Sangat berguna untuk status interface!</li>
</ul>
<pre>Contoh value mapping untuk ifOperStatus:
  1 → "UP"      (hijau)
  2 → "DOWN"    (merah)
  3 → "TESTING" (kuning)
ALASAN: operator membaca "DOWN" jauh lebih cepat daripada mengingat "2 = down".</pre>
<h3>Multi-series yang Efektif</h3>
<ul>
<li><b>Maksimal 5–7 deret</b> per grafik — lebih dari itu = spageti tak terbaca.</li>
<li><b>Satuan konsisten:</b> jangan campur bps dan pps dalam 1 sumbu Y — pakai 2 sumbu (kiri/kanan) jika terpaksa.</li>
<li><b>Warna bermakna:</b> hijau = baik/normal, kuning = perhatian, merah = buruk. Konsisten di SEMUA dashboard.</li>
</ul>
<div class="callout blue"><div class="t">Aturan Spageti</div><p style="margin:4px 0 0">Jika grafikmu terlihat seperti semangkuk spageti, masalahnya bukan datanya — tapi terlalu banyak deret. Pecah menjadi beberapa panel atau pakai variabel untuk memilih.</p></div>`,
      terms: [
        ['Transformations', 'Pengolahan data setelah query: gabung, urutkan, hitung ulang.'],
        ['Field override', 'Aturan tampilan khusus untuk deret/field tertentu.'],
        ['Value mapping', 'Mengubah nilai angka menjadi teks/warna bermakna.'],
      ],
      scenario: 'Dashboard menampilkan 40 deret interface dalam 1 grafik — tak terbaca, NOC tidak pernah membukanya. Setelah dipecah: 1 panel top-5 (table) + 1 grafik dengan variabel $interface, dashboard itu menjadi yang paling sering dibuka saat troubleshooting.',
      bestPractices: 'Standarkan palet warna status di semua dashboard (hijau/kuning/merah) — operator yang pindah dashboard tidak perlu belajar ulang.',
      security: 'Value mapping "UP/DOWN" untuk status port akses bisa membocorkan port mana yang aktif — batasi dashboard detail port hanya untuk tim internal.',
      challenge: 'Buat panel status interface R1 dengan value mapping (UP/DOWN/TESTING). Lalu buat tabel "Top 5 interface by traffic" memakai transformation sort+limit.',
      interviewQ: 'Q: "Apa itu transformations dan kapan dipakai?" — A: Pengolahan data setelah query (gabung, urutkan, batasi, hitung ulang) — dipakai agar query tetap sederhana sementara presentasi (mis. top-10) ditangani di lapisan visual.',
      quiz: [
        {
          q: 'Value mapping 1→"UP" (hijau), 2→"DOWN" (merah) berguna karena…',
          options: [
            'Mempercepat query',
            'Operator membaca status jauh lebih cepat daripada menghafal arti angka',
            'Menghemat storage',
            'Wajib Grafana',
          ],
          answer: 1,
          explain: 'Teks/warna bermakna = pemahaman instan, mengurangi beban kognitif.',
        },
        {
          q: 'Batas praktis jumlah deret dalam satu grafik adalah…',
          options: ['100', '5–7 — lebih dari itu menjadi spageti tak terbaca', '1 saja', 'Tidak ada batas'],
          answer: 1,
          explain: 'Kognitif manusia terbatas; pecah atau pakai variabel jika deret banyak.',
        },
        {
          q: 'Transformations dipakai untuk…',
          options: [
            'Mengubah password',
            'Mengolah hasil query (urutkan, batasi, hitung ulang) tanpa query rumit',
            'Menghapus datasource',
            'Install plugin',
          ],
          answer: 1,
          explain: 'Transformasi = lapisan presentasi di atas query sederhana.',
        },
      ],
    },
    {
      id: '26.9',
      title: 'Alerting',
      body: `<p>Grafana punya <b>alerting sendiri</b> (terpisah dari alert Zabbix!). Ia mengevaluasi hasil query dan mengirim notifikasi via <b>contact points</b> (email, Telegram, webhook). Pertanyaan penting: <b>kapan memakai alert Grafana vs alert Zabbix?</b></p>
<h3>Grafana Alert vs Zabbix Alert</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Alert Zabbix</th><th>Alert Grafana</th></tr>
<tr><td>Sumber data</td><td>Data Zabbix</td><td>Query apa pun (multi-datasource!)</td></tr>
<tr><td>Kecocokan</td><td>Metrik infrastruktur (CPU, SNMP, ping)</td><td>Kondisi lintas-sumber ("traffic Zabbix TINGGI DAN transaksi SQL RENDAH")</td></tr>
<tr><td>Eskalasi</td><td>Action + eskalasi bertingkat bawaan</td><td>Notification policy (mirip, berbasis label)</td></tr>
<tr><td>Rekomendasi</td><td><b>Default untuk monitoring jaringan</b></td><td>Khusus kasus lintas-datasource</td></tr>
</table></div>
<h3>Konsep Alerting Grafana</h3>
<pre>Alert rule:  query → kondisi (mis. avg > 80 selama 5m) → status Pending → Firing
Contact point: ke mana dikirim (Telegram, email, webhook)
Notification policy: aturan routing berdasar label
  (mis. label "team=noc" → Telegram NOC; "severity=critical" → SMS)
Silence: bisukan sementara (untuk maintenance — setara maintenance Zabbix)
ALASAN label: routing fleksibel tanpa membuat banyak rule duplikat</pre>
<h3>Aturan Praktis</h3>
<ul>
<li><b>Jangan duplikasi alert:</b> jika Zabbix sudah alert "CPU > 90%", jangan buat alert Grafana yang sama — dua sumber alert = kebingungan "mana yang benar" + risiko salah satu tidak terawat.</li>
<li><b>Pakai Grafana alert untuk:</b> kondisi yang MELIBATKAN banyak datasource — mis. "bandwidth 95% (Zabbix) DAN keluhan user naik (database tiket)".</li>
<li><b>Satu sumber kebenaran:</b> tim harus tahu "alert jaringan = dari Zabbix; alert bisnis lintas-sistem = dari Grafana".</li>
</ul>
<div class="callout"><div class="t">Bahaya Alert Ganda</div><p style="margin:4px 0 0">Alert yang sama dari dua sistem = saat satu diubah ambangnya dan satunya tidak, tim menerima info konflik. Pilih SATU sistem per kondisi dan dokumentasikan pembagiannya.</p></div>`,
      terms: [
        ['Contact point', 'Tujuan notifikasi alert Grafana (Telegram, email, webhook).'],
        ['Notification policy', 'Aturan routing alert berdasar label.'],
        ['Silence', 'Pembisuan alert sementara untuk maintenance.'],
        ['Firing / Pending', 'Status alert: Pending = kondisi terpenuhi sesaat; Firing = sudah bertahan cukup lama.'],
      ],
      scenario: 'Tim membuat alert "link down" di Zabbix DAN di Grafana. Suatu hari ambang Zabbix diubah, Grafana tidak — NOC menerima "link OK" dari satu dan "link DOWN" dari satunya untuk insiden yang sama. Kepercayaan pada sistem alert runtuh. Solusi: hapus duplikat, tetapkan "jaringan = Zabbix".',
      bestPractices: 'Dokumentasikan pembagian tugas alert dalam 1 tabel: kondisi → sistem → penerima. Review tiap ada alert baru.',
      security: 'Contact point webhook URL = kredensial; batasi siapa yang bisa melihat/mengubahnya.',
      challenge: 'Buat tabel pembagian alert untuk organisasimu: 5 kondisi monitoring → Zabbix atau Grafana? Tulis alasannya per kondisi.',
      interviewQ: 'Q: "Kapan memakai alert Grafana dibanding alert Zabbix?" — A: Zabbix = default untuk metrik infrastruktur; Grafana hanya untuk kondisi lintas-datasource yang tidak bisa dinilai Zabbix sendirian. Jangan duplikasi kondisi yang sama di dua sistem.',
      quiz: [
        {
          q: 'Kekuatan unik alert Grafana dibanding Zabbix adalah…',
          options: [
            'Lebih cepat',
            'Bisa menilai kondisi lintas-datasource (multi-sumber dalam satu rule)',
            'Gratis sedangkan Zabbix bayar',
            'Tidak butuh konfigurasi',
          ],
          answer: 1,
          explain: 'Grafana query banyak sumber; Zabbix hanya data Zabbix.',
        },
        {
          q: 'Bahaya menduplikasi kondisi alert yang sama di Zabbix dan Grafana adalah…',
          options: [
            'Tidak ada bahaya',
            'Info konflik saat satu diubah dan satunya tidak — kepercayaan pada alert runtuh',
            'Lebih aman',
            'Lebih murah',
          ],
          answer: 1,
          explain: 'Dua sumber kebenaran = konflik; satu kondisi = satu sistem.',
        },
        {
          q: 'Fungsi "Silence" di Grafana setara dengan…',
          options: [
            'Menghapus dashboard',
            'Maintenance mode di Zabbix — pembisuan sementara yang tercatat',
            'Mematikan server',
            'Mengganti password',
          ],
          answer: 1,
          explain: 'Keduanya menekan notifikasi untuk periode maintenance yang diketahui.',
        },
      ],
    },
    {
      id: '26.10',
      title: 'Dashboard Design',
      body: `<p>Sub-bab penutup: <b>prinsip desain</b> yang membedakan dashboard "bagus dilihat" vs "berguna saat insiden". Dashboard terbaik adalah yang membuat keputusan lebih cepat.</p>
<h3>Hierarki Visual: Piramida Informasi</h3>
<pre>        ┌─────────────┐
        │   STATUS    │  ← "Ada masalah?" (merah/hijau, 5 detik)
        ├─────────────┤
        │  KONTEKS    │  ← "Seberapa parah? Di mana?" (grafik terkait)
        ├─────────────┤
        │   DETAIL    │  ← "Mengapa?" (grafik drill-down, tabel)
        └─────────────┘
ALASAN: mata membaca atas→bawah; letakkan yang paling penting paling atas.</pre>
<h3>Checklist Desain</h3>
<div class="tblwrap"><table>
<tr><th>Prinsip</th><th>Implementasi</th></tr>
<tr><td><b>Satu tujuan</b></td><td>1 dashboard = 1 pertanyaan besar ("Apakah jaringan sehat?")</td></tr>
<tr><td><b>5 detik rule</b></td><td>Status kritis terlihat tanpa scroll</td></tr>
<tr><td><b>Konsistensi</b></td><td>Warna, satuan, dan layout sama antar dashboard</td></tr>
<tr><td><b>Progressive disclosure</b></td><td>Ringkasan dulu, detail via drill-down/variabel — bukan semuanya sekaligus</td></tr>
<tr><td><b>Judul bermakna</b></td><td>"WAN Utilization (last 24h)" bukan "Panel 1"</td></tr>
<tr><td><b>Dokumentasi</b></td><td>Deskripsi dashboard: untuk siapa, data dari mana, kapan diupdate</td></tr>
</table></div>
<h3>Tiga Dashboard Standar (Pola)</h3>
<ul>
<li><b>NOC Overview:</b> status + problems + traffic WAN + top CPU — untuk wall display (refresh 30s).</li>
<li><b>Troubleshooting:</b> variabel $device/$interface + grafik detail + log — untuk engineer (tanpa auto-refresh).</li>
<li><b>Executive:</b> availability %, SLA, tren kapasitas bulanan — untuk manajemen (refresh 5m, bahasa bisnis).</li>
</ul>
<div class="callout blue"><div class="t">Uji Kegunaan Sejati</div><p style="margin:4px 0 0">Tunjukkan dashboard ke rekan yang <b>tidak ikut membuatnya</b> dan minta ia menjawab: "ada masalah tidak?" dalam 10 detik. Jika ia bingung — desainnya yang salah, bukan orangnya.</p></div>`,
      terms: [
        ['Piramida informasi', 'Hierarki status → konteks → detail dari atas ke bawah.'],
        ['Progressive disclosure', 'Tampilkan ringkasan dulu, detail saat diminta (drill-down).'],
        ['5 detik rule', 'Status kritis harus terpahami dalam 5 detik memandang.'],
      ],
      scenario: 'Dashboard "lengkap" dengan 60 panel dibuat untuk direksi — tidak pernah dibuka karena membingungkan. Diganti 1 dashboard eksekutif: 4 angka besar (uptime, insiden bulan ini, utilisasi WAN, tren) — dibuka tiap meeting. Lengkap ≠ berguna.',
      bestPractices: 'Review dashboard tiap 6 bulan dengan penggunanya: masih dipakai? masih akurat? Jika tidak — arsipkan, jangan biarkan menjadi kuburan.',
      security: 'Dashboard eksekutif sering di-share ke pihak luar — pastikan tidak ada data sensitif (topologi detail, IP internal) di dalamnya.',
      challenge: 'Audit satu dashboard yang pernah kamu buat/pakai dengan checklist di atas. Nilai 1–5 per prinsip. Apa 2 perbaikan prioritasmu?',
      interviewQ: 'Q: "Apa yang membedakan dashboard yang bagus dari yang sekadar lengkap?" — A: Dashboard bagus membuat keputusan lebih cepat: satu tujuan jelas, hierarki status→detail, 5-detik rule, konsisten, dan teruji ke pengguna nyata — bukan jumlah panelnya.',
      quiz: [
        {
          q: 'Piramida informasi dashboard yang benar dari atas ke bawah adalah…',
          options: [
            'Detail → konteks → status',
            'Status ("ada masalah?") → konteks ("seberapa parah?") → detail ("mengapa?")',
            'Iklan → menu → footer',
            'Acak',
          ],
          answer: 1,
          explain: 'Mata membaca atas→bawah; yang paling penting (status) paling atas.',
        },
        {
          q: 'Uji kegunaan dashboard yang sejati adalah…',
          options: [
            'Pembuatnya bilang bagus',
            'Orang yang tidak ikut membuatnya bisa menjawab "ada masalah tidak?" dalam 10 detik',
            'Banyak panel',
            'Warna-warni',
          ],
          answer: 1,
          explain: 'Pengguna nyata yang menentukan; pembuat selalu bias karena sudah tahu isinya.',
        },
        {
          q: 'Progressive disclosure berarti…',
          options: [
            'Menampilkan semua data sekaligus',
            'Ringkasan dulu, detail via drill-down saat dibutuhkan',
            'Menyembunyikan dashboard',
            'Tanpa judul',
          ],
          answer: 1,
          explain: 'Jangan banjiri pengguna; beri jalan masuk bertingkat ke detail.',
        },
      ],
    },
  ],
};