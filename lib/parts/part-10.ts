// Part 10 — Spanning Tree (Fase 2: Switching & Routing).
// Materi murni: STP/RSTP/MSTP, proteksi loop, dan troubleshooting.
import type { Part } from './types';

export const part10: Part = {
  id: '10',
  number: 'PART 10',
  title: 'Spanning Tree',
  phaseId: 'fase-2',
  description: 'Mencegah loop Layer 2: bahaya broadcast storm, STP/RSTP/MSTP, root bridge, PortFast, BPDU Guard, dan troubleshooting loop.',
  repoFolder: 'part-10-spanning-tree',
  objectives: [
    'Menjelaskan mengapa loop fisik berbahaya (broadcast storm, MAC instability, duplicate frame) dan mengapa redundansi tetap dibutuhkan.',
    'Menjelaskan cara kerja STP: pemilihan root bridge, peran port (root/designated/blocking), dan BPDU.',
    'Membedakan STP, RSTP, dan MSTP serta kapan masing-masing dipakai.',
    'Mengonfigurasi prioritas root bridge, RSTP, PortFast, dan BPDU Guard di Cisco IOS.',
    'Mendiagnosis dan memperbaiki masalah spanning tree: loop, root bridge salah posisi, dan port err-disabled.',
  ],
  prerequisites: 'Part 08 (switching, flooding) dan Part 09 (VLAN, trunk) wajib tuntas — STP adalah penjaga keduanya.',
  subbabs: [
    {
      id: '10.1',
      title: 'Mengapa Loop Berbahaya?',
      body: `
<p><b>Loop</b> adalah jalur fisik berputar di jaringan Layer 2 — mis. dua kabel menghubungkan SW1–SW2, atau tiga switch membentuk segitiga. Loop <b>tidak terdeteksi</b> oleh switch (tidak ada TTL seperti di IP), sehingga satu frame bisa berputar <b>selamanya</b>.</p>
<h3>Tiga Bencana Akibat Loop</h3>
<h3>1. Broadcast Storm</h3>
<p>Satu frame broadcast masuk loop → diflooding ke semua port → kembali lagi lewat kabel kedua → diflooding lagi → <b>melipatganda tanpa henti</b>. Dalam hitungan detik, link 1 Gbps penuh oleh frame yang sama berputar-putar. Gejalanya: <b>seluruh jaringan lumpuh total</b> — bukan satu PC, tetapi semua.</p>
<pre>Timeline broadcast storm (loop SW1 ⇄ SW2):

t=0.0  1 broadcast masuk loop
t=0.1  2 copy berputar (diflood kedua arah)
t=0.5  ratusan copy — LED switch berkedip liar
t=2.0  ribuan copy/detik — link jenuh, CPU switch 100%
t=5.0  TOTAL: tidak ada traffic legitimate yang lewat</pre>
<h3>2. MAC Table Instability (MAC Flapping)</h3>
<p>Frame dari PC-A (MAC AAAA) tiba di SW1 lewat Fa0/1, lalu <i>copy yang sama</i> tiba lagi lewat Fa0/24 (jalur loop). Switch "belajar" AAAA→Fa0/1, lalu AAAA→Fa0/24, lalu kembali — <b>tabel bergetar (flapping)</b> dan forwarding menjadi kacau: frame untuk PC-A dikirim ke port yang salah bergantian.</p>
<h3>3. Duplicate Frame</h3>
<p>Perangkat tujuan menerima <b>banyak copy</b> frame unicast yang sama. Sebagian besar aplikasi tidak dirancang menerima duplikat — hasilnya error aplikasi yang misterius dan sulit dilacak.</p>
<div class="callout"><div class="t">Mengapa Tidak Cukup "Jangan Bikin Loop"?</div><p style="margin:4px 0 0"><b>Redundansi butuh loop.</b> Satu kabel putus = satu switch terisolasi. Jaringan andal memakai <b>dua jalur</b> (redundancy) — yang secara fisik ADALAH loop. Solusinya bukan menghindari kabel ganda, melainkan <b>memblokir satu jalur secara logis</b> dan membukanya otomatis saat jalur utama putus. Itulah pekerjaan Spanning Tree (10.2).</p></div>
<h3>Analogi</h3>
<p>Bayangkan bundaran tanpa rambu: mobil (frame) masuk dan berputar tanpa pernah keluar, semakin banyak mobil masuk semakin macet, sampai bundaran terkunci total. Spanning Tree adalah <b>polisi lalu lintas</b> yang menutup satu jalan masuk bundaran — mobil tetap bisa lewat jalan utama, dan jalan cadangan dibuka otomatis bila jalan utama longsor.</p>`,
      terms: [
        ['Loop (Layer 2)', 'Jalur fisik berputar antar switch; frame berputar tanpa henti karena tidak ada TTL di Ethernet.'],
        ['Broadcast storm', 'Ledakan frame broadcast/flood yang melipatganda di dalam loop hingga melumpuhkan jaringan.'],
        ['MAC flapping', 'Entry MAC table berpindah-pindah port dengan cepat akibat copy frame dari jalur loop.'],
        ['Redundansi', 'Jalur cadangan ganda agar jaringan tetap hidup saat satu jalur putus; secara fisik berupa loop yang dikelola STP.'],
      ],
      diagram: `<pre>LOOP vs REDUNDANSI TERKELOLA

 LOOP LIAR (tanpa STP):                REDUNDANSI (dengan STP):
                                        (satu jalur diblokir logis)

    SW1 ═══════ SW1                      SW1 ═══════ SW1
     ║ ║         → broadcast storm!       ║ ╲
     ║ ║                                   ║  ╲ diblokir
    SW2 ═══════ SW2                      SW2 ══╳════ SW2
   (2 kabel = loop)                     (2 kabel, 1 aktif + 1 standby)

   Kabel putus? Tanpa STP: salah satu    Kabel putus? STP membuka blokir
   switch terisolasi. Dengan STP:         otomatis dalam hitungan detik.
   jalur cadangan langsung aktif.</pre>`,
      scenario: 'Gedung kantor mati total pukul 09.00 — 200 user tidak bisa kerja. Penyebab: cleaning service menggeser switch kecil dan "merapikan" dengan mencolokkan kedua ujung satu kabel ke switch yang sama (loop satu kabel!). Tidak ada STP di switch murah itu. Solusi darurat: cabut salah satu ujung. Solusi permanen: switch managed + STP + BPDU Guard di semua port akses.',
      bestPractices: 'Jangan pernah menonaktifkan STP di jaringan production. Setiap link redundan WAJIB berada di bawah kendali STP/RSTP — tanpa kecuali.',
      security: 'Loop bisa disengaja: attacker mencolokkan dua kabel untuk DoS (broadcast storm). STP + BPDU Guard di port akses adalah pertahanan lapis pertama terhadap sabotase fisik sederhana ini.',
      challenge: 'Jelaskan dengan kata-katamu: mengapa IP punya TTL tetapi Ethernet tidak? Apa hubungannya dengan bahaya loop? (Petunjuk: Ethernet dirancang untuk satu LAN sederhana; routing IP dirancang untuk internet global.)',
      interviewQ: 'Q: "Mengapa loop di Layer 2 berbahaya padahal redundansi itu baik?" — A: Frame Ethernet tidak punya TTL, jadi loop membuat broadcast berputar dan melipatganda (broadcast storm), tabel MAC flapping, dan duplikat frame — melumpuhkan jaringan. Redundansi tetap dibutuhkan, tetapi harus dikelola: satu jalur diblokir logis oleh STP dan dibuka otomatis saat jalur utama gagal.',
      quiz: [
        {
          q: 'Mengapa satu frame broadcast bisa melumpuhkan seluruh jaringan saat ada loop?',
          options: [
            'Karena switch sengaja menggandakannya',
            'Karena frame Ethernet tidak punya TTL sehingga berputar dan melipatganda tanpa henti (broadcast storm)',
            'Karena kabelnya terlalu panjang',
            'Karena VLAN ID salah',
          ],
          answer: 1,
          explain: 'Tanpa TTL, frame loop berputar selamanya dan setiap putaran diflooding lagi — melipatganda hingga link jenuh.',
        },
        {
          q: 'Apa itu MAC flapping akibat loop?',
          options: [
            'MAC address berubah-ubah sendiri',
            'Entry MAC table berpindah-pindah port dengan cepat karena copy frame yang sama tiba dari jalur berbeda',
            'Switch menghapus MAC table berkala',
            'PC mengganti MAC address-nya',
          ],
          answer: 1,
          explain: 'Copy frame dari jalur loop membuat switch "belajar" MAC yang sama di port berbeda secara bergantian.',
        },
        {
          q: 'Jika loop berbahaya, mengapa jaringan tetap dipasang kabel redundan (ganda)?',
          options: [
            'Agar lebih cepat dua kali lipat',
            'Agar tetap hidup saat satu jalur putus — loop-nya dikelola STP dengan memblokir satu jalur secara logis',
            'Karena kabel murah',
            'Agar broadcast storm terjadi terkendali',
          ],
          answer: 1,
          explain: 'Redundansi butuh jalur ganda (= loop fisik); STP memblokir satu jalur secara logis dan membukanya otomatis saat jalur utama gagal.',
        },
      ],
    },
    {
      id: '10.2',
      title: 'STP',
      body: `
<p><b>STP</b> (<i>Spanning Tree Protocol</i>, IEEE 802.1D) adalah protokol yang <b>mencegah loop</b> dengan cara: (1) memilih satu switch sebagai <b>root bridge</b> (pusat), (2) menghitung jalur terpendek setiap switch ke root, (3) <b>memblokir port-port redundan</b> sehingga topologi aktif selalu berbentuk <b>pohon</b> (tree) — tanpa putaran.</p>
<h3>Cara Kerja dalam 4 Langkah</h3>
<ol>
<li><b>Pilih root bridge</b> — switch dengan Bridge ID terkecil (prioritas + MAC). Semua perhitungan mengacu ke root (10.3).</li>
<li><b>Tiap non-root switch pilih root port</b> — satu port dengan jalur termurah ke root (10.4).</li>
<li><b>Tiap segmen pilih designated port</b> — satu port per link yang meneruskan traffic ke segmen itu (10.5).</li>
<li><b>Port sisanya = blocking</b> — tidak meneruskan traffic user, tetapi tetap mendengarkan BPDU agar bisa aktif saat topologi berubah (10.6).</li>
</ol>
<h3>BPDU: Surat Kabar Antar Switch</h3>
<p>Switch bertukar <b>BPDU</b> (<i>Bridge Protocol Data Unit</i>) — frame multicast khusus (tujuan <code>0180.c200.0000</code>) — setiap <b>2 detik</b> (hello time). BPDU membawa: siapa pengirim, siapa yang ia anggap root, dan path cost ke root. Dari sinilah setiap switch membangun gambaran topologi yang sama.</p>
<h3>Konvergensi: Harga yang Dibayar STP Klasik</h3>
<p>Saat topologi berubah (kabel putus/dicolok), STP klasik butuh <b>30–50 detik</b> untuk konvergen (membuka blokir jalur baru dengan aman): 20 detik max age + 15 detik listening + 15 detik learning. Selama itu, jaringan terputus sebagian. Inilah alasan RSTP (10.7) lahir — tetapi pahami STP klasik dulu karena konsepnya identik.</p>
<h3>Lab Terpandu: Verifikasi STP (Cisco)</h3>
<p><b>Topology:</b> SW1 — SW2 — SW3 segitiga (tiga kabel: SW1-SW2, SW2-SW3, SW1-SW3). Semua default.</p>
<p><b>Objective:</b> identifikasi root bridge dan port yang diblokir; buktikan topologi aktif berbentuk pohon.</p>
<h3>Configuration</h3>
<p>STP <b>aktif secara default</b> di Cisco (mode PVST+). Tidak perlu menyalakan — justru verifikasi:</p>
<pre>SW1# show spanning-tree vlan 20
VLAN0020
  Spanning tree enabled protocol ieee
  Root ID    Priority    32768
             Address     aabb.cc00.1000
             This bridge is the root
  Bridge ID  Priority    32768
             Address     aabb.cc00.1000
  ...
  Interface   Role  Sts  Cost  Prio.Nbr
  Fa0/1       Desg  FWD  19
  Fa0/2       Desg  FWD  19
! ALASAN membaca output ini: "This bridge is the root" = SW1 adalah root
! (MAC-nya terkecil). Kedua port Desg/FWD = meneruskan. Tidak ada yang
! diblokir di root — wajar, root tidak punya blocking port.</pre>
<pre>SW3# show spanning-tree vlan 20
  Root ID    Priority    32768
             Address     aabb.cc00.1000   ← root = SW1 (bukan dirinya)
  Bridge ID  Priority    32768
             Address     aabb.cc00.3000
  Interface   Role  Sts  Cost
  Fa0/1       Root  FWD  19              ← root port: jalan ke root
  Fa0/2       Altn  BLK  19              ← BLOCKING: jalur redundan dimatikan
! ✔ Fa0/2 BLK = STP bekerja: segitiga dipangkas jadi pohon.
! Buktikan: ping antar semua switch tetap jalan via jalur aktif.</pre>
<h3>Failure Injection → Troubleshooting → Fix</h3>
<ul>
<li><b>Break:</b> cabut kabel SW1–SW3 (jalur langsung non-root).</li>
<li><b>Gejala:</b> 30–50 detik kemudian (STP klasik) Fa0/2 di SW3 berubah BLK → FWD; konektivitas pulih via SW2.</li>
<li><b>Troubleshoot:</b> <code>show spanning-tree vlan 20</code> → peran berubah; <code>show spanning-tree detail | include changes</code> → topology change tercatat.</li>
<li><b>Fix:</b> colok kembali kabel → STP kembali memblokir Fa0/2 (jalur redundan kembali standby).</li>
<li><b>Final verification:</b> topologi kembali seperti awal + ping stabil.</li>
</ul>`,
      terms: [
        ['STP (Spanning Tree Protocol)', 'Protokol 802.1D pencegah loop: memblokir port redundan hingga topologi aktif berbentuk pohon.'],
        ['BPDU', 'Bridge Protocol Data Unit — frame antar-switch pembawa info topologi STP, dikirim tiap 2 detik.'],
        ['Konvergensi', 'Waktu yang dibutuhkan STP menghitung ulang topologi setelah perubahan (30–50 dtk di STP klasik).'],
        ['PVST+', 'Per-VLAN Spanning Tree Plus — implementasi Cisco: satu spanning tree per VLAN.'],
      ],
      diagram: `<pre>STP MEMANGKAS SEGITIGA JADI POHON

 Fisik (segitiga = loop):          Logis aktif (pohon, tanpa loop):

     SW1 (root)                        SW1 (root)
     / \\                                / \\
    /   \\                              /   \\
  SW2---SW3                          SW2---SW3
   (3 kabel)                          ╳ Fa0/2 SW3 = BLOCKING

 BPDU tiap 2 detik menjaga kesepakatan: "siapa root, siapa blokir".</pre>`,
      scenario: 'Tiga switch kantor cabang terhubung segitiga untuk redundansi. Tanpa STP, jaringan langsung storm saat kabel ketiga dicolok. Dengan STP default Cisco, kabel ketiga otomatis standby (blocking) — engineer bahkan tidak perlu konfigurasi apa pun. STP adalah "asuransi gratis" yang sudah aktif sejak switch dinyalakan.',
      bestPractices: 'Jangan pernah matikan STP (spanning-tree vlan X) kecuali kamu 100% paham risikonya. STP default yang "tidak dikonfigurasi" jauh lebih aman daripada STP yang dimatikan.',
      security: 'BPDU bisa dipalsukan: attacker mengirim BPDU dengan prioritas 0 dan menjadi root bridge palsu → mengalihkan traffic. Mitigasi: BPDU Guard di port akses + root guard di port distribusi (Part 29).',
      challenge: 'Lab segitiga 3 switch: gambar topologi fisik vs topologi logis aktif (tandai root, root port, designated, blocking). Cabut satu kabel, catat berapa detik hingga pulih, dan jelaskan mengapa selama itu.',
      interviewQ: 'Q: "Jelaskan cara kerja STP dalam 4 langkah." — A: (1) Pilih root bridge (Bridge ID terkecil); (2) tiap switch pilih root port (jalur termurah ke root); (3) tiap segmen pilih designated port; (4) port sisanya blocking. Switch bertukar BPDU tiap 2 detik untuk menjaga kesepakatan.',
      quiz: [
        {
          q: 'Apa tujuan utama STP?',
          options: [
            'Mempercepat koneksi internet',
            'Mencegah loop dengan memblokir port redundan sehingga topologi aktif berbentuk pohon',
            'Mengenkripsi traffic antar switch',
            'Menambah jumlah VLAN',
          ],
          answer: 1,
          explain: 'STP memangkas loop fisik menjadi topologi pohon logis: satu jalur aktif, sisanya standby terblokir.',
        },
        {
          q: 'Apa itu BPDU dan seberapa sering dikirim?',
          options: [
            'Backup data switch, dikirim tiap jam',
            'Frame antar-switch berisi info topologi STP, dikirim tiap 2 detik (hello time)',
            'Password switch, dikirim saat login',
            'Update firmware otomatis',
          ],
          answer: 1,
          explain: 'BPDU (tujuan 0180.c200.0000) adalah "surat kabar" STP: siapa root, path cost, dikirim tiap 2 detik.',
        },
        {
          q: 'Berapa lama konvergensi STP klasik (802.1D) saat topologi berubah?',
          options: [
            'Kurang dari 1 detik',
            '30–50 detik (max age + listening + learning)',
            '5 menit',
            'Instan, tanpa jeda',
          ],
          answer: 1,
          explain: 'STP klasik lambat: ~20 dtk max age + 15 dtk listening + 15 dtk learning. Inilah motivasi RSTP.',
        },
      ],
    },
    {
      id: '10.3',
      title: 'Root Bridge',
      body: `
<p><b>Root bridge</b> adalah <b>satu switch</b> yang menjadi <b>pusat acuan</b> seluruh perhitungan STP: semua switch mengukur "jarak" (path cost) ke root, dan semua keputusan port didasarkan pada root ini. Analogi: root adalah "balai kota" — semua jalan diukur dari sana.</p>
<h3>Pemilihan Root: Bridge ID Terkecil Menang</h3>
<p>Setiap switch punya <b>Bridge ID</b> = <b>prioritas (2 byte) + MAC address (6 byte)</b>. Default prioritas Cisco: <b>32768</b>. Karena prioritas semua sama secara default, pemenang ditentukan oleh <b>MAC terkecil</b> — alias <b>acak</b> (tergantung MAC pabrik)!</p>
<pre>Contoh pemilihan (semua prioritas 32768):

SW1  Bridge ID = 32768.aabb.cc00.1000  ← MAC terkecil → MENANG = root
SW2  Bridge ID = 32768.aabb.cc00.2000
SW3  Bridge ID = 32768.aabb.cc00.3000

"32768." sama semua → bandingkan MAC → aabb.cc00.1000 terkecil → root.</pre>
<div class="callout"><div class="t">Bahaya Root Acak</div><p style="margin:4px 0 0">Root yang terpilih acak bisa jadi <b>switch akses tua di ujung jaringan</b> — semua traffic antar-switch dipaksa memutar lewat sana (jalur tidak optimal), dan switch lemah itu menjadi titik kritis. <b>Jangan pernah</b> biarkan pemilihan root terjadi secara acak di production.</p></div>
<h3>Menetapkan Root Secara Manual (Wajib di Production)</h3>
<p>Root ideal = <b>core/distribution switch</b>: paling tengah, paling kuat, paling andal. Dua cara Cisco:</p>
<pre>! Cara 1 — prioritas eksplisit (kelipatan 4096):
CoreSW(config)# spanning-tree vlan 20 priority 4096
! ALASAN: 4096 < 32768 → pasti menang dari semua default.
! Kelipatan 4096 karena 12 bit atas prioritas dipakai untuk VLAN ID
! (extended system ID) di PVST+.

! Cara 2 — perintah makro (lebih mudah):
CoreSW(config)# spanning-tree vlan 20 root primary
! ALASAN: otomatis set prioritas 24576 (atau lebih rendah bila perlu) —
! "jadikan saya root". Untuk cadangan: "spanning-tree vlan 20 root secondary"
! (prioritas 28672) di switch backup.

! Verifikasi:
CoreSW# show spanning-tree vlan 20 | include This|Root ID
   Root ID ... This bridge is the root
! ✔ Pastikan juga di switch lain: Root ID menunjuk MAC CoreSW.</pre>
<h3>Per-VLAN Root (PVST+)</h3>
<p>Cisco menjalankan <b>satu STP per VLAN</b> (PVST+). Artinya kamu bisa menunjuk <b>root berbeda per VLAN</b> — berguna untuk <b>load balancing</b>: VLAN 20 root di CoreSW-A, VLAN 30 root di CoreSW-B, sehingga traffic terbagi dua jalur uplink.</p>`,
      terms: [
        ['Root bridge', 'Switch pusat acuan STP; dipilih dari Bridge ID terkecil; semua path cost diukur ke sini.'],
        ['Bridge ID', 'Prioritas (default 32768) + MAC address; penentu pemilihan root.'],
        ['PVST+', 'Per-VLAN Spanning Tree Plus — Cisco menjalankan satu instance STP per VLAN.'],
      ],
      diagram: `<pre>ROOT ACAK vs ROOT DIRENCANAKAN

 Acak (MAC terkecil menang):          Direncanakan (prioritas 4096):

   [SW-akses tua] ← root?!               [CoreSW] ← root ✔ (tengah & kuat)
      / \\                                    / \\
   SW2   SW3                              SW2   SW3
   (traffic memutar jauh,                 (jalur optimal, perangkat
    switch lemah jadi kritis)              terkuat jadi pusat)</pre>`,
      scenario: 'Kantor mengeluh "akses server lambat padahal bandwidth lega". Investigasi: root bridge jatuh ke switch akses 10 tahun yang MAC-nya paling kecil — semua traffic antar-switch memutar lewat perangkat tua itu. Satu perintah spanning-tree vlan 20 root primary di core switch memangkas latency 40%.',
      bestPractices: 'Selalu tentukan root bridge secara eksplisit: primary di core/distribution utama, secondary di backup-nya. Jangan biarkan default 32768 di semua switch production.',
      security: 'Root bridge palsu (BPDU spoofing dengan prioritas 0) bisa membajak topologi. Mitigasi: BPDU Guard di port akses + root guard di port yang tidak seharusnya menjadi jalur root (Part 29).',
      challenge: 'Lab 3 switch: biarkan default, catat siapa root-nya. Lalu jadikan switch TENGAH sebagai root via perintah root primary. Bandingkan jalur traffic sebelum & sesudah — gambar keduanya.',
      interviewQ: 'Q: "Bagaimana root bridge dipilih dan mengapa harus diatur manual?" — A: Bridge ID terkecil (prioritas + MAC) menang; default semua 32768 sehingga ditentukan MAC acak. Harus diatur manual agar root jatuh di core switch yang paling tengah & kuat — bukan perangkat acak di ujung jaringan.',
      quiz: [
        {
          q: 'Bagaimana root bridge dipilih dalam STP?',
          options: [
            'Switch dengan port terbanyak',
            'Switch dengan Bridge ID terkecil (prioritas + MAC address)',
            'Switch yang paling baru dinyalakan',
            'Dipilih acak tiap jam',
          ],
          answer: 1,
          explain: 'Bridge ID = prioritas (default 32768) + MAC; terkecil menang. Default seragam → ditentukan MAC (acak).',
        },
        {
          q: 'Mengapa pemilihan root secara acak (default) berbahaya?',
          options: [
            'Tidak berbahaya sama sekali',
            'Root bisa jatuh ke switch lemah di ujung jaringan → jalur tidak optimal & titik kritis lemah',
            'Membuat VLAN terhapus',
            'Membuat switch reboot',
          ],
          answer: 1,
          explain: 'Root acak = topologi acak; traffic dipaksa memutar lewat perangkat yang mungkin paling tidak mampu.',
        },
        {
          q: 'Perintah Cisco untuk menjadikan switch sebagai root bridge VLAN 20 adalah…',
          options: [
            'spanning-tree vlan 20 disable',
            'spanning-tree vlan 20 root primary (atau priority 4096)',
            'switchport mode trunk',
            'spanning-tree portfast',
          ],
          answer: 1,
          explain: 'root primary menurunkan prioritas hingga menang; alternatif eksplisit: priority 4096 (kelipatan 4096).',
        },
      ],
    },
    {
      id: '10.4',
      title: 'Root Port',
      body: `
<p><b>Root port</b> adalah <b>satu port</b> pada setiap <b>non-root switch</b> yang memiliki <b>jalur termurah (lowest path cost) menuju root bridge</b>. Ini adalah "pintu utama" switch itu ke seluruh jaringan — semua traffic yang tidak lokal akan keluar lewat sini.</p>
<h3>Path Cost: "Ongkos" Tiap Link</h3>
<p>STP menghitung cost berdasarkan <b>kecepatan link</b> — semakin cepat, semakin murah:</p>
<div class="tblwrap"><table>
<tr><th>Kecepatan Link</th><th>STP Cost (802.1D)</th><th>RSTP Cost (802.1w)</th></tr>
<tr><td>10 Mbps</td><td>100</td><td>2.000.000</td></tr>
<tr><td>100 Mbps</td><td>19</td><td>200.000</td></tr>
<tr><td>1 Gbps</td><td>4</td><td>20.000</td></tr>
<tr><td>10 Gbps</td><td>2</td><td>2.000</td></tr>
</table></div>
<p>Total path cost sebuah port = <b>jumlah cost semua link</b> dari port itu sampai root bridge.</p>
<h3>Pemilihan Root Port: Contoh</h3>
<pre>Topologi: SW3 terhubung ke root (SW1) via dua jalan:
  Jalan A: SW3 Fa0/1 → SW1 langsung (1 Gbps) → cost = 4
  Jalan B: SW3 Fa0/2 → SW2 (1 Gbps) → SW1 (1 Gbps) → cost = 4+4 = 8

→ Fa0/1 (cost 4) MENANG = root port (forwarding)
→ Fa0/2 (cost 8) kalah = blocking (standby)

Jika cost SERI (dua jalan sama murahnya): tie-breaker =
  1. Bridge ID tetangga terkecil, 2. Port priority, 3. Nomor port terkecil.</pre>
<h3>Membaca di Output</h3>
<pre>SW3# show spanning-tree vlan 20 | include Fa0/1|Fa0/2
  Fa0/1       Root  FWD  19
  Fa0/2       Altn  BLK  19
! Kolom "Role: Root" = root port. Hanya SATU per switch non-root.
! (Cost 19 = link 100 Mbps di contoh ini.)</pre>
<div class="callout blue"><div class="t">Root Port = Satu-Satunya Jalan Pulang</div><p style="margin:4px 0 0">Setiap non-root switch punya tepat <b>satu</b> root port (kecuali root bridge sendiri — ia tidak punya root port karena ia pusatnya). Jika root port mati, STP segera mempromosikan port blocking terbaik menjadi root port baru — itulah failover otomatis.</p></div>
`,
      terms: [
        ['Root port', 'Satu port per non-root switch dengan path cost terendah ke root bridge; pintu utama keluar switch.'],
        ['Path cost', 'Total "ongkos" link dari sebuah port ke root bridge; dihitung dari kecepatan link.'],
      ],
      diagram: `<pre>PEMILIHAN ROOT PORT (SW3, root = SW1)

        SW1 (root)
        /        \\
   1 Gbps      1 Gbps + 1 Gbps
   cost 4      cost 4+4 = 8
      /            \\
   Fa0/1          Fa0/2
  (SW3)          (SW3)

  Fa0/1 cost 4  → ROOT PORT (FWD) ✔ "pintu utama"
  Fa0/2 cost 8  → Altn/BLK ✋ "pintu cadangan, dikunci"</pre>`,
      scenario: 'Dua uplink dari switch lantai ke core: satu fiber 10 Gbps, satu UTP 1 Gbps cadangan. STP otomatis memilih fiber sebagai root port (cost 2 vs 4) — tanpa konfigurasi. Saat fiber putus, UTP langsung mengambil alih. Inilah "best path otomatis" yang membuat redundansi benar-benar berguna.',
      bestPractices: 'Jangan mengubah port cost manual kecuali untuk traffic engineering yang direncanakan (mis. memaksa jalur tertentu). Cost default berbasis kecepatan sudah benar di 99% kasus.',
      security: 'Root port adalah jalur kritis: pastikan kabelnya redundan secara fisik (diverse path) agar "pintu utama" tidak single point of failure.',
      challenge: 'Lab: buat topologi di mana SW3 punya dua jalan ke root dengan cost BERBEDA. Prediksi root port-nya sebelum cek, lalu verifikasi dengan show spanning-tree. Benarkah prediksimu?',
      interviewQ: 'Q: "Apa itu root port dan bagaimana dipilih?" — A: Satu port per non-root switch dengan total path cost terendah ke root bridge (cost dihitung dari kecepatan link). Port ini menjadi pintu utama; jika mati, STP mempromosikan port standby menjadi root port baru.',
      quiz: [
        {
          q: 'Apa itu root port?',
          options: [
            'Port di root bridge',
            'Satu port per non-root switch dengan jalur termurah ke root bridge',
            'Port yang diblokir STP',
            'Port console switch',
          ],
          answer: 1,
          explain: 'Root port = pintu utama tiap non-root switch; tepat satu per switch, dipilih dari path cost terendah.',
        },
        {
          q: 'Link 1 Gbps vs 100 Mbps — mana yang dipilih sebagai root port dan mengapa?',
          options: [
            '100 Mbps, karena cost-nya 19 lebih besar',
            '1 Gbps, karena cost-nya lebih kecil (4 vs 19) — STP memilih path cost terendah',
            'Dipilih acak',
            'Keduanya menjadi root port',
          ],
          answer: 1,
          explain: 'Cost berbanding terbalik dengan kecepatan; STP selalu memilih total cost terendah.',
        },
        {
          q: 'Jika dua jalan ke root memiliki cost yang sama persis, apa tie-breaker-nya?',
          options: [
            'Dipilih acak tiap kali',
            'Bridge ID tetangga terkecil, lalu port priority, lalu nomor port terkecil',
            'Keduanya diblokir',
            'Switch reboot untuk memutuskan',
          ],
          answer: 1,
          explain: 'Urutan tie-break: Bridge ID tetangga → port priority → nomor port terendah. Deterministik, tidak acak.',
        },
      ],
    },
    {
      id: '10.5',
      title: 'Designated Port',
      body: `
<p><b>Designated port</b> adalah <b>satu port per segmen jaringan (per link)</b> yang ditugaskan <b>meneruskan traffic ke segmen itu</b>. Jika root port adalah "pintu keluar terbaik <i>dari</i> sebuah switch", designated port adalah "pintu masuk terbaik <i>ke</i> sebuah kabel".</p>
<h3>Siapa yang Menjadi Designated?</h3>
<p>Untuk setiap link, switch yang memiliki <b>path cost terkecil ke root</b> memenangkan peran designated di link itu. Praktisnya:</p>
<ul>
<li>Semua port di <b>root bridge</b> otomatis designated (cost root = 0, tak terkalahkan).</li>
<li>Di link antar dua non-root switch, yang lebih dekat ke root menjadi designated; sisi lawannya menjadi blocking (alternate).</li>
<li>Root port sebuah switch <b>tidak pernah</b> designated di link yang sama — ia sudah punya peran.</li>
</ul>
<h3>Contoh Lengkap: Tiga Peran dalam Satu Topologi</h3>
<pre>SW1 = root (prioritas 4096). Semua link 1 Gbps (cost 4).

        SW1 (root)
       //        \\
  Fa0/1 Desg    Fa0/2 Desg        ← semua port root = designated
     //            \\
  Fa0/1           Fa0/1
  Root            Root
  (SW2)           (SW3)
   Fa0/2           Fa0/2
   Desg            Altn/BLK
    \\            //
     \\-- link --//
     SW2 lebih dekat ke root dibanding jalur SW3→SW2,
     maka Fa0/2 SW2 = designated; Fa0/2 SW3 = blocking.

Ringkasan peran:
• Root bridge   : semua port = Designated (FWD)
• SW2           : Fa0/1 = Root, Fa0/2 = Designated
• SW3           : Fa0/1 = Root, Fa0/2 = Alternate Blocking</pre>
<div class="callout blue"><div class="t">Tiga Peran, Tiga Pertanyaan</div><p style="margin:4px 0 0">Untuk setiap port non-root, tanyakan berurutan: (1) "Apakah ini jalan termurahku ke root?" → ya = <b>Root port</b>. (2) "Apakah aku yang termurah ke root di kabel ini?" → ya = <b>Designated</b>. (3) Bukan keduanya → <b>Blocking</b> (alternate). Tiga pertanyaan ini menjawab seluruh output show spanning-tree.</p></div>`,
      terms: [
        ['Designated port', 'Satu port per segmen/link yang meneruskan traffic ke segmen itu; dimenangkan oleh switch dengan path cost terkecil ke root.'],
        ['Segmen', 'Satu link/kabel antar switch dalam terminologi STP.'],
      ],
      diagram: `<pre>TIGA PERAN PORT (R=root port, D=designated, B=blocking)

              SW1 (ROOT)
           D/FWD ╲   ╲ D/FWD
                  ╲   ╲
                R/FWD ╲ ╲ R/FWD
                SW2───D/FWD───╲───SW3
                     link SW2-SW3:
                     SW2 menang (lebih dekat ke root) = D
                     SW3 kalah = B (Altn/BLK) ✋

  R = jalan pulang terbaik · D = pintu ke kabel · B = cadangan dikunci</pre>`,
      scenario: 'Engineer membaca output show spanning-tree dan panik melihat "Altn BLK" — dikiranya error. Padahal itu STP yang bekerja sempurna: port cadangan sedang dikunci. Kemampuan membaca tiga peran ini mengubah "error misterius" menjadi "kondisi normal terdokumentasi".',
      bestPractices: 'Hafalkan tiga pertanyaan peran di callout biru — ia adalah kunci membaca output STP mana pun dalam 10 detik.',
      security: 'Port designated di link antar-switch adalah jalur traffic — pastikan link-link ini memakai trunk yang di-prune dan native VLAN yang aman (Part 09).',
      challenge: 'Gambar topologi 4 switch (satu root + tiga non-root dengan dua link redundan). Tentukan peran SETIAP port (R/D/B) sebelum mengecek di lab. Berapa port yang blocking?',
      interviewQ: 'Q: "Bedakan root port, designated port, dan blocking port." — A: Root port = satu per switch, jalan termurah ke root. Designated = satu per link, meneruskan traffic ke segmen itu (dimenangkan switch terdekat ke root). Blocking = sisanya; standby terkunci, aktif otomatis bila topologi berubah.',
      quiz: [
        {
          q: 'Apa itu designated port?',
          options: [
            'Port yang ditunjuk admin manual',
            'Satu port per segmen/link yang meneruskan traffic ke segmen itu, dimenangkan switch dengan path cost terkecil ke root',
            'Port cadangan yang selalu diblokir',
            'Port khusus untuk VLAN 1',
          ],
          answer: 1,
          explain: 'Designated = satu per link; pemenangnya adalah sisi yang paling murah jalurnya ke root.',
        },
        {
          q: 'Semua port pada root bridge berperan sebagai…',
          options: [
            'Root port',
            'Blocking',
            'Designated (karena cost root = 0 tak terkalahkan)',
            'Disabled',
          ],
          answer: 2,
          explain: 'Root bridge berjarak 0 dari dirinya sendiri — selalu menang sebagai designated di semua link-nya.',
        },
        {
          q: 'Dalam satu link SW2–SW3, Fa0/2 SW2 menjadi designated dan Fa0/2 SW3 blocking. Artinya…',
          options: [
            'SW2 rusak',
            'SW2 memiliki path cost lebih kecil ke root dibanding SW3 di segmen itu',
            'SW3 tidak punya STP',
            'Kabelnya putus satu arah',
          ],
          answer: 1,
          explain: 'Pemenang designated = sisi dengan path cost terkecil ke root; sisi kalah menjadi alternate blocking.',
        },
      ],
    },
    {
      id: '10.6',
      title: 'Blocking',
      body: `
<p><b>Blocking</b> adalah status port STP yang <b>tidak meneruskan traffic user</b> — tetapi <b>tetap menerima BPDU</b>. Inilah "kunci" yang mencegah loop sekaligus menjaga jalur cadangan tetap siap.</p>
<h3>Apa yang Dilakukan & Tidak Dilakukan Port Blocking</h3>
<div class="tblwrap"><table>
<tr><th>Aktivitas</th><th>Port Blocking</th><th>Alasan</th></tr>
<tr><td>Menerima BPDU</td><td>YA</td><td>Tetap memantau topologi — siap aktif saat dibutuhkan</td></tr>
<tr><td>Mengirim BPDU</td><td>Tidak (hanya menerima)</td><td>Tidak ikut kampanye, hanya mendengar</td></tr>
<tr><td>Belajar MAC (learning)</td><td>Tidak</td><td>Tabel tidak dikotori info jalur mati</td></tr>
<tr><td>Meneruskan frame user</td><td>TIDAK</td><td>Inilah yang memutus loop</td></tr>
</table></div>
<h3>Status Port STP Klasik (802.1D)</h3>
<p>Port melewati status berurutan saat berubah peran:</p>
<pre>Blocking (20 dtk max age) → Listening (15 dtk) → Learning (15 dtk) → Forwarding
     ✋ tidak kirim         dengar BPDU,        belajar MAC       ✅ aktif penuh
     frame user            belum forward       belum forward

Total transisi blocking → forwarding: ~30–50 detik (STP klasik).
RSTP (10.7) memangkasnya menjadi hitungan detik.</pre>
<h3>Mengapa Tidak Langsung Forwarding?</h3>
<p>Jeda listening/learning adalah <b>pengaman</b>: memastikan tidak ada loop sesaat saat topologi berubah dan memberi waktu semua switch sepakat tentang topologi baru. Forwarding instan tanpa kesepakatan = risiko loop temporer = broadcast storm mini.</p>
<div class="callout"><div class="t">Blocking ≠ Mati</div><p style="margin:4px 0 0">Port blocking <b>hidup dan waspada</b>: ia mendengar BPDU setiap 2 detik. Begitu BPDU berhenti (jalur utama putus), ia memulai transisi ke forwarding. Jangan cabut kabel "yang tidak dipakai" hanya karena statusnya BLK di show spanning-tree — itu jalur cadanganmu!</p></div>
`,
      terms: [
        ['Blocking', 'Status port STP yang tidak meneruskan frame user tetapi tetap menerima BPDU; memutus loop sambil siaga.'],
        ['Listening / Learning', 'Status transisi STP klasik sebelum forwarding: dengar BPDU (15 dtk), lalu belajar MAC (15 dtk).'],
      ],
      diagram: `<pre>PORT BLOCKING: dikunci tapi waspada

  Fa0/2 (Altn BLK) ──✋ frame user DITOLAK
                  ──👂 BPDU tiap 2 detik DIDENGAR

  "Saya tidak meneruskan traffic, tapi saya mendengar.
   Begitu kabar dari jalur utama berhenti → saya maju."

  ❌ JANGAN cabut kabel port BLK — itu cadanganmu!
  ❌ JANGAN anggap BLK = rusak — itu STP bekerja.</pre>`,
      scenario: 'Malam maintenance: engineer melihat satu port BLK dan "membersihkan" dengan mencabut kabelnya karena "tidak dipakai". Minggu depannya kabel utama putus — tidak ada jalur cadangan — satu gedung offline 4 jam. Sejak itu SOP: port BLK diberi label fisik "STANDBY — JANGAN CABUT".',
      bestPractices: 'Beri label fisik pada kabel redundan yang statusnya blocking. Dokumentasikan "port mana yang seharusnya BLK" agar blocking yang TIDAK terduga langsung dicurigai.',
      security: 'Port blocking tetap menerima BPDU — artinya ia tetap bisa menerima BPDU palsu. BPDU Guard (10.10) di port akses mencegah injeksi dari sisi user.',
      challenge: 'Di lab segitiga: identifikasi port BLK, lalu cabut kabel jalur UTAMA (bukan yang BLK). Catat: berapa detik hingga port BLK menjadi FWD? Ke mana traffic beralih? Gambar topologi sebelum & sesudah.',
      interviewQ: 'Q: "Apa yang dilakukan port dalam status blocking?" — A: Tidak meneruskan frame user dan tidak belajar MAC — tetapi tetap menerima BPDU untuk memantau topologi, sehingga bisa transisi ke forwarding saat jalur utama gagal.',
      quiz: [
        {
          q: 'Apa yang TIDAK dilakukan port dalam status blocking?',
          options: [
            'Menerima BPDU',
            'Meneruskan frame user',
            'Tetap up secara fisik',
            'Memonitor topologi',
          ],
          answer: 1,
          explain: 'Blocking = tidak forward frame user & tidak learning; tetapi tetap menerima BPDU agar siaga.',
        },
        {
          q: 'Mengapa transisi blocking → forwarding di STP klasik butuh 30–50 detik?',
          options: [
            'Karena switch lambat',
            'Jeda pengaman (listening + learning) agar semua switch sepakat topologi baru dan tidak terjadi loop sesaat',
            'Karena menunggu admin menekan tombol',
            'Karena BPDU hanya dikirim tiap 30 detik',
          ],
          answer: 1,
          explain: 'Jeda memastikan kesepakatan topologi; forwarding instan berisiko loop temporer → broadcast storm mini.',
        },
        {
          q: 'Seorang teknisi ingin mencabut kabel yang portnya berstatus BLK karena "tidak dipakai". Tindakan yang benar?',
          options: [
            'Cabut saja, memang tidak dipakai',
            'JANGAN dicabut — itu jalur cadangan STP yang siaga; cabut hanya jika topologi memang diubah terencana',
            'Cabut lalu colok kembali tiap hari',
            'Ganti dengan kabel lebih panjang',
          ],
          answer: 1,
          explain: 'Port BLK = redundansi aktif-siaga. Mencabutnya menghilangkan failover path.',
        },
      ],
    },
    {
      id: '10.7',
      title: 'RSTP',
      body: `
<p><b>RSTP</b> (<i>Rapid Spanning Tree Protocol</i>, IEEE 802.1w) adalah <b>pengganti STP klasik</b> yang menyelesaikan kelemahan terbesarnya: <b>konvergensi 30–50 detik</b>. RSTP konvergen dalam <b>hitungan detik</b> (umumnya &lt; 2 detik) dengan konsep yang sama tetapi mekanisme jauh lebih cerdas.</p>
<h3>Apa yang Berubah dari STP Klasik?</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>STP (802.1D)</th><th>RSTP (802.1w)</th></tr>
<tr><td>Konvergensi</td><td>30–50 detik</td><td>&lt; 2 detik (umumnya)</td></tr>
<tr><td>Status port</td><td>Blocking, Listening, Learning, Forwarding</td><td>Discarding, Learning, Forwarding (disederhanakan)</td></tr>
<tr><td>Peran port</td><td>Root, Designated, Blocking</td><td>Root, Designated, <b>Alternate</b>, <b>Backup</b></td></tr>
<tr><td>BPDU</td><td>Hanya root yang kirim; relay tiap 2 dtk</td><td><b>Semua switch</b> kirim BPDU tiap 2 dtk (hello)</td></tr>
<tr><td>Deteksi gagal</td><td>Menunggu max age 20 dtk</td><td>3x hello hilang (6 dtk) atau link-down instan</td></tr>
<tr><td>Port ke PC</td><td>Tetap 30 dtk (tanpa PortFast)</td><td><b>Edge port</b> langsung forwarding</td></tr>
</table></div>
<h3>Peran Baru: Alternate & Backup</h3>
<ul>
<li><b>Alternate port</b> = blocking port yang siaga menggantikan <b>root port</b> (jalur cadangan ke root). Ini yang tadinya disebut "Altn BLK".</li>
<li><b>Backup port</b> = blocking port yang siaga menggantikan <b>designated port</b> (mis. ada hub di segmen itu).</li>
<li>Keduanya sudah <b>dihitung sebelumnya</b> — saat gagal, promosi nyaris instan tanpa komputasi ulang penuh.</li>
</ul>
<h3>Konfigurasi (Cisco)</h3>
<pre>SW(config)# spanning-tree mode rapid-pvst
! ALASAN: aktifkan RSTP per-VLAN (Rapid PVST+). HARUS sama di SEMUA switch
! satu jaringan — campuran STP & RSTP membuat perilaku tak terprediksi.
! Tidak ada "nomor ajaib" lain: konsep root/prioritas/cost tetap sama
! seperti STP klasik (10.3–10.6).

SW# show spanning-tree vlan 20 | include Protocol
 Spanning tree enabled protocol rstp
! ✔ Verifikasi mode aktif. Output peran port kini menampilkan
! "Altn" dan "Back" sebagai peran resmi, bukan sekadar status.</pre>
<div class="callout blue"><div class="t">Standar Modern</div><p style="margin:4px 0 0">Untuk jaringan baru, <b>selalu pilih RSTP (rapid-pvst)</b> — tidak ada alasan memakai STP klasik 802.1D lagi. MSTP (10.8) adalah langkah berikutnya bila butuh load balancing per-VLAN di skala besar.</p></div>`,
      terms: [
        ['RSTP (Rapid STP)', '802.1w — STP dengan konvergensi hitungan detik via peran alternate/backup dan handshake proposal-agreement.'],
        ['Alternate port', 'Port blocking siaga pengganti root port; promosi nyaris instan.'],
        ['Backup port', 'Port blocking siaga pengganti designated port.'],
        ['Edge port', 'Port RSTP ke end device (setara PortFast): langsung forwarding.'],
      ],
      diagram: `<pre>STP KLASIK vs RSTP — kecepatan konvergensi

 STP  (802.1D):  link putus ──▶ tunggu 20 dtk ──▶ 15 dtk ──▶ 15 dtk ──▶ up
                               (max age)      (listening) (learning)   = 30–50 dtk ✋

 RSTP (802.1w):  link putus ──▶ deteksi instan ──▶ alternate langsung FWD
                                                    = < 2 detik ✔

 "Alternate sudah dihitung SEBELUM gagal — tinggal promosi."</pre>`,
      scenario: 'Rumah sakit: failover 40 detik STP klasik berarti alat medis berbasis jaringan terputus tiap ada gangguan link — tidak dapat diterima. Migrasi ke rapid-pvst memangkasnya di bawah 2 detik; downtime menjadi tak terasa. Di lingkungan kritis, perbedaan ini adalah nyawa.',
      bestPractices: 'Standarkan spanning-tree mode rapid-pvst di seluruh switch baru. Saat migrasi dari STP klasik, ubah SEMUA switch dalam satu maintenance window — mode campuran berisiko.',
      security: 'RSTP tetap memakai BPDU — ancaman BPDU spoofing tetap ada. BPDU Guard + root guard tetap wajib (10.10, Part 29).',
      challenge: 'Lab: ukur konvergensi STP klasik vs RSTP (cabut kabel yang sama, hitung detik hingga ping pulih). Catat angkanya — ini bukti empiris untuk laporan "mengapa migrasi ke RSTP".',
      interviewQ: 'Q: "Apa beda STP dan RSTP?" — A: RSTP (802.1w) adalah STP yang konvergen dalam hitungan detik (vs 30–50 detik): status port disederhanakan, semua switch mengirim BPDU hello, ada peran alternate/backup yang pre-hitung, dan deteksi gagal via 3x hello hilang atau link-down instan.',
      quiz: [
        {
          q: 'Keunggulan utama RSTP dibanding STP klasik adalah…',
          options: [
            'Mendukung lebih banyak VLAN',
            'Konvergensi hitungan detik (< 2 dtk) dibanding 30–50 detik',
            'Tidak butuh root bridge',
            'Bisa routing antar VLAN',
          ],
          answer: 1,
          explain: 'RSTP lahir untuk memangkas konvergensi: alternate/backup pre-hitung + deteksi gagal cepat.',
        },
        {
          q: 'Apa itu alternate port di RSTP?',
          options: [
            'Port cadangan yang mati total',
            'Port blocking yang siaga menggantikan root port dengan promosi nyaris instan',
            'Port untuk kabel cadangan fisik',
            'Port console alternatif',
          ],
          answer: 1,
          explain: 'Alternate = peran resmi RSTP untuk standby root port; sudah dihitung sebelum kegagalan terjadi.',
        },
        {
          q: 'Perintah Cisco untuk mengaktifkan RSTP per-VLAN adalah…',
          options: [
            'spanning-tree mode rapid-pvst (harus sama di semua switch)',
            'spanning-tree disable',
            'rapid spanning-tree on',
            'spanning-tree vlan 1 priority 0',
          ],
          answer: 0,
          explain: 'rapid-pvst = RSTP per-VLAN Cisco. Wajib seragam di semua switch; campuran mode berisiko.',
        },
      ],
    },
    {
      id: '10.8',
      title: 'MSTP',
      body: `
<p><b>MSTP</b> (<i>Multiple Spanning Tree Protocol</i>, IEEE 802.1s) menjawab dua keterbatasan PVST+/RSTP: <b>skala</b> dan <b>load balancing</b>. PVST+ menjalankan <b>satu instance STP per VLAN</b> — dengan 100 VLAN berarti 100 komputasi & 100 set BPDU. MSTP mengelompokkan banyak VLAN ke dalam <b>sedikit instance</b>.</p>
<h3>Masalah yang Diselesaikan</h3>
<ul>
<li><b>Overhead CPU:</b> 100 VLAN = 100 spanning tree di PVST+. MSTP: 100 VLAN dalam 2–3 instance = jauh lebih ringan.</li>
<li><b>Load balancing elegan:</b> instance 1 root di CoreSW-A (untuk VLAN 10,20), instance 2 root di CoreSW-B (untuk VLAN 30,40) — traffic terbagi dua uplink <b>tanpa</b> konfigurasi per-VLAN satu per satu.</li>
<li><b>Interoperabilitas:</b> MSTP adalah standar IEEE — satu region MSTP bisa bertetangga dengan switch non-Cisco.</li>
</ul>
<h3>Konsep: Region & Instance</h3>
<ul>
<li><b>Region</b> = sekelompok switch dengan konfigurasi MST <b>identik</b> (nama region, revision, pemetaan VLAN→instance). Satu karakter beda = region berbeda = dianggap "switch asing".</li>
<li><b>Instance</b> = satu spanning tree yang melayani sekelompok VLAN. Instance 0 (IST) selalu ada — menampung VLAN yang tidak dipetakan.</li>
</ul>
<h3>Konfigurasi Dasar (Cisco)</h3>
<pre>SW(config)# spanning-tree mode mst
SW(config)# spanning-tree mst configuration
SW(config-mst)# name KANTOR-PUSAT
! ALASAN: nama region — HARUS sama persis (case-sensitive) di semua
! switch satu region. Beda satu huruf = region terpisah!

SW(config-mst)# revision 1
! ALASAN: nomor revisi — juga harus sama. Naikkan tiap ubah pemetaan.

SW(config-mst)# instance 1 vlan 10,20
SW(config-mst)# instance 2 vlan 30,40
! ALASAN: petakan VLAN ke instance. VLAN 99 tak dipetakan → ikut instance 0.
! → Ulangi BLOK INI persis sama di semua switch region.

SW(config)# spanning-tree mst 1 root primary
SW(config)# spanning-tree mst 2 root secondary
! ALASAN: di CoreSW-A: root untuk instance 1, backup untuk instance 2.
! Di CoreSW-B sebaliknya → load balancing antar instance.</pre>
<div class="callout"><div class="t">Kapan Memakai MSTP?</div><p style="margin:4px 0 0">Jaringan <b>besar</b> (puluhan VLAN, banyak switch) yang butuh load balancing uplink. Untuk jaringan kecil–menengah, <b>rapid-pvst sudah cukup</b> — MSTP menambah kompleksitas yang belum perlu. Prinsip: pakai yang paling sederhana yang memenuhi kebutuhan.</p></div>`,
      terms: [
        ['MSTP', '802.1s — STP dengan banyak VLAN dipetakan ke sedikit instance; hemat CPU + load balancing.'],
        ['Region', 'Kelompok switch MSTP dengan nama, revision, dan pemetaan VLAN→instance yang identik.'],
        ['Instance', 'Satu spanning tree dalam MSTP yang melayani sekelompok VLAN.'],
        ['IST (Internal Spanning Tree)', 'Instance 0 — default untuk VLAN yang tidak dipetakan.'],
      ],
      diagram: `<pre>MSTP: 100 VLAN → 2 INSTANCE (ringan + load balancing)

 PVST+:  VLAN 10 ──tree──┐
        VLAN 20 ──tree──┼── 100 komputasi STP (berat!)
        ...             │
        VLAN 99 ──tree──┘

 MSTP region "KANTOR-PUSAT":
        Instance 1 (VLAN 10,20): root = CoreSW-A ──▶ traffic via uplink A
        Instance 2 (VLAN 30,40): root = CoreSW-B ──▶ traffic via uplink B
        Instance 0 (VLAN 99, sisa): root = CoreSW-A
        = 3 komputasi + load balancing otomatis ✔</pre>`,
      scenario: 'Enterprise 60 VLAN, 25 switch: PVST+ membuat CPU switch akses lama menjerit (60 instance). Migrasi ke MSTP 3 instance menurunkan CPU 70% sekaligus memberi load balancing dua uplink core — satu desain, dua masalah selesai.',
      bestPractices: 'Rencanakan pemetaan VLAN→instance SEBELUM konfigurasi dan dokumentasikan. Satu region = satu tim yang mengelola; jangan campur switch yang dikelola tim berbeda dalam satu region.',
      security: 'Perubahan konfigurasi MST (nama/revision/pemetaan) memicu rekonvergensi region — lakukan di maintenance window dan pastikan semua switch sudah dikonfigurasi sebelum yang pertama diaktifkan.',
      challenge: 'Rancang pemetaan MSTP untuk desain 5 VLAN kita: VLAN mana masuk instance 1 vs 2? Di switch mana root primary/secondary tiap instance? Jelaskan alasan load balancing-nya.',
      interviewQ: 'Q: "Kapan memakai MSTP dibanding rapid-pvst?" — A: Saat skala besar (puluhan VLAN/switch): MSTP memetakan banyak VLAN ke sedikit instance sehingga hemat CPU, plus memberi load balancing per-instance via root berbeda. Untuk jaringan kecil, rapid-pvst lebih sederhana dan cukup.',
      quiz: [
        {
          q: 'Masalah apa yang diselesaikan MSTP dibanding PVST+?',
          options: [
            'Kecepatan kabel yang lambat',
            'Overhead CPU dari satu instance STP per VLAN — MSTP memetakan banyak VLAN ke sedikit instance',
            'Kekurangan port switch',
            'Tidak bisa trunking',
          ],
          answer: 1,
          explain: 'PVST+ = N VLAN berarti N spanning tree; MSTP mengelompokkannya ke sedikit instance yang ringan.',
        },
        {
          q: 'Apa syarat switch-switch berada dalam satu MSTP region yang sama?',
          options: [
            'Merk switch harus sama',
            'Nama region, revision number, dan pemetaan VLAN→instance harus identik',
            'IP address harus berurutan',
            'Jumlah port harus sama',
          ],
          answer: 1,
          explain: 'Satu karakter beda pada nama/revision/pemetaan = region berbeda = dianggap switch asing.',
        },
        {
          q: 'Bagaimana MSTP memberikan load balancing?',
          options: [
            'Otomatis tanpa konfigurasi',
            'Root bridge berbeda per instance (mis. instance 1 root di Core-A, instance 2 di Core-B) sehingga traffic terbagi',
            'Dengan menambah kabel tiap VLAN',
            'MSTP tidak bisa load balancing',
          ],
          answer: 1,
          explain: 'Tiap instance punya root sendiri; VLAN di instance berbeda memakai jalur aktif berbeda → traffic terbagi.',
        },
      ],
    },
    {
      id: '10.9',
      title: 'PortFast',
      body: `
<p><b>PortFast</b> adalah fitur yang membuat port akses ke <b>end device</b> langsung <b>forwarding</b> — melewati status listening/learning 30 detik. Tanpa PortFast, setiap kabel PC yang dicolok butuh ~30 detik sebelum bisa dipakai (DHCP sering timeout duluan!).</p>
<h3>Mengapa Port ke PC Butuh Pengecualian?</h3>
<p>Port ke end device <b>tidak mungkin</b> menyebabkan loop (PC bukan switch — ia tidak meneruskan BPDU/frame). Menunggu 30 detik STP di port seperti ini hanya membuang waktu. PortFast berkata: "port ini ujung jaringan — langsung jalan".</p>
<h3>Konfigurasi (Cisco)</h3>
<pre>! Per port akses:
SW(config-if)# spanning-tree portfast
! ALASAN: port Fa0/5 hanya ke PC → aman langsung forwarding.
! Waktu colok→bisa dipakai: ~2 detik (vs ~30 detik).

! Atau global untuk SEMUA port access (disarankan):
SW(config)# spanning-tree portfast default
! ALASAN: otomatis PortFast di semua port non-trunk. Praktis untuk
! ratusan port akses — tetapi WAJIB dipasangkan dengan BPDU Guard (10.10)
! sebagai pengaman bila ternyata ada switch dicolok ke port itu.

! Verifikasi:
SW# show spanning-tree interface fa0/5 portfast
VLAN0020             enabled
! Atau: show spanning-tree summary | include PortFast</pre>
<div class="callout"><div class="t">Bahaya: PortFast di Port yang Salah</div><p style="margin:4px 0 0">PortFast di <b>port antar-switch</b> = loop temporer 30 detik+ setiap perubahan topologi (tanpa jeda pengaman!). Aturan keras: <b>PortFast HANYA untuk port end device</b> (PC, printer, AP, kamera). Port ke switch lain: JANGAN.</p></div>
<h3>PortFast + DHCP</h3>
<p>Masalah klasik tanpa PortFast: PC dinyalakan → kirim DHCP discover → port masih listening → discover hilang → PC menyerah dengan APIPA (169.254.x.x). Dengan PortFast, port langsung forwarding → DHCP berhasil. Jika user komplain "tiap pagi harus repair connection", cek PortFast sebelum menyalahkan DHCP server.</p>`,
      terms: [
        ['PortFast', 'Fitur STP: port akses ke end device langsung forwarding tanpa jeda 30 detik.'],
      ],
      diagram: `<pre>PORTFAST — colok langsung jalan

 Tanpa PortFast:   colok kabel ──▶ listening 15 dtk ──▶ learning 15 dtk ──▶ jalan
                                 (DHCP sering timeout di sini! → APIPA)

 Dengan PortFast:  colok kabel ──▶ langsung FORWARDING (~2 dtk) ✔

 ⚠️ HANYA untuk port END DEVICE (PC/printer/AP/kamera)
 ⛔ JANGAN di port antar-switch (loop temporer!)</pre>`,
      scenario: 'Kantor 300 PC: tiap pagi puluhan user komplain "tidak dapat IP, harus restart". DHCP server sehat. Akar masalah: PortFast tidak aktif — port butuh 30 detik sementara PC menyerah dalam 10 detik. Satu perintah global spanning-tree portfast default menyelesaikan 90% tiket pagi itu.',
      bestPractices: 'Aktifkan PortFast di semua port akses end device (lebih baik global + BPDU Guard), dan pastikan tidak ada satu pun port trunk/uplink yang terkena PortFast.',
      security: 'PortFast tanpa BPDU Guard berbahaya: switch liar yang dicolok ke port PortFast bisa langsung forwarding dan membuat loop. Keduanya adalah pasangan wajib (10.10).',
      challenge: 'Ukur di lab: waktu dari colok kabel hingga ping pertama berhasil — dengan dan tanpa PortFast. Catat selisihnya dan jelaskan dampaknya pada DHCP.',
      interviewQ: 'Q: "Apa itu PortFast dan kapan boleh dipakai?" — A: Fitur yang membuat port langsung forwarding tanpa jeda STP 30 detik. Hanya untuk port end device (PC/printer/AP) yang tidak mungkin menyebabkan loop — dipasangkan wajib dengan BPDU Guard; dilarang di port antar-switch.',
      quiz: [
        {
          q: 'Apa fungsi PortFast?',
          options: [
            'Mempercepat kabel menjadi 10 Gbps',
            'Membuat port akses ke end device langsung forwarding tanpa menunggu 30 detik status STP',
            'Menonaktifkan STP sepenuhnya',
            'Mempercepat DHCP server',
          ],
          answer: 1,
          explain: 'PortFast melewati listening/learning untuk port yang pasti ujung (end device) — colok langsung jalan.',
        },
        {
          q: 'Mengapa PortFast DILARANG di port antar-switch?',
          options: [
            'Karena membuat switch panas',
            'Karena menghilangkan jeda pengaman STP sehingga perubahan topologi bisa menimbulkan loop temporer',
            'Karena port antar-switch tidak mendukungnya',
            'Tidak ada larangan sebenarnya',
          ],
          answer: 1,
          explain: 'Jeda listening/learning adalah pengaman loop; PortFast di trunk/uplink menghapus pengaman itu.',
        },
        {
          q: 'User tiap pagi dapat IP APIPA (169.254.x.x) padahal DHCP server sehat. Kemungkinan penyebab di sisi switch?',
          options: [
            'VLAN ID terlalu besar',
            'PortFast tidak aktif — port butuh 30 detik sementara PC menyerah meminta DHCP lebih cepat',
            'Kabel terlalu pendek',
            'Switch perlu diganti',
          ],
          answer: 1,
          explain: 'Tanpa PortFast, DHCP discover awal hilang saat port masih listening → PC fallback ke APIPA.',
        },
      ],
    },
    {
      id: '10.10',
      title: 'BPDU Guard',
      body: `
<p><b>BPDU Guard</b> adalah pengaman yang <b>mematikan otomatis (err-disable)</b> port PortFast/edge <b>begitu menerima BPDU</b>. Logikanya: port ke PC <i>tidak seharusnya</i> menerima BPDU — BPDU hanya datang dari switch. Jika ada BPDU, berarti ada <b>switch liar</b> (atau loop) di port itu → matikan sebelum merusak topologi.</p>
<h3>Pasangan Wajib: PortFast + BPDU Guard</h3>
<ul>
<li><b>PortFast</b> = kecepatan (langsung forwarding).</li>
<li><b>BPDU Guard</b> = keamanan (matikan port bila ada BPDU).</li>
<li>Tanpa Guard, PortFast adalah pintu loop yang terbuka lebar.</li>
</ul>
<h3>Konfigurasi (Cisco)</h3>
<pre>! Per port:
SW(config-if)# spanning-tree bpduguard enable
! ALASAN: jika port ini menerima BPDU → err-disable OTOMATIS.
! Efektif hanya bermakna di port PortFast/edge (port end device).

! Atau global (disarankan — melindungi semua port PortFast):
SW(config)# spanning-tree portfast bpduguard default
! ALASAN: satu perintah melindungi ratusan port akses sekaligus.
! Konsisten dengan "spanning-tree portfast default" (10.9).

! Melihat & memulihkan port yang kena guard:
SW# show interfaces status err-disabled
Port      Name  Status       Reason
Fa0/8           err-disabled bpduguard
! ✔ Port Fa0/8 menerima BPDU → dimatikan. Cari tahu DULU apa yang
! dicolok di sana (switch liar? kabel loop?) SEBELUM menyalakan ulang!

SW(config)# interface fa0/8
SW(config-if)# shutdown
SW(config-if)# no shutdown
! ALASAN: pemulihan manual setelah penyebab dihilangkan. (Ada juga
! errdisable recovery otomatis ber-timer — aktifkan hanya bila SOP
! mengizinkan; di port user, manual lebih aman.)</pre>
<div class="callout"><div class="t">Jangan Asal "no shutdown"</div><p style="margin:4px 0 0">Port err-disabled karena bpduguard adalah <b>alarm keamanan</b>, bukan sekadar error. Menyalakannya ulang tanpa melepas switch liar/loop = membuka kembali lubang dalam hitungan detik. Prosedur: temukan perangkat asing → amankan → baru pulihkan port → catat di tiket.</p></div>`,
      terms: [
        ['BPDU Guard', 'Fitur yang me-err-disable port PortFast/edge begitu menerima BPDU; mencegah switch liar & loop dari sisi user.'],
        ['err-disable', 'Status port yang dimatikan otomatis oleh fitur proteksi; butuh investigasi + shutdown/no shutdown untuk pulih.'],
      ],
      diagram: `<pre>BPDU GUARD — satpam port akses

 [PC] ──Fa0/5 (PortFast + BPDU Guard)── [SWITCH]
            │
   normal: tidak ada BPDU → forwarding ✔

 [Switch liar] ──colok──▶ Fa0/8 ──▶ "ada BPDU?!" ──▶ ERR-DISABLE ✋
                                                    port MATI,
                                              alarm untuk engineer

 Prosedur: cabut perangkat asing → shutdown/no shutdown → catat tiket.</pre>`,
      scenario: 'Ruang meeting: peserta mencolok switch mini 5 port "agar semua dapat kabel", lalu iseng mencolok dua kabel ke tembok (loop!). Tanpa BPDU Guard: broadcast storm satu VLAN. Dengan BPDU Guard: port err-disable dalam 1 detik, hanya ruang meeting itu yang mati — NOC menerima alarm dan menelepon panitia. Insiden 5 menit vs outage gedung.',
      bestPractices: 'Aktifkan spanning-tree portfast bpduguard default secara global di semua switch akses. Jadikan "cek port err-disabled" sebagai bagian patroli NOC harian.',
      security: 'BPDU Guard adalah pertahanan termurah terhadap switch liar, loop tak sengaja, dan percobaan BPDU spoofing dari sisi user. Tidak ada alasan menonaktifkannya di port akses.',
      challenge: 'Lab (HATI-HATI): colok switch kecil ke port PortFast+BPDU Guard. Amati: berapa detik hingga err-disabled? Apa output show-nya? Pulihkan dengan prosedur benar dan tulis laporannya.',
      interviewQ: 'Q: "Jelaskan hubungan PortFast dan BPDU Guard." — A: PortFast membuat port akses langsung forwarding (cepat) — tetapi berbahaya bila ada switch/loop di port itu. BPDU Guard menutup celah itu: begitu port menerima BPDU (tanda ada switch), port di-err-disable otomatis. Keduanya pasangan wajib di port end device.',
      quiz: [
        {
          q: 'Apa yang dilakukan BPDU Guard saat port PortFast menerima BPDU?',
          options: [
            'Mengabaikannya',
            'Me-err-disable port secara otomatis (mematikan port)',
            'Mengubah port menjadi trunk',
            'Me-reboot switch',
          ],
          answer: 1,
          explain: 'BPDU di port end device = anomali (switch liar/loop) → port dimatikan otomatis sebagai pengaman.',
        },
        {
          q: 'Port err-disabled karena bpduguard. Tindakan yang benar SEBELUM menyalakan ulang?',
          options: [
            'Langsung no shutdown agar cepat',
            'Investigasi dulu: temukan dan amankan perangkat/loop asing di port itu, baru pulihkan + catat di tiket',
            'Ganti switch',
            'Biarkan mati selamanya',
          ],
          answer: 1,
          explain: 'err-disable adalah alarm keamanan; menyalakan ulang tanpa menghilangkan penyebab = membuka lubang kembali.',
        },
        {
          q: 'Perintah global yang disarankan untuk melindungi semua port akses adalah…',
          options: [
            'spanning-tree portfast bpduguard default',
            'no spanning-tree vlan 1',
            'spanning-tree mode rapid-pvst',
            'shutdown all ports',
          ],
          answer: 0,
          explain: 'Kombinasi global ini memberi PortFast ke semua port non-trunk SEKALIGUS BPDU Guard — standar hardening port akses.',
        },
      ],
    },
    {
      id: '10.11',
      title: 'Loop Troubleshooting',
      body: `
<p>Loop adalah insiden <b>paling darurat</b> di LAN: gejalanya dramatis (jaringan lumpuh total dalam detik) tetapi diagnosisnya berpola. Kunci: <b>tenang, isolasi cepat, lalu cari sumbernya</b>.</p>
<h3>Gejala Klasik Loop/Broadcast Storm</h3>
<ul>
<li>Seluruh (atau sebagian besar) jaringan <b>lumpuh mendadak</b> — bukan satu PC.</li>
<li>LED semua port switch <b>berkedip liar serentak</b>.</li>
<li>CPU switch <b>100%</b>, console lambat/tidak respons.</li>
<li><code>show interfaces</code>: counter <b>broadcast melonjak</b> ekstrem; input rate mendekati kapasitas link.</li>
<li>Log: <b>MAC flapping</b> (<code>%SW_MATM-4-MACFLAP_NOTIF</code>) antar dua port.</li>
</ul>
<h3>Respons Darurat (5 Menit Pertama)</h3>
<ol>
<li><b>Identifikasi switch sumber:</b> cari switch dengan CPU 100% / LED liar — biasanya 1–2 switch pusat badai.</li>
<li><b>Putus loop:</b> cabut <b>satu per satu</b> kabel uplink yang dicurigai (atau shutdown port via console bila masih responsif) hingga badai berhenti. Catat kabel mana yang dicabut!</li>
<li><b>Stabilkan:</b> pastikan STP aktif & konvergen (<code>show spanning-tree</code> — tidak ada port yang flapping peran).</li>
<li><b>Cari akar:</b> kabel apa yang menyebabkan loop? (kabel ganda tak terdokumentasi? switch mini user? konfigurasi STP dimatikan?)</li>
<li><b>Perbaiki permanen:</b> rapikan kabel, aktifkan STP/RSTP, pasang BPDU Guard di port akses, dokumentasikan.</li>
</ol>
<h3>Command Investigasi</h3>
<pre>! Jejak MAC flapping (tanda kuat loop):
SW# show mac address-table notification mac-move
! → MAC yang "berpindah-pindah" antar port = frame datang dari dua arah.

! Lihat badai broadcast:
SW# show interfaces fa0/24 | include broadcast|rate
! → broadcast storm: input rate ~ kapasitas link, didominasi broadcast.

! Cek peran STP tidak stabil:
SW# show spanning-tree vlan 20 | include BLK|FWD
! → semua port seharusnya stabil; peran yang berubah-ubah = topologi goyang.

! Setelah reda — pastikan proteksi aktif:
SW# show spanning-tree summary | include PortFast|BPDU
SW# show interfaces status err-disabled</pre>
<h3>Deliberate Failure (Lab Terkontrol!)</h3>
<div class="callout"><div class="t">PERINGATAN LAB</div><p style="margin:4px 0 0">Latihan ini <b>HANYA</b> di lab terisolasi (GNS3/EVE-NG atau switch lab tanpa user). <b>JANGAN PERNAH</b> di production — broadcast storm nyata bisa melumpuhkan jaringan kantor dalam detik dan berpotensi merusak reputasimu.</p></div>
<ol>
<li><b>Topology:</b> 2 switch, 1 kabel (normal). Aktifkan monitoring: ping kontinu + <code>show interfaces</code> counter.</li>
<li><b>Objective:</b> amati gejala storm dan latih respons darurat.</li>
<li><b>Break:</b> nonaktifkan STP sesaat (<code>no spanning-tree vlan 10</code>) lalu colok kabel kedua. <i>Atau</i> di GNS3: hubungkan dua link tanpa STP.</li>
<li><b>Amati:</b> ping RTO massal, CPU naik, LED liar — catat gejalanya (inilah yang harus kamu kenali).</li>
<li><b>Fix:</b> cabut kabel kedua → badai berhenti → aktifkan kembali STP + verifikasi.</li>
<li><b>Final verification:</b> ping pulih, CPU normal, <code>show spanning-tree</code> stabil. Tulis laporan insiden 1 halaman.</li>
</ol>`,
      terms: [
        ['Broadcast storm (insiden)', 'Kondisi darurat: frame berputar di loop hingga melumpuhkan jaringan; responsnya isolasi cepat.'],
        ['MAC move notification', 'Log perpindahan MAC antar port — indikator kuat loop/duplikat.'],
      ],
      diagram: `<pre>RESPONS DARURAT LOOP (hafalkan urutannya)

  GEJALA: lumpuh massal + LED liar + CPU 100% + MAC flapping
     │
     ▼
  [1] TEMUKAN switch pusat badai (CPU/LED/counter)
     │
     ▼
  [2] PUTUS loop: cabut/shutdown SATU kabel uplink tersangka
      → badai berhenti? YA → lanjut; TIDAK → kabel berikutnya
     │
     ▼
  [3] STABILKAN: pastikan STP aktif & konvergen
     │
     ▼
  [4] CARI AKAR: kabel apa? siapa mencolok? STP mati di mana?
     │
     ▼
  [5] PERMANEN: rapikan + RSTP + BPDU Guard + dokumentasi + tutup tiket</pre>`,
      scenario: 'NOC pukul 10.00: "internet mati total". Engineer junior me-restart router — tidak mempan (bukan masalah router!). Engineer senior melihat LED switch liar + log MAC flapping → langsung ke langkah 2: mencabut kabel uplink lantai 2 → jaringan pulih dalam 3 menit. Akar: vendor AC mencolok switch mini dengan dua kabel. Total downtime 12 menit vs berjam-jam bila salah diagnosis.',
      bestPractices: 'Latih respons loop di lab SEBELUM insiden nyata. Buat runbook 5 langkah di atas dan tempel di NOC — saat storm terjadi, tidak ada waktu untuk berpikir dari nol.',
      security: 'Loop bisa menjadi serangan DoS fisik oleh orang dalam. BPDU Guard + port-security + audit kabel berkala adalah pertahanan berlapisnya.',
      challenge: 'Tulis runbook 1 halaman "Respons Broadcast Storm" untuk NOC kantormu: gejala, 5 langkah, perintah tiap langkah, dan kriteria "insiden selesai". Minta temanmu mengkritiknya.',
      interviewQ: 'Q: "Seluruh jaringan lumpuh mendadak, LED switch berkedip liar. Apa langkahmu?" — A: Curigai loop/broadcast storm: (1) temukan switch pusat badai via CPU/LED/counter; (2) putus loop dengan mencabut/men-shutdown satu kabel uplink tersangka hingga reda; (3) pastikan STP konvergen; (4) cari akar (kabel ganda/switch liar/STP mati); (5) perbaiki permanen (RSTP + BPDU Guard + dokumentasi).',
      quiz: [
        {
          q: 'Tiga gejala klasik broadcast storm adalah…',
          options: [
            'Satu PC lambat, printer error, Wi-Fi lemah',
            'Jaringan lumpuh massal mendadak + LED berkedip liar + CPU switch 100% / MAC flapping di log',
            'VLAN terhapus, password berubah, kabel putus',
            'Hanya internet lambat di jam sibuk',
          ],
          answer: 1,
          explain: 'Storm = gejala massal & dramatis: lumpuh serentak, LED liar, CPU penuh, MAC flapping — bukan masalah satu perangkat.',
        },
        {
          q: 'Langkah PERTAMA yang benar saat broadcast storm terjadi?',
          options: [
            'Restart semua switch sekaligus',
            'Identifikasi switch pusat badai lalu putus loop (cabut/shutdown satu kabel tersangka) hingga reda',
            'Ganti semua kabel',
            'Hubungi ISP',
          ],
          answer: 1,
          explain: 'Prioritas = hentikan badai dulu (isolasi), baru investigasi akar. Restart massal justru memperpanjang outage.',
        },
        {
          q: 'Log %SW_MATM-4-MACFLAP_NOTIF menunjukkan…',
          options: [
            'Switch kekurangan memori',
            'MAC address berpindah-pindah antar port dengan cepat — indikator kuat loop atau duplikat',
            'VLAN berhasil dibuat',
            'PortFast aktif',
          ],
          answer: 1,
          explain: 'MAC flapping = frame dari MAC yang sama tiba dari dua arah bergantian; tanda klasik loop Layer 2.',
        },
      ],
    },
  ],
};
