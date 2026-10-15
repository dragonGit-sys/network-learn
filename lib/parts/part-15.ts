import type { Part } from './types';

export const part15: Part = {
  id: '15',
  number: 'PART 15',
  title: 'GNS3',
  phaseId: 'fase-3',
  description: 'Simulator jaringan GNS3: arsitektur, server, VM, QEMU, integrasi VirtualBox/VMware, node jaringan, dan manajemen project.',
  repoFolder: 'part-15-gns3',
  objectives: [
    'Menjelaskan arsitektur GNS3 (GUI, server, VM) dan peran tiap komponen.',
    'Memahami emulator QEMU dan Dynamips serta kapan memakai masing-masing.',
    'Mengintegrasikan VirtualBox/VMware dan memakai node Cloud, NAT, switch, dan VPCS.',
    'Mengelola appliance, snapshot, dan project GNS3 dengan rapi.',
    'Melakukan troubleshooting masalah umum GNS3.'
  ],
  prerequisites: 'Part 13–14 (RouterOS & CHR). Laptop dengan RAM 8 GB+ dan virtualisasi aktif.',
  subbabs: [
    {
      id: '15.1',
      title: 'Apa Itu GNS3?',
      body: `<p><b>GNS3 (Graphical Network Simulator 3)</b> adalah aplikasi open-source untuk <b>menggambar topologi jaringan dan menjalankannya secara virtual</b>: drag router ke kanvas, tarik kabel antar node, start, lalu konfigurasi persis seperti perangkat nyata. Bedanya dengan simulator Cisco Packet Tracer: GNS3 menjalankan <b>OS asli</b> (RouterOS CHR, FortiGate, IOS) — bukan simulasi perintah palsu.</p><h3>Mengapa GNS3 Standar Industri Lab?</h3><ul><li><b>Real OS:</b> bug dan perilaku yang kamu temui = perilaku asli, bukan tebakan simulator.</li><li><b>Multi-vendor:</b> MikroTik, FortiGate, Cisco, Juniper bisa satu topologi.</li><li><b>Gratis & open-source:</b> tanpa lisensi simulator.</li><li><b>Capture built-in:</b> klik kanan link → capture → Wireshark terbuka otomatis (fondasi analisis packet).</li></ul><h3>GNS3 dalam Siklus Belajar Lab Ini</h3><p>GNS3 adalah "meja kerja" Part 16 dan 18: semua router/firewall lab berjalan sebagai node GNS3. Kuasai GNS3 = kuasai lingkungan tempat seluruh lab lanjutan dikerjakan.</p><div class="callout blue"><div class="t">GNS3 vs Packet Tracer vs EVE-NG</div><p style="margin:4px 0 0"><b>Packet Tracer:</b> ringan tapi perintahnya simulasi (tidak 100% asli). <b>GNS3:</b> OS asli, gratis, jalan di laptop. <b>EVE-NG:</b> mirip GNS3 tapi berbasis web dan butuh server khusus. Kurikulum ini memakai GNS3 karena berjalan di laptop tanpa server tambahan.</p></div>`,
      terms: [['GNS3', 'Simulator jaringan grafis open-source yang menjalankan OS network asli.'], ['Node', 'Perangkat dalam topologi GNS3 (router, switch, PC).'], ['Link', 'Kabel virtual antar node di kanvas GNS3.']],
      diagram: `<pre>              GNS3 = MEJA KERJA VIRTUAL

   +--------------------------------------------------+
   | Kanvas GNS3 (drag & drop)                        |
   |                                                  |
   |  [CHR-R1] ===== [Switch] ===== [VPCS]            |
   |     ||                                           |
   |     ===== [FortiGate] ===== [Cloud]               |
   |                                                  |
   |  Klik kanan link --&gt; Start capture (Wireshark)    |
   +--------------------------------------------------+
   Semua node = OS ASLI (bukan simulasi perintah).</pre>`,
      scenario: 'Kandidat interview diminta mendesain jaringan kantor di whiteboard, lalu membuktikannya jalan di GNS3 dalam 30 menit. Ia lolos karena sudah terbiasa "berpikir topologi" di GNS3 — bukan sekadar hafal perintah.',
      bestPractices: 'Selalu desain topologi di kertas/kanvas dulu sebelum konfigurasi — GNS3 memudahkan revisi desain dibanding hardware.',
      security: 'Topologi GNS3 bisa berisi kredensial — perlakukan file project seperti dokumen sensitif.',
      challenge: 'Install GNS3 di laptop-mu dan buka kanvas kosong. Jelajahi panel node di kiri — catat kategori node yang tersedia.',
      interviewQ: 'Q: "Apa keunggulan GNS3 dibanding Packet Tracer?" — A: GNS3 menjalankan OS asli (perilaku 100% nyata, multi-vendor), sedangkan Packet Tracer mensimulasikan perintah (tidak semua fitur/bug sama dengan aslinya).',
      quiz: [
        { q: 'Keunggulan utama GNS3 adalah…', options: ['Gratis saja', 'Menjalankan OS jaringan asli (bukan simulasi perintah)', 'Tidak butuh RAM', 'Hanya untuk Cisco'], answer: 1, explain: 'OS asli = perilaku, bug, dan fitur persis seperti perangkat nyata.' },
        { q: 'Fitur capture built-in GNS3 berguna untuk…', options: ['Screenshot topologi', 'Menganalisis packet antar node dengan Wireshark langsung dari link', 'Backup otomatis', 'Update OS'], answer: 1, explain: 'Klik kanan link → capture membuka Wireshark — fondasi analisis packet flow.' },
        { q: 'Mengapa kurikulum ini memilih GNS3 dibanding EVE-NG?', options: ['Lebih keren', 'Berjalan di laptop tanpa butuh server khusus', 'Berbayar', 'Hanya mendukung MikroTik'], answer: 1, explain: 'GNS3 cukup di laptop; EVE-NG butuh server khusus — barrier lebih rendah untuk belajar.' }
      ]
    },
    {
      id: '15.2',
      title: 'GNS3 Architecture',
      body: `<p>GNS3 terdiri dari tiga komponen yang berkomunikasi via <b>REST API + WebSocket</b>. Memahami arsitektur ini penting karena 90% error GNS3 adalah masalah <b>komunikasi antar komponen</b>.</p><div class="tblwrap"><table><tr><th>Komponen</th><th>Peran</th><th>Analogi</th></tr><tr><td><b>GNS3 GUI (client)</b></td><td>Aplikasi desktop tempat menggambar topologi</td><td>Kemudi & dashboard mobil</td></tr><tr><td><b>GNS3 Server</b></td><td>Backend yang menjalankan emulasi (QEMU, Dynamips, Docker)</td><td>Mesin mobil</td></tr><tr><td><b>GNS3 VM</b></td><td>Server yang dibungkus sebagai VM siap pakai (opsional)</td><td>Mesin sewaan yang sudah diservis</td></tr></table></div><h3>Dua Mode Operasi</h3><ul><li><b>Local server:</b> GUI + server di laptop yang sama — paling simpel, cukup untuk lab Part 16/18.</li><li><b>GNS3 VM / remote server:</b> komputasi berat dipindah ke VM/server lain — untuk topologi besar (10+ node).</li></ul><div class="callout"><div class="t">Diagnosis Cepat: Siapa yang Bermasalah?</div><p style="margin:4px 0 0">GUI tidak bisa konek ke server? Cek server running (ikon status). Node tidak mau start? Cek resource server (RAM/CPU) dan image. Kabel tidak nyambung? Itu urusan topologi, bukan server. Pisahkan lapisan masalahnya.</p></div>`,
      terms: [['GNS3 GUI', 'Client desktop untuk menggambar dan mengelola topologi.'], ['GNS3 Server', 'Backend yang mengeksekusi emulasi node.'], ['GNS3 VM', 'VM siap pakai berisi GNS3 server untuk offload komputasi.'], ['REST API', 'Antarmuka komunikasi antara GUI dan server.']],
      diagram: `<pre>              ARSITEKTUR GNS3

   +----------------+   REST API + WebSocket   +----------------+
   |   GNS3 GUI     | &lt;------------------------&gt; |  GNS3 Server   |
   | (gambar topologi,|                            | (jalankan QEMU, |
   |  klik start)     |                            |  Dynamips, ...) |
   +----------------+                             +--------+-------+
                                                           |
                                              +------------+------------+
                                              |                         |
                                        Local server              GNS3 VM / remote
                                        (di laptop)               (offload berat)</pre>`,
      scenario: 'Topologi 12 node membuat laptop ngos-ngosan. Engineer memindah server ke GNS3 VM di VMware dengan RAM 16 GB — GUI tetap di laptop, komputasi di VM. Topologi yang sama kini lancar.',
      bestPractices: 'Mulai dengan local server; pindah ke GNS3 VM hanya bila topologi benar-benar butuh.',
      security: 'GNS3 server remote tanpa password = siapa pun bisa menjalankan VM di server-mu. Amankan dengan auth dan batasi akses jaringan.',
      challenge: 'Buka GNS3 → Preferences → Server. Catat apakah server local running dan di port berapa.',
      interviewQ: 'Q: "GNS3 GUI tidak bisa terhubung ke server. Apa yang kamu cek?" — A: Pastikan gns3server berjalan (status di GUI), port tidak diblokir firewall host, dan tidak ada dua server berebut port yang sama.',
      quiz: [
        { q: 'Tiga komponen arsitektur GNS3 adalah…', options: ['Router, switch, firewall', 'GUI (client), Server (backend), VM (opsional)', 'CPU, RAM, disk', 'Client, ISP, cloud'], answer: 1, explain: 'GUI menggambar, server mengeksekusi emulasi, VM adalah server siap pakai.' },
        { q: 'GUI dan server GNS3 berkomunikasi via…', options: ['Kabel serial', 'REST API + WebSocket', 'Bluetooth', 'Sinyal asap'], answer: 1, explain: 'Inilah alasan GUI bisa mengendalikan server lokal maupun remote.' },
        { q: 'Kapan membutuhkan GNS3 VM?', options: ['Selalu wajib', 'Saat topologi besar dan laptop kewalahan — komputasi di-offload ke VM', 'Tidak pernah', 'Hanya untuk Cisco'], answer: 1, explain: 'GNS3 VM memindah beban emulasi ke VM ber-resource besar; lab kecil cukup local server.' }
      ]
    },
    {
      id: '15.3',
      title: 'GNS3 GUI',
      body: `<p><b>GNS3 GUI</b> adalah aplikasi desktop tempat semua kerja visual dilakukan. Kenali anatominya agar navigasi jadi refleks.</p><h3>Anatomi Jendela</h3><ul><li><b>Panel kiri (node):</b> kategori Routers, Switches, End devices, Security devices — drag ke kanvas.</li><li><b>Kanvas tengah:</b> area gambar topologi; klik node lalu klik node lain untuk "menarik kabel".</li><li><b>Panel kanan (topology summary):</b> daftar node + status (running/stopped).</li><li><b>Toolbar atas:</b> Start/Stop/Suspend semua node, snapshot, capture.</li><li><b>Klik kanan node:</b> Start, Stop, Console, Configure (tambah adapter), Wireshark capture di link.</li></ul><h3>Shortcut Penting</h3><pre>Aksi                    Cara
Tambah link             Klik ikon "kabel" → klik port node A → klik port node B
Console ke node         Klik kanan node → Console (atau klik ganda)
Capture traffic         Klik kanan LINK → Start capture → pilih interface
Label topologi          Klik kanan kanvas → Add note / draw rectangle
Start semua             Tombol ▶ hijau di toolbar</pre><div class="callout blue"><div class="t">Kebiasaan Rapi Sejak Awal</div><p style="margin:4px 0 0">Beri <b>nama deskriptif</b> tiap node (R1-Office, bukan "CHR-3"), tambahkan <b>note IP</b> di kanvas, dan susun topologi menyerupai desain fisik. Topologi rapi = dokumentasi gratis = nilai portfolio.</p></div>`,
      terms: [['Kanvas', 'Area gambar topologi GNS3.'], ['Console', 'Terminal langsung ke node (via klik kanan).']],
      diagram: `<pre>              ANATOMI GNS3 GUI

   +--------+--------------------------------+--------+
   | Node   |         KANVAS                   | Summary|
   | panel  |                                | panel  |
   | [R1]   |   [R1]=====[SW1]=====[PC1]      | R1  run|
   | [SW1]  |     \\                           | SW1 run|
   | [PC1]  |      \\====[FW1]====[Cloud]     | PC1 run|
   +--------+--------------------------------+--------+
   Toolbar: [>|start] [■stop] [||suspend] [camera snapshot]

   Klik kanan NODE: console | configure | start/stop
   Klik kanan LINK: start capture (Wireshark)</pre>`,
      scenario: 'Instruktur menilai tugas bukan hanya dari "ping berhasil", tapi dari kerapian topologi GNS3: nama node jelas, ada label IP, kabel tidak semrawut. "Topologimu adalah CV visual-mu."',
      bestPractices: 'Namai node secara deskriptif; beri label IP di kanvas; susun menyerupai topologi fisik.',
      security: 'Jangan screenshot topologi berisi password ke forum publik tanpa sensor.',
      challenge: 'Buat project kosong, drag 2 node generik, hubungkan dengan link, beri nama dan note. Simpan project.',
      interviewQ: 'Q: "Bagaimana cara capture traffic antar dua node di GNS3?" — A: Klik kanan pada link → Start capture → pilih interface → Wireshark terbuka otomatis menampilkan packet live.',
      quiz: [
        { q: 'Cara membuka console ke sebuah node adalah…', options: ['Klik kiri dua kali / klik kanan → Console', 'Restart GNS3', 'Via browser', 'Tidak bisa'], answer: 0, explain: 'Klik kanan node → Console (atau double-click) membuka terminal ke node itu.' },
        { q: 'Untuk capture traffic sebuah link, caranya…', options: ['Klik kanan node', 'Klik kanan pada link → Start capture', 'Screenshot', 'Ping dulu'], answer: 1, explain: 'Capture dipasang pada link, bukan node — Wireshark terbuka otomatis.' },
        { q: 'Praktik terbaik penamaan node adalah…', options: ['Biarkan default (CHR-1, CHR-2)', 'Nama deskriptif sesuai peran (R1-Office)', 'Nama acak', 'Tanpa nama'], answer: 1, explain: 'Nama deskriptif = dokumentasi; memudahkan troubleshooting dan dinilai di portfolio.' }
      ]
    },
    {
      id: '15.4',
      title: 'GNS3 Server',
      body: `<p><b>GNS3 Server (gns3server)</b> adalah proses backend yang benar-benar menjalankan emulasi: ia yang menyalakan QEMU, mengatur virtual link, dan melayani GUI. GUI tanpa server = kanvas mati.</p><h3>Yang Perlu Kamu Tahu</h3><ul><li><b>Local server</b> otomatis dijalankan GUI saat dibuka (default <code>127.0.0.1:3080</code>).</li><li>Konfigurasi: Edit → Preferences → Server — atur host, port, dan path project/image.</li><li><b>Remote server:</b> arahkan GUI ke IP server lain (kantor/lab) untuk memakai resource-nya.</li><li>Log server: Help → View log — tempat pertama mencari penyebab node gagal start.</li></ul><h3>Masalah Klasik Server</h3><pre>Gejala: "Could not connect to server" atau node stuck "starting"
Cek berurutan:
1. Server running? (ikon pojok kanan bawah GUI)
2. Port 3080 dipakai aplikasi lain? → ganti port di Preferences
3. Firewall host memblokir? → izinkan gns3server
4. Lihat log: Help → View log → cari ERROR saat start node</pre><div class="callout"><div class="t">Satu Server, Banyak GUI?</div><p style="margin:4px 0 0">Satu gns3server bisa melayani beberapa GUI (mis. lab kelas). Tapi ingat: resource (RAM/CPU) dibagi — koordinasikan siapa menjalankan topologi apa.</p></div>`,
      terms: [['gns3server', 'Proses backend GNS3 yang mengeksekusi emulasi node.'], ['Local server', 'Server yang jalan di mesin yang sama dengan GUI (127.0.0.1:3080).']],
      diagram: `<pre>              GNS3 SERVER

   [GNS3 GUI] --REST :3080--> [gns3server]
                                     |
                    +----------------+----------------+
                    |                |                |
                 [QEMU VM]      [Dynamips]        [Docker]
                 (CHR,           (IOS lama)       (container)
                  FortiGate)

   GUI = perintah. Server = eksekusi. Log server = bukti error.</pre>`,
      scenario: 'Setelah install ulang, GNS3 tidak bisa start node. Log server menunjukkan "KVM not available" — virtualisasi di BIOS ternyata mati setelah update. Aktifkan VT-x, reboot, semua normal.',
      bestPractices: 'Saat error, buka server log DULU sebelum menebak-nebak — pesannya biasanya eksplisit.',
      security: 'Jangan expose port 3080 ke internet; gns3server tidak dirancang untuk publik.',
      challenge: 'Buka Help → View log di GNS3-mu, temukan baris server start dan catat versinya.',
      interviewQ: 'Q: "Node gagal start. Di mana kamu mencari penyebabnya?" — A: Di log gns3server (Help → View log) — pesannya biasanya menunjukkan akar masalah (KVM, image hilang, RAM habis).',
      quiz: [
        { q: 'Peran gns3server adalah…', options: ['Menggambar topologi', 'Backend yang menjalankan emulasi node (QEMU/Dynamips)', 'Antivirus', 'Web browser'], answer: 1, explain: 'GUI hanya menggambar dan memerintah; server yang mengeksekusi.' },
        { q: 'Port default local GNS3 server adalah…', options: ['8080', '3080', '443', '22'], answer: 1, explain: 'Default 127.0.0.1:3080 — konflik port di sini menyebabkan "could not connect".' },
        { q: 'Tempat pertama mencari penyebab node gagal start adalah…', options: ['Google', 'Log gns3server (Help → View log)', 'Restart laptop', 'Install ulang'], answer: 1, explain: 'Log server mencatat error eksplisit (KVM, image, RAM) — baca bukti dulu.' }
      ]
    },
    {
      id: '15.5',
      title: 'GNS3 VM',
      body: `<p><b>GNS3 VM</b> adalah virtual machine (Ubuntu) siap pakai berisi gns3server + semua emulator yang sudah terkonfigurasi. GUI di laptop terhubung ke VM ini — komputasi berat pindah ke VM.</p><h3>Kapan Memakai GNS3 VM?</h3><div class="tblwrap"><table><tr><th>Kondisi</th><th>Pilihan</th></tr><tr><td>Laptop Windows/macOS, topologi kecil (≤6 node)</td><td>Local server cukup</td></tr><tr><td>Topologi besar (10+ node), butuh KVM Linux</td><td>GNS3 VM (nested virtualization lebih baik di Linux)</td></tr><tr><td>Butuh Docker node / IOSv</td><td>GNS3 VM (dukungan penuh)</td></tr></table></div><h3>Setup Garis Besar</h3><ol><li>Download GNS3 VM (.ova) → import ke VMware/VirtualBox → RAM 8–16 GB, aktifkan VT-x passthrough.</li><li>Jalankan VM → catat IP-nya.</li><li>GNS3 GUI → Preferences → GNS3 VM → enable → masukkan IP → GUI otomatis memakai server di VM.</li></ol><div class="callout blue"><div class="t">Nested Virtualization</div><p style="margin:4px 0 0">GNS3 VM menjalankan VM lagi di dalamnya (CHR) — ini disebut <b>nested virtualization</b> dan butuh CPU yang mendukung + opsi "Virtualize Intel VT-x" aktif di hypervisor. Tanpa ini, node QEMU sangat lambat atau gagal start.</p></div>`,
      terms: [['GNS3 VM', 'VM siap pakai berisi gns3server untuk offload komputasi emulasi.'], ['Nested virtualization', 'VM di dalam VM — butuh dukungan CPU dan opsi khusus hypervisor.']],
      diagram: `<pre>              GNS3 VM

   [Laptop: GNS3 GUI saja]
            |
            |  (REST API via Host-only)
            v
   [GNS3 VM: Ubuntu + gns3server]
     |-- QEMU (CHR) x6
     |-- Dynamips (IOS)
     |-- Docker nodes
     +-- RAM 8-16 GB, VT-x passthrough AKTIF

   GUI ringan, komputasi di VM.</pre>`,
      scenario: 'Kelas 20 orang memakai satu server GNS3 VM di lab kampus (RAM 64 GB). Tiap mahasiswa konek GUI dari laptop ke server yang sama — tidak ada yang perlu install emulator di laptop masing-masing.',
      bestPractices: 'Aktifkan VT-x passthrough; beri RAM cukup (minimal 1 GB per CHR + 2 GB untuk OS VM).',
      security: 'GNS3 VM di jaringan lab = server bersama; atur password dan batasi siapa bisa konek.',
      challenge: 'Cek apakah CPU laptop-mu mendukung virtualisasi (Task Manager → Performance → Virtualization: Enabled).',
      interviewQ: 'Q: "Apa itu nested virtualization dan mengapa penting untuk GNS3 VM?" — A: Menjalankan VM (CHR) di dalam VM (GNS3 VM); butuh dukungan CPU + opsi VT-x passthrough, tanpanya emulasi lambat/gagal.',
      quiz: [
        { q: 'Fungsi GNS3 VM adalah…', options: ['Menggantikan GUI', 'Memindah komputasi emulasi ke VM siap pakai agar laptop tidak terbebani', 'Antivirus', 'Backup otomatis'], answer: 1, explain: 'GUI tetap di laptop; server + emulator jalan di VM ber-resource besar.' },
        { q: 'Syarat agar QEMU di dalam GNS3 VM berjalan baik adalah…', options: ['Internet cepat', 'Nested virtualization aktif (VT-x passthrough)', 'Layar 4K', 'Tidak ada syarat'], answer: 1, explain: 'Tanpa passthrough VT-x, VM-di-dalam-VM sangat lambat atau gagal.' },
        { q: 'Untuk topologi kecil (≤6 node) di laptop modern, yang disarankan…', options: ['Wajib GNS3 VM', 'Local server sudah cukup', 'Sewa cloud', 'Tidak bisa'], answer: 1, explain: 'GNS3 VM hanya dibutuhkan saat resource lokal tidak cukup.' }
      ]
    },
    {
      id: '15.6',
      title: 'QEMU',
      body: `<p><b>QEMU</b> adalah emulator/virtualizer open-source yang menjalankan <b>sistem operasi utuh</b> (CHR, FortiGate, Linux) sebagai VM. Di GNS3, hampir semua node modern (kecuali IOS lama dan VPCS) berjalan di atas QEMU.</p><h3>QEMU vs VirtualBox/VMware</h3><p>VirtualBox/VMware = hypervisor untuk VM umum (mudah dipakai manusia). QEMU = engine yang bisa diprogram/dikendalikan GNS3 secara presisi (topologi, link, capture). Hasilnya: GNS3 memakai QEMU agar tiap node bisa "dicolok kabel" dan di-capture.</p><h3>Pengaturan QEMU Penting di GNS3</h3><ul><li><b>Image (qcow2):</b> "hard disk" node — untuk CHR pakai image CHR qcow2.</li><li><b>RAM:</b> 512 MB cukup untuk CHR; FortiGate butuh 2–4 GB.</li><li><b>NIC model:</b> <code>virtio-net-pci</code> untuk CHR (tercepat); <code>e1000</code> untuk kompatibilitas OS lama.</li><li><b>Console type:</b> telnet (default) — GNS3 membukakan terminal otomatis.</li></ul><div class="callout blue"><div class="t">KVM: Akselerator QEMU</div><p style="margin:4px 0 0"><b>KVM</b> membuat QEMU berjalan nyaris secepat native (bukan emulasi murni). Di Linux + GNS3 VM, KVM aktif otomatis bila CPU mendukung. Di Windows/macOS tanpa KVM, QEMU memakai TCG (lebih lambat) — alasan lain memakai GNS3 VM untuk topologi besar.</p></div>`,
      terms: [['QEMU', 'Emulator/virtualizer yang menjalankan OS utuh sebagai node GNS3.'], ['KVM', 'Akselerator kernel Linux agar QEMU berjalan nyaris native.'], ['TCG', 'Mode emulasi murni QEMU (lambat) bila KVM tidak tersedia.']],
      diagram: `<pre>              QEMU DI GNS3

   [GNS3 Server]
        |
        +-- QEMU proses 1: [CHR-R1]  (qcow2, 512MB, virtio-net)
        +-- QEMU proses 2: [CHR-R2]  (qcow2, 512MB, virtio-net)
        +-- QEMU proses 3: [FortiGate] (qcow2, 4GB, e1000/virtio)
                |
        KVM (Linux) = cepat | TCG (tanpa KVM) = lambat

   Tiap node = 1 proses QEMU independen.</pre>`,
      scenario: 'Node FortiGate di laptop Windows sangat lambat (TCG). Setelah pindah ke GNS3 VM di VMware (KVM aktif), boot 3x lebih cepat — topologi yang sama, engine yang sama, akselerator berbeda.',
      bestPractices: 'Pakai virtio-net untuk CHR; sesuaikan RAM dengan kebutuhan OS (jangan pelit untuk FortiGate).',
      security: 'Image QEMU bisa berisi password — simpan di folder aman, jangan share mentah.',
      challenge: 'Di GNS3 → Preferences → QEMU, verifikasi QEMU terdeteksi dan catat path binary-nya.',
      interviewQ: 'Q: "Apa peran QEMU di GNS3?" — A: Engine yang menjalankan OS utuh (CHR, FortiGate) sebagai VM per node; GNS3 mengendalikannya untuk topologi, link, dan capture.',
      quiz: [
        { q: 'QEMU di GNS3 berfungsi sebagai…', options: ['Text editor', 'Engine yang menjalankan sistem operasi utuh per node', 'Web browser', 'Firewall'], answer: 1, explain: 'Tiap node modern = 1 proses QEMU yang menjalankan OS asli.' },
        { q: 'Fungsi KVM terkait QEMU adalah…', options: ['Menghemat disk', 'Akselerator agar QEMU berjalan nyaris secepat native', 'Enkripsi VM', 'Backup otomatis'], answer: 1, explain: 'KVM memakai ekstensi virtualisasi CPU; tanpa KVM, QEMU jatuh ke TCG yang lambat.' },
        { q: 'NIC model tercepat untuk CHR di QEMU adalah…', options: ['e1000', 'virtio-net-pci', 'rtl8139', 'Tidak penting'], answer: 1, explain: 'virtio adalah paravirtual — jauh lebih efisien daripada emulasi e1000.' }
      ]
    },
    {
      id: '15.7',
      title: 'Dynamips',
      body: `<p><b>Dynamips</b> adalah emulator khusus untuk <b>Cisco IOS lawas</b> (seri 7200, 3745, 2691). Ia mengemulasikan CPU MIPS/PowerPC router Cisco sehingga IOS asli bisa boot — teknologi yang membuat GNS3 terkenal di era 2000-an.</p><h3>Relevansi untuk Kurikulum Ini</h3><p>Kurikulum ini fokus MikroTik + FortiGate (QEMU), jadi Dynamips <b>tidak dipakai di lab</b>. Tapi kamu wajib tahu keberadaannya karena:</p><ul><li>Banyak tutorial lama & soal sertifikasi CCNA memakai topologi Dynamips.</li><li>Konsepnya (image IOS + idle-pc) sering muncul di forum saat kamu mencari bantuan.</li><li>Jika suatu hari butuh IOS Cisco, kamu tahu GNS3 mendukungnya.</li></ul><h3>Istilah Kunci (Sekadar Tahu)</h3><ul><li><b>IOS image:</b> file OS Cisco (butuh lisensi/kontrak Cisco yang valid — tidak bebas didownload).</li><li><b>Idle-PC:</b> nilai kalibrasi agar Dynamips tidak memakan 100% CPU — wajib di-set, kalau tidak laptop ngos-ngosan.</li></ul><div class="callout"><div class="t">Catatan Lisensi</div><p style="margin:4px 0 0">Image IOS Cisco <b>tidak gratis</b> — butuh hak legal (kontrak Cisco). Jangan download dari situs bajakan. Untuk lab ini kita tidak membutuhkannya sama sekali.</p></div>`,
      terms: [['Dynamips', 'Emulator Cisco IOS lawas (7200/3745) di GNS3.'], ['IOS image', 'File OS Cisco — berlisensi, tidak gratis.'], ['Idle-PC', 'Kalibrasi agar Dynamips tidak memakan CPU 100%.']],
      diagram: `<pre>              DYNAMIPS (KONTEKS)

   [GNS3] --Dynamips--> [Cisco 7200 IOS asli]
                (emulasi CPU MIPS/PowerPC)

   Dipakai untuk: IOS Cisco lawas (sertifikasi lama, tutorial lama)
   TIDAK dipakai di kurikulum ini (kita pakai CHR/FortiGate via QEMU).
   Ingat istilahnya saja: IOS image (berlisensi!) + idle-pc.</pre>`,
      scenario: 'Engineer senior membagikan topologi latihan CCNA berbasis Dynamips tahun 2015. Junior yang paham konsepnya bisa menjalankan latihan itu — walau lab sehari-hari memakai CHR.',
      bestPractices: 'Fokus ke QEMU/CHR untuk kurikulum ini; kenali Dynamips sebagai wawasan.',
      security: 'Jangan unduh IOS image dari sumber ilegal — risiko malware dan pelanggaran lisensi.',
      challenge: 'Cari tahu: router Cisco seri apa saja yang didukung Dynamips? (jawab: 7200, 3745, 3725, 2691, 2600).',
      interviewQ: 'Q: "Apa itu Dynamips?" — A: Emulator di GNS3 untuk menjalankan Cisco IOS lawas (seri 7200) dengan mengemulasikan CPU-nya; butuh image IOS berlisensi dan setting idle-pc.',
      quiz: [
        { q: 'Dynamips digunakan untuk…', options: ['Menjalankan MikroTik CHR', 'Mengemulasikan Cisco IOS lawas (seri 7200)', 'Menjalankan Windows', 'Browsing internet'], answer: 1, explain: 'Dynamips mengemulasikan CPU router Cisco lawas agar IOS asli bisa boot.' },
        { q: 'Fungsi idle-pc pada Dynamips adalah…', options: ['Mempercepat boot', 'Kalibrasi agar tidak memakan CPU 100%', 'Menghemat RAM', 'Enkripsi'], answer: 1, explain: 'Tanpa idle-pc yang tepat, Dynamips menyedot seluruh CPU host.' },
        { q: 'Status Dynamips dalam kurikulum ini adalah…', options: ['Wajib dipakai tiap lab', 'Wawasan saja — lab memakai CHR/FortiGate via QEMU', 'Pengganti QEMU', 'Tidak dikenal'], answer: 1, explain: 'Kurikulum fokus MikroTik+FortiGate; Dynamips cukup dikenali untuk konteks.' }
      ]
    },
    {
      id: '15.8',
      title: 'VirtualBox Integration',
      body: `<p>GNS3 bisa <b>mengendalikan VM VirtualBox</b> sebagai node topologi — mis. VM Linux sebagai "server" atau CHR yang sudah terinstall di VirtualBox. Ini menjembatani lab VirtualBox (Part 14.3) dengan kanvas GNS3.</p><h3>Cara Kerja</h3><ol><li>Di GNS3 → Preferences → VirtualBox → pastikan terdeteksi.</li><li>Buat VM di VirtualBox seperti biasa (mis. Ubuntu Server).</li><li>Di GNS3, tambah node "VirtualBox VM" → pilih nama VM → atur jumlah adapter.</li><li>Start node dari GNS3 — GNS3 menyalakan VM VirtualBox dan mencolokkan "kabel" ke topologi.</li></ol><h3>Kapan Memakainya?</h3><ul><li>Butuh <b>server Linux/Windows</b> sebagai endpoint (web server, client).</li><li>Memanfaatkan VM yang sudah ada tanpa install ulang di QEMU.</li><li><b>Keterbatasan:</b> hanya jalan bila GNS3 server dan VirtualBox di mesin yang sama (local); tidak sefleksibel QEMU untuk snapshot/topologi.</li></ul><div class="callout blue"><div class="t">Pola Umum di Lab Ini</div><p style="margin:4px 0 0">Untuk endpoint ringan kita memakai <b>VPCS</b> (15.14, super ringan). VirtualBox integration dipakai bila butuh OS server betulan (mis. Ubuntu untuk Zabbix di Part 23+ atau testing web server).</p></div>`,
      terms: [['VirtualBox integration', 'Fitur GNS3 mengendalikan VM VirtualBox sebagai node topologi.']],
      diagram: `<pre>           VIRTUALBOX INTEGRATION

   [VirtualBox: Ubuntu-Server VM]
            |
   [GNS3 Server] --kendalikan--> start/stop + colok kabel virtual
            |
   [Kanvas] [CHR-R1]====[Ubuntu-Server]====[SW1]

   Syarat: GNS3 server & VirtualBox di mesin yang sama.</pre>`,
      scenario: 'Untuk uji web server, engineer butuh Ubuntu asli (bukan VPCS). Ia memakai VirtualBox integration: VM Ubuntu yang sudah ada tinggal dicolok ke topologi GNS3 — tanpa install ulang.',
      bestPractices: 'Pakai untuk server OS betulan; untuk client ringan tetap VPCS.',
      security: 'VM server di topologi lab bisa terekspos ke segmen lab — hardening seperti server nyata.',
      challenge: 'Cek di GNS3 Preferences → VirtualBox apakah VirtualBox-mu terdeteksi.',
      interviewQ: 'Q: "Kapan memakai VirtualBox integration dibanding VPCS?" — A: Saat butuh OS server betulan (Linux/Windows dengan aplikasi nyata); VPCS hanya untuk client ringan (ping/traceroute).',
      quiz: [
        { q: 'Fungsi VirtualBox integration di GNS3 adalah…', options: ['Menggantikan QEMU', 'Menjadikan VM VirtualBox sebagai node yang dikendalikan GNS3', 'Mempercepat internet', 'Backup VM'], answer: 1, explain: 'GNS3 menyalakan VM VirtualBox dan mencolokkan kabel virtual ke topologi.' },
        { q: 'Syarat VirtualBox integration adalah…', options: ['Internet cepat', 'GNS3 server dan VirtualBox di mesin yang sama', 'Lisensi khusus', 'Tidak ada syarat'], answer: 1, explain: 'Integrasi ini lokal — server remote/GNS3 VM tidak bisa mengendalikan VirtualBox di laptop.' },
        { q: 'Contoh penggunaan yang tepat adalah…', options: ['Client ping ringan', 'VM Ubuntu sebagai web server betulan di topologi', 'Menggambar topologi', 'Capture packet'], answer: 1, explain: 'Untuk OS + aplikasi nyata; client ringan cukup VPCS.' }
      ]
    },
    {
      id: '15.9',
      title: 'VMware Integration',
      body: `<p>Serupa dengan VirtualBox, GNS3 bisa mengendalikan <b>VM VMware Workstation</b> sebagai node. Bedanya: integrasi VMware memakai <b>vmrun</b> (utilitas command-line VMware) dan umumnya lebih stabil untuk banyak VM.</p><h3>Setup Garis Besar</h3><ol><li>Install VMware Workstation + pastikan utilitas <code>vmrun</code> tersedia.</li><li>GNS3 → Preferences → VMware → arahkan ke vmrun, daftarkan VM (.vmx).</li><li>Tambah node "VMware VM" ke kanvas → pilih VM → start dari GNS3.</li></ol><h3>VMware vs VirtualBox Integration</h3><div class="tblwrap"><table><tr><th>Aspek</th><th>VirtualBox</th><th>VMware</th></tr><tr><td>Biaya hypervisor</td><td>Gratis</td><td>Workstation berbayar (kecuali versi gratis)</td></tr><tr><td>Stabilitas banyak VM</td><td>Cukup</td><td>Umumnya lebih baik</td></tr><tr><td>Penggunaan di lab ini</td><td>Default untuk pemula</td><td>Opsional bila sudah punya</td></tr></table></div><div class="callout"><div class="t">Rekomendasi Lab</div><p style="margin:4px 0 0">Tidak wajib menguasai keduanya — pilih SATU hypervisor untuk lab-mu dan konsisten. VirtualBox cukup untuk seluruh Part 16/18 bila belum punya VMware.</p></div>`,
      terms: [['VMware integration', 'Fitur GNS3 mengendalikan VM VMware Workstation sebagai node.'], ['vmrun', 'Utilitas command-line VMware untuk mengendalikan VM.']],
      diagram: `<pre>           VMWARE INTEGRATION

   [VMware Workstation: Win10-Test VM]
            |
   [GNS3] --vmrun--> start/stop + kabel virtual
            |
   [Kanvas] [CHR-R1]====[Win10-Test]

   Pilih SATU hypervisor untuk lab-mu dan konsisten.</pre>`,
      scenario: 'Tim QA butuh Windows asli untuk uji aplikasi via jaringan lab. Mereka memakai VMware integration: VM Windows tester dicolok ke topologi GNS3 yang meniru jaringan kantor.',
      bestPractices: 'Pilih satu hypervisor dan konsisten; dokumentasikan VM apa saja yang terdaftar sebagai node.',
      security: 'VM Windows di lab bisa menjadi target malware uji — isolasi segmennya dari LAN kantor.',
      challenge: 'Jika punya VMware, cek keberadaan vmrun di sistem-mu (where vmrun / which vmrun).',
      interviewQ: 'Q: "Apa beda integrasi VMware dan VirtualBox di GNS3?" — A: Prinsip sama (VM jadi node); VMware via vmrun umumnya lebih stabil untuk banyak VM, VirtualBox gratis — pilih satu dan konsisten.',
      quiz: [
        { q: 'GNS3 mengendalikan VM VMware melalui…', options: ['WinBox', 'vmrun (utilitas command-line VMware)', 'SSH', 'Telnet'], answer: 1, explain: 'vmrun adalah CLI resmi VMware untuk start/stop/mengelola VM.' },
        { q: 'Rekomendasi untuk lab pribadi adalah…', options: ['Kuasai keduanya', 'Pilih satu hypervisor dan konsisten', 'Jangan pakai keduanya', 'Ganti tiap minggu'], answer: 1, explain: 'Konsistensi mengurangi variabel troubleshooting; satu hypervisor cukup.' },
        { q: 'Kapan integrasi hypervisor dibutuhkan?', options: ['Selalu', 'Saat butuh OS betulan (server/client nyata) sebagai node', 'Tidak pernah', 'Hanya untuk Cisco'], answer: 1, explain: 'Node QEMU/VPCS cukup untuk mayoritas lab; integrasi untuk OS + aplikasi nyata.' }
      ]
    },
    {
      id: '15.10',
      title: 'Network Adapter GNS3',
      body: `<p>Setiap node GNS3 punya <b>adapter</b> (slot NIC). Mengelola jumlah dan tipe adapter adalah skill dasar: topologi butuh berapa kabel = butuh berapa adapter.</p><h3>Aturan Main</h3><ul><li><b>Tambah adapter:</b> klik kanan node → Configure → tab Network → tambah jumlah adapter (node harus dalam keadaan <b>stopped</b>).</li><li><b>Nama port:</b> adapter tampil sebagai <code>eth0, eth1…</code> (Linux) atau <code>ether1…</code> (RouterOS) — urutan sesuai slot.</li><li><b>Tipe adapter (QEMU):</b> pilih model NIC (virtio-net untuk CHR) — salah pilih = OS tidak mengenali NIC.</li></ul><h3>Kesalahan Umum</h3><pre>Gejala: kabel terhubung tapi interface tidak muncul di OS
Penyebab umum:
1. Adapter belum ditambahkan (jumlah adapter < jumlah kabel)
2. Node masih running saat menambah adapter → stop dulu!
3. Model NIC tidak didukung OS (mis. virtio di OS lama tanpa driver)

Gejala: eth0/eth1 tertukar dengan desain
Solusi: catat mapping slot→kabel; di RouterOS cocokkan via MAC
(/interface ethernet print) seperti di 14.8.</pre><div class="callout blue"><div class="t">Rencanakan Adapter di Depan</div><p style="margin:4px 0 0">Sebelum start topologi, hitung: tiap node butuh berapa kabel? Tambahkan adapter sekaligus. Menambah adapter di tengah lab = stop node = mengulang konfigurasi yang belum disimpan.</p></div>`,
      terms: [['Adapter (GNS3)', 'Slot NIC virtual pada node; satu kabel butuh satu adapter di tiap ujung.']],
      diagram: `<pre>           ADAPTER = SLOT KABEL

   [CHR-R1] butuh 4 kabel:
     eth0 --&gt; ke SW-mgmt
     eth1 --&gt; ke R2
     eth2 --&gt; ke SW-LAN
     eth3 --&gt; ke Cloud
   = butuh 4 adapter (Configure saat node STOPPED)

   Jumlah kabel per node = jumlah adapter minimal.</pre>`,
      scenario: 'Topologi 3 router tidak bisa full-mesh karena tiap CHR default 1 adapter. Engineer stop semua node, set 4 adapter per CHR, start ulang — mesh terbentuk.',
      bestPractices: 'Hitung kebutuhan adapter sebelum start; beri nama kabel/link di kanvas bila topologi kompleks.',
      security: 'Adapter tak terpakai yang tetap connected ke segmen bisa menjadi jalur tak terduga — disconnect yang tidak dipakai.',
      challenge: 'Buat node CHR di GNS3, set 4 adapter via Configure, start, dan verifikasi ether1–ether4 muncul di /interface print.',
      interviewQ: 'Q: "Interface tidak muncul di OS padahal kabel terhubung. Apa yang kamu cek?" — A: Jumlah adapter cukup? Node di-stop saat menambah? Model NIC didukung OS? Urutan slot sesuai?',
      quiz: [
        { q: 'Syarat menambah adapter pada node GNS3 adalah…', options: ['Node harus running', 'Node harus stopped', 'Tidak ada syarat', 'Harus di cloud'], answer: 1, explain: 'Perubahan hardware virtual hanya bisa saat node mati.' },
        { q: 'Jumlah adapter minimal sebuah node sama dengan…', options: ['Jumlah RAM', 'Jumlah kabel/link yang terhubung ke node itu', 'Jumlah VLAN', 'Selalu 1'], answer: 1, explain: 'Satu kabel butuh satu adapter di tiap ujungnya.' },
        { q: 'Jika urutan interface tertukar dengan desain, cara memastikannya adalah…', options: ['Tebak saja', 'Cocokkan MAC address di OS dengan slot adapter', 'Restart terus', 'Install ulang'], answer: 1, explain: 'MAC tiap adapter unik dan terlihat di OS — cocokkan dengan topologi.' }
      ]
    },
    {
      id: '15.11',
      title: 'Cloud Node',
      body: `<p><b>Cloud node</b> adalah "jendela" dari topologi GNS3 ke <b>dunia nyata</b>: menghubungkan node virtual ke NIC fisik laptop, ke internet, atau ke jaringan kantor. Inilah cara CHR lab "internet beneran".</p><h3>Cara Kerja & Setup</h3><ol><li>Tambah node "Cloud" ke kanvas → klik kanan → Configure.</li><li>Pilih interface host yang dijembatani (mis. NIC Ethernet/Wi-Fi laptop, atau interface TAP).</li><li>Hubungkan link dari Cloud ke node (mis. ether-WAN CHR).</li><li>CHR dapat IP via DHCP dari jaringan nyata (atau set static) — kini ia bisa ping internet sungguhan.</li></ol><div class="callout"><div class="t">Cloud vs NAT Node — Jangan Tertukar</div><p style="margin:4px 0 0"><b>Cloud:</b> bridge ke jaringan NYATA (CHR dapat IP dari LAN/internet asli — terlihat sebagai device nyata). <b>NAT node</b> (15.12): NAT internal GNS3 (node dapat IP privat GNS3, internet via NAT — terisolasi). Untuk lab aman, pilih NAT node; Cloud hanya bila butuh integrasi nyata.</p></div>`,
      terms: [['Cloud node', 'Node GNS3 yang menjembatani topologi virtual ke jaringan fisik/host.']],
      diagram: `<pre>              CLOUD NODE

   [Topologi GNS3]                [Dunia nyata]
   [CHR ether-WAN] ==== [Cloud] ==== (NIC laptop) ==== [Internet/LAN kantor]
                                     (bridge)

   CHR dapat IP dari jaringan NYATA (DHCP/static).
   Hati-hati: CHR kini terlihat di jaringan nyata!</pre>`,
      scenario: 'Untuk demo ke user, engineer menghubungkan topologi lab ke LAN kantor via Cloud node — user bisa ping server virtual dari laptopnya. Demo sukses, lalu Cloud node segera dilepas agar lab tidak mengganggu LAN.',
      bestPractices: 'Pakai Cloud node seperlunya dan lepas setelah selesai; untuk internet lab sehari-hari pakai NAT node.',
      security: 'Cloud = lab menyentuh jaringan nyata. DHCP/firewall yang salah di lab bisa bocor ke LAN kantor — isolasi dulu, bridge kemudian.',
      challenge: 'Tambahkan Cloud node ke project latihan-mu dan hubungkan ke satu CHR. Amati IP apa yang didapat CHR.',
      interviewQ: 'Q: "Apa beda Cloud node dan NAT node?" — A: Cloud mem-bridge ke jaringan nyata (node dapat IP asli, terlihat device nyata); NAT node memberi internet via NAT internal GNS3 yang terisolasi.',
      quiz: [
        { q: 'Fungsi Cloud node adalah…', options: ['Menyimpan file di cloud', 'Menjembatani topologi GNS3 ke jaringan fisik/host (internet/LAN nyata)', 'Backup otomatis', 'Mempercepat simulasi'], answer: 1, explain: 'Cloud = jendela ke dunia nyata via NIC host.' },
        { q: 'Risiko memakai Cloud node adalah…', options: ['Tidak ada', 'Kesalahan konfigurasi lab bisa bocor ke jaringan nyata', 'GNS3 jadi lambat', 'Lisensi hangus'], answer: 1, explain: 'Bridge = dua dunia tersambung; DHCP liar atau loop di lab berdampak ke LAN nyata.' },
        { q: 'Untuk internet lab sehari-hari yang aman, lebih disarankan…', options: ['Cloud node', 'NAT node (terisolasi)', 'Tanpa internet', 'Kabel langsung'], answer: 1, explain: 'NAT node memberi internet tanpa mengekspos lab sebagai device di jaringan nyata.' }
      ]
    },
    {
      id: '15.12',
      title: 'NAT Node',
      body: `<p><b>NAT node</b> memberi <b>akses internet ke topologi secara terisolasi</b>: GNS3 membuat subnet privat internal (default <code>192.168.122.0/24</code>-ish, tergantung setup) dan me-NAT-kan traffic keluar via host. Node lab bisa browsing tanpa terlihat sebagai device di LAN nyata.</p><h3>Cara Pakai</h3><ol><li>Drag node "NAT" ke kanvas.</li><li>Hubungkan ke interface WAN router lab (mis. ether-WAN CHR).</li><li>Di CHR: <code>/ip dhcp-client add interface=ether-WAN disabled=no</code> — dapat IP dari NAT GNS3.</li><li>Uji: <code>/tool ping 8.8.8.8</code> dari CHR — internet jalan, terisolasi.</li></ol><h3>NAT Node vs Cloud Node</h3><div class="tblwrap"><table><tr><th>Aspek</th><th>NAT Node</th><th>Cloud Node</th></tr><tr><td>IP yang didapat node</td><td>Privat dari GNS3</td><td>Dari jaringan nyata</td></tr><tr><td>Terlihat di LAN nyata</td><td>Tidak</td><td>Ya (bridge)</td></tr><tr><td>Keamanan lab</td><td>Aman (terisolasi)</td><td>Berisiko bocor</td></tr><tr><td>Pakai untuk</td><td>Internet lab sehari-hari</td><td>Integrasi/demo ke jaringan nyata</td></tr></table></div><div class="callout blue"><div class="t">Pola Standar Lab Ini</div><p style="margin:4px 0 0">Di Part 16/18, "internet" selalu disimulasikan via <b>NAT node</b> — aman, konsisten, dan tidak tergantung jaringan tempat laptop berada (Wi-Fi kafe vs LAN kantor tidak masalah).</p></div>`,
      terms: [['NAT node', 'Node GNS3 yang memberi internet terisolasi via NAT internal.']],
      diagram: `<pre>              NAT NODE

   [Topologi] [CHR ether-WAN] ==== [NAT] ==== (via host) ==== [Internet]
                  |
            dapat IP privat GNS3 via DHCP
            (mis. 192.168.122.10)

   Terisolasi: tidak terlihat di LAN nyata. Aman untuk lab harian.</pre>`,
      scenario: 'Peserta mengerjakan lab dari Wi-Fi kafe yang berubah-ubah. Karena memakai NAT node, topologi lab-nya tidak peduli jaringan host — IP lab selalu konsisten.',
      bestPractices: 'Jadikan NAT node sebagai sumber "internet" default di semua project lab.',
      security: 'NAT node tetap memberi jalur keluar — jangan jadikan alasan mengabaikan firewall di router lab.',
      challenge: 'Tambahkan NAT node ke project latihan, koneksikan ke CHR, dapatkan IP via DHCP client, dan ping 8.8.8.8.',
      interviewQ: 'Q: "Mengapa lab memakai NAT node bukan Cloud untuk internet harian?" — A: Terisolasi — node tidak terlihat di LAN nyata, IP konsisten di mana pun laptop berada, dan kesalahan lab tidak bocor ke jaringan nyata.',
      quiz: [
        { q: 'Keunggulan NAT node dibanding Cloud node untuk lab harian adalah…', options: ['Lebih cepat', 'Terisolasi — aman dan IP konsisten di jaringan apapun', 'Gratis', 'Tanpa konfigurasi'], answer: 1, explain: 'NAT internal GNS3 tidak mengekspos node ke LAN nyata dan tidak tergantung jaringan host.' },
        { q: 'Agar CHR mendapat IP dari NAT node, di CHR perlu…', options: ['IP static manual', '/ip dhcp-client pada interface WAN', 'Tidak perlu apa-apa', 'Restart'], answer: 1, explain: 'NAT GNS3 menyediakan DHCP; CHR menjadi client di interface WAN-nya.' },
        { q: 'IP yang didapat node dari NAT node bersifat…', options: ['IP publik', 'IP privat dari subnet internal GNS3', 'IP acak internet', 'Tidak dapat IP'], answer: 1, explain: 'GNS3 me-NAT-kan subnet privat internalnya keluar via host.' }
      ]
    },
    {
      id: '15.13',
      title: 'Ethernet Switch',
      body: `<p>Node <b>Ethernet switch</b> di GNS3 adalah <b>switch unmanaged virtual</b>: meneruskan frame antar port berdasar MAC, tanpa konfigurasi. Ia adalah "kabel bercabang" — bukan switch managed.</p><h3>Karakteristik</h3><ul><li><b>Tanpa konfigurasi:</b> langsung pakai — tidak ada CLI, tidak ada VLAN.</li><li><b>Ringan:</b> hampir nol beban CPU dibanding node QEMU.</li><li><b>Cocok untuk:</b> menghubungkan banyak endpoint (VPCS) ke satu router, atau antar router dalam satu segmen.</li><li><b>Tidak cocok untuk:</b> lab VLAN tagging, STP, port security — butuh switch managed (atau CHR dengan bridge sebagai pengganti).</li></ul><h3>Kapan Butuh Switch "Beneran"?</h3><p>Untuk lab VLAN (Part 08–10 di GNS3), ganti node switch bawaan dengan <b>CHR + bridge VLAN filtering</b> atau image switch managed (IOSvL2). Pola di kurikulum: switch bawaan untuk konektivitas dasar; VLAN di-trunk langsung antar CHR.</p><div class="callout"><div class="t">Jangan Tertipu Bentuknya</div><p style="margin:4px 0 0">Ikonnya switch, tapi perilakunya hub pintar (learning bridge) tanpa fitur managed. Jika lab VLAN-mu "aneh", curigai node ini — ia meneruskan tag VLAN apa adanya tanpa memprosesnya.</p></div>`,
      terms: [['Ethernet switch (GNS3)', 'Node switch unmanaged virtual — tanpa konfigurasi.']],
      diagram: `<pre>           ETHERNET SWITCH (UNMANAGED)

   [CHR-R1 eth2] ==== [SW1] ==== [VPCS-1]
                            ==== [VPCS-2]
                            ==== [VPCS-3]

   = "kabel bercabang" — tanpa CLI, tanpa VLAN.
   Untuk lab VLAN managed: pakai CHR+bridge, bukan node ini.</pre>`,
      scenario: 'Lab butuh 5 PC dalam satu LAN. Daripada 5 kabel ke router (butuh 5 adapter), cukup 1 kabel router→switch, 5 VPCS→switch. Topologi rapi, adapter hemat.',
      bestPractices: 'Pakai untuk agregasi endpoint; jangan harapkan fitur managed darinya.',
      security: 'Switch unmanaged meneruskan semua broadcast — segmen besar = broadcast domain besar; segmentasikan dengan VLAN/router bila perlu.',
      challenge: 'Buat topologi: 1 CHR + 1 switch + 3 VPCS dalam satu subnet. Verifikasi semua saling ping.',
      interviewQ: 'Q: "Apa keterbatasan node Ethernet switch di GNS3?" — A: Unmanaged — tanpa CLI, tanpa VLAN/STP/port-security; untuk fitur managed pakai CHR dengan bridge atau image switch managed.',
      quiz: [
        { q: 'Node Ethernet switch di GNS3 bersifat…', options: ['Managed dengan CLI', 'Unmanaged — tanpa konfigurasi', 'Hanya untuk Cisco', 'Berbayar'], answer: 1, explain: 'Ia langsung pakai tanpa CLI/VLAN — setara switch unmanaged.' },
        { q: 'Kegunaan utama node ini adalah…', options: ['Routing antar VLAN', 'Menghubungkan banyak endpoint dalam satu segmen secara ringan', 'Firewall', 'DHCP server'], answer: 1, explain: 'Agregasi murah-CPU untuk banyak node dalam satu broadcast domain.' },
        { q: 'Untuk lab VLAN tagging yang benar, sebaiknya…', options: ['Tetap pakai node ini', 'Pakai CHR dengan bridge VLAN filtering / switch managed', 'Tidak bisa di GNS3', 'Pakai NAT node'], answer: 1, explain: 'Node bawaan tidak memproses VLAN; butuh perangkat yang VLAN-aware.' }
      ]
    },
    {
      id: '15.14',
      title: 'VPCS',
      body: `<p><b>VPCS (Virtual PC Simulator)</b> adalah "PC mini" super ringan: hanya bisa <b>ping, traceroute, dan DHCP client</b> — tanpa OS utuh. Satu VPCS makan RAM ~hitungan MB, jadi kamu bisa menjalankan puluhan "PC" tanpa membebani laptop.</p><h3>Perintah VPCS Esensial</h3><pre>PC1&gt; ip 192.168.20.10/24 192.168.20.1
# Format: ip &lt;IP/mask&gt; &lt;gateway&gt; — memberi IP + gateway sekaligus.
# Alasan satu perintah: VPCS memang didesain minimalis.

PC1&gt; show
# Verifikasi IP, gateway, MAC.

PC1&gt; ping 192.168.20.1
PC1&gt; trace 8.8.8.8
# Ping & traceroute untuk verifikasi konektivitas.</pre><h3>VPCS vs VM Betulan</h3><div class="tblwrap"><table><tr><th>Aspek</th><th>VPCS</th><th>VM (VirtualBox/Ubuntu)</th></tr><tr><td>Beban</td><td>~MB RAM</td><td>GB RAM</td></tr><tr><td>Kemampuan</td><td>ping/trace/DHCP</td><td>OS + aplikasi penuh</td></tr><tr><td>Cocok untuk</td><td>Endpoint uji konektivitas</td><td>Server/client aplikasi nyata</td></tr></table></div><div class="callout blue"><div class="t">Aturan Lab</div><p style="margin:4px 0 0">Gunakan VPCS untuk SEMUA endpoint uji (PC user, CCTV simulasi) di Part 16/18. VM betulan hanya bila lab secara eksplisit butuh aplikasi (mis. web server).</p></div>`,
      terms: [['VPCS', 'Simulator PC minimalis untuk ping/traceroute/DHCP — sangat ringan.']],
      diagram: `<pre>              VPCS = PC MINI

   [VPCS-1: 192.168.20.10] --\\
   [VPCS-2: 192.168.20.11] ---- [SW1] ---- [CHR-R1]
   [VPCS-3: 192.168.20.12] --/

   PC1&gt; ip 192.168.20.10/24 192.168.20.1
   PC1&gt; ping 192.168.20.1        --&gt; verifikasi gateway
   PC1&gt; ping 192.168.30.10       --&gt; verifikasi inter-VLAN

   Puluhan VPCS = beban laptop nyaris nol.</pre>`,
      scenario: 'Uji 20 client DHCP: menjalankan 20 VM mustahil di laptop, tapi 20 VPCS enteng. Engineer memverifikasi pool DHCP tidak habis dan lease tercatat benar — dalam 5 menit.',
      bestPractices: 'Namai VPCS sesuai perannya (PC-Office1, CCTV-1); catat IP tiap VPCS di note kanvas.',
      security: 'VPCS tidak punya "keamanan" — ia hanya alat uji; jangan jadikan representasi hardening client.',
      challenge: 'Jalankan 3 VPCS, beri IP satu subnet, verifikasi saling ping, lalu uji DHCP client (ip dhcp).',
      interviewQ: 'Q: "Apa itu VPCS dan kapan memakainya?" — A: PC virtual minimalis (ping/trace/DHCP) yang sangat ringan; dipakai sebagai endpoint uji konektivitas agar puluhan client bisa jalan di laptop.',
      quiz: [
        { q: 'Perintah memberi IP + gateway di VPCS adalah…', options: ['set ip', 'ip <IP/mask> <gateway>', 'ifconfig', 'dhcp saja'], answer: 1, explain: 'Format VPCS: ip 192.168.20.10/24 192.168.20.1 — IP dan gateway sekaligus.' },
        { q: 'Keunggulan utama VPCS adalah…', options: ['Bisa main game', 'Sangat ringan — puluhan PC virtual tanpa beban berarti', 'Punya GUI', 'Bisa install aplikasi'], answer: 1, explain: 'VPCS hanya simulasi stack minimal; RAM per instance hitungan MB.' },
        { q: 'Keterbatasan VPCS adalah…', options: ['Tidak bisa ping', 'Hanya ping/traceroute/DHCP — tanpa aplikasi/OS nyata', 'Berbayar', 'Hanya 1 instance'], answer: 1, explain: 'Untuk aplikasi nyata (web server) butuh VM betulan via integrasi hypervisor.' }
      ]
    },
    {
      id: '15.15',
      title: 'Appliance',
      body: `<p><b>Appliance</b> adalah "resep" node GNS3: file <code>.gns3a</code> berisi template siap pakai (image yang dibutuhkan, RAM, NIC, cara install). Daripada setting QEMU manual tiap kali, import appliance → isi image → jadi.</p><h3>Alur Pakai Appliance</h3><ol><li>Download file <code>.gns3a</code> (dari marketplace GNS3 / komunitas) — mis. <code>mikrotik-chr.gns3a</code>.</li><li>GNS3 → File → Import appliance → pilih file.</li><li>GNS3 meminta file image (qcow2 CHR) — arahkan ke lokasi download.</li><li>Template tersimpan → drag ke kanvas seperti node biasa.</li></ol><h3>Appliance vs Template Manual</h3><ul><li><b>Appliance:</b> cepat, terstandar, cocok untuk dibagikan ke tim/kelas.</li><li><b>Manual (15.6):</b> fleksibel, kamu paham tiap parameter — wajib dikuasai dulu sebelum memakai appliance buta.</li></ul><div class="callout"><div class="t">Appliance dari Sumber Asing</div><p style="margin:4px 0 0">File <code>.gns3a</code> hanyalah JSON teks — aman dibaca. Tapi <b>image</b> yang diminta bisa dari mana saja: pastikan image (terutama IOS) legal dan dari sumber tepercaya. Untuk CHR/FortiGate, download dari situs resmi vendor.</p></div>`,
      terms: [['Appliance', 'Template node GNS3 (.gns3a): resep siap pakai berisi setting QEMU/Docker.']],
      diagram: `<pre>              APPLIANCE = RESEP NODE

   [mikrotik-chr.gns3a] + [chr-7.x.qcow2] 
            |                    (download resmi)
            v
   [GNS3: Import appliance] --&gt; template "MikroTik CHR"
            |
            v
   Drag ke kanvas --&gt; node siap pakai (RAM, NIC sudah benar)

   .gns3a = JSON teks (aman dibaca). Image = pastikan legal.</pre>`,
      scenario: 'Instruktur membagikan satu file .gns3a ke 30 peserta — semua mendapat template CHR identik (RAM, NIC virtio) dalam 2 menit. Tidak ada lagi "di laptop saya kok beda".',
      bestPractices: 'Kuasai setting manual dulu (15.6), baru pakai appliance untuk kecepatan.',
      security: 'Periksa isi .gns3a (teks) sebelum import dari sumber asing; image hanya dari situs resmi vendor.',
      challenge: 'Download appliance MikroTik CHR (.gns3a) dari marketplace GNS3 dan import ke lab-mu.',
      interviewQ: 'Q: "Apa itu appliance GNS3?" — A: File template .gns3a berisi konfigurasi node siap pakai; pengguna tinggal menyediakan image-nya — mempercepat dan menstandarkan deployment node.',
      quiz: [
        { q: 'File appliance GNS3 berekstensi…', options: ['.exe', '.gns3a', '.pdf', '.zip'], answer: 1, explain: 'Appliance = file .gns3a (JSON) berisi resep template node.' },
        { q: 'Setelah import appliance, yang masih harus disediakan pengguna adalah…', options: ['Tidak ada', 'File image OS (mis. qcow2 CHR)', 'Lisensi GNS3', 'Kabel fisik'], answer: 1, explain: 'Appliance berisi setting; image OS tetap diunduh terpisah (dari situs resmi).' },
        { q: 'Mengapa disarankan kuasai setting manual sebelum pakai appliance?', options: ['Agar keren', 'Agar paham tiap parameter dan bisa troubleshooting saat template bermasalah', 'Wajib lisensi', 'Tidak ada alasan'], answer: 1, explain: 'Appliance buta = tidak bisa diagnosis saat node gagal start.' }
      ]
    },
    {
      id: '15.16',
      title: 'Snapshot',
      body: `<p><b>Snapshot</b> di GNS3 menyimpan <b>seluruh state project</b>: topologi + state disk tiap node. Rusak total? Restore snapshot — lab kembali seperti sediakala dalam hitungan detik.</p><h3>Cara Pakai</h3><pre>Aksi: Toolbar → Snapshot (ikon kamera) → beri nama deskriptif
      "sebelum-konfigurasi-firewall" (bukan "snap1")

Restore: Snapshot → pilih → Restore
Hapus: snapshot lama yang tak terpakai (hemat disk!)</pre><h3>Strategi Snapshot untuk Lab</h3><ul><li><b>Sebelum tiap fase berisiko:</b> sebelum firewall, sebelum routing, sebelum "break-the-lab".</li><li><b>Nama deskriptif + tanggal:</b> <code>2026-10-14_sebelum-nat</code>.</li><li><b>Jangan menumpuk:</b> tiap snapshot = salinan disk node — puluhan snapshot = disk penuh.</li></ul><div class="callout blue"><div class="t">Snapshot GNS3 vs Snapshot VM vs Backup RouterOS</div><p style="margin:4px 0 0"><b>Snapshot GNS3:</b> seluruh project + semua node. <b>Snapshot VM:</b> satu VM saja. <b>/system backup:</b> konfigurasi RouterOS saja (di dalam node). Pilih sesuai cakupan rollback yang kamu butuhkan.</p></div>`,
      terms: [['Snapshot (GNS3)', 'Titik simpan seluruh state project + disk tiap node.']],
      diagram: `<pre>              SNAPSHOT STRATEGY

   [Topologi dasar OK] --snapshot--> "base-topologi"
            |
   [Routing OK] --------snapshot--> "routing-ok"
            |
   [Firewall OK] -------snapshot--> "firewall-ok"
            |
   [BREAK THE LAB!] --rusak--> Restore "firewall-ok" (detik!)

   Nama deskriptif. Hapus yang tak terpakai (hemat disk).</pre>`,
      scenario: 'Peserta salah ketik firewall dan mengunci semua akses — 15 menit sebelum presentasi. Restore snapshot "firewall-ok": lab pulih dalam 20 detik. Presentasi terselamatkan.',
      bestPractices: 'Snapshot sebelum tiap fase berisiko; nama deskriptif; hapus snapshot usang.',
      security: 'Snapshot menyimpan kredensial dalam konfigurasi node — perlakukan file project seperti data sensitif.',
      challenge: 'Buat snapshot project latihan-mu sekarang dengan nama deskriptif, lalu restore untuk memastikan mekanismenya bekerja.',
      interviewQ: 'Q: "Apa beda snapshot GNS3 dengan /system backup MikroTik?" — A: Snapshot GNS3 = seluruh project + state semua node; /system backup = konfigurasi satu RouterOS saja. Cakupan berbeda.',
      quiz: [
        { q: 'Fungsi snapshot GNS3 adalah…', options: ['Screenshot topologi', 'Menyimpan seluruh state project + disk node untuk restore instan', 'Backup ke cloud', 'Update GNS3'], answer: 1, explain: 'Snapshot = titik kembali seluruh lab bila eksperimen merusak.' },
        { q: 'Kapan membuat snapshot?', options: ['Tidak pernah', 'Sebelum tiap fase konfigurasi berisiko / break-the-lab', 'Hanya sekali', 'Tiap menit'], answer: 1, explain: 'Snapshot adalah jaring pengaman eksperimen — buat sebelum risiko, bukan sesudah rusak.' },
        { q: 'Risiko menumpuk snapshot adalah…', options: ['Tidak ada', 'Disk penuh — tiap snapshot menyimpan salinan disk node', 'GNS3 error', 'Lisensi hangus'], answer: 1, explain: 'Snapshot qcow2 bertambah besar; hapus yang sudah tidak dibutuhkan.' }
      ]
    },
    {
      id: '15.17',
      title: 'Project Management',
      body: `<p><b>Project</b> di GNS3 adalah wadah: topologi + konfigurasi node + image referensi + snapshot. Manajemen project yang rapi = lab yang bisa diulang, dibagikan, dan dijadikan portfolio.</p><h3>Struktur Project</h3><pre>~/GNS3/projects/nama-project/
  ├── nama-project.gns3        # definisi topologi (JSON)
  ├── project-files/
  │   ├── qemu/<node-id>/      # disk tiap node (hda.qcow2)
  │   └── captures/            # hasil Wireshark capture
  └── snapshots/               # snapshot project</pre><h3>Praktik Rapi</h3><ul><li><b>Nama project deskriptif:</b> <code>lab-16-gns3-chr-routing</code>, bukan <code>project1</code>.</li><li><b>Satu project = satu tujuan lab.</b> Jangan campur 5 eksperimen.</li><li><b>Export portable:</b> File → Export portable project — untuk dibagikan (tanpa image besar bila perlu).</li><li><b>Dokumentasi di kanvas:</b> note berisi IP plan + tujuan lab.</li></ul><div class="callout"><div class="t">Project & Portfolio</div><p style="margin:4px 0 0">Di Part 16/18, project GNS3 yang rapi (topologi + note + export konfigurasi) adalah bagian dari <b>portfolio GitHub</b>-mu. Mulai biasakan standar ini dari sekarang.</p></div>`,
      terms: [['Project (GNS3)', 'Wadah topologi + file node + snapshot dalam satu folder.'], ['Portable project', 'Ekspor project agar bisa dibuka di mesin lain.']],
      diagram: `<pre>           PROJECT MANAGEMENT

   ~/GNS3/projects/
    |-- lab-16-routing/        (satu tujuan = satu project)
    |    |-- topologi.gns3
    |    |-- project-files/qemu/... (disk node)
    |    +-- snapshots/
    |
    |-- lab-18-firewall/      (project terpisah)
    +-- ...

   Nama deskriptif + note IP di kanvas = dokumentasi.</pre>`,
      scenario: 'Dua bulan kemudian peserta ingin mengulang lab routing — project bernama lab-16-gns3-chr-routing langsung ditemukan dan dibuka. Temannya yang menamai project1…project9 menyerah mencari.',
      bestPractices: 'Satu project satu tujuan; nama deskriptif; note IP plan di kanvas; export portable untuk berbagi.',
      security: 'File .gns3 berisi info topologi dan kadang kredensial — sanitasi sebelum dibagikan publik.',
      challenge: 'Rename project latihan-mu dengan nama deskriptif dan tambahkan note IP plan di kanvas.',
      interviewQ: 'Q: "Bagaimana kamu mengorganisasi banyak project lab?" — A: Satu project per tujuan lab, nama deskriptif, note IP di kanvas, snapshot per milestone, dan export portable untuk berbagi.',
      quiz: [
        { q: 'Prinsip satu project GNS3 adalah…', options: ['Campur semua eksperimen', 'Satu project = satu tujuan lab', 'Satu project selamanya', 'Tanpa nama'], answer: 1, explain: 'Satu tujuan per project memudahkan pengulangan, snapshot, dan berbagi.' },
        { q: 'File .gns3 berisi…', options: ['Image OS', 'Definisi topologi (JSON)', 'Video', 'Lisensi'], answer: 1, explain: 'Topologi = JSON; disk node tersimpan terpisah di project-files.' },
        { q: 'Sebelum membagikan project ke publik, yang wajib dilakukan…', options: ['Tidak ada', 'Sanitasi kredensial/info sensitif di dalamnya', 'Hapus semua snapshot', 'Ganti nama'], answer: 1, explain: 'Project bisa berisi password/hash — bersihkan sebelum publikasi.' }
      ]
    },
    {
      id: '15.18',
      title: 'GNS3 Troubleshooting',
      body: `<p>Masalah GNS3 terbagi ke <b>tiga lapisan</b>: GUI/server, node/emulasi, dan topologi/jaringan. Diagnosis berlapis menghemat waktu berjam-jam.</p><div class="tblwrap"><table><tr><th>Lapisan</th><th>Gejala</th><th>Solusi</th></tr><tr><td>GUI ↔ Server</td><td>"Could not connect", GUI freeze</td><td>Cek server running, port 3080, firewall host, baca server log</td></tr><tr><td>Node tidak start</td><td>Stuck "starting", error merah</td><td>Baca log server: KVM/VT-x? image ada? RAM cukup? adapter valid?</td></tr><tr><td>Node start tapi tak bisa console</td><td>Console kosong/timeout</td><td>Tunggu boot selesai (FortiGate lama); cek console type telnet</td></tr><tr><td>Link "terhubung" tapi tak ada traffic</td><td>Ping gagal antar node</td><td>Adapter cukup? segmen benar? Ini masalah JARINGAN — troubleshoot seperti fisik (Part 13–14)</td></tr><tr><td>Lambat semua</td><td>CPU host 100%</td><td>Kurangi node, pakai GNS3 VM, tutup aplikasi berat</td></tr></table></div><h3>Checklist Cepat</h3><pre>1. Server: GUI terkoneksi? (ikon status)
2. Resource: CPU/RAM host cukup? (Task Manager/htop)
3. Node: log server bilang apa? (Help → View log)
4. Jaringan: perlakukan seperti fisik — /interface, /ip address, ping berlapis
5. Terakhir: snapshot restore bila lab rusak total</pre><div class="callout blue"><div class="t">Mindset: Virtual = Fisik</div><p style="margin:4px 0 0">Setelah node running, lupakan bahwa ini virtual — troubleshoot dengan metodologi jaringan normal (Layer 1→7). "Kabel virtual" pun bisa "salah colok" (link ke port yang keliru).</p></div>`,
      terms: [['Lapisan diagnosis', 'GUI/server → node/emulasi → topologi/jaringan — urutan cek masalah GNS3.']],
      diagram: `<pre>           TROUBLESHOOTING GNS3 BERLAPIS

   [Masalah]
      |
      +-- GUI/server?  --&gt; koneksi :3080, firewall host, server log
      |
      +-- Node/emulasi? --&gt; KVM, image, RAM, adapter, baca log
      |
      +-- Jaringan? --&gt; anggap FISIK: interface, IP, route, firewall
      |
      +-- Menyerah? --&gt; restore snapshot, ulangi dengan tenang</pre>`,
      scenario: 'Topologi 8 node tiba-tiba semua "cannot start" setelah update. Log server: "permission denied /dev/kvm". Solusi: user dikeluarkan dari grup kvm oleh update — tambahkan kembali, reboot, normal.',
      bestPractices: 'Baca log server dulu; diagnosis berlapis; snapshot adalah jaring pengaman terakhir.',
      security: 'Log GNS3 bisa berisi path dan info sistem — hapus info sensitif bila meminta bantuan di forum publik.',
      challenge: 'Sengaja buat satu error (mis. stop server lalu start node) dan praktikkan membaca pesan error + log-nya.',
      interviewQ: 'Q: "Semua node gagal start setelah update OS. Langkahmu?" — A: Cek log gns3server untuk pesan eksplisit (umumnya permission /dev/kvm atau KVM hilang), perbaiki di level OS, bukan reinstall GNS3.',
      quiz: [
        { q: 'Urutan diagnosis masalah GNS3 yang benar adalah…', options: ['Reinstall dulu', 'GUI/server → node/emulasi → jaringan, berlapis', 'Acak', 'Tanya forum dulu'], answer: 1, explain: 'Berlapis dari infrastruktur ke jaringan menghemat waktu dan tepat sasaran.' },
        { q: 'Node start tapi ping antar node gagal. Ini masalah lapisan…', options: ['GUI', 'Jaringan — troubleshoot seperti perangkat fisik', 'Lisensi', 'Internet'], answer: 1, explain: 'Node hidup = emulasi OK; masalahnya konfigurasi jaringan di dalam node.' },
        { q: 'Jaring pengaman terakhir bila lab rusak total adalah…', options: ['Install ulang OS', 'Restore snapshot', 'Beli laptop baru', 'Menyerah'], answer: 1, explain: 'Snapshot mengembalikan seluruh state project dalam detik.' }
      ]
    }
  ]
};
