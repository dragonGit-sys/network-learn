// Part 03 — Ethernet & Networking Fundamentals.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
import type { Part } from './types';

export const part03: Part = {
  id: '03',
  number: 'PART 03',
  title: 'Ethernet & Networking Fundamentals',
  phaseId: 'fase-1',
  description: 'Ethernet, MAC, ARP, broadcast/unicast/multicast, TCP/UDP, DNS, DHCP, dan tool jaringan dasar.',
  repoFolder: 'part-03-ethernet-fundamentals',
  objectives: [
    'Menjelaskan cara kerja Ethernet, MAC address, ARP, dan tipe komunikasi unicast/broadcast/multicast.',
    'Membedakan TCP dan UDP, three-way handshake, serta peran ICMP dalam diagnosis.',
    'Menjelaskan alur kerja DNS, DHCP, HTTP/HTTPS, SSH — dan mengapa Telnet tidak aman.',
    'Menggunakan tool jaringan dasar (ping, arp, traceroute, nslookup, netstat) untuk verifikasi dan troubleshooting.',
    'Melakukan packet capture dengan tcpdump/Wireshark dan membaca handshake TCP serta ARP/DNS.',
  ],
  prerequisites: 'Part 02 — OSI Model & TCP/IP (7 layer, encapsulation, PDU, packet journey PC → server).',
  subbabs: [
    {
      id: '3.1',
      title: 'Ethernet',
      body: `<p><b>Ethernet</b> adalah keluarga teknologi jaringan kabel yang distandarkan oleh <b>IEEE 802.3</b> — dan ia adalah <b>penguasa LAN dunia</b>: hampir semua jaringan kabel kantor, data center, dan rumah memakai Ethernet. Ia bekerja di <b>Layer 1 (kabel/sinyal) dan Layer 2 (frame/MAC)</b> model OSI.</p>
<h3>Pengertian Sederhana vs Teknis</h3>
<p><b>Sederhana:</b> Ethernet adalah "aturan main" agar banyak device bisa berbagi kabel/switch secara tertib — siapa boleh kirim kapan, format frame-nya seperti apa, kecepatannya berapa.</p>
<p><b>Teknis:</b> Ethernet mendefinisikan framing (struktur frame, lihat 2.12), pengalamatan MAC, dan metode akses media. Di era modern (switched Ethernet, full-duplex), setiap port switch adalah link point-to-point tersendiri sehingga <b>collision praktis hilang</b> — berbeda dengan Ethernet jadul berbasis hub yang memakai CSMA/CD (Part 01, sub-bab 1.10).</p>
<h3>Mengapa Ethernet Menang?</h3>
<ul>
<li><b>Murah & standar terbuka:</b> NIC Ethernet harganya receh karena diproduksi massal mengikuti standar IEEE yang sama.</li>
<li><b>Skalabel:</b> dari 10 Mbps (1980-an) sampai 400 Gbps (data center modern) — <i>nama dan konsepnya sama</i>, hanya kecepatannya naik. Investasi pengetahuanmu tidak kedaluwarsa.</li>
<li><b>Interoperable:</b> switch 1 Gbps merek apa pun bisa bicara dengan NIC merek apa pun — buah standar terbuka (pelajaran Part 02).</li>
</ul>
<h3>Keluarga Kecepatan Ethernet</h3>
<div class="tblwrap"><table>
<tr><th>Nama</th><th>Kecepatan</th><th>Media Umum</th><th>Pemakaian</th></tr>
<tr><td>Fast Ethernet (100BASE-TX)</td><td>100 Mbps</td><td>Cat5e</td><td>Legacy, CCTV lama</td></tr>
<tr><td>Gigabit Ethernet (1000BASE-T)</td><td>1 Gbps</td><td>Cat5e/Cat6</td><td>Standar kantor saat ini</td></tr>
<tr><td>10GBASE-T / SFP+</td><td>10 Gbps</td><td>Cat6A / fiber</td><td>Uplink switch, server</td></tr>
<tr><td>40/100 GbE (QSFP)</td><td>40–100 Gbps</td><td>Fiber</td><td>Core data center</td></tr>
</table></div>
<p>Penamaan seperti <b>1000BASE-T</b> dibaca: 1000 = Mbps, BASE = baseband, T = twisted pair. Detail media kabel di Part 06, fiber & transceiver di Part 07.</p>`,
      terms: [
        ['Ethernet', 'Standar jaringan kabel IEEE 802.3 (Layer 1–2); teknologi LAN dominan dunia.'],
        ['IEEE 802.3', 'Standar yang mendefinisikan Ethernet.'],
        ['Full-duplex', 'Komunikasi dua arah bersamaan; standar di switched Ethernet modern.'],
        ['1000BASE-T', 'Ethernet 1 Gbps di kabel twisted pair (penamaan: kecepatan-BASE-media).'],
      ],
      diagram: `<pre>         ETHERNET DARI MASA KE MASA (konsep sama, makin cepat)

   1980-an        2000-an         2010-an        2020-an
   10 Mbps   →  100 Mbps   →   1 Gbps    →  10/40/100 Gbps
   (hub,           (switch,       (switch,       (fiber,
    CSMA/CD)       full-duplex)   Cat6)          data center)

   Layer 1–2 OSI · Standar IEEE 802.3 · Frame + MAC</pre>`,
      scenario: 'Kantor upgrade internet ke 500 Mbps tapi speedtest mentok 95 Mbps. Ternyata port switch lama hanya Fast Ethernet (100 Mbps) — bottleneck-nya di Layer 1/2, bukan di ISP. Ganti ke switch Gigabit, speedtest langsung 500 Mbps. Pelajaran: kecepatan rantai jaringan ditentukan oleh link terlambatnya.',
      bestPractices: 'Selalu cek negosiasi kecepatan/duplex di kedua ujung link (<code>ethtool</code> di Linux, status port di switch). Link 1 Gbps yang ternegosiasi 100 Mbps adalah temuan klasik yang sering terlewat.',
      security: 'Ethernet sendiri tidak punya keamanan bawaan — siapa pun yang colok kabel ke port switch langsung "masuk" ke LAN. Pengamannya ditambahkan di atasnya: 802.1X (autentikasi port), port security (Part 08).',
      challenge: 'Cek kecepatan link komputermu (Windows: Status Ethernet; Linux: <code>ethtool eth0 | grep Speed</code>). Berapa? Termasuk generasi Ethernet apa menurut tabel di atas?',
      interviewQ: 'Q: "Apa itu Ethernet dan di layer berapa ia bekerja?" — A: Ethernet adalah standar jaringan kabel IEEE 802.3 yang mendominasi LAN; bekerja di Layer 1 (fisik: kabel/sinyal) dan Layer 2 (frame, MAC address, switching).',
      quiz: [
        { q: 'Ethernet distandarkan oleh…', options: ['ISO sebagai OSI', 'IEEE 802.3', 'IETF sebagai RFC', 'Cisco'], answer: 1, explain: 'Ethernet = standar IEEE 802.3 untuk jaringan kabel Layer 1–2.' },
        { q: 'Mengapa collision bukan masalah di switched Ethernet modern?', options: ['Karena kabelnya lebih mahal', 'Karena tiap port switch adalah link point-to-point full-duplex tersendiri', 'Karena memakai Wi-Fi', 'Karena collision ditangani DNS'], answer: 1, explain: 'Switch memberi tiap device link sendiri full-duplex → collision domain per port → praktis tidak ada tabrakan.' },
        { q: 'Penamaan "1000BASE-T" artinya…', options: ['1000 volt, base station, telepon', '1000 Mbps, baseband, twisted pair', '1000 port, basic, trunk', '1000 MHz, broadband, terminal'], answer: 1, explain: 'Angka = kecepatan Mbps, BASE = baseband, huruf akhir = media (T = twisted pair).' },
      ],
    },
    {
      id: '3.2',
      title: 'MAC Address',
      body: `<p>Pengulangan terstruktur dari Part 02 dengan pendalaman praktis: <b>MAC address</b> adalah alamat fisik 48-bit di <b>Layer 2</b>, dibakar ke NIC oleh vendor — dipakai switch untuk meneruskan frame dalam satu LAN.</p>
<h3>Membaca MAC di Device Nyata</h3>
<pre># Windows
ipconfig /all
# → "Physical Address. . . . . . . . . : 8C-EC-4B-12-9A-F3"

# Linux
ip link show
# → "link/ether 8c:ec:4b:12:9a:f3 brd ff:ff:ff:ff:ff:ff"</pre>
<p><b>Mengapa dua perintah ini penting?</b> Inilah cara tercepat memverifikasi identitas Layer 2 sebuah host — fondasi saat kamu nanti mengisi DHCP reservation atau port security berdasarkan MAC.</p>
<h3>Bit Spesial: I/G dan U/L</h3>
<p>Dua bit pertama oktet pertama punya arti khusus:</p>
<ul>
<li><b>Bit I/G</b> (<i>Individual/Group</i>, bit paling rendah oktet pertama): 0 = <b>unicast</b> (satu device), 1 = <b>multicast/broadcast</b> (grup). Contoh: <code>01:00:5E:...</code> → multicast.</li>
<li><b>Bit U/L</b> (<i>Universal/Local</i>, bit kedua): 0 = universal (dibakar vendor), 1 = <b>locally administered</b> (diubah manual/spoof/virtualisasi).</li>
</ul>
<h3>MAC di Dunia Virtual</h3>
<p>Di VM (GNS3, VMware) dan container, MAC di-generate secara software — biasanya dengan OUI khusus (mis. VMware memakai awalan <code>00:50:56</code>). <b>Alasan:</b> hardware-nya tidak ada, jadi hypervisor meminjamkan identitas virtual. Ini juga alasan MAC <i>bisa</i> diganti (spoof) — ia hanya angka di driver, bukan segel abadi.</p>
<div class="callout blue"><div class="t">Kembali ke Desain Kurikulum</div><p style="margin:4px 0 0">Di lab nanti (Part 08+), kamu akan melihat MAC address tiap device di <b>MAC address table</b> switch dan mengikatnya ke port. Biasakan mencatat MAC server & printer penting — mereka jarang berubah dan berguna untuk DHCP reservation (Part 13).</p></div>`,
      terms: [
        ['I/G bit', 'Bit Individual/Group di MAC: 0 = unicast, 1 = multicast/broadcast.'],
        ['U/L bit', 'Bit Universal/Local: 0 = dari vendor, 1 = diubah manual/virtual.'],
        ['Locally administered', 'MAC yang diubah manual atau di-generate virtualisasi (U/L bit = 1).'],
      ],
      scenario: 'Dua VM di-clone dari satu template tanpa regenerate MAC — keduanya punya MAC identik. Akibatnya switch bingung (MAC flapping antar-port), koneksi keduanya putus-sambung. Solusi 1 menit: regenerate MAC di setting VM. Kasus klasik yang hanya bisa didiagnosis jika paham MAC.',
      bestPractices: 'Setelah clone VM, SELALU regenerate MAC address. Duplikat MAC = duplikat identitas Layer 2 = kekacauan switching.',
      security: 'Bit U/L membantumu mengenali MAC spoofing kasar di investigasi: MAC dengan U/L=1 di jaringan yang seharusnya semua device fisik (U/L=0) patut dicurigai.',
      challenge: 'Lihat MAC komputermu. Tentukan: unicast atau multicast (bit I/G)? Universal atau locally administered (bit U/L)? Vendor apa (cari OUI-nya)?',
      interviewQ: 'Q: "Apa arti bit I/G pada MAC address?" — A: Bit Individual/Group (bit terendah oktet pertama): 0 berarti unicast (alamat satu device), 1 berarti multicast/broadcast (alamat grup). Contoh 01:00:5E:xx:xx:xx adalah multicast karena bit I/G-nya 1.',
      quiz: [
        { q: 'MAC 01:00:5E:11:22:33 termasuk jenis…', options: ['Unicast', 'Broadcast', 'Multicast (bit I/G = 1)', 'Loopback'], answer: 2, explain: 'Oktet pertama 0x01 (ganjil) → bit I/G = 1 → alamat grup/multicast.' },
        { q: 'Perintah Linux untuk melihat MAC address adalah…', options: ['ip route', 'ip link show', 'ping -a', 'traceroute'], answer: 1, explain: 'ip link show menampilkan interface Layer 2 termasuk link/ether (MAC).' },
        { q: 'Mengapa VM hasil clone bisa bermasalah di jaringan?', options: ['IP-nya terlalu besar', 'MAC address duplikat membuat switch bingung (MAC flapping)', 'VM tidak punya Layer 2', 'RAM kurang'], answer: 1, explain: 'Clone tanpa regenerate MAC = dua device beridentitas L2 sama → tabel MAC switch berflap antar-port.' },
      ],
    },
    {
      id: '3.3',
      title: 'ARP',
      body: `<p><b>ARP</b> (<i>Address Resolution Protocol</i>) adalah protokol yang menjawab pertanyaan paling fundamental di LAN: <b>"Saya tahu IP-nya — apa MAC-nya?"</b> Ia adalah jembatan antara Layer 3 (IP) dan Layer 2 (MAC), dan bekerja dengan satu mekanisme sederhana: <b>bertanya ke semua orang (broadcast), dijawab oleh yang merasa memiliki (unicast)</b>.</p>
<h3>Alur ARP Request → Reply</h3>
<pre>PC (192.168.20.50) butuh MAC gateway (192.168.20.1):

 1. PC: "Siapa pemilik 192.168.20.1? Saya 192.168.20.50 (MAC AA:AA..)"
    → ARP REQUEST, dikirim BROADCAST (FF:FF:FF:FF:FF:FF)
    → didengar SEMUA device di VLAN 20
 2. Semua device cek: "192.168.20.1... bukan saya." → diam.
 3. Gateway: "Itu saya!" → ARP REPLY: "192.168.20.1 = MAC BB:BB.."
    → dikirim UNICAST langsung ke PC
 4. PC menyimpan pemetaan di ARP TABLE (lihat 3.4) ✓</pre>
<h3>Mengapa ARP Dibutuhkan?</h3>
<p>IP address (logis) tidak bisa dipakai untuk mengirim frame — frame butuh MAC (fisik). Setiap kali host ingin bicara ke IP di LAN-nya yang MAC-nya belum dikenal, ARP adalah penerjemahnya. <b>Tanpa ARP, tidak ada komunikasi IP di Ethernet.</b></p>
<h3>Kapan ARP Terjadi?</h3>
<ul>
<li>Pertama kali host menghubungi IP lokal (termasuk gateway).</li>
<li>Entry ARP kedaluwarsa (aging, biasanya hitungan menit).</li>
<li><b>Gratuitous ARP:</b> host mengumumkan "IP ini = MAC saya" tanpa ditanya — dipakai saat IP baru dipasang untuk <b>deteksi duplikat IP</b> dan update tabel tetangga.</li>
</ul>
<div class="callout"><div class="t">ARP = Kepercayaan Buta (dan Itu Masalah)</div><p style="margin:4px 0 0">ARP tidak punya autentikasi: siapa pun boleh menjawab "itu saya!". Inilah celah <b>ARP spoofing/poisoning</b> — penyerang menjawab semua ARP request dengan MAC-nya sendiri sehingga traffic korban mengalir lewat dia (Man-in-the-Middle). Mitigasi: <b>Dynamic ARP Inspection (DAI)</b> di switch (Part 08/29).</p></div>`,
      terms: [
        ['ARP', 'Address Resolution Protocol — memetakan IP address ke MAC address di LAN (broadcast request, unicast reply).'],
        ['ARP request', 'Pertanyaan broadcast: "siapa pemilik IP X?"'],
        ['ARP reply', 'Jawaban unicast: "IP X = MAC Y".'],
        ['Gratuitous ARP', 'Pengumuman ARP tanpa diminta — untuk deteksi duplikat IP & update tetangga.'],
        ['ARP spoofing', 'Serangan memalsukan ARP reply agar traffic korban lewat penyerang.'],
      ],
      diagram: `<pre>              CARA KERJA ARP

   PC .20.50                    Gateway .20.1
      ── ARP REQUEST ──▶▶  broadcast ke semua
      "Siapa 192.168.20.1?"   FF:FF:FF:FF:FF:FF
                                   │
                     (yang lain diam: "bukan saya")
                                   │
      ◀── ARP REPLY ──  unicast langsung ke PC
      "Saya! MAC saya BB:BB:BB:BB:BB:BB"

   Hasil: PC simpan 192.168.20.1 → BB:BB:... di ARP table</pre>`,
      scenario: 'Setelah ganti router baru (IP gateway tetap, MAC berubah), beberapa PC tidak bisa internet selama ±5 menit. Penyebab: ARP table mereka masih menyimpan MAC router LAMA. Solusi: tunggu aging atau <code>arp -d</code> (hapus entry). Inilah mengapa engineer senior selalu curiga ke ARP table saat "tiba-tiba tidak bisa" setelah pergantian device.',
      bestPractices: 'Saat mengganti device jaringan (MAC berubah, IP tetap), antisipasi ARP stale: clear ARP di device tetangga atau tunggu aging. Catat di change plan.',
      security: 'ARP spoofing adalah serangan LAN paling klasik. Tanda-tandanya: <code>arp -a</code> menunjukkan satu MAC untuk banyak IP, atau MAC gateway berubah-ubah. Di enterprise, DAI + port security adalah pertahanan standar.',
      challenge: 'Jelaskan mengapa ARP request harus broadcast tetapi ARP reply cukup unicast. Apa yang terjadi jika reply juga broadcast?',
      interviewQ: 'Q: "Jelaskan cara kerja ARP." — A: Host yang butuh MAC dari sebuah IP lokal mengirim ARP request secara broadcast ("siapa pemilik IP X?"). Pemilik IP menjawab dengan ARP reply unicast ("IP X = MAC Y"). Hasilnya disimpan di ARP table. ARP tidak terautentikasi sehingga rentan spoofing.',
      quiz: [
        { q: 'ARP request dikirim secara…', options: ['Unicast ke gateway', 'Broadcast ke semua device di LAN', 'Multicast ke router', 'Langsung ke DNS'], answer: 1, explain: 'Request harus broadcast karena pengirim belum tahu siapa (MAC apa) pemilik IP tersebut.' },
        { q: 'Fungsi utama ARP adalah…', options: ['Meresolusi nama domain ke IP', 'Memetakan IP address ke MAC address di LAN', 'Memberi IP otomatis ke client', 'Mengenkripsi traffic'], answer: 1, explain: 'ARP = penerjemah IP (L3) ke MAC (L2), syarat komunikasi di Ethernet.' },
        { q: 'Kelemahan keamanan utama ARP adalah…', options: ['Terlalu lambat', 'Tidak ada autentikasi — siapa pun bisa memalsukan reply (ARP spoofing)', 'Hanya bekerja di Wi-Fi', 'Membutuhkan internet'], answer: 1, explain: 'ARP percaya jawaban siapa pun → dasar serangan Man-in-the-Middle di LAN.' },
      ],
    },
    {
      id: '3.4',
      title: 'ARP Table',
      body: `<p><b>ARP table</b> adalah "kamus" di setiap host: <b>daftar pemetaan IP → MAC</b> yang sudah dipelajari via ARP. Setiap kali host ingin mengirim ke IP lokal, ia <b>mengecek kamus ini dulu</b> — hanya jika tidak ada, ia bertanya via ARP request.</p>
<h3>Membaca ARP Table</h3>
<pre># Windows
C:\\> arp -a
Interface: 192.168.20.50
  Internet Address      Physical Address      Type
  192.168.20.1          bb-bb-bb-bb-bb-bb     dynamic   ← gateway
  192.168.20.55         cc-cc-cc-cc-cc-cc     dynamic   ← tetangga

# Linux
$ ip neigh show
192.168.20.1 lladdr bb:bb:bb:bb:bb:bb REACHABLE</pre>
<ul>
<li><b>dynamic:</b> dipelajari otomatis via ARP, <b>kedaluwarsa</b> setelah beberapa menit (aging) — normal dan sehat.</li>
<li><b>static:</b> dimasukkan manual (<code>arp -s</code>), tidak kedaluwarsa — dipakai untuk device kritis (gateway) di lingkungan rawan spoofing.</li>
<li><b>incomplete:</b> ARP request dikirim tapi tak ada jawaban — <b>tanda bahaya</b>: target mati, beda VLAN, atau terblokir.</li>
</ul>
<h3>Mengapa Ada Aging (Kedaluwarsa)?</h3>
<p>Karena MAC bisa berubah (ganti NIC, ganti device, VM migrate). Entry basi yang dipertahankan selamanya akan mengarahkan frame ke device yang salah. Aging memastikan kamus selalu segar — dengan harga sedikit broadcast ARP berkala. Trade-off klasik: kesegaran vs overhead.</p>
<div class="callout blue"><div class="t">ARP Table = Alat Diagnosis #1 di LAN</div><p style="margin:4px 0 0">Sebelum menyalahkan kabel/switch/router, lihat <code>arp -a</code> dulu: gateway ada? MAC-nya wajar? Ada duplikat? 60% masalah "tidak bisa konek" di LAN terlihat dari tabel ini — duplikat IP, MAC spoofing, atau entry incomplete.</p></div>`,
      terms: [
        ['ARP table', 'Kamus IP→MAC di host; dicek sebelum mengirim ke IP lokal.'],
        ['Dynamic entry', 'Entry ARP hasil belajar otomatis; kedaluwarsa (aging).'],
        ['Static entry', 'Entry ARP manual (arp -s); permanen, untuk device kritis.'],
        ['Aging', 'Mekanisme kedaluwarsa entry ARP agar pemetaan selalu segar.'],
      ],
      scenario: 'Dua PC tidak sengaja diset IP sama (192.168.20.50). Keduanya putus-sambung bergantian: ARP table tetangga berflap antara dua MAC berbeda untuk satu IP. Diagnosis: <code>arp -a</code> di beberapa host menunjukkan MAC yang berubah-ubah untuk IP itu. Fix 1 menit: ganti salah satu IP. Tanpa membaca ARP table, kasus ini bisa dikira "switch rusak".',
      bestPractices: 'Jadikan <code>arp -a</code> / <code>ip neigh</code> sebagai refleks kedua setelah ping gagal (refleks pertama: cek kabel/link).',
      security: 'Entry <b>static</b> untuk gateway di server kritis adalah pertahanan murah melawan ARP spoofing — penyerang tidak bisa menimpa entry statik dengan reply palsu.',
      challenge: 'Di komputermu, jalankan <code>arp -a</code>. Identifikasi: mana gateway? Ada berapa entry dynamic? Coba <code>arp -d *</code> (Windows, admin) lalu ping gateway dan lihat tabel terisi lagi — kamu baru saja menyaksikan ARP bekerja live.',
      interviewQ: 'Q: "Apa beda entry ARP dynamic dan static, kapan memakai static?" — A: Dynamic dipelajari otomatis dan kedaluwarsa (aging) — default yang sehat. Static dimasukkan manual dan permanen — dipakai untuk device kritis seperti gateway di lingkungan rawan ARP spoofing, karena tidak bisa ditimpa reply palsu.',
      quiz: [
        { q: 'Status "incomplete" pada ARP table artinya…', options: ['Entry berhasil dipelajari', 'ARP request dikirim tapi tidak ada jawaban — target tidak merespons', 'Entry statik', 'Tabel penuh'], answer: 1, explain: 'Incomplete = bertanya tapi tak dijawab: device mati, beda VLAN, atau terfilter.' },
        { q: 'Mengapa entry ARP dynamic diberi masa kedaluwarsa (aging)?', options: ['Agar tabel terlihat rapi', 'Karena MAC bisa berubah (ganti device/NIC); entry basi menyesatkan', 'Agar hemat RAM', 'Syarat IEEE'], answer: 1, explain: 'Aging menjaga kamus segar; entry basi mengarahkan frame ke MAC yang sudah tidak valid.' },
        { q: 'Perintah Windows untuk melihat ARP table adalah…', options: ['netstat -r', 'arp -a', 'nslookup', 'tracert'], answer: 1, explain: 'arp -a menampilkan Internet Address → Physical Address → Type.' },
      ],
    },
    {
      id: '3.5',
      title: 'Broadcast',
      body: `<p><b>Broadcast</b> adalah komunikasi <b>satu-ke-semua</b> (<i>one-to-all</i>): satu pengirim, <b>semua</b> device di jaringan lokal wajib menerima dan memproses. Ia adalah "pengeras suara" jaringan — berguna, tapi berisik.</p>
<h3>Dua Bentuk Broadcast</h3>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Alamat</th><th>Contoh Pemakaian</th></tr>
<tr><td>L2</td><td>MAC <code>FF:FF:FF:FF:FF:FF</code></td><td>ARP request, DHCP Discover</td></tr>
<tr><td>L3</td><td>IP broadcast subnet, mis. <code>192.168.20.255</code></td><td>DHCP, NetBIOS lama</td></tr>
</table></div>
<h3>Mengapa Broadcast Dibutuhkan?</h3>
<p>Karena dilema ayam-telur: untuk bicara unicast ke seseorang, kamu harus tahu MAC-nya — tapi untuk tahu MAC-nya, kamu harus bertanya... ke siapa? Jawabannya: <b>bertanya ke semua orang</b>. ARP request dan DHCP Discover tidak mungkin unicast — broadcast adalah satu-satunya cara memulai percakapan pertama.</p>
<h3>Sisi Gelap: Broadcast Domain & Storm</h3>
<p>Setiap broadcast <b>mengganggu semua host</b> di broadcast domain: tiap NIC harus menerima, tiap CPU harus memeriksa "ini untuk saya?". Di jaringan flat ratusan host (Part 01), ini menjadi beban nyata. Lebih parah: <b>broadcast storm</b> — loop fisik membuat broadcast berputar dan berlipat ganda hingga melumpuhkan jaringan (dicegah STP, Part 10). Aturan emas Part 01 berlaku: <b>1 VLAN = 1 broadcast domain</b>, dan <b>router tidak meneruskan broadcast</b> — ia adalah dindingnya.</p>
<div class="callout"><div class="t">Broadcast vs "Banjir"</div><p style="margin:4px 0 0">Jangan tertukar: <b>broadcast</b> = alamat tujuan semua orang (disengaja). <b>Flooding</b> = perilaku switch meneruskan frame <i>unicast</i> yang MAC-nya belum dikenal ke semua port (sementara, sampai belajar). Keduanya "ke semua port", tapi sebabnya beda.</p></div>`,
      terms: [
        ['Broadcast', 'Komunikasi satu-ke-semua di LAN; alamat L2 FF:FF:FF:FF:FF:FF.'],
        ['Broadcast domain', 'Wilayah jangkauan broadcast; dibatasi router/VLAN.'],
        ['Broadcast storm', 'Loop yang membuat broadcast berlipat ganda hingga melumpuhkan jaringan.'],
      ],
      diagram: `<pre>           BROADCAST: SATU BICARA, SEMUA DENGAR

                        ┌── [PC-B] "bukan saya, buang"
   [PC-A] ──broadcast──┼── [PC-C] "bukan saya, buang"
   "Siapa 192.168.20.1?"└── [Gateway] "SAYA! → balas unicast"

   Setiap host WAJIB memproses (gangguan CPU) — alasan
   broadcast domain harus dibatasi (VLAN + router).</pre>`,
      scenario: 'Ruang meeting dipasangi switch murah tanpa STP, seseorang mencolok dua kabel antar-switch yang sama → loop → broadcast storm. Dalam 3 menit seluruh VLAN 20 lumpuh, tapi VLAN 30 (server) tetap normal karena router tidak meneruskan broadcast. Insiden ini menjadi alasan kuat segmentasi VLAN — "badai" terkurung satu domain.',
      bestPractices: 'Desain broadcast domain secukupnya (± <250 host/VLAN untuk kantor umum) dan pastikan proteksi loop (STP) aktif di semua switch — detail Part 10.',
      security: 'Broadcast bisa disalahgunakan: <b>Smurf attack</b> memalsukan ping ke alamat broadcast agar semua host membalas ke korban (amplifikasi DDoS). Router modern tidak meneruskan directed broadcast — mitigasi standar.',
      challenge: 'Hitung: VLAN dengan 200 host, tiap host mengirim 1 ARP request/detik. Berapa broadcast yang harus diproses satu host per detik? Bandingkan jika dipecah jadi 4 VLAN @50 host.',
      interviewQ: 'Q: "Perangkat apa yang membatasi broadcast domain dan mengapa?" — A: Router (juga firewall/L3 switch) — karena ia tidak meneruskan broadcast ke jaringan lain. Switch justru meneruskan broadcast ke semua port dalam VLAN yang sama. Maka 1 VLAN = 1 broadcast domain.',
      quiz: [
        { q: 'Alamat MAC broadcast adalah…', options: ['00:00:00:00:00:00', 'FF:FF:FF:FF:FF:FF', '01:00:5E:00:00:01', 'IP 255.255.255.255 saja'], answer: 1, explain: 'FF:FF:FF:FF:FF:FF = semua bit 1 = alamat broadcast Layer 2.' },
        { q: 'Perangkat yang TIDAK meneruskan broadcast ke jaringan lain adalah…', options: ['Hub', 'Switch', 'Router', 'Repeater'], answer: 2, explain: 'Router adalah batas broadcast domain; switch/hub meneruskan di dalam domain.' },
        { q: 'Contoh pemakaian broadcast yang sah adalah…', options: ['Streaming video', 'ARP request dan DHCP Discover', 'Browsing web', 'Video call'], answer: 1, explain: 'Keduanya butuh "bertanya ke semua orang" karena belum tahu alamat spesifik tujuan.' },
      ],
    },
    {
      id: '3.6',
      title: 'Unicast',
      body: `<p><b>Unicast</b> adalah komunikasi <b>satu-ke-satu</b> (<i>one-to-one</i>): satu pengirim ke <b>satu</b> penerima spesifik. Ini adalah <b>mode komunikasi normal</b> jaringan — sebagian besar traffic (browsing, email, file transfer) adalah unicast.</p>
<h3>Cara Kerja</h3>
<pre>[PC-A] ──frame──▶ [Switch] ──frame──▶ [Server]
MAC dst = MAC Server (spesifik, bukan FF:FF:...)</pre>
<p>Switch membaca MAC tujuan yang spesifik, melihat MAC table, dan meneruskan <b>hanya ke port tujuan</b> — port lain tidak terganggu. Efisien: tidak ada "kebisingan" seperti broadcast.</p>
<h3>Unicast di Tiap Layer</h3>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Alamat Unicast</th><th>Contoh</th></tr>
<tr><td>L2</td><td>MAC spesifik device</td><td>8C:EC:4B:12:9A:F3</td></tr>
<tr><td>L3</td><td>IP spesifik host</td><td>192.168.30.10</td></tr>
<tr><td>L4</td><td>IP + port spesifik</td><td>192.168.30.10:443</td></tr>
</table></div>
<h3>Mengapa Unicast Menjadi Default?</h3>
<p>Karena <b>skalabel dan privat</b>: hanya pengirim dan penerima yang terlibat, switch tidak membebani port lain, dan (di switch, bukan hub) tetangga tidak bisa mengintip — berbeda dengan broadcast yang "berteriak" ke semua orang. Inilah alasan ARP hanya broadcast sekali di awal, selebihnya unicast via ARP table.</p>
<div class="callout blue"><div class="t">Pola Umum Protokol</div><p style="margin:4px 0 0">Banyak protokol memakai pola <b>"broadcast untuk kenalan, unicast untuk bicara"</b>: ARP (request broadcast → reply unicast), DHCP (Discover broadcast → Offer unicast). Hafalkan pola ini — ia menjelaskan separuh traffic "aneh" yang kamu lihat di Wireshark.</p></div>`,
      terms: [
        ['Unicast', 'Komunikasi satu-ke-satu ke alamat spesifik; mode normal sebagian besar traffic.'],
      ],
      scenario: 'User heran "kok Wireshark saya tidak melihat traffic teman sebelah?" Jawabannya: karena traffic mereka unicast — switch hanya meneruskan ke port tujuan. Untuk melihatnya butuh port mirroring/SPAN (Part 23) atau hub. Ini juga kabar baik untuk privasi di switched network.',
      bestPractices: 'Saat menganalisis capture, filter dulu traffic unicast milikmu vs broadcast/multicast — broadcast yang berlebihan (>5% traffic) adalah tanda masalah desain.',
      security: 'Unicast di switch relatif privat, tapi bukan jaminan: ARP spoofing bisa membelokkan unicast lewat penyerang. Enkripsi ujung-ke-ujung (TLS) tetap wajib untuk data sensitif.',
      challenge: 'Buka Wireshark 30 detik tanpa filter. Hitung: berapa packet broadcast vs unicast? Protokol apa yang paling banyak broadcast? (Petunjuk: ARP, DHCP, mDNS.)',
      interviewQ: 'Q: "Apa beda unicast, broadcast, dan multicast?" — A: Unicast = satu-ke-satu (alamat spesifik, mis. MAC/IP tertentu). Broadcast = satu-ke-semua dalam LAN (FF:FF:FF:FF:FF:FF). Multicast = satu-ke-grup yang berminat (mis. 01:00:5E:xx / 224.0.0.0/4).',
      quiz: [
        { q: 'Unicast artinya…', options: ['Satu-ke-semua', 'Satu-ke-satu ke alamat spesifik', 'Satu-ke-grup', 'Semua-ke-semua'], answer: 1, explain: 'Unicast = one-to-one: satu pengirim, satu penerima spesifik.' },
        { q: 'Switch meneruskan frame unicast yang MAC-nya dikenal dengan cara…', options: ['Ke semua port', 'Hanya ke port tujuan sesuai MAC table', 'Dibuang', 'Dikirim ke router'], answer: 1, explain: 'Itulah fungsi MAC table: forward selektif hanya ke port yang tepat.' },
        { q: 'Pola "broadcast untuk kenalan, unicast untuk bicara" contohnya…', options: ['HTTP', 'ARP: request broadcast, reply unicast', 'FTP', 'SSH'], answer: 1, explain: 'ARP request harus broadcast (belum tahu MAC), reply-nya unicast (sudah tahu peminta).' },
      ],
    },
    {
      id: '3.7',
      title: 'Multicast',
      body: `<p><b>Multicast</b> adalah komunikasi <b>satu-ke-grup</b> (<i>one-to-many</i>): satu pengirim ke <b>hanya device yang berminat</b> (telah "berlangganan" grup). Ia adalah jalan tengah yang elegan antara unicast (boros untuk banyak penerima) dan broadcast (mengganggu yang tidak berminat).</p>
<h3>Analogi: Grup Chat vs Pengeras Suara</h3>
<p>Unicast = telepon pribadi (1 lawan 1). Broadcast = pengeras suara masjid (semua dengar, mau tidak mau). <b>Multicast = grup WhatsApp</b>: satu pesan terkirim ke semua anggota grup — yang bukan anggota tidak terganggu.</p>
<h3>Alamat Multicast</h3>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Rentang</th><th>Contoh</th><th>Kegunaan</th></tr>
<tr><td>L2</td><td>MAC <code>01:00:5E:xx:xx:xx</code></td><td>01:00:5E:00:00:05</td><td>OSPF (semua router)</td></tr>
<tr><td>L3 IPv4</td><td><code>224.0.0.0/4</code> (224–239.x.x.x)</td><td>224.0.0.251</td><td>mDNS/Bonjour</td></tr>
<tr><td>L3 IPv6</td><td><code>FF00::/8</code></td><td>FF02::1</td><td>Neighbor Discovery (pengganti ARP!)</td></tr>
</table></div>
<h3>Cara Kerja: Join & Prune</h3>
<p>Host yang berminat <b>join</b> grup multicast (via <b>IGMP</b> — <i>Internet Group Management Protocol</i>). Switch yang cerdas memakai <b>IGMP snooping</b> untuk meneruskan multicast <b>hanya ke port yang join</b> — tanpa ini, switch memperlakukan multicast seperti broadcast (banjir ke semua port). Router antar-jaringan memakai <b>PIM</b> (<i>Protocol Independent Multicast</i>).</p>
<h3>Kapan Multicast Dipakai?</h3>
<ul>
<li><b>Routing protocol:</b> OSPF router saling menyapa via 224.0.0.5 (Part 11).</li>
<li><b>Streaming:</b> satu stream video ke 1000 penonton tanpa 1000 koneksi unicast.</li>
<li><b>Service discovery:</b> mDNS (224.0.0.251) — "ada printer di jaringan?"</li>
<li><b>IPv6:</b> tidak punya broadcast — <b>semua</b> fungsi "ke semua orang" diganti multicast (Part 05).</li>
</ul>`,
      terms: [
        ['Multicast', 'Komunikasi satu-ke-grup yang berminat; alamat IPv4 224.0.0.0/4, MAC 01:00:5E:xx.'],
        ['IGMP', 'Internet Group Management Protocol — cara host join/leave grup multicast.'],
        ['IGMP snooping', 'Fitur switch agar multicast hanya diteruskan ke port yang join grup.'],
      ],
      diagram: `<pre>        MULTICAST: SATU KIRIM, YANG MINAT SAJA TERIMA

                        ┌── [PC-B] ✗ tidak join → tidak terima
   [Server] ──multicast─┼── [PC-C] ✓ join grup → terima
   ke 224.1.2.3         └── [PC-D] ✓ join grup → terima

   Efisien: 1x kirim untuk N penerima (vs N unicast),
   sopan: non-anggota tidak terganggu (vs broadcast).</pre>`,
      scenario: 'Kantor menyiarkan town-hall video ke 500 PC. Dengan unicast, server harus mengirim 500 stream identik — bandwidth jebol. Dengan multicast, server mengirim 1 stream, switch menduplikasi hanya ke port yang join. Penghematan 500x lipat. Inilah alasan IPTV dan sistem paging memakai multicast.',
      bestPractices: 'Aktifkan IGMP snooping di switch jika ada aplikasi multicast — tanpanya multicast membanjiri semua port seperti broadcast dan menghilangkan keuntungannya.',
      security: 'Multicast bisa disalahgunakan untuk discovery serangan (mDNS membocorkan nama device). Di jaringan tamu (VLAN 40), batasi/disabled multicast discovery yang tidak perlu.',
      challenge: 'Jelaskan mengapa IPv6 menghapus broadcast dan menggantinya dengan multicast. Apa keuntungannya bagi host yang "tidak berminat"?',
      interviewQ: 'Q: "Kapan memakai multicast dibanding unicast atau broadcast?" — A: Saat satu sumber perlu ke BANYAK penerima yang berminat: multicast mengirim sekali dan hanya anggota grup yang menerima — hemat bandwidth dibanding N unicast, dan tidak mengganggu non-anggota dibanding broadcast. Contoh: streaming, OSPF hello, mDNS.',
      quiz: [
        { q: 'Rentang IPv4 untuk multicast adalah…', options: ['192.168.0.0/16', '224.0.0.0/4 (224–239.x.x.x)', '10.0.0.0/8', '127.0.0.0/8'], answer: 1, explain: 'Kelas D 224.0.0.0–239.255.255.255 dicadangkan untuk multicast.' },
        { q: 'Fungsi IGMP snooping di switch adalah…', options: ['Mempercepat unicast', 'Meneruskan multicast hanya ke port yang join grup (tidak banjir ke semua)', 'Memblokir broadcast', 'Mengenkripsi multicast'], answer: 1, explain: 'Tanpa snooping, switch tak tahu siapa anggota grup → flood seperti broadcast.' },
        { q: 'Analogi paling tepat untuk multicast adalah…', options: ['Telepon pribadi', 'Pengeras suara', 'Grup chat — satu pesan ke semua anggota, non-anggota tidak terganggu', 'Surat massal pos'], answer: 2, explain: 'Grup chat: satu kirim, hanya anggota terima — persis semantik multicast.' },
      ],
    },
    {
      id: '3.8',
      title: 'ICMP',
      body: `<p><b>ICMP</b> (<i>Internet Control Message Protocol</i>) adalah <b>"bahasa isyarat"</b> jaringan — protokol <b>Layer 3</b> yang tidak membawa data user, melainkan <b>pesan kontrol dan error</b>: "saya di sini" (ping), "waktu habis di hop ke-3" (traceroute), "tujuan tidak reachable".</p>
<h3>Dua Bintang Utama</h3>
<div class="tblwrap"><table>
<tr><th>Tool</th><th>Pesan ICMP</th><th>Cara Kerja</th></tr>
<tr><td><b>ping</b></td><td>Echo Request (type 8) → Echo Reply (type 0)</td><td>Kirim "halo", ukur waktu balasan (RTT) & loss</td></tr>
<tr><td><b>traceroute</b></td><td>Time Exceeded (type 11)</td><td>Kirim dengan TTL 1,2,3… — tiap router yang membuang karena TTL habis membalas, sehingga hop terpetakan</td></tr>
</table></div>
<h3>Pesan ICMP Penting Lainnya</h3>
<ul>
<li><b>Destination Unreachable (type 3):</b> "tujuan tidak bisa dicapai" — dengan <i>code</i> detail: network/host/port unreachable. Muncul saat tidak ada rute atau firewall menolak.</li>
<li><b>Redirect (type 5):</b> router memberi tahu host "lewat gateway lain lebih dekat" — fitur lama yang kini sering dimatikan karena bisa disalahgunakan.</li>
</ul>
<h3>Mengapa ICMP Sering Diblokir?</h3>
<p>Karena ia juga <b>senjata reconnaissance</b>: ping sweep memetakan host hidup, dan serangan seperti <b>ping flood / Smurf</b> memakai ICMP untuk DDoS. Praktik umum: <b>blokir ICMP dari internet, izinkan di internal</b> — keseimbangan antara keamanan dan kemampuan diagnosis. Engineer yang memblokir total lalu bingung "kenapa ping gagal" adalah lelucon klasik NOC.</p>
<div class="callout blue"><div class="t">Ping Gagal ≠ Jaringan Mati</div><p style="margin:4px 0 0">Aturan troubleshooting: <b>ping adalah alat bantu, bukan vonis</b>. Server yang memblokir ICMP tetap bisa melayani web (TCP 443) dengan sempurna. Selalu konfirmasi dengan uji layanan sebenarnya (telnet ke port / buka aplikasi) sebelum menyimpulkan.</p></div>`,
      terms: [
        ['ICMP', 'Internet Control Message Protocol — pesan kontrol/error Layer 3 (ping, traceroute).'],
        ['Echo Request/Reply', 'Pasangan pesan ICMP untuk ping (type 8 → type 0).'],
        ['Time Exceeded', 'Pesan ICMP (type 11) saat TTL habis — mekanisme traceroute.'],
        ['RTT', 'Round-Trip Time — waktu pergi-pulang packet, dilaporkan ping dalam ms.'],
      ],
      scenario: 'Monitoring Zabbix memakai ping untuk cek "host up/down". Suatu malam puluhan server "down" — ternyata tim security baru saja memblokir ICMP di firewall tanpa pemberitahuan. Server sebenarnya sehat. Pelajaran mahal: definisikan "up" dengan benar (cek port layanan, bukan cuma ping) dan komunikasikan perubahan firewall.',
      bestPractices: 'Untuk monitoring, kombinasikan ping (cepat, murah) dengan cek port layanan (akurat). Ping = "kabelnya nyambung", cek port = "layanannya hidup".',
      security: 'Batasi ICMP yang masuk dari internet (rate-limit), tapi JANGAN buta memblokir semua: "fragmentation needed" (type 3 code 4) wajib diizinkan agar Path MTU Discovery bekerja — memblokirnya merusak koneksi secara misterius.',
      challenge: 'Ping 8.8.8.8 lalu ping nama domain. Jika yang pertama OK tapi kedua gagal, di layer/protokol apa masalahnya? (Petunjuk: bukan ICMP.)',
      interviewQ: 'Q: "Bagaimana traceroute bekerja?" — A: Mengirim packet dengan TTL bertahap (1, 2, 3...). Tiap router yang membuang packet karena TTL habis mengirim ICMP Time Exceeded — dari balasan itu pengirim tahu IP tiap hop. Trik elegan memakai mekanisme anti-loop sebagai alat ukur.',
      quiz: [
        { q: 'ICMP bekerja di layer…', options: ['Layer 2', 'Layer 3 — Network', 'Layer 4', 'Layer 7'], answer: 1, explain: 'ICMP adalah protokol kontrol Layer 3, sejajar dengan IP.' },
        { q: 'Traceroute bisa memetakan hop karena…', options: ['Router membalas dengan MAC-nya', 'Router yang membuang packet akibat TTL habis mengirim ICMP Time Exceeded', 'DNS memberi daftar hop', 'Switch mencatat perjalanan'], answer: 1, explain: 'Mekanisme TTL (2.13) + pesan ICMP type 11 = peta hop.' },
        { q: 'Praktik yang tepat terkait ICMP adalah…', options: ['Blokir total di semua tempat', 'Buka total ke internet', 'Batasi dari internet, izinkan di internal — dan ingat ping gagal bukan vonis mati', 'Ganti ICMP dengan HTTP'], answer: 2, explain: 'Keseimbangan: keamanan (reconnaissance/DDoS) vs kebutuhan diagnosis; selalu verifikasi dengan uji layanan.' },
      ],
    },
    {
      id: '3.9',
      title: 'TCP',
      body: `<p><b>TCP</b> (<i>Transmission Control Protocol</i>) adalah protokol <b>Layer 4</b> yang <b>connection-oriented dan andal</b> (<i>reliable</i>): data dijamin sampai, utuh, dan berurutan — atau pengirim diberi tahu. Mayoritas aplikasi penting (web, email, file transfer, SSH) memakai TCP.</p>
<h3>Tiga Pilar Keandalan TCP</h3>
<ol>
<li><b>Koneksi dulu, kirim kemudian:</b> three-way handshake (SYN, SYN-ACK, ACK) membuka "jalur" sebelum data mengalir — dibedah di 3.11.</li>
<li><b>Nomor urut + konfirmasi:</b> setiap byte punya sequence number; penerima mengirim ACK ("sudah terima sampai X"). Yang tidak di-ACK = <b>dikirim ulang</b> (retransmission).</li>
<li><b>Flow & congestion control:</b> <b>window</b> menyesuaikan kecepatan agar penerima tidak kebanjiran; algoritma congestion control mengerem saat jaringan macet.</li>
</ol>
<h3>Harga yang Dibayar</h3>
<p>Keandalan tidak gratis: handshake (1 RTT sebelum data), header 20 byte, ACK bolak-balik, dan retransmission. Di jaringan ber-loss tinggi, TCP bisa terasa lambat — bukan karena "lemot", tapi karena ia <b>sibuk memperbaiki</b>. Inilah trade-off fundamental yang menjelaskan kapan memakai UDP (3.10).</p>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>TCP</th></tr>
<tr><td>Sifat</td><td>Connection-oriented, reliable, ordered</td></tr>
<tr><td>Header</td><td>20 byte (port, seq, ack, flags, window)</td></tr>
<tr><td>Contoh aplikasi</td><td>HTTP/HTTPS (80/443), SSH (22), SMTP (25), FTP (21)</td></tr>
<tr><td>Cocok untuk</td><td>Data yang harus utuh: file, web, email, transaksi</td></tr>
</table></div>
<div class="callout"><div class="t">TCP di Mata Troubleshooting</div><p style="margin:4px 0 0">Gejala khas masalah TCP di Wireshark: <b>retransmission</b> berulang (loss), <b>duplicate ACK</b> (packet hilang di tengah), <b>RST</b> mendadak (aplikasi/firewall menolak), <b>window kecil/nol</b> (penerima kewalahan). Empat pola ini menyelesaikan 90% kasus "aplikasi lambat".</p></div>`,
      terms: [
        ['TCP', 'Transmission Control Protocol — L4, connection-oriented, andal, berurutan.'],
        ['Connection-oriented', 'Harus buka koneksi (handshake) sebelum kirim data.'],
        ['Reliable', 'Jaminan sampai-utuh-berurutan via sequence, ACK, retransmission.'],
        ['Congestion control', 'Mekanisme TCP mengerem kecepatan kirim saat jaringan macet.'],
      ],
      scenario: 'User komplain "download lambat" padahal bandwidth 100 Mbps. Capture menunjukkan retransmission 8% — kabel rusak menyebabkan loss, TCP sibuk mengirim ulang dan menekan window. Setelah kabel diganti, loss 0% dan download kembali penuh. Vonis "bandwidth kurang" akan berujung beli bandwidth sia-sia; vonis "loss" menyelesaikan akar masalah.',
      bestPractices: 'Untuk keluhan "lambat" pada aplikasi TCP, cek retransmission rate DULU sebelum menyalahkan bandwidth. Loss >1% di LAN adalah temuan, bukan hal wajar.',
      security: 'Keandalan TCP dieksploitasi penyerang: <b>SYN flood</b> membanjiri server dengan SYN tanpa menyelesaikan handshake hingga resource habis. Mitigasi: SYN cookies, rate limiting, firewall (Part 29).',
      challenge: 'Jelaskan kepada teman non-teknis: mengapa video call memakai UDP tapi transfer file bank memakai TCP? (Petunjuk: apa yang lebih buruk — satu frame video hilang, atau satu byte transaksi hilang?)',
      interviewQ: 'Q: "Bagaimana TCP menjamin keandalan?" — A: Tiga mekanisme: (1) sequence number untuk urutan & deteksi hilang, (2) acknowledgment + retransmission untuk yang tidak sampai, (3) flow/congestion control (window) agar tidak membanjiri penerima/jaringan. Harganya: overhead handshake dan header.',
      quiz: [
        { q: 'TCP disebut "reliable" karena…', options: ['Dikirim paling cepat', 'Menjamin data sampai, utuh, berurutan via sequence, ACK, dan retransmission', 'Tidak punya header', 'Bekerja di Layer 2'], answer: 1, explain: 'Tiga pilar: nomor urut + konfirmasi + kirim ulang = keandalan.' },
        { q: 'Di Wireshark, banyak "TCP Retransmission" menandakan…', options: ['Koneksi sehat', 'Packet loss — segment hilang dan dikirim ulang', 'Server cepat', 'Enkripsi kuat'], answer: 1, explain: 'Retransmission = bukti segment tidak di-ACK (hilang) → dikirim ulang.' },
        { q: 'Contoh aplikasi yang TEPAT memakai TCP adalah…', options: ['Live streaming', 'Transfer file & web banking (data harus utuh)', 'DNS query', 'VoIP'], answer: 1, explain: 'Data finansial/file tidak boleh ada byte hilang → butuh keandalan TCP.' },
      ],
    },
    {
      id: '3.10',
      title: 'UDP',
      body: `<p><b>UDP</b> (<i>User Datagram Protocol</i>) adalah saudara TCP yang <b>connectionless dan tidak andal</b>: kirim dan lupakan (<i>fire-and-forget</i>). Tidak ada handshake, tidak ada ACK, tidak ada kirim ulang. Terdengar buruk? Justru inilah <b>keunggulannya</b>: cepat, ringan, sederhana.</p>
<h3>Header UDP: Hanya 8 Byte</h3>
<pre>┌──────────────┬──────────────┐
│ Source Port  │ Dest Port    │
├──────────────┼──────────────┤
│ Length       │ Checksum     │
└──────────────┴──────────────┘
      vs TCP 20 byte + logika retransmission</pre>
<p>Tidak ada sequence, tidak ada window, tidak ada flags — hanya "dari port X ke port Y, ini datanya". Sederhana = cepat = murah diproses.</p>
<h3>Kapan UDP Menang atas TCP?</h3>
<div class="tblwrap"><table>
<tr><th>Kasus</th><th>Mengapa UDP?</th><th>Contoh</th></tr>
<tr><td>Real-time (voice/video/game)</td><td>Data basi tidak berguna — lebih baik hilang 1 frame daripada menunggu kirim ulang yang terlambat</td><td>VoIP, Zoom, game online</td></tr>
<tr><td>Query singkat</td><td>Handshake TCP (1 RTT) lebih mahal dari datanya sendiri</td><td>DNS (53), DHCP (67/68), SNMP</td></tr>
<tr><td>Broadcast/multicast</b></td><td>TCP butuh koneksi 1-lawan-1; tidak bisa ke grup</td><td>Streaming multicast, mDNS</td></tr>
</table></div>
<h3>Siapa yang Menjamin Keandalan?</h3>
<p><b>Aplikasinya sendiri</b>, jika butuh. Contoh: QUIC (HTTP/3) memakai UDP tapi mengimplementasikan keandalan ala-TCP di layer aplikasi. Prinsip desain: <b>jaringan memberi yang sederhana-cepat; kecerdasan ditaruh di ujung</b> (<i>end-to-end principle</i>) — filosofi inti internet.</p>
<div class="callout blue"><div class="t">TCP vs UDP — Aturan Memilih</div><p style="margin:4px 0 0"><b>Data harus utuh?</b> → TCP (file, web, email, transaksi). <b>Kecepatan/latency lebih penting dari kesempurnaan?</b> → UDP (voice, video, game, DNS). Saat ragu di interview, jawab dengan trade-off ini — pewawancara menilai cara berpikirmu, bukan hafalan.</p></div>`,
      terms: [
        ['UDP', 'User Datagram Protocol — L4, connectionless, cepat, tanpa jaminan sampai.'],
        ['Connectionless', 'Langsung kirim tanpa buka koneksi dulu.'],
        ['Fire-and-forget', 'Kirim dan lupakan — tidak ada konfirmasi.'],
        ['End-to-end principle', 'Kecerdasan di ujung (aplikasi), jaringan inti dibuat sederhana.'],
      ],
      scenario: 'Call center memakai VoIP (UDP). Saat jaringan loss 5%, suara kresek sesaat tapi percakapan tetap jalan — bisa dimaklumi. Bayangkan jika memakai TCP: tiap packet hilang menunggu kirim ulang → suara terputus-putus parah dan delay membesar. Pilihan protokol yang tepat menyelamatkan user experience — dan pilihan yang salah tidak bisa diperbaiki dengan "bandwidth lebih besar".',
      bestPractices: 'Untuk aplikasi real-time di atas UDP, monitor <b>jitter dan loss</b> (Part 01) — bukan bandwidth. UDP tidak protes saat loss; user yang protes.',
      security: 'UDP tanpa handshake mudah dipalsukan (spoofed) untuk <b>amplifikasi DDoS</b> (mis. DNS amplification: request kecil → respons besar ke korban). Mitigasi: rate-limit, anti-spoofing di edge (Part 29).',
      challenge: 'Sebutkan 3 aplikasi di HP-mu yang kemungkinan memakai UDP dan 3 yang memakai TCP. Jelaskan alasan pilihan tiap aplikasi dalam 1 kalimat.',
      interviewQ: 'Q: "Kapan kamu memilih UDP daripada TCP?" — A: Saat kecepatan/latency lebih penting daripada kesempurnaan data: real-time (VoIP, video, game) di mana data basi tidak berguna; query singkat (DNS, DHCP) di mana handshake TCP lebih mahal dari datanya; dan komunikasi broadcast/multicast yang memang tidak bisa connection-oriented.',
      quiz: [
        { q: 'Ciri utama UDP adalah…', options: ['Connection-oriented dan reliable', 'Connectionless, cepat, tanpa jaminan — fire-and-forget', 'Bekerja di Layer 2', 'Selalu terenkripsi'], answer: 1, explain: 'UDP: tanpa handshake/ACK/retransmission — cepat dan ringan.' },
        { q: 'DNS umumnya memakai UDP karena…', options: ['DNS butuh keandalan mutlak', 'Query singkat — handshake TCP lebih mahal dari datanya sendiri', 'UDP lebih aman', 'TCP tidak mendukung port 53'], answer: 1, explain: 'Satu query-balas kecil; overhead koneksi TCP tidak sepadan (zone transfer besar baru pakai TCP).' },
        { q: 'Ukuran header UDP vs TCP adalah…', options: ['Sama, 20 byte', 'UDP 8 byte vs TCP 20 byte (minimal)', 'UDP 20 byte vs TCP 8 byte', 'Keduanya tanpa header'], answer: 1, explain: 'UDP minimalis: hanya port, length, checksum = 8 byte.' },
      ],
    },
    {
      id: '3.11',
      title: 'TCP Three-Way Handshake',
      body: `<p>Sebelum TCP mengirim satu byte data pun, kedua pihak <b>berjabat tangan tiga langkah</b> (<i>three-way handshake</i>): SYN → SYN-ACK → ACK. Tujuannya: <b>sepakat nomor urut awal</b> dan memastikan <b>kedua arah</b> bisa berkomunikasi.</p>
<h3>Tiga Langkah</h3>
<pre>Client                              Server (192.168.30.10:443)
  │  1. SYN  ─────────────────────▶  │  "Halo, mau konek. Seq saya = 1000"
  │                                     (client → server OK?)
  │  ◀──────────────────  2. SYN-ACK │  "Halo juga! Seq saya = 5000,
  │                                     saya terima seq 1000-mu"
  │                                     (server → client OK?)
  │  3. ACK  ─────────────────────▶  │  "Siap, saya terima seq 5000-mu"
  │                                     (keduanya OK! mulai kirim data)</pre>
<h3>Mengapa Harus Tiga (Bukan Dua)?</h3>
<p>Dua langkah hanya membuktikan <b>satu arah</b> (client→server). Langkah ketiga membuktikan <b>arah balik</b> (server→client) juga hidup — tanpa itu, client bisa mengira koneksi siap padahal balasannya tidak pernah sampai. Tiga langkah = <b>konfirmasi dua arah penuh</b> dengan biaya minimal.</p>
<h3>Menutup Koneksi: FIN</h3>
<p>Handshake punya pasangan: <b>teardown empat langkah</b> dengan flag <b>FIN</b> ("saya selesai") — masing-masing pihak menutup arahnya sendiri (full-duplex). Atau <b>RST</b> untuk pemutusan paksa/mendadak.</p>
<h3>Membaca Handshake di Wireshark</h3>
<pre>1  192.168.20.50 → 192.168.30.10  TCP  SYN, Seq=1000
2  192.168.30.10 → 192.168.20.50  TCP  SYN, ACK, Seq=5000 Ack=1001
3  192.168.20.50 → 192.168.30.10  TCP  ACK, Seq=1001 Ack=5001
4  ... data mengalir ...</pre>
<p><b>Catatan:</b> Ack selalu = Seq lawan + 1 ("saya tunggu byte berikutnya"). Pola ini adalah sidik jari koneksi TCP yang sehat — dipraktikkan di 3.18.</p>`,
      terms: [
        ['Three-way handshake', 'SYN → SYN-ACK → ACK: pembuka koneksi TCP + kesepakatan sequence number.'],
        ['SYN', 'Flag Synchronize — meminta koneksi & menyampaikan seq awal.'],
        ['Teardown', 'Penutupan koneksi TCP via flag FIN (4 langkah) atau RST (paksa).'],
      ],
      diagram: `<pre>         THREE-WAY HANDSHAKE (dan teardown)

   BUKA:                    TUTUP:
   C ──SYN──▶ S             C ──FIN──▶ S  "saya selesai"
   C ◀─SYN-ACK─ S           C ◀─ACK─── S  "ok"
   C ──ACK──▶ S             C ◀─FIN─── S  "saya juga selesai"
   = koneksi siap           C ──ACK──▶ S  "ok, putus"

   Ingat: 3 untuk buka (konfirmasi 2 arah),
          4 untuk tutup (tiap arah pamit sendiri).</pre>`,
      scenario: 'Firewall baru dipasang, user komplain "web lemot banget". Capture menunjukkan SYN dari client tidak pernah dibalas SYN-ACK — firewall me-drop SYN secara diam-diam, client menunggu timeout lalu mencoba lagi. Bukan "lemot", melainkan koneksi yang gagal dibuka. Engineer yang bisa membaca handshake langsung menunjuk firewall, bukan bandwidth.',
      bestPractices: 'Saat aplikasi TCP "tidak bisa konek", cek handshake dulu di capture: SYN tanpa SYN-ACK = server/firewall/jalan bermasalah; SYN-ACK tanpa ACK balasan = masalah di sisi client/routing balik; RST = ditolak paksa.',
      security: '<b>SYN flood</b>: penyerang membanjiri SYN tanpa pernah mengirim ACK ketiga — server menyimpan "setengah koneksi" hingga kehabisan resource. Ini serangan DoS klasik Layer 4; mitigasi dengan SYN cookies.',
      challenge: 'Jelaskan mengapa penyerang SYN flood TIDAK perlu menyelesaikan handshake — justru di situlah letak serangannya. (Petunjuk: apa yang disimpan server setelah menerima SYN?)',
      interviewQ: 'Q: "Jelaskan three-way handshake dan mengapa butuh 3 langkah." — A: (1) Client→Server SYN dengan seq awal; (2) Server→Client SYN-ACK (seq server + ack seq client); (3) Client→Server ACK. Tiga langkah memastikan kedua arah terkonfirmasi hidup dan nomor urut awal disepakati — dua langkah hanya membuktikan satu arah.',
      quiz: [
        { q: 'Urutan three-way handshake yang benar adalah…', options: ['ACK → SYN → SYN-ACK', 'SYN → SYN-ACK → ACK', 'SYN → ACK → FIN', 'FIN → SYN → ACK'], answer: 1, explain: 'Client SYN, server balas SYN-ACK, client tutup dengan ACK.' },
        { q: 'Tujuan utama handshake selain membuka koneksi adalah…', options: ['Negosiasi enkripsi', 'Menyepakati sequence number awal kedua belah pihak', 'Memilih VLAN', 'Menentukan IP'], answer: 1, explain: 'SYN membawa ISN (Initial Sequence Number) masing-masing pihak.' },
        { q: 'Dalam serangan SYN flood, penyerang…', options: ['Menyelesaikan handshake lalu membanjiri data', 'Mengirim banyak SYN tanpa ACK ketiga sehingga server kehabisan resource setengah-koneksi', 'Memalsukan FIN', 'Menyerang DNS'], answer: 1, explain: 'Inti serangan: memanfaatkan state half-open yang disimpan server per SYN.' },
      ],
    },
    {
      id: '3.12',
      title: 'DNS',
      body: `<p><b>DNS</b> (<i>Domain Name System</i>) adalah <b>"buku telepon internet"</b>: menerjemahkan nama yang mudah diingat manusia (<code>google.com</code>) menjadi IP yang dimengerti mesin (<code>142.250.x.x</code>). Bekerja di <b>Layer 7</b> (Application), umumnya via <b>UDP port 53</b>.</p>
<h3>Mengapa Dibutuhkan?</h3>
<p>Manusia buruk mengingat angka (siapa hafal 142.250.190.14?), mesin butuh angka untuk routing. DNS menjembatani keduanya — tanpanya, internet hanya bisa diakses via IP. Ia juga fondasi layanan modern: load balancing, failover, dan CDN semuanya dimungkinkan karena nama bisa dipetakan ke banyak IP.</p>
<h3>Hierarki: Cara Kerja Resolusi</h3>
<pre>User ketik "www.tokomu.com" → PC tanya DNS resolver (ISP/kantor):

 1. Resolver → Root server ("."): "di mana .com?"
    → "tanya server .com di alamat X"
 2. Resolver → server .com: "di mana tokomu.com?"
    → "tanya server tokomu.com di alamat Y"
 3. Resolver → server tokomu.com: "IP www.tokomu.com?"
    → "192.0.2.10" ✓
 4. Resolver menyimpan (cache) & menjawab ke PC

Jenis query: RECURSIVE (PC→resolver: "uruskan sampai dapat")
             ITERATIVE (resolver→server: "kasih petunjuk berikutnya")</pre>
<h3>Record Penting</h3>
<div class="tblwrap"><table>
<tr><th>Record</th><th>Fungsi</th><th>Contoh</th></tr>
<tr><td><b>A</b></td><td>Nama → IPv4</td><td>www → 192.0.2.10</td></tr>
<tr><td><b>AAAA</b></td><td>Nama → IPv6</td><td>www → 2001:db8::10</td></tr>
<tr><td><b>CNAME</b></td><td>Nama → nama lain (alias)</td><td>www → server1.tokomu.com</td></tr>
<tr><td><b>MX</b></td><td>Server email domain</td><td>tokomu.com → mail.tokomu.com</td></tr>
<tr><td><b>PTR</b></td><td>IP → nama (reverse, untuk anti-spam)</td><td>192.0.2.10 → www.tokomu.com</td></tr>
<tr><td><b>TXT</b></td><td>Info teks (SPF/DKIM anti-spam)</td><td>"v=spf1 ..."</td></tr>
</table></div>
<div class="callout"><div class="t">"Internet Mati" yang Ternyata DNS</div><p style="margin:4px 0 0">Gejala klasik: <b>ping 8.8.8.8 OK tapi buka google.com gagal</b> = jaringan hidup, DNS mati. Selalu uji keduanya (IP vs nama) untuk memisahkan masalah konektivitas dari masalah resolusi — 30 detik yang menghemat 30 menit.</p></div>`,
      terms: [
        ['DNS', 'Domain Name System — menerjemahkan nama domain ke IP (L7, UDP 53).'],
        ['Resolver', 'Server DNS yang ditanya client; melakukan resolusi rekursif.'],
        ['Recursive vs Iterative', 'Recursive: "uruskan sampai dapat"; iterative: "kasih petunjuk berikutnya".'],
        ['DNS record', 'Entri data DNS: A, AAAA, CNAME, MX, PTR, TXT.'],
      ],
      scenario: 'Seluruh kantor "tidak bisa internet" pukul 09.00. Ping ke 8.8.8.8 normal — jaringan sehat! Ternyata server DNS internal down setelah update malam hari. Solusi sementara 2 menit: arahkan client ke DNS publik sambil memperbaiki server. Tanpa kebiasaan "uji IP vs nama", tim akan mengutak-atik router/ISP yang tidak bersalah.',
      bestPractices: 'Sediakan minimal 2 DNS server (primer + sekunder) dan JANGAN keduanya di satu mesin yang sama. Dokumentasikan di IP plan.',
      security: 'DNS tanpa proteksi rentan: <b>spoofing/poisoning</b> (jawaban palsu membelokkan user ke situs phishing) dan <b>tunneling</b> (eksfiltrasi data via query DNS). Mitigasi: DNSSEC, filtering, monitoring query aneh (Part 29).',
      challenge: 'Jalankan <code>nslookup google.com</code> dan <code>nslookup -type=MX gmail.com</code>. Catat jawabannya. Lalu: apa beda hasil A dan MX — untuk keperluan apa masing-masing?',
      interviewQ: 'Q: "Jelaskan alur resolusi DNS saat user mengetik sebuah domain." — A: PC bertanya recursive ke resolver → resolver iteratif: root (.) → TLD (.com) → authoritative server domain → dapat IP (record A) → di-cache lalu dijawab ke PC. Tiap tingkat hanya memberi petunjuk ke tingkat berikutnya.',
      quiz: [
        { q: 'Fungsi utama DNS adalah…', options: ['Memberi IP otomatis ke client', 'Menerjemahkan nama domain menjadi IP address', 'Mengenkripsi web', 'Me-routing antar-ISP'], answer: 1, explain: 'DNS = buku telepon: nama manusia → angka mesin.' },
        { q: 'Record DNS untuk memetakan nama ke IPv4 adalah…', options: ['MX', 'CNAME', 'A', 'PTR'], answer: 2, explain: 'A = address IPv4; AAAA = IPv6; MX = mail; PTR = reverse.' },
        { q: 'Ping ke 8.8.8.8 berhasil tapi buka nama domain gagal. Kesimpulan tepat…', options: ['Kabel putus', 'Jaringan hidup; masalah di DNS resolver', 'ISP down total', 'IP address salah'], answer: 1, explain: 'Uji IP vs nama memisahkan konektivitas (OK) dari resolusi nama (gagal).' },
      ],
    },
    {
      id: '3.13',
      title: 'DHCP',
      body: `<p><b>DHCP</b> (<i>Dynamic Host Configuration Protocol</i>) adalah <b>"resepsionis jaringan"</b>: ia memberi <b>IP address otomatis</b> ke device yang baru bergabung — plus gateway, DNS, dan subnet mask. Bekerja di <b>Layer 7</b> via <b>UDP port 67 (server) / 68 (client)</b>.</p>
<h3>Mengapa Dibutuhkan?</h3>
<p>Bayangkan mengonfigurasi manual 500 PC, 200 HP, 50 printer — tiap ada yang pindah colokan, setting ulang. Tidak skalabel dan rawan salah (duplikat IP!). DHCP memusatkan manajemen: <b>satu server mengatur semua</b>, IP dipinjamkan (<i>lease</i>) dan bisa ditarik kembali.</p>
<h3>Proses DORA (4 Langkah)</h3>
<pre>Client baru (IP 0.0.0.0)              DHCP Server

 1. DISCOVER ──broadcast──▶  "Ada server DHCP di sini?"
                             (wajib broadcast: belum punya IP!)
 2. ◀──OFFER── unicast       "Pakai 192.168.20.100 ya, gateway .1, DNS .30.5"
 3. REQUEST ──broadcast──▶   "OK, saya ambil 192.168.20.100"
                             (broadcast agar server DHCP lain tahu: sudah laku)
 4. ◀──ACK──── unicast       "Deal! Lease 8 jam." ✓</pre>
<p><b>Mengapa Discover & Request broadcast?</b> Client belum punya IP — tidak bisa dituju secara unicast. Dan Request di-broadcast agar <b>semua</b> server DHCP yang menawar tahu tawarannya ditolak (mencegah IP ganda).</p>
<h3>Istilah Penting</h3>
<ul>
<li><b>Lease:</b> masa pinjam IP (mis. 8 jam). Diperpanjang otomatis di setengah masa (<i>renew</i>). Lease pendek = IP cepat kembali ke pool (bagus untuk tamu); lease panjang = stabil (bagus untuk kantor).</li>
<li><b>Scope/Pool:</b> rentang IP yang boleh dibagikan (mis. 192.168.20.100–200).</li>
<li><b>Reservation:</b> IP "dipesan" untuk MAC tertentu — printer/server selalu dapat IP sama, tapi tetap terpusat di DHCP.</li>
<li><b>DHCP relay:</b> karena <b>broadcast tidak lewat router</b>, tiap VLAN butuh relay agent yang meneruskan Discover ke server pusat — konfigurasi penting di Part 13.</li>
</ul>`,
      terms: [
        ['DHCP', 'Dynamic Host Configuration Protocol — pemberi IP otomatis (L7, UDP 67/68).'],
        ['DORA', 'Discover → Offer → Request → Ack: 4 langkah DHCP.'],
        ['Lease', 'Masa pinjam IP address dari DHCP server.'],
        ['DHCP relay', 'Agent yang meneruskan DHCP broadcast antar-VLAN ke server pusat.'],
        ['Reservation', 'IP yang dipesan untuk MAC tertentu di DHCP.'],
      ],
      diagram: `<pre>              DORA: 4 LANGKAH DHCP

   Client (0.0.0.0)                DHCP Server
        ── DISCOVER ──▶   (broadcast: "ada yang jual IP?")
        ◀── OFFER ──      (unicast: "pakai .100 ya")
        ── REQUEST ──▶    (broadcast: "deal .100!")
        ◀── ACK ──        (unicast: "sah 8 jam ✓")

   Dapat: IP + mask + gateway + DNS — tanpa ketik manual.</pre>`,
      scenario: 'Printer kantor "kadang bisa kadang tidak" diakses. Ternyata printer pakai DHCP tanpa reservation — tiap lease habis IP-nya berubah, dan semua PC menyimpan IP lama. Solusi: DHCP reservation berdasarkan MAC printer. Kasus 5 menit yang berulang selama berbulan-bulan karena tidak dipahami konsep lease.',
      bestPractices: 'Server, printer, dan device infrastruktur: selalu DHCP reservation atau IP statik terdokumentasi — jangan biarkan IP mereka berubah-ubah. Client user: DHCP biasa.',
      security: '<b>Rogue DHCP server</b>: penyerang memasang DHCP palsu yang memberi gateway = dirinya → semua traffic lewat dia (MITM). Mitigasi: <b>DHCP snooping</b> di switch — hanya port uplink yang boleh mengirim Offer (Part 08/29).',
      challenge: 'Jelaskan mengapa DHCP Discover HARUS broadcast tetapi DHCP Offer cukup unicast. (Petunjuk: apa yang diketahui server tentang client di tiap tahap?)',
      interviewQ: 'Q: "Jelaskan DORA dan mengapa ada langkah broadcast." — A: Discover (client broadcast mencari server — belum punya IP), Offer (server menawar IP), Request (client broadcast mengambil tawaran — agar server lain tahu), Ack (server mengesahkan + lease time). Broadcast diperlukan karena client belum punya alamat unicast.',
      quiz: [
        { q: 'Urutan DORA yang benar adalah…', options: ['Discover → Request → Offer → Ack', 'Discover → Offer → Request → Ack', 'Offer → Discover → Ack → Request', 'Request → Discover → Ack → Offer'], answer: 1, explain: 'DORA = Discover, Offer, Request, Acknowledgement.' },
        { q: 'DHCP Discover dikirim broadcast karena…', options: ['Agar lebih cepat', 'Client belum punya IP sehingga tidak bisa dituju/ditujukan secara unicast', 'Syarat firewall', 'Agar hemat bandwidth'], answer: 1, explain: 'Tanpa IP, client 0.0.0.0 tidak bisa menerima unicast — broadcast satu-satunya cara.' },
        { q: 'Fungsi DHCP relay adalah…', options: ['Mempercepat DHCP', 'Meneruskan DHCP broadcast antar-VLAN karena broadcast tidak lewat router', 'Menggantikan DHCP server', 'Mengenkripsi DHCP'], answer: 1, explain: 'Router memblokir broadcast; relay agent meneruskan Discover ke server DHCP pusat.' },
      ],
    },
    {
      id: '3.14',
      title: 'HTTP/HTTPS',
      body: `<p><b>HTTP</b> (<i>HyperText Transfer Protocol</i>) adalah protokol <b>Layer 7</b> untuk <b>web</b> — bahasa yang dipakai browser bicara dengan server web. <b>HTTPS</b> adalah HTTP yang dibungkus <b>TLS</b> (enkripsi, Layer 6) — "S"-nya = <i>Secure</i>.</p>
<h3>Request–Response: Cara Kerja</h3>
<pre>Browser ──▶ GET /index.html HTTP/1.1 ──▶ Server (port 80/443)
          Host: intranet.kantor.local
          ◀── HTTP/1.1 200 OK ── Server
              Content-Type: text/html
              [isi halaman]</pre>
<ul>
<li><b>Method:</b> GET (ambil), POST (kirim data form), PUT/DELETE — "kata kerja" request.</li>
<li><b>Status code:</b> 200 OK, 301 pindah, 404 tidak ketemu, 500 server error — bahasa status yang wajib hafal untuk troubleshooting.</li>
<li><b>Stateless:</b> tiap request independen; "ingat login" diurus cookie/session di atasnya (Layer 7 juga, tapi wilayah developer).</li>
</ul>
<h3>HTTP vs HTTPS</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>HTTP (port 80)</th><th>HTTPS (port 443)</th></tr>
<tr><td>Enkripsi</td><td>Tidak — teks polos</td><td>Ya — TLS</td></tr>
<tr><td>Yang terlihat penyadap</td><td>Semua: URL, data login, isi</td><td>Hanya: IP & domain tujuan (SNI), ukuran</td></tr>
<tr><td>Sertifikat</td><td>Tidak perlu</td><td>Wajib — membuktikan identitas server</td></tr>
<tr><td>Pakai kapan</td><td>Hampir tidak pernah (legacy)</td><td>Selalu — standar modern</td></tr>
</table></div>
<h3>Mengapa Network Engineer Peduli HTTP?</h3>
<p>Karena <b>mayoritas tiket user adalah "web tidak bisa dibuka"</b> — dan separuhnya masalah jaringan (DNS, routing, firewall port 443, proxy), bukan aplikasinya. Mampu membaca status code dan membedakan "404" (aplikasi) vs "timeout" (jaringan) mempercepat triage. Detail TLS/sertifikat di Part 29.</p>`,
      terms: [
        ['HTTP', 'HyperText Transfer Protocol — protokol web Layer 7, port 80, tanpa enkripsi.'],
        ['HTTPS', 'HTTP over TLS — port 443, terenkripsi, standar modern.'],
        ['TLS', 'Transport Layer Security — enkripsi Layer 6 untuk HTTPS.'],
        ['Status code', 'Angka status respons HTTP: 200 OK, 404 not found, 500 error, dll.'],
      ],
      scenario: 'User lapor "website bank tidak bisa dibuka". Engineer cek: ping OK, DNS OK, telnet ke port 443 OK — tapi browser bilang "certificate error". Ternyata jam server salah 2 tahun sehingga sertifikat dianggap kedaluwarsa. Bukan masalah jaringan sama sekali — tapi hanya bisa disimpulkan setelah lapisan jaringan terbukti sehat satu per satu.',
      bestPractices: 'Untuk "web tidak bisa": urutan cek = DNS (nslookup) → konektivitas (ping IP) → port (telnet 443) → sertifikat/TLS → baru aplikasi. Jangan lompat ke kesimpulan.',
      security: 'HTTP mentransmisikan segalanya telanjang — termasuk password. Kebijakan modern: <b>HTTPS everywhere</b>, HSTS, dan blokir/deteksi HTTP untuk layanan sensitif. Sertifikat kedaluwarsa = insiden (monitor di Zabbix, Part 23).',
      challenge: 'Buka developer tools browser (F12 → Network), refresh sebuah situs, dan temukan: method, status code, dan apakah koneksinya HTTPS. Catat 3 request berbeda.',
      interviewQ: 'Q: "Apa beda HTTP dan HTTPS secara teknis?" — A: HTTPS = HTTP yang dibungkus TLS (enkripsi Layer 6) di port 443 vs HTTP polos port 80. TLS memberi tiga hal: kerahasiaan (enkripsi), integritas (anti-ubah), dan autentikasi server (sertifikat).',
      quiz: [
        { q: 'Port standar HTTPS adalah…', options: ['80', '22', '443', '53'], answer: 2, explain: 'HTTPS = 443 (HTTP = 80).' },
        { q: 'Status code 404 artinya…', options: ['Server error', 'Halaman/resource tidak ditemukan', 'Sukses', 'Redirect'], answer: 1, explain: '4xx = error client; 404 = not found. 2xx sukses, 3xx redirect, 5xx error server.' },
        { q: '"S" pada HTTPS menyediakan…', options: ['Kecepatan lebih tinggi', 'Enkripsi TLS: kerahasiaan, integritas, autentikasi server', 'Kompresi otomatis', 'Caching'], answer: 1, explain: 'TLS mengenkripsi dan memverifikasi identitas server via sertifikat.' },
      ],
    },
    {
      id: '3.15',
      title: 'SSH',
      body: `<p><b>SSH</b> (<i>Secure Shell</i>) adalah protokol <b>Layer 7</b> untuk <b>mengelola device/server dari jarak jauh secara terenkripsi</b> — port <b>22</b>, via TCP. Ini adalah <b>alat harian #1</b> network engineer: konfigurasi router, switch, dan server Linux semuanya lewat SSH.</p>
<h3>Mengapa SSH?</h3>
<p>Sebelum SSH ada Telnet (3.16) — yang mengirim <b>username & password telanjang</b>. SSH mengenkripsi <b>seluruh sesi</b>: perintah yang diketik, output-nya, bahkan password — tidak ada yang bisa disadap di tengah jalan. Ia juga memverifikasi identitas server (anti server palsu) via <b>host key</b>.</p>
<h3>Dua Cara Login</h3>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Cara</th><th>Keamanan</th></tr>
<tr><td><b>Password</b></td><td>Ketik password tiap login</td><td>Cukup — tapi rentan brute-force & intip</td></tr>
<tr><td><b>Public key</b></td><td>Pasangan kunci: private di laptop-mu, public di server</td><td><b>Terbaik</b> — tidak ada password yang dikirim; private key tidak pernah keluar dari laptop</td></tr>
</table></div>
<pre># Contoh sesi SSH ke switch (VLAN 99 MANAGEMENT)
$ ssh admin@192.168.99.2
admin@192.168.99.2's password: ********
Switch&gt; enable
Switch# show ip interface brief     ← mulai konfigurasi!</pre>
<p><b>Mengapa contoh memakai 192.168.99.x?</b> Sesuai desain kurikulum: device jaringan dikelola <b>hanya dari VLAN 99 MANAGEMENT</b> — bukan dari VLAN user. Prinsip least privilege sejak hari pertama.</p>
<div class="callout blue"><div class="t">SSH Bukan Cuma Remote Shell</div><p style="margin:4px 0 0">SSH juga mengangkut <b>SCP/SFTP</b> (transfer file aman — pengganti FTP), <b>port forwarding/tunneling</b> (mengamankan aplikasi lama), dan menjadi transport Ansible (Part 33). Menguasai SSH = menguasai separuh pekerjaan remote engineer.</p></div>`,
      terms: [
        ['SSH', 'Secure Shell — remote management terenkripsi, L7, TCP port 22.'],
        ['Host key', 'Kunci identitas server SSH; peringatan "changed!" = tanda bahaya (server diganti/diserang).'],
        ['Public key auth', 'Login SSH tanpa password memakai pasangan kunci kriptografi.'],
        ['SCP/SFTP', 'Transfer file aman di atas SSH.'],
      ],
      scenario: 'Engineer mengonfigurasi switch baru dari meja — via SSH ke 192.168.99.2, bukan dengan laptop colok kabel console bolak-balik ke rak. Satu sesi SSH menghemat 30 menit jalan kaki. Inilah mengapa VLAN MANAGEMENT (99) dan SSH adalah pasangan wajib di setiap desain: kelola semua device dari satu tempat, aman.',
      bestPractices: 'Gunakan public key auth + nonaktifkan login root via SSH di server. Simpan private key dengan passphrase — kunci tanpa passphrase yang bocor = akses penuh ke semua servermu.',
      security: 'JANGAN expose SSH ke internet tanpa proteksi: ganti port default tidak cukup — pakai fail2ban/rate-limit, key-only auth, dan batasi source IP (Part 29). Peringatan "host key changed" jangan diabaikan: bisa jadi serangan MITM.',
      challenge: 'Jika punya akses Linux/VM: generate key pair (<code>ssh-keygen</code>), lalu ssh ke localhost atau VM. Rasakan bedanya login pakai key vs password.',
      interviewQ: 'Q: "Mengapa SSH menggantikan Telnet?" — A: Telnet mengirim semua (termasuk password) sebagai teks polos yang bisa disadap; SSH mengenkripsi seluruh sesi, memverifikasi identitas server via host key, dan mendukung autentikasi public key. Fungsinya sama (remote CLI), keamanannya beda kelas.',
      quiz: [
        { q: 'Port standar SSH adalah…', options: ['23', '22', '443', '3389'], answer: 1, explain: 'SSH = TCP 22. Telnet = 23, HTTPS = 443, RDP = 3389.' },
        { q: 'Sesuai desain kurikulum, SSH ke device jaringan seharusnya dari…', options: ['VLAN 40 GUEST', 'VLAN 99 MANAGEMENT', 'Internet langsung', 'VLAN 10 CCTV'], answer: 1, explain: 'VLAN 99 MANAGEMENT = segmen khusus admin; least privilege.' },
        { q: 'Keunggulan public key auth dibanding password adalah…', options: ['Lebih cepat diketik', 'Tidak ada kredensial yang dikirim/dicuri; private key tak pernah keluar dari laptop', 'Tidak butuh username', 'Bekerja tanpa jaringan'], answer: 1, explain: 'Kriptografi asimetris: server hanya pegang public key; autentikasi via challenge yang dijawab private key.' },
      ],
    },
    {
      id: '3.16',
      title: 'Telnet dan Mengapa Tidak Aman',
      body: `<p><b>Telnet</b> adalah kakek SSH: protokol <b>Layer 7</b>, port <b>23</b>, TCP — untuk remote CLI ke device. Fungsinya <i>persis</i> seperti SSH, dengan satu perbedaan fatal: <b>semua dikirim sebagai teks polos</b> (<i>plaintext</i>).</p>
<h3>Demonstrasi Bahaya (Konseptual)</h3>
<pre>Sesi Telnet yang di-capture penyerang di LAN:

  login: admin
  Password: rahasia123     ← TERLIHAT JELAS di capture!
  Switch&gt; enable
  Switch# configure terminal

Sesi SSH yang sama di-capture:
  ..zX$9!q2@vLm#e8*...     ← sampah terenkripsi, tak berguna</pre>
<p>Siapa pun dengan Wireshark di jalur yang sama (atau ARP spoofing) bisa memanen username & password Telnet dalam detik. Di era 1970-an ini wajar; di 2026 ini <b>kelalaian</b>.</p>
<h3>Mengapa Masih Dibahas?</h3>
<ul>
<li><b>Legacy device:</b> perangkat tua (printer, UPS, alat industri) kadang <i>hanya</i> punya Telnet. Solusi: jangan expose — akses via <b>jump host/bastion</b> di VLAN MANAGEMENT, atau bungkus dengan VPN/SSH tunnel.</li>
<li><b>Alat uji port:</b> <code>telnet 192.168.30.10 80</code> masih dipakai untuk <b>mengetes konektivitas TCP ke port tertentu</b> (bukan untuk login!) — karena Telnet client ada di mana-mana. Pakai, lalu tutup.</li>
<li><b>Pelajaran sejarah:</b> memahami <i>mengapa</i> Telnet ditinggalkan membuatmu tidak mengulangi kesalahan yang sama (mis. memakai HTTP untuk login, FTP untuk transfer sensitif).</li>
</ul>
<div class="callout"><div class="t">Aturan Keras</div><p style="margin:4px 0 0"><b>JANGAN PERNAH</b> mengaktifkan/menggunakan Telnet untuk login di production — ke device apa pun, di VLAN apa pun. Jika menemukan Telnet aktif saat audit, perlakukan sebagai <b>temuan keamanan</b>: matikan, ganti dengan SSH. Tidak ada pengecualian "kan cuma internal".</p></div>`,
      terms: [
        ['Telnet', 'Protokol remote CLI lawas (L7, TCP 23) — teks polos, TIDAK AMAN.'],
        ['Plaintext', 'Data tanpa enkripsi — bisa dibaca siapa pun yang meng-capture.'],
        ['Bastion/jump host', 'Server lompatan aman untuk mengakses device legacy.'],
      ],
      scenario: 'Audit keamanan menemukan printer kantor masih memakai Telnet dengan password default "admin". Penyerang yang masuk ke LAN bisa mengambil alih printer, lalu menjadikannya pijakan serangan lanjutan. Temuan ini masuk laporan sebagai <i>high risk</i> — diperbaiki dengan menonaktifkan Telnet dan mengisolasi printer ke VLAN khusus. Satu protokol lawas = satu pintu masuk.',
      bestPractices: 'Dalam audit/assessment, "cek Telnet aktif" masuk daftar 10 pemeriksaan pertama — bersama password default dan SNMP community string default.',
      security: 'Prinsip umumnya: <b>setiap protokol plaintext untuk kredensial adalah utang keamanan</b> — Telnet (ganti SSH), HTTP login (ganti HTTPS), FTP (ganti SFTP), SNMPv2 (ganti SNMPv3). Daftar ini akan kamu eksekusi di Part 29.',
      challenge: 'Cari di jaringanmu (atau ingat-ingat): adakah device yang masih memakai HTTP/Telnet untuk admin? Tulis rencana migrasinya dalam 3 langkah.',
      interviewQ: 'Q: "Kapan Telnet masih boleh dipakai?" — A: Praktisnya tidak untuk login — selalu SSH. Satu-satunya pemakaian sah: sebagai <i>tool uji konektivitas TCP</i> (telnet host port) karena client-nya tersedia di mana-mana; dan itu pun hanya untuk test, bukan sesi login.',
      quiz: [
        { q: 'Alasan utama Telnet tidak aman adalah…', options: ['Port-nya terlalu kecil', 'Semua data termasuk password dikirim sebagai teks polos (plaintext)', 'Terlalu lambat', 'Tidak mendukung keyboard'], answer: 1, explain: 'Plaintext = bisa disadap siapa pun di jalur dengan packet capture.' },
        { q: 'Pengganti Telnet yang aman untuk remote CLI adalah…', options: ['HTTP', 'SSH (port 22, terenkripsi)', 'FTP', 'DNS'], answer: 1, explain: 'SSH: fungsi sama (remote shell), seluruh sesi terenkripsi + verifikasi host key.' },
        { q: 'Pemakaian Telnet yang masih bisa diterima adalah…', options: ['Login ke router production', 'Menguji konektivitas TCP ke port tertentu (bukan login)', 'Transfer file rahasia', 'Akses dari internet'], answer: 1, explain: 'Sebagai TCP test tool — manfaatkan client yang ada di mana-mana; tutup setelah test.' },
      ],
    },
    {
      id: '3.17',
      title: 'Hands-On: Tool Jaringan Dasar (ping, arp, traceroute, nslookup, netstat)',
      body: `<p>Lima tool, satu misi: <b>membaca kondisi jaringan</b> tanpa software tambahan. Lab ini adalah "kotak P3K" yang akan kamu bawa ke setiap troubleshooting sampai Part 39.</p>
<h3>Topologi</h3>
<pre>[PC-mu] ── LAN ── [Gateway] ── [Internet]
                              Target uji:
                              A: gateway (L2/L3 lokal)
                              B: 8.8.8.8 (routing internet)
                              C: google.com (DNS + routing)</pre>
<h3>Objective</h3>
<p>Menguasai 5 tool + mampu menyimpulkan <b>di layer mana masalahnya</b> dari output masing-masing — mengikuti alur Topology → Objective → Configuration → Verification → Failure Injection → Troubleshooting → Fix → Final Verification.</p>
<h3>Konfigurasi</h3>
<p>Tidak ada — tool sudah bawaan OS. <b>Alasan:</b> tool bawaan selalu tersedia di server/client mana pun, termasuk saat darurat tanpa internet untuk install.</p>
<h3>Verifikasi (Lima Tool, Lima Misi)</h3>
<pre># 1. PING — "apakah tujuan hidup & berapa latency/loss-nya?"
ping 192.168.20.1        # gateway: harus <1ms, 0% loss
ping 8.8.8.8             # internet via IP: pisahkan masalah routing vs DNS
ping google.com          # via nama: jika ini gagal tapi 8.8.8.8 OK = DNS!

# 2. ARP — "siapa MAC di LAN saya?"
arp -a                   # Windows
ip neigh show            # Linux
# Mengapa: verifikasi L2 sebelum menyalahkan L3

# 3. TRACEROUTE — "lewat router mana saja?"
tracert 8.8.8.8          # Windows
traceroute 8.8.8.8       # Linux
# Mengapa: petakan hop; hop terakhir yang balas = lokasi masalah

# 4. NSLOOKUP — "apakah DNS sehat?"
nslookup google.com
nslookup -type=MX gmail.com
# Mengapa: pisahkan "tidak bisa buka web" jadi masalah DNS vs konektivitas

# 5. NETSTAT — "koneksi & port apa yang aktif di mesinku?"
netstat -an              # semua koneksi + port listen
netstat -an | findstr 443   # Windows: siapa pakai 443?
ss -tuln                 # Linux modern (pengganti netstat)</pre>
<p><b>Expected output:</b> ping gateway &lt;1ms 0% loss; arp -a menampilkan gateway; traceroute hop-1 = gateway; nslookup menjawab IP; netstat/ss menampilkan koneksi ESTABLISHED dan port LISTEN.</p>
<h3>Failure Injection</h3>
<p><b>Injeksi A — DNS palsu:</b> set DNS manual ke <code>192.0.2.1</code> (IP tes yang tidak ada). <b>Ekspektasi:</b> <code>ping 8.8.8.8</code> TETAP OK, <code>ping google.com</code> GAGAL, <code>nslookup</code> timeout — bukti textbook "jaringan hidup, DNS mati".<br><b>Injeksi B — gateway salah:</b> (seperti lab 2.16) ping LAN OK, ping 8.8.8.8 gagal di hop-1.</p>
<h3>Troubleshooting (Matriks Diagnosis)</h3>
<div class="tblwrap"><table>
<tr><th>ping IP</th><th>ping nama</th><th>Kesimpulan</th></tr>
<tr><td>OK</td><td>OK</td><td>Sehat</td></tr>
<tr><td>OK</td><td>Gagal</td><td><b>DNS</b> bermasalah</td></tr>
<tr><td>Gagal</td><td>Gagal</td><td><b>Konektivitas/routing</b> — lanjut traceroute</td></tr>
</table></div>
<h3>Fix & Final Verification</h3>
<p>Kembalikan DNS/gateway yang benar, lalu ulangi kelima tool: semua hijau. <b>Dokumentasikan</b> dalam format: tool → output → kesimpulan layer. Inilah embrio laporan troubleshooting profesional.</p>
<div class="callout blue"><div class="t">Urutan Sakti: IP dulu, Nama kemudian</div><p style="margin:4px 0 0">Selalu uji <b>ping IP</b> sebelum <b>ping nama</b>. Urutan ini memisahkan dua dunia masalah dalam 10 detik — kebiasaan kecil dengan dampak besar di setiap insiden.</p></div>`,
      terms: [
        ['netstat/ss', 'Melihat koneksi aktif & port listen di host (ss = pengganti modern di Linux).'],
        ['Traceroute', 'Memetakan hop router ke tujuan via manipulasi TTL.'],
      ],
      scenario: 'Helpdesk menerima "email tidak bisa". Teknisi menjalankan matriks: ping IP mail server OK, nslookup MX record gagal — vonis 2 menit: DNS, bukan server email. Ia tidak me-restart server email (yang sehat) dan tidak menelepon ISP. Lima tool dasar mengalahkan satu jam tebakan.',
      bestPractices: 'Hafalkan matriks diagnosis IP-vs-nama. Tempel di dinding NOC jika perlu — ia menyelesaikan 50% tiket konektivitas.',
      security: 'Output <code>netstat -an</code> juga untuk audit: port LISTEN yang tidak dikenal = layanan mencurigakan. Kenali port normal mesinu sendiri.',
      challenge: 'Buat "kartu diagnosis" pribadimu: satu halaman berisi 5 tool, perintahnya (Windows+Linux), dan apa kesimpulan dari tiap pola output. Ini cheat sheet pertamamu sebagai engineer.',
      interviewQ: 'Q: "Bedakan kegunaan ping, traceroute, dan nslookup dalam troubleshooting." — A: ping = apakah tujuan hidup + latency/loss (L3). traceroute = lewat hop mana + di hop mana putus (peta jalan). nslookup = apakah resolusi nama bekerja (memisahkan masalah DNS dari konektivitas). Ketiganya saling melengkapi, bukan saling mengganti.',
      quiz: [
        { q: 'Ping ke 8.8.8.8 OK tetapi ping ke google.com gagal. Artinya…', options: ['Kabel putus', 'Konektivitas OK, DNS bermasalah', 'ISP down', 'IP address salah'], answer: 1, explain: 'Matriks IP-vs-nama: IP OK + nama gagal = resolver DNS.' },
        { q: 'Tool untuk melihat koneksi aktif dan port listen di host adalah…', options: ['nslookup', 'netstat / ss', 'tracert', 'arp'], answer: 1, explain: 'netstat -an (Windows) / ss -tuln (Linux): peta koneksi & port mesin sendiri.' },
        { q: 'Dalam traceroute, "hop terakhir yang membalas" menunjukkan…', options: ['Kecepatan internet', 'Lokasi (batas) masalah — setelahnya packet tidak kembali', 'Jumlah user', 'Versi router'], answer: 1, explain: 'Hop terakhir yang merespons = titik terjauh yang masih reachable; masalah ada di setelahnya.' },
      ],
    },
    {
      id: '3.18',
      title: 'Hands-On: tcpdump & Wireshark',
      body: `<p>Jika lima tool sebelumnya adalah "stetoskop", <b>packet capture</b> adalah "rontgen": melihat <b>isi sebenarnya</b> packet — header per header, seperti teori encapsulation Part 02. Dua tool standar industri: <b>Wireshark</b> (GUI, analisis mendalam) dan <b>tcpdump</b> (CLI, di server tanpa GUI).</p>
<h3>Topologi</h3>
<pre>[PC-mu + Wireshark] ── LAN ── [Gateway] ── [Internet]
        capture di interface LAN-mu
        (atau di server via tcpdump → file .pcap → buka di Wireshark)</pre>
<h3>Objective</h3>
<p>Menangkap dan <b>membaca</b>: (1) ARP request/reply, (2) three-way handshake TCP, (3) query DNS — lalu mengaitkannya dengan teori Part 02–03.</p>
<h3>Konfigurasi</h3>
<ul>
<li><b>Wireshark</b> (Windows/Linux GUI): install dari wireshark.org. <b>Alasan GUI:</b> pewarnaan protokol + decode header otomatis mempercepat belajar 10x.</li>
<li><b>tcpdump</b> (Linux CLI): biasanya sudah ada. <b>Alasan CLI:</b> di server production tidak ada GUI — tcpdump + <code>-w file.pcap</code> adalah cara standar capture lalu analisis di laptop.</li>
</ul>
<h3>Verifikasi (Tiga Misi Capture)</h3>
<pre># MISI 1 — Lihat ARP hidup (Wireshark: filter "arp")
# Kosongkan cache dulu agar ARP terjadi:
arp -d *              # Windows (admin) — hapus semua entry
sudo ip neigh flush all   # Linux
ping <gateway>        # picu ARP request → lihat request broadcast & reply unicast

# MISI 2 — Lihat handshake TCP (filter "tcp.port==443")
# Buka sebuah situs HTTPS → temukan 3 packet: SYN, SYN-ACK, ACK
# Klik packet → buka "Transmission Control Protocol" → baca Seq/Ack/Flags!

# MISI 3 — Lihat DNS (filter "dns")
nslookup google.com   # → query UDP port 53 & response dengan record A

# tcpdump setara CLI:
sudo tcpdump -i any -n port 53 -w dns.pcap     # capture DNS ke file
sudo tcpdump -i any -n arp                     # lihat ARP live</pre>
<p><b>Filter penting:</b> <i>capture filter</i> (<code>port 53</code> — saat ambil, hemat) vs <i>display filter</i> (<code>dns</code> — setelah ambil, fleksibel). <b>Expected output:</b> ARP request broadcast → reply unicast; urutan SYN/SYN-ACK/ACK dengan Seq/Ack +1; query DNS → response dengan A record.</p>
<h3>Failure Injection</h3>
<p><b>Injeksi — capture di interface yang salah</b> (mis. loopback atau Wi-Fi saat traffic lewat kabel). <b>Ekspektasi:</b> tidak ada packet target tertangkap. <b>Pelajaran:</b> capture harus di <b>jalur traffic</b> — konsep SPAN/port mirroring (Part 23).</p>
<h3>Troubleshooting</h3>
<div class="tblwrap"><table>
<tr><th>Gejala Capture</th><th>Artinya</th></tr>
<tr><td>Tidak ada packet sama sekali</td><td>Salah interface / bukan di jalur traffic</td></tr>
<tr><td>Hanya broadcast, tanpa unicast target</td><td>Traffic tidak lewat sini (bukan gateway/jalur)</td></tr>
<tr><td>SYN berulang tanpa SYN-ACK</td><td>Server/firewall tidak menjawab (L4/jalan)</td></tr>
<tr><td>Banyak retransmission</td><td>Loss di jalan (L1/L2/L3)</td></tr>
</table></div>
<h3>Fix & Final Verification</h3>
<p>Pilih interface yang benar (yang ada IP LAN-mu), ulangi tiga misi hingga ketiganya terlihat dan bisa kamu jelaskan header-nya. <b>Final test:</b> tunjuk satu packet TCP dan sebutkan — tanpa melihat catatan — SrcPort, DstPort, Seq, Ack, Flags. Bisa = lulus.</p>
<div class="callout"><div class="t">Etika Capture</div><p style="margin:4px 0 0">Hanya capture di jaringan <b>milikmu / yang kamu kelola</b> dengan izin. Meng-capture traffic orang lain tanpa otorisasi adalah pelanggaran privasi dan bisa melanggar hukum — sekaligus alasan traffic sensitif wajib terenkripsi.</p></div>`,
      terms: [
        ['Wireshark', 'Analyzer packet GUI standar industri; decode header otomatis.'],
        ['tcpdump', 'Tool capture CLI di Linux/Unix; standar di server tanpa GUI.'],
        ['Capture filter', 'Filter saat pengambilan (hemat, mis. "port 53").'],
        ['Display filter', 'Filter tampilan setelah capture (fleksibel, mis. "dns").'],
        ['Promiscuous mode', 'Mode NIC menangkap semua frame — syarat capture traffic tetangga (butuh SPAN).'],
      ],
      scenario: 'Aplikasi kasir "kadang timeout". Capture di server menunjukkan pola: SYN dari client datang, server balas SYN-ACK, tapi ACK ketiga tidak pernah kembali — lalu client retransmit SYN. Vonis: <b>routing asimetris / firewall</b> memakan arah balik, bukan aplikasi. Tanpa capture, tim aplikasi dan tim network akan saling menyalahkan berminggu-minggu.',
      bestPractices: 'Selalu simpan file .pcap insiden penting — ia adalah "barang bukti" yang bisa dianalisis ulang dan dilampirkan di laporan. Beri nama jelas: <code>2026-10-14_kasir-timeout_client.pcap</code>.',
      security: 'File pcap bisa berisi kredensial plaintext (jika ada Telnet/HTTP) — perlakukan sebagai data sensitif: jangan upload ke forum publik, hapus setelah analisis, simpan terenkripsi.',
      challenge: 'Capture saat membuka satu situs HTTPS. Temukan: (1) query DNS-nya, (2) handshake TCP-nya, (3) berapa RTT handshake dari timestamp. Tulis analisismu 5 baris.',
      interviewQ: 'Q: "Apa beda capture filter dan display filter di Wireshark?" — A: Capture filter (sintaks tcpdump, mis. "port 53") bekerja saat pengambilan — menghemat ukuran file tapi packet yang tidak cocok hilang permanen. Display filter (mis. "dns") bekerja setelah capture — fleksibel diubah-ubah karena semua packet tersimpan.',
      quiz: [
        { q: 'Untuk capture di server Linux tanpa GUI, tool standar adalah…', options: ['Wireshark GUI', 'tcpdump dengan -w untuk simpan .pcap', 'ping', 'nslookup'], answer: 1, explain: 'tcpdump = CLI standar; -w menyimpan pcap untuk dianalisis di Wireshark laptop.' },
        { q: 'Di capture terlihat SYN berulang tanpa SYN-ACK. Artinya…', options: ['Koneksi sehat', 'Server/firewall tidak menjawab — masalah di sisi tujuan atau jalan', 'DNS rusak', 'Capture salah filter'], answer: 1, explain: 'Handshake macet di langkah 1→2: SYN sampai (atau tidak) tapi tak ada balasan.' },
        { q: 'Sebelum capture ARP "live", mengapa disarankan flush ARP table dulu?', options: ['Agar komputer lebih cepat', 'Agar ARP request benar-benar terjadi (bukan pakai cache lama)', 'Syarat Wireshark', 'Agar IP berubah'], answer: 1, explain: 'Entry cache membuat host tidak perlu ARP request — flush memaksa percakapan ARP baru yang bisa ditangkap.' },
      ],
    },
  ],
  project: {
    title: 'Project Part 03 — Network Toolkit Report (Portfolio)',
    html: `<div class="proj">
<h3>Project Part 03 — Network Toolkit Report</h3>
<p><b>Tugasmu:</b> lakukan <b>audit konektivitas</b> memakai 5 tool dasar + 1 capture terhadap jaringan yang kamu pakai (rumah/kantor/lab), lalu tulis laporannya seperti engineer profesional.</p>
<p><b>Isi dokumen (toolkit-report.md):</b></p>
<ol>
<li>Topologi jaringan yang diaudit (ASCII) + tabel: IP-mu, gateway, DNS, subnet.</li>
<li>Hasil 5 tool: <code>ping</code> (gateway, 8.8.8.8, nama domain), <code>arp -a</code>, <code>traceroute</code>, <code>nslookup</code>, <code>netstat/ss</code> — sertakan output asli + <b>kesimpulan per tool</b> (sehat/tidak, di layer apa).</li>
<li>Hasil capture: screenshot/ringkasan ARP + handshake TCP + DNS query yang kamu tangkap, dengan 2 kalimat penjelasan tiap temuan.</li>
<li>Matriks diagnosis IP-vs-nama versimu + satu skenario "seandainya rusak" (pilih 1 failure injection) beserta diagnosisnya.</li>
<li>Daftar 10 well-known port yang kamu hafal + 3 port LISTEN yang kamu temukan di mesinmu dan pemiliknya.</li>
</ol>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Di repository <code>network-engineer-lab</code>, buat folder <code>part-03-ethernet-fundamentals/</code>.</span></li>
<li><span class="n">2</span><span>Isi dengan <code>README.md</code> (ringkasan eksekutif) dan <code>toolkit-report.md</code> (laporan lengkap). File .pcap JANGAN di-upload (sensitif) — cukup ringkasannya.</span></li>
<li><span class="n">3</span><span>Commit <code>"Part 03: network toolkit report"</code> lalu push.</span></li>
</ol>
<p><b>Kriteria selesai:</b> kelima tool terdokumentasi dengan output asli + kesimpulan layer yang tepat, minimal 1 capture handshake TCP teridentifikasi (SYN/SYN-ACK/ACK), matriks IP-vs-nama benar, dan tidak ada file .pcap mentah di repository.</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 03</div>
<p style="margin:6px 0 0">1) Jelaskan DORA. &nbsp;2) Kapan pilih UDP daripada TCP? &nbsp;3) Bagaimana traceroute bekerja? &nbsp;4) Ping IP OK tapi ping nama gagal — apa artinya? &nbsp;5) Mengapa Telnet dilarang? — Jawab kelimanya dengan kata-katamu sendiri sebelum lanjut ke Part 04.</p></div>`,
  },
};
