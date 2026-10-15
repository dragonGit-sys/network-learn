// Part 20 — Fase D: VLAN Enterprise Lab (PART PROJECT)
// Hands-on penuh: skema VLAN/IP konsisten Part 01/19.
// Struktur tiap sub-bab lab: Topology → Objective → Configuration →
// Verification → Failure Injection → Troubleshooting → Fix → Final Verification.
import type { Part } from './types';

export const part20: Part = {
  id: '20',
  number: 'PART 20',
  title: 'VLAN Enterprise Lab',
  phaseId: 'fase-4',
  description:
    'Lab end-to-end membangun segmentasi enterprise: desain VLAN, IP plan, konfigurasi trunk/access port, inter-VLAN routing, firewall antar VLAN, dan troubleshooting — memakai skema desain lab secara konsisten.',
  repoFolder: 'part-20-vlan-enterprise-lab',
  objectives: [
    'Merancang VLAN dan IP address plan enterprise yang konsisten dan terdokumentasi.',
    'Mengonfigurasi VLAN, trunk port, dan access port di switch (dengan penjelasan alasan tiap command).',
    'Mengonfigurasi inter-VLAN routing dan firewall policy antar VLAN.',
    'Melakukan troubleshooting VLAN terstruktur: dari gejala ke root cause ke fix terverifikasi.',
  ],
  prerequisites:
    'Part 08–10 (VLAN, trunk, inter-VLAN routing), Part 19 (arsitektur enterprise & skema desain). GNS3 atau EVE-NG dengan minimal 2 switch L2/L3 virtual dan 4 VM/PC.',
  subbabs: [
    {
      id: '20.1',
      title: 'VLAN Design',
      body: `
<p><b>VLAN design</b> (desain VLAN) adalah keputusan <i>sebelum</i> konfigurasi: VLAN apa saja yang ada, ID-nya berapa, dan siapa penghuninya. Desain yang buruk (ID acak, fungsi campur) akan menghantui operasional bertahun-tahun.</p>
<h3>Prinsip Desain VLAN</h3>
<ul>
<li><b>Satu fungsi = satu VLAN</b> — jangan campur CCTV dengan printer "karena port sisa". Aturan emas: 1 VLAN = 1 subnet = 1 broadcast domain.</li>
<li><b>ID konsisten antar site</b> — VLAN 20 selalu OFFICE di semua gedung/cabang. Teknisi cabang tidak perlu menghafal ulang.</li>
<li><b>Hindari VLAN 1 untuk user</b> — VLAN 1 adalah default/native bawaan switch; menaruh user di sana berisiko terhadap serangan VLAN hopping.</li>
<li><b>Sisakan ruang tumbuh</b> — beri jarak ID (10, 20, 30…) agar VLAN baru bisa disisipkan tanpa renumbering.</li>
</ul>
<h3>Desain Final Lab Ini (Wajib Konsisten)</h3>
<div class="tblwrap"><table>
<tr><th>VLAN ID</th><th>Nama</th><th>Fungsi</th><th>Subnet</th></tr>
<tr><td>10</td><td>CCTV</td><td>Kamera + NVR</td><td>192.168.10.0/24</td></tr>
<tr><td>20</td><td>OFFICE</td><td>PC/laptop/printer karyawan</td><td>192.168.20.0/24</td></tr>
<tr><td>30</td><td>SERVER</td><td>Server farm</td><td>192.168.30.0/24</td></tr>
<tr><td>40</td><td>GUEST</td><td>Wi-Fi tamu / BYOD</td><td>192.168.40.0/24</td></tr>
<tr><td>99</td><td>MANAGEMENT</td><td>SSH/SNMP/syslog perangkat</td><td>192.168.99.0/24</td></tr>
</table></div>
<h3>Hands-On: Menyusun Dokumen Desain</h3>
<h3>Topology</h3>
<pre>Belum ada perangkat — tahap ini murni dokumen.
Output tahap ini: tabel VLAN di atas + alasan tiap baris.</pre>
<h3>Objective</h3>
<p>Menghasilkan dokumen desain VLAN 1 halaman yang bisa diberikan ke teknisi lain untuk diimplementasikan tanpa bertanya.</p>
<h3>Configuration</h3>
<p>Tulis dokumen berisi: tabel VLAN (ID, nama, fungsi, subnet, gateway), daftar penghuni tiap VLAN, dan aturan akses antar VLAN (matriks allow/deny). Simpan sebagai <code>vlan-design.md</code> — ini menjadi Portfolio artifact.</p>
<h3>Verification</h3>
<p>Minta "peer review" (atau review sendiri esok hari): apakah orang lain bisa membangun hanya dari dokumen ini? Apakah setiap VLAN punya tepat satu subnet?</p>
<h3>Failure Injection</h3>
<p>Sengaja buat satu kesalahan di dokumen: tukar subnet VLAN 30 dan 40. </p>
<h3>Troubleshooting</h3>
<p>Telusuri dampak: DHCP scope mana yang salah? Firewall rule mana yang bocor (guest bisa ke server)? Catat semua titik yang harus diperbaiki.</p>
<h3>Fix</h3>
<p>Kembalikan ke desain benar, lalu tambahkan <b>checklist validasi</b> di dokumen: "setiap perubahan desain harus cek: DHCP, firewall, routing, dokumentasi".</p>
<h3>Final Verification</h3>
<p>Dokumen final lolos checklist; tidak ada VLAN tanpa subnet, tidak ada subnet dipakai dua VLAN.</p>
<div class="callout blue"><div class="t">Mengapa Desain Dulu?</div><p style="margin:4px 0 0">80% masalah VLAN di production bukan salah ketik command — melainkan desain yang tidak dipikirkan (ID tabrakan antar site, fungsi campur). Satu jam mendesain menghemat sepuluh jam troubleshooting.</p></div>`,
      terms: [
        ['VLAN design', 'Dokumen keputusan VLAN: ID, nama, fungsi, subnet, dan aturan akses — dibuat sebelum konfigurasi.'],
        ['VLAN hopping', 'Serangan melompat antar VLAN dengan memanipulasi tag; salah satu alasan VLAN 1 tidak dipakai untuk user.'],
        ['Native VLAN', 'VLAN yang traffic-nya lewat trunk tanpa tag; default-nya VLAN 1.'],
        ['Renumbering', 'Mengganti ID/subnet yang sudah dipakai — mahal dan berisiko, dihindari dengan desain berjarak.'],
      ],
      diagram: `<pre>        MATRIKS AKSES ANTAR VLAN (ringkas)

            ke:  10   20   30   40   99   NET
dari:
VLAN 10 CCTV      -    X   NVR   X    X    X
VLAN 20 OFFICE    X    -   443   X    X   ALLOW
VLAN 30 SERVER    X   balas -    X    X   terbatas
VLAN 40 GUEST     X    X    X    -    X   ALLOW
VLAN 99 MGMT   ALLOW ALLOW ALLOW ALLOW  -   terbatas

X = DENY. Detail rule ditulis di 20.11.</pre>`,
      scenario:
        'Dua cabang perusahaan memakai VLAN ID berbeda untuk fungsi yang sama (cabang A: VLAN 5 = office, cabang B: VLAN 5 = CCTV). Saat digabung via trunk antar site, traffic office dan CCTV bercampur — insiden keamanan. Pelajaran: standarkan ID VLAN sejak desain awal.',
      bestPractices:
        'Dokumentasikan desain VLAN di satu tempat (IPAM/wiki) dan jadikan "sumber kebenaran". Setiap perubahan VLAN = update dokumen dulu, konfigurasi kemudian.',
      security:
        'Desain adalah kontrol keamanan pertama: VLAN management (99) tidak boleh bisa dijangkau user; VLAN guest (40) deny ke semua internal. Tulis matriks akses sebelum menyentuh CLI.',
      challenge:
        'Perusahaan menambah divisi "R&D" yang butuh isolasi seperti server tapi boleh akses internet penuh. Tentukan: VLAN ID, subnet, dan 4 baris matriks aksesnya. Jelaskan mengapa tidak memakai VLAN 30 yang sudah ada.',
      interviewQ:
        'Q: "Apa yang kamu dokumentasikan sebelum mengonfigurasi VLAN di enterprise?" — A: Tabel VLAN (ID, nama, fungsi, subnet, gateway), penghuni tiap VLAN, dan matriks akses antar VLAN. Tanpa ini, konfigurasi hanya trial-and-error yang tidak bisa diaudit.',
      quiz: [
        {
          q: 'Mengapa VLAN 1 tidak dipakai untuk traffic user?',
          options: [
            'Karena VLAN 1 terlalu lambat',
            'VLAN 1 adalah default/native bawaan — menaruh user di sana berisiko terhadap serangan VLAN hopping',
            'Karena VLAN 1 hanya untuk Wi-Fi',
            'Tidak ada alasan teknis',
          ],
          answer: 1,
          explain: 'VLAN 1 adalah native/default di banyak switch; penyerang mengeksploitasi perilaku default ini untuk VLAN hopping. User ditempatkan di VLAN data khusus.',
        },
        {
          q: 'Mengapa ID VLAN diberi jarak (10, 20, 30…) bukan berurutan (1, 2, 3…)?',
          options: [
            'Agar terlihat rapi',
            'Memberi ruang menyisipkan VLAN baru tanpa renumbering yang mahal',
            'Karena switch mewajibkan',
            'Agar lebih cepat',
          ],
          answer: 1,
          explain: 'Jarak ID memungkinkan VLAN baru (mis. 15, 25) disisipkan di antara yang ada tanpa mengubah ID yang sudah terpakai di banyak perangkat.',
        },
        {
          q: 'Apa output utama tahap VLAN design?',
          options: [
            'Konfigurasi switch yang sudah jadi',
            'Dokumen: tabel VLAN + penghuni + matriks akses antar VLAN sebagai acuan implementasi',
            'Kabel yang sudah terpasang',
            'Laporan keuangan',
          ],
          answer: 1,
          explain: 'Desain menghasilkan dokumen acuan — barulah teknisi mengimplementasikan tanpa menebak-nebak, dan hasilnya bisa diaudit.',
        },
      ],
    },
    {
      id: '20.2',
      title: 'IP Address Plan',
      body: `
<p><b>IP address plan</b> (rencana pengalamatan IP) memetakan setiap subnet ke fungsi dan mencadangkan blok untuk pertumbuhan. Tanpa IP plan, IP diberikan asal-asalan dan konflik/tumpang tindih tak terhindarkan.</p>
<h3>Aturan IP Plan Lab Ini</h3>
<ul>
<li><b>Gateway = .1</b> di setiap subnet (192.168.10.1, 192.168.20.1, dst.) — konsisten, mudah diingat, mudah di-troubleshoot.</li>
<li><b>.2–.20</b>: infrastruktur & device khusus (switch, AP, printer, kamera) — statis/reservation.</li>
<li><b>.21–.50</b>: server & layanan (file server, NVR, Zabbix, DHCP/DNS).</li>
<li><b>.100–.200</b>: pool DHCP untuk client dinamis.</li>
<li><b>.254</b>: cadangan untuk firewall/VRRP virtual IP bila diperlukan.</li>
</ul>
<h3>Tabel IP Plan</h3>
<div class="tblwrap"><table>
<tr><th>Subnet / VLAN</th><th>Gateway</th><th>Statis/Reserved</th><th>DHCP Pool</th></tr>
<tr><td>192.168.10.0/24 (CCTV)</td><td>.10.1</td><td>.10.21–.60 kamera, .30.11 NVR</td><td>tidak ada (kamera statis)</td></tr>
<tr><td>192.168.20.0/24 (OFFICE)</td><td>.20.1</td><td>.20.21 printer</td><td>.20.100–.200</td></tr>
<tr><td>192.168.30.0/24 (SERVER)</td><td>.30.1</td><td>.30.10 file, .30.11 NVR, .30.20 Zabbix, .30.21 DHCP/DNS</td><td>tidak ada</td></tr>
<tr><td>192.168.40.0/24 (GUEST)</td><td>.40.1</td><td>—</td><td>.40.100–.200 (lease 4 jam)</td></tr>
<tr><td>192.168.99.0/24 (MGMT)</td><td>.99.1</td><td>.99.2 core, .99.4 dist, .99.11–13 access, .99.254 FW</td><td>tidak ada</td></tr>
</table></div>
<h3>Hands-On: Membuat IP Plan</h3>
<h3>Topology</h3>
<p>Dokumen + spreadsheet sederhana (atau markdown table). Perangkat lab: 2 switch, 4 PC/VM untuk pengujian tiap VLAN.</p>
<h3>Objective</h3>
<p>Setiap perangkat di lab mendapat IP sesuai plan tanpa konflik; DHCP pool tidak tumpang tindih dengan IP statis.</p>
<h3>Configuration</h3>
<p>Tulis <code>ip-plan.md</code>: tabel di atas + kolom "owner" dan "catatan". Tandai blok yang <b>tidak boleh</b> dipakai DHCP (infrastruktur/server).</p>
<h3>Verification</h3>
<p>Simulasikan alokasi: daftarkan 10 perangkat fiktif ke tabel — pastikan tidak ada duplikat dan semua masuk blok yang benar.</p>
<h3>Failure Injection</h3>
<p>Masukkan satu duplikat: dua perangkat sama-sama 192.168.20.50.</p>
<h3>Troubleshooting</h3>
<p>Gejala duplikat IP: koneksi putus-sambung bergantian, ARP flapping. Cara temukan: <code>arp -a</code> menunjukkan MAC berubah-ubah untuk satu IP; log switch menunjukkan MAC flap antar port.</p>
<h3>Fix</h3>
<p>Berikan IP pengganti sesuai blok yang benar, update dokumen, dan tambahkan aturan: "IP statis wajib dicatat sebelum dipakai".</p>
<h3>Final Verification</h3>
<p>Tidak ada duplikat; setiap IP statis tercatat dengan owner; DHCP pool terpisah jelas dari blok statis.</p>`,
      terms: [
        ['IP address plan', 'Dokumen alokasi subnet dan blok IP per fungsi: gateway, statis, DHCP pool, cadangan.'],
        ['DHCP pool', 'Rentang IP yang boleh dibagikan otomatis oleh DHCP server.'],
        ['IP conflict', 'Dua perangkat memakai IP yang sama — menyebabkan koneksi putus-sambung.'],
        ['ARP flap', 'MAC address untuk satu IP berubah-ubah — gejala klasik IP duplikat.'],
      ],
      diagram: `<pre>        PEMBAGIAN BLOK DALAM SATU /24 (contoh VLAN 20)

192.168.20.0 ───────────────────────────────── 192.168.20.255
| .1 GW | .2-.20 infra | .21-.50 khusus | .100-.200 DHCP | .254 cadangan |
        ▲ jangan campur blok — DHCP pool TIDAK boleh
          menyentuh blok statis, atau konflik pasti terjadi.</pre>`,
      scenario:
        'Kantor menambah 30 kamera tanpa update IP plan — teknisi asal memberi IP dari pool DHCP office. Hasil: kamera berebut IP dengan laptop, rekaman putus-putus. Solusinya bukan beli NVR baru, melainkan menegakkan IP plan: kamera hanya di blok .10.21–.60.',
      bestPractices:
        'Satu IP plan untuk seluruh organisasi, disimpan di IPAM (Part 22.9). Aturan keras: tidak ada IP statis tanpa pencatatan; tidak ada DHCP pool yang menyentuh blok infrastruktur.',
      security:
        'IP plan yang rapi memudahkan deteksi anomali: IP tak dikenal di blok server = insiden. Tanpa plan, kamu bahkan tidak tahu apa yang "normal".',
      challenge:
        'Kantor tumbuh: butuh 300 IP office dalam 2 tahun. Opsi A: tetap 192.168.20.0/24 + VLAN baru; Opsi B: ubah ke /23. Analisis pro-kontra tiap opsi (renumbering, broadcast domain, DHCP) dan pilih satu dengan alasan.',
      interviewQ:
        'Q: "Bagaimana kamu mencegah konflik IP di jaringan dengan 500 perangkat?" — A: IP plan terdokumentasi (blok statis vs DHCP pool terpisah), DHCP untuk semua client dinamis, reservation untuk device khusus, dan monitoring yang alert saat IP duplikat terdeteksi (ARP flap).',
      quiz: [
        {
          q: 'Mengapa blok IP statis dan DHCP pool harus terpisah tegas?',
          options: [
            'Agar tabel terlihat rapi',
            'DHCP bisa memberikan IP yang sudah dipakai perangkat statis → konflik IP',
            'Karena aturan vendor',
            'Agar internet lebih cepat',
          ],
          answer: 1,
          explain: 'DHCP tidak tahu tentang IP statis manual; jika pool menyentuh blok statis, duplikat IP hampir pasti terjadi.',
        },
        {
          q: 'Gejala klasik duplikat IP adalah…',
          options: [
            'Internet menjadi lebih cepat',
            'Koneksi putus-sambung bergantian dan MAC address untuk satu IP berubah-ubah (ARP flap)',
            'Lampu switch mati total',
            'Tidak ada gejala sama sekali',
          ],
          answer: 1,
          explain: 'Dua perangkat berebut satu IP: ARP table berflap antara dua MAC, koneksi terputus bergantian — didiagnosis via arp -a dan log MAC flap.',
        },
        {
          q: 'Berapa IP yang lazim dijadikan gateway dan mengapa konsisten?',
          options: [
            '.100 — karena mudah diketik',
            '.1 — konvensi konsisten memudahkan dokumentasi, scripting, dan troubleshooting',
            '.254 — karena paling besar',
            'Acak tiap VLAN agar aman',
          ],
          answer: 1,
          explain: '.1 adalah konvensi umum; konsistensi berarti teknisi dan script monitoring tidak perlu menghafal pengecualian per VLAN.',
        },
      ],
    },
    {
      id: '20.3',
      title: 'VLAN 10 CCTV',
      body: `
<p>Sub-bab ini mengimplementasikan <b>VLAN 10 (CCTV, 192.168.10.0/24)</b> di switch lab — lengkap dengan siklus hands-on penuh yang menjadi pola untuk VLAN-VLAN berikutnya.</p>
<h3>Topology</h3>
<pre>[SW-1] ──trunk── [SW-2]
  | access VLAN 10        | access VLAN 10
[PC-A .10.50]        [PC-B .10.51]   (simulasi kamera/NVR)
Gateway: 192.168.10.1 (di L3 switch / router lab)</pre>
<h3>Objective</h3>
<p>PC-A dan PC-B (beda switch) saling ping dalam VLAN 10; tidak bisa ping ke VLAN lain (belum ada routing).</p>
<h3>Configuration</h3>
<p>Contoh di Cisco IOS (sesuaikan dengan platform lab — konsepnya sama di semua vendor):</p>
<pre>SW-1(config)# vlan 10
SW-1(config-vlan)# name CCTV
! ALASAN: membuat VLAN di database switch; 'name' agar konfigurasi
! bisa dibaca manusia — troubleshooting 3 bulan lagi berterima kasih.
SW-1(config)# interface range fa0/1 - 2
SW-1(config-if-range)# switchport mode access
SW-1(config-if-range)# switchport access vlan 10
! ALASAN: 'mode access' mengunci port sebagai access (bukan trunk otomatis
! via DTP — mencegah VLAN hopping); 'access vlan 10' menaruh port ke VLAN 10.
SW-1(config)# interface fa0/24
SW-1(config-if)# switchport mode trunk
SW-1(config-if)# switchport trunk allowed vlan 10,20,30,40,99
! ALASAN: trunk membawa banyak VLAN antar switch; 'allowed vlan' membatasi
! hanya VLAN yang dibutuhkan — trunk yang membawa "semua" adalah risiko keamanan.</pre>
<h3>Verification</h3>
<pre>SW-1# show vlan brief
! Harus tampil: VLAN 10 CCTV aktif, port fa0/1-2 terdaftar.
PC-A> ping 192.168.10.51   → Reply (satu broadcast domain ✓)
PC-A> ping 192.168.20.50   → Fail (beda VLAN, belum ada routing — WAJAR ✓)</pre>
<h3>Failure Injection</h3>
<p>Di SW-2, set port PC-B ke <b>VLAN 20</b> (salah VLAN — simulasi teknisi salah colok).</p>
<h3>Troubleshooting</h3>
<p>Gejala: PC-A tidak bisa ping PC-B. Diagnosis berlapis: (1) cek IP PC-B — benar di .10.x; (2) <code>show vlan brief</code> di SW-2 — port PC-B terdaftar di VLAN 20, bukan 10! Root cause: port salah VLAN, bukan masalah kabel/IP.</p>
<h3>Fix</h3>
<pre>SW-2(config-if)# switchport access vlan 10
! Kembalikan ke VLAN yang benar; catat di port map.</pre>
<h3>Final Verification</h3>
<p>Ping PC-A ↔ PC-B Reply kembali; <code>show vlan brief</code> konsisten di kedua switch; dokumentasikan port map.</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0"><code>switchport trunk allowed vlan none</code> atau menghapus VLAN yang sedang dipakai akan memutus traffic seketika. Di production, perubahan trunk/VLAN hanya di maintenance window dengan rollback plan (catat konfigurasi sebelumnya via <code>show run</code>).</p></div>`,
      terms: [
        ['switchport mode access', 'Perintah mengunci port sebagai access port (satu VLAN, untagged).'],
        ['switchport mode trunk', 'Perintah menjadikan port trunk (banyak VLAN bertag).'],
        ['allowed vlan', 'Daftar VLAN yang boleh lewat trunk — batasi hanya yang dibutuhkan.'],
        ['DTP', 'Dynamic Trunking Protocol — negosiasi trunk otomatis; dimatikan dengan mode access/trunk statis agar aman.'],
      ],
      diagram: `<pre>        HASIL AKHIR VLAN 10

[SW-1] ══════ trunk (allowed 10,20,30,40,99) ══════ [SW-2]
 fa0/1, fa0/2 = access VLAN 10              fa0/1 = access VLAN 10
 [PC-A .10.50]                              [PC-B .10.51]

Broadcast dari PC-A hanya sampai PC-B (satu broadcast domain).</pre>`,
      scenario:
        'Teknisi lapangan salah colok kabel kamera ke port VLAN office. Kamera dapat IP 192.168.20.x, NVR tidak menemukannya, dan stream kamera membebani VLAN user. Dengan port map + label, kesalahan ditemukan dalam 5 menit via show vlan brief.',
      bestPractices:
        'Selalu set switchport mode secara eksplisit (access/trunk) — jangan biarkan dynamic auto. Beri nama tiap VLAN. Label fisik port sesuai port map.',
      security:
        'Batasi allowed vlan di trunk; nonaktifkan DTP (mode statis). Port access yang tidak dipakai: shutdown. Ini menutup jalur VLAN hopping paling umum.',
      challenge:
        'Tanpa melihat catatan: dari output show vlan brief yang "rusak" (satu port di VLAN salah), tentukan port mana yang salah dan VLAN berapa seharusnya — hanya dari informasi IP PC dan port map. Latih pola pikir "percaya data, bukan tebakan".',
      interviewQ:
        'Q: "PC tidak bisa ping PC lain di VLAN yang sama, padahal IP benar. Apa yang kamu cek?" — A: Urutan: kabel/link (show interface status), VLAN port (show vlan brief — port beneran di VLAN itu?), trunk antar switch (allowed vlan mencakup VLAN itu?), lalu spanning-tree (port blocking?). IP benar tidak menjamin VLAN benar.',
      quiz: [
        {
          q: 'Mengapa switchport mode access/trunk diset eksplisit, bukan dynamic?',
          options: [
            'Agar konfigurasi lebih panjang',
            'Mencegah negosiasi trunk otomatis (DTP) yang bisa dieksploitasi untuk VLAN hopping',
            'Karena switch tidak mendukung dynamic',
            'Agar lebih cepat 1 detik',
          ],
          answer: 1,
          explain: 'Mode dynamic memungkinkan port berubah jadi trunk otomatis — celah klasik VLAN hopping. Mode statis mengunci perilaku port.',
        },
        {
          q: 'PC-A (VLAN 10) tidak bisa ping PC-B yang IP-nya benar di 192.168.10.x. Cek pertama yang paling tepat?',
          options: [
            'Ganti kabel langsung',
            'show vlan brief — pastikan port PC-B benar-benar di VLAN 10',
            'Restart seluruh switch',
            'Ganti IP PC-B',
          ],
          answer: 1,
          explain: 'IP benar tidak menjamin VLAN benar; port yang salah VLAN adalah penyebab umum dan dicek cepat via show vlan brief.',
        },
        {
          q: 'Fungsi switchport trunk allowed vlan adalah…',
          options: [
            'Mempercepat trunk',
            'Membatasi VLAN yang boleh lewat trunk — hanya yang dibutuhkan, demi keamanan dan kerapian',
            'Menambah VLAN baru',
            'Menghapus VLAN',
          ],
          answer: 1,
          explain: 'Trunk default membawa semua VLAN; membatasinya mencegah VLAN tak perlu (termasuk management) bocor ke switch yang tidak butuh.',
        },
      ],
    },
    {
      id: '20.4',
      title: 'VLAN 20 OFFICE',
      body: `
<p>Implementasi <b>VLAN 20 (OFFICE, 192.168.20.0/24)</b> — VLAN user utama dengan DHCP. Pola hands-on sama dengan 20.3, ditambah layanan DHCP.</p>
<h3>Topology</h3>
<pre>[SW-1] ──trunk── [SW-2]
  | access VLAN 20        | access VLAN 20
[PC-C .20.50]        [PC-D .20.51]   (simulasi PC karyawan)
[DHCP server .30.21] via routing (setelah 20.10) — untuk lab ini,
DHCP bisa dijalankan di router lab / L3 switch.</pre>
<h3>Objective</h3>
<p>PC-C/PC-D dapat IP otomatis via DHCP dari pool 192.168.20.100–200, saling ping, dan tetap terisolasi dari VLAN 10.</p>
<h3>Configuration</h3>
<pre>! Buat VLAN 20 di kedua switch (seperti 20.3):
SW-1(config)# vlan 20
SW-1(config-vlan)# name OFFICE
SW-1(config)# interface range fa0/3 - 4
SW-1(config-if-range)# switchport mode access
SW-1(config-if-range)# switchport access vlan 20
! Pastikan trunk sudah mengizinkan VLAN 20:
SW-1(config-if)# switchport trunk allowed vlan add 20
! ALASAN 'add': tanpa 'add', perintah menimpa daftar allowed vlan
! yang sudah ada — VLAN 10 ikut hilang! Ini common error klasik.

! DHCP pool di router/L3 lab (contoh Cisco):
R1(config)# ip dhcp pool OFFICE
R1(dhcp-config)# network 192.168.20.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.20.1
R1(dhcp-config)# dns-server 192.168.30.21
R1(dhcp-config)# lease 1
! ALASAN: 'network' = subnet yang dibagikan; 'default-router' = gateway
! yang diterima client (tanpa ini client buta arah keluar);
! 'dns-server' = agar nama bisa di-resolve (Part 22.2);
! 'lease 1' = 1 hari, seimbang untuk kantor (tamu pakai lease pendek).
R1(config)# ip dhcp excluded-address 192.168.20.1 192.168.20.50
! ALASAN: lindungi blok statis/infrastruktur agar DHCP tidak
! membagikan IP yang sudah dipakai perangkat statis.</pre>
<h3>Verification</h3>
<pre>PC-C> ipconfig /renew → dapat 192.168.20.100, gateway .20.1 ✓
PC-C> ping 192.168.20.51 ✓   (satu VLAN)
PC-C> ping 192.168.10.50 → Fail ✓ (isolasi VLAN, belum ada routing)
R1# show ip dhcp binding → terlihat MAC–IP tiap client.</pre>
<h3>Failure Injection</h3>
<p>Hapus <code>ip dhcp excluded-address</code> lalu set printer statis di 192.168.20.105 (di dalam pool).</p>
<h3>Troubleshooting</h3>
<p>Gejala: printer kadang tidak bisa diakses bergantian dengan laptop. Diagnosis: DHCP memberikan .105 ke laptop → konflik dengan printer statis. Bukti: <code>show ip dhcp binding</code> menampilkan .105 terikat ke MAC laptop; ARP flap di switch.</p>
<h3>Fix</h3>
<p>Kembalikan excluded-address, pindahkan printer ke blok reservation (.20.21 sesuai IP plan), <code>clear ip dhcp binding *</code> untuk membersihkan, renew ulang client.</p>
<h3>Final Verification</h3>
<p>Semua client dapat IP dari pool yang benar; tidak ada IP pool yang duplikat dengan perangkat statis; binding tercatat rapi.</p>`,
      terms: [
        ['DHCP pool', 'Rentang IP yang dibagikan otomatis beserta gateway, DNS, dan lease time.'],
        ['excluded-address', 'IP yang dikecualikan dari pool DHCP — untuk perangkat statis.'],
        ['lease time', 'Lama sewa IP DHCP; pendek untuk tamu, 1 hari untuk kantor.'],
        ['default-router', 'Opsi DHCP yang memberi tahu client siapa gateway-nya.'],
      ],
      diagram: `<pre>        VLAN 20 + DHCP

[PC-C]──┐ access VLAN 20
[PC-D]──┴─▶ [SW-1] ══trunk══ [SW-2] ──▶ (ke router/L3)
                                                │
                                    DHCP pool .20.100–200
                                    gateway .20.1, DNS .30.21
                                    excluded: .20.1–.20.50

Client: IP otomatis. Printer: reservation di .20.21.</pre>`,
      scenario:
        'Senin pagi 50 laptop menyala bersamaan dan berebut IP — beberapa dapat APIPA (169.254.x.x, Part 05). Penyebab: pool DHCP kekecilan + lease 7 hari menahan IP laptop yang sudah pulang. Solusi: perbesar pool, turunkan lease ke 1 hari.',
      bestPractices:
        'Selalu exclude blok infrastruktur sebelum mengaktifkan pool. Lease 1 hari untuk office, 4 jam untuk guest. Monitor utilisasi pool (alert di 80%).',
      security:
        'Aktifkan DHCP snooping di access switch agar hanya port ke DHCP server resmi yang boleh menjawab DHCP — mencegah rogue DHCP server dari laptop iseng.',
      challenge:
        'Rogue DHCP: laptop user menjalankan DHCP server nakal. Gejala apa yang muncul di 10 PC? Bagaimana DHCP snooping menghentikannya? Tulis langkah diagnosis + konfigurasinya.',
      interviewQ:
        'Q: "Apa fungsi ip dhcp excluded-address dan apa akibatnya jika lupa?" — A: Mengecualikan IP statis/infrastruktur dari pool. Jika lupa, DHCP bisa membagikan IP yang sudah dipakai perangkat statis → konflik IP, koneksi putus-sambung, ARP flap.',
      quiz: [
        {
          q: 'Apa akibat lupa perintah switchport trunk allowed vlan add 20 (tanpa add)?',
          options: [
            'Tidak ada efek',
            'Daftar allowed vlan TERTIMPA — VLAN yang sudah ada (mis. 10) ikut hilang dari trunk',
            'Switch restart',
            'VLAN 20 terhapus',
          ],
          answer: 1,
          explain: 'Tanpa kata kunci add, perintah mengganti seluruh daftar allowed vlan — kesalahan klasik yang memutus VLAN lain seketika.',
        },
        {
          q: 'Mengapa opsi default-router wajib di DHCP pool?',
          options: [
            'Agar IP lebih cepat didapat',
            'Tanpa gateway, client hanya bisa komunikasi dalam subnet-nya — buta arah ke VLAN lain/internet',
            'Agar DNS bekerja',
            'Tidak wajib, hanya hiasan',
          ],
          answer: 1,
          explain: 'Default gateway adalah "pintu keluar" subnet; DHCP harus memberikannya atau client terisolasi di subnet sendiri.',
        },
        {
          q: 'Bagaimana DHCP snooping mencegah rogue DHCP server?',
          options: [
            'Dengan mempercepat DHCP',
            'Hanya port terpercaya (ke DHCP server resmi) yang boleh mengirim penawaran DHCP; port user yang mencoba diblokir',
            'Dengan mengenkripsi DHCP',
            'Dengan mematikan DHCP',
          ],
          answer: 1,
          explain: 'DHCP snooping mengklasifikasikan port: trusted (ke server resmi) vs untrusted (user). OFFER DHCP dari port untrusted langsung di-drop.',
        },
      ],
    },
    {
      id: '20.5',
      title: 'VLAN 30 SERVER',
      body: `
<p>Implementasi <b>VLAN 30 (SERVER, 192.168.30.0/24)</b> — segmen server dengan IP statis dan aturan akses ketat. Server tidak memakai DHCP (kecuali reservation) agar alamatnya permanen.</p>
<h3>Topology</h3>
<pre>[SW-1] ──trunk── [SW-2]
  | access VLAN 30
[SRV-A .30.10] (simulasi file server)
[SRV-B .30.11] (simulasi NVR)
Gateway .30.1 di L3 (setelah 20.10)</pre>
<h3>Objective</h3>
<p>Server-server saling ping di VLAN 30 dengan IP statis; terisolasi dari VLAN 10/20 sampai routing+ACL dikonfigurasi (20.10–20.11).</p>
<h3>Configuration</h3>
<pre>! VLAN di switch (pola sama):
SW-1(config)# vlan 30
SW-1(config-vlan)# name SERVER
SW-1(config)# interface range fa0/5 - 6
SW-1(config-if-range)# switchport mode access
SW-1(config-if-range)# switchport access vlan 30

! IP statis di server (contoh Linux):
# ip addr add 192.168.30.10/24 dev eth0
# ip route add default via 192.168.30.1
! ALASAN: server harus deterministik — IP-nya dirujuk DNS, firewall,
! dan monitoring. DHCP (yang bisa berubah) dilarang untuk server.
! 'default via' = gateway agar server bisa membalas lintas VLAN.</pre>
<h3>Verification</h3>
<pre>SRV-A> ping 192.168.30.11 ✓
SRV-A> ping 192.168.20.50 → Fail ✓ (isolasi, wajar sebelum routing)
Catat di ip-plan.md: .30.10 = FILE-SRV-01, .30.11 = NVR-01.</pre>
<h3>Failure Injection</h3>
<p>Set gateway SRV-A ke <b>192.168.30.99</b> (salah — simulasi typo).</p>
<h3>Troubleshooting</h3>
<p>Gejala khas: ping sesama VLAN 30 OK, tapi tidak bisa dijangkau dari VLAN lain <i>setelah</i> routing aktif — atau sebaliknya server tidak bisa membalas keluar. Diagnosis: <code>ip route</code> menunjukkan default via .99 yang tidak ada. Kesimpulan: gateway salah, bukan masalah VLAN/firewall.</p>
<h3>Fix</h3>
<p>Perbaiki gateway ke 192.168.30.1; verifikasi dengan ping ke gateway dan ke IP lintas VLAN (setelah 20.10).</p>
<h3>Final Verification</h3>
<p>IP statis sesuai ip-plan.md; gateway benar; konektivitas intra-VLAN OK; dokumentasi server terisi (nama, fungsi, IP, port layanan).</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, server adalah VM biasa. Di production, server farm punya switch tersendiri, dual power, dan dual NIC (teaming) ke dua switch berbeda. Prinsipnya sama: IP statis + dokumentasi + akses terbatas.</p></div>`,
      terms: [
        ['IP statis', 'IP manual permanen — wajib untuk server, gateway, dan infrastruktur.'],
        ['Server farm', 'Area/rak khusus server dengan switch tersendiri.'],
        ['NIC teaming', 'Dua kartu jaringan digabung untuk redundansi/throughput (production).'],
      ],
      diagram: `<pre>        VLAN 30 SERVER

[SRV-A .30.10 FILE] ─┐ access VLAN 30
[SRV-B .30.11 NVR ] ─┴─▶ [SW-1] ══trunk══ [SW-2]
                                   │
                        (routing + ACL di 20.10/20.11)

Semua IP statis & terdokumentasi. Tanpa DHCP di VLAN ini.</pre>`,
      scenario:
        'File server pindah IP karena "tadi DHCP-nya nyala" — akibatnya 100 user kehilangan mapped drive dan tiket membanjir. Akar masalah: server tidak boleh DHCP. Setelah di-statis-kan + dicatat di IPAM, insiden serupa tidak pernah terulang.',
      bestPractices:
        'Setiap server: hostname jelas, IP statis, entri DNS, dan baris di dokumentasi (fungsi, owner, port). Tidak ada "server misterius" di VLAN 30.',
      security:
        'Bahkan sebelum firewall antar VLAN, server sudah harus hardening: update OS, matikan layanan tak perlu, password kuat. VLAN isolasi bukan pengganti hardening server.',
      challenge:
        'Server butuh diakses dari VLAN 20 via HTTPS saja. Tulis (konsep) ACL di distribution: source, destination, port, action — dan jelaskan mengapa tidak membuka "all ports".',
      interviewQ:
        'Q: "Mengapa server tidak boleh memakai DHCP dinamis?" — A: Karena IP server dirujuk oleh DNS, firewall rules, dan monitoring — IP yang berubah merusak semuanya. Pengecualian: DHCP reservation yang menjamin IP tetap sama.',
      quiz: [
        {
          q: 'Gejala: server bisa ping sesama VLAN tapi tidak bisa dijangkau lintas VLAN (routing sudah OK). Penyebab paling mungkin?',
          options: [
            'Kabel server putus',
            'Default gateway di server salah/typo',
            'VLAN ID salah',
            'Switch rusak',
          ],
          answer: 1,
          explain: 'Intra-VLAN OK = Layer 1–2 beres; gagal lintas VLAN dengan routing OK mengarah ke gateway di sisi server yang salah.',
        },
        {
          q: 'Mengapa VLAN server tidak memakai DHCP pool dinamis?',
          options: [
            'DHCP terlalu lambat untuk server',
            'IP server dirujuk DNS/firewall/monitoring — harus permanen dan terdokumentasi',
            'Server tidak mendukung DHCP',
            'Menghemat lisensi DHCP',
          ],
          answer: 1,
          explain: 'Semua referensi ke server menunjuk IP-nya; perubahan IP merusak DNS, ACL, dan monitoring sekaligus.',
        },
        {
          q: 'Apa yang wajib dicatat untuk tiap server di dokumentasi?',
          options: [
            'Warna casing server',
            'Hostname, IP statis, fungsi, owner, dan port layanan yang dibuka',
            'Harga beli server',
            'Nama teknisi yang merakit',
          ],
          answer: 1,
          explain: 'Dokumentasi operasional menjawab: apa ini, di mana, milik siapa, dan boleh diakses via apa — dasar troubleshooting dan audit.',
        },
      ],
    },
    {
      id: '20.6',
      title: 'VLAN 40 GUEST',
      body: `
<p>Implementasi <b>VLAN 40 (GUEST, 192.168.40.0/24)</b> — segmen tamu dengan DHCP lease pendek dan isolasi ketat. Di lab disimulasikan dengan PC kabel; di production ini SSID Wi-Fi tamu.</p>
<h3>Topology</h3>
<pre>[SW-1] ──trunk── [SW-2]
  | access VLAN 40        | access VLAN 40
[PC-E .40.100]        [PC-F .40.101]  (simulasi HP tamu)
DHCP pool .40.100–200, lease 4 jam</pre>
<h3>Objective</h3>
<p>Client guest dapat IP otomatis, saling ping (atau dibatasi client isolation), dan <b>tidak bisa</b> mencapai VLAN 10/20/30/99 — hanya internet (setelah 20.10–20.11).</p>
<h3>Configuration</h3>
<pre>SW-1(config)# vlan 40
SW-1(config-vlan)# name GUEST
SW-1(config)# interface range fa0/7 - 8
SW-1(config-if-range)# switchport mode access
SW-1(config-if-range)# switchport access vlan 40

! DHCP pool guest — lease pendek:
R1(config)# ip dhcp pool GUEST
R1(dhcp-config)# network 192.168.40.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.40.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 0 4
! ALASAN 'lease 0 4' = 0 hari 4 jam: tamu berganti cepat; lease pendek
! mendaur ulang IP. DNS publik (bukan DNS internal!) agar tamu tidak
! bisa mengintip nama-nama server internal via DNS.</pre>
<h3>Verification</h3>
<pre>PC-E> ipconfig → 192.168.40.100, gateway .40.1, DNS 8.8.8.8 ✓
PC-E> ping 192.168.40.101 ✓
PC-E> ping 192.168.20.50 → Fail ✓ (isolasi)</pre>
<h3>Failure Injection</h3>
<p>Set DNS guest ke <b>DNS internal</b> 192.168.30.21 (salah desain).</p>
<h3>Troubleshooting</h3>
<p>Gejala: tamu bisa resolve <code>erp.kantor.lan</code> → 192.168.30.10 — informasi internal bocor walau ACL memblokir aksesnya. Ini <b>kebocoran informasi</b>, bukan sekadar gangguan. Diagnosis: cek opsi DNS di pool DHCP guest.</p>
<h3>Fix</h3>
<p>Kembalikan DNS guest ke publik (8.8.8.8 / 1.1.1.1); tambahkan catatan desain: "guest tidak boleh memakai layanan internal apa pun, termasuk DNS".</p>
<h3>Final Verification</h3>
<p>Client guest: IP dari pool benar, DNS publik, tidak bisa resolve nama internal, tidak bisa ping VLAN internal.</p>`,
      terms: [
        ['Captive portal', 'Halaman syarat/login sebelum Wi-Fi tamu aktif (production).'],
        ['Client isolation', 'Larangan komunikasi antar client di segmen guest.'],
        ['Kebocoran informasi', 'Informasi internal (nama server, IP) yang bisa diakses pihak tak berhak.'],
      ],
      diagram: `<pre>        VLAN 40 GUEST

[PC-E]──┐ access VLAN 40, DHCP lease 4 jam
[PC-F]──┴─▶ [SW-1] ══trunk══ [SW-2]
                        │
              DNS publik (8.8.8.8) — BUKAN DNS internal
              Isolasi total dari VLAN 10/20/30/99</pre>`,
      scenario:
        'Audit keamanan menemukan tamu bisa melihat daftar nama server internal via DNS — padahal aksesnya sudah diblokir firewall. Akar masalah: DHCP guest menunjuk ke DNS internal. Pelajaran: isolasi bukan hanya soal IP, tapi juga layanan (DNS, dll).',
      bestPractices:
        'Guest = nol layanan internal: DNS publik, tanpa akses file/printer internal, captive portal + logging di production. Review konfigurasi guest tiap ada perubahan DNS/DHCP.',
      security:
        'DNS internal adalah peta jaringan. Memberikannya ke guest sama dengan memberikan peta markas ke tamu. Selalu pisahkan layanan untuk zona untrusted.',
      challenge:
        'Tamu butuh cetak dokumen ke printer kantor. Apakah boleh membuka akses VLAN 40 → printer VLAN 20? Analisis risiko dan tawarkan 2 alternatif yang lebih aman.',
      interviewQ:
        'Q: "Tamu tidak bisa akses server tapi bisa melihat nama-nama server internal. Apa masalahnya?" — A: Kebocoran informasi via DNS — DHCP guest menunjuk ke DNS internal. Solusi: DNS publik untuk guest + pastikan zona DNS internal tidak bisa di-query dari VLAN 40.',
      quiz: [
        {
          q: 'Mengapa DHCP guest memakai DNS publik, bukan DNS internal?',
          options: [
            'DNS publik lebih cepat selalu',
            'Mencegah tamu mengintip nama/IP server internal (kebocoran informasi)',
            'DNS internal tidak mendukung tamu',
            'Agar hemat lisensi',
          ],
          answer: 1,
          explain: 'DNS internal adalah peta jaringan; memberikannya ke zona untrusted membocorkan struktur internal walau akses IP-nya diblokir.',
        },
        {
          q: 'Mengapa lease DHCP guest pendek (±4 jam)?',
          options: [
            'Agar tamu tidak betah',
            'Tamu berganti cepat — lease pendek mendaur ulang IP pool yang terbatas',
            'Mempercepat internet',
            'Aturan ISP',
          ],
          answer: 1,
          explain: 'Pool /24 terbatas; ratusan tamu bergantian — lease pendek mengembalikan IP tak terpakai ke pool.',
        },
        {
          q: 'Client guest bisa ping sesama guest tapi tidak bisa ping ke VLAN 20. Ini…',
          options: [
            'Kerusakan yang harus diperbaiki',
            'Perilaku yang BENAR — isolasi guest dari segmen internal',
            'Tanda DHCP rusak',
            'Tanda kabel putus',
          ],
          answer: 1,
          explain: 'Isolasi total dari VLAN internal adalah desain yang disengaja untuk zona untrusted — bukan gangguan.',
        },
      ],
    },
    {
      id: '20.7',
      title: 'VLAN 99 MANAGEMENT',
      body: `
<p>Implementasi <b>VLAN 99 (MANAGEMENT, 192.168.99.0/24)</b> — "jalan belakang" admin untuk SSH/SNMP/syslog ke perangkat. Di lab, beri tiap switch IP management agar bisa di-remote.</p>
<h3>Topology</h3>
<pre>[PC-Admin .99.100] ──▶ [SW-1 .99.11] ══trunk══ [SW-2 .99.12]
VLAN 99 ada di semua switch + trunk; hanya PC admin yang boleh masuk.</pre>
<h3>Objective</h3>
<p>PC admin bisa SSH ke kedua switch via VLAN 99; PC user (VLAN 20) <b>tidak bisa</b> ping/SSH ke IP management.</p>
<h3>Configuration</h3>
<pre>! Buat VLAN 99 dan interface management (SVI) di tiap switch:
SW-1(config)# vlan 99
SW-1(config-vlan)# name MANAGEMENT
SW-1(config)# interface vlan 99
SW-1(config-if)# ip address 192.168.99.11 255.255.255.0
SW-1(config-if)# no shutdown
! ALASAN: 'interface vlan 99' (SVI) memberi switch alamat IP di VLAN 99
! sehingga switch bisa di-manage via IP. Tanpa SVI, switch hanya
! bisa dikonfigurasi via kabel console fisik.
SW-1(config)# ip default-gateway 192.168.99.1
! ALASAN: switch L2 butuh gateway agar bisa dijangkau dari subnet lain
! (mis. admin di site lain). Tanpa ini, SSH lintas subnet gagal.

! Amankan akses: hanya SSH, bukan telnet:
SW-1(config)# line vty 0 4
SW-1(config-line)# transport input ssh
SW-1(config-line)# login local
! ALASAN: 'transport input ssh' mematikan telnet (password telnet
! lewat jaringan dalam bentuk teks biasa — bisa disadap!). SSH mengenkripsi.
! Di production: tambah ACL 'access-class' agar hanya IP admin boleh SSH.</pre>
<h3>Verification</h3>
<pre>PC-Admin> ssh admin@192.168.99.11 ✓ ; ssh admin@192.168.99.12 ✓
PC user (VLAN 20)> ping 192.168.99.11 → Fail ✓ (isolasi, ditegakkan di 20.11)
SW-1# show ip interface brief → Vlan99 up/up ✓</pre>
<h3>Failure Injection</h3>
<p>Matikan SVI: <code>shutdown</code> pada interface vlan 99 di SW-2.</p>
<h3>Troubleshooting</h3>
<p>Gejala: SSH ke SW-2 gagal, tapi traffic user lewat SW-2 normal. Diagnosis: bedakan <b>management plane</b> vs <b>data plane</b> — switch tetap switching (data plane OK) tapi tidak bisa di-manage (management plane down). Cek via console: <code>show ip interface brief</code> → Vlan99 administratively down. Ini bukan "switch rusak".</p>
<h3>Fix</h3>
<p><code>no shutdown</code> di interface vlan 99; verifikasi SSH kembali.</p>
<h3>Final Verification</h3>
<p>SSH dari PC admin ke semua switch OK; user tidak bisa mencapai VLAN 99; tiap switch punya IP management sesuai ip-plan.md.</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0">Mengubah/mematikan SVI management atau ACL yang salah bisa <b>mengunci diri sendiri</b> (lockout) — tidak bisa SSH lagi dan harus datang via console fisik. Di production: selalu punya akses console (kabel + terminal server) sebelum mengubah akses management.</p></div>`,
      terms: [
        ['SVI', 'Switch Virtual Interface — interface logis (interface vlan X) yang memberi IP ke switch.'],
        ['Management plane', 'Fungsi pengelolaan perangkat (SSH, SNMP) — beda dari data plane (forwarding traffic).'],
        ['Data plane', 'Fungsi penerusan traffic user — bisa normal walau management plane down.'],
        ['Lockout', 'Terkunci dari akses remote akibat konfigurasi akses yang salah.'],
      ],
      diagram: `<pre>        VLAN 99 MANAGEMENT

[PC-Admin .99.100] ──SSH──▶ [SW-1 .99.11] ══trunk (VLAN 99)══ [SW-2 .99.12]
                                    │
                        SVI: interface vlan 99 + IP
                        Hanya SSH (telnet dimatikan)
                        User VLAN 10/20/30/40: DITOLAK</pre>`,
      scenario:
        'Engineer mengubah ACL management dari remote dan salah — SSH putus, tidak bisa masuk lagi. Beruntung ada kabel console terpasang ke terminal server; ia perbaiki via console dalam 10 menit. Tanpa akses console, ia harus drive 2 jam ke site. Pelajaran: jangan ubah akses management tanpa jalur cadangan.',
      bestPractices:
        'Selalu pastikan akses console fisik/terminal server sebelum mengubah konfigurasi management. Uji perubahan akses dari sesi kedua sebelum menutup sesi pertama.',
      security:
        'Matikan telnet di semua perangkat (transport input ssh). Batasi SSH hanya dari IP admin (access-class). Ganti password default — ini serangan paling umum ke perangkat jaringan.',
      challenge:
        'Rancang skema agar 3 site (masing-masing punya VLAN 99 lokal) bisa di-manage dari NOC pusat: apakah VLAN 99 di-stretch antar site atau di-routing? Analisis pro-kontra (broadcast domain, keamanan, kompleksitas).',
      interviewQ:
        'Q: "Switch tetap meneruskan traffic tapi tidak bisa di-SSH. Apa yang terjadi?" — A: Management plane down tapi data plane OK — mis. SVI shutdown, ACL salah, atau SSH service mati. Switch-nya "sehat" sebagai forwarder; yang rusak hanya jalur pengelolaannya. Cek via console.',
      quiz: [
        {
          q: 'Apa fungsi SVI (interface vlan 99) di switch?',
          options: [
            'Menambah kecepatan switching',
            'Memberi alamat IP ke switch agar bisa di-manage via jaringan (SSH/SNMP)',
            'Menghubungkan ke internet',
            'Menyimpan konfigurasi',
          ],
          answer: 1,
          explain: 'Switch L2 tanpa IP tidak bisa dijangkau via jaringan; SVI memberinya IP management di VLAN 99.',
        },
        {
          q: 'Mengapa telnet dimatikan dan diganti SSH untuk akses perangkat?',
          options: [
            'Telnet lebih lambat',
            'Telnet mengirim password dalam teks biasa yang bisa disadap; SSH terenkripsi',
            'Telnet tidak ada di switch baru',
            'SSH lebih murah',
          ],
          answer: 1,
          explain: 'Credential telnet (termasuk password enable) lewat jaringan tanpa enkripsi — penyadap di jalur yang sama bisa mencurinya.',
        },
        {
          q: 'Sebelum mengubah konfigurasi akses management via remote, apa yang wajib disiapkan?',
          options: [
            'Tidak perlu apa-apa',
            'Jalur cadangan: akses console fisik/terminal server, karena salah konfigurasi = lockout',
            'Restart switch dulu',
            'Mematikan semua user',
          ],
          answer: 1,
          explain: 'Kesalahan ACL/SSH bisa mengunci diri sendiri dari remote; console fisik adalah jalan kembali yang tidak tergantung konfigurasi yang diubah.',
        },
      ],
    },
    {
      id: '20.8',
      title: 'Trunk',
      body: `
<p><b>Trunk</b> adalah link yang membawa <b>banyak VLAN sekaligus</b> antar switch (atau switch–router–AP). Tanpa trunk, tiap VLAN butuh kabel fisik sendiri — mustahil untuk 5 VLAN.</p>
<h3>Cara Kerja Teknis: 802.1Q Tagging</h3>
<p>Standar <b>IEEE 802.1Q</b>: saat frame keluar port trunk, switch <b>menyisipkan tag 4 byte</b> berisi VLAN ID ke header Ethernet. Switch penerima membaca tag, melepasnya, lalu meneruskan ke port access VLAN yang sesuai. Analogi: amplop diberi stiker kode pos (VLAN ID) agar sampai ke "kota" yang benar.</p>
<h3>Native VLAN</h3>
<p>Satu VLAN di trunk bisa dijadikan <b>native</b> — traffic-nya lewat <b>tanpa tag</b> (untuk kompatibilitas perangkat lama). <b>Default native = VLAN 1.</b> Best practice keamanan: set native ke VLAN khusus yang tidak dipakai (mis. 999) dan pastikan sama di kedua ujung — mismatch native VLAN menyebabkan traffic bocor ke VLAN yang salah.</p>
<h3>Hands-On: Trunk Antar Switch</h3>
<h3>Topology</h3>
<pre>[SW-1] ════════ trunk fa0/24 ════════ [SW-2]
VLAN 10,20,30,40,99 harus lewat trunk ini.</pre>
<h3>Objective</h3>
<p>Semua VLAN yang sudah dibuat bisa berkomunikasi antar switch; native VLAN disamakan dan aman.</p>
<h3>Configuration</h3>
<pre>! Di KEDUA switch (kedua ujung harus konsisten!):
SW(config)# interface fa0/24
SW(config-if)# switchport mode trunk
SW(config-if)# switchport trunk native vlan 999
SW(config-if)# switchport trunk allowed vlan 10,20,30,40,99
! ALASAN per baris:
! - 'mode trunk': kunci sebagai trunk (matikan DTP).
! - 'native vlan 999': pindahkan native dari default VLAN 1 ke VLAN
!   tak terpakai — menutup celah VLAN hopping via native VLAN.
! - 'allowed vlan': hanya 5 VLAN desain yang boleh lewat.</pre>
<h3>Verification</h3>
<pre>SW# show interfaces trunk
! Harus tampil: fa0/24 trunking, native 999, allowed & active:
! 10,20,30,40,99 di KEDUA switch.
PC-A (VLAN10 di SW-1) ping PC-B (VLAN10 di SW-2) ✓</pre>
<h3>Failure Injection</h3>
<p>Di SW-2 set <code>switchport trunk native vlan 1</code> (mismatch dengan SW-1 yang 999).</p>
<h3>Troubleshooting</h3>
<p>Gejala: aneh — sebagian traffic "bocor"/tidak sampai; log menampilkan <b>native VLAN mismatch</b> (CDP warning). Diagnosis: <code>show interfaces trunk</code> bandingkan native di kedua ujung → beda! Root cause: native tidak konsisten. Pelajaran: trunk adalah <b>kontrak dua ujung</b> — konfigurasi harus cerminan.</p>
<h3>Fix</h3>
<p>Samakan native vlan 999 di SW-2; verifikasi warning hilang dan traffic normal.</p>
<h3>Final Verification</h3>
<p><code>show interfaces trunk</code> identik di kedua ujung (mode, native, allowed, active); semua VLAN antar switch saling ping intra-VLAN.</p>`,
      terms: [
        ['Trunk', 'Link yang membawa banyak VLAN antar perangkat via tagging 802.1Q.'],
        ['802.1Q', 'Standar tagging VLAN: sisipan 4 byte berisi VLAN ID di frame Ethernet.'],
        ['Native VLAN', 'VLAN yang lewat trunk tanpa tag; wajib sama di kedua ujung.'],
        ['Tagging', 'Pemberian label VLAN ID pada frame yang lewat trunk.'],
      ],
      diagram: `<pre>        TRUNK 802.1Q

[SW-1] ═══════════════════════ [SW-2]
        fa0/24 ←── trunk ──→ fa0/24
        Frame VLAN 10 → [tag:10][data] →
        Frame VLAN 20 → [tag:20][data] →
        Native 999 → [data] (tanpa tag)

Kontrak dua ujung: mode, native, allowed HARUS sama.</pre>`,
      scenario:
        'Setelah ganti switch, user VLAN 20 di gedung B tidak bisa ke server. Ternyata trunk baru ke distribution lupa di-allow VLAN 20 (allowed vlan tidak mencakup 20). Satu baris konfigurasi, satu gedung lumpuh — show interfaces trunk menemukannya dalam 2 menit.',
      bestPractices:
        'Dokumentasikan setiap trunk (ujung A–B, allowed VLAN, native). Verifikasi dengan show interfaces trunk di kedua sisi setiap selesai konfigurasi. Jangan biarkan native VLAN default (1).',
      security:
        'Trunk yang membawa "semua VLAN" + native default adalah konfigurasi paling berisiko di switch. Batasi allowed vlan dan pindahkan native — dua baris yang menutup banyak celah.',
      challenge:
        'AP dengan 2 SSID (Office=VLAN 20, Guest=VLAN 40) terhubung ke switch. Rancang konfigurasi port AP tersebut (mode? allowed? native?) dan jelaskan mengapa bukan access port.',
      interviewQ:
        'Q: "Apa itu native VLAN dan apa risikonya jika mismatch?" — A: VLAN yang lewat trunk tanpa tag (default VLAN 1). Jika beda di kedua ujung, traffic untagged masuk ke VLAN yang salah — kebocoran antar VLAN + warning CDP. Solusi: samakan di kedua ujung, idealnya ke VLAN tak terpakai.',
      quiz: [
        {
          q: 'Apa yang dilakukan tagging 802.1Q di trunk?',
          options: [
            'Mengenkripsi seluruh frame',
            'Menyisipkan VLAN ID (4 byte) ke frame agar switch penerima tahu VLAN tujuannya',
            'Mempercepat pengiriman frame',
            'Mengompresi data',
          ],
          answer: 1,
          explain: 'Tag 802.1Q adalah "stiker" VLAN ID pada frame — memungkinkan satu kabel fisik membawa banyak VLAN.',
        },
        {
          q: 'Mengapa native VLAN sebaiknya dipindah dari default VLAN 1?',
          options: [
            'VLAN 1 terlalu lambat',
            'Menutup celah VLAN hopping yang mengeksploitasi perilaku default/native',
            'Agar hemat ID VLAN',
            'Karena VLAN 1 tidak bisa di-trunk',
          ],
          answer: 1,
          explain: 'Penyerang menargetkan perilaku default; memindahkan native ke VLAN tak terpakai menghilangkan target empuk itu.',
        },
        {
          q: 'Trunk adalah "kontrak dua ujung". Artinya…',
          options: [
            'Butuh dua kabel fisik',
            'Mode, native VLAN, dan allowed VLAN harus konsisten di kedua sisi — mismatch menyebabkan gangguan',
            'Hanya bisa antar switch Cisco',
            'Harus dikonfigurasi dua kali sehari',
          ],
          answer: 1,
          explain: 'Trunk melibatkan dua perangkat; perbedaan native/allowed di satu sisi menimbulkan mismatch, traffic bocor, atau VLAN tidak lewat.',
        },
      ],
    },
    {
      id: '20.9',
      title: 'Access Port',
      body: `
<p><b>Access port</b> adalah port untuk <b>endpoint</b>: satu port, satu VLAN, tanpa tag. Sederhana — tapi justru di sinilah kesalahan "salah colok, salah VLAN" paling sering terjadi.</p>
<h3>Cara Kerja</h3>
<p>Frame masuk dari PC (tanpa tag) → switch memberi label internal VLAN ID → diteruskan sesuai VLAN. Frame keluar ke PC → tag dilepas (PC tidak paham VLAN). PC tidak pernah tahu ia di VLAN 20 — ia hanya tahu IP-nya 192.168.20.x.</p>
<h3>Port Security (Pengaman Access Port)</h3>
<pre>SW(config)# interface fa0/3
SW(config-if)# switchport port-security
SW(config-if)# switchport port-security maximum 2
SW(config-if)# switchport port-security violation restrict
SW(config-if)# switchport port-security mac-address sticky
! ALASAN per baris:
! - aktifkan port-security: batasi MAC yang boleh lewat port ini.
! - 'maximum 2': toleransi 2 MAC (PC + telepon IP di belakangnya).
! - 'violation restrict': jika dilanggar, drop paket berlebih + catat log
!   (bukan 'shutdown' yang mematikan port — pilih sesuai kebijakan).
! - 'sticky': MAC yang pertama terlihat "ditempel" otomatis — praktis,
!   tidak perlu ketik MAC manual satu per satu.</pre>
<h3>Hands-On: Audit Access Port</h3>
<h3>Topology</h3>
<p>Semua access port di SW-1/SW-2 (fa0/1–8) yang sudah dikonfigurasi di 20.3–20.7.</p>
<h3>Objective</h3>
<p>Setiap access port: mode access eksplisit, VLAN benar sesuai port map, port tak terpakai shutdown, port user penting dilindungi port-security.</p>
<h3>Configuration</h3>
<p>Terapkan port-security di port user (fa0/3–4, VLAN 20); shutdown port yang kosong:</p>
<pre>SW(config)# interface range fa0/9 - 24
SW(config-if-range)# shutdown
SW(config-if-range)# description UNUSED-SHUTDOWN
! ALASAN: port aktif yang kosong = pintu masuk gratis. Shutdown +
! description jelas memudahkan audit ("port ini memang sengaja mati").</pre>
<h3>Verification</h3>
<pre>SW# show port-security interface fa0/3 → SecureUp, max 2 ✓
SW# show interfaces status | include disabled → port 9-24 disabled ✓
Bandingkan dengan port map dokumen — harus 100% cocok.</pre>
<h3>Failure Injection</h3>
<p>Colokkan "switch liar" (atau PC kedua) ke port fa0/3 yang maximum-nya 2 sehingga total 3 MAC.</p>
<h3>Troubleshooting</h3>
<p>Gejala: perangkat ketiga tidak dapat jaringan; log: <code>%PORT_SECURITY-2-PSECURE_VIOLATION</code>. Diagnosis: violation restrict mendrop MAC ketiga — <b>fitur bekerja sesuai desain</b>, bukan kerusakan. Bedakan "gangguan" vs "keamanan bekerja".</p>
<h3>Fix</h3>
<p>Keputusan kebijakan: jika perangkat resmi → naikkan maximum/tambahkan MAC; jika liar → amankan fisik + edukasi user. Catat keputusan di log.</p>
<h3>Final Verification</h3>
<p>Port-security aktif di port yang ditentukan; port kosong shutdown; port map dokumen = kondisi aktual (audit 100%).</p>`,
      terms: [
        ['Access port', 'Port satu VLAN untagged untuk endpoint; tag dilepas sebelum ke perangkat.'],
        ['Port security', 'Pembatasan jumlah/MAC address per port untuk mencegah perangkat liar.'],
        ['Sticky MAC', 'MAC yang otomatis "ditempel" sebagai yang diizinkan saat pertama terlihat.'],
        ['Violation mode', 'Tindakan saat pelanggaran: shutdown / restrict (drop+log) / protect (drop saja).'],
      ],
      diagram: `<pre>        ACCESS PORT + PORT SECURITY

[PC] ──(tanpa tag)──▶ [fa0/3: access VLAN 20, port-security max 2]
                        │
                   [Switch beri label internal VLAN 20]
                        │
                        ▼ trunk / routing sesuai VLAN

Port kosong fa0/9-24: shutdown + label UNUSED.</pre>`,
      scenario:
        'Karyawan mencolok switch 5-port pribadi "agar bisa banyak colokan" — broadcast loop kecil membuat satu lantai lemot. Port-security (maximum 2, violation restrict) langsung memblokir MAC ketiga + log memberi tahu port pelakunya. Tanpa itu, troubleshooting bisa makan setengah hari.',
      bestPractices:
        'Standarkan konfigurasi access port dalam template; audit port map tiap kuartal. Pilih violation mode sesuai kebijakan: restrict (aman + informatif) untuk user, shutdown untuk area sensitif.',
      security:
        'Access port adalah pintu fisik. Kombinasi: mode access eksplisit + port-security + shutdown port kosong + DHCP snooping = pertahanan berlapis yang murah dan efektif.',
      challenge:
        'Ruang meeting butuh port "fleksibel" untuk tamu presentasi (VLAN 40) tapi kadang dipakai karyawan (VLAN 20). Rancang solusi: 802.1X? Port manual? Atau SSID tamu saja? Analisis tradeoff tiap opsi.',
      interviewQ:
        'Q: "Kapan memakai violation shutdown vs restrict?" — A: Shutdown untuk area sensitif (server room, finance) — pelanggaran = port mati, butuh admin; restrict untuk area user umum — paket berlebih di-drop + log, user resmi tetap jalan. Pilihan = tradeoff keamanan vs operasional.',
      quiz: [
        {
          q: 'Apa yang terjadi pada frame saat keluar dari access port menuju PC?',
          options: [
            'Tag VLAN dipertahankan',
            'Tag dilepas — PC menerima frame Ethernet biasa tanpa tahu soal VLAN',
            'Frame dienkripsi',
            'Frame diduplikasi',
          ],
          answer: 1,
          explain: 'Endpoint tidak paham VLAN; switch melepas tag 802.1Q sebelum frame keluar access port.',
        },
        {
          q: 'Log menunjukkan PORT_SECURITY VIOLATION di fa0/3. Artinya…',
          options: [
            'Switch rusak dan harus diganti',
            'Jumlah/MAC pelanggar melebihi batas — fitur keamanan bekerja, bukan kerusakan',
            'Kabel putus',
            'VLAN terhapus',
          ],
          answer: 1,
          explain: 'Violation = ada perangkat/MAC berlebih di port itu. Ini fitur yang bekerja; langkahnya: identifikasi perangkat, tentukan kebijakan.',
        },
        {
          q: 'Mengapa port switch yang kosong harus di-shutdown?',
          options: [
            'Menghemat listrik besar',
            'Port aktif yang kosong adalah pintu masuk gratis bagi perangkat tak berwenang',
            'Agar switch lebih awet',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Siapa pun bisa colok kabel ke port aktif — shutdown menutup pintu itu sampai admin resmi mengaktifkannya dengan VLAN benar.',
        },
      ],
    },
    {
      id: '20.10',
      title: 'Inter-VLAN Routing',
      body: `
<p><b>Inter-VLAN routing</b> adalah proses meneruskan paket <b>antar VLAN</b> — tanpa ini, tiap VLAN adalah pulau terisolasi. Di desain kita, ini terjadi di <b>distribution/core L3</b> (atau router lab).</p>
<h3>Dua Metode</h3>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Cara</th><th>Kapan</th></tr>
<tr><td><b>Router-on-a-stick</b></td><td>Router + 1 trunk; sub-interface per VLAN (fa0/0.10, .20…)</td><td>Lab / site kecil; simpel tapi semua traffic lewat satu kabel</td></tr>
<tr><td><b>SVI di L3 switch</b></td><td>Interface VLAN di switch L3 + <code>ip routing</code></td><td>Enterprise; cepat (switching hardware), skalabel</td></tr>
</table></div>
<h3>Hands-On: Router-on-a-Stick (Lab)</h3>
<h3>Topology</h3>
<pre>[SW-1] ══trunk fa0/24══ [R1 fa0/0]
Semua VLAN (10,20,30,40,99) lewat trunk ini; R1 menjadi gateway .1 tiap VLAN.</pre>
<h3>Objective</h3>
<p>PC VLAN 20 bisa ping server VLAN 30 (routing bekerja); PC VLAN 40 tetap tidak bisa ke VLAN 30 (akan ditegakkan ACL di 20.11 — routing saja = semua boleh).</p>
<h3>Configuration</h3>
<pre>R1(config)# interface fa0/0
R1(config-if)# no shutdown
! Sub-interface per VLAN — 'encapsulation dot1Q 20' artinya:
! "sub-interface ini menangani frame bertag VLAN 20":
R1(config)# interface fa0/0.10
R1(config-subif)# encapsulation dot1Q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config)# interface fa0/0.20
R1(config-subif)# encapsulation dot1Q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config)# interface fa0/0.30
R1(config-subif)# encapsulation dot1Q 30
R1(config-subif)# ip address 192.168.30.1 255.255.255.0
R1(config)# interface fa0/0.40
R1(config-subif)# encapsulation dot1Q 40
R1(config-subif)# ip address 192.168.40.1 255.255.255.0
R1(config)# interface fa0/0.99
R1(config-subif)# encapsulation dot1Q 99
R1(config-subif)# ip address 192.168.99.1 255.255.255.0
! ALASAN pola ini: satu kabel fisik, lima "router logis" — tiap sub-interface
! adalah gateway (.1) untuk satu VLAN. Router otomatis tahu semua subnet
! ini (directly connected) → routing antar VLAN langsung jalan.</pre>
<h3>Verification</h3>
<pre>R1# show ip route → C 192.168.10.0/24, .20.0, .30.0, .40.0, .99.0 ✓
PC-C (.20.50)> ping 192.168.30.10 ✓ (inter-VLAN routing bekerja!)
PC-C> tracert 192.168.30.10 → hop pertama 192.168.20.1 ✓</pre>
<h3>Failure Injection</h3>
<p>Hapus <code>encapsulation dot1Q 30</code> dari fa0/0.30 (atau salah nomor: dot1Q 31).</p>
<h3>Troubleshooting</h3>
<p>Gejala: VLAN 20 ↔ 10 OK, tapi ke VLAN 30 gagal total. Diagnosis: <code>show ip interface brief</code> → fa0/0.30 down/down atau <code>show ip route</code> → 192.168.30.0/24 hilang. Root cause: sub-interface tidak bisa membaca tag yang benar → ia "buta" terhadap VLAN 30. Pelajaran: encapsulation harus <b>persis</b> sama dengan VLAN ID di switch.</p>
<h3>Fix</h3>
<p>Perbaiki encapsulation ke dot1Q 30; verifikasi route muncul kembali.</p>
<h3>Final Verification</h3>
<p>Semua 5 subnet di routing table; ping antar VLAN (yang diizinkan) OK; tracert menunjukkan hop via gateway .1 yang benar.</p>
<div class="callout blue"><div class="t">Catatan Penting</div><p style="margin:4px 0 0">Routing saja = SEMUA VLAN bisa saling mencapai. Isolasi keamanan (guest tidak ke server, user tidak ke management) ditegakkan di 20.11 dengan ACL/firewall. Jangan berhenti di sub-bab ini!</p></div>`,
      terms: [
        ['Inter-VLAN routing', 'Penerusan paket antar VLAN via perangkat Layer 3 (router/L3 switch).'],
        ['Router-on-a-stick', 'Satu router + satu trunk dengan sub-interface per VLAN.'],
        ['Sub-interface', 'Interface logis (fa0/0.20) yang menangani satu VLAN di atas interface fisik.'],
        ['Encapsulation dot1Q', 'Perintah yang mengaitkan sub-interface dengan VLAN ID tertentu.'],
        ['SVI routing', 'Routing memakai interface VLAN di L3 switch + ip routing (metode enterprise).'],
      ],
      diagram: `<pre>        ROUTER-ON-A-STICK

[SW-1] ═════ trunk ═════ [R1 fa0/0]
                           |-- fa0/0.10 → 192.168.10.1 (GW CCTV)
                           |-- fa0/0.20 → 192.168.20.1 (GW OFFICE)
                           |-- fa0/0.30 → 192.168.30.1 (GW SERVER)
                           |-- fa0/0.40 → 192.168.40.1 (GW GUEST)
                           └-- fa0/0.99 → 192.168.99.1 (GW MGMT)

Satu kabel, lima gateway. R1 otomatis route antar subnet.</pre>`,
      scenario:
        'Kantor cabang memakai router-on-a-stick dan traffic antar VLAN mulai lemot saat jam sibuk — semua lewat satu kabel 1G. Solusi enterprise: pindah ke L3 switch dengan SVI (switching hardware, bukan CPU router). Pelajaran: pilih metode sesuai skala.',
      bestPractices:
        'Lab: router-on-a-stick cukup. Production: SVI di L3 distribution switch. Apapun metodenya, gateway .1 konsisten dan terdokumentasi.',
      security:
        'Ingat: routing tanpa ACL = semua boleh. Tahap ini sengaja "terbuka" untuk verifikasi; penguncian dilakukan di 20.11. Jangan pernah production tanpa ACL.',
      challenge:
        'Bandingkan throughput: router-on-a-stick 1G vs L3 switch SVI untuk 500 Mbps traffic inter-VLAN. Mana yang bottleneck dan mengapa? Kapan router-on-a-stick masih layak?',
      interviewQ:
        'Q: "Jelaskan perbedaan router-on-a-stick dan SVI, kapan memakai masing-masing?" — A: Router-on-a-stick: satu router + trunk + sub-interface per VLAN — murah/simpel untuk lab/site kecil tapi satu kabel jadi bottleneck. SVI: interface VLAN di L3 switch + ip routing — cepat (hardware switching), untuk enterprise/distribution layer.',
      quiz: [
        {
          q: 'Apa fungsi perintah encapsulation dot1Q 20 pada sub-interface?',
          options: [
            'Memberi nama interface',
            'Mengaitkan sub-interface dengan frame bertag VLAN 20 — tanpanya sub-interface buta terhadap VLAN itu',
            'Mengaktifkan DHCP',
            'Mempercepat routing',
          ],
          answer: 1,
          explain: 'Encapsulation menentukan VLAN mana yang ditangani sub-interface; salah/tidak ada = subnet itu hilang dari routing table.',
        },
        {
          q: 'Setelah inter-VLAN routing aktif TANPA ACL, apa yang terjadi?',
          options: [
            'Semua VLAN tetap terisolasi',
            'Semua VLAN bisa saling mencapai — isolasi keamanan harus ditegakkan terpisah (ACL/firewall)',
            'Hanya VLAN 20 yang bisa routing',
            'Router otomatis membuat ACL',
          ],
          answer: 1,
          explain: 'Routing = konektivitas; keamanan = policy terpisah. Tanpa ACL, guest pun bisa mencapai server — itulah mengapa 20.11 wajib.',
        },
        {
          q: 'Kapan memilih SVI di L3 switch dibanding router-on-a-stick?',
          options: [
            'Selalu — router-on-a-stick tidak pernah dipakai',
            'Di enterprise: butuh throughput besar antar VLAN (hardware switching) dan skala besar',
            'Hanya untuk VLAN 99',
            'Tidak ada bedanya',
          ],
          answer: 1,
          explain: 'L3 switch merutekan di hardware (cepat, banyak port); router-on-a-stick terbatas satu kabel fisik dan CPU router — cocok untuk lab/skala kecil.',
        },
      ],
    },
    {
      id: '20.11',
      title: 'Firewall Between VLAN',
      body: `
<p><b>Firewall between VLAN</b> (atau ACL di router/L3) adalah <b>penegakan matriks akses</b> dari 20.1: siapa boleh ke mana. Routing membuka jalan; firewall menentukan siapa boleh lewat.</p>
<h3>Prinsip: Default-Deny + Least Privilege</h3>
<p>Aturan ditulis dari <b>paling spesifik ke paling umum</b>, diakhiri <b>deny all</b> implisit. Urutan salah = aturan tidak pernah tersentuh (aturan atas menutupi bawah).</p>
<h3>Hands-On: ACL di Router Lab</h3>
<h3>Topology</h3>
<p>R1 (router-on-a-stick dari 20.10) + semua VLAN. ACL ditempel di sub-interface <b>arah masuk (in)</b> — memfilter sebelum routing, paling efisien.</p>
<h3>Objective</h3>
<p>Tegakkan matriks: GUEST deny ke semua internal; OFFICE boleh ke SERVER hanya TCP 443; semua deny ke MANAGEMENT kecuali PC admin (.99.100).</p>
<h3>Configuration</h3>
<pre>! ACL untuk VLAN 40 GUEST (in di fa0/0.40):
R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.10.0 0.0.0.255
R1(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.20.0 0.0.0.255
R1(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.30.0 0.0.0.255
R1(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.99.0 0.0.0.255
R1(config-ext-nacl)# permit ip 192.168.40.0 0.0.0.255 any
! ALASAN: 'deny' dulu ke semua subnet internal (privat), baru 'permit any'
! untuk internet. Dibalik urutannya (permit any dulu) = deny tidak pernah
! tercapai karena paket sudah lolos di baris pertama!
R1(config)# interface fa0/0.40
R1(config-subif)# ip access-group GUEST-IN in
! ALASAN 'in': filter saat paket MASUK dari guest, sebelum router
! membuang CPU untuk me-routing-nya. 'out' juga bisa tapi kurang efisien.

! ACL untuk VLAN 20 OFFICE (in di fa0/0.20) — contoh least privilege:
R1(config)# ip access-list extended OFFICE-IN
R1(config-ext-nacl)# permit tcp 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255 eq 443
R1(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255
R1(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 192.168.10.0 0.0.0.255
R1(config-ext-nacl)# deny ip 192.168.20.0 0.0.0.255 192.168.99.0 0.0.0.255
R1(config-ext-nacl)# permit ip 192.168.20.0 0.0.0.255 any
R1(config)# interface fa0/0.20
R1(config-subif)# ip access-group OFFICE-IN in
! ALASAN: office BOLEH ke server hanya via HTTPS (443) — port file sharing
! (445) TERTUTUP untuk user biasa. Ini least privilege: buka yang perlu saja.</pre>
<h3>Verification</h3>
<pre>PC-E (guest)> ping 192.168.30.10 → Fail ✓ (deny bekerja)
PC-E> ping 8.8.8.8 → Reply ✓ (internet lolos)
PC-C (office)> telnet 192.168.30.10 443 → Open ✓
PC-C> telnet 192.168.30.10 445 → Fail ✓ (least privilege)
R1# show access-lists → hit counter tiap baris bertambah ✓</pre>
<h3>Failure Injection</h3>
<p>Tambahkan <code>permit ip any any</code> di <b>baris pertama</b> GUEST-IN.</p>
<h3>Troubleshooting</h3>
<p>Gejala: guest tiba-tiba bisa ping server — padahal "ACL sudah ada". Diagnosis: <code>show access-lists</code> → hit counter menumpuk di baris permit any any pertama; baris deny di bawahnya 0 hit. Root cause: <b>urutan ACL</b> — paket dicocokkan dari atas, berhenti di kecocokan pertama. Pelajaran: ACL dibaca berurutan, bukan "yang paling cocok".</p>
<h3>Fix</h3>
<p>Hapus baris permit dari posisi pertama, tempatkan kembali di akhir; verifikasi counter deny kembali bertambah saat guest mencoba.</p>
<h3>Final Verification</h3>
<p>Uji matriks lengkap (script ping/telnet per VLAN); semua deny/allow sesuai desain 20.1; hit counter ACL membuktikan aturan tersentuh.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab kita pakai ACL di router. Di production enterprise, ini adalah <b>firewall policy di FortiGate</b> (Part 15–17) dengan GUI + logging per rule — konsepnya identik: urutan, default-deny, least privilege. Bedanya: firewall mencatat <i>siapa</i> ditolak dan <i>kapan</i>.</p></div>`,
      terms: [
        ['ACL', 'Access Control List — daftar aturan permit/deny berurutan di router/switch.'],
        ['Default-deny', 'Prinsip: yang tidak diizinkan eksplisit = ditolak (baris deny implisit di akhir).'],
        ['Least privilege', 'Hanya buka akses minimum yang dibutuhkan (port/protokol spesifik).'],
        ['Hit counter', 'Penghitung berapa paket cocok dengan tiap baris ACL — alat verifikasi utama.'],
        ['Arah in/out', 'In = filter saat paket masuk interface; out = saat keluar. Pilih in untuk efisiensi.'],
      ],
      diagram: `<pre>        FIREWALL ANTAR VLAN (di R1)

VLAN 40 ──▶ [GUEST-IN, arah in] ──▶ deny→10/20/30/99 ──▶ permit→internet
VLAN 20 ──▶ [OFFICE-IN, arah in] ──▶ allow TCP443→VLAN30 ──▶ deny→10/99 ──▶ permit→lainnya
VLAN 10 ──▶ [CCTV-IN] ──▶ allow→NVR .30.11 saja ──▶ deny→sisanya

Aturan dibaca DARI ATAS. Urutan = nasib.</pre>`,
      scenario:
        'Perusahaan kena ransomware yang menyebar via SMB (port 445) dari PC user ke file server. Investigasi: ACL office→server membuka "all IP" bukan "hanya 443". Jika least privilege diterapkan sejak awal, ransomware tertahan di VLAN 20. Firewall rule yang longgar = asuransi yang tidak dibayar.',
      bestPractices:
        'Tulis alasan bisnis di tiap rule (remark/deskripsi). Review rule tiap 6 bulan — rule usang adalah lubang keamanan. Uji dengan hit counter, bukan asumsi.',
      security:
        'Egress filtering juga penting: batasi port keluar dari office (mis. hanya 80/443/DNS) agar malware sulit "menelepon pulang". Log semua deny untuk deteksi dini.',
      challenge:
        'Buat ACL CCTV-IN: kamera (VLAN 10) hanya boleh ke NVR .30.11 (port RTSP 554), petugas (.20.0/24) boleh ke NVR port 80/443, sisanya deny. Tulis 6 baris + tempel di interface yang tepat + arah yang benar.',
      interviewQ:
        'Q: "ACL-mu tidak memblokir padahal rule sudah benar. Apa yang kamu cek?" — A: Tiga hal: (1) urutan — apakah ada permit umum di atasnya? cek hit counter; (2) arah & interface — apakah access-group ditempel di interface dan arah yang benar? (3) apakah traffic-nya memang lewat perangkat itu (asymmetric routing bisa menghindar)?',
      quiz: [
        {
          q: 'Mengapa urutan baris ACL sangat penting?',
          options: [
            'Agar terlihat rapi',
            'Paket dicocokkan dari baris paling atas dan berhenti di kecocokan pertama — permit umum di atas membuat deny di bawah tak pernah tersentuh',
            'Agar hemat memori router',
            'Tidak penting, router memilih yang paling spesifik otomatis',
          ],
          answer: 1,
          explain: 'ACL bersifat first-match, bukan best-match. Hit counter membuktikan baris mana yang aktif — deny yang 0 hit patut dicurigai.',
        },
        {
          q: 'Mengapa ACL ditempel arah in pada sub-interface guest?',
          options: [
            'Karena hanya arah in yang didukung',
            'Memfilter di titik masuk: paket jahat dibuang sebelum router membuang CPU untuk me-routing-nya',
            'Agar lebih cepat diketik',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Filter sedekat mungkin dengan sumber = efisien dan mencegah paket tak diinginkan masuk lebih dalam ke perangkat.',
        },
        {
          q: 'Apa arti least privilege pada rule OFFICE → SERVER?',
          options: [
            'Office boleh akses semua port server',
            'Hanya buka port yang dibutuhkan (mis. TCP 443), sisanya deny — bukan "allow all IP"',
            'Office tidak boleh ke server sama sekali',
            'Server boleh akses office sebebasnya',
          ],
          answer: 1,
          explain: 'Membuka "all" demi praktis adalah lubang keamanan (contoh: ransomware via SMB 445). Buka spesifik, tutup sisanya.',
        },
      ],
    },
    {
      id: '20.12',
      title: 'Troubleshooting VLAN',
      body: `
<p><b>Troubleshooting VLAN</b> adalah metodologi diagnosis terstruktur — bekal utama NOC. Pola: <b>gejala → hipotesis berlapis → bukti → root cause → fix → verifikasi</b>. Jangan menebak; kumpulkan bukti.</p>
<h3>Metodologi 7 Langkah</h3>
<ol>
<li><b>Definisikan gejala presisi</b> — "PC-A tidak bisa ping PC-B" (bukan "jaringan rusak").</li>
<li><b>Tentukan scope</b> — satu PC? satu VLAN? satu switch? semua? Scope menentukan di mana mencari.</li>
<li><b>Cek berlapis OSI</b> — L1 (link/kabel) → L2 (VLAN/trunk) → L3 (IP/gateway/routing) → L4+ (ACL/port).</li>
<li><b>Bagi dua masalah</b> — ping gateway? ping sesama VLAN? ping lintas VLAN? Hasil tiap tes memangkas setengah kemungkinan.</li>
<li><b>Kumpulkan bukti</b> — show vlan brief, show interfaces trunk, show ip route, show access-lists, arp.</li>
<li><b>Perbaiki satu perubahan</b> — satu fix, satu verifikasi. Jangan ubah 5 hal sekaligus.</li>
<li><b>Dokumentasikan</b> — tulis root cause + fix di tiket/log agar tidak terulang.</li>
</ol>
<h3>Tabel Diagnosis Cepat</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Kemungkinan Root Cause</th><th>Command Bukti</th></tr>
<tr><td>Tidak bisa ping sesama VLAN</td><td>Port salah VLAN; trunk tidak allow VLAN itu</td><td>show vlan brief; show interfaces trunk</td></tr>
<tr><td>Bisa sesama VLAN, gagal lintas VLAN</td><td>Gateway salah; encapsulation salah; route hilang</td><td>ip route (PC); show ip route (R1)</td></tr>
<tr><td>Lintas VLAN sebagian bisa</td><td>ACL deny; urutan ACL salah</td><td>show access-lists (hit counter)</td></tr>
<tr><td>Koneksi putus-sambung</td><td>IP duplikat; loop/STP</td><td>arp -a; show spanning-tree</td></tr>
<tr><td>Dapat IP 169.254.x.x</td><td>DHCP gagal (server down / snooping / pool habis)</td><td>show ip dhcp binding; show ip dhcp pool</td></tr>
<tr><td>Tiba-tiba semua VLAN down</td><td>Trunk putus; native mismatch</td><td>show interfaces status; show interfaces trunk</td></tr>
</table></div>
<h3>Hands-On: Latihan Terstruktur</h3>
<h3>Topology</h3>
<p>Lab lengkap 20.3–20.11 yang sudah berjalan normal.</p>
<h3>Objective</h3>
<p>Dalam 15 menit per kasus, temukan root cause dari 3 gangguan yang disuntikkan, dengan bukti command.</p>
<h3>Configuration</h3>
<p>Suntikkan (satu per satu): (1) port PC-C pindah ke VLAN 40; (2) encapsulation fa0/0.30 diganti dot1Q 31; (3) baris permit any any di awal GUEST-IN.</p>
<h3>Verification</h3>
<p>Catat gejala tiap kasus dalam tabel: gejala → tes yang dilakukan → bukti → root cause.</p>
<h3>Failure Injection</h3>
<p>Ketiga gangguan di atas adalah failure injection-nya.</p>
<h3>Troubleshooting</h3>
<p>Terapkan metodologi 7 langkah per kasus. Kunci: kasus (1) → show vlan brief; kasus (2) → show ip route (subnet hilang); kasus (3) → show access-lists (hit counter di baris salah).</p>
<h3>Fix</h3>
<p>Perbaiki satu per satu; verifikasi normal sebelum lanjut ke kasus berikut.</p>
<h3>Final Verification</h3>
<p>Semua matriks akses kembali sesuai desain; dokumen "lessons learned" ditulis (3 root cause + cara deteksi cepatnya).</p>
<div class="callout blue"><div class="t">Mindset NOC</div><p style="margin:4px 0 0">Engineer junior menebak dan mengubah-ubah; engineer senior mengisolasi dan membuktikan. Kecepatan troubleshooting bukan dari hafalan command, melainkan dari <b>metode</b>: persempit scope, uji hipotesis, baca bukti. Tabel di atas adalah "peta" yang dipakai setiap hari di NOC.</p></div>`,
      terms: [
        ['Root cause', 'Penyebab akar masalah — bukan gejalanya. Fix tanpa root cause = masalah kembali.'],
        ['Scope', 'Lingkup gangguan: satu perangkat, satu VLAN, satu switch, atau seluruh jaringan.'],
        ['Bagi-dua (bisection)', 'Teknik memangkas kemungkinan dengan tes yang membelah masalah jadi dua.'],
        ['APIPA', 'Automatic Private IP Addressing (169.254.x.x) — tanda DHCP gagal.'],
      ],
      diagram: `<pre>        ALUR TROUBLESHOOTING VLAN

Gejala presisi → Scope (1 PC? 1 VLAN? semua?)
      │
      ├─ L1: link up? ──▶ show interfaces status
      ├─ L2: VLAN port benar? trunk allow? ──▶ show vlan brief / trunk
      ├─ L3: IP/GW benar? route ada? ──▶ ipconfig, show ip route
      └─ L4+: ACL blokir? port tutup? ──▶ show access-lists, telnet port
      │
      ▼
Bukti → Root cause → SATU fix → Verifikasi → Dokumentasi</pre>`,
      scenario:
        'NOC menerima 20 tiket "internet mati" dalam 10 menit. Engineer junior panik restart switch. Engineer senior cek scope: semua tiket dari VLAN 40 → cek DHCP pool guest → habis (event besar, 300 tamu). Fix: perbesar pool sementara. Pelajaran: scope dulu, aksi kemudian.',
      bestPractices:
        'Selalu mulai dari scope dan gejala presisi. Satu perubahan per fix. Dokumentasikan setiap insiden (gejala, root cause, fix, waktu) — ini menjadi knowledge base tim.',
      security:
        'Troubleshooting darurat bukan alasan menonaktifkan keamanan ("buka dulu ACL-nya biar jalan"). Jika harus melonggarkan sementara, catat, batasi waktu, dan kembalikan + verifikasi.',
      challenge:
        'Buat "runbook" 1 halaman untuk tim NOC: "User lapor tidak dapat IP" — tulis 8 langkah berurutan dengan command buktinya, dari paling mungkin ke paling jarang.',
      interviewQ:
        'Q: "Ceritakan metodologimu saat menghadapi gangguan jaringan yang belum pernah kamu lihat." — A: Definisikan gejala presisi → tentukan scope → uji berlapis OSI (bagi-dua masalah) → kumpulkan bukti via show commands → satu hipotesis satu tes → fix tunggal → verifikasi → dokumentasikan. Metode > hafalan.',
      quiz: [
        {
          q: 'Langkah pertama yang benar saat menerima laporan gangguan adalah…',
          options: [
            'Restart perangkat yang dicurigai',
            'Mendefinisikan gejala secara presisi dan menentukan scope gangguan',
            'Mengubah konfigurasi yang dicurigai',
            'Menunggu laporan berikutnya',
          ],
          answer: 1,
          explain: 'Gejala presisi + scope menentukan di mana mencari; restart/ubah tanpa diagnosis sering menyembunyikan bukti dan memperparah.',
        },
        {
          q: 'PC dapat IP 169.254.x.x. Artinya…',
          options: [
            'IP statis berhasil diset',
            'DHCP gagal (APIPA) — cek DHCP server, pool, snooping, atau konektivitas ke server',
            'Jaringan normal',
            'VLAN terhapus',
          ],
          answer: 1,
          explain: '169.254.x.x (APIPA) adalah IP darurat saat DHCP tidak menjawab — diagnosis mengarah ke layanan DHCP, bukan ke VLAN/IP statis.',
        },
        {
          q: 'Mengapa hanya satu perubahan per fix?',
          options: [
            'Agar terlihat lambat',
            'Agar jelas perubahan mana yang memperbaiki — banyak perubahan sekaligus mengaburkan root cause',
            'Aturan vendor',
            'Menghemat waktu',
          ],
          answer: 1,
          explain: 'Troubleshooting adalah eksperimen: satu variabel per tes. Mengubah banyak hal sekaligus membuatmu tidak tahu apa yang sebenarnya rusak.',
        },
      ],
    },
  ],
  project: {
    title: 'Project: Membangun Enterprise VLAN Lab Lengkap',
    html: `
<p><b>Tugas:</b> Bangun lab enterprise lengkap di GNS3/EVE-NG sesuai blueprint Part 19–20: 2 switch, 1 router (router-on-a-stick), 6+ VM/PC yang mewakili tiap VLAN (CCTV, OFFICE, SERVER, GUEST, MANAGEMENT, admin).</p>
<h3>Langkah Pengerjaan</h3>
<ol>
<li><b>Desain dulu:</b> tulis <code>vlan-design.md</code> (tabel VLAN + matriks akses) dan <code>ip-plan.md</code> (alokasi IP per blok) — tanpa ini, tidak boleh konfigurasi.</li>
<li><b>Bangun:</b> buat VLAN 10/20/30/40/99, trunk antar switch (native 999, allowed terbatas), access port sesuai port map, DHCP pool office & guest, inter-VLAN routing, ACL antar VLAN.</li>
<li><b>Amankan:</b> port-security di port user, shutdown port kosong, telnet dimatikan (SSH saja), SVI management di VLAN 99.</li>
<li><b>Uji matriks:</b> buat tabel hasil ping/telnet: tiap VLAN ke tiap VLAN + internet — tandai ✓/✗ sesuai desain. Semua harus cocok.</li>
<li><b>Break-the-lab:</b> suntikkan 3 failure (pilih dari 20.3–20.12), catat gejala → diagnosis → fix → verifikasi dalam <code>troubleshooting-log.md</code>.</li>
<li><b>Dokumentasikan:</b> topologi (screenshot/diagram), konfigurasi (<code>show run</code> tiap perangkat), dan lessons learned.</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio)</h3>
<ol>
<li>Buat repo <code>part-20-vlan-enterprise-lab</code> di GitHub.</li>
<li>Struktur folder: <code>/docs</code> (vlan-design.md, ip-plan.md, topologi), <code>/configs</code> (show run tiap perangkat), <code>/tests</code> (tabel matriks hasil uji), <code>/troubleshooting</code> (log 3 failure).</li>
<li>Tulis <code>README.md</code>: tujuan project, topologi (diagram ASCII/screenshot), skema VLAN/IP, cara mereplikasi lab, dan 3 hal yang dipelajari.</li>
<li>Commit dengan pesan jelas per tahap (mis. "feat: VLAN 10-99 dan trunk", "feat: inter-VLAN routing", "test: matriks akses", "docs: troubleshooting log").</li>
<li>Tambahkan link repo ke CV/LinkedIn dengan deskripsi 2 kalimat: masalah yang diselesaikan + teknologi yang dipakai.</li>
</ol>
<h3>Kriteria Selesai</h3>
<ul>
<li>Semua 5 VLAN + trunk + routing + ACL berfungsi sesuai matriks akses (tabel uji 100% cocok).</li>
<li>Dokumen desain, IP plan, konfigurasi, dan troubleshooting log lengkap di repo.</li>
<li>Repo GitHub publik dengan README yang memungkinkan orang lain mereplikasi lab.</li>
<li>Mampu menjelaskan tiap command dan alasannya (uji lisan ke diri sendiri memakai interviewQ tiap sub-bab).</li>
</ul>`,
  },
};
