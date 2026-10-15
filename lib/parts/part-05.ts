// Part 05 — IPv6.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
import type { Part } from './types';

export const part05: Part = {
  id: '05',
  number: 'PART 05',
  title: 'IPv6',
  phaseId: 'fase-1',
  description: 'Alamat 128-bit, jenis-jenis alamat IPv6, Neighbor Discovery, SLAAC/DHCPv6, dan routing IPv6.',
  repoFolder: 'part-05-ipv6',
  objectives: [
    'Menjelaskan mengapa IPv6 dibutuhkan dan struktur alamat 128-bit beserta aturan penulisannya.',
    'Membedakan jenis alamat IPv6: global unicast, link-local, unique local, dan multicast.',
    'Menjelaskan Neighbor Discovery sebagai pengganti ARP serta cara kerja SLAAC dan DHCPv6.',
    'Membaca dan menulis static route IPv6 serta membandingkan IPv4 vs IPv6.',
    'Mengaktifkan dan memverifikasi IPv6 di host serta mendiagnosis masalah umum IPv6.',
  ],
  prerequisites: 'Part 04 — IPv4 Addressing (subnet, CIDR, gateway, private/public IP). Part 03 — ARP & multicast.',
  subbabs: [
    {
      id: '5.1',
      title: 'Mengapa IPv6?',
      body: `<p><b>IPv6</b> (<i>Internet Protocol version 6</i>) adalah penerus IPv4 dengan alamat <b>128-bit</b> — lahir karena satu fakta sederhana: <b>IPv4 habis</b>. 4,3 miliar alamat tidak cukup untuk miliaran HP, laptop, CCTV, sensor IoT, dan mobil yang semuanya butuh alamat.</p>
<h3>Tiga Alasan Utama</h3>
<ol>
<li><b>Kehabisan alamat:</b> alokasi IPv4 global habis di sebagian besar RIR sejak 2010-an. IPv6 menyediakan 2<sup>128</sup> ≈ <b>340 undecillion</b> alamat — cukup untuk setiap butir pasir di bumi punya ribuan alamat.</li>
<li><b>NAT adalah plester, bukan solusi:</b> NAT (Part 04) menyelamatkan IPv4 tapi merusak prinsip <i>end-to-end</i>: koneksi masuk sulit, troubleshooting rumit, beberapa aplikasi (VoIP, game P2P) tersiksa. IPv6 mengembalikan alamat unik per device — <b>tanpa NAT</b>.</li>
<li><b>Desain lebih baik:</b> header disederhanakan (router lebih cepat), <b>tidak ada broadcast</b> (diganti multicast yang sopan), <b>autokonfigurasi bawaan</b> (SLAAC — device dapat alamat sendiri tanpa DHCP!), dan IPsec dirancang masuk sejak awal.</li>
</ol>
<h3>Apakah IPv4 Akan Mati?</h3>
<p><b>Tidak dalam waktu dekat.</b> Dunia berjalan <b>dual-stack</b> (IPv4 + IPv6 bersamaan) — transisi puluhan tahun. Sebagai engineer, kamu <b>wajib bisa keduanya</b>: IPv4 untuk hari ini, IPv6 untuk esok (dan untuk lolos interview — "jelaskan IPv6" kini pertanyaan standar).</p>
<div class="callout blue"><div class="t">Fakta Lapangan Indonesia</div><p style="margin:4px 0 0">Adopsi IPv6 Indonesia masih bertahap — banyak ISP sudah menyediakan dual-stack. Di enterprise, IPv6 mulai wajib untuk infrastruktur baru (data center, 5G, IoT). Mempelajarinya sekarang = keunggulan kompetitif, bukan sekadar teori.</p></div>`,
      terms: [
        ['IPv6', 'Internet Protocol v6 — alamat 128-bit, pengganti IPv4; tanpa broadcast, tanpa NAT.'],
        ['Dual-stack', 'Menjalankan IPv4 dan IPv6 bersamaan di satu device/jaringan.'],
        ['End-to-end principle', 'Prinsip setiap device bisa berkomunikasi langsung — dirusak NAT, dipulihkan IPv6.'],
      ],
      diagram: `<pre>         MENGAPA IPv6? (3 ALASAN)

   IPv4: 32 bit  = 4,3 miliar alamat      → HABIS
   IPv6: 128 bit = 340.282.366.920.938.463.463.374.607.431.768.211.456 alamat
                 → "setiap atom di bumi bisa punya alamat"

   + Tanpa NAT (end-to-end kembali) + Tanpa broadcast
   + Autokonfigurasi (SLAAC) + Header sederhana</pre>`,
      scenario: 'Provider IoT butuh 50.000 alamat untuk sensor parkir di satu kota. Dengan IPv4: mustahil tanpa NAT berlapis yang rumit. Dengan IPv6: satu /64 memberi 18 quintillion alamat — alokasi selesai dalam 1 baris konfigurasi. Inilah "masalah yang diselesaikan" IPv6: skala yang tak terbayangkan di era IPv4.',
      bestPractices: 'Rencanakan IPv6 sejak desain baru (greenfield) — retrofit ke jaringan IPv4-only yang sudah besar jauh lebih mahal. "IPv6-ready" adalah checklist pengadaan device modern.',
      security: 'Jangan lupa: mengaktifkan IPv6 tanpa firewall IPv6 = membuka pintu belakang! Banyak insiden terjadi karena firewall hanya memfilter IPv4 sementara IPv6 terbuka lebar. Dual-stack = dual firewall policy.',
      challenge: 'Cek apakah komputermu sudah punya IPv6 (<code>ipconfig</code> / <code>ip -6 addr</code>). Catat alamatnya — di sub-bab 5.2 kamu akan bisa membacanya.',
      interviewQ: 'Q: "Mengapa dunia butuh IPv6 padahal NAT menyelamatkan IPv4?" — A: Tiga alasan: (1) IPv4 habis secara global; (2) NAT merusak end-to-end (koneksi masuk sulit, troubleshooting rumit); (3) IPv6 didesain lebih baik — header sederhana, tanpa broadcast, autokonfigurasi bawaan (SLAAC). NAT adalah plester darurat, bukan arsitektur.',
      quiz: [
        { q: 'Panjang alamat IPv6 adalah…', options: ['32 bit', '48 bit', '64 bit', '128 bit'], answer: 3, explain: 'IPv6 = 128 bit → ~340 undecillion alamat.' },
        { q: 'Kelemahan NAT yang diselesaikan IPv6 adalah…', options: ['NAT terlalu cepat', 'NAT merusak prinsip end-to-end dan menyulitkan koneksi masuk/troubleshooting', 'NAT terlalu murah', 'NAT tidak mendukung kabel'], answer: 1, explain: 'IPv6 memberi alamat unik per device — tanpa perlu translasi.' },
        { q: 'Strategi transisi yang dipakai dunia saat ini adalah…', options: ['Matikan IPv4 serentak', 'Dual-stack: IPv4 + IPv6 bersamaan', 'Hanya IPv6 untuk server', 'Kembali ke IPv3'], answer: 1, explain: 'Transisi bertahap puluhan tahun; engineer wajib kuasai keduanya.' },
      ],
    },
    {
      id: '5.2',
      title: 'IPv6 Address Structure',
      body: `<p>Alamat IPv6 ditulis sebagai <b>8 grup heksadesimal</b> (<i>hextet</i>), tiap 16 bit, dipisah titik-dua. Total 128 bit = 8 × 16.</p>
<h3>Format Dasar</h3>
<pre>2001:0db8:0000:0000:0000:ff00:0042:8329
└─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
 hextet (16 bit × 8 = 128 bit)</pre>
<h3>Dua Aturan Kompresi (Wajib Hafal!)</h3>
<ol>
<li><b>Hilangkan nol di depan</b> tiap hextet: <code>0db8</code> → <code>db8</code>, <code>0042</code> → <code>42</code>.</li>
<li><b><code>::</code> untuk SATU rangkaian hextet nol berurutan</b> (hanya boleh sekali!):<br>
<code>2001:0db8:0000:0000:0000:ff00:0042:8329</code><br>
→ <code>2001:db8::ff00:42:8329</code></li>
</ol>
<p><b>Mengapa <code>::</code> hanya sekali?</b> Karena dua <code>::</code> membuat alamat ambigu (tidak tahu tiap :: mewakili berapa grup nol). Aturan ini menjamin satu bentuk kompresi = satu alamat.</p>
<h3>Prefix IPv6</h3>
<p>Seperti CIDR di IPv4: <code>2001:db8:abcd:0010::/64</code> — <b>/64 adalah standar subnet IPv6</b> (selalu /64 untuk LAN! bukan /24). 64 bit pertama = network, 64 bit terakhir = <b>interface ID</b> (bagian host). <b>Alasan /64:</b> SLAAC membutuhkan 64 bit untuk interface ID (EUI-64) — memecahnya merusak autokonfigurasi.</p>
<div class="tblwrap"><table>
<tr><th>Notasi</th><th>Arti</th></tr>
<tr><td><code>::1</code></td><td>Loopback IPv6 (seperti 127.0.0.1)</td></tr>
<tr><td><code>::</code></td><td>Alamat tak tentu (0.0.0.0-nya IPv6)</td></tr>
<tr><td><code>2001:db8::/32</code></td><td>Rentang dokumentasi (seperti 192.0.2.0/24)</td></tr>
</table></div>
<div class="callout"><div class="t">Jangan Subnet IPv6 seperti IPv4!</div><p style="margin:4px 0 0">Godaan pemula: memecah /64 jadi /96 atau /120 "biar hemat" — <b>JANGAN</b>. Ruang IPv6 melimpah; /64 per LAN adalah standar yang ditunggu banyak fitur (SLAAC, privacy extension). Hemat-hemat alamat adalah pola pikir IPv4 yang tidak berlaku di sini.</p></div>`,
      terms: [
        ['Hextet', 'Satu grup 16-bit heksadesimal dalam alamat IPv6 (8 hextet = 128 bit).'],
        ['Kompresi IPv6', 'Aturan penyingkatan: hilangkan nol depan; :: untuk satu rangkaian nol (sekali saja).'],
        ['Interface ID', '64 bit terakhir alamat IPv6 — "bagian host".'],
        ['/64', 'Ukuran subnet standar IPv6 untuk LAN.'],
      ],
      diagram: `<pre>      STRUKTUR IPv6: 2001:db8:abcd:10::50/64

   ┌────── 64 bit: network prefix ──────┐┌─ 64 bit: interface ID ─┐
         2001:0db8:abcd:0010           ::              50
         (network — routing)              (host — EUI-64/SLAAC)

   Kompresi: 2001:0db8:abcd:0010:0000:0000:0000:0050
           → 2001:db8:abcd:10::50   (nol depan hilang, :: sekali)</pre>`,
      scenario: 'Engineer menulis <code>2001:db8::1::5</code> di dokumentasi — dua <code>::</code>! Tidak ada yang tahu alamat aslinya; konfigurasi di-copy ke router dan ditolak (invalid). Aturan "sekali saja" bukan formalitas — ia menjamin alamat bisa dibaca mesin dan manusia tanpa ambigu.',
      bestPractices: 'Tulis IPv6 selalu dalam bentuk terkompresi yang valid; gunakan huruf kecil konsisten. Untuk dokumentasi, cantumkan juga bentuk /64 prefix-nya.',
      security: 'Alamat IPv6 yang panjang membuat scanning buta (brute-force) praktis mustahil — keamanan melalui kelangkaan ruang. Tapi jangan andalkan itu: firewall tetap wajib.',
      challenge: 'Kompresikan: (a) fe80:0000:0000:0000:0202:b3ff:fe1e:8329, (b) 2001:0db8:0000:0000:0001:0000:0000:0001. Lalu kembangkan kembali <code>2001:db8::1</code> ke bentuk penuh.',
      interviewQ: 'Q: "Jelaskan aturan kompresi alamat IPv6." — A: Dua aturan: (1) hilangkan nol di depan tiap hextet (0db8→db8); (2) satu rangkaian hextet-nol berurutan boleh diganti :: — hanya sekali, karena dua :: membuat ambigu. Contoh: 2001:0db8:0000:0000:0000:ff00:0042:8329 → 2001:db8::ff00:42:8329.',
      quiz: [
        { q: 'Bentuk kompresi yang BENAR untuk 2001:0db8:0000:0000:0001:0000:0000:0001 adalah…', options: ['2001:db8::1::1', '2001:db8::1:0:0:1', '2001:db8:0:0:1::1', '2001:db8:1:1'], answer: 1, explain: ':: hanya untuk rangkaian nol TERPANJANG (5 grup pertama); sisanya ditulis penuh tanpa nol depan.' },
        { q: 'Ukuran subnet standar untuk LAN IPv6 adalah…', options: ['/24', '/64', '/128', '/48'], answer: 1, explain: '/64 standar — dibutuhkan SLAAC/EUI-64; jangan dipecah seperti IPv4.' },
        { q: 'Alamat ::1 setara dengan…', options: ['0.0.0.0', '127.0.0.1 (loopback)', '255.255.255.255', '192.168.1.1'], answer: 1, explain: '::1 = loopback IPv6, untuk uji stack lokal.' },
      ],
    },
    {
      id: '5.3',
      title: 'Global Unicast',
      body: `<p><b>Global Unicast Address (GUA)</b> adalah alamat IPv6 yang <b>routable di internet global</b> — padanan "public IP" di IPv4. Cirinya: diawali <code>2000::/3</code> (praktisnya yang kamu lihat diawali <code>2xxx:</code> atau <code>3xxx:</code>).</p>
<h3>Struktur GUA</h3>
<pre>2001:db8:abcd:0010::50/64
└─┬─┘└──┬──┘└──┬──┘└─┬─┘
 /3  RIR/ISP  Site  Subnet (VLAN!)
  │   │        │      │
  │   │        │      └─ 16 bit: 65.536 subnet per site — boros? TIDAK,
  │   │        │         ini standar. Satu VLAN = satu /64.
  │   │        └─ dialokasikan ke perusahaan/site
  │   └─ dialokasikan ke ISP oleh RIR
  └─ 2000::/3 = semua global unicast</pre>
<h3>Alokasi Praktis</h3>
<p>ISP biasanya memberi pelanggan <b>/56</b> (256 subnet /64!) atau <b>/48</b> (65.536 subnet). Bandingkan dengan IPv4 yang memberi /29 (8 alamat) — filosofinya terbalik: <b>di IPv6, alamat dibagi royal</b>.</p>
<h3>Di Lab Kurikulum (Dokumentasi)</h3>
<p>Untuk contoh GUA, pakai rentang dokumentasi <code>2001:db8::/32</code> (tidak akan pernah dipakai di internet nyata — aman untuk dokumen):</p>
<pre>VLAN 10 CCTV:  2001:db8:10::/64
VLAN 20 OFFICE: 2001:db8:20::/64
VLAN 30 SERVER: 2001:db8:30::/64
VLAN 40 GUEST:  2001:db8:40::/64
VLAN 99 MGMT:   2001:db8:99::/64</pre>
<div class="callout blue"><div class="t">Pola Penomoran Mnemonik</div><p style="margin:4px 0 0">Perhatikan: hextet ke-4 = nomor VLAN (10, 20, 30...). Pola ini membuat prefix mudah diingat dan mudah difilter di firewall — praktik yang sama dengan 192.168.<b>x</b>.0/24 di IPv4. Konsistensi desain lintas protokol!</p></div>`,
      terms: [
        ['Global Unicast (GUA)', 'Alamat IPv6 routable global (2000::/3) — padanan public IP.'],
        ['2001:db8::/32', 'Rentang IPv6 khusus dokumentasi/contoh — aman ditulis di dokumen.'],
      ],
      scenario: 'Perusahaan mendapat /48 dari ISP. Engineer membagi: /64 per VLAN di kantor pusat, /60 per cabang (16 subnet tiap cabang). Tidak ada lagi "minta tambah IP ke ISP" seperti era IPv4 — perencanaannya sekali untuk puluhan tahun. Inilah kemewahan ruang alamat IPv6.',
      bestPractices: 'Minta /48 (bukan /56) jika punya banyak site — hierarki yang rapi sejak awal. Dokumentasikan seperti IP plan IPv4.',
      security: 'GUA terekspos ke internet seperti public IPv4 — firewall IPv6 wajib dengan policy setara. "IPv6 kan baru, belum diserang" adalah mitos berbahaya.',
      challenge: 'Jika ISP memberimu 2001:db8:abcd::/48, tuliskan 5 prefix /64 untuk VLAN 10/20/30/40/99 mengikuti pola mnemonik di atas.',
      interviewQ: 'Q: "Apa itu Global Unicast dan berapa ukurannya?" — A: Alamat IPv6 routable global (2000::/3, diawali 2xxx:/3xxx:). Struktur: prefix global dari ISP, 16-bit subnet ID (satu VLAN = satu /64), 64-bit interface ID. ISP umumnya memberi /48 atau /56 per site.',
      quiz: [
        { q: 'Ciri alamat Global Unicast adalah…', options: ['Diawali fe80::', 'Diawali 2000::/3 (praktis 2xxx:/3xxx:)', 'Diawali ff00::', 'Diawali ::1'], answer: 1, explain: '2000::/3 = GUA; fe80::/10 = link-local; ff00::/8 = multicast.' },
        { q: 'Rentang IPv6 yang AMAN untuk dokumentasi/contoh adalah…', options: ['2001:db8::/32', '2001:4860::/32', 'fe80::/10', '::/0'], answer: 0, explain: '2001:db8::/32 dicadangkan untuk dokumentasi — tidak akan routing di internet.' },
        { q: 'Satu LAN IPv6 standar memakai prefix…', options: ['/24', '/64', '/120', '/32'], answer: 1, explain: '/64 per LAN — standar mutlak untuk SLAAC.' },
      ],
    },
    {
      id: '5.4',
      title: 'Link Local',
      body: `<p><b>Link-local address</b> (<code>fe80::/10</code>) adalah alamat IPv6 yang <b>otomatis ada di setiap interface yang aktif</b> — tanpa konfigurasi apa pun. Ia hanya berlaku <b>di link lokal</b> (tidak di-routing) dan menjadi fondasi banyak mekanisme IPv6.</p>
<h3>Ciri Khas</h3>
<pre>Contoh: fe80::8cec:4bff:fe12:9af3
        └─┬─┘
        fe80::/10 = link-local (10 bit pertama: 1111111010)

- Dibuat OTOMATIS saat interface up (dari MAC via EUI-64 atau acak).
- Tidak perlu DHCP, tidak perlu router — selalu ada.
- Tidak di-routing: hanya untuk "tetangga satu kabel".</pre>
<h3>Mengapa Penting? (Sangat!)</h3>
<ul>
<li><b>Neighbor Discovery</b> (pengganti ARP) berjalan di atas link-local.</li>
<li><b>Router memakai link-local sebagai next-hop</b> — routing table IPv6 penuh dengan <code>via fe80::...</code>. Gateway IPv6-mu kemungkinan besar adalah link-local router, bukan GUA!</li>
<li><b>Komunikasi darurat:</b> dua device tanpa konfigurasi apa pun tetap bisa ping via link-local (dengan <i>zone ID</i>: <code>ping fe80::1%eth0</code> — <i>mengapa %eth0?</i> karena fe80::1 bisa ada di BANYAK interface; zone ID menyatakan lewat interface mana).</li>
</ul>
<h3>EUI-64: Dari MAC ke Interface ID</h3>
<pre>MAC: 8C:EC:4B:12:9A:F3
Langkah: belah tengah → sisipkan FFFE → balik bit U/L
  8C:EC:4B → 8E:EC:4B  (bit U/L dibalik: 8C→8E)
  + FFFE +
  12:9A:F3
= interface ID: 8eec:4bff:fe12:9af3
= alamat: fe80::8eec:4bff:fe12:9af3</pre>
<p><b>Catatan privasi:</b> EUI-64 membocorkan MAC ke seluruh internet (bisa dilacak!). Karena itu OS modern memakai <b>privacy extensions</b> (alamat acak sementara) untuk koneksi keluar — detail di 5.8.</p>`,
      terms: [
        ['Link-local', 'fe80::/10 — alamat otomatis per interface; hanya satu link; fondasi NDP & next-hop.'],
        ['EUI-64', 'Metode membuat interface ID 64-bit dari MAC (sisip FFFE + balik bit U/L).'],
        ['Zone ID', 'Penanda interface (%eth0) saat memakai link-local — karena alamatnya tidak unik antar-link.'],
        ['Privacy extensions', 'Alamat IPv6 acak sementara agar MAC/EUI-64 tidak bisa dilacak.'],
      ],
      diagram: `<pre>       LINK-LOCAL: SELALU ADA, TAK PERLU KONFIGURASI

   [PC] fe80::a        [Router] fe80::1
     ──────── link ────────
     ping fe80::1%eth0  ✓  (tanpa DHCP, tanpa GUA, tetap bisa!)

   Routing table IPv6:
   ::/0 via fe80::1     ← next-hop = LINK-LOCAL router!</pre>`,
      scenario: 'Router diganti, GUA-nya berubah — tapi routing statis tetangga memakai next-hop link-local (fe80::1) yang <b>tetap sama</b> (dibuat dari MAC baru? tidak — dikonfigurasi manual). Inilah praktik terbaik: next-hop link-local yang dikonfigurasi statis membuat topologi tahan terhadap perubahan GUA.',
      bestPractices: 'Untuk next-hop routing IPv6, pakai link-local (stabil) — bukan GUA yang bisa berubah saat renumbering ISP.',
      security: 'EUI-64 membocorkan MAC permanen → aktifkan privacy extensions di client. Di server, justru EUI-64/statis memudahkan inventarisasi.',
      challenge: 'Lihat link-local komputermu (<code>ip -6 addr</code>). Apakah interface ID-nya terlihat seperti EUI-64 (ada "ff:fe" di tengah) atau acak (privacy extension)?',
      interviewQ: 'Q: "Apa itu link-local dan mengapa ia penting?" — A: fe80::/10, otomatis di setiap interface aktif, tidak di-routing. Penting karena: (1) fondasi Neighbor Discovery (pengganti ARP), (2) dipakai sebagai next-hop di routing table IPv6, (3) memungkinkan komunikasi darurat tanpa konfigurasi apa pun.',
      quiz: [
        { q: 'Prefix link-local IPv6 adalah…', options: ['2000::/3', 'fe80::/10', 'ff00::/8', 'fc00::/7'], answer: 1, explain: 'fe80::/10 = link-local; otomatis, tidak di-routing.' },
        { q: 'Dalam routing table IPv6, next-hop umumnya berupa…', options: ['Global unicast', 'Link-local router (fe80::...)', 'Multicast', 'Broadcast'], answer: 1, explain: 'Next-hop = tetangga satu link → link-local sudah cukup & stabil.' },
        { q: 'Masalah privasi EUI-64 adalah…', options: ['Terlalu pendek', 'Membocorkan MAC permanen sehingga device bisa dilacak', 'Tidak bisa di-routing', 'Terlalu acak'], answer: 1, explain: 'Interface ID turunan MAC = identitas permanen; solusinya privacy extensions.' },
      ],
    },
    {
      id: '5.5',
      title: 'Unique Local Address',
      body: `<p><b>Unique Local Address (ULA)</b> (<code>fc00::/7</code>, praktisnya <code>fd00::/8</code>) adalah padanan <b>"private IP"</b> di IPv6: untuk jaringan internal, <b>tidak di-routing di internet global</b>.</p>
<h3>Struktur ULA</h3>
<pre>fd12:3456:789a:0010::50/64
└┬┘└──┬───┘└──┬──┘└─┬─┘
fd  random    site subnet
 │  40 bit:   16 bit:  16 bit:
 │  Global ID Site ID  Subnet ID (← nomor VLAN di sini!)
 │  (acak saat dibuat — membuat ULA unik sedunia)
 └─ fd00::/8 = locally assigned (acak sendiri)</pre>
<p><b>Mengapa Global ID acak?</b> Agar dua perusahaan yang merger (keduanya pakai ULA) kemungkinan konfliknya astronomis kecil — memperbaiki kelemahan RFC 1918 di IPv4 (pelajaran 4.7)! Generate sekali di sini: prinsipnya seperti UUID.</p>
<h3>ULA Plan Kurikulum (Standar!)</h3>
<div class="tblwrap"><table>
<tr><th>VLAN</th><th>ULA /64</th><th>Contoh Host</th></tr>
<tr><td>10 CCTV</td><td><code>fd12:3456:789a:10::/64</code></td><td>NVR: fd12:3456:789a:10::10</td></tr>
<tr><td>20 OFFICE</td><td><code>fd12:3456:789a:20::/64</code></td><td>PC: fd12:3456:789a:20::50</td></tr>
<tr><td>30 SERVER</td><td><code>fd12:3456:789a:30::/64</code></td><td>Web: fd12:3456:789a:30::10</td></tr>
<tr><td>40 GUEST</td><td><code>fd12:3456:789a:40::/64</code></td><td>DHCPv6 pool</td></tr>
<tr><td>99 MGMT</td><td><code>fd12:3456:789a:99::/64</code></td><td>Switch: fd12:3456:789a:99::2</td></tr>
</table></div>
<p>Pola <b>mnemonik</b> dipertahankan: subnet ID = nomor VLAN, host ID pendek (::10, ::50). Gateway tiap VLAN: link-local <code>fe80::1</code> (atau ULA <code>::1</code>). <b>Desain ini dipakai konsisten</b> di semua lab IPv6 kurikulum — jangan ubah sembarangan.</p>`,
      terms: [
        ['ULA', 'Unique Local Address (fc00::/7) — "private IP"-nya IPv6; Global ID acak agar unik.'],
        ['Global ID', '40-bit acak di ULA yang membuatnya (hampir pasti) unik sedunia.'],
      ],
      scenario: 'Dua perusahaan merger — keduanya memakai ULA dengan Global ID acak berbeda. Tidak ada konflik seperti tragedi 192.168.1.0/24 di IPv4! Inilah desain yang belajar dari sejarah: keacakan 40-bit membuat tabrakan praktis mustahil.',
      bestPractices: 'Gunakan ULA untuk semua komunikasi internal (seperti private IPv4), GUA hanya jika butuh dijangkau internet. Dual alamat (ULA+GUA) per host adalah pola umum.',
      security: 'ULA tidak otomatis aman — ia tetap butuh firewall antar-VLAN seperti IPv4 private. "Local" ≠ "aman".',
      challenge: 'Tulis alamat ULA lengkap untuk: gateway VLAN 20, PC lab VLAN 20, server DNS VLAN 30 — mengikuti pola tabel di atas.',
      interviewQ: 'Q: "Apa itu ULA dan apa keunggulannya atas private IPv4?" — A: ULA (fc00::/7, praktis fd00::/8) = private-nya IPv6. Keunggulan: 40-bit Global ID acak membuatnya hampir pasti unik sedunia — menghilangkan masalah overlap saat merger yang menjadi momok RFC 1918.',
      quiz: [
        { q: 'Prefix ULA yang dipakai praktis adalah…', options: ['2000::/3', 'fe80::/10', 'fd00::/8', 'ff00::/8'], answer: 2, explain: 'fc00::/7; fd00::/8 = locally assigned (acak sendiri).' },
        { q: 'Fungsi 40-bit Global ID acak pada ULA adalah…', options: ['Enkripsi', 'Membuat ULA (hampir pasti) unik sedunia — anti konflik saat merger', 'Mempercepat routing', 'Mengganti MAC'], answer: 1, explain: 'Keacakan = keunikan; pelajaran dari tragedi overlap RFC 1918.' },
        { q: 'Sesuai desain kurikulum, subnet ULA untuk VLAN 30 SERVER adalah…', options: ['fd12:3456:789a:20::/64', 'fd12:3456:789a:30::/64', 'fd12:3456:789a:99::/64', '2001:db8:30::/64'], answer: 1, explain: 'Pola mnemonik: subnet ID = nomor VLAN; 2001:db8 hanya untuk dokumentasi.' },
      ],
    },
    {
      id: '5.6',
      title: 'Multicast',
      body: `<p>Di IPv6, <b>multicast</b> (<code>ff00::/8</code>) naik pangkat: karena <b>broadcast DIHAPUS TOTAL</b>, semua fungsi "ke semua orang" digantikan multicast yang lebih sopan (hanya yang berminat).</p>
<h3>Struktur Alamat Multicast</h3>
<pre>ff02::1
└┬┘└┬┘└┬┘
 │  │  └─ Group ID (1 = semua node)
 │  └─ Scope: 1=interface, 2=link, 5=site, e=global
 └─ ff = multicast</pre>
<h3>Grup Penting (Hafal!)</h3>
<div class="tblwrap"><table>
<tr><th>Alamat</th><th>Arti</th><th>Pengganti dari IPv4</th></tr>
<tr><td><code>ff02::1</code></td><td>Semua node di link</td><td>Broadcast (tapi sopan)</td></tr>
<tr><td><code>ff02::2</code></td><td>Semua router di link</td><td>—</td></tr>
<tr><td><code>ff02::1:ffxx:xxxx</code></td><td><b>Solicited-node</b> (grup per alamat!)</td><td>ARP broadcast</td></tr>
</table></div>
<h3>Solicited-Node: ARP yang Sopan</h3>
<p>Alih-alih broadcast "siapa pemilik IP ini?" ke <b>semua</b> host, IPv6 bertanya ke <b>grup kecil</b>: <code>ff02::1:ffXX:XXXX</code> (24 bit terakhir IP target). Hanya host yang 24-bit terakhirnya cocok yang memproses — <b>gangguan CPU minimal</b>. Inilah cara Neighbor Discovery (5.7) menggantikan ARP tanpa broadcast.</p>
<div class="callout blue"><div class="t">Filosofi IPv6</div><p style="margin:4px 0 0">Setiap keputusan IPv6 bertanya: "bisakah ini tidak mengganggu yang tidak berkepentingan?" Broadcast mengganggu semua → hapus. ARP broadcast → ganti solicited-node multicast. Hasilnya: jaringan yang lebih tenang dan hemat CPU di skala besar.</p></div>`,
      terms: [
        ['Multicast IPv6', 'ff00::/8 — pengganti broadcast; hanya grup yang berminat menerima.'],
        ['Solicited-node', 'Grup multicast per alamat (ff02::1:ffxx:xxxx) — mekanisme NDP pengganti ARP.'],
        ['Scope', 'Batasan jangkauan multicast: link (2), site (5), global (e).'],
      ],
      scenario: 'Switch dengan 200 host: satu ARP request IPv4 membangunkan 200 CPU. Satu Neighbor Solicitation IPv6 hanya membangunkan segelintir host yang cocok 24-bit terakhirnya. Di data center 10.000 host, perbedaan ini = penghematan CPU nyata di semua server. Skala membuat desain "sopan" menjadi kebutuhan, bukan kemewahan.',
      bestPractices: 'Pastikan switch mendukung MLD snooping (padanan IGMP snooping untuk IPv6) agar multicast tidak membanjiri semua port.',
      security: 'Multicast NDP bisa disalahgunakan seperti ARP (spoofing) — mitigasi: RA Guard & NDP inspection di switch (seperti DAI untuk IPv4).',
      challenge: 'Untuk alamat target <code>2001:db8::50</code>, tuliskan alamat solicited-node multicast-nya. (Petunjuk: ambil 24 bit terakhir.)',
      interviewQ: 'Q: "Bagaimana IPv6 menggantikan ARP tanpa broadcast?" — A: Dengan Neighbor Discovery memakai solicited-node multicast (ff02::1:ffxx:xxxx): NS dikirim ke grup kecil berdasarkan 24-bit terakhir IP target — hanya kandidat yang memproses, bukan seluruh LAN. Sopan, tanpa broadcast.',
      quiz: [
        { q: 'Prefix multicast IPv6 adalah…', options: ['fe80::/10', 'ff00::/8', '2000::/3', 'fc00::/7'], answer: 1, explain: 'ff00::/8 = multicast; broadcast tidak ada di IPv6.' },
        { q: 'Alamat ff02::1 artinya…', options: ['Semua router', 'Semua node di link lokal', 'Loopback', 'DNS server'], answer: 1, explain: 'ff02::1 = all-nodes link-local; ff02::2 = all-routers.' },
        { q: 'Keunggulan solicited-node multicast dibanding ARP broadcast adalah…', options: ['Lebih cepat diketik', 'Hanya host yang 24-bit terakhirnya cocok yang terganggu — hemat CPU', 'Tanpa alamat', 'Bekerja di internet'], answer: 1, explain: 'Multicast ter-target vs broadcast ke semua — filosofi "sopan" IPv6.' },
      ],
    },
    {
      id: '5.7',
      title: 'IPv6 Neighbor Discovery',
      body: `<p><b>NDP</b> (<i>Neighbor Discovery Protocol</i>) adalah <b>"ARP-nya IPv6 — dan lebih"</b>: seperangkat pesan <b>ICMPv6</b> yang mengurusi penemuan tetangga, router, dan duplikat alamat — <b>tanpa broadcast</b>.</p>
<h3>Lima Pesan NDP (Hafal Pasangannya!)</h3>
<div class="tblwrap"><table>
<tr><th>Pesan</th><th>Arti</th><th>Padanan IPv4</th></tr>
<tr><td><b>RS</b> (Router Solicitation)</td><td>"Ada router di sini?" → ke ff02::2</td><td>— (baru!)</td></tr>
<tr><td><b>RA</b> (Router Advertisement)</td><td>"Saya router; prefix-nya ini; gateway saya" (berkala)</td><td>— (baru!)</td></tr>
<tr><td><b>NS</b> (Neighbor Solicitation)</td><td>"Siapa pemilik IPv6 ini?" → solicited-node multicast</td><td>ARP request</td></tr>
<tr><td><b>NA</b> (Neighbor Advertisement)</td><td>"Saya pemiliknya, MAC saya ini" (unicast)</td><td>ARP reply</td></tr>
</table></div>
<p>Plus satu mekanisme: <b>DAD</b> (<i>Duplicate Address Detection</i>) — sebelum memakai alamat baru, host mengirim NS untuk alamatnya sendiri: jika ada NA balasan = <b>duplikat!</b> → alamat tidak dipakai. (IPv4: gratuitous ARP melakukan hal serupa.)</p>
<h3>Alur Lengkap Host Baru</h3>
<pre>1. Interface up → buat link-local (fe80::...) → DAD ✓
2. Kirim RS ke ff02::2 (semua router): "tolong info!"
3. Router balas RA: "prefix 2001:db8:20::/64, gateway = saya (fe80::1),
   flag: pakai SLAAC / DHCPv6?"
4. Host bentuk alamat (SLAAC/DHCPv6) → DAD lagi ✓
5. Butuh MAC tetangga? → NS (solicited-node) → NA ✓</pre>
<p><b>Mengapa ini elegan?</b> Satu protokol (ICMPv6) menggantikan ARP + sebagian DHCP + router discovery — dan semuanya multicast/unicast, tanpa satu broadcast pun.</p>
<div class="callout"><div class="t">ICMPv6 ≠ ICMP Biasa</div><p style="margin:4px 0 0"><b>JANGAN blokir ICMPv6 total!</b> Di IPv4, blokir ICMP masih "bisa hidup". Di IPv6, ICMPv6 adalah <b>infrastruktur vital</b> (NDP, PMTU discovery) — memblokirnya = memutus IPv6 itu sendiri. Filter secukupnya, jangan dibabat.</p></div>`,
      terms: [
        ['NDP', 'Neighbor Discovery Protocol — pesan ICMPv6 pengganti ARP + discovery router.'],
        ['RS/RA', 'Router Solicitation / Advertisement — host mencari & router mengumumkan diri.'],
        ['NS/NA', 'Neighbor Solicitation / Advertisement — padanan ARP request/reply via multicast.'],
        ['DAD', 'Duplicate Address Detection — memastikan alamat baru tidak duplikat.'],
        ['ICMPv6', 'Versi ICMP untuk IPv6 — jauh lebih vital (jangan diblokir total!).'],
      ],
      diagram: `<pre>         NDP: PERCAKAPAN HOST BARU (tanpa broadcast!)

   Host baru                  Router (fe80::1)
     ── RS ──▶▶ ff02::2 (semua router): "ada router?"
     ◀── RA ── "ya! prefix 2001:db8:20::/64, gw = saya"
     ── NS ──▶▶ solicited-node: "siapa pemilik ...::50?"
     ◀── NA ── (unicast): "saya! MAC saya BB:BB:.."
     DAD ✓ → alamat dipakai

   Semua via multicast/unicast — NOL broadcast.</pre>`,
      scenario: 'Migrasi ke IPv6, user komplain "kadang tidak dapat alamat". Ternyata RA dari router terblokir ACL lama yang dibuat untuk IPv4-thinking ("blokir semua ICMP"). Host tidak pernah tahu prefix & gateway. Solusi: izinkan ICMPv6 RS/RA/NS/NA. Pelajaran: pola pikir IPv4 tidak bisa di-copy-paste mentah ke IPv6.',
      bestPractices: 'Di firewall IPv6, selalu izinkan pesan NDP esensial (RS, RA, NS, NA) di link lokal — lalu filter sisanya. Dan aktifkan RA Guard di switch (Part 29).',
      security: '<b>Rogue RA</b> = rogue DHCP-nya IPv6: penyerang mengirim RA palsu ("gateway = saya!") → traffic dibelokkan. Mitigasi: <b>RA Guard</b> di switch — hanya port uplink boleh mengirim RA.',
      challenge: 'Jelaskan perbedaan RS/RA vs NS/NA dalam satu kalimat masing-masing: siapa bertanya, siapa menjawab, untuk apa?',
      interviewQ: 'Q: "Jelaskan 5 pesan NDP dan padanannya di IPv4." — A: RS ("ada router?") & RA ("ini prefix & gateway saya") — tidak ada padanan langsung (baru di IPv6); NS/NA = ARP request/reply tapi via solicited-node multicast; plus DAD (deteksi duplikat, mirip gratuitous ARP). Semuanya ICMPv6, tanpa broadcast.',
      quiz: [
        { q: 'Pasangan pesan NDP yang setara ARP request/reply adalah…', options: ['RS/RA', 'NS/NA (via solicited-node multicast)', 'DAD/ICMP', 'RA/RS'], answer: 1, explain: 'NS = "siapa pemilik IP ini?", NA = jawabannya — seperti ARP, tapi multicast.' },
        { q: 'Fungsi Router Advertisement (RA) adalah…', options: ['Meminta alamat ke host', 'Mengumumkan: prefix network, gateway (dirinya), dan flag SLAAC/DHCPv6', 'Menggantikan DNS', 'Memblokir rogue'], answer: 1, explain: 'RA = "saya router di link ini; pakai prefix ini; gateway = saya".' },
        { q: 'Mengapa memblokir total ICMPv6 berbahaya?', options: ['Tidak berbahaya', 'ICMPv6 adalah infrastruktur vital IPv6 (NDP, PMTU) — diblokir = IPv6 mati', 'Hanya memperlambat', 'Melanggar hukum'], answer: 1, explain: 'Beda dengan IPv4: NDP berjalan di atas ICMPv6.' },
      ],
    },
    {
      id: '5.8',
      title: 'SLAAC',
      body: `<p><b>SLAAC</b> (<i>Stateless Address Autoconfiguration</i>) adalah "sihir" IPv6: <b>host membuat alamat global-nya SENDIRI</b> — tanpa server DHCP! Cukup dengar RA dari router, gabungkan prefix + interface ID, jadi.</p>
<h3>Cara Kerja (3 Langkah)</h3>
<pre>1. Router kirim RA: "prefix = 2001:db8:20::/64" (+ flag A=1: "silakan SLAAC")
2. Host: prefix + interface ID (EUI-64 dari MAC / acak) =
         2001:db8:20::8eec:4bff:fe12:9af3
3. DAD (via NS) → tidak duplikat → PAKAI ✓
   Gateway? = link-local router pengirim RA (fe80::1) ✓
   DNS? → dari RA (RDNSS option) atau DHCPv6 stateless</pre>
<h3>Stateless vs Stateful</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>SLAAC (stateless)</th><th>DHCPv6 (stateful)</th></tr>
<tr><td>Server</td><td>Tidak perlu — router cukup</td><td>Perlu DHCPv6 server</td></tr>
<tr><td>Siapa memilih alamat</td><td>Host sendiri</td><td>Server</td></tr>
<tr><td>Kontrol admin</td><td>Rendah (acak/EUI-64)</td><td>Tinggi (tetap, tercatat)</td></tr>
<tr><td>Cocok untuk</td><td>User, tamu, IoT</td><td>Server, printer (butuh tetap)</td></tr>
</table></div>
<h3>Flag RA: Siapa Berkuasa?</h3>
<p>Router mengatur via flag di RA: <b>A=1</b> (boleh SLAAC), <b>M=1</b> ("managed" → pakai DHCPv6 stateful), <b>O=1</b> ("other" → SLAAC untuk alamat, DHCPv6 hanya untuk DNS/dll). Kombinasi umum: A+O (SLAAC + DHCPv6 stateless untuk DNS).</p>
<div class="callout blue"><div class="t">Privasi: Jangan Lacak Saya!</div><p style="margin:4px 0 0">EUI-64 = MAC terlihat di alamat global = bisa dilacak antar-jaringan. OS modern default memakai <b>privacy extensions</b> (RFC 4941): interface ID acak yang berganti berkala untuk koneksi keluar — alamat "tetap"-mu hanya untuk koneksi masuk. Server memakai statis/EUI-64 agar mudah ditemukan.</p></div>`,
      terms: [
        ['SLAAC', 'Stateless Address Autoconfiguration — host membuat alamat sendiri dari RA.'],
        ['Stateless/stateful', 'Tanpa/menyimpan status alokasi di server.'],
        ['Flag M/O/A', 'Bit di RA: Managed (DHCPv6 penuh), Other (DHCPv6 info saja), Autonomous (SLAAC).'],
        ['RDNSS', 'Opsi RA yang memberi tahu alamat DNS server.'],
      ],
      scenario: 'Kafe memasang Wi-Fi IPv6: tanpa server DHCP apa pun, 100 HP tamu langsung dapat alamat global + internet — hanya dari RA router. Biaya operasional NOL untuk pengalamatan. Inilah "plug & play" yang dijanjikan IPv6 — mustahil di IPv4 tanpa DHCP server.',
      bestPractices: 'Server/printer: DHCPv6 reservation atau statis (butuh alamat tetap & tercatat). Client/tamu: SLAAC (nol administrasi). Pilihan = trade-off kontrol vs kemudahan.',
      security: 'SLAAC memudahkan juga bagi device liar (sama seperti DHCP). Kontrol akses tetap di NAC/802.1X, bukan di mekanisme pengalamatan.',
      challenge: 'Router mengirim RA dengan prefix 2001:db8:20::/64 dan MAC host 8C:EC:4B:12:9A:F3. Tulis alamat SLAAC lengkap host itu (gunakan EUI-64 dari 5.4).',
      interviewQ: 'Q: "Jelaskan SLAAC dan bedanya dengan DHCP." — A: SLAAC: host membuat alamat sendiri dari prefix di RA + interface ID (EUI-64/acak), tanpa server — stateless. DHCP(v6): server yang memberi & mencatat — stateful, terkontrol. Flag RA (M/O/A) menentukan kombinasi yang dipakai.',
      quiz: [
        { q: 'SLAAC memungkinkan host…', options: ['Meminta IP ke DHCP', 'Membuat alamat IPv6 sendiri dari prefix RA + interface ID', 'Tanpa alamat sama sekali', 'Memakai IPv4'], answer: 1, explain: 'Stateless: dengar RA → gabung prefix + EUI-64/acak → DAD → pakai.' },
        { q: 'Flag RA "M=1" artinya…', options: ['Boleh SLAAC', 'Managed: pakai DHCPv6 stateful untuk alamat', 'Matikan IPv6', 'Multicast saja'], answer: 1, explain: 'M=managed → alamat dari DHCPv6 server (terkontrol).' },
        { q: 'Untuk server yang butuh alamat tetap & tercatat, pilih…', options: ['SLAAC dengan privacy extension', 'DHCPv6 stateful/reservation atau statis', 'APIPA', 'Link-local saja'], answer: 1, explain: 'SLAAC acak tidak cocok untuk server; butuh alokasi terkontrol.' },
      ],
    },
    {
      id: '5.9',
      title: 'DHCPv6',
      body: `<p><b>DHCPv6</b> adalah DHCP untuk IPv6 — tetapi dengan peran yang <b>berbeda</b>: karena SLAAC sudah menangani alamat, DHCPv6 sering hanya memberi <b>info tambahan</b> (DNS!) atau dipakai saat admin butuh <b>kontrol penuh</b>.</p>
<h3>Dua Mode</h3>
<div class="tblwrap"><table>
<tr><th>Mode</th><th>Memberi</th><th>Kapan Dipakai</th></tr>
<tr><td><b>Stateless</b> (O=1)</td><td>Hanya info: DNS, domain search</td><td>Kombinasi dengan SLAAC — umum!</td></tr>
<tr><td><b>Stateful</b> (M=1)</td><td>Alamat + info (seperti DHCPv4)</td><td>Server/printer — butuh alamat tetap & tercatat</td></tr>
</table></div>
<h3>Perbedaan Penting dari DHCPv4</h3>
<ul>
<li><b>Tidak pakai broadcast!</b> DHCPv6 memakai <b>multicast</b> <code>ff02::1:2</code> (semua DHCP server/relay di link). Konsisten dengan filosofi IPv6.</li>
<li><b>Port UDP 546 (client) / 547 (server)</b> — beda dari 67/68.</li>
<li><b>Tidak memberi gateway!</b> Gateway selalu dari RA (link-local router). DHCPv6 tidak mengurusi default route — perbedaan fundamental vs DHCPv4.</li>
<li>Client diidentifikasi via <b>DUID</b> (<i>DHCP Unique Identifier</i>), bukan MAC — karena satu host bisa punya banyak alamat.</li>
</ul>
<pre>Alur tipikal (stateless + SLAAC):
  Host ──RS──▶ Router ──RA──▶ Host: "prefix ..., O=1, DNS tanya DHCPv6"
  Host ──DHCPv6 Solicit (multicast ff02::1:2)──▶ Server
  Server ──Reply──▶ Host: "DNS = 2001:db8:30::5" ✓</pre>`,
      terms: [
        ['DHCPv6', 'DHCP untuk IPv6: stateless (info saja) atau stateful (alamat+info); multicast; UDP 546/547.'],
        ['DUID', 'DHCP Unique Identifier — identitas client DHCPv6 (bukan MAC).'],
      ],
      scenario: 'Enterprise mengaktifkan IPv6: user pakai SLAAC (nol admin), tapi butuh DNS internal & domain search — DHCPv6 stateless melayani info itu. Server pakai DHCPv6 stateful dengan reservation (tercatat di IPAM). Tiga mekanisme (SLAAC + stateless + stateful) hidup berdampingan, diatur flag RA per VLAN. Inilah desain IPv6 dewasa.',
      bestPractices: 'Pola umum: VLAN user = SLAAC + stateless (DNS); VLAN server = stateful/reservation atau statis. Atur flag RA sesuai per VLAN.',
      security: 'DHCPv6 juga rentan rogue server — proteksi DHCPv6 snooping di switch, seperti DHCPv4.',
      challenge: 'Jelaskan mengapa DHCPv6 TIDAK memberi default gateway. Ke mana host mencari gateway di IPv6?',
      interviewQ: 'Q: "Apa beda DHCPv6 dengan DHCPv4?" — A: (1) DHCPv6 tidak memberi gateway — gateway dari RA; (2) memakai multicast ff02::1:2, bukan broadcast; (3) dua mode: stateless (info saja, umum dengan SLAAC) & stateful (alamat+info); (4) port 546/547; (5) identitas client via DUID, bukan MAC.',
      quiz: [
        { q: 'Dalam IPv6, default gateway diperoleh dari…', options: ['DHCPv6', 'Router Advertisement (RA)', 'DNS', 'Broadcast'], answer: 1, explain: 'RA memberi prefix + gateway (link-local router); DHCPv6 tidak mengurusi gateway.' },
        { q: 'DHCPv6 berkomunikasi via…', options: ['Broadcast', 'Multicast ff02::1:2', 'Unicast ke 8.8.8.8', 'ARP'], answer: 1, explain: 'Tanpa broadcast di IPv6 — multicast ke grup DHCP server/relay.' },
        { q: 'Mode DHCPv6 yang memberi HANYA info (DNS) sementara alamat dari SLAAC adalah…', options: ['Stateful', 'Stateless', 'Managed', 'Relay'], answer: 1, explain: 'Stateless (flag O): alamat dari SLAAC, info tambahan dari DHCPv6.' },
      ],
    },
    {
      id: '5.10',
      title: 'IPv6 Routing',
      body: `<p>Routing IPv6 <b>persis</b> seperti IPv4 secara konsep (longest prefix match, static/dynamic) — hanya notasi dan next-hop-nya yang khas IPv6. Jika kamu paham routing IPv4, kamu sudah 80% paham.</p>
<h3>Static Route IPv6</h3>
<pre># Contoh umum (Linux/Cisco-like):
# "network fd12:3456:789a:30::/64 bisa dicapai via fe80::1"

Linux:
sudo ip -6 route add fd12:3456:789a:30::/64 via fe80::1 dev eth0
# Mengapa via link-local? → tetangga satu link; stabil (5.4).
# Mengapa dev eth0? → link-local butuh zone/interface yang jelas.

Cisco IOS:
ipv6 route fd12:3456:789a:30::/64 fe80::1
# Mengapa: sintaks sama dengan IPv4, hanya alamatnya IPv6.</pre>
<h3>Default Route & Tabel</h3>
<pre># Default route IPv6: ::/0 (padanan 0.0.0.0/0)
sudo ip -6 route add default via fe80::1 dev eth0

$ ip -6 route show
fd12:3456:789a:20::/64 dev eth0 proto kernel   ← directly connected
default via fe80::1 dev eth0                    ← dari RA / statis</pre>
<h3>Yang Sama & Yang Beda vs IPv4</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Default route</td><td>0.0.0.0/0</td><td>::/0</td></tr>
<tr><td>Next-hop umum</td><td>IP GUA/private tetangga</td><td><b>Link-local</b> (fe80::...)</td></tr>
<tr><td>Prinsip pemilihan</td><td>Longest prefix match</td><td><b>Sama</b> — longest prefix match</td></tr>
<tr><td>Protokol dinamis</td><td>OSPFv2, BGP</td><td>OSPFv3, BGP (multiprotocol)</td></tr>
</table></div>
<div class="callout blue"><div class="t">Aktifkan Forwarding Dulu!</div><p style="margin:4px 0 0">Di Linux, <code>net.ipv6.conf.all.forwarding=1</code> harus aktif agar mesin me-routing IPv6 (seperti <code>ip_forward</code> di IPv4). Lupa ini = "route sudah benar tapi tidak jalan" — jebakan klasik lab. Di router asli, IPv6 routing diaktifkan per perintah (<code>ipv6 unicast-routing</code> di Cisco).</p></div>`,
      terms: [
        ['Static route IPv6', 'Route manual dengan prefix IPv6; next-hop umumnya link-local.'],
        ['::/0', 'Default route IPv6 (padanan 0.0.0.0/0).'],
        ['Longest prefix match', 'Aturan routing: pilih route dengan prefix terpanjang yang cocok — sama di v4 & v6.'],
      ],
      scenario: 'Cabang baru dual-stack: routing IPv4 sudah jalan, IPv6 "tidak jalan". Cek: <code>ipv6 unicast-routing</code> belum diaktifkan di router — IPv6 di-drop diam-diam. Satu baris perintah, 2 jam troubleshooting. Checklist dual-stack: forwarding ON di kedua protokol!',
      bestPractices: 'Tulis route IPv6 dengan next-hop link-local yang dikonfigurasi statis (tahan renumbering). Dokumentasikan berdampingan dengan route IPv4.',
      security: 'Filter routing (prefix-list) harus ada untuk IPv6 juga — jangan sampai route bogon/private bocor ke BGP.',
      challenge: 'Tulis perintah static route IPv6 di Linux untuk: "semua ULA fd12:3456:789a::/48 via fe80::1 dev eth0". Lalu apa perintah melihat tabelnya?',
      interviewQ: 'Q: "Apa perbedaan routing IPv6 dan IPv4?" — A: Konsep identik (longest prefix match, static/dynamic). Beda: notasi (::/0 untuk default), next-hop umumnya link-local (bukan GUA), dan forwarding IPv6 harus diaktifkan eksplisit (ipv6 unicast-routing / sysctl). Protokol dinamis versi 6: OSPFv3, MP-BGP.',
      quiz: [
        { q: 'Default route IPv6 ditulis…', options: ['0.0.0.0/0', '::/0', 'ff00::/0', 'fe80::/0'], answer: 1, explain: '::/0 = "semua alamat IPv6" — padanan 0.0.0.0/0.' },
        { q: 'Next-hop yang umum & direkomendasikan untuk route IPv6 adalah…', options: ['Global unicast tetangga', 'Link-local tetangga (fe80::...) — stabil terhadap renumbering', 'Multicast', 'Alamat sendiri'], answer: 1, explain: 'Link-local = tetangga satu link; tidak berubah saat GUA renumbering.' },
        { q: 'IPv6 tidak di-routing di Linux meski route benar. Kemungkinan lupa…', options: ['Install ulang', 'Mengaktifkan net.ipv6.conf.all.forwarding=1', 'Ganti kabel', 'Restart DNS'], answer: 1, explain: 'Forwarding IPv6 default mati — harus diaktifkan eksplisit.' },
      ],
    },
    {
      id: '5.11',
      title: 'IPv4 vs IPv6',
      body: `<p>Ringkasan head-to-head untuk mengunci pemahaman — dan untuk menjawab pertanyaan interview paling klasik: "bandingkan IPv4 dan IPv6".</p>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Panjang alamat</td><td>32 bit (~4,3 miliar)</td><td>128 bit (~340 undecillion)</td></tr>
<tr><td>Notasi</td><td>Desimal bertitik: 192.168.20.50</td><td>Heksadesimal titik-dua: 2001:db8::50</td></tr>
<tr><td>Subnet standar</td><td>/24 (fleksibel, dihitung)</td><td><b>/64 (tetap untuk LAN)</b></td></tr>
<tr><td>Broadcast</td><td>Ada</td><td><b>Dihapus</b> → multicast</td></tr>
<tr><td>ARP</td><td>ARP (broadcast)</td><td><b>NDP</b> (multicast, ICMPv6)</td></tr>
<tr><td>Konfigurasi otomatis</td><td>DHCP (wajib server)</td><td><b>SLAAC</b> (tanpa server) + DHCPv6</td></tr>
<tr><td>NAT</td><td>Umum (plester)</td><td>Tidak dibutuhkan (end-to-end)</td></tr>
<tr><td>Private</td><td>RFC 1918 (10/8, 172.16/12, 192.168/16)</td><td><b>ULA</b> fc00::/7 (Global ID acak)</td></tr>
<tr><td>Loopback</td><td>127.0.0.1</td><td>::1</td></tr>
<tr><td>Header</td><td>Variabel, kompleks</td><td>Tetap 40 byte, sederhana</td></tr>
<tr><td>Fragmentasi</td><td>Oleh router di jalan</td><td><b>Hanya oleh pengirim</b> (router tidak)</td></tr>
<tr><td>IPsec</td><td>Opsional/tambahan</td><td>Dirancang masuk sejak awal</td></tr>
</table></div>
<h3>Yang TIDAK Berubah</h3>
<ul>
<li>Konsep network/host, gateway, routing (longest prefix match) — <b>identik</b>.</li>
<li>TCP/UDP di atasnya — <b>sama persis</b> (port, handshake tidak berubah).</li>
<li>Prinsip troubleshooting berlapis — <b>tetap OSI</b>.</li>
</ul>
<p>Berita baiknya: 70% pengetahuan IPv4-mu langsung transfer ke IPv6. Yang baru hanyalah "kosakata alamat" dan mekanisme discovery-nya.</p>`,
      terms: [
        ['Head-to-head', 'Perbandingan langsung aspek-per-aspek.'],
      ],
      scenario: 'Interview: "Bandingkan IPv4 dan IPv6 dalam 2 menit." Kandidat terlatih menjawab terstruktur: alamat (32 vs 128 bit), broadcast (ada vs dihapus→multicast), ARP (vs NDP), konfigurasi (DHCP vs SLAAC), NAT (dibutuhkan vs tidak), subnet (/24 fleksibel vs /64 standar) — lalu menutup: "konsep routing & TCP/UDP tidak berubah." Jawaban 2 menit yang menunjukkan pemahaman, bukan hafalan.',
      bestPractices: 'Saat menjelaskan ke non-teknis: "IPv6 = IPv4 dengan alamat yang jauh lebih banyak dan konfigurasi otomatis yang lebih cerdas — cara memakainya mirip."',
      security: 'Jangan menganggap IPv6 "lebih aman" otomatis — ia hanya lebih modern. Semua prinsip keamanan (firewall, segmentasi, least privilege) berlaku sama.',
      challenge: 'Buat tabel perbandingan versimu sendiri (10 baris) TANPA melihat tabel di atas, lalu cocokkan. Baris mana yang lupa?',
      interviewQ: 'Q: "Sebutkan 5 perbedaan utama IPv4 dan IPv6." — A: (1) 32-bit vs 128-bit; (2) broadcast ada vs dihapus diganti multicast; (3) ARP broadcast vs NDP multicast (ICMPv6); (4) DHCP wajib vs SLAAC tanpa server; (5) NAT umum vs tidak dibutuhkan. Yang sama: konsep routing, gateway, dan TCP/UDP.',
      quiz: [
        { q: 'Pernyataan yang BENAR tentang IPv6 adalah…', options: ['Masih memakai broadcast', 'Menghapus broadcast — digantikan multicast (mis. NDP)', 'Wajib NAT', 'Header lebih kompleks'], answer: 1, explain: 'Tanpa broadcast; solicited-node multicast menggantikan ARP.' },
        { q: 'Yang TIDAK berubah dari IPv4 ke IPv6 adalah…', options: ['Panjang alamat', 'Prinsip routing (longest prefix match) dan TCP/UDP', 'Cara menulis alamat', 'Kebutuhan DHCP'], answer: 1, explain: 'Konsep inti jaringan tetap; yang berubah kosakata alamat & discovery.' },
        { q: 'Fragmentasi di IPv6 dilakukan oleh…', options: ['Router di tengah jalan (seperti IPv4)', 'Hanya pengirim — router tidak memfragmentasi', 'Switch', 'DNS'], answer: 1, explain: 'Penyederhanaan header: router tidak terbebani fragmentasi; PMTU discovery via ICMPv6.' },
      ],
    },
    {
      id: '5.12',
      title: 'Hands-On: IPv6 Lab',
      body: `<p>Lab ini mengaktifkan IPv6 di komputermu sendiri dan membuktikan NDP, SLAAC, dan routing link-local bekerja — <b>tanpa device tambahan</b>.</p>
<h3>Topologi</h3>
<pre>[PC-mu (dual-stack)] ── LAN ── [Router/ISP dengan IPv6]
   Amati: link-local (otomatis) + GUA/ULA (dari RA/SLAAC/DHCPv6)</pre>
<h3>Objective</h3>
<p>Memverifikasi: (1) link-local selalu ada; (2) alamat global didapat via SLAAC/RA; (3) NDP menggantikan ARP; (4) ping6 & traceroute6 bekerja — mengikuti alur Topology → ... → Final Verification.</p>
<h3>Konfigurasi</h3>
<p>Umumnya <b>tidak perlu</b> — OS modern dual-stack default. <b>Alasan:</b> link-local otomatis; GUA dari RA router/ISP. Jika ISP belum IPv6, link-local + ULA tetap bisa dipraktikkan antar dua PC satu LAN.</p>
<h3>Verifikasi</h3>
<pre># 1. Lihat alamat IPv6 (bandingkan dengan teori 5.2–5.5!)
ip -6 addr show          # Linux
ipconfig                 # Windows → cari "IPv6 Address" & "Link-local"

# Yang dicari:
#   fe80::...  → link-local (SELALU ada jika interface up) ✓
#   2xxx:...   → GUA dari RA/ISP (jika ada) ✓
#   fdxx:...   → ULA (jika dikonfigurasi) ✓

# 2. Tetangga IPv6 (pengganti "arp -a"!)
ip -6 neigh show         # ← NDP table, bukan ARP table
# Mengapa: bukti NDP bekerja — pemetaan IPv6→MAC via NS/NA

# 3. Ping6: link-local WAJIB pakai zone ID!
ping6 fe80::1%eth0       # Linux (ganti eth0 & alamat router)
ping fe80::1            # Windows (zone otomatis)
# Mengapa %eth0: link-local tidak unik antar-interface (5.4)

# 4. Ping & trace ke internet IPv6 (jika GUA ada)
ping6 2001:4860:4860::8888   # DNS Google via IPv6!
traceroute6 2001:4860:4860::8888

# 5. Lihat route IPv6 — cari next-hop link-local!
ip -6 route show
# Harapan: "default via fe80::... dev ..." ← teori 5.10 terbukti</pre>
<p><b>Expected output:</b> minimal link-local + NDP table terisi; jika router/ISP IPv6-ready: GUA + default route via fe80:: + ping6 ke internet sukses.</p>
<h3>Failure Injection</h3>
<p><b>Injeksi — matikan IPv6 di interface</b> (atau blokir RA di firewall lokal). <b>Ekspektasi:</b> GUA hilang, hanya link-local tersisa; <code>ip -6 neigh</code> hanya berisi tetangga link. <b>Pelajaran:</b> tanpa RA = tanpa prefix/gateway — peran RA sebagai "sumber kebenaran" terbukti.</p>
<h3>Troubleshooting</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Kemungkinan</th><th>Perintah</th></tr>
<tr><td>Tidak ada fe80::</td><td>Interface down / IPv6 disabled</td><td><code>ip link</code>, cek sysctl</td></tr>
<tr><td>Ada fe80::, tanpa GUA</td><td>Tidak ada RA (router/ISP belum IPv6)</td><td><code>tcpdump ip6</code> cari RA</td></tr>
<tr><td>GUA ada, ping6 gagal</td><td>Firewall blokir ICMPv6 / route salah</td><td><code>ip -6 route</code>, cek firewall</td></tr>
<tr><td><code>ip -6 neigh</code> kosong</td><td>Belum ada traffic / NDP terblokir</td><td>ping6 dulu, lalu cek lagi</td></tr>
</table></div>
<h3>Fix & Final Verification</h3>
<p>Aktifkan kembali IPv6/RA, ulangi 5 langkah verifikasi hingga hijau. <b>Final test:</b> jelaskan dari output <code>ip -6 addr</code>-mu sendiri — mana link-local, mana GUA/ULA, mana yang dari SLAAC (EUI-64/acak) — tanpa melihat catatan.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Menonaktifkan IPv6 di PC lab = aman. Di production, menonaktifkan IPv6 di server bisa merusak aplikasi yang mengandalkannya (banyak aplikasi modern prefer IPv6!) — selalu cek dependensi dulu.</p></div>`,
      terms: [
        ['ping6/traceroute6', 'Versi IPv6 dari ping & traceroute.'],
        ['ip -6', 'Perintah Linux untuk melihat/konfigurasi IPv6 (addr, route, neigh).'],
      ],
      scenario: 'Helpdesk: "internet lambat setelah migrasi IPv6". Investigasi: aplikasi mencoba IPv6 dulu (happy eyeballs), gagal timeout 30 detik, baru fallback ke IPv4 — "lambat"-nya adalah timeout IPv6 yang broken, bukan bandwidth. Fix: perbaiki RA/firewall ICMPv6. Tanpa pemahaman dual-stack, kasus ini misterius.',
      bestPractices: 'Saat dual-stack bermasalah, uji v4 dan v6 terpisah (ping vs ping6) — jangan campur; keduanya adalah "jaringan paralel".',
      security: 'Jangan lupa firewall IPv6 (ip6tables/nftables) — banyak server "aman" di IPv4 tapi terbuka di IPv6 karena lupa dikonfigurasi.',
      challenge: 'Capture NDP: <code>sudo tcpdump -i eth0 ip6 and icmp6</code> selama 60 detik. Identifikasi: ada RS? RA? NS? Dari siapa ke siapa?',
      interviewQ: 'Q: "Bagaimana cara memverifikasi IPv6 bekerja di host?" — A: (1) ip -6 addr — ada fe80:: (link-local, selalu) + GUA/ULA; (2) ip -6 neigh — NDP table terisi (pengganti arp -a); (3) ping6 ke link-local tetangga (dengan zone ID) & ke internet; (4) ip -6 route — default via fe80:: (next-hop link-local).',
      quiz: [
        { q: 'Perintah Linux pengganti "arp -a" untuk IPv6 adalah…', options: ['arp -6', 'ip -6 neigh show (NDP table)', 'ping6 -a', 'ipconfig /6'], answer: 1, explain: 'NDP menggantikan ARP; tabelnya dilihat via ip -6 neigh.' },
        { q: 'Ping ke fe80::1 membutuhkan zone ID (%eth0) karena…', options: ['Agar lebih cepat', 'Link-local tidak unik antar-interface — harus jelas lewat interface mana', 'Syarat IPv6', 'Agar terenkripsi'], answer: 1, explain: 'fe80::1 bisa ada di tiap interface; zone ID menghilangkan ambiguitas.' },
        { q: 'Host punya fe80:: tapi tidak punya GUA. Artinya…', options: ['IPv6 rusak total', 'Tidak ada RA/prefix — router/ISP belum menyediakan IPv6 (link-local tetap bekerja)', 'Kabel putus', 'DNS rusak'], answer: 1, explain: 'Link-local otomatis selalu ada; GUA butuh RA dari router.' },
      ],
    },
  ],
  project: {
    title: 'Project Part 05 — IPv6 Addressing Plan (Portfolio)',
    html: `<div class="proj">
<h3>Project Part 05 — IPv6 Addressing Plan</h3>
<p><b>Tugasmu:</b> buat <b>dokumen perencanaan IPv6</b> untuk desain 5-VLAN kurikulum — ULA + contoh GUA dokumentasi — lengkap dengan strategi SLAAC/DHCPv6 per VLAN dan bukti lab.</p>
<p><b>Isi dokumen (ipv6-design.md):</b></p>
<ol>
<li>Tabel alokasi: VLAN → ULA /64 (pola <code>fd12:3456:789a:&lt;vlan&gt;::/64</code>) → contoh GUA dokumentasi (<code>2001:db8:&lt;vlan&gt;::/64</code>) → gateway (link-local <code>fe80::1</code>).</li>
<li>Contoh alamat lengkap untuk: 1 PC (VLAN 20), 1 server (VLAN 30), 1 switch (VLAN 99) — tulis bentuk penuh + terkompresi.</li>
<li>Strategi per VLAN: mana yang SLAAC+stateless, mana yang stateful/statis — beserta alasannya (kaitkan 5.8–5.9).</li>
<li>Hasil lab 5.12: output <code>ip -6 addr</code>, <code>ip -6 neigh</code>, <code>ip -6 route</code>, <code>ping6</code> dari komputermu + penjelasan tiap baris.</li>
<li>Perbandingan IPv4 vs IPv6 untuk desain ini (tabel 5 baris) + catatan firewall: apa yang harus difilter di IPv6.</li>
</ol>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Di repository <code>network-engineer-lab</code>, buat folder <code>part-05-ipv6/</code>.</span></li>
<li><span class="n">2</span><span>Isi dengan <code>README.md</code> dan <code>ipv6-design.md</code>.</span></li>
<li><span class="n">3</span><span>Commit <code>"Part 05: IPv6 addressing plan"</code> lalu push.</span></li>
</ol>
<p><b>Kriteria selesai:</b> pola ULA konsisten (subnet ID = nomor VLAN), kompresi alamat valid (aturan :: sekali), strategi SLAAC/DHCPv6 tepat per VLAN dengan alasan, output lab asli terdokumentasi, dan catatan firewall IPv6 (termasuk "jangan blokir total ICMPv6").</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 05</div>
<p style="margin:6px 0 0">1) Mengapa butuh IPv6? &nbsp;2) Kompresikan 2001:0db8:0000:0000:0000:ff00:0042:8329. &nbsp;3) Apa itu link-local dan mengapa penting? &nbsp;4) Jelaskan SLAAC. &nbsp;5) Bagaimana NDP menggantikan ARP? — Kuasai kelimanya sebelum lanjut ke Part 06.</p></div>`,
  },
};
