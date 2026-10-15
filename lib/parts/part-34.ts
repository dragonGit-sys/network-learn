// PART 34 — Python for Network Engineer (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part34: Part = {
  id: '34',
  number: 'PART 34',
  title: 'Python for Network Engineer',
  phaseId: 'fase-7',
  description: 'Belajar Python dari nol untuk network engineer: scripting SSH ke device, parsing output RouterOS, dan fondasi automation yang dipakai Part 35–37.',
  repoFolder: 'part-34-python',
  objectives: [
    'Menjalankan Python 3 di Linux, mengelola package dengan pip, dan mengisolasi project dengan venv.',
    'Menguasai fondasi bahasa: variabel, tipe data, string, list, dict, loop, fungsi, dan file I/O — dengan contoh dari dunia jaringan.',
    'Membuka koneksi SSH ke MikroTik CHR dengan netmiko dan mengeksekusi command dari script.',
    'Mem-parsing output teks RouterOS menjadi data terstruktur (string method, regex, TextFSM).',
    'Menulis script yang aman dan rapi: error handling, kredensial via environment variable, dan struktur siap production.',
  ],
  prerequisites: 'Part 33 (Linux & Bash — script berjalan di Linux). Tidak perlu pengalaman coding; part ini mulai dari nol.',
  subbabs: [
    {
      id: '34.1',
      title: 'Mengapa Python untuk Network Engineer',
      body: `<p>Bayangkan rutinitas pagi seorang NOC engineer: login ke 25 router, cek <code>/system resource print</code> satu per satu, catat CPU yang di atas 80%, lalu backup konfigurasi tiap device. Manual: 1–2 jam, membosankan, dan rawan salah ketik. Dengan Python: <b>satu script 30 baris mengerjakan semuanya dalam 2 menit</b> — dan hasilnya konsisten setiap hari.</p>
<h3>Apa Itu Python?</h3>
<p><b>Python</b> adalah <b>bahasa pemrograman</b> — cara manusia memberi instruksi ke komputer dalam teks yang (relatif) mudah dibaca. Ia disebut <b>interpreted</b>: kamu menulis file teks (<code>.py</code>), lalu program bernama <b>interpreter</b> membacanya baris per baris dan menjalankannya langsung, tanpa tahap compile terpisah. ALASAN ini penting untuk network engineer: siklus "tulis → coba → perbaiki" sangat cepat, cocok untuk eksperimen di lab.</p>
<h3>Mengapa Python, Bukan Bahasa Lain?</h3>
<div class="tblwrap"><table>
<tr><th>Alasan</th><th>Penjelasan</th></tr>
<tr><td>Mudah dibaca</td><td>Sintaks mirip bahasa Inggris; script 6 bulan lalu masih bisa kamu pahami</td></tr>
<tr><td>Ekosistem network</td><td>Library siap pakai: <b>netmiko</b>/<b>paramiko</b> (SSH), <b>napalm</b>, <b>textfsm</b> (parsing), <b>requests</b> (API)</td></tr>
<tr><td>Standar industri</td><td>Mayoritas tool automation jaringan (termasuk Ansible, dipakai di Part 36) berbasis Python</td></tr>
<tr><td>Gratis & lintas OS</td><td>Jalan di Linux lab-mu (Part 33) tanpa lisensi</td></tr>
</table></div>
<h3>Use Case Nyata di NOC</h3>
<ul>
<li><b>Audit massal:</b> tarik versi RouterOS dari 50 device, laporkan yang belum di-upgrade.</li>
<li><b>Backup terjadwal:</b> export konfigurasi tiap malam, simpan dengan tanggal (fondasi Part 35.3).</li>
<li><b>Parsing log:</b> saring ribuan baris log, tampilkan hanya pola error yang penting.</li>
<li><b>Validasi:</b> bandingkan konfigurasi aktual vs standar perusahaan, laporkan penyimpangan.</li>
</ul>
<div class="callout"><div class="t">Peta Part Ini</div><p style="margin:4px 0 0">Part 34 = <b>fondasi bahasa</b> (34.2–34.6) + <b>SSH & parsing pertama</b> (34.7–34.9) + <b>script yang rapi</b> (34.10). Part 35 memakai fondasi ini untuk automation MikroTik penuh; Part 36–37 membawanya ke Ansible dan project end-to-end.</p></div>`,
      terms: [
        ['Python', 'Bahasa pemrograman interpreted yang mudah dibaca; standar industri untuk network automation.'],
        ['Interpreter', 'Program yang membaca dan menjalankan kode Python baris per baris (python3).'],
        ['Library', 'Paket kode siap pakai yang bisa diimpor (mis. netmiko untuk SSH).'],
        ['Scripting', 'Menulis program kecil untuk mengotomatiskan tugas repetitif.'],
      ],
      diagram: `<pre>        MANUAL vs SCRIPT

  MANUAL (tanpa Python):
  kamu → SSH → ketik command → catat → ulangi 25x → 2 jam, bisa salah ketik

  DENGAN PYTHON:
  kamu → tulis script sekali → script → SSH ke 25 device → kumpulkan hasil
                                          → tulis laporan otomatis → 2 menit, konsisten</pre>`,
      scenario: 'NOC sebuah ISP punya 40 router cabang. Tiap Senin pagi, tim menghabiskan 3 jam mengecek versi RouterOS satu per satu untuk persiapan maintenance. Setelah Part 34, satu script melakukannya dalam 3 menit dan menghasilkan tabel "device — versi — status upgrade". Waktu 3 jam itu dialihkan ke troubleshooting yang benar-benar butuh manusia.',
      bestPractices: 'Mulai dari masalah nyata yang kecil dan repetitif (bukan "belajar Python" secara abstrak). Satu script = satu tugas yang jelas. Simpan semua script di Git sejak hari pertama.',
      security: 'Script automation akan memegang kredensial device — anggap script sebagai "kunci gudang". Jangan pernah tulis password di dalam script (pola aman diajarkan di 34.7 dan 34.10).',
      challenge: 'Tuliskan 3 tugas repetitif di pekerjaan/lab-mu yang paling membosankan. Untuk tiap tugas, jawab: input apa yang dibutuhkan, dan output seperti apa yang kamu inginkan. Ini akan menjadi daftar project Python-mu.',
      interviewQ: 'Q: Network engineer kenapa harus bisa Python? — A: Karena skala: konfigurasi dan pengecekan yang trivial untuk 3 device menjadi mustahil konsisten untuk 300 device. Python mengubah pekerjaan repetitif menjadi script yang cepat, konsisten, dan terdokumentasi — dan ia adalah bahasa standar tool automation (Ansible, NAPALM) yang dipakai industri.',
      quiz: [
        { q: 'Apa arti Python disebut bahasa "interpreted"?', options: ['Kode harus di-compile dulu menjadi file .exe', 'Interpreter membaca dan menjalankan kode baris per baris tanpa tahap compile terpisah', 'Hanya bisa jalan di Windows', 'Kode tidak bisa disimpan sebagai file'], answer: 1, explain: 'Interpreted = tulis file .py, langsung jalankan dengan python3; siklus coba-perbaiki sangat cepat, ideal untuk eksperimen lab.' },
        { q: 'Mengapa Python menjadi pilihan utama untuk network automation?', options: ['Karena paling cepat dari semua bahasa', 'Karena mudah dibaca, punya library network siap pakai (netmiko, textfsm), dan menjadi basis tool industri seperti Ansible', 'Karena wajib oleh Cisco', 'Karena gratis saja'], answer: 1, explain: 'Kombinasi keterbacaan + ekosistem library network + status sebagai bahasa tool industri (Ansible/NAPALM) membuatnya standar de facto.' },
        { q: 'Manakah use case yang PALING tepat untuk script Python pertama seorang NOC engineer?', options: ['Menulis ulang sistem operasi router', 'Tugas repetitif dan terdefinisi jelas, mis. audit versi RouterOS ke banyak device', 'Menggantikan firewall', 'Menghapus konfigurasi massal tanpa validasi'], answer: 1, explain: 'Mulai dari tugas kecil, repetitif, dan jelas — dampak langsung terasa, risiko kecil, dan pola ini menjadi fondasi automation yang lebih besar.' },
      ],
    },
    {
      id: '34.2',
      title: 'Instalasi & Menjalankan Python',
      body: `<p>Di lab Linux-mu (Part 33), Python 3 biasanya sudah terinstal. Kita verifikasi, pahami cara menjalankan script, lalu menyiapkan <b>venv</b> — lingkungan terisolasi per project agar library satu project tidak merusak project lain.</p>
<h3>Topology</h3>
<pre>[Laptop/VM Linux lab-mu (Part 33)]
   └── python3 (interpreter) + pip (pengelola library) + venv (isolasi project)</pre>
<h3>Objective</h3>
<p>Menjalankan script Python pertama dan menyiapkan venv yang rapi untuk semua latihan part ini.</p>
<h3>Configuration (Langkah)</h3>
<pre>$ python3 --version
Python 3.10.x
# ALASAN python3 (bukan python): di banyak distro, "python" masih menunjuk
# ke Python 2 yang sudah mati (end-of-life 2020). Selalu pakai python3.

$ cat &gt; halo.py &lt;&lt; 'EOF'
print("Halo dari Python!")
print("2 + 3 =", 2 + 3)
EOF
$ python3 halo.py
Halo dari Python!
2 + 3 = 5
# print() = perintah "tampilkan ke layar". File .py = teks biasa berisi instruksi.</pre>
<h3>pip: Menginstall Library</h3>
<pre>$ pip3 install netmiko
# pip = "toko aplikasi" Python; mengunduh library dari internet (PyPI) dan memasangnya.
# ALASAN pip3: pasangan python3, agar library masuk ke Python 3 bukan Python 2.</pre>
<h3>venv: Kotak Pasir Tiap Project (PENTING)</h3>
<pre>$ python3 -m venv ~/venv-netlab
# -m venv = "jalankan modul venv"; membuat folder ~/venv-netlab berisi
# salinan interpreter + pip KHUSUS project ini.
# ALASAN: project A butuh netmiko versi 4, project B butuh versi 3.
# Tanpa venv, install versi baru merusak project lama. venv = tiap project
# punya "kotak pasir" sendiri, tidak saling mengganggu.

$ source ~/venv-netlab/bin/activate
(venv-netlab) $
# source .../activate = "masuk ke kotak pasir". Prompt berubah = tanda aktif.
# Setelah aktif, perintah "python" dan "pip" otomatis menunjuk ke venv.

(venv-netlab) $ pip install netmiko textfsm
# install di dalam venv — tidak mengotori sistem.</pre>
<h3>Verification</h3>
<pre>(venv-netlab) $ python -c "import netmiko; print(netmiko.__version__)"
4.x.x
# import = "ambil library agar bisa dipakai". Tidak error = install sukses.

(venv-netlab) $ deactivate
# keluar dari venv; prompt kembali normal.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<p><b>Gagal:</b> <code>pip install</code> error <i>externally-managed-environment</i> (Debian/Ubuntu baru). <b>Diagnosis:</b> distro melarang pip sistem agar tidak merusak package OS — ini <b>alasan lain venv wajib</b>. <b>Fix:</b> selalu install di dalam venv yang aktif, jangan paksa dengan <code>--break-system-packages</code> kecuali paham risikonya.</p>
<p><b>Gagal:</b> <code>python: command not found</code> setelah activate. <b>Diagnosis:</b> venv dibuat dengan python3 tapi kamu mengetik <code>python</code> di luar venv. <b>Fix:</b> biasakan <code>python3</code>/<code>pip3</code> di luar venv, atau selalu activate dulu.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di LAB: venv per project cukup. Di PRODUCTION: venv + <code>requirements.txt</code> (daftar library + versi) yang di-commit ke Git — agar server production menginstall <b>versi yang persis sama</b> dengan yang kamu uji di lab (reproducible).</p></div>`,
      terms: [
        ['pip', 'Pengelola package Python; menginstall library dari repositori PyPI.'],
        ['venv', 'Virtual environment: salinan interpreter+pip terisolasi per project agar versi library tidak bentrok.'],
        ['Interpreter', 'Program python3 yang mengeksekusi file .py.'],
        ['requirements.txt', 'File daftar library+versi agar instalasi reproducible di mesin lain.'],
      ],
      diagram: `<pre>        TANPA venv vs DENGAN venv

  TANPA venv (sistem global):
  project-a ─┐
             ├─▶ satu tumpukan library ─▶ bentrok versi!
  project-b ─┘

  DENGAN venv:
  project-a ─▶ venv-a (netmiko 4.x)   ┐
                                      ├─▶ tidak saling mengganggu
  project-b ─▶ venv-b (netmiko 3.x)   ┘</pre>`,
      scenario: 'Engineer menginstall library X versi terbaru secara global untuk satu project; esoknya script backup lama error karena API library berubah. Dengan venv sejak awal, kejadian ini tidak pernah terjadi — tiap project terkunci di versinya sendiri.',
      bestPractices: 'Satu project = satu venv. Selalu activate sebelum pip install. Catat library di requirements.txt (pip freeze &gt; requirements.txt). Jangan pernah install sebagai root di luar venv.',
      security: 'Hanya install library dari PyPI resmi; cek nama package (typosquatting: "netmiko" vs "netmlko" palsu). Di production, pin versi di requirements.txt agar tidak tiba-tiba dapat versi baru yang belum diuji.',
      challenge: 'Buat venv baru bernama venv-coba, aktifkan, install library "requests", verifikasi dengan python -c "import requests", lalu deactivate dan hapus folder venv-coba. Pastikan kamu paham tiap langkahnya.',
      interviewQ: 'Q: Apa fungsi venv dan kapan wajib dipakai? — A: venv mengisolasi interpreter dan library per project sehingga versi tidak bentrok antar project dan tidak merusak package sistem. Wajib dipakai setiap kali install library pihak ketiga — menginstall global adalah sumber klasik "script jalan di laptopku, error di server".',
      quiz: [
        { q: 'Mengapa perintah yang dianjurkan adalah python3, bukan python?', options: ['Agar terlihat modern', 'Di banyak distro "python" masih menunjuk ke Python 2 yang sudah end-of-life; python3 memastikan interpreter yang benar', 'python3 sepuluh kali lebih cepat', 'Tidak ada alasan'], answer: 1, explain: 'Python 2 mati sejak 2020; "python" bisa menunjuk ke sana. python3 eksplisit memilih interpreter yang benar.' },
        { q: 'Apa masalah yang diselesaikan oleh venv?', options: ['Membuat Python berjalan lebih cepat', 'Mengisolasi library per project sehingga perbedaan versi antar project (dan vs sistem) tidak saling merusak', 'Menghapus kebutuhan pip', 'Mengenkripsi script'], answer: 1, explain: 'venv = kotak pasir per project: tiap project punya salinan interpreter+pip sendiri, bentrok versi mustahil terjadi.' },
        { q: 'Error "externally-managed-environment" saat pip install artinya?', options: ['Internet mati', 'Distro melarang install ke Python sistem agar package OS tidak rusak — solusinya pakai venv', 'Password salah', 'Library tidak ada di PyPI'], answer: 1, explain: 'Itu proteksi distro modern; pola yang benar memang install di dalam venv aktif, bukan memaksa dengan --break-system-packages.' },
      ],
    },
    {
      id: '34.3',
      title: 'Variabel, Tipe Data & String',
      body: `<p>Sebelum mengotomatiskan device, kuasai "kosakata" Python. Fokus part ini: <b>hal yang langsung dipakai untuk mengolah output device</b> — variabel, tipe data dasar, dan operasi string (karena output RouterOS adalah teks!).</p>
<h3>Variabel: Kotak Bernama</h3>
<pre>hostname = "CHR-CORE-01"   # variabel = nama yang menunjuk ke sebuah nilai
cpu_load = 72              # int (bilangan bulat)
cpu_limit = 80.5           # float (bilangan desimal)
overloaded = False         # bool (True/False) — perhatikan huruf kapital!

# ALASAN penamaan jelas: "h" atau "x" membuat script 3 bulan lagi misterius.
# Aturan: huruf kecil + underscore (cpu_load), bukan spasi.</pre>
<h3>Tipe Data: Kenapa Peduli?</h3>
<pre>print("72" + "8")    # → "728"  (string + string = digabung!)
print(72 + 8)        # → 80     (int + int = dijumlahkan)
# Pelajaran: "72" (teks) ≠ 72 (angka). Output device SELALU teks —
# harus diubah ke angka dulu sebelum dibandingkan. Ini sumber bug #1 pemula.</pre>
<h3>String: Senjata Utama Parsing</h3>
<pre>output = "  name: CHR-CORE-01  "
#         ↑ spasi liar khas output CLI

clean = output.strip()          # strip() = buang spasi di ujung kiri-kanan
print(clean)                    # → "name: CHR-CORE-01"

parts = clean.split(":")        # split(":") = potong di tiap ":"
print(parts)                    # → ['name', ' CHR-CORE-01']
print(parts[1].strip())         # → "CHR-CORE-01"  ([1] = elemen ke-2; hitung dari 0!)

# Cek isi string:
print("CHR" in clean)           # → True  ("in" = apakah terkandung?)
print(clean.startswith("name")) # → True

# f-string: cetak rapi dengan variabel di dalam
print(f"Device {parts[1].strip()} siap diaudit")
# f"..." + {variabel} = template; ALASAN: jauh lebih mudah dibaca
# dibanding "Device " + parts[1].strip() + " siap diaudit"</pre>
<h3>Hands-on Mini</h3>
<pre>$ cat &gt; string_lab.py &lt;&lt; 'EOF'
raw = "cpu-load: 72%"
angka = raw.split(":")[1].strip().replace("%", "")
# langkah: potong di ":" → ambil kanan → buang spasi → buang "%"
print("Teks:", angka, "| Tipe:", type(angka))
# type() = "tanya tipe data"; hasilnya &lt;class 'str'&gt; — masih teks!

nilai = int(angka)   # int() = ubah teks menjadi bilangan bulat
print("Angka:", nilai, "| Tipe:", type(nilai))
print("Overload?", nilai &gt; 80)   # &gt; = lebih dari; hasil True/False
EOF
$ python3 string_lab.py</pre>
<h3>Verification</h3>
<p>Output harus menunjukkan transisi <code>str → int</code> dan <code>Overload? False</code>. <b>Failure injection:</b> ubah raw menjadi <code>"cpu-load: N/A%"</code> → <code>int("N/A")</code> error <i>ValueError</i>. <b>Diagnosis:</b> tidak semua output bisa jadi angka — validasi dulu sebelum konversi (pola lengkap di 34.10).</p>
<div class="callout blue"><div class="t">Kenapa String Dulu?</div><p style="margin:4px 0 0">90% pekerjaan automation network adalah <b>teks masuk → teks keluar</b>: baca output CLI (teks), ambil yang penting, tulis laporan (teks). Kuasai string = kuasai separuh network automation.</p></div>`,
      terms: [
        ['Variabel', 'Nama yang menunjuk ke sebuah nilai; "kotak" penyimpan data.'],
        ['Tipe data', 'Jenis nilai: int (bulat), float (desimal), str (teks), bool (True/False).'],
        ['String', 'Tipe teks; output CLI device selalu berupa string sebelum diolah.'],
        ['f-string', 'Template string f"..." dengan {variabel} di dalamnya untuk output rapi.'],
        ['Method', 'Fungsi milik sebuah tipe data, mis. "teks".strip(), dipanggil dengan titik.'],
      ],
      diagram: `<pre>        ALUR OLAH OUTPUT DEVICE

  "/system resource print" ──▶ teks mentah (str)
        │  .split(":") / .strip() / .replace()
        ▼
  "72" (masih str!) ──▶ int("72") ──▶ 72 (int)
                                          │  &gt; 80 ?
                                          ▼
                                   True / False ──▶ keputusan script</pre>`,
      scenario: 'Script audit membaca "uptime: 3d12h" dari 20 router. Tanpa parsing string, script tidak bisa menjawab "router mana yang uptime-nya di bawah 7 hari". Dengan split() + int(), pertanyaan itu terjawab dalam satu loop.',
      bestPractices: 'Nama variabel deskriptif (cpu_load, bukan c). Konversi tipe eksplisit (int(), str()) — jangan mengandalkan tebakan. Gunakan f-string untuk semua output manusia.',
      security: 'Jangan pernah mengeksekusi string dari device sebagai kode (hindari eval()). Output device adalah data — perlakukan sebagai data: parse, jangan eksekusi.',
      challenge: 'Diberi raw = "  free-memory: 1832.4MiB  ". Tulis script yang mengekstrak angka 1832.4 sebagai float, lalu cetak dengan f-string: "Free memory: 1832.4 MiB".',
      interviewQ: 'Q: Output command router selalu string — kenapa itu penting dipahami? — A: Karena operasi yang benar tergantung tipe: "72"+"8" menghasilkan "728" (gabung teks) bukan 80. Semua perbandingan numerik (mis. CPU &gt; 80) wajib konversi dulu dengan int()/float(), dan konversi bisa gagal bila output tak terduga — maka validasi itu bagian dari script yang baik.',
      quiz: [
        { q: 'Apa hasil dari "72" + "8" di Python?', options: ['80', '"728" (penggabungan teks, karena keduanya string)', '728 (angka)', 'Error'], answer: 1, explain: 'Operator + pada string berarti gabung, bukan jumlah. Inilah alasan output CLI (selalu string) harus dikonversi dulu sebelum operasi angka.' },
        { q: 'Apa fungsi .strip() pada string?', options: ['Memotong string menjadi list', 'Membuang spasi/kosong di ujung kiri dan kanan string', 'Mengubah huruf menjadi kapital', 'Menghapus semua spasi di tengah'], answer: 1, explain: 'Output CLI penuh spasi liar di ujung; strip() membersihkannya sebelum parsing lanjut seperti split(). Indexing [1] mengambil elemen kedua karena hitungan mulai dari 0.' },
        { q: 'Mengapa f-string dianjurkan dibanding penggabungan dengan +?', options: ['Lebih cepat 100x', 'Template f"...{variabel}..." jauh lebih mudah dibaca dan tidak rawan salah tipe dibanding rangkaian +', 'Wajib oleh Python', 'Tidak ada bedanya'], answer: 1, explain: 'Keterbacaan = lebih sedikit bug. f-string menempatkan variabel langsung di template tanpa rantai + yang rawan tercampur tipe.' },
      ],
    },
    {
      id: '34.4',
      title: 'List, Dict & Loop',
      body: `<p>Satu device mudah ditangani manual. Seratus device? Di sinilah <b>koleksi data + loop</b> bersinar: simpan daftar device dalam <b>list</b>, simpan detail tiap device dalam <b>dict</b>, lalu <b>loop</b> mengulang aksi yang sama untuk semuanya. Ini pola inti seluruh automation (dipakai di Part 35.10).</p>
<h3>List: Daftar Berurutan</h3>
<pre>devices = ["192.168.99.11", "192.168.99.12", "192.168.99.13"]
# list = daftar dalam [ ]; tiap elemen punya nomor urut (index) mulai 0
print(devices[0])      # → 192.168.99.11  (elemen pertama)
print(len(devices))    # → 3  (len = panjang daftar)
devices.append("192.168.99.14")  # append = tambah di akhir</pre>
<h3>Dict: Pasangan Kunci–Nilai</h3>
<pre>router = {
    "hostname": "CHR-CORE-01",
    "ip": "192.168.99.11",
    "role": "core",
}
# dict = {kunci: nilai}; akses via kunci, bukan nomor
print(router["ip"])       # → 192.168.99.11
router["cpu"] = 72        # tambah/ubah pasangan kunci-nilai

# List of dicts = pola "inventory" mini:
inventory = [
    {"hostname": "CHR-CORE-01", "ip": "192.168.99.11"},
    {"hostname": "CHR-DIST-01", "ip": "192.168.99.12"},
]
print(inventory[1]["hostname"])  # → CHR-DIST-01</pre>
<h3>Loop: Ulangi Tanpa Mengetik Ulang</h3>
<pre>for dev in devices:
    print(f"Mengecek {dev} ...")
# for X in DAFTAR: = "untuk tiap X di dalam DAFTAR, lakukan blok di bawahnya"
# Blok ditandai INDENTASI (spasi di depan) — WAJIB konsisten, itu sintaks Python!

# Pola emas network automation:
for dev in inventory:
    ip = dev["ip"]
    name = dev["hostname"]
    print(f"[{name}] {ip} → audit dimulai")
    # di 34.7, baris print ini diganti koneksi SSH sungguhan

# Loop dengan kondisi (if di dalam for):
for dev in inventory:
    if dev["ip"].startswith("192.168.99.1"):
        print(dev["hostname"], "di subnet management")</pre>
<h3>Hands-on Mini</h3>
<pre>$ cat &gt; loop_lab.py &lt;&lt; 'EOF'
inventory = [
    {"hostname": "CHR-CORE-01", "ip": "192.168.99.11", "cpu": 72},
    {"hostname": "CHR-DIST-01", "ip": "192.168.99.12", "cpu": 91},
    {"hostname": "CHR-ACC-01",  "ip": "192.168.99.13", "cpu": 45},
]
print("=== CPU Audit ===")
over = 0
for dev in inventory:
    status = "OVERLOAD" if dev["cpu"] &gt; 80 else "ok"
    # X if KONDISI else Y = "pilih X bila kondisi benar, kalau tidak Y"
    print(f'{dev["hostname"]}: {dev["cpu"]}% [{status}]')
    if status == "OVERLOAD":
        over = over + 1
print(f"Total overload: {over} device")
EOF
$ python3 loop_lab.py</pre>
<h3>Verification</h3>
<p>Output harus menandai CHR-DIST-01 sebagai OVERLOAD dan total 1. <b>Failure injection:</b> hapus indentasi satu baris di dalam for → <i>IndentationError</i>. <b>Diagnosis:</b> Python memakai indentasi sebagai struktur (bukan kurung kurawal); satu spasi tidak konsisten = error. <b>Fix:</b> selalu 4 spasi per level, jangan campur tab dan spasi.</p>
<div class="callout"><div class="t">Pola Pikir Automation</div><p style="margin:4px 0 0">Setiap kali kamu mendapati diri mengulang aksi yang sama ke banyak device, terjemahkan ke pola ini: <b>list/dict = data, for = pengulangan</b>. Pola 5 baris ini adalah 80% dari "network automation".</p></div>`,
      terms: [
        ['List', 'Koleksi berurutan dalam [ ]; elemen diakses via index mulai 0.'],
        ['Dict', 'Koleksi pasangan kunci:nilai dalam { }; diakses via kunci — fondasi inventory.'],
        ['Loop (for)', 'Perulangan: jalankan blok kode untuk tiap elemen koleksi.'],
        ['Indentasi', 'Spasi di awal baris yang menandai blok kode di Python; wajib konsisten.'],
      ],
      diagram: `<pre>        POLA INTI AUTOMATION

  inventory (list of dicts)
  ┌──────────────┬────────────────┐
  │ CHR-CORE-01  │ 192.168.99.11  │
  │ CHR-DIST-01  │ 192.168.99.12  │
  └──────────────┴────────────────┘
              │  for dev in inventory:
              ▼
     ┌─────────────────────┐
     │ aksi(dev): SSH, cek,│  ← tulis SEKALI,
     │ catat, laporkan     │    jalan untuk SEMUA
     └─────────────────────┘</pre>`,
      scenario: 'Migrasi 60 switch akses: tiap device butuh 8 command VLAN yang sama. Manual = 480x ketik (dan 480 peluang salah). Dengan list + loop: 8 command ditulis sekali, loop mengeksekusinya ke 60 device sambil mencatat yang gagal — selesai sambil ngopi.',
      bestPractices: 'Jangan hardcode daftar device di script (pindah ke file — lihat 34.6). Satu loop = satu tanggung jawab yang jelas. Kumpulkan hasil ke list baru untuk laporan akhir, jangan hanya print.',
      security: 'Inventory berisi IP dan hostname — itu informasi topologi. Simpan file inventory dengan permission terbatas (chmod 600) dan jangan commit kredensial di dalamnya.',
      challenge: 'Ubah loop_lab.py: tambahkan key "role" (core/distribution/access) ke tiap dict, lalu cetak hanya device dengan role "core" yang overload. Petunjuk: gabungkan dua kondisi if dengan kata kunci and.',
      interviewQ: 'Q: Kapan memakai list vs dict? — A: List untuk kumpulan berurutan sejenis (daftar IP); dict untuk atribut berlabel dari satu entitas (hostname, ip, role satu device). Praktiknya digabung: list of dicts = inventory — daftar device yang tiap device-nya dideskripsikan lengkap.',
      quiz: [
        { q: 'Apa output dari devices[0] jika devices = ["a", "b", "c"]?', options: ['"b"', '"a" (index mulai dari 0)', '"c"', 'Error'], answer: 1, explain: 'Index Python mulai dari 0: [0]=elemen pertama, [1]=kedua. Salah kaprah index adalah bug klasik pemula.' },
        { q: 'Struktur data apa yang paling tepat untuk inventory 50 router (nama, IP, role tiap router)?', options: ['50 variabel terpisah', 'List of dicts — tiap dict mendeskripsikan satu router lengkap', 'Satu string panjang', 'Tidak bisa di Python'], answer: 1, explain: 'List of dicts = pola inventory standar: list menampung banyaknya, dict mendeskripsikan tiap device dengan kunci berlabel.' },
        { q: 'Mengapa indentasi yang tidak konsisten menyebabkan IndentationError?', options: ['Python lambat', 'Indentasi adalah sintaks Python untuk menandai blok kode (bukan hiasan); tidak konsisten = struktur ambigu', 'Hanya peringatan, tetap jalan', 'Karena memakai tab'], answer: 1, explain: 'Tidak seperti bahasa ber-kurung-kurawal, Python memakai indentasi sebagai struktur. Konsisten 4 spasi per level, jangan campur tab.' },
      ],
    },
    {
      id: '34.5',
      title: 'Fungsi & Modul',
      body: `<p>Script yang tumbuh menjadi 200 baris tanpa struktur = mimpi buruk. <b>Fungsi</b> membungkus blok logika menjadi unit bernama yang bisa dipanggil ulang; <b>modul</b> mengelompokkan fungsi ke file terpisah. Hasilnya: script 34.7–34.10 tetap terbaca walau fiturnya bertambah.</p>
<h3>Fungsi: Bungkus & Pakai Ulang</h3>
<pre>def cek_cpu(nilai):
    # def = "definisikan fungsi bernama cek_cpu yang menerima nilai"
    if nilai &gt; 80:
        return "OVERLOAD"   # return = "kembalikan hasil ini ke pemanggil"
    return "ok"

print(cek_cpu(91))   # → OVERLOAD  (panggil fungsi = jalankan bungkusnya)
print(cek_cpu(45))   # → ok

# ALASAN fungsi: logika "kapan overload" ditulis SEKALI. Jika threshold
# berubah 80 → 85, ubah satu tempat — bukan berburu di 15 lokasi.</pre>
<h3>Parameter & Return: Masuk–Keluar yang Jelas</h3>
<pre>def buat_laporan(hostname, cpu):
    baris = f"{hostname}: {cpu}%"
    return baris   # fungsi "mengembalikan" string, tidak print sendiri

hasil = buat_laporan("CHR-01", 72)
print(hasil)
# ALASAN return (bukan print di dalam): fungsi yang me-return bisa dipakai
# ulang — hasilnya bisa dicetak, ditulis ke file (34.6), atau dikirim via API.</pre>
<h3>Modul: Fungsi Pindah ke File Sendiri</h3>
<pre>$ cat &gt; netlib.py &lt;&lt; 'EOF'
def cek_cpu(nilai):
    return "OVERLOAD" if nilai &gt; 80 else "ok"

def format_persen(nilai):
    return f"{nilai}%"
EOF
$ cat &gt; audit.py &lt;&lt; 'EOF'
import netlib   # import = "ambil file netlib.py agar fungsinya bisa dipakai"
# ALASAN modul: fungsi umum (cek_cpu) dipakai banyak script tanpa copy-paste.
# Satu definisi = satu tempat perbaikan.

print(netlib.cek_cpu(91))            # panggil via nama_modul.nama_fungsi
print(netlib.format_persen(72))
EOF
$ python3 audit.py</pre>
<h3>Verification</h3>
<p>Output: OVERLOAD dan 72%. <b>Failure injection:</b> panggil <code>netlib.cek_cpu()</code> tanpa argumen → <i>TypeError: missing argument</i>. <b>Diagnosis:</b> fungsi butuh input sesuai definisi. <b>Fix:</b> baca signature fungsi (def barisnya) sebelum memanggil — atau beri nilai default: <code>def cek_cpu(nilai=0):</code>.</p>
<div class="callout blue"><div class="t">Aturan Praktis</div><p style="margin:4px 0 0">Jika kamu copy-paste blok kode lebih dari 2x, jadikan fungsi. Jika satu file &gt; 150 baris, pecah jadi modul. Script automation yang baik = kumpulan fungsi kecil yang masing-masing melakukan satu hal dengan jelas.</p></div>`,
      terms: [
        ['Fungsi (def)', 'Blok kode bernama yang bisa dipanggil ulang; menerima parameter, mengembalikan return.'],
        ['Return', 'Nilai yang "dikembalikan" fungsi ke pemanggilnya.'],
        ['Modul', 'File .py yang berisi fungsi/variabel untuk di-import script lain.'],
        ['Import', 'Pernyataan untuk memakai kode dari modul lain.'],
      ],
      diagram: `<pre>        DARI SCRIPT ACAK-ACAK KE TERSTRUKTUR

  SEBELUM (copy-paste):
  audit.py: cek_cpu ditulis di sini ─┐
  backup.py: cek_cpu ditulis lagi ───┤ duplikasi = 3 tempat rusak
  report.py: cek_cpu ditulis lagi ───┘   saat aturan berubah

  SESUDAH (modul):
  netlib.py: def cek_cpu() ───▶ definisi TUNGGAL
       ▲ dipakai oleh ▲ dipakai oleh ▲ dipakai oleh
    audit.py        backup.py       report.py</pre>`,
      scenario: 'Tim menulis 5 script audit terpisah, tiap script punya versi "cek threshold" sendiri. Standar berubah (80→85): 5 file harus diubah, 1 terlewat → laporan inkonsisten. Dengan modul netlib: ubah 1 fungsi, semua script ikut benar.',
      bestPractices: 'Satu fungsi = satu tugas, nama jelas (cek_cpu, bukan f1). Fungsi sebaiknya me-return nilai, bukan print — agar reusable. Kumpulkan fungsi umum di modul lib (pola ini dipakai penuh di project 34 dan 35).',
      security: 'Fungsi yang menangani kredensial (mis. baca password) harus tinggal di satu modul dengan akses terbatas — jangan duplikasi logika secret ke tiap script.',
      challenge: 'Buat modul netlib2.py berisi fungsi ambil_field(teks, kunci) yang menerima string "cpu: 72" dan mengembalikan "72" (pakai split+strip dari 34.3). Lalu buat script yang meng-import-nya untuk 3 baris data berbeda.',
      interviewQ: 'Q: Kapan blok kode layak dijadikan fungsi? — A: Saat dipakai lebih dari sekali, atau saat ia merepresentasikan satu konsep ("cek overload") yang layak punya nama. Fungsi memberi tiga hal: nama yang menjelaskan maksud, satu tempat perbaikan, dan testability — script automation yang tumbuh tanpa fungsi cepat menjadi tidak terpelihara.',
      quiz: [
        { q: 'Apa keuntungan utama fungsi me-return nilai dibanding print langsung di dalamnya?', options: ['Lebih cepat', 'Hasilnya bisa dipakai ulang: dicetak, ditulis ke file, atau dioper ke fungsi lain — fungsi tetap fleksibel', 'Tidak ada bedanya', 'Wajib agar tidak error'], answer: 1, explain: 'Return memisahkan "hitung" dari "tampilkan". Fungsi yang print di dalam terkunci hanya untuk layar; yang me-return bisa dipakai di semua konteks.' },
        { q: 'Apa itu modul dalam Python?', options: ['Komputer khusus', 'File .py berisi fungsi/variabel yang bisa di-import dan dipakai script lain', 'Jenis loop', 'Database'], answer: 1, explain: 'Modul = unit reuse antar file. Pola: fungsi umum di netlib.py, di-import semua script — satu definisi, satu tempat perbaikan.' },
        { q: 'Script-mu memakai logika "cek threshold" di 4 tempat via copy-paste. Standar threshold berubah. Masalahnya?', options: ['Tidak ada masalah', 'Harus ubah 4 tempat; satu terlewat = inkonsisten. Solusi: jadikan satu fungsi di modul', 'Python otomatis sinkron', 'Hapus saja scriptnya'], answer: 1, explain: 'Duplikasi = N tempat rusak saat aturan berubah. Fungsi/modul mereduksinya menjadi satu sumber kebenaran (single source of truth).' },
      ],
    },
    {
      id: '34.6',
      title: 'File I/O: Baca Inventory, Tulis Laporan',
      body: `<p>Script automation yang serius tidak hardcode daftar device di dalam kode — ia <b>membaca inventory dari file</b> dan <b>menulis laporan ke file</b>. Dengan begitu, menambah device = edit file teks, bukan edit script.</p>
<h3>Menulis File: Laporan Otomatis</h3>
<pre>hasil = ["CHR-CORE-01: 72% [ok]", "CHR-DIST-01: 91% [OVERLOAD]"]

with open("laporan.txt", "w") as f:
    # open(nama, "w") = buka untuk WRITE (tulis); "w" menimpa isi lama!
    # with ... as = "buka, pakai, lalu TUTUP otomatis" — pola wajib.
    # ALASAN with: file yang lupa ditutup bisa korup / terkunci.
    for baris in hasil:
        f.write(baris + "\\n")   # \\n = karakter "ganti baris"

print("Laporan ditulis.")
# Isi laporan.txt:
# CHR-CORE-01: 72% [ok]
# CHR-DIST-01: 91% [OVERLOAD]</pre>
<h3>Membaca File: Inventory Terpisah dari Kode</h3>
<pre>$ cat &gt; inventory.txt &lt;&lt; 'EOF'
# format: hostname,ip  (satu device per baris; # = komentar)
CHR-CORE-01,192.168.99.11
CHR-DIST-01,192.168.99.12
EOF
$ cat &gt; baca_inv.py &lt;&lt; 'EOF'
inventory = []
with open("inventory.txt") as f:   # mode default = "r" (read/baca)
    for baris in f:                # loop langsung tiap baris file
        baris = baris.strip()
        if not baris or baris.startswith("#"):
            continue               # lewati baris kosong & komentar
        nama, ip = baris.split(",")  # unpack: pecah jadi 2 variabel sekaligus
        inventory.append({"hostname": nama.strip(), "ip": ip.strip()})

for dev in inventory:
    print(f'{dev["hostname"]} → {dev["ip"]}')
EOF
$ python3 baca_inv.py</pre>
<h3>Mode File: "w" vs "a"</h3>
<div class="tblwrap"><table>
<tr><th>Mode</th><th>Arti</th><th>Kapan dipakai</th></tr>
<tr><td>"w"</td><td>Write — timpa isi lama</td><td>Laporan harian yang diganti tiap run</td></tr>
<tr><td>"a"</td><td>Append — tambah di akhir</td><td>Log akumulatif (catat tiap kejadian)</td></tr>
<tr><td>"r"</td><td>Read — baca saja (default)</td><td>Inventory, konfigurasi</td></tr>
</table></div>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<p><b>Gagal:</b> <i>FileNotFoundError</i>. <b>Diagnosis:</b> nama file salah ketik atau script dijalankan dari folder lain (path relatif!). <b>Fix:</b> cek dengan <code>ls</code>; untuk script serius, pakai path absolut atau folder script sendiri.</p>
<p><b>Gagal:</b> laporan kemarin hilang setelah run baru. <b>Diagnosis:</b> mode "w" menimpa. <b>Fix:</b> bila butuh riwayat, pakai "a" — atau sertakan tanggal di nama file laporan (pola di 34.10).</p>
<div class="callout"><div class="t">Kenapa Ini Penting</div><p style="margin:4px 0 0">Memisahkan <b>data</b> (inventory.txt) dari <b>logika</b> (script .py) adalah fondasi automation yang bisa dioperasikan tim: NOC menambah device tanpa menyentuh kode, dan kode bisa di-review tanpa tercampur data.</p></div>`,
      terms: [
        ['File I/O', 'Input/Output file: membaca (read) dan menulis (write) file dari program.'],
        ['Mode file', '"r" baca, "w" tulis-menimpa, "a" tambah-di-akhir.'],
        ['with open()', 'Pola wajib buka file: otomatis menutup file setelah blok selesai.'],
        ['Unpack', 'Memecah koleksi ke beberapa variabel sekaligus: nama, ip = baris.split(",").'],
      ],
      diagram: `<pre>        DATA TERPISAH DARI KODE

  inventory.txt (data, milik NOC)      audit.py (logika, milik engineer)
  ┌──────────────────────────┐      ┌─────────────────────────┐
  │ CHR-CORE-01,192.168.99.11│ ───▶ │ baca → loop → cek →     │
  │ CHR-DIST-01,192.168.99.12│      │ tulis laporan.txt       │
  └──────────────────────────┘      └─────────────────────────┘
  Tambah device = edit txt.          Ubah logika = edit py.
  Tidak saling mengganggu.</pre>`,
      scenario: 'Cabang baru dibuka: 5 router baru. Tanpa file inventory, engineer harus edit script (risiko merusak logika). Dengan inventory.txt, staf NOC cukup tambah 5 baris teks — script malam itu otomatis mencakupnya.',
      bestPractices: 'Selalu pakai with open(). "w" untuk laporan yang diganti, "a" untuk log akumulatif. Satu device per baris, format konsisten, dukung komentar (#). Validasi tiap baris (lewati yang kosong/rusak, jangan crash).',
      security: 'File inventory = peta jaringan. chmod 600, jangan commit ke repo publik bila berisi IP internal sensitif (atau samarkan). Laporan bisa berisi data operasional — perlakukan sesuai kebijakan data perusahaan.',
      challenge: 'Ubah baca_inv.py agar menulis hasilnya ke audit.csv dengan format "hostname,ip,status" di mana status = "check" untuk semua. Lalu buka CSV-nya — inilah embrio laporan automation.',
      interviewQ: 'Q: Mengapa inventory dipisah ke file, bukan ditulis di script? — A: Separation of concerns: data berubah lebih sering dari logika dan oleh orang berbeda (NOC vs engineer). File inventory bisa diubah tanpa risiko merusak kode, bisa di-generate dari sistem lain (CMDB), dan script menjadi generik — "audit apapun yang ada di inventory".',
      quiz: [
        { q: 'Apa perbedaan mode "w" dan "a" pada open()?', options: ['Tidak ada bedanya', '"w" menimpa isi file lama; "a" menambahkan di akhir tanpa menghapus yang lama', '"w" hanya untuk teks, "a" untuk angka', '"a" lebih cepat'], answer: 1, explain: '"w" = write (timpa, cocok untuk laporan harian yang diganti), "a" = append (tambah, cocok untuk log akumulatif). Salah pilih = data hilang atau duplikat.' },
        { q: 'Mengapa pola with open(...) as f: diwajibkan?', options: ['Agar kode terlihat keren', 'File otomatis ditutup setelah blok selesai — file yang lupa ditutup bisa korup atau terkunci', 'Agar lebih cepat', 'Tidak wajib'], answer: 1, explain: 'with menjamin penutupan file bahkan bila error terjadi di tengah. Lupa close() manual adalah bug klasik yang sulit dilacak.' },
        { q: 'FileNotFoundError saat open("inventory.txt") paling mungkin disebabkan oleh?', options: ['Python rusak', 'Nama file salah ketik atau script dijalankan dari direktori yang berbeda (path relatif)', 'File terlalu besar', 'Permission selalu'], answer: 1, explain: 'Path relatif dibaca dari direktori kerja saat ini, bukan lokasi script. Cek dengan ls; untuk script serius gunakan path absolut atau berbasis lokasi script.' },
      ],
    },
    {
      id: '34.7',
      title: 'SSH Pertama dengan Netmiko',
      body: `<p>Semua fondasi (34.2–34.6) bermuara ke sini: <b>program Python yang membuka SSH ke MikroTik, login, dan menjalankan command</b> — persis seperti kamu SSH manual, tapi tanpa jari manusia. Kita memakai library <b>netmiko</b> (dibangun di atas <b>paramiko</b>) karena ia paham prompt tiap vendor, termasuk RouterOS.</p>
<h3>Topology</h3>
<pre>[VM Linux: script Python + netmiko]
        │  SSH (TCP 22)
        ▼
[CHR 192.168.99.11] ── eksekusi command ──▶ output teks kembali ke script</pre>
<h3>Objective</h3>
<p>Membangun koneksi SSH dari Python ke CHR lab dan mengeksekusi satu command read-only.</p>
<h3>Configuration</h3>
<pre>$ source ~/venv-netlab/bin/activate
(venv-netlab) $ pip install netmiko
# netmiko = library SSH khusus network device (paham prompt RouterOS "&gt;").

# Di CHR (Winbox/terminal): siapkan user automation
/ip service print
# pastikan service ssh enabled, port 22
/user add name=automation password=GANTI_DENGAN_YANG_KUAT group=read
# ALASAN group=read dulu: mulai dari hak minimal (prinsip least privilege).
# Hak tulis hanya diberikan saat sub-bab konfigurasi membutuhkannya.</pre>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler  # 1. import class koneksi dari netmiko
import os                            # 2. import os: untuk membaca environment variable

device = {                           # 3. dict "kartu identitas" target
    'device_type': 'mikrotik_routeros',  # netmiko perlu tahu vendor → tahu promptnya
    'host': '192.168.99.11',            # IP CHR di VLAN 99 MANAGEMENT
    'username': 'automation',           # user khusus automation, BUKAN admin harian
    'password': os.environ['MIKROTIK_PASS'],
    # 4. ALASAN os.environ: password DIBACA dari environment variable,
    #    TIDAK ditulis di script. Set dulu: export MIKROTIK_PASS='...'
}

conn = ConnectHandler(**device)  # 5. buka koneksi SSH (** = unpack dict ke argumen)
print('Terhubung ke:', conn.host)  # 6. verifikasi: pastikan device yang benar!

out = conn.send_command('/system identity print')
# send_command = "ketik command ini, tunggu prompt kembali, kembalikan output"
print(out)   # Expected: name: CHR-CORE-01

conn.disconnect()  # 7. tutup koneksi — WAJIB, agar session tidak menumpuk di router</pre>
<h3>Verification</h3>
<p>Jalankan: <code>export MIKROTIK_PASS='...' &amp;&amp; python3 ssh_pertama.py</code> — output <code>Terhubung ke: 192.168.99.11</code> + identity tanpa error = sukses.</p>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<p><b>Gagal:</b> <i>NetmikoTimeoutException</i>. <b>Diagnosis:</b> SSH tidak menjawab — service ssh mati di CHR, IP salah, atau firewall. <b>Fix:</b> cek <code>/ip service print</code> di CHR.</p>
<p><b>Gagal:</b> <i>NetmikoAuthenticationException</i>. <b>Diagnosis:</b> user/password salah. <b>Fix:</b> cek <code>/user print</code>; pastikan env var ter-set (<code>echo $MIKROTIK_PASS</code> — kosong = lupa export).</p>
<p><b>Gagal:</b> <i>KeyError: 'MIKROTIK_PASS'</i>. <b>Diagnosis:</b> script dijalankan tanpa export env var. <b>Fix:</b> export dulu, atau pakai <code>os.environ.get()</code> dengan pesan error yang ramah (pola di 34.10).</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di LAB: password via env var cukup. Di PRODUCTION: user automation memakai <b>SSH key</b> (bukan password), IP source dibatasi firewall, dan setiap login tercatat di <code>/log print</code> router.</p></div>`,
      terms: [
        ['netmiko', 'Library Python untuk SSH ke network device; paham prompt & perilaku tiap vendor.'],
        ['paramiko', 'Library SSH generik di bawah netmiko; mengurus enkripsi dan handshake.'],
        ['ConnectHandler', 'Class netmiko untuk membuka koneksi ke satu device.'],
        ['send_command', 'Method netmiko: kirim satu command, tunggu selesai, kembalikan output teks.'],
        ['Environment variable', 'Variabel di level OS (bukan di script) untuk menyimpan secret seperti password.'],
      ],
      diagram: `<pre>        LAPISAN KONEKSI NETMIKO

  ┌──────────────────────────────────────┐
  │ script Python kamu                   │
  ├──────────────────────────────────────┤
  │ netmiko (paham prompt RouterOS "&gt;")  │
  ├──────────────────────────────────────┤
  │ paramiko (SSH: enkripsi, handshake)  │
  ├──────────────────────────────────────┤
  │ TCP 22 → CHR 192.168.99.11           │
  └──────────────────────────────────────┘
  Kamu tulis ~10 baris; netmiko+paramiko mengurus
  handshake SSH, prompt, dan paging ("-- more --").</pre>`,
      scenario: 'NOC punya 25 CHR cabang. Pagi ini ada dugaan satu router "aneh". Sebelum automation: SSH satu per satu (30 menit). Setelah pola 34.7 + loop 34.4: script 20 baris menyapa 25 router dalam 2 menit dan melaporkan mana yang tidak menjawab — daftar kunjungan pagi itu selesai sebelum kopi dingin.',
      bestPractices: 'Satu fungsi connect(ip) dipakai ulang semua script (jangan copy-paste blok koneksi). Selalu disconnect (gunakan try/finally — lihat 34.10). Mulai dengan user group read; naikkan hak hanya bila perlu.',
      security: 'Kredensial TIDAK PERNAH di-hardcode. Env var untuk lab; Vault/secret manager untuk production. User automation ≠ user manusia: nama jelas, hak minimal, password kuat.',
      challenge: 'Modifikasi script: bungkus koneksi dalam fungsi connect(ip) yang menerima IP sebagai parameter, lalu loop 34.4 untuk konek ke DUA CHR (192.168.99.11 dan .12) dan cetak identity masing-masing.',
      interviewQ: 'Q: Mengapa memakai netmiko, bukan paramiko langsung, untuk MikroTik? — A: Netmiko dibangun di atas paramiko dan paham kekhasan tiap vendor — prompt RouterOS, paging output "-- more --", timing. Dengan paramiko mentah kita harus menulis ulang logika "tunggu prompt" yang rapuh untuk tiap device.',
      quiz: [
        { q: 'Apa fungsi device_type="mikrotik_routeros" pada ConnectHandler?', options: ['Hanya label dokumentasi', 'Memberitahu netmiko vendor/OS target agar ia tahu prompt, paging, dan perilaku yang benar', 'Mempercepat koneksi 10x lipat', 'Mengubah password otomatis'], answer: 1, explain: 'Tiap vendor punya prompt dan kebiasaan berbeda; device_type membuat netmiko menyesuaikan cara "berbicara" ke RouterOS.' },
        { q: 'Mengapa password dibaca dari os.environ, bukan ditulis di script?', options: ['Agar script lebih pendek', 'Agar secret tidak ikut tersebar saat script di-copy, di-share, atau di-commit ke Git', 'Karena Python mewajibkan', 'Agar koneksi lebih cepat'], answer: 1, explain: 'Pisahkan secret dari code: env var untuk lab, Vault untuk production. Password hardcode = bocor saat script dibagikan.' },
        { q: 'Error NetmikoAuthenticationException paling mungkin berarti?', options: ['Kabel putus', 'Username/password salah atau user tidak ada di device', 'Python belum install', 'VLAN salah'], answer: 1, explain: 'Authentication = tahap login gagal. Cek /user print di CHR dan pastikan env var MIKROTIK_PASS ter-set dengan benar.' },
      ],
    },
    {
      id: '34.8',
      title: 'Parsing Output: String Method & Regex',
      body: `<p><code>send_command</code> mengembalikan <b>teks mentah</b> — tabel berantakan dengan spasi liar. Tugas kita: <b>parsing</b> (mengurai) teks menjadi data yang bisa dipakai script (angka, list, dict). Mulai dari string method (34.3), naik ke <b>regex</b> untuk pola yang kompleks.</p>
<h3>Level 1: String Method (Kasus Sederhana)</h3>
<pre>out = conn.send_command('/system resource print')
# contoh baris: "  cpu-load: 72%"

for baris in out.splitlines():      # splitlines() = pecah per baris
    if "cpu-load" in baris:         # saring hanya baris yang relevan
        nilai = baris.split(":")[1].strip().replace("%", "")
        print("CPU:", int(nilai), "%")
# Pola: splitlines → saring (in) → split → strip → konversi. Cukup untuk
# output SATU baris kunci. Rapuh bila format berubah-ubah.</pre>
<h3>Level 2: Regex — Pola Pencarian Sakti</h3>
<p><b>Regex</b> (regular expression) = "bahasa pola" untuk mencari teks. Dibaca sekali, dipakai selamanya:</p>
<pre>import re   # re = modul regex bawaan Python

teks = "cpu-load: 72%"
m = re.search(r"cpu-load:\s*(\d+)%", teks)
# r"..." = raw string (agar backslash tidak diartikan Python)
# \s*    = "spasi berapa pun (termasuk nol)"
# (\d+)  = "tangkap 1+ digit" → grup 1
# %      = karakter persen literal

if m:
    print("CPU:", m.group(1))   # group(1) = teks yang ditangkap (\d+)
# → CPU: 72</pre>
<h3>Kamus Regex Mini (80% Kebutuhan)</h3>
<div class="tblwrap"><table>
<tr><th>Pola</th><th>Arti</th><th>Contoh cocok</th></tr>
<tr><td><code>\d</code></td><td>satu digit (0–9)</td><td>"7" pada "72%"</td></tr>
<tr><td><code>\d+</code></td><td>satu atau lebih digit</td><td>"72"</td></tr>
<tr><td><code>\s</code></td><td>satu spasi/whitespace</td><td>" "</td></tr>
<tr><td><code>\s*</code></td><td>nol atau lebih spasi</td><td>"", "   "</td></tr>
<tr><td><code>(\d+)</code></td><td>tangkap digit sebagai grup</td><td>diambil via group(1)</td></tr>
<tr><td><code>.</code></td><td>satu karakter apapun</td><td>"a", "5", "-"</td></tr>
<tr><td><code>^</code> / <code>$</code></td><td>awal / akhir baris</td><td>jangkar posisi</td></tr>
</table></div>
<h3>Hands-on: Parse Tabel Interface</h3>
<pre>$ cat &gt; parse_lab.py &lt;&lt; 'EOF'
import re
# Simulasi output "/interface print" (nanti diganti send_command sungguhan)
out = """Flags: R - RUNNING
 #   NAME    MTU
 0 R ether1  1500
 1   ether2  1500
"""

for baris in out.splitlines():
    m = re.search(r"^\s*\d+\s+(R\s+)?(\S+)\s+(\d+)", baris)
    # ^\s*\d+   = awal baris, nomor urut
    # (R\s+)?   = flag R opsional (running?)
    # (\S+)     = nama interface (non-spasi)
    # (\d+)     = MTU
    if m:
        running = "UP" if m.group(1) else "down"
        print(f'{m.group(2)}: {running}, MTU {m.group(3)}')
EOF
$ python3 parse_lab.py
# Expected:
# ether1: UP, MTU 1500
# ether2: down, MTU 1500</pre>
<h3>Verification & Failure Injection</h3>
<p><b>Verifikasi:</b> bandingkan hasil parse dengan tabel asli — harus cocok semua baris. <b>Failure injection:</b> tambah baris aneh (mis. baris kosong, header) → regex tidak cocok → baris dilewati diam-diam. <b>Diagnosis:</b> itu benar (if m:), TAPI catat baris yang tidak ter-parse ke log agar anomali tidak hilang misterius. <b>Fix:</b> tambah <code>else: print("SKIP:", baris)</code> saat development.</p>
<div class="callout blue"><div class="t">Kapan Naik Level?</div><p style="margin:4px 0 0">String method cukup untuk 1–2 field sederhana. Regex untuk pola berulang multi-baris. Bila template parsing dipakai lintas banyak command dan harus tahan perubahan format → naik ke <b>TextFSM</b> (34.9).</p></div>`,
      terms: [
        ['Parsing', 'Mengurai teks mentah menjadi data terstruktur yang bisa dipakai program.'],
        ['Regex', 'Regular expression: bahasa pola untuk mencari/mencocokkan teks.'],
        ['Group', 'Bagian pola dalam (...) yang "ditangkap" dan bisa diambil via group(n).'],
        ['Raw string', 'String r"..." di Python; backslash dianggap literal — wajib untuk regex.'],
      ],
      diagram: `<pre>        LEVEL PARSING

  Level 1 — string method:
  "cpu-load: 72%" ──split/strip──▶ "72" ──int()──▶ 72
  (cepat, tapi rapuh bila format berubah)

  Level 2 — regex:
  "cpu-load: 72%" ── r"cpu-load:\s*(\d+)%" ──▶ group(1)="72"
  (tahan spasi liar, pola eksplisit, reusable)

  Level 3 — TextFSM (34.9):
  template terpisah ──▶ list of dicts (siap jadi laporan)</pre>`,
      scenario: 'Script backup membaca "/system resource print" dari 30 router untuk laporan kapasitas. Tanpa parsing, laporan = 30 blok teks mentah yang harus dibaca manusia. Dengan regex: 30 baris ringkas "hostname, cpu, memory, disk" — manajer baca dalam 10 detik.',
      bestPractices: 'Selalu pakai raw string r"..." untuk regex. Uji pola di satu contoh dulu (regex101.com atau script kecil) sebelum dipakai massal. Tangani "tidak cocok" secara eksplisit — jangan biarkan data hilang diam-diam.',
      security: 'Regex yang buruk bisa catastrophic backtracking (pola seperti (a+)+ pada input jahat). Untuk parsing output device internal risikonya kecil, tapi jangan pernah terapkan regex kompleks ke input yang tidak terpercaya tanpa batasan.',
      challenge: 'Tulis regex untuk mengekstrak IP dari baris " address: 192.168.99.11/24". Petunjuk: pola IP = r"(\\d+\\.\\d+\\.\\d+\\.\\d+)". Uji dengan 3 variasi baris (spasi berbeda).',
      interviewQ: 'Q: Kapan memakai string method vs regex vs TextFSM? — A: String method untuk 1–2 field sederhana dan format stabil. Regex saat pola berulang, multi-baris, atau butuh toleransi spasi — dengan pola yang terdokumentasi. TextFSM saat parsing dipakai lintas banyak command/template dan harus maintainable oleh tim — template terpisah dari kode.',
      quiz: [
        { q: 'Apa fungsi (\\d+) dalam pola regex r"cpu-load:\\s*(\\d+)%"?', options: ['Mencocokkan teks "(\\d+)" literal', 'Menangkap satu atau lebih digit sebagai grup 1 yang bisa diambil via group(1)', 'Menghapus digit', 'Mengganti persen'], answer: 1, explain: 'Kurung = grup tangkap; \\d+ = satu/lebih digit. group(1) mengambil "72" dari "cpu-load: 72%".' },
        { q: 'Mengapa pola regex ditulis sebagai raw string r"..."?', options: ['Agar lebih cepat', 'Agar backslash (\d, \s) dianggap literal dan tidak diartikan sebagai escape Python', 'Wajib agar tidak error', 'Agar bisa multiline'], answer: 1, explain: 'Tanpa r, Python menafsirkan \\d sebagai escape string dulu sebelum regex melihatnya — sumber bug membingungkan. r"..." menghindari itu.' },
        { q: 'Baris output tidak cocok dengan regex-mu (if m: gagal). Praktik terbaik saat development?', options: ['Abaikan saja', 'Catat/tampilkan baris yang terlewat agar anomali ketahuan, bukan hilang diam-diam', 'Hapus barisnya dari device', 'Ubah regex jadi .*'], answer: 1, explain: 'Data yang hilang diam-diam = laporan yang salah tanpa peringatan. Log baris tak-terparse saat dev; di production, hitung sebagai warning.' },
      ],
    },
    {
      id: '34.9',
      title: 'Parsing Terstruktur: TextFSM',
      body: `<p>Regex inline di script cepat menjadi "spaghetti pola" saat menangani 10 command berbeda. <b>TextFSM</b> (dibuat Google) memisahkan <b>template parsing</b> (file teks) dari <b>kode</b> (Python): template mendeskripsikan "output seperti apa", TextFSM mengubahnya menjadi <b>list of dicts</b> yang rapi.</p>
<h3>Konsep: Template Terpisah</h3>
<pre># File: resource.tpl  (template TextFSM — bukan Python!)
Value CPU (\d+)
Value MEM (\d+)

Start
  ^\s*cpu-load:\s*\${CPU}% -> Continue
  ^\s*free-memory:\s*\${MEM} -> Record
# Cara baca: Value mendefinisikan kolom; Start = state awal;
# tiap baris pola dicocokkan; -> Record = "simpan satu baris hasil".</pre>
<h3>Pakai dari Python</h3>
<pre>(venv-netlab) $ pip install textfsm
$ cat &gt; fsm_lab.py &lt;&lt; 'EOF'
import textfsm

with open("resource.tpl") as f:
    template = textfsm.TextFSM(f)   # muat template

raw = """          uptime: 3d12h
        cpu-load: 72%
      free-memory: 1832.4MiB
"""
hasil = template.ParseText(raw)     # parse! → list of lists
print(template.header)  # → ['CPU', 'MEM']
print(hasil)            # → [['72', '1832']]

# Ubah menjadi list of dicts (format idaman laporan):
rows = [dict(zip(template.header, r)) for r in hasil]
print(rows)  # → [{'CPU': '72', 'MEM': '1832'}]
EOF
$ python3 fsm_lab.py</pre>
<h3>Mengapa Repot-repot Pakai Template?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Regex inline</th><th>TextFSM</th></tr>
<tr><td>Perubahan format output</td><td>Edit kode di banyak tempat</td><td>Edit satu file .tpl</td></tr>
<tr><td>Dibaca non-programmer</td><td>Sulit</td><td>Template cukup jelas</td></tr>
<tr><td>Reuse lintas command</td><td>Copy-paste pola</td><td>Koleksi template (ada repo publik ntc-templates!)</td></tr>
</table></div>
<p><b>ntc-templates</b> = repositori publik berisi ratusan template jadi untuk command populer tiap vendor. ALASAN disebut: jangan tulis template dari nol bila sudah ada yang teruji komunitas.</p>
<h3>Verification & Failure Injection</h3>
<p><b>Verifikasi:</b> hasil parse = list of dicts dengan key sesuai Value. <b>Failure injection:</b> ubah template (hapus satu Value) → key hilang dari hasil. <b>Diagnosis:</b> template adalah "kontrak" — output mengikuti template, bukan sebaliknya. <b>Fix:</b> versioning template di Git bersama script (berubah bersama).</p>
<div class="callout"><div class="t">Kapan TextFSM Overkill?</div><p style="margin:4px 0 0">Untuk 1–2 field sekali pakai, regex inline (34.8) lebih cepat. TextFSM bersinar saat: banyak command, dipakai tim, dan format output perlu dikelola sebagai artefak tersendiri.</p></div>`,
      terms: [
        ['TextFSM', 'Library Google untuk parsing CLI via template; menghasilkan data terstruktur.'],
        ['Template', 'File teks berisi definisi Value + pola baris; "kontrak" parsing.'],
        ['ntc-templates', 'Repositori publik template TextFSM jadi untuk banyak vendor/command.'],
        ['State', 'Posisi dalam template (Start, dsb.); pola dicocokkan per state.'],
      ],
      diagram: `<pre>        TEXTFSM: PISAHKAN TEMPLATE DARI KODE

  resource.tpl (template)        fsm_lab.py (kode)
  ┌──────────────────┐         ┌──────────────────┐
  │ Value CPU (\d+)  │         │ template =       │
  │ Start            │ ──────▶ │  TextFSM(file)   │
  │  ^cpu-load...    │  muat   │ hasil =          │
  └──────────────────┘         │  ParseText(raw)  │
                               └────────┬─────────┘
                                        ▼
                               [{'CPU': '72', ...}]
                               (list of dicts — siap laporan)</pre>`,
      scenario: 'Perusahaan menambah 3 vendor device baru. Tim yang memakai regex inline harus menulis ulang 15 pola di dalam kode. Tim yang memakai TextFSM cukup menambah 3 file template — kode Python tidak berubah sama sekali.',
      bestPractices: 'Satu template per command per vendor. Simpan template di folder templates/ dan version di Git. Cek dulu ntc-templates sebelum menulis sendiri. Uji template dengan contoh output asli yang disimpan sebagai fixture.',
      security: 'Template hanya mendefinisikan pola — tidak mengeksekusi apapun, aman. Namun pastikan file template berasal dari sumber tepercaya bila mengambil dari publik (review sebelum pakai).',
      challenge: 'Tulis template TextFSM untuk output "/system identity print" (satu baris "name: CHR-CORE-01") dengan Value NAME (\\S+). Parse dan cetak sebagai dict.',
      interviewQ: 'Q: Apa keunggulan TextFSM dibanding regex inline? — A: Separation of concerns: template (apa yang di-parse) terpisah dari kode (bagaimana memakai hasilnya). Perubahan format output = edit file template, bukan operasi kode; template bisa di-review, di-test, dan dipakai ulang lintas script — bahkan ada koleksi publik ntc-templates.',
      quiz: [
        { q: 'Apa peran file template (.tpl) dalam TextFSM?', options: ['Menjalankan command ke device', 'Mendefinisikan Value (kolom) dan pola baris sebagai "kontrak" parsing yang terpisah dari kode Python', 'Mengenkripsi output', 'Menggantikan netmiko'], answer: 1, explain: 'Template = deskripsi format output. Kode hanya memuat template dan memanggil ParseText — perubahan format = edit template, bukan kode.' },
        { q: 'Apa itu ntc-templates?', options: ['Library SSH baru', 'Repositori publik berisi ratusan template TextFSM jadi untuk command populer tiap vendor', 'Tool monitoring', 'Distro Linux'], answer: 1, explain: 'Jangan tulis dari nol bila komunitas sudah menguji: cek ntc-templates dulu untuk command/vendor yang kamu butuhkan.' },
        { q: 'Output TextFSM yang ideal untuk laporan berbentuk?', options: ['String mentah', 'List of dicts — tiap baris hasil adalah dict dengan key dari Value', 'File biner', 'Screenshot'], answer: 1, explain: 'List of dicts langsung bisa di-loop untuk laporan, CSV, atau API — inilah "data terstruktur" yang menjadi tujuan parsing.' },
      ],
    },
    {
      id: '34.10',
      title: 'Error Handling & Script Siap Produksi',
      body: `<p>Script lab yang crash saat device ke-17 dari 25 = 16 hasil hilang. Script production-grade: <b>menangani error dengan anggun</b> (satu device gagal ≠ semua gagal), <b>mencatat log</b>, dan <b>terstruktur rapi</b>. Ini pembeda "script coba-coba" vs "tool operasional".</p>
<h3>try/except: Tangkap Error, Jangan Crash</h3>
<pre>for dev in inventory:
    try:
        hasil = audit_satu_device(dev)   # "coba" — bisa gagal
    except Exception as e:
        # except = "bila error jenis ini terjadi, lakukan ini, JANGAN crash"
        print(f"GAGAL {dev['hostname']}: {e}")
        gagal.append(dev["hostname"])
        continue   # lanjut ke device BERIKUTNYA
# Pola: satu device bermasalah tidak menggugurkan 24 lainnya.
# ALASAN Exception umum di sini: kita ingin SEMUA error tercatat;
# di kode kritis, tangkap jenis spesifik (lihat bawah).</pre>
<h3>Logging: Jejak yang Bisa Diaudit</h3>
<pre>import logging
logging.basicConfig(
    filename="audit.log",   # tulis ke file, bukan hanya layar
    level=logging.INFO,     # INFO ke atas dicatat (DEBUG di bawahnya tidak)
    format="%(asctime)s %(levelname)s %(message)s",
)
logging.info("Audit dimulai")          # info: kejadian normal penting
logging.warning("CHR-02 lambat: 8s")  # warning: aneh tapi jalan terus
logging.error("CHR-03: auth gagal")    # error: gagal, perlu tindakan
# ALASAN logging (bukan print): log punya waktu, level, dan tujuan file —
# bisa difilter ("tampilkan hanya error") dan diaudit belakangan.</pre>
<h3>Struktur Script Rapi: main() Guard</h3>
<pre>import os, logging
from netmiko import ConnectHandler

def connect(ip):                       # 1. fungsi: satu tugas, reusable
    device = {'device_type': 'mikrotik_routeros', 'host': ip,
              'username': 'automation',
              'password': os.environ.get('MIKROTIK_PASS')}
    if not device['password']:
        raise ValueError("Env var MIKROTIK_PASS belum di-set!")
    # ALASAN .get + cek eksplisit: error "KeyError" misterius diganti
    # pesan yang memberitahu user persis apa yang salah.
    return ConnectHandler(**device)

def main():                            # 2. main(): orkestrasi alur program
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(message)s")
    for ip in ["192.168.99.11", "192.168.99.12"]:
        try:
            conn = connect(ip)
            print(ip, "OK")
            conn.disconnect()
        except Exception as e:
            logging.error(f"{ip}: {e}")

if __name__ == "__main__":
    main()
# 3. Guard ini = "jalankan main() HANYA bila file dieksekusi langsung".
#    ALASAN: bila file ini di-import sebagai modul (34.5), main() TIDAK
#    ikut jalan — import tetap aman. Tanpa guard, import = eksekusi!</pre>
<h3>Checklist Script Siap Produksi</h3>
<ul>
<li>Kredensial dari env var/Vault — tidak ada secret di kode.</li>
<li>try/except di loop device — satu gagal, lainnya tetap jalan; kegagalan tercatat.</li>
<li>Logging ke file dengan level yang bermakna.</li>
<li>Struktur main() guard — bisa di-import tanpa efek samping.</li>
<li>Nama file laporan berversi tanggal: <code>laporan-2026-10-14.txt</code> (tak menimpa kemarin).</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di LAB: pola di atas cukup. Di PRODUCTION tambah: <b>dry-run mode</b> (tampilkan rencana tanpa eksekusi — lihat Part 35), <b>timeout eksplisit</b> tiap koneksi, <b>retry terbatas</b> untuk error jaringan sesaat, dan <b>notifikasi</b> (email/Telegram) saat gagal.</p></div>`,
      terms: [
        ['try/except', 'Blok penanganan error: "coba" kode, "tangkap" errornya agar program tidak crash.'],
        ['Logging', 'Pencatatan kejadian terstruktur (waktu, level) ke file — jejak audit script.'],
        ['main() guard', 'Pola if __name__ == "__main__": agar file aman di-import tanpa ikut mengeksekusi.'],
        ['Least privilege', 'Prinsip hak akses minimal: beri hanya izin yang dibutuhkan, tidak lebih.'],
      ],
      diagram: `<pre>        ANATOMI SCRIPT SIAP PRODUKSI

  ┌─────────────────────────────────────┐
  │ import (netmiko, os, logging, re)   │
  ├─────────────────────────────────────┤
  │ KONSTANTA (threshold, dsb.)         │
  ├─────────────────────────────────────┤
  │ def connect(ip): ...                │  ← fungsi kecil,
  │ def parse_output(teks): ...         │    satu tugas tiap fungsi
  │ def tulis_laporan(data): ...        │
  ├─────────────────────────────────────┤
  │ def main():                         │  ← orkestrasi:
  │   loop device: try/except + logging │    baca → proses → tulis
  ├─────────────────────────────────────┤
  │ if __name__ == "__main__": main()   │  ← guard: aman di-import
  └─────────────────────────────────────┘</pre>`,
      scenario: 'Script backup malam hari crash di device ke-3 dari 40 karena satu router mati — 37 router tidak ter-backup dan tidak ada yang tahu sampai audit bulan depan. Setelah 34.10: device mati tercatat sebagai error di log, 39 lainnya tetap ter-backup, dan pagi harinya NOC menerima daftar "gagal semalam" untuk ditindaklanjuti.',
      bestPractices: 'Tangkap error spesifik bila bisa (NetmikoTimeoutException), umum bila perlu kelangsungan. Log, jangan hanya print. Satu device gagal = catat + lanjut, bukan crash. Guard main() di setiap script.',
      security: 'Pesan error bisa membocorkan info (IP, username, potongan config) — pastikan file log punya permission terbatas dan tidak ikut ter-upload ke repo publik. Jangan log password/token dalam bentuk apapun.',
      challenge: 'Refaktor script ssh_pertama.py (34.7) menjadi struktur 34.10: fungsi connect(), main() guard, try/except per device untuk 2 IP, dan logging ke file. Jalankan 2x: sekali normal, sekali dengan satu IP salah — pastikan yang benar tetap sukses.',
      interviewQ: 'Q: Apa beda script "jalan di laptopku" dengan "siap production"? — A: Production-grade menangani dunia nyata: error ditangkap per device (bukan crash massal), kejadian tercatat di log ber-level, kredensial di luar kode, struktur main-guard agar reusable, dan perilaku idempoten/terprediksi. "Jalan sekali" itu demo; "jalan tiap malam tanpa diawasi" itu production.',
      quiz: [
        { q: 'Apa tujuan try/except di dalam loop banyak device?', options: ['Mempercepat loop', 'Satu device gagal tidak menggugurkan device lain — error dicatat, loop lanjut', 'Menghilangkan semua error', 'Agar kode lebih pendek'], answer: 1, explain: 'Tanpa try/except, satu device bermasalah = crash = sisa device tidak diproses dan hasil hilang. Pola benar: tangkap, catat, lanjut.' },
        { q: 'Mengapa logging dianjurkan dibanding print untuk script operasional?', options: ['Log lebih cepat diketik', 'Log punya timestamp, level (INFO/WARNING/ERROR), dan tujuan file — bisa difilter dan diaudit belakangan', 'Print sudah dilarang', 'Tidak ada bedanya'], answer: 1, explain: 'Print = teks ke layar yang hilang. Logging = jejak terstruktur: kapan, seberapa parah, tersimpan di file untuk investigasi.' },
        { q: 'Apa fungsi dari if __name__ == "__main__": guard?', options: ['Mempercepat eksekusi', 'File aman di-import sebagai modul tanpa ikut mengeksekusi main() — eksekusi hanya bila dijalankan langsung', 'Mengenkripsi script', 'Wajib agar bisa di-loop'], answer: 1, explain: 'Tanpa guard, meng-import file (34.5) akan langsung menjalankan seluruh script — efek samping berbahaya. Guard memisahkan "definisi" dari "eksekusi".' },
      ],
    },
  ],
  project: {
    title: 'Project: Network Audit Script',
    html: `<p><b>Misi:</b> bangun <b>Network Audit Script</b> — tool Python production-grade yang mengaudit 2–3 CHR lab (CPU, memory, interface, identity), menulis laporan berversi tanggal, mencatat log, lalu publikasikan ke GitHub sebagai portfolio automation pertamamu.</p>
<h3>Struktur Project</h3>
<pre>network-audit-script/
├── README.md            # masalah, arsitektur, cara pakai, contoh output
├── requirements.txt     # netmiko, textfsm
├── inventory.txt        # hostname,ip per baris (data, bukan kode!)
├── netlib.py            # modul: connect(), parse_resource(), cek_cpu()
├── audit.py             # script utama: loop inventory + try/except + logging
├── templates/
│   └── resource.tpl     # template TextFSM untuk /system resource print
└── reports/             # laporan-YYYY-MM-DD.txt (di-.gitignore bila sensitif)</pre>
<h3>Langkah Pengerjaan</h3>
<ol>
<li><b>Setup:</b> venv baru, install netmiko+textfsm, 2–3 CHR di 192.168.99.0/24, user automation (group read).</li>
<li><b>netlib.py:</b> fungsi connect(ip) (env var!), parse dengan regex/TextFSM, cek_cpu().</li>
<li><b>audit.py:</b> baca inventory.txt → loop + try/except per device → tulis laporan berversi tanggal → logging ke audit.log.</li>
<li><b>Uji ketahanan:</b> matikan satu CHR → pastikan lainnya tetap teraudit dan kegagalan tercatat di log.</li>
<li><b>Dokumentasi:</b> README berisi diagram arsitektur, contoh laporan, dan bagian "LAB vs Production".</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio)</h3>
<ol>
<li>Buat repo publik: <code>network-audit-script</code>.</li>
<li><b>SEBELUM push:</b> pastikan TIDAK ADA secret — cek <code>grep -ri "password" .</code>; inventory berisi IP lab saja; file .log/.txt laporan masuk .gitignore bila sensitif.</li>
<li>README wajib: masalah yang diselesaikan, cara install (venv + requirements.txt), cara pakai, contoh output laporan, dan batasan.</li>
<li>Commit per fitur (<code>feat: tambah parsing TextFSM</code>), bukan satu commit raksasa.</li>
<li>Tautkan di CV/LinkedIn: "Python network audit tool — SSH massal, parsing terstruktur, error-resilient."</li>
</ol>
<h3>Kriteria Selesai</h3>
<ul>
<li>Script mengaudit 2–3 CHR tanpa error; laporan berversi tanggal ter-generate.</li>
<li>Failure injection terbukti: satu CHR mati → lainnya tetap teraudit, error tercatat di log.</li>
<li>Tidak ada secret di repo (terverifikasi dengan grep).</li>
<li>Struktur main() guard + modul netlib.py dipakai (tidak ada copy-paste logika).</li>
<li>README lengkap + repo GitHub publik tertaut.</li>
</ul>`,
  },
};
