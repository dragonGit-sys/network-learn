// Part 12 — Dynamic Routing (Fase 2: Switching & Routing).
// Materi murni: RIP vs OSPF, adjacency, area, DR/BDR, cost, troubleshooting OSPF.
import type { Part } from './types';

export const part12: Part = {
  id: '12',
  number: 'PART 12',
  title: 'Dynamic Routing',
  phaseId: 'fase-2',
  description: 'Routing dinamis: keterbatasan static route, RIP, OSPF (neighbor, area, router ID, DR/BDR, cost), dan troubleshooting OSPF.',
  repoFolder: 'part-12-dynamic-routing',
  objectives: [
    'Menjelaskan mengapa dynamic routing dibutuhkan dan keterbatasan static route di jaringan besar.',
    'Membandingkan cara kerja distance vector (RIP) dan link state (OSPF).',
    'Mengonfigurasi OSPF single-area di Cisco IOS: network statement, router ID, dan verifikasi neighbor.',
    'Menjelaskan konsep OSPF area, DR/BDR, cost, dan urutan pemilihan rute OSPF.',
    'Mendiagnosis masalah OSPF umum: neighbor stuck, area mismatch, dan router ID duplikat.',
  ],
  prerequisites: 'Part 11 (routing table, static route, AD, metric) wajib tuntas — dynamic routing adalah "sumber rute" baru di tabel itu.',
  subbabs: [
    {
      id: '12.1',
      title: 'Mengapa Dynamic Routing?',
      body: `
<p><b>Dynamic routing</b> adalah metode router <b>saling bertukar informasi rute otomatis</b> via <b>protokol routing</b> — tanpa admin mengetik tiap rute manual. Router-router "berdiskusi" tentang topologi dan menghitung jalur terbaik sendiri.</p>
<h3>Keterbatasan Static Route (Pengingat 11.4)</h3>
<ul>
<li><b>Tidak adaptif:</b> link putus → static route tetap menunjuk jalan buntu sampai diubah manual.</li>
<li><b>Tidak scalable:</b> 50 router × 200 network = ribuan baris manual — mustahil dirawat manusia.</li>
<li><b>Tidak ada failover otomatis:</b> butuh trik floating static (11.6) yang tetap manual per kasus.</li>
</ul>
<h3>Yang Dilakukan Protokol Routing</h3>
<ol>
<li><b>Discovery:</b> menemukan router tetangga (neighbor) otomatis via hello packet.</li>
<li><b>Pertukaran info:</b> berbagi daftar network yang diketahui.</li>
<li><b>Kalkulasi:</b> menghitung jalur terbaik (best path) dengan algoritma.</li>
<li><b>Adaptasi:</b> link putus → hitung ulang otomatis dalam detik–menit.</li>
</ol>
<h3>Static vs Dynamic: Kapan Memakai Apa?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Static</th><th>Dynamic (OSPF dll.)</th></tr>
<tr><td>Skala ideal</td><td>Kecil, stub, 1–2 jalur</td><td>Menengah–besar, banyak jalur</td></tr>
<tr><td>Adaptasi topologi</td><td>Manual</td><td>Otomatis</td></tr>
<tr><td>Beban admin</td><td>Rendah (sedikit rute)</td><td>Awal tinggi, operasional rendah</td></tr>
<tr><td>Kontrol jalur</td><td>Penuh & deterministik</td><td>Ikut algoritma (bisa di-tune)</td></tr>
<tr><td>Contoh wajib</td><td>Default route ke ISP</td><td>Enterprise multi-site, campus</td></tr>
</table></div>
<p>Catatan penting: keduanya <b>hidup berdampingan</b> — jaringan enterprise memakai OSPF di dalam <i>dan</i> static default route ke ISP. Bukan "salah satu", melainkan "masing-masing di tempatnya".</p>
<div class="callout blue"><div class="t">Dua Keluarga Protokol Routing</div><p style="margin:4px 0 0"><b>Distance vector</b> (RIP, 12.2): "kata tetangga" — tiap router meneruskan <i>rumor</i> rute (tujuan + jarak). Sederhana tetapi lambat & terbatas. <b>Link state</b> (OSPF, 12.3): "peta lengkap" — tiap router membangun <i>peta topologi utuh</i> lalu menghitung sendiri jalur terbaik. Cepat, scalable, standar enterprise.</p></div>`,
      terms: [
        ['Dynamic routing', 'Pertukaran info rute otomatis antar router via protokol; adaptif terhadap perubahan topologi.'],
        ['Protokol routing', 'Aturan komunikasi antar router untuk berbagi info rute (RIP, OSPF, EIGRP, BGP).'],
        ['Distance vector', 'Keluarga protokol berbasis "jarak + arah menurut tetangga" (RIP).'],
        ['Link state', 'Keluarga protokol berbasis peta topologi lengkap + kalkulasi mandiri (OSPF, IS-IS).'],
        ['Best path', 'Jalur terbaik hasil kalkulasi protokol routing (metric terkecil).'],
      ],
      diagram: `<pre>STATIC vs DYNAMIC — siapa yang bekerja saat link putus?

 STATIC:  R1 ──✂ link putus── R2      DYNAMIC: R1 ──✂ link putus── R2
          │ "rute manual               │  "tetangga, link putus!"
          │  masih menunjuk             │   → hitung ulang
          │  ke jalan buntu"            │   → pakai jalur B otomatis
          ▼                             ▼
       admin harus                 ✔ pulih sendiri
       mengetik ulang              (detik–menit)</pre>`,
      scenario: 'Jaringan retail 80 toko: tiap buka toko baru, engineer pusat harus mengetik static route di 5 router — dan tiap link ISP cabang ganti, semua harus diubah manual. Migrasi ke OSPF: toko baru cukup "diumumkan" router cabangnya, 5 router pusat belajar otomatis. Beban operasional turun 80%.',
      bestPractices: 'Aturan praktis: < 5 router dan topologi sederhana → static cukup. Lebih dari itu, atau butuh failover otomatis → dynamic. Jangan memaksakan static di jaringan yang tumbuh.',
      security: 'Protokol routing adalah "mulut" router: tanpa autentikasi, router jahat bisa bergabung dan meracuni tabel. Selalu aktifkan autentikasi protokol routing di production (Part 29).',
      challenge: 'Hitung beban admin: 20 router full-mesh butuh berapa baris static route total (tiap router tahu semua LAN)? Bandingkan dengan dynamic (cukup aktifkan protokol). Tulis angkanya — inilah argumen bisnis dynamic routing.',
      interviewQ: 'Q: "Kapan memakai static vs dynamic routing?" — A: Static untuk jaringan kecil/stub dan default route ke ISP — sederhana dan deterministik. Dynamic (OSPF) untuk jaringan menengah-besar yang butuh adaptasi otomatis dan failover. Keduanya biasa dipakai bersamaan.',
      quiz: [
        {
          q: 'Apa keunggulan utama dynamic routing dibanding static?',
          options: [
            'Konfigurasinya selalu lebih sedikit',
            'Adaptif: otomatis menemukan tetangga, menghitung best path, dan menghitung ulang saat topologi berubah',
            'Tidak butuh IP address',
            'Lebih murah perangkatnya',
          ],
          answer: 1,
          explain: 'Empat kemampuan: discovery, pertukaran info, kalkulasi best path, adaptasi otomatis — static tidak punya semuanya.',
        },
        {
          q: 'Apa perbedaan distance vector dan link state?',
          options: [
            'Tidak ada perbedaan',
            'Distance vector (RIP): meneruskan "rumor" rute dari tetangga; link state (OSPF): tiap router membangun peta topologi lengkap lalu menghitung sendiri',
            'Distance vector untuk wireless, link state untuk kabel',
            'Link state lebih tua dari distance vector',
          ],
          answer: 1,
          explain: '"Kata tetangga" vs "peta lengkap" — perbedaan fundamental cara kedua keluarga protokol bekerja.',
        },
        {
          q: 'Pernyataan yang benar tentang static vs dynamic adalah…',
          options: [
            'Harus pilih salah satu, tidak bisa campur',
            'Keduanya hidup berdampingan: OSPF di dalam jaringan + static default route ke ISP adalah pola umum',
            'Dynamic selalu menggantikan semua static',
            'Static dilarang di enterprise',
          ],
          answer: 1,
          explain: 'Pola standar: dynamic untuk interior yang dinamis, static untuk default route ke ISP yang sederhana.',
        },
      ],
    },
    {
      id: '12.2',
      title: 'RIP',
      body: `
<p><b>RIP</b> (<i>Routing Information Protocol</i>) adalah protokol distance vector <b>paling tua dan paling sederhana</b>: tiap router mengumumkan <b>seluruh tabel routingnya</b> ke tetangga setiap <b>30 detik</b>, dengan metric berupa <b>hop count</b> (jumlah router yang dilewati).</p>
<h3>Cara Kerja: "Kata Tetangga"</h3>
<pre>R1 tahu: "192.168.50.0/24 bisa dicapai via saya, jarak 1 hop."
  → diumumkan ke R2 tiap 30 detik.
R2 terima → catat: "via R1, jarak 2 hop" → umumkan ke R3.
R3 terima → catat: "via R2, jarak 3 hop" → ...

Aturan: pilih hop TERKECIL. Maksimum 15 hop — 16 = "tak terjangkau"
(infinity). Inilah batas skala RIP: jaringan > 15 hop tidak bisa.</pre>
<h3>Keterbatasan RIP (Mengapa Jarang Dipakai)</h3>
<ul>
<li><b>Lambat konvergen:</b> update tiap 30 detik + hold-down timer → failover bisa menit.</li>
<li><b>Metric primitif:</b> hop count mengabaikan bandwidth — 2 hop via link 10 Mbps "menang" atas 3 hop via fiber 10 Gbps. Salah besar!</li>
<li><b>Skala kecil:</b> maks 15 hop; update membawa seluruh tabel (boros).</li>
<li><b>Count to infinity:</b> problem klasik distance vector saat link putus (rumor berputar).</li>
</ul>
<h3>Konfigurasi RIP (Cisco) — Untuk Dipahami, Bukan Dipakai</h3>
<pre>R1(config)# router rip
! ALASAN: masuk mode konfigurasi protokol RIP.

R1(config-router)# version 2
! ALASAN: RIP v2 (classless, mendukung VLSM/CIDR). v1 usang — jangan dipakai.

R1(config-router)# no auto-summary
! ALASAN: matikan auto-summary agar subnet /24 tidak digabung paksa
! menjadi /16 di batas classful — perilaku default yang menyesatkan.

R1(config-router)# network 192.168.20.0
R1(config-router)# network 192.168.99.0
! ALASAN: "umumkan network yang menempel langsung di saya" — RIP hanya
! mengiklankan network connected yang didaftarkan di sini. (Perintah
! network di RIP memakai alamat classful, bukan wildcard — beda dengan OSPF!)

! Verifikasi: show ip route → baris "R" muncul; show ip protocols.</pre>
<div class="callout"><div class="t">Mengapa Mempelajari RIP?</div><p style="margin:4px 0 0">RIP adalah <b>fosil hidup</b> yang sempurna untuk memahami konsep distance vector, hop count, AD (120), dan count-to-infinity — sebelum masuk ke OSPF yang lebih kompleks. Di production modern, RIP hampir punah; di ujian/interview, ia tetap ditanyakan sebagai fondasi.</p></div>`,
      terms: [
        ['RIP', 'Routing Information Protocol — distance vector; metric hop count; update tiap 30 detik; maks 15 hop.'],
        ['Hop count', 'Jumlah router yang dilewati; metric RIP; 16 = unreachable.'],
        ['Count to infinity', 'Masalah distance vector: rumor rute mati berputar antar router hingga mencapai 16 hop.'],
        ['Auto-summary', 'Perilaku RIP/EIGRP menggabung subnet ke batas classful; dimatikan dengan no auto-summary.'],
      ],
      diagram: `<pre>RIP — "kata tetangga", hop demi hop

 R1 ── R2 ── R3 ── R4 ── [LAN 192.168.50.0/24]

 R4: "50.0/24 via saya, 1 hop" ──▶ R3: "via R4, 2 hop" ──▶ R2: "3 hop" ──▶ R1: "4 hop"
       (update PENUH tiap 30 detik, dirumor berantai)

 ⚠️ 2 hop via 10 Mbps menang atas 3 hop via 10 Gbps — hop buta bandwidth!</pre>`,
      scenario: 'Jaringan lab kampus lama masih memakai RIP. Link fiber 1 Gbps baru dipasang paralel dengan link radio 100 Mbps lama — tetapi traffic tetap lewat radio karena "lebih sedikit hop". Itulah metric buta-bandwidth: keputusan benar menurut RIP, salah menurut fisika. Migrasi ke OSPF memperbaiki dalam sehari.',
      bestPractices: 'Jangan deploy RIP baru di production. Pelajari untuk fondasi & interview, lalu langsung kuasai OSPF untuk dunia nyata.',
      security: 'RIP v1 tanpa autentikasi; RIPv2 mendukung plaintext/MD5 tetapi jarang dikeraskan karena protokolnya sendiri sudah ditinggalkan. Satu alasan lagi meninggalkannya.',
      challenge: 'Jelaskan count to infinity dengan 3 router segaris saat link ke LAN tujuan putus: tulis rumor yang berputar (hop 1→2→3...) hingga mencapai 16. Mengapa ini lambat & boros?',
      interviewQ: 'Q: "Jelaskan RIP dan kelemahannya." — A: Distance vector: mengumumkan seluruh tabel tiap 30 detik, metric hop count (maks 15, 16 = unreachable). Kelemahan: konvergensi lambat, metric buta bandwidth, tidak scalable, dan rentan count-to-infinity — makanya digantikan OSPF di enterprise.',
      quiz: [
        {
          q: 'Berapa metric maksimum RIP dan apa artinya 16 hop?',
          options: [
            '255 hop; artinya sangat jauh',
            '15 hop maksimum; 16 = unreachable (infinity)',
            '100 hop; artinya prioritas tinggi',
            'Tidak ada batas',
          ],
          answer: 1,
          explain: 'RIP: 15 hop valid, 16 = infinity/tak terjangkau. Batas inilah yang membatasi skala RIP.',
        },
        {
          q: 'Kelemahan paling fatal metric hop count RIP adalah…',
          options: [
            'Terlalu sulit dihitung',
            'Buta bandwidth: 2 hop via link lambat dianggap lebih baik dari 3 hop via fiber cepat',
            'Membuat router panas',
            'Tidak mendukung IPv4',
          ],
          answer: 1,
          explain: 'Hop count hanya menghitung jumlah router, mengabaikan kecepatan link — keputusan bisa salah secara fisik.',
        },
        {
          q: 'Apa fungsi perintah "no auto-summary" di RIP?',
          options: [
            'Mematikan RIP',
            'Mencegah RIP menggabungkan subnet secara otomatis ke batas classful (/8, /16) sehingga subnet /24 tetap diumumkan apa adanya',
            'Mempercepat update menjadi 5 detik',
            'Menghapus semua rute',
          ],
          answer: 1,
          explain: 'Auto-summary (default) menggabung subnet di batas classful — menyesatkan di era CIDR/VLSM; wajib dimatikan.',
        },
      ],
    },
    {
      id: '12.3',
      title: 'OSPF',
      body: `
<p><b>OSPF</b> (<i>Open Shortest Path First</i>) adalah protokol <b>link state</b> standar terbuka (RFC 2328) yang menjadi <b>pilihan utama enterprise</b> untuk routing interior. Tiap router membangun <b>peta topologi lengkap</b> (link-state database), lalu menghitung jalur terpendek sendiri dengan algoritma <b>Dijkstra (SPF)</b>.</p>
<h3>Mengapa OSPF? (Masalah yang Diselesaikan)</h3>
<ul>
<li><b>Metric cerdas:</b> cost berbasis <b>bandwidth</b> (bukan hop buta) — fiber selalu menang atas radio lambat.</li>
<li><b>Konvergensi cepat:</b> perubahan link diumumkan <b>seketika</b> (bukan menunggu 30 detik), hitung ulang dalam detik.</li>
<li><b>Skalabel:</b> hirarki <b>area</b> (12.5) membagi jaringan raksasa menjadi zona-zona.</li>
<li><b>Standar terbuka:</b> jalan di semua vendor (Cisco, MikroTik, Juniper) — tidak dikunci satu merek.</li>
</ul>
<h3>Cara Kerja Singkat (Detail di 12.4–12.9)</h3>
<ol>
<li>Router bertetangga via <b>hello packet</b> → menjadi <b>neighbor</b> (12.4).</li>
<li>Bertukar <b>LSA</b> (<i>Link State Advertisement</i>) → semua router punya <b>peta identik</b>.</li>
<li>Tiap router menjalankan <b>SPF/Dijkstra</b> → pohon jalur terpendek dari dirinya.</li>
<li>Hasilnya dimasukkan ke <b>routing table</b> (kode <b>O</b>, AD 110).</li>
<li>Link berubah → LSA baru disebar <b>seketika</b> → hitung ulang.</li>
</ol>
<h3>Lab Terpandu: OSPF Single-Area (Cisco)</h3>
<p><b>Topology:</b> R1 (LAN 192.168.20.0/24) ──192.168.99.0/30── R2 (LAN 192.168.50.0/24). Semua di area 0.</p>
<p><b>Objective:</b> R1 & R2 bertetangga OSPF; tiap router belajar LAN tetangga otomatis (kode O); ping dua arah.</p>
<h3>Configuration</h3>
<pre>! === Di R1 ===
R1(config)# router ospf 1
! ALASAN: aktifkan proses OSPF. Angka "1" = process ID LOKAL (1–65535) —
! hanya penanda di router ini, TIDAK harus sama antar router (tetapi
! samakan untuk kerapian dokumentasi).

R1(config-router)# router-id 1.1.1.1
! ALASAN: ID unik router di format IP (12.6). Ditentukan manual agar
! stabil — jangan biarkan dipilih otomatis dari IP interface yang bisa
! berubah.

R1(config-router)# network 192.168.20.0 0.0.0.255 area 0
R1(config-router)# network 192.168.99.0 0.0.0.3 area 0
! MEMBACA: network [NETWORK] [WILDCARD MASK] area [AREA]
! ALASAN tiap bagian:
! • network = "interface mana yang ikut OSPF" — cocokkan interface yang
!   IP-nya masuk rentang ini.
! • 0.0.0.255 = WILDCARD mask (kebalikan subnet mask): 0 = "harus sama",
!   255 = "bebas". 192.168.20.0 + 0.0.0.255 = seluruh /24.
! • area 0 = backbone area (12.5). Single-area → semua di area 0.

! === Di R2 (cerminkan) ===
R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
R2(config-router)# network 192.168.50.0 0.0.0.255 area 0
R2(config-router)# network 192.168.99.0 0.0.0.3 area 0</pre>
<h3>Verification</h3>
<pre>R1# show ip ospf neighbor
Neighbor ID  Pri  State      Dead Time  Address        Interface
2.2.2.2      1    FULL/BDR   00:00:35   192.168.99.2   Gi0/1
! ✔ State FULL = bertetangga sempurna (12.4). Belum FULL = ada masalah.

R1# show ip route ospf
O    192.168.50.0/24 [110/2] via 192.168.99.2, 00:05:21, Gi0/1
! ✔ Kode O: dipelajari via OSPF. AD 110, metric (cost) 2.
! Ping R1 → 192.168.50.50 kini berhasil TANPA static route!</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> di R2, hapus <code>network 192.168.99.0 0.0.0.3 area 0</code> (interface ke R1 tidak ikut OSPF).</li>
<li><b>Gejala:</b> <code>show ip ospf neighbor</code> kosong; rute O hilang; ping gagal.</li>
<li><b>Troubleshoot:</b> neighbor kosong = hello tidak bertukar di link itu → cek <code>show ip ospf interface brief</code> → Gi0/1 tidak terdaftar → network statement kurang.</li>
<li><b>Fix:</b> tambahkan kembali network statement.</li>
<li><b>Final verification:</b> neighbor FULL + rute O kembali + ping berhasil.</li>
</ul>`,
      terms: [
        ['OSPF', 'Open Shortest Path First — link-state routing protocol standar terbuka; AD 110; kode O.'],
        ['LSA', 'Link State Advertisement — pengumuman info link/topologi antar router OSPF.'],
        ['LSDB', 'Link-State Database — peta topologi lengkap yang identik di semua router satu area.'],
        ['SPF / Dijkstra', 'Algoritma penghitung jalur terpendek dari peta LSDB.'],
        ['Wildcard mask', 'Kebalikan subnet mask di perintah network OSPF: 0 = cocok persis, 255 = abaikan.'],
        ['Process ID', 'Nomor lokal proses OSPF di satu router (1–65535); tidak harus sama antar router.'],
      ],
      diagram: `<pre>OSPF — semua punya peta yang sama, hitung sendiri

   R1 ──hello── R2 ──hello── R3
    │            │            │
    LSA: "linkku: ..." (disebar ke semua)
    ▼
 ┌──────────────────────────────┐
 │ LSDB (peta identik di R1,R2,R3) │
 │  R1—R2 (cost 10)              │
 │  R2—R3 (cost 10)              │
 │  R1—R3 (cost 50)              │
 └──────────────────────────────┘
    │ tiap router jalankan Dijkstra dari dirinya
    ▼
 R1: ke R3 via R2 (cost 20 < 50) ✔ — keputusan CERDAS berbasis bandwidth</pre>`,
      scenario: 'Bank dengan 30 kantor cabang: tiap cabang 3–4 subnet. Dengan OSPF, router cabang baru cukup didaftarkan network-nya — 29 router lain belajar otomatis dalam detik. Dengan static, tiap cabang baru = 29 router dikonfigurasi manual. OSPF mengubah pekerjaan berminggu-minggu menjadi bermenit-menit.',
      bestPractices: 'Selalu tentukan router-id manual. Gunakan wildcard mask yang tepat (bukan 0.0.0.0 asal). Mulai dengan single area 0; pecah menjadi multi-area saat jaringan membesar (12.5).',
      security: 'Aktifkan autentikasi OSPF (message-digest) di semua interface — tanpa ini, router liar bisa bergabung dan menyuntik rute palsu (Part 29).',
      challenge: 'Lab 3 router segitiga dengan bandwidth berbeda tiap link. Prediksi path yang dipilih OSPF (hitung cost tiap link), lalu verifikasi dengan show ip route + traceroute. Apakah prediksimu benar?',
      interviewQ: 'Q: "Jelaskan cara kerja OSPF secara umum." — A: Protokol link-state: router bertetangga via hello, bertukar LSA hingga semua punya peta topologi identik (LSDB), lalu tiap router menghitung jalur terpendek dengan algoritma Dijkstra/SPF dan memasukkannya ke routing table (AD 110, metric = cost berbasis bandwidth).',
      quiz: [
        {
          q: 'Apa perbedaan fundamental OSPF dibanding RIP?',
          options: [
            'OSPF lebih tua',
            'OSPF link-state (peta topologi lengkap + Dijkstra, metric cost berbasis bandwidth); RIP distance vector (rumor tetangga, metric hop)',
            'OSPF hanya untuk Cisco',
            'RIP lebih cepat konvergen',
          ],
          answer: 1,
          explain: 'Link-state vs distance-vector: peta lengkap + kalkulasi mandiri vs rumor berantai.',
        },
        {
          q: 'Perintah "network 192.168.20.0 0.0.0.255 area 0" artinya…',
          options: [
            'Membuat subnet baru',
            'Mengikutsertakan interface yang IP-nya cocok (wildcard 0.0.0.255 = seluruh /24) ke OSPF area 0',
            'Memblokir network tersebut',
            'Menghapus OSPF',
          ],
          answer: 1,
          explain: 'network + wildcard = "interface mana ikut OSPF"; area 0 = backbone. Wildcard 0=harus sama, 255=bebas.',
        },
        {
          q: 'State apa pada "show ip ospf neighbor" yang menandakan adjacency sempurna?',
          options: [
            'INIT',
            'FULL',
            'DOWN',
            'EXSTART',
          ],
          answer: 1,
          explain: 'FULL = database tersinkronisasi penuh; state lain (INIT, EXSTART, LOADING) berarti proses bertetangga belum selesai/macet.',
        },
      ],
    },
    {
      id: '12.4',
      title: 'OSPF Neighbor',
      body: `
<p><b>Neighbor</b> adalah dua router OSPF yang <b>saling mengenal</b> via pertukaran <b>hello packet</b> dan setuju menjadi tetangga. Tanpa neighbor, tidak ada pertukaran LSA — tanpa LSA, tidak ada rute OSPF.</p>
<h3>Syarat Menjadi Neighbor (Harus Cocok!)</h3>
<p>Hello packet membawa "syarat bertetangga" — <b>satu saja tidak cocok = neighbor gagal</b>:</p>
<div class="tblwrap"><table>
<tr><th>Syarat</th><th>Contoh Cocok</th><th>Jika Tidak Cocok</th></tr>
<tr><td>Area ID sama</td><td>Keduanya area 0</td><td>Stuck INIT/DOWN</td></tr>
<tr><td>Subnet sama di link</td><td>192.168.99.1/30 & .2/30</td><td>Hello tidak diproses</td></tr>
<tr><td>Hello & dead interval sama</td><td>10 dtk / 40 dtk (default)</td><td>Neighbor flapping/gagal</td></tr>
<tr><td>Autentikasi sama</td><td>Keduanya MD5 "rahasia"</td><td>Ditolak diam-diam</td></tr>
<tr><td>Stub flag sama</td><td>Keduanya bukan stub / keduanya stub</td><td>Mismatch</td></tr>
<tr><td>Router ID unik</td><td>1.1.1.1 vs 2.2.2.2</td><td>Duplikat = kacau (12.6)</td></tr>
</table></div>
<h3>State Neighbor: Perjalanan Menuju FULL</h3>
<pre>DOWN → INIT → 2-WAY → EXSTART → EXCHANGE → LOADING → FULL
  │       │        │         (tukar DBD)    (tukar LSA)   │
  │       │        │                                     └─ ✔ normal: database sinkron
  │       │        └─ hello 2 arah OK (saling melihat)
  │       └─ hello 1 arah diterima
  └─ belum ada hello

Stuck di:
• INIT    → hello tidak kembali (ACL? multicast diblokir? salah subnet)
• EXSTART → MTU mismatch / router ID duplikat
• LOADING → LSA corrupt / masalah memori</pre>
<h3>Verifikasi & Diagnosis</h3>
<pre>R1# show ip ospf neighbor
Neighbor ID  Pri  State      Dead Time  Address       Interface
2.2.2.2      1    FULL/DR    00:00:35   192.168.99.2  Gi0/1
! State FULL = sehat. Kolom kedua (DR/BDR/DROTHER) = peran DR (12.7).

R1# show ip ospf interface gi0/1 | include Hello|Area|MTU
  Hello 10, Dead 40, ... Area 0, MTU 1500
! ✔ Bandingkan dengan sisi lawan — semua parameter hello harus IDENTIK.</pre>
<div class="callout"><div class="t">Neighbor ≠ Adjacency Penuh Selalu</div><p style="margin:4px 0 0">Di link point-to-point, neighbor langsung FULL. Di jaringan multi-access (12.7), router biasa (DROTHER) hanya FULL dengan DR/BDR — antar DROTHER cukup 2-WAY. Jangan panik melihat 2-WAY di LAN: itu normal, bukan error.</p></div>`,
      terms: [
        ['Neighbor', 'Dua router OSPF yang saling bertukar hello dan setuju bertetangga; prasyarat pertukaran LSA.'],
        ['Hello packet', 'Packet multicast OSPF (224.0.0.5) tiap 10 detik untuk discovery & keepalive neighbor.'],
        ['Adjacency (FULL)', 'Hubungan neighbor tingkat lanjut dengan database LSA tersinkronisasi penuh.'],
        ['Dead interval', '40 detik default — neighbor dinyatakan mati bila tidak ada hello selama ini.'],
      ],
      diagram: `<pre>SYARAT BERTETANGGA — semua harus cocok

  R1 ◄──── hello (10 dtk) ────► R2
       ceklisin:
       [✔] area sama (0 = 0)
       [✔] subnet sama (.1/30 & .2/30)
       [✔] hello/dead sama (10/40)
       [✔] autentikasi sama
       [✔] router ID unik
         → state: DOWN → INIT → 2-WAY → ... → FULL ✔

       ❌ satu saja ✗ → stuck (INIT/EXSTART) = tidak ada rute OSPF</pre>`,
      scenario: 'Dua router tidak mau bertetangga padahal kabel tersambung. Tiga jam debugging konfigurasi — ternyata firewall di tengah memblokir multicast 224.0.0.5. Hello tidak sampai = INIT selamanya. Pelajaran: neighbor OSPF butuh multicast; "kabel tersambung" belum berarti "protokol bisa bicara".',
      bestPractices: 'Saat neighbor gagal: bandingkan parameter hello kedua sisi (area, subnet, timer, auth, MTU) — 95% kasus adalah mismatch salah satu dari ini.',
      security: 'Hello tanpa autentikasi bisa dipalsukan untuk membentuk adjacency jahat. Aktifkan OSPF MD5 authentication di semua interface (Part 29).',
      challenge: 'Sengaja buat 3 mismatch berbeda di lab (area beda, hello interval beda, router ID sama). Untuk tiap kasus: catat state neighbor-nya + perintah yang membuktikan penyebabnya.',
      interviewQ: 'Q: "Sebutkan syarat dua router menjadi OSPF neighbor." — A: Area ID sama, subnet sama di link, hello/dead interval sama, tipe autentikasi sama, stub flag sama, dan router ID unik. Satu saja beda = neighbor gagal (stuck di INIT/EXSTART).',
      quiz: [
        {
          q: 'Apa fungsi hello packet OSPF?',
          options: [
            'Mengirim tabel routing lengkap',
            'Discovery & keepalive neighbor — dikirim tiap 10 detik via multicast 224.0.0.5',
            'Mengenkripsi traffic user',
            'Menghitung cost',
          ],
          answer: 1,
          explain: 'Hello = "saya di sini"; dasar pembentukan neighbor sebelum LSA dipertukarkan.',
        },
        {
          q: 'Neighbor stuck di state INIT. Penyebab paling mungkin?',
          options: [
            'Router ID duplikat',
            'Hello diterima satu arah tetapi tidak kembali — mis. ACL/multicast diblokir atau salah subnet',
            'Cost terlalu besar',
            'Area terlalu banyak',
          ],
          answer: 1,
          explain: 'INIT = hello satu arah; EXSTART = MTU/ID duplikat. Beda state, beda diagnosis.',
        },
        {
          q: 'Dua router DROTHER di LAN yang sama berada di state 2-WAY (bukan FULL). Apakah ini error?',
          options: [
            'Ya, harus diperbaiki segera',
            'Tidak — normal: DROTHER hanya perlu FULL dengan DR/BDR, antar DROTHER cukup 2-WAY',
            'Ya, berarti OSPF mati',
            'Tidak, tetapi rute tidak akan muncul',
          ],
          answer: 1,
          explain: 'Di multi-access, adjacency penuh hanya dengan DR/BDR untuk efisiensi; 2-WAY antar DROTHER adalah desain.',
        },
      ],
    },
    {
      id: '12.5',
      title: 'OSPF Area',
      body: `
<p><b>Area</b> adalah pembagian hirarkis jaringan OSPF menjadi zona-zona. Tujuannya: <b>skalabilitas</b> — router tidak perlu tahu detail seluruh internet perusahaan, cukup detail areanya + ringkasan ke area lain.</p>
<h3>Area 0: Backbone yang Wajib Ada</h3>
<ul>
<li><b>Area 0</b> (<i>backbone</i>) adalah <b>tulang punggung</b>: semua area lain <b>harus terhubung ke area 0</b> (langsung atau via virtual-link).</li>
<li>Traffic antar-area <b>selalu</b> lewat area 0 — seperti semua penerbangan transit via hub utama.</li>
<li>Single-area = semua di area 0 (cukup untuk jaringan kecil–menengah seperti lab kita).</li>
</ul>
<h3>Mengapa Membagi Area? (Masalah yang Diselesaikan)</h3>
<ul>
<li><b>LSDB lebih kecil:</b> router hanya menyimpan detail topologi areanya; area lain diterima sebagai <b>ringkasan</b> (summary LSA).</li>
<li><b>Konvergensi terisolasi:</b> link flapping di area 10 tidak memaksa seluruh perusahaan hitung ulang SPF — hanya area 10.</li>
<li><b>Kontrol banjir LSA:</b> perubahan topologi tidak disebar ke seluruh jaringan.</li>
</ul>
<h3>ABR: Penjaga Perbatasan Area</h3>
<p><b>ABR</b> (<i>Area Border Router</i>) = router yang kakinya ada di <b>dua area atau lebih</b> (mis. area 0 + area 10). Tugasnya: meneruskan <b>ringkasan rute</b> antar area dan menjaga isolasi detail topologi.</p>
<pre>Desain multi-area sederhana:

        [Area 10: Cabang]
              │
         (ABR: R2)
              │
  [Area 0: Backbone/Pusat] ── (ABR: R3) ── [Area 20: Gudang]
              │
         (R1: internal area 0)

• R2 & R3 = ABR (kaki di 2 area)
• R1 = internal router (hanya area 0)
• Traffic Area 10 → Area 20 WAJIB lewat Area 0</pre>
<h3>Jenis Rute OSPF & Urutan Pemilihan (Pratinjau 12.9)</h3>
<ul>
<li><b>O</b> — intra-area (dalam area yang sama): paling disukai.</li>
<li><b>O IA</b> — inter-area (dari area lain via ABR).</li>
<li><b>O E1 / O E2</b> — external (dari luar OSPF, mis. redistribusi static): paling tidak disukai.</li>
</ul>
<div class="callout blue"><div class="t">Kapan Pecah Area?</div><p style="margin:4px 0 0">Aturan praktis: tetap <b>single area 0</b> hingga router &gt; ~20 atau LSA membengkak. Multi-area menambah kompleksitas desain (ABR, summarization) — lakukan saat skala menuntut, bukan di awal.</p></div>`,
      terms: [
        ['Area', 'Zona hirarkis OSPF untuk skalabilitas; area 0 = backbone wajib.'],
        ['ABR (Area Border Router)', 'Router di perbatasan dua area atau lebih; meneruskan ringkasan rute antar area.'],
        ['Intra-area / Inter-area', 'Rute dalam satu area (O) vs antar area (O IA); intra lebih disukai.'],
        ['Summarization', 'Penggabungan banyak prefix menjadi satu ringkasan di ABR untuk mengecilkan tabel.'],
      ],
      diagram: `<pre>HIRARKI AREA OSPF — semua via backbone

              Area 10 (Cabang)         Area 20 (Gudang)
              192.168.10.0/24         192.168.60.0/24
                     \\                    //
                      \\  ┌──────────┐  //
                       ──▶│ AREA 0   │◀──
                          │ BACKBONE │
                          │ (Pusat)  │
                          └──────────┘
               R2 (ABR)              R3 (ABR)

 "Area 10 mau ke Area 20? Transit via Area 0 — tidak ada jalan pintas."</pre>`,
      scenario: 'Perusahaan 50 site dalam satu area: satu link cabang yang flapping memicu SPF ulang di 50 router setiap beberapa menit — CPU kolektif terbuang. Setelah dipecah menjadi area per region + area 0 pusat, flapping hanya menggoyang areanya sendiri. Skala menuntut hirarki.',
      bestPractices: 'Desain area mengikuti geografi/fungsi (area per region). Letakkan ABR di router perbatasan yang kuat. Dokumentasikan peta area — ini dokumen arsitektur routing perusahaan.',
      security: 'ABR adalah titik kontrol: di sinilah summarization dan filtering antar-area dipasang. Amankan ABR maksimal — ia melihat semua area.',
      challenge: 'Rancang area untuk perusahaan: pusat (20 router), 4 region (8 router tiap region). Tentukan: area ID tiap region, di mana ABR-nya, dan rute jenis apa (O/O IA) yang dilihat router region.',
      interviewQ: 'Q: "Apa itu area 0 dan ABR?" — A: Area 0 adalah backbone OSPF — semua area lain harus terhubung ke sana dan traffic antar-area lewat sana. ABR (Area Border Router) adalah router dengan kaki di ≥2 area yang meneruskan ringkasan rute antar area.',
      quiz: [
        {
          q: 'Apa peran area 0 dalam OSPF?',
          options: [
            'Area khusus untuk server',
            'Backbone: semua area lain harus terhubung ke area 0 dan traffic antar-area lewat sana',
            'Area dengan prioritas terendah',
            'Area yang tidak boleh dipakai',
          ],
          answer: 1,
          explain: 'Area 0 = tulang punggung hirarki OSPF; desain multi-area yang tidak menyentuh area 0 tidak valid.',
        },
        {
          q: 'Apa itu ABR?',
          options: [
            'Router dengan bandwidth terbesar',
            'Area Border Router — router yang terhubung ke dua area atau lebih dan meneruskan ringkasan rute antar area',
            'Backup router otomatis',
            'Router khusus area 0',
          ],
          answer: 1,
          explain: 'ABR = penjaga perbatasan area; kakinya di banyak area, tugasnya summarization + isolasi.',
        },
        {
          q: 'Keuntungan utama membagi OSPF menjadi banyak area adalah…',
          options: [
            'Menambah kecepatan kabel',
            'Skalabilitas: LSDB lebih kecil, konvergensi terisolasi per area, banjir LSA terkontrol',
            'Menghilangkan butuh router ID',
            'Membuat konfigurasi lebih sedikit',
          ],
          answer: 1,
          explain: 'Hirarki area membatasi dampak perubahan topologi dan mengecilkan database tiap router.',
        },
      ],
    },
    {
      id: '12.6',
      title: 'Router ID',
      body: `
<p><b>Router ID (RID)</b> adalah identitas unik <b>32-bit berformat IP</b> (mis. <code>1.1.1.1</code>) untuk setiap router OSPF. Dipakai untuk: identifikasi neighbor, pemilihan <b>DR/BDR</b> (12.7), dan tie-breaker. <b>Bukan</b> alamat yang bisa di-ping — murni label.</p>
<h3>Urutan Pemilihan Otomatis (Bila Tidak Dikonfigurasi Manual)</h3>
<ol>
<li>IP <b>loopback</b> tertinggi (jika ada).</li>
<li>IP <b>fisik</b> tertinggi yang up.</li>
</ol>
<p>Masalah: otomatis = <b>bisa berubah</b> (interface down → RID berubah → OSPF reset!). Karena itu aturan keras: <b>selalu tentukan manual</b>.</p>
<h3>Konfigurasi & Loopback</h3>
<pre>R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
! ALASAN: RID manual — stabil, terdokumentasi, mudah dibaca.
! Konvensi umum: 1.1.1.1 untuk R1, 2.2.2.2 untuk R2, dst.
! (atau pakai IP loopback asli perusahaan).

! Praktik terbaik: buat interface loopback sebagai "jangkar" RID:
R1(config)# interface loopback 0
R1(config-if)# ip address 1.1.1.1 255.255.255.255
! ALASAN: loopback TIDAK PERNAH down (virtual) → RID super stabil.
! Bonus: loopback bisa jadi source IP management/monitoring (Part 23).

! Catatan: perubahan RID butuh reset proses OSPF:
R1# clear ip ospf process
! → jawab "yes". Lakukan di maintenance window (memutus adjacency sesaat).</pre>
<div class="callout"><div class="t">Bahaya: Router ID Duplikat</div><p style="margin:4px 0 0">Dua router dengan RID sama = OSPF menganggapnya <b>satu router</b> — neighbor stuck di EXSTART, rute kacau, sulit didiagnosis karena "konfigurasi kelihatannya benar". Selalu audit keunikan RID ( <code>show ip ospf neighbor</code> menampilkan RID semua tetangga).</p></div>`,
      terms: [
        ['Router ID', 'Identitas 32-bit unik tiap router OSPF (format IP); untuk neighbor, DR/BDR, tie-break.'],
        ['Loopback interface', 'Interface virtual yang tidak pernah down; jangkar stabil untuk RID & IP management.'],
      ],
      diagram: `<pre>ROUTER ID — KTP tiap router OSPF

  R1 ── RID 1.1.1.1 (loopback0)      R2 ── RID 2.2.2.2 (loopback0)
         │                                     │
         └─────── neighbor: "halo 2.2.2.2" ────┘
                   "halo 1.1.1.1"

  ❌ R1 & R2 sama-sama 1.1.1.1 → "kamu adalah aku?!" → EXSTART stuck
  ✔ Manual + loopback = stabil, unik, terdokumentasi.</pre>`,
      scenario: 'Dua router cabang di-clone dari template konfigurasi yang sama — termasuk router-id 3.3.3.3. Keduanya tidak pernah bisa FULL; engineer menghabiskan 2 hari mengecek kabel & MTU sebelum menyadari duplikat RID dari output show ip ospf neighbor. Sejak itu, template memakai placeholder <UNIK> yang wajib diganti.',
      bestPractices: 'Standarkan skema RID (mis. 10.255.255.X = nomor router) + loopback0 dengan IP yang sama. Jadikan "RID unik" item checklist commissioning router baru.',
      security: 'RID yang terdokumentasi memudahkan audit: neighbor dengan RID tak dikenal di show ip ospf neighbor = indikasi router liar.',
      challenge: 'Lab: buat dua router dengan RID sama, amati state neighbor-nya (EXSTART?). Lalu perbaiki satu, reset proses, dan catat perbedaan output sebelum & sesudah.',
      interviewQ: 'Q: "Bagaimana router ID dipilih dan mengapa harus manual?" — A: Otomatis: loopback tertinggi, lalu IP fisik tertinggi — tetapi bisa berubah saat interface down dan me-reset OSPF. Manual + loopback memberi RID stabil, unik, dan terdokumentasi; duplikat RID menyebabkan neighbor stuck EXSTART.',
      quiz: [
        {
          q: 'Apa itu router ID OSPF?',
          options: [
            'IP yang bisa di-ping untuk management',
            'Identitas unik 32-bit (format IP) tiap router untuk neighbor, DR/BDR, dan tie-break — bukan alamat routable',
            'Password OSPF',
            'Nomor area',
          ],
          answer: 1,
          explain: 'RID = label identitas ("KTP"), bukan alamat tujuan traffic.',
        },
        {
          q: 'Mengapa router ID sebaiknya dikonfigurasi manual (bukan otomatis)?',
          options: [
            'Agar lebih cepat mengetik',
            'RID otomatis bisa berubah saat interface down → memicu reset OSPF; manual + loopback stabil & terdokumentasi',
            'RID otomatis tidak valid',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Stabilitas adalah segalanya di routing; RID yang berubah = adjacency reset = gangguan.',
        },
        {
          q: 'Dua router tidak sengaja memakai router ID yang sama. Gejalanya?',
          options: [
            'Tidak ada masalah',
            'Neighbor stuck (EXSTART), rute kacau — OSPF menganggap keduanya satu router',
            'VLAN terhapus',
            'Internet lebih cepat',
          ],
          answer: 1,
          explain: 'Duplikat RID = krisis identitas; diagnosis via show ip ospf neighbor (RID tetangga terlihat).',
        },
      ],
    },
    {
      id: '12.7',
      title: 'DR / BDR',
      body: `
<p><b>DR</b> (<i>Designated Router</i>) dan <b>BDR</b> (<i>Backup Designated Router</i>) adalah dua router yang <b>dipilih</b> di setiap jaringan <b>multi-access</b> (mis. satu switch/VLAN berisi banyak router OSPF) untuk menjadi <b>pusat pertukaran LSA</b> — agar tidak terjadi banjir adjacency antar semua pasangan.</p>
<h3>Masalah yang Diselesaikan</h3>
<p>Tanpa DR: 6 router dalam satu LAN → tiap pasang harus FULL → <b>15 adjacency</b> (n×(n-1)/2) dengan banjir LSA yang eksponensial. Dengan DR: tiap router cukup FULL ke <b>DR & BDR saja</b> → 6 router = <b>10 adjacency</b>, dan LSA disebar via DR. Makin banyak router, makin besar penghematannya.</p>
<h3>Pemilihan DR/BDR</h3>
<ol>
<li><b>Prioritas OSPF tertinggi</b> menang (default semua 1 → seri).</li>
<li>Seri → <b>Router ID tertinggi</b> menang.</li>
<li>Pemenang #1 = <b>DR</b>, #2 = <b>BDR</b>, sisanya = <b>DROTHER</b>.</li>
<li>BDR <b>tidak</b> otomatis promosi saat DR baru bergabung dengan prioritas lebih tinggi (stabilitas: tidak ada preemption).</li>
</ol>
<h3>Di Mana DR Dipilih?</h3>
<div class="tblwrap"><table>
<tr><th>Tipe Network</th><th>Contoh</th><th>DR/BDR?</th></tr>
<tr><td>Broadcast (multi-access)</td><td>Ethernet LAN, VLAN</td><td>Ya — dipilih</td></tr>
<tr><td>Point-to-point</td><td>Link serial /30 antar 2 router</td><td>Tidak perlu (hanya 2 router)</td></tr>
</table></div>
<h3>Konfigurasi: Menentukan DR Manual</h3>
<pre>R1(config)# interface gi0/1
R1(config-if)# ip ospf priority 100
! ALASAN: naikkan prioritas agar R1 menang menjadi DR. Default semua 1
! (seri → ditentukan RID tertinggi = acak). DR ideal = router paling kuat
! & stabil di segmen itu.

R2(config-if)# ip ospf priority 50
! BDR.

! Prioritas 0 = "TIDAK BOLEH menjadi DR/BDR" (DROTHER permanen):
R3(config-if)# ip ospf priority 0
! ALASAN: untuk router kecil/lemah di LAN — jangan bebani ia sebagai DR.

! Verifikasi:
R1# show ip ospf neighbor
Neighbor ID  Pri  State       Address       Interface
2.2.2.2      50   FULL/BDR    192.168.99.2  Gi0/1
3.3.3.3      0    2-WAY/DROTHER 192.168.99.3 Gi0/1
! ✔ State menampilkan peran: FULL/DR, FULL/BDR, 2-WAY/DROTHER.</pre>
<div class="callout blue"><div class="t">DR ≠ Root Bridge</div><p style="margin:4px 0 0">Jangan tertukar dengan STP (Part 10): <b>DR</b> adalah "ketua pertukaran LSA" <b>per segmen multi-access</b> (bisa banyak DR di jaringan), sedangkan <b>root bridge</b> adalah pusat <b>satu topologi STP</b>. Beda protokol, beda peran, kebetulan sama-sama soal "pemilihan".</p></div>`,
      terms: [
        ['DR (Designated Router)', 'Router terpilih per segmen multi-access sebagai pusat pertukaran LSA.'],
        ['BDR (Backup Designated Router)', 'Cadangan DR; mengambil alih otomatis bila DR gagal.'],
        ['DROTHER', 'Router biasa di segmen multi-access; FULL hanya dengan DR/BDR.'],
        ['Multi-access network', 'Segmen di mana >2 router bisa saling dengar langsung (Ethernet/VLAN).'],
      ],
      diagram: `<pre>DR/BDR — ketua pertukaran LSA di LAN

 Tanpa DR (6 router):                 Dengan DR:
 15 adjacency penuh                   R1..R6 cukup FULL ke DR & BDR
 (banjir LSA eksponensial ✋)          LSA via DR (terkendali ✔)

        [LAN 192.168.99.0/24]
     R1(prio 100)=DR ── R2(prio 50)=BDR
       ▲FULL              ▲FULL
   R3..R6 (DROTHER, prio 0/1) ── 2-WAY antar sesama (cukup!)</pre>`,
      scenario: 'VLAN kantor berisi 8 router cabang (hub-and-spoke via satu switch). Tanpa tuning, DR jatuh ke router cabang terkecil (RID tertinggi) — ia kewalahan memproses LSA. Setelah prioritas diatur (core = 100), DR pindah ke router terkuat dan keluhan "OSPF lambat" hilang.',
      bestPractices: 'Tentukan DR/BDR eksplisit di setiap segmen multi-access: prioritas tinggi untuk router kuat & stabil, prioritas 0 untuk router kecil. Jangan biarkan acak.',
      security: 'DR menerima semua LSA segmen — pastikan DR adalah router tepercaya dengan autentikasi OSPF aktif; router liar yang menjadi DR bisa memanipulasi peta topologi.',
      challenge: 'Lab 3 router dalam satu VLAN: biarkan default, catat siapa DR/BDR. Lalu atur prioritas agar router TENGAH menjadi DR. Verifikasi + jelaskan mengapa tidak ada preemption saat DR baru bergabung.',
      interviewQ: 'Q: "Apa fungsi DR/BDR dan bagaimana dipilih?" — A: Di jaringan multi-access, DR/BDR menjadi pusat pertukaran LSA agar tidak terjadi adjacency penuh antar semua pasangan (hemat banjir LSA). Dipilih dari prioritas OSPF tertinggi (lalu RID tertinggi); prioritas 0 tidak bisa menjadi DR/BDR.',
      quiz: [
        {
          q: 'Mengapa OSPF membutuhkan DR/BDR di jaringan multi-access?',
          options: [
            'Agar lebih cepat dari STP',
            'Agar tidak terjadi adjacency penuh antar semua pasangan router (n×(n-1)/2) — LSA dipertukarkan terpusat via DR',
            'Untuk menggantikan router ID',
            'Agar VLAN bertambah',
          ],
          answer: 1,
          explain: 'Tanpa DR, banjir LSA tumbuh kuadratik dengan jumlah router; DR memangkasnya menjadi terpusat.',
        },
        {
          q: 'Urutan pemilihan DR adalah…',
          options: [
            'IP terkecil menang',
            'Prioritas OSPF tertinggi, seri → router ID tertinggi; prioritas 0 tidak bisa jadi DR/BDR',
            'Yang paling dulu dinyalakan',
            'Acak tiap jam',
          ],
          answer: 1,
          explain: 'Prioritas dulu (default 1), tie-break RID tertinggi, prioritas 0 = DROTHER permanen.',
        },
        {
          q: 'Di link point-to-point /30 antara 2 router, apakah DR dipilih?',
          options: [
            'Ya, selalu',
            'Tidak perlu — hanya 2 router, adjacency langsung FULL tanpa DR',
            'Ya, keduanya menjadi DR',
            'Tergantung VLAN',
          ],
          answer: 1,
          explain: 'DR hanya untuk multi-access (>2 router potensial); point-to-point cukup adjacency langsung.',
        },
      ],
    },
    {
      id: '12.8',
      title: 'OSPF Cost',
      body: `
<p><b>Cost</b> adalah <b>metric OSPF</b>: "ongkos" sebuah link yang dihitung dari <b>bandwidth</b>. Rumusnya sederhana dan wajib dihafal:</p>
<div class="callout blue"><div class="t">Rumus OSPF Cost</div><p style="margin:4px 0 0"><b>Cost = 10<sup>8</sup> / bandwidth (bps)</b> = 100.000.000 / bandwidth. Bandwidth lebih besar → cost lebih kecil → lebih dipilih. OSPF memilih <b>total cost terkecil</b> ke tujuan.</p></div>
<h3>Tabel Cost Default (Reference Bandwidth 100 Mbps)</h3>
<div class="tblwrap"><table>
<tr><th>Bandwidth</th><th>Cost</th><th>Keterangan</th></tr>
<tr><td>10 Mbps</td><td>10</td><td>100.000.000 / 10.000.000</td></tr>
<tr><td>100 Mbps</td><td>1</td><td>100.000.000 / 100.000.000</td></tr>
<tr><td>1 Gbps</td><td>1</td><td>Seharusnya 0,1 → dibulatkan jadi 1 ⚠️</td></tr>
<tr><td>10 Gbps</td><td>1</td><td>Seharusnya 0,01 → dibulatkan jadi 1 ⚠️</td></tr>
</table></div>
<h3>Masalah: Reference Bandwidth Ketinggalan Zaman</h3>
<p>Default 10<sup>8</sup> (100 Mbps) berasal dari era 1990-an: akibatnya <b>1 Gbps dan 10 Gbps punya cost SAMA (1)</b> — OSPF buta membedakan fiber 1G vs 10G! Solusi modern: naikkan reference bandwidth:</p>
<pre>R1(config)# router ospf 1
R1(config-router)# auto-cost reference-bandwidth 10000
! ALASAN: set reference ke 10000 Mbps (10 Gbps). Cost baru:
! 10 Gbps → 1, 1 Gbps → 10, 100 Mbps → 100, 10 Mbps → 1000.
! Kini OSPF BISA membedakan 1G vs 10G ✔.
! ⚠️ HARUS SAMA di semua router — beda reference = cost tidak
! konsisten = keputusan routing kacau. Jadikan standar organisasi.</pre>
<h3>Cost Manual per Interface</h3>
<pre>R1(config)# interface gi0/1
R1(config-if)# ip ospf cost 50
! ALASAN: menimpa cost kalkulasi otomatis — untuk traffic engineering
! ("paksa lewat jalur ini") atau mengkompensasi bandwidth yang salah
! terdeteksi. Dokumentasikan ALASANNYA — cost manual misterius adalah
! utang troubleshooting.</pre>
<div class="callout"><div class="t">Cek Bandwidth Aktual Interface</div><p style="margin:4px 0 0">Cost dihitung dari <b>bandwidth yang dikonfigurasi</b> di interface, bukan kapasitas fisik aktual! Link serial 2 Mbps yang terdeteksi 1544 Kbps default bisa menipu cost. Selalu pastikan <code>bandwidth</code> interface sesuai realita (<code>show interfaces | include BW</code>).</p></div>`,
      terms: [
        ['OSPF cost', 'Metric OSPF = 10^8 / bandwidth bps; total terkecil menang.'],
        ['Reference bandwidth', 'Pembilang rumus cost (default 100 Mbps); naikkan ke 10 Gbps di jaringan modern — harus seragam.'],
      ],
      diagram: `<pre>COST = 100.000.000 / BANDWIDTH

 Reference default (100 Mbps):
   10 Mbps  → cost 10
   100 Mbps → cost 1
   1 Gbps   → cost 1  ⚠️ SAMA dengan 10 Gbps — buta!
   10 Gbps  → cost 1  ⚠️

 Reference 10000 (10 Gbps) — MODERN ✔:
   10 Mbps  → cost 1000
   100 Mbps → cost 100
   1 Gbps   → cost 10
   10 Gbps  → cost 1   ✔ kini terbedakan!

 "Rumus boleh sama, tetapi pembilangnya harus ikut zaman."</pre>`,
      scenario: 'Upgrade backbone 1 Gbps → 10 Gbps tidak mengubah jalur OSPF sama sekali — karena cost keduanya = 1. Engineer heran "kenapa traffic tidak pindah ke link baru yang 10x lebih cepat". Solusi: auto-cost reference-bandwidth 10000 di semua router → OSPF langsung memilih 10 Gbps. Pelajaran: default 1990-an tidak cocok untuk jaringan 2020-an.',
      bestPractices: 'Standarkan reference-bandwidth (10000) di SELURUH router OSPF organisasimu sejak hari pertama. Catat di dokumen desain — inkonsistensi reference adalah bug yang sunyi.',
      security: 'Cost manual bisa dipakai untuk traffic engineering — tetapi juga bisa disalahgunakan untuk mengalihkan traffic. Batasi perubahan cost pada change terkontrol.',
      challenge: 'Hitung cost untuk: 64 Kbps, 2 Mbps, 45 Mbps, 155 Mbps (OC-3), 1 Gbps — dengan reference 100 dan 10000. Bandingkan: pada reference mana perbedaan 1G vs 10G terlihat?',
      interviewQ: 'Q: "Jelaskan rumus OSPF cost dan masalah reference bandwidth default." — A: Cost = 10^8/bandwidth; terkecil menang. Default reference 100 Mbps (era 90-an) membuat 1 Gbps dan 10 Gbps sama-sama cost 1 — OSPF buta membedakannya. Solusi: auto-cost reference-bandwidth 10000 (10 Gbps), wajib seragam di semua router.',
      quiz: [
        {
          q: 'Berapa rumus OSPF cost?',
          options: [
            'Cost = bandwidth / 10^8',
            'Cost = 10^8 / bandwidth (bps) — total terkecil menang',
            'Cost = jumlah hop × 10',
            'Cost = 100 tetap untuk semua link',
          ],
          answer: 1,
          explain: '100.000.000 dibagi bandwidth bps; link tercepat = cost terkecil = dipilih.',
        },
        {
          q: 'Dengan reference bandwidth default (100 Mbps), berapa cost link 1 Gbps dan 10 Gbps?',
          options: [
            '10 dan 1',
            'Keduanya 1 — OSPF tidak bisa membedakannya (dibulatkan)',
            '100 dan 10',
            '0 dan 0',
          ],
          answer: 1,
          explain: 'Hasil < 1 dibulatkan menjadi 1 — buta bandwidth modern. Inilah alasan menaikkan reference.',
        },
        {
          q: 'Mengapa perintah auto-cost reference-bandwidth harus sama di semua router?',
          options: [
            'Agar konfigurasi terlihat rapi',
            'Agar perhitungan cost konsisten — beda reference membuat router mengambil keputusan berdasarkan "mata uang" berbeda',
            'Agar hello interval sama',
            'Tidak harus sama, bebas',
          ],
          answer: 1,
          explain: 'Cost adalah bahasa bersama; reference berbeda = dialek berbeda = routing kacau.',
        },
      ],
    },
    {
      id: '12.9',
      title: 'OSPF Route Selection',
      body: `
<p>Ketika OSPF menawarkan <b>banyak rute</b> ke tujuan yang sama, ada <b>urutan seleksi berlapis</b>. Memahaminya menjawab "mengapa lewat jalur ini, bukan itu?"</p>
<h3>Lapis 1: Jenis Rute (Tipe LSA)</h3>
<div class="tblwrap"><table>
<tr><th>Kode</th><th>Jenis</th><th>Arti</th><th>Prioritas</th></tr>
<tr><td>O</td><td>Intra-area</td><td>Rute dalam area yang sama</td><td>1 (terbaik)</td></tr>
<tr><td>O IA</td><td>Inter-area</td><td>Rute dari area lain (via ABR)</td><td>2</td></tr>
<tr><td>O E1</td><td>External tipe 1</td><td>Dari luar OSPF; cost = internal + external</td><td>3</td></tr>
<tr><td>O E2</td><td>External tipe 2</td><td>Dari luar OSPF; cost = external saja (default)</td><td>4</td></tr>
</table></div>
<h3>Lapis 2: Metric Terkecil dalam Jenis yang Sama</h3>
<p>Dua rute O ke tujuan sama → pilih <b>cost total terkecil</b> (12.8). Seri sempurna → <b>ECMP</b>: <i>Equal-Cost Multi-Path</i> — traffic dibagi (load balancing) ke semua jalur! Maksimal 4–16 path tergantung platform.</p>
<h3>Contoh Membaca Tabel</h3>
<pre>R1# show ip route ospf
O    192.168.10.0/24 [110/11] via 192.168.99.2, Gi0/1
O IA 192.168.60.0/24 [110/25] via 192.168.99.2, Gi0/1
O E2 172.16.0.0/16 [110/20] via 192.168.99.3, Gi0/2

• O (intra) selalu dipilih atas O IA ke tujuan yang sama.
• O E2: metric 20 = cost EXTERNAL saja (tidak termasuk cost internal
  mencapai ASBR) — bandingkan dengan E1 yang menjumlahkan keduanya.</pre>
<h3>E1 vs E2: Kapan Peduli?</h3>
<p>Rute external = hasil <b>redistribusi</b> (mis. static route diumumkan ke OSPF). <b>E2</b> (default): cost tetap dari titik redistribusi — cocok bila hanya ada <b>satu pintu keluar</b>. <b>E1</b>: cost bertambah sesuai jarak — cocok bila <b>banyak pintu</b> dan ingin pintu terdekat yang menang.</p>
<div class="callout blue"><div class="t">Urutan Lengkap Pemilihan Rute OSPF</div><p style="margin:4px 0 0">1. <b>Jenis rute:</b> O &gt; O IA &gt; O E1 &gt; O E2. 2. <b>Metric:</b> cost total terkecil. 3. <b>ECMP</b> bila seri. (Dan ingat 11.6: bila bersaing dengan static, <b>AD</b> 1 vs 110 memutuskan lebih dulu!)</p></div>`,
      terms: [
        ['Intra-area (O)', 'Rute dalam satu area OSPF; prioritas tertinggi.'],
        ['Inter-area (O IA)', 'Rute dari area lain via ABR.'],
        ['External E1/E2', 'Rute redistribusi dari luar OSPF; E1 menjumlahkan cost internal, E2 tidak.'],
        ['ECMP', 'Equal-Cost Multi-Path — load balancing ke banyak jalur bermetric sama.'],
        ['Redistribusi', 'Mengumumkan rute dari sumber lain (static/connected/protokol) ke dalam OSPF.'],
        ['ASBR', 'Autonomous System Boundary Router — router yang melakukan redistribusi.'],
      ],
      diagram: `<pre>URUTAN SELEKSI RUTE OSPF

 Tujuan 192.168.60.0/24 ditawarkan sebagai:
   O (cost 30) ──┐
                 ├─▶ LAPIS 1: jenis → O menang (intra-area)
   O IA (cost 5) ┘         (meski cost-nya lebih kecil!)

 Dua rute O: cost 10 vs cost 10 ──▶ LAPIS 2: seri → ECMP
   → traffic dibagi dua jalur ✔ (load balancing gratis)

 vs static: AD 1 (static) mengalahkan AD 110 (OSPF) ──▶ LAPIS 0: AD dulu!</pre>`,
      scenario: 'Dua uplink ke data center: OSPF memilih satu (cost lebih kecil), satunya menganggur. Engineer menyamakan cost kedua link → ECMP aktif → bandwidth efektif dobel tanpa protokol tambahan. ECMP adalah "load balancing gratis" yang sering terlupakan.',
      bestPractices: 'Manfaatkan ECMP untuk load balancing alami: samakan cost link redundan yang setara. Untuk rute external, pilih E1 vs E2 sesuai jumlah pintu keluar.',
      security: 'Redistribusi yang ceroboh (redistribute connected/static tanpa filter) bisa membanjiri OSPF dengan ratusan rute tak perlu — selalu filter dengan route-map/prefix-list (Part 29).',
      challenge: 'Diberi 4 rute ke 10.0.0.0/8: O cost 50, O IA cost 10, O E1 cost 5, static. Tentukan pemenang + alasannya lapis per lapis. Lalu: bagaimana membuat O IA menang atas O? (Petunjuk: bisakah? Mengapa?)',
      interviewQ: 'Q: "Jelaskan urutan pemilihan rute OSPF." — A: Lapis 1 — jenis rute: O (intra) > O IA (inter) > O E1 > O E2 (external). Lapis 2 — metric terkecil dalam jenis sama; seri → ECMP load balancing. Catatan: bila bersaing dengan static, AD (1 vs 110) memutuskan sebelum semuanya.',
      quiz: [
        {
          q: 'Urutan prioritas jenis rute OSPF yang benar adalah…',
          options: [
            'O E2 > O E1 > O IA > O',
            'O (intra-area) > O IA (inter-area) > O E1 > O E2 (external)',
            'O IA > O > O E2 > O E1',
            'Semua setara, dipilih acak',
          ],
          answer: 1,
          explain: 'Intra-area paling dipercaya, lalu inter-area, lalu external (E1 di atas E2).',
        },
        {
          q: 'Dua rute O ke tujuan sama dengan cost identik. Apa yang terjadi?',
          options: [
            'Salah satu dibuang acak',
            'ECMP: keduanya dipasang dan traffic di-load-balance',
            'Router error',
            'Dipilih yang pertama dikonfigurasi',
          ],
          answer: 1,
          explain: 'Equal-Cost Multi-Path = load balancing gratis untuk jalur bermetric sama.',
        },
        {
          q: 'Apa perbedaan O E1 dan O E2?',
          options: [
            'Tidak ada perbedaan',
            'E1: metric = cost external + cost internal mencapai ASBR; E2: metric = cost external saja',
            'E1 lebih lambat dari E2',
            'E1 untuk IPv6, E2 untuk IPv4',
          ],
          answer: 1,
          explain: 'E1 memperhitungkan jarak ke pintu keluar (cocok multi-pintu); E2 cost datar (cocok satu pintu).',
        },
      ],
    },
    {
      id: '12.10',
      title: 'OSPF Troubleshooting',
      body: `
<p>Troubleshooting OSPF = <b>menelusuri rantai</b>: neighbor → database → routing table → packet. 90% masalah OSPF adalah <b>neighbor tidak FULL</b>.</p>
<h3>Metodologi 5 Langkah</h3>
<ol>
<li><b>Neighbor FULL?</b> <code>show ip ospf neighbor</code> — kosong/stuck = masalah di sini. Jangan lanjut sebelum FULL.</li>
<li><b>Parameter cocok?</b> <code>show ip ospf interface</code> bandingkan kedua sisi: area, subnet, hello/dead, auth, MTU, network type.</li>
<li><b>Interface ikut OSPF?</b> <code>show ip ospf interface brief</code> — interface tidak terdaftar = network statement kurang/salah wildcard.</li>
<li><b>Rute ada?</b> <code>show ip route ospf</code> — neighbor FULL tetapi rute kosong = masalah LSA/area/filtering.</li>
<li><b>Packet jalan?</b> ping/traceroute — rute ada tetapi ping gagal = masalah di luar OSPF (ACL, NAT, firewall).</li>
</ol>
<h3>Tabel State Stuck → Penyebab → Perintah</h3>
<div class="tblwrap"><table>
<tr><th>State</th><th>Penyebab Umum</th><th>Cek</th></tr>
<tr><td>(kosong/DOWN)</td><td>OSPF tidak jalan di interface; multicast diblokir</td><td>show ip ospf interface brief; show ip protocols</td></tr>
<tr><td>INIT</td><td>Hello satu arah; ACL; salah subnet</td><td>show ip ospf interface (bandingkan parameter)</td></tr>
<tr><td>2-WAY (harusnya FULL)</td><td>Normal antar DROTHER; atau DR/BDR election bermasalah</td><td>show ip ospf neighbor detail</td></tr>
<tr><td>EXSTART</td><td>MTU mismatch; router ID duplikat</td><td>show interfaces (MTU); show ip ospf neighbor (RID)</td></tr>
<tr><td>EXCHANGE/LOADING</td><td>LSA corrupt; memori; bug</td><td>show ip ospf database; clear ip ospf process</td></tr>
</table></div>
<h3>Contoh Sesi Lengkap</h3>
<pre>Kasus: R1 tidak belajar LAN R2 via OSPF.

1. R1# show ip ospf neighbor → KOSONG. (Berhenti di langkah 1!)
2. R1# show ip ospf interface brief → Gi0/1 terdaftar, area 0 ✔
3. R2# show ip ospf interface gi0/1 | include Area → Area 1 ✗ !!
   → MISMATCH: R1 area 0, R2 area 1. Hello ditolak diam-diam.
4. Fix: R2(config-router)# network 192.168.99.0 0.0.0.3 area 0
   (atau sengaja jadikan multi-area dengan ABR — sesuai desain)
5. R1# show ip ospf neighbor → FULL ✔
6. R1# show ip route ospf → O 192.168.50.0/24 ✔ → ping ✔ → tutup tiket.

Deliberate failure untuk latihan: ubah hello-interval di satu sisi
(ip ospf hello-interval 20) → amati neighbor flapping → kembalikan.</pre>
<div class="callout"><div class="t">Jangan "clear ip ospf process" Sembarangan</div><p style="margin:4px 0 0">Perintah ini me-reset <b>seluruh adjacency</b> router — di production berarti gangguan routing sesaat ke semua tetangga. Pakai hanya setelah diagnosis jelas, di maintenance window, dan catat di change log.</p></div>`,
      terms: [
        ['show ip ospf neighbor', 'Command utama: melihat status adjacency tiap tetangga OSPF.'],
        ['MTU mismatch', 'Perbedaan MTU antar sisi link — penyebab klasik stuck EXSTART.'],
      ],
      diagram: `<pre>ALUR TROUBLESHOOTING OSPF — ikuti rantainya

 (1) NEIGHBOR: show ip ospf neighbor → FULL?
      ✗ kosong/stuck → (2) bandingkan parameter interface kedua sisi
      ✔ FULL → lanjut
 (3) INTERFACE: show ip ospf interface brief → interface terdaftar?
      ✗ → network statement / wildcard salah
      ✔ → lanjut
 (4) RUTE: show ip route ospf → rute O ada?
      ✗ → masalah LSA/area/filter
      ✔ → lanjut
 (5) PACKET: ping/traceroute → gagal?
      → masalah di luar OSPF (ACL/NAT/firewall)

 "90% masalah OSPF berhenti di langkah 1–2."</pre>`,
      scenario: 'NOC: "cabang X tidak bisa dijangkau". Junior me-restart router cabang (tidak mempan). Senior: show ip ospf neighbor di pusat → tetangga cabang stuck EXSTART → cek MTU: sisi pusat 1500, sisi cabang 1492 (tunnel baru). Samakan MTU → FULL dalam 30 detik. Diagnosis 5 menit vs restart buta.',
      bestPractices: 'Buat baseline: simpan output show ip ospf neighbor + show ip route ospf saat sehat. Saat insiden, bandingkan — perbedaan langsung menunjuk masalah.',
      security: 'Perubahan OSPF di production (tambah network, ubah cost, clear process) adalah change berisiko: butuh change request + maintenance window + rollback plan (hapus network statement).',
      challenge: 'Suntikkan 4 fault OSPF ke lab (area mismatch, hello-interval beda, MTU beda, RID duplikat). Untuk tiap fault: tulis state neighbor, perintah pembukti, dan fix-nya. Ini "sertifikasi" troubleshooting OSPF-mu.',
      interviewQ: 'Q: "OSPF neighbor tidak FULL. Bagaimana troubleshooting-mu?" — A: Berlapis: (1) show ip ospf neighbor — state apa? (2) bandingkan parameter interface kedua sisi (area, subnet, hello/dead, auth, MTU); (3) pastikan interface terdaftar (network/wildcard); (4) cek rute O; (5) bila rute ada tetapi ping gagal, masalah di luar OSPF.',
      quiz: [
        {
          q: 'Langkah pertama troubleshooting OSPF adalah…',
          options: [
            'Restart router',
            'show ip ospf neighbor — pastikan adjacency FULL; 90% masalah ada di sini',
            'Ganti kabel',
            'Hapus semua konfigurasi OSPF',
          ],
          answer: 1,
          explain: 'Tanpa neighbor FULL tidak ada LSA, tanpa LSA tidak ada rute O. Selalu mulai dari sini.',
        },
        {
          q: 'Neighbor stuck di EXSTART. Dua penyebab paling umum?',
          options: [
            'VLAN salah dan kabel putus',
            'MTU mismatch antar sisi dan router ID duplikat',
            'Cost terlalu besar dan area terlalu banyak',
            'Hello interval terlalu cepat',
          ],
          answer: 1,
          explain: 'EXSTART = fase negosiasi database; MTU beda atau RID kembar menggagalkannya.',
        },
        {
          q: 'Neighbor sudah FULL tetapi show ip route ospf kosong. Kemungkinan…',
          options: [
            'Kabel putus',
            'Masalah di level LSA/area (mis. area terisolasi, filtering) — bukan adjacency',
            'Router ID salah format',
            'Hello interval terlalu lama',
          ],
          answer: 1,
          explain: 'FULL = pertukaran hello/LSA jalan; rute kosong berarti masalah di atasnya: area, summarization, atau filter redistribusi.',
        },
      ],
    },
  ],
};
