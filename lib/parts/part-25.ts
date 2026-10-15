import type { Part } from './types';

export const part25: Part = {
  id: '25',
  number: 'PART 25',
  title: 'Zabbix + FortiGate',
  phaseId: 'fase-5',
  description: 'Mengintegrasikan firewall FortiGate ke Zabbix via SNMP: interface, CPU, memory, session table, traffic, availability, dan alerting khusus firewall.',
  repoFolder: 'part-25-zabbix-fortigate',
  objectives: [
    'Mengaktifkan SNMP di FortiGate (GUI dan CLI) dengan aman.',
    'Menambahkan FortiGate sebagai host di Zabbix dengan template yang tepat.',
    'Memonitor metrik khusus firewall: session table, CPU, memory, dan interface.',
    'Memahami perbedaan pola metrik firewall vs router.',
    'Mengonfigurasi alert khusus firewall: session penuh, failover HA, dan utilisasi.',
  ],
  prerequisites: 'Part 23 (konsep Zabbix & SNMP), Part 24 (praktik tambah host & trigger), Part 15–17 (FortiGate dasar).',
  subbabs: [
    {
      id: '25.1',
      title: 'FortiGate SNMP',
      body: `<p>FortiGate punya SNMP agent bawaan (seperti MikroTik) plus <b>MIB khusus Fortinet</b> (enterprise <code>.12356</code>) untuk metrik firewall: jumlah session, CPU per proses, status HA. Sub-bab ini mengaktifkan SNMP via <b>GUI dan CLI</b> — karena FortiGate lazim dikelola lewat keduanya.</p>
<h3>Topology</h3>
<pre>[Zabbix 192.168.99.10] ──VLAN 99── [FortiGate FW1 192.168.99.2]
        UDP 161 query ────────────▶  (SNMP agent FortiOS)</pre>
<h3>Objective</h3>
<p>SNMP aktif di FW1, hanya bisa diquery dari 192.168.99.10.</p>
<h3>Configuration — GUI</h3>
<pre>System → SNMP:
1. Aktifkan "SNMP Agent" (Enable)
2. Buat SNMP v2c community baru:
   - Community name : public-lab
   - Hosts          : 192.168.99.10/32   ← ALASAN: hanya Zabbix yang boleh query
   - Query port     : 161
3. Catatan: FortiOS juga mendukung SNMPv3 (buat user di bagian SNMP Users)
   ALASAN v3 di production: sama seperti MikroTik — v2c teks-biasa tidak aman</pre>
<h3>Configuration — CLI (setara)</h3>
<pre># ALASAN tiap baris dijelaskan:
FW1 # config system snmp sysinfo
FW1 (sysinfo) # set status enable
FW1 (sysinfo) # set contact-info "noc@kantor.id"
FW1 (sysinfo) # set location "Ruang Server Lt2"
FW1 (sysinfo) # end
# ALASAN: identitas device — muncul di inventory Zabbix

FW1 # config system snmp community
FW1 (community) # edit 1
FW1 (1) # set name public-lab
FW1 (1) # config hosts
FW1 (1-hosts) # edit 1
FW1 (1) # set ip 192.168.99.10 255.255.255.255
FW1 (1) # end
# ALASAN hosts: daftar putih IP — FortiGate menolak query dari IP lain

FW1 # get system snmp sysinfo
# Expected output: status: enable, contact-info & location terisi

# Verifikasi dari server Zabbix:
$ snmpget -v2c -c public-lab 192.168.99.2 1.3.6.1.2.1.1.1.0
# Expected output: STRING: "FortiGate-60F v7.4.x,buildxxxx"</pre>
<div class="callout"><div class="t">GUI vs CLI di FortiGate</div><p style="margin:4px 0 0"><b>GUI</b> bagus untuk belajar & verifikasi visual; <b>CLI</b> wajib dikuasai untuk automation, dokumentasi sebagai teks, dan troubleshooting saat GUI tidak bisa diakses. Engineer profesional memakai keduanya — GUI untuk cek cepat, CLI untuk perubahan yang perlu direkam/diulang.</p></div>
<div class="callout blue"><div class="t">Catatan FortiOS</div><p style="margin:4px 0 0">Nama menu bisa sedikit berbeda antar FortiOS 7.2/7.4/7.6, tapi konsepnya sama: <i>System → SNMP → agent + community + hosts</i>. Selalu cek <i>Fortinet MIB reference</i> untuk versi FortiOS-mu karena OID bisa bertambah/berubah.</p></div>`,
      terms: [
        ['FortiOS', 'Sistem operasi FortiGate.'],
        ['FORTINET-FORTIGATE-MIB', 'MIB khusus Fortinet (enterprise .12356) untuk metrik firewall.'],
        ['SNMP community (FortiGate)', 'Diatur di System → SNMP → Communities + daftar hosts yang diizinkan.'],
      ],
      scenario: 'Engineer hanya tahu GUI; saat GUI FortiGate tidak bisa diakses karena interface management down, ia tidak bisa verifikasi SNMP. Engineer kedua memakai CLI via console dan menyelesaikan dalam 5 menit. Moral: CLI adalah jalur darurat yang wajib dikuasai.',
      bestPractices: 'Dokumentasikan setiap perubahan dalam DUA bentuk: screenshot GUI (untuk laporan) dan perintah CLI (untuk diulang/diautomation).',
      security: 'Batasi juga di firewall policy FortiGate: hanya allow UDP 161 dari Zabbix ke interface management; SNMP tidak boleh bisa diquery dari VLAN user/guest.',
      challenge: 'Aktifkan SNMP di FortiGate lab-mu via GUI, lalu verifikasi via CLI (get system snmp sysinfo) dan via snmpget dari server Zabbix. Catat: apakah ketiganya konsisten?',
      interviewQ: 'Q: "Kapan kamu pakai GUI dan kapan CLI di FortiGate?" — A: GUI untuk belajar, verifikasi visual, dan konfigurasi satu kali; CLI untuk automation, dokumentasi teks yang bisa diulang, dan troubleshooting saat GUI tidak bisa diakses.',
      quiz: [
        {
          q: 'Di FortiGate, pembatasan "hanya Zabbix yang boleh SNMP query" diatur di…',
          options: [
            'Password admin',
            'SNMP community → Hosts: 192.168.99.10/32',
            'DHCP server',
            'DNS setting',
          ],
          answer: 1,
          explain: 'Daftar hosts di community = whitelist IP yang boleh melakukan SNMP query.',
        },
        {
          q: 'Keuntungan menguasai CLI FortiGate selain GUI adalah…',
          options: [
            'Tidak ada, GUI cukup',
            'Automation, dokumentasi teks yang bisa diulang, dan jalur darurat saat GUI tidak bisa diakses',
            'CLI lebih berwarna',
            'CLI tidak butuh login',
          ],
          answer: 1,
          explain: 'CLI = repeatable, scriptable, dan tersedia via console saat GUI down.',
        },
        {
          q: 'MIB khusus Fortinet berada di enterprise OID…',
          options: ['.14988 (MikroTik)', '.12356 (Fortinet)', '.1.3.6.1.2.1 (mib-2)', '.99999'],
          answer: 1,
          explain: '.12356 adalah enterprise number Fortinet; .14988 milik MikroTik.',
        },
      ],
    },
    {
      id: '25.2',
      title: 'Add FortiGate',
      body: `<p>Menambahkan FW1 sebagai host di Zabbix — polanya sama seperti MikroTik (24.3), tapi dengan template dan macro khusus FortiGate.</p>
<h3>Objective</h3>
<p>Host "FW1-Jakarta" terdaftar, SNMP hijau, item dasar terisi.</p>
<h3>Configuration</h3>
<pre>Data collection → Hosts → Create host:
1. Host name  : FW1-Jakarta
2. Host groups: "Firewalls"
   ALASAN grup terpisah dari "Routers": action alert & dashboard berbeda
   (alert firewall = potensi keamanan, bukan sekadar konektivitas)
3. Interfaces : SNMP → 192.168.99.2 : 161
4. Templates  : link "FortiGate SNMP" (atau buat minimal sendiri):
   Item dasar:
   - sysDescr        → 1.3.6.1.2.1.1.1.0
   - sysUpTime       → 1.3.6.1.2.1.1.3.0
   - CPU             → 1.3.6.1.4.1.12356.101.4.1.3.0  (fgSysCpuUsage, %)
   - Memory          → 1.3.6.1.4.1.12356.101.4.1.4.0  (fgSysMemUsage, %)
   - Sessions        → 1.3.6.1.4.1.12356.101.4.1.8.0  (fgSysSesCount)
   - Discovery rule  → net.if.discovery (interface, sama seperti router)
5. Macros: {$SNMP_COMMUNITY} = public-lab
   ALASAN: konsisten dengan Part 24 — satu pola macro untuk semua device</pre>
<h3>Verification</h3>
<pre># Latest data → FW1-Jakarta:
# Expected: sysDescr "FortiGate-...", CPU/memory ada angka %, sessions terisi.
# Jika item Fortinet "Not supported": kemungkinan OID berbeda di versi FortiOS-mu
# → snmpwalk manual ke .1.3.6.1.4.1.12356.101.4.1 untuk melihat OID yang tersedia.</pre>
<div class="callout"><div class="t">OID Berbeda Antar Versi</div><p style="margin:4px 0 0">MIB Fortinet bisa berubah antar FortiOS. Jika OID dari tutorial tidak jalan, <b>snmpwalk cabang Fortinet</b> adalah sumber kebenaran — jangan hafalkan OID mati-matian, kuasai cara menemukannya.</p></div>`,
      terms: [
        ['fgSysCpuUsage', 'OID Fortinet untuk utilisasi CPU sistem (%).'],
        ['fgSysMemUsage', 'OID Fortinet untuk utilisasi memory (%).'],
        ['fgSysSesCount', 'OID Fortinet untuk jumlah session aktif.'],
      ],
      scenario: 'Setelah upgrade FortiOS 7.2 → 7.6, 5 item Fortinet "Not supported". Panik sesaat — ternyata satu OID berubah nama. snmpwalk 10 menit menemukan OID baru, template diupdate sekali, semua host FortiGate pulih. Pelajaran: kuasai metode, bukan hafalan.',
      bestPractices: 'Catat versi FortiOS di inventory/deskripsi host Zabbix — memudahkan korelasi saat OID berubah setelah upgrade.',
      security: 'Pisahkan host group "Firewalls" agar action alert-nya bisa mencakup tim security, bukan hanya NOC.',
      challenge: 'Jalankan snmpwalk ke cabang .1.3.6.1.4.1.12356.101.4.1 di FW1 lab-mu. Daftar semua OID yang merespons dan cocokkan dengan tabel di atas.',
      interviewQ: 'Q: "Item Fortinet Not supported setelah upgrade FortiOS — apa langkahmu?" — A: snmpwalk cabang Fortinet MIB untuk melihat OID yang tersedia di versi baru, update template sekali (berlaku semua host), verifikasi ulang.',
      quiz: [
        {
          q: 'Mengapa FortiGate dimasukkan ke host group "Firewalls" terpisah dari "Routers"?',
          options: [
            'Agar terlihat rapi',
            'Action alert & dashboard berbeda — masalah firewall = potensi keamanan, melibatkan tim security',
            'Zabbix mewajibkan',
            'Agar polling lebih cepat',
          ],
          answer: 1,
          explain: 'Group mencerminkan penanganan operasional: firewall punya implikasi keamanan tersendiri.',
        },
        {
          q: 'OID Fortinet tidak jalan setelah upgrade FortiOS. Sumber kebenaran untuk OID baru adalah…',
          options: [
            'Menebak-nebak',
            'snmpwalk ke cabang Fortinet MIB (.1.3.6.1.4.1.12356.101.4.1)',
            'Me-restart Zabbix',
            'Menghapus host',
          ],
          answer: 1,
          explain: 'Walk langsung ke device menunjukkan OID apa yang benar-benar tersedia di versi itu.',
        },
        {
          q: 'Metrik yang KHAS firewall dan tidak ada di router biasa adalah…',
          options: ['sysDescr', 'Jumlah session aktif (fgSysSesCount)', 'sysUpTime', 'Interface traffic'],
          answer: 1,
          explain: 'Session table adalah konsep stateful firewall — router murni tidak melacak session seperti ini.',
        },
      ],
    },
    {
      id: '25.3',
      title: 'Interface Monitoring',
      body: `<p>Interface FortiGate (wan1, lan, dmz) dipantau dengan pola yang sama seperti MikroTik: LLD + ifHCInOctets/ifHCOutOctets. Yang berbeda adalah <b>makna tiap interface</b>: di firewall, interface = batas zona keamanan.</p>
<h3>Objective</h3>
<p>Semua interface FW1 terdiscovery; traffic per zona (WAN/LAN/DMZ) terpantau.</p>
<h3>Configuration</h3>
<pre>Discovery rule net.if.discovery di template FortiGate (sama seperti 24.4):
- Item prototypes: in/out traffic (×8 → bps), operstatus, errors/discards
- Filter: kecualikan loopback & tunnel yang tidak relevan

PERBEDAAN KONSEP vs router:
- wan1  = traffic ke/dari internet → pantau untuk billing & serangan
- lan   = traffic user internal    → pantau untuk kapasitas & anomali
- dmz   = traffic server publik    → pantau untuk keamanan (server tidak boleh
  tiba-tiba upload besar ke internet!)

ALASAN pembedaan: di firewall, traffic antar-interface melewati POLICY.
Traffic "lan→wan1" yang melonjak = user; "dmz→wan1" melonjak = curiga.</pre>
<h3>Verification</h3>
<pre># Generate traffic: browsing dari PC office (vlan20 → lan → wan1 → internet)
# Latest data → FW1 → filter "wan1":
# Expected: out traffic wan1 NAIK bersamaan dengan aktivitas.
# Bandingkan dengan grafik ether1 R1 (24.5): angkanya seharusnya MIRIP
# (traffic yang lewat R1 juga lewat FW1) — korelasi antar-device = validasi kuat.</pre>
<div class="callout blue"><div class="t">Korelasi Antar-Device</div><p style="margin:4px 0 0">Traffic wan1 FortiGate seharusnya ≈ traffic ether1 MikroTik (jalur yang sama). Jika berbeda jauh, ada yang salah: salah interface, atau ada traffic yang tidak melewati salah satunya (asymmetric routing!).</p></div>`,
      terms: [
        ['Zona firewall', 'Segmen keamanan yang dibatasi interface FortiGate: wan, lan, dmz.'],
        ['Korelasi antar-device', 'Membandingkan metrik dua device di jalur yang sama untuk validasi.'],
      ],
      scenario: 'Grafik wan1 menunjukkan traffic 2x lipat dari ether1 R1. Investigasi: ada link backup yang aktif sebagian (asymmetric routing) — sebagian traffic kembali via jalur lain tanpa lewat R1. Tanpa perbandingan dua grafik, anomali routing ini tidak terlihat.',
      bestPractices: 'Beri nama interface FortiGate yang deskriptif (wan1-ISP, lan-Office) — nama muncul di grafik dan alert; "port3" tidak memberi informasi saat insiden.',
      security: 'Pantau traffic dmz→wan1 dengan trigger anomali — server DMZ yang tiba-tiba upload besar = indikasi kompromi server publik.',
      challenge: 'Bandingkan grafik wan1 (FW1) vs ether1 (R1) selama 1 jam di lab-mu. Selisihnya berapa persen? Jelaskan mengapa ada selisih (overhead? jalur berbeda?).',
      interviewQ: 'Q: "Apa beda memantau interface firewall vs router?" — A: Di firewall tiap interface adalah batas zona keamanan dengan policy; traffic dianalisis per zona (apakah wajar untuk zona itu), bukan sekadar total throughput.',
      quiz: [
        {
          q: 'Traffic dmz→wan1 yang tiba-tiba melonjak besar sebaiknya diperlakukan sebagai…',
          options: [
            'Kabar baik',
            'Potensi kompromi server DMZ — investigasi keamanan',
            'Tanda upgrade bandwidth',
            'Abaikan',
          ],
          answer: 1,
          explain: 'Server publik seharusnya pola traffic-nya stabil; upload misterius = indikasi exfiltrasi/kompromi.',
        },
        {
          q: 'Traffic wan1 FortiGate jauh berbeda dari ether1 MikroTik di jalur yang sama mengindikasikan…',
          options: [
            'Normal saja',
            'Kemungkinan salah interface terpantau atau asymmetric routing',
            'Zabbix rusak',
            'Hari libur',
          ],
          answer: 1,
          explain: 'Jalur yang sama seharusnya angkanya mirip; selisih besar = ada yang tidak beres di pemetaan atau routing.',
        },
        {
          q: 'Pola discovery interface FortiGate memakai…',
          options: [
            'Cara yang sama sekali berbeda dari router',
            'Pola yang sama: LLD + ifHCInOctets/ifHCOutOctets — yang beda adalah makna zona keamanannya',
            'Tidak bisa discovery otomatis',
            'Hanya manual',
          ],
          answer: 1,
          explain: 'Mekanisme SNMP-nya sama; yang berbeda adalah interpretasi keamanan per zona.',
        },
      ],
    },
    {
      id: '25.4',
      title: 'CPU',
      body: `<p>CPU FortiGate (<code>fgSysCpuUsage</code>) punya karakteristik khusus: selain routing, ia menangani <b>inspeksi keamanan</b> (IPS, antivirus, SSL inspection) yang sangat rakus CPU. CPU 70% di firewall dengan inspeksi penuh bisa jadi normal — konteksnya berbeda dari router.</p>
<h3>Objective</h3>
<p>Item CPU FW1 terisi; pahami konteks "normal" untuk firewall.</p>
<h3>Configuration</h3>
<pre>Item: "CPU utilization" → SNMP OID 1.3.6.1.4.1.12356.101.4.1.3.0, unit %, interval 60s

Trigger (sesuaikan dengan profil inspeksi!):
- "High CPU": avg(...,5m) > 85 → High
  ALASAN 85 (bukan 90 seperti router): firewall dengan SSL inspection penuh
  memang lebih berat — tapi tetap butuh headroom untuk serangan mendadak

Konteks pembacaan:
- CPU naik BERSAMAAN dengan session naik    → wajar (beban user/serangan trafik)
- CPU naik, session DATAR                    → curiga: proses internal / bug / serangan
  yang tidak menambah session (mis. IKE/IPsec issue, hash CPU)
- CPU 100% + session drop                    → firewall mulai menolak koneksi baru!
  Dampak user: "internet putus" padahal link hidup.</pre>
<h3>Verification</h3>
<pre># Aktifkan/nonaktifkan SSL inspection pada satu policy (lab), amati CPU:
# Expected: CPU NAIK saat inspeksi dinyalakan — inilah "biaya keamanan" yang terukur.
# Catat baseline: CPU idle FW1-mu berapa? (FortiGate kecil idle 5-15% itu normal.)</pre>
<div class="callout"><div class="t">Biaya Keamanan yang Terukur</div><p style="margin:4px 0 0">Setiap fitur keamanan (IPS, AV, SSL inspection) menambah CPU. Grafik "CPU vs fitur aktif" adalah data untuk keputusan: "apakah kita butuh FortiGate lebih besar, atau kurangi cakupan inspeksi?" — keputusan berbasis data, bukan asumsi.</p></div>`,
      terms: [
        ['SSL inspection', 'Fitur firewall membongkar enkripsi TLS untuk diinspeksi — sangat rakus CPU.'],
        ['Headroom', 'Ruang CPU bebas yang disisakan untuk lonjakan/serangan mendadak.'],
      ],
      scenario: 'Setelah mengaktifkan SSL inspection untuk semua user, CPU FortiGate naik dari 30% ke 75% permanen. Saat serangan DDoS kecil datang, CPU menyentuh 100% dan koneksi baru ditolak. Solusi: upgrade model FortiGate (data grafik menjadi justifikasi budget) + exclusion untuk traffic terpercaya.',
      bestPractices: 'Dokumentasikan "profil CPU" tiap perubahan policy keamanan: screenshot grafik sebelum-sesudah. Ini menjadi arsip keputusan kapasitas.',
      security: 'Jangan matikan inspeksi hanya karena CPU tinggi tanpa analisis risiko — turunkan cakupan secara selektif (by policy) bukan global.',
      challenge: 'Ukur "biaya" tiap fitur di lab: catat CPU idle, lalu nyalakan IPS, lalu AV, lalu SSL inspection satu per satu. Buat tabel biayanya.',
      interviewQ: 'Q: "CPU firewall 80% — apakah itu masalah?" — A: Tergantung konteks: dengan inspeksi penuh dan berkorelasi dengan session/traffic, bisa wajar; yang penting adalah headroom tersisa dan trennya — serta apakah berkorelasi dengan beban atau anomali.',
      quiz: [
        {
          q: 'Mengapa CPU firewall perlu dibaca dengan konteks berbeda dari router?',
          options: [
            'Tidak perlu, sama saja',
            'Firewall menanggung inspeksi keamanan (IPS/AV/SSL) yang rakus CPU — 70% bisa normal dengan inspeksi penuh',
            'CPU firewall tidak bisa dipantau',
            'Firewall tidak punya CPU',
          ],
          answer: 1,
          explain: 'Beban inspeksi adalah "biaya keamanan" yang wajar; konteks menentukan normal/tidaknya.',
        },
        {
          q: 'CPU 100% + session mulai drop artinya…',
          options: [
            'Firewall bekerja optimal',
            'Firewall menolak koneksi baru — user merasakan "internet putus" padahal link hidup',
            'Saatnya menambah user',
            'Normal',
          ],
          answer: 1,
          explain: 'Kehabisan CPU = tidak bisa memproses session baru; dampaknya seperti link down bagi user.',
        },
        {
          q: 'CPU naik tapi session datar mengindikasikan…',
          options: [
            'Beban user normal',
            'Anomali: proses internal/bug/serangan non-session — investigasi',
            'Butuh reboot rutin',
            'Grafik salah',
          ],
          answer: 1,
          explain: 'Tanpa korelasi beban, kenaikan CPU = ada proses liar yang harus ditemukan.',
        },
      ],
    },
    {
      id: '25.5',
      title: 'Memory',
      body: `<p>Memory FortiGate (<code>fgSysMemUsage</code>, %) erat kaitannya dengan <b>session table</b> — setiap koneksi yang dilacak memakan memory. Rumus kasarnya: <i>memory ≈ session × biaya per session</i>. Karena itu memory dan session SELALU dibaca berpasangan.</p>
<h3>Objective</h3>
<p>Item memory FW1 terisi; pahami hubungan memory-session.</p>
<h3>Configuration</h3>
<pre>Item: "Memory usage" → SNMP OID 1.3.6.1.4.1.12356.101.4.1.4.0, unit %, interval 60s

Trigger:
- "High memory": last(...) > 85 → High
  ALASAN: di atas 85%, FortiGate masuk mode "conserve" — mulai membatasi
  fitur (logging, AV) untuk bertahan hidup. Itu sinyal bahaya, bukan sekadar angka.

Baca berpasangan (buat graph gabungan!):
- Memory NAIK + session NAIK   → wajar (beban)
- Memory NAIK + session DATAR   → leak / proses abnormal
- Memory 85%+                  → cek status conserve: get system performance status</pre>
<h3>Verification</h3>
<pre># Di CLI FortiGate saat lab idle vs saat banyak koneksi (buka banyak tab browsing):
FW1 # get system performance status
# Expected output: memori + session count; korelasikan dengan grafik Zabbix.
# Pastikan angka Zabbix ≈ angka CLI (validasi dua sumber).</pre>
<div class="callout"><div class="t">Conserve Mode</div><p style="margin:4px 0 0"><b>Conserve mode</b> = FortiGate kehabisan memory dan mematikan fitur non-esensial demi bertahan. Jika Zabbix menunjukkan memory &gt;85%, verifikasi via CLI apakah conserve aktif — karena dalam mode ini proteksimu berkurang!</p></div>`,
      terms: [
        ['Conserve mode', 'Mode darurat FortiGate saat memory kritis: fitur non-esensial dimatikan.'],
        ['fgSysMemUsage', 'OID Fortinet untuk utilisasi memory (%).'],
      ],
      scenario: 'FortiGate masuk conserve mode tiap jam 9 pagi — AV dan logging mati tanpa ada yang sadar selama 2 minggu (masa rentan keamanan!). Grafik Zabbix sebenarnya sudah menunjukkan memory 87% tiap pagi (pola backup + update massal). Alert 85% yang baru dipasang mencegah kebutaan berikutnya.',
      bestPractices: 'Alert memory firewall di 85% (bukan 90%) — karena di atas itu fitur keamanan mulai dikorbankan.',
      security: 'Serangan SYN flood bertujuan menghabiskan session+memory hingga conserve mode — saat proteksi melemah, serangan lanjutan masuk. Monitor session+memory sebagai pasangan anti-DoS.',
      challenge: 'Buat graph gabungan "Memory % + Session count" di Zabbix untuk FW1. Amati 24 jam: apakah keduanya bergerak bersama? Kapan tidak?',
      interviewQ: 'Q: "Mengapa memory firewall di-alert di 85%, bukan 90%?" — A: Di atas ~85% FortiGate masuk conserve mode dan mematikan fitur keamanan (AV, logging) — alert harus datang SEBELUM proteksi dikorbankan.',
      quiz: [
        {
          q: 'Hubungan memory dan session di FortiGate adalah…',
          options: [
            'Tidak berhubungan',
            'Setiap session memakan memory — keduanya selalu dibaca berpasangan',
            'Session mengurangi memory',
            'Memory hanya untuk log',
          ],
          answer: 1,
          explain: 'Session table memakan memory per koneksi; analisis satu tanpa yang lain menyesatkan.',
        },
        {
          q: 'Conserve mode adalah…',
          options: [
            'Mode hemat listrik',
            'Mode darurat saat memory kritis: FortiGate mematikan fitur non-esensial (termasuk sebagian proteksi)',
            'Mode backup',
            'Mode update firmware',
          ],
          answer: 1,
          explain: 'Bertahan hidup dengan mengorbankan fitur — masa rentan keamanan yang harus dihindari.',
        },
        {
          q: 'Memory naik tapi session datar mengindikasikan…',
          options: ['Beban normal', 'Kemungkinan memory leak / proses abnormal — investigasi', 'Butuh lebih banyak user', 'Grafik error'],
          answer: 1,
          explain: 'Tanpa kenaikan session, kenaikan memory = ada konsumsi abnormal yang harus ditemukan.',
        },
      ],
    },
    {
      id: '25.6',
      title: 'Sessions',
      body: `<p><b>Session</b> adalah koneksi yang sedang dilacak firewall (stateful inspection): tiap TCP connection, tiap aliran UDP/DNS. <code>fgSysSesCount</code> (OID <code>1.3.6.1.4.1.12356.101.4.1.8.0</code>) menunjukkan bebannya. Session adalah <b>detak jantung firewall</b> — metrik ini tidak ada di router biasa.</p>
<h3>Mengapa Session Penting?</h3>
<ul>
<li><b>Kapasitas:</b> tiap model FortiGate punya batas session (mis. 1,3 juta). Mendekati batas = koneksi baru ditolak.</li>
<li><b>Deteksi serangan:</b> SYN flood / scan = ledakan session dari sedikit IP.</li>
<li><b>Korelasi:</b> session menjelaskan CPU & memory (25.4–25.5).</li>
<li><b>Anomali user:</b> 1 PC dengan 50.000 session = kemungkinan malware/bot.</li>
</ul>
<h3>Configuration</h3>
<pre>Item: "Active sessions" → SNMP OID 1.3.6.1.4.1.12356.101.4.1.8.0
      Unit: (kosongkan/conn), interval 60s
      ALASAN interval 60s: session berubah sangat cepat; butuh granularitas

Trigger:
- "High session count": last(...) > {$SES_HIGH} → Warning
  ALASAN macro: batas session BERBEDA tiap model FortiGate — sesuaikan!
  Contoh: 60F ≈ 1,3 juta → set {$SES_HIGH} = 1000000 (∼75% kapasitas)
- "Session spike": change(/FW1/session.count,5m) > {$SES_SPIKE}
  ALASAN change: mendeteksi LEDAKAN mendadak (serangan), bukan level tinggi yang stabil

Saat trigger spike berbunyi, drill-down di FortiGate:
FW1 # diagnose sys session stat
# Expected output: rincian session per protokol — TCP/UDP/ICMP mana yang meledak?
FW1 # diagnose sys session list | grep -c "src="
# (hitung kasar; di production pakai FortiAnalyzer untuk analisis detail)</pre>
<h3>Verification</h3>
<pre># Buka 20 tab browsing sekaligus dari PC lab → amati session count NAIK.
# Tutup semua → TURUN. Expected: responsif terhadap aktivitas nyata.
# Catat baseline idle FW1-mu (biasanya ratusan–ribuan di lab kecil).</pre>
<div class="callout"><div class="t">Session vs Connection</div><p style="margin:4px 0 0">Satu "koneksi" user (buka website) bisa memakai <b>puluhan session</b> (DNS, HTTP/2 streams, keepalive). Jangan samakan "1000 session" dengan "1000 user" — session selalu jauh lebih besar.</p></div>`,
      terms: [
        ['Session', 'Koneksi yang dilacak stateful firewall — unit beban utama FortiGate.'],
        ['fgSysSesCount', 'OID Fortinet untuk jumlah session aktif.'],
        ['SYN flood', 'Serangan membanjiri SYN untuk menghabiskan session table.'],
        ['Stateful inspection', 'Firewall melacak status tiap koneksi, bukan sekadar port.'],
      ],
      scenario: 'Grafik session FortiGate melonjak dari 8.000 ke 400.000 dalam 3 menit dari 2 IP internal. Drill-down: SYN flood dari PC terinfeksi malware. PC diisolasi, session kembali normal. Tanpa monitoring session, yang terlihat hanya "internet lambat" tanpa petunjuk.',
      bestPractices: 'Tentukan {$SES_HIGH} = 75% dari kapasitas model FortiGate-mu (cek datasheet) — bukan angka tebakan.',
      security: 'Buat trigger spike session sebagai tripwire DDoS — gabungkan dengan action "kirim ke tim security", bukan hanya NOC.',
      challenge: 'Cari datasheet model FortiGate lab-mu (atau FortiGate-60F sebagai contoh): berapa max session-nya? Hitung 75%-nya dan jadikan {$SES_HIGH}.',
      interviewQ: 'Q: "Apa beda monitoring session di firewall vs memantau koneksi di router?" — A: Router tidak stateful — ia meneruskan paket tanpa melacak koneksi; firewall stateful melacak tiap session sebagai unit kerja dan keamanan, sehingga session count adalah metrik kapasitas dan deteksi serangan.',
      quiz: [
        {
          q: 'Ledakan session mendadak (spike) paling baik dideteksi dengan…',
          options: [
            'Nilai absolut saja',
            'Fungsi change() — mendeteksi laju perubahan mendadak, bukan level stabil',
            'Warna grafik',
            'Menebak',
          ],
          answer: 1,
          explain: 'change() menangkap "seberapa cepat naik" — pola khas serangan vs beban normal yang stabil.',
        },
        {
          q: 'Satu PC dengan 50.000 session mengindikasikan…',
          options: [
            'User rajin',
            'Kemungkinan malware/bot — investigasi keamanan',
            'Browser baru',
            'Normal',
          ],
          answer: 1,
          explain: 'Session abnormal dari satu sumber = pola infeksi/C2 — isolasi dan periksa.',
        },
        {
          q: 'Mengapa ambang session memakai macro {$SES_HIGH}?',
          options: [
            'Agar keren',
            'Batas session berbeda tiap model FortiGate — macro memudahkan penyesuaian',
            'Wajib Zabbix',
            'Agar cepat',
          ],
          answer: 1,
          explain: 'Kapasitas session adalah spesifikasi hardware; macro menghindari hardcode yang salah untuk model lain.',
        },
      ],
    },
    {
      id: '25.7',
      title: 'Traffic',
      body: `<p>Traffic FortiGate dibaca per interface (25.3), tapi analisisnya khas firewall: <b>siapa boleh ke mana</b> tercermin di pola traffic. Traffic yang melanggar ekspektasi policy = temuan keamanan.</p>
<h3>Objective</h3>
<p>Memahami pola traffic normal per zona dan menyiapkan tripwire anomali.</p>
<h3>Configuration & Analisis</h3>
<pre>Graph yang dibuat (per interface FW1):
- wan1 : in/out (internet) — untuk billing & deteksi serangan masuk
- lan  : in/out (user)     — untuk kapasitas & anomali user
- dmz  : in/out (server)   — untuk keamanan server publik

Tripwire (trigger anomali):
1. "DMZ high outbound": avg(net.if.out[dmz],15m) > {$DMZ_OUT_MAX}
   ALASAN: server DMZ seharusnya melayani (inbound dominan); outbound besar = curiga
2. "WAN ingress spike": change(net.if.in[wan1],5m) > {$WAN_SPIKE}
   ALASAN: banjir masuk mendadak = potensi DDoS — korelasikan dengan session spike (25.6)
3. "LAN after-hours traffic": traffic lan signifikan pukul 00–05
   ALASAN: kantor kosong tapi traffic ramai = device terinfeksi / akses tak resmi
   (implementasi: trigger dengan time-based condition di action)</pre>
<h3>Verification</h3>
<pre># Uji tripwire 1 (lab): dari server DMZ, upload file besar ke internet (scp/curl).
# Expected: trigger "DMZ high outbound" PROBLEM → bukti tripwire bekerja.
# Hentikan → RECOVERY. Catat waktu deteksi (target < 15 menit sesuai avg 15m).</pre>
<div class="callout blue"><div class="t">Firewall Melihat "Izin", Bukan Sekadar "Jalan"</div><p style="margin:4px 0 0">Router menjawab "berapa banyak lewat"; firewall menjawab "apakah ini SEHARUSNYA lewat". Dua pertanyaan berbeda — karena itu monitoring firewall selalu dikaitkan dengan policy.</p></div>`,
      terms: [
        ['Tripwire', 'Trigger anomali yang "berbunyi" saat pola tak wajar terdeteksi.'],
        ['Ingress/egress', 'Traffic masuk (ingress) / keluar (egress) dari sudut pandang firewall.'],
      ],
      scenario: 'Server web DMZ tiba-tiba upload 40 GB ke IP asing jam 2 pagi — tripwire "DMZ high outbound" berbunyi 12 menit kemudian. Investigasi: webshell terinstal via plugin CMS yang tidak diupdate. Server diisolasi sebelum database sempat dicuri. Tanpa tripwire, ketahuan saat data sudah bocor.',
      bestPractices: 'Review tripwire tiap ada perubahan policy firewall — policy baru yang legitimate bisa memicu false positive jika tripwire tidak disesuaikan.',
      security: 'Tripwire adalah defense-in-depth: ia tidak mencegah serangan, tapi memperpendek waktu deteksi (dwell time) — metrik keamanan yang penting.',
      challenge: 'Definisikan "pola normal" tiap zona di lab-mu dalam 1 kalimat per zona (mis. "lan: download-heavy jam kerja"). Lalu tulis 1 tripwire per zona.',
      interviewQ: 'Q: "Apa beda analisis traffic di firewall vs router?" — A: Router: volume dan kapasitas ("berapa banyak"); firewall: kesesuaian dengan policy ("apakah seharusnya") — traffic yang melanggar ekspektasi zona adalah temuan keamanan.',
      quiz: [
        {
          q: 'Server DMZ yang tiba-tiba upload besar ke internet adalah…',
          options: [
            'Hal biasa',
            'Anomali keamanan — server DMZ seharusnya inbound-dominan; selidiki kompromi/exfiltrasi',
            'Tanda server sehat',
            'Perlu tambah RAM',
          ],
          answer: 1,
          explain: 'Pola traffic server publik yang stabil; perubahan drastis = indikasi insiden.',
        },
        {
          q: 'Traffic LAN yang ramai pukul 02.00 saat kantor kosong mengindikasikan…',
          options: [
            'Hantu',
            'Potensi device terinfeksi atau akses tak resmi — investigasi',
            'Update Windows biasa (tapi tetap verifikasi)',
            'Keduanya B dan C — verifikasi dulu sebelum menyimpulkan',
          ],
          answer: 3,
          explain: 'Bisa legitimate (update otomatis) atau malicious — tripwire meminta verifikasi, bukan vonis.',
        },
        {
          q: 'Tripwire security sebaiknya…',
          options: [
            'Tidak pernah diubah',
            'Direview tiap ada perubahan policy firewall agar tidak false positive',
            'Dihapus setelah sebulan',
            'Hanya untuk WAN',
          ],
          answer: 1,
          explain: 'Policy baru yang legitimate mengubah "pola normal" — tripwire harus ikut disesuaikan.',
        },
      ],
    },
    {
      id: '25.8',
      title: 'Availability',
      body: `<p>Availability FortiGate = "apakah firewall hidup DAN meneruskan traffic dengan benar". Ping OK saja tidak cukup: FortiGate bisa menjawab ping tapi <b>daemon firewall-nya hang</b>. Karena itu availability firewall diukur berlapis.</p>
<h3>Tiga Lapis Pengecekan</h3>
<div class="tblwrap"><table>
<tr><th>Lapis</th><th>Cek</th><th>Item Zabbix</th></tr>
<tr><td>1. Device hidup</td><td>Ping ke FW1</td><td>icmpping (template ICMP Ping)</td></tr>
<tr><td>2. Layanan SNMP</td><td>SNMP merespons</td><td>sysUpTime berubah (tanda OS jalan)</td></tr>
<tr><td>3. Traffic mengalir</td><td>Ada throughput di wan1/lan</td><td>net.if.in[wan1] > 0 (di jam kerja)</td></tr>
</table></div>
<h3>Configuration</h3>
<pre>Trigger "FW1 availability problem" (komposit):
  last(/FW1-Jakarta/icmpping)=0 → Disaster "FW1 DOWN"
  ALASAN Disaster: firewall down = seluruh akses internet & antar-zona lumpuh

Trigger "FW1 silent" (kasus langka tapi nyata):
  avg(/FW1-Jakarta/net.if.in[wan1],15m)=0 and time()-... (jam kerja)
  → High "FW1 tidak meneruskan traffic"
  ALASAN: mendeteksi "hidup tapi tidak bekerja" — ping OK, SNMP OK, tapi 0 throughput.
  (Implementasi sederhana: cek manual saat anomali; trigger otomatis butuh fungsi time-based)

Untuk HA (jika ada 2 FortiGate cluster):
  Monitor fgHaStats via SNMP + trigger "HA failover terjadi"
  ALASAN: failover = peristiwa penting yang harus tercatat & diinvestigasi penyebabnya,
  walau layanan tidak terputus.</pre>
<h3>Verification</h3>
<pre># Simulasi "hidup tapi tidak bekerja" (lab, hati-hati):
# Buat policy deny all sementara di atas policy allow → traffic 0, ping tetap OK.
# Expected: lapis 1-2 hijau, lapis 3 menunjukkan anomali → NOC tahu "bukan device down,
# melainkan policy/traffic problem". Kembalikan policy setelah uji!</pre>
<div class="callout"><div class="t">SLA Firewall</div><p style="margin:4px 0 0">Untuk laporan manajemen, availability firewall dihitung dari trigger "FW1 DOWN" (23.16). Target umum: 99,9% — dengan HA aktif, target bisa 99,99%.</p></div>`,
      terms: [
        ['Availability berlapis', 'Mengukur hidup (ping), layanan (SNMP), dan fungsi (traffic) — bukan hanya ping.'],
        ['HA failover', 'Perpindahan peran antar FortiGate cluster saat satu unit bermasalah.'],
        ['Silent failure', '"Hidup tapi tidak bekerja" — device merespons tapi tidak meneruskan traffic.'],
      ],
      scenario: 'Firewall menjawab ping dan SNMP normal, tapi user tidak bisa internet. NOC awalnya bilang "firewall OK". Ternyata policy deny-all tidak sengaja ter-commit di urutan teratas. Sejak itu NOC memakai cek 3 lapis: "ping OK + SNMP OK + traffic NOL = masalah policy/fungsi, bukan device".',
      bestPractices: 'Untuk firewall, definisikan availability sebagai "traffic mengalir sesuai policy", bukan sekadar "device hidup".',
      security: 'Setiap HA failover harus diinvestigasi penyebabnya — failover yang sering = masalah hardware/sync yang akan menjadi outage saat kedua unit bermasalah.',
      challenge: 'Tulis definisi "FW1 sehat" versi 3 lapis untuk lab-mu dalam bentuk checklist yang bisa dipakai operator NOC shift malam.',
      interviewQ: 'Q: "Firewall ping OK tapi user tidak bisa internet — apa yang kamu cek?" — A: Tiga lapis: SNMP/sysUpTime (OS jalan?), throughput interface (traffic mengalir?), lalu policy & routing (apakah ada deny yang salah urutan, route hilang, atau session table penuh).',
      quiz: [
        {
          q: 'Mengapa availability firewall tidak cukup diukur dengan ping?',
          options: [
            'Ping terlalu cepat',
            'Firewall bisa menjawab ping sementara daemon/policy-nya bermasalah — butuh cek SNMP dan throughput juga',
            'Ping tidak akurat',
            'Zabbix tidak bisa ping',
          ],
          answer: 1,
          explain: 'Ping hanya lapis 1; "hidup tapi tidak bekerja" butuh lapis 2 (layanan) dan 3 (fungsi).',
        },
        {
          q: 'HA failover yang terjadi sebaiknya…',
          options: [
            'Diabaikan karena layanan tidak putus',
            'Dicatat dan diinvestigasi penyebabnya — failover sering = masalah yang akan jadi outage',
            'Dirayakan',
            'Disembunyikan dari laporan',
          ],
          answer: 1,
          explain: 'Failover adalah gejala; penyebabnya (hardware/sync) harus ditemukan sebelum kedua unit gagal.',
        },
        {
          q: '"Silent failure" pada firewall artinya…',
          options: [
            'Firewall meledak tanpa suara',
            'Device merespons (ping/SNMP OK) tetapi tidak meneruskan traffic',
            'Kipas mati',
            'Tidak ada log',
          ],
          answer: 1,
          explain: 'Kondisi menipu: semua cek dasar hijau, tapi fungsi utama mati — butuh cek throughput.',
        },
      ],
    },
    {
      id: '25.9',
      title: 'Alerting',
      body: `<p>Alerting FortiGate mengikuti pola Part 24 (media → action → eskalasi), dengan <b>perbedaan penting</b>: masalah firewall sering = masalah keamanan, sehingga penerima dan severity-nya berbeda.</p>
<h3>Objective</h3>
<p>Action khusus firewall: severity tepat, penerima mencakup tim security untuk isu keamanan.</p>
<h3>Configuration</h3>
<pre>Alerts → Actions → "Firewall critical":
Conditions:
  - Trigger severity >= High
  - Host group = Firewalls
Operations:
  Step 1 (0m): Telegram ke "noc-duty" + Email ke "soc-team@kantor.id"
    ALASAN soc-team: session spike / conserve mode / DMZ anomaly = ranah security,
    bukan sekadar operasional. NOC + SOC keduanya harus tahu.
  Step 2 (15m, jika belum ack): Telegram ke on-call + IT manager
Recovery: kirim RESOLVED ke semua

Matriks severity → aksi (rekomendasi):
  Disaster (FW down)      → Telegram NOC + SMS on-call + telepon manager
  High (CPU/mem/session)  → Telegram NOC + email SOC
  Warning (utilisasi)      → Email NOC (dibaca pagi hari)
  ALASAN pembedaan: tidak semua masalah firewall harus membangunkan orang —
  tapi masalah keamanan TIDAK BOLEH hanya jadi email yang dibaca besok.</pre>
<h3>Verification</h3>
<pre># Drill: picu "High session" buatan (atau turunkan ambang sementara ke nilai kecil).
# Expected: NOC menerima Telegram DAN SOC menerima email dalam ±2 menit.
# Kembalikan ambang setelah drill — JANGAN lupa! (Ambang drill yang tertinggal =
# false alarm massal berikutnya.)</pre>
<div class="callout"><div class="t">NOC vs SOC</div><p style="margin:4px 0 0"><b>NOC</b> (Network Operations Center): menjaga jaringan jalan. <b>SOC</b> (Security Operations Center): menjaga dari serangan. Masalah firewall sering menyentuh keduanya — action alert harus mencerminkan itu.</p></div>`,
      terms: [
        ['SOC', 'Security Operations Center — tim yang menangani insiden keamanan.'],
        ['Matriks severity', 'Pemetaan severity → media → penerima alert.'],
      ],
      scenario: 'Session spike jam 3 pagi hanya terkirim sebagai email ke NOC — dibaca jam 8 pagi. Lima jam dwell time serangan. Setelah matriks baru, spike yang sama membangunkan on-call NOC + SOC dalam 2 menit via Telegram. Dwell time: 2 menit.',
      bestPractices: 'Definisikan matriks severity→aksi secara tertulis dan disetujui kedua tim (NOC & SOC) — jangan biarkan "siapa yang dibangunkan" diputuskan saat insiden.',
      security: 'Pastikan SOC punya akses read ke dashboard FortiGate di Zabbix — mereka tidak bisa merespons yang tidak bisa mereka lihat.',
      challenge: 'Tulis matriks alerting untuk organisasimu (atau khayalan): 4 severity × media × penerima × jeda eskalasi. Minta "persetujuan" dari teman sebagai simulasi.',
      interviewQ: 'Q: "Apa beda alerting firewall vs router?" — A: Masalah firewall sering berdimensi keamanan sehingga penerima mencakup SOC, bukan hanya NOC; severity memetakan ke matriks aksi yang disepakati kedua tim; dan tripwire anomali (DMZ outbound, session spike) bersifat proaktif-keamanan.',
      quiz: [
        {
          q: 'Mengapa alert High pada firewall dikirim ke NOC DAN SOC?',
          options: [
            'Agar ramai',
            'Masalah firewall sering berdimensi keamanan — butuh kedua tim',
            'SOC tidak punya kerjaan',
            'Wajib regulasi Telegram',
          ],
          answer: 1,
          explain: 'Session spike / conserve / anomali DMZ = potensi serangan; SOC harus terlibat sejak menit awal.',
        },
        {
          q: 'Setelah drill dengan ambang yang diturunkan, hal yang WAJIB dilakukan adalah…',
          options: [
            'Biarkan saja',
            'Kembalikan ambang ke nilai normal — ambang drill yang tertinggal = false alarm massal',
            'Hapus trigger',
            'Matikan Zabbix',
          ],
          answer: 1,
          explain: 'Konfigurasi sementara yang tertinggal adalah sumber insiden berikutnya.',
        },
        {
          q: 'Prinsip matriks severity→aksi yang baik adalah…',
          options: [
            'Semua severity membangunkan semua orang',
            'Proporsional: Disaster membangunkan, Warning cukup email pagi — disepakati NOC & SOC sebelumnya',
            'Hanya email untuk semua',
            'Tanpa eskalasi',
          ],
          answer: 1,
          explain: 'Proporsionalitas mencegah alert fatigue; kesepakatan awal mencegah debat saat insiden.',
        },
      ],
    },
  ],
};