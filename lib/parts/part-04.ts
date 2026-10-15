// Part 04 — IPv4 Addressing.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
import type { Part } from './types';

export const part04: Part = {
  id: '04',
  number: 'PART 04',
  title: 'IPv4 Addressing',
  phaseId: 'fase-1',
  description: 'Anatomi IPv4, subnet mask, CIDR, subnetting, VLSM, dan perencanaan IP address.',
  repoFolder: 'part-04-ipv4-addressing',
  objectives: [
    'Menjelaskan struktur IPv4: network address, host address, broadcast, gateway, dan alamat spesial.',
    'Membedakan public vs private IP, loopback, dan APIPA serta kapan masing-masing muncul.',
    'Membaca subnet mask dan notasi CIDR serta menentukan network/host dari sebuah alamat.',
    'Melakukan subnetting dan VLSM dengan metode yang sistematis dan terverifikasi.',
    'Menyusun IP address plan profesional dan mendiagnosis masalah pengalamatan IP.',
  ],
  prerequisites: 'Part 03 — Ethernet & Networking Fundamentals (ARP, unicast/broadcast, tool dasar). Part 02 — packet journey & peran IP di Layer 3.',
  subbabs: [
    {
      id: '4.1',
      title: 'Apa Itu IPv4?',
      body: `<p><b>IPv4</b> (<i>Internet Protocol version 4</i>) adalah versi protokol IP yang menjalankan <b>hampir seluruh internet dan jaringan enterprise saat ini</b> — alamat 32-bit yang ditulis desimal bertitik, seperti <code>192.168.20.50</code>. Ia bekerja di <b>Layer 3</b> dan menjadi "bahasa alamat" yang dipakai router.</p>
<h3>Anatomi 32 Bit</h3>
<pre>192 . 168 . 20  . 50
 └┬─┘   └┬─┘  └┬─┘  └┬─┘
  8 bit  8 bit 8 bit 8 bit  = 32 bit total
  (oktet) (oktet)(oktet)(oktet)

11000000.10101000.00010100.00110010  ← bentuk biner sebenarnya
   192  .   168   .   20   .   50    ← bentuk desimal (untuk manusia)</pre>
<p>Total kombinasi: 2<sup>32</sup> ≈ <b>4,3 miliar alamat</b> — terdengar banyak, tapi sudah habis dialokasikan secara global (itulah alasan lahirnya IPv6, Part 05).</p>
<h3>Dua Bagian: Network + Host</h3>
<p>Setiap alamat IPv4 selalu terbagi dua oleh <b>subnet mask</b>:</p>
<ul>
<li><b>Network portion:</b> "kota"-nya — network mana alamat ini berada (mis. <code>192.168.20</code>).</li>
<li><b>Host portion:</b> "nomor rumah"-nya — device ke-berapa di network itu (mis. <code>.50</code>).</li>
<li>Device <b>satu network</b> = bisa bicara langsung (via switch/MAC). <b>Beda network</b> = wajib lewat router/gateway (pelajaran Part 02).</li>
</ul>
<div class="callout blue"><div class="t">IPv4 + Mask = Satu Kesatuan</div><p style="margin:4px 0 0">Menulis <code>192.168.20.50</code> <b>tanpa mask</b> (/24 atau 255.255.255.0) adalah informasi yang tidak lengkap — seperti alamat tanpa kode pos. Engineer profesional selalu menyebut pasangannya: <code>192.168.20.50/24</code>. Biasakan dari sekarang.</p></div>`,
      terms: [
        ['IPv4', 'Internet Protocol v4 — alamat logis 32-bit Layer 3 (4 oktet desimal).'],
        ['Oktet', 'Kelompok 8 bit; IPv4 = 4 oktet, tiap bernilai 0–255.'],
        ['Network portion', 'Bagian alamat yang menunjukkan network (ditentukan subnet mask).'],
        ['Host portion', 'Bagian alamat yang menunjukkan device di dalam network.'],
      ],
      diagram: `<pre>         ANATOMI IPv4 192.168.20.50/24

   ┌─ network portion ─┐ ┌host┐
         192.168.20    .   50
         "kota"            "nomor rumah"

   Satu network (/24) → bicara langsung via switch
   Beda network       → wajib lewat router/gateway</pre>`,
      scenario: 'Dokumen desain menulis "server di 192.168.30.10" tanpa mask. Dua engineer menafsirkan beda: /24 (VLAN 30) vs /16 (seluruh 192.168.x.x) — berujung firewall rule yang salah sasaran. Satu garis miring (/24) yang hilang menyebabkan 2 jam troubleshooting. Detail kecil, dampak besar.',
      bestPractices: 'Selalu tulis IP lengkap dengan mask/CIDR. Dalam dokumentasi, tabel IP plan wajib punya kolom "Subnet" — bukan cuma "IP".',
      security: 'Salah tafsir mask = salah tafsir "siapa tetanggaku". Firewall rule <code>allow 192.168.20.0/24</code> vs <code>/16</code> adalah perbedaan antara membuka 254 host vs 65.534 host — kesalahan yang dieksploitasi penyerang.',
      challenge: 'Ubah 192.168.20.50 ke biner per oktet (tanpa kalkulator dulu, lalu cek). Berapa total bit "1"-nya?',
      interviewQ: 'Q: "Apa itu IPv4 dan mengapa selalu disebut bersama subnet mask?" — A: IPv4 adalah alamat logis 32-bit Layer 3 (4 oktet). Ia tidak lengkap tanpa mask karena mask-lah yang membagi mana network portion dan mana host portion — tanpa itu tidak bisa ditentukan siapa "tetangga satu network".',
      quiz: [
        { q: 'IPv4 terdiri dari…', options: ['32 bit = 4 oktet', '48 bit = 6 oktet', '128 bit = 8 grup', '16 bit = 2 oktet'], answer: 0, explain: 'IPv4 = 32 bit, ditulis 4 oktet desimal (0–255 tiap oktet).' },
        { q: 'Dua device bisa bicara langsung (tanpa router) jika…', options: ['MAC-nya sama', 'Berada di network yang sama (network portion sama)', 'Port-nya sama', 'Kabelnya sama panjang'], answer: 1, explain: 'Satu network = satu broadcast domain = komunikasi langsung via L2.' },
        { q: 'Menulis IP tanpa subnet mask bermasalah karena…', options: ['Terlalu pendek', 'Tidak bisa ditentukan mana network vs host portion', 'Tidak valid', 'Hanya untuk IPv6'], answer: 1, explain: 'Mask adalah pembaginya; tanpa mask, "tetangga" tidak terdefinisi.' },
      ],
    },
    {
      id: '4.2',
      title: 'Network Address',
      body: `<p><b>Network address</b> adalah alamat yang <b>mengidentifikasi sebuah network itu sendiri</b> — bukan device. Cirinya: <b>semua bit host = 0</b>. Contoh: untuk <code>192.168.20.50/24</code>, network address-nya <code>192.168.20.0</code>.</p>
<h3>Cara Menentukan</h3>
<pre>IP   : 192.168.20.50  →  11000000.10101000.00010100.00110010
Mask : 255.255.255.0   →  11111111.11111111.11111111.00000000 (/24)
AND  : ─────────────────────────────────────────────────
Net  : 192.168.20.0    →  11000000.10101000.00010100.00000000
                                                     └┬──────┘
                                                   host = 0 semua</pre>
<p>Operasi <b>AND</b>: bit IP dibandingkan bit mask — hanya 1 AND 1 = 1. Bagian host (8 bit terakhir) menjadi 0 semua. <b>Alasan memakai AND:</b> inilah cara device menentukan "apakah tujuan satu network denganku" — ia meng-AND-kan IP tujuan dengan mask-nya sendiri, lalu membandingkan hasilnya dengan network-nya sendiri.</p>
<h3>Aturan Keras</h3>
<ul>
<li><b>Network address TIDAK BOLEH dipasang ke device.</b> Ia adalah "nama jalan", bukan "nomor rumah" — memasangnya ke PC = PC tidak bisa komunikasi normal.</li>
<li>Dalam routing table & firewall rule, network ditulis dalam format <b>network/mask</b>: <code>192.168.20.0/24</code> ("seluruh VLAN 20").</li>
</ul>
<div class="callout"><div class="t">Kesalahan Klasik Pemula</div><p style="margin:4px 0 0">Men-set IP PC ke <code>192.168.20.0</code> (network address) lalu heran kenapa tidak bisa konek. Atau menulis rule firewall untuk <code>192.168.20.50/24</code> dengan maksud "satu PC" — padahal /24 artinya 254 host. Pahami mana alamat network vs alamat host.</p></div>`,
      terms: [
        ['Network address', 'Alamat identitas sebuah network; semua bit host = 0; tidak untuk device.'],
        ['Operasi AND', 'Perbandingan bit IP dengan mask untuk menemukan network address.'],
      ],
      scenario: 'Engineer menulis static route <code>192.168.20.50/24 via ...</code> dengan maksud me-route satu PC. Router menolak/menafsirkan aneh karena /24 butuh network address (.0). Route yang benar: <code>192.168.20.50/32</code> untuk satu host, atau <code>192.168.20.0/24</code> untuk network. Salah satu angka mengubah arti total.',
      bestPractices: 'Untuk satu host spesifik di route/firewall: pakai /32. Untuk network: pakai network address + mask yang tepat. Jangan campur.',
      security: 'Firewall rule dengan network address yang salah mask bisa membuka jauh lebih banyak host dari yang dimaksud — selalu verifikasi dengan kalkulator subnet sebelum apply.',
      challenge: 'Tentukan network address dari: (a) 10.5.23.77/16, (b) 172.16.8.200/20. Tulis operasi AND binernya untuk (b).',
      interviewQ: 'Q: "Apa itu network address dan bolehkah dipasang ke PC?" — A: Alamat identitas network (semua bit host = 0, mis. 192.168.20.0/24). Tidak boleh dipasang ke device — ia nama network-nya, bukan alamat host. Dipakai di routing table dan firewall rule untuk merujuk seluruh network.',
      quiz: [
        { q: 'Network address dari 192.168.20.50/24 adalah…', options: ['192.168.20.50', '192.168.20.0', '192.168.20.255', '192.168.0.0'], answer: 1, explain: 'Bit host (oktet terakhir, /24) = 0 semua → 192.168.20.0.' },
        { q: 'Cara device menentukan network address adalah…', options: ['Menebak', 'Operasi AND antara IP dan subnet mask', ' bertanya ke DNS', 'Melihat MAC'], answer: 1, explain: 'IP AND mask = network address; dasar penentuan "satu network atau tidak".' },
        { q: 'Memasang 192.168.20.0 ke PC berakibat…', options: ['Normal saja', 'PC tidak bisa komunikasi normal — itu network address, bukan host', 'Internet lebih cepat', 'Mendapat IP ganda'], answer: 1, explain: 'Network address bukan alamat host yang valid untuk device.' },
      ],
    },
    {
      id: '4.3',
      title: 'Host Address',
      body: `<p><b>Host address</b> adalah alamat IPv4 yang <b>boleh dipasang ke device</b> (host): PC, server, printer, interface router. Cirinya: <b>bukan</b> network address (semua host bit 0) dan <b>bukan</b> broadcast address (semua host bit 1).</p>
<h3>Rentang Host yang Valid</h3>
<pre>Network 192.168.20.0/24:
  192.168.20.0     ← network address (JANGAN dipakai)
  192.168.20.1     ← host pertama → konvensi: GATEWAY
  192.168.20.2
  ...
  192.168.20.254   ← host terakhir
  192.168.20.255   ← broadcast address (JANGAN dipakai)

  Total: 2^8 = 256 alamat − 2 = 254 host usable</pre>
<h3>Rumus Jumlah Host</h3>
<p><b>2<sup>h</sup> − 2</b>, di mana h = jumlah bit host. /24 → h=8 → 254 host. /26 → h=6 → 62 host. <b>Mengapa minus 2?</b> Satu untuk network address, satu untuk broadcast — keduanya "dipesan" dan tidak bisa dipakai device.</p>
<h3>Konvensi Penomoran (Desain Kurikulum)</h3>
<div class="tblwrap"><table>
<tr><th>Alamat</th><th>Peruntukan (konvensi)</th><th>Contoh VLAN 20</th></tr>
<tr><td>.1</td><td><b>Default gateway</b> (interface router)</td><td>192.168.20.1</td></tr>
<tr><td>.2 – .9</td><td>Perangkat infrastruktur (switch, AP)</td><td>192.168.20.2 (switch)</td></tr>
<tr><td>.10 – .49</td><td>Server & device statis penting</td><td>—</td></tr>
<tr><td>.50 – .99</td><td>IP statis / reservation khusus</td><td>192.168.20.50 (PC lab)</td></tr>
<tr><td>.100 – .200</td><td><b>DHCP pool</b> (dinamis)</td><td>192.168.20.100+ (user)</td></tr>
</table></div>
<p><b>Alasan konvensi:</b> gateway selalu .1 = mudah diingat & didokumentasikan; DHCP pool terpisah dari statis = tidak tabrakan. Konvensi ini dipakai konsisten di semua lab kurikulum.</p>`,
      terms: [
        ['Host address', 'Alamat IP yang valid untuk device: bukan network, bukan broadcast.'],
        ['Usable host', 'Jumlah host yang bisa dipakai = 2^h − 2.'],
        ['DHCP pool', 'Rentang IP yang dibagikan otomatis oleh DHCP server.'],
      ],
      scenario: 'Admin baru men-set printer ke 192.168.20.100 — masuk ke DHCP pool. Seminggu kemudian IP printer "direbut" laptop user (duplikat IP), printer hilang dari jaringan tiap beberapa hari. Solusi: pindahkan printer ke area statis (.10–.49) atau buat DHCP reservation. Aturan zona menyelamatkan dari misteri berulang.',
      bestPractices: 'Tetapkan dan dokumentasikan zona IP (gateway, infra, statis, DHCP pool) SEBELUM menghidupkan DHCP — dan jangan pernah memberi statis di dalam pool.',
      security: 'Zona yang jelas memudahkan firewall rule: "izinkan .10–.49 (server) ke internet, blokir DHCP pool user ke port sensitif" — kebijakan berbasis zona, bukan per-IP acak.',
      challenge: 'Untuk 192.168.10.0/24 (VLAN 10 CCTV): tulis alokasi zonamu — NVR di IP berapa? Kamera 1–8 di IP berapa? Mengapa NVR sebaiknya statis?',
      interviewQ: 'Q: "Berapa usable host untuk /26 dan mengapa dikurangi 2?" — A: h=6 bit host → 2^6−2 = 62. Dikurangi 2 karena network address (host bit semua 0) dan broadcast address (semua 1) dipesan dan tidak boleh dipasang ke device.',
      quiz: [
        { q: 'Jumlah usable host untuk subnet /26 adalah…', options: ['64', '62', '126', '254'], answer: 1, explain: '2^6 − 2 = 64 − 2 = 62 (minus network & broadcast).' },
        { q: 'Sesuai konvensi kurikulum, default gateway memakai…', options: ['Alamat .254', 'Alamat .1 di tiap subnet', 'Alamat acak', 'Alamat .100'], answer: 1, explain: '.1 = konvensi gateway; mudah diingat dan konsisten di semua VLAN.' },
        { q: 'Memberi IP statis di dalam DHCP pool berisiko…', options: ['Internet lebih lambat', 'Duplikat IP saat DHCP memberikan alamat yang sama ke device lain', 'MAC berubah', 'VLAN rusak'], answer: 1, explain: 'DHCP tidak tahu ada statis di pool-nya → bisa memberikan IP yang sama → konflik.' },
      ],
    },
    {
      id: '4.4',
      title: 'Broadcast Address',
      body: `<p><b>Broadcast address</b> adalah alamat yang berarti <b>"semua host di network ini"</b> — cirinya <b>semua bit host = 1</b>. Untuk <code>192.168.20.0/24</code>: <code>192.168.20.255</code>.</p>
<h3>Dua Jenis Broadcast IP</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Alamat</th><th>Jangkauan</th><th>Contoh</th></tr>
<tr><td><b>Directed broadcast</b></td><td>Broadcast address subnet</td><td>Semua host di <i>network itu</i></td><td>192.168.20.255</td></tr>
<tr><td><b>Limited broadcast</b></td><td>255.255.255.255</td><td>LAN lokal saja</td><td>DHCP Discover</td></tr>
</table></div>
<h3>Aturan Keras</h3>
<ul>
<li><b>JANGAN pasang broadcast address ke device</b> — sama seperti network address, ia bukan alamat host.</li>
<li><b>Router tidak meneruskan directed broadcast</b> secara default (dulu bisa → menjadi senjata <b>Smurf attack</b>: ping ke broadcast address dengan source palsu = semua host membalas ke korban). Inilah alasan broadcast dibatasi — pelajaran keamanan dari sejarah.</li>
</ul>
<h3>Mengapa Masih Ada?</h3>
<p>Beberapa protokol lama memakainya (NetBIOS, beberapa discovery). Di jaringan modern, perannya banyak digantikan <b>multicast</b> (lebih sopan: hanya yang berminat). Di IPv6, broadcast <b>dihapus total</b> (Part 05).</p>
<div class="callout blue"><div class="t">Tiga Alamat Pesanan per Subnet</div><p style="margin:4px 0 0">Setiap subnet "kehilangan" 3 alamat untuk device: <b>network</b> (nama), <b>broadcast</b> (semua), dan konvensi <b>gateway (.1)</b>. Untuk /24: 256 − 3 = 253 untuk device. Hitung ini saat capacity planning!</p></div>`,
      terms: [
        ['Broadcast address', 'Alamat "semua host di network" — semua bit host = 1; bukan untuk device.'],
        ['Directed broadcast', 'Broadcast ke satu network spesifik (mis. 192.168.20.255).'],
        ['Limited broadcast', '255.255.255.255 — hanya LAN lokal.'],
        ['Smurf attack', 'Serangan DDoS lawas via directed broadcast (sudah dimitigasi modern).'],
      ],
      scenario: 'Teknisi iseng ping 192.168.20.255 dan mendapat puluhan balasan — ia baru saja memetakan semua host hidup di VLAN itu dalam 1 detik. Tool yang sama di tangan penyerang = reconnaissance gratis. Inilah mengapa di beberapa hardening, respons terhadap directed broadcast dimatikan di host.',
      bestPractices: 'Jangan memakai directed broadcast untuk "membangunkan" banyak device — gunakan multicast atau management tool (Ansible, Part 33) yang tertarget.',
      security: 'Pastikan router tidak meneruskan directed broadcast (default modern sudah tidak) dan host tidak meresponsnya secara berlebihan — tutup pintu Smurf attack.',
      challenge: 'Tentukan broadcast address untuk: (a) 10.0.5.0/24, (b) 172.16.0.0/20. Untuk (b), tunjukkan bit host-nya.',
      interviewQ: 'Q: "Apa beda network address dan broadcast address?" — A: Keduanya alamat spesial yang tidak untuk device: network = semua bit host 0 (identitas network), broadcast = semua bit host 1 ("semua host di network itu"). Network dipakai di routing table; broadcast untuk komunikasi satu-ke-semua di subnet.',
      quiz: [
        { q: 'Broadcast address dari 192.168.20.0/24 adalah…', options: ['192.168.20.0', '192.168.20.1', '192.168.20.255', '255.255.255.255 saja'], answer: 2, explain: 'Bit host semua 1 → oktet terakhir 255.' },
        { q: 'Router modern tidak meneruskan directed broadcast terutama karena…', options: ['Hemat listrik', 'Mencegah Smurf attack / amplifikasi DDoS', 'Broadcast sudah punah', 'Aturan IEEE'], answer: 1, explain: 'Sejarah Smurf: broadcast + source spoofing = amplifikasi serangan.' },
        { q: 'Alamat 255.255.255.255 disebut…', options: ['Directed broadcast', 'Limited broadcast — hanya LAN lokal', 'Multicast', 'Loopback'], answer: 1, explain: 'Limited broadcast: tidak di-routing, hanya segmen lokal (mis. DHCP Discover).' },
      ],
    },
    {
      id: '4.5',
      title: 'Default Gateway',
      body: `<p><b>Default gateway</b> adalah <b>"pintu keluar"</b> sebuah network: alamat IP router (di network yang sama) yang dituju host <b>saat tujuan beda network</b>. Tanpa gateway yang benar, host hanya bisa bicara dengan tetangga satu LAN-nya.</p>
<h3>Cara Kerja (Kilasan Part 02)</h3>
<pre>PC 192.168.20.50/24, gateway 192.168.20.1

Tujuan 192.168.20.60  → satu network → langsung via ARP/MAC ✓
Tujuan 192.168.30.10  → beda network → kirim ke GATEWAY (.20.1)
Tujuan 8.8.8.8        → beda network → kirim ke GATEWAY (.20.1)</pre>
<p>Host memutuskan dengan meng-AND-kan IP tujuan (pelajaran 4.2). <b>Gateway harus satu network dengan host</b> — gateway 192.168.99.1 tidak bisa dipakai PC 192.168.20.50/24 karena "pintu keluar" harus bisa dijangkau langsung.</p>
<h3>Gejala Gateway Bermasalah</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Artinya</th></tr>
<tr><td>Bisa ping sesama LAN, gagal ke luar</td><td><b>Klasik gateway salah/mati</b> — L2/L3 lokal sehat</td></tr>
<tr><td>Semua gagal termasuk sesama LAN</td><td>Bukan gateway — masalah L1/L2/IP sendiri</td></tr>
<tr><td>Kadang bisa kadang tidak</td><td>Curigai <b>duplikat IP gateway</b> atau flapping</td></tr>
</table></div>
<h3>Redundansi: Satu Gateway = Satu Titik Gagal</h3>
<p>Jika router gateway mati, seluruh VLAN lumpuh. Solusi enterprise: <b>HSRP/VRRP</b> — dua router berbagi satu <b>virtual IP</b> gateway; jika utama mati, cadangan mengambil alih otomatis dalam detik. Dibahas di Part 21 (HA). Di lab kecil, satu gateway cukup — tapi pahami risikonya.</p>
<div class="callout"><div class="t">Gateway ≠ Internet</div><p style="margin:4px 0 0">Gateway hanya berarti "router terdekat". Router itu mungkin menuju VLAN lain (internal) atau menuju ISP (internet). "Bisa ping gateway tapi tidak bisa internet" = masalah <i>setelah</i> gateway (routing/NAT/ISP), bukan gateway-nya.</p></div>`,
      terms: [
        ['Default gateway', 'IP router satu network yang menjadi pintu keluar ke network lain.'],
        ['HSRP/VRRP', 'Protokol redundansi gateway: virtual IP aktif di dua router (failover otomatis).'],
        ['Virtual IP', 'IP gateway maya yang berpindah antar-router saat failover.'],
      ],
      scenario: 'Seluruh VLAN 20 "tidak bisa internet" tapi antar-PC normal. Pengecekan: gateway 192.168.20.1 tidak bisa di-ping — router cabang hang. Karena paham gejala klasik gateway, teknisi langsung ke rak router (bukan mengutak-atik 50 PC). Router di-restart, 5 menit kemudian normal. Diagnosis tepat = MTTR pendek.',
      bestPractices: 'Dokumentasikan gateway tiap VLAN di IP plan (selalu .1 per konvensi). Untuk layanan kritis, rencanakan HSRP/VRRP sejak desain — bukan setelah insiden.',
      security: 'Gateway adalah target ARP spoofing utama (3.3): penyerang yang memalsukan MAC gateway = semua traffic keluar lewat dia. Lindungi dengan DAI + static ARP entry di server kritis.',
      challenge: 'Jelaskan mengapa gateway HARUS satu network dengan host. Apa yang terjadi (langkah per langkah) jika PC 192.168.20.50/24 diset gateway 192.168.30.1?',
      interviewQ: 'Q: "User bisa ping sesama LAN tapi tidak ke server beda VLAN. Apa yang kamu cek?" — A: Gejala klasik gateway/routing: (1) ping gateway — hidup? (2) ipconfig — gateway benar (.1)? (3) arp -a — MAC gateway valid? (4) traceroute — berhenti di hop mana? Kemungkinan: gateway salah/mati, atau router tidak punya route ke VLAN tujuan.',
      quiz: [
        { q: 'Fungsi default gateway adalah…', options: ['Memberi IP otomatis', 'Pintu keluar: router yang dituju saat tujuan beda network', 'Meresolusi nama domain', 'Menyimpan file'], answer: 1, explain: 'Gateway = next-hop default untuk semua tujuan di luar network sendiri.' },
        { q: 'Syarat alamat gateway adalah…', options: ['Bebas alamat apa saja', 'Harus satu network dengan host yang memakainya', 'Harus public IP', 'Harus .254'], answer: 1, explain: 'Host harus bisa menjangkau gateway langsung via L2 (ARP) — beda network = tidak bisa ARP.' },
        { q: 'HSRP/VRRP menyelesaikan masalah…', options: ['Kecepatan internet', 'Single point of failure pada gateway (failover otomatis)', 'Kehabisan IP', 'Virus'], answer: 1, explain: 'Dua router + virtual IP: cadangan mengambil alih saat utama mati.' },
      ],
    },
    {
      id: '4.6',
      title: 'Public IP',
      body: `<p><b>Public IP</b> adalah alamat IP yang <b>routable di internet global</b> — unik sedunia, bisa dijangkau dari mana pun (kecuali diblokir firewall). Ia adalah "alamat rumah di peta dunia".</p>
<h3>Siapa yang Membagikan?</h3>
<pre>IANA (global)
  └─ RIR per wilayah: APNIC (Asia-Pasifik, termasuk Indonesia)
       └─ ISP / perusahaan besar
            └─ kamu (pelanggan)</pre>
<p>Alokasi bersifat hierarkis dan <b>berbayar/langka</b> — IPv4 public habis di sebagian besar RIR. Karena itu ISP biasanya memberi <b>satu</b> public IP dinamis ke pelanggan rumahan, dan memakainya bersama via <b>NAT</b> (Part 19).</p>
<h3>Ciri & Contoh</h3>
<ul>
<li>Bukan termasuk rentang private (4.7) — mis. <code>103.147.x.x</code>, <code>8.8.8.8</code>.</li>
<li>Bisa dicek: <code>curl ifconfig.me</code> — IP yang terlihat internet untuk koneksimu.</li>
<li><b>Statis vs dinamis:</b> server publik butuh statis (DNS menunjuk ke sana); user rumahan cukup dinamis (lebih murah, berganti berkala).</li>
</ul>
<h3>Implikasi Praktis</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Public IP</th></tr>
<tr><td>Keterjangkauan</td><td>Dari seluruh internet (jika firewall mengizinkan)</td></tr>
<tr><td>Kebutuhan</td><td>Server yang diakses publik (web, VPN, email)</td></tr>
<tr><td>Di desain kurikulum</td><td>Hanya di sisi WAN router/firewall — LAN memakai private + NAT</td></tr>
</table></div>
<div class="callout blue"><div class="t">NAT: Satu Public untuk Banyak Private</div><p style="margin:4px 0 0"><b>NAT</b> (<i>Network Address Translation</i>) memungkinkan ratusan private IP berbagi satu public IP — alasan internet tetap berjalan meski IPv4 habis. Cara kerjanya dibedah di Part 19; untuk sekarang cukup pahami <i>mengapa</i> ia dibutuhkan.</p></div>`,
      terms: [
        ['Public IP', 'IP unik global yang routable di internet; dialokasikan IANA→RIR→ISP.'],
        ['RIR', 'Regional Internet Registry — mis. APNIC untuk Asia-Pasifik.'],
        ['NAT', 'Network Address Translation — berbagi satu public IP untuk banyak private IP.'],
      ],
      scenario: 'UMKM ingin CCTV bisa diakses pemilik dari HP saat di luar kota. Opsi: (1) pasang public IP statis + port forwarding — murah tapi berisiko; (2) VPN ke router kantor — aman, rekomendasi. Pemilik memilih VPN setelah dijelaskan bahwa public IP + port terbuka = undangan bagi bot scanner yang memindai seluruh internet 24/7.',
      bestPractices: 'Minimalkan eksposur public IP: hanya layanan yang memang harus publik. Sisanya lewat VPN. Setiap IP publik = permukaan serangan.',
      security: 'Bot internet memindai semua public IP terus-menerus — SSH/RDP yang terekspos akan menerima ribuan percobaan login per hari. Jangan expose port management ke internet. Titik.',
      challenge: 'Cek public IP-mu (<code>curl ifconfig.me</code>). Lalu cek IP lokalmu (<code>ipconfig</code>). Jelaskan mengapa keduanya berbeda dan siapa yang "menerjemahkan" di antaranya.',
      interviewQ: 'Q: "Mengapa perusahaan dengan 500 PC cukup punya 1–2 public IP?" — A: Karena LAN memakai private IP (RFC 1918) dan NAT di firewall/router menerjemahkan banyak private menjadi sedikit public saat ke internet. Public IP hanya dibutuhkan untuk komunikasi yang diinisiasi dari internet.',
      quiz: [
        { q: 'Public IP dialokasikan secara hierarkis oleh…', options: ['IEEE', 'IANA → RIR (mis. APNIC) → ISP', 'Microsoft', 'ICMP'], answer: 1, explain: 'IANA global → RIR regional (APNIC Asia-Pasifik) → ISP → pelanggan.' },
        { q: 'Ratusan PC bisa internet dengan 1 public IP karena…', options: ['Sihir', 'NAT menerjemahkan banyak private IP ke public IP', 'Setiap PC punya public sendiri', 'DHCP'], answer: 1, explain: 'NAT = berbagi public IP; detail mekanisme di Part 19.' },
        { q: 'Server web publik membutuhkan public IP yang…', options: ['Dinamis agar murah', 'Statis — karena DNS menunjuk ke alamat tetap', 'Private', 'APIPA'], answer: 1, explain: 'DNS record menunjuk ke IP tetap; IP berubah = website hilang.' },
      ],
    },
    {
      id: '4.7',
      title: 'Private IP',
      body: `<p><b>Private IP</b> adalah rentang alamat IPv4 yang <b>dicadangkan untuk jaringan internal</b> (<b>RFC 1918</b>) — <b>tidak di-routing di internet</b>. Ia adalah "alamat dalam komplek": bebas dipakai siapa pun di LAN-nya sendiri, tapi tidak dikenal dunia luar.</p>
<h3>Tiga Rentang RFC 1918 (Hafal!)</h3>
<div class="tblwrap"><table>
<tr><th>Rentang</th><th>CIDR</th><th>Jumlah Alamat</th><th>Pemakaian Umum</th></tr>
<tr><td>10.0.0.0 – 10.255.255.255</td><td>10.0.0.0/8</td><td>16,7 juta</td><td>Enterprise besar</td></tr>
<tr><td>172.16.0.0 – 172.31.255.255</td><td>172.16.0.0/12</td><td>1 juta</td><td>Menengah</td></tr>
<tr><td>192.168.0.0 – 192.168.255.255</td><td>192.168.0.0/16</td><td>65.536</td><td>Kantor kecil, rumahan, <b>lab kurikulum ini</b></td></tr>
</table></div>
<h3>Mengapa Private IP Menyelamatkan IPv4?</h3>
<p>Dua alasan: (1) <b>penghematan</b> — jutaan LAN memakai alamat yang sama berulang (192.168.1.x ada di jutaan rumah) tanpa konflik, karena tidak keluar ke internet; (2) <b>keamanan implisit</b> — internet tidak bisa me-routing ke private IP, jadi host internal <b>tidak bisa dijangkau langsung</b> dari luar (tetap butuh firewall yang benar!).</p>
<h3>Aturan Main</h3>
<ul>
<li>Private IP <b>wajib</b> lewat NAT untuk ke internet (Part 19).</li>
<li><b>Jangan</b> memakai rentang public sembarangan di LAN ("biar keren pakai 8.8.x.x") — saat butuh akses ke pemilik aslinya, routing-mu konflik.</li>
<li>Desain kurikulum memakai <code>192.168.x.0/24</code> per VLAN — private, konsisten, mudah diingat.</li>
</ul>
<div class="callout"><div class="t">Jebakan: "Private = Aman"</div><p style="margin:4px 0 0">Private IP tidak bisa dijangkau <i>langsung</i> dari internet, tapi malware/phishing dari dalam tetap bisa menyerang sesama private. "Tidak terlihat dari luar" ≠ "aman". Segmentasi VLAN + firewall antar-segmen tetap wajib (Part 01).</p></div>`,
      terms: [
        ['Private IP', 'Rentang RFC 1918 untuk internal; tidak di-routing di internet; butuh NAT untuk keluar.'],
        ['RFC 1918', 'Dokumen yang mencadangkan 10/8, 172.16/12, 192.168/16 sebagai private.'],
      ],
      scenario: 'Dua perusahaan merger — keduanya memakai 192.168.1.0/24 di LAN-nya. Saat dihubungkan via VPN, routing kacau: "192.168.1.10" ada di dua tempat! Solusi mahal: renumbering salah satu. Pelajaran: untuk enterprise, pilih rentang private yang <b>unik dan terencana</b> (mis. 10.20.x.x), bukan default router rumahan.',
      bestPractices: 'Rencanakan private space sejak awal dengan hierarki (10.<site>.<vlan>.0/24) — murah di awal, mahal jika diperbaiki belakangan.',
      security: 'Jangan pernah menulis private IP di DNS publik atau sertifikat publik — membocorkan topologi internal tanpa guna.',
      challenge: 'Tuliskan 3 rentang RFC 1918 dari ingatan beserta notasi CIDR-nya. Lalu jawab: mengapa 192.168.x.x dipilih untuk lab kurikulum ini?',
      interviewQ: 'Q: "Sebutkan rentang private IP dan mengapa tidak bisa langsung ke internet." — A: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (RFC 1918). Router internet tidak punya rute ke sana (disepakati global) — harus diterjemahkan ke public IP via NAT.',
      quiz: [
        { q: 'Rentang private yang benar menurut RFC 1918 adalah…', options: ['11.0.0.0/8', '172.16.0.0/12', '193.168.0.0/16', '9.0.0.0/8'], answer: 1, explain: 'Tiga rentang: 10/8, 172.16/12, 192.168/16.' },
        { q: 'Dua perusahaan sama-sama memakai 192.168.1.0/24 lalu dihubungkan VPN. Masalahnya…', options: ['Tidak ada masalah', 'Konflik routing — alamat yang sama ada di dua tempat', 'Internet melambat', 'VLAN rusak'], answer: 1, explain: 'Overlapping private space = router tidak tahu 192.168.1.10 yang mana.' },
        { q: 'Private IP bisa ke internet jika…', options: ['Langsung, tanpa syarat', 'Melalui NAT ke public IP', 'Diganti MAC-nya', 'Memakai IPv6'], answer: 1, explain: 'Internet tidak me-routing private; NAT menerjemahkannya.' },
      ],
    },
    {
      id: '4.8',
      title: 'Loopback',
      body: `<p><b>Loopback</b> adalah alamat IP spesial <b>127.0.0.1</b> (seluruh <code>127.0.0.0/8</code>) yang artinya <b>"mesin ini sendiri"</b> (<i>localhost</i>). Packet ke 127.0.0.1 <b>tidak pernah keluar ke kabel</b> — ia "berputar balik" di dalam TCP/IP stack.</p>
<h3>Fungsi</h3>
<ul>
<li><b>Uji stack TCP/IP:</b> <code>ping 127.0.0.1</code> sukses = driver & stack IP sehat — <b>langkah pertama</b> troubleshooting ("apakah masalahnya di mesinku sendiri?"). Gagal = masalah OS/driver, bukan jaringan.</li>
<li><b>Akses layanan lokal:</b> <code>http://localhost:8080</code> = web server di mesin sendiri. Developer & testing memakai ini tiap hari.</li>
<li><b>Nama:</b> <code>localhost</code> selalu resolve ke 127.0.0.1 (cek di file hosts).</li>
</ul>
<h3>Di Router: Loopback Interface</h3>
<p>Router punya konsep <b>interface loopback virtual</b> (mis. <code>Lo0 = 10.255.255.1/32</code>) — interface yang <b>tidak pernah down</b> (tidak terikat kabel fisik). Dipakai sebagai <b>router ID</b> OSPF/BGP dan alamat management yang stabil — dibahas di Part 11–12.</p>
<div class="callout blue"><div class="t">Urutan Ping Troubleshooting</div><p style="margin:4px 0 0"><code>ping 127.0.0.1</code> → <code>ping IP-sendiri</code> → <code>ping gateway</code> → <code>ping tujuan</code>. Urutan dari "dalam" ke "luar" ini mengisolasi: stack sendiri → NIC → LAN → routing. Hafalkan!</p></div>`,
      terms: [
        ['Loopback', '127.0.0.1 — alamat "diri sendiri"; packet tidak keluar ke jaringan.'],
        ['localhost', 'Nama untuk 127.0.0.1.'],
        ['Loopback interface', 'Interface virtual di router yang selalu up; untuk router ID & management.'],
      ],
      scenario: 'Setelah update driver, PC "tidak bisa jaringan sama sekali". <code>ping 127.0.0.1</code> gagal — vonis langsung: stack/driver rusak, bukan kabel atau switch. Rollback driver 5 menit selesai. Tanpa uji loopback, teknisi bisa menghabiskan sejam mengecek kabel yang tidak bersalah.',
      bestPractices: 'Jadikan ping 127.0.0.1 sebagai langkah #1 setiap "tidak bisa konek" — 5 detik yang mengeliminasi seluruh kategori masalah OS/driver.',
      security: 'Layanan yang listen di 127.0.0.1 tidak bisa diakses dari jaringan — pola aman untuk admin panel lokal. Sebaliknya, pastikan layanan sensitif tidak listen di 0.0.0.0 (semua interface) tanpa sengaja.',
      challenge: 'Jalankan <code>ping 127.0.0.1</code> dan <code>ping localhost</code>. Bandingkan hasilnya. Lalu: apa bedanya dengan ping IP LAN-mu sendiri?',
      interviewQ: 'Q: "Apa fungsi ping 127.0.0.1?" — A: Menguji TCP/IP stack lokal tanpa melibatkan hardware jaringan/kabel — packet berputar di dalam OS. Sukses = stack sehat; gagal = masalah driver/OS, bukan jaringan fisik.',
      quiz: [
        { q: 'Alamat loopback adalah…', options: ['192.168.1.1', '127.0.0.1', '10.0.0.1', '255.255.255.255'], answer: 1, explain: '127.0.0.0/8 = loopback; 127.0.0.1 yang umum dipakai.' },
        { q: 'Ping 127.0.0.1 gagal menandakan…', options: ['Kabel putus', 'Masalah pada TCP/IP stack/driver lokal — bukan jaringan fisik', 'ISP down', 'DNS rusak'], answer: 1, explain: 'Loopback tidak menyentuh kabel; gagal = masalah di dalam mesin sendiri.' },
        { q: 'Loopback interface di router dipakai untuk…', options: ['Koneksi ke ISP', 'Alamat stabil yang selalu up: router ID & management', 'Wi-Fi', 'DHCP'], answer: 1, explain: 'Virtual, tidak terikat kabel fisik → tidak pernah down karena link.' },
      ],
    },
    {
      id: '4.9',
      title: 'APIPA',
      body: `<p><b>APIPA</b> (<i>Automatic Private IP Addressing</i>) adalah mekanisme <b>darurat otomatis</b>: saat host <b>gagal mendapat IP dari DHCP</b>, ia memberi dirinya sendiri IP dari <code>169.254.0.0/16</code> (mis. <code>169.254.12.34</code>) agar <b>tetap bisa bicara dengan sesama APIPA di LAN</b>.</p>
<h3>Kapan Muncul?</h3>
<pre>PC boot → DHCP Discover (broadcast) → ......... (hening)
          tidak ada server DHCP menjawab!
          → PC: "ya sudah, saya pakai 169.254.x.x acak saja"
          → cek duplikat via ARP → pakai.</pre>
<p><b>Penyebab umum:</b> server DHCP mati, kabel/VLAN salah (Discover tidak sampai server), DHCP pool habis, atau DHCP snooping salah konfigurasi memblokir.</p>
<h3>Mengapa Ini Gejala, Bukan Solusi</h3>
<p>APIPA hanya memberi konektivitas <b>link-local</b>: bisa ping sesama 169.254.x.x, tapi <b>tidak ada gateway, tidak ada DNS</b> → tidak bisa ke VLAN lain / internet. Fungsinya sekadar "lebih baik dari tidak ada IP sama sekali" (mis. dua laptop ad-hoc tanpa server).</p>
<div class="tblwrap"><table>
<tr><th>IP yang Terlihat</th><th>Artinya</th><th>Aksi</th></tr>
<tr><td>192.168.20.x</td><td>Normal (DHCP/statik OK)</td><td>—</td></tr>
<tr><td>169.254.x.x</td><td><b>DHCP GAGAL</b></td><td>Cek server DHCP, kabel/VLAN, pool</td></tr>
<tr><td>0.0.0.0</td><td>Belum coba / media disconnected</td><td>Cek link fisik</td></tr>
</table></div>
<div class="callout"><div class="t">Refleks NOC</div><p style="margin:4px 0 0">Melihat <code>169.254.x.x</code> di <code>ipconfig</code> = <b>langsung curiga DHCP</b>, bukan kabel. Ini salah satu diagnosis tercepat di dunia networking: satu baris output → satu vonis awal yang tepat 90%.</p></div>`,
      terms: [
        ['APIPA', 'Automatic Private IP Addressing — IP darurat 169.254.0.0/16 saat DHCP gagal.'],
        ['Link-local', 'Hanya berlaku di link/LAN lokal; tidak di-routing.'],
      ],
      scenario: 'Senin pagi: 30 PC "tidak bisa internet". Semuanya 169.254.x.x. Server DHCP ternyata mati karena update Windows otomatis restart malam hari. Solusi: nyalakan server, <code>ipconfig /renew</code> massal via script. Pencegahan: DHCP failover/cluster (Part 13) + matikan auto-restart di server.',
      bestPractices: 'Jangan pernah menonaktifkan APIPA sebagai "solusi" — ia adalah indikator. Matikan indikatornya = buta terhadap kegagalan DHCP.',
      security: 'APIPA tanpa gateway/DNS = isolasi alami; tapi penyerang di LAN yang sama tetap bisa menyerang sesama APIPA. Jangan anggap "tidak bisa internet = aman".',
      challenge: 'Simulasikan (di lab/VM): matikan DHCP server, renew IP client, amati 169.254.x.x muncul. Nyalakan lagi, renew — amati kembali normal. Catat waktunya.',
      interviewQ: 'Q: "PC mendapat IP 169.254.x.x. Apa artinya dan apa yang kamu lakukan?" — A: APIPA = DHCP gagal. Langkah: (1) pastikan link up, (2) cek server DHCP hidup & reachable (ping), (3) cek pool tidak habis, (4) cek VLAN/relay dan DHCP snooping, (5) ipconfig /renew setelah perbaikan.',
      quiz: [
        { q: 'IP 169.254.12.34 menandakan…', options: ['IP statik normal', 'APIPA — DHCP gagal, host memberi IP darurat sendiri', 'Public IP', 'Gateway'], answer: 1, explain: '169.254.0.0/16 = APIPA, muncul saat tidak ada jawaban DHCP.' },
        { q: 'Dengan IP APIPA, host bisa…', options: ['Akses internet normal', 'Hanya bicara dengan sesama APIPA di LAN (tanpa gateway/DNS)', 'Akses semua VLAN', 'Menjadi DHCP server'], answer: 1, explain: 'Link-local saja: tanpa gateway & DNS yang valid.' },
        { q: 'Langkah pertama saat menemukan APIPA massal adalah mengecek…', options: ['Kabel tiap PC', 'Server DHCP: hidup, reachable, pool tersedia', 'Mengganti switch', 'Restart internet'], answer: 1, explain: 'APIPA massal = masalah terpusat di DHCP, bukan di tiap client.' },
      ],
    },
    {
      id: '4.10',
      title: 'Subnet Mask',
      body: `<p><b>Subnet mask</b> adalah "garis batas" 32-bit yang <b>memisahkan network portion dari host portion</b> sebuah IP. Ditulis desimal bertitik (<code>255.255.255.0</code>) atau CIDR (<code>/24</code>) — keduanya menyatakan hal yang sama.</p>
<h3>Membaca Mask</h3>
<pre>255.255.255.0  =  11111111.11111111.11111111.00000000
                   └────── 24 bit "1" ──────┘└8 bit "0"┘
                   = /24 → 24 bit network, 8 bit host

Aturan: bit "1" harus KONTINYU dari kiri.
255.255.0.255 = INVALID (bit 1 terputus) — mask tidak boleh belang!</pre>
<h3>Mask Umum (Hafal!)</h3>
<div class="tblwrap"><table>
<tr><th>CIDR</th><th>Mask</th><th>Host/Net</th><th>Usable Host</th><th>Pemakaian</th></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>254</td><td>254</td><td>VLAN kantor (standar kurikulum)</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>126</td><td>126</td><td>Subnet sedang</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>62</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>30</td><td>30</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>14</td><td>14</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>6</td><td>6 (link point-to-point kecil)</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>2</td><td>2 (link router-to-router!)</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>65.534</td><td>65.534 (terlalu besar untuk 1 VLAN)</td></tr>
</table></div>
<h3>Tiga Pertanyaan Ajaib (untuk IP + mask apa pun)</h3>
<ol>
<li><b>Network-nya apa?</b> → IP AND mask.</li>
<li><b>Broadcast-nya apa?</b> → semua bit host = 1.</li>
<li><b>Range host valid?</b> → di antara keduanya.</li>
</ol>
<p>Tiga pertanyaan ini menjawab 90% soal subnetting — dan 90% troubleshooting IP.</p>`,
      terms: [
        ['Subnet mask', '32-bit pembatas network vs host portion; bit 1 kontinu dari kiri.'],
        ['/30', 'Mask untuk link point-to-point: hanya 2 usable host (router-to-router).'],
      ],
      diagram: `<pre>         MEMBACA MASK: /26 = 255.255.255.192

   11111111.11111111.11111111.11|000000
                                 ↑
                          garis batas (/26)
   Kiri "1" = network (26 bit) · Kanan "0" = host (6 bit)
   → 2^6 − 2 = 62 usable host</pre>`,
      scenario: 'Link antar-router diset /24 "biar gampang" — membuang 252 alamat untuk 2 device. Standar industri: /30 (tepat 2 host). Di sisi lain, VLAN user 300 orang diset /25 (126 host) — kekurangan alamat. Dua kesalahan berlawanan dari satu akar: tidak menghitung kebutuhan sebelum memilih mask.',
      bestPractices: 'Pilih mask berdasarkan kebutuhan + cadangan 20–30%: link point-to-point = /30, VLAN user kecil = /24 (standar, simpel), jangan /16 untuk satu VLAN (broadcast domain raksasa).',
      security: 'Mask yang terlalu besar (/16 untuk user) = broadcast domain raksasa = permukaan ARP spoofing & broadcast storm raksasa. Ukuran subnet adalah keputusan keamanan juga.',
      challenge: 'Tanpa kalkulator: tentukan mask desimal untuk /27 dan /29. Lalu hitung usable host masing-masing. (Petunjuk: 256 − nilai oktet terakhir.)',
      interviewQ: 'Q: "Apa itu subnet mask dan mengapa bit 1-nya harus kontinu?" — A: Mask 32-bit pembatas network/host portion. Bit 1 harus kontinu dari kiri karena ia mendefinisikan prefix network yang hierarkis — mask belang tidak bisa direpresentasikan sebagai /N dan merusak agregasi routing.',
      quiz: [
        { q: 'Mask untuk /26 dalam desimal adalah…', options: ['255.255.255.128', '255.255.255.192', '255.255.255.224', '255.255.255.0'], answer: 1, explain: '192 = 11000000 → 2 bit network tambahan: /24+2 = /26.' },
        { q: 'Mask yang tepat untuk link point-to-point antar 2 router adalah…', options: ['/24', '/16', '/30 (tepat 2 usable host)', '/8'], answer: 2, explain: '/30 = 2 host, tidak membuang alamat; standar industri.' },
        { q: 'Tiga pertanyaan ajaib subnetting adalah…', options: ['Siapa, kapan, di mana', 'Network-nya apa? Broadcast-nya apa? Range host valid?', 'IP, MAC, port', 'Ping, trace, lookup'], answer: 1, explain: 'Tiga pertanyaan ini = fondasi semua perhitungan subnet.' },
      ],
    },
    {
      id: '4.11',
      title: 'CIDR',
      body: `<p><b>CIDR</b> (<i>Classless Inter-Domain Routing</i>) adalah <b>cara modern menulis network + mask</b> dalam satu notasi ringkas: <code>192.168.20.0/24</code>. Angka setelah garis miring = <b>jumlah bit network (prefix length)</b>.</p>
<h3>Mengapa "Classless"? (Sejarah Singkat)</h3>
<p>Dulu ada <b>kelas</b> kaku: Kelas A (/8, 16 juta host), B (/16, 65 ribu), C (/24, 254). Butuh 500 host? Terpaksa ambil Kelas B (65 ribu) — boros luar biasa. <b>CIDR menghapus kelas</b>: prefix bisa /19, /22, /27 — <b>sesuai kebutuhan</b>, tidak dipaksa tiga ukuran. Sejak 1993, "kelas" hanya sejarah (tapi istilah "kelas C" masih dipakai orang lama untuk /24).</p>
<h3>Membaca CIDR dengan Cepat</h3>
<div class="tblwrap"><table>
<tr><th>CIDR</th><th>Bit Host</th><th>Total Alamat</th><th>Usable</th></tr>
<tr><td>/24</td><td>8</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>7</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>6</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>5</td><td>32</td><td>30</td></tr>
<tr><td>/28</td><td>4</td><td>16</td><td>14</td></tr>
<tr><td>/29</td><td>3</td><td>8</td><td>6</td></tr>
<tr><td>/30</td><td>2</td><td>4</td><td>2</td></tr>
</table></div>
<p><b>Trik cepat:</b> total alamat = 2<sup>(32−prefix)</sup>. /26 → 2<sup>6</sup> = 64. <b>Block size</b> (lompatan network) = 256 − nilai oktet terakhir mask: /26 → 256−192 = 64 → network berurutan: .0, .64, .128, .192.</p>
<div class="callout blue"><div class="t">CIDR = Bahasa Sehari-hari Engineer</div><p style="margin:4px 0 0">Di routing table, firewall rule, dan dokumentasi modern, semuanya ditulis CIDR (<code>10.0.0.0/8</code>, <code>192.168.20.0/24</code>). Menguasai baca-tulis CIDR adalah syarat mutlak sebelum Part 08 (VLAN) dan Part 11 (routing).</p></div>`,
      terms: [
        ['CIDR', 'Classless Inter-Domain Routing — notasi prefix /N; menghapus sistem kelas kaku.'],
        ['Prefix length', 'Angka setelah / : jumlah bit network.'],
        ['Block size', 'Ukuran lompatan antar-network = 256 − oktet terakhir mask.'],
      ],
      scenario: 'ISP memberi perusahaan prefix /29 (8 alamat, 6 usable). Engineer yang paham CIDR langsung tahu: cukup untuk 1 router + 1 firewall + cadangan — tanpa meminta /24 yang akan ditolak RIR. Bahasa CIDR membuat negosiasi dengan ISP efisien dan profesional.',
      bestPractices: 'Selalu bicara dalam CIDR dengan ISP/vendor ("kami butuh /29") — bukan "8 IP". Presisi = kredibilitas.',
      security: 'Salah membaca prefix di firewall rule (/24 vs /16) membuka 256x lebih banyak host. Selalu double-check angka setelah garis miring.',
      challenge: 'Hitung cepat: /23 → total alamat? usable? block size? Tulis network-network berurutan untuk 192.168.0.0/23.',
      interviewQ: 'Q: "Apa itu CIDR dan mengapa menggantikan sistem kelas?" — A: Notasi /N yang menyatakan prefix length secara fleksibel. Sistem kelas (A/B/C) kaku dan boros — butuh 500 host terpaksa ambil 65 ribu (kelas B). CIDR memungkinkan prefix berapa pun sesuai kebutuhan sejak 1993.',
      quiz: [
        { q: 'Notasi 192.168.20.0/24 — angka 24 menyatakan…', options: ['Jumlah host', 'Prefix length: 24 bit network', 'Nomor VLAN', 'Port'], answer: 1, explain: '/24 = 24 bit pertama adalah network portion.' },
        { q: 'Block size untuk /26 adalah…', options: ['128', '64', '32', '256'], answer: 1, explain: 'Mask /26 = .192; 256 − 192 = 64 → network: .0, .64, .128, .192.' },
        { q: 'Keunggulan CIDR atas sistem kelas adalah…', options: ['Lebih cepat', 'Prefix fleksibel sesuai kebutuhan — tidak boros seperti kelas A/B/C yang kaku', 'Lebih aman', 'Tanpa mask'], answer: 1, explain: 'Classless = ukuran bebas; classful = hanya 3 ukuran kaku.' },
      ],
    },
    {
      id: '4.12',
      title: 'Subnetting',
      body: `<p><b>Subnetting</b> adalah seni <b>meminjam bit host untuk membuat network-network yang lebih kecil</b> dari satu network besar. Tujuannya: segmentasi (pelajaran Part 01) tanpa meminta alamat baru ke ISP.</p>
<h3>Contoh: Pecah 192.168.20.0/24 jadi 4 Subnet</h3>
<pre>Butuh: 4 subnet (±50 host tiap subnet)
Pinjam 2 bit host → /24 + 2 = /26 → tiap subnet 62 usable host ✓

Subnet 1: 192.168.20.0/26    host .1 – .62      broadcast .63
Subnet 2: 192.168.20.64/26   host .65 – .126    broadcast .127
Subnet 3: 192.168.20.128/26  host .129 – .190   broadcast .191
Subnet 4: 192.168.20.192/26  host .193 – .254   broadcast .255
          ▲ block size 64 → lompatan .0, .64, .128, .192</pre>
<h3>Langkah Sistematis (Metode Block Size)</h3>
<ol>
<li><b>Berapa subnet dibutuhkan?</b> → 2<sup>n</sup> ≥ kebutuhan → n = bit pinjaman. (Butuh 4 → 2<sup>2</sup> → pinjam 2.)</li>
<li><b>Prefix baru</b> = prefix lama + n. (/24 + 2 = /26.)</li>
<li><b>Block size</b> = 256 − oktet terakhir mask baru. (/26 → 256−192 = 64.)</li>
<li><b>Network berurutan</b> = kelipatan block size di oktet yang berubah. (.0, .64, .128, .192.)</li>
<li><b>Verifikasi:</b> tiap subnet → network, broadcast (network + block − 1), range host.</li>
</ol>
<h3>Mengapa Repot-repot Subnetting?</h3>
<ul>
<li><b>Segmentasi & keamanan:</b> tiap departemen punya broadcast domain sendiri (Part 01).</li>
<li><b>Efisiensi:</b> link point-to-point cukup /30, tidak membuang /24.</li>
<li><b>Keteraturan:</b> 192.168.20.0/26 = "lantai 1", .64/26 = "lantai 2" — dokumentasi rapi.</li>
</ul>
<div class="callout"><div class="t">Subnetting vs VLAN</div><p style="margin:4px 0 0">Subnetting membagi secara <b>logis (IP)</b>; VLAN membagi secara <b>data-link</b>. Aturan emas: <b>1 VLAN = 1 subnet</b> — keduanya selalu berpasangan. Subnet tanpa VLAN = tidak ada pemisah broadcast; VLAN tanpa subnet = tidak bisa routing.</p></div>`,
      terms: [
        ['Subnetting', 'Meminjam bit host untuk memecah network besar jadi subnet-subnet kecil.'],
        ['Bit pinjaman', 'Bit host yang "dipinjam" menjadi bit network tambahan.'],
      ],
      diagram: `<pre>       SUBNETTING: 192.168.20.0/24 → 4× /26

   ┌──────────── 192.168.20.0/24 ────────────┐
   │  .0/26   │  .64/26  │ .128/26 │ .192/26 │
   │ Lantai 1 │ Lantai 2 │ Lantai 3│ Server  │
   │ 62 host  │ 62 host  │ 62 host │ 62 host │
   └─────────────────────────────────────────┘
   Pinjam 2 bit → /26 → block size 64</pre>`,
      scenario: 'Kantor 3 lantai + ruang server, satu /24 dari ISP. Tanpa subnetting: satu broadcast domain 200+ host — berisik dan tidak aman. Dengan subnetting /26: tiap lantai terisolasi, server terpisah, broadcast domain kecil. Satu network "dipotong" menjadi 4 segmen fungsional — tanpa beli alamat baru.',
      bestPractices: 'Selalu sisakan 1–2 subnet cadangan untuk pertumbuhan. Subnetting ulang network yang sudah live = renumbering = mimpi buruk. Rencanakan 3–5 tahun ke depan.',
      security: 'Subnetting memungkinkan firewall rule per-segmen ("lantai 3 tidak boleh ke server") — tanpa subnet, kebijakan sehalus itu mustahil.',
      challenge: 'Pecah 10.10.0.0/16 menjadi 8 subnet sama besar. Tentukan: prefix baru, block size, dan daftar network-nya. Verifikasi satu subnet (network, broadcast, range host).',
      interviewQ: 'Q: "Jelaskan langkah subnetting 192.168.1.0/24 menjadi 4 subnet." — A: (1) Butuh 4 → pinjam 2 bit (2²=4). (2) Prefix /26. (3) Block size = 256−192 = 64. (4) Network: .0, .64, .128, .192. (5) Tiap /26 = 62 host; broadcast = network+63.',
      quiz: [
        { q: 'Untuk membuat 4 subnet dari /24, bit yang dipinjam dan prefix baru adalah…', options: ['Pinjam 4 bit → /28', 'Pinjam 2 bit → /26', 'Pinjam 1 bit → /25', 'Pinjam 8 bit → /32'], answer: 1, explain: '2² = 4 subnet; /24+2 = /26; tiap 62 host.' },
        { q: 'Broadcast address subnet 192.168.20.64/26 adalah…', options: ['192.168.20.63', '192.168.20.127', '192.168.20.128', '192.168.20.255'], answer: 1, explain: 'Network .64 + block 64 − 1 = .127.' },
        { q: 'Aturan pasangan subnetting dan VLAN adalah…', options: ['1 VLAN = 2 subnet', '1 VLAN = 1 subnet — selalu berpasangan', 'Subnet tanpa VLAN cukup', 'VLAN tanpa subnet cukup'], answer: 1, explain: 'Emas: satu broadcast domain (VLAN) = satu network IP (subnet).' },
      ],
    },
    {
      id: '4.13',
      title: 'VLSM',
      body: `<p><b>VLSM</b> (<i>Variable Length Subnet Mask</i>) adalah subnetting <b>dengan ukuran subnet yang boleh berbeda-beda</b> dalam satu network. Jika subnetting biasa memotong kue sama besar, VLSM memotong <b>sesuai porsi yang dibutuhkan</b> tiap bagian.</p>
<h3>Masalah yang Diselesaikan</h3>
<pre>Network 192.168.20.0/24 untuk: LAN user (100 host), server (20 host),
link WAN (2 host), link router (2 host).

Subnetting SAMA RATA (/26 × 4):
  LAN user: 62 host → KURANG! (butuh 100) ✗
  Link WAN: 62 host → boros 60 alamat ✗

VLSM (urut dari BESAR ke kecil):
  LAN user : 192.168.20.0/25    → 126 host ✓ (butuh 100)
  Server   : 192.168.20.128/27  → 30 host  ✓ (butuh 20)
  Link WAN : 192.168.20.160/30  → 2 host   ✓ (butuh 2)
  Link Rtr : 192.168.20.164/30  → 2 host   ✓ (butuh 2)
  Sisa     : 192.168.20.168/29+ → cadangan ✓</pre>
<h3>Aturan Main VLSM</h3>
<ol>
<li><b>Urutkan kebutuhan dari TERBESAR ke terkecil</b> — agar subnet besar tidak terpotong subnet kecil.</li>
<li>Alokasikan prefix terkecil yang cukup (100 host → /25, bukan /24).</li>
<li>Lanjutkan dari alamat berikutnya yang <b>sejajar block size</b>.</li>
<li><b>Jangan overlap!</b> Verifikasi tiap alokasi tidak menabrak yang lain.</li>
</ol>
<div class="callout blue"><div class="t">VLSM = Efisiensi Enterprise</div><p style="margin:4px 0 0">Di dunia nyata, kebutuhan tidak pernah sama rata. VLSM adalah standar perancangan IP enterprise — dan syarat protokol routing modern (RIPv1 yang <i>classful</i> tidak mendukung VLSM; RIPv2/OSPF mendukung — Part 11).</p></div>`,
      terms: [
        ['VLSM', 'Variable Length Subnet Mask — subnet dengan ukuran berbeda dalam satu network.'],
        ['Classful', 'Protokol routing lama yang tidak paham VLSM/CIDR (mis. RIPv1).'],
      ],
      scenario: 'ISP memberi /24 untuk kantor cabang: 120 user, 15 server, 4 link WAN (/30). Dengan subnetting rata (/25×2): user dapat 126 (pas!), server 126 (boros 111!), link WAN tidak kebagian. Dengan VLSM: /25 user, /27 server, 4× /30 link — semua cukup + sisa cadangan. Satu /24 yang direncanakan VLSM mengalahkan /24 yang dipotong rata.',
      bestPractices: 'Selalu alokasikan dari yang terbesar, sisakan ruang cadangan di akhir. Dokumentasikan peta alokasi — VLSM tanpa dokumentasi = labirin.',
      security: 'VLSM yang rapi memudahkan agregasi firewall rule per fungsi — kebalikan dari "aturan acak per IP" yang tak terkelola.',
      challenge: 'Alokasikan 172.16.0.0/22 untuk: 400 host, 200 host, 50 host, 2 link /30. Tulis tabel alokasinya + sisa cadangannya.',
      interviewQ: 'Q: "Apa beda subnetting biasa dan VLSM?" — A: Subnetting biasa (FLSM) memotong sama besar; VLSM memotong sesuai kebutuhan tiap segmen (besar-ke-kecil, tanpa overlap). VLSM jauh lebih hemat alamat dan merupakan standar desain enterprise modern.',
      quiz: [
        { q: 'Keunggulan VLSM dibanding subnetting sama rata adalah…', options: ['Lebih cepat dihitung', 'Ukuran subnet menyesuaikan kebutuhan — tidak boros, tidak kurang', 'Tanpa mask', 'Otomatis oleh router'], answer: 1, explain: 'VLSM = potong sesuai porsi; FLSM = potong rata yang boros/kurang.' },
        { q: 'Aturan pertama alokasi VLSM adalah…', options: ['Dari yang terkecil dulu', 'Urutkan kebutuhan dari TERBESAR ke terkecil', 'Acak saja', 'Dari tengah'], answer: 1, explain: 'Besar dulu agar tidak terpotong/fragmentasi oleh alokasi kecil.' },
        { q: 'Untuk 100 host, prefix VLSM yang tepat adalah…', options: ['/24 (254)', '/25 (126)', '/26 (62)', '/27 (30)'], answer: 1, explain: '/26 hanya 62 < 100; /25 = 126 adalah yang terkecil yang cukup.' },
      ],
    },
    {
      id: '4.14',
      title: 'Route Summarization',
      body: `<p><b>Route summarization</b> (<i>supernetting</i>/<i>agregasi</i>) adalah kebalikan subnetting: <b>menggabungkan banyak network kecil menjadi satu pengumuman route yang lebih besar</b>. Tujuannya: <b>routing table tetap kecil dan cepat</b>.</p>
<h3>Analogi: Kode Pos</h3>
<p>Kantor pos tidak menyimpan alamat tiap rumah di Jakarta — cukup "semua 10xxx → Jakarta". Begitu pula router: daripada 4 route <code>192.168.0.0/24, .1.0/24, .2.0/24, .3.0/24</code>, cukup <b>satu</b> summary: <code>192.168.0.0/22</code>.</p>
<h3>Cara Menemukan Summary</h3>
<pre>Network: 192.168.0.0/24
         192.168.1.0/24
         192.168.2.0/24
         192.168.3.0/24
Langkah: cari bit yang SAMA di semua network, berhenti di bit yang beda.
  192.168.000000|00.0  → 22 bit sama
  192.168.000000|01.0
  192.168.000000|10.0
  192.168.000000|11.0
Summary: 192.168.0.0/22 ✓ (mencakup .0–.3 tepat, tidak lebih)</pre>
<h3>Syarat: Network Harus Kontigu & Sejajar</h3>
<p>Summarization hanya akurat jika network-network <b>berurutan (kontigu)</b> dan <b>sejajar block size</b>. <code>192.168.1.0/24 + 192.168.2.0/24</code> tidak bisa diringkas rapi menjadi satu /23 (itu mencakup .0–.3, termasuk yang tidak dimiliki → <b>route bocor</b>). <b>Alasan:</b> summary yang "kelebihan" bisa menarik traffic yang seharusnya ke tempat lain (blackhole/misroute).</p>
<div class="callout"><div class="t">Dampak Nyata</div><p style="margin:4px 0 0">Router internet global menangani ~1 juta prefix — tanpa agregasi bisa puluhan juta. Summarization menjaga <b>convergence cepat</b> (Part 11): semakin kecil tabel, semakin cepat router sepakat saat ada perubahan.</p></div>`,
      terms: [
        ['Route summarization', 'Menggabungkan banyak route kecil jadi satu prefix besar (supernetting).'],
        ['Kontigu', 'Network-network yang berurutan tanpa jeda — syarat summary rapi.'],
        ['Convergence', 'Waktu yang dibutuhkan router-router untuk sepakat pada topologi baru.'],
      ],
      scenario: 'Kantor pusat punya 20 cabang, tiap cabang 4 VLAN (/24) = 80 route. Tanpa summary, router pusat menyimpan 80 route cabang + ribuan lainnya. Dengan summary per cabang (/22), tinggal 20 route — tabel 4x lebih kecil, convergence 4x lebih cepat, troubleshooting ("cabang mana?") jauh lebih mudah dibaca.',
      bestPractices: 'Rencanakan alokasi IP hierarkis sejak awal (per site satu blok besar) AGAR bisa di-summary — summarization adalah hasil desain, bukan sulap belakangan.',
      security: 'Summary yang bocor (mencakup network orang lain) bisa menarik traffic sensitif ke tempat salah — verifikasi cakupan summary sebelum advertise.',
      challenge: 'Tentukan summary untuk: 10.10.4.0/24, 10.10.5.0/24, 10.10.6.0/24, 10.10.7.0/24. Lalu: mengapa 10.10.5.0/24 + 10.10.6.0/24 saja sulit diringkas rapi?',
      interviewQ: 'Q: "Apa itu route summarization dan apa syaratnya?" — A: Menggabungkan banyak prefix kecil jadi satu besar agar routing table kecil & convergence cepat. Syarat: network harus kontigu (berurutan) dan sejajar block size — jika tidak, summary "bocor" mencakup network yang tidak dimiliki dan bisa misroute.',
      quiz: [
        { q: 'Summary yang tepat untuk 192.168.0.0/24 s.d. 192.168.3.0/24 adalah…', options: ['192.168.0.0/24', '192.168.0.0/22', '192.168.0.0/16', '192.168.0.0/23'], answer: 1, explain: '22 bit sama; /22 mencakup .0–.3 tepat.' },
        { q: 'Tujuan utama summarization adalah…', options: ['Menghemat IP', 'Routing table kecil → convergence cepat & mudah dibaca', 'Enkripsi route', 'Mengganti VLAN'], answer: 1, explain: 'Agregasi = tabel kecil = router cepat sepakat & mudah dianalisis.' },
        { q: 'Bahaya summary yang "kelebihan cakupan" adalah…', options: ['Tidak ada', 'Menarik traffic yang bukan haknya (misroute/blackhole)', 'Internet lambat', 'VLAN rusak'], answer: 1, explain: 'Summary harus tepat; kelebihan = mengklaim network orang lain.' },
      ],
    },
    {
      id: '4.15',
      title: 'IP Address Planning',
      body: `<p><b>IP address planning</b> adalah <b>dokumen desain alokasi IP</b> — "sertifikat tanah" jaringanmu. Tanpa-nya, alokasi liar berujung duplikat, konflik merger, dan renumbering mahal. Dengan-nya, setiap IP punya <b>alasan dan pemilik</b>.</p>
<h3>Template IP Plan (Pakai Ini!)</h3>
<div class="tblwrap"><table>
<tr><th>VLAN</th><th>Subnet</th><th>Gateway</th><th>Infra (.2–.9)</th><th>Statis (.10–.49)</th><th>DHCP Pool (.100–.200)</th></tr>
<tr><td>10 CCTV</td><td>192.168.10.0/24</td><td>.1</td><td>.2 NVR2</td><td>.10 NVR, .11–.30 kamera</td><td>— (tanpa DHCP)</td></tr>
<tr><td>20 OFFICE</td><td>192.168.20.0/24</td><td>.1</td><td>.2 SW, .3 AP</td><td>.50 PC lab</td><td>.100–.200 user</td></tr>
<tr><td>30 SERVER</td><td>192.168.30.0/24</td><td>.1</td><td>—</td><td>.10 web, .11 db, .5 DNS</td><td>— (tanpa DHCP)</td></tr>
<tr><td>40 GUEST</td><td>192.168.40.0/24</td><td>.1</td><td>—</td><td>—</td><td>.100–.250 tamu</td></tr>
<tr><td>99 MGMT</td><td>192.168.99.0/24</td><td>.1</td><td>.2 SW, .3 RTR, .4 FW</td><td>.10 Zabbix</td><td>— (tanpa DHCP)</td></tr>
</table></div>
<h3>Prinsip Perancangan</h3>
<ol>
<li><b>Hierarkis & dapat di-summary:</b> satu site = satu blok (mis. 10.20.0.0/16), VLAN = /24 di dalamnya — summary otomatis rapi.</li>
<li><b>Zona konsisten:</b> .1 gateway, infra kecil, statis tengah, DHCP pool terpisah — di SEMUA VLAN.</li>
<li><b>Cadangan:</b> sisakan 20–30% tiap zona + subnet kosong untuk VLAN baru.</li>
<li><b>Terdokumentasi & versioned:</b> IP plan hidup di Git (bagian portfolio Part 39!), bukan di kepala satu orang.</li>
<li><b>Unik antar-site:</b> jangan pakai 192.168.1.0/24 di semua cabang (pelajaran 4.7).</li>
</ol>
<div class="callout blue"><div class="t">IP Plan = Dokumen Hidup</div><p style="margin:4px 0 0">Setiap perubahan IP (tambah server, ganti printer) = update dokumen + commit. IP plan yang kedaluwarsa sama bahayanya dengan tidak punya: engineer mengambil keputusan dari peta yang salah.</p></div>`,
      terms: [
        ['IP address planning', 'Dokumen desain alokasi IP: siapa dapat apa, di mana, mengapa.'],
        ['IPAM', 'IP Address Management — tool/database pengelolaan alokasi IP (mis. phpIPAM, NetBox).'],
      ],
      scenario: 'Engineer baru butuh IP untuk server monitoring. Ia buka IP plan: VLAN 99, zona statis .10–.49, .10 sudah dipakai Zabbix → ia ambil .11, catat, commit. Total 5 menit, tanpa tanya siapa-siapa, tanpa risiko duplikat. Bandingkan tanpa dokumen: tebak-tebak, ping satu-satu, 30 menit + risiko tabrakan.',
      bestPractices: 'Mulai IP plan dari spreadsheet sederhana SEKARANG; naik ke IPAM (NetBox) saat >500 alamat. Yang penting: satu sumber kebenaran.',
      security: 'IP plan adalah dokumen sensitif — membocorkan topologi internal. Simpan di repo private/internal, bukan repo publik portfolio (portfolio cukup versi anonim/contoh).',
      challenge: 'Buat IP plan lengkap untuk kosan/kantor kecil: 2 VLAN (penghuni + tamu), 1 server, 1 printer, 3 AP. Ikuti template tabel di atas.',
      interviewQ: 'Q: "Apa isi IP address plan yang baik?" — A: Tabel per VLAN/subnet: network, gateway, zona (infra/statis/DHCP pool), pemilik tiap alokasi statis, dan cadangan. Prinsip: hierarkis (bisa di-summary), zona konsisten, unik antar-site, terdokumentasi dan di-versioning.',
      quiz: [
        { q: 'Tujuan utama IP address planning adalah…', options: ['Agar terlihat profesional', 'Setiap IP punya alasan & pemilik — mencegah duplikat, konflik, renumbering mahal', 'Mempercepat internet', 'Mengganti DHCP'], answer: 1, explain: 'Dokumen = satu sumber kebenaran alokasi; tanpa itu alokasi liar.' },
        { q: 'Sesuai konvensi kurikulum, DHCP pool user VLAN 20 adalah…', options: ['192.168.20.1–.9', '192.168.20.100–.200', '192.168.20.10–.49', '192.168.20.250–.254'], answer: 1, explain: '.100–.200 = zona dinamis; statis/infra di luar pool.' },
        { q: 'Agar antar-site bisa di-summary rapi, alokasi harus…', options: ['Acak', 'Hierarkis: satu site satu blok besar, VLAN /24 di dalamnya', 'Semua /16', 'Pakai public IP'], answer: 1, explain: 'Hierarki = agregasi otomatis; acak = tidak bisa di-summary.' },
      ],
    },
    {
      id: '4.16',
      title: 'Hands-On: Subnetting Challenge',
      body: `<p>Subnetting adalah skill <b>otot</b> — hanya dikuasai lewat latihan berulang. Lab ini memberimu <b>tantangan bertingkat</b> + cara verifikasi jawabanmu sendiri (tanpa mencontek).</p>
<h3>Topologi</h3>
<pre>Kertas & kalkulator (atau ipcalc) — target: kecepatan & ketepatan.

Level 1: Diberi IP+mask → tentukan network, broadcast, range host.
Level 2: Diberi kebutuhan subnet → tentukan prefix & daftar network.
Level 3: VLSM — alokasi campuran seperti dunia nyata.</pre>
<h3>Objective</h3>
<p>Menyelesaikan 9 soal (3 per level) dalam &lt;20 menit dengan akurasi 100% — standar kecepatan engineer saat mendesain di lapangan.</p>
<h3>Konfigurasi</h3>
<p>Install verifikator (bukan untuk mencontek — untuk <b>cek jawaban</b>):</p>
<pre># Linux: ipcalc (terbaik untuk belajar — menunjukkan perhitungan!)
sudo apt install ipcalc
ipcalc 192.168.20.50/26
# → Network, Netmask, Broadcast, HostMin, HostMax, Hosts/Net ✓

# Tanpa install: python3
python3 -c "import ipaddress; n=ipaddress.ip_network('192.168.20.0/26'); print(n.network_address, n.broadcast_address, n.num_addresses-2)"</pre>
<p><b>Mengapa ipcalc?</b> Ia menunjukkan <i>langkah</i> perhitungan (biner, wildcard) — bukan cuma jawaban. Belajar dari langkahnya, bukan menghafal hasilnya.</p>
<h3>Soal Tantangan</h3>
<div class="tblwrap"><table>
<tr><th>#</th><th>Soal</th><th>Petunjuk</th></tr>
<tr><td>1</td><td>Network, broadcast, range host: 10.8.15.200/20</td><td>Block size di oktet ke-3</td></tr>
<tr><td>2</td><td>Network, broadcast, range host: 172.16.90.17/27</td><td>Block size 32</td></tr>
<tr><td>3</td><td>Usable host: 192.168.5.0/23</td><td>2^(32−23) − 2</td></tr>
<tr><td>4</td><td>Pecah 192.168.40.0/24 jadi 8 subnet</td><td>Pinjam 3 bit → ?</td></tr>
<tr><td>5</td><td>Butuh 14 subnet dari 10.1.0.0/16</td><td>2^4=16 ≥ 14 → ?</td></tr>
<tr><td>6</td><td>Prefix untuk tepat 1000 host</td><td>2^10=1024 → ?</td></tr>
<tr><td>7</td><td>VLSM 192.168.99.0/24: 60, 28, 12 host, 2× /30</td><td>Besar→kecil</td></tr>
<tr><td>8</td><td>Summary: 10.20.8.0/24 – 10.20.11.0/24</td><td>Bit sama?</td></tr>
<tr><td>9</td><td>IP 192.168.20.75/26 — subnet ke-berapa? gateway-nya?</td><td>Block 64</td></tr>
</table></div>
<h3>Failure Injection</h3>
<p><b>Sengaja jawab dengan "jebakan umum":</b> lupa −2 (pakai 64 bukan 62), salah block size (256−224=32 bukan 16), atau overlap VLSM. <b>Lalu verifikasi dengan ipcalc</b> dan catat pola kesalahanmu — mengenali pola salahmu sendiri adalah cara tercepat memperbaikinya.</p>
<h3>Troubleshooting & Fix</h3>
<p>Untuk tiap jawaban salah: (1) tulis ulang perhitungan biner lengkap, (2) temukan langkah yang meleset, (3) buat 2 soal variasi sendiri dan selesaikan. <b>Final verification:</b> 9 soal benar + bisa menjelaskan <i>mengapa</i> tiap langkah — bukan sekadar angka.</p>
<div class="callout blue"><div class="t">Kunci Jawaban (Cek Setelah Mengerjakan!)</div><p style="margin:4px 0 0">1) Net 10.8.0.0, BC 10.8.15.255, host .0.1–.15.254 &nbsp; 2) Net 172.16.90.0, BC .90.31, host .1–.30 &nbsp; 3) 510 &nbsp; 4) /27, block 32: .0, .32, ..., .224 &nbsp; 5) /20 &nbsp; 6) /22 (1022) &nbsp; 7) .0/26, .64/27, .96/28, .112/30, .116/30 &nbsp; 8) 10.20.8.0/22 &nbsp; 9) Subnet ke-2 (.64/26), gateway .65 (atau .1 konvensi desain — diskusikan!).</p></div>`,
      terms: [
        ['ipcalc', 'Tool CLI yang menunjukkan langkah perhitungan subnet (terbaik untuk belajar).'],
      ],
      scenario: 'Interview kerja: "pecah /24 jadi 6 subnet, cepat." Kandidat yang terlatih menjawab dalam 60 detik dengan metode block size — tanpa kalkulator. Kandidat yang hanya "pernah baca" terdiam. Subnetting adalah skill interview yang paling sering diuji untuk posisi network — karena ia membedakan "paham" dari "hafal".',
      bestPractices: 'Latih 10 menit sehari selama 2 minggu — sampai block size /25–/30 di luar kepala. Otot yang dilatih tidak lupa.',
      security: 'Kesalahan subnet di firewall rule membuka akses berlebih — verifikasi tiap perhitungan dengan tool sebelum apply ke production.',
      challenge: 'Buat 5 soal subnetting sendiri (campuran level 1–3) beserta kunci jawabannya. Tukar dengan teman belajar — mengajar adalah cara tercepat menguasai.',
      interviewQ: 'Q: "Berapa subnet dan host untuk 192.168.1.0/27?" — A: Pinjam 3 bit dari /24 → 2³ = 8 subnet, tiap /27 = 30 usable host (2^5−2). Block size 32: network .0, .32, .64, ..., .224.',
      quiz: [
        { q: 'Block size untuk /27 adalah…', options: ['64', '32', '16', '128'], answer: 1, explain: 'Mask .224; 256 − 224 = 32.' },
        { q: 'Untuk tepat 1000 host, prefix yang tepat adalah…', options: ['/23 (510)', '/22 (1022)', '/24 (254)', '/21 (2046)'], answer: 1, explain: '2^10=1024 ≥ 1000 → /22; /23 hanya 510 < 1000.' },
        { q: 'Fungsi ipcalc dalam lab ini adalah…', options: ['Mencontek jawaban', 'Verifikator yang menunjukkan LANGKAH perhitungan untuk belajar', 'Mengganti kalkulator IP', 'DHCP server'], answer: 1, explain: 'Belajar dari langkahnya (biner, wildcard), bukan menghafal hasil.' },
      ],
    },
    {
      id: '4.17',
      title: 'Hands-On: Troubleshooting IP Address',
      body: `<p>80% tiket "tidak bisa konek" bermuara ke <b>5 kesalahan IP</b>. Lab ini melatihmu mengenali masing-masing dari gejalanya — seperti dokter mengenali penyakit dari gejala.</p>
<h3>Topologi</h3>
<pre>[PC-A] ── [Switch] ── [Router .20.1] ── [Server .30.10]
   VLAN 20 (seharusnya 192.168.20.x/24, gw .20.1)</pre>
<h3>Objective</h3>
<p>Untuk tiap skenario rusak: diagnosis &lt;3 menit dengan perintah yang tepat, perbaiki, verifikasi. Ikuti alur Topology → Objective → Configuration → Verification → Failure Injection → Troubleshooting → Fix → Final Verification.</p>
<h3>Lima Skenario (Failure Injection)</h3>
<div class="tblwrap"><table>
<tr><th>#</th><th>Injeksi</th><th>Gejala Khas</th><th>Diagnosis</th></tr>
<tr><td>1</td><td>IP salah network: 192.168.99.50/24</td><td>Tidak bisa ke siapa pun (termasuk gateway .20.1)</td><td><code>ipconfig</code> → network beda!</td></tr>
<tr><td>2</td><td>Duplikat IP dengan PC-B</td><td>Putus-sambung bergantian; OS warning "IP conflict"</td><td><code>arp -a</code> → MAC berflap; gratuitous ARP</td></tr>
<tr><td>3</td><td>Mask salah: /16 padahal /24</td><td>"Kadang bisa" — salah menentukan siapa tetangga</td><td>Bandingkan mask dengan IP plan</td></tr>
<tr><td>4</td><td>Gateway salah: .99</td><td>LAN OK, luar gagal (klasik!)</td><td><code>ipconfig</code> + ping gateway</td></tr>
<tr><td>5</td><td>DHCP mati → APIPA 169.254.x.x</td><td>Tidak bisa ke mana-mana kecuali sesama APIPA</td><td>IP 169.254 = vonis DHCP</td></tr>
</table></div>
<h3>Konfigurasi & Verifikasi Baseline</h3>
<pre># Catat baseline SEBELUM merusak (aturan emas!):
ipconfig /all        # Windows  → IP, mask, gateway, DNS, MAC, DHCP?
ip addr && ip route  # Linux    → sama + tabel routing</pre>
<h3>Troubleshooting (Alur per Skenario)</h3>
<pre># LANGKAH 1 — selalu: ipconfig/ip addr → baca 4 hal:
#   IP benar network? Mask sesuai plan? Gateway .1? DHCP/APIPA?
#
# Skenario 1 (salah network): ping gateway GAGAL + arp incomplete
#   → fix: kembalikan IP ke 192.168.20.x/24
# Skenario 2 (duplikat): ping kadang OK kadang RTO; arp -a MAC berubah-ubah
#   → fix: ganti salah satu IP; cek DHCP pool vs statis
# Skenario 3 (mask salah): ping "tetangga beda /26" aneh
#   → fix: samakan mask dengan IP plan (/24)
# Skenario 4 (gateway salah): ping LAN OK, ping 8.8.8.8 GAGAL
#   → fix: gateway → 192.168.20.1
# Skenario 5 (APIPA): ipconfig = 169.254.x.x
#   → fix: hidupkan DHCP server → ipconfig /renew</pre>
<h3>Fix & Final Verification</h3>
<p>Setelah tiap fix: ulangi <b>ping gateway → ping antar-VLAN → ping nama domain</b>. Tiga hijau = selesai. Dokumentasikan tiap skenario dalam format: <b>gejala → perintah → temuan → fix → verifikasi</b>.</p>
<div class="callout"><div class="t">Pola Pikir: Baca Dulu, Ubah Kemudian</div><p style="margin:4px 0 0"><code>ipconfig</code> adalah "anamnesis" dokter jaringan — 4 baris (IP, mask, gateway, DNS) menjawab 80% kasus. Jangan sentuh apa pun sebelum membacanya.</p></div>`,
      terms: [
        ['IP conflict', 'Duplikat IP: dua device berebut satu alamat; gejala putus-sambung.'],
        ['Anamnesis', 'Istilah medis: tanya-jawab awal sebelum diagnosis — analogi untuk ipconfig.'],
      ],
      scenario: 'NOC menerima 3 tiket bersamaan: "tidak bisa print" (duplikat IP printer!), "internet lambat" (mask salah di satu PC — broadcast aneh), "tidak bisa apa-apa" (APIPA — switch baru belum dikonfigurasi DHCP relay). Tiga akar masalah, satu pola diagnosis: baca ipconfig dulu. Selesai dalam 20 menit total.',
      bestPractices: 'Buat runbook "5 skenario IP" versi tim-mu dan latihkan ke setiap anggota baru — standarisasi diagnosis = MTTR konsisten.',
      security: 'Duplikat IP gateway (192.168.20.1 dipakai device jahat) = DoS seluruh VLAN. Monitor ARP untuk IP gateway dari MAC tak dikenal.',
      challenge: 'Minta teman menanam 2 skenario sekaligus tanpa memberitahumu. Diagnosis dengan batas 5 menit. Catat: perintah apa yang paling menentukan?',
      interviewQ: 'Q: "Sebutkan 5 kesalahan konfigurasi IP dan gejalanya." — A: (1) Salah network — tidak bisa ke siapa pun; (2) Duplikat IP — putus-sambung bergantian; (3) Mask salah — perilaku "kadang bisa"; (4) Gateway salah — LAN OK luar gagal; (5) DHCP gagal/APIPA — 169.254.x.x. Diagnosis selalu mulai dari ipconfig.',
      quiz: [
        { q: 'PC bisa ping sesama LAN tapi gagal ke internet. Skenario yang PALING mungkin…', options: ['Duplikat IP', 'Gateway salah/mati', 'Mask salah', 'Kabel putus'], answer: 1, explain: 'Gejala klasik gateway: L2/L3 lokal sehat, pintu keluar bermasalah.' },
        { q: 'Gejala "putus-sambung bergantian" + warning IP conflict menandakan…', options: ['APIPA', 'Duplikat IP', 'Gateway salah', 'DNS rusak'], answer: 1, explain: 'Dua device berebut satu IP; ARP table berflap antar dua MAC.' },
        { q: 'Langkah PERTAMA troubleshooting IP yang benar adalah…', options: ['Restart PC', 'Membaca ipconfig/ip addr (IP, mask, gateway, DNS)', 'Ganti kabel', 'Ping google.com'], answer: 1, explain: 'Baca dulu 4 baris kunci sebelum mengubah apa pun.' },
      ],
    },
  ],
  project: {
    title: 'Project Part 04 — IP Addressing Design Document (Portfolio)',
    html: `<div class="proj">
<h3>Project Part 04 — IP Addressing Design Document</h3>
<p><b>Tugasmu:</b> buat <b>dokumen perencanaan IP lengkap</b> untuk kantor fiktif 3 lantai (tiap lantai: 80 user, 10 CCTV, 1 printer, 2 AP) + ruang server (10 server) + Wi-Fi tamu — memakai prinsip Part 04 (subnetting/VLSM, zona, konvensi).</p>
<p><b>Isi dokumen (ip-design.md):</b></p>
<ol>
<li>Tabel IP plan per VLAN mengikuti template 4.15 (subnet, gateway, zona infra/statis/DHCP pool, pemilik).</li>
<li>Perhitungan subnetting/VLSM-mu: tunjukkan langkah (bukan cuma hasil) — boleh dari satu blok /22 atau /23.</li>
<li>Alasan pemilihan tiap prefix (mengapa /24 untuk user, /30 untuk link, dst) + cadangan yang disisakan.</li>
<li>Hasil hands-on 4.16: 9 soal + jawabanmu (boleh lampirkan sebagai file terpisah <code>subnetting-answers.md</code>).</li>
<li>Satu skenario troubleshooting (4.17) yang kamu praktikkan: gejala → perintah → temuan → fix → verifikasi.</li>
</ol>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Di repository <code>network-engineer-lab</code>, buat folder <code>part-04-ipv4-addressing/</code>.</span></li>
<li><span class="n">2</span><span>Isi dengan <code>README.md</code> (ringkasan desain) dan <code>ip-design.md</code> (+ <code>subnetting-answers.md</code> opsional).</span></li>
<li><span class="n">3</span><span>Commit <code>"Part 04: IP addressing design"</code> lalu push.</span></li>
</ol>
<p><b>Kriteria selesai:</b> semua kebutuhan terakomodasi tanpa overlap, perhitungan VLSM benar & terverifikasi (ipcalc), zona konsisten (.1 gateway, pool di luar statis), ada cadangan, dan 1 skenario troubleshooting terdokumentasi.</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 04</div>
<p style="margin:6px 0 0">1) Berapa usable host /27? &nbsp;2) Sebutkan 3 rentang private IP. &nbsp;3) PC dapat 169.254.x.x — apa artinya? &nbsp;4) Bedakan subnetting dan VLSM. &nbsp;5) Apa itu route summarization? — Kuasai kelimanya sebelum lanjut ke Part 05 (IPv6).</p></div>`,
  },
};
