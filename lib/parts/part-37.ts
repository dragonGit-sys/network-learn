// PART 37 — Automation Project & API Integration (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part37: Part = {
  id: '37',
  number: 'PART 37',
  title: 'Automation Project & API Integration',
  phaseId: 'fase-7',
  description: 'Project capstone automation end-to-end: merancang solusi, integrasi REST API (RouterOS & Zabbix), pipeline terjadwal, dan packaging portfolio GitHub.',
  repoFolder: 'part-37-automation-project',
  objectives: [
    'Merancang solusi automation dari problem nyata: definisi masalah, pemilihan tool yang tepat, dan diagram arsitektur end-to-end SEBELUM menulis code.',
    'Memahami konsep REST API dari nol (HTTP method, JSON, autentikasi) dan menggunakannya dari Python.',
    'Mengintegrasikan RouterOS API dan Zabbix API ke dalam script automation.',
    'Membangun pipeline terjadwal: audit + backup + compliance check dalam satu alur dengan logging dan alerting.',
    'Mengemas seluruh project menjadi portfolio GitHub yang siap dipresentasikan ke recruiter.',
  ],
  prerequisites: 'Part 36 (Ansible — pola automation deklaratif), Part 35 (automation MikroTik via SSH), Part 34 (Python untuk network engineer), Part 23 (Zabbix — untuk integrasi API monitoring). Lab: 3 CHR di GNS3 (192.168.99.0/24), Zabbix server dari Part 23, Python 3 + pip di Linux.',
  subbabs: [
    {
      id: '37.1',
      title: 'Merancang Solusi Automation: Arsitektur Dulu, Coding Kemudian',
      body: `<p>Semua part automation sebelumnya mengajarkan <b>tool</b> (Python di 34, SSH/netmiko di 35, Ansible di 36). Part ini mengajarkan hal yang membedakan engineer junior dan senior: <b>merancang solusi sebelum menyentuh keyboard</b>. Project capstone-mu bukan "script yang jalan", melainkan <b>sistem</b> yang menyelesaikan problem nyata, bisa dijelaskan, diuji, dan dirawat orang lain.</p>
<h3>Dari Problem ke Desain</h3>
<p>Setiap automation yang baik lahir dari kalimat problem yang tajam. Bandingkan:</p>
<div class=\"tblwrap\"><table>
<tr><th>Vague (buruk)</th><th>Tajam (baik)</th></tr>
<tr><td>"Bikin script backup"</td><td>"Backup konfigurasi 12 CHR cabang berjalan manual tiap minggu (2 jam, sering lupa); butuh backup harian otomatis dengan retensi 30 hari dan notifikasi bila gagal"</td></tr>
<tr><td>"Monitoring otomatis"</td><td>"NOC tidak tahu ada perubahan konfigurasi tak terotorisasi sampai audit tahunan; butuh deteksi drift harian dengan alert ke Telegram dalam 24 jam"</td></tr>
</table></div>
<p><b>ALASAN:</b> problem yang tajam menentukan <i>kriteria sukses</i> — tanpa itu kamu tidak tahu kapan project "selesai".</p>
<h3>Memilih Tool yang Tepat</h3>
<div class=\"tblwrap\"><table>
<tr><th>Tool</th><th>Cocok untuk</th><th>Kurang cocok untuk</th></tr>
<tr><td>Python + netmiko (35)</td><td>Logika kompleks, parsing custom, integrasi API</td><td>Konfigurasi massal sederhana berulang</td></tr>
<tr><td>Ansible (36)</td><td>Konfigurasi massal idempotent, desired state</td><td>Alur bercabang kompleks, data gathering custom</td></tr>
<tr><td>REST API langsung (37)</td><td>Integrasi antar sistem (Zabbix, ticketing), data terstruktur</td><td>Device yang API-nya terbatas</td></tr>
<tr><td>Bash/cron (33)</td><td>Scheduling, glue sederhana</td><td>Logika kompleks</td></tr>
</table></div>
<p>Capstone part ini <b>menggabungkan semuanya</b>: Python untuk logika + API, Ansible untuk konfigurasi, cron untuk jadwal.</p>
<h3>Diagram Arsitektur End-to-End (Capstone)</h3>
<pre>              ┌─────────────────────┐
              │  Scheduler (cron /  │
              │  systemd timer)     │  "jam weker" — jalan harian 02:00
              └─────────┬───────────┘
                        ▼
        ┌───────────────────────────────┐
        │  pipeline.py (orkestrator)     │
        │  1. audit  2. backup  3. cek   │
        │     compliance  4. laporan     │
        └─┬──────────┬──────────┬───────┘
          │ SSH/API  │ REST API │ SSH/API
          ▼          ▼          ▼
   ┌────────────┐ ┌────────┐ ┌────────────┐
   │ 3× CHR     │ │ Zabbix │ │ Git repo   │
   │ 192.168.   │ │ API    │ │ (backup +  │
   │ 99.11-13   │ │ trigger│ │  laporan)  │
   └────────────┘ └────────┘ └────────────┘
          │                         │
          └─────► alert Telegram ◄──┘
                (hanya bila gagal /
                 drift ditemukan)</pre>
<p><b>Hands-on 37.1:</b> tulis <code>DESIGN.md</code> satu halaman untuk capstone-mu: (1) problem statement tajam, (2) kriteria sukses yang terukur, (3) pilihan tool + alasannya, (4) diagram arsitektur seperti di atas. <b>Verification:</b> minta teman/engineer lain membaca — bila mereka paham tanpa bertanya, desainmu cukup jelas. <b>Failure injection:</b> sengaja tulis problem yang vague ("bikin automation") dan rasakan betapa mustahil menentukan "selesai". <b>Fix:</b> tajamkan hingga ada angka (berapa device, berapa sering, berapa lama).</p>
<div class=\"callout\"><div class=\"t\">Aturan Emas Part Ini</div><p style=\"margin:4px 0 0\">Tidak ada baris code yang ditulis sebelum <code>DESIGN.md</code> selesai dan masuk akal. Engineer senior menghabiskan 70% waktu berpikir, 30% coding — junior kebalikannya, dan itu terlihat di hasilnya.</p></div>`,
      terms: [
        ['Solution design', 'Tahap merancang solusi (problem, kriteria sukses, pilihan tool, arsitektur) sebelum implementasi.'],
        ['Orchestrator', 'Script/playbook utama yang memanggil langkah-langkah pipeline berurutan.'],
        ['Success criteria', 'Definisi terukur kapan sebuah project dinyatakan selesai/berhasil.'],
      ],
      diagram: `<pre>        ALUR BERPIKIR DESAIN

  PROBLEM (tajam, terukur)
      │
      ▼
  SUCCESS CRITERIA (angka!)
      │
      ▼
  PILIH TOOL (tabel perbandingan)
      │
      ▼
  DIAGRAM ARSITEKTUR (kotak + panah)
      │
      ▼
  BARU BOLEH CODING</pre>`,
      scenario: 'Dua engineer diberi tugas sama ("otomatisasi backup"). Engineer A langsung coding 3 hari, hasilnya script yang hanya jalan di laptopnya. Engineer B menghabiskan 1 hari menulis DESIGN.md, 1 hari coding — hasilnya sistem terjadwal dengan dokumentasi yang bisa diambil alih tim. Saat performance review, project B yang dipromosikan.',
      bestPractices: 'DESIGN.md selalu jadi file pertama di repo. Kriteria sukses harus ada angka (berapa device, SLA berapa). Review desain dengan rekan sebelum coding — 1 jam review menghemat 10 jam rewrite.',
      security: 'Desain harus memuat bagian keamanan sejak awal: di mana secret disimpan, user/API token dengan hak minimal, dan data sensitif apa yang mengalir di pipeline.',
      challenge: 'Tulis DESIGN.md untuk problem di kantormu sendiri (atau skenario: "15 switch akses, konfigurasi VLAN manual, sering salah"). Sertakan problem tajam, 3 kriteria sukses terukur, dan pilihan tool + alasan.',
      interviewQ: 'Q: Bagaimana kamu memulai sebuah project automation? — A: Dari problem statement yang tajam dan kriteria sukses terukur, lalu memilih tool yang tepat (Python/Ansible/API), menggambar arsitektur end-to-end — baru coding. Tanpa desain, automation hanya memindahkan kekacauan manual menjadi kekacauan otomatis.',
      quiz: [
        { q: 'Mengapa DESIGN.md ditulis SEBELUM coding?', options: ['Agar terlihat sibuk', 'Karena template mengharuskan', 'Karena problem yang tajam + kriteria sukses + pilihan tool menentukan arah; coding tanpa desain menghasilkan script yang rapuh dan tak terukur', 'Agar commit pertama cepat'], answer: 2, explain: 'Desain mengubah "script yang jalan" menjadi "sistem yang menyelesaikan problem" — bedanya terlihat saat dirawat orang lain.' },
        { q: 'Mana problem statement yang TAJAM?', options: ['NOC tidak tahu ada perubahan konfigurasi tak terotorisasi sampai audit tahunan; butuh deteksi drift harian dengan alert dalam 24 jam', 'Bikin monitoring otomatis', 'Automation itu penting', 'Rapikan network'], answer: 0, explain: 'Problem tajam menyebut siapa yang sakit, apa dampaknya, dan target terukur — tanpanya kriteria sukses mustahil.' },
        { q: 'Kapan Ansible LEBIH tepat daripada Python + netmiko?', options: ['Selalu', 'Untuk parsing output kompleks', 'Tidak pernah', 'Untuk konfigurasi massal idempotent / desired state yang berulang'], answer: 3, explain: 'Ansible unggul di konfigurasi deklaratif massal; Python unggul di logika kompleks dan integrasi API. Pilih sesuai problem, bukan favoritisme.' },
      ],
    },
    {
      id: '37.2',
      title: 'REST API Concepts untuk Network Engineer',
      body: `<p><b>API</b> (<i>Application Programming Interface</i>) adalah "pintu resmi" agar dua program bisa bicara tanpa manusia. <b>REST API</b> adalah gaya API paling umum: ia memakai protokol <b>HTTP</b> (protokol yang sama dengan saat kamu buka website) untuk bertukar data berformat <b>JSON</b>. Zabbix, NetBox, dan RouterOS v7 semuanya punya REST API — menguasainya berarti automation-mu bisa mengintegrasikan banyak sistem.</p>
<h3>HTTP: Bahasa yang Sudah Kamu Pakai Tiap Hari</h3>
<p>Saat browser membuka halaman, ia mengirim <b>request</b> HTTP dan menerima <b>response</b>. Automation-mu melakukan hal yang sama via code:</p>
<div class=\"tblwrap\"><table>
<tr><th>Method</th><th>Arti</th><th>Analogi network</th></tr>
<tr><td><code>GET</code></td><td>Ambil data (read-only, aman)</td><td>Seperti <code>print</code> di RouterOS</td></tr>
<tr><td><code>POST</code></td><td>Kirim data / buat sesuatu</td><td>Seperti <code>add</code></td></tr>
<tr><td><code>PUT</code>/<code>PATCH</code></td><td>Ubah data yang ada</td><td>Seperti <code>set</code></td></tr>
<tr><td><code>DELETE</code></td><td>Hapus</td><td>Seperti <code>remove</code> — berbahaya!</td></tr>
</table></div>
<p>Response selalu membawa <b>status code</b>: <code>200</code> sukses, <code>201</code> berhasil dibuat, <code>401</code> autentikasi gagal (token salah), <code>404</code> tidak ditemukan, <code>500</code> error di server. <b>ALASAN menghafal pola ini:</b> 90% debugging API adalah membaca status code — 401 berarti cek token, bukan cek code-mu.</p>
<h3>JSON: Format Data API</h3>
<p><b>JSON</b> (<i>JavaScript Object Notation</i>) adalah format teks terstruktur yang dibaca manusia DAN mesin:</p>
<pre>{
  "name": "CHR-CORE-01",      // string dalam tanda kutip
  "uptime": 86400,            // number tanpa kutip
  "disabled": false,          // boolean
  "interfaces": ["ether1", "ether2"]  // array/list
}</pre>
<p>Python mengubah JSON menjadi <code>dict</code> secara otomatis — itulah mengapa integrasi API terasa natural di Python.</p>
<h3>Autentikasi: Token, Bukan Password di URL</h3>
<p>API modern memakai <b>token</b> (string rahasia panjang) sebagai pengganti password tiap request. Alur umum: login sekali → terima token → sertakan token di header tiap request. <b>ALASAN token:</b> bisa dicabut (<i>revoke</i>) tanpa ganti password user, dan bisa dibatasi haknya.</p>
<h3>Code Line-by-Line: Request HTTP Pertama</h3>
<pre>import requests   # 1. library HTTP standar Python (pip install requests)
import os         # 2. untuk baca token dari environment variable

url = 'http://192.168.99.10/zabbix/api_jsonrpc.php'
# 3. endpoint = "alamat pintu" API. Zabbix memakai satu pintu (api_jsonrpc.php)
#    untuk semua operasi; operasi dipilih lewat field "method" di body.

headers = {'Content-Type': 'application/json-rpc'}
# 4. header = "amplop" request; memberitahu server format isi surat (JSON-RPC).

payload = {                                   # 5. body request sebagai dict Python
    'jsonrpc': '2.0',                         #    versi protokol JSON-RPC (aturan Zabbix)
    'method': 'apiinfo.version',              #    operasi: tanya versi API (tanpa auth!)
    'params': {},                             #    parameter operasi (kosong untuk ini)
    'id': 1,                                  #    id bebas untuk mencocokkan response
}
r = requests.post(url, json=payload, headers=headers, timeout=10)
# 6. POST dict sebagai JSON. requests otomatis mengubah dict → teks JSON.
#    timeout=10: jangan menunggu selamanya bila server mati (pola 35.1!).

print(r.status_code)   # 7. HARUS 200. Bila bukan 200 → baca status code dulu!
print(r.json())        # 8. .json() = parse response JSON → dict Python. Selesai.</pre>
<p><b>Verification:</b> jalankan ke Zabbix lab — <code>status_code</code> 200 dan response berisi versi API. <b>Failure injection:</b> matikan Zabbix → <code>ConnectionError</code> (tangkap: diagnosis konektivitas, Part 28!). Salah URL → 404. <b>Troubleshooting:</b> 401 = token salah/kedaluwarsa; 500 = baca log server. <b>Final verification:</b> bungkus dalam fungsi <code>api_call(method, params)</code> yang melempar exception bila status bukan 200 — semua sub-bab berikut memakai fungsi ini.</p>
<div class=\"callout blue\"><div class=\"t\">GET Dulu, Baru WRITE</div><p style=\"margin:4px 0 0\">Aturan yang sama seperti SSH (35.2): kuasai operasi read (<code>GET</code>) sebelum menyentuh write (<code>POST/PUT/DELETE</code>). API yang bisa menghapus dengan satu request menuntut rasa hormat — uji write di lab, selalu.</p></div>`,
      terms: [
        ['REST API', 'Gaya API yang memakai HTTP method (GET/POST/PUT/DELETE) untuk operasi data berformat JSON.'],
        ['JSON', 'Format teks terstruktur (key-value) untuk pertukaran data antar program.'],
        ['Endpoint', 'URL spesifik yang menjadi "pintu" suatu operasi API.'],
        ['Token', 'String rahasia pengganti password untuk autentikasi API; bisa dicabut dan dibatasi haknya.'],
        ['Status code', 'Angka di response HTTP (200/401/404/500) yang menyatakan hasil request.'],
      ],
      diagram: `<pre>        PERCAKAPAN API

  script Python              Server (Zabbix/RouterOS)
       │                              │
       │── POST /api + token ────────▶ │  "ini surat perintah + ID saya"
       │                              │
       │◀── 200 + JSON ─────────────── │  "perintah OK, ini datanya"
       │
  kunci: baca STATUS CODE dulu
  sebelum menyalahkan code-mu</pre>`,
      scenario: 'Tim NOC ingin dashboard TV menampilkan jumlah trigger aktif Zabbix. Tanpa API: seseorang screenshot manual tiap pagi. Dengan API (pola sub-bab ini): script 15 baris mengambil data tiap 5 menit — dashboard selalu live, tanpa sentuhan manusia.',
      bestPractices: 'Selalu set timeout. Baca status code sebelum parse body. Token di env var, bukan di code. Satu fungsi api_call() reusable untuk semua operasi.',
      security: 'Pakai HTTPS bila tersedia (jangan kirim token via HTTP polos di production!). Token dengan hak minimal (read-only untuk script read-only). Rotate token berkala.',
      challenge: 'Dengan fungsi api_call(), ambil versi API Zabbix lab-mu, lalu coba panggil method yang butuh auth tanpa token — catat status code/error yang kembali dan jelaskan artinya.',
      interviewQ: 'Q: Apa beda GET dan POST, dan mengapa penting untuk automation? — A: GET read-only dan aman (idempotent), POST mengubah/membuat sesuatu. Di automation, kuasai GET dulu; operasi write (POST/PUT/DELETE) selalu diuji di lab karena satu request salah bisa menghapus data.',
      quiz: [
        { q: 'Response API mengembalikan status 401. Artinya?', options: ['Server meledak', 'Data tidak ditemukan', 'Sukses', 'Autentikasi gagal — token salah, kedaluwarsa, atau tidak dikirim'], answer: 3, explain: '401 = Unauthorized. Cek token dulu sebelum menyalahkan code — 90% debugging API adalah membaca status code.' },
        { q: 'Mengapa token API lebih baik daripada password di tiap request?', options: ['Bisa dicabut tanpa ganti password user dan bisa dibatasi haknya', 'Lebih pendek', 'Lebih cepat diketik', 'Tidak ada bedanya'], answer: 0, explain: 'Token = kredensial sekali pakai yang terkontrol; revoke satu token tidak melumpuhkan user, dan haknya bisa minimal.' },
        { q: 'Apa fungsi timeout=10 pada requests.post()?', options: ['Mempercepat server', 'Agar script tidak menggantung selamanya bila server mati/tidak merespons', 'Wajib diisi 10', 'Menghemat memori'], answer: 1, explain: 'Tanpa timeout, script bisa hang berjam-jam menunggu server mati — pola yang sama ditekankan di 35.1 untuk SSH.' },
      ],
    },
    {
      id: '37.3',
      title: 'RouterOS API via Python',
      body: `<p>RouterOS punya dua "pintu" API: <b>API klasik</b> (TCP 8728, protokol biner khusus MikroTik — ada sejak v6) dan <b>REST API</b> (HTTPS, JSON — tersedia di RouterOS v7+). Kita pakai REST API karena konsepnya sama dengan 37.2 (HTTP + JSON), sehingga skill-mu transferable ke Zabbix/NetBox.</p>
<h3>Perbedaan Versi RouterOS (Penting!)</h3>
<div class=\"tblwrap\"><table>
<tr><th></th><th>RouterOS v6</th><th>RouterOS v7</th></tr>
<tr><td>REST API</td><td>Tidak ada</td><td>Ada (<code>/rest/...</code> via HTTPS)</td></tr>
<tr><td>API klasik</td><td>Ya (port 8728)</td><td>Ya (tetap didukung)</td></tr>
<tr><td>Rekomendasi</td><td>API klasik / SSH</td><td>REST API untuk integrasi baru</td></tr>
</table></div>
<p><b>ALASAN dibahas:</b> di lapangan kamu akan menemui kedua versi; script yang mengasumsikan v7 akan gagal misterius di v6. Selalu cek versi dulu (<code>/system resource print</code> → <code>version</code>).</p>
<h3>Menyalakan REST API di CHR</h3>
<pre>/ip service print
# pastikan service "www-ssl" enabled (REST berjalan di atasnya, port 443)
# bila belum: /ip service enable www-ssl
# ALASAN www-ssl (HTTPS) bukan www (HTTP): token API tidak boleh lewat teks polos!</pre>
<h3>Code Line-by-Line</h3>
<pre>import requests, os
from requests.auth import HTTPBasicAuth
# 1. HTTPBasicAuth = cara standar mengirim username+password di header HTTP.
#    RouterOS REST memakai basic auth (bukan token seperti Zabbix).

BASE = 'https://192.168.99.11/rest'
# 2. base URL: https (port 443) + path /rest. Ganti IP sesuai CHR lab-mu.
#    Sertifikat self-signed CHR → tambahkan verify=False (LAB SAJA! lihat callout).

auth = HTTPBasicAuth('automation', os.environ['MIKROTIK_PASS'])
# 3. kredensial dari env var (aturan 32.9, 35.1 — tidak pernah hardcode).

r = requests.get(f'{BASE}/interface', auth=auth, verify=False, timeout=10)
# 4. GET /rest/interface = ekuivalen "/interface print" tapi mengembalikan JSON!
#    f'...' = f-string: {BASE} diganti nilai variabel (aman, tanpa sintaks shell).
print(r.status_code)          # 5. harus 200
for i in r.json():            # 6. response = LIST of dict → loop langsung!
    print(i['name'], i.get('disabled', False))
# 7. i['name'] = nama interface; .get('disabled', False) = aman bila key tak ada.

# --- WRITE (uji di LAB): tambah address ---
new_ip = {'address': '192.168.40.99/24', 'interface': 'vlan40-guest'}
r2 = requests.put(f'{BASE}/ip/address', auth=auth, verify=False,
                  json=new_ip, timeout=10)
# 8. PUT ke /rest/ip/address = ekuivalen "/ip address add ...".
#    Perhatikan: ini MENGUBAH router — baca callout di bawah sebelum run!
print(r2.status_code)         # 9. 201/200 = berhasil dibuat</pre>
<p><b>Hands-on flow:</b> Topology: laptop → HTTPS → CHR 192.168.99.11 (v7). Objective: baca interface & resource sebagai JSON. Verification: bandingkan dengan <code>/interface print</code> manual — datanya sama. Failure injection: matikan www-ssl → connection refused; user tanpa hak → 403. Troubleshooting: 401 = password salah; SSL error = sertifikat (LAB: verify=False; production: install CA!). Fix & final verification: perbaiki, ulangi hingga konsisten.</p>
<div class=\"callout\"><div class=\"t\">verify=False HANYA di LAB</div><p style=\"margin:4px 0 0\">CHR memakai sertifikat self-signed sehingga Python menolak koneksi HTTPS. <code>verify=False</code> mematikan verifikasi — boleh di LAB, <b>DILARANG di production</b> (membuka celah man-in-the-middle). Di production: install sertifikat valid di CHR atau tambahkan CA ke trust store.</p></div>`,
      terms: [
        ['REST API (RouterOS)', 'API berbasis HTTPS + JSON di RouterOS v7+ (path /rest/...).'],
        ['API klasik', 'API biner MikroTik via TCP 8728 (v6 & v7) — protokol khusus, bukan HTTP.'],
        ['Basic auth', 'Skema autentikasi HTTP yang mengirim username:password ter-encode di header.'],
        ['verify=False', 'Menonaktifkan verifikasi sertifikat TLS — hanya untuk lab dengan self-signed cert.'],
      ],
      diagram: `<pre>        DUA PINTU API ROUTEROS

  ┌──────────────┐      ┌──────────────┐
  │  REST API    │      │  API klasik  │
  │  HTTPS 443   │      │  TCP 8728    │
  │  JSON        │      │  protokol    │
  │  (v7+)       │      │  biner (v6+) │
  └──────┬───────┘      └──────┬───────┘
         └─────────┬──────────┘
                   ▼
           ┌─────────────┐
           │  CHR target │
           └─────────────┘
  pilih REST untuk integrasi baru (v7)</pre>`,
      scenario: 'Perusahaan migrasi 40 router dari v6 ke v7. Script inventory lama (API klasik) tetap jalan di keduanya — karena engineer mengecek versi dulu dan memilih pintu API yang sesuai, bukan mengasumsikan.',
      bestPractices: 'Cek versi RouterOS di awal script dan pilih API yang sesuai. Mulai dari GET; WRITE selalu di lab dulu. Satu modul/fungsi untuk semua panggilan API.',
      security: 'HTTPS wajib (jangan kirim kredensial via HTTP). verify=False dilarang di production. User API dengan group minimal; batasi source IP di /ip service.',
      challenge: 'Tulis fungsi ros_get(path) dan ros_put(path, data) reusable. Ambil /system/resource sebagai JSON dan cetak versi + uptime + CPU load dalam format rapi.',
      interviewQ: 'Q: Kapan memakai REST API vs SSH/netmiko ke MikroTik? — A: REST API untuk integrasi antar-sistem dan data terstruktur (mudah di-parse, cocok untuk pipeline); SSH/netmiko untuk command yang belum terekspos di API atau butuh perilaku terminal. Keduanya sah — pilih sesuai kebutuhan.',
      quiz: [
        { q: 'Apa perbedaan utama REST API dan API klasik RouterOS?', options: ['Tidak ada', 'API klasik lebih modern', 'REST API memakai HTTPS + JSON (v7+), API klasik memakai protokol biner via TCP 8728 (v6 & v7)', 'REST API hanya untuk Windows'], answer: 2, explain: 'REST = HTTP/JSON (skill transferable); API klasik = protokol khusus MikroTik. Pilih berdasarkan versi RouterOS.' },
        { q: 'Mengapa verify=False hanya boleh di LAB?', options: ['Karena mematikan verifikasi sertifikat TLS sehingga membuka celah man-in-the-middle di production', 'Karena lebih cepat', 'Karena lab lebih aman', 'Tidak ada alasan'], answer: 0, explain: 'Di production, koneksi API tanpa verifikasi sertifikat bisa disadap/diubah penyerang di tengah jalan.' },
        { q: 'Response GET /rest/interface berupa...', options: ['Teks tabel seperti terminal', 'File biner', 'Gambar', 'List of dict (JSON) yang bisa langsung di-loop di Python'], answer: 3, explain: 'Inilah keunggulan API dibanding scraping output SSH: data sudah terstruktur, tak perlu parsing regex.' },
      ],
    },
    {
      id: '37.4',
      title: 'Zabbix API: Ambil Data Monitoring via Script',
      body: `<p>Zabbix menyimpan semua data monitoring di database-nya — dan <b>Zabbix API</b> adalah pintu untuk mengambilnya via program. API ini memakai <b>JSON-RPC</b>: semua request dikirim sebagai <code>POST</code> ke SATU endpoint (<code>/zabbix/api_jsonrpc.php</code>), dan operasi yang diinginkan ditulis di field <code>method</code> (pola yang kamu lihat di 37.2).</p>
<h3>Autentikasi: Login Sekali, Pakai Token</h3>
<pre>import requests, os

URL = 'http://192.168.30.10/zabbix/api_jsonrpc.php'
# 1. IP Zabbix server lab-mu (VLAN 30 SERVER, Part 23). Ganti sesuai lab-mu.
HEAD = {'Content-Type': 'application/json-rpc'}
# 2. header wajib JSON-RPC (37.2).

def api_call(method, params, token=None):
    # 3. SATU fungsi untuk semua operasi — pola reusable (35.2, 37.2).
    body = {'jsonrpc': '2.0', 'method': method, 'params': params, 'id': 1}
    # 4. method = nama operasi Zabbix, mis. 'user.login', 'host.get'.
    if token:
        body['auth'] = token
    # 5. ALASAN: hampir semua method butuh token; user.login pengecualian.
    r = requests.post(URL, json=body, headers=HEAD, timeout=10)
    # 6. POST ke satu endpoint untuk SEMUA operasi — beda dengan REST biasa!
    data = r.json()
    if 'error' in data:
        # 7. Zabbix mengembalikan error di field "error" (bukan selalu HTTP error!).
        #    ALASAN cek ini: status 200 TIDAK menjamin sukses di JSON-RPC.
        raise RuntimeError(f"Zabbix error: {data['error']['data']}")
    return data['result']

token = api_call('user.login',
                 {'username': 'automation', 'password': os.environ['ZBX_PASS']})
# 8. login → terima token string. User 'automation' dibuat di Zabbix GUI
#    (Administration → Users) dengan role read-only dulu (least privilege!).
print('Token didapat:', token[:8] + '...')  # 9. jangan print token penuh di log!</pre>
<h3>Mengambil Data: Host & Trigger</h3>
<pre># --- daftar host yang dimonitor ---
hosts = api_call('host.get', {'output': ['hostid', 'name']}, token)
# 'host.get' = operasi ambil host; 'output' = kolom yang diminta (hemat!).
for h in hosts:
    print(h['hostid'], h['name'])

# --- trigger aktif (masalah yang belum selesai!) ---
triggers = api_call('trigger.get', {
    'output': ['description', 'priority'],
    'filter': {'value': 1},          # value=1 → trigger dalam keadaan PROBLEM
    'sortfield': 'priority', 'sortorder': 'DESC',
}, token)
print(f'{len(triggers)} masalah aktif:')
for t in triggers:
    print(' -', t['description'], '(severity:', t['priority'] + ')')</pre>
<p><b>Hands-on flow:</b> Topology: laptop → HTTP → Zabbix 192.168.30.10. Objective: ambil daftar trigger aktif via API. Verification: bandingkan dengan dashboard Zabbix GUI (Monitoring → Problems) — jumlahnya harus sama. Failure injection: buat trigger test (matikan 1 CHR 5 menit) → jalankan script → trigger muncul. Token salah → error "Session terminated". Troubleshooting: user API belum dibuat / role tanpa akses API; Zabbix frontend setting "API" perlu user dengan tipe yang benar. Fix & final verification: perbaiki, trigger test terdeteksi script dalam 1 menit.</p>
<div class=\"callout\"><div class=\"t\">Jangan Print Token Penuh</div><p style=\"margin:4px 0 0\">Token = password. Di log/script contoh, tampilkan hanya 8 karakter pertama. Di production, token disimpan di Vault (Part 32.9) dan di-<i>revoke</i> berkala.</p></div>`,
      terms: [
        ['JSON-RPC', 'Protokol API di mana semua operasi dikirim sebagai POST ke satu endpoint, dengan nama operasi di field "method".'],
        ['trigger.get / host.get', 'Method Zabbix API untuk mengambil data trigger dan host.'],
        ['api_call()', 'Fungsi reusable pembungkus panggilan Zabbix API dengan penanganan error terpusat.'],
      ],
      diagram: `<pre>        INTEGRASI MONITORING + AUTOMATION

  ┌──────────┐   Zabbix API    ┌───────────┐
  │  Zabbix  │◀───────────────▶│ pipeline  │
  │  server  │  trigger aktif  │  (37.5)   │
  └──────────┘                 └─────┬─────┘
       ▲                            │ digabung
  data dari                     dengan data
  device                        SSH/API CHR
       │                            │
       └────────► LAPORAN ◄─────────┘
           "apa kata monitoring" +
           "apa kata device langsung"</pre>`,
      scenario: 'Insiden jam 3 pagi: link cabang putus. NOC baru tahu dari telepon user jam 7. Setelah integrasi (37.4 + 37.5): pipeline harian mendeteksi trigger "link down" dan mengkorelasikannya dengan data interface CHR — laporan pagi sudah berisi "ether1 CHR-CABANG-03 down sejak 03:12, kemungkinan kabel/fiber".',
      bestPractices: 'Satu fungsi api_call() untuk semua method. Filter di server (params) bukan di client — jangan tarik 10.000 trigger lalu filter di Python. Token read-only untuk script read-only.',
      security: 'Buat user API khusus (bukan Admin!) dengan role minimal. Simpan password/token di env var. Logout (user.logout) di akhir script panjang agar token tidak menggantung.',
      challenge: 'Modifikasi script: hitung jumlah trigger per severity (0-5) dan cetak ringkasan. Lalu buat fungsi yang mengembalikan True bila ada trigger severity >= 4 (disaster).',
      interviewQ: 'Q: Mengapa response HTTP 200 dari Zabbix API belum tentu sukses? — A: Karena JSON-RPC selalu membalas 200 di level HTTP; error operasi ada di field "error" di body JSON. Script harus mengecek field itu — pola yang sama dengan mendeteksi "bad command" di output SSH (35.2).',
      quiz: [
        { q: 'Bagaimana cara kerja Zabbix API (JSON-RPC)?', options: ['Tiap operasi punya URL berbeda', 'Hanya bisa diakses via browser', 'Semua operasi dikirim sebagai POST ke satu endpoint; nama operasi ada di field "method"', 'Via email'], answer: 2, explain: 'Satu pintu (api_jsonrpc.php) untuk semua operasi — method + params di body JSON menentukan apa yang terjadi.' },
        { q: 'Response HTTP 200 tapi operasi gagal. Di mana error-nya?', options: ['Di field "error" pada body JSON response — harus dicek eksplisit oleh script', 'Tidak ada error', 'Di log router', 'Di kabel'], answer: 0, explain: 'JSON-RPC: 200 = "surat terkirim", bukan "perintah berhasil". Cek field error — pelajaran yang sama seperti output SSH.' },
        { q: 'User API Zabbix sebaiknya...', options: ['User Admin agar semua bisa', 'User guest', 'Tanpa user', 'User khusus dengan role/hak minimal sesuai kebutuhan script (least privilege)'], answer: 3, explain: 'Script read-only cukup role read-only. Token bocor dengan hak minimal = kerusakan minimal.' },
      ],
    },
    {
      id: '37.5',
      title: 'Pipeline: Audit + Backup + Compliance dalam Satu Alur',
      body: `<p><b>Pipeline</b> adalah rangkaian langkah automation yang berjalan berurutan seperti ban berjalan pabrik: output langkah 1 menjadi input langkah 2. Di sub-bab ini semua pola part 34–36 digabungkan menjadi SATU alur: <b>audit</b> (kumpulkan data) → <b>backup</b> (amankan) → <b>compliance check</b> (validasi) → <b>laporan</b>.</p>
<h3>Arsitektur Pipeline</h3>
<pre>pipeline.py (orkestrator — "mandor")
   │
   ├─▶ 1. audit.py      SSH/API → 3 CHR → kumpulkan interface/IP/route/resource
   │                     output: data/audit-2026-10-14.json
   ├─▶ 2. backup.py     export .rsc tiap CHR → backup/ → git commit
   ├─▶ 3. validate.py   bandingkan vs desired.yaml → temuan drift
   ├─▶ 4. zabbix.py     tarik trigger aktif via API (37.4)
   └─▶ 5. report.py     gabungkan semua → report-2026-10-14.md
                              │
                    ada temuan/gagal?
                         │ ya
                         ▼
                    alert.py → Telegram</pre>
<p><b>ALASAN urutan ini:</b> audit dulu (baca keadaan), backup (amankan sebelum apa pun), validasi (bandingkan), laporan (komunikasikan). Urutan yang salah — mis. backup setelah perubahan — menghasilkan backup yang tidak bisa dipakai rollback.</p>
<h3>Code Line-by-Line: Orkestrator</h3>
<pre>import subprocess, sys, datetime
from pathlib import Path
# 1. subprocess = menjalankan script lain dari Python ("mandor memanggil pekerja").
#    pathlib = mengelola path file dengan rapi (lebih baik dari string manual).

STEPS = ['audit.py', 'backup.py', 'validate.py', 'zabbix.py', 'report.py']
# 2. daftar langkah BERURUTAN — mengubah urutan cukup edit list ini.

today = datetime.date.today().isoformat()   # 3. '2026-10-14' untuk penamaan file.
log = Path(f'logs/pipeline-{today}.log')    # 4. tiap run punya log sendiri.
log.parent.mkdir(exist_ok=True)             # 5. buat folder logs/ bila belum ada.

failed = []                                 # 6. catat langkah yang gagal.
with log.open('w') as lf:                   # 7. 'w' = tulis baru; semua output ke file.
    for step in STEPS:
        print(f'=== {step} ===')
        p = subprocess.run([sys.executable, step],
                           capture_output=True, text=True, timeout=600)
        # 8. jalankan tiap script sebagai proses terpisah (isolasi!):
        #    - sys.executable = python yang sama (bukan "python" ambigu)
        #    - timeout=600: langkah macet > 10 menit = gagal, jangan gantung pipeline
        lf.write(p.stdout); lf.write(p.stderr)
        # 9. SEMUA output (termasuk error) masuk log — debugging tanpa log = tebak-tebakan.
        if p.returncode != 0:
            # 10. returncode != 0 = script melaporkan gagal (konvensi universal!).
            failed.append(step)
            print(f'GAGAL: {step} — lanjut ke langkah berikut? TIDAK. Berhenti.')
            break
            # 11. ALASAN berhenti: langkah berikut bergantung pada output langkah ini
            #     (report tanpa data audit = laporan kosong yang menyesatkan).

if failed:
    print('PIPELINE GAGAL pada:', failed)
    # 12. di sini panggil alert.py (37.6) — notifikasi, bukan diam!
    sys.exit(1)    # 13. exit code non-nol = "pipeline gagal" untuk scheduler.
print('PIPELINE SUKSES — laporan siap.')</pre>
<p><b>Hands-on flow:</b> Topology: laptop → 3 CHR (192.168.99.11–13) + Zabbix. Objective: jalankan pipeline 5 langkah end-to-end. Verification: cek <code>logs/</code>, <code>data/</code>, <code>report-*.md</code> terisi; bandingkan isi laporan dengan kondisi nyata. Failure injection: matikan 1 CHR → audit.py gagal → pipeline berhenti + alert (BUKAN lanjut dengan data tidak lengkap!). Troubleshooting: langkah mana yang gagal? Baca log-nya — log per langkah membuat diagnosis 5 menit, bukan 5 jam. Fix & final verification: nyalakan CHR, run ulang → SUKSES.</p>
<div class=\"callout blue\"><div class=\"t\">Berhenti Saat Gagal = Fitur</div><p style=\"margin:4px 0 0\">Pipeline yang "tetap lanjut meski langkah gagal" menghasilkan laporan palsu yang terlihat meyakinkan — jauh lebih berbahaya daripada pipeline yang berani bilang GAGAL. Fail fast, fail loud.</p></div>`,
      terms: [
        ['Pipeline', 'Rangkaian langkah automation berurutan di mana output satu langkah menjadi input berikutnya.'],
        ['Orchestrator', 'Script utama yang menjalankan dan mengawasi langkah-langkah pipeline.'],
        ['Return code', 'Angka yang dikembalikan program saat selesai; 0 = sukses, selain itu = gagal.'],
        ['Fail fast', 'Prinsip berhenti segera saat ada kegagalan, alih-alih melanjutkan dengan data rusak.'],
      ],
      diagram: `<pre>        PRINSIP PIPELINE SEHAT

  ┌──────┐   ┌──────┐   ┌──────┐
  │audit │──▶│backup│──▶│valid.│──▶ laporan
  └──┬───┘   └──┬───┘   └──┬───┘
     │ gagal    │ gagal    │ gagal
     ▼          ▼          ▼
  ┌─────────────────────────────┐
  │ BERHENTI + ALERT + LOG      │
  │ (jangan lanjut dengan data  │
  │  setengah — laporan palsu!) │
  └─────────────────────────────┘</pre>`,
      scenario: 'Perusahaan menjalankan "laporan compliance otomatis" yang ternyata tetap hijau meski script audit-nya error 3 bulan (error ditelan, pipeline lanjut). Audit eksternal menemukan 40+ deviasi. Setelah pola fail-fast: kegagalan langkah mana pun langsung alert — tidak ada lagi laporan palsu.',
      bestPractices: 'Tiap langkah: satu tanggung jawab, log sendiri, return code jelas. Orkestrator tipis (hanya urutan + error handling). Data antar-langkah via file (JSON), bukan variabel global.',
      security: 'Log bisa berisi data sensitif (IP, nama device) — simpan log dengan permission terbatas, jangan upload log mentah ke repo publik. Sanitasi sebelum share.',
      challenge: 'Tambahkan langkah ke-6 ke pipeline: <code>notify.py</code> yang hanya jalan bila semua sukses dan mengirim ringkasan "SUKSES: N device, 0 drift". Ubah STEPS dan pastikan urutannya benar.',
      interviewQ: 'Q: Mengapa pipeline harus berhenti saat satu langkah gagal, bukan lanjut? — A: Karena langkah berikut bergantung pada output langkah sebelumnya; melanjutkan menghasilkan laporan palsu yang terlihat meyakinkan — lebih berbahaya daripada kegagalan yang jujur dan ber-alert.',
      quiz: [
        { q: 'Apa peran pipeline.py sebagai orkestrator?', options: ['Melakukan semua pekerjaan sendiri', 'Menjalankan langkah-langkah (audit, backup, validasi, laporan) berurutan, mencatat log, dan berhenti + alert bila ada yang gagal', 'Hanya untuk dokumentasi', 'Menggantikan cron'], answer: 1, explain: 'Orkestrator = mandor: tipis, hanya mengatur urutan dan menangani kegagalan; pekerjaan berat di script masing-masing.' },
        { q: 'Mengapa tiap langkah dijalankan via subprocess terpisah, bukan import fungsi?', options: ['Isolasi: kegagalan/crash satu langkah tidak merusak proses orkestrator; tiap langkah punya return code jelas', 'Agar terlihat keren', 'Lebih cepat', 'Wajib oleh Python'], answer: 0, explain: 'Isolasi proses membuat kegagalan terlokalisasi dan terdiagnosis — crash di audit.py tidak membunuh pipeline.py.' },
        { q: 'Return code 0 vs non-nol artinya?', options: ['Tidak ada arti', '0 = gagal', '0 = sukses, non-nol = gagal — konvensi universal yang dipakai orkestrator & scheduler untuk tahu hasil', 'Hanya untuk Windows'], answer: 2, explain: 'Return code adalah "bahasa" antar-program tentang sukses/gagal; cron/systemd juga membacanya untuk alerting.' },
      ],
    },
    {
      id: '37.6',
      title: 'Scheduling & Logging: Automation yang Jalan Sendiri',
      body: `<p>Script yang harus dijalankan manual tiap hari bukanlah automation — itu <b>tugas terjadwal yang menunggu dilupakan</b>. Sub-bab ini membuat pipeline-mu berjalan sendiri (scheduling) dan bisa diaudit saat ada masalah (logging).</p>
<h3>Scheduling: cron vs systemd timer</h3>
<p><b>cron</b> adalah penjadwal klasik Linux (Part 33): "jalankan perintah ini tiap jam 2 pagi". <b>systemd timer</b> adalah penerusnya: lebih modern, punya log terintegrasi dan status yang mudah dicek. Untuk capstone, kita pakai systemd timer.</p>
<div class=\"tblwrap\"><table>
<tr><th></th><th>cron</th><th>systemd timer</th></tr>
<tr><td>Definisi jadwal</td><td>Baris crontab (<code>0 2 * * *</code>)</td><td>File <code>.timer</code> (<code>OnCalendar=daily</code>)</td></tr>
<tr><td>Log output</td><td>Manual (redirect ke file)</td><td>Otomatis via <code>journalctl</code></td></tr>
<tr><td>Cek status</td><td>Tidak ada (diam-diam)</td><td><code>systemctl status</code></td></tr>
<tr><td>Rekomendasi</td><td>OK untuk cepat</td><td>Untuk sistem production</td></tr>
</table></div>
<h3>Hands-on: Timer Harian</h3>
<pre># /etc/systemd/system/netauto.service  (apa yang dijalankan)
[Unit]
Description=Network Automation Pipeline
[Service]
Type=oneshot
# 1. oneshot = "jalankan sekali sampai selesai" (bukan daemon terus-menerus).
User=automation
# 2. ALASAN user khusus: pipeline tidak butuh root; least privilege (33.4).
WorkingDirectory=/home/automation/network-automation-suite
ExecStart=/usr/bin/python3 pipeline.py
# 3. path ABSOLUT — timer tidak punya PATH interaktif; path relatif = gagal misterius.

# /etc/systemd/system/netauto.timer  (kapan dijalankan)
[Unit]
Description=Run network automation daily
[Timer]
OnCalendar=*-*-* 02:00:00
# 4. "setiap hari jam 02:00" — jam sepi, bila gagal ada waktu perbaiki sebelum jam kerja.
Persistent=true
# 5. ALASAN: bila server mati saat jadwal, jalankan mengejar (catch-up) saat hidup.
[Install]
WantedBy=timers.target</pre>
<pre># Aktifkan & verifikasi
sudo systemctl daemon-reload
sudo systemctl enable --now netauto.timer
systemctl list-timers netauto.timer   # kapan run berikutnya?
journalctl -u netauto.service -n 50   # log run terakhir — debugging di sini!</pre>
<h3>Logging Terstruktur</h3>
<p>Jangan <code>print()</code> sembarangan di pipeline production. Pakai modul <code>logging</code> Python:</p>
<pre>import logging
logging.basicConfig(
    level=logging.INFO,                       # 1. level: DEBUG/INFO/WARNING/ERROR
    format='%(asctime)s [%(levelname)s] %(message)s',
    # 2. format SERAGAM: waktu + level + pesan → log bisa di-parse mesin!
    handlers=[logging.FileHandler('logs/pipeline.log'),
              logging.StreamHandler()]        # 3. ke file DAN console
)
log = logging.getLogger('pipeline')
log.info('Audit dimulai untuk 3 CHR')         # 4. INFO: kejadian normal penting
log.warning('CHR-03 lambat merespons (8s)')   # 5. WARNING: aneh tapi masih jalan
log.error('Backup CHR-02 GAGAL: timeout')     # 6. ERROR: butuh perhatian manusia</pre>
<p><b>ALASAN level:</b> saat insiden jam 3 pagi, kamu <code>grep ERROR</code> — bukan membaca 2000 baris INFO. Level membuat log bisa difilter.</p>
<h3>Alerting: Beri Tahu Manusia Hanya Saat Perlu</h3>
<pre># alert.py — kirim ke Telegram (contoh; pola sama untuk email/Slack)
import requests, os
TOKEN = os.environ['TELEGRAM_BOT_TOKEN']   # 1. secret di env var, selalu!
CHAT = os.environ['TELEGRAM_CHAT_ID']
def alert(msg):
    # 2. SATU fungsi untuk semua alert — ganti channel cukup di sini.
    requests.post(f'https://api.telegram.org/bot{TOKEN}/sendMessage',
                  json={'chat_id': CHAT, 'text': '[NETAUTO] ' + msg},
                  timeout=10)
# 3. dipanggil pipeline.py HANYA saat: gagal total ATAU drift ditemukan.
#    ALASAN anti-spam: alert tiap sukses = alert yang diabaikan saat penting.</pre>
<p><b>Hands-on flow:</b> buat timer yang menjalankan pipeline tiap 5 menit (untuk uji; production: harian). Verification: <code>systemctl list-timers</code> menunjukkan next run; <code>journalctl</code> menunjukkan eksekusi. Failure injection: buat pipeline.py gagal sengaja → pastikan alert terkirim DAN log ERROR tercatat. Troubleshooting: timer tidak jalan = lupa <code>daemon-reload</code> / <code>enable</code>; service gagal = cek journalctl (path relatif? permission user automation?). Final verification: kembalikan ke jadwal harian, 3 run sukses berturut-turut.</p>`,
      terms: [
        ['systemd timer', 'Penjadwal modern Linux: menjalankan service pada jadwal kalender dengan log dan status terintegrasi.'],
        ['oneshot', 'Tipe service systemd yang berjalan sekali sampai selesai (cocok untuk pipeline batch).'],
        ['Structured logging', 'Log dengan format seragam (waktu, level, pesan) sehingga bisa difilter dan di-parse mesin.'],
        ['Alert fatigue', 'Kondisi di mana terlalu banyak alert membuat manusia mengabaikan semuanya — termasuk yang penting.'],
      ],
      diagram: `<pre>        SIKLUS OPERASIONAL PIPELINE

  ┌──────────────┐
  │ systemd timer│── tiap hari 02:00 ──▶ pipeline.py
  └──────────────┘                            │
                                              ▼
                                    ┌──────────────────┐
                                    │ log terstruktur  │
                                    │ (journalctl +    │
                                    │  file)           │
                                    └────────┬─────────┘
                                             │ gagal / drift?
                                             ▼ ya
                                    ┌──────────────────┐
                                    │ alert Telegram   │
                                    │ (hanya penting!) │
                                    └──────────────────┘</pre>`,
      scenario: 'Backup "otomatis" via cron milik senior yang resign — 6 bulan kemudian server penuh, tidak ada yang tahu cron-nya mati 4 bulan lalu (tanpa log, tanpa alert). Dengan timer + logging + alerting: kegagalan hari pertama langsung ketahuan.',
      bestPractices: 'Path absolut di service file. User khusus non-root. Jadwal di jam sepi. Log terstruktur dengan level. Alert hanya untuk yang butuh tindakan manusia.',
      security: 'File service/timer milik root, tidak writable oleh user automation (hindari eskalasi). Token alert di env var dengan permission 600.',
      challenge: 'Buat timer kedua yang menjalankan validate.py saja tiap jam (drift detection cepat), dengan alert terpisah. Pastikan kedua timer tidak berebut resource (atur jam yang berbeda).',
      interviewQ: 'Q: Mengapa systemd timer dipilih dibanding cron untuk pipeline production? — A: Timer punya status yang bisa dicek (list-timers), log terintegrasi (journalctl), dan catch-up bila server mati (Persistent=true) — cron diam-diam: gagal tanpa jejak, tanpa alert.',
      quiz: [
        { q: 'Apa fungsi Persistent=true pada systemd timer?', options: ['Membuat timer permanen', 'Menghemat baterai', 'Tidak ada fungsi', 'Bila server mati saat jadwal, timer mengejar ketertinggalan (catch-up) saat server hidup kembali'], answer: 3, explain: 'Tanpa ini, jadwal yang terlewat saat server mati hilang begitu saja — backup harian bisa bolong tanpa sadar.' },
        { q: 'Mengapa log memakai level (INFO/WARNING/ERROR)?', options: ['Agar berwarna', 'Agar saat insiden bisa filter (mis. grep ERROR) tanpa membaca ribuan baris — log yang tak terfilter tak berguna', 'Wajib oleh Python', 'Agar file kecil'], answer: 1, explain: 'Level mengubah log dari "tumpukan teks" menjadi "sumber yang bisa di-query" — krusial saat debugging jam 3 pagi.' },
        { q: 'Kapan alert Telegram boleh dikirim?', options: ['Hanya saat gagal atau ada temuan drift — alert tiap sukses menciptakan alert fatigue', 'Setiap pipeline sukses', 'Setiap jam', 'Tidak pernah'], answer: 0, explain: 'Alert yang terlalu sering akan diabaikan — termasuk saat benar-benar penting. Hormati perhatian manusia.' },
      ],
    },
    {
      id: '37.7',
      title: 'Testing & Validasi Automation: Pecahkan Lab-mu Sendiri',
      body: `<p>Automation yang tidak diuji adalah <b>bom waktu</b>: ia akan gagal di momen terburuk (tengah malam, saat kamu cuti). Sub-bab ini menerapkan metode kurikulum — <b>LEARN → BUILD → TEST → BREAK → TROUBLESHOOT → FIX</b> — khusus untuk pipeline automation.</p>
<h3>Strategi Testing Bertingkat</h3>
<div class=\"tblwrap\"><table>
<tr><th>Level</th><th>Apa yang diuji</th><th>Contoh</th></tr>
<tr><td>1. Dry-run</td><td>Logika tanpa mengubah apa pun</td><td><code>pipeline.py --dry-run</code>: print "akan melakukan X" tanpa eksekusi</td></tr>
<tr><td>2. Lab terisolasi</td><td>End-to-end di 1 CHR khusus test</td><td>CHR-TEST (192.168.99.99) yang boleh diacak-acak</td></tr>
<tr><td>3. Failure injection</td><td>Perilaku saat hal buruk terjadi</td><td>Matikan CHR, cabut token, penuhkan disk</td></tr>
<tr><td>4. Production (bertahap)</td><td>Rollout terkontrol</td><td>1 device → 10% → semua, dengan rollback plan</td></tr>
</table></div>
<h3>Implementasi --dry-run</h3>
<pre>import argparse
ap = argparse.ArgumentParser()
ap.add_argument('--dry-run', action='store_true',
                help='tampilkan rencana tanpa mengeksekusi')
args = ap.parse_args()
# 1. argparse = parser argumen command-line standar Python.

def apply_change(device, change):
    if args.dry_run:
        print(f'[DRY-RUN] akan menjalankan di {device}: {change}')
        return
    # 2. ALASAN: dry-run memisahkan "logika memutuskan" dari "eksekusi" —
    #    bug logika ketahuan SEBELUM ada yang berubah di device.
    real_apply(device, change)</pre>
<h3>Failure Injection Checklist (wajib lolos semua)</h3>
<pre># 1. Device mati di tengah pipeline → langkah gagal jelas + alert, bukan hang
# 2. Token Zabbix kedaluwarsa → error "auth failed" yang terbaca, bukan traceback misterius
# 3. Disk penuh saat backup → tangani dengan pesan jelas (cek shutil.disk_usage sebelum tulis!)
# 4. desired.yaml typo → validator menolak dengan baris error yang spesifik
# 5. Network lambat (tambah delay) → timeout bekerja, tidak hang selamanya
# 6. Jalankan pipeline 2x bersamaan → lock file mencegah tabrakan (lihat bawah)</pre>
<pre>from pathlib import Path
import sys
LOCK = Path('/tmp/netauto.lock')
if LOCK.exists():
    # 1. lock file = "tanda sedang berjalan". Bila ada → jangan mulai lagi.
    print('Pipeline sudah berjalan (lock ada) — berhenti.')
    sys.exit(2)
LOCK.touch()          # 2. buat tanda
try:
    main()            # 3. jalankan pipeline
finally:
    LOCK.unlink(missing_ok=True)
    # 4. HAPUS tanda di finally — bahkan bila crash! Lock nyangkut = pipeline
    #    tak pernah jalan lagi (failure injection #6 yang sering kejadian).</pre>
<h3>Rollback Plan</h3>
<p>Setiap automation yang MENGUBAH sesuatu wajib punya cara kembali: backup .rsc sebelum perubahan (35.3), Git untuk desired.yaml/playbook, dan dokumentasi "cara undo manual dalam 5 menit". <b>ALASAN:</b> bukan "apakah akan gagal", tapi "kapan" — yang membedakan profesional adalah kecepatan pulih.</p>
<p><b>Hands-on flow:</b> jalankan keenam failure injection di atas ke pipeline-mu, satu per satu. Verification: tiap skenario menghasilkan (a) pesan error jelas, (b) alert bila perlu, (c) tidak ada data setengah-jadi. Troubleshooting: skenario yang "lolos diam-diam" = bug — perbaiki hingga ia gagal dengan jujur. Final verification: semua 6 lolos + dokumentasikan hasilnya di <code>TESTING.md</code>.</p>
<div class=\"callout\"><div class=\"t\">Uji di Lab, Bukan di Production</div><p style=\"margin:4px 0 0\">CHR-TEST (192.168.99.99) adalah "korban" resmi: boleh di-reboot, dihapus confignya, diputus networknya. Aturan keras: <b>tidak ada eksperimen destruktif pertama kali di device production</b> — tanpa pengecualian.</p></div>`,
      terms: [
        ['Dry-run', 'Mode eksekusi yang hanya menampilkan rencana tanpa mengubah apa pun — untuk validasi logika.'],
        ['Failure injection', 'Sengaja menciptakan kondisi gagal (device mati, token salah) untuk menguji ketahanan sistem.'],
        ['Lock file', 'File penanda agar hanya satu instance pipeline berjalan dalam satu waktu.'],
        ['Rollback plan', 'Rencana kembali ke keadaan semula bila automation menyebabkan masalah.'],
      ],
      diagram: `<pre>        TANGGA TESTING AUTOMATION

  Level 1: --dry-run ......... logika benar?
  Level 2: lab terisolasi .... end-to-end jalan?
  Level 3: failure injection . gagal dengan jujur?
  Level 4: rollout bertahap .. aman di production?

  NAIK SATU TANGGA HANYA BILA
  TANGGA DI BAWAHNYA LOLOS</pre>`,
      scenario: 'Script provisioning baru langsung dijalankan ke 50 switch production tanpa dry-run — typo satu variabel menghapus VLAN management di semuanya. Dengan tangga testing: typo itu ketahuan di level 1 (dry-run menampilkan rencana yang salah) — insiden nol.',
      bestPractices: 'TESTING.md mendokumentasikan semua skenario uji + hasil. Lock file selalu dihapus di finally. Rollback plan ditulis SEBELUM automation write pertama.',
      security: 'Failure injection di production dilarang — hanya di lab. Credential test terpisah dari production (jangan pakai token prod di lab!).',
      challenge: 'Tambahkan pengecekan disk space (shutil.disk_usage) di backup.py: bila sisa < 1GB, gagal dengan pesan jelas SEBELUM menulis. Uji dengan failure injection (mock disk penuh).',
      interviewQ: 'Q: Bagaimana kamu memastikan automation aman sebelum ke production? — A: Tangga testing: dry-run untuk logika, lab terisolasi untuk end-to-end, failure injection untuk ketahanan (6 skenario), baru rollout bertahap dengan rollback plan. Tiap level harus lolos sebelum naik.',
      quiz: [
        { q: 'Apa tujuan utama mode --dry-run?', options: ['Menghemat listrik', 'Mempercepat script', 'Memisahkan logika memutuskan dari eksekusi — bug logika ketahuan sebelum ada yang berubah di device', 'Tidak ada'], answer: 2, explain: 'Dry-run menjawab "APA yang akan dilakukan" tanpa risiko; typo/variabel salah terlihat di rencana, bukan di device production.' },
        { q: 'Mengapa lock file dihapus di blok finally?', options: ['Agar rapi', 'Agar lock tidak nyangkut bila pipeline crash — lock nyangkut = pipeline tak pernah jalan lagi', 'Wajib Python', 'Agar cepat'], answer: 1, explain: 'Crash tanpa finally meninggalkan lock selamanya; pipeline berikutnya selalu "melihat" lock dan menolak jalan — failure diam-diam.' },
        { q: 'Urutan testing yang benar adalah...', options: ['Dry-run → lab terisolasi → failure injection → rollout bertahap', 'Production dulu, lab belakangan', 'Langsung rollout penuh', 'Tidak perlu testing'], answer: 0, explain: 'Tangga testing: tiap level harus lolos sebelum naik. Melompati level = memindahkan risiko ke production.' },
      ],
    },
    {
      id: '37.8',
      title: 'Dokumentasi Project: README yang Dibaca Orang',
      body: `<p>Project automation tanpa dokumentasi adalah <b>harta karun tanpa peta</b> — bahkan pembuatnya sendiri lupa cara pakainya 3 bulan kemudian. Dokumentasi yang baik bukan esai panjang, melainkan <b>jawaban cepat atas pertanyaan pembaca</b>.</p>
<h3>Anatomi README yang Baik</h3>
<pre># Network Automation Suite
&gt; Audit, backup & compliance harian untuk 3 MikroTik CHR + integrasi Zabbix.
&gt; Berjalan otomatis via systemd timer; alert Telegram bila gagal/drift.

## Arsitektur
[diagram ASCII dari 37.1]

## Cara Pakai (5 menit)
1. pip install -r requirements.txt
2. cp .env.example .env  → isi kredensial
3. python3 pipeline.py --dry-run   # cek rencana dulu!
4. sudo systemctl enable --now netauto.timer

## Struktur Repo
...

## LAB vs Production
- LAB: verify=False, token di .env
- Production: butuh Vault, sertifikat valid, user API minimal (lihat SECURITY.md)

## Batasan yang Diketahui
- Hanya teruji di RouterOS v7; v6 butuh penyesuaian API (37.3)
- Alert hanya via Telegram (belum email/Slack)</pre>
<p><b>ALASAN tiap bagian:</b> "Cara Pakai (5 menit)" = ambang adopsi; "Batasan yang Diketahui" = kejujuran yang membangun trust (menyembunyikan batasan = bug report marah nanti); "LAB vs Production" = mencegah orang copy-paste praktik lab ke production.</p>
<h3>DESIGN.md, TESTING.md, SECURITY.md</h3>
<div class=\"tblwrap\"><table>
<tr><th>File</th><th>Isi</th><th>Pembaca</th></tr>
<tr><td><code>DESIGN.md</code></td><td>Problem, kriteria sukses, pilihan tool, arsitektur (37.1)</td><td>Engineer yang menilai/mengambil alih</td></tr>
<tr><td><code>TESTING.md</code></td><td>Skenario failure injection + hasil (37.7)</td><td>QA / engineer yang ragu "aman?"</td></tr>
<tr><td><code>SECURITY.md</code></td><td>Di mana secret disimpan, hak minimal, risiko yang diterima</td><td>Security reviewer</td></tr>
<tr><td><code>README.md</code></td><td>Gambaran + cara pakai cepat</td><td>Semua orang (pintu masuk)</td></tr>
</table></div>
<p><b>Hands-on:</b> tulis keempat file untuk capstone-mu. Verification: berikan ke orang yang belum pernah lihat project-mu; bila mereka bisa menjalankan pipeline dalam 15 menit HANYA dari dokumentasi, dokumentasimu lulus. Failure injection: hapus satu bagian README, minta orang lain menebak — bagian yang "tidak bisa ditebak" = bagian yang wajib ada. Troubleshooting: dokumentasi kedaluwarsa (command berubah, file tidak) = bug dokumentasi; perlakukan seperti bug code (perbaiki segera). Final verification: dokumentasi di-review tiap ada perubahan code (jadikan kebiasaan, bukan fase).</p>
<div class=\"callout blue\"><div class=\"t\">Dokumentasi = Interface Manusia</div><p style=\"margin:4px 0 0\">Code adalah interface untuk mesin; dokumentasi adalah interface untuk manusia. Project dengan code brilian tapi tanpa dokumentasi akan kalah dari project biasa yang terdokumentasi baik — karena yang kedua bisa dipakai orang lain.</p></div>`,
      terms: [
        ['README', 'File dokumentasi utama repo: gambaran, cara pakai cepat, dan batasan.'],
        ['DESIGN.md / TESTING.md / SECURITY.md', 'Dokumen pendukung: desain keputusan, bukti testing, dan posture keamanan.'],
      ],
      scenario: 'Recruiter membuka 2 repo kandidat. Repo A: code tanpa README. Repo B: README 5 menit + diagram arsitektur + batasan jujur. Recruiter menghabiskan 10 menit di repo B dan memanggil kandidatnya — repo A bahkan tidak dibuka file keduanya.',
      bestPractices: 'Tulis dokumentasi BERSAMAAN dengan code, bukan "nanti". Sertakan contoh output nyata. Cantumkan batasan dengan jujur. Satu perintah instalasi yang benar-benar bekerja dari nol.',
      security: 'SECURITY.md wajib: daftar secret, di mana disimpan, hak akses minimal, dan risiko yang disadari. Jangan pernah menaruh contoh token ASLI di dokumentasi (pakai placeholder).',
      challenge: 'Minta orang lain menjalankan pipeline-mu HANYA bermodal dokumentasi (kamu dilarang bicara!). Catat setiap pertanyaan mereka — tiap pertanyaan = lubang dokumentasi yang harus ditambal.',
      interviewQ: 'Q: Apa yang kamu tulis di README project automation? — A: Masalah yang diselesaikan, diagram arsitektur, cara pakai 5 menit, struktur repo, bagian LAB vs Production, dan batasan yang diketahui dengan jujur — karena README adalah pintu masuk yang menentukan apakah orang mau memakai project saya.',
      quiz: [
        { q: 'Mengapa bagian "Batasan yang Diketahui" penting di README?', options: ['Agar terlihat rendah hati', 'Wajib template', 'Agar README panjang', 'Kejujuran membangun trust; menyembunyikan batasan berujung bug report marah dan hilangnya kepercayaan'], answer: 3, explain: 'Batasan yang dinyatakan = ekspektasi yang terkelola. Batasan yang disembunyikan = kekecewaan yang tak terhindarkan.' },
        { q: 'Apa isi DESIGN.md?', options: ['Kumpulan code', 'Problem, kriteria sukses, pilihan tool + alasan, dan diagram arsitektur — keputusan DESAIN sebelum coding', 'Daftar belanja', 'Log error'], answer: 1, explain: 'DESIGN.md menangkap "mengapa begini" — hal yang tidak bisa ditebak dari code saja, dan paling berharga saat project diambil alih.' },
        { q: 'Uji terbaik untuk dokumentasi adalah...', options: ['Orang lain bisa menjalankan sistem HANYA dari dokumentasi tanpa bertanya', 'Dibaca sendiri', 'Banyak halaman', 'Bahasa Inggris'], answer: 0, explain: 'Dokumentasi diuji seperti software: "user test". Bila orang lain stuck, dokumentasinya yang bug — bukan orangnya yang bodoh.' },
      ],
    },
    {
      id: '37.9',
      title: 'Packaging untuk Portfolio GitHub',
      body: `<p>Project capstone-mu bukan sekadar tugas belajar — ia adalah <b>bukti kerja</b> (portfolio) yang dilihat recruiter. Packaging yang rapi mengubah "pernah belajar automation" menjadi "punya sistem automation yang berjalan".</p>
<h3>Struktur Repo yang Profesional</h3>
<pre>network-automation-suite/
├── README.md            # pintu masuk (37.8)
├── DESIGN.md            # keputusan desain
├── TESTING.md           # bukti testing
├── SECURITY.md          # posture keamanan
├── requirements.txt     # requests, pyyaml, netmiko
├── .env.example         # TEMPLATE kredensial (tanpa nilai asli!)
├── .gitignore           # .env, __pycache__, logs/, data/
├── LICENSE              # MIT — orang boleh pakai & modifikasi
├── inventory.yaml       # daftar device lab
├── desired.yaml         # desired state (compliance)
├── lib/
│   ├── common.py        # logging, config, api_call
│   ├── rosapi.py        # fungsi RouterOS API (37.3)
│   └── zbxapi.py        # fungsi Zabbix API (37.4)
├── audit.py  backup.py  validate.py  zabbix.py  report.py  alert.py
├── pipeline.py          # orkestrator (37.5)
└── systemd/
    ├── netauto.service
    └── netauto.timer    # jadwal (37.6)</pre>
<h3>Tiga File yang Sering Dilupakan</h3>
<p><b>1. <code>.env.example</code></b> — template TANPA nilai asli. ALASAN: orang lain tahu variabel apa yang dibutuhkan tanpa kamu membocorkan secret-mu:</p>
<pre># copy ke .env lalu isi
MIKROTIK_PASS=
ZBX_PASS=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=</pre>
<p><b>2. <code>.gitignore</code></b> — benteng terakhir anti-bocor secret:</p>
<pre>.env
__pycache__/
*.pyc
logs/
data/
*.rsc</pre>
<p><b>3. <code>LICENSE</code></b> — tanpa lisensi, orang (termasuk perusahaan) secara hukum TIDAK BOLEH memakai code-mu. MIT = "pakai bebas, cantumkan kredit". <b>ALASAN:</b> portfolio yang tidak bisa dipakai ulang kehilangan separuh nilainya.</p>
<h3>Ritual Sebelum Push (JANGAN SKIP)</h3>
<pre># 1. cari secret yang nyangkut
grep -ri "password\|token\|secret" . --exclude-dir=.git --exclude="*.md"
# 2. pastikan .env tidak ikut
git status --short   # .env TIDAK boleh muncul di sini!
# 3. cek history (secret bisa nyangkut di commit lama!)
git log -p --all -S "password" | head -20
# 4. test instalasi dari nol (clone fresh di folder lain, ikuti README)
# 5. baru push</pre>
<p><b>Hands-on flow:</b> kemas capstone-mu mengikuti struktur di atas. Verification: clone repo-mu sendiri di folder/dengan user berbeda, ikuti README dari nol — harus jalan. Failure injection: sengaja taruh password dummy di code, jalankan ritual — grep harus menemukannya SEBELUM push. Troubleshooting: secret terlanjur ter-push = revoke token/ganti password SEGERA (menghapus commit tidak menghapus dari history yang sudah di-clone orang!). Final verification: repo publik, bersih, terinstal dari nol.</p>
<div class=\"callout\"><div class=\"t\">Secret yang Ter-push = Insiden</div><p style=\"margin:4px 0 0\">Token/password yang masuk ke repo publik harus dianggap <b>bocor</b>: revoke/ganti segera, jangan hanya "hapus commit". Pencegahan (ritual di atas) jauh lebih murah daripada respons insiden.</p></div>`,
      terms: [
        ['.env.example', 'Template variabel environment tanpa nilai asli — dokumentasi kebutuhan kredensial.'],
        ['.gitignore', 'Daftar file yang tidak boleh masuk Git (secret, cache, log, data).'],
        ['LICENSE (MIT)', 'Lisensi yang memberi izin orang memakai dan memodifikasi code dengan atribusi.'],
      ],
      diagram: `<pre>        RITUAL ANTI-BOCOR (sebelum push)

  ┌─────────────────────────────┐
  │ 1. grep secret di workdir   │
  ├─────────────────────────────┤
  │ 2. git status: .env absen?  │
  ├─────────────────────────────┤
  │ 3. git log -S: history      │
  │    bersih?                  │
  ├─────────────────────────────┤
  │ 4. test install dari nol    │
  ├─────────────────────────────┤
  │ 5. push dengan tenang       │
  └─────────────────────────────┘
  5 menit ritual vs insiden bocor</pre>`,
      scenario: 'Kandidat memasukkan AWS key ke repo publik "lupa". Bot scanner menemukan dalam 4 menit; tagihan $2.000 muncul esok paginya. Ritual 5 menit di atas mencegah 100% kasus seperti ini.',
      bestPractices: 'Commit per fitur dengan pesan jelas (feat:, fix:, docs:). Tag v1.0 saat kriteria selesai terpenuhi. requirements.txt dengan versi terkunci (requests==2.31.0).',
      security: 'Anggap semua yang masuk repo publik = publik selamanya. Pisahkan repo portfolio (bersih) dari repo kerja internal (mungkin berisi data sensitif).',
      challenge: 'Lakukan "audit secret" ke SEMUA repo automation-mu (34, 35, 36, 37): jalankan ritual grep + git log -S. Perbaiki temuan apa pun SEBELUM repo 37 dipublikasikan.',
      interviewQ: 'Q: Bagaimana kamu memastikan tidak ada secret yang bocor ke GitHub? — A: Ritual sebelum push: grep workdir, pastikan .env di .gitignore dan tak muncul di git status, scan history dengan git log -S, dan test instalasi dari nol. Secret yang terlanjur push dianggap bocor — langsung revoke, bukan sekadar hapus commit.',
      quiz: [
        { q: 'Apa fungsi .env.example?', options: ['Backup .env', 'File wajib Python', 'Template variabel kredensial TANPA nilai asli — memberi tahu pengguna apa yang dibutuhkan tanpa membocorkan secret', 'Tidak ada fungsi'], answer: 2, explain: 'Orang lain bisa menjalankan project-mu tanpa kamu membocorkan password — mereka isi sendiri dari template.' },
        { q: 'Mengapa repo portfolio butuh file LICENSE?', options: ['Agar terlihat resmi', 'Tanpa lisensi, orang/perusahaan secara hukum tidak boleh memakai ulang code-mu — portfolio kehilangan nilainya', 'Wajib GitHub', 'Agar repo приват'], answer: 1, explain: 'MIT license = "pakai bebas dengan atribusi". Tanpa itu, code-mu hanya bisa dibaca, tidak dipakai.' },
        { q: 'Secret terlanjur ter-push ke repo publik. Tindakan benar?', options: ['Anggap BOCOR: revoke/ganti secret SEGERA — menghapus commit tidak menghapus dari yang sudah di-clone', 'Hapus commit-nya, selesai', 'Biarkan saja', 'Rename repo'], answer: 0, explain: 'Git history tersebar; yang sudah di-clone tetap punya secret-mu. Satu-satunya respons benar: revoke dan ganti.' },
      ],
    },
    {
      id: '37.10',
      title: 'Presentasi & Next Steps: Menjual Skill-mu',
      body: `<p>Skill automation yang tidak bisa dikomunikasikan = skill yang tidak dihitung. Sub-bab terakhir ini tentang <b>mempresentasikan</b> capstone-mu ke recruiter/interviewer dan <b>roadmap</b> setelah part ini.</p>
<h3>Cara Menceritakan Project (Format STAR)</h3>
<p>Interviewer tidak bertanya "bisa Python?" — mereka bertanya <b>"ceritakan project tersulitmu"</b>. Jawab dengan <b>STAR</b>:</p>
<div class=\"tblwrap\"><table>
<tr><th></th><th>Contoh untuk capstone-mu</th></tr>
<tr><td><b>S</b>ituation</td><td>"Backup & audit 3 CHR dilakukan manual, sering lupa; drift konfigurasi baru ketahuan saat audit tahunan."</td></tr>
<tr><td><b>T</b>ask</td><td>"Bangun sistem automation end-to-end: audit, backup, compliance check harian + alerting."</td></tr>
<tr><td><b>A</b>ction</td><td>"Saya desain arsitektur dulu (DESIGN.md), bangun pipeline Python + RouterOS/Zabbix API, systemd timer, testing dengan failure injection 6 skenario."</td></tr>
<tr><td><b>R</b>esult</td><td>"Pipeline jalan otomatis 3 bulan; drift terdeteksi &lt; 24 jam; semua terdokumentasi di GitHub — link ada di CV saya."</td></tr>
</table></div>
<p><b>ALASAN STAR:</b> interviewer menilai <i>cara berpikir</i>, bukan hafalan. STAR memaksa cerita yang konkret dan terukur.</p>
<h3>Demo yang Meyakinkan</h3>
<ul>
<li><b>Live demo 5 menit:</b> jalankan pipeline --dry-run → tunjukkan laporan → simulasikan drift → tunjukkan alert. Siapkan juga <b>rekaman</b> (GIF/video) bila demo live berisiko.</li>
<li><b>Tunjukkan DESIGN.md dan TESTING.md</b> — inilah pembeda dari "script iseng". Katakan: "ini arsitektur saya, ini bukti testing saya."</li>
<li><b>Jujur soal batasan:</b> "teruji di lab 3 CHR; untuk production butuh Vault dan..." — kejujuran = kedewasaan engineering.</li>
</ul>
<h3>Roadmap Setelah Part 37</h3>
<div class=\"tblwrap\"><table>
<tr><th>Berikutnya</th><th>Mengapa</th></tr>
<tr><td>Part 38 (Dokumentasi)</td><td>Standarisasi dokumentasi network secara sistematis</td></tr>
<tr><td>Part 39 (Final Enterprise Lab)</td><td>Ujian akhir: gabungkan SEMUA skill 39 part dalam satu topologi enterprise</td></tr>
<tr><td>Di luar kurikulum: Terraform, CI/CD untuk network</td><td>Infrastructure as Code adalah kelanjutan alami Ansible</td></tr>
<tr><td>Sertifikasi: JNCIA / CCNA / MikroTik MTCNA</td><td>Validasi formal untuk CV (opsional tapi membantu)</td></tr>
</table></div>
<p><b>Hands-on penutup:</b> tulis file <code>PITCH.md</code> — cerita STAR 2 menit tentang capstone-mu + link repo + 3 hal yang akan kamu perbaiki bila diberi waktu sebulan lagi. Verification: bacakan ke teman; bila mereka bisa menjelaskan kembali project-mu dengan benar, pitch-mu berhasil. Final verification part ini: repo publik + README + DESIGN.md + TESTING.md + PITCH.md = portfolio automation yang lengkap.</p>
<div class=\"callout blue\"><div class=\"t\">Portfolio > Sertifikat (untuk automation)</div><p style=\"margin:4px 0 0\">Untuk peran automation, recruiter lebih percaya pada <b>repo GitHub yang hidup</b> (commit rutin, dokumentasi, testing) daripada daftar sertifikat. Capstone part ini adalah aset karier — rawat ia seperti produk, bukan tugas sekolah.</p></div>`,
      terms: [
        ['STAR', 'Teknik bercerita: Situation, Task, Action, Result — untuk menjawab pertanyaan behavioral interview.'],
        ['Live demo', 'Peragaan langsung sistem berjalan — bukti paling kuat dalam interview teknis.'],
      ],
      scenario: 'Dua kandidat melamar posisi network automation. Kandidat A: "saya bisa Python dan Ansible" (klaim). Kandidat B: membuka laptop, menjalankan pipeline, menunjukkan drift terdeteksi + alert masuk, lalu membuka DESIGN.md. Kandidat B diterima — buktinya berbicara.',
      bestPractices: 'PITCH.md: 2 menit, STAR, akhiri dengan link repo. Rawat repo setelah "selesai" (commit perbaikan kecil = repo hidup). Cantumkan metrik hasil, bukan daftar tool.',
      security: 'Saat demo live, pastikan tidak ada secret yang terlihat di layar (token di-blur, .env tidak dibuka). Gunakan data lab, bukan data production asli.',
      challenge: 'Rekam demo 5 menit capstone-mu (screen recording): dry-run → laporan → simulasi drift → alert. Tonton ulang — potong bagian yang membosankan hingga tersisa demo yang tajam.',
      interviewQ: 'Q: Ceritakan project automation tersulitmu. — A: (STAR) Situasi: backup & audit manual 3 CHR, drift ketahuan setahun sekali. Tugas: sistem end-to-end otomatis. Aksi: desain dulu, pipeline Python + API RouterOS/Zabbix, systemd timer, 6 skenario failure injection. Hasil: jalan otomatis, drift < 24 jam terdeteksi, repo GitHub lengkap dengan DESIGN/TESTING docs.',
      quiz: [
        { q: 'Apa kepanjangan STAR dan fungsinya?', options: ['Bintang film', 'Standar coding', 'Nama tool', 'Situation, Task, Action, Result — teknik bercerita konkret & terukur untuk pertanyaan behavioral interview'], answer: 3, explain: 'STAR mengubah klaim ("saya bisa automation") menjadi bukti ("ini yang saya bangun, ini hasilnya").' },
        { q: 'Mengapa menunjukkan DESIGN.md dan TESTING.md saat interview itu powerful?', options: ['Agar terlihat sibuk', 'Keduanya membuktikan cara berpikir engineering (desain) dan kedewasaan (testing) — pembeda dari sekadar "script iseng"', 'Wajib dibawa', 'Tidak ada gunanya'], answer: 1, explain: 'Recruiter menilai proses berpikir. Desain + bukti testing = sinyal engineer profesional, bukan penghafal tutorial.' },
        { q: 'Untuk peran automation, apa yang paling dipercaya recruiter?', options: ['Daftar sertifikat', 'IPK tinggi', 'Repo GitHub yang hidup: commit rutin, dokumentasi, testing, dan demo yang berjalan', 'Banyak followers'], answer: 2, explain: 'Bukti kerja yang bisa dijalankan dan diperiksa mengalahkan klaim di atas kertas — itulah gunanya capstone ini.' },
      ],
    },
  ],
  project: {
    title: 'Project: Network Automation Suite',
    html: `<p><b>Misi:</b> bangun <b>Network Automation Suite</b> — sistem automation end-to-end untuk lab-mu (3 CHR + Zabbix): audit harian via API/SSH, backup otomatis, compliance check vs desired state, laporan, dan alerting — semuanya terjadwal, terdokumentasi, dan terpublikasi di GitHub sebagai portfolio capstone.</p>
<h3>Arsitektur (dari 37.1)</h3>
<pre>scheduler (systemd timer, 02:00)
   └─▶ pipeline.py
         ├─ audit.py     → SSH/API ke 3 CHR: interface, IP, route, resource → JSON
         ├─ backup.py    → export .rsc + simpan ke Git (pola 35.3)
         ├─ validate.py  → bandingkan vs desired.yaml → temuan drift
         ├─ zabbix.py    → tarik trigger aktif via Zabbix API (37.4)
         └─ report.py    → gabungkan semua → laporan harian (Markdown)
                │  gagal/drift?
                ▼
         alert.py → Telegram (hanya untuk temuan, anti-spam)</pre>
<h3>Langkah Pengerjaan</h3>
<ol>
<li><b>DESIGN.md dulu</b> (37.1): problem tajam, kriteria sukses terukur, pilihan tool + alasan, diagram arsitektur.</li>
<li><b>Modul fondasi:</b> <code>lib/rosapi.py</code> (37.3: ros_get/ros_put), <code>lib/zbxapi.py</code> (37.4: api_call), <code>lib/common.py</code> (logging, env config).</li>
<li><b>Read-only dulu:</b> audit.py + zabbix.py — pastikan aman sebelum ada operasi write.</li>
<li><b>Pipeline:</b> pipeline.py memanggil semuanya berurutan + logging terstruktur (37.6).</li>
<li><b>Jadwalkan:</b> systemd timer harian 02:00; verifikasi jalan 3 hari berturut-turut.</li>
<li><b>Uji seperti production:</b> failure injection — matikan 1 CHR, cabut token Zabbix, simulasikan drift (37.7). Semua harus tertangani dengan pesan jelas + alert.</li>
<li><b>Dokumentasi</b> (37.8): README lengkap + diagram arsitektur.</li>
<li><b>Publish</b> (37.9): repo GitHub publik, tanpa secret.</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio)</h3>
<ol>
<li>Buat repo publik: <code>network-automation-suite</code>.</li>
<li><b>SEBELUM push:</b> <code>grep -ri "password\\|token" . --exclude-dir=.git</code> harus bersih; pastikan <code>.env</code> dan file berisi secret ada di <code>.gitignore</code>.</li>
<li>README wajib: masalah yang diselesaikan, diagram arsitektur, cara install (<code>pip install -r requirements.txt</code>), cara pakai, contoh laporan, dan bagian "LAB vs Production".</li>
<li>Sertakan <code>DESIGN.md</code> — ini yang paling membedakanmu dari kandidat lain.</li>
<li>Commit per fitur dengan pesan jelas; tag <code>v1.0</code> saat kriteria selesai terpenuhi.</li>
<li>Tautkan di CV/LinkedIn dengan 1 kalimat hasil: "End-to-end network automation: scheduled audit, backup & compliance for MikroTik + Zabbix integration."</li>
</ol>
<h3>Kriteria Selesai</h3>
<ul>
<li>Pipeline berjalan otomatis 3 hari berturut-turut tanpa intervensi manual (bukti: log + laporan harian di Git).</li>
<li>Drift detection terbukti: hapus 1 VLAN manual → laporan esok hari melaporkannya + alert terkirim.</li>
<li>Failure injection tertangani: CHR mati / token salah menghasilkan pesan error jelas, bukan crash misterius.</li>
<li>Tidak ada secret di repo (terverifikasi dengan grep).</li>
<li>README + DESIGN.md lengkap; repo GitHub publik tertaut di CV/LinkedIn.</li>
</ul>`,
  },
};
