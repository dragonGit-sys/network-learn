// PART 36 — Ansible for Network Automation (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part36: Part = {
  id: '36',
  number: 'PART 36',
  title: 'Ansible for Network Automation',
  phaseId: 'fase-7',
  description: 'Otomasi deklaratif & agentless dengan Ansible: inventory, ad-hoc command, playbook YAML, variables, idempotency, check mode, dan Vault — untuk mengelola banyak MikroTik sekaligus.',
  repoFolder: 'part-36-ansible',
  objectives: [
    'Menjelaskan perbedaan pola declarative (Ansible) vs imperative (script Python Part 34/35) dan kapan memakai masing-masing.',
    'Menggambarkan arsitektur Ansible: control node, managed node, inventory, module, dan playbook — sebelum menulis satu baris YAML pun.',
    'Menulis inventory dan menjalankan ad-hoc command ke CHR lab via SSH tanpa agent.',
    'Menulis playbook YAML yang dijelaskan line-by-line: backup config dan audit dasar ke banyak CHR sekaligus.',
    'Menerapkan praktik production: variables, idempotency, check mode (--check --diff), dan ansible-vault untuk secrets.',
  ],
  prerequisites: 'Part 35 (konsep automation MikroTik — pola yang sama, tool berbeda), Part 33 (Linux — Ansible berjalan di Linux), Part 34 (dasar Python/YAML membantu membaca struktur). Lab: 1 Linux sebagai control node + 1–3 CHR di GNS3 (192.168.99.0/24, SSH aktif, user automation).',
  subbabs: [
    {
      id: '36.1',
      title: 'Mengapa Ansible',
      body: `<p>Di Part 34/35 kamu menulis <b>script Python imperatif</b>: "lakukan A, lalu B, lalu C" — kamu menulis <i>langkahnya</i>. Ansible membalik pola pikir: kamu mendeklarasikan <b>keadaan akhir yang diinginkan</b>, Ansible yang mencari cara mencapainya. Analoginya: script Python = resep masak langkah-demi-langkah; Ansible = "saya mau nasi goreng sudah jadi di meja" dan dapur pintar yang tahu caranya.</p>
<h3>Declarative vs Imperative</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Imperative (Python, Part 34/35)</th><th>Declarative (Ansible)</th></tr>
<tr><td>Kamu tulis</td><td>Langkah demi langkah (<code>connect → kirim command → parse</code>)</td><td>Keadaan akhir ("NTP server harus 192.168.99.1")</td></tr>
<tr><td>Kalau dijalankan 2x</td><td>Tergantung kamu yang mengurus (harus coding idempotent manual)</td><td>Aman by design (idempotent — dibahas di 36.7)</td></tr>
<tr><td>Cocok untuk</td><td>Logika kompleks, parsing unik, integrasi API aneh</td><td>Konfigurasi massal yang standar & berulang</td></tr>
<tr><td>Contoh</td><td>Script audit custom dengan regex rumit</td><td>"Pastikan 50 router punya user automation & NTP yang sama"</td></tr>
</table></div>
<h3>Agentless: Senjata Rahasianya</h3>
<p><b>Agentless</b> artinya: kamu <b>TIDAK perlu menginstall software apapun di router target</b>. Ansible "menumpang" SSH yang sudah ada (port 22, yang sudah kamu aktifkan sejak Part 35.1). Bandingkan dengan tools yang butuh agent: tiap device harus diinstall, diupdate, dan dijaga — di network device yang resource-nya pas-pasan, itu beban. Dengan Ansible: satu laptop Linux (control node) + SSH = kamu bisa mengelola ratusan device.</p>
<div class="callout"><div class="t">Kapan Pakai Yang Mana?</div><p style="margin:4px 0 0">Bukan soal "mana yang lebih baik" — keduanya ada di toolbox-mu. <b>Ansible</b> untuk pekerjaan standar yang berulang ke banyak device (backup massal, template config, compliance check). <b>Python</b> (Part 34/35) untuk logika yang terlalu spesifik/kustom untuk dimodelkan sebagai "keadaan akhir". Di dunia nyata, keduanya sering dipakai bersamaan.</p></div>
<p><b>Verification:</b> jelaskan dengan kata-katamu sendiri perbedaan declarative vs imperative ke teman — kalau bisa tanpa melihat catatan, konsepnya sudah nempel. <b>Failure injection (konseptual):</b> bayangkan kamu punya script imperatif "tambahkan route X" tanpa pengecekan — dijalankan 2x, route X ganda (atau error). Itulah masalah yang pola declarative selesaikan. <b>Troubleshooting pola pikir:</b> kalau bingung "ini cocoknya Ansible atau Python?", tanya: "bisakah saya nyatakan sebagai keadaan akhir?" — ya → Ansible; tidak → Python. <b>Final verification:</b> tulis 1 contoh tugas NOC-mu yang declarative dan 1 yang imperatif.</p>`,
      terms: [
        ['declarative', 'Pola otomasi: kamu menyatakan keadaan akhir yang diinginkan, tool yang mengurus caranya.'],
        ['imperative', 'Pola otomasi: kamu menulis langkah-demi-langkah yang harus dieksekusi berurutan.'],
        ['agentless', 'Tidak membutuhkan software/agent terinstall di device target; Ansible hanya memakai SSH.'],
        ['idempotent', 'Sifat operasi yang aman dijalankan berulang: hasil akhirnya tetap sama (dibahas penuh di 36.7).'],
      ],
      diagram: `<pre>        DUA POLA PIKIR OTOMASI

  IMPERATIF (Python, Part 34/35)        DEKLARATIF (Ansible, part ini)
  ┌─────────────────────────┐          ┌─────────────────────────┐
  │ 1. connect()            │          │ "NTP server di semua    │
  │ 2. kirim "/ip route.."  │          │  CHR harus 192.168.99.1"│
  │ 3. cek apakah sudah ada │          │                         │
  │ 4. kalau belum → tambah │          │  Ansible yang mengecek  │
  │ 5. disconnect()         │          │  & memperbaiki sendiri  │
  └─────────────────────────┘          └─────────────────────────┘
   Kamu urus SEMUA langkah               Kamu nyatakan TUJUAN</pre>`,
      scenario: 'NOC mengelola 40 router cabang. Tugas rutin: "pastikan semua punya user monitoring & NTP yang benar". Dengan script imperatif, tiap ada cabang baru kamu edit script. Dengan Ansible: tambah 1 baris IP di inventory (36.3), jalankan playbook yang sama — selesai dalam hitungan menit, dan aman di-rerun kapan saja.',
      bestPractices: 'Jangan fanatik satu tool. Standarnya industri: Ansible untuk configuration management massal, Python untuk glue logic & integrasi kustom. Kuasai keduanya = kamu fleksibel.',
      security: 'Agentless = attack surface lebih kecil: tidak ada agent pihak ketiga berjalan di router production-mu. Satu-satunya jalur adalah SSH yang sudah kamu amankan (Part 35.1: user khusus, key-based auth di production).',
      challenge: 'Tulis 3 tugas operasional di tempat kerjamu: klasifikasikan masing-masing sebagai "cocok Ansible (declarative)" atau "cocok Python (imperative)" beserta alasannya.',
      interviewQ: 'Q: Apa keunggulan utama Ansible dibanding script Python untuk konfigurasi massal? — A: Tiga hal: (1) declarative — nyatakan keadaan akhir, bukan langkah; (2) idempotent by design — aman di-rerun; (3) agentless — tanpa install apapun di device, cukup SSH.',
      quiz: [
        { q: 'Apa perbedaan inti declarative vs imperative?', options: ['Declarative lebih cepat dieksekusi', 'Declarative menyatakan keadaan akhir yang diinginkan; imperative menulis langkah demi langkah', 'Imperative tidak butuh coding', 'Keduanya sama saja, hanya beda nama'], answer: 1, explain: 'Declarative = "saya mau keadaan X"; imperative = "lakukan A, lalu B, lalu C". Ansible declarative, script Python Part 34/35 imperative.' },
        { q: 'Apa arti agentless pada Ansible?', options: ['Ansible gratis tanpa lisensi', 'Tidak perlu menginstall software/agent apapun di device target — cukup SSH yang sudah ada', 'Ansible berjalan tanpa listrik', 'Ansible tidak butuh control node'], answer: 1, explain: 'Agentless = zero footprint di device. Inilah alasan Ansible populer untuk network device yang resource-nya terbatas.' },
        { q: 'Kapan script Python (Part 34/35) lebih cocok daripada Ansible?', options: ['Tidak pernah — Ansible selalu lebih baik', 'Untuk logika kompleks/parsing output yang terlalu spesifik untuk dimodelkan sebagai "keadaan akhir"', 'Hanya untuk device Cisco', 'Python hanya untuk pemula'], answer: 1, explain: 'Keduanya tools di toolbox yang sama: Ansible untuk pekerjaan standar massal, Python untuk logika kustom. Engineer senior menguasai keduanya.' },
      ],
    },
    {
      id: '36.2',
      title: 'Arsitektur Ansible',
      body: `<p><b>Aturan part ini: arsitektur dulu, coding kemudian.</b> Sebelum menyentuh YAML, pahami dulu siapa bicara dengan siapa — karena 90% error Ansible pemula berasal dari salah paham arsitektur, bukan salah sintaks.</p>
<h3>Lima Komponen Inti</h3>
<pre>                         INVENTORY
                    (daftar device + grup)
                            │
                            ▼
┌──────────────┐   SSH (port 22)   ┌──────────────────┐
│ CONTROL NODE │ ─────────────────▶│  MANAGED NODES   │
│ (laptop      │   tanpa agent!    │  CHR 192.168.99  │
│  Linux-mu)   │◀─────────────────│  .11 / .12 / .13 │
└──────────────┘   hasil kembali   └──────────────────┘
       │                                    ▲
       │ baca                               │ eksekusi
       ▼                                    │
┌──────────────┐                   ┌──────────────────┐
│   PLAYBOOK   │─── memakai ──────▶│     MODULES      │
│  (rencana    │                   │ (unit kerja:     │
│   dalam YAML)│                   │  command, copy,  │
└──────────────┘                   │  template, ...)  │
                                   └──────────────────┘</pre>
<ol>
<li><b>Control node</b> — SATU mesin Linux tempat Ansible diinstall. Di sinilah kamu menulis & menjalankan semuanya. ALASAN hanya butuh satu: semua "otak" terpusat di sini; managed node tidak butuh apa-apa.</li>
<li><b>Managed nodes</b> — device yang dikelola (CHR lab-mu). Syaratnya cuma: bisa di-SSH dari control node. Itu saja.</li>
<li><b>Inventory</b> — file teks berisi daftar managed nodes + cara menghubungi mereka (IP, user, grup). Seperti buku telepon Ansible.</li>
<li><b>Modules</b> — unit kerja terkecil ("lakukan satu hal"): <code>command</code> (jalankan perintah), <code>copy</code> (kirim file), <code>template</code>, dan ratusan lainnya. Kamu tidak menulis SSH manual — module yang mengurusnya.</li>
<li><b>Playbook</b> — "rencana" dalam format YAML: daftar <b>plays</b> (untuk grup host mana) yang masing-masing berisi <b>tasks</b> (panggil module apa dengan argumen apa).</li>
</ol>
<h3>Alur Eksekusi (Packet Flow-nya Ansible)</h3>
<p>Saat kamu menjalankan <code>ansible-playbook</code>: (1) Ansible membaca inventory → tahu targetnya siapa; (2) membaca playbook → tahu mau apa; (3) untuk tiap host: membuka SSH, mengirim module (sebagai script kecil), mengeksekusinya di target, mengambil hasilnya; (4) melaporkan per host: <code>ok</code> (tidak ada perubahan), <code>changed</code> (ada perubahan diterapkan), atau <code>failed</code> (gagal). Pola ini penting: Ansible mengeksekusi <b>per host secara berurutan</b> (default), jadi 3 CHR = 3 sesi SSH berurutan.</p>
<div class="callout blue"><div class="t">Analogi Gedung</div><p style="margin:4px 0 0">Control node = mandor. Inventory = daftar alamat proyek. Playbook = gambar kerja. Modules = tukang (tukang cat, tukang las). Mandor tidak mengecat sendiri — ia mengirim tukang yang tepat ke alamat yang tepat, lalu menerima laporan "sudah/belum/ada masalah".</p></div>
<p><b>Verification:</b> gambar ulang diagram arsitektur di kertas tanpa melihat — lima komponen + arah panah SSH harus benar. <b>Failure injection (konseptual):</b> apa yang terjadi bila control node tidak bisa SSH ke satu CHR? → host itu dilaporkan <code>unreachable</code>, host lain tetap diproses (Ansible tidak berhenti total — perilaku default yang penting dipahami). <b>Troubleshooting:</b> error "UNREACHABLE" hampir selalu masalah jaringan/SSH (cek seperti Part 35.1), bukan masalah Ansible-nya. <b>Final verification:</b> jelaskan ke diri sendiri: mengapa Ansible tidak butuh database atau server pusat? (Jawaban: karena stateless — semua info ada di inventory + playbook yang kamu tulis.)</p>`,
      terms: [
        ['control node', 'Mesin (Linux) tempat Ansible diinstall; dari sinilah semua otomasi dijalankan.'],
        ['managed node', 'Device target yang dikelola Ansible; syaratnya hanya bisa di-SSH.'],
        ['inventory', 'File daftar managed nodes: IP/hostname, grup, dan variabel koneksi.'],
        ['module', 'Unit kerja terkecil Ansible ("lakukan satu hal"), mis. command, copy, template.'],
        ['playbook', 'Rencana otomasi dalam YAML: kumpulan plays berisi tasks.'],
        ['play', 'Satu blok dalam playbook: "untuk grup host X, lakukan tasks Y".'],
        ['task', 'Satu pemanggilan module dengan argumennya di dalam sebuah play.'],
      ],
      diagram: `<pre>   EKSEKUSI PLAYBOOK = PER HOST, BERURUTAN (default)

  ansible-playbook site.yml
         │
         ▼
  ┌─────────────┐
  │ baca        │──▶ inventory: 3 CHR target
  │ inventory + │──▶ playbook: 2 tasks
  │ playbook    │
  └──────┬──────┘
         ▼
   host 1 (99.11): SSH → task1 → task2 → ok/changed
         ▼
   host 2 (99.12): SSH → task1 → task2 → ok/changed
         ▼
   host 3 (99.13): SSH → task1 → task2 → ok/changed
         ▼
   REKAPITULASI: ok=.. changed=.. failed=.. unreachable=..</pre>`,
      scenario: 'Kamu diminta "pastikan NTP di semua 40 router cabang benar". Tanpa Ansible: SSH satu per satu (berjam-jam, rawan typo). Dengan Ansible: 1 inventory + 1 playbook 10 baris → 1 perintah, 5 menit, plus laporan per router mana yang berubah dan mana yang gagal.',
      bestPractices: 'Satu control node untuk tim (bukan tiap engineer punya versi playbook sendiri-sendiri). Simpan inventory + playbook di Git — itu "source of truth" infrastrukturmu.',
      security: 'Control node adalah kunci kerajaan: siapa pegang control node + inventory bisa mengubah seluruh network. Lindungi seperti production server: akses terbatas, SSH key, dan audit siapa menjalankan apa.',
      challenge: 'Tanpa membuka catatan: sebutkan 5 komponen Ansible dan peran masing-masing dalam 1 kalimat per komponen.',
      interviewQ: 'Q: Jelaskan alur kerja Ansible saat menjalankan playbook. — A: Ansible (di control node) membaca inventory untuk daftar target dan playbook untuk rencana; lalu per host membuka SSH, mengirim & mengeksekusi module, mengumpulkan hasil; akhirnya melaporkan status per host: ok (tidak berubah), changed (berubah), failed/unreachable (gagal).',
      quiz: [
        { q: 'Apa itu control node?', options: ['Router utama di network', 'Satu mesin Linux tempat Ansible diinstall dan semua playbook dijalankan', 'Database penyimpan konfigurasi', 'Agen yang diinstall di tiap router'], answer: 1, explain: 'Semua "otak" Ansible ada di control node; managed node tidak butuh software apapun (agentless).' },
        { q: 'Bagaimana Ansible berkomunikasi dengan MikroTik CHR?', options: ['Melalui agent yang diinstall di CHR', 'Melalui API khusus Ansible', 'Melalui SSH biasa (port 22) — sama seperti kamu SSH manual', 'Melalui kabel console'], answer: 2, explain: 'Inilah arti agentless: Ansible menumpang SSH yang sudah ada. Module dikirim & dieksekusi via sesi SSH.' },
        { q: 'Apa perbedaan play dan task?', options: ['Sama saja', 'Play = satu blok "untuk grup host X lakukan tasks Y"; task = satu unit kerja (satu module + argumen) di dalam play', 'Task lebih besar dari play', 'Play hanya untuk server Linux'], answer: 1, explain: 'Hierarkinya: playbook berisi plays, play berisi tasks, task memanggil module. Urutan ini wajib hafal di luar kepala.' },
      ],
    },
    {
      id: '36.3',
      title: 'Instalasi & File Inventory',
      body: `<p>Sekarang bagian hands-on pertama. <b>Topology:</b> 1 control node (Linux-mu, mis. 192.168.99.10) + 3 CHR lab (192.168.99.11–13). <b>Objective:</b> Ansible terinstall dan bisa "melihat" ketiga CHR lewat inventory.</p>
<h3>Instalasi (di Control Node)</h3>
<pre>$ pip install ansible
# ALASAN pip (bukan apt): dapat versi terbaru; konsisten dengan cara install
# netmiko di Part 35.1. Di production, pin versi: pip install "ansible==10.*"

$ ansible --version
# Expected: ansible [core 2.1x.x] ... python version = 3.x
# ALASAN verifikasi versi: behavior bisa beda antar versi mayor (catat versimu!).</pre>
<h3>File Inventory: Buku Telepon Ansible</h3>
<p>Buat file <code>inventory.ini</code> — format INI: <code>[grup]</code> diikuti daftar host, dan <code>[grup:vars]</code> untuk variabel grup:</p>
<pre># inventory.ini — 1. [mikrotik] = nama grup (bebas, tapi deskriptif!)
[mikrotik]
chr-core-01 ansible_host=192.168.99.11
chr-core-02 ansible_host=192.168.99.12
chr-core-03 ansible_host=192.168.99.13
# ansible_host = "nama panggilan boleh beda dengan IP aslinya".
# ALASAN: nama deskriptif (chr-core-01) jauh lebih mudah dibaca di laporan
# daripada deretan IP.

# 2. [mikrotik:vars] = variabel untuk SEMUA host di grup mikrotik
[mikrotik:vars]
ansible_user=automation
ansible_password=GantiDenganPasswordLab
ansible_connection=ansible.netcommon.network_cli
ansible_network_os=community.routeros.routeros
# ansible_connection: "cara bicara" ke network device (CLI via SSH).
#   ALASAN bukan ssh biasa: network device punya prompt & paging khusus
#   (mirip alasan netmiko ada di Part 35.1) — network_cli mengurusnya.
# ansible_network_os: "kamu bicara dengan OS apa" (mirip device_type netmiko).
#   ALASAN: tiap vendor beda prompt; salah isi = Ansible salah tebak prompt.</pre>
<div class="callout"><div class="t">Password Plaintext? Hanya untuk LAB!</div><p style="margin:4px 0 0"><code>ansible_password</code> ditulis polos di sini agar kamu fokus belajar alurnya. Di production ini DILARANG — password harus dienkripsi dengan <b>ansible-vault</b> (36.10). Anggap file ini "kunci rumah yang ditempel di pintu": boleh saat latihan, jangan di dunia nyata.</p></div>
<p><b>Verification:</b> <code>ansible-inventory -i inventory.ini --list</code> → tampil 3 host + vars grup. <b>Failure injection:</b> salah ketik IP satu host → nanti (36.4) host itu <code>UNREACHABLE</code> — dan dua lainnya tetap jalan (bukti Ansible tidak berhenti total). <b>Troubleshooting:</b> error "no hosts matched" = nama grup salah ketik di perintah vs file. <b>Fix & final verification:</b> perbaiki IP, ulangi <code>--list</code> — 3 host tampil benar.</p>`,
      terms: [
        ['inventory', 'File daftar managed nodes: siapa mereka (IP/hostname), grup apa, dan bagaimana cara menghubungi.'],
        ['ansible_host', 'Variabel inventory: alamat IP/hostname sebenarnya dari sebuah host.'],
        ['ansible_connection', 'Variabel inventory: plugin koneksi yang dipakai (network_cli untuk network device).'],
        ['ansible_network_os', 'Variabel inventory: sistem operasi/vendor target (community.routeros.routeros).'],
      ],
      diagram: `<pre>   inventory.ini = BUKU TELEPON + PETUNJUK

  [mikrotik]                 ← "grup: siapa saja anggotanya"
    chr-core-01 → 192.168.99.11
    chr-core-02 → 192.168.99.12
    chr-core-03 → 192.168.99.13

  [mikrotik:vars]            ← "aturan main grup ini"
    user, password           ← kredensial (LAB: plaintext, PROD: vault!)
    connection = network_cli ← cara bicara
    network_os = routeros    ← lawan bicara siapa</pre>`,
      scenario: 'Cabang baru dibuka: CHR ke-4 (192.168.99.14). Tanpa Ansible: copy-paste script, edit IP di 5 tempat. Dengan Ansible: tambah 1 baris di inventory.ini → semua playbook yang ada langsung mencakupnya. Itulah kekuatan "daftar terpusat".',
      bestPractices: 'Satu inventory per environment (lab.ini, production.ini) — jangan campur. Nama host deskriptif (peran-lokasi-nomor), bukan "router1". Inventory masuk Git (KECUALI secrets — itu di Vault).',
      security: 'File inventory sering dibaca banyak orang — jangan taruh password production di sini, walau "cuma sementara". Kebiasaan buruk dimulai dari "sementara". Vault (36.10) adalah jawabannya.',
      challenge: 'Buat inventory kedua bernama inventory-lab.ini yang hanya berisi 1 CHR (99.11) dalam grup bernama "lab-satu". Jalankan ansible-inventory --list untuk keduanya dan bandingkan outputnya.',
      interviewQ: 'Q: Apa isi file inventory dan mengapa dipisah dari playbook? — A: Inventory = daftar WHO (device apa, grup apa, cara konek bagaimana). Playbook = WHAT (mau diapakan). Dipisah agar playbook yang sama bisa dipakai ke environment berbeda (lab vs production) hanya dengan ganti inventory.',
      quiz: [
        { q: 'Apa fungsi file inventory?', options: ['Menyimpan playbook', 'Daftar managed nodes: siapa mereka, grup apa, dan bagaimana cara Ansible menghubungi mereka', 'Menginstall Ansible', 'Mengenkripsi password'], answer: 1, explain: 'Inventory = buku telepon Ansible. Tanpa ini, Ansible tidak tahu mau bicara dengan siapa.' },
        { q: 'Apa arti blok [mikrotik:vars]?', options: ['Daftar password', 'Variabel yang berlaku untuk semua host di grup mikrotik', 'Perintah untuk dijalankan', 'Nama playbook'], answer: 1, explain: ':vars = "untuk grup ini, pakai pengaturan berikut". Menghemat penulisan: tulis sekali, berlaku untuk semua anggota grup.' },
        { q: 'Mengapa password plaintext di inventory hanya boleh untuk LAB?', options: ['Karena di LAB password tidak penting', 'Karena file inventory mudah dibaca/dicopy — di production password harus dienkripsi dengan ansible-vault agar tidak bocor via Git/share', 'Karena Ansible melarang di production', 'Tidak ada alasan, boleh saja'], answer: 1, explain: 'Secret yang tertulis polos akan ikut tersebar saat file di-share atau di-commit. Vault (36.10) mengenkripsinya.' },
      ],
    },
    {
      id: '36.4',
      title: 'Ad-hoc Commands',
      body: `<p><b>Ad-hoc command</b> = perintah Ansible sekali jalan, tanpa menulis playbook. Cocok untuk <b>cek cepat</b>: "apakah semua CHR bisa dijangkau?", "berapa resource mereka sekarang?". Kalau tugasnya akan diulang, barulah naik kelas jadi playbook (36.5).</p>
<h3>Pola Perintah (Hafalkan!)</h3>
<pre>$ ansible mikrotik -i inventory.ini -m ansible.builtin.ping
#  │       │        │                │
#  │       │        │                └─ 4. -m = MODULE apa (ping = "test koneksi")
#  │       │        └─ 3. -i = INVENTORY mana
#  │       └─ 2. PATTERN = grup/host mana (sesuai nama di inventory!)
#  └─ 1. perintah ansible (ad-hoc)

# Expected (sukses):
# chr-core-01 | SUCCESS => {"changed": false, "ping": "pong"}
# ALASAN "ping" di sini BUKAN ping ICMP — ini module ping Ansible yang artinya
# "coba eksekusi sesuatu yang sepele di target"; SUCCESS = SSH + eksekusi OK.</pre>
<h3>Hands-on: Cek Cepat ke CHR</h3>
<p><b>Topology:</b> sama (control node → 3 CHR). <b>Objective:</b> verifikasi konektivitas + ambil info resource dari semua CHR dalam 1 perintah.</p>
<pre>$ ansible mikrotik -i inventory.ini -m community.routeros.command \\
    -a "commands='/system resource print'"
# -a = ARGUMEN untuk module (di sini: perintah RouterOS apa yang dijalankan).
# ALASAN memakai module community.routeros.command: ia tahu cara mengirim
# command ke RouterOS via network_cli (menangani prompt & paging).
# Perlu install dulu: ansible-galaxy collection install community.routeros
#   (ansible-galaxy = "toko" resmi berbagi collection/module Ansible)

# Expected: tiap host membalas tabel resource (cpu, memory, uptime).
# chr-core-01 | SUCCESS => { ... "stdout": ["uptime: 2h3m..."] }</pre>
<p><b>Verification:</b> 3 host SUCCESS = koneksi & module beres. <b>Failure injection:</b> matikan SSH di satu CHR (<code>/ip service disable ssh</code>) → host itu <code>UNREACHABLE</code> (bukan FAILED — bedakan!), 2 lainnya tetap SUCCESS. <b>Troubleshooting:</b> UNREACHABLE = masalah jaringan/kredensial (cek seperti Part 35.1); FAILED = koneksi OK tapi perintahnya error (mis. typo command RouterOS). <b>Fix & final verification:</b> nyalakan lagi SSH-nya, ulangi — 3 SUCCESS.</p>
<div class="callout blue"><div class="t">Kapan Ad-hoc, Kapan Playbook?</div><p style="margin:4px 0 0">Ad-hoc = "sekali pakai, tidak perlu didokumentasikan" (cek darurat, investigasi). Playbook = "akan diulang / perlu direview orang lain" (backup rutin, provisioning, audit). Aturan praktis: kalau kamu mengetik ad-hoc yang sama 3x, saatnya jadi playbook.</p></div>`,
      terms: [
        ['ad-hoc command', 'Perintah Ansible sekali jalan tanpa playbook; untuk cek cepat & tugas insidental.'],
        ['pattern', 'Argumen target pada perintah ansible: nama grup/host dari inventory (mis. "mikrotik", "chr-core-01").'],
        ['ansible-galaxy', 'Repositori resmi berbagi collection/role Ansible (seperti "app store" untuk Ansible).'],
        ['collection', 'Paket berisi modules/plugins untuk satu ekosistem (mis. community.routeros untuk MikroTik).'],
      ],
      scenario: 'Jam 2 pagi, NOC curiga satu cabang bermasalah. Daripada menulis playbook, engineer mengetik satu ad-hoc command untuk menarik /system resource print dari semua CHR sekaligus — dalam 30 detik ketahuan mana yang CPU-nya 100%. Itulah gunanya ad-hoc: kecepatan saat insiden.',
      bestPractices: 'Ad-hoc untuk baca (read-only) bebas dipakai. Ad-hoc untuk tulis (mengubah config) hindari — karena tidak terdokumentasi & tidak ter-review; yang mengubah config harus playbook + check mode (36.9).',
      security: 'Ad-hoc command tercatat di shell history (termasuk -a yang mungkin berisi data sensitif). Jangan sisipkan password di -a; dan bersihkan history di shared control node.',
      challenge: 'Tanpa melihat catatan, tulis perintah ad-hoc untuk menjalankan /system identity print ke grup mikrotik. Lalu variasikan: targetkan hanya chr-core-02.',
      interviewQ: 'Q: Apa beda hasil UNREACHABLE dan FAILED pada Ansible? — A: UNREACHABLE = Ansible tidak bisa menghubungi host (jaringan/SSH/kredensial bermasalah). FAILED = koneksi berhasil tapi task-nya error (mis. command salah, permission kurang). Diagnosisnya beda total.',
      quiz: [
        { q: 'Kapan sebaiknya memakai ad-hoc command?', options: ['Untuk semua pekerjaan otomasi', 'Untuk tugas sekali jalan / cek cepat yang tidak perlu disimpan sebagai playbook', 'Hanya saat install Ansible', 'Tidak pernah — selalu pakai playbook'], answer: 1, explain: 'Ad-hoc = cepat & insidental. Kalau perintahnya akan diulang atau perlu direview, naikkan jadi playbook.' },
        { q: 'Apa fungsi flag -m pada perintah ansible?', options: ['Memilih module yang akan dijalankan', 'Memilih mode enkripsi', 'Menentukan jumlah host', 'Menghapus inventory'], answer: 0, explain: '-m = module. Ansible tidak menebak-nebak: kamu yang menyatakan "pakai module apa" (-m) dengan "argumen apa" (-a).' },
        { q: 'Apa arti status "ok" vs "changed" pada output Ansible?', options: ['ok = gagal, changed = sukses', 'ok = task sukses tanpa mengubah apapun; changed = task sukses DAN mengubah keadaan target', 'Keduanya artinya gagal', 'ok hanya untuk ping'], answer: 1, explain: 'Pembedaan ini fondasi idempotency (36.7): run kedua yang tidak mengubah apa-apa akan melaporkan ok, bukan changed.' },
      ],
    },
    {
      id: '36.5',
      title: 'Playbook Pertama',
      body: `<p>Playbook = ad-hoc yang "naik kelas": <b>tersimpan, terdokumentasi, bisa direview, bisa di-rerun</b>. Ditulis dalam <b>YAML</b> — format teks berbasis indentasi. Tiga aturan YAML yang wajib hafal: (1) <b>indentasi pakai spasi</b> (JANGAN tab — YAML melarang tab!); (2) <code>key: value</code> dipisah titik dua + spasi; (3) list diawali <code>-</code> (strip + spasi).</p>
<h3>Playbook Line-by-Line</h3>
<p><b>Objective:</b> backup config semua CHR ke control node. Buat file <code>backup.yml</code>:</p>
<pre>---                                   # 1. pembuka dokumen YAML (konvensi; "mulai dari sini")
- name: Backup config semua CHR       # 2. PLAY dimulai ("-"): beri nama deskriptif!
  hosts: mikrotik                     # 3. target: grup "mikrotik" dari inventory.ini
  gather_facts: false                 # 4. JANGAN kumpulkan facts dulu (hemat waktu; facts di 36.6)
                                      #    ALASAN false: untuk network device, fact-gathering
                                      #    default (Linux) tidak relevan & memperlambat.

  tasks:                              # 5. daftar TASKS (unit kerja) dalam play ini
    - name: Buat file backup di CHR   # 6. TASK 1: beri nama — nama ini yang muncul di laporan!
      community.routeros.command:     # 7. MODULE: perintah RouterOS (dari collection)
        commands:                     # 8. argumen module: list perintah yang dijalankan
          - /system backup save name=auto-backup
      # ALASAN module ini (bukan shell mentah): ia menangani prompt/paging RouterOS.

    - name: Tampilkan hasil           # 9. TASK 2
      ansible.builtin.debug:          # 10. MODULE debug: "cetak sesuatu ke layar"
        msg: "Backup selesai di {{ inventory_hostname }}"
      # {{ inventory_hostname }} = variabel bawaan Ansible berisi nama host
      # yang sedang diproses. ALASAN pakai variabel: satu playbook untuk N host.</pre>
<h3>Menjalankan</h3>
<pre>$ ansible-playbook -i inventory.ini backup.yml
# Expected:
# PLAY [Backup config semua CHR] ****
# TASK [Buat file backup di CHR] ****
# changed: [chr-core-01]   ← "changed" = ada yang diubah (file backup dibuat)
# changed: [chr-core-02]
# changed: [chr-core-03]
# PLAY RECAP ****
# chr-core-01 : ok=2 changed=1 ...
# ALASAN baca RECAP: inilah "laporan eksekusi" — bukti apa yang terjadi di tiap host.</pre>
<p><b>Verification:</b> SSH ke satu CHR → <code>/file print</code> → file <code>auto-backup.backup</code> ada. <b>Failure injection:</b> rusak 1 spasi indentasi di backup.yml → error <code>YAML syntax error</code> (Ansible menolak jalan — bagus! lebih baik gagal di awal daripada setengah jalan). <b>Troubleshooting:</b> error YAML 99% soal spasi/tab/indentasi — buka file, periksa tiap baris. <b>Fix & final verification:</b> perbaiki, jalankan ulang → 3 host <code>changed</code>, file backup ada di ketiganya.</p>
<div class="callout"><div class="t">Nama Task = Dokumentasi Gratis</div><p style="margin:4px 0 0">Selalu beri <code>name</code> yang deskriptif di tiap task. Saat playbook dijalankan (atau gagal) di production jam 3 pagi, nama task inilah yang dibaca engineer — "Buat file backup di CHR" vs "task 1" bedanya seperti siang dan malam saat troubleshooting.</p></div>`,
      terms: [
        ['YAML', 'Format teks berbasis indentasi untuk menulis playbook/inventory; spasi (bukan tab!) menentukan struktur.'],
        ['gather_facts', 'Opsi play: apakah Ansible mengumpulkan informasi sistem target dulu (default true; untuk network device sering dimatikan).'],
        ['register', 'Menyimpan output sebuah task ke variabel agar bisa dipakai task berikutnya.'],
        ['PLAY RECAP', 'Ringkasan akhir ansible-playbook: status ok/changed/failed/unreachable per host.'],
      ],
      diagram: `<pre>   STRUKTUR PLAYBOOK (baca dari luar ke dalam)

  backup.yml
  └── PLAY ("- name: ...", hosts: mikrotik)
        ├── TASK 1 ("- name: ...")
        │     └── MODULE (community.routeros.command)
        │           └── argumen (commands: [...])
        └── TASK 2 ("- name: ...")
              └── MODULE (ansible.builtin.debug)
                    └── argumen (msg: ...)

  Aturan indentasi: anak lebih menjorok 2 spasi dari induk.
  SATU spasi salah = struktur berubah = error.</pre>`,
      scenario: 'Setiap Jumat malam tim NOC menjalankan backup config 40 router — dulu manual, sering lupa. Sekarang: satu playbook backup.yml + cron di control node. Jumat malam berjalan sendiri; Senin pagi engineer cukup baca PLAY RECAP di log. Itulah playbook: pengetahuan operasional yang bisa dieksekusi mesin.',
      bestPractices: 'Satu playbook = satu tujuan jelas (backup.yml, bukan campur backup+provisioning+monitoring). Nama file & task deskriptif. Semua playbook masuk Git — itu "runbook yang bisa jalan sendiri".',
      security: 'Playbook backup berisi kredensial? TIDAK — kredensial tetap di inventory/Vault (36.3, 36.10). Playbook hanya berisi "apa yang dilakukan", bukan "dengan akses siapa".',
      challenge: 'Modifikasi backup.yml: tambahkan task ketiga yang menjalankan /system identity print dan menampilkan hasilnya dengan debug. Jalankan dan pastikan 3 task tampil di output.',
      interviewQ: 'Q: Jelaskan struktur sebuah playbook Ansible. — A: Playbook berisi satu atau lebih play; tiap play menargetkan hosts tertentu dan berisi tasks; tiap task memanggil satu module dengan argumennya. Ditulis dalam YAML sehingga indentasi (spasi, bukan tab) menentukan struktur.',
      quiz: [
        { q: 'Mengapa indentasi YAML harus pakai spasi dan konsisten?', options: ['Agar terlihat rapi saja', 'YAML memakai indentasi untuk menentukan struktur; tab dilarang dan menyebabkan parse error', 'Karena Ansible lambat membaca tab', 'Tidak penting, bebas'], answer: 1, explain: 'Di YAML, spasi = struktur. Satu spasi salah bisa mengubah arti (atau menggagalkan parse). Inilah error #1 pemula Ansible.' },
        { q: 'Apa itu task dalam playbook?', options: ['File inventory', 'Satu unit kerja: satu module yang dipanggil dengan argumen tertentu', 'Nama grup host', 'Password terenkripsi'], answer: 1, explain: 'Task = "lakukan X dengan cara Y". Kumpulan tasks membentuk play; kumpulan plays membentuk playbook.' },
        { q: 'Apa fungsi PLAY RECAP di akhir output?', options: ['Hiasan saja', 'Ringkasan eksekusi per host: berapa ok/changed/failed/unreachable — bukti & bahan audit apa yang terjadi', 'Daftar password yang dipakai', 'Error log'], answer: 1, explain: 'RECAP adalah laporan pertanggungjawaban playbook. Di production, output ini yang disimpan sebagai bukti change.' },
      ],
    },
    {
      id: '36.6',
      title: 'Variables & Facts',
      body: `<p>Playbook 36.5 masih "kaku": nama file backup ditulis mati di dalam task. Bagaimana kalau tiap cabang butuh nama berbeda? Atau NTP server berubah? <b>Variables</b> (variabel) = cara menyimpan nilai di satu tempat lalu memakainya di banyak tempat. Prinsipnya sama seperti variabel di Python (Part 34): <b>satu sumber kebenaran</b>.</p>
<h3>Memakai Variabel: {{ }}</h3>
<pre># Di dalam playbook, variabel disisipkan dengan kurung kurawal ganda (Jinja2):
- name: Set NTP server
  community.routeros.command:
    commands:
      - /system ntp client set enabled=yes server={{ ntp_server }}
# {{ ntp_server }} = "tempelkan nilai variabel ntp_server di sini".
# ALASAN sintaks ini: Ansible memakai template engine Jinja2 — standar industri,
# sama yang dipakai banyak tool web. Hafalkan: {{ }} = "nilai variabel".</pre>
<h3>Di Mana Variabel Didefinisikan? (3 Tempat Umum)</h3>
<pre># 1. LANGSUNG di playbook (untuk nilai spesifik playbook itu):
  vars:
    ntp_server: 192.168.99.1

# 2. group_vars/mikrotik.yml (untuk SEMUA host grup mikrotik):
ntp_server: 192.168.99.1
dns_server: 192.168.99.1
#    ALASAN file terpisah: 10 playbook bisa memakai nilai yang sama tanpa
#    copy-paste. Ubah sekali di sini → berlaku di semua playbook.

# 3. host_vars/chr-core-01.yml (KHUSUS satu host — menimpa group_vars!):
ntp_server: 192.168.30.1
#    ALASAN: cabang 01 memakai NTP lokal server. Aturan menang (precedence):
#    host_vars > group_vars > vars playbook. Yang PALING SPESIFIK menang.</pre>
<h3>Facts: Variabel yang Dikumpulkan Otomatis</h3>
<p><b>Facts</b> = informasi yang Ansible kumpulkan sendiri dari target (nama OS, arsitektur, dsb). Untuk network device, pakai module facts khusus:</p>
<pre>- name: Kumpulkan facts RouterOS
  community.routeros.facts:
# Setelah task ini, tersedia variabel seperti ansible_net_hostname,
# ansible_net_version — bisa dipakai di task berikutnya via {{ }}.
# ALASAN: playbook jadi adaptif — "kalau versi RouterOS < 7, lakukan X".</pre>
<p><b>Verification:</b> buat <code>group_vars/mikrotik.yml</code> berisi <code>ntp_server</code>, pakai di playbook, jalankan dengan <code>-v</code> (verbose) dan pastikan nilai tersisip benar. <b>Failure injection:</b> tulis <code>{{ ntp_servr }}</code> (typo) → error <code>undefined variable</code> — Ansible gagal di awal dengan pesan jelas (bagus!). <b>Troubleshooting:</b> "undefined variable" = cek ejaan & pastikan file vars terbaca (nama grup/file harus persis). <b>Fix & final verification:</b> perbaiki typo; buat <code>host_vars/chr-core-01.yml</code> dengan nilai beda → verifikasi host 01 memakai nilai khususnya (bukti precedence bekerja).</p>
<div class="callout blue"><div class="t">DRY: Don't Repeat Yourself</div><p style="margin:4px 0 0">Setiap nilai yang muncul di 2+ tempat (IP NTP, DNS, nama user) WAJIB jadi variabel. Hardcode IP di 10 task = saat IP berubah, kamu harus edit 10 tempat dan pasti ada yang terlewat. Variabel = ubah sekali, benar di semua tempat.</p></div>`,
      terms: [
        ['variable', 'Nama yang menyimpan nilai agar bisa dipakai ulang di banyak tempat (satu sumber kebenaran).'],
        ['Jinja2', 'Template engine yang dipakai Ansible; sintaks {{ }} untuk menyisipkan nilai variabel.'],
        ['host_vars / group_vars', 'Folder berisi file variabel per host / per grup; yang lebih spesifik (host) menimpa yang umum (grup).'],
        ['facts', 'Informasi tentang target yang dikumpulkan otomatis oleh Ansible (atau module facts khusus).'],
      ],
      scenario: 'Perusahaan mengganti NTP server pusat. Dulu (hardcode): edit 40 script satu per satu, 3 terlewat → monitoring kacau seminggu. Sekarang (variables): edit 1 baris di group_vars/all.yml, jalankan playbook → 40 router konsisten dalam 5 menit. Itulah nilai "satu sumber kebenaran".',
      bestPractices: 'Default di group_vars, kekecualian di host_vars. Jangan definisikan variabel yang sama di 3 tempat berbeda — pusing sendiri nanti. Dokumentasikan di README variabel apa saja yang wajib diisi.',
      security: 'Variabel berisi secrets (password, API key) JANGAN ditulis polos di group_vars — gunakan Vault (36.10). Aturan: group_vars untuk nilai biasa, vault untuk rahasia.',
      challenge: 'Buat variabel backup_name di group_vars, pakai di playbook backup 36.5 (ganti nama file statis), lalu timpa untuk chr-core-02 via host_vars. Jalankan dan verifikasi nama file berbeda.',
      interviewQ: 'Q: Bagaimana Ansible menentukan nilai variabel bila didefinisikan di banyak tempat? — A: Ada urutan precedence (prioritas): yang paling spesifik menang — host_vars mengalahkan group_vars, group_vars mengalahkan vars di playbook. Prinsipnya: kekecualian spesifik menimpa aturan umum.',
      quiz: [
        { q: 'Apa fungsi {{ }} dalam playbook?', options: ['Komentar YAML', 'Templating Jinja2: menyisipkan nilai variabel ke dalam task', 'Mengenkripsi teks', 'Menandai error'], answer: 1, explain: '{{ }} = "tempel nilai variabel di sini". Ini yang membuat satu playbook bisa dipakai untuk banyak host dengan nilai berbeda.' },
        { q: 'Apa perbedaan host_vars dan group_vars?', options: ['Tidak ada bedanya', 'host_vars berlaku untuk satu host spesifik; group_vars untuk semua host dalam satu grup', 'host_vars untuk password saja', 'group_vars hanya untuk Linux'], answer: 1, explain: 'Hierarki spesifisitas: host_vars (paling spesifik, menang) > group_vars > vars playbook. Default umum di group, kekecualian di host.' },
        { q: 'Mengapa nilai seperti IP NTP lebih baik jadi variabel daripada hardcode di tiap task?', options: ['Agar playbook lebih panjang', 'Satu sumber kebenaran: ubah sekali di variabel, berlaku di semua task — menghindari ada yang terlewat', 'Variabel lebih cepat dieksekusi', 'Hardcode dilarang Ansible'], answer: 1, explain: 'Prinsip DRY (Do not Repeat Yourself). Nilai yang diulang di banyak tempat = bom waktu saat berubah; variabel mengatasinya.' },
      ],
    },
    {
      id: '36.7',
      title: 'Handlers & Idempotency',
      body: `<p>Dua konsep yang membuat Ansible <b>aman untuk production</b> — dan menjadi pertanyaan favorit interviewer.</p>
<h3>Idempotency: Aman Dijalankan Berulang</h3>
<p><b>Idempotent</b> = operasi yang hasilnya <b>tetap sama</b> mau dijalankan 1x atau 100x. Contoh dari dunia nyata: tombol "simpan" yang ditekan 2x tidak membuat 2 file. Ansible dirancang idempotent: sebelum mengubah, ia <b>mengecek keadaan sekarang dulu</b> — kalau sudah sesuai keinginan, ia tidak melakukan apa-apa (laporan <code>ok</code>, bukan <code>changed</code>).</p>
<pre>$ ansible-playbook -i inventory.ini ntp.yml   # run ke-1
# chr-core-01 : changed=1  ← NTP diubah (belum sesuai)
$ ansible-playbook -i inventory.ini ntp.yml   # run ke-2, tanpa ubah apapun
# chr-core-01 : ok=1 changed=0  ← TIDAK ADA yang diubah (sudah sesuai!)
# ALASAN ini penting: di production, playbook dijalankan BERULANG (jadwal,
# setelah insiden, oleh orang berbeda). Idempotent = tidak ada efek samping
# ganda, tidak ada duplikasi config.</pre>
<h3>Handlers: "Lakukan Ini HANYA Jika Ada Perubahan"</h3>
<p><b>Handler</b> = task khusus yang <b>tidak berjalan otomatis</b> — ia hanya berjalan bila ada task lain yang me-<b>notify</b>-nya (memberi tahu "ada perubahan nih!"). Pola klasik: ubah config → restart service-nya <i>hanya jika config benar-benar berubah</i>.</p>
<pre>  tasks:
    - name: Pastikan NTP server benar
      community.routeros.command:
        commands:
          - /system ntp client set enabled=yes server={{ ntp_server }}
      notify: Restart NTP client
      # notify = "kalau task ini CHANGED (benar-benar mengubah), panggil handler itu"

  handlers:
    - name: Restart NTP client
      community.routeros.command:
        commands:
          - /system ntp client set enabled=no
          - /system ntp client set enabled=yes
      # ALASAN handler terpisah: restart service itu "mahal" (gangguan sesaat).
      # Jangan restart kalau tidak ada yang berubah! Handler menjamin itu.
      # Handler juga hanya berjalan SEKALI di akhir play, walau di-notify banyak task.</pre>
<p><b>Verification:</b> jalankan playbook 2x berturut-turut → run ke-1 <code>changed</code>, run ke-2 <code>ok</code> semua (bukti idempotent). <b>Failure injection:</b> ubah NTP manual di CHR lewat Winbox → jalankan playbook → kembali <code>changed</code> (Ansible mendeteksi & memperbaiki drift!). <b>Troubleshooting:</b> handler tidak jalan padahal config berubah? → cek ejaan <code>notify:</code> harus persis sama dengan <code>name:</code> handler. <b>Fix & final verification:</b> samakan nama, ulangi — handler berjalan hanya saat ada perubahan.</p>
<div class="callout"><div class="t">Idempotency = Kepercayaan</div><p style="margin:4px 0 0">Inilah alasan Ansible dipercaya di production: kamu bisa menjadwalkan playbook tiap malam sebagai "penjaga konsistensi". Kalau ada yang mengubah config manual (drift), playbook berikutnya otomatis melaporkannya (<code>changed</code>) dan memperbaikinya — tanpa kamu begadang.</p></div>`,
      terms: [
        ['idempotent', 'Sifat operasi yang aman dijalankan berulang kali: hasil akhirnya tetap sama.'],
        ['handler', 'Task khusus yang hanya dieksekusi bila di-notify oleh task lain yang mengalami perubahan.'],
        ['notify', 'Perintah di task untuk memicu handler bila task tersebut berstatus changed.'],
        ['drift', 'Penyimpangan konfigurasi aktual dari keadaan yang diinginkan (mis. diubah manual).'],
      ],
      diagram: `<pre>   HANDLER = "STANDBY, JALAN HANYA BILA DIPANGGIL"

  task: Set NTP server
       │
       ├── keadaan SUDAH sesuai → ok → handler TIDAK jalan
       │
       └── keadaan BERUBAH → changed ──notify──▶ handler: Restart NTP
                                                     (jalan SEKALI di akhir,
                                                      walau di-notify 5 task)</pre>`,
      scenario: 'Playbook compliance dijadwalkan tiap malam ke 40 router. Suatu hari teknisi lapangan mengubah DNS manual di 2 router (drift). Malamnya playbook berjalan: 38 router ok, 2 router changed + diperbaiki otomatis + tercatat di log. Pagi harinya kamu baca laporan — tanpa begadang, tanpa drama.',
      bestPractices: 'Setiap task write (mengubah config) idealnya idempotent — uji dengan run 2x. Operasi "mahal" (restart service, reboot) SELALU lewat handler, jangan langsung di tasks.',
      security: 'Idempotency mencegah "perubahan ganda tak sengaja": mis. task tambah user dijalankan 2x tidak membuat user duplikat yang bisa jadi backdoor. Di audit, buktikan dengan PLAY RECAP run kedua = 0 changed.',
      challenge: 'Buat playbook yang memastikan user "monitoring" ada di semua CHR (pakai /user print + logika notify). Jalankan 2x dan tunjukkan run kedua = 0 changed.',
      interviewQ: 'Q: Apa itu idempotency dan mengapa Ansible menekankannya? — A: Idempotency = dijalankan berulang hasilnya tetap sama. Ansible mengecek keadaan aktual sebelum mengubah, sehingga playbook aman di-rerun/di-schedule tanpa efek samping ganda — syarat mutlak otomasi production yang dipercaya.',
      quiz: [
        { q: 'Apa itu idempotent?', options: ['Berjalan sangat cepat', 'Operasi yang aman dijalankan berulang kali karena hasil akhirnya tetap sama', 'Hanya bisa dijalankan sekali', 'Operasi yang selalu mengubah target'], answer: 1, explain: 'Fondasi kepercayaan otomasi: run ke-2, ke-3, ... tidak menimbulkan efek samping baru bila keadaan sudah sesuai.' },
        { q: 'Kapan handler dijalankan?', options: ['Selalu di setiap run', 'Hanya bila ada task yang me-notify-nya (task tersebut berstatus changed)', 'Hanya saat playbook gagal', 'Acak'], answer: 1, explain: 'Handler = standby. Ia dipicu oleh notify dari task yang benar-benar mengubah sesuatu, dan berjalan sekali di akhir play.' },
        { q: 'Mengapa idempotency penting di production?', options: ['Agar playbook berjalan lebih cepat', 'Playbook yang di-schedule/di-rerun tidak menimbulkan perubahan ganda tak sengaja dan otomatis memperbaiki drift', 'Agar hemat memori', 'Tidak penting, hanya teori'], answer: 1, explain: 'Production = playbook berjalan berulang oleh banyak orang/jadwal. Tanpa idempotency, tiap run berisiko menumpuk perubahan.' },
      ],
    },
    {
      id: '36.8',
      title: 'Ansible untuk Network Devices',
      body: `<p>Sampai sini contoh kita generik. Sekarang fokus: <b>kekhasan network device</b> — mengapa Ansible butuh perlakuan khusus untuk MikroTik, dan bagaimana melakukannya dengan benar.</p>
<h3>Mengapa Butuh network_cli?</h3>
<p>Server Linux "ramah": Ansible bisa mengirim modul Python dan mengeksekusinya langsung. Network device (RouterOS, IOS) <b>tidak bisa menjalankan Python</b> — ia hanya punya CLI dengan prompt & paging khusus (ingat 36.3: alasan yang sama membuat netmiko ada di Part 35.1). Solusinya: <b>connection plugin <code>network_cli</code></b> — "penerjemah" yang menangani prompt (<code>[admin@CHR] ></code>), paging (<code>-- more --</code>), dan mode command RouterOS.</p>
<h3>Collection community.routeros</h3>
<pre>$ ansible-galaxy collection install community.routeros
# ALASAN: module bawaan Ansible (ansible.builtin) dirancang untuk server.
# Untuk RouterOS butuh module khusus (command, facts) — itulah isi collection.
# Cek terinstall: ansible-galaxy collection list | grep routeros</pre>
<h3>Hands-on: Backup + Audit Network</h3>
<p><b>Topology:</b> control node → 3 CHR. <b>Objective:</b> satu playbook melakukan backup config DAN menarik info dasar (audit read-only).</p>
<pre>---                                     # netaudit.yml
- name: Backup dan audit CHR
  hosts: mikrotik
  gather_facts: false

  tasks:
    - name: Backup config ke file di CHR
      community.routeros.command:        # 1. MODULE khusus RouterOS
        commands:
          - /system backup save name=ansible-backup
      # ALASAN command (bukan module "backup" generik): RouterOS hanya
      # mengerti perintahnya sendiri; module ini mengirimkannya dengan benar.

    - name: Ambil identitas & resource (audit)
      community.routeros.command:
        commands:
          - /system identity print
          - /system resource print
      register: audit                    # 2. simpan output untuk dipakai di bawah

    - name: Tampilkan hasil audit
      ansible.builtin.debug:
        var: audit.stdout_lines          # 3. stdout_lines = output per baris (mudah dibaca)
      # ALASAN debug di sini: di lab, lihat dulu hasilnya di layar sebelum
      # memutuskan format laporan permanen (nanti di project).</pre>
<pre>$ ansible-playbook -i inventory.ini netaudit.yml
# Expected: 3 host changed (backup dibuat) + output audit tampil per host.</pre>
<p><b>Verification:</b> <code>/file print</code> di CHR → <code>ansible-backup.backup</code> ada; output audit tampil. <b>Failure injection:</b> uninstall collection (<code>ansible-galaxy collection remove community.routeros</code>) → error <code>couldn't resolve module</code> (bukti module datang dari collection, bukan bawaan). <b>Troubleshooting:</b> error module tidak ditemukan = collection belum terinstall / nama FQCN salah ketik (<code>community.routeros.command</code> harus lengkap). <b>Fix & final verification:</b> install ulang collection, jalankan — sukses.</p>
<div class="callout"><div class="t">FQCN: Nama Lengkap Module</div><p style="margin:4px 0 0"><code>community.routeros.command</code> adalah <b>FQCN</b> (Fully Qualified Collection Name): <code>namespace.collection.module</code>. Selalu tulis lengkap di playbook production — nama pendek (<code>command</code>) bisa ambigu bila dua collection punya module bernama sama.</p></div>`,
      terms: [
        ['network_cli', 'Connection plugin Ansible untuk network device: menangani prompt, paging, dan CLI khusus via SSH.'],
        ['FQCN', 'Fully Qualified Collection Name (namespace.collection.module) — cara menulis nama module secara lengkap & tidak ambigu.'],
        ['ansible-galaxy', 'Perintah & repositori untuk install/mengelola collection dan role Ansible.'],
      ],
      diagram: `<pre>   KENAPA NETWORK DEVICE BUTUH PERLAKUAN KHUSUS

  Server Linux:                    Network device (RouterOS):
  ┌──────────────┐                  ┌──────────────┐
  │ Ansible kirim│                  │ Ansible kirim│
  │ modul Python │──bisa langsung──▶│ modul Python │
  │ dieksekusi   │   dieksekusi     │ DITOLAK!     │
  └──────────────┘                  │ (tak ada     │
                                   │  Python)     │
                                   └──────┬───────┘
                                          │ solusinya:
                                          ▼
                                   ┌──────────────┐
                                   │ network_cli: │
                                   │ kirim TEKS   │
                                   │ perintah CLI │
                                   │ via SSH,     │
                                   │ parse output │
                                   └──────────────┘</pre>`,
      scenario: 'Tim punya 3 vendor: MikroTik, Cisco, Juniper. Tanpa pola ini: 3 cara otomasi berbeda. Dengan Ansible: pola SAMA (inventory + playbook + network_cli), hanya ansible_network_os & module yang beda per vendor. Satu skill, banyak vendor — itulah nilai jual engineer automation.',
      bestPractices: 'Selalu tulis FQCN lengkap. Satu collection per vendor, di-pin versinya (requirements.yml) agar update collection tidak merusak playbook tiba-tiba.',
      security: 'Module command bisa menjalankan perintah APAPUN — termasuk yang destruktif. Batasi dengan prinsip least privilege (user automation, 35.1) + review playbook sebelum run + check mode (36.9).',
      challenge: 'Tambahkan task ke netaudit.yml yang menarik /interface print dan hanya menampilkan baris yang mengandung "R" (running) — petunjuk: pakai filter Jinja2 select atau olah di debug msg.',
      interviewQ: 'Q: Mengapa Ansible memakai network_cli untuk network device, bukan koneksi SSH biasa? — A: Karena network device tidak bisa mengeksekusi modul Python seperti server Linux — ia hanya punya CLI dengan prompt dan paging khusus. network_cli adalah plugin koneksi yang menangani kekhasan itu (prompt, "-- more --", mode command) sehingga module bisa bekerja.',
      quiz: [
        { q: 'Apa fungsi ansible_network_os?', options: ['Mempercepat koneksi', 'Memberitahu Ansible OS/vendor device target agar perilaku (prompt, paging) ditangani benar — mirip device_type di netmiko', 'Menginstall OS baru', 'Mengubah hostname'], answer: 1, explain: 'Tiap vendor punya kebiasaan CLI berbeda. Salah isi ansible_network_os = Ansible salah menebak prompt = gagal total.' },
        { q: 'Mengapa perlu menginstall collection community.routeros?', options: ['Agar Ansible lebih cepat', 'Module bawaan Ansible dirancang untuk server; collection berisi module khusus RouterOS (command, facts)', 'Untuk mengganti password', 'Tidak perlu sebenarnya'], answer: 1, explain: 'Collection = paket module per ekosistem. Tanpa community.routeros, tidak ada module yang "paham" cara bicara ke RouterOS.' },
        { q: 'Apa fungsi connection plugin network_cli?', options: ['Menghubungkan ke internet', 'Cara Ansible berkomunikasi dengan network device via CLI/SSH: menangani prompt, paging, dan mode command', 'Menginstall agent', 'Mengenkripsi playbook'], answer: 1, explain: 'network_cli adalah "penerjemah" antara Ansible dan CLI network device — alasan yang sama membuat netmiko ada di dunia Python (Part 35.1).' },
      ],
    },
    {
      id: '36.9',
      title: 'Check Mode & Dry-run',
      body: `<p>Pertanyaan yang membedakan engineer junior dan senior: <b>"bagaimana kamu memastikan playbook tidak merusak production?"</b> Jawabannya: <b>check mode</b> — simulasi yang memprediksi perubahan <i>tanpa benar-benar mengeksekusinya</i>. Istilah lainnya: <b>dry-run</b> ("latihan kering": gerakannya sama, tapi tidak ada yang basah").</p>
<h3>Dua Flag Penyelamat</h3>
<pre>$ ansible-playbook -i inventory.ini ntp.yml --check --diff
# --check = "JANGAN ubah apapun; laporkan saja apa yang AKAN berubah"
# --diff  = "tampilkan PERBEDAAN sebelum vs sesudah per task"
# Expected: task-task berstatus "changed" (artinya: "kalau dijalankan beneran,
#   ini akan berubah") — tapi TIDAK ADA yang benar-benar berubah di CHR.
#   Verifikasi: cek di CHR, config tetap sama. Itulah buktinya simulasi.</pre>
<h3>Alur Kerja Wajib Production</h3>
<pre>1. Tulis / ubah playbook
2. ansible-playbook ... --check --diff     ← SIMULASI DULU, baca dengan teliti
3. Tanya: "apakah perubahan yang diprediksi SESUAI niatku?"
     ├── YA → jalankan tanpa --check (di change window!)
     └── TIDAK → perbaiki playbook, ulangi dari langkah 2
4. Simpan output --check sebagai BUKTI review (change management)</pre>
<h3>Batasan Jujur (Penting!)</h3>
<p>Check mode <b>bukan sihir</b>: ia memprediksi berdasarkan module — untuk module <code>command</code> mentah (yang kita pakai ke RouterOS), Ansible <b>tidak selalu bisa tahu</b> apakah command itu akan mengubah sesuatu. Artinya: untuk network device, <code>--check</code> kadang melaporkan <code>changed</code> padahal tidak ada perubahan (atau sebaliknya). Karena itu: <b>check mode = lapisan pengaman, bukan pengganti testing di LAB</b>. Urutan yang benar: test di LAB dulu (boleh gagal) → --check ke production → eksekusi di change window.</p>
<p><b>Verification:</b> jalankan playbook dengan <code>--check --diff</code> → catat prediksi; jalankan tanpa flag → bandingkan hasil aktual vs prediksi (harus cocok). <b>Failure injection:</b> sengaja salah targetkan hosts ke grup yang salah, jalankan <code>--check</code> → kamu melihat "yang akan berubah" SEBELUM bencana terjadi (inilah nilainya!). <b>Troubleshooting:</b> --check melaporkan changed tapi run asli ok tanpa perubahan? → itu keterbatasan module command mentah (baca "Batasan Jujur" di atas), bukan bug playbook-mu. <b>Fix & final verification:</b> untuk kepastian penuh, uji dulu di 1 CHR lab sebelum ke semua.</p>
<div class="callout"><div class="t">Aturan Emas Production</div><p style="margin:4px 0 0">TIDAK ADA playbook write yang dijalankan ke production tanpa <code>--check --diff</code> terlebih dahulu, dan hasilnya dibaca manusia. Ini bukan birokrasi — ini yang membedakan "otomasi" dari "senjata makan tuan". Tulis aturan ini di README project-mu.</p></div>`,
      terms: [
        ['check mode', 'Mode simulasi Ansible (--check): memprediksi perubahan tanpa mengeksekusinya.'],
        ['dry-run', 'Istilah umum untuk simulasi/latihan tanpa dampak nyata; check mode adalah dry-run-nya Ansible.'],
        ['diff', 'Flag --diff: menampilkan perbedaan sebelum vs sesudah untuk tiap task yang berubah.'],
        ['change window', 'Jadwal yang disepakati untuk melakukan perubahan di production (biasanya di luar jam sibuk).'],
      ],
      scenario: 'Engineer menjalankan playbook firewall ke 40 router tanpa --check. Satu typo di variabel → 40 router kehilangan akses management sekaligus. Dengan --check --diff, typo itu akan terlihat sebagai prediksi aneh di 5 detik pertama — sebelum satu pun router tersentuh. Simulasi 5 detik vs insiden 5 jam.',
      bestPractices: 'Jadikan "--check --diff dulu" sebagai checklist tetap tim (tulis di runbook). Simpan output check sebagai artefak review change. Untuk network device, lengkapi dengan uji di 1 device lab dulu.',
      security: 'Check mode juga alat keamanan: ia memperlihatkan APA yang akan diubah SEBELUM terjadi — reviewer bisa menangkap task mencurigakan (mis. task yang akan menghapus user admin) sebelum dieksekusi.',
      challenge: 'Ambil playbook netaudit.yml (36.8), jalankan dengan --check --diff, dan jelaskan dalam 3 kalimat: task mana yang diprediksi changed dan mengapa.',
      interviewQ: 'Q: Bagaimana kamu memastikan playbook Ansible aman dijalankan ke production? — A: Tiga lapis: (1) uji di lab dulu; (2) selalu --check --diff untuk simulasi & review prediksi perubahan; (3) eksekusi di change window dengan output tersimpan sebagai bukti. Untuk network device, sadari keterbatasan check mode pada module command mentah.',
      quiz: [
        { q: 'Apa fungsi flag --check?', options: ['Mempercepat eksekusi', 'Simulasi: memprediksi perubahan yang akan terjadi TANPA benar-benar mengeksekusinya', 'Mengecek versi Ansible', 'Menghapus inventory'], answer: 1, explain: '--check = "bagaimana kalau". Tidak ada yang berubah di target — tapi kamu tahu apa yang AKAN berubah.' },
        { q: 'Apa fungsi flag --diff?', options: ['Menampilkan perbedaan sebelum vs sesudah untuk tiap task yang berubah', 'Membandingkan dua playbook', 'Menghapus file duplikat', 'Menghitung selisih IP'], answer: 0, explain: '--diff membuat prediksi --check bisa dibaca manusia: "baris ini akan berubah dari X menjadi Y".' },
        { q: 'Kapan check mode WAJIB dipakai?', options: ['Tidak pernah wajib', 'Sebelum menjalankan playbook yang mengubah config (write) ke production — sebagai lapisan review wajib', 'Hanya saat install Ansible', 'Hanya untuk ad-hoc command'], answer: 1, explain: 'Aturan emas: tidak ada write ke production tanpa simulasi & review prediksi terlebih dahulu. Ditambah uji lab dan change window.' },
      ],
    },
    {
      id: '36.10',
      title: 'Vault & Struktur Project',
      body: `<p>Sub-bab terakhir merapikan dua hal yang memisahkan "main-main" dari "profesional": <b>mengamankan secrets</b> dan <b>menata project</b> agar bisa dikerjakan tim.</p>
<h3>ansible-vault: Brankas untuk Secrets</h3>
<p><b>ansible-vault</b> = fitur Ansible untuk <b>mengenkripsi</b> file/variabel berisi rahasia (password, API key). File terenkripsi tetap bisa di-commit ke Git dengan aman — isinya hanya bisa dibuka dengan vault password.</p>
<pre>$ ansible-vault create group_vars/mikrotik/vault.yml
# Perintah ini meminta "New Vault password" LALU membuka editor.
# Isi file (plaintext saat mengetik, tersimpan terenkripsi):
vault_ansible_password: GantiDenganPasswordAsli
# Di inventory/group_vars, pakai: ansible_password: "{{ vault_ansible_password }}"
# ALASAN nama diawali vault_: konvensi — langsung ketahuan "ini rahasia".

$ ansible-playbook -i inventory.ini site.yml --ask-vault-pass
# --ask-vault-pass = "minta vault password saat jalan" (tidak tersimpan di mana-mana)
# ALASAN: password vault hanya ada di kepala engineer + password manager tim.</pre>
<h3>Struktur Project Rapi</h3>
<pre>ansible-network-audit/          # 1 repo = 1 tujuan jelas
├── ansible.cfg                 # config: inventory default, dll.
├── inventory.ini               # daftar device (TANPA secrets!)
├── group_vars/
│   ├── mikrotik.yml            # variabel biasa (boleh di-Git)
│   └── mikrotik/
│       └── vault.yml           # TERENKRIPSI via vault (aman di-Git)
├── playbooks/
│   ├── backup.yml
│   └── audit.yml
├── roles/                      # (konsep di bawah) untuk pola yang dipakai ulang
└── README.md                   # cara pakai, arsitektur, aturan main tim</pre>
<h3>Roles: Playbook yang Dikemas Ulang (Konsep)</h3>
<p><b>Role</b> = playbook yang dipecah menjadi struktur standar (tasks, handlers, vars, templates) agar <b>bisa dipakai ulang</b> antar project. Contoh: role <code>mikrotik-backup</code> dipakai di project audit, dipakai juga di project compliance — tulis sekali, pakai berkali-kali. Untuk part ini cukup paham konsepnya; kamu akan membuatnya sendiri saat pola yang sama muncul 3x (aturan praktis: jangan abstraksi terlalu dini!).</p>
<p><b>Verification:</b> buat vault.yml terenkripsi → <code>cat</code> file-nya → isi terbaca sebagai <code>$ANSIBLE_VAULT;1.1;AES256...</code> (bukan plaintext!) = sukses. <b>Failure injection:</b> jalankan playbook tanpa <code>--ask-vault-pass</code> → error dekripsi (bukti proteksinya bekerja). <b>Troubleshooting:</b> "wrong vault password" = cek caps lock / tanya ke pemegang password (jangan reset sembarangan di production!). <b>Fix & final verification:</b> jalankan dengan password benar → playbook sukses membaca secret tanpa menampilkannya di output.</p>
<div class="callout"><div class="t">LAB vs Production: Secrets</div><p style="margin:4px 0 0">LAB: password di inventory plaintext masih "dimaklumi" saat belajar (36.3) — TAPI biasakan sejak sekarang memakai Vault. Production: WAJIB Vault (atau secret manager), vault password di password manager tim (bukan di chat!), rotasi berkala, dan tidak ada secret di shell history.</p></div>`,
      terms: [
        ['ansible-vault', 'Fitur Ansible untuk mengenkripsi file/variabel berisi secrets agar aman disimpan di Git.'],
        ['role', 'Struktur standar Ansible untuk mengemas tasks/handlers/vars agar reusable antar project.'],
        ['ansible.cfg', 'File konfigurasi Ansible: inventory default, lokasi roles, dan pengaturan lainnya.'],
      ],
      diagram: `<pre>   MANA BOLEH DI-GIT, MANA TIDAK?

  BOLEH (aman):                    JANGAN (bahaya):
  ┌─────────────────────┐          ┌─────────────────────┐
  │ playbooks/*.yml     │          │ password plaintext  │
  │ inventory.ini       │          │ file .backup hasil  │
  │ group_vars/*.yml   │          │   (berisi config!)  │
  │ vault.yml TERENKRIPSI│         │ private key         │
  │ README.md           │          │                     │
  └─────────────────────┘          └─────────────────────┘
  Prinsip: Git = tempat LOGIKA. Secrets = tempat KHUSUS (Vault).</pre>`,
      scenario: 'Seorang engineer resign dan laptopnya dikembalikan. Karena semua secrets di Vault (password vault dirotasi saat ia keluar) dan tidak ada password plaintext di repo, tim hanya perlu rotasi 1 password — bukan berburu password yang tersebar di 20 file. Itulah bedanya disiplin secrets.',
      bestPractices: 'Pisahkan sejak hari pertama: logika di Git, secrets di Vault. Satu vault password per environment (lab vs production beda!). Dokumentasikan di README cara anggota tim baru mendapatkan akses vault.',
      security: 'File hasil backup (*.backup) BERISI seluruh config termasuk hash password — masukkan ke .gitignore, JANGAN pernah commit. Vault password sendiri: simpan di password manager, jangan di sticky note / chat.',
      challenge: 'Enkripsi inventory password-mu yang sekarang masih plaintext: pindahkan ke vault.yml, ubah inventory memakai {{ vault_ansible_password }}, dan buktikan playbook tetap jalan dengan --ask-vault-pass.',
      interviewQ: 'Q: Bagaimana Ansible menangani secrets dengan aman? — A: Dengan ansible-vault: file/variabel rahasia dienkripsi (AES256) sehingga aman disimpan di Git; dibuka saat runtime dengan vault password (--ask-vault-pass). Prinsipnya: logika di Git, secrets di Vault, tidak pernah plaintext.',
      quiz: [
        { q: 'Apa fungsi ansible-vault?', options: ['Mempercepat playbook', 'Mengenkripsi file/variabel berisi secrets (password, API key) agar aman disimpan di Git', 'Menghapus secrets', 'Membuat user baru'], answer: 1, explain: 'Vault mengenkripsi dengan AES256. File terenkripsi aman di-commit; hanya pemilik vault password yang bisa membukanya.' },
        { q: 'Mengapa secrets tidak boleh plaintext di Git?', options: ['Karena Git lambat', 'Karena repo bisa di-clone/dibaca siapa saja — secret yang tertulis polos akan bocor dan sulit ditarik kembali dari history', 'Karena Ansible melarang', 'Tidak masalah sebenarnya'], answer: 1, explain: 'Git history hampir tidak bisa dihapus bersih. Satu commit berisi password = password itu bocor selamanya. Vault mencegahnya sejak awal.' },
        { q: 'Apa itu role dalam Ansible?', options: ['Jabatan di perusahaan', 'Struktur standar untuk mengemas tasks/handlers/vars agar bisa dipakai ulang antar project', 'Jenis lisensi', 'Nama user'], answer: 1, explain: 'Role = "playbook yang dikemas ulang". Aturan praktis: buat role saat pola yang sama muncul 3x — jangan abstraksi terlalu dini.' },
      ],
    },
  ],
  project: {
    title: 'Project: Ansible Network Audit',
    html: `<p><b>Misi:</b> bangun <b>Ansible Network Audit</b> — project Ansible production-grade yang melakukan <b>backup config + audit dasar</b> (identity, resource, interface) ke semua CHR lab-mu secara terjadwal, lalu publikasikan ke GitHub sebagai portfolio.</p>
<h3>Struktur Project</h3>
<pre>ansible-network-audit/
├── README.md                     # arsitektur, cara pakai, contoh output
├── ansible.cfg                   # inventory default = inventory.ini
├── inventory.ini                 # 3 CHR lab (TANPA password plaintext!)
├── group_vars/
│   ├── mikrotik.yml              # ntp_server, dns_server, backup_name
│   └── mikrotik/vault.yml        # TERENKRIPSI: vault_ansible_password
├── playbooks/
│   ├── backup.yml                # backup config (36.5)
│   └── audit.yml                 # identity + resource + interface (36.8)
└── .gitignore                    # *.backup, *.log, vault password JANGAN masuk!</pre>
<h3>Langkah Pengerjaan</h3>
<ol>
<li><b>Setup:</b> 3 CHR (192.168.99.11–13), user automation, SSH aktif, collection community.routeros terinstall.</li>
<li><b>inventory.ini + group_vars:</b> tanpa secrets plaintext — secrets HANYA di vault.yml (36.10).</li>
<li><b>backup.yml:</b> backup config tiap CHR; verifikasi file ada di CHR.</li>
<li><b>audit.yml:</b> kumpulkan identity/resource/interface; tampilkan rekap (gunakan register + debug).</li>
<li><b>Uji idempotency:</b> jalankan tiap playbook 2x → run ke-2 minim changed (36.7).</li>
<li><b>Uji check mode:</b> <code>--check --diff</code> sebelum tiap run write; simpan output sebagai bukti (36.9).</li>
<li><b>Jadwalkan:</b> cron di control node tiap malam (contoh: <code>0 2 * * * ansible-playbook ...</code>) — backup &amp; audit berjalan otomatis.</li>
<li><b>Dokumentasi:</b> README berisi diagram arsitektur, cara install, contoh PLAY RECAP, dan bagian "LAB vs Production".</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio)</h3>
<ol>
<li>Buat repo publik: <code>ansible-network-audit</code>.</li>
<li><b>SEBELUM push — audit secrets:</b> <code>grep -ri "password" --include="*.yml" --include="*.ini" .</code> harus TIDAK menemukan password plaintext. Pastikan <code>vault.yml</code> benar-benar terenkripsi (<code>head -1</code> harus <code>$ANSIBLE_VAULT</code>). Pastikan <code>*.backup</code> di-.gitignore.</li>
<li>README wajib: masalah yang diselesaikan, arsitektur (diagram ASCII!), cara install &amp; pakai, contoh output PLAY RECAP, dan batasan ("dibuat untuk lab; production butuh...").</li>
<li>Commit per fitur (<code>feat: backup playbook</code>, <code>feat: audit playbook</code>, <code>chore: vault for secrets</code>).</li>
<li>Tautkan di CV/LinkedIn: "Automated backup &amp; audit untuk lab MikroTik multi-device dengan Ansible — idempotent, scheduled, secrets via Vault."</li>
</ol>
<h3>Kriteria Selesai</h3>
<ul>
<li>Kedua playbook sukses ke 3 CHR (PLAY RECAP: 0 failed, 0 unreachable).</li>
<li>Tidak ada password plaintext di repo (terverifikasi dengan grep).</li>
<li>Idempotency terbukti: run ke-2 minim changed.</li>
<li>Check mode dipakai &amp; didokumentasikan sebelum run write.</li>
<li>Cron terjadwal berjalan 1x dengan sukses (bukti: log/timestamp).</li>
<li>README lengkap + repo GitHub publik tertaut.</li>
</ul>`,
  },
};
