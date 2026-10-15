import type { Part } from './types';

export const part24: Part = {
  id: '24',
  number: 'PART 24',
  title: 'Zabbix + MikroTik',
  phaseId: 'fase-5',
  description: 'Hands-on: mengintegrasikan router MikroTik ke Zabbix via SNMP — dari enable SNMP di RouterOS, tambah host, monitoring interface/traffic/CPU/memory, trigger, alert, sampai failure lab.',
  repoFolder: 'part-24-zabbix-mikrotik',
  objectives: [
    'Mengaktifkan dan mengamankan SNMP di MikroTik RouterOS untuk kebutuhan monitoring.',
    'Menambahkan MikroTik sebagai host di Zabbix dengan template yang tepat.',
    'Memonitor interface, traffic, CPU, memory, dan availability MikroTik via SNMP/ICMP.',
    'Membuat trigger dan alert (eskalasi) yang actionable untuk router.',
    'Melakukan failure injection lab: merusak, mendiagnosis, dan memperbaiki monitoring secara sistematis.',
  ],
  prerequisites: 'Part 23 (konsep Zabbix, SNMP, OID, trigger), Part 13–14 (MikroTik RouterOS dasar & VLAN), Part 01 (desain VLAN/IP kurikulum).',
  subbabs: [
    {
      id: '24.1',
      title: 'Enable SNMP MikroTik',
      body: `<p>Langkah pertama: menyalakan layanan SNMP di MikroTik agar Zabbix bisa "bertanya". Di RouterOS, SNMP mati secara default (<i>secure by default</i>) — kamu harus menyalakannya dan membatasi siapa yang boleh bertanya.</p>
<h3>Topology (Lab)</h3>
<pre>[Zabbix Server 192.168.99.10] ──VLAN 99 MANAGEMENT── [MikroTik R1 192.168.99.1]
        UDP 161 (SNMP query) ──────────────────────▶
        ◀──────── SNMP response ────────────────────</pre>
<h3>Objective</h3>
<p>Mengaktifkan SNMP di R1 dengan community <code>public-lab</code> yang hanya bisa diakses dari IP Zabbix server.</p>
<h3>Configuration</h3>
<pre># 1. Nyalakan SNMP + identitas device (ALASAN: sysContact/sysLocation muncul
#    di sysDescr & inventory Zabbix — dokumentasi otomatis)
[admin@R1] /snmp set enabled=yes contact="noc@kantor.id" location="Ruang Server Lt2"

# 2. Atur community string (ALASAN: password SNMP v2c; default "public" terlalu umum)
[admin@R1] /snmp community set [find default=yes] name=public-lab addresses=192.168.99.10/32
# ALASAN addresses=: HANYA IP Zabbix yang boleh query — community bocor pun tidak berguna dari IP lain

# 3. Batasi di firewall juga (defense in depth — ALASAN: addresses= di community
#    kadang terlewat; firewall adalah lapis kedua)
[admin@R1] /ip firewall filter add chain=input protocol=udp dst-port=161 \\
    src-address=192.168.99.10 action=accept comment="SNMP dari Zabbix"
[admin@R1] /ip firewall filter add chain=input protocol=udp dst-port=161 \\
    action=drop comment="Drop SNMP dari selain Zabbix"

# 4. Verifikasi dari sisi MikroTik
[admin@R1] /snmp print
# Expected output:
#   enabled: yes
#   contact: noc@kantor.id
#   location: Ruang Server Lt2</pre>
<h3>Verification (dari server Zabbix)</h3>
<pre>$ snmpget -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.1.1.0
# Expected output:
# SNMPv2-MIB::sysDescr.0 = STRING: "MikroTik RouterOS 7.16 (CHR)"
# Jika TIMEOUT → cek: firewall R1, IP Zabbix benar, SNMP enabled</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> SNMPv2c + community <code>public-lab</code> boleh. <b>Production:</b> WAJIB SNMPv3 — di RouterOS: <code>/snmp set engine-id=... v3-user=...</code> dengan auth SHA + priv AES; community v2c dihapus total.</p></div>
<div class="callout blue"><div class="t">Catatan RouterOS 7.x</div><p style="margin:4px 0 0">Di RouterOS v7, menu <code>/snmp</code> tetap sama seperti v6 untuk v2c. Untuk SNMPv3, v7 mendukung <code>auth-protocol=SHA</code> dan <code>priv-protocol=AES</code> — pilih yang terkuat yang didukung kedua sisi.</p></div>`,
      terms: [
        ['/snmp', 'Menu RouterOS untuk konfigurasi layanan SNMP.'],
        ['Community', 'Password SNMP v1/v2c; diatur per community dengan batasan IP.'],
        ['Defense in depth', 'Pengamanan berlapis: community addresses= + firewall filter.'],
        ['Secure by default', 'Layanan mati default sampai admin menyalakan — prinsip keamanan MikroTik.'],
      ],
      scenario: 'Engineer menyalakan SNMP tanpa addresses= dan tanpa firewall. Seminggu kemudian scan internal menemukan seluruh info interface router bisa dibaca dari VLAN guest. Remediasi 5 menit: tambahkan addresses= + firewall drop — insiden menjadi pelajaran "default allow adalah utang keamanan".',
      bestPractices: 'Selalu isi contact & location — saat NOC melihat alert "R1 down", mereka langsung tahu device fisiknya di mana tanpa membuka dokumentasi terpisah.',
      security: 'Jangan pernah izinkan 0.0.0.0/0 di community addresses. SNMP read saja sudah membocorkan topologi lengkap; SNMP write (SET) tidak pernah diaktifkan kecuali ada kebutuhan tertulis.',
      challenge: 'Di lab-mu, jalankan snmpwalk untuk ifDescr (1.3.6.1.2.1.2.2.1.2) ke R1. Cocokkan hasilnya dengan /interface print — apakah semua interface muncul? Catat ifIndex tiap interface.',
      interviewQ: 'Q: "Apa yang kamu amankan saat enable SNMP di MikroTik production?" — A: SNMPv3 (auth+priv), community v2c dihapus, addresses= dibatasi ke IP Zabbix, firewall filter drop UDP 161 dari selain Zabbix, dan SET dimatikan.',
      quiz: [
        {
          q: 'Mengapa parameter addresses=192.168.99.10/32 penting di /snmp community?',
          options: [
            'Agar SNMP lebih cepat',
            'Hanya IP Zabbix yang boleh query — community yang bocor tidak berguna dari IP lain',
            'Agar hemat memory',
            'Syarat garansi MikroTik',
          ],
          answer: 1,
          explain: 'Pembatasan IP sumber adalah kontrol akses utama SNMP v2c selain community string.',
        },
        {
          q: 'Untuk production, konfigurasi SNMP yang benar adalah…',
          options: [
            'v2c dengan community "public"',
            'SNMPv3 dengan auth SHA + priv AES, v2c dihapus',
            'SNMP dimatikan total',
            'Community dibagikan ke semua tim',
          ],
          answer: 1,
          explain: 'Production wajib v3 (autentikasi + enkripsi); v2c teks-biasa tidak aman.',
        },
        {
          q: 'Fungsi firewall filter drop UDP 161 selain dari Zabbix adalah…',
          options: [
            'Mempercepat SNMP',
            'Defense in depth — lapis kedua jika community addresses= terlewat/salah',
            'Menghemat lisensi',
            'Agar WinBox lebih cepat',
          ],
          answer: 1,
          explain: 'Dua lapis kontrol (community + firewall) memastikan satu kesalahan config tidak membuka akses.',
        },
      ],
    },
    {
      id: '24.2',
      title: 'Configure Zabbix Server',
      body: `<p>Sebelum menambah host, pastikan Zabbix server sendiri siap: terinstall, bisa ping/ICMP, dan service SNMP tools tersedia untuk testing. Di lab ini Zabbix server berjalan di <b>192.168.99.10</b> (VLAN 99 MANAGEMENT) — satu VLAN dengan interface management R1.</p>
<h3>Topology</h3>
<pre>[Admin PC 192.168.20.50] ──VLAN 20── [R1] ──VLAN 99── [Zabbix 192.168.99.10]
   (akses web UI)                              (server+DB+frontend)</pre>
<h3>Objective</h3>
<p>Zabbix server terinstall (v7.x), frontend bisa diakses, dan server bisa menjangkau R1 via ICMP+SNMP.</p>
<h3>Configuration (ringkasan — detail install per OS ada di dokumentasi resmi)</h3>
<pre># ALASAN tiap langkah:
# 1. Install paket: zabbix-server-pgsql + zabbix-frontend-php + zabbix-agent2
#    (Pilih pgsql + TimescaleDB untuk skala; lab boleh mysql — konsisten dengan 23.6)
# 2. Buat database & import skema awal (zabbix.sql.gz)
# 3. Edit /etc/zabbix/zabbix_server.conf: DBName, DBUser, DBPassword
#    ALASAN: server harus tahu cara menyambung ke database-nya
# 4. Set kapabilitas ping (ALASAN: ICMP pinger butuh raw socket — lihat 23.10):
setcap cap_net_raw+ep /usr/sbin/fping
# 5. Atur timezone PHP & server ke Asia/Jakarta
#    ALASAN: grafik & jadwal alert kacau jika timezone salah
# 6. Start & enable: zabbix-server, zabbix-agent2, apache2/nginx, postgresql
# 7. Buka http://192.168.99.10/zabbix → login Admin/zabbix → GANTI PASSWORD</pre>
<h3>Verification</h3>
<pre># Dari server Zabbix: pastikan Layer 3 ke R1 OK
$ ping -c 3 192.168.99.1
# Expected output: 0% packet loss, time<1ms

# Pastikan SNMP bisa (dari 24.1)
$ snmpget -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.1.3.0
# Expected output: SNMPv2-MIB::sysUpTime.0 = Timeticks: (...)

# Di frontend: Monitoring → Dashboard → pastikan tidak ada error koneksi database</pre>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0"><code>zabbix_server.conf</code> berisi <b>DBPassword</b> teks-biasa — file ini harus mode <code>640 root:zabbix</code>. Jangan pernah commit file ini ke Git!</p></div>`,
      terms: [
        ['zabbix_server.conf', 'File konfigurasi utama Zabbix server (DB, poller, dsb.).'],
        ['Frontend', 'Antarmuka web (PHP) — diakses via http://IP/zabbix.'],
        ['setcap', 'Perintah Linux memberi kapabilitas (mis. raw socket) ke binary.'],
      ],
      scenario: 'Setelah install, semua icmpping gagal padahal ping manual OK. Penyebab: lupa setcap fping — Zabbix tidak punya izin raw socket. Satu baris perintah, 2 jam troubleshooting terbuang karena tidak baca log. Moral: baca zabbix_server.log dulu.',
      bestPractices: 'Dokumentasikan versi tiap komponen (Zabbix, DB, OS) di inventory — mismatch versi adalah sumber bug yang sulit dilacak.',
      security: 'Ganti password default Admin/zabbix SEBELUM menghubungkan server ke jaringan; aktifkan HTTPS untuk frontend; backup konfigurasi database berkala.',
      challenge: 'Cek di server lab-mu: versi Zabbix (zabbix_server --version), versi DB, dan apakah fping punya cap_net_raw (getcap). Catat ketiganya.',
      interviewQ: 'Q: "icmpping gagal padahal ping manual OK — apa penyebab umumnya?" — A: Binary fping tidak punya kapabilitas cap_net_raw sehingga ICMP pinger Zabbix tidak bisa membuat raw socket; solusinya setcap.',
      quiz: [
        {
          q: 'Mengapa perintah setcap cap_net_raw+ep /usr/sbin/fping diperlukan?',
          options: [
            'Agar fping lebih cepat',
            'ICMP pinger Zabbix butuh raw socket untuk membuat paket ICMP mentah',
            'Agar hemat CPU',
            'Syarat lisensi Zabbix',
          ],
          answer: 1,
          explain: 'Tanpa kapabilitas raw socket, proses Zabbix tidak bisa mengirim ICMP echo — icmpping selalu gagal.',
        },
        {
          q: 'File zabbix_server.conf harus diperlakukan hati-hati karena…',
          options: [
            'Berisi DBPassword teks-biasa — jangan commit ke Git, atur permission ketat',
            'Terlalu besar',
            'Mudah terhapus',
            'Berisi virus',
          ],
          answer: 0,
          explain: 'Kredensial database di file config adalah rahasia — permission 640 dan jangan masuk version control.',
        },
        {
          q: 'Urutan verifikasi kesiapan server yang benar adalah…',
          options: [
            'Langsung tambah 100 host',
            'Ping ke device OK → snmpget OK → frontend bisa dibuka tanpa error DB',
            'Ganti tema dashboard dulu',
            'Matikan firewall server',
          ],
          answer: 1,
          explain: 'Verifikasi bertingkat: Layer 3 (ping), aplikasi (SNMP), lalu frontend — memastikan fondasi sebelum tambah host.',
        },
      ],
    },
    {
      id: '24.3',
      title: 'Add MikroTik',
      body: `<p>Menambahkan host = mendaftarkan R1 ke Zabbix: beri nama, tentukan cara menjangkaunya (SNMP interface), link template, dan atur macro. Setelah ini, Zabbix mulai polling otomatis.</p>
<h3>Objective</h3>
<p>Host "R1-Jakarta" terpantau: SNMP hijau (available), item terisi, tanpa error.</p>
<h3>Configuration (via Frontend)</h3>
<pre>Langkah di web UI (Data collection → Hosts → Create host):
1. Host name   : R1-Jakarta
   ALASAN: nama konsisten dengan sysName di device (lihat 23.9) — memudahkan korelasi
2. Host groups : "Routers" (buat grup dulu)
   ALASAN: grup = dasar filter dashboard, permission, dan action ("semua router kirim ke NOC")
3. Interfaces  : Add → SNMP → IP 192.168.99.1, port 161
   ALASAN: inilah "alamat" yang dipakai poller SNMP
4. SNMP details: Version = SNMPv2, Community = {$SNMP_COMMUNITY}
   ALASAN: pakai macro, bukan teks langsung — ganti community cukup di 1 tempat
5. Templates   : link "MikroTik SNMP" (atau buat sendiri — lihat bawah)
6. Macros (tab) : {$SNMP_COMMUNITY} = public-lab
7. Add → tunggu 2–3 menit → kolom "Available" SNMP jadi HIJAU

# Jika template "MikroTik SNMP" belum ada, buat minimal:
# Template → Create → tambah item:
#   - sysDescr  (SNMP agent: 1.3.6.1.2.1.1.1.0)
#   - sysUpTime (SNMP agent: 1.3.6.1.2.1.1.3.0)
#   - CPU       (SNMP agent: 1.3.6.1.4.1.14988.1.1.3.8.0)
#   - Memory used/total (SNMP agent: .1.3.6.1.4.1.14988.1.1.3.9.0 / .10.0)
#   - Discovery rule: net.if.discovery untuk interface (lihat 23.19)</pre>
<h3>Verification</h3>
<pre>Di Monitoring → Latest data → pilih host R1-Jakarta:
# Expected: nilai sysDescr terisi "MikroTik RouterOS 7.x",
# sysUpTime bertambah tiap refresh, CPU/memory ada angkanya.
# Jika "Not supported": klik item → baca error → test snmpget manual (24.1).</pre>
<div class="callout blue"><div class="t">SNMPv2 vs v3 di Form Host</div><p style="margin:4px 0 0">Di form SNMP details, untuk production pilih <b>SNMPv3</b> dan isi: Security name, Authentication protocol (SHA), Privacy protocol (AES) + passphrase. v2c hanya untuk lab.</p></div>`,
      terms: [
        ['Host', 'Entitas yang dipantau di Zabbix (device/server).'],
        ['Host group', 'Kelompok host untuk filter, permission, dan action.'],
        ['SNMP interface', 'Definisi alamat+port SNMP suatu host di Zabbix.'],
      ],
      scenario: 'Engineer menambah 10 router dengan mengetik community langsung di tiap host. Saat community diganti, ia harus edit 10 host satu per satu — 2 terlewat dan monitoringnya mati diam-diam 3 bulan. Dengan macro {$SNMP_COMMUNITY} di template, pergantian cukup 1x di level template.',
      bestPractices: 'Konvensi nama host: <tipe>-<lokasi>, mis. R1-Jakarta, SW2-Gudang — konsisten dengan label fisik di rak agar NOC tidak bingung saat insiden.',
      security: 'Batasi siapa yang bisa membuat host (role admin) — host palsu bisa dipakai untuk membanjiri server dengan data sampah.',
      challenge: 'Tambahkan R1 ke Zabbix lab-mu mengikuti langkah di atas. Screenshot/ catat: berapa item yang terisi dalam 5 menit pertama? Adakah yang "Not supported"?',
      interviewQ: 'Q: "Mengapa community string sebaiknya disimpan sebagai macro, bukan teks langsung?" — A: Single source of truth — pergantian community cukup di satu tempat (template/host macro), menghindari host yang terlewat dan monitoring mati diam-diam.',
      quiz: [
        {
          q: 'Fungsi host group "Routers" adalah…',
          options: [
            'Mempercepat polling',
            'Dasar filter dashboard, permission user, dan action alert ("semua router → NOC")',
            'Mengganti IP otomatis',
            'Backup konfigurasi',
          ],
          answer: 1,
          explain: 'Group mengelompokkan host untuk manajemen massal: tampil, akses, dan alert.',
        },
        {
          q: 'Kolom "Available" SNMP berwarna hijau artinya…',
          options: [
            'Host sedang di-reboot',
            'Zabbix berhasil polling SNMP ke host tersebut',
            'Template rusak',
            'Database penuh',
          ],
          answer: 1,
          explain: 'Hijau = ketersediaan interface OK; merah/abu = gagal/tidak dikonfigurasi.',
        },
        {
          q: 'Jika item berstatus "Not supported" setelah tambah host, langkah pertama?',
          options: [
            'Hapus host-nya',
            'Baca pesan error item, lalu test snmpget manual dari server Zabbix',
            'Restart laptop',
            'Tunggu seminggu',
          ],
          answer: 1,
          explain: 'Pesan error + test manual memisahkan masalah OID/config vs jaringan/device.',
        },
      ],
    },
    {
      id: '24.4',
      title: 'Interface Monitoring',
      body: `<p>Setelah host terdaftar, aktifkan discovery interface agar <b>setiap port R1</b> terpantau: ether1 (ke ISP), ether2 (ke switch office), vlan10–vlan99, dll. Inilah metrik yang paling sering dibuka di NOC.</p>
<h3>Objective</h3>
<p>Semua interface R1 terdiscovery otomatis; tiap interface punya item traffic in/out, status, dan error.</p>
<h3>Configuration</h3>
<pre>Di template MikroTik (Data collection → Templates → MikroTik SNMP → Discovery rules):
1. Discovery rule sudah ada dari template bawaan/LLD:
   Key  : net.if.discovery  (atau OID walk ifDescr)
   ALASAN: menemukan interface baru otomatis — tambah VLAN baru = otomatis terpantau
2. Item prototypes (dibuat otomatis per interface):
   - "Incoming traffic on {#IFNAME}" : ifHCInOctets[{#SNMPINDEX}] + preprocessing
     Change per second → Custom multiplier 8 → Unit bps
     ALASAN ×8: counter byte → bit (lihat 23.11)
   - "Outgoing traffic on {#IFNAME}" : ifHCOutOctets[{#SNMPINDEX}] (sama)
   - "OperStatus {#IFNAME}"          : ifOperStatus[{#SNMPINDEX}]
   - "Errors in/out {#IFNAME}"       : ifInErrors/ifOutErrors (Change per second)
3. Filter discovery (penting!):
   {#IFNAME} NOT matches "lo|veth" — ALASAN: jangan pantau loopback/virtual yang tidak relevan
4. Tunggu 1 siklus discovery (±1 jam default — atau pakai "Execute now" untuk test)</pre>
<h3>Verification</h3>
<pre>Monitoring → Latest data → R1-Jakarta → filter "traffic":
# Expected: tiap interface (ether1, ether2, vlan10, ...) punya nilai bps yang berubah.
# Buka salah satu → Graph: garis traffic 1 jam terakhir.
# Cek: lakukan speedtest dari PC office → grafik ether1/vlan20 NAIK. Korelasi = bukti data valid!</pre>
<div class="callout"><div class="t">Jebakan: Nama vs Index</div><p style="margin:4px 0 0">LLD memakai <code>{#IFNAME}</code> (nama: "ether1") untuk tampilan dan <code>{#SNMPINDEX}</code> (angka) untuk OID. Jika R1 reboot dan index berubah, discovery berikutnya memetakan ulang otomatis — inilah alasan memakai LLD, bukan item manual (23.9).</p></div>`,
      terms: [
        ['Item prototype', 'Cetakan item yang digandakan LLD untuk tiap interface.'],
        ['{#IFNAME}', 'Macro LLD berisi nama interface hasil discovery.'],
        ['{#SNMPINDEX}', 'Macro LLD berisi ifIndex hasil discovery.'],
      ],
      scenario: 'Engineer menambahkan VLAN 50 (IoT) di R1. Tanpa LLD, vlan50 tidak terpantau sampai ada yang ingat menambahkannya manual — 2 bulan blind spot. Dengan LLD, vlan50 muncul otomatis di Zabbix 1 jam kemudian lengkap dengan grafik traffic dan trigger "port down".',
      bestPractices: 'Filter interface yang tidak perlu (loopback, tunnel sementara) agar tidak membebani polling dan mengotori dashboard.',
      security: 'Nama interface kadang membocorkan info (mis. "ether1-ISP-Telkomsel"). Itu OK di dalam Zabbix (akses terbatas), tapi jangan export grafik mentah ke pihak luar tanpa sensor.',
      challenge: 'Bandingkan grafik ether1 (ke ISP) vs vlan20 (office) selama 1 jam. Mana yang lebih sibuk? Apakah polanya masuk akal dengan aktivitas kantormu?',
      interviewQ: 'Q: "Mengapa memakai LLD untuk interface, bukan membuat item manual per port?" — A: Interface bersifat dinamis (tambah VLAN, reboot ubah ifIndex); LLD menemukan otomatis, memetakan nama↔index dengan benar, dan menghilangkan blind spot interface baru.',
      quiz: [
        {
          q: 'Fungsi custom multiplier 8 pada item traffic adalah…',
          options: [
            'Mengalikan agar grafik lebih tinggi',
            'Mengubah byte (counter) menjadi bit — satuan bandwidth',
            'Mengurangi noise',
            'Syarat template',
          ],
          answer: 1,
          explain: 'Counter SNMP dalam byte; bandwidth dinyatakan dalam bit → ×8.',
        },
        {
          q: 'Mengapa discovery rule perlu filter (mis. mengecualikan "lo")?',
          options: [
            'Agar Zabbix lebih cepat install',
            'Menghindari polling interface tidak relevan (loopback/virtual) yang membebani dan mengotori',
            'Agar hemat lisensi',
            'Syarat ISO',
          ],
          answer: 1,
          explain: 'Hanya pantau yang bermakna operasional; sisanya noise dan beban.',
        },
        {
          q: 'Cara membuktikan data traffic valid adalah…',
          options: [
            'Percaya saja',
            'Korelasikan: lakukan aktivitas (speedtest) dan lihat grafik interface terkait NAIK',
            'Restart Zabbix',
            'Tanya vendor',
          ],
          answer: 1,
          explain: 'Validasi stimulus-respons: sebab (traffic nyata) → akibat (grafik naik) membuktikan rantai data benar.',
        },
      ],
    },
    {
      id: '24.5',
      title: 'Traffic Monitoring',
      body: `<p>Setelah interface terdiscovery, fokus ke <b>traffic WAN</b> (ether1 ke ISP): berapa Mbps terpakai, kapan puncak, dan apakah mendekati kapasitas. Ini data yang dipakai untuk negosiasi dengan ISP dan keputusan upgrade.</p>
<h3>Objective</h3>
<p>Grafik traffic ether1 valid (bps), dengan garis kapasitas dan alert utilisasi 80%.</p>
<h3>Configuration</h3>
<pre>1. Buat graph kustom (Monitoring → Hosts → R1-Jakarta → Graphs → Create):
   - Name: "WAN Traffic - ether1"
   - Items: Incoming traffic on ether1 (green), Outgoing traffic on ether1 (blue, mirrored)
   ALASAN mirrored: pola download vs upload langsung terlihat (asimetri normal = download > upload)

2. Tambah trigger utilisasi (di template, agar berlaku semua router):
   Name: "High WAN utilization on {#IFNAME}"
   Expression: avg(/R1-Jakarta/net.if.in[ether1],15m) > ({$WAN_MAX} * 0.8)
   Macro {$WAN_MAX} = 1000000000 (1 Gbps dalam bps — sesuaikan dengan paket ISP-mu!)
   ALASAN: ambang dalam macro → ganti paket ISP cukup ubah macro, bukan expression
   Severity: Warning

3. Expected output: graph menunjukkan dua garis (in/out), nilai Y dalam bps/Mbps.</pre>
<h3>Verification</h3>
<pre># Uji stimulus-respons:
# 1. Jalankan speedtest dari PC di VLAN 20 (office) → catat hasil (mis. 85 Mbps)
# 2. Lihat graph ether1 di Zabbix → puncak incoming ≈ 85 Mbps pada waktu yang sama
# 3. Jika cocok → rantai SNMP→Zabbix→graph VALID. Jika tidak → cek multiplier/preprocessing.</pre>
<div class="callout blue"><div class="t">Satuan: B vs b</div><p style="margin:4px 0 0">ISP menjual dalam <b>Mbps</b> (megabit). Speedtest melaporkan <b>Mbps</b>. Zabbix item traffic setelah ×8 juga <b>bps</b>. Jika angkamu 8x lebih kecil dari speedtest, multiplier 8 belum dipasang — kesalahan klasik.</p></div>`,
      terms: [
        ['Mirrored graph', 'Grafik dengan satu deret dibalik (negatif) agar in/out mudah dibandingkan.'],
        ['{$WAN_MAX}', 'Macro kapasitas link WAN dalam bps — dasar hitung utilisasi.'],
      ],
      scenario: 'ISP menagih overage dengan klaim pemakaian 950 Mbps di link 1 Gbps. Grafik Zabbix menunjukkan puncak 15-menitan hanya 620 Mbps — klaim terbantahkan dengan data. Tanpa grafik sendiri, perusahaan membayar tagihan yang salah.',
      bestPractices: 'Simpan graph WAN minimal 90 hari (history) + trends 1 tahun — data ini adalah bukti kontrak dan dasar budget tahunan.',
      security: 'Lonjakan outbound misterius = potensi exfiltrasi. Buat trigger terpisah untuk "outgoing > 3x baseline 1 jam" sebagai tripwire keamanan.',
      challenge: 'Hitung utilisasi WAN-mu sekarang: (traffic puncak kemarin ÷ kapasitas paket ISP) × 100%. Di zona hijau/kuning/merah? Apa rencanamu jika kuning?',
      interviewQ: 'Q: "Grafik Zabbix menunjukkan 10 MBps tapi speedtest 80 Mbps — mana yang benar?" — A: Keduanya! 10 MBps (megabyte) × 8 = 80 Mbps (megabit). Selalu samakan satuan sebelum menyimpulkan data salah.',
      quiz: [
        {
          q: 'Jika grafik menunjukkan nilai 8x lebih kecil dari speedtest, kemungkinan penyebabnya…',
          options: [
            'Router rusak',
            'Multiplier ×8 (byte→bit) belum dipasang pada preprocessing item',
            'ISP menipu',
            'Zabbix tidak support Mbps',
          ],
          answer: 1,
          explain: 'Counter SNMP dalam byte; tanpa ×8, nilai tampil sebagai "byte per second" bukan bit per second.',
        },
        {
          q: 'Mengapa ambang utilisasi disimpan sebagai macro {$WAN_MAX}, bukan angka langsung?',
          options: [
            'Agar terlihat canggih',
            'Ganti paket ISP cukup ubah macro di satu tempat, bukan edit tiap expression',
            'Macro lebih cepat',
            'Syarat Zabbix',
          ],
          answer: 1,
          explain: 'Macro = single source of truth untuk nilai yang bisa berubah (kapasitas link).',
        },
        {
          q: 'Cara memvalidasi grafik traffic adalah…',
          options: [
            'Membandingkan dengan perasaan',
            'Stimulus-respons: speedtest → puncak grafik cocok pada waktu yang sama',
            'Me-restart server',
            'Menunggu sebulan',
          ],
          answer: 1,
          explain: 'Korelasi sebab-akibat membuktikan seluruh rantai data (SNMP→Zabbix→graph) benar.',
        },
      ],
    },
    {
      id: '24.6',
      title: 'CPU Monitoring',
      body: `<p>CPU R1 dipantau via OID MikroTik <code>1.3.6.1.4.1.14988.1.1.3.8.0</code> (mtxrHlProcessorLoad, dalam persen). Di lab, generate beban buatan (mis. traffic generator / banyak firewall rule) untuk melihat CPU bergerak — grafik datar 2% selamanya berarti tidak ada yang diuji.</p>
<h3>Objective</h3>
<p>Item CPU terisi; trigger Warning di 70% dan High di 90% (rata-rata 5 menit).</p>
<h3>Configuration</h3>
<pre>Item (di template MikroTik):
- Name: "CPU utilization"
- Key : system.cpu.util  (atau SNMP OID langsung 1.3.6.1.4.1.14988.1.1.3.8.0)
- Type: SNMP agent, Update interval: 60s
- Unit: %, Value range 0-100
  ALASAN 60s: CPU berubah cepat; interval 5 menit akan melewatkan spike penting

Trigger:
- "High CPU load": avg(/R1-Jakarta/system.cpu.util,5m) > {$CPU_HIGH:"90"}
  Severity: High
  ALASAN avg 5m: spike 30 detik saat login WinBox itu normal — jangan alert
- "CPU load warning": avg(/R1-Jakarta/system.cpu.util,15m) > {$CPU_WARN:"70"}
  Severity: Warning
  ALASAN 15m: warning = tren, bukan momen — butuh keyakinan lebih lama</pre>
<h3>Verification</h3>
<pre># Generate beban di R1 (contoh): bandwidth-test ke dirinya sendiri atau
# aktifkan banyak firewall rule dengan logging, lalu:
# Monitoring → Latest data → CPU utilization → Graph
# Expected: garis NAIK saat beban diberikan, turun setelah berhenti.
# Jika tetap 0%: OID salah / SNMP community salah / item "Not supported" — baca error-nya.</pre>
<div class="callout"><div class="t">CHR vs Hardware</div><p style="margin:4px 0 0">Di CHR (VM lab), CPU yang terlihat adalah <b>vCPU</b> — angkanya dipengaruhi hypervisor host. Untuk uji beban realistis, gunakan traffic nyata antar VM, bukan sekadar idle.</p></div>`,
      terms: [
        ['mtxrHlProcessorLoad', 'OID MikroTik untuk utilisasi CPU (%).'],
        ['{$CPU_HIGH} / {$CPU_WARN}', 'Macro ambang CPU agar mudah disesuaikan per device.'],
      ],
      scenario: 'Setelah migrasi ke CHR dengan 1 vCPU, setiap backup malam membuat CPU 100% dan WinBox macet. Grafik Zabbix menunjukkan pola harian yang jelas. Solusi: tambah vCPU menjadi 2 dan jadwalkan backup di luar jam kerja — didukung data, disetujui manajemen dalam 1 meeting.',
      bestPractices: 'Selalu tampilkan CPU berdampingan dengan traffic di dashboard router — "CPU 90% + traffic 900 Mbps = wajar; CPU 90% + traffic 10 Mbps = investigasi".',
      security: 'CPU 100% tiba-tiba tanpa traffic = indikasi kompromi (cryptominer di RouterOS pernah terjadi via exploit). Perlakukan sebagai insiden keamanan.',
      challenge: 'Buat beban buatan di lab (mis. /tool bandwidth-test antar dua CHR atau iperf3 lewat R1). Catat: berapa CPU sebelum, saat, dan sesudah beban? Berapa throughput yang tercapai saat CPU 80%?',
      interviewQ: 'Q: "Mengapa trigger CPU memakai avg 5 menit, bukan nilai sesaat?" — A: Spike sesaat itu normal (login, commit config); yang berbahaya adalah beban tinggi yang bertahan — avg menyaring noise dan mencegah false alarm.',
      quiz: [
        {
          q: 'OID MikroTik untuk CPU utilization adalah…',
          options: [
            '1.3.6.1.2.1.1.1.0',
            '1.3.6.1.4.1.14988.1.1.3.8.0 (mtxrHlProcessorLoad)',
            '1.3.6.1.2.1.2.2.1.10.1',
            '8.8.8.8',
          ],
          answer: 1,
          explain: '.14988 = enterprise MikroTik; .1.1.3.8.0 = processor load.',
        },
        {
          q: 'CPU 95% + traffic 10 Mbps (rendah) sebaiknya diperlakukan sebagai…',
          options: [
            'Normal',
            'Potensi insiden keamanan / proses abnormal — investigasi prioritas',
            'Tanda upgrade bandwidth',
            'Abaikan',
          ],
          answer: 1,
          explain: 'CPU tinggi tanpa kerja yang jelas = proses liar: serangan, bug, atau kompromi.',
        },
        {
          q: 'Update interval 60 detik untuk CPU dipilih karena…',
          options: [
            'Angka cantik',
            'CPU berubah cepat; interval 5 menit akan melewatkan spike penting',
            'Agar database kecil',
            'Syarat SNMP',
          ],
          answer: 1,
          explain: 'Frekuensi polling disesuaikan dengan dinamika metrik: cepat berubah = interval pendek.',
        },
      ],
    },
    {
      id: '24.7',
      title: 'Memory Monitoring',
      body: `<p>Memory R1 dipantau via dua OID: total (<code>...3.10.0</code>) dan terpakai (<code>...3.9.0</code>). Yang digrafik biasanya <b>persentase terpakai</b> via calculated item — lebih mudah dibaca dan dibuat trigger-nya.</p>
<h3>Objective</h3>
<p>Item "Memory utilization %" terisi; trigger Warning 80%, High 90%.</p>
<h3>Configuration</h3>
<pre>Item 1 (SNMP): "Memory total"     → OID 1.3.6.1.4.1.14988.1.1.3.10.0 (byte)
Item 2 (SNMP): "Memory used"      → OID 1.3.6.1.4.1.14988.1.1.3.9.0  (byte)
Item 3 (Calculated) : "Memory utilization"
  Formula: 100 * last(/R1-Jakarta/mem.used) / last(/R1-Jakarta/mem.total)
  Unit: %
  ALASAN calculated: Zabbix menghitung dari 2 item SNMP — persen lebih intuitif
  untuk trigger & grafik dibanding byte mentah

Trigger:
- "High memory usage": last(/R1-Jakarta/mem.util) > 90 → High
- "Memory leak suspect": forecast(/R1-Jakarta/mem.util,7d,,,"linear") > 95 → Warning
  ALASAN forecast: alert PROAKTIF — tahu seminggu sebelum memory habis (lihat 23.13)</pre>
<h3>Verification</h3>
<pre># Latest data → Memory utilization → pastikan 0-100% dan masuk akal
# (CHR idle biasanya 10-25%).
# Reboot R1 → amati grafik: turun ke ~10% lalu naik stabil = pola sehat.
# Expected: tidak ada lonjakan misterius; tren mingguan datar.</pre>
<div class="callout blue"><div class="t">Calculated Item</div><p style="margin:4px 0 0"><b>Calculated item</b> adalah item yang nilainya dihitung dari item lain via formula — tanpa polling tambahan ke device. Hemat SNMP query dan fleksibel untuk rasio/persentase.</p></div>`,
      terms: [
        ['Calculated item', 'Item Zabbix yang nilainya dihitung dari item lain via formula.'],
        ['Memory utilization %', 'Persentase memory terpakai — metrik utama untuk trigger.'],
      ],
      scenario: 'Grafik memory R1 naik 0,8%/hari selama 3 minggu setelah upgrade RouterOS. Trigger forecast berbunyi: "diprediksi 95% dalam 9 hari". Downgrade ke versi stabil sebelum crash — downtime 0 menit. Tanpa forecast, insidennya adalah "router hang misterius jam 2 pagi".',
      bestPractices: 'Setelah tiap upgrade RouterOS, pantau tren memory 2 minggu — memory leak paling sering diperkenalkan oleh versi firmware baru.',
      security: 'Memory penuh = device tidak bisa mencatat log — penyerang bisa memanfaatkan momen ini. Alert memory 90% = prioritas keamanan juga.',
      challenge: 'Buat calculated item memory utilization di lab-mu. Verifikasi: apakah (used/total×100) cocok dengan /system resource print di R1?',
      interviewQ: 'Q: "Apa itu calculated item dan kapan dipakai?" — A: Item yang dihitung dari item lain tanpa polling tambahan — dipakai untuk rasio/persentase (memory %, utilisasi) agar trigger dan grafik lebih intuitif.',
      quiz: [
        {
          q: 'Mengapa memakai calculated item untuk memory %?',
          options: [
            'Agar terlihat canggih',
            'Persen lebih intuitif untuk trigger/grafik; tanpa polling SNMP tambahan',
            'SNMP tidak bisa baca memory',
            'Wajib oleh Zabbix',
          ],
          answer: 1,
          explain: 'Calculated item menghemat query dan menghasilkan metrik siap pakai.',
        },
        {
          q: 'Trigger forecast memory berguna untuk…',
          options: [
            'Mengetahui cuaca',
            'Alert proaktif sebelum memory habis — berdasarkan tren, bukan menunggu 90%',
            'Menghapus data lama',
            'Me-reboot otomatis',
          ],
          answer: 1,
          explain: 'Forecast memprediksi masa depan dari tren — pencegahan, bukan pemadaman.',
        },
        {
          q: 'Setelah upgrade RouterOS, hal yang wajib dipantau 2 minggu adalah…',
          options: [
            'Warna LED',
            'Tren memory — leak paling sering diperkenalkan versi firmware baru',
            'Harga saham MikroTik',
            'Jumlah user forum',
          ],
          answer: 1,
          explain: 'Regresi memory leak adalah risiko klasik tiap rilis firmware baru.',
        },
      ],
    },
    {
      id: '24.8',
      title: 'ICMP Monitoring',
      body: `<p>ICMP adalah "lapis pertama" monitoring R1: murah (3 item), cepat mendeteksi down, dan menjadi <b>dasar trigger dependency</b> — semua alert device di belakang R1 bergantung pada "R1 hidup".</p>
<h3>Objective</h3>
<p>Template "ICMP Ping" ter-link ke R1; trigger down berbunyi dalam 3 menit saat R1 mati.</p>
<h3>Configuration</h3>
<pre>1. Data collection → Hosts → R1-Jakarta → Templates → Link "ICMP Ping"
   ALASAN: template bawaan berisi icmpping, icmppingloss, icmppingsec + 3 trigger standar
2. Pastikan Zabbix server bisa ping R1 (sudah diverifikasi di 24.2 — setcap fping!)
3. Trigger dependency (penting untuk topologi nyata):
   Jika ada host "SW-Office" di belakang R1:
   - Buka trigger "SW-Office unreachable" → Dependencies → Add → "R1-Jakarta unreachable"
   ALASAN: R1 mati = semua di belakangnya ikut unreachable; hanya alert R1 yang berbunyi

4. Uji: matikan interface management R1 sementara ATAU blokir ICMP sesaat
   (di lab — JANGAN di production tanpa change request!)</pre>
<h3>Verification</h3>
<pre># Matikan R1 (lab!) → amati:
# 1. ≤3 menit: trigger "R1-Jakarta unreachable" → PROBLEM (High)
# 2. Alert terkirim sesuai action (24.10)
# 3. Nyalakan lagi → trigger RECOVERY → alert "RESOLVED"
# Expected: hanya 1 alert akar masalah (bukan puluhan dari device di belakangnya).</pre>
<div class="callout"><div class="t">ICMP vs SNMP untuk "Down"</div><p style="margin:4px 0 0">ICMP mendeteksi down <b>lebih cepat & murah</b> daripada menunggu SNMP timeout. Pola terbaik: trigger down berbasis <b>icmpping</b>, sedangkan diagnosis "mengapa" memakai data SNMP (CPU, interface).</p></div>`,
      terms: [
        ['ICMP Ping template', 'Template bawaan Zabbix untuk monitoring up/down via ping.'],
        ['Trigger dependency', 'Trigger yang ditekan jika trigger induk (akar masalah) aktif.'],
      ],
      scenario: 'Core router mati dan NOC dibanjiri 87 alert "unreachable" — operator butuh 20 menit memilah mana akar masalah. Setelah dependency dipasang, insiden berikutnya: 1 alert "R1 down". Operator langsung fokus ke R1 tanpa distraksi.',
      bestPractices: 'Petakan dependency mengikuti topologi fisik: semua device di belakang sebuah router bergantung pada trigger router tersebut.',
      security: 'Pastikan R1 menjawab ping dari Zabbix (192.168.99.10) tapi TOLAK ping dari VLAN guest/internet — kurangi permukaan pemetaan oleh penyerang.',
      challenge: 'Gambar pohon dependency untuk lab-mu: R1 di puncak, device/VM di bawahnya. Tulis trigger mana bergantung pada trigger mana.',
      interviewQ: 'Q: "Mengapa trigger down memakai ICMP, bukan SNMP timeout?" — A: ICMP lebih cepat dan murah untuk deteksi down; SNMP timeout lambat dan ambigu (bisa berarti SNMP mati padahal device hidup). Diagnosis penyebabnya baru memakai data SNMP.',
      quiz: [
        {
          q: 'Fungsi utama template ICMP Ping pada router adalah…',
          options: [
            'Mengukur suhu',
            'Lapis pertama deteksi up/down yang cepat, murah, dan menjadi dasar dependency',
            'Menggantikan SNMP',
            'Backup konfigurasi',
          ],
          answer: 1,
          explain: 'ICMP = deteksi down tercepat & termurah; fondasi untuk menekan alert beruntun via dependency.',
        },
        {
          q: 'Trigger dependency "switch bergantung pada router" bertujuan…',
          options: [
            'Mempercepat polling',
            'Saat router down, hanya 1 alert akar masalah yang berbunyi (bukan puluhan)',
            'Menghemat lisensi',
            'Mematikan switch otomatis',
          ],
          answer: 1,
          explain: 'Dependency menekan alert gejala sehingga operator fokus ke akar masalah.',
        },
        {
          q: 'Setelah R1 dinyalakan kembali, yang seharusnya terjadi adalah…',
          options: [
            'Alert dihapus manual',
            'Trigger RECOVERY otomatis dan alert "RESOLVED" terkirim',
            'Zabbix harus diinstall ulang',
            'Tidak ada yang terjadi',
          ],
          answer: 1,
          explain: 'Siklus PROBLEM→RECOVERY otomatis; notifikasi resolved menutup loop insiden.',
        },
      ],
    },
    {
      id: '24.9',
      title: 'Trigger',
      body: `<p>Sekarang rangkai trigger spesifik untuk R1 — gabungan dari metrik yang sudah dikumpulkan (24.4–24.8). Aturan: setiap trigger harus <b>actionable</b> (jelas tindakannya) dan memakai <b>macro ambang</b> agar mudah disesuaikan.</p>
<h3>Objective</h3>
<p>Set trigger untuk R1: down, CPU, memory, interface down, WAN utilization — dengan severity yang tepat.</p>
<h3>Configuration (di template MikroTik — berlaku semua router)</h3>
<pre>1. "R1 unreachable" (dari template ICMP Ping, pastikan ter-link):
   last(/R1-Jakarta/icmpping)=0  → Disaster
   ALASAN Disaster: router down = seluruh segmen di belakangnya lumpuh

2. "High CPU":
   avg(/R1-Jakarta/system.cpu.util,5m) > {$CPU_HIGH:"90"} → High
   Recovery: avg(/R1-Jakarta/system.cpu.util,5m) < {$CPU_HIGH_RECOVERY:"75"}
   ALASAN hysteresis: pulih di 75, bukan 90 — cegah flapping (23.17)

3. "High memory":
   last(/R1-Jakarta/mem.util) > 90 → High

4. "Interface {#IFNAME} down" (trigger prototype di discovery rule):
   last(/R1-Jakarta/net.if.operstatus[{#SNMPINDEX}])=2 and
   last(/R1-Jakarta/net.if.operstatus[{#SNMPINDEX}],#2)=1
   → Average
   ALASAN kondisi ganda: hanya alert saat BERUBAH dari up→down (bukan port yang
   memang sengaja dimatikan sejak awal)

5. "High WAN utilization":
   avg(/R1-Jakarta/net.if.in[ether1],15m) > ({$WAN_MAX} * 0.8) → Warning</pre>
<h3>Verification</h3>
<pre># Uji tiap trigger SATU PER SATU (jangan sekaligus):
# - Cabut kabel ether2 (lab) → "Interface ether2 down" PROBLEM dalam ±2 menit
# - Colok lagi → RECOVERY
# - Cek di Monitoring → Problems: hanya trigger yang relevan yang muncul.
# Expected: tidak ada trigger yang berbunyi padahal kondisi normal (no false positive).</pre>
<div class="callout"><div class="t">Test Trigger itu Wajib</div><p style="margin:4px 0 0">Trigger yang belum pernah diuji = asumsi. Uji di lab dengan kondisi nyata (cabut kabel, beri beban) — trigger yang tidak berbunyi saat seharusnya = sama bahayanya dengan false alarm.</p></div>`,
      terms: [
        ['Trigger prototype', 'Cetakan trigger di discovery rule — digandakan per interface.'],
        ['Recovery expression', 'Syarat terpisah untuk menyatakan pulih (hysteresis).'],
      ],
      scenario: 'Trigger "interface down" berbunyi untuk 12 port switch yang memang kosong sejak awal — NOC mengabaikannya, dan saat port penting down 2 minggu kemudian, alert-nya ikut terabaikan. Solusi: kondisi "berubah dari up ke down" + filter hanya port yang terpakai (ifOperStatus=up saat discovery).',
      bestPractices: 'Setiap trigger baru: uji PROBLEM-nya, uji RECOVERY-nya, dokumentasikan aksi yang diharapkan di deskripsi trigger.',
      security: 'Tambahkan trigger "SNMP community changed" / "config changed" sebagai tripwire perubahan tak resmi — dibahas di Part 29.',
      challenge: 'Audit trigger lab-mu: untuk tiap trigger, tulis (a) kondisi pemicu, (b) severity, (c) aksi yang harus dilakukan operator. Jika (c) tidak jelas → trigger itu kandidat dihapus.',
      interviewQ: 'Q: "Bagaimana kamu memastikan trigger interface down tidak berisik untuk port yang memang kosong?" — A: Kondisi ganda: alert hanya jika status BERUBAH dari up ke down (nilai sebelumnya =1), plus filter discovery hanya untuk interface yang up.',
      quiz: [
        {
          q: 'Kondisi ganda "sekarang down DAN sebelumnya up" pada trigger interface bertujuan…',
          options: [
            'Mempercepat alert',
            'Hanya alert untuk perubahan up→down — port yang memang mati sejak awal tidak berisik',
            'Menghemat database',
            'Syarat SNMP',
          ],
          answer: 1,
          explain: 'Membedakan "baru saja down" (insiden) dari "memang tidak dipakai" (bukan insiden).',
        },
        {
          q: 'Recovery di 75% padahal PROBLEM di 90% adalah contoh…',
          options: ['Bug', 'Hysteresis — mencegah flapping di sekitar satu ambang', 'Alert ganda', 'Kesalahan ketik'],
          answer: 1,
          explain: 'Ambang pulih ≠ ambang masalah mencegah status on/off berulang.',
        },
        {
          q: 'Mengapa setiap trigger baru wajib diuji PROBLEM dan RECOVERY-nya?',
          options: [
            'Agar sibuk',
            'Trigger yang tak teruji = asumsi; yang tak berbunyi saat seharusnya sama bahayanya dengan false alarm',
            'Syarat vendor',
            'Agar grafik bagus',
          ],
          answer: 1,
          explain: 'Monitoring yang tidak terbukti bekerja saat dibutuhkan adalah ilusi keamanan.',
        },
      ],
    },
    {
      id: '24.10',
      title: 'Alert',
      body: `<p>Trigger tanpa alert = alarm mobil tanpa suara. Sub-bab ini merangkai: media Telegram → action → eskalasi untuk R1.</p>
<h3>Objective</h3>
<p>Saat R1 bermasalah, NOC menerima Telegram dalam 2 menit; jika tak di-acknowledge 15 menit, eskalasi ke on-call.</p>
<h3>Configuration</h3>
<pre>1. Buat bot Telegram (ALASAN: gratis, cepat, mendukung format HTML):
   - Chat dengan @BotFather → /newbot → catat TOKEN
   - Buat grup "NOC Alerts", masukkan bot, catat CHAT ID (via @getmyid_bot)
2. Alerts → Media types → Telegram → isi Token; test ke chat ID grup
   ALASAN test dulu: pastikan kredensial benar SEBELUM insiden nyata
3. Buat user "noc-duty" dengan media Telegram (chat id grup) — ALASAN: alert
   dikirim ke USER via medianya; grup diwakili satu user khusus
4. Alerts → Actions → Create:
   - Conditions: Trigger severity >= High AND Host group = Routers
     ALASAN: hanya masalah penting router yang membangunkan orang
   - Operations:
     Step 1 (0m): Send to "noc-duty" via Telegram:
       "PROBLEM: {EVENT.NAME} on {HOST.NAME} at {EVENT.TIME} — Severity: {TRIGGER.SEVERITY}"
       ALASAN macro: pesan selalu berisi APA, DI MANA, KAPAN, SEPARAH APA
     Step 2 (15m): Send to "on-call-engineer" via Telegram + Email
       (hanya jika belum acknowledge — atur di "Pause operations while")
   - Recovery operation: kirim "RESOLVED: ..." ke noc-duty</pre>
<h3>Verification</h3>
<pre># Uji end-to-end (lab):
# 1. Blokir ICMP ke R1 sementara → dalam ±2 menit Telegram grup berbunyi
# 2. Jangan acknowledge → 15 menit kemudian on-call menerima eskalasi
# 3. Buka blokir → pesan RESOLVED masuk
# Expected: 3 pesan berurutan (PROBLEM → ESCALATION → RESOLVED). Cek juga
# Reports → Action log untuk jejak pengiriman.</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> Telegram cukup. <b>Production:</b> tambah SMS/telepon untuk Disaster (berbayar tapi membangunkan), dan pastikan ada jalur alert <b>di luar jaringan yang dipantau</b> — jika internet down, alert via internet ikut mati! (Gunakan SMS gateway / koneksi cadangan untuk alert kritis.)</p></div>`,
      terms: [
        ['BotFather', 'Bot resmi Telegram untuk membuat bot baru dan mendapatkan token.'],
        ['Action log', 'Jejak semua alert yang coba dikirim (Reports → Action log).'],
        ['Out-of-band alerting', 'Jalur alert di luar jaringan yang dipantau (mis. SMS) agar tetap jalan saat internet down.'],
      ],
      scenario: 'Internet kantor down total — dan semua alert Zabbix (via Telegram) ikut mati karena memakai internet yang sama. NOC tahu dari telepon user, 40 menit kemudian. Pelajaran: alert Disaster wajib punya jalur out-of-band (SMS gateway dengan koneksi seluler terpisah).',
      bestPractices: 'Uji seluruh rantai alert tiap 3 bulan (drill): PROBLEM → eskalasi → RESOLVED. Alert yang tidak pernah diuji = asumsi.',
      security: 'Token bot = kredensial. Batasi admin yang bisa melihat media type; rotasi token jika ada anggota tim yang keluar.',
      challenge: 'Lakukan drill alert di lab-mu minggu ini: catat waktu dari "kabel dicabut" sampai "Telegram berbunyi". Berapa menit? Apakah memenuhi target 2 menit?',
      interviewQ: 'Q: "Mengapa alert kritis butuh jalur out-of-band?" — A: Karena jika jaringan yang dipantau down total, alert yang lewat jaringan itu ikut mati — SMS/telepon via jalur seluler terpisah memastikan kabar tetap sampai.',
      quiz: [
        {
          q: 'Format pesan alert yang baik wajib memuat…',
          options: [
            'Stiker lucu',
            'APA (event), DI MANA (host), KAPAN (waktu), SEPARAH APA (severity)',
            'Hanya kata "ERROR"',
            'Cuaca hari ini',
          ],
          answer: 1,
          explain: 'Empat elemen itu memungkinkan operator bertindak tanpa membuka dashboard dulu.',
        },
        {
          q: 'Eskalasi langkah 2 (15 menit, jika belum acknowledge) bertujuan…',
          options: [
            'Mengganggu engineer',
            'Memastikan masalah kritis tidak tenggelam karena satu orang tidur/sibuk',
            'Menghabiskan kuota Telegram',
            'Syarat ISO',
          ],
          answer: 1,
          explain: 'Eskalasi = jaring pengaman agar tidak ada insiden kritis yang tak tertangani.',
        },
        {
          q: 'Cara memverifikasi rantai alert bekerja adalah…',
          options: [
            'Berdoa',
            'Drill end-to-end: picu PROBLEM → cek PROBLEM, ESKALASI, dan RESOLVED terkirim + cek Action log',
            'Membaca manual saja',
            'Menunggu insiden nyata',
          ],
          answer: 1,
          explain: 'Hanya drill yang membuktikan seluruh rantai (trigger→action→media→eskalasi→recovery) berfungsi.',
        },
      ],
    },
    {
      id: '24.11',
      title: 'Hands-On: Failure Lab',
      body: `<p>Lab puncak Part 24: <b>merusak monitoring dengan sengaja</b>, lalu mendiagnosis dan memperbaikinya mengikuti struktur baku: Topology → Objective → Configuration → Verification → Failure Injection → Troubleshooting → Fix → Final Verification.</p>
<h3>Topology</h3>
<pre>[Zabbix 192.168.99.10] ──VLAN 99── [R1 MikroTik 192.168.99.1] ──ether1── [ISP sim]
                                                            └─vlan20── [PC Office]</pre>
<h3>Objective</h3>
<p>Mensimulasikan 3 kegagalan monitoring umum, mendiagnosis dengan metodologi divide-and-conquer (23.21), dan memverifikasi pemulihan penuh.</p>
<h3>Configuration (kondisi awal sehat)</h3>
<pre># Pastikan sebelum mulai:
# - R1 terdaftar di Zabbix, SNMP hijau, semua item terisi (24.1–24.8)
# - Trigger & alert Telegram aktif (24.9–24.10)
# - Catat baseline: screenshot Latest data R1 (nilai normal CPU/memory/traffic)</pre>
<h3>Verification (baseline)</h3>
<p>Semua item hijau, tidak ada PROBLEM aktif, Telegram grup sepi. Ini "foto sehat" untuk perbandingan.</p>
<h3>Failure Injection (lakukan SATU PER SATU!)</h3>
<pre>Skenario A — SNMP mati di device:
[admin@R1] /snmp set enabled=no
# Dampak yang diharapkan: item SNMP "Not supported"/timeout, icmpping TETAP OK
# (device hidup, hanya layanan SNMP mati) → pelajaran: bedakan "device down" vs "monitoring down"

Skenario B — Community string salah di Zabbix:
# Ubah macro {$SNMP_COMMUNITY} host R1 menjadi "salah-sengaja"
# Dampak: SEMUA item SNMP merah bersamaan (pola sistemik satu host)

Skenario C — Firewall blokir UDP 161 di R1:
[admin@R1] /ip firewall filter add chain=input protocol=udp dst-port=161 action=drop \\
    place-before=0 comment="SIMULASI: blokir SNMP"
# Dampak: mirip A, tapi snmpwalk dari server juga timeout total</pre>
<h3>Troubleshooting (untuk tiap skenario)</h3>
<pre>Metodologi divide-and-conquer:
1. Lihat pola: SEMUA item SNMP merah + icmpping HIJAU → bukan device down,
   melainkan jalur/layanan SNMP. (Jika icmp juga merah → device/jaringan.)
2. Test manual dari server Zabbix:
   snmpget -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.1.1.0
   - Timeout + ping OK     → layanan SNMP mati / diblokir (Skenario A/C)
   - "Timeout" hanya untuk community tertentu → cek community (Skenario B:
     coba snmpget dengan community yang diubah → gagal = community salah di Zabbix)
3. Baca pesan error item di Zabbix (klik "Not supported") — sering menyebut penyebab.
4. Cek log: tail /var/log/zabbix/zabbix_server.log | grep -i snmp</pre>
<h3>Fix</h3>
<pre>Skenario A: [admin@R1] /snmp set enabled=yes
Skenario B: kembalikan macro {$SNMP_COMMUNITY} ke "public-lab"
Skenario C: [admin@R1] /ip firewall filter remove [find comment="SIMULASI: blokir SNMP"]
# ALASAN hapus via comment: presisi — tidak salah hapus rule production lain</pre>
<h3>Final Verification</h3>
<pre># 1. Latest data R1: semua item kembali terisi dalam ±3 menit
# 2. Problems: PROBLEM SNMP → RESOLVED otomatis
# 3. Telegram: pesan RESOLVED diterima
# 4. Bandingkan dengan baseline: nilai CPU/memory/traffic kembali ke pola normal
# 5. Dokumentasikan: tulis runbook 1 halaman per skenario (gejala→diagnosis→fix)
#    dan commit ke repo GitHub (lihat Project di bawah)</pre>
<div class="callout"><div class="t">Aturan Failure Lab</div><p style="margin:4px 0 0">Satu skenario dalam satu waktu; catat waktu mulai; jangan lanjut ke skenario B sebelum A pulih total dan terverifikasi. Di production, failure injection HANYA dalam change request + maintenance window.</p></div>`,
      terms: [
        ['Failure injection', 'Sengaja merusak sistem di lab untuk melatih diagnosis & perbaikan.'],
        ['Baseline', 'Kondisi normal tercatat sebagai pembanding saat insiden.'],
        ['Runbook', 'Dokumen langkah diagnosis & perbaikan per skenario insiden.'],
      ],
      diagram: `<pre>           ALUR FAILURE LAB

[Sehat + baseline] ──▶ [Inject 1 failure] ──▶ [Amati gejala]
        ▲                                              │
        │                                              ▼
[Final verification] ◀── [Fix] ◀── [Diagnosis: pola→test manual→log]
        │
        ▼
[Dokumentasi runbook → commit GitHub]</pre>`,
      scenario: 'Tim NOC baru dilatih dengan failure lab ini tiap kuartal. Hasilnya: MTTR (mean time to repair) insiden monitoring turun dari 45 menit menjadi 12 menit — karena mereka sudah pernah "melihat" gejalanya di lab, bukan pertama kali saat insiden nyata jam 2 pagi.',
      bestPractices: 'Jadwalkan failure drill rutin (tiap kuartal) — skill troubleshooting berkarat jika tidak dilatih, sama seperti skill lainnya.',
      security: 'Jangan pernah menjalankan failure injection di production tanpa change request tertulis + rollback plan + pemberitahuan ke stakeholder.',
      challenge: 'Tambahkan Skenario D versimu sendiri: mis. ubah ifIndex dengan menambah VLAN baru lalu reboot R1 — apakah LLD menanganinya? Dokumentasikan hasilnya.',
      interviewQ: 'Q: "Item SNMP merah semua tapi ping hijau — apa diagnosis dan langkahmu?" — A: Pola = layanan/jalur SNMP bermasalah, bukan device down. Test snmpget manual dari server; jika timeout → cek SNMP enabled, community, firewall UDP 161; baca error item dan log server untuk konfirmasi.',
      quiz: [
        {
          q: 'Skenario A (SNMP dimatikan) vs device down dibedakan dengan…',
          options: [
            'Tidak bisa dibedakan',
            'icmpping tetap HIJAU (device hidup) sementara item SNMP merah = layanan SNMP yang mati',
            'Warna dashboard',
            'Menebak',
          ],
          answer: 1,
          explain: 'ICMP hijau + SNMP merah = device hidup, layanan monitoring yang bermasalah.',
        },
        {
          q: 'Aturan utama failure lab adalah…',
          options: [
            'Rusak semuanya sekaligus secepat mungkin',
            'Satu skenario dalam satu waktu; verifikasi pulih total sebelum lanjut',
            'Jangan catat apa pun',
            'Lakukan di production',
          ],
          answer: 1,
          explain: 'Satu variabel dalam satu waktu + verifikasi penuh = eksperimen yang valid dan aman.',
        },
        {
          q: 'Langkah "Final Verification" memastikan…',
          options: [
            'Server terlihat bagus',
            'Item terisi kembali, PROBLEM resolved, alert RESOLVED terkirim, nilai kembali ke baseline',
            'Tidak ada yang perlu didokumentasikan',
            'Boleh langsung pulang',
          ],
          answer: 1,
          explain: 'Verifikasi penuh menutup loop: data, status, notifikasi, dan baseline — plus dokumentasi runbook.',
        },
      ],
    },
  ],
  project: {
    title: 'Project Part 24 — Monitoring MikroTik Production-Ready (Portfolio)',
    html: `
<div class="proj">
<h3>Project Part 24 — Monitoring MikroTik Production-Ready</h3>
<p>Bangun monitoring lengkap untuk router MikroTik lab-mu dan dokumentasikan sebagai artefak portfolio: <b>template SNMP MikroTik + dashboard + runbook troubleshooting</b>.</p>
<p><b>Tugasmu:</b></p>
<ol>
<li>Aktifkan SNMP di MikroTik (v2c untuk lab, dokumentasikan rencana migrasi v3) dengan pembatasan IP + firewall.</li>
<li>Tambahkan R1 sebagai host di Zabbix: template dengan item (sysDescr, uptime, CPU, memory, interface via LLD), trigger (down, CPU, memory, interface down, WAN utilization), dan macro.</li>
<li>Buat dashboard "R1 Overview": status, grafik traffic WAN, CPU, memory, dan daftar problems.</li>
<li>Konfigurasikan alert Telegram dengan eskalasi minimal 2 langkah; lakukan drill end-to-end.</li>
<li>Lakukan failure lab (24.11) minimal 2 skenario; tulis runbook untuk masing-masing.</li>
<li>Susun repository GitHub di folder <code>part-24-zabbix-mikrotik/</code>.</li>
</ol>
<p><b>Isi repository (portfolio artifact):</b></p>
<ul>
<li><code>README.md</code> — arsitektur monitoring (diagram alur data device → Zabbix → alert), daftar metrik & ambang, hasil drill.</li>
<li><code>template-mikrotik-snmp.yaml</code> — export template Zabbix (Data collection → Templates → Export).</li>
<li><code>dashboard-r1.png</code> — screenshot dashboard.</li>
<li><code>runbook-snmp-failure.md</code> — runbook tiap skenario failure lab.</li>
<li><code>snmp-routeros.rsc</code> — script konfigurasi SNMP RouterOS (tanpa community asli — pakai placeholder!).</li>
</ul>
<p><b>Langkah upload ke GitHub:</b></p>
<ol class="steps">
<li><span class="n">1</span><span>Buka repository <code>network-engineer-lab</code>-mu (dibuat di Part 01).</span></li>
<li><span class="n">2</span><span>Buat folder <code>part-24-zabbix-mikrotik/</code> dan isi file-file di atas. <b>Jangan</b> commit community string / token bot asli — pakai placeholder seperti <code>CHANGEME</code>.</span></li>
<li><span class="n">3</span><span>Di README, sertakan: diagram alur data, tabel metrik vs ambang vs severity, screenshot dashboard, dan pelajaran dari failure lab.</span></li>
<li><span class="n">4</span><span>Upload via web atau git: <code>git add part-24-zabbix-mikrotik &amp;&amp; git commit -m "Part 24: monitoring MikroTik dengan Zabbix" &amp;&amp; git push</code>.</span></li>
<li><span class="n">5</span><span>Verifikasi: folder tampil rapi, README ter-render, tidak ada kredensial asli yang ter-commit.</span></li>
</ol>
<p><b>Kriteria selesai:</b> (1) R1 terpantau penuh di Zabbix lab (item hijau, trigger teruji PROBLEM+RECOVERY); (2) drill alert Telegram berhasil end-to-end; (3) repository berisi template export + dashboard screenshot + runbook; (4) tidak ada kredensial asli di repo.</p>
</div>
<div class="callout blue"><div class="t">Pertanyaan Interview — Latihan Part 24</div>
<p style="margin:6px 0 0">1) Bagaimana cara aman mengaktifkan SNMP di MikroTik? &nbsp;2) Mengapa memakai macro untuk community string? &nbsp;3) Item SNMP merah semua tapi ping hijau — diagnosis-mu? &nbsp;4) Mengapa trigger CPU memakai rata-rata 5 menit? &nbsp;5) Mengapa alert kritis butuh jalur out-of-band? — Jika kelimanya bisa kamu jawab dengan kata-katamu sendiri, kamu siap lanjut ke Part 25.</p></div>`,
  },
};