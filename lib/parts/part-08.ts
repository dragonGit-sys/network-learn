// Part 08 — Switching Fundamentals (Fase 2: Switching & Routing).
// Materi murni: konsep cara kerja switch Layer 2 sebagai fondasi VLAN (Part 09) dan STP (Part 10).
import type { Part } from './types';

export const part08: Part = {
  id: '08',
  number: 'PART 08',
  title: 'Switching Fundamentals',
  phaseId: 'fase-2',
  description: 'Cara kerja switch Layer 2: MAC learning, forwarding, flooding, aging, access port, trunk port, dan 802.1Q.',
  repoFolder: 'part-08-switching-fundamentals',
  objectives: [
    'Menjelaskan peran switch sebagai perangkat Layer 2 dan bedanya dengan hub dan router.',
    'Menjelaskan siklus kerja switch: MAC learning → forwarding → flooding → aging melalui MAC address table.',
    'Membedakan access port dan trunk port serta peran native VLAN dan 802.1Q tagging.',
    'Mengonfigurasi access port dan trunk port di Cisco IOS dengan verifikasi yang benar.',
    'Mendiagnosis masalah switching umum (port salah VLAN, trunk mismatch, tabel MAC penuh).',
  ],
  prerequisites: 'Part 01 (konsep network & segmentasi), Part 02 (model OSI & frame Ethernet), Part 03 (MAC address), Part 05 (IP & subnetting).',
  subbabs: [
    {
      id: '8.1',
      title: 'Apa Itu Switch?',
      body: `
<p><b>Switch</b> adalah perangkat jaringan yang bekerja di <b>Layer 2 (Data Link)</b> model OSI. Tugasnya satu: <b>meneruskan frame Ethernet ke port yang tepat</b> berdasarkan alamat MAC tujuan — bukan ke semua port.</p>
<h3>Pengertian Sederhana vs Teknis</h3>
<p><b>Sederhana:</b> kalau hub adalah pengeras suara (teriak ke semua orang di ruangan), switch adalah resepsionis yang tahu persis nomor kamar setiap tamu — ia mengantar paket hanya ke kamar yang dituju.</p>
<p><b>Teknis:</b> switch membaca header frame Ethernet (source & destination MAC), melakukan lookup ke MAC address table (CAM table), lalu meneruskan (forward) frame hanya ke egress port yang sesuai. Keputusan dibuat murni di Layer 2 — switch tidak membaca IP address.</p>
<h3>Mengapa Switch Dibutuhkan? (Masalah yang Diselesaikan)</h3>
<ul>
<li><b>Hub memboroskan bandwidth:</b> hub meneruskan setiap bit ke semua port (satu collision domain raksasa). Switch memecah collision domain per port.</li>
<li><b>Keamanan:</b> di hub, semua PC bisa mengintip traffic semua PC lain. Di switch, frame unicast hanya sampai ke tujuan.</li>
<li><b>Full-duplex:</b> setiap port switch bisa kirim dan terima <i>bersamaan</i> (tidak perlu bergantian seperti half-duplex di hub), sehingga throughput efektif dua kali lipat.</li>
<li><b>Skalabilitas:</b> switch modern punya puluhan–ratusan port dengan kecepatan berbeda (1G/10G/25G/100G) per port.</li>
</ul>
<h3>Switch vs Hub vs Bridge vs Router</h3>
<div class="tblwrap"><table>
<tr><th>Perangkat</th><th>Layer OSI</th><th>Keputusan Berdasarkan</th><th>Catatan</th></tr>
<tr><td>Hub</td><td>Layer 1</td><td>Tidak ada (regenerasi sinyal ke semua port)</td><td>Sudah usang; satu collision domain</td></tr>
<tr><td>Bridge</td><td>Layer 2</td><td>MAC address</td><td>Switch adalah "bridge multiport" modern</td></tr>
<tr><td>Switch</td><td>Layer 2</td><td>MAC address (MAC table)</td><td>Standar LAN modern</td></tr>
<tr><td>Router</td><td>Layer 3</td><td>IP address (routing table)</td><td>Penghubung antar jaringan/subnet — Part 11</td></tr>
</table></div>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Switch hidup di Layer 2: ia paham frame, MAC address, dan VLAN tag — tetapi buta terhadap IP address (Layer 3) dan port TCP/UDP (Layer 4). Inilah alasan switch <i>tidak bisa</i> meneruskan traffic antar subnet: itu pekerjaan router/Layer 3.</p></div>
<h3>Packet Flow: Perjalanan Satu Frame Lewat Switch</h3>
<pre>PC-A (MAC AAAA) kirim file ke PC-B (MAC BBBB), keduanya di switch yang sama:

 1. Frame masuk port Fa0/1 → switch baca source MAC (AAAA)
 2. Switch LEARNING: catat "AAAA ada di Fa0/1" ke MAC table
 3. Switch baca destination MAC (BBBB)
 4. Switch FORWARDING: cari BBBB di MAC table
    → ketemu di Fa0/2 → frame diteruskan HANYA ke Fa0/2
    → tidak ketemu → FLOODING ke semua port (kecuali port asal)
 5. PC-B terima frame; PC-C/D tidak terganggu sama sekali</pre>
<p>Empat kata kunci di atas — <b>learning, forwarding, flooding, aging</b> — adalah seluruh "otak" switch, dan masing-masing dibedah di sub-bab 8.2–8.6.</p>`,
      terms: [
        ['Switch', 'Perangkat Layer 2 yang meneruskan frame Ethernet ke port tujuan berdasarkan MAC address.'],
        ['Collision domain', 'Area jaringan di mana dua perangkat yang mengirim bersamaan akan bertabrakan (collision). Tiap port switch = satu collision domain tersendiri.'],
        ['Broadcast domain', 'Area jaringan di mana frame broadcast diterima semua perangkat. Switch meneruskan broadcast — jadi satu switch (tanpa VLAN) = satu broadcast domain.'],
        ['Full-duplex', 'Mode komunikasi dua arah simultan; tiap port switch modern bekerja full-duplex.'],
        ['Egress / Ingress port', 'Port keluar / port masuknya frame di switch.'],
      ],
      diagram: `<pre>PERBEDAAN HUB vs SWITCH (PC-A kirim ke PC-B)

HUB (Layer 1) — teriak ke semua:              SWITCH (Layer 2) — antar ke tujuan:

      [HUB]                                        [SWITCH]  (tahu MAC tiap port)
   ___/ | \\___                                  ___/  |  \\___
  /     |     \\                                /      |      \\
PC-A   PC-B   PC-C                           PC-A    PC-B    PC-C
  ▲ teriak: "hai BBBB!"                        ▲ bisik: frame hanya ke Fa0/2
  │ semua dengar (boros & tidak aman)           │ PC-A & PC-C tidak terganggu</pre>`,
      scenario: 'Kantor 50 PC memakai hub lama: setiap ada yang copy file besar, seluruh kantor melambat karena semua port "mendengar" semua traffic. Setelah diganti switch managed, traffic antar dua PC tidak lagi mengganggu 48 PC lainnya — keluhan "jaringan lemot tiap ada yang backup" hilang tanpa menambah bandwidth.',
      bestPractices: 'Di jaringan modern, selalu gunakan switch (managed) — bukan hub. Untuk jaringan enterprise, pilih switch managed agar VLAN, trunk, dan STP (Part 09–10) bisa dikonfigurasi.',
      security: 'Switch bukan alat keamanan: traffic unicast memang terisolasi, tetapi attacker bisa melakukan MAC flooding (membanjiri MAC table hingga switch berperilaku seperti hub) — mitigasinya port-security, dibahas di Part 29.',
      challenge: 'Jelaskan dengan kata-katamu: mengapa mengganti hub dengan switch bisa membuat jaringan terasa lebih cepat TANPA menambah bandwidth internet? Sebutkan 2 alasannya.',
      interviewQ: 'Q: "Apa beda switch dan router?" — A: Switch bekerja di Layer 2 dan meneruskan frame berdasarkan MAC address di dalam satu jaringan; router bekerja di Layer 3 dan meneruskan packet berdasarkan IP address antar jaringan/subnet yang berbeda.',
      quiz: [
        {
          q: 'Switch membuat keputusan forwarding berdasarkan apa?',
          options: [
            'IP address tujuan (Layer 3)',
            'MAC address tujuan (Layer 2)',
            'Nomor port TCP/UDP (Layer 4)',
            'Nama hostname perangkat',
          ],
          answer: 1,
          explain: 'Switch adalah perangkat Layer 2: ia membaca header frame Ethernet (MAC address), bukan IP address.',
        },
        {
          q: 'Mengapa setiap port switch disebut satu collision domain tersendiri?',
          options: [
            'Karena tiap port punya IP sendiri',
            'Karena switch mem-buffer dan meneruskan frame per port secara independen dalam mode full-duplex',
            'Karena tiap port berada di VLAN berbeda',
            'Karena switch memblokir semua broadcast',
          ],
          answer: 1,
          explain: 'Switch memecah collision domain per port: tiap port full-duplex dan meneruskan frame independen, sehingga collision antar port tidak terjadi.',
        },
        {
          q: 'Switch TIDAK bisa melakukan apa?',
          options: [
            'Meneruskan frame antar port dalam satu jaringan',
            'Meneruskan packet antar subnet berbeda berdasarkan IP',
            'Mempelajari MAC address dari source frame',
            'Melakukan flooding frame broadcast',
          ],
          answer: 1,
          explain: 'Meneruskan antar subnet adalah pekerjaan Layer 3 (router). Switch buta terhadap IP address.',
        },
      ],
    },
    {
      id: '8.2',
      title: 'MAC Address Table',
      body: `
<p><b>MAC address table</b> (disebut juga <b>CAM table</b> — <i>Content Addressable Memory</i>) adalah "buku alamat" switch: tabel yang memetakan <b>MAC address → nomor port → VLAN</b>. Setiap keputusan forwarding switch berasal dari tabel ini.</p>
<h3>Isi Tabel</h3>
<p>Satu baris (entry) tabel berisi tiga informasi penting:</p>
<ul>
<li><b>MAC address</b> perangkat (mis. <code>aabb.cc00.0100</code> — format Cisco memakai titik).</li>
<li><b>Port</b> tempat MAC itu terlihat (mis. <code>Fa0/5</code>).</li>
<li><b>VLAN</b> tempat MAC itu berada (mis. <code>20</code>) — karena tabel dipartisi per VLAN.</li>
</ul>
<h3>Melihat Tabel di Cisco IOS</h3>
<pre>Switch# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  20    aabb.cc00.0100    DYNAMIC     Fa0/5
  20    aabb.cc00.0200    DYNAMIC     Fa0/6
  30    aabb.cc00.0300    DYNAMIC     Fa0/10
  99    aabb.cc00.9900    STATIC      Fa0/24
Total Mac Addresses for this criterion: 4</pre>
<h3>Kolom Type: DYNAMIC vs STATIC</h3>
<ul>
<li><b>DYNAMIC</b> — dipelajari otomatis dari traffic (MAC learning, sub-bab 8.3) dan akan <i>kedaluwarsa</i> bila tidak terlihat lagi (aging, sub-bab 8.6).</li>
<li><b>STATIC</b> — dimasukkan manual oleh admin; tidak pernah aging. Dipakai untuk perangkat kritis (server) atau sebagai bagian port-security.</li>
</ul>
<div class="callout"><div class="t">Kapasitas Terbatas — Fakta Penting</div><p style="margin:4px 0 0">CAM table punya batas hardware (mis. 8.000–16.000 entry di switch akses, ratusan ribu di switch data center). Tabel yang penuh membuat switch tak bisa belajar MAC baru → frame diflooding terus-menerus → performa anjlok. Inilah dasar serangan <b>MAC flooding</b> (dibahas di Part 29).</p></div>
<h3>Verifikasi di Lab</h3>
<p>Setelah menghubungkan 2–3 PC ke switch dan melakukan ping antar PC, jalankan <code>show mac address-table</code>. Kamu harus melihat satu entry DYNAMIC per PC, dengan port dan VLAN yang sesuai. Jika tabel kosong padahal PC sudah ping — berarti learning tidak terjadi (cek kabel/port status dengan <code>show interfaces status</code>).</p>`,
      terms: [
        ['MAC address table / CAM table', 'Tabel di switch yang memetakan MAC address ke port dan VLAN; dasar semua keputusan forwarding Layer 2.'],
        ['DYNAMIC entry', 'Entry tabel yang dipelajari otomatis dari traffic dan bisa kedaluwarsa (aging).'],
        ['STATIC entry', 'Entry tabel yang dikonfigurasi manual; permanen, tidak aging.'],
      ],
      diagram: `<pre>ISI MAC ADDRESS TABLE (contoh)

 Vlan | MAC Address      | Type    | Port
 -----+------------------+---------+------
  20  | aabb.cc00.0100   | DYNAMIC | Fa0/5   ← PC Office
  20  | aabb.cc00.0200   | DYNAMIC | Fa0/6   ← PC Office
  30  | aabb.cc00.0300   | DYNAMIC | Fa0/10  ← Server
  99  | aabb.cc00.9900   | STATIC  | Fa0/24  ← port management (manual)

"Kalau ada frame untuk aabb.cc00.0200 di VLAN 20 → keluarkan lewat Fa0/6."</pre>`,
      scenario: 'NOC menerima keluhan "server kadang tidak bisa diakses". Cek show mac address-table: MAC server muncul di DYNAMIC dan port-nya berpindah-pindah antar waktu — indikasi ada loop atau MAC flapping. Tanpa paham isi tabel ini, engineer hanya bisa menebak-nebak.',
      bestPractices: 'Jadikan show mac address-table sebagai command verifikasi standar setiap troubleshooting Layer 2: ia menjawab "switch mengira perangkat X ada di port mana?" — jawaban paling jujur tentang topologi aktual.',
      security: 'Entry STATIC bisa dipakai untuk mengunci server ke port tertentu (satu lapis port-security sederhana), tetapi jangan diandalkan sebagai satu-satunya pertahanan — MAC address mudah dipalsukan (spoofing).',
      challenge: 'Di lab: hubungkan 3 PC, ping semuanya, lalu tampilkan MAC table. Cocokkan setiap entry dengan PC fisiknya. PC mana yang belum muncul? Mengapa?',
      interviewQ: 'Q: "Apa itu CAM table dan apa isinya?" — A: Tabel di switch (Content Addressable Memory) berisi pemetaan MAC address → port → VLAN, dipakai untuk keputusan forwarding. Entry bisa DYNAMIC (hasil learning, bisa aging) atau STATIC (manual, permanen).',
      quiz: [
        {
          q: 'Informasi apa saja yang disimpan dalam satu entry MAC address table?',
          options: [
            'IP address, subnet mask, dan gateway',
            'MAC address, port, dan VLAN',
            'Hostname, username, dan password',
            'Nomor port TCP dan UDP',
          ],
          answer: 1,
          explain: 'Satu entry = MAC address → port → VLAN. Switch tidak menyimpan IP di tabel ini.',
        },
        {
          q: 'Apa perbedaan entry DYNAMIC dan STATIC?',
          options: [
            'DYNAMIC untuk server, STATIC untuk PC',
            'DYNAMIC dipelajari otomatis dan bisa aging; STATIC dikonfigurasi manual dan permanen',
            'DYNAMIC lebih cepat dari STATIC',
            'Tidak ada perbedaan, hanya nama',
          ],
          answer: 1,
          explain: 'DYNAMIC = hasil MAC learning (kedaluwarsa bila idle); STATIC = manual oleh admin (tidak aging).',
        },
        {
          q: 'Apa dampak jika CAM table penuh?',
          options: [
            'Switch mati total',
            'Switch tidak bisa mempelajari MAC baru sehingga frame terus diflooding dan performa turun',
            'Semua VLAN terhapus',
            'Tidak ada dampak, tabel meluap otomatis ke RAM lain',
          ],
          answer: 1,
          explain: 'Tabel penuh = MAC baru tak bisa dipelajari = flooding terus-menerus; inilah dasar serangan MAC flooding.',
        },
      ],
    },
    {
      id: '8.3',
      title: 'MAC Learning',
      body: `
<p><b>MAC learning</b> adalah proses switch mencatat <b>source MAC address</b> setiap frame yang masuk, beserta port kedatangannya, ke dalam MAC address table. Switch belajar secara <i>pasif</i> — hanya dari traffic yang lewat, tanpa protokol khusus.</p>
<h3>Cara Kerja Langkah per Langkah</h3>
<ol>
<li>Frame masuk ke port Fa0/5. Switch membaca <b>source MAC</b> di header Ethernet (mis. <code>aaaa.aaaa.aaaa</code>).</li>
<li>Switch mengecek MAC table: apakah <code>aaaa.aaaa.aaaa</code> sudah ada di VLAN itu?</li>
<li><b>Belum ada</b> → buat entry baru: <code>aaaa.aaaa.aaaa → Fa0/5, DYNAMIC</code>.</li>
<li><b>Sudah ada tapi port berbeda</b> → update port-nya (perangkat pindah port — mis. laptop pindah colokan) dan reset aging timer.</li>
<li><b>Sudah ada dan port sama</b> → cukup reset aging timer (tanda perangkat masih aktif).</li>
</ol>
<div class="callout blue"><div class="t">Poin Kunci yang Sering Disalahpahami</div><p style="margin:4px 0 0">Switch belajar dari <b>SOURCE</b> MAC (pengirim), bukan destination MAC. Destination MAC dipakai untuk <i>forwarding</i> (sub-bab 8.4). Jadi setiap frame yang lewat mengajari switch <i>satu</i> hal: "pengirim frame ini ada di port ini".</p></div>
<h3>Contoh Timeline Learning</h3>
<pre>Waktu  Trafik                              Isi MAC Table (VLAN 20)
-----  ----------------------------------  -------------------------------
t=0    (kosong)                            (kosong)
t=1    PC-A → kirim ke PC-B (src AAAA)     AAAA → Fa0/1
t=2    PC-B → balas ke PC-A (src BBBB)     AAAA → Fa0/1, BBBB → Fa0/2
t=3    PC-C → kirim ke PC-A (src CCCC)     + CCCC → Fa0/3
t=4    PC-A pindah ke Fa0/9, kirim lagi    AAAA → Fa0/9  (entry di-update!)</pre>
<h3>Implikasi Praktis</h3>
<ul>
<li>Switch yang baru dinyalakan tabelnya <b>kosong</b> — frame pertama selalu diflooding (lihat 8.5), lalu tabel terisi dalam hitungan detik begitu ada traffic.</li>
<li>Perangkat yang <b>diam total</b> (tidak pernah mengirim frame apa pun) tidak akan pernah dipelajari — tetapi dalam praktik, ARP/DHCP membuat semua host aktif berkala mengirim sesuatu.</li>
<li>Learning terjadi <b>per VLAN</b>: MAC yang sama di VLAN 20 dan VLAN 30 dicatat sebagai dua entry terpisah.</li>
</ul>`,
      terms: [
        ['MAC learning', 'Proses switch mencatat source MAC + ingress port ke MAC table secara otomatis dari traffic yang lewat.'],
        ['Source MAC', 'Alamat MAC pengirim di header frame Ethernet; dipakai untuk learning.'],
        ['Ingress', 'Arah masuknya frame ke switch (lawan dari egress/keluar).'],
      ],
      diagram: `<pre>MAC LEARNING — switch belajar dari PENGIRIM

      Frame masuk Fa0/1
      [src=AAAA | dst=BBBB]
              │
              ▼
      ┌──────────────┐   "Siapa AAAA?"     ┌──────────────────┐
      │    SWITCH    │ ──── belum tahu ──▶ │ catat: AAAA ada  │
      │  baca src    │                     │ di Fa0/1 (VLAN20)│
      └──────────────┘                     └──────────────────┘
              │
              ▼
   lalu urus dst=BBBB (forwarding / flooding → sub-bab 8.4–8.5)</pre>`,
      scenario: 'Seorang teknisi memindahkan kabel server dari port 10 ke port 12 tanpa memberi tahu NOC. Tabel MAC otomatis update saat server mengirim frame berikutnya — tidak perlu konfigurasi ulang. Inilah enaknya learning dinamis; tetapi untuk port server kritis, banyak enterprise mengunci dengan entry STATIC agar perpindahan tak terduga langsung ketahuan.',
      bestPractices: 'Jangan mengandalkan "tabel sudah terisi" — setelah switch reboot atau kabel dicabut, tabel kosong dan flooding sesaat adalah normal. Tunggu beberapa detik traffic sebelum menilai.',
      security: 'Karena learning otomatis dan memercayai source MAC apa pun, attacker bisa mengirim frame dengan source MAC palsu (MAC spoofing) untuk meracuni tabel — mitigasinya port-security (Part 29).',
      challenge: 'Jelaskan urutannya: PC-A (baru dinyalakan) ping PC-B. Frame ARP request pertama: apa yang dipelajari switch? Ke mana frame diteruskan? Lalu saat reply kembali: apa yang dipelajari?',
      interviewQ: 'Q: "Kapan switch mempelajari MAC address?" — A: Setiap kali frame masuk, switch membaca source MAC-nya dan mencatat/memperbarui entry MAC → port di tabel. Belajar dari pengirim, bukan dari tujuan.',
      quiz: [
        {
          q: 'Switch mempelajari MAC address dari bagian frame yang mana?',
          options: [
            'Destination MAC — alamat tujuan',
            'Source MAC — alamat pengirim',
            'EtherType — jenis protokol',
            'FCS — checksum di akhir frame',
          ],
          answer: 1,
          explain: 'Learning memakai source MAC (pengirim); destination MAC dipakai untuk keputusan forwarding.',
        },
        {
          q: 'PC-A pindah dari Fa0/1 ke Fa0/9 lalu mengirim frame. Apa yang dilakukan switch?',
          options: [
            'Menolak frame karena port berubah',
            'Meng-update entry AAAA ke Fa0/9 dan me-reset aging timer',
            'Menghapus VLAN dari port Fa0/9',
            'Melakukan reboot MAC table',
          ],
          answer: 1,
          explain: 'Learning bersifat adaptif: entry yang sudah ada di-update ke port baru dan timer di-reset.',
        },
        {
          q: 'Switch baru dinyalakan, MAC table masih kosong, lalu PC-A mengirim frame ke PC-B. Apa yang terjadi?',
          options: [
            'Frame dibuang karena tabel kosong',
            'Switch mempelajari source MAC AAAA, lalu mem-flooding frame karena destination BBBB belum dikenal',
            'Switch meminta IP address ke DHCP dulu',
            'Frame diteruskan ke router otomatis',
          ],
          answer: 1,
          explain: 'Learning tetap jalan dari frame pertama; karena destination belum ada di tabel, frame di-flooding (sub-bab 8.5).',
        },
      ],
    },
    {
      id: '8.4',
      title: 'MAC Forwarding',
      body: `
<p><b>Forwarding</b> (penerusan) adalah keputusan switch: <b>frame ini harus keluar lewat port mana?</b> Setelah learning mencatat pengirim, switch membaca <b>destination MAC</b> dan melakukan lookup ke MAC table.</p>
<h3>Tiga Hasil Lookup</h3>
<div class="tblwrap"><table>
<tr><th>Hasil Lookup</th><th>Nama</th><th>Aksi Switch</th></tr>
<tr><td>Destination MAC <b>dikenal</b>, port tujuan ≠ port asal</td><td>Known unicast</td><td>Forward hanya ke port tujuan</td></tr>
<tr><td>Destination MAC <b>dikenal</b>, port tujuan = port asal</td><td>—</td><td><b>Drop</b> (buang) — pengirim dan tujuan satu port, tak perlu diteruskan</td></tr>
<tr><td>Destination MAC <b>tidak dikenal</b></td><td>Unknown unicast</td><td><b>Flood</b> ke semua port (kecuali port asal) — sub-bab 8.5</td></tr>
</table></div>
<h3>Contoh Keputusan</h3>
<pre>MAC table (VLAN 20):  AAAA→Fa0/1,  BBBB→Fa0/2,  CCCC→Fa0/3

Frame 1: src=AAAA, dst=BBBB masuk Fa0/1
 → BBBB dikenal di Fa0/2 (≠ Fa0/1) → FORWARD ke Fa0/2 saja ✔

Frame 2: src=AAAA, dst=AAAA masuk Fa0/1
 → tujuan = port asal → DROP (tidak dikirim ke mana-mana)

Frame 3: src=AAAA, dst=DDDD masuk Fa0/1
 → DDDD tidak dikenal → FLOOD ke Fa0/2, Fa0/3, ... (kecuali Fa0/1)</pre>
<div class="callout blue"><div class="t">Forwarding vs Routing — Jangan Tertukar</div><p style="margin:4px 0 0">Forwarding switch = keputusan <b>Layer 2</b> (MAC → port, dalam satu jaringan). Routing = keputusan <b>Layer 3</b> (IP → next-hop, antar jaringan). Keduanya memakai "tabel", tetapi tabel, alamat, dan domainnya berbeda total — Part 11 membahas routing.</p></div>
<h3>Mengapa Ada Kasus "Drop"?</h3>
<p>Kelihatannya aneh membuang frame, tetapi ini benar: jika pengirim dan tujuan berada di balik <b>port yang sama</b> (mis. keduanya di balik hub kecil yang dicolok ke satu port switch), switch tahu frame itu tidak perlu keluar ke mana-mana. Ini mencegah traffic tak berguna membanjiri jaringan — optimasi kecil yang berdampak besar di jaringan sibuk.</p>`,
      terms: [
        ['Forwarding', 'Keputusan switch meneruskan frame ke egress port berdasarkan hasil lookup destination MAC di MAC table.'],
        ['Known unicast', 'Frame unicast yang destination MAC-nya sudah ada di MAC table; diteruskan ke satu port.'],
        ['Unknown unicast', 'Frame unicast yang destination MAC-nya belum ada di MAC table; diflooding.'],
        ['Drop', 'Aksi membuang frame tanpa diteruskan (mis. tujuan = port asal).'],
      ],
      diagram: `<pre>KEPUTUSAN FORWARDING (satu frame masuk Fa0/1)

              ┌─ dst dikenal, port ≠ asal ──▶ FORWARD ke port itu saja
              │
  baca dst ───┼─ dst dikenal, port = asal ───▶ DROP (buang)
  MAC         │
              └─ dst TIDAK dikenal ──────────▶ FLOOD ke semua port
                                                 (kecuali Fa0/1)</pre>`,
      scenario: 'Di data center, server backup dan server utama berada di switch yang sama. Traffic backup 10 Gbps hanya lewat dua port yang bersangkutan — 46 port lain tidak terganggu. Itulah forwarding: isolasi traffic per pasangan pengirim-tujuan, fondasi performa LAN modern.',
      bestPractices: 'Saat troubleshooting "PC-A tidak bisa ke PC-B", cek MAC table di kedua arah: pastikan MAC tujuan dikenal dan menunjuk ke port yang benar. Tabel yang salah = forwarding yang salah.',
      security: 'Forwarding yang benar bergantung pada tabel yang benar. Tabel yang diracuni (MAC spoofing/flooding) membuat frame diteruskan ke attacker — alasan port-security penting di port akses user (Part 29).',
      challenge: 'MAC table: AAAA→Fa0/1, BBBB→Fa0/2. Tiga frame masuk Fa0/1: (1) dst=BBBB, (2) dst=AAAA, (3) dst=FFFF. Tulis aksi switch untuk masing-masing + alasannya.',
      interviewQ: 'Q: "Apa yang dilakukan switch saat menerima frame yang destination MAC-nya tidak ada di tabel?" — A: Unknown unicast flooding — frame diteruskan ke semua port (kecuali port asal) dengan harapan tujuan akan merespons dan switch bisa belajar.',
      quiz: [
        {
          q: 'Frame masuk Fa0/1 dengan destination MAC yang dikenal di Fa0/2. Aksi switch?',
          options: [
            'Flood ke semua port',
            'Forward hanya ke Fa0/2',
            'Drop frame tersebut',
            'Kirim ke router',
          ],
          answer: 1,
          explain: 'Known unicast: destination dikenal dan port berbeda dari port asal → forward ke satu port itu saja.',
        },
        {
          q: 'Kapan switch melakukan DROP terhadap sebuah frame?',
          options: [
            'Saat destination MAC tidak dikenal',
            'Saat destination MAC menunjuk ke port yang sama dengan port asal frame',
            'Saat frame berukuran besar',
            'Saat VLAN ID tidak cocok',
          ],
          answer: 1,
          explain: 'Jika tujuan berada di balik port yang sama dengan pengirim, frame tak perlu diteruskan ke mana-mana.',
        },
        {
          q: 'Apa perbedaan forwarding dan flooding?',
          options: [
            'Sama saja, dua nama untuk satu hal',
            'Forwarding: kirim ke satu port hasil lookup; flooding: kirim ke semua port karena tujuan tak dikenal/broadcast',
            'Forwarding untuk broadcast, flooding untuk unicast',
            'Forwarding di Layer 3, flooding di Layer 2',
          ],
          answer: 1,
          explain: 'Forwarding = terarah ke satu port (tujuan dikenal); flooding = ke semua port (tujuan tak dikenal atau broadcast/multicast).',
        },
      ],
    },
    {
      id: '8.5',
      title: 'Flooding',
      body: `
<p><b>Flooding</b> adalah aksi switch meneruskan frame ke <b>semua port</b> (kecuali port asal kedatangan frame). Ini bukan bug — ini <i>fitur yang disengaja</i> dan terjadi dalam tiga situasi:</p>
<h3>Tiga Pemicu Flooding</h3>
<ol>
<li><b>Broadcast</b> — destination MAC <code>ffff.ffff.ffff</code> (semua F). Contoh: ARP request ("siapa yang punya IP 192.168.20.1?"). Broadcast <i>memang harus</i> sampai ke semua perangkat dalam broadcast domain.</li>
<li><b>Multicast</b> — destination MAC multicast (tanpa IGMP snooping). Contoh: beberapa protokol routing dan streaming.</li>
<li><b>Unknown unicast</b> — destination MAC unicast yang belum ada di MAC table (switch baru nyala, entry ter-aging, atau perangkat baru).</li>
</ol>
<div class="callout"><div class="t">Flooding ≠ Broadcast</div><p style="margin:4px 0 0">Broadcast adalah <i>jenis traffic</i> (tujuan = semua orang). Flooding adalah <i>aksi switch</i> (kirim ke semua port). Unknown unicast mengalami flooding <i>padahal</i> tujuannya satu orang — switch hanya belum tahu ia di port mana. Setelah tujuan merespons, switch belajar (8.3) dan flooding berhenti.</p></div>
<h3>Siklus Hidup Unknown Unicast</h3>
<pre>t=0  Switch nyala, tabel kosong.
t=1  PC-A → PC-B (unknown unicast) → FLOOD ke semua port.
     PC-B terima, PC-C/D terima tapi abaikan (bukan MAC mereka).
t=2  PC-B → balas ke PC-A. Switch belajar BBBB→Fa0/2 (learning!).
     AAAA sudah dipelajari di t=1 → FORWARD ke Fa0/1 saja.
t=3  Seterusnya: known unicast, tanpa flooding lagi. ✔</pre>
<h3>Kapan Flooding Menjadi Masalah?</h3>
<ul>
<li><b>Flooding berlebihan</b> (mis. akibat MAC table penuh atau serangan) memboroskan bandwidth dan CPU semua perangkat — jaringan terasa lambat tanpa sebab yang jelas.</li>
<li><b>Broadcast storm:</b> flooding + <i>loop fisik</i> (dua kabel paralel antar switch tanpa STP) = frame berputar tanpa henti, melumpuhkan jaringan dalam hitungan detik. Inilah alasan Part 10 (Spanning Tree) wajib dipahami.</li>
</ul>
<p>Aturan praktis: flooding <i>sesekali</i> (saat belajar) = normal. Flooding <i>terus-menerus</i> = gejala masalah (tabel penuh, loop, atau serangan).</p>`,
      terms: [
        ['Flooding', 'Aksi switch meneruskan frame ke semua port kecuali port asal; terjadi untuk broadcast, multicast, dan unknown unicast.'],
        ['Broadcast', 'Frame dengan destination MAC ffff.ffff.ffff; ditujukan ke semua perangkat dalam broadcast domain.'],
        ['Multicast', 'Frame untuk sekelompok perangkat yang berlangganan grup multicast tertentu.'],
        ['Broadcast storm', 'Ledakan broadcast/flood tanpa henti akibat loop, melumpuhkan jaringan.'],
      ],
      diagram: `<pre>FLOODING: unknown unicast (tujuan belum dikenal)

   PC-A                SWITCH                PC-B   PC-C   PC-D
    │   "untuk DDDD"     │                     │      │      │
    │ ───────────────▶ │                     │      │      │
    │                  │──▶ "siapa DDDD?" ──▶ │ ──▶  │ ──▶  │
    │                  │   ke SEMUA port       │      │      │
    │                  │   (kecuali Fa0/1)     │      │      │
    │                  │                       │ abaikan │ abaikan
    │                  │ ◀── "saya DDDD, di Fa0/4" (reply)
    │                  │   → belajar: DDDD→Fa0/4 ✔
    │                  │   → frame berikutnya: forward terarah, tanpa flood</pre>`,
      scenario: 'NOC melihat traffic broadcast melonjak tiba-tiba di satu switch akses. Investigasi: seorang user memasang hub murah dan mencolok dua kabel ke switch yang sama → loop → broadcast storm. Solusi permanennya STP + BPDU Guard (Part 10); solusi daruratnya cabut salah satu kabel.',
      bestPractices: 'Pantau rasio broadcast terhadap total traffic (via monitoring Part 23–27). Lonjakan broadcast yang tak wajar hampir selalu berarti loop, perangkat rusak, atau serangan — bukan "jaringan sedang sibuk".',
      security: 'Attacker bisa memicu flooding sengaja (MAC flooding) agar switch berperilaku seperti hub, lalu menguping traffic orang lain. Mitigasi: port-security membatasi jumlah MAC per port (Part 29).',
      challenge: 'Jelaskan mengapa frame pertama PC-A ke PC-B selalu diflooding, tetapi frame ke-100 tidak. Apa yang berubah di antara keduanya?',
      interviewQ: 'Q: "Apa beda flooding dan broadcast?" — A: Broadcast adalah jenis traffic yang memang ditujukan ke semua perangkat; flooding adalah aksi switch mengirim ke semua port, yang terjadi untuk broadcast, multicast, dan unknown unicast (tujuan belum dikenal).',
      quiz: [
        {
          q: 'Dalam situasi apa saja switch melakukan flooding?',
          options: [
            'Hanya saat menerima broadcast',
            'Broadcast, multicast, dan unknown unicast',
            'Hanya saat tabel MAC penuh',
            'Setiap kali menerima frame unicast',
          ],
          answer: 1,
          explain: 'Tiga pemicu flooding: broadcast (ffff.ffff.ffff), multicast, dan unknown unicast (destination belum ada di tabel).',
        },
        {
          q: 'Mengapa unknown unicast yang diflooding akhirnya berhenti diflooding?',
          options: [
            'Karena switch me-reboot tabelnya',
            'Karena tujuan merespons sehingga switch mempelajari MAC-nya via source MAC learning',
            'Karena PC pengirim berhenti mengirim',
            'Karena VLAN dihapus otomatis',
          ],
          answer: 1,
          explain: 'Reply dari tujuan membawa source MAC-nya → switch belajar → frame berikutnya menjadi known unicast (forward terarah).',
        },
        {
          q: 'Apa bahaya kombinasi flooding + loop fisik antar switch?',
          options: [
            'Tidak ada, switch menanganinya otomatis',
            'Broadcast storm: frame berputar tanpa henti dan melumpuhkan jaringan',
            'Hanya membuat satu PC lambat',
            'VLAN terhapus otomatis',
          ],
          answer: 1,
          explain: 'Loop membuat frame flood berputar selamanya, melipatgandakan diri — broadcast storm. Pencegahannya STP (Part 10).',
        },
      ],
    },
    {
      id: '8.6',
      title: 'Aging',
      body: `
<p><b>Aging</b> adalah mekanisme switch <b>menghapus entry MAC table yang sudah lama tidak terlihat</b>. Setiap entry DYNAMIC punya timer (default Cisco: <b>300 detik / 5 menit</b>); setiap kali frame dari MAC itu lewat lagi, timer di-reset ke 300.</p>
<h3>Mengapa Entry Harus Kedaluwarsa?</h3>
<ul>
<li><b>Perangkat pindah:</b> laptop dicabut dari Fa0/5 dan dicolok ke Fa0/9 di switch lain. Tanpa aging, entry lama (MAC→Fa0/5) menyesatkan forwarding selamanya.</li>
<li><b>Perangkat mati:</b> PC dimatikan permanen — entry-nya hanya sampah memenuhi tabel.</li>
<li><b>Kapasitas tabel terbatas:</b> aging membebaskan slot untuk perangkat aktif. Tanpa aging, tabel perlahan penuh oleh "hantu" perangkat lama.</li>
</ul>
<h3>Cara Kerja Timer</h3>
<pre>Entry: AAAA → Fa0/1, timer = 300 detik

t=0    AAAA terlihat → timer = 300
t=120  AAAA terlihat lagi → timer di-reset ke 300
t=300  (tidak terlihat 300 detik penuh) → ENTRY DIHAPUS
t=301  Frame untuk AAAA datang → unknown unicast → FLOOD (lalu belajar lagi)</pre>
<div class="callout blue"><div class="t">Aging Bukan "Masalah"</div><p style="margin:4px 0 0">Flooding sesaat setelah entry ter-aging adalah <b>perilaku normal</b>, bukan gangguan. Inilah sebabnya ping pertama ke perangkat yang lama diam kadang sedikit lambat (ARP + re-learning), lalu normal kembali.</p></div>
<h3>Melihat & Mengubah Aging Time (Cisco)</h3>
<pre>Switch# show mac address-table aging-time
Global Aging Time:  300

Switch(config)# mac address-table aging-time 600
! ALASAN: menaikkan ke 600 detik di jaringan stabil (perangkat jarang
! pindah) untuk mengurangi flooding re-learning. Menurunkannya
! (mis. 60) hanya bila topologi sangat dinamis — jarang diperlukan.</pre>
<h3>DYNAMIC vs STATIC (kembali)</h3>
<p>Entry <b>STATIC</b> (buatan manual) <b>tidak pernah aging</b> — cocok untuk server/printer yang port-nya tetap. Tetapi hati-hati: jika server <i>dipindah</i> tanpa mengupdate entry static, traffic akan diteruskan ke port lama yang kosong selamanya. Inilah trade-off static: deterministik, tetapi butuh administrasi manual.</p>`,
      terms: [
        ['Aging (MAC aging)', 'Penghapusan otomatis entry DYNAMIC yang tidak terlihat selama aging time.'],
        ['Aging time', 'Lama idle maksimum sebelum entry dihapus; default 300 detik di Cisco IOS.'],
      ],
      diagram: `<pre>SIKLUS HIDUP SATU ENTRY DYNAMIC

  frame terlihat        frame terlihat        300 detik tanpa kabar
       │                     │                         │
       ▼                     ▼                         ▼
 ┌──────────┐  reset   ┌──────────┐   kedaluwarsa  ┌──────────┐
 │ AAAA→Fa0/1│ ──────▶ │ AAAA→Fa0/1│ ─────────────▶ │ DIHAPUS  │
 │ timer=300 │  timer  │ timer=300 │                │ (hilang) │
 └──────────┘ =300     └──────────┘                └──────────┘
       ▲                                               │
       └──────── frame berikutnya: FLOOD lalu BELAJAR ──┘</pre>`,
      scenario: 'Gedung kantor memakai hot-desk: karyawan pindah meja tiap hari. Tanpa aging, MAC table switch akses akan penuh entry usang dalam seminggu dan forwarding salah sasaran. Dengan aging 300 detik, tabel selalu mencerminkan "siapa di mana SEKARANG" — engineer tidak perlu membersihkan manual.',
      bestPractices: 'Biarkan aging time di default (300 detik) kecuali ada alasan kuat. Mengubahnya tanpa alasan hanya memindahkan masalah: terlalu lama = tabel kotor; terlalu pendek = flooding re-learning berlebihan.',
      security: 'Aging yang terlalu lama memberi attacker jendela lebih panjang untuk menyalahgunakan entry palsu hasil MAC spoofing. Di port user yang kritis, kombinasikan aging normal + port-security.',
      challenge: 'Sebuah printer dimatikan Jumat sore dan dinyalakan Senin pagi. Senin pagi PC pertama kali print: jelaskan apa yang terjadi di MAC table switch (aging + flooding + learning) langkah per langkah.',
      interviewQ: 'Q: "Apa itu MAC aging dan mengapa diperlukan?" — A: Penghapusan otomatis entry dinamis yang idle melebihi aging time (default 300 detik). Diperlukan agar tabel selalu akurat saat perangkat pindah/mati dan agar slot tabel tidak habis oleh entry usang.',
      quiz: [
        {
          q: 'Berapa default MAC aging time di Cisco IOS dan apa yang me-reset-nya?',
          options: [
            '60 detik; di-reset oleh reboot switch',
            '300 detik; di-reset setiap kali frame dari MAC itu terlihat lagi',
            '3600 detik; tidak bisa di-reset',
            '30 detik; di-reset oleh admin manual',
          ],
          answer: 1,
          explain: 'Default 300 detik; timer kembali ke 300 setiap kali source MAC itu terlihat lagi di traffic.',
        },
        {
          q: 'Mengapa entry DYNAMIC harus bisa kedaluwarsa (aging)?',
          options: [
            'Agar switch lebih hemat listrik',
            'Agar tabel tetap akurat saat perangkat pindah/mati dan slot tabel tidak habis oleh entry usang',
            'Agar VLAN terhapus otomatis',
            'Agar broadcast berhenti total',
          ],
          answer: 1,
          explain: 'Tanpa aging, tabel menumpuk "hantu" perangkat lama: forwarding salah sasaran dan tabel bisa penuh.',
        },
        {
          q: 'Apa perbedaan entry STATIC terkait aging?',
          options: [
            'STATIC aging lebih cepat (60 detik)',
            'STATIC tidak pernah aging — permanen sampai dihapus manual',
            'STATIC berubah menjadi DYNAMIC setelah 300 detik',
            'Tidak ada bedanya',
          ],
          answer: 1,
          explain: 'Entry STATIC dikonfigurasi manual dan tidak kedaluwarsa; cocok untuk perangkat yang port-nya tetap, tetapi wajib dirawat manual bila perangkat pindah.',
        },
      ],
    },
    {
      id: '8.7',
      title: 'Access Port',
      body: `
<p><b>Access port</b> adalah port switch yang menjadi anggota <b>satu VLAN saja</b> dan dipakai untuk menghubungkan <b>end device</b> (PC, printer, CCTV, server, access point client). Frame yang keluar-masuk access port selalu <b>untagged</b> (tanpa label VLAN) — karena end device umumnya tidak mengerti VLAN tag.</p>
<h3>Cara Kerja Sederhana</h3>
<p>Access port punya satu VLAN tetap, disebut <b>access VLAN</b>. Aturannya:</p>
<ul>
<li>Frame <b>masuk</b> dari PC → switch menandai secara internal "frame ini milik VLAN X" (berdasarkan access VLAN port itu).</li>
<li>Frame <b>keluar</b> ke PC → switch melepas semua penanda; PC menerima frame Ethernet biasa.</li>
<li>Frame dari VLAN lain <b>tidak akan pernah</b> keluar lewat port ini (aturan emas: 1 VLAN = 1 broadcast domain).</li>
</ul>
<h3>Lab Terpandu: Konfigurasi Access Port (Cisco IOS)</h3>
<p><b>Topology:</b> PC-A → Fa0/5 switch; PC-A harus masuk VLAN 20 (OFFICE, 192.168.20.0/24).</p>
<p><b>Objective:</b> Fa0/5 menjadi access port VLAN 20 dan PC-A bisa ping gateway 192.168.20.1.</p>
<pre>Switch> enable
! ALASAN: masuk mode privileged — konfigurasi hanya bisa diubah dari sini,
! bukan dari user mode (Switch>).

Switch# configure terminal
! ALASAN: masuk global config mode — "ruang kerja" untuk mengubah konfigurasi.

Switch(config)# vlan 20
Switch(config-vlan)# name OFFICE
Switch(config-vlan)# exit
! ALASAN: buat VLAN 20 dulu di database VLAN switch. Port tidak bisa
! dimasukkan ke VLAN yang belum ada — ini error paling umum ("VLAN tidak
! dibuat, port tetap di VLAN 1").

Switch(config)# interface fa0/5
! ALASAN: masuk ke mode konfigurasi port spesifik Fa0/5.

Switch(config-if)# switchport mode access
! ALASAN: tegaskan port ini access (bukan trunk). Wajib eksplisit: default
! beberapa switch adalah "dynamic auto" yang bisa dinegosiasi jadi trunk
! oleh perangkat lawan — celah keamanan (VLAN hopping).

Switch(config-if)# switchport access vlan 20
! ALASAN: tetapkan access VLAN = 20. Mulai detik ini, semua frame dari PC-A
! diperlakukan sebagai milik VLAN 20.

Switch(config-if)# spanning-tree portfast
! ALASAN: (dibahas penuh di 10.9) port akses langsung forwarding tanpa
! menunggu 30 detik STP — penting agar DHCP/PC tidak timeout saat kabel dicolok.

Switch(config-if)# no shutdown
Switch(config-if)# end
! ALASAN: pastikan port aktif (no shutdown), lalu keluar dan simpan dengan
! "copy running-config startup-config" agar tidak hilang saat reboot.</pre>
<h3>Verification</h3>
<pre>Switch# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4
20   OFFICE                           active    Fa0/5
! ✔ Fa0/5 tercatat di VLAN 20 — konfigurasi berhasil.

Switch# show interfaces fa0/5 switchport
Name: Fa0/5
Switchport: Enabled
Administrative Mode: static access     ← mode access, bukan dynamic
Operational Mode: static access
Access Mode VLAN: 20 (OFFICE)          ← VLAN benar
! ✔ Administrative & Operational sama-sama "static access" = tidak ada
! negosiasi liar yang bisa mengubahnya jadi trunk.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> <code>switchport access vlan 10</code> di Fa0/5 (salah VLAN — PC office nyasar ke VLAN CCTV).</li>
<li><b>Gejala:</b> PC-A (IP 192.168.20.50) tidak bisa ping gateway 192.168.20.1, tetapi link up.</li>
<li><b>Troubleshoot:</b> <code>show interfaces fa0/5 switchport</code> → Access Mode VLAN: 10. Ketahuan: VLAN salah. (Aturan emas: 1 VLAN = 1 subnet — PC di VLAN 10 butuh IP 192.168.10.x, bukan 20.x.)</li>
<li><b>Fix:</b> kembalikan <code>switchport access vlan 20</code>.</li>
<li><b>Final verification:</b> <code>show vlan brief</code> + ping gateway berhasil.</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, salah VLAN hanya berarti ping gagal. Di production, salah menaruh port server ke VLAN GUEST bisa berarti server kritis terekspos ke tamu — selalu verifikasi dengan <code>show vlan brief</code> sebelum menutup tiket change.</p></div>`,
      terms: [
        ['Access port', 'Port switch anggota satu VLAN, untuk end device; frame-nya untagged.'],
        ['Access VLAN', 'VLAN tetap yang ditetapkan pada sebuah access port.'],
        ['Untagged', 'Frame Ethernet biasa tanpa label VLAN 802.1Q.'],
      ],
      diagram: `<pre>ACCESS PORT — satu port, satu VLAN, untagged

   PC-A (tidak tahu VLAN)            SWITCH               ke jaringan
   192.168.20.50  ──untagged──▶  Fa0/5 [access VLAN 20]
                                 ──▶ frame ditandai internal "VLAN 20"
                                 ──▶ hanya bisa ke port VLAN 20 lain / trunk

   ❌ frame VLAN 30 TIDAK akan pernah keluar Fa0/5 (beda broadcast domain)</pre>`,
      scenario: 'Teknisi memasang CCTV baru dan menancapkannya ke port kosong. Karena port itu masih access VLAN 1 (default), CCTV mendapat IP yang salah dan NVR tidak menemukannya. Pelajaran NOC: tidak ada "port kosong netral" — setiap port harus diberi VLAN yang benar sebelum dipakai.',
      bestPractices: 'Selalu set switchport mode access secara eksplisit (jangan biarkan dynamic), beri VLAN yang benar, aktifkan PortFast di port akses, dan nonaktifkan (shutdown) port yang tidak dipakai.',
      security: 'Port access yang dibiarkan dynamic bisa dinegosiasi menjadi trunk oleh attacker (VLAN hopping). Selalu kunci mode access + nonaktifkan trunking negotiation dengan switchport nonegotiate di port user.',
      challenge: 'Di lab: buat VLAN 40 (GUEST), jadikan Fa0/6 access VLAN 40, colok PC dengan IP 192.168.40.50. Buktikan dengan ping bahwa PC ini TIDAK bisa ping PC di VLAN 20 — lalu jelaskan mengapa (aturan emas).',
      interviewQ: 'Q: "Apa itu access port?" — A: Port switch yang menjadi anggota tepat satu VLAN dan menghubungkan end device. Frame-nya untagged karena end device tidak memahami VLAN tag; switch menandai VLAN secara internal berdasarkan access VLAN port tersebut.',
      quiz: [
        {
          q: 'Access port memiliki karakteristik apa?',
          options: [
            'Anggota banyak VLAN sekaligus dengan frame tagged',
            'Anggota satu VLAN, menghubungkan end device, frame untagged',
            'Hanya untuk menghubungkan antar switch',
            'Selalu berada di VLAN 1',
          ],
          answer: 1,
          explain: 'Access = satu VLAN, untuk end device, untagged. Trunk-lah yang multi-VLAN dan tagged.',
        },
        {
          q: 'Mengapa perintah switchport mode access sebaiknya ditulis eksplisit?',
          options: [
            'Agar port lebih cepat',
            'Agar port tidak bisa dinegosiasi menjadi trunk secara dinamis (mencegah VLAN hopping)',
            'Agar VLAN 1 terhapus',
            'Tidak ada alasan, hanya gaya penulisan',
          ],
          answer: 1,
          explain: 'Default dynamic bisa dinegosiasi jadi trunk oleh lawan — celah keamanan. Mode access statis menguncinya.',
        },
        {
          q: 'PC dengan IP 192.168.20.50 dicolok ke access port VLAN 10. Apa yang terjadi?',
          options: [
            'Bisa ping gateway 192.168.20.1 seperti biasa',
            'Tidak bisa komunikasi normal — ia berada di broadcast domain VLAN 10 (butuh IP 192.168.10.x)',
            'Otomatis pindah ke VLAN 20',
            'Switch mengubah IP-nya otomatis',
          ],
          answer: 1,
          explain: 'Aturan emas: 1 VLAN = 1 subnet. Port VLAN 10 = subnet 192.168.10.0/24; IP 192.168.20.x tidak valid di sana.',
        },
      ],
    },
    {
      id: '8.8',
      title: 'Trunk Port',
      body: `
<p><b>Trunk port</b> adalah port switch yang membawa traffic <b>banyak VLAN sekaligus</b> dalam satu kabel fisik. Trunk dipakai untuk <b>link antar switch</b> dan <b>link switch → router/firewall</b> — tempat di mana banyak VLAN harus lewat bersamaan.</p>
<h3>Mengapa Trunk Dibutuhkan? (Masalah yang Diselesaikan)</h3>
<p>Tanpa trunk, setiap VLAN butuh <b>satu kabel fisik + satu port</b> di tiap hop. Dengan 5 VLAN (10, 20, 30, 40, 99) antar dua switch, kamu butuh 5 kabel. Dengan trunk: <b>1 kabel</b> untuk semuanya — tiap frame diberi <b>tag VLAN</b> (802.1Q) agar tidak tertukar.</p>
<h3>Cara Kerja Sederhana</h3>
<ul>
<li>Frame <b>masuk</b> trunk dari switch lain → tag VLAN-nya dibaca → diteruskan hanya ke port anggota VLAN itu.</li>
<li>Frame <b>keluar</b> lewat trunk → switch <b>menambahkan tag</b> 802.1Q berisi VLAN ID (kecuali native VLAN — lihat 8.9).</li>
<li>Daftar VLAN yang boleh lewat diatur dengan <b>allowed VLAN list</b>.</li>
</ul>
<h3>Lab Terpandu: Konfigurasi Trunk (Cisco IOS)</h3>
<p><b>Topology:</b> SW1 Fa0/24 ──kabel── Fa0/24 SW2. VLAN 10, 20, 30, 99 harus bisa lewat; VLAN 40 (GUEST) <i>tidak boleh</i> lewat trunk ini (kebijakan desain).</p>
<p><b>Objective:</b> trunk terbentuk, hanya VLAN yang diizinkan yang lewat, PC di SW1 VLAN 20 bisa ping PC di SW2 VLAN 20.</p>
<pre>SW1(config)# interface fa0/24
SW1(config-if)# switchport mode trunk
! ALASAN: jadikan port trunk secara eksplisit. Tanpa ini, port bisa
! tetap access dan semua VLAN selain satu akan mati di link ini.

SW1(config-if)# switchport trunk encapsulation dot1q
! ALASAN: pilih protokol tagging 802.1Q. (Di switch lama Cisco ada pilihan
! ISL — proprietary dan usang; selalu pilih dot1q agar interoperabel
! dengan semua vendor.)

SW1(config-if)# switchport trunk allowed vlan 10,20,30,99
! ALASAN: batasi VLAN yang boleh lewat trunk. Prinsip least privilege:
! VLAN 40 (GUEST) tidak butuh ke switch ini → jangan dibawa. Ini juga
! mengurangi broadcast yang menyeberang link.

SW1(config-if)# switchport trunk native vlan 99
! ALASAN: samakan native VLAN di kedua sisi (detail di 8.9). Native VLAN
! mismatch = salah satu error paling umum di trunk.

SW1(config-if)# no shutdown
! Ulangi konfigurasi CERMIN di SW2 Fa0/24 — trunk butuh kedua sisi sepakat.</pre>
<h3>Verification</h3>
<pre>SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Fa0/24      on           802.1q         trunking      99
Port        Vlans allowed on trunk
Fa0/24      10,20,30,99
! ✔ Mode trunking, enkapsulasi dot1q, native 99, allowed list sesuai desain.

SW1# show interfaces fa0/24 switchport | include Operational|Trunking
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
! ✔ Kedua sisi harus "trunk" — jika satu sisi "static access", trunk GAGAL.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> di SW2, ubah <code>switchport trunk allowed vlan 10,30,99</code> (VLAN 20 hilang dari list).</li>
<li><b>Gejala:</b> PC VLAN 20 di SW1 tidak bisa ping PC VLAN 20 di SW2; VLAN lain normal.</li>
<li><b>Troubleshoot:</b> <code>show interfaces trunk</code> di kedua sisi → allowed list tidak simetris. Itulah penyebabnya: frame VLAN 20 ditolak masuk trunk di SW2.</li>
<li><b>Fix:</b> kembalikan allowed vlan 10,20,30,99 di SW2.</li>
<li><b>Final verification:</b> ping antar-switch VLAN 20 berhasil + <code>show interfaces trunk</code> simetris.</li>
</ul>
<div class="callout"><div class="t">Perintah Berbahaya</div><p style="margin:4px 0 0"><code>switchport trunk allowed vlan none</code> atau salah ketik allowed list di production akan <b>memutus semua VLAN</b> di link itu seketika — termasuk VLAN management tempat kamu me-remote switch. Selalu gunakan <code>add</code> (<code>switchport trunk allowed vlan add 40</code>) untuk menambah tanpa menghapus yang sudah ada.</p></div>`,
      terms: [
        ['Trunk port', 'Port switch yang membawa banyak VLAN dalam satu link fisik; frame diberi tag 802.1Q.'],
        ['Allowed VLAN list', 'Daftar VLAN yang diizinkan melewati sebuah trunk.'],
        ['ISL', 'Inter-Switch Link — protokol trunking proprietary Cisco yang usang; selalu pilih 802.1Q.'],
      ],
      diagram: `<pre>TRUNK — satu kabel, banyak VLAN (dipisahkan tag)

 SW1 Fa0/24 ════════════════ Fa0/24 SW2
   [trunk: tag 10] [tag 20] [tag 30] [tag 99]
        │              │         │         │
     VLAN 10        VLAN 20   VLAN 30   VLAN 99
     (CCTV)         (OFFICE)  (SERVER)  (MGMT)

 Tanpa trunk: butuh 4 kabel + 4 port tiap sisi. Dengan trunk: 1 kabel.</pre>`,
      scenario: 'Gedung 3 lantai: tiap lantai satu switch akses, semua terhubung ke core switch. Tanpa trunk, tiap lantai butuh 5 kabel uplink (satu per VLAN). Dengan trunk, 1 kabel fiber per lantai cukup — hemat port SFP mahal dan rapi. Inilah alasan trunk adalah konfigurasi wajib di setiap link antar-switch enterprise.',
      bestPractices: 'Batasi allowed VLAN hanya pada yang benar-benar dibutuhkan (prune); samakan native VLAN di kedua sisi; dokumentasikan setiap trunk (port mana, VLAN apa saja) di diagram jaringan.',
      security: 'Trunk yang membawa VLAN management (99) ke switch yang tidak perlu adalah risiko: batasi allowed list. Jangan pernah trunk ke port yang menghadap user — itu undangan VLAN hopping.',
      challenge: 'Di lab 2 switch: buat trunk dengan allowed VLAN 10,20 saja. Buktikan VLAN 30 tidak bisa lewat (ping gagal antar switch), lalu tambahkan dengan perintah add tanpa mengganggu VLAN yang sudah jalan.',
      interviewQ: 'Q: "Apa itu trunk port dan kapan dipakai?" — A: Port yang membawa banyak VLAN dalam satu link fisik memakai tag 802.1Q. Dipakai di link antar-switch dan switch-ke-router agar tidak butuh satu kabel per VLAN.',
      quiz: [
        {
          q: 'Apa fungsi utama trunk port?',
          options: [
            'Menghubungkan PC ke switch',
            'Membawa banyak VLAN dalam satu link fisik antar switch/router memakai tag 802.1Q',
            'Mempercepat satu VLAN tertentu',
            'Menggabungkan semua VLAN menjadi satu broadcast domain',
          ],
          answer: 1,
          explain: 'Trunk = satu kabel untuk banyak VLAN; tiap frame ditandai tag agar VLAN tidak tertukar.',
        },
        {
          q: 'Apa dampak perintah switchport trunk allowed vlan 10,20 (tanpa add) pada trunk yang sebelumnya mengizinkan 10,20,30?',
          options: [
            'Menambahkan VLAN 10 dan 20',
            'Mengganti list menjadi HANYA 10,20 — VLAN 30 terputus',
            'Tidak ada efek',
            'Menjadikan port access',
          ],
          answer: 1,
          explain: 'Tanpa kata kunci add, perintah ini MENGGANTI seluruh list. Untuk menambah, pakai ... allowed vlan add 30.',
        },
        {
          q: 'Bagaimana memverifikasi trunk sudah terbentuk dengan benar di Cisco?',
          options: [
            'show running-config saja sudah cukup',
            'show interfaces trunk — cek status trunking, encapsulation dot1q, native VLAN, dan allowed list',
            'ping ke 8.8.8.8',
            'show ip route',
          ],
          answer: 1,
          explain: 'show interfaces trunk menampilkan status operasional trunk: mode, enkapsulasi, native VLAN, dan VLAN yang diizinkan.',
        },
      ],
    },
    {
      id: '8.9',
      title: 'Native VLAN',
      body: `
<p><b>Native VLAN</b> adalah satu VLAN di sebuah trunk yang frame-nya dikirim <b>tanpa tag (untagged)</b>. Default-nya VLAN 1 di Cisco. Semua VLAN lain di trunk dikirim <i>tagged</i>.</p>
<h3>Mengapa Ada Native VLAN?</h3>
<p>Dua alasan historis-teknis:</p>
<ul>
<li><b>Kompatibilitas:</b> perangkat lama yang tidak mengerti tag tetap bisa berkomunikasi lewat trunk memakai frame untagged.</li>
<li><b>Protokol kontrol:</b> beberapa protokol (mis. CDP, DTP, STP BPDU di beberapa implementasi) dikirim untagged di native VLAN.</li>
</ul>
<h3>Aturan Kritis: Native VLAN Harus Sama di Kedua Sisi</h3>
<p>Jika SW1 native VLAN 1 dan SW2 native VLAN 99 pada trunk yang sama → <b>native VLAN mismatch</b>. Akibatnya: frame untagged dari SW1 (yang ia anggap VLAN 1) diterima SW2 sebagai VLAN 99 — <b>traffic dua VLAN tercampur</b>. CDP akan memberi peringatan, tetapi traffic tetap bocor sebelum diperbaiki.</p>
<pre>! Deteksi mismatch:
SW1# show cdp neighbors detail
! ... Native VLAN: 1 (SW1) vs 99 (SW2) → %CDP-4-NATIVE_VLAN_MISMATCH
! Fix: samakan di kedua sisi, mis. keduanya native vlan 99.</pre>
<div class="callout"><div class="t">Native VLAN & Keamanan</div><p style="margin:4px 0 0">Serangan <b>double tagging</b> mengeksploitasi native VLAN untuk melompat antar VLAN. Praktik aman modern: (1) samakan native VLAN di kedua sisi, (2) gunakan VLAN khusus yang <i>tidak dipakai user mana pun</i> sebagai native (mis. VLAN 99 MANAGEMENT di desain kita — atau VLAN dummy khusus), (3) jangan biarkan default VLAN 1 sebagai native di trunk production.</p></div>
<h3>Packet Flow dengan Native VLAN</h3>
<pre>Trunk SW1 ──▶ SW2, native VLAN 99, allowed 10,20,30,99

Frame VLAN 20  → dikirim TAGGED   (tag=20)   → SW2 baca tag → VLAN 20 ✔
Frame VLAN 99  → dikirim UNTAGGED (no tag)    → SW2 anggap VLAN 99 (native) ✔
Frame VLAN 1   → DITOLAK (tidak di allowed list) ✔</pre>
<p>Catatan: karena native dikirim untagged, <b>allowed VLAN</b> tetap berlaku — native VLAN yang tidak ada di allowed list juga tidak akan lewat.</p>`,
      terms: [
        ['Native VLAN', 'VLAN di trunk yang frame-nya dikirim untagged; default VLAN 1 di Cisco.'],
        ['Native VLAN mismatch', 'Konfigurasi native VLAN berbeda di dua sisi trunk — menyebabkan traffic VLAN tercampur.'],
        ['Double tagging', 'Serangan VLAN hopping yang mengeksploitasi native VLAN dengan dua lapis tag 802.1Q.'],
      ],
      diagram: `<pre>NATIVE VLAN di trunk (native = 99)

 SW1 ════════════════════════ SW2
  │  tag=10  │  tag=20  │  tag=30  │  (untagged)  │
  │  VLAN 10 │ VLAN 20 │ VLAN 30 │   VLAN 99     │
  │  (CCTV)  │ (OFFICE)│ (SERVER)│   (MGMT)      │
  └──────────┴─────────┴─────────┴───────────────┘
        tagged ▲                    ▲ untagged (native)

 ❌ SW1 native=1, SW2 native=99 → frame untagged VLAN 1
    dibaca sebagai VLAN 99 di SW2 = KEBOCORAN VLAN</pre>`,
      scenario: 'Setelah maintenance malam hari, user VLAN OFFICE (20) komplain "kadang dapat IP aneh 192.168.99.x". Ternyata teknisi mengganti switch dan lupa menyamakan native VLAN di trunk baru (default 1 vs 99). DHCP request untagged nyasar ke VLAN 99 dan dijawab DHCP server management. Kasus klasik native mismatch.',
      bestPractices: 'Standarkan satu native VLAN untuk seluruh trunk di organisasimu (mis. 99), dokumentasikan, dan jadikan item checklist setiap instalasi switch baru: "native VLAN trunk sudah 99?".',
      security: 'Jangan pernah memakai VLAN user (10/20/30/40) sebagai native — pakai VLAN khusus yang tidak menampung end device. Ini menutup vektor double tagging.',
      challenge: 'Sengaja buat native mismatch di lab (satu sisi 1, satu sisi 99). Catat pesan error CDP-nya, amati gejala traffic-nya, lalu perbaiki. Tulis kenapa ini berbahaya dari sisi keamanan.',
      interviewQ: 'Q: "Apa itu native VLAN dan apa risikonya?" — A: VLAN yang frame-nya dikirim untagged di trunk (default VLAN 1). Risikonya: mismatch antar sisi mencampur traffic dua VLAN, dan ia dieksploitasi serangan double tagging — makanya disamakan dan diganti dari default.',
      quiz: [
        {
          q: 'Apa yang dimaksud native VLAN pada trunk?',
          options: [
            'VLAN pertama yang dibuat di switch',
            'Satu VLAN yang frame-nya dikirim untagged di trunk; default VLAN 1',
            'VLAN dengan ID terbesar',
            'VLAN khusus untuk router',
          ],
          answer: 1,
          explain: 'Native VLAN = VLAN yang dikirim tanpa tag di trunk; default-nya VLAN 1 di Cisco.',
        },
        {
          q: 'Apa akibat native VLAN mismatch (SW1=1, SW2=99)?',
          options: [
            'Trunk mati total',
            'Frame untagged dari satu sisi dibaca sebagai VLAN yang salah di sisi lain — traffic VLAN tercampur',
            'Semua VLAN terhapus',
            'Tidak ada akibat, hanya warning kosmetik',
          ],
          answer: 1,
          explain: 'Mismatch membuat frame untagged diinterpretasikan sebagai VLAN berbeda di tiap sisi = kebocoran antar VLAN.',
        },
        {
          q: 'Praktik aman terkait native VLAN adalah…',
          options: [
            'Biarkan default VLAN 1 di semua trunk',
            'Samakan di kedua sisi, pakai VLAN khusus yang tidak dipakai end device, jangan biarkan VLAN 1',
            'Beda-bedakan tiap trunk agar unik',
            'Hapus native VLAN dari konfigurasi',
          ],
          answer: 1,
          explain: 'Samakan kedua sisi + gunakan VLAN khusus non-user + hindari default VLAN 1 untuk menutup vektor double tagging.',
        },
      ],
    },
    {
      id: '8.10',
      title: 'VLAN Tagging',
      body: `
<p><b>VLAN tagging</b> adalah proses switch <b>menyelipkan label VLAN ID</b> ke dalam header frame Ethernet saat frame melewati trunk, lalu <b>melepasnya kembali</b> sebelum frame keluar lewat access port. Tanpa tagging, trunk tidak mungkin memisahkan banyak VLAN dalam satu kabel.</p>
<h3>Di Mana Tag Ditambahkan & Dilepas?</h3>
<ol>
<li><b>Access port (masuk):</b> PC kirim frame untagged → switch menandai internal "VLAN 20" (dari access VLAN).</li>
<li><b>Trunk (keluar):</b> switch menyisipkan tag 802.1Q berisi VLAN ID 20 ke frame.</li>
<li><b>Trunk (masuk di switch lawan):</b> switch membaca tag → tahu frame milik VLAN 20.</li>
<li><b>Access port (keluar):</b> tag <b>dilepas</b> → PC terima frame Ethernet biasa (PC tidak tahu-menahu soal VLAN).</li>
</ol>
<div class="callout blue"><div class="t">End Device Tidak Pernah Melihat Tag</div><p style="margin:4px 0 0">PC, printer, dan CCTV menerima frame <i>bersih tanpa tag</i> — tagging hanya terjadi <b>di kabel trunk antar perangkat infrastruktur</b>. Pengecualian: VoIP phone dan hypervisor (VMware/Proxmox) yang memang dikonfigurasi sadar-VLAN — itu topik lanjutan.</p></div>
<h3>Packet Flow Lengkap: PC-A (VLAN 20) → PC-B (VLAN 20) Beda Switch</h3>
<pre>PC-A                                    SW1                    SW2                                   PC-B
Fa0/5(access 20)                        Fa0/24(trunk)          Fa0/24(trunk)                         Fa0/5(access 20)
  │                                        │                      │                                      │
  │── frame untagged ──────────────────▶   │                      │                                      │
  │   [src AAAA|dst BBBB]                  │                      │                                      │
  │                                        │── tagged (VLAN 20) ──▶│                                     │
  │                                        │   [tag=20|src|dst]   │── lepas tag ──▶                      │
  │                                        │                      │   frame untagged ──────────────────▶  │
  │                                        │                      │                                      │ terima ✔

Kunci: tag hanya hidup di kabel trunk SW1–SW2. Di kedua ujung akses, frame polos.</pre>
<h3>Aturan Tagging</h3>
<div class="tblwrap"><table>
<tr><th>Skenario</th><th>Tag?</th><th>Alasan</th></tr>
<tr><td>Access → trunk (VLAN bukan native)</td><td>Ditambahkan</td><td>Agar switch lawan tahu VLAN-nya</td></tr>
<tr><td>Access → trunk (VLAN = native)</td><td>Tidak</td><td>Native VLAN dikirim untagged (8.9)</td></tr>
<tr><td>Trunk → access</td><td>Dilepas</td><td>End device tidak mengerti tag</td></tr>
<tr><td>Trunk → trunk</td><td>Dipertahankan</td><td>Tag terus dibawa sepanjang path trunk</td></tr>
</table></div>`,
      terms: [
        ['VLAN tagging', 'Penyisipan label VLAN ID ke frame Ethernet di trunk; dilepas sebelum ke access port.'],
        ['Tagged frame', 'Frame yang membawa label 802.1Q.'],
      ],
      diagram: `<pre>SIKLUS HIDUP SEBUAH TAG

 [PC-A] ──polos──▶ [SW1 access] ──beri tag──▶ ═══ trunk ═══ ▶──baca tag──▶ [SW2] ──lepas tag──▶ ──polos──▶ [PC-B]
                       ▲                                                     ▲
                 "kamu VLAN 20"                                     "tag 20 → kirim ke
                                                                     port VLAN 20"</pre>`,
      scenario: 'Engineer melakukan packet capture di kabel trunk dan heran melihat frame "lebih panjang" dari biasa — Wireshark menunjukkan field 802.1Q dengan VLAN ID. Capture yang sama di port akses PC tidak menunjukkan tag. Memahami di mana tag hidup membuat hasil capture terbaca dengan benar.',
      bestPractices: 'Saat capture untuk troubleshooting VLAN, capture-lah di trunk (untuk melihat tag) DAN di access port (untuk memastikan tag sudah dilepas dengan benar). Keduanya memberi cerita berbeda.',
      security: 'Karena tag hanya bermakna di trunk, jangan pernah menghubungkan port trunk ke perangkat user — user bisa membuat frame bertag palsu dan menyuntikkannya ke VLAN mana pun (VLAN hopping).',
      challenge: 'Gambar di kertas perjalanan frame dari CCTV (VLAN 10, SW1) ke NVR (VLAN 10, SW2): tulis di setiap kabel apakah frame tagged atau untagged + VLAN ID-nya.',
      interviewQ: 'Q: "Kapan switch menambahkan dan melepas VLAN tag?" — A: Tag ditambahkan saat frame keluar lewat trunk (kecuali native VLAN), dibaca saat masuk dari trunk, dan dilepas saat frame keluar lewat access port — end device selalu menerima frame polos.',
      quiz: [
        {
          q: 'Di mana dalam jaringan VLAN tag 802.1Q "hidup"?',
          options: [
            'Di semua kabel termasuk ke PC',
            'Hanya di link trunk antar perangkat infrastruktur; dilepas sebelum ke access port',
            'Hanya di kabel fiber',
            'Di dalam MAC address table',
          ],
          answer: 1,
          explain: 'Tag hanya disisipkan di trunk dan dilepas sebelum frame keluar access port — end device menerima frame polos.',
        },
        {
          q: 'Frame VLAN 20 keluar trunk yang native VLAN-nya 99. Apakah diberi tag?',
          options: [
            'Tidak, karena sudah di trunk',
            'Ya, diberi tag VLAN 20 — hanya native VLAN (99) yang dikirim untagged',
            'Ya, diberi dua tag',
            'Tidak, tag hanya untuk VLAN 10',
          ],
          answer: 1,
          explain: 'Hanya native VLAN yang untagged di trunk; VLAN lain selalu tagged.',
        },
        {
          q: 'Mengapa tag harus dilepas sebelum frame sampai ke PC?',
          options: [
            'Agar frame lebih cepat',
            'Karena end device (PC/printer) umumnya tidak memahami format frame bertag dan bisa menolaknya',
            'Agar hemat bandwidth',
            'Agar MAC table tidak penuh',
          ],
          answer: 1,
          explain: 'NIC biasa mengharapkan frame Ethernet standar; tag yang tidak dikenal bisa menyebabkan frame dibuang.',
        },
      ],
    },
    {
      id: '8.11',
      title: '802.1Q',
      body: `
<p><b>IEEE 802.1Q</b> adalah <b>standar internasional</b> untuk VLAN tagging di jaringan Ethernet. "Standar" artinya: dipatuhi semua vendor (Cisco, MikroTik, HP, Ubiquiti) — trunk Cisco bisa tersambung ke switch MikroTik selama keduanya bicara 802.1Q.</p>
<h3>Anatomi Tag 802.1Q (4 Byte)</h3>
<p>Tag disisipkan <b>di antara</b> field Source MAC dan EtherType/Length pada frame Ethernet:</p>
<div class="tblwrap"><table>
<tr><th>Field</th><th>Ukuran</th><th>Isi & Makna</th></tr>
<tr><td>TPID (Tag Protocol Identifier)</td><td>2 byte</td><td><code>0x8100</code> — penanda "frame ini bertag 802.1Q"</td></tr>
<tr><td>PCP (Priority Code Point)</td><td>3 bit</td><td>Prioritas QoS 0–7 (mis. suara VoIP = 5–6) — dipakai QoS</td></tr>
<tr><td>DEI (Drop Eligible Indicator)</td><td>1 bit</td><td>"Boleh dibuang duluan saat macet" (dulu disebut CFI)</td></tr>
<tr><td>VID (VLAN Identifier)</td><td>12 bit</td><td>ID VLAN: 1–4094 (0 dan 4095 direservasi)</td></tr>
</table></div>
<h3>Implikasi Ukuran Frame</h3>
<ul>
<li>Frame Ethernet standar: maks <b>1518 byte</b>. Dengan tag 802.1Q: maks <b>1522 byte</b>.</li>
<li>Perangkat yang tidak mendukung "baby giant frame" bisa menolak frame 1522 byte — masalah klasik saat trunk menghubungkan switch lama. Solusi: pastikan semua perangkat path mendukung 802.1Q (hampir semua perangkat modern mendukung).</li>
<li><b>12 bit VID → 4094 VLAN</b> per jaringan Layer 2. Cukup untuk enterprise; bila kurang, ada Q-in-Q (802.1ad, double tag) untuk provider — di luar cakupan part ini.</li>
</ul>
<h3>Membaca Tag di Wireshark</h3>
<pre>Frame 42: 1522 bytes on wire
Ethernet II, Src: ..., Dst: ...
802.1Q Virtual LAN, PRI: 0, DEI: 0, ID: 20
    000. .... .... .... = Priority: 0
    ...0 .... .... .... = DEI: 0
    .... 0000 0001 0100 = ID: 20        ← VLAN 20 (OFFICE) ✔
Internet Protocol Version 4, Src: 192.168.20.50 ...</pre>
<p>Kemampuan membaca baris <code>802.1Q ... ID: 20</code> adalah skill troubleshooting VLAN yang sangat praktis: ia membuktikan VLAN berapa yang sebenarnya dibawa sebuah frame di trunk.</p>
<div class="callout blue"><div class="t">802.1Q vs ISL</div><p style="margin:4px 0 0">ISL adalah protokol trunking <b>proprietary Cisco</b> (tag di luar frame, bukan disisipkan) yang sudah <b>usang/deprecated</b>. Selalu gunakan 802.1Q (<code>switchport trunk encapsulation dot1q</code>) agar interoperabel antar vendor dan dengan materi sertifikasi modern.</p></div>`,
      terms: [
        ['IEEE 802.1Q', 'Standar VLAN tagging antar-vendor; tag 4 byte disisipkan di frame Ethernet.'],
        ['TPID', 'Tag Protocol Identifier 0x8100 — penanda frame bertag 802.1Q.'],
        ['VID', 'VLAN Identifier 12 bit — rentang VLAN ID valid 1–4094.'],
        ['PCP', 'Priority Code Point 3 bit — prioritas QoS di dalam tag.'],
        ['Q-in-Q (802.1ad)', 'Double tagging untuk provider; dua lapis tag untuk memperbanyak ruang VLAN.'],
      ],
      diagram: `<pre>FRAME ETHERNET DENGAN TAG 802.1Q (4 byte disisipkan)

 Tanpa tag (1518 maks):
 | dst MAC | src MAC | EtherType |      Payload      | FCS |

 Dengan tag 802.1Q (1522 maks):
 | dst MAC | src MAC | TPID=0x8100 | PCP | DEI | VID | EtherType | Payload | FCS |
                         └────────── 4 byte tag ──────────┘
                                          ▲
                              "saya VLAN 20, prioritas 0"</pre>`,
      scenario: 'Perusahaan mengganti core switch Cisco dengan MikroTik untuk hemat biaya. Trunk antar keduanya langsung jalan karena keduanya memakai 802.1Q — tidak perlu protokol proprietary. Inilah nilai standar terbuka: kamu tidak dikunci ke satu vendor.',
      bestPractices: 'Selalu verifikasi encapsulation dot1q di setiap trunk (show interfaces trunk). Jika menghubungkan perangkat lama, pastikan ia mendukung frame 1522 byte sebelum menyalahkan konfigurasi.',
      security: 'Field PCP di tag bisa dimanfaatkan untuk QoS — tetapi juga bisa dipalsukan user untuk "mencuri" prioritas. Di port akses user, normalisasi/abaikan prioritas masuk (trust boundary di switch distribusi, bukan di akses).',
      challenge: 'Buka capture Wireshark contoh di materi: identifikasi TPID, PCP, dan VID-nya. Lalu jawab: berapa VLAN ID maksimum yang bisa diwakili 12 bit? Mengapa 0 dan 4095 tidak dipakai?',
      interviewQ: 'Q: "Jelaskan struktur tag 802.1Q." — A: 4 byte disisipkan antara source MAC dan EtherType: TPID 0x8100 (2 byte), PCP 3 bit (prioritas QoS), DEI 1 bit, dan VID 12 bit (VLAN ID 1–4094). Membuat frame maksimum 1522 byte.',
      quiz: [
        {
          q: 'Berapa ukuran tag 802.1Q dan di mana posisinya?',
          options: [
            '2 byte di akhir frame',
            '4 byte disisipkan antara Source MAC dan EtherType',
            '8 byte di awal frame',
            '12 byte menggantikan FCS',
          ],
          answer: 1,
          explain: 'Tag 802.1Q = 4 byte (TPID+PCP/DEI/VID) disisipkan setelah Source MAC, sebelum EtherType.',
        },
        {
          q: 'Berapa rentang VLAN ID yang valid dan mengapa?',
          options: [
            '1–4094, karena field VID 12 bit (0 dan 4095 direservasi)',
            '1–1000, batasan Cisco',
            '0–65535, seperti port TCP',
            '1–256, satu byte',
          ],
          answer: 0,
          explain: 'VID 12 bit = 4096 nilai; 0 dan 4095 direservasi, menyisakan 1–4094.',
        },
        {
          q: 'Mengapa untuk trunk antar-vendor sebaiknya selalu memakai 802.1Q?',
          options: [
            'Karena lebih cepat dari ISL',
            'Karena 802.1Q adalah standar terbuka IEEE yang didukung semua vendor, sedangkan ISL proprietary Cisco dan usang',
            'Karena 802.1Q tidak butuh konfigurasi',
            'Karena ISL tidak mendukung VLAN',
          ],
          answer: 1,
          explain: 'Standar terbuka = interoperabilitas. ISL proprietary dan deprecated — 802.1Q adalah satu-satunya pilihan modern.',
        },
      ],
    },
  ],
};
