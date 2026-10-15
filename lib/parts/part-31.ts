// Part 31 — VPN & WAN (Fase 6).
import type { Part } from './types';

export const part31: Part = {
  id: '31',
  number: 'PART 31',
  title: 'VPN & WAN',
  phaseId: 'fase-6',
  description: 'Menghubungkan site jarak jauh dengan aman: konsep WAN, site-to-site, GRE, IPsec, WireGuard, dan troubleshooting WAN.',
  repoFolder: 'part-31-vpn-wan',
  objectives: [
    'Menjelaskan konsep WAN dan arsitektur site-to-site (studi kasus Jakarta–Makassar) serta kapan memakai VPN.',
    'Membedakan teknologi tunneling: GRE, IPsec, dan WireGuard — termasuk kapan masing-masing tepat dipakai.',
    'Mengkonfigurasi tunnel GRE dan WireGuard di MikroTik dengan penjelasan per baris, termasuk aturan firewall yang dibutuhkan.',
    'Mendiagnosis masalah WAN/VPN umum (MTU, routing, NAT, autentikasi) secara sistematis.',
  ],
  prerequisites: 'Part 01–30 (terutama IP & routing, NAT, firewall, MTU, dan troubleshooting — VPN adalah "penerapan gabungan" semuanya).',
  subbabs: [
    {
      id: '31.1',
      title: 'WAN Fundamentals',
      body: `<p><b>WAN (Wide Area Network)</b> adalah jaringan yang menghubungkan lokasi-lokasi <b>jauh secara geografis</b> — antar kota, pulau, bahkan negara. Kalau LAN adalah "jaringan dalam satu gedung" (milikmu, cepat, murah), WAN adalah "jalan tol antar kota": <b>lebih lambat, lebih mahal, dan biasanya milik/sewa dari provider</b>.</p>
<h3>LAN vs WAN</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>LAN</th><th>WAN</th></tr>
<tr><td>Cakupan</td><td>Gedung/kampus</td><td>Kota/pulau/negara</td></tr>
<tr><td>Kepemilikan</td><td>Milik sendiri</td><td>Sewa dari ISP (atau via internet)</td></tr>
<tr><td>Kecepatan</td><td>1–10 Gbps (murah)</td><td>10 Mbps–1 Gbps (mahal per Mbps)</td></tr>
<tr><td>Latency</td><td>&lt;1 ms</td><td>20–300 ms (jarak = fisika!)</td></tr>
<tr><td>Keandalan</td><td>Kontrol penuh</td><td>Tergantung provider/SLA</td></tr>
</table></div>
<h3>Opsi Konektivitas WAN</h3>
<ul>
<li><b>Leased line:</b> jalur privat sewaan point-to-point (mahal, sangat andal, latency stabil). <i>Alasan pakai:</i> butuh jaminan SLA ketat (bank, data center).</li>
<li><b>MPLS:</b> jaringan privat milik provider dengan label-switching; banyak cabang terhubung rapi. <i>Alasan pakai:</i> enterprise multi-cabang yang butuh QoS & isolasi — tetapi mahal.</li>
<li><b>Internet + VPN:</b> memakai internet publik + tunnel terenkripsi (fokus part ini!). <i>Alasan pakai:</i> <b>jauh lebih murah</b>, fleksibel — dengan tradeoff latency/keamanan yang dikelola via VPN.</li>
</ul>
<h3>Implikasi Desain WAN</h3>
<ul>
<li><b>Latency tak bisa dihindari</b> (Jakarta–Makassar ~30–50 ms — fisika, bukan konfigurasi). Desain aplikasi harus toleran: hindari protokol "rewel latency" untuk transfer besar tanpa tuning.</li>
<li><b>Bandwidth mahal</b> → QoS menjadi penting (dahulukan VoIP/aplikasi kritis — Part 13/22).</li>
<li><b>Keamanan:</b> data lewat infrastruktur publik → <b>enkripsi wajib</b> (inilah alasan VPN).</li>
</ul>
<div class="callout blue"><div class="t">Kenapa Part Ini Ada di Fase 6?</div><p style="margin:4px 0 0">VPN/WAN adalah <i>penerapan gabungan</i>: routing (agar site saling kenal), NAT (agar tunnel bisa keluar), firewall (agar tunnel aman), MTU (overhead header!), dan troubleshooting. Kalau fondasi Part 01–30 goyah, VPN akan terasa "misterius". Kalau fondasi kuat, VPN hanyalah merangkai yang sudah dikuasai.</p></div>`,
      terms: [
        ['WAN', 'Wide Area Network — jaringan antar lokasi jauh; sewa/milik provider; lambat & mahal dibanding LAN.'],
        ['Leased line', 'Jalur privat point-to-point sewaan — mahal, SLA ketat.'],
        ['MPLS', 'Jaringan privat provider berbasis label — rapi untuk multi-cabang, mahal.'],
        ['Latency vs bandwidth', 'Latency = jeda waktu (dipengaruhi jarak); bandwidth = kapasitas. Keduanya independen (Part 01).'],
      ],
      diagram: `<pre>   OPSI WAN: kantor pusat Jakarta ── cabang Makassar

   (a) Leased line:  JKT ═══════════ MKS   (privat, mahal, stabil)
   (b) MPLS:         JKT ──[Cloud ISP]── MKS (privat via provider, mahal)
   (c) Internet+VPN: JKT ──[Internet]── MKS (murah, + tunnel terenkripsi)
                      └─► FOKUS PART INI: VPN di atas internet publik</pre>`,
      scenario: 'Perusahaan dengan 5 cabang membayar MPLS Rp150 juta/bulan. Evaluasi: traffic antar-cabang 90% adalah aplikasi web internal + file sharing — tidak butuh SLA seketat MPLS. Migrasi bertahap ke internet + VPN (WireGuard/IPsec): biaya turun 70%, performa "cukup" untuk kebutuhan. Moral: pilih teknologi sesuai kebutuhan nyata, bukan gengsi.',
      bestPractices: 'Petakan dulu kebutuhan: aplikasi apa lewat WAN? Butuh latency berapa? Data sensitif? Baru pilih leased line vs MPLS vs internet+VPN. Teknologi mengikuti kebutuhan.',
      security: 'Data yang keluar gedung = data di wilayah tak terkendali. Apapun opsi WAN-nya, pastikan ada enkripsi (VPN/IPsec) untuk data sensitif — "percaya provider" bukan strategi keamanan.',
      challenge: 'Ukur latency ke beberapa kota (ping ke server Jakarta, Surabaya, Singapura). Catat polanya: makin jauh makin besar. Inilah "pajak fisika" WAN yang harus diterima.',
      interviewQ: 'Q: "Bandingkan leased line, MPLS, dan internet+VPN." — A: Leased line/MPLS = privat, SLA ketat, mahal (untuk kebutuhan kritis); internet+VPN = murah, fleksibel, dengan tradeoff latency & keamanan yang dikelola via enkripsi — cocok untuk mayoritas kebutuhan enterprise modern.',
      quiz: [
        { q: 'Perbedaan utama LAN vs WAN adalah…', options: ['Warna kabel', 'Cakupan geografis, kepemilikan (sewa), biaya, dan latency', 'Jumlah huruf', 'Tidak ada'], answer: 1, explain: 'WAN = jauh, sewa dari provider, mahal per Mbps, latency tinggi karena jarak fisik.' },
        { q: 'Alasan utama memilih internet+VPN dibanding MPLS?', options: ['Lebih cepat selalu', 'Jauh lebih murah & fleksibel, dengan keamanan via enkripsi', 'Tanpa konfigurasi', 'Tanpa ISP'], answer: 1, explain: 'Tradeoff klasik: biaya vs SLA; VPN menutup celah keamanan internet publik dengan enkripsi.' },
        { q: 'Latency Jakarta–Makassar ~30–50 ms tidak bisa "diperbaiki" karena…', options: ['Router lambat', 'Batasan fisika: kecepatan cahaya & jarak', 'Kabel jelek', 'ISP pelit'], answer: 1, explain: 'Propagation delay ditentukan jarak/kecepatan cahaya — terima sebagai "pajak fisika" dan desain aplikasi yang toleran.' },
      ],
    },
    {
      id: '31.2',
      title: 'Site-to-Site Network',
      body: `<p><b>Site-to-site</b> adalah arsitektur menghubungkan <b>seluruh jaringan</b> dua (atau lebih) lokasi agar terasa seperti <b>satu LAN besar</b>: PC di cabang Makassar bisa mengakses server di Jakarta <i>seolah-olah</i> satu gedung — tanpa konfigurasi khusus di tiap PC. Ini berbeda dengan remote-access VPN (31.7) yang menghubungkan <i>satu user</i>.</p>
<h3>Studi Kasus: Jakarta (Pusat) – Makassar (Cabang)</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Jakarta (Head Office)</th><th>Makassar (Branch)</th></tr>
<tr><td>Peran</td><td>Server pusat, internet utama</td><td>Kantor operasional</td></tr>
<tr><td>VLAN 20 OFFICE</td><td>192.168.20.0/24</td><td>10.10.20.0/24</td></tr>
<tr><td>VLAN 30 SERVER</td><td>192.168.30.0/24</td><td>— (pakai server Jakarta)</td></tr>
<tr><td>VLAN 40 GUEST</td><td>192.168.40.0/24</td><td>10.10.40.0/24</td></tr>
<tr><td>IP publik (contoh)</td><td>203.0.113.1</td><td>198.51.100.1</td></tr>
</table></div>
<p><b>Alasan desain IP ini:</b> VLAN ID <b>sama</b> di kedua site (20 tetap OFFICE) agar kebijakan konsisten, tetapi <b>supernet berbeda</b> (192.168.x vs 10.10.x) agar routing bisa membedakan "lokal vs seberang" dan tidak ada tabrakan subnet.</p>
<h3>Tiga Syarat Site-to-Site Bekerja</h3>
<ol>
<li><b>Konektivitas dasar:</b> kedua router bisa saling mencapai via IP publik (ping IP publik lawan berhasil).</li>
<li><b>Tunnel:</b> terowongan logis di atas internet (GRE/IPsec/WireGuard — 31.4–31.6).</li>
<li><b>Routing:</b> tiap sisi tahu "subnet seberang lewat tunnel" (static route / OSPF via tunnel).</li>
</ol>
<p>Urutan troubleshooting-nya pun sama: <b>publik dulu → tunnel → routing</b> (detail di 31.10). 90% "VPN tidak jalan" gagal di salah satu dari tiga ini.</p>
<div class="callout blue"><div class="t">Prinsip Desain</div><p style="margin:4px 0 0">Site-to-site yang baik <b>transparan bagi user</b>: tidak ada aplikasi khusus di PC, tidak ada password VPN harian. Semua kerumitan disembunyikan di router kedua sisi — itulah pekerjaan network engineer.</p></div>`,
      terms: [
        ['Site-to-site', 'Arsitektur menghubungkan seluruh jaringan antar-lokasi menjadi satu kesatuan logis.'],
        ['Head office / Branch', 'Kantor pusat (server & kebijakan terpusat) vs kantor cabang (operasional).'],
        ['Supernet', 'Rentang IP besar pembeda antar-site (192.168.x vs 10.10.x) agar routing tidak ambigu.'],
      ],
      diagram: `<pre>   SITE-TO-SITE Jakarta ──tunnel── Makassar

   JAKARTA (192.168.x.0/24)                    MAKASSAR (10.10.x.0/24)
   [PC 192.168.20.50]                          [PC 10.10.20.50]
         │                                           │
   [R-JKT 203.0.113.1] ═════ tunnel ═════ [R-MKS 198.51.100.1]
         │  1. publik saling ping OK                 │
         │  2. tunnel up (GRE/WireGuard)              │
         │  3. route: 10.10.0.0/16 via tunnel        │  3. route: 192.168.0.0/16 via tunnel
         ▼                                           ▼
   PC Makassar akses server Jakarta (192.168.30.10) seperti LAN sendiri.</pre>`,
      scenario: 'Cabang Makassar selama ini akses aplikasi via internet publik (lemot + tidak aman) atau kirim file via email. Setelah site-to-site: aplikasi inventory Jakarta dibuka dari Makassar dalam 40 ms, file sharing langsung, telepon antar-kantor gratis via VoIP internal. Operasional berubah total — tanpa satu pun training untuk user.',
      bestPractices: 'Rencanakan IP plan <b>sebelum</b> membangun tunnel: supernet per site, VLAN ID konsisten, dan dokumentasikan di satu IPAM. Mengubah IP setelah tunnel jalan = pekerjaan ganda.',
      security: 'Batasi apa yang boleh lewat tunnel: cabang tidak perlu akses ke VLAN 99 MANAGEMENT pusat. Firewall di kedua ujung tunnel menegakkan matriks antar-site.',
      challenge: 'Gambar topologi site-to-site untuk 3 site (Jakarta, Makassar, Surabaya 10.20.0.0/16): tentukan supernet, VLAN, dan daftar static route yang dibutuhkan tiap router. (Petunjuk: hub-and-spoke via Jakarta.)',
      interviewQ: 'Q: "Apa beda site-to-site VPN dengan remote-access VPN?" — A: Site-to-site menghubungkan <i>seluruh jaringan</i> antar-lokasi secara permanen dan transparan bagi user; remote-access menghubungkan <i>satu user</i> (laptop/HP) secara temporer dengan client VPN.',
      quiz: [
        { q: 'Tiga syarat site-to-site bekerja adalah…', options: ['Kabel mahal, server besar, lisensi', 'Konektivitas IP publik, tunnel, routing ke subnet seberang', 'Wi-Fi kencang saja', 'Tanpa syarat'], answer: 1, explain: 'Publik saling terjangkau → tunnel terbentuk → routing mengarahkan subnet seberang via tunnel.' },
        { q: 'Mengapa supernet berbeda (192.168.x vs 10.10.x) antar-site?', options: ['Agar cantik', 'Agar routing bisa membedakan lokal vs seberang dan tidak ada tabrakan subnet', 'Syarat ISP', 'Agar cepat'], answer: 1, explain: 'Subnet yang sama di dua site = ambigu & tabrakan; supernet berbeda = routing jelas.' },
        { q: 'Site-to-site yang baik bersifat…', options: ['Transparan bagi user — tanpa client/aplikasi khusus di PC', 'Wajib install aplikasi di tiap PC', 'Hanya untuk HP', 'Manual tiap hari'], answer: 0, explain: 'Semua kerumitan di router kedua sisi; user memakai jaringan seperti biasa.' },
      ],
    },
    {
      id: '31.3',
      title: 'VPN Concept',
      body: `<p><b>VPN (Virtual Private Network)</b> menciptakan jaringan <b>privat</b> (aman, seolah milik sendiri) di atas infrastruktur <b>publik</b> (internet) yang tidak dipercaya. Katanya: <i>virtual</i> (tidak ada kabel fisik khusus), <i>private</i> (terisolasi & terenkripsi). Analogi: <b>terowongan aman di dalam jalan raya umum</b> — semua orang lewat jalan yang sama, tetapi isi mobilmu tak terlihat.</p>
<h3>Dua Fungsi Inti VPN</h3>
<ul>
<li><b>Tunneling:</b> membungkus paket privat di dalam paket publik (enkapsulasi). Paket 10.10.20.50 → dibungkus → dikirim sebagai paket 203.0.113.1 → 198.51.100.1. Internet hanya melihat "amplop luar".</li>
<li><b>Enkripsi:</b> isi paket diacak sehingga penyadap di tengah jalan hanya melihat data tak bermakna. <i>Alasan:</i> internet adalah wilayah tak terkendali — enkripsi adalah satu-satunya jaminan kerahasiaan.</li>
</ul>
<h3>Tiga Pilar Keamanan VPN (hafalkan!)</h3>
<div class="tblwrap"><table>
<tr><th>Pilar</th><th>Fungsi</th><th>Analogi</th></tr>
<tr><td><b>Confidentiality</b></td><td>Isi tak bisa dibaca penyadap (enkripsi)</td><td>Surat dalam amplop tersegel</td></tr>
<tr><td><b>Integrity</b></td><td>Isi tak bisa diubah diam-diam (hash/MAC)</td><td>Segel rusak = ketahuan dibuka</td></tr>
<tr><td><b>Authentication</b></td><td>Yakin bicara dengan lawan yang benar (pre-shared key / sertifikat)</td><td>Tanda tangan yang dikenali</td></tr>
</table></div>
<p>Tanpa autentikasi, kamu bisa membangun "tunnel aman" ke <i>penyerang</i> (MITM). Tanpa integrity, penyerang bisa mengubah isi tanpa ketahuan. Tiga-tiganya wajib.</p>
<h3>Jenis VPN (Peta Part Ini)</h3>
<ul>
<li><b>Site-to-site:</b> router-ke-router, permanen (31.2). Teknologi: GRE, IPsec, WireGuard.</li>
<li><b>Remote access:</b> user-ke-kantor, temporer (31.7). Teknologi: IPsec/L2TP, SSL VPN, WireGuard.</li>
</ul>
<div class="callout"><div class="t">VPN ≠ Anonimitas</div><p style="margin:4px 0 0">VPN komersial ("VPN untuk nonton streaming") dan VPN enterprise (part ini) memakai teknologi mirip tetapi <b>tujuannya beda</b>: yang satu menyembunyikan user dari internet, yang satu menghubungkan site dengan aman. Jangan tertukar saat interview!</p></div>`,
      terms: [
        ['VPN', 'Virtual Private Network — jaringan privat virtual di atas infrastruktur publik via tunneling + enkripsi.'],
        ['Tunneling / enkapsulasi', 'Pembungkusan paket privat di dalam paket publik agar bisa lewat internet.'],
        ['Pre-shared key (PSK)', 'Kunci rahasia bersama untuk autentikasi VPN — harus kuat & dijaga.'],
      ],
      diagram: `<pre>   VPN: terowongan aman di jalan raya umum

   Tanpa VPN:                                   Dengan VPN:
   [10.10.20.50] ──terbaca──▶ [Internet]        [10.10.20.50] ══▶|ENKRIPSI|══▶ [Internet]
   "isi paket terlihat siapa saja"              ┌──────────────────────────────┐
                                                │ amplop luar: 203.0.113.1 →   │
                                                │ 198.51.100.1 (terlihat)     │
                                                │ isi: [teracak] (rahasia)    │
                                                └──────────────────────────────┘
   Tiga pilar: confidentiality (acak) + integrity (segel) + authentication (tanda tangan).</pre>`,
      scenario: 'Tanpa VPN, cabang mengirim data keuangan via email biasa melewati internet — bisa disadap di banyak titik. Dengan VPN, data yang sama lewat "terowongan terenkripsi": penyadap hanya melihat aliran acak. Audit keamanan yang tadinya memberi temuan kritis kini memberi nilai baik.',
      bestPractices: 'Selalu gunakan ketiga pilar (enkripsi + integrity + autentikasi). "Tunnel tanpa enkripsi" (GRE polos) hanya untuk kasus khusus yang dipahami risikonya (31.4).',
      security: 'Kunci VPN (PSK/private key) adalah mahkota keamanan: simpan seperti password admin, rotasi berkala, dan jangan pernah kirim via channel tak aman.',
      challenge: 'Jelaskan ke teman non-teknis dengan analogi amplop: apa itu tunneling, enkripsi, dan autentikasi dalam 1 menit. Kalau ia paham, kamu paham.',
      interviewQ: 'Q: "Apa tiga pilar keamanan VPN dan mengapa ketiganya dibutuhkan?" — A: Confidentiality (tak bisa dibaca), integrity (tak bisa diubah diam-diam), authentication (yakin lawan benar) — tanpa satu pun, "aman" hanya ilusi (mis. tunnel ke penyerang = MITM).',
      quiz: [
        { q: 'Fungsi tunneling pada VPN adalah…', options: ['Mempercepat paket', 'Membungkus paket privat dalam paket publik agar bisa lewat internet', 'Mengganti ISP', 'Menghapus header'], answer: 1, explain: 'Enkapsulasi: paket privat jadi "isi" paket publik; internet hanya melihat amplop luar.' },
        { q: 'Mengapa autentikasi wajib dalam VPN?', options: ['Agar cepat', 'Tanpa autentikasi bisa membangun tunnel aman ke penyerang (MITM)', 'Syarat lisensi', 'Agar hemat'], answer: 1, explain: 'Enkripsi tanpa autentikasi = "berbisik rahasia dengan orang yang salah".' },
        { q: 'Perbedaan VPN enterprise vs VPN komersial (streaming)?', options: ['Sama persis', 'Enterprise: menghubungkan site dengan aman; komersial: menyembunyikan user dari internet — tujuan berbeda', 'Enterprise lebih lambat', 'Tidak ada beda'], answer: 1, explain: 'Teknologi mirip, tujuan beda — penting untuk tidak tertukar saat diskusi/interview.' },
      ],
    },
    {
      id: '31.4',
      title: 'GRE',
      body: `<p><b>GRE (Generic Routing Encapsulation)</b> adalah protokol tunneling <b>paling sederhana</b>: ia membungkus paket IP di dalam paket IP lain (IP-over-IP) <b>tanpa enkripsi</b>. Kelebihannya: sederhana, ringan, dan bisa membawa <b>routing protocol</b> (OSPF) melewati tunnel — sesuatu yang IPsec murni tidak bisa.</p>
<h3>Kapan Memakai GRE?</h3>
<ul>
<li><b>Belajar konsep tunneling:</b> GRE adalah "tunnel telanjang" terbaik untuk memahami enkapsulasi sebelum menambah enkripsi.</li>
<li><b>Butuh routing dinamis via tunnel</b> (OSPF antar-site) — GRE + IPsec adalah kombinasi klasik enterprise.</li>
<li><b>Data tidak sensitif / sudah terenkripsi di layer aplikasi</b> (mis. HTTPS) — tetapi ini pengecualian, bukan aturan.</li>
</ul>
<div class="callout"><div class="t">Peringatan Jujur</div><p style="margin:4px 0 0"><b>GRE tanpa enkripsi = paket bisa dibaca penyadap.</b> Di production modern, GRE hampir selalu dipasangkan dengan IPsec (GRE-over-IPsec). Pelajari GRE untuk konsep & OSPF; untuk keamanan, lanjut ke 31.5–31.6.</p></div>
<h3>Contoh: GRE di MikroTik (Jakarta) + Penjelasan per Baris</h3>
<pre>[admin@R-JKT] &gt; /interface gre add name=gre-jkt-mks remote-address=198.51.100.1 local-address=203.0.113.1
  !＾Buat interface GRE: remote = IP publik lawan (Makassar), local = IP publik sendiri.
  ! Alasan: GRE perlu tahu "amplop luar" dikirim ke mana & dari mana.
[admin@R-JKT] &gt; /ip address add address=172.16.0.1/30 interface=gre-jkt-mks
  !＾Beri IP TUNNEL (/30 = hanya 2 host: .1 Jakarta, .2 Makassar).
  ! Alasan: tunnel butuh IP point-to-point agar bisa di-routing & di-ping.
[admin@R-JKT] &gt; /ip route add dst-address=10.10.0.0/16 gateway=172.16.0.2
  !＾"Subnet Makassar (10.10.0.0/16) lewat tunnel." Inilah syarat #3 site-to-site.
  ! gateway = IP tunnel sisi lawan (.2) — BUKAN IP publiknya!
[admin@R-JKT] &gt; /ip firewall filter add chain=input protocol=gre src-address=198.51.100.1 action=accept place-before=0
  !＾Izinkan protokol GRE (IP proto 47!) dari IP publik Makassar di firewall.
  ! Alasan: tanpa ini, firewall me-drop "amplop luar" GRE → tunnel tak terbentuk.</pre>
<p>Di Makassar, konfigurasi cermin: <code>remote-address=203.0.113.1 local-address=198.51.100.1</code>, IP tunnel <code>172.16.0.2/30</code>, route <code>192.168.0.0/16 via 172.16.0.1</code>.</p>
<h3>Verifikasi</h3>
<pre>[admin@R-JKT] &gt; /interface gre print
  !＾Pastikan interface R (running). Tidak running = remote/local salah atau firewall block.
[admin@R-JKT] &gt; ping 172.16.0.2
  !＾Ping IP tunnel lawan — "tunnel-nya hidup?" (syarat #2).
[admin@R-JKT] &gt; ping 10.10.20.50
  !＾Ping PC seberang — "routing-nya benar?" (syarat #3).</pre>`,
      terms: [
        ['GRE', 'Generic Routing Encapsulation — tunneling IP-over-IP sederhana tanpa enkripsi (protokol IP 47).'],
        ['IP tunnel /30', 'Subnet kecil point-to-point untuk interface tunnel — alamat "dalam terowongan".'],
        ['GRE-over-IPsec', 'Kombinasi klasik: GRE untuk tunneling+routing, IPsec untuk enkripsi.'],
      ],
      diagram: `<pre>   GRE: IP di dalam IP (tanpa enkripsi!)

   Paket asli:  [IP 192.168.20.50 → 10.10.20.50 | data]
                         │ dibungkus GRE
                         ▼
   Paket GRE:   [IP 203.0.113.1 → 198.51.100.1 | GRE | IP asli | data]
                └─ amplop luar (terlihat) ─┘   └─ isi (TERBACA bila disadap!) ─┘

   Overhead: +24 byte → ingat MTU! (28.16)
   Aman? TIDAK (tanpa enkripsi) → pasangkan IPsec untuk production.</pre>`,
      scenario: 'Dua site perlu OSPF saling bertukar rute otomatis (bukan static). IPsec murni tak bisa membawa multicast OSPF → solusinya GRE (membawa OSPF) + IPsec (mengenkripsi GRE). Kombinasi ini dipakai luas di enterprise — dan memahaminya berarti memahami <i>mengapa</i> dua teknologi digabung.',
      bestPractices: 'Dokumentasikan: remote/local address, IP tunnel, dan route via tunnel — dalam satu tabel. GRE yang "lupa didokumentasikan" adalah kandidat outage berikutnya.',
      security: 'Jangan biarkan GRE polos membawa data sensitif di production. Aturan praktis: GRE boleh untuk lab & belajar; production = GRE+IPsec atau WireGuard.',
      challenge: 'Bangun GRE antara 2 MikroTik CHR di GNS3 (atau 2 VM). Verifikasi 3 langkah: ping publik → ping IP tunnel → ping subnet seberang. Lalu capture dan buktikan isinya terbaca (pelajaran keamanan!).',
      interviewQ: 'Q: "Apa kelebihan GRE dibanding IPsec murni, dan apa kekurangannya?" — A: Kelebihan: sederhana dan bisa membawa routing protocol (multicast OSPF). Kekurangan: tanpa enkripsi — di production dipasangkan dengan IPsec (GRE-over-IPsec).',
      quiz: [
        { q: 'GRE bekerja dengan cara…', options: ['Mengenkripsi AES', 'Membungkus paket IP di dalam paket IP lain (protokol 47) tanpa enkripsi', 'Kompresi data', 'Mengganti IP'], answer: 1, explain: 'GRE = enkapsulasi IP-over-IP; sederhana & ringan, tetapi plaintext.' },
        { q: 'Aturan firewall yang wajib untuk GRE adalah…', options: ['Allow TCP 80', 'Allow protokol GRE (47) dari IP publik lawan', 'Allow DNS', 'Tidak perlu'], answer: 1, explain: 'GRE bukan TCP/UDP melainkan protokol IP 47 — firewall harus mengizinkannya eksplisit.' },
        { q: 'Kombinasi GRE-over-IPsec dipakai karena…', options: ['Agar mahal', 'GRE membawa tunneling+OSPF, IPsec menambah enkripsi — saling melengkapi', 'Agar lambat', 'Iseng'], answer: 1, explain: 'IPsec murni tak membawa multicast routing; GRE menutup kekurangan itu, IPsec menutup kekurangan keamanan GRE.' },
      ],
    },
    {
      id: '31.5',
      title: 'IPsec Concept',
      body: `<p><b>IPsec (IP Security)</b> adalah <b>standar enkripsi</b> di level IP — "amplop tersegel" resmi untuk VPN. Jika GRE adalah terowongan <i>terbuka</i>, IPsec adalah terowongan <i>berlapis baja</i>: enkripsi + integrity + autentikasi sekaligus. Ia adalah fondasi VPN enterprise selama 20+ tahun.</p>
<h3>Dua Fase Pembentukan (Hafalkan!)</h3>
<div class="tblwrap"><table>
<tr><th>Fase</th><th>Nama</th><th>Fungsi</th><th>Analogi</th></tr>
<tr><td><b>Phase 1</b></td><td>IKE SA</td><td>Saling autentikasi & menyepakati kunci aman ("jabat tangan")</td><td>Dua kurir saling kenal & tukar kunci brankas</td></tr>
<tr><td><b>Phase 2</b></td><td>IPsec SA</td><td>Menyepakati <i>bagaimana</i> data dienkripsi (algoritma apa)</td><td>Sepakat "pakai gembok merek X"</td></tr>
</table></div>
<p><b>Alasan dua fase:</b> Phase 1 (berat, jarang) membangun kanal aman; Phase 2 (ringan, sering refresh) mengamankan data aktual. Memisahkan keduanya = efisien & aman. <b>90% "IPsec tidak up" = Phase 1 gagal</b> (PSK salah, peer IP salah, proposal tak cocok).</p>
<h3>ESP vs AH & Tunnel vs Transport</h3>
<ul>
<li><b>ESP (Encapsulating Security Payload):</b> enkripsi + integrity — <b>yang dipakai 99% kasus</b>.</li>
<li><b>AH (Authentication Header):</b> integrity saja, tanpa enkripsi — jarang dipakai (NAT merusaknya!).</li>
<li><b>Tunnel mode:</b> seluruh paket IP dibungkus (untuk site-to-site) — <b>standar VPN antar-site</b>.</li>
<li><b>Transport mode:</b> hanya payload dienkripsi (untuk host-to-host) — jarang di VPN site.</li>
</ul>
<h3>Troubleshooting IPsec per Fase</h3>
<ol>
<li><b>Phase 1 DOWN:</b> cek: IP peer benar? PSK sama persis di kedua sisi? Proposal (encryption/hash/DH group) cocok? Port UDP 500/4500 diizinkan firewall? (NAT-T memakai UDP 4500 bila ada NAT di tengah.)</li>
<li><b>Phase 1 UP, Phase 2 DOWN:</b> cek: subnet yang dilindungi (<i>interesting traffic</i>/policy) cocok & simetris di kedua sisi? Proposal Phase 2 cocok?</li>
<li><b>Keduanya UP tapi tak bisa ping:</b> bukan IPsec-nya — cek routing & firewall (paket terenkripsi baik-baik saja, tetapi tidak di-routing).</li>
</ol>
<div class="callout blue"><div class="t">IPsec vs WireGuard — Kapan Apa?</div><p style="margin:4px 0 0"><b>IPsec:</b> standar enterprise, didukung semua vendor (Cisco, FortiGate, MikroTik), cocok multi-vendor & compliance ketat. <b>WireGuard (31.6):</b> jauh lebih sederhana & cepat dikonfigurasi, ideal untuk site-to-site modern & remote access — tetapi dukungannya di perangkat enterprise lama terbatas. Kuasai konsep IPsec (wajib interview); praktikkan WireGuard (praktis).</p></div>`,
      terms: [
        ['IPsec', 'IP Security — standar enkripsi level IP (ESP): confidentiality + integrity + authentication.'],
        ['IKE / Phase 1', 'Internet Key Exchange — jabat tangan autentikasi & pertukaran kunci.'],
        ['Phase 2 / IPsec SA', 'Kesepakatan parameter enkripsi data aktual.'],
        ['ESP', 'Encapsulating Security Payload — enkripsi + integrity; mode IPsec yang umum.'],
        ['Tunnel mode', 'Mode IPsec membungkus seluruh paket — standar site-to-site.'],
        ['NAT-T', 'NAT Traversal — IPsec via UDP 4500 agar lolos NAT di tengah jalan.'],
      ],
      diagram: `<pre>   IPsec: DUA FASE sebelum data mengalir

   [R-JKT]                              [R-MKS]
      │  PHASE 1 (IKE, UDP 500):           │
      │  "kamu siapa? ini PSK saya"        │
      │  ◀────────── salaman ──────────▶   │  GAGAL di sini? cek:
      │  "cocok! ini kunci sesi"           │  PSK, peer IP, proposal, UDP 500
      │                                    │
      │  PHASE 2 (ESP):                    │
      │  "pakai AES-256 + SHA256 ya"       │
      │  ◀────────── sepakat ──────────▶   │  GAGAL di sini? cek:
      │                                    │  subnet policy simetris, proposal P2
      │  DATA TERENKRIPSI mengalir          │
      │  ◀═══════════════════════════─▶   │  UP tapi tak bisa ping?
                                           → cek ROUTING & firewall!

   90% kegagalan = Phase 1 (autentikasi/proposal).</pre>`,
      scenario: 'VPN ke vendor tidak pernah UP. Log: Phase 1 gagal terus. Setelah 2 jam debug, ketahuan: PSK di satu sisi ada spasi di akhir ("Rahasia123 " vs "Rahasia123") — copy-paste dari Word. Moral: Phase 1 sensitif terhadap detail terkecil; cocokkan parameter baris per baris, jangan "kelihatannya sama".',
      bestPractices: 'Dokumentasikan parameter IPsec kedua sisi dalam satu tabel (peer IP, PSK location, proposal P1/P2, subnet). Saat troubleshooting, bandingkan tabel — jangan hafalan.',
      security: 'Pakai DH group & algoritma modern (AES-256, SHA-256, DH group 14+); hindari DES/3DES/MD5 yang sudah lemah. PSK minimal 20 karakter acak — simpan di password manager, bukan di chat.',
      challenge: 'Buat tabel parameter IPsec untuk skenario Jakarta–Makassar: isi kolom Phase 1 (peer, PSK ref, encryption, hash, DH) dan Phase 2 (proposal, subnet lokal/remote). Inilah "kontrak" VPN profesional.',
      interviewQ: 'Q: "IPsec Phase 1 UP tetapi Phase 2 DOWN. Apa yang kamu cek?" — A: Parameter Phase 2: subnet/policy yang dilindungi harus simetris & cocok di kedua sisi, plus proposal Phase 2 (encryption/hash) harus sama.',
      quiz: [
        { q: 'Fungsi IPsec Phase 1 adalah…', options: ['Mengirim data', 'Autentikasi peer & membangun kanal aman untuk pertukaran kunci (IKE)', 'Routing', 'Kompresi'], answer: 1, explain: 'Phase 1 = jabat tangan; 90% kegagalan IPsec terjadi di sini (PSK/proposal/peer salah).' },
        { q: 'Phase 1 UP, Phase 2 DOWN. Kemungkinan penyebab?', options: ['Kabel putus', 'Subnet policy tidak simetris / proposal Phase 2 tak cocok', 'Listrik padam', 'DNS gagal'], answer: 1, explain: 'Phase 2 menyepakati "data apa & bagaimana dienkripsi" — ketidakcocokan di sanalah masalahnya.' },
        { q: 'Kombinasi IPsec yang umum untuk site-to-site?', options: ['AH + transport', 'ESP + tunnel mode', 'Tanpa enkripsi', 'GRE saja'], answer: 1, explain: 'ESP = enkripsi+integrity; tunnel mode = bungkus seluruh paket — standar VPN antar-site.' },
      ],
    },
    {
      id: '31.6',
      title: 'WireGuard',
      body: `<p><b>WireGuard</b> adalah VPN modern yang terkenal karena <b>sangat sederhana</b>: konfigurasinya puluhan baris (IPsec bisa ratusan), kodenya ramping (mudah diaudit), dan performanya tinggi. Ia memakai <b>kriptografi kunci publik</b> (seperti SSH): tiap sisi punya <i>private key</i> (rahasia) & <i>public key</i> (dibagikan). <b>Rekomendasi kurikulum untuk praktik site-to-site modern.</b></p>
<h3>Konsep Kunci: Cryptokey Routing</h3>
<p>Di WireGuard, <b>public key = identitas</b>, dan <b><code>allowed-address</code> = "kunci publik ini boleh mengirim/menerima subnet apa"</b>. Ini sekaligus menjadi <i>tabel routing</i>-nya WireGuard:</p>
<ul>
<li><code>allowed-address=10.10.0.0/16</code> pada peer Makassar artinya: "trafik ke 10.10.0.0/16 → enkripsi untuk peer ini; trafik <i>dari</i> peer ini <i>hanya</i> diterima bila sumbernya 10.10.0.0/16."</li>
<li>Satu baris = autentikasi + routing + firewall sekaligus. Elegan — dan <i>satu baris salah = tunnel salah arah</i>.</li>
</ul>
<h3>Contoh: WireGuard Site-to-Site di MikroTik (Jakarta) — Per Baris</h3>
<pre>[admin@R-JKT] &gt; /interface wireguard add name=wg0 listen-port=13231 private-key="PRIVATE-JKT"
  !＾Buat interface WG: dengar di UDP 13231, pakai private key Jakarta.
  ! Alasan: UDP 13231 = "pintu" handshake; private key = identitas rahasia.
  ! Generate key: /interface wireguard → tombol generate (RouterOS 7+) atau "wg genkey".
[admin@R-JKT] &gt; /interface wireguard peers add interface=wg0 public-key="PUBLIC-MKS" endpoint-address=198.51.100.1 endpoint-port=13231 allowed-address=10.10.0.0/16,172.16.1.2/32
  !＾Daarkan PEER (Makassar):
  ! • public-key = identitas lawan (seperti "nomor KTP" yang diverifikasi).
  ! • endpoint-address/port = alamat publik lawan (ke mana handshake dikirim).
  ! • allowed-address = subnet Makassar (10.10.0.0/16) + IP tunnel lawan (.2):
  !   "trafik ke sini → via peer ini; trafik dari peer ini valid bila dari sini."
[admin@R-JKT] &gt; /ip address add address=172.16.1.1/30 interface=wg0
  !＾IP tunnel /30 di interface WG (.1 JKT, .2 MKS) — untuk ping & routing.
[admin@R-JKT] &gt; /ip firewall filter add chain=input protocol=udp dst-port=13231 action=accept place-before=0
  !＾WAJIB: izinkan UDP 13231 masuk — handshake WireGuard. Tanpa ini tunnel tak terbentuk.
[admin@R-JKT] &gt; /ip route add dst-address=10.10.0.0/16 gateway=wg0
  !＾Rute statis: subnet Makassar via interface WG. (Alternatif: andalkan
  ! allowed-address + routing dinamis; eksplisit lebih jelas untuk belajar.)</pre>
<p>Di Makassar: cermin — private key sendiri, peer dengan public key Jakarta, endpoint 203.0.113.1, allowed-address=192.168.0.0/16,172.16.1.1/32, IP tunnel 172.16.1.2/30, route 192.168.0.0/16 via wg0.</p>
<h3>Verifikasi & Troubleshooting</h3>
<pre>[admin@R-JKT] &gt; /interface wireguard peers print
  !＾Lihat "last-handshake": baru saja (detik/menit) = tunnel HIDUP.
  ! last-handshake "never" = handshake tak pernah berhasil → cek:
  !   1) UDP 13231 diizinkan firewall KEDUA sisi?  2) endpoint-address benar?
  !   3) public key TERTUKAR? (public JKT harus di MKS & sebaliknya!)
  !   4) Salah satu sisi di belakang NAT? → tambah persistent-keepalive=25s.
[admin@R-JKT] &gt; ping 172.16.1.2
  !＾Ping IP tunnel lawan, lalu ping 10.10.20.50 (subnet seberang).</pre>
<div class="callout"><div class="t">Catatan Versi RouterOS</div><p style="margin:4px 0 0">WireGuard bawaan mulai <b>RouterOS 7</b>. Di RouterOS 6 tidak ada — harus upgrade atau pakai IPsec/GRE. Selalu cek versi (<code>/system package print</code>) sebelum merancang: <i>fitur mengikuti versi</i>, dan ini alasan dokumentasi versi itu penting.</p></div>`,
      terms: [
        ['WireGuard', 'VPN modern berbasis kriptografi kunci publik — sederhana, cepat, mudah dikonfigurasi.'],
        ['Private/public key', 'Pasangan kunci: private rahasia (identitasmu), public dibagikan (identitasmu bagi lawan).'],
        ['Cryptokey routing', 'allowed-address = peta "kunci publik ↔ subnet yang boleh lewat" — autentikasi+routing sekaligus.'],
        ['Handshake', 'Jabat tangan awal WireGuard (UDP) — "last-handshake" adalah indikator tunnel hidup.'],
        ['Keepalive', 'Paket periodik agar NAT di tengah tidak menutup "lubang" koneksi UDP.'],
      ],
      diagram: `<pre>   WIREGUARD Jakarta ── Makassar (konsep cryptokey routing)

   [R-JKT]                                    [R-MKS]
   priv: PRIV-JKT                             priv: PRIV-MKS
   peer: PUBLIC-MKS                           peer: PUBLIC-JKT
     allowed: 10.10.0.0/16                      allowed: 192.168.0.0/16
     endpoint: 198.51.100.1:13231               endpoint: 203.0.113.1:13231
        │  UDP 13231, handshake tiap 2 mnt         │
        ╞══════════ terowongan terenkripsi ════════╡
        │  "last-handshake: 45s ago" = HIDUP ✔     │

   Public key TERTUKAR = kesalahan #1. Cek silang seperti cek nomor rekening.</pre>`,
      scenario: 'Migrasi 3 cabang dari IPsec ke WireGuard: waktu konfigurasi per site turun dari 2 jam menjadi 20 menit, dan troubleshooting "Phase 1/Phase 2" hilang — indikatornya tinggal satu: last-handshake. Engineer junior pun bisa deploy. Moral: kesederhanaan adalah fitur keamanan (semakin sederhana, semakin sedikit yang bisa salah).',
      bestPractices: 'Simpan private key seperti password (jangan di chat/git publik!). Satu keypair per device; rotasi bila ada indikasi bocor. Dokumentasikan peer ↔ public key ↔ allowed-address dalam tabel.',
      security: 'WireGuard tidak punya "agility" algoritma (satu set kriptografi) — justru kelebihannya: tidak ada pilihan lemah yang bisa salah dipilih. Pastikan UDP 13231 hanya dibuka untuk IP peer yang dikenal (bukan ke semua internet).',
      challenge: 'Bangun WireGuard antara 2 MikroTik CHR (RouterOS 7) di lab: generate keypair, tukar public key, konfigurasi per contoh, verifikasi last-handshake + ping 3 lapis (tunnel, subnet seberang). Sengaja tukar public key dan amati gejalanya.',
      interviewQ: 'Q: "Jelaskan cryptokey routing di WireGuard." — A: allowed-address memetakan public key peer ke subnet yang boleh lewat — berfungsi sekaligus sebagai autentikasi, routing, dan filter; satu baris salah = traffic salah arah/ditolak.',
      quiz: [
        { q: 'Fungsi "allowed-address" pada peer WireGuard adalah…', options: ['Daftar website boleh dibuka', 'Cryptokey routing: subnet yang boleh lewat peer ini (sekaligus autentikasi & routing)', 'Password Wi-Fi', 'Jadwal backup'], answer: 1, explain: 'Satu baris allowed-address = "peer berkunci-publik-ini sah untuk subnet ini" — inti kesederhanaan WireGuard.' },
        { q: 'Indikator tunnel WireGuard hidup di MikroTik?', options: ['Lampu berkedip', '"last-handshake" baru saja pada /interface wireguard peers print', 'Suhu router', 'Jumlah user'], answer: 1, explain: 'Handshake berkala = tunnel hidup; "never"/basi = selidiki firewall, endpoint, atau kunci tertukar.' },
        { q: 'Kesalahan konfigurasi WireGuard paling umum?', options: ['Kabel putus', 'Public key tertukar / endpoint salah / UDP 13231 diblokir firewall', 'DNS salah', 'VLAN salah'], answer: 1, explain: 'Tiga serangkai: kunci (public tertukar), alamat (endpoint), dan firewall (UDP 13231) — cek berurutan.' },
      ],
    },
    {
      id: '31.7',
      title: 'Remote Access VPN',
      body: `<p><b>Remote Access VPN</b> menghubungkan <b>satu user</b> (laptop/HP) ke jaringan kantor dari mana saja — berbeda dengan site-to-site (31.2) yang menghubungkan <i>jaringan</i>. Use case: kerja dari rumah (WFH), dinas luar kota, vendor support. User menginstal <b>client VPN</b>, login, dan "seolah-olah" duduk di kantor.</p>
<h3>Arsitektur</h3>
<ul>
<li><b>VPN server/concentrator</b> di kantor (bisa di firewall/router) — melayani ratusan koneksi user.</li>
<li><b>Client</b> di device user (WireGuard app, FortiClient, dsb.) + kredensial (user/pass + sertifikat/MFA).</li>
<li><b>IP pool VPN</b> khusus, mis. 172.20.0.0/24 — user VPN dapat IP dari sini (terpisah dari VLAN kantor agar mudah dikontrol).</li>
<li><b>Firewall policy:</b> pool VPN → sumber daya internal apa saja yang boleh? (least privilege per user/grup!)</li>
</ul>
<h3>Full Tunnel vs Split Tunnel</h3>
<div class="tblwrap"><table>
<tr><th>Mode</th><th>Cara Kerja</th><th>Kelebihan</th><th>Kekurangan</th></tr>
<tr><td><b>Full tunnel</b></td><td>Semua traffic user (termasuk YouTube) lewat kantor</td><td>Kontrol & inspeksi penuh; IP publik = kantor</td><td>Bebani link kantor; browsing lambat</td></tr>
<tr><td><b>Split tunnel</b></td><td>Hanya traffic kantor via VPN; internet langsung</td><td>Ringan, browsing cepat</td><td>Traffic internet user tak terinspeksi</td></tr>
</table></div>
<p><i>Alasan memilih:</i> full tunnel untuk keamanan ketat (keuangan, data sensitif); split tunnel untuk kenyamanan & efisiensi (umum dipakai). Keputusan ini = kebijakan keamanan perusahaan.</p>
<h3>Keamanan Remote Access (Non-Negotiable)</h3>
<ul>
<li><b>MFA (Multi-Factor Authentication):</b> password saja tidak cukup untuk akses dari internet — wajib faktor kedua (OTP/authenticator).</li>
<li><b>Sertifikat device</b> bila memungkinkan: hanya laptop kantor yang boleh connect.</li>
<li><b>Least privilege per grup:</b> finance hanya ke server finance; vendor hanya ke server yang ia support + dibatasi waktu.</li>
<li><b>Log & monitor:</b> setiap koneksi tercatat (siapa, kapan, dari IP mana) — anomali (login jam 3 pagi dari luar negeri) = alarm.</li>
</ul>
<div class="callout"><div class="t">BAHAYA: VPN Tanpa MFA</div><p style="margin:4px 0 0">VPN adalah <b>pintu depan ke jaringan internal dari internet</b>. Password bocor (phishing) tanpa MFA = penyerang langsung "duduk di dalam kantor". Insiden ransomware besar sering bermula dari VPN tanpa MFA. Ini bukan rekomendasi — ini syarat.</p></div>`,
      terms: [
        ['Remote access VPN', 'VPN per-user: satu device terhubung ke jaringan kantor dari mana saja.'],
        ['Full tunnel', 'Semua traffic via VPN/kantor — aman, berat.'],
        ['Split tunnel', 'Hanya traffic kantor via VPN — ringan, kurang terinspeksi.'],
        ['MFA', 'Multi-Factor Authentication — verifikasi ganda (password + OTP); wajib untuk VPN.'],
        ['IP pool VPN', 'Range IP khusus untuk client VPN agar mudah dikenali & dikontrol.'],
      ],
      diagram: `<pre>   REMOTE ACCESS VPN: user "pindah" ke kantor secara virtual

   [Laptop di rumah]  ═══ VPN (MFA!) ═══▶ [VPN Server kantor]
        │                                        │
        │  dapat IP 172.20.0.5                   │  firewall: pool VPN →
        │  (pool VPN khusus)                      │  hanya resource sesuai grup
        ▼                                        ▼
   Full tunnel: YouTube pun lewat kantor.   Split tunnel: YouTube langsung,
   (aman, berat)                             hanya 192.168.x.x via VPN. (ringan)</pre>`,
      scenario: 'Karyawan WFH mengakses file server via VPN split-tunnel. Suatu hari laptopnya terinfeksi malware — tetapi firewall membatasi pool VPN hanya ke file server (bukan ke seluruh LAN), dan EDR mendeteksi anomali. Dampak terkendali. Moral: VPN + least privilege + MFA = WFH yang aman; VPN polos = memperluas LAN ke internet.',
      bestPractices: 'Standar remote access: MFA wajib, IP pool khusus, policy per grup (bukan per orang), split/full tunnel sesuai kebijakan, dan review akses vendor berkala (cabut saat kontrak selesai!).',
      security: 'Akses VPN vendor/kontraktor adalah risiko tertinggi: batasi waktu (hanya jam kerja), batasi tujuan (satu server), dan nonaktifkan segera setelah pekerjaan selesai. "VPN vendor yang lupa dicabut" adalah temuan audit klasik.',
      challenge: 'Rancang kebijakan remote-access 1 halaman untuk kantormu: siapa boleh, mode apa (full/split) per grup, MFA bagaimana, dan pool IP berapa. Presentasikan seolah ke atasan.',
      interviewQ: 'Q: "Kapan memakai full tunnel vs split tunnel?" — A: Full tunnel saat butuh kontrol/inspeksi penuh (data sensitif, compliance) — semua traffic lewat kantor; split tunnel untuk efisiensi & kenyamanan umum — hanya traffic kantor via VPN.',
      quiz: [
        { q: 'Perbedaan site-to-site vs remote-access VPN?', options: ['Sama saja', 'Site-to-site: jaringan-ke-jaringan permanen; remote-access: user-ke-kantor temporer via client', 'Remote lebih cepat', 'Site-to-site tanpa enkripsi'], answer: 1, explain: 'Site-to-site transparan & permanen (router); remote-access per-user & temporer (client + login).' },
        { q: 'Mengapa MFA wajib untuk remote-access VPN?', options: ['Agar modern', 'VPN adalah pintu dari internet ke LAN — password bocor tanpa MFA = penyerang masuk', 'Agar lambat', 'Syarat app'], answer: 1, explain: 'Phishing mencuri password setiap hari; MFA memastikan pencuri password tetap tidak bisa masuk.' },
        { q: 'Keuntungan split tunnel?', options: ['Lebih aman total', 'Ringan: hanya traffic kantor via VPN, internet langsung — browsing cepat & hemat link kantor', 'Tanpa konfigurasi', 'Tanpa VPN'], answer: 1, explain: 'Tradeoff: efisiensi vs inspeksi penuh; pilih berdasar kebijakan keamanan perusahaan.' },
      ],
    },
    {
      id: '31.8',
      title: 'Branch Office',
      body: `<p>Merancang <b>kantor cabang</b> (branch office) adalah penerapan seluruh kurikulum dalam satu site kecil: segmentasi, IP plan, DHCP, firewall, VPN ke pusat, dan monitoring — dengan prinsip <b>"cabang harus sederhana & seragam"</b> karena tidak ada engineer di sana.</p>
<h3>Desain Referensi: Cabang Makassar</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Desain</th><th>Alasan</th></tr>
<tr><td>Router</td><td>MikroTik (1 unit, VRRP bila 2)</td><td>Murah, WireGuard bawaan (RoS 7), cukup untuk cabang</td></tr>
<tr><td>Switch</td><td>1–2 unit managed</td><td>VLAN 20/40; port-security di port user</td></tr>
<tr><td>VLAN 20 OFFICE</td><td>10.10.20.0/24, DHCP</td><td>VLAN ID sama dengan pusat (konsisten), supernet beda</td></tr>
<tr><td>VLAN 40 GUEST</td><td>10.10.40.0/24, DHCP terpisah</td><td>Tamu terisolasi, hanya internet</td></tr>
<tr><td>VPN</td><td>WireGuard ke Jakarta</td><td>Sederhana, mudah di-troubleshoot jarak jauh</td></tr>
<tr><td>Internet</td><td>1 ISP (+ 4G backup bila kritis)</td><td>Dual ISP penuh biasanya overkill untuk cabang kecil</td></tr>
<tr><td>Monitoring</td><td>Zabbix agent / SNMP ke server pusat via tunnel</td><td>NOC pusat memantau cabang (tidak butuh orang di sana)</td></tr>
</table></div>
<h3>Prinsip "Zero-Touch" Cabang</h3>
<ul>
<li><b>Template konfigurasi:</b> semua cabang memakai template yang sama — beda hanya IP & kunci. Cabang baru = copy template + ganti 5 baris.</li>
<li><b>Backup otomatis</b> ke pusat tiap malam (29.12) — bila router cabang mati, kirim unit baru + restore = hidup.</li>
<li><b>Remote management</b> via tunnel (SSH dari VLAN 99 pusat) — teknisi datang hanya untuk fisik.</li>
<li><b>Dokumentasi 1 halaman per cabang:</b> IP plan, kontak, ISP, dan "kalau mati total, lakukan ini" untuk non-teknisi (colok ulang dalam urutan X).</li>
</ul>
<div class="callout blue"><div class="t">Skala Bertahap</div><p style="margin:4px 0 0"><b>Cabang kecil (5–20 user):</b> desain di atas cukup. <b>Cabang besar (100+ user):</b> tambah switch distribusi, VRRP dual router, dan dual ISP — pada dasarnya "kantor pusat mini". Jangan over-engineering cabang kecil; jangan under-engineering cabang besar.</p></div>`,
      terms: [
        ['Branch office', 'Kantor cabang — site kecil yang terhubung ke pusat via WAN/VPN.'],
        ['Template konfigurasi', 'Konfigurasi baku yang dipakai ulang tiap cabang — hanya parameter yang diganti.'],
        ['Zero-touch', 'Prinsip: cabang bisa di-deploy & dikelola jarak jauh tanpa engineer di lokasi.'],
      ],
      diagram: `<pre>   CABANG MAKASSAR — desain referensi (sederhana & seragam)

   [ISP] ── [R-MKS MikroTik] ══WireGuard══▶ [Jakarta]
              │  10.10.20.1 (VLAN 20)
              │  10.10.40.1 (VLAN 40)
         ┌────┴────┐
      [SW] trunk  [AP]
       │ 20/40
   [PC 10.10.20.x] [Tamu 10.10.40.x → internet saja]

   Monitoring: SNMP via tunnel → Zabbix pusat. Backup: otomatis tiap malam.</pre>`,
      scenario: 'Cabang baru di Surabaya harus live dalam 2 minggu. Dengan template: router dikonfigurasi di Jakarta (ganti IP, WireGuard key, DHCP), dikirim via ekspedisi, teknisi lokal hanya colok kabel sesuai diagram 1 halaman. Hari-H: NOC verifikasi tunnel up dari pusat. Total engineer-day di lokasi: 0. Inilah kekuatan standardisasi.',
      bestPractices: 'Satu template, satu dokumentasi 1 halaman per cabang, monitoring & backup terpusat. Cabang yang "unik" = cabang yang sulit di-troubleshoot jam 2 pagi.',
      security: 'Terapkan kebijakan yang sama seperti pusat (versi mini): guest isolation, port-security, SSH hanya via tunnel dari pusat, dan tidak ada password default. Cabang kecil bukan alasan keamanan kecil.',
      challenge: 'Buat template konfigurasi cabang (MikroTik) dengan placeholder [IP-SITE], [WG-KEY], [VLAN]. Lalu "deploy" untuk site khayalan Balikpapan (10.30.0.0/16) dengan mengisi placeholder — rasakan kecepatan standardisasi.',
      interviewQ: 'Q: "Bagaimana merancang cabang agar mudah dikelola tanpa engineer di lokasi?" — A: Template konfigurasi seragam, monitoring & backup terpusat via tunnel, remote management dari pusat, dan dokumentasi 1 halaman + instruksi fisik sederhana untuk non-teknisi.',
      quiz: [
        { q: 'Prinsip utama desain cabang adalah…', options: ['Semahal mungkin', 'Sederhana & seragam (template) agar bisa dikelola jarak jauh', 'Unik tiap cabang', 'Tanpa monitoring'], answer: 1, explain: 'Standardisasi = deploy cepat, troubleshoot mudah, tak butuh engineer di lokasi.' },
        { q: 'Mengapa VLAN ID sama tetapi supernet berbeda antar-site?', options: ['Kebetulan', 'Kebijakan konsisten (VLAN 20 selalu OFFICE) + routing tidak ambigu/tabrakan', 'Syarat vendor', 'Agar lambat'], answer: 1, explain: 'ID konsisten = kebijakan portabel; supernet beda = routing jelas antar-site.' },
        { q: 'Untuk cabang kecil, pilihan VPN yang praktis?', options: ['MPLS mahal', 'WireGuard — sederhana, mudah deploy & troubleshoot jarak jauh', 'Tanpa VPN', 'Leased line selalu'], answer: 1, explain: 'WireGuard meminimalkan kompleksitas — krusial saat tak ada engineer di lokasi.' },
      ],
    },
    {
      id: '31.9',
      title: 'Head Office',
      body: `<p><b>Kantor pusat</b> (head office) adalah <b>hub</b> dari topologi WAN: menampung server pusat, internet utama, VPN concentrator untuk semua cabang, dan NOC/monitoring. Jika cabang didesain untuk <i>kesederhanaan</i>, pusat didesain untuk <i>kapasitas, redundancy, dan kontrol</i>.</p>
<h3>Peran & Komponen Pusat (Jakarta)</h3>
<div class="tblwrap"><table>
<tr><th>Fungsi</th><th>Implementasi</th><th>Alasan</th></tr>
<tr><td>Server pusat</td><td>VLAN 30: 192.168.30.0/24</td><td>Aplikasi, file, database dipakai semua cabang</td></tr>
<tr><td>VPN hub</td><td>WireGuard/IPsec terminasi semua cabang</td><td>Satu titik kontrol tunnel (hub-and-spoke)</td></tr>
<tr><td>Internet utama</td><td>Dual ISP + firewall HA</td><td>Pusat down = semua cabang terdampak → HA wajib (Part 30)</td></tr>
<tr><td>Gateway redundancy</td><td>VRRP/HSRP per VLAN</td><td>150+ user tak boleh bergantung 1 router</td></tr>
<tr><td>Monitoring</td><td>Zabbix + Grafana + syslog (VLAN 99)</td><td>Memantau pusat + semua cabang via tunnel</td></tr>
<tr><td>Management</td><td>VLAN 99 terisolasi</td><td>Bidang kontrol hanya untuk admin (Part 29)</td></tr>
</table></div>
<h3>Topologi: Hub-and-Spoke</h3>
<p>Semua cabang terhubung <b>ke pusat</b> (spoke → hub); traffic antar-cabang <b>lewat pusat</b>. <i>Alasan:</i> sederhana (N cabang = N tunnel, bukan N²), kontrol terpusat (firewall policy di hub), dan cocok dengan pola traffic (cabang → server pusat).</p>
<ul>
<li><b>Kelebihan:</b> sederhana, murah, mudah dikontrol & dimonitor.</li>
<li><b>Kekurangan:</b> pusat = SPOF raksasa → <b>wajib HA penuh</b> (dual router, dual ISP, dual firewall) + latency cabang-ke-cabang 2x hop.</li>
<li><b>Alternatif:</b> full-mesh (cabang↔cabang langsung) — hanya bila traffic antar-cabang besar & latency kritis; kompleksitas N².</li>
</ul>
<h3>Routing di Hub</h3>
<pre>! Di R-JKT: satu route per cabang via tunnel masing-masing
/ip route add dst-address=10.10.0.0/16 gateway=wg-mks   ! Makassar
/ip route add dst-address=10.20.0.0/16 gateway=wg-sby   ! Surabaya
  !＾Hub-and-spoke: tiap spoke = satu route. Skalabel & jelas.
  ! (Alternatif dinamis: OSPF via tunnel — untuk 10+ cabang.)</pre>
<div class="callout"><div class="t">Pusat = Target Utama</div><p style="margin:4px 0 0">Semua telur di keranjang pusat → keranjangnya harus <b>lapis baja</b>: HA di semua lapis (Part 30), keamanan berlapis (Part 29), backup & DR plan. Anggaran HA terbesar selalu di pusat — dan itu benar secara matematis (blast radius terbesar).</p></div>`,
      terms: [
        ['Head office / Hub', 'Kantor pusat — titik pusat topologi WAN, server, dan kontrol.'],
        ['Hub-and-spoke', 'Topologi: semua cabang terhubung ke pusat; antar-cabang via pusat.'],
        ['Full-mesh', 'Topologi: tiap site terhubung langsung ke tiap site lain — kompleksitas N².'],
      ],
      diagram: `<pre>   HUB-AND-SPOKE: Jakarta pusat, cabang sebagai spoke

                        [JAKARTA - HUB]
                   (server, dual ISP, VRRP, Zabbix)
                    ╱        │          ╲
         WireGuard ╱   WireGuard│    WireGuard╲
                  ╱            │              ╲
        [Makassar]        [Surabaya]        [Balikpapan]
        10.10.0.0/16      10.20.0.0/16      10.30.0.0/16

   Makassar → Surabaya = via Jakarta (2 hop).
   N cabang = N tunnel (bukan N²). Pusat = SPOF → HA penuh wajib.</pre>`,
      scenario: 'Pusat merencanakan pindah gedung. Karena semua cabang hub-and-spoke ke IP publik pusat, migrasi = koordinasi besar: IP publik baru, tunnel re-point, DNS, dan jendela maintenance. Pelajaran: desain pusat dengan <i>portabilitas</i> (IP publik portable / DNS dinamis untuk tunnel) sejak awal — atau bayar mahal saat pindah.',
      bestPractices: 'Dokumentasikan "pusat" sebagai aset kritis #1: diagram, IP plan, daftar tunnel, prosedur failover, dan kontak darurat. DR plan (disaster recovery) pusat = dokumen terpenting tim network.',
      security: 'Pusat menampung segalanya → jadi target utama. Terapkan zero-trust bertahap: bahkan traffic dari cabang via tunnel tetap melewati firewall policy (jangan "percaya" tunnel!).',
      challenge: 'Rancang hub-and-spoke untuk 4 site di kertas: tentukan supernet tiap site, daftar tunnel di hub, dan tabel routing hub. Lalu jawab: apa yang terjadi bila hub down? (Uji pemahaman SPOF.)',
      interviewQ: 'Q: "Jelaskan hub-and-spoke, kelebihan-kekurangannya, dan implikasinya." — A: Semua cabang ke pusat: sederhana (N tunnel), kontrol terpusat; tetapi pusat = SPOF raksasa (wajib HA penuh) dan antar-cabang 2 hop. Alternatif full-mesh bila traffic antar-cabang besar.',
      quiz: [
        { q: 'Kelebihan utama hub-and-spoke?', options: ['Latency terkecil', 'Sederhana & skalabel: N cabang = N tunnel, kontrol terpusat', 'Tanpa pusat', 'Gratis'], answer: 1, explain: 'Linear, bukan kuadratik; cocok untuk pola traffic cabang→pusat yang dominan.' },
        { q: 'Konsekuensi pusat sebagai hub?', options: ['Tidak ada', 'Pusat = SPOF raksasa → wajib HA penuh (dual router/ISP/firewall)', 'Cabang tak butuh VPN', 'Internet gratis'], answer: 1, explain: 'Semua bergantung ke pusat; anggaran HA terbesar memang harus di sana.' },
        { q: 'Kapan full-mesh dipilih dibanding hub-and-spoke?', options: ['Selalu', 'Bila traffic antar-cabang besar & latency kritis — dengan biaya kompleksitas N²', 'Tidak pernah', 'Bila murah'], answer: 1, explain: 'Mesh memangkas 2-hop menjadi langsung, tetapi kompleksitas & biaya tunnel tumbuh kuadratik.' },
      ],
    },
    {
      id: '31.10',
      title: 'WAN Troubleshooting',
      body: `<p>Troubleshooting WAN/VPN memakai <b>metodologi yang sama</b> (Part 28) dengan <b>urutan khas WAN</b>: <b>publik → tunnel → routing → aplikasi</b>. Jangan melompat ke "settingan VPN" sebelum memastikan fondasinya (konektivitas publik) sehat — 50% "VPN rusak" ternyata masalah di bawahnya.</p>
<h3>Urutan Diagnosis WAN (Hafalkan!)</h3>
<ol>
<li><b>Lapisan publik:</b> <code>ping [IP-publik-lawan]</code> dari router. Gagal? → masalah ISP/routing internet/NAT — <b>bukan</b> VPN-nya. Perbaiki dulu.</li>
<li><b>Lapisan tunnel:</b> WireGuard → cek <code>last-handshake</code>; IPsec → cek Phase 1 lalu Phase 2 (31.5); GRE → ping IP tunnel. Tunnel down? → cek firewall (UDP 13231/500/4500, protokol GRE 47), kunci/PSK, endpoint.</li>
<li><b>Lapisan routing:</b> tunnel up tetapi subnet seberang tak terjangkau? → cek route via tunnel di <b>kedua sisi</b> + <code>allowed-address</code> (WireGuard).</li>
<li><b>Lapisan aplikasi/firewall:</b> routing OK tetapi aplikasi gagal? → cek firewall policy di kedua ujung + MTU (31.4/28.16).</li>
</ol>
<h3>Tabel Gejala → Tersangka</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Tersangka Utama</th><th>Perintah Kunci</th></tr>
<tr><td>Tunnel tak pernah up</td><td>Firewall blokir / kunci tertukar / endpoint salah</td><td><code>last-handshake</code>, cek UDP 13231</td></tr>
<tr><td>Tunnel up-down (flapping)</td><td>Link ISP labil / NAT timeout</td><td><code>keepalive</code>, MTR ke publik lawan</td></tr>
<tr><td>Tunnel up, tak bisa ping seberang</td><td>Routing / allowed-address salah</td><td><code>/ip route print</code>, cek allowed-address</td></tr>
<tr><td>Ping kecil OK, transfer macet</td><td><b>MTU</b> (overhead tunnel!)</td><td><code>ping -f -l</code>, MSS clamping</td></tr>
<tr><td>Lambat di jam tertentu</td><td>Congestion link / ISP</td><td>MTR + grafik Zabbix</td></tr>
<tr><td>Putus tiap ~1 jam</td><td>Rekey/DPD agresif / NAT timeout</td><td>keepalive, log IKE</td></tr>
</table></div>
<h3>Checklist "VPN Sehat" (Commissioning)</h3>
<ul>
<li>Ping IP publik lawan &lt;--&gt; (dua arah).</li>
<li>Tunnel up stabil 24 jam (last-handshake segar / SA aktif).</li>
<li>Ping subnet seberang dua arah.</li>
<li>Uji MTU path (<code>ping -f</code>) + terapkan MSS clamping bila perlu.</li>
<li>Uji failover: matikan ISP-A (bila dual) / restart satu sisi — tunnel pulih otomatis?</li>
<li>Monitoring: Zabbix memantau tunnel (ping via tunnel) + alarm bila down.</li>
<li>Dokumentasi: parameter, kunci (di vault!), dan runbook troubleshooting.</li>
</ul>
<div class="callout blue"><div class="t">Menutup Part 31 & Fase 6</div><p style="margin:4px 0 0">Kamu kini bisa: mendiagnosis sistematis (Part 28), mengamankan jaringan (Part 29), membuatnya tahan gagal (Part 30), dan menghubungkan site jarak jauh (Part 31). Fase 7 berikutnya: <b>otomasi</b> (Linux, Python, Ansible) — agar semua yang kamu kuasai bisa di-deploy ke ratusan device dalam hitungan menit, bukan hari.</p></div>`,
      terms: [
        ['Urutan WAN', 'Publik → tunnel → routing → aplikasi: urutan diagnosis VPN yang benar.'],
        ['Flapping', 'Tunnel up-down berulang — indikasi link labil / NAT timeout / rekey agresif.'],
        ['Commissioning', 'Uji terima resmi sebelum layanan dinyatakan live — dengan checklist.'],
        ['DPD', 'Dead Peer Detection — deteksi peer mati pada IPsec untuk re-establish cepat.'],
      ],
      diagram: `<pre>   URUTAN DIAGNOSIS WAN — jangan melompat!

   1. PUBLIK   ping IP-publik lawan ── gagal? → ISP/NAT (BUKAN VPN!)
   2. TUNNEL   last-handshake / Phase1-2 / ping IP tunnel
               down? → firewall, kunci, endpoint
   3. ROUTING  ping subnet seberang ── gagal? → route & allowed-address
   4. APP/FW   aplikasi gagal? → policy firewall + MTU (ping -f)

   Setiap lapisan lolos = eliminasi. Langsung ke "settingan VPN"
   tanpa cek publik = 50% waktu terbuang.</pre>`,
      scenario: 'Cabang lapor "VPN mati total!" Panik. Engineer ikut urutan: ping IP publik cabang → <b>gagal</b>. Ternyata bukan VPN — ISP cabang down (massal). Solusi: alihkan ke link 4G backup sementara (sudah disiapkan). Total 15 menit. Moral: urutan diagnosis mengubah "VPN rusak" menjadi "ISP down + sudah ada backup".',
      bestPractices: 'Tempel urutan "publik → tunnel → routing → aplikasi" di runbook NOC. Untuk tiap tunnel, sediakan "one-page troubleshooter": IP publik kedua sisi, perintah cek, dan kontak ISP.',
      security: 'Jangan troubleshooting VPN dengan menonaktifkan enkripsi/firewall "sementara" — investigasi dalam keadaan aman, atau isolasi dulu. Kunci VPN tidak boleh muncul di tiket/chat biasa.',
      challenge: 'Simulasikan 3 kerusakan di lab (blokir UDP 13231, hapus route, salah allowed-address). Untuk tiap kerusakan: ikuti urutan diagnosis, catat di lapisan mana kamu berhenti. Inilah ujian akhir Part 31.',
      interviewQ: 'Q: "Tunnel WireGuard up tetapi tidak bisa ping subnet seberang. Langkahmu?" — A: Lapisan routing: cek route via tunnel di kedua sisi dan allowed-address peer — tunnel up hanya membuktikan lapisan 2 (tunnel), bukan routing.',
      quiz: [
        { q: 'Urutan diagnosis VPN yang benar?', options: ['Langsung cek settingan VPN', 'Publik → tunnel → routing → aplikasi', 'Restart semua', 'Hubungi ISP dulu'], answer: 1, explain: 'Fondasi dulu: 50% "VPN rusak" ternyata masalah publik/ISP di bawahnya.' },
        { q: 'Ping kecil OK tetapi transfer file via VPN macet. Tersangka?', options: ['Kabel putus', 'MTU — overhead header tunnel membuat paket besar dibuang', 'DNS', 'Switch penuh'], answer: 1, explain: 'Tanda tangan MTU: kecil jalan, besar macet; uji ping -f, atasi dengan MSS clamping.' },
        { q: 'Tunnel WireGuard flapping (up-down berulang). Kemungkinan?', options: ['VLAN salah', 'Link ISP labil / NAT timeout — cek keepalive & MTR ke publik lawan', 'Password salah', 'DHCP penuh'], answer: 1, explain: 'Flapping = ketidakstabilan di bawahnya; keepalive menjaga NAT, MTR membuktikan kualitas link.' },
      ],
    },
  ],
};
