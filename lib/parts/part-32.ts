// PART 32 — Network Automation Fundamentals (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part32: Part = {
  id: '32',
  number: 'PART 32',
  title: 'Network Automation Fundamentals',
  phaseId: 'fase-7',
  description: 'Dari engineer manual ke engineer modern: konsep automation, CLI vs API, REST, JSON, YAML, dan mindset automation.',
  repoFolder: 'part-32-automation-fundamentals',
  objectives: [
    'Menjelaskan mengapa automation menjadi skill wajib network engineer modern dan mindset di baliknya.',
    'Membandingkan pendekatan manual vs automation serta kapan masing-masing tepat digunakan.',
    'Menjelaskan arsitektur automation: CLI automation, API, REST, HTTP methods, dan authentication.',
    'Membaca dan menulis data dalam format JSON dan YAML — bahasa data dunia automation.',
    'Memahami konsep idempotency: menjalankan script berkali-kali harus menghasilkan keadaan yang sama.',
  ],
  prerequisites: 'Part 13 (MikroTik) untuk konteks perangkat yang di-automate, Part 02 (TCP/IP & OSI), dan Part 23 (monitoring). Part 33 (Linux) membantu karena kebanyakan tool automation berjalan di Linux, tapi tidak wajib sebelum part ini.',
  subbabs: [
    {
      id: '32.1',
      title: 'Mengapa Network Automation?',
      body: `<p><b>Network automation</b> adalah praktik menggunakan software (script, tool, platform) untuk melakukan tugas-tugas jaringan — konfigurasi, monitoring, troubleshooting, dokumentasi — yang sebelumnya dikerjakan manual lewat CLI atau GUI. Singkatnya: <b>daripada mengetik command 50 kali ke 50 router, kamu menulis script sekali, lalu script itu yang bekerja 50 kali</b>.</p>
<h3>Mengapa Dibutuhkan?</h3>
<p>Skala jaringan modern sudah melampaui kemampuan manusia mengetik. Satu enterprise bisa punya ratusan switch, puluhan router, ribuan access point, dan ribuan VLAN. Tugas yang dulu "wajar" dikerjakan manual kini mustahil:</p>
<ul>
<li><b>Skala:</b> deploy 200 access point dengan konfigurasi identik — manual butuh berminggu-minggu, script butuh hitungan menit.</li>
<li><b>Kecepatan & konsistensi:</b> manusia typo. Typo di satu router = outage. Script yang sudah diuji memberi hasil identik setiap kali dijalankan.</li>
<li><b>Kecepatan respon insiden:</b> saat link utama mati di tengah malam, script failover bisa bereaksi dalam detik, manusia butuh menit untuk bangun dan login.</li>
<li><b>Dokumentasi otomatis:</b> setiap perubahan lewat automation tercatat (siapa, apa, kapan) — audit trail gratis.</li>
</ul>
<h3>Mindset yang Berubah</h3>
<p>Automation bukan soal "bisa coding", tapi soal <b>cara berpikir</b>:</p>
<div class="tblwrap"><table>
<tr><th>Network Engineer Tradisional</th><th>Network Engineer Modern</th></tr>
<tr><td>Login ke tiap device, ketik command</td><td>Definisikan "keadaan yang diinginkan", biarkan tool mewujudkannya</td></tr>
<tr><td>Konfigurasi = teks yang diketik</td><td>Konfigurasi = <b>data</b> (YAML/JSON) yang bisa di-version-control</td></tr>
<tr><td>Troubleshooting dari ingatan</td><td>Troubleshooting dari data + script diagnosa yang bisa dipakai ulang</td></tr>
<tr><td>Pengetahuan di kepala satu orang</td><td>Pengetahuan di Git — bisa di-review, diuji, dibagikan</td></tr>
</table></div>
<h3>Cara Kerja Sederhana</h3>
<p>Automation selalu mengikuti pola yang sama: <b>sumber kebenaran</b> (source of truth, mis. file YAML berisi "VLAN 20 = OFFICE") → <b>tool automation</b> (script Python, Ansible) → <b>perangkat</b> (via SSH/CLI atau API) → <b>verifikasi</b> (cek hasil, catat perubahan). Kalau langkah verifikasi dilewati, itu bukan automation — itu judi.</p>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Automation sendiri beroperasi di <b>Layer 7 (aplikasi)</b>: script dan API adalah aplikasi yang "berbicara" ke perangkat. Tapi dampaknya menjangkau semua layer — satu script bisa mengubah VLAN (Layer 2), IP (Layer 3), dan firewall rule (Layer 3–4) sekaligus.</p></div>
<h3>Packet Flow Konseptual</h3>
<p>Ketika script Python di laptop NOC menjalankan command ke MikroTik via SSH, paketnya tetap paket TCP/IP biasa: aplikasi Python membuka koneksi TCP port 22 (Layer 4), SSH mengenkripsi payload (Layer 6/7), paket di-routing lewat jaringan (Layer 3), sampai ke CHR di GNS3. Automation tidak mengubah cara paket berjalan — ia mengubah <b>siapa yang mengetik command</b>: manusia diganti program.</p>`,
      terms: [
        ['Network automation', 'Penggunaan software untuk menjalankan tugas jaringan (konfigurasi, monitoring, troubleshooting) secara otomatis.'],
        ['Source of truth', 'Satu sumber data resmi yang mendefinisikan "keadaan yang diinginkan" jaringan, mis. file YAML di Git.'],
        ['Idempotency', 'Sifat operasi yang aman dijalankan berulang: hasil akhirnya sama. Dibahas penuh di 32.10.'],
        ['Audit trail', 'Catatan siapa mengubah apa dan kapan — penting untuk keamanan dan troubleshooting.'],
      ],
      diagram: `<pre>        POLA DASAR NETWORK AUTOMATION

   [Source of Truth]          [Automation Tool]            [Network Devices]
   file YAML/JSON di Git  ──▶  Python / Ansible   ──▶  Router · Switch · FW
        "VLAN 20=OFFICE"       via SSH / API              (CLI atau API)
                                      │
                                      ▼
                               [Verification]
                            cek hasil + catat log

   Manusia menulis SEKALI  →  mesin mengeksekusi BERKALI-KALI (konsisten)</pre>`,
      scenario: 'NOC sebuah bank punya 120 router cabang. Setiap akhir bulan, password SNMP harus diganti di semua router. Dikerjakan manual oleh 2 engineer: 3 hari, 4 typo, 1 router terkunci. Setelah automation: 1 script, 11 menit, 0 typo, lengkap dengan log perubahan per router.',
      bestPractices: 'Mulai automation dari tugas yang paling sering diulang dan paling membosankan (backup config, audit VLAN), bukan dari yang paling keren. Tugas repetitif = ROI tercepat dan risiko terendah.',
      security: 'Script automation menyimpan kredensial — JANGAN hardcode password di script. Gunakan variabel environment atau secret manager. Script yang bocor ke Git publik = semua password perangkat bocor. Dibahas detail di 32.9.',
      challenge: 'Identifikasi 3 tugas repetitif di lab kamu (mis. backup config CHR, cek status interface, audit IP) dan urutkan berdasarkan frekuensi × waktu pengerjaan. Itulah kandidat automation pertamamu.',
      interviewQ: 'Q: Mengapa perusahaan membutuhkan network automation? — A: Karena skala (ratusan device), konsistensi (menghindari human error/typo), kecepatan respon insiden, dan audit trail. Automation mengubah konfigurasi dari "teks yang diketik" menjadi "data yang di-version-control".',
      quiz: [
        { q: 'Apa definisi network automation yang paling tepat?', options: ['Mengganti semua network engineer dengan AI', 'Menggunakan software untuk menjalankan tugas jaringan yang sebelumnya manual, secara konsisten dan terukur', 'Membeli perangkat jaringan yang mahal', 'Mengetik command CLI lebih cepat'], answer: 1, explain: 'Automation = software mengerjakan tugas repetitif secara konsisten; engineer tetap dibutuhkan untuk merancang, menguji, dan mengawasi.' },
        { q: 'Apa itu "source of truth" dalam automation?', options: ['Router dengan uptime tertinggi', 'Satu sumber data resmi yang mendefinisikan keadaan jaringan yang diinginkan, mis. file YAML di Git', 'Dokumentasi yang ditulis tangan', 'Backup config terakhir'], answer: 1, explain: 'Source of truth adalah definisi tunggal "seharusnya seperti apa" jaringan — automation mewujudkannya ke perangkat.' },
        { q: 'Mengapa automation mengurangi outage dibanding cara manual?', options: ['Karena script tidak pernah salah ketik dan memberi hasil identik setiap dijalankan', 'Karena script lebih cepat mengetik', 'Karena automation tidak butuh listrik', 'Karena script bisa bekerja tanpa jaringan'], answer: 0, explain: 'Konsistensi adalah kuncinya: script teruji menghasilkan output identik, sedangkan manusia bisa typo — dan typo di production bisa berarti outage.' },
      ],
    },
    {
      id: '32.2',
      title: 'Manual vs Automation',
      body: `<p>Tidak semua hal harus di-automate. Engineer yang baik tahu <b>kapan mengetik manual dan kapan menulis script</b>. Bagian ini memberi kerangka keputusannya.</p>
<h3>Perbandingan Head-to-Head</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Manual (CLI/GUI)</th><th>Automation (Script/Tool)</th></tr>
<tr><td>Kecepatan untuk 1 device</td><td>Cepat — langsung ketik</td><td>Lambat — harus tulis & uji script dulu</td></tr>
<tr><td>Kecepatan untuk 50 device</td><td>Sangat lambat, melelahkan</td><td>Cepat — script jalan paralel</td></tr>
<tr><td>Konsistensi</td><td>Rendah — tiap orang/tiap hari bisa beda</td><td>Tinggi — hasil identik setiap run</td></tr>
<tr><td>Human error</td><td>Tinggi — typo, lupa langkah</td><td>Rendah — asal script sudah diuji</td></tr>
<tr><td>Traceability</td><td>Rendah — siapa mengubah apa sering tidak tercatat</td><td>Tinggi — log + Git history otomatis</td></tr>
<tr><td>Skill yang dibutuhkan</td><td>CLI/GUI per vendor</td><td>CLI + scripting + Git + pemahaman API</td></tr>
<tr><td>Cocok untuk</td><td>Eksplorasi, troubleshooting, one-off change</td><td>Tugas berulang, multi-device, terjadwal</td></tr>
</table></div>
<h3>Aturan Praktis: Kapan Apa?</h3>
<ul>
<li><b>Tetap manual:</b> troubleshooting insiden yang belum pernah terjadi (kamu butuh eksplorasi bebas), perubahan satu kali di satu device, belajar konsep baru.</li>
<li><b>Automate:</b> tugas yang dilakukan &gt;3 kali dengan pola sama, perubahan ke banyak device, tugas terjadwal (backup harian), validasi compliance berkala.</li>
</ul>
<h3>Jebakan Umum</h3>
<p><b>Automating a mess:</b> meng-automate proses yang kacau hanya menghasilkan kekacauan yang lebih cepat. Rapikan dulu prosesnya (standarkan penamaan, standarkan VLAN — seperti skema VLAN 10/20/30/40/99 di kurikulum ini), baru automate. <b>Automation tanpa testing:</b> script yang belum diuji di lab lalu dijalankan ke 50 router production adalah cara tercepat membuat 50 masalah sekaligus. Aturannya: <b>lab dulu, production kemudian</b> — selalu.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di LAB (GNS3 + CHR), silakan eksperimen bebas — snapshot VM adalah sahabatmu. Di PRODUCTION, setiap script automation wajib: (1) diuji di lab yang mirip production, (2) punya mode dry-run (lihat tanpa mengubah), (3) punya rollback plan, (4) dijalankan di maintenance window.</p></div>`,
      terms: [
        ['Dry-run', 'Mode eksekusi yang hanya menampilkan "apa yang akan diubah" tanpa benar-benar mengubah — wajib sebelum run ke production.'],
        ['Rollback plan', 'Rencana mengembalikan ke keadaan semula jika automation gagal (mis. restore backup config).'],
        ['Maintenance window', 'Jadwal resmi kapan perubahan boleh dilakukan di production, biasanya di luar jam sibuk.'],
      ],
      scenario: 'Engineer junior meng-automate "ganti password admin" ke 30 switch production tanpa dry-run. Ternyata ada typo di template — 30 switch kini punya password yang tidak diketahui siapa pun. Butuh 2 hari reset fisik satu per satu. Pelajaran: script ke production tanpa dry-run = bom waktu.',
      bestPractices: 'Gunakan aturan "3 kali": jika kamu melakukan hal yang sama 3 kali, berhentilah dan automate yang ke-4. Tapi automate hanya proses yang sudah stabil dan terdokumentasi.',
      security: 'Script automation sering berjalan dengan akun ber-privilege tinggi. Batasi akses file script (chmod 600), simpan kredensial di secret manager, dan log setiap eksekusi.',
      challenge: 'Ambil satu tugas lab yang pernah kamu lakukan manual (mis. konfigurasi VLAN di CHR) dan tulis langkahnya sebagai daftar bernomor yang sangat rinci — seolah ditulis untuk robot yang tidak bisa berpikir. Itulah "pseudocode" automation pertamamu.',
      interviewQ: 'Q: Kapan kamu memilih manual dibanding automation? — A: Untuk troubleshooting eksploratif, perubahan one-off di satu device, dan saat belajar konsep baru. Automation untuk tugas berulang, multi-device, dan terjadwal — dengan syarat prosesnya sudah stabil dan script sudah diuji di lab.',
      quiz: [
        { q: 'Kapan automation LEBIH tepat dibanding cara manual?', options: ['Troubleshooting insiden yang belum pernah terjadi', 'Mengganti password SNMP di 120 router cabang setiap bulan', 'Belajar konsep OSPF pertama kali', 'Perubahan satu kali di satu switch'], answer: 1, explain: 'Tugas berulang + multi-device = kandidat automation terbaik; eksplorasi dan one-off change tetap manual.' },
        { q: 'Apa maksud "automating a mess"?', options: ['Meng-automate proses yang kacau sehingga kekacauan terjadi lebih cepat dan lebih luas', 'Membersihkan script yang berantakan', 'Menghapus automation yang gagal', 'Meng-automate proses backup'], answer: 0, explain: 'Standarkan dulu prosesnya (penamaan, skema VLAN/IP), baru automate — kalau tidak, script hanya mempercepat kesalahan.' },
        { q: 'Apa yang WAJIB dilakukan sebelum script automation dijalankan ke production?', options: ['Langsung jalankan saat jam sibuk agar cepat selesai', 'Uji di lab, sediakan dry-run dan rollback plan, jalankan di maintenance window', 'Hapus log agar tidak ketahuan', 'Jalankan tanpa memberitahu tim'], answer: 1, explain: 'Uji di lab + dry-run + rollback plan + maintenance window adalah paket pengaman wajib sebelum menyentuh production.' },
      ],
    },
    {
      id: '32.3',
      title: 'CLI Automation',
      body: `<p><b>CLI automation</b> adalah automation yang bekerja lewat antarmuka baris perintah perangkat — persis seperti kamu mengetik di terminal, tapi yang mengetik adalah program. Ini <b>pintu masuk termudah</b> ke automation karena kamu sudah menguasai CLI dari Part 13 (MikroTik): script hanya "mengetik" command yang sama, lebih cepat dan tanpa typo.</p>
<h3>Cara Kerja Teknis</h3>
<p>Program (mis. script Python dengan library <b>paramiko</b> atau <b>netmiko</b>) membuka koneksi <b>SSH</b> ke perangkat — sama seperti kamu SSH manual. Bedanya: setelah login, program mengirim string command (mis. <code>/interface print</code>) dan membaca output teks yang dikembalikan perangkat. Teknik ini disebut <b>screen scraping</b>: "mengikis" teks dari layar terminal lalu mem-parsing-nya (mencari pola dengan regex atau split string) untuk diambil datanya.</p>
<h3>Kelebihan dan Kelemahan</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>CLI Automation</th></tr>
<tr><td>Kelebihan</td><td>Bisa dipakai di hampir semua perangkat (semua punya CLI); tidak butuh fitur khusus; skill CLI langsung terpakai</td></tr>
<tr><td>Kelemahan</td><td>Output teks tidak terstruktur — parsing rapuh (satu spasi berubah, script rusak); lambat (satu command satu round-trip); error handling sulit</td></tr>
</table></div>
<p>Karena kelemahan itulah industri bergerak ke <b>API</b> (32.4): CLI automation adalah fondasi yang wajib dikuasai, tapi bukan tujuan akhir.</p>
<h3>Hands-on: Pola CLI Automation</h3>
<p><b>Topology:</b> laptop (script Python) → SSH → MikroTik CHR di GNS3 (IP 192.168.99.1, VLAN 99 MANAGEMENT). <b>Objective:</b> ambil daftar interface secara otomatis dan tampilkan yang statusnya down.</p>
<p><b>Configuration (konsep — detail line-by-line di Part 35):</b></p>
<pre># Pola umum CLI automation (pseudocode Python + netmiko)
from netmiko import ConnectHandler   # library SSH khusus network device

router = {                            # 1. definisi target: "siapa yang dihubungi"
    'device_type': 'mikrotik_routeros',
    'host': '192.168.99.1',
    'username': 'admin',
    'password': 'lab-password',       # LAB saja! production pakai secret manager
}
conn = ConnectHandler(**router)       # 2. buka koneksi SSH (seperti kamu mengetik ssh admin@192.168.99.1)
output = conn.send_command('/interface print')  # 3. kirim command, terima output teks
conn.disconnect()                     # 4. tutup koneksi (wajib — jangan biarkan menggantung)

for line in output.splitlines():      # 5. parsing: baca output baris per baris...
    if 'X' in line.split()[0:2]:      #    ...cari penanda interface disabled/down
        print('DOWN:', line)</pre>
<p><b>Verification:</b> bandingkan hasil script dengan <code>/interface print</code> manual di Winbox/terminal — daftar interface down harus sama persis. <b>Failure injection:</b> disable satu interface di CHR (<code>/interface disable ether2</code>), jalankan ulang script — interface tersebut harus muncul di output. <b>Troubleshooting:</b> jika script gagal login, cek (1) SSH aktif di CHR (<code>/ip service print</code> — service ssh harus enabled), (2) firewall tidak memblokir port 22 dari laptop, (3) password benar. <b>Fix & final verification:</b> perbaiki penyebabnya, jalankan ulang, pastikan output konsisten 3x berturut-turut (idempotency baca).</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0">CLI automation yang mengirim command <i>write</i> (mis. <code>/interface disable</code> dalam loop) bisa mematikan banyak interface sekaligus jika ada bug. Tandai script write dengan jelas, selalu uji di lab, dan mulai dengan command <i>read-only</i> (print/monitor) sebelum berani menulis.</p></div>`,
      terms: [
        ['Screen scraping', 'Teknik membaca output teks CLI lalu mem-parsing-nya untuk diambil datanya — fondasi CLI automation.'],
        ['Paramiko', 'Library Python untuk koneksi SSH generik (low-level).'],
        ['Netmiko', 'Library Python di atas Paramiko, khusus untuk network device (paham prompt tiap vendor).'],
        ['Read-only vs write command', 'Command baca (print) aman diulang; command tulis (set/add/disable) mengubah perangkat — perlakukan berbeda.'],
      ],
      diagram: `<pre>        CLI AUTOMATION — "ROBOT MENGETIK DI TERMINAL"

[laptop: script Python]  ──SSH port 22──▶  [MikroTik CHR 192.168.99.1]
        │                                              │
        │  1. kirim: "/interface print"                │
        │─────────────────────────────────────────────▶│
        │  2. terima: output TEKS                      │
        │◀─────────────────────────────────────────────│
        │  3. parsing teks → data (cari "X"/down)       │

Kelemahan: kalau format output berubah (spasi/kolom),
parsing rusak → inilah alasan industri pindah ke API.</pre>`,
      scenario: 'NOC ingin dashboard sederhana "interface down" untuk 10 CHR cabang. Tanpa budget tool monitoring, engineer menulis script netmiko 40 baris yang loop ke 10 router tiap 5 menit dan menulis hasilnya ke file teks. Berjalan 6 bulan tanpa masalah — contoh CLI automation yang tepat guna.',
      bestPractices: 'Mulai CLI automation dari command read-only. Bungkus setiap send_command dengan timeout dan error handling — koneksi SSH ke device bisa menggantung.',
      security: 'Jangan pernah menulis password plaintext di script yang di-commit ke Git. Untuk lab boleh pakai variabel, untuk production wajib secret manager/vault. Batasi user automation dengan privilege minimal (read-only bila cukup).',
      challenge: 'Tanpa menulis code dulu, tulis di kertas: 5 command RouterOS yang akan kamu kirim untuk menjawab "apakah router ini sehat?" (mis. /system resource print, /interface print, /ip route print...). Itulah spesifikasi script monitoring pertamamu.',
      interviewQ: 'Q: Apa kelemahan utama CLI automation dibanding API? — A: Output CLI adalah teks tidak terstruktur sehingga parsing-nya rapuh (berubah sedikit saja script rusak), lambat karena satu command satu round-trip, dan error handling sulit. API memberi data terstruktur (JSON) yang stabil.',
      quiz: [
        { q: 'Apa itu screen scraping dalam konteks CLI automation?', options: ['Mengambil screenshot GUI router', 'Membaca output teks CLI lalu mem-parsing-nya untuk diambil datanya', 'Menghapus konfigurasi layar', 'Meng-crop gambar topologi'], answer: 1, explain: 'Screen scraping = program "membaca layar terminal" (output teks command) lalu mengekstrak data lewat parsing string.' },
        { q: 'Mengapa disarankan memulai CLI automation dari command read-only?', options: ['Karena lebih cepat diketik', 'Karena bug di script write bisa mengubah/memutuskan banyak perangkat sekaligus', 'Karena read-only tidak butuh SSH', 'Karena write command tidak bisa di-automate'], answer: 1, explain: 'Command write (set/disable/add) mengubah keadaan perangkat — bug loop bisa melumpuhkan banyak device. Mulai dari print/monitor yang aman.' },
        { q: 'Library Python apa yang umum dipakai untuk CLI automation ke network device?', options: ['requests dan flask', 'paramiko / netmiko untuk SSH', 'numpy dan pandas', 'django'], answer: 1, explain: 'Paramiko (SSH generik) dan Netmiko (khusus network device, paham prompt tiap vendor) adalah standar industri untuk CLI automation.' },
      ],
    },
    {
      id: '32.4',
      title: 'API',
      body: `<p><b>API (Application Programming Interface)</b> adalah "pintu resmi" agar satu program bisa meminta layanan ke program lain — tanpa meniru manusia mengetik. Kalau CLI automation itu robot yang mengetik di terminal, API itu <b>perangkat yang memang dirancang untuk diajak bicara oleh program</b>.</p>
<h3>Analogi Sederhana</h3>
<p>Bayangkan restoran: kamu (program) tidak masuk dapur dan memasak sendiri (itu CLI scraping — berantakan dan rapuh). Kamu bicara ke <b>pelayan</b> (API): "satu daftar interface" — pelayan kembali dengan <b>menu yang rapi</b> (data terstruktur). Dapur boleh diganti total, selama pelayannya tetap melayani menu yang sama, programmu tidak rusak. Itulah kontrak API.</p>
<h3>Mengapa API Dibutuhkan di Jaringan?</h3>
<ul>
<li><b>Data terstruktur:</b> API mengembalikan JSON (32.6), bukan teks bebas — parsing stabil dan tidak rapuh.</li>
<li><b>Operasi presisi:</b> "ambil interface ether2" lewat satu request, bukan parsing seluruh output <code>print</code>.</li>
<li><b>Integrasi:</b> Zabbix, Grafana, dan script Python semuanya bicara ke perangkat lewat API/protokol terstruktur — inilah fondasi monitoring Part 23–27.</li>
<li><b>Kecepatan:</b> satu request bisa mengambil/mengubah banyak objek sekaligus (bulk operation).</li>
</ul>
<h3>Cara Kerja Teknis</h3>
<p>API di network device umumnya bekerja lewat <b>HTTP/HTTPS</b> (disebut <b>REST API</b>, dibahas di 32.5): program mengirim <b>request</b> (mis. <code>GET /rest/interface</code>) ke IP perangkat, perangkat menjawab dengan <b>response</b> berisi data JSON plus <b>status code</b> (200 = sukses, 401 = auth gagal, 404 = tidak ditemukan). Di OSI, ini murni <b>Layer 7</b>: aplikasi bicara ke aplikasi lewat TCP port 80/443.</p>
<div class="tblwrap"><table>
<tr><th></th><th>CLI Automation</th><th>API</th></tr>
<tr><td>Data</td><td>Teks bebas (parsing rapuh)</td><td>JSON terstruktur (stabil)</td></tr>
<tr><td>Kontrak</td><td>Tidak ada — format output bisa berubah tiap versi</td><td>Ada — endpoint & format dijanjikan vendor</td></tr>
<tr><td>Kebutuhan</td><td>Hanya SSH</td><td>Fitur API harus diaktifkan di device</td></tr>
<tr><td>Contoh</td><td>netmiko kirim <code>/interface print</code></td><td>GET <code>https://192.168.99.1/rest/interface</code></td></tr>
</table></div>
<div class="callout blue"><div class="t">MikroTik & API</div><p style="margin:4px 0 0">RouterOS punya dua API: <b>API klasik</b> (port 8728, protokol biner khusus) dan <b>REST API</b> (RouterOS 7+, lewat HTTPS, lebih mudah dipakai dari Python dengan library <code>requests</code>). Di lab Part 35 kita memakai REST API + SSH — dua jalur resmi menuju automation.</p></div>`,
      terms: [
        ['API', 'Antarmuka resmi agar program bisa meminta layanan ke program/perangkat lain dengan kontrak yang jelas.'],
        ['REST API', 'API yang memakai HTTP/HTTPS dengan pola request-response; standar industri untuk automation modern.'],
        ['Request / Response', 'Permintaan dari client dan jawaban dari server — dua sisi setiap interaksi API.'],
        ['Status code', 'Angka di response HTTP yang menyatakan hasil: 200 sukses, 401 auth gagal, 404 tidak ada, 500 error server.'],
      ],
      diagram: `<pre>              CLI vs API — DUA CARA PROGRAM BICARA KE DEVICE

  CLI automation (robot mengetik):          API (pintu resmi):
  script ──SSH──▶ [Router CLI]              script ──HTTPS──▶ [Router API]
      kirim teks "/interface print"             GET /rest/interface
      terima TEKS BEBAS                         terima JSON RAPI
      parsing manual (rapuh!)                   parsing otomatis (stabil)</pre>`,
      scenario: 'Tim monitoring ingin mengambil utilization CPU dari 50 router tiap menit. Percobaan CLI scraping gagal total saat upgrade RouterOS mengubah format output. Migrasi ke REST API: script tidak berubah sama sekali saat upgrade berikutnya — kontrak API menjaga kompatibilitas.',
      bestPractices: 'Untuk integrasi baru, pilih API dulu; pakai CLI automation hanya untuk perangkat lama yang tidak punya API. Selalu baca dokumentasi API vendor sebelum coding.',
      security: 'API membuka "pintu kedua" ke perangkat selain SSH — pastikan hanya diaktifkan bila dibutuhkan, pakai HTTPS (bukan HTTP), dan batasi IP yang boleh mengakses via firewall.',
      challenge: 'Buka dokumentasi REST API RouterOS (atau vendor lain) dan temukan: (1) cara mengambil daftar interface, (2) status code apa yang dikembalikan bila token salah. Catat endpoint-nya — akan dipakai di 32.5.',
      interviewQ: 'Q: Kapan memilih API dibanding CLI automation? — A: Hampir selalu untuk integrasi baru: data terstruktur (JSON), kontrak stabil antar versi, operasi presisi, dan bulk operation. CLI automation hanya untuk perangkat legacy tanpa API.',
      quiz: [
        { q: 'Apa keunggulan utama API dibanding CLI automation?', options: ['API tidak butuh jaringan', 'API memberi data terstruktur (JSON) dengan kontrak stabil, sehingga parsing tidak rapuh', 'API lebih mudah tanpa dokumentasi', 'API bekerja tanpa autentikasi'], answer: 1, explain: 'Kontrak API + data JSON terstruktur = integrasi stabil antar versi; CLI scraping rusak setiap kali format output berubah.' },
        { q: 'Dalam analogi restoran, API berperan sebagai...', options: ['Dapur', 'Pelayan — perantara resmi dengan "menu" (kontrak) yang jelas', 'Kasir', 'Tukang parkir'], answer: 1, explain: 'Pelayan = antarmuka resmi; kamu tidak masuk dapur (scraping), tapi memesan lewat menu (kontrak API) yang stabil.' },
        { q: 'Status code HTTP 401 artinya...', options: ['Sukses', 'Autentikasi gagal — kredensial salah/tidak ada', 'Halaman tidak ditemukan', 'Server sibuk'], answer: 1, explain: '401 Unauthorized = request ditolak karena autentikasi gagal; 200 sukses, 404 tidak ditemukan.' },
      ],
    },
    {
      id: '32.5',
      title: 'REST API',
      body: `<p><b>REST (Representational State Transfer)</b> adalah gaya arsitektur API paling populer di dunia — dipakai oleh MikroTik (RouterOS 7+), FortiGate, Zabbix, Grafana, dan hampir semua platform cloud. Kalau kamu paham REST, kamu bisa meng-automate hampir semua perangkat modern.</p>
<h3>Arsitektur: Siapa Bicara dengan Siapa, Lewat Apa</h3>
<p>REST selalu melibatkan dua peran lewat protokol <b>HTTP/HTTPS</b>:</p>
<ul>
<li><b>Client</b> — program yang meminta (script Python kamu, Ansible, Postman). Client <b>tidak menyimpan state</b> perangkat; setiap request membawa semua info yang dibutuhkan. Sifat ini disebut <b>stateless</b>: server tidak ingat request sebelumnya, jadi setiap request harus lengkap (termasuk autentikasi).</li>
<li><b>Server</b> — perangkat/aplikasi yang melayani (REST API di CHR, FortiGate, Zabbix server). Server mengekspos <b>resource</b> (objek: interface, VLAN, firewall rule) lewat <b>endpoint</b> — alamat URL seperti <code>https://192.168.99.1/rest/interface</code>.</li>
</ul>
<p>Komunikasi: client kirim <b>HTTP request</b> (method + URL + opsional body JSON) → server proses → server kirim <b>HTTP response</b> (status code + body JSON). Semua lewat TCP port 443 (HTTPS) — di OSI ini murni Layer 7 di atas koneksi Layer 4 yang aman (TLS).</p>
<h3>Hands-on: Menyapa REST API MikroTik</h3>
<p><b>Topology:</b> laptop → HTTPS → CHR 192.168.99.1 (RouterOS 7, REST API aktif). <b>Objective:</b> ambil daftar interface lewat REST dan pahami anatomi request/response.</p>
<p><b>Configuration:</b> aktifkan dulu di CHR (sekali saja, via CLI):</p>
<pre>/ip service set www-ssl disabled=no port=443
# ALASAN: REST API RouterOS berjalan di atas service www-ssl (HTTPS).
# Pakai HTTPS, bukan HTTP — kredensial API tidak boleh lewat teks biasa.</pre>
<p><b>Request</b> (dengan <code>curl</code> dari laptop Linux — <code>curl</code> = tool baris perintah untuk mengirim HTTP request, dibahas di 33.15):</p>
<pre>curl -k -u admin:lab-password https://192.168.99.1/rest/interface
# -k            : abaikan validasi sertifikat (LAB saja! CHR pakai self-signed cert)
# -u admin:...  : HTTP Basic Auth — username:password (32.9)
# GET adalah method default curl: "ambilkan saya data resource ini"</pre>
<p><b>Expected output</b> (disingkat) — response JSON berisi daftar interface:</p>
<pre>[
  {".id": "*1", "name": "ether1", "type": "ether", "running": true, "disabled": false},
  {".id": "*2", "name": "ether2", "type": "ether", "running": false, "disabled": true}
]</pre>
<p><b>Verification:</b> cocokkan <code>"name"</code> dan <code>"disabled"</code> dengan output <code>/interface print</code> di Winbox — harus sama. <b>Failure injection:</b> matikan service www-ssl di CHR lalu ulangi curl — kamu akan dapat <i>connection refused</i>; nyalakan lagi dan request berhasil. <b>Troubleshooting:</b> error 401 = password salah; timeout = firewall memblokir 443 atau IP salah; pesan SSL error tanpa <code>-k</code> = normal untuk self-signed cert di lab. <b>Final verification:</b> ulangi request 3x — hasil konsisten (GET tidak mengubah apa pun: aman diulang).</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><code>-k</code> (abaikan sertifikat) dan Basic Auth via <code>-u</code> hanya untuk LAB. Di production: pasang sertifikat valid, pakai token API (32.9), dan batasi akses REST hanya dari IP management server via firewall.</p></div>`,
      terms: [
        ['REST', 'Gaya arsitektur API berbasis HTTP: client-server, stateless, resource diakses via URL (endpoint).'],
        ['Endpoint', 'Alamat URL sebuah resource API, mis. /rest/interface untuk daftar interface.'],
        ['Stateless', 'Server tidak menyimpan memori antar request; setiap request harus membawa semua info yang dibutuhkan.'],
        ['Resource', 'Objek yang dikelola API: interface, IP address, VLAN, firewall rule.'],
      ],
      diagram: `<pre>              ANATOMI REQUEST-RESPONSE REST

  [Client: script Python / curl]
        │  HTTP REQUEST
        │  GET https://192.168.99.1/rest/interface
        │  Header: Authorization: Basic YWRtaW46...
        ▼
  ══════════ TCP 443 + TLS (HTTPS) ══════════
        ▼
  [Server: REST API di CHR]
        │  HTTP RESPONSE
        │  Status: 200 OK
        │  Body: [ {"name":"ether1",...}, ... ]  (JSON)
        ▼
  [Client] → parsing JSON → data siap dipakai

  Stateless: server lupa request ini detik berikutnya.
  Setiap request baru harus bawa autentikasi lagi.</pre>`,
      scenario: 'Engineer NOC membuat script "health-check.py" yang tiap pagi mengambil /rest/system/resource (CPU, memory, uptime) dari 15 CHR via REST, lalu mengirim ringkasan ke grup chat. Downtime karena resource penuh turun drastis — masalah ketahuan sebelum user komplain.',
      bestPractices: 'Selalu pakai HTTPS untuk REST API. Mulai eksplorasi API dengan GET (read-only) sebelum mencoba POST/PUT/DELETE. Simpan contoh request/response sebagai dokumentasi.',
      security: 'REST API = remote control perangkat via web. Nonaktifkan bila tidak dipakai; bila dipakai, wajib HTTPS + autentikasi kuat + firewall membatasi IP sumber. Basic Auth mengirim kredensial tiap request — di production ganti dengan token.',
      challenge: 'Dengan curl, ambil <code>/rest/system/resource</code> dari CHR lab-mu. Identifikasi field CPU load dan free memory. Lalu matikan www-ssl, ulangi, dan catat errornya — itulah failure injection pertamamu di API.',
      interviewQ: 'Q: Jelaskan arsitektur REST secara sederhana. — A: Client-server via HTTP/HTTPS: client mengirim request (method + URL endpoint + opsional body) ke server; server menjawab dengan status code + body (biasanya JSON). REST bersifat stateless — setiap request mandiri dan membawa autentikasinya sendiri.',
      quiz: [
        { q: 'Apa arti "stateless" dalam REST?', options: ['Server tidak pernah mati', 'Server tidak menyimpan memori antar request; setiap request harus lengkap termasuk autentikasi', 'Client tidak butuh internet', 'API tidak punya endpoint'], answer: 1, explain: 'Stateless = tiap request mandiri; server "lupa" setelah menjawab, jadi request berikutnya harus membawa semua info lagi.' },
        { q: 'Komponen apa saja dalam satu interaksi REST?', options: ['Hanya URL', 'HTTP request (method + URL + opsional body) dan HTTP response (status code + body)', 'Hanya password', 'Kabel dan switch'], answer: 1, explain: 'Request = apa yang diminta client; response = status code + data dari server. Keduanya lewat HTTP/HTTPS.' },
        { q: 'Mengapa contoh di materi memakai HTTPS (port 443), bukan HTTP?', options: ['Karena lebih cepat', 'Karena kredensial dan data API terenkripsi TLS — HTTP mengirimnya sebagai teks biasa', 'Karena HTTP sudah punah', 'Karena port 80 rusak'], answer: 1, explain: 'HTTPS mengenkripsi seluruh komunikasi via TLS; Basic Auth di atas HTTP = password terlihat siapa pun di jalur jaringan.' },
      ],
    },
    {
      id: '32.6',
      title: 'JSON',
      body: `<p><b>JSON (JavaScript Object Notation)</b> adalah format teks untuk bertukar data terstruktur — "bahasa ibu" API modern, file konfigurasi automation, dan output tool monitoring. Kamu sudah melihatnya di 32.5: response REST API MikroTik adalah JSON.</p>
<h3>Anatomi JSON</h3>
<p>JSON hanya punya 6 tipe data: <b>object</b> (<code>{...}</code>, pasangan key-value), <b>array</b> (<code>[...]</code>, daftar berurutan), <b>string</b> (<code>"teks"</code>), <b>number</b>, <b>boolean</b> (<code>true/false</code>), dan <b>null</b>. Contoh dari dunia kita:</p>
<pre>{
  "hostname": "CHR-CORE-01",        // string  : nama device
  "uptime": "3d4h12m",              // string  : lama menyala
  "cpu_load": 23,                   // number  : persen
  "vlans": [10, 20, 30, 40, 99],    // array   : daftar VLAN (skema kurikulum!)
  "monitoring": {                   // object bersarang: detail monitoring
    "zabbix": true,                 // boolean : sudah dimonitor?
    "last_check": null              // null    : belum pernah dicek
  }
}</pre>
<h3>Membaca JSON seperti Engineer</h3>
<p>Kunci membaca JSON: ikuti <b>path</b>-nya. <code>vlans[2]</code> = elemen ke-3 array vlans = 30. <code>monitoring.zabbix</code> = true. Tool <code>jq</code> (Linux) dan library <code>json</code> (Python) mem-parse JSON menjadi struktur data native — di Python, object JSON menjadi <b>dict</b> dan array menjadi <b>list</b>, sehingga bisa diakses seperti <code>data["vlans"][2]</code>.</p>
<h3>Hands-on: Parsing Response API</h3>
<p><b>Objective:</b> dari output JSON <code>/rest/interface</code> (32.5), tampilkan hanya interface yang disabled. <b>Configuration</b> (Python):</p>
<pre>import json, requests
# requests = library Python untuk HTTP; json = untuk parsing JSON

resp = requests.get('https://192.168.99.1/rest/interface',
                    auth=('admin', 'lab-password'), verify=False)
# ALASAN verify=False: CHR lab pakai self-signed cert; di production JANGAN dipakai,
# melainkan pasang sertifikat valid atau verify='/path/ca.crt'

data = resp.json()          # parsing: teks JSON -> list of dict Python
for iface in data:          # loop tiap object interface...
    if iface['disabled']:   # ...cek key 'disabled'...
        print(iface['name'], 'DISABLED')   # ...cetak namanya</pre>
<p><b>Expected output:</b> <code>ether2 DISABLED</code> (sesuai contoh 32.5). <b>Verification:</b> cocokkan dengan Winbox. <b>Failure injection:</b> ubah key menjadi <code>iface['disable']</code> (typo) — Python melempar <code>KeyError</code>; inilah mengapa memakai <code>.get('disabled', False)</code> lebih aman di script production. <b>Fix & final verification:</b> perbaiki, jalankan ulang, output benar.</p>
<div class="callout blue"><div class="t">JSON vs Teks CLI</div><p style="margin:4px 0 0">Inilah alasan API mengalahkan screen scraping: <code>iface['disabled']</code> akan tetap benar walau MikroTik merombak total format tampilannya — karena JSON adalah <b>kontrak data</b>, bukan tampilan untuk manusia.</p></div>`,
      terms: [
        ['JSON', 'Format teks data terstruktur (object/array/string/number/boolean/null) — bahasa data API dan automation.'],
        ['Parsing', 'Mengubah teks (JSON/CLI output) menjadi struktur data yang bisa diproses program.'],
        ['Key-value', 'Pasangan "nama: nilai" di dalam object JSON, mis. "name": "ether1".'],
        ['jq', 'Tool Linux untuk memfilter dan mengolah JSON dari baris perintah.'],
      ],
      diagram: `<pre>        JSON → PYTHON: TEKS MENJADI DATA

  Teks JSON (dari API):            Python setelah json parsing:
  {"name":"ether1",        ──▶     {"name": "ether1",     ← dict
   "disabled": false}               "disabled": False}    ← boolean jadi False

  [{"name":"ether1",...},   ──▶     [ {...}, {...} ]       ← list of dict
   {"name":"ether2",...}]

  Akses: data[1]["name"]  →  "ether2"   (path: array index → object key)</pre>`,
      scenario: 'Zabbix mengambil data sensor via API dalam format JSON. Engineer yang paham JSON bisa membaca raw response API saat troubleshooting ("apakah datanya memang tidak ada, atau Zabbix-nya yang salah parsing?") — skill yang membedakan engineer senior.',
      bestPractices: 'Validasi JSON dengan jsonlint/jq sebelum dipakai. Di Python, selalu gunakan .get() dengan default value untuk key yang mungkin tidak ada — API bisa berubah antar versi.',
      security: 'Jangan log seluruh body JSON response ke file log bila berisi field sensitif (password, token). Filter dulu field sensitif sebelum logging.',
      challenge: 'Ambil response <code>/rest/ip/address</code> dari CHR lab, simpan ke file, lalu dengan <code>jq</code> tampilkan hanya kolom address dan interface. (Petunjuk: <code>jq \'.[] | {address, interface}\'</code>.)',
      interviewQ: 'Q: Mengapa JSON lebih baik dari output teks CLI untuk automation? — A: JSON terstruktur dengan kontrak key yang jelas sehingga parsing stabil antar versi; output CLI adalah tampilan untuk manusia yang bisa berubah layout-nya kapan saja dan merusak script scraping.',
      quiz: [
        { q: 'Pasangan mana yang BENAR tentang tipe data JSON?', options: ['Object memakai [ ], array memakai { }', 'Object memakai { } (key-value), array memakai [ ] (daftar berurutan)', 'String ditulis tanpa tanda kutip', 'Boolean ditulis "True" kapital'], answer: 1, explain: 'Object = {key: value}, array = [daftar]; string wajib dikutip ganda; boolean lowercase true/false.' },
        { q: 'Setelah di-parsing di Python, object JSON menjadi... dan array menjadi...', options: ['tuple dan set', 'dict dan list', 'string dan integer', 'class dan function'], answer: 1, explain: 'Library json Python memetakan object→dict dan array→list, sehingga bisa diakses dengan data["key"][index].' },
        { q: 'Mengapa disarankan memakai .get() dibanding [key] saat membaca JSON API?', options: ['Karena lebih cepat', 'Karena .get() tidak error bila key tidak ada (bisa beri default) — API bisa berubah antar versi', 'Karena [key] sudah deprecated', 'Karena .get() menghemat memory'], answer: 1, explain: '.get("x", default) mengembalikan default bila key hilang, menghindari KeyError yang menghentikan script production.' },
      ],
    },
    {
      id: '32.7',
      title: 'YAML',
      body: `<p><b>YAML (YAML Ain't Markup Language)</b> adalah format teks untuk data terstruktur yang dirancang agar <b>mudah dibaca manusia</b> — seperti JSON, tapi tanpa kurung kurawal dan tanda kutip berlebih. YAML adalah bahasa "source of truth" di dunia automation: file inventory, variabel, dan playbook Ansible semuanya YAML.</p>
<h3>JSON vs YAML: Sama, Beda Baju</h3>
<p>Data yang sama, dua penulisan:</p>
<pre># JSON (32.6)                        # YAML — perhatikan: tanpa { } dan " "
{                                    hostname: CHR-CORE-01
  "hostname": "CHR-CORE-01",          uptime: 3d4h12m
  "vlans": [10, 20, 30, 40, 99],      vlans:
  "monitoring": {                       - 10
    "zabbix": true                      - 20
  }                                     - 30
}                                       - 40
                                      monitoring:
                                        zabbix: true</pre>
<p>Aturan main YAML: <b>indentasi (spasi) adalah struktur</b> — seperti Python. List memakai tanda <code>-</code>, key-value memakai <code>key: value</code>. Satu spasi salah = struktur rusak. <b>Jangan pakai tab</b> — YAML hanya menerima spasi.</p>
<h3>Mengapa Automation Suka YAML?</h3>
<ul>
<li><b>Source of truth yang readable:</b> file <code>vlans.yaml</code> berisi definisi VLAN 10/20/30/40/99 bisa dibaca dan di-review oleh manusia (termasuk non-programmer) sebelum di-apply ke 50 switch.</li>
<li><b>Version control friendly:</b> perubahan satu baris = satu diff jelas di Git ("VLAN 40 diganti nama dari GUEST menjadi TAMU").</li>
<li><b>Ansible:</b> seluruh playbook Ansible ditulis YAML (Part 35+ memakai pola ini).</li>
</ul>
<h3>Contoh: Source of Truth VLAN Kurikulum</h3>
<pre># vlans.yaml — SATU file ini mendefinisikan VLAN seluruh lab.
# Script automation membaca file ini, lalu menerapkannya ke semua switch.
vlans:
  - id: 10
    name: CCTV
    subnet: 192.168.10.0/24
    gateway: 192.168.10.1
  - id: 20
    name: OFFICE
    subnet: 192.168.20.0/24
    gateway: 192.168.20.1
  - id: 30
    name: SERVER
    subnet: 192.168.30.0/24
    gateway: 192.168.30.1
  - id: 40
    name: GUEST
    subnet: 192.168.40.0/24
    gateway: 192.168.40.1
  - id: 99
    name: MANAGEMENT
    subnet: 192.168.99.0/24
    gateway: 192.168.99.1
# ALASAN struktur ini: satu perubahan di sini (mis. rename VLAN 40)
# otomatis terpropagasi ke semua device saat script dijalankan —
# tidak ada lagi "lupa update switch nomor 7".</pre>
<div class="callout"><div class="t">Jebakan Indentasi</div><p style="margin:4px 0 0">90% error YAML pemula adalah indentasi: tercampur spasi-tab, atau jumlah spasi tidak konsisten. Gunakan editor dengan "tampilkan karakter tak terlihat" dan validasi dengan <code>python -c "import yaml,sys; yaml.safe_load(open('vlans.yaml'))"</code> sebelum dipakai.</p></div>`,
      terms: [
        ['YAML', 'Format data terstruktur yang human-readable; indentasi spasi menentukan struktur. Bahasa source of truth automation.'],
        ['Playbook', 'File YAML berisi daftar tugas automation yang dieksekusi berurutan (istilah Ansible).'],
        ['Inventory', 'File YAML berisi daftar perangkat target automation (hostname, IP, kredensial ref).'],
      ],
      diagram: `<pre>        DARI YAML KE PERANGKAT: ALUR SOURCE OF TRUTH

  [vlans.yaml di Git] ── dibaca ──▶ [script Python/Ansible]
        │                                   │  loop tiap VLAN
        │  "VLAN 20 = OFFICE"               ▼
        │                           [Switch-1] [Switch-2] ... [Switch-50]
        │                           VLAN 20    VLAN 20          VLAN 20
        ▼                           dibuat     dibuat           dibuat
  [Git log: "tambah VLAN 40 GUEST"]  ← audit trail otomatis

  Ubah 1 file → terapkan ke N device → tercatat di Git.</pre>`,
      scenario: 'Perusahaan menambah VLAN 40 (GUEST) di 35 switch cabang. Cara lama: login satu per satu (2 hari, 3 switch terlewat). Cara YAML: tambah 5 baris di vlans.yaml, review via Git, jalankan playbook 8 menit — 35/35 switch konsisten, lengkap dengan bukti perubahan di Git untuk audit.',
      bestPractices: 'Satu file YAML = satu topik (vlans.yaml, devices.yaml). Komentari ALASAN setiap nilai non-obvious. Validasi sintaks YAML sebelum eksekusi — error indentasi di production itu memalukan.',
      security: 'JANGAN taruh password di file YAML yang di-commit ke Git. Gunakan Ansible Vault atau variabel environment untuk secret; file YAML hanya berisi data non-sensitif.',
      challenge: 'Buat file <code>devices.yaml</code> berisi 3 CHR lab-mu (hostname, IP management 192.168.99.x, role: core/distribution/access). Validasi dengan Python yaml.safe_load. Ini inventory pertamamu.',
      interviewQ: 'Q: Mengapa YAML dipilih sebagai format source of truth dibanding JSON? — A: YAML lebih mudah dibaca dan ditulis manusia (tanpa kurung/kutip berlebih), diff Git-nya bersih, dan menjadi standar Ansible — sehingga definisi infrastruktur bisa di-review oleh tim sebelum di-apply.',
      quiz: [
        { q: 'Apa yang menentukan struktur data dalam YAML?', options: ['Jumlah kurung kurawal', 'Indentasi spasi yang konsisten', 'Jumlah baris kosong', 'Ukuran file'], answer: 1, explain: 'YAML memakai indentasi spasi sebagai struktur (seperti Python); tab dilarang dan inkonsistensi spasi merusak parsing.' },
        { q: 'Bagaimana cara menulis list dalam YAML?', options: ['Dengan kurung siku [ ]', 'Tiap item diawali tanda - (dash) di bawah key yang di-indent', 'Dipisahkan koma dalam satu baris', 'Dengan nomor urut wajib'], answer: 1, explain: 'List YAML ditulis vertikal, tiap item diawali "- " di bawah key induk yang di-indent.' },
        { q: 'Apa peran file YAML seperti vlans.yaml dalam automation?', options: ['Hanya dokumentasi tempel', 'Source of truth: satu definisi resmi yang dibaca script lalu diterapkan konsisten ke banyak device', 'Pengganti firmware', 'File log'], answer: 1, explain: 'Source of truth = definisi tunggal "seharusnya seperti apa"; script mewujudkannya ke perangkat, Git mencatat perubahannya.' },
      ],
    },
    {
      id: '32.8',
      title: 'HTTP Methods',
      body: `<p><b>HTTP methods</b> (disebut juga <i>verbs</i>) adalah "kata kerja" dalam request REST: mereka menyatakan <b>maksud</b> operasimu terhadap sebuah resource. Lima yang wajib hafal:</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>Maksud</th><th>Analogi Jaringan</th><th>Contoh ke CHR</th></tr>
<tr><td><b>GET</b></td><td>Ambil/baca data</td><td><code>/interface print</code></td><td><code>GET /rest/interface</code></td></tr>
<tr><td><b>POST</b></td><td>Buat resource baru</td><td><code>/interface vlan add ...</code></td><td><code>POST /rest/interface/vlan</code> + body JSON</td></tr>
<tr><td><b>PUT</b></td><td>Ganti seluruh resource</td><td><code>set</code> semua parameter</td><td><code>PUT /rest/interface/vlan/*2</code> + body lengkap</td></tr>
<tr><td><b>PATCH</b></td><td>Ubah sebagian field</td><td><code>set name=...</code> satu field</td><td><code>PATCH /rest/interface/vlan/*2</code> + body parsial</td></tr>
<tr><td><b>DELETE</b></td><td>Hapus resource</td><td><code>remove</code></td><td><code>DELETE /rest/interface/vlan/*2</code></td></tr>
</table></div>
<h3>CRUD: Empat Operasi Semesta</h3>
<p>Kelima method di atas memetakan ke pola <b>CRUD — Create, Read, Update, Delete</b>: empat operasi dasar pengelolaan data apa pun. POST=Create, GET=Read, PUT/PATCH=Update, DELETE=Delete. Kalau kamu bisa CRUD lewat API, kamu bisa mengelola <b>seluruh konfigurasi perangkat</b> dari script.</p>
<h3>Sifat Penting: Aman vs Tidak</h3>
<ul>
<li><b>GET aman & idempotent:</b> hanya membaca, boleh diulang kapan pun (itulah mengapa contoh 32.5 aman).</li>
<li><b>DELETE idempotent tapi tidak aman:</b> menghapus yang sudah tidak ada = tetap "tidak ada" (hasil akhir sama), tapi jelas mengubah sistem.</li>
<li><b>POST tidak idempotent:</b> POST dua kali = dua resource baru (duplikat!) — bahaya jika script di-run ulang tanpa cek. Inilah mengapa 32.10 (idempotency) penting.</li>
</ul>
<h3>Hands-on: Siklus CRUD VLAN 40</h3>
<p><b>Objective:</b> buat, baca, ubah, hapus VLAN 40 (GUEST) di CHR via REST. <b>Configuration:</b></p>
<pre># 1. CREATE — buat VLAN 40 (POST + body JSON berisi definisi)
curl -k -u admin:lab-password -X POST https://192.168.99.1/rest/interface/vlan \\
  -H "Content-Type: application/json" \\
  -d '{"name":"vlan40-guest","vlan-id":40,"interface":"ether2"}'
# -X POST         : method = buat resource baru
# -H Content-Type : "body yang saya kirim adalah JSON" — server butuh tahu formatnya
# -d '{...}'      : body = definisi VLAN (nama, ID, parent interface)

# 2. READ — verifikasi (GET)
curl -k -u admin:lab-password https://192.168.99.1/rest/interface/vlan
# Expected: list berisi vlan40-guest dengan .id mis. *5

# 3. UPDATE — ganti nama saja (PATCH: sebagian field)
curl -k -u admin:lab-password -X PATCH https://192.168.99.1/rest/interface/vlan/*5 \\
  -H "Content-Type: application/json" -d '{"name":"vlan40-tamu"}'
# ALASAN PATCH bukan PUT: hanya 1 field berubah; PUT butuh kirim SEMUA field

# 4. DELETE — bersihkan (kembalikan lab seperti semula)
curl -k -u admin:lab-password -X DELETE https://192.168.99.1/rest/interface/vlan/*5</pre>
<p><b>Verification:</b> setelah tiap langkah, cek dengan <code>/interface vlan print</code> di CLI — hasil CLI dan API harus sinkron. <b>Failure injection:</b> jalankan POST yang sama dua kali — tercipta <b>dua</b> VLAN 40 (duplikat! POST tidak idempotent). <b>Troubleshooting:</b> hapus duplikatnya via DELETE, dan catat pelajarannya: script production harus <b>cek dulu sebelum POST</b> (GET dulu, hanya POST bila belum ada). <b>Final verification:</b> GET list VLAN — hanya VLAN bawaan yang tersisa, lab bersih.</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0">DELETE via API tidak ada konfirmasi "are you sure?" seperti di CLI interaktif. Script yang salah target ID bisa menghapus VLAN production. Selalu GET dan verifikasi <code>.id</code> + nama sebelum DELETE, dan uji di lab dulu.</p></div>`,
      terms: [
        ['HTTP method / verb', '"Kata kerja" request REST: GET, POST, PUT, PATCH, DELETE — menyatakan maksud operasi.'],
        ['CRUD', 'Create-Read-Update-Delete: empat operasi dasar pengelolaan resource (POST, GET, PUT/PATCH, DELETE).'],
        ['Idempotent (method)', 'GET/PUT/DELETE/PATCH aman diulang dengan hasil akhir sama; POST tidak — diulang = duplikat.'],
      ],
      diagram: `<pre>        CRUD ↔ HTTP METHODS ↔ ROUTEROS

  CREATE   →  POST    →  /interface vlan add ...
  READ     →  GET     →  /interface vlan print
  UPDATE   →  PUT     →  set SEMUA parameter (body lengkap)
           →  PATCH   →  set SEBAGIAN field (body parsial)
  DELETE   →  DELETE  →  /interface vlan remove

  Aman diulang: GET, PUT, PATCH, DELETE
  JANGAN diulang mentah-mentah: POST (bikin duplikat!)</pre>`,
      scenario: 'Script "provision-cabang.py" memakai POST untuk membuat VLAN. Bug retry (koneksi timeout tapi sebenarnya request sampai) membuat tiap VLAN terduplikat 3x di 20 router. Perbaikan: ubah logika menjadi GET-dulu-baru-POST (idempotent pattern) — dibahas di 32.10.',
      bestPractices: 'Gunakan method yang paling sempit: PATCH untuk ubah 1 field, bukan PUT. Untuk script: selalu GET dulu sebelum POST (cek eksistensi) dan verifikasi target sebelum DELETE.',
      security: 'Batasi method berbahaya (POST/PUT/PATCH/DELETE) hanya untuk akun automation tertentu; akun monitoring cukup diberi hak GET (read-only). Di FortiGate/RouterOS, ini via user group & policy.',
      challenge: 'Buat "cheat sheet" CRUD untuk satu resource lain: <code>/rest/ip/address</code>. Tulis contoh curl untuk Create (tambah 192.168.40.1/24), Read, Update (ganti interface), Delete. Uji semuanya di CHR lab, lalu bersihkan.',
      interviewQ: 'Q: Apa beda PUT dan PATCH? Kapan pakai POST vs PUT? — A: PUT mengganti seluruh resource (body harus lengkap), PATCH hanya mengubah field tertentu. POST untuk membuat resource baru (server yang menentukan ID, tidak idempotent); PUT/PATCH untuk mengubah resource yang sudah ada (idempotent).',
      quiz: [
        { q: 'Method HTTP apa yang setara dengan command RouterOS "/interface vlan add"?', options: ['GET', 'POST', 'DELETE', 'PATCH'], answer: 1, explain: 'POST = Create = membuat resource baru, setara dengan "add" di RouterOS.' },
        { q: 'Mengapa menjalankan POST yang sama dua kali berbahaya?', options: ['Karena server akan meledak', 'Karena POST tidak idempotent — tiap eksekusi membuat resource baru sehingga terjadi duplikat', 'Karena POST membutuhkan password dua kali', 'Karena POST hanya untuk membaca'], answer: 1, explain: 'POST tidak idempotent: diulang = create lagi = duplikat. Script harus cek eksistensi (GET) dulu sebelum POST.' },
        { q: 'Kapan sebaiknya memakai PATCH dibanding PUT?', options: ['Saat ingin menghapus resource', 'Saat hanya mengubah sebagian field — lebih hemat dan lebih aman dari menimpa field lain', 'Saat membuat resource baru', 'Tidak ada bedanya sama sekali'], answer: 1, explain: 'PATCH = update parsial (kirim hanya field yang berubah); PUT = ganti total (wajib kirim semua field, berisiko menimpa yang tidak dimaksud).' },
      ],
    },
    {
      id: '32.9',
      title: 'Authentication',
      body: `<p><b>Authentication</b> (autentikasi) adalah proses membuktikan "saya adalah siapa yang saya klaim" sebelum API mengizinkan akses. Tanpa ini, siapa pun di jaringan bisa mengubah konfigurasi routermu lewat REST. Setiap request API yang mengubah perangkat <b>wajib</b> terautentikasi.</p>
<h3>Metode Umum (dari Paling Sederhana ke Paling Aman)</h3>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Cara Kerja</th><th>Kelebihan</th><th>Kelemahan</th></tr>
<tr><td><b>Basic Auth</b></td><td>Header Authorization Basic berisi base64(user:pass) di tiap request</td><td>Didukung semua; mudah dites via curl -u</td><td>Kredensial dikirim tiap request (base64 BUKAN enkripsi); wajib HTTPS</td></tr>
<tr><td><b>API Key / Token</b></td><td>Header Authorization Bearer berisi token; token didapat sekali via login</td><td>Tidak kirim password tiap request; token bisa dicabut dan diberi masa berlaku</td><td>Token bocor = akses penuh sampai dicabut</td></tr>
<tr><td><b>Certificate</b></td><td>Client membuktikan identitas via sertifikat TLS</td><td>Sangat kuat; tanpa password</td><td>Kompleks: butuh PKI untuk menerbitkan dan me-revoke sertifikat</td></tr>
</table></div>
<p>Catatan penting: <b>base64 bukan enkripsi</b> — ia hanya encoding yang bisa di-decode siapa pun dalam 1 detik. Basic Auth tanpa HTTPS sama dengan password telanjang di kabel. Itulah mengapa 32.5 mewajibkan HTTPS.</p>
<h3>Alur Token (Pola Industri)</h3>
<pre>1. LOGIN (sekali):   POST /login + username/password
                     --&gt; server verifikasi --&gt; response: {"token": "abc123..."}
2. PAKAI (tiap request):  GET /rest/interface
                          Header: Authorization: Bearer abc123...
                          --&gt; server cek token valid? --&gt; ya: proses; tidak: 401
3. LOGOUT/EXPIRE: token kedaluwarsa atau dicabut --&gt; kembali ke langkah 1</pre>
<h3>Menyimpan Kredensial dengan Aman</h3>
<p>Aturan keras, tanpa kecuali:</p>
<ul>
<li><b>JANGAN</b> tulis password atau token langsung di script (hardcode). Script di-copy, di-share, ter-commit ke Git — secret ikut menyebar.</li>
<li><b>LAB:</b> simpan di <b>environment variable</b> (export MIKROTIK_PASS='...' lalu dibaca script) atau file terpisah berizin chmod 600 yang di-gitignore.</li>
<li><b>PRODUCTION:</b> gunakan <b>secret manager / vault</b> (mis. HashiCorp Vault, Ansible Vault) — kredensial terenkripsi, akses tercatat, rotasi terjadwal.</li>
<li>Berikan akun automation <b>privilege minimal</b>: script monitoring cukup user group read; hanya script provisioning yang butuh write.</li>
</ul>
<div class="callout"><div class="t">Insiden Nyata (Pola Umum)</div><p style="margin:4px 0 0">Kasus klasik di industri: engineer mem-push script berisi password admin ke GitHub publik "biar gampang diakses dari mana saja". Bot pemindai menemukannya dalam hitungan menit, router di-scan dan disusupi. Biaya: ganti semua kredensial + audit forensik. Jangan jadi statistik berikutnya.</p></div>`,
      terms: [
        ['Authentication', 'Proses verifikasi identitas client sebelum API memberi akses (basic auth, token, certificate).'],
        ['Basic Auth', 'Metode auth HTTP paling sederhana: base64(user:pass) di tiap request — wajib di atas HTTPS.'],
        ['Bearer token', 'Token yang dibawa di header Authorization; bukti identitas tanpa mengirim password tiap request.'],
        ['Secret manager / Vault', 'Layanan penyimpanan kredensial terenkripsi dengan kontrol akses dan audit (untuk production).'],
      ],
      scenario: 'Audit keamanan menemukan 14 script automation di server NOC berisi password plaintext, 3 di antaranya ter-commit ke repo Git internal yang bisa dibaca 200 karyawan. Remediasi: semua secret dipindah ke Vault, script diubah membaca dari Vault, password dirotasi — 2 minggu kerja yang bisa dihindari sejak awal.',
      bestPractices: 'Pisahkan secret dari code sejak script pertama. Satu file config untuk secret (di-gitignore, chmod 600) + environment variable untuk lab; Vault untuk production. Rotasi kredensial automation terjadwal.',
      security: 'Aktifkan login gagal berulang = blokir sementara (brute-force protection) di perangkat yang API-nya terekspos. Monitor log auth failure — lonjakan 401 bisa berarti serangan.',
      challenge: 'Refactor contoh curl di 32.5/32.8 agar password dibaca dari environment variable (di bash: -u "admin:$MIKROTIK_PASS"). Pastikan tidak ada password yang tertulis di file atau history (gunakan spasi di depan command atau HISTCONTROL).',
      interviewQ: 'Q: Mengapa hardcoding password di script automation berbahaya? Bagaimana yang benar? — A: Script tersebar (copy/share/Git) sehingga secret ikut bocor; base64 bukan enkripsi. Yang benar: environment variable/file chmod 600 yang di-gitignore untuk lab, secret manager/Vault untuk production, plus privilege minimal untuk akun automation.',
      quiz: [
        { q: 'Mengapa Basic Auth WAJIB berjalan di atas HTTPS?', options: ['Karena HTTP lebih lambat', 'Karena base64 hanya encoding (mudah di-decode), sehingga tanpa TLS kredensial terlihat di jaringan', 'Karena HTTPS gratis', 'Karena browser memaksa'], answer: 1, explain: 'Base64 dapat di-decode siapa pun dalam sedetik; TLS/HTTPS yang benar-benar mengenkripsi kredensial di perjalanan.' },
        { q: 'Apa keunggulan token dibanding Basic Auth?', options: ['Token tidak pernah kedaluwarsa', 'Password tidak dikirim tiap request; token bisa dicabut dan diberi masa berlaku', 'Token tidak butuh server', 'Token bisa ditebak'], answer: 1, explain: 'Token = kredensial sekali pakai yang bisa di-revoke/expire; password asli hanya dipakai sekali saat login.' },
        { q: 'Di mana seharusnya password automation disimpan untuk LAB?', options: ['Ditulis langsung di script agar praktis', 'Di environment variable atau file terpisah (chmod 600) yang di-gitignore — tidak di script', 'Di komentar code', 'Di nama file'], answer: 1, explain: 'Pisahkan secret dari code sejak awal: env var/file 600 di-gitignore untuk lab, Vault untuk production.' },
      ],
    },
    {
      id: '32.10',
      title: 'Idempotency',
      body: `<p><b>Idempotency</b> (dibaca: ai-dem-po-ten-si) adalah sifat operasi yang <b>aman dijalankan berulang kali dengan hasil akhir yang sama</b>. Menjalankan 1x atau 10x — keadaan akhirnya identik. Ini adalah <b>konsep terpenting</b> yang membedakan "script berbahaya" dari "automation profesional".</p>
<h3>Mengapa Ini Masalah Besar?</h3>
<p>Di dunia nyata, script <b>gagal di tengah jalan</b>: koneksi putus, timeout, device reboot. Engineer menjalankan ulang script — dan di sinilah bencana terjadi bila script tidak idempotent:</p>
<pre>Script NON-idempotent (BERBAHAYA):        Script IDEMPOTENT (AMAN):
"buat VLAN 40"                             "pastikan VLAN 40 ADA"
  run 1x → 1 VLAN 40  (ok)                   run 1x → 1 VLAN 40  (ok)
  run 2x → 2 VLAN 40  (DUPLIKAT!)            run 2x → 1 VLAN 40  (tetap 1, ok)
  run 3x → 3 VLAN 40  (kacau)                run 10x → 1 VLAN 40 (tetap ok)</pre>
<p>Ingat bencana POST ganda di 32.8? Itulah akibat script non-idempotent + retry otomatis.</p>
<h3>Pola Idempotent: "Pastikan", Bukan "Lakukan"</h3>
<p>Ubah pola pikir dari <b>imperatif</b> ("lakukan X") menjadi <b>deklaratif</b> ("pastikan keadaan = Y"):</p>
<pre># IMPERATIF (non-idempotent):            # DEKLARATIF (idempotent):
POST /rest/interface/vlan                 GET /rest/interface/vlan  → cari VLAN 40
# "buat VLAN 40"                          # "apakah VLAN 40 sudah ada?"
                                          if belum_ada:
                                              POST ...  # buat hanya bila perlu
                                          # "pastikan VLAN 40 ada"</pre>
<p>Dengan pola deklaratif, script boleh dijalankan ulang kapan pun — bahkan dijadwalkan tiap jam — tanpa takut duplikat. Inilah fondasi <b>desired state management</b>: automation terus-menerus memastikan "kenyataan = source of truth".</p>
<h3>Check Mode / Dry-Run: Idempotency Punya Saudara</h3>
<p>Tool automation profesional (Ansible) punya <b>check mode</b>: "tunjukkan apa yang AKAN berubah tanpa benar-benar mengubah". Alur kerja aman: <b>check mode dulu</b> (review diff) → <b>run asli</b> → <b>verifikasi</b>. Tidak ada alasan menjalankan script write ke production tanpa check mode.</p>
<div class="tblwrap"><table>
<tr><th>Operasi</th><th>Idempotent?</th><th>Catatan</th></tr>
<tr><td>GET (baca)</td><td>Ya</td><td>Tidak mengubah apa pun — selalu aman diulang</td></tr>
<tr><td>POST mentah (buat)</td><td><b>Tidak</b></td><td>Wajib dibungkus pola "cek dulu baru buat"</td></tr>
<tr><td>PUT/PATCH (set ke nilai X)</td><td>Ya</td><td>"Set VLAN 40 name=TAMU" 10x = hasil sama</td></tr>
<tr><td>DELETE</td><td>Ya</td><td>Menghapus yang sudah tidak ada = tetap tidak ada</td></tr>
</table></div>
<div class="callout blue"><div class="t">Idempotency = Tidur Nyenyak</div><p style="margin:4px 0 0">Script idempotent boleh di-retry otomatis, dijadwalkan via cron, dan dijalankan ulang setelah gagal — tanpa efek samping. Script non-idempotent butuh manusia mengawasi tiap eksekusi. Automation sejati = idempotent + check mode + verifikasi.</p></div>`,
      terms: [
        ['Idempotency', 'Sifat operasi yang aman diulang: hasil akhir sama walau dieksekusi berkali-kali.'],
        ['Imperatif vs deklaratif', 'Imperatif = "lakukan langkah X"; deklaratif = "pastikan keadaan = Y". Deklaratif menghasilkan idempotency.'],
        ['Desired state', 'Keadaan yang diinginkan (dari source of truth) yang terus dipastikan oleh automation.'],
        ['Check mode / dry-run', 'Eksekusi simulasi: tampilkan perubahan tanpa menerapkannya — wajib sebelum run production.'],
      ],
      diagram: `<pre>        POLA IDEMPOTENT: "PASTIKAN", BUKAN "LAKUKAN"

  ┌─────────────┐
  │ MULAI       │
  └──────┬──────┘
         ▼
  ┌──────────────────┐    ya    ┌──────────────┐
  │ VLAN 40 sudah    ├─────────▶│ SELESAI      │
  │ ada? (GET)       │          │ (tidak ngapa- │
  └──────┬───────────┘          │  ngapain)     │
         │ tidak               └──────────────┘
         ▼
  ┌──────────────────┐
  │ Buat VLAN 40     │
  │ (POST sekali)    │
  └──────┬───────────┘
         ▼
  ┌──────────────────┐
  │ Verifikasi (GET) │
  └──────────────────┘

  Dijalankan 1x atau 100x → hasil akhir SELALU sama.</pre>`,
      scenario: 'Jadwal cron menjalankan script "pastikan NTP server terkonfigurasi" tiap jam di 40 router. Karena idempotent (cek-dulu-baru-set), 40 router × 24 jam × 30 hari = 28.800 eksekusi tanpa satu pun duplikat atau error. Itulah automation yang bisa ditinggal tidur.',
      bestPractices: 'Tulis setiap operasi write dengan pola deklaratif (cek → aksi bila perlu → verifikasi). Sediakan flag --check/dry-run di setiap script. Uji idempotency dengan menjalankan script 3x berturut-turut dan memastikan run ke-2/3 "tidak mengubah apa pun".',
      security: 'Script non-idempotent yang di-retry otomatis bisa menimbulkan perubahan berulang yang mencurigakan di log audit (atau men-trigger rate limit/lockout). Idempotency juga soal keamanan operasional.',
      challenge: 'Tulis ulang contoh POST VLAN 40 dari 32.8 menjadi fungsi idempotent ensure_vlan(id, name): GET dulu, POST hanya bila belum ada, return "created"/"already exists". Uji dengan menjalankannya 3x — output run ke-2 dan ke-3 harus "already exists".',
      interviewQ: 'Q: Apa itu idempotency dan mengapa penting dalam network automation? — A: Sifat aman-diulang dengan hasil akhir sama. Penting karena script nyata bisa gagal di tengah jalan dan harus di-retry; tanpa idempotency, retry menimbulkan duplikat/kerusakan. Dicapai dengan pola deklaratif: cek keadaan dulu, aksi hanya bila perlu, lalu verifikasi.',
      quiz: [
        { q: 'Apa definisi idempotency?', options: ['Script berjalan sangat cepat', 'Operasi aman dijalankan berulang kali dengan hasil akhir yang sama', 'Script tidak butuh autentikasi', 'Operasi yang hanya boleh dijalankan sekali'], answer: 1, explain: 'Idempotent = 1x atau 10x eksekusi, keadaan akhir identik. Fondasi automation yang aman di-retry dan dijadwalkan.' },
        { q: 'Bagaimana membuat operasi POST (buat VLAN) menjadi idempotent?', options: ['Tidak mungkin — POST selalu berbahaya', 'Bungkus dengan pola deklaratif: GET/cek eksistensi dulu, POST hanya bila belum ada, lalu verifikasi', 'Jalankan POST secepat mungkin', 'Hapus VLAN dulu setiap kali'], answer: 1, explain: 'Pola "pastikan ada" (cek → aksi bila perlu → verifikasi) mengubah operasi non-idempotent menjadi aman diulang.' },
        { q: 'Apa fungsi check mode / dry-run?', options: ['Mempercepat eksekusi script', 'Menampilkan apa yang AKAN berubah tanpa benar-benar mengubah — untuk review sebelum run production', 'Menghapus log otomatis', 'Melewati autentikasi'], answer: 1, explain: 'Check mode = simulasi; wajib dipakai untuk mereview diff sebelum script write menyentuh production.' },
      ],
    },
  ],
};
