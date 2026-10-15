// Part 11 — Routing Fundamentals (Fase 2: Switching & Routing).
// Materi murni: konsep routing, routing table, static route, AD/metric, troubleshooting.
import type { Part } from './types';

export const part11: Part = {
  id: '11',
  number: 'PART 11',
  title: 'Routing Fundamentals',
  phaseId: 'fase-2',
  description: 'Dasar routing Layer 3: routing table, connected & static route, default route, AD, metric, next-hop, dan troubleshooting routing.',
  repoFolder: 'part-11-routing-fundamentals',
  objectives: [
    'Menjelaskan peran router dan perbedaan routing (Layer 3) dengan switching (Layer 2).',
    'Membaca routing table: prefix, next-hop, interface, administrative distance, dan metric.',
    'Mengonfigurasi connected, static, dan default route di Cisco IOS dengan verifikasi.',
    'Menjelaskan konsep administrative distance, metric, next-hop, dan recursive routing.',
    'Melakukan troubleshooting routing sistematis dengan ping, traceroute, dan show ip route.',
  ],
  prerequisites: 'Part 08–09 (switching & VLAN) dan Part 05 (IP & subnetting). Part 09 sub-bab 9.8–9.10 adalah jembatan langsung ke part ini.',
  subbabs: [
    {
      id: '11.1',
      title: 'Apa Itu Routing?',
      body: `
<p><b>Routing</b> adalah proses <b>meneruskan packet antar jaringan (subnet) yang berbeda</b> berdasarkan <b>IP address tujuan</b>. Perangkatnya disebut <b>router</b> — bekerja di <b>Layer 3 (Network)</b> model OSI.</p>
<h3>Pengertian Sederhana vs Teknis</h3>
<p><b>Sederhana:</b> kalau switch adalah resepsionis yang mengantar paket ke nomor kamar (dalam satu gedung), router adalah <b>kantor pos antar kota</b>: membaca alamat kota (network) pada paket, lalu memilih jalur terbaik ke kota itu.</p>
<p><b>Teknis:</b> router menerima packet, membaca <b>destination IP</b>, melakukan <b>lookup ke routing table</b> untuk menemukan network tujuan, memilih <b>next-hop</b> / interface keluar, <b>menulis ulang header Layer 2</b> (MAC baru), decrement <b>TTL</b>, lalu meneruskannya. Keputusan bersifat <b>hop-by-hop</b>: tiap router hanya peduli "lompatan berikutnya".</p>
<h3>Routing vs Switching</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Switching (Layer 2)</th><th>Routing (Layer 3)</th></tr>
<tr><td>Keputusan berdasarkan</td><td>MAC address</td><td>IP address</td></tr>
<tr><td>Tabel acuan</td><td>MAC address table</td><td>Routing table</td></tr>
<tr><td>Cakupan</td><td>Dalam satu jaringan/subnet</td><td>Antar jaringan/subnet</td></tr>
<tr><td>Broadcast</td><td>Diteruskan (satu broadcast domain)</td><td><b>Dihentikan</b> (router = batas broadcast domain)</td></tr>
<tr><td>Header ditulis ulang?</td><td>Tidak (frame diteruskan apa adanya)</td><td>Ya (MAC baru per hop, TTL -1)</td></tr>
<tr><td>TTL</td><td>Tidak ada di Ethernet</td><td>Ada di IP — pencegah loop (bandingkan 10.1!)</td></tr>
</table></div>
<h3>Packet Flow: PC-A → Server Beda Subnet</h3>
<pre>PC-A (192.168.20.50) → Server (192.168.30.10), via R1

1. PC-A: tujuan beda subnet → kirim ke gateway (.20.1)
   [src IP .20.50 | dst IP .30.10] [src MAC PC-A | dst MAC R1-Gi0/0.20]
2. R1 terima di Gi0/0.20 → baca dst IP .30.10
3. R1 lookup routing table → 192.168.30.0/24 via Gi0/0.30
4. R1 tulis ulang L2: [src MAC R1-Gi0/0.30 | dst MAC Server]
   IP TIDAK berubah · TTL 64 → 63
5. Switch VLAN 30 forward ke server ✔
6. Balasan menempuh jalan sebaliknya (dst IP .20.50)

Kaidah: IP = alamat ujung-ke-ujung (tetap) · MAC = alamat hop-ke-hop (berubah).</pre>
<div class="callout blue"><div class="t">Router = Batas Broadcast Domain</div><p style="margin:4px 0 0">Switch meneruskan broadcast; router <b>tidak</b>. Setiap interface router adalah batas broadcast domain tersendiri. Inilah alasan tiap VLAN butuh gateway di router/L3 switch (9.8): tanpa "pintu" Layer 3, broadcast (dan unicast) tidak bisa menyeberang subnet.</p></div>`,
      terms: [
        ['Routing', 'Penerusan packet antar jaringan berbeda berdasarkan destination IP via routing table.'],
        ['Router', 'Perangkat Layer 3 yang menghubungkan banyak jaringan dan membuat keputusan routing hop-by-hop.'],
        ['Hop-by-hop', 'Prinsip routing: tiap router hanya menentukan lompatan berikutnya, bukan seluruh jalur.'],
        ['TTL (Time To Live)', 'Field di header IP yang dikurangi 1 tiap router; packet dibuang saat TTL 0 — pencegah loop Layer 3.'],
      ],
      diagram: `<pre>SWITCH vs ROUTER — wilayah kerja

 [VLAN 20: 192.168.20.0/24]          [VLAN 30: 192.168.30.0/24]
        │                                       │
   ──── SWITCH (L2) ──── MAC ────         ──── SWITCH (L2) ──── MAC ────
        │                                       │
        └─────────── ROUTER (L3) ───────────────┘
              baca IP · routing table · tulis ulang MAC · TTL-1

 Switch: "kamar berapa?" (satu gedung) · Router: "kota mana?" (antar kota)</pre>`,
      scenario: 'Kantor punya 5 VLAN (Part 09) tetapi user tidak bisa ke server beda VLAN. Switch sudah benar — yang belum ada adalah "kantor pos"-nya: tidak ada perangkat Layer 3 dengan gateway tiap VLAN. Begitu router/L3 switch dipasang dan routing table terisi, semua VLAN terhubung terkendali. Pelajaran: switching tanpa routing = ruangan-ruangan tanpa koridor.',
      bestPractices: 'Selalu gambar batas Layer 2 vs Layer 3 di diagram: di mana broadcast berhenti, di mana gateway berada. Diagram yang tidak menunjukkan gateway adalah diagram yang belum selesai.',
      security: 'Router adalah titik kontrol antar-jaringan: di sinilah ACL, firewall policy, dan NAT dipasang. Siapa menguasai routing, menguasai siapa bisa mencapai siapa.',
      challenge: 'Jelaskan perjalanan reply packet dari server (.30.10) kembali ke PC-A (.20.50): tulis perubahan MAC dan TTL di tiap hop, dan jelaskan mengapa IP tidak berubah.',
      interviewQ: 'Q: "Apa beda switching dan routing?" — A: Switching (L2) meneruskan frame berdasarkan MAC dalam satu jaringan tanpa mengubah header; routing (L3) meneruskan packet berdasarkan IP antar jaringan, menulis ulang MAC per hop, dan mengurangi TTL. Router juga menjadi batas broadcast domain.',
      quiz: [
        {
          q: 'Router membuat keputusan forwarding berdasarkan…',
          options: [
            'MAC address tujuan',
            'IP address tujuan (Layer 3)',
            'Nomor port TCP',
            'Nama VLAN',
          ],
          answer: 1,
          explain: 'Router bekerja di Layer 3: membaca destination IP lalu lookup ke routing table.',
        },
        {
          q: 'Dalam perjalanan PC-A → server beda subnet, apa yang berubah di router dan apa yang tetap?',
          options: [
            'IP berubah, MAC tetap',
            'MAC ditulis ulang per hop dan TTL berkurang; IP source/destination tetap ujung-ke-ujung',
            'Semuanya berubah total',
            'Tidak ada yang berubah',
          ],
          answer: 1,
          explain: 'Kaidah routing: IP end-to-end tetap; MAC hop-to-hop ditulis ulang; TTL dikurangi 1.',
        },
        {
          q: 'Mengapa router disebut batas broadcast domain?',
          options: [
            'Karena router memblokir semua traffic',
            'Karena router tidak meneruskan frame broadcast — setiap interface-nya adalah broadcast domain tersendiri',
            'Karena router tidak punya MAC address',
            'Karena router hanya untuk internet',
          ],
          answer: 1,
          explain: 'Broadcast berhenti di router; inilah alasan tiap subnet/VLAN butuh gateway untuk berkomunikasi.',
        },
      ],
    },
    {
      id: '11.2',
      title: 'Routing Table',
      body: `
<p><b>Routing table</b> adalah "peta" router: daftar <b>network tujuan</b> beserta <b>cara mencapainya</b> (lewat interface mana / ke next-hop mana). Setiap keputusan routing = satu baris lookup di tabel ini.</p>
<h3>Anatomi Satu Baris Routing Table</h3>
<pre>R1# show ip route
Codes: C - connected, S - static, O - OSPF, D - EIGRP ...

Gateway of last resort is 0.0.0.0 to network 0.0.0.0

C    192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
S    192.168.50.0/24 [1/0] via 192.168.99.254
O    192.168.60.0/24 [110/20] via 192.168.99.253, 00:12:33, Gi0/1

Membaca baris "S 192.168.50.0/24 [1/0] via 192.168.99.254":
• S            = sumber rute: Static (dikonfigurasi manual)
• 192.168.50.0/24 = network TUJUAN (prefix)
• [1/0]        = [Administrative Distance / Metric] → 11.6 & 11.7
• via 192.168.99.254 = NEXT-HOP: kirim packet ke IP ini → 11.8
• (interface & umur rute menyusul bila ada)</pre>
<h3>Kode Sumber Rute (yang Umum)</h3>
<div class="tblwrap"><table>
<tr><th>Kode</th><th>Arti</th><th>Asal</th></tr>
<tr><td>C</td><td>Connected</td><td>Interface router sendiri yang up (11.3)</td></tr>
<tr><td>S</td><td>Static</td><td>Diketik manual oleh admin (11.4)</td></tr>
<tr><td>S*</td><td>Static default</td><td>Default route manual (11.5)</td></tr>
<tr><td>O</td><td>OSPF</td><td>Dipelajari via protokol OSPF (Part 12)</td></tr>
<tr><td>D</td><td>EIGRP</td><td>Dipelajari via EIGRP (proprietary Cisco)</td></tr>
</table></div>
<h3>Longest Prefix Match: Aturan Pencarian</h3>
<p>Jika dua baris cocok dengan destination IP, router memilih <b>prefix terpanjang (paling spesifik)</b>:</p>
<pre>Tabel:  192.168.0.0/16 via A
         192.168.30.0/24 via B
Packet ke 192.168.30.10 → cocok KEDUANYA → pilih /24 via B ✔
(prinsip: "alamat paling spesifik menang")</pre>
<div class="callout blue"><div class="t">Routing Table = Otak, Bukan Sekadar Daftar</div><p style="margin:4px 0 0">Semua "kecerdasan" routing — static, OSPF, keputusan AD/metric — bermuara ke satu tabel ini. Saat troubleshooting, <code>show ip route</code> adalah langkah pertama yang menjawab: "menurut router ini, jalan ke network X lewat mana?"</p></div>`,
      terms: [
        ['Routing table', 'Daftar network tujuan + cara mencapainya (next-hop/interface); acuan setiap keputusan routing.'],
        ['Prefix', 'Network tujuan dalam format CIDR (mis. 192.168.30.0/24).'],
        ['Longest prefix match', 'Aturan: bila banyak rute cocok, pilih prefix terpanjang (paling spesifik).'],
        ['Gateway of last resort', 'Default route (0.0.0.0/0) — jalan terakhir bila tidak ada rute spesifik yang cocok.'],
      ],
      diagram: `<pre>MEMBACA SATU BARIS ROUTING TABLE

 S    192.168.50.0/24   [1/0]   via 192.168.99.254
 │          │              │              │
 │          │              │              └─ NEXT-HOP: kirim ke IP ini
 │          │              └─ [AD / metric]: 1 = static, 0 = cost
 │          └─ TUJUAN: network 192.168.50.0/24
 └─ SUMBER: S = static (manual)

 "Untuk ke 192.168.50.x, kirim ke 192.168.99.254 (rute static, AD 1)."</pre>`,
      scenario: 'NOC: "kantor cabang tidak bisa dijangkau". Cek show ip route di router pusat: rute ke subnet cabang TIDAK ADA — seseorang menghapus static route saat maintenance. Solusi: konfigurasi ulang 1 baris. Tanpa kemampuan membaca tabel ini, diagnosis bisa berjam-jam menebak-nebak.',
      bestPractices: 'Hafalkan kode C, S, S*, O. Jadikan show ip route + show ip route <network> sebagai refleks pertama setiap masalah "tidak bisa mencapai network X".',
      security: 'Routing table yang diracuni (rogue OSPF/static jahat) mengalihkan traffic ke attacker. Amankan protokol routing dengan autentikasi (Part 12, 29) dan batasi siapa bisa konfigurasi router.',
      challenge: 'Diberi tabel: C 10.0.0.0/8, S 10.1.0.0/16 via X, O 10.1.5.0/24 via Y. Packet ke 10.1.5.9 lewat mana? Ke 10.2.9.9? Jelaskan memakai longest prefix match.',
      interviewQ: 'Q: "Jelaskan isi satu baris routing table Cisco." — A: Kode sumber rute (C/S/O), prefix tujuan, [AD/metric], dan next-hop atau interface keluar. Contoh: S 192.168.50.0/24 [1/0] via 192.168.99.254 = rute static ke network itu dengan AD 1 metric 0 lewat next-hop tersebut.',
      quiz: [
        {
          q: 'Baris "S 192.168.50.0/24 [1/0] via 192.168.99.254" artinya…',
          options: [
            'Rute OSPF ke 192.168.50.0/24',
            'Rute static ke 192.168.50.0/24, AD 1, metric 0, next-hop 192.168.99.254',
            'Interface connected 192.168.50.0/24',
            'Default route',
          ],
          answer: 1,
          explain: 'S = static; [1/0] = AD 1/metric 0; via = next-hop. Baca baris ini sudah setengah troubleshooting.',
        },
        {
          q: 'Dua rute cocok untuk 192.168.30.10: 192.168.0.0/16 dan 192.168.30.0/24. Mana yang dipilih?',
          options: [
            '192.168.0.0/16 karena lebih besar',
            '192.168.30.0/24 — longest prefix match: prefix terpanjang (paling spesifik) menang',
            'Dipilih acak',
            'Keduanya dipakai bergantian',
          ],
          answer: 1,
          explain: 'Longest prefix match: /24 lebih spesifik dari /16, maka rute /24 yang dipakai.',
        },
        {
          q: 'Apa itu "gateway of last resort"?',
          options: [
            'Router cadangan yang mati',
            'Default route (0.0.0.0/0) — dipakai bila tidak ada rute spesifik yang cocok',
            'Gateway dengan IP tertinggi',
            'Router paling jauh',
          ],
          answer: 1,
          explain: 'Gateway of last resort = default route: jalan terakhir untuk semua destination yang tidak dikenal.',
        },
      ],
    },
    {
      id: '11.3',
      title: 'Connected Route',
      body: `
<p><b>Connected route</b> adalah rute ke network yang <b>langsung menempel</b> di interface router itu sendiri. Ini rute paling dasar: <b>otomatis muncul</b> begitu interface dikonfigurasi IP dan berstatus <b>up/up</b> — tanpa diketik manual.</p>
<h3>Syarat Munculnya Connected Route</h3>
<ol>
<li>Interface diberi <b>IP address + subnet mask</b>.</li>
<li>Interface berstatus <b>up/up</b> (administratively up + line protocol up).</li>
</ol>
<p>Satu syarat gagal = rute hilang. Inilah penyebab klasik "tiba-tiba tidak bisa": kabel tercabut → interface down → connected route lenyap → network itu tak terjangkau.</p>
<h3>Contoh</h3>
<pre>R1(config)# interface gi0/0.20
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
! → otomatis muncul di tabel:
C    192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
! Kode "C" = connected. AD connected = 0 (paling dipercaya — 11.6).</pre>
<div class="callout"><div class="t">Connected = Fondasi Semua Routing</div><p style="margin:4px 0 0">Static route, OSPF, default route — semuanya <b>bergantung</b> pada connected route sebagai "kaki" untuk mencapai next-hop. Next-hop yang tidak terjangkau via connected route = rute yang tidak valid. Saat routing aneh, cek connected dulu.</p></div>
<h3>Verifikasi Cepat</h3>
<pre>R1# show ip interface brief
Interface       IP-Address     Status  Protocol
Gi0/0.20        192.168.20.1   up      up      ← up/up = connected ADA
Gi0/0.30        unassigned     down    down    ← down = connected TIDAK ADA

R1# show ip route connected
C    192.168.20.0/24 is directly connected, Gi0/0.20
! ✔ Filter "connected" menampilkan hanya rute C — berguna di tabel besar.</pre>`,
      terms: [
        ['Connected route', 'Rute otomatis ke network yang langsung menempel di interface up/up; kode C; AD 0.'],
      ],
      diagram: `<pre>CONNECTED ROUTE — otomatis dari interface sendiri

        R1
   Gi0/0.20 = 192.168.20.1/24 (up/up)
        │
        │  otomatis:
        ▼
   ┌─────────────────────────────────┐
   │ C  192.168.20.0/24 is directly  │
   │    connected, Gi0/0.20           │
   └─────────────────────────────────┘

   Kabel dicabut → down/down → baris C HILANG → network tak terjangkau.</pre>`,
      scenario: 'Setelah reboot router, satu VLAN tidak bisa dijangkau. Ternyata SFP modul di port trunk belum terdeteksi sempurna → subinterface down → connected route hilang. Bukan konfigurasi yang hilang — hanya fisik yang belum siap. Cek show ip interface brief menghemat 1 jam debugging konfigurasi.',
      bestPractices: 'Setiap masalah routing: verifikasi connected route dulu (show ip route connected + show ip interface brief). 50% masalah routing adalah interface yang down.',
      security: 'Interface yang tidak dipakai sebaiknya di-shutdown: interface up yang menganggur = connected route menganggur = permukaan serangan yang tidak perlu.',
      challenge: 'Lab: shutdown satu subinterface ROAS, lalu amati show ip route — baris C apa yang hilang? Nyalakan lagi — apa yang kembali? Jelaskan hubungannya dengan "kaki" next-hop.',
      interviewQ: 'Q: "Kapan connected route muncul dan kapan hilang?" — A: Muncul otomatis saat interface punya IP dan berstatus up/up; hilang saat interface down (kabel tercabut, shutdown, atau line protocol gagal).',
      quiz: [
        {
          q: 'Syarat agar connected route muncul di routing table adalah…',
          options: [
            'Diketik manual dengan ip route',
            'Interface memiliki IP address dan berstatus up/up — otomatis muncul',
            'Harus mengaktifkan OSPF dulu',
            'Harus ada default route',
          ],
          answer: 1,
          explain: 'Connected = otomatis; syaratnya IP terkonfigurasi + interface up/up.',
        },
        {
          q: 'Kabel trunk ke router tercabut. Apa yang terjadi di routing table?',
          options: [
            'Tidak ada perubahan',
            'Connected route untuk network di interface itu hilang karena interface down',
            'Semua static route terhapus permanen',
            'Router reboot',
          ],
          answer: 1,
          explain: 'Interface down → connected route lenyap → network langsung tak terjangkau; juga melumpuhkan rute yang memakai next-hop via interface itu.',
        },
        {
          q: 'Berapa administrative distance (AD) dari connected route?',
          options: [
            '1',
            '0 — paling dipercaya, tidak bisa dikalahkan',
            '110',
            '90',
          ],
          answer: 1,
          explain: 'Connected AD 0: network yang menempel langsung adalah kebenaran mutlak bagi router itu.',
        },
      ],
    },
    {
      id: '11.4',
      title: 'Static Route',
      body: `
<p><b>Static route</b> adalah rute yang <b>diketik manual</b> oleh admin ke routing table. Tidak ada protokol, tidak ada pertukaran info — murni "saya perintahkan: untuk ke network X, lewat Y".</p>
<h3>Kapan Memakai Static Route?</h3>
<ul>
<li><b>Jaringan kecil / stub network:</b> hanya 1–2 jalan keluar — dynamic routing berlebihan.</li>
<li><b>Default route</b> ke ISP (11.5) — hampir selalu static.</li>
<li><b>Kontrol penuh:</b> admin menentukan persis jalur traffic (mis. link A untuk cabang X).</li>
<li><b>Lab belajar:</b> memahami routing table sebelum masuk OSPF (Part 12).</li>
</ul>
<p>Keterbatasan: <b>tidak adaptif</b> — jika link putus, static route tetap menunjuk ke jalan buntu sampai admin mengubah manual. Untuk jaringan besar/dinamis, gunakan dynamic routing (Part 12).</p>
<h3>Lab Terpandu: Static Route Antar Dua Router</h3>
<p><b>Topology:</b> R1 (LAN 192.168.20.0/24 di Gi0/0.20) ── 192.168.99.0/24 (Gi0/1: R1=.99.1, R2=.99.2) ── R2 (LAN 192.168.50.0/24 di Gi0/0).</p>
<p><b>Objective:</b> PC di LAN R1 (192.168.20.50) bisa ping PC di LAN R2 (192.168.50.50) — dua arah.</p>
<h3>Configuration</h3>
<pre>! Di R1: "untuk mencapai LAN R2 (192.168.50.0/24), kirim ke R2 (.99.2)"
R1(config)# ip route 192.168.50.0 255.255.255.0 192.168.99.2
! MEMBACA PERINTAH: ip route [TUJUAN] [MASK] [NEXT-HOP]
! ALASAN tiap bagian:
! • 192.168.50.0 255.255.255.0 = network tujuan yang ingin dicapai.
! • 192.168.99.2 = next-hop: "titipkan packet ke router tetangga ini,
!   dia yang tahu jalan selanjutnya". Next-hop HARUS terjangkau via
!   connected route (R1 punya C 192.168.99.0/24) — kalau tidak, rute
!   ini tidak valid (lihat 11.9 recursive routing).

! Di R2 (ARAH BALIK — sering lupa!):
R2(config)# ip route 192.168.20.0 255.255.255.0 192.168.99.1
! ALASAN: routing bersifat PER ARAH. R1 tahu jalan ke R2, tetapi reply
! dari PC R2 butuh R2 tahu jalan pulang ke 192.168.20.0/24.
! "Ping gagal satu arah" 90% karena rute balik belum dibuat.</pre>
<h3>Verification</h3>
<pre>R1# show ip route static
S    192.168.50.0/24 [1/0] via 192.168.99.2
! ✔ Baris S muncul: tujuan, AD 1, metric 0, next-hop benar.

R1# ping 192.168.50.50 source 192.168.20.1
!!!!!
! ✔ 5/5 berhasil. "source" memaksa ping dari IP LAN (bukan IP WAN .99.1)
! agar menguji path yang benar — trik troubleshooting penting.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> salah ketik next-hop: <code>ip route 192.168.50.0 255.255.255.0 192.168.99.99</code> (.99 tidak ada).</li>
<li><b>Gejala:</b> ping gagal total; <code>show ip route static</code> baris S <b>tidak muncul</b> (next-hop tak terjangkau = rute invalid, tidak dimasukkan tabel).</li>
<li><b>Troubleshoot:</b> <code>show ip route 192.168.99.99</code> → tidak ada rute → next-hop unreachable. Itulah akar masalahnya.</li>
<li><b>Fix:</b> <code>no ip route 192.168.50.0 255.255.255.0 192.168.99.99</code> lalu buat ulang dengan .99.2.</li>
<li><b>Final verification:</b> baris S muncul + ping dua arah berhasil.</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, salah ketik next-hop hanya berarti ping gagal. Di production, static route yang salah bisa <b>mengalihkan traffic penting ke lubang hitam</b> atau menimpa rute OSPF (AD static 1 < OSPF 110!). Selalu verifikasi dengan <code>show ip route</code> setelah menambah static route.</p></div>`,
      terms: [
        ['Static route', 'Rute manual (ip route) ke network tujuan via next-hop/interface; tidak adaptif terhadap perubahan topologi.'],
        ['Stub network', 'Jaringan dengan satu jalan keluar; kandidat ideal static/default route.'],
      ],
      diagram: `<pre>STATIC ROUTE — dua arah, manual

  [LAN R1: 192.168.20.0/24]                [LAN R2: 192.168.50.0/24]
         │ Gi0/0.20 .20.1                        │ Gi0/0 .50.1
         ▼                                       ▼
        R1 ──── 192.168.99.0/24 ──── R2
        .99.1                       .99.2

  R1: ip route 192.168.50.0 255.255.255.0 192.168.99.2  ──▶
  ◀── R2: ip route 192.168.20.0 255.255.255.0 192.168.99.1

  ❌ Lupa rute balik = ping "berangkat" tapi tidak "pulang".</pre>`,
      scenario: 'Kantor cabang kecil dengan satu link ke pusat: tidak butuh OSPF — cukup 2 static route (ke pusat + default). Engineer senior menolak memasang dynamic routing di sana: "kompleksitas adalah musuh keandalan". Static route adalah jawaban yang tepat untuk masalah yang sederhana.',
      bestPractices: 'Selalu buat rute pulang (return path). Dokumentasikan setiap static route: tujuan, next-hop, dan ALASAN bisnisnya — static route misterius adalah mimpi buruk engineer berikutnya.',
      security: 'Static route dengan AD rendah bisa membajak traffic dari dynamic routing. Audit static route berkala: setiap baris S harus punya pemilik dan alasan yang jelas.',
      challenge: 'Lab 3 router segaris (R1–R2–R3): buat PC di LAN R1 bisa ping PC di LAN R3 memakai static route SAJA. Berapa baris ip route yang dibutuhkan total? (Petunjuk: tiap router butuh tahu kedua arah.)',
      interviewQ: 'Q: "Kapan memakai static route dan apa kelemahannya?" — A: Untuk jaringan kecil/stub, default route ke ISP, atau kontrol jalur manual. Kelemahan: tidak adaptif — link putus tidak terdeteksi, rute tetap menunjuk ke jalan buntu sampai diubah manual; untuk skala besar gunakan dynamic routing.',
      quiz: [
        {
          q: 'Perintah "ip route 192.168.50.0 255.255.255.0 192.168.99.2" artinya…',
          options: [
            'Memberi IP ke interface',
            'Rute static: untuk mencapai 192.168.50.0/24, kirim packet ke next-hop 192.168.99.2',
            'Menghapus rute ke 192.168.50.0/24',
            'Mengaktifkan OSPF',
          ],
          answer: 1,
          explain: 'Format: ip route <tujuan> <mask> <next-hop>. Rute manual satu arah ke network tujuan.',
        },
        {
          q: 'PC-A bisa ping PC-B tetapi reply tidak kembali. Penyebab paling mungkin?',
          options: [
            'Kabel putus',
            'Rute balik (return path) belum dibuat di router sisi B — routing bersifat per arah',
            'Switch rusak',
            'VLAN ID salah',
          ],
          answer: 1,
          explain: 'Ping butuh jalan pergi DAN pulang. "Berangkat OK, pulang gagal" = klasik lupa rute balik.',
        },
        {
          q: 'Static route dengan next-hop yang tidak terjangkau (tidak ada di routing table) akan…',
          options: [
            'Tetap dimasukkan ke tabel',
            'Tidak dimasukkan ke routing table (invalid) — baris S tidak muncul di show ip route',
            'Membuat router reboot',
            'Otomatis mencari next-hop lain',
          ],
          answer: 1,
          explain: 'Next-hop harus reachable via connected/static lain (recursive lookup); jika tidak, rute ditolak masuk tabel.',
        },
      ],
    },
    {
      id: '11.5',
      title: 'Default Route',
      body: `
<p><b>Default route</b> (<code>0.0.0.0/0</code>) adalah rute <b>"untuk semua tujuan yang tidak dikenal"</b> — jalan terakhir bila tidak ada rute spesifik yang cocok (<i>gateway of last resort</i>, lihat 11.2). Hampir selalu berupa static route ke ISP atau router upstream.</p>
<h3>Analogi</h3>
<p>Routing table seperti buku alamat: ada alamat spesifik (static/connected/OSPF), dan ada satu baris terakhir: <b>"selain yang tercantum di atas → tanyakan ke kantor pos pusat"</b>. Itulah default route — ia menangkap <i>sisa</i> traffic, termasuk seluruh internet.</p>
<h3>Konfigurasi (Cisco)</h3>
<pre>R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
! MEMBACA: tujuan 0.0.0.0 mask 0.0.0.0 = "semua IP" → next-hop IP ISP.
! ALASAN: router cabang tidak perlu tahu 800.000 rute internet —
! cukup "yang tidak dikenal → lempar ke ISP". Sederhana & hemat memori.

! Varian via interface keluar (untuk link point-to-point / DHCP):
R1(config)# ip route 0.0.0.0 0.0.0.0 GigabitEthernet0/1
! ALASAN: tanpa next-hop IP — "lempar keluar interface ini".
! Cocok untuk link serial/PPPoE di mana next-hop dinamis.

! Verifikasi:
R1# show ip route | include Gateway|S\*
Gateway of last resort is 203.0.113.1 to network 0.0.0.0
S*   0.0.0.0/0 [1/0] via 203.0.113.1
! ✔ Kode S* = static default. Baris "Gateway of last resort" terisi.</pre>
<h3>Default Route vs Longest Prefix Match</h3>
<p><code>0.0.0.0/0</code> adalah prefix <b>terpendek</b> — ia selalu kalah dari rute spesifik mana pun (11.2). Urutan: connected/static/OSPF spesifik dulu, default route <b>terakhir</b>. Inilah yang membuatnya aman: ia tidak akan "mencuri" traffic yang sudah punya rute spesifik.</p>
<div class="callout blue"><div class="t">Kapan TIDAK Pakai Default Route?</div><p style="margin:4px 0 0">Router <b>ISP/core internet</b> tidak boleh punya default route buta — mereka harus tahu rute spesifik (via BGP) agar tidak terjadi routing loop antar ISP. Default route adalah alat <b>jaringan stub/cabang</b>, bukan backbone internet.</p></div>
`,
      terms: [
        ['Default route', 'Rute 0.0.0.0/0 — menangkap semua destination tanpa rute spesifik; gateway of last resort.'],
      ],
      diagram: `<pre>DEFAULT ROUTE — "selain yang tercantum, ke sini"

 Routing table R1 (cabang):
   C  192.168.20.0/24 → Gi0/0.20      (spesifik ✔)
   S  192.168.50.0/24 → via .99.2     (spesifik ✔)
   S* 0.0.0.0/0       → via 203.0.113.1 (ISP)  ← "sisanya ke sini"

 Packet ke 192.168.20.9  → cocok C ✔ (bukan default)
 Packet ke 8.8.8.8       → tidak cocok apa pun → S* ke ISP ✔
 Packet ke 192.168.50.7  → cocok S ✔ (bukan default)</pre>`,
      scenario: 'Warnet 30 PC: pemilik tidak butuh OSPF — cukup satu default route ke modem ISP. Semua traffic internet mengalir lewat satu baris konfigurasi. Sederhana, murah, dan tepat guna: tidak semua jaringan butuh protokol routing canggih.',
      bestPractices: 'Setiap router cabang/stub wajib punya default route yang jelas ke upstream. Dokumentasikan next-hop-nya (IP ISP) agar troubleshooting "internet mati" langsung tahu ke mana harus cek.',
      security: 'Default route yang menunjuk ke next-hop jahat = seluruh traffic internet dibajak. Lindungi konfigurasi router (Part 29) — satu baris S* yang diubah attacker berakibat fatal.',
      challenge: 'Jelaskan mengapa default route TIDAK akan mencuri packet ke 192.168.50.7 padahal 0.0.0.0/0 "mencakup semua IP". Kaitkan dengan longest prefix match.',
      interviewQ: 'Q: "Apa itu default route dan kapan dipakai?" — A: Rute 0.0.0.0/0 untuk semua tujuan tanpa rute spesifik (gateway of last resort). Dipakai di jaringan stub/cabang menuju ISP/upstream — router tidak perlu menghafal ratusan ribu rute internet, cukup satu baris "sisanya ke sini".',
      quiz: [
        {
          q: 'Apa itu default route?',
          options: [
            'Rute tercepat di jaringan',
            'Rute 0.0.0.0/0 yang menangkap semua destination tanpa rute spesifik (gateway of last resort)',
            'Rute bawaan pabrik yang tidak bisa diubah',
            'Rute khusus untuk VLAN 1',
          ],
          answer: 1,
          explain: 'Default route = baris terakhir routing table: "yang tidak dikenal → ke sini".',
        },
        {
          q: 'Mengapa default route aman dan tidak mencuri traffic rute spesifik?',
          options: [
            'Karena dikonfigurasi terakhir',
            'Karena 0.0.0.0/0 adalah prefix terpendek — selalu kalah dari rute spesifik via longest prefix match',
            'Karena hanya aktif saat darurat',
            'Karena bandwidth-nya dibatasi',
          ],
          answer: 1,
          explain: 'Longest prefix match: /0 kalah dari prefix mana pun yang lebih panjang; default hanya untuk sisa traffic.',
        },
        {
          q: 'Kapan default route TIDAK tepat dipakai?',
          options: [
            'Di router cabang kecil',
            'Di router backbone/ISP — mereka butuh rute spesifik (BGP), bukan lemparan buta yang bisa loop',
            'Di router dengan satu ISP',
            'Di lab belajar',
          ],
          answer: 1,
          explain: 'Backbone internet harus tahu rute spesifik; default route buta antar-ISP berisiko routing loop.',
        },
      ],
    },
    {
      id: '11.6',
      title: 'Administrative Distance',
      body: `
<p><b>Administrative Distance (AD)</b> adalah nilai <b>kepercayaan</b> (0–255) terhadap <b>sumber</b> sebuah rute. Ketika <b>dua sumber berbeda</b> menawarkan rute ke <b>network tujuan yang sama</b>, router memilih yang <b>AD-nya terkecil</b> (paling dipercaya).</p>
<h3>Analogi</h3>
<p>Dua orang memberi tahu jalan ke pasar: satpam gedung (sangat dipercaya) vs orang asing (kurang dipercaya). Kamu ikut satpam. AD adalah "skor kepercayaan" tiap pemberi info rute.</p>
<h3>Tabel AD Umum (Cisco — hafalkan!)</h3>
<div class="tblwrap"><table>
<tr><th>AD</th><th>Sumber Rute</th><th>Kode</th></tr>
<tr><td>0</td><td>Connected</td><td>C</td></tr>
<tr><td>1</td><td>Static</td><td>S</td></tr>
<tr><td>90</td><td>EIGRP internal</td><td>D</td></tr>
<tr><td>110</td><td>OSPF</td><td>O</td></tr>
<tr><td>120</td><td>RIP</td><td>R</td></tr>
<tr><td>170</td><td>EIGRP external</td><td>D EX</td></tr>
<tr><td>255</td><td>Unreachable</td><td>— (rute tidak dipakai)</td></tr>
</table></div>
<h3>Contoh Duel AD</h3>
<pre>R1 belajar 192.168.50.0/24 dari DUA sumber:
  • Static (diketik manual):        AD 1
  • OSPF (dari tetangga):           AD 110

→ Pemenang: STATIC (1 < 110). Baris OSPF menjadi CADANGAN:
  tidak masuk tabel utama, tetapi otomatis mengambil alih
  jika static route dihapus. Inilah "floating static route"
  bila dibalik (static AD 120 > OSPF 110 = static jadi cadangan OSPF).</pre>
<div class="callout"><div class="t">AD vs Metric — Jangan Tertukar</div><p style="margin:4px 0 0"><b>AD</b> memilih <b>sumber rute</b> (static vs OSPF — "siapa yang dipercaya"). <b>Metric</b> (11.7) memilih <b>jalur terbaik dalam satu sumber</b> (OSPF path A vs path B — "jalan mana termurah"). Urutan: AD dulu, metric kemudian.</p></div>
<h3>Floating Static Route: Trik Cadangan</h3>
<pre>R1(config)# ip route 192.168.50.0 255.255.255.0 192.168.99.2 120
!                                                          ^^^
! ALASAN: angka 120 di ujung = AD manual. Static normal AD 1 (mengalahkan
! OSPF). Dengan AD 120, static ini KALAH dari OSPF (110) → menjadi rute
! CADANGAN yang otomatis aktif jika OSPF gagal. "Floating" = mengambang
! menunggu giliran. Pola umum untuk backup link.</pre>`,
      terms: [
        ['Administrative Distance (AD)', 'Skor kepercayaan 0–255 terhadap sumber rute; terkecil menang saat dua sumber menawarkan tujuan sama.'],
        ['Floating static route', 'Static route dengan AD tinggi (mis. 120) yang menjadi cadangan otomatis untuk rute dynamic.'],
      ],
      diagram: `<pre>DUEL AD — siapa dipercaya?

 Tujuan: 192.168.50.0/24

   Static (manual) ──AD 1──┐
                           ├─▶ PEMENANG: static (1 < 110)
   OSPF (tetangga) ─AD 110─┘    OSPF siaga sebagai cadangan

 Dibalik (floating): static AD 120 ──▶ kalah dari OSPF 110
   → OSPF aktif, static "mengambang" menunggu OSPF gagal.</pre>`,
      scenario: 'Kantor punya link utama OSPF dan link backup VSAT mahal. Dengan floating static route (AD 130) via VSAT, traffic normal lewat OSPF; saat OSPF down, static otomatis mengambil alih — tanpa intervensi manusia. Failover link yang elegan dan murah.',
      bestPractices: 'Hafalkan AD 0/1/90/110/120. Saat mendesain backup link, gunakan floating static dengan AD di atas protokol utamamu — bukan AD default 1 yang justru menindihnya.',
      security: 'Attacker yang bisa menyuntik static route (AD 1) dapat menimpa rute OSPF yang sah. Batasi akses konfigurasi router dan audit baris S secara berkala.',
      challenge: 'Rancang: link utama OSPF (AD 110), backup static via 4G. Tulis perintah floating static-nya + jelaskan apa yang terjadi saat (a) normal, (b) OSPF down, (c) OSPF pulih kembali.',
      interviewQ: 'Q: "Apa beda AD dan metric?" — A: AD (0–255) memilih SUMBER rute yang dipercaya saat dua protokol menawarkan tujuan sama (static AD 1 vs OSPF 110 → static menang). Metric memilih JALUR terbaik di dalam satu protokol yang sama (mis. dua path OSPF — cost terkecil menang).',
      quiz: [
        {
          q: 'Router menerima rute ke 10.0.0.0/8 dari static (AD 1) dan OSPF (AD 110). Mana yang masuk routing table?',
          options: [
            'OSPF, karena dynamic lebih pintar',
            'Static — AD 1 < 110, paling dipercaya',
            'Keduanya, load balancing',
            'Tidak ada, konflik',
          ],
          answer: 1,
          explain: 'AD terkecil menang antar-sumber berbeda. Static AD 1 mengalahkan OSPF AD 110.',
        },
        {
          q: 'Apa itu floating static route?',
          options: [
            'Static route yang berpindah-pindah sendiri',
            'Static route dengan AD manual tinggi (mis. 120) sehingga menjadi cadangan otomatis saat rute dynamic gagal',
            'Static route via interface wireless',
            'Static route yang tidak tersimpan',
          ],
          answer: 1,
          explain: 'AD tinggi membuat static kalah dari protokol utama → "mengambang" sebagai backup otomatis.',
        },
        {
          q: 'Urutan evaluasi router saat memilih rute adalah…',
          options: [
            'Metric dulu, baru AD',
            'AD dulu (pilih sumber terpercaya), baru metric (pilih jalur termurah dalam sumber itu)',
            'Dipilih acak',
            'Yang dikonfigurasi terakhir menang',
          ],
          answer: 1,
          explain: 'AD = antar-sumber; metric = intra-sumber. AD dievaluasi lebih dulu.',
        },
      ],
    },
    {
      id: '11.7',
      title: 'Metric',
      body: `
<p><b>Metric</b> adalah nilai <b>"ongkos"</b> sebuah jalur <b>di dalam satu protokol routing yang sama</b>. Setelah AD memilih sumber terpercaya (11.6), metric memilih <b>jalur termurah</b> di antara rute-rute dari sumber itu.</p>
<h3>Metric per Protokol (Masing-Masing Punya "Mata Uang")</h3>
<div class="tblwrap"><table>
<tr><th>Protokol</th><th>Metric</th><th>Artinya</th></tr>
<tr><td>Static</td><td>0 (default)</td><td>Rute manual dianggap tanpa ongkos</td></tr>
<tr><td>RIP</td><td>Hop count</td><td>Jumlah router yang dilewati (maks 15)</td></tr>
<tr><td>OSPF</td><td>Cost</td><td>Dihitung dari bandwidth (10^8 / BW) — lihat 12.8</td></tr>
<tr><td>EIGRP</td><td>Composite</td><td>Kombinasi bandwidth + delay</td></tr>
</table></div>
<p><b>Penting:</b> metric <b>tidak bisa dibandingkan antar protokol</b> — cost OSPF 20 vs hop RIP 3 adalah "apel vs jeruk". Itulah gunanya AD: wasit antar-protokol.</p>
<h3>Contoh: Dua Jalur OSPF</h3>
<pre>R1 ke 192.168.60.0/24 via OSPF, dua path:
  Path A: via Gi0/1 (1 Gbps)   → cost 1
  Path B: via Gi0/2 (100 Mbps) → cost 10
→ Pemenang: Path A (cost terkecil).

O    192.168.60.0/24 [110/2] via 192.168.99.253, Gi0/1
                        ^^^
                   metric = 2 (total cost path A)</pre>
<div class="callout blue"><div class="t">Ringkasan Tiga Wasit Routing</div><p style="margin:4px 0 0">1. <b>Longest prefix match</b> — prefix terpanjang menang (11.2). 2. <b>AD</b> — sumber terpercaya menang (11.6). 3. <b>Metric</b> — jalur termurah dalam satu sumber menang (sub-bab ini). Tiga lapis ini menjawab <i>setiap</i> pertanyaan "mengapa router memilih jalur ini?".</p></div>`,
      terms: [
        ['Metric', 'Nilai ongkos jalur dalam satu protokol routing; terkecil menang (hop, cost, dsb).'],
        ['Hop count', 'Metric RIP: jumlah router yang dilewati; maksimal 15 (16 = unreachable).'],
        ['Cost (OSPF)', 'Metric OSPF berbasis bandwidth: 10^8 / bandwidth bps.'],
      ],
      diagram: `<pre>METRIC — wasit di dalam satu protokol

  Sumber sudah menang via AD (mis. OSPF AD 110).
  Kini: dua path OSPF ke tujuan yang sama:

   Path A (1 Gbps):  cost 1 ──┐
                               ├─▶ menang: cost terkecil
   Path B (100 Mbps): cost 10 ─┘

  ⚠️ cost OSPF 1 vs hop RIP 3 TIDAK bisa dibandingkan langsung —
     beda "mata uang". AD yang menjadi wasit antar-protokol.</pre>`,
      scenario: 'Dua link ke kantor cabang: fiber 1 Gbps dan radio 100 Mbps. OSPF otomatis memilih fiber (cost kecil). Saat fiber putus, OSPF beralih ke radio tanpa konfigurasi — metric-lah yang membuat keputusan adaptif ini. Inilah keunggulan dynamic routing atas static.',
      bestPractices: 'Biarkan metric dihitung otomatis dari bandwidth aktual. Pastikan bandwidth interface dikonfigurasi sesuai kapasitas nyata (terutama link serial/virtual) agar cost tidak menipu.',
      security: 'Metric bisa dimanipulasi lewat konfigurasi (cost manual) untuk mengalihkan traffic — batasi siapa yang bisa mengubah parameter interface routing.',
      challenge: 'Hitung cost OSPF untuk link: 10 Mbps, 100 Mbps, 1 Gbps, 10 Gbps memakai rumus 10^8/BW. Lalu tentukan path mana yang dipilih untuk topologi 3 router dengan dua rute berbeda.',
      interviewQ: 'Q: "Jelaskan hubungan longest prefix match, AD, dan metric." — A: Tiga lapis seleksi: (1) longest prefix match — rute paling spesifik menang; (2) AD — bila sumber berbeda, yang paling dipercaya menang; (3) metric — bila sumber sama, jalur termurah (cost/hop terkecil) menang.',
      quiz: [
        {
          q: 'Apa fungsi metric dalam routing?',
          options: [
            'Memilih sumber rute terpercaya',
            'Memilih jalur termurah di antara rute-rute dari SATU protokol/sumber yang sama',
            'Menghitung jumlah VLAN',
            'Mengukur kecepatan kabel fisik',
          ],
          answer: 1,
          explain: 'Metric = wasit intra-protokol; AD = wasit antar-protokol. Keduanya bekerja berlapis.',
        },
        {
          q: 'Mengapa metric OSPF (cost) tidak bisa dibandingkan langsung dengan metric RIP (hop)?',
          options: [
            'Karena OSPF lebih baru',
            'Karena keduanya memakai "mata uang" berbeda (bandwidth vs jumlah hop) — perbandingan antar-protokol memakai AD',
            'Karena RIP tidak punya metric',
            'Bisa dibandingkan, tidak ada masalah',
          ],
          answer: 1,
          explain: 'Apel vs jeruk: cost berbasis bandwidth, hop berbasis jumlah router. AD menyelesaikan duel antar-protokol.',
        },
        {
          q: 'Dua path OSPF ke tujuan sama: cost 5 dan cost 25. Mana yang dipilih?',
          options: [
            'Cost 25 karena lebih besar',
            'Cost 5 — metric terkecil menang',
            'Keduanya bergantian selalu',
            'Dipilih acak',
          ],
          answer: 1,
          explain: 'Dalam satu protokol, jalur dengan metric (cost) terkecil selalu dipilih.',
        },
      ],
    },
    {
      id: '11.8',
      title: 'Next Hop',
      body: `
<p><b>Next hop</b> adalah <b>IP router tetangga terdekat</b> yang akan menerima packet berikutnya. Hampir setiap baris routing table (kecuali connected) menunjuk ke sebuah next hop — "titipkan ke dia, dia tahu kelanjutannya".</p>
<h3>Dua Cara Menulis Rute: Next-Hop vs Interface</h3>
<div class="tblwrap"><table>
<tr><th>Penulisan</th><th>Contoh</th><th>Kapan Dipakai</th></tr>
<tr><td>Next-hop IP</td><td><code>ip route 192.168.50.0 255.255.255.0 192.168.99.2</code></td><td>Umum (multi-access: Ethernet); hemat ARP</td></tr>
<tr><td>Interface keluar</td><td><code>ip route 192.168.50.0 255.255.255.0 Gi0/1</code></td><td>Point-to-point (serial/PPPoE); next-hop dinamis</td></tr>
</table></div>
<h3>Syarat Mutlak: Next Hop Harus Terjangkau</h3>
<p>Router <b>menolak</b> memasukkan rute yang next-hop-nya tidak bisa dicapai (tidak ada rute connected/static menuju IP itu). Ini disebut <b>recursive lookup</b> (11.9): router mengecek "bagaimana cara mencapai next-hop itu sendiri?"</p>
<pre>R1# show ip route 192.168.99.2
Routing entry for 192.168.99.0/24
  Known via "connected", distance 0, metric 0
  * directly connected, via GigabitEthernet0/1
! ✔ Next-hop .99.2 terjangkau via connected → rute static VALID.

! Jika output "not in table" → next-hop unreachable → rute DITOLAK.</pre>
<div class="callout"><div class="t">Next Hop Harus Tetangga Langsung?</div><p style="margin:4px 0 0"><b>Tidak harus!</b> Next hop bisa beberapa hop jauhnya — router akan melakukan recursive lookup berulang hingga menemukan interface keluar fisik. Tetapi praktik terbaik: next hop = tetangga langsung (lebih mudah dibaca & di-troubleshoot).</p></div>`,
      terms: [
        ['Next hop', 'IP router tetangga berikutnya yang dititipi packet; inti hampir setiap baris routing table.'],
      ],
      diagram: `<pre>NEXT HOP — "titipkan ke dia"

  R1 ──(192.168.99.0/24)── R2 ──(192.168.88.0/24)── R3 ── LAN tujuan

  Di R1: S 192.168.60.0/24 via 192.168.99.2
                                    ▲
                              next hop = R2
              "R1 tidak perlu tahu jalan lengkap —
               cukup titip ke R2, R2 yang meneruskan."

  Syarat: R1 harus tahu cara mencapai 192.168.99.2 (connected ✔).</pre>`,
      scenario: 'Engineer mengetik static route dengan next-hop IP router di kota lain (bukan tetangga). Rute tidak muncul di tabel — next-hop unreachable. Setelah diganti ke IP tetangga langsung, rute valid. Pelajaran: next-hop yang "benar secara logika" belum tentu "terjangkau secara routing".',
      bestPractices: 'Gunakan next-hop IP tetangga langsung untuk link Ethernet; gunakan interface keluar untuk link point-to-point. Selalu verifikasi keterjangkauan next-hop setelah membuat static route.',
      security: 'Next-hop palsu = traffic hijacking. Static route menunjuk ke IP attacker akan membelokkan seluruh traffic tujuan itu — audit baris S berkala.',
      challenge: 'Buat static route dengan next-hop 2 hop jauhnya (R1 → via R2 → R3 → tujuan). Verifikasi dengan show ip route dan traceroute bahwa recursive lookup bekerja. Kapan ini berguna vs berbahaya?',
      interviewQ: 'Q: "Apa syarat sebuah next-hop agar rute valid?" — A: Next-hop harus terjangkau (reachable) — ada rute connected atau rute lain menuju IP next-hop itu. Jika tidak (recursive lookup gagal), router menolak memasukkan rute ke tabel.',
      quiz: [
        {
          q: 'Apa itu next hop?',
          options: [
            'Router terakhir sebelum tujuan',
            'IP router tetangga berikutnya yang dititipi packet menuju destination',
            'Nama interface router',
            'IP destination akhir',
          ],
          answer: 1,
          explain: 'Next hop = "lompatan berikutnya"; router hanya perlu tahu tetangga terdekat, bukan seluruh jalur.',
        },
        {
          q: 'Static route dengan next-hop yang tidak terjangkau akan…',
          options: [
            'Tetap aktif sebagai cadangan',
            'Ditolak masuk routing table (invalid) karena recursive lookup gagal',
            'Otomatis diperbaiki router',
            'Menjadi default route',
          ],
          answer: 1,
          explain: 'Router memverifikasi keterjangkauan next-hop; tak terjangkau = rute tidak valid.',
        },
        {
          q: 'Kapan penulisan static route via interface keluar (bukan next-hop IP) lebih tepat?',
          options: [
            'Di link Ethernet biasa',
            'Di link point-to-point (serial/PPPoE) di mana next-hop IP dinamis/tidak pasti',
            'Tidak pernah tepat',
            'Hanya di lab',
          ],
          answer: 1,
          explain: 'Point-to-point: cukup "lempar keluar interface ini" tanpa perlu tahu IP tetangga yang bisa berubah.',
        },
      ],
    },
    {
      id: '11.9',
      title: 'Recursive Routing',
      body: `
<p><b>Recursive routing</b> (recursive lookup) adalah proses router <b>mencari berulang</b> hingga menemukan <b>interface fisik keluar</b>: "untuk ke next-hop A, lewat mana? → untuk ke next-hop B, lewat mana? → ... → ketemu interface Gi0/1".</p>
<h3>Contoh Lookup Berlapis</h3>
<pre>Tabel R1:
S  192.168.60.0/24 [1/0] via 192.168.88.2      ← next-hop bukan tetangga!
S  192.168.88.0/24 [1/0] via 192.168.99.2
C  192.168.99.0/24 is directly connected, Gi0/1

Packet ke 192.168.60.9:
 1. Cocok S → via 192.168.88.2. "Bagaimana ke .88.2?"
 2. Cocok S → via 192.168.99.2. "Bagaimana ke .99.2?"
 3. Cocok C → keluar Gi0/1 ✔ BERHENTI (ketemu interface fisik)
Hasil akhir: kirim ke 192.168.88.2 via Gi0/1 (MAC tetangga .99.2).</pre>
<h3>Bahaya: Routing Loop via Rekursi</h3>
<p>Jika rantai next-hop <b>melinkar</b> (R1 menunjuk R2, R2 menunjuk R1 untuk tujuan yang sama), packet berputar hingga <b>TTL habis</b> (11.1). Gejalanya di traceroute: <b>IP yang sama berulang</b> lalu "TTL expired". Inilah alasan TTL ada — pengaman terakhir loop Layer 3.</p>
<pre>! Traceroute menunjukkan loop:
 1  192.168.99.2
 2  192.168.99.1
 3  192.168.99.2
 4  192.168.99.1
... (berulang hingga TTL habis) → routing loop confirmed!</pre>
<div class="callout blue"><div class="t">Rekursi vs Kinerja</div><p style="margin:4px 0 0">Lookup berlapis terjadi <b>sekali</b> saat rute dipasang (control plane), hasilnya di-cache (CEF/FIB) untuk forwarding cepat (data plane). Jadi rekursi tidak memperlambat tiap packet — tetapi rantai yang dalam membuat tabel sulit dibaca manusia. Praktik terbaik: next-hop tetangga langsung.</p></div>`,
      terms: [
        ['Recursive lookup', 'Pencarian berulang next-hop hingga menemukan interface fisik keluar.'],
        ['Routing loop', 'Rantai next-hop melingkar; packet berputar hingga TTL habis; terdeteksi via traceroute berulang.'],
        ['CEF/FIB', 'Cisco Express Forwarding / Forwarding Information Base — cache hasil lookup untuk forwarding hardware yang cepat.'],
      ],
      diagram: `<pre>RECURSIVE LOOKUP — bertanya berulang hingga ketemu pintu

  "Ke 192.168.60.9 lewat mana?"
       │ via 192.168.88.2
       ▼ "Ke .88.2 lewat mana?"
       │ via 192.168.99.2
       ▼ "Ke .99.2 lewat mana?"
       │ directly connected, Gi0/1 ✔ BERHENTI
       ▼
  Kirim ke .88.2 keluar Gi0/1 (titip via tetangga .99.2)

  ⚠️ Rantai melingkar (R1↔R2 saling tunjuk) = routing loop → TTL habis.</pre>`,
      scenario: 'NOC melihat traceroute ke cabang berputar antara dua IP yang sama. Ternyata dua engineer membuat static route di dua router yang saling menunjuk ("kamu yang tahu jalan") — loop klasik. Perbaikan: satu sisi dihapus, diganti next-hop yang benar. Traceroute adalah "X-ray" untuk kasus seperti ini.',
      bestPractices: 'Hindari rantai next-hop lebih dari 1 lapis bila memungkinkan. Setiap static route: pastikan next-hop = tetangga langsung yang terjangkau.',
      security: 'Routing loop bisa dipakai untuk DoS (packet berputar menghabiskan bandwidth/TTL). Desain next-hop yang bersih + TTL adalah pertahanan alaminya.',
      challenge: 'Sengaja buat routing loop 2 router di lab (saling menunjuk). Jalankan traceroute, amati pola berulangnya, hitung berapa hop hingga TTL habis. Lalu perbaiki dan tulis laporannya.',
      interviewQ: 'Q: "Apa itu recursive lookup dan apa bahayanya?" — A: Router mencari next-hop berulang hingga menemukan interface fisik. Bahayanya: rantai next-hop yang melingkar menciptakan routing loop — packet berputar hingga TTL habis, terdeteksi dari traceroute yang menampilkan IP sama berulang-ulang.',
      quiz: [
        {
          q: 'Apa itu recursive lookup?',
          options: [
            'Router me-reboot untuk mencari rute',
            'Pencarian next-hop berulang hingga ditemukan interface fisik keluar',
            'Protokol routing baru',
            'Cara menghapus rute lama',
          ],
          answer: 1,
          explain: 'Tiap next-hop dicek keterjangkauannya berlapis sampai mentok di connected route / interface fisik.',
        },
        {
          q: 'Traceroute menampilkan 192.168.99.1 dan .99.2 bergantian berulang-ulang. Artinya…',
          options: [
            'Jaringan normal',
            'Routing loop — dua router saling menunjuk sebagai next-hop untuk tujuan yang sama',
            'Traceroute rusak',
            'Kabel putus',
          ],
          answer: 1,
          explain: 'Pola IP berulang = packet berputar; klasik rantai next-hop melingkar hingga TTL habis.',
        },
        {
          q: 'Apa yang menghentikan packet dalam routing loop agar tidak berputar selamanya?',
          options: [
            'Switch memblokirnya',
            'TTL (Time To Live) — dikurangi tiap hop, packet dibuang saat mencapai 0',
            'Firewall otomatis',
            'Tidak ada, berputar selamanya',
          ],
          answer: 1,
          explain: 'TTL adalah pengaman loop Layer 3 (berbeda dengan Ethernet yang tidak punya TTL — 10.1).',
        },
      ],
    },
    {
      id: '11.10',
      title: 'Routing Troubleshooting',
      body: `
<p>Troubleshooting routing mengikuti <b>alur packet</b>: dari sumber, hop demi hop, hingga tujuan. Senjata utama: <code>ping</code>, <code>traceroute</code>, dan <code>show ip route</code>.</p>
<h3>Metodologi 6 Langkah</h3>
<ol>
<li><b>Cek IP & gateway sumber:</b> <code>ipconfig</code> — IP benar? Gateway = .1 subnetnya? (80% masalah "routing" ternyata di sini.)</li>
<li><b>Ping gateway sendiri:</b> gagal → masalah lokal (kabel/VLAN/interface), bukan routing jauh.</li>
<li><b>Ping next-hop bertahap:</b> ping tiap hop menjauhi sumber — hop terakhir yang merespons = batas masalah.</li>
<li><b>Traceroute ke tujuan:</b> lihat di hop mana berhenti/berputar.</li>
<li><b>Cek routing table tiap router tersangka:</b> <code>show ip route &lt;tujuan&gt;</code> — ada rute? Next-hop terjangkau? AD/metric wajar?</li>
<li><b>Cek rute balik:</b> dari sisi tujuan, apakah ada rute pulang ke sumber? (klasik 11.4!)</li>
</ol>
<h3>Tabel Gejala → Penyebab → Perintah</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Penyebab Umum</th><th>Perintah Kunci</th></tr>
<tr><td>Ping gateway RTO</td><td>IP/gateway salah; VLAN/interface down</td><td>ipconfig; show ip interface brief</td></tr>
<tr><td>Ping berhenti di hop N</td><td>Router hop N tidak punya rute ke tujuan</td><td>show ip route &lt;tujuan&gt; di hop N</td></tr>
<tr><td>Traceroute berputar</td><td>Routing loop</td><td>show ip route (cari rantai melingkar)</td></tr>
<tr><td>Satu arah OK, balik gagal</td><td>Rute balik belum ada</td><td>show ip route &lt;subnet sumber&gt; di sisi tujuan</td></tr>
<tr><td>Tiba-tiba mati setelah change</td><td>Static menimpa dynamic (AD); interface down</td><td>show ip route; show logging</td></tr>
<tr><td>Bisa IP, gagal hostname</td><td>Bukan routing — masalah DNS!</td><td>nslookup (jangan tuduh routing)</td></tr>
</table></div>
<h3>Contoh Sesi Lengkap</h3>
<pre>Kasus: PC-A (192.168.20.50) tidak bisa ping server (192.168.30.10).

1. ipconfig PC-A → IP .20.50, gateway .20.1 ✔
2. ping 192.168.20.1 → OK ✔ (lokal sehat)
3. ping 192.168.30.1 (gateway server) → RTO ✗ (masalah di/antar router)
4. traceroute 192.168.30.10 → berhenti di R1 (hop 1) ✗
5. R1# show ip route 192.168.30.10 → "% Network not in table" !!
   → R1 TIDAK PUNYA rute ke 192.168.30.0/24. Akar ketemu.
6. R1# show ip interface brief → Gi0/0.30 down/down !!
   → subinterface ke VLAN 30 mati (kabel trunk/SFP).
7. Fix: perbaiki fisik → Gi0/0.30 up → connected route muncul otomatis.
8. Final: ping PC-A → server ✔ + traceroute 2 hop ✔ → tutup tiket.

Pelajaran: "masalah routing" ternyata masalah fisik (langkah 1-2
mengeliminasi tebakan liar sejak awal).</pre>
<div class="callout"><div class="t">Aturan Emas Troubleshooting Routing</div><p style="margin:4px 0 0">"Ikuti packet-nya." Jangan menebak — uji tiap hop berurutan dari sumber. Hop terakhir yang menjawab adalah saksi bisu di mana masalah bersembunyi.</p></div>`,
      terms: [
        ['Traceroute', 'Tool melacak hop demi hop jalur packet ke tujuan; mendeteksi hop macet & routing loop.'],
      ],
      diagram: `<pre>ALUR TROUBLESHOOTING ROUTING — ikuti packet-nya

 [PC] ─(1)ipconfig─▶ (2)ping gateway ─▶ (3)ping per hop ─▶ (4)traceroute
   │                     │                    │                   │
   ✗=sumber salah     ✗=lokal rusak      hop terakhir OK     berhenti/
   ✔=lanjut          ✔=lanjut           = batas masalah      berputar?

 (5) show ip route &lt;tujuan&gt; di router tersangka → rute ada? next-hop OK?
 (6) show ip route &lt;subnet sumber&gt; di sisi tujuan → rute BALIK ada?</pre>`,
      scenario: 'Tiket: "server tidak bisa diakses dari cabang". Tiga engineer menebak firewall, ISP, dan server down. Engineer keempat mengikuti 6 langkah: traceroute berhenti di router cabang → show ip route kosong untuk subnet server → ternyata static route terhapus saat maintenance. Total diagnosis: 10 menit. Metodologi mengalahkan tebakan — lagi.',
      bestPractices: 'Selalu mulai dari sumber dan bergerak hop demi hop. Dokumentasikan output tiap langkah di tiket — ini juga bukti kerja profesionalmu.',
      security: 'Traceroute/ping bisa diblokir firewall — "RTO" belum tentu "down". Bedakan "host tidak menjawab" vs "network tidak punya rute" dengan show ip route di router.',
      challenge: 'Suntikkan 3 fault routing ke lab (rute hilang, loop, gateway salah). Untuk tiap fault: tulis gejala, langkah 1–6 yang membuktikan, dan fix-nya. Kumpulkan sebagai portofolio troubleshooting.',
      interviewQ: 'Q: "PC tidak bisa ping server beda subnet. Langkahmu?" — A: (1) ipconfig — IP & gateway benar? (2) ping gateway sendiri; (3) ping bertahap per hop; (4) traceroute — berhenti/berputar di mana; (5) show ip route tujuan di router tersangka; (6) pastikan rute balik ada di sisi tujuan.',
      quiz: [
        {
          q: 'Langkah pertama troubleshooting masalah routing adalah…',
          options: [
            'Restart router',
            'Cek IP & default gateway di sumber (ipconfig) — sebagian besar "masalah routing" ternyata di sini',
            'Hubungi ISP',
            'Ganti kabel',
          ],
          answer: 1,
          explain: 'Mulai dari sumber: IP/gateway salah membuat semua diagnosis lanjutan sia-sia.',
        },
        {
          q: 'Traceroute berhenti di hop ke-2 (tidak ada respons setelahnya). Artinya…',
          options: [
            'Tujuan sudah tercapai',
            'Router hop ke-2 (atau setelahnya) tidak punya rute ke tujuan / packet diblokir di sana',
            'Kabel PC putus',
            'Traceroute tidak bisa dipakai',
          ],
          answer: 1,
          explain: 'Hop terakhir yang merespons = batas masalah; investigasi routing table dimulai dari sana.',
        },
        {
          q: 'Ping ke IP berhasil tetapi ping ke hostname gagal. Kesimpulan?',
          options: [
            'Routing rusak',
            'Bukan masalah routing — ini masalah DNS (name resolution)',
            'Gateway salah',
            'Kabel putus sebagian',
          ],
          answer: 1,
          explain: 'IP jalan = routing OK; hostname gagal = DNS. Jangan tuduh routing untuk masalah DNS.',
        },
      ],
    },
  ],
};
