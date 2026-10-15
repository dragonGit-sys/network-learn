// PART 33 — Linux for Network Engineer (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part33: Part = {
  id: '33',
  number: 'PART 33',
  title: 'Linux for Network Engineer',
  phaseId: 'fase-7',
  description: 'Bekal harian NOC: fundamental Linux, networking tools (ip, ss, tcpdump), dan text processing (grep, awk, sed, Bash).',
  repoFolder: 'part-33-linux',
  objectives: [
    'Mengoperasikan Linux dasar: filesystem, permission, user, process, dan service (systemd) untuk kebutuhan operasional jaringan.',
    'Menggunakan SSH secara aman dan efisien untuk akses remote ke perangkat dan server.',
    'Menguasai tool networking Linux: ip, ss, ping, traceroute, tcpdump, curl, dan dig — lengkap dengan flag penting dan cara membaca outputnya.',
    'Mengolah teks hasil command dengan grep, awk, dan sed untuk parsing log dan output monitoring.',
    'Menulis script Bash sederhana untuk mengotomatiskan tugas NOC harian.',
  ],
  prerequisites: 'Part 32 (Network Automation Fundamentals) — mindset automation. Tidak butuh pengalaman Linux sebelumnya; part ini dimulai dari nol. Lab: VM/container Linux (Ubuntu/Debian) — bisa VM di laptop atau container di GNS3.',
  subbabs: [
    {
      id: '33.1',
      title: 'Linux Fundamentals',
      body: `<p><b>Linux</b> adalah sistem operasi open-source yang menjadi "rumah" hampir seluruh infrastruktur jaringan modern: server Zabbix dan Grafana (Part 23–27) berjalan di Linux, script automation Python dieksekusi dari Linux, dan tool networking terbaik (tcpdump, ip, ss) lahir di Linux. Network engineer yang buta Linux seperti montir yang tidak bisa membuka kap mesin.</p>
<h3>Konsep Kunci untuk Pemula</h3>
<ul>
<li><b>Kernel vs distribusi:</b> Linux (kernel) + tool GNU + package manager = <b>distro</b> (Ubuntu, Debian, Rocky). Untuk lab kita pakai <b>Ubuntu/Debian</b> karena dokumentasinya paling banyak.</li>
<li><b>Terminal & shell:</b> terminal adalah "jendela teks"; <b>shell</b> (umumnya <b>Bash</b>) adalah program yang membaca perintahmu, mengeksekusinya, dan menampilkan hasil. Mirip CLI MikroTik, tapi jauh lebih powerful.</li>
<li><b>Semua adalah file:</b> di Linux, hardware (disk, interface), process, bahkan konfigurasi kernel terekspos sebagai file teks di <code>/dev</code>, <code>/proc</code>, <code>/sys</code>. Filosofi ini membuat automation mudah: "baca file = baca status sistem".</li>
<li><b>Case-sensitive:</b> <code>Ping</code> ≠ <code>ping</code>. Command Linux selalu huruf kecil.</li>
</ul>
<h3>Command Pertama: Navigasi Dasar</h3>
<pre>$ whoami              # siapa user saat ini? → mis. "noc-admin"
$ pwd                 # print working directory: posisi folder saat ini
$ ls -lah             # list isi folder: -l detail, -a termasuk hidden, -h human-readable
$ cd /etc             # change directory ke /etc (folder konfigurasi sistem)
$ cd ~                # kembali ke home folder user</pre>
<p><b>Penjelasan flag <code>ls -lah</code>:</b> <code>-l</code> = format panjang (permission, owner, ukuran, tanggal); <code>-a</code> = tampilkan file hidden (diawali titik); <code>-h</code> = ukuran dalam KB/MB bukan byte mentah. Tiga flag digabung menjadi <code>-lah</code> — pola umum Linux: flag bisa digabung.</p>
<h3>Manual Bawaan: <code>man</code></h3>
<pre>$ man ip              # buka manual lengkap command "ip" (tekan q untuk keluar)
$ ip --help           # versi ringkas (tidak semua command punya)</pre>
<p><b>ALASAN</b> membiasakan <code>man</code>: kamu tidak perlu menghafal semua flag — engineer senior pun membuka manual. Yang penting tahu <i>command apa untuk masalah apa</i>.</p>
<div class="callout blue"><div class="t">Linux di Dunia Jaringan</div><p style="margin:4px 0 0">RouterOS (MikroTik) sendiri dibangun di atas kernel Linux — command <code>/system resource print</code> pada dasarnya membaca info yang sama dengan <code>cat /proc/meminfo</code> di Linux. Memahami Linux = memahami "jeroan" perangkat jaringanmu.</p></div>`,
      terms: [
        ['Linux', 'Sistem operasi open-source; fondasi server monitoring, automation, dan tool networking.'],
        ['Distro', 'Paket lengkap Linux (kernel + tool + package manager), mis. Ubuntu, Debian, Rocky.'],
        ['Shell / Bash', 'Program penerjemah perintah teks (Bourne Again Shell) — "CLI"-nya Linux.'],
        ['Terminal', 'Aplikasi jendela teks tempat kamu mengetik command ke shell.'],
      ],
      diagram: `<pre>        TUMPUKAN LINUX UNTUK NETWORK ENGINEER

  ┌─────────────────────────────────────┐
  │  Kamu (mengetik di terminal)        │
  ├─────────────────────────────────────┤
  │  Shell (Bash): penerjemah perintah   │
  ├─────────────────────────────────────┤
  │  Tool networking: ip ss ping        │
  │  tcpdump curl dig grep awk sed      │
  ├─────────────────────────────────────┤
  │  Kernel Linux: TCP/IP stack, driver │
  └─────────────────────────────────────┘
  "Semua adalah file": /proc /sys /dev memaparkan
  isi kernel sebagai teks yang bisa dibaca script.</pre>`,
      scenario: 'Server Zabbix NOC tiba-tiba tidak bisa diakses. Engineer yang paham Linux login via console, cek dengan df (disk penuh oleh log!), hapus log lama, restart service — 10 menit selesai. Engineer yang tidak paham Linux hanya bisa "reboot dan berdoa".',
      bestPractices: 'Biasakan membaca man page sebelum menghafal. Buat VM Linux lab dan "tinggali" di sana: lakukan semua latihan Part 33 di VM tersebut sampai jari hafal.',
      security: 'Jangan login harian sebagai root. Gunakan user biasa + sudo — setiap command berbahaya jadi butuh konfirmasi eksplisit, dan log mencatat siapa melakukan apa.',
      challenge: 'Di VM Linux-mu, jalankan: whoami, pwd, ls -lah /, dan cat /proc/version. Tulis di catatan: apa arti tiap baris output ls -lah / (permission, owner, nama)?',
      interviewQ: 'Q: Mengapa network engineer perlu belajar Linux? — A: Karena server monitoring (Zabbix/Grafana), tool automation, dan tool diagnostik jaringan terbaik semuanya berjalan di Linux; bahkan RouterOS dibangun di atas kernel Linux. Tanpa Linux, engineer buta terhadap "jeroan" infrastrukturnya.',
      quiz: [
        { q: 'Apa arti filosofi "semua adalah file" di Linux?', options: ['Semua data harus disimpan di satu file', 'Hardware, process, dan konfigurasi kernel terekspos sebagai file teks yang bisa dibaca/ditulis', 'Linux tidak punya folder', 'File di Linux tidak bisa dihapus'], answer: 1, explain: 'Melalui /dev, /proc, /sys, status hardware dan kernel bisa dibaca seperti file teks — memudahkan monitoring dan automation.' },
        { q: 'Apa fungsi flag -l, -a, -h pada ls -lah?', options: ['Login, admin, hidden', 'Format panjang (detail), tampilkan file hidden, ukuran human-readable', 'List, all, help', 'Lock, archive, hide'], answer: 1, explain: '-l = long format (permission/owner/ukuran), -a = all termasuk hidden, -h = human-readable (KB/MB).' },
        { q: 'Bagaimana cara melihat dokumentasi lengkap sebuah command?', options: ['Dengan menebak-nebak flagnya', 'man <command> — mis. man ip; tekan q untuk keluar', 'Dengan me-restart komputer', 'Dokumentasi tidak tersedia di Linux'], answer: 1, explain: 'man page adalah manual bawaan Linux; kebiasaan membacanya lebih penting daripada menghafal flag.' },
      ],
    },
    {
      id: '33.2',
      title: 'Filesystem',
      body: `<p><b>Filesystem</b> Linux adalah satu pohon direktori yang berakar di <code>/</code> (root). Berbeda dengan Windows (C:, D:), semua disk dan partisi "ditempel" (mount) ke cabang pohon ini. Memahami isi tiap cabang = tahu ke mana harus melihat saat troubleshooting.</p>
<h3>Peta Folder Penting</h3>
<div class="tblwrap"><table>
<tr><th>Folder</th><th>Isi</th><th>Relevansi Network Engineer</th></tr>
<tr><td><code>/etc</code></td><td>File konfigurasi sistem</td><td>Konfigurasi SSH (<code>sshd_config</code>), network, hosts</td></tr>
<tr><td><code>/var/log</code></td><td>File log</td><td><b>Tambang emas troubleshooting</b>: auth.log, syslog</td></tr>
<tr><td><code>/home</code></td><td>Folder tiap user</td><td>Tempat script dan file kerja pribadimu</td></tr>
<tr><td><code>/opt</code>, <code>/usr/local</code></td><td>Aplikasi tambahan</td><td>Installasi manual tool monitoring</td></tr>
<tr><td><code>/tmp</code></td><td>File sementara</td><td>Hilang saat reboot — jangan simpan yang penting</td></tr>
<tr><td><code>/proc</code>, <code>/sys</code></td><td>Info kernel (virtual)</td><td>CPU, memory, network stats real-time</td></tr>
<tr><td><code>/dev</code></td><td>Perangkat hardware</td><td>Disk (<code>sda</code>), terminal</td></tr>
</table></div>
<h3>Command Esensial File</h3>
<pre>$ cp config.txt config.bak      # copy: SELALU backup sebelum edit config!
$ mv lama.txt baru.txt           # move/rename
$ rm file.txt                    # remove (HATI-HATI: tidak ada recycle bin!)
$ rm -r folder_lama/             # -r = recursive, hapus folder + isinya
$ mkdir -p ~/scripts/harian      # buat folder bertingkat (-p = buat induk bila perlu)
$ cat /etc/hostname              # tampilkan isi file (untuk file kecil)
$ less /var/log/syslog           # baca file besar per halaman (q keluar, / cari teks)
$ head -20 file.log              # 20 baris pertama
$ tail -50 file.log              # 50 baris TERAKHIR — paling sering untuk log
$ tail -f /var/log/syslog        # -f = follow: tampilkan baris baru live (Ctrl+C berhenti)</pre>
<p><b>ALASAN</b> <code>tail -f</code> jadi sahabat NOC: saat troubleshooting, kamu butuh melihat log <i>saat kejadian berlangsung</i> — mis. ulangi request API yang gagal sambil <code>tail -f</code> log-nya, error-nya langsung terlihat.</p>
<h3>Path: Absolut vs Relatif</h3>
<p><code>/etc/hosts</code> (diawali <code>/</code>) = <b>absolut</b>, selalu dari akar — aman dipakai di script. <code>../logs/app.log</code> = <b>relatif</b> terhadap posisi saat ini (<code>..</code> = naik satu level). Di script automation, <b>selalu pakai path absolut</b> — script cron berjalan dengan working directory yang tidak terduga.</p>
<div class="callout"><div class="t">Command Berbahaya</div><p style="margin:4px 0 0"><code>rm -rf /</code> menghapus seluruh sistem. Varian nyatanya: <code>rm -rf $FOLDER/</code> dengan variabel kosong menjadi <code>rm -rf /</code>. Aturan: JANGAN pakai <code>rm -rf</code> dengan variabel sebelum <code>echo</code> dulu isinya; pertimbangkan <code>trash-cli</code> untuk file penting.</p></div>`,
      terms: [
        ['Filesystem', 'Struktur pohon direktori Linux berakar di / tempat semua file dan device ter-mount.'],
        ['Mount', 'Menempelkan disk/partisi ke sebuah folder agar bisa diakses.'],
        ['Path absolut', 'Alamat lengkap dari akar (/), mis. /etc/hosts — aman untuk script.'],
        ['Path relatif', 'Alamat dari posisi saat ini, mis. ../log.txt — rapuh di script terjadwal.'],
      ],
      diagram: `<pre>        POHON FILESYSTEM LINUX (disederhanakan)

  /  (root)
  ├── etc/        ← konfigurasi (sshd_config, hosts)
  ├── var/log/    ← LOG: syslog, auth.log (troubleshooting!)
  ├── home/noc/   ← file kerjamu, script automation
  ├── proc/       ← info kernel (virtual, real-time)
  ├── sys/        ← parameter kernel (virtual)
  ├── tmp/        ← sementara (hilang saat reboot)
  └── dev/        ← hardware (sda = disk)</pre>`,
      scenario: 'Zabbix server berhenti menulis data. Engineer cek df -h → /var 100% penuh. tail -50 /var/log/syslog → terlihat log membengkak karena satu device mengirim trap tiap detik. Hapus log lama + perbaiki device pengirim — selesai tanpa reinstall.',
      bestPractices: 'cp dulu sebelum edit file konfigurasi (config.bak dengan tanggal). Pakai path absolut di script. tail -f adalah cara tercepat "melihat ke dalam" sistem saat insiden.',
      security: 'File di /etc (terutama sshd_config, shadow) hanya boleh dibaca root. Jangan chmod 777 untuk "mempermudah" — itu membuka pintu untuk semua user di sistem.',
      challenge: 'Jelajahi VM-mu: ls /etc | head, cat /etc/hostname, tail -20 /var/log/syslog, df -h. Catat: berapa persen disk terpakai? service apa yang paling banyak menulis log?',
      interviewQ: 'Q: Server tidak bisa login SSH dan web monitoring mati. Langkah Linux apa yang kamu cek via console? — A: df -h (disk penuh?), free -h (memory?), systemctl status sshd/zabbix, tail log di /var/log/syslog dan auth.log untuk petunjuk error.',
      quiz: [
        { q: 'Di folder mana log sistem Linux umumnya berada dan mengapa penting?', options: ['/tmp — karena sementara', '/var/log — tambang emas troubleshooting berisi syslog, auth.log, dll.', '/home — karena milik user', '/dev — karena virtual'], answer: 1, explain: '/var/log menyimpan jejak semua kejadian sistem; membaca log adalah langkah pertama troubleshooting yang sistematis.' },
        { q: 'Apa fungsi tail -f /var/log/syslog?', options: ['Menghapus log', 'Menampilkan baris-baris baru log secara live saat kejadian berlangsung', 'Mengirim log ke printer', 'Mengompres log'], answer: 1, explain: '-f = follow: output diperbarui real-time. Ideal untuk melihat error tepat saat kamu mereproduksi masalah.' },
        { q: 'Mengapa script automation harus memakai path absolut?', options: ['Karena lebih pendek', 'Karena working directory script terjadwal (cron) tidak terduga — path relatif bisa menunjuk ke tempat salah', 'Karena Linux mewajibkan', 'Tidak ada alasan khusus'], answer: 1, explain: 'Cron menjalankan script dengan environment minimal; path relatif bisa gagal atau lebih parah: menunjuk ke file yang salah.' },
      ],
    },
    {
      id: '33.3',
      title: 'Permission',
      body: `<p><b>Permission</b> adalah sistem izin Linux yang menentukan <b>siapa boleh membaca (r), menulis (w), dan mengeksekusi (x)</b> sebuah file. Ini adalah <b>lapisan keamanan pertama</b> server: script automation berisi kredensial, key SSH, dan file konfigurasi semuanya dilindungi oleh permission.</p>
<h3>Membaca Output <code>ls -l</code></h3>
<pre>$ ls -l backup-mikrotik.sh
-rwx------ 1 noc-admin netops  482 Oct 14 09:00 backup-mikrotik.sh
# │││ │││ │││
# │││ │││ ││└─ others:  --- (tidak boleh apa-apa)
# │││ │││ └──── group:  --- (tidak boleh apa-apa)
# │││ └──────── owner:  rwx (baca+tulis+eksekusi)
# └─────────── tipe: - = file biasa, d = directory, l = symlink</pre>
<p>Tiga kelompok: <b>owner</b> (pemilik), <b>group</b> (grup), <b>others</b> (semua orang lain). Tiga izin: <b>r</b> (read=4), <b>w</b> (write=2), <b>x</b> (execute=1). Angka dijumlah: <code>rwx</code> = 4+2+1 = <b>7</b>, <code>r--</code> = 4, <code>---</code> = 0.</p>
<h3>Command: chmod, chown, sudo</h3>
<pre>$ chmod 600 rahasia.txt         # rw------- : hanya owner bisa baca+tulis (untuk file kredensial!)
$ chmod 700 ~/scripts           # rwx------ : hanya owner bisa masuk folder
$ chmod +x backup.sh            # tambah izin eksekusi agar bisa dijalankan sebagai ./backup.sh
$ chmod 644 dokumen.txt         # rw-r--r-- : owner tulis, semua orang baca (default file biasa)
$ chown noc-admin:netops file   # ganti owner:group (butuh sudo)
$ sudo systemctl restart sshd   # sudo = "jalankan sebagai root" untuk SATU command</pre>
<p><b>ALASAN</b> <code>600</code> untuk file kredensial: bila file berisi password bisa dibaca user lain di server yang sama, maka "rahasia" itu bukan rahasia. <b>ALASAN</b> memakai <code>sudo</code> per command, bukan login root: setiap aksi tercatat atas namamu di log (<code>auth.log</code>) — akuntabilitas.</p>
<h3>Angka yang Wajib Hafal</h3>
<div class="tblwrap"><table>
<tr><th>Angka</th><th>Arti</th><th>Pakai Untuk</th></tr>
<tr><td>700</td><td>rwx------</td><td>Folder/script pribadi</td></tr>
<tr><td>600</td><td>rw-------</td><td>File kredensial, private key SSH</td></tr>
<tr><td>644</td><td>rw-r--r--</td><td>File biasa (default)</td></tr>
<tr><td>755</td><td>rwxr-xr-x</td><td>Script yang boleh dijalankan semua orang</td></tr>
<tr><td>777</td><td>rwxrwxrwx</td><td><b>JANGAN PERNAH</b> — semua orang bisa tulis = pintu malware</td></tr>
</table></div>`,
      terms: [
        ['Permission', 'Izin baca (r), tulis (w), eksekusi (x) untuk owner, group, dan others pada tiap file.'],
        ['chmod', 'Command mengubah permission file (mis. chmod 600).'],
        ['chown', 'Command mengubah owner/group file.'],
        ['sudo', 'Menjalankan satu command sebagai root — dengan pencatatan di log.'],
      ],
      diagram: `<pre>        MEMBACA STRING PERMISSION

  - rwx r-- ---
  │  │   │   │
  │  │   │   └── others : tidak boleh apa-apa
  │  │   └────── group  : hanya baca (r--)
  │  └────────── owner  : baca+tulis+eksekusi (rwx)
  └───────────── tipe: - file | d directory | l symlink

  Angka: r=4 w=2 x=1 → rwx=7, r--=4, ---=0
  Contoh: 600 = rw------- (file rahasia) ✓
          777 = rwxrwxrwx (BAHAYA!) ✗</pre>`,
      scenario: 'Script backup otomatis gagal dengan "Permission denied". Investigasi: file key SSH ber-permission 644 — SSH client menolak key yang bisa dibaca orang lain (demi keamanan). Solusi: chmod 600 key, script jalan. Permission bukan sekadar birokrasi — tool keamanan menegakkannya.',
      bestPractices: 'Prinsip least privilege: beri izin seminimal mungkin (600 untuk secret, bukan 644). Cek permission file sensitif secara berkala. Jangan pernah chmod 777 untuk "mempermudah".',
      security: 'Private key SSH (~/.ssh/id_ed25519) WAJIB 600; folder ~/.ssh WAJIB 700. Bila dilanggar, SSH menolak key — itu fitur, bukan bug. Audit: find ~ -perm -o+w untuk mencari file yang bisa ditulis orang lain.',
      challenge: 'Buat file latihan.txt, lalu ubah permissionnya menjadi 600, 644, 755, dan 000 — tiap kali jalankan ls -l dan catat string permissionnya. Kembalikan ke 644 di akhir.',
      interviewQ: 'Q: Apa beda chmod 600 dan 644, dan kapan memakai masing-masing? — A: 600 = rw------- (hanya owner baca+tulis) untuk file sensitif seperti kredensial dan private key; 644 = rw-r--r-- (semua bisa baca, hanya owner tulis) untuk file biasa. 777 tidak pernah dipakai.',
      quiz: [
        { q: 'String permission -rwx------ artinya...', options: ['Semua orang boleh semuanya', 'Hanya owner yang boleh baca+tulis+eksekusi; group dan others tidak boleh apa-apa', 'Hanya group yang boleh baca', 'File dikunci permanen'], answer: 1, explain: 'Tiga triplet = owner/group/others. rwx------ = owner penuh, sisanya --- (0). Setara angka 700.' },
        { q: 'Permission berapa yang tepat untuk file berisi password?', options: ['777 agar mudah dibaca', '600 — hanya owner yang bisa baca dan tulis', '644 agar praktis', '000 agar aman total'], answer: 1, explain: '600 = rw------- : hanya owner yang bisa akses. 777 justru membuka ke semua orang; 000 membuat owner pun tak bisa baca.' },
        { q: 'Mengapa SSH menolak private key ber-permission 644?', options: ['Karena bug SSH', 'Karena key yang bisa dibaca user lain dianggap tidak aman — fitur proteksi SSH', 'Karena key harus di folder /tmp', 'Karena SSH hanya baca key 777'], answer: 1, explain: 'SSH client menegakkan 600 untuk private key: bila orang lain bisa membaca key-mu, key itu sudah tidak rahasia lagi.' },
      ],
    },
    {
      id: '33.4',
      title: 'User',
      body: `<p><b>User</b> di Linux adalah identitas yang menjalankan process dan memiliki file. Setiap user punya <b>UID</b> (User ID, angka unik), home folder, dan shell. Bahkan service seperti Zabbix berjalan sebagai user khusus (<code>zabbix</code>) — bukan root — agar bila disusupi, kerusakannya terbatas.</p>
<h3>Command Manajemen User</h3>
<pre>$ id                      # tampilkan UID, GID, dan group user saat ini
uid=1001(noc-admin) gid=1001(noc-admin) groups=1001(noc-admin),27(sudo)

$ sudo adduser teknisi2    # buat user baru (interaktif: password, nama, dll.)
# ALASAN adduser (bukan useradd): adduser ramah pemula — otomatis buat home folder,
# salin file default, dan tanya password. useradd versi mentahnya butuh banyak flag.

$ sudo usermod -aG sudo teknisi2   # tambahkan user ke group sudo (bisa pakai sudo)
# -aG = append ke Group (tanpa -a, user DIKELUARKAN dari group lamanya!)

$ sudo deluser teknisi2   # hapus user (tambah --remove-home untuk hapus foldernya)

$ passwd                  # ganti password user sendiri
$ sudo passwd teknisi2    # reset password user lain (butuh sudo)</pre>
<h3>Root: Raja yang Berbahaya</h3>
<p><b>root</b> (UID 0) bisa melakukan apa pun — termasuk menghancurkan sistem dengan satu command. Aturan operasional:</p>
<ul>
<li>Login harian sebagai user biasa; naikkan privilege per command dengan <code>sudo</code>.</li>
<li><code>sudo -i</code> memberi shell root — pakai seperlunya, segera <code>exit</code>.</li>
<li>Di Ubuntu, login SSH langsung sebagai root <b>dimatikan default</b> (<code>PermitRootLogin prohibit-password</code>) — itu disengaja, jangan dinyalakan.</li>
</ul>
<h3>Group: Izin Kolektif</h3>
<p>User bisa masuk banyak group; permission group (triplet tengah) berlaku untuk semua anggotanya. Pola NOC: buat group <code>netops</code>, masukkan semua engineer, beri group itu akses baca ke folder dokumentasi dan eksekusi ke script operasional — tanpa memberi akses root.</p>
<div class="callout"><div class="t">Service User</div><p style="margin:4px 0 0">User seperti <code>zabbix</code> atau <code>www-data</code> tidak untuk login manusia (nologin shell) — mereka adalah identitas agar service berjalan dengan izin minimal. Prinsip: <b>setiap service hanya boleh menyentuh yang ia butuhkan</b>.</p></div>`,
      terms: [
        ['User / UID', 'Identitas di Linux; UID adalah nomor uniknya (root = 0).'],
        ['Group / GID', 'Kumpulan user untuk pemberian izin kolektif.'],
        ['root', 'Superuser (UID 0) dengan kuasa penuh — dan risiko penuh.'],
        ['sudo', 'Mendelegasikan hak root per command dengan pencatatan.'],
      ],
      scenario: 'Mantan karyawan masih punya akun SSH di server monitoring 3 bulan setelah resign — ditemukan saat audit. Sejak itu SOP: akun dikunci di hari terakhir (usermod --lock), SSH key-nya dicabut, dan ada checklist offboarding. Manajemen user = keamanan.',
      bestPractices: 'Satu user per manusia (jangan share akun admin). Cabut atau kunci akun segera saat orang keluar. Review daftar sudoers dan SSH authorized_keys berkala.',
      security: 'Nonaktifkan password auth bila sudah pakai key (PasswordAuthentication no). Batasi siapa boleh sudo via group sudo. Monitor /var/log/auth.log untuk login gagal berulang yang menandakan brute force.',
      challenge: 'Buat user latihan bernama netlab, masukkan ke group sudo, lalu coba sudo whoami sebagai dia. Setelah itu kunci akunnya dan hapus kembali.',
      interviewQ: 'Q: Mengapa service seperti Zabbix berjalan sebagai user khusus, bukan root? — A: Prinsip least privilege: bila service disusupi, penyerang hanya mendapat izin user itu — tidak bisa merusak seluruh sistem. Root hanya untuk yang mutlak butuh.',
      quiz: [
        { q: 'Apa fungsi flag -a pada usermod -aG sudo teknisi2?', options: ['Hanya hiasan', 'Append: menambahkan ke group baru TANPA menghapus keanggotaan group lama', 'Menghapus user', 'Mengganti nama user'], answer: 1, explain: 'Tanpa -a, usermod -G MENGGANTI seluruh daftar group user — user bisa kehilangan akses group lamanya. Selalu pakai -aG.' },
        { q: 'Mengapa login SSH langsung sebagai root dimatikan secara default di Ubuntu?', options: ['Karena root tidak ada', 'Karena akun root adalah target utama brute force; login per-user + sudo memberi akuntabilitas di log', 'Karena root lambat', 'Karena SSH belum diinstall'], answer: 1, explain: 'Menyerang root hanya butuh menebak password (username sudah diketahui). Login per-user + sudo mencatat SIAPA melakukan apa.' },
        { q: 'Apa itu service user seperti user zabbix?', options: ['User untuk login teknisi', 'Identitas non-login agar service berjalan dengan izin minimal (least privilege)', 'User cadangan root', 'Akun demo'], answer: 1, explain: 'Service user punya nologin shell dan izin minimal — bila service disusupi, kerusakannya terbatas pada izin user itu.' },
      ],
    },
    {
      id: '33.5',
      title: 'Process',
      body: `<p><b>Process</b> adalah program yang sedang berjalan. Setiap process punya <b>PID</b> (Process ID), pemilik (user), dan konsumsi CPU/memory. Saat Zabbix "hang", yang kamu hadapi sebenarnya adalah process — dan Linux memberimu alat bedah lengkap untuk memeriksanya.</p>
<h3>Melihat Process</h3>
<pre>$ ps aux | head -20
# ps  = snapshot process saat ini
# a   = semua user, u = format user-oriented, x = termasuk yang tanpa terminal
# Kolom: USER | PID | %CPU | %MEM | COMMAND

$ ps aux | grep zabbix
# grep = saring baris yang mengandung kata "zabbix" (dibahas di 33.17)

$ top             # TAMPILAN LIVE process terurut pemakaian CPU (q untuk keluar)
$ htop            # versi berwarna dan interaktif (install: sudo apt install htop)</pre>
<p><b>Membaca <code>top</code>:</b> baris atas menunjukkan load average dan uptime; <code>%CPU</code> di atas 100% berarti process memakai banyak core; <code>RES</code> = memory fisik yang dipakai. Process dengan %CPU tinggi terus-menerus = kandidat masalah.</p>
<h3>Mengendalikan Process: Signal</h3>
<pre>$ kill 1234       # kirim SIGTERM ke PID 1234: "tolong berhenti baik-baik"
# ALASAN coba TERM dulu: process diberi kesempatan bersih-bersih
# (tutup file, simpan state) — seperti mengetuk pintu, bukan mendobrak.

$ kill -9 1234    # SIGKILL: paksa mati SEKARANG, tanpa bersih-bersih
# ALASAN -9 pilihan terakhir: bisa merusak file atau data yang sedang ditulis.
# Jangan kill -9 database atau monitoring tanpa paham risikonya.

$ pkill -f zabbix # kill berdasarkan NAMA (pola), bukan PID — praktis tapi hati-hati:
# ALASAN hati-hati: pola yang terlalu umum bisa mematikan process yang tidak dimaksud.</pre>
<div class="callout"><div class="t">Urutan Aman Menghentikan Service Bermasalah</div><p style="margin:4px 0 0">1) <code>systemctl restart nama-service</code> (cara resmi, lihat 33.6) → 2) <code>kill PID</code> (SIGTERM, baik-baik) → 3) <code>kill -9 PID</code> (pilihan terakhir). Melompat langsung ke -9 seperti mencabut kabel power server.</p></div>`,
      terms: [
        ['Process / PID', 'Program yang sedang berjalan; PID adalah nomor identitasnya.'],
        ['ps / top / htop', 'Tool melihat daftar process: ps = snapshot, top/htop = live.'],
        ['Signal (kill)', 'Pesan ke process: SIGTERM (berhenti baik-baik) vs SIGKILL (-9, paksa mati).'],
      ],
      diagram: `<pre>        SIKLUS HIDUP PROCESS (disederhanakan)

  [program di disk] --dijalankan--> [PROCESS: PID, user, CPU, MEM]
                                            │
                       ┌────────────────────┼────────────────────┐
                       ▼                    ▼                    ▼
                 systemctl restart     kill PID            kill -9 PID
                 (cara resmi,          (SIGTERM:            (SIGKILL:
                  bersih)               pamit baik-baik)     paksa, terakhir)</pre>`,
      scenario: 'Grafana tiba-tiba tidak bisa dibuka. ps aux | grep grafana → process masih ada tapi %CPU 380% (hang). systemctl restart grafana-server → normal kembali. Tanpa paham process, satu-satunya opsi adalah reboot seluruh server.',
      bestPractices: 'Selalu cek process dulu (ps/top) sebelum me-restart: pastikan masalahnya memang di process itu. Catat PID dan error sebelum kill — datanya berguna untuk root cause analysis.',
      security: 'Process berjalan sebagai user tertentu (kolom USER di ps). Service yang berjalan sebagai root padahal tidak perlu = risiko; pindahkan ke service user (33.4).',
      challenge: 'Jalankan top, identifikasi 3 process pemakan CPU/memory terbesar di VM-mu. Lalu cari PID dari process sshd dengan ps aux | grep sshd.',
      interviewQ: 'Q: Apa beda kill dan kill -9? — A: kill mengirim SIGTERM — process diminta berhenti baik-baik (tutup file, simpan state). kill -9 mengirim SIGKILL — process dipaksa mati seketika tanpa bersih-bersih, berisiko merusak data; hanya pilihan terakhir.',
      quiz: [
        { q: 'Apa arti kolom %CPU 380% pada sebuah process di top?', options: ['Process error', 'Process memakai banyak core CPU (multi-thread) — total bisa di atas 100%', 'CPU rusak', 'Angka persen selalu salah'], answer: 1, explain: '%CPU dihitung per core; process multi-thread bisa memakai 3-4 core sekaligus sehingga angkanya di atas 100%.' },
        { q: 'Urutan aman menghentikan service yang hang adalah...', options: ['Langsung kill -9', 'systemctl restart dulu, lalu kill (SIGTERM), kill -9 sebagai pilihan terakhir', 'Cabut kabel power', 'Hapus binary programnya'], answer: 1, explain: 'Mulai dari cara resmi (systemctl), eskalasi bertahap ke SIGTERM lalu SIGKILL — meminimalkan risiko data rusak.' },
        { q: 'Apa fungsi ps aux | grep zabbix?', options: ['Menginstall zabbix', 'Menampilkan snapshot process lalu menyaring hanya baris yang mengandung kata zabbix', 'Menghapus zabbix', 'Me-restart zabbix'], answer: 1, explain: 'ps aux = daftar semua process; pipe ke grep menyaring baris yang cocok — pola paling umum mencari process tertentu.' },
      ],
    },
    {
      id: '33.6',
      title: 'Service',
      body: `<p><b>Service</b> adalah program yang berjalan di background untuk melayani kebutuhan sistem — SSH server (<code>sshd</code>), web server, database, Zabbix server, semuanya service. Service berjalan terus walau tidak ada user login, dan <b>otomatis start saat boot</b> bila dikonfigurasi demikian. Server monitoring yang "lupa" di-enable akan mati total setiap reboot — mimpi buruk NOC.</p>
<h3>Command systemctl (Service Manager Modern)</h3>
<pre>$ systemctl status sshd        # LIHAT status: active? error apa? (paling sering dipakai)
$ sudo systemctl start sshd    # jalankan sekarang
$ sudo systemctl stop sshd     # hentikan sekarang
$ sudo systemctl restart sshd  # hentikan lalu jalankan ulang (untuk terapkan config baru)
$ sudo systemctl reload sshd   # baca ulang config TANPA memutus koneksi yang ada
# ALASAN reload vs restart: reload tidak memutus sesi SSH yang sedang berjalan —
# aman dipakai remote. restart memutus semuanya (jangan restart sshd dari SSH
# tanpa akses console cadangan!)

$ sudo systemctl enable sshd   # otomatis jalan saat boot (PENTING untuk server!)
$ sudo systemctl disable sshd  # jangan otomatis jalan saat boot
$ systemctl is-enabled sshd    # cek: enabled atau disabled?
$ systemctl list-units --type=service --state=running   # daftar semua service aktif</pre>
<h3>Membaca Output <code>systemctl status</code></h3>
<pre>$ systemctl status zabbix-server
● zabbix-server.service - Zabbix Server
     Active: active (running) since Tue 2026-10-14 08:00:12 WIB; 7h ago
   Main PID: 1024 (zabbix_server)
# "active (running)" = sehat. Waspadai: "failed" (crash), "inactive (dead)" (mati).</pre>
<p>Bila <code>failed</code>, langkah baku: <code>journalctl -u zabbix-server -n 50</code> (lihat 50 baris log service itu) → baca error → perbaiki → <code>restart</code> → <code>status</code> lagi. Inilah <b>troubleshooting methodology</b> versi service.</p>
<div class="callout"><div class="t">enable vs start</div><p style="margin:4px 0 0"><code>start</code> = jalan SEKARANG (hilang saat reboot). <code>enable</code> = jalan OTOMATIS tiap boot. Untuk server production, keduanya: <code>systemctl enable --now sshd</code> (enable + start sekaligus).</p></div>`,
      terms: [
        ['Service', 'Program background yang melayani sistem (sshd, zabbix-server, database).'],
        ['systemctl', 'Command pengendali service di sistem systemd.'],
        ['enable / start', 'enable = otomatis saat boot; start = jalan sekarang. Keduanya dibutuhkan untuk server.'],
        ['journalctl', 'Melihat log service yang dikelola systemd.'],
      ],
      scenario: 'Setelah maintenance listrik, server Zabbix menyala tapi dashboard kosong. Penyebab: zabbix-server hanya di-start manual dulu, tidak di-enable — setiap reboot harus dinyalakan manual. Solusi 10 detik: systemctl enable zabbix-server. Checklist "enable semua service kritis" kini bagian SOP.',
      bestPractices: 'Setelah install service baru, selalu enable + start, lalu verifikasi dengan status. Dokumentasikan daftar service kritis tiap server (bagian dari 38.10).',
      security: 'Disable service yang tidak dipakai (telnet, ftp lama) — tiap service aktif = permukaan serangan. Cek berkala: systemctl list-units --type=service --state=running.',
      challenge: 'Di VM-mu: systemctl status sshd, lalu is-enabled sshd. Coba reload sshd dan perhatikan sesi SSH-mu TIDAK terputus.',
      interviewQ: 'Q: Server habis reboot dan aplikasi tidak jalan. Apa yang kamu cek? — A: systemctl status <service> (apakah failed/inactive?), journalctl -u <service> untuk error, dan systemctl is-enabled <service> — seringnya service belum di-enable sehingga tidak auto-start.',
      quiz: [
        { q: 'Apa beda systemctl start dan systemctl enable?', options: ['Tidak ada bedanya', 'start = jalan sekarang saja; enable = otomatis jalan setiap boot', 'enable lebih cepat', 'start hanya untuk root'], answer: 1, explain: 'Keduanya dibutuhkan untuk server: enable --now melakukan keduanya sekaligus.' },
        { q: 'Mengapa reload lebih aman dari restart untuk sshd saat diakses remote?', options: ['Karena lebih cepat', 'Karena reload membaca ulang config tanpa memutus koneksi SSH yang sedang berjalan', 'Karena reload tidak butuh sudo', 'Karena restart dilarang'], answer: 1, explain: 'restart menghentikan lalu menjalankan ulang = semua sesi SSH terputus; reload hanya refresh config.' },
        { q: 'Service berstatus failed. Langkah pertama yang benar?', options: ['Langsung reinstall', 'journalctl -u <service> untuk membaca log error-nya', 'Reboot server', 'Abaikan saja'], answer: 1, explain: 'Baca log dulu (journalctl -u), pahami error, perbaiki penyebabnya, baru restart — troubleshooting sistematis, bukan tebak-tebakan.' },
      ],
    },
    {
      id: '33.7',
      title: 'systemd',
      body: `<p><b>systemd</b> adalah "manajer" utama Linux modern (PID 1 — process pertama yang jalan saat boot): ia yang menyalakan service berurutan, menjaganya tetap hidup, dan mencatat log-nya. <code>systemctl</code> (33.6) hanyalah remote control-nya; systemd adalah mesinnya.</p>
<h3>Unit File: Resep Sebuah Service</h3>
<p>Setiap service didefinisikan oleh <b>unit file</b> berekstensi <code>.service</code>. Contoh sederhana:</p>
<pre>$ cat /etc/systemd/system/noc-healthcheck.service
[Unit]
Description=NOC Health Check tiap 5 menit
After=network.target
# ALASAN After: jangan jalankan sebelum network siap — service monitoring
# butuh jaringan untuk ping/API ke perangkat.

[Service]
Type=oneshot
User=noc-admin
ExecStart=/home/noc-admin/scripts/healthcheck.sh
# oneshot = jalan sekali lalu selesai (untuk tugas terjadwal, bukan daemon)

[Install]
WantedBy=multi-user.target
# target = "kapan service ini ikut menyala" (multi-user = mode server normal)</pre>
<h3>Timer: Pengganti cron Modern</h3>
<p>Untuk menjalankan script terjadwal, systemd punya <b>timer unit</b> (alternatif cron dengan logging terintegrasi):</p>
<pre>$ cat /etc/systemd/system/noc-healthcheck.timer
[Unit]
Description=Jalankan health check tiap 5 menit

[Timer]
OnBootSec=2min          # pertama kali: 2 menit setelah boot
OnUnitActiveSec=5min    # berikutnya: tiap 5 menit setelah run terakhir

[Install]
WantedBy=timers.target</pre>
<pre>$ sudo systemctl daemon-reload          # WAJIB setelah buat/edit unit file: baca ulang definisi
$ sudo systemctl enable --now noc-healthcheck.timer
$ systemctl list-timers                 # lihat semua timer dan jadwal berikutnya</pre>
<h3>Alur Boot (yang Perlu Dipahami NOC)</h3>
<p>Power on → kernel → <b>systemd (PID 1)</b> → target berurutan (network.target → multi-user.target) → service yang di-enable dinyalakan sesuai <code>After</code>/<code>Wants</code>. Server yang "lama boot" biasanya tersangkut di satu service yang timeout — terlihat di <code>systemd-analyze blame</code>.</p>
<div class="callout blue"><div class="t">systemd vs cron</div><p style="margin:4px 0 0">cron tetap valid dan sederhana untuk jadwal sederhana. Pilih systemd timer bila butuh: log terintegrasi (journalctl), dependensi (jalan setelah network siap), dan akurasi. Di Part 35, script backup MikroTik akan dijadwalkan dengan salah satunya.</p></div>`,
      terms: [
        ['systemd', 'Manajer sistem Linux modern (PID 1): mengatur boot, service, dan log.'],
        ['Unit file', 'File definisi .service/.timer berisi "resep" cara menjalankan service.'],
        ['Timer', 'Unit systemd untuk penjadwalan — alternatif cron yang modern.'],
        ['Target', 'Titik sinkronisasi boot (mis. network.target, multi-user.target).'],
      ],
      diagram: `<pre>        ALUR BOOT SYSTEMD (disederhanakan)

  Power ON → Kernel → systemd (PID 1)
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        network.target    timers.target    multi-user.target
              │                 │                 │
              ▼                 ▼                 ▼
        sshd, NetworkMgr   healthcheck.timer   zabbix-server
        (jaringan siap)    (jadwal jalan)      (monitoring jalan)

  After= : "jangan start saya sebelum target itu siap"</pre>`,
      scenario: 'Script backup config router dijadwalkan via cron tapi sering gagal dengan "network unreachable" — cron menjalankannya terlalu pagi saat network belum siap. Migrasi ke systemd timer dengan After=network-online.target: 0 gagal dalam 3 bulan.',
      bestPractices: 'Setelah membuat/mengedit unit file: selalu daemon-reload, lalu enable --now, lalu verifikasi dengan status dan list-timers. Simpan unit file custom di /etc/systemd/system (jangan edit bawaan /lib).',
      security: 'Jalankan service dengan User= non-root di unit file (least privilege). Batasi akses tulis unit file hanya untuk root — unit file yang bisa ditulis penyerang = eksekusi command sebagai root saat boot.',
      challenge: 'Buat timer yang menjalankan script /home/noc-admin/scripts/healthcheck.sh (buat dummy: echo OK) tiap 10 menit. Verifikasi dengan systemctl list-timers dan journalctl.',
      interviewQ: 'Q: Apa beda systemd timer dan cron? — A: Keduanya penjadwal; timer terintegrasi dengan systemd sehingga punya logging via journalctl, dependensi (After=network.target), dan manajemen terpusat via systemctl. cron lebih sederhana untuk jadwal sebaris.',
      quiz: [
        { q: 'Apa peran systemd dalam Linux?', options: ['Text editor', 'Manajer sistem (PID 1): mengatur urutan boot, service, timer, dan log', 'Web browser', 'Antivirus'], answer: 1, explain: 'systemd adalah process pertama (PID 1) yang mengorkestrasi seluruh lifecycle sistem: boot → service → shutdown.' },
        { q: 'Setelah membuat file .service baru, command wajib apa yang harus dijalankan?', options: ['reboot', 'systemctl daemon-reload agar systemd membaca ulang definisi', 'rm file tersebut', 'Tidak perlu apa-apa'], answer: 1, explain: 'systemd meng-cache definisi unit; daemon-reload memaksanya membaca ulang file baru/berubah.' },
        { q: 'Apa fungsi After=network.target di unit file?', options: ['Mempercepat boot', 'Memastikan service baru dijalankan setelah network siap — penting untuk service yang butuh jaringan', 'Menonaktifkan network', 'Hanya komentar'], answer: 1, explain: 'Dependensi boot: service monitoring/automation yang butuh jaringan harus menunggu network.target agar tidak gagal saat start.' },
      ],
    },
    {
      id: '33.8',
      title: 'SSH',
      body: `<p><b>SSH (Secure Shell)</b> adalah protokol untuk mengakses dan mengelola mesin remote secara aman lewat jaringan — "kabel console virtual" terenkripsi. Setiap hari NOC: SSH ke router, switch, dan server. SSH berjalan di <b>TCP port 22</b>, mengenkripsi seluruh sesi (termasuk password) sehingga aman dipakai lewat internet.</p>
<h3>Dasar: Login dan Key</h3>
<pre>$ ssh noc-admin@192.168.99.10
# format: ssh user@host — pertama kali akan ditanya "are you sure?"
# (verifikasi fingerprint server), lalu diminta password.

$ ssh-keygen -t ed25519 -C "noc-admin@laptop"
# -t ed25519 = tipe key modern (aman & cepat); -C = komentar/label
# Menghasilkan: ~/.ssh/id_ed25519 (PRIVATE - rahasia!) dan .pub (PUBLIC - boleh disebar)
# ALASAN ed25519: lebih aman dan key-nya pendek dibanding RSA 2048.

$ ssh-copy-id noc-admin@192.168.99.10
# menyalin PUBLIC key ke server → login berikutnya TANPA password (pakai key)
# ALASAN key > password: key 256-bit tidak bisa di-brute-force; password bisa.</pre>
<h3>SSH Config: Jalan Pintas NOC</h3>
<pre>$ cat ~/.ssh/config
Host chr-core
    HostName 192.168.99.1
    User admin
    IdentityFile ~/.ssh/id_ed25519
# Sekarang cukup: ssh chr-core  (tanpa hafal IP/user tiap perangkat!)

$ ssh -J chr-core admin@192.168.20.1
# -J = JumpHost: "loncat" via chr-core untuk mencapai host di baliknya
# ALASAN: pola bastion — satu pintu masuk aman ke network management (VLAN 99).</pre>
<h3>File Config SSH Server</h3>
<p><code>/etc/ssh/sshd_config</code> mengatur perilaku server SSH. Yang penting untuk NOC:</p>
<pre>PermitRootLogin prohibit-password   # root tidak boleh login pakai password
PasswordAuthentication no           # matikan password bila semua sudah pakai key
Port 22                             # default; ganti port BUKAN keamanan (obscurity saja)</pre>
<p>Setelah edit: <code>sudo systemctl reload sshd</code> (reload, bukan restart — lihat 33.6!).</p>
<div class="callout"><div class="t">SSH dan Automation</div><p style="margin:4px 0 0">Key-based auth adalah fondasi CLI automation (Part 32.3, Part 35): script login tanpa interaksi password. Lindungi private key dengan passphrase + permission 600 (33.3).</p></div>`,
      terms: [
        ['SSH', 'Protokol akses remote terenkripsi (TCP 22) — cara utama mengelola perangkat/server.'],
        ['Key pair', 'Pasangan kunci kriptografi: private (rahasia, di laptop) + public (disebar ke server).'],
        ['ssh-copy-id', 'Tool menyalin public key ke server agar bisa login tanpa password.'],
        ['JumpHost / Bastion', 'Server perantara untuk mencapai host di jaringan dalam — satu pintu masuk terkontrol.'],
      ],
      diagram: `<pre>        SSH: KEY-BASED AUTH & JUMPHOST

  Key-based login (tanpa password):
  [laptop: private key] --tantangan kriptografi--> [server: public key cocok?]
        "buktikan kamu pegang private key"              ya → masuk

  JumpHost ke VLAN management:
  [laptop] --SSH--> [bastion 192.168.99.2] --SSH--> [switch 192.168.20.5]
                        ssh -J bastion user@switch
  Satu pintu masuk yang diaudit, bukan 50 port SSH terbuka ke internet.</pre>`,
      scenario: 'Server NOC diserang brute-force SSH: 40.000 percobaan login per hari dari internet (terlihat di auth.log). Solusi: pindah ke key-only auth (PasswordAuthentication no) + fail2ban — serangan langsung tidak berguna karena tidak ada password untuk ditebak.',
      bestPractices: 'Gunakan key ed25519 + passphrase untuk tiap engineer (satu key per orang per device, jangan share). Simpan Host entry di ~/.ssh/config agar tidak salah ketik IP production.',
      security: 'Private key = identitasmu. Permission 600, beri passphrase, JANGAN pernah kirim via chat/email. Cabut public key dari semua server saat orang keluar (authorized_keys).',
      challenge: 'Buat key ed25519, lalu ssh-copy-id ke VM lab-mu. Buat entry Host di ~/.ssh/config dan buktikan bisa login hanya dengan "ssh nama-host" tanpa password.',
      interviewQ: 'Q: Mengapa key-based auth lebih aman dari password untuk SSH? — A: Key 256-bit tidak bisa di-brute-force (ruang kunci astronomis), tidak bisa di-phishing seperti password, dan bisa dicabut per-key tanpa mengganggu user lain. Password bisa ditebak/dicuri.',
      quiz: [
        { q: 'File mana yang WAJIB dijaga kerahasiaannya dari key pair SSH?', options: ['Public key (.pub)', 'Private key (id_ed25519) — ia adalah identitasmu', 'File config', 'Keduanya sama-sama boleh disebar'], answer: 1, explain: 'Private key tidak boleh keluar dari laptopmu; public key memang dirancang untuk disebar ke server-server.' },
        { q: 'Apa fungsi ssh -J (JumpHost)?', options: ['Mempercepat koneksi', 'Meloncat via satu bastion host untuk mencapai server di jaringan dalam', 'Mengganti password', 'Menghapus log'], answer: 1, explain: '-J = proxy jump: satu pintu masuk terkontrol (bastion) menuju host di VLAN management, bukan membuka SSH tiap device ke internet.' },
        { q: 'Setelah mengedit /etc/ssh/sshd_config, command yang tepat adalah...', options: ['systemctl restart sshd', 'systemctl reload sshd — agar sesi SSH yang berjalan tidak terputus', 'reboot', 'Tidak perlu apa-apa'], answer: 1, explain: 'reload membaca ulang config tanpa memutus koneksi; restart memutus semua sesi — berbahaya saat kamu remote.' },
      ],
    },
    {
      id: '33.9',
      title: 'Network Interface',
      body: `<p><b>Network interface</b> adalah "pintu" tempat paket masuk-keluar sebuah mesin: <b>fisik</b> (<code>eth0</code>, <code>enp0s3</code> — kartu jaringan beneran) dan <b>virtual</b> (<code>lo</code> loopback, <code>docker0</code>, interface VLAN, tunnel VPN). Setiap interface punya <b>MAC address</b> (Layer 2) dan bisa punya <b>IP address</b> (Layer 3). Memahami interface = memahami "di pintu mana paket lewat".</p>
<h3>Nama Interface Modern</h3>
<p>Linux modern memakai nama prediktif: <code>enp0s3</code> = <b>e</b>thernet, bus <b>p</b>ci slot 0, <b>s</b>lot 3. Interface virtual punya nama sesuai fungsinya: <code>lo</code> (loopback 127.0.0.1 — "bicara ke diri sendiri"), <code>eth0.20</code> (sub-interface VLAN 20), <code>wg0</code> (WireGuard VPN).</p>
<h3>Konsep Operasional Interface</h3>
<ul>
<li><b>UP/DOWN:</b> status administratif — interface DOWN tidak memproses paket sama sekali (setara <code>disable</code> di MikroTik).</li>
<li><b>MTU:</b> ukuran paket maksimum (default 1500). MTU salah = paket besar gagal lewat (masalah klasik VPN).</li>
<li><b>Promiscuous mode:</b> interface menerima SEMUA paket di kabel, bukan hanya yang ditujukan ke MAC-nya — syarat <code>tcpdump</code>/Wireshark menangkap trafik orang lain (33.14).</li>
</ul>
<h3>Melihat Interface (Pengantar <code>ip</code>)</h3>
<pre>$ ip -brief link
lo               UNKNOWN        00:00:00:00:00:00
enp0s3           UP             08:00:27:ab:cd:ef
# -brief = ringkas; kolom: NAMA | STATUS | MAC
# Bandingkan dengan: /interface print di RouterOS — informasi yang sama!</pre>
<div class="callout blue"><div class="t">Paralel RouterOS ↔ Linux</div><p style="margin:4px 0 0"><code>/interface print</code> (RouterOS) ≈ <code>ip link</code> (Linux). <code>/ip address print</code> ≈ <code>ip address</code>. <code>/ip route print</code> ≈ <code>ip route</code>. Menguasai satu sisi membuat sisi lain terasa familiar — konsepnya sama, bungkusnya beda.</p></div>`,
      terms: [
        ['Network interface', '"Pintu" masuk-keluar paket: fisik (eth0) atau virtual (lo, vlan, tunnel).'],
        ['UP/DOWN', 'Status administratif interface; DOWN = tidak memproses paket.'],
        ['MTU', 'Maximum Transmission Unit — ukuran paket terbesar yang boleh lewat interface.'],
        ['Promiscuous mode', 'Mode interface menerima semua paket di medium — syarat packet capture.'],
      ],
      diagram: `<pre>        INTERFACE: PINTU PAKET (Layer 2 ↔ Layer 3)

                    ┌──────────────────┐
  kabel/fiber ──▶   │  enp0s3 (UP)     │──▶ ke TCP/IP stack
  MAC 08:00:27:... │  MTU 1500        │    (IP 192.168.99.10/24)
                    │  MAC = Layer 2   │
                    │  IP  = Layer 3   │
                    └──────────────────┘
  lo (loopback): 127.0.0.1 — paket "ke diri sendiri",
                  tidak pernah keluar kabel (untuk testing lokal).</pre>`,
      scenario: 'VM monitoring tidak bisa ping gateway. ip -brief link → interface enp0s3 berstatus DOWN (kabel virtual terlepas di hypervisor). Solusi: attach ulang vNIC di hypervisor, interface UP kembali. Tanpa cek interface, orang bisa menghabiskan jam mengutak-atik routing yang tidak rusak.',
      bestPractices: 'Saat "tidak bisa konek", urutan cek: interface UP? (Layer 1/2) → IP benar? (Layer 3) → route ada? → baru curigai firewall/remote. Ikuti OSI dari bawah.',
      security: 'Interface yang tidak dipakai sebaiknya DOWN. Promiscuous mode hanya untuk host capture yang berwenang — di jaringan shared, itu berarti bisa mengintip trafik.',
      challenge: 'Jalankan ip -brief link dan ip -brief address di VM-mu. Identifikasi: mana interface fisik, mana loopback, berapa MTU-nya, dan IP apa yang terpasang?',
      interviewQ: 'Q: Apa beda interface UP/DOWN dengan kabel tercabut? — A: DOWN adalah status administratif (dimatikan via software, setara disable); kabel tercabut adalah masalah fisik (Layer 1) — interface bisa UP tapi "no carrier". Keduanya berakibat tidak ada trafik, penyebabnya beda.',
      quiz: [
        { q: 'Apa itu network interface?', options: ['Sebuah aplikasi chat', 'Pintu masuk-keluar paket pada mesin, bisa fisik (eth0) atau virtual (lo, vlan)', 'Jenis kabel', 'Sebuah website'], answer: 1, explain: 'Interface = attachment point ke jaringan; tiap interface punya MAC (L2) dan biasanya IP (L3).' },
        { q: 'Apa fungsi promiscuous mode?', options: ['Mempercepat interface', 'Membuat interface menerima SEMUA paket di medium — syarat tcpdump/Wireshark menangkap trafik', 'Mematikan interface', 'Mengubah MAC address'], answer: 1, explain: 'Normalnya NIC membuang paket yang bukan untuk MAC-nya; promiscuous menonaktifkan filter itu untuk keperluan capture/analisis.' },
        { q: 'Interface berstatus DOWN artinya...', options: ['Kabel putus', 'Dimatikan secara administratif — tidak memproses paket sama sekali', 'IP-nya salah', 'Driver rusak'], answer: 1, explain: 'DOWN = administratif (software). Kabel putus tampil sebagai UP tapi NO-CARRIER. Bedakan keduanya saat troubleshooting.' },
      ],
    },
    {
      id: '33.10',
      title: 'ip command',
      body: `<p><b><code>ip</code></b> adalah "pisau lipat" networking Linux — pengganti modern tool lama (<code>ifconfig</code>, <code>route</code>, <code>arp</code>). Satu command untuk melihat dan mengatur interface, address, route, dan neighbor (ARP). Di NOC, <code>ip</code> adalah command pertama saat "server tidak bisa konek".</p>
<h3>Empat Subcommand Wajib</h3>
<pre>$ ip -brief address
# = /ip address print di MikroTik: IP apa terpasang di interface mana
enp0s3           UP             192.168.99.10/24

$ ip route
default via 192.168.99.1 dev enp0s3
192.168.99.0/24 dev enp0s3 proto kernel scope link src 192.168.99.10
# = /ip route print: "paket ke mana lewat mana"
# Membaca: default (0.0.0.0/0) → via gateway 192.168.99.1 lewat enp0s3

$ ip neighbor
192.168.99.1 dev enp0s3 lladdr 08:00:27:11:22:33 REACHABLE
# = /ip arp print: tabel ARP — IP siapa MAC-nya apa (Layer 2 ↔ 3)

$ ip -s link show enp0s3
# -s = statistics: RX/TX packets, bytes, errors, dropped
# errors/dropped naik terus = indikasi masalah fisik (kabel, duplex, MTU)</pre>
<h3>Mengubah Konfigurasi (Sementara!)</h3>
<pre>$ sudo ip address add 192.168.20.50/24 dev enp0s3
# tambah IP — HILANG saat reboot/network restart (tidak persisten!)
# ALASAN: ip hanya mengubah kernel runtime. Config permanen di netplan
# (/etc/netplan/*.yaml) atau NetworkManager. Jangan tertipu!

$ sudo ip link set enp0s3 down     # matikan interface (setara disable)
$ sudo ip link set enp0s3 up       # nyalakan lagi
$ sudo ip route add 192.168.30.0/24 via 192.168.99.1   # tambah static route</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Perubahan via <code>ip</code> command hilang saat reboot — cocok untuk TESTING di lab ("coba tambah route ini, berhasil?"). Untuk permanen, tulis ke netplan/NetworkManager lalu <code>netplan apply</code>. Di production, JANGAN andalkan command temporer tanpa dokumentasi.</p></div>`,
      terms: [
        ['ip (command)', 'Tool modern Linux untuk interface, address, route, neighbor — pengganti ifconfig/route/arp.'],
        ['ip address', 'Melihat/mengatur IP di interface (setara /ip address di RouterOS).'],
        ['ip route', 'Melihat/mengatur tabel routing (setara /ip route).'],
        ['ip neighbor', 'Tabel ARP: pemetaan IP ke MAC (setara /ip arp).'],
      ],
      diagram: `<pre>        EMPAT PERTANYAAN, EMPAT SUBCOMMAND ip

  "Pintu mana yang ada?"      →  ip link       (interface, UP/DOWN, MAC)
  "IP apa di pintu itu?"      →  ip address    (alamat Layer 3)
  "Paket ke X lewat mana?"    →  ip route      (tabel routing)
  "MAC tetangga saya siapa?"  →  ip neighbor   (tabel ARP)

  Urutan troubleshooting konektivitas = urutan di atas (OSI dari bawah).</pre>`,
      scenario: 'Server baru tidak bisa diakses dari VLAN 20. ip address → IP benar 192.168.20.50/24. ip route → TIDAK ADA default gateway! Penyebab: netplan salah tulis gateway. Perbaiki netplan, netplan apply, konek. Tanpa ip route, orang bisa salah menuduh firewall.',
      bestPractices: 'Hafalkan 4 subcommand + flag -brief dan -s. Untuk perubahan permanen selalu via netplan/NetworkManager, bukan command ip temporer.',
      security: 'ip neighbor menunjukkan siapa mengklaim IP apa — REACHABLE yang tiba-tiba berubah MAC bisa indikasi ARP spoofing. Bandingkan dengan baseline.',
      challenge: 'Di VM-mu: tampilkan ip route dan jelaskan tiap baris dengan kata-katamu. Lalu tambah static route dummy ke 192.168.99.0/24 via gateway lain, verifikasi, lalu hapus lagi (ip route del).',
      interviewQ: 'Q: Server tidak bisa ping gateway. Urutan command ip apa yang kamu jalankan? — A: ip -brief link (interface UP?), ip -brief address (IP/subnet benar?), ip route (gateway/route ada?), ip neighbor (ARP gateway resolved?). Ikuti OSI dari bawah.',
      quiz: [
        { q: 'Subcommand ip apa yang setara dengan /ip route print di MikroTik?', options: ['ip link', 'ip route', 'ip address', 'ip neighbor'], answer: 1, explain: 'ip route menampilkan tabel routing: "paket ke tujuan X dikirim via gateway Y lewat interface Z".' },
        { q: 'Apa arti flag -s pada ip -s link?', options: ['Silent', 'Statistics: menampilkan counter RX/TX packets, bytes, errors, dropped', 'Save', 'Secure'], answer: 1, explain: '-s = statistics. Counter errors/dropped yang terus naik = petunjuk masalah Layer 1/2 (kabel, duplex, MTU).' },
        { q: 'Mengapa IP yang ditambah via ip address add hilang setelah reboot?', options: ['Karena bug Linux', 'Karena ip hanya mengubah konfigurasi runtime di kernel — config permanen harus ditulis ke netplan/NetworkManager', 'Karena IP kedaluwarsa', 'Karena harus pakai sudo dua kali'], answer: 1, explain: 'Command ip = perubahan temporer untuk testing. Persistensi = file config (netplan) + apply.' },
      ],
    },
    {
      id: '33.11',
      title: 'ss',
      body: `<p><b><code>ss</code> (socket statistics)</b> adalah pengganti modern <code>netstat</code>: menampilkan <b>koneksi jaringan aktif dan port yang listening</b> di mesin. Pertanyaan yang dijawab ss: "service apa sedang mendengarkan di port berapa?" dan "mesin ini sedang konek ke siapa?" — fundamental saat verifikasi instalasi Zabbix/Grafana ("apakah port 10050/3000 benar-benar listen?").</p>
<h3>Flag Wajib Hafal</h3>
<pre>$ ss -tulpn
# -t = TCP, -u = UDP, -l = listening saja, -p = tampilkan PROCESS-nya, -n = jangan resolve nama (cepat)
# Output (disingkat):
tcp   LISTEN  0  128  0.0.0.0:22    0.0.0.0:*  users:(("sshd",pid=800))
tcp   LISTEN  0  128  0.0.0.0:10050 0.0.0.0:*  users:(("zabbix_server",pid=1024))
# Membaca: sshd LISTEN di SEMUA IP (0.0.0.0) port 22; zabbix_server di port 10050.

$ ss -tun state established
# hanya koneksi yang ESTABLISHED (benar-benar tersambung) — "mesin ini bicara dengan siapa?"

$ ss -tlnp | grep 443
# apakah ada yang listen di 443? (verifikasi web server / REST API)</pre>
<h3>State Koneksi TCP (Penting untuk Troubleshooting)</h3>
<div class="tblwrap"><table>
<tr><th>State</th><th>Arti</th><th>Indikasi Masalah</th></tr>
<tr><td>LISTEN</td><td>Menunggu koneksi masuk</td><td>Service tidak LISTEN = service mati / bind gagal</td></tr>
<tr><td>ESTABLISHED</td><td>Koneksi aktif dua arah</td><td>Normal</td></tr>
<tr><td>SYN-SENT</td><td>Menunggu jawaban SYN-ACK</td><td>Banyak = target tidak menjawab / firewall drop</td></tr>
<tr><td>TIME-WAIT</td><td>Koneksi baru ditutup, menunggu</td><td>Ribuan = aplikasi tidak reuse koneksi (bocor)</td></tr>
</table></div>
<p><b>Kasus klasik:</b> aplikasi "tidak bisa konek ke database" — <code>ss -tun</code> di sisi client menunjukkan banyak <code>SYN-SENT</code> ke port DB = paket SYN tidak dijawab → cek firewall / apakah service DB benar-benar LISTEN di server (<code>ss -tlnp</code> di sana).</p>`,
      terms: [
        ['ss', 'Socket statistics: melihat koneksi aktif dan port listening (pengganti netstat).'],
        ['LISTEN', 'State socket menunggu koneksi masuk — bukti service hidup dan bind ke port.'],
        ['ESTABLISHED', 'State koneksi TCP aktif dua arah.'],
        ['Socket', 'Titik akhir komunikasi (IP + port) di sebuah mesin.'],
      ],
      diagram: `<pre>        MEMBACA ss -tulpn

  tcp  LISTEN  0  128  0.0.0.0:10050  0.0.0.0:*  users:(("zabbix_server",pid=1024))
  │     │             │         │              └── process pemiliknya (-p)
  │     │             │         └── port 10050 di SEMUA interface (0.0.0.0)
  │     │             └── antrian (Recv-Q Send-Q)
  │     └── state: menunggu koneksi masuk
  └── protokol TCP (-t)

  "Apakah Zabbix server hidup?" → cari baris LISTEN :10050. Tidak ada = masalah.</pre>`,
      scenario: 'Setelah install Grafana, dashboard tidak bisa dibuka dari browser. ss -tlnp | grep 3000 → KOSONG: Grafana tidak listen! Ternyata service gagal start karena port dipakai process lain (terlihat di journalctl). Fix port conflict, restart, ss menunjukkan LISTEN — dashboard terbuka.',
      bestPractices: 'Selalu verifikasi instalasi service dengan ss -tulpn (apakah port-nya listen?) sebelum menyalahkan firewall atau jaringan. Kombinasikan dengan -p untuk tahu process pemiliknya.',
      security: 'ss -tulpn adalah audit cepat permukaan serangan: tiap baris LISTEN = pintu masuk potensial. Port asing yang listen = investigasi (mungkin backdoor atau service lupa dimatikan).',
      challenge: 'Jalankan ss -tulpn di VM-mu dan identifikasi tiap baris LISTEN: service apa, port berapa. Adakah yang tidak kamu kenal? Cari tahu process-nya.',
      interviewQ: 'Q: Web server tidak bisa diakses. Bagaimana memastikan masalahnya bukan di server itu sendiri? — A: ss -tlnp di server: apakah service LISTEN di port yang benar dan di interface yang benar (0.0.0.0 vs 127.0.0.1)? Bila tidak LISTEN = masalah lokal; bila LISTEN = lanjut cek firewall/jaringan.',
      quiz: [
        { q: 'Apa fungsi flag -p pada ss -tulpn?', options: ['Print berwarna', 'Menampilkan process (nama + PID) pemilik tiap socket', 'Mode privat', 'Pause output'], answer: 1, explain: '-p = process: mengaitkan tiap baris LISTEN/koneksi ke program pemiliknya — kunci identifikasi "port ini milik siapa".' },
        { q: 'Banyak koneksi berstatus SYN-SENT ke satu target menandakan...', options: ['Koneksi normal', 'SYN tidak dijawab — target mati, port tertutup, atau firewall men-drop', 'Bandwidth penuh', 'DNS rusak'], answer: 1, explain: 'SYN-SENT = sudah kirim SYN, menunggu SYN-ACK. Menumpuk = handshake tidak pernah selesai (tiga kemungkinan di atas).' },
        { q: 'Mengapa memakai -n pada ss?', options: ['Agar output berwarna', 'Agar tidak melakukan DNS reverse lookup — output cepat dan tidak menggantung saat DNS bermasalah', 'Agar hanya tampil 10 baris', 'Wajib secara hukum'], answer: 1, explain: 'Tanpa -n, ss mencoba resolve tiap IP ke hostname via DNS — lambat dan bisa hang tepat saat kamu troubleshooting masalah jaringan.' },
      ],
    },
    {
      id: '33.12',
      title: 'ping',
      body: `<p><b><code>ping</code></b> mengirim paket <b>ICMP Echo Request</b> dan menunggu <b>Echo Reply</b> — "apakah kamu di sana?" versi jaringan. Tool pertama dan paling sering dipakai NOC. Tapi ping yang baik bukan sekadar "RTO atau tidak" — flag-nya memberi diagnosa presisi.</p>
<h3>Flag Penting</h3>
<pre>$ ping -c 4 192.168.99.1
# -c 4 = kirim tepat 4 paket lalu berhenti (tanpa -c, ping jalan TERUS sampai Ctrl+C!)
# ALASAN -c di script: tanpa batas, script monitoring menggantung selamanya.

$ ping -i 0.2 -c 20 192.168.99.1
# -i 0.2 = interval 0.2 detik (butuh root untuk < 0.2) — untuk deteksi loss cepat

$ ping -s 1400 192.168.99.1
# -s 1400 = ukuran payload 1400 byte — uji apakah paket BESAR lolos (masalah MTU!)

$ ping -M do -s 1472 192.168.99.1
# -M do = "do not fragment": paket tidak boleh dipecah.
# 1472 + 28 (header IP+ICMP) = 1500 = MTU standar.
# GAGAL dengan -M do tapi SUKSES tanpa itu = MTU path < 1500 (kecilkan sampai sukses
# untuk menemukan MTU sebenarnya — teknik path MTU discovery manual!)</pre>
<h3>Membaca Output</h3>
<pre>$ ping -c 4 192.168.99.1
64 bytes from 192.168.99.1: icmp_seq=1 ttl=64 time=0.523 ms
# time = round-trip time (latency); ttl=64 = sisa hop (64 = Linux, 128 = Windows, 255 = router)
--- 192.168.99.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
rtt min/avg/max/mdev = 0.412/0.518/0.623/0.078 ms
# rtt = latency; mdev (std dev) besar = jitter tinggi = kualitas buruk (VoIP/CCTV menderita)</pre>
<h3>Batas ping</h3>
<p>Ping sukses <b>hanya</b> membuktikan ICMP bisa bolak-balik. Banyak firewall memblokir ICMP padahal TCP/UDP jalan normal — "ping RTO" belum tentu "mati". Selalu konfirmasi dengan test <b>port spesifik</b> (mis. curl ke port 443) sebelum menyimpulkan.</p>`,
      terms: [
        ['ping', 'Tool ICMP Echo untuk uji keterjangkauan dan mengukur latency/packet loss.'],
        ['ICMP', 'Protokol pesan kontrol Layer 3 (echo, unreachable, time-exceeded).'],
        ['RTT', 'Round-Trip Time — waktu paket pergi-pulang; ukuran latency.'],
        ['Packet loss', 'Persentase paket yang tidak kembali — 0% ideal, >1% indikasi masalah.'],
      ],
      diagram: `<pre>        ANATOMI SATU PING

  [kamu] ── ICMP Echo Request ──▶ [target 192.168.99.1]
  [kamu] ◀── ICMP Echo Reply ──   [target]
           ▲
           └── time=0.523 ms (RTT) | ttl=64 (sisa hop)

  Gagal dengan -M do -s 1472 tapi sukses tanpa -M do
  → ada perangkat di path dengan MTU < 1500 (turunkan -s sampai sukses).</pre>`,
      scenario: 'CCTV di VLAN 10 ngadat (gambar patah-patah). ping -c 100 ke NVR: 0% loss tapi mdev 85ms (jitter tinggi!). ping -s 1400: 30% loss — paket besar gagal. Diagnosis: link wireless ke gedung itu kepenuhan/kualitas buruk untuk paket besar. Solusi: turunkan resolusi stream atau perbaiki link.',
      bestPractices: 'Selalu pakai -c di script dan saat testing cepat. Untuk baseline kualitas link: ping -c 100 dan lihat loss + mdev, bukan sekadar "reply atau tidak".',
      security: 'Banyak server production memblokir ICMP inbound — itu normal dan bukan indikasi mati. Jangan buka ICMP lebar-lebar hanya agar "bisa di-ping NOC"; izinkan dari IP monitoring saja.',
      challenge: 'Ping gateway lab-mu dengan: -c 10 (normal), lalu -M do -s 1472, lalu -M do -s 9000. Catat hasilnya dan simpulkan MTU path ke gateway.',
      interviewQ: 'Q: Ping ke server RTO, tapi aplikasi web-nya normal. Jelaskan! — A: Ping memakai ICMP; firewall server memblokir ICMP tapi mengizinkan TCP 443. RTO ping ≠ server mati. Verifikasi dengan curl ke port layanannya.',
      quiz: [
        { q: 'Apa fungsi ping -M do -s 1472?', options: ['Mempercepat ping', 'Mengirim paket 1500 byte yang tidak boleh di-fragment — untuk mendeteksi masalah MTU di path', 'Mengirim 1472 paket', 'Mode diam-diam'], answer: 1, explain: '1472 payload + 28 header = 1500 (MTU standar). Gagal = ada perangkat dengan MTU lebih kecil di path.' },
        { q: 'Nilai mdev yang besar pada statistik ping menandakan...', options: ['Koneksi sangat cepat', 'Jitter tinggi — latency tidak stabil, buruk untuk VoIP/CCTV real-time', 'Server terlalu dekat', 'Ping salah ketik'], answer: 1, explain: 'mdev = standar deviasi RTT. Besar = waktu tempuh naik-turun liar = jitter; aplikasi real-time butuh latency STABIL.' },
        { q: 'Mengapa ping RTO belum tentu berarti host mati?', options: ['Karena ping selalu salah', 'Karena banyak firewall memblokir ICMP sementara layanan TCP/UDP tetap jalan normal', 'Karena kabel pasti putus', 'Karena ping hanya untuk Linux'], answer: 1, explain: 'Ping hanya menguji ICMP. Konfirmasi dengan test ke port layanan sebenarnya (curl/ssh) sebelum menyimpulkan host mati.' },
      ],
    },
    {
      id: '33.13',
      title: 'traceroute',
      body: `<p><b><code>traceroute</code></b> memetakan <b>rute paket hop-by-hop</b> dari kamu ke tujuan — "lewat router mana saja paketku berjalan?" Tool wajib saat user lapor "internet lambat" atau "tidak bisa akses server cabang": ia menunjukkan <b>di hop mana</b> masalah terjadi.</p>
<h3>Cara Kerja (Cerdik!)</h3>
<p>Traceroute mengeksploitasi field <b>TTL (Time To Live)</b> di header IP: setiap router yang melewatkan paket mengurangi TTL 1; saat TTL = 0, router membuang paket dan mengirim balik <b>ICMP Time Exceeded</b>. Traceroute mengirim paket dengan TTL=1 (dijawab router pertama), TTL=2 (router kedua), dst. — dan mencatat siapa menjawab tiap TTL. Tiga kolom waktu = tiga pengukuran RTT per hop.</p>
<pre>$ traceroute 8.8.8.8
 1  192.168.99.1 (gateway lab)   0.5 ms  0.4 ms  0.3 ms
 2  10.0.0.1 (router ISP)        8.2 ms  8.1 ms  9.0 ms
 3  * * *                        ← hop tidak menjawab ICMP (umum: firewall) — BUKAN berarti putus!
 4  142.250.x.x (google)         25 ms   24 ms   26 ms</pre>
<h3>Flag Penting</h3>
<pre>$ traceroute -I 8.8.8.8      # -I = pakai ICMP (seperti ping) — sering lolos firewall
$ traceroute -T -p 443 8.8.8.8
# -T = pakai TCP SYN ke port 443 — menelusuri path SEPERTI trafik web asli
# ALASAN: path ICMP dan path TCP bisa beda perlakuan firewall; -T menguji path sebenarnya.
$ traceroute -n 8.8.8.8       # -n = tanpa DNS lookup (cepat, tidak menggantung)</pre>
<h3>Membaca Hasil seperti NOC</h3>
<ul>
<li><b>Latensi melonjak di satu hop lalu menetap tinggi:</b> masalah di link menuju hop itu.</li>
<li><b><code>* * *</code> di tengah tapi hop berikutnya menjawab:</b> hop itu hanya tidak menjawab ICMP (normal) — abaikan.</li>
<li><b><code>* * *</code> sampai akhir:</b> paket tidak sampai tujuan — masalah di/lewat hop terakhir yang menjawab.</li>
<li><b>Rute asimetris:</b> pergi dan pulang bisa beda path — traceroute hanya menunjukkan path pergi.</li>
</ul>
<div class="callout blue"><div class="t">traceroute vs ping</div><p style="margin:4px 0 0">ping = "sampai atau tidak + berapa lama" (satu angka). traceroute = "<b>di mana</b> lambat/putus" (peta hop). Saat eskalasi ke ISP, lampirkan traceroute — itu bahasa yang mereka pahami.</p></div>`,
      terms: [
        ['traceroute', 'Tool pemetaan rute hop-by-hop dengan memanipulasi TTL paket.'],
        ['TTL', 'Time To Live: counter di header IP yang dikurangi tiap router; 0 = paket dibuang + ICMP Time Exceeded.'],
        ['Hop', 'Satu lompatan: tiap router yang dilewati paket.'],
      ],
      diagram: `<pre>        CARA KERJA TRACEROUTE (TTL trick)

  TTL=1  ──▶ [R1] ✖ (TTL habis) ── ICMP Time Exceeded ──▶ "hop 1 = R1"
  TTL=2  ──▶ [R1] ──▶ [R2] ✖ ── ICMP Time Exceeded ──▶ "hop 2 = R2"
  TTL=3  ──▶ [R1] ──▶ [R2] ──▶ [R3] ✖ ──▶ "hop 3 = R3"
  ...
  Setiap router mengurangi TTL 1. Yang "membunuh" paket
  memberitahu identitasnya lewat ICMP Time Exceeded.</pre>`,
      scenario: 'Kantor cabang lapor aplikasi pusat lambat. Traceroute dari cabang: hop 1-2 normal (2ms), hop 3 (link ISP) 350ms dan loss. Eskalasi ke ISP dengan bukti traceroute → ternyata link mereka congested; dipindah ke link backup. Tanpa traceroute, tuduhan bisa salah alamat ke server.',
      bestPractices: 'Selalu pakai -n agar cepat. Coba -I dan -T bila hasil default aneh (firewall sering memperlakukan ICMP/UDP/TCP berbeda). Simpan output traceroute "sehat" sebagai baseline.',
      security: 'Traceroute membocorkan topologi internal ke pihak luar — banyak perusahaan memfilter ICMP Time Exceeded di border. Itu sebabnya hop internet sering tampil * * *.',
      challenge: 'Traceroute ke gateway lab dan ke satu IP publik. Identifikasi tiap hop yang bisa diidentifikasi, dan jelaskan arti setiap baris * * * yang muncul.',
      interviewQ: 'Q: Traceroute menunjukkan * * * di hop 3 tapi hop 4-5 menjawab normal. Apakah ada masalah? — A: Tidak — hop 3 hanya tidak menjawab ICMP Time Exceeded (umum karena firewall/rate-limit), tapi ia meneruskan paket (buktinya hop 4 menjawab). Masalah hanya bila * * * berlanjut sampai akhir.',
      quiz: [
        { q: 'Bagaimana traceroute mengetahui alamat tiap hop?', options: ['Dengan menebak', 'Mengirim paket dengan TTL bertahap (1,2,3...); router yang menghabiskan TTL membalas ICMP Time Exceeded', 'Dengan bertanya ke DNS', 'Dengan GPS'], answer: 1, explain: 'Trik TTL: tiap router mengurangi TTL 1; yang membuat TTL=0 wajib memberitahu identitasnya via ICMP Time Exceeded.' },
        { q: 'Kapan sebaiknya memakai traceroute -T -p 443?', options: ['Tidak pernah', 'Saat ingin menelusuri path seperti trafik TCP/web asli — karena firewall bisa memperlakukan ICMP dan TCP berbeda', 'Hanya di Windows', 'Saat ingin lebih lambat'], answer: 1, explain: 'Default traceroute (UDP/ICMP) bisa difilter berbeda dari trafik aplikasi; -T menguji path yang benar-benar dilalui aplikasi.' },
        { q: 'Latensi melonjak di hop 3 dan tetap tinggi di hop-hop berikutnya. Kesimpulan?', options: ['Hop 4 yang rusak', 'Masalah ada di link menuju/keluar hop 3 — keterlambatan itu terbawa ke semua hop setelahnya', 'Semua hop rusak', 'Traceroute salah'], answer: 1, explain: 'RTT tiap hop bersifat kumulatif dari sumber; lonjakan yang menetap menunjuk ke link di hop tempat lonjakan pertama muncul.' },
      ],
    },
    {
      id: '33.14',
      title: 'tcpdump',
      body: `<p><b><code>tcpdump</code></b> menangkap dan menampilkan <b>paket mentah</b> yang lewat sebuah interface — "mikroskop" jaringan. Saat log tidak cukup ("aplikasi bilang timeout, tapi kenapa?"), tcpdump menunjukkan kebenaran level paket: apakah SYN sampai? apakah server menjawab? siapa yang me-reset?</p>
<h3>Dasar Penggunaan</h3>
<pre>$ sudo tcpdump -i enp0s3 -n
# -i = interface mana yang disadap; -n = tanpa DNS lookup (wajib agar cepat)
# ALASAN sudo: capture butuh promiscuous mode (33.9) — hak istimewa.

$ sudo tcpdump -i enp0s3 -n -c 20 port 443
# -c 20 = tangkap 20 paket lalu berhenti (tanpa -c, banjir paket!)
# "port 443" = FILTER: hanya tampilkan trafik HTTPS (hemat mata & CPU)

$ sudo tcpdump -i enp0s3 -n host 192.168.99.1 and port 22
# filter kombinasi: host TERTENTU dan port TERTENTU (and/or/not didukung)</pre>
<h3>Filter: Bahasa BPF (Penting!)</h3>
<p>Di jaringan sibuk, capture tanpa filter = ribuan paket/detik yang tidak terbaca. Filter <b>BPF (Berkeley Packet Filter)</b>:</p>
<div class="tblwrap"><table>
<tr><th>Filter</th><th>Arti</th><th>Pakai Saat</th></tr>
<tr><td><code>host 192.168.99.1</code></td><td>Paket ke/dari IP itu</td><td>Fokus ke satu device</td></tr>
<tr><td><code>port 53</code></td><td>Trafik DNS</td><td>Masalah "tidak bisa buka website"</td></tr>
<tr><td><code>icmp</code></td><td>Hanya ICMP</td><td>Analisis ping/traceroute</td></tr>
<tr><td><code>tcp[tcpflags] & tcp-syn != 0</code></td><td>Hanya paket SYN</td><td>Diagnosis handshake gagal</td></tr>
</table></div>
<h3>Membaca Output: Kisah Tiga Paket</h3>
<pre>$ sudo tcpdump -i enp0s3 -n -c 3 port 22
10:00:01 IP 192.168.99.50.54321 > 192.168.99.10.22: Flags [S], seq 100
10:00:01 IP 192.168.99.10.22 > 192.168.99.50.54321: Flags [S.], seq 200, ack 101
10:00:01 IP 192.168.99.50.54321 > 192.168.99.10.22: Flags [.], ack 201
# [S] = SYN, [S.] = SYN+ACK, [.] = ACK → THREE-WAY HANDSHAKE normal (Part 02)!
# Bila hanya [S] berulang tanpa [S.] = server tidak menjawab (mati/firewall).</pre>
<h3>Menyimpan untuk Analisis</h3>
<pre>$ sudo tcpdump -i enp0s3 -n -w capture.pcap port 443
# -w = tulis ke file pcap (dibuka di Wireshark untuk analisis mendalam GUI)
# ALASAN: capture dulu (cepat), analisis kemudian (tenang) — pola forensik.</pre>
<div class="callout"><div class="t">LAB vs Production — Etika Capture</div><p style="margin:4px 0 0">tcpdump bisa menangkap <b>password dan data sensitif</b> yang lewat sebagai teks biasa. Di LAB bebas bereksperimen. Di PRODUCTION: butuh otorisasi tertulis, batasi durasi dan filter sesempit mungkin, hapus file pcap setelah analisis, JANGAN capture di link yang membawa data rahasia tanpa izin.</p></div>`,
      terms: [
        ['tcpdump', 'Tool command-line untuk menangkap dan menampilkan paket jaringan mentah.'],
        ['BPF', 'Berkeley Packet Filter — bahasa filter capture (host/port/and/or).'],
        ['pcap', 'Format file hasil capture; bisa dibuka di Wireshark.'],
        ['Promiscuous mode', 'Syarat interface untuk menangkap paket bukan miliknya (butuh hak root).'],
      ],
      diagram: `<pre>        MEMBACA HANDSHAKE DI TCPDUMP

  Normal (koneksi sukses):          Gagal (server tidak menjawab):
  [S]    client → server           [S]    client → server
  [S.]   server → client           [S]    client → server (retry)
  [.]    client → server           [S]    client → server (retry...)
                                   → diagnosis: firewall / service mati

  [R] = RST (reset): salah satu pihak menolak/mematikan paksa.
  [F] = FIN: penutupan normal. [P] = data (push).</pre>`,
      scenario: 'Aplikasi ke server database timeout. Log aplikasi hanya bilang "connection timeout". tcpdump di client: terlihat [S] berulang tanpa [S.] → SYN tidak dijawab. tcpdump di server: SYN TIDAK SAMPAI → berarti ada yang men-drop di tengah (firewall). Tanpa tcpdump, tim bisa saling tuduh seminggu.',
      bestPractices: 'Selalu pakai -n dan filter sesempit mungkin. Capture ke file (-w) untuk analisis tenang; batasi jumlah paket (-c) atau durasi. Pelajari pola [S]/[S.]/[.]/[R] sampai hafal di luar kepala.',
      security: 'File pcap = rekaman mentah trafik, bisa berisi kredensial. Enkripsi/hapus setelah dipakai, jangan upload ke tempat publik, dan patuhi kebijakan capture perusahaan.',
      challenge: 'Di VM lab: buka dua terminal. Terminal 1: sudo tcpdump -i any -n -c 10 icmp. Terminal 2: ping -c 5 8.8.8.8 (atau gateway). Amati paket echo request/reply di terminal 1 dan cocokkan dengan output ping.',
      interviewQ: 'Q: Bagaimana membedakan "server mati" vs "firewall block" dengan tcpdump? — A: Capture di client: bila [S] dikirim tapi tidak ada balasan SAMA SEKALI dan di server paket tidak sampai = di-drop di tengah (firewall). Bila server menerima SYN tapi membalas [R] (RST) = server hidup tapi port tertutup/tidak ada service.',
      quiz: [
        { q: 'Mengapa tcpdump membutuhkan sudo?', options: ['Agar tampil berwarna', 'Karena capture butuh promiscuous mode — hak istimewa untuk mengakses paket mentah', 'Karena tanpa sudo lambat', 'Tidak butuh sudo sebenarnya'], answer: 1, explain: 'Mengakses interface dalam promiscuous mode dan membaca paket mentah adalah operasi privileged di kernel.' },
        { q: 'Di tcpdump terlihat paket [S] berulang-ulang tanpa balasan [S.]. Artinya...', options: ['Koneksi normal', 'SYN tidak dijawab — server mati, port tertutup, atau firewall men-drop', 'Transfer data selesai', 'DNS bermasalah'], answer: 1, explain: 'Handshake berhenti di langkah 1: SYN dikirim tapi SYN-ACK tak kunjung datang. Lanjut investigasi ke sisi server/firewall.' },
        { q: 'Apa fungsi -w capture.pcap pada tcpdump?', options: ['Menghapus capture', 'Menyimpan paket mentah ke file pcap untuk dianalisis kemudian (mis. di Wireshark)', 'Menampilkan di web', 'Mengirim via email'], answer: 1, explain: 'Pola forensik: capture cepat ke file, analisis tenang kemudian — file pcap bisa dibuka di Wireshark dengan GUI penuh.' },
      ],
    },
    {
      id: '33.15',
      title: 'curl',
      body: `<p><b><code>curl</code></b> adalah tool baris perintah untuk mengirim request ke URL dan melihat response-nya — "browser versi terminal" yang juga bicara ke API. Kamu sudah memakainya di Part 32 untuk REST API MikroTik. Di NOC, curl dipakai untuk: test API, cek web server, dan men-debug HTTP.</p>
<h3>Flag Esensial</h3>
<pre>$ curl https://192.168.99.1/rest/interface -u admin:xxx -k
# -u = basic auth, -k = abaikan validasi sertifikat (LAB saja!)

$ curl -i https://example.com
# -i = tampilkan RESPONSE HEADER + body — lihat status code & server info
# HTTP/2 200  ← status code: 200 OK = sukses

$ curl -s -o /dev/null -w "%{http_code} %{time_total}s" https://example.com
# -s = silent (tanpa progress bar, untuk script)
# -o /dev/null = buang body (hanya butuh status)
# -w = format output kustom: tampilkan HTTP code + total waktu → MONITORING SEDERHANA!

$ curl -X POST https://192.168.99.1/rest/interface/vlan -u admin:xxx -k \\
     -H "Content-Type: application/json" -d '{"name":"vlan40","vlan-id":40}'
# -X = method (POST/PUT/PATCH/DELETE), -H = header, -d = body data (lihat 32.8)</pre>
<h3>Membaca Status Code (Kilasan)</h3>
<div class="tblwrap"><table>
<tr><th>Code</th><th>Arti</th><th>Tindakan NOC</th></tr>
<tr><td>200</td><td>OK</td><td>Normal</td></tr>
<tr><td>301/302</td><td>Redirect</td><td>Ikuti dengan -L bila perlu</td></tr>
<tr><td>401/403</td><td>Unauthorized/Forbidden</td><td>Cek kredensial & hak akses (32.9)</td></tr>
<tr><td>404</td><td>Not found</td><td>Endpoint/URL salah</td></tr>
<tr><td>500</td><td>Server error</td><td>Cek log di sisi server</td></tr>
</table></div>
<p><b>Pola monitoring:</b> script cron yang curl ke health endpoint tiap menit dan alert bila code bukan 200 — versi paling sederhana dari "synthetic monitoring".</p>`,
      terms: [
        ['curl', 'Tool CLI untuk mengirim HTTP request dan melihat response — untuk test API & web.'],
        ['Response header', 'Metadata jawaban HTTP: status code, tipe konten, dll. (-i menampilkannya).'],
        ['Status code', 'Angka hasil request: 2xx sukses, 3xx redirect, 4xx salah client, 5xx salah server.'],
      ],
      scenario: 'Zabbix melaporkan "web scenario failed" untuk portal internal. curl -i ke URL-nya: 302 redirect ke halaman login baru setelah update aplikasi — skenario Zabbix belum disesuaikan. curl memberi diagnosis dalam 10 detik yang dashboard tidak jelaskan.',
      bestPractices: 'Untuk script: selalu -s (silent) + cek http_code via -w. Jangan abaikan sertifikat (-k) di luar lab. Simpan contoh curl yang bekerja sebagai dokumentasi API.',
      security: 'Hati-hati menaruh password di command curl (-u user:pass): terlihat di history shell dan ps aux. Prefer: -u user (nanti diminta password) atau baca dari env var.',
      challenge: 'Buat one-liner monitoring: curl -s -o /dev/null -w "%{http_code}" ke CHR REST API lab-mu. Kembangkan menjadi script yang mengirim peringatan bila code bukan 200.',
      interviewQ: 'Q: Bagaimana mengecek cepat apakah sebuah web/API hidup dari terminal? — A: curl -s -o /dev/null -w "%{http_code} %{time_total}s" <URL> — dapat status code + waktu respons dalam satu baris, cocok untuk script monitoring.',
      quiz: [
        { q: 'Apa fungsi kombinasi -s -o /dev/null -w "%{http_code}" pada curl?', options: ['Menghapus website', 'Mode silent, buang body, tampilkan hanya HTTP status code — ideal untuk script monitoring', 'Mengirim email', 'Download file'], answer: 1, explain: 'Pola monitoring minimal: tidak butuh isi halaman, hanya "apakah hidup (200?) dan berapa lama".' },
        { q: 'curl mendapat 401 dari API. Artinya...', options: ['Server mati', 'Autentikasi gagal — cek username/password/token (lihat 32.9)', 'Internet putus', 'URL kepanjangan'], answer: 1, explain: '401 Unauthorized = kredensial salah/tidak dikirim. 403 = kredensial benar tapi tidak punya hak.' },
        { q: 'Mengapa -k (abaikan sertifikat) hanya untuk lab?', options: ['Karena memperlambat', 'Karena menonaktifkan validasi TLS — membuka peluang man-in-the-middle di production', 'Karena tidak didukung server', 'Karena ilegal'], answer: 1, explain: '-k mematikan verifikasi identitas server; di production itu menghilangkan seluruh gunanya HTTPS.' },
      ],
    },
    {
      id: '33.16',
      title: 'dig',
      body: `<p><b><code>dig</code></b> (domain information groper) adalah tool interogasi <b>DNS</b> — "detektif" yang menanyakan ke server DNS: "IP dari nama ini apa?" Masalah DNS adalah penyebab nomor satu "internet mati padahal ping ke 8.8.8.8 bisa" — dan dig adalah cara membuktikannya.</p>
<h3>Dasar dan Flag</h3>
<pre>$ dig example.com
# Tanya ke DNS default sistem; lihat bagian ANSWER SECTION:
# example.com.  300  IN  A  93.184.216.34   (nama → IP, TTL 300 detik)

$ dig +short example.com
# +short = hanya jawabannya (93.184.216.34) — untuk dipakai di script

$ dig @8.8.8.8 example.com
# @8.8.8.8 = tanya ke server DNS TERTENTU (bandingkan jawaban DNS kantor vs publik!)

$ dig -x 192.168.99.1
# -x = REVERSE lookup: IP → nama (butuh PTR record; penting untuk log & mail server)

$ dig example.com MX +short
# tanya record KHUSUS: MX (mail), TXT (SPF/DKIM), NS, CNAME, AAAA (IPv6)</pre>
<h3>Membaca Status</h3>
<pre>$ dig example.com | grep status
;; ->>HEADER<<- opcode: QUERY, status: NOERROR
# NOERROR = dapat jawaban. Waspadai:
# NXDOMAIN  = nama tidak ada (salah ketik? record belum dibuat?)
# SERVFAIL  = server DNS bermasalah.  REFUSED = DNS menolak query-mu.</pre>
<h3>DNS Troubleshooting Methodology</h3>
<p>Saat "tidak bisa buka website": 1) <code>ping -c1 8.8.8.8</code> — bisa? berarti internet OK, curigai DNS. 2) <code>dig +short nama-website</code> — dapat IP? 3) Bila tidak: <code>dig @8.8.8.8 nama-website</code> — bisa? berarti DNS lokal yang rusak, bukan internet. 4) Cek <code>/etc/resolv.conf</code> (daftar DNS server sistem).</p>
<div class="callout blue"><div class="t">DNS = Buku Telepon Internet</div><p style="margin:4px 0 0">Manusia ingat nama (google.com), mesin butuh IP. DNS menerjemahkannya. Tanpa DNS yang sehat, semua "nama" mati — termasuk monitoring yang memakai hostname. NOC yang baik memonitor DNS resolver-nya sendiri.</p></div>`,
      terms: [
        ['dig', 'Tool query DNS: menanyakan nama→IP (dan sebaliknya) ke server DNS.'],
        ['DNS record', 'Data DNS: A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), TXT, PTR (reverse).'],
        ['NXDOMAIN / SERVFAIL', 'Status DNS: nama tidak ada / server DNS gagal.'],
        ['Resolver', 'Server DNS yang ditanya client (isi /etc/resolv.conf).'],
      ],
      diagram: `<pre>        ALUR DIAGNOSIS "TIDAK BISA BUKA WEBSITE"

  ping 8.8.8.8 OK?
    ├── TIDAK → masalah konektivitas (bukan DNS) → cek ip route, gateway
    └── YA → curigai DNS:
              dig +short web.com → dapat IP?
                ├── YA → DNS OK, masalah di HTTP/aplikasi → curl -i
                └── TIDAK → dig @8.8.8.8 web.com
                              ├── YA → DNS lokal rusak (cek /etc/resolv.conf)
                              └── TIDAK → nama memang tidak ada / internet bermasalah</pre>`,
      scenario: 'Seluruh kantor tidak bisa buka website tapi ping 8.8.8.8 lancar. dig @8.8.8.8 google.com → NOERROR (publik OK); dig google.com (DNS kantor) → SERVFAIL. Penyebab: service DNS lokal crash setelah update. Restart service DNS → 200 user kembali online. Diagnosis 3 menit berkat metodologi di atas.',
      bestPractices: 'Selalu uji DNS dengan +short untuk script dan @server-spesifik untuk perbandingan. Dokumentasikan DNS server resmi tiap site (bagian dari IP plan, Part 39).',
      security: 'DNS tanpa validasi bisa di-spoof (DNS spoofing mengarahkan user ke situs palsu). Untuk layanan kritis pertimbangkan DNSSEC; monitor log query aneh (tanda malware beaconing).',
      challenge: 'Lakukan: dig +short google.com, dig @8.8.8.8 google.com, cat /etc/resolv.conf, dan dig -x IP gateway-mu. Bandingkan hasilnya.',
      interviewQ: 'Q: User lapor "internet mati" tapi kamu bisa ping 8.8.8.8. Apa diagnosis dan buktinya? — A: Kemungkinan besar DNS. Bukti: ping IP publik OK (konektivitas ada) tapi dig nama-domain gagal/SERVFAIL. Lalu bandingkan dig @8.8.8.8 vs resolver lokal untuk isolasi.',
      quiz: [
        { q: 'Apa fungsi dig @8.8.8.8 example.com?', options: ['Mengirim email ke Google', 'Menanyakan DNS ke server spesifik 8.8.8.8 — untuk membandingkan jawaban antar resolver', 'Menghapus cache DNS', 'Mengganti DNS sistem'], answer: 1, explain: '@server memilih resolver yang ditanya; perbandingan jawaban publik vs lokal mengisolasi "DNS mana yang rusak".' },
        { q: 'Status NXDOMAIN artinya...', options: ['Server DNS mati', 'Nama domain yang ditanya tidak ada (salah ketik atau record belum dibuat)', 'Koneksi lambat', 'Sukses'], answer: 1, explain: 'NXDOMAIN = Non-Existent Domain. Beda dengan SERVFAIL (server bermasalah) — penanganannya beda.' },
        { q: 'Urutan diagnosis "tidak bisa buka website" yang benar?', options: ['Langsung reinstall browser', 'ping IP publik dulu (konektivitas?), lalu dig (DNS?), lalu curl (HTTP?) — isolasi lapis demi lapis', 'Cabut kabel dan pasang lagi', 'Tunggu sampai bisa sendiri'], answer: 1, explain: 'Metodologi: isolasi dari bawah (IP → DNS → aplikasi). Tiap langkah mempersempit kemungkinan penyebab.' },
      ],
    },
    {
      id: '33.17',
      title: 'grep',
      body: `<p><b><code>grep</code></b> menyaring baris teks yang cocok dengan pola — "saringan" universal Linux. Output command 10.000 baris? Log 500 MB? grep menampilkannya hanya yang penting dalam sekejap. Hampir setiap command NOC di-pipe ke grep.</p>
<h3>Flag Esensial</h3>
<pre>$ ps aux | grep zabbix          # saring process zabbix
$ ss -tulpn | grep 10050         # apakah port 10050 listen?
$ grep -i "error" /var/log/syslog
# -i = case-INsensitive (cocok "Error", "ERROR", "error" — log tidak konsisten kapitalnya!)

$ grep -v "^#" /etc/ssh/sshd_config | grep -v "^$"
# -v = INVERT: tampilkan yang TIDAK cocok → buang baris komentar (#) dan baris kosong
# ALASAN: melihat "config aktif yang sebenarnya" tanpa distraksi komentar.

$ grep -r "192.168.99" /etc/     # -r = recursive: cari di semua file dalam folder
$ grep -c "Failed" /var/log/auth.log   # -c = count: HITUNG kemunculan (bukan tampilkan)
$ grep -n "timeout" app.log     # -n = tampilkan NOMOR baris (untuk melompat ke lokasi)</pre>
<h3>Regex Dasar (Pola, Bukan Teks Mentah)</h3>
<p>grep bisa memakai <b>regex</b> (regular expression) — pola pencarian:</p>
<pre>$ grep -E "^192\.168\.(10|20)\." ips.txt
# -E = extended regex. Pola: ^ = awal baris; \. = titik beneran (bukan "karakter apa saja");
# (10|20) = "10 ATAU 20". Artinya: baris diawali 192.168.10. atau 192.168.20.
# ALASAN \.: tanpa escape, titik artinya "karakter apa saja" — 192x168x10 ikut cocok!</pre>
<div class="tblwrap"><table>
<tr><th>Simbol</th><th>Arti</th><th>Contoh</th></tr>
<tr><td><code>^</code> / <code>$</code></td><td>Awal / akhir baris</td><td><code>^error</code>, <code>down$</code></td></tr>
<tr><td><code>.</code></td><td>Satu karakter apa saja</td><td><code>192.168.1.1</code> cocok juga ke 192x168x1y1!</td></tr>
<tr><td><code>\.</code></td><td>Titik beneran</td><td><code>192\.168</code></td></tr>
<tr><td><code>(a|b)</code></td><td>a atau b</td><td><code>(10|20|30)</code></td></tr>
<tr><td><code>[0-9]</code></td><td>Satu digit</td><td><code>eth[0-9]</code></td></tr>
</table></div>`,
      terms: [
        ['grep', 'Menyaring baris teks yang cocok pola — saringan universal output & log.'],
        ['Pipe (|)', 'Mengalirkan output satu command menjadi input command berikut.'],
        ['Regex', 'Regular expression: bahasa pola pencarian (., *, ^, $, |, []).'],
        ['-v (invert)', 'Menampilkan baris yang TIDAK cocok — untuk membuang noise.'],
      ],
      diagram: `<pre>        POLA PIPE NOC: command | grep | olah

  ps aux  ──(10.000 baris)──▶ | grep zabbix ──▶ | grep -v grep ──▶ hasil
         "semua process"        "yang cocok"      "buang baris grep itu
                                                  sendiri" (trik klasik!)

  Trik: ps aux | grep [z]abbix → pola [z] tidak cocok dengan
  baris "grep [z]abbix" itu sendiri. Elegan dan tanpa grep -v.</pre>`,
      scenario: 'auth.log 800 MB setelah serangan brute force semalam. grep -c "Failed password" /var/log/auth.log → 41.203 upaya. grep "Failed password" auth.log | grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" | sort | uniq -c | sort -rn | head → 5 IP penyerang teratas → blokir di firewall. grep mengubah 800 MB chaos menjadi 5 baris aksi.',
      bestPractices: 'Selalu -i untuk log (kapitalisasi tidak konsisten). Pakai -v untuk membuang noise (komentar, baris kosong). Kuasai trik grep [z]abbix agar tidak perlu grep -v grep.',
      security: 'grep -r password /etc bisa menemukan kredensial nyasar di file config — lakukan audit ini berkala di servermu (lalu pindahkan ke vault!).',
      challenge: 'Di /var/log/syslog: hitung baris mengandung "error" (case-insensitive), tampilkan 5 baris terakhirnya dengan nomor baris, dan buang baris kosong dari output config sshd.',
      interviewQ: 'Q: Bagaimana mencari tahu IP penyerang dari auth.log yang besar? — A: grep "Failed password" untuk saring, ekstrak IP dengan regex, lalu sort | uniq -c | sort -rn untuk peringkat. grep + text tools mengubah log raksasa menjadi daftar aksi.',
      quiz: [
        { q: 'Apa fungsi grep -v?', options: ['Mode verbose', 'Invert: menampilkan baris yang TIDAK cocok pola — untuk membuang noise/komentar', 'Mencari sangat cepat', 'Validasi file'], answer: 1, explain: '-v membalik logika: tampilkan yang tidak cocok. Klasik untuk membuang baris komentar (#) dan baris kosong dari config.' },
        { q: 'Mengapa titik dalam pola IP harus ditulis \\.?', options: ['Agar lebih cantik', 'Karena titik tanpa escape berarti "satu karakter apa saja" — 192.168.1.1 bisa cocok ke 192x168x1y1', 'Karena grep wajib', 'Tidak ada alasan'], answer: 1, explain: 'Dalam regex, . adalah wildcard. Untuk titik beneran harus di-escape menjadi \\. — jebakan klasik pencarian IP.' },
        { q: 'Apa trik di balik ps aux | grep [z]abbix?', options: ['Typo yang kebetulan', 'Pola [z]abbix cocok ke "zabbix" tapi TIDAK cocok ke baris "grep [z]abbix" itu sendiri — menghilangkan kebutuhan grep -v grep', 'Mempercepat 10x lipat', 'Tidak ada gunanya'], answer: 1, explain: 'Regex [z] cocok dengan huruf z, tapi string literal "[z]abbix" di baris command grep tidak mengandung "zabbix" — baris grep tersaring otomatis.' },
      ],
    },
    {
      id: '33.18',
      title: 'awk',
      body: `<p><b><code>awk</code></b> adalah "bahasa pemrograman mini" untuk mengolah teks <b>per kolom</b>. Kalau grep menyaring <i>baris</i>, awk memproses <i>kolom</i>: ambil kolom ke-3, jumlahkan kolom ke-5, cetak ulang dengan format baru. Output command network (ip, ss, df) hampir selalu berbentuk kolom — awk adalah alat alaminya.</p>
<h3>Konsep: $1, $2, ... $NF</h3>
<p>awk memecah tiap baris menjadi field (kolom) berdasar spasi/tab: <code>$1</code> = kolom 1, <code>$2</code> = kolom 2, <code>$0</code> = seluruh baris, <code>$NF</code> = kolom terakhir (NF = Number of Fields).</p>
<pre>$ ss -tun | awk '{print $5}'
# cetak kolom 5 (alamat tujuan) dari tiap baris → daftar IP:port remote

$ df -h | awk '$5+0 > 80 {print $6 " penuh " $5}'
# $5+0 = kolom 5 sebagai angka (mis. "82%" → 82); bila > 80, cetak kolom 6 (mount point)
# Pola: KONDISI {AKSI} — "di mana kondisi benar, lakukan aksi". Ini bahasa awk!

$ ps aux | awk '$3 > 50 {print $2, $11}'
# process dengan CPU (% kolom 3) > 50: cetak PID ($2) dan command ($11)

$ awk -F: '{print $1}' /etc/passwd
# -F: = pemisah kolom adalah titik-dua (bukan spasi) → cetak daftar username

$ grep "Failed" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -5
# $(NF-3) = 3 kolom dari belakang = IP penyerang (format log auth)
# → rantai lengkap: saring (grep) → ekstrak kolom (awk) → hitung unik (sort|uniq)</pre>
<h3>awk vs cut</h3>
<p><code>cut -d' ' -f5</code> bisa ambil kolom 5, tapi gagal bila spasi tidak konsisten (kolom output <code>ps</code>!). awk menangani spasi ganda/tab otomatis dan punya kondisi + aritmetika — untuk data network yang berantakan, awk menang telak.</p>
<div class="callout blue"><div class="t">Trio Sakti Text Processing</div><p style="margin:4px 0 0"><b>grep</b> = saring baris. <b>awk</b> = olah kolom. <b>sed</b> (33.19) = edit teks. Tiga serangkai ini menyelesaikan 90% kebutuhan parsing log dan output monitoring tanpa menulis program Python.</p></div>`,
      terms: [
        ['awk', 'Tool/bahasa mini untuk mengolah teks per kolom ($1, $2, $NF) dengan kondisi dan aksi.'],
        ['Field', 'Kolom dalam satu baris teks; awk memecahnya otomatis berdasar spasi/tab.'],
        ['$0 / $NF', '$0 = seluruh baris; $NF = kolom terakhir.'],
        ['-F', 'Flag menentukan pemisah kolom kustom (mis. -F: untuk /etc/passwd).'],
      ],
      diagram: `<pre>        ANATOMI PERINTAH AWK

  awk '$3 > 50 {print $2, $11}'
        │           │
        │           └── AKSI: cetak kolom 2 dan 11
        └── KONDISI: hanya baris dengan kolom 3 > 50

  Alur: tiap baris → pecah jadi $1 $2 $3 ... → cek kondisi
        → bila benar, jalankan aksi → baris berikutnya.

  df -h | awk '$5+0 > 80 {print "WARNING:", $6, $5}'
  "di mana disk > 80%, cetak peringatan" — monitoring satu baris!</pre>`,
      scenario: 'NOC butuh laporan harian "top 10 IP penyerang SSH". Satu baris cron: grep Failed auth.log | awk ekstrak IP | sort | uniq -c | sort -rn | head. Tanpa awk, butuh script Python 30 baris; dengan awk, 1 baris di cron. Inilah kekuatan "bahasa mini".',
      bestPractices: 'Gunakan $NF (kolom terakhir) bila posisi kolom bisa bergeser antar versi tool. Untuk CSV pakai -F,. Uji pola awk di sampel kecil dulu sebelum dipakai ke file 800 MB.',
      security: 'awk bisa mengeksekusi command via system() — jangan jalankan script awk dari sumber tak tepercaya. Dan ingat: output awk yang berisi data sensitif jangan di-log sembarangan.',
      challenge: 'Dari output ss -tun: ekstrak hanya IP remote (hilangkan port-nya — petunjuk: -F: atau sub()), lalu hitung koneksi per IP unik. Bandingkan dengan daftar IP yang kamu kenal.',
      interviewQ: 'Q: Kapan memakai awk dibanding cut? — A: cut untuk kolom dengan delimiter rapi dan konsisten; awk untuk output berantakan (spasi ganda seperti ps/ss), butuh kondisi ($3 > 50), aritmetika, atau kolom dari belakang ($NF).',
      quiz: [
        { q: 'Apa arti $NF dalam awk?', options: ['Kolom pertama', 'Kolom terakhir (NF = Number of Fields)', 'Jumlah baris', 'Nama file'], answer: 1, explain: '$NF = field terakhir; $(NF-1) = satu sebelum terakhir. Berguna saat posisi kolom bisa bergeser.' },
        { q: 'Perintah awk \'$5+0 > 80 {print $6}\' pada output df -h artinya...', options: ['Cetak semua baris', 'Untuk baris dengan pemakaian disk (kolom 5) di atas 80%, cetak mount point (kolom 6)', 'Hapus disk', 'Format ulang disk'], answer: 1, explain: 'Pola awk = KONDISI {AKSI}. $5+0 mengubah "82%" menjadi angka 82 untuk perbandingan numerik.' },
        { q: 'Apa perbedaan peran grep dan awk dalam pipeline?', options: ['Sama saja', 'grep menyaring BARIS yang cocok pola; awk mengolah KOLOM dalam baris (ekstrak, kondisi, hitung)', 'awk lebih lambat selalu', 'grep hanya untuk file kecil'], answer: 1, explain: 'grep = filter baris; awk = proses kolom. Keduanya berantai: grep saring dulu, awk ekstrak kolomnya.' },
      ],
    },
    {
      id: '33.19',
      title: 'sed',
      body: `<p><b><code>sed</code> (stream editor)</b> mengedit teks secara <b>programatik</b>: cari-dan-ganti di ratusan file tanpa membuka editor. Kegunaan NOC: mass-replace IP lama ke IP baru di file config, membersihkan format log, menormalkan output sebelum di-parse.</p>
<h3>Pola Inti: s/cari/ganti/</h3>
<pre>$ echo "gateway 192.168.99.1" | sed 's/192.168.99.1/192.168.99.254/'
# s = substitute: ganti kemunculan PERTAMA per baris
# Output: gateway 192.168.99.254

$ sed -i 's/192.168.99.1/192.168.99.254/g' netplan.yaml
# -i = edit file LANGSUNG (in-place); g = ganti SEMUA kemunculan per baris
# ALASAN -i butuh backup dulu: sed -i.bak '...' → simpan netplan.yaml.bak otomatis.
# Tanpa backup, typo di pola = file config rusak tanpa jalan kembali!

$ sed 's/^#//; s/[[:space:]]*$//' sshd_config
# ; = dua perintah sekaligus: hapus # di awal baris, hapus spasi di akhir baris

$ sed -n '10,20p' /var/log/syslog
# -n + '10,20p' = cetak HANYA baris 10–20 (p = print) — "potong" bagian log

$ sed '/^#/d; /^$/d' sshd_config
# d = delete: hapus baris komentar dan baris kosong → "config aktif yang sebenarnya"</pre>
<h3>Delimiter Fleksibel</h3>
<p>Pola mengandung <code>/</code> (mis. path/IP)? Ganti delimiter agar tidak pusing escape:</p>
<pre>$ echo "/etc/netplan/01.yaml" | sed 's|/etc/netplan|/etc/netplan/backup|'
# pakai | sebagai delimiter — jauh lebih terbaca daripada s/\\/etc\\/...</pre>
<div class="callout"><div class="t">sed -i: Pedang Bermata Dua</div><p style="margin:4px 0 0"><code>sed -i</code> mengubah file tanpa konfirmasi dan tanpa undo. Aturan: 1) uji pola TANPA -i dulu (lihat output di terminal), 2) pakai -i.bak untuk backup otomatis, 3) baru jalankan ke banyak file. Di production, uji di satu file dulu.</p></div>`,
      terms: [
        ['sed', 'Stream editor: edit teks programatik (cari-ganti, hapus baris, potong rentang).'],
        ['s/cari/ganti/', 'Perintah substitute; tambah g untuk semua kemunculan, -i untuk edit file langsung.'],
        ['-i.bak', 'Edit in-place dengan backup otomatis berekstensi .bak — pengaman wajib.'],
      ],
      diagram: `<pre>        ALUR AMAN sed -i (mass edit)

  1. UJI tanpa -i:     sed 's/lama/baru/g' file.conf   (lihat di terminal)
                          ↓ cocok?
  2. BACKUP:          cp file.conf file.conf.$(date +%F)
                          ↓
  3. EKSEKUSI:        sed -i.bak 's/lama/baru/g' file.conf
                          ↓
  4. VERIFIKASI:      diff file.conf.bak file.conf  (apa yang berubah?)
                       grep -c "baru" file.conf     (berapa yang keganti?)

  Tanpa langkah 1-2, typo pola = config rusak massal.</pre>`,
      scenario: 'Migrasi gateway: 40 file netplan di 40 server harus ganti gateway 192.168.99.1 → 192.168.99.254. Manual = 2 hari + risiko typo. Solusi: uji pola di 1 file, backup, lalu loop sed -i.bak ke 40 file + verifikasi diff — 15 menit, 0 typo, lengkap dengan backup tiap file.',
      bestPractices: 'Uji tanpa -i → backup → eksekusi → verifikasi dengan diff. Gunakan delimiter alternatif (|) untuk pola ber-slash. Jangan sed -i ke file production tanpa backup.',
      security: 'sed -i yang salah pola bisa merusak file sshd_config/zabbix config massal — selalu verifikasi diff setelahnya. Batasi siapa yang boleh menjalankan mass-edit di server production.',
      challenge: 'Buat file config dummy berisi 10 baris (campur komentar #, baris kosong, dan IP 192.168.99.1). Lalu: hapus komentar/kosong dengan sed, dan ganti IP-nya dengan -i.bak. Verifikasi dengan diff.',
      interviewQ: 'Q: Bagaimana mengganti satu IP di 40 file config dengan aman? — A: Uji pola sed tanpa -i di satu file dulu, backup semua file, jalankan sed -i.bak, verifikasi dengan diff dan grep hitungan. Jangan pernah mass-edit tanpa backup dan verifikasi.',
      quiz: [
        { q: 'Apa fungsi flag -i pada sed?', options: ['Mode interaktif', 'In-place: mengedit file langsung tanpa output ke terminal', 'Ignore case', 'Info versi'], answer: 1, explain: '-i = tulis perubahan langsung ke file. Berbahaya tanpa backup — selalu uji polanya dulu tanpa -i.' },
        { q: 'Mengapa disarankan sed -i.bak (bukan -i saja)?', options: ['Agar lebih cepat', 'Agar backup otomatis (.bak) tersimpan — jalan kembali bila pola ternyata salah', 'Agar file dikompres', 'Tidak ada bedanya'], answer: 1, explain: '.bak menyimpan versi sebelum edit; typo pola yang merusak config bisa dikembalikan dalam sedetik.' },
        { q: 'Perintah sed \'/^#/d\' artinya...', options: ['Hapus semua baris', 'Delete: hapus baris yang diawali # (komentar)', 'Download file', 'Tampilkan baris pagar'], answer: 1, explain: '/pola/d = hapus baris yang cocok pola. ^# = diawali tanda pagar = baris komentar.' },
      ],
    },
    {
      id: '33.20',
      title: 'Bash',
      body: `<p><b>Bash scripting</b> merangkai semua command Part 33 menjadi <b>program otomatis</b> — inilah jembatan dari "bisa Linux" ke "automation" (Part 32, 35). Script Bash NOC: health check harian, backup config, laporan log — dieksekusi manual atau via timer/cron.</p>
<h3>Anatomi Script Sehat</h3>
<pre>#!/bin/bash
# ^^^ SHEBANG: "jalankan file ini dengan /bin/bash" (wajib di baris 1)

set -euo pipefail
# -e = berhenti bila ada command gagal; -u = error bila variabel tak terdefinisi;
# pipefail = gagalkan pipeline bila ada bagiannya gagal.
# ALASAN: tanpa ini, script LANJUT walau command gagal — "sukses palsu" yang berbahaya.

TARGET="192.168.99.1"              # variabel: tanpa spasi di sekitar =
LOG="/var/log/noc-health.log"

echo "[$(date '+%F %T')] cek $TARGET" | tee -a "$LOG"
# $(...) = command substitution: sisipkan output command
# tee -a = tampilkan di terminal SEKALIGUS append ke file log

if ping -c 3 -W 2 "$TARGET" > /dev/null 2>&1; then
# if = bila sukses (exit code 0)...; > /dev/null 2>&1 = buang output (hanya butuh status)
# -W 2 = timeout 2 detik per paket (tanpa ini, ping menggantung lama saat target mati!)
    echo "OK: $TARGET reachable" | tee -a "$LOG"
else
    echo "KRITIS: $TARGET DOWN" | tee -a "$LOG"
    # di sini bisa: kirim ke Telegram/email/webhook alerting
    exit 1
fi

for host in 192.168.99.1 192.168.99.2 192.168.99.3; do
# for = loop: ulangi untuk tiap host — "automation" paling sederhana!
    echo "--- $host ---"
    curl -s -o /dev/null -w "%{http_code}\n" "https://$host/rest/system/resource" -k -u "admin:$MIKROTIK_PASS"
done</pre>
<h3>Menjalankan & Menjadwalkan</h3>
<pre>$ chmod +x healthcheck.sh       # jadikan executable (33.3)
$ ./healthcheck.sh              # jalankan (./ = "di folder ini" — keamanan PATH)
$ bash -n healthcheck.sh        # -n = cek SINTAKS tanpa menjalankan (wajib sebelum cron!)
# Jadwalkan: via cron (crontab -e → */5 * * * * /home/noc/healthcheck.sh)
# atau systemd timer (33.7) — pilih sesuai kebutuhan logging.</pre>
<div class="tblwrap"><table>
<tr><th>Konstruksi</th><th>Fungsi</th><th>Contoh</th></tr>
<tr><td><code>VAR="x"</code></td><td>Variabel (tanpa spasi!)</td><td><code>TARGET="192.168.99.1"</code></td></tr>
<tr><td><code>$(cmd)</code></td><td>Sisipkan output command</td><td><code>echo "jam $(date)"</code></td></tr>
<tr><td><code>if ...; then</code></td><td>Keputusan berdasar exit code</td><td><code>if ping ...; then</code></td></tr>
<tr><td><code>for x in ...; do</code></td><td>Loop tiap item</td><td>cek banyak host</td></tr>
<tr><td><code>| tee -a file</code></td><td>Tampil + catat ke log</td><td>Audit trail</td></tr>
</table></div>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Script di atas memakai password dari <b>environment variable</b> (<code>$MIKROTIK_PASS</code>), bukan hardcode — sesuai 32.9. Di LAB cukup export manual; di PRODUCTION, baca dari Vault. Dan ingat idempotency (32.10): script cek-status aman diulang; script yang <i>mengubah</i> config harus berpola deklaratif.</p></div>`,
      terms: [
        ['Shebang (#!)', 'Baris pertama script: menyatakan interpreter-nya (#!/bin/bash).'],
        ['set -euo pipefail', 'Mode aman Bash: berhenti saat error, tolak variabel tak terdefinisi.'],
        ['Exit code', 'Angka hasil command (0 = sukses); dasar logika if di Bash.'],
        ['Command substitution $()', 'Menyisipkan output sebuah command ke dalam string/perintah.'],
      ],
      diagram: `<pre>        DARI COMMAND SATUAN KE SCRIPT OTOMATIS

  Manual (diketik tiap pagi):          Script (dijadwalkan):
  $ ping -c 3 192.168.99.1            #!/bin/bash
  $ curl ... resource                 set -euo pipefail
  $ echo "OK" >> log                  for host in ...; do
                                          ping ... || alert
  3 command × 15 device                curl ... || alert
  = 45 ketikan tiap pagi              done
                                      → cron/timer tiap 5 menit
  Script = command yang ditulis sekali, dijalankan selamanya.</pre>`,
      scenario: 'NOC membuat healthcheck.sh (seperti contoh) yang ping 15 device + cek REST API tiap 5 menit via systemd timer, menulis ke log. Suatu malam: "KRITIS: 192.168.99.5 DOWN" tercatat 02:14 — tim datang pagi sudah tahu persis kapan dan apa yang mati. Itulah bedanya monitoring vs "tunggu user komplain".',
      bestPractices: 'Selalu mulai script dengan shebang + set -euo pipefail. Validasi sintaks (bash -n) sebelum dijadwalkan. Log setiap eksekusi (tee -a) — script tanpa log = tidak bisa di-troubleshoot.',
      security: 'Script cron berjalan sebagai user tertentu — pastikan permission script 700/755 dan TIDAK writable oleh others (33.3). Kredensial hanya via env var/Vault, tidak pernah hardcode. Review script terjadwal berkala: apa yang ia lakukan dengan hak aksesnya?',
      challenge: 'Tulis healthcheck.sh versi kamu: ping 3 IP lab (gateway, CHR, satu host), catat hasilnya dengan timestamp ke ~/health.log, dan beri status OK/KRITIS. Uji dengan bash -n, jalankan 2x, dan pastikan idempotent (tidak duplikat aneh).',
      interviewQ: 'Q: Apa fungsi set -euo pipefail dan mengapa penting di script production? — A: -e berhenti saat command gagal, -u menolak variabel tak terdefinisi, pipefail menggagalkan pipeline bila bagiannya gagal. Tanpa ini script melanjutkan walau ada yang gagal ("sukses palsu") — berbahaya untuk automation.',
      quiz: [
        { q: 'Apa fungsi shebang #!/bin/bash di baris pertama script?', options: ['Komentar biasa', 'Memberitahu sistem untuk menjalankan file ini dengan interpreter /bin/bash', 'Menambah kecepatan', 'Wajib di semua file teks'], answer: 1, explain: 'Shebang = instruksi ke kernel: "eksekusi file ini memakai program tersebut" — yang membuat ./script.sh bisa dijalankan langsung.' },
        { q: 'Mengapa ping dalam script diberi -W 2 (timeout)?', options: ['Agar lebih akurat', 'Agar script tidak menggantung lama menunggu target yang mati — automation harus punya batas waktu', 'Agar paket lebih besar', 'Tidak ada alasan'], answer: 1, explain: 'Tanpa timeout, ping ke host mati menunggu lama; script monitoring yang menggantung = monitoring yang mati.' },
        { q: 'Apa arti ./ di ./healthcheck.sh?', options: ['Typo', 'Jalankan file di folder saat ini — Linux tidak menjalankan command dari folder aktif demi keamanan (mencegah Trojan Horse)', 'Mode debug', 'Versi singkat dari sudo'], answer: 1, explain: 'PATH Linux tidak menyertakan folder aktif; ./ eksplisit menyatakan "file di sini" — mencegah eksekusi file asing tak sengaja.' },
      ],
    },
  ],
};
