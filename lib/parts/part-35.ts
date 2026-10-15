// PART 35 — Network Automation with MikroTik (Fase 7 · Automation & Final)
import type { Part } from './types';

export const part35: Part = {
  id: '35',
  number: 'PART 35',
  title: 'Network Automation with MikroTik',
  phaseId: 'fase-7',
  description: 'Automate MikroTik dengan Python: SSH, backup, audit interface/IP/route/resource, konfigurasi VLAN & IP massal, validasi.',
  repoFolder: 'part-35-automation-mikrotik',
  objectives: [
    'Membangun koneksi SSH otomatis ke MikroTik CHR dari Python (netmiko/paramiko) dengan kredensial yang aman.',
    'Menarik data operasional (interface, IP, route, resource) dan mem-parse-nya menjadi laporan.',
    'Mengotomatiskan backup konfigurasi terjadwal dengan penamaan versi yang rapi.',
    'Melakukan konfigurasi massal (VLAN, IP) ke banyak device secara idempotent dengan validasi sebelum dan sesudah.',
    'Membedakan praktik automation LAB vs production: dry-run, validasi, rollback, dan change window.',
  ],
  prerequisites: 'Part 13 (MikroTik/RouterOS — paham command yang di-automate), Part 32 (konsep automation, REST, idempotency), Part 33 (Linux & Bash — script berjalan di Linux). Lab: 1–3 CHR di GNS3 (192.168.99.0/24) + Python 3 di Linux.',
  subbabs: [
    {
      id: '35.1',
      title: 'Connect via SSH',
      body: `<p>Semua automation di part ini berpijak pada satu kemampuan: <b>program Python membuka SSH ke MikroTik, login, dan mengeksekusi command</b> — persis seperti kamu SSH manual (Part 33.8), tapi tanpa jari manusia. Kita memakai library <b>netmiko</b> (di atas paramiko) karena ia paham prompt tiap vendor, termasuk RouterOS.</p>
<h3>Arsitektur Dulu, Coding Kemudian (Aturan Part Ini)</h3>
<pre>[Laptop Linux: script Python + netmiko]
        │  SSH (TCP 22), auth key/password
        ▼
[MikroTik CHR 192.168.99.1] ── eksekusi command RouterOS ──▶ return output teks
        │
        ▼
[Script parse output] → [laporan / aksi lanjut] → [log + Git]</pre>
<h3>Persiapan Lab</h3>
<pre>$ pip install netmiko
# netmiko = library SSH khusus network device (paham prompt RouterOS ">").

# Di CHR: pastikan SSH aktif dan user automation ada
/ip service print          # service ssh harus enabled, port 22
/user add name=automation password=GantiDiLab123 group=read
# ALASAN group=read dulu: mulai dari hak minimal (Part 32.9, 33.4).
# Naikkan ke write/full hanya di sub-bab konfigurasi (35.8+).</pre>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler   # 1. import: ambil class koneksi dari library netmiko
import os                             # 2. import os: untuk membaca environment variable (kredensial!)

device = {                            # 3. dict: "kartu identitas" target device
    'device_type': 'mikrotik_routeros',  #    netmiko perlu tahu vendor → tahu prompt & perilakunya
    'host': '192.168.99.1',              #    IP CHR di VLAN 99 MANAGEMENT (skema kurikulum)
    'username': 'automation',            #    user khusus automation (bukan admin harian!)
    'password': os.environ['MIKROTIK_PASS'],
    # 4. ALASAN os.environ: password DIBACA dari environment variable,
    #    TIDAK ditulis di script (Part 32.9). Export dulu: export MIKROTIK_PASS='...'
}

conn = ConnectHandler(**device)  # 5. buka koneksi SSH (seperti mengetik: ssh automation@192.168.99.1)
#    **device = "unpack" dict menjadi keyword arguments.

print('Terhubung ke:', conn.host)  # 6. verifikasi: pastikan kita bicara ke device yang benar!

conn.disconnect()  # 7. tutup koneksi — WAJIB. Koneksi menggantung = session menumpuk di router.</pre>
<p><b>Verification:</b> jalankan — output <code>Terhubung ke: 192.168.99.1</code> tanpa error = sukses. <b>Failure injection:</b> matikan service ssh di CHR → script error <i>connection refused/timeout</i> (tangkap: itu diagnosis, bukan bug). Salah password → <i>authentication failed</i>. <b>Troubleshooting:</b> cek <code>/ip service print</code> (ssh enabled?), <code>/user print</code> (user ada?), firewall input chain (port 22 dibuka dari IP laptop?). <b>Fix & final verification:</b> perbaiki, jalankan 3x — konsisten terhubung (fondasi idempotency koneksi).</p>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0">Di LAB: password via env var cukup. Di PRODUCTION: user automation dengan key SSH (bukan password), IP source dibatasi firewall, dan setiap koneksi tercatat di log router (<code>/log print</code>).</p></div>`,
      terms: [
        ['netmiko', 'Library Python untuk SSH ke network device; paham prompt & perilaku tiap vendor.'],
        ['ConnectHandler', 'Class netmiko untuk membuka koneksi ke satu device.'],
        ['device_type', 'Parameter netmiko yang menyatakan vendor/OS (mikrotik_routeros) agar parsing prompt benar.'],
      ],
      diagram: `<pre>        LAPISAN KONEKSI NETMIKO

  ┌─────────────────────────────────────┐
  │ script Python kamu                  │
  ├─────────────────────────────────────┤
  │ netmiko (paham prompt RouterOS ">") │
  ├─────────────────────────────────────┤
  │ paramiko (SSH generik, enkripsi)    │
  ├─────────────────────────────────────┤
  │ TCP 22 → CHR 192.168.99.1           │
  └─────────────────────────────────────┘
  Kamu tulis 3 baris; netmiko+paramiko mengurus
  handshake SSH, prompt, dan paging ("-- more --").</pre>`,
      scenario: 'NOC punya 25 CHR cabang. Sebelum automation: cek satu per satu tiap pagi (1 jam). Setelah pola 35.1 + loop: script 20 baris menyapa 25 router dalam 2 menit dan melaporkan yang tidak menjawab — itulah daftar "perlu dikunjungi" pagi itu.',
      bestPractices: 'Satu fungsi connect() yang dipakai ulang semua script (jangan copy-paste blok koneksi). Selalu disconnect dalam finally. Timeout eksplisit agar script tidak menggantung.',
      security: 'User automation ≠ user manusia: nama jelas (automation), group minimal (read dulu), password kuat di env var/Vault. Monitor /log print untuk login automation yang aneh (jam tidak wajar).',
      challenge: 'Modifikasi script: bungkus ConnectHandler dalam fungsi connect(ip) yang melempar pesan error ramah bila gagal (try/except), dan pastikan disconnect selalu dipanggil (try/finally).',
      interviewQ: 'Q: Mengapa memakai netmiko, bukan paramiko langsung, untuk MikroTik? — A: Netmiko dibangun di atas paramiko dan paham kekhasan tiap vendor (prompt RouterOS, paging output, timing) — sehingga kita tidak menulis ulang logika "tunggu prompt" yang rapuh untuk tiap device.',
      quiz: [
        { q: 'Apa fungsi device_type="mikrotik_routeros" pada ConnectHandler?', options: ['Hanya label dokumentasi', 'Memberitahu netmiko vendor/OS target agar ia tahu prompt, paging, dan perilaku yang benar', 'Mempercepat koneksi 10x', 'Mengubah password otomatis'], answer: 1, explain: 'Tiap vendor punya prompt dan kebiasaan berbeda; device_type membuat netmiko menyesuaikan cara bicara ke RouterOS.' },
        { q: 'Mengapa password dibaca dari os.environ, bukan ditulis di script?', options: ['Agar script lebih pendek', 'Agar secret tidak ikut tersebar saat script di-copy/share/commit ke Git (32.9)', 'Karena Python mewajibkan', 'Agar lebih cepat'], answer: 1, explain: 'Pisahkan secret dari code: env var untuk lab, Vault untuk production. Hardcode = bom waktu keamanan.' },
        { q: 'Mengapa conn.disconnect() disebut WAJIB?', options: ['Agar script terlihat rapi', 'Koneksi SSH yang tidak ditutup menumpuk sebagai session menggantung di router dan menghabiskan resource', 'Agar password terhapus', 'Tidak wajib sebenarnya'], answer: 1, explain: 'Session menggantung menumpuk di /user active dan memakai resource; pola benar: buka → pakai → tutup (try/finally).' },
      ],
    },
    {
      id: '35.2',
      title: 'Execute Command',
      body: `<p>Setelah terhubung (35.1), langkah berikut: <b>kirim command, terima output</b>. Netmiko menyediakan dua pola: <code>send_command</code> (kirim satu command, tunggu selesai, ambil output — untuk <i>read</i>) dan <code>send_config_set</code> (masuk mode konfigurasi — untuk <i>write</i>, dipakai di 35.8+).</p>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}

conn = ConnectHandler(**device)   # buka SSH (pola 35.1)

# --- READ: kirim command, terima output teks ---
out = conn.send_command('/system identity print')
# send_command = "ketik command ini, tunggu prompt kembali, kembalikan SELURUH output"
# ALASAN menunggu prompt: RouterOS menampilkan "-- more --" untuk output panjang;
# netmiko otomatis menekan spasi hingga selesai — kamu terima teks utuh.
print(out)
# Expected:  name: CHR-CORE-01

out2 = conn.send_command('/interface print')
print(out2)   # tabel interface seperti di Winbox/terminal

conn.disconnect()</pre>
<h3>Timing: Musuh Tersembunyi</h3>
<p>Command berat (<code>/tool bandwidth-test</code>, export besar) butuh waktu. Bila output terpotong, tambah <code>delay_factor</code>:</p>
<pre>out = conn.send_command('/system resource print', delay_factor=2)
# delay_factor = "tunggu 2x lebih sabar dari default" untuk command lambat</pre>
<p><b>Verification:</b> bandingkan <code>out</code> dengan hasil ketik manual di terminal — harus identik. <b>Failure injection:</b> kirim command salah (<code>/interface prints</code>) → output berisi <i>bad command name</i>; script harus mendeteksi pola error ini (jangan anggap semua output = sukses!). <b>Troubleshooting:</b> output kosong = command butuh privilege lebih tinggi (user group read vs full) atau command interaktif yang menunggu input. <b>Final verification:</b> buat fungsi <code>run(conn, cmd)</code> yang melempar exception bila output mengandung "bad command" / "failure:" — semua script berikutnya memakai fungsi ini.</p>
<div class="callout"><div class="t">Read vs Write</div><p style="margin:4px 0 0"><code>send_command</code> untuk operasi baca (print, monitor, export). Operasi tulis (add, set, remove) memakai <code>send_config_set</code> (35.8) — pemisahan ini disengaja agar script baca tidak sengaja mengubah apa pun.</p></div>`,
      terms: [
        ['send_command', 'Method netmiko: kirim satu command operasional, tunggu selesai, kembalikan output teks.'],
        ['send_config_set', 'Method netmiko untuk command konfigurasi (write) — dibahas di 35.8.'],
        ['delay_factor', 'Pengali kesabaran netmiko menunggu output command lambat.'],
      ],
      scenario: 'Engineer membuat "router-doctor.py": 10 command diagnostik (identity, resource, interface, route, log) dikirim berurutan ke router bermasalah, output disimpan ke satu file. Saat eskalasi ke vendor, file itu dilampirkan — troubleshooting yang tadinya "coba tebak" menjadi berbasis bukti.',
      bestPractices: 'Bungkus send_command dalam fungsi run() dengan deteksi error ("bad command", "failure:"). Jangan pernah menganggap output non-kosong = sukses.',
      security: 'Fungsi run() juga tempat yang tepat untuk memfilter output sebelum di-log: jangan tulis output yang mungkin berisi secret ke file log plaintext.',
      challenge: 'Tulis run(conn, cmd) yang: mengirim command, mengecek pola error di output, dan melempar RuntimeError dengan pesan jelas bila gagal. Uji dengan command benar dan command salah.',
      interviewQ: 'Q: Apa beda send_command dan send_config_set? — A: send_command untuk operasi baca/status (satu command, tunggu output); send_config_set untuk perubahan konfigurasi (write). Memisahkan keduanya mencegah script monitoring tidak sengaja mengubah perangkat.',
      quiz: [
        { q: 'Apa yang dilakukan netmiko saat output command menampilkan "-- more --"?', options: ['Berhenti dan error', 'Otomatis menekan spasi/membaca lanjutan hingga output utuh diterima', 'Melewati output tersebut', 'Meminta input manual'], answer: 1, explain: 'Netmiko menangani paging otomatis dengan menunggu prompt kembali — kamu selalu menerima teks lengkap.' },
        { q: 'Kapan perlu memakai delay_factor?', options: ['Selalu, agar aman', 'Untuk command lambat/berat yang outputnya terpotong karena netmiko tidak cukup sabar menunggu', 'Tidak pernah', 'Hanya di Windows'], answer: 1, explain: 'delay_factor mengalikan waktu tunggu; untuk command cepat nilai default cukup, untuk export/bandwidth-test perlu lebih sabar.' },
        { q: 'Mengapa script harus mengecek "bad command" di output?', options: ['Karena output selalu salah', 'Karena RouterOS mengembalikan error sebagai TEKS dalam output (bukan exception) — tanpa pengecekan, script mengira gagal = sukses', 'Agar script lebih panjang', 'Tidak perlu'], answer: 1, explain: 'CLI tidak punya status code seperti API; error hanya terlihat sebagai teks. Fungsi run() yang baik mem-parse dan melempar exception.' },
      ],
    },
    {
      id: '35.3',
      title: 'Backup Configuration',
      body: `<p><b>Backup otomatis</b> adalah automation pertama yang wajib dimiliki setiap NOC: sebelum automation berani <i>mengubah</i> apa pun (35.8+), ia harus bisa <i>menyelamatkan</i> keadaan saat ini. Aturannya: <b>no backup, no change</b>.</p>
<h3>Dua Jenis Backup RouterOS</h3>
<div class="tblwrap"><table>
<tr><th></th><th>Binary (.backup)</th><th>Export (.rsc)</th></tr>
<tr><td>Command</td><td><code>/system backup save</code></td><td><code>/export</code></td></tr>
<tr><td>Isi</td><td>Snapshot biner lengkap (termasuk password, cert)</td><td>Script teks perintah konfigurasi</td></tr>
<tr><td>Restore</td><td>Hanya ke device/model yang sama</td><td>Bisa diedit, di-review, di-apply parsial</td></tr>
<tr><td>Untuk automation</td><td>Restore darurat</td><td><b>Audit & version control (bisa di-diff di Git!)</b></td></tr>
</table></div>
<p>Strategi NOC: <b>keduanya</b>. Binary untuk restore cepat darurat; export untuk audit perubahan harian di Git.</p>
<h3>Code Line-by-Line: Backup via SSH</h3>
<pre>from netmiko import ConnectHandler
from datetime import datetime   # 1. untuk timestamp nama file
import os

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

# --- langkah 1: buat file backup DI router ---
stamp = datetime.now().strftime('%Y%m%d-%H%M')  # 2. "20261014-0930": unik per eksekusi
backup_name = f'auto-{stamp}'                   # 3. nama: auto-TIMESTAMP (tanpa spasi!)
conn.send_command(f'/system backup save name={backup_name}')
# ALASAN f-string: nama dinamis per waktu; ALASAN prefix "auto-": bedakan dari backup manual.

# --- langkah 2: ambil export teks untuk audit ---
export_text = conn.send_command('/export')
# /export = seluruh konfigurasi sebagai script teks RouterOS

# --- langkah 3: simpan di laptop dengan nama rapi ---
fname = f'backups/CHR-CORE-01_{stamp}.rsc'
os.makedirs('backups', exist_ok=True)  # 4. buat folder bila belum ada (exist_ok = tidak error bila sudah ada)
with open(fname, 'w') as f:            # 5. tulis file teks
    f.write(export_text)
print('Backup tersimpan:', fname)

conn.disconnect()</pre>
<p><b>Verification:</b> file <code>.rsc</code> ada dan berisi <code>/interface vlan</code> dll.; di router, <code>/file print</code> menunjukkan <code>auto-TIMESTAMP.backup</code>. <b>Failure injection:</b> penuhi disk router (buat banyak backup) → save gagal dengan <i>failure</i> — script harus mendeteksi dan tidak mengklaim sukses! Tambahkan housekeeping: hapus backup router lebih dari 7 hari. <b>Troubleshooting:</b> user group <code>read</code> TIDAK bisa save backup → butuh <code>full</code>/<code>write</code>; ini alasan 35.1 mulai dari read. <b>Final verification:</b> restore test di CHR lab cadangan dari file .backup — backup yang belum pernah diuji restore = bukan backup.</p>
<div class="callout"><div class="t">Backup vs Git</div><p style="margin:4px 0 0">Commit file <code>.rsc</code> harian ke Git: <code>git diff</code> langsung menunjukkan "apa yang berubah di router semalam" — audit trail otomatis dan gratis. File <code>.backup</code> (biner) JANGAN di-commit (besar + berisi secret).</p></div>`,
      terms: [
        ['/system backup save', 'Backup biner RouterOS: snapshot lengkap untuk restore darurat.'],
        ['/export', 'Ekspor konfigurasi sebagai script teks — bisa di-diff, di-review, di-version-control.'],
        ['Housekeeping', 'Penghapusan otomatis file lama agar disk tidak penuh.'],
      ],
      diagram: `<pre>        STRATEGI BACKUP GANDA

  [CHR] --/system backup save--> [file .backup di router] → restore DARURAT
    │
    └── /export (teks) ──SSH──▶ [laptop: backups/*.rsc] ──git──▶ [repo]
                                                        │
                                              git diff = "apa berubah
                                              semalam?" (audit!)

  Aturan: backup diuji RESTORE-nya; yang belum diuji = bukan backup.</pre>`,
      scenario: 'Script provisioning VLAN salah sasaran di 5 router cabang tengah malam. Karena backup otomatis 7 hari tersedia + export di Git, rollback = restore .backup (10 menit/router) + verifikasi diff. Tanpa backup otomatis: begadang rebuild manual dari ingatan.',
      bestPractices: 'Jadwalkan backup harian via systemd timer/cron (33.7). Nama file: HOSTNAME_YYYYMMDD-HHMM.rsc. Housekeeping: hapus >30 hari di laptop, >7 hari di router. Uji restore tiap kuartal.',
      security: 'File .backup berisi password & private key — simpan terenkripsi, jangan di Git, batasi akses (chmod 600). File .rsc juga bisa berisi secret (cari "password" sebelum commit!).',
      challenge: 'Lengkapi script: tambahkan housekeeping (hapus file auto-*.backup di router lebih dari 7 hari via /file remove) dan commit otomatis .rsc ke Git lokal.',
      interviewQ: 'Q: Mengapa backup export (.rsc) di-commit ke Git, bukan file .backup? — A: .rsc adalah teks sehingga git diff menunjukkan persis apa yang berubah (audit trail); .backup biner tidak bisa di-diff, besar, dan berisi secret.',
      quiz: [
        { q: 'Apa perbedaan utama /system backup save dan /export?', options: ['Tidak ada', 'save = snapshot biner untuk restore darurat (device sama); export = script teks yang bisa di-diff dan di-version-control', 'export lebih cepat', 'save hanya untuk cloud'], answer: 1, explain: 'Keduanya dibutuhkan: biner untuk restore cepat, teks untuk audit perubahan harian via Git diff.' },
        { q: 'Mengapa backup yang belum pernah diuji restore "bukan backup"?', options: ['Hanya filosofi', 'Karena file backup bisa korup/tidak lengkap — hanya uji restore yang membuktikan ia bisa menyelamatkanmu', 'Karena backup selalu gagal', 'Karena aturan pabrik'], answer: 1, explain: 'Banyak insiden "punya backup tapi tidak bisa di-restore". Uji restore berkala di lab adalah bagian dari strategi backup.' },
        { q: 'Mengapa nama file backup memakai timestamp?', options: ['Agar keren', 'Agar unik per eksekusi: tidak menimpa backup sebelumnya dan mudah diurutkan/di-housekeeping', 'Wajib oleh RouterOS', 'Agar file besar'], answer: 1, explain: 'Timestamp = identitas unik + urutan kronologis; housekeeping ("hapus >7 hari") bergantung padanya.' },
      ],
    },
    {
      id: '35.4',
      title: 'Retrieve Interface',
      body: `<p><b>Retrieve</b> = mengambil data dari perangkat untuk dibaca/dilaporkan (bukan diubah). Mulai dari <b>interface</b>: "interface apa saja yang ada, mana yang up/down?" — pertanyaan paling dasar health check NOC, kini dijawab otomatis.</p>
<h3>Tantangan Parsing: Terse vs Normal</h3>
<p>Output <code>/interface print</code> normal memakai kolom dinamis (susah di-parse). RouterOS punya mode <b>terse</b>: satu baris per item, format <code>key=value</code> — dirancang untuk dibaca program:</p>
<pre># Output normal (untuk manusia):            # Output terse (untuk program):
Flags: X - disabled                          0 X name="ether1" default-name="ether1" type="ether"
 0 X name="ether1" ...                         1   name="ether2" ... disabled=no ...
 1   name="ether2" ...</pre>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os, re   # re = regular expression untuk parsing (Part 33.17)

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

raw = conn.send_command('/interface print terse')
# ALASAN terse: format key=value stabil → parsing tidak rapuh (Part 32.3!).

down = []                       # 1. wadah hasil: list interface bermasalah
for line in raw.splitlines():   # 2. proses baris per baris
    if not line.strip():         # 3. lewati baris kosong
        continue
    # 4. parsing: ambil name="..." dan deteksi flag X (disabled) di awal baris
    m = re.search(r'name="([^"]+)"', line)   # regex: tangkap isi name="..."
    # r'...' = raw string agar backslash regex tidak perlu di-escape ganda
    # ([^"]+) = "satu atau lebih karakter bukan kutip" → nama interface
    name = m.group(1) if m else '?'
    is_disabled = line.lstrip().startswith('X') or 'disabled=yes' in line
    # ALASAN dua cek: terse menandai disabled dengan flag X di depan ATAU key disabled=yes
    if is_disabled:
        down.append(name)

print(f'Interface DOWN/disabled: {down if down else "tidak ada — semua UP"}')
conn.disconnect()</pre>
<p><b>Verification:</b> disable satu interface di CHR, jalankan script — nama interface itu muncul di list. Enable lagi — list kosong. <b>Failure injection:</b> cabut "kabel" (disconnect vNIC di GNS3) — interface tetap enabled tapi <code>running=no</code>; perluas script mendeteksi <code>running=no</code> juga (beda: disabled = administratif, not running = fisik!). <b>Troubleshooting:</b> bila <code>terse</code> tidak didukung di versi RouterOS lama → fallback ke parsing normal atau upgrade (catat perbedaan versi!). <b>Final verification:</b> hasil script vs <code>/interface print</code> manual — cocok 100%.</p>
<div class="callout blue"><div class="t">disabled vs not running</div><p style="margin:4px 0 0"><b>disabled</b> = dimatikan administratif (sengaja). <b>running=no</b> tapi enabled = masalah fisik (kabel, SFP, lawan mati). Script monitoring yang baik membedakan keduanya — tindak lanjutnya beda!</p></div>`,
      terms: [
        ['Retrieve', 'Mengambil data dari perangkat untuk dibaca/dilaporkan (operasi read-only).'],
        ['terse', 'Mode output RouterOS: satu baris per item format key=value — untuk di-parse program.'],
        ['running', 'Status operasional interface: apakah benar-benar meneruskan trafik (beda dari disabled).'],
      ],
      scenario: 'Laporan pagi NOC dulunya: engineer login ke 25 router dan mencatat interface down (45 menit, kadang terlewat). Kini: script 35.4 di-loop ke 25 router via systemd timer tiap 15 menit; hasilnya masuk ke file laporan + alert bila ada yang down >5 menit.',
      bestPractices: 'Selalu pakai output terse/JSON untuk parsing (jangan parse tampilan manusia). Bedakan disabled vs not-running di laporan. Simpan output mentah untuk debugging bila parsing gagal.',
      security: 'Script retrieve memakai user group read (least privilege) — ia tidak butuh write. Log hasil retrieve boleh disimpan; pastikan tidak ada secret di output.',
      challenge: 'Perluas script: tampilkan juga interface dengan running=no (tapi enabled) sebagai kategori "SUSPECT FISIK", dan hitung total TX/RX error bila tersedia.',
      interviewQ: 'Q: Mengapa memakai /interface print terse untuk automation, bukan print biasa? — A: Terse memberi format key=value satu baris per item yang stabil untuk di-parse; output normal memakai kolom dinamis untuk manusia yang rapuh bila di-parse program.',
      quiz: [
        { q: 'Apa beda interface disabled dan running=no?', options: ['Sama saja', 'disabled = dimatikan administratif (sengaja); running=no padahal enabled = masalah fisik/link', 'running=no lebih parah selalu', 'disabled tidak bisa di-enable lagi'], answer: 1, explain: 'Disabled = keputusan admin; not running = gejala fisik (kabel/SFP/lawan). Tindak lanjutnya beda: enable vs cek fisik.' },
        { q: 'Mengapa contoh memakai re.search untuk mengambil name?', options: ['Agar keren', 'Karena output terse berformat key=value — regex menangkap nilai name="..." secara presisi tanpa bergantung posisi kolom', 'Karena wajib', 'Karena lebih lambat'], answer: 1, explain: 'Regex name="([^"]+)" menangkap nilai atribut secara eksplisit; tidak peduli atribut itu ada di posisi ke berapa dalam baris.' },
        { q: 'Apa arti r di depan string regex seperti r\'name="..."\'?', options: ['Mode rahasia', 'Raw string: backslash tidak perlu di-escape ganda — penting agar pola regex terbaca jelas', 'Recursive', 'Read-only'], answer: 1, explain: 'Raw string membuat \\. cukup ditulis \\. (bukan \\\\.); tanpa r, Python memakan satu level backslash sebelum regex melihatnya.' },
      ],
    },
    {
      id: '35.5',
      title: 'Retrieve IP',
      body: `<p>Setelah interface (35.4), ambil <b>IP address</b>: "IP apa terpasang di mana, dan apakah sesuai IP plan?" Ini adalah <b>audit otomatis</b> terhadap skema 192.168.x.0/24 kurikulum — script menjadi "auditor" yang memastikan tidak ada IP nyasar.</p>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os, re, ipaddress
# ipaddress = library STANDAR Python untuk validasi & operasi subnet (tanpa install!)

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

raw = conn.send_command('/ip address print terse')
# Contoh baris terse: 0 address=192.168.99.1/24 network=192.168.99.0 interface=ether1 ...

EXPECTED = {   # 1. IP plan resmi (source of truth mini — Part 32.1, 32.7)
    'ether1': '192.168.99.1/24',   # MANAGEMENT (VLAN 99)
}
# Di lab nyata: EXPECTED dibaca dari file YAML (devices.yaml), bukan hardcode!

problems = []
for line in raw.splitlines():
    if not line.strip():
        continue
    addr = re.search(r'address=([0-9./]+)', line)       # tangkap 192.168.99.1/24
    iface = re.search(r'interface=([^\s]+)', line)       # tangkap nama interface
    if not (addr and iface):
        continue
    ip = addr.group(1)
    # 2. validasi FORMAT: apakah ini IP/prefix yang valid?
    try:
        ipaddress.ip_interface(ip)   # melempar ValueError bila format salah
    except ValueError:
        problems.append(f'FORMAT SALAH: {ip}')
        continue
    # 3. validasi KESESUAIAN dengan plan
    if iface.group(1) in EXPECTED and EXPECTED[iface.group(1)] != ip:
        problems.append(f'MISMATCH: {iface.group(1)} punya {ip}, plan={EXPECTED[iface.group(1)]}')

print('Audit IP:', problems if problems else 'SESUAI PLAN ✓')
conn.disconnect()</pre>
<p><b>Verification:</b> ubah satu IP di CHR menjadi di luar plan → script melaporkan MISMATCH. Kembalikan → "SESUAI PLAN". <b>Failure injection:</b> tambah IP duplikat di dua interface → perluas script mendeteksi duplikat (set() untuk tracking). <b>Troubleshooting:</b> <code>invalid</code> flag di terse = IP conflict atau interface down — script harus melaporkannya sebagai temuan. <b>Final verification:</b> jalankan terhadap 3 CHR lab — semua sesuai plan.</p>
<div class="callout"><div class="t">ipaddress: Senjata Validasi</div><p style="margin:4px 0 0">Library standar <code>ipaddress</code> bisa: validasi (<code>ip_interface</code>), cek keanggotaan subnet (<code>ip in network</code>), hitung network/broadcast. Jangan validasi IP dengan regex buatan sendiri — edge case IPv4 itu banyak.</p></div>`,
      terms: [
        ['Audit (otomatis)', 'Pemeriksaan berkala kesesuaian keadaan nyata vs plan/source of truth.'],
        ['ipaddress', 'Library standar Python untuk validasi dan operasi alamat IP/subnet.'],
        ['MISMATCH', 'Temuan audit: keadaan nyata berbeda dari yang direncanakan.'],
      ],
      scenario: 'IP conflict misterius tiap Senin pagi di VLAN 20: ternyata printer baru dipasang dengan IP statis menabrak IP server. Audit IP otomatis tiap jam kini mendeteksi duplikat dalam 60 menit — sebelum user sempat komplain.',
      bestPractices: 'Source of truth IP plan di file YAML (bukan hardcode di script). Audit jalan terjadwal; hasilnya diff-able (bandingkan dengan run sebelumnya untuk tahu "apa yang berubah").',
      security: 'Daftar IP lengkap = peta jaringan; hasil audit hanya boleh diakses tim netops. Jangan sertakan hasil audit mentah di laporan yang disebar luas.',
      challenge: 'Tambahkan deteksi: IP duplikat antar interface, dan IP di luar range 192.168.0.0/16 (bukan bagian plan kurikulum) sebagai temuan "ASING".',
      interviewQ: 'Q: Bagaimana automation membantu menegakkan IP plan? — A: Script retrieve + bandingkan dengan source of truth (YAML) secara terjadwal; setiap deviasi (mismatch, duplikat, IP asing) menjadi temuan audit otomatis — manusia tidak perlu memeriksa satu per satu.',
      quiz: [
        { q: 'Mengapa memakai library ipaddress untuk validasi, bukan regex sendiri?', options: ['Karena regex dilarang', 'Karena edge case IPv4 banyak (prefix, format) — library standar sudah menangani semuanya dengan benar', 'Karena lebih lambat', 'Karena regex tidak bisa'], answer: 1, explain: 'Validasi IP tampak mudah tapi penuh jebakan (mis. 999.1.1.1, prefix /33). Library standar = sudah diuji jutaan orang.' },
        { q: 'Apa itu temuan MISMATCH dalam audit IP?', options: ['IP tidak bisa di-ping', 'Keadaan nyata di device berbeda dari IP plan resmi (source of truth)', 'Kabel putus', 'Router mati'], answer: 1, explain: 'Audit = bandingkan realita vs rencana; mismatch = ada yang menyimpang dari plan — perlu investigasi.' },
        { q: 'Di mana seharusnya EXPECTED (IP plan) disimpan untuk lab nyata?', options: ['Hardcode di script selamanya', 'Di file YAML source of truth yang dibaca script — satu tempat untuk diubah', 'Diingat di kepala', 'Di sticky note'], answer: 1, explain: 'Hardcode = setiap perubahan plan harus edit script. YAML terpisah = ubah data tanpa sentuh code (Part 32.7).' },
      ],
    },
    {
      id: '35.6',
      title: 'Retrieve Route',
      body: `<p>Ambil <b>tabel routing</b>: "paket ke 192.168.20.0/24 lewat mana?" Verifikasi otomatis bahwa <b>default route, route antar-VLAN, dan OSPF/static</b> sesuai desain — routing yang salah adalah penyebab "bisa ping gateway tapi tidak bisa ke server".</p>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os, re

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

raw = conn.send_command('/ip route print terse')
# Contoh terse: 0 A S dst-address=0.0.0.0/0 gateway=192.168.99.254 ...
# Flag: A = active, S = static, D = dynamic, C = connected, O = OSPF

routes = {}                      # dst-address → info
for line in raw.splitlines():
    if not line.strip():
        continue
    dst = re.search(r'dst-address=([0-9./]+)', line)
    gw = re.search(r'gateway=([0-9.]+)', line)
    flags = line.split()[1] if len(line.split()) > 1 else ''
    # ALASAN split()[1]: di terse, token ke-2 adalah gabungan flag (mis. "AS")
    if dst:
        routes[dst.group(1)] = {'gateway': gw.group(1) if gw else '-',
                                'flags': flags,
                                'active': 'A' in flags}

# --- validasi desain ---
checks = [
    ('0.0.0.0/0', '192.168.99.254', 'default route ke upstream'),
]
for dst, want_gw, desc in checks:
    r = routes.get(dst)
    if not r:
        print(f'GAGAL: {desc} ({dst}) TIDAK ADA di tabel!')
    elif not r['active']:
        print(f'GAGAL: {desc} ada tapi TIDAK ACTIVE')
    elif r['gateway'] != want_gw:
        print(f'GAGAL: {desc} via {r["gateway"]}, seharusnya {want_gw}')
    else:
        print(f'OK: {desc} via {want_gw}')

# bonus: tampilkan semua route connected (C) = "jaringan lokal yang dikenal"
print('Connected:', [d for d, i in routes.items() if 'C' in i['flags']])
conn.disconnect()</pre>
<p><b>Verification:</b> hapus default route di CHR → script melaporkan GAGAL. Tambahkan lagi → OK. <b>Failure injection:</b> tambah static route salah ke 192.168.20.0/24 via gateway ngawur → perluas checks untuk validasi route antar-VLAN sesuai desain (semua VLAN 10/20/30/40/99 harus reachable). <b>Troubleshooting:</b> route ada tapi tidak Active = gateway tidak reachable (cek ARP/ping gateway) atau distance lebih buruk kalah. <b>Final verification:</b> dari tiap CHR, route ke semua subnet kurikulum valid.</p>
<div class="callout blue"><div class="t">Membaca Flag Route</div><p style="margin:4px 0 0"><b>A</b>ctive, <b>S</b>tatic, <b>D</b>ynamic, <b>C</b>onnected, <b>O</b>SPF. Route dipilih berdasarkan: longest prefix match → lowest distance → lowest cost. Script audit cukup cek: ada? active? via yang benar?</p></div>`,
      terms: [
        ['Flag route', 'Huruf status: A (active), S (static), D (dynamic), C (connected), O (OSPF).'],
        ['Default route', '0.0.0.0/0 — "tujuan tidak dikenal lewat sini"; pintu ke upstream/internet.'],
        ['Distance', 'Prioritas route statis (kecil = menang); connected = 0.'],
      ],
      scenario: 'Setelah maintenance, satu cabang tidak bisa akses server pusat. Audit route otomatis: default route di CHR cabang TIDAK ACTIVE — gateway upstream tidak reachable karena kabel uplink pindah port. Tanpa audit, gejalanya ("tidak bisa akses") bisa dikejar ke arah yang salah berjam-jam.',
      bestPractices: 'Definisikan "route yang wajib ada" per peran device (core/distribution/access) di YAML; script memvalidasi tiap device terhadap perannya. Alert bila route kritis hilang/tidak active.',
      security: 'Perubahan route = pengalihan trafik (potensi hijack). Audit route terjadwal juga berfungsi sebagai deteksi perubahan tak terotorisasi — bandingkan dengan baseline Git.',
      challenge: 'Tambahkan validasi: semua subnet kurikulum (192.168.10/20/30/40/99.0/24) harus punya route (connected atau via gateway yang benar). Laporkan subnet yang "tidak punya jalan".',
      interviewQ: 'Q: Route ada di tabel tapi tidak Active. Apa artinya dan apa yang dicek? — A: Artinya route tidak dipakai forwarding — biasanya gateway-nya tidak reachable. Cek: ping/ARP ke gateway, interface ke arah gateway UP?, dan apakah ada route lain yang menang (distance/prefix).',
      quiz: [
        { q: 'Flag A pada route RouterOS artinya...', options: ['Automatic', 'Active — route dipakai untuk forwarding', 'Admin', 'Asleep'], answer: 1, explain: 'Hanya route Active yang dipakai. Route non-active = ada di tabel tapi tidak berfungsi (gateway down, dsb).' },
        { q: 'Apa itu default route 0.0.0.0/0?', options: ['Route yang rusak', 'Route "tangkap semua": tujuan yang tidak cocok route lain lewat gateway ini', 'Route tercepat', 'Route cadangan'], answer: 1, explain: 'Prefix /0 cocok dengan semua alamat tapi paling tidak spesifik — dipakai terakhir (longest prefix match).' },
        { q: 'Script melaporkan default route ada tapi gateway-nya salah. Tindakan?', options: ['Abaikan', 'Investigasi: bandingkan dengan desain, cek siapa/apa yang mengubah (log, Git diff), perbaiki via change terkontrol', 'Hapus semua route', 'Reboot'], answer: 1, explain: 'Gateway salah = trafik dibelokkan — bisa salah config atau indikasi jahat. Verifikasi desain, lacak perubahan, perbaiki prosedural.' },
      ],
    },
    {
      id: '35.7',
      title: 'Retrieve Resource',
      body: `<p>Ambil <b>resource sistem</b>: CPU load, memory, disk, uptime, suhu — "apakah router ini sehat?" versi angka. Ini fondasi <b>monitoring berbasis script</b> (pelengkap Zabbix Part 23): ambil angka, bandingkan dengan threshold, alert bila lewat.</p>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os, re

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

raw = conn.send_command('/system resource print')
# Contoh output:
#   uptime: 3d4h12m22s
#   free-memory: 812.5MiB        total-memory: 1024.0MiB
#   cpu-load: 23
#   free-hdd-space: 78.2MiB      total-hdd-space: 128.0MiB

def grab(pattern, text):
    # helper: ambil nilai setelah "key:" memakai regex
    m = re.search(pattern + r':\s*([0-9.]+)', text)
    return float(m.group(1)) if m else None
    # float() agar bisa dibandingkan numerik; None bila tidak ketemu (aman!)

cpu = grab('cpu-load', raw)
mem_free = grab('free-memory', raw)
mem_total = grab('total-memory', raw)
hdd_free = grab('free-hdd-space', raw)

mem_pct = (1 - mem_free / mem_total) * 100 if mem_free and mem_total else None
# ALASAN hitung persen: threshold "memory > 85%" lebih bermakna dari "free < 150MiB"
# (150MiB kecil untuk RAM 1GB tapi besar untuk RAM 256MB).

TH = {'cpu': 80, 'mem': 85}   # threshold — di production: baca dari YAML!
alerts = []
if cpu is not None and cpu > TH['cpu']:
    alerts.append(f'CPU {cpu}% > {TH["cpu"]}%')
if mem_pct is not None and mem_pct > TH['mem']:
    alerts.append(f'MEM {mem_pct:.1f}% > {TH["mem"]}%')
if hdd_free is not None and hdd_free < 20:
    alerts.append(f'DISK tinggal {hdd_free}MiB (< 20MiB) — backup menumpuk?')

print('ALERT:' if alerts else 'SEHAT ✓', '; '.join(alerts) if alerts else '')
print(f'  cpu={cpu}% mem={mem_pct:.1f}% hdd_free={hdd_free}MiB')
conn.disconnect()</pre>
<p><b>Verification:</b> bandingkan angka script vs <code>/system resource print</code> manual — sama. <b>Failure injection:</b> jalankan bandwidth-test di CHR untuk memaksa CPU 100% → script harus ALERT. <b>Troubleshooting:</b> nilai None = pola regex tidak cocok (beda versi RouterOS menampilkan satuan/format beda!) — catat perbedaan versi, sesuaikan pola. <b>Final verification:</b> loop ke 3 CHR, hasilkan tabel kesehatan — inilah "dashboard teks" NOC.</p>
<div class="callout"><div class="t">Threshold: Seni Menentukan Batas</div><p style="margin:4px 0 0">Threshold terlalu rendah = alert palsu (kelelahan alert). Terlalu tinggi = telat tahu. Mulai dari 80/85/90, lalu sesuaikan dari data historis. Alert yang baik: jarang, tapi selalu berarti.</p></div>`,
      terms: [
        ['Resource', 'Sumber daya sistem: CPU, memory, disk, uptime.'],
        ['Threshold', 'Ambang batas: nilai yang bila dilewati memicu alert.'],
        ['Alert fatigue', 'Kelelahan akibat terlalu banyak alert palsu — membuat alert beneran diabaikan.'],
      ],
      scenario: 'CHR cabang mati total tiap 2 bulan: disk penuh oleh file backup otomatis yang tidak di-housekeeping (pelajaran 35.3!). Setelah script 35.7 dijadwalkan, alert "DISK tinggal < 20MiB" muncul 3 hari sebelum penuh — housekeeping dijalankan proaktif. Monitoring mencegah, bukan mengobati.',
      bestPractices: 'Threshold di file config/YAML (bukan hardcode). Satu script, banyak device (loop). Simpan histori ke CSV agar bisa digrafik (cikal bakal Grafana).',
      security: 'Data resource bisa membocorkan kapasitas sistem ke pihak yang tidak berhak — batasi akses laporan. User automation cukup group read.',
      challenge: 'Tambahkan: uptime parsing (alert bila uptime < 1 jam = baru reboot!), dan tulis hasil ke CSV ber-timestamp untuk histori.',
      interviewQ: 'Q: Bagaimana script sederhana bisa menjadi "monitoring"? — A: Ambil metrik (retrieve) → bandingkan threshold → alert bila lewat → jadwalkan berkala → simpan histori. Itu inti semua sistem monitoring, termasuk Zabbix.',
      quiz: [
        { q: 'Mengapa contoh menghitung memory dalam persen, bukan MiB mentah?', options: ['Agar angka kecil', 'Karena threshold persen bermakna lintas device dengan ukuran RAM berbeda', 'Karena MiB sudah usang', 'Tidak ada alasan'], answer: 1, explain: '150MiB bebas = lega di RAM 256MB tapi kritis di RAM 16GB. Persen menormalkan arti "penuh" di semua ukuran.' },
        { q: 'Apa itu alert fatigue dan bagaimana mencegahnya?', options: ['Lelah mengetik alert', 'Terlalu banyak alert palsu membuat alert penting diabaikan; cegah dengan threshold yang tepat dari data historis', 'Alert yang lambat', 'Tidak bisa dicegah'], answer: 1, explain: 'Alert harus jarang tapi bermakna. Threshold asal-asalan = 100 alert/hari = tim berhenti peduli = alert beneran terlewat.' },
        { q: 'Fungsi grab() mengembalikan None bila pola tidak ketemu. Mengapa?', options: ['Agar error', 'Agar script tidak crash saat format output beda versi — dan pemanggil bisa menangani secara eksplisit', 'Karena malas', 'Tidak ada gunanya'], answer: 1, explain: 'Format output bisa beda antar versi RouterOS; None = "data tidak tersedia" yang ditangani eksplisit, bukan crash misterius atau angka ngawur.' },
      ],
    },
    {
      id: '35.8',
      title: 'Configure VLAN',
      body: `<p><b>Titik balik part ini:</b> dari <i>membaca</i> (retrieve, aman) ke <i>menulis</i> (configure, berdampak). Kita akan membuat VLAN 10/20/30/40/99 di CHR via script — <b>secara idempotent</b> (Part 32.10): aman dijalankan ulang, tidak duplikat.</p>
<h3>Naik Level: send_config_set</h3>
<p>Netmiko membedakan <code>send_command</code> (baca) dan <code>send_config_set</code> (tulis). Di RouterOS tidak ada "mode config" seperti Cisco — tapi pemisahan ini tetap dipakai sebagai <b>disiplin</b>: semua yang mengubah device lewat satu pintu yang jelas.</p>
<h3>Code Line-by-Line (Idempotent!)</h3>
<pre>from netmiko import ConnectHandler
import os

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS'],
          'privilege': 'full'}
# ALASAN privilege full: user automation butuh WRITE untuk konfigurasi.
# Di LAB boleh; di PRODUCTION: user khusus provisioning + change window + approval!

conn = ConnectHandler(**device)

VLANS = [   # source of truth (di production: baca dari vlans.yaml — Part 32.7)
    (10, 'VLAN10-CCTV'), (20, 'VLAN20-OFFICE'), (30, 'VLAN30-SERVER'),
    (40, 'VLAN40-GUEST'), (99, 'VLAN99-MGMT'),
]
PARENT = 'ether2'   # interface trunk ke switch lab

existing = conn.send_command('/interface vlan print terse')
# 1. BACA dulu keadaan nyata (pola deklaratif: "pastikan", bukan "lakukan")

for vid, vname in VLANS:
    if f'vlan-id={vid}' in existing:
        print(f'  VLAN {vid} sudah ada — lewati (idempotent ✓)')
        continue
    # 2. Hanya buat yang BELUM ada → dijalankan 10x pun tidak duplikat
    cmds = [f'/interface vlan add name={vname} vlan-id={vid} interface={PARENT}']
    # 3. f-string merakit command RouterOS dari data — "data menjadi konfigurasi"
    out = conn.send_config_set(cmds)
    if 'failure' in out.lower():
        print(f'  GAGAL buat VLAN {vid}: {out.strip()}')
    else:
        print(f'  VLAN {vid} ({vname}) dibuat ✓')

# 4. VERIFIKASI: baca ulang dan pastikan semua ada
verify = conn.send_command('/interface vlan print terse')
missing = [vid for vid, _ in VLANS if f'vlan-id={vid}' not in verify]
print('HASIL:', 'SEMUA VLAN OK ✓' if not missing else f'HILANG: {missing}')
conn.disconnect()</pre>
<p><b>Hands-on flow:</b> Topology: laptop → CHR (ether2 trunk). Objective: 5 VLAN sesuai skema. Configuration: script di atas (dry-run dulu: comment-out send_config_set, print cmds saja!). Verification: <code>/interface vlan print</code>. Failure injection: hapus satu VLAN manual, jalankan ulang → hanya yang hilang dibuat ulang (bukti idempotency). Troubleshooting: <code>failure: already have interface with such name</code> = cek nama duplikat; <code>no such interface</code> = PARENT salah. Fix & final verification: 3x run → run 2-3 "lewati semua", <code>print</code> menunjukkan 5 VLAN.</p>
<div class="callout"><div class="t">Command Berbahaya — Baca Ini</div><p style="margin:4px 0 0">Script write yang bug (mis. loop tanpa cek) bisa membuat ratusan VLAN/interface dalam detik. Di PRODUCTION: wajib dry-run, change window, backup dulu (35.3!), dan rollback plan. Prinsip: <b>script yang bisa membuat, harus bisa memverifikasi dan (bila perlu) menghapus dengan aman</b>.</p></div>`,
      terms: [
        ['send_config_set', 'Method netmiko untuk mengirim command konfigurasi (write).'],
        ['Idempotent configure', 'Konfigurasi aman diulang: cek eksistensi dulu, buat hanya yang belum ada.'],
        ['Dry-run', 'Simulasi: tampilkan command yang akan dikirim tanpa mengeksekusi (wajib sebelum production).'],
      ],
      diagram: `<pre>        POLA KONFIGURASI IDEMPOTENT

  ┌──────────────┐
  │ BACA keadaan │  /interface vlan print terse
  │ nyata        │
  └──────┬───────┘
         ▼
  ┌──────────────────┐   sudah ada   ┌──────────┐
  │ VLAN X ada?      ├──────────────▶│ LEWATI ✓ │
  └──────┬───────────┘               └──────────┘
         │ belum ada
         ▼
  ┌──────────────────┐
  │ BUAT via         │  send_config_set([...])
  │ send_config_set  │
  └──────┬───────────┘
         ▼
  ┌──────────────────┐
  │ VERIFIKASI ulang │  print terse → semua ada?
  └──────────────────┘</pre>`,
      scenario: 'Provisioning 12 switch baru untuk gedung baru: 5 VLAN × 12 switch = 60 entri. Manual: 1 hari + 2 typo (satu switch VLAN 40 salah ID → user tamu tidak dapat IP). Dengan script idempotent: 10 menit, 12/12 benar, verifikasi otomatis. Typo mustahil karena data dari satu YAML.',
      bestPractices: 'Pola wajib: baca → bandingkan → tulis yang perlu → verifikasi. Dry-run dulu. Data VLAN dari YAML, bukan hardcode. Satu script untuk banyak device (tambah loop).',
      security: 'User provisioning (write/full) hanya aktif saat change window; di luar itu di-disable. Setiap eksekusi tercatat: siapa, kapan, apa yang diubah (log + Git).',
      challenge: 'Tambahkan mode --dry-run (argparse): bila aktif, script hanya print command tanpa send_config_set. Uji: dry-run dulu, lalu run asli, lalu run lagi (harus "lewati semua").',
      interviewQ: 'Q: Bagaimana memastikan script konfigurasi massal tidak membuat duplikat saat di-retry? — A: Pola idempotent: baca keadaan nyata dulu, bandingkan dengan yang diinginkan, hanya buat/ubah yang belum sesuai, lalu verifikasi ulang. Retry menjadi aman.',
      quiz: [
        { q: 'Apa peran send_config_set vs send_command?', options: ['Sama saja', 'send_config_set untuk command yang MENGUBAH konfigurasi (write); send_command untuk baca — pemisahan disiplin agar script baca tak sengaja menulis', 'send_config_set lebih cepat', 'send_command untuk Cisco saja'], answer: 1, explain: 'Pintu terpisah untuk write = jelas kapan script mengubah device; memudahkan review keamanan dan dry-run.' },
        { q: 'Di mana letak idempotency pada script VLAN di atas?', options: ['Tidak ada', 'Cek f"vlan-id={vid}" in existing sebelum membuat — hanya yang belum ada yang dibuat, sehingga aman diulang', 'Pada nama variabel', 'Pada import'], answer: 1, explain: 'Guard "sudah ada? lewati" adalah inti idempotency: run ke-2+ tidak melakukan apa pun (no-op) selain verifikasi.' },
        { q: 'Sebelum menjalankan script write ke production, apa yang wajib?', options: ['Langsung jalankan', 'Backup dulu, dry-run, change window, dan rollback plan', 'Hapus log', 'Jalankan tengah hari tersibuk'], answer: 1, explain: 'Paket pengaman: backup (jalan kembali) + dry-run (lihat dulu) + change window (waktu resmi) + rollback plan (rencana darurat).' },
      ],
    },
    {
      id: '35.9',
      title: 'Configure IP',
      body: `<p>Pasangan dari 35.8: setelah VLAN ada, pasang <b>IP address</b> di tiap VLAN interface sesuai IP plan (192.168.x.1/24 sebagai gateway). Pola sama: idempotent, dari data, terverifikasi.</p>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
import os, ipaddress

device = {'device_type': 'mikrotik_routeros', 'host': '192.168.99.1',
          'username': 'automation', 'password': os.environ['MIKROTIK_PASS']}
conn = ConnectHandler(**device)

IP_PLAN = [   # (vlan_id, interface_name, address) — cerminkan vlans.yaml (32.7)
    (10, 'VLAN10-CCTV',  '192.168.10.1/24'),
    (20, 'VLAN20-OFFICE', '192.168.20.1/24'),
    (30, 'VLAN30-SERVER', '192.168.30.1/24'),
    (40, 'VLAN40-GUEST',  '192.168.40.1/24'),
    (99, 'VLAN99-MGMT',   '192.168.99.1/24'),
]

# 1. VALIDASI DATA DULU (sebelum menyentuh device!):
for vid, iname, addr in IP_PLAN:
    ipaddress.ip_interface(addr)   # melempar ValueError bila format salah
    # ALASAN: "garbage in, garbage out" — data salah jangan sampai jadi config salah.
print('Validasi IP plan: OK ✓')

existing = conn.send_command('/ip address print terse')

for vid, iname, addr in IP_PLAN:
    if f'address={addr}' in existing and f'interface={iname}' in existing:
        print(f'  {addr} di {iname} sudah ada — lewati ✓')
        continue
    # 2. Cek duplikat LINTAS interface: IP sama di interface lain = conflict!
    if f'address={addr}' in existing:
        print(f'  BAHAYA: {addr} sudah dipakai interface lain — LEWATI (cegah conflict!)')
        continue
    out = conn.send_config_set([f'/ip address add address={addr} interface={iname}'])
    print(f'  {"GAGAL: " + out.strip() if "failure" in out.lower() else "ditambah ✓"}: {addr} → {iname}')

verify = conn.send_command('/ip address print terse')
missing = [a for _, _, a in IP_PLAN if f'address={a}' not in verify]
print('HASIL:', 'SEMUA IP OK ✓' if not missing else f'HILANG: {missing}')
conn.disconnect()</pre>
<p><b>Verification:</b> <code>/ip address print</code> + ping tiap gateway (192.168.10.1 dst.) dari host di VLAN terkait. <b>Failure injection:</b> set manual IP salah (192.168.20.99/24) di VLAN20 → jalankan script: ia TIDAK menghapus yang salah (aman!), tapi juga tidak "memperbaiki" — diskusikan: haruskah script menghapus deviasi? (Jawaban: hanya dengan flag --enforce eksplisit + konfirmasi; default = laporkan saja.) <b>Troubleshooting:</b> <code>failure: already have such address</code> = tertangkap guard duplikat; interface tidak ada = VLAN belum dibuat (urutan: 35.8 dulu!). <b>Final verification:</b> ping gateway tiap VLAN sukses.</p>
<div class="callout"><div class="t">Report vs Enforce</div><p style="margin:4px 0 0">Script audit default bersifat <b>report-only</b> (laporkan deviasi). Mode <b>enforce</b> (perbaiki otomatis) jauh lebih berbahaya — butuh flag eksplisit, dry-run, dan approval. Jangan biarkan script "memperbaiki sendiri" tanpa kamu sadari.</p></div>`,
      terms: [
        ['IP plan', 'Dokumen resmi alokasi subnet & gateway (di sini: 192.168.x.1/24 per VLAN).'],
        ['Report-only vs enforce', 'Report: laporkan deviasi; enforce: perbaiki otomatis (butuh pengaman ekstra).'],
        ['IP conflict', 'Satu IP dipakai dua device — menyebabkan konektivitas putus-sambung misterius.'],
      ],
      scenario: 'Ekspansi: tambah VLAN 40 di router kedua. Copy-paste manual config dari router pertama tapi lupa ganti — IP 192.168.40.1/24 duplikat di dua router → user GUEST putus-sambung acak 2 hari sebelum ketahuan. Guard duplikat di script mencegah ini sejak detik pertama.',
      bestPractices: 'Validasi data sebelum eksekusi (fail fast). Guard duplikat lintas interface. Default report-only; enforce hanya eksplisit. Urutan dependency: VLAN dulu, baru IP.',
      security: 'IP gateway yang salah = trafik dibelokkan. Perubahan IP plan adalah change kritis: butuh approval + change window + verifikasi ping tiap subnet setelahnya.',
      challenge: 'Tambahkan flag --enforce: bila aktif dan ada IP salah di interface yang benar, script menghapus yang salah lalu menambah yang benar (dengan konfirmasi dry-run dulu!).',
      interviewQ: 'Q: Apa beda mode report-only dan enforce pada automation, dan kapan masing-masing? — A: Report-only melapor tanpa mengubah (aman, untuk audit/deteksi); enforce memperbaiki otomatis (efisien tapi berisiko). Enforce hanya untuk perubahan yang dipahami penuh, dengan dry-run + approval.',
      quiz: [
        { q: 'Mengapa script memvalidasi IP_PLAN dengan ipaddress SEBELUM menyentuh device?', options: ['Agar lambat', 'Fail fast: data salah harus ditolak sebelum menjadi config salah di perangkat', 'Wajib oleh netmiko', 'Agar output bagus'], answer: 1, explain: 'Validasi di awal = "garbage in" tertolak sebelum merusak. Memperbaiki config salah di device jauh lebih mahal.' },
        { q: 'Apa fungsi guard "BAHAYA: sudah dipakai interface lain"?', options: ['Hanya hiasan', 'Mencegah IP conflict: satu IP di dua interface menyebabkan putus-sambung misterius', 'Mempercepat script', 'Menghapus IP lama'], answer: 1, explain: 'IP duplikat = dua device berebut; gejalanya intermittent dan sulit di-diagnosis. Cegah di titik pembuatan.' },
        { q: 'Script menemukan IP yang menyimpang dari plan. Respons default yang aman?', options: ['Langsung hapus dan ganti', 'Laporkan sebagai temuan (report-only); perbaikan otomatis hanya dengan mode enforce eksplisit', 'Abaikan selamanya', 'Reboot router'], answer: 1, explain: 'Deviasi bisa jadi disengaja (emergency fix). Hapus otomatis tanpa konteks = menghapus fix darurat orang lain. Lapor dulu.' },
      ],
    },
    {
      id: '35.10',
      title: 'Batch Configuration',
      body: `<p><b>Batch configuration</b> = menerapkan perubahan ke <b>banyak device sekaligus</b> — inilah "momen ajaib" automation: script yang bekerja di 1 router (35.8–35.9) kini di-loop ke N router. Tantangan baru: <b>kegagalan parsial</b> (3 dari 10 sukses, 7 gagal) dan <b>eksekusi paralel</b> yang aman.</p>
<h3>Arsitektur Batch</h3>
<pre>[inventory.yaml: 10 CHR + perannya] ──▶ [loop / thread pool]
        │                                        ├─▶ CHR-01 ✓
        │                                        ├─▶ CHR-02 ✓
        │                                        ├─▶ CHR-03 ✗ (timeout) → catat, lanjut!
        │                                        └─▶ ...
        ▼
[laporan: sukses/gagal per device + log per device]</pre>
<h3>Code Line-by-Line</h3>
<pre>from netmiko import ConnectHandler
from concurrent.futures import ThreadPoolExecutor  # 1. eksekusi PARALEL (bukan satu per satu)
import os, yaml

with open('inventory.yaml') as f:
    inv = yaml.safe_load(f)   # 2. baca inventory: [{name, host, role}, ...]
# ALASAN YAML: tambah/kurangi device tanpa edit code (Part 32.7).

PASS = os.environ['MIKROTIK_PASS']

def provision(dev):
    # 3. SATU fungsi untuk SATU device: connect → backup → configure → verify → disconnect
    #    ALASAN satu fungsi: mudah di-paralel dan mudah di-test satuan.
    name, host = dev['name'], dev['host']
    result = {'device': name, 'ok': False, 'note': ''}
    try:
        conn = ConnectHandler(device_type='mikrotik_routeros', host=host,
                              username='automation', password=PASS)
        # 4. BACKUP DULU (aturan 35.3: no backup, no change)
        conn.send_command('/system backup save name=pre-batch')
        # 5. konfigurasi idempotent (pola 35.8/35.9, disingkat di sini)
        existing = conn.send_command('/interface vlan print terse')
        if 'vlan-id=40' not in existing:
            conn.send_config_set(['/interface vlan add name=VLAN40-GUEST vlan-id=40 interface=ether2'])
        # 6. verifikasi per device
        verify = conn.send_command('/interface vlan print terse')
        result['ok'] = 'vlan-id=40' in verify
        result['note'] = 'OK' if result['ok'] else 'verifikasi gagal'
        conn.disconnect()
    except Exception as e:
        # 7. ALASAN try/except per device: 1 device gagal TIDAK boleh menghentikan 9 lainnya!
        result['note'] = f'ERROR: {e}'
    return result

with ThreadPoolExecutor(max_workers=5) as pool:
    # 8. paralel 5 device sekaligus — 10 device @ 30 detik = 1 menit, bukan 5 menit
    #    ALASAN max_workers dibatasi: jangan DoS router/management network sendiri!
    results = list(pool.map(provision, inv['devices']))

ok = sum(1 for r in results if r['ok'])
print(f'HASIL BATCH: {ok}/{len(results)} sukses')
for r in results:
    if not r['ok']:
        print(f'  GAGAL: {r["device"]} — {r["note"]} → tindak lanjut manual!')
# 9. LAPORAN kegagalan = output terpenting batch: yang gagal harus jelas & ditindaklanjuti.</pre>
<p><b>Verification:</b> cek tiap CHR: VLAN 40 ada. <b>Failure injection:</b> matikan 1 CHR → batch tetap selesai, laporan jelas "1 gagal". <b>Troubleshooting:</b> semua gagal = masalah umum (password salah, network ke VLAN 99 putus); sebagian gagal = masalah per device. <b>Final verification:</b> jalankan ulang — semua "sudah ada, lewati" (idempotency di skala batch!).</p>
<div class="callout"><div class="t">Bahaya Batch</div><p style="margin:4px 0 0">Batch melipatgandakan <i>dampak</i> bug: satu baris salah × 50 device = 50 masalah. Aturan batch ke production: uji ke 1 device → 3 device → baru semua; jeda antar batch; siapkan rollback massal (restore pre-batch backup).</p></div>`,
      terms: [
        ['Batch configuration', 'Menerapkan perubahan ke banyak device sekaligus (loop/paralel).'],
        ['Kegagalan parsial', 'Sebagian device sukses, sebagian gagal — harus ditangani eksplisit, bukan diabaikan.'],
        ['ThreadPoolExecutor', 'Cara Python menjalankan banyak tugas paralel (terbatas).'],
        ['Inventory', 'Daftar device target automation (YAML): nama, IP, peran.'],
      ],
      diagram: `<pre>        BATCH: DARI 1 KE N DEVICE

  Sekuensial (lambat):          Paralel (cepat, dibatasi):
  CHR-01 (30s)                  ┌─ CHR-01 ─┐
  CHR-02 (30s)                  ├─ CHR-02 ─┤  5 sekaligus
  CHR-03 (30s)  = 5 menit       ├─ CHR-03 ─┤  (max_workers=5)
  ...                           └─ ... ───┘  = ~1 menit

  Tiap device: backup → configure → verify → lapor.
  Gagal 1 ≠ gagal semua (try/except per device).</pre>`,
      scenario: 'Change window 2 jam untuk tambah VLAN 40 ke 40 switch cabang. Sekuensial butuh 40×45 detik = 30 menit (+ troubleshooting). Paralel 8 worker = 4 menit untuk eksekusi; sisa waktu untuk verifikasi menyeluruh. Change selesai 1 jam lebih awal dengan bukti laporan per device.',
      bestPractices: 'Uji bertahap: 1 → 3 → semua. Batasi worker (jangan banjiri network). Backup pre-batch tiap device. Laporan kegagalan wajib ditindaklanjuti — "99% sukses" tanpa follow-up = 1% bom waktu.',
      security: 'Kredensial batch = kunci kerajaan: Vault + rotasi. Log tiap eksekusi batch (siapa, kapan, target, hasil) untuk audit change management.',
      challenge: 'Buat inventory.yaml berisi 3 CHR lab-mu, jalankan batch idempotent 2x, dan pastikan run ke-2 melaporkan semua "sudah ada". Matikan 1 CHR dan amati laporan kegagalan parsial.',
      interviewQ: 'Q: Apa risiko terbesar batch configuration dan bagaimana mitigasinya? — A: Bug terlipatganda ke N device. Mitigasi: uji bertahap (1→3→semua), backup pre-batch, idempotency, dry-run, batasi paralelisme, dan laporan kegagalan yang ditindaklanjuti.',
      quiz: [
        { q: 'Mengapa tiap device dibungkus try/except sendiri dalam batch?', options: ['Agar code panjang', 'Agar kegagalan 1 device tidak menghentikan/menggagalkan seluruh batch — kegagalan parsial tercatat dan ditindaklanjuti', 'Agar lebih cepat', 'Wajib oleh Python'], answer: 1, explain: 'Tanpa isolasi error, 1 device timeout menghentikan 9 lainnya. Batch profesional: lanjutkan yang bisa, laporkan yang gagal.' },
        { q: 'Mengapa max_workers dibatasi (mis. 5), bukan 100 sekaligus?', options: ['Agar lambat', 'Agar tidak membanjiri management network / membebani router — paralelisme liar = DoS ke infrastruktur sendiri', 'Karena Python terbatas 5', 'Tidak ada alasan'], answer: 1, explain: '50 SSH simultan ke management network bisa men-DoS switch management atau memicu rate-limit; batasi sesuai kapasitas.' },
        { q: 'Urutan uji batch yang aman ke production?', options: ['Langsung semua device', '1 device → 3 device → semua, dengan verifikasi tiap tahap', 'Acak', 'Hanya di akhir pekan'], answer: 1, explain: 'Eskalasi bertahap menangkap bug saat dampaknya masih kecil; "langsung semua" = bug × N device.' },
      ],
    },
    {
      id: '35.11',
      title: 'Configuration Validation',
      body: `<p><b>Configuration validation</b> = memastikan keadaan nyata <b>sesuai</b> dengan yang diinginkan — <b>setelah</b> perubahan (post-change) maupun <b>berkala</b> (apakah ada yang berubah tanpa izin?). Ini menutup loop automation: <b>define → apply → verify → monitor drift</b>.</p>
<h3>Drift: Musuh Senyap</h3>
<p><b>Configuration drift</b> = penyimpangan perlahan dari standar: teknisi mengubah manual saat emergency dan lupa dikembalikan, firmware reset sebagian config, script lama tertinggal. Tanpa validasi berkala, drift menumpuk hingga suatu hari "tiba-tiba" semuanya rusak.</p>
<h3>Code Line-by-Line: Validator</h3>
<pre>from netmiko import ConnectHandler
import os, yaml, ipaddress

with open('desired.yaml') as f:      # 1. desired state: "seharusnya seperti apa"
    desired = yaml.safe_load(f)      #    vlans: [...], ips: [...], routes: [...]

PASS = os.environ['MIKROTIK_PASS']
conn = ConnectHandler(device_type='mikrotik_routeros', host='192.168.99.1',
                      username='automation', password=PASS)

findings = []   # 2. kumpulkan TEMUAN (bukan langsung perbaiki — report-only!)

# --- cek VLAN ---
actual_vlans = conn.send_command('/interface vlan print terse')
for v in desired['vlans']:
    if f"vlan-id={v['id']}" not in actual_vlans:
        findings.append(f"HILANG: VLAN {v['id']} ({v['name']}) tidak ada di device")

# --- cek IP ---
actual_ips = conn.send_command('/ip address print terse')
for ip in desired['ips']:
    if f"address={ip['address']}" not in actual_ips:
        findings.append(f"HILANG: IP {ip['address']} tidak terpasang di {ip['interface']}")

# --- cek konsistensi: IP harus di subnet yang benar ---
for line in actual_ips.splitlines():
    m = __import__('re').search(r'address=([0-9./]+)', line)
    if m:
        try:
            ipaddress.ip_interface(m.group(1))
        except ValueError:
            findings.append(f"FORMAT SALAH: {m.group(1)}")

# --- laporan ---
if findings:
    print(f'DRIFT TERDETEKSI ({len(findings)} temuan):')
    for f_ in findings:
        print('  -', f_)
    # di production: kirim ke alerting (email/Telegram/Zabbix trap)
else:
    print('VALID ✓ — konfigurasi sesuai desired state')
conn.disconnect()</pre>
<p><b>Hands-on flow:</b> buat desired.yaml dari IP plan kurikulum. Jalankan validator → VALID. Failure injection: hapus VLAN 40 manual di CHR → jalankan → "DRIFT TERDETEKSI: VLAN 40 hilang". Troubleshooting: false positive? (desired.yaml kedaluwarsa vs device benar?) — <b>selalu curigai kedua sisi</b>. Fix: selaraskan (ubah device via change terkontrol ATAU update desired.yaml bila perubahan disengaja — dengan approval!). Final verification: VALID kembali + jadwalkan validator harian via timer.</p>
<div class="callout blue"><div class="t">Validasi = Compliance Otomatis</div><p style="margin:4px 0 0">Validator berkala adalah <b>auditor yang tidak tidur</b>: mendeteksi perubahan tak terotorisasi, drift, dan human error. Dipadukan dengan backup Git (35.3), kamu selalu tahu <i>apa</i> yang berubah, <i>kapan</i>, dan <i>apakah sesuai standar</i>.</p></div>`,
      terms: [
        ['Configuration validation', 'Pemeriksaan kesesuaian keadaan nyata vs desired state — post-change & berkala.'],
        ['Configuration drift', 'Penyimpangan perlahan dari standar akibat perubahan manual/lupa.'],
        ['Desired state', 'Definisi "seharusnya seperti apa" (desired.yaml) — acuan validator.'],
      ],
      diagram: `<pre>        LOOP TERTUTUP AUTOMATION

  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐
  │ DEFINE      │────▶│ APPLY        │────▶│ VERIFY       │
  │ desired.yaml│     │ script batch │     │ validator    │
  │ (Git)       │     │ (35.10)      │     │ (35.11)      │
  └─────────────┘     └──────────────┘     └──────┬───────┘
        ▲                                        │
        │   selaraskan (change terkontrol)       │ drift?
        └────────────────────────────────────────┘
              ↺ berjalan TERUS (harian) — bukan sekali</pre>`,
      scenario: 'Audit tahunan menemukan 11 switch dengan config menyimpang dari standar (VLAN lama tak terhapus, IP gateway beda) — akumulasi 2 tahun "fix cepat manual". Setelah validator harian: drift terdeteksi dalam 24 jam, tiap temuan jadi tiket. Audit berikutnya: 0 temuan.',
      bestPractices: 'desired.yaml di Git (perubahan standar = pull request + review). Validator report-only default; auto-remediate hanya untuk kasus yang sangat dipahami. Jadwalkan harian; alert hanya untuk temuan baru (hindari spam).',
      security: 'Validator juga mendeteksi perubahan TAK TEROTORISASI (indikasi kompromi): VLAN asing, user baru, firewall rule baru. Ini intrusion detection versi konfigurasi.',
      challenge: 'Buat desired.yaml untuk 1 CHR lab (5 VLAN + 5 IP + 1 default route). Jalankan validator, lalu simulasikan 3 drift (hapus VLAN, ubah IP, tambah route asing) dan pastikan ketiganya terdeteksi.',
      interviewQ: 'Q: Apa itu configuration drift dan bagaimana automation mengatasinya? — A: Drift = penyimpangan perlahan dari standar. Diatasi dengan validator berkala yang membandingkan keadaan nyata vs desired state (di Git); temuan menjadi alert/tiket sebelum menumpuk jadi insiden.',
      quiz: [
        { q: 'Apa itu configuration drift?', options: ['Mobil drift', 'Penyimpangan perlahan konfigurasi dari standar akibat perubahan manual, lupa, atau script lama', 'Jenis kabel', 'Virus'], answer: 1, explain: 'Drift menumpuk diam-diam dari "fix cepat" yang tak terdokumentasi; validator berkala mendeteksinya sebelum jadi insiden.' },
        { q: 'Mengapa validator default bersifat report-only (tidak langsung memperbaiki)?', options: ['Karena malas coding', 'Karena deviasi bisa disengaja (emergency fix); perbaikan otomatis buta konteks bisa menghapus fix darurat yang sah', 'Karena validator lambat', 'Tidak ada alasan'], answer: 1, explain: 'Tidak semua deviasi = kesalahan. Report dulu, manusia menilai, baru perbaiki via change terkontrol (atau update desired state bila disengaja).' },
        { q: 'Di mana desired state seharusnya disimpan?', options: ['Di kepala engineer', 'Di file YAML yang di-version-control (Git) — perubahan standar = pull request + review', 'Di sticky note', 'Di RAM'], answer: 1, explain: 'Desired state = kontrak; di Git ia punya history, review, dan approval — sama seperti code.' },
      ],
    },
  ],
  project: {
    title: 'Project: MikroTik Automation Toolkit',
    html: `<p><b>Misi:</b> bangun <b>MikroTik Automation Toolkit</b> — kumpulan script Python production-grade yang mengelola 3+ CHR lab-mu (backup, audit, provisioning, validasi), lalu publikasikan ke GitHub sebagai portfolio.</p>
<h3>Struktur Project</h3>
<pre>mikrotik-automation-toolkit/
├── README.md                 # dokumentasi: arsitektur, cara pakai, demo
├── inventory.yaml            # daftar CHR lab (nama, IP, peran)
├── desired.yaml              # desired state: VLAN, IP, route (skema kurikulum!)
├── requirements.txt          # netmiko, pyyaml
├── lib/
│   └── mtklib.py             # fungsi reusable: connect(), run(), parse terse
├── backup.py                 # backup harian (35.3) + housekeeping + Git commit
├── audit.py                  # retrieve interface/IP/route/resource → laporan (35.4–35.7)
├── provision.py              # buat VLAN + IP idempotent + --dry-run (35.8–35.9)
├── batch.py                  # eksekusi paralel ke N device + laporan (35.10)
└── validate.py               # validator drift vs desired.yaml (35.11)</pre>
<h3>Langkah Pengerjaan</h3>
<ol>
<li><b>Setup lab:</b> 3 CHR di GNS3 (192.168.99.11–13), user automation, SSH aktif.</li>
<li><b>mtklib.py:</b> fungsi connect/run/disconnect + deteksi error — dipakai semua script.</li>
<li><b>backup.py & audit.py</b> (read-only dulu!): pastikan aman sebelum menyentuh write.</li>
<li><b>provision.py</b> dengan --dry-run: uji ke 1 CHR → verifikasi → baru ke 3 CHR.</li>
<li><b>batch.py + validate.py:</b> buktikan idempotency (run 2x) dan deteksi drift (simulasikan!).</li>
<li><b>Dokumentasi:</b> README berisi arsitektur (diagram!), contoh output, dan bagian "LAB vs Production".</li>
<li><b>Demo terekam:</b> screenshot/GIF tiap script berjalan (bukti untuk portfolio).</li>
</ol>
<h3>Panduan Upload ke GitHub (Portfolio)</h3>
<ol>
<li>Buat repo publik: <code>mikrotik-automation-toolkit</code>. Jangan pakai nama asal — ini CV-mu.</li>
<li><b>SEBELUM push:</b> pastikan TIDAK ADA secret: cek <code>grep -ri "password" .</code>, pastikan file .env/.rsc berisi secret di-.gitignore, hapus jejak kredensial dari history contoh.</li>
<li>README wajib ada: masalah yang diselesaikan, arsitektur (diagram ASCII), cara install & pakai, contoh output, dan batasan ("dibuat untuk lab; adaptasi production butuh Vault dll.").</li>
<li>Commit message jelas per fitur (<code>feat: idempotent VLAN provisioning</code>), bukan satu commit raksasa.</li>
<li>Tambahkan link repo ke CV/LinkedIn dengan deskripsi 1 kalimat hasil: "Automate backup, audit & provisioning 3 MikroTik CHR — idempotent, tested."</li>
</ol>
<h3>Kriteria Selesai</h3>
<ul>
<li>Semua 6 script berjalan tanpa error ke 3 CHR; dibuktikan screenshot/log.</li>
<li>Idempotency terbukti: run provision 2x → run ke-2 no-op (kecuali verifikasi).</li>
<li>Drift detection terbukti: hapus 1 VLAN manual → validate.py melaporkannya.</li>
<li>Tidak ada secret di repo (terverifikasi dengan grep).</li>
<li>README lengkap + repo GitHub publik tertaut.</li>
</ul>`,
  },
};
