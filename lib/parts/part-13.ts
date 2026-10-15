import type { Part } from './types';

export const part13: Part = {
  id: '13',
  number: 'PART 13',
  title: 'MikroTik RouterOS',
  phaseId: 'fase-3',
  description: 'Menguasai RouterOS: CLI, WinBox, interface, IP, routing, DHCP, NAT, firewall, queue, dan VLAN.',
  repoFolder: 'part-13-mikrotik-routeros',
  objectives: [
    'Menjelaskan arsitektur RouterOS dan perbedaan penting versi v6 vs v7.',
    'Mengoperasikan RouterOS lewat CLI, WinBox, dan WebFig termasuk safe mode.',
    'Mengonfigurasi interface, bridge, IP address, static route, DHCP, DNS, dan ARP.',
    'Mengonfigurasi NAT, firewall filter, mangle, queue, dan VLAN sesuai desain lab.',
    'Menerapkan logging dan monitoring dasar serta membedakan praktik LAB vs production.'
  ],
  prerequisites: 'Part 11–12 (routing dan subnetting). Familiar dengan konsep VLAN dari Part 08–10.',
  subbabs: [
    {
      id: '13.1',
      title: 'Mengenal MikroTik',
      body: `<p><b>MikroTik</b> adalah perusahaan asal Latvia yang membuat dua hal: <b>RouterOS</b> (sistem operasi router) dan <b>RouterBOARD</b> (hardware router). Analogi sederhananya: jika Cisco menjual "mobil lengkap", MikroTik menjual "mesin + sasis terpisah yang bisa kamu rakit" — RouterOS bisa jalan di hardware MikroTik, di PC x86, maupun sebagai virtual machine (CHR, dibahas di Part 14).</p><h3>Mengapa MikroTik Populer di Indonesia?</h3><ul><li><b>Harga terjangkau</b> dengan fitur setara perangkat enterprise: routing, firewall, VPN, QoS, hotspot.</li><li><b>Satu OS untuk semua</b>: konfigurasi yang kamu pelajari di lab CHR identik dengan yang dipakai di hardware RB750/RB4011 di lapangan.</li><li><b>Komunitas besar</b>: forum, grup Telegram, dan tutorial Indonesia sangat banyak — troubleshooting jadi lebih mudah.</li><li><b>Lisensi fleksibel</b>: CHR bisa dicoba gratis, level lisensi menentukan fitur (Level 4 untuk wireless AP, Level 5/6 untuk fitur penuh).</li></ul><h3>RouterOS dalam Peta OSI</h3><p>RouterOS beroperasi terutama di <b>Layer 2</b> (bridge, VLAN, switching) dan <b>Layer 3</b> (routing, NAT, firewall). Artinya semua konsep Part 01–12 yang sudah kamu pelajari — IP address, subnet, gateway, VLAN — akan dipraktikkan langsung di OS ini.</p><div class="callout blue"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, kamu bebas memakai CHR tanpa lisensi (limitasi kecepatan 1 Mbps per interface — cukup untuk belajar). Di production, pastikan lisensi sesuai kebutuhan dan RouterOS selalu di-update ke versi stable (bugfix), bukan sekadar versi terbaru.</p></div>`,
      terms: [['RouterOS', 'Sistem operasi router buatan MikroTik, berbasis kernel Linux.'], ['RouterBOARD', 'Hardware router fisik buatan MikroTik (contoh: hAP, RB4011, CCR).'], ['CHR (Cloud Hosted Router)', 'RouterOS versi virtual machine untuk hypervisor/cloud — dipakai di semua lab Part 13–16.'], ['Level lisensi', 'Tingkatan lisensi RouterOS (0–6) yang menentukan fitur aktif, mis. jumlah tunnel VPN.']],
      diagram: `<pre>           EKOSISTEM MIKROTIK

   +------------------+     +------------------+
   |   RouterBOARD    |     |   PC / Server x86  |
   | (hardware fisik) |     |  (install ISO)     |
   +--------+---------+     +--------+-----------+
            |                        |
            +-----------+------------+
                        |
                 +------+------+
                 |  RouterOS   |  <-- SATU OS, perintahnya sama
                 +------+------+
                        |
            +-----------+-----------+
            |                       |
     +------+------+        +-------+-------+
     |     CHR     |        |   Container   |  (v7)
     | (VM image)  |        | (Docker di    |
     +-------------+        |  RouterOS)    |
                            +---------------+

  Kamu belajar di CHR — skill-nya 1:1 pindah ke hardware.</pre>`,
      scenario: 'Sebuah ISP kecil di Jawa melayani 200 pelanggan rumahan hanya dengan satu RB4011: routing, PPPoE server, firewall, dan QoS semua jalan di satu box. Inilah alasan MikroTik mendominasi segmen ISP kecil-menengah Indonesia.',
      bestPractices: 'Pelajari konsepnya sekali di CHR, lalu anggap semua perangkat MikroTik berperilaku sama — jangan menghafal per model hardware.',
      security: 'Router default MikroTik (khususnya yang terekspos ke internet) adalah target botnet global. Jangan pernah pasang RouterOS tanpa mengganti password admin dan mematikan akses management dari WAN.',
      challenge: 'Sebutkan 3 alasan MikroTik populer di Indonesia dan jelaskan dengan kata-katamu apa beda RouterOS dengan RouterBOARD.',
      interviewQ: 'Q: "Mengapa banyak ISP kecil memakai MikroTik?" — A: Rasio harga-fitur terbaik: routing, firewall, VPN, QoS, dan hotspot dalam satu OS murah; skill-nya transferable antara hardware dan CHR; komunitas troubleshooting-nya besar.',
      quiz: [
        { q: 'Apa perbedaan RouterOS dan RouterBOARD?', options: ['RouterOS = hardware, RouterBOARD = software', 'RouterOS = sistem operasi, RouterBOARD = hardware fisik', 'Keduanya nama lain firewall', 'RouterOS hanya untuk cloud'], answer: 1, explain: 'RouterOS adalah sistem operasi (software), RouterBOARD adalah perangkat hardware fisik. RouterOS juga bisa jalan di PC/VM (CHR).' },
        { q: 'Mengapa konfigurasi yang dipelajari di CHR tetap relevan untuk hardware MikroTik?', options: ['Karena CHR lebih cepat', 'Karena satu RouterOS dipakai di semua platform — perintahnya identik', 'Karena CHR gratis', 'Tidak relevan, harus belajar ulang'], answer: 1, explain: 'MikroTik memakai satu RouterOS untuk semua platform, jadi CLI/WinBox yang kamu kuasai di CHR berlaku 1:1 di hardware.' },
        { q: 'Di layer OSI mana RouterOS paling banyak bekerja?', options: ['Layer 5–7', 'Layer 1 saja', 'Layer 2 dan Layer 3 (bridge/VLAN/switching dan routing/NAT/firewall)', 'Layer 4 saja'], answer: 2, explain: 'Fitur utama RouterOS — bridge, VLAN, routing, NAT, firewall — berada di Layer 2 dan Layer 3.' }
      ]
    },
    {
      id: '13.2',
      title: 'RouterOS Architecture',
      body: `<p><b>Arsitektur RouterOS</b> adalah cara OS ini disusun: sebuah kernel Linux yang ramping, di atasnya berjalan service-service jaringan (routing, firewall, DHCP, wireless), dan semuanya dikendalikan lewat satu <b>menu tree</b> yang sama — baik kamu akses via CLI, WinBox, WebFig, maupun API.</p><h3>Menu Tree: Satu Bahasa, Banyak Wajah</h3><p>Semua konfigurasi RouterOS tersusun seperti pohon folder: <code>/ip address</code>, <code>/ip route</code>, <code>/ip firewall filter</code>, <code>/interface bridge</code>. Di CLI kamu mengetik path-nya; di WinBox kamu mengklik menu yang sama. Pahami satu, kamu paham semuanya.</p><div class="tblwrap"><table><tr><th>Menu</th><th>Fungsi</th><th>Layer OSI</th></tr><tr><td><code>/interface</code></td><td>Manajemen port fisik/virtual, bridge, VLAN</td><td>Layer 1–2</td></tr><tr><td><code>/ip address</code>, <code>/ip route</code></td><td>Pengalamatan dan routing</td><td>Layer 3</td></tr><tr><td><code>/ip firewall</code></td><td>Filter, NAT, mangle</td><td>Layer 3–4</td></tr><tr><td><code>/ip dhcp-server</code>, <code>/ip dns</code></td><td>Layanan ke client</td><td>Layer 7 (aplikasi jaringan)</td></tr><tr><td><code>/system</code>, <code>/tool</code></td><td>Administrasi, utilitas diagnosis</td><td>—</td></tr></table></div><h3>RouterOS v6 vs v7 — Perbedaan yang Wajib Tahu</h3><div class="tblwrap"><table><tr><th>Aspek</th><th>v6 (6.4x)</th><th>v7 (7.x)</th></tr><tr><td>Kernel Linux</td><td>3.3.5 (tua)</td><td>5.6.3+ (modern — driver hardware baru didukung)</td></tr><tr><td>Routing engine</td><td>Lama, BGP lambat di tabel besar</td><td>Ditulis ulang — BGP/OSPF jauh lebih cepat</td></tr><tr><td>WireGuard</td><td>Tidak ada</td><td>Native (VPN modern, dibahas Part 31)</td></tr><tr><td>Container</td><td>Tidak ada</td><td>Bisa menjalankan Docker container</td></tr><tr><td><code>routing-mark</code></td><td>Untuk policy routing</td><td>Diganti <code>routing-table</code> (nama tabel routing)</td></tr><tr><td>WinBox</td><td>WinBox v3</td><td>Disarankan WinBox v4</td></tr></table></div><div class="callout"><div class="t">Catatan Migrasi v6 → v7</div><p style="margin:4px 0 0">Mayoritas perintah dasar (<code>/ip address</code>, <code>/ip route</code>, firewall, DHCP) IDENTIK di v6 dan v7. Yang berubah terutama di routing lanjutan (BGP/OSPF) dan policy routing. Lab ini memakai <b>v7</b> (CHR terbaru), dengan catatan khusus bila ada perbedaan perilaku.</p></div>`,
      terms: [['Menu tree', 'Struktur hierarki konfigurasi RouterOS, mis. /ip firewall filter — sama di CLI, WinBox, dan API.'], ['Kernel', 'Inti sistem operasi; v7 memakai kernel Linux jauh lebih baru dibanding v6.'], ['WinBox', 'Aplikasi GUI native MikroTik untuk konfigurasi (Windows/macOS/Linux).'], ['API', 'Antarmuka pemrograman (REST/SSH) agar konfigurasi bisa diotomatisasi — fondasi Part 32–38.']],
      diagram: `<pre>              ARSITEKTUR RouterOS

  +-------------------------------------------------+
  |  CLI (SSH/Telnet) · WinBox · WebFig · API/REST  |  <-- wajahnya
  +------------------------+------------------------+
                           |
  +-------------------------------------------------+
  |              MENU TREE (satu bahasa)            |
  |  /interface  /ip  /routing  /system  /tool ...  |
  +------------------------+------------------------+
                           |
  +-------------------------------------------------+
  |   Service: firewall · DHCP · DNS · routing · VPN |
  +------------------------+------------------------+
                           |
  +-------------------------------------------------+
  |   Kernel Linux (v6: 3.3.5 · v7: 5.6.3+)         |
  +-------------------------------------------------+</pre>`,
      scenario: 'NOC sebuah perusahaan memonitor 50 router campuran v6 dan v7. Saat migrasi, tim menemukan script policy routing lama (pakai routing-mark) gagal di v7 — harus ditulis ulang memakai routing-table. Pelajaran: catat versi OS di dokumentasi setiap device.',
      bestPractices: 'Standarkan satu versi RouterOS (v7 stable) untuk seluruh lab agar perilaku konsisten; catat versi di tiap dokumentasi device.',
      security: 'Jangan asal upgrade ke "latest" — pakai channel "stable". Versi testing bisa membawa bug keamanan atau perubahan perilaku.',
      challenge: 'Jelaskan dengan analogi sendiri: apa itu menu tree RouterOS dan mengapa satu konsep berlaku untuk CLI, WinBox, dan API?',
      interviewQ: 'Q: "Apa perbedaan utama RouterOS v6 dan v7?" — A: Kernel Linux lebih baru, routing engine ditulis ulang (BGP/OSPF jauh lebih cepat), ada WireGuard native dan container support; routing-mark diganti routing-table untuk policy routing.',
      quiz: [
        { q: 'Apa hubungan CLI, WinBox, dan WebFig di RouterOS?', options: ['Tiga OS yang berbeda', 'Tiga wajah untuk satu menu tree konfigurasi yang sama', 'Hanya CLI yang bisa konfigurasi penuh', 'WebFig hanya untuk monitoring'], answer: 1, explain: 'Ketiganya mengakses menu tree yang sama — perintah yang kamu ketik di CLI setara dengan klik di WinBox.' },
        { q: 'Perbedaan arsitektur paling signifikan v7 dibanding v6 adalah…', options: ['Warna WinBox berubah', 'Kernel Linux lebih baru dan routing engine ditulis ulang', 'Harga lisensi naik', 'Tidak ada perbedaan'], answer: 1, explain: 'v7 membawa kernel 5.6.3+ dan routing engine baru — BGP/OSPF jauh lebih cepat — plus WireGuard dan container.' },
        { q: 'Di v7, pengganti routing-mark untuk policy routing adalah…', options: ['routing-flag', 'routing-table', 'routing-policy', 'mark-routing'], answer: 1, explain: 'v7 mengganti konsep routing-mark menjadi routing-table (nama tabel routing terpisah).' }
      ]
    },
    {
      id: '13.3',
      title: 'CLI',
      body: `<p><b>CLI (Command Line Interface)</b> adalah cara mengendalikan RouterOS lewat perintah teks — via SSH, Telnet, atau terminal di WinBox/WebFig. Di production dan automation, CLI adalah raja: script, backup, dan Ansible semuanya berbicara lewat CLI/API.</p><h3>Anatomi Perintah</h3><pre>[admin@MikroTik] /ip address&gt; add address=192.168.20.1/24 interface=ether2
[admin@MikroTik] /ip address&gt; print
[admin@MikroTik] /ip address&gt; ..        # naik satu level
[admin@MikroTik] /ip&gt; /                # kembali ke root</pre><p>Pola universalnya: <code>[path] + [aksi: add/set/print/remove/enable/disable] + [parameter]</code>. <code>print</code> menampilkan, <code>add</code> membuat baru, <code>set</code> mengubah yang ada (pakai nomor dari <code>print</code>), <code>remove</code> menghapus.</p><h3>Fitur Penyelamat Pemula</h3><ul><li><b>Tab completion:</b> ketik <code>/ip rou</code> + Tab → dilengkapi jadi <code>/ip route</code>. Mengurangi salah ketik.</li><li><b>Tanda tanya:</b> <code>/ip address add ?</code> menampilkan semua parameter yang tersedia.</li><li><b>Safe Mode (Ctrl+X):</b> mode aman — jika koneksi SSH putus saat safe mode aktif, semua perubahan sejak safe mode dibatalkan otomatis. WAJIB dipakai saat mengubah konfigurasi remote yang berisiko memutus aksesmu sendiri.</li></ul><div class="callout"><div class="t">Command Berbahaya — Tandai!</div><p style="margin:4px 0 0"><code>/system reset-configuration</code> menghapus SEMUA konfigurasi (kembali ke pabrik). <code>/ip firewall filter add chain=input action=drop</code> tanpa pengecualian akan mengunci dirimu sendiri keluar dari router. Selalu pakai <b>Safe Mode</b> sebelum eksperimen berisiko.</p></div><h3>Contoh Sesi Dasar</h3><pre>[admin@MikroTik] &gt; /system identity set name=R1-LAB
[admin@MikroTik] &gt; /system identity print
  name: R1-LAB
# Alasan: memberi nama memudahkan identifikasi saat mengelola banyak router.
# Tanpa nama, semua router tampil "MikroTik" dan gampang salah sentuh.</pre>`,
      terms: [['CLI', 'Antarmuka baris perintah — cara utama konfigurasi untuk automation dan troubleshooting cepat.'], ['Safe Mode', 'Mode (Ctrl+X) yang otomatis me-rollback perubahan jika koneksi terputus — pengaman konfigurasi remote.'], ['Tab completion', 'Pelengkapan perintah otomatis dengan tombol Tab.'], ['Prompt path', 'Penanda posisi menu aktif, mis. /ip address&gt; — seperti "folder" tempatmu berada.']],
      diagram: `<pre>              NAVIGASI CLI RouterOS

   /  (root)
   |
   +-- /interface .... /ip .... /system .... /tool
            |              |
            |              +-- address --&gt; add / print / set / remove
            |              +-- route
            |              +-- firewall --&gt; filter / nat / mangle
            |
            +-- bridge --&gt; add / print ...
            +-- vlan
            +-- ethernet --&gt; set / print ...

   Perintah:  /ip address add address=192.168.20.1/24 interface=ether2
              \_________/ \_/ \_____________________________________/
               path       aksi  parameter (nama=nilai)</pre>`,
      scenario: 'Engineer NOC mengubah firewall router cabang via SSH tanpa safe mode — salah ketik rule drop di chain input, koneksinya mati, dan ia harus menelepon orang di site untuk reboot fisik. Dengan safe mode (Ctrl+X), kesalahan itu akan rollback otomatis saat SSH putus.',
      bestPractices: 'Selalu tekan Ctrl+X (safe mode) sebelum mengubah konfigurasi pada router remote/production. Di lab lokal, biasakan juga agar jadi refleks.',
      security: 'Matikan Telnet (<code>/ip service disable telnet</code>) — Telnet mengirim password dalam teks polos. Pakai SSH saja. Alasan: siapa pun yang menyadap jaringan bisa membaca password Telnet.',
      challenge: 'Masuk ke CLI CHR lab-mu, navigasi ke /ip address, jalankan print, lalu kembali ke root. Catat prompt yang muncul di tiap level.',
      interviewQ: 'Q: "Apa itu safe mode dan kapan dipakai?" — A: Mode di CLI (Ctrl+X) yang otomatis membatalkan semua perubahan jika sesi terputus; dipakai saat konfigurasi remote berisiko memutus akses sendiri, mis. mengubah firewall atau IP interface management.',
      quiz: [
        { q: 'Apa fungsi Safe Mode (Ctrl+X) di CLI RouterOS?', options: ['Mempercepat koneksi', 'Otomatis me-rollback perubahan jika sesi terputus', 'Mengenkripsi konfigurasi', 'Menyembunyikan password'], answer: 1, explain: 'Safe mode membatalkan semua perubahan sejak diaktifkan bila koneksi putus — pengaman saat konfigurasi remote.' },
        { q: 'Perintah untuk melihat parameter yang tersedia pada suatu perintah adalah…', options: ['help me', 'tanda tanya (?) setelah perintah', 'show all', 'list param'], answer: 1, explain: 'Mengetik ? setelah perintah (mis. /ip address add ?) menampilkan semua parameter yang bisa dipakai.' },
        { q: 'Mengapa Telnet sebaiknya dimatikan dan diganti SSH?', options: ['Telnet lebih lambat', 'Telnet mengirim kredensial dalam teks polos sehingga bisa disadap', 'SSH gratis sedangkan Telnet berbayar', 'Telnet tidak ada di v7'], answer: 1, explain: 'Telnet tidak mengenkripsi trafik — username/password bisa dibaca penyadap. SSH mengenkripsi seluruh sesi.' }
      ]
    },
    {
      id: '13.4',
      title: 'WinBox',
      body: `<p><b>WinBox</b> adalah aplikasi GUI native MikroTik (Windows, macOS, Linux) untuk konfigurasi visual. Ia berbicara protokol proprietary di port <b>8291</b> (atau via <b>MAC address</b> Layer 2) — artinya kamu bisa konek ke router yang belum punya IP sama sekali, cukup lewat MAC.</p><h3>Cara Konek: IP vs MAC</h3><div class="tblwrap"><table><tr><th>Metode</th><th>Cara</th><th>Kapan Dipakai</th></tr><tr><td>Via IP</td><td>Masukkan IP router di kolom "Connect To"</td><td>Normal — router sudah punya IP management</td></tr><tr><td>Via MAC</td><td>Klik tab "Neighbors", pilih MAC, klik Connect</td><td>Router baru/reset, belum ada IP; atau IP salah konfigurasi</td></tr></table></div><p>Alasan MAC-connect penting: saat kamu salah konfigurasi IP dan router "hilang" dari jaringan, MAC-connect adalah pintu darurat Layer 2 untuk masuk kembali — selama kamu masih satu segmen broadcast dengannya.</p><h3>Anatomi Jendela WinBox</h3><ul><li><b>Menu kiri:</b> cerminan menu tree CLI — Interfaces, Bridge, IP → Addresses, IP → Firewall, dll.</li><li><b>Tombol + / − / ✓ / ✗:</b> add, remove, enable, disable — setara perintah CLI.</li><li><b>Safe Mode (tombol di toolbar):</b> sama fungsinya dengan Ctrl+X di CLI.</li><li><b>Comment:</b> kolom komentar di hampir semua entri — isi selalu, ini dokumentasi gratis.</li></ul><div class="callout blue"><div class="t">WinBox v3 vs v4</div><p style="margin:4px 0 0">Untuk RouterOS v7, gunakan <b>WinBox v4</b> (tampilan modern, 64-bit). WinBox v3 masih bisa dipakai tapi beberapa fitur v7 tidak tampil sempurna. Download dari mikrotik.com — gratis.</p></div>`,
      terms: [['WinBox', 'Aplikasi GUI desktop resmi MikroTik untuk konfigurasi visual via port 8291 atau MAC.'], ['Neighbors', 'Tab WinBox yang memindai (discovery) perangkat MikroTik satu segmen broadcast via MAC.'], ['MAC-connect', 'Koneksi Layer 2 via MAC address — pintu darurat saat IP router salah/hilang.']],
      diagram: `<pre>              WinBox: DUA JALAN MASUK

   Laptop (WinBox)
       |
       +-- via IP  ---- 192.168.99.10 :8291 --&gt; [RouterOS]
       |                 (butuh IP benar di kedua sisi)
       |
       +-- via MAC --- 4C:5E:0C:xx:xx:xx -----&gt; [RouterOS]
                         (Layer 2 — tanpa IP pun bisa,
                          selama satu broadcast domain)

   Toolbar: [+] add  [-] remove  [v] enable  [x] disable
            [Safe Mode] [Comment]  &lt;-- biasakan pakai ketiganya</pre>`,
      scenario: 'Teknisi datang ke site dengan router yang baru di-reset — tanpa IP. Ia colok kabel ke ether2, buka WinBox → Neighbors → klik MAC → Connect, lalu konfigurasi IP dari nol. Tanpa fitur ini ia harus menebak IP atau memakai console serial.',
      bestPractices: 'Isi kolom Comment di setiap rule/interface ("VLAN20-OFFICE", "allow-monitoring") — 6 bulan lagi kamu akan berterima kasih pada dirimu sendiri.',
      security: 'Di production, batasi akses WinBox (port 8291) hanya dari VLAN management (VLAN 99) — jangan biarkan terbuka dari WAN/internet. Caranya via firewall chain input (dibahas 13.14).',
      challenge: 'Konek ke CHR lab via WinBox dengan dua cara: via IP dan via MAC (tab Neighbors). Catat perbedaannya dan kapan masing-masing berguna.',
      interviewQ: 'Q: "Router tidak bisa diakses via IP setelah salah konfigurasi. Bagaimana cara masuk kembali tanpa reset?" — A: Pakai WinBox via MAC (tab Neighbors) — koneksi Layer 2 yang tidak butuh IP, selama masih satu segmen broadcast.',
      quiz: [
        { q: 'Keunggulan konek WinBox via MAC dibanding via IP adalah…', options: ['Lebih cepat transfer file', 'Bisa konek walau router belum punya IP / IP-nya salah', 'Tidak butuh kabel', 'Bisa dari internet'], answer: 1, explain: 'MAC-connect bekerja di Layer 2 tanpa butuh IP — pintu darurat saat konfigurasi IP rusak.' },
        { q: 'Port default protokol WinBox adalah…', options: ['80', '443', '8291', '22'], answer: 2, explain: 'WinBox memakai port TCP 8291 (protokol proprietary MikroTik).' },
        { q: 'Untuk RouterOS v7, versi WinBox yang disarankan adalah…', options: ['WinBox v2', 'WinBox v3', 'WinBox v4', 'Tidak butuh WinBox'], answer: 2, explain: 'WinBox v4 dirancang untuk v7; v3 masih jalan tapi beberapa fitur v7 tidak tampil sempurna.' }
      ]
    },
    {
      id: '13.5',
      title: 'WebFig',
      body: `<p><b>WebFig</b> adalah antarmuka web RouterOS — cukup buka <code>http://&lt;IP-router&gt;</code> di browser. Tidak perlu install aplikasi, jadi berguna saat kamu memakai komputer pinjaman atau HP. Fungsinya setara WinBox untuk hampir semua konfigurasi.</p><h3>WinBox vs WebFig vs CLI — Kapan Pakai Apa?</h3><div class="tblwrap"><table><tr><th>Tool</th><th>Kelebihan</th><th>Kekurangan</th><th>Cocok Untuk</th></tr><tr><td>WinBox</td><td>Cepat, ringan, bisa MAC-connect</td><td>Harus install aplikasi</td><td>Kerja harian engineer</td></tr><tr><td>WebFig</td><td>Tanpa install, jalan di browser/HP</td><td>Tidak bisa MAC-connect; butuh IP</td><td>Akses darurat dari perangkat lain</td></tr><tr><td>CLI (SSH)</td><td>Scriptable, cepat untuk bulk config, fondasi automation</td><td>Kurva belajar lebih curam</td><td>Automation, backup, troubleshooting cepat</td></tr></table></div><h3>Quick Set — Pedang Bermata Dua</h3><p>WebFig punya halaman <b>Quick Set</b>: wizard konfigurasi cepat (mode CPE, AP, dll). Untuk pemula ia membantu, tapi di production ia berbahaya karena menimpa konfigurasi dengan template — bisa menghapus setting yang sudah ada. Aturan lab ini: pahami konfigurasi manual dulu (CLI/WinBox), Quick Set hanya untuk eksperimen awal.</p><div class="callout"><div class="t">Akses WebFig Aman</div><p style="margin:4px 0 0">WebFig default memakai HTTP (port 80, teks polos). Untuk akses aman aktifkan HTTPS: <code>/ip service set www-ssl certificate=... disabled=no</code> lalu akses via <code>https://</code>. Di lab boleh HTTP; di production wajib HTTPS dan dibatasi dari VLAN management.</p></div>`,
      terms: [['WebFig', 'Antarmuka konfigurasi RouterOS berbasis web (browser), tanpa install aplikasi.'], ['Quick Set', 'Wizard konfigurasi cepat di WebFig — praktis tapi bisa menimpa konfigurasi existing.']],
      diagram: `<pre>        TIGA WAJAH RouterOS — SATU MENU TREE

   +----------+   +----------+   +-----------+
   |  WinBox  |   |  WebFig  |   | CLI (SSH) |
   | (aplikasi|   | (browser)|   | (terminal)|
   | port 8291|   | port 80/ |   | port 22   |
   | + MAC)   |   | 443)     |   |           |
   +----+-----+   +----+-----+   +-----+-----+
        |              |               |
        +------+-------+-------+-------+
               |
        +------+------+  (sama persis)
        |  MENU TREE  |
        | /ip /interface /system ...
        +-------------+

   Pilih berdasarkan situasi — hasilnya identik.</pre>`,
      scenario: 'Engineer sedang di luar kota, hanya bawa HP. Router kantor butuh diubah NAT-nya segera — ia buka WebFig dari browser HP via VPN, ubah rule, selesai dalam 5 menit tanpa laptop.',
      bestPractices: 'Kuasai CLI sebagai skill utama; WinBox/WebFig sebagai akselerator visual. Engineer yang hanya bisa GUI akan kesulitan saat automation (Part 32–38).',
      security: 'Jangan ekspos WebFig (port 80/443) ke internet tanpa proteksi — bot memindai port ini 24/7. Di production: batasi via firewall + pakai HTTPS + ganti port default bila perlu.',
      challenge: 'Akses CHR lab-mu via WebFig (http://IP-CHR). Bandingkan tampilan menu IP → Firewall di WebFig vs WinBox — catat 2 persamaan strukturnya.',
      interviewQ: 'Q: "Kapan kamu pilih WebFig dibanding WinBox?" — A: Saat tidak bisa install aplikasi (komputer pinjaman/HP) atau butuh akses cepat dari browser; tapi untuk kerja harian WinBox lebih cepat dan satu-satunya yang bisa MAC-connect.',
      quiz: [
        { q: 'Keterbatasan utama WebFig dibanding WinBox adalah…', options: ['Tidak bisa konfigurasi firewall', 'Tidak bisa konek via MAC dan butuh IP yang valid', 'Hanya jalan di Windows', 'Berbayar'], answer: 1, explain: 'WebFig butuh IP yang bisa dijangkau via browser — tidak ada MAC-connect seperti WinBox.' },
        { q: 'Mengapa Quick Set berbahaya di production?', options: ['Karena lambat', 'Karena menimpa konfigurasi existing dengan template', 'Karena butuh lisensi khusus', 'Karena hanya bahasa Inggris'], answer: 1, explain: 'Quick Set menerapkan template yang bisa menghapus/menimpa setting yang sudah berjalan.' },
        { q: 'Untuk akses WebFig yang aman di production, yang wajib adalah…', options: ['Ganti tema warna', 'Aktifkan HTTPS, batasi akses dari VLAN management', 'Matikan WebFig total', 'Pakai HTTP saja'], answer: 1, explain: 'HTTPS mengenkripsi sesi web; pembatasan sumber akses mencegah bot internet menyentuh halaman login.' }
      ]
    },
    {
      id: '13.6',
      title: 'Interface',
      body: `<p><b>Interface</b> di RouterOS adalah representasi setiap "pintu" tempat traffic masuk-keluar: port fisik (<code>ether1</code>, <code>ether2</code>), maupun virtual (bridge, VLAN, tunnel). Semua konfigurasi Layer 1–2 bermula di sini.</p><h3>Membaca Status Interface</h3><pre>[admin@R1] &gt; /interface print
Flags: D - dynamic, X - disabled, R - running, S - slave
 #    NAME      TYPE     MTU  ACTUAL-MTU
 0 R  ether1    ether   1500        1500
 1    ether2    ether   1500        1500
 2 X  ether3    ether   1500        1500
# R = running (kabel tercolok & link up). X = disabled manual.
# Tanpa R, interface mati di Layer 1 — cek kabel dulu sebelum curiga ke Layer 3.</pre><h3>Operasi Dasar + Alasannya</h3><pre>[admin@R1] &gt; /interface set ether2 name=LAN-OFFICE comment="VLAN20 ke switch"
# Alasan memberi nama: di router 8+ port, "ether5" tidak bercerita apa-apa.
# "LAN-OFFICE" langsung memberi tahu fungsi — mempercepat troubleshooting.

[admin@R1] &gt; /interface disable ether3
# Menonaktifkan port tak terpakai. Alasan: port nyala tanpa guna =
# permukaan serangan + risiko loop tak sengaja.</pre><h3>MTU — Ukuran Paket Maksimum</h3><p><b>MTU (Maximum Transmission Unit)</b> default 1500 byte — ukuran frame Ethernet standar (Part 03). Jangan ubah sembarangan: MTU yang tidak match di kedua sisi menyebabkan packet ter-fragmentasi atau drop diam-diam (gejala: website tertentu tidak bisa dibuka, tapi ping OK). Di lab, biarkan 1500 kecuali materi VPN (Part 31) memintanya.</p><div class="callout blue"><div class="t">Urutan Diagnosis Interface</div><p style="margin:4px 0 0">Traffic bermasalah? Cek berurutan: <b>1)</b> flag R muncul? (fisik) → <b>2)</b> <code>/interface ethernet monitor etherX</code> lihat rate & full-duplex → <b>3)</b> baru naik ke IP/route. 80% "jaringan lambat" ternyata masalah Layer 1–2.</p></div>`,
      terms: [['Interface', 'Representasi pintu traffic di RouterOS — fisik (ether) maupun virtual (bridge/VLAN/tunnel).'], ['Flag R/X', 'R = running (link up), X = disabled — dibaca dari /interface print.'], ['MTU', 'Ukuran maksimum frame/paket; mismatch menyebabkan fragmentasi atau drop diam-diam.']],
      diagram: `<pre>              INTERFACE = PINTU TRAFFIC

   [Internet]--ether1(WAN)   RouterOS   ether2(LAN-OFFICE)--[Switch]
                                 |
                    +------------+------------+
                    |  virtual: bridge, VLAN, |
                    |  tunnel — juga muncul   |
                    |  di /interface print   |
                    +------------------------+

   /interface print  -->  lihat SEMUA pintu + statusnya (R/X)</pre>`,
      scenario: 'NOC menerima laporan "internet lambat". Engineer cek /interface print: ether1 (WAN) flag R tapi rate turun ke 10 Mbps half-duplex — kabel atau port ISP bermasalah. Tanpa cek interface, ia bisa buang waktu mengutak-atik firewall.',
      bestPractices: 'Beri nama dan comment deskriptif di setiap interface yang dipakai; disable port yang tidak dipakai.',
      security: 'Port fisik yang aktif tapi tak terpakai adalah pintu masuk gratis — disable, atau pasang di VLAN isolasi.',
      challenge: 'Di CHR lab: rename ether2 menjadi LAB-LAN, beri comment, lalu disable dan enable kembali sambil perhatikan perubahan flag di /interface print.',
      interviewQ: 'Q: "User lapor lambat, ping ke gateway kadang RTO. Langkah pertamamu?" — A: Cek /interface print — pastikan flag R, lalu monitor rate/duplex dan error counter; pastikan masalah bukan di Layer 1 sebelum naik ke Layer 3.',
      quiz: [
        { q: 'Flag "R" pada /interface print berarti…', options: ['Router mode', 'Running — link up dan aktif', 'Read-only', 'Remote'], answer: 1, explain: 'R = running: interface aktif dan link fisik up. Tanpa R, masalah ada di Layer 1.' },
        { q: 'Mengapa interface yang tidak dipakai sebaiknya di-disable?', options: ['Menghemat listrik besar', 'Mengurangi permukaan serangan dan risiko loop tak sengaja', 'Agar WinBox lebih cepat', 'Wajib oleh lisensi'], answer: 1, explain: 'Port aktif tanpa guna bisa dimanfaatkan penyusup atau menyebabkan loop jika tercolok sembarang.' },
        { q: 'Gejala klasik MTU mismatch adalah…', options: ['Semua ping gagal', 'Ping OK tapi aplikasi/website tertentu gagal dimuat', 'Router tidak bisa boot', 'WinBox tidak bisa konek'], answer: 1, explain: 'Paket kecil (ping) lolos, paket besar ter-fragmentasi/drop — aplikasi tertentu gagal sementara ping terlihat normal.' }
      ]
    },
    {
      id: '13.7',
      title: 'Bridge',
      body: `<p><b>Bridge</b> di RouterOS adalah "switch virtual di dalam router": menggabungkan beberapa interface menjadi satu broadcast domain (satu segmen Layer 2). Paket yang masuk ether2 bisa keluar ether3 tanpa lewat routing — persis cara kerja switch (Part 08).</p><h3>Kapan Butuh Bridge?</h3><ul><li>Menggabungkan beberapa port LAN menjadi satu jaringan (router kecil sebagai switch).</li><li>Menjadi "induk" untuk VLAN dan interface virtual lain.</li><li>Di CHR lab: menggabungkan interface agar topologi GNS3 fleksibel.</li></ul><h3>Konfigurasi Dasar</h3><pre>[admin@R1] &gt; /interface bridge add name=bridge-LAN comment="LAN bridge"
# Alasan: bridge adalah wadah; anggotanya ditambahkan terpisah.

[admin@R1] &gt; /interface bridge port add bridge=bridge-LAN interface=ether2
[admin@R1] &gt; /interface bridge port add bridge=bridge-LAN interface=ether3
# Alasan: "port" = keanggotaan. ether2 & ether3 kini satu broadcast domain,
# seperti dua port di switch yang sama.

[admin@R1] &gt; /interface bridge print
Flags: X - disabled, R - running
 0 R name="bridge-LAN" mtu=auto actual-mtu=1500</pre><h3>STP/RSTP — Pengaman Loop</h3><p><b>STP (Spanning Tree Protocol)</b> mencegah <b>broadcast storm</b> saat ada loop kabel (Part 09). Di bridge RouterOS, RSTP aktif default (<code>protocol-mode=rstp</code>) — biarkan aktif kecuali kamu paham betul risikonya. Mematikan STP di jaringan ber-loop = jaringan lumpuh dalam detik.</p><div class="callout"><div class="t">Bridge vs Switch Hardware</div><p style="margin:4px 0 0">Bridge RouterOS berjalan di <b>software (CPU)</b>, bukan chip switching — throughput-nya terbatas CPU. Untuk lab dan kantor kecil cukup; untuk switching berat pakai switch hardware / fitur hardware-offload (hanya di RouterBOARD tertentu, bukan CHR).</p></div>`,
      terms: [['Bridge', 'Switch virtual di RouterOS — menggabungkan interface dalam satu broadcast domain Layer 2.'], ['Bridge port', 'Keanggotaan interface di dalam bridge.'], ['Broadcast storm', 'Ledakan broadcast akibat loop Layer 2 yang melumpuhkan jaringan — dicegah STP/RSTP.'], ['Hardware offload', 'Pendelegasian switching ke chip hardware agar tidak membebani CPU (tidak ada di CHR).']],
      diagram: `<pre>              BRIDGE = SWITCH VIRTUAL

   Tanpa bridge:            Dengan bridge-LAN:
   ether2 --\
             +-- terpisah   ether2 --\
   ether3 --/   (butuh       ether3 --/--> [bridge-LAN]
               routing)              satu broadcast domain,
                                     seperti 2 port switch

   [PC-A]--ether2  [bridge-LAN]  ether3--[PC-B]
            PC-A ping PC-B: Layer 2 langsung, tanpa routing.</pre>`,
      scenario: 'Warnet kecil punya router 5 port: 1 WAN + 4 LAN. Keempat port LAN di-bridge jadi satu jaringan 192.168.20.0/24 — tanpa beli switch tambahan. Inilah pola "router rasa switch" yang umum di usaha kecil.',
      bestPractices: 'Satu bridge per segmen LAN; jangan campur interface WAN ke bridge LAN. Biarkan RSTP aktif.',
      security: 'Jangan bridge-kan interface WAN dengan LAN — itu menembus firewall (traffic lewat Layer 2 tanpa filter Layer 3).',
      challenge: 'Buat bridge-LAN berisi ether2+ether3 di CHR, lalu uji: apakah dua "PC" (VPCS di GNS3, Part 16) di kedua port bisa saling ping tanpa konfigurasi IP di router?',
      interviewQ: 'Q: "Apa beda bridge dan routing?" — A: Bridge meneruskan frame di Layer 2 dalam satu broadcast domain (berdasar MAC); routing meneruskan packet di Layer 3 antar subnet berbeda (berdasar IP).',
      quiz: [
        { q: 'Fungsi utama bridge di RouterOS adalah…', options: ['Menghubungkan ke internet', 'Menggabungkan interface dalam satu broadcast domain Layer 2', 'Mengenkripsi traffic', 'Membagi bandwidth'], answer: 1, explain: 'Bridge = switch virtual: anggotanya satu segmen Layer 2, traffic antar anggota tanpa routing.' },
        { q: 'Mengapa RSTP sebaiknya tetap aktif di bridge?', options: ['Agar lebih cepat', 'Mencegah broadcast storm saat terjadi loop kabel', 'Wajib untuk DHCP', 'Agar hemat CPU'], answer: 1, explain: 'RSTP mendeteksi dan memutus loop Layer 2 — tanpa itu, satu kabel salah colok bisa melumpuhkan jaringan.' },
        { q: 'Keterbatasan bridge di CHR dibanding switch hardware adalah…', options: ['Tidak mendukung VLAN', 'Berjalan di software/CPU sehingga throughput terbatas', 'Tidak bisa di-monitor', 'Hanya untuk 2 port'], answer: 1, explain: 'Bridge RouterOS (tanpa hardware offload, apalagi di VM) memproses di CPU — cukup untuk lab, bukan untuk switching berat.' }
      ]
    },
    {
      id: '13.8',
      title: 'IP Address',
      body: `<p>Memberi <b>IP address</b> ke interface adalah cara router "punya alamat" di sebuah subnet — sekaligus menjadi <b>gateway</b> bagi device di subnet itu (Part 05, 11). Tanpa IP di interface, router tidak bisa routing dari/ke subnet tersebut.</p><h3>Format Penulisan</h3><pre>[admin@R1] &gt; /ip address add address=192.168.20.1/24 interface=ether2 comment="GW VLAN20 OFFICE"
# Alasan tiap bagian:
# - 192.168.20.1 : alamat router di subnet ini (.1 = konvensi gateway, konsisten Part 01)
# - /24          : subnet mask — mendefinisikan 192.168.20.0/24 (254 host)
# - interface    : "pintu" tempat subnet ini hidup
# - comment      : dokumentasi — wajib diisi

[admin@R1] &gt; /ip address print
Flags: X - disabled, I - invalid, D - dynamic
 #   ADDRESS            NETWORK         INTERFACE
 0   192.168.20.1/24    192.168.20.0    ether2
# NETWORK terisi otomatis dari address/mask — kalau NETWORK-nya aneh,
# berarti salah ketik mask (mis. /16 bukan /24).</pre><h3>Aturan Emas (dari Part 01)</h3><p><b>1 VLAN = 1 subnet = 1 broadcast domain.</b> Jangan pasang dua subnet berbeda di satu interface tanpa VLAN (13.17) — itu menciptakan "subnet ganda" yang membingungkan ARP dan DHCP. Desain lab kita:</p><div class="tblwrap"><table><tr><th>VLAN</th><th>Subnet</th><th>Gateway (di router)</th></tr><tr><td>10 CCTV</td><td>192.168.10.0/24</td><td>192.168.10.1</td></tr><tr><td>20 OFFICE</td><td>192.168.20.0/24</td><td>192.168.20.1</td></tr><tr><td>30 SERVER</td><td>192.168.30.0/24</td><td>192.168.30.1</td></tr><tr><td>40 GUEST</td><td>192.168.40.0/24</td><td>192.168.40.1</td></tr><tr><td>99 MGMT</td><td>192.168.99.0/24</td><td>192.168.99.1</td></tr></table></div><div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0">Menghapus/mengubah IP pada interface yang sedang kamu pakai untuk konek (mis. <code>/ip address remove</code> di interface management) = aksesmu putus seketika. Selalu pakai <b>Safe Mode</b>.</p></div>`,
      terms: [['Gateway', 'IP router di suatu subnet (.1 sesuai konvensi lab) — pintu keluar device menuju subnet lain.'], ['NETWORK (kolom)', 'Alamat jaringan hasil kalkulasi address/mask — indikator salah ketik mask.']],
      diagram: `<pre>         IP ADDRESS = ALAMAT + PINTU

   /ip address add address=192.168.20.1/24 interface=ether2

   [PC 192.168.20.10] --- ether2 -- [R1: 192.168.20.1]
         gateway: 192.168.20.1 -----------^
         Packet PC --&gt; Internet: "antar ke gateway-ku"
         R1 menerima di ether2 karena IP-nya "menempel" di sana.</pre>`,
      scenario: 'Teknisi mengganti gateway kantor tapi salah ketik mask /16 bukan /24. Kolom NETWORK tampil 192.168.0.0 — separuh jaringan "terlihat lokal" oleh router dan routing kacau. Ia sadar hanya karena membaca kolom NETWORK di print.',
      bestPractices: 'Gunakan .1 untuk gateway di setiap subnet secara konsisten; selalu baca kolom NETWORK setelah add untuk verifikasi mask.',
      security: 'IP management (VLAN 99) jangan disebar ke user; pisahkan subnet management dari subnet user sejak desain.',
      challenge: 'Pasang IP 192.168.20.1/24 di ether2 CHR-mu, lalu dari "PC" lab lakukan ping ke gateway. Catat output /ip address print.',
      interviewQ: 'Q: "Apa yang terjadi jika dua subnet berbeda dipasang di satu interface tanpa VLAN?" — A: Terjadi subnet ganda dalam satu broadcast domain — ARP/DHCP bingung, isolasi rusak; yang benar: satu subnet per interface/VLAN (1 VLAN = 1 subnet).',
      quiz: [
        { q: 'Setelah /ip address add 192.168.20.1/24, kolom NETWORK otomatis terisi…', options: ['192.168.20.1', '192.168.20.0', '192.168.0.0', '255.255.255.0'], answer: 1, explain: 'RouterOS menghitung network address dari IP/mask: 192.168.20.1/24 → network 192.168.20.0.' },
        { q: 'Jika kolom NETWORK tampil 192.168.0.0 padahal maksudmu /24, kemungkinan penyebabnya…', options: ['Interface rusak', 'Salah ketik mask (mis. /16)', 'DHCP belum jalan', 'Kabel putus'], answer: 1, explain: 'NETWORK 192.168.0.0 menandakan mask /16 — verifikasi mask lewat kolom ini.' },
        { q: 'Mengapa menghapus IP interface management berbahaya?', options: ['Router akan reset', 'Akses konfigurasimu sendiri putus seketika', 'Lisensi hangus', 'Tidak berbahaya'], answer: 1, explain: 'IP itu adalah alamat yang kamu pakai untuk konek — menghapusnya memutus sesimu. Pakai safe mode.' }
      ]
    },
    {
      id: '13.9',
      title: 'Routes',
      body: `<p><b>Route</b> adalah "papan petunjuk" router: untuk mencapai network tujuan X, lewat gateway Y. Tanpa route yang tepat, packet dibuang — router tidak bisa menebak jalan (Part 11–12).</p><h3>Dua Jenis Route</h3><ul><li><b>Connected (C):</b> otomatis muncul saat interface punya IP — router "tahu" subnet yang langsung menempel. Tidak perlu dikonfigurasi.</li><li><b>Static:</b> kamu tulis manual — untuk network yang jauh / via router lain.</li></ul><h3>Static Route + Alasannya</h3><pre>[admin@R1] &gt; /ip route add dst-address=192.168.30.0/24 gateway=192.168.20.254 comment="ke SERVER via R2"
# Alasan tiap parameter:
# - dst-address : network TUJUAN yang ingin dijangkau (bukan alamat sendiri!)
# - gateway     : "tangan pertama" yang tahu jalan ke sana — HARUS satu subnet
#                 dengan salah satu IP router ini (jika tidak, route invalid)
# - comment     : dokumentasi tujuan route

[admin@R1] &gt; /ip route print
Flags: X - disabled, A - active, D - dynamic, C - connect, S - static
 #      DST-ADDRESS        GATEWAY         DISTANCE
 0 ADS  0.0.0.0/0          203.0.113.1            1
 1 ADC  192.168.20.0/24    ether2                0
 2 A S  192.168.30.0/24    192.168.20.254        1
# A = active (dipakai). S = static. C = connected.
# Route tanpa flag A = tidak dipakai — selidiki (gateway unreachable?).</pre><h3>Default Route</h3><p><code>0.0.0.0/0</code> artinya "semua tujuan yang tidak dikenal" — pintu ke internet. <b>Distance</b> = "biaya": makin kecil makin diprioritaskan. Dua default route? Yang distance terkecil menang.</p><div class="callout blue"><div class="t">Packet Flow Routing</div><p style="margin:4px 0 0">Packet masuk → router cek tabel route dari prefix terpanjang (longest match) → teruskan ke gateway/interface → ulangi di tiap hop. Ingat: <b>routing harus dua arah</b> — R1 tahu jalan ke R2 saja tidak cukup; R2 juga harus tahu jalan pulang (atau ping "pergi" tapi reply "nyasar").</p></div>`,
      terms: [['Route', 'Entri papan petunjuk: network tujuan → gateway/interface keluar.'], ['Connected route', 'Route otomatis untuk subnet yang langsung menempel di interface.'], ['Static route', 'Route yang ditulis manual untuk network jarak jauh.'], ['Distance', 'Biaya route — nilai terkecil diprioritaskan saat ada beberapa route ke tujuan sama.'], ['Default route', '0.0.0.0/0 — "jalur untuk semua tujuan tak dikenal", biasanya ke internet.']],
      diagram: `<pre>              MEMBACA TABEL ROUTE

   [PC 192.168.20.10] --&gt; ping 192.168.30.10

   R1 cek tabel:
   1. 192.168.30.0/24 via 192.168.20.254? ADA (S) --&gt; kirim ke R2
   2. R2 cek tabel: 192.168.30.0/24 ADC (langsung) --&gt; antar ke server
   3. Reply: R2 --&gt; route pulang ke 192.168.20.0/24 --&gt; R1 --&gt; PC

   Tanpa route PULANG di R2: request sampai, reply hilang.
   Ingat: routing = jalan PERGI + jalan PULANG.</pre>`,
      scenario: 'Kantor cabang bisa ping server pusat tapi tidak bisa buka aplikasi. Ternyata route di pusat hanya satu arah — reply packet tidak tahu jalan pulang dan dibuang. Menambah satu static route pulang menyelesaikan "misteri" 2 jam itu.',
      bestPractices: 'Selalu verifikasi route aktif (flag A) setelah menambah; dokumentasikan setiap static route dengan comment yang jelas.',
      security: 'Static route yang salah bisa membelokkan traffic sensitif ke gateway asing — review tabel route berkala, terutama setelah change.',
      challenge: 'Di lab 2-CHR (Part 16): buat static route di R1 ke subnet di balik R2, lalu uji ping. Sengaja hapus route pulang di R2 dan amati gejalanya.',
      interviewQ: 'Q: "Ping ke server jauh gagal padahal route pergi ada. Apa yang kamu cek?" — A: Route pulang — routing harus dua arah. Cek /ip route print di router tujuan, pastikan ada route kembali ke subnet sumber.',
      quiz: [
        { q: 'Flag "A" pada /ip route print berarti…', options: ['Automatic', 'Active — route sedang dipakai', 'Admin only', 'Alternate'], answer: 1, explain: 'A = active. Route tanpa A tidak dipakai — biasanya gateway unreachable.' },
        { q: 'Gateway pada static route harus…', options: ['IP publik apa saja', 'Satu subnet dengan salah satu IP router (reachable langsung)', 'Hostname', 'IP tujuan akhir'], answer: 1, explain: 'Gateway adalah next-hop yang harus terjangkau langsung (satu subnet); kalau tidak, route menjadi invalid.' },
        { q: 'Fungsi default route 0.0.0.0/0 adalah…', options: ['Memblokir semua traffic', 'Jalur untuk semua tujuan yang tidak ada di tabel — biasanya ke internet', 'Route tercepat', 'Cadangan DHCP'], answer: 1, explain: '0.0.0.0/0 cocok dengan semua alamat — "jalan terakhir" bila tidak ada route spesifik.' }
      ]
    },
    {
      id: '13.10',
      title: 'ARP',
      body: `<p><b>ARP (Address Resolution Protocol)</b> adalah "buku telepon" Layer 2→3: mengubah IP menjadi MAC address (Part 03). Sebelum mengirim packet ke tetangga satu subnet, device bertanya via broadcast: "Siapa yang punya 192.168.20.1? Kirim MAC-mu."</p><h3>Melihat Tabel ARP</h3><pre>[admin@R1] &gt; /ip arp print
Flags: X - disabled, I - invalid, H - DHCP, D - dynamic, C - complete
 #   ADDRESS          MAC-ADDRESS        INTERFACE
 0 D 192.168.20.10   4C:5E:0C:AA:BB:01  ether2
 1 D 192.168.20.1    4C:5E:0C:AA:BB:02  ether2
# D = dynamic (hasil belajar otomatis). C = complete (MAC terkonfirmasi).</pre><h3>Static ARP & ARP Mode — Senjata Keamanan</h3><pre>[admin@R1] &gt; /ip arp add address=192.168.30.10 mac-address=AA:BB:CC:DD:EE:01 interface=ether3 comment="server-utama"
# Alasan: mengunci IP server ke MAC aslinya — mencegah ARP spoofing
# (penyerang mengaku-aku jadi server).

[admin@R1] &gt; /interface ethernet set ether2 arp=reply-only
# Mode reply-only: router HANYA menjawab ARP untuk entri yang sudah ada
# di tabel (static/DHCP). Device asing tanpa entri = tidak bisa komunikasi.
# Alasan: port yang tidak dikenal tidak bisa "nebeng" bicara ke router.</pre><div class="tblwrap"><table><tr><th>Mode ARP</th><th>Perilaku</th><th>Kapan</th></tr><tr><td>enabled</td><td>Belajar ARP otomatis normal</td><td>Default, umum</td></tr><tr><td>reply-only</td><td>Hanya layani entri existing</td><td>Port publik/rapat — cegah device liar</td></tr><tr><td>proxy-arp</td><td>Router menjawab ARP atas nama network lain</td><td>Kasus khusus (hindari bila tak paham risikonya)</td></tr></table></div><div class="callout"><div class="t">Troubleshooting dengan ARP</div><p style="margin:4px 0 0">Ping gateway gagal padahal kabel OK? Cek <code>/ip arp print</code>: jika entri gateway <b>incomplete</b> (tanpa MAC), masalahnya di Layer 2 — device tidak menjawab ARP (mati, VLAN salah, atau firewall memblokir broadcast).</p></div>`,
      terms: [['ARP', 'Protokol penerjemah IP → MAC di satu broadcast domain.'], ['ARP spoofing', 'Serangan dengan memalsukan jawaban ARP agar traffic dibelokkan ke penyerang.'], ['reply-only', 'Mode ARP ketat: hanya berkomunikasi dengan IP yang sudah terdaftar di tabel.'], ['proxy-arp', 'Router menjawab request ARP atas nama host di network lain — berguna tapi berisiko.']],
      diagram: `<pre>              CARA KERJA ARP

   PC (192.168.20.10) ingin kirim ke gateway 192.168.20.1
   tapi belum tahu MAC-nya:

   1. PC --broadcast--> "Siapa 192.168.20.1? Saya 192.168.20.10"
      (ff:ff:ff:ff:ff:ff — semua dengar)
   2. R1 --unicast--> "Saya 192.168.20.1, MAC-ku 4C:5E:0C:..:02"
   3. PC simpan di tabel ARP, lalu kirim frame ke MAC itu.

   /ip arp print = isi "buku telepon" yang sudah dipelajari.</pre>`,
      scenario: 'Di kos-kosan, seorang penghuni menjalankan ARP spoofing dan menyadap traffic tetangga. Solusi admin: static ARP untuk gateway + mode reply-only di interface — penyerang tidak bisa lagi mengaku sebagai gateway.',
      bestPractices: 'Untuk server penting, buat static ARP; pertimbangkan reply-only di segmen yang rawan device liar.',
      security: 'ARP tidak punya autentikasi — siapa pun bisa menjawab. Di jaringan tak tepercaya, static ARP dan DHCP snooping (switch) adalah pertahanan lapisannya.',
      challenge: 'Jalankan /ip arp print di CHR, cocokkan satu entri dengan MAC di sisi "PC" lab-mu. Lalu buat satu static ARP untuk IP server lab.',
      interviewQ: 'Q: "Apa itu ARP spoofing dan bagaimana mencegahnya di MikroTik?" — A: Pemalsuan jawaban ARP untuk membelokkan traffic; cegah dengan static ARP untuk host penting dan mode arp=reply-only di interface rawan.',
      quiz: [
        { q: 'Fungsi ARP adalah…', options: ['Menerjemahkan hostname ke IP', 'Menerjemahkan IP ke MAC address dalam satu broadcast domain', 'Mengenkripsi packet', 'Membagi bandwidth'], answer: 1, explain: 'ARP menjawab pertanyaan "MAC apa untuk IP ini?" agar frame Layer 2 bisa dibangun.' },
        { q: 'Mode arp=reply-only berguna untuk…', options: ['Mempercepat routing', 'Mencegah device tak terdaftar berkomunikasi lewat interface itu', 'Mengaktifkan DHCP', 'Menambah bandwidth'], answer: 1, explain: 'reply-only hanya melayani ARP untuk entri existing — device asing tidak bisa bicara ke router.' },
        { q: 'Entri ARP berstatus incomplete saat ping gateway menandakan…', options: ['Gateway sibuk', 'Masalah Layer 2 — gateway tidak menjawab ARP (mati/VLAN salah/broadcast diblokir)', 'DNS rusak', 'Kabel pasti putus'], answer: 1, explain: 'Incomplete = request ARP tak terjawab; selidiki di Layer 2 sebelum menyalahkan Layer 3.' }
      ]
    },
    {
      id: '13.11',
      title: 'DHCP',
      body: `<p><b>DHCP (Dynamic Host Configuration Protocol)</b> adalah "resepsionis" jaringan: otomatis memberi IP, gateway, dan DNS ke device yang baru terhubung. Tanpa DHCP, tiap PC/laptop/HP harus di-setting manual — mimpi buruk di jaringan 200+ device.</p><h3>Tiga Komponen Server DHCP</h3><pre>[admin@R1] &gt; /ip pool add name=pool-office ranges=192.168.20.100-192.168.20.200
# Alasan: pool = "stok nomor kamar". Batasi range agar IP server/printer
# static (.1-.99) tidak tertabrak DHCP.

[admin@R1] &gt; /ip dhcp-server network add address=192.168.20.0/24 gateway=192.168.20.1 dns-server=192.168.20.1 comment="net-office"
# Alasan: network = "brosur info" yang diterima client: netmask, gateway,
# DNS. Tanpa gateway di sini, client dapat IP tapi tidak bisa ke internet!

[admin@R1] &gt; /ip dhcp-server add name=dhcp-office interface=ether2 address-pool=pool-office disabled=no
# Alasan: server = mengikat pool+network ke INTERFACE. DHCP bekerja via
# broadcast Layer 2 — jadi interface-nya harus benar (satu broadcast domain
# dengan client). Salah interface = client tidak pernah dapat IP.</pre><h3>DHCP Client (Sisi WAN)</h3><pre>[admin@R1] &gt; /ip dhcp-client add interface=ether1 disabled=no comment="dari ISP"
# Alasan: ke arah ISP, router kita bertindak sebagai CLIENT — menerima IP
# dinamis dari ISP, seperti laptop menerima IP dari router.</pre><h3>Lease — Daftar Tamu</h3><p><code>/ip dhcp-server lease print</code> menampilkan siapa dapat IP apa. Dari sini kamu bisa <b>make-static</b>: mengunci MAC tertentu ke IP tetap (untuk printer/CCTV) — gabungan fleksibilitas DHCP dan kepastian IP static.</p><div class="callout blue"><div class="t">Packet Flow DHCP (DORA)</div><p style="margin:4px 0 0"><b>Discover</b> (broadcast: "ada DHCP server?") → <b>Offer</b> ("pakai IP ini") → <b>Request</b> ("OK saya ambil") → <b>ACK</b> ("deal"). Semua via broadcast Layer 2 — itulah mengapa DHCP server harus satu broadcast domain dengan client, atau pakai DHCP relay.</p></div>`,
      terms: [['DHCP server', 'Layanan yang membagikan IP otomatis ke client.'], ['Pool', 'Rentang IP yang boleh dibagikan DHCP.'], ['Lease', 'Catatan sewa IP: MAC mana memegang IP apa, sampai kapan.'], ['DORA', 'Urutan DHCP: Discover-Offer-Request-ACK.'], ['DHCP client', 'Mode router sebagai penerima IP (biasanya di sisi ISP/WAN).']],
      diagram: `<pre>              DHCP: RESEPSIONIS JARINGAN

   [Laptop baru] --broadcast--> DISCOVER "ada yang bagi IP?"
        |
   [R1 dhcp-office di ether2] --&gt; OFFER "pakai 192.168.20.100 ya"
        |
   [Laptop] --&gt; REQUEST "OK, saya ambil .100"
        |
   [R1] --&gt; ACK + info: gateway 192.168.20.1, DNS 192.168.20.1
        |
   /ip dhcp-server lease print:
   # ADDRESS         MAC-ADDRESS        HOST-NAME
   0 192.168.20.100 4C:5E:0C:..:10     laptop-budi   (D = dynamic)</pre>`,
      scenario: 'Kantor 150 user tanpa DHCP: tiap laptop baru butuh setting manual 5 menit = 12,5 jam kerja admin. Dengan DHCP + lease static untuk printer, onboarding user baru nol konfigurasi.',
      bestPractices: 'Sisakan range IP static di luar pool DHCP (.1–.99 untuk infra); gunakan make-static untuk device yang butuh IP tetap.',
      security: 'Rogue DHCP server (server DHCP liar) bisa membelokkan gateway client ke penyerang. Di jaringan penting, aktifkan DHCP snooping di switch (Part 10) dan alerting lease baru.',
      challenge: 'Buat DHCP server di ether2 CHR dengan pool .100–.200, lalu koneksikan satu "PC" lab dan verifikasi ia dapat IP + gateway + DNS yang benar.',
      interviewQ: 'Q: "Client tidak dapat IP dari DHCP. Apa yang kamu cek?" — A: Pastikan DHCP server terikat ke interface yang benar (satu broadcast domain), pool tidak habis, tidak ada firewall yang memblokir UDP 67/68, dan tidak ada rogue DHCP server.',
      quiz: [
        { q: 'Urutan proses DHCP yang benar adalah…', options: ['Request-Discover-Offer-ACK', 'Discover-Offer-Request-ACK (DORA)', 'Offer-Discover-ACK-Request', 'ACK-Request-Offer-Discover'], answer: 1, explain: 'DORA: client Discover (broadcast), server Offer, client Request, server ACK.' },
        { q: 'Mengapa DHCP server harus satu broadcast domain dengan client?', options: ['Karena butuh kabel pendek', 'Karena Discover dikirim via broadcast Layer 2 yang tidak lewat router', 'Karena DHCP butuh internet', 'Tidak harus, bebas'], answer: 1, explain: 'Discover adalah broadcast — tidak diteruskan router. Beda subnet butuh DHCP relay.' },
        { q: 'Fungsi make-static pada lease DHCP adalah…', options: ['Mematikan DHCP', 'Mengunci MAC tertentu agar selalu dapat IP yang sama', 'Menghapus lease', 'Mempercepat koneksi'], answer: 1, explain: 'make-static mengubah lease dinamis menjadi tetap per MAC — ideal untuk printer/CCTV.' }
      ]
    },
    {
      id: '13.12',
      title: 'DNS',
      body: `<p><b>DNS (Domain Name System)</b> adalah "buku telepon internet": mengubah nama (<code>google.com</code>) menjadi IP. RouterOS bisa menjadi <b>DNS forwarder/cache</b> untuk client LAN — mempercepat dan memberi kontrol.</p><h3>Konfigurasi DNS di RouterOS</h3><pre>[admin@R1] &gt; /ip dns set servers=8.8.8.8,1.1.1.1 allow-remote-requests=yes comment="forward ke publik"
# Alasan tiap parameter:
# - servers : DNS "atasan" tempat router bertanya bila tidak tahu jawaban
#             (8.8.8.8 Google, 1.1.1.1 Cloudflare — pilih yang latensinya kecil)
# - allow-remote-requests=yes : IZINKAN client LAN bertanya ke router.
#             Tanpa ini, router hanya pakai DNS untuk dirinya sendiri.

[admin@R1] &gt; /ip dns static add name=server-lokal.lan address=192.168.30.10 comment="server internal"
# Alasan: entri manual — nama lokal untuk server internal tanpa butuh
# DNS server sungguhan. Pola umum: printer.lan, cctv.lan, nas.lan.</pre><h3>Cache — Mengapa Lebih Cepat?</h3><p>Router menyimpan jawaban DNS yang pernah ditanyakan (<code>/ip dns cache print</code>). Client kedua yang bertanya nama sama dijawab langsung dari memori — tanpa ke internet. Di jaringan 100+ user, ini memangkas latency dan traffic DNS keluar signifikan.</p><div class="callout"><div class="t">Bahaya allow-remote-requests</div><p style="margin:4px 0 0">Jika <code>allow-remote-requests=yes</code> DAN router bisa diakses dari internet (tanpa firewall), router-mu jadi <b>open DNS resolver</b> — disalahgunakan untuk serangan <b>DNS amplification</b>. Aturan: firewall chain input hanya boleh mengizinkan DNS dari LAN/management, JANGAN dari WAN.</p></div>`,
      terms: [['DNS forwarder', 'Router meneruskan query DNS client ke server DNS atasan.'], ['DNS cache', 'Penyimpanan jawaban DNS sementara agar query berulang dijawab lokal.'], ['Static DNS', 'Entri nama→IP manual di router untuk host internal.'], ['Open resolver', 'DNS server yang menjawab query dari siapa pun di internet — disalahgunakan untuk serangan.']],
      diagram: `<pre>              ALUR DNS VIA ROUTER

   [PC] --"berapa IP google.com?"--> [R1: /ip dns]
                                            |
                       +--------------------+--------------------+
                       |                                         |
                 cache ada?                                cache kosong
                 jawab langsung                       tanya ke 8.8.8.8
                 (cepat, tanpa internet)              simpan ke cache,
                                                      jawab ke PC

   /ip dns static: "server-lokal.lan = 192.168.30.10"
   (dijawab langsung, tanpa ke internet sama sekali)</pre>`,
      scenario: 'Kantor mengeluh browsing "kadang lambat". Ternyata DNS client mengarah ke server ISP yang lambat. Engineer arahkan DHCP agar DNS = IP router (dengan cache), dan keluhan hilang — cache memangkas ratusan milidetik per query.',
      bestPractices: 'Arahkan client ke IP router sebagai DNS via DHCP; isi static DNS untuk semua server/printer internal.',
      security: 'Jangan pernah biarkan DNS (UDP 53) terbuka dari WAN tanpa filter — tutup via firewall input, izinkan hanya dari LAN/VLAN management.',
      challenge: 'Aktifkan DNS forwarder di CHR, tambahkan static entry untuk server lab-mu, lalu uji dengan nslookup dari PC lab.',
      interviewQ: 'Q: "Apa risiko allow-remote-requests=yes tanpa firewall yang benar?" — A: Router menjadi open DNS resolver yang bisa dipakai penyerang untuk DNS amplification attack — wajib filter chain input agar DNS hanya dari LAN.',
      quiz: [
        { q: 'Fungsi allow-remote-requests=yes adalah…', options: ['Mengizinkan remote desktop', 'Mengizinkan client LAN memakai router sebagai DNS forwarder', 'Membuka akses internet', 'Mengaktifkan VPN'], answer: 1, explain: 'Tanpa ini router hanya memakai DNS untuk dirinya sendiri; client LAN tidak bisa bertanya DNS ke router.' },
        { q: 'Keuntungan DNS cache di router adalah…', options: ['Menggantikan firewall', 'Query berulang dijawab dari memori — lebih cepat dan hemat traffic internet', 'Menambah bandwidth', 'Menghilangkan butuh ISP'], answer: 1, explain: 'Jawaban yang pernah ditanyakan disimpan; client berikutnya langsung dijawab tanpa query ke internet.' },
        { q: 'Risiko open DNS resolver adalah…', options: ['Disalahgunakan untuk serangan DNS amplification', 'Membuat internet lebih cepat', 'Tidak ada risiko', 'Hanya boros listrik'], answer: 0, explain: 'Resolver terbuka dipakai penyerang untuk memantulkan/memperbesar traffic serangan ke korban.' }
      ]
    },
    {
      id: '13.13',
      title: 'NAT',
      body: `<p><b>NAT (Network Address Translation)</b> adalah "tukang stempel" di perbatasan: mengubah alamat IP packet yang lewat. Dua kegunaan utama: <b>masquerade</b> (banyak IP privat → satu IP publik, agar LAN bisa internet) dan <b>dst-nat/port forwarding</b> (tamu dari internet → server di dalam).</p><h3>Konsep Chain di NAT</h3><p>RouterOS memproses NAT dalam <b>chain</b> (rantai): <code>srcnat</code> (saat packet KELUAR, ubah alamat sumber) dan <code>dstnat</code> (saat packet MASUK, ubah alamat tujuan). Urutan rule dalam chain penting — dibaca dari atas ke bawah, yang cocok pertama menang.</p><h3>Masquerade — LAN ke Internet</h3><pre>[admin@R1] &gt; /ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade comment="LAN-&gt;Internet"
# Alasan tiap bagian:
# - chain=srcnat      : kita mengubah alamat SUMBER (IP privat → IP publik)
# - out-interface=ether1 : hanya untuk packet yang KELUAR via WAN.
#             Tanpa ini, traffic antar-VLAN ikut ter-NAT (rusak!).
# - action=masquerade : "pakai IP interface keluar saat ini" — otomatis
#             mengikuti IP WAN yang dinamis dari ISP. Inilah bedanya dengan
#             src-nat biasa (yang butuh IP tetap ditulis manual).</pre><h3>Port Forwarding — Internet ke Server</h3><pre>[admin@R1] &gt; /ip firewall nat add chain=dstnat dst-port=80 protocol=tcp in-interface=ether1 action=dst-nat to-addresses=192.168.30.10 to-ports=80 comment="web server"
# Alasan: tamu dari internet menuju IP publik port 80 "dibelokkan" ke
# server internal 192.168.30.10. in-interface=ether1 memastikan hanya
# traffic DARI internet yang dibelokkan — bukan traffic LAN.</pre><div class="callout blue"><div class="t">Packet Flow NAT</div><p style="margin:4px 0 0">Keluar: PC (192.168.20.10) → dstnat? (tidak) → routing → <b>srcnat/masquerade</b> (IP jadi IP publik) → internet. Masuk: internet → <b>dstnat</b> (IP publik → 192.168.30.10) → routing → forward filter → server. NAT terjadi SEBELUM routing untuk dstnat, dan SETELAH routing untuk srcnat.</p></div>`,
      terms: [['NAT', 'Penerjemahan alamat IP packet di perbatasan jaringan.'], ['Masquerade', 'srcnat otomatis memakai IP interface keluar — untuk IP WAN dinamis.'], ['dst-nat / port forwarding', 'Membelokkan traffic masuk dari internet ke server internal.'], ['Chain', 'Rantai pemrosesan: srcnat (ubah sumber) dan dstnat (ubah tujuan).']],
      diagram: `<pre>              PACKET FLOW NAT

   KELUAR (browsing dari LAN):
   [PC 192.168.20.10] --&gt; [R1] --srcnat/masquerade-->
   IP sumber jadi 203.0.113.5 (IP WAN) --&gt; [Internet]

   MASUK (tamu akses web server):
   [Internet] --&gt; 203.0.113.5:80 --&gt; [R1] --dstnat-->
   tujuan jadi 192.168.30.10:80 --&gt; [Server]

   /ip firewall nat print:
   # CHAIN   ACTION        DETAIL
   0 srcnat  masquerade    out-interface=ether1   (LAN-&gt;Internet)
   1 dstnat  dst-nat       to 192.168.30.10:80   (Internet-&gt;Server)</pre>`,
      scenario: 'Kantor punya 1 IP publik tapi 100 PC. Satu rule masquerade membuat semua PC bisa internet. Lalu server web internal perlu diakses client dari luar — satu rule dst-nat port 80 menyelesaikannya tanpa beli IP publik tambahan.',
      bestPractices: 'Selalu batasi masquerade dengan out-interface WAN; untuk dst-nat selalu pasangkan dengan firewall filter yang membatasi siapa boleh masuk.',
      security: 'Setiap port forwarding adalah pintu dari internet ke server-mu. Forward seperlunya saja, dan pastikan server tujuan sudah di-hardening. dst-nat tanpa filter = undangan terbuka.',
      challenge: 'Buat rule masquerade di CHR lab, verifikasi PC lab bisa "internet" (simulasikan via NAT node GNS3 di Part 16). Lalu buat dst-nat ke server lab dan uji dari sisi WAN.',
      interviewQ: 'Q: "Apa beda masquerade dan src-nat biasa?" — A: Masquerade otomatis memakai IP interface keluar saat ini (cocok untuk IP WAN dinamis/DHCP); src-nat menulis IP pengganti secara manual (untuk IP publik statis).',
      quiz: [
        { q: 'Mengapa rule masquerade diberi out-interface=ether1 (WAN)?', options: ['Agar lebih cepat', 'Agar traffic antar-VLAN/LAN tidak ikut ter-NAT dan rusak', 'Wajib oleh lisensi', 'Agar hemat CPU'], answer: 1, explain: 'Tanpa batasan interface, NAT diterapkan ke semua traffic keluar termasuk antar subnet lokal — merusak komunikasi internal.' },
        { q: 'Kapan memakai masquerade dibanding src-nat manual?', options: ['Saat IP WAN dinamis (DHCP dari ISP)', 'Saat IP WAN statis', 'Tidak ada bedanya', 'Saat tidak ada internet'], answer: 0, explain: 'Masquerade otomatis mengikuti IP interface saat ini — ideal untuk IP dinamis; IP statis lebih tepat pakai src-nat dengan to-addresses.' },
        { q: 'Urutan pemrosesan NAT yang benar adalah…', options: ['dstnat setelah routing, srcnat sebelum routing', 'dstnat sebelum routing, srcnat setelah routing', 'Keduanya sebelum routing', 'Keduanya setelah routing'], answer: 1, explain: 'dstnat harus mengubah tujuan DULU agar routing tahu mau ke mana; srcnat mengubah sumber SETELAH keputusan routing.' }
      ]
    },
    {
      id: '13.14',
      title: 'Firewall',
      body: `<p><b>Firewall</b> di RouterOS adalah "penjaga gerbang" yang memeriksa setiap packet dan memutuskan: <b>accept</b> (lewat), <b>drop</b> (buang diam-diam), atau <b>reject</b> (buang + beri tahu). Ia bekerja di <code>/ip firewall filter</code> dengan tiga chain utama:</p><div class="tblwrap"><table><tr><th>Chain</th><th>Traffic Apa</th><th>Contoh</th></tr><tr><td><b>input</b></td><td>Menuju router ITU SENDIRI</td><td>WinBox/SSH ke router, DNS ke router</td></tr><tr><td><b>forward</b></td><td>LEWAT router (antar interface)</td><td>PC → internet, VLAN20 → VLAN30</td></tr><tr><td><b>output</b></td><td>DARI router itu sendiri keluar</td><td>Router ping ke internet, DNS query router</td></tr></table></div><h3>Connection State — Otak Firewall Modern</h3><p>Firewall stateful mengingat koneksi (<code>/ip firewall connection print</code>). State: <b>established</b> (koneksi yang sudah diizinkan), <b>related</b> (koneksi turunan, mis. FTP data), <b>new</b> (permintaan baru), <b>invalid</b> (cacat/mencurigakan). Pola emas:</p><pre>[admin@R1] &gt; /ip firewall filter add chain=input connection-state=established,related action=accept comment="balasan yg sah"
[admin@R1] &gt; /ip firewall filter add chain=input connection-state=invalid action=drop comment="packet cacat"
# Alasan: izinkan dulu "balasan" dari koneksi yang SUDAH kita izinkan,
# buang packet cacat — baru di bawahnya tulis aturan spesifik.</pre><h3>Urutan Rule = Hidup dan Mati</h3><p>Rule dibaca <b>dari atas ke bawah, yang cocok pertama menang</b>. Rule <code>drop all</code> di paling atas = semua terkunci. Filosofi aman: <b>default deny</b> — izinkan yang perlu, drop sisanya di paling bawah.</p><pre>[admin@R1] &gt; /ip firewall filter add chain=input in-interface=ether1 action=drop comment="DROP semua dari WAN"
# Ditempatkan PALING BAWAH chain input: setelah rule accept management.
# Alasan: WAN = tidak tepercaya. Yang tidak diizinkan eksplisit = ditolak.</pre><div class="callout"><div class="t">Command Berbahaya — Risiko Lockout</div><p style="margin:4px 0 0">Rule <code>chain=input action=drop</code> tanpa pengecualian untuk IP-mu = kamu terkunci keluar. Selalu: <b>1)</b> pastikan ada rule accept untuk IP management-mu DI ATAS rule drop, <b>2)</b> kerjakan dalam Safe Mode, <b>3)</b> di lab, siapkan akses console GNS3 sebagai pintu darurat.</p></div>`,
      terms: [['Firewall filter', 'Daftar rule accept/drop per chain (input/forward/output).'], ['Chain input/forward/output', 'input = ke router; forward = lewat router; output = dari router.'], ['Connection state', 'Status koneksi: established, related, new, invalid — dasar firewall stateful.'], ['Default deny', 'Filosofi: tolak semua kecuali yang diizinkan eksplisit.']],
      diagram: `<pre>              TIGA CHAIN FIREWALL

   [Internet] --&gt; chain=input --&gt; [RouterOS itu sendiri]
                      (WinBox/SSH/DNS ke router)

   [PC LAN] --&gt; chain=forward --&gt; [Internet / VLAN lain]
                      (traffic LEWAT router)

   [RouterOS] --&gt; chain=output --&gt; [Internet]
                      (router ping / update / DNS query)

   URUTAN BACA RULE (per chain):
   1. accept established,related
   2. drop invalid
   3. accept ... (aturan spesifikmu)
   4. drop all  &lt;-- PALING BAWAH (default deny)</pre>`,
      scenario: 'Router kantor diretas via WinBox dari internet karena chain input terbuka total. Forensik: bot mem-brute-force password 3 hari. Solusi: accept established/related → accept WinBox hanya dari VLAN 99 → drop sisanya dari WAN. Serangan berhenti total.',
      bestPractices: 'Terapkan pola: accept established/related → drop invalid → accept spesifik → drop all di bawah. Beri comment di setiap rule.',
      security: 'Jangan pernah biarkan chain input terbuka dari WAN. Management (WinBox/SSH/WebFig) hanya dari VLAN 99 atau via VPN.',
      challenge: 'Susun 4 rule input di CHR: accept established, drop invalid, accept ICMP dari LAN, drop all dari WAN. Uji dari sisi WAN (simulasi) bahwa WinBox ditolak.',
      interviewQ: 'Q: "Jelaskan perbedaan chain input dan forward." — A: Input = traffic yang tujuannya router itu sendiri (management); forward = traffic yang hanya lewat router menuju network lain. Salah menaruh rule di chain yang keliru adalah error paling umum.',
      quiz: [
        { q: 'Rule firewall untuk melindungi akses WinBox ke router ditempatkan di chain…', options: ['forward', 'output', 'input', 'dstnat'], answer: 2, explain: 'Input = traffic menuju router itu sendiri, termasuk sesi management.' },
        { q: 'Mengapa rule "accept established,related" ditaruh paling atas?', options: ['Agar log rapi', 'Agar balasan dari koneksi sah langsung lolos tanpa dicek rule lain — efisien dan benar', 'Wajib oleh MikroTik', 'Agar lebih aman dari DDoS'], answer: 1, explain: 'Balasan koneksi yang sudah diizinkan tidak perlu dievaluasi ulang — hemat CPU dan mencegah rule bawah memblokir balasan sah.' },
        { q: 'Filosofi "default deny" berarti…', options: ['Tolak semua, izinkan yang perlu secara eksplisit', 'Izinkan semua, tolak yang berbahaya', 'Tolak hanya dari WAN', 'Nonaktifkan firewall'], answer: 0, explain: 'Default deny: yang tidak diizinkan eksplisit = ditolak. Kebalikan (default allow) membiarkan celah tak terduga.' }
      ]
    },
    {
      id: '13.15',
      title: 'Mangle',
      body: `<p><b>Mangle</b> artinya "menandai": memberi <b>tanda (mark)</b> pada koneksi atau packet agar bisa diperlakukan khusus oleh fitur lain — QoS/queue (13.16), policy routing, atau logika firewall lanjutan. Mangle sendiri tidak memblokir/mengubah apa pun; ia hanya menempelkan label.</p><h3>Alur Penandaan Dua Tahap</h3><pre>[admin@R1] &gt; /ip firewall mangle add chain=prerouting protocol=tcp dst-port=80,443 action=mark-connection new-connection-mark=browsing-conn comment="tandai browsing"
# Tahap 1: tandai KONEKSI (sekali per koneksi — hemat CPU).
# chain=prerouting = saat packet BARU MASUK, sebelum routing.

[admin@R1] &gt; /ip firewall mangle add chain=prerouting connection-mark=browsing-conn action=mark-packet new-packet-mark=browsing-pkt
# Tahap 2: turunkan tanda ke tiap PACKET dalam koneksi itu.
# Alasan dua tahap: mark-connection sekali, mark-packet mengikuti —
# jauh lebih ringan daripada menandai tiap packet dari nol.</pre><h3>Kegunaan Mark di Dunia Nyata</h3><ul><li><b>QoS:</b> packet bertanda <code>browsing-pkt</code> diprioritaskan di queue dibanding download.</li><li><b>Policy routing:</b> connection bertanda tertentu dilewatkan ISP kedua (failover/load balance).</li><li><b>Monitoring:</b> hitung traffic per mark di <code>/ip firewall mangle print stats</code>.</li></ul><div class="callout blue"><div class="t">Chain Mangle vs Chain Filter/NAT</div><p style="margin:4px 0 0">Mangle punya chain tambahan: <b>prerouting</b> (packet baru masuk) dan <b>postrouting</b> (packet mau keluar). Aturan praktis: tandai sedini mungkin (prerouting) agar mark tersedia untuk semua keputusan berikutnya (routing, queue, filter).</p></div>`,
      terms: [['Mangle', 'Fitur penandaan koneksi/packet dengan mark untuk diproses fitur lain.'], ['Connection mark', 'Tanda level koneksi — dipasang sekali, hemat CPU.'], ['Packet mark', 'Tanda level packet — dipakai queue/QoS.'], ['Prerouting/postrouting', 'Titik penandaan: saat packet masuk / sebelum keluar.']],
      diagram: `<pre>              MANGLE = TEMPEL LABEL

   [Packet browsing masuk]
        |
   chain=prerouting, dst-port 80/443
        |
   +----v----------------------------------+
   | mark-connection = browsing-conn       |  (sekali per koneksi)
   |        |                              |
   |        v                              |
   | mark-packet = browsing-pkt            |  (mengikuti tiap packet)
   +----+----------------+-----------------+
        |                |
        v                v
   [Queue: prioritas]  [Policy routing: via ISP-2]
   "label dibaca fitur lain"</pre>`,
      scenario: 'Kantor punya 2 ISP: murah-lambat dan mahal-cepat. Dengan mangle, traffic Zoom/Meet ditandai dan di-policy-routing lewat ISP cepat, sedangkan download file lewat ISP murah — tagihan turun, meeting lancar.',
      bestPractices: 'Selalu dua tahap (connection-mark dulu, baru packet-mark) untuk hemat CPU; beri nama mark yang deskriptif.',
      security: 'Mark bisa dipakai penyerang? Tidak langsung — tapi rule mangle yang ceroboh (terlalu lebar) bisa menandai traffic yang salah dan merusak QoS/routing. Review rule berkala.',
      challenge: 'Buat 2 rule mangle di CHR: tandai koneksi browsing (port 80/443) lalu turunkan ke packet-mark. Lihat statistiknya di print stats setelah ada traffic.',
      interviewQ: 'Q: "Apa beda connection-mark dan packet-mark, dan mengapa dua tahap?" — A: Connection-mark dipasang sekali per koneksi; packet-mark menempel di tiap packet untuk dibaca queue. Dua tahap jauh lebih hemat CPU dibanding mengevaluasi tiap packet dari nol.',
      quiz: [
        { q: 'Fungsi utama mangle adalah…', options: ['Memblokir website', 'Menandai koneksi/packet dengan mark agar diproses fitur lain (QoS, policy routing)', 'Mengenkripsi data', 'Mengganti IP'], answer: 1, explain: 'Mangle hanya menempelkan label; queue, routing, atau filter yang bertindak berdasar label itu.' },
        { q: 'Mengapa penandaan dilakukan dua tahap (connection-mark lalu packet-mark)?', options: ['Syarat lisensi', 'Hemat CPU — koneksi ditandai sekali, packet mengikutinya', 'Agar lebih aman', 'Tidak ada alasan'], answer: 1, explain: 'Evaluasi rule berat dilakukan sekali per koneksi, bukan per packet — krusial di router sibuk.' },
        { q: 'Chain yang tepat untuk menandai packet sedini mungkin saat masuk adalah…', options: ['postrouting', 'forward', 'prerouting', 'output'], answer: 2, explain: 'Prerouting = titik pertama packet terlihat setelah masuk interface, sebelum keputusan routing.' }
      ]
    },
    {
      id: '13.16',
      title: 'Queue',
      body: `<p><b>Queue</b> adalah "polisi lalu lintas" bandwidth: membatasi kecepatan (bandwidth limit) dan mengatur prioritas antar jenis traffic. Tanpa queue, satu user download besar bisa menghabiskan bandwidth dan membuat Zoom semua orang patah-patah.</p><h3>Simple Queue — Cara Termudah</h3><pre>[admin@R1] &gt; /queue simple add name="limit-guest" target=192.168.40.0/24 max-limit=10M/10M comment="VLAN40 maks 10Mbps"
# Alasan tiap parameter:
# - target      : SIAPA yang dibatasi (IP/subnet user tamu)
# - max-limit   : upload/download MAKSIMUM. Format Up/Down.
#             Alasan membatasi GUEST: tamu tidak boleh mengganggu OFFICE/SERVER.
#             10M cukup untuk browsing, tidak cukup untuk "menyedot" bandwidth.

[admin@R1] &gt; /queue simple print stats
# Kolom RATE menunjukkan pemakaian aktual — verifikasi bahwa limit bekerja.</pre><h3>Prioritas dengan Packet Mark (gandeng 13.15)</h3><p>Queue bisa membaca <b>packet-mark</b> dari mangle: traffic penting (Zoom, prioritas 1) didahulukan atas download (prioritas 8). Inilah <b>QoS (Quality of Service)</b> sederhana: bukan menambah bandwidth, tapi mengatur siapa didahulukan saat rebutan.</p><div class="tblwrap"><table><tr><th>Jenis Queue</th><th>Kapan Dipakai</th></tr><tr><td>Simple queue</td><td>Batas per IP/subnet — cepat dan cukup untuk lab/kantor kecil</td></tr><tr><td>Queue tree</td><td>QoS kompleks: prioritas per jenis traffic + hierarchical limit (materi lanjutan)</td></tr></table></div><div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, limit boleh ekstrem (1M) agar efeknya terlihat saat testing. Di production, tentukan limit dari <b>baseline pengukuran</b> (Part 23–27): batasi berdasar kebutuhan nyata, bukan tebakan — limit terlalu kecil = komplain user.</p></div>`,
      terms: [['Queue', 'Pengatur bandwidth: limit kecepatan dan prioritas traffic.'], ['Simple queue', 'Queue sederhana per target IP/subnet.'], ['max-limit', 'Batas maksimum upload/download (format Up/Down).'], ['QoS', 'Quality of Service — memprioritaskan traffic penting saat bandwidth rebutan.']],
      diagram: `<pre>              QUEUE = POLISI BANDWIDTH

   Tanpa queue:                    Dengan queue:
   [Download 95 Mbps]              [Download max 10M]--+
   [Zoom patah-patah]               [Zoom prioritas 1]--+--&gt; [Internet 100M]
   rebutan liar                     tertib berdasar aturan

   /queue simple add target=192.168.40.0/24 max-limit=10M/10M
                          \_______________/  \_______/
                           siapa dibatasi    batas Up/Down</pre>`,
      scenario: 'Kos-kosan 20 kamar: satu penghuni torrent membuat semua lemot. Pemilik pasang simple queue per IP 5 Mbps — torrent tetap jalan tapi tidak lagi "memakan" tetangga. Komplain berhenti tanpa menambah bandwidth.',
      bestPractices: 'Batasi per subnet/user, bukan mematikan layanan; ukur baseline dulu sebelum menentukan angka limit di production.',
      security: 'Queue bukan alat keamanan — ia tidak memblokir serangan. Jangan andalkan queue untuk menahan DDoS; itu tugas firewall (13.14).',
      challenge: 'Buat simple queue 2M/2M untuk satu IP lab, lalu uji speedtest dari PC tersebut dan verifikasi RATE tidak melewati limit.',
      interviewQ: 'Q: "Apa beda menambah bandwidth vs menerapkan QoS?" — A: Menambah bandwidth memperbesar "jalan"; QoS mengatur prioritas "kendaraan" saat jalan penuh. QoS tidak menambah kapasitas — ia memastikan traffic penting menang saat rebutan.',
      quiz: [
        { q: 'Format max-limit=10M/10M berarti…', options: ['10 MB total', 'Batas 10 Mbps upload / 10 Mbps download', '10 user maksimal', '10 menit durasi'], answer: 1, explain: 'Formatnya Up/Down dalam Mbps — batas kecepatan unggah dan unduh.' },
        { q: 'Untuk memprioritaskan Zoom di atas download, queue membutuhkan…', options: ['IP baru', 'packet-mark dari mangle agar bisa membedakan jenis traffic', 'Restart router', 'Lisensi level 6'], answer: 1, explain: 'Queue membaca packet-mark hasil mangle untuk tahu packet mana yang penting.' },
        { q: 'Kapan memakai queue tree dibanding simple queue?', options: ['Selalu, lebih keren', 'Saat butuh QoS kompleks: prioritas per jenis traffic dan limit bertingkat', 'Hanya di CHR', 'Tidak pernah'], answer: 1, explain: 'Simple queue cukup untuk batas per IP; queue tree untuk hierarki prioritas yang kompleks.' }
      ]
    },
    {
      id: '13.17',
      title: 'VLAN',
      body: `<p><b>VLAN (Virtual LAN)</b> memecah satu switch fisik menjadi beberapa switch virtual yang terisolasi (Part 08–10). Di RouterOS, VLAN dibuat sebagai interface virtual di atas interface fisik/bridge, lalu diberi IP masing-masing — inilah <b>router-on-a-stick</b>: satu kabel membawa banyak VLAN (trunk).</p><h3>Membuat VLAN + IP Sesuai Desain Lab</h3><pre>[admin@R1] &gt; /interface vlan add name=vlan10-CCTV vlan-id=10 interface=ether2 comment="trunk ke switch"
[admin@R1] &gt; /interface vlan add name=vlan20-OFFICE vlan-id=20 interface=ether2
[admin@R1] &gt; /interface vlan add name=vlan30-SERVER vlan-id=30 interface=ether2
# Alasan: SATU interface fisik (ether2) jadi trunk membawa 3 VLAN.
# vlan-id HARUS sama dengan konfigurasi switch di ujung sana — mismatch
# = VLAN tidak nyambung (error paling umum!).

[admin@R1] &gt; /ip address add address=192.168.10.1/24 interface=vlan10-CCTV comment="GW CCTV"
[admin@R1] &gt; /ip address add address=192.168.20.1/24 interface=vlan20-OFFICE comment="GW OFFICE"
[admin@R1] &gt; /ip address add address=192.168.30.1/24 interface=vlan30-SERVER comment="GW SERVER"
# Alasan: IP dipasang di interface VLAN (bukan ether2 langsung) —
# setiap VLAN = 1 subnet = 1 gateway (aturan emas Part 01).</pre><h3>Verifikasi</h3><pre>[admin@R1] &gt; /interface vlan print
 #   NAME           VLAN-ID  INTERFACE
 0   vlan10-CCTV        10  ether2
 1   vlan20-OFFICE      20  ether2
# Checklist: vlan-id benar? interface induk benar (trunk)? IP menempel
# di interface VLAN (bukan fisik)? Ping gateway dari client tiap VLAN?</pre><div class="callout"><div class="t">Bridge VLAN Filtering (v7)</div><p style="margin:4px 0 0">Untuk switch-like behavior di bridge, v7 memakai <code>/interface bridge vlan</code> + <code>vlan-filtering=yes</code>. Di lab CHR kita (router-on-a-stick murni), pola <code>/interface vlan</code> di atas sudah cukup dan lebih mudah dipahami. Pelajari bridge VLAN filtering setelah pola ini dikuasai.</p></div>`,
      terms: [['VLAN interface', 'Interface virtual (vlan10, vlan20) di atas interface fisik untuk trunk 802.1Q.'], ['Trunk', 'Link yang membawa banyak VLAN sekaligus (bert tag).'], ['Router-on-a-stick', 'Satu interface fisik router melayani banyak VLAN via sub-interface.'], ['VLAN filtering', 'Fitur bridge v7 untuk switching VLAN-aware di dalam bridge.']],
      diagram: `<pre>              ROUTER-ON-A-STICK

   [Switch] ---- trunk (VLAN 10,20,30) ---- ether2 [R1]
                                                      |
                    +----------------+----------------+----------------+
                    |                |                |
              vlan10 (tag 10)  vlan20 (tag 20)  vlan30 (tag 30)
              192.168.10.1     192.168.20.1     192.168.30.1
                    |                |                |
               [CCTV .10]       [PC .10]         [Server .10]

   Satu kabel fisik, tiga jaringan logis terisolasi.</pre>`,
      scenario: 'Gedung 3 lantai, tiap lantai butuh OFFICE+SERVER+CCTV. Tanpa VLAN: 9 kabel uplink. Dengan trunk VLAN: 1 kabel per lantai. Inilah alasan VLAN adalah fondasi desain enterprise modern.',
      bestPractices: 'VLAN ID di router harus identik dengan di switch; dokumentasikan mapping VLAN↔subnet di satu tabel (seperti tabel di 13.8).',
      security: 'VLAN bukan enkripsi — ia isolasi logis. Serangan VLAN hopping (double tagging) mungkin di switch yang salah konfigurasi; native VLAN jangan dipakai untuk data user.',
      challenge: 'Buat vlan10/20/30 di ether2 CHR dengan IP .1 masing-masing. Verifikasi: /interface vlan print + ping gateway dari tiap segmen lab.',
      interviewQ: 'Q: "Apa itu router-on-a-stick dan kapan dipakai?" — A: Router memakai satu interface fisik sebagai trunk untuk me-routing antar banyak VLAN via sub-interface; dipakai saat butuh inter-VLAN routing tanpa banyak port fisik.',
      quiz: [
        { q: 'IP gateway tiap VLAN dipasang di…', options: ['Interface fisik ether2 langsung', 'Interface VLAN masing-masing (vlan10, vlan20, …)', 'Bridge', 'Tidak perlu IP'], answer: 1, explain: 'Tiap VLAN adalah subnet terpisah — gateway-nya menempel di interface VLAN-nya, bukan di fisik.' },
        { q: 'Error paling umum saat VLAN tidak konek adalah…', options: ['Kabel terlalu panjang', 'VLAN ID mismatch antara router dan switch', 'IP terlalu besar', 'Router terlalu panas'], answer: 1, explain: 'Tag harus sama di kedua ujung trunk; beda ID = frame dibuang diam-diam.' },
        { q: 'Keuntungan utama trunk dibanding kabel terpisah per VLAN adalah…', options: ['Lebih cepat', 'Satu kabel membawa banyak VLAN — hemat port dan kabel', 'Tidak butuh switch', 'Tanpa konfigurasi'], answer: 1, explain: 'Trunk memultipleks banyak VLAN dalam satu link fisik via penandaan 802.1Q.' }
      ]
    },
    {
      id: '13.18',
      title: 'Routing',
      body: `<p>Setelah VLAN dan IP terpasang, router perlu tahu cara meneruskan packet <b>antar subnet</b> — inilah <b>inter-VLAN routing</b>. Kabar baik: untuk subnet yang langsung menempel (connected), RouterOS otomatis bisa me-routing-nya tanpa konfigurasi tambahan!</p><h3>Inter-VLAN Routing Otomatis</h3><pre>[admin@R1] &gt; /ip route print
 #      DST-ADDRESS        GATEWAY         DISTANCE
 0 ADC  192.168.10.0/24   vlan10-CCTV            0
 1 ADC  192.168.20.0/24   vlan20-OFFICE          0
 2 ADC  192.168.30.0/24   vlan30-SERVER          0
# Semua connected (C) — R1 otomatis me-routing antar ketiganya.
# PC 192.168.20.10 ping 192.168.30.10: LANGSUNG BISA (asal firewall
# forward mengizinkan — lihat 13.14!).</pre><h3>Kapan Butuh Static Route?</h3><p>Saat ada <b>router kedua</b> (topologi Part 16): subnet di balik R2 tidak dikenal R1 secara otomatis. Maka tambahkan static route menunjuk ke R2 sebagai gateway (lihat 13.9). Pola pikirnya: <b>connected = otomatis, jauh = tulis manual</b>.</p><pre>[admin@R1] &gt; /ip route add dst-address=192.168.40.0/24 gateway=192.168.20.254 comment="GUEST via R2"</pre><h3>Packet Flow Inter-VLAN</h3><p>PC OFFICE (192.168.20.10) ping server (192.168.30.10): <b>1)</b> PC kirim ke gateway-nya (192.168.20.1) karena beda subnet → <b>2)</b> R1 terima di vlan20, cek tabel route → <b>3)</b> cocok 192.168.30.0/24 via vlan30 → <b>4)</b> cek firewall <b>forward</b> (diizinkan?) → <b>5)</b> teruskan via vlan30 → <b>6)</b> reply menempuh jalan sebaliknya. Jika ping gagal padahal route ada → curigai firewall forward!</p><div class="callout blue"><div class="t">v7: Routing Table</div><p style="margin:4px 0 0">Di v7, tabel routing utama bernama <code>main</code>. Untuk policy routing (traffic tertentu lewat tabel berbeda), buat tabel baru di <code>/routing table add name=...</code> lalu rujuk via <code>routing-table</code> di rule mangle/route — pengganti <code>routing-mark</code> ala v6.</p></div>`,
      terms: [['Inter-VLAN routing', 'Routing antar subnet VLAN yang berbeda via router.'], ['Connected route', 'Route otomatis untuk subnet yang menempel langsung — tanpa konfigurasi.'], ['Routing table', 'Kumpulan route; v7 mendukung banyak tabel untuk policy routing.']],
      diagram: `<pre>           PACKET FLOW INTER-VLAN

   [PC .20.10] --(1) ke gateway .20.1--> [R1]
                                              |
                          (2) cek route: 192.168.30.0/24?
                          (3) via vlan30-SERVER --&gt; ADA
                                              |
                          (4) firewall FORWARD: allow? --&gt; YA
                                              |
   [PC .20.10] &lt;--(6) reply-- vlan20 -- [R1] --vlan30--&gt; (5) [Server .30.10]

   Gagal di (4)? = masalah FIREWALL, bukan routing!</pre>`,
      scenario: 'User OFFICE tidak bisa akses server padahal satu router. Engineer cek route: connected semua ada. Ternyata firewall forward mendrop antar-VLAN (default deny tanpa exception). Satu rule accept VLAN20→VLAN30 menyelesaikan.',
      bestPractices: 'Pisahkan diagnosis: route dulu (/ip route print, flag A), baru firewall forward. Jangan ubah keduanya sekaligus.',
      security: 'Inter-VLAN routing default-nya "semua bisa ke semua" — di production, batasi dengan firewall forward: GUEST tidak boleh ke SERVER/MANAGEMENT, hanya ke internet.',
      challenge: 'Dari PC VLAN 20, ping gateway VLAN 30 (.30.1) lalu ping server .30.10. Jika gagal, tentukan: masalah routing atau firewall? Buktikan dengan /ip route print.',
      interviewQ: 'Q: "Kapan inter-VLAN routing butuh static route tambahan?" — A: Tidak butuh untuk subnet yang connected langsung; butuh saat subnet tujuan berada di balik router lain (multi-router) — tulis static route ke gateway router tetangga.',
      quiz: [
        { q: 'Subnet yang langsung menempel di interface router…', options: ['Butuh static route manual', 'Otomatis bisa di-routing (connected route) tanpa konfigurasi', 'Tidak bisa di-routing', 'Butuh NAT dulu'], answer: 1, explain: 'Connected route dibuat otomatis saat IP dipasang — inter-VLAN routing langsung jalan.' },
        { q: 'PC VLAN 20 gagal ping server VLAN 30 padahal route connected ada. Tersangka utama berikutnya…', options: ['Kabel putus', 'Firewall chain forward memblokir antar-VLAN', 'DNS rusak', 'MTU'], answer: 1, explain: 'Route ada = Layer 3 tahu jalan; yang menghentikan adalah filter forward. Cek rule firewall.' },
        { q: 'Di v7, pengganti routing-mark v6 untuk policy routing adalah…', options: ['routing-flag', 'routing-table (tabel terpisah di /routing table)', 'routing-policy', 'Tidak ada pengganti'], answer: 1, explain: 'v7 memakai konsep tabel routing bernama; rule menunjuk routing-table tertentu.' }
      ]
    },
    {
      id: '13.19',
      title: 'Logging',
      body: `<p><b>Logging</b> adalah "CCTV"-nya router: mencatat kejadian (login, error, firewall drop) agar bisa ditelusuri. Tanpa log, troubleshooting = menebak; dengan log, troubleshooting = membaca bukti.</p><h3>Struktur Logging: Topics → Action</h3><pre>[admin@R1] &gt; /system logging print
 #   TOPICS            ACTION
 0   info              memory
 1   error             memory
 2   warning           memory
 3   critical          echo
# TOPICS = jenis kejadian. ACTION = mau diapakan (memory/echo/disk/remote).

[admin@R1] &gt; /system logging add topics=firewall action=memory comment="catat drop firewall"
# Alasan: tanpa ini, kamu tidak tahu rule mana memblokir siapa.
# Pasangkan dengan rule firewall ber-action=log untuk bukti forensik.

[admin@R1] &gt; /log print
# Membaca log yang tersimpan di memory.</pre><h3>Remote Syslog — Wajib di Production</h3><p>Log di memory hilang saat reboot. Di production, kirim ke <b>syslog server</b> (nanti: Graylog/ELK atau Zabbix, Part 23+):</p><pre>[admin@R1] &gt; /system logging action add name=remote target=remote remote=192.168.99.50
[admin@R1] &gt; /system logging add topics=info,warning,error action=remote
# Alasan: log terpusat = bukti tidak hilang + satu tempat memantau
# puluhan router. Di lab cukup memory; di production JANGAN hanya memory.</pre><div class="callout"><div class="t">Log Login Gagal = Alarm Dini</div><p style="margin:4px 0 0">Topic <code>system,error</code> mencatat login gagal. Jika <code>/log print</code> penuh dengan "login failure for user admin from 45.x.x.x" — itu brute force dari internet. Respon: perketat firewall input (13.14), ganti user admin.</p></div>`,
      terms: [['Logging', 'Pencatatan kejadian sistem untuk audit dan troubleshooting.'], ['Topics', 'Kategori kejadian (info, error, firewall, system).'], ['Action', 'Tujuan log: memory, disk, echo, remote (syslog).'], ['Syslog', 'Protokol standar pengiriman log ke server terpusat.']],
      diagram: `<pre>              ALUR LOGGING

   [Kejadian: login gagal, firewall drop, link down]
                         |
              /system logging (topics)
                         |
           +-------------+-------------+
           |             |             |
        memory         echo         remote (syslog)
     (hilang saat    (tampil di    192.168.99.50
      reboot)        terminal)     (tahan reboot,
                                   terpusat)

   LAB: memory cukup.  PRODUCTION: wajib remote.</pre>`,
      scenario: 'Server tidak bisa diakses dari VLAN tamu. Engineer cek /log print: "firewall,info input: drop ..." — bukti jelas rule mana yang memblokir. Tanpa log ia akan menebak-nebak 30 menit.',
      bestPractices: 'Aktifkan logging firewall (action=log pada rule drop penting) saat troubleshooting; matikan setelah selesai agar log tidak penuh.',
      security: 'Log adalah bukti forensik — pastikan waktu akurat (NTP, /system ntp client) agar timestamp log bisa dipercaya saat insiden.',
      challenge: 'Tambahkan rule firewall dengan action=log, picu traffic yang terblokir, lalu baca buktinya di /log print.',
      interviewQ: 'Q: "Mengapa log memory saja tidak cukup di production?" — A: Hilang saat reboot/crash — tepat saat log paling dibutuhkan (investigasi insiden). Wajib dikirim ke syslog server terpusat.',
      quiz: [
        { q: 'Pasangan konsep logging yang benar adalah…', options: ['Topics = tujuan, Action = jenis kejadian', 'Topics = jenis kejadian, Action = tujuan/penanganan log', 'Keduanya sama', 'Topics hanya untuk firewall'], answer: 1, explain: 'Topics mengkategorikan kejadian (info/error/firewall); Action menentukan mau diapakan (memory/disk/remote).' },
        { q: 'Mengapa log login gagal penting dipantau?', options: ['Untuk statistik saja', 'Indikasi dini brute force dari internet', 'Syarat lisensi', 'Tidak penting'], answer: 1, explain: 'Lonjakan login failure = seseorang menebak password — sinyal untuk perketat firewall dan ganti kredensial.' },
        { q: 'Kelemahan menyimpan log hanya di memory adalah…', options: ['Lebih lambat', 'Hilang saat reboot — tepat saat dibutuhkan untuk forensik', 'Boros lisensi', 'Tidak bisa dibaca'], answer: 1, explain: 'Memory volatile; insiden sering diikuti reboot/crash. Production wajib remote syslog.' }
      ]
    },
    {
      id: '13.20',
      title: 'Monitoring',
      body: `<p><b>Monitoring</b> = melihat kondisi router <b>saat ini</b> (berbeda dengan logging yang mencatat <b>kejadian lalu</b>). Tool monitoring bawaan RouterOS cukup untuk diagnosis cepat sebelum memakai Zabbix (Part 23–27).</p><h3>Tool Monitoring Esensial</h3><pre>[admin@R1] &gt; /interface monitor-traffic ether1
# Alasan: melihat throughput real-time — "benarkah link penuh?"
# Jawaban cepat untuk komplain "internet lambat".

[admin@R1] &gt; /tool ping 8.8.8.8 count=5
[admin@R1] &gt; /tool traceroute 8.8.8.8
# Alasan: ping = "sampai atau tidak + berapa lama"; traceroute =
# "putus di hop ke berapa". Kombinasi penentu lokasi masalah.

[admin@R1] &gt; /tool torch interface=ether2
# "Mikroskop" traffic: melihat IP/port apa yang paling ramai real-time.
# Alasan: menemukan "tersangka" pemakan bandwidth dalam detik.

[admin@R1] &gt; /system resource print
# CPU, memory, uptime. CPU 100% = router kewalahan (kebanyakan
# mangle/queue/bridge software) — sinyal butuh hardware lebih kuat
# atau konfigurasi diringankan.</pre><h3>SNMP — Jembatan ke Zabbix</h3><p><b>SNMP (Simple Network Management Protocol)</b> memungkinkan sistem monitoring eksternal (Zabbix) menarik data (traffic, CPU) secara berkala. Fondasinya disiapkan di sini:</p><pre>[admin@R1] &gt; /snmp set enabled=yes contact="noc@lab" location="LAB-R1"
[admin@R1] &gt; /snmp community set [find default=yes] addresses=192.168.99.0/24
# Alasan addresses=: community "public" default boleh dari mana saja =
# bahaya. Batasi hanya dari subnet MANAGEMENT (VLAN 99).</pre><div class="callout blue"><div class="t">Monitoring vs Logging</div><p style="margin:4px 0 0"><b>Monitoring</b> menjawab "bagaimana kondisinya SEKARANG?" (traffic, CPU, link). <b>Logging</b> menjawab "apa yang TERJADI tadi?" (login gagal, rule hit). Keduanya komplemen — monitoring untuk deteksi, log untuk investigasi. Di Part 23+, Zabbix menggabungkan keduanya.</p></div>`,
      terms: [['Monitoring', 'Pengamatan kondisi real-time (traffic, CPU, link).'], ['Torch', 'Tool melihat komposisi traffic per IP/port secara real-time.'], ['SNMP', 'Protokol agar sistem monitoring eksternal bisa menarik data device.'], ['SNMP community', 'Seperti "password" SNMP — batasi sumber aksesnya.']],
      diagram: `<pre>              TOOLKIT MONITORING RouterOS

   /interface monitor-traffic  --> "berapa Mbps sekarang?"
   /tool ping | traceroute     --> "sampai? putus di mana?"
   /tool torch                 --> "siapa paling ramai?"
   /system resource print      --> "CPU/RAM kuat?"
   /ip firewall connection    --> "koneksi apa saja aktif?"
   /snmp                      --> "kirim data ke Zabbix"

   Alur diagnosis cepat:
   lambat? -> monitor-traffic (penuh?) -> torch (siapa?) -> queue/firewall</pre>`,
      scenario: 'NOC melihat grafik Zabbix: traffic WAN R1 naik ke 95%. Engineer torch ether1: satu IP CCTV streaming ke luar negeri (salah konfigurasi port forwarding). Fix: hapus dst-nat liar + batasi via queue. Total diagnosis: 10 menit.',
      bestPractices: 'Hafalkan 5 perintah di atas — mereka menyelesaikan 80% diagnosis awal tanpa tool tambahan.',
      security: 'Batasi SNMP community hanya dari VLAN management; disable SNMP bila belum dipakai. Community string default "public" yang terbuka = bocornya seluruh statistik jaringan.',
      challenge: 'Jalankan monitor-traffic, torch, dan system resource di CHR-mu. Catat CPU idle vs saat ada traffic — pahami "biaya" fitur software.',
      interviewQ: 'Q: "Bedakan monitoring dan logging, dan kapan memakai masing-masing." — A: Monitoring = kondisi real-time untuk deteksi (traffic, CPU); logging = catatan kejadian untuk investigasi (login gagal, drop). Deteksi pakai monitoring, akar masalah dicari di log.',
      quiz: [
        { q: 'Tool untuk mengetahui IP/port paling ramai secara real-time adalah…', options: ['ping', 'torch', 'traceroute', 'snmp'], answer: 1, explain: 'Torch menampilkan komposisi traffic live per IP/port — ideal menemukan pemakan bandwidth.' },
        { q: 'Kombinasi ping + traceroute menjawab pertanyaan…', options: ['Berapa harga router', '"Sampai atau tidak + putus di hop ke berapa"', 'Siapa login terakhir', 'Berapa user DHCP'], answer: 1, explain: 'Ping = reachability/latency; traceroute = lokasi hop yang bermasalah.' },
        { q: 'Mengapa SNMP community default harus dibatasi sumbernya?', options: ['Agar lebih cepat', 'Community "public" yang terbuka membocorkan statistik jaringan ke siapa pun', 'Syarat garansi', 'Tidak perlu dibatasi'], answer: 1, explain: 'SNMP tanpa batasan = siapa pun bisa membaca topologi, traffic, dan info device — batasi ke VLAN management.' }
      ]
    }
  ]
};
