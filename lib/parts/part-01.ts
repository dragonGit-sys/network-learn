// Part 01 — dimigrasi FAITHFUL dari lib/data.ts (web artifact asli).
// JANGAN ubah isi konten manual; konten adalah sumber kebenaran kurikulum.
import type { Part } from './types';

export const part01: Part = {
  "id": "01",
  "number": "PART 01",
  "title": "Fundamental Networking",
  "phaseId": "fase-1",
  "description": "Konsep dasar jaringan: topologi, domain, bandwidth, latency.",
  "repoFolder": "part-01-fundamental",
  "objectives": [
    "Memahami apa itu network engineering dan aktivitas hariannya di NOC maupun enterprise.",
    "Mengklasifikasikan jaringan (LAN, MAN, WAN, Internet) serta peran client, server, dan network device.",
    "Membaca dan merancang topologi fisik vs logis, termasuk segmentasi jaringan dengan VLAN.",
    "Menjelaskan empat parameter kualitas jaringan: bandwidth, throughput, latency, jitter, dan packet loss."
  ],
  "prerequisites": "Tidak ada — ini titik awal kurikulum. Cukup rasa ingin tahu dan (opsional) secangkir kopi.",
  "subbabs": [
    {
      "id": "1.1",
      "title": "Apa Itu Network Engineering?",
      "body": "\n<p><b>Network engineering</b> adalah disiplin rekayasa untuk merancang, membangun, mengoperasikan, dan memperbaiki jaringan komputer — sistem yang menghubungkan perangkat (komputer, server, HP, CCTV, printer) agar bisa saling bertukar data dengan cepat, aman, dan andal.</p>\n<p>Kata kuncinya ada tiga: <b>data harus sampai</b> (connectivity), <b>sampai dengan benar dan aman</b> (security), dan <b>tetap sampai walaupun ada yang rusak</b> (reliability). Seluruh kurikulum 39 part ini pada dasarnya adalah pendalaman dari tiga kata kunci tersebut.</p>\n<h3>Pengertian Sederhana vs Teknis</h3>\n<p><b>Sederhana:</b> network engineering adalah pekerjaan \"mengurus jalan raya digital\" — membangun jalannya (kabel, fiber, Wi-Fi), mengatur lalu lintasnya (switch, router), memasang gerbang keamanannya (firewall), dan memantau kemacetan serta kecelakaannya (monitoring).</p>\n<p><b>Teknis:</b> network engineering mencakup perancangan Layer 1–4 model OSI (fisik, data link, network, transport): pemilihan media transmisi, pengalamatan IP, switching, routing, hingga quality of service (QoS) — plus aspek operasional seperti monitoring, dokumentasi, dan change management.</p>\n<h3>Mengapa Bidang Ini Dibutuhkan?</h3>\n<ul>\n<li>Hampir semua layanan modern (bank, rumah sakit, e-commerce, pemerintahan) berjalan di atas jaringan. Jaringan mati = bisnis berhenti.</li>\n<li>Jumlah perangkat meledak: satu kantor bisa punya ribuan endpoint (PC, HP, IoT, CCTV, access point).</li>\n<li>Ancaman keamanan terus berkembang — jaringan adalah garis pertahanan pertama.</li>\n</ul>\n<h3>Masalah Apa yang Diselesaikan?</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Masalah</th><th>Solusi Network Engineering</th></tr>\n<tr><td>Perangkat tidak bisa saling terhubung</td><td>Desain topologi, pengalamatan IP, switching & routing</td></tr>\n<tr><td>Jaringan lambat / putus-putus</td><td>Analisis bandwidth, latency, packet loss (dibahas di 1.11–1.15)</td></tr>\n<tr><td>Data bocor / diserang</td><td>Segmentasi VLAN, firewall, enkripsi VPN</td></tr>\n<tr><td>Gangguan tidak terdeteksi sampai user komplain</td><td>Monitoring proaktif (Zabbix + Grafana, Part 23–27)</td></tr>\n</table></div>\n<h3>Di Mana Kamu Berada di Peta Ini?</h3>\n<p>Kamu bekerja di bidang NOC (Network Operations Center). NOC adalah \"ruang kendali\" jaringan: memantau dashboard 24/7, merespons alarm, dan melakukan troubleshooting awal. Skill yang dibangun di lab ini — konsep, konfigurasi, troubleshooting, monitoring, automation — persis adalah skill harian NOC dan Network Engineer.</p>\n<div class=\"callout blue\"><div class=\"t\">Hubungan dengan OSI</div><p style=\"margin:4px 0 0\">Network engineer paling banyak bekerja di Layer 1–4. Layer 5–7 lebih banyak menjadi wilayah system engineer & developer — tapi seorang network engineer tetap harus paham cara membacanya untuk troubleshooting (Part 02).</p></div>",
      "quiz": [
        {
          "q": "Apa fokus utama network engineering?",
          "options": [
            "Membuat aplikasi web",
            "Menghubungkan perangkat agar data sampai dengan cepat, aman, dan andal",
            "Mengelola database perusahaan",
            "Mendesain tampilan website"
          ],
          "answer": 1
        },
        {
          "q": "Di layer OSI mana network engineer paling banyak bekerja?",
          "options": [
            "Layer 5–7 saja",
            "Layer 1–4 (fisik sampai transport)",
            "Hanya Layer 7",
            "Semua layer sama rata"
          ],
          "answer": 1
        },
        {
          "q": "Apa kepanjangan dan peran NOC?",
          "options": [
            "Network Operations Center — memantau dan merespons gangguan jaringan",
            "Network Online Center — toko perangkat jaringan",
            "Node Operation Central — pusat data mining",
            "Network Office Computer — divisi IT umum"
          ],
          "answer": 0
        }
      ],
      "terms": [
        [
          "Network",
          "Dua perangkat atau lebih yang terhubung dan bisa bertukar data."
        ],
        [
          "Endpoint",
          "Perangkat ujung pengguna: PC, laptop, HP, printer, CCTV."
        ],
        [
          "Infrastructure",
          "Perangkat perantara: switch, router, firewall, access point."
        ]
      ],
      "diagram": "<pre>        APA YANG DIKERJAKAN NETWORK ENGINEERING?\n\n[User/Client] ── akses ──▶ [LAN: Switch/AP] ──▶ [Router/Firewall] ──▶ [WAN/ISP] ──▶ [Server]\n      ▲                          │                      │                              │\n      └──────────── MONITORING (NOC) · DOKUMENTASI · AUTOMATION ─────────────────────────┘\nTiga janji di setiap panah: data SAMPAI (connectivity) · AMAN (security) · TETAP SAMPAI (reliability)</pre>",
      "scenario": "Sebuah perusahaan e-commerce rugi miliaran karena jaringan down 2 jam di jam promo. Tidak ada yang salah dengan aplikasinya — yang gagal adalah jaringan, dan tidak ada engineer yang cukup cepat menemukan sumbernya. Di situlah nilai network engineering terasa paling mahal: saat ia tidak ada.",
      "bestPractices": "Pahami dulu konsep sebelum menyentuh konfigurasi. Engineer yang kuat selalu bisa menjawab 'mengapa' sebelum 'bagaimana'.",
      "security": "Jaringan adalah permukaan serangan terbesar perusahaan — setiap keputusan desain (siapa boleh mengakses apa) adalah keputusan keamanan.",
      "challenge": "Tulis 1 paragraf dengan kata-katamu sendiri: apa itu network engineering dan mengapa perusahaan membutuhkannya. Simpan — ini bahan jawaban interview pertamamu.",
      "interviewQ": "Q: 'Apa bedanya network engineer dengan IT support?' — A: IT support menyelesaikan masalah perangkat pengguna (endpoint); network engineer merancang dan menjaga infrastruktur yang menghubungkan semua endpoint dan server — cakupan desain, bukan hanya perbaikan."
    },
    {
      "id": "1.2",
      "title": "Apa yang Dikerjakan Network Engineer?",
      "body": "\n<p>Pekerjaan network engineer terbagi ke dalam siklus: <b>Design → Build → Operate → Troubleshoot → Optimize</b>. Memahami siklus ini penting karena setiap part di kurikulum ini memetakan ke salah satu tahapnya.</p>\n<h3>Aktivitas Harian (Operate & Troubleshoot)</h3>\n<ul>\n<li>Memantau dashboard monitoring: link up/down, traffic melonjak, CPU device tinggi.</li>\n<li>Merespons tiket gangguan: \"internet lambat di lantai 3\", \"VPN kantor cabang putus\".</li>\n<li>Melakukan change terjadwal: ganti konfigurasi, upgrade firmware — biasanya di maintenance window malam hari.</li>\n<li>Membuat laporan dan dokumentasi perubahan (change log).</li>\n</ul>\n<h3>Aktivitas Project (Design & Build)</h3>\n<ul>\n<li>Mendesain topologi kantor/campus baru: berapa switch, VLAN apa saja, IP plan bagaimana.</li>\n<li>Instalasi & konfigurasi: rack mounting, cabling, konfigurasi router/switch/firewall.</li>\n<li>Migrasi: mengganti ISP, mengganti firewall lama, memindahkan data center.</li>\n<li>Testing & handover: uji failover, uji throughput, serah-terima dokumentasi.</li>\n</ul>\n<h3>Contoh Satu Hari di NOC</h3>\n<pre>08.00  Cek dashboard Zabbix: 1 alarm — link kantor cabang flapping\n08.15  Troubleshooting: ping test, cek interface counter, hubungi ISP\n09.30  Tiket user: printer lantai 2 tidak bisa diakses → cek VLAN &amp; IP\n13.00  Review kapasitas: traffic WAN mencapai 80% di jam sibuk\n15.00  Siapkan change request: tambah bandwidth / QoS untuk besok malam\n21.00  Maintenance window: upgrade firmware core switch (dengan rollback plan)</pre>\n<div class=\"callout\"><div class=\"t\">LAB vs Production</div><p style=\"margin:4px 0 0\">Di lab (GNS3) kamu bebas merusak dan mengulang. Di production, setiap perubahan wajib punya: alasan bisnis, langkah rollback, dan jendela waktu (maintenance window). Kebiasaan ini dilatih terus di lab ini lewat metode BREAK → TROUBLESHOOT → FIX.</p></div>\n<h3>Skill yang Dibutuhkan</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Kategori</th><th>Contoh</th><th>Dipelajari di</th></tr>\n<tr><td>Konsep</td><td>OSI, TCP/IP, subnetting</td><td>Part 01–05</td></tr>\n<tr><td>Konfigurasi</td><td>VLAN, routing, firewall policy</td><td>Part 08–18</td></tr>\n<tr><td>Troubleshooting</td><td>Ping, traceroute, packet capture</td><td>Part 28</td></tr>\n<tr><td>Monitoring</td><td>Zabbix, Grafana, SNMP</td><td>Part 23–27</td></tr>\n<tr><td>Automation</td><td>Python, Ansible, API</td><td>Part 32–37</td></tr>\n</table></div>",
      "quiz": [
        {
          "q": "Urutan siklus kerja network engineer yang benar adalah…",
          "options": [
            "Build → Design → Operate",
            "Design → Build → Operate → Troubleshoot → Optimize",
            "Operate → Design → Build",
            "Troubleshoot → Design → Build"
          ],
          "answer": 1
        },
        {
          "q": "Mengapa perubahan di production dilakukan pada maintenance window?",
          "options": [
            "Agar tidak perlu dokumentasi",
            "Karena dampak gangguan paling kecil dan ada waktu rollback",
            "Agar lebih cepat selesai",
            "Itu aturan ISP"
          ],
          "answer": 1
        },
        {
          "q": "Aktivitas mana yang termasuk 'Operate'?",
          "options": [
            "Mendesain topologi kantor baru",
            "Memantau dashboard dan merespons alarm monitoring",
            "Membeli perangkat baru",
            "Membuat proposal project"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Change Request",
          "Dokumen resmi usulan perubahan konfigurasi di production."
        ],
        [
          "Maintenance Window",
          "Jendela waktu terjadwal untuk perubahan berisiko."
        ],
        [
          "Rollback Plan",
          "Rencana mengembalikan konfigurasi ke kondisi semula jika change gagal."
        ]
      ],
      "scenario": "Di NOC, satu shift bisa berisi: alarm link cabang down pukul 02.00, tiket 'Wi-Fi lambat' pukul 09.00, dan maintenance upgrade core switch pukul 23.00. Semua tercatat di tiket & change log — tidak ada pekerjaan 'di luar catatan'.",
      "bestPractices": "Dokumentasikan setiap perubahan, sekecil apa pun. Konfigurasi tanpa catatan adalah utang yang dibayar engineer berikutnya (atau kamu sendiri 6 bulan lagi).",
      "security": "Tidak ada perubahan 'cepat tanpa prosedur' di production untuk akses management device — semua lewat change request dan akun pribadi, bukan akun bersama.",
      "challenge": "Buat contoh jadwal satu hari kerja NOC (8 aktivitas) lengkap dengan jamnya, meniru contoh di materi. Latih cara berpikirmu tentang prioritas.",
      "interviewQ": "Q: 'Apa yang kamu lakukan pertama kali saat menerima alarm jaringan down?' — A: Verifikasi alarm itu nyata (bukan false positive), tentukan cakupan dampaknya (berapa user/site), baru troubleshooting dari layer terbawah — sambil membuka tiket dan mencatat timeline."
    },
    {
      "id": "1.3",
      "title": "Network Engineer vs System Engineer vs DevOps",
      "body": "\n<p>Tiga peran ini sering tumpang tindih dan sering bekerja dalam satu tim. Mengetahui batasnya membantumu fokus belajar — dan menjawab pertanyaan interview dengan tepat.</p>\n<div class=\"tblwrap\"><table>\n<tr><th>Aspek</th><th>Network Engineer</th><th>System Engineer</th><th>DevOps Engineer</th></tr>\n<tr><td>Fokus</td><td>Konektivitas: data bergerak antar perangkat</td><td>Server & OS: aplikasi berjalan di atas server</td><td>Pipeline: kode dari developer sampai ke production</td></tr>\n<tr><td>Perangkat utama</td><td>Router, switch, firewall, AP</td><td>Server fisik/virtual, storage, hypervisor</td><td>CI/CD server, container, Kubernetes</td></tr>\n<tr><td>OS yang dikuasai</td><td>RouterOS, FortiOS, IOS, Linux dasar</td><td>Windows Server, Linux mendalam</td><td>Linux, Docker, cloud platform</td></tr>\n<tr><td>Bahasa/tool khas</td><td>CLI device, Wireshark, GNS3</td><td>Active Directory, VMware, backup</td><td>Git, Jenkins, Terraform, Ansible</td></tr>\n<tr><td>Pertanyaan khas</td><td>\"Mengapa packet tidak sampai?\"</td><td>\"Mengapa server-nya down?\"</td><td>\"Mengapa deployment-nya gagal?\"</td></tr>\n</table></div>\n<h3>Di Mana Mereka Bertemu?</h3>\n<p>Contoh kasus nyata: website perusahaan tidak bisa dibuka.</p>\n<ul>\n<li><b>Network Engineer</b> memeriksa: apakah traffic dari user mencapai server? DNS resolve? Firewall allow? Route ada?</li>\n<li><b>System Engineer</b> memeriksa: apakah service web server hidup? Disk penuh? Sertifikat expired?</li>\n<li><b>DevOps</b> memeriksa: apakah deployment terakhir merusak aplikasi? Perlu rollback rilis?</li>\n</ul>\n<p>Pelajaran penting: troubleshooting yang baik dimulai dari menentukan <b>domain masalahnya</b> — network, system, atau aplikasi. Model OSI (Part 02) adalah alat utamanya.</p>\n<div class=\"callout blue\"><div class=\"t\">Tren Modern: NetDevOps</div><p style=\"margin:4px 0 0\">Network engineer modern makin mengadopsi cara kerja DevOps: konfigurasi sebagai kode (Infrastructure as Code), automation dengan Python/Ansible, dan version control Git. Itulah mengapa kurikulum ini ditutup dengan Part 32–39 (automation + final enterprise lab) — targetmu bukan sekadar bisa konfigurasi manual, tapi bisa mengotomatisasikannya.</p></div>",
      "quiz": [
        {
          "q": "User tidak bisa membuka website. Siapa yang memeriksa apakah firewall memblokir traffic?",
          "options": [
            "System Engineer",
            "DevOps Engineer",
            "Network Engineer",
            "Database Administrator"
          ],
          "answer": 2
        },
        {
          "q": "Peran yang fokus pada pipeline deployment aplikasi adalah…",
          "options": [
            "Network Engineer",
            "System Engineer",
            "DevOps Engineer",
            "NOC Operator"
          ],
          "answer": 2
        },
        {
          "q": "Apa itu NetDevOps?",
          "options": [
            "Jaringan khusus untuk developer",
            "Penerapan praktik DevOps (automation, Git, IaC) pada pengelolaan jaringan",
            "Nama vendor perangkat jaringan",
            "Protokol routing baru"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Infrastructure as Code",
          "Mengelola konfigurasi infrastruktur lewat file kode yang ter-versioning."
        ],
        [
          "CI/CD",
          "Otomatisasi build, test, dan deploy aplikasi."
        ],
        [
          "Domain Masalah",
          "Wilayah asal gangguan: network, system, atau aplikasi."
        ]
      ],
      "diagram": "<pre>                 SATU INSIDEN, TIGA DOMAIN\n\nUser ──▶ [NETWORK: NE] ──▶ [SYSTEM: SE] ──▶ [APLIKASI: DevOps]\n          packet sampai?     server sehat?     rilis terakhir aman?\nAturan main: buktikan domainmu sehat dengan DATA, lalu serahkan ke domain berikutnya.</pre>",
      "scenario": "Website down pukul 10.00. Tim berkumpul: network engineer membuktikan traffic sampai ke server (network sehat), system engineer menemukan disk server penuh 100%, DevOps me-rollback dan membersihkan. Tanpa pemetaan peran, ketiganya saling menunggu.",
      "bestPractices": "Saat incident, nyatakan dengan data domain mana yang sehat: 'dari sisi network, packet sampai ke server dengan latency normal' — ini mempercepat semua orang.",
      "security": "Pemisahan peran juga soal akses: network engineer tidak butuh root di server aplikasi, dan sebaliknya. Least privilege antar-tim.",
      "challenge": "Ambil 5 masalah umum (Wi-Fi putus, server lemot, deploy gagal, VPN putus, email tidak terkirim) dan tentukan pemilik pertamanya: NE, SE, atau DevOps. Tulis alasannya.",
      "interviewQ": "Q: 'Kalau website lambat, dari mana kamu mulai?' — A: Tentukan domainnya dulu dengan bukti: cek DNS & konektivitas (network), cek resource server (system), cek rilis terakhir (aplikasi) — bukan menebak."
    },
    {
      "id": "1.4",
      "title": "LAN, MAN, WAN dan Internet",
      "body": "\n<p>Jaringan diklasifikasikan berdasarkan <b>cakupan geografisnya</b>. Klasifikasi ini menentukan teknologi, kecepatan, dan siapa yang mengelola jaringan tersebut.</p>\n<div class=\"tblwrap\"><table>\n<tr><th>Jenis</th><th>Cakupan</th><th>Contoh</th><th>Kecepatan Umum</th><th>Pengelola</th></tr>\n<tr><td><b>LAN</b> (Local Area Network)</td><td>Satu ruangan / gedung / kampus</td><td>Jaringan kantor, lab sekolah, rumah</td><td>1–100 Gbps</td><td>Sendiri / tim IT internal</td></tr>\n<tr><td><b>MAN</b> (Metropolitan Area Network)</td><td>Satu kota</td><td>Jaringan antar-gedung pemkot, jaringan kampus multi-lokasi sekota</td><td>1–100 Gbps (fiber metro)</td><td>Instansi / provider lokal</td></tr>\n<tr><td><b>WAN</b> (Wide Area Network)</td><td>Antar kota / negara / benua</td><td>Jaringan kantor cabang antar-provinsi, internet itu sendiri</td><td>Sangat bervariasi</td><td>Provider / ISP (leased line, MPLS, VPN)</td></tr>\n<tr><td><b>Internet</b></td><td>Global</td><td>Gabungan jutaan jaringan di seluruh dunia</td><td>—</td><td>Tidak ada pemilik tunggal</td></tr>\n</table></div>\n<h3>Konsep Penting: Internet adalah \"Network of Networks\"</h3>\n<p>Internet bukan satu jaringan raksasa milik satu perusahaan. Internet adalah gabungan ribuan jaringan (ISP, perusahaan, kampus) yang sepakat memakai protokol yang sama (TCP/IP) dan saling terhubung. LAN kantormu menjadi bagian dari internet saat terhubung ke ISP.</p>\n<pre>[PC Kantor] ── LAN ── [Router/Firewall] ── ISP ── INTERNET ── [Server Google]\n   gedungmu            gedungmu          provider    global        data center</pre>\n<h3>Implikasi Praktis</h3>\n<ul>\n<li>Di <b>LAN</b>, kamu mengendalikan segalanya: kabel, switch, IP. Latency sangat rendah (&lt;1 ms).</li>\n<li>Di <b>WAN</b>, kamu menyewa jalur milik provider. Latency lebih tinggi (antar pulau bisa 20–60 ms), bandwidth lebih mahal — maka traffic WAN harus dihemat dan diamankan (VPN).</li>\n<li>Istilah lain yang akan sering muncul: <b>PAN</b> (Personal, ±10 m — Bluetooth) dan <b>CAN</b> (Campus Area Network — beberapa gedung satu kampus).</li>\n</ul>\n<div class=\"callout\"><div class=\"t\">Kesalahan Umum Pemula</div><p style=\"margin:4px 0 0\">Menganggap \"Wi-Fi = internet\". Wi-Fi hanyalah media akses di LAN. Internet bisa saja hidup sementara Wi-Fi mati, dan sebaliknya Wi-Fi menyala tapi internet putus karena ISP gangguan. Bedakan selalu: masalah LAN atau masalah WAN?</p></div>",
      "quiz": [
        {
          "q": "Jaringan antar kantor cabang di Jakarta dan Surabaya digolongkan sebagai…",
          "options": [
            "LAN",
            "MAN",
            "WAN",
            "PAN"
          ],
          "answer": 2
        },
        {
          "q": "Pernyataan yang benar tentang internet adalah…",
          "options": [
            "Milik satu perusahaan global",
            "Gabungan banyak jaringan yang memakai TCP/IP",
            "Sama dengan Wi-Fi",
            "Hanya terdiri dari jaringan ISP"
          ],
          "answer": 1
        },
        {
          "q": "Mengapa traffic WAN perlu diamankan dengan VPN?",
          "options": [
            "Karena WAN selalu lambat",
            "Karena jalur WAN melewati infrastruktur milik pihak lain/provider",
            "Karena LAN tidak butuh keamanan",
            "VPN adalah syarat dari ISP"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "ISP",
          "Internet Service Provider — penyedia akses internet (Indihome, Biznet, dsb)."
        ],
        [
          "Leased Line",
          "Jalur WAN dedicated yang disewa dari provider."
        ],
        [
          "MPLS",
          "Teknologi WAN provider untuk menghubungkan banyak cabang secara privat."
        ]
      ],
      "scenario": "Kantor pusat di Jakarta membuka cabang di Makassar. LAN masing-masing kota dihubungkan lewat WAN (VPN di atas internet / MPLS provider). Dari kursi NOC, kamu memonitor keduanya sebagai satu jaringan perusahaan — padahal secara fisik terpisah 1.400 km.",
      "bestPractices": "Selalu tanyakan 'ini masalah LAN atau WAN?' di awal troubleshooting — penanganannya (dan pihak yang dihubungi: tim internal vs ISP) sangat berbeda.",
      "security": "Traffic antar-site yang melewati WAN/internet wajib dienkripsi (VPN). Traffic LAN internal pun idealnya disegmentasi, bukan dianggap otomatis aman.",
      "challenge": "Klasifikasikan 6 jaringan di sekitarmu (Wi-Fi rumah, jaringan kantor, hotspot HP, jaringan kampus, internet, Bluetooth ke headset) ke PAN/LAN/MAN/WAN dan beri alasannya.",
      "interviewQ": "Q: 'Apa itu internet?' — A: Gabungan (interconnection) dari banyak jaringan independen yang sepakat memakai TCP/IP dan saling menukar rute — bukan satu jaringan milik satu pihak."
    },
    {
      "id": "1.5",
      "title": "Client, Server dan Network Device",
      "body": "\n<p>Setiap jaringan terdiri dari tiga kelompok peran: <b>client</b> yang meminta layanan, <b>server</b> yang menyediakan layanan, dan <b>network device</b> yang mengantarkan data di antara keduanya.</p>\n<h3>Client & Server</h3>\n<ul>\n<li><b>Client:</b> perangkat/software yang memulai permintaan. Contoh: browser di laptopmu meminta halaman web.</li>\n<li><b>Server:</b> perangkat/software yang menunggu dan menjawab permintaan. Contoh: web server, file server, DHCP server, DNS server.</li>\n<li>Satu perangkat bisa menjadi keduanya: laptopmu adalah client saat browsing, tapi bisa jadi server saat kamu share folder ke rekan kerja. Peran ini ditentukan oleh <b>software yang berjalan</b>, bukan jenis perangkatnya.</li>\n</ul>\n<h3>Network Device (Perangkat Perantara)</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Device</th><th>Layer OSI</th><th>Fungsi Inti</th></tr>\n<tr><td>Hub (usang)</td><td>1</td><td>Menyalin sinyal ke semua port — boros, sudah tidak dipakai</td></tr>\n<tr><td>Switch</td><td>2</td><td>Menghubungkan perangkat dalam satu LAN berdasarkan MAC address</td></tr>\n<tr><td>Router</td><td>3</td><td>Menghubungkan jaringan berbeda berdasarkan IP address</td></tr>\n<tr><td>Firewall</td><td>3–7</td><td>Memeriksa & menyaring traffic: allow / deny</td></tr>\n<tr><td>Access Point</td><td>2</td><td>Jembatan perangkat Wi-Fi ke jaringan kabel</td></tr>\n<tr><td>Modem / ONT</td><td>1–2</td><td>Mengubah sinyal provider (fiber/DSL) menjadi Ethernet</td></tr>\n</table></div>\n<pre>CLIENT                NETWORK DEVICE              SERVER\n[Laptop] ── kabel ── [Switch] ── [Router] ── WAN ── [Web Server]\n meminta              mengantar     mengantar        melayani\n halaman              (Layer 2)     (Layer 3)        halaman</pre>\n<h3>Mengapa Pembagian Peran Ini Penting?</h3>\n<p>Saat troubleshooting, pertanyaan pertamamu selalu: masalahnya di client, di jalur (network device), atau di server? Memeriksa dari ujung yang benar menghemat separuh waktu troubleshooting — metodologi lengkapnya di Part 28.</p>",
      "quiz": [
        {
          "q": "Perangkat yang menghubungkan jaringan berbeda berdasarkan IP address adalah…",
          "options": [
            "Hub",
            "Switch",
            "Router",
            "Access Point"
          ],
          "answer": 2
        },
        {
          "q": "Mengapa satu laptop bisa disebut client sekaligus server?",
          "options": [
            "Karena punya dua kabel",
            "Karena peran ditentukan software yang berjalan, bukan jenis perangkat",
            "Itu tidak mungkin terjadi",
            "Karena laptop selalu online"
          ],
          "answer": 1
        },
        {
          "q": "Access point bekerja terutama di layer…",
          "options": [
            "Layer 3 — meneruskan antar jaringan IP",
            "Layer 2 — menjembatani Wi-Fi ke jaringan kabel",
            "Layer 7 — menjalankan aplikasi",
            "Layer 1 saja"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Endpoint",
          "Istilah umum untuk client device di ujung jaringan."
        ],
        [
          "Host",
          "Perangkat apa pun yang memiliki IP address di jaringan."
        ],
        [
          "Intermediate Device",
          "Perangkat perantara: switch, router, firewall, AP."
        ]
      ],
      "scenario": "User mengeluh 'server file tidak bisa dibuka'. Engineer memeriksa: client sehat (PC lain bisa), jalur sehat (ping gateway OK), ternyata service file sharing di server mati. Tiga peran, tiga titik periksa — masalah ditemukan dalam 5 menit.",
      "bestPractices": "Ingat urutan periksa segitiga: client → network device → server. Jangan mulai dari tengah tanpa alasan.",
      "security": "Server hanya membuka port layanan yang dibutuhkan; network device management (SSH/WinBox) hanya dari VLAN management — dibahas penuh di Part 29.",
      "challenge": "Gambar ulang diagram client–switch–router–server dari materi, lalu beri label layer OSI di tiap device. Tambahkan 1 contoh client & server dari kehidupan sehari-hari.",
      "interviewQ": "Q: 'Switch dan router bedanya apa?' — A: Switch menghubungkan perangkat dalam satu jaringan (Layer 2, berbasis MAC); router menghubungkan jaringan yang berbeda (Layer 3, berbasis IP)."
    },
    {
      "id": "1.6",
      "title": "Network Topology — Bus, Star, Ring, Mesh, Hybrid",
      "body": "\n<p><b>Topologi</b> adalah pola bagaimana perangkat-perangkat terhubung. Pilihan topologi menentukan biaya, kecepatan, dan apa yang terjadi saat satu kabel/perangkat rusak (<i>fault tolerance</i>).</p>\n<h3>1.6.1 Bus</h3>\n<p>Semua perangkat menempel pada satu kabel utama (backbone). Murah, tapi satu kabel putus = seluruh jaringan mati, dan semua perangkat berbagi bandwidth yang sama. Teknologi lama (Ethernet 10BASE2) — hari ini hanya dipelajari sebagai sejarah.</p>\n<pre>[PC1]──┬──[PC2]──┬──[PC3]──┬──[PC4]\n       └──── satu kabel backbone ────┘</pre>\n<h3>1.6.2 Star ⭐ (Standar Modern)</h3>\n<p>Semua perangkat terhubung ke satu titik pusat (switch). Inilah topologi LAN modern. Satu kabel putus hanya melumpuhkan satu perangkat. Kelemahannya: switch pusat adalah <i>single point of failure</i>.</p>\n<pre>        [PC1]\n          |\n[PC2] — [SWITCH] — [PC3]\n          |\n        [Server]</pre>\n<h3>1.6.3 Ring</h3>\n<p>Perangkat membentuk lingkaran; data berputar searah. Dipakai pada ring fiber antar-gedung karena menyediakan dua jalur (searah & berlawanan jarum jam) untuk redundansi.</p>\n<h3>1.6.4 Mesh</h3>\n<p>Setiap node terhubung ke banyak node lain. <b>Full mesh:</b> semua saling terhubung (sangat andal, sangat mahal). <b>Partial mesh:</b> hanya node penting yang terhubung ganda — pola umum di WAN dan data center. Inti internet berbentuk mesh.</p>\n<pre> [R1]────[R2]\n  | ╲    ╱ |\n  |   ╲╱   |\n [R3]────[R4]     full mesh: setiap router punya jalur cadangan</pre>\n<h3>1.6.5 Hybrid</h3>\n<p>Campuran beberapa topologi — realita di enterprise: star di setiap lantai, ring/mesh fiber antar-gedung, mesh di WAN antar-cabang.</p>\n<div class=\"tblwrap\"><table>\n<tr><th>Topologi</th><th>Biaya</th><th>Toleransi Gangguan</th><th>Pemakaian Sekarang</th></tr>\n<tr><td>Bus</td><td>Sangat murah</td><td>Sangat rendah</td><td>Usang / sejarah</td></tr>\n<tr><td>Star</td><td>Sedang</td><td>Sedang (pusat = titik kritis)</td><td>LAN modern (standar)</td></tr>\n<tr><td>Ring</td><td>Sedang</td><td>Tinggi (jalur dua arah)</td><td>Backbone fiber metro</td></tr>\n<tr><td>Mesh</td><td>Mahal</td><td>Sangat tinggi</td><td>WAN, data center, internet</td></tr>\n<tr><td>Hybrid</td><td>Bervariasi</td><td>Bervariasi</td><td>Enterprise nyata</td></tr>\n</table></div>",
      "quiz": [
        {
          "q": "Topologi standar LAN modern adalah…",
          "options": [
            "Bus",
            "Star, dengan switch sebagai pusat",
            "Ring",
            "Full mesh"
          ],
          "answer": 1
        },
        {
          "q": "Kelemahan utama topologi star adalah…",
          "options": [
            "Terlalu mahal",
            "Switch pusat menjadi single point of failure",
            "Semua perangkat berbagi satu kabel",
            "Tidak bisa ditambah perangkat"
          ],
          "answer": 1
        },
        {
          "q": "Topologi dengan toleransi gangguan tertinggi adalah…",
          "options": [
            "Bus",
            "Star",
            "Mesh",
            "Ring satu arah"
          ],
          "answer": 2
        }
      ],
      "terms": [
        [
          "Fault Tolerance",
          "Kemampuan jaringan tetap hidup saat ada komponen gagal."
        ],
        [
          "Backbone",
          "Jalur utama berkapasitas besar yang menghubungkan segmen jaringan."
        ],
        [
          "Single Point of Failure",
          "Satu komponen yang jika gagal, melumpuhkan sistem."
        ]
      ],
      "scenario": "Kantor lama memakai satu switch pusat tanpa cadangan. Suatu pagi switch itu mati: 60 karyawan tidak bisa bekerja setengah hari. Setelah itu desain diganti: dua core switch (partial mesh) — satu mati, jaringan tetap hidup.",
      "bestPractices": "Untuk titik kritis, hindari single point of failure: gandakan device/link penting. Untuk access layer, star sederhana sudah cukup dan ekonomis.",
      "security": "Topologi mesh memberi jalur alternatif — pastikan jalur cadangan itu juga terkonfigurasi aman, bukan 'pintu belakang' yang lupa diawasi.",
      "challenge": "Rancang topologi hybrid untuk kantor 2 lantai + 1 gudang: tentukan topologi per lokasi dan antar-lokasi, serta titik single point of failure yang masih tersisa.",
      "interviewQ": "Q: 'Mengapa star menang atas bus?' — A: Isolasi gangguan per perangkat, performa per port penuh, dan pengelolaan terpusat — dengan harga satu titik kritis di pusat yang dimitigasi redundansi."
    },
    {
      "id": "1.7",
      "title": "Physical vs Logical Topology",
      "body": "\n<p>Dua jaringan bisa terlihat sama secara fisik tetapi berperilaku berbeda secara logis. Membedakan keduanya adalah keterampilan dasar membaca diagram jaringan.</p>\n<ul>\n<li><b>Physical topology:</b> bagaimana perangkat terhubung secara nyata — kabelnya ditarik ke mana, port-nya menempel di mana. Ini yang kamu lihat di ruang server.</li>\n<li><b>Logical topology:</b> bagaimana data sebenarnya mengalir — melewati VLAN apa, subnet apa, route ke mana. Ini yang ditentukan oleh konfigurasi.</li>\n</ul>\n<h3>Contoh Nyata</h3>\n<p>Secara fisik, 20 PC di kantor menempel ke satu switch (star fisik). Tetapi secara logis, switch itu dikonfigurasi dengan 3 VLAN:</p>\n<pre>FISIK (satu switch, star):\n        ┌── PC Akuntansi\n[SW] ───┼── PC Marketing\n        └── PC IT\n\nLOGIS (tiga jaringan terpisah di switch yang sama):\nVLAN 10 Akuntansi : 192.168.10.0/24  ─┐\nVLAN 20 Marketing : 192.168.20.0/24  ─┼─ tidak bisa saling akses langsung,\nVLAN 99 IT        : 192.168.99.0/24  ─┘  harus lewat router/firewall</pre>\n<p>PC Akuntansi dan PC Marketing terhubung ke switch fisik yang sama, tetapi secara logis mereka berada di jaringan yang berbeda total — seolah-olah memakai switch terpisah.</p>\n<div class=\"callout blue\"><div class=\"t\">Mengapa Ini Penting?</div><p style=\"margin:4px 0 0\">Dokumentasi enterprise selalu punya dua diagram: <i>physical diagram</i> (untuk teknisi lapangan: kabel & port) dan <i>logical diagram</i> (untuk engineer: VLAN, IP, routing). Troubleshooting tanpa keduanya seperti mencari alamat tanpa peta. Keduanya dilatih di Part 38 (Documentation).</p></div>\n<p>Contoh lain: jaringan Wi-Fi mesh di rumah terlihat \"tanpa kabel\" secara fisik, tetapi secara logis tetap membentuk topologi star/mesh antar-node. Dan VPN (Part 31) menciptakan topologi logis point-to-point di atas fisik internet yang mesh.</p>",
      "quiz": [
        {
          "q": "Dua PC terhubung ke switch fisik yang sama tetapi beda VLAN. Secara logis mereka…",
          "options": [
            "Tetap satu jaringan",
            "Berada di jaringan berbeda dan tidak bisa langsung berkomunikasi",
            "Otomatis bisa saling akses",
            "Berbagi IP yang sama"
          ],
          "answer": 1
        },
        {
          "q": "Logical topology ditentukan oleh…",
          "options": [
            "Warna kabel",
            "Konfigurasi perangkat (VLAN, subnet, routing)",
            "Letak rak server",
            "Merk perangkat"
          ],
          "answer": 1
        },
        {
          "q": "Diagram yang dipakai teknisi lapangan untuk menelusuri kabel adalah…",
          "options": [
            "Logical diagram",
            "Physical diagram",
            "Routing table",
            "IP plan"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Physical Diagram",
          "Gambar jaringan sesuai kabel & port nyata."
        ],
        [
          "Logical Diagram",
          "Gambar jaringan sesuai aliran data: VLAN, subnet, routing."
        ],
        [
          "VLAN",
          "Virtual LAN — pemisahan jaringan logis di perangkat fisik yang sama (Part 09)."
        ]
      ],
      "scenario": "Admin baru heran: 'PC saya satu switch dengan server, kok tidak bisa ping?' Jawabannya ada di logical topology: mereka beda VLAN. Diagram fisik bilang dekat; diagram logis bilang beda jaringan — dan yang menentukan aliran data adalah yang logis.",
      "bestPractices": "Selalu buat dan perbarui dua diagram: fisik dan logis. Setiap perubahan konfigurasi = perubahan diagram logis; setiap perubahan kabel = perubahan diagram fisik.",
      "security": "Jangan mengandalkan 'jauh secara fisik' sebagai keamanan. Pemisahan yang sah adalah pemisahan logis (VLAN + firewall policy).",
      "challenge": "Dari jaringan rumahmu: gambar diagram fisiknya (perangkat & kabel), lalu diagram logisnya (siapa satu subnet dengan siapa). Tulis 2 perbedaan yang kamu temukan.",
      "interviewQ": "Q: 'Satu switch bisa jadi berapa jaringan?' — A: Secara logis sebanyak VLAN yang dikonfigurasi — setiap VLAN adalah jaringan/subnet/broadcast domain tersendiri."
    },
    {
      "id": "1.8",
      "title": "Network Segmentation",
      "body": "\n<p><b>Segmentasi jaringan</b> adalah praktik membagi satu jaringan besar menjadi beberapa jaringan kecil (segmen) yang terpisah. Setiap segmen punya subnet/VLAN sendiri, dan komunikasi antar-segmen harus melewati router atau firewall yang bisa menyaringnya.</p>\n<h3>Mengapa Satu Jaringan Rata (Flat Network) Berbahaya?</h3>\n<ul>\n<li><b>Keamanan:</b> satu PC karyawan terinfeksi malware → malware bebas menyebar ke server keuangan. Tidak ada pagar di antaranya.</li>\n<li><b>Performa:</b> semua broadcast dari ratusan perangkat diterima semua perangkat lain (lihat 1.9).</li>\n<li><b>Pengelolaan:</b> sulit menerapkan kebijakan berbeda — tamu Wi-Fi seharusnya tidak pernah satu jaringan dengan server.</li>\n</ul>\n<h3>Contoh Desain Segmentasi Enterprise</h3>\n<p>Desain ini dipakai konsisten sepanjang kurikulum (Part 20 akan membangunnya):</p>\n<div class=\"tblwrap\"><table>\n<tr><th>VLAN</th><th>Segmen</th><th>Subnet</th><th>Kebijakan</th></tr>\n<tr><td>10</td><td>CCTV</td><td>192.168.10.0/24</td><td>Hanya boleh diakses NVR & IT — CCTV tidak boleh ke internet langsung</td></tr>\n<tr><td>20</td><td>OFFICE</td><td>192.168.20.0/24</td><td>User kantor — boleh ke server & internet</td></tr>\n<tr><td>30</td><td>SERVER</td><td>192.168.30.0/24</td><td>Server internal — akses masuk sangat dibatasi</td></tr>\n<tr><td>40</td><td>GUEST</td><td>192.168.40.0/24</td><td>Tamu — hanya internet, dilarang ke semua segmen internal</td></tr>\n<tr><td>99</td><td>MANAGEMENT</td><td>192.168.99.0/24</td><td>Khusus admin mengelola device — paling terproteksi</td></tr>\n</table></div>\n<pre>                 [FIREWALL]  ← polisi antar-segmen\n        ┌────────┬────┴────┬──────────┐\n     VLAN 10  VLAN 20  VLAN 30     VLAN 40\n      CCTV    OFFICE   SERVER       GUEST\n   (terisolasi) (user) (sensitif)  (internet saja)</pre>\n<h3>Prinsipnya: Least Privilege</h3>\n<p>Setiap segmen hanya diberi akses seminimal yang dibutuhkan. Prinsip <i>least privilege</i> ini adalah fondasi network security (Part 29) — dan segmentasi adalah cara menerapkannya di level jaringan.</p>",
      "quiz": [
        {
          "q": "Tujuan utama segmentasi jaringan adalah…",
          "options": [
            "Membuat jaringan lebih murah",
            "Membatasi penyebaran gangguan & serangan, serta mengatur akses antar-kelompok",
            "Menambah kecepatan kabel",
            "Mengurangi jumlah switch"
          ],
          "answer": 1
        },
        {
          "q": "Pada desain standar kurikulum ini, segmen GUEST (VLAN 40) seharusnya…",
          "options": [
            "Bisa mengakses semua server",
            "Hanya boleh ke internet, tidak ke segmen internal",
            "Satu jaringan dengan MANAGEMENT",
            "Tidak perlu firewall"
          ],
          "answer": 1
        },
        {
          "q": "Prinsip keamanan di balik segmentasi adalah…",
          "options": [
            "Trust everyone",
            "Least privilege — akses seminimal yang dibutuhkan",
            "Semakin terbuka semakin aman",
            "Semua VLAN digabung"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Flat Network",
          "Jaringan tanpa segmentasi — semua perangkat satu segmen besar."
        ],
        [
          "Least Privilege",
          "Hak akses seminimal mungkin sesuai kebutuhan."
        ],
        [
          "Segment",
          "Bagian jaringan yang terpisah secara logis (subnet/VLAN)."
        ]
      ],
      "scenario": "Sebuah rumah sakit memisahkan jaringan alat medis, administrasi, dan Wi-Fi pasien. Saat ransomware menyerang PC administrasi, alat medis dan data pasien tetap aman karena beda segmen dan dibatasi firewall. Tanpa segmentasi, ceritanya bisa sangat berbeda.",
      "bestPractices": "Segmentasikan berdasarkan fungsi & tingkat kepercayaan (trust level), bukan berdasarkan lantai/gedung semata. Mulai dari: user, server, guest, IoT/CCTV, management.",
      "security": "Segmentasi tanpa firewall policy antar-segmen yang ketat hanya separuh pekerjaan — antar-VLAN tetap harus disaring, bukan dibuka semua.",
      "challenge": "Untuk kantor kecil (10 PC kasir, 4 CCTV, 1 server kasir, Wi-Fi tamu): buat tabel segmentasimu sendiri (VLAN ID, subnet, kebijakan) mengikuti pola sub-bab ini.",
      "interviewQ": "Q: 'Mengapa guest Wi-Fi tidak boleh satu VLAN dengan server?' — A: Tamu adalah pihak tak terpercaya; satu segmen berarti mereka sejajar dengan server tanpa penyaring — segmentasi + policy 'internet only' menutup risiko itu."
    },
    {
      "id": "1.9",
      "title": "Broadcast Domain",
      "body": "\n<p><b>Broadcast</b> adalah paket yang ditujukan ke <i>semua</i> perangkat: alamat tujuannya <code>FF:FF:FF:FF:FF:FF</code> (Layer 2) atau alamat broadcast subnet seperti <code>192.168.20.255</code> (Layer 3). Contoh pemakainya: ARP (\"siapa pemilik IP 192.168.20.1?\") dan DHCP Discover (\"ada server DHCP di sini?\").</p>\n<p><b>Broadcast domain</b> adalah wilayah jangkauan sebuah broadcast — kumpulan perangkat yang akan menerima broadcast yang sama.</p>\n<h3>Siapa yang Meneruskan / Menghentikan Broadcast?</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Device</th><th>Perilaku terhadap Broadcast</th><th>Akibat ke Broadcast Domain</th></tr>\n<tr><td>Hub</td><td>Meneruskan ke semua port</td><td>Tidak membagi</td></tr>\n<tr><td>Switch</td><td>Meneruskan (flood) ke semua port dalam VLAN yang sama</td><td>Satu VLAN = satu broadcast domain</td></tr>\n<tr><td>Router / Firewall / L3 Switch</td><td><b>Tidak meneruskan</b> broadcast ke jaringan lain</td><td><b>Memisahkan</b> broadcast domain</td></tr>\n</table></div>\n<pre>Satu broadcast domain besar (flat, 300 PC):\n[PC] [PC] [PC] ... 300 perangkat — 1 broadcast ARP didengar 299 perangkat lain\n\nSetelah segmentasi (3 VLAN):\nVLAN 20 (100 PC) | VLAN 30 (20 server) | VLAN 40 (tamu)\nbroadcast ARP di VLAN 20 hanya didengar 99 perangkat di VLAN 20</pre>\n<h3>Mengapa Broadcast Domain Besar Itu Buruk?</h3>\n<ul>\n<li>Setiap broadcast mengganggu semua perangkat: CPU setiap host harus memprosesnya meski bukan untuknya.</li>\n<li>Risiko <b>broadcast storm</b>: loop di jaringan membuat broadcast berputar dan berlipat ganda sampai jaringan lumpuh (dicegah STP — Part 10).</li>\n<li>Semua perangkat bisa \"mengintip\" permintaan ARP/DHCP segmen lain — buruk untuk keamanan.</li>\n</ul>\n<div class=\"callout blue\"><div class=\"t\">Aturan Emas</div><p style=\"margin:4px 0 0\"><b>1 VLAN = 1 subnet = 1 broadcast domain.</b> Router (atau firewall/L3 switch) adalah batasnya. Aturan ini akan kamu pakai terus sampai Final Enterprise Lab.</p></div>",
      "quiz": [
        {
          "q": "Perangkat yang memisahkan broadcast domain adalah…",
          "options": [
            "Hub",
            "Switch Layer 2",
            "Router / firewall / L3 switch",
            "Access point"
          ],
          "answer": 2
        },
        {
          "q": "Hubungan yang benar adalah…",
          "options": [
            "1 switch = 1 broadcast domain selalu",
            "1 VLAN = 1 subnet = 1 broadcast domain",
            "Broadcast diteruskan router ke semua jaringan",
            "Broadcast hanya ada di Wi-Fi"
          ],
          "answer": 1
        },
        {
          "q": "Mengapa broadcast domain yang terlalu besar merugikan?",
          "options": [
            "Kabel menjadi panas",
            "Setiap broadcast diproses semua host & rawan broadcast storm",
            "IP address menjadi habis",
            "Switch menjadi mahal"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Broadcast",
          "Paket ke semua perangkat dalam satu domain."
        ],
        [
          "Flooding",
          "Switch meneruskan frame ke semua port saat tujuan tak dikenal / broadcast."
        ],
        [
          "Broadcast Storm",
          "Badai broadcast akibat loop yang melumpuhkan jaringan."
        ]
      ],
      "scenario": "Loop kabel di satu ruang meeting membuat broadcast storm: dalam hitungan menit seluruh lantai tidak bisa bekerja, switch berkedip serempak. Karena jaringan tersegmentasi per VLAN, lantai lain dan server tetap aman — badainya terkurung dalam satu broadcast domain.",
      "bestPractices": "Jaga ukuran broadcast domain tetap wajar (± di bawah 250 host per VLAN untuk kantor umum) dan selalu aktifkan proteksi loop (STP) — Part 10.",
      "security": "Broadcast membawa informasi (ARP/DHCP) yang bisa disalahgunakan (ARP spoofing). Segmentasi kecil membatasi radius serangannya.",
      "challenge": "Hitung: jaringan flat 500 host vs 5 VLAN @100 host. Saat 1 host mengirim broadcast, berapa host yang terganggu di masing-masing desain? Tulis perhitungannya.",
      "interviewQ": "Q: '1 VLAN = ?' — A: 1 subnet = 1 broadcast domain. Router/L3 adalah batasnya; switch meneruskan broadcast ke semua port dalam VLAN yang sama."
    },
    {
      "id": "1.10",
      "title": "Collision Domain",
      "body": "\n<p><b>Collision</b> (tabrakan) terjadi ketika dua perangkat mengirim data pada media bersama di saat yang bersamaan, sehingga sinyalnya bertabrakan dan rusak. <b>Collision domain</b> adalah wilayah jaringan tempat collision masih mungkin terjadi.</p>\n<h3>Zaman Hub: Satu Collision Domain Raksasa</h3>\n<p>Hub hanya menyalin sinyal listrik ke semua port. Semua perangkat berbagi satu media → mereka memakai mekanisme <b>CSMA/CD</b>: dengarkan dulu, kirim jika kosong, jika tabrakan — berhenti, tunggu acak, kirim ulang. Semakin banyak perangkat, semakin sering tabrakan, semakin lambat jaringan. Inilah alasan hub punah.</p>\n<h3>Zaman Switch: Collision Domain per Port</h3>\n<pre>HUB (1 collision domain):\n[PC1][PC2][PC3] ── [HUB] ── semua berbagi, tabrakan sering\n\nSWITCH (collision domain per port, full-duplex):\n[PC1] ──link sendiri── [SWITCH] ──link sendiri── [PC2]\nsetiap link point-to-point: kirim & terima bersamaan tanpa tabrakan</pre>\n<div class=\"tblwrap\"><table>\n<tr><th>Aspek</th><th>Hub</th><th>Switch</th></tr>\n<tr><td>Collision domain</td><td>1 untuk semua port</td><td>1 per port</td></tr>\n<tr><td>Mode komunikasi</td><td>Half-duplex (bergantian)</td><td>Full-duplex (bersamaan dua arah)</td></tr>\n<tr><td>CSMA/CD</td><td>Wajib dipakai</td><td>Tidak diperlukan di link full-duplex</td></tr>\n<tr><td>Broadcast domain</td><td>1</td><td>1 per VLAN</td></tr>\n</table></div>\n<div class=\"callout\"><div class=\"t\">Masih Relevan di Era Wi-Fi</div><p style=\"margin:4px 0 0\">Wi-Fi adalah media bersama (udara) dan half-duplex — collision masih nyata di wireless, diatur dengan CSMA/CA (versi \"menghindar\", bukan \"mendeteksi\"). Jadi konsep ini belum mati: ia pindah ke wireless. Di kabel modern dengan switch, collision domain praktis selesai per port.</p></div>\n<p><b>Ringkasan membedakan dengan 1.9:</b> collision domain dipisahkan oleh <i>switch (per port)</i>; broadcast domain dipisahkan oleh <i>router (per VLAN/subnet)</i>. Pertanyaan interview klasik — jangan tertukar.</p>",
      "quiz": [
        {
          "q": "Switch memengaruhi collision domain dengan cara…",
          "options": [
            "Menggabungkan semua port jadi satu",
            "Memberi collision domain tersendiri per port",
            "Tidak ada hubungannya",
            "Menghapus broadcast"
          ],
          "answer": 1
        },
        {
          "q": "Mengapa hub membuat jaringan lambat saat ramai?",
          "options": [
            "Hub memakai listrik besar",
            "Semua port berbagi satu collision domain sehingga sering tabrakan (CSMA/CD)",
            "Hub tidak punya lampu indikator",
            "Hub hanya mendukung 2 PC"
          ],
          "answer": 1
        },
        {
          "q": "Pasangan yang benar adalah…",
          "options": [
            "Collision dipisah router, broadcast dipisah switch",
            "Collision dipisah switch per port, broadcast dipisah router per VLAN",
            "Keduanya dipisah hub",
            "Keduanya tidak bisa dipisah"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "CSMA/CD",
          "Mekanisme Ethernet lama: dengar, kirim, deteksi tabrakan, ulangi."
        ],
        [
          "Half-Duplex",
          "Komunikasi bergantian satu arah pada satu waktu."
        ],
        [
          "Full-Duplex",
          "Kirim dan terima bersamaan — standar link switch modern."
        ]
      ],
      "scenario": "Di jaringan warisan, satu segmen masih memakai hub untuk 8 PC gudang. Setiap jam sibuk, aplikasi gudang terasa 'tersendat'. Diganti switch seharga beberapa ratus ribu: keluhan hilang. Itulah beda satu collision domain raksasa vs per port.",
      "bestPractices": "Pastikan link switch modern bernegosiasi full-duplex; duplex mismatch adalah sisa masalah collision yang masih muncul di lapangan.",
      "security": "Hub menyiarkan semua traffic ke semua port — siapa pun yang menancap bisa mengintip (sniffing). Alasan keamanan lain hub harus punah.",
      "challenge": "Jelaskan dengan kalimatmu sendiri mengapa CSMA/CD tidak diperlukan lagi pada link switch full-duplex, dan di media apa konsep collision masih hidup.",
      "interviewQ": "Q: 'Bedakan collision domain dan broadcast domain.' — A: Collision domain dipisah switch per port; broadcast domain dipisah router per VLAN/subnet."
    },
    {
      "id": "1.11",
      "title": "Bandwidth",
      "body": "\n<p><b>Bandwidth</b> adalah kapasitas maksimum data yang bisa melewati sebuah jalur dalam satu detik, diukur dalam <b>bit per second (bps)</b>: Kbps, Mbps, Gbps. Ini adalah angka <i>teoretis</i> pada label kemasan — \"internet 100 Mbps\", \"kabel Cat6 = 1 Gbps\", \"Wi-Fi 6 hingga 9,6 Gbps\".</p>\n<h3>Analogi Pipa Air</h3>\n<p>Bandwidth adalah <b>diameter pipa</b>. Pipa besar (1 Gbps) bisa mengalirkan air jauh lebih banyak daripada pipa kecil (10 Mbps). Tetapi diameter pipa bukan kecepatan aliran sesungguhnya — itu dibahas di throughput (1.12).</p>\n<div class=\"tblwrap\"><table>\n<tr><th>Media / Teknologi</th><th>Bandwidth Maksimum</th></tr>\n<tr><td>Fast Ethernet (Cat5)</td><td>100 Mbps</td></tr>\n<tr><td>Gigabit Ethernet (Cat5e/6)</td><td>1 Gbps</td></tr>\n<tr><td>10 Gigabit Ethernet (Cat6A / fiber)</td><td>10 Gbps</td></tr>\n<tr><td>SFP+ fiber</td><td>10 Gbps</td></tr>\n<tr><td>QSFP fiber</td><td>40–100 Gbps</td></tr>\n<tr><td>Paket internet rumahan umum</td><td>10–300 Mbps</td></tr>\n</table></div>\n<h3>Prinsip Bottleneck (Leher Botol)</h3>\n<pre>PC [1 Gbps] ── Switch [1 Gbps] ── Router ── Internet [50 Mbps]\n                                                     ▲\n                              bandwidth end-to-end = yang TERKECIL = 50 Mbps</pre>\n<p>Bandwidth efektif sebuah jalur ditentukan oleh <b>link paling sempit</b> di sepanjang perjalanan paket. Meng-upgrade kabel PC ke 10 Gbps tidak akan mempercepat download jika paket internetnya hanya 50 Mbps.</p>\n<div class=\"callout\"><div class=\"t\">Bit vs Byte — Jebakan Klasik</div><p style=\"margin:4px 0 0\">Bandwidth diukur dalam <b>bit</b> (Mbps), ukuran file dalam <b>byte</b> (MB). 1 byte = 8 bit. Internet 100 Mbps ≈ download maksimal ±12,5 MB/s. Salah membedakan ini adalah sumber komplain \"katanya 100 Mbps kok download cuma 12?\" paling umum di NOC.</p></div>",
      "quiz": [
        {
          "q": "Bandwidth adalah…",
          "options": [
            "Kecepatan download yang selalu tercapai",
            "Kapasitas maksimum teoretis jalur per detik",
            "Waktu tempuh paket",
            "Jumlah perangkat terhubung"
          ],
          "answer": 1
        },
        {
          "q": "PC 1 Gbps — switch 1 Gbps — internet 50 Mbps. Bandwidth end-to-end ke internet adalah…",
          "options": [
            "1 Gbps",
            "525 Mbps",
            "50 Mbps — ditentukan link terkecil",
            "2,05 Gbps"
          ],
          "answer": 2
        },
        {
          "q": "Internet 100 Mbps setara dengan kecepatan unduh file maksimum sekitar…",
          "options": [
            "100 MB/s",
            "12,5 MB/s (100 ÷ 8)",
            "800 MB/s",
            "1 MB/s"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "bps",
          "Bit per second — satuan bandwidth."
        ],
        [
          "Bottleneck",
          "Link tersempit yang menentukan kapasitas seluruh jalur."
        ],
        [
          "Full vs Shared",
          "Bandwidth bisa dedicated (leased) atau dibagi antar pengguna (shared/broadband rumah)."
        ]
      ],
      "scenario": "Manajemen bertanya: 'Perlu upgrade internet ke 500 Mbps?' Data monitoring menunjukkan puncak pemakaian 3 bulan terakhir hanya 210 Mbps dari paket 300 Mbps. Jawaban engineer berbasis data: belum perlu — anggaran dialihkan ke redundansi ISP kedua.",
      "bestPractices": "Ukur sebelum membeli: keputusan bandwidth harus dari data utilization (persentil puncak), bukan dari keluhan sesaat.",
      "security": "Bandwidth yang terlalu longgar tanpa QoS & firewall tetap berisiko: satu host terinfeksi bisa menghabiskan seluruh pipa untuk traffic jahat (exfiltrasi/spam).",
      "challenge": "Hitung waktu download file 2 GB pada link 20 Mbps, 100 Mbps, dan 1 Gbps (dalam menit/detik). Ingat: bagi dengan 8, bukan dengan 1.",
      "interviewQ": "Q: 'Internet 200 Mbps, download kok cuma 22 MB/s?' — A: Itu benar: 200 Mbps ÷ 8 = 25 MB/s teoretis; 22 MB/s adalah throughput nyata setelah overhead."
    },
    {
      "id": "1.12",
      "title": "Throughput",
      "body": "\n<p><b>Throughput</b> adalah jumlah data yang <i>benar-benar berhasil</i> melewati jaringan dalam praktik, pada waktu pengukuran tertentu. Jika bandwidth adalah diameter pipa, throughput adalah <b>air yang benar-benar keluar dari keran</b>.</p>\n<h3>Mengapa Throughput Selalu di Bawah Bandwidth?</h3>\n<ul>\n<li><b>Overhead protokol:</b> setiap paket membawa header Ethernet/IP/TCP (±5–10% kapasitas) — seperti truk yang sebagian baknya terpakai rangka.</li>\n<li><b>Berbagi jalur:</b> link 1 Gbps yang dipakai 20 user bersamaan tidak memberi 1 Gbps ke setiap user.</li>\n<li><b>Retransmisi:</b> paket hilang (packet loss) harus dikirim ulang, memakan kapasitas.</li>\n<li><b>Kepadatan & interferensi:</b> terutama di Wi-Fi; juga duplex mismatch dan error di kabel.</li>\n<li><b>Batas perangkat:</b> CPU router/firewall bisa membatasi di bawah kapasitas link-nya.</li>\n</ul>\n<pre>Bandwidth link     : 1.000 Mbps  (label)\nThroughput terukur :   940 Mbps  (speedtest kabel, kondisi ideal)\nThroughput jam sibuk:  310 Mbps  (dipakai bersama + retransmisi)\nSelisihnya BUKAN penipuan — itu overhead + sharing + kondisi nyata.</pre>\n<h3>Cara Mengukur</h3>\n<ul>\n<li><code>iperf3</code> — tool standar mengukur throughput antar dua titik di jaringanmu sendiri (akan dipakai di lab-lab berikutnya).</li>\n<li>Speedtest — mengukur throughput ke server internet (terpengaruh banyak faktor di luar LAN-mu).</li>\n<li>Monitoring interface (SNMP → Zabbix/Grafana, Part 23–27) — throughput real-time per port device.</li>\n</ul>\n<div class=\"callout blue\"><div class=\"t\">Cara Bicara yang Benar ke User</div><p style=\"margin:4px 0 0\">\"Paketnya 100 Mbps\" = bandwidth. \"Yang Bapak dapat sekarang 82 Mbps\" = throughput. Engineer yang paham bedanya tidak akan menjanjikan throughput sebesar bandwidth — dan bisa menjelaskan penyebab selisihnya.</p></div>",
      "quiz": [
        {
          "q": "Throughput adalah…",
          "options": [
            "Angka pada label kemasan perangkat",
            "Data yang benar-benar berhasil lewat dalam praktik saat diukur",
            "Diameter pipa jaringan",
            "Jumlah user dalam jaringan"
          ],
          "answer": 1
        },
        {
          "q": "Faktor berikut yang MENURUNKAN throughput, kecuali…",
          "options": [
            "Overhead header protokol",
            "Packet loss & retransmisi",
            "Link dipakai bersama banyak user",
            "Bandwidth link yang lebih besar dari kebutuhan"
          ],
          "answer": 3
        },
        {
          "q": "Tool standar untuk mengukur throughput di jaringan sendiri adalah…",
          "options": [
            "ping saja",
            "iperf3",
            "Notepad",
            "Task Manager"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Overhead",
          "Byte tambahan (header protokol) yang ikut terkirim selain data asli."
        ],
        [
          "Retransmisi",
          "Pengiriman ulang paket yang hilang/rusak."
        ],
        [
          "iperf3",
          "Tool ukur throughput antar dua host — standar de facto engineer."
        ]
      ],
      "scenario": "Dua kantor dengan paket internet sama-sama 100 Mbps: kantor A speedtest 92 Mbps, kantor B hanya 35 Mbps. Investigasi: di B, kabel ke router ternyata bernegosiasi 100 Mbps half-duplex dan penuh error. Throughput mengungkap kesehatan nyata yang disembunyikan label bandwidth.",
      "bestPractices": "Biasakan baseline: ukur throughput tiap link penting saat sehat (iperf3), simpan hasilnya. Saat ada komplain, kamu punya pembanding objektif.",
      "security": "Throughput yang anjlok tiba-tiba bisa jadi gejala keamanan (device dipakai pihak lain / DDoS) — bukan selalu gejala teknis.",
      "challenge": "Lakukan speedtest dari 2 perangkat berbeda di jaringanmu, catat hasilnya, dan tulis 3 faktor yang mungkin menyebabkan selisih throughput antar keduanya.",
      "interviewQ": "Q: 'Mengapa throughput tidak pernah sama dengan bandwidth?' — A: Overhead protokol, sharing, retransmisi, dan batas kemampuan device selalu memakan sebagian kapasitas teoretis."
    },
    {
      "id": "1.13",
      "title": "Latency",
      "body": "\n<p><b>Latency</b> adalah waktu yang dibutuhkan satu paket untuk berjalan dari sumber ke tujuan, diukur dalam <b>milidetik (ms)</b>. Yang biasa dilaporkan adalah <i>round-trip time</i> (RTT): pergi + pulang, persis angka yang ditampilkan perintah <code>ping</code>.</p>\n<h3>Dari Apa Saja Latency Terdiri?</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Komponen</th><th>Penjelasan</th><th>Contoh</th></tr>\n<tr><td>Propagation delay</td><td>Waktu sinyal merambat di media — dibatasi kecepatan cahaya</td><td>Jakarta–Surabaya ±5 ms; Jakarta–Eropa ±150 ms. Tidak bisa \"diperbaiki\", ini fisika</td></tr>\n<tr><td>Transmission delay</td><td>Waktu mendorong seluruh paket ke kabel (ukuran paket ÷ bandwidth)</td><td>Paket besar di link lambat = delay besar</td></tr>\n<tr><td>Queuing delay</td><td>Waktu paket antre di buffer router/switch yang sibuk</td><td>Jam sibuk kantor: antrean panjang → latency naik</td></tr>\n<tr><td>Processing delay</td><td>Waktu device memeriksa header, routing, firewall</td><td>Firewall dengan inspeksi berat menambah delay</td></tr>\n</table></div>\n<h3>Patokan Nilai</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Konteks</th><th>Latency Sehat</th></tr>\n<tr><td>Dalam satu LAN</td><td>&lt; 1 ms</td></tr>\n<tr><td>Ke gateway / server sekota</td><td>1–10 ms</td></tr>\n<tr><td>Antar pulau (Indonesia)</td><td>20–60 ms</td></tr>\n<tr><td>Antar benua</td><td>150–300 ms</td></tr>\n<tr><td>VoIP / video call nyaman</td><td>&lt; 150 ms (satu arah)</td></tr>\n<tr><td>Game online kompetitif</td><td>&lt; 50 ms terasa responsif</td></tr>\n</table></div>\n<div class=\"callout\"><div class=\"t\">Bandwidth Besar ≠ Latency Kecil</div><p style=\"margin:4px 0 0\">Kesalahpahaman paling umum. Truk kontainer (bandwidth besar) yang mengirim banyak barang sekaligus tidak membuat satu surat sampai lebih cepat dari kurir motor (latency kecil). Game dan VoIP butuh latency kecil; download file besar butuh bandwidth besar. Keduanya independen.</p></div>\n<pre>$ ping 192.168.20.1\nReply from 192.168.20.1: bytes=32 time&lt;1ms TTL=64   ← RTT &lt; 1 ms: sehat, satu LAN\nReply from 8.8.8.8: bytes=32 time=28ms TTL=117       ← 28 ms: wajar ke server internet</pre>",
      "quiz": [
        {
          "q": "Latency diukur dengan perintah ping sebagai…",
          "options": [
            "Bandwidth",
            "RTT (round-trip time) dalam ms",
            "Jumlah hop saja",
            "Ukuran paket"
          ],
          "answer": 1
        },
        {
          "q": "Mengapa latency Jakarta–Eropa tidak bisa dibuat 1 ms?",
          "options": [
            "Kabelnya kurang bagus",
            "Dibatasi propagation delay — kecepatan cahaya & jarak fisik",
            "ISP membatasi",
            "Router terlalu tua"
          ],
          "answer": 1
        },
        {
          "q": "Aplikasi yang paling sensitif terhadap latency adalah…",
          "options": [
            "Download file besar",
            "Backup malam hari",
            "VoIP & game online real-time",
            "Email"
          ],
          "answer": 2
        }
      ],
      "terms": [
        [
          "RTT",
          "Round-Trip Time — waktu paket pergi dan kembali (angka ping)."
        ],
        [
          "Propagation Delay",
          "Delay rambatan sinyal — batas fisika kecepatan cahaya."
        ],
        [
          "Queuing Delay",
          "Delay antre di buffer device yang sibuk."
        ]
      ],
      "scenario": "Perusahaan membuka cabang dengan satelit (VSAT) karena tak ada fiber: bandwidth cukup 20 Mbps, tapi latency 600 ms. Aplikasi database terasa sangat lambat meski 'internet kencang' — karena setiap klik butuh banyak round-trip. Solusinya bukan tambah bandwidth, melainkan desain aplikasi & caching lokal.",
      "bestPractices": "Untuk site jauh, minimalkan round-trip: letakkan server/cache dekat pengguna; jangan memaksakan aplikasi 'chatty' melewati link latency tinggi.",
      "security": "Latency yang tiba-tiba naik bisa mengindikasikan jalur dibelokkan (route tidak wajar) — perubahan baseline RTT layak dicurigai, bukan hanya soal kenyamanan.",
      "challenge": "Ping gateway-mu, lalu ping 8.8.8.8, lalu ping server luar negeri (mis. server di Eropa). Catat ketiganya dan jelaskan komponen delay yang membuat mereka berbeda.",
      "interviewQ": "Q: 'Bandwidth 1 Gbps vs latency 1 ms — mana untuk game?' — A: Latency. Game mengirim paket kecil tapi sering; yang menentukan responsivitas adalah waktu tempuh (RTT), bukan kapasitas pipa."
    },
    {
      "id": "1.14",
      "title": "Jitter",
      "body": "\n<p><b>Jitter</b> adalah <b>variasi</b> latency antar paket. Latency yang stabil 80 ms jauh lebih baik daripada latency yang meloncat-loncat 20 → 150 → 40 → 200 ms — rata-ratanya mungkin sama (92 ms), tetapi pengalaman penggunanya sangat berbeda.</p>\n<pre>Stabil (jitter rendah):\nPaket:  1    2    3    4    5\nms   : 80   81   79   80   82     → suara jernih, video mulus\n\nTidak stabil (jitter tinggi):\nPaket:  1    2    3     4    5\nms   : 25   140  30    190  45    → suara patah-patah, video macet-macet</pre>\n<h3>Mengapa Jitter Terjadi?</h3>\n<ul>\n<li><b>Antrean yang berubah-ubah:</b> router sibuk → paket ke-1 langsung lewat, paket ke-2 antre lama, paket ke-3 lewat cepat lagi.</li>\n<li><b>Jalur berubah:</b> routing dinamis memindahkan sebagian paket ke jalur berbeda dengan latency berbeda.</li>\n<li><b>Wi-Fi:</b> interferensi & retransmisi nirkabel membuat waktu tiba paket tidak menentu.</li>\n<li><b>Beban device:</b> CPU firewall/router yang naik-turun (mis. ada proses backup berjalan).</li>\n</ul>\n<h3>Siapa yang Paling Menderita?</h3>\n<p>Aplikasi <b>real-time</b>: VoIP, video conference, game online, live streaming. Alasannya sederhana: suara/video diputar sesuai jadwal. Paket yang datang terlambat sama buruknya dengan paket hilang — ia \"melewatkan gilirannya\" diputar. Aplikasi non-real-time (download, email) tidak peduli jitter karena data ditunggu sampai lengkap.</p>\n<div class=\"tblwrap\"><table>\n<tr><th>Parameter</th><th>Baik untuk VoIP</th><th>Buruk</th></tr>\n<tr><td>Latency (satu arah)</td><td>&lt; 150 ms</td><td>&gt; 300 ms</td></tr>\n<tr><td>Jitter</td><td>&lt; 30 ms</td><td>&gt; 50 ms</td></tr>\n<tr><td>Packet loss</td><td>&lt; 1%</td><td>&gt; 3%</td></tr>\n</table></div>\n<p><b>Solusi di level jaringan:</b> QoS (Quality of Service) — memberi prioritas antrean untuk traffic real-time (voice/video) di atas traffic biasa. Di MikroTik nanti ini dikerjakan dengan Queue & Mangle (Part 13).</p>",
      "quiz": [
        {
          "q": "Jitter adalah…",
          "options": [
            "Rata-rata latency",
            "Variasi latency antar paket",
            "Jumlah paket hilang",
            "Kecepatan kabel"
          ],
          "answer": 1
        },
        {
          "q": "Koneksi A stabil 90 ms; koneksi B meloncat 20–200 ms. Untuk video call, yang lebih baik adalah…",
          "options": [
            "Koneksi B karena pernah 20 ms",
            "Koneksi A karena jitter-nya rendah/stabil",
            "Sama saja",
            "Tergantung bandwidth saja"
          ],
          "answer": 1
        },
        {
          "q": "Mekanisme jaringan untuk melindungi traffic voice dari jitter adalah…",
          "options": [
            "Menambah user",
            "QoS — memprioritaskan antrean traffic real-time",
            "Mematikan firewall",
            "Mengganti semua kabel"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Jitter Buffer",
          "Buffer kecil di penerima yang menahan paket sebentar agar diputar merata — mengorbankan sedikit latency demi kelancaran."
        ],
        [
          "QoS",
          "Quality of Service — prioritas traffic berdasarkan jenisnya."
        ],
        [
          "Real-Time Traffic",
          "Traffic yang sensitif waktu: suara, video live, game."
        ]
      ],
      "scenario": "Meeting online direksi selalu 'robotik' padahal speedtest bagus: bandwidth 80 Mbps, latency rata-rata 45 ms. Setelah direkam 1 menit, ketahuan jitter mencapai 120 ms karena Wi-Fi meeting room bertabrakan channel dengan kantor sebelah. Ganti channel & pasang AP kabel: suara jernih.",
      "bestPractices": "Untuk ruang meeting & telepon IP: prioritaskan kabel, QoS voice, dan survei Wi-Fi (channel & interferensi) sebelum menyalahkan ISP.",
      "security": "Jitter ekstrem pada link yang biasanya stabil bisa menandakan device disusupi (proses jahat membebani CPU) — korelasikan dengan monitoring device.",
      "challenge": "Dari hasil ping beruntun (20x) ke gateway Wi-Fi vs kabel, hitung selisih max–min sebagai gambaran jitter kasar. Bandingkan dan simpulkan.",
      "interviewQ": "Q: 'Latency rata-rata bagus tapi Zoom patah-patah. Apa yang kamu cek?' — A: Jitter dan packet loss — rata-rata menyembunyikan lonjakan; real-time traffic mati oleh variasi, bukan oleh rata-rata."
    },
    {
      "id": "1.15",
      "title": "Packet Loss",
      "body": "\n<p><b>Packet loss</b> adalah persentase paket yang dikirim tetapi <b>tidak pernah sampai</b> ke tujuan. Ia adalah parameter terakhir dari empat serangkai kualitas jaringan: bandwidth (1.11), throughput (1.12), latency (1.13), jitter (1.14), packet loss (1.15).</p>\n<h3>Penyebab Packet Loss</h3>\n<div class=\"tblwrap\"><table>\n<tr><th>Penyebab</th><th>Mekanisme</th><th>Cara Mendeteksi</th></tr>\n<tr><td>Buffer penuh (congestion)</td><td>Antrean router/switch meluap → paket baru dibuang (tail drop)</td><td>Loss muncul hanya di jam sibuk; interface counter \"discards\" naik</td></tr>\n<tr><td>Media rusak</td><td>Kabel tertekuk, konektor kotor, fiber kotor/retak → bit error → frame dibuang (CRC error)</td><td>Counter \"errors/CRC\" naik di interface</td></tr>\n<tr><td>Interferensi Wi-Fi</td><td>Sinyal bertabrakan/rusak di udara</td><td>Loss memburuk di lokasi/channel tertentu</td></tr>\n<tr><td>Device kelebihan beban</td><td>CPU router/firewall 100% → paket tidak sempat diproses</td><td>Monitoring CPU device (Zabbix, Part 23)</td></tr>\n<tr><td>Duplex mismatch</td><td>Satu sisi full-duplex, sisi lain half-duplex</td><td>Late collision & FCS error di satu sisi</td></tr>\n</table></div>\n<h3>Dampaknya Berbeda untuk TCP dan UDP</h3>\n<ul>\n<li><b>TCP</b> (web, file, email): paket hilang → terdeteksi → <b>dikirim ulang</b>. Hasil: tidak ada data hilang, tetapi throughput anjlok. Loss 2% saja bisa memangkas throughput TCP secara drastis.</li>\n<li><b>UDP</b> (voice, video, game): tidak ada pengiriman ulang. Paket hilang = hilang selamanya: suara kresek, gambar pecah sesaat.</li>\n</ul>\n<pre>$ ping 192.168.30.10 -n 10\nReply ... time=1ms ... (x8)\nRequest timed out.          ← 1 paket hilang\nReply ... time=3ms\nPing statistics: Sent = 10, Received = 9, Lost = 1 (10% loss)  ← TIDAK SEHAT untuk LAN</pre>\n<div class=\"callout\"><div class=\"t\">Patokan Lapangan</div><p style=\"margin:4px 0 0\">Di LAN kabel yang sehat, packet loss harus <b>0%</b>. Loss 1% yang konsisten saja sudah merupakan temuan yang wajib dicari penyebabnya — bukan \"masih wajar\". Di internet publik, loss kecil sesekali (&lt;1%) umum terjadi.</p></div>\n<h3>Menutup Part 01</h3>\n<p>Kamu kini punya kosakata lengkap untuk mendeskripsikan kualitas jaringan secara profesional: \"link 1 Gbps (bandwidth), throughput terukur 400 Mbps, latency 28 ms, jitter 12 ms, loss 0,5%\" — kalimat seperti ini yang membedakan engineer dari sekadar \"internetnya lemot, Pak\". Empat parameter ini akan terus dipakai: untuk QoS (Part 13), monitoring (Part 23–27), dan troubleshooting (Part 28).</p>",
      "quiz": [
        {
          "q": "Packet loss 1% yang konsisten di LAN kabel sebaiknya dianggap…",
          "options": [
            "Normal, abaikan",
            "Temuan yang wajib dicari penyebabnya — LAN sehat = 0%",
            "Tanda bandwidth kurang",
            "Hanya masalah di jam sibuk"
          ],
          "answer": 1
        },
        {
          "q": "Perbedaan dampak loss pada TCP vs UDP adalah…",
          "options": [
            "TCP juga kehilangan data permanen",
            "TCP mengirim ulang (throughput turun), UDP kehilangan paket selamanya",
            "UDP mengirim ulang, TCP tidak",
            "Tidak ada perbedaan"
          ],
          "answer": 1
        },
        {
          "q": "Counter interface yang mengindikasikan media/kabel rusak adalah…",
          "options": [
            "Packets sent",
            "CRC/FCS errors yang terus naik",
            "Uptime device",
            "Jumlah VLAN"
          ],
          "answer": 1
        }
      ],
      "terms": [
        [
          "Tail Drop",
          "Router membuang paket baru saat buffer antrean penuh."
        ],
        [
          "CRC/FCS Error",
          "Frame rusak terdeteksi dari checksum — dibuang, tercatat di counter interface."
        ],
        [
          "Congestion",
          "Kondisi traffic melebihi kapasitas jalur/device."
        ]
      ],
      "scenario": "Setiap sore, CCTV satu gudang putus-putus. Ternyata switch akses gudang mencapai CPU tinggi karena loop kecil + kabel yang tertekuk menimbulkan CRC error dan loss 8% di jam sibuk. Ganti kabel & rapikan port: loss 0%, CCTV mulus. Moral: packet loss selalu punya penyebab fisik/logis yang bisa ditemukan.",
      "bestPractices": "Jadikan 'loss harus 0% di LAN' sebagai standar. Pantau counter discard/error interface lewat monitoring (Part 23), jangan menunggu komplain.",
      "security": "Loss selektif pada jam tertentu bisa jadi gejala serangan (flooding). Pola loss adalah data forensik jaringan juga.",
      "challenge": "Ping 100 paket ke gateway dan ke satu server (ping -n 100 / ping -c 100). Catat % loss-nya. Jika ada loss di LAN, tulis hipotesismu tentang penyebabnya dan cara membuktikannya.",
      "interviewQ": "Q: 'TCP vs UDP saat ada packet loss?' — A: TCP mendeteksi & mengirim ulang (data utuh, throughput jatuh); UDP tidak (paket hilang permanen, aplikasi real-time terganggu sesaat)."
    }
  ],
  "project": {
    "title": "Project Part 01 — Dokumentasi & Analisis Jaringan",
    "html": "\n<div class=\"proj\">\n<h3>Project Part 01 — Dokumentasi &amp; Analisis Jaringan (Portfolio)</h3>\n<p>Part 01 adalah part konsep, jadi project-nya bukan konfigurasi device, melainkan <b>artefak dokumentasi profesional</b> — persis dokumen pertama yang dibuat engineer saat masuk ke site baru.</p>\n<p><b>Tugasmu:</b></p>\n<ol>\n<li>Gambar diagram topologi (fisik <i>dan</i> logis) jaringan kantormu / jaringan rumahmu / jaringan lab khayalan sebuah kantor 3 lantai dengan segmen CCTV, OFFICE, SERVER, GUEST, MANAGEMENT.</li>\n<li>Tulis analisisnya dalam dokumen Markdown: jenis jaringan (LAN/MAN/WAN), topologi yang dipakai dan alasannya, daftar client/server/network device, rencana segmentasi (tabel VLAN + subnet seperti sub-bab 1.8), dan baseline kualitas: ukur dengan <code>ping</code> ke gateway &amp; ke internet, catat latency dan packet loss-nya.</li>\n<li>Upload ke GitHub sebagai repository portfolio pertamamu.</li>\n</ol>\n<p><b>Langkah upload ke GitHub:</b></p>\n<ol class=\"steps\">\n<li><span class=\"n\">1</span><span>Buat akun GitHub (jika belum), lalu buat repository publik bernama <code>network-engineer-lab</code>.</span></li>\n<li><span class=\"n\">2</span><span>Susun struktur folder: <code>part-01-fundamental/</code> berisi <code>README.md</code> (analisis), <code>topology-physical.png</code>, dan <code>topology-logical.png</code> (gambar boleh dibuat dengan draw.io / diagrams.net — gratis).</span></li>\n<li><span class=\"n\">3</span><span>Di README, sertakan: tujuan dokumen, diagram, tabel segmentasi, hasil pengukuran ping (latency &amp; loss), dan kesimpulanmu tentang kondisi jaringan tersebut.</span></li>\n<li><span class=\"n\">4</span><span>Upload via web GitHub (Add file → Upload files) atau via git: <code>git add . &amp;&amp; git commit -m \"Part 01: dokumentasi &amp; analisis jaringan\" &amp;&amp; git push</code>.</span></li>\n<li><span class=\"n\">5</span><span>Periksa tampilan repository: README ter-render rapi, diagram tampil, tabel terbaca. Repository ini adalah fondasi portfolio yang akan terus tumbuh sampai Part 39.</span></li>\n</ol>\n<p><b>Kriteria selesai:</b> repository publik dapat dibuka, README memuat kedua diagram + tabel segmentasi 5 VLAN + hasil ukur ping, dan penjelasanmu memakai istilah yang benar (broadcast domain, bandwidth, latency, jitter, packet loss).</p>\n</div>\n<div class=\"callout blue\"><div class=\"t\">Pertanyaan Interview — Latihan Part 01</div>\n<p style=\"margin:6px 0 0\">1) Apa beda bandwidth dan throughput? &nbsp;2) Perangkat apa yang memisahkan broadcast domain? &nbsp;3) Mengapa topologi star menjadi standar LAN? &nbsp;4) Latency 20 ms stabil vs 20–200 ms — mana yang lebih baik untuk VoIP, mengapa? &nbsp;5) Apa risiko flat network? — Jika kelimanya bisa kamu jawab dengan kata-katamu sendiri, kamu siap lanjut ke Part 02.</p></div>"
  }
};
