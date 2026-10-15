// Part 09 — VLAN (Fase 2: Switching & Routing).
// Materi murni: segmentasi Layer 2, inter-VLAN routing, dan keamanan VLAN.
import type { Part } from './types';

export const part09: Part = {
  id: '09',
  number: 'PART 09',
  title: 'VLAN',
  phaseId: 'fase-2',
  description: 'Virtual LAN: segmentasi broadcast domain, trunking, inter-VLAN routing (router-on-a-stick & Layer 3 switching), dan keamanan VLAN.',
  repoFolder: 'part-09-vlan',
  objectives: [
    'Menjelaskan konsep VLAN sebagai segmentasi broadcast domain di Layer 2 dan aturan emas 1 VLAN = 1 subnet = 1 broadcast domain.',
    'Mengonfigurasi VLAN, access port, dan trunk port mengikuti desain standar (VLAN 10/20/30/40/99).',
    'Menjelaskan dan mengonfigurasi inter-VLAN routing via router-on-a-stick dan Layer 3 switching (SVI).',
    'Mengidentifikasi ancaman keamanan VLAN (VLAN hopping, double tagging) dan mitigasinya.',
    'Melakukan troubleshooting VLAN sistematis: dari VLAN database hingga trunk dan routing antar VLAN.',
  ],
  prerequisites: 'Part 08 (switching, access/trunk port, 802.1Q) wajib tuntas. Part 05 (subnetting) untuk pemetaan VLAN↔subnet.',
  subbabs: [
    {
      id: '9.1',
      title: 'Apa Itu VLAN?',
      body: `
<p><b>VLAN</b> (<i>Virtual Local Area Network</i>) adalah cara membagi <b>satu switch fisik</b> menjadi <b>beberapa switch logis</b> yang terisolasi satu sama lain. Perangkat dalam VLAN yang sama bisa berkomunikasi langsung; perangkat beda VLAN <b>tidak bisa</b> — seolah-olah mereka terhubung ke switch fisik yang berbeda.</p>
<h3>Pengertian Sederhana vs Teknis</h3>
<p><b>Sederhana:</b> satu gedung kantor (switch) disekat menjadi beberapa ruangan terkunci (VLAN). Penghuni satu ruangan bebas ngobrol; untuk ke ruangan lain harus lewat pintu yang dijaga satpam (router/firewall).</p>
<p><b>Teknis:</b> VLAN mempartisi satu broadcast domain Layer 2 menjadi beberapa broadcast domain logis. Switch hanya meneruskan frame (termasuk broadcast/flood) ke port-port anggota VLAN yang sama. Aturan emasnya:</p>
<div class="callout blue"><div class="t">Aturan Emas VLAN</div><p style="margin:4px 0 0"><b>1 VLAN = 1 subnet = 1 broadcast domain.</b> Tiga hal ini selalu berjalan berpasangan. VLAN 20 (OFFICE) = subnet 192.168.20.0/24 = satu broadcast domain tersendiri. Melanggar aturan ini (mis. dua subnet dalam satu VLAN) adalah sumber masalah misterius nomor satu di lapangan.</p></div>
<h3>Desain Standar Kurikulum Ini</h3>
<p>Desain berikut dipakai konsisten di seluruh lab (ditetapkan di Part 01):</p>
<div class="tblwrap"><table>
<tr><th>VLAN ID</th><th>Nama</th><th>Subnet</th><th>Fungsi</th></tr>
<tr><td>10</td><td>CCTV</td><td>192.168.10.0/24</td><td>Kamera & NVR — terisolasi, tanpa internet langsung</td></tr>
<tr><td>20</td><td>OFFICE</td><td>192.168.20.0/24</td><td>PC/laptop karyawan</td></tr>
<tr><td>30</td><td>SERVER</td><td>192.168.30.0/24</td><td>Server internal — akses paling dibatasi</td></tr>
<tr><td>40</td><td>GUEST</td><td>192.168.40.0/24</td><td>Tamu — hanya internet</td></tr>
<tr><td>99</td><td>MANAGEMENT</td><td>192.168.99.0/24</td><td>Akses admin ke perangkat jaringan</td></tr>
</table></div>
<h3>VLAN vs LAN Fisik</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>LAN Fisik (tanpa VLAN)</th><th>VLAN</th></tr>
<tr><td>Isolasi</td><td>Butuh switch/kabel terpisah per segmen</td><td>Satu switch dibagi secara logis</td></tr>
<tr><td>Biaya</td><td>Mahal (perangkat ganda)</td><td>Murah (konfigurasi saja)</td></tr>
<tr><td>Fleksibilitas</th><td>Pindah segmen = pindah kabel fisik</td><td>Pindah segmen = ubah konfigurasi port</td></tr>
<tr><td>Broadcast domain</td><td>Satu per switch</td><td>Banyak per switch</td></tr>
</table></div>`,
      terms: [
        ['VLAN (Virtual LAN)', 'Segmentasi logis satu perangkat Layer 2 menjadi beberapa broadcast domain terisolasi.'],
        ['Broadcast domain', 'Area di mana frame broadcast diterima semua anggota; satu VLAN = satu broadcast domain.'],
        ['Segmentasi', 'Pembagian jaringan menjadi segmen-segmen terisolasi berdasarkan fungsi/kepercayaan.'],
      ],
      diagram: `<pre>SATU SWITCH FISIK → LIMA SWITCH LOGIS (VLAN)

 ┌────────────────── SWITCH ──────────────────┐
 │  ┌VLAN10─┐  ┌VLAN20─┐  ┌VLAN30─┐ ┌VLAN40─┐ ┌VLAN99─┐ │
 │  │ CCTV  │  │OFFICE │  │SERVER │ │ GUEST │ │ MGMT  │ │
 │  │.10.0/24│ │.20.0/24│ │.30.0/24│ │.40.0/24│ │.99.0/24│ │
 │  └───────┘  └───────┘  └───────┘ └───────┘ └───────┘ │
 │   ↕ terisolasi — broadcast VLAN 20 TIDAK sampai     │
 │     ke VLAN 10/30/40/99                            │
 └────────────────────────────────────────────────────┘
   Antar VLAN hanya bisa lewat ROUTER / LAYER-3 (9.8)</pre>`,
      scenario: 'Kantor pindah ke gedung baru: tim akuntansi dan tim marketing duduk campur di satu lantai, tetapi kebijakan mewajibkan keduanya terpisah. Tanpa VLAN, solusinya menarik kabel ulang dan membeli switch tambahan. Dengan VLAN, cukup konfigurasi port: port ganjil → VLAN 20, port genap → VLAN 30. Selesai dalam 15 menit.',
      bestPractices: 'Rancang VLAN berdasarkan fungsi dan trust level (CCTV, office, server, guest, management) — bukan berdasarkan lantai atau gedung. Dokumentasikan tabel VLAN↔subnet dan tempel di ruang NOC.',
      security: 'VLAN adalah fondasi segmentasi keamanan, tetapi BUKAN firewall: ia mengisolasi broadcast domain, namun kontrol "siapa boleh ke mana" antar VLAN tetap butuh router/firewall dengan policy (Part 18).',
      challenge: 'Untuk kafe kecil (kasir, dapur, Wi-Fi pelanggan, CCTV): rancang 4 VLAN (ID, nama, subnet /24, kebijakan akses antar segmen). Jelaskan mengapa tiap segmen perlu dipisah.',
      interviewQ: 'Q: "Apa itu VLAN dan apa aturan emasnya?" — A: Virtual LAN: pembagian logis satu switch menjadi beberapa broadcast domain terisolasi. Aturan emas: 1 VLAN = 1 subnet = 1 broadcast domain; komunikasi antar VLAN wajib lewat perangkat Layer 3.',
      quiz: [
        {
          q: 'Apa itu VLAN?',
          options: [
            'Kabel khusus untuk menghubungkan antar gedung',
            'Pembagian logis satu perangkat Layer 2 menjadi beberapa broadcast domain yang terisolasi',
            'Protokol routing antar router',
            'Nama lain dari subnet mask',
          ],
          answer: 1,
          explain: 'VLAN = Virtual LAN: satu switch fisik dibagi menjadi beberapa switch logis yang terisolasi.',
        },
        {
          q: 'Manakah pernyataan yang benar sesuai aturan emas VLAN?',
          options: [
            'Satu VLAN boleh berisi banyak subnet agar hemat',
            '1 VLAN = 1 subnet = 1 broadcast domain',
            'Satu subnet boleh menampung banyak VLAN',
            'VLAN dan subnet tidak berhubungan',
          ],
          answer: 1,
          explain: 'Aturan emas: ketiganya selalu berpasangan. Melanggarnya menimbulkan masalah komunikasi misterius.',
        },
        {
          q: 'Dua PC beda VLAN ingin berkomunikasi. Apa yang dibutuhkan?',
          options: [
            'Cukup hubungkan ke switch yang sama',
            'Perangkat Layer 3 (router / Layer 3 switch) sebagai gerbang antar VLAN',
            'Kabel crossover',
            'Menyamakan VLAN ID keduanya',
          ],
          answer: 1,
          explain: 'Antar VLAN = antar broadcast domain = antar subnet → butuh routing Layer 3 (dibahas di 9.8–9.10).',
        },
      ],
    },
    {
      id: '9.2',
      title: 'Mengapa VLAN Dibutuhkan?',
      body: `
<p>VLAN menjawab tiga masalah nyata jaringan flat (satu jaringan rata tanpa sekat): <b>keamanan</b>, <b>performa broadcast</b>, dan <b>fleksibilitas pengelolaan</b>.</p>
<h3>1. Keamanan: Membatasi Ledakan (Blast Radius)</h3>
<p>Di jaringan flat, satu PC terinfeksi ransomware bisa "melihat" dan menyerang semua perangkat — termasuk server. Dengan VLAN, malware di VLAN 20 (OFFICE) <b>tidak bisa</b> mencapai VLAN 30 (SERVER) secara langsung di Layer 2; ia harus lewat router/firewall yang bisa memblokirnya. VLAN memperkecil <i>blast radius</i> insiden.</p>
<h3>2. Performa: Mengecilkan Broadcast Domain</h3>
<p>Setiap ARP request, DHCP discover, dan service discovery adalah broadcast yang <b>wajib diterima semua perangkat</b> dalam broadcast domain. Matematikanya sederhana:</p>
<pre>Jaringan flat 500 host  : 1 broadcast → diterima 499 perangkat (boros!)
5 VLAN @100 host        : 1 broadcast → diterima 99 perangkat (5x lebih ringan)</pre>
<p>Semakin kecil broadcast domain, semakin sedikit CPU dan bandwidth terbuang untuk traffic yang bukan urusanmu.</p>
<h3>3. Fleksibilitas: Kebijakan per Segmen</h3>
<div class="tblwrap"><table>
<tr><th>Kebutuhan</th><th>Tanpa VLAN</th><th>Dengan VLAN</th></tr>
<tr><td>Tamu hanya boleh internet</td><td>Mustahil tanpa perangkat terpisah</td><td>VLAN 40 + policy "internet only" di firewall</td></tr>
<tr><td>CCTV tidak boleh ke internet</td><td>Cabut kabel / filter manual</td><td>VLAN 10 + policy blokir ke WAN</td></tr>
<tr><td>Karyawan pindah divisi</td><td>Tarik kabel baru ke switch lain</td><td>Ubah access VLAN port-nya — 1 perintah</td></tr>
<tr><td>Isolasi server kritis</td><td>Ruang & switch khusus</td><td>VLAN 30 + ACL ketat</td></tr>
</table></div>
<h3>Kapan VLAN Tidak Dibutuhkan?</h3>
<p>Jujur saja: jaringan sangat kecil (mis. warnet 10 PC tanpa segmen tamu, lab rumah) bisa hidup tanpa VLAN. VLAN mulai <i>wajib</i> ketika ada <b>lebih dari satu kelompok kepercayaan</b> (user vs tamu vs server vs perangkat IoT) atau <b>broadcast mulai terasa</b> (ratusan host).</p>
<div class="callout blue"><div class="t">VLAN ≠ Keamanan Sempurna</div><p style="margin:4px 0 0">VLAN mengisolasi di Layer 2, tetapi serangan seperti VLAN hopping (9.11) bisa menembusnya bila konfigurasi ceroboh. Anggap VLAN sebagai <b>dinding ruangan</b> — tetap butuh <b>satpam di pintu</b> (firewall policy antar VLAN, Part 18).</p></div>`,
      terms: [
        ['Blast radius', 'Luas dampak sebuah insiden keamanan; VLAN memperkecilnya dengan isolasi segmen.'],
        ['Jaringan flat', 'Jaringan rata tanpa segmentasi: satu broadcast domain untuk semua perangkat.'],
      ],
      diagram: `<pre>MASALAH JARINGAN FLAT vs SOLUSI VLAN

 FLAT (1 broadcast domain, 500 host):
 [PC kena malware] ──broadcast──▶ 499 perangkat dengar, server terekspos
                       "satu ruangan raksasa tanpa sekat"

 DENGAN VLAN (5 broadcast domain):
 [PC kena malware di VLAN 20] ──broadcast──▶ hanya 99 PC VLAN 20
      ✕ tidak sampai ke VLAN 30 (SERVER) — beda ruangan terkunci
      → harus lewat firewall (satpam) yang bisa menolak</pre>`,
      scenario: 'Hotel 200 kamar: Wi-Fi tamu satu jaringan dengan sistem kasir. Seorang tamu iseng melakukan scanning dan menemukan server kasir. Setelah insiden, hotel menerapkan VLAN: tamu (40) terisolasi total, kasir (30) hanya bisa diakses resepsionis (20). Audit keamanan berikutnya lolos tanpa catatan.',
      bestPractices: 'Setiap ada kelompok perangkat dengan tingkat kepercayaan berbeda (tamu, IoT/CCTV, server, user, management), buatkan VLAN tersendiri. Jangan mencampur trust level dalam satu VLAN.',
      security: 'VLAN 40 (GUEST) adalah contoh sempurna least privilege: tamu hanya butuh internet — maka policy-nya "internet only", blokir total ke 192.168.10/20/30/99.0/24.',
      challenge: 'Hitung: jaringan 800 host flat vs 8 VLAN @100 host. Berapa perangkat yang "terganggu" oleh satu broadcast di masing-masing desain? Tulis perhitungannya dan simpulkan.',
      interviewQ: 'Q: "Sebutkan 3 alasan memakai VLAN." — A: (1) Keamanan: isolasi segmen memperkecil blast radius insiden; (2) Performa: broadcast domain lebih kecil = lebih sedikit broadcast terbuang; (3) Fleksibilitas: kebijakan per segmen dan pemindahan user tanpa tarik kabel.',
      quiz: [
        {
          q: 'Masalah apa yang DISELESAIKAN oleh VLAN terkait broadcast?',
          options: [
            'Menghilangkan broadcast sepenuhnya',
            'Mengecilkan broadcast domain sehingga satu broadcast hanya diterima anggota VLAN yang sama',
            'Mempercepat kabel fisik',
            'Menambah bandwidth internet',
          ],
          answer: 1,
          explain: 'VLAN memecah satu broadcast domain besar menjadi beberapa yang kecil; broadcast hanya beredar di VLAN asalnya.',
        },
        {
          q: 'Mengapa VLAN memperkecil "blast radius" serangan malware?',
          options: [
            'Karena VLAN menghapus virus otomatis',
            'Karena malware di satu VLAN tidak bisa mencapai VLAN lain secara langsung di Layer 2 — harus lewat router/firewall yang bisa memblokir',
            'Karena VLAN mengenkripsi semua data',
            'Karena VLAN mempercepat antivirus',
          ],
          answer: 1,
          explain: 'Isolasi Layer 2 memaksa traffic antar segmen lewat perangkat Layer 3/firewall — titik kontrol keamanan.',
        },
        {
          q: 'Kapan VLAN bisa dianggap belum dibutuhkan?',
          options: [
            'Jaringan besar dengan banyak divisi',
            'Jaringan sangat kecil dengan satu kelompok kepercayaan dan sedikit host',
            'Jaringan yang punya tamu Wi-Fi',
            'Jaringan dengan server kritis',
          ],
          answer: 1,
          explain: 'VLAN menjadi wajib saat ada >1 trust level atau broadcast domain membesar; jaringan kecil homogen bisa hidup tanpanya.',
        },
      ],
    },
    {
      id: '9.3',
      title: 'VLAN ID',
      body: `
<p><b>VLAN ID</b> adalah nomor identitas sebuah VLAN (1–4094, sesuai field VID 12 bit di tag 802.1Q — lihat 8.11). Setiap VLAN di sebuah jaringan Layer 2 harus punya ID unik.</p>
<h3>Rentang VLAN ID</h3>
<div class="tblwrap"><table>
<tr><th>Rentang</th><th>Nama</th><th>Keterangan</th></tr>
<tr><td>0</td><td>Reserved</td><td>Tidak dipakai (priority tagging)</td></tr>
<tr><td>1</td><td>Default</td><td>VLAN bawaan semua port; semua traffic "tak dikenal" jatuh ke sini</td></tr>
<tr><td>2–1001</td><td>Normal range</td><td>VLAN umum; tersimpan di vlan.dat (Cisco lama)</td></tr>
<tr><td>1002–1005</td><td>Reserved (Token Ring/FDDI)</td><td>Jangan dipakai di Ethernet modern</td></tr>
<tr><td>1006–4094</td><td>Extended range</td><td>VLAN tambahan; hanya di VTP transparent mode (Cisco)</td></tr>
<tr><td>4095</td><td>Reserved</td><td>Tidak dipakai</td></tr>
</table></div>
<h3>VLAN 1: Default yang Berbahaya</h3>
<p>Semua port switch baru lahir di VLAN 1, dan banyak protokol (CDP, DTP, STP) memakai VLAN 1. Akibatnya VLAN 1 menjadi <b>tempat berkumpulnya "sisa-sisa"</b>: port yang lupa dikonfigurasi, perangkat asing yang dicolok sembarangan. Praktik aman:</p>
<ul>
<li><b>Jangan</b> menaruh user/server di VLAN 1 di production.</li>
<li><b>Jangan</b> pakai VLAN 1 sebagai native VLAN di trunk (lihat 8.9).</li>
<li>Matikan/shutdown port tak terpakai, atau parkir di VLAN "mati" (blackhole VLAN) yang tidak di-routing ke mana-mana.</li>
</ul>
<h3>Penomoran yang Rapi</h3>
<p>ID hanyalah angka — tetapi penomoran yang konsisten menyelamatkanmu saat troubleshooting jam 2 pagi:</p>
<ul>
<li>Kelompokkan: 10–19 untuk CCTV/IoT, 20–29 untuk user, 30–39 untuk server, 40–49 untuk tamu, 99 untuk management.</li>
<li>Desain kurikulum ini memakai <b>10, 20, 30, 40, 99</b> — angka cantik yang mudah diingat dan menempel di semua part.</li>
<li>Catat di dokumentasi: "VLAN 20 = OFFICE = 192.168.20.0/24". Engineer berikutnya (atau kamu 6 bulan lagi) akan berterima kasih.</li>
</ul>
<div class="callout"><div class="t">VLAN ID vs Nama</div><p style="margin:4px 0 0">Yang dipakai switch untuk forwarding adalah <b>ID numerik</b> (yang ada di tag 802.1Q). Nama ("OFFICE") hanya label manusiawi agar konfigurasi terbaca. Dua switch dengan nama berbeda tetapi ID sama = VLAN yang sama.</p></div>`,
      terms: [
        ['VLAN ID', 'Nomor identitas VLAN, 1–4094 (12 bit di tag 802.1Q).'],
        ['Default VLAN (VLAN 1)', 'VLAN bawaan semua port dan protokol; hindari untuk traffic user di production.'],
        ['Blackhole VLAN', 'VLAN "mati" tempat memarkir port tak terpakai; tidak di-routing ke mana pun.'],
      ],
      diagram: `<pre>RENTANG VLAN ID

 0       1        2–1001      1002–1005     1006–4094      4095
 │       │           │              │              │           │
reserved default   normal      reserved       extended    reserved
         (VLAN 1)  (pakai ini) (Token Ring)  (butuh VTP   (jangan
          ▲                      jangan       transparent)  pakai)
          │                      dipakai
     "jangan taruh user di sini"

 Desain kita: 10  20  30  40  99  → semua di normal range ✔</pre>`,
      scenario: 'Audit menemukan 30 port switch masih di VLAN 1 karena "belum sempat dikonfigurasi". Seorang vendor yang datang servis AC mencolok laptopnya ke port kosong dan langsung satu broadcast domain dengan perangkat management. Sejak itu SOP-nya: semua port tak terpakai di-shutdown dan diparkir di blackhole VLAN 999.',
      bestPractices: 'Buat skema penomoran VLAN dan patuhi di semua site. Jangan pernah memakai VLAN 1 untuk user/server/produksi; reserved 1002–1005 jangan dipakai.',
      security: 'VLAN 1 adalah target empuk karena selalu ada dan sering terabaikan — serangan VLAN hopping klasik mengeksploitasinya. Mengosongkan VLAN 1 dari traffic user adalah langkah keamanan termurah.',
      challenge: 'Rancang skema VLAN ID untuk kampus 3 gedung (tiap gedung: CCTV, dosen, mahasiswa, tamu, server lokal, management). Tulis ID, nama, subnet-nya — konsisten antar gedung.',
      interviewQ: 'Q: "Berapa rentang VLAN ID valid dan mengapa VLAN 1 sebaiknya dihindari?" — A: 1–4094 (0 & 4095 reserved; 1002–1005 untuk Token Ring). VLAN 1 adalah default semua port & protokol — menaruh user di sana berarti bercampur dengan traffic tak dikenal dan menjadi target VLAN hopping.',
      quiz: [
        {
          q: 'Berapa rentang VLAN ID yang valid untuk dipakai?',
          options: [
            '0–4095 semuanya bebas',
            '1–4094 (0 dan 4095 reserved; 1002–1005 untuk Token Ring)',
            '1–100 saja',
            '100–200 saja',
          ],
          answer: 1,
          explain: 'VID 12 bit memberi 0–4095; 0 & 4095 reserved dan 1002–1005 warisan Token Ring → praktis 1–4094 minus reserved.',
        },
        {
          q: 'Mengapa VLAN 1 tidak disarankan untuk traffic user di production?',
          options: [
            'Karena VLAN 1 lebih lambat',
            'Karena semua port default di VLAN 1 dan banyak protokol memakainya — ia menjadi tempat berkumpulnya traffic tak dikenal dan target serangan',
            'Karena VLAN 1 tidak bisa di-trunk',
            'Karena VLAN 1 hanya untuk wireless',
          ],
          answer: 1,
          explain: 'VLAN 1 = default factory semua port + dipakai CDP/DTP/STP → campur aduk dan rawan; kosongkan dari traffic user.',
        },
        {
          q: 'Switch A menamai VLAN 20 "OFFICE", switch B menamainya "KANTOR". Apakah ini satu VLAN yang sama?',
          options: [
            'Tidak, nama harus sama persis',
            'Ya — yang menentukan adalah VLAN ID numerik (20), nama hanya label',
            'Hanya jika trunk-nya Cisco',
            'Tidak, harus dibuat ulang',
          ],
          answer: 1,
          explain: 'Forwarding memakai ID numerik di tag 802.1Q; nama hanyalah label untuk manusia.',
        },
      ],
    },
    {
      id: '9.4',
      title: 'VLAN Access',
      body: `
<p><b>VLAN access</b> adalah penerapan VLAN pada <b>access port</b> (lihat 8.7): menetapkan satu VLAN tetap ke port yang menghadap end device. Ini adalah konfigurasi VLAN paling dasar dan paling sering dikerjakan di lapangan.</p>
<h3>Lab Terpandu: Membangun 5 VLAN + Access Port (Cisco IOS)</h3>
<p><b>Topology:</b> satu switch SW1. Fa0/5 → PC Office, Fa0/6 → CCTV, Fa0/10 → Server, Fa0/15 → AP tamu, Fa0/24 → port management.</p>
<p><b>Objective:</b> kelima VLAN (10/20/30/40/99) terbentuk; tiap port berada di VLAN yang benar; verifikasi dengan show commands.</p>
<h3>Configuration</h3>
<pre>SW1(config)# vlan 10
SW1(config-vlan)# name CCTV
SW1(config-vlan)# vlan 20
SW1(config-vlan)# name OFFICE
SW1(config-vlan)# vlan 30
SW1(config-vlan)# name SERVER
SW1(config-vlan)# vlan 40
SW1(config-vlan)# name GUEST
SW1(config-vlan)# vlan 99
SW1(config-vlan)# name MANAGEMENT
SW1(config-vlan)# exit
! ALASAN: daftarkan dulu semua VLAN ke database VLAN switch. Prinsipnya
! sama seperti 8.7: port tidak bisa dimasukkan ke VLAN yang belum ada.
! Nama (name) opsional tetapi SANGAT disarankan untuk keterbacaan.

SW1(config)# interface range fa0/5 - 6
! ALASAN: "interface range" mengonfigurasi banyak port sekaligus —
! hemat waktu dan mencegah typo beda konfigurasi antar port sejenis.

SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 20
! Fa0/5–Fa0/6 → OFFICE. (Contoh: di lab kecil dua port untuk demo.)

SW1(config)# interface fa0/6
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
! Fa0/6 → CCTV. (Sesuaikan dengan topologimu.)

SW1(config)# interface fa0/10
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 30

SW1(config)# interface fa0/15
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 40

SW1(config)# interface fa0/24
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 99
! Fa0/24 → MANAGEMENT: port khusus admin me-remote switch (lihat 9.6).</pre>
<h3>Verification</h3>
<pre>SW1# show vlan brief
VLAN Name         Status  Ports
---- ------------ ------- --------------------------------
1    default      active  Fa0/1, Fa0/2, Fa0/3, Fa0/4, ...
10   CCTV         active  Fa0/6
20   OFFICE       active  Fa0/5
30   SERVER       active  Fa0/10
40   GUEST        active  Fa0/15
99   MANAGEMENT   active  Fa0/24
! ✔ Semua VLAN terbentuk dengan port yang benar. Port yang belum
! dikonfigurasi masih di VLAN 1 — normal, akan dirapikan nanti.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> hapus VLAN 30 dari database: <code>no vlan 30</code> (simulasi "VLAN terhapus tak sengaja").</li>
<li><b>Gejala:</b> server di Fa0/10 mati total (link up, tapi tidak ada traffic). <code>show vlan brief</code> tidak menampilkan VLAN 30; Fa0/10 hilang dari daftar (port menjadi "inactive").</li>
<li><b>Troubleshoot:</b> <code>show interfaces fa0/10 switchport</code> → Access Mode VLAN: 30 (inactive). Artinya: port merujuk ke VLAN yang tidak ada di database.</li>
<li><b>Fix:</b> buat ulang <code>vlan 30</code> + <code>name SERVER</code> → port otomatis aktif kembali.</li>
<li><b>Final verification:</b> <code>show vlan brief</code> menampilkan VLAN 30 + ping ke server berhasil.</li>
</ul>
<div class="callout"><div class="t">Pelajaran Penting</div><p style="margin:4px 0 0">Menghapus VLAN dari database <b>tidak menghapus konfigurasi port-nya</b> — port menjadi yatim (inactive). Inilah sebabnya di production, penghapusan VLAN adalah change berisiko yang wajib dicek ulang dengan <code>show vlan brief</code> sebelum dan sesudah.</p></div>`,
      terms: [
        ['VLAN database', 'Daftar VLAN yang dikenal switch (vlan.dat di Cisco lama); port hanya bisa memakai VLAN yang terdaftar.'],
        ['interface range', 'Perintah Cisco untuk mengonfigurasi banyak port sekaligus.'],
        ['Inactive VLAN', 'Kondisi port yang merujuk ke VLAN yang tidak ada di database — port mati secara logis.'],
      ],
      diagram: `<pre>HASIL LAB: 5 VLAN DI SATU SWITCH

 SW1
 Fa0/6  ──▶ VLAN 10 CCTV    (192.168.10.0/24)
 Fa0/5  ──▶ VLAN 20 OFFICE  (192.168.20.0/24)
 Fa0/10 ──▶ VLAN 30 SERVER  (192.168.30.0/24)
 Fa0/15 ──▶ VLAN 40 GUEST   (192.168.40.0/24)
 Fa0/24 ──▶ VLAN 99 MGMT    (192.168.99.0/24)

 "show vlan brief" = foto resmi kondisi ini — hafalkan tampilannya.</pre>`,
      scenario: 'NOC menerima 5 CCTV baru untuk dipasang. Teknisi di lapangan hanya perlu tahu: "colok ke port Fa0/6–Fa0/10 yang sudah diset VLAN 10". Tidak perlu paham VLAN — karena engineer sudah menyiapkan access port-nya. Itulah nilai standarisasi konfigurasi port.',
      bestPractices: 'Buat VLAN database sekali di awal (dengan nama yang jelas), lalu standarkan template konfigurasi per jenis port (CCTV/OFFICE/SERVER/GUEST). Jangan membuat VLAN dadakan per kasus.',
      security: 'Jangan biarkan port tak terpakai di VLAN 1 (default). Shutdown + parkir di blackhole VLAN. Port "kosong" adalah pintu masuk paling murah bagi orang asing.',
      challenge: 'Di lab: buat VLAN 10–99 seperti materi, lalu SENGAJA hapus satu VLAN dan catat gejala + output show-nya. Kembalikan, lalu tulis SOP 5 langkah "cara aman menghapus VLAN di production".',
      interviewQ: 'Q: "Apa yang terjadi jika sebuah access port merujuk ke VLAN yang sudah dihapus?" — A: Port menjadi inactive — link fisik up tetapi tidak meneruskan traffic. Konfigurasi port tidak ikut terhapus, jadi membuat ulang VLAN yang sama akan menghidupkannya kembali.',
      quiz: [
        {
          q: 'Urutan konfigurasi access VLAN yang benar adalah…',
          options: [
            'Set access VLAN dulu, baru buat VLAN-nya',
            'Buat VLAN di database dulu (vlan + name), baru tetapkan ke port via switchport access vlan',
            'Langsung colok kabel, VLAN terbentuk otomatis',
            'Buat VLAN hanya di router',
          ],
          answer: 1,
          explain: 'VLAN harus terdaftar di database switch dulu; port tidak bisa dimasukkan ke VLAN yang belum ada.',
        },
        {
          q: 'Apa fungsi perintah interface range fa0/5 - 6?',
          options: [
            'Menghapus konfigurasi port 5 dan 6',
            'Mengonfigurasi banyak port sekaligus dengan perintah yang sama',
            'Membuat VLAN 5 sampai 6',
            'Menampilkan status port',
          ],
          answer: 1,
          explain: 'interface range = konfigurasi massal; hemat waktu dan mencegah inkonsistensi antar port sejenis.',
        },
        {
          q: 'VLAN 30 dihapus dari database padahal Fa0/10 masih diset access VLAN 30. Apa yang terjadi?',
          options: [
            'Fa0/10 otomatis pindah ke VLAN 1',
            'Fa0/10 menjadi inactive — link up tetapi tidak meneruskan traffic sampai VLAN dibuat ulang',
            'Switch reboot otomatis',
            'Tidak ada efek, VLAN tersimpan di port',
          ],
          answer: 1,
          explain: 'Port menjadi yatim (inactive). Membuat ulang VLAN 30 akan mengaktifkannya kembali.',
        },
      ],
    },
    {
      id: '9.5',
      title: 'VLAN Trunk',
      body: `
<p><b>VLAN trunk</b> adalah penerapan trunk port (8.8) khusus untuk membawa VLAN-VLAN yang sudah dibuat. Setelah VLAN access beres di tiap switch, trunk adalah "jalan tol" yang menghubungkan VLAN yang sama di switch berbeda.</p>
<h3>Prinsip Operasi</h3>
<ul>
<li><b>Satu VLAN, banyak switch:</b> PC VLAN 20 di SW1 dan PC VLAN 20 di SW2 berada di broadcast domain yang sama <i>asal</i> trunk membawa VLAN 20 di antara keduanya.</li>
<li><b>Allowed list = filter:</b> hanya VLAN di allowed list yang boleh menyeberang. VLAN yang tidak diizinkan = terisolasi di switch asalnya.</li>
<li><b>Simetri:</b> allowed list dan native VLAN sebaiknya identik di kedua sisi trunk.</li>
</ul>
<h3>Konfigurasi: Trunk Antar Dua Switch (Cisco)</h3>
<pre>! Di SW1 Fa0/24 ──kabel── Fa0/24 SW2. Bawa VLAN 10,20,30,99.
! VLAN 40 (GUEST) TIDAK dibawa (kebijakan: guest hanya di switch ini).

SW1(config)# interface fa0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport trunk allowed vlan 10,20,30,99
SW1(config-if)# switchport trunk native vlan 99
! ALASAN tiap baris: lihat 8.8. Intinya: kunci mode trunk, pakai 802.1Q,
! batasi VLAN (least privilege), samakan native VLAN.
! → Ulangi PERSIS SAMA di SW2 Fa0/24.</pre>
<h3>Verification (wajib di kedua sisi)</h3>
<pre>SW1# show interfaces trunk
Port   Mode  Encapsulation  Status    Native vlan
Fa0/24 on    802.1q         trunking  99
Port   Vlans allowed on trunk
Fa0/24 10,20,30,99
! ✔ Bandingkan dengan output SW2 — harus identik (kecuali nama port).</pre>
<h3>Kasus Umum: VLAN Tidak Menyeberang</h3>
<p>Gejala: PC VLAN 30 di SW1 tidak bisa ping PC VLAN 30 di SW2, tetapi VLAN 20 normal. Diagnosis 3 langkah:</p>
<ol>
<li><code>show vlan brief</code> di kedua switch → pastikan VLAN 30 ada di <b>kedua</b> database (VLAN tidak otomatis menular antar switch!).</li>
<li><code>show interfaces trunk</code> → pastikan 30 ada di allowed list <b>kedua sisi</b>.</li>
<li><code>show interfaces fa0/24 switchport</code> → pastikan Operational Mode = trunk di kedua sisi.</li>
</ol>
<div class="callout"><div class="t">VLAN Tidak Menular Otomatis</div><p style="margin:4px 0 0">Membuat VLAN 30 di SW1 <b>tidak</b> otomatis membuatnya di SW2 (kecuali memakai VTP — protokol sinkronisasi Cisco yang justru berisiko dan tidak disarankan untuk pemula). Setiap switch punya database VLAN sendiri: buat di semua switch yang membutuhkan.</p></div>`,
      terms: [
        ['VLAN trunking', 'Membawa banyak VLAN melintasi satu link antar switch memakai tag 802.1Q.'],
        ['VTP', 'VLAN Trunking Protocol — sinkronisasi database VLAN otomatis antar switch Cisco; berisiko menimpa (revision number) sehingga mode transparent/off disarankan.'],
      ],
      diagram: `<pre>VLAN MENYEBERANG LEWAT TRUNK

 SW1 (VLAN 10,20,30,99) ═══════ SW2 (VLAN 10,20,30,99)
 Fa0/24 [trunk: 10,20,30,99]    Fa0/24 [trunk: 10,20,30,99]

 PC VLAN 20 @SW1 ◀─── broadcast VLAN 20 ───▶ PC VLAN 20 @SW2  ✔
 PC VLAN 40 @SW1 ◀─── ✕ (40 tidak di allowed) ─── PC VLAN 40 @SW2 ✕

 Syarat: VLAN ada di database KEDUA switch + ada di allowed list.</pre>`,
      scenario: 'Kantor cabang membuka lantai 2 dengan switch baru. Semua VLAN sudah jalan di lantai 1. Teknisi hanya menarik 1 kabel trunk dan membuat VLAN yang sama di switch lantai 2 — seluruh segmentasi langsung berlaku di lantai 2 tanpa beli perangkat baru.',
      bestPractices: 'Dokumentasikan setiap trunk: port mana ↔ switch mana, allowed VLAN apa saja, native VLAN berapa. Jadikan show interfaces trunk sebagai verifikasi standar setiap instalasi switch baru.',
      security: 'Prune allowed list seminimal mungkin. Trunk yang membawa VLAN 99 (management) ke switch akses yang tidak perlu = memperluas permukaan serangan ke jalur management.',
      challenge: 'Lab 2 switch: buat VLAN 20 di SW1 SAJA (jangan di SW2), trunk sudah jalan. Coba ping antar PC VLAN 20. Catat hasilnya, lalu buat VLAN 20 di SW2 dan ulangi. Jelaskan mengapa langkah kedua memperbaikinya.',
      interviewQ: 'Q: "VLAN 20 sudah ada di SW1 dan trunk sudah up, tetapi PC VLAN 20 di SW2 tidak terhubung. Apa yang dicek?" — A: (1) Apakah VLAN 20 ada di database SW2 — VLAN tidak menular otomatis; (2) allowed list trunk kedua sisi; (3) mode operasional trunk.',
      quiz: [
        {
          q: 'Syarat agar PC VLAN 20 di SW1 bisa berkomunikasi dengan PC VLAN 20 di SW2 adalah…',
          options: [
            'Cukup menghubungkan kabel antar switch',
            'VLAN 20 ada di database kedua switch DAN dibawa oleh trunk (allowed list)',
            'Menyamakan IP address kedua PC',
            'Menghapus VLAN 20 di salah satu switch',
          ],
          answer: 1,
          explain: 'Dua syarat: VLAN terdaftar di kedua database (tidak menular otomatis) + trunk mengizinkannya lewat.',
        },
        {
          q: 'Apa risiko memakai VTP (VLAN Trunking Protocol) bagi pemula?',
          options: [
            'VTP memperlambat trunk',
            'Server VTP dengan revision number lebih tinggi bisa menimpa/menghapus VLAN di seluruh domain — berisiko',
            'VTP tidak mendukung 802.1Q',
            'VTP hanya untuk wireless',
          ],
          answer: 1,
          explain: 'VTP menyinkronkan database otomatis; satu kesalahan revision bisa menghapus VLAN di semua switch. Mode transparent lebih aman.',
        },
        {
          q: 'Mengapa allowed VLAN list sebaiknya dibatasi (pruning)?',
          options: [
            'Agar konfigurasi terlihat pendek',
            'Least privilege: mengurangi broadcast tak perlu yang menyeberang link dan memperkecil permukaan serangan',
            'Agar switch lebih dingin',
            'Tidak ada alasan teknis',
          ],
          answer: 1,
          explain: 'VLAN yang tidak dibutuhkan di ujung sana tidak usah dibawa: hemat bandwidth trunk + isolasi lebih baik.',
        },
      ],
    },
    {
      id: '9.6',
      title: 'VLAN Management',
      body: `
<p><b>VLAN management</b> adalah VLAN khusus (di desain kita: <b>VLAN 99</b>, subnet 192.168.99.0/24) yang dipakai <b>hanya untuk mengelola perangkat jaringan</b> — SSH ke switch, SNMP monitoring, akses web GUI. Ia tidak menampung user, server, atau tamu.</p>
<h3>Mengapa Perlu VLAN Khusus Management?</h3>
<ul>
<li><b>Isolasi akses admin:</b> hanya admin (dari VLAN 99 atau via VPN) yang bisa mencapai IP management switch. User biasa di VLAN 20 bahkan tidak bisa me-routing ke sana (diblokir firewall).</li>
<li><b>Stabilitas monitoring:</b> traffic monitoring (SNMP ke Zabbix, Part 23) tidak berebut bandwidth dengan traffic user.</li>
<li><b>Keamanan:</b> memisahkan "bidang kontrol" dari "bidang data" — prinsip dasar network security.</li>
</ul>
<h3>SVI: Memberi IP ke Switch</h3>
<p>Switch Layer 2 murni tidak butuh IP untuk meneruskan frame. Tetapi agar bisa di-remote, switch butuh IP management — diberikan lewat <b>SVI</b> (<i>Switched Virtual Interface</i>): interface virtual yang mewakili VLAN di switch itu.</p>
<pre>SW1(config)# interface vlan 99
! ALASAN: buat SVI untuk VLAN 99 — "wajah" switch di VLAN management.

SW1(config-if)# ip address 192.168.99.2 255.255.255.0
! ALASAN: beri IP management. .1 biasanya gateway, .2/.3/... untuk switch.

SW1(config-if)# no shutdown
SW1(config)# ip default-gateway 192.168.99.1
! ALASAN: agar switch bisa dijangkau dari subnet lain (mis. admin di kantor
! pusat). Tanpa ini, switch hanya bisa diakses dari dalam 192.168.99.0/24.</pre>
<div class="callout blue"><div class="t">SVI vs Port Fisik</div><p style="margin:4px 0 0">SVI bukan port fisik — ia "hidup" selama VLAN 99 ada dan minimal satu port fisik VLAN 99 (atau trunk yang membawanya) dalam keadaan up. Memberi IP ke SVI = memberi identitas management ke switch itu sendiri.</p></div>
<h3>Aturan Desain VLAN Management</h3>
<ul>
<li><b>Satu SVI management per switch</b> — jangan beri IP management di VLAN user.</li>
<li>Batasi akses: hanya admin & server monitoring (Zabbix) yang boleh mencapai 192.168.99.0/24 — via ACL/firewall.</li>
<li>Jangan jadikan VLAN management sebagai native VLAN di trunk user (risiko double tagging — 8.9). Di desain kita native=99 hanya untuk trunk antar-switch inti yang terkontrol; trunk ke arah akses user sebaiknya native VLAN dummy terpisah.</li>
<li>Dokumentasikan IP management semua perangkat dalam IPAM (spreadsheet/database IP).</li>
</ul>
`,
      terms: [
        ['VLAN management', 'VLAN khusus (99) untuk akses admin & monitoring perangkat; tidak untuk user.'],
        ['SVI (Switched Virtual Interface)', 'Interface virtual per-VLAN di switch; dipakai memberi IP management (dan routing di L3 switch).'],
        ['IPAM', 'IP Address Management — pencatatan terpusat semua alokasi IP.'],
        ['Bidang kontrol vs bidang data', 'Control plane (management/monitoring) dipisahkan dari data plane (traffic user).'],
      ],
      diagram: `<pre>VLAN 99 MANAGEMENT — jalur khusus admin

 [Admin PC]──VLAN 99──▶ [SW1: 192.168.99.2] ──trunk──▶ [SW2: 192.168.99.3]
      │                        │                            │
      └──── SSH/SNMP ──────────┴──────── Zabbix ───────────┘
              192.168.99.0/24 (terisolasi dari VLAN 10/20/30/40)

 ✕ PC VLAN 20 TIDAK bisa SSH ke 192.168.99.2 (diblokir firewall)</pre>`,
      scenario: 'NOC memonitor 40 switch via Zabbix. Semua IP monitoring ada di 192.168.99.0/24. Saat ransomware menyerang VLAN office, tim me-remote switch lewat VLAN 99 yang steril — jaringan management tetap hidup justru saat jaringan user lumpuh. Itulah nilai pemisahan bidang kontrol.',
      bestPractices: 'Satu SVI management per perangkat, IP terdokumentasi di IPAM, akses dibatasi via ACL. Jangan pernah menaruh IP management di VLAN user "agar gampang".',
      security: 'VLAN management adalah "kunci kerajaan": siapa bisa mencapai 192.168.99.0/24 bisa mengendalikan seluruh infrastruktur. Lindungi dengan firewall policy ketat + SSH key + akun per-admin (Part 29).',
      challenge: 'Di lab: beri SW1 IP 192.168.99.2 via SVI VLAN 99. Dari PC VLAN 20, coba ping 192.168.99.2 — harusnya gagal (belum ada routing). Catat mengapa ini perilaku yang BENAR dari sisi keamanan.',
      interviewQ: 'Q: "Apa itu SVI dan untuk apa di switch Layer 2?" — A: Switched Virtual Interface — interface virtual yang mewakili sebuah VLAN di switch. Di switch L2 murni dipakai untuk memberi IP management agar switch bisa di-remote/monitor; bukan untuk routing.',
      quiz: [
        {
          q: 'Apa fungsi VLAN management (99)?',
          options: [
            'Menampung PC karyawan',
            'Jalur khusus admin untuk mengelola perangkat (SSH/SNMP/monitoring), terisolasi dari user',
            'Menyimpan backup konfigurasi',
            'Mempercepat internet',
          ],
          answer: 1,
          explain: 'VLAN 99 = bidang kontrol: hanya untuk mengelola & memonitor perangkat, terpisah dari traffic user.',
        },
        {
          q: 'Apa itu SVI pada switch Layer 2?',
          options: [
            'Port fisik nomor 99',
            'Interface virtual yang mewakili VLAN di switch; dipakai memberi IP management',
            'Protokol routing',
            'Kabel console',
          ],
          answer: 1,
          explain: 'SVI (interface vlan 99) adalah "wajah" switch di VLAN itu — tempat IP management ditempel.',
        },
        {
          q: 'Apa fungsi ip default-gateway pada switch L2?',
          options: [
            'Agar switch bisa routing antar VLAN',
            'Agar switch bisa dijangkau dari subnet lain (mis. admin di lokasi berbeda)',
            'Agar DHCP berjalan',
            'Tidak ada fungsi',
          ],
          answer: 1,
          explain: 'Switch L2 tidak routing; default-gateway hanya agar traffic management-nya sendiri bisa keluar subnet.',
        },
      ],
    },
    {
      id: '9.7',
      title: 'VLAN Native',
      body: `
<p><b>VLAN native</b> dalam konteks VLAN adalah penerapan konsep dari 8.9: satu VLAN per trunk yang frame-nya dikirim <b>untagged</b>. Sub-bab ini fokus pada <b>konfigurasi dan troubleshooting</b>-nya dalam desain VLAN kita.</p>
<h3>Konfigurasi Standar</h3>
<pre>SW1(config)# interface fa0/24
SW1(config-if)# switchport trunk native vlan 99
! ALASAN: samakan native di seluruh trunk organisasi (kita pilih 99).
! Native 99 = VLAN management yang tidak menampung end device user —
! menutup vektor serangan double tagging (8.9).</pre>
<h3>Native VLAN Mismatch: Diagnosis Lengkap</h3>
<p>Gejala khas: <b>perangkat mendapat IP dari subnet yang salah</b> (mis. PC VLAN 20 dapat IP 192.168.99.x dari DHCP), atau traffic "bocor" antar VLAN tanpa routing.</p>
<pre>! LANGKAH 1 — lihat peringatan CDP:
SW1# show cdp neighbors detail | include Native
Native VLAN: 1
! Bandingkan dengan sisi lawan. Beda? → mismatch confirmed.

! LANGKAH 2 — cek konfigurasi kedua sisi:
SW1# show interfaces fa0/24 trunk | include Native
SW2# show interfaces fa0/24 trunk | include Native

! LANGKAH 3 — samakan (pilih standar organisasi, mis. 99):
SW1(config-if)# switchport trunk native vlan 99
SW2(config-if)# switchport trunk native vlan 99</pre>
<div class="callout"><div class="t">Jebakan "Sudah Sama Tapi Masih Error"</div><p style="margin:4px 0 0">Native VLAN yang sama tetapi <b>tidak ada di allowed list</b> salah satu sisi juga bermasalah: frame untagged tetap ditolak. Selalu cek native DAN allowed list berpasangan.</p></div>
<h3>Checklist Trunk Sehat (hafalkan)</h3>
<ol>
<li>Mode trunk di kedua sisi (<code>show interfaces trunk</code> → trunking).</li>
<li>Encapsulation dot1q di kedua sisi.</li>
<li>Native VLAN <b>sama</b> di kedua sisi.</li>
<li>Allowed VLAN list <b>mencakup</b> VLAN yang dibutuhkan di kedua sisi.</li>
<li>VLAN ada di database <b>kedua</b> switch.</li>
</ol>`,
      terms: [
        ['Native VLAN (konfigurasi)', 'VLAN untagged di trunk; wajib sama di kedua sisi + ada di allowed list.'],
      ],
      diagram: `<pre>CHECKLIST TRUNK SEHAT (tempel di NOC)

 SW1 Fa0/24 ══════════════ Fa0/24 SW2
 [1] mode trunk ......... ✔ = ✔
 [2] encapsulation dot1q  ✔ = ✔
 [3] native vlan 99 ...... ✔ = ✔   ← HARUS SAMA
 [4] allowed 10,20,30,99  ✔ ⊇ ✔   ← HARUS MENCAKUP
 [5] VLAN di database .... ✔ = ✔   ← TIDAK MENULAR OTOMATIS</pre>`,
      scenario: 'Sehabis penggantian switch darurat tengah malam, helpdesk dibanjiri laporan "dapat IP aneh". Pagi harinya engineer mengecek: switch baru masih native VLAN 1 (default pabrik), trunk lama native 99. Lima menit perbaikan, ratusan user kembali normal — dan checklist trunk sehat lahir dari insiden ini.',
      bestPractices: 'Jadikan 5-poin checklist di atas sebagai SOP setiap instalasi/penggantian switch. Native VLAN adalah item yang paling sering terlewat karena "kelihatannya sepele".',
      security: 'Native VLAN default (1) di trunk production adalah undangan double tagging. Standarkan native ke VLAN khusus non-user di seluruh organisasi dan audit berkala.',
      challenge: 'Buat native mismatch di lab, lalu dokumentasikan: (a) pesan CDP persisnya, (b) gejala dari sisi PC (ipconfig), (c) output show sebelum & sesudah perbaikan. Ini latihan laporan insiden.',
      interviewQ: 'Q: "Sebutkan checklist verifikasi trunk yang sehat." — A: Mode trunk kedua sisi, encapsulation dot1q, native VLAN sama, allowed list mencakup VLAN kebutuhan, dan VLAN terdaftar di database kedua switch.',
      quiz: [
        {
          q: 'Native VLAN sama di kedua sisi (99) tetapi 99 tidak ada di allowed list SW2. Apa akibatnya?',
          options: [
            'Tidak masalah, native selalu lewat',
            'Frame untagged native tetap ditolak di SW2 — native harus juga ada di allowed list',
            'Trunk berubah jadi access',
            'VLAN 99 terhapus',
          ],
          answer: 1,
          explain: 'Allowed list memfilter SEMUA VLAN termasuk native. Native sama saja tidak cukup.',
        },
        {
          q: 'Gejala apa yang paling khas dari native VLAN mismatch?',
          options: [
            'Semua port mati',
            'Perangkat mendapat IP dari subnet VLAN yang salah / traffic bocor antar VLAN tanpa routing',
            'Switch reboot sendiri',
            'Kabel terasa panas',
          ],
          answer: 1,
          explain: 'Frame untagged diinterpretasikan sebagai VLAN berbeda di tiap sisi → DHCP/IP nyasar ke subnet yang salah.',
        },
        {
          q: 'Perintah untuk melihat native VLAN sebuah trunk adalah…',
          options: [
            'show ip route',
            'show interfaces trunk (kolom Native vlan) / show interfaces fa0/24 trunk',
            'show vlan brief',
            'show mac address-table',
          ],
          answer: 1,
          explain: 'show interfaces trunk menampilkan native VLAN, mode, encapsulation, dan allowed list per trunk.',
        },
      ],
    },
    {
      id: '9.8',
      title: 'Inter-VLAN Routing',
      body: `
<p><b>Inter-VLAN routing</b> adalah proses meneruskan traffic <b>antar VLAN</b> (yang berarti antar subnet, sesuai aturan emas). Karena VLAN mengisolasi di Layer 2, satu-satunya jalan antar VLAN adalah lewat <b>perangkat Layer 3</b> — router atau Layer 3 switch.</p>
<h3>Mengapa Harus Lewat Layer 3?</h3>
<p>Ingat aturan emas: 1 VLAN = 1 subnet = 1 broadcast domain. PC VLAN 20 (192.168.20.50) ingin ke server VLAN 30 (192.168.30.10):</p>
<ol>
<li>PC sadar tujuan beda subnet → kirim ke <b>default gateway</b>-nya (bukan langsung ke server).</li>
<li>Gateway adalah interface router/L3 di VLAN 20 (192.168.20.1).</li>
<li>Router melihat routing table → tujuan 192.168.30.0/24 ada → teruskan lewat interface VLAN 30 (192.168.30.1).</li>
<li>Server terima; balasannya menempuh jalan sebaliknya.</li>
</ol>
<p>Setiap VLAN butuh <b>gateway</b> — IP interface Layer 3 di subnet VLAN itu (biasanya .1). Tanpa gateway yang benar di PC, inter-VLAN routing mustahil meski router-nya sempurna.</p>
<h3>Dua Metode Inter-VLAN Routing</h3>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Perangkat</th><th>Cara</th><th>Kapan Dipakai</th></tr>
<tr><td><b>Router-on-a-stick</b> (9.9)</td><td>Router + 1 kabel trunk</td><td>Subinterface per VLAN di satu port fisik</td><td>Jaringan kecil, budget terbatas, router sudah ada</td></tr>
<tr><td><b>Layer 3 switching</b> (9.10)</td><td>Multilayer switch</td><td>SVI per VLAN + ip routing di switch</td><td>Enterprise; butuh throughput antar-VLAN besar</td></tr>
<tr><td><i>Legacy (tidak disarankan)</i></td><td>Router + banyak kabel</td><td>1 port fisik per VLAN</td><td>Hanya historis — boros port</td></tr>
</table></div>
<h3>Packet Flow: PC OFFICE → Server</h3>
<pre>PC-A (VLAN 20, 192.168.20.50)  →  Server (VLAN 30, 192.168.30.10)

1. PC-A: tujuan 192.168.30.10 beda subnet → frame ke gateway
   [dst MAC = MAC gateway 192.168.20.1 | dst IP = 192.168.30.10]
2. Switch (VLAN 20): forward ke trunk → router
3. ROUTER: buka Layer 3 → routing table → 192.168.30.0/24 via VLAN 30
   → tulis ulang frame: [dst MAC = MAC server | src MAC = MAC router VLAN 30]
4. Switch (VLAN 30): forward ke server ✔
5. Balasan: server → gateway-nya (192.168.30.1) → router → PC-A

Catatan: MAC address BERUBAH di tiap hop Layer 3, IP TIDAK berubah.</pre>
<div class="callout blue"><div class="t">Syarat Mutlak Inter-VLAN Routing</div><p style="margin:4px 0 0">(1) Setiap VLAN punya gateway (.1) yang hidup di perangkat L3; (2) default gateway di setiap PC menunjuk ke IP itu; (3) trunk membawa VLAN-VLAN tersebut ke perangkat L3. Gagal satu = antar-VLAN mati total.</p></div>`,
      terms: [
        ['Inter-VLAN routing', 'Penerusan traffic antar VLAN via perangkat Layer 3; wajib karena tiap VLAN = subnet berbeda.'],
        ['Default gateway', 'IP router/L3 di subnet lokal; tempat PC mengirim traffic ke subnet lain.'],
        ['Router-on-a-stick', 'Satu port router dibagi jadi subinterface per VLAN via trunk.'],
        ['Layer 3 switch (multilayer switch)', 'Switch yang bisa routing antar VLAN memakai SVI.'],
      ],
      diagram: `<pre>INTER-VLAN ROUTING — "satpam antar ruangan"

 ┌VLAN 20──────────┐                    ┌VLAN 30──────────┐
 │ PC-A .20.50     │                    │ Server .30.10   │
 │ gateway .20.1   │                    │ gateway .30.1   │
 └───────┬─────────┘                    └────────▲────────┘
         │ trunk (tagged 20,30)                 │ trunk (tagged 30)
         ▼                                      │
 ┌──────────────── ROUTER / L3 SWITCH ──────────┘
 │ .20.1 (VLAN 20) │ .30.1 (VLAN 30)  ← gateway tiap VLAN
 │ routing table: 20.0/24 & 30.0/24 = directly connected
 └──────────────────────────────────────────────┘
   Tanpa perangkat ini, VLAN 20 dan 30 TAK PERNAH bertemu.</pre>`,
      scenario: 'User VLAN 20 butuh akses aplikasi di server VLAN 30. Di jaringan flat lama, "akses" berarti semua orang bisa ke server. Dengan inter-VLAN routing + firewall policy, hanya user terdaftar yang boleh ke port aplikasi server — isolasi tetap, bisnis tetap jalan. Inilah VLAN yang "pintar": terisolasi tetapi terhubung terkendali.',
      bestPractices: 'Selalu gunakan .1 sebagai gateway tiap subnet agar konsisten dan mudah diingat. Dokumentasikan tabel gateway (VLAN → gateway IP) bersama tabel VLAN.',
      security: 'Inter-VLAN routing tanpa policy = VLAN menjadi sia-sia (semua bisa ke semua). Selalu pasang ACL/firewall policy di titik routing: definisikan siapa boleh ke mana, per VLAN.',
      challenge: 'Jelaskan mengapa PC dengan default gateway yang salah (mis. 192.168.20.99 padahal gateway .20.1) tetap bisa ping sesama VLAN 20 tetapi gagal ke VLAN 30. Kaitkan dengan packet flow di materi.',
      interviewQ: 'Q: "Mengapa komunikasi antar VLAN butuh router?" — A: Karena tiap VLAN adalah subnet/broadcast domain berbeda; switch Layer 2 tidak bisa meneruskan antar subnet. Butuh perangkat Layer 3 dengan gateway di tiap VLAN dan routing table yang menghubungkannya.',
      quiz: [
        {
          q: 'Mengapa inter-VLAN routing harus lewat perangkat Layer 3?',
          options: [
            'Karena switch terlalu lambat',
            'Karena tiap VLAN = subnet berbeda, dan hanya perangkat Layer 3 yang bisa meneruskan antar subnet',
            'Karena VLAN memakai kabel berbeda',
            'Karena PC tidak mendukung VLAN',
          ],
          answer: 1,
          explain: 'Aturan emas: 1 VLAN = 1 subnet. Antar subnet = butuh routing (Layer 3).',
        },
        {
          q: 'Dalam packet flow PC-A (VLAN 20) ke server (VLAN 30), apa yang berubah di router?',
          options: [
            'IP source dan destination berubah',
            'MAC source/destination ditulis ulang per hop Layer 3; IP tetap',
            'VLAN ID dihapus permanen',
            'Tidak ada yang berubah',
          ],
          answer: 1,
          explain: 'Prinsip routing: MAC berubah tiap hop (hop-to-hop), IP end-to-end tetap.',
        },
        {
          q: 'Apa tiga syarat mutlak agar inter-VLAN routing jalan?',
          options: [
            'Kabel mahal, switch baru, internet cepat',
            'Gateway (.1) hidup per VLAN, default gateway PC benar, trunk membawa VLAN ke perangkat L3',
            'Semua PC satu VLAN, DHCP mati, firewall mati',
            'VLAN ID sama semua, subnet sama semua',
          ],
          answer: 1,
          explain: 'Tiga syarat: gateway per VLAN hidup, default gateway PC menunjuk ke sana, dan trunk mengantar VLAN ke perangkat L3.',
        },
      ],
    },
    {
      id: '9.9',
      title: 'Router-on-a-Stick',
      body: `
<p><b>Router-on-a-stick (ROAS)</b> adalah metode inter-VLAN routing memakai <b>satu port fisik router</b> yang dipecah menjadi <b>subinterface logis</b> — satu subinterface per VLAN — terhubung ke switch via <b>satu kabel trunk</b>. Namanya "stick" karena topologinya seperti permen lolipop: satu tangkai (kabel) dengan banyak permen (VLAN).</p>
<h3>Kapan Memakai ROAS?</h3>
<ul>
<li>Jaringan kecil–menengah dengan traffic antar-VLAN moderat.</li>
<li>Router sudah tersedia dan belum ada budget Layer 3 switch.</li>
<li>Lab belajar — ROAS adalah cara termurah memahami inter-VLAN routing.</li>
</ul>
<p>Keterbatasan: <b>satu kabel = satu bottleneck</b> — semua traffic antar-VLAN berebut bandwidth satu link fisik. Untuk traffic besar, gunakan Layer 3 switching (9.10).</p>
<h3>Lab Terpandu: ROAS untuk 5 VLAN (Cisco)</h3>
<p><b>Topology:</b> SW1 Fa0/24 (trunk, allowed 10,20,30,40,99, native 99) ──kabel── Router R1 Gi0/0.</p>
<p><b>Objective:</b> tiap VLAN punya gateway (.1); PC VLAN 20 bisa ping server VLAN 30; GUEST (40) hanya bisa ke internet (didemokan via ACL sederhana).</p>
<h3>Configuration — Switch</h3>
<pre>SW1(config)# interface fa0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk encapsulation dot1q
SW1(config-if)# switchport trunk allowed vlan 10,20,30,40,99
SW1(config-if)# switchport trunk native vlan 99
! ALASAN: trunk ke router harus membawa SEMUA VLAN yang butuh routing,
! termasuk 40 (GUEST) — policy "internet only"-nya ditegakkan di router via ACL.</pre>
<h3>Configuration — Router (inti ROAS)</h3>
<pre>R1(config)# interface gi0/0
R1(config-if)# no shutdown
! ALASAN: port fisiknya sendiri TIDAK diberi IP — ia hanya "tangkai".
! Ia harus up agar subinterface di atasnya bisa up.

R1(config)# interface gi0/0.10
! ALASAN: buat SUBINTERFACE .10 — interface logis di atas Gi0/0.
! Angka 10 bebas, tetapi konvensi "samakan dengan VLAN ID" mencegah
! kebingungan (gi0/0.10 = VLAN 10).

R1(config-subif)# encapsulation dot1q 10
! ALASAN: WAJIB dan harus dikonfigurasi DULU sebelum ip address —
! perintah ini memberitahu router "subinterface ini menangani frame
! bertag VLAN 10". Tanpa ini, router tak tahu tag mana milik siapa.

R1(config-subif)# ip address 192.168.10.1 255.255.255.0
! ALASAN: gateway VLAN 10 (CCTV). Sesuai aturan emas: 1 VLAN = 1 subnet.

R1(config)# interface gi0/0.20
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0

R1(config)# interface gi0/0.30
R1(config-subif)# encapsulation dot1q 30
R1(config-subif)# ip address 192.168.30.1 255.255.255.0

R1(config)# interface gi0/0.40
R1(config-subif)# encapsulation dot1q 40
R1(config-subif)# ip address 192.168.40.1 255.255.255.0

R1(config)# interface gi0/0.99
R1(config-subif)# encapsulation dot1q 99 native
! ALASAN: kata kunci "native" karena VLAN 99 adalah native di trunk ini —
! frame-nya datang untagged, jadi router harus tahu itu milik VLAN 99.

R1(config-subif)# ip address 192.168.99.1 255.255.255.0</pre>
<h3>Verification</h3>
<pre>R1# show ip interface brief
Interface     IP-Address      Status  Protocol
Gi0/0         unassigned      up      up
Gi0/0.10      192.168.10.1    up      up
Gi0/0.20      192.168.20.1    up      up
Gi0/0.30      192.168.30.1    up      up
Gi0/0.40      192.168.40.1    up      up
Gi0/0.99      192.168.99.1    up      up
! ✔ Semua subinterface up/up — "tangkai" dan "permen" hidup semua.

R1# show ip route
C    192.168.10.0/24 is directly connected, Gi0/0.10
C    192.168.20.0/24 is directly connected, Gi0/0.20
C    192.168.30.0/24 is directly connected, Gi0/0.30
C    192.168.40.0/24 is directly connected, Gi0/0.40
C    192.168.99.0/24 is directly connected, Gi0/0.99
! ✔ Lima rute connected otomatis — router kini tahu jalan ke semua VLAN.
! Dari PC: pastikan default gateway = .1 di subnetnya masing-masing.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> hapus <code>encapsulation dot1q 30</code> dari Gi0/0.30 (atau salah ketik jadi 300).</li>
<li><b>Gejala:</b> hanya VLAN 30 yang mati total (tidak bisa ke mana-mana); VLAN lain normal. <code>show ip interface brief</code> → Gi0/0.30 down/down.</li>
<li><b>Troubleshoot:</b> subinterface down = encapsulation atau trunk bermasalah. Cek <code>show running-config interface gi0/0.30</code> → encapsulation hilang/salah.</li>
<li><b>Fix:</b> konfigurasi ulang <code>encapsulation dot1q 30</code> <i>sebelum</i> ip address.</li>
<li><b>Final verification:</b> Gi0/0.30 up/up + ping dari VLAN 20 ke server VLAN 30 berhasil.</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab ROAS sempurna untuk belajar. Di production modern, ROAS jarang dipakai untuk traffic besar karena bottleneck satu kabel — enterprise memakai Layer 3 switch (9.10) atau firewall sebagai gerbang antar-VLAN. Pahami ROAS sebagai fondasi konsep, bukan tujuan akhir desain.</p></div>`,
      terms: [
        ['Router-on-a-stick (ROAS)', 'Inter-VLAN routing via satu port router yang dipecah jadi subinterface per VLAN, terhubung trunk ke switch.'],
        ['Subinterface', 'Interface logis di atas port fisik (mis. Gi0/0.20); satu subinterface = satu VLAN.'],
        ['encapsulation dot1q', 'Perintah yang mengikat subinterface ke VLAN ID tertentu pada trunk.'],
      ],
      diagram: `<pre>ROUTER-ON-A-STICK — satu tangkai, banyak VLAN

                    R1
              ┌─────────────┐
              │ Gi0/0 (tangkai, tanpa IP) │
              └──────┬──────┘
                     │ 1 kabel TRUNK (tagged 10,20,30,40 + native 99)
              ┌──────┴──────┐
              │  SW1 Fa0/24 │
              └─────────────┘
   Subinterface logis di R1:
   Gi0/0.10 → 192.168.10.1 (gw CCTV)     Gi0/0.40 → 192.168.40.1 (gw GUEST)
   Gi0/0.20 → 192.168.20.1 (gw OFFICE)    Gi0/0.99 → 192.168.99.1 (gw MGMT)
   Gi0/0.30 → 192.168.30.1 (gw SERVER)

   "satu kabel menanggung semua traffic antar-VLAN" = bottleneck ROAS</pre>`,
      scenario: 'Sekolah dengan 4 lab komputer memakai satu router bekas dan satu switch. Dengan ROAS, tiap lab jadi VLAN tersendiri (murid tidak bisa mengintip lab lain) tanpa beli perangkat baru. Total biaya: nol — hanya konfigurasi. Kasus klasik ROAS sebagai solusi budget.',
      bestPractices: 'Nomori subinterface sama dengan VLAN ID (Gi0/0.20 = VLAN 20). Selalu tulis encapsulation SEBELUM ip address. Dokumentasikan tabel subinterface ↔ VLAN ↔ gateway.',
      security: 'ROAS menaruh semua gateway di satu router — amankan router ini maksimal (Part 29): ia adalah titik kontrol seluruh traffic antar-VLAN. Satu router jebol = semua segmen jebol.',
      challenge: 'Lab: bangun ROAS 3 VLAN (20, 30, 99). Buktikan: (1) ping antar VLAN jalan; (2) cabut kabel trunk → semua antar-VLAN mati (single point of failure); (3) tulis mengapa ini bottleneck dan kapan harus pindah ke L3 switching.',
      interviewQ: 'Q: "Jelaskan router-on-a-stick dan kelemahannya." — A: Satu port router dipecah jadi subinterface per VLAN (encapsulation dot1Q + IP gateway), terhubung via satu trunk ke switch. Kelemahan: seluruh traffic antar-VLAN melewati satu kabel — bottleneck dan single point of failure; untuk skala besar gunakan Layer 3 switching.',
      quiz: [
        {
          q: 'Apa itu router-on-a-stick?',
          options: [
            'Router dengan satu antena',
            'Satu port fisik router dipecah menjadi subinterface logis per VLAN, terhubung ke switch via satu trunk',
            'Router yang dipasang vertikal di rak',
            'Teknik menumpuk banyak router',
          ],
          answer: 1,
          explain: 'ROAS = satu "tangkai" (port+trunk) melayani banyak VLAN via subinterface (Gi0/0.10, .20, dst).',
        },
        {
          q: 'Urutan perintah yang benar saat membuat subinterface adalah…',
          options: [
            'ip address dulu, baru encapsulation',
            'encapsulation dot1q dulu, baru ip address',
            'no shutdown dulu, baru encapsulation',
            'Bebas, urutan tidak penting',
          ],
          answer: 1,
          explain: 'IOS menolak/menolak berfungsinya IP tanpa encapsulation yang mengikat subinterface ke VLAN ID.',
        },
        {
          q: 'Apa kelemahan utama ROAS dibanding Layer 3 switching?',
          options: [
            'Konfigurasinya terlalu mudah',
            'Satu kabel trunk menjadi bottleneck untuk seluruh traffic antar-VLAN dan single point of failure',
            'Tidak mendukung DHCP',
            'Hanya mendukung 2 VLAN',
          ],
          answer: 1,
          explain: 'Semua antar-VLAN berebut satu link fisik — cocok untuk lab/skala kecil, tidak untuk enterprise sibuk.',
        },
      ],
    },
    {
      id: '9.10',
      title: 'Layer 3 Switching',
      body: `
<p><b>Layer 3 switch</b> (multilayer switch) adalah switch yang <b>bisa routing</b>: ia meneruskan frame di Layer 2 <i>dan</i> me-routing packet antar VLAN di Layer 3 — dengan kecepatan hardware (ASIC), jauh lebih cepat dari router software untuk traffic lokal.</p>
<h3>ROAS vs Layer 3 Switching</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Router-on-a-Stick</th><th>Layer 3 Switching</th></tr>
<tr><td>Perangkat</td><td>Router biasa + switch L2</td><td>Satu multilayer switch</td></tr>
<tr><td>Kecepatan antar-VLAN</td><td>Terbatas CPU router & 1 kabel</td><td>Wire-speed (hardware ASIC)</td></tr>
<tr><td>Skalabilitas</td><td>Kecil–menengah</td><td>Enterprise / campus / data center</td></tr>
<tr><td>Biaya</td><td>Murah (pakai yang ada)</td><td>Lebih mahal (switch L3)</td></tr>
<tr><td>Fitur WAN/NAT</td><td>Lengkap (router asli)</td><td>Terbatas (fokus LAN)</td></tr>
</table></div>
<p>Arsitekturnya: <b>L3 switch untuk routing cepat di dalam LAN</b>, router/firewall tetap di perbatasan (ke internet/WAN) untuk NAT & security policy. Keduanya saling melengkapi, bukan saling menggantikan.</p>
<h3>Konfigurasi: SVI + IP Routing (Cisco)</h3>
<pre>SW-L3(config)# ip routing
! ALASAN: perintah sakti ini MENGAKTIFKAN fungsi routing di switch.
! Tanpa ini, switch L3 berperilaku seperti switch L2 biasa dan SVI
! hanya bisa jadi IP management. Ini langkah yang paling sering lupa!

SW-L3(config)# vlan 20
SW-L3(config-vlan)# name OFFICE
SW-L3(config-vlan)# vlan 30
SW-L3(config-vlan)# name SERVER
! (buat juga 10, 40, 99 sesuai desain)

SW-L3(config)# interface vlan 20
SW-L3(config-if)# ip address 192.168.20.1 255.255.255.0
SW-L3(config-if)# no shutdown
! ALASAN: SVI di L3 switch = GATEWAY VLAN 20. Sama seperti SVI management
! (9.6), tetapi kini dengan ip routing aktif, SVI menjadi interface routing.

SW-L3(config)# interface vlan 30
SW-L3(config-if)# ip address 192.168.30.1 255.255.255.0
SW-L3(config-if)# no shutdown
! Ulangi untuk VLAN 10, 40, 99.</pre>
<h3>Verification</h3>
<pre>SW-L3# show ip interface brief | include Vlan
Vlan10  192.168.10.1  up  up
Vlan20  192.168.20.1  up  up
Vlan30  192.168.30.1  up  up
! ✔ SVI up — tetapi SVI hanya up jika VLAN ada & ada port/trunk up di VLAN itu!

SW-L3# show ip route
C  192.168.10.0/24 is directly connected, Vlan10
C  192.168.20.0/24 is directly connected, Vlan20
C  192.168.30.0/24 is directly connected, Vlan30
! ✔ Sama seperti ROAS: rute connected otomatis per SVI.</pre>
<div class="callout"><div class="t">SVI Down Padahal Konfigurasi Benar?</div><p style="margin:4px 0 0">SVI hanya <b>up</b> jika: (1) VLAN ada di database, DAN (2) minimal satu port access VLAN itu up <i>atau</i> trunk yang membawa VLAN itu up. SVI down = cek dua syarat ini, bukan mengutak-atik IP-nya.</p></div>`,
      terms: [
        ['Layer 3 switch / multilayer switch', 'Switch yang bisa routing antar VLAN dengan kecepatan hardware.'],
        ['ip routing', 'Perintah mengaktifkan fungsi routing di multilayer switch Cisco.'],
        ['Wire-speed', 'Kecepatan pemrosesan setara kecepatan kabel (hardware ASIC), tanpa bottleneck CPU.'],
        ['ASIC', 'Application-Specific Integrated Circuit — chip khusus yang memproses forwarding/route di hardware.'],
      ],
      diagram: `<pre>L3 SWITCH — routing di dalam switch (wire-speed)

        ┌───────────── SW-L3 (ip routing) ─────────────┐
        │  Vlan10 .10.1 │ Vlan20 .20.1 │ Vlan30 .30.1  │ ← SVI = gateway
        │  ─────── routing table (hardware) ────────   │
        │  Fa0/6 (acc 10) Fa0/5 (acc 20) Fa0/10(acc 30)│
        └─────────────────────────────────────────────┘
           │                │                 │
         CCTV             OFFICE            SERVER

   PC .20.50 → Server .30.10: switch me-routing LANGSUNG di hardware,
   tanpa kabel trunk ke router luar. Jauh lebih cepat dari ROAS.</pre>`,
      scenario: 'Kampus dengan 2000 user: traffic antar-VLAN (user ke server lokal) mencapai 20 Gbps. ROAS dengan 1 kabel 1 Gbps mustahil. Satu Layer 3 switch distribusi me-routing semuanya di hardware — latency antar-VLAN di bawah 1 ms. Inilah alasan setiap desain enterprise (Part 20) memakai L3 switch di lapisan distribusi.',
      bestPractices: 'Aktifkan ip routing sebagai langkah pertama sebelum heran "kenapa SVI tidak routing". Gunakan L3 switch untuk inter-VLAN di LAN; tetap pakai router/firewall untuk NAT, VPN, dan policy ke internet.',
      security: 'L3 switch me-routing semua VLAN secara default (tanpa filter). Pasang ACL di SVI untuk membatasi antar-VLAN (mis. GUEST tidak boleh ke SERVER) — atau VLAN-mu hanya sekat administratif tanpa keamanan.',
      challenge: 'Bandingkan di kertas: untuk kantor 300 user dengan server lokal, hitung kasar kebutuhan throughput antar-VLAN dan tentukan: cukup ROAS 1 Gbps atau butuh L3 switch? Tulis asumsimu.',
      interviewQ: 'Q: "Kapan memakai Layer 3 switch dibanding router-on-a-stick?" — A: Saat traffic antar-VLAN besar — L3 switch me-routing di hardware (wire-speed) tanpa bottleneck satu kabel. ROAS cukup untuk skala kecil/lab; enterprise memakai L3 switch di distribusi + router/firewall di edge.',
      quiz: [
        {
          q: 'Perintah apa yang mengaktifkan fungsi routing di multilayer switch Cisco?',
          options: [
            'ip route',
            'ip routing',
            'router ospf',
            'switchport mode trunk',
          ],
          answer: 1,
          explain: 'ip routing mengaktifkan Layer 3 forwarding; tanpanya switch L3 hanya berperilaku seperti switch L2.',
        },
        {
          q: 'SVI VLAN 20 sudah diberi IP tetapi status down. Penyebab paling mungkin?',
          options: [
            'IP address salah ketik',
            'VLAN 20 tidak ada di database ATAU tidak ada port/trunk up yang membawa VLAN 20',
            'Kabel console rusak',
            'Harus reboot switch',
          ],
          answer: 1,
          explain: 'SVI up mensyaratkan VLAN ada + minimal satu port/trunk up di VLAN itu. Cek dua syarat ini dulu.',
        },
        {
          q: 'Keunggulan utama Layer 3 switching dibanding ROAS adalah…',
          options: [
            'Konfigurasi lebih sedikit',
            'Routing antar-VLAN di hardware (wire-speed), tanpa bottleneck satu kabel trunk',
            'Bisa menggantikan firewall',
            'Lebih murah',
          ],
          answer: 1,
          explain: 'L3 switch me-routing di ASIC setara kecepatan kabel; ROAS terbatas CPU router dan satu link fisik.',
        },
      ],
    },
    {
      id: '9.11',
      title: 'VLAN Security',
      body: `
<p>VLAN mengisolasi — tetapi isolasi yang <b>dikonfigurasi ceroboh bisa ditembus</b>. Sub-bab ini memetakan serangan VLAN yang wajib diketahui dan mitigasi masing-masing.</p>
<h3>Serangan 1: VLAN Hopping via DTP (Dynamic Trunking Protocol)</h3>
<p>DTP adalah protokol Cisco yang menegosiasikan "kita trunk atau access?" secara otomatis. Jika port menghadap user dibiarkan <b>dynamic auto/desirable</b>, attacker cukup mengirim frame DTP desirable dari laptopnya — port berubah menjadi <b>trunk</b>, dan attacker menerima traffic <b>semua VLAN</b>.</p>
<p><b>Mitigasi:</b></p>
<pre>SW(config-if)# switchport mode access
SW(config-if)# switchport nonegotiate
! ALASAN: kunci port sebagai access dan MATIKAN negosiasi DTP.
! Terapkan di SEMUA port yang menghadap end device. Port trunk antar
! switch pun sebaiknya nonegotiate + mode trunk eksplisit.</pre>
<h3>Serangan 2: Double Tagging</h3>
<p>Attacker mengirim frame dengan <b>dua tag 802.1Q</b>: tag luar = native VLAN, tag dalam = VLAN target. Switch pertama melepas tag luar (karena native = untagged), switch kedua membaca tag dalam — frame <b>melompat ke VLAN target</b> tanpa routing. Serangan ini satu arah (sulit untuk reply), tetapi cukup untuk injeksi traffic jahat.</p>
<p><b>Mitigasi:</b> (1) jangan pakai VLAN 1 / VLAN user sebagai native; (2) samakan native di kedua sisi; (3) native = VLAN khusus tanpa end device (lihat 8.9).</p>
<h3>Serangan 3: MAC Flooding & MAC Spoofing</h3>
<p>Membanjiri CAM table hingga penuh → switch flooding terus-menerus → attacker menguping (lihat 8.2, 8.5). Atau memalsukan source MAC untuk meracuni tabel.</p>
<p><b>Mitigasi: port-security</b> (detail penuh di Part 29):</p>
<pre>SW(config-if)# switchport port-security
SW(config-if)# switchport port-security maximum 2
SW(config-if)# switchport port-security violation restrict
! ALASAN: batasi jumlah MAC per port (2 = PC + VoIP phone mis.).
! Pelanggaran → restrict (drop + log). Opsi lain: protect (drop diam-diam)
! atau shutdown (port mati — paling keras, butuh intervensi manual).</pre>
<h3>Ringkasan Mitigasi</h3>
<div class="tblwrap"><table>
<tr><th>Serangan</th><th>Vektor</th><th>Mitigasi</th></tr>
<tr><td>VLAN hopping (DTP)</td><td>Port dynamic ke user</td><td>switchport mode access + nonegotiate di semua port akses</td></tr>
<tr><td>Double tagging</td><td>Native VLAN</td><td>Native = VLAN khusus non-user, samakan kedua sisi</td></tr>
<tr><td>MAC flooding/spoofing</td><td>CAM table</td><td>Port-security: batasi MAC per port</td></tr>
<tr><td>Akses antar-VLAN liar</td><td>Routing tanpa filter</td><td>ACL di SVI / firewall policy antar VLAN</td></tr>
</table></div>
<div class="callout blue"><div class="t">Prinsipnya</div><p style="margin:4px 0 0">VLAN adalah <b>sekat</b>, bukan <b>kunci</b>. Sekat mencegah kecelakaan dan membatasi ledakan; kunci (ACL, firewall, port-security) mencegah kesengajaan. Desain aman memakai keduanya.</p></div>`,
      terms: [
        ['VLAN hopping', 'Serangan pindah VLAN tanpa routing, via DTP negotiation atau double tagging.'],
        ['DTP (Dynamic Trunking Protocol)', 'Protokol Cisco untuk negosiasi trunk otomatis; matikan di port user.'],
        ['Port-security', 'Fitur membatasi jumlah & identitas MAC per port untuk melawan flooding/spoofing.'],
      ],
      diagram: `<pre>SERANGAN VLAN & MITIGASI

 [Attacker] ──DTP desirable──▶ [port dynamic] ──▶ jadi TRUNK ──▶ baca semua VLAN
                 MITIGASI: switchport mode access + nonegotiate ✋

 [Attacker] ──[tag native][tag target]──▶ SW1 lepas tag luar ──▶ SW2 baca tag dalam
                 ──▶ LOMPAT ke VLAN target
                 MITIGASI: native = VLAN khusus tanpa user, samakan kedua sisi ✋

 [Attacker] ──ribuan MAC palsu──▶ CAM penuh ──▶ flooding ──▶ uping traffic
                 MITIGASI: port-security maximum 2 + violation restrict ✋</pre>`,
      scenario: 'Penetration test di sebuah kantor menemukan port ruang meeting dalam mode dynamic auto. Tester mencolok laptop, mengirim DTP, dan dalam 30 detik menerima broadcast VLAN server. Temuan ini masuk laporan sebagai "critical". Perbaikannya 2 baris perintah per port — tetapi butuh kesadaran bahwa default Cisco tidak aman.',
      bestPractices: 'Jadikan hardening port akses sebagai template standar: mode access + nonegotiate + port-security + PortFast + shutdown port tak terpakai. Terapkan seragam di semua switch.',
      security: 'Audit VLAN adalah agenda berkala: cek port dynamic yang lolos (show interfaces switchport | include Dynamic), native VLAN trunk, dan allowed list. Serangan VLAN jarang canggih — mereka mengeksploitasi kelalaian konfigurasi.',
      challenge: 'Audit lab-mu sendiri: jalankan show interfaces status + show interfaces switchport, lalu catat setiap port yang masih dynamic/vlan 1. Tulis rencana hardening-nya per port.',
      interviewQ: 'Q: "Jelaskan dua serangan terhadap VLAN dan mitigasinya." — A: (1) VLAN hopping via DTP — port dynamic ke user dinegosiasi jadi trunk; mitigasi: mode access + nonegotiate. (2) Double tagging — dua tag mengeksploitasi native VLAN; mitigasi: native = VLAN khusus non-user dan disamakan kedua sisi.',
      quiz: [
        {
          q: 'Bagaimana serangan VLAN hopping via DTP bekerja?',
          options: [
            'Attacker menebak password switch',
            'Attacker mengirim frame DTP ke port dynamic sehingga port menjadi trunk dan menerima semua VLAN',
            'Attacker memutus kabel trunk',
            'Attacker mengubah VLAN ID di PC-nya',
          ],
          answer: 1,
          explain: 'Port dynamic auto/desirable bisa dinegosiasi menjadi trunk oleh siapa pun yang mengirim DTP desirable.',
        },
        {
          q: 'Mitigasi yang tepat untuk ancaman DTP di port user adalah…',
          options: [
            'Menghapus semua VLAN',
            'switchport mode access + switchport nonegotiate di semua port akses',
            'Mematikan switch tiap malam',
            'Mengganti kabel UTP dengan fiber',
          ],
          answer: 1,
          explain: 'Kunci mode access dan matikan negosiasi DTP — port tidak bisa lagi "dibujuk" menjadi trunk.',
        },
        {
          q: 'Apa fungsi switchport port-security maximum 2?',
          options: [
            'Membatasi kecepatan port menjadi 2 Mbps',
            'Membatasi hanya 2 MAC address yang boleh lewat port itu (melawan MAC flooding)',
            'Hanya mengizinkan 2 VLAN',
            'Membatasi 2 user login',
          ],
          answer: 1,
          explain: 'Port-security membatasi jumlah MAC per port; banjir MAC palsu akan melanggar batas dan ditindak (restrict/shutdown).',
        },
      ],
    },
    {
      id: '9.12',
      title: 'VLAN Troubleshooting',
      body: `
<p>Troubleshooting VLAN adalah keterampilan <b>paling sering dipakai</b> di NOC untuk masalah LAN. Gunakan metodologi berlapis: mulai dari yang paling dasar, naik ke atas.</p>
<h3>Metodologi 7 Langkah</h3>
<ol>
<li><b>Fisik:</b> link up? <code>show interfaces status</code> — connected atau notconnect? Kabel/VLAN tak berarti tanpa link.</li>
<li><b>VLAN database:</b> <code>show vlan brief</code> — VLAN-nya ada? Port-nya tercatat di VLAN yang benar?</li>
<li><b>Port mode:</b> <code>show interfaces X switchport</code> — access atau trunk? Operational sesuai administrative?</li>
<li><b>Trunk:</b> <code>show interfaces trunk</code> — trunking? Native sama? Allowed list mencakup VLAN?</li>
<li><b>IP & gateway:</b> di PC — <code>ipconfig</code>: IP sesuai subnet VLAN? Gateway = .1? (Aturan emas!)</li>
<li><b>Inter-VLAN:</b> gateway bisa di-ping? <code>show ip interface brief</code> di router/L3 — subinterface/SVI up?</li>
<li><b>Security/filter:</b> ada ACL/firewall yang memblokir? (Jangan tuduh ACL sebelum langkah 1–6 beres!)</li>
</ol>
<h3>Tabel Gejala → Penyebab → Cek</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Penyebab Umum</th><th>Perintah Cek</th></tr>
<tr><td>PC tidak dapat IP / APIPA (169.254.x.x)</td><td>Port salah VLAN; DHCP server beda VLAN tanpa helper</td><td>show vlan brief; ipconfig</td></tr>
<tr><td>Ping sesama VLAN gagal</td><td>Port beda VLAN; VLAN tidak ada di database; port inactive</td><td>show vlan brief; show interfaces switchport</td></tr>
<tr><td>Antar switch satu VLAN gagal</td><td>VLAN tidak ada di switch lawan; allowed list; trunk down</td><td>show interfaces trunk (kedua sisi)</td></tr>
<tr><td>Antar VLAN gagal total</td><td>Gateway salah/tidak ada; SVI/subinterface down; trunk ke router putus</td><td>show ip interface brief; ping gateway</td></tr>
<tr><td>Dapat IP subnet yang salah</td><td>Native VLAN mismatch; port salah VLAN</td><td>show interfaces trunk; show cdp neighbors detail</td></tr>
<tr><td>Sebagian VLAN mati setelah change</td><td>Allowed list tertimpa (lupa add); VLAN terhapus</td><td>show interfaces trunk; show vlan brief</td></tr>
</table></div>
<h3>Contoh Sesi Troubleshooting Lengkap</h3>
<pre>Kasus: "PC kasir (VLAN 20) tidak bisa ke server (VLAN 30)."

1. Di PC: ipconfig → 192.168.20.55, gateway 192.168.20.1 ✔ (aturan emas OK)
2. ping 192.168.20.1 → RTO ✗ (gateway saja tak bisa!)
   → masalah BUKAN inter-VLAN, melainkan akses ke gateway.
3. SW1# show vlan brief → Fa0/5 tercatat di VLAN 20 ✔
4. SW1# show interfaces fa0/5 switchport → Operational: static access, VLAN 20 ✔
5. R1# show ip interface brief → Gi0/0.20 up/up ✔
6. SW1# show interfaces trunk → Fa0/24 trunking, allowed 10,20,30,99 ✔
7. SW1# show interfaces status → Fa0/24 ... err-disabled?!
   → PENYEBAB: port-security violation mematikan trunk (lihat 9.11)!
8. Fix: shutdown → no shutdown Fa0/24 (sementara) + perbaiki penyebab
   violation (perangkat asing di port itu / maximum terlalu kecil).
9. Final: ping gateway ✔ → ping server 192.168.30.10 ✔ → tutup tiket.</pre>
<div class="callout"><div class="t">Jangan Melompat ke Kesimpulan</div><p style="margin:4px 0 0">90% kesalahan troubleshooting pemula: langsung menuduh firewall/ACL untuk masalah yang ternyata port salah VLAN atau trunk down. Ikuti urutan 1–7 — setiap langkah mengeliminasi satu lapisan, sehingga penyebabnya <i>terpaksa</i> menampakkan diri.</p></div>`,
      terms: [
        ['APIPA', 'Automatic Private IP Addressing (169.254.x.x) — IP darurat saat DHCP gagal; gejala klasik masalah VLAN/DHCP.'],
        ['err-disabled', 'Status port Cisco yang dimatikan otomatis karena pelanggaran (port-security, BPDU guard, dll).'],
      ],
      diagram: `<pre>ALUR TROUBLESHOOTING VLAN (dari bawah ke atas)

  [1] Fisik: link up? ──✗──▶ kabel/port/SFP
   │✔
  [2] VLAN database: VLAN ada? port di VLAN benar? ──✗──▶ buat/pindahkan
   │✔
  [3] Mode port: access/trunk sesuai? ──✗──▶ switchport mode ...
   │✔
  [4] Trunk: trunking? native sama? allowed cukup? ──✗──▶ perbaiki trunk
   │✔
  [5] IP PC: subnet & gateway benar? ──✗──▶ perbaiki ipconfig/DHCP
   │✔
  [6] Gateway: bisa di-ping? SVI/subif up? ──✗──▶ perbaiki L3
   │✔
  [7] Filter: ACL/firewall? ──▶ baru tuduh keamanan di SINI</pre>`,
      scenario: 'Tiket NOC: "satu lantai tidak bisa ke server". Teknisi junior langsung me-restart firewall — tidak mempan. Engineer senior mengikuti 7 langkah dan menemukan dalam 4 menit: trunk ke switch lantai itu down karena SFP kendor (langkah 1). Pelajaran: metodologi mengalahkan tebakan, setiap saat.',
      bestPractices: 'Selalu mulai dari Layer 1 dan dokumentasikan tiap langkah + output-nya di tiket. Troubleshooting tanpa catatan = mengulang pekerjaan yang sama bulan depan.',
      security: 'Perubahan troubleshooting di production (shutdown/no shutdown, ubah VLAN) tetap butuh change record — "cuma coba-coba" adalah penyebab outage nomor satu menurut banyak post-mortem.',
      challenge: 'Suntikkan 3 fault berbeda ke lab-mu (salah VLAN, trunk allowed kurang, gateway salah). Untuk tiap fault: tulis gejala, langkah diagnosis (1–7), perintah yang membuktikan, dan fix-nya. Ini portfolio troubleshooting pertamamu.',
      interviewQ: 'Q: "PC tidak bisa ping server di VLAN lain. Bagaimana kamu troubleshooting?" — A: Berlapis dari bawah: (1) cek IP & gateway PC; (2) ping gateway — gagal berarti masalah akses/trunk, bukan routing; (3) show vlan brief + switchport; (4) show interfaces trunk kedua sisi; (5) show ip interface brief di L3; (6) terakhir cek ACL/firewall.',
      quiz: [
        {
          q: 'PC mendapat IP 169.254.x.x (APIPA). Artinya…',
          options: [
            'Jaringan berjalan normal',
            'PC gagal mendapat IP dari DHCP — indikasi masalah VLAN/port atau DHCP server tak terjangkau',
            'PC terkena virus',
            'Switch perlu di-upgrade',
          ],
          answer: 1,
          explain: 'APIPA = IP darurat saat DHCP gagal; sering karena port salah VLAN atau DHCP server di VLAN lain tanpa IP helper.',
        },
        {
          q: 'Dalam metodologi 7 langkah, kapan ACL/firewall boleh "dituduh"?',
          options: [
            'Pertama, karena paling sering salah',
            'Terakhir (langkah 7), setelah fisik, VLAN, trunk, IP, dan gateway terbukti benar',
            'Tidak pernah',
            'Bersamaan dengan langkah 1',
          ],
          answer: 1,
          explain: 'Aturan troubleshooting: eliminasi lapisan bawah dulu. Menuduh ACL duluan adalah kesalahan klasik pemula.',
        },
        {
          q: 'Status err-disabled pada trunk port kemungkinan besar disebabkan oleh…',
          options: [
            'Kabel terlalu panjang',
            'Pelanggaran keamanan otomatis (port-security violation, BPDU guard, dll) yang mematikan port',
            'VLAN ID terlalu besar',
            'IP address duplikat',
          ],
          answer: 1,
          explain: 'err-disabled = port dimatikan otomatis oleh fitur proteksi; cek penyebabnya (show interfaces status err-disabled) sebelum sekadar menyalakan ulang.',
        },
      ],
    },
  ],
};
