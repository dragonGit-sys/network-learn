// Part 22 — Fase D: Network Services (materi, tanpa project)
// Layanan fondasi: DHCP, DNS, NTP, SSH, Syslog, SNMP, HTTP/HTTPS,
// network management, IPAM. Alur data device → protocol → collector → DB → dashboard.
import type { Part } from './types';

export const part22: Part = {
  id: '22',
  number: 'PART 22',
  title: 'Network Services',
  phaseId: 'fase-4',
  description:
    'Layanan fondasi yang membuat jaringan hidup: DHCP, DNS, NTP, SSH, syslog, SNMP, HTTP/HTTPS, plus konsep network management dan IPAM.',
  repoFolder: 'part-22-network-services',
  objectives: [
    'Menjelaskan fungsi dan cara kerja DHCP, DNS, dan NTP serta alur paketnya.',
    'Mengamankan akses remote perangkat via SSH dan memusatkan log via syslog.',
    'Menjelaskan alur monitoring: device → SNMP → collector → database → dashboard.',
    'Memahami konsep IPAM dan network management sebagai fondasi operasional.',
  ],
  prerequisites:
    'Part 04 (IP addressing), Part 19–20 (VLAN & segmentasi — layanan ini berjalan di atasnya). Server Linux dasar membantu untuk praktik (Part 32).',
  subbabs: [
    {
      id: '22.1',
      title: 'DHCP',
      body: `
<p><b>DHCP</b> (Dynamic Host Configuration Protocol) adalah layanan yang <b>memberi IP otomatis</b> ke perangkat: IP address, subnet mask, gateway, dan DNS server — tanpa diketik manual. Tanpa DHCP, 400 laptop kantor harus dikonfigurasi satu per satu.</p>
<h3>Cara Kerja: DORA</h3>
<p>Proses 4 langkah yang mudah diingat <b>DORA</b>:</p>
<ol>
<li><b>Discover</b> — client baru broadcast: "Adakah DHCP server di sini?"</li>
<li><b>Offer</b> — server menjawab: "Saya ada, pakai IP 192.168.20.100 ya?"</li>
<li><b>Request</b> — client: "OK, saya ambil IP itu."</li>
<li><b>Ack</b> — server: "Deal. Sewa 1 hari, gateway .20.1, DNS .30.21."</li>
</ol>
<h3>Packet Flow (Layer OSI)</h3>
<pre>Client (0.0.0.0) ──UDP broadcast──▶ DHCP server (.30.21)
  Layer 2: broadcast MAC ff:ff:ff:ff:ff:ff (belum punya IP!)
  Layer 3: source 0.0.0.0 → dest 255.255.255.255
  Layer 4: UDP port 67 (server) / 68 (client)
  Layer 7: pesan DHCP DORA
Catatan: broadcast tidak lewat router! Client di VLAN 20 butuh
DHCP server di VLAN 20 ATAU 'ip helper-address' di gateway
yang meneruskan broadcast DHCP ke server (DHCP relay).</pre>
<h3>DHCP Relay — Konsep Penting</h3>
<p>Karena broadcast DHCP <b>tidak menembus router</b>, tiap VLAN butuh relay: gateway (mis. 192.168.20.1) dikonfigurasi <code>ip helper-address 192.168.30.21</code> — ia menangkap broadcast DHCP client dan meneruskannya <b>unicast</b> ke DHCP server di VLAN 30, lalu mengembalikan jawabannya. Satu DHCP server melayani semua VLAN.</p>
<h3>Scope, Lease, Reservation</h3>
<div class="tblwrap"><table>
<tr><th>Istilah</th><th>Arti</th><th>Contoh di lab</th></tr>
<tr><td><b>Scope</b></td><td>Pool IP + opsi per subnet</td><td>Scope VLAN 20: .100–.200</td></tr>
<tr><td><b>Lease time</b></td><td>Lama sewa IP</td><td>Office 1 hari; guest 4 jam</td></tr>
<tr><td><b>Reservation</b></td><td>IP tetap untuk MAC tertentu</td><td>Printer → .20.21 selalu</td></tr>
<tr><td><b>Excluded</b></td><td>IP yang tidak boleh dibagikan</td><td>.1–.50 (infrastruktur)</td></tr>
</table></div>
<div class="callout"><div class="t">Ancaman: Rogue DHCP</div><p style="margin:4px 0 0">Laptop iseng yang menjalankan DHCP server akan menjawab DORA lebih cepat dan memberi gateway palsu → traffic user dibelokkan (man-in-the-middle). Penangkal: <b>DHCP snooping</b> di switch (Part 20.4) — hanya port ke server resmi yang boleh menjawab.</p></div>`,
      terms: [
        ['DHCP', 'Protokol pembagian IP otomatis: IP, mask, gateway, DNS, lease time.'],
        ['DORA', 'Discover–Offer–Request–Ack: 4 langkah client mendapatkan IP.'],
        ['DHCP relay', 'Fitur gateway yang meneruskan broadcast DHCP lintas VLAN ke server (ip helper-address).'],
        ['Scope', 'Definisi pool IP + opsi untuk satu subnet.'],
        ['Lease time', 'Durasi sewa IP sebelum client harus perpanjang.'],
        ['Rogue DHCP', 'DHCP server liar/tidak resmi — vektor serangan man-in-the-middle.'],
      ],
      diagram: `<pre>        DHCP DORA + RELAY

[VLAN 20 client] ──broadcast DORA──▶ [gateway .20.1]
                                            │ ip helper-address .30.21
                                            │ (ubah jadi unicast)
                                            ▼
                                   [DHCP server .30.21 VLAN 30]
                                            │ offer/request/ack
                                            ▼
                                     client dapat .20.100 ✓

Satu server melayani semua VLAN via relay di tiap gateway.</pre>`,
      scenario:
        'Gedung baru ditambah ke jaringan tapi user di sana tidak dapat IP. DHCP server sehat, scope tersedia. Ternyata gateway VLAN gedung baru lupa dikonfigurasi ip helper-address — broadcast DORA mentok di VLAN lokal. Satu baris konfigurasi, satu gedung lumpuh.',
      bestPractices:
        'Satu/dua DHCP server terpusat (dengan failover) + helper-address di tiap gateway — jangan sebar DHCP server di tiap gedung. Monitor utilisasi scope (alert 80%). Dokumentasikan reservation.',
      security:
        'Aktifkan DHCP snooping di semua access switch. Pisahkan scope guest (lease pendek, DNS publik). Log DHCP (MAC–IP–waktu) membantu forensik insiden.',
      challenge:
        'Rancang DHCP untuk 5 VLAN lab: tulis tabel scope (range, gateway, DNS, lease, excluded) untuk tiap VLAN dan tentukan di mana helper-address dikonfigurasi. Jelaskan mengapa server cukup satu.',
      interviewQ:
        'Q: "Client di VLAN 20 tidak dapat IP padahal DHCP server di VLAN 30 sehat. Apa yang kamu cek?" — A: DHCP relay — broadcast tidak lewat router, jadi pastikan ip helper-address terkonfigurasi di gateway VLAN 20 menunjuk ke server. Lalu cek: scope tersedia? DHCP snooping memblokir? Server bisa dijangkau?',
      quiz: [
        {
          q: 'Apa kepanjangan DORA dalam proses DHCP?',
          options: [
            'Data–Output–Route–Ack',
            'Discover–Offer–Request–Ack',
            'Domain–Order–Relay–Access',
            'Download–Open–Run–Apply',
          ],
          answer: 1,
          explain: 'DORA = client discover (broadcast), server offer, client request, server ack — 4 langkah mendapatkan IP.',
        },
        {
          q: 'Mengapa dibutuhkan DHCP relay (ip helper-address)?',
          options: [
            'Agar DHCP lebih cepat',
            'Broadcast DHCP tidak menembus router — relay di gateway meneruskannya unicast ke server di VLAN lain',
            'Agar tidak butuh DHCP server',
            'Untuk mengenkripsi DHCP',
          ],
          answer: 1,
          explain: 'Tanpa relay, tiap VLAN butuh DHCP server sendiri; dengan relay satu server terpusat melayani semua VLAN.',
        },
        {
          q: 'Apa bahaya rogue DHCP server?',
          options: [
            'Membuat internet lebih lambat sedikit',
            'Memberi gateway/DNS palsu sehingga traffic user bisa dibelokkan (man-in-the-middle)',
            'Menghabiskan listrik',
            'Tidak berbahaya',
          ],
          answer: 1,
          explain: 'Rogue DHCP menjawab DORA dengan parameter jahat (gateway palsu) → penyerang melihat/memanipulasi traffic korban. Ditangkal DHCP snooping.',
        },
      ],
    },
    {
      id: '22.2',
      title: 'DNS',
      body: `
<p><b>DNS</b> (Domain Name System) adalah <b>"buku telepon internet"</b>: menerjemahkan nama (<code>erp.kantor.lan</code>) menjadi IP (192.168.30.10). Manusia ingat nama; komputer butuh angka — DNS menjembatani keduanya.</p>
<h3>Cara Kerja Sederhana</h3>
<ol>
<li>Aplikasi butuh <code>erp.kantor.lan</code> → tanya DNS server: "berapa IP-nya?"</li>
<li>DNS cek catatannya (zone) → jawab: "192.168.30.10".</li>
<li>Aplikasi lalu konek ke 192.168.30.10. (Tanpa DNS, user harus hafal IP!)</li>
</ol>
<h3>Jenis Query & Record</h3>
<div class="tblwrap"><table>
<tr><th>Record</th><th>Fungsi</th><th>Contoh</th></tr>
<tr><td><b>A</b></td><td>Nama → IPv4</td><td>erp.kantor.lan → 192.168.30.10</td></tr>
<tr><td><b>AAAA</b></td><td>Nama → IPv6</td><td>erp.kantor.lan → fd00::10</td></tr>
<tr><td><b>CNAME</b></td><td>Alias nama → nama lain</td><td>www → erp.kantor.lan</td></tr>
<tr><td><b>PTR</b></td><td>IP → nama (reverse)</td><td>.10 → erp.kantor.lan</td></tr>
<tr><td><b>MX</b></td><td>Server email domain</td><td>kantor.lan → mail.kantor.lan</td></tr>
</table></div>
<h3>DNS Internal vs Eksternal</h3>
<ul>
<li><b>DNS internal</b> (.30.21 di lab): melayani zona <code>kantor.lan</code> — hanya untuk VLAN internal (20, 30, 99). Inilah yang <b>tidak boleh</b> diakses guest (Part 20.6).</li>
<li><b>DNS eksternal/publik</b> (8.8.8.8): untuk internet; dipakai VLAN 40 guest dan sebagai forwarder.</li>
<li><b>Split DNS</b>: nama yang sama bisa resolve ke IP berbeda untuk internal vs eksternal (mis. portal perusahaan).</li>
</ul>
<h3>Packet Flow</h3>
<pre>PC (.20.50) buka http://erp.kantor.lan:
1. PC → UDP 53 → 192.168.30.21: "A? erp.kantor.lan"
2. DNS → jawab: 192.168.30.10 (dari cache/zone)
3. PC → TCP 80/443 → 192.168.30.10
DNS gagal = "aplikasi mati" bagi user, walau server sehat.
Selalu cek DNS saat aplikasi "tidak bisa diakses" tapi ping IP OK!</pre>
<div class="callout blue"><div class="t">Aturan Troubleshooting</div><p style="margin:4px 0 0">Bisa ping IP tapi tidak bisa buka nama? 99% masalah DNS. Perintah: <code>nslookup erp.kantor.lan</code> (Windows) / <code>dig erp.kantor.lan</code> (Linux). Cek DNS server yang dipakai client: <code>ipconfig /all</code>.</p></div>`,
      terms: [
        ['DNS', 'Sistem penerjemah nama domain menjadi alamat IP (dan sebaliknya).'],
        ['Zone', 'Database catatan DNS untuk satu domain (kantor.lan).'],
        ['Record A/PTR', 'A: nama→IP; PTR: IP→nama (reverse lookup).'],
        ['Forwarder', 'DNS server yang meneruskan query tak dikenal ke DNS lain (mis. publik).'],
        ['Split DNS', 'Nama sama resolve ke IP berbeda untuk internal vs eksternal.'],
      ],
      diagram: `<pre>        ALUR DNS INTERNAL

[PC .20.50] ──UDP 53──▶ [DNS .30.21]
   "A? erp.kantor.lan"      │ zone kantor.lan
                            ▼
                       "192.168.30.10"
[PC] ──TCP 443──▶ [ERP .30.10] ✓

Guest (VLAN 40) ──▶ DNS publik 8.8.8.8 (TIDAK ke .30.21!)</pre>`,
      scenario:
        'Seluruh kantor "tidak bisa buka ERP" padahal server ERP sehat dan bisa di-ping. Ternyata DNS server mati — user mengakses via nama, bukan IP. NOC mengganti DNS sementara ke forwarder dan ERP "menyala" kembali dalam 5 menit. Pelajaran: DNS adalah layanan kritis yang sering dilupakan.',
      bestPractices:
        'Minimal 2 DNS server (primary + secondary) di VLAN berbeda/subnet berbeda. Monitor layanan DNS seperti memonitor server kritis. TTL jangan terlalu panjang agar perubahan cepat berlaku.',
      security:
        'DNS internal tidak boleh bisa di-query dari guest/internet (informasi disclosure). Waspadai DNS tunneling (eksfiltrasi data via query DNS) — monitor query aneh di firewall.',
      challenge:
        'Rancang zona kantor.lan: buat 8 record (A untuk ERP, file, NVR, Zabbix, printer; CNAME www; MX mail; PTR untuk .10). Tentukan TTL tiap record dan alasannya.',
      interviewQ:
        'Q: "User bisa ping 192.168.30.10 tapi tidak bisa buka erp.kantor.lan. Diagnosis?" — A: Klasik masalah DNS: ping IP OK = network beres; nama gagal = resolver/DNS bermasalah. Cek: DNS server client benar? (ipconfig), nslookup berhasil? DNS server-nya up? Zone-nya ada record-nya?',
      quiz: [
        {
          q: 'Apa fungsi utama DNS?',
          options: [
            'Memberi IP otomatis',
            'Menerjemahkan nama domain menjadi alamat IP agar aplikasi bisa konek',
            'Mengamankan jaringan',
            'Mempercepat internet',
          ],
          answer: 1,
          explain: 'DNS = buku telepon: manusia pakai nama, komputer pakai IP; DNS menerjemahkan di antaranya (UDP port 53).',
        },
        {
          q: 'User bisa ping IP server tapi tidak bisa akses via nama. Kemungkinan terbesar?',
          options: [
            'Kabel putus',
            'Masalah DNS (resolver/server/zone) — network Layer 3 terbukti OK via ping IP',
            'VLAN terhapus',
            'Server mati',
          ],
          answer: 1,
          explain: 'Ping IP OK membuktikan Layer 1–3 beres; kegagalan nama = lapisan resolusi nama (DNS). Cek dengan nslookup/dig.',
        },
        {
          q: 'Mengapa guest (VLAN 40) tidak boleh memakai DNS internal?',
          options: [
            'DNS internal lebih lambat',
            'DNS internal membocorkan peta jaringan (nama + IP server internal) ke zona tidak terpercaya',
            'DNS internal tidak support tamu',
            'Agar hemat bandwidth',
          ],
          answer: 1,
          explain: 'Zone internal adalah peta aset perusahaan; memberikannya ke guest = kebocoran informasi walau akses IP-nya diblokir.',
        },
      ],
    },
    {
      id: '22.3',
      title: 'NTP',
      body: `
<p><b>NTP</b> (Network Time Protocol) menyamakan <b>jam di semua perangkat</b> ke sumber waktu yang akurat. Terdengar sepele — tapi jam yang tidak sinkron merusak log, keamanan, dan troubleshooting.</p>
<h3>Mengapa Waktu Harus Sama?</h3>
<ul>
<li><b>Log & forensik</b> — melacak serangan butuh urutan kejadian presisi antar perangkat. Switch jam 10:05, firewall jam 09:47 → timeline kacau, investigasi gagal.</li>
<li><b>Keamanan</b> — sertifikat TLS, Kerberos, dan OTP menolak jika selisih jam terlalu besar (autentikasi gagal misterius!).</li>
<li><b>Monitoring</b> — grafik Zabbix/Grafana (Part 23–27) butuh timestamp konsisten agar korelasi antar metrik valid.</li>
<li><b>Scheduled task</b> — backup dan maintenance window jalan pada jam yang disepakati.</li>
</ul>
<h3>Cara Kerja Singkat</h3>
<p>Perangkat (client NTP) bertanya ke <b>NTP server</b> via <b>UDP port 123</b>: "jam berapa sekarang?" — lalu mengoreksi jam lokalnya, memperhitungkan <b>delay jaringan</b> (waktu tempuh paket). Akurasi umum: milidetik — cukup untuk operasional.</p>
<h3>Hierarki Stratum</h3>
<pre>Stratum 0: jam atom / GPS (sumber paling akurat)
   ↓
Stratum 1: server yang langsung ke Stratum 0 (mis. time.google.com)
   ↓
Stratum 2: NTP server lokal kita (.30.21) — sync ke Stratum 1
   ↓
Stratum 3: switch, router, firewall, server — sync ke server lokal

Aturan: semua perangkat sync ke NTP LOKAL (satu sumber kebenaran),
bukan masing-masing ke internet (boros + tidak konsisten).</pre>
<h3>Konfigurasi (Contoh Cisco)</h3>
<pre>SW(config)# ntp server 192.168.30.21
! ALASAN: tunjuk ke NTP lokal, bukan ke internet langsung —
! konsisten + tetap sync saat internet mati (server lokal punya jam).
SW# show ntp status → "Clock is synchronized" ✓</pre>
<div class="callout"><div class="t">Gejala Klasik Jam Kacau</div><p style="margin:4px 0 0">Login SSH ditolak padahal password benar, VPN tidak konek, atau log "masa depan/masa lalu" — sebelum panik, cek jam perangkat (<code>show clock</code>). Banyak "gangguan misterius" selesai dengan sinkronisasi NTP.</p></div>`,
      terms: [
        ['NTP', 'Network Time Protocol — penyamaan jam perangkat via UDP 123.'],
        ['Stratum', 'Tingkatan hierarki sumber waktu: 0 (atom/GPS) → 1 → 2 (lokal) → 3 (perangkat).'],
        ['Drift', 'Penyimpangan jam perangkat dari waktu sebenarnya akibat clock hardware tak sempurna.'],
      ],
      diagram: `<pre>        HIERARKI NTP LAB

[time.google.com] (stratum 1, internet)
        │ UDP 123
        ▼
[NTP lokal .30.21] (stratum 2)
   ┌────┼────┬────┐
   ▼    ▼    ▼    ▼
[Core][Dist][FW][Switch] (stratum 3)

Satu sumber kebenaran → semua log selaras.</pre>`,
      scenario:
        'Investigasi insiden: log firewall menunjukkan serangan jam 14:00, tapi log server menunjukkan jam 13:20 — tim mengejar "pelaku" yang salah selama 2 hari. Akar masalah: server tidak sync NTP (selisih 40 menit). Sejak itu NTP menjadi checklist wajib setiap instalasi perangkat.',
      bestPractices:
        'Konfigurasi NTP adalah langkah ke-2 setelah IP address di setiap perangkat baru (langkah ke-1). Monitor offset NTP (alert jika >1 detik). Pakai minimal 2 sumber upstream untuk NTP lokal.',
      security:
        'NTP bisa diserang (spoofing waktu → merusak log/autentikasi). Batasi siapa boleh query NTP server (ACL), dan gunakan autentikasi NTP untuk perangkat kritis bila didukung.',
      challenge:
        'Audit 10 perangkat: 3 belum dikonfigurasi NTP. Tulis dampaknya terhadap: (a) investigasi insiden, (b) monitoring, (c) autentikasi — dan buat SOP "NTP wajib" 5 langkah untuk instalasi perangkat baru.',
      interviewQ:
        'Q: "Sebutkan 3 alasan mengapa semua perangkat jaringan harus sync NTP." — A: (1) Log forensik butuh timeline konsisten antar perangkat; (2) keamanan — sertifikat/Kerberos/OTP gagal jika jam selisih; (3) monitoring & korelasi metrik butuh timestamp selaras.',
      quiz: [
        {
          q: 'Mengapa perangkat jaringan butuh NTP?',
          options: [
            'Agar tampilannya bagus',
            'Log forensik, keamanan (sertifikat/OTP), dan monitoring butuh jam yang sinkron antar perangkat',
            'Agar internet cepat',
            'Tidak butuh sebenarnya',
          ],
          answer: 1,
          explain: 'Jam yang selisih merusak urutan log investigasi dan menggagalkan autentikasi berbasis waktu — NTP (UDP 123) menyamakannya.',
        },
        {
          q: 'Stratum dalam NTP artinya…',
          options: [
            'Kecepatan jaringan',
            'Tingkatan hierarki sumber waktu: 0 (atom/GPS) paling akurat, makin besar makin jauh dari sumber',
            'Jumlah perangkat',
            'Versi protokol',
          ],
          answer: 1,
          explain: 'Stratum menunjukkan jarak dari sumber waktu primer; desain umum: perangkat → NTP lokal (stratum 2) → publik (stratum 1).',
        },
        {
          q: 'Semua perangkat sebaiknya sync ke…',
          options: [
            'Masing-masing ke server internet berbeda',
            'Satu NTP server lokal (sumber kebenaran tunggal) yang sync ke upstream publik',
            'Jam tangan admin',
            'Tidak perlu sync',
          ],
          answer: 1,
          explain: 'Satu sumber lokal = konsisten + hemat + tetap sync saat internet mati; masing-masing ke internet berisiko inkonsistensi.',
        },
      ],
    },
    {
      id: '22.4',
      title: 'SSH',
      body: `
<p><b>SSH</b> (Secure Shell) adalah protokol <b>akses remote terenkripsi</b> ke perangkat jaringan (dan server Linux) via <b>TCP port 22</b>. Ini pengganti <b>telnet</b> yang mengirim semuanya (termasuk password!) dalam teks biasa.</p>
<h3>Mengapa SSH, Bukan Telnet?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Telnet (port 23)</th><th>SSH (port 22)</th></tr>
<tr><td>Enkripsi</td><td>Tidak ada — password bisa disadap</td><td>Ya — semua terenkripsi</td></tr>
<tr><td>Autentikasi</td><td>Password saja</td><td>Password atau key (lebih aman)</td></tr>
<tr><td>Status</td><td>DILARANG di production modern</td><td>Standar wajib</td></tr>
</table></div>
<h3>SSH Key — Autentikasi Tanpa Password</h3>
<p>Selain password, SSH mendukung <b>key pair</b>: <b>private key</b> (di laptop admin, rahasia) + <b>public key</b> (ditaruh di perangkat). Login terjadi via tantangan kriptografi — <b>tidak ada password yang dikirim</b>, sehingga tidak bisa disadap atau di-brute-force.</p>
<pre># Di laptop admin (Linux):
$ ssh-keygen -t ed25519 -C "admin@noc"
! ALASAN: membuat pasangan kunci ed25519 (modern & cepat).
! Private key (~/.ssh/id_ed25519) JANGAN dibagikan ke siapa pun.
$ ssh-copy-id admin@192.168.99.11
! ALASAN: menyalin public key ke switch — setelah ini login tanpa password.
$ ssh admin@192.168.99.11
! Masuk tanpa password — aman dari penyadapan & brute-force.</pre>
<h3>Pengamanan SSH di Perangkat</h3>
<ul>
<li><b>Matikan telnet</b>: <code>transport input ssh</code> (sudah di 20.7).</li>
<li><b>Batasi sumber</b>: ACL/access-class — hanya IP admin (VLAN 99) boleh SSH.</li>
<li><b>Nonaktifkan login root/password lemah</b> di server Linux; pakai key + sudo.</li>
<li><b>Ganti port?</b> — security by obscurity; bukan pengganti key + ACL, tapi mengurangi noise brute-force dari internet.</li>
<li><b>Timeout & banner</b>: session idle terputus otomatis; banner peringatan legal.</li>
</ul>
<h3>Packet Flow</h3>
<pre>[Laptop admin] ──TCP 22──▶ [Switch .99.11]
1. Handshake + verifikasi host key (cegah MITM)
2. Autentikasi: key/password
3. Kanal terenkripsi: semua perintah & output aman
Penyadap di jalur yang sama hanya melihat ciphertext.</pre>
<div class="callout"><div class="t">Peringatan Keras</div><p style="margin:4px 0 0">JANGAN pernah mengaktifkan telnet "sementara untuk debug" di production dan lupa mematikan. Satu sesi telnet = password admin lewat jaringan dalam teks biasa. Audit: pastikan <code>transport input ssh</code> di semua perangkat.</p></div>`,
      terms: [
        ['SSH', 'Secure Shell — akses remote terenkripsi via TCP 22.'],
        ['Key pair', 'Pasangan kunci kriptografi: private (rahasia) + public (disebar).'],
        ['Brute-force', 'Serangan menebak password dengan mencoba ribuan kombinasi.'],
        ['Host key', 'Kunci identitas server SSH — diverifikasi client untuk cegah MITM.'],
      ],
      diagram: `<pre>        SSH vs TELNET

TELNET: [admin] ──"password: cisco123"──▶ [switch]  ← terbaca penyadap!
SSH:    [admin] ──xxxxxxxxxxxxxxxxxxxx──▶ [switch]  ← ciphertext

SSH key: login tanpa password terkirim — tantangan kriptografi.</pre>`,
      scenario:
        'Audit menemukan satu switch lama masih mengaktifkan telnet. Log menunjukkan login telnet dari IP tak dikenal 2 minggu lalu — password enable kemungkinan sudah bocor. Respons: ganti semua credential, matikan telnet di semua perangkat, audit ulang. Satu protokol usang = satu insiden.',
      bestPractices:
        'SSH key untuk semua admin (nonaktifkan password SSH bila memungkinkan). Simpan private key dengan passphrase. Rotasi key saat admin keluar. Dokumentasikan siapa punya akses ke perangkat apa.',
      security:
        'Jangan expose SSH perangkat ke internet langsung — pakai VPN/jump host (Part 31). Aktifkan fail2ban/login block untuk brute-force di server Linux.',
      challenge:
        'Buat SOP hardening SSH untuk switch baru: 7 langkah (dari generate key sampai verifikasi telnet mati). Jelaskan alasan keamanan tiap langkah.',
      interviewQ:
        'Q: "Apa bedanya SSH password dan SSH key, mengapa key lebih aman?" — A: Password dikirim (terenkripsi tapi bisa di-brute-force); key memakai tantangan kriptografi — private key tidak pernah dikirim, tidak bisa disadap atau ditebak. Key + passphrase = standar admin profesional.',
      quiz: [
        {
          q: 'Mengapa telnet dilarang di production?',
          options: [
            'Karena lambat',
            'Mengirim username/password dalam teks biasa yang bisa disadap siapa pun di jalur jaringan',
            'Karena mahal',
            'Karena tidak ada di switch baru',
          ],
          answer: 1,
          explain: 'Tanpa enkripsi, credential telnet bisa dicuri dengan packet sniffer sederhana — SSH mengenkripsi seluruh sesi.',
        },
        {
          q: 'Keunggulan utama SSH key dibanding password adalah…',
          options: [
            'Lebih cepat diketik',
            'Private key tidak pernah dikirim ke server — tidak bisa disadap atau di-brute-force',
            'Tidak butuh username',
            'Gratis',
          ],
          answer: 1,
          explain: 'Autentikasi key memakai tantangan kriptografi; yang berpindah hanya public key dan tanda tangan — password tidak pernah lewat jaringan.',
        },
        {
          q: 'Langkah pengamanan SSH yang benar adalah…',
          options: [
            'Aktifkan telnet sebagai cadangan',
            'Matikan telnet, batasi sumber via ACL, pakai key, nonaktifkan password lemah',
            'Buka SSH ke internet agar mudah diakses',
            'Pakai password "admin123" agar mudah diingat',
          ],
          answer: 1,
          explain: 'Pertahanan berlapis: hanya SSH, hanya dari IP admin, autentikasi key — ditambah jangan expose ke internet langsung.',
        },
      ],
    },
    {
      id: '22.5',
      title: 'Syslog',
      body: `
<p><b>Syslog</b> adalah protokol <b>pengiriman log terpusat</b>: perangkat jaringan mengirim catatan kejadian (login, link up/down, error) ke <b>syslog server</b> via <b>UDP/TCP port 514</b>. Tanpa syslog, log tersebar di tiap perangkat dan hilang saat reboot.</p>
<h3>Mengapa Log Terpusat?</h3>
<ul>
<li><b>Forensik</b> — insiden kemarin bisa ditelusuri dari log lengkap (perangkat yang log-nya hanya lokal sering sudah ter-overwrite).</li>
<li><b>Korelasi</b> — satu serangan terlihat di banyak perangkat; log terpusat menyatukannya dalam satu timeline (butuh NTP sinkron! — 22.3).</li>
<li><b>Deteksi dini</b> — pola aneh (login gagal beruntun, link flapping) bisa di-alert otomatis.</li>
<li><b>Kepatuhan</b> — banyak regulasi mewajibkan penyimpanan log minimal 1 tahun.</li>
</ul>
<h3>Severity Level</h3>
<div class="tblwrap"><table>
<tr><th>Level</th><th>Nama</th><th>Contoh</th></tr>
<tr><td>0</td><td>Emergency</td><td>Sistem tidak bisa dipakai</td></tr>
<tr><td>2</td><td>Critical</td><td>Link core down</td></tr>
<tr><td>4</td><td>Warning</td><td>Link flapping, login gagal</td></tr>
<tr><td>5</td><td>Notice</td><td>Konfigurasi berubah, user login</td></tr>
<tr><td>6</td><td>Informational</td><td>Link up, DHCP binding</td></tr>
<tr><td>7</td><td>Debug</td><td>Detail teknis (hati-hati: membanjiri!)</td></tr>
</table></div>
<p>Aturan: kirim <b>notice ke atas</b> (0–5) ke server; informational opsional; debug hanya saat troubleshooting aktif.</p>
<h3>Konfigurasi (Contoh Cisco)</h3>
<pre>SW(config)# logging host 192.168.99.20
! ALASAN: tunjuk ke syslog server terpusat (di VLAN 99 management).
SW(config)# logging trap notifications
! ALASAN: kirim level 5 (notice) ke atas — cukup informatif tanpa
! membanjiri server dengan debug.
SW(config)# service timestamps log datetime msec
! ALASAN: tiap baris log bertimestamp presisi (butuh NTP!) agar
! bisa diurutkan dengan log perangkat lain.</pre>
<h3>Alur Data</h3>
<pre>[Switch] ──UDP 514──▶ [Syslog server .99.20] ──▶ [file/DB] ──▶ [dashboard/alert]
  "link down"        kumpulkan semua          simpan & cari        NOC melihat</pre>`,
      terms: [
        ['Syslog', 'Protokol pengiriman log perangkat ke server terpusat (UDP/TCP 514).'],
        ['Severity level', 'Tingkat kepentingan log 0 (emergency) – 7 (debug).'],
        ['Korelasi log', 'Menggabungkan log banyak perangkat dalam satu timeline untuk analisis.'],
        ['Log retention', 'Lama penyimpanan log sesuai kebijakan/regulasi.'],
      ],
      diagram: `<pre>        ARSITEKTUR SYSLOG TERPUSAT

[Core] ──┐
[Dist] ──┼──UDP 514──▶ [Syslog .99.20] ──▶ [penyimpanan 1 thn]
[Access] ─┤                    │
[FW] ────┘                     └──▶ [alert: "5x login gagal" → NOC]

Semua timestamp sinkron via NTP → timeline valid.</pre>`,
      scenario:
        'Serangan brute-force ke firewall jam 3 pagi tidak disadari sampai user lapor jam 8 — karena log hanya ada di firewall lokal dan tidak ada yang melihat. Setelah syslog terpusat + alert otomatis, serangan serupa memicu notifikasi NOC dalam 2 menit. Log yang tidak dilihat = tidak ada.',
      bestPractices:
        'Wajibkan logging host di setiap perangkat baru (masukkan ke template konfigurasi). Simpan minimal 1 tahun. Buat alert untuk pola kritis (login gagal beruntun, konfigurasi berubah di luar jam kerja).',
      security:
        'Lindungi syslog server — penyerang yang masuk akan menghapus log untuk menutupi jejak (kirim juga ke server kedua / WORM storage). Batasi siapa bisa akses log (berisi info sensitif).',
      challenge:
        'Rancang kebijakan syslog: tentukan level per tipe perangkat (core/dist/access/firewall), estimasi volume per hari, hitung kebutuhan storage 1 tahun, dan buat 5 aturan alert prioritas.',
      interviewQ:
        'Q: "Mengapa log harus terpusat, bukan dibiarkan di tiap perangkat?" — A: (1) Log lokal terbatas dan hilang saat reboot/overwrite; (2) insiden terlihat lintas perangkat — butuh korelasi satu timeline; (3) alert otomatis butuh satu titik kumpul; (4) penyerang bisa menghapus log lokal — server terpisah lebih aman.',
      quiz: [
        {
          q: 'Apa fungsi syslog?',
          options: [
            'Memberi IP otomatis',
            'Mengirim log kejadian perangkat ke server terpusat untuk forensik, korelasi, dan alerting',
            'Menyamakan jam',
            'Menerjemahkan nama domain',
          ],
          answer: 1,
          explain: 'Syslog (port 514) memusatkan log: tanpa ini, bukti insiden tersebar/hilang di tiap perangkat.',
        },
        {
          q: 'Mengapa NTP penting untuk syslog?',
          options: [
            'Tidak penting',
            'Korelasi log lintas perangkat butuh timestamp yang selaras — jam kacau = timeline kacau',
            'Agar log lebih cepat terkirim',
            'Agar hemat storage',
          ],
          answer: 1,
          explain: 'Menggabungkan log banyak perangkat dalam urutan kejadian hanya valid jika semua jam sinkron.',
        },
        {
          q: 'Level syslog mana yang sebaiknya dikirim ke server operasional harian?',
          options: [
            'Hanya debug (7)',
            'Notice (5) ke atas — informatif tanpa membanjiri; debug hanya saat troubleshooting',
            'Tidak usah kirim apa-apa',
            'Semua termasuk debug terus-menerus',
          ],
          answer: 1,
          explain: 'Debug membanjiri storage dan menyembunyikan sinyal penting; notice+ menangkap kejadian operasional yang relevan.',
        },
      ],
    },
    {
      id: '22.6',
      title: 'SNMP',
      body: `
<p><b>SNMP</b> (Simple Network Management Protocol) adalah protokol <b>mengambil data & status perangkat</b>: traffic tiap port, CPU, memori, suhu. Ini "bahasa" yang dipakai tools monitoring (Zabbix, Part 23) untuk bertanya ke perangkat.</p>
<h3>Cara Kerja: Manager ↔ Agent</h3>
<ul>
<li><b>Agent</b> — software di perangkat (switch/router) yang menyimpan data dalam struktur <b>MIB</b> (Management Information Base).</li>
<li><b>Manager</b> — server monitoring (Zabbix) yang meminta data ke agent.</li>
<li><b>OID</b> — alamat data spesifik, mis. <code>1.3.6.1.2.1.2.2.1.10</code> = counter byte masuk interface. MIB menerjemahkannya jadi nama: <code>ifInOctets</code>.</li>
<li><b>Community string</b> — "password" SNMP v1/v2c (dikirim teks biasa!). <b>SNMPv3</b> menambah autentikasi + enkripsi — wajib di production.</li>
</ul>
<h3>Dua Arah Komunikasi</h3>
<div class="tblwrap"><table>
<tr><th>Arah</th><th>Nama</th><th>Contoh</th></tr>
<tr><td>Manager → Agent (polling)</td><td>GET / WALK</td><td>"Berapa traffic port 5?" tiap 1 menit</td></tr>
<tr><td>Agent → Manager (async)</td><td>TRAP</td><td>"Link down!" langsung dikirim saat kejadian</td></tr>
</table></div>
<h3>Konfigurasi Aman (Contoh Cisco)</h3>
<pre>SW(config)# snmp-server community R4hasia RO
! ALASAN: community string seperti password — JANGAN pakai 'public'/'private'
! (default yang diserang duluan). RO = read-only (manager hanya baca,
! tidak bisa ubah konfigurasi via SNMP).
SW(config)# snmp-server host 192.168.99.20 version 2c R4hasia
! ALASAN: kirim trap ke Zabbix (.99.20) agar kejadian penting
! langsung terlapor tanpa menunggu polling.
! PRODUCTION: pakai SNMPv3 (authPriv) — v2c mengirim community
! dalam teks biasa, bisa disadap di VLAN management yang bocor.</pre>
<h3>Alur Data Monitoring (Fondasi Part 23–27)</h3>
<pre>[Switch agent] ──SNMP GET (UDP 161)──▶ [Zabbix manager .99.20]
      │  polling tiap 60 detik                    │
      └──SNMP TRAP (UDP 162)──▶                   ▼
                                          [database] ──▶ [dashboard Grafana]
                                          "port 5: 850 Mbps" → grafik</pre>
<div class="callout blue"><div class="t">SNMP vs Syslog</div><p style="margin:4px 0 0"><b>Syslog</b> = perangkat <i>bercerita</i> (kejadian: "link down!"). <b>SNMP</b> = manager <i>bertanya</i> (metrik: "berapa traffic-mu?"). Keduanya komplementer: syslog untuk event, SNMP untuk angka. Monitoring lengkap butuh keduanya.</p></div>`,
      terms: [
        ['SNMP', 'Protokol pengambilan data/status perangkat untuk monitoring (UDP 161/162).'],
        ['Agent / Manager', 'Agent: di perangkat, menyimpan data; Manager: server monitoring yang meminta.'],
        ['MIB / OID', 'MIB: struktur data agent; OID: alamat spesifik tiap data (mis. ifInOctets).'],
        ['Polling / Trap', 'Polling: manager bertanya berkala; Trap: agent melapor spontan saat kejadian.'],
        ['Community string', '"Password" SNMP v1/v2c — dikirim teks biasa; alasan pakai SNMPv3.'],
      ],
      diagram: `<pre>        SNMP: MANAGER ↔ AGENT

[Zabbix .99.20] ──GET ifInOctets──▶ [Switch agent]
       ▲  "port5 = 850 Mbps"            │ MIB/OID
       │                               │
       └────── TRAP "link down!" ◀─────┘ (UDP 162)

Polling = angka rutin. Trap = kabar darurat.</pre>`,
      scenario:
        'NOC melihat grafik traffic uplink naik perlahan 3 bulan berturut-turut (data SNMP polling). Mereka upgrade link SEBELUM jenuh — user tidak pernah merasakan lemot. Tanpa SNMP, mereka baru tahu saat user komplain. Monitoring = melihat masa depan.',
      bestPractices:
        'Aktifkan SNMP di semua perangkat dengan community unik per site (atau SNMPv3). Polling interval: 60 detik untuk metrik penting, 5 menit untuk yang lain. Simpan histori minimal 1 tahun untuk analisis tren.',
      security:
        'Jangan pakai community "public/private". Batasi SNMP hanya dari IP manager (ACL) + hanya via VLAN 99. Production wajib SNMPv3 (authPriv) — v2c tanpa enkripsi.',
      challenge:
        'Tentukan 10 OID/metrik yang wajib dimonitor untuk satu distribution switch (traffic, error, CPU, memori, suhu, status port…) dan tentukan polling interval + threshold alert tiap metrik.',
      interviewQ:
        'Q: "Apa bedanya SNMP polling dan trap, kapan memakai masing-masing?" — A: Polling = manager bertanya berkala (untuk metrik/tren: traffic, CPU). Trap = agent melapor spontan (untuk event darurat: link down). Keduanya dipakai: polling untuk grafik, trap untuk alarm cepat.',
      quiz: [
        {
          q: 'Apa peran SNMP dalam monitoring?',
          options: [
            'Mengirim log kejadian',
            'Protokol untuk mengambil data/metrik perangkat (traffic, CPU, suhu) oleh server monitoring',
            'Memberi IP otomatis',
            'Menyamakan jam',
          ],
          answer: 1,
          explain: 'SNMP (UDP 161/162) adalah bahasa monitoring: manager bertanya (GET), agent menjawab atau melapor spontan (TRAP).',
        },
        {
          q: 'Mengapa SNMPv3 disarankan dibanding v2c di production?',
          options: [
            'Lebih cepat',
            'v2c mengirim community string dalam teks biasa (bisa disadap); v3 menambah autentikasi + enkripsi',
            'Lebih murah',
            'v2c sudah tidak ada',
          ],
          answer: 1,
          explain: 'Community string v2c = password telanjang di jaringan; SNMPv3 (authPriv) mengenkripsi dan mengautentikasi — standar keamanan modern.',
        },
        {
          q: 'Apa bedanya syslog dan SNMP?',
          options: [
            'Sama saja',
            'Syslog = perangkat bercerita (event/kejadian); SNMP = manager bertanya (metrik/angka) — komplementer',
            'SNMP lebih modern jadi syslog tidak perlu',
            'Syslog untuk server, SNMP untuk switch saja',
          ],
          answer: 1,
          explain: '"Link down!" via syslog/trap = event; "traffic port 5 = 850 Mbps" via polling = metrik. Monitoring lengkap butuh keduanya.',
        },
      ],
    },
    {
      id: '22.7',
      title: 'HTTP/HTTPS',
      body: `
<p><b>HTTP/HTTPS</b> adalah protokol <b>web</b> — dan di dunia network engineering, ia bukan sekadar "protokol browsing user", melainkan <b>interface management modern</b>: GUI firewall, dashboard monitoring, dan API semuanya berjalan di atasnya.</p>
<h3>HTTP vs HTTPS</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>HTTP (port 80)</th><th>HTTPS (port 443)</th></tr>
<tr><td>Enkripsi</td><td>Tidak — data teks biasa</td><td>Ya (TLS) — terenkripsi</td></tr>
<tr><td>Login admin via…</td><td>DILARANG (credential disadap)</td><td>Wajib</td></tr>
<tr><td>Sertifikat</td><td>Tidak perlu</td><td>Perlu (bisa self-signed untuk internal)</td></tr>
</table></div>
<h3>Peran di Network Management</h3>
<ul>
<li><b>GUI perangkat</b> — FortiGate, switch managed, controller Wi-Fi dikonfigurasi via web (HTTPS). Ini yang dimaksud "FortiGate: jelaskan GUI dan CLI" — GUI untuk visual/orang baru, CLI untuk otomasi/presisi.</li>
<li><b>Dashboard</b> — Zabbix/Grafana diakses via browser (HTTPS).</li>
<li><b>API</b> — otomasi modern (Part 32–35) berbicara ke perangkat via <b>REST API</b> (HTTPS + JSON): "tulis skrip, bukan klik".</li>
<li><b>Captive portal</b> — halaman login Wi-Fi guest (Part 19.9).</li>
</ul>
<h3>Packet Flow HTTPS Sederhana</h3>
<pre>[Browser admin] ──TCP 443──▶ [FortiGate .99.254]
1. TLS handshake: verifikasi sertifikat + sepakati kunci enkripsi
2. HTTP terenkripsi di dalam tunnel TLS
3. Login, klik policy, apply — semua aman dari penyadap
HTTP (80) dilewati langkah 1-2 → semua teks biasa!</pre>
<h3>Sertifikat: Self-Signed vs CA</h3>
<p>Browser protes "Not Secure" jika sertifikat <b>self-signed</b> (dibuat sendiri). Untuk internal, ini <b>wajar</b> — admin bisa install <b>CA internal</b> agar browser percaya. Untuk layanan publik, pakai sertifikat dari CA publik (Let's Encrypt gratis). Jangan biasakan klik "Proceed anyway" tanpa verifikasi — itu melatih mengabaikan peringatan keamanan.</p>
<div class="callout"><div class="t">GUI vs CLI vs API</div><p style="margin:4px 0 0">GUI: cepat dipelajari, lambat diulang (50 switch = 50x klik). CLI: presisi, bisa di-script. API: untuk otomasi skala besar (Ansible/Python, Part 33–35). Engineer profesional menguasai ketiganya dan memilih sesuai skala pekerjaan.</p></div>`,
      terms: [
        ['HTTP/HTTPS', 'Protokol web; HTTPS = HTTP + enkripsi TLS (port 443).'],
        ['TLS', 'Transport Layer Security — enkripsi yang mengamankan HTTPS.'],
        ['REST API', 'Antarmuka otomasi via HTTP(S) + JSON — jembatan ke automation.'],
        ['Self-signed certificate', 'Sertifikat buatan sendiri; browser tidak percaya default — wajar untuk internal.'],
        ['CA', 'Certificate Authority — penerbit sertifikat yang dipercaya.'],
      ],
      diagram: `<pre>        HTTPS SEBAGAI INTERFACE MANAGEMENT

[Browser] ══TLS (443)══▶ [FortiGate GUI .99.254]
[Browser] ══TLS (443)══▶ [Grafana dashboard]
[Script]  ══REST API═══▶ [Perangkat]   ← otomasi (Part 33-35)

Satu protokol, tiga kegunaan: manusia (GUI), visual (dashboard), mesin (API).</pre>`,
      scenario:
        'Admin mengakses GUI switch via HTTP dari Wi-Fi kantor. Seseorang menjalankan sniffer dan mendapatkan credential admin — seminggu kemudian konfigurasi switch berubah misterius. Solusi: matikan HTTP, wajibkan HTTPS, ganti semua credential. Management via HTTP = pintu terbuka.',
      bestPractices:
        'Matikan HTTP management di semua perangkat (hanya HTTPS). Pakai CA internal agar tidak ada peringatan palsu yang diabaikan. Pisahkan akses GUI ke VLAN 99 + VPN untuk remote.',
      security:
        'GUI management adalah target empuk (brute-force). Lindungi: HTTPS wajib, batasi sumber IP, aktifkan MFA bila didukung, dan monitor log login admin.',
      challenge:
        'Bandingkan untuk 3 skenario (konfigurasi 1 switch baru, deploy 50 switch identik, audit policy firewall): kapan memakai GUI, CLI, atau API? Buat tabel keputusan + alasannya.',
      interviewQ:
        'Q: "Kapan kamu memakai GUI, CLI, dan API untuk mengelola perangkat?" — A: GUI untuk belajar/visualisasi dan tugas sekali-jalan; CLI untuk presisi dan pekerjaan berulang via script; API untuk otomasi skala besar (puluhan perangkat) dan integrasi dengan tools. Pilih sesuai skala, bukan kebiasaan.',
      quiz: [
        {
          q: 'Mengapa akses management perangkat wajib HTTPS, bukan HTTP?',
          options: [
            'HTTPS lebih cepat',
            'HTTP mengirim credential dalam teks biasa yang bisa disadap; HTTPS mengenkripsinya via TLS',
            'HTTP tidak bisa menampilkan GUI',
            'Tidak ada bedanya',
          ],
          answer: 1,
          explain: 'Login admin via HTTP = password lewat jaringan telanjang — sama berbahayanya dengan telnet.',
        },
        {
          q: 'Apa peran REST API dalam network engineering modern?',
          options: [
            'Pengganti kabel',
            'Antarmuka otomasi: script (Python/Ansible) mengelola perangkat via HTTPS+JSON tanpa klik manual',
            'Mempercepat internet',
            'Tidak ada peran',
          ],
          answer: 1,
          explain: 'API adalah fondasi automation (Part 33–35): konfigurasi puluhan perangkat via kode, konsisten dan terdokumentasi.',
        },
        {
          q: 'Browser menampilkan peringatan sertifikat self-signed di GUI firewall internal. Sikap yang benar?',
          options: [
            'Klik "proceed" tanpa pikir — sudah biasa',
            'Verifikasi dulu (fingerprint/CA internal), lalu install CA internal agar peringatan valid — jangan membiasakan mengabaikan',
            'Matikan HTTPS saja',
            'Ganti firewall',
          ],
          answer: 1,
          explain: 'Mengabaikan peringatan sertifikat melatih kebiasaan berbahaya (MITM tak terdeteksi); verifikasi + CA internal adalah jalan benar.',
        },
      ],
    },
    {
      id: '22.8',
      title: 'Network Management',
      body: `
<p><b>Network management</b> adalah <b>disiplin mengelola jaringan secara sistematis</b>: bukan sekadar "bisa konfigurasi", tapi punya proses untuk memantau, mengubah, mengamankan, dan mendokumentasikan — model standarnya <b>FCAPS</b>.</p>
<h3>Model FCAPS (ISO)</h3>
<div class="tblwrap"><table>
<tr><th>Huruf</th><th>Bidang</th><th>Contoh Kegiatan</th><th>Tools</th></tr>
<tr><td><b>F</b></td><td>Fault</td><td>Deteksi & respons gangguan</td><td>Zabbix alert, syslog, tiket</td></tr>
<tr><td><b>C</b></td><td>Configuration</td><td>Backup & change control konfigurasi</td><td>RANCID/Oxidized, Git</td></tr>
<tr><td><b>A</b></td><td>Accounting</td><td>Penggunaan resource, billing</td><td>NetFlow, kuota</td></tr>
<tr><td><b>P</b></td><td>Performance</td><td>Tren kapasitas, QoS</td><td>Grafana, SNMP polling</td></tr>
<tr><td><b>S</b></td><td>Security</td><td>Audit akses, patch, policy</td><td>Log auth, vulnerability scan</td></tr>
</table></div>
<h3>Alur Data Lengkap: Device → Dashboard</h3>
<p>Ini arsitektur yang dipakai Part 23–27 (dijelaskan detail di sana, konsepnya di sini):</p>
<pre>[Device: switch/router/FW]
   │ SNMP (metrik) + Syslog (event) + NetFlow (siapa-ke-mana)
   ▼
[Collector: Zabbix server / syslog-ng / flow collector]
   │ normalisasi + simpan
   ▼
[Database: time-series DB]
   │ query
   ▼
[Dashboard: Grafana] ──▶ NOC melihat grafik + alert
   │ threshold terlampaui
   ▼
[Alert: Telegram/email/tiket] ──▶ engineer bertindak</pre>
<h3>Configuration Management</h3>
<p>Konfigurasi perangkat adalah <b>kode</b>: simpan di <b>Git</b>, backup otomatis tiap perubahan (Oxidized/RANCID), dan setiap change di production lewat <b>change request</b> (alasan, langkah, rollback plan). "Konfigurasi hanya ada di perangkat" = bom waktu.</p>
<div class="callout blue"><div class="t">NOC Harian = FCAPS Berjalan</div><p style="margin:4px 0 0">Shift NOC pada dasarnya menjalankan FCAPS: pantau fault (dashboard), eksekusi change terencana (configuration), cek kapasitas (performance), review log akses (security). Memahami FCAPS membuatmu tahu <i>mengapa</i> tiap tugas shift ada.</p></div>`,
      terms: [
        ['Network management', 'Disiplin sistematis mengelola jaringan: model FCAPS.'],
        ['FCAPS', 'Fault, Configuration, Accounting, Performance, Security — 5 bidang management (ISO).'],
        ['Collector', 'Server yang mengumpulkan data mentah dari perangkat (SNMP/syslog/flow).'],
        ['Time-series DB', 'Database untuk data metrik berurutan waktu (grafik).'],
        ['Change request', 'Dokumen resmi usulan perubahan: alasan, langkah, rollback.'],
      ],
      diagram: `<pre>        FCAPS DALAM SATU PANDANGAN

   Fault ←── alert dari── [Collector] ──▶ Performance (tren)
                                │
   Configuration ←── backup ── [Git]     Accounting ←── NetFlow
                                │
   Security ←── audit log ───────┘

Satu arsitektur data, lima kegunaan.</pre>`,
      scenario:
        'Perusahaan tanpa backup konfigurasi: switch distribution mati total dan penggantinya datang kosong — tidak ada yang tahu konfigurasi aslinya. Rekonstruksi dari ingatan: 3 hari + banyak kesalahan. Dengan Oxidized + Git, restore akan memakan 30 menit. Backup konfigurasi bukan opsional.',
      bestPractices:
        'Otomatiskan backup konfigurasi harian ke Git. Setiap change production: change request + backup sebelum + verifikasi sesudah. Satu dashboard untuk fault+performance (jangan 5 tools terpisah tanpa integrasi).',
      security:
        'Backup konfigurasi berisi credential (hash) — simpan di repo privat dengan akses terbatas, enkripsi secret. Audit siapa mengubah konfigurasi kapan (dari syslog + Git log).',
      challenge:
        'Petakan 10 tugas harian NOC ke FCAPS (mis. "cek dashboard alarm" → Fault). Temukan bidang yang tidak tercakup di tempatmu — itulah blind spot yang perlu diperbaiki.',
      interviewQ:
        'Q: "Jelaskan FCAPS dan contoh penerapannya di NOC." — A: Fault (deteksi/respons alarm), Configuration (backup & change control), Accounting (penggunaan/billing), Performance (tren kapasitas), Security (audit & patch). NOC harian = menjalankan kelimanya: pantau, ubah terkontrol, ukur, amankan.',
      quiz: [
        {
          q: 'Apa kepanjangan FCAPS?',
          options: [
            'Fast–Cheap–Accurate–Pretty–Simple',
            'Fault, Configuration, Accounting, Performance, Security',
            'Fiber–Copper–Antenna–Power–Signal',
            'Firewall–Cloud–API–Proxy–Switch',
          ],
          answer: 1,
          explain: 'FCAPS adalah model ISO untuk network management: 5 bidang yang mencakup seluruh siklus pengelolaan jaringan.',
        },
        {
          q: 'Urutan alur data monitoring yang benar adalah…',
          options: [
            'Dashboard → database → collector → device',
            'Device → protocol (SNMP/syslog) → collector → database → dashboard → alert',
            'Alert → device → dashboard',
            'Database → device → dashboard',
          ],
          answer: 1,
          explain: 'Data mengalir dari perangkat via protokol ke collector, disimpan di DB, divisualkan di dashboard, dan memicu alert saat threshold terlampaui.',
        },
        {
          q: 'Mengapa konfigurasi perangkat harus di-backup ke Git?',
          options: [
            'Agar terlihat modern',
            'Perangkat bisa mati/rusak — tanpa backup, rekonstruksi konfigurasi lambat dan rawan salah; Git memberi versi + riwayat perubahan',
            'Git mempercepat switch',
            'Tidak perlu sebenarnya',
          ],
          answer: 1,
          explain: 'Konfigurasi = kode: butuh versioning, backup otomatis, dan riwayat siapa-mengubah-apa untuk recovery dan audit.',
        },
      ],
    },
    {
      id: '22.9',
      title: 'IPAM Concept',
      body: `
<p><b>IPAM</b> (IP Address Management) adalah <b>sistem pencatatan terpusat</b> untuk semua alokasi IP: subnet apa dipakai di mana, IP mana statis/dinamis, siapa owner-nya, dan apa statusnya. Ini "buku tanah" alamat IP perusahaan.</p>
<h3>Masalah yang Diselesaikan</h3>
<ul>
<li><b>Konflik & duplikat</b> — tanpa catatan, dua tim memberi IP yang sama.</li>
<li><b>IP misterius</b> — "192.168.30.47 itu apa ya?" — di IPAM terjawab dalam 5 detik.</li>
<li><b>Perencanaan</b> — kapasitas subnet terlihat (VLAN 20 sudah 90% → saatnya perluas).</li>
<li><b>Audit & forensik</b> — insiden butuh tahu siapa memakai IP X pada waktu Y (gabung dengan log DHCP).</li>
</ul>
<h3>Isi Catatan IPAM (per IP/subnet)</h3>
<div class="tblwrap"><table>
<tr><th>Kolom</th><th>Contoh</th></tr>
<tr><td>Subnet & VLAN</td><td>192.168.20.0/24 — VLAN 20 OFFICE</td></tr>
<tr><td>IP</td><td>192.168.20.21</td></tr>
<tr><td>Status</td><td>Reserved (printer)</td></tr>
<tr><td>Hostname</td><td>PRN-FIN-01</td></tr>
<tr><td>MAC</td><td>aa:bb:cc:dd:ee:ff</td></tr>
<tr><td>Owner</td><td>Tim Finance / IT</td></tr>
<tr><td>Update terakhir</td><td>2026-09-01 oleh Andi</td></tr>
</table></div>
<h3>Dari Spreadsheet ke Tools</h3>
<p>Mulai dari <b>spreadsheet</b> (cukup untuk lab & kantor kecil — ip-plan.md kita di Part 20 adalah IPAM mini). Tumbuh ke tools: <b>phpIPAM / NetBox</b> (open source, gratis) hingga komersial (Infoblox). Prinsipnya sama: <b>satu sumber kebenaran</b> yang selalu update.</p>
<h3>Aturan Operasional</h3>
<ol>
<li><b>Tidak ada IP tanpa catatan</b> — alokasi baru wajib entri IPAM dulu.</li>
<li><b>Rekonsiliasi berkala</b> — scan jaringan (nmap) vs IPAM tiap kuartal; selisih = investigasi.</li>
<li><b>Integrasi DHCP/DNS</b> — idealnya IPAM terhubung dengan DHCP & DNS agar konsisten otomatis.</li>
</ol>
<div class="callout blue"><div class="t">IPAM = Fondasi Semua Part</div><p style="margin:4px 0 0">IP plan (20.2), DHCP scope (22.1), DNS zone (22.2), dan monitoring (23–27) semuanya merujuk ke data yang sama. IPAM yang berantakan = semua layanan di atasnya rapuh. Disiplin kecil, dampak besar.</p></div>`,
      terms: [
        ['IPAM', 'IP Address Management — pencatatan terpusat alokasi IP: siapa, apa, di mana, status.'],
        ['Sumber kebenaran tunggal', 'Satu data acuan yang dipercaya semua pihak — tidak ada versi ganda.'],
        ['Rekonsiliasi', 'Pencocokan berkala data IPAM vs kondisi aktual jaringan (scan).'],
        ['NetBox / phpIPAM', 'Tools IPAM open source populer untuk dokumentasi IP & infrastruktur.'],
      ],
      diagram: `<pre>        IPAM SEBAGAI SUMBER KEBENARAN

              ┌──────── [ IPAM ] ────────┐
              │  subnet, IP, owner,      │
              │  status, histori         │
              ▼                         ▼
   [DHCP scope] ← konsisten → [DNS zone]
              ▼                         ▼
   [Monitoring: "IP ini = PRN-FIN-01 milik Finance"]

Satu data, dipakai semua layanan.</pre>`,
      scenario:
        'Insiden keamanan: log firewall menunjukkan serangan dari 192.168.20.77. Tanpa IPAM, tim butuh 1 jam mencari tahu itu perangkat siapa. Dengan IPAM: 10 detik — "laptop reservasi tamu, MAC X, dipinjam vendor Y". Kecepatan identifikasi = kecepatan respons.',
      bestPractices:
        'Mulai dari spreadsheet yang disiplin — lebih baik daripada tool canggih yang tidak diupdate. Tunjuk satu owner IPAM. Rekonsiliasi kuartalan dengan network scan.',
      security:
        'IPAM berisi peta lengkap aset — akses terbatas untuk tim network/keamanan. Backup IPAM seperti backup konfigurasi (kehilangan IPAM = kehilangan peta).',
      challenge:
        'Buat IPAM mini untuk lab Part 20: spreadsheet 5 kolom × 15 baris (campuran statis, reservation, DHCP pool) untuk VLAN 20 & 30. Lalu tulis SOP 5 langkah "cara menambah IP baru".',
      interviewQ:
        'Q: "Apa itu IPAM dan mengapa penting?" — A: Sistem pencatatan terpusat alokasi IP (subnet, status, owner, histori). Penting untuk mencegah konflik/duplikat, mempercepat identifikasi perangkat saat insiden, merencanakan kapasitas, dan menjadi sumber kebenaran tunggal bagi DHCP, DNS, dan monitoring.',
      quiz: [
        {
          q: 'Apa fungsi utama IPAM?',
          options: [
            'Mempercepat internet',
            'Pencatatan terpusat alokasi IP (siapa-apa-di mana-status) sebagai sumber kebenaran tunggal',
            'Menggantikan DHCP',
            'Mengenkripsi traffic',
          ],
          answer: 1,
          explain: 'IPAM = buku tanah IP: mencegah konflik, mempercepat identifikasi perangkat, dan menjadi acuan DHCP/DNS/monitoring.',
        },
        {
          q: 'Apa itu rekonsiliasi IPAM?',
          options: [
            'Menghapus semua data IPAM',
            'Pencocokan berkala data IPAM vs hasil scan aktual — selisihnya diinvestigasi',
            'Mengganti semua IP',
            'Backup database',
          ],
          answer: 1,
          explain: 'Jaringan berubah terus; scan vs catatan menemukan IP liar, catatan usang, atau perangkat tak terdaftar.',
        },
        {
          q: 'Aturan operasional IPAM yang paling penting adalah…',
          options: [
            'Update setahun sekali',
            'Tidak ada alokasi IP tanpa pencatatan — entri dulu, pakai kemudian',
            'Hanya admin senior boleh baca',
            'Simpan di kertas',
          ],
          answer: 1,
          explain: 'Disiplin "catat dulu" menjaga IPAM tetap menjadi sumber kebenaran; tanpa itu ia cepat menjadi dokumen mati.',
        },
      ],
    },
  ],
};
