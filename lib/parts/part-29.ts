// Part 29 — Network Security (Fase 6).
import type { Part } from './types';

export const part29: Part = {
  id: '29',
  number: 'PART 29',
  title: 'Network Security',
  phaseId: 'fase-6',
  description: 'Fondasi keamanan jaringan: firewall, ACL, segmentasi, hardening SSH/password/SNMP, logging, backup, dan monitoring keamanan.',
  repoFolder: 'part-29-network-security',
  objectives: [
    'Menjelaskan prinsip keamanan jaringan (CIA triad, defense in depth, least privilege) dan menerapkannya pada desain VLAN 10/20/30/40/99.',
    'Mengkonfigurasi kontrol akses berlapis: firewall policy, ACL, segmentasi, port-security, dan management VLAN.',
    'Melakukan hardening perangkat: SSH, password, SNMP, logging, dan backup konfigurasi di Cisco IOS dan MikroTik.',
    'Membangun monitoring keamanan dasar yang terhubung dengan Zabbix/Grafana (Part 23–27).',
  ],
  prerequisites: 'Part 01–28 (terutama VLAN & segmentasi, firewall & NAT, dan troubleshooting — keamanan adalah "pengerasan" dari semua itu).',
  subbabs: [
    {
      id: '29.1',
      title: 'Network Security Fundamentals',
      body: `<p><b>Network security</b> adalah praktik melindungi jaringan (dan data yang lewat di atasnya) dari akses tak sah, gangguan, dan pencurian — dengan tetap menjaga layanan <i>tetap bisa dipakai</i> oleh yang berhak. Keamanan yang membuat user tidak bisa kerja adalah keamanan yang gagal.</p>
<h3>Tiga Pilar: CIA Triad</h3>
<div class="tblwrap"><table>
<tr><th>Pilar</th><th>Arti</th><th>Contoh di Jaringan</th></tr>
<tr><td><b>C</b>onfidentiality</td><td>Data hanya dibaca pihak berhak</td><td>Enkripsi VPN, segmentasi VLAN (tamu tak bisa intip server)</td></tr>
<tr><td><b>I</b>ntegrity</td><td>Data tidak diubah diam-diam</td><td>Hash/checksum, routing protocol authentication</td></tr>
<tr><td><b>A</b>vailability</td><td>Layanan tetap jalan saat dibutuhkan</td><td>Redundancy/HA (Part 30), anti-DDoS, backup config</td></tr>
</table></div>
<h3>Dua Prinsip Desain</h3>
<ul>
<li><b>Defense in depth (pertahanan berlapis):</b> jangan mengandalkan satu benteng. Firewall di edge + segmentasi VLAN + ACL di switch + hardening device + monitoring = penyerang harus menembus <i>banyak</i> lapis, bukan satu.</li>
<li><b>Least privilege:</b> setiap user/device/segmen hanya mendapat akses <i>seminimal yang dibutuhkan</i> untuk bekerja. Inilah alasan VLAN 40 GUEST hanya boleh ke internet, dan VLAN 99 MANAGEMENT hanya untuk admin.</li>
</ul>
<h3>Memetakan ke Desain Kurikulum</h3>
<div class="tblwrap"><table>
<tr><th>VLAN</th><th>Segmen</th><th>Trust Level</th><th>Kebijakan Keamanan</th></tr>
<tr><td>10</td><td>CCTV</td><td>Rendah (IoT)</td><td>Tidak boleh ke internet; hanya NVR & IT yang boleh akses</td></tr>
<tr><td>20</td><td>OFFICE</td><td>Sedang</td><td>Boleh ke server & internet via firewall policy</td></tr>
<tr><td>30</td><td>SERVER</td><td>Tinggi (aset)</td><td>Akses masuk sangat dibatasi, hanya port layanan perlu</td></tr>
<tr><td>40</td><td>GUEST</td><td>Tidak dipercaya</td><td>Hanya internet; dilarang total ke segmen internal</td></tr>
<tr><td>99</td><td>MANAGEMENT</td><td>Tertinggi</td><td>Hanya admin; SSH/SNMP hanya dari sini</td></tr>
</table></div>
<div class="callout blue"><div class="t">Keamanan = Desain, Bukan Tambalan</div><p style="margin:4px 0 0">Segmentasi yang kamu pelajari di Part 01 <i>adalah</i> keputusan keamanan. Firewall policy di Part 18 <i>adalah</i> least privilege. Part 29 ini merangkai semuanya menjadi strategi utuh — bukan sekadar "pasang antivirus".</p></div>`,
      terms: [
        ['CIA triad', 'Confidentiality, Integrity, Availability — tiga tujuan keamanan informasi.'],
        ['Defense in depth', 'Pertahanan berlapis: banyak kontrol saling melengkapi, bukan satu benteng tunggal.'],
        ['Least privilege', 'Hak akses seminimal yang dibutuhkan — prinsip inti segmentasi & firewall policy.'],
        ['Threat / Vulnerability / Risk', 'Ancaman (penyerang), kelemahan (celah), risiko (dampak × kemungkinan).'],
        ['Attack surface', 'Total titik yang bisa diserang — makin kecil makin baik (matikan layanan tak perlu!).'],
      ],
      diagram: `<pre>   DEFENSE IN DEPTH pada desain kurikulum

   [Internet]
       │  Lapisan 1: Firewall edge (policy + NAT) — Part 18
       ▼
   ┌────────────────────────────────────────┐
   │ Lapisan 2: Segmentasi VLAN 10/20/30/40/99│  ← least privilege per segmen
   │  (tamu tak bisa menyentuh server)       │
   ├────────────────────────────────────────┤
   │ Lapisan 3: ACL di switch/router         │  ← kontrol antar-segmen
   ├────────────────────────────────────────┤
   │ Lapisan 4: Hardening device             │  ← SSH, password, SNMP (part ini)
   │  (SSH saja, password kuat, SNMP v3)     │
   ├────────────────────────────────────────┤
   │ Lapisan 5: Monitoring & logging         │  ← deteksi anomali (Part 23–27)
   └────────────────────────────────────────┘
   Menembus 1 lapis ≠ menembus semuanya.</pre>`,
      scenario: 'Ransomware masuk lewat laptop tamu yang terhubung ke Wi-Fi kantor. Di jaringan flat, ia menyebar ke server dalam hitungan menit. Di desain tersegmentasi (Part ini): laptop tamu di VLAN 40 yang <i>hanya boleh ke internet</i> — ransomware tidak punya jalan ke VLAN 30 SERVER. Segmentasi mengubah bencana menjadi insiden kecil.',
      bestPractices: 'Setiap keputusan desain jaringan tanyakan: "kalau segmen ini disusupi, ke mana penyerang bisa pergi?" Jawabannya menentukan firewall policy-mu.',
      security: 'Keamanan berlebih yang melumpuhkan kerja user akan "diakali" user (shadow IT) — dan itu lebih berbahaya. Seimbangkan: ketat di tempat yang penting, longgar di tempat yang aman.',
      challenge: 'Gambar ulang topologimu dan beri label trust level + satu kalimat kebijakan per VLAN (seperti tabel di atas). Inilah "security policy" versi satu halaman.',
      interviewQ: 'Q: "Jelaskan defense in depth dengan contoh jaringan kantor." — A: Berlapis: firewall edge, segmentasi VLAN (guest terisolasi), ACL antar-segmen, hardening device (SSH/password), dan monitoring — penyerang harus menembus semuanya, bukan satu.',
      quiz: [
        { q: 'CIA triad terdiri dari…', options: ['Central, Internal, Access', 'Confidentiality, Integrity, Availability', 'Cisco, Intel, AMD', 'Client, Internet, Admin'], answer: 1, explain: 'Tiga tujuan keamanan: kerahasiaan, keutuhan data, dan ketersediaan layanan.' },
        { q: 'Mengapa VLAN 40 GUEST hanya boleh ke internet?', options: ['Agar hemat bandwidth', 'Prinsip least privilege — segmen tak dipercaya diberi akses minimal', 'Karena aturan ISP', 'Agar cepat'], answer: 1, explain: 'Least privilege: tamu hanya butuh internet, maka hanya itu yang diberikan — meminimalkan dampak bila disusupi.' },
        { q: 'Defense in depth berarti…', options: ['Satu firewall mahal', 'Banyak lapisan pertahanan saling melengkapi', 'Banyak password', 'Tanpa internet'], answer: 1, explain: 'Satu benteng bisa jebol; berlapis berarti penyerang harus menembus firewall + segmentasi + ACL + hardening + monitoring.' },
      ],
    },
    {
      id: '29.2',
      title: 'Firewall',
      body: `<p><b>Firewall</b> adalah penjaga gerbang jaringan yang memutuskan paket <b>boleh lewat atau diblokir</b> berdasarkan policy. Ia adalah kontrol keamanan paling terlihat — dan paling sering salah konfigurasi. (Mekanisme diagnosis firewall sudah dibahas di 28.14; di sini fokus ke <i>desain keamanannya</i>.)</p>
<h3>Stateful vs Stateless</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Cara Kerja</th><th>Contoh</th></tr>
<tr><td><b>Stateless</b> (packet filter)</td><td>Menilai tiap paket sendirian, tanpa ingat koneksi</td><td>ACL Cisco sederhana</td></tr>
<tr><td><b>Stateful</b></td><td>Mengingat tabel koneksi; balasan dari koneksi sah otomatis lolos</td><td>FortiGate, iptables, MikroTik connection tracking</td></tr>
</table></div>
<p><b>Alasan stateful lebih aman & praktis:</b> kamu cukup membuat policy satu arah ("OFFICE boleh ke internet"); paket balasannya diizinkan otomatis karena tercatat sebagai bagian koneksi yang sah — tanpa policy tambahan yang berisiko.</p>
<h3>Desain Policy dengan Zone/Trust Level</h3>
<p>Firewall modern (FortiGate) memakai <b>zone</b>: interface dikelompokkan (WAN, LAN-OFFICE, DMZ, GUEST), dan policy ditulis antar-zone. Pola amannya:</p>
<ul>
<li><b>GUEST → WAN:</b> allow (HTTP/HTTPS/DNS saja). <b>GUEST → LAN apa pun:</b> deny total.</li>
<li><b>OFFICE → SERVER:</b> allow hanya port layanan yang dibutuhkan (mis. 443, 3306 dari IP tertentu).</li>
<li><b>SERVER → WAN:</b> deny default; allow selektif (update OS, NTP) — server tidak butuh browsing.</li>
<li><b>ANY → MANAGEMENT (VLAN 99):</b> deny, kecuali dari IP admin.</li>
</ul>
<h3>FortiGate: GUI vs CLI</h3>
<ul>
<li><b>GUI</b> (<i>Policy & Objects → Firewall Policy</i>): cocok untuk membuat, mengurutkan, dan mengaudit policy secara visual — pakai ini untuk desain & review.</li>
<li><b>CLI</b> (<code>config firewall policy</code> → <code>edit 0</code> → <code>set srcintf … dstintf … action accept</code>): cocok untuk scripting, backup (show = teks), dan troubleshooting cepat via SSH.</li>
<li>Keduanya mengubah objek yang sama — pilih berdasarkan tugas: <b>desain/audit = GUI, otomasi/troubleshoot = CLI</b>.</li>
</ul>
<div class="callout"><div class="t">Aturan Policy yang Aman</div><p style="margin:4px 0 0">Urutkan dari <b>paling spesifik ke paling umum</b>, akhiri dengan deny eksplisit ber-log (jangan hanya mengandalkan implicit deny — deny eksplisit memberi log untuk analisis serangan). Setiap policy wajib punya <b>nama/komentar</b>: apa tujuannya, siapa meminta, kapan dibuat.</p></div>`,
      terms: [
        ['Stateful inspection', 'Firewall mengingat koneksi; paket balasan sah otomatis diizinkan.'],
        ['Zone', 'Pengelompokan interface berdasar trust level (WAN/LAN/DMZ/GUEST) untuk penulisan policy.'],
        ['DMZ', 'Demilitarized Zone — segmen khusus server publik (web/mail) yang bisa diakses internet tetapi terisolasi dari LAN.'],
        ['Implicit deny', 'Penolakan otomatis di akhir daftar policy terhadap yang tidak diizinkan.'],
      ],
      diagram: `<pre>   DESAIN POLICY ANTAR-ZONE (FortiGate)

   [GUEST] ──allow──▶ [WAN : 80/443/53]      [GUEST] ──deny──▶ [LAN/SERVER/MGMT]
   [OFFICE] ──allow──▶ [SERVER : 443,3306]   [OFFICE] ──allow──▶ [WAN]
   [SERVER] ──deny──▶ [WAN]                  kecuali: update & NTP (allow selektif)
   [ANY] ──deny──▶ [MGMT VLAN 99]            kecuali IP admin via SSH

   Urutan: spesifik → umum → DENY eksplisit ber-log di akhir.</pre>`,
      scenario: 'Audit keamanan menemukan policy "ANY → ANY : allow" peninggalan masa migrasi — artinya firewall tidak memblokir apa pun. Dihapus setelah verifikasi tidak ada dependensi. Moral: firewall hanya seaman policy terlemahnya; audit berkala itu wajib, bukan opsional.',
      bestPractices: 'Review policy tiap 6 bulan: hapus yang usang, pastikan tiap policy punya pemilik & alasan. Policy tanpa pemilik = bom waktu.',
      security: 'Aktifkan logging pada policy deny — log deny adalah radar serangan (scan port, brute force). Kirim log ke syslog/SIEM agar tidak hilang saat device restart.',
      challenge: 'Tulis 8 policy antar-zone untuk desain 5 VLAN kurikulum (seperti diagram di atas) dalam bentuk tabel: sumber → tujuan → layanan → aksi. Inilah "firewall policy matrix" profesional.',
      interviewQ: 'Q: "Apa beda stateful dan stateless firewall, dan mengapa stateful lebih praktis?" — A: Stateful mengingat koneksi sehingga paket balasan sah otomatis lolos — cukup policy satu arah; stateless menilai tiap paket sendirian sehingga butuh aturan dua arah yang rawan salah.',
      quiz: [
        { q: 'Keuntungan utama stateful firewall adalah…', options: ['Lebih murah', 'Mengingat koneksi sehingga balasan sah otomatis diizinkan — policy cukup satu arah', 'Tanpa konfigurasi', 'Anti virus'], answer: 1, explain: 'Connection tracking menghilangkan kebutuhan aturan "arah pulang" yang rawan salah konfigurasi.' },
        { q: 'Urutan policy firewall yang benar…', options: ['Acak', 'Paling spesifik ke paling umum, diakhiri deny eksplisit ber-log', 'Deny dulu semua', 'Berdasarkan abjad'], answer: 1, explain: 'Evaluasi top-down: spesifik dulu agar tidak "ditelan" aturan umum; deny eksplisit memberi log.' },
        { q: 'Kapan memakai GUI vs CLI di FortiGate?', options: ['GUI untuk semua', 'Desain & audit visual = GUI; scripting/backup/troubleshoot cepat = CLI', 'CLI sudah usang', 'GUI hanya untuk user'], answer: 1, explain: 'Keduanya mengelola objek yang sama; pilih berdasarkan tugas — GUI untuk visual, CLI untuk otomasi.' },
      ],
    },
    {
      id: '29.3',
      title: 'ACL',
      body: `<p><b>ACL (Access Control List)</b> adalah daftar aturan <b>allow/deny</b> berbasis IP/port yang dipasang di router atau switch. Ia adalah "firewall versi ringan": lebih sederhana dan cepat, cocok untuk <b>kontrol antar-segmen di dalam LAN</b> (mis. "VLAN GUEST dilarang ke VLAN SERVER") sementara firewall menangani edge yang kompleks.</p>
<h3>Jenis ACL (Cisco)</h3>
<ul>
<li><b>Standard ACL (1–99):</b> filter berdasar <b>IP sumber saja</b>. <i>Alasan pakai:</i> sederhana — mis. "hanya IP admin boleh SSH ke device". Ditaruh <b>dekat tujuan</b> (karena filternya kasar).</li>
<li><b>Extended ACL (100–199):</b> filter berdasar <b>sumber, tujuan, protokol, port</b>. <i>Alasan pakai:</i> presisi — "VLAN 40 hanya boleh ke internet, bukan ke server". Ditaruh <b>dekat sumber</b> (agar paket dibuang sedini mungkin).</li>
</ul>
<h3>Contoh Konfigurasi + Penjelasan per Baris (Cisco IOS)</h3>
<pre>! Tujuan: VLAN 40 GUEST (192.168.40.0/24) hanya boleh ke internet,
! dilarang ke semua segmen internal. Dipasang di interface VLAN 40 arah IN.
Router(config)# ip access-list extended GUEST-OUT
Router(config-ext-nacl)# deny ip 192.168.40.0 0.0.0.255 192.168.0.0 0.0.255.255
  !＾Tolak paket dari GUEST ke seluruh 192.168.x.x (semua segmen internal).
  ! Kenapa duluan? Karena aturan spesifik/deny ditaruh sebelum allow umum.
Router(config-ext-nacl)# permit ip 192.168.40.0 0.0.0.255 any
  !＾Selain itu (baca: internet), izinkan. "any" = tujuan di luar internal.
Router(config-ext-nacl)# exit
Router(config)# interface vlan 40
Router(config-if)# ip access-group GUEST-OUT in
  !＾Pasang ACL ke interface, arah IN (paket yang MASUK dari GUEST).
  ! Arah salah (out) = ACL tidak menangkap apa-apa. Selalu verifikasi arah!</pre>
<p>Catatan: <code>0.0.0.255</code> adalah <b>wildcard mask</b> (kebalikan subnet mask): 0 = harus cocok, 255 = bebas. Di akhir ACL selalu ada <b>implicit deny</b> tak tertulis.</p>
<h3>MikroTik: Padanan Konsep</h3>
<p>Di MikroTik, fungsi ACL dikerjakan <b>firewall filter</b> (<code>/ip firewall filter</code>): <code>chain=forward src-address=192.168.40.0/24 dst-address=192.168.0.0/16 action=drop</code> lalu <code>action=accept</code>. Konsepnya identik: urutan atas-bawah, pertama cocok menang.</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0"><code>ip access-group … in</code> pada interface yang sedang kamu pakai untuk remote (SSH) bisa <b>mengunci dirimu sendiri</b> keluar device bila ACL-nya salah. <b>Dampak:</b> kehilangan akses remote = harus ke lokasi fisik. Selalu uji ACL di lab/GNS3 dulu, dan siapkan akses console sebagai jalan darurat.</p></div>`,
      terms: [
        ['ACL', 'Access Control List — daftar aturan allow/deny berurutan di router/switch.'],
        ['Standard vs Extended ACL', 'Standard: filter IP sumber saja. Extended: sumber + tujuan + protokol + port.'],
        ['Wildcard mask', 'Kebalikan subnet mask di ACL Cisco: 0 = cocok persis, 255 = abaikan.'],
        ['Arah in/out', 'in = paket masuk interface; out = paket keluar. Salah arah = ACL tak berfungsi.'],
      ],
      diagram: `<pre>   ACL GUEST-OUT di interface VLAN 40 (arah IN)

   [GUEST .50] ──▶ ┌─────────────────────────┐
                   │ 1. deny → 192.168.x.x   │ ── ke SERVER/OFFICE? ✖ DROP
                   │ 2. permit → any         │ ── ke internet? ✔ ALLOW
                   │ 3. (implicit deny)      │
                   └─────────────────────────┘
   Urutan = segalanya. Deny spesifik di atas, allow umum di bawah.</pre>`,
      scenario: 'Kantor mengeluh "tamu bisa buka file server!" Investigasi: ACL GUEST-OUT dipasang arah <b>out</b> bukan <b>in</b> — sehingga tidak menangkap apa pun. Perbaiki arah → tamu terisolasi. Moral: ACL yang terpasang di arah yang salah = tidak ada ACL sama sekali. Selalu verifikasi dengan <code>show ip interface</code>.',
      bestPractices: 'Beri nama ACL yang deskriptif (GUEST-OUT, MGMT-ONLY), tambahkan komentar <code>remark</code> tiap baris penting, dan dokumentasikan di mana ia dipasang + arahnya.',
      security: 'ACL adalah pertahanan lapis kedua setelah firewall — pakai untuk segmentasi internal yang tidak butuh inspeksi stateful. Jangan menulis <code>permit ip any any</code> di awal "agar cepat" — itu meniadakan seluruh ACL.',
      challenge: 'Di GNS3: buat ACL yang mengizinkan VLAN 20 ke VLAN 30 hanya port 443 (HTTPS), deny sisanya. Uji dengan ping (harus gagal) dan curl HTTPS (harus sukses). Rasakan bedanya dengan "allow semua".',
      interviewQ: 'Q: "Apa beda standard dan extended ACL, dan di mana masing-masing dipasang?" — A: Standard (sumber saja) dipasang dekat tujuan karena filternya kasar; extended (sumber+tujuan+port) dipasang dekat sumber agar paket dibuang sedini mungkin.',
      quiz: [
        { q: 'Extended ACL dipasang dekat sumber karena…', options: ['Aturan ISP', 'Agar paket yang ditolak dibuang sedini mungkin, hemat resource', 'Agar lebih lambat', 'Tidak ada alasan'], answer: 1, explain: 'Extended presisi (tahu tujuan); dipasang di sumber = paket jahat tidak berjalan jauh sebelum dibuang.' },
        { q: 'Wildcard mask 0.0.0.255 pada 192.168.40.0 artinya…', options: ['Satu host', 'Seluruh subnet 192.168.40.0/24 (255 = oktet bebas)', 'Semua IP dunia', 'Tidak valid'], answer: 1, explain: 'Wildcard terbalik dari subnet mask: 0 = harus cocok, 255 = boleh apa saja.' },
        { q: 'Bahaya memasang ACL di interface yang dipakai untuk SSH remote?', options: ['Tidak ada', 'Bisa mengunci diri sendiri keluar device bila ACL salah — siapkan akses console', 'Internet mati', 'ACL terhapus'], answer: 1, explain: 'Salah satu baris deny bisa memblokir sesi SSH-mu sendiri; selalu uji di lab dan sediakan jalur darurat.' },
      ],
    },
    {
      id: '29.4',
      title: 'Segmentation',
      body: `<p><b>Segmentation</b> (segmentasi) adalah strategi membagi jaringan menjadi zona-zona terisolasi berdasar <b>fungsi dan trust level</b>, dengan traffic antar-zona dikontrol firewall/ACL. Ini adalah <i>implementasi fisik</i> dari prinsip least privilege — dan pertahanan paling efektif melawan <b>pergerakan lateral</b> (penyerang yang sudah masuk satu segmen lalu menyebar).</p>
<h3>Mengapa Dibutuhkan? (Masalah yang Diselesaikan)</h3>
<ul>
<li><b>Flat network = satu kebocoran = semua kebobolan.</b> Malware di satu PC bisa menyentuh server, CCTV, dan printer tanpa hambatan.</li>
<li><b>Kebijakan berbeda per fungsi:</b> CCTV tidak butuh internet; tamu tidak butuh server; server tidak butuh diakses tamu. Satu kebijakan untuk semua = keamanan terlemah menentukan.</li>
<li><b>Kepatuhan & audit:</b> data sensitif (keuangan, HR) wajib terisolasi — auditor menanyakan "siapa bisa mencapai server ini?" dan jawabannya harus berupa daftar pendek.</li>
</ul>
<h3>Model Segmentasi Kurikulum</h3>
<p>Desain 5 VLAN (29.1) <i>adalah</i> model segmentasi. Kunci tambahannya:</p>
<ul>
<li><b>Inter-VLAN routing hanya via firewall</b> (bukan switch L3 biasa) — agar setiap pindah segmen melewati inspeksi policy.</li>
<li><b>Matriks izin antar-segmen</b> didokumentasikan (siapa → siapa → layanan apa) — inilah yang diaudit.</li>
<li><b>Segmen IoT/CCTV (VLAN 10) paling ketat keluar:</b> device IoT terkenal lemah keamanannya dan jarang di-update — isolasi adalah satu-satunya pertahanan realistis.</li>
</ul>
<div class="tblwrap"><table>
<tr><th>Dari → Ke</th><th>Kebijakan</th><th>Alasan</th></tr>
<tr><td>OFFICE → SERVER</td><td>Allow port layanan saja</td><td>User butuh aplikasi, bukan akses bebas</td></tr>
<tr><td>GUEST → apa pun internal</td><td>Deny total</td><td>Segmen tak dipercaya</td></tr>
<tr><td>CCTV → internet</td><td>Deny</td><td>Kamera tak butuh internet; cegah botnet</td></tr>
<tr><td>ANY → MANAGEMENT</td><td>Deny kecuali IP admin</td><td>Bidang kontrol paling sensitif</td></tr>
</table></div>
<div class="callout blue"><div class="t">Micro-segmentation (Wawasan)</div><p style="margin:4px 0 0">Di data center modern, segmentasi diperhalus sampai level <i>per server / per aplikasi</i> (micro-segmentation). Prinsipnya sama — hanya granularitasnya lebih kecil. Pahami dulu segmentasi VLAN dengan matang; konsepnya terbawa ke mana pun.</p></div>`,
      terms: [
        ['Segmentation', 'Pembagian jaringan menjadi zona terisolasi berdasar fungsi/trust, dengan kontrol antar-zona.'],
        ['Lateral movement', 'Penyebaran penyerang dari satu segmen/device ke segmen lain — yang dicegah segmentasi.'],
        ['Trust level', 'Tingkat kepercayaan sebuah segmen: menentukan seberapa ketat kebijakannya.'],
      ],
      diagram: `<pre>   SEGMENTASI = least privilege dalam bentuk jaringan

   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │VLAN 10  │   │VLAN 20  │   │VLAN 30  │   │VLAN 40  │
   │ CCTV    │   │ OFFICE  │   │ SERVER  │   │ GUEST   │
   │trust:   │   │trust:   │   │trust:   │   │trust:   │
   │ RENDAH  │   │ SEDANG  │   │ TINGGI  │   │ NOL     │
   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘
        └──────┬──────┴──────┬──────┴──────┬──────┘
               ▼             ▼             ▼
        ══════════ FIREWALL (inspeksi tiap pindah segmen) ══════════
   Penyerang di GUEST: mentok di firewall — tak bisa ke SERVER/OFFICE.</pre>`,
      scenario: 'Vendor CCTV meminta "akses remote ke semua kamera". Tanpa segmentasi, itu berarti akses ke seluruh LAN. Dengan segmentasi: buatkan VPN khusus yang hanya bisa mencapai VLAN 10, hanya port NVR, hanya jam kerja. Kebutuhan vendor terpenuhi, risiko terkendali — inilah least privilege dalam praktik.',
      bestPractices: 'Segmentasikan berdasar fungsi & trust, bukan berdasar lantai/gedung. Setiap segmen baru wajib punya: pemilik, kebijakan, dan alasan — didokumentasikan.',
      security: 'Uji segmentasi secara berkala (penetration test internal ringan): dari VLAN GUEST, coba capai VLAN SERVER — harus gagal total. Segmentasi yang tidak pernah diuji = asumsi, bukan pertahanan.',
      challenge: 'Buat matriks izin 5×5 (dari tiap VLAN ke tiap VLAN lain): allow apa / deny. Bandingkan dengan tabel di sub-bab ini — apakah ada yang kamu izinkan tetapi seharusnya deny?',
      interviewQ: 'Q: "Mengapa CCTV diisolasi ketat padahal cuma kamera?" — A: Device IoT lemah keamanan & jarang di-update — target empuk botnet. Isolasi memastikan kalaupun disusupi, ia tidak bisa ke internet maupun ke segmen lain.',
      quiz: [
        { q: 'Tujuan utama segmentasi adalah…', options: ['Mempercepat internet', 'Membatasi pergerakan lateral — satu segmen bobol tidak berarti semua bobol', 'Menghemat kabel', 'Agar terlihat rapi'], answer: 1, explain: 'Segmentasi + kontrol antar-zona memastikan penyerang/user di satu segmen tidak bebas ke segmen lain.' },
        { q: 'Mengapa inter-VLAN routing sebaiknya via firewall, bukan switch L3 biasa?', options: ['Lebih murah', 'Agar tiap pindah segmen melewati inspeksi policy', 'Lebih cepat', 'Tidak ada alasan'], answer: 1, explain: 'Switch L3 me-routing tanpa inspeksi; firewall menegakkan policy keamanan di setiap batas segmen.' },
        { q: 'Segmentasi ideal didasarkan pada…', options: ['Lantai gedung', 'Fungsi perangkat dan trust level', 'Warna kabel', 'Merek device'], answer: 1, explain: 'Fungsi (CCTV/office/server) + trust menentukan kebijakan; lantai tidak menentukan kebutuhan keamanan.' },
      ],
    },
    {
      id: '29.5',
      title: 'Management VLAN',
      body: `<p><b>Management VLAN</b> (VLAN 99 di desain kita) adalah segmen khusus untuk <b>mengelola perangkat jaringan itu sendiri</b>: SSH ke switch/router, SNMP monitoring, syslog, dan akses GUI. Ia adalah "ruang mesin" jaringan — <b>hanya admin yang boleh masuk</b>, dan ia dipisahkan dari traffic user biasa.</p>
<h3>Mengapa Dipisahkan? (Masalah yang Diselesaikan)</h3>
<ul>
<li><b>Serangan ke bidang kontrol:</b> bila IP management switch bisa dicapai dari VLAN user/guest, penyerang (atau malware) bisa brute-force SSH ke switch — menguasai switch = menguasai segalanya.</li>
<li><b>Traffic management tercemar:</b> SNMP/logging bercampur traffic user = sulit didiagnosis & rawan intip.</li>
<li><b>Kesalahan user:</b> user "iseng" membuka IP switch di browser — tanpa isolasi, mereka sampai ke halaman login perangkat.</li>
</ul>
<h3>Implementasi: Aturan VLAN 99</h3>
<ol>
<li><b>IP management</b> semua device (switch, router, AP, firewall) hanya di 192.168.99.0/24 — tidak ada IP management di VLAN user.</li>
<li><b>SSH/SNMP/GUI</b> hanya listen/menerima dari VLAN 99 (lihat 29.6, 29.10).</li>
<li><b>Firewall/ACL:</b> deny total dari VLAN 10/20/30/40 ke 192.168.99.0/24, kecuali IP admin yang terdaftar.</li>
<li><b>Akses admin</b> via jump host / VPN yang masuk ke VLAN 99 — admin remote tidak langsung menyentuh device.</li>
</ol>
<h3>Contoh: Batasi SSH Hanya dari VLAN 99 (Cisco)</h3>
<pre>Router(config)# ip access-list standard MGMT-ONLY
Router(config-std-nacl)# permit 192.168.99.0 0.0.0.255
  !＾Hanya subnet management yang boleh lanjut; sisanya kena implicit deny.
Router(config-std-nacl)# exit
Router(config)# line vty 0 4
Router(config-line)# access-class MGMT-ONLY in
  !＾Pasang ke jalur VTY (SSH/Telnet). Diuji: SSH dari VLAN 20 → ditolak;
  ! SSH dari VLAN 99 → sukses. Verifikasi selalu dari kedua sisi!</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> boleh campur — satu laptop untuk semua agar praktis. <b>Production:</b> VLAN 99 wajib terisolasi; audit akan menanyakan "dari mana saja IP management bisa dicapai?" dan jawaban yang benar adalah "hanya dari VLAN 99". Biasakan desain yang benar sejak di lab.</p></div>`,
      terms: [
        ['Management VLAN', 'VLAN khusus (99) untuk mengelola perangkat jaringan — terisolasi dari user.'],
        ['Bidang kontrol (control plane)', 'Fungsi pengaturan perangkat (SSH/SNMP/routing) — target utama serangan infrastruktur.'],
        ['Jump host', 'Server perantara yang menjadi satu-satunya pintu masuk admin ke jaringan management.'],
        ['access-class', 'Perintah Cisco memasang ACL ke jalur VTY (akses remote).'],
      ],
      diagram: `<pre>   MANAGEMENT VLAN 99 — ruang mesin jaringan

   [Admin] ──VPN/SSH──▶ [Jump host 192.168.99.2] ──▶ [SW1 .11] [R1 .1] [FW .3]
                                                     192.168.99.0/24
        ▲
        │  ACL/Firewall: DENY dari VLAN 10/20/30/40 → 192.168.99.0/24
        │  (user & tamu tak bisa melihat apalagi menyentuh device)
   [User VLAN 20] ──✖── "tak ada rute/akses ke .99"</pre>`,
      scenario: 'Insiden: malware di PC office melakukan scan dan menemukan IP switch di VLAN 20 (karena IP management ditaruh di VLAN user — desain lama). Beruntung password kuat. Setelah migrasi ke VLAN 99 + ACL, scan dari VLAN user tidak menemukan apa pun — device menjadi "tak terlihat". Moral: yang tak terlihat tak bisa diserang.',
      bestPractices: 'Jangan pernah menaruh IP management di VLAN user "agar gampang". Kemudahan sesaat = celah permanen. Dokumentasikan semua IP 192.168.99.0/24 (IPAM sederhana).',
      security: 'Gunakan juga <code>no ip http server</code> bila GUI web tidak dibutuhkan — setiap layanan yang listen adalah attack surface. Matikan yang tak perlu.',
      challenge: 'Di GNS3: beri IP management 192.168.99.x pada 2 switch, pasang access-class MGMT-ONLY, lalu uji SSH dari "PC user" (harus ditolak) dan dari "PC admin" di VLAN 99 (harus sukses).',
      interviewQ: 'Q: "Mengapa IP management switch dipisah ke VLAN khusus?" — A: Agar bidang kontrol tak terjangkau dari segmen user/guest — mencegah brute-force & eksploitasi ke perangkat infrastruktur, plus memisahkan traffic management dari traffic user.',
      quiz: [
        { q: 'Fungsi utama Management VLAN adalah…', options: ['Wi-Fi tamu', 'Mengisolasi akses pengelolaan perangkat (SSH/SNMP) hanya untuk admin', 'Menyimpan file', 'Mempercepat internet'], answer: 1, explain: 'VLAN 99 = ruang mesin: hanya admin boleh masuk, user/guest ditolak total.' },
        { q: 'Perintah Cisco untuk membatasi akses VTY (SSH) adalah…', options: ['ip access-group', 'access-class … in pada line vty', 'shutdown', 'hostname'], answer: 1, explain: 'access-class memasang ACL ke jalur VTY; access-group untuk interface.' },
        { q: 'Risiko menaruh IP management di VLAN user?', options: ['Tidak ada', 'Malware/user bisa mencapai & menyerang perangkat infrastruktur langsung', 'Internet lambat', 'VLAN terhapus'], answer: 1, explain: 'Bidang kontrol yang terlihat dari segmen user = target empuk brute-force dan eksploitasi.' },
      ],
    },
    {
      id: '29.6',
      title: 'SSH Security',
      body: `<p><b>SSH (Secure Shell)</b> adalah cara aman mengelola device dari jarak jauh: seluruh sesi <b>dienkripsi</b>, termasuk username & password. Lawannya adalah <b>Telnet</b> yang mengirim semuanya <b>plaintext</b> (bisa disadap dengan Wireshark — lihat 28.18!). Aturan pertama hardening: <b>Telnet mati, SSH hidup.</b></p>
<h3>Konfigurasi SSH Aman (Cisco IOS) + Penjelasan</h3>
<pre>Router(config)# hostname R1-JKT
  !＾SSH butuh hostname & domain untuk menamai kunci kriptografi.
Router(config)# ip domain-name lab.local
Router(config)# crypto key generate rsa modulus 2048
  !＾Buat pasangan kunci RSA 2048-bit. Kenapa 2048? 1024 sudah dianggap lemah;
  ! kunci ini dipakai mengenkripsi handshake SSH. Tanpa ini, SSH tak bisa aktif.
Router(config)# ip ssh version 2
  !＾Paksa SSH versi 2 saja. Versi 1 punya kelemahan kriptografi serius.
Router(config)# line vty 0 4
Router(config-line)# transport input ssh
  !＾HANYA izinkan SSH di jalur remote — Telnet otomatis ditolak.
  ! Inilah baris yang "mematikan Telnet".
Router(config-line)# login local
  !＾Pakai database user lokal (username/password di device).
Router(config)# username admin privilege 15 secret S4nd1Ku4t!
  !＾Buat user admin. "secret" (bukan "password") = disimpan ter-hash kuat.</pre>
<h3>MikroTik: SSH & Nonaktifkan Telnet</h3>
<pre>[admin@MikroTik] &gt; /ip service set telnet disabled=yes
[admin@MikroTik] &gt; /ip service set ssh port=22 disabled=no
[admin@MikroTik] &gt; /ip service set www disabled=yes
  !＾Matikan layanan tak perlu (telnet, web polos). Prinsip: attack surface minimal.
[admin@MikroTik] &gt; /user ssh-keys import public-key-file=id_rsa.pub user=admin
  !＾SSH key: login tanpa password, jauh lebih kuat dari password (anti brute-force).</pre>
<h3>Praktik Lanjutan</h3>
<ul>
<li><b>SSH key</b> lebih aman dari password: private key di laptopmu, public key di device. Brute-force menjadi mustahil tanpa key-nya.</li>
<li><b>Batasi sumber:</b> gabungkan dengan access-class MGMT-ONLY (29.5) — SSH hanya dari VLAN 99.</li>
<li><b>Ganti port default?</b> Mengganti port 22 mengurangi noise scan otomatis, tetapi <b>bukan</b> keamanan nyata (security by obscurity). Jangan jadikan andalan.</li>
<li><b>Timeout sesi:</b> <code>exec-timeout 5</code> di line vty — sesi nganggur 5 menit otomatis putus (mencegah sesi admin tertinggal terbuka).</li>
</ul>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> password sederhana boleh agar praktis. <b>Production:</b> SSH key + password kuat + hanya dari VLAN 99 + log setiap login. Kebiasaan "asal bisa SSH" di lab terbawa ke production — biasakan yang benar sejak sekarang.</p></div>`,
      terms: [
        ['SSH', 'Secure Shell — akses remote terenkripsi (pengganti Telnet yang aman).'],
        ['Telnet', 'Akses remote plaintext (tak terenkripsi) — WAJIB dimatikan.'],
        ['RSA key', 'Pasangan kunci kriptografi (public/private) fondasi enkripsi SSH.'],
        ['SSH key authentication', 'Login memakai kunci kriptografi, bukan password — anti brute-force.'],
      ],
      diagram: `<pre>   TELNET vs SSH (lihat dengan Wireshark!)

   TELNET (plaintext):                    SSH (terenkripsi):
   Client ──"username: admin"──▶ Server    Client ──"x#9f!q2…"──▶ Server
           ──"password: rahasia"──▶                ──"p$0kz@8…"──▶
   Penyadap membaca semuanya.             Penyadap hanya melihat acak.

   Kesimpulan: transport input ssh — selalu.</pre>`,
      scenario: 'Audit menemukan 12 switch masih bisa di-Telnet dengan password sama "admin123". Seorang mantan vendor yang tahu password itu masih bisa masuk kapan pun. Remediasi massal: matikan Telnet, aktifkan SSH v2 + key, ganti semua password via Ansible (Part 32–33). Moral: Telnet + password lemah = pintu belakang permanen.',
      bestPractices: 'Standar SSH: versi 2, RSA ≥2048 bit, autentikasi key, hanya dari management VLAN, exec-timeout 5 menit, dan setiap login tercatat di syslog.',
      security: 'Brute-force SSH adalah serangan paling umum ke device yang terekspos. Pertahanan berlapis: tidak terekspos ke internet + hanya dari VLAN 99 + key (bukan password) + fail2ban/rate-limit bila perlu.',
      challenge: 'Capture sesi Telnet di GNS3 dengan Wireshark — buktikan kamu bisa membaca password-nya. Lalu ulangi dengan SSH — buktikan tidak bisa. Pelajaran ini tak akan kamu lupakan.',
      interviewQ: 'Q: "Mengapa Telnet dilarang dan apa 3 langkah mengamankan akses remote?" — A: Telnet plaintext (kredensial bisa disadap). Amankan dengan: (1) SSH v2 + transport input ssh, (2) autentikasi key & password kuat, (3) batasi sumber ke management VLAN via access-class.',
      quiz: [
        { q: 'Perintah Cisco yang mematikan Telnet dan hanya mengizinkan SSH adalah…', options: ['hostname R1', 'transport input ssh pada line vty', 'ip ssh version 2', 'login local'], answer: 1, explain: 'transport input ssh = hanya SSH yang diterima di jalur remote; Telnet otomatis ditolak.' },
        { q: 'Mengapa SSH key lebih aman dari password?', options: ['Lebih pendek', 'Kriptografi asimetris — brute-force praktis mustahil tanpa private key', 'Gratis', 'Tidak perlu username'], answer: 1, explain: 'Key 2048-bit tidak bisa ditebak seperti password; private key tak pernah dikirim ke server.' },
        { q: 'crypto key generate rsa dibutuhkan karena…', options: ['Agar hostname bagus', 'SSH butuh pasangan kunci RSA untuk enkripsi handshake — tanpa ini SSH tak aktif', 'Agar cepat', 'Syarat garansi'], answer: 1, explain: 'Kunci RSA adalah fondasi kriptografi SSH; tanpanya daemon SSH tidak bisa berjalan.' },
      ],
    },
    {
      id: '29.7',
      title: 'Password Security',
      body: `<p>Password adalah pertahanan terakhir bila semua lapis lain bocor — dan sering kali <b>pertahanan pertama yang jebol</b> karena lemah, sama di semua device, atau tersimpan plaintext di konfigurasi. Hardening password itu murah, cepat, dan dampaknya besar.</p>
<h3>Aturan Password yang Benar</h3>
<ul>
<li><b>Panjang & kompleks:</b> minimal 12 karakter, campuran huruf besar-kecil, angka, simbol. <i>Alasan:</i> tiap karakter menambah kombinasi eksponensial bagi brute-force.</li>
<li><b>Unik per device:</b> satu password untuk semua switch = satu kebocoran = semua jebol. <i>Alasan:</i> membatasi blast radius.</li>
<li><b>Disimpan ter-hash, bukan plaintext:</b> konfigurasi yang bocor tidak langsung memberi password.</li>
<li><b>Diganti berkala & saat pegawai keluar:</b> kredensial mantan admin adalah celah klasik.</li>
</ul>
<h3>Konfigurasi (Cisco IOS) + Penjelasan</h3>
<pre>Router(config)# enable secret S4nd1Ku4t!
  !＾Password mode privileged (enable). "secret" = di-hash kuat (MD5/SHA).
  ! JANGAN pakai "enable password" (versi lama, lemah — hanya obfuscation).
Router(config)# username admin privilege 15 secret S4nd1L41n!
  !＾User lokal dengan hash kuat. Beda password dengan enable secret!
Router(config)# service password-encryption
  !＾Enkripsi (obfuscate) password lain di config yang masih plaintext.
  ! Catatan: ini BUKAN hash kuat — hanya menyamarkan dari intipan sekilas.
Router(config)# security passwords min-length 12
  !＾Tolak password pendek langsung di CLI. Mencegah "admin123".
Router(config)# login block-for 120 attempts 3 within 60
  !＾Blokir login 120 detik bila 3x gagal dalam 60 detik — anti brute-force.</pre>
<h3>MikroTik</h3>
<pre>[admin@MikroTik] &gt; /user add name=operator group=read password=S4nd1Ku4t!
  !＾Buat user dengan grup hak terbatas (read-only). Lihat least privilege (29.8).
[admin@MikroTik] &gt; /user set admin password=S4nd1B4ru!
  !＾GANTI password default admin! Router baru dengan password default
  ! yang terekspos = diretas dalam hitungan menit (bot memindai internet).</pre>
<div class="callout"><div class="t">Password Default = Bencana</div><p style="margin:4px 0 0">Bot di internet memindai 24/7 mencari device dengan kredensial default (admin/admin). Device yang baru dipasang dan langsung tersambung internet <b>wajib</b> ganti kredensial <i>sebelum</i> tersambung — urutan ini tidak bisa ditawar.</p></div>`,
      terms: [
        ['Hash', 'Fungsi satu arah: password → kode acak yang tak bisa dibalik; server menyimpan hash, bukan password.'],
        ['enable secret', 'Password mode privileged Cisco yang disimpan ter-hash kuat (pengganti enable password).'],
        ['Brute-force', 'Serangan menebak password dengan mencoba jutaan kombinasi otomatis.'],
        ['Blast radius', 'Seberapa luas dampak satu kredensial bocor — diperkecil dengan password unik per device.'],
      ],
      diagram: `<pre>   PENYIMPANAN PASSWORD: plaintext vs hash

   PLAINTEXT (buruk):                 HASH (benar):
   config: password admin123          config: secret 5$f4k3$9x…
   → siapa baca config = tahu         → dibaca pun tak bisa dibalik
     password.                          (verifikasi: hash(input) == hash tersimpan)

   enable password  = obfuscation lemah ✖
   enable secret    = hash kuat ✔</pre>`,
      scenario: 'File backup konfigurasi (29.12) tersimpan di share folder tanpa proteksi — berisi <code>enable password</code> plaintext untuk 20 switch. Magang yang iseng membacanya kini memegang kunci seluruh jaringan. Pelajaran ganda: pakai <code>enable secret</code> + lindungi file backup seperti password itu sendiri.',
      bestPractices: 'Gunakan password manager untuk kredensial device (unik per device, 16+ karakter). Rotasi saat ada pegawai keluar. Jangan pernah kirim password via chat/email biasa.',
      security: 'service password-encryption BUKAN keamanan nyata (mudah dibalik) — ia hanya anti-intip. Keamanan nyata = enable secret + SSH key + login block.',
      challenge: 'Audit satu device lab-mu: apakah masih ada "enable password" (bukan secret)? Apakah password user = password enable? Apakah ada password default? Perbaiki ketiganya.',
      interviewQ: 'Q: "Apa beda enable password dan enable secret?" — A: enable password disimpan dengan obfuscation lemah (mudah dibalik); enable secret di-hash kuat satu arah. Selalu pakai secret.',
      quiz: [
        { q: 'Mengapa "enable secret" wajib menggantikan "enable password"?', options: ['Lebih pendek', 'secret disimpan ter-hash kuat; password hanya obfuscation lemah yang mudah dibalik', 'Lebih murah', 'Tidak ada beda'], answer: 1, explain: 'Hash satu arah tak bisa dibalik; obfuscation password Cisco lama mudah di-decode.' },
        { q: 'Fungsi "login block-for 120 attempts 3 within 60" adalah…', options: ['Mempercepat login', 'Anti brute-force: blokir 120 detik setelah 3 gagal dalam 60 detik', 'Mengganti password otomatis', 'Menambah user'], answer: 1, explain: 'Rate-limiting login membuat brute-force jutaan percobaan menjadi tidak praktis.' },
        { q: 'Aturan password paling penting untuk banyak device?', options: ['Sama semua agar mudah diingat', 'Unik per device — satu bocor tidak menjebol semua', 'Ditulis di sticky note', 'Pakai nama perusahaan'], answer: 1, explain: 'Password unik memperkecil blast radius; password sama = satu kebocoran melumpuhkan semua.' },
      ],
    },
    {
      id: '29.8',
      title: 'Least Privilege',
      body: `<p><b>Least privilege</b> (hak minimal) berarti: setiap akun hanya diberi <b>hak persis yang dibutuhkan</b> untuk tugasnya — tidak lebih. Operator NOC shift malam butuh <i>melihat</i> konfigurasi, bukan <i>menghapusnya</i>. Magang butuh ping, bukan <code>reload</code>. Pelanggaran prinsip ini adalah penyebab insiden "tidak sengaja menghapus konfigurasi production".</p>
<h3>Implementasi: Privilege Level (Cisco)</h3>
<ul>
<li><b>Level 0–1:</b> user mode — perintah dasar (ping, show terbatas).</li>
<li><b>Level 15:</b> privileged penuh — semua perintah (default admin).</li>
<li>Level 2–14 bisa dikustom: mis. level 7 untuk operator (show + ping + clear counters, tanpa <code>configure terminal</code>).</li>
</ul>
<pre>Router(config)# username operator privilege 7 secret Op3r4t0r!
  !＾User operator otomatis masuk level 7 — tak bisa masuk mode konfigurasi.
Router(config)# privilege exec level 7 show running-config
  !＾Izinkan perintah spesifik di level 7. Tanpa ini, operator bahkan tak bisa show.
Router(config)# line vty 0 4
Router(config-line)# login local
  !＾Wajib login local agar privilege per-user berlaku.</pre>
<h3>MikroTik: Group</h3>
<pre>[admin@MikroTik] &gt; /user group print
  !＾Grup bawaan: full (semua), read (baca saja), write (baca+tulis, tanpa user mgmt).
[admin@MikroTik] &gt; /user add name=noc group=read password=…
  !＾Operator NOC: grup read — bisa monitoring, tak bisa ubah apa pun.
  ! Alasan: mencegah "salah klik" mengubah konfigurasi production.</pre>
<h3>Matriks Hak (Contoh Tim)</h3>
<div class="tblwrap"><table>
<tr><th>Peran</th><th>Hak</th><th>Contoh Perintah Boleh</th></tr>
<tr><td>Magang</td><td>Level 1 / read</td><td>ping, show interfaces status</td></tr>
<tr><td>Operator NOC</td><td>Level 7 / read</td><td>show, ping, traceroute (monitoring & tiket awal)</td></tr>
<tr><td>Engineer</td><td>Level 15 terbatas / write</td><td>Konfigurasi (dengan change request)</td></tr>
<tr><td>Admin</td><td>Level 15 / full</td><td>Semua, termasuk manajemen user</td></tr>
</table></div>
<div class="callout blue"><div class="t">AAA — Level Lanjutan (Wawasan)</div><p style="margin:4px 0 0">Di enterprise, user tidak disimpan per-device melainkan terpusat via <b>TACACS+/RADIUS</b>: login dicatat per orang (<i>accounting</i>), hak diatur per peran. Kalau user keluar, nonaktifkan satu akun pusat — bukan 50 device. Ini materi lanjutan setelah kamu nyaman dengan local user.</p></div>`,
      terms: [
        ['Least privilege', 'Prinsip hak akses minimal sesuai kebutuhan tugas.'],
        ['Privilege level', 'Tingkatan hak di Cisco (0–15); menentukan perintah yang boleh dijalankan.'],
        ['AAA', 'Authentication, Authorization, Accounting — framework akses terpusat (TACACS+/RADIUS).'],
      ],
      diagram: `<pre>   LEAST PRIVILEGE: hak sesuai peran, bukan "semua admin"

   [Magang]    ──▶ level 1  : ping, show status        (tak bisa ubah)
   [Operator]  ──▶ level 7  : + show run, traceroute  (tak bisa configure)
   [Engineer]  ──▶ level 15 : configure (via change request)
   [Admin]     ──▶ level 15 : + manajemen user

   Insiden "salah hapus config" hampir selalu = hak berlebih.</pre>`,
      scenario: 'Operator NOC bermaksud <code>clear counters</code> tetapi salah ketik menjadi <code>clear config</code>-ish di device lama — switch kehilangan VLAN dan 3 lantai lumpuh 1 jam. Investigasi: operator memakai akun full-admin "agar praktis". Setelahnya: akun operator dibatasi level 7. Moral: kenyamanan "semua admin" dibayar dengan risiko.',
      bestPractices: 'Buatkan akun sesuai peran sejak hari pertama pegawai masuk (onboarding), dan cabut <i>di hari yang sama</i> saat keluar (offboarding). Akun yatim (orphaned) adalah celah klasik.',
      security: 'Aktifkan accounting bila memakai TACACS+: setiap perintah tercatat atas nama siapa — forensik insiden menjadi mungkin. "Siapa yang mengubah ini?" harus selalu bisa dijawab.',
      challenge: 'Buat user "operator" level 7 di lab GNS3-mu. Login sebagai operator dan coba masuk configure terminal (harus ditolak), lalu show running-config (harus bisa setelah privilege exec diset).',
      interviewQ: 'Q: "Operator NOC butuh akses apa saja, dan mengapa tidak diberi full admin?" — A: Cukup monitoring & diagnosis (show, ping, traceroute) — full admin memberi kemampuan merusak (salah konfigurasi) tanpa kebutuhan. Least privilege.',
      quiz: [
        { q: 'Inti prinsip least privilege adalah…', options: ['Semua user jadi admin', 'Hak akses seminimal yang dibutuhkan untuk tugasnya', 'Tanpa password', 'Satu akun bersama'], answer: 1, explain: 'Hak berlebih = risiko insiden; hak minimal = kerusakan maksimal yang bisa dibuat pun minimal.' },
        { q: 'Operator NOC sebaiknya diberi…', options: ['Privilege 15 / full', 'Privilege terbatas (lihat + diagnosis) tanpa hak konfigurasi', 'Password admin', 'Akses fisik saja'], answer: 1, explain: 'Tugas operator = monitoring & tiket awal; konfigurasi butuh change request oleh engineer.' },
        { q: 'Keuntungan TACACS+/RADIUS dibanding user lokal per-device?', options: ['Lebih lambat', 'Manajemen terpusat: satu akun dinonaktifkan = berlaku di semua device + accounting per orang', 'Tanpa password', 'Gratis selamanya'], answer: 1, explain: 'Sentralisasi menghilangkan akun yatim di puluhan device dan memberi jejak audit per perintah.' },
      ],
    },
    {
      id: '29.9',
      title: 'Port Security',
      body: `<p><b>Port security</b> adalah fitur switch yang mengontrol <b>perangkat apa boleh terhubung ke tiap port</b> berdasar MAC address. Tanpa ini, siapa pun bisa mencolokkan laptop ke port dinding kosong dan langsung masuk LAN — atau mencolokkan switch liar yang menyebabkan loop (skenario 14 di 28.19!).</p>
<h3>Masalah yang Diselesaikan</h3>
<ul>
<li><b>Rogue device:</b> perangkat asing terhubung ke jaringan tanpa izin.</li>
<li><b>Switch liar:</b> user mencolok switch/AP rumahan → loop & DHCP liar.</li>
<li><b>MAC flooding:</b> serangan membanjiri MAC table hingga switch menjadi hub (semua traffic bisa disadap).</li>
</ul>
<h3>Konfigurasi (Cisco IOS) + Penjelasan</h3>
<pre>Switch(config)# interface Gi0/5
Switch(config-if)# switchport mode access
  !＾Wajib access dulu — port security tidak jalan di mode dynamic.
Switch(config-if)# switchport port-security
  !＾Aktifkan. Default: maksimal 1 MAC, pelanggaran = shutdown.
Switch(config-if)# switchport port-security maximum 2
  !＾Izinkan 2 MAC (mis. PC + IP phone). Alasan: batasi, jangan 0-toleransi buta.
Switch(config-if)# switchport port-security mac-address sticky
  !＾"Sticky": MAC pertama yang muncul otomatis diingat & disimpan ke config.
  ! Alasan: praktis — tak perlu catat MAC manual satu per satu.
Switch(config-if)# switchport port-security violation restrict
  !＾Mode pelanggaran: restrict = drop paket MAC asing + hitung + kirim SNMP trap,
  ! TAPI port tetap up. (shutdown = port mati total; protect = drop diam-diam.)
Switch(config-if)# switchport port-security aging time 60
  !＾MAC sticky kedaluwarsa 60 menit tak aktif — untuk ruang meeting/port tamu.</pre>
<h3>Verifikasi & Recovery</h3>
<pre>Switch# show port-security interface Gi0/5
  !＾Lihat MAC terdaftar, jumlah pelanggaran. Bukti untuk audit.
Switch# show port-security address
  !＾Daftar semua MAC sticky di switch.</pre>
<p>Jika port kena <b>errdisable</b> (mode shutdown): cari penyebabnya dulu (device apa yang melanggar?), lalu <code>shutdown</code> → <code>no shutdown</code> di port itu untuk mengaktifkan kembali. <b>Jangan</b> asal up tanpa tahu penyebabnya — bisa jadi itu perangkat penyusup.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> port security sering dimatikan agar praktis (VM berganti MAC). <b>Production:</b> wajib di port user — terutama port dinding di area publik. Bedakan profil: port kantor (sticky, restrict), port publik (maximum 1, shutdown).</p></div>`,
      terms: [
        ['Port security', 'Fitur switch membatasi MAC address yang boleh lewat tiap port.'],
        ['Sticky MAC', 'MAC yang dipelajari otomatis lalu "ditempel" sebagai MAC resmi port itu.'],
        ['Violation mode', 'Respons pelanggaran: shutdown (port mati), restrict (drop+log), protect (drop diam).'],
        ['Errdisable', 'Status port dimatikan otomatis akibat pelanggaran — butuh shutdown/no shutdown manual.'],
      ],
      diagram: `<pre>   PORT SECURITY di port dinding Gi0/5 (maximum 2, sticky, restrict)

   [PC AA:AA] ──┐
                ├──▶ [Gi0/5] ✔ MAC dikenal → diteruskan
   [Phone BB:BB]┘

   [Laptop asing CC:CC] ──▶ [Gi0/5] ✖ MAC tak dikenal
        → paket di-DROP + counter naik + SNMP trap ke NOC
        → (mode shutdown: port ikut MATI → errdisable)</pre>`,
      scenario: 'Ruang meeting: presenter mencolokkan switch 5-port murahan agar "semua bisa nyambung" — 10 menit kemudian separuh lantai lumpuh (loop + DHCP liar dari switch itu). Dengan port-security (maximum 2, restrict), switch liar itu langsung diblokir di portnya dan NOC dapat trap. Moral: port dinding tanpa pengaman = pintu belakang fisik.',
      bestPractices: 'Terapkan port-security di SEMUA port access user; bedakan profil port kantor vs port publik vs port printer (MAC statis). Monitor trap pelanggaran — pelanggaran berulang di satu port = investigasi.',
      security: 'Port security + 802.1X (autentikasi per user) adalah pasangan ideal: port security = "perangkat mana", 802.1X = "user siapa". Untuk sekarang kuasai port security; 802.1X adalah langkah lanjutan.',
      challenge: 'Di GNS3 (IOS): aktifkan port security sticky di satu port, hubungkan 2 VM bergantian, amati MAC tercatat. Coba VM ketiga → amati violation. Praktikkan recovery errdisable.',
      interviewQ: 'Q: "Jelaskan 3 violation mode port security dan kapan memakai masing-masing." — A: shutdown (port mati — keamanan maksimal, butuh intervensi), restrict (drop + log + trap — seimbang, port tetap up), protect (drop diam — untuk port yang tak boleh mati).',
      quiz: [
        { q: 'Fungsi utama port security adalah…', options: ['Mempercepat switch', 'Mengontrol MAC address yang boleh lewat tiap port — cegah rogue device & loop', 'Mengganti VLAN', 'Backup config'], answer: 1, explain: 'Port security = penjaga pintu fisik tiap port: hanya MAC resmi yang boleh lewat.' },
        { q: 'Mode violation "restrict" berarti…', options: ['Port dimatikan', 'Paket MAC asing di-drop + dihitung + SNMP trap, port tetap up', 'Semua diizinkan', 'Switch restart'], answer: 1, explain: 'restrict = blokir + bukti (counter & trap) tanpa mematikan port — seimbang untuk port user.' },
        { q: 'Port kena errdisable karena violation. Langkah benar?', options: ['Langsung no shutdown', 'Selidiki perangkat pelanggar dulu, baru shutdown → no shutdown', 'Ganti switch', 'Abaikan'], answer: 1, explain: 'Errdisable adalah alarm keamanan; mengaktifkan ulang tanpa investigasi bisa mempersilakan penyusup masuk.' },
      ],
    },
    {
      id: '29.10',
      title: 'SNMP Security',
      body: `<p><b>SNMP (Simple Network Management Protocol)</b> adalah protokol yang dipakai Zabbix (Part 23–25) untuk <b>mengintip</b> device: traffic per interface, CPU, suhu, status port. Masalahnya: SNMP dirancang di era ketika keamanan bukan prioritas — <b>versi lamanya sangat tidak aman</b> dan wajib dikeraskan.</p>
<h3>SNMP v2c vs v3</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>SNMP v2c</th><th>SNMP v3</th></tr>
<tr><td>Autentikasi</td><td><b>Community string</b> (="password") dikirim <b>plaintext</b></td><td>Username + password ter-hash (auth)</td></tr>
<tr><td>Enkripsi</td><td>Tidak ada — data bisa disadap</td><td>Ya (privacy/DES/AES) — data terenkripsi</td></tr>
<tr><td>Rekomendasi</td><td>Hanya di lab terisolasi / dengan pembatasan ketat</td><td><b>Wajib di production</b></td></tr>
</table></div>
<p>Community string default (<code>public</code>/<code>private</code>) adalah "password" yang diketahui seluruh dunia — bot memindai SNMP publik 24/7.</p>
<h3>Konfigurasi Aman (Cisco IOS) + Penjelasan</h3>
<pre>! --- Opsi lab: v2c yang dikeraskan (JANGAN di production terbuka) ---
Router(config)# ip access-list standard SNMP-MGMT
Router(config-std-nacl)# permit 192.168.99.10 0.0.0.0
  !＾Hanya server Zabbix (192.168.99.10) yang boleh SNMP. WAJIB — tanpa ini,
  ! community string bisa dicoba dari mana saja.
Router(config)# snmp-server community Z4bb1xStr0ng! RO SNMP-MGMT
  !＾Community kompleks (bukan "public"!) + RO (read-only, bukan RW!) +
  ! terikat ACL. Tiga lapis proteksi untuk v2c.

! --- Opsi production: SNMP v3 ---
Router(config)# snmp-server group NETADMIN v3 priv
  !＾Grup dengan level priv (auth + enkripsi).
Router(config)# snmp-server user zabbix NETADMIN v3 auth sha AuthPass123 priv aes 128 PrivPass123
  !＾User zabbix: autentikasi SHA + enkripsi AES. Kredensial tak pernah plaintext.
Router(config)# snmp-server host 192.168.99.10 traps version 3 priv zabbix
  !＾Kirim trap (alarm) ke Zabbix via v3 terenkripsi.</pre>
<h3>MikroTik</h3>
<pre>[admin@MikroTik] &gt; /snmp set enabled=yes contact="NOC" location="JKT"
[admin@MikroTik] &gt; /snmp community set [find default=yes] addresses=192.168.99.10/32 name=Z4bb1xStr0ng!
  !＾Community diganti + dibatasi hanya dari IP Zabbix. "addresses" = ACL-nya MikroTik.</pre>
<div class="callout"><div class="t">RO vs RW — Penting!</div><p style="margin:4px 0 0"><b>RO (read-only):</b> hanya membaca — untuk monitoring. <b>RW (read-write):</b> bisa <i>mengubah</i> konfigurasi via SNMP — JANGAN pernah berikan ke monitoring; RW hanya bila ada kebutuhan otomasi spesifik dan terkontrol.</p></div>`,
      terms: [
        ['SNMP', 'Simple Network Management Protocol — protokol monitoring device (dipakai Zabbix).'],
        ['Community string', 'Semacam password SNMP v1/v2c — dikirim plaintext, wajib kompleks & dibatasi ACL.'],
        ['SNMP v3', 'Versi aman: autentikasi user + enkripsi data (auth/priv). Standar production.'],
        ['Trap', 'Alarm yang dikirim device ke server monitoring saat kejadian (link down, violation).'],
      ],
      diagram: `<pre>   SNMP v2c vs v3 (apa yang dilihat penyadap?)

   v2c:  Zabbix ──"community: public, beri saya CPU"──▶ Router
         Penyadap: membaca community + data. ✖ PLAINTEXT

   v3:   Zabbix ──"user zabbix + bukti auth [terenkripsi]"──▶ Router
         Penyadap: hanya melihat acak. ✔ TERENKRIPSI

   + ACL: hanya 192.168.99.10 boleh bertanya (keduanya wajib!).</pre>`,
      scenario: 'Shodan (mesin pencari device internet) menampilkan ribuan router dengan SNMP <code>public</code> terbuka — termasuk milik sebuah perusahaan yang "tidak tahu" routernya terekspos. Penyerang membaca topologi & traffic mereka gratis. Audit internal: pastikan SNMP <b>tidak pernah</b> bisa diakses dari internet (firewall) + v3 + ACL.',
      bestPractices: 'Standar SNMP: v3 (auth+priv), RO untuk monitoring, community kompleks bila terpaksa v2c, ACL hanya dari server monitoring, dan blokir SNMP di firewall edge.',
      security: 'SNMP RW + community lemah = eksekusi konfigurasi jarak jauh oleh penyerang. Perlakukan kredensial SNMP setara password admin.',
      challenge: 'Di lab: set SNMP v2c dengan community "public" tanpa ACL, lalu scan dari "PC penyerang" — buktikan bisa membaca info device. Lalu keraskan (community kompleks + ACL) dan buktikan kini ditolak.',
      interviewQ: 'Q: "Mengapa SNMP v2c dianggap tidak aman dan apa penggantinya?" — A: Community string plaintext (disadap = bocor) + tanpa enkripsi. Pengganti: SNMP v3 dengan autentikasi (SHA) + enkripsi (AES), plus ACL sumber dan RO-only.',
      quiz: [
        { q: 'Kelemahan utama SNMP v2c adalah…', options: ['Lambat', 'Community string dikirim plaintext tanpa enkripsi', 'Mahal', 'Tidak support router'], answer: 1, explain: 'Plaintext = siapa pun yang menyadap traffic mendapat "password" monitoring.' },
        { q: 'Untuk server monitoring (Zabbix), hak SNMP yang tepat adalah…', options: ['RW agar leluasa', 'RO (read-only) — monitoring hanya butuh membaca', 'Tanpa hak', 'Full admin'], answer: 1, explain: 'Least privilege: monitoring = baca saja; RW memberi kemampuan mengubah konfigurasi.' },
        { q: 'Tiga lapis proteksi SNMP v2c yang dikeraskan?', options: ['Community kompleks + RO + ACL sumber', 'Community "public" saja', 'Tanpa proteksi', 'Matikan Zabbix'], answer: 0, explain: 'Bila terpaksa v2c: nama komunitas sulit ditebak, read-only, dan hanya server monitoring yang boleh bertanya.' },
      ],
    },
    {
      id: '29.11',
      title: 'Logging',
      body: `<p><b>Logging</b> adalah catatan kejadian perangkat: siapa login, interface apa yang down, policy firewall apa yang me-deny, konfigurasi apa yang berubah. Tanpa log, insiden keamanan adalah misteri tanpa saksi — <b>"siapa yang mengubah ini dan kapan?"</b> tidak akan pernah terjawab.</p>
<h3>Level Log (Severity)</h3>
<div class="tblwrap"><table>
<tr><th>Level</th><th>Nama</th><th>Contoh</th></tr>
<tr><td>0–2</td><td>Emergency/Alert/Critical</td><td>Device crash, serangan terdeteksi</td></tr>
<tr><td>3–4</td><td>Error/Warning</td><td>Interface down, login gagal berulang</td></tr>
<tr><td>5–6</td><td>Notice/Informational</td><td>Config berubah, user login/logout</td></tr>
<tr><td>7</td><td>Debug</td><td>Detail paket (hanya saat troubleshooting!)</td></tr>
</table></div>
<p>Aturan praktis: kirim <b>level 0–6 ke syslog server</b>, tampilkan <b>0–4 di console</b> (agar console tidak kebanjiran info).</p>
<h3>Konfigurasi (Cisco IOS) + Penjelasan</h3>
<pre>Router(config)# service timestamps log datetime msec
  !＾Beri stempel WAKTU di setiap log. Tanpa ini, log tak bisa dikorelasikan
  ! ("kejadian jam berapa?"). Wajib + pastikan NTP sinkron (Part 20-an)!
Router(config)# logging host 192.168.99.10
  !＾Kirim log ke syslog server (di VLAN 99). Alasan: log di device hilang
  ! saat device restart / disusupi (penyerang menghapus jejak lokal).
Router(config)# logging trap informational
  !＾Level yang dikirim ke syslog: 0–6. Debug (7) jangan dikirim rutin (banjir).
Router(config)# logging buffered 16384
  !＾Simpan juga di memori lokal sebagai cadangan (16KB) — untuk cek cepat.
Router(config)# login on-failure log
Router(config)# login on-success log
  !＾Catat SETIAP login gagal & sukses — bahan deteksi brute-force.</pre>
<h3>MikroTik</h3>
<pre>[admin@MikroTik] &gt; /system logging action set remote remote=192.168.99.10
[admin@MikroTik] &gt; /system logging add topics=info action=remote
[admin@MikroTik] &gt; /system logging add topics=warning action=remote
  !＾Kirim topik info & warning ke syslog server. Prinsip sama: sentralisasi.</pre>
<h3>Yang Wajib Tercatat (Checklist)</h3>
<ul>
<li>Login sukses/gagal (deteksi brute-force & akses tak sah).</li>
<li>Perubahan konfigurasi + <b>oleh siapa</b> (akuntabilitas).</li>
<li>Interface up/down, routing berubah (korelasi dengan gangguan).</li>
<li>Firewall deny (radar serangan — 29.2).</li>
<li>Port-security violation (29.9).</li>
</ul>
<div class="callout blue"><div class="t">NTP Dulu, Baru Log</div><p style="margin:4px 0 0">Log tanpa waktu sinkron = tidak berguna untuk forensik ("apakah serangan ke firewall terjadi <i>sebelum</i> atau <i>sesudah</i> config berubah?"). Pastikan semua device sinkron ke NTP server yang sama <i>sebelum</i> mengandalkan log.</p></div>`,
      terms: [
        ['Syslog', 'Protokol/Server pengumpul log terpusat dari banyak device.'],
        ['Severity level', 'Tingkatan urgensi log 0 (darurat) – 7 (debug).'],
        ['NTP', 'Network Time Protocol — penyelarasan jam antar device; fondasi log yang bisa dikorelasikan.'],
        ['Forensik', 'Analisis pasca-insiden memakai log & bukti untuk merekonstruksi kejadian.'],
      ],
      diagram: `<pre>   ARSITEKTUR LOGGING TERPUSAT

   [R1] ─┐
   [SW1] ─┼── syslog (UDP 514) ──▶ [Syslog Server 192.168.99.10 @ VLAN 99]
   [FW]  ─┘                              │
                                         ▼
                                  ┌──────────────┐
                                  │ Korelasi:    │
                                  │ 10:02:11 FW deny scan port (brute-force?)
                                  │ 10:02:13 R1 login gagal admin (3x)
                                  │ 10:02:40 SW1 config berubah  ← RANGKAIAN!
                                  └──────────────┘
   Satu device = satu saksi. Semua device = cerita lengkap.</pre>`,
      scenario: 'Senin pagi: konfigurasi firewall berubah tanpa change request. Tanpa log terpusat, investigasi buntu. Dengan syslog: terlihat login sukses user "vendor" jam 02:14 dari IP asing → config berubah 02:16. Ternyata kredensial vendor bocor dan dipakai penyusup. Log mengubah "misteri" menjadi "kasus dengan tersangka".',
      bestPractices: 'Sentralisasi log + NTP sinkron + retensi minimal 90 hari (kebutuhan audit). Review log deny/login-gagal mingguan — jangan hanya disimpan.',
      security: 'Lindungi syslog server seperti aset kritis: hanya VLAN 99 yang bisa kirim, backup log-nya, dan batasi siapa bisa menghapus. Penyerang yang menghapus log = penyerang yang paham forensik.',
      challenge: 'Konfigurasikan logging ke satu "syslog server" (bisa VM Linux dengan rsyslog) dari 2 device lab. Lakukan login gagal 3x dan lihat log-nya muncul terpusat dengan timestamp.',
      interviewQ: 'Q: "Mengapa log harus dikirim ke syslog server, tidak cukup di device?" — A: Log lokal hilang saat restart dan bisa dihapus penyusup; sentralisasi + NTP memungkinkan korelasi antar-device untuk forensik.',
      quiz: [
        { q: 'Fungsi "service timestamps log datetime" adalah…', options: ['Mempercepat log', 'Memberi stempel waktu agar log bisa dikorelasikan antar-device', 'Menghapus log lama', 'Mengenkripsi log'], answer: 1, explain: 'Tanpa timestamp (dan NTP sinkron), urutan kejadian antar-device tidak bisa direkonstruksi.' },
        { q: 'Mengapa login gagal wajib di-log?', options: ['Agar log penuh', 'Deteksi brute-force & akses tak sah sejak dini', 'Syarat garansi', 'Tidak wajib'], answer: 1, explain: 'Pola login gagal berulang = indikasi serangan; tanpa log, serangan berjalan diam-diam.' },
        { q: 'Level log yang dikirim rutin ke syslog sebaiknya…', options: ['Hanya debug (7)', '0–6 (informational ke bawah); debug hanya saat troubleshooting', 'Tidak usah kirim', 'Level 7 selalu'], answer: 1, explain: 'Debug membanjiri server & jaringan; informational sudah mencakup login, config change, dan warning.' },
      ],
    },
    {
      id: '29.12',
      title: 'Backup Configuration',
      body: `<p><b>Backup konfigurasi</b> adalah salinan konfigurasi perangkat yang disimpan aman & berversi. Ini adalah <b>asuransi</b> jaringan: saat device rusak, konfigurasi terhapus, atau ransomware menyerang, backup yang bagus = recovery dalam hitungan menit, bukan hari. <b>Tidak ada backup = tidak ada recovery plan.</b></p>
<h3>Strategi Backup 3-2-1 (Sederhana)</h3>
<ul>
<li><b>3</b> salinan (konfigurasi aktif + 2 backup).</li>
<li><b>2</b> media berbeda (server lokal + USB/NAS).</li>
<li><b>1</b> di lokasi berbeda (cabang / cloud) — untuk bencana gedung.</li>
<li><b>Otomatis & terjadwal</b> (jangan manual — manusia lupa). Ideal: setiap ada perubahan + harian.</li>
</ul>
<h3>Cara Backup (Cisco IOS / MikroTik)</h3>
<pre>! Cisco: salin running-config ke TFTP server (atau USB)
Router# copy running-config tftp://192.168.99.10/R1-2026-10-14.cfg
  !＾Kenapa running (bukan startup)? Karena running = kondisi AKTIF saat ini.
  ! Nama file beri TANGGAL — versioning manual paling sederhana.
Router# copy running-config usbflash0:/R1-backup.cfg
  !＾Salinan kedua di USB device (media berbeda).

# MikroTik: export (teks, bisa dibaca & di-diff) + backup biner
[admin@MikroTik] &gt; /export file=mikrotik-2026-10-14
  !＾Export = script teks perintah. Alasan: bisa dibandingkan (diff) antar versi
  ! dan di-restore per bagian. Format favorit untuk versioning.
[admin@MikroTik] &gt; /system backup save name=mikrotik-2026-10-14
  !＾Backup biner = snapshot penuh (termasuk user & sertifikat). Restore cepat.</pre>
<h3>Otomatisasi (Gambaran)</h3>
<p>Jangan backup manual: gunakan <b>Ansible/Python</b> (Part 32–33) untuk menarik konfigurasi semua device tiap malam ke Git repository — dapat versioning + diff gratis ("apa yang berubah sejak kemarin?"). Inilah jembatan alami ke automation.</p>
<h3>Uji Restore!</h3>
<p>Backup yang <b>belum pernah diuji restore = belum tentu backup</b>. Jadwalkan uji restore ke device lab tiap kuartal: file corrupt, versi tak cocok, atau password enkripsi yang tak bisa dibuka — semuanya ditemukan <i>saat uji</i>, bukan saat bencana.</p>
<div class="callout"><div class="t">Amankan File Backup</div><p style="margin:4px 0 0">File backup berisi <b>seluruh rahasia jaringan</b>: hash password, community SNMP, kunci VPN. Simpan dengan akses terbatas (hanya tim network), enkripsi bila di cloud, dan jangan taruh di share folder umum (lihat skenario 29.7).</p></div>`,
      terms: [
        ['Backup konfigurasi', 'Salinan konfigurasi device untuk recovery — wajib otomatis, berversi, dan teruji.'],
        ['Versioning', 'Penyimpanan banyak versi berdasar waktu — memungkinkan rollback ke titik sehat.'],
        ['RTO / RPO', 'Recovery Time Objective (seberapa cepat pulih) & Recovery Point Objective (seberapa banyak data boleh hilang).'],
      ],
      diagram: `<pre>   STRATEGI BACKUP 3-2-1

   [Device production]
        │  otomatis tiap malam (Ansible/cron)
        ▼
   ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
   │ Git repo di │    │ NAS / USB di │    │ Cloud / site │
   │ server NOC  │    │ ruang server │    │ cabang       │
   │ (versioning │    │ (media ke-2) │    │ (lokasi ke-2)│
   │  + diff)    │    │              │    │              │
   └─────────────┘    └──────────────┘    └──────────────┘
        salinan 1           salinan 2          salinan 3

   + UJI RESTORE tiap kuartal ke device lab.</pre>`,
      scenario: 'Petir menyambar: core switch mati total, harus diganti baru. Tanpa backup: konfigurasi ulang 200 baris dari ingatan = 2 hari + salah-salah. Dengan backup tadi malam di Git: paste ke switch baru = 30 menit, termasuk verifikasi. Backup mengubah bencana menjadi "jadwal maintenance darurat".',
      bestPractices: 'Otomatiskan (jangan andalkan ingatan manusia), beri tanggal di nama file, simpan minimal 30 versi terakhir, dan uji restore berkala. Backup adalah proses, bukan file.',
      security: 'Enkripsi backup yang disimpan di cloud / dibawa teknisi. File backup = peta lengkap + kunci jaringan; kehilangannya setara kebocoran kredensial.',
      challenge: 'Backup konfigurasi 1 device lab-mu dengan 2 metode (TFTP/export + USB/file). Lalu hapus satu baris konfigurasi, restore dari backup, dan verifikasi kembali normal. Catat waktunya — itulah RTO-mu.',
      interviewQ: 'Q: "Bagaimana strategi backup konfigurasi yang baik?" — A: Otomatis terjadwal (Ansible/cron) ke Git untuk versioning, prinsip 3-2-1, nama file bertanggal, akses terbatas + enkripsi, dan yang terpenting: uji restore berkala.',
      quiz: [
        { q: 'Prinsip 3-2-1 dalam backup berarti…', options: ['3 password, 2 user, 1 admin', '3 salinan, 2 media berbeda, 1 di lokasi berbeda', '3 hari sekali', '3 device saja'], answer: 1, explain: 'Redundansi berlapis melindungi dari kegagalan media tunggal dan bencana lokasi.' },
        { q: 'Mengapa backup harus DIUJI restore-nya?', options: ['Agar sibuk', 'Backup yang belum diuji belum tentu bisa dipakai (corrupt/tak cocok) — kegagalan harus ditemukan saat uji, bukan saat bencana', 'Syarat ISP', 'Agar file besar'], answer: 1, explain: 'Banyak "backup" ternyata rusak/tak lengkap; uji restore adalah satu-satunya bukti ia berfungsi.' },
        { q: 'Keunggulan /export MikroTik dibanding backup biner?', options: ['Lebih kecil', 'Format teks: bisa di-diff antar versi & di-restore per bagian', 'Lebih cepat', 'Tanpa password'], answer: 1, explain: 'Teks = versioning bermakna di Git ("apa yang berubah?") — biner hanya snapshot buta.' },
      ],
    },
    {
      id: '29.13',
      title: 'Security Monitoring',
      body: `<p><b>Security monitoring</b> adalah pengawasan <i>berkelanjutan</i> untuk mendeteksi serangan & anomali — bukan menunggu user komplain. Bedanya dengan monitoring biasa (Part 23–27: "apakah device hidup?"): security monitoring bertanya <b>"apakah ada yang MENCURIGAKAN?"</b> Keduanya memakai infrastruktur yang sama (Zabbix/Grafana + syslog), tetapi dengan lensa berbeda.</p>
<h3>Apa yang Dimonitor? (Use Case Keamanan)</h3>
<div class="tblwrap"><table>
<tr><th>Sinyal</th><th>Sumber</th><th>Contoh Alarm</th></tr>
<tr><td>Login gagal berulang</td><td>Syslog (29.11)</td><td>5x gagal dalam 1 menit → dugaan brute-force SSH</td></tr>
<tr><td>Firewall deny melonjak</td><td>Log FortiGate</td><td>Scan port: ratusan deny dari 1 IP dalam semenit</td></tr>
<tr><td>Port-security violation</td><td>SNMP trap (29.9)</td><td>Perangkat asing dicolok ke port dinding</td></tr>
<tr><td>Traffic anomali</td><td>NetFlow/sFlow + Grafana</td><td>Upload besar jam 2 pagi dari VLAN office (eksfiltrasi?)</td></tr>
<tr><td>Config berubah tanpa tiket</td><td>Syslog + diff backup</td><td>Perubahan di luar maintenance window</td></tr>
<tr><td>Device baru di jaringan</td><td>ARP/DHCP log</td><td>MAC tak dikenal muncul (rogue device)</td></tr>
</table></div>
<h3>Alur Data: Device → Dashboard</h3>
<p>Ingat pola dari Part 23: <b>device → protokol → collector → database → dashboard</b>. Untuk keamanan, alurnya sama dengan sumber tambahan:</p>
<pre>[Router/Switch/FW] ──syslog/SNMP trap──▶ [Collector: Zabbix / syslog server]
        │                                            │
        │ NetFlow/sFlow (pola traffic)               ▼
        └──────────────────────────────────▶ [Database] ──▶ [Grafana dashboard
                                                              "Security Overview"]
Alarm: Telegram/email ke NOC saat threshold terlampaui.</pre>
<h3>Membangun Baseline & Threshold</h3>
<ul>
<li><b>Baseline dulu:</b> amati 2–4 minggu pola normal (berapa login gagal/hari yang wajar? berapa deny firewall normal?). Alarm tanpa baseline = banjir false positive yang akhirnya diabaikan.</li>
<li><b>Threshold bertahap:</b> mulai longgar, ketatkan perlahan. Contoh: alarm brute-force di 10x gagal/menit → turunkan ke 5x setelah seminggu tanpa false alarm.</li>
<li><b>Korelasi:</b> satu sinyal = info; <i>tiga sinyal bersamaan</i> (scan port + login gagal + config berubah) = insiden. Dashboard yang mengorelasikan jauh lebih berharga dari 100 alarm mentah.</li>
</ul>
<div class="callout blue"><div class="t">SIEM — Wawasan Lanjutan</div><p style="margin:4px 0 0"><b>SIEM</b> (Security Information & Event Management) adalah "Zabbix-nya keamanan": mengumpulkan log dari <i>semua</i> sumber (jaringan, server, aplikasi), mengorelasikan, dan memberi skor risiko. Contoh: Wazuh (gratis), Splunk/ELK. Setelah fondasi Part ini kuat, SIEM adalah langkah lanjutan yang alami.</p></div>`,
      terms: [
        ['Security monitoring', 'Pengawasan berkelanjutan untuk mendeteksi serangan/anomali, bukan sekadar up/down.'],
        ['Baseline', 'Pola normal terukur — pembanding untuk mendeteksi anomali.'],
        ['False positive', 'Alarm palsu (bukan serangan) — musuh utama monitoring; diatasi dengan baseline & threshold tepat.'],
        ['SIEM', 'Sistem korelasi log keamanan terpusat dari banyak sumber.'],
        ['NetFlow/sFlow', 'Protokol statistik pola traffic (siapa bicara dengan siapa, seberapa besar) untuk deteksi anomali.'],
      ],
      diagram: `<pre>   SECURITY MONITORING: dari sinyal menjadi aksi

   Sinyal mentah →─────────── Korelasi ───────────▶ Aksi
   • login gagal 5x     ┌──────────────────┐
   • deny FW melonjak ─▶│ 3 sinyal dlm 2 mnt│──▶ Alarm prioritas tinggi
   • MAC asing muncul   │ = INSIDEN?       │    → tiket + isolasi port
   └──────────────────┘    (bukan 3 alarm
                            terpisah)

   Tanpa korelasi: 100 alarm/hari → diabaikan semua (alarm fatigue).</pre>`,
      scenario: 'Jam 02:00: Grafana menunjukkan upload 40 GB dari satu PC office ke IP asing — padahal baseline upload malam ≈ 0. NOC membangunkan engineer; PC diisolasi; ternyata malware eksfiltrasi data. Tanpa security monitoring, kebocoran baru ketahuan berminggu-minggu kemudian (atau tidak pernah). Moral: penyerang bekerja saat kamu tidur — monitoring tidak.',
      bestPractices: 'Mulai dari 5–10 use case paling bernilai (brute-force, scan port, rogue device, config liar, traffic anomali), bukan 100 alarm sekaligus. Kualitas alarm > kuantitas.',
      security: 'Lindungi infrastruktur monitoring itu sendiri: server Zabbix/syslog di VLAN 99, kredensial kuat, backup konfigurasi monitoring. Penyerang canggih melumpuhkan "CCTV digital" dulu sebelum beraksi.',
      challenge: 'Buat 1 dashboard "Security Overview" di Grafana (atau sketsa di kertas): 4 panel — login gagal, firewall deny, port violation, top talker malam hari. Tentukan threshold tiap panel berdasar baseline khayalan yang masuk akal.',
      interviewQ: 'Q: "Apa beda network monitoring dan security monitoring?" — A: Network monitoring: "apakah sehat/hidup?" (up/down, traffic). Security monitoring: "apakah mencurigakan?" (brute-force, scan, anomali) — infrastruktur mirip (Zabbix/Grafana/syslog), lensa & use case berbeda.',
      quiz: [
        { q: 'Mengapa baseline penting sebelum memasang alarm keamanan?', options: ['Agar grafik bagus', 'Tanpa baseline, threshold asal-asalan → banjir false positive yang akhirnya diabaikan', 'Syarat lisensi', 'Tidak penting'], answer: 1, explain: 'Alarm yang salah terus-menerus menyebabkan alarm fatigue — alarm sungguhan ikut terabaikan.' },
        { q: 'Kombinasi sinyal yang paling mengindikasikan insiden nyata?', options: ['Satu login gagal', 'Scan port + login gagal berulang + config berubah dalam waktu berdekatan (korelasi)', 'Traffic normal', 'Satu deny firewall'], answer: 1, explain: 'Korelasi multi-sinyal membedakan serangan dari noise; satu sinyal tunggal sering bukan apa-apa.' },
        { q: 'Infrastruktur security monitoring dibangun di atas…', options: ['Hal baru yang terpisah total', 'Infrastruktur monitoring yang sama (Zabbix/Grafana/syslog) + sumber seperti NetFlow — dengan use case keamanan', 'Tanpa tool', 'Hanya firewall'], answer: 1, explain: 'Pola alur data sama (device → collector → DB → dashboard); yang berbeda adalah pertanyaan dan threshold-nya.' },
      ],
    },
  ],
};
