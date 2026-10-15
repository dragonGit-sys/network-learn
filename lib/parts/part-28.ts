// Part 28 — Network Troubleshooting (Fase 6).
import type { Part } from './types';

export const part28: Part = {
  id: '28',
  number: 'PART 28',
  title: 'Network Troubleshooting',
  phaseId: 'fase-6',
  description: 'Metodologi troubleshooting sistematis dan seluruh tool diagnosis: ping, traceroute, ARP, routing table, packet capture, Wireshark, plus 15 skenario latihan.',
  repoFolder: 'part-28-network-troubleshooting',
  objectives: [
    'Menerapkan metodologi troubleshooting sistematis (bottom-up, top-down, divide and conquer) dan memilih pendekatan yang tepat untuk tiap gejala.',
    'Menggunakan tool diagnosis inti — ping, traceroute, ARP, MAC table, routing table, DNS/DHCP check, packet capture, Wireshark — serta membaca outputnya dengan benar.',
    'Mendiagnosis gangguan umum (DHCP gagal, DNS gagal, VLAN/trunk salah, NAT salah, firewall block, MTU, loop, duplicate IP) berlapis mengikuti model OSI.',
    'Menyelesaikan 15 skenario troubleshooting dengan pola gejala → hipotesis → diagnosis → solusi seperti engineer profesional.',
  ],
  prerequisites: 'Part 01–27 (terutama OSI & TCP/IP, IP addressing, VLAN, DHCP/DNS, routing, NAT, dan firewall). Part ini adalah "ujian lapangan" seluruh konsep sebelumnya.',
  subbabs: [
    {
      id: '28.1',
      title: 'Troubleshooting Methodology',
      body: `<p><b>Troubleshooting</b> adalah proses sistematis menemukan <b>penyebab utama</b> (root cause) sebuah gangguan jaringan, lalu memperbaikinya tanpa menimbulkan masalah baru. Kata kuncinya: <i>sistematis</i>. Engineer junior menebak-nebak dan mengubah banyak hal sekaligus ("coba restart", "coba ganti kabel", "coba reset"); engineer profesional mengikuti metodologi sehingga setiap langkah mempersempit kemungkinan.</p>
<h3>Mengapa Metodologi (Bukan Tebak-tebakan)?</h3>
<ul>
<li><b>Tebak-tebakan mengubah banyak variabel sekaligus</b> — kalau masalahnya hilang, kamu tidak tahu perubahan mana yang memperbaikinya, dan masalah bisa kembali.</li>
<li><b>Tebak-tebakan berisiko:</b> restart device production di jam sibuk atau menghapus konfigurasi "sekadar coba" bisa memperparah outage.</li>
<li><b>Metodologi bisa diulang & diajarkan:</b> tim NOC bekerja dengan runbook yang sama sehingga siapa pun yang piket bisa menangani tiket dengan cara yang sama.</li>
</ul>
<h3>Langkah Universal Troubleshooting</h3>
<ol>
<li><b>Definisikan masalah dengan presisi.</b> Bukan "internet mati", melainkan: siapa yang terdampak (1 PC / 1 VLAN / seluruh site)? Sejak kapan? Apa yang berubah terakhir (change terakhir)? Gejala persisnya apa (tidak bisa buka web? ping gagal? lambat)?</li>
<li><b>Kumpulkan fakta.</b> Tanya user, cek monitoring (Zabbix — Part 23), lihat log device. Fakta > asumsi.</li>
<li><b>Buat hipotesis</b> (dugaan terdidik): "kemungkinan besar masalah di Layer 3 — PC tidak dapat gateway" — berdasarkan fakta, bukan firasat.</li>
<li><b>Rencanakan pengujian</b> yang bisa membuktikan/membantah hipotesis dengan cepat dan aman.</li>
<li><b>Uji satu perubahan dalam satu waktu.</b> Aturan emas: jangan pernah mengubah dua hal sekaligus saat mendiagnosis.</li>
<li><b>Terapkan solusi</b> setelah hipotesis terbukti, mulai dari yang paling tidak berisiko.</li>
<li><b>Verifikasi & dokumentasikan:</b> pastikan masalah benar-benar hilang (bukan kebetulan), catat root cause + solusi untuk runbook.</li>
</ol>
<div class="callout"><div class="t">Aturan Emas NOC</div><p style="margin:4px 0 0"><b>Satu perubahan dalam satu waktu, dan selalu tahu cara membatalkannya (rollback).</b> Sebelum mengubah konfigurasi production, catat konfigurasi awalnya. Di lab GNS3 kamu bebas merusak — di production, tidak.</p></div>
<h3>Pertanyaan Pembuka yang Selalu Ditanyakan</h3>
<div class="tblwrap"><table>
<tr><th>Pertanyaan</th><th>Mengapa Penting</th></tr>
<tr><td>Siapa/apa saja yang terdampak?</td><td>Scope: 1 user = masalah lokal; semua user = masalah infrastruktur</td></tr>
<tr><td>Sejak kapan? Apakah sebelumnya normal?</td><td>Membedakan "baru rusak" vs "memang belum pernah jalan"</td></tr>
<tr><td>Apa yang berubah terakhir?</td><td>Sebagian besar outage disebabkan oleh change terakhir</td></tr>
<tr><td>Apakah masalahnya konsisten atau kadang-kadang?</td><td>Intermittent (kadang-kadang) → curigai fisik/loop/beban; konsisten → curigai konfigurasi</td></tr>
</table></div>`,
      terms: [
        ['Root cause', 'Penyebab utama yang sebenarnya — bukan gejalanya. Memperbaiki gejala tanpa root cause membuat masalah kembali.'],
        ['Symptom', 'Gejala yang terlihat user ("internet lambat"); gejala adalah petunjuk, bukan diagnosis.'],
        ['Fault isolation', 'Mempersempit lokasi kesalahan: dari "seluruh jaringan" menjadi "satu kabel / satu konfigurasi".'],
        ['Workaround', 'Solusi sementara agar layanan jalan dulu sementara root cause dicari (mis. pindah ke link backup).'],
        ['Runbook', 'Dokumen langkah baku penanganan gangguan yang dipakai tim NOC agar konsisten.'],
      ],
      diagram: `<pre>        ALUR TROUBLESHOOTING UNIVERSAL

  Masalah dilaporkan
        │
        ▼
  1. DEFINISIKAN ── siapa terdampak? sejak kapan? apa gejalanya?
        │
        ▼
  2. KUMPULKAN FAKTA ── tanya user, cek monitoring, lihat log
        │
        ▼
  3. HIPOTESIS ── dugaan terdidik ("kemungkinan Layer 3")
        │
        ▼
  4. UJI ── satu perubahan dalam satu waktu
        │
   ┌────┴────┐
   │ Terbukti? │
   └──┬───┬──┘
   Ya │   │ Tidak → kembali ke langkah 3 (hipotesis baru)
      ▼
  5. SOLUSI (mulai dari yang paling aman)
        │
        ▼
  6. VERIFIKASI + DOKUMENTASI → tutup tiket</pre>`,
      scenario: 'Tiket NOC: "Internet lambat di lantai 3 sejak jam 9 pagi." Engineer junior langsung me-restart core switch — 200 user ikut terputus 5 menit, masalah tetap ada. Engineer senior bertanya dulu: ternyata hanya VLAN 20 OFFICE lantai 3 yang lambat, mulai tepat jam 9 — jam masuknya shift gudang yang baru memasang 20 CCTV baru di VLAN yang salah. Root cause: broadcast & traffic CCTV membanjiri VLAN office. Solusi: pindahkan CCTV ke VLAN 10. Moral: 10 menit bertanya menghemat 5 menit outage yang tidak perlu.',
      bestPractices: 'Jangan pernah mulai dari solusi ("coba restart dulu"). Mulai dari definisi masalah. Catat setiap temuan — troubleshooting yang baik menghasilkan dokumentasi, bukan hanya perbaikan.',
      security: 'Saat troubleshooting, godaan terbesar adalah "buka semua dulu biar cepat" (matikan firewall, allow any-any). Itu melanggar prinsip least privilege dan bisa membuka celah. Uji dengan policy sempit dan sementara, lalu kembalikan.',
      challenge: 'Tulis ulang 3 tiket imajiner ("Wi-Fi lemot", "server tidak bisa diakses", "VPN putus") menjadi definisi masalah yang presisi: siapa terdampak, sejak kapan, gejala persis, dan apa yang berubah terakhir.',
      interviewQ: 'Q: "User lapor internet mati. Apa langkah pertamamu?" — A: Bukan langsung perbaiki, melainkan definisikan: tanya scope (siapa terdampak), sejak kapan, gejala persis, dan change terakhir — lalu kumpulkan fakta dari monitoring sebelum menyentuh konfigurasi apa pun.',
      quiz: [
        { q: 'Mengapa "satu perubahan dalam satu waktu" menjadi aturan emas troubleshooting?', options: ['Agar terlihat sibuk', 'Agar jelas perubahan mana yang memperbaiki masalah dan mudah rollback', 'Agar tiket cepat ditutup', 'Itu aturan ISP'], answer: 1, explain: 'Mengubah banyak hal sekaligus membuat root cause tidak terlacak dan rollback sulit. Satu perubahan = satu kesimpulan.' },
        { q: 'Pertanyaan paling penting saat menerima laporan gangguan adalah…', options: ['Siapa yang salah', 'Siapa terdampak, sejak kapan, gejala persis, apa yang berubah terakhir', 'Berapa umur device', 'Siapa vendornya'], answer: 1, explain: 'Empat pertanyaan ini menentukan scope, timeline, dan kandidat root cause sebelum diagnosis dimulai.' },
        { q: 'Apa beda symptom dengan root cause?', options: ['Sama saja', 'Symptom adalah gejala yang terlihat; root cause adalah penyebab utama yang harus diperbaiki agar masalah tidak kembali', 'Root cause selalu di Layer 1', 'Symptom hanya untuk user'], answer: 1, explain: 'Memperbaiki symptom (mis. restart) tanpa root cause (mis. loop) membuat gangguan berulang.' },
      ],
    },
    {
      id: '28.2',
      title: 'OSI Troubleshooting',
      body: `<p>Model OSI bukan sekadar teori ujian — ia adalah <b>peta troubleshooting</b>. Setiap layer punya "wilayah" dan gejala khasnya sendiri. Saat kamu bisa memetakan gejala ke layer, kamu langsung tahu <i>di mana</i> harus mencari, alih-alih memeriksa seluruh jaringan.</p>
<h3>Peta Gejala per Layer</h3>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Contoh Gejala Khas</th><th>Tool Pemeriksa</th></tr>
<tr><td>1 — Physical</td><td>Link down total, lampu port mati, error CRC naik, intermittent</td><td>Cek kabel/port, <code>show interfaces status</code></td></tr>
<tr><td>2 — Data Link</td><td>MAC tidak learned, VLAN salah, loop/broadcast storm, trunk mismatch</td><td><code>show mac address-table</code>, <code>show vlan brief</code></td></tr>
<tr><td>3 — Network</td><td>Ping gateway gagal, "destination unreachable", antar-subnet tidak tersambung</td><td><code>ping</code>, <code>traceroute</code>, <code>show ip route</code></td></tr>
<tr><td>4 — Transport</td><td>Ping OK tapi aplikasi tidak connect; koneksi terputus di tengah</td><td><code>telnet IP port</code>, cek firewall, Wireshark (SYN tanpa balasan)</td></tr>
<tr><td>7 — Application</td><td>Semua konektivitas OK tapi login gagal / DNS tidak resolve</td><td><code>nslookup</code>/<code>dig</code>, cek layanan server</td></tr>
</table></div>
<h3>Cara Memakai Peta Ini</h3>
<p>Prinsipnya: <b>temukan layer terendah yang bermasalah — karena layer atas bergantung pada layer bawah.</b> Tidak ada gunanya memeriksa konfigurasi DNS (Layer 7) kalau kabelnya (Layer 1) saja belum nyambung. Sebaliknya, kalau ping ke server (Layer 3) sukses tetapi website tidak terbuka, kamu boleh <i>melewati</i> Layer 1–3 dan langsung fokus ke Layer 4/7.</p>
<div class="callout blue"><div class="t">Packet Flow & OSI</div><p style="margin:4px 0 0">Ingat alur paket: aplikasi membentuk data (L7) → TCP membungkus (L4) → IP memberi alamat (L3) → Ethernet memberi MAC & VLAN tag (L2) → kabel mengirim bit (L1). Troubleshooting adalah perjalanan <i>terbalik</i>: memastikan setiap pembungkus ini benar dari bawah ke atas (atau dari atas ke bawah — lihat 28.3 & 28.4).</p></div>
<h3>Contoh Pemetaan Cepat</h3>
<ul>
<li>"Semua PC di satu switch mati total" → curiga <b>Layer 1/2</b> (uplink switch, power).</li>
<li>"PC dapat IP 169.254.x.x" → <b>Layer 2/3</b>: DHCP discover tidak sampai ke server (VLAN? relay? server down?).</li>
<li>"Bisa ping 8.8.8.8 tapi tidak bisa buka google.com" → <b>Layer 7</b>: DNS.</li>
<li>"Ping ke server kadang RTO" → <b>Layer 1/2/3</b>: kabel, duplex, congestion, atau routing tidak stabil.</li>
</ul>`,
      terms: [
        ['Encapsulation', 'Proses pembungkusan data lapis demi lapis (L7→L1) saat dikirim; dibuka lapis demi lapis (L1→L7) saat diterima.'],
        ['Fault domain', 'Wilayah layer/perangkat tempat kesalahan berada — hasil dari pemetaan gejala ke layer.'],
      ],
      diagram: `<pre>   GEJALA → LAYER → TOOL (baca dari bawah ke atas)

   L7  Aplikasi error, DNS gagal        → nslookup, dig, cek layanan
   L4  Ping OK, aplikasi tak connect    → telnet IP port, cek firewall
   L3  Ping gateway gagal               → ping, traceroute, show ip route
   L2  MAC tak learned, VLAN salah      → show mac address-table, show vlan
   L1  Link down, lampu mati, CRC error → cek kabel/port/SFP, show interfaces

   Aturan: perbaiki layer TERENDAH yang rusak dulu —
   layer atas tidak akan pernah jalan kalau fondasinya rusak.</pre>`,
      scenario: 'User: "Aplikasi kasir error!" Panik, semua orang menatap server. Engineer memetakan: ping ke server OK (L3 aman), telnet ke port aplikasi gagal (L4 bermasalah) → ternyata firewall baru semalam memblokir port aplikasi. Tanpa peta OSI, tim bisa menghabiskan 2 jam memeriksa server yang sebenarnya sehat.',
      bestPractices: 'Biasakan menyebut layer saat mendiskusikan masalah ("ini kelihatannya masalah L2, VLAN tagging"). Bahasa layer membuat komunikasi tim NOC presisi dan cepat.',
      security: 'Pemetaan layer juga membantu keamanan: serangan bisa menarget layer spesifik (ARP spoofing di L2, IP spoofing di L3). Mengenali layer serangan = tahu di mana memasang pertahanan.',
      challenge: 'Ambil 5 keluhan user imajiner dan petakan masing-masing ke satu layer OSI + tool pemeriksanya. Bandingkan dengan tabel di atas — apakah tebakanmu konsisten?',
      interviewQ: 'Q: "Ping ke server berhasil tapi aplikasi tidak bisa diakses. Di layer mana kamu mulai memeriksa?" — A: Layer 4 (transport): ping hanya membuktikan ICMP/Layer 3 jalan. Cek apakah port TCP aplikasi terbuka (telnet), lalu firewall, lalu Layer 7 (layanan aplikasinya sendiri).',
      quiz: [
        { q: 'Mengapa kita memperbaiki layer terendah yang bermasalah terlebih dahulu?', options: ['Karena layer 1 paling murah', 'Karena layer atas bergantung pada layer bawah — fondasi rusak membuat semuanya gagal', 'Karena itu urutan alfabet', 'Agar cepat pulang'], answer: 1, explain: 'Tiap layer dibangun di atas layer di bawahnya; DNS (L7) tidak akan jalan bila kabel (L1) putus.' },
        { q: 'Gejala "bisa ping 8.8.8.8 tapi tidak bisa buka google.com" mengarah ke layer…', options: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 7 (DNS/aplikasi)'], answer: 3, explain: 'Konektivitas IP (L3) terbukti jalan via ping; yang gagal adalah resolusi nama → DNS di Layer 7.' },
        { q: 'PC mendapat IP 169.254.x.x. Ini gejala di layer…', options: ['Layer 7', 'Layer 2/3 — DHCP gagal, kemungkinan VLAN/relay/server', 'Layer 4', 'Bukan masalah jaringan'], answer: 1, explain: '169.254.x.x (APIPA) artinya DHCP Discover tidak mendapat jawaban — masalah di jalur L2 ke server DHCP atau servernya sendiri.' },
      ],
    },
    {
      id: '28.3',
      title: 'Bottom-Up',
      body: `<p><b>Bottom-up</b> adalah pendekatan troubleshooting yang dimulai dari <b>Layer 1 (fisik) lalu naik</b> ke atas: kabel → switch/VLAN → IP/routing → aplikasi. Ibarat memeriksa fondasi rumah dulu sebelum menyalahkan cat dindingnya.</p>
<h3>Kapan Pendekatan Ini Tepat?</h3>
<ul>
<li><b>Gangguan total / link down:</b> "satu gedung mati total", "port switch mati", lampu link padam.</li>
<li><b>Perangkat baru dipasang</b> dan belum pernah jalan — verifikasi fondasi dulu.</li>
<li><b>Gejala intermittent</b> (kadang putus): curiga kuat ke Layer 1/2 (kabel, konektor, duplex).</li>
<li>Kamu <b>tidak punya petunjuk awal</b> sama sekali — mulai dari yang paling dasar itu aman.</li>
</ul>
<h3>Alur Bottom-Up Praktis</h3>
<ol>
<li><b>L1:</b> Apakah kabel terpasang? Lampu link nyala? <code>show interfaces status</code> — status <i>connected</i>? Ada CRC/error counter naik?</li>
<li><b>L2:</b> Apakah MAC address perangkat muncul di <code>show mac address-table</code>? Port di VLAN yang benar? Trunk membawa VLAN yang dibutuhkan?</li>
<li><b>L3:</b> Apakah IP address benar & satu subnet dengan gateway? <code>ping</code> gateway berhasil? <code>show ip route</code> ada rute?</li>
<li><b>L4/L7:</b> Baru sekarang cek port aplikasi & DNS.</li>
</ol>
<p><b>Alasan urutan ini:</b> setiap langkah yang lolos <i>mengeliminasi</i> satu layer dari daftar tersangka. Kalau L1–L3 lolos semua, kamu yakin masalahnya di atas — tidak perlu kembali memeriksa kabel lagi.</p>
<div class="callout"><div class="t">Kekurangan Bottom-Up</div><p style="margin:4px 0 0">Bisa lambat kalau masalahnya ternyata di Layer 7 (kamu memeriksa 6 layer "sehat" dulu). Untuk kasus "sebagian layanan error", top-down (28.4) atau divide-and-conquer (28.5) biasanya lebih cepat.</p></div>`,
      terms: [
        ['Bottom-up', 'Troubleshooting dari Layer 1 naik ke Layer 7.'],
        ['Link status', 'Kondisi fisik port: connected / notconnect / errdisable — dibaca via show interfaces status.'],
      ],
      diagram: `<pre>   BOTTOM-UP: mulai dari fondasi, naik ke atas

   L1  kabel? lampu link? ──► show interfaces status
    │   OK? lanjut naik
   L2  MAC learned? VLAN benar? ──► show mac address-table
    │   OK? lanjut naik
   L3  IP benar? ping gateway? ──► ping, show ip route
    │   OK? lanjut naik
   L4  port aplikasi terbuka? ──► telnet IP port
    │
   L7  DNS? layanan jalan? ──► nslookup, cek server

   Layer pertama yang GAGAL = lokasi masalah.</pre>`,
      scenario: 'Satu rak server "mati total" setelah maintenance malam. Tim panik memeriksa konfigurasi. Engineer bottom-up: cek fisik dulu — ternyata teknisi semalam tidak sengaja menekan tombol power strip? Bukan. Kabel uplink core switch terlepas setengah (lampu link mati sebelah). 2 menit colok ulang: semua normal. Fondasi dulu, selalu.',
      bestPractices: 'Untuk gangguan total, disiplin mulai dari L1 meski "kelihatannya" masalah software. Statistik lapangan: sebagian besar "jaringan mati total" adalah masalah fisik (kabel, power, SFP).',
      security: 'Pemeriksaan fisik juga pemeriksaan keamanan: port asing yang tiba-tiba connected bisa berarti perangkat liar terpasang (rogue device) — cocokkan dengan port-security (Part 29).',
      challenge: 'Simulasikan di GNS3: cabut kabel antara PC dan switch. Jalankan alur bottom-up langkah demi langkah dan catat di layer mana kamu berhenti. Lalu pasang kembali dan verifikasi.',
      interviewQ: 'Q: "Kapan kamu memilih bottom-up dibanding top-down?" — A: Saat gangguannya total (link down), saat perangkat baru belum pernah jalan, atau saat gejala intermittent yang mengarah ke fisik — karena fondasi harus diverifikasi dulu.',
      quiz: [
        { q: 'Bottom-up dimulai dari…', options: ['Layer 7 aplikasi', 'Layer 1 fisik, lalu naik', 'Layer 3 tengah', 'Layer acak'], answer: 1, explain: 'Bottom-up = fondasi dulu: kabel/port (L1) → switching (L2) → IP (L3) → aplikasi.' },
        { q: 'Kasus paling cocok untuk bottom-up adalah…', options: ['Satu website tidak bisa dibuka', 'Satu gedung mati total / link down', 'Email lambat', 'DNS lambat'], answer: 1, explain: 'Gangguan total hampir selalu berakar di Layer 1/2 — bottom-up menemukan itu paling cepat.' },
        { q: 'Kelemahan utama bottom-up adalah…', options: ['Tidak bisa dipakai di Cisco', 'Lambat bila masalah ternyata di layer atas (mis. aplikasi)', 'Merusak konfigurasi', 'Butuh internet'], answer: 1, explain: 'Kamu memeriksa banyak layer sehat dulu sebelum sampai ke layer bermasalah — untuk kasus aplikasi, top-down lebih cepat.' },
      ],
    },
    {
      id: '28.4',
      title: 'Top-Down',
      body: `<p><b>Top-down</b> adalah kebalikan bottom-up: mulai dari <b>Layer 7 (aplikasi) lalu turun</b> ke bawah. Cocok ketika user melaporkan masalah pada <i>layanan tertentu</i> sementara jaringan secara umum terlihat sehat.</p>
<h3>Kapan Pendekatan Ini Tepat?</h3>
<ul>
<li><b>"Aplikasi X error"</b> — user bisa browsing, bisa ping, tapi satu aplikasi/layanan gagal.</li>
<li><b>Sebagian layanan mati</b> (email down, tapi web jalan) — infrastruktur dasar terbukti hidup.</li>
<li>Kamu <b>menduga masalah di server/layanan</b>, bukan di jaringan.</li>
</ul>
<h3>Alur Top-Down Praktis</h3>
<ol>
<li><b>L7:</b> Apakah layanan servernya sendiri jalan? Coba akses dari server lokal (bypass jaringan). Cek DNS: <code>nslookup</code> resolve?</li>
<li><b>L4:</b> Apakah port TCP aplikasi bisa dijangkau? <code>telnet 192.168.30.10 80</code> — connect atau timeout?</li>
<li><b>L3:</b> Apakah routing ke server ada? <code>traceroute</code> ke server — berhenti di mana?</li>
<li><b>L2/L1:</b> Baru turun ke sini bila langkah atas gagal total.</li>
</ol>
<p><b>Alasan urutan ini:</b> kalau aplikasinya memang mati di server, kamu menemukannya dalam 2 menit tanpa menyentuh satu pun kabel. Top-down menghemat waktu justru karena <i>tidak</i> memeriksa fondasi yang kemungkinan besar sehat.</p>
<div class="callout blue"><div class="t">Jebakan Top-Down</div><p style="margin:4px 0 0">Jangan berasumsi "jaringan pasti sehat" hanya karena satu aplikasi lain jalan. Aplikasi yang jalan bisa lewat jalur berbeda (jalur ke server A ≠ jalur ke server B). Selalu verifikasi, jangan berasumsi.</p></div>`,
      terms: [
        ['Top-down', 'Troubleshooting dari Layer 7 turun ke Layer 1.'],
        ['Service dependency', 'Ketergantungan layanan pada layanan lain (aplikasi → database → jaringan) — top-down menelusurinya dari atas.'],
      ],
      diagram: `<pre>   TOP-DOWN: mulai dari layanan, turun ke bawah

   L7  layanan server jalan? DNS resolve? ──► nslookup, cek di server lokal
    │   Gagal? → masalah di sini. OK? turun.
   L4  port TCP terbuka? ──► telnet IP port
    │   Gagal? → firewall / layanan mati. OK? turun.
   L3  rute ke server ada? ──► traceroute, show ip route
    │   Gagal? → routing. OK? turun.
   L2/L1  VLAN? kabel? ──► show vlan, show interfaces

   Berhenti di layer pertama yang GAGAL dari atas.</pre>`,
      scenario: 'User: "Tidak bisa buka aplikasi inventory!" Tapi internet & email normal. Engineer top-down: buka aplikasi dari servernya langsung → error juga (bukan jaringan!). Ternyata service database berhenti setelah update semalam. 10 menit selesai — tanpa menyentuh satu pun konfigurasi jaringan.',
      bestPractices: 'Untuk laporan "aplikasi error", selalu uji dari sedekat mungkin ke server dulu (di server itu sendiri / satu subnet). Ini memisahkan masalah aplikasi vs jaringan dalam satu langkah.',
      security: 'Top-down sering menyentuh server langsung — pastikan kamu memakai akun dengan hak minimal (least privilege, Part 29) dan tidak mengubah konfigurasi server di luar wewenangmu.',
      challenge: 'Di lab: matikan service web di sebuah VM server (bukan jaringannya). Minta temanmu melakukan top-down dan catat berapa langkah sampai ia menyimpulkan "servernya yang mati, bukan jaringan".',
      interviewQ: 'Q: "User bisa browsing tapi tidak bisa buka aplikasi kasir. Pendekatanmu?" — A: Top-down: verifikasi layanan di sisi server dulu (L7), lalu port TCP (L4) — karena konektivitas umum (L1–L3) terbukti sehat dari browsing yang jalan.',
      quiz: [
        { q: 'Top-down paling tepat ketika…', options: ['Seluruh gedung mati total', 'Satu aplikasi error sementara jaringan umum sehat', 'Kabel putus', 'Listrik padam'], answer: 1, explain: 'Gejala terlokalisasi di layanan → mulai dari atas (aplikasi) lebih cepat daripada memeriksa fondasi.' },
        { q: 'Langkah pertama top-down untuk "aplikasi tidak bisa diakses" adalah…', options: ['Ganti kabel server', 'Verifikasi layanan di sisi server / DNS (Layer 7)', 'Restart router', 'Cek MAC table'], answer: 1, explain: 'Uji sedekat mungkin ke sumber layanan dulu untuk memisahkan masalah aplikasi vs jaringan.' },
        { q: 'Jebakan utama top-down adalah…', options: ['Terlalu cepat', 'Berasumsi jaringan pasti sehat karena aplikasi lain jalan — padahal jalurnya bisa berbeda', 'Butuh Wireshark', 'Tidak bisa di Linux'], answer: 1, explain: 'Jalur ke server A dan server B bisa berbeda; "jaringan sehat" harus diverifikasi per tujuan, bukan diasumsikan.' },
      ],
    },
    {
      id: '28.5',
      title: 'Divide and Conquer',
      body: `<p><b>Divide and conquer</b> (bagi dan taklukkan) adalah pendekatan <b>mulai dari tengah</b> — biasanya Layer 3 — lalu "membelah" masalah menjadi dua: kalau titik tengah sehat, masalah ada di separuh atas; kalau titik tengah rusak, masalah ada di separuh bawah. Ini adalah pendekatan <b>favorit NOC</b> karena paling cepat mengeliminasi separuh kemungkinan dalam satu tes.</p>
<h3>Mengapa Mulai dari Tengah (Layer 3)?</h3>
<p><b>Ping ke gateway</b> adalah "titik tengah" paling populer, dan ini alasannya:</p>
<ul>
<li>Kalau <b>ping gateway SUKSES</b> → L1–L3 lokal sehat (kabel, switch, VLAN, IP, ARP semua beres). Masalah ada di <i>atas/lebih jauh</i>: routing ke tujuan, NAT, firewall, DNS, atau server tujuan.</li>
<li>Kalau <b>ping gateway GAGAL</b> → masalah ada di <i>lokal/bawah</i>: kabel, port, VLAN, IP address, atau gateway-nya sendiri yang down.</li>
</ul>
<p>Satu perintah, separuh jaringan tereliminasi. Itulah kekuatannya.</p>
<h3>Contoh Pembelahan Lanjutan</h3>
<ol>
<li>Ping gateway <b>gagal</b> → belah lagi: cek <code>arp -a</code> — ada MAC gateway? Tidak ada → masalah L2 (VLAN/kabel). Ada → masalah di gateway-nya.</li>
<li>Ping gateway <b>sukses</b> tapi ping 8.8.8.8 gagal → belah: <code>traceroute 8.8.8.8</code> — berhenti di hop ke berapa? Di router edge → curiga NAT/routing/firewall edge.</li>
<li>Ping 8.8.8.8 <b>sukses</b> tapi google.com gagal → sudah pasti DNS (L7).</li>
</ol>
<div class="callout blue"><div class="t">Analogi: Tebak Angka</div><p style="margin:4px 0 0">Mencari angka 1–100: menebak 50 dulu membelah kemungkinan jadi dua — jauh lebih cepat daripada menebak 1, 2, 3… Divide and conquer adalah "binary search" untuk jaringan.</p></div>`,
      terms: [
        ['Divide and conquer', 'Mulai dari titik tengah (biasanya L3/ping gateway), lalu persempit ke separuh yang bermasalah.'],
        ['Bisection', 'Teknik membelah ruang masalah menjadi dua secara berulang sampai tersisa satu titik.'],
      ],
      diagram: `<pre>   DIVIDE AND CONQUER: satu tes, separuh kemungkinan hilang

              ping 192.168.20.1 (gateway)
                 /            \
           SUKSES              GAGAL
           /                      \
   L1-L3 lokal SEHAT        Masalah LOKAL/BAWAH
   cari di ATAS/JAUH:       cek: kabel? port? VLAN?
   routing? NAT? firewall?   IP benar? ARP ada?
   DNS? server tujuan?       gateway-nya hidup?

   Setiap hasil membelah sisa kemungkinan menjadi dua —
   3-4 tes biasanya cukup menemukan layer masalah.</pre>`,
      scenario: 'Tiket: "PC kasir tidak bisa ke server." Engineer divide-and-conquer: ping gateway → sukses (L1–L3 lokal beres, 10 detik). Ping IP server 192.168.30.10 → gagal. Traceroute berhenti di firewall. Cek log firewall → policy baru semalam memblokir VLAN 20 → server. Total 5 menit dari tiket ke root cause — tanpa menyentuh kabel sama sekali.',
      bestPractices: 'Jadikan "ping gateway dulu" sebagai refleks. Ini adalah tes 10 detik yang menghemat 30 menit pemeriksaan buta. Ajarkan ke seluruh tim NOC sebagai langkah standar.',
      security: 'Hasil ping bisa menipu bila ICMP difilter: ping gagal belum tentu jaringan rusak (firewall bisa memblokir ICMP saja). Selalu konfirmasi dengan tes kedua (ARP table / TCP connect) sebelum menyimpulkan.',
      challenge: 'Buat "pohon keputusan" pribadimu di kertas: mulai dari ping gateway, tiap cabang (sukses/gagal) tulis tes berikutnya. Tempel di meja — ini runbook mini pertamamu.',
      interviewQ: 'Q: "Jelaskan cara tercepat mengisolasi masalah konektivitas." — A: Divide and conquer: ping gateway dulu — sukses berarti L1–L3 lokal sehat (cari ke arah routing/NAT/firewall/DNS), gagal berarti masalah lokal (kabel/VLAN/IP/ARP). Satu tes mengeliminasi separuh kemungkinan.',
      quiz: [
        { q: 'Mengapa ping ke gateway menjadi titik tengah favorit divide and conquer?', options: ['Karena paling mudah dihafal', 'Satu tes memisahkan masalah lokal (L1–L3) vs masalah jauh/atas (routing, NAT, firewall, DNS)', 'Karena gateway selalu benar', 'Karena disukai user'], answer: 1, explain: 'Hasil ping gateway membelah ruang masalah menjadi dua: gagal = lokal, sukses = cari lebih jauh/atas.' },
        { q: 'Ping gateway sukses, ping 8.8.8.8 gagal, ping google.com gagal. Kesimpulan?', options: ['Kabel rusak', 'Masalah di jalur keluar: routing/NAT/firewall edge — bukan lokal, bukan DNS', 'DNS rusak', 'PC rusak'], answer: 1, explain: 'Lokal sehat (gateway OK), IP publik tak terjangkau (bukan DNS karena ping IP pun gagal) → curiga routing/NAT/firewall di edge.' },
        { q: 'Ping gateway gagal. Langkah belah berikutnya yang paling logis?', options: ['Langsung restart router', 'Cek ARP table: ada MAC gateway? Untuk bedakan masalah L2 vs gateway down', 'Ganti kabel seluruh gedung', 'Hubungi ISP'], answer: 1, explain: 'ARP membelah lagi: MAC gateway ada = L2 OK (gateway-nya yang bermasalah); tidak ada = masalah L2 (kabel/VLAN/port).' },
      ],
    },
    {
      id: '28.6',
      title: 'Ping',
      body: `<p><b>Ping</b> adalah tool diagnosis paling dasar dan paling sering dipakai: ia mengirim <b>ICMP Echo Request</b> ("halo, kamu di sana?") ke sebuah IP dan menunggu <b>ICMP Echo Reply</b> ("ya, saya di sini"). Ping bekerja di <b>Layer 3</b> dan menjawab satu pertanyaan fundamental: <i>apakah ada jalur IP yang hidup sampai ke tujuan, dan berapa lama pulang-perginya?</i></p>
<h3>Mengapa Ping Dipakai Pertama?</h3>
<ul>
<li><b>Cepat & murah:</b> satu perintah, hasil dalam detik, tanpa instalasi.</li>
<li><b>Memisahkan "mati total" vs "sebagian":</b> ping gateway vs ping internet vs ping nama domain masing-masing menguji titik berbeda (lihat divide and conquer, 28.5).</li>
<li><b>Mengukur kualitas:</b> latency (waktu) dan packet loss (%) terbaca langsung dari output.</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS</th><th>Penjelasan / Alasan Dipakai</th></tr>
<tr><td><code>ping 192.168.20.1</code></td><td>Windows/Linux</td><td>Uji konektivitas dasar ke gateway. <b>Alasan:</b> titik tengah divide-and-conquer.</td></tr>
<tr><td><code>ping -n 10 8.8.8.8</code></td><td>Windows</td><td>Kirim tepat 10 paket. <b>Alasan:</b> Windows default kirim 4x; <code>-n</code> memberi sampel lebih besar untuk ukur loss.</td></tr>
<tr><td><code>ping -t 192.168.30.10</code></td><td>Windows</td><td>Ping terus-menerus sampai Ctrl+C. <b>Alasan:</b> memantau saat kamu memperbaiki — lihat kapan Reply kembali.</td></tr>
<tr><td><code>ping -c 4 8.8.8.8</code></td><td>Linux</td><td>Kirim 4 paket lalu berhenti. <b>Alasan:</b> Linux default ping selamanya; <code>-c</code> membatasinya.</td></tr>
<tr><td><code>ping -f -l 1472 8.8.8.8</code></td><td>Windows</td><td>Paket 1472 byte + <i>Don't Fragment</i>. <b>Alasan:</b> uji MTU (detail di 28.16).</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>C:\\&gt; ping 192.168.20.1

Reply from 192.168.20.1: bytes=32 time&lt;1ms TTL=64
Reply from 192.168.20.1: bytes=32 time&lt;1ms TTL=64
Ping statistics: Sent = 2, Received = 2, Lost = 0 (0% loss)

C:\\&gt; ping 192.168.30.99
Request timed out.
Request timed out.
Ping statistics: Sent = 2, Received = 0, Lost = 2 (100% loss)</pre>
<ul>
<li><b>Reply from … time&lt;1ms TTL=64</b> — tujuan hidup & jalur OK. <code>time</code> = round-trip latency. <code>TTL=64</code> = sisa TTL saat sampai; nilai awal umum: Windows 128, Linux 64, Cisco 255. Tiap router mengurangi 1 — dari sini bisa memperkirakan jumlah hop yang dilewati.</li>
<li><b>Request timed out</b> — paket hilang. Penyebab: host mati, <b>firewall memblokir ICMP</b> (sangat umum!), atau paket dibuang di tengah jalan. <i>Timeout ≠ "kabel putus"</i> — jangan langsung menyimpulkan fisik.</li>
<li><b>Destination host unreachable</b> — PC-mu tidak tahu cara mencapai tujuan: tidak ada rute / ARP ke gateway gagal. Curiga ke konfigurasi IP lokal.</li>
<li><b>Lost = 0%</b> sehat; <b>loss konsisten &gt;0% di LAN</b> = wajib diselidiki (kabel, duplex, congestion — lihat 28.19 skenario 11).</li>
</ul>
<div class="callout"><div class="t">Batasan Ping</div><p style="margin:4px 0 0">Ping sukses <b>tidak</b> membuktikan aplikasi sehat — firewall bisa mengizinkan ICMP tetapi memblokir port TCP aplikasi. Sebaliknya ping gagal <b>tidak</b> selalu berarti jaringan rusak — banyak firewall memblokir ICMP demi keamanan. Selalu padukan dengan tes lain (telnet ke port, traceroute).</p></div>`,
      terms: [
        ['ICMP', 'Internet Control Message Protocol — protokol "pesan kontrol" Layer 3 untuk echo, error, dan diagnostik (bukan untuk data user).'],
        ['Echo Request / Echo Reply', 'Pasangan pesan ICMP yang dipakai ping: permintaan "apakah kamu hidup?" dan jawabannya.'],
        ['RTT', 'Round-Trip Time — waktu pergi-pulang paket, ditampilkan sebagai "time=" dalam ms.'],
        ['TTL', 'Time To Live — angka di header IP yang dikurangi 1 tiap router; mencegah paket berputar selamanya.'],
      ],
      diagram: `<pre>   CARA KERJA PING (ICMP Echo)

   [PC 192.168.20.10]                          [Gateway 192.168.20.1]
          │  ICMP Echo Request (tipe 8)                  │
          │  "halo, kamu di sana?"  ────────────────────▶│
          │                                             │  (tujuan membalas
          │  ◀────────────────────  ICMP Echo Reply     │   dengan tipe 0)
          │     "ya, saya di sini" (tipe 0)             │

   time=  dihitung dari selisih waktu kirim vs terima.
   Kalau balasan tak kunjung datang → "Request timed out".</pre>`,
      scenario: 'User: "Server lemot!" Engineer ping server: time=1ms stabil, loss 0% — jaringan sehat. Ternyata aplikasi di servernya yang overload CPU. Tanpa ping, tim bisa menghabiskan sejam "mengoprek jaringan" yang tidak bersalah. Ping 10 detik menghemat 1 jam.',
      bestPractices: 'Selalu ping dalam urutan: gateway → IP tujuan jauh → nama domain. Tiga hasil ini langsung memetakan masalah ke lokal / routing / DNS.',
      security: 'Banyak firewall memblokir ICMP inbound demi keamanan (mencegah pemetaan jaringan oleh penyerang). Itu normal — jangan "membuka ping" hanya demi kemudahan troubleshooting tanpa persetujuan change.',
      challenge: 'Ping gateway-mu, lalu ping 8.8.8.8, lalu ping google.com. Catat time & TTL masing-masing. Dari nilai TTL, perkirakan berapa hop ke tiap tujuan dan OS apa yang menjawab.',
      interviewQ: 'Q: "Ping ke server gagal dengan Request timed out. Apa kesimpulanmu?" — A: Belum bisa disimpulkan — timeout bisa berarti host mati, paket dibuang di tengah, atau firewall memblokir ICMP. Lanjut: cek ARP, traceroute, dan coba koneksi TCP ke port layanannya.',
      quiz: [
        { q: 'Ping memakai protokol dan pesan apa?', options: ['TCP SYN/ACK', 'ICMP Echo Request / Echo Reply', 'UDP DNS query', 'ARP Request'], answer: 1, explain: 'Ping = ICMP tipe 8 (Echo Request) dibalas tipe 0 (Echo Reply), bekerja di Layer 3.' },
        { q: 'Hasil "Destination host unreachable" paling mengarah ke…', options: ['Kabel putus pasti', 'PC tidak punya rute / ARP ke gateway gagal — masalah konfigurasi IP lokal', 'DNS rusak', 'Server overload'], answer: 1, explain: 'Pesan ini datang dari stack IP lokal/gateway: tidak tahu cara mencapai tujuan → cek IP, subnet mask, gateway, ARP.' },
        { q: 'TTL=117 pada reply dari internet (nilai awal umum 128) berarti…', options: ['Paket rusak', 'Paket melewati kira-kira 11 router (128−117)', 'Server memakai Linux', 'Latency 117 ms'], answer: 1, explain: 'Tiap router mengurangi TTL 1; selisih nilai awal dan nilai terima ≈ jumlah hop.' },
      ],
    },
    {
      id: '28.7',
      title: 'Traceroute',
      body: `<p>Kalau ping menjawab <i>"apakah sampai?"</i>, <b>traceroute</b> menjawab <i>"lewat mana, dan di mana macetnya?"</i>. Ia memetakan <b>setiap router (hop)</b> yang dilewati paket dari sumber ke tujuan, lengkap dengan latency per hop — peta jalan paketmu.</p>
<h3>Cara Kerja: Trik TTL</h3>
<p>Traceroute mengeksploitasi TTL (28.6) dengan cerdik:</p>
<ol>
<li>Kirim paket dengan <b>TTL=1</b> → router pertama menghabiskan TTL → membalas <b>ICMP Time Exceeded</b> ("paketmu kedaluwarsa di saya") → ketahuan IP & latency hop 1.</li>
<li>Kirim dengan <b>TTL=2</b> → lolos router pertama, kedaluwarsa di router kedua → ketahuan hop 2.</li>
<li>Ulangi TTL=3, 4, 5… sampai paket mencapai tujuan (tujuan membalas normal, bukan Time Exceeded).</li>
</ol>
<p>Setiap hop di-probe <b>3 kali</b> — itulah tiga angka waktu di tiap baris output.</p>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>tracert 8.8.8.8</code></td><td>Windows</td><td>Pakai ICMP. <b>Alasan:</b> paling kompatibel dengan firewall yang mengizinkan ping.</td></tr>
<tr><td><code>traceroute 8.8.8.8</code></td><td>Linux</td><td>Default pakai UDP. <b>Alasan:</b> standar Unix; tapi bisa diblokir firewall — kalau aneh, coba <code>-I</code>.</td></tr>
<tr><td><code>traceroute -I 8.8.8.8</code></td><td>Linux</td><td>Paksa pakai ICMP seperti Windows. <b>Alasan:</b> saat hasil UDP mencurigakan/tak konsisten.</td></tr>
<tr><td><code>mtr --report 8.8.8.8</code></td><td>Linux</td><td>Gabungan ping + traceroute kontinu. <b>Alasan:</b> melihat loss/latency <i>per hop</i> dari waktu ke waktu — terbaik untuk kasus intermittent.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>$ traceroute 8.8.8.8
 1  192.168.20.1 (gateway)      0.8 ms   0.6 ms   0.5 ms
 2  103.147.8.1 (ISP)          12.3 ms  11.9 ms  12.1 ms
 3  103.147.0.45               15.2 ms  14.8 ms  15.0 ms
 4   *         *         *
 5  8.8.8.8                    28.4 ms  27.9 ms  28.1 ms</pre>
<ul>
<li><b>Lonjakan latency di satu hop</b> (mis. hop 2 tiba-tiba 300 ms) → masalah mulai di hop itu / link setelahnya. Bandingkan: latency wajar bertambah sedikit tiap hop karena jarak.</li>
<li><b><code>* * *</code> lalu hop berikutnya muncul</b> → router itu tidak membalas ICMP (umum: firewall/disable), tetapi <i>meneruskan</i> paket dengan normal. Bukan masalah.</li>
<li><b>Berhenti total (<code>* * *</code> sampai akhir)</b> → paket mentok di hop terakhir yang menjawab: firewall memblokir, routing buntu, atau tujuan down.</li>
<li><b>Hop berputar/berulang</b> → routing loop! (lihat skenario 14 di 28.19).</li>
</ul>
<div class="callout blue"><div class="t">Jalur Pulang Bisa Berbeda</div><p style="margin:4px 0 0">Internet memakai <i>asymmetric routing</i>: jalur pergi dan pulang bisa beda. Traceroute hanya menunjukkan jalur <b>pergi</b>. Latency tinggi di satu hop belum tentu hop itu yang salah — bisa jadi jalur pulangnya yang bermasalah. Konfirmasi dengan MTR dua arah bila memungkinkan.</p></div>`,
      terms: [
        ['Hop', 'Satu router yang dilewati paket; jumlah hop = jumlah router antara sumber dan tujuan.'],
        ['ICMP Time Exceeded', 'Pesan balasan router saat TTL paket habis — mekanisme yang dieksploitasi traceroute.'],
        ['MTR', 'My Traceroute — tool gabungan ping+traceroute kontinu untuk diagnosis loss/latency per hop.'],
      ],
      diagram: `<pre>   TRIK TTL TRACEROUTE (tujuan: 8.8.8.8)

   TTL=1 ──▶ [R1] ✖ TTL habis → "Time Exceeded, saya 192.168.20.1"  → hop 1 ketahuan
   TTL=2 ──▶ [R1] ──▶ [R2] ✖ TTL habis → "saya 103.147.8.1"        → hop 2 ketahuan
   TTL=3 ──▶ [R1] ──▶ [R2] ──▶ [R3] ✖ …                             → hop 3 ketahuan
   TTL=4 ──▶ … sampai tujuan membalas normal ──▶ SELESAI

   Tiap TTL diulang 3x → tiga angka waktu per baris.</pre>`,
      scenario: 'Kantor cabang lapor "internet lambat sejak kemarin". Traceroute: hop 1–2 normal (1 ms, 12 ms), hop 3 (ISP) melonjak ke 400 ms dan loss. Bukti konkret ditunjukkan ke ISP — ternyata link upstream mereka congested. Tanpa traceroute, perdebatan "salah siapa" bisa berlarut-larut.',
      bestPractices: 'Simpan output traceroute saat jaringan sehat sebagai baseline. Saat ada masalah, bandingkan: hop mana yang berubah? Baseline membuat diagnosis 10x lebih cepat.',
      security: 'Traceroute adalah tool pemetaan jaringan — penyerang memakainya untuk reconnaissance. Di sisi defense, wajar jika router edge tidak membalas ICMP (* * *); itu bukan kerusakan.',
      challenge: 'Jalankan traceroute ke 8.8.8.8 dari lab/PC-mu. Identifikasi: hop ke berapa gerbang ISP-mu? Di hop mana latency mulai naik signifikan? Adakah hop * * *?',
      interviewQ: 'Q: "Traceroute berhenti di hop ke-4 dengan * * * sampai akhir. Artinya?" — A: Paket mentok setelah hop 3 — kemungkinan firewall memblokir, tidak ada rute lanjutan, atau tujuan down. Cek dari sisi tujuan / hubungi admin hop berikutnya.',
      quiz: [
        { q: 'Traceroute menemukan tiap hop dengan cara…', options: ['Menebak IP router', 'Mengirim paket dengan TTL bertambah dan membaca ICMP Time Exceeded tiap router', 'Membaca routing table lokal', 'Meminta daftar ke ISP'], answer: 1, explain: 'TTL=1,2,3… membuat tiap router berurutan "mengaku" lewat pesan Time Exceeded.' },
        { q: 'Satu baris hop menampilkan "* * *" tetapi hop berikutnya muncul normal. Artinya…', options: ['Jaringan rusak di hop itu', 'Router itu tidak membalas ICMP tetapi meneruskan paket normal — bukan masalah', 'Kabel putus', 'Serangan DDoS'], answer: 1, explain: 'Bintang = tidak ada balasan probe; kalau hop lanjut muncul, penerusan paketnya sehat.' },
        { q: 'Kapan MTR lebih baik daripada traceroute biasa?', options: ['Tidak pernah', 'Untuk melihat loss/latency per hop secara kontinu — kasus intermittent', 'Hanya di Windows', 'Untuk cek DNS'], answer: 1, explain: 'MTR mengulang probe terus-menerus sehingga pola loss/latency per hop terlihat dari waktu ke waktu.' },
      ],
    },
    {
      id: '28.8',
      title: 'ARP',
      body: `<p><b>ARP (Address Resolution Protocol)</b> adalah "penerjemah" Layer 2↔3: saat PC tahu IP tujuan (mis. gateway 192.168.20.1) tetapi belum tahu <b>MAC address</b>-nya, ia berteriak broadcast ke seluruh VLAN: <i>"Siapa pemilik 192.168.20.1? Beri tahu MAC-mu!"</i> Pemiliknya menjawab, dan hasilnya disimpan di <b>ARP table</b>. Tanpa ARP yang sehat, tidak ada komunikasi IP lokal — ping ke gateway pun gagal.</p>
<h3>Mengapa ARP Penting untuk Troubleshooting?</h3>
<ul>
<li><b>Ping gateway gagal?</b> Cek ARP table dulu: kalau MAC gateway tidak ada (incomplete), masalahnya di <b>Layer 2</b> — bukan di routing.</li>
<li><b>IP conflict</b> terdeteksi lewat ARP: MAC untuk satu IP berubah-ubah.</li>
<li><b>Gateway diganti / failover</b> tetapi user masih gagal: ARP cache lama (stale) — solusinya tunggu timeout atau clear ARP.</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS/Device</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>arp -a</code></td><td>Windows/Linux</td><td>Tampilkan ARP table. <b>Alasan:</b> verifikasi cepat "apakah IP ini sudah terpetakan ke MAC?"</td></tr>
<tr><td><code>arp -d 192.168.20.1</code></td><td>Windows</td><td>Hapus entry ARP. <b>Alasan:</b> paksa ARP ulang saat curiga cache basi (mis. setelah ganti device gateway).</td></tr>
<tr><td><code>/ip arp print</code></td><td>MikroTik</td><td>Lihat ARP table router. <b>Alasan:</b> cek dari sisi router: apakah MAC client terlihat?</td></tr>
<tr><td><code>show ip arp</code></td><td>Cisco IOS</td><td>ARP table di router/switch L3. <b>Alasan:</b> sama — verifikasi pemetaan IP↔MAC.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>C:\\&gt; arp -a
Interface: 192.168.20.10
  Internet Address      Physical Address     Type
  192.168.20.1          aa-bb-cc-11-22-33    dynamic     ← gateway: OK
  192.168.20.50         &lt;incomplete&gt;         dynamic     ← (Linux) ARP tak terjawab!

[admin@MikroTik] &gt; /ip arp print
 # ADDRESS         MAC-ADDRESS        INTERFACE
 0 192.168.20.10   D4:3D:7E:AA:BB:CC  bridge-office
 1 192.168.20.1    AA:BB:CC:11:22:33  bridge-office   D  ← D = dynamic</pre>
<ul>
<li><b>Entry dynamic + MAC valid</b> → ARP sehat untuk IP itu.</li>
<li><b><code>incomplete</code> / entry hilang</b> → ARP request tidak dijawab: host mati, salah VLAN/subnet, atau terblokir. <i>Ini</i> alasan ping gateway gagal padahal kabel OK.</li>
<li><b>Satu IP → MAC berubah-ubah</b> (atau dua MAC klaim satu IP) → <b>duplicate IP / ARP spoofing</b> — lihat skenario 13.</li>
</ul>
<div class="callout"><div class="t">Proxy ARP — Ketahui Saja</div><p style="margin:4px 0 0">Router bisa menjawab ARP <i>mewakili</i> host lain (proxy ARP) — kadang menyembunyikan masalah subnet mask yang salah (PC mengira tujuan satu subnet padahal tidak). Kalau troubleshooting terasa "aneh", cek apakah proxy-arp aktif di interface.</p></div>`,
      terms: [
        ['ARP', 'Address Resolution Protocol — memetakan IP address ke MAC address via broadcast di satu broadcast domain.'],
        ['ARP table / ARP cache', 'Daftar sementara pemetaan IP↔MAC hasil ARP; entry dynamic kedaluwarsa otomatis (aging).'],
        ['Gratuitous ARP', 'ARP yang dikirim host untuk mengumumkan IP/MAC-nya sendiri — dipakai saat failover & deteksi duplicate IP.'],
      ],
      diagram: `<pre>   PROSES ARP (satu broadcast domain / VLAN)

   [PC .10]  "Siapa 192.168.20.1?!"            [Gateway .1]
       │  ── broadcast FF:FF:FF:FF:FF:FF ──▶        │  (semua host dengar,
       │                                           │   hanya pemilik jawab)
       │  ◀── unicast "saya .1, MAC AA:BB:CC…" ─── │
       │
       ▼  PC simpan: 192.168.20.1 → AA:BB:CC:11:22:33 (ARP table)
   Komunikasi IP lokal kini bisa jalan (frame Ethernet punya MAC tujuan).</pre>`,
      scenario: 'Setelah maintenance, gateway diganti dengan router baru (IP sama, MAC beda). User komplain "internet putus" padahal semua konfigurasi benar. Root cause: ARP cache PC masih menyimpan MAC router lama. Solusi: tunggu aging atau clear ARP — 2 menit, tanpa ubah apa pun.',
      bestPractices: 'Saat ping gateway gagal, JANGAN langsung curiga routing — cek ARP dulu. 30 detik melihat arp -a sering menghemat 30 menit.',
      security: 'ARP tidak punya autentikasi — siapa pun bisa berbohong (ARP spoofing) dan menyadap traffic. Pertahanan: Dynamic ARP Inspection di switch (Part 29).',
      challenge: 'Jalankan arp -a di PC-mu. Cocokkan MAC gateway dengan stiker/label asli (atau MAC di sisi router). Apakah sama? Hapus entry-nya (arp -d), ping gateway lagi, dan lihat entry muncul kembali.',
      interviewQ: 'Q: "Ping gateway gagal padahal kabel OK dan IP benar. Apa yang kamu cek?" — A: ARP table (arp -a): kalau MAC gateway incomplete/tidak ada, masalahnya di Layer 2 — VLAN salah, port salah, atau gateway tidak menjawab ARP.',
      quiz: [
        { q: 'Fungsi utama ARP adalah…', options: ['Menerjemahkan nama domain ke IP', 'Memetakan IP address ke MAC address di satu broadcast domain', 'Mengatur routing antar subnet', 'Mengenkripsi paket'], answer: 1, explain: 'ARP menjawab "MAC apa untuk IP ini?" via broadcast Layer 2 — syarat komunikasi IP lokal.' },
        { q: 'Entry ARP berstatus incomplete artinya…', options: ['MAC valid', 'ARP request tidak mendapat jawaban — host/VLAN/subnet bermasalah', 'IP duplicate', 'Kabel putus pasti'], answer: 1, explain: 'Incomplete = menunggu jawaban yang tak kunjung datang; selidiki L2 dan keberadaan host.' },
        { q: 'Satu IP terlihat berganti-ganti MAC dalam waktu singkat. Indikasi…', options: ['Normal', 'Duplicate IP atau ARP spoofing', 'DHCP sehat', 'Switch cepat'], answer: 1, explain: 'Satu IP seharusnya punya satu MAC stabil; perubahan cepat = dua perangkat berebut IP yang sama (atau serangan).' },
      ],
    },
    {
      id: '28.9',
      title: 'MAC Table',
      body: `<p><b>MAC table</b> (disebut juga <i>CAM table</i> / <i>bridging table</i>) adalah "buku alamat" switch: daftar pasangan <b>MAC address → nomor port</b> yang dipelajari switch dari traffic yang lewat. Switch meneruskan frame <i>hanya</i> ke port yang tepat berkat tabel ini. Saat tabel ini salah/kosong, gejala Layer 2 muncul.</p>
<h3>Mengapa MAC Table Penting untuk Troubleshooting?</h3>
<ul>
<li><b>"PC tidak bisa ke mana-mana padahal link nyala"</b> → cek: apakah MAC PC muncul di MAC table pada port yang benar? Tidak muncul = frame tidak pernah sampai ke switch (kabel/port/NIC) atau VLAN salah.</li>
<li><b>MAC muncul di port yang SALAH</b> → kabel salah colok, atau ada loop.</li>
<li><b>Satu MAC muncul di banyak port bergantian (flapping)</b> → indikasi <b>loop</b> atau duplicate MAC.</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>Device</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>show mac address-table</code></td><td>Cisco IOS</td><td>Tampilkan seluruh MAC table. <b>Alasan:</b> verifikasi MAC↔port↔VLAN.</td></tr>
<tr><td><code>show mac address-table address aabb.ccdd.eeff</code></td><td>Cisco IOS</td><td>Cari satu MAC spesifik. <b>Alasan:</b> saat melacak "PC ini nyambung di port mana?"</td></tr>
<tr><td><code>show mac address-table interface Gi0/5</code></td><td>Cisco IOS</td><td>MAC apa saja di satu port. <b>Alasan:</b> deteksi hub liar / banyak device di satu port.</td></tr>
<tr><td><code>/interface bridge host print</code></td><td>MikroTik</td><td>Padanan MikroTik. <b>Alasan:</b> kolom <i>on-interface</i> menunjukkan port learned.</td></tr>
<tr><td><code>clear mac address-table dynamic</code></td><td>Cisco IOS</td><td>Hapus entry dynamic. <b>Alasan:</b> paksa belajar ulang saat topologi berubah (hati-hati: flooding sesaat).</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>Switch# show mac address-table
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  20    aabb.ccdd.0010    DYNAMIC     Gi0/5      ← PC office di port 5, VLAN 20: OK
  20    aabb.ccdd.0020    DYNAMIC     Gi0/6
  99    aabb.ccdd.0099    DYNAMIC     Gi0/24     ← device mgmt di uplink: OK
  20    aabb.ccdd.00ff    DYNAMIC     Gi0/5      ← DUA MAC di satu port?
                                                 (mungkin PC + VM, atau hub liar)</pre>
<ul>
<li><b>Kolom Vlan</b> harus cocok dengan VLAN yang kamu harapkan untuk port itu. MAC PC office muncul di VLAN 10 = port salah konfigurasi.</li>
<li><b>Type DYNAMIC</b> = dipelajari otomatis (normal); <b>STATIC</b> = dikonfigurasi manual.</li>
<li><b>MAC tidak ada padahal link nyala</b> = device tidak mengirim traffic (NIC mati/driver) atau frame ditolak (VLAN mismatch di sisi device).</li>
</ul>
<div class="callout blue"><div class="t">MAC Flapping = Alarm Loop</div><p style="margin:4px 0 0">Log <i>"MAC flapping between ports"</i> artinya satu MAC terlihat pindah-pindah port — gejala klasik <b>loop Layer 2</b>. Jangan clear table dulu; cari dan putus loop-nya (lihat skenario 14), pastikan STP jalan (Part 10).</p></div>`,
      terms: [
        ['MAC table / CAM table', 'Tabel di switch: MAC address → port → VLAN, dipelajari otomatis dari source MAC frame yang masuk.'],
        ['MAC flapping', 'Satu MAC terdeteksi berpindah-pindah port — indikasi loop atau duplicate MAC.'],
        ['Aging time', 'Waktu kedaluwarsa entry dynamic (default 300 detik di Cisco) bila tidak ada traffic dari MAC itu.'],
      ],
      diagram: `<pre>   SWITCH BELAJAR MAC TABLE

   [PC-A] ──Gi0/5── [Switch] ──Gi0/6── [PC-B]
      │                  │                  │
      │ frame: src=AA:AA  │                  │
      └─────────────────▶│  "AA:AA datang dari Gi0/5" → catat!
                         │  tujuan BB:BB belum dikenal → flood ke semua port
                         │                  │◀─────────┘
                         │  "BB:BB datang dari Gi0/6" → catat!
      Sekarang: AA:AA→Gi0/5, BB:BB→Gi0/6 → frame berikutnya unicast tepat sasaran.</pre>`,
      scenario: 'PC baru tidak bisa dapat DHCP padahal port nyala. show mac address-table: MAC PC tidak muncul sama sekali. Ternyata kabelnya tercolok ke port yang shutdown secara administratif di patch panel — link di sisi PC "nyala" karena terhubung ke patch panel, bukan ke switch. MAC table membuktikan frame tak pernah sampai switch.',
      bestPractices: 'Dokumentasikan pemetaan port↔ruangan↔VLAN. Saat MAC muncul di port tak terduga, kamu langsung tahu "seharusnya tidak di sana".',
      security: 'MAC table adalah dasar port-security (Part 29): batasi jumlah MAC per port untuk mencegah user mencolok switch liar / serangan MAC flooding.',
      challenge: 'Di GNS3/Cisco: jalankan show mac address-table, catat MAC PC di tiap port. Pindahkan kabel PC ke port lain, jalankan lagi — amati entry berpindah (atau tunggu aging).',
      interviewQ: 'Q: "Link nyala tapi MAC address PC tidak muncul di MAC table. Apa artinya?" — A: Frame dari PC tidak pernah sampai ke switch — curiga kabel/patch panel, port shutdown di tengah jalan, NIC/driver, atau VLAN mismatch di sisi PC.',
      quiz: [
        { q: 'Informasi apa yang disimpan MAC table?', options: ['IP ke hostname', 'MAC address → port → VLAN hasil pembelajaran switch', 'Password user', 'Routing antar subnet'], answer: 1, explain: 'Switch belajar dari source MAC frame yang masuk: MAC ini ada di port ini, VLAN ini.' },
        { q: 'Log "MAC flapping between Gi0/5 and Gi0/9" mengindikasikan…', options: ['Switch rusak', 'Kemungkinan loop Layer 2 atau duplicate MAC — selidiki, jangan abaikan', 'Normal saat boot', 'Kabel terlalu panjang'], answer: 1, explain: 'Satu MAC tak mungkin ada di dua port sekaligus kecuali ada loop/duplikasi — gejala klasik yang harus dikejar.' },
        { q: 'MAC PC office muncul di tabel tetapi pada VLAN 10 (seharusnya 20). Kesimpulan?', options: ['Normal', 'Port salah konfigurasi VLAN — perbaiki switchport access vlan', 'PC rusak', 'Gateway down'], answer: 1, explain: 'Kolom VLAN di MAC table memverifikasi konfigurasi port; mismatch = perbaiki di switch.' },
      ],
    },
    {
      id: '28.10',
      title: 'Routing Table',
      body: `<p><b>Routing table</b> adalah "peta jalan" router: daftar <b>tujuan (destination network) → jalan keluar (interface / next-hop)</b>. Setiap paket yang tiba, router mencocokkannya ke tabel ini untuk memutuskan diteruskan ke mana. Hampir semua masalah "antar-subnet/VLAN tidak tersambung" bermuara ke tabel ini: <b>rute tidak ada, rute salah arah, atau rute kalah seleksi</b>.</p>
<h3>Konsep Kunci: Longest Prefix Match</h3>
<p>Jika dua rute cocok untuk satu tujuan, router memilih <b>prefix terpanjang (paling spesifik)</b>. Contoh: paket ke 192.168.30.10 cocok dengan <code>192.168.0.0/16</code> dan <code>192.168.30.0/24</code> → yang dipakai <code>/24</code> karena lebih spesifik. Ini alasan static route "khusus" bisa mengalahkan route umum.</p>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>Device</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>show ip route</code></td><td>Cisco IOS</td><td>Tampilkan tabel routing. <b>Alasan:</b> verifikasi "apakah router tahu jalan ke tujuan?"</td></tr>
<tr><td><code>show ip route 192.168.30.0</code></td><td>Cisco IOS</td><td>Cari rute spesifik. <b>Alasan:</b> lebih cepat daripada membaca seluruh tabel.</td></tr>
<tr><td><code>/ip route print</code></td><td>MikroTik</td><td>Padanan MikroTik. <b>Alasan:</b> kolom <i>gateway</i> &amp; <i>distance</i> menunjukkan jalan &amp; prioritas.</td></tr>
<tr><td><code>ip route</code> / <code>route -n</code></td><td>Linux</td><td>Tabel routing host/server. <b>Alasan:</b> server multi-homing sering salah default gateway.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya (Cisco)</h3>
<pre>Router# show ip route
Codes: C - connected, S - static, O - OSPF, * - candidate default

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

C    192.168.20.0/24 is directly connected, GigabitEthernet0/0
                      ↑ "C" = jaringan yang menempel langsung (punya interface di subnet itu)
S    192.168.30.0/24 [1/0] via 192.168.99.2
                      ↑ "S" = static; [1/0] = [administrative distance/metric]
O    192.168.40.0/24 [110/20] via 192.168.99.3
                      ↑ "O" = dipelajari dari OSPF (Part 12)
S*   0.0.0.0/0 [1/0] via 203.0.113.1
                      ↑ default route: "kalau tidak tahu, lempar ke ISP"</pre>
<ul>
<li><b>Tidak ada baris untuk tujuan</b> (dan tidak ada default route) → router me-drop paket: "network unreachable". Solusi: tambah static route / perbaiki routing protocol.</li>
<li><b>Next-hop salah</b> (via IP yang tidak tepat) → paket nyasar. Cek siapa yang mengiklankan/mengkonfigurasi rute itu.</li>
<li><b>Administrative distance (AD)</b> = "nilai kepercayaan": static (1) mengalahkan OSPF (110). Dua rute ke tujuan yang sama → AD terkecil menang. Ini jebakan umum saat migrasi routing.</li>
<li><b>Di MikroTik</b>, flag <code>A</code> = active; rute tanpa A = tidak dipakai (gateway unreachable?).</li>
</ul>
<div class="callout"><div class="t">Routing Itu Dua Arah</div><p style="margin:4px 0 0">Paket pergi <b>dan</b> pulang butuh rute. Kasus klasik: PC bisa ping server, server tidak bisa membalas — karena <i>router server</i> tidak punya rute kembali ke subnet PC. Selalu cek routing table di <b>kedua sisi</b>.</p></div>`,
      terms: [
        ['Routing table', 'Daftar tujuan jaringan → next-hop/interface yang dipakai router meneruskan paket.'],
        ['Longest prefix match', 'Aturan: dari semua rute yang cocok, pilih prefix terpanjang (paling spesifik).'],
        ['Administrative distance', 'Nilai kepercayaan sumber rute (static=1, OSPF=110, dsb.); terkecil menang.'],
        ['Default route', 'Rute 0.0.0.0/0 — "jalan terakhir" untuk tujuan yang tidak dikenal; biasanya ke ISP.'],
        ['Next-hop', 'IP router berikutnya yang akan menerima paket menuju tujuan.'],
      ],
      diagram: `<pre>   MEMBACA ROUTING TABLE (analogi rambu jalan)

   Tujuan: 192.168.30.10
   Tabel router:
     192.168.0.0/16  via 192.168.99.2      } cocok, tapi /16 kalah spesifik
     192.168.30.0/24 via 192.168.99.5      } ← MENANG (longest prefix match)
     0.0.0.0/0       via 203.0.113.1       } cadangan terakhir

   Paket diteruskan ke 192.168.99.5. Kalau TIDAK ADA baris yang cocok
   (termasuk default) → paket dibuang: "destination unreachable".</pre>`,
      scenario: 'VLAN 20 bisa internet, tapi tidak bisa ke server VLAN 30 — padahal firewall allow. show ip route di router: tidak ada baris 192.168.30.0/24! Ternyata static route ke firewall (yang me-routing VLAN 30) terhapus saat maintenance. Tambah kembali satu baris → normal. Moral: "tidak bisa antar-VLAN" hampir selalu soal routing atau firewall — tabel ini membedakannya dalam 1 menit.',
      bestPractices: 'Dokumentasikan setiap static route: tujuan, next-hop, dan ALASANNYA. Static route misterius adalah sumber outage klasik saat troubleshooting ("rute ini untuk apa ya?").',
      security: 'Routing table bisa diracuni (route injection) bila routing protocol tanpa autentikasi. Di production, aktifkan autentikasi OSPF/BGP (Part 12) agar tabel routing tidak bisa dimanipulasi.',
      challenge: 'Di GNS3: hapus satu static route, amati gejalanya (ping gagal ke mana?). Jalankan show ip route sebelum & sesudah, catat baris yang hilang. Kembalikan dan verifikasi.',
      interviewQ: 'Q: "PC bisa ping gateway tapi tidak bisa ping server di VLAN lain. Langkahmu?" — A: Cek routing table di router/firewall: ada rute ke subnet server? Lalu cek arah sebaliknya (rute kembali). Kalau rute lengkap, baru curiga firewall policy.',
      quiz: [
        { q: 'Router menerima paket ke 192.168.30.10 dengan rute 192.168.0.0/16 dan 192.168.30.0/24. Yang dipakai?', options: ['192.168.0.0/16 (lebih besar)', '192.168.30.0/24 (longest prefix match)', 'Default route', 'Di-drop'], answer: 1, explain: 'Longest prefix match: prefix terpanjang/paling spesifik selalu menang.' },
        { q: 'Kode "S" dan angka [1/0] pada baris routing Cisco berarti…', options: ['Static route dengan AD=1, metric=0', 'OSPF', 'Connected', 'Error'], answer: 0, explain: 'S = static; [AD/metric] = [1/0]; AD 1 artinya sangat dipercaya (mengalahkan OSPF 110).' },
        { q: 'PC bisa ping server, tapi reply tidak kembali. Kemungkinan besar…', options: ['Kabel PC rusak', 'Router di sisi server tidak punya rute kembali ke subnet PC', 'DNS rusak', 'Switch penuh'], answer: 1, explain: 'Routing dua arah: paket pergi OK, paket pulang butuh rute kembali yang mungkin hilang.' },
      ],
    },
    {
      id: '28.11',
      title: 'DNS',
      body: `<p><b>DNS (Domain Name System)</b> adalah "buku telepon" internet: menerjemahkan nama (<code>google.com</code>) menjadi IP (<code>142.250.x.x</code>) agar aplikasi bisa membuka koneksi. Hampir semua aplikasi memakai nama, bukan IP — sehingga <b>DNS gagal = "internet mati" menurut user</b>, padahal konektivitas IP-nya sehat total.</p>
<h3>Tanda Klasik Masalah DNS</h3>
<p><b>Ping 8.8.8.8 SUKSES tetapi ping google.com GAGAL</b> ("Ping request could not find host"). Ini adalah tes pemisah paling terkenal di troubleshooting: IP jalan, nama tidak → 100% masalah DNS (atau filter), bukan masalah konektivitas.</p>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>nslookup google.com</code></td><td>Windows/Linux</td><td>Resolusi dasar. <b>Alasan:</b> verifikasi cepat "apakah nama ini bisa diterjemahkan, oleh server mana?"</td></tr>
<tr><td><code>dig google.com +short</code></td><td>Linux</td><td>Jawaban singkat saja. <b>Alasan:</b> output bersih untuk scripting/cek cepat.</td></tr>
<tr><td><code>dig google.com</code></td><td>Linux</td><td>Output lengkap. <b>Alasan:</b> melihat waktu query, server yang menjawab, dan status (NOERROR/SERVFAIL).</td></tr>
<tr><td><code>ipconfig /all</code></td><td>Windows</td><td>Lihat DNS server yang dipakai PC. <b>Alasan:</b> DNS salah (mis. IP lama) adalah penyebab #1.</td></tr>
<tr><td><code>ipconfig /flushdns</code></td><td>Windows</td><td>Hapus cache DNS lokal. <b>Alasan:</b> saat catatan DNS berubah tetapi PC masih memakai jawaban lama.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>$ dig google.com
;; QUESTION SECTION:
;google.com.            IN  A          ← pertanyaan: "IP (A record) google.com?"
;; ANSWER SECTION:
google.com.     299    IN  A   142.250.190.14   ← jawaban: IP-nya ini, cache 299 detik
;; Query time: 24 msec
;; SERVER: 192.168.20.1#53                     ← yang menjawab: DNS server lokal
;; status: NOERROR                             ← sukses (waspadai SERVFAIL/NXDOMAIN)

C:\\&gt; nslookup google.com
Server:  UnKnown
Address:  192.168.20.1
Name:    google.com
Address:  142.250.190.14</pre>
<ul>
<li><b>status: NOERROR + ada ANSWER</b> → DNS sehat.</li>
<li><b>status: SERVFAIL</b> → server DNS bermasalah / tidak bisa ke upstream. Cek servernya, bukan client-nya.</li>
<li><b>status: NXDOMAIN</b> → nama memang tidak ada (salah ketik? typo "googel.com").</li>
<li><b>Timeout / no response</b> → client tidak bisa mencapai DNS server: cek IP DNS di <code>ipconfig /all</code>, ping DNS server-nya, cek firewall port 53.</li>
</ul>
<div class="callout blue"><div class="t">Record DNS Penting</div><p style="margin:4px 0 0"><b>A</b> = nama→IPv4, <b>AAAA</b> = nama→IPv6, <b>CNAME</b> = alias nama→nama lain, <b>MX</b> = server email domain, <b>PTR</b> = IP→nama (reverse). Untuk troubleshooting konektivitas, A/AAAA yang paling sering dicek.</p></div>`,
      terms: [
        ['DNS', 'Domain Name System — layanan penerjemah nama domain menjadi IP address (dan sebaliknya).'],
        ['Resolver / DNS server', 'Server yang ditanya client untuk resolusi; bisa lokal (router/server internal) atau publik (8.8.8.8).'],
        ['A record', 'Catatan DNS: nama domain → alamat IPv4.'],
        ['NXDOMAIN / SERVFAIL', 'Status jawaban DNS: nama tidak ada / server gagal memproses.'],
      ],
      diagram: `<pre>   ALUR RESOLUSI DNS (yang gagal di titik mana?)

   [PC] ── "IP-nya google.com?" ──▶ [DNS Server 192.168.20.1]
                                            │ (kalau tak tahu, tanya ke atas:
                                            │  root → .com → google.com)
                                            ▼
   [PC] ◀── "142.250.190.14" ─────── [DNS Server]

   Titik gagal umum:
   1) PC salah DNS server (ipconfig /all)      → timeout
   2) Firewall blokir port 53                  → timeout
   3) DNS server down / upstream bermasalah     → SERVFAIL
   4) Salah ketik nama                          → NXDOMAIN</pre>`,
      scenario: 'Seluruh kantor "internet mati" menurut user — tapi ping 8.8.8.8 sukses. nslookup timeout. Cek: server DNS internal (di VLAN 30) down setelah update. Solusi sementara: arahkan DHCP ke DNS publik 8.8.8.8 sambil perbaiki server. Moral: "internet mati" bagi user 50% adalah "DNS mati" bagi engineer.',
      bestPractices: 'Sediakan minimal 2 DNS server (primer + sekunder) via DHCP. Satu DNS server = single point of failure yang melumpuhkan seluruh kantor secara "halus".',
      security: 'DNS bisa dimanipulasi (DNS spoofing) untuk mengarahkan user ke situs palsu. Pertahanan: DNS filtering, DNSSEC, dan jangan biarkan client memakai DNS server asing yang tidak diawasi (lihat Part 29).',
      challenge: 'Jalankan dig/nslookup untuk sebuah domain, catat: server mana yang menjawab, berapa query time, dan TTL-nya. Lalu flush DNS dan ulangi — amati query time berubah (cache vs non-cache).',
      interviewQ: 'Q: "User bisa ping 8.8.8.8 tapi tidak bisa buka website apa pun. Diagnosis?" — A: Klasik DNS: verifikasi dengan nslookup/dig, cek DNS server di ipconfig, ping DNS server-nya, cek firewall port 53, lalu kondisi server DNS itu sendiri.',
      quiz: [
        { q: 'Tanda paling khas masalah DNS adalah…', options: ['Ping gateway gagal', 'Ping 8.8.8.8 sukses tetapi ping google.com gagal', 'Semua lampu switch mati', 'Kabel putus'], answer: 1, explain: 'IP jalan + nama gagal = lapisan resolusi nama yang bermasalah, bukan konektivitas.' },
        { q: 'Pada output dig, "status: SERVFAIL" berarti…', options: ['Nama tidak ada', 'Server DNS gagal memproses — selidiki servernya', 'Sukses', 'Cache penuh'], answer: 1, explain: 'SERVFAIL = server error; NXDOMAIN = nama tidak ada; NOERROR = sukses.' },
        { q: 'Perintah untuk melihat DNS server yang dipakai PC Windows adalah…', options: ['ping -a', 'ipconfig /all', 'tracert', 'arp -a'], answer: 1, explain: 'ipconfig /all menampilkan DNS servers — tempat pertama memeriksa "DNS-nya salah alamat".' },
      ],
    },
    {
      id: '28.12',
      title: 'DHCP',
      body: `<p><b>DHCP (Dynamic Host Configuration Protocol)</b> adalah layanan yang otomatis memberi PC: <b>IP address, subnet mask, gateway, dan DNS server</b>. Tanpa DHCP yang sehat, PC tidak punya "identitas jaringan" — gejalanya sangat khas dan mudah dikenali.</p>
<h3>Cara Kerja: DORA (4 Langkah)</h3>
<ol>
<li><b>Discover</b> — PC broadcast: "Ada server DHCP di sini?" (belum punya IP, jadi harus teriak ke semua).</li>
<li><b>Offer</b> — Server menjawab: "Saya ada, pakai IP 192.168.20.50 ya?"</li>
<li><b>Request</b> — PC: "OK, saya ambil IP itu."</li>
<li><b>Ack</b> — Server: "Deal, dicatat." (+ gateway, DNS, lease time).</li>
</ol>
<p>Karena Discover memakai <b>broadcast</b>, ia <b>tidak melewati router</b> — server DHCP di VLAN lain butuh <b>DHCP relay / ip helper-address</b> di router (ingat: router menghentikan broadcast, 1.9).</p>
<h3>Tanda Klasik DHCP Gagal</h3>
<ul>
<li><b>Windows:</b> IP <code>169.254.x.x</code> (APIPA — "IP darurat" saat DHCP gagal total).</li>
<li><b>Semua PC baru</b> tidak dapat IP, sedangkan PC lama (masih punya lease) normal.</li>
<li><code>ipconfig</code> menunjukkan IP 0.0.0.0 atau subnet kosong.</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>ipconfig /all</code></td><td>Windows</td><td>Lihat IP, lease obtained/expires, DHCP server. <b>Alasan:</b> memastikan "dapat dari DHCP atau APIPA?"</td></tr>
<tr><td><code>ipconfig /release</code> lalu <code>/renew</code></td><td>Windows</td><td>Lepas & minta IP baru (ulangi DORA). <b>Alasan:</b> tes apakah server merespons; paksa dapat konfigurasi baru.</td></tr>
<tr><td><code>show ip dhcp binding</code></td><td>Cisco IOS</td><td>Daftar IP yang sudah disewa. <b>Alasan:</b> cek pool penuh? MAC client tercatat?</td></tr>
<tr><td><code>/ip dhcp-server lease print</code></td><td>MikroTik</td><td>Padanan MikroTik. <b>Alasan:</b> sama — verifikasi dari sisi server.</td></tr>
</table></div>
<h3>Checklist Diagnosis DHCP Gagal</h3>
<ol>
<li><b>Link & VLAN</b> (L1/L2): PC dapat link? VLAN port benar? — DHCP Discover broadcast hanya sampai dalam satu VLAN.</li>
<li><b>Server hidup & service jalan?</b> Cek dari server itu sendiri.</li>
<li><b>Pool/scope penuh?</b> <code>show ip dhcp binding</code> — kalau penuh, tidak ada IP tersisa untuk ditawarkan.</li>
<li><b>Relay/helper-address</b> (antar-VLAN): <code>show running-config | include helper-address</code> di interface VLAN — hilang = Discover tidak diteruskan.</li>
<li><b>Rogue DHCP server?</b> Ada device liar (mis. router Wi-Fi rumahan dicolok ke LAN) yang menjawab lebih dulu dengan konfigurasi salah.</li>
</ol>
<div class="callout"><div class="t">Lease Time</div><p style="margin:4px 0 0"><b>Lease time</b> = durasi sewa IP (umum 8–24 jam). PC memperpanjang otomatis di setengah waktu. Lease terlalu pendek = traffic DHCP berlebih; terlalu panjang = IP "nyangkut" di device yang sudah pergi. Untuk troubleshooting: <code>/release</code> + <code>/renew</code> memaksa siklus DORA baru seketika.</p></div>`,
      terms: [
        ['DHCP', 'Dynamic Host Configuration Protocol — pemberi IP, subnet mask, gateway, DNS otomatis (UDP 67/68).'],
        ['DORA', 'Discover–Offer–Request–Ack: 4 langkah handshake DHCP.'],
        ['Lease', 'Masa sewa IP address dari server DHCP ke client.'],
        ['APIPA', 'Automatic Private IP Addressing 169.254.0.0/16 — IP darurat Windows saat DHCP gagal.'],
        ['DHCP relay / helper-address', 'Fitur router yang meneruskan broadcast DHCP ke server di jaringan lain.'],
        ['Rogue DHCP', 'Server DHCP liar/tak resmi yang memberi konfigurasi salah — sumber gangguan misterius.'],
      ],
      diagram: `<pre>   DORA — handshake DHCP (UDP 67/68, diawali broadcast)

   [PC tanpa IP]                              [DHCP Server]
        │  1. DISCOVER (broadcast) "ada DHCP?" ──────▶│
        │  2. OFFER     "pakai 192.168.20.50" ◀────── │
        │  3. REQUEST   "OK saya ambil" ─────────────▶│
        │  4. ACK       "deal! + gateway & DNS" ◀─────│
        ▼
   PC kini punya: IP, mask, gateway, DNS (+ lease time)

   Catatan: broadcast Discover TIDAK melewati router —
   beda VLAN butuh ip helper-address di interface router.</pre>`,
      scenario: 'VLAN 40 GUEST: pengunjung tidak dapat IP (169.254.x.x), tapi VLAN 20 normal. Server DHCP sehat, pool VLAN 40 tidak penuh. Cek router: <code>ip helper-address</code> di interface VLAN 40 hilang setelah pergantian konfigurasi. Tambahkan kembali satu baris → Discover diteruskan → semua dapat IP. Satu baris, satu VLAN lumpuh.',
      bestPractices: 'Selalu exclude (kecualikan) IP gateway, server, dan printer dari DHCP pool agar tidak terjadi tabrakan dengan IP statis. Dokumentasikan range DHCP tiap VLAN.',
      security: 'Aktifkan DHCP snooping di switch (Part 29): hanya port uplink yang boleh mengirim Offer — rogue DHCP server otomatis diblokir di port access.',
      challenge: 'Di lab: jalankan ipconfig /release lalu /renew sambil capture dengan Wireshark filter "dhcp". Identifikasi 4 paket DORA dan cocokkan dengan diagram di atas.',
      interviewQ: 'Q: "PC dapat IP 169.254.x.x. Apa artinya dan langkahmu?" — A: APIPA = DHCP gagal total. Cek berlapis: link/VLAN (L1/L2), server DHCP hidup?, pool penuh?, helper-address (bila beda VLAN), dan kemungkinan rogue DHCP.',
      quiz: [
        { q: 'Urutan handshake DHCP yang benar adalah…', options: ['Request–Offer–Discover–Ack', 'Discover–Offer–Request–Ack (DORA)', 'Ack–Discover–Offer–Request', 'Offer–Discover–Ack–Request'], answer: 1, explain: 'DORA: client Discover (broadcast) → server Offer → client Request → server Ack.' },
        { q: 'Mengapa DHCP butuh helper-address untuk client di VLAN lain?', options: ['Agar lebih cepat', 'Karena Discover memakai broadcast yang tidak diteruskan router', 'Agar IP-nya statis', 'Tidak butuh'], answer: 1, explain: 'Router menghentikan broadcast (satu VLAN = satu broadcast domain); helper-address meneruskan paket DHCP ke server.' },
        { q: 'IP 169.254.x.x di PC Windows menandakan…', options: ['DHCP sukses', 'APIPA — DHCP gagal, IP darurat otomatis', 'IP statis', 'Terhubung VPN'], answer: 1, explain: 'APIPA 169.254.0.0/16 adalah "IP darurat" Windows ketika tidak ada jawaban DHCP sama sekali.' },
      ],
    },
    {
      id: '28.13',
      title: 'VLAN',
      body: `<p>Masalah <b>VLAN</b> adalah penyebab "misterius" paling umum di LAN enterprise: <b>fisiknya nyambung, IP-nya benar, tetapi tidak bisa ke mana-mana</b> — karena secara logis PC berada di "ruangan" (broadcast domain) yang salah. Ingat aturan emas: <b>1 VLAN = 1 subnet = 1 broadcast domain</b>.</p>
<h3>Gejala Khas Masalah VLAN</h3>
<ul>
<li>PC tidak bisa ping gateway <b>padahal IP satu subnet dengan gateway</b> → port di VLAN yang salah.</li>
<li>Beberapa VLAN tidak bisa lewat trunk antar-switch → <b>allowed VLAN</b> di trunk tidak mencakup VLAN itu.</li>
<li>Intermittent aneh di satu VLAN → <b>native VLAN mismatch</b> di trunk.</li>
<li>MAC address muncul di VLAN yang salah pada <code>show mac address-table</code>.</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>Device</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>show vlan brief</code></td><td>Cisco IOS</td><td>Daftar VLAN & port anggotanya. <b>Alasan:</b> verifikasi "port ini di VLAN berapa?"</td></tr>
<tr><td><code>show interfaces trunk</code></td><td>Cisco IOS</td><td>Status trunk + VLAN yang diizinkan. <b>Alasan:</b> memastikan VLAN dibutuhkan <i>boleh lewat</i> trunk.</td></tr>
<tr><td><code>show interfaces Gi0/5 switchport</code></td><td>Cisco IOS</td><td>Mode port (access/trunk) + VLAN. <b>Alasan:</b> memastikan port access tidak "kebalik" jadi trunk.</td></tr>
<tr><td><code>/interface bridge vlan print</code></td><td>MikroTik</td><td>Anggota VLAN di bridge. <b>Alasan:</b> padanan show vlan brief.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>Switch# show vlan brief
VLAN Name        Status    Ports
---- ----------- --------- -------------------------------
1    default     active    Gi0/1, Gi0/2
10   CCTV        active    Gi0/3, Gi0/4
20   OFFICE      active    Gi0/5, Gi0/6, Gi0/7
30   SERVER      active
40   GUEST       active
99   MANAGEMENT  active

Switch# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/24      1,10,20,30,40,99
                          ↑ pastikan VLAN yang dibutuhkan ADA di daftar ini</pre>
<h3>Tiga Kesalahan VLAN Klasik</h3>
<ol>
<li><b>Access VLAN salah:</b> PC office dicolok ke port VLAN 10 → dapat IP 192.168.10.x (atau APIPA), tidak bisa ke gateway 192.168.20.1. <i>Solusi:</i> <code>switchport access vlan 20</code> di port itu.</li>
<li><b>Trunk tidak membawa VLAN:</b> VLAN 30 tidak ada di <i>allowed list</i> trunk antar-switch → server di switch B terisolasi. <i>Solusi:</i> <code>switchport trunk allowed vlan add 30</code>.</li>
<li><b>Native VLAN mismatch:</b> satu sisi trunk native 1, sisi lain native 99 → traffic untagged "nyasar" ke VLAN salah + log error. <i>Solusi:</i> samakan native di kedua sisi (atau hindari pakai VLAN 1).</li>
</ol>
<div class="callout"><div class="t">Access vs Trunk — Jangan Tertukar</div><p style="margin:4px 0 0"><b>Access</b> = satu VLAN, untuk endpoint (PC/printer/CCTV). <b>Trunk</b> = banyak VLAN (ber-tag 802.1Q), untuk antar-switch / ke router / AP. PC yang dicolok ke port trunk tidak akan dapat DHCP normal — gejala "misterius" yang sebenarnya sederhana.</p></div>`,
      terms: [
        ['Access port', 'Port switch untuk satu VLAN (endpoint) — frame keluar tanpa tag.'],
        ['Trunk port', 'Port yang membawa banyak VLAN dengan tag 802.1Q — untuk antar-switch/router/AP.'],
        ['Native VLAN', 'VLAN yang dikirim tanpa tag di trunk (default VLAN 1); mismatch = traffic nyasar.'],
        ['Allowed VLAN', 'Daftar VLAN yang diizinkan lewat trunk; VLAN di luar daftar = terblokir.'],
      ],
      diagram: `<pre>   TIGA KESALAHAN VLAN KLASIK (desain: 10 CCTV, 20 OFFICE, 30 SERVER)

   1) ACCESS SALAH                    2) TRUNK TAK BAWA VLAN           3) NATIVE MISMATCH
   [PC]──port VLAN 10                 [SW-A]──trunk──[SW-B]            [SW-A]──trunk──[SW-B]
    IP 192.168.20.50                   allowed: 10,20                  native 1 | native 99
    "satu subnet dgn                    (VLAN 30 HILANG!)               → untagged nyasar
     gateway tapi tak                    server di SW-B                 → log error
     bisa ping!" →                       terisolasi!                    → samakan native!
   perbaiki: switchport
   access vlan 20</pre>`,
      scenario: 'Gedung B: user VLAN 20 tidak bisa ke server, tapi gedung A normal. show interfaces trunk di uplink gedung B: allowed 1,10,20,40,99 — VLAN 30 tidak ada! Teknisi "merapikan" konfigurasi dan menghapusnya tanpa sadar. Tambahkan kembali → normal. Moral: trunk adalah "jalan tol" VLAN — satu VLAN terhapus dari daftar = satu segmen terisolasi.',
      bestPractices: 'Jangan pakai VLAN 1 untuk traffic user (gunakan hanya sebagai bawaan), samakan native VLAN di semua trunk, dan dokumentasikan allowed VLAN tiap trunk.',
      security: 'VLAN hopping adalah serangan yang mengeksploitasi trunk/native yang ceroboh. Pertahanan: trunk hanya di port yang butuh, native VLAN ke ID tak terpakai, dan nonaktifkan DTP/auto-trunk (Part 29).',
      challenge: 'Di GNS3: buat 2 switch + 2 PC. Salahkan VLAN satu port (access vlan 10 untuk PC office). Amati gejala, diagnosis dengan show vlan brief & show mac address-table, perbaiki, verifikasi dengan ping.',
      interviewQ: 'Q: "PC IP-nya sudah satu subnet dengan gateway tapi tidak bisa ping gateway. Kemungkinan VLAN-nya?" — A: Port access di VLAN yang salah, atau trunk ke arah gateway tidak membawa VLAN itu — verifikasi dengan show vlan brief dan show interfaces trunk.',
      quiz: [
        { q: 'PC tidak bisa ping gateway padahal IP satu subnet. Pemeriksaan VLAN pertama adalah…', options: ['Restart PC', 'show vlan brief — pastikan port di VLAN yang benar', 'Ganti kabel', 'Hubungi ISP'], answer: 1, explain: 'Satu subnet tetapi beda VLAN = beda broadcast domain; verifikasi keanggotaan VLAN port dulu.' },
        { q: 'VLAN 30 tidak bisa lewat trunk antar-switch. Penyebab paling mungkin?', options: ['Kabel putus', 'VLAN 30 tidak ada di allowed VLAN trunk', 'IP salah', 'DNS down'], answer: 1, explain: 'show interfaces trunk menampilkan allowed list — VLAN di luar daftar tidak diteruskan.' },
        { q: 'Native VLAN mismatch di trunk menyebabkan…', options: ['Tidak ada efek', 'Traffic untagged nyasar ke VLAN yang salah + error log', 'Internet lebih cepat', 'VLAN terhapus'], answer: 1, explain: 'Native menentukan VLAN untuk frame tanpa tag; beda di dua sisi = frame masuk VLAN yang salah.' },
      ],
    },
    {
      id: '28.14',
      title: 'Firewall',
      body: `<p><b>Firewall</b> adalah "penjaga gerbang" yang memutuskan paket <b>boleh lewat (allow/permit)</b> atau <b>diblokir (deny)</b> berdasarkan policy/aturan. Karena firewall modern bersifat <b>stateful</b> (mengingat koneksi), masalahnya sering terlihat "searah": <i>pergi bisa, pulang tidak</i> — atau sebaliknya.</p>
<h3>Konsep Kunci: Urutan Policy & Implicit Deny</h3>
<ul>
<li>Policy dibaca <b>berurutan dari atas ke bawah</b>; paket yang cocok dengan satu policy langsung dieksekusi (allow/deny) dan <b>tidak</b> dicek ke policy bawahnya.</li>
<li>Di akhir selalu ada <b>implicit deny</b> (tak tertulis): yang tidak diizinkan = ditolak. Jadi "tidak bisa akses" sering berarti <b>belum ada policy allow</b>, bukan ada policy deny.</li>
<li>Firewall <b>stateful</b> otomatis mengizinkan paket <i>balasan</i> dari koneksi yang diizinkan — tidak perlu policy khusus untuk arah pulang.</li>
</ul>
<h3>Mendiagnosis "Diblokir Firewall?"</h3>
<ol>
<li><b>Cek hit count / log:</b> Cisco <code>show access-list</code> (lihat counter <i>matches</i> naik saat kamu test), FortiGate: lihat <i>Policy & Objects → Firewall Policy</i> kolom <i>Bytes/Sessions</i> + <i>Log Viewer</i> untuk deny.</li>
<li><b>Uji bertahap:</b> ping (ICMP) vs telnet ke port TCP — kalau ping OK tapi TCP gagal, curiga policy L4.</li>
<li><b>Baca log deny:</b> FortiGate CLI <code>diagnose debug flow</code> / GUI <i>Log Viewer</i> menunjukkan policy mana yang me-deny + alasannya.</li>
<li><b>Periksa urutan:</b> apakah ada policy deny yang <i>lebih atas</i> menelan traffic sebelum mencapai policy allow-mu?</li>
</ol>
<div class="tblwrap"><table>
<tr><th>Command / Lokasi</th><th>Platform</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>show access-list</code></td><td>Cisco IOS</td><td>Lihat ACL + hit count. <b>Alasan:</b> baris mana yang "menangkap" paketmu?</td></tr>
<tr><td><code>show ip interface Gi0/0 | include access</code></td><td>Cisco IOS</td><td>ACL apa terpasang di interface, arah in/out. <b>Alasan:</b> arah salah = policy tak berpengaruh.</td></tr>
<tr><td>GUI: <i>Policy & Objects → Firewall Policy</i></td><td>FortiGate</td><td>Lihat urutan policy & hit count. <b>Alasan:</b> visual, cocok untuk audit urutan.</td></tr>
<tr><td>GUI: <i>Log & Report → Forward Traffic</i></td><td>FortiGate</td><td>Log allow/deny per sesi. <b>Alasan:</b> bukti konkret "diblokir policy nomor berapa".</td></tr>
<tr><td><code>diagnose debug flow …</code></td><td>FortiGate CLI</td><td>Trace paket real-time. <b>Alasan:</b> melihat keputusan firewall per paket (butuh kehati-hatian di production).</td></tr>
</table></div>
<div class="callout"><div class="t">BAHAYA: Jangan Matikan Firewall untuk "Test"</div><p style="margin:4px 0 0">Godaan klasik: <i>"coba matikan firewall-nya dulu"</i>. Di production ini membuka seluruh jaringan ke serangan. Cara benar: buat <b>policy allow sempit & sementara</b> (satu sumber → satu tujuan → satu port + log), uji, lalu hapus/kembalikan. Setiap pengecualian tercatat di change log.</p></div>`,
      terms: [
        ['Stateful firewall', 'Firewall yang mengingat status koneksi; balasan dari koneksi sah otomatis diizinkan.'],
        ['Policy / ACL', 'Aturan allow/deny berurutan; dievaluasi dari atas ke bawah, pertama cocok menang.'],
        ['Implicit deny', 'Aturan tak tertulis di akhir: semua yang tidak diizinkan = ditolak.'],
        ['Hit count', 'Penghitung berapa paket cocok dengan sebuah policy — alat bukti diagnosis.'],
      ],
      diagram: `<pre>   CARA FIREWALL MEMUTUSKAN (stateful, top-down)

   Paket datang: 192.168.20.50 → 192.168.30.10 : TCP 443
        │
        ▼
   ┌ Policy 1: GUEST → ANY : DENY ── tidak cocok (sumber OFFICE) ── lewati
   ├ Policy 2: OFFICE → SERVER TCP/443 : ALLOW ── COCOK! ──▶ ALLOW + catat sesi
   └ (Policy 3 dst tidak dicek lagi)

   Paket balasan 192.168.30.10 → 192.168.20.50:
        └─▶ cocok sesi yang tercatat → ALLOW otomatis (stateful)

   Tidak cocok policy mana pun → IMPLICIT DENY.</pre>`,
      scenario: 'Aplikasi baru di VLAN 30 tidak bisa diakses dari VLAN 20. Network yakin "sudah di-allow". Log FortiGate menunjukkan deny oleh policy #7 (deny umum) — ternyata policy allow baru ditaruh di nomor #12, <i>di bawah</i> deny. Pindahkan ke atas deny → langsung jalan. Moral: di firewall, <i>posisi</i> sama pentingnya dengan <i>isi</i> aturan.',
      bestPractices: 'Beri nama & komentar tiap policy (tujuan, tanggal, tiket). Audit urutan policy berkala — policy usang yang menumpuk adalah bom waktu.',
      security: 'Prinsip default-deny + least privilege: hanya buka port yang dibutuhkan, dari sumber yang jelas, ke tujuan yang jelas. Log deny adalah sumber intelijen serangan (Part 29).',
      challenge: 'Di lab FortiGate/GNS3: buat policy allow HTTP dari OFFICE ke SERVER, lalu buat policy deny di atasnya. Uji dari PC, baca log, amati deny. Lalu tukar urutannya dan uji lagi. Catat pelajaran urutan policy.',
      interviewQ: 'Q: "Ping ke server OK tapi aplikasi web tidak bisa dibuka. Firewall dicurigai. Langkahmu?" — A: Cek hit count/log policy: policy mana yang menangkap traffic TCP/80-443 itu, periksa urutan (deny di atas allow?), dan uji dengan policy allow sempit sementara — jangan matikan firewall.',
      quiz: [
        { q: 'Paket cocok dengan policy allow di urutan #5, tetapi ada policy deny di #2 yang juga cocok. Hasilnya?', options: ['Allow (allow menang)', 'Deny — evaluasi top-down, yang pertama cocok menang', 'Diacak', 'Menunggu admin'], answer: 1, explain: 'Firewall mengevaluasi berurutan; kecocokan pertama (deny #2) langsung dieksekusi.' },
        { q: 'Tidak ada policy yang cocok dengan paket. Yang terjadi?', options: ['Allow otomatis', 'Implicit deny — paket ditolak', 'Diteruskan ke ISP', 'Masuk antrean'], answer: 1, explain: 'Default firewall adalah deny; "tidak bisa akses" sering berarti belum ada allow, bukan ada deny eksplisit.' },
        { q: 'Cara AMAN menguji dugaan "diblokir firewall" di production?', options: ['Matikan firewall sementara', 'Buat policy allow sempit + sementara + ber-log, uji, lalu kembalikan', 'Cabut kabel firewall', 'Tebak saja'], answer: 1, explain: 'Mematikan firewall membuka seluruh jaringan; policy sempit sementara memberi bukti tanpa mengorbankan keamanan.' },
      ],
    },
    {
      id: '28.15',
      title: 'NAT',
      body: `<p><b>NAT (Network Address Translation)</b> menerjemahkan IP privat (192.168.x.x) menjadi IP publik saat ke internet, dan sebaliknya. Karena hampir semua user internet memakai NAT (<b>PAT/overload</b>: banyak IP privat → satu IP publik), <b>NAT yang salah = seluruh site tidak bisa internet</b> — gejala dramatis dengan penyebab satu-dua baris konfigurasi.</p>
<h3>Konsep Kunci: Inside vs Outside</h3>
<ul>
<li><b>Inside</b> = sisi jaringan privatmu (VLAN 10/20/30/40/99). <b>Outside</b> = sisi internet/ISP.</li>
<li>Interface harus <b>diberi label</b> dengan benar (<code>ip nat inside</code> / <code>ip nat outside</code> di Cisco) — label tertukar = NAT tidak bekerja sama sekali.</li>
<li><b>ACL NAT</b> menentukan <i>traffic apa</i> yang ditranslasi. Traffic yang tidak cocok ACL = tidak di-NAT = tidak bisa internet (meski routing benar!).</li>
</ul>
<h3>Command & Penjelasan</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>Device</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>show ip nat translations</code></td><td>Cisco IOS</td><td>Daftar translasi aktif. <b>Alasan:</b> bukti NAT bekerja — ada baris = ada traffic tertranslasi.</td></tr>
<tr><td><code>show ip nat statistics</code></td><td>Cisco IOS</td><td>Hit/miss, pool. <b>Alasan:</b> miss naik = traffic tidak cocok aturan NAT.</td></tr>
<tr><td><code>/ip firewall nat print</code></td><td>MikroTik</td><td>Aturan NAT. <b>Alasan:</b> verifikasi <code>chain=srcnat action=masquerade out-interface=WAN</code>.</td></tr>
<tr><td><code>debug ip nat</code></td><td>Cisco IOS</td><td>Lihat translasi real-time. <b>Alasan:</b> diagnosis mendalam — <b>matikan setelah selesai</b> (berat di CPU).</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre>Router# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.10:51234 192.168.20.50:49152 142.250.190.14:443 142.250.190.14:443
 ▲                                                                 ▲
 IP publik (hasil NAT)                                   tujuan asli (internet)
 └─ Inside local = IP asli PC ─┘

[admin@MikroTik] &gt; /ip firewall nat print
 0  chain=srcnat action=masquerade out-interface=ether1-WAN
    ↑ aturan wajib: semua traffic keluar WAN di-masquerade ke IP publik</pre>
<h3>Tiga Kesalahan NAT Klasik</h3>
<ol>
<li><b>Label inside/outside tertukar atau hilang</b> → tidak ada translasi sama sekali. <i>Solusi:</i> pastikan <code>ip nat inside</code> di interface LAN, <code>ip nat outside</code> di interface WAN.</li>
<li><b>ACL NAT tidak mencakup subnet baru</b> → VLAN baru (mis. VLAN 40) tidak bisa internet padahal VLAN lama bisa. <i>Solusi:</i> tambah subnet ke ACL NAT.</li>
<li><b>Masquerade/rule NAT hilang di MikroTik</b> → gejala: ping ke IP publik dari router bisa, dari PC tidak. <i>Solusi:</i> buat ulang rule srcnat masquerade.</li>
</ol>
<div class="callout blue"><div class="t">Tes Pemisah NAT vs Routing</div><p style="margin:4px 0 0">Ping 8.8.8.8 dari <b>router</b> sukses tetapi dari <b>PC</b> gagal → routing ke internet OK (router bisa), curiga NAT (PC tidak ditranslasi). Cek <code>show ip nat translations</code> saat PC mencoba: tidak ada baris baru = NAT tidak memproses traffic PC.</p></div>`,
      terms: [
        ['NAT', 'Network Address Translation — menerjemahkan IP privat ↔ publik (atau antar privat).'],
        ['PAT / Overload / Masquerade', 'Banyak IP privat berbagi satu IP publik, dibedakan via nomor port — NAT rumahan/kantor standar.'],
        ['Inside / Outside', 'Label sisi jaringan: inside = privat/lokal, outside = publik/internet.'],
        ['NAT translation table', 'Daftar sesi aktif hasil translasi — bukti NAT bekerja.'],
      ],
      diagram: `<pre>   ALUR NAT (PAT/overload) — PC ke internet

   [PC 192.168.20.50:49152] ──▶ [Router NAT] ──▶ [Internet]
        inside local                 │  ganti source menjadi:
                                     │  203.0.113.10:51234 (inside global)
                                     ▼
   Balasan datang ke 203.0.113.10:51234 → router cocokkan tabel translasi
        → kembalikan ke 192.168.20.50:49152 → [PC]

   Syarat: interface berlabel inside/outside BENAR + traffic cocok ACL NAT.
   Satu syarat hilang = seluruh site tak bisa internet.</pre>`,
      scenario: 'VLAN 40 GUEST baru dibuat: user dapat IP, bisa ping gateway, tapi tidak bisa internet. VLAN lain normal. show ip nat statistics: miss naik. Cek ACL NAT: hanya mencakup 192.168.10.0/24, 192.168.20.0/24, 192.168.30.0/24 — VLAN 40 (192.168.40.0/24) belum ditambahkan. Tambah satu baris ACL → guest bisa internet. Moral: tiap VLAN baru = cek 3 hal: routing, firewall, NAT.',
      bestPractices: 'Buat checklist "VLAN baru": (1) routing antar-VLAN, (2) firewall policy, (3) NAT ACL, (4) DHCP scope, (5) monitoring. Satu checklist mencegah 5 tiket.',
      security: 'NAT bukan firewall — ia menyembunyikan IP privat tetapi tidak memblokir serangan masuk yang diizinkan policy. Jangan mengandalkan NAT sebagai satu-satunya pertahanan (lihat Part 29).',
      challenge: 'Di GNS3/MikroTik: hapus rule masquerade, amati gejala dari PC (bisa ping gateway? bisa ping IP publik?). Kembalikan rule dan verifikasi. Catat perbedaan gejala "NAT rusak" vs "routing rusak".',
      interviewQ: 'Q: "Dari router bisa ping 8.8.8.8, dari PC tidak. Routing sudah benar. Apa tersangkanya?" — A: NAT — verifikasi dengan show ip nat translations saat PC mencoba; kemungkinan label inside/outside salah atau ACL NAT tidak mencakup subnet PC.',
      quiz: [
        { q: 'Fungsi utama NAT overload/PAT adalah…', options: ['Mempercepat internet', 'Memungkinkan banyak IP privat berbagi satu IP publik, dibedakan via port', 'Mengganti DNS', 'Mengenkripsi data'], answer: 1, explain: 'PAT memetakan banyak inside-local ke satu inside-global dengan nomor port berbeda.' },
        { q: 'Label ip nat inside/outside tertukar. Akibatnya?', options: ['Internet lebih cepat', 'NAT tidak bekerja — tidak ada translasi terjadi', 'Hanya DNS gagal', 'Tidak ada efek'], answer: 1, explain: 'Router hanya mentranslasi paket yang masuk interface inside dan keluar interface outside; label salah = syarat tak terpenuhi.' },
        { q: 'VLAN baru tidak bisa internet, VLAN lama bisa. Setelah routing & firewall OK, cek…', options: ['Kabel VLAN lama', 'ACL NAT — pastikan subnet VLAN baru tercakup', 'Ganti ISP', 'Restart PC'], answer: 1, explain: 'Gejala "sebagian subnet" klasik untuk ACL NAT yang belum mencakup subnet baru.' },
      ],
    },
    {
      id: '28.16',
      title: 'MTU',
      body: `<p><b>MTU (Maximum Transmission Unit)</b> adalah ukuran <b>paket terbesar</b> yang boleh lewat satu link — standar Ethernet: <b>1500 byte</b>. Paket lebih besar dari MTU harus <b>difragmentasi</b> (dipecah) — kecuali pengirim memasang bendera <b>DF (Don\'t Fragment)</b>: "jangan pecah; kalau tidak muat, buang saja dan beri tahu saya". Masalah MTU terkenal <b>menipu</b>: hal kecil jalan, hal besar macet.</p>
<h3>Gejala Khas Masalah MTU (Hafalkan!)</h3>
<ul>
<li><b>Website kecil/ringan bisa dibuka, tetapi download file besar / upload / VPN macet atau timeout.</b></li>
<li>Ping biasa sukses, tetapi <b>ping dengan paket besar gagal</b>.</li>
<li>Aplikasi tertentu (email dengan attachment, backup, video call) gagal total sementara browsing ringan normal.</li>
<li>Sering muncul setelah memasang <b>tunnel/VPN</b> (GRE/IPsec/WireGuard menambah header → ruang data menyusut).</li>
</ul>
<h3>Mengapa Terjadi?</h3>
<p>Path dari sumber ke tujuan melewati banyak link dengan MTU berbeda. Mekanisme <b>Path MTU Discovery (PMTUD)</b> seharusnya otomatis menemukan MTU terkecil — tetapi ia bergantung pada pesan <b>ICMP "Fragmentation Needed"</b> yang sering <b>diblokir firewall</b>. Akibatnya pengirim tidak pernah tahu paketnya kebesaran → paket besar dibuang diam-diam → aplikasi macet.</p>
<h3>Command: Mencari MTU Sebenarnya</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>OS</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>ping -f -l 1472 8.8.8.8</code></td><td>Windows</td><td>1472 byte data + 28 byte header IP/ICMP = 1500. <code>-f</code> = DF bit. <b>Alasan:</b> kalau Reply = MTU 1500 OK di path ini.</td></tr>
<tr><td><code>ping -M do -s 1472 8.8.8.8</code></td><td>Linux</td><td>Padanan Linux (<code>-M do</code> = DF). <b>Alasan:</b> sama — uji batas fragmentasi.</td></tr>
</table></div>
<h3>Cara Membaca Hasil</h3>
<pre>C:\\&gt; ping -f -l 1472 8.8.8.8
Reply from 8.8.8.8: bytes=1472 time=28ms TTL=117   ← 1472 OK = MTU 1500 lolos

C:\\&gt; ping -f -l 1473 8.8.8.8
Packet needs to be fragmented but DF set.          ← 1473 GAGAL = batas ketemu!
Packet needs to be fragmented but DF set.

Rumus: ukuran_data_maks + 28 = MTU path. Turunkan angka sampai Reply muncul.</pre>
<ul>
<li><b>"Packet needs to be fragmented but DF set"</b> = paket kebesaran untuk suatu link di path. Turunkan <code>-l</code> bertahap (1472 → 1400 → 1300…) sampai Reply — itulah MTU efektif.</li>
<li>Di link VPN/tunnel, MTU efektif sering <b>1400-an</b> (GRE makan 24 byte, IPsec lebih banyak).</li>
</ul>
<h3>Solusi Umum</h3>
<ul>
<li><b>TCP MSS clamping:</b> router memaksa ukuran segmen TCP mengecil agar muat MTU tunnel — solusi standar untuk masalah MTU di VPN (MikroTik: <code>/ip firewall mangle</code> aturan <i>change-mss</i>; Cisco: <code>ip tcp adjust-mss 1360</code> di interface tunnel).</li>
<li><b>Izinkan ICMP "Fragmentation Needed"</b> di firewall (bukan blokir semua ICMP) agar PMTUD bekerja.</li>
<li>Sesuaikan MTU interface tunnel secara eksplisit bila perlu.</li>
</ul>`,
      terms: [
        ['MTU', 'Maximum Transmission Unit — ukuran paket terbesar yang boleh lewat sebuah link/interface.'],
        ['Fragmentasi', 'Pemecahan paket besar menjadi potongan-potongan kecil agar muat MTU link.'],
        ['DF bit', "Don't Fragment — bendera 'jangan pecah'; paket kebesaran dibuang + pengirim diberi tahu."],
        ['PMTUD', 'Path MTU Discovery — mekanisme otomatis menemukan MTU terkecil di sepanjang path (bergantung pada ICMP).'],
        ['MSS clamping', 'Teknik memaksa ukuran segmen TCP mengecil agar muat MTU — solusi standar masalah MTU VPN.'],
      ],
      diagram: `<pre>   MASALAH MTU DI TUNNEL VPN (gejala menipu!)

   [PC] ──1500 byte──▶ [Router] ══tunnel GRE (overhead 24 byte)══▶ [Router] ──▶ [Server]
                          │  MTU tunnel efektif: 1500-24 = 1476
                          │  Paket 1500 + DF → DIBUANG DIAM-DIAM ✖
                          ▼
   Gejala: ping kecil OK, browsing ringan OK,
           download/upload/VPN MACET.
   Solusi: MSS clamping (paksa TCP ≤ 1360) atau izinkan ICMP Fragmentation Needed.</pre>`,
      scenario: 'VPN site-to-site Jakarta–Makassar jalan (Part 31), ping OK, tetapi transfer file antar-kantor selalu gagal di tengah jalan. Ping -f -l 1472 gagal; 1400 sukses → MTU tunnel ~1428. Terapkan MSS clamping di kedua router → transfer lancar. Moral: "VPN tersambung tapi tidak bisa dipakai" = selalu curiga MTU.',
      bestPractices: 'Setiap kali membangun tunnel/VPN baru, uji MTU path dengan ping -f sebagai bagian dari commissioning — jangan tunggu user komplain transfer gagal.',
      security: 'Jangan blokir total ICMP di firewall demi "keamanan" — PMTUD butuh ICMP Fragmentation Needed. Blokir selektif lebih aman daripada blokir total yang merusak fungsi jaringan.',
      challenge: 'Uji MTU path ke 8.8.8.8 dari PC-mu: mulai -l 1472, naikkan/turunkan sampai menemukan batas. Hitung MTU efektif (data + 28). Apakah 1500?',
      interviewQ: 'Q: "Website ringan bisa dibuka tapi download selalu gagal setelah VPN dipasang. Tersangka utama?" — A: MTU — overhead header tunnel menyusutkan MTU efektif; paket besar + DF dibuang. Uji dengan ping -f dan atasi dengan MSS clamping.',
      quiz: [
        { q: 'Gejala paling khas masalah MTU adalah…', options: ['Semua mati total', 'Paket kecil/ping OK tetapi transfer besar/download macet', 'DNS lambat', 'Lampu switch mati'], answer: 1, explain: 'Hanya paket besar yang melebihi MTU yang dibuang — gejala "kecil jalan, besar macet" adalah tanda tangan MTU.' },
        { q: 'Perintah ping -f -l 1472 menguji…', options: ['Kecepatan internet', 'Apakah paket 1500 byte (1472+28 header) lolos tanpa fragmentasi — mencari MTU path', 'DNS server', 'Kekuatan sinyal Wi-Fi'], answer: 1, explain: '-f (DF) + ukuran data: "Packet needs to be fragmented" = melebihi MTU suatu link di path.' },
        { q: 'Solusi standar masalah MTU di tunnel VPN adalah…', options: ['Ganti kabel', 'TCP MSS clamping — mengecilkan segmen TCP agar muat MTU tunnel', 'Restart router tiap jam', 'Naikkan bandwidth'], answer: 1, explain: 'MSS clamping memaksa TCP memakai segmen kecil sejak handshake, menghindari paket kebesaran.' },
      ],
    },
    {
      id: '28.17',
      title: 'Packet Capture',
      body: `<p><b>Packet capture</b> adalah merekam <b>paket asli</b> yang lewat di sebuah titik jaringan untuk dianalisis. Ini adalah "bukti final" troubleshooting: saat semua teori habis, capture menunjukkan <i>apa yang sebenarnya terjadi di kabel</i> — siapa bicara dengan siapa, urutan paketnya, dan di mana ia berhenti.</p>
<h3>Kapan Capture Dibutuhkan?</h3>
<ul>
<li>Ping/traceroute tidak memberi jawaban yang jelas ("aneh, tidak masuk akal").</li>
<li>Dugaan masalah <b>aplikasi vs jaringan</b>: apakah server tidak menjawab, atau jawabannya tidak sampai?</li>
<li>Kasus <b>intermittent</b>: rekam dulu, analisis kemudian saat gangguan terjadi.</li>
<li>Verifikasi setelah perbaikan: "apakah handshake TCP kini lengkap?"</li>
</ul>
<h3>Tool & Command</h3>
<div class="tblwrap"><table>
<tr><th>Command</th><th>Platform</th><th>Penjelasan / Alasan</th></tr>
<tr><td><code>tcpdump -i eth0 -n</code></td><td>Linux</td><td>Capture semua paket di eth0, <code>-n</code> = jangan resolve nama (lebih cepat & jujur). <b>Alasan:</b> lihat traffic mentah real-time.</td></tr>
<tr><td><code>tcpdump -i eth0 -n host 192.168.20.50</code></td><td>Linux</td><td>Filter satu host. <b>Alasan:</b> fokus — capture tanpa filter di jaringan sibuk = lautan data.</td></tr>
<tr><td><code>tcpdump -i eth0 -n port 80 -w hasil.pcap</code></td><td>Linux</td><td>Simpan ke file. <b>Alasan:</b> <code>-w</code> untuk dianalisis di Wireshark (28.18) atau dikirim ke tim lain.</td></tr>
<tr><td><code>tcpdump -i eth0 -n icmp</code></td><td>Linux</td><td>Hanya ICMP. <b>Alasan:</b> saat fokus ke ping/traceroute.</td></tr>
<tr><td><code>/tool sniffer start/stop; /tool sniffer packet print</code></td><td>MikroTik</td><td>Capture di router. <b>Alasan:</b> melihat paket <i>dari sudut pandang router</i> — bisa juga streaming ke Wireshark.</td></tr>
</table></div>
<h3>Contoh Output & Cara Membacanya</h3>
<pre># tcpdump -i eth0 -n host 192.168.20.50
10:01:02.123456 IP 192.168.20.50.49152 &gt; 192.168.30.10.80: Flags [S], seq 1000
                 ↑ SYN = "mau buka koneksi TCP" (awal handshake)
10:01:02.124001 IP 192.168.30.10.80 &gt; 192.168.20.50.49152: Flags [S.], seq 5000, ack 1001
                 ↑ SYN-ACK = server menjawab "OK, siap"
10:01:05.130000 IP 192.168.20.50.49152 &gt; 192.168.30.10.80: Flags [S], seq 1000
                 ↑ SYN diulang 3 detik kemudian = SYN-ACK TIDAK SAMPAI ke client!</pre>
<ul>
<li><b>SYN tanpa SYN-ACK</b> → server tidak menjawab / firewall memblokir / rute pulang hilang. Lokasi masalah: sisi server.</li>
<li><b>SYN → SYN-ACK → ACK lengkap</b> tetapi aplikasi error → masalah di Layer 7, bukan jaringan.</li>
<li><b>Banyak retransmission</b> (paket sama dikirim ulang) → loss/congestion di path.</li>
<li><b>RST tiba-tiba</b> → salah satu pihak memutus paksa (port tutup / aplikasi crash / firewall).</li>
</ul>
<div class="callout"><div class="t">Hati-hati di Production</div><p style="margin:4px 0 0">Capture di interface sibuk membebani CPU router dan menghasilkan file raksasa. Selalu pakai <b>filter</b> (host/port), batasi durasi, dan jangan capture di core router jam sibuk tanpa persetujuan. Capture juga bisa merekam data sensitif (password non-enkripsi!) — perlakukan file .pcap sebagai data rahasia.</p></div>`,
      terms: [
        ['Packet capture / sniffing', 'Perekaman paket asli yang lewat di suatu titik untuk analisis.'],
        ['tcpdump', 'Tool capture baris-perintah standar di Linux — ringan dan selalu tersedia.'],
        ['Filter capture', 'Batasan (host/port/protokol) agar capture fokus dan tidak membanjiri.'],
        ['.pcap', 'Format file hasil capture yang bisa dibuka di Wireshark.'],
      ],
      diagram: `<pre>   MEMBACA HASIL CAPTURE: di mana berhentinya?

   Kasus A — server tidak menjawab:          Kasus B — jaringan sehat:
   PC ──SYN──▶ (server)                      PC ──SYN──▶ (server)
   PC ──SYN──▶ (tak ada balasan) ✖            ◀──SYN-ACK──
   PC ──SYN──▶ (tak ada balasan) ✖            PC ──ACK──▶  → koneksi JALAN
   → masalah di SISI SERVER                   → kalau app tetap error,
     (firewall/port tutup/server down)           masalahnya LAYER 7.

   Capture menjawab pertanyaan: "paketnya sampai mana?"</pre>`,
      scenario: 'Aplikasi kasir "kadang gagal bayar". Semua tes (ping, traceroute) normal. Capture saat kejadian: terlihat pola SYN → (hening 3 detik) → SYN ulang → akhirnya RST dari firewall yang kehabisan session table saat jam ramai. Root cause bukan aplikasi, bukan routing — melainkan session table firewall penuh. Tanpa capture, kasus ini bisa jadi misteri berminggu-minggu.',
      bestPractices: 'Capture dengan hipotesis: tentukan dulu "apa yang ingin saya buktikan" (mis. "apakah SYN-ACK kembali?"), lalu filter sesuai itu. Capture tanpa tujuan = menatap lautan paket.',
      security: 'File .pcap dapat berisi kredensial dan data pribadi bila traffic tidak terenkripsi. Simpan aman, batasi akses, hapus setelah analisis selesai — dan jadikan temuan "password lewat plaintext" sebagai temuan keamanan (Part 29).',
      challenge: 'Di Linux/lab: jalankan tcpdump -n host [IP-teman] sambil ia ping kamu. Amati pasangan Echo Request/Reply. Lalu buka web dan filter port 80 — identifikasi SYN, SYN-ACK, ACK.',
      interviewQ: 'Q: "Kapan kamu memutuskan memakai packet capture?" — A: Saat tool lain buntu, saat perlu membedakan masalah jaringan vs aplikasi secara definitif, atau untuk kasus intermittent — capture adalah bukti final "paket sampai mana".',
      quiz: [
        { q: 'Pola SYN berulang tanpa SYN-ACK pada capture menunjukkan…', options: ['Jaringan sehat', 'Server/firewall di sisi tujuan tidak menjawab — masalah di sisi sana', 'DNS gagal', 'Kabel putus di client'], answer: 1, explain: 'SYN sampai (atau tidak) tetapi tak ada balasan → selidiki server, port, firewall, atau rute pulang.' },
        { q: 'Mengapa opsi -n penting pada tcpdump?', options: ['Agar berwarna', 'Menonaktifkan resolusi nama — lebih cepat dan tidak menambah traffic DNS yang mengaburkan hasil', 'Agar bisa di-root', 'Wajib hukum'], answer: 1, explain: 'Resolusi nama menambah query DNS sendiri + memperlambat tampilan; -n menampilkan IP apa adanya.' },
        { q: 'Aturan capture yang AMAN di production adalah…', options: ['Capture semua interface seharian', 'Pakai filter spesifik, batasi durasi, hindari jam sibuk, perlakukan .pcap sebagai data sensitif', 'Share .pcap ke grup umum', 'Capture tanpa izin'], answer: 1, explain: 'Capture membebani device dan bisa merekam data sensitif — filter + izin + kerahasiaan adalah wajib.' },
      ],
    },
    {
      id: '28.18',
      title: 'Wireshark',
      body: `<p><b>Wireshark</b> adalah aplikasi analisis packet capture paling populer di dunia — "mikroskop" jaringan. Kalau tcpdump (28.17) adalah kamera perekam, Wireshark adalah <b>laboratorium</b> tempat kamu membedah hasil rekaman: memfilter jutaan paket, mengikuti satu koneksi TCP dari awal sampai akhir, dan membaca setiap byte header.</p>
<h3>Mengapa Wireshark (bukan sekadar tcpdump)?</h3>
<ul>
<li><b>Display filter</b> yang ekspresif: <code>ip.addr == 192.168.20.50</code>, <code>tcp.port == 443</code>, <code>dns</code>, <code>icmp</code> — isolasi masalah dalam detik.</li>
<li><b>Follow TCP Stream:</b> rangkai seluruh percakapan satu koneksi menjadi teks yang bisa dibaca manusia.</li>
<li><b>Pewarnaan otomatis:</b> paket bermasalah (retransmission, RST, checksum error) ditandai warna mencolok.</li>
<li><b>Statistik:</b> IO graph untuk melihat pola loss/latency dari waktu ke waktu.</li>
</ul>
<h3>Filter Penting untuk Troubleshooting</h3>
<div class="tblwrap"><table>
<tr><th>Filter</th><th>Menampilkan</th><th>Alasan Dipakai</th></tr>
<tr><td><code>ip.addr == 192.168.20.50</code></td><td>Semua paket dari/ke satu host</td><td>Fokus ke satu client bermasalah</td></tr>
<tr><td><code>tcp.port == 80</code></td><td>Traffic web</td><td>Isolasi layanan tertentu</td></tr>
<tr><td><code>dns</code></td><td>Query & jawaban DNS</td><td>Diagnosis "nama tidak resolve" (lihat 28.11)</td></tr>
<tr><td><code>tcp.flags.syn==1 and tcp.flags.ack==0</code></td><td>Hanya SYN awal</td><td>Hitung upaya koneksi vs yang berhasil</td></tr>
<tr><td><code>tcp.analysis.retransmission</code></td><td>Paket dikirim ulang</td><td>Bukti packet loss di path</td></tr>
<tr><td><code>dhcp</code> atau <code>bootp</code></td><td>Handshake DORA</td><td>Diagnosis DHCP gagal (lihat 28.12)</td></tr>
</table></div>
<h3>Membaca Tiga Sinyal Klasik</h3>
<ol>
<li><b>Handshake tak lengkap:</b> SYN → … (hening) → SYN ulang = server/firewall tidak menjawab (masalah sisi tujuan).</li>
<li><b>RST merah:</b> koneksi diputus paksa — cek siapa mengirim RST pertama: kalau server, aplikasinya menolak; kalau firewall di tengah, policy/session.</li>
<li><b>Retransmission berulang (baris hitam):</b> paket hilang di jalan — korelasikan dengan waktu: terjadi terus-menerus (link rusak) atau berkala (congestion jam sibuk)?</li>
</ol>
<div class="callout blue"><div class="t">Alur Kerja Standar</div><p style="margin:4px 0 0">1) Capture dengan filter di titik yang tepat (28.17) → 2) Buka .pcap di Wireshark → 3) Terapkan display filter → 4) Klik kanan satu paket → <i>Follow → TCP Stream</i> → 5) Baca "percakapan"-nya. Lima langkah ini menyelesaikan mayoritas kasus "aplikasi vs jaringan".</p></div>`,
      terms: [
        ['Wireshark', 'Aplikasi analisis packet capture (gratis) — standar industri untuk bedah paket.'],
        ['Display filter', 'Filter tampilan Wireshark (mis. ip.addr == x) — berbeda dengan filter saat capture.'],
        ['Follow TCP Stream', 'Fitur merangkai seluruh paket satu koneksi TCP menjadi percakapan utuh.'],
        ['Retransmission', 'Pengiriman ulang paket yang hilang — indikator packet loss, ditandai otomatis.'],
      ],
      diagram: `<pre>   MEMBACA WIRESHARK: tiga sinyal klasik

   [1] HANDSHAKE TAK LENGKAP        [2] RST MERAH              [3] RETRANSMISSION
   No.  Source → Dest   Info        No.  Info                 No.  Info (baris hitam)
   1    PC → SRV  SYN               1    SYN                  1    TCP segment seq 1000
   2    PC → SRV  SYN (ulang!)      2    SYN-ACK              2    TCP segment seq 1000 (ULANG!)
   3    PC → SRV  SYN (ulang!)      3    RST ← siapa kirim?   3    TCP segment seq 1000 (ULANG!)
   → server tak menjawab            → koneksi diputus paksa   → paket hilang di jalan
     (sisi tujuan bermasalah)         (cek pengirim RST)        (loss/congestion)</pre>`,
      scenario: 'User: "Login aplikasi lemot banget, kadang gagal." Ping & traceroute normal. Wireshark di PC user: handshake TCP ke server butuh 6 detik karena SYN pertama selalu hilang — pola retransmission konsisten tiap koneksi baru. Ternyata firewall melakukan "SYN proxy" agresif yang rusak setelah update. Buktinya di capture → vendor firewall dipanggil dengan bukti konkret.',
      bestPractices: 'Pelajari 5 pola dulu sampai hafal: handshake lengkap, SYN tanpa balasan, RST, retransmission, dan DNS query tanpa jawaban. 90% kasus troubleshooting hanya butuh lima pola ini.',
      security: 'Wireshark menampilkan isi paket apa adanya — termasuk password bila aplikasi tidak memakai enkripsi (HTTP, Telnet, FTP). Temuan ini = temuan keamanan serius: dorong migrasi ke HTTPS/SSH (Part 29).',
      challenge: 'Capture 30 detik browsing-mu sendiri, buka di Wireshark (atau pelajari contoh capture publik). Terapkan filter dns lalu tcp.port==443. Bisakah kamu menemukan handshake lengkap sebuah koneksi HTTPS?',
      interviewQ: 'Q: "Semua tes jaringan normal tapi aplikasi tetap error. Bagaimana Wireshark membantumu?" — A: Capture di client: kalau handshake TCP lengkap tetapi aplikasi error → masalah Layer 7 (bukan jaringan). Kalau SYN tak berbalas / RST → bukti jaringan/firewall/server yang bermasalah — Wireshark memisahkan keduanya secara definitif.',
      quiz: [
        { q: 'Fungsi "Follow TCP Stream" di Wireshark adalah…', options: ['Mempercepat capture', 'Merangkai seluruh paket satu koneksi TCP menjadi percakapan utuh yang mudah dibaca', 'Menghapus paket', 'Mengganti IP'], answer: 1, explain: 'Follow stream menyusun ulang segmen TCP menjadi aliran data logis — cara tercepat "membaca" apa yang dipertukarkan aplikasi.' },
        { q: 'Banyak baris hitam "retransmission" pada capture menunjukkan…', options: ['Jaringan sehat', 'Packet loss di path — paket dikirim ulang karena tak di-ACK', 'DNS gagal', 'Capture rusak'], answer: 1, explain: 'Retransmission = pengirim tidak menerima ACK tepat waktu; pola ini menandakan loss atau latency ekstrem.' },
        { q: 'Untuk mengisolasi masalah satu client di Wireshark, filter yang tepat…', options: ['ip.addr == [IP client]', 'delete all', 'tcp.port == 99999', 'frame contains password'], answer: 0, explain: 'ip.addr == x menampilkan semua paket dari/ke host itu — langkah fokus pertama sebelum filter lebih spesifik.' },
      ],
    },
    {
      id: '28.19',
      title: 'Kumpulan Skenario Troubleshooting',
      body: `<p>Lima belas skenario latihan — pola <b>gejala → hipotesis → langkah diagnosis → perintah → solusi</b>. Kerjakan seperti simulasi tiket NOC: baca gejala, <i>tebak dulu</i> sebelum membaca solusinya. Inilah "ujian lapangan" seluruh Part 28.</p>
<h3>Skenario 1: PC Tidak Dapat Internet</h3>
<p><b>Gejala:</b> Satu PC di VLAN 20 tidak bisa browsing; PC lain normal.<br><b>Hipotesis:</b> Masalah lokal di PC itu (bukan infrastruktur).<br><b>Diagnosis:</b> 1) <code>ping 192.168.20.1</code> (gateway) → gagal. 2) <code>ipconfig /all</code> → IP 192.168.20.50/24, gateway benar. 3) <code>arp -a</code> → MAC gateway <i>incomplete</i>.<br><b>Solusi:</b> ARP gagal padahal IP benar → cek fisik: kabel longgar di patch panel. Colok ulang → ARP terisi → normal. <i>Pelajaran: ping gagal + ARP incomplete = Layer 2.</i></p>
<h3>Skenario 2: PC Tidak Mendapatkan DHCP</h3>
<p><b>Gejala:</b> PC baru di VLAN 40 dapat IP 169.254.x.x; VLAN lain normal.<br><b>Hipotesis:</b> DHCP Discover tidak sampai ke server (relay) atau pool penuh.<br><b>Diagnosis:</b> 1) <code>ipconfig /release</code> + <code>/renew</code> → tetap gagal. 2) <code>/ip dhcp-server lease print</code> (MikroTik) → pool VLAN 40 masih longgar. 3) Cek router: <code>ip helper-address</code> di interface VLAN 40 <b>hilang</b>.<br><b>Solusi:</b> Tambahkan kembali <code>ip helper-address 192.168.30.5</code> (IP server DHCP). Renew → dapat IP. <i>Pelajaran: beda VLAN butuh relay; satu baris hilang = satu VLAN lumpuh.</i></p>
<h3>Skenario 3: VLAN Tidak Bisa Komunikasi Antar-VLAN</h3>
<p><b>Gejala:</b> VLAN 20 tidak bisa ping server di VLAN 30; dalam VLAN masing-masing normal.<br><b>Hipotesis:</b> Routing antar-VLAN atau firewall.<br><b>Diagnosis:</b> 1) <code>ping 192.168.20.1</code> OK (lokal sehat). 2) <code>traceroute 192.168.30.10</code> → berhenti di firewall. 3) <code>show ip route</code> di router → rute ke 192.168.30.0/24 <b>tidak ada</b>.<br><b>Solusi:</b> Static route ke firewall terhapus saat maintenance → tambahkan kembali. Verifikasi ping dua arah. <i>Pelajaran: routing dua arah — cek tabel di kedua sisi.</i></p>
<h3>Skenario 4: Trunk Salah (VLAN Tidak Lewat Antar-Switch)</h3>
<p><b>Gejala:</b> User VLAN 20 di gedung B tidak bisa ke server; gedung A normal.<br><b>Hipotesis:</b> Trunk uplink gedung B tidak membawa VLAN 30.<br><b>Diagnosis:</b> 1) <code>show interfaces trunk</code> di switch gedung B → allowed: 1,10,20,40,99 — <b>VLAN 30 tidak ada</b>. 2) <code>show mac address-table</code> → tidak ada MAC VLAN 30 dari arah trunk.<br><b>Solusi:</b> <code>switchport trunk allowed vlan add 30</code> di kedua sisi trunk. Verifikasi ping. <i>Pelajaran: trunk = jalan tol VLAN; satu VLAN terhapus dari daftar = satu segmen terisolasi.</i></p>
<h3>Skenario 5: Gateway Salah di PC</h3>
<p><b>Gejala:</b> Satu PC tidak bisa ke luar subnet; PC lain normal.<br><b>Hipotesis:</b> Konfigurasi IP lokal salah.<br><b>Diagnosis:</b> 1) <code>ipconfig /all</code> → gateway tertulis 192.168.20.254, padahal gateway resmi 192.168.20.1. 2) <code>ping 192.168.20.1</code> OK (gateway asli hidup).<br><b>Solusi:</b> Betulkan gateway ke 192.168.20.1 (atau perbaiki via DHCP). <i>Pelajaran: "destination unreachable" + satu PC = cek ipconfig dulu, 30 detik.</i></p>
<h3>Skenario 6: Route Hilang</h3>
<p><b>Gejala:</b> Seluruh VLAN 20 tidak bisa ke internet sejak maintenance malam; ke server lokal bisa.<br><b>Hipotesis:</b> Default route / rute ke ISP hilang.<br><b>Diagnosis:</b> 1) <code>ping 8.8.8.8</code> dari router → gagal. 2) <code>show ip route</code> → baris <code>S* 0.0.0.0/0</code> <b>tidak ada</b>. 3) Cek <code>show running-config</code> → static default route tidak tersimpan (lupa <code>write memory</code>!).<br><b>Solusi:</b> Tambahkan <code>ip route 0.0.0.0 0.0.0.0 203.0.113.1</code> lalu <b>simpan</b> (<code>write memory</code> / <code>copy run start</code>). <i>Pelajaran: konfigurasi yang tidak disimpan = hilang saat reload. Selalu save!</i></p>
<h3>Skenario 7: NAT Salah</h3>
<p><b>Gejala:</b> VLAN 40 (baru) tidak bisa internet; VLAN lain bisa. Bisa ping gateway.<br><b>Hipotesis:</b> ACL NAT belum mencakup subnet baru.<br><b>Diagnosis:</b> 1) <code>ping 8.8.8.8</code> dari router OK, dari PC gagal → curiga NAT (bukan routing). 2) <code>show ip nat translations</code> saat PC mencoba → <b>tidak ada baris baru</b>. 3) Cek ACL NAT → hanya 192.168.10/20/30.0/24, <b>tanpa 192.168.40.0/24</b>.<br><b>Solusi:</b> Tambahkan 192.168.40.0/24 ke ACL NAT. <i>Pelajaran: tiap VLAN baru = cek routing, firewall, NAT, DHCP.</i></p>
<h3>Skenario 8: Firewall Block</h3>
<p><b>Gejala:</b> Aplikasi baru di VLAN 30 tidak bisa diakses dari VLAN 20; ping ke server OK.<br><b>Hipotesis:</b> Policy firewall (ping OK = L3 lewat, TCP diblokir = L4).<br><b>Diagnosis:</b> 1) <code>telnet 192.168.30.10 8080</code> → timeout. 2) Log FortiGate <i>Forward Traffic</i> → <b>deny oleh policy #7</b>. 3) Cek urutan → policy allow baru ada di #12, <b>di bawah</b> deny.<br><b>Solusi:</b> Pindahkan policy allow ke atas policy deny. Uji ulang + lihat hit count naik. <i>Pelajaran: di firewall, posisi aturan sama penting dengan isinya.</i></p>
<h3>Skenario 9: DNS Gagal</h3>
<p><b>Gejala:</b> "Internet mati" menurut seluruh kantor; teknisi panik.<br><b>Hipotesis:</b> Belum tentu internet — bisa DNS.<br><b>Diagnosis:</b> 1) <code>ping 8.8.8.8</code> → <b>sukses</b> (internet hidup!). 2) <code>nslookup google.com</code> → timeout. 3) <code>ping 192.168.30.5</code> (DNS internal) → gagal; server down setelah update.<br><b>Solusi:</b> Sementara: arahkan DHCP ke DNS publik. Permanen: perbaiki service DNS internal. <i>Pelajaran: ping IP vs ping nama adalah tes pemisah paling terkenal.</i></p>
<h3>Skenario 10: Interface Down</h3>
<p><b>Gejala:</b> Satu gedung mati total tiba-tiba.<br><b>Hipotesis:</b> Layer 1/2 — mulai dari fisik (bottom-up).<br><b>Diagnosis:</b> 1) <code>show interfaces status</code> → uplink Gi0/24 <b>notconnect</b>, lampu mati. 2) Cek fisik → kabel fiber tertekuk tajam di pintu rak (maintenance tadi siang). 3) <code>show interfaces Gi0/24 counters errors</code> → CRC naik sebelum putus total.<br><b>Solusi:</b> Ganti kabel fiber, rapikan jalur kabel (radius tekuk!). Verifikasi link up + CRC berhenti naik. <i>Pelajaran: gangguan total = bottom-up; 80% adalah fisik.</i></p>
<h3>Skenario 11: Packet Loss</h3>
<p><b>Gejala:</b> Video call putus-putus, ping kadang RTO (loss ~8%), di satu segmen saja.<br><b>Hipotesis:</b> Media rusak atau congestion.<br><b>Diagnosis:</b> 1) <code>ping -t</code> 5 menit → loss konsisten 5–10% (bukan sesekali). 2) <code>show interfaces counters errors</code> → <b>CRC/FCS error naik</b> di satu uplink. 3) Pola konsisten (bukan jam sibuk saja) → bukan congestion.<br><b>Solusi:</b> Ganti kabel/SFP port itu; loss → 0%. <i>Pelajaran: loss konsisten = fisik; loss hanya jam sibuk = congestion.</i></p>
<h3>Skenario 12: High Latency</h3>
<p><b>Gejala:</b> Akses ke aplikasi cabang lambat sejak kemarin; tidak ada yang "mati".<br><b>Hipotesis:</b> Latency naik di suatu hop / link congested.<br><b>Diagnosis:</b> 1) <code>traceroute</code> ke cabang → hop 3 (link ISP) melonjak 15 ms → 380 ms. 2) <code>mtr --report</code> 10 menit → loss 3% + latency tinggi <b>hanya</b> di hop 3 ke atas. 3) Cek utilization link (Zabbix) → 95% terus.<br><b>Solusi:</b> Eskalasi ke ISP dengan bukti MTR + ajukan upgrade bandwidth / QoS sementara. <i>Pelajaran: latency per-hop + baseline = bukti konkret, bukan "katanya lemot".</i></p>
<h3>Skenario 13: Duplicate IP</h3>
<p><b>Gejala:</b> PC kadang bisa kadang tidak ("koneksi putus-nyambung"); Windows menampilkan peringatan "IP address conflict".<br><b>Hipotesis:</b> Dua perangkat memakai IP sama.<br><b>Diagnosis:</b> 1) <code>arp -a</code> diulang beberapa kali → MAC untuk 192.168.20.50 <b>berubah-ubah</b>. 2) <code>show ip dhcp binding</code> → IP itu ter-lease ke MAC lain. 3) Ketemu: printer diset IP statis manual = IP dalam range DHCP.<br><b>Solusi:</b> Pindahkan printer ke IP di luar pool DHCP (atau buat reservasi). Exclude range IP statis dari pool. <i>Pelajaran: IP statis hanya di luar range DHCP — tanpa kecuali.</i></p>
<h3>Skenario 14: Loop Network (Broadcast Storm)</h3>
<p><b>Gejala:</b> Seluruh LAN lumpuh mendadak; lampu semua port switch berkedip liar; CPU switch 100%.<br><b>Hipotesis:</b> Loop Layer 2 → broadcast storm.<br><b>Diagnosis:</b> 1) Log: <b>"MAC flapping"</b> di banyak port. 2) Wireshark/tcpdump → broadcast ARP ribuan per detik. 3) Telusuri fisik → ada kabel <b>menghubungkan dua port switch yang sama</b> (user "merapikan" kabel).<br><b>Solusi:</b> Cabut kabel loop → storm berhenti seketika. Permanen: pastikan <b>STP aktif</b> (Part 10) + <b>port-security / BPDU guard</b> di port access (Part 29). <i>Pelajaran: loop = darurat; cabut dulu, analisis kemudian.</i></p>
<h3>Skenario 15: MTU Problem</h3>
<p><b>Gejala:</b> VPN site-to-site tersambung, ping OK, tetapi transfer file antar-kantor selalu gagal di tengah.<br><b>Hipotesis:</b> MTU — overhead tunnel membuat paket besar dibuang.<br><b>Diagnosis:</b> 1) <code>ping -f -l 1472 [IP cabang]</code> → "Packet needs to be fragmented". 2) Turunkan: <code>-l 1400</code> → Reply! MTU efektif ~1428. 3) Firewall memblokir ICMP Fragmentation Needed → PMTUD mati.<br><b>Solusi:</b> Terapkan <b>MSS clamping</b> di kedua router tunnel + izinkan ICMP Fragmentation Needed. Transfer lancar. <i>Pelajaran: "kecil jalan, besar macet" = tanda tangan MTU.</i></p>
<div class="callout blue"><div class="t">Pola Pikir 15 Skenario</div><p style="margin:4px 0 0">Perhatikan polanya: <b>selalu mulai dari gejala → hipotesis → tes yang membuktikan → solusi minimal</b>. Tidak ada satu pun skenario yang diselesaikan dengan "coba-coba". Inilah yang membedakan engineer: setiap langkah punya alasan, setiap solusi punya bukti.</p></div>`,
      terms: [
        ['Tiket NOC', 'Laporan gangguan terstruktur yang ditangani dengan metodologi — bukan dengan panik.'],
        ['Eskalasi', 'Meneruskan masalah ke pihak berwenang (ISP/vendor) beserta bukti diagnosis.'],
        ['Baseline', 'Kondisi normal yang terdokumentasi — pembanding saat ada anomali.'],
      ],
      diagram: `<pre>   PETA CEPAT 15 SKENARIO → TOOL UTAMA

   1  PC tak bisa internet .... ping gateway + arp -a        (L2 lokal)
   2  DHCP gagal .............. ipconfig /renew + cek relay  (DORA)
   3  Antar-VLAN mati ......... traceroute + show ip route   (routing)
   4  Trunk salah ............. show interfaces trunk       (L2)
   5  Gateway salah ........... ipconfig /all               (IP lokal)
   6  Route hilang ............ show ip route + write mem!  (routing)
   7  NAT salah ............... show ip nat translations    (NAT)
   8  Firewall block .......... log deny + urutan policy    (L4/policy)
   9  DNS gagal ............... ping IP vs ping nama         (L7)
   10 Interface down .......... show interfaces status      (L1)
   11 Packet loss ............. ping -t + counters errors   (L1/congestion)
   12 High latency ............ traceroute + mtr            (per-hop)
   13 Duplicate IP ............ arp -a (MAC berubah-ubah)   (L2/L3)
   14 Loop .................... MAC flapping + cabut kabel! (L2 darurat)
   15 MTU ..................... ping -f -l + MSS clamping   (tunnel)</pre>`,
      scenario: 'Malam minggu, NOC menerima 3 tiket sekaligus: "internet lambat" (ternyata skenario 12 — laporkan ke ISP dengan bukti MTR), "PC baru tidak dapat IP" (skenario 2 — helper-address), dan "seluruh LAN lumpuh" (skenario 14 — loop! cabut kabel dulu). Prioritas: loop dulu (darurat total), lalu DHCP, lalu latency. Troubleshooting bukan hanya soal teknis — tapi juga soal prioritas.',
      bestPractices: 'Bangun runbook dari skenario ini: tiap skenario = 1 halaman (gejala, perintah, solusi). Tempel di wiki tim. Engineer baru bisa menangani 80% tiket umum hanya dengan runbook ini.',
      security: 'Beberapa skenario beririsan dengan keamanan: rogue DHCP (skenario 2), ARP/duplicate IP (13), dan loop yang bisa disengaja. Pertahanan proaktifnya ada di Part 29: DHCP snooping, DAI, port-security, BPDU guard.',
      challenge: 'Pilih 3 skenario dan praktikkan di GNS3: buat kerusakannya sendiri (hapus route, salah VLAN, blokir ICMP), lalu tukar dengan teman — ia mendiagnosis tanpa diberi tahu kerusakannya. Ini adalah simulasi tiket NOC yang sesungguhnya.',
      interviewQ: 'Q: "Ceritakan troubleshooting tersulit yang pernah kamu lakukan." — A: (Pakai format STAR + 15 skenario ini sebagai bank cerita) Jelaskan gejala, hipotesismu, perintah yang dipakai, dan buktinya — pewawancara menilai <i>cara berpikirmu</i>, bukan sekadar solusinya.',
      quiz: [
        { q: 'Skenario "VPN tersambung tapi transfer file gagal" paling mengarah ke…', options: ['Kabel putus', 'Masalah MTU — overhead tunnel membuang paket besar', 'DNS gagal', 'Switch penuh'], answer: 1, explain: 'Pola "kecil jalan, besar macet" setelah VPN dipasang adalah tanda tangan klasik MTU.' },
        { q: 'Lampu semua port berkedip liar + log MAC flapping. Tindakan PERTAMA?', options: ['Restart switch', 'Temukan dan cabut kabel loop — hentikan storm dulu', 'Update firmware', 'Hubungi ISP'], answer: 1, explain: 'Broadcast storm adalah darurat: hentikan loop fisik dulu, analisis dan pencegahan (STP/BPDU guard) setelahnya.' },
        { q: 'Dua perangkat berebut satu IP. Bukti paling jelas?', options: ['Ping lambat', 'ARP table menunjukkan MAC berubah-ubah untuk IP yang sama', 'Kabel panas', 'DNS error'], answer: 1, explain: 'Satu IP = satu MAC stabil; perubahan cepat = duplicate IP (atau spoofing).' },
      ],
    },
  ],
};
