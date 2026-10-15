import type { Part } from './types';

export const part14: Part = {
  id: '14',
  number: 'PART 14',
  title: 'MikroTik CHR',
  phaseId: 'fase-3',
  description: 'Cloud Hosted Router: RouterOS sebagai virtual machine — instalasi, networking, disk, lisensi, dan troubleshooting.',
  repoFolder: 'part-14-mikrotik-chr',
  objectives: [
    'Menjelaskan apa itu CHR dan kapan memilihnya dibanding hardware fisik.',
    'Menginstal CHR di VirtualBox, VMware, dan GNS3.',
    'Mengonfigurasi networking, disk, dan interface CHR dengan benar.',
    'Memahami model lisensi CHR dan batasan versi trial.',
    'Melakukan troubleshooting masalah umum CHR (boot, network, performa).'
  ],
  prerequisites: 'Part 13 (RouterOS). Komputer dengan virtualisasi aktif (VT-x/AMD-V) dan RAM minimal 8 GB.',
  subbabs: [
    {
      id: '14.1',
      title: 'Apa Itu CHR?',
      body: `<p><b>CHR (Cloud Hosted Router)</b> adalah RouterOS yang dikemas sebagai <b>virtual machine</b> — file image (VMDK, VHDX, VDI, qcow2) yang dijalankan di hypervisor seperti VirtualBox, VMware, KVM, atau di cloud (AWS, GCP). Isinya 100% RouterOS asli; yang berbeda hanya "badannya" virtual, bukan hardware fisik.</p><h3>Mengapa CHR Ada?</h3><ul><li><b>Belajar tanpa hardware:</b> seluruh lab Part 13–18 berjalan di CHR — nol rupiah perangkat.</li><li><b>Router virtual di cloud:</b> perusahaan menyewa CHR di cloud sebagai VPN concentrator atau router antar-VPC.</li><li><b>Testing aman:</b> coba konfigurasi berisiko di CHR, snapshot, rollback — tanpa menyentuh production.</li><li><b>Skala:</b> butuh 10 router untuk simulasi? Clone 10 VM dalam menit.</li></ul><h3>CHR dalam Peta OSI & Lab</h3><p>Secara fungsi jaringan, CHR identik dengan RouterBOARD: Layer 2–3 penuh (routing, firewall, VLAN, VPN). Bedanya ada di <b>Layer 1</b>: "kabel" CHR adalah virtual NIC yang dicolok ke virtual switch hypervisor — konsep yang dibahas tuntas di 14.6.</p><div class="callout blue"><div class="t">Satu Skill, Semua Platform</div><p style="margin:4px 0 0">Perintah yang kamu kuasai di CHR (<code>/ip address</code>, firewall, dll.) berlaku 1:1 di RouterBOARD fisik. Perusahaan yang memakai hardware MikroTik akan menganggap skill CHR-mu langsung pakai.</p></div>`,
      terms: [['CHR', 'RouterOS versi virtual machine untuk hypervisor dan cloud.'], ['Hypervisor', 'Software yang menjalankan VM: VirtualBox, VMware, KVM, Hyper-V.'], ['Image', 'File cetakan VM (VMDK/VDI/qcow2) — "installer" versi virtual.']],
      diagram: `<pre>              CHR = RouterOS VIRTUAL

   Fisik:   [RouterBOARD] --kabel--> [Switch]
                 |
              RouterOS

   Virtual: [  VM CHR  ] --vNIC--> [Virtual Switch] --&gt; [VM lain / host]
                 |
              RouterOS (SAMA PERSIS)

   Hypervisor: VirtualBox | VMware | KVM | Hyper-V | Cloud
   Image: VDI | VMDK | VHDX | qcow2  (pilih sesuai hypervisor)</pre>`,
      scenario: 'Mahasiswa network engineering tidak punya budget beli 3 router. Ia install 3 CHR di laptop, hubungkan via GNS3, dan mengerjakan seluruh tugas routing + firewall — lulus praktikum tanpa menyentuh hardware.',
      bestPractices: 'Pakai CHR untuk semua eksperimen dan destructive testing; hardware fisik hanya untuk final validation.',
      security: 'CHR trial tanpa lisensi tetap bisa diakses — jangan biarkan CHR lab terhubung ke internet tanpa firewall, ia bisa jadi batu loncatan.',
      challenge: 'Download image CHR dari mikrotik.com (pilih format sesuai hypervisor-mu) dan catat versi RouterOS-nya. Kita install di 14.3–14.5.',
      interviewQ: 'Q: "Apa itu CHR dan kapan perusahaan memakainya?" — A: RouterOS sebagai VM; dipakai untuk lab/testing, router virtual di cloud (VPN antar-VPC), dan simulasi skala besar tanpa hardware.',
      quiz: [
        { q: 'Apa itu MikroTik CHR?', options: ['Hardware router baru', 'RouterOS yang dikemas sebagai virtual machine', 'Aplikasi Android MikroTik', 'Kabel fiber MikroTik'], answer: 1, explain: 'CHR = Cloud Hosted Router: RouterOS penuh dalam bentuk VM image untuk hypervisor/cloud.' },
        { q: 'Perbedaan fungsi jaringan CHR vs RouterBOARD fisik adalah…', options: ['CHR tidak bisa routing', 'Tidak ada — fitur Layer 2–3 identik, beda di Layer 1 (fisik vs virtual)', 'CHR hanya untuk Wi-Fi', 'CHR tidak punya firewall'], answer: 1, explain: 'Satu RouterOS untuk semua platform; yang virtual hanya NIC/kabelnya.' },
        { q: 'Kegunaan utama CHR bagi pelajar adalah…', options: ['Main game', 'Lab dan eksperimen routing/firewall tanpa beli hardware', 'Menambah RAM laptop', 'Menggantikan ISP'], answer: 1, explain: 'CHR memungkinkan lab jaringan lengkap (multi-router) di satu laptop.' }
      ]
    },
    {
      id: '14.2',
      title: 'CHR vs MikroTik Hardware',
      body: `<p>Memilih antara CHR dan hardware fisik adalah keputusan arsitektur. Keduanya menjalankan RouterOS yang sama, tetapi berbeda di performa, keandalan, dan biaya.</p><div class="tblwrap"><table><tr><th>Aspek</th><th>CHR (Virtual)</th><th>RouterBOARD (Fisik)</th></tr><tr><td>Performa forwarding</td><td>Terbatas CPU host & virtual NIC (cukup untuk lab, &lt;1 Gbps realistis)</td><td>Hardware offload / chip switching — bisa line-rate Gbps</td></tr><tr><td>Keandalan</td><td>Tergantung host/hypervisor (reboot host = semua CHR mati)</td><td>Dedicated, uptime tahunan</td></tr><tr><td>Port fisik</td><td>Tidak ada — semua virtual</td><td>Port Ethernet/SFP nyata</td></tr><tr><td>Biaya</td><td>Gratis (trial) / lisensi murah; butuh server</td><td>Beli per unit (Rp 500rb–puluhan juta)</td></tr><tr><td>Skalabilitas lab</td><td>Clone puluhan router dalam menit</td><td>Beli & rack satu per satu</td></tr><tr><td>Cocok untuk</td><td>Lab, testing, router cloud, VPN hub</td><td>Production edge, kantor, ISP</td></tr></table></div><h3>Aturan Praktis</h3><ul><li><b>Belajar/eksperimen → CHR.</b> Tidak ada alasan beli hardware untuk Part 13–18.</li><li><b>Production dengan kabel fisik → hardware.</b> CHR tidak bisa dicolok kabel LAN kantor.</li><li><b>Router di cloud (VPC, VPN hub) → CHR.</b> Di cloud memang tidak ada hardware fisik untuk disewa per port.</li></ul><div class="callout"><div class="t">Jebakan Performa CHR</div><p style="margin:4px 0 0">Jangan benchmark fitur (mis. "firewall-ku kuat") di CHR lalu mengklaim angka yang sama di hardware — arsitektur CPU-nya beda. CHR untuk <b>kebenaran fungsi</b>, hardware untuk <b>angka performa</b>.</p></div>`,
      terms: [['Hardware offload', 'Pendelegasian proses switching ke chip khusus — hanya ada di hardware fisik.'], ['Line-rate', 'Kecepatan penuh sesuai kapasitas port (mis. 1 Gbps penuh).'], ['VPN hub', 'Titik pusat koneksi VPN dari banyak cabang — peran umum CHR di cloud.']],
      diagram: `<pre>        KAPAN PILIH APA?

   [Belajar / Lab / Destructive test] --&gt; CHR (gratis, clone cepat)
   [Router di cloud / antar-VPC]      --&gt; CHR (tidak ada fisik di cloud)
   [Kantor / ISP / colok kabel]       --&gt; RouterBOARD fisik
   [Butuh throughput Gbps penuh]      --&gt; RouterBOARD fisik

   Skill konfigurasi: SAMA di keduanya (satu RouterOS).</pre>`,
      scenario: 'Startup memakai CHR di cloud sebagai VPN hub untuk 10 karyawan remote — Rp 0 hardware. Kantor pusatnya tetap memakai RB4011 fisik karena butuh colok kabel fiber ISP dan Wi-Fi. Keputusan tepat di dua sisi.',
      bestPractices: 'Desain dan uji di CHR, lalu deploy konfigurasi yang sama ke hardware — pisahkan validasi fungsi dari validasi performa.',
      security: 'CHR di cloud terekspos ke internet sejak detik pertama — hardening (Part 13.14) harus dilakukan SEBELUM menghubungkan ke jaringan publik, bukan sesudah.',
      challenge: 'Buat tabel keputusan sendiri: 3 skenario di tempat kerjamu — untuk tiap skenario pilih CHR atau hardware dan tulis alasannya.',
      interviewQ: 'Q: "Kapan kamu memilih CHR dibanding RouterBOARD fisik?" — A: Untuk lab/testing, router virtual di cloud, dan VPN hub — di mana tidak ada kebutuhan port fisik. Untuk production yang butuh kabel fisik dan throughput line-rate, pilih hardware.',
      quiz: [
        { q: 'Keunggulan utama CHR dibanding hardware untuk belajar adalah…', options: ['Lebih cepat dari hardware termahal', 'Gratis dan bisa di-clone banyak dalam menit tanpa beli perangkat', 'Tidak butuh listrik', 'Bisa colok kabel fisik'], answer: 1, explain: 'CHR menghilangkan barrier biaya dan waktu untuk lab multi-router.' },
        { q: 'Mengapa CHR tidak cocok sebagai router utama kantor dengan 500 user?', options: ['Tidak ada firewall', 'Performa forwarding terbatas CPU host dan tidak ada port fisik', 'Tidak mendukung VLAN', 'Terlalu mahal'], answer: 1, explain: 'CHR tidak punya port fisik untuk kabel LAN dan throughput-nya tergantung host — production edge butuh hardware.' },
        { q: 'Peran yang TEPAT untuk CHR di perusahaan adalah…', options: ['Switch access layer', 'VPN hub / router virtual di cloud dan lab testing', 'Access point Wi-Fi', 'Pengganti kabel fiber'], answer: 1, explain: 'Di cloud tidak ada hardware fisik; CHR ideal sebagai router virtual, VPN concentrator, dan lab.' }
      ]
    },
    {
      id: '14.3',
      title: 'CHR di VirtualBox',
      body: `<p><b>VirtualBox</b> adalah hypervisor gratis milik Oracle — pilihan paling mudah untuk menjalankan CHR di laptop. Kita install CHR sebagai VM, lalu menghubungkannya ke jaringan lab.</p><h3>Langkah Instalasi</h3><ol><li>Download image CHR format <b>VDI</b> dari mikrotik.com → download → sesuaikan versi (v7 stable).</li><li>VirtualBox → New → Type: Linux, Version: Other Linux (64-bit) → RAM <b>256–512 MB</b> (CHR ringan!).</li><li>Hard disk: <b>Use an existing virtual hard disk file</b> → pilih file .vdi CHR.</li><li>Settings → Network → Adapter 1: <b>Host-only</b> (untuk management dari laptop) — tambah Adapter 2+ berjenis <b>Internal Network</b> untuk antar-CHR.</li><li>Start VM → login <code>admin</code> tanpa password → <code>/system identity set name=CHR1</code>.</li></ol><h3>Jenis Network VirtualBox — Pahami!</h3><div class="tblwrap"><table><tr><th>Mode</th><th>Arti</th><th>Pakai Untuk</th></tr><tr><td>Host-only</td><td>VM ↔ laptop (host) saja</td><td>Management (WinBox/SSH dari laptop)</td></tr><tr><td>Internal Network</td><td>VM ↔ VM saja (isolasi)</td><td>Link antar-CHR / ke GNS3</td></tr><tr><td>Bridged</td><td>VM seperti device fisik di LAN</td><td>Hati-hati: CHR dapat IP dari LAN asli</td></tr><tr><td>NAT</td><td>VM bisa internet via host</td><td>Simulasi "internet" untuk CHR</td></tr></table></div><div class="callout"><div class="t">Alasan RAM Kecil Cukup</div><p style="margin:4px 0 0">CHR butuh RAM kecil (256 MB) karena RouterOS ramping — tidak ada GUI desktop di dalamnya. Memberi 4 GB ke CHR adalah pemborosan; simpan RAM untuk menjalankan BANYAK CHR sekaligus.</p></div>`,
      terms: [['VirtualBox', 'Hypervisor gratis untuk menjalankan VM di laptop.'], ['Host-only', 'Jaringan virtual VM↔host saja — untuk management.'], ['Internal Network', 'Jaringan virtual antar-VM yang terisolasi — untuk link lab.']],
      diagram: `<pre>           CHR DI VIRTUALBOX

   [Laptop]
     |
     +-- vboxnet0 (Host-only, 192.168.56.0/24)
     |       |
     |   [CHR1: ether1 = 192.168.56.10]  &lt;-- management
     |
     +-- intnet-lab (Internal Network)
             |
     [CHR1: ether2] &lt;--&gt; [CHR2: ether2]   (link antar router,
                                            terisolasi dari laptop)

   Adapter 1 = management, Adapter 2+ = lab.</pre>`,
      scenario: 'Peserta training online hanya punya laptop. Dengan VirtualBox + 2 CHR (Host-only + Internal Network), ia mengikuti seluruh materi routing tanpa hardware — instruktur memandunya via screen share.',
      bestPractices: 'Selalu pisahkan adapter management (Host-only) dari adapter lab (Internal) sejak VM pertama dibuat.',
      security: 'Jangan pakai mode Bridged untuk CHR lab kecuali paham risikonya — CHR akan muncul di LAN asli dan bisa mengganggu (mis. DHCP server liar).',
      challenge: 'Install 1 CHR di VirtualBox dengan 2 adapter (Host-only + Internal). Login via console, beri identity, dan catat MAC tiap adapter.',
      interviewQ: 'Q: "Mengapa CHR di VirtualBox diberi RAM kecil saja?" — A: RouterOS ramping tanpa desktop GUI; 256–512 MB cukup. RAM lebih baik dipakai untuk menjalankan banyak CHR paralel.',
      quiz: [
        { q: 'Mode network VirtualBox yang tepat untuk management CHR dari laptop adalah…', options: ['Internal Network', 'Host-only', 'Bridged', 'NAT'], answer: 1, explain: 'Host-only menghubungkan VM↔host saja — ideal dan aman untuk management.' },
        { q: 'Fungsi Internal Network pada adapter lab adalah…', options: ['Akses internet', 'Menghubungkan antar-VM secara terisolasi', 'Management dari laptop', 'Backup otomatis'], answer: 1, explain: 'Internal Network = switch virtual khusus antar-VM, terisolasi dari host dan LAN.' },
        { q: 'Risiko memakai mode Bridged untuk CHR lab adalah…', options: ['CHR jadi lambat', 'CHR muncul di LAN asli dan bisa mengganggu (mis. DHCP liar)', 'Tidak bisa install', 'Lisensi hangus'], answer: 1, explain: 'Bridged menaruh VM sejajar device fisik — salah konfigurasi berdampak ke jaringan nyata.' }
      ]
    },
    {
      id: '14.4',
      title: 'CHR di VMware',
      body: `<p><b>VMware</b> (Workstation/Fusion untuk laptop, ESXi untuk server) adalah hypervisor dengan performa virtual networking terbaik — pilihan umum di perusahaan. Prinsip instalasi CHR sama dengan VirtualBox, beda istilah network-nya.</p><h3>Langkah Instalasi (Workstation)</h3><ol><li>Download image CHR format <b>VMDK</b>.</li><li>File → New Virtual Machine → Custom → OS: Other Linux 5.x kernel 64-bit → RAM 512 MB.</li><li>Hard disk: <b>Use an existing virtual disk</b> → pilih .vmdk CHR.</li><li>Network Adapter 1: <b>Host-only (VMnet1)</b> untuk management; tambah adapter dengan <b>Custom: VMnet2/VMnet3…</b> untuk segmen lab.</li><li>Power on → login admin → konfigurasi seperti biasa.</li></ol><h3>VMnet — Konsep Kuncinya</h3><p>VMware memakai <b>VMnet</b> (virtual switch): <b>VMnet0</b> = bridged, <b>VMnet1</b> = host-only, <b>VMnet8</b> = NAT, <b>VMnet2–7,9</b> = custom (bebas kamu definisikan). Untuk lab, buat VMnet custom per segmen: mis. VMnet2 = link R1–R2, VMnet3 = LAN office. Ini setara "kabel virtual" yang terisolasi.</p><div class="tblwrap"><table><tr><th>VMnet</th><th>Default</th><th>Peran di Lab</th></tr><tr><td>VMnet1</td><td>Host-only</td><td>Management semua CHR</td></tr><tr><td>VMnet2+</td><td>Custom</td><td>Satu VMnet = satu segmen/kabel lab</td></tr><tr><td>VMnet8</td><td>NAT</td><td>Simulasi internet keluar</td></tr></table></div><div class="callout blue"><div class="t">VMware vs VirtualBox untuk Lab</div><p style="margin:4px 0 0">VMware umumnya lebih stabil untuk banyak VM + GNS3 (lihat 15.5). VirtualBox gratis dan cukup untuk 2–4 CHR. Pilih berdasar kebutuhan; konfigurasi RouterOS-nya tetap sama.</p></div>`,
      terms: [['VMware Workstation/Fusion', 'Hypervisor desktop VMware untuk laptop.'], ['ESXi', 'Hypervisor VMware untuk server (bare-metal).'], ['VMnet', 'Virtual switch di VMware; satu VMnet custom = satu segmen lab terisolasi.']],
      diagram: `<pre>           CHR DI VMWARE

   [Laptop + VMware Workstation]
     |
     +-- VMnet1 (Host-only) --&gt; [CHR1 eth0: mgmt] [CHR2 eth0: mgmt]
     |
     +-- VMnet2 (custom)    --&gt; [CHR1 eth1] &lt;--&gt; [CHR2 eth1]  (link R1-R2)
     |
     +-- VMnet3 (custom)    --&gt; [CHR1 eth2] &lt;--&gt; [PC-VM / VPCS]
     |
     +-- VMnet8 (NAT)       --&gt; [CHR1 eth3] --&gt; internet (simulasi)

   Satu VMnet custom = satu "kabel" virtual.</pre>`,
      scenario: 'Perusahaan memakai VMware ESXi di server. Tim network menjalankan 6 CHR permanen sebagai lab staging — setiap change production diuji dulu di lab ini. VMnet custom meniru topologi kantor persis.',
      bestPractices: 'Beri nama VMnet custom sesuai fungsinya (catat di dokumentasi); jangan campur segmen lab dalam satu VMnet.',
      security: 'VMnet host-only/NAT tetap bisa dijangkau host — pastikan CHR lab tidak mem-bridge-kan traffic lab ke LAN kantor tanpa sengaja.',
      challenge: 'Buat VMnet2 custom di VMware, pasang 2 CHR dengan adapter di VMnet1 (mgmt) + VMnet2 (lab), lalu ping antar-CHR via IP lab.',
      interviewQ: 'Q: "Apa itu VMnet dan bagaimana kamu memakainya untuk lab?" — A: Virtual switch VMware; saya buat VMnet custom per segmen lab (satu VMnet = satu kabel/segmen terisolasi), VMnet1 untuk management.',
      quiz: [
        { q: 'VMnet1 secara default berfungsi sebagai…', options: ['Bridged', 'Host-only', 'NAT', 'Custom terisolasi'], answer: 1, explain: 'VMnet1 = host-only (VM↔host), VMnet8 = NAT, VMnet0 = bridged.' },
        { q: 'Untuk membuat segmen lab terisolasi baru di VMware, kamu memakai…', options: ['VMnet0', 'VMnet custom (mis. VMnet2) yang didefinisikan sendiri', 'VMnet8', 'Tidak bisa'], answer: 1, explain: 'VMnet2–7,9 bebas didefinisikan — satu VMnet custom = satu segmen lab.' },
        { q: 'Format image CHR yang tepat untuk VMware adalah…', options: ['VDI', 'VMDK', 'qcow2', 'ISO'], answer: 1, explain: 'VMDK adalah format disk native VMware; VDI untuk VirtualBox.' }
      ]
    },
    {
      id: '14.5',
      title: 'CHR di GNS3',
      body: `<p><b>GNS3</b> adalah simulator jaringan grafis — kanvas tempat kamu menggambar topologi dan menghubungkan device virtual (dibahas penuh di Part 15). CHR adalah "bintang utama" di GNS3: router MikroTik full-fitur yang bisa dihubungkan ke switch, cloud, dan VPCS.</p><h3>Alur Import CHR ke GNS3 (Garis Besar)</h3><ol><li>Siapkan image CHR format <b>qcow2</b> (format QEMU — engine yang dipakai GNS3).</li><li>GNS3 → Preferences → QEMU → QEMU VMs → New → beri nama <code>MikroTik-CHR</code>.</li><li>Pilih image qcow2, RAM 512 MB, NIC model <b>virtio-net</b> (alasan: driver paravirtual tercepat untuk VM).</li><li>Tambah node ke kanvas, klik kanan → Configure → tambah adapter sesuai topologi.</li><li>Start node → klik kanan → Console → login admin. Selesai — CHR hidup di topologi!</li></ol><p>Detail langkah-demi-langkah dipraktikkan di <b>Part 16</b> (lab gabungan GNS3+CHR). Di sini pahami konsepnya: GNS3 menjalankan CHR sebagai VM QEMU dan "mencolokkan kabel virtual" antar node.</p><div class="callout blue"><div class="t">Mengapa qcow2 + virtio?</div><p style="margin:4px 0 0"><b>qcow2</b> adalah format disk native QEMU (mendukung snapshot & thin provisioning — hemat disk). <b>virtio-net</b> adalah driver NIC paravirtual: VM "tahu" ia virtual sehingga transfer data jauh lebih cepat dibanding emulasi e1000.</p></div>`,
      terms: [['GNS3', 'Simulator jaringan grafis untuk merangkai topologi device virtual.'], ['QEMU', 'Emulator/virtualizer yang menjalankan CHR di dalam GNS3.'], ['qcow2', 'Format disk QEMU — mendukung snapshot dan hemat ruang.'], ['virtio-net', 'Driver NIC paravirtual tercepat untuk VM.']],
      diagram: `<pre>              CHR DI DALAM GNS3

   +--------------------------------------------------+
   | Kanvas GNS3                                      |
   |                                                  |
   |  [CHR-R1] ---- [Ethernet Switch] ---- [VPCS-1]   |
   |     |                                            |
   |     +------------ [Cloud/NAT] (ke internet)      |
   |                                                  |
   |  Tiap "kabel" = link virtual.                    |
   |  Tiap node CHR = VM QEMU (qcow2 + virtio-net).   |
   +--------------------------------------------------+
   Klik kanan node --&gt; Console = SSH/terminal ke CHR itu.</pre>`,
      scenario: 'Instruktur membuat topologi 4 CHR + 2 switch di GNS3, export sebagai project, dan membagikannya ke 30 peserta. Semua peserta mendapat lab identik — tanpa kirim hardware.',
      bestPractices: 'Gunakan template QEMU CHR sekali, lalu duplikasi node — jangan import image berulang kali.',
      security: 'Project GNS3 berisi konfigurasi (bisa ada password) — jangan share project mentah ke publik tanpa sanitasi (dibahas di Part 16 project).',
      challenge: 'Buka GNS3, masuk ke Preferences → QEMU, dan pastikan QEMU terdeteksi. Catat versinya — prasyarat Part 16.',
      interviewQ: 'Q: "Bagaimana GNS3 menjalankan CHR?" — A: Sebagai VM QEMU memakai image qcow2 dengan NIC virtio-net; GNS3 menghubungkan antar node dengan link virtual di kanvas topologi.',
      quiz: [
        { q: 'Format image CHR yang dipakai GNS3 adalah…', options: ['VDI', 'VMDK', 'qcow2', 'ISO'], answer: 2, explain: 'GNS3 menjalankan CHR via QEMU yang memakai format qcow2.' },
        { q: 'Mengapa NIC model virtio-net dipilih untuk CHR di GNS3?', options: ['Satu-satunya yang ada', 'Driver paravirtual — transfer data jauh lebih cepat dibanding emulasi', 'Lebih murah', 'Wajib oleh lisensi'], answer: 1, explain: 'virtio adalah paravirtual: VM sadar ia virtual sehingga I/O network jauh lebih efisien.' },
        { q: 'Cara mengakses console CHR yang berjalan di GNS3 adalah…', options: ['Klik kanan node → Console', 'Restart laptop', 'Via browser', 'Tidak bisa'], answer: 0, explain: 'Klik kanan node → Console membuka terminal langsung ke VM tersebut.' }
      ]
    },
    {
      id: '14.6',
      title: 'CHR Networking',
      body: `<p>Networking CHR = mengatur bagaimana <b>vNIC (virtual NIC)</b> CHR terhubung ke dunia luar. Konsep kuncinya: tiap adapter VM dicolok ke sebuah <b>virtual switch / segmen</b> di hypervisor — dan segmen itulah yang menentukan siapa bisa bicara dengan siapa.</p><h3>Pola Standar: 1 Adapter = 1 Peran</h3><div class="tblwrap"><table><tr><th>Adapter</th><th>Segmen Hypervisor</th><th>Peran</th><th>Contoh IP</th></tr><tr><td>ether1</td><td>Host-only / VMnet1</td><td>Management (WinBox/SSH dari laptop)</td><td>192.168.56.10/24</td></tr><tr><td>ether2</td><td>Internal / VMnet2</td><td>Link antar-CHR (backbone lab)</td><td>10.0.0.1/30</td></tr><tr><td>ether3</td><td>Internal / VMnet3</td><td>LAN lab (ke VPCS/switch GNS3)</td><td>192.168.20.1/24</td></tr><tr><td>ether4</td><td>NAT / VMnet8</td><td>Simulasi internet (opsional)</td><td>DHCP dari hypervisor</td></tr></table></div><h3>Aturan Mainnya</h3><ul><li><b>Satu segmen = satu broadcast domain.</b> Dua CHR di Internal Network yang sama bisa saling ping tanpa router — seperti dua PC satu switch.</li><li><b>Urutan adapter konsisten:</b> ether1 selalu management di SEMUA CHR. Konsistensi ini menyelamatkanmu saat troubleshooting jam 2 pagi.</li><li><b>MAC address:</b> tiap vNIC punya MAC virtual unik — tercatat di <code>/interface ethernet print</code>. Berguna untuk DHCP static lease.</li></ul><div class="callout"><div class="t">Jebakan: Adapter Tertukar</div><p style="margin:4px 0 0">Error klasik: IP management dipasang di ether2 (yang ternyata segmen lab). Gejala: WinBox tidak konek. Solusi: console hypervisor → <code>/ip address print</code> → cocokkan dengan segmen tiap adapter. Pencegahan: beri <b>comment</b> di tiap interface sesuai perannya.</p></div>`,
      terms: [['vNIC', 'Network Interface Card virtual — "kabel virtual" tiap adapter VM.'], ['Virtual switch/segmen', 'Switch virtual di hypervisor; satu segmen = satu broadcast domain.']],
      diagram: `<pre>           POLA NETWORKING CHR STANDAR

   [CHR-R1]
    |-- ether1 (mgmt)  --&gt; [Host-only] &lt;-- laptop WinBox
    |-- ether2 (lab)   --&gt; [Internal-A] &lt;--&gt; [CHR-R2 ether2]
    |-- ether3 (LAN)   --&gt; [Internal-B] &lt;--&gt; [VPCS / switch]
    |-- ether4 (inet)  --&gt; [NAT] --&gt; internet (simulasi)

   Aturan: ether1 = mgmt di SEMUA CHR. Selalu.</pre>`,
      scenario: 'Lab 3 CHR berantakan: tiap CHR urutan adapternya beda. Saat satu CHR perlu di-reboot, engineer salah cabut konfigurasi karena mengira ether2 = management. Sejak itu tim menerapkan standar "ether1 selalu management".',
      bestPractices: 'Standarkan urutan adapter di semua CHR dan beri comment per interface; dokumentasikan mapping adapter↔segmen.',
      security: 'Adapter management jangan pernah di-bridge ke segmen lab/user — pisahkan di level hypervisor, bukan hanya di firewall.',
      challenge: 'Gambar mapping adapter↔segmen untuk 2 CHR lab-mu di kertas, lalu verifikasi dengan /interface ethernet print (cocokkan MAC).',
      interviewQ: 'Q: "CHR tidak bisa diakses WinBox setelah ganti IP. Langkahmu?" — A: Buka console hypervisor, /ip address print, pastikan IP menempel di adapter segmen management; koreksi via console.',
      quiz: [
        { q: 'Satu segmen virtual (Internal Network/VMnet custom) setara dengan…', options: ['Satu kabel internet', 'Satu broadcast domain / switch virtual', 'Satu router', 'Satu firewall'], answer: 1, explain: 'VM dalam satu segmen bisa saling bicara Layer 2 langsung — seperti satu switch.' },
        { q: 'Mengapa disarankan ether1 selalu untuk management di semua CHR?', options: ['Wajib oleh MikroTik', 'Konsistensi mempercepat troubleshooting dan mencegah salah konfigurasi', 'Lebih cepat', 'Hemat lisensi'], answer: 1, explain: 'Standar yang konsisten menghilangkan tebakan saat darurat.' },
        { q: 'Gejala IP management terpasang di adapter yang salah adalah…', options: ['Internet lambat', 'WinBox/SSH tidak bisa konek padahal VM hidup', 'DHCP error', 'Tidak ada gejala'], answer: 1, explain: 'IP ada di segmen yang salah = tidak terjangkau dari laptop. Perbaiki via console hypervisor.' }
      ]
    },
    {
      id: '14.7',
      title: 'CHR Disk',
      body: `<p>CHR menyimpan RouterOS + konfigurasi di <b>virtual disk</b> kecil (umumnya 128 MB – 1 GB). Karena kecil, ada perilaku khusus yang wajib dipahami — terutama soal <b>kehilangan data</b>.</p><h3>Fakta Penting Disk CHR</h3><ul><li><b>Ukuran kecil:</b> image CHR ~128 MB. Jangan samakan dengan VM Windows puluhan GB.</li><li><b>qcow2 thin provisioning:</b> file hanya sebesar data aktual — snapshot murah dan cepat.</li><li><b>Tidak untuk file besar:</b> jangan simpan backup berukuran besar atau log bertahun-tahun di disk CHR.</li><li><b>Resize:</b> bisa diperbesar via hypervisor (lalu <code>/system reboot</code>), tapi jarang dibutuhkan untuk lab.</li></ul><h3>Backup — Karena Disk Bisa Hilang</h3><pre>[admin@CHR1] &gt; /system backup save name=chr1-sebelum-ospf
# Alasan: backup BINARY — restore hanya ke device yang sama/identik.
# Wajib dibuat SEBELUM eksperimen berisiko.

[admin@CHR1] &gt; /export file=chr1-config
# Alasan: export TEKS (script .rsc) — bisa dibaca manusia, diedit,
# dan di-apply ke CHR lain. Ini "dokumentasi hidup" konfigurasi.
# Praktik lab: /export setiap selesai satu milestone, simpan di laptop.</pre><div class="callout blue"><div class="t">Backup vs Export</div><p style="margin:4px 0 0"><b>Backup (.backup):</b> snapshot biner — restore cepat tapi hanya cocok di CHR yang sama. <b>Export (.rsc):</b> script teks — portable antar device, bisa di-version-control (Git!). Untuk portfolio GitHub (Part 16/18), yang di-upload adalah hasil <b>export</b>.</p></div>`,
      terms: [['Virtual disk', 'File yang berperan sebagai hard disk VM CHR.'], ['Thin provisioning', 'Alokasi disk sesuai pemakaian aktual — hemat ruang.'], ['Backup (.backup)', 'Cadangan biner RouterOS — restore hanya di device identik.'], ['Export (.rsc)', 'Cadangan teks berupa script — portable dan bisa masuk Git.']],
      diagram: `<pre>              DISK CHR & BACKUP

   [CHR virtual disk ~128MB]
    |-- RouterOS system
    |-- konfigurasi aktif
    |-- /system backup save  --&gt; chr1.backup (BINER, device sama)
    |-- /export file=...     --&gt; chr1-config.rsc (TEKS, portable)
                                        |
                                        v
                                   [laptop] --&gt; [GitHub portfolio]

   Aturan: /export setiap milestone. Simpan di luar VM.</pre>`,
      scenario: 'Peserta menghapus bridge yang salah dan lab-nya rusak total 10 menit sebelum demo. Untung ia punya chr1-sebelum-bridge.rsc — /import dalam 30 detik, demo terselamatkan.',
      bestPractices: 'Buat backup biner sebelum eksperimen berisiko; export teks setiap milestone dan simpan di luar VM (laptop/Git).',
      security: 'File .backup dan .rsc berisi hash password — jangan upload mentah ke repo publik tanpa sanitasi (ganti password/hash).',
      challenge: 'Lakukan /export di CHR-mu, download file .rsc ke laptop, buka dengan text editor dan temukan baris /ip address-mu.',
      interviewQ: 'Q: "Apa beda /system backup dan /export?" — A: Backup = biner, restore cepat tapi hanya di device identik; export = script teks, bisa dibaca/diedit/di-apply ke device lain dan masuk version control.',
      quiz: [
        { q: 'Untuk portfolio GitHub, format cadangan yang tepat adalah…', options: ['.backup (biner)', '.rsc dari /export (teks, portable)', 'Screenshot saja', 'Tidak perlu cadangan'], answer: 1, explain: 'Export teks bisa dibaca, di-review, dan di-version-control — ideal untuk portfolio.' },
        { q: 'Kapan membuat /system backup?', options: ['Setiap jam', 'Sebelum eksperimen berisiko sebagai titik rollback cepat', 'Tidak pernah', 'Hanya di production'], answer: 1, explain: 'Backup biner = snapshot instan untuk rollback cepat bila eksperimen gagal.' },
        { q: 'Mengapa file backup/export tidak boleh di-upload mentah ke repo publik?', options: ['Terlalu besar', 'Berisi hash password dan info sensitif', 'Format tidak didukung Git', 'Melanggar lisensi'], answer: 1, explain: 'File berisi kredensial/hash — sanitasi dulu sebelum publikasi.' }
      ]
    },
    {
      id: '14.8',
      title: 'CHR Interface',
      body: `<p>Di CHR, interface fisik (<code>ether1</code>…) sebenarnya adalah <b>vNIC</b> yang dicolok ke segmen hypervisor. Penamaan dan perilakunya sedikit berbeda dari hardware — pahami agar tidak bingung.</p><h3>Nama Interface di Tiap Hypervisor</h3><div class="tblwrap"><table><tr><th>Hypervisor</th><th>Nama di RouterOS</th><th>Catatan</th></tr><tr><td>VirtualBox</td><td>ether1, ether2…</td><td>Urutan = urutan adapter di settings</td></tr><tr><td>VMware</td><td>ether1, ether2…</td><td>Urutan = urutan adapter di settings</td></tr><tr><td>GNS3 (QEMU)</td><td>ether1, ether2…</td><td>Urutan = urutan port di template/node</td></tr></table></div><h3>Praktik Standar di CHR</h3><pre>[admin@CHR1] &gt; /interface ethernet print
 #   NAME    MAC-ADDRESS        MTU
 0   ether1  08:00:27:AA:BB:01 1500
 1   ether2  08:00:27:AA:BB:02 1500
# Cocokkan MAC dengan settings hypervisor untuk memastikan
# ether1 = adapter management (lihat 14.6).

[admin@CHR1] &gt; /interface set ether1 comment="MGMT host-only" disabled=no
[admin@CHR1] &gt; /interface set ether3 comment="UNUSED" disabled=yes
# Alasan: rename via comment (nama etherX biarkan default agar konsisten
# antar CHR), disable yang tak dipakai — prinsip sama seperti hardware.</pre><div class="callout"><div class="t">Menambah Interface = Menambah Adapter</div><p style="margin:4px 0 0">Butuh ether5? Tambahkan <b>adapter di hypervisor</b> (VM harus dimatikan dulu di VirtualBox/VMware), lalu start — ether baru muncul otomatis. Di GNS3, tambah via node configure. Interface tidak bisa "dibuat" dari dalam RouterOS untuk NIC fisik/virtual.</p></div>`,
      terms: [['vNIC', 'NIC virtual — interface etherX di CHR terhubung ke segmen hypervisor.']],
      diagram: `<pre>           INTERFACE CHR = vNIC

   [Hypervisor settings]          [RouterOS]
   Adapter 1 (Host-only)  ------&gt;  ether1  (08:00:27:..:01)
   Adapter 2 (Internal-A) ------&gt;  ether2  (08:00:27:..:02)
   Adapter 3 (Internal-B) ------&gt;  ether3  (08:00:27:..:03)

   Urutan adapter di hypervisor = urutan ether di RouterOS.
   Cocokkan via MAC address bila ragu.</pre>`,
      scenario: 'Engineer menambah adapter ke-4 di VirtualBox tapi lupa urutan — ether3 dan ether4 tertukar peran. Ia mencocokkan MAC di /interface ethernet print dengan MAC di settings VirtualBox dan memberi comment yang benar.',
      bestPractices: 'Jangan rename etherX (biarkan default); gunakan comment untuk peran. Cocokkan MAC saat ragu urutan.',
      security: 'Disable interface yang tidak dipakai — prinsip yang sama dengan port fisik.',
      challenge: 'Catat MAC tiap ether di CHR-mu dan cocokkan dengan settings hypervisor. Beri comment peran di tiap interface.',
      interviewQ: 'Q: "Bagaimana cara menambah interface baru di CHR?" — A: Tambah adapter di hypervisor (VM off dulu), start kembali — ether baru muncul otomatis; tidak bisa dibuat dari dalam RouterOS.',
      quiz: [
        { q: 'Urutan ether1, ether2 di CHR ditentukan oleh…', options: ['Acak setiap boot', 'Urutan adapter di settings hypervisor', 'Kecepatan link', 'Lisensi'], answer: 1, explain: 'Mapping 1:1 dengan urutan adapter di hypervisor — cocokkan via MAC bila ragu.' },
        { q: 'Mengapa disarankan tidak me-rename etherX di CHR?', options: ['Tidak bisa di-rename', 'Agar konsisten antar CHR dan mapping ke adapter hypervisor tetap jelas', 'Melanggar lisensi', 'Membuat lambat'], answer: 1, explain: 'Nama default menjaga korespondensi dengan adapter hypervisor; peran ditulis di comment.' },
        { q: 'Cara menambah ether baru di CHR VirtualBox adalah…', options: ['/interface add di RouterOS', 'Matikan VM → tambah adapter di settings → start', 'Install ulang CHR', 'Tidak bisa'], answer: 1, explain: 'Interface fisik/vNIC hanya muncul dari penambahan adapter di hypervisor.' }
      ]
    },
    {
      id: '14.9',
      title: 'CHR Licensing',
      body: `<p>CHR memakai <b>lisensi berjenjang</b> yang membatasi <b>kecepatan per interface</b>. Kabar baik: untuk belajar, versi <b>gratis/trial</b> sudah lebih dari cukup.</p><div class="tblwrap"><table><tr><th>Lisensi</th><th>Limit Kecepatan / Interface</th><th>Harga (indikasi)</th><th>Cocok Untuk</th></tr><tr><td>Trial (tanpa lisensi)</td><td>1 Mbps</td><td>Gratis</td><td>Belajar konfigurasi, lab Part 13–18</td></tr><tr><td>P1</td><td>1 Gbps</td><td>~$45 selamanya</td><td>Lab serius, VPN hub kecil</td></tr><tr><td>P10</td><td>10 Gbps</td><td>~$95 selamanya</td><td>Production virtual menengah</td></tr><tr><td>P-Unlimited</td><td>Tanpa batas</td><td>~$295 selamanya</td><td>Production berat / ISP virtual</td></tr></table></div><h3>Cara Kerja Lisensi</h3><pre>[admin@CHR1] &gt; /system license print
# Menampilkan level & status. Trial: "limited to 1Mbps per interface".

# Proses umum: beli di mikrotik.com → dapat key → /system license
# → paste key → reboot. Lisensi terikat System ID CHR.
# PENTING: clone VM = System ID baru = lisensi tidak ikut!</pre><div class="callout blue"><div class="t">Trial 1 Mbps: Cukupkah?</div><p style="margin:4px 0 0">Sangat cukup untuk belajar: ping, traceroute, routing, firewall, DHCP, VLAN — semua tidak butuh bandwidth besar. Limit hanya terasa saat speedtest/throughput test. Jangan beli lisensi hanya untuk mengikuti lab ini.</p></div>`,
      terms: [['Lisensi CHR', 'Tingkatan P1/P10/P-Unlimited yang membatasi kecepatan per interface.'], ['System ID', 'Identitas unik tiap instalasi CHR — lisensi terikat ke ID ini.'], ['Trial', 'Mode gratis tanpa key: dibatasi 1 Mbps per interface.']],
      diagram: `<pre>              LISENSI CHR

   Tanpa key (trial):   1 Mbps / interface   --&gt; cukup untuk BELAJAR
   P1 ($45):            1 Gbps  / interface   --&gt; lab serius / VPN kecil
   P10 ($95):           10 Gbps / interface   --&gt; production menengah
   P-Unlimited ($295):  tanpa batas            --&gt; production berat

   Lisensi terikat System ID. Clone VM = ID baru = key tidak berlaku.
   Beli hanya bila lab butuh throughput &gt; 1 Mbps.</pre>`,
      scenario: 'Komunitas lab patungan membeli 1 lisensi P1 untuk CHR "ujian sertifikasi" bersama — throughput 1 Gbps untuk praktik QoS realistis. CHR belajar harian tetap memakai trial gratis.',
      bestPractices: 'Jangan beli lisensi untuk lab belajar; catat System ID sebelum membeli agar key dipasang di CHR yang benar.',
      security: 'Key lisensi adalah aset — simpan di akun mikrotik.com, jangan share di forum/chat.',
      challenge: 'Jalankan /system license print di CHR-mu dan catat status trial-nya.',
      interviewQ: 'Q: "Apa batasan CHR tanpa lisensi dan apakah cukup untuk belajar?" — A: Dibatasi 1 Mbps per interface; lebih dari cukup untuk konfigurasi, routing, firewall — hanya kurang untuk uji throughput.',
      quiz: [
        { q: 'Batasan CHR trial (tanpa lisensi) adalah…', options: ['Tidak bisa routing', '1 Mbps per interface', 'Hanya 1 interface', 'Mati tiap 24 jam'], answer: 1, explain: 'Trial membatasi kecepatan, bukan fitur — semua fitur RouterOS tetap bisa dipelajari.' },
        { q: 'Lisensi CHR terikat pada…', options: ['MAC laptop', 'System ID tiap instalasi CHR', 'Akun email saja', 'Nomor HP'], answer: 1, explain: 'Clone VM menghasilkan System ID baru sehingga key lama tidak berlaku di clone.' },
        { q: 'Kapan perlu membeli lisensi P1?', options: ['Untuk belajar dasar', 'Saat lab butuh throughput di atas 1 Mbps (mis. uji QoS realistis)', 'Wajib sejak install', 'Tidak pernah'], answer: 1, explain: 'Beli hanya bila limit trial menghambat tujuan lab — bukan untuk konfigurasi dasar.' }
      ]
    },
    {
      id: '14.10',
      title: 'CHR Troubleshooting',
      body: `<p>Masalah CHR 90% bukan di RouterOS-nya, melainkan di <b>lapisan virtualisasi</b>. Gunakan metodologi berlapis: hypervisor dulu, baru RouterOS.</p><div class="tblwrap"><table><tr><th>Gejala</th><th>Cek Hypervisor Dulu</th><th>Cek RouterOS</th></tr><tr><td>CHR tidak boot / stuck</td><td>RAM cukup? Virtualization (VT-x) aktif di BIOS? Image tidak corrupt (re-download)?</td><td>—</td></tr><tr><td>Tidak bisa konek WinBox/SSH</td><td>Adapter management di segmen benar? VM network "connected"?</td><td><code>/ip address print</code> via console; firewall input</td></tr><tr><td>Antar-CHR tidak saling ping</td><td>Segmen sama? (Internal-A vs Internal-B tertukar?)</td><td>IP satu subnet? ARP complete?</td></tr><tr><td>Lambat / CPU host 100%</td><td>Terlalu banyak VM? Host kehabisan RAM?</td><td><code>/system resource print</code>; kurangi mangle/queue</td></tr><tr><td>Throughput mentok ~1 Mbps</td><td>—</td><td>Lisensi trial! Normal — bukan error (<code>/system license print</code>)</td></tr></table></div><h3>Metodologi: Bawah ke Atas</h3><pre>1. Hypervisor: VM running? adapter connected? segmen benar?
2. Layer 1-2 virtual: /interface print (R?), MAC cocok?
3. Layer 3: /ip address print, /ip route print, /ip arp print
4. Layer 4-7/filter: /ip firewall filter print, /log print
# Alasan urutannya: jangan mengutak-atik firewall bila ternyata
# kabel virtualnya (segmen) yang salah colok.</pre><div class="callout"><div class="t">Senjata Pamungkas: Snapshot</div><p style="margin:4px 0 0">Sebelum eksperimen berisiko, buat <b>snapshot VM</b> di hypervisor (atau GNS3 snapshot, Part 15.16). Rusak? Revert dalam detik. Ini alasan utama lab virtual unggul dari hardware: <b>keberanian bereksperimen tanpa konsekuensi</b>.</p></div>`,
      terms: [['VT-x/AMD-V', 'Fitur virtualisasi di CPU/BIOS — wajib aktif untuk VM 64-bit.'], ['Snapshot VM', 'Titik simpan state VM yang bisa di-restore instan.']],
      diagram: `<pre>           TROUBLESHOOTING CHR: BAWAH KE ATAS

   [Tidak bisa ping / konek]
            |
     1. Hypervisor OK? ---- tidak --&gt; cek VT-x, RAM, adapter connected,
            |                                     segmen benar?
           ya
            |
     2. /interface print R? - tidak --&gt; adapter/setting hypervisor
            |
           ya
            |
     3. IP/route/ARP benar? - tidak --&gt; perbaiki Layer 3
            |
           ya
            |
     4. Firewall/log --&gt; /ip firewall filter print, /log print

   Jangan lompat ke langkah 4 bila langkah 1 belum dicek!</pre>`,
      scenario: 'Lab mati total setelah update VirtualBox: semua CHR "inaccessible". Ternyata update me-reset setting network ke default. Pelajaran: catat konfigurasi segmen hypervisor di dokumentasi, bukan hanya konfigurasi RouterOS.',
      bestPractices: 'Diagnosis selalu dari hypervisor ke atas; buat snapshot sebelum eksperimen berisiko.',
      security: 'Snapshot bisa berisi password lama — hapus snapshot tak terpakai yang menyimpan kredensial sensitif.',
      challenge: 'Sengaja rusak satu hal di lab-mu (mis. salah segmen adapter), lalu praktikkan metodologi 4 langkah hingga ketemu. Catat berapa menit.',
      interviewQ: 'Q: "CHR tidak bisa diakses setelah perubahan network. Urutan cekmu?" — A: Hypervisor dulu (VM running? adapter connected? segmen benar?), baru /interface, /ip address via console, terakhir firewall.',
      quiz: [
        { q: 'Langkah pertama troubleshooting CHR yang tidak bisa dikonek adalah…', options: ['Reinstall CHR', 'Cek hypervisor: VM running, adapter connected, segmen benar', 'Ganti password', 'Beli lisensi'], answer: 1, explain: '90% masalah CHR ada di lapisan virtualisasi — cek dari bawah ke atas.' },
        { q: 'Throughput CHR mentok di ~1 Mbps kemungkinan besar karena…', options: ['Kabel rusak', 'Lisensi trial — itu batas normalnya, bukan error', 'Virus', 'RAM kurang'], answer: 1, explain: 'Trial membatasi 1 Mbps/interface. Verifikasi dengan /system license print.' },
        { q: 'Fungsi snapshot VM sebelum eksperimen adalah…', options: ['Mempercepat VM', 'Titik restore instan bila eksperimen merusak konfigurasi', 'Backup ke cloud', 'Menambah disk'], answer: 1, explain: 'Snapshot = keberanian bereksperimen: rusak tinggal revert.' }
      ]
    }
  ]
};
