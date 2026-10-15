import type { Part } from './types';

export const part17: Part = {
  id: '17',
  number: 'PART 17',
  title: 'FortiGate Fundamentals',
  phaseId: 'fase-3',
  description: 'Konsep firewall FortiGate: stateful inspection, zone, address & service object, policy, NAT, routing, dan CLI FortiOS.',
  repoFolder: 'part-17-fortigate-fundamentals',
  objectives: [
    'Menjelaskan peran firewall, bedanya dengan router, dan cara kerja stateful inspection.',
    'Memahami arsitektur FortiGate/FortiOS dan menjalankan FortiGate VM.',
    'Mengonfigurasi interface, zone, address object, dan service object.',
    'Membuat firewall policy, NAT, VIP/port forwarding, dan static routing.',
    'Mengonfigurasi DHCP, DNS, logging, dan mengoperasikan CLI FortiOS.'
  ],
  prerequisites: 'Part 13–16 (RouterOS, CHR, GNS3). Konsep VLAN & subnet dari Part 08–12.',
  subbabs: [
    {
      id: '17.1',
      title: 'Apa Itu Firewall?',
      body: `<p><b>Firewall</b> adalah "penjaga gerbang + pemeriksa identitas" jaringan: memutuskan packet mana boleh lewat dan mana ditolak, berdasar <b>aturan (policy)</b> yang kamu tulis. Jika router menjawab "ke mana packet pergi", firewall menjawab "<b>bolehkah</b> packet pergi".</p><h3>Generasi Firewall</h3><div class="tblwrap"><table><tr><th>Generasi</th><th>Cara Kerja</th><th>Contoh</th></tr><tr><td>Packet filter (stateless)</td><td>Cek tiap packet terpisah (IP/port) tanpa ingat koneksi</td><td>ACL router sederhana</td></tr><tr><td><b>Stateful</b></td><td>Mengingat koneksi; balasan otomatis diizinkan</td><td>FortiGate, MikroTik filter</td></tr><tr><td>NGFW (Next-Gen)</td><td>Stateful + inspeksi aplikasi, IPS, antivirus</td><td>FortiGate dengan UTM</td></tr></table></div><h3>Mengapa Dibutuhkan?</h3><ul><li><b>Internet = tidak tepercaya.</b> Tanpa firewall, tiap device terekspos langsung ke pemindaian dan serangan global.</li><li><b>Segmentasi butuh penegak.</b> VLAN memisahkan; firewall yang <b>menegakkan</b> siapa boleh ke mana (GUEST → SERVER? tidak!).</li><li><b>Kontrol aplikasi.</b> NGFW bisa membedakan "browsing" vs "YouTube" vs "malware" — bukan sekadar port.</li></ul><div class="callout blue"><div class="t">Firewall dalam OSI</div><p style="margin:4px 0 0">Firewall klasik bekerja di <b>Layer 3–4</b> (IP, port, state koneksi). NGFW naik ke <b>Layer 7</b> (mengenali aplikasi & konten). FortiGate mencakup keduanya.</p></div>`,
      terms: [['Firewall', 'Penjaga gerbang jaringan yang menegakkan policy allow/deny per packet/koneksi.'], ['Policy', 'Aturan firewall: siapa (sumber) boleh ke mana (tujuan) memakai apa (service) — aksi allow/deny.'], ['NGFW', 'Next-Generation Firewall: firewall + inspeksi aplikasi, IPS, antivirus.'], ['UTM', 'Unified Threat Management — bundel fitur keamanan (IPS, AV, web filter) di satu box.']],
      diagram: `<pre>              FIREWALL = PENJAGA GERBANG

   [Internet/tidak tepercaya] --&gt; [FIREWALL] --&gt; [LAN/tepercaya]
                                        |
                              cek policy tiap koneksi:
                              LAN → Internet : ALLOW
                              Internet → LAN : DENY (kecuali aturan khusus)
                              GUEST → SERVER : DENY

   Router: "ke mana?"   Firewall: "bolehkah?"</pre>`,
      scenario: 'Ransomware masuk lewat laptop yang browsing situs berbahaya. Di perusahaan tanpa firewall, ia menyebar ke server dalam menit. Di perusahaan dengan FortiGate + IPS, koneksi C&C-nya diblokir di gerbang — insiden selesai sebelum mulai.',
      bestPractices: 'Tempatkan firewall di setiap perbatasan trust: internet, antar-VLAN sensitif, dan data center.',
      security: 'Firewall bukan sihir — ia hanya sekuat policy-nya. Policy "allow all" = tidak ada firewall.',
      challenge: 'Tulis 3 policy untuk kantor imajinasimu: LAN→Internet, Internet→Server, Guest→apapun. Tentukan allow/deny tiap baris.',
      interviewQ: 'Q: "Apa beda firewall stateless dan stateful?" — A: Stateless menilai tiap packet terpisah tanpa konteks; stateful mengingat koneksi sehingga balasan dari koneksi sah otomatis diizinkan — lebih aman dan efisien.',
      quiz: [
        { q: 'Pertanyaan yang dijawab firewall (vs router) adalah…', options: ['Ke mana packet pergi?', '"Bolehkah" packet pergi? (allow/deny)', 'Berapa kecepatannya?', 'Siapa pemiliknya?'], answer: 1, explain: 'Router = forwarding decision; firewall = policy enforcement decision.' },
        { q: 'Keunggulan firewall stateful dibanding packet filter stateless adalah…', options: ['Lebih murah', 'Mengingat koneksi sehingga balasan sah otomatis diizinkan', 'Tanpa konfigurasi', 'Lebih cepat install'], answer: 1, explain: 'Stateful punya session table — tidak perlu rule terpisah untuk traffic balasan.' },
        { q: 'NGFW menambahkan kemampuan…', options: ['Kabel lebih panjang', 'Inspeksi Layer 7: aplikasi, IPS, antivirus', 'Wi-Fi gratis', 'Tanpa butuh listrik'], answer: 1, explain: 'NGFW = stateful + application awareness + threat prevention.' }
      ]
    },
    {
      id: '17.2',
      title: 'Firewall vs Router',
      body: `<p>Router dan firewall sering satu box (FortiGate bisa routing; MikroTik bisa firewall), tapi <b>perannya berbeda</b>. Memahami batasnya mencegah salah menaruh aturan.</p><div class="tblwrap"><table><tr><th>Aspek</th><th>Router</th><th>Firewall</th></tr><tr><td>Pertanyaan utama</td><td>Ke mana packet diteruskan?</td><td>Bolehkah packet diteruskan?</td></tr><tr><td>Dasar keputusan</td><td>Tabel routing (destination IP)</td><td>Policy (source, destination, service, state)</td></tr><tr><td>Default behavior</td><td>Teruskan bila ada route</td><td>Tolak bila tidak ada policy allow (default deny)</td></tr><tr><td>Contoh device</td><td>RouterOS, router Cisco</td><td>FortiGate, MikroTik filter</td></tr></table></div><h3>Urutan Kerja Saat Digabung</h3><p>Di FortiGate, packet <b>masuk → cek policy firewall DULU → baru routing</b> (kebalikan dari MikroTik yang routing dulu untuk dstnat — detail di 18.10). Konsekuensinya: packet yang di-deny policy tidak pernah sampai ke proses routing.</p><div class="callout"><div class="t">Satu Box, Dua Topi</div><p style="margin:4px 0 0">FortiGate adalah <b>router + firewall</b> sekaligus. Saat troubleshooting, tentukan dulu: ini masalah <b>routing</b> (packet tidak tahu jalan) atau <b>policy</b> (packet dilarang jalan)? Salah menduga = salah memperbaiki.</p></div>`,
      terms: [['Default deny', 'Prinsip firewall: tolak semua kecuali yang diizinkan policy.']],
      diagram: `<pre>           ROUTER vs FIREWALL

   [Packet datang]
        |
   +----v-----+
   | FIREWALL |  "Bolehkah?" --TIDAK--&gt; DROP
   +----+-----+
        | YA
   +----v-----+
   |  ROUTER  |  "Ke mana?" --tidak ada route--&gt; DROP
   +----+-----+
        |
   [Teruskan ke tujuan]

   Di FortiGate: policy dicek SEBELUM routing.</pre>`,
      scenario: 'User tidak bisa akses server. Engineer mengutak-atik routing 1 jam — ternyata policy firewall mendrop. Sejak itu ia selalu cek <code>diagnose debug flow</code> (17.18) untuk melihat di tahap mana packet mati.',
      bestPractices: 'Diagnosis: tentukan dulu "routing atau policy" sebelum mengubah apa pun.',
      security: 'Jangan andalkan routing sebagai keamanan ("tidak ada route = aman") — itu security by obscurity; pakai policy deny eksplisit.',
      challenge: 'Jelaskan dengan kata-katamu: mengapa packet yang di-deny firewall tidak butuh routing?',
      interviewQ: 'Q: "Di FortiGate, mana yang dicek dulu: firewall policy atau routing?" — A: Firewall policy dulu — packet yang ditolak tidak pernah mencapai proses routing.',
      quiz: [
        { q: 'Perbedaan mendasar router dan firewall adalah…', options: ['Harga', 'Router memutuskan tujuan; firewall memutuskan izin', 'Warna box', 'Tidak ada beda'], answer: 1, explain: 'Dua pertanyaan berbeda: "ke mana" vs "bolehkah".' },
        { q: 'Default behavior firewall yang aman adalah…', options: ['Allow all', 'Default deny — tolak kecuali ada policy allow', 'Tanya user', 'Acak'], answer: 1, explain: 'Default deny memastikan celah hanya dari policy yang ditulis eksplisit.' },
        { q: 'Urutan pemrosesan di FortiGate adalah…', options: ['Routing dulu baru policy', 'Policy firewall dulu, baru routing', 'Bersamaan', 'Acak'], answer: 1, explain: 'FortiGate memeriksa policy sebelum routing — deny di awal menghemat proses.' }
      ]
    },
    {
      id: '17.3',
      title: 'Stateful Firewall',
      body: `<p><b>Stateful firewall</b> memelihara <b>session table</b>: daftar koneksi aktif (source IP/port → destination IP/port + state). Saat PC browsing, firewall mencatat session-nya; <b>balasan dari server otomatis diizinkan</b> karena cocok dengan session — tanpa rule tambahan.</p><h3>Siklus Session</h3><pre>1. PC (192.168.20.10:54321) → SYN → web server (policy: ALLOW)
2. FortiGate mencatat session: 192.168.20.10:54321 ↔ 93.184.216.34:443 [ESTABLISHED]
3. Balasan server (SYN-ACK) → COCOK session → otomatis ALLOW (tanpa policy baru)
4. Koneksi selesai (FIN) / timeout → session dihapus dari tabel</pre><h3>Mengapa Ini Penting?</h3><ul><li><b>Aman:</b> packet balasan palsu yang tidak cocok session = drop (mencegah spoofing).</li><li><b>Efisien:</b> hanya packet PERTAMA (new session) dicek policy; sisanya cukup cocokkan tabel (cepat).</li><li><b>Troubleshooting:</b> <code>diagnose sys session list</code> menunjukkan koneksi aktif — "apakah session terbentuk?" adalah pertanyaan diagnosis kunci.</li></ul><div class="callout blue"><div class="t">Session Table Penuh?</div><p style="margin:4px 0 0">Serangan (mis. SYN flood) bisa memenuhi session table hingga koneksi sah ditolak. FortiGate punya proteksi DoS (session limit, SYN flood mitigation) — dibahas di Part 18/30.</p></div>`,
      terms: [['Stateful firewall', 'Firewall yang mengingat koneksi aktif dalam session table.'], ['Session table', 'Daftar koneksi aktif yang dipakai mencocokkan packet balasan.'], ['SYN flood', 'Serangan membanjiri SYN setengah-jadi untuk menghabiskan resource.']],
      diagram: `<pre>           STATEFUL FIREWALL

   [PC] --SYN (new)--> [FortiGate] cek POLICY: ALLOW?
        |                                    |
        | YA: catat SESSION                  | TIDAK: DROP
        v                                    v
   session: 192.168.20.10:54321 <--> 93.184.216.34:443
        |
   [Server] --SYN-ACK--> [FortiGate] cocok SESSION? YA --> ALLOW
        |                      (tanpa cek policy lagi)
        v
   [PC] &lt;-- balasan diteruskan

   Hanya packet PERTAMA dicek policy; sisanya cocokkan tabel.</pre>`,
      scenario: 'Aplikasi custom gagal padahal policy allow sudah ada. Ternyata aplikasi memakai port dinamis untuk data (seperti FTP aktif) — session helper FortiGate tidak mengenalinya. Solusi: session helper khusus / policy tambahan untuk range port data.',
      bestPractices: 'Saat aplikasi gagal padahal policy ada, cek session table — session terbentuk atau tidak adalah petunjuk utama.',
      security: 'Batasi session per IP (DoS policy) untuk mencegah satu host menghabiskan session table.',
      challenge: 'Jelaskan mengapa firewall stateless butuh rule "balasan" terpisah sedangkan stateful tidak.',
      interviewQ: 'Q: "Bagaimana firewall stateful menangani traffic balasan?" — A: Mencocokkannya dengan session table — balasan dari session yang sudah diizinkan otomatis lolos tanpa evaluasi policy ulang.',
      quiz: [
        { q: 'Fungsi session table adalah…', options: ['Menyimpan password', 'Mencatat koneksi aktif agar balasan sah otomatis diizinkan', 'Menyimpan log setahun', 'Mengatur Wi-Fi'], answer: 1, explain: 'Session table = memori koneksi; dasar perilaku stateful.' },
        { q: 'Packet mana yang dievaluasi policy secara penuh?', options: ['Semua packet', 'Hanya packet pertama pembentuk session (new)', 'Hanya balasan', 'Tidak ada'], answer: 1, explain: 'Setelah session terbentuk, packet berikutnya cukup dicocokkan ke tabel — jauh lebih cepat.' },
        { q: 'Dampak session table penuh akibat serangan adalah…', options: ['Internet lebih cepat', 'Koneksi sah baru ditolak (DoS)', 'Tidak ada dampak', 'Firewall mati total'], answer: 1, explain: 'Resource habis = tidak bisa mencatat session baru — mitigasi dengan DoS protection.' }
      ]
    },
    {
      id: '17.4',
      title: 'FortiGate Architecture',
      body: `<p><b>FortiGate</b> adalah lini firewall/NGFW buatan <b>Fortinet</b>. Sistem operasinya bernama <b>FortiOS</b>. Arsitekturnya dirancang sebagai <b>security fabric</b>: firewall bukan box tunggal, tapi bisa terintegrasi dengan switch/AP Forti (FortiSwitch, FortiAP) yang dikelola terpusat.</p><h3>Komponen FortiOS</h3><div class="tblwrap"><table><tr><th>Komponen</th><th>Peran</th></tr><tr><td>Interface & Zone</td><td>Pintu fisik/logis + pengelompokan trust</td></tr><tr><td>Firewall Policy</td><td>Aturan allow/deny antar zone</td></tr><tr><td>UTM Profiles</td><td>IPS, antivirus, web filter, application control</td></tr><tr><td>VPN</td><td>IPsec & SSL-VPN untuk koneksi aman</td></tr><tr><td>Logging & Reporting</td><td>FortiAnalyzer / local log</td></tr></table></div><h3>FortiGate vs MikroTik — Posisi Masing-Masing</h3><ul><li><b>MikroTik:</b> router serbaguna murah; firewall-nya cukup untuk banyak kasus.</li><li><b>FortiGate:</b> fokus keamanan; UTM (IPS/AV/web filter) dan management terpusat adalah keunggulannya — standar di enterprise menengah-besar Indonesia (bank, pemerintahan).</li></ul><div class="callout"><div class="t">Mengapa Mempelajari Keduanya?</div><p style="margin:4px 0 0">Dunia nyata heterogen: ISP kecil pakai MikroTik, enterprise pakai FortiGate. Engineer yang menguasai keduanya bisa bekerja di kedua dunia — dan memahami kapan memilih yang mana.</p></div>`,
      terms: [['FortiGate', 'Lini firewall/NGFW Fortinet.'], ['FortiOS', 'Sistem operasi FortiGate.'], ['Security Fabric', 'Arsitektur integrasi FortiGate + FortiSwitch + FortiAP terpusat.'], ['Fortinet', 'Vendor keamanan jaringan pembuat FortiGate.']],
      diagram: `<pre>              ARSITEKTUR FortiGate

   +------------------- FortiOS -------------------+
   |  Interface/Zone → Policy → UTM → VPN → Logging |
   +------------------------------------------------+
   |         Security Fabric (terpusat)              |
   |  [FortiGate] --kelola-- [FortiSwitch]          |
   |              --kelola-- [FortiAP]              |
   +------------------------------------------------+

   MikroTik = router serbaguna. FortiGate = spesialis keamanan.</pre>`,
      scenario: 'Bank memilih FortiGate karena butuh IPS + logging terpusat untuk audit regulasi — fitur yang tidak ada di router murah. Keputusan berbasis kebutuhan compliance, bukan sekadar harga.',
      bestPractices: 'Pilih platform berdasar kebutuhan (keamanan/compliance vs harga/fleksibilitas), bukan fanatisme merek.',
      security: 'FortiGate pun butuh hardening: ganti password default, batasi management, update FortiOS (patch CVE).',
      challenge: 'Riset: sebutkan 2 sertifikasi Fortinet (NSE 4, NSE 7) dan posisinya di karir network security.',
      interviewQ: 'Q: "Kapan memilih FortiGate dibanding MikroTik?" — A: Saat butuh NGFW utuh (IPS, AV, web filter), management terpusat, dan compliance enterprise — dengan budget yang sesuai.',
      quiz: [
        { q: 'FortiOS adalah…', options: ['Aplikasi Android', 'Sistem operasi FortiGate', 'Kabel fiber', 'Protokol routing'], answer: 1, explain: 'FortiOS = OS FortiGate, seperti RouterOS untuk MikroTik.' },
        { q: 'Keunggulan utama FortiGate dibanding router serbaguna adalah…', options: ['Harga murah', 'Fokus keamanan: UTM (IPS/AV/web filter) + management terpusat', 'Tanpa konfigurasi', 'Tanpa butuh listrik'], answer: 1, explain: 'FortiGate adalah spesialis keamanan enterprise.' },
        { q: 'Security Fabric merujuk pada…', options: ['Kabel anti api', 'Integrasi terpusat FortiGate + FortiSwitch + FortiAP', 'Enkripsi Wi-Fi', 'Firewall gratis'], answer: 1, explain: 'Fabric = ekosistem Fortinet yang dikelola terpusat dari FortiGate.' }
      ]
    },
    {
      id: '17.5',
      title: 'FortiGate VM',
      body: `<p><b>FortiGate VM</b> adalah FortiGate dalam bentuk virtual machine — FortiOS asli untuk lab dan production virtual. Inilah yang kita pakai di GNS3 (Part 18).</p><h3>Mendapatkan & Menjalankan</h3><ol><li>Download image dari support.fortinet.com (butuh akun; <b>trial/eval license</b> tersedia).</li><li>Format untuk GNS3: qcow2 (atau ova untuk VMware).</li><li>Buat template QEMU di GNS3: RAM <b>2–4 GB</b> (FortiOS jauh lebih berat dari CHR!), CPU 1–2, NIC virtio/e1000.</li><li>Boot pertama ±2–5 menit → login <code>admin</code> / kosong → set password.</li></ol><h3>Lisensi VM</h3><ul><li><b>Trial:</b> fitur penuh dengan batasan (umumnya 15 hari / throughput terbatas) — cukup untuk lab Part 18.</li><li><b>Production:</b> lisensi berdasar vCPU + paket UTM (IPS, AV, web filter berlangganan FortiGuard).</li></ul><div class="callout"><div class="t">Berat? Wajar.</div><p style="margin:4px 0 0">FortiGate VM butuh RAM 2–4 GB dan boot menit — bukan detik seperti CHR. Rencanakan resource GNS3: 1 FortiGate + 2 CHR + VPCS ≈ 6 GB RAM. Jangan jalankan 3 FortiGate di laptop 8 GB.</p></div>`,
      terms: [['FortiGate VM', 'FortiGate sebagai virtual machine — FortiOS asli untuk lab/cloud.'], ['FortiGuard', 'Layanan berlangganan Fortinet: update IPS signature, antivirus, web filter.'], ['Eval license', 'Lisensi trial FortiGate untuk evaluasi/lab.']],
      diagram: `<pre>           FortiGate VM DI GNS3

   [Image qcow2 FortiOS] (support.fortinet.com, eval license)
            |
   Template QEMU: RAM 2-4GB | CPU 1-2 | NIC virtio
            |
   [FG1] ==== [CHR-R1] ==== [SW1] ==== [VPCS]
     |
   Boot 2-5 menit. Login admin → set password → GUI https://IP:443</pre>`,
      scenario: 'Tim security menguji policy baru di FortiGate VM lab sebelum deploy ke FortiGate fisik data center — template VM meniru interface dan zone production. Change gagal di lab = tidak menyentuh production.',
      bestPractices: 'Alokasikan RAM cukup (jangan pelit); pakai eval license hanya untuk lab.',
      security: 'FortiGate VM trial yang terekspos ke internet tetap butuh hardening — trial bukan alasan abai.',
      challenge: 'Cek resource laptop-mu: cukupkah untuk 1 FortiGate VM (4 GB) + 2 CHR (512 MB) + GNS3?',
      interviewQ: 'Q: "Apa perbedaan lisensi FortiGate VM trial dan production?" — A: Trial: fitur penuh tapi terbatas waktu/throughput untuk evaluasi; production: lisensi per vCPU + langganan FortiGuard untuk UTM.',
      quiz: [
        { q: 'Kebutuhan RAM tipikal FortiGate VM adalah…', options: ['256 MB', '2–4 GB', '64 MB', '32 GB'], answer: 1, explain: 'FortiOS + UTM jauh lebih berat dari CHR (512 MB).' },
        { q: 'Image FortiGate VM didapat dari…', options: ['Situs bajakan', 'support.fortinet.com (akun + eval license)', 'Play Store', 'Toko komputer'], answer: 1, explain: 'Resmi via support portal Fortinet dengan akun.' },
        { q: 'Pola yang benar untuk change production adalah…', options: ['Langsung di production', 'Uji di FortiGate VM lab dulu, baru deploy ke fisik', 'Tebak saja', 'Tidak perlu change'], answer: 1, explain: 'Lab VM = staging aman sebelum menyentuh production.' }
      ]
    },
    {
      id: '17.6',
      title: 'FortiGate Interface',
      body: `<p><b>Interface</b> di FortiGate mirip konsepnya dengan RouterOS: port fisik (<code>port1</code>, <code>port2</code>), VLAN sub-interface, dan agregat. Bedanya: setiap interface <b>wajib masuk ke sebuah zone</b> (17.7) — zone-lah yang dipakai policy.</p><h3>Konfigurasi via GUI dan CLI</h3><p><b>GUI:</b> Network → Interfaces → edit port → isi IP/Netmask, Administrative Access (HTTPS, SSH, PING — centang seperlunya!).</p><pre># CLI (FortiOS) — setara dengan klik di GUI:
config system interface
    edit "port2"
        set ip 192.168.20.1 255.255.255.0
        set allowaccess ping https ssh
        set alias "LAN-OFFICE"
    next
end
# Alasan tiap baris:
# - edit "port2"  : masuk mode konfigurasi interface port2
# - set ip        : IP + netmask (format dotted, bukan /24!)
# - set allowaccess : layanan management YANG DIIZINKAN di interface ini.
#     PRINSIP: centang seminimal mungkin. port WAN: KOSONGKAN!
# - set alias     : nama deskriptif (setara comment di MikroTik)
# - next/end      : keluar & simpan (pola config-edit-next-end khas FortiOS)</pre><h3>Administrative Access — Titik Kritis</h3><p><code>allowaccess</code> menentukan layanan apa boleh mengakses FortiGate <b>via interface itu</b>. Interface WAN dengan allowaccess https+ssh = pintu terbuka ke internet. Aturan: <b>management hanya di interface/zone management</b>.</p><div class="callout"><div class="t">GUI dan CLI Saling Setara</div><p style="margin:4px 0 0">Setiap klik di GUI menghasilkan perintah CLI yang bisa dilihat di <b>CLI Console</b> (pojok kanan atas GUI). Belajar dengan GUI sambil memperhatikan CLI-nya = menguasai keduanya sekaligus.</p></div>`,
      terms: [['allowaccess', 'Daftar layanan management yang diizinkan via sebuah interface FortiGate.'], ['alias', 'Nama deskriptif interface di FortiGate (setara comment).'], ['config-edit-next-end', 'Pola CLI FortiOS: masuk config → edit objek → next → end (simpan).']],
      diagram: `<pre>           INTERFACE FortiGate

   GUI: Network → Interfaces → edit port2
     IP: 192.168.20.1/24 | alias: LAN-OFFICE
     [x] PING [x] HTTPS [x] SSH   &lt;-- allowaccess

   CLI setara:
   config system interface → edit "port2" → set ... → next → end

   [port1 WAN: allowaccess KOSONG]  &lt;-- jangan buka management ke internet!
   [port2 LAN: ping https ssh]      &lt;-- management dari LAN/mgmt zone</pre>`,
      scenario: 'Audit menemukan FortiGate dengan allowaccess https+ssh di port WAN — Shodan menunjukkan ribuan FortiGate terekspos serupa menjadi target botnet. Fix 5 menit: kosongkan allowaccess WAN.',
      bestPractices: 'Isi alias di semua interface; allowaccess seminimal mungkin; WAN = kosong.',
      security: 'Jangan pernah centang management access di interface yang menghadap internet.',
      challenge: 'Bandingkan: tulis konfigurasi 1 interface dalam "bahasa GUI" (langkah klik) dan "bahasa CLI" (perintah).',
      interviewQ: 'Q: "Apa itu allowaccess dan mengapa penting?" — A: Daftar layanan management per interface; interface WAN yang membuka HTTPS/SSH = terekspos ke serangan internet.',
      quiz: [
        { q: 'Pola CLI FortiOS untuk konfigurasi adalah…', options: ['set langsung', 'config → edit → set → next → end', 'Klik saja', 'Tidak ada pola'], answer: 1, explain: 'Pola config-edit-next-end khas FortiOS untuk semua objek.' },
        { q: 'Allowaccess pada interface WAN sebaiknya…', options: ['Centang semua', 'Dikosongkan — tidak ada management dari internet', 'Hanya ping', 'Hanya HTTP'], answer: 1, explain: 'Membuka management ke internet = undangan serangan.' },
        { q: 'Fungsi alias pada interface adalah…', options: ['Menambah kecepatan', 'Nama deskriptif (setara comment)', 'Enkripsi', 'Wajib lisensi'], answer: 1, explain: 'Alias membuat konfigurasi dan log terbaca manusia.' }
      ]
    },
    {
      id: '17.7',
      title: 'Zones',
      body: `<p><b>Zone</b> adalah pengelompokan interface berdasar <b>tingkat kepercayaan (trust)</b>: mis. zone <code>WAN</code> (tidak tepercaya), <code>LAN</code>, <code>DMZ</code> (semi-tepercaya). Firewall policy ditulis <b>antar zone</b> (LAN→WAN), bukan antar interface — sehingga policy tetap valid walau interface berganti.</p><h3>Zone Standar</h3><div class="tblwrap"><table><tr><th>Zone</th><th>Trust</th><th>Contoh Interface</th></tr><tr><td>WAN / untrust</td><td>Tidak tepercaya</td><td>port1 (ke ISP)</td></tr><tr><td>LAN / trust</td><td>Tepercaya</td><td>port2 (office), port3 (server)</td></tr><tr><td>DMZ</td><td>Semi-tepercaya</td><td>port4 (server publik)</td></tr><tr><td>MGMT</td><td>Khusus management</td><td>port5 (VLAN 99)</td></tr></table></div><h3>Membuat Zone (CLI)</h3><pre>config system zone
    edit "LAN"
        set interface "port2" "port3"
    next
end
# Alasan: policy nanti ditulis "LAN → WAN" — bukan "port2 → port1".
# Keuntungan: tambah port4 ke LAN? Policy otomatis mencakupnya.
# Tanpa zone, tiap tambah interface = tulis ulang policy.</pre><div class="callout blue"><div class="t">Zone = Abstraksi Cerdas</div><p style="margin:4px 0 0">Analogi: zone seperti "grup WhatsApp" — aturan dibuat untuk grup, bukan per orang. Anggota grup bisa berubah tanpa mengubah aturan.</p></div>`,
      terms: [['Zone', 'Kelompok interface berdasar trust level; policy ditulis antar zone.'], ['Trust level', 'Tingkat kepercayaan: untrust (WAN), trust (LAN), DMZ.'], ['DMZ', 'Demilitarized Zone — segmen semi-tepercaya untuk server publik.']],
      diagram: `<pre>              ZONE = GRUP TRUST

   [port1] --masuk--> ( WAN / untrust )
   [port2] --masuk--> ( LAN / trust ) --+
   [port3] --masuk--> ( LAN / trust ) --+-- policy: LAN → WAN ALLOW
   [port4] --masuk--> ( DMZ )             policy: WAN → DMZ ALLOW (80/443)
                                         policy: WAN → LAN DENY

   Policy antar ZONE (bukan antar port) — fleksibel & awet.</pre>`,
      scenario: 'Kantor menambah gedung baru (port5). Tanpa zone: tulis ulang 10 policy. Dengan zone: set interface port5 → zone LAN — 10 policy langsung berlaku. Penghematan 1 jam.',
      bestPractices: 'Rancang zone sebelum policy; satu interface = satu zone; dokumentasikan trust level tiap zone.',
      security: 'Jangan campur interface beda trust dalam satu zone — itu meruntuhkan model keamanannya.',
      challenge: 'Rancang zone untuk topologi lab Part 18: WAN, LAN-OFFICE, LAN-SERVER, GUEST, MGMT. Tulis tabelnya.',
      interviewQ: 'Q: "Mengapa policy ditulis antar zone bukan antar interface?" — A: Abstraksi — tambah/pindah interface tidak merusak policy; policy mengikuti trust level, bukan port fisik.',
      quiz: [
        { q: 'Fungsi utama zone adalah…', options: ['Menambah kecepatan', 'Mengelompokkan interface berdasar trust agar policy ditulis antar zone', 'Enkripsi', 'Menggantikan VLAN'], answer: 1, explain: 'Zone = abstraksi trust; policy awet terhadap perubahan interface.' },
        { q: 'DMZ ditempatkan untuk…', options: ['User biasa', 'Server publik — semi-tepercaya, terisolasi dari LAN', 'Management', 'Tidak dipakai'], answer: 1, explain: 'DMZ: bisa diakses internet terbatas, tapi tidak boleh bebas ke LAN.' },
        { q: 'Keuntungan menambah interface ke zone existing adalah…', options: ['Tidak ada', 'Policy antar zone otomatis mencakupnya tanpa tulis ulang', 'Lebih cepat', 'Hemat lisensi'], answer: 1, explain: 'Inilah nilai abstraksi zone.' }
      ]
    },
    {
      id: '17.8',
      title: 'Address Objects',
      body: `<p><b>Address object</b> adalah "nama" untuk IP/subnet: mis. <code>LAN_NET</code> = 192.168.20.0/24. Policy firewall memakai nama ini, bukan angka mentah — sehingga perubahan IP cukup di satu tempat.</p><h3>Membuat (GUI & CLI)</h3><p><b>GUI:</b> Policy & Objects → Addresses → Create New.</p><pre>config firewall address
    edit "LAN_OFFICE"
        set subnet 192.168.20.0 255.255.255.0
        set comment "VLAN20 office - Part 01 design"
    next
    edit "SRV_WEB"
        set subnet 192.168.30.10 255.255.255.255
    next
end
# /32 = satu host spesifik. Alasan memakai object: jika subnet office
# pindah ke 192.168.21.0/24, cukup ubah SATU object — semua policy
# yang merujuk "LAN_OFFICE" otomatis ikut.</pre><h3>Jenis Address</h3><ul><li><b>Subnet:</b> 192.168.20.0/24.</li><li><b>IP range:</b> 192.168.20.100–200.</li><li><b>FQDN:</b> <code>update.vendor.com</code> (di-resolve dinamis — untuk tujuan yang IP-nya berubah).</li><li><b>Group:</b> gabungan beberapa object.</li></ul><div class="callout"><div class="t">Konsistensi Desain</div><p style="margin:4px 0 0">Buat address object untuk SEMUA subnet desain lab (VLAN 10/20/30/40/99 — Part 01). Ini "kamus" IP jaringanmu.</p></div>`,
      terms: [['Address object', 'Nama untuk IP/subnet/range/FQDN yang dipakai di policy.'], ['FQDN object', 'Address object berbasis nama domain (IP dinamis di-resolve otomatis).']],
      diagram: `<pre>           ADDRESS OBJECT = KAMUS IP

   [Policy: LAN_OFFICE → WAN ALLOW]
                 |
                 v
   "LAN_OFFICE" = 192.168.20.0/24   (satu definisi)
   "SRV_WEB"    = 192.168.30.10/32  (satu host)
   "GUEST_NET"  = 192.168.40.0/24

   Subnet pindah? Ubah 1 object → semua policy ikut.</pre>`,
      scenario: 'Kantor renumbering subnet office. Tanpa object: edit 25 policy satu per satu (2 jam + risiko salah). Dengan object: edit 1 object (2 menit).',
      bestPractices: 'Buat object untuk semua subnet sejak awal; nama konsisten (HURUF_BESAR); isi comment.',
      security: 'Object FQDN untuk tujuan dinamis mengurangi godaan membuat rule "allow ke semua".',
      challenge: 'Buat 5 address object sesuai desain VLAN Part 01 (10/20/30/40/99).',
      interviewQ: 'Q: "Apa keuntungan address object dibanding menulis IP langsung di policy?" — A: Single source of truth — perubahan IP cukup di satu tempat, mengurangi error dan waktu.',
      quiz: [
        { q: 'Fungsi address object adalah…', options: ['Mempercepat internet', 'Memberi nama pada IP/subnet agar policy mudah dikelola', 'Enkripsi IP', 'Menggantikan DNS'], answer: 1, explain: 'Abstraksi nama → perubahan IP terpusat di satu object.' },
        { q: 'Untuk menunjuk satu host spesifik (192.168.30.10), subnet mask object-nya…', options: ['255.255.255.0', '255.255.255.255 (/32)', '255.255.0.0', '0.0.0.0'], answer: 1, explain: '/32 = tepat satu alamat host.' },
        { q: 'Kapan memakai FQDN object?', options: ['Selalu', 'Untuk tujuan yang IP-nya berubah-ubah (cloud/vendor)', 'Tidak pernah', 'Hanya untuk LAN'], answer: 1, explain: 'FQDN di-resolve dinamis — cocok untuk layanan yang IP-nya tidak tetap.' }
      ]
    },
    {
      id: '17.9',
      title: 'Service Objects',
      body: `<p><b>Service object</b> adalah "nama" untuk <b>protokol + port</b>: mis. <code>HTTP</code> = TCP/80, <code>HTTPS</code> = TCP/443. Policy memakai nama service — lebih terbaca daripada angka port.</p><h3>Contoh (CLI)</h3><pre>config firewall service custom
    edit "APP_WEB"
        set tcp-portrange 80 443
        set comment "web internal"
    next
    edit "DNS_SVC"
        set udp-portrange 53
    next
end
# Alasan custom service: aplikasi internal mungkin pakai port non-standar
# (mis. TCP/8080). Beri nama agar policy terbaca: "allow APP_WEB".</pre><h3>Service Bawaan</h3><p>FortiGate menyediakan ratusan service predefined (HTTP, HTTPS, DNS, SSH, FTP…). Pakai yang bawaan bila cocok; buat custom hanya untuk port aplikasi spesifik.</p><div class="callout blue"><div class="t">Policy = 5W Sederhana</div><p style="margin:4px 0 0">Setiap policy menjawab: <b>SIAPA</b> (source address) → <b>KE MANA</b> (destination) → <b>PAKAI APA</b> (service) → <b>BOLEH/TIDAK</b> (action). Address + service object membuat 5W ini terbaca manusia.</p></div>`,
      terms: [['Service object', 'Nama untuk kombinasi protokol + port (mis. HTTP = TCP/80).']],
      diagram: `<pre>           SERVICE OBJECT

   [Policy: LAN → WAN, service=WEB_ALLOW, action=ALLOW]
                              |
                     "WEB_ALLOW" = TCP 80, 443
                     "DNS_SVC"   = UDP 53
                     "PING"      = ICMP

   Policy terbaca: "LAN boleh WEB_ALLOW ke WAN" — jelas!</pre>`,
      scenario: 'Audit policy menemukan rule "allow TCP/8443" tanpa keterangan — tidak ada yang tahu aplikasi apa. Dengan service object bernama APP_ABSENSI_8443, audit 5 detik selesai.',
      bestPractices: 'Namai service custom dengan jelas + comment aplikasi pemiliknya.',
      security: 'Jangan buat service "ALL TCP" longgar bila hanya butuh 1 port — prinsip least privilege.',
      challenge: 'Buat custom service untuk aplikasi imajinasimu (pilih port non-standar) lengkap dengan comment.',
      interviewQ: 'Q: "Apa itu service object?" — A: Nama untuk protokol+port agar policy terbaca; service custom untuk aplikasi berport non-standar.',
      quiz: [
        { q: 'Service object "HTTPS" merepresentasikan…', options: ['IP address', 'TCP port 443', 'Kabel', 'User'], answer: 1, explain: 'Service = protokol + port yang diberi nama.' },
        { q: 'Kapan membuat custom service?', options: ['Selalu', 'Saat aplikasi memakai port non-standar yang tidak ada di predefined', 'Tidak pernah', 'Tiap policy'], answer: 1, explain: 'Pakai predefined bila cocok; custom untuk kebutuhan spesifik.' },
        { q: 'Prinsip keamanan dalam memilih service di policy adalah…', options: ['Pakai ALL agar gampang', 'Least privilege — hanya service yang dibutuhkan', 'Acak', 'Semua port'], answer: 1, explain: 'Buka seminimal mungkin; ALL membuka celah tak perlu.' }
      ]
    },
    {
      id: '17.10',
      title: 'Firewall Policy',
      body: `<p><b>Firewall policy</b> adalah jantung FortiGate: aturan <b>source → destination + service → action (ACCEPT/DENY)</b>. Policy dievaluasi <b>berurutan dari atas ke bawah</b> — yang cocok pertama menang.</p><h3>Anatomi Policy (GUI: Policy & Objects → Firewall Policy)</h3><div class="tblwrap"><table><tr><th>Field</th><th>Isi Contoh</th><th>Alasan</th></tr><tr><td>Name</td><td>LAN-to-Internet</td><td>Identifikasi di log</td></tr><tr><td>Incoming Interface</td><td>LAN (zone)</td><td>Dari mana traffic masuk</td></tr><tr><td>Outgoing Interface</td><td>WAN (zone)</td><td>Ke mana traffic keluar</td></tr><tr><td>Source</td><td>LAN_OFFICE</td><td>Siapa boleh (address object)</td></tr><tr><td>Destination</td><td>all</td><td>Ke mana saja (internet)</td></tr><tr><td>Service</td><td>ALL</td><td>Atau batasi: HTTP/HTTPS/DNS</td></tr><tr><td>Action</td><td>ACCEPT</td><td>Boleh lewat</td></tr><tr><td>NAT</td><td>Enable</td><td>IP privat → IP WAN (17.11)</td></tr></table></div><h3>CLI Setara</h3><pre>config firewall policy
    edit 1
        set name "LAN-to-Internet"
        set srcintf "LAN"
        set dstintf "WAN"
        set srcaddr "LAN_OFFICE"
        set dstaddr "all"
        set service "ALL"
        set action accept
        set nat enable
    next
end</pre><h3>Urutan = Segalanya</h3><p>Letakkan policy <b>spesifik di atas, umum di bawah</b>. Policy "DENY GUEST→SERVER" harus DI ATAS "ALLOW LAN→ALL" — kalau tidak, rule umum menang duluan dan deny tidak pernah tersentuh. Di paling bawah: <b>implicit deny</b> (bawaan FortiGate menolak yang tak cocok policy).</p><div class="callout"><div class="t">Log Policy Hit</div><p style="margin:4px 0 0">Aktifkan <b>Log Allowed Traffic</b> pada policy penting (atau minimal Log Violation). Tanpa log, kamu tidak tahu policy mana yang "menangkap" traffic — buta saat troubleshooting.</p></div>`,
      terms: [['Firewall policy', 'Aturan allow/deny: incoming→outgoing interface, source, destination, service, action.'], ['Implicit deny', 'Penolakan otomatis di akhir daftar policy untuk traffic tak cocok.']],
      diagram: `<pre>           FIREWALL POLICY (urutan!)

   #  Name              Src → Dst        Svc    Action
   1  Guest-Block-Srv   GUEST → LAN      ALL    DENY   &lt;-- spesifik dulu
   2  LAN-to-Internet   LAN → WAN        ALL    ACCEPT (NAT)
   3  Guest-to-Internet GUEST → WAN      WEB    ACCEPT (NAT)
   --  implicit deny --                            &lt;-- sisanya DITOLAK

   Evaluasi: atas → bawah, cocok pertama menang.</pre>`,
      scenario: 'Policy "block guest ke server" tidak bekerja — ternyata ada di URUTAN 5, di bawah "allow LAN all" yang juga mencakup guest. Pindah ke urutan 1: langsung bekerja. Pelajaran: urutan adalah bagian dari logika.',
      bestPractices: 'Spesifik di atas, umum di bawah; namai policy jelas; aktifkan logging.',
      security: 'Review urutan policy berkala — policy usang di atas bisa membayangi policy baru yang benar.',
      challenge: 'Tulis 4 policy untuk lab Part 18 di kertas beserta urutannya. Kita implementasikan di sana.',
      interviewQ: 'Q: "Policy deny tidak bekerja padahal sudah dibuat. Apa yang kamu cek?" — A: Urutannya — policy umum di atasnya mungkin cocok duluan; pindahkan deny spesifik ke atas.',
      quiz: [
        { q: 'Urutan evaluasi firewall policy adalah…', options: ['Acak', 'Atas ke bawah — cocok pertama menang', 'Bawah ke atas', 'Paralel'], answer: 1, explain: 'First-match: policy spesifik harus di atas policy umum.' },
        { q: 'Implicit deny berarti…', options: ['Semua ditolak termasuk yang ada policy', 'Traffic yang tak cocok policy manapun otomatis ditolak', 'Tidak ada deny', 'Hanya untuk WAN'], answer: 1, explain: 'Jaring pengaman bawaan di akhir daftar policy.' },
        { q: 'Mengapa policy spesifik ditaruh di atas?', options: ['Agar rapi', 'Agar tidak dibayangi (shadowed) policy umum di atasnya', 'Syarat GUI', 'Tidak penting'], answer: 1, explain: 'Policy umum yang cocok duluan akan "menelan" traffic yang seharusnya ditangani policy spesifik.' }
      ]
    },
    {
      id: '17.11',
      title: 'NAT',
      body: `<p><b>NAT</b> di FortiGate mengubah alamat IP packet — konsep sama seperti MikroTik (13.13), beda implementasi: di FortiGate, NAT umumnya <b>menempel pada firewall policy</b> (centang "NAT"), bukan rule terpisah.</p><h3>Source NAT via Policy (GUI & CLI)</h3><p><b>GUI:</b> pada policy LAN→WAN, aktifkan <b>NAT</b> → pilih "Use Outgoing Interface Address" (setara masquerade).</p><pre>config firewall policy
    edit 2
        set nat enable
        # default: pakai IP interface keluar (seperti masquerade)
    next
end
# Alasan menempel di policy: NAT hanya berlaku untuk traffic yang
# DIIZINKAN policy itu — NAT dan izin menjadi satu keputusan.
# Beda dengan MikroTik yang NAT-nya rule terpisah.</pre><h3>Jenis NAT FortiGate</h3><div class="tblwrap"><table><tr><th>Jenis</th><th>Fungsi</th><th>Setara MikroTik</th></tr><tr><td>Source NAT (di policy)</td><td>LAN → Internet (IP privat jadi IP WAN)</td><td>masquerade</td></tr><tr><td>Destination NAT / VIP</td><td>Internet → Server internal</td><td>dst-nat (17.12)</td></tr><tr><td>Central NAT</td><td>Tabel NAT terpisah (mode lanjutan)</td><td>/ip firewall nat</td></tr></table></div><div class="callout blue"><div class="t">Packet Flow NAT FortiGate</div><p style="margin:4px 0 0">Keluar: cek policy (ALLOW?) → <b>NAT source</b> → routing → keluar. Masuk (VIP): <b>DNAT dulu</b> → cek policy (ke IP hasil DNAT!) → routing → server. Perhatikan: policy untuk traffic VIP memakai <b>destination = IP internal</b> (setelah DNAT), bukan IP publik!</p></div>`,
      terms: [['Source NAT', 'Mengubah IP sumber (LAN→Internet), menempel pada policy.'], ['Central NAT', 'Mode NAT terpisah dari policy (lanjutan).']],
      diagram: `<pre>           NAT DI FortiGate

   KELUAR: [PC] → policy LAN→WAN (ALLOW + NAT) → IP jadi IP-WAN → [Internet]
                          "Use Outgoing Interface Address" (= masquerade)

   MASUK:  [Internet] → VIP DNAT (IP publik → 192.168.30.10)
                       → policy WAN→DMZ (dst = 192.168.30.10!) → [Server]

   Ingat: policy untuk VIP memakai IP INTERNAL sebagai destination.</pre>`,
      scenario: 'Port forwarding tidak jalan padahal VIP benar. Ternyata policy-nya memakai destination = IP publik — seharusnya IP internal (hasil DNAT). Satu field salah, 1 jam debugging.',
      bestPractices: 'Untuk VIP, selalu tulis policy dengan destination = IP internal server.',
      security: 'Source NAT menyembunyikan IP internal dari internet — tapi jangan andalkan sebagai satu-satunya proteksi; tetap butuh policy ketat.',
      challenge: 'Jelaskan perbedaan filosofi NAT FortiGate (menempel policy) vs MikroTik (rule terpisah). Mana yang menurutmu lebih aman? Mengapa?',
      interviewQ: 'Q: "Di FortiGate, bagaimana cara me-NAT traffic LAN ke internet?" — A: Aktifkan NAT pada firewall policy LAN→WAN (Use Outgoing Interface Address) — tidak perlu rule NAT terpisah.',
      quiz: [
        { q: 'Di FortiGate, source NAT umumnya dikonfigurasi…', options: ['Sebagai rule terpisah seperti MikroTik', 'Menempel pada firewall policy (centang NAT)', 'Di DHCP', 'Otomatis tanpa setting'], answer: 1, explain: 'Filosofi FortiGate: NAT adalah atribut policy — izin dan translasi satu keputusan.' },
        { q: 'Untuk policy traffic port-forwarding (VIP), destination yang benar adalah…', options: ['IP publik', 'IP internal server (hasil DNAT)', 'IP FortiGate', 'Bebas'], answer: 1, explain: 'Policy dievaluasi SETELAH DNAT — destination = alamat pasca-translasi.' },
        { q: '"Use Outgoing Interface Address" setara dengan di MikroTik…', options: ['dst-nat', 'masquerade', 'routing mark', 'bridge'], answer: 1, explain: 'Otomatis memakai IP interface keluar — konsep masquerade.' }
      ]
    },
    {
      id: '17.12',
      title: 'VIP',
      body: `<p><b>VIP (Virtual IP)</b> adalah objek FortiGate untuk <b>port forwarding / destination NAT</b>: memetakan IP publik (+port) ke server internal. Tamu dari internet "melihat" IP publik, padahal dilayani server di dalam.</p><h3>Konfigurasi (GUI & CLI)</h3><p><b>GUI:</b> Policy & Objects → Virtual IPs → Create New: External IP (IP publik), Mapped IP (192.168.30.10), Port Forwarding → TCP 80→80.</p><pre>config firewall vip
    edit "VIP_WebServer"
        set extip 203.0.113.5
        set mappedip 192.168.30.10
        set extport 80
        set mappedport 80
    next
end
# Lalu BUTUH policy yang merujuk VIP:
config firewall policy
    edit 10
        set name "Internet-to-WebServer"
        set srcintf "WAN"
        set dstintf "DMZ"
        set srcaddr "all"
        set dstaddr "VIP_WebServer"   # ← objek VIP sebagai destination!
        set service "HTTP"
        set action accept
    next
end
# Alasan dua langkah: VIP = "terjemahan alamat"; policy = "izin".
# Tanpa policy, VIP tidak berguna (implicit deny).</pre><div class="callout"><div class="t">Jebakan Umum VIP</div><p style="margin:4px 0 0"><b>1)</b> Lupa policy → VIP tidak jalan. <b>2)</b> Policy memakai dstaddr IP publik (salah — pakai objek VIP). <b>3)</b> extip salah (bukan IP WAN aktif). Checklist ketiganya saat VIP gagal.</p></div>`,
      terms: [['VIP (Virtual IP)', 'Objek DNAT FortiGate: IP publik (+port) → server internal.']],
      diagram: `<pre>              VIP = PORT FORWARDING

   [Internet] → 203.0.113.5:80
        |
   [FortiGate: VIP_WebServer]
        |  extip 203.0.113.5 → mappedip 192.168.30.10
        |  extport 80 → mappedport 80
        v
   [Policy: WAN→DMZ, dst=VIP_WebServer, svc=HTTP, ACCEPT]
        |
        v
   [Server 192.168.30.10:80]

   Dua langkah wajib: VIP + policy yang merujuk VIP.</pre>`,
      scenario: 'Toko online butuh web server lokal bisa diakses pelanggan. Satu VIP (80/443 → 192.168.30.10) + satu policy ketat (hanya HTTP/HTTPS dari all) — selesai tanpa beli IP publik tambahan.',
      bestPractices: 'Batasi service di policy VIP seminimal mungkin (hanya port aplikasi); beri nama VIP deskriptif.',
      security: 'Setiap VIP = pintu dari internet. Pastikan server tujuan hardened dan policy tidak memakai service ALL.',
      challenge: 'Rancang VIP untuk 2 server lab: web (80) dan CCTV NVR (554). Tulis extip/mappedip/port-nya.',
      interviewQ: 'Q: "VIP sudah dibuat tapi tidak bisa diakses dari internet. Apa yang kamu cek?" — A: (1) Policy yang merujuk VIP ada? (2) dstaddr policy = objek VIP (bukan IP publik)? (3) extip = IP WAN yang benar?',
      quiz: [
        { q: 'VIP di FortiGate berfungsi sebagai…', options: ['IP virtual untuk HA', 'Port forwarding: IP publik → server internal', 'VPN', 'DHCP'], answer: 1, explain: 'VIP = objek DNAT: external IP/port dipetakan ke mapped IP/port.' },
        { q: 'Agar VIP berfungsi, selain objek VIP dibutuhkan…', options: ['Tidak ada', 'Firewall policy yang merujuk objek VIP sebagai destination', 'Restart', 'Lisensi baru'], answer: 1, explain: 'VIP hanya translasi; izin tetap dari policy (implicit deny tanpa policy).' },
        { q: 'Pada policy untuk VIP, service sebaiknya…', options: ['ALL', 'Dibatasi hanya port aplikasi yang dibutuhkan', 'Bebas', 'Tidak diisi'], answer: 1, explain: 'Least privilege: buka hanya port yang perlu — VIP adalah pintu dari internet.' }
      ]
    },
    {
      id: '17.13',
      title: 'Static Routing',
      body: `<p>FortiGate juga <b>router</b>: butuh tabel routing untuk tahu ke mana meneruskan packet yang diizinkan policy. Konsepnya identik dengan MikroTik (13.9) — beda sintaks.</p><h3>Konfigurasi (GUI & CLI)</h3><p><b>GUI:</b> Network → Static Routes → Create New.</p><pre>config router static
    edit 1
        set dst 192.168.30.0 255.255.255.0
        set gateway 192.168.20.254
        set device "port2"
        set comment "SERVER via R2"
    next
end
# Alasan tiap baris:
# - set dst     : network tujuan (format IP + netmask dotted)
# - set gateway : next-hop — HARUS reachable langsung (satu subnet)
# - set device  : interface keluar (wajib di FortiOS — tidak seperti
#                 MikroTik yang bisa hanya gateway)</pre><h3>Catatan Penting</h3><ul><li><b>Device wajib diisi</b> — FortiOS butuh tahu interface keluar.</li><li><b>Distance</b> (default 10): seperti di MikroTik — terkecil menang.</li><li><b>Routing dua arah</b> tetap berlaku: FortiGate butuh route pulang juga.</li></ul><div class="callout blue"><div class="t">Policy vs Route: Dua Syarat</div><p style="margin:4px 0 0">Packet butuh <b>keduanya</b>: policy ALLOW <b>dan</b> route yang benar. Salah satu hilang = packet mati. Saat troubleshooting, cek keduanya — jangan hanya salah satu.</p></div>`,
      terms: [['Static route (FortiOS)', 'Route manual: dst + gateway + device (interface keluar wajib).']],
      diagram: `<pre>           STATIC ROUTE FortiOS

   config router static
       edit 1
           set dst 192.168.30.0 255.255.255.0
           set gateway 192.168.20.254   &lt;-- next-hop, satu subnet
           set device "port2"           &lt;-- WAJIB di FortiOS
       next
   end

   Syarat packet hidup: policy ALLOW + route BENAR.</pre>`,
      scenario: 'FortiGate baru dipasang di cabang: policy sudah allow, tapi tidak ada route ke subnet pusat — semua timeout. Tambah satu static route: langsung jalan. "Policy tanpa route = pintu tanpa jalan."',
      bestPractices: 'Isi comment di tiap route; verifikasi dengan get router info routing-table all.',
      security: 'Route yang salah bisa membelokkan traffic — review tabel routing setelah tiap change.',
      challenge: 'Tulis static route FortiOS untuk: 192.168.40.0/24 via 192.168.20.254 dev port2.',
      interviewQ: 'Q: "Apa beda static route FortiOS dan MikroTik?" — A: Konsep sama; FortiOS mewajibkan device (interface keluar) dan memakai format netmask dotted.',
      quiz: [
        { q: 'Parameter wajib di static route FortiOS yang tidak wajib di MikroTik adalah…', options: ['dst', 'device (interface keluar)', 'gateway', 'comment'], answer: 1, explain: 'FortiOS mewajibkan device; MikroTik bisa hanya gateway.' },
        { q: 'Agar packet diteruskan FortiGate, dibutuhkan…', options: ['Policy ALLOW saja', 'Route benar saja', 'Keduanya: policy ALLOW dan route benar', 'Tidak butuh keduanya'], answer: 2, explain: 'Dua syarat kumulatif — satu hilang, packet mati.' },
        { q: 'Fungsi distance pada route adalah…', options: ['Jarak fisik', 'Biaya — terkecil diprioritaskan', 'Kecepatan', 'Tidak ada fungsi'], answer: 1, explain: 'Sama seperti di MikroTik: memilih route terbaik bila ada beberapa.' }
      ]
    },
    {
      id: '17.14',
      title: 'Default Route',
      body: `<p><b>Default route</b> (<code>0.0.0.0/0</code>) adalah "jalan ke semua tujuan tak dikenal" — biasanya ke ISP/internet. Di FortiGate ia hanyalah static route istimewa dengan dst 0.0.0.0.</p><h3>Konfigurasi</h3><p><b>GUI:</b> Network → Static Routes → Create New → Destination: 0.0.0.0/0, Gateway: IP ISP, Interface: port1 (WAN).</p><pre>config router static
    edit 2
        set dst 0.0.0.0 0.0.0.0
        set gateway 203.0.113.1
        set device "port1"
        set comment "default ke ISP"
    next
end
# Alasan: tanpa default route, FortiGate hanya tahu subnet lokal —
# packet ke internet dibuang ("no route to host").</pre><h3>Verifikasi</h3><pre># CLI FortiOS:
get router info routing-table all
# Cari baris: S 0.0.0.0/0 [10/0] via 203.0.113.1, port1
# S = static. Pastikan status aktif (bukan hilang karena gateway down).

execute ping 8.8.8.8
# Ping DARI FortiGate — memastikan FortiGate sendiri punya jalan keluar.</pre><div class="callout"><div class="t">Default Route vs Policy</div><p style="margin:4px 0 0">Default route menjawab "ke mana", policy menjawab "bolehkah". Internet mati bisa karena salah satu: tidak ada default route (routing) ATAU tidak ada policy LAN→WAN (firewall). Cek keduanya berurutan.</p></div>`,
      terms: [['Default route', 'Static route 0.0.0.0/0 — jalur ke semua tujuan tak dikenal (internet).']],
      diagram: `<pre>           DEFAULT ROUTE

   [LAN 192.168.20.0/24] --&gt; [FortiGate] --&gt; ??? 
                                              |
                              S 0.0.0.0/0 via 203.0.113.1, port1
                                              |
                                              v
                                          [ISP/Internet]

   Tanpa baris ini: "no route to host" untuk semua tujuan jauh.</pre>`,
      scenario: 'Setelah ganti ISP, internet mati total. Default route masih menunjuk gateway ISP lama yang sudah tidak aktif. Update gateway → internet pulih. Pelajaran: ganti ISP = update default route.',
      bestPractices: 'Dokumentasikan gateway ISP; pasang monitoring ping ke gateway untuk deteksi dini.',
      security: 'Default route yang menunjuk ke gateway asing (salah ketik) = traffic internet dibelokkan — verifikasi IP gateway dengan teliti.',
      challenge: 'Tulis perintah verifikasi default route dan interpretasikan outputnya (S, distance, via, device).',
      interviewQ: 'Q: "Internet mati setelah ganti ISP. Apa yang kamu cek pertama di FortiGate?" — A: Default route — pastikan gateway = IP baru ISP dan device = interface WAN yang benar.',
      quiz: [
        { q: 'Default route ditulis dengan destination…', options: ['192.168.0.0/16', '0.0.0.0/0', '255.255.255.255', '127.0.0.1'], answer: 1, explain: '0.0.0.0/0 cocok dengan semua alamat — jalan terakhir.' },
        { q: 'Perintah melihat tabel routing di FortiOS adalah…', options: ['/ip route print', 'get router info routing-table all', 'show route', 'display ip'], answer: 1, explain: 'Sintaks FortiOS: get router info routing-table all.' },
        { q: 'Internet mati bisa disebabkan…', options: ['Hanya routing', 'Hanya policy', 'Keduanya: default route hilang/salah ATAU policy LAN→WAN tidak ada', 'Tidak bisa didiagnosis'], answer: 2, explain: 'Dua syarat kumulatif — cek routing dulu, lalu policy.' }
      ]
    },
    {
      id: '17.15',
      title: 'DNS',
      body: `<p>FortiGate butuh <b>DNS</b> untuk dirinya sendiri (resolve FortiGuard, NTP) dan bisa menjadi <b>DNS forwarder</b> untuk client — konsep sama seperti RouterOS (13.12).</p><h3>Konfigurasi (GUI & CLI)</h3><p><b>GUI:</b> Network → DNS → isi Primary/Secondary.</p><pre>config system dns
    set primary 8.8.8.8
    set secondary 1.1.1.1
end
# Alasan: FortiGate memakai ini untuk update signature FortiGuard,
# resolve FQDN object, dan (opsional) melayani client sebagai forwarder.

# DNS database lokal (setara /ip dns static MikroTik):
config system dns-database
    edit 1
        set domain "server-lokal.lan"
        ... (atau pakai DNS filter profile untuk kontrol)
end</pre><h3>DNS untuk Client</h3><p>Arahkan DHCP (17.16) agar DNS client = IP FortiGate, lalu pastikan policy mengizinkan DNS (UDP/53) dari LAN ke FortiGate (interface LAN allowaccess… atau policy LAN→FortiGate). Tanpa ini, client "dapat IP tapi tidak bisa browsing".</p><div class="callout"><div class="t">Gejala Klasik DNS</div><p style="margin:4px 0 0">"Ping 8.8.8.8 bisa, buka google.com gagal" = 99% masalah DNS. Di FortiGate: cek <code>get system dns</code>, lalu <code>execute ping google.com</code> dari FortiGate untuk memastikan DNS-nya sendiri bekerja.</p></div>`,
      terms: [],
      diagram: `<pre>           DNS DI FortiGate

   [FortiGate] --primary 8.8.8.8--> [Internet DNS]
        |
   [Client] --DNS query--> [FortiGate forwarder] --jawab/cache-->
   
   "ping 8.8.8.8 OK tapi google.com gagal" = cek DNS!</pre>`,
      scenario: 'Setelah migrasi firewall, semua user "tidak bisa internet" — ternyata DHCP baru tidak menyertakan DNS. Ping IP jalan, nama gagal. Fix: set DNS di DHCP server FortiGate.',
      bestPractices: 'Selalu sertakan DNS di konfigurasi DHCP; uji resolve dari FortiGate sendiri dulu.',
      security: 'Aktifkan DNS filter (UTM) untuk memblokir domain berbahaya — nilai tambah NGFW.',
      challenge: 'Tulis langkah diagnosis untuk gejala "ping IP OK, buka nama gagal" di FortiGate.',
      interviewQ: 'Q: "User bisa ping 8.8.8.8 tapi tidak bisa buka website. Diagnosis?" — A: Masalah DNS — cek DNS server FortiGate, DHCP DNS untuk client, dan policy yang mengizinkan UDP/53.',
      quiz: [
        { q: 'Gejala "ping 8.8.8.8 OK tapi google.com gagal" menandakan…', options: ['Kabel putus', 'Masalah DNS', 'Firewall mati', 'RAM penuh'], answer: 1, explain: 'IP tercapai tapi nama tidak ter-resolve = DNS.' },
        { q: 'FortiGate butuh DNS untuk…', options: ['Hiasan', 'FortiGuard update, FQDN object, dan opsional forwarder client', 'Tidak butuh', 'Hanya GUI'], answer: 1, explain: 'Banyak fitur FortiGate (signature update, FQDN) bergantung DNS.' },
        { q: 'Agar client bisa memakai FortiGate sebagai DNS, dibutuhkan…', options: ['Tidak ada', 'DHCP mengarahkan DNS ke IP FortiGate + policy mengizinkan UDP/53', 'Kabel baru', 'Restart'], answer: 1, explain: 'Dua syarat: client tahu alamat DNS-nya dan diizinkan bertanya.' }
      ]
    },
    {
      id: '17.16',
      title: 'DHCP',
      body: `<p>FortiGate bisa menjadi <b>DHCP server</b> untuk tiap interface LAN — setara <code>/ip dhcp-server</code> MikroTik (13.11).</p><h3>Konfigurasi (GUI & CLI)</h3><p><b>GUI:</b> Network → Interfaces → edit interface → DHCP Server: Enable → isi range & DNS.</p><pre>config system dhcp server
    edit 1
        set interface "port2"
        set range 192.168.20.100 192.168.20.200
        set netmask 255.255.255.0
        set default-gateway 192.168.20.1
        set dns-server1 192.168.20.1
    next
end
# Alasan tiap baris:
# - range      : pool IP (sisakan .1-.99 untuk static — konsisten!)
# - default-gateway : WAJIB FortiGate sendiri agar client bisa keluar
# - dns-server1     : arahkan ke FortiGate (forwarder, lihat 17.15)</pre><h3>Reserved IP (setara make-static)</h3><p>Untuk printer/CCTV: buat <b>DHCP reserved IP</b> berdasar MAC — client selalu dapat IP sama. GUI: DHCP Server → IP Reservation.</p><div class="callout blue"><div class="t">Satu DHCP per Broadcast Domain</div><p style="margin:4px 0 0">Satu server DHCP per interface/VLAN — sama seperti MikroTik. Dua DHCP server dalam satu broadcast domain = rebutan (rogue DHCP). Pastikan hanya satu yang aktif per segmen.</p></div>`,
      terms: [['DHCP reserved IP', 'IP tetap untuk MAC tertentu (setara make-static MikroTik).']],
      diagram: `<pre>           DHCP SERVER FortiGate

   config system dhcp server
       interface "port2"  (satu server per interface/VLAN)
       range .100 - .200       &lt;-- pool
       gateway 192.168.20.1    &lt;-- diri sendiri
       dns 192.168.20.1        &lt;-- forwarder

   [VPCS] --DORA--> [FortiGate port2] --&gt; dapat .100 + gw + dns</pre>`,
      scenario: 'Printer kantor IP-nya berubah-ubah karena DHCP — user komplain "printer hilang". Solusi: DHCP reservation berdasar MAC printer → IP tetap selamanya, tanpa setting manual di printer.',
      bestPractices: 'Pool .100–.200; reservation untuk device tetap; satu DHCP per segmen.',
      security: 'Waspadai rogue DHCP — di segmen penting, monitor lease baru yang tidak dikenal.',
      challenge: 'Rancang DHCP untuk VLAN 40 GUEST (192.168.40.0/24): tentukan range, gateway, DNS.',
      interviewQ: 'Q: "Apa itu DHCP reservation dan kapan dipakai?" — A: Mengunci MAC ke IP tetap via DHCP — untuk printer, CCTV, server yang butuh IP stabil tanpa konfigurasi manual.',
      quiz: [
        { q: 'Default gateway yang diberikan DHCP FortiGate sebaiknya…', options: ['IP ISP', 'IP FortiGate di interface itu', '8.8.8.8', 'Bebas'], answer: 1, explain: 'Gateway = pintu keluar segmen = IP FortiGate di interface tersebut.' },
        { q: 'DHCP reservation berguna untuk…', options: ['Mempercepat internet', 'Device yang butuh IP tetap (printer/CCTV) berdasar MAC', 'Mematikan DHCP', 'Menambah pool'], answer: 1, explain: 'Kombinasi fleksibilitas DHCP + kepastian IP statis.' },
        { q: 'Bahaya dua DHCP server dalam satu broadcast domain adalah…', options: ['Tidak ada', 'Rebutan — client dapat konfigurasi acak dari salah satu (rogue DHCP)', 'Internet cepat', 'Hemat IP'], answer: 1, explain: 'Client menerima offer pertama yang datang — bisa dari server liar.' }
      ]
    },
    {
      id: '17.17',
      title: 'Logging',
      body: `<p><b>Logging</b> FortiGate mencatat traffic yang cocok policy, kejadian sistem, dan ancaman UTM. Tanpa log, firewall adalah "penjaga yang tidak mencatat tamu".</p><h3>Jenis Log</h3><div class="tblwrap"><table><tr><th>Jenis</th><th>Isi</th><th>Lihat di</th></tr><tr><td>Traffic log</td><td>Koneksi yang di-allow/deny per policy</td><td>Log & Report → Forward Traffic</td></tr><tr><td>Event log</td><td>Login admin, perubahan config, system</td><td>Log & Report → System Events</td></tr><tr><td>Security/UTM log</td><td>IPS, AV, web filter hits</td><td>Log & Report → Security Events</td></tr></table></div><h3>Mengaktifkan Log per Policy</h3><p>Di tiap policy: <b>Log Allowed Traffic → All Sessions</b> (atau Security Events). Tanpa ini, policy yang bekerja tidak meninggalkan jejak — troubleshooting buta.</p><pre># CLI: cek status log
get log setting
# Pastikan log tersimpan (memory/disk) atau diteruskan ke FortiAnalyzer/syslog.</pre><div class="callout"><div class="t">Log Penuh?</div><p style="margin:4px 0 0">FortiGate VM trial punya penyimpanan log terbatas. Di lab: log secukupnya (policy penting saja). Di production: teruskan ke <b>FortiAnalyzer</b> atau syslog server — sama prinsipnya dengan remote syslog MikroTik (13.19).</p></div>`,
      terms: [['Traffic log', 'Catatan koneksi allow/deny per policy.'], ['Event log', 'Catatan kejadian sistem & admin.'], ['FortiAnalyzer', 'Platform log & report terpusat Fortinet.']],
      diagram: `<pre>           LOGGING FortiGate

   [Policy LAN→WAN] --log enable--> [Traffic log]
   [Login admin gagal] ------------> [Event log]
   [IPS memblokir] ----------------> [Security log]
                                            |
                          +-----------------+-----------------+
                          |                                   |
                     Local (memory/disk)              FortiAnalyzer/syslog
                     (terbatas, lab)                 (production)</pre>`,
      scenario: 'Insiden "server lambat": traffic log menunjukkan satu IP internal membuka ribuan session ke luar — terindikasi malware. Tanpa log per policy, tim tidak akan pernah tahu.',
      bestPractices: 'Aktifkan log pada policy penting; teruskan ke server terpusat di production.',
      security: 'Log berisi pola traffic sensitif — amankan akses Log & Report dan retensi sesuai kebijakan.',
      challenge: 'Untuk tiap jenis log, tulis 1 contoh pertanyaan investigasi yang bisa dijawabnya.',
      interviewQ: 'Q: "Policy bekerja tapi tidak ada jejaknya di log. Mengapa?" — A: Opsi log pada policy belum diaktifkan — FortiGate hanya mencatat bila logging di-enable per policy.',
      quiz: [
        { q: 'Untuk mengetahui policy mana yang memblokir user, lihat…', options: ['Event log', 'Traffic/Forward log', 'System status', 'Tidak bisa'], answer: 1, explain: 'Traffic log mencatat allow/deny per policy — bukti forensik.' },
        { q: 'Login admin yang gagal tercatat di…', options: ['Traffic log', 'Event log', 'UTM log', 'Tidak dicatat'], answer: 1, explain: 'Event log = kejadian sistem & administrasi.' },
        { q: 'Di production, log sebaiknya…', options: ['Hanya di memory', 'Diteruskan ke FortiAnalyzer/syslog terpusat', 'Dimatikan', 'Dihapus harian'], answer: 1, explain: 'Penyimpanan lokal terbatas & hilang saat masalah — sentralisasi untuk forensik.' }
      ]
    },
    {
      id: '17.18',
      title: 'FortiGate CLI',
      body: `<p><b>CLI FortiOS</b> diakses via SSH, console, atau <b>CLI Console</b> di GUI. Sintaksnya berbeda dari RouterOS — kuasai pola dasarnya.</p><h3>Pola Perintah</h3><pre># Konfigurasi: config → edit → set → next → end  (sudah dipakai di 17.6-17.16)
# Melihat: get  |  Aksi: execute  |  Diagnosis: diagnose

get system interface          # lihat interface (setara /interface print)
get firewall policy           # lihat policy
get router info routing-table all   # tabel routing
execute ping 8.8.8.8          # ping DARI FortiGate
execute reboot                # reboot (HATI-HATI di production!)</pre><h3>Senjata Troubleshooting: diagnose debug flow</h3><pre>diagnose debug enable
diagnose debug flow filter addr 192.168.20.10
diagnose debug flow trace start 100
# Lalu picu traffic dari 192.168.20.10, dan baca:
# "Allowed by policy X" / "Denied by policy Y" / "no route"
diagnose debug flow trace stop
diagnose debug disable
# Alasan ini powerful: menunjukkan TAHAP EXACT packet mati —
# policy mana, route apa. Setara "CCTV slow-motion" packet.</pre><div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0"><code>execute reboot</code> / <code>execute factoryreset</code> — yang kedua menghapus SEMUA konfigurasi. Di production, factory reset tanpa backup = bencana karir. Selalu backup (<code>execute backup config</code>) sebelum change besar.</p></div>`,
      terms: [['get', 'Perintah melihat konfigurasi/status di FortiOS.'], ['execute', 'Perintah aksi (ping, reboot, backup) di FortiOS.'], ['diagnose', 'Perintah diagnosis mendalam FortiOS.'], ['debug flow', 'Pelacakan tahap-per-tahap perjalanan packet — senjata troubleshooting.']],
      diagram: `<pre>           CLI FortiOS

   get .....  = MELIHAT (get system interface)
   config ... = MENGUBAH (config firewall policy → edit → set → end)
   execute ...= AKSI (execute ping / execute backup config)
   diagnose ..= DIAGNOSIS (diagnose debug flow trace)

   GUI ⇄ CLI: setiap klik GUI = perintah CLI (lihat di CLI Console).</pre>`,
      scenario: 'User komplain diblokir. Engineer menjalankan debug flow dengan filter IP user: "Denied by policy 7 (Guest-Block)". Akar masalah ketemu dalam 2 menit — tanpa menebak-nebak.',
      bestPractices: 'Pelajari get/execute/diagnose; pakai debug flow untuk semua kasus "kenapa diblokir".',
      security: 'Batasi siapa boleh SSH ke FortiGate (trusted hosts); nonaktifkan akses CLI dari WAN.',
      challenge: 'Hafalkan 4 kata kerja CLI (get/config/execute/diagnose) dan 1 contoh masing-masing.',
      interviewQ: 'Q: "Bagaimana kamu tahu policy mana yang memblokir traffic user?" — A: diagnose debug flow dengan filter IP user — output menunjukkan policy yang allow/deny dan tahap kegagalan.',
      quiz: [
        { q: 'Perintah melihat tabel routing di FortiOS adalah…', options: ['show route', 'get router info routing-table all', '/ip route print', 'display'], answer: 1, explain: 'Kata kerja get untuk melihat; sintaks khas FortiOS.' },
        { q: 'Fungsi diagnose debug flow adalah…', options: ['Mempercepat traffic', 'Melacak tahap-per-tahap perjalanan packet (policy mana, route apa)', 'Backup config', 'Update firmware'], answer: 1, explain: 'Debug flow = CCTV slow-motion packet — jawaban pasti untuk "kenapa diblokir".' },
        { q: 'Sebelum change besar di production, yang wajib dilakukan adalah…', options: ['Berdoa', 'Backup config (execute backup config)', 'Langsung eksekusi', 'Matikan log'], answer: 1, explain: 'Backup = jaring pengaman; factory reset tanpa backup = bencana.' }
      ]
    }
  ]
};
