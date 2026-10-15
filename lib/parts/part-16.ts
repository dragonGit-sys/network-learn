import type { Part } from './types';

export const part16: Part = {
  id: '16',
  number: 'PART 16',
  title: 'GNS3 + MikroTik CHR Lab',
  phaseId: 'fase-3',
  description: 'Lab gabungan: membangun topologi GNS3 dengan dua router CHR, konfigurasi interface, IP, routing, dan analisis traffic.',
  repoFolder: 'part-16-gns3-chr-lab',
  objectives: [
    'Menginstal GNS3 dan GNS3 VM serta mengimpor template CHR.',
    'Membangun topologi dua router CHR dengan switch dan VPCS di GNS3.',
    'Mengonfigurasi interface, IP address, dan static routing antar CHR.',
    'Memverifikasi konektivitas end-to-end dan menganalisis traffic dengan capture.',
    'Mempraktikkan siklus failure injection → troubleshooting → fix → verifikasi.'
  ],
  prerequisites: 'Part 13–15 (RouterOS, CHR, GNS3). Laptop RAM 8 GB+, virtualisasi aktif.',
  project: {
    title: 'Project: Enterprise Mini-Lab (2 Router + VLAN + Routing)',
    html: `<p><b>Tugas:</b> Bangun topologi GNS3 berisi 2 CHR (R1, R2), 1 switch, 4 VPCS, dan 1 NAT node yang mengimplementasikan desain lab: VLAN 20 (OFFICE 192.168.20.0/24) di R1, VLAN 30 (SERVER 192.168.30.0/24) di R2, routing antar router, dan akses internet via NAT.</p><h3>Langkah Pengerjaan</h3><ol><li>Gambar topologi di GNS3 sesuai desain (lihat 16.4–16.5); beri nama node deskriptif dan note IP di kanvas.</li><li>Konfigurasi semua IP, VLAN, dan static route (16.6–16.8); simpan <code>/export</code> tiap router (<code>r1-final.rsc</code>, <code>r2-final.rsc</code>).</li><li>Lakukan failure injection sendiri (cabut 1 route), dokumentasikan gejala → diagnosis → fix (16.9).</li><li>Capture traffic ping antar-VLAN di Wireshark, screenshot dan jelaskan 3 field packet (16.10).</li><li>Buat snapshot final bernama <code>project-selesai</code>.</li></ol><h3>Upload ke GitHub (Portfolio)</h3><ol><li>Buat repo <code>part-16-gns3-chr-lab</code> di GitHub.</li><li>Isi repo: <code>README.md</code> (tujuan, topologi ASCII, IP plan tabel VLAN), <code>topologi.png</code> (screenshot kanvas GNS3), <code>r1-final.rsc</code> + <code>r2-final.rsc</code> (hasil /export yang sudah disanitasi — hapus password/hash), <code>troubleshooting.md</code> (1 kasus failure injection: gejala, diagnosis, fix).</li><li>Sanitasi: ganti password dengan <code>CHANGEME</code>; jangan upload file .backup.</li><li>Commit dengan pesan jelas, push ke main.</li></ol><h3>Kriteria Selesai</h3><ul><li>Semua VPCS bisa ping gateway-nya, antar-VLAN, dan 8.8.8.8 (via NAT).</li><li>Static route terdokumentasi dengan comment di tiap router.</li><li>Repo GitHub berisi 5 file di atas dan README menjelaskan desain.</li><li>1 kasus troubleshooting terdokumentasi lengkap (gejala → sebab → fix → verifikasi).</li></ul>`
  },
  subbabs: [
    {
      id: '16.1',
      title: 'Install GNS3',
      body: `<p>Lab dimulai dari fondasi: <b>GNS3 terinstall dan server local berjalan</b>. Ikuti sesuai OS-mu.</p><h3>Topology (Target Akhir Part Ini)</h3><pre>[VPCS-Off1]--\
[VPCS-Off2]----[SW1]----[R1-ether2]   [R1-ether1]----[R2-ether1]   [R2-ether2]----[SW2]----[VPCS-Srv1]
                         [R1-ether3]----[NAT] (internet simulasi)</pre><h3>Objective</h3><p>GNS3 GUI + local server berjalan; kanvas kosong bisa dibuat.</p><h3>Configuration</h3><ol><li>Download GNS3 dari gns3.com (pilih versi stabil) → install.</li><li>Buka GNS3 → Setup Wizard → pilih <b>Run everything on my computer (local server)</b>.</li><li>Verifikasi: ikon server hijau di pojok kanan bawah; Help → About mencatat versi.</li></ol><h3>Verification</h3><p>Buat project baru (<code>lab-16-routing</code>) → kanvas kosong terbuka tanpa error "could not connect to server".</p><h3>Failure Injection</h3><p>Matikan gns3server manual (atau blokir port 3080 di firewall host) → buka GNS3.</p><h3>Troubleshooting</h3><p>Gejala: error koneksi server. Diagnosis: ikon server merah → server tidak jalan. Cek apakah proses gns3server hidup; cek konflik port.</p><h3>Fix</h3><p>Hidupkan server / izinkan di firewall host / ganti port di Preferences → Server.</p><h3>Final Verification</h3><p>Project baru bisa dibuat; ikon server hijau kembali.</p><div class="callout blue"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, local server cukup. Di "production" training (kelas 20 orang), arsitek memakai GNS3 VM/server terpusat — pola yang sama, skala berbeda.</p></div>`,
      terms: [['Setup Wizard', 'Panduan awal GNS3 untuk memilih mode server.']],
      scenario: 'Peserta gagal di langkah pertama karena antivirus memblokir gns3server. Solusi 2 menit: whitelist di antivirus — pelajaran bahwa "install" juga bagian dari skill engineer.',
      bestPractices: 'Catat versi GNS3 yang dipakai; samakan dengan teman sekelas agar project portable.',
      security: 'Izinkan gns3server hanya di firewall private, bukan public.',
      challenge: 'Selesaikan instalasi dan buat project lab-16-routing. Screenshot ikon server hijau.',
      interviewQ: 'Q: "GNS3 tidak bisa konek ke local server setelah install. Apa penyebab umumnya?" — A: gns3server diblokir antivirus/firewall host, atau port 3080 dipakai aplikasi lain.',
      quiz: [
        { q: 'Mode server yang dipakai untuk lab mandiri di laptop adalah…', options: ['Remote server', 'Local server (run everything on my computer)', 'GNS3 VM wajib', 'Cloud'], answer: 1, explain: 'Local server = GUI + server di laptop yang sama — paling simpel untuk lab mandiri.' },
        { q: 'Indikator GNS3 server berjalan normal adalah…', options: ['Layar biru', 'Ikon server hijau di pojok kanan bawah', 'Suara kipas', 'Tidak ada indikator'], answer: 1, explain: 'Ikon status server menunjukkan konektivitas GUI↔server.' },
        { q: 'Jika muncul "could not connect to server", cek pertama adalah…', options: ['Install ulang Windows', 'Apakah gns3server berjalan / diblokir firewall / konflik port', 'Beli RAM', 'Ganti laptop'], answer: 1, explain: 'Urutkan dari yang paling mungkin: proses server, firewall host, konflik port 3080.' }
      ]
    },
    {
      id: '16.2',
      title: 'Install GNS3 VM',
      body: `<p>Untuk topologi 2 CHR + switch + VPCS, local server biasanya cukup. Tapi kita siapkan <b>GNS3 VM</b> sebagai opsi — dan sebagai latihan arsitektur.</p><h3>Objective</h3><p>Memahami kapan GNS3 VM dibutuhkan dan cara menghubungkan GUI ke sana.</p><h3>Configuration (Garis Besar)</h3><ol><li>Download GNS3 VM (.ova) → import ke VMware/VirtualBox.</li><li>Set RAM 8 GB, CPU 2–4 core, aktifkan <b>VT-x passthrough</b> (nested virtualization).</li><li>Jalankan VM → catat IP (tampil di console VM).</li><li>GNS3 GUI → Preferences → GNS3 VM → Enable → isi IP → Apply.</li></ol><h3>Verification</h3><p>Ikon "GNS3 VM" hijau; buat node test dan start — node berjalan di VM (cek via console VM: proses qemu muncul).</p><h3>Failure Injection</h3><p>Matikan opsi VT-x passthrough → start CHR di GNS3 VM.</p><h3>Troubleshooting</h3><p>Gejala: node sangat lambat / gagal start, log menyebut KVM. Diagnosis: nested virtualization tidak aktif.</p><h3>Fix</h3><p>Aktifkan VT-x passthrough di setting VM GNS3, restart GNS3 VM.</p><h3>Final Verification</h3><p>CHR boot normal dan responsif; waktu boot wajar (&lt;2 menit).</p><div class="callout"><div class="t">Keputusan Lab Ini</div><p style="margin:4px 0 0">Coba dulu dengan <b>local server</b>. Jika laptop kewalahan (CPU 100%), baru pindah ke GNS3 VM. Jangan over-engineering sejak awal.</p></div>`,
      terms: [['GNS3 VM setup', 'Menghubungkan GUI ke VM berisi gns3server via IP.']],
      scenario: 'Laptop peserta (RAM 8 GB) ngos-ngosan menjalankan 2 CHR + FortiGate. Ia memindah ke GNS3 VM dengan RAM 12 GB di VMware — topologi sama, laptop adem.',
      bestPractices: 'Ukur dulu kebutuhan; GNS3 VM hanya bila local server tidak cukup.',
      security: 'GNS3 VM di jaringan bersama wajib dipassword; jangan biarkan IP-nya terbuka ke publik.',
      challenge: 'Tentukan: apakah laptop-mu butuh GNS3 VM? Uji dengan menjalankan 2 CHR di local server dan pantau CPU.',
      interviewQ: 'Q: "Kapan kamu memilih GNS3 VM dibanding local server?" — A: Saat topologi besar (10+ node) atau butuh KVM Linux; local server cukup untuk lab kecil.',
      quiz: [
        { q: 'Syarat kritis agar VM di dalam GNS3 VM berjalan baik adalah…', options: ['Internet cepat', 'VT-x passthrough / nested virtualization aktif', 'Layar besar', 'Tidak ada'], answer: 1, explain: 'Tanpa nested virtualization, QEMU di dalam VM sangat lambat/gagal.' },
        { q: 'GUI terhubung ke GNS3 VM melalui…', options: ['Kabel USB', 'IP VM yang diisi di Preferences → GNS3 VM', 'Bluetooth', 'Otomatis tanpa setting'], answer: 1, explain: 'GUI mengarah ke server di VM via REST API ke IP-nya.' },
        { q: 'Rekomendasi awal untuk lab 2 CHR adalah…', options: ['Langsung GNS3 VM', 'Coba local server dulu, pindah bila resource kurang', 'Sewa cloud', 'Tidak bisa'], answer: 1, explain: 'Jangan over-engineering; ukur kebutuhan nyata dulu.' }
      ]
    },
    {
      id: '16.3',
      title: 'Import CHR',
      body: `<p>Menyiapkan <b>template CHR</b> di GNS3 — sekali setting, dipakai untuk semua node router lab.</p><h3>Objective</h3><p>Template "MikroTik-CHR" tersedia di panel node dan bisa di-drag ke kanvas.</p><h3>Configuration</h3><ol><li>Download image CHR <b>qcow2</b> (v7 stable) dari mikrotik.com.</li><li>GNS3 → Preferences → QEMU → QEMU VMs → New → nama <code>MikroTik-CHR</code>.</li><li>Pilih image qcow2 → RAM <b>512 MB</b> → NIC <b>virtio-net-pci</b> → console telnet.</li><li>Alasan tiap pilihan: qcow2 = format QEMU (snapshot hemat); 512 MB = cukup untuk RouterOS; virtio-net = NIC tercepat; telnet = console default GNS3.</li><li>Finish → template muncul di panel Routers.</li></ol><h3>Verification</h3><p>Drag 1 node ke kanvas → klik kanan → Configure → tab Network: jumlah adapter bisa diubah; image terdaftar.</p><h3>Failure Injection</h3><p>Hapus/rename file qcow2 → coba start node.</p><h3>Troubleshooting</h3><p>Gejala: error "image not found". Diagnosis: path image di template menunjuk file yang hilang.</p><h3>Fix</h3><p>Edit template → arahkan ulang ke file qcow2 yang benar.</p><h3>Final Verification</h3><p>Node bisa di-start (atau minimal tidak error image).</p><div class="callout blue"><div class="t">Satu Template, Banyak Node</div><p style="margin:4px 0 0">Template adalah cetakan — tiap node yang di-drag mendapat salinan disk sendiri (linked clone). Ubah template = memengaruhi node BARU, bukan yang sudah ada.</p></div>`,
      terms: [['Template (GNS3)', 'Cetakan node: setting QEMU + image yang bisa dipakai berulang.'], ['Linked clone', 'Node baru memakai salinan disk berbasis template — hemat ruang.']],
      diagram: `<pre>              IMPORT CHR

   [chr-7.x.qcow2] (download resmi)
            |
   Preferences → QEMU → New → "MikroTik-CHR"
     RAM 512MB | virtio-net-pci | telnet console
            |
            v
   [Template] --drag--> [R1] [R2] (tiap node = clone independen)</pre>`,
      scenario: 'Kelas dengan 30 laptop: instruktur membagikan template + image via flashdisk. Dalam 10 menit semua peserta punya node CHR identik — tidak ada "versi beda".',
      bestPractices: 'Samakan versi image CHR di seluruh node lab; simpan image di folder tetap (jangan di Downloads sementara).',
      security: 'Download image hanya dari mikrotik.com — image dari sumber asing bisa disusupi.',
      challenge: 'Import template CHR dan buat 2 node test. Jangan konfigurasi dulu — itu di 16.4.',
      interviewQ: 'Q: "Apa beda template dan node di GNS3?" — A: Template = cetakan (setting + image); node = instance yang dijalankan dari cetakan, tiap node punya disk independen.',
      quiz: [
        { q: 'Format image CHR untuk template QEMU GNS3 adalah…', options: ['VDI', 'qcow2', 'ISO', 'VMDK'], answer: 1, explain: 'QEMU memakai qcow2; VDI/VMDK untuk VirtualBox/VMware.' },
        { q: 'RAM yang disarankan untuk template CHR adalah…', options: ['4 GB', '512 MB', '16 GB', '64 MB'], answer: 1, explain: 'RouterOS ramping; 512 MB cukup dan hemat untuk banyak node.' },
        { q: 'Jika file image dipindah/dihapus, gejalanya saat start node adalah…', options: ['Node tetap jalan', 'Error image not found', 'Internet mati', 'Tidak ada gejala'], answer: 1, explain: 'Template menyimpan path ke image; file hilang = node gagal start.' }
      ]
    },
    {
      id: '16.4',
      title: 'Create First Router',
      body: `<p>Membuat router pertama (R1) dan memastikan ia bisa diakses console.</p><h3>Topology</h3><pre>[R1] (belum dikabeli — fokus: node hidup & bisa console)</pre><h3>Objective</h3><p>Node R1 (CHR) running dan bisa login via console.</p><h3>Configuration</h3><ol><li>Drag template MikroTik-CHR → rename jadi <code>R1</code>.</li><li>Klik kanan R1 → Configure → Network adapters: <b>4</b> (alasan: butuh ether1 mgmt, ether2 LAN, ether3 ke R2, ether4 WAN — siapkan di depan).</li><li>Start node → tunggu boot (±1 menit) → klik kanan → Console.</li><li>Login <code>admin</code> (tanpa password) → <code>/system identity set name=R1</code>.</li></ol><h3>Verification</h3><pre>[admin@R1] &gt; /system identity print
  name: R1
[admin@R1] &gt; /interface print
# HARUS tampil ether1..ether4 (4 adapter terdeteksi)</pre><h3>Failure Injection</h3><p>Set adapter hanya 1 di template, start, lalu coba "colok" 3 kabel.</p><h3>Troubleshooting</h3><p>Gejala: kabel tidak bisa dipasang / interface kurang. Diagnosis: jumlah adapter &lt; kebutuhan.</p><h3>Fix</h3><p>Stop node → Configure → tambah adapter → start ulang.</p><h3>Final Verification</h3><p>4 interface tampil di /interface print; identity = R1.</p>`,
      terms: [],
      scenario: 'Peserta terburu-buru mengkabeli sebelum menambah adapter — 30 menit bingung "kok kabelnya tidak bisa dipasang". Sejak itu ia selalu hitung adapter dulu.',
      bestPractices: 'Tentukan jumlah adapter SEBELUM start pertama; rename node sesuai peran.',
      security: 'Ganti password admin segera setelah login pertama (<code>/user set admin password=...</code>) — bahkan di lab, biasakan.',
      challenge: 'Buat R1 dan R2 (4 adapter tiap node), beri identity, dan verifikasi interface-nya.',
      interviewQ: 'Q: "Mengapa menambah adapter harus saat node stopped?" — A: Karena itu perubahan hardware virtual — seperti mencolok NIC fisik ke server yang mati.',
      quiz: [
        { q: 'Jumlah adapter R1 diset 4 karena…', options: ['Agar keren', 'Kebutuhan kabel sudah dihitung di depan: mgmt, LAN, ke-R2, WAN', 'Wajib 4', 'Default'], answer: 1, explain: 'Rencanakan adapter sesuai topologi sebelum start — menghemat stop/start ulang.' },
        { q: 'Cara login pertama ke CHR via GNS3 adalah…', options: ['WinBox langsung', 'Console → user admin tanpa password', 'SSH', 'WebFig'], answer: 1, explain: 'Belum ada IP — console adalah satu-satunya jalan; default admin tanpa password.' },
        { q: 'Setelah menambah adapter, yang harus dilakukan adalah…', options: ['Langsung pakai', 'Stop node dulu bila running, tambah, start ulang', 'Restart laptop', 'Tidak perlu apa-apa'], answer: 1, explain: 'Perubahan adapter butuh node stopped; start ulang agar OS mendeteksi NIC baru.' }
      ]
    },
    {
      id: '16.5',
      title: 'Connect CHR',
      body: `<p>Mengkabeli topologi lengkap: R1–R2, switch, VPCS, dan NAT.</p><h3>Topology (Final)</h3><pre>                10.0.0.0/30
[VPCS-Off1]--\   [R1 eth3]----------[R2 eth1]
[VPCS-Off2]---[SW1]--[R1 eth2]                [R2 eth2]--[SW2]---[VPCS-Srv1]
 192.168.20.0/24   192.168.20.1                192.168.30.1   192.168.30.0/24
[R1 eth4]--[NAT] (internet)     [R1 eth1 & R2 eth1 mgmt via cloud/host-only bila perlu]</pre><h3>Objective</h3><p>Semua link terpasang sesuai desain; tiap kabel di port yang benar.</p><h3>Configuration</h3><ol><li>Tambah node: Ethernet switch (SW1, SW2), VPCS x3, NAT.</li><li>Tarik kabel: R1 eth2→SW1, R1 eth3→R2 eth1, R1 eth4→NAT, R2 eth2→SW2, VPCS→switch masing-masing.</li><li>Tambahkan note di kanvas: IP plan tiap segmen.</li><li>Buat snapshot <code>topologi-dasar</code>.</li></ol><h3>Verification</h3><p>Semua link hijau (connected); summary panel menampilkan semua node; snapshot tersimpan.</p><h3>Failure Injection</h3><p>Cabut (delete) satu link R1–R2.</p><h3>Troubleshooting</h3><p>Gejala: link hilang di kanvas. Diagnosis: visual — kabel terhapus.</p><h3>Fix</h3><p>Tarik ulang kabel; atau restore snapshot bila banyak yang rusak.</p><h3>Final Verification</h3><p>Topologi sesuai desain; snapshot <code>topologi-dasar</code> valid (coba restore di project test bila ragu).</p><div class="callout blue"><div class="t">Dokumentasi Visual</div><p style="margin:4px 0 0">Note IP di kanvas BUKAN hiasan — ini dokumentasi yang dinilai di portfolio. Engineer yang topologinya "bercerita" selalu lebih dipercaya.</p></div>`,
      terms: [],
      diagram: `<pre>           TOPOLOGI FINAL LAB 16

   192.168.20.0/24            10.0.0.0/30           192.168.30.0/24
   [VPCS-Off1 .10]--\    [R1 eth3 .1]--[R2 eth1 .2]    [SW2]--[VPCS-Srv1 .10]
   [VPCS-Off2 .11]---[SW1]                                  |
   [R1 eth2 .1]------/                                [R2 eth2 .1]
   [R1 eth4]--[NAT]--internet

   R1: gateway OFFICE (.20.1) + router backbone
   R2: gateway SERVER (.30.1)</pre>`,
      scenario: 'Review topologi peserta: yang kabelnya semrawut butuh 10 menit dipahami; yang rapi + note IP langsung "lulus review". Kerapian adalah komunikasi.',
      bestPractices: 'Kabel lurus, node sejajar, note IP — perlakukan kanvas seperti diagram dokumentasi.',
      security: 'Pastikan tidak ada Cloud node nyasar yang mem-bridge lab ke LAN nyata tanpa sengaja.',
      challenge: 'Selesaikan pengkabelan dan buat snapshot topologi-dasar.',
      interviewQ: 'Q: "Mengapa topologi diberi note IP?" — A: Sebagai dokumentasi hidup — siapa pun (termasuk diri sendiri 6 bulan lagi) langsung paham desain tanpa membuka tiap device.',
      quiz: [
        { q: 'Segmen 10.0.0.0/30 dipakai untuk…', options: ['LAN office', 'Link point-to-point R1–R2 (hanya butuh 2 host)', 'Internet', 'Management'], answer: 1, explain: '/30 = 2 host usable — pas untuk link antar 2 router, hemat alamat.' },
        { q: 'Kapan membuat snapshot "topologi-dasar"?', options: ['Di akhir project', 'Setelah pengkabelan benar, sebelum konfigurasi', 'Tidak perlu', 'Tiap jam'], answer: 1, explain: 'Jaring pengaman sebelum fase konfigurasi — kabel benar adalah fondasi.' },
        { q: 'Fungsi note IP di kanvas adalah…', options: ['Hiasan', 'Dokumentasi desain yang terbaca langsung', 'Syarat GNS3', 'Mempercepat simulasi'], answer: 1, explain: 'Dokumentasi visual — bagian dari standar portfolio.' }
      ]
    },
    {
      id: '16.6',
      title: 'Configure Interfaces',
      body: `<p>Memberi identitas tiap interface: nama, comment, dan menonaktifkan yang tak terpakai.</p><h3>Objective</h3><p>Semua interface R1/R2 bernama jelas dan yang tak terpakai disabled.</p><h3>Configuration (R1 — via console)</h3><pre>[admin@R1] &gt; /interface set ether1 comment="MGMT"
[admin@R1] &gt; /interface set ether2 name=LAN-OFFICE comment="ke SW1 VLAN20"
[admin@R1] &gt; /interface set ether3 name=TO-R2 comment="backbone 10.0.0.0/30"
[admin@R1] &gt; /interface set ether4 name=WAN comment="ke NAT internet"
# Alasan: nama = dokumentasi yang terbaca di SEMUA perintah berikutnya
# (/ip address print, /interface monitor). "ether3" tidak bercerita;
# "TO-R2" langsung menjelaskan. Lakukan di R2 dengan pola sama.</pre><h3>Verification</h3><pre>[admin@R1] &gt; /interface print
# Pastikan: nama & comment tampil, flag R pada link yang terkabel.</pre><h3>Failure Injection</h3><p>Disable interface TO-R2 di R1.</p><h3>Troubleshooting</h3><p>Gejala (nanti): R1–R2 tak saling ping. Diagnosis: /interface print → flag X pada TO-R2.</p><h3>Fix</h3><p><code>/interface enable TO-R2</code>.</p><h3>Final Verification</h3><p>Semua interface terpakai ber-flag R; tak terpakai disabled.</p><div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di lab, rename interface bebas. Di production dengan monitoring (Zabbix), rename interface <b>merusak</b> item monitoring yang merujuk nama lama — koordinasikan dengan tim monitoring sebelum rename.</p></div>`,
      terms: [],
      scenario: 'NOC menerima alert "interface down: ether3". Karena bernama TO-R2, operator langsung tahu itu backbone ke R2 — bukan menebak-nebak. Nama yang baik mempercepat MTTR.',
      bestPractices: 'Nama + comment di semua interface; dokumentasikan perubahan nama ke tim monitoring di production.',
      security: 'Interface tak terpakai yang tetap enabled = port terbuka tanpa pengawasan — disable.',
      challenge: 'Konfigurasi interface R1 dan R2, verifikasi flag R di semua link.',
      interviewQ: 'Q: "Mengapa rename interface di production harus koordinasi?" — A: Sistem monitoring (Zabbix/SNMP) merujuk nama interface — rename sepihak merusak grafik dan alert.',
      quiz: [
        { q: 'Tujuan utama memberi nama pada interface adalah…', options: ['Agar keren', 'Dokumentasi — mempercepat troubleshooting dan keterbacaan semua perintah', 'Menambah kecepatan', 'Syarat lisensi'], answer: 1, explain: 'Nama deskriptif terbaca di print, log, dan alert monitoring.' },
        { q: 'Gejala interface ter-disable adalah…', options: ['Flag R', 'Flag X pada /interface print', 'Tidak ada gejala', 'Router reboot'], answer: 1, explain: 'X = disabled; link yang seharusnya up tapi X = tersangka utama.' },
        { q: 'Risiko rename interface di production adalah…', options: ['Tidak ada', 'Merusak referensi monitoring yang memakai nama lama', 'Lisensi hangus', 'VLAN hilang'], answer: 1, explain: 'Koordinasikan dengan tim monitoring sebelum rename di production.' }
      ]
    },
    {
      id: '16.7',
      title: 'Configure IP',
      body: `<p>Memasang IP di semua interface sesuai IP plan — fondasi Layer 3.</p><h3>Objective</h3><p>Tiap interface punya IP benar; connected route terbentuk otomatis.</p><h3>Configuration</h3><pre># R1
[admin@R1] &gt; /ip address add address=192.168.20.1/24 interface=LAN-OFFICE comment="GW OFFICE"
[admin@R1] &gt; /ip address add address=10.0.0.1/30 interface=TO-R2 comment="backbone ke R2"
[admin@R1] &gt; /ip dhcp-client add interface=WAN disabled=no comment="dari NAT GNS3"
# Alasan: .1 = konvensi gateway (konsisten Part 01/13); /30 untuk
# point-to-point (hemat); WAN via DHCP client karena NAT GNS3
# yang membagikan IP (seperti ISP).

# R2
[admin@R2] &gt; /ip address add address=192.168.30.1/24 interface=LAN-SERVER comment="GW SERVER"
[admin@R2] &gt; /ip address add address=10.0.0.2/30 interface=TO-R1 comment="backbone ke R1"

# VPCS
PC1&gt; ip 192.168.20.10/24 192.168.20.1
SRV1&gt; ip 192.168.30.10/24 192.168.30.1</pre><h3>Verification</h3><pre>[admin@R1] &gt; /ip address print   # NETWORK benar? interface benar?
[admin@R1] &gt; /ip route print      # connected (ADC) untuk tiap subnet?
PC1&gt; ping 192.168.20.1          # gateway sendiri HARUS reply</pre><h3>Expected Output</h3><p>Ping gateway &lt;1ms; tabel route R1 menampilkan 192.168.20.0/24 dan 10.0.0.0/30 sebagai ADC.</p><h3>Failure Injection</h3><p>Salah ketik mask di R1: 10.0.0.1/24 bukan /30.</p><h3>Troubleshooting</h3><p>Gejala: ping R1–R2 kadang aneh / route tumpang tindih. Diagnosis: /ip address print → kolom NETWORK = 10.0.0.0 bukan yang diharapkan untuk /30? (Sebenarnya /24 tetap "jalan" tapi salah desain.) Perbaiki ke /30.</p><h3>Fix & Final Verification</h3><p>Koreksi mask; ulangi ping gateway + cek route table.</p>`,
      terms: [],
      scenario: 'Junior salah mask /16 di backbone — routing "berhasil" tapi tabel penuh route aneh. Senior menunjuk kolom NETWORK di print: "baca kolom ini selalu".',
      bestPractices: 'Verifikasi kolom NETWORK setiap add; DHCP client hanya untuk sisi "ISP" (NAT).',
      security: 'IP management jangan satu subnet dengan user — sudah dipisahkan via desain (VLAN 99 di topologi penuh).',
      challenge: 'Pasang semua IP, verifikasi connected route dan ping gateway dari tiap VPCS.',
      interviewQ: 'Q: "Mengapa link point-to-point memakai /30?" — A: Hanya butuh 2 host — hemat alamat dan tabel route lebih bersih; /24 di link P2P adalah pemborosan dan sumber kebingungan.',
      quiz: [
        { q: 'Setelah IP dipasang, route connected muncul…', options: ['Setelah reboot', 'Otomatis (ADC)', 'Harus ditulis manual', 'Setelah 5 menit'], answer: 1, explain: 'RouterOS membuat connected route otomatis untuk subnet yang menempel.' },
        { q: 'Interface WAN ke NAT GNS3 memakai…', options: ['IP static', 'DHCP client — menerima IP dari NAT GNS3 seperti dari ISP', 'Tidak perlu IP', 'PPPoE'], answer: 1, explain: 'NAT GNS3 bertindak sebagai "ISP" yang membagikan IP via DHCP.' },
        { q: 'Verifikasi pertama setelah pasang IP adalah…', options: ['Ping 8.8.8.8', 'Ping gateway sendiri + cek /ip address print', 'Restart', 'Cabut kabel'], answer: 1, explain: 'Pastikan Layer 3 lokal benar sebelum menguji tujuan jauh.' }
      ]
    },
    {
      id: '16.8',
      title: 'Configure Routing',
      body: `<p>Menghubungkan dua dunia: R1 harus tahu jalan ke 192.168.30.0/24 dan sebaliknya.</p><h3>Objective</h3><p>PC office bisa ping server dan sebaliknya (routing dua arah).</p><h3>Configuration</h3><pre># R1: "untuk mencapai SERVER (di balik R2), lewat 10.0.0.2"
[admin@R1] &gt; /ip route add dst-address=192.168.30.0/24 gateway=10.0.0.2 comment="SERVER via R2"

# R2: "untuk mencapai OFFICE (di balik R1), lewat 10.0.0.1"
[admin@R2] &gt; /ip route add dst-address=192.168.20.0/24 gateway=10.0.0.1 comment="OFFICE via R1"

# R1: default route ke internet via NAT
[admin@R1] &gt; /ip route add dst-address=0.0.0.0/0 gateway=<IP-dari-DHCP> comment="internet via NAT"
# Alasan: gateway HARUS IP next-hop yang satu subnet dengan R1
# (IP yang diterima DHCP client di WAN). Cek via /ip dhcp-client print.

# R2 butuh internet? Lewat R1:
[admin@R2] &gt; /ip route add dst-address=0.0.0.0/0 gateway=10.0.0.1 comment="internet via R1"
# + di R1: masquerade agar IP privat bisa keluar:
[admin@R1] &gt; /ip firewall nat add chain=srcnat out-interface=WAN action=masquerade comment="lab internet"</pre><h3>Verification</h3><pre>[admin@R1] &gt; /ip route print   # flag A S pada route baru?
PC1&gt; ping 192.168.30.10       # office → server
SRV1&gt; ping 192.168.20.10      # server → office (dua arah!)</pre><h3>Failure Injection</h3><p>Hapus route pulang di R2 (ke 192.168.20.0/24).</p><h3>Troubleshooting</h3><p>Gejala: PC1 ping SRV1 gagal <b>padahal</b> route di R1 ada. Diagnosis: cek /ip route print di R2 — route pulang hilang. Request sampai, reply nyasar.</p><h3>Fix</h3><p>Tambah kembali route pulang di R2.</p><h3>Final Verification</h3><p>Ping dua arah OK; <code>/tool traceroute</code> menunjukkan hop R1→R2.</p><div class="callout blue"><div class="t">Pelajaran Abadi</div><p style="margin:4px 0 0">Kasus "pergi bisa, pulang gagal" adalah 50% tiket routing di dunia nyata. Selalu verifikasi <b>dua arah</b>.</p></div>`,
      terms: [],
      scenario: 'Cabang baru tidak bisa akses aplikasi pusat. Ternyata route di pusat belum ada untuk subnet cabang baru — request user sampai, reply tidak tahu pulang. Satu baris static route, 2 jam downtime selesai.',
      bestPractices: 'Selalu uji dua arah; beri comment jelas di tiap static route.',
      security: 'Default route 0.0.0.0/0 yang salah arah bisa membuang traffic internet ke blackhole — verifikasi gateway-nya.',
      challenge: 'Lakukan failure injection route pulang, dokumentasikan gejala persisnya, lalu fix.',
      interviewQ: 'Q: "Ping satu arah berhasil, arah sebaliknya gagal. Diagnosis?" — A: Route pulang hilang di sisi tujuan — cek /ip route print di router tujuan.',
      quiz: [
        { q: 'Agar PC office mencapai server di balik R2, R1 butuh…', options: ['NAT saja', 'Static route dst 192.168.30.0/24 via 10.0.0.2', 'DHCP baru', 'Tidak butuh apa-apa'], answer: 1, explain: 'Subnet jauh tidak otomatis dikenal — tulis static route ke next-hop R2.' },
        { q: 'Gejala route pulang hilang adalah…', options: ['Kedua arah gagal total', 'Request sampai tapi reply tidak kembali — ping gagal', 'Internet cepat', 'Tidak ada gejala'], answer: 1, explain: 'Asimetri routing: pergi OK, pulang nyasar. Verifikasi dua arah selalu.' },
        { q: 'Masquerade di R1 dibutuhkan agar…', options: ['Routing lebih cepat', 'IP privat lab bisa keluar ke internet via NAT', 'DHCP jalan', 'Tidak dibutuhkan'], answer: 1, explain: 'IP privat tidak routable di internet — srcnat/masquerade menerjemahkannya ke IP WAN.' }
      ]
    },
    {
      id: '16.9',
      title: 'Test Connectivity',
      body: `<p>Matriks pengujian end-to-end: dari setiap titik ke setiap titik.</p><h3>Objective</h3><p>Semua jalur yang didesain terbukti jalan; yang seharusnya diblokir terbukti diblokir.</p><h3>Configuration (Test Plan)</h3><pre>Matriks uji (tandai OK/GAGAL + latency):
1. PC1 → gateway sendiri (192.168.20.1)      [Layer 3 lokal]
2. PC1 → R2 backbone (10.0.0.2)              [routing 1 hop]
3. PC1 → SRV1 (192.168.30.10)                [inter-subnet dua router]
4. SRV1 → PC1                                [arah pulang]
5. PC1 → 8.8.8.8                             [internet via NAT]
6. PC1 → traceroute 192.168.30.10            [verifikasi hop]</pre><h3>Verification — Expected Output</h3><pre>PC1&gt; ping 192.168.30.10
84 bytes from 192.168.30.10 icmp_seq=1 ttl=62 time=2.1 ms
# ttl=62: 64 - 2 hop (R1, R2) = bukti melewati 2 router!

PC1&gt; trace 192.168.30.10
 1  192.168.20.1   (R1)
 2  10.0.0.2       (R2)
 3  192.168.30.10  (tujuan)</pre><h3>Failure Injection</h3><p>Disable interface TO-R2 di R1 (simulasi kabel backbone putus).</p><h3>Troubleshooting</h3><p>Gejala: uji 2,3,4,6 gagal; uji 1,5 OK. Diagnosis berlapis: /interface print (X pada TO-R2) → itu Layer 1/2! Pola "yang lewat backbone gagal, yang lokal OK" = petunjuk lokasi.</p><h3>Fix</h3><p>Enable kembali interface.</p><h3>Final Verification</h3><p>Ulangi matriks 1–6: semua OK. Dokumentasikan di troubleshooting.md (portfolio).</p><div class="callout"><div class="t">Membaca Pola Kegagalan</div><p style="margin:4px 0 0">Jangan cek acak — <b>petakan</b> mana yang gagal vs berhasil. Polanya menunjuk lokasi: semua via R2 gagal = backbone; satu tujuan gagal = host/tujuan; semua gagal = lokal.</p></div>`,
      terms: [['Matriks uji', 'Daftar pengujian terstruktur dari tiap titik ke tiap titik.'], ['TTL', 'Time To Live — berkurang 1 tiap hop; bisa dipakai menghitung hop.']],
      scenario: 'NOC memakai matriks serupa saat serah terima site baru: 20 titik uji, semua harus OK sebelum site dinyatakan "live". Tanpa matriks, serah terima = formalitas.',
      bestPractices: 'Uji berlapis (lokal → 1 hop → multi-hop → internet); dokumentasikan hasil sebagai bukti.',
      security: 'Catat juga yang SEHARUSNYA gagal (jika ada policy deny) — verifikasi negatif sama pentingnya.',
      challenge: 'Jalankan matriks 1–6, catat hasilnya dalam tabel. Lakukan failure injection dan catat pola kegagalannya.',
      interviewQ: 'Q: "Bagaimana kamu memastikan jaringan baru benar-benar siap production?" — A: Matriks uji end-to-end berlapis (lokal, antar-segmen, internet, dua arah) + verifikasi negatif untuk policy deny — semua terdokumentasi.',
      quiz: [
        { q: 'TTL 62 pada ping dari PC (default TTL 64) menunjukkan…', options: ['Error', 'Melewati 2 hop router (64-2)', 'Jaringan lambat', 'Packet rusak'], answer: 1, explain: 'Tiap router mengurangi TTL 1 — selisih 2 = 2 hop (R1, R2).' },
        { q: 'Pola "yang via backbone gagal, yang lokal OK" menunjuk ke…', options: ['Internet', 'Link/jalur backbone R1–R2', 'PC rusak', 'DNS'], answer: 1, explain: 'Petakan gagal vs berhasil — irisan kegagalan adalah lokasi masalah.' },
        { q: 'Traceroute dalam matriks uji berfungsi untuk…', options: ['Mempercepat ping', 'Verifikasi jalur hop sesuai desain', 'Menggantikan ping', 'Mengukur bandwidth'], answer: 1, explain: 'Traceroute membuktikan packet melewati hop yang diharapkan (R1→R2), bukan jalan pintas.' }
      ]
    },
    {
      id: '16.10',
      title: 'Capture Traffic',
      body: `<p>Melihat packet yang sebenarnya lewat — bukti final bahwa teori dan praktik cocok.</p><h3>Objective</h3><p>Menangkap dan membaca ICMP ping antar-VLAN di Wireshark.</p><h3>Configuration</h3><ol><li>Klik kanan link R1 eth3 ↔ R2 eth1 → Start capture → pilih interface.</li><li>Dari PC1: <code>ping 192.168.30.10</code>.</li><li>Amati packet di Wireshark; filter <code>icmp</code>.</li></ol><h3>Verification — Yang Harus Terlihat</h3><pre>Frame:  Ethernet II, Src: MAC_R1_eth3, Dst: MAC_R2_eth1
       → bukti Layer 2: antar-router pakai MAC tetangga langsung
IPv4:   Src: 192.168.20.10, Dst: 192.168.30.10
       → bukti Layer 3: IP end-to-end TIDAK berubah (hanya MAC yang
         ditulis ulang tiap hop — konsep inti routing!)
ICMP:   Echo request → Echo reply (berpasangan)</pre><h3>Failure Injection</h3><p>Ping ke IP yang tidak ada (192.168.30.99).</p><h3>Troubleshooting</h3><p>Amati di capture: ARP request "who has 192.168.30.99?" tanpa jawaban → R2 mengirim ICMP Destination Unreachable (bila ada route) atau request menggantung. Ini cara membaca "bukti" vs menebak.</p><h3>Fix</h3><p>Tidak ada yang rusak — ini eksperimen observasi. Stop capture.</p><h3>Final Verification</h3><p>Screenshot capture tersimpan; bisa menjelaskan 3 field (MAC src/dst, IP src/dst, ICMP type).</p><div class="callout blue"><div class="t">Skill Paling Berharga</div><p style="margin:4px 0 0">Kemampuan membaca capture membedakan engineer yang <b>menebak</b> dari yang <b>membuktikan</b>. Setiap klaim troubleshooting ("packet sampai ke R2") harus bisa dibuktikan di capture.</p></div>`,
      terms: [['Packet capture', 'Perekaman packet yang lewat sebuah link untuk dianalisis.'], ['Wireshark', 'Aplikasi analisis packet — standar industri.']],
      diagram: `<pre>           MEMBACA CAPTURE PING

   [PC1 .20.10] --&gt; [R1] --capture di sini--&gt; [R2] --&gt; [SRV1 .30.10]

   Packet yang tertangkap (R1→R2):
   +------------------------------------------+
   | Eth: src=MAC_R1  dst=MAC_R2  (per-hop!)  |
   | IP:  src=192.168.20.10 dst=192.168.30.10 |
   |      (end-to-end, TIDAK berubah)         |
   | ICMP: echo request (type 8)              |
   +------------------------------------------+
   Pelajaran: MAC ditulis ulang tiap hop, IP tetap.</pre>`,
      scenario: 'Dua engineer berdebat "packet sampai atau tidak ke R2". Yang satu menebak dari log, yang satu membuka capture — debat selesai dalam 1 menit. Capture adalah wasit.',
      bestPractices: 'Selalu filter (icmp, ip.addr==x) agar tidak tenggelam dalam ribuan packet; simpan capture penting.',
      security: 'File capture bisa berisi password/data sensitif (telnet, HTTP) — simpan aman, jangan share mentah.',
      challenge: 'Capture ping, temukan 1 echo request + 1 echo reply, screenshot dan anotasi 3 field-nya untuk portfolio.',
      interviewQ: 'Q: "Apa yang berubah dan tidak berubah pada packet saat melewati router?" — A: MAC source/destination ditulis ulang tiap hop (per-hop); IP source/destination end-to-end tidak berubah; TTL berkurang 1.',
      quiz: [
        { q: 'Pada capture ping R1→R2, MAC destination adalah…', options: ['MAC PC1', 'MAC R2 (tetangga langsung)', 'MAC SRV1', 'Broadcast'], answer: 1, explain: 'Frame Layer 2 selalu ke tetangga langsung (next-hop); MAC ditulis ulang tiap hop.' },
        { q: 'IP source/destination pada packet yang di-routing…', options: ['Berubah tiap hop', 'Tetap end-to-end (tidak berubah)', 'Dihapus router', 'Diacak'], answer: 1, explain: 'Inti routing: IP end-to-end tetap, yang berubah hanya enkapsulasi Layer 2 per hop.' },
        { q: 'Cara memulai capture di GNS3 adalah…', options: ['Klik kanan node', 'Klik kanan pada link → Start capture', 'Ping dulu', 'Otomatis'], answer: 1, explain: 'Capture dipasang pada link — Wireshark terbuka otomatis.' }
      ]
    }
  ]
};
