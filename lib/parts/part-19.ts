// Part 19 — Fase D: Enterprise Network Architecture
// Referensi silang ke part sebelumnya; skema VLAN/IP konsisten dengan Part 01.
import type { Part } from './types';

export const part19: Part = {
  id: '19',
  number: 'PART 19',
  title: 'Enterprise Network Architecture',
  phaseId: 'fase-4',
  description:
    'Menyatukan semua part sebelumnya menjadi satu blueprint jaringan enterprise: hierarki core–distribution–access, server, management, CCTV, office, guest, dan internet edge.',
  repoFolder: 'part-19-enterprise-architecture',
  objectives: [
    'Menjelaskan model hierarki 3 layer (core, distribution, access) dan peran masing-masing layer.',
    'Merancang enterprise network lengkap dengan 5 VLAN sesuai skema desain (10 CCTV, 20 OFFICE, 30 SERVER, 40 GUEST, 99 MANAGEMENT).',
    'Membedakan desain server network, management network, dan user network (office, guest, CCTV).',
    'Merancang internet edge: ISP redundancy, firewall placement, dan DMZ.',
  ],
  prerequisites:
    'Part 01 (fundamental), Part 04 (subnetting — skema 192.168.x.0/24), Part 08–10 (VLAN, trunk, inter-VLAN routing), Part 13 (MikroTik) & Part 15–17 (FortiGate) untuk firewall placement.',
  subbabs: [
    {
      id: '19.1',
      title: 'Enterprise Network Design',
      body: `
<p><b>Enterprise network</b> (jaringan perusahaan) adalah jaringan berskala besar yang melayani ratusan hingga ribuan perangkat: PC kantor, server, CCTV, telepon IP, Wi-Fi guest — semuanya dalam satu desain terpadu.</p>
<p>Setelah Part 01–18 kamu belajar <i>bagian-bagian</i> (VLAN, routing, firewall, fiber). Part 19 menyatukan semuanya menjadi <b>blueprint</b> — cetak biru desain yang menjadi rumah bagi semua konsep itu. Analogi: part-part sebelumnya adalah belajar batu bata, semen, dan kabel; Part 19 adalah membaca denah rumah.</p>
<h3>Model Hierarki 3 Layer</h3>
<p>Desain enterprise memakai <b>hierarchical network design</b> (desain berlapis) agar jaringan <b>scalable</b> (mudah diperbesar), <b>resilient</b> (tahan kegagalan), dan mudah di-<b>troubleshoot</b>:</p>
<div class="tblwrap"><table>
<tr><th>Layer</th><th>Peran</th><th>Contoh perangkat</th><th>Dipelajari mendalam di</th></tr>
<tr><td><b>Core</b></td><td>Transport cepat antar blok gedung; tidak ada policy rumit di sini — kecepatan prioritas</td><td>Core switch/route L3 berkecepatan tinggi</td><td>19.2</td></tr>
<tr><td><b>Distribution</b></td><td>Agregasi, policy enforcement (ACL, inter-VLAN routing), titik failover</td><td>L3 switch, firewall internal</td><td>19.3</td></tr>
<tr><td><b>Access</b></td><td>Tempat user & perangkat tersambung; VLAN assignment, port security</td><td>L2 switch, access point</td><td>19.4</td></tr>
</table></div>
<h3>Mengapa Dibutuhkan?</h3>
<p>Jaringan <i>flat</i> (semua perangkat satu switch raksasa) hanya bekerja untuk puluhan perangkat. Saat tumbuh ke ratusan perangkat:</p>
<ul>
<li><b>Broadcast storm</b> — satu broadcast domain raksasa membanjiri semua perangkat (aturan emas: <b>1 VLAN = 1 subnet = 1 broadcast domain</b>, dipecah di sini).</li>
<li><b>Keamanan</b> — CCTV bisa diakses tamu; server keuangan bisa dijangkau semua user.</li>
<li><b>Troubleshooting gelap</b> — tanpa layer jelas, mencari sumber gangguan seperti mencari jarum di tumpukan jerami.</li>
</ul>
<h3>Hubungan dengan OSI</h3>
<p>Access layer bekerja di <b>Layer 2</b> (switching, VLAN — Part 08). Distribution bekerja di <b>Layer 3</b> (inter-VLAN routing — Part 10). Core bekerja di <b>Layer 1–3</b> dengan fokus throughput (fiber — Part 21). Firewall di edge bekerja sampai <b>Layer 7</b> (application inspection — Part 15–17).</p>
<h3>Packet Flow End-to-End</h3>
<pre>PC Office (VLAN 20) akses Server (VLAN 30):
[PC] → Access L2 (tag VLAN 20) → Distribution (routing: VLAN20→VLAN30)
     → Access server switch → [Server]
PC Office (VLAN 20) akses Internet:
[PC] → Access → Distribution → Core → Firewall (edge) → ISP → Internet
Setiap panah bisa dicek satu per satu — itulah gunanya desain berlapis.</pre>
<div class="callout blue"><div class="t">Blueprint Lab Ini</div><p style="margin:4px 0 0">Skema desain tetap konsisten dengan Part 01: VLAN 10 CCTV (192.168.10.0/24), VLAN 20 OFFICE (192.168.20.0/24), VLAN 30 SERVER (192.168.30.0/24), VLAN 40 GUEST (192.168.40.0/24), VLAN 99 MANAGEMENT (192.168.99.0/24). Aturan emas: 1 VLAN = 1 subnet = 1 broadcast domain.</p></div>`,
      terms: [
        ['Enterprise network', 'Jaringan perusahaan berskala besar yang melayani banyak tipe perangkat dan user dalam satu desain terpadu.'],
        ['Hierarchical design', 'Desain berlapis (core–distribution–access) agar jaringan scalable, resilient, dan mudah di-troubleshoot.'],
        ['Scalable', 'Mudah diperbesar tanpa mendesain ulang dari nol.'],
        ['Resilient', 'Tetap berfungsi walau sebagian perangkat/link rusak (ada jalur cadangan).'],
        ['Broadcast storm', 'Banjir frame broadcast yang melumpuhkan jaringan karena broadcast domain terlalu besar.'],
        ['Blueprint', 'Cetak biru desain jaringan yang menjadi acuan pembangunan.'],
      ],
      diagram: `<pre>        ARSITEKTUR ENTERPRISE 3 LAYER

                    [  Internet  ]
                         |
                    [ Firewall ]  ← Internet Edge (19.10)
                         |
            ┌──────── [  CORE  ] ────────┐      ← Layer transport cepat (19.2)
            |              |            |
     [Distribution] [Distribution] [Distribution]  ← Policy & routing (19.3)
         |               |               |
   [Access SW]      [Access SW]      [Access SW]     ← User tersambung (19.4)
    VLAN 20           VLAN 10          VLAN 40
    OFFICE            CCTV             GUEST

[Server Farm VLAN 30] — di belakang Distribution (19.5)
[Management VLAN 99] — menjangkau semua device (19.6)</pre>`,
      scenario:
        'Sebuah perusahaan dengan 3 gedung dan 400 karyawan tumbuh dari jaringan flat satu switch. Broadcast dari satu lantai membuat seluruh kantor lemot, dan kamera CCTV bisa diakses siapa saja dari Wi-Fi tamu. Solusinya bukan beli perangkat lebih mahal — melainkan mendesain ulang dengan hierarki 3 layer dan segmentasi VLAN seperti di part ini.',
      bestPractices:
        'Selalu mulai dari blueprint sebelum membeli perangkat. Desain yang salah di kertas akan menjadi masalah mahal di lapangan — memindahkan kabel dan IP jauh lebih mahal daripada menghapus garis di diagram.',
      security:
        'Segmentasi adalah keamanan termurah: pisahkan CCTV, guest, office, server, dan management ke VLAN berbeda sejak hari pertama. Nanti menambalnya jauh lebih sulit.',
      challenge:
        'Gambar di kertas: kantor 2 lantai, 100 PC, 20 kamera, 2 server, Wi-Fi tamu. Tentukan jumlah switch per layer dan VLAN apa di access switch mana. Bandingkan dengan diagram part ini.',
      interviewQ:
        'Q: "Jelaskan model 3-layer hierarchical design dan kapan boleh disederhanakan menjadi 2 layer (collapsed core)?" — A: Core untuk transport cepat, distribution untuk policy & routing, access untuk koneksi user. Untuk jaringan kecil (di bawah ~100 user), core dan distribution bisa digabung (collapsed core) karena traffic belum butuh backbone terpisah — hemat biaya tanpa mengorbankan konsep.',
      quiz: [
        {
          q: 'Apa fungsi utama core layer dalam desain hierarki 3 layer?',
          options: [
            'Menetapkan VLAN untuk tiap port user',
            'Transport cepat antar blok/distribution tanpa policy rumit',
            'Memfilter konten web user',
            'Menyediakan alamat IP via DHCP',
          ],
          answer: 1,
          explain: 'Core layer fokus pada kecepatan transport antar distribution block; policy dan filtering ditempatkan di distribution dan edge agar core tetap cepat dan sederhana.',
        },
        {
          q: 'Mengapa jaringan flat tidak cocok untuk ratusan perangkat?',
          options: [
            'Kabelnya terlalu mahal',
            'Satu broadcast domain raksasa rawan broadcast storm dan sulit diamankan',
            'Switch tidak mendukung ratusan port',
            'IP address tidak cukup',
          ],
          answer: 1,
          explain: 'Masalah utama jaringan flat adalah broadcast domain tunggal yang terlalu besar (broadcast storm) dan tidak adanya segmentasi keamanan — diselesaikan dengan VLAN per fungsi.',
        },
        {
          q: 'Aturan emas segmentasi di lab ini adalah…',
          options: [
            '1 VLAN = 1 switch fisik',
            '1 VLAN = 1 subnet = 1 broadcast domain',
            'Semua VLAN boleh berbagi satu subnet',
            'VLAN hanya untuk Wi-Fi',
          ],
          answer: 1,
          explain: 'Setiap VLAN dipetakan ke tepat satu subnet IP dan satu broadcast domain — inilah fondasi seluruh desain Part 19–22.',
        },
      ],
    },
    {
      id: '19.2',
      title: 'Core Layer',
      body: `
<p><b>Core layer</b> (lapisan inti) adalah <b>backbone</b> (tulang punggung) jaringan: jalur super-cepat yang menghubungkan distribution switch antar gedung/lantai. Prinsipnya: <i>core harus cepat dan sederhana</i>.</p>
<h3>Pengertian Teknis</h3>
<p>Core switch biasanya berupa <b>Layer 3 switch</b> kelas atas atau router dengan port <b>10G/40G/100G</b> (fiber, Part 21). Ia tidak melakukan filtering berat, tidak menjalankan DHCP, tidak menjadi default gateway user — semua itu tugas distribution. Core hanya meneruskan paket secepat mungkin.</p>
<h3>Mengapa Dibutuhkan?</h3>
<ul>
<li><b>Agregasi traffic</b> — traffic dari semua gedung bertemu di sini; tanpa core cepat, backbone menjadi bottleneck.</li>
<li><b>Redundansi</b> — core selalu dipasang berpasangan (dual core) dengan link ganda agar satu kegagalan tidak mematikan seluruh site.</li>
<li><b>Isolasi perubahan</b> — perubahan di access (tambah VLAN user) tidak perlu menyentuh core.</li>
</ul>
<h3>Packet Flow</h3>
<pre>User Gedung A → Server Gedung B:
Access(A) → Dist(A) → CORE → Dist(B) → Access(B) → Server
Core hanya melihat: "paket dari 192.168.20.0/24 ke 192.168.30.0/24,
teruskan ke Dist(B)" — tanpa cek policy.</pre>
<h3>Collapsed Core (Kapan Boleh Disederhanakan?)</h3>
<p>Untuk site kecil (&lt;100 user, 1–2 gedung), core dan distribution <b>digabung</b> menjadi satu pasang L3 switch — disebut <b>collapsed core</b>. Hemat biaya, konsep tetap sama: port user di access, routing & policy di collapsed core. Lab kita di Part 20 memakai pola ini.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, "core" bisa hanya satu virtual switch. Di production, core WAJIB redundant (dua perangkat, dua power supply, dua uplink) karena kegagalan core = seluruh site down. Jangan pernah single point of failure di core production.</p></div>`,
      terms: [
        ['Core layer', 'Lapisan backbone berkecepatan tinggi yang menghubungkan distribution layer; fokus pada kecepatan, bukan policy.'],
        ['Backbone', 'Tulang punggung jaringan — jalur utama tempat traffic antar segmen mengalir.'],
        ['Collapsed core', 'Desain 2 layer: core dan distribution digabung untuk site kecil.'],
        ['Bottleneck', 'Titik tersempit yang membatasi kecepatan seluruh aliran.'],
        ['Single point of failure', 'Satu komponen yang jika rusak melumpuhkan seluruh sistem.'],
      ],
      diagram: `<pre>         DUAL CORE (REDUNDANT)

        [ Dist A ]   [ Dist B ]   [ Dist C ]
            \\  //       \\//        \\  //
             \\//         \\/          \\//
          [ Core-1 ] ═══ [ Core-2 ]      ← link antar core
              |             |
         (fiber 10G/40G, dual link ke tiap distribution)

Aturan: tiap distribution punya 2 uplink (satu ke tiap core).
Satu core mati → traffic lewat core satunya. Tanpa downtime.</pre>`,
      scenario:
        'Data center sebuah bank memakai dual core 100G. Saat maintenance firmware Core-1, seluruh traffic otomatis lewat Core-2 — nasabah tidak merasakan apa-apa. Inilah alasan core selalu redundant di production.',
      bestPractices:
        'Jaga core tetap "bersih": jangan pasang ACL kompleks, DHCP, atau user gateway di core. Semakin sederhana core, semakin cepat dan stabil ia.',
      security:
        'Core switch hanya boleh diakses dari VLAN 99 MANAGEMENT dengan SSH key (Part 22.4). Jangan expose management interface core ke VLAN user manapun.',
      challenge:
        'Hitung: 3 gedung, tiap gedung 200 user, rata-rata 2 Mbps per user di jam sibuk dengan oversubscription 4:1. Berapa kapasitas uplink minimum tiap distribution ke core?',
      interviewQ:
        'Q: "Apa bedanya core layer dengan distribution layer?" — A: Core fokus transport cepat antar distribution block tanpa policy; distribution melakukan agregasi, inter-VLAN routing, dan policy enforcement (ACL/QoS). Analogi: core adalah jalan tol, distribution adalah gerbang tol + persimpangan.',
      quiz: [
        {
          q: 'Prinsip utama desain core layer adalah…',
          options: [
            'Memasang sebanyak mungkin fitur keamanan di core',
            'Core harus cepat dan sederhana, tanpa policy rumit',
            'Menjadikan core sebagai DHCP server',
            'Menghubungkan user langsung ke core',
          ],
          answer: 1,
          explain: 'Core adalah backbone: tugasnya meneruskan paket secepat mungkin. Policy, DHCP, dan gateway user ditempatkan di distribution/edge.',
        },
        {
          q: 'Mengapa core di production selalu redundant (dual)?',
          options: [
            'Agar terlihat canggih',
            'Kegagalan core melumpuhkan seluruh site — single point of failure tidak boleh ada',
            'Untuk menambah jumlah port user',
            'Karena vendor mewajibkan',
          ],
          answer: 1,
          explain: 'Semua traffic antar gedung lewat core; satu core yang mati tanpa cadangan berarti seluruh site down.',
        },
        {
          q: 'Kapan desain collapsed core boleh dipakai?',
          options: [
            'Selalu — core terpisah tidak pernah dibutuhkan',
            'Site kecil (<100 user, 1–2 gedung) untuk hemat biaya',
            'Hanya di data center besar',
            'Tidak pernah boleh',
          ],
          answer: 1,
          explain: 'Collapsed core menggabung core+distribution untuk site kecil. Site besar tetap butuh core terpisah agar backbone tidak menjadi bottleneck.',
        },
      ],
    },
    {
      id: '19.3',
      title: 'Distribution Layer',
      body: `
<p><b>Distribution layer</b> (lapisan distribusi) adalah "otak" jaringan enterprise: di sinilah <b>inter-VLAN routing</b> terjadi, <b>policy</b> ditegakkan, dan <b>agregasi</b> uplink dari access switch dikumpulkan.</p>
<h3>Pengertian Teknis</h3>
<p>Distribution biasanya berupa <b>Layer 3 switch</b> (atau router) yang menjadi <b>default gateway</b> tiap VLAN. Ingat skema kita: gateway tiap subnet lazimnya IP <b>.1</b> — misalnya 192.168.20.1 untuk VLAN 20 OFFICE, 192.168.30.1 untuk VLAN 30 SERVER.</p>
<h3>Tugas Distribution</h3>
<ul>
<li><b>Inter-VLAN routing</b> — meneruskan paket antar VLAN (Part 10, dipraktikkan di 20.10).</li>
<li><b>Policy enforcement</b> — ACL/firewall rules: siapa boleh ke mana (misal GUEST tidak boleh ke SERVER — 20.11).</li>
<li><b>Agregasi</b> — puluhan access switch uplink ke sini; titik ideal untuk monitoring traffic.</li>
<li><b>First-hop redundancy</b> — dua distribution switch berbagi peran gateway agar gateway tidak single point of failure (VRRP/HSRP — disinggung di Part 29).</li>
</ul>
<h3>Packet Flow: Inter-VLAN</h3>
<pre>PC 192.168.20.50 (VLAN 20) → Server 192.168.30.10 (VLAN 30):
1. PC kirim ke gateway-nya: 192.168.20.1 (di distribution)
2. Distribution cek routing table: 192.168.30.0/24 via VLAN 30
3. Distribution cek policy: VLAN 20 → VLAN 30 DIIZINKAN?
4. Ya → teruskan ke access switch server. Tidak → drop + log.</pre>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Distribution adalah batas antara Layer 2 (VLAN, switching di bawahnya) dan Layer 3 (routing di level ini ke atas). Keputusan "boleh/tidak" (policy) terjadi di Layer 3–4 (IP + port TCP/UDP).</p></div>`,
      terms: [
        ['Distribution layer', 'Lapisan agregasi dan policy: inter-VLAN routing, ACL, dan titik failover.'],
        ['Default gateway', 'IP router yang dituju host saat destinasi di luar subnet-nya (lazimnya .1).'],
        ['Policy enforcement', 'Penegakan aturan siapa-boleh-ke-mana di titik strategis jaringan.'],
        ['ACL', 'Access Control List — daftar aturan izinkan/tolak traffic berdasarkan IP/port.'],
        ['First-hop redundancy', 'Dua gateway berbagi satu IP virtual agar gateway tidak single point of failure (VRRP/HSRP).'],
      ],
      diagram: `<pre>        DISTRIBUTION SEBAGAI OTAK

   [Access VLAN20] ──┐
                     ├─▶ [ Distribution L3 ] ── routing + ACL ──▶ [Core]
   [Access VLAN10] ──┘         |  |  |  |  |
                          .1  .1  .1  .1  .1   ← gateway tiap VLAN:
                      VLAN10 VLAN20 VLAN30 VLAN40 VLAN99
                      .10.1  .20.1  .30.1  .40.1  .99.1

Semua "keputusan" terjadi di sini. Access hanya meneruskan.</pre>`,
      scenario:
        'Kantor menerapkan aturan: Wi-Fi tamu (VLAN 40) boleh internet tapi tidak boleh menyentuh server (VLAN 30) maupun printer kantor. Aturan ini ditulis sekali di distribution — bukan di tiap access switch. Satu titik kontrol, berlaku untuk seluruh site.',
      bestPractices:
        'Tempatkan policy sedekat mungkin dengan sumber traffic tapi tetap terpusat: distribution adalah titik ideal. Dokumentasikan setiap ACL dengan alasan bisnisnya.',
      security:
        'Distribution adalah garis pertahanan antar segmen internal. Prinsip least privilege: default-deny antar VLAN, buka hanya yang dibutuhkan (misal OFFICE → SERVER port 443 saja).',
      challenge:
        'Tulis 3 aturan ACL untuk distribution: (1) GUEST→SERVER deny all, (2) OFFICE→SERVER allow TCP 443, (3) semua VLAN→MANAGEMENT deny kecuali IP admin. Tentukan urutannya dan jelaskan mengapa urutan penting.',
      interviewQ:
        'Q: "Di layer mana inter-VLAN routing dilakukan dan mengapa tidak di access?" — A: Di distribution (Layer 3). Access switch umumnya Layer 2 murni; menaruh routing di distribution membuat policy terpusat, mudah diaudit, dan access tetap murah/sederhana.',
      quiz: [
        {
          q: 'Fungsi utama distribution layer adalah…',
          options: [
            'Menghubungkan PC user ke jaringan',
            'Agregasi, inter-VLAN routing, dan policy enforcement',
            'Menyediakan koneksi ke ISP',
            'Menyimpan file perusahaan',
          ],
          answer: 1,
          explain: 'Distribution adalah "otak": routing antar VLAN, ACL/policy, dan agregasi uplink access — PC user tersambung di access layer.',
        },
        {
          q: 'Berapa IP yang lazim dipakai sebagai default gateway tiap VLAN di desain ini?',
          options: [
            'IP .254 tiap subnet',
            'IP .1 tiap subnet (mis. 192.168.20.1 untuk VLAN 20)',
            'IP .100 tiap subnet',
            'IP acak tiap subnet',
          ],
          answer: 1,
          explain: 'Konvensi umum: alamat pertama yang usable (.1) menjadi gateway. Konsisten di semua VLAN memudahkan dokumentasi dan troubleshooting.',
        },
        {
          q: 'Mengapa policy (ACL) ditempatkan di distribution, bukan di tiap access switch?',
          options: [
            'Karena access switch tidak punya port cukup',
            'Satu titik kontrol terpusat: mudah dikelola, diaudit, dan konsisten untuk seluruh site',
            'Karena lebih murah',
            'Tidak ada alasan khusus',
          ],
          answer: 1,
          explain: 'Policy terpusat di distribution berarti satu perubahan berlaku site-wide, mudah diaudit, dan access switch tetap sederhana/murah.',
        },
      ],
    },
    {
      id: '19.4',
      title: 'Access Layer',
      body: `
<p><b>Access layer</b> (lapisan akses) adalah tempat <b>perangkat user tersambung secara fisik</b>: PC, laptop, printer, kamera CCTV, access point. Ini layer yang paling dekat dengan user — dan paling sering disentuh teknisi lapangan.</p>
<h3>Pengertian Teknis</h3>
<p>Access switch umumnya <b>Layer 2</b> (Part 08): meneruskan frame berdasarkan MAC address dan <b>memberi VLAN tag</b> pada port. Dua tipe port (dipraktikkan di 20.8–20.9):</p>
<div class="tblwrap"><table>
<tr><th>Tipe Port</th><th>Fungsi</th><th>Contoh</th></tr>
<tr><td><b>Access port</b></td><td>Satu VLAN untagged ke satu perangkat endpoint</td><td>PC → VLAN 20, kamera → VLAN 10</td></tr>
<tr><td><b>Trunk port</b></td><td>Membawa banyak VLAN bertag ke switch/AP lain</td><td>Uplink ke distribution; ke access point multi-SSID</td></tr>
</table></div>
<h3>Fitur Keamanan Access</h3>
<ul>
<li><b>Port security</b> — batasi jumlah MAC address per port agar orang tidak colok switch liar (rogue device).</li>
<li><b>DHCP snooping</b> — cegah rogue DHCP server (laptop iseng yang bikin satu lantai dapat IP ngawur).</li>
<li><b>802.1X</b> — autentikasi perangkat sebelum diberi akses (dibahas di Part 31).</li>
<li><b>Unused port shutdown</b> — port kosong dimatikan agar tidak bisa dicolok diam-diam.</li>
</ul>
<h3>Mengapa Dibutuhkan?</h3>
<p>Mayoritas gangguan user berawal di access: kabel longgar, port salah VLAN, PoE mati. Desain access yang rapi (label kabel, port map, VLAN konsisten) membuat troubleshooting lantai menjadi hitungan menit, bukan jam.</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab GNS3, access switch adalah virtual. Di production, access switch tersebar di <b>wiring closet</b> tiap lantai — dan 80% tiket NOC ("PC tidak dapat IP", "printer offline") diselesaikan di layer ini. Kuasai access = kuasai harian NOC.</p></div>`,
      terms: [
        ['Access layer', 'Lapisan tempat endpoint tersambung; VLAN assignment dan port security.'],
        ['Access port', 'Port switch untuk satu VLAN (untagged) ke satu endpoint.'],
        ['Trunk port', 'Port yang membawa banyak VLAN bertag antar switch.'],
        ['Port security', 'Pembatasan MAC address per port untuk mencegah perangkat liar.'],
        ['DHCP snooping', 'Fitur switch yang memblokir DHCP server tidak resmi.'],
        ['Wiring closet', 'Ruang kecil tiap lantai berisi access switch dan patch panel.'],
      ],
      diagram: `<pre>         ACCESS LAYER DI SATU LANTAI

[Dist] ══trunk══ [Access-SW Lantai 2]
                      |-- access VLAN 20 → PC-01 … PC-40
                      |-- access VLAN 20 → Printer
                      |-- access VLAN 10 → Kamera-01 … 04
                      |-- trunk → AP (SSID Office=VLAN20, Guest=VLAN40)
                      |-- (port kosong: shutdown)

Aturan: tiap port dilabel — "L2-P05: VLAN20-PC-Finance-03".</pre>`,
      scenario:
        'Teknisi menerima tiket "PC finance tidak dapat IP". Karena port map rapi, ia langsung tahu PC itu di Lantai 2 port 5 VLAN 20. Ternyata port diset VLAN 40 oleh teknisi shift sebelumnya — 5 menit selesai. Tanpa dokumentasi port, ini bisa jadi 2 jam.',
      bestPractices:
        'Label setiap kabel dan port (lantai-port-VLAN-perangkat). Matikan port yang tidak dipakai. Standarkan: port ganjil untuk user, genap untuk device khusus — konsistensi mengalahkan kreativitas di access layer.',
      security:
        'Access adalah pintu masuk fisik. Port security + DHCP snooping + shutdown port kosong adalah tiga kunci murah yang menutup 90% serangan via colok-kabel.',
      challenge:
        'Buat port map untuk satu access switch 24 port: 16 PC (VLAN 20), 2 printer (VLAN 20), 4 kamera (VLAN 10), 1 AP (trunk), 1 uplink (trunk). Tentukan nomor port tiap fungsi dan alasannya.',
      interviewQ:
        'Q: "Apa bedanya access port dan trunk port?" — A: Access port membawa satu VLAN untagged ke satu endpoint (PC, printer, kamera); trunk port membawa banyak VLAN bertag antar switch atau ke AP multi-SSID. Salah menaruh trunk di port user bisa membocorkan semua VLAN.',
      quiz: [
        {
          q: 'Perangkat apa yang tersambung di access layer?',
          options: [
            'Router ISP',
            'PC, printer, kamera CCTV, access point (endpoint user)',
            'Core switch',
            'Server database utama',
          ],
          answer: 1,
          explain: 'Access layer adalah titik koneksi fisik endpoint: PC, printer, kamera, AP. Core/distribution dan server farm ada di layer lain.',
        },
        {
          q: 'Kapan memakai trunk port di access switch?',
          options: [
            'Untuk menghubungkan PC biasa',
            'Untuk uplink ke distribution dan ke AP multi-SSID (membawa banyak VLAN)',
            'Tidak pernah dipakai di access',
            'Untuk menghubungkan printer',
          ],
          answer: 1,
          explain: 'Trunk membawa banyak VLAN bertag — dipakai untuk uplink antar switch dan ke AP yang melayani beberapa SSID/VLAN.',
        },
        {
          q: 'Mengapa port kosong di access switch sebaiknya di-shutdown?',
          options: [
            'Menghemat listrik dalam jumlah besar',
            'Mencegah orang tak berwenang mencolok perangkat diam-diam',
            'Agar switch lebih dingin',
            'Tidak ada alasan teknis',
          ],
          answer: 1,
          explain: 'Port aktif yang kosong adalah pintu masuk gratis — shutdown menutupnya sampai teknisi resmi mengaktifkannya dengan VLAN yang benar.',
        },
      ],
    },
    {
      id: '19.5',
      title: 'Server Network',
      body: `
<p><b>Server network</b> (VLAN 30, 192.168.30.0/24) adalah segmen khusus untuk <b>server</b>: file server, aplikasi ERP, database, CCTV NVR, dan server monitoring. Server diperlakukan istimewa karena ia adalah "harta karun" perusahaan.</p>
<h3>Mengapa Server Dipisahkan?</h3>
<ul>
<li><b>Keamanan</b> — akses ke server dibatasi ketat (hanya port layanan yang dibutuhkan, mis. TCP 443). Satu VLAN tersendiri membuat aturan firewall sederhana: "VLAN 30 hanya boleh diakses via port X".</li>
<li><b>Stabilitas IP</b> — server memakai <b>IP statis</b> (bukan DHCP) agar tidak berubah-ubah; DNS internal menunjuk ke IP ini (Part 22.2).</li>
<li><b>Monitoring prioritas</b> — server adalah objek monitoring paling kritis (Part 23–27).</li>
</ul>
<h3>Desain Server Farm</h3>
<p>Server ditaruh di <b>server farm</b>: rak khusus (atau ruang server) dengan switch tersendiri yang uplink langsung ke distribution/core — <b>bukan</b> lewat access switch user. Alasannya: traffic server besar dan tidak boleh terganggu masalah di lantai user.</p>
<h3>IP Addressing Server (Contoh Konsisten)</h3>
<div class="tblwrap"><table>
<tr><th>Perangkat</th><th>IP</th><th>Catatan</th></tr>
<tr><td>Gateway VLAN 30</td><td>192.168.30.1</td><td>Di distribution/core L3</td></tr>
<tr><td>File server</td><td>192.168.30.10</td><td>Statis, didokumentasikan</td></tr>
<tr><td>NVR CCTV</td><td>192.168.30.11</td><td>Rekaman kamera VLAN 10</td></tr>
<tr><td>Zabbix server</td><td>192.168.30.20</td><td>Monitoring (Part 23)</td></tr>
<tr><td>DHCP/DNS server</td><td>192.168.30.21</td><td>Layanan network (Part 22)</td></tr>
</table></div>
<h3>Packet Flow Khas</h3>
<pre>User akses aplikasi: PC (VLAN 20) → Dist (routing + ACL: allow TCP 443)
                       → Server switch → 192.168.30.10
Kamera kirim rekaman: Kamera (VLAN 10) → Dist (allow ke NVR saja)
                       → 192.168.30.11 (NVR)</pre>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Akses server difilter di Layer 3 (IP sumber/tujuan) dan Layer 4 (port TCP/UDP). Server sendiri berkomunikasi sampai Layer 7 (HTTP, SMB, database protocol) — firewall edge bisa inspeksi sampai sana.</p></div>`,
      terms: [
        ['Server farm', 'Kumpulan server di rak/ruang khusus dengan switch tersendiri, uplink langsung ke distribution/core.'],
        ['IP statis', 'Alamat IP yang dikonfigurasi manual dan tidak berubah — wajib untuk server.'],
        ['NVR', 'Network Video Recorder — server perekam kamera CCTV.'],
        ['Least privilege', 'Prinsip: beri akses minimum yang dibutuhkan, tidak lebih.'],
      ],
      diagram: `<pre>           SERVER FARM (VLAN 30)

                  [ Distribution ]
                        | trunk
                  [ Server Switch ]
                   /      |      \\
        [File Srv]   [NVR]   [Zabbix]   [DHCP/DNS]
        .30.10      .30.11    .30.20      .30.21

Semua IP statis. Akses dari luar VLAN 30 lewat ACL di distribution.
Server TIDAK lewat access switch user.</pre>`,
      scenario:
        'Ransomware masuk lewat PC user (VLAN 20) dan mencoba menyebar ke file server. Karena VLAN 30 hanya membuka port SMB dari IP tertentu dan user biasa tidak punya akses, penyebaran terhenti di distribution. Segmentasi server membeli waktu untuk respons insiden.',
      bestPractices:
        'Semua server: IP statis + entri DNS + dokumentasi (nama, fungsi, owner, port yang dibuka). Jangan biarkan "server misterius" — setiap IP di VLAN 30 harus bisa dijelaskan.',
      security:
        'VLAN server adalah zona paling dilindungi setelah management. Terapkan default-deny: hanya buka port layanan yang dibutuhkan, dari sumber yang jelas. Patch server terjadwal — server yang tidak di-patch adalah target empuk.',
      challenge:
        'Rancang daftar akses VLAN 30: siapa (VLAN sumber) boleh akses port apa di server mana? Buat tabel 5 baris dan tentukan mana yang default-deny.',
      interviewQ:
        'Q: "Mengapa server tidak ditaruh di VLAN yang sama dengan user?" — A: Tiga alasan: keamanan (akses server harus dibatasi ketat), stabilitas (IP statis, traffic server tidak boleh terganggu masalah user), dan operasional (monitoring & backup terpusat). Satu VLAN = satu kebijakan.',
      quiz: [
        {
          q: 'Mengapa server memakai IP statis, bukan DHCP?',
          options: [
            'Agar lebih cepat',
            'Server harus selalu di alamat yang sama agar DNS, firewall rule, dan monitoring tidak rusak',
            'DHCP tidak mendukung server',
            'Supaya hemat IP',
          ],
          answer: 1,
          explain: 'Semua referensi ke server (DNS, ACL, monitoring) menunjuk ke IP-nya; IP yang berubah-ubah akan merusak semuanya.',
        },
        {
          q: 'Di mana seharusnya switch server farm dihubungkan?',
          options: [
            'Ke access switch lantai user terdekat',
            'Langsung ke distribution/core, terpisah dari switch user',
            'Ke port PC yang kosong',
            'Ke Wi-Fi',
          ],
          answer: 1,
          explain: 'Traffic server besar dan kritis — ia butuh jalur sendiri ke distribution/core agar tidak terganggu masalah di access layer user.',
        },
        {
          q: 'Prinsip akses ke VLAN server yang benar adalah…',
          options: [
            'Semua VLAN boleh akses semua port server',
            'Default-deny: hanya buka port layanan yang dibutuhkan dari sumber yang jelas',
            'Server boleh diakses dari Wi-Fi tamu',
            'Tidak perlu firewall antar VLAN',
          ],
          answer: 1,
          explain: 'Least privilege: tutup semua, buka hanya yang perlu (mis. TCP 443 dari VLAN 20). Ini yang membuat ransomware sulit menyebar ke server.',
        },
      ],
    },
    {
      id: '19.6',
      title: 'Management Network',
      body: `
<p><b>Management network</b> (VLAN 99, 192.168.99.0/24) adalah <b>jaringan khusus untuk mengelola perangkat jaringan itu sendiri</b>: SSH ke switch/router, SNMP monitoring, syslog, dan akses GUI firewall. Ini "jalan belakang" khusus admin.</p>
<h3>Pengertian: In-Band vs Out-of-Band</h3>
<div class="tblwrap"><table>
<tr><th>Metode</th><th>Arti</th><th>Contoh</th></tr>
<tr><td><b>In-band</b></td><td>Management lewat jaringan yang sama (VLAN 99 di atas infrastruktur yang sama)</td><td>SSH ke 192.168.99.2 via jaringan kantor</td></tr>
<tr><td><b>Out-of-band</b></td><td>Jalur fisik terpisah khusus management</td><td>Port console/management dedicated, jaringan management fisik terpisah</td></tr>
</table></div>
<p>Lab dan kantor kecil memakai <b>in-band</b> (VLAN 99). Enterprise besar/data center memakai <b>out-of-band</b> agar perangkat tetap bisa dikelola walau jaringan production down total.</p>
<h3>Mengapa VLAN 99 Dipisahkan?</h3>
<ul>
<li><b>Keamanan</b> — jika management IP switch bisa dijangkau dari VLAN user, siapa pun bisa mencoba login/brute-force. VLAN 99 hanya boleh diakses dari IP admin.</li>
<li><b>Ketersediaan saat insiden</b> — saat VLAN user bermasalah (broadcast storm), admin tetap bisa SSH via VLAN 99 untuk memperbaiki.</li>
<li><b>Kerapian monitoring</b> — SNMP/syslog dari semua device mengalir di satu segmen yang mudah difilter.</li>
</ul>
<h3>Contoh IP Management</h3>
<div class="tblwrap"><table>
<tr><th>Perangkat</th><th>IP Management</th></tr>
<tr><td>Core-1 / Core-2</td><td>192.168.99.2 / .3</td></tr>
<tr><td>Distribution</td><td>192.168.99.4</td></tr>
<tr><td>Access switch lantai 1–3</td><td>192.168.99.11–13</td></tr>
<tr><td>Firewall (GUI/SSH)</td><td>192.168.99.254</td></tr>
<tr><td>PC admin / jump host</td><td>192.168.99.100</td></tr>
</table></div>
<div class="callout"><div class="t">Peringatan Keamanan</div><p style="margin:4px 0 0">JANGAN pernah menaruh interface management di VLAN user "agar praktis". Satu kesalahan ini membuat seluruh infrastruktur bisa diserang dari PC mana pun. VLAN 99 + ACL ketat + SSH key adalah standar minimum.</p></div>`,
      terms: [
        ['Management network', 'Segmen khusus (VLAN 99) untuk mengelola perangkat jaringan: SSH, SNMP, syslog, GUI.'],
        ['In-band management', 'Management lewat jaringan production yang sama (via VLAN khusus).'],
        ['Out-of-band management', 'Jalur fisik terpisah khusus management; tetap bisa diakses saat production down.'],
        ['Jump host', 'Server perantara yang menjadi satu-satunya pintu masuk ke management network.'],
      ],
      diagram: `<pre>        MANAGEMENT NETWORK (VLAN 99)

[PC Admin .99.100] ──SSH──▶ [Core .99.2] [Dist .99.4]
                              [Access .99.11-.13] [FW .99.254]

ACL di distribution:
  ALLOW: 192.168.99.100 → VLAN 99 (SSH 22, HTTPS 443, SNMP 161)
  DENY:  VLAN 10/20/30/40 → VLAN 99 (semua)

Semua device: kirim syslog & SNMP trap ke .99.20 (Zabbix).</pre>`,
      scenario:
        'Broadcast storm melumpuhkan VLAN 20 — user tidak bisa kerja. Karena NOC mengakses switch via VLAN 99 (tidak terdampak storm), mereka bisa login, menemukan port penyebab, dan me-shutdown-nya dalam 10 menit. Tanpa management network terpisah, mereka harus datang fisik ke tiap wiring closet.',
      bestPractices:
        'Satu skema penomoran management yang konsisten (mis. .2 core, .4 distribution, .11+ access, .254 firewall). Dokumentasikan di IPAM (Part 22.9) — jangan mengandalkan ingatan.',
      security:
        'Management network adalah "kunci kerajaan": lindungi dengan ACL ketat, SSH key (tanpa password), dan idealnya jump host + MFA. Log semua akses management (siapa login kapan).',
      challenge:
        'Tulis ACL untuk VLAN 99: izinkan hanya 192.168.99.100 (SSH/HTTPS/SNMP ke semua device), izinkan device mengirim syslog ke .99.20, tolak sisanya. Jelaskan urutan rule-nya.',
      interviewQ:
        'Q: "Apa bedanya in-band dan out-of-band management, kapan memakai masing-masing?" — A: In-band memakai VLAN khusus di jaringan yang sama (murah, cukup untuk kantor kecil); out-of-band memakai jalur fisik terpisah (mahal, wajib untuk data center/enterprise karena perangkat tetap manageable saat production down total).',
      quiz: [
        {
          q: 'Apa fungsi VLAN 99 MANAGEMENT?',
          options: [
            'Jaringan Wi-Fi untuk tamu',
            'Jaringan khusus mengelola perangkat: SSH, SNMP, syslog, GUI firewall',
            'Jaringan untuk server file',
            'Jaringan cadangan internet',
          ],
          answer: 1,
          explain: 'VLAN 99 adalah "jalan belakang" admin — hanya untuk management perangkat, terpisah dari traffic user.',
        },
        {
          q: 'Keuntungan utama out-of-band management dibanding in-band adalah…',
          options: [
            'Lebih murah',
            'Perangkat tetap bisa dikelola walau jaringan production down total',
            'Tidak butuh kabel',
            'Lebih cepat untuk transfer file',
          ],
          answer: 1,
          explain: 'Out-of-band memakai jalur fisik terpisah sehingga tidak tergantung pada kesehatan jaringan production.',
        },
        {
          q: 'Mengapa VLAN user tidak boleh bisa mencapai VLAN 99?',
          options: [
            'Agar hemat bandwidth',
            'Mencegah user/brute-force mengakses login perangkat infrastruktur',
            'Karena VLAN 99 lebih lambat',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Interface management adalah target paling berharga bagi penyerang — ACL harus memastikan hanya IP admin yang bisa mencapainya.',
        },
      ],
    },
    {
      id: '19.7',
      title: 'CCTV Network',
      body: `
<p><b>CCTV network</b> (VLAN 10, 192.168.10.0/24) adalah segmen khusus untuk <b>kamera pengawas dan NVR</b>. Kamera adalah komputer kecil yang selalu menyala — dan sering menjadi titik lemah keamanan jika digabung dengan jaringan user.</p>
<h3>Mengapa CCTV Dipisahkan?</h3>
<ul>
<li><b>Traffic konstan & besar</b> — tiap kamera streaming video 24/7 (2–8 Mbps per kamera). 20 kamera = 40–160 Mbps terus-menerus. Traffic ini tidak boleh berebut bandwidth dengan kerja user.</li>
<li><b>Keamanan</b> — kamera murah sering punya firmware lemah dan password default. Di VLAN sendiri + ACL ketat, kamera yang dibobol tidak bisa dipakai menyerang server/user.</li>
<li><b>Privasi</b> — rekaman hanya boleh diakses petugas keamanan, bukan seluruh karyawan.</li>
</ul>
<h3>Desain CCTV</h3>
<ul>
<li>Kamera: <b>IP statis atau DHCP reservation</b> di 192.168.10.0/24 (mis. .21–.60) agar NVR selalu tahu alamat tiap kamera.</li>
<li><b>PoE</b> (Power over Ethernet, Part 07) — kamera mendapat daya + data lewat satu kabel UTP dari access switch. Pastikan budget daya switch cukup.</li>
<li>NVR di VLAN 30 (192.168.30.11) — satu-satunya tujuan yang boleh diakses kamera.</li>
<li>Petugas keamanan akses live view dari VLAN 20 via ACL khusus (hanya ke NVR, port web).</li>
</ul>
<h3>Packet Flow</h3>
<pre>Kamera .10.25 → NVR .30.11:
Kamera kirim stream RTSP → Access (VLAN 10) → Dist (ACL: VLAN10→VLAN30
hanya ke .30.11, allow) → Server switch → NVR menyimpan rekaman.
Kamera → Internet: DITOLAK (kamera tidak butuh internet).</pre>
<div class="callout"><div class="t">Aturan Emas Diterapkan</div><p style="margin:4px 0 0">VLAN 10 = subnet 192.168.10.0/24 = satu broadcast domain. Kamera tidak "melihat" broadcast PC kantor — dan sebaliknya. Isolasi ini juga membatasi penyebaran malware antar segmen.</p></div>`,
      terms: [
        ['NVR', 'Network Video Recorder — server yang menerima, menyimpan, dan menyajikan rekaman kamera.'],
        ['RTSP', 'Real Time Streaming Protocol — protokol streaming video yang dipakai kamera IP.'],
        ['PoE', 'Power over Ethernet — daya listrik disalurkan lewat kabel data UTP.'],
        ['DHCP reservation', 'IP "semi-statis": DHCP selalu memberikan IP yang sama ke MAC address tertentu.'],
      ],
      diagram: `<pre>            CCTV NETWORK (VLAN 10)

[Kamera-01 .10.21] ─┐
[Kamera-02 .10.22] ─┤──PoE──▶ [Access SW] ──trunk──▶ [Distribution]
[Kamera-03 .10.23] ─┘   VLAN 10                    │
                                                   │ ACL: hanya ke .30.11
                                             [Server SW] ──▶ [NVR .30.11]
                                                             VLAN 30

Petugas (VLAN 20) ──▶ NVR web port ──▶ lihat rekaman (tanpa akses kamera langsung)</pre>`,
      scenario:
        'Sebuah ritel menemukan kameranya dipakai menyerang server (botnet) karena kamera memakai password default dan satu jaringan dengan kasir. Setelah dipindah ke VLAN 10 terisolasi tanpa akses internet, serangan serupa tertahan di segmen CCTV — kasir dan server aman.',
      bestPractices:
        'Ganti password default SEMUA kamera saat instalasi. Blokir akses internet untuk kamera (mereka tidak membutuhkannya). Hitung kebutuhan PoE budget sebelum beli switch.',
      security:
        'Kamera = IoT dengan rekam jejak keamanan buruk. Perlakukan sebagai tidak terpercaya: VLAN sendiri, no internet, hanya boleh bicara dengan NVR. Update firmware kamera terjadwal.',
      challenge:
        'Hitung kebutuhan bandwidth: 16 kamera @ 4 Mbps + 20% overhead. Berapa Mbps? Apakah uplink 1 Gbps dari access ke distribution cukup? Jelaskan.',
      interviewQ:
        'Q: "Mengapa kamera CCTV tidak boleh satu VLAN dengan PC kantor?" — A: Tiga alasan: traffic video konstan membebani broadcast domain user, kamera IoT rawan dibobol (isolasi membatasi dampak), dan privasi rekaman (akses harus dibatasi ke petugas). Solusi: VLAN 10 + ACL hanya ke NVR.',
      quiz: [
        {
          q: 'Mengapa traffic CCTV dipisahkan ke VLAN 10?',
          options: [
            'Karena kamera tidak bisa memakai IP',
            'Streaming video 24/7 memakan bandwidth besar dan kamera IoT rawan keamanan — isolasi melindungi user & server',
            'Agar kamera lebih cepat',
            'Karena aturan vendor kamera',
          ],
          answer: 1,
          explain: 'Dua alasan utama: bandwidth konstan yang besar dan profil keamanan kamera yang lemah — VLAN sendiri + ACL membatasi kedua risikonya.',
        },
        {
          q: 'Ke mana saja kamera CCTV boleh berkomunikasi menurut desain ini?',
          options: [
            'Ke internet dan semua VLAN',
            'Hanya ke NVR (192.168.30.11); akses internet ditolak',
            'Ke PC user untuk live view langsung',
            'Ke mana saja kecuali server',
          ],
          answer: 1,
          explain: 'Prinsip least privilege: kamera hanya butuh mengirim stream ke NVR. Internet dan akses lain ditolak — memperkecil permukaan serangan.',
        },
        {
          q: 'Apa keuntungan PoE untuk instalasi kamera?',
          options: [
            'Kamera menjadi lebih murah',
            'Daya dan data lewat satu kabel UTP — tidak perlu stopkontak di tiap titik kamera',
            'Kamera tidak butuh IP address',
            'Video menjadi lebih jernih',
          ],
          answer: 1,
          explain: 'PoE menyalurkan listrik lewat kabel data, sangat praktis untuk kamera di plafon/tempat tanpa stopkontak — tapi perhatikan PoE budget switch.',
        },
      ],
    },
    {
      id: '19.8',
      title: 'Office Network',
      body: `
<p><b>Office network</b> (VLAN 20, 192.168.20.0/24) adalah segmen untuk <b>perangkat kerja karyawan</b>: PC, laptop, printer, dan telepon IP. Ini VLAN dengan user terbanyak dan tiket gangguan terbanyak.</p>
<h3>Karakteristik Office Network</h3>
<ul>
<li><b>DHCP</b> — PC/laptop dapat IP otomatis dari DHCP server (Part 22.1), range mis. 192.168.20.100–200. Printer/telepon IP sebaiknya reservation/statis.</li>
<li><b>Akses paling luas</b> — boleh ke server (port terbatas), ke internet (via firewall), ke printer. Tidak boleh ke VLAN 10 (CCTV), VLAN 99 (management), dan dibatasi ke VLAN 30.</li>
<li><b>Dinamis</b> — karyawan datang-pergi, laptop pindah-pindah; desain harus tahan perubahan tanpa konfigurasi ulang.</li>
</ul>
<h3>Layanan yang Dibutuhkan User</h3>
<div class="tblwrap"><table>
<tr><th>Layanan</th><th>Tujuan</th><th>Detail di</th></tr>
<tr><td>DHCP</td><td>IP otomatis untuk PC/laptop</td><td>Part 22.1</td></tr>
<tr><td>DNS</td><td>Nama server/aplikasi (erp.kantor.lan)</td><td>Part 22.2</td></tr>
<tr><td>Internet via proxy/firewall</td><td>Browsing dengan filtering</td><td>Part 19.10</td></tr>
<tr><td>File & aplikasi server</td><td>SMB, ERP, email internal</td><td>Part 19.5</td></tr>
</table></div>
<h3>Packet Flow Khas</h3>
<pre>PC .20.50 buka aplikasi ERP (https://erp.kantor.lan):
1. DNS query → 192.168.30.21 → jawab: 192.168.30.10
2. PC → gateway .20.1 → Dist routing ke VLAN 30
3. ACL: VLAN20→VLAN30 TCP 443 ALLOW → Server .30.10
4. Balasan kembali lewat jalur yang sama (stateful).</pre>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Masalah office paling sering di Layer 1 (kabel), Layer 2 (VLAN port salah), Layer 3 (IP/DHCP/gateway salah). Urutan cek "fisik → VLAN → IP → gateway → DNS" menyelesaikan 90% tiket user.</p></div>`,
      terms: [
        ['DHCP', 'Dynamic Host Configuration Protocol — pembagian IP otomatis ke perangkat.'],
        ['Reservation', 'IP DHCP yang selalu sama untuk MAC tertentu (untuk printer/telepon IP).'],
        ['Telepon IP', 'Telepon yang memakai jaringan data (VoIP) — sering di VLAN voice tersendiri di enterprise besar.'],
      ],
      diagram: `<pre>           OFFICE NETWORK (VLAN 20)

[PC .20.101] ──┐
[Laptop .20.102]┤──DHCP──▶ [Access SW] ──▶ [Distribution]
[Printer .20.21]┘  VLAN 20        │ ACL: allow→VLAN30 (port tertentu)
                                  │      allow→Internet (via FW)
                                  │      deny→VLAN 10/99
                            [Core] → [Firewall] → Internet</pre>`,
      scenario:
        'Hari pertama karyawan baru: ia colok laptop, dapat IP otomatis via DHCP, langsung bisa buka ERP dan internet — tanpa teknisi datang. Itulah office network yang dirancang benar: zero-touch untuk user, semua policy sudah di distribution/firewall.',
      bestPractices:
        'Sisakan range DHCP yang cukup (+30% dari jumlah user untuk tamu internal/laptop ganda). Dokumentasikan IP reservation printer & device khusus. Pisahkan printer ke IP tetap agar user tidak kehilangan printer saat IP berubah.',
      security:
        'VLAN user adalah sumber ancaman terbesar (phishing, malware). Terapkan: DHCP snooping, port security, antivirus terpusat, dan firewall memfilter traffic keluar (egress filtering) — malware butuh "menelepon pulang".',
      challenge:
        'Kantor punya 180 user dan bertumbuh 20%/tahun. Apakah /24 (254 host) cukup untuk 3 tahun? Hitung dan tentukan: tetap /24 atau naik ke /23? Jelaskan tradeoff-nya.',
      interviewQ:
        'Q: "User lapor tidak bisa akses aplikasi tapi bisa ping gateway. Apa urutan cekmu?" — A: Gateway OK berarti Layer 1–3 lokal beres. Lanjut: cek DNS (nslookup nama aplikasi), cek routing/ACL ke VLAN server (apakah port aplikasinya dibuka?), lalu cek server-nya sendiri. Urutan: fisik → IP → gateway → DNS → firewall/ACL → server.',
      quiz: [
        {
          q: 'Perangkat office umumnya mendapat IP dengan cara…',
          options: [
            'IP statis manual satu per satu',
            'DHCP otomatis (dengan reservation untuk printer/device khusus)',
            'IP ditulis di kertas dan diketik tiap hari',
            'Tanpa IP, langsung jalan',
          ],
          answer: 1,
          explain: 'DHCP membuat onboarding zero-touch; device khusus seperti printer memakai reservation agar alamatnya stabil.',
        },
        {
          q: 'PC office boleh mengakses apa menurut desain ini?',
          options: [
            'Semua VLAN termasuk management dan CCTV',
            'Server (port terbatas), internet via firewall; TIDAK ke CCTV/management',
            'Hanya internet, tidak boleh ke server',
            'Semua perangkat tanpa batasan',
          ],
          answer: 1,
          explain: 'Least privilege: user butuh server dan internet saja. CCTV (privasi) dan management (keamanan infrastruktur) tertutup untuk user.',
        },
        {
          q: 'User bisa ping gateway tapi tidak bisa buka aplikasi. Layer apa yang paling mungkin bermasalah?',
          options: [
            'Layer 1 — kabel putus',
            'Layer 3 ke atas: DNS, ACL/firewall, atau server aplikasinya',
            'Layer 2 — VLAN salah',
            'Pasti masalah ISP',
          ],
          answer: 1,
          explain: 'Ping gateway OK = Layer 1–3 lokal beres. Masalah ada di atasnya: resolusi nama (DNS), izin (ACL), atau server tujuan.',
        },
      ],
    },
    {
      id: '19.9',
      title: 'Guest Network',
      body: `
<p><b>Guest network</b> (VLAN 40, 192.168.40.0/24) adalah segmen untuk <b>tamu dan perangkat pribadi (BYOD)</b>: Wi-Fi tamu, HP pribadi karyawan, vendor yang berkunjung. Prinsipnya: <i>beri internet, jangan beri apa pun yang lain</i>.</p>
<h3>Pengertian & Isolasi</h3>
<p>Guest adalah zona <b>tidak terpercaya</b> (untrusted) — kita tidak mengontrol perangkat tamu (bisa terinfeksi malware). Maka aturannya keras:</p>
<div class="tblwrap"><table>
<tr><th>Dari VLAN 40 ke…</th><th>Aturan</th><th>Alasan</th></tr>
<tr><td>Internet</td><td>ALLOW (via firewall, dengan filtering)</td><td>Itu gunanya Wi-Fi tamu</td></tr>
<tr><td>VLAN 10/20/30/99</td><td>DENY total</td><td>Tamu tidak boleh menyentuh aset internal</td></tr>
<tr><td>Sesama guest</td><td>Client isolation (disarankan)</td><td>Tamu tidak bisa saling serang</td></tr>
</table></div>
<h3>Desain Praktis</h3>
<ul>
<li><b>SSID terpisah</b> di access point: "KANTOR-Guest" → VLAN 40 (trunk dari AP, Part 20.8).</li>
<li><b>Captive portal</b> (opsional) — halaman login/syarat sebelum internet aktif; juga mencatat siapa yang online (audit).</li>
<li><b>Bandwidth limit</b> — batasi mis. 10 Mbps per client agar tamu tidak menghabiskan bandwidth kantor (QoS, Part 33).</li>
<li><b>DHCP terpisah</b> — range 192.168.40.100–200, lease time pendek (mis. 4 jam) karena tamu berganti cepat.</li>
</ul>
<h3>Packet Flow</h3>
<pre>HP tamu → AP (SSID Guest, VLAN 40) → DHCP .40.150
→ Dist: ACL VLAN40→Internet ALLOW, →VLAN internal DENY
→ Firewall (filter konten) → ISP → Internet ✓
HP tamu → coba ping server .30.10 → DROP di distribution + log.</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, guest cukup satu VLAN + ACL deny. Di production (mall, hotel, kampus), tambahkan captive portal + logging identitas untuk kepatuhan hukum (UU ITE): siapa online kapan harus bisa ditelusur.</p></div>`,
      terms: [
        ['Guest network', 'Segmen tidak terpercaya untuk tamu/BYOD: hanya internet, isolasi total dari aset internal.'],
        ['BYOD', 'Bring Your Own Device — perangkat pribadi yang dibawa ke kantor.'],
        ['Captive portal', 'Halaman login/syarat yang muncul sebelum Wi-Fi tamu memberi akses internet.'],
        ['Client isolation', 'Fitur AP yang mencegah client Wi-Fi saling berkomunikasi.'],
        ['Untrusted zone', 'Zona yang dianggap tidak aman; traffic-nya selalu dicurigai.'],
      ],
      diagram: `<pre>            GUEST NETWORK (VLAN 40)

[HP Tamu] ──WiFi──▶ [AP: SSID "KANTOR-Guest"]
                         │ trunk (VLAN 40 tagged)
                    [Access SW] ──▶ [Distribution]
                                        │ ACL:
                                        │  ALLOW → Internet (via FW)
                                        │  DENY  → VLAN 10/20/30/99
                                        ▼
                                   [Firewall] → [ISP]

Satu arah: keluar saja. Tidak ada jalan masuk ke dalam.</pre>`,
      scenario:
        'Vendor datang presentasi dan minta Wi-Fi. Resepsionis memberi password "KANTOR-Guest". Vendor bisa internetan dan presentasi — tapi laptopnya yang terinfeksi malware tidak bisa menyentuh satu pun server atau PC kantor karena VLAN 40 terisolasi total. Resepsionis tidak perlu memanggil IT.',
      bestPractices:
        'Ganti password Wi-Fi tamu berkala (mis. mingguan). Aktifkan client isolation. Batasi bandwidth per client. Pisahkan SSID guest dari SSID karyawan di AP yang sama via VLAN.',
      security:
        'Anggap semua perangkat guest sudah terinfeksi. Selain isolasi VLAN, aktifkan logging (siapa-MAC-kapan) untuk kebutuhan audit/insiden. Jangan pernah beri tamu akses ke SSID karyawan "agar cepat".',
      challenge:
        'Tulis aturan firewall untuk VLAN 40: izinkan DNS & HTTP/HTTPS keluar, tolak semua ke RFC1918 (10/8, 172.16/12, 192.168/16). Mengapa menolak seluruh RFC1918 lebih aman daripada menolak per-VLAN?',
      interviewQ:
        'Q: "Apa risiko terbesar guest network dan bagaimana mengatasinya?" — A: Perangkat tamu tidak terkontrol (malware) + tamu bisa mengintip traffic internal. Solusi: VLAN isolasi total (deny ke semua segmen internal), client isolation di AP, bandwidth limit, dan captive portal + logging untuk audit.',
      quiz: [
        {
          q: 'Aturan akses yang benar untuk VLAN 40 GUEST adalah…',
          options: [
            'Boleh ke semua VLAN internal agar praktis',
            'Hanya internet via firewall; DENY total ke VLAN 10/20/30/99',
            'Boleh ke server tapi tidak ke internet',
            'Sama persis dengan VLAN office',
          ],
          answer: 1,
          explain: 'Guest adalah zona untrusted: internet saja, isolasi total dari aset internal. Itulah gunanya segmentasi.',
        },
        {
          q: 'Apa fungsi client isolation di access point guest?',
          options: [
            'Mempercepat Wi-Fi',
            'Mencegah perangkat tamu saling berkomunikasi/serang',
            'Menghemat baterai HP tamu',
            'Menambah jangkauan sinyal',
          ],
          answer: 1,
          explain: 'Client isolation memutus komunikasi antar client di SSID yang sama — tamu tidak bisa saling scan/serang.',
        },
        {
          q: 'Mengapa lease time DHCP guest disarankan pendek (±4 jam)?',
          options: [
            'Agar internet lebih cepat',
            'Tamu berganti cepat; lease pendek mengembalikan IP ke pool agar tidak habis',
            'Agar tamu tidak bisa download',
            'Tidak ada alasan',
          ],
          answer: 1,
          explain: 'Ratusan tamu bergantian memakai pool /24 yang terbatas; lease pendek mendaur ulang IP yang sudah tidak dipakai.',
        },
      ],
    },
    {
      id: '19.10',
      title: 'Internet Edge',
      body: `
<p><b>Internet edge</b> adalah <b>perbatasan antara jaringan perusahaan dan internet</b>: firewall, router ISP, dan (idealnya) dua ISP untuk redundansi. Ini titik paling diserang — dan titik yang menentukan "internet mati atau tidak" bagi seluruh kantor.</p>
<h3>Komponen Internet Edge</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Fungsi</th></tr>
<tr><td><b>Firewall</b> (FortiGate, Part 15–17)</td><td>Filter traffic masuk/keluar, NAT, IPS, filtering konten</td></tr>
<tr><td><b>Router edge / ISP router</b></td><td>BGP/peering ke ISP (enterprise besar); kantor kecil cukup default route</td></tr>
<tr><td><b>DMZ</b> (opsional)</td><td>Zona server yang boleh diakses dari internet (web/mail server)</td></tr>
<tr><td><b>Dual ISP</b></td><td>Dua penyedia internet + failover otomatis</td></tr>
</table></div>
<h3>Packet Flow: Keluar & Masuk</h3>
<pre>KELUAR (user browsing):
PC (VLAN 20) → Dist → Core → Firewall (cek policy, NAT: 192.168.20.50
→ IP publik) → ISP → Internet
MASUK (tidak diminta → DITOLAK):
Internet → Firewall: "ada paket ke IP publik port 3389 tak diminta?"
→ DROP (default-deny inbound). Hanya port yang di-publish (mis. web
server di DMZ) yang diteruskan.</pre>
<h3>NAT — Mengapa Dibutuhkan?</h3>
<p>IP internal (192.168.x.x) adalah <b>private IP</b> (Part 04) — tidak bisa routing di internet. <b>NAT</b> (Network Address Translation) menerjemahkan banyak IP private menjadi satu IP publik milik ISP. Tanpa NAT, user tidak bisa internetan dengan IP private.</p>
<h3>Dual ISP Failover</h3>
<p>Satu ISP mati = kantor lumpuh. Solusi: dua ISP + <b>failover otomatis</b> (di FortiGate: SD-WAN/link monitor; di MikroTik: check-gateway/netwatch — Part 13). Traffic pindah ke ISP cadangan dalam hitungan detik.</p>
<div class="callout blue"><div class="t">DMZ — Zona Penyangga</div><p style="margin:4px 0 0"><b>DMZ</b> (Demilitarized Zone) adalah segmen khusus untuk server yang <i>harus</i> diakses dari internet (web publik, mail). Server DMZ boleh diakses dari luar, tapi TIDAK boleh akses ke LAN dalam — jika web server dibobol, penyerang tetap terkunci di DMZ.</p></div>`,
      terms: [
        ['Internet edge', 'Perbatasan jaringan perusahaan–internet: firewall, router ISP, DMZ.'],
        ['NAT', 'Network Address Translation — menerjemahkan IP private internal menjadi IP publik.'],
        ['DMZ', 'Demilitarized Zone — segmen server yang boleh diakses dari internet tapi terisolasi dari LAN.'],
        ['Failover', 'Perpindahan otomatis ke jalur/cadangan saat jalur utama gagal.'],
        ['Default route', 'Rute "tangkap semua" (0.0.0.0/0) yang mengarah ke ISP.'],
        ['Egress filtering', 'Pemfilteran traffic KELUAR untuk mencegah malware "menelepon pulang".'],
      ],
      diagram: `<pre>              INTERNET EDGE

                                      [ Internet ]
                                      /         \\
                                [ ISP-A ]     [ ISP-B ]   ← dual ISP
                                      \\         /
                                   [ Firewall ]
                                   /    |    \\
                             [Core]  [DMZ]  (policy+NAT)
                                       |
                                 [Web Server publik]
                                 (boleh diakses dari luar,
                                  TIDAK boleh ke LAN dalam)

Inbound default-deny. Outbound via policy per VLAN.</pre>`,
      scenario:
        'Kabel fiber ISP-A putus oleh galian proyek jam 10 pagi. Link monitor firewall mendeteksi dalam 5 detik dan memindahkan seluruh traffic ke ISP-B — user hanya merasakan internet "kedip" sebentar. Tanpa dual ISP, 400 karyawan tidak produktif sampai kabel diperbaiki (bisa 6 jam).',
      bestPractices:
        'Selalu punya minimal dua jalur internet untuk kantor di atas 50 user. Uji failover tiap kuartal (cabut kabel ISP-A, pastikan pindah otomatis). Dokumentasikan IP publik, kontak NOC tiap ISP, dan SLA-nya.',
      security:
        'Edge adalah target serangan #1: aktifkan IPS/IDS, geo-blocking bila perlu, dan pastikan firmware firewall selalu update. Jangan publish port management firewall ke internet — admin hanya via VPN (Part 31).',
      challenge:
        'Rancang edge untuk kantor 200 user: pilih bandwidth tiap ISP, tentukan mana primary/backup atau load-balance, dan tulis 5 policy firewall dasar (office→internet, guest→internet, inbound default-deny, DMZ publish web, management via VPN saja).',
      interviewQ:
        'Q: "Jelaskan alur paket dari PC user ke website internet, sebutkan peran NAT." — A: PC kirim ke gateway → routing ke firewall → firewall cek policy → NAT ubah source IP private menjadi IP publik (agar bisa routing di internet & balasan tahu jalan pulang) → ISP → internet. Balasan diterjemahkan kembali oleh NAT ke IP private asal.',
      quiz: [
        {
          q: 'Mengapa NAT dibutuhkan agar user bisa internetan?',
          options: [
            'Agar internet lebih cepat',
            'IP private (192.168.x.x) tidak bisa routing di internet — NAT menerjemahkannya ke IP publik',
            'Agar tidak butuh firewall',
            'Agar IP user terlihat keren',
          ],
          answer: 1,
          explain: 'IP private hanya berlaku lokal; NAT di firewall menerjemahkan banyak IP internal menjadi IP publik ISP saat traffic keluar.',
        },
        {
          q: 'Apa fungsi DMZ?',
          options: [
            'Menyimpan backup data',
            'Segmen untuk server yang harus diakses dari internet, terisolasi dari LAN dalam',
            'Jaringan khusus tamu',
            'Ruang server fisik',
          ],
          answer: 1,
          explain: 'DMZ adalah zona penyangga: server publik bisa dijangkau dari luar, tapi jika dibobol penyerang tetap tidak bisa masuk ke LAN.',
        },
        {
          q: 'Kebijakan inbound (dari internet ke dalam) yang benar di firewall edge adalah…',
          options: [
            'Allow all agar tidak ribet',
            'Default-deny: tolak semua kecuali port/layanan yang sengaja di-publish (mis. web di DMZ)',
            'Allow all di jam kerja',
            'Serahkan ke ISP',
          ],
          answer: 1,
          explain: 'Prinsip least privilege di edge: tutup semua dari luar, buka hanya yang dibutuhkan dan idealnya hanya ke DMZ, bukan ke LAN.',
        },
      ],
    },
  ],
};
