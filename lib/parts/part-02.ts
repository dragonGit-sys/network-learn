// Part 02 — OSI Model & TCP/IP.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
import type { Part } from './types';

export const part02: Part = {
  id: '02',
  number: 'PART 02',
  title: 'OSI Model & TCP/IP',
  phaseId: 'fase-1',
  description: 'Model referensi 7 layer OSI, encapsulation, PDU, dan alur packet dari PC ke server.',
  repoFolder: 'part-02-osi-tcpip',
  objectives: [
    'Menjelaskan mengapa OSI model dibuat dan fungsi masing-masing dari 7 layer-nya.',
    'Membedakan encapsulation, decapsulation, dan nama PDU di setiap layer.',
    'Membandingkan model OSI dengan model TCP/IP serta memetakan keduanya.',
    'Menjelaskan peran MAC address, IP address, dan port number dalam komunikasi jaringan.',
    'Menelusuri perjalanan packet dari PC ke server melewati switch dan router, hop demi hop.',
  ],
  prerequisites: 'Part 01 — Fundamental Networking (topologi, broadcast domain, segmentasi VLAN, empat parameter kualitas jaringan).',
  subbabs: [
    {
      id: '2.1',
      title: 'Mengapa OSI Model Dibuat?',
      body: `<p>Bayangkan tahun 1970-an: setiap vendor jaringan punya "bahasa" sendiri. Komputer IBM hanya bisa bicara dengan komputer IBM (protokol <b>SNA</b>), Digital Equipment punya <b>DECnet</b>, Apple punya <b>AppleTalk</b>. Beli switch vendor A, router vendor B — tidak nyambung. Industri ini seperti menara Babel: semua bicara, tidak ada yang saling mengerti.</p>
<h3>Pengertian: Apa Itu OSI Model?</h3>
<p><b>OSI model</b> (<i>Open Systems Interconnection</i>) adalah kerangka referensi yang diterbitkan oleh <b>ISO</b> (<i>International Organization for Standardization</i>) pada tahun 1984. Ia membagi proses komunikasi jaringan menjadi <b>7 layer (lapisan)</b> fungsi, dari kabel fisik (Layer 1) sampai aplikasi yang dipakai user (Layer 7). Penting dipahami: OSI adalah <b>model konseptual, bukan protokol yang dijalankan</b> — tidak ada device yang "menjalankan OSI". Ia adalah peta, bukan jalannya.</p>
<h3>Mengapa Dibutuhkan?</h3>
<ul>
<li><b>Bahasa bersama:</b> vendor berbeda bisa membuat produk yang interoperable karena semua merujuk fungsi layer yang sama. Switch vendor A tetap bisa meneruskan frame ke switch vendor B.</li>
<li><b>Troubleshooting berlapis:</b> saat jaringan bermasalah, engineer memeriksa layer demi layer (kabel? MAC? IP? port?) alih-alih menebak. Metodologi ini dipakai di seluruh kurikulum, puncaknya di Part 28.</li>
<li><b>Pembagian kerja:</b> setiap layer punya tugas jelas — perubahan di satu layer tidak merusak layer lain. Kamu bisa ganti kabel tembaga ke fiber (Layer 1) tanpa mengubah aplikasi (Layer 7).</li>
<li><b>Bahasa interview & dokumentasi:</b> "masalahnya di Layer 2" langsung dipahami semua engineer di dunia.</li>
</ul>
<h3>Masalah yang Diselesaikan</h3>
<div class="tblwrap"><table>
<tr><th>Sebelum OSI</th><th>Setelah OSI</th></tr>
<tr><td>Protokol proprietary per vendor, tidak interoperable</td><td>Referensi netral vendor — semua vendor merancang ke fungsi yang sama</td></tr>
<tr><td>Troubleshooting tanpa struktur ("coba-coba")</td><td>Isolasi masalah per layer, sistematis</td></tr>
<tr><td>Sulit mengajarkan networking secara terstruktur</td><td>Kurikulum global memakai 7 layer sebagai kerangka</td></tr>
</table></div>
<div class="callout blue"><div class="t">OSI vs TCP/IP — Catatan Awal</div><p style="margin:4px 0 0">Di dunia nyata, protokol yang berjalan adalah <b>TCP/IP</b>, bukan OSI. Tapi OSI tetap diajarkan karena ia peta terbaik untuk <i>berpikir</i> tentang jaringan. Analoginya: TCP/IP adalah mobil yang kamu kendarai, OSI adalah peta jalan yang kamu pakai untuk navigasi. Keduanya dibahas tuntas di sub-bab 2.7–2.8.</p></div>`,
      terms: [
        ['OSI model', 'Kerangka referensi 7 layer dari ISO untuk memahami komunikasi jaringan.'],
        ['ISO', 'International Organization for Standardization — badan yang menerbitkan model OSI (1984).'],
        ['Interoperability', 'Kemampuan produk/jaringan dari vendor berbeda untuk bekerja sama.'],
        ['Proprietary protocol', 'Protokol milik satu vendor yang tidak terbuka untuk vendor lain.'],
      ],
      diagram: `<pre>     SEBELUM OSI (1970-an): MENARA BABEL
[IBM SNA] ✕ [DECnet] ✕ [AppleTalk]  → tidak saling mengerti

     SESUDAH OSI (1984): SATU PETA
        ┌─────────────┐
        │  Layer 7-1  │ ← semua vendor merujuk peta yang sama
        └─────────────┘
[Vendor A] ──peta sama── [Vendor B]  → interoperable</pre>`,
      scenario: 'Perusahaan membeli firewall vendor baru. Karena firewall itu dirancang mengikuti fungsi layer OSI yang standar (filtering di Layer 3/4, inspeksi di Layer 7), ia langsung bisa dipasang di antara switch dan router lama tanpa mengganti seluruh jaringan. Tanpa model referensi bersama, integrasi seperti ini butuh proyek custom berbulan-bulan.',
      bestPractices: 'Biasakan menyebut layer saat mendeskripsikan masalah: "klien dapat IP (L3 OK) tapi tidak bisa buka web (L7 gagal)" — jauh lebih presisi daripada "internetnya rusak".',
      security: 'Model berlapis juga berarti pertahanan berlapis: firewall di L3/L4, enkripsi di L6, autentikasi di L7. Satu layer jebol tidak berarti semua jebol — prinsip defense in depth.',
      challenge: 'Tulis 1 paragraf: mengapa industri jaringan butuh model referensi seperti OSI? Kaitkan dengan pengalamanmu memakai perangkat dari merek berbeda (HP, laptop, router).',
      interviewQ: 'Q: "Apa itu OSI model dan apakah ia protokol yang berjalan di jaringan?" — A: OSI adalah kerangka referensi konseptual 7 layer dari ISO (1984), bukan protokol yang dieksekusi. Protokol nyatanya adalah TCP/IP; OSI dipakai sebagai peta untuk desain, troubleshooting, dan komunikasi antar-engineer.',
      quiz: [
        { q: 'Mengapa OSI model dibuat?', options: ['Agar semua vendor memakai satu merek perangkat', 'Sebagai referensi netral vendor agar produk berbeda bisa interoperable dan troubleshooting terstruktur', 'Untuk menggantikan kabel tembaga dengan fiber', 'Agar internet menjadi lebih cepat'], answer: 1, explain: 'OSI adalah kerangka referensi netral vendor: menyatukan bahasa antar-vendor dan memberi struktur berlapis untuk troubleshooting.' },
        { q: 'Pernyataan yang TEPAT tentang OSI model adalah…', options: ['OSI adalah protokol yang dijalankan router', 'OSI adalah model konseptual 7 layer, bukan protokol yang dieksekusi', 'OSI hanya berlaku untuk jaringan wireless', 'OSI dibuat oleh Cisco pada 2001'], answer: 1, explain: 'OSI diterbitkan ISO tahun 1984 sebagai peta konseptual; protokol yang benar-benar berjalan adalah TCP/IP.' },
        { q: 'Sebelum ada OSI, masalah utama industri jaringan adalah…', options: ['Kabel terlalu mahal', 'Protokol proprietary tiap vendor sehingga perangkat beda merek tidak interoperable', 'Belum ada komputer', 'Listrik belum stabil'], answer: 1, explain: 'Era SNA/DECnet/AppleTalk: tiap vendor punya bahasa sendiri — persis masalah yang diselesaikan model referensi bersama.' },
      ],
    },
    {
      id: '2.2',
      title: '7 Layer OSI',
      body: `<p>Tujuh layer OSI diberi nomor <b>dari bawah (1) ke atas (7)</b>. Layer bawah berurusan dengan hal fisik (kabel, sinyal), layer atas berurusan dengan aplikasi user. Setiap layer hanya "bicara" dengan layer tepat di atas dan di bawahnya — aturan ini disebut <b>adjacent-layer communication</b>.</p>
<h3>Tabel 7 Layer</h3>
<div class="tblwrap"><table>
<tr><th>No</th><th>Nama Layer</th><th>Tugas Singkat</th><th>Contoh Protokol / Device</th></tr>
<tr><td>7</td><td><b>Application</b></td><td>Layanan langsung ke user/aplikasi</td><td>HTTP, DNS, SSH, FTP</td></tr>
<tr><td>6</td><td><b>Presentation</b></td><td>Format data: enkripsi, kompresi, encoding</td><td>TLS/SSL, JPEG, ASCII</td></tr>
<tr><td>5</td><td><b>Session</b></td><td>Membuka, menjaga, menutup sesi komunikasi</td><td>NetBIOS, RPC, SIP</td></tr>
<tr><td>4</td><td><b>Transport</b></td><td>Pengiriman ujung-ke-ujung yang andal; port</td><td>TCP, UDP</td></tr>
<tr><td>3</td><td><b>Network</b></td><td>Pengalamatan logis & routing antar-jaringan</td><td>IP, ICMP — router</td></tr>
<tr><td>2</td><td><b>Data Link</b></td><td>Pengiriman dalam satu jaringan lokal; MAC</td><td>Ethernet — switch</td></tr>
<tr><td>1</td><td><b>Physical</b></td><td>Bit di media: kabel, sinyal, konektor</td><td>Kabel UTP, fiber — hub, repeater</td></tr>
</table></div>
<h3>Cara Menghafal</h3>
<p>Dari atas (7→1): <b>A</b>ll <b>P</b>eople <b>S</b>eem <b>T</b>o <b>N</b>eed <b>D</b>ata <b>P</b>rocessing (Application, Presentation, Session, Transport, Network, Data link, Physical). Dari bawah (1→7) dibaca terbalik: <i>Please Do Not Throw Sausage Pizza Away</i>. Pilih satu yang menempel di kepalamu.</p>
<h3>Pembagian Besar: Upper vs Lower Layers</h3>
<ul>
<li><b>Upper layers (5–7):</b> berurusan dengan <i>aplikasi dan data user</i>. Wilayah utama software developer & system engineer.</li>
<li><b>Lower layers (1–4):</b> berurusan dengan <i>pengiriman data</i>. Wilayah utama network engineer — persis seperti kata Part 01: network engineer bekerja di Layer 1–4.</li>
</ul>
<div class="callout"><div class="t">Jangan Hafal Mati — Pahami Alirannya</div><p style="margin:4px 0 0">Interviewir bisa langsung tahu siapa yang hafal tabel vs paham konsep: yang paham bisa menjelaskan <i>mengapa</i> enkripsi ada di Layer 6 (presentation: format data) dan bukan di Layer 3. Sub-bab berikutnya membedah fungsi tiap layer satu per satu.</p></div>`,
      terms: [
        ['Layer', 'Satu tingkat fungsi dalam model OSI; total ada 7.'],
        ['Upper layers', 'Layer 5–7: berurusan dengan aplikasi dan data user.'],
        ['Lower layers', 'Layer 1–4: berurusan dengan pengiriman data — wilayah network engineer.'],
        ['Adjacent-layer communication', 'Aturan bahwa tiap layer hanya berinteraksi dengan layer tepat di atas/bawahnya.'],
      ],
      diagram: `<pre>          7 LAYER OSI (atas = dekat user)

     ┌─────────────────────────┐
     │ 7 · Application         │ ← HTTP, DNS, SSH
     │ 6 · Presentation        │ ← TLS, enkripsi, format
     │ 5 · Session             │ ← sesi komunikasi
     ├─────────────────────────┤  upper layers (data user)
     │ 4 · Transport           │ ← TCP/UDP, port
     │ 3 · Network             │ ← IP, routing
     │ 2 · Data Link           │ ← MAC, switching
     │ 1 · Physical            │ ← kabel, sinyal, bit
     └─────────────────────────┘  lower layers (pengiriman)</pre>`,
      scenario: 'Di NOC, tiket masuk: "aplikasi kasir tidak bisa konek ke server". Engineer yang berpikir OSI langsung memetakan: ping ke server OK (L3 hidup), telnet ke port aplikasi gagal (L4/port bermasalah) — dalam 2 menit ia tahu masalahnya di layer transport/aplikasi, bukan di kabel atau switch. Tanpa kerangka layer, ia akan mengecek semuanya secara acak.',
      bestPractices: 'Saat belajar protokol baru, selalu tanyakan dulu: "ini layer berapa?" — satu pertanyaan itu menempatkan 80% pemahamanmu.',
      security: 'Serangan bisa menarget layer mana pun: pemotongan kabel (L1), MAC spoofing (L2), IP spoofing (L3), SYN flood (L4), phishing (L7). Memetakan serangan ke layer membantumu memilih pertahanan yang tepat.',
      challenge: 'Tanpa melihat tabel, tulis 7 layer dari nomor 1–7 beserta satu contoh protokol/device tiap layer. Lalu cek — berapa yang benar?',
      interviewQ: 'Q: "Sebutkan 7 layer OSI dan di layer mana network engineer paling banyak bekerja?" — A: Physical, Data Link, Network, Transport, Session, Presentation, Application. Network engineer fokus di Layer 1–4 (pengiriman data); Layer 5–7 lebih banyak wilayah system/developer, tapi tetap harus dipahami untuk troubleshooting.',
      quiz: [
        { q: 'Layer OSI yang mengurusi IP address dan routing adalah…', options: ['Layer 2 — Data Link', 'Layer 3 — Network', 'Layer 4 — Transport', 'Layer 7 — Application'], answer: 1, explain: 'Layer 3 (Network): pengalamatan logis (IP) dan penentuan jalur (routing) antar-jaringan.' },
        { q: 'Switch bekerja terutama di layer…', options: ['Layer 1', 'Layer 2 — Data Link (MAC address, frame)', 'Layer 4', 'Layer 7'], answer: 1, explain: 'Switch meneruskan frame berdasarkan MAC address — fungsi Layer 2 (Data Link).' },
        { q: 'Enkripsi TLS/SSL dipetakan ke layer…', options: ['Layer 3 — Network', 'Layer 6 — Presentation (format/keamanan data)', 'Layer 2 — Data Link', 'Layer 1 — Physical'], answer: 1, explain: 'Presentation (L6) mengurusi representasi data: enkripsi, kompresi, encoding — TLS duduk di sini.' },
      ],
    },
    {
      id: '2.3',
      title: 'Fungsi Setiap Layer',
      body: `<p>Sub-bab ini membedah <b>apa yang sebenarnya dilakukan</b> tiap layer saat kamu membuka sebuah website. Ikuti dari atas ke bawah — persis urutan kerja saat data dikirim.</p>
<h3>Layer 7 — Application: "Apa yang dimau user?"</h3>
<p>Layer ini adalah <b>antarmuka antara aplikasi dan jaringan</b>. Ia tidak mencakup aplikasinya sendiri (browser bukan Layer 7 — <i>protokol HTTP yang dipakai browser</i> yang Layer 7). Fungsinya: menyediakan layanan jaringan ke aplikasi — web browsing (HTTP/HTTPS), transfer file (FTP), remote login (SSH), resolusi nama (DNS), email (SMTP).</p>
<h3>Layer 6 — Presentation: "Formatnya bagaimana?"</h3>
<p>Mengurusi <b>representasi data</b>: enkripsi/dekripsi (TLS/SSL — inilah yang membuat HTTPS aman), kompresi, dan konversi format (karakter encoding, JPEG, MPEG). Alasan ada layer ini: pengirim dan penerima bisa memakai format internal berbeda, tapi sepakat pada format perantara di jaringan.</p>
<h3>Layer 5 — Session: "Kapan mulai & berhentinya?"</h3>
<p>Mengelola <b>sesi komunikasi</b>: membuka, menjaga, dan menutup dialog antar-aplikasi. Termasuk checkpoint & recovery — misal transfer file besar terputus bisa dilanjutkan, bukan diulang dari nol. Contoh: NetBIOS, RPC, SIP (untuk VoIP).</p>
<h3>Layer 4 — Transport: "Sampai dengan utuh?"</h3>
<p>Pengiriman <b>ujung-ke-ujung</b> (<i>end-to-end</i>) antar-host. Tugasnya: memecah data jadi potongan (<b>segmentasi</b>), memberi nomor urut, memastikan sampai dengan benar (TCP: retransmisi jika hilang), dan mengarahkan ke aplikasi yang tepat via <b>port number</b>. Dua protokol utama: <b>TCP</b> (andal, ada konfirmasi) dan <b>UDP</b> (cepat, tanpa konfirmasi) — dibedah di Part 03.</p>
<h3>Layer 3 — Network: "Lewat jalan mana?"</h3>
<p><b>Pengalamatan logis</b> (IP address) dan <b>routing</b>: memilih jalur terbaik melewati banyak jaringan menuju tujuan. Perangkat kuncinya: <b>router</b>. Satuannya disebut <b>packet</b>. Inilah layer yang membuat internet bisa menghubungkan miliaran device.</p>
<h3>Layer 2 — Data Link: "Ke tetangga sebelah mana?"</h3>
<p>Pengiriman <b>dalam satu jaringan lokal</b> memakai <b>MAC address</b> (alamat fisik perangkat). Satuannya disebut <b>frame</b>. Perangkat kuncinya: <b>switch</b>. Terbagi dua sublayer: <b>LLC</b> (<i>Logical Link Control</i>: antarmuka ke Layer 3) dan <b>MAC</b> (<i>Media Access Control</i>: akses ke media fisik).</p>
<h3>Layer 1 — Physical: "Sinyalnya bagaimana?"</h3>
<p>Urusan <b>fisik murni</b>: mengubah bit (0/1) menjadi sinyal listrik, cahaya, atau gelombang radio di media (kabel UTP, fiber, udara). Mencakup konektor, pinout, voltase, kecepatan. Device: <b>hub, repeater</b>, kabel, NIC secara fisik. Tidak ada "keputusan cerdas" di sini — hanya dorong bit.</p>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Pertanyaan Kuncinya</th><th>Satuan Data</th><th>Alamat yang Dipakai</th></tr>
<tr><td>7–5</td><td>Apa & bagaimana formatnya?</td><td>Data</td><td>—</td></tr>
<tr><td>4 Transport</td><td>Sampai utuh ke aplikasi mana?</td><td>Segment</td><td>Port number</td></tr>
<tr><td>3 Network</td><td>Lewat jaringan mana?</td><td>Packet</td><td>IP address</td></tr>
<tr><td>2 Data Link</td><td>Ke tetangga mana di LAN?</td><td>Frame</td><td>MAC address</td></tr>
<tr><td>1 Physical</td><td>Sinyal fisiknya apa?</td><td>Bit</td><td>—</td></tr>
</table></div>
<div class="callout blue"><div class="t">Tiga Alamat, Tiga Layer</div><p style="margin:4px 0 0">Inilah fondasi troubleshooting: <b>MAC address (L2)</b> = siapa perangkat ini secara fisik, <b>IP address (L3)</b> = di jaringan mana ia berada, <b>port (L4)</b> = aplikasi mana di perangkat itu. Ketiganya dibedah satu per satu di sub-bab 2.9–2.11.</p></div>`,
      terms: [
        ['Segmentasi', 'Pemecahan data besar menjadi potongan-potongan kecil di Layer 4 agar bisa dikirim.'],
        ['End-to-end', 'Komunikasi dari host pengirim sampai host penerima, tugas Layer 4.'],
        ['LLC / MAC sublayer', 'Dua sub-bagian Layer 2: LLC (antarmuka ke Layer 3) dan MAC (akses media fisik).'],
        ['Routing', 'Pemilihan jalur terbaik antar-jaringan — fungsi Layer 3 oleh router.'],
      ],
      scenario: 'Kamu klik sebuah link. Browser (L7, HTTP) meminta data → TLS mengenkripsi (L6) → sesi dibuka (L5) → TCP memecah & memberi nomor urut (L4) → IP memberi alamat & router memilih jalan (L3) → switch meneruskan frame via MAC (L2) → bit didorong sebagai sinyal listrik (L1). Tujuh layer bekerja dalam milidetik — dan kamu akan bisa menelusurinya satu per satu setelah part ini.',
      bestPractices: 'Untuk tiap protokol baru yang kamu pelajari di kurikulum ini, catat: layer berapa, satuan datanya apa, alamat apa yang dipakai. Tiga kolom itu mempercepat pemahaman 10x lipat.',
      security: 'Setiap layer punya serangan khasnya: eavesdropping (L1), ARP spoofing (L2), IP spoofing (L3), SYN flood (L4), session hijacking (L5), downgrade enkripsi (L6), phishing/malware (L7). Engineer yang paham layer tidak salah pilih countermeasure.',
      challenge: 'Jelaskan dengan kata-katamu: apa beda tugas Layer 2 dan Layer 3? Beri contoh kapan sebuah paket butuh Layer 2 saja vs butuh Layer 3.',
      interviewQ: 'Q: "Apa beda fungsi Layer 4 dan Layer 3?" — A: Layer 3 (Network) mengurusi pengalamatan logis dan routing antar-jaringan (packet sampai ke host yang benar). Layer 4 (Transport) mengurusi pengiriman ujung-ke-ujung yang andal dan demultiplexing ke aplikasi yang tepat via port (segment sampai ke aplikasi yang benar di host itu).',
      quiz: [
        { q: 'Layer yang memecah data menjadi segmen dan mengatur port number adalah…', options: ['Layer 3 — Network', 'Layer 2 — Data Link', 'Layer 4 — Transport', 'Layer 6 — Presentation'], answer: 2, explain: 'Transport (L4): segmentasi, nomor urut, keandalan, dan port untuk mengarahkan ke aplikasi.' },
        { q: 'Sublayer LLC dan MAC berada di…', options: ['Layer 1', 'Layer 2 — Data Link', 'Layer 3', 'Layer 5'], answer: 1, explain: 'Data Link (L2) terbagi menjadi LLC (Logical Link Control) dan MAC (Media Access Control).' },
        { q: 'Mengapa enkripsi TLS ditempatkan di Layer 6?', options: ['Karena TLS mengatur routing', 'Karena Layer 6 mengurusi representasi/format data — enkripsi adalah transformasi representasi', 'Karena TLS bekerja di kabel', 'Karena port 443 ada di Layer 6'], answer: 1, explain: 'Presentation mengurusi bagaimana data direpresentasikan: enkripsi, kompresi, encoding. TLS mengenkripsi representasi data.' },
      ],
    },
    {
      id: '2.4',
      title: 'Encapsulation',
      body: `<p><b>Encapsulation</b> (enkapsulasi) adalah proses <b>membungkus data dengan header (dan kadang trailer) di setiap layer</b> saat data bergerak <i>turun</i> dari Layer 7 ke Layer 1 di sisi pengirim. Setiap layer menambahkan "amplop" berisi informasi yang dibutuhkan layer sejenis di sisi penerima.</p>
<h3>Analogi: Paket Pos Berlapis</h3>
<p>Kamu mengirim surat: surat dimasukkan ke amplop kecil (ditulis "untuk Budi"), amplop kecil dimasukkan ke amplop besar (ditulis alamat rumah), amplop besar dimasukkan ke karung pos (ditulis kota tujuan). Penerima membuka dari luar ke dalam. Persis begitu cara jaringan bekerja — hanya "amplop"-nya disebut <b>header</b>.</p>
<h3>Urutan Encapsulation (Pengirim)</h3>
<pre>Layer 7–5 : DATA                ← data asli dari aplikasi
Layer 4   : [TCP header | DATA]               = SEGMENT
Layer 3   : [IP header | TCP header | DATA]   = PACKET
Layer 2   : [MAC header | IP header | ... | FCS] = FRAME
Layer 1   : 01010111...                       = BITS di kabel</pre>
<h3>Mengapa Setiap Layer Butuh Header Sendiri?</h3>
<ul>
<li><b>Header TCP (L4):</b> berisi <i>port number</i> sumber & tujuan — agar penerima tahu data ini untuk aplikasi web (port 80/443), bukan untuk email. Juga nomor urut (sequence) untuk menyusun ulang.</li>
<li><b>Header IP (L3):</b> berisi <i>IP address</i> sumber & tujuan — agar router tahu ke jaringan mana paket harus diteruskan. Juga TTL (<i>Time To Live</i>) pencegah loop.</li>
<li><b>Header Ethernet (L2):</b> berisi <i>MAC address</i> sumber & tujuan — agar switch tahu ke port fisik mana frame diteruskan dalam LAN.</li>
<li><b>Trailer FCS (L2):</b> <i>Frame Check Sequence</i> — checksum untuk mendeteksi frame yang rusak di jalan.</li>
</ul>
<p>Prinsipnya: <b>setiap layer hanya membaca header-nya sendiri</b>. Router (L3) tidak peduli isi TCP header; switch (L2) tidak peduli IP address. Inilah keindahan desain berlapis — dan alasan troubleshooting bisa diisolasi per layer.</p>
<div class="callout"><div class="t">MTU: Batas Ukuran Amplop</div><p style="margin:4px 0 0"><b>MTU</b> (<i>Maximum Transmission Unit</i>) adalah ukuran maksimum frame yang boleh lewat di sebuah link — umumnya 1500 byte di Ethernet. Data yang lebih besar harus dipecah (fragmentasi) — proses yang boros dan sering jadi sumber masalah performa. Istilah ini akan sering muncul di Part 03 dan 28.</p></div>`,
      terms: [
        ['Encapsulation', 'Proses membungkus data dengan header/trailer di tiap layer saat data turun (pengirim).'],
        ['Header', 'Informasi kontrol yang ditambahkan di depan data oleh suatu layer.'],
        ['FCS', 'Frame Check Sequence — checksum di akhir frame untuk mendeteksi kerusakan.'],
        ['MTU', 'Maximum Transmission Unit — ukuran maksimum frame di sebuah link (umumnya 1500 byte).'],
      ],
      diagram: `<pre>         ENCAPSULATION DI SISI PENGIRIM (turun: 7 → 1)

   [ DATA ]                        ← dari aplikasi (L7–5)
     ↓ tambah TCP header (port, seq)
   [TCP|DATA]            = SEGMENT (L4)
     ↓ tambah IP header (src/dst IP, TTL)
   [IP|TCP|DATA]         = PACKET  (L3)
     ↓ tambah MAC header + FCS
   [MAC|IP|TCP|DATA|FCS] = FRAME   (L2)
     ↓ jadi sinyal
   01011010...           = BITS    (L1) → dikirim ke kabel</pre>`,
      scenario: 'Seorang developer mengeluh "datanya tidak sampai ke aplikasi". Capture Wireshark menunjukkan packet sampai di server (L3 OK, port benar di L4) tetapi aplikasi tidak merespons — ternyata header aplikasi (L7) salah format. Karena encapsulation berlapis, engineer bisa membuktikan dengan data: "sampai Layer 4 sehat, masalahnya di Layer 7" — dan tiket diteruskan ke tim aplikasi dengan bukti, bukan tebakan.',
      bestPractices: 'Saat membaca capture Wireshark, biasakan membaca dari header terluar (Ethernet) ke dalam (IP → TCP → data aplikasi). Itu urutan decapsulation — dan urutan berpikir yang benar.',
      security: 'Header adalah tempat serangan bersembunyi: IP spoofing memalsukan header L3, MAC spoofing memalsukan header L2. Firewall dan IDS bekerja dengan memeriksa keabsahan header di tiap layer.',
      challenge: 'Gambar urutan encapsulation untuk sebuah request HTTP, sebutkan: nama PDU, header yang ditambahkan, dan satu informasi penting di tiap header.',
      interviewQ: 'Q: "Jelaskan encapsulation." — A: Proses di sisi pengirim saat data turun layer 7→1: tiap layer menambahkan header (L4: port+sequence, L3: IP src/dst+TTL, L2: MAC src/dst+FCS) sehingga terbentuk segment → packet → frame → bits. Tiap layer hanya membaca header-nya sendiri.',
      quiz: [
        { q: 'Urutan encapsulation yang benar di sisi pengirim adalah…', options: ['Bits → Frame → Packet → Segment → Data', 'Data → Segment → Packet → Frame → Bits', 'Packet → Frame → Segment → Bits → Data', 'Data → Packet → Segment → Frame → Bits'], answer: 1, explain: 'Turun dari aplikasi: Data (L7–5) → Segment (L4) → Packet (L3) → Frame (L2) → Bits (L1).' },
        { q: 'Fungsi FCS (Frame Check Sequence) adalah…', options: ['Mengenkripsi isi frame', 'Checksum di akhir frame untuk mendeteksi kerusakan saat transmisi', 'Menentukan routing antar-jaringan', 'Memilih aplikasi tujuan via port'], answer: 1, explain: 'FCS adalah trailer L2 berisi checksum; penerima menghitung ulang untuk memastikan frame tidak rusak.' },
        { q: 'Mengapa router tidak perlu membaca TCP header?', options: ['Karena router terlalu lambat', 'Karena tiap layer hanya membaca header-nya sendiri — router bekerja di L3 cukup dengan IP header', 'Karena TCP header terenkripsi', 'Karena TCP header hanya ada di server'], answer: 1, explain: 'Desain berlapis: device L3 hanya butuh header L3 (IP src/dst). Ini membuat pemrosesan efisien dan troubleshooting terisolasi.' },
      ],
    },
    {
      id: '2.5',
      title: 'Decapsulation',
      body: `<p><b>Decapsulation</b> adalah kebalikan encapsulation: di sisi <b>penerima</b>, data bergerak <i>naik</i> dari Layer 1 ke Layer 7, dan <b>setiap layer melepas "amplop"-nya sendiri</b> setelah memeriksa isinya.</p>
<h3>Urutan Decapsulation (Penerima)</h3>
<pre>Layer 1 : terima BITS dari kabel → susun jadi FRAME
Layer 2 : baca MAC header → "apakah MAC tujuan = MAC saya?"
          → cek FCS → buang jika rusak → lepas header → naikkan PACKET
Layer 3 : baca IP header → "apakah IP tujuan = IP saya?"
          → lepas header → naikkan SEGMENT
Layer 4 : baca TCP header → "port berapa? urutan ke berapa?"
          → susun ulang → naikkan DATA
Layer 5-7: sesi & format diproses → DATA diserahkan ke aplikasi</pre>
<h3>Keputusan Penting di Tiap Layer</h3>
<ul>
<li><b>L2:</b> jika MAC tujuan bukan milikku (dan bukan broadcast) → frame <b>dibuang diam-diam</b> (<i>discard</i>). NIC tidak meneruskan ke atas. Inilah alasan capture di PC tetangga tidak melihat traffic unicast milikmu (kecuali mode promiscuous).</li>
<li><b>L3:</b> jika IP tujuan bukan milikku → host biasa membuang; <b>router</b> justru meneruskannya (itulah pekerjaannya). Perbedaan perilaku ini fundamental: host = konsumen, router = penerus.</li>
<li><b>L4:</b> jika port tujuan tidak ada aplikasi yang listen → kirim kembali <b>TCP RST</b> (reset) atau ICMP port unreachable — inilah yang terlihat sebagai "connection refused".</li>
</ul>
<div class="callout blue"><div class="t">Encapsulation ↔ Decapsulation = Satu Pasang</div><p style="margin:4px 0 0">Hafalkan sebagai pasangan: <b>pengirim membungkus dari dalam ke luar</b> (data dulu, header kemudian — tapi dibaca luar→dalam), <b>penerima membuka dari luar ke dalam</b>. Di tengah jalan, switch membuka sampai L2 lalu membungkus ulang, router membuka sampai L3 lalu membungkus ulang — detailnya di sub-bab 2.15.</p></div>`,
      terms: [
        ['Decapsulation', 'Proses melepas header per layer saat data naik (penerima), dari L1 ke L7.'],
        ['Discard', 'Membuang frame/packet diam-diam karena bukan untuk device tersebut atau rusak.'],
        ['Promiscuous mode', 'Mode NIC yang menerima semua frame di kabel, dipakai tool capture seperti Wireshark.'],
        ['Connection refused', 'Respons (TCP RST) saat port tujuan tidak ada aplikasi yang mendengarkan.'],
      ],
      diagram: `<pre>       DECAPSULATION DI SISI PENERIMA (naik: 1 → 7)

   01011010...           = BITS diterima dari kabel
     ↓ susun jadi frame
   [MAC|IP|TCP|DATA|FCS] → L2: MAC cocok? FCS valid? → lepas header L2
     ↓
   [IP|TCP|DATA]         → L3: IP cocok? → lepas header L3
     ↓
   [TCP|DATA]            → L4: port? urutan? → susun ulang
     ↓
   [ DATA ]              → L5–7: sesi & format → ke aplikasi ✓</pre>`,
      scenario: 'User melaporkan "kadang bisa kadang tidak" membuka aplikasi. Capture di server menunjukkan frame rusak (FCS gagal) hanya pada jam tertentu — kabel yang tertekuk di rak, mengembang saat ruang server panas. Decapsulation di L2 membuang frame rusak itu diam-diam, sehingga gejalanya "kadang hilang" di aplikasi. Tanpa memahami L2 discard, engineer akan menyalahkan aplikasi atau server.',
      bestPractices: 'Ingat perilaku buang-diam-diam (silent discard) di L2/L3: tidak semua kegagalan menghasilkan pesan error. Kadang "tidak ada respons" adalah responsnya — dan itu petunjuk layer.',
      security: 'Silent discard juga dipakai firewall: DROP (buang diam-diam) vs REJECT (buang + beri tahu). DROP lebih aman karena tidak memberi tahu penyerang bahwa ada device yang hidup.',
      challenge: 'Jelaskan apa yang terjadi — layer per layer — saat sebuah frame tiba di NIC PC dengan MAC tujuan yang salah (bukan milik PC itu). Ke layer berapa ia sampai?',
      interviewQ: 'Q: "Apa beda perilaku host dan router saat menerima packet yang IP tujuannya bukan miliknya?" — A: Host membuangnya (bukan untuknya). Router justru meneruskannya sesuai tabel routing — meneruskan packet orang lain adalah pekerjaan router. Perbedaan ini adalah inti fungsi routing.',
      quiz: [
        { q: 'Decapsulation terjadi di…', options: ['Sisi pengirim, data turun L7→L1', 'Sisi penerima, data naik L1→L7 sambil melepas header per layer', 'Hanya di router', 'Hanya di switch'], answer: 1, explain: 'Decapsulation = penerima membuka amplop berlapis dari luar (L1) ke dalam (L7).' },
        { q: 'Sebuah frame tiba di NIC dengan MAC tujuan yang bukan milik PC tersebut (bukan broadcast). Apa yang terjadi?', options: ['Diteruskan ke aplikasi', 'Dibuang diam-diam di Layer 2', 'Dikirim kembali ke pengirim', 'Diteruskan ke router'], answer: 1, explain: 'L2 memeriksa MAC tujuan; jika bukan miliknya, frame di-discard tanpa diteruskan ke layer atas.' },
        { q: 'Aplikasi mencoba konek ke port yang tidak ada service-nya. Respons yang umum diterima adalah…', options: ['HTTP 404', 'TCP RST (connection refused)', 'ICMP redirect', 'ARP reply'], answer: 1, explain: 'L4 menemukan tidak ada aplikasi yang listen di port itu → mengirim TCP RST, terlihat sebagai "connection refused".' },
      ],
    },
    {
      id: '2.6',
      title: 'PDU',
      body: `<p><b>PDU</b> (<i>Protocol Data Unit</i>) adalah <b>nama resmi "satuan data" di setiap layer</b>. Ini kosakata wajib: engineer profesional tidak bilang "datanya" — ia bilang "frame", "packet", atau "segment" tergantung layer yang dibicarakan. Ketepatan istilah ini membedakan laporan amatir dan profesional.</p>
<h3>Tabel PDU per Layer</h3>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Nama PDU</th><th>Contoh Kalimat Profesional</th></tr>
<tr><td>Layer 4 (TCP)</td><td><b>Segment</b></td><td>"TCP me-retransmit <i>segment</i> yang hilang."</td></tr>
<tr><td>Layer 4 (UDP)</td><td><b>Datagram</b></td><td>"DNS query dikirim sebagai <i>datagram</i> UDP."</td></tr>
<tr><td>Layer 3</td><td><b>Packet</b></td><td>"Router meneruskan <i>packet</i> ke next-hop."</td></tr>
<tr><td>Layer 2</td><td><b>Frame</b></td><td>"Switch mem-flood <i>frame</i> broadcast ke semua port."</td></tr>
<tr><td>Layer 1</td><td><b>Bit</b></td><td>"Kabel rusak menyebabkan <i>bit error</i>."</td></tr>
<tr><td>Layer 5–7</td><td><b>Data</b></td><td>"Aplikasi menerima <i>data</i> setelah decapsulation."</td></tr>
</table></div>
<h3>Catatan Penting</h3>
<ul>
<li>Dalam percakapan sehari-hari, kata <b>"packet"</b> sering dipakai longgar untuk semua satuan data ("packet capture", "packet loss"). Itu wajar — tapi saat presisi dibutuhkan (laporan, troubleshooting), pakai nama PDU yang tepat.</li>
<li><b>Datagram</b> dipakai untuk dua hal: PDU UDP di L4, dan kadang PDU IP di L3 (karena IP juga connectionless). Konteks menentukan artinya.</li>
<li>Istilah <b>"frame"</b> hanya untuk L2 — jangan bilang "IP frame". Pasangannya: <b>frame = Ethernet/MAC, packet = IP, segment = TCP</b>.</li>
</ul>
<div class="callout"><div class="t">Pertanyaan Interview Klasik</div><p style="margin:4px 0 0">"Apa beda frame, packet, dan segment?" adalah pertanyaan penyaring paling umum untuk posisi NOC/junior network engineer. Jawaban satu kalimat: <b>frame adalah PDU Layer 2 (header MAC), packet adalah PDU Layer 3 (header IP), segment adalah PDU Layer 4 TCP (header port)</b> — masing-masing hasil encapsulation di layer-nya.</p></div>`,
      terms: [
        ['PDU', 'Protocol Data Unit — nama satuan data di tiap layer (bit, frame, packet, segment, data).'],
        ['Segment', 'PDU Layer 4 untuk TCP.'],
        ['Datagram', 'PDU Layer 4 untuk UDP (kadang juga untuk IP di L3).'],
      ],
      diagram: `<pre>              PDU DI SETIAP LAYER

   L7–5 : DATA       "data aplikasi"
   L4   : SEGMENT    "TCP: port + nomor urut"
   L3   : PACKET     "IP: alamat sumber & tujuan"
   L2   : FRAME      "Ethernet: MAC sumber & tujuan"
   L1   : BIT        "0 dan 1 di kabel"

   Ingat: Frame=MAC · Packet=IP · Segment=TCP</pre>`,
      scenario: 'Laporan insiden menulis: "packet rusak di switch". Senior mengoreksi: switch bekerja di L2, jadi yang rusak adalah <i>frame</i> (FCS gagal) — bukan packet. Koreksi kecil ini mengarahkan investigasi ke tempat yang benar (kabel/port switch, bukan routing). Ketepatan istilah menghemat jam kerja.',
      bestPractices: 'Latih dirimu: setiap kali membaca log/capture, sebut PDU-nya dengan benar. Dalam 2 minggu menjadi kebiasaan — dan interviewir akan menyadarinya.',
      security: 'Istilah yang tepat juga penting saat membaca signature IDS/IPS: "TCP segment overlap" (serangan L4) vs "IP fragment overlap" (serangan L3) adalah dua serangan berbeda dengan mitigasi berbeda.',
      challenge: 'Untuk sebuah transfer file via FTP, sebutkan PDU yang dipakai di L4, L3, L2, dan L1 — plus alamat apa yang dibawa tiap PDU.',
      interviewQ: 'Q: "Apa beda frame, packet, dan segment?" — A: Ketiganya adalah PDU di layer berbeda: frame = PDU Layer 2 (header MAC, diteruskan switch), packet = PDU Layer 3 (header IP, di-routing router), segment = PDU Layer 4 TCP (header port + sequence). Datagram adalah padanan segment untuk UDP.',
      quiz: [
        { q: 'PDU di Layer 3 disebut…', options: ['Frame', 'Segment', 'Packet', 'Bit'], answer: 2, explain: 'Layer 3 (Network): PDU-nya packet (header IP).' },
        { q: 'Switch meneruskan…', options: ['Packet berdasarkan IP', 'Frame berdasarkan MAC address', 'Segment berdasarkan port', 'Bit berdasarkan aplikasi'], answer: 1, explain: 'Switch = device L2, meneruskan frame berdasarkan MAC address tujuan.' },
        { q: 'PDU Layer 4 untuk UDP disebut…', options: ['Segment', 'Frame', 'Datagram', 'Cell'], answer: 2, explain: 'UDP (connectionless) memakai istilah datagram; segment khusus untuk TCP.' },
      ],
    },
    {
      id: '2.7',
      title: 'TCP/IP Model',
      body: `<p>Jika OSI adalah peta, <b>TCP/IP adalah kendaraan yang benar-benar berjalan</b> di jalan itu. Model TCP/IP (juga disebut <b>DoD model</b>, dari <i>Department of Defense</i> AS yang mendanai ARPANET) lahir <i>sebelum</i> OSI — dari kebutuhan praktis menghubungkan jaringan-jaringan yang berbeda, bukan dari komite standardisasi.</p>
<h3>4 Layer TCP/IP</h3>
<div class="tblwrap"><table>
<tr><th>Layer TCP/IP</th><th>Padanan OSI</th><th>Tugas</th><th>Contoh</th></tr>
<tr><td><b>Application</b></td><td>OSI L5 + L6 + L7</td><td>Layanan ke aplikasi user</td><td>HTTP, DNS, SSH, DHCP</td></tr>
<tr><td><b>Transport</b></td><td>OSI L4</td><td>Pengiriman ujung-ke-ujung, port</td><td>TCP, UDP</td></tr>
<tr><td><b>Internet</b></td><td>OSI L3</td><td>Pengalamatan & routing antar-jaringan</td><td>IP, ICMP</td></tr>
<tr><td><b>Network Access</b> (Link)</td><td>OSI L1 + L2</td><td>Akses media fisik lokal</td><td>Ethernet, Wi-Fi</td></tr>
</table></div>
<h3>Mengapa Hanya 4 Layer?</h3>
<p>TCP/IP lahir dari implementasi, bukan teori. Para insinyurnya menggabungkan hal yang secara praktis tidak perlu dipisah: Session/Presentation/Application digabung karena di dunia nyata ketiganya diimplementasikan <i>di dalam aplikasi itu sendiri</i> (browser mengurusi HTTP + TLS + sesinya sekaligus). Physical/Data Link digabung karena "pokoknya paket bisa keluar lewat media apa pun".</p>
<h3>Model 5-Layer (Kompromi Praktis)</h3>
<p>Banyak buku dan kursus memakai <b>model 5-layer</b> (memisahkan Physical dan Data Link) karena membantu troubleshooting: membedakan "kabel putus" (L1) dari "MAC salah" (L2) itu berguna. Kurikulum ini memakai 7-layer OSI untuk berpikir, 4-layer TCP/IP untuk protokol nyata, dan menyebut model 5-layer saat relevan.</p>
<div class="callout blue"><div class="t">Yang Perlu Kamu Kuasai</div><p style="margin:4px 0 0">Dua nama protokolnya memberi nama model ini: <b>TCP</b> (Transport) dan <b>IP</b> (Internet) — <i>suite</i> TCP/IP sebenarnya berisi puluhan protokol (UDP, ICMP, ARP, DNS, DHCP...). Saat orang bilang "jaringan TCP/IP", maksudnya seluruh keluarga protokol internet, bukan cuma dua itu.</p></div>`,
      terms: [
        ['TCP/IP model', 'Model 4 layer (DoD) yang menjadi dasar implementasi internet: Application, Transport, Internet, Network Access.'],
        ['DoD model', 'Nama lain TCP/IP model, dari Department of Defense AS.'],
        ['Protocol suite', 'Keluarga protokol yang bekerja sama — TCP/IP suite berisi TCP, UDP, IP, ICMP, ARP, DNS, dll.'],
      ],
      diagram: `<pre>      TCP/IP (4)        OSI (7)
   ┌──────────────┐  ┌──────────────┐
   │ Application  │  │ 7 Application│
   │              │  │ 6 Presentation
   │              │  │ 5 Session    │
   ├──────────────┤  ├──────────────┤
   │ Transport    │  │ 4 Transport  │
   ├──────────────┤  ├──────────────┤
   │ Internet     │  │ 3 Network    │
   ├──────────────┤  ├──────────────┤
   │ Network      │  │ 2 Data Link  │
   │ Access       │  │ 1 Physical   │
   └──────────────┘  └──────────────┘
   Praktis (jalan)     Konseptual (peta)</pre>`,
      scenario: 'Dokumentasi vendor firewall menulis "bekerja di Layer 3–7". Engineer yang paham pemetaan langsung tahu: ia memfilter IP (Internet/L3), port (Transport/L4), sampai konten aplikasi (Application/L5–7) — satu baris spesifikasi menjadi jelas tanpa harus membaca 50 halaman manual.',
      bestPractices: 'Berpikirlah dengan OSI (7 layer, presisi), berkonfiguraslah dengan TCP/IP (protokol nyata). Keduanya bukan saingan — mereka alat untuk pekerjaan berbeda.',
      security: 'Banyak serangan dinamai dari layer TCP/IP: "IP spoofing" (Internet layer), "TCP SYN flood" (Transport layer). Memetakan nama serangan ke layer mempercepat pemilihan mitigasi.',
      challenge: 'Petakan: HTTP, TCP, IP, Ethernet, TLS — masing-masing ke layer TCP/IP DAN layer OSI. Tulis dalam tabel.',
      interviewQ: 'Q: "Apa beda model OSI dan TCP/IP?" — A: OSI adalah model referensi konseptual 7 layer (ISO, 1984) untuk berpikir dan troubleshooting; TCP/IP adalah model implementasi 4 layer yang benar-benar dijalankan di internet. OSI memisahkan Session/Presentation/Application dan Physical/Data Link; TCP/IP menggabungkannya karena alasan praktis.',
      quiz: [
        { q: 'Layer "Internet" pada model TCP/IP setara dengan…', options: ['OSI Layer 2', 'OSI Layer 3 — Network', 'OSI Layer 4', 'OSI Layer 7'], answer: 1, explain: 'Internet layer = pengalamatan & routing = OSI Layer 3 (Network).' },
        { q: 'Mengapa model TCP/IP hanya punya 4 layer?', options: ['Karena belum ditemukan layer lainnya', 'Lahir dari implementasi praktis: layer yang tidak perlu dipisah digabung (mis. L5–L7 jadi satu)', 'Karena hanya mendukung 4 protokol', 'Karena ISO melarang lebih dari 4'], answer: 1, explain: 'TCP/IP dibuat insinyur lapangan: Session/Presentation/Application digabung karena diimplementasikan di dalam aplikasi; L1/L2 digabung sebagai Network Access.' },
        { q: 'Protokol DNS berada di layer Application TCP/IP yang setara dengan OSI layer…', options: ['Layer 3', 'Layer 4', 'Layer 7 (Application)', 'Layer 2'], answer: 2, explain: 'DNS adalah layanan ke aplikasi → Application layer TCP/IP = OSI L5+L6+L7, intinya L7.' },
      ],
    },
    {
      id: '2.8',
      title: 'OSI vs TCP/IP',
      body: `<p>Dua model, satu jaringan. Sub-bab ini membandingkan keduanya secara head-to-head agar kamu tidak pernah tertukar lagi — dan paham kapan memakai yang mana.</p>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>OSI Model</th><th>TCP/IP Model</th></tr>
<tr><td>Sifat</td><td>Referensi konseptual</td><td>Implementasi nyata</td></tr>
<tr><td>Jumlah layer</td><td>7</td><td>4 (atau 5 versi praktis)</td></tr>
<tr><td>Dibuat oleh / tahun</td><td>ISO, 1984</td><td>DoD/ARPANET, 1970-an</td></tr>
<tr><td>Tujuan awal</td><td>Standardisasi & referensi</td><td>Menghubungkan jaringan yang berbeda</td></tr>
<tr><td>Yang berjalan di device</td><td>Tidak ada (peta)</td><td>Ya — seluruh internet</td></tr>
<tr><td>Kelebihan</td><td>Presisi troubleshooting per layer</td><td>Sederhana, terbukti di lapangan</td></tr>
<tr><td>Kelemahan</td><td>Terlalu teoritis, tidak diimplementasi murni</td><td>Kurang presisi (L5–L7 digabung)</td></tr>
</table></div>
<h3>Kapan Memakai yang Mana?</h3>
<ul>
<li><b>Troubleshooting & belajar konsep → OSI.</b> "Cek L1 dulu (kabel), lalu L2 (MAC/ARP), lalu L3 (IP/gateway)" — kalimat ini memakai OSI.</li>
<li><b>Konfigurasi & protokol nyata → TCP/IP.</b> "Set IP address (Internet layer), buka port 443 (Transport), install sertifikat TLS (Application)" — ini bahasa TCP/IP.</li>
<li><b>Interview & sertifikasi → keduanya.</b> Pewawancara ingin kamu paham keduanya dan bisa memetakan.</li>
</ul>
<div class="callout"><div class="t">Kesalahan Umum</div><p style="margin:4px 0 0">Menganggap OSI "kalah" dan tidak perlu dipelajari karena "yang dipakai TCP/IP". Justru sebaliknya: engineer yang hanya tahu TCP/IP tanpa kerangka OSI biasanya troubleshooting dengan cara coba-coba. OSI adalah <i>cara berpikir</i>, bukan produk yang bersaing.</p></div>`,
      terms: [
        ['Head-to-head comparison', 'Perbandingan langsung dua hal pada aspek yang sama.'],
      ],
      scenario: 'Dua engineer mendebat: satu bilang "cek layer 2", satu bilang "cek network access layer". Mereka membicarakan hal yang sama (MAC/switching) dengan kosakata model berbeda. Engineer senior menengahi: "pakai OSI untuk troubleshooting, TCP/IP untuk konfigurasi — sekarang cek kabel dan ARP table." Debat selesai dalam 30 detik karena ada pemetaan bersama.',
      bestPractices: 'Dalam dokumentasi, cantumkan layer OSI saat mendeskripsikan fungsi ("filtering L3/L4"), dan nama protokol TCP/IP saat mendeskripsikan konfigurasi ("allow TCP 443"). Kombinasi ini paling jelas dibaca.',
      security: 'Framework keamanan (mis. NIST) memetakan kontrol ke layer: enkripsi media (L1/L2), IPsec (L3), TLS (L6/L7-app). Memahami kedua model membantumu membaca framework tersebut tanpa tersesat.',
      challenge: 'Buat tabel pemetaan sendiri: 10 protokol (HTTP, FTP, TCP, UDP, IP, ICMP, ARP, Ethernet, DNS, SSH) → layer TCP/IP → layer OSI. Ini tabel yang akan kamu pakai sampai Part 39.',
      interviewQ: 'Q: "Model mana yang dipakai di internet, dan mengapa OSI tetap dipelajari?" — A: Yang berjalan adalah TCP/IP. OSI tetap dipelajari karena ia kerangka berpikir terbaik: memisahkan masalah per layer membuat troubleshooting sistematis, dan menjadi bahasa bersama engineer sedunia.',
      quiz: [
        { q: 'Untuk troubleshooting berlapis yang presisi ("cek L1, lalu L2, lalu L3"), model yang dipakai adalah…', options: ['TCP/IP', 'OSI', 'DoD', 'IEEE 802'], answer: 1, explain: 'OSI memisahkan 7 layer sehingga isolasi masalah per layer presisi — ideal untuk troubleshooting.' },
        { q: 'Pernyataan yang BENAR adalah…', options: ['OSI berjalan di router, TCP/IP hanya teori', 'TCP/IP adalah implementasi nyata di internet; OSI adalah referensi konseptual', 'Keduanya adalah protokol yang bersaing dan tidak kompatibel', 'TCP/IP dibuat ISO tahun 1984'], answer: 1, explain: 'TCP/IP = kendaraan yang jalan; OSI = peta. Keduanya melengkapi, bukan bersaing.' },
        { q: 'Model 5-layer muncul karena…', options: ['ISO menambah satu layer baru', 'Praktisi memisahkan Physical dan Data Link dari Network Access agar troubleshooting L1 vs L2 lebih jelas', 'TCP/IP versi 5', 'Kebutuhan wireless'], answer: 1, explain: 'Kompromi praktis: memisahkan L1 (kabel/sinyal) dari L2 (MAC/switching) membantu diagnosis — "kabel putus" vs "MAC salah" adalah dua masalah berbeda.' },
      ],
    },
    {
      id: '2.9',
      title: 'MAC Address',
      body: `<p><b>MAC address</b> (<i>Media Access Control address</i>) adalah <b>alamat fisik perangkat jaringan</b> — identitas yang dibakar ke <b>NIC</b> (<i>Network Interface Card</i>, kartu jaringan) di pabrik. Ia bekerja di <b>Layer 2</b> dan dipakai untuk komunikasi <b>dalam satu jaringan lokal</b>.</p>
<h3>Format: 48 Bit dalam 6 Pasang Hex</h3>
<pre>Contoh:  8C:EC:4B:12:9A:F3
          ├─────┤ ├────────┤
          OUI      Spesifik per device
          (vendor) (nomor seri)</pre>
<ul>
<li><b>OUI</b> (<i>Organizationally Unique Identifier</i>): 24 bit pertama = identitas <b>vendor</b> (mis. Apple, Intel, Cisco). Dikelola oleh <b>IEEE</b>.</li>
<li>24 bit sisanya: nomor unik per device dari vendor tersebut. Kombinasinya <b>seharusnya unik sedunia</b>.</li>
<li>Ditulis heksadesimal, dipisah titik-dua (atau strip/titik tergantung vendor).</li>
</ul>
<h3>Analogi: Nomor Rangka Kendaraan</h3>
<p>MAC address seperti <b>nomor rangka mobil</b>: menempel permanen sejak lahir, unik, tidak berubah walau mobil pindah kota. Sedangkan IP address (sub-bab berikutnya) seperti <b>pelat nomor + alamat parkir</b>: berubah mengikuti lokasi. Switch peduli nomor rangka (MAC), router peduli alamat parkir (IP).</p>
<h3>Jenis MAC Address</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Ciri</th><th>Contoh</th></tr>
<tr><td><b>Unicast</b></td><td>Untuk satu device spesifik (bit pertama 0)</td><td>8C:EC:4B:12:9A:F3</td></tr>
<tr><td><b>Broadcast</b></td><td>Untuk semua device di LAN</td><td>FF:FF:FF:FF:FF:FF</td></tr>
<tr><td><b>Multicast</b></td><td>Untuk grup device yang berminat (bit pertama 1)</td><td>01:00:5E:xx:xx:xx</td></tr>
</table></div>
<div class="callout blue"><div class="t">BISA Diubah? Ya — dan Itu Penting untuk Security</div><p style="margin:4px 0 0">Walau "dibakar di pabrik", MAC bisa di-<b>spoof</b> (dipalsukan via software). Inilah dasar serangan <b>ARP spoofing</b> dan alasan fitur <b>port security</b> di switch (Part 08). Jangan pernah mengandalkan MAC sebagai identitas keamanan yang kuat.</p></div>`,
      terms: [
        ['MAC address', 'Alamat fisik 48-bit perangkat jaringan (Layer 2), dibakar ke NIC oleh vendor.'],
        ['NIC', 'Network Interface Card — kartu/antarmuka jaringan di perangkat.'],
        ['OUI', 'Organizationally Unique Identifier — 24 bit pertama MAC, identitas vendor, dikelola IEEE.'],
        ['MAC spoofing', 'Pemalsuan MAC address via software untuk menyamar sebagai device lain.'],
      ],
      diagram: `<pre>         STRUKTUR MAC ADDRESS (48 bit)

   8C:EC:4B : 12:9A:F3
   ─────────   ─────────
   OUI         Device unik
   (vendor)    (nomor seri)

   Analogi:
   MAC = nomor rangka mobil (tetap, unik, fisik)  → Layer 2
   IP  = alamat parkir (berubah ikut lokasi)      → Layer 3</pre>`,
      scenario: 'Teknisi mengganti NIC PC yang rusak. IP address PC tetap sama (192.168.20.50) karena itu konfigurasi logis, tapi MAC address berubah — dan tabel ARP di gateway otomatis memperbarui pemetaan IP→MAC baru dalam hitungan detik. User tidak merasakan apa-apa. Inilah keuntungan pemisahan alamat fisik (tetap per hardware) dan logis (fleksibel per lokasi).',
      bestPractices: 'Catat MAC address perangkat infrastruktur (server, printer, AP) di dokumentasi inventaris — berguna untuk DHCP reservation dan port security (Part 08).',
      security: 'MAC address terlihat jelas di jaringan lokal dan bisa di-spoof — jangan pakai MAC filtering sebagai satu-satunya pengaman Wi-Fi. Ia hanya "pagar bambu", bukan "tembok beton".',
      challenge: 'Lihat MAC address laptop/HP-mu (ipconfig /all atau ip addr). Identifikasi OUI-nya dan cari tahu vendor apa — lalu jawab: mengapa dua bit pertama penting (unicast vs multicast)?',
      interviewQ: 'Q: "Apa beda MAC address dan IP address?" — A: MAC adalah alamat fisik 48-bit di Layer 2, permanen per NIC, dipakai dalam satu LAN oleh switch. IP adalah alamat logis di Layer 3, bisa berubah mengikuti lokasi jaringan, dipakai router untuk antar-jaringan. Analoginya: MAC = nomor rangka, IP = alamat parkir.',
      quiz: [
        { q: 'MAC address bekerja di layer…', options: ['Layer 1', 'Layer 2 — Data Link', 'Layer 3', 'Layer 4'], answer: 1, explain: 'MAC = alamat fisik untuk komunikasi dalam satu LAN → Layer 2 (Data Link).' },
        { q: '24 bit pertama MAC address (OUI) menunjukkan…', options: ['Nomor urut device', 'Identitas vendor pembuat NIC', 'VLAN ID', 'Kecepatan NIC'], answer: 1, explain: 'OUI (Organizationally Unique Identifier) = identitas vendor, dikelola IEEE.' },
        { q: 'Alamat MAC FF:FF:FF:FF:FF:FF adalah…', options: ['Unicast', 'Multicast', 'Broadcast — untuk semua device di LAN', 'Alamat loopback'], answer: 2, explain: 'FF:FF:FF:FF:FF:FF = alamat broadcast Layer 2, diterima semua NIC di LAN.' },
      ],
    },
    {
      id: '2.10',
      title: 'IP Address',
      body: `<p><b>IP address</b> (<i>Internet Protocol address</i>) adalah <b>alamat logis perangkat di jaringan</b> — bekerja di <b>Layer 3</b>. Berbeda dengan MAC yang permanen, IP <b>berubah mengikuti lokasi</b>: pindah dari VLAN OFFICE ke VLAN GUEST, IP-mu ikut berubah.</p>
<h3>Format IPv4: 32 Bit, 4 Oktet</h3>
<pre>192.168.20.50  →  11000000.10101000.00010100.00110010
                    └─ oktet 1 ─┘└─ oktet 2 ─┘└─ oktet 3 ─┘└─ oktet 4 ─┘
                    setiap oktet = 8 bit = angka 0–255</pre>
<p>Setiap IP selalu berpasangan dengan <b>subnet mask</b> (mis. 255.255.255.0 atau /24) yang menentukan <b>bagian network</b> vs <b>bagian host</b> — dibedah tuntas di Part 04.</p>
<h3>Hierarki: Mengapa IP Dibuat Bertingkat?</h3>
<p>IP dirancang <b>hierarkis</b> seperti alamat pos: negara → kota → jalan → nomor rumah. Router tidak perlu tahu setiap device — cukup tahu "semua 192.168.20.0/24 lewat sini". Tanpa hierarki, tabel routing internet (jutaan device) mustahil dikelola. Inilah keunggulan IP atas MAC yang flat (datar, tanpa struktur lokasi).</p>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>MAC Address</th><th>IP Address</th></tr>
<tr><td>Layer</td><td>2 (Data Link)</td><td>3 (Network)</td></tr>
<tr><td>Sifat</td><td>Fisik, permanen per NIC</td><td>Logis, berubah ikut lokasi</td></tr>
<tr><td>Struktur</td><td>Flat (OUI + seri)</td><td>Hierarkis (network + host)</td></tr>
<tr><td>Ruang lingkup</td><td>Satu LAN</td><td>Antar-jaringan (global)</td></tr>
<tr><td>Yang memakainya</td><td>Switch</td><td>Router</td></tr>
</table></div>
<h3>Contoh di Desain Kurikulum</h3>
<p>Desain standar kita (Part 01): <code>192.168.20.50</code> — <b>192.168.20</b> adalah <i>network</i> (VLAN 20 OFFICE), <b>.50</b> adalah <i>host</i> (PC nomor 50). Router melihat "192.168.20.x" dan tahu itu segmen OFFICE; switch di segmen itu memakai MAC untuk mengantar ke PC yang tepat. Dua alamat bekerja sama di layer masing-masing.</p>`,
      terms: [
        ['IP address', 'Alamat logis 32-bit (IPv4) perangkat di Layer 3, hierarkis: bagian network + bagian host.'],
        ['Oktet', 'Satu kelompok 8 bit; IPv4 terdiri dari 4 oktet (0–255 tiap oktet).'],
        ['Hierarkis', 'Alamat berstruktur bertingkat (network → host) sehingga routing bisa agregat.'],
      ],
      scenario: 'Kantor pindah gedung dan mengganti ISP. Semua IP publik berubah — tapi MAC address semua device tetap sama. Tim hanya mengonfigurasi ulang IP (logis), tanpa menyentuh hardware. Sebaliknya saat NIC rusak diganti, MAC berubah tapi IP tetap. Pemisahan ini membuat perubahan jaringan tidak melumpuhkan segalanya sekaligus.',
      bestPractices: 'Jangan pernah menebak IP dari MAC atau sebaliknya — gunakan ARP table (Part 03) sebagai "kamus" pemetaannya. Dan selalu dokumentasikan IP plan (Part 04, sub-bab 4.15).',
      security: 'IP address bisa di-spoof seperti MAC, dan IP publikmu terlihat oleh seluruh internet. Prinsipnya sama: alamat adalah identitas lokasi, BUKAN bukti kepercayaan — autentikasi tetap wajib di layer atas.',
      challenge: 'Untuk IP 192.168.30.10/24: mana bagian network, mana bagian host? VLAN apa itu menurut desain kurikulum, dan perangkat apa yang cocok memakai IP itu?',
      interviewQ: 'Q: "Mengapa butuh dua alamat (MAC dan IP)? Bukankah satu cukup?" — A: Karena kebutuhan berbeda: MAC (flat, permanen) efisien untuk pengiriman lokal dalam satu LAN; IP (hierarkis, fleksibel) memungkinkan routing antar-jutaan jaringan. Satu alamat tidak bisa optimal untuk keduanya — seperti butuh nomor rangka DAN alamat parkir.',
      quiz: [
        { q: 'IP address 192.168.20.50/24 — bagian "20" menunjukkan…', options: ['Nomor host', 'Bagian network (VLAN 20 OFFICE) sesuai desain kurikulum', 'Port number', 'OUI vendor'], answer: 1, explain: 'Dengan mask /24, tiga oktet pertama = network: 192.168.20.0 = VLAN 20 OFFICE.' },
        { q: 'Keunggulan utama IP dibanding MAC untuk internet global adalah…', options: ['IP lebih pendek', 'IP hierarkis sehingga routing bisa diagregasi per network', 'IP tidak bisa di-spoof', 'IP permanen'], answer: 1, explain: 'Hierarki network+host memungkinkan router hanya menyimpan rute per network, bukan per device — skalabel untuk miliaran device.' },
        { q: 'Perangkat pindah dari VLAN 20 ke VLAN 40. Yang BERUBAH adalah…', options: ['MAC address', 'IP address (mengikuti network baru)', 'OUI vendor', 'Jumlah bit MAC'], answer: 1, explain: 'IP adalah alamat logis berbasis lokasi → berubah ikut network; MAC menempel di hardware → tetap.' },
      ],
    },
    {
      id: '2.11',
      title: 'Port Number',
      body: `<p>IP address mengantar packet ke <b>device yang benar</b>. Tapi dalam satu device ada banyak aplikasi: browser, email, SSH, update otomatis — packet untuk siapa? Jawabannya: <b>port number</b>, alamat Layer 4 (<b>Transport</b>) yang mengidentifikasi <b>aplikasi/layanan</b> di dalam host.</p>
<h3>Analogi: Nomor Apartemen</h3>
<p>IP address = alamat gedung apartemen. Port number = nomor unit apartemen. Kurir (packet) butuh keduanya: gedung yang benar (IP) DAN unit yang benar (port). Kombinasi <b>IP + port</b> disebut <b>socket</b> — alamat lengkap satu percakapan jaringan, mis. <code>192.168.30.10:443</code>.</p>
<h3>Rentang Port</h3>
<div class="tblwrap"><table>
<tr><th>Rentang</th><th>Nama</th><th>Kegunaan</th><th>Contoh</th></tr>
<tr><td>0–1023</td><td><b>Well-known ports</b></td><td>Layanan standar, butuh hak admin untuk listen</td><td>80 HTTP, 443 HTTPS, 22 SSH, 53 DNS, 25 SMTP</td></tr>
<tr><td>1024–49151</td><td><b>Registered ports</b></td><td>Aplikasi terdaftar</td><td>3306 MySQL, 3389 RDP, 8080 HTTP alternatif</td></tr>
<tr><td>49152–65535</td><td><b>Dynamic/private ports</b></td><td>Port sumber acak sisi client</td><td>Browser memakai port acak mis. 52341</td></tr>
</table></div>
<h3>Cara Kerja dalam Koneksi</h3>
<pre>PC (client)                              Server 192.168.30.10
192.168.20.50:52341  ──── SYN ────▶  192.168.30.10:443
   (port acak)            "halo,      (port tetap 443 =
    sementara"            mau HTTPS)   layanan web aman)</pre>
<p>Port <b>tujuan</b> menentukan layanan (443 = web aman), port <b>sumber</b> acak membedakan banyak koneksi dari PC yang sama. Server bisa melayani ribuan client karena tiap koneksi punya port sumber berbeda — konsep <b>multiplexing</b>.</p>
<div class="callout blue"><div class="t">Port ≠ Colokan Fisik!</div><p style="margin:4px 0 0">Pemula sering mengira "port" = lubang colokan di switch. <b>Port number (L4)</b> adalah konsep software murni — angka 16-bit di header TCP/UDP. Lubang fisik di switch namanya <i>interface</i> atau <i>port fisik</i>. Konteks menentukan artinya; di kurikulum ini "port 443" selalu berarti port number.</p></div>`,
      terms: [
        ['Port number', 'Alamat 16-bit di Layer 4 yang mengidentifikasi aplikasi/layanan di dalam host (0–65535).'],
        ['Socket', 'Kombinasi IP + port, mis. 192.168.30.10:443 — alamat lengkap satu koneksi.'],
        ['Well-known ports', 'Port 0–1023 untuk layanan standar (HTTP 80, HTTPS 443, SSH 22, DNS 53).'],
        ['Multiplexing', 'Banyak koneksi berbagi satu IP, dibedakan lewat port sumber yang berbeda.'],
      ],
      scenario: 'Firewall kantor memblokir akses ke server file (port 445) dari VLAN GUEST tapi mengizinkan web (port 443). Tamu tetap bisa browsing, tapi tidak bisa mengintip file internal — padahal servernya SAMA (192.168.30.10). Inilah kekuatan port: kebijakan keamanan bisa sehalus per-aplikasi, bukan cuma per-device. Detail implementasinya di Part 18 (FortiGate).',
      bestPractices: 'Hafalkan 10 well-known port esensial: 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP, 80 HTTP, 110 POP3, 143 IMAP, 443 HTTPS, 3389 RDP. Mereka muncul di setiap troubleshooting.',
      security: 'Port scanning (memindai port terbuka) adalah langkah awal penyerang memetakan layanan. Prinsipnya: tutup semua port yang tidak dibutuhkan — <i>default deny</i>. "Connection refused" (2.5) justru kabar baik: artinya tidak ada layanan terekspos di sana.',
      challenge: 'Jalankan <code>netstat -an</code> di komputermu. Temukan 3 koneksi: catat IP:port lokal dan IP:port remote-nya, lalu tebak aplikasi/layanan apa di tiap sisi.',
      interviewQ: 'Q: "Apa itu socket dan mengapa port sumber client acak?" — A: Socket = IP + port, alamat lengkap satu koneksi. Port tujuan tetap (well-known, mis. 443) agar client tahu layanan apa; port sumber acak dari rentang dinamis agar banyak koneksi simultan dari satu client bisa dibedakan (multiplexing).',
      quiz: [
        { q: 'Fungsi utama port number adalah…', options: ['Menentukan rute antar-jaringan', 'Mengidentifikasi aplikasi/layanan di dalam host (Layer 4)', 'Menggantikan IP address', 'Mengatur kecepatan kabel'], answer: 1, explain: 'Port = alamat aplikasi di dalam host; IP mengantar ke device, port mengantar ke aplikasi.' },
        { q: 'Koneksi ke https://192.168.30.10 memakai…', options: ['Port tujuan 80', 'Port tujuan 443 (HTTPS)', 'Port tujuan 22', 'Port tujuan acak'], answer: 1, explain: 'HTTPS = HTTP over TLS = well-known port 443.' },
        { q: 'Mengapa port sumber sisi client dipilih acak dari 49152–65535?', options: ['Agar lebih aman dari firewall', 'Agar banyak koneksi simultan bisa dibedakan (multiplexing)', 'Karena client tidak punya IP', 'Agar server lebih cepat'], answer: 1, explain: 'Tiap koneksi butuh socket unik; port sumber acak membedakan koneksi-koneksi dari client yang sama.' },
      ],
    },
    {
      id: '2.12',
      title: 'Frame',
      body: `<p><b>Frame</b> adalah PDU <b>Layer 2</b> — "amplop" yang dipakai untuk mengantar data <b>dalam satu jaringan lokal</b>. Jika packet (L3) adalah surat antar-kota, frame adalah <b>kurir lokal</b> yang mengantar dari satu titik ke titik berikutnya di kota yang sama.</p>
<h3>Struktur Frame Ethernet</h3>
<pre>┌──────────┬──────────────┬──────────────┬───────┬─────────┬─────┐
│ Preamble │ Dest. MAC    │ Source MAC   │ Type  │ Payload │ FCS │
│ 8 byte   │ 6 byte       │ 6 byte       │2 byte │46–1500 B │4 byte│
└──────────┴──────────────┴──────────────┴───────┴─────────┴─────┘
◀─────────────── HEADER ───────────────▶◀─data─▶◀trailer▶</pre>
<ul>
<li><b>Preamble:</b> pola sinkronisasi agar penerima "siap-siap" menerima bit.</li>
<li><b>Dest/Source MAC:</b> alamat fisik tujuan & pengirim — dasar keputusan switch.</li>
<li><b>Type:</b> isi payload-nya apa — mis. <code>0x0800</code> = IPv4, <code>0x86DD</code> = IPv6, <code>0x8100</code> = VLAN tag 802.1Q (Part 08).</li>
<li><b>Payload:</b> packet IP yang dibungkus (46–1500 byte).</li>
<li><b>FCS:</b> checksum pendeteksi kerusakan (lihat 2.4).</li>
</ul>
<h3>Cara Kerja: Keputusan Switch</h3>
<p>Switch membaca <b>Dest MAC</b> lalu melihat <b>MAC address table</b>-nya ("MAC ini ada di port berapa?"). Tiga kemungkinan: <b>forward</b> ke port yang tepat (dikenal), <b>flood</b> ke semua port (tidak dikenal — belajar dulu), atau <b>filter/discard</b> (MAC sumber = tujuan, atau bukan untuk siapa-siapa). Detail perilaku switch dibedah di Part 08.</p>
<div class="callout"><div class="t">Frame Lahir dan Mati di Tiap Hop</div><p style="margin:4px 0 0">Poin kritis untuk sub-bab 2.15: <b>frame hanya hidup dalam satu hop</b>. Setiap kali melewati router, frame lama <b>dibuang total</b> dan frame baru dibuat dengan MAC yang baru — sedangkan packet IP di dalamnya <b>tetap sama</b> (kecuali TTL berkurang). MAC address berubah tiap hop; IP address tidak.</p></div>`,
      terms: [
        ['Frame', 'PDU Layer 2: header MAC + payload (packet) + FCS; hanya hidup satu hop.'],
        ['MAC address table', 'Tabel di switch: pemetaan MAC address → nomor port.'],
        ['Flood', 'Switch mengirim frame ke semua port saat MAC tujuan belum dikenal.'],
        ['EtherType', 'Field 2-byte di frame yang menyatakan isi payload (0x0800 = IPv4, 0x86DD = IPv6).'],
      ],
      scenario: 'Wireshark di PC menampilkan frame dengan Dest MAC = MAC gateway, bukan MAC server tujuan — padahal ping-nya ke server. Ini BUKAN error: frame memang hanya perlu sampai ke "kurir lokal" berikutnya (gateway); packet IP di dalamnya yang beralamat ke server. Engineer yang paham perbedaan frame vs packet tidak panik melihat ini.',
      bestPractices: 'Saat membaca capture, selalu perhatikan pasangan MAC src/dst di tiap hop — ia bercerita tentang jalur fisik yang dilalui, sedangkan IP src/dst bercerita tentang ujung-ke-ujung.',
      security: 'Karena switch mengambil keputusan dari MAC, pemalsuan MAC (spoofing) bisa mengarahkan frame ke penyerang — dasar serangan Man-in-the-Middle di LAN. Mitigasinya: port security & DHCP snooping (Part 08).',
      challenge: 'Jelaskan mengapa field Type/EtherType penting: apa yang terjadi jika receiver tidak tahu apakah payload-nya IPv4 atau IPv6?',
      interviewQ: 'Q: "Apa isi header frame Ethernet dan apa fungsi FCS?" — A: Preamble (sinkronisasi), Dest & Source MAC (keputusan forwarding switch), Type/EtherType (jenis payload: IPv4/IPv6/VLAN tag), payload (packet), dan FCS trailer — checksum 4-byte untuk mendeteksi frame rusak saat transmisi.',
      quiz: [
        { q: 'Frame adalah PDU layer…', options: ['Layer 1', 'Layer 2 — Data Link', 'Layer 3', 'Layer 4'], answer: 1, explain: 'Frame = PDU L2 dengan header MAC, diteruskan oleh switch.' },
        { q: 'Switch memutuskan meneruskan frame berdasarkan…', options: ['IP address tujuan', 'MAC address tujuan + MAC address table', 'Port number', 'TTL'], answer: 1, explain: 'Switch (L2) membaca Dest MAC dan mencocokkan dengan MAC address table → port keluar.' },
        { q: 'Saat packet melewati router, yang terjadi pada frame adalah…', options: ['Frame diteruskan apa adanya', 'Frame lama dibuang dan dibuat frame baru dengan MAC yang sesuai hop berikutnya', 'Frame dienkripsi', 'Frame digabung dengan frame lain'], answer: 1, explain: 'Frame hanya hidup satu hop; router men-strip frame lama dan mengenkapsulasi ulang packet ke frame baru.' },
      ],
    },
    {
      id: '2.13',
      title: 'Packet',
      body: `<p><b>Packet</b> adalah PDU <b>Layer 3</b> — "surat antar-kota" yang membawa alamat logis <b>sumber dan tujuan</b> dari ujung ke ujung. Jika frame urusan kurir lokal, packet urusan <b>kantor pos antar-kota</b>: ia harus menemukan jalan melewati banyak jaringan.</p>
<h3>Struktur Header IPv4 (20 byte, disederhanakan)</h3>
<pre>┌────────────┬────────────┬───────────────────────────────┐
│ Version(4) │ Hdr Len    │  ...                          │
├────────────┴────────────┴───────────────────────────────┤
│ TTL        │ Protocol   │ Header Checksum               │
├──────────────────────────┬──────────────────────────────┤
│ Source IP Address        │  mis. 192.168.20.50          │
├──────────────────────────┼──────────────────────────────┤
│ Destination IP Address   │  mis. 192.168.30.10          │
└──────────────────────────┴──────────────────────────────┘
+ Payload (segment TCP/UDP)</pre>
<ul>
<li><b>Source/Destination IP:</b> alamat logis ujung-ke-ujung — <b>tidak berubah</b> selama perjalanan (kecuali NAT, Part 19).</li>
<li><b>TTL</b> (<i>Time To Live</i>): angka (mis. 64) yang <b>dikurangi 1 setiap lewat router</b>. Mencapai 0 → packet dibuang. Fungsinya: pencegah loop abadi — tanpa TTL, packet nyasar bisa berputar selamanya.</li>
<li><b>Protocol:</b> isi payload-nya protokol apa — <code>6</code> = TCP, <code>17</code> = UDP, <code>1</code> = ICMP. (Jangan tertukar dengan <i>port number</i> — ini nomor protokol L4, bukan port.)</li>
<li><b>Header Checksum:</b> validasi header saja (isi payload tidak dicek di L3).</li>
</ul>
<h3>Cara Kerja: Keputusan Router</h3>
<p>Router membaca <b>Destination IP</b>, mencocokkannya dengan <b>routing table</b> ("network ini lewat interface/next-hop mana?"), mengurangi TTL, lalu meneruskan. Tiga hasil: <b>forward</b> ke next-hop, <b>deliver</b> langsung (tujuan di jaringan lokalnya), atau <b>drop</b> (tidak ada rute → ICMP "destination unreachable").</p>
<div class="callout blue"><div class="t">TTL Adalah Jejak Hop</div><p style="margin:4px 0 0">Perintah <code>traceroute</code>/<code>tracert</code> mengeksploitasi TTL: kirim packet dengan TTL=1, 2, 3... — tiap router yang membuang packet karena TTL habis mengirim kembali ICMP "time exceeded", sehingga pengirim tahu alamat tiap hop. Trik elegan memakai mekanisme pencegah loop sebagai alat ukur — dipraktikkan di Part 03.</p></div>`,
      terms: [
        ['Packet', 'PDU Layer 3: header IP (src/dst address, TTL, protocol) + payload; di-routing antar-jaringan.'],
        ['TTL', 'Time To Live — counter yang dikurangi 1 tiap hop router; 0 = packet dibuang (pencegah loop).'],
        ['Routing table', 'Tabel di router: pemetaan network tujuan → interface/next-hop.'],
        ['Protocol field', 'Field di header IP: nomor protokol L4 di payload (6=TCP, 17=UDP, 1=ICMP).'],
      ],
      diagram: `<pre>        PACKET: TETAP SAMA ANTAR-HOP (kecuali TTL)

   PC ──packet──▶ R1 ──packet──▶ R2 ──packet──▶ Server
   src IP: 192.168.20.50  (TETAP dari ujung ke ujung)
   dst IP: 192.168.30.10  (TETAP dari ujung ke ujung)
   TTL: 64 → 63 → 62      (berkurang tiap router)

   Bandingkan: FRAME diganti total tiap hop,
   PACKET dipertahankan (hanya TTL yang berubah).</pre>`,
      scenario: 'Packet dari kantor cabang tidak pernah sampai ke pusat padahal link up. Capture menunjukkan TTL mencapai 0 dan router mengembalikan "time exceeded" — ada <b>routing loop</b>: dua router saling melempar packet ke satu sama lain. Tanpa pemahaman TTL, gejalanya misterius ("kadang timeout"); dengan pemahaman TTL, diagnosisnya 5 menit: cek routing table kedua router, temukan rute yang melingkar.',
      bestPractices: 'Saat packet hilang di tengah jalan, cek TTL di capture: TTL yang sangat kecil saat tiba menandakan rute terlalu panjang/looping; "time exceeded" menandakan persis di hop mana ia mati.',
      security: 'Field TTL juga dipakai untuk fingerprinting OS (Windows default 128, Linux 64, router 255) — informasi kecil yang membantu penyerang memetakan jaringan. Firewall bisa men-normalisasi TTL.',
      challenge: 'Sebuah packet dikirim dengan TTL 64 melewati 3 router. Berapa TTL saat tiba di tujuan? Apa yang terjadi jika ada routing loop dan TTL mencapai 0 di router kedua?',
      interviewQ: 'Q: "Apa fungsi TTL dan apa jadinya tanpa TTL?" — A: TTL adalah counter pencegah loop: dikurangi 1 setiap hop router, packet dibuang saat mencapai 0. Tanpa TTL, packet yang terjebak routing loop akan berputar selamanya, membanjiri jaringan — dan traceroute tidak akan bisa bekerja.',
      quiz: [
        { q: 'Router mengambil keputusan forwarding berdasarkan…', options: ['MAC address tujuan', 'Destination IP + routing table', 'Port number', 'FCS'], answer: 1, explain: 'Router (L3) membaca IP tujuan dan mencocokkannya dengan routing table → next-hop.' },
        { q: 'Selama perjalanan melewati 3 router, yang BERUBAH pada packet IP adalah…', options: ['Source IP', 'Destination IP', 'TTL (berkurang 1 tiap hop)', 'Protocol field'], answer: 2, explain: 'IP src/dst ujung-ke-ujung tetap; hanya TTL yang dikurangi tiap router.' },
        { q: 'Nilai pada field Protocol = 6 artinya payload berisi…', options: ['ICMP', 'UDP', 'TCP', 'ARP'], answer: 2, explain: 'Protocol numbers: 1=ICMP, 6=TCP, 17=UDP. Ini nomor protokol L4, bukan port.' },
      ],
    },
    {
      id: '2.14',
      title: 'Segment',
      body: `<p><b>Segment</b> adalah PDU <b>Layer 4</b> untuk <b>TCP</b> — hasil pemecahan data oleh Transport layer agar muat dikirim dan bisa disusun ulang. Jika packet urusan alamat, segment urusan <b>keutuhan dan ketertiban</b> data.</p>
<h3>Struktur Header TCP (20 byte, disederhanakan)</h3>
<pre>┌──────────────────┬──────────────────┐
│ Source Port      │ Dest Port        │  ← aplikasi mana?
├──────────────────┴──────────────────┤
│ Sequence Number                       │  ← urutan byte ke-berapa
├───────────────────────────────────────┤
│ Acknowledgment Number                 │  ← "sudah terima sampai sini"
├────┬─────────────────────────┬────────┤
│ ...│ Flags (SYN,ACK,FIN,RST) │ Window │
└────┴─────────────────────────┴────────┘
+ Payload (data aplikasi)</pre>
<ul>
<li><b>Port src/dst:</b> aplikasi pengirim & penerima (lihat 2.11).</li>
<li><b>Sequence number:</b> nomor urut byte — penerima menyusun ulang segment yang datang acak, dan mendeteksi yang hilang.</li>
<li><b>Acknowledgment:</b> "saya sudah terima sampai byte ke-X" — dasar keandalan TCP.</li>
<li><b>Flags:</b> penanda kontrol — <b>SYN</b> (minta koneksi), <b>ACK</b> (konfirmasi), <b>FIN</b> (tutup koneksi), <b>RST</b> (batalkan paksa).</li>
<li><b>Window:</b> <b>flow control</b> — "saya sanggup terima sekian byte dulu", mencegah pengirim membanjiri penerima lambat.</li>
</ul>
<h3>Mengapa Segmentasi Diperlukan?</h3>
<p>Data aplikasi bisa besar (file 100 MB) sementara frame Ethernet maksimal ~1500 byte (MTU). TCP memecah data jadi segment-segment kecil, memberi nomor urut, dan penerima merakitnya kembali. Jika satu segment hilang → hanya segment itu yang dikirim ulang (<b>retransmission</b>), bukan seluruh file. Efisien dan andal.</p>
<div class="callout"><div class="t">TCP vs UDP dalam Satu Kalimat</div><p style="margin:4px 0 0"><b>TCP</b> = kirim paket pos tercatat: ada nomor resi (sequence), konfirmasi terima (ACK), kirim ulang jika hilang — lambat tapi pasti. <b>UDP</b> = kirim kartu pos biasa: cepat, murah, tapi kalau hilang ya hilang. Keduanya dibedah mendalam di Part 03 (3.9–3.11).</p></div>`,
      terms: [
        ['Segment', 'PDU Layer 4 untuk TCP: header (port, sequence, ACK, flags) + data.'],
        ['Sequence number', 'Nomor urut byte di TCP untuk menyusun ulang dan mendeteksi kehilangan.'],
        ['Flow control', 'Mekanisme TCP (window) agar pengirim tidak membanjiri penerima.'],
        ['Retransmission', 'Pengiriman ulang segment yang hilang/tidak di-ACK — sumber keandalan TCP.'],
      ],
      scenario: 'Download file 1 GB di jaringan ber-loss 2% terasa sangat lambat padahal bandwidth besar. Capture menunjukkan banjir retransmission: TCP terus mengirim ulang segment yang hilang, dan setiap kehilangan memangkas kecepatan kirim (congestion control). Masalahnya bukan bandwidth — melainkan kualitas link (loss) yang menghukum TCP. Diagnosis ini mustahil tanpa memahami sequence & retransmission.',
      bestPractices: 'Saat performa TCP buruk, jangan langsung menyalahkan bandwidth — cek retransmission rate di capture/statistics. Loss kecil berdampak besar pada TCP.',
      security: 'Flags TCP adalah permukaan serangan klasik: SYN flood (banjir SYN tanpa menyelesaikan handshake) melumpuhkan server — mitigasinya SYN cookies & rate limiting (Part 29).',
      challenge: 'Jelaskan dengan analogi pengiriman buku berjilid lewat pos: apa peran sequence number, acknowledgment, dan window dalam analogi itu?',
      interviewQ: 'Q: "Apa isi penting header TCP dan fungsinya?" — A: Port src/dst (aplikasi tujuan), sequence number (urutan & deteksi hilang), acknowledgment (konfirmasi terima), flags (SYN/ACK/FIN/RST untuk kontrol koneksi), window (flow control). Kombinasi inilah yang membuat TCP andal.',
      quiz: [
        { q: 'Segment adalah PDU layer…', options: ['Layer 2', 'Layer 3', 'Layer 4 — Transport (TCP)', 'Layer 7'], answer: 2, explain: 'Segment = PDU L4 untuk TCP (header port, sequence, flags).' },
        { q: 'Fungsi sequence number di header TCP adalah…', options: ['Menentukan rute', 'Memberi nomor urut agar penerima bisa menyusun ulang dan mendeteksi segment hilang', 'Mengenkripsi data', 'Memilih VLAN'], answer: 1, explain: 'Sequence = nomor urut byte; dasar reassembly dan retransmission.' },
        { q: 'Flag SYN pada TCP dipakai untuk…', options: ['Menutup koneksi', 'Meminta/membuka koneksi baru (three-way handshake)', 'Mengirim data file', 'Menolak koneksi'], answer: 1, explain: 'SYN = synchronize: inisiasi koneksi, langkah 1 dari three-way handshake (Part 03).' },
      ],
    },
    {
      id: '2.15',
      title: 'Bagaimana Packet Berjalan dari PC ke Server?',
      body: `<p>Inilah sub-bab puncak Part 02: <b>menelusuri satu packet</b> dari PC di VLAN 20 OFFICE (<code>192.168.20.50</code>) ke server di VLAN 30 SERVER (<code>192.168.30.10</code>), melewati switch dan router (<code>192.168.20.1</code> / <code>192.168.30.1</code>). Jika kamu paham alur ini, kamu paham 80% cara kerja jaringan.</p>
<h3>Langkah 0 — Apakah Tujuan Satu Jaringan?</h3>
<p>PC membandingkan IP tujuan dengan subnet-nya sendiri (memakai subnet mask — Part 04). <code>192.168.30.10</code> <b>beda network</b> dengan <code>192.168.20.0/24</code> → kesimpulan: <b>"tidak bisa langsung, harus lewat default gateway"</b>. Keputusan ini dibuat di <b>Layer 3</b> sebelum satu bit pun dikirim.</p>
<h3>Langkah 1 — Encapsulation di PC (7 → 1)</h3>
<p>Aplikasi membuat data → TCP menambah header (port tujuan 443, sequence) → IP menambah header (src <code>192.168.20.50</code>, dst <code>192.168.30.10</code>, TTL 64). Sekarang butuh frame: <b>MAC tujuan = MAC gateway</b> (bukan MAC server — server beda LAN!). Dari mana PC tahu MAC gateway? Dari <b>ARP</b> (Part 03): "siapa pemilik 192.168.20.1?" → dapat MAC-nya, simpan di ARP table.</p>
<h3>Langkah 2 — Switch Meneruskan Frame (L2)</h3>
<p>Switch terima frame, baca Dest MAC (MAC gateway), cek MAC table → forward ke port gateway. Switch <b>tidak mengubah apa pun</b> dan tidak peduli IP. Frame masih utuh.</p>
<h3>Langkah 3 — Router: Buka Sampai L3, Bungkus Ulang (Kunci!)</h3>
<pre>Router terima frame di interface VLAN 20:
  1. L2: MAC tujuan = MAC saya? Ya → lepas frame, cek FCS ✓
  2. L3: IP tujuan 192.168.30.10 = saya? Bukan → ROUTE!
     → routing table: 192.168.30.0/24 via interface VLAN 30
     → TTL 64 → 63
  3. Butuh frame baru: MAC tujuan = MAC server (via ARP di VLAN 30)
     MAC sumber = MAC interface VLAN 30 router
  4. Kirim frame BARU keluar interface VLAN 30</pre>
<p>Perhatikan: <b>frame diganti total</b> (MAC src/dst baru), <b>packet IP tetap sama</b> kecuali TTL. Inilah inti routing.</p>
<h3>Langkah 4 — Switch VLAN 30 & Server (Decapsulation 1 → 7)</h3>
<p>Switch VLAN 30 meneruskan frame ke server berdasar MAC. Server: MAC cocok → IP cocok → port 443 ada yang listen → data naik ke aplikasi. <b>Balasannya</b> menempuh jalan terbalik: server → gateway-nya (<code>192.168.30.1</code>) → router → PC.</p>
<div class="tblwrap"><table>
<tr><th>Hop</th><th>Frame (L2) MAC dst</th><th>Packet (L3) IP dst</th><th>TTL</th></tr>
<tr><td>PC → Switch → Router</td><td>MAC gateway (.20.1)</td><td>192.168.30.10 (tetap)</td><td>64</td></tr>
<tr><td>Router → Switch → Server</td><td>MAC server (frame BARU)</td><td>192.168.30.10 (tetap)</td><td>63</td></tr>
</table></div>
<div class="callout blue"><div class="t">Satu Kalimat Inti</div><p style="margin:4px 0 0"><b>MAC address berubah di setiap hop</b> (urusan lokal), <b>IP address tetap dari ujung ke ujung</b> (urusan global). Kalau kamu hanya ingat satu hal dari Part 02, ingatlah ini.</p></div>`,
      terms: [
        ['Default gateway', 'Router yang dituju host saat tujuan beda network — "pintu keluar" LAN.'],
        ['Next-hop', 'Router/interface berikutnya yang dituju packet menurut routing table.'],
        ['Hop', 'Satu lompatan perjalanan packet: PC→switch→router→server = 3 hop.'],
      ],
      diagram: `<pre>   PACKET JOURNEY: PC (VLAN 20) → SERVER (VLAN 30)

   [PC .20.50] ──frame──▶ [SW] ──frame──▶ [R .20.1]
   MAC dst: MAC-R                     strip frame,
   IP dst: 192.168.30.10  ─┐          TTL 64→63,
   TTL: 64                 │          frame BARU:
                           │          MAC src=R-vlan30
   [R .30.1] ──frame──▶ [SW] ──frame──▶ [Server .30.10]
   MAC dst: MAC-Server              decapsulate:
   IP dst: 192.168.30.10 (TETAP!)   MAC✓ → IP✓ → port 443✓
   TTL: 63                          → data ke aplikasi

   ★ MAC berubah tiap hop · IP tetap ujung-ke-ujung ★</pre>`,
      scenario: 'Tiket NOC: "PC tidak bisa akses server, tapi bisa ping gateway." Engineer langsung memetakan: ping gateway OK = L2/L3 lokal sehat sampai router. Gagal ke server = masalah <b>setelah</b> router: routing ke VLAN 30, ARP router ke server, atau firewall. Ia tidak membuang waktu mengecek kabel PC — peta hop-nya sudah jelas. Inilah gunanya memahami packet journey.',
      bestPractices: 'Untuk setiap masalah konektivitas, gambar dulu hop-nya (seperti diagram di atas) lalu uji per hop dengan ping. Hop terakhir yang merespons = lokasi masalahnya.',
      security: 'Perhatikan: di hop PC→router, packet "telanjang" (belum tentu terenkripsi) bisa di-capture siapa pun di LAN — inilah alasan enkripsi (TLS/VPN) penting bahkan di jaringan internal.',
      challenge: 'Ulangi packet journey ini untuk kasus sebaliknya: server (.30.10) membalas ke PC (.20.50). Tulis MAC src/dst dan IP src/dst di tiap hop balasan.',
      interviewQ: 'Q: "Jelaskan perjalanan packet dari PC ke server beda subnet, apa yang berubah di tiap hop?" — A: PC menentukan tujuan beda network → kirim ke gateway via ARP. Switch forward frame berdasar MAC. Router membuka sampai L3, routing, TTL-1, lalu membuat frame baru dengan MAC hop berikutnya. IP src/dst tetap ujung-ke-ujung; MAC berubah tiap hop. Server melakukan decapsulation sampai aplikasi.',
      quiz: [
        { q: 'PC (192.168.20.50) ingin ke server (192.168.30.10). MAC tujuan pada frame yang keluar dari PC adalah…', options: ['MAC server', 'MAC gateway (192.168.20.1) — karena beda network', 'MAC broadcast', 'MAC switch'], answer: 1, explain: 'Beda network → frame ditujukan ke gateway (hop lokal berikutnya); IP tujuan tetap IP server.' },
        { q: 'Saat packet melewati router, yang terjadi adalah…', options: ['IP tujuan diganti dengan IP router', 'Frame lama dibuang, TTL dikurangi 1, dibuat frame baru; IP src/dst tetap', 'Packet dienkripsi otomatis', 'MAC address dipertahankan'], answer: 1, explain: 'Router strip frame lama → routing → TTL-1 → enkapsulasi ulang ke frame baru. IP ujung-ke-ujung tidak berubah.' },
        { q: 'Bagaimana PC tahu MAC address gateway-nya?', options: ['Menebak', 'Melalui ARP request: "siapa pemilik 192.168.20.1?"', 'Dari DNS', 'Dari DHCP saja'], answer: 1, explain: 'ARP memetakan IP→MAC di LAN; hasilnya disimpan di ARP table (detail di Part 03).' },
      ],
    },
    {
      id: '2.16',
      title: 'Hands-On: Packet Flow Lab',
      body: `<p>Lab ini membuktikan teori 2.15 dengan <b>tanganmu sendiri</b>, memakai tool yang ada di setiap PC — tanpa GNS3, tanpa device mahal. Kamu akan melihat ARP, gateway, dan TTL bekerja secara nyata.</p>
<h3>Topologi</h3>
<pre>Lab minimal (pakai jaringan yang sudah ada):

 [PC-mu] ──(kabel/Wi-Fi)── [Switch/AP] ── [Router/Gateway]
  DHCP/Statik                LAN rumah/kantor   192.168.x.1

Target uji:  (A) gateway (satu LAN)   (B) 8.8.8.8 (beda network/internet)</pre>
<h3>Objective</h3>
<p>Membuktikan tiga hal: (1) komunikasi satu LAN memakai MAC langsung via ARP; (2) komunikasi beda network selalu lewat gateway; (3) TTL berkurang dan terlihat via traceroute.</p>
<h3>Konfigurasi</h3>
<p>Tidak ada konfigurasi device — kita memakai <b>mode observasi</b>. Alasannya: sebelum berani mengubah, engineer harus bisa <i>membaca</i> dulu. Siapkan: Command Prompt/Terminal, dan (opsional) Wireshark.</p>
<ul>
<li><b>Windows:</b> <code>ipconfig /all</code> — <i>mengapa?</i> untuk mencatat IP-mu, gateway-mu, dan MAC-mu (baseline sebelum eksperimen).</li>
<li><b>Linux:</b> <code>ip addr && ip route</code> — <i>mengapa?</i> sama: baseline IP + tabel routing ("default via ..." = gateway-mu).</li>
</ul>
<h3>Verifikasi (Baseline Sehat)</h3>
<pre># 1. Lihat ARP table — bukti pemetaan IP→MAC di LAN-mu
arp -a
# Mengapa: membuktikan MAC gateway sudah dikenal via ARP (teori 2.15 langkah 1)

# 2. Ping gateway (satu LAN) — ukur 1 hop
ping 192.168.20.1        # ganti dengan gateway-mu
# Mengapa: baseline L2+L3 lokal sehat; catat time<1ms & TTL=64

# 3. Lacak hop ke internet — lihat TTL bekerja
tracert 8.8.8.8          # Windows
traceroute 8.8.8.8       # Linux
# Mengapa: tiap baris = satu router yang membuang packet karena TTL habis (teori 2.13)</pre>
<p><b>Expected output:</b> <code>arp -a</code> menampilkan baris gateway dengan MAC-nya; ping gateway &lt;1 ms; traceroute menampilkan hop 1 = gateway-mu, hop 2 = router ISP, dst.</p>
<h3>Failure Injection (Rusak dengan Sengaja)</h3>
<p><b>Injeksi 1 — cabut gateway dari PC:</b> set IP statik dengan gateway yang salah (mis. <code>192.168.20.99</code> yang tidak ada).</p>
<ul>
<li><b>Windows:</b> Network settings → ubah gateway → <i>jangan lupa catat setting awal!</i></li>
<li><b>Linux (sementara):</b> <code>sudo ip route del default && sudo ip route add default via 192.168.20.99</code> — <i>mengapa command ini?</i> menghapus rute default lalu menambah yang salah; efeknya hilang saat reboot/network restart (aman untuk lab).</li>
</ul>
<p><b>Ekspektasi:</b> ping ke sesama LAN <b>masih bisa</b> (tidak butuh gateway!), ping ke 8.8.8.8 <b>gagal</b>. Ini membuktikan teori: gateway hanya dibutuhkan untuk beda network.</p>
<h3>Troubleshooting</h3>
<p>Dengan gateway salah, jalankan diagnosis berlapis (OSI):</p>
<pre>ping 127.0.0.1        # L1-L3 stack sendiri OK?
ping <IP-sendiri>     # NIC & IP binding OK?
ping <tetangga-LAN>   # L2/L3 lokal OK? → harusnya BISA
ping 8.8.8.8          # beda network → GAGAL (bukti gateway salah)
arp -a                # apakah ada entry 192.168.20.99? → incomplete/gagal</pre>
<h3>Fix</h3>
<p>Kembalikan gateway yang benar (catatan baseline tadi):</p>
<pre># Linux
sudo ip route del default
sudo ip route add default via 192.168.20.1   # gateway yang benar
# Windows: kembalikan via Network settings / netsh</pre>
<h3>Final Verification</h3>
<p>Ulangi tiga perintah baseline: <code>arp -a</code> (entry gateway valid), <code>ping 8.8.8.8</code> (balasan OK), <code>tracert 8.8.8.8</code> (hop terlihat). Semua hijau = lab selesai. Catat temuanmu: "ping LAN bisa tanpa gateway, ping internet wajib gateway" — kalimat ini adalah bukti pemahaman packet flow.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Mengubah gateway di lab = aman (kembalikan setelahnya). Di production, mengubah gateway/DHCP scope tanpa change request bisa memutus ratusan user — selalu ada rollback plan dan maintenance window (Part 01).</p></div>`,
      terms: [
        ['Baseline', 'Kondisi normal yang dicatat sebelum eksperimen — pembanding saat troubleshooting.'],
        ['ipconfig / ip addr', 'Perintah melihat konfigurasi IP, MAC, dan gateway di Windows/Linux.'],
      ],
      scenario: 'Seorang junior melaporkan "internet mati total". Senior memintanya ping tetangga satu LAN — ternyata bisa. Kesimpulan 30 detik: bukan kabel/switch yang rusak, melainkan gateway/routing. Lab ini melatih refleks diagnosis berlapis persis seperti itu.',
      bestPractices: 'Selalu catat baseline (ipconfig, gateway, arp -a) SEBELUM mengubah apa pun. Tanpa baseline, kamu tidak tahu apa yang "normal".',
      security: 'Perintah <code>arp -a</code> juga alat deteksi awal ARP spoofing: jika satu MAC mengklaim banyak IP, atau MAC gateway berubah-ubah — itu tanda bahaya (Part 29).',
      challenge: 'Tanpa melihat materi: jelaskan mengapa ping ke tetangga LAN tetap bisa saat gateway diset salah. Tulis penjelasan 3 kalimat memakai istilah ARP, MAC, dan broadcast domain.',
      interviewQ: 'Q: "PC bisa ping sesama LAN tapi tidak bisa ke internet. Di mana kemungkinan masalahnya?" — A: L1–L3 lokal sehat (ARP & switching OK). Fokus ke: gateway salah/tidak reachable, routing/NAT di router, DNS, atau firewall/ISP. Uji berlapis: ping gateway → ping 8.8.8.8 (IP) → ping google.com (DNS).',
      quiz: [
        { q: 'Dalam lab ini, setelah gateway diset salah, ping ke sesama LAN…', options: ['Gagal total', 'Tetap bisa — komunikasi satu LAN tidak butuh gateway', 'Bisa tapi lambat', 'Hanya bisa via Wi-Fi'], answer: 1, explain: 'Satu broadcast domain/LAN: frame langsung via MAC (ARP), gateway hanya untuk beda network.' },
        { q: 'Tujuan menjalankan tracert/traceroute di lab ini adalah…', options: ['Mengukur kecepatan download', 'Melihat daftar hop router — bukti TTL berkurang per hop', 'Mengganti gateway', 'Menghapus ARP table'], answer: 1, explain: 'Traceroute mengeksploitasi TTL: tiap hop yang membuang packet karena TTL habis membalas ICMP time-exceeded.' },
        { q: 'Langkah PERTAMA yang benar sebelum failure injection adalah…', options: ['Langsung ubah gateway', 'Mencatat baseline (ipconfig, gateway, arp -a)', 'Restart router', 'Install ulang driver'], answer: 1, explain: 'Tanpa baseline kamu tidak tahu kondisi normal dan tidak bisa memverifikasi fix — aturan emas lab.' },
      ],
    },
    {
      id: '2.17',
      title: 'Hands-On: Troubleshooting Lab',
      body: `<p>Lab ini melatih <b>metodologi troubleshooting berlapis OSI</b> — skill yang membedakan engineer dari "tukang coba-coba". Kamu akan diberi skenario rusak, lalu memperbaikinya dengan urutan yang benar: <b>dari bawah (L1) ke atas (L7)</b>.</p>
<h3>Topologi</h3>
<pre> [PC-A 192.168.20.50] ── [Switch] ── [Router .20.1/.30.1] ── [Switch] ── [Server 192.168.30.10:80]
        VLAN 20 OFFICE                        VLAN 30 SERVER (web intranet)</pre>
<h3>Objective</h3>
<p>PC-A tidak bisa membuka web intranet (<code>http://192.168.30.10</code>). Temukan layer penyebabnya dengan metode bottom-up, perbaiki, dan verifikasi — maksimal 15 menit seperti di NOC.</p>
<h3>Konfigurasi (Simulasi Kerusakan)</h3>
<p>Minta teman (atau dirimu sendiri kemarin) menanam <b>satu</b> dari kerusakan ini — kamu tidak boleh tahu yang mana:</p>
<div class="tblwrap"><table>
<tr><th>#</th><th>Kerusakan (Layer)</th><th>Cara Menanam</th></tr>
<tr><td>1</td><td>L1: kabel longgar</td><td>Cabut-colok kabel setengah (atau disable interface)</td></tr>
<tr><td>2</td><td>L3: IP salah subnet</td><td>Set PC-A ke 192.168.99.50/24 (VLAN MGMT!)</td></tr>
<tr><td>3</td><td>L3: gateway salah</td><td>Set gateway ke 192.168.20.99</td></tr>
<tr><td>4</td><td>L4: web server mati</td><td>Stop service web di server</td></tr>
</table></div>
<h3>Verifikasi & Troubleshooting (Bottom-Up)</h3>
<p>Ikuti urutan ini — <b>jangan loncat</b>. Berhenti di layer pertama yang gagal:</p>
<pre>L1: Apakah link up? (lampu port, ipconfig: "media disconnected"?)
    → GAGAL = periksa kabel/port. SELESAI di sini, jangan lanjut.
L2: arp -a → apakah MAC gateway/server terlihat?
    → "incomplete" = masalah ARP/L2.
L3: ping gateway → ping server (pakai IP, bukan nama!)
    → gateway OK tapi server gagal = masalah routing setelah router.
L4: telnet 192.168.30.10 80  (atau Test-NetConnection -Port 80)
    → "connection refused" = server hidup, service mati (kasus #4).
L7: buka http://192.168.30.10 di browser → cek konten benar.</pre>
<p><b>Mengapa urutan ini?</b> Layer bawah adalah fondasi layer atas — tidak ada gunanya debug HTTP (L7) kalau kabelnya (L1) copot. Setiap langkah mengeliminasi satu layer dengan <b>bukti</b>, bukan tebakan.</p>
<h3>Failure Injection</h3>
<p>Itulah tabel "Cara Menanam" di atas — tiap baris adalah satu injeksi. Variasikan: tanam 2 kerusakan sekaligus untuk level expert (mis. L1 + L4).</p>
<h3>Troubleshooting (Metodologi)</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Layer Tersangka</th><th>Perintah Kunci</th></tr>
<tr><td>"Media disconnected" / lampu port mati</td><td>L1</td><td>cek fisik, <code>ipconfig</code>, ethtool</td></tr>
<tr><td>IP 169.254.x.x (APIPA)</td><td>L3 (DHCP gagal)</td><td><code>ipconfig /renew</code>, cek DHCP server</td></tr>
<tr><td>ARP incomplete untuk gateway</td><td>L2</td><td><code>arp -a</code>, cek VLAN port</td></tr>
<tr><td>Ping gateway OK, ping server gagal</td><td>L3 (routing)</td><td><code>tracert</code>, cek routing table</td></tr>
<tr><td>Ping OK, telnet port 80 refused</td><td>L4 (service)</td><td><code>telnet/netstat</code> di server</td></tr>
<tr><td>Telnet OK, browser error</td><td>L7 (aplikasi)</td><td>cek log aplikasi</td></tr>
</table></div>
<h3>Fix & Final Verification</h3>
<p>Perbaiki sesuai temuan (colok kabel / betulkan IP / betulkan gateway / start service), lalu verifikasi <b>dari bawah ke atas</b> sampai browser menampilkan halaman intranet. Dokumentasikan: gejala → layer → bukti → fix → verifikasi. Format ini adalah standar laporan insiden NOC.</p>
<div class="callout blue"><div class="t">Aturan Emas Troubleshooting</div><p style="margin:4px 0 0"><b>Ubah satu hal dalam satu waktu, lalu uji.</b> Mengubah 3 hal sekaligus lalu "tiba-tiba bisa" membuatmu tidak tahu mana yang benar-benar memperbaikinya — dan masalah akan kembali.</p></div>`,
      terms: [
        ['Bottom-up troubleshooting', 'Metode diagnosis dari Layer 1 ke atas; berhenti di layer pertama yang gagal.'],
        ['APIPA', 'IP 169.254.x.x otomatis saat DHCP gagal — gejala klasik L3 (dibahas Part 04).'],
        ['Telnet test', 'Memakai telnet ke port tertentu untuk menguji keterbukaan L4 (bukan untuk login!).'],
      ],
      scenario: 'Alarm NOC 02.00: "server monitoring tidak bisa diakses". Operator junior langsung me-restart server (tebakan L7) — sia-sia, karena ternyata kabel uplink switch yang longgar (L1). 20 menit downtime sia-sia. Dengan metode bottom-up, ia akan mengecek link dalam 60 detik pertama. Metodologi menghemat lebih dari sekadar waktu: ia mencegah "perbaikan" yang merusak.',
      bestPractices: 'Buat checklist troubleshooting berlapis versi dirimu sendiri, cetak, tempel di meja. Saat panik (insiden), manusia kembali ke checklist — bukan ke ingatan.',
      security: 'Jangan pernah "memperbaiki" dengan mematikan firewall atau membuka semua port "sementara" — "sementara" di production sering menjadi permanen dan menjadi temuan audit.',
      challenge: 'Tanam 2 kerusakan sekaligus (satu L1–L3, satu L4/L7). Minta teman memecahkannya dengan metode bottom-up sambil kamu mencatat waktunya. Evaluasi: di langkah mana ia hampir loncat layer?',
      interviewQ: 'Q: "User tidak bisa buka website. Jelaskan langkah troubleshooting-mu." — A: Bottom-up berlapis: L1 link up? → L2 ARP/gateway terlihat? → L3 ping gateway lalu ping IP server (bedakan masalah DNS dengan ping nama) → L4 telnet ke port 443 → L7 cek browser/proxy. Berhenti di layer pertama yang gagal, perbaiki, verifikasi ke atas.',
      quiz: [
        { q: 'Prinsip utama troubleshooting berlapis OSI adalah…', options: ['Mulai dari aplikasi (L7) karena itu yang dikeluhkan user', 'Mulai dari Layer 1 ke atas; berhenti di layer pertama yang gagal', 'Cek semua layer sekaligus', 'Restart semua device dulu'], answer: 1, explain: 'Bottom-up: layer bawah adalah fondasi; sia-sia debug L7 jika L1 putus.' },
        { q: 'Ping ke server (IP) berhasil tapi telnet ke port 80 "connection refused". Kesimpulannya…', options: ['Kabel putus (L1)', 'Routing rusak (L3)', 'Network sehat sampai L3; masalah di L4 — service web tidak listen', 'DNS rusak'], answer: 2, explain: 'Ping OK = L3 hidup. Refused = L4 mencapai host tapi tidak ada aplikasi di port itu.' },
        { q: 'PC mendapat IP 169.254.x.x. Artinya…', options: ['IP statik berhasil', 'DHCP gagal sehingga APIPA aktif — masalah L3/DHCP', 'Kabel putus total', 'Virus'], answer: 1, explain: '169.254.0.0/16 = APIPA: host tidak mendapat IP dari DHCP server.' },
      ],
    },
  ],
  project: {
    title: 'Project Part 02 — Packet Journey Documentation (Portfolio)',
    html: `<div class="proj">
<h3>Project Part 02 — Packet Journey Documentation</h3>
<p><b>Tugasmu:</b> buat dokumen yang menelusuri <b>satu packet HTTP</b> dari PC OFFICE (<code>192.168.20.50</code>) ke server (<code>192.168.30.10</code>) melewati switch dan router — lengkap dengan encapsulation di tiap layer dan perubahan MAC/IP/TTL di tiap hop, seperti sub-bab 2.15 tetapi versi <i>milikmu</i> dengan analisismu sendiri.</p>
<p><b>Isi dokumen (packet-journey.md):</b></p>
<ol>
<li>Diagram topologi (ASCII atau draw.io) dengan IP & MAC tiap device.</li>
<li>Tabel hop-per-hop: Frame (MAC src/dst) vs Packet (IP src/dst, TTL) — seperti tabel 2.15.</li>
<li>Penjelasan encapsulation di PC (Data → Segment → Packet → Frame → Bits) + header penting tiap layer.</li>
<li>Penjelasan decapsulation di server + apa yang dicek tiap layer.</li>
<li>Hasil lab 2.16 milikmu: output <code>arp -a</code>, <code>ping</code>, <code>tracert</code> (tulis asli dari komputermu).</li>
<li>Satu skenario troubleshooting (2.17) yang kamu pecahkan: gejala → layer → bukti → fix.</li>
</ol>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Buka repository <code>network-engineer-lab</code> milikmu (dibuat di Part 01).</span></li>
<li><span class="n">2</span><span>Buat folder <code>part-02-osi-tcpip/</code> berisi <code>README.md</code> (ringkasan) dan <code>packet-journey.md</code> (dokumen lengkap).</span></li>
<li><span class="n">3</span><span>Commit dengan pesan <code>"Part 02: packet journey documentation"</code> lalu push.</span></li>
<li><span class="n">4</span><span>Pastikan tabel hop dan output lab ter-render rapi di GitHub.</span></li>
</ol>
<p><b>Kriteria selesai:</b> tabel hop benar (MAC berubah tiap hop, IP tetap, TTL berkurang), istilah PDU tepat (frame/packet/segment tidak tertukar), output lab asli dari komputermu tercantum, dan minimal 1 skenario troubleshooting terdokumentasi dengan format gejala → layer → bukti → fix.</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 02</div>
<p style="margin:6px 0 0">1) Apa beda frame, packet, segment? &nbsp;2) Apa yang berubah pada packet saat melewati router? &nbsp;3) Mengapa butuh MAC dan IP sekaligus? &nbsp;4) Jelaskan encapsulation dalam 4 langkah. &nbsp;5) PC bisa ping LAN tapi tidak ke internet — di mana masalahnya? — Kuasai kelimanya dengan kata-katamu sendiri sebelum lanjut ke Part 03.</p></div>`,
  },
};
