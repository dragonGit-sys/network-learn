import type { Part } from './types';

export const part18: Part = {
  id: '18',
  number: 'PART 18',
  title: 'FortiGate Security Lab',
  phaseId: 'fase-3',
  description: 'Lab keamanan: membangun policy LAN→Internet, server publishing, segmentasi VLAN, management access, dan analisis packet flow.',
  repoFolder: 'part-18-fortigate-security-lab',
  objectives: [
    'Membangun lab FortiGate VM di GNS3 dengan zone dan interface yang benar.',
    'Mengimplementasikan policy allow/deny, NAT, dan port forwarding (VIP).',
    'Menerapkan segmentasi antar-VLAN sesuai desain (VLAN 10/20/30/40/99).',
    'Mengamankan akses management FortiGate.',
    'Menganalisis packet flow FortiGate dan troubleshooting dengan debug flow.'
  ],
  prerequisites: 'Part 15–17 (GNS3, CHR, FortiGate fundamentals). FortiGate VM image + eval license.',
  project: {
    title: 'Project: Secure Office Firewall (FortiGate)',
    html: `<p><b>Tugas:</b> Bangun topologi GNS3: FortiGate VM (FG1) sebagai firewall utama, 2 CHR sebagai router distribusi/akses, switch, dan VPCS yang mensimulasikan VLAN 20 (OFFICE), VLAN 30 (SERVER), VLAN 40 (GUEST). Implementasikan: (1) policy LAN→Internet dengan NAT, (2) VIP port forwarding ke server, (3) deny GUEST→SERVER/LAN, (4) management hanya dari VLAN 99.</p><h3>Langkah Pengerjaan</h3><ol><li>Gambar topologi + buat zone (WAN, LAN, GUEST, DMZ, MGMT) dan address object untuk semua subnet desain Part 01.</li><li>Implementasikan policy sesuai 18.3–18.8; aktifkan log pada tiap policy.</li><li>Uji matriks: OFFICE→Internet OK, GUEST→SERVER DENY, Internet→VIP OK, management dari GUEST DITOLAK.</li><li>Lakukan 1 failure injection (mis. hapus policy) dan dokumentasikan debug flow-nya.</li><li>Export konfigurasi: <code>execute backup config</code> + catat CLI penting (<code>show firewall policy</code>) ke file teks.</li></ol><h3>Upload ke GitHub (Portfolio)</h3><ol><li>Buat repo <code>part-18-fortigate-security-lab</code>.</li><li>Isi: <code>README.md</code> (tujuan, topologi ASCII, tabel zone & policy), <code>topologi.png</code> (screenshot GNS3), <code>fortigate-policy.txt</code> (output show firewall policy yang disanitasi), <code>packet-flow.md</code> (jelaskan 1 alur LAN→Internet tahap-per-tahap), <code>troubleshooting.md</code> (1 kasus debug flow).</li><li>Sanitasi: hapus password, preshared key, dan IP publik asli (ganti dengan 203.0.113.x).</li></ol><h3>Kriteria Selesai</h3><ul><li>Matriks uji keamanan 100% sesuai desain (yang harus ALLOW = ALLOW, yang harus DENY = DENY).</li><li>Tidak ada policy "allow all" yang tidak terdokumentasi alasannya.</li><li>Management tidak bisa diakses dari GUEST/WAN (terbukti via uji).</li><li>Repo GitHub lengkap dengan 5 file dan sanitasi kredensial.</li></ul>`
  },
  subbabs: [
    {
      id: '18.1',
      title: 'LAN → Internet',
      body: `<p>Kasus paling fundamental: user LAN boleh internet. Kita bangun dari nol dengan metodologi lab.</p><h3>Topology</h3><pre>[VPCS-Off .20.10]--[SW1]--[FG1 port2 (LAN 192.168.20.1)]  [FG1 port1 (WAN, DHCP dari NAT)]--[NAT]--internet</pre><h3>Objective</h3><p>VPCS office bisa ping 8.8.8.8 dan resolve google.com.</p><h3>Configuration</h3><ol><li>Buat template FortiGate VM di GNS3 (RAM 4 GB); tambah node FG1 (2 adapter).</li><li>Interface (CLI):<pre>config system interface
    edit "port2"
        set ip 192.168.20.1 255.255.255.0
        set allowaccess ping
        set alias "LAN-OFFICE"
    next
end</pre>Alasan allowaccess hanya ping: management via HTTPS/SSH dibuka nanti dari zone MGMT (18.8) — prinsip least privilege sejak awal.</li><li>Zone:<pre>config system zone
    edit "LAN"
        set interface "port2"
    next
    edit "WAN"
        set interface "port1"
    next
end</pre></li><li>DHCP client di port1 (atau static) + default route via port1 (17.14).</li><li>Address object <code>LAN_OFFICE</code> = 192.168.20.0/24.</li><li>Policy:<pre>config firewall policy
    edit 1
        set name "LAN-to-Internet"
        set srcintf "LAN"
        set dstintf "WAN"
        set srcaddr "LAN_OFFICE"
        set dstaddr "all"
        set service "ALL"
        set action accept
        set nat enable
        set logtraffic all
    next
end</pre>Alasan logtraffic all: lab ini butuh bukti tiap policy bekerja.</li><li>VPCS: <code>ip 192.168.20.10/24 192.168.20.1</code>; DNS = 192.168.20.1 (atur di 17.15/17.16 atau manual).</li></ol><h3>Verification</h3><p>VPCS ping 8.8.8.8 OK; Forward Traffic log menampilkan session ALLOW oleh policy 1.</p><h3>Packet Flow</h3><pre>[VPCS .20.10] --SYN--> [FG1 port2]
  1. Policy check: LAN→WAN, src LAN_OFFICE → cocok policy 1 → ACCEPT
  2. Session dibuat di session table
  3. Source NAT: IP jadi IP WAN FG1
  4. Routing: default route via port1 → keluar
[Internet] --balasan--> cocok session → langsung ALLOW → [VPCS]</pre><h3>Failure Injection</h3><p>Disable policy 1.</p><h3>Troubleshooting</h3><p>Gejala: ping gagal. <code>diagnose debug flow filter addr 192.168.20.10</code> → "Denied by implicit deny" — bukti policy hilang.</p><h3>Fix</h3><p>Enable kembali policy 1.</p><h3>Final Verification</h3><p>Ping OK; log menampilkan policy 1; snapshot <code>lan-internet-ok</code>.</p>`,
      terms: [],
      diagram: `<pre>           LAB 18.1: LAN → INTERNET

   [VPCS .20.10] --[SW1]-- [FG1 port2/LAN .20.1]
                                |
                          policy 1: LAN→WAN ACCEPT+NAT
                                |
                          [FG1 port1/WAN] --[NAT]-- internet

   Uji: ping 8.8.8.8 OK + log policy 1.</pre>`,
      scenario: 'Template standar deployment cabang: policy LAN→Internet + NAT adalah "policy pertama" di setiap FortiGate baru. Dikuasai di lab = siap deploy nyata.',
      bestPractices: 'Selalu aktifkan log saat lab; dokumentasikan tiap policy dengan nama jelas.',
      security: 'Service ALL di policy internet boleh untuk lab; di production batasi ke service yang dibutuhkan.',
      challenge: 'Bangun lab 18.1 hingga ping 8.8.8.8 berhasil. Screenshot log policy-nya.',
      interviewQ: 'Q: "Jelaskan packet flow LAN ke internet di FortiGate." — A: Policy check → session dibuat → source NAT → routing via default route; balasan dicocokkan session.',
      quiz: [
        { q: 'Urutan pemrosesan packet keluar di FortiGate adalah…', options: ['Routing → policy → NAT', 'Policy → session → source NAT → routing', 'NAT → routing → policy', 'Acak'], answer: 1, explain: 'Policy dulu (bolehkah?), lalu session, NAT, baru routing.' },
        { q: 'Fungsi set logtraffic all pada policy lab adalah…', options: ['Mempercepat', 'Memberi bukti tiap policy bekerja (allow/deny tercatat)', 'Wajib lisensi', 'Tidak ada'], answer: 1, explain: 'Tanpa log, troubleshooting buta — lab butuh bukti.' },
        { q: 'Mengapa allowaccess port2 hanya ping (tanpa https/ssh)?', options: ['Lupa', 'Least privilege — management dibuka nanti dari zone khusus', 'Tidak butuh management', 'Error'], answer: 1, explain: 'Buka seminimal mungkin; management dari MGMT zone (18.8).' }
      ]
    },
    {
      id: '18.2',
      title: 'Internet → Server',
      body: `<p>Kasus kedua: server internal (VLAN 30) perlu diakses dari internet — via VIP + policy ketat.</p><h3>Topology</h3><pre>[Internet]--[NAT]--[FG1 port1/WAN]  [FG1 port3/DMZ 192.168.30.1]--[SW2]--[VPCS-Srv .30.10]</pre><h3>Objective</h3><p>Dari "internet" (simulasikan dari VPCS di sisi NAT), akses http://&lt;IP-WAN&gt; sampai ke server.</p><h3>Configuration</h3><ol><li>Interface port3: IP 192.168.30.1/24, alias DMZ-SERVER; zone DMZ berisi port3.</li><li>VIP:<pre>config firewall vip
    edit "VIP_WebServer"
        set extip <IP-WAN-FG1>
        set mappedip 192.168.30.10
        set extport 80
        set mappedport 80
    next
end</pre>Alasan extip = IP WAN FG1 yang didapat dari NAT GNS3 (cek via get system interface).</li><li>Policy:<pre>config firewall policy
    edit 2
        set name "Internet-to-WebServer"
        set srcintf "WAN"
        set dstintf "DMZ"
        set srcaddr "all"
        set dstaddr "VIP_WebServer"
        set service "HTTP"
        set action accept
        set logtraffic all
    next
end</pre>Alasan service hanya HTTP (bukan ALL): pintu dari internet dibuka seminimal mungkin.</li><li>Di VPCS-Srv: jalankan server HTTP sederhana? VPCS tidak bisa — untuk uji, cukup verifikasi <b>deny vs allow</b>: tanpa policy, koneksi ditolak; dengan policy, SYN diteruskan (terlihat di debug flow / log). Untuk uji end-to-end penuh, gunakan VM Ubuntu via integrasi (15.8) sebagai server web.</li></ol><h3>Verification</h3><p>Debug flow dari sisi WAN menunjukkan "Allowed by policy 2" dan DNAT ke 192.168.30.10.</p><h3>Packet Flow</h3><pre>[Internet] --SYN 203.0.113.5:80--> [FG1 port1]
  1. DNAT (VIP): tujuan → 192.168.30.10:80
  2. Policy check: WAN→DMZ, dst VIP_WebServer → policy 2 ACCEPT
  3. Session dibuat; routing ke port3 → server</pre><h3>Failure Injection</h3><p>Hapus policy 2 (VIP tetap ada).</p><h3>Troubleshooting</h3><p>Gejala: koneksi gagal. Debug flow: "Denied by implicit deny" — bukti VIP tanpa policy = tidak berguna.</p><h3>Fix</h3><p>Buat ulang policy 2.</p><h3>Final Verification</h3><p>Flow menunjukkan allow + DNAT benar; snapshot <code>vip-ok</code>.</p>`,
      terms: [],
      diagram: `<pre>           LAB 18.2: INTERNET → SERVER

   [Internet] → IP-WAN:80 → [FG1]
        VIP: extip → 192.168.30.10:80 (DNAT dulu!)
        policy 2: WAN→DMZ, dst=VIP_WebServer, svc=HTTP, ACCEPT
        → [port3/DMZ] → [VPCS-Srv .30.10]

   Ingat: DNAT terjadi SEBELUM policy check.</pre>`,
      scenario: 'UMKM hosting web di server lokal: 1 VIP + 1 policy ketat = online tanpa sewa hosting. Biaya: Rp 0 tambahan.',
      bestPractices: 'VIP selalu berpasangan dengan policy; service seminimal mungkin.',
      security: 'Jangan pernah service ALL pada policy VIP — itu membuka semua port server ke internet.',
      challenge: 'Buktikan dengan debug flow bahwa tanpa policy, VIP tidak berfungsi (implicit deny).',
      interviewQ: 'Q: "Jelaskan urutan DNAT dan policy check untuk traffic masuk." — A: DNAT dulu (VIP menerjemahkan tujuan), baru policy dievaluasi terhadap IP hasil DNAT.',
      quiz: [
        { q: 'Urutan pemrosesan traffic masuk via VIP adalah…', options: ['Policy → DNAT → routing', 'DNAT → policy → routing', 'Routing → DNAT → policy', 'Acak'], answer: 1, explain: 'DNAT harus dulu agar policy tahu tujuan sebenarnya (IP internal).' },
        { q: 'VIP tanpa firewall policy yang merujuknya akan…', options: ['Tetap jalan', 'Ditolak implicit deny — tidak berguna', 'Error boot', 'Membuka semua port'], answer: 1, explain: 'VIP hanya translasi; izin tetap dari policy.' },
        { q: 'Service pada policy VIP sebaiknya…', options: ['ALL', 'Hanya port aplikasi yang dibutuhkan (mis. HTTP)', 'Bebas', 'Kosong'], answer: 1, explain: 'Least privilege untuk pintu dari internet.' }
      ]
    },
    {
      id: '18.3',
      title: 'Allow Policy',
      body: `<p>Menyusun <b>policy allow yang benar</b>: spesifik, terdokumentasi, dan berurutan.</p><h3>Topology</h3><p>Lanjutan 18.1 + 18.2: tambah aturan allow untuk OFFICE→SERVER (VLAN 20 → VLAN 30).</p><h3>Objective</h3><p>OFFICE bisa akses server (HTTP/HTTPS/DNS/PING); policy tercatat rapi.</p><h3>Configuration</h3><pre>config firewall policy
    edit 3
        set name "Office-to-Server"
        set srcintf "LAN"
        set dstintf "DMZ"
        set srcaddr "LAN_OFFICE"
        set dstaddr "SRV_NET"
        set service "HTTP" "HTTPS" "DNS" "PING"
        set action accept
        set logtraffic all
        set comments "Akses user office ke server internal"
    next
end
# Alasan service dibatasi (bukan ALL): user office tidak butuh SSH/RDP
# ke server — hanya aplikasi. Least privilege antar segmen juga berlaku.</pre><h3>Verification</h3><p>Dari VPCS office: ping 192.168.30.1 OK; log policy 3 mencatat session.</p><h3>Packet Flow</h3><p>Sama seperti 18.1 tetapi tanpa NAT (antar interface lokal tidak butuh NAT) — policy → session → routing langsung.</p><h3>Failure Injection</h3><p>Ubah service policy 3 menjadi hanya "PING", lalu coba akses HTTP (simulasi via debug flow).</p><h3>Troubleshooting</h3><p>Gejala: ping OK tapi HTTP gagal. Diagnosis: debug flow menunjukkan service tidak cocok → implicit deny. Service adalah bagian dari "cocok".</p><h3>Fix</h3><p>Kembalikan service lengkap.</p><h3>Final Verification</h3><p>Semua service yang diizinkan lolos; yang tidak, tertolak (verifikasi negatif!).</p><div class="callout blue"><div class="t">Verifikasi Negatif</div><p style="margin:4px 0 0">Uji juga yang SEHARUSNYA gagal (SSH ke server dari office). Keamanan yang tidak diuji = asumsi.</p></div>`,
      terms: [],
      scenario: 'Audit menemukan policy allow ALL antar segmen "karena gampang". Setelah insiden lateral movement, semua policy dipecah per service — allow policy yang baik adalah allow yang spesifik.',
      bestPractices: 'Batasi service; isi comments; uji negatif.',
      security: 'Allow ALL antar segmen = segmentasi hanya di atas kertas.',
      challenge: 'Tambahkan policy Office-to-Server dan lakukan verifikasi negatif (SSH harus ditolak).',
      interviewQ: 'Q: "Apa itu verifikasi negatif dan mengapa penting?" — A: Menguji bahwa yang seharusnya DITOLAK memang ditolak — memastikan policy tidak terlalu longgar.',
      quiz: [
        { q: 'Policy allow yang baik memakai service…', options: ['ALL agar gampang', 'Terbatas pada yang dibutuhkan (least privilege)', 'Acak', 'Tidak diisi'], answer: 1, explain: 'Spesifik = serangan lateral terbatas; ALL = segmentasi semu.' },
        { q: 'Traffic antar interface lokal (LAN→DMZ)…', options: ['Butuh NAT', 'Tidak butuh NAT — langsung routing setelah policy', 'Butuh VPN', 'Tidak bisa'], answer: 1, explain: 'NAT hanya untuk ke IP yang tidak routable kembali (internet); antar subnet lokal cukup routing.' },
        { q: 'Verifikasi negatif bertujuan…', options: ['Mempercepat', 'Memastikan yang seharusnya ditolak memang ditolak', 'Menghapus policy', 'Tidak ada tujuan'], answer: 1, explain: 'Keamanan = membuktikan penolakan, bukan hanya keberhasilan akses.' }
      ]
    },
    {
      id: '18.4',
      title: 'Deny Policy',
      body: `<p>Menegakkan <b>penolakan eksplisit</b>: GUEST tidak boleh ke SERVER/LAN — dengan policy DENY yang ditempatkan benar.</p><h3>Topology</h3><pre>[VPCS-Guest .40.10]--[SW3]--[FG1 port4/GUEST 192.168.40.1]   Zone GUEST berisi port4</pre><h3>Objective</h3><p>GUEST bisa internet, tetapi TIDAK bisa ke OFFICE/SERVER.</p><h3>Configuration</h3><pre># DENY eksplisit — TARUH DI ATAS policy allow umum!
config firewall policy
    edit 4
        set name "Guest-Deny-Internal"
        set srcintf "GUEST"
        set dstintf "LAN" "DMZ"
        set srcaddr "all"
        set dstaddr "all"
        set service "ALL"
        set action deny
        set logtraffic all
    next
end
# Urutan akhir: 4 (deny) di ATAS policy "Guest-to-Internet" (allow).
# Alasan: first-match — deny spesifik harus menang sebelum allow umum.
# Alasan deny eksplisit (bukan andalkan implicit): tercatat di log
# sebagai "deny by policy 4" — jelas untuk audit & troubleshooting.</pre><h3>Verification</h3><p>Guest ping 192.168.20.1 GAGAL (log: deny policy 4); guest ping 8.8.8.8 OK (policy Guest-to-Internet).</p><h3>Packet Flow (Ditolak)</h3><pre>[Guest .40.10] --SYN 192.168.20.5--> [FG1 port4]
  1. Policy check: GUEST→LAN cocok policy 4 → DENY
  2. Log: deny; packet dibuang. Tidak ada session, tidak ada routing.</pre><h3>Failure Injection</h3><p>Pindahkan policy 4 ke BAWAH policy Guest-to-Internet (yang srcaddr all).</p><h3>Troubleshooting</h3><p>Gejala: guest tiba-tiba BISA ke server! Diagnosis: policy allow umum cocok duluan (first-match) — deny tidak pernah dievaluasi. Ini <b>shadowing</b>.</p><h3>Fix</h3><p>Kembalikan policy 4 ke atas (move before).</p><h3>Final Verification</h3><p>Guest→internal GAGAL kembali; guest→internet OK.</p><div class="callout"><div class="t">Shadowing</div><p style="margin:4px 0 0"><b>Shadowing</b> = policy yang tidak pernah tersentuh karena dibayangi policy di atasnya. FortiGate menandai ini di GUI (kolom "policy lookup"). Audit shadowing berkala = hygiene firewall.</p></div>`,
      terms: [['Shadowing', 'Policy yang tidak pernah dievaluasi karena dibayangi policy umum di atasnya.']],
      diagram: `<pre>           LAB 18.4: DENY POLICY

   Urutan BENAR:             Urutan SALAH (shadowed):
   4 Guest-Deny-Internal     5 Guest-to-Internet (allow all)
     (DENY, di atas)         4 Guest-Deny-Internal (TAK PERNAH kena!)
   5 Guest-to-Internet
     (ALLOW)

   First-match: yang atas menang. Deny spesifik SELALU di atas.</pre>`,
      scenario: 'Insiden: device tamu mencapai server keuangan. Investigasi: policy deny ada tapi shadowed oleh allow umum yang ditambahkan belakangan. Pelajaran: tiap tambah policy, cek urutan.',
      bestPractices: 'Deny eksplisit untuk batasan penting; audit shadowing tiap ada policy baru.',
      security: 'Jangan andalkan implicit deny untuk batasan kritis — deny eksplisit memberi log dan kejelasan audit.',
      challenge: 'Praktikkan shadowing: pindahkan deny ke bawah, amati guest bisa akses, lalu perbaiki. Dokumentasikan.',
      interviewQ: 'Q: "Apa itu shadowing dan bagaimana mencegahnya?" — A: Policy tak tersentuh karena dibayangi policy umum di atasnya; cegah dengan menaruh spesifik di atas dan audit urutan tiap perubahan.',
      quiz: [
        { q: 'Policy deny spesifik harus ditempatkan…', options: ['Di bawah allow umum', 'Di atas allow umum (first-match)', 'Di akhir', 'Acak'], answer: 1, explain: 'First-match: deny harus menang sebelum allow umum cocok.' },
        { q: 'Keuntungan deny eksplisit dibanding mengandalkan implicit deny adalah…', options: ['Tidak ada', 'Tercatat jelas di log/audit sebagai deny by policy', 'Lebih cepat', 'Hemat RAM'], answer: 1, explain: 'Kejelasan forensik dan audit — "ditolak oleh policy X".' },
        { q: 'Shadowing terjadi ketika…', options: ['Policy dihapus', 'Policy umum di atas membuat policy di bawahnya tak pernah dievaluasi', 'Firewall mati', 'Log penuh'], answer: 1, explain: 'First-match + urutan salah = policy mati suri.' }
      ]
    },
    {
      id: '18.5',
      title: 'NAT Policy',
      body: `<p>Memahami <b>NAT sebagai atribut policy</b>: kapan NAT di-enable dan kapan tidak.</p><h3>Topology</h3><p>Pakai topologi 18.1–18.4 yang sudah ada.</p><h3>Objective</h3><p>Menentukan dengan benar policy mana butuh NAT dan mana tidak.</p><h3>Configuration (Review)</h3><div class="tblwrap"><table><tr><th>Policy</th><th>NAT?</th><th>Alasan</th></tr><tr><td>LAN→WAN (internet)</td><td>YA (outgoing interface)</td><td>IP privat tidak routable di internet</td></tr><tr><td>GUEST→WAN (internet)</td><td>YA</td><td>Sama — IP privat</td></tr><tr><td>LAN→DMZ (office→server)</td><td>TIDAK</td><td>Antar subnet lokal — routing cukup; NAT justru menyembunyikan IP asli di log server!</td></tr><tr><td>WAN→DMZ (VIP)</td><td>DNAT via VIP</td><td>Tujuan diterjemahkan; source tetap (agar log server tahu IP tamu asli)</td></tr></table></div><h3>Verification</h3><p>Dari server (via VM Ubuntu bila ada): akses log menunjukkan <b>IP asli client office</b> (192.168.20.10), bukan IP FortiGate — bukti NAT tidak dipakai antar-segmen.</p><h3>Failure Injection</h3><p>Aktifkan NAT pada policy LAN→DMZ.</p><h3>Troubleshooting</h3><p>Gejala: koneksi tetap jalan TAPI log server menampilkan semua akses dari IP FortiGate (192.168.30.1) — identitas client hilang. Diagnosis: NAT berlebih menyembunyikan source.</p><h3>Fix</h3><p>Matikan NAT pada policy antar-segmen lokal.</p><h3>Final Verification</h3><p>Log server kembali menampilkan IP client asli.</p><div class="callout blue"><div class="t">NAT ≠ Keamanan</div><p style="margin:4px 0 0">NAT menyembunyikan topologi, bukan mengamankan. Jangan jadikan NAT alasan melonggarkan policy — "kan sudah di-NAT" bukan argumen keamanan.</p></div>`,
      terms: [],
      scenario: 'Forensik insiden gagal: semua log server menampilkan IP firewall karena NAT antar-segmen aktif — penyerang internal tidak terlacak. Sejak itu NAT hanya untuk ke internet.',
      bestPractices: 'NAT hanya untuk tujuan yang tidak routable kembali (internet); matikan antar-segmen lokal.',
      security: 'Log dengan IP asli adalah fondasi forensik — NAT yang salah menghancurkannya.',
      challenge: 'Buat tabel NAT Ya/Tidak untuk 5 policy lab-mu beserta alasannya.',
      interviewQ: 'Q: "Kapan NAT di-enable pada policy dan kapan tidak?" — A: Enable untuk ke internet (IP privat tidak routable); disable antar-segmen lokal agar identitas source terjaga di log.',
      quiz: [
        { q: 'Policy LAN→DMZ (antar subnet lokal) sebaiknya…', options: ['NAT enable', 'NAT disable — agar IP asli client terjaga di log', 'Dihapus', 'Bebas'], answer: 1, explain: 'NAT antar-segmen menyembunyikan source — merusak forensik tanpa manfaat.' },
        { q: 'Alasan NAT di-enable untuk LAN→WAN adalah…', options: ['Keamanan mutlak', 'IP privat tidak routable di internet — harus diterjemahkan', 'Agar cepat', 'Wajib lisensi'], answer: 1, explain: 'Fungsi teknis NAT: membuat IP privat bisa berkomunikasi di internet.' },
        { q: 'Pernyataan yang benar tentang NAT dan keamanan adalah…', options: ['NAT = firewall', 'NAT menyembunyikan topologi tetapi bukan pengganti policy keamanan', 'NAT menghentikan malware', 'Tanpa NAT tidak aman'], answer: 1, explain: 'NAT bukan kontrol keamanan — policy yang ketat tetap wajib.' }
      ]
    },
    {
      id: '18.6',
      title: 'Port Forwarding',
      body: `<p>Praktik <b>port forwarding</b> end-to-end: dari VIP hingga verifikasi, termasuk kasus multi-port.</p><h3>Topology</h3><p>Lanjutan 18.2: tambah forwarding untuk CCTV NVR (port 554) di VLAN 10.</p><h3>Objective</h3><p>Dua layanan (web 80, RTSP 554) bisa diakses dari internet via satu IP WAN.</p><h3>Configuration</h3><pre>config firewall vip
    edit "VIP_WebServer"
        set extip <IP-WAN>  set mappedip 192.168.30.10
        set extport 80      set mappedport 80
    next
    edit "VIP_CCTV"
        set extip <IP-WAN>  set mappedip 192.168.10.50
        set extport 554     set mappedport 554
    next
end
# Dua VIP boleh memakai extip SAMA — dibedakan oleh PORT.
# Alasan: satu IP publik melayani banyak layanan via port berbeda.

config firewall policy
    edit 6
        set name "Internet-to-CCTV"
        set srcintf "WAN"  set dstintf "LAN"
        set srcaddr "all"   set dstaddr "VIP_CCTV"
        set service "RTSP"  # custom service TCP/554 — buat dulu!
        set action accept   set logtraffic all
    next
end</pre><h3>Verification</h3><p>Debug flow dari sisi WAN untuk kedua port: DNAT benar ke masing-masing mappedip; log policy masing-masing.</p><h3>Packet Flow</h3><p>IP-WAN:554 → DNAT → 192.168.10.50:554 → policy 6 → routing ke VLAN 10.</p><h3>Failure Injection</h3><p>Tukar mappedport VIP_CCTV menjadi 555 (salah).</p><h3>Troubleshooting</h3><p>Gejala: koneksi ke :554 timeout. Debug flow: DNAT ke port 555 — server tidak listen di sana. Diagnosis: mapping port salah, bukan policy.</p><h3>Fix</h3><p>Koreksi mappedport ke 554.</p><h3>Final Verification</h3><p>Kedua layanan terjangkau; dokumentasikan mapping port di README portfolio.</p><div class="callout"><div class="t">Port Forwarding vs DMZ Penuh</div><p style="margin:4px 0 0">Forward per-port (ini) jauh lebih aman daripada "DMZ host" (semua port ke satu server). Buka hanya yang perlu — selalu.</p></div>`,
      terms: [['Port forwarding', 'Pemetaan port IP publik ke port server internal (via VIP).'], ['RTSP', 'Real Time Streaming Protocol (TCP/554) — umum untuk CCTV/NVR.']],
      diagram: `<pre>           PORT FORWARDING MULTI-LAYANAN

   IP-WAN:80  --VIP_WebServer--> 192.168.30.10:80  (web)
   IP-WAN:554 --VIP_CCTV-------> 192.168.10.50:554 (CCTV)

   Satu IP publik, banyak layanan — dibedakan PORT.</pre>`,
      scenario: 'Kantor memantau CCTV dari rumah via port forwarding 554 — plus VPN untuk keamanan tambahan (port forwarding CCTV mentah berisiko; Part 31 membahas VPN sebagai alternatif aman).',
      bestPractices: 'Dokumentasikan semua mapping port; review berkala — port yang tak dipakai lagi = tutup.',
      security: 'CCTV/NVR terkenal rentan — pastikan firmware update dan password kuat sebelum di-forward; pertimbangkan VPN sebagai gantinya.',
      challenge: 'Tambahkan VIP ketiga untuk layanan imajinasimu; tulis policy-nya dengan service seminimal mungkin.',
      interviewQ: 'Q: "Satu IP publik untuk 3 server berbeda — bagaimana?" — A: Port forwarding: tiap layanan dipetakan ke port berbeda pada IP yang sama (atau tambah IP bila butuh port sama).',
      quiz: [
        { q: 'Dua VIP bisa memakai extip yang sama bila…', options: ['Tidak bisa', 'Dibedakan oleh port (extport berbeda)', 'Lisensi ganda', 'Tidak perlu alasan'], answer: 1, explain: 'Multiplexing per port — satu IP melayani banyak layanan.' },
        { q: 'Koneksi ke port forwarding timeout padahal policy allow. Tersangka berikutnya…', options: ['Internet mati', 'Mapping extport/mappedport salah di VIP', 'Kabel putus', 'DNS'], answer: 1, explain: 'Cek DNAT di debug flow — port tujuan harus sesuai layanan di server.' },
        { q: 'Dibanding "DMZ host" (semua port), port forwarding per-port…', options: ['Sama saja', 'Jauh lebih aman — hanya port perlu yang dibuka', 'Lebih lambat', 'Lebih mahal'], answer: 1, explain: 'Prinsip least privilege untuk pintu dari internet.' }
      ]
    },
    {
      id: '18.7',
      title: 'Segmentation',
      body: `<p>Mengimplementasikan <b>segmentasi penuh</b> sesuai desain Part 01: VLAN 10/20/30/40/99 dengan matriks akses yang jelas.</p><h3>Topology</h3><pre>[FG1] port2=LAN(20) port3=DMZ(30) port4=GUEST(40) port5=MGMT(99) + VLAN10 CCTV via sub-interface</pre><h3>Objective</h3><p>Matriks segmentasi terimplementasi dan terverifikasi.</p><h3>Configuration — Matriks Policy</h3><div class="tblwrap"><table><tr><th>Dari → Ke</th><th>Action</th><th>Service</th><th>Alasan</th></tr><tr><td>OFFICE → SERVER</td><td>ACCEPT</td><td>HTTP/HTTPS/DNS</td><td>User butuh aplikasi</td></tr><tr><td>OFFICE → Internet</td><td>ACCEPT+NAT</td><td>ALL</td><td>Kerja butuh internet</td></tr><tr><td>GUEST → Internet</td><td>ACCEPT+NAT</td><td>HTTP/HTTPS/DNS</td><td>Tamu browsing saja</td></tr><tr><td>GUEST → OFFICE/SERVER/MGMT</td><td>DENY</td><td>ALL</td><td>Tamu tidak boleh sentuh internal</td></tr><tr><td>CCTV → SERVER (NVR)</td><td>ACCEPT</td><td>RTSP/custom</td><td>Kamera kirim ke NVR</td></tr><tr><td>CCTV → Internet</td><td>DENY</td><td>ALL</td><td>Kamera tidak butuh internet (cegah botnet!)</td></tr><tr><td>MGMT → ALL</td><td>ACCEPT</td><td>SSH/HTTPS/SNMP</td><td>Admin mengelola</td></tr><tr><td>ALL → MGMT</td><td>DENY</td><td>ALL</td><td>Management terisolasi</td></tr></table></div><h3>Verification</h3><p>Uji tiap sel matriks dari VPCS masing-masing segmen; catat hasil OK/DENY sesuai ekspektasi.</p><h3>Failure Injection</h3><p>Hapus policy "CCTV → Internet DENY".</p><h3>Troubleshooting</h3><p>Gejala: kamera bisa ping 8.8.8.8 (seharusnya tidak). Diagnosis: tanpa deny eksplisit, policy umum mungkin mengizinkan — atau implicit deny tidak tercatat. Pelajaran: deny eksplisit untuk batasan kritis.</p><h3>Fix</h3><p>Kembalikan deny eksplisit.</p><h3>Final Verification</h3><p>Seluruh matriks sesuai; snapshot <code>segmentasi-ok</code>.</p><div class="callout blue"><div class="t">Aturan Emas</div><p style="margin:4px 0 0"><b>1 VLAN = 1 subnet = 1 broadcast domain</b> (Part 01) + <b>policy antar zone</b> = segmentasi utuh. VLAN tanpa policy = pemisah tanpa penjaga.</p></div>`,
      terms: [],
      scenario: 'Serangan ransomware menyebar via segmen CCTV yang "katanya terisolasi" — ternyata tidak ada policy deny CCTV→LAN. Segmentasi tanpa enforcement = ilusi.',
      bestPractices: 'Tulis matriks segmentasi di dokumen sebelum implementasi; uji tiap sel.',
      security: 'IoT/CCTV adalah target botnet favorit — deny internet untuk mereka adalah pertahanan murah dan efektif.',
      challenge: 'Implementasikan 8 baris matriks di atas; uji dan catat hasilnya dalam tabel.',
      interviewQ: 'Q: "Apa beda segmentasi VLAN dan firewall policy?" — A: VLAN memisahkan secara logis (Layer 2); policy menegakkan siapa boleh ke mana (Layer 3–4). Keduanya dibutuhkan — VLAN tanpa policy tidak menegakkan apa pun.',
      quiz: [
        { q: 'Mengapa CCTV di-deny ke internet?', options: ['Hemat bandwidth', 'Mencegah kamera direkrut botnet / bocor — ia tidak butuh internet', 'Agar cepat', 'Wajib vendor'], answer: 1, explain: 'IoT rentan; tanpa kebutuhan internet, deny adalah pertahanan termurah.' },
        { q: 'VLAN tanpa firewall policy diibaratkan…', options: ['Sudah aman', 'Pemisah tanpa penjaga — tidak menegakkan apa pun', 'Lebih cepat', 'Tidak masalah'], answer: 1, explain: 'Isolasi Layer 2 butuh enforcement Layer 3/4 agar bermakna.' },
        { q: 'Akses management (MGMT zone) seharusnya…', options: ['Bisa dari semua zone', 'Hanya dari MGMT; ditolak dari zone lain', 'Dari internet', 'Tidak dibatasi'], answer: 1, explain: 'Management terisolasi = permukaan serangan minimal.' }
      ]
    },
    {
      id: '18.8',
      title: 'Management Access',
      body: `<p>Mengamankan <b>akses management FortiGate itu sendiri</b>: siapa boleh SSH/HTTPS ke FortiGate, dari mana.</p><h3>Topology</h3><p>Zone MGMT (port5, 192.168.99.0/24) — hanya dari sini management diizinkan.</p><h3>Objective</h3><p>HTTPS/SSH ke FortiGate hanya dari MGMT; dari GUEST/WAN ditolak dan tercatat.</p><h3>Configuration</h3><pre># 1. allowaccess: hanya di interface MGMT
config system interface
    edit "port5"
        set ip 192.168.99.1 255.255.255.0
        set allowaccess ping https ssh
        set alias "MGMT"
    next
    edit "port1"  # WAN
        set allowaccess ping   # hanya ping untuk diagnosis; tanpa https/ssh!
    next
end
# Alasan: allowaccess adalah "penjaga pertama" — layanan yang tidak
# dicentang tidak akan dijawab di interface itu, sekeras apa pun mencoba.

# 2. Trusted hosts untuk admin (lapis kedua):
config system admin
    edit "admin"
        set trusthost1 192.168.99.10 255.255.255.255
    next
end
# Alasan: bahkan dari MGMT, hanya IP admin terdaftar yang boleh login.
# Dua lapis: interface (allowaccess) + user (trusthost).</pre><h3>Verification</h3><p>Dari VPCS MGMT (.99.10): https://192.168.99.1 bisa dibuka. Dari GUEST: connection refused/timeout + event log mencatat percobaan.</p><h3>Failure Injection</h3><p>Centang https di allowaccess port1 (WAN).</p><h3>Troubleshooting</h3><p>Gejala: halaman login FortiGate bisa dibuka dari "internet" (simulasi). Diagnosis: allowaccess WAN terbuka — ini temuan audit kritis.</p><h3>Fix</h3><p>Kosongkan https/ssh di allowaccess WAN.</p><h3>Final Verification</h3><p>Uji dari tiap zone; hanya MGMT yang bisa management.</p><div class="callout"><div class="t">Dua Lapis Pertahanan</div><p style="margin:4px 0 0"><b>Lapis 1:</b> allowaccess per interface (layanan apa di interface mana). <b>Lapis 2:</b> trusted hosts per admin (IP mana boleh login). Keduanya harus lolos.</p></div>`,
      terms: [['Trusted hosts', 'Daftar IP yang diizinkan login sebagai admin tertentu.']],
      diagram: `<pre>           MANAGEMENT ACCESS (2 LAPIS)

   [Admin .99.10] --https--> [port5/MGMT: allowaccess https+ssh] --OK
                                     |
                              trusthost: .99.10 --OK--> login

   [Guest .40.10] --https--> [port4/GUEST: tanpa https] --DITOLAK (lapis 1)
   [Internet] ----https--> [port1/WAN: tanpa https]   --DITOLAK (lapis 1)</pre>`,
      scenario: 'Botnet memindai internet mencari halaman login FortiGate. Firewall dengan allowaccess WAN terbuka + password lemah = diretas dalam jam. Dua lapis + password kuat = aman.',
      bestPractices: 'Management hanya dari MGMT/VPN; trusted hosts untuk tiap admin; ganti port default bila perlu.',
      security: 'Jangan pernah buka management ke internet — ini vektor serangan #1 ke firewall.',
      challenge: 'Uji akses management dari tiap zone dan catat hasilnya. Pastikan WAN menolak.',
      interviewQ: 'Q: "Bagaimana mengamankan akses management FortiGate?" — A: Dua lapis — allowaccess seminimal mungkin per interface (WAN tanpa management), dan trusted hosts per akun admin; management hanya dari zone MGMT/VPN.',
      quiz: [
        { q: 'Dua lapis pertahanan management access adalah…', options: ['Password + username', 'allowaccess per interface + trusted hosts per admin', 'Firewall + antivirus', 'Tidak ada lapis'], answer: 1, explain: 'Lapis interface (layanan apa di mana) + lapis user (IP mana boleh login).' },
        { q: 'Allowaccess pada interface WAN sebaiknya…', options: ['https+ssh', 'Tanpa layanan management (maksimal ping)', 'Semua', 'FTP'], answer: 1, explain: 'Management dari internet = target empuk botnet.' },
        { q: 'Fungsi trusted hosts adalah…', options: ['Mempercepat login', 'Membatasi IP mana yang boleh login sebagai admin itu', 'Backup config', 'Tidak ada'], answer: 1, explain: 'Bahkan dari zone yang benar, hanya IP terdaftar yang bisa login.' }
      ]
    },
    {
      id: '18.9',
      title: 'Firewall Troubleshooting',
      body: `<p>Metodologi <b>troubleshooting firewall</b> yang sistematis: dari gejala ke bukti.</p><h3>Topology</h3><p>Seluruh lab 18.1–18.8 sebagai arena.</p><h3>Objective</h3><p>Mendiagnosis 3 skenario gangguan umum dengan benar.</p><h3>Configuration (Skenario Latihan)</h3><p>Skenario A: user office tidak bisa internet. Skenario B: VIP tidak bisa diakses. Skenario C: guest bisa akses server (seharusnya tidak).</p><h3>Metodologi — Urutan Baku</h3><pre>1. REPRODUKSI: ulangi dari sisi user, catat EXACT gejala (ping? http? semua?)
2. BATASI: apa yang masih jalan? (petakan gagal vs berhasil — pola!)
3. POLICY: diagnose debug flow filter addr &lt;IP-user&gt; → policy mana?
4. ROUTE: get router info routing-table all → route ada & aktif?
5. NAT/DNAT: translasi benar? (khusus internet/VIP)
6. LOG: Forward Traffic → session tercatat allow/deny oleh policy apa?
7. FIX satu hal → VERIFIKASI → dokumentasikan</pre><h3>Contoh Debug Flow</h3><pre>diagnose debug enable
diagnose debug flow filter addr 192.168.20.10
diagnose debug flow trace start 50
# ... picu traffic ...
# Output yang dibaca:
# "id=20085 trace_id=1 ... msg="Denied by policy 4"
#  → JELAS: policy 4 menolak. Selesai menebak.
diagnose debug flow trace stop
diagnose debug disable</pre><h3>Failure Injection</h3><p>Instruktur/teman merusak satu hal diam-diam (hapus route, pindah urutan policy, salah service).</p><h3>Troubleshooting & Fix</h3><p>Terapkan metodologi 7 langkah; catat waktu diagnosis.</p><h3>Final Verification</h3><p>Semua skenario terdiagnosis dengan bukti (debug flow/log), bukan tebakan.</p><div class="callout blue"><div class="t">Bukti, Bukan Tebakan</div><p style="margin:4px 0 0">Setiap diagnosis harus diakhiri kalimat: "Buktinya adalah …" (log/debug flow). Engineer senior dinilai dari kemampuan membuktikan, bukan menebak cepat.</p></div>`,
      terms: [],
      scenario: 'Tiket "internet lambat" ternyata bukan firewall sama sekali — debug flow menunjukkan allow normal, dan masalahnya di bandwidth ISP. Metodologi mencegah 2 jam mengutak-atik policy yang tidak bersalah.',
      bestPractices: 'Ikuti urutan baku; satu perubahan dalam satu waktu; dokumentasikan.',
      security: 'Jangan "coba-coba" policy di production tanpa backup dan maintenance window.',
      challenge: 'Minta teman merusak lab-mu; diagnosis dengan metodologi ini dan catat waktunya. Target: &lt;15 menit.',
      interviewQ: 'Q: "Jelaskan metodologi troubleshooting firewall-mu." — A: Reproduksi → batasi cakupan (pola gagal/berhasil) → debug flow (policy mana) → route → NAT → log → fix satu hal → verifikasi → dokumentasi.',
      quiz: [
        { q: 'Langkah pertama troubleshooting yang benar adalah…', options: ['Ubah policy acak', 'Reproduksi gejala dan catat persisnya', 'Restart firewall', 'Tanya forum'], answer: 1, explain: 'Tanpa reproduksi yang jelas, diagnosis = tebakan.' },
        { q: 'Output "Denied by policy 4" pada debug flow berarti…', options: ['Error sistem', 'Bukti pasti policy 4 yang menolak — investigasi fokus ke sana', 'Internet mati', 'Log penuh'], answer: 1, explain: 'Debug flow memberi jawaban eksak — tidak perlu menebak.' },
        { q: 'Prinsip "satu perubahan dalam satu waktu" bertujuan…', options: ['Agar lambat', 'Agar jelas perubahan mana yang memperbaiki (kausalitas)', 'Syarat vendor', 'Tidak ada tujuan'], answer: 1, explain: 'Banyak perubahan sekaligus = tidak tahu mana yang berpengaruh.' }
      ]
    },
    {
      id: '18.10',
      title: 'Packet Flow',
      body: `<p>Merangkum <b>packet flow FortiGate</b> lengkap — peta yang menjelaskan SEMUA skenario lab ini.</p><h3>Packet Flow Lengkap (Ingat Urutannya!)</h3><pre>Packet MASUK interface
  │
  ├─► 1. DNAT (VIP) — bila cocok VIP, tujuan diterjemahkan DULU
  │
  ├─► 2. POLICY CHECK — firewall policy (first-match, atas→bawah)
  │     DENY / no-match (implicit) → DROP + log. SELESAI.
  │
  ├─► 3. SESSION — buat/cocokkan session table (stateful)
  │
  ├─► 4. ROUTING — cari route (termasuk policy route bila ada)
  │     No route → DROP. SELESAI.
  │
  ├─► 5. SOURCE NAT — bila policy mengaktifkan NAT
  │
  ├─► 6. UTM (bila policy memakai profile: IPS/AV/web filter)
  │
  └─► 7. KELUAR via interface tujuan

Packet BALASAN: cocok session? → langsung teruskan (tanpa policy ulang)</pre><h3>Mengapa Urutan Ini Penting?</h3><p>Setiap kegagalan lab 18.1–18.9 bisa dipetakan ke satu tahap: VIP salah = tahap 1; policy salah/urutan salah = tahap 2; route hilang = tahap 4; NAT berlebih = tahap 5. <b>Hafal peta ini = troubleshooting jadi membaca peta, bukan labirin.</b></p><h3>Latihan Pemetaan</h3><div class="tblwrap"><table><tr><th>Gejala</th><th>Tahap</th><th>Perintah Cek</th></tr><tr><td>VIP tidak diterjemahkan</td><td>1 (DNAT)</td><td>debug flow — lihat pre-policy DNAT</td></tr><tr><td>Ditolak padahal "sudah allow"</td><td>2 (Policy)</td><td>debug flow — policy mana yang cocok</td></tr><tr><td>Allow tapi tidak sampai</td><td>4 (Routing)</td><td>get router info routing-table all</td></tr><tr><td>IP source aneh di log server</td><td>5 (SNAT)</td><td>cek atribut NAT pada policy</td></tr></table></div><h3>Final Verification Lab</h3><p>Untuk tiap skenario 18.1–18.8, tulis 1 kalimat: "Packet X melewati tahap … dan hasilnya …". Ini adalah <code>packet-flow.md</code> portfolio-mu.</p><div class="callout blue"><div class="t">Peta vs Kompas</div><p style="margin:4px 0 0">Debug flow adalah kompas (menunjukkan posisi saat ini); packet flow adalah peta (seluruh medan). Engineer hebat memakai keduanya.</p></div>`,
      terms: [['Packet flow', 'Urutan tahap pemrosesan packet di FortiGate: DNAT → policy → session → routing → SNAT → UTM → keluar.']],
      diagram: `<pre>           PACKET FLOW FortiGate (HAFALKAN!)

   Masuk
    |
    v
  [1. DNAT/VIP] --&gt; [2. POLICY] --DENY--&gt; DROP
    |                    |
    |                   ALLOW
    v                    v
  [3. SESSION] --&gt; [4. ROUTING] --no route--&gt; DROP
    |                    |
    v                    v
  [5. SOURCE NAT] --&gt; [6. UTM] --&gt; [7. KELUAR]

  Balasan: cocok session → langsung teruskan.</pre>`,
      scenario: 'Interview user: "Jelaskan apa yang terjadi saat user browsing via FortiGate." Kandidat yang menjawab dengan 7 tahap berurutan langsung dibedakan dari yang hanya bilang "di-firewall".',
      bestPractices: 'Cetak/diagram packet flow dan tempel di meja — rujukan harian troubleshooting.',
      security: 'UTM di tahap 6 berarti ancaman diblokir SETELAH diizinkan policy — pastikan profile UTM menempel pada policy internet.',
      challenge: 'Tanpa melihat materi, tulis 7 tahap packet flow dari ingatan. Cocokkan — ulangi hingga hafal.',
      interviewQ: 'Q: "Jelaskan packet flow FortiGate." — A: DNAT (VIP) → policy check → session → routing → source NAT → UTM → keluar; balasan dicocokkan session.',
      quiz: [
        { q: 'Tahap pertama untuk traffic masuk yang cocok VIP adalah…', options: ['Policy check', 'DNAT — tujuan diterjemahkan sebelum policy', 'Routing', 'Session'], answer: 1, explain: 'DNAT dulu agar policy mengevaluasi alamat tujuan sebenarnya.' },
        { q: 'Packet yang di-deny policy akan…', options: ['Tetap di-routing', 'Langsung drop — tidak mencapai routing', 'Di-NAT dulu', 'Masuk session'], answer: 1, explain: 'Policy di tahap 2; deny menghentikan alur sebelum routing.' },
        { q: 'Packet balasan dari server…', options: ['Dicek policy ulang penuh', 'Dicocokkan session — langsung diteruskan', 'Di-drop', 'Diabaikan'], answer: 1, explain: 'Stateful: balasan session yang diizinkan lolos tanpa evaluasi policy ulang.' }
      ]
    }
  ]
};
