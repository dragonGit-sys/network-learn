import type { Part } from './types';

export const part23: Part = {
  id: '23',
  number: 'PART 23',
  title: 'Zabbix',
  phaseId: 'fase-5',
  description: 'Platform monitoring open-source untuk memantau ketersediaan dan performa device jaringan: arsitektur Zabbix, SNMP, trigger, alert, dan dashboard untuk operasional NOC.',
  repoFolder: 'part-23-zabbix',
  objectives: [
    'Menjelaskan konsep network monitoring dan perbedaannya dengan observability.',
    'Menggambarkan arsitektur Zabbix end-to-end: device → protokol → collector → database → dashboard.',
    'Mengidentifikasi peran tiap komponen Zabbix (server, agent, proxy, database, frontend).',
    'Memahami SNMP dan OID serta metrik kunci: availability, CPU, memory, disk, dan interface traffic.',
    'Merancang trigger, alert, template, dan dashboard sesuai kebutuhan operasional NOC.',
  ],
  prerequisites: 'Part 13–18 (device yang akan dimonitor: MikroTik & FortiGate), Part 01–05 (konsep jaringan & IP addressing), Part 08–12 (VLAN & routing).',
  subbabs: [
    {
      id: '23.1',
      title: 'Apa Itu Network Monitoring?',
      body: `<p><b>Network monitoring</b> adalah proses mengamati kondisi jaringan secara terus-menerus dan otomatis untuk memastikan tiga hal: perangkat <b>hidup</b> (availability), bekerja dengan <b>baik</b> (performance), dan masih punya <b>ruang tumbuh</b> (capacity). Sederhananya: daripada menunggu user menelepon "internet mati", monitoring memberitahu engineer duluan bahwa "link X bermasalah" — sering kali sebelum user menyadarinya.</p>
<h3>Mengapa Dibutuhkan?</h3>
<ul>
<li><b>Deteksi proaktif:</b> gangguan terdeteksi dalam hitungan menit oleh mesin, bukan jam oleh komplain user. Di NOC, dashboard monitoring adalah "mata" utama — engineer shift malam tidak berkeliling gedung, mereka melihat dashboard.</li>
<li><b>Bukti & data:</b> saat user bilang "internet lambat", engineer menjawab dengan grafik: "traffic WAN mencapai 98% pukul 14.00–16.00". Tanpa monitoring, troubleshooting hanya berdasarkan tebakan.</li>
<li><b>Capacity planning:</b> grafik traffic 3 bulan menunjukkan kapan link harus di-upgrade — keputusan belanja bandwidth berdasarkan data, bukan firasat.</li>
<li><b>SLA (Service Level Agreement):</b> kontrak "uptime 99,9%" hanya bisa dibuktikan dengan data availability dari monitoring.</li>
</ul>
<h3>Masalah yang Diselesaikan</h3>
<div class="tblwrap"><table>
<tr><th>Masalah Tanpa Monitoring</th><th>Solusi Monitoring</th></tr>
<tr><td>Router cabang mati, ketahuan 3 jam kemudian dari telepon user</td><td>Alert "host down" terkirim dalam 2–5 menit ke Telegram/email NOC</td></tr>
<tr><td>Link lambat tapi tidak ada yang tahu penyebabnya</td><td>Grafik traffic per interface menunjukkan link mana yang jenuh dan kapan</td></tr>
<tr><td>CPU router 100% setiap sore, tidak terpola</td><td>Grafik CPU historis menunjukkan pola jam sibuk → dasar upgrade/QoS</td></tr>
<tr><td>Disk server log penuh tiba-tiba, service mati</td><td>Alert "disk &lt; 10%" muncul jauh sebelum penuh</td></tr>
</table></div>
<h3>Cara Kerja Sederhana</h3>
<p>Bayangkan suster yang memeriksa pasien tiap 5 menit: cek nadi (apakah hidup?), cek suhu (apakah demam?), catat di rekam medis. Monitoring bekerja persis begitu:</p>
<ol>
<li><b>Tanya (polling):</b> sistem monitoring bertanya ke setiap device secara berkala — "CPU-mu berapa? Interface eth0 traffic-nya berapa?"</li>
<li><b>Catat:</b> jawaban disimpan sebagai deret angka terhadap waktu (<i>time series</i>) di database.</li>
<li><b>Nilai:</b> aturan (<i>trigger</i>) menilai: "CPU &gt; 90% selama 5 menit = masalah".</li>
<li><b>Beri tahu:</b> jika masalah, kirim alert ke engineer (email, Telegram, SMS).</li>
<li><b>Tampilkan:</b> semua data digambar sebagai grafik di dashboard.</li>
</ol>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">Monitoring menyentuh semua layer: Layer 1 (link up/down, error counter), Layer 3 (ping, packet loss), Layer 4 (port service up/down), hingga Layer 7 (HTTP response time). Metrik yang kamu pantau menentukan layer mana yang "terlihat" oleh NOC.</p></div>
<h3>Packet Flow Monitoring</h3>
<pre>[Device: MikroTik/FortiGate/Switch]
        │ ① SNMP/ICMP/Agent — pertanyaan & jawaban metrik
        ▼
[Zabbix Server/Collector] ② polling tiap 60 detik
        │ ③ simpan nilai mentah
        ▼
[Database] ④ history (mentah) + trends (agregat per jam)
        │ ⑤ baca untuk evaluasi & tampilan
        ▼
[Trigger Engine] ──PROBLEM──▶ [Alert] ──▶ email/Telegram ──▶ Engineer
        │
        ▼
[Frontend/Dashboard] ◀── engineer melihat grafik & status</pre>`,
      terms: [
        ['Monitoring', 'Pengamatan kondisi sistem/jaringan secara terus-menerus dan otomatis.'],
        ['Polling', 'Metode monitoring di mana server bertanya ke device secara berkala.'],
        ['Metric', 'Satu nilai terukur terhadap waktu, mis. CPU 45% pada 10:05.'],
        ['Availability', 'Persentase waktu suatu layanan/device dalam kondisi hidup dan bisa diakses.'],
        ['NOC', 'Network Operations Center — ruang kendali yang memantau jaringan 24/7.'],
      ],
      diagram: `<pre>              TANPA vs DENGAN MONITORING

Tanpa:   [Gangguan] ── 3 jam ──▶ [User komplain] ──▶ [Engineer panik] ──▶ [Tebak-tebak]
Dengan:  [Gangguan] ── 3 mnt ──▶ [Alert otomatis] ──▶ [Engineer + data grafik] ──▶ [Fix terarah]</pre>`,
      scenario: 'Kantor cabang di Surabaya tidak bisa akses aplikasi pusat sejak pukul 09.00, baru ketahuan pukul 11.30 saat user menelepon. Dengan monitoring, Zabbix mengirim alert "ICMP ping loss 100% ke router Surabaya" pukul 09.02 — engineer langsung tahu link cabang yang putus (bukan aplikasinya) dan menghubungi ISP 2,5 jam lebih awal.',
      bestPractices: 'Monitor dari yang paling kritis dulu: availability (up/down) → resource device (CPU/memory) → traffic → layanan aplikasi. Jangan mulai dari grafik yang "bagus dilihat" tapi tidak actionable.',
      security: 'Monitoring itu sendiri adalah permukaan serangan: SNMP community string yang bocor = peta jaringan untuk penyerang. Gunakan SNMPv3 di production dan batasi akses ke server monitoring hanya dari VLAN management (192.168.99.0/24).',
      challenge: 'Tulis 3 metrik yang menurutmu PALING penting dipantau di jaringan kantormu dan jelaskan: jika metrik itu memburuk, apa dampak bisnisnya? (Contoh: "traffic WAN > 90% = user tidak bisa kerja".)',
      interviewQ: 'Q: "Mengapa perusahaan butuh monitoring padahal user bisa melapor kalau ada gangguan?" — A: Laporan user itu reaktif dan lambat; monitoring proaktif mendeteksi dalam hitungan menit, memberi data penyebab (bukan tebakan), dan memungkinkan capacity planning sebelum masalah terjadi.',
      quiz: [
        {
          q: 'Tiga hal utama yang dipastikan oleh network monitoring adalah…',
          options: [
            'Kecepatan Wi-Fi, harga bandwidth, jumlah user',
            'Availability (hidup), performance (baik), capacity (ruang tumbuh)',
            'Merek device, versi firmware, garansi',
            'Jumlah kabel, panjang fiber, suhu ruangan',
          ],
          answer: 1,
          explain: 'Monitoring memastikan device hidup (availability), bekerja baik (performance), dan masih punya kapasitas (capacity).',
        },
        {
          q: 'Apa keuntungan utama monitoring proaktif dibanding menunggu laporan user?',
          options: [
            'Lebih murah karena tidak butuh server',
            'Gangguan terdeteksi dalam hitungan menit beserta datanya, bukan jam kemudian berdasarkan tebakan',
            'User tidak perlu internet',
            'Tidak perlu engineer shift malam',
          ],
          answer: 1,
          explain: 'Monitoring mendeteksi gangguan otomatis dalam hitungan menit dan menyertakan data (grafik, metrik) untuk troubleshooting terarah.',
        },
        {
          q: 'Dalam analogi "suster memeriksa pasien", polling berperan sebagai…',
          options: [
            'Obat untuk pasien',
            'Suster bertanya/memeriksa kondisi pasien secara berkala',
            'Ruang operasi',
            'Jadwal kunjungan dokter',
          ],
          answer: 1,
          explain: 'Polling = server monitoring "bertanya" ke device secara berkala, seperti suster memeriksa nadi pasien tiap beberapa menit.',
        },
      ],
    },
    {
      id: '23.2',
      title: 'Monitoring vs Observability',
      body: `<p><b>Monitoring</b> menjawab pertanyaan yang <b>sudah diketahui sebelumnya</b> (<i>known-knowns</i>): "Apakah router X hidup?", "Apakah CPU di atas 90%?". Kamu mendefinisikan dulu apa yang dipantau dan ambang batasnya, lalu sistem memberi tahu saat batas itu terlampaui.</p>
<p><b>Observability</b> (keteramatan) adalah kemampuan menjawab pertanyaan yang <b>belum terpikirkan saat insiden terjadi</b> (<i>unknown-unknowns</i>): "Mengapa latency naik hanya untuk user VLAN 20 yang mengakses server Y lewat path Z?". Observability butuh data mentah yang kaya sehingga engineer bisa menggali ke segala arah saat troubleshooting.</p>
<h3>Tiga Pilar Observability</h3>
<div class="tblwrap"><table>
<tr><th>Pilar</th><th>Apa Itu</th><th>Contoh di Jaringan</th></tr>
<tr><td><b>Metrics</b></td><td>Angka deret waktu: nilai + timestamp</td><td>CPU 45%, traffic 800 Mbps, ping 2 ms — dikumpulkan Zabbix</td></tr>
<tr><td><b>Logs</b></td><td>Catatan kejadian berurutan dengan teks</td><td>Syslog router: "interface ether1 link down", log firewall deny</td></tr>
<tr><td><b>Traces</b></td><td>Jejak perjalanan satu request antar-komponen</td><td>Di jaringan: traceroute/path analysis — paket lewat hop mana saja</td></tr>
</table></div>
<h3>Perbandingan</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Monitoring</th><th>Observability</th></tr>
<tr><td>Pertanyaan</td><td>Sudah didefinisikan ("apakah X OK?")</td><td>Bisa apa saja, termasuk yang tak terduga</td></tr>
<tr><td>Data</td><td>Metrik agregat yang dipilih</td><td>Data mentah yang kaya (metrics + logs + traces)</td></tr>
<tr><td>Saat insiden</td><td>"Alarm bunyi: CPU tinggi"</td><td>"Kenapa CPU tinggi? Korelasikan dengan log dan traffic per interface"</td></tr>
<tr><td>Contoh tool</td><td>Zabbix (kuat di sini)</td><td>Zabbix + syslog server + Grafana + packet capture</td></tr>
</table></div>
<p><b>Kesimpulan praktis:</b> monitoring adalah fondasi — tanpa metrik dasar (up/down, CPU, traffic) kamu buta total. Observability adalah level berikutnya: menggabungkan metrik + log + kemampuan eksplorasi (Grafana, Part 26–27) agar bisa menjawab pertanyaan tak terduga. Zabbix sangat kuat di monitoring; observability penuh dicapai dengan melengkapinya (syslog, NetFlow, dashboard eksploratif).</p>
<div class="callout"><div class="t">Kesalahan Umum</div><p style="margin:4px 0 0">Mengira "sudah pasang Zabbix = sudah observability". Zabbix memberi tahu <i>apa</i> yang rusak; untuk tahu <i>mengapa</i> sering kali butuh log (syslog) dan korelasi manual — itulah observability.</p></div>`,
      terms: [
        ['Observability', 'Kemampuan memahami kondisi internal sistem dari data eksternalnya, termasuk untuk pertanyaan tak terduga.'],
        ['Known-knowns', 'Hal yang sudah diketahui akan ditanyakan — ranah monitoring klasik.'],
        ['Unknown-unknowns', 'Pertanyaan yang baru muncul saat insiden — ranah observability.'],
        ['Time series', 'Deret data berupa nilai + timestamp, fondasi metrics.'],
      ],
      scenario: 'Alarm Zabbix: "CPU router 95%" (monitoring bekerja — apa-nya diketahui). Tapi kenapa? Engineer membuka Grafana, mengkorelasikan: traffic interface WAN melonjak bersamaan, log firewall menunjukkan serangan scan dari satu IP asing — gabungan metrics + logs menjawab mengapa-nya (observability).',
      bestPractices: 'Bangun monitoring dulu sampai metrik dasar lengkap dan alert tidak berisik (no alert fatigue), baru naik ke observability: kumpulkan syslog terpusat dan buat dashboard eksploratif di Grafana.',
      security: 'Log adalah data sensitif (berisi IP, username, pola akses). Simpan log terpusat dengan kontrol akses — jangan biarkan log hanya di device yang bisa dihapus penyerang.',
      challenge: 'Untuk insiden "internet lambat jam 14.00–16.00": tulis 2 pertanyaan monitoring (known) dan 2 pertanyaan observability (unknown) yang akan kamu ajukan, plus data apa yang dibutuhkan untuk menjawab masing-masing.',
      interviewQ: 'Q: "Apa beda monitoring dan observability?" — A: Monitoring menjawab pertanyaan yang sudah didefinisikan sebelumnya (apakah X OK?) lewat metrik dan ambang batas; observability adalah kemampuan menjawab pertanyaan tak terduga saat insiden lewat data mentah yang kaya: metrics, logs, dan traces.',
      quiz: [
        {
          q: 'Monitoring terutama menjawab jenis pertanyaan…',
          options: [
            'Pertanyaan yang belum terpikirkan siapa pun',
            'Pertanyaan yang sudah didefinisikan sebelumnya (known-knowns)',
            'Pertanyaan filosofis tentang jaringan',
            'Pertanyaan dari vendor saja',
          ],
          answer: 1,
          explain: 'Monitoring = pertanyaan yang sudah diketahui jawabannya akan ditanyakan (apakah router hidup? CPU > 90%?).',
        },
        {
          q: 'Tiga pilar observability adalah…',
          options: [
            'Router, switch, firewall',
            'Ping, traceroute, telnet',
            'Metrics, logs, traces',
            'CPU, memory, disk',
          ],
          answer: 2,
          explain: 'Tiga pilar observability: metrics (angka deret waktu), logs (catatan kejadian), traces (jejak perjalanan request).',
        },
        {
          q: 'Zabbix paling kuat di pilar observability yang mana?',
          options: [
            'Traces antar microservice',
            'Metrics — pengumpulan metrik deret waktu dan alerting',
            'Analisis log teks dengan AI',
            'Packet capture otomatis',
          ],
          answer: 1,
          explain: 'Zabbix adalah platform monitoring metrik (time series) + alerting; logs dan traces butuh pelengkap lain.',
        },
      ],
    },
    {
      id: '23.3',
      title: 'Zabbix Architecture',
      body: `<p><b>Zabbix</b> adalah platform monitoring open-source (gratis, enterprise-grade) yang mengumpulkan metrik dari ribuan device, menyimpannya sebagai time series, mengevaluasi kondisi bermasalah, dan mengirim alert. Arsitekturnya terdiri dari lima komponen yang bekerja dalam satu alur data.</p>
<h3>Alur Data WAJIB (device → dashboard)</h3>
<p>Ini alur yang harus kamu hafal — setiap part monitoring (23–27) merujuk ke sini:</p>
<pre>① DEVICE (yang dipantau)
   MikroTik / FortiGate / Switch / Server / Printer
        │ ② PROTOCOL — bahasa untuk bertanya/mengirim data:
        │    SNMP (UDP 161) · ICMP ping · Zabbix agent (TCP 10050/10051)
        ▼
③ COLLECTOR — yang mengumpulkan
   ┌─ Zabbix Server  : polling langsung ke device (site lokal)
   ├─ Zabbix Proxy   : polling untuk site remote, kirim batch ke server
   └─ Zabbix Agent   : software di server, kirim metrik (pasif/aktif)
        │ ④ simpan nilai mentah + agregat
        ▼
⑤ DATABASE — gudang data
   MySQL / PostgreSQL / TimescaleDB
   tabel history (mentah, retensi pendek) + trends (per-jam, retensi panjang)
        │ ⑥ baca untuk evaluasi & tampilan
        ▼
⑥a TRIGGER ENGINE ── PROBLEM ──▶ ⑦ ALERT ──▶ email/Telegram/webhook ──▶ Engineer
⑥b FRONTEND (web UI) ◀── dashboard, grafik, peta, laporan SLA</pre>
<h3>Peran Tiap Komponen</h3>
<div class="tblwrap"><table>
<tr><th>Komponen</th><th>Peran</th><th>Analogi</th></tr>
<tr><td><b>Zabbix Server</b></td><td>Otak: polling device, evaluasi trigger, kirim alert, tulis ke DB</td><td>Kepala suster yang memeriksa semua pasien</td></tr>
<tr><td><b>Zabbix Proxy</b></td><td>Perwakilan server di site remote; kumpulkan lokal, kirim batch</td><td>Perawat cabang yang lapor ke rumah sakit pusat</td></tr>
<tr><td><b>Zabbix Agent</b></td><td>Software kecil di server; menjawab pertanyaan / mengirim metrik</td><td>Alat ukur yang menempel di pasien</td></tr>
<tr><td><b>Database</b></td><td>Menyimpan semua nilai historis (history + trends)</td><td>Rekam medis pasien</td></tr>
<tr><td><b>Frontend</b></td><td>Web UI: dashboard, konfigurasi, laporan</td><td>Ruang monitor dengan layar-layar</td></tr>
</table></div>
<h3>Dua Pola Pengumpulan</h3>
<ul>
<li><b>Polling (server bertanya):</b> server → device. Cocok untuk SNMP/ICMP. Kelemahan: butuh konektivitas server→device (masalah di balik NAT/firewall).</li>
<li><b>Trapping (device melapor):</b> device/agent → server. Cocok untuk agent aktif dan SNMP trap. Kelemahan: server harus siap menerima kapan saja.</li>
</ul>
<div class="callout blue"><div class="t">Kapan Butuh Proxy?</div><p style="margin:4px 0 0">Satu server Zabbix bisa memantau ribuan device — proxy HANYA dibutuhkan untuk: (1) site remote dengan link lambat/mahal (data dikompres per batch), (2) offload — membagi beban polling, (3) isolasi — site yang tidak boleh dijangkau langsung oleh server. Di lab ini, satu server cukup; proxy dibahas sebagai konsep.</p></div>`,
      terms: [
        ['Zabbix Server', 'Komponen pusat: polling, evaluasi trigger, alerting, tulis database.'],
        ['Zabbix Proxy', 'Collector perantara untuk site remote / offload beban.'],
        ['Collector', 'Istilah umum untuk apapun yang mengumpulkan metrik: server, proxy, agent.'],
        ['Frontend', 'Antarmuka web Zabbix untuk monitoring dan konfigurasi.'],
        ['NVPS', 'New Values Per Second — jumlah nilai baru per detik; ukuran beban server Zabbix.'],
      ],
      diagram: `<pre>         ARSITEKTUR ZABBIX LENGKAP

[Site Jakarta]                          [Site Surabaya (remote)]
[MikroTik]──SNMP──┐                      [MikroTik]──SNMP──┐
[FortiGate]─SNMP──┤                      [Switch]───SNMP───┤
[Server]───Agent──┤                      [Server]───Agent──┘
                  │                                │ batch kirim
                  ▼                                ▼
          [Zabbix Server] ◀──────────────── [Zabbix Proxy]
                  │  tulis / baca
                  ▼
          [Database: PostgreSQL/TimescaleDB]
             history (detik) │ trends (jam)
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
[Trigger Engine]──alert──▶[Telegram/Email]
[Frontend Web UI]──▶ dashboard NOC</pre>`,
      scenario: 'Perusahaan dengan 5 kantor cabang: tiap cabang dipasang Zabbix Proxy (link cabang lambat, hemat bandwidth karena data dikirim per batch), kantor pusat menjalankan Zabbix Server + database + frontend. NOC di pusat melihat semua cabang dalam satu dashboard — inilah arsitektur terdistribusi Zabbix.',
      bestPractices: 'Pisahkan fungsi: server Zabbix + database boleh satu VM di lab, tapi di production database sebaiknya di server terpisah agar beban query tidak mengganggu polling.',
      security: 'Zabbix server menyimpan kredensial SNMP semua device — ia adalah "kunci kerajaan". Amankan: letakkan di VLAN management (192.168.99.0/24), HTTPS untuk frontend, ganti password default Admin/zabbix, dan batasi siapa yang bisa login.',
      challenge: 'Gambar ulang diagram alur data ①–⑦ di atas untuk lab-mu sendiri: Zabbix server di 192.168.99.10, MikroTik di 192.168.99.1, FortiGate di 192.168.99.2. Tulis protokol apa yang dipakai di tiap panah.',
      interviewQ: 'Q: "Jelaskan alur data di Zabbix dari device sampai engineer menerima alert." — A: Device → protokol (SNMP/ICMP/agent) → collector (server/proxy) polling → database (history/trends) → trigger engine mengevaluasi → alert via media (email/Telegram) ke engineer; paralelnya frontend membaca database untuk dashboard.',
      quiz: [
        {
          q: 'Urutan alur data Zabbix yang benar adalah…',
          options: [
            'Dashboard → database → device → alert',
            'Device → protokol → collector → database → trigger/frontend → alert',
            'Alert → device → database → frontend',
            'Database → collector → device → trigger',
          ],
          answer: 1,
          explain: 'Alur baku: device → protokol (SNMP/ICMP/agent) → collector (server/proxy) → database → trigger engine/frontend → alert.',
        },
        {
          q: 'Kapan Zabbix Proxy dibutuhkan?',
          options: [
            'Selalu, untuk setiap instalasi',
            'Untuk site remote (hemat bandwidth), offload beban polling, atau isolasi jaringan',
            'Hanya untuk memantau printer',
            'Pengganti database',
          ],
          answer: 1,
          explain: 'Proxy untuk site remote (kirim batch, hemat link), offload beban, atau isolasi — bukan kebutuhan default.',
        },
        {
          q: 'Apa perbedaan polling dan trapping?',
          options: [
            'Tidak ada bedanya',
            'Polling: server bertanya ke device; trapping: device/agent melapor ke server',
            'Polling hanya untuk server Linux; trapping hanya untuk router',
            'Polling via TCP; trapping via HTTP',
          ],
          answer: 1,
          explain: 'Polling = server inisiatif bertanya; trapping = device/agent inisiatif mengirim (mis. agent aktif, SNMP trap).',
        },
      ],
    },
    {
      id: '23.4',
      title: 'Zabbix Server',
      body: `<p><b>Zabbix Server</b> adalah proses utama (<code>zabbix_server</code>) — otak yang melakukan semua pekerjaan berat: menjadwalkan polling ke device, menerima data trap, mengevaluasi trigger, mengeksekusi alert, dan menulis ke database. Tanpa server, komponen lain tidak ada artinya.</p>
<h3>Proses Internal (Kenapa Penting?)</h3>
<p>Server menjalankan banyak <i>proses anak</i> yang bisa kamu lihat di <i>Administration → Queue</i> dan log. Memahaminya = bisa troubleshooting "Zabbix lambat":</p>
<div class="tblwrap"><table>
<tr><th>Proses</th><th>Tugas</th><th>Kalau Bermasalah</th></tr>
<tr><td><b>Poller</b></td><td>Bertanya ke device (SNMP, agent pasif, ICMP)</td><td>Queue menumpuk → data telat → naikkan jumlah poller</td></tr>
<tr><td><b>Trapper</b></td><td>Menerima data yang dikirim device/agent aktif</td><td>Data agent aktif tidak masuk</td></tr>
<tr><td><b>Discoverer</b></td><td>Network discovery: menemukan device baru otomatis</td><td>Auto-discovery tidak jalan</td></tr>
<tr><td><b>Escalator</b></td><td>Menjalankan langkah eskalasi alert</td><td>Alert berhenti di langkah pertama</td></tr>
<tr><td><b>Housekeeper</b></td><td>Menghapus data lama sesuai retensi</td><td>Database membengkak</td></tr>
<tr><td><b>Preprocessing worker</b></td><td>Mengolah data mentah (delta, regex, dsb.)</td><td>Item dengan preprocessing macet</td></tr>
</table></div>
<h3>Sizing: Berapa Besar Server yang Dibutuhkan?</h3>
<p>Ukuran beban Zabbix diukur dengan <b>NVPS</b> (<i>New Values Per Second</i>). Rumus kasar:</p>
<pre>NVPS = (jumlah host × item per host) ÷ interval polling (detik)

Contoh lab: 10 host × 30 item ÷ 60 detik  = 5 NVPS   → VM kecil cukup
Contoh enterprise: 2000 host × 50 item ÷ 60 detik = 1667 NVPS → server serius + TimescaleDB</pre>
<p>Patokan: &lt;100 NVPS = VM 2 vCPU/4 GB RAM cukup; &gt;1000 NVPS = pisahkan database, gunakan TimescaleDB, tune jumlah poller.</p>
<h3>Port Penting</h3>
<div class="tblwrap"><table>
<tr><th>Port</th><th>Arah</th><th>Fungsi</th></tr>
<tr><td>TCP <b>10051</b></td><td>Masuk ke server</td><td>Trapper: menerima dari agent aktif & proxy</td></tr>
<tr><td>TCP <b>10050</b></td><td>Keluar dari server</td><td>Polling ke agent pasif</td></tr>
<tr><td>UDP <b>161</b></td><td>Keluar dari server</td><td>Query SNMP ke device</td></tr>
<tr><td>UDP <b>162</b></td><td>Masuk ke server</td><td>SNMP trap dari device</td></tr>
<tr><td>TCP <b>80/443</b></td><td>Masuk ke frontend</td><td>Web UI (wajib HTTPS di production)</td></tr>
</table></div>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> satu VM (2 vCPU, 4 GB RAM) berisi server + database + frontend sekaligus — cukup untuk puluhan host. <b>Production:</b> database di server terpisah, TimescaleDB untuk skala besar, backup database terjadwal, dan pertimbangkan HA (high availability) Zabbix 6.0+.</p></div>`,
      terms: [
        ['Poller', 'Proses server yang melakukan polling ke device.'],
        ['Housekeeper', 'Proses yang menghapus data lama sesuai kebijakan retensi.'],
        ['NVPS', 'New Values Per Second — metrik beban utama sizing Zabbix.'],
        ['Trapper', 'Proses yang menerima data kiriman dari agent aktif/proxy.'],
      ],
      scenario: 'NOC melaporkan "grafik Zabbix telat 10 menit". Engineer cek Administration → Queue: 8000 item menunggu, poller 100% sibuk. Penyebab: interval polling 30 detik untuk 500 host SNMP di satu server kecil. Solusi: tambah StartPollers di konfigurasi + naikkan interval item yang tidak kritis ke 5 menit — queue kembali nol.',
      bestPractices: 'Awasi "kesehatan si pemantau": buat host "Zabbix server" memantau dirinya sendiri (queue, poller busy %, NVPS) — monitoring yang tidak termonitor adalah bom waktu.',
      security: 'Jangan expose port 10051/10050 ke internet. Di production, batasi firewall: hanya proxy dan agent terdaftar yang boleh mencapai server.',
      challenge: 'Hitung NVPS untuk rencanamu: 25 host × 40 item dengan interval 60 detik. Termasuk kategori lab kecil/sedang/besar? Tulis kebutuhan VM-nya.',
      interviewQ: 'Q: "Zabbix server lambat, queue menumpuk — apa yang kamu cek?" — A: Cek Administration → Queue (item apa menumpuk), persentase poller busy, NVPS vs kapasitas; solusi: tambah poller (StartPollers), naikkan interval item non-kritis, atau offload ke proxy; pastikan database tidak menjadi bottleneck.',
      quiz: [
        {
          q: 'Apa fungsi utama Zabbix Server?',
          options: [
            'Menyimpan file konfigurasi router',
            'Polling device, evaluasi trigger, kirim alert, tulis ke database',
            'Menggantikan firewall',
            'Menjadi DHCP server',
          ],
          answer: 1,
          explain: 'Server adalah otak: polling, evaluasi trigger, alerting, dan penulisan database.',
        },
        {
          q: 'Queue menumpuk dan poller 100% sibuk. Langkah pertama yang masuk akal?',
          options: [
            'Restart router yang dipantau',
            'Tambah jumlah poller (StartPollers) dan/atau naikkan interval item non-kritis',
            'Hapus semua trigger',
            'Ganti password database',
          ],
          answer: 1,
          explain: 'Poller sibuk = beban polling melebihi kapasitas; tambah poller atau kurangi frekuensi polling.',
        },
        {
          q: 'NVPS 1667 (2000 host × 50 item / 60 detik) termasuk kategori…',
          options: [
            'Sangat kecil, cukup Raspberry Pi',
            'Sedang-besar: butuh server serius, database terpisah, TimescaleDB',
            'Tidak mungkin terjadi di Zabbix',
            'Hanya butuh tambah RAM frontend',
          ],
          answer: 1,
          explain: 'NVPS >1000 adalah beban enterprise: database terpisah + TimescaleDB + tuning.',
        },
      ],
    },
    {
      id: '23.5',
      title: 'Zabbix Agent',
      body: `<p><b>Zabbix Agent</b> adalah software kecil yang dipasang di komputer/server yang dipantau (Windows, Linux). Ia tahu cara membaca CPU, memory, disk, dan network interface dari OS-nya, lalu memberikan data itu ke Zabbix server. Untuk <b>network device</b> (MikroTik, FortiGate, switch) agent TIDAK dipakai — mereka dipantau via SNMP/ICMP (agentless).</p>
<h3>Dua Mode: Pasif vs Aktif</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Pasif (Passive)</th><th>Aktif (Active)</th></tr>
<tr><td>Siapa memulai</td><td>Server bertanya → agent menjawab (port TCP 10050)</td><td>Agent mengirim → server menerima (port TCP 10051)</td></tr>
<tr><td>Konfigurasi</td><td><code>Server=192.168.99.10</code> (IP server yang boleh bertanya)</td><td><code>ServerActive=192.168.99.10</code> (IP server tujuan kirim)</td></tr>
<tr><td>Cocok untuk</td><td>Server di LAN yang sama, mudah dijangkau</td><td>Server di balik NAT/firewall, site remote</td></tr>
<tr><td>Kelebihan</td><td>Timing presisi (server yang mengatur jadwal)</td><td>Tidak butuh port masuk ke server yang dipantau</td></tr>
</table></div>
<h3>Item Key: Bahasa Tanya ke Agent</h3>
<p>Setiap metrik punya <b>key</b> (kunci) — seperti "pertanyaan standar" yang dimengerti agent:</p>
<pre>system.cpu.util            → utilisasi CPU (%)
vm.memory.size[available]  → memory tersedia (byte)
vfs.fs.size[/,pfree]       → % disk root yang bebas
net.if.in[eth0]            → byte masuk interface eth0
agent.ping                 → 1 jika agent bisa dihubungi (cek konektivitas agent)</pre>
<h3>Contoh Konfigurasi (Linux)</h3>
<pre># /etc/zabbix/zabbix_agent2.conf  — ALASAN tiap baris:
Server=192.168.99.10        # HANYA server ini yang boleh bertanya (pasif) → keamanan
ServerActive=192.168.99.10  # kirim data aktif ke server ini
Hostname=web-server-01      # nama harus SAMA dengan nama host di frontend Zabbix

# restart service agar konfigurasi terbaca ulang
systemctl restart zabbix-agent2
# Expected output: service aktif; di Zabbix frontend, item agent.ping = 1</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> cukup mode pasif di LAN lab. <b>Production:</b> gunakan <b>PSK encryption</b> (pre-shared key) antara agent dan server agar metrik tidak bisa disadap/diubah di tengah jalan — metrik berisi info sensitif (nama proses, user login).</p></div>
<div class="callout blue"><div class="t">Catatan Versi</div><p style="margin:4px 0 0">Zabbix 7.x memakai <b>zabbix-agent2</b> (ditulis Go, mendukung plugin) sebagai default; agent1 lama (C) masih ada tapi tidak dikembangkan lagi. Di lab ini selalu pakai agent2.</p></div>`,
      terms: [
        ['Zabbix Agent', 'Software di host yang dipantau untuk menyediakan metrik OS.'],
        ['Passive check', 'Server bertanya, agent menjawab (TCP 10050).'],
        ['Active check', 'Agent mengirim data ke server/trapper (TCP 10051).'],
        ['Item key', 'Nama standar metrik yang dimengerti agent, mis. system.cpu.util.'],
        ['Agentless', 'Monitoring tanpa memasang agent — via SNMP/ICMP (untuk network device).'],
      ],
      scenario: 'Web server di DMZ (di balik firewall, tidak bisa dijangkau server Zabbix) perlu dimonitor. Mode pasif gagal (koneksi ditolak firewall). Solusi: agent mode aktif — agent yang berinisiatif mengirim keluar ke server via port 10051 yang dibuka satu arah di firewall.',
      bestPractices: 'Selalu isi Hostname dengan nama yang persis sama di frontend; 90% kasus "agent tidak konek" ternyata salah nama host atau parameter Server tidak berisi IP Zabbix server.',
      security: 'Parameter Server= adalah daftar putih: hanya IP di situ yang boleh meminta data. Jangan isi 0.0.0.0/0 — itu membuka data metrik untuk siapa saja.',
      challenge: 'Jelaskan dengan kata-katamu: kapan kamu pilih mode pasif dan kapan mode aktif? Beri 1 contoh topologi untuk masing-masing.',
      interviewQ: 'Q: "Apa beda Zabbix agent pasif dan aktif?" — A: Pasif: server bertanya via TCP 10050, cocok untuk host yang mudah dijangkau; aktif: agent mengirim ke server via TCP 10051, cocok untuk host di balik NAT/firewall. Keduanya bisa dipakai bersamaan.',
      quiz: [
        {
          q: 'Untuk memonitor MikroTik dan FortiGate, metode yang tepat adalah…',
          options: [
            'Install Zabbix agent di router',
            'Agentless via SNMP/ICMP — network device tidak dipasangi agent',
            'Telnet manual tiap jam',
            'Hanya bisa via API cloud',
          ],
          answer: 1,
          explain: 'Network device dipantau agentless (SNMP/ICMP); agent hanya untuk server/komputer (Windows/Linux).',
        },
        {
          q: 'Server di balik NAT perlu dimonitor. Mode agent yang tepat?',
          options: [
            'Pasif, karena lebih presisi',
            'Aktif — agent yang mengirim keluar ke server (TCP 10051)',
            'Keduanya tidak bisa',
            'Uninstall agent',
          ],
          answer: 1,
          explain: 'Mode aktif: agent berinisiatif mengirim, sehingga tidak butuh koneksi masuk menembus NAT/firewall.',
        },
        {
          q: 'Parameter Server= di zabbix_agent2.conf berfungsi sebagai…',
          options: [
            'Password enkripsi',
            'Daftar putih IP Zabbix server yang boleh meminta data (pasif)',
            'Alamat database',
            'Nama dashboard',
          ],
          answer: 1,
          explain: 'Server= membatasi IP mana saja yang boleh melakukan passive check ke agent — kontrol keamanan dasar.',
        },
      ],
    },
    {
      id: '23.6',
      title: 'Database',
      body: `<p><b>Database</b> adalah gudang tempat Zabbix menyimpan semua nilai historis. Setiap metrik yang dikumpulkan menjadi baris data <i>(timestamp, value)</i>. Karena monitoring berjalan 24/7, database adalah komponen yang paling cepat membengkak — desain retensi yang salah bisa membuat database 500 GB dalam setahun.</p>
<h3>Pilihan Database</h3>
<div class="tblwrap"><table>
<tr><th>Database</th><th>Karakter</th><th>Cocok Untuk</th></tr>
<tr><td><b>MySQL / MariaDB</b></td><td>Umum, dokumentasi terbanyak</td><td>Instalasi kecil–menengah</td></tr>
<tr><td><b>PostgreSQL</b></td><td>Stabil, fitur lengkap</td><td>Menengah–besar; pilihan default modern</td></tr>
<tr><td><b>PostgreSQL + TimescaleDB</b></td><td>Ekstensi time-series: kompresi + partisi otomatis</td><td>Besar (1000+ NVPS) — <b>rekomendasi resmi Zabbix</b></td></tr>
</table></div>
<h3>Dua Jenis Tabel: History vs Trends</h3>
<ul>
<li><b>History:</b> nilai <i>mentah</i> tiap polling (mis. CPU tiap 60 detik). Retensi pendek: 7–14 hari. Dipakai untuk grafik detail dan troubleshooting "apa yang terjadi 2 jam lalu".</li>
<li><b>Trends:</b> agregat <i>per jam</i> (min, avg, max, count). Retensi panjang: 1–2 tahun. Dipakai untuk grafik bulanan dan capacity planning.</li>
</ul>
<p>Mengapa dua-duanya? Menyimpan data mentah setahun untuk ribuan metrik = database raksasa yang lambat. Agregat per jam 100x lebih kecil tetapi cukup untuk melihat tren jangka panjang.</p>
<h3>Housekeeper: Petugas Kebersihan</h3>
<p>Proses <b>housekeeper</b> menghapus data yang melewati masa retensi (diatur di <i>Administration → Housekeeping</i>). Jika dimatikan atau database terlalu besar, partisi menumpuk dan query melambat.</p>
<pre>Contoh hitungan kasar (PostgreSQL):
10 host × 50 item × 1 nilai/menit = 500 nilai/menit ≈ 720.000 baris/hari
History 14 hari ≈ 10 juta baris  → wajar untuk VM kecil
Tanpa housekeeping 1 tahun ≈ 260 juta baris → query lambat, disk penuh</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> PostgreSQL/MySQL standar, retensi history 7 hari, trends 3 bulan — cukup. <b>Production:</b> TimescaleDB + backup database terjadwal (pg_dump) + monitoring ukuran tabel. Database monitoring yang hilang = buta total tanpa jejak.</p></div>`,
      terms: [
        ['History', 'Tabel nilai mentah tiap polling; retensi pendek (hari–minggu).'],
        ['Trends', 'Tabel agregat per jam (min/avg/max); retensi panjang (bulan–tahun).'],
        ['Housekeeper', 'Proses Zabbix yang menghapus data melewati retensi.'],
        ['TimescaleDB', 'Ekstensi PostgreSQL untuk data time-series: kompresi & partisi otomatis.'],
        ['Retensi', 'Lama data disimpan sebelum dihapus.'],
      ],
      scenario: 'Zabbix di perusahaan tiba-tiba lambat membuka grafik. Cek ukuran database: 480 GB — housekeeper mati 6 bulan karena "takut data hilang". Solusi: aktifkan kembali housekeeping bertahap + migrasi ke TimescaleDB dengan kompresi; ukuran turun ke 60 GB dan grafik kembali cepat.',
      bestPractices: 'Tentukan retensi SEBELUM production: history 14 hari, trends 365 hari adalah titik awal yang sehat untuk kebanyakan enterprise.',
      security: 'Backup database berisi seluruh peta jaringanmu (nama host, IP, metrik). Enkripsi backup dan simpan off-site; jangan taruh backup di server yang sama.',
      challenge: 'Hitung kebutuhan kasar lab-mu: 15 host × 40 item, interval 60 detik, retensi history 7 hari. Berapa baris data per hari? (Petunjuk: 15×40×1440.)',
      interviewQ: 'Q: "Apa beda tabel history dan trends di Zabbix?" — A: History menyimpan nilai mentah tiap polling dengan retensi pendek untuk analisis detail; trends menyimpan agregat per jam (min/avg/max) dengan retensi panjang untuk tren jangka panjang dan capacity planning — kompromi antara detail dan ukuran database.',
      quiz: [
        {
          q: 'Mengapa Zabbix memakai dua tabel history dan trends?',
          options: [
            'Agar terlihat canggih',
            'History = detail mentah retensi pendek; trends = agregat per jam retensi panjang — kompromi detail vs ukuran DB',
            'Karena PostgreSQL mewajibkan',
            'History untuk user, trends untuk admin',
          ],
          answer: 1,
          explain: 'Dua tabel menyeimbangkan kebutuhan detail jangka pendek dan tren jangka panjang tanpa database raksasa.',
        },
        {
          q: 'Apa tugas housekeeper?',
          options: [
            'Membersihkan debu server fisik',
            'Menghapus data yang melewati masa retensi agar database tidak membengkak',
            'Mengirim alert ke engineer',
            'Menghitung NVPS',
          ],
          answer: 1,
          explain: 'Housekeeper menghapus data lama sesuai kebijakan retensi di Administration → Housekeeping.',
        },
        {
          q: 'Untuk instalasi besar (1000+ NVPS), kombinasi database yang direkomendasikan adalah…',
          options: [
            'SQLite',
            'PostgreSQL + TimescaleDB',
            'File teks CSV',
            'Database di dalam RAM saja',
          ],
          answer: 1,
          explain: 'TimescaleDB memberi kompresi dan partisi otomatis untuk beban time-series besar — rekomendasi resmi Zabbix.',
        },
      ],
    },
    {
      id: '23.7',
      title: 'Frontend',
      body: `<p><b>Frontend</b> adalah antarmuka web Zabbix (ditulis PHP) — tempat engineer melihat semuanya: dashboard NOC, daftar masalah (problems), grafik latest data, dan semua menu konfigurasi (host, template, trigger, user). Server melakukan kerja berat; frontend hanya membaca database dan menampilkannya.</p>
<h3>Menu Utama</h3>
<div class="tblwrap"><table>
<tr><th>Menu</th><th>Fungsi</th></tr>
<tr><td><b>Monitoring → Problems</b></td><td>Daftar masalah aktif — layar utama NOC shift</td></tr>
<tr><td><b>Monitoring → Latest data</b></td><td>Nilai terakhir tiap metrik + grafik mini</td></tr>
<tr><td><b>Monitoring → Dashboards</b></td><td>Dashboard custom dengan widget grafik/gauge/peta</td></tr>
<tr><td><b>Data collection → Hosts</b></td><td>Daftar device yang dipantau + status ketersediaan</td></tr>
<tr><td><b>Data collection → Templates</b></td><td>Template item/trigger yang bisa di-link ke host</td></tr>
<tr><td><b>Alerts → Actions</b></td><td>Aturan "jika masalah X maka kirim ke Y"</td></tr>
<tr><td><b>Users → Users / User roles</b></td><td>Akun login dan hak aksesnya</td></tr>
<tr><td><b>Reports → Availability report / SLA</b></td><td>Laporan uptime untuk manajemen</td></tr>
</table></div>
<h3>Peran & Hak Akses (User Roles)</h3>
<ul>
<li><b>Admin:</b> akses penuh — konfigurasi host, template, user.</li>
<li><b>User biasa (NOC operator):</b> melihat monitoring + acknowledge masalah, tanpa ubah konfigurasi.</li>
<li><b>Guest (read-only):</b> mis. untuk layar dinding NOC atau manajemen — hanya lihat dashboard tertentu.</li>
</ul>
<h3>API: Frontend untuk Mesin</h3>
<p>Zabbix punya <b>JSON-RPC API</b> — semua yang bisa diklik di web bisa dilakukan via script. Ini fondasi automation (Part 32–33): menambah 100 host otomatis via script, bukan klik manual.</p>
<pre>Alur login pertama (WAJIB dilakukan):
1. Buka http://192.168.99.10/zabbix   (IP Zabbix server di VLAN management)
2. Login default: Admin / zabbix
3. SEGERA ganti password: Users → Users → Admin → ubah password
4. Buat user NOC terpisah — jangan semua orang pakai akun Admin</pre>
<div class="callout"><div class="t">Peringatan Keamanan Keras</div><p style="margin:4px 0 0">Kredensial default <b>Admin/zabbix</b> adalah hal pertama yang dicoba penyerang (ada di semua tutorial, termasuk yang ini). Di production, ganti sebelum server tersambung ke jaringan apa pun — dan wajib HTTPS agar password tidak lewat sebagai teks biasa.</p></div>`,
      terms: [
        ['Frontend', 'Antarmuka web Zabbix untuk monitoring dan konfigurasi.'],
        ['Acknowledge', 'Menandai masalah "sudah ditangani" agar tidak berisik, tanpa menutupnya.'],
        ['JSON-RPC API', 'API Zabbix untuk automation: semua operasi web bisa via script.'],
        ['User role', 'Tingkat hak akses akun: admin, user, guest.'],
      ],
      scenario: 'Manajemen minta "laporan uptime internet 3 bulan terakhir". Engineer tidak membuat manual: buka Reports → SLA, pilih layanan "Internet", export — laporan availability 99,87% dengan daftar downtime-nya keluar dalam 2 menit. Inilah nilai frontend sebagai alat komunikasi ke non-teknis.',
      bestPractices: 'Buat akun per orang (jangan akun Admin bersama) — saat insiden, jejak "siapa acknowledge masalah jam berapa" penting untuk post-mortem.',
      security: 'Aktifkan HTTPS (TLS) untuk frontend di production; batasi login hanya dari VLAN management; aktifkan audit log untuk perubahan konfigurasi kritis.',
      challenge: 'Rancang 3 akun untuk tim NOC-mu: 1 admin, 1 operator (bisa acknowledge, tidak bisa ubah config), 1 guest untuk layar dinding. Tulis hak akses masing-masing.',
      interviewQ: 'Q: "Apa yang kamu lakukan pertama kali setelah install Zabbix?" — A: Ganti password default Admin/zabbix, buat user per orang dengan role yang tepat, pastikan frontend hanya bisa diakses dari jaringan management, dan aktifkan HTTPS.',
      quiz: [
        {
          q: 'Menu "Monitoring → Problems" berfungsi sebagai…',
          options: [
            'Tempat menghapus database',
            'Daftar masalah aktif — layar utama operator NOC',
            'Pengaturan IP server',
            'Tempat install agent',
          ],
          answer: 1,
          explain: 'Problems adalah daftar masalah yang sedang aktif — fokus utama shift NOC.',
        },
        {
          q: 'Langkah keamanan pertama setelah install Zabbix adalah…',
          options: [
            'Menambah 100 host',
            'Mengganti password default Admin/zabbix dan membuat akun per orang',
            'Mematikan firewall server',
            'Membagikan password ke semua tim',
          ],
          answer: 1,
          explain: 'Kredensial default adalah target pertama penyerang; ganti segera dan gunakan akun individual.',
        },
        {
          q: 'JSON-RPC API Zabbix berguna untuk…',
          options: [
            'Bermain game di dashboard',
            'Automation: menambah/mengubah konfigurasi via script (fondasi Part 32–33)',
            'Mengganti tema warna saja',
            'Menghapus log otomatis',
          ],
          answer: 1,
          explain: 'API memungkinkan semua operasi konfigurasi dilakukan via script — dasar automation monitoring.',
        },
      ],
    },
    {
      id: '23.8',
      title: 'SNMP',
      body: `<p><b>SNMP</b> (<i>Simple Network Management Protocol</i>) adalah <b>bahasa standar</b> yang dipakai hampir semua network device (router, switch, firewall, printer, UPS) untuk melaporkan kondisinya. Ia berjalan di Layer 7 (aplikasi) di atas UDP. "Simple" di namanya merujuk ke protokolnya yang sederhana — bukan berarti mudah diamankan.</p>
<h3>Arsitektur: Manager ↔ Agent</h3>
<ul>
<li><b>Manager:</b> Zabbix server — yang bertanya dan mengumpulkan.</li>
<li><b>Agent:</b> software SNMP di device (MikroTik, FortiGate sudah punya bawaan) — yang menjawab.</li>
<li><b>MIB</b> (<i>Management Information Base</i>): "kamus" definisi data yang bisa ditanyakan.</li>
<li><b>OID</b> (<i>Object Identifier</i>): "alamat" tiap data dalam kamus itu (dibahas detail di 23.9).</li>
</ul>
<h3>Operasi Dasar</h3>
<div class="tblwrap"><table>
<tr><th>Operasi</th><th>Arah</th><th>Fungsi</th></tr>
<tr><td><b>GET</b></td><td>Manager → Agent</td><td>Ambil satu nilai ("berapa CPU-mu?")</td></tr>
<tr><td><b>GETNEXT / GETBULK</b></td><td>Manager → Agent</td><td>Ambil banyak nilai sekaligus (walk seluruh tabel)</td></tr>
<tr><td><b>SET</b></td><td>Manager → Agent</td><td><b>Ubah</b> nilai di device — BERBAHAYA, biasanya dimatikan</td></tr>
<tr><td><b>TRAP / INFORM</b></td><td>Agent → Manager</td><td>Device melapor sendiri saat kejadian ("link down!")</td></tr>
</table></div>
<h3>Versi SNMP: Pilih yang Aman</h3>
<div class="tblwrap"><table>
<tr><th>Versi</th><th>Autentikasi</th><th>Enkripsi</th><th>Status</th></tr>
<tr><td><b>v1</b></td><td>Community string (password teks biasa)</td><td>Tidak ada</td><td>Usang — jangan dipakai</td></tr>
<tr><td><b>v2c</b></td><td>Community string (teks biasa)</td><td>Tidak ada</td><td>OK untuk <b>lab</b>; mudah disadap</td></tr>
<tr><td><b>v3</b></td><td>Username + auth (SHA)</td><td>Ya (AES/DES)</td><td><b>Wajib di production</b></td></tr>
</table></div>
<p><b>Community string</b> adalah "password" SNMP v1/v2c — dikirim sebagai teks biasa di tiap paket. Siapa pun yang bisa sniff traffic bisa membacanya dan memetakan seluruh jaringanmu.</p>
<h3>Port</h3>
<pre>UDP 161 : manager bertanya ke agent (GET/WALK) — dibuka dari Zabbix → device
UDP 162 : agent melapor ke manager (TRAP)      — dibuka dari device → Zabbix</pre>
<div class="callout"><div class="t">LAB vs Production</div><p style="margin:4px 0 0"><b>Lab:</b> SNMPv2c dengan community <code>public-lab</code> boleh — simpel untuk belajar OID. <b>Production:</b> WAJIB SNMPv3 (auth+priv), community string default (<code>public</code>/<code>private</code>) tidak boleh ada, dan SET dimatikan kecuali benar-benar dibutuhkan.</p></div>`,
      terms: [
        ['SNMP', 'Simple Network Management Protocol — bahasa standar monitoring network device.'],
        ['Manager', 'Pihak yang bertanya/mengumpulkan (Zabbix server).'],
        ['SNMP Agent', 'Software di device yang menjawab query SNMP.'],
        ['MIB', 'Management Information Base — kamus definisi data SNMP.'],
        ['Community string', 'Password teks-biasa SNMP v1/v2c — tidak aman.'],
        ['Trap', 'Laporan inisiatif dari device ke manager saat kejadian.'],
      ],
      diagram: `<pre>              SNMP MANAGER ↔ AGENT

[Zabbix Server]  ──GET "cpu?"──▶  [MikroTik SNMP Agent]
  (manager)      ◀──"cpu=34%"──      port UDP 161
       ▲
       │ TRAP "link ether1 down!" (UDP 162)
       │
[FortiGate SNMP Agent] ──────────┘</pre>`,
      scenario: 'Audit keamanan menemukan community string "public" di 40 switch production — siapa pun di jaringan bisa membaca topologi lengkap via SNMP walk. Remediasi: migrasi bertahap ke SNMPv3 dengan user+auth+priv per device, community lama dihapus — monitoring tetap jalan, penyerang kehilangan "peta gratis".',
      bestPractices: 'Dokumentasikan versi SNMP tiap device dalam inventory; targetkan 100% SNMPv3 di production dan anggap v2c sebagai "utang keamanan".',
      security: 'Jangan pernah expose UDP 161 ke internet atau ke VLAN user/guest. SNMP hanya boleh dijangkau dari IP Zabbix server/proxy di VLAN management. SET selalu dimatikan kecuali ada kebutuhan spesifik yang disetujui.',
      challenge: 'Jelaskan kepada teman non-teknis: mengapa community string "public" di SNMP v2c itu seperti "menempelkan denah rumah di pagar depan"? Tulis analoginya.',
      interviewQ: 'Q: "Kapan pakai SNMP v2c dan kapan v3?" — A: v2c hanya untuk lab/isolated karena community string teks-biasa mudah disadap; production wajib v3 dengan autentikasi (SHA) dan enkripsi (AES) plus pembatasan akses firewall.',
      quiz: [
        {
          q: 'Dalam SNMP, siapa yang berperan sebagai "manager"?',
          options: [
            'Router yang dipantau',
            'Zabbix server — pihak yang bertanya dan mengumpulkan data',
            'Kabel UTP',
            'User yang login ke Wi-Fi',
          ],
          answer: 1,
          explain: 'Manager (Zabbix) bertanya; agent (di device) menjawab.',
        },
        {
          q: 'Mengapa SNMP v2c tidak aman untuk production?',
          options: [
            'Terlalu lambat',
            'Community string dikirim sebagai teks biasa — mudah disadap dan dipalsukan',
            'Tidak mendukung router',
            'Hanya jalan di Windows',
          ],
          answer: 1,
          explain: 'v2c tanpa autentikasi/enkripsi: community string terlihat siapa pun yang sniff traffic.',
        },
        {
          q: 'Operasi SNMP yang memungkinkan manager MENGUBAH konfigurasi device adalah…',
          options: ['GET', 'GETBULK', 'SET — berbahaya dan biasanya dimatikan', 'TRAP'],
          answer: 2,
          explain: 'SET menulis nilai ke device — matikan kecuali benar-benar dibutuhkan dan disetujui.',
        },
      ],
    },
    {
      id: '23.9',
      title: 'SNMP OID',
      body: `<p><b>OID</b> (<i>Object Identifier</i>) adalah "alamat" tiap data dalam dunia SNMP — deretan angka yang menunjukkan posisi data dalam pohon <b>MIB</b>. Contoh: <code>1.3.6.1.2.1.1.1.0</code> artinya "deskripsi sistem device ini" (<code>sysDescr</code>). Angka terakhir <code>.0</code> = nilai tunggal (skalar).</p>
<h3>Membaca Pohon OID</h3>
<pre>1.3.6.1.2.1  = mib-2 (standar umum semua device)
 ├── .1.1.1.0  sysDescr   → "MikroTik RouterOS 7.16 (CHR)"
 ├── .1.1.3.0  sysUpTime  → lama hidup device (timeticks)
 ├── .1.1.5.0  sysName    → nama device ("R1-Jakarta")
 └── .1.2.2.1  ifTable    → TABEL interface (setiap interface punya baris)
       ├── .10.X  ifInOctets.X   → byte masuk interface nomor X
       └── .16.X  ifOutOctets.X  → byte keluar interface nomor X
1.3.6.1.4.1    = enterprises (spesifik vendor)
 ├── .14988 ...  MikroTik (cpu, memory, wireless)
 └── .12356 ...  Fortinet (cpu, memory, sessions)</pre>
<h3>OID Penting (Hafalkan Polanya)</h3>
<div class="tblwrap"><table>
<tr><th>OID</th><th>Nama</th><th>Arti</th></tr>
<tr><td>1.3.6.1.2.1.1.1.0</td><td>sysDescr</td><td>Deskripsi device (model, OS)</td></tr>
<tr><td>1.3.6.1.2.1.1.3.0</td><td>sysUpTime</td><td>Lama hidup sejak boot — <b>berubah = device reboot!</b></td></tr>
<tr><td>1.3.6.1.2.1.1.5.0</td><td>sysName</td><td>Nama device</td></tr>
<tr><td>1.3.6.1.2.1.2.2.1.2.X</td><td>ifDescr.X</td><td>Nama interface nomor X ("ether1")</td></tr>
<tr><td>1.3.6.1.2.1.2.2.1.10.X</td><td>ifInOctets.X</td><td>Byte masuk interface X (counter 32-bit)</td></tr>
<tr><td>1.3.6.1.2.1.2.2.1.16.X</td><td>ifOutOctets.X</td><td>Byte keluar interface X (counter 32-bit)</td></tr>
</table></div>
<h3>Perintah snmpwalk / snmpget (Linux)</h3>
<pre># install dulu: apt install snmp  (Debian/Ubuntu)
# ALASAN tiap bagian:
#  -v2c = versi SNMP ; -c = community string ; lalu IP dan OID

snmpget -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.1.1.0
# Expected output:
# SNMPv2-MIB::sysDescr.0 = STRING: "MikroTik RouterOS 7.16"

snmpwalk -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.2.2.1.2
# Expected output: daftar ifDescr semua interface (ether1, ether2, ...)
# "walk" = ambil SEMUA data di bawah cabang OID itu</pre>
<div class="callout"><div class="t">Jebakan Nomor Interface (X)</div><p style="margin:4px 0 0">Nomor <code>X</code> di <code>ifInOctets.X</code> adalah <b>ifIndex</b> — bisa BERUBAH setelah reboot atau tambah interface! Jangan hardcode "ether1 = .10.3" selamanya. Zabbix mengatasinya dengan <i>low-level discovery</i>: memetakan nama interface → ifIndex otomatis (dibahas di 23.19).</p></div>
<div class="callout blue"><div class="t">Counter 32-bit vs 64-bit</div><p style="margin:4px 0 0">Counter 32-bit (ifInOctets) maksimal ~4,29 miliar byte — di link 1 Gbps penuh ia <i>wrap</i> (kembali ke 0) dalam 34 detik! Untuk link cepat pakai counter 64-bit: <code>ifHCInOctets</code> (1.3.6.1.2.1.31.1.1.1.6.X) dan <code>ifHCOutOctets</code> (...1.10.X). Aturan: link &gt; 114 Mbps wajib 64-bit.</p></div>`,
      terms: [
        ['OID', 'Object Identifier — alamat angka tiap data dalam pohon MIB.'],
        ['MIB', 'Kamus definisi: OID apa artinya apa, tipe datanya apa.'],
        ['ifIndex', 'Nomor urut interface dalam tabel SNMP — bisa berubah, jangan hardcode.'],
        ['Counter wrap', 'Counter kembali ke 0 setelah mencapai maksimum — alasan pakai 64-bit di link cepat.'],
        ['snmpwalk', 'Perintah mengambil semua OID di bawah satu cabang pohon.'],
      ],
      scenario: 'Grafik traffic ether1 tiba-tiba menunjukkan lonjakan mustahil 4 Gbps di link 1 Gbps. Penyebab: memakai ifInOctets 32-bit yang wrap tiap 34 detik di link penuh — Zabbix menghitung delta negatif sebagai lonjakan. Solusi: ganti ke ifHCInOctets 64-bit — grafik kembali waras.',
      bestPractices: 'Untuk OID vendor-spesifik (MikroTik .14988, Fortinet .12356), selalu verifikasi dengan snmpwalk dulu sebelum membuat item Zabbix — dokumentasi vendor kadang berbeda antar versi firmware.',
      security: 'snmpwalk dengan community yang benar akan membeberkan seluruh konfigurasi interface dan informasi sistem — alasan lain community string harus dirahasiakan dan akses UDP 161 dibatasi.',
      challenge: 'Jalankan snmpwalk ke lab MikroTik-mu untuk cabang ifTable (1.3.6.1.2.1.2.2.1.2). Catat: berapa interface yang ada dan apa nama-namanya? Cocokkan dengan output /interface print di RouterOS.',
      interviewQ: 'Q: "Apa itu OID dan mengapa ifIndex berbahaya jika di-hardcode?" — A: OID adalah alamat data dalam pohon MIB SNMP; ifIndex (nomor X di ifInOctets.X) bisa berubah setelah reboot/tambah interface, sehingga hardcode membuat item menunjuk interface yang salah — gunakan discovery otomatis.',
      quiz: [
        {
          q: 'OID 1.3.6.1.2.1.1.3.0 (sysUpTime) berguna untuk mendeteksi…',
          options: [
            'Kecepatan kipas',
            'Device reboot — nilainya kembali kecil saat device baru menyala',
            'Jumlah user Wi-Fi',
            'Versi WinBox',
          ],
          answer: 1,
          explain: 'sysUpTime = lama hidup sejak boot; nilai yang tiba-tiba kecil = device baru saja reboot.',
        },
        {
          q: 'Mengapa link 1 Gbps harus memakai ifHCInOctets (64-bit) bukan ifInOctets (32-bit)?',
          options: [
            'Karena lebih murah',
            'Counter 32-bit wrap (kembali ke 0) dalam ~34 detik di link penuh → data traffic rusak',
            'Karena 64-bit lebih cepat',
            'Tidak ada alasan, sama saja',
          ],
          answer: 1,
          explain: 'Counter 32-bit hanya sampai ~4,29 miliar byte; di 1 Gbps penuh itu habis dalam 34 detik dan wrap merusak perhitungan delta.',
        },
        {
          q: 'Perintah snmpwalk berfungsi untuk…',
          options: [
            'Mengubah konfigurasi device',
            'Mengambil SEMUA data di bawah satu cabang OID — cara eksplorasi MIB',
            'Me-reboot device',
            'Menghapus community string',
          ],
          answer: 1,
          explain: 'snmpwalk "berjalan" menyusuri cabang pohon OID dan menampilkan semua nilai di bawahnya.',
        },
      ],
    },
    {
      id: '23.10',
      title: 'ICMP Monitoring',
      body: `<p><b>ICMP monitoring</b> adalah cara paling sederhana memantau ketersediaan: Zabbix mengirim paket <b>ping</b> (ICMP Echo Request) ke device dan mengukur apakah ada balasan, berapa yang hilang, dan berapa lama. Tidak butuh SNMP, tidak butuh agent — cukup device menjawab ping.</p>
<h3>Tiga Item Kunci</h3>
<div class="tblwrap"><table>
<tr><th>Item Key</th><th>Arti</th><th>Nilai Sehat</th></tr>
<tr><td><code>icmpping</code></td><td>1 = hidup, 0 = mati</td><td>1 terus-menerus</td></tr>
<tr><td><code>icmppingloss</code></td><td>% ping yang hilang</td><td>0% (di LAN)</td></tr>
<tr><td><code>icmppingsec</code></td><td>Waktu respons rata-rata (detik)</td><td>&lt; 0,01 dtk di LAN</td></tr>
</table></div>
<h3>Cara Kerja Teknis</h3>
<p>Zabbix server memakai <b>ICMP pinger</b> — proses khusus yang mengirim echo request mentah via raw socket. Di Linux ini butuh kapabilitas khusus:</p>
<pre># ALASAN: binary fping/ping butuh raw socket untuk membuat paket ICMP mentah.
# Tanpa ini, icmpping selalu gagal walau device hidup!
setcap cap_net_raw+ep /usr/sbin/fping
# Expected output: (tidak ada output = sukses); cek: getcap /usr/sbin/fping</pre>
<p>Template bawaan <b>"ICMP Ping"</b> sudah berisi ketiga item + trigger:</p>
<pre>Trigger bawaan template ICMP Ping:
- "High ICMP ping time"      → icmppingsec rata-rata 5 menit > 0.15 dtk
- "High ICMP loss"           → icmppingloss > 20%
- "Host unreachable"         → icmpping = 0 selama 3x cek  → severity High
# ALASAN 3x cek: menghindari false alarm karena 1 paket hilang sesekali (wajar di jaringan)</pre>
<h3>Keterbatasan (Penting!)</h3>
<ul>
<li>ICMP hanya tahu <b>up/down</b> — tidak tahu <i>mengapa</i> down (power? kabel? hang?).</li>
<li>Banyak device mematikan respons ping di production (kebijakan keamanan) — maka ICMP bukan metrik availability yang valid di sana; gunakan SNMP sysUpTime atau TCP port check sebagai gantinya.</li>
<li>Ping sukses ≠ layanan sehat: router bisa menjawab ping tapi proses routing-nya hang.</li>
</ul>
<div class="callout blue"><div class="t">Hubungan dengan OSI</div><p style="margin:4px 0 0">ICMP adalah protokol Layer 3. icmpping menguji "apakah Layer 3 device ini hidup dan routing ke sana bekerja" — tidak lebih. Untuk memastikan <i>layanan</i> hidup, butuh cek Layer 4/7 (port TCP, HTTP).</p></div>`,
      terms: [
        ['ICMP', 'Internet Control Message Protocol — protokol Layer 3 untuk pesan kontrol & diagnostik (ping).'],
        ['icmpping', 'Item Zabbix: 1 jika host menjawab ping, 0 jika tidak.'],
        ['icmppingloss', 'Item Zabbix: persentase ping yang hilang.'],
        ['False alarm', 'Alert palsu akibat gangguan sesaat yang sebenarnya bukan masalah.'],
      ],
      scenario: 'NOC menerima alert "Host unreachable: switch-gudang" pukul 02.14. Karena trigger butuh 3x gagal beruntun, engineer yakin ini bukan false alarm. Ternyata UPS gudang mati dan switch kehabisan daya — tim dikirim sebelum shift pagi, user gudang tidak pernah merasakan gangguan.',
      bestPractices: 'Selalu pasang template ICMP Ping sebagai "lapis pertama" di SEMUA host — murah (3 item) dan menjadi dasar trigger dependency (23.17): jika router mati, alert switch di belakangnya otomatis di-suppress.',
      security: 'Di production, pertimbangkan mematikan respons ping dari internet (tapi tetap izinkan dari Zabbix server) — ping terbuka memudahkan penyerang memetakan host hidup.',
      challenge: 'Bandingkan: device yang menjawab ping tetapi SNMP-nya timeout. Apa artinya? Tulis 3 kemungkinan penyebabnya dan cara membedakan ketiganya.',
      interviewQ: 'Q: "Ping OK apakah berarti device sehat?" — A: Tidak — ping hanya membuktikan Layer 3 hidup dan bisa dijangkau. Device bisa menjawab ping sementara CPU 100%, SNMP mati, atau layanannya hang. Ping = syarat perlu, bukan syarat cukup.',
      quiz: [
        {
          q: 'Apa fungsi item icmpping?',
          options: [
            'Mengukur suhu CPU',
            'Menandai 1 jika host menjawab ping (hidup), 0 jika tidak',
            'Menghitung jumlah user',
            'Mengukur kecepatan disk',
          ],
          answer: 1,
          explain: 'icmpping adalah indikator up/down paling dasar: 1 = hidup, 0 = mati.',
        },
        {
          q: 'Mengapa trigger "host unreachable" memakai 3x cek gagal beruntun, bukan 1x?',
          options: [
            'Agar server tidak lelah',
            'Menghindari false alarm dari 1 paket hilang sesekali yang wajar di jaringan',
            'Karena Zabbix lambat',
            'Agar alert terkirim 3 kali',
          ],
          answer: 1,
          explain: 'Satu paket hilang sesekali itu normal; 3x gagal beruntun = indikasi kuat benar-benar down.',
        },
        {
          q: 'Keterbatasan utama ICMP monitoring adalah…',
          options: [
            'Terlalu mahal',
            'Hanya tahu up/down di Layer 3 — tidak tahu penyebab dan tidak menjamin layanan sehat',
            'Tidak bisa dipakai di Linux',
            'Harus beli lisensi',
          ],
          answer: 1,
          explain: 'Ping OK ≠ sehat: hanya membuktikan Layer 3 hidup, bukan CPU/SNMP/layanan aplikasi.',
        },
      ],
    },
    {
      id: '23.11',
      title: 'Interface Monitoring',
      body: `<p><b>Interface monitoring</b> adalah memantau traffic tiap port/interface device: berapa bit per detik masuk dan keluar. Ini metrik <b>paling sering dilihat di NOC</b> — "link mana yang penuh?" adalah pertanyaan troubleshooting nomor satu.</p>
<h3>Cara Kerja Teknis: Dari Counter ke bps</h3>
<p>Device tidak melaporkan "kecepatan saat ini" — ia melaporkan <b>counter total byte</b> sejak boot (ifInOctets). Zabbix menghitung kecepatannya:</p>
<pre>Langkah perhitungan (dilakukan otomatis oleh Zabbix):
1. Polling 10:00 → ifInOctets = 1.000.000.000 byte
2. Polling 10:01 → ifInOctets = 1.060.000.000 byte
3. Delta = 60.000.000 byte dalam 60 detik
4. × 8 (byte→bit) ÷ 60 detik = 8.000.000 bps = 8 Mbps  ← nilai yang digrafik

Di Zabbix ini diatur via preprocessing item: "Change per second" + custom multiplier 8.
ALASAN ×8: counter dalam byte, sedangkan bandwidth selalu dinyatakan dalam bit.</pre>
<h3>Item yang Dibuat (per Interface)</h3>
<div class="tblwrap"><table>
<tr><th>Item</th><th>OID (contoh)</th><th>Preprocessing</th></tr>
<tr><td>Incoming traffic</td><td>ifHCInOctets.X (64-bit)</td><td>Change per second → ×8 → bps</td></tr>
<tr><td>Outgoing traffic</td><td>ifHCOutOctets.X (64-bit)</td><td>Change per second → ×8 → bps</td></tr>
<tr><td>Operational status</td><td>ifOperStatus.X</td><td>— (1=up, 2=down)</td></tr>
<tr><td>Interface speed</td><td>ifHighSpeed.X</td><td>— (Mbps, untuk hitung utilisasi %)</td></tr>
<tr><td>Errors in/out</td><td>ifInErrors.X / ifOutErrors.X</td><td>Change per second</td></tr>
<tr><td>Discards in/out</td><td>ifInDiscards.X / ifOutDiscards.X</td><td>Change per second</td></tr>
</table></div>
<h3>Utilisasi: Angka yang Menentukan Upgrade</h3>
<pre>Utilisasi % = (traffic bps ÷ kecepatan interface bps) × 100

Contoh: traffic 850 Mbps di interface 1 Gbps → utilisasi 85%
Patokan NOC:
  < 50%  hijau  — aman
  50–80% kuning — awasi trennya
  > 80%  merah  — rencanakan upgrade / QoS (jangan tunggu 100%!)</pre>
<div class="callout"><div class="t">Mengapa 80%, Bukan 100%?</div><p style="margin:4px 0 0">Di atas ~80% utilisasi sustained, antrean buffer mulai penuh → latency naik (queuing delay, Part 01) dan packet loss muncul saat burst. Menunggu 100% berarti user sudah merasakan dampaknya.</p></div>`,
      terms: [
        ['ifInOctets / ifHCInOctets', 'Counter total byte masuk interface (32-bit / 64-bit).'],
        ['Change per second', 'Preprocessing Zabbix: mengubah counter menjadi laju per detik.'],
        ['Utilisasi', 'Persentase kapasitas interface yang terpakai.'],
        ['ifOperStatus', 'Status operasional interface: 1=up, 2=down.'],
      ],
      scenario: 'User lapor "internet lambat tiap jam 2 siang". Grafik interface WAN menunjukkan utilisasi 97% pukul 14.00–16.00 setiap hari kerja — berkorelasi dengan jam backup cloud otomatis. Solusi: jadwal backup digeser ke malam hari; utilisasi jam kerja turun ke 45%. Tanpa grafik per interface, penyebabnya tidak akan pernah terlihat.',
      bestPractices: 'Pantau error & discard BERSAMAAN dengan traffic: traffic tinggi + error naik = masalah fisik (kabel/SFP); traffic tinggi + error nol = murni kapasitas.',
      security: 'Grafik traffic adalah bukti forensik: lonjakan upload besar jam 3 pagi ke IP asing = indikasi exfiltrasi data. Simpan trends minimal 1 tahun.',
      challenge: 'Hitung manual: ifInOctets 10:00 = 5.000.000.000, 10:05 = 5.900.000.000. Berapa Mbps rata-rata? (Petunjuk: delta byte × 8 ÷ 300 detik ÷ 1.000.000.)',
      interviewQ: 'Q: "Bagaimana Zabbix mengubah counter ifInOctets menjadi grafik Mbps?" — A: Mengambil selisih counter antar polling (delta byte), dikali 8 menjadi bit, dibagi interval detik — via preprocessing "Change per second" dengan multiplier 8.',
      quiz: [
        {
          q: 'Device melaporkan counter byte, bukan kecepatan. Bagaimana Zabbix mendapatkan nilai bps?',
          options: [
            'Menebak dari suhu device',
            'Delta counter antar polling × 8 (byte→bit) ÷ interval detik',
            'Bertanya ke ISP',
            'Mengukur dengan stopwatch',
          ],
          answer: 1,
          explain: 'Kecepatan = selisih counter (byte) × 8 ÷ detik — preprocessing "Change per second" + multiplier 8.',
        },
        {
          q: 'Utilisasi berapa yang menjadi sinyal untuk merencanakan upgrade?',
          options: [
            '100% — tunggu sampai penuh total',
            '> 80% sustained — antrean & loss mulai muncul sebelum 100%',
            '10%',
            'Tidak perlu dipantau',
          ],
          answer: 1,
          explain: 'Di atas ~80% sustained, queuing delay dan packet loss mulai terasa — upgrade direncanakan sebelum user terdampak.',
        },
        {
          q: 'Traffic tinggi + error counter naik bersamaan mengindikasikan…',
          options: [
            'Kapasitas kurang — segera upgrade bandwidth',
            'Masalah fisik (kabel/SFP/port) — bukan murni kapasitas',
            'Virus di laptop user',
            'Zabbix salah hitung',
          ],
          answer: 1,
          explain: 'Error naik = frame rusak di Layer 1/2 (kabel, SFP, duplex); kapasitas murni menunjukkan traffic tinggi dengan error nol.',
        },
      ],
    },
    {
      id: '23.12',
      title: 'CPU',
      body: `<p><b>CPU monitoring</b> memantau utilisasi prosesor network device. Berbeda dengan server yang multitasking, CPU router/firewall dipakai untuk: memproses paket (routing, firewalling), enkripsi VPN, dan layanan management (SNMP, WinBox). CPU yang jenuh = paket <b>terlambat atau dibuang</b> — dampaknya langsung ke user.</p>
<h3>Mengapa CPU Device Penting?</h3>
<ul>
<li><b>Packet drop:</b> CPU 100% berarti paket datang lebih cepat daripada bisa diproses → antrean penuh → tail drop (Part 01: packet loss).</li>
<li><b>Latency naik:</b> paket antre menunggu giliran diproses → queuing delay.</li>
<li><b>Management macet:</b> SNMP timeout dan WinBox/SSH lambat — ironisnya tepat saat kamu butuh troubleshooting.</li>
<li><b>Deteksi serangan:</b> lonjakan CPU tiba-tiba sering = serangan DDoS, scanning, atau loop.</li>
</ul>
<h3>OID CPU per Vendor</h3>
<div class="tblwrap"><table>
<tr><th>Device</th><th>OID</th><th>Nama MIB</th></tr>
<tr><td>MikroTik</td><td>1.3.6.1.4.1.14988.1.1.3.8.0</td><td>mtxrHlProcessorLoad</td></tr>
<tr><td>FortiGate</td><td>1.3.6.1.4.1.12356.101.4.1.3.0</td><td>fgSysCpuUsage</td></tr>
<tr><td>Umum (hrProcessor)</td><td>1.3.6.1.2.1.25.3.3.1.2.X</td><td>hrProcessorLoad.X (per core)</td></tr>
</table></div>
<h3>Ambang Batas (Threshold)</h3>
<div class="tblwrap"><table>
<tr><th>Kondisi</th><th>Arti</th><th>Aksi</th></tr>
<tr><td>&lt; 50%</td><td>Sehat</td><td>—</td></tr>
<tr><td>50–70%</td><td>Mulai sibuk</td><td>Awasi tren; cek penyebab jika naik terus</td></tr>
<tr><td>70–90% sustained 5 mnt</td><td><b>Warning</b></td><td>Investigasi: proses apa? traffic apa?</td></tr>
<tr><td>&gt; 90% sustained 5 mnt</td><td><b>High</b></td><td>Alert ke NOC; risiko packet drop nyata</td></tr>
<tr><td>100% + packet loss</td><td><b>Disaster</b></td><td>Eskalasi; pertimbangkan failover</td></tr>
</table></div>
<p><b>Kenapa "sustained 5 menit"?</b> Lonjakan CPU 1 menit itu normal (mis. saat backup config atau login WinBox). Trigger yang baik memakai rata-rata: <code>avg(/Router/system.cpu.util,5m)&gt;90</code> — hanya alarm jika TINGGI dan TAHAN LAMA.</p>
<div class="callout blue"><div class="t">CPU vs Traffic</div><p style="margin:4px 0 0">CPU tinggi + traffic tinggi = wajar (device memang bekerja keras). CPU tinggi + traffic RENDAH = tidak wajar: kemungkinan serangan, proses hang, atau bug firmware — investigasi prioritas.</p></div>`,
      terms: [
        ['CPU utilization', 'Persentase kapasitas prosesor yang terpakai.'],
        ['Sustained', 'Kondisi yang bertahan selama periode waktu tertentu (bukan sesaat).'],
        ['Tail drop', 'Paket dibuang karena antrean (buffer) penuh.'],
        ['hrProcessorLoad', 'OID standar untuk load prosesor per core.'],
      ],
      scenario: 'Setiap pukul 20.00 CPU FortiGate menyentuh 98% selama 30 menit. Korelasi dengan log: jadwal scan antivirus massal + backup ke cloud yang melewati inspeksi SSL. Solusi: jadwal dipecah dan exclusion policy untuk traffic backup — CPU malam turun ke 40%.',
      bestPractices: 'Selalu tampilkan grafik CPU berdampingan dengan grafik traffic interface di dashboard NOC — kombinasi keduanya langsung menjawab "wajar atau tidak".',
      security: 'Lonjakan CPU tanpa kenaikan traffic yang jelas adalah indikator kompromi (mis. device dipakai mining atau jadi bot). Perlakukan sebagai insiden keamanan, bukan sekadar "device lambat".',
      challenge: 'Buat trigger expression untuk: "CPU MikroTik rata-rata 5 menit di atas 80% DAN traffic ether1 di bawah 100 Mbps" (kondisi tidak wajar). Tulis expression-nya.',
      interviewQ: 'Q: "CPU router 95% — kapan itu normal dan kapan itu masalah?" — A: Normal jika berkorelasi dengan traffic tinggi (device memang sibuk memproses). Masalah jika traffic rendah tapi CPU tinggi (serangan/proses hang/bug), atau jika sustained dan mulai ada packet loss — maka butuh investigasi/eskalasi.',
      quiz: [
        {
          q: 'Dampak langsung CPU router 100% sustained terhadap user adalah…',
          options: [
            'Tidak ada dampak',
            'Paket terlambat (queuing delay) atau dibuang (tail drop) → lambat/putus',
            'Wi-Fi menjadi lebih cepat',
            'Hanya tagihan listrik naik',
          ],
          answer: 1,
          explain: 'CPU jenuh = paket tidak sempat diproses → antre, terlambat, atau dibuang.',
        },
        {
          q: 'Mengapa trigger CPU memakai rata-rata 5 menit, bukan nilai sesaat?',
          options: [
            'Agar grafik lebih bagus',
            'Lonjakan sesaat itu normal (login, backup config); yang berbahaya adalah tinggi yang bertahan',
            'Karena Zabbix tidak bisa nilai sesaat',
            'Agar alert lebih sering',
          ],
          answer: 1,
          explain: 'Spike sesaat wajar; sustained high = masalah nyata. Rata-rata menyaring noise.',
        },
        {
          q: 'CPU 95% + traffic rendah mengindikasikan…',
          options: [
            'Kondisi normal',
            'Kondisi TIDAK WAJAR — kemungkinan serangan, proses hang, atau bug firmware',
            'Kabel putus',
            'Zabbix error',
          ],
          answer: 1,
          explain: 'CPU tinggi seharusnya berkorelasi dengan kerja (traffic); tanpa itu, ada proses liar yang harus diinvestigasi.',
        },
      ],
    },
    {
      id: '23.13',
      title: 'Memory',
      body: `<p><b>Memory monitoring</b> memantau penggunaan RAM network device. Memory dipakai untuk: tabel routing, tabel koneksi firewall (session table), buffer paket, dan cache. Berbeda dengan CPU yang naik-turun cepat, memory yang bermasalah biasanya menunjukkan pola <b>naik perlahan tapi pasti</b> — tanda klasik <i>memory leak</i>.</p>
<h3>OID Memory per Vendor</h3>
<div class="tblwrap"><table>
<tr><th>Device</th><th>OID</th><th>Arti</th></tr>
<tr><td>MikroTik</td><td>1.3.6.1.4.1.14988.1.1.3.9.0</td><td>Memory terpakai (byte)</td></tr>
<tr><td>MikroTik</td><td>1.3.6.1.4.1.14988.1.1.3.10.0</td><td>Memory total (byte)</td></tr>
<tr><td>FortiGate</td><td>1.3.6.1.4.1.12356.101.4.1.4.0</td><td>fgSysMemUsage (%)</td></tr>
<tr><td>Umum</td><td>1.3.6.1.2.1.25.2.3.1.6.X</td><td>hrStorageUsed.X (per storage)</td></tr>
</table></div>
<h3>Memory Leak: Pembunuh Perlahan</h3>
<p><b>Memory leak</b> = bug software di mana memory yang sudah tidak dipakai tidak dikembalikan. Polanya khas di grafik: garis naik miring perlahan selama berminggu-minggu, lalu device hang/crash saat memory habis.</p>
<pre>Pola grafik memory sehat vs bocor:

Sehat:  45% ──╱╲──╱╲──╱╲── 45%   (naik-turun, stabil)
Bocor:  45% ──╱───╱───╱───╱─ 92%  (naik terus, tidak pernah turun signifikan)
                                     → prediksi: habis dalam N hari (fungsi forecast)</pre>
<p>Zabbix punya fungsi <b>forecast()</b> yang bisa memprediksi "kapan memory mencapai 100%" dari tren — trigger proaktif: <i>"memory diprediksi penuh dalam 7 hari"</i>.</p>
<h3>Ambang Batas</h3>
<div class="tblwrap"><table>
<tr><th>Kondisi</th><th>Aksi</th></tr>
<tr><td>&gt; 80%</td><td>Warning — investigasi tren (naik terus?)</td></tr>
<tr><td>&gt; 90%</td><td>High — risiko instability; rencanakan reboot/upgrade firmware terjadwal</td></tr>
<tr><td>Naik 5%/minggu konsisten</td><td>Laporkan sebagai bug ke vendor; siapkan jadwal reboot berkala sementara</td></tr>
</table></div>
<div class="callout"><div class="t">Session Table FortiGate</div><p style="margin:4px 0 0">Di firewall, memory erat dengan <b>jumlah session</b> (koneksi aktif). Session meledak (mis. serangan) = memory ikut naik. Pantau keduanya bersamaan (23.25 membahas session).</p></div>`,
      terms: [
        ['Memory leak', 'Bug di mana memory tak terpakai tidak dikembalikan — naik perlahan sampai habis.'],
        ['Session table', 'Tabel koneksi aktif di firewall — memakan memory per session.'],
        ['forecast()', 'Fungsi Zabbix memprediksi kapan nilai mencapai ambang dari tren.'],
      ],
      scenario: 'Router cabang hang setiap ~45 hari dan harus dicabut-colok. Grafik memory Zabbix menunjukkan pola naik 1,2%/hari yang tidak pernah turun — memory leak di firmware versi lama. Solusi permanen: upgrade RouterOS; sementara: reboot terjadwal tiap 30 hari via script. Tanpa grafik historis, polanya tidak akan pernah terlihat.',
      bestPractices: 'Untuk memory, grafik TREN MINGGUAN lebih berharga dari nilai sesaat — leak hanya terlihat dalam rentang panjang.',
      security: 'Memory penuh bisa dimanfaatkan untuk DoS: serangan yang membanjiri session table (SYN flood) menghabiskan memory firewall hingga device tidak responsif. Monitor session + memory sebagai pasangan.',
      challenge: 'Lihat grafik memory router lab-mu 7 hari terakhir. Apakah polanya datar, naik-turun, atau naik terus? Tulis kesimpulanmu dan apa yang akan kamu lakukan untuk masing-masing pola.',
      interviewQ: 'Q: "Bagaimana kamu mendeteksi memory leak dari monitoring?" — A: Dari grafik tren jangka panjang: memory naik perlahan konsisten tanpa pernah turun signifikan; Zabbix forecast() bisa memprediksi kapan mencapai 100% untuk alert proaktif sebelum device hang.',
      quiz: [
        {
          q: 'Tanda khas memory leak pada grafik adalah…',
          options: [
            'Garis datar stabil',
            'Garis naik perlahan dan konsisten selama berminggu-minggu tanpa turun signifikan',
            'Garis naik-turun cepat tiap menit',
            'Grafik kosong',
          ],
          answer: 1,
          explain: 'Leak = memory tak dikembalikan → akumulasi naik perlahan sampai habis.',
        },
        {
          q: 'Fungsi Zabbix forecast() berguna untuk…',
          options: [
            'Meramal cuaca',
            'Memprediksi kapan suatu metrik mencapai ambang batas berdasarkan tren — mis. memory penuh dalam 7 hari',
            'Menghitung rata-rata saja',
            'Menghapus data lama',
          ],
          answer: 1,
          explain: 'forecast() mengekstrapolasi tren untuk alert proaktif sebelum masalah terjadi.',
        },
        {
          q: 'Di firewall, kenaikan memory yang perlu diwaspadai berkorelasi dengan…',
          options: [
            'Jumlah session/koneksi aktif — tiap session memakan memory',
            'Warna LED device',
            'Jumlah kabel tercolok',
            'Versi browser admin',
          ],
          answer: 0,
          explain: 'Session table memakan memory per koneksi; ledakan session (serangan/异常) menaikkan memory.',
        },
      ],
    },
    {
      id: '23.14',
      title: 'Disk',
      body: `<p><b>Disk monitoring</b> memantau ruang penyimpanan: di server (partisi <code>/</code>, <code>/var</code>) dan di network device (flash memory untuk OS, config, dan log). Disk yang penuh bukan sekadar "tidak bisa simpan file" — di device jaringan ia bisa <b>menghentikan logging, menggagalkan simpan konfigurasi, bahkan membuat service crash</b>.</p>
<h3>Mengapa Disk Penuh Berbahaya?</h3>
<ul>
<li><b>Log berhenti:</b> device tidak bisa mencatat kejadian → buta saat insiden (observability hilang tepat saat dibutuhkan).</li>
<li><b>Config tidak tersimpan:</b> perubahan konfigurasi gagal ditulis ke flash → hilang saat reboot.</li>
<li><b>Database Zabbix sendiri:</b> partisi database penuh = monitoring mati total untuk SEMUA host.</li>
<li><b>Service crash:</b> banyak aplikasi gagal start jika tidak bisa menulis file sementara.</li>
</ul>
<h3>Item Kunci (Zabbix Agent)</h3>
<pre>vfs.fs.size[/,pfree]       → % ruang BEBAS di partisi root (angka 0-100)
vfs.fs.size[/var,free]      → byte bebas di /var (tempat log & database)
vfs.fs.size[/,total]        → total ukuran partisi

Trigger standar template "Linux filesystems":
  "Free disk space < 20%"  → Warning
  "Free disk space < 10%"  → High
  forecast 7 hari → "Disk diprediksi penuh dalam seminggu" → Warning proaktif</pre>
<h3>Untuk Network Device</h3>
<p>MikroTik/FortiGate memakai flash kecil — yang dipantau biasanya via SNMP (hrStorageTable) atau item agent kustom. Yang penting: <b>ukuran log</b> dan <b>jumlah backup config</b> yang menumpuk di flash.</p>
<div class="callout"><div class="t">Aturan Praktis</div><p style="margin:4px 0 0">Jangan tunggu 0%. Alert di <b>20%</b> (waktunya bersih-bersih), eskalasi di <b>10%</b> (tindakan segera). Untuk partisi database Zabbix, perlakukan 20% sebagai <b>High</b> — karena dampaknya ke seluruh monitoring.</p></div>`,
      terms: [
        ['vfs.fs.size', 'Item key Zabbix agent untuk informasi filesystem/partisi.'],
        ['pfree', 'Parameter: persentase ruang bebas (percent free).'],
        ['Flash memory', 'Penyimpanan permanen di network device (kecil, terbatas).'],
      ],
      scenario: 'Server Zabbix berhenti mengumpulkan data pukul 03.00 tanpa alert apa pun — ironisnya karena partisi database penuh 100%, housekeeper tidak bisa jalan, dan server monitoring itu sendiri tidak terpantau disk-nya. Pelajaran mahal: host "Zabbix server" wajib punya template OS lengkap termasuk disk, BUKAN hanya item Zabbix internal.',
      bestPractices: 'Pisahkan partisi database (/var/lib/postgresql) dari partisi OS — database yang membengkak tidak akan menenggelamkan sistem operasi.',
      security: 'Log yang berhenti karena disk penuh = jejak serangan hilang. Penyerang canggih kadang sengaja memenuhi disk untuk menghapus jejak — korelasikan disk penuh tiba-tiba dengan anomali lain.',
      challenge: 'Cek disk server lab-mu sekarang (df -h). Berapa % terpakai? Berapa laju pertumbuhannya per minggu (perkirakan dari tren)? Kapan akan mencapai 80%?',
      interviewQ: 'Q: "Mengapa disk monitoring penting untuk server Zabbix itu sendiri?" — A: Karena database penuh = seluruh monitoring mati tanpa peringatan; si pemantau harus memantau dirinya sendiri, termasuk disk, CPU, dan queue-nya.',
      quiz: [
        {
          q: 'Bahaya utama disk penuh di network device adalah…',
          options: [
            'Device menjadi lebih cepat',
            'Log berhenti, config gagal tersimpan, service bisa crash',
            'Hanya tampilan LED berubah',
            'Tidak ada bahaya',
          ],
          answer: 1,
          explain: 'Disk penuh menghentikan pencatatan, menggagalkan penyimpanan config, dan bisa me-crash service.',
        },
        {
          q: 'Ambang alert yang direkomendasikan untuk disk adalah…',
          options: [
            'Warning di 20% bebas, High di 10% bebas — jangan tunggu 0%',
            'Alert hanya saat 0%',
            'Alert saat 99% terpakai masih aman',
            'Tidak perlu alert',
          ],
          answer: 0,
          explain: 'Bertindak di 20%/10% memberi waktu bersih-bersih sebelum dampak operasional.',
        },
        {
          q: 'Item vfs.fs.size[/,pfree] mengembalikan…',
          options: [
            'Suhu CPU',
            'Persentase ruang bebas di partisi root',
            'Jumlah file di direktori',
            'Kecepatan disk',
          ],
          answer: 1,
          explain: 'pfree = percent free — persentase ruang bebas filesystem.',
        },
      ],
    },
    {
      id: '23.15',
      title: 'Traffic',
      body: `<p><b>Traffic monitoring</b> adalah analisis agregat dari data interface (23.11): total throughput, utilisasi link, pola harian/mingguan, dan <b>95th percentile</b> untuk keperluan billing ISP. Jika interface monitoring menjawab "port ini berapa Mbps", traffic monitoring menjawab "apakah link kami cukup untuk bisnis?".</p>
<h3>95th Percentile: Cara ISP Menagih</h3>
<p>Banyak kontrak ISP memakai <b>95th percentile</b>: dari semua sampel 5-menitan dalam sebulan, buang 5% tertinggi, ambil nilai terbesar sisanya. Artinya: <b>lonjakan sesekali (5%) tidak ditagih</b> — yang ditagih adalah pemakaian "normal tertinggi".</p>
<pre>Contoh 20 sampel (Mbps): 10 12 11 13 12 100 11 12 10 13 12 11 95 12 10 11 12 13 12 11
Rata-rata      : ~19 Mbps (terdistorsi 2 lonjakan)
Maksimum       : 100 Mbps (tidak adil — cuma sesaat)
95th percentile: ~13 Mbps (buang 5% teratas=1 sampel) → ADIL untuk billing</pre>
<h3>Pola Traffic: Membaca "Jantung" Jaringan</h3>
<pre> Mbps
 100 |      ╭─╮           ╭─╮        ← jam kerja: pola harian normal
  80 |     ╱   ╲         ╱   ╲
  40 | ───╱     ╲───────╱     ╲────  ← malam: baseline rendah
     +────────────────────────────▶ waktu (3 hari)
Anomali: ╱╲ tajam jam 3 pagi → investigasi (backup? serangan? exfiltrasi?)</pre>
<ul>
<li><b>Baseline:</b> pola normal jaringanmu (jam kerja tinggi, malam rendah). Hafalkan baseline — anomali hanya terlihat jika kamu tahu normalnya.</li>
<li><b>Tren naik:</b> baseline minggu ini 10% lebih tinggi dari bulan lalu = kapasitas menipis → dasar proposal upgrade.</li>
<li><b>Asimetri:</b> upload ≈ download terus-menerus di link user = tidak wajar (user normalnya download-heavy) → indikasi backup/serangan.</li>
</ul>
<div class="callout blue"><div class="t">Inbound vs Outbound</div><p style="margin:4px 0 0">Dari sisi router: <b>inbound</b> = traffic masuk dari internet (download user), <b>outbound</b> = keluar ke internet (upload user). Untuk keamanan, outbound yang melonjak misterius lebih mencurigakan (data keluar = potensi kebocoran).</p></div>`,
      terms: [
        ['95th percentile', 'Metode billing: buang 5% sampel tertinggi, tagih nilai terbesar sisanya.'],
        ['Baseline', 'Pola traffic normal jaringan — acuan mendeteksi anomali.'],
        ['Throughput agregat', 'Total laju data pada satu titik/link dalam satu waktu.'],
      ],
      scenario: 'ISP menagih overage Rp 15 juta dengan klaim "pemakaian 120 Mbps". Engineer membuka grafik Zabbix: 95th percentile bulan itu 118 Mbps — tagihan valid, pola menunjukkan jam 9–11 pagi selalu puncak. Keputusan: upgrade paket ke 150 Mbps (lebih murah dari overage berulang) + QoS untuk traffic non-kritis di jam puncak.',
      bestPractices: 'Simpan grafik traffic WAN minimal 12 bulan (trends) — data setahun adalah senjata negosiasi kontrak ISP dan dasar perencanaan anggaran tahunan.',
      security: 'Buat alert untuk anomali outbound: "upload ke internet 3x lipat baseline selama 1 jam" — pola klasik exfiltrasi data atau device terinfeksi.',
      challenge: 'Gambar sketsa pola traffic 24 jam untuk kantormu (perkiraan): kapan puncak, kapan lembah? Lalu tulis 2 anomali hipotetis dan apa artinya masing-masing.',
      interviewQ: 'Q: "Apa itu 95th percentile dan mengapa dipakai untuk billing?" — A: Nilai di mana 95% sampel berada di bawahnya (5% tertinggi dibuang); dipakai karena adil — lonjakan sesaat tidak ditagih, yang ditagih adalah pemakaian tertinggi yang "normal".',
      quiz: [
        {
          q: '95th percentile dalam billing ISP berarti…',
          options: [
            'Rata-rata semua sampel',
            'Buang 5% sampel tertinggi, tagih nilai terbesar sisanya — lonjakan sesaat tidak ditagih',
            'Nilai maksimum yang pernah terjadi',
            '95% dari harga normal',
          ],
          answer: 1,
          explain: 'Metode ini adil: spike sesaat (5%) diabaikan, yang ditagih adalah level pemakaian normal tertinggi.',
        },
        {
          q: 'Mengapa penting menghafal baseline traffic jaringan?',
          options: [
            'Untuk pamer ke user',
            'Anomali hanya terlihat jika tahu pola normalnya',
            'Agar grafik terlihat bagus',
            'Syarat sertifikasi',
          ],
          answer: 1,
          explain: 'Deteksi anomali = penyimpangan dari normal; tanpa baseline, semua terlihat "biasa saja".',
        },
        {
          q: 'Upload (outbound) ke internet melonjak 3x baseline jam 3 pagi. Respons tepat?',
          options: [
            'Abaikan, mungkin user lembur',
            'Investigasi sebagai potensi exfiltrasi data / device terinfeksi',
            'Matikan Zabbix',
            'Naikkan bandwidth',
          ],
          answer: 1,
          explain: 'Outbound misterius di jam sepi = pola klasik kebocoran data atau malware — investigasi keamanan.',
        },
      ],
    },
    {
      id: '23.16',
      title: 'Availability',
      body: `<p><b>Availability</b> adalah persentase waktu suatu layanan/device "hidup dan bisa dipakai". Ini adalah <b>bahasa bisnis</b> monitoring — manajemen tidak paham "SNMP timeout", tapi paham "internet down 4 jam bulan ini". Availability dihitung dari data trigger up/down yang dikumpulkan Zabbix.</p>
<h3>Matematika SLA</h3>
<div class="tblwrap"><table>
<tr><th>SLA</th><th>Downtime/bulan</th><th>Downtime/tahun</th><th>Kesan</th></tr>
<tr><td>99%</td><td>7 jam 18 mnt</td><td>3,65 hari</td><td>Buruk untuk layanan kritis</td></tr>
<tr><td><b>99,9%</b> ("three nines")</td><td><b>43,8 menit</b></td><td>8,77 jam</td><td>Standar enterprise umum</td></tr>
<tr><td>99,95%</td><td>21,9 menit</td><td>4,38 jam</td><td>Layanan penting</td></tr>
<tr><td>99,99% ("four nines")</td><td>4,38 menit</td><td>52,6 menit</td><td>Sangat ketat, mahal</td></tr>
</table></div>
<p>Setiap tambahan "9" kira-kira <b>menggandakan biaya</b> (redundansi, failover otomatis, tim 24/7). Janjikan SLA sesuai kemampuan — bukan sesuai keinginan marketing.</p>
<h3>Cara Zabbix Menghitung</h3>
<ul>
<li><b>Availability report</b> (<i>Reports → Availability report</i>): % OK vs PROBLEM per trigger dalam periode — mis. trigger "Host unreachable" OK 99,87% bulan ini.</li>
<li><b>SLA di Zabbix 6.0+:</b> definisikan layanan ("Internet Kantor Pusat") + SLO target (99,9%) → Zabbix menghitung otomatis dan menampilkan status tercapai/tidak.</li>
<li><b>Excluded downtime:</b> maintenance terjadwal bisa dikecualikan agar tidak merusak angka SLA — tapi harus jujur didokumentasikan.</li>
</ul>
<pre>Contoh laporan untuk manajemen (bahasa bisnis):
"Layanan internet kantor pusat: availability 99,87% (target 99,9% — TIDAK TERCAPAI)
 Total downtime: 58 menit (2 insiden: putus fiber ISP 40 mnt, maintenance router 18 mnt)
 Rencana perbaikan: jalur backup ISP kedua (Q1), agar insiden fiber tidak mematikan total."</pre>
<div class="callout"><div class="t">Availability vs Reliability</div><p style="margin:4px 0 0"><b>Availability</b> = "berapa persen waktu ia hidup". <b>Reliability</b> = "seberapa jarang ia rusak" (MTBF — mean time between failures). Link yang down 1x setahun selama 8 jam (99,9%) vs down 100x setahun @5 menit (99,9%) — angkanya sama, rasanya beda jauh bagi user.</p></div>`,
      terms: [
        ['Availability', 'Persentase waktu layanan hidup dan bisa dipakai.'],
        ['SLA', 'Service Level Agreement — kontrak target availability dengan konsekuensi.'],
        ['SLO', 'Service Level Objective — target internal (tanpa konsekuensi kontrak).'],
        ['MTBF', 'Mean Time Between Failures — rata-rata jeda antar kerusakan (reliability).'],
      ],
      scenario: 'Kontrak dengan ISP menyebut SLA 99,9% dengan penalti jika tidak tercapai. ISP mengklaim "tidak pernah down". Engineer menunjukkan availability report Zabbix: 99,42% dengan 4 jam downtime terdokumentasi (grafik ping loss sebagai bukti) — penalti kontrak berhasil diklaim. Tanpa data monitoring, klaim tak berdasar.',
      bestPractices: 'Definisikan layanan dari sudut pandang USER ("internet bisa dipakai"), bukan dari sudut device ("router hidup") — router hidup tapi ISP putus = layanan tetap down bagi user.',
      security: 'Laporan availability adalah dokumen sensitif (menunjukkan kapan jaringan lemah). Batasi aksesnya; jangan publish ke publik.',
      challenge: 'Hitung: layananmu down 2 jam dalam sebulan (30 hari). Berapa availability-nya? Mencapai "three nines" (99,9%) atau tidak? (Petunjuk: (43200-120)/43200.)',
      interviewQ: 'Q: "Apa beda SLA 99,9% dan 99,99% secara praktis?" — A: 99,9% = 43,8 menit downtime/bulan; 99,99% = 4,38 menit/bulan. Selisih 10x lipat waktu, dan biaya untuk mencapainya naik eksponensial karena butuh redundansi dan failover otomatis.',
      quiz: [
        {
          q: 'SLA 99,9% ("three nines") setara dengan downtime…',
          options: [
            '7 jam per bulan',
            '43,8 menit per bulan',
            '4,38 menit per bulan',
            'Nol — tidak boleh down',
          ],
          answer: 1,
          explain: '0,1% × 30 hari × 24 jam × 60 menit = 43,8 menit/bulan.',
        },
        {
          q: 'Layanan sebaiknya didefinisikan dari sudut pandang…',
          options: [
            'Vendor device',
            'User ("internet bisa dipakai") — bukan sekadar "router hidup"',
            'Warna LED',
            'Harga device',
          ],
          answer: 1,
          explain: 'Availability yang bermakna bisnis mengukur pengalaman user, bukan status satu device.',
        },
        {
          q: 'Zabbix menghitung availability dari…',
          options: [
            'Tebakan AI',
            'Data historis trigger OK vs PROBLEM dalam periode tertentu',
            'Laporan user',
            'Harga saham vendor',
          ],
          answer: 1,
          explain: 'Availability report = persentase waktu trigger dalam status OK berdasarkan data yang dikumpulkan.',
        },
      ],
    },
    {
      id: '23.17',
      title: 'Trigger',
      body: `<p><b>Trigger</b> adalah "aturan logika" Zabbix yang mengevaluasi data item dan memutuskan: <i>apakah ini masalah atau bukan?</i>. Tanpa trigger, Zabbix hanya pengumpul data bisu — grafik naik-turun tapi tidak ada yang berteriak saat ada masalah. Trigger mengubah <b>data mentah menjadi event (peristiwa)</b> yang bisa memicu alert.</p>
<h3>Anatomi Trigger: Expression</h3>
<p>Jantung trigger adalah <b>expression</b> — rumus logika atas item. Contoh membaca: <code>avg(/R1/system.cpu.util,5m)&gt;80</code> artinya "rata-rata CPU R1 selama 5 menit terakhir LEBIH dari 80%". Expression memakai fungsi (avg, last, min, max, nodata) dan operator perbandingan (&gt;, &lt;, =, &lt;&gt;).</p>
<pre>Contoh trigger "interface down" (ether1 R1):
  last(/R1/net.if.status[ether1])=2
  ALASAN: ifOperStatus SNMP: 1=up, 2=down. last() mengambil nilai TERBARU —
  status interface adalah data "sekarang", bukan rata-rata.

Contoh trigger "CPU high" (dengan hysteresis, lihat bawah):
  min(/R1/system.cpu.util,5m)&gt;80
  ALASAN min() bukan avg(): jika memakai last(), satu lonjakan 1 detik
  memicu alert palsu. min() 5 menit = CPU BETUL-BETUL tinggi terus.</pre>
<h3>Severity — Tingkat Keparahan</h3>
<div class="tblwrap"><table>
<tr><th>Severity</th><th>Warna</th><th>Kapan Dipakai</th></tr>
<tr><td><b>Not classified</b></td><td>Abu-abu</td><td>Belum diklasifikasi — hindari, selalu klasifikasikan</td></tr>
<tr><td><b>Information</b></td><td>Biru muda</td><td>Info: backup selesai, konfigurasi berubah</td></tr>
<tr><td><b>Warning</b></td><td>Kuning</td><td>Perlu perhatian: disk 80%, CPU 70%</td></tr>
<tr><td><b>Average</b></td><td>Oranye</td><td>Masalah nyata tapi belum kritis: packet loss 5%</td></tr>
<tr><td><b>High</b></td><td>Merah</td><td>Service terganggu: interface down, CPU 95%</td></tr>
<tr><td><b>Disaster</b></td><td>Merah tua</td><td>Bencana: router mati total, seluruh site down</td></tr>
</table></div>
<p><b>ALASAN severity penting:</b> severity menentukan SIAPA yang dibangunkan tengah malam. Disaster = telepon manager; Warning = email yang dibaca pagi hari. Salah severity = alert fatigue (lihat 23.18).</p>
<h3>Threshold + Hysteresis — Mengapa Tidak Cukup Satu Angka?</h3>
<p><b>Threshold</b> = ambang batas (mis. CPU 80%). <b>Hysteresis</b> = "zona aman" berbeda untuk pulih vs bermasalah. Tanpa hysteresis: CPU berayun 79%↔81% → trigger ON-OFF-ON-OFF puluhan kali = <b>flapping</b> (berkedip-kedip), membanjiri NOC dengan notifikasi palsu.</p>
<pre>TANPA hysteresis (flapping!):
  Problem jika CPU &gt; 80, pulih jika CPU &lt; 80
  79→81→79→81→79→81 ... = 6x ON/OFF dalam 10 menit!

DENGAN hysteresis:
  Problem jika min(CPU,5m) &gt; 80, pulih jika max(CPU,5m) &lt; 70
  79→81→79→81 ... = tetap OK (belum pernah &gt;80 selama 5 mnt)
  Naik ke 85 (5 mnt) → PROBLEM; turun ke 75 → MASIH problem
  (belum &lt;70); turun ke 65 → pulih. Stabil!</pre>
<div class="callout"><div class="t">Aturan Praktis Trigger</div><p style="margin:4px 0 0">1) Selalu pakai <b>fungsi waktu</b> (avg/min/max 5m), jangan <code>last()</code> untuk metrik berfluktuasi. 2) Selalu tentukan <b>kondisi pulih</b> (recovery expression) yang lebih longgar dari kondisi masalah. 3) <b>Test trigger</b> dengan memicu kondisi aslinya di lab sebelum production.</p></div>`,
      terms: [
        ['Trigger', 'Aturan logika Zabbix yang mengubah data item menjadi event/problem.'],
        ['Expression', 'Rumus logika trigger: fungsi atas item + operator perbandingan.'],
        ['Severity', 'Tingkat keparahan: Not classified, Information, Warning, Average, High, Disaster.'],
        ['Threshold', 'Ambang batas nilai yang memicu kondisi masalah.'],
        ['Hysteresis', 'Ambang pulih yang berbeda dari ambang masalah agar trigger stabil.'],
        ['Flapping', 'Trigger yang ON/OFF berulang cepat karena ambang terlalu ketat.'],
        ['Recovery expression', 'Syarat agar problem dinyatakan pulih (OK kembali).'],
      ],
      diagram: `<pre>[Device R1] --SNMP--> [Item: system.cpu.util]
                                   │ nilai tiap 60 detik
                                   ▼
                        [Trigger expression:
                         min(/R1/system.cpu.util,5m)&gt;80]
                                   │ TRUE = masalah
                                   ▼
                        [Event → Problem (severity: Warning)]
                                   │
                                   ▼
                        [Action/Alert → notifikasi NOC]
Alur data: device → protocol (SNMP) → Zabbix server (poller)
→ database (history) → trigger dievaluasi → frontend (Problems)</pre>`,
      scenario: 'NOC menerima 400 notifikasi semalam dari satu router: CPU-nya berayun 79–81% dan trigger tanpa hysteresis berkedip ON/OFF. Tim mematikan notifikasi router itu ("berisik") — dan melewatkan saat router tersebut benar-benar down 3 jam kemudian. Pelajaran: flapping yang tidak diperbaiki berujung pada alert yang dimatikan, dan alert yang dimatikan = buta.',
      bestPractices: 'Standarkan severity per jenis masalah di seluruh template (interface down selalu High, bukan kadang Warning kadang Disaster). Dokumentasikan "katalog trigger" perusahaan: nama, expression, severity, dan siapa yang dihubungi.',
      security: 'Buat trigger untuk anomali keamanan: failed login SSH &gt; 5x dalam 10 menit (severity High), perubahan konfigurasi tak terjadwal (Information). Trigger keamanan memakai severity tepat — terlalu rendah = diabaikan, terlalu tinggi = fatigue.',
      challenge: 'Tulis trigger untuk lab-mu: "Memory R1 di atas 85% selama 10 menit" (severity Warning) dengan hysteresis pulih di bawah 75%. Tulis expression lengkapnya, lalu uji dengan membebani memory router lab.',
      interviewQ: 'Q: "Apa itu flapping pada trigger dan bagaimana mengatasinya?" — A: Flapping = trigger ON/OFF berulang karena nilai berayun di sekitar threshold. Diatasi dengan hysteresis (ambang pulih lebih longgar dari ambang masalah) dan fungsi agregasi waktu seperti min()/avg() 5 menit, bukan last().',
      quiz: [
        {
          q: 'Fungsi utama trigger di Zabbix adalah…',
          options: [
            'Mengumpulkan data SNMP dari device',
            'Mengevaluasi data item dengan expression logika dan menghasilkan event/problem saat kondisi terpenuhi',
            'Menyimpan backup konfigurasi',
            'Menggambar topologi jaringan',
          ],
          answer: 1,
          explain: 'Trigger = aturan logika yang mengubah data mentah menjadi masalah yang bisa ditindaklanjuti.',
        },
        {
          q: 'CPU berayun 79%↔81% dengan trigger "CPU > 80" tanpa hysteresis akan…',
          options: [
            'Tetap stabil tanpa masalah',
            'Flapping: ON/OFF berulang dan membanjiri notifikasi palsu',
            'Otomatis memperbaiki CPU',
            'Menghapus data history',
          ],
          answer: 1,
          explain: 'Tanpa zona hysteresis, nilai yang berayun di sekitar threshold membuat trigger berkedip.',
        },
        {
          q: 'Trigger "router mati total" sebaiknya diberi severity…',
          options: [
            'Information',
            'Warning',
            'Disaster — karena seluruh layanan/site terdampak',
            'Not classified',
          ],
          answer: 2,
          explain: 'Disaster = dampak total; severity menentukan urgensi respons dan siapa yang dihubungi.',
        },
      ],
    },
    {
      id: '23.18',
      title: 'Alert',
      body: `<p><b>Alert</b> di Zabbix diwujudkan sebagai <b>action</b> — "jika event X terjadi, lakukan Y". Trigger mendeteksi masalah; action memutuskan <b>siapa diberi tahu, lewat apa, dan kapan</b>. Tanpa action yang dirancang baik, trigger terbaik pun hanya menjadi baris merah di dashboard yang tak terlihat.</p>
<h3>Media Type — Jalur Notifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Media Type</th><th>Cocok Untuk</th><th>Catatan</th></tr>
<tr><td><b>Email</b></td><td>Semua severity, ada jejak tertulis</td><td>Bawaan Zabbix; pastikan SMTP relay dikonfigurasi</td></tr>
<tr><td><b>Telegram</b></td><td>NOC mobile, cepat dibaca</td><td>Butuh bot token; grup NOC khusus alert</td></tr>
<tr><td><b>Webhook</b></td><td>Integrasi: Slack, PagerDuty, tiket otomatis</td><td>Skrip JavaScript di Zabbix; paling fleksibel</td></tr>
<tr><td><b>SMS/Voice call</b></td><td>Disaster only</td><td>Butuh gateway; mahal — jangan untuk Warning</td></tr>
</table></div>
<h3>Eskalasi — Bertingkat Sesuai Waktu</h3>
<p><b>Eskalasi (escalation)</b> = notifikasi berlapis: jika masalah belum diakui (acknowledge) dalam X menit, naik ke level berikutnya. Contoh: menit 0 → Telegram grup NOC; menit 15 belum ack → SMS engineer on-call; menit 30 belum ack → telepon manager. ALASAN: masalah Disaster yang tak direspons 30 menit = insiden bisnis, bukan sekadar tiket.</p>
<h3>Contoh Alur Lengkap</h3>
<pre>1. Trigger: last(/R1/net.if.status[ether1])=2  →  EVENT "interface down"
2. Action "Notify interface down" (kondisi: severity >= High):
   Step 1 (0 mnt) : kirim Telegram ke grup NOC + email noc@kantor.id
   Step 2 (15 mnt, jika belum di-acknowledge): SMS ke engineer on-call
   Step 3 (30 mnt, jika belum ack): telepon manager via webhook PagerDuty
3. Saat trigger pulih (recovery expression terpenuhi):
   → kirim "RESOLVED" ke jalur yang sama (ALASAN: NOC tahu kapan berhenti panik)
4. Semua langkah tercatat di Audit log → siapa diberi tahu kapan (jejak insiden)</pre>
<h3>Alert Fatigue — Musuh Nomor Satu NOC</h3>
<p><b>Alert fatigue</b> = operator kebal terhadap notifikasi karena terlalu banyak/banyak yang palsu — akibatnya alert PENTING ikut diabaikan. Ini bukan masalah disiplin, tapi masalah <b>desain</b>.</p>
<ul>
<li><b>Saring by severity:</b> Telegram NOC hanya Average ke atas; Information/Warning cukup email digest harian.</li>
<li><b>Dependency:</b> jika router R1 down, jangan kirim 20 alert untuk semua device di belakangnya — satu alert "R1 down" cukup (Zabbix: trigger dependencies).</li>
<li><b>Maintenance mode:</b> saat maintenance terjadwal, supress notifikasi — alert yang sudah diduga = noise.</li>
<li><b>Perbaiki sumber noise:</b> flapping trigger (23.17) dan threshold asal-asalan adalah penyebab #1 dan #2.</li>
</ul>
<div class="callout blue"><div class="t">Aturan Emas Alert</div><p style="margin:4px 0 0">Setiap alert yang masuk HP engineer harus <b>actionable</b> (ada tindakan jelas yang harus dilakukan SEKARANG). Jika responsnya "oh, itu biasa" — threshold-nya salah atau alertnya tidak perlu dikirim ke HP. Target sehat: &lt; 5 alert/Shift yang membangunkan orang.</p></div>`,
      terms: [
        ['Action', 'Aturan Zabbix: jika event memenuhi kondisi, lakukan langkah notifikasi.'],
        ['Media type', 'Jalur pengiriman notifikasi: email, Telegram, webhook, SMS.'],
        ['Escalation', 'Notifikasi berlapis yang naik level jika masalah belum di-acknowledge.'],
        ['Acknowledge', 'Tindakan operator menandai "sudah dilihat/ditangani" agar eskalasi berhenti.'],
        ['Recovery message', 'Notifikasi "masalah pulih" yang dikirim saat trigger kembali OK.'],
        ['Alert fatigue', 'Kondisi operator kebal notifikasi akibat terlalu banyak alert/palsu.'],
        ['Trigger dependency', 'Aturan "jangan alert-kan B jika A (penyebabnya) sudah alert".'],
      ],
      diagram: `<pre>[Trigger: PROBLEM High] ──▶ [Action: kondisi severity>=High]
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
        Step 1 (0 mnt)            Step 2 (15 mnt)            Step 3 (30 mnt)
        Telegram grup NOC         SMS on-call                Telepon manager
        + email                   (jika belum ack)            (jika belum ack)
              │                         │                         │
              └─────────▶ [Trigger OK] ─┴──▶ [Recovery message] ◀──┘
                           "RESOLVED ke semua jalur"</pre>`,
      scenario: 'Perusahaan menerima 200+ notifikasi Telegram semalam: 90% adalah Warning "CPU 71%" dari server idle dan flapping interface. Tim NOC meng-mute grup Telegram — dan melewatkan alert Disaster "core switch down" jam 3 pagi. Internet mati 4 jam tanpa respons. Solusi pasca-insiden: hanya Average+ ke Telegram, dependency dikonfigurasi, maintenance mode dipakai — notifikasi turun ke 12/shift, semuanya actionable.',
      bestPractices: 'Uji seluruh rantai alert (trigger → action → media) di lab dengan memicu kondisi nyata — alert yang belum pernah diuji = alert yang belum ada. Dokumentasikan matriks eskalasi: severity × waktu × siapa dihubungi.',
      security: 'Token bot Telegram dan webhook URL adalah kredensial — simpan di media type Zabbix (bukan di grup chat), batasi siapa yang bisa melihat konfigurasi media type, dan rotasi token jika ada anggota tim yang keluar.',
      challenge: 'Rancang matriks eskalasi untuk lab-mu: untuk severity Warning, Average, High, Disaster — tulis jalur notifikasi, jeda eskalasi, dan siapa penerimanya. Lalu implementasikan SATU action Telegram untuk trigger "interface down".',
      interviewQ: 'Q: "Apa itu alert fatigue dan bagaimana kamu mengatasinya?" — A: Kebalnya operator terhadap notifikasi karena volume/noise berlebih. Diatasi dengan: filter severity per jalur, trigger dependency agar satu akar masalah = satu alert, maintenance mode, memperbaiki flapping/threshold, dan prinsip setiap alert ke HP harus actionable.',
      quiz: [
        {
          q: 'Peran action di Zabbix adalah…',
          options: [
            'Mengumpulkan data dari device',
            'Menentukan siapa diberi tahu, lewat media apa, dan eskalasinya saat event terjadi',
            'Menghapus trigger lama',
            'Mempercepat database',
          ],
          answer: 1,
          explain: 'Trigger mendeteksi; action mengeksekusi respons notifikasi berlapis.',
        },
        {
          q: 'Mengapa SMS/voice call hanya untuk severity Disaster?',
          options: [
            'Karena teknologinya kuno',
            'Mahal dan sangat mengganggu — hanya dibenarkan untuk masalah yang butuh respons manusia segera',
            'Karena tidak bisa dikonfigurasi',
            'Karena lambat',
          ],
          answer: 1,
          explain: 'Biaya + interupsi tinggi; memakai untuk Warning = jalan cepat menuju alert fatigue.',
        },
        {
          q: 'Jika router R1 down dan 20 device di belakangnya ikut "unreachable", praktik terbaik adalah…',
          options: [
            'Kirim 21 alert agar lengkap',
            'Trigger dependency: satu alert "R1 down", supress alert turunannya',
            'Matikan monitoring 20 device itu',
            'Hapus trigger-nya',
          ],
          answer: 1,
          explain: 'Satu akar masalah = satu alert; 20 alert turunan hanya noise yang menutupi penyebab sebenarnya.',
        },
      ],
    },
    {
      id: '23.19',
      title: 'Template',
      body: `<p><b>Template</b> adalah "cetakan monitoring": paket berisi item, trigger, graph, dan discovery rule yang bisa <b>ditempelkan (link)</b> ke banyak host sekaligus. Tanpa template, menambah 50 router berarti mengulang konfigurasi 50 kali — dan mengubah satu threshold berarti 50 kali edit. Template menyelesaikan masalah <b>skala dan konsistensi</b>.</p>
<h3>Mengapa Template Wajib di Production</h3>
<div class="tblwrap"><table>
<tr><th>Tanpa Template</th><th>Dengan Template</th></tr>
<tr><td>50 router × konfigurasi manual = 50 varian berbeda</td><td>1 template → link ke 50 router, 100% konsisten</td></tr>
<tr><td>Ubah threshold CPU: edit 50 host satu per satu</td><td>Ubah 1x di template → otomatis ke semua host</td></tr>
<tr><td>Router baru: setting dari nol (lupa-lupa)</td><td>Router baru: link template → langsung termonitor</td></tr>
<tr><td>Onboarding engineer baru: "setting-nya gimana?"</td><td>Template = dokumentasi hidup standar perusahaan</td></tr>
</table></div>
<h3>Linking Template ke Host</h3>
<pre>Configuration → Hosts → R1 → Templates → Link new templates:
  [x] "MikroTik SNMP"        ← template custom lab
  [x] "ICMP Ping"            ← template bawaan Zabbix
  → Update. SELESAI: R1 kini punya semua item & trigger dari template.

ALASAN linking bukan copy: host tidak "memiliki" salinan — ia
"meminjam" dari template. Ubah template → semua host ikut berubah.
Unlink = lepas; Unlink and clear = lepas + hapus data historisnya
(HATI-HATI: clear menghapus history! Pilih unlink biasa bila ragu).</pre>
<h3>Macro — Variabel Template</h3>
<p><b>Macro</b> adalah variabel seperti <code>{$IFACE_WAN}</code> atau <code>{$SNMP_COMMUNITY}</code> yang nilainya bisa berbeda per host. ALASAN: template generik ("Template Router"), tapi interface WAN R1 = ether1 sedangkan R2 = sfp1 — macro memungkinkan satu template melayani banyak varian tanpa duplikasi.</p>
<pre>Di template:  item net.if.in[{$IFACE_WAN}]
Di host R1:   {$IFACE_WAN} = ether1
Di host R2:   {$IFACE_WAN} = sfp1
→ Satu template, dua konfigurasi nyata. Macro bisa diwariskan
   template → host, dan dioverride di level host.</pre>
<h3>Contoh: Template MikroTik SNMP (Lab)</h3>
<pre>Buat: Configuration → Templates → Create template
  Template name: "MikroTik SNMP Lab"
  Groups: Templates/Network devices

  Items (contoh):
  - system.cpu.util      : SNMP OID .1.3.6.1.2.1.25.3.3.1.2.1 (60s)
  - net.if.in[ether1]    : IF-MIB ifInOctets ether1 (60s)
  - icmpping             : dari template "ICMP Ping" (jangan duplikasi!)

  Triggers:
  - "CPU high": min(/MikroTik SNMP Lab/system.cpu.util,5m)&gt;80 (Warning)
  - "ether1 down": last(/MikroTik SNMP Lab/net.if.status[ether1])=2 (High)

  ALASAN nama diawali nama template di expression: expression trigger
  di template memakai nama TEMPLATE, bukan nama host — Zabbix
  menerjemahkannya otomatis saat di-link ke host nyata.

  Lalu: link template ini ke R1, R2, SW1 → ketiga host termonitor
  identik dalam 1 menit. Itulah kekuatan template.</pre>
<div class="callout"><div class="t">Jangan Edit Template Bawaan Langsung</div><p style="margin:4px 0 0">Template bawaan Zabbix bisa <b>tertiban (overwrite)</b> saat upgrade. Praktik benar: <b>clone</b> template bawaan → edit hasil clone-nya. Template custom-mu aman dari upgrade.</p></div>`,
      terms: [
        ['Template', 'Cetakan monitoring (item+trigger+graph) yang di-link ke banyak host.'],
        ['Linking', 'Menempelkan template ke host; host meminjam konfigurasi, bukan menyalin.'],
        ['Unlink and clear', 'Melepas template SEKALIGUS menghapus data historisnya — berbahaya.'],
        ['Macro', 'Variabel template (mis. {$IFACE_WAN}) yang nilainya bisa dioverride per host.'],
        ['Discovery rule', 'Aturan auto-discovery di template (mis. deteksi semua interface otomatis).'],
      ],
      diagram: `<pre>        ┌─────────────────────────┐
        │  Template "MikroTik      │
        │  SNMP Lab"               │
        │  - 12 items              │
        │  - 5 triggers            │
        │  - macro {$IFACE_WAN}     │
        └────────┬────────┬────────┘
          link   │  link  │  link
                 ▼        ▼        ▼
               [R1]     [R2]     [SW1]
        {$IFACE_WAN}={$IFACE_WAN}={$IFACE_WAN}
         =ether1   =sfp1    =ether1
Ubah trigger 1x di template → R1, R2, SW1 otomatis ikut.</pre>`,
      scenario: 'ISP kecil punya 80 router pelanggan tanpa template — tiap router disetting manual oleh teknisi berbeda. Audit menemukan 12 varian threshold CPU dan 30 router tanpa trigger "interface down" sama sekali. Migrasi ke 3 template standar (Core, Distribution, CPE) memakan 2 minggu, tapi setelahnya: router baru online-termontor dalam 5 menit dan audit konsistensi lolos 100%.',
      bestPractices: 'Struktur template berlapis: "Base Network" (ping, uptime — untuk SEMUA device) → "MikroTik SNMP" (spesifik vendor) → "Router Core" (spesifik peran). Perubahan umum cukup di 1 tempat. Beri versi pada nama template custom (v1.2) dan catat changelog-nya.',
      security: 'Macro bisa menyimpan community string SNMP — jangan taruh kredensial production di macro yang terlihat semua operator; gunakan SNMPv3 dengan kredensial per host dan batasi hak baca macro sensitif via user role Zabbix.',
      challenge: 'Buat template "Lab Router" versimu: minimal 3 item (ping, CPU, traffic ether1), 2 trigger (dengan hysteresis!), 1 macro {$IFACE_WAN}. Link ke 2 host lab dan buktikan: ubah threshold di template → kedua host ikut berubah.',
      interviewQ: 'Q: "Mengapa tidak mengonfigurasi item/trigger langsung di host saja?" — A: Tidak scalable — 100 host berarti 100x konfigurasi manual dan 100x edit saat ada perubahan. Template memberi konsistensi, perubahan sekali-untuk-semua, dan onboarding host baru dalam hitungan menit.',
      quiz: [
        {
          q: 'Keuntungan utama template dibanding konfigurasi per host adalah…',
          options: [
            'Template lebih cepat di-query',
            'Konsistensi dan skala: 1x konfigurasi untuk ratusan host, 1x ubah untuk semua',
            'Template tidak butuh database',
            'Template menggantikan SNMP',
          ],
          answer: 1,
          explain: 'Linking = konfigurasi terpusat; perubahan template otomatis berlaku ke semua host yang di-link.',
        },
        {
          q: 'Fungsi macro seperti {$IFACE_WAN} di template adalah…',
          options: [
            'Password template',
            'Variabel yang nilainya bisa berbeda per host, agar satu template melayani banyak varian device',
            'Nama database',
            'Jenis grafik',
          ],
          answer: 1,
          explain: 'Macro = parameterisasi template; dioverride di level host sesuai kondisi nyata tiap device.',
        },
        {
          q: 'Praktik yang benar terhadap template bawaan Zabbix adalah…',
          options: [
            'Edit langsung karena lebih cepat',
            'Clone dulu lalu edit hasil clone — agar tidak tertiban saat upgrade Zabbix',
            'Hapus semuanya',
            'Jangan pernah dipakai',
          ],
          answer: 1,
          explain: 'Upgrade Zabbix dapat menimpa template bawaan; hasil clone aman dan tetap bisa diupdate manual.',
        },
      ],
    },
    {
      id: '23.20',
      title: 'Dashboard',
      body: `<p><b>Dashboard</b> Zabbix adalah kanvas berisi <b>widget</b> — potongan tampilan (grafik, gauge, daftar masalah, peta) yang disusun sesuai kebutuhan. Ada dashboard untuk <b>operator NOC</b> (status saat ini), untuk <b>engineer</b> (grafik troubleshooting), dan untuk <b>manajemen</b> (availability dan SLA).</p>
<h3>Widget Penting</h3>
<div class="tblwrap"><table>
<tr><th>Widget</th><th>Fungsi</th><th>Untuk Siapa</th></tr>
<tr><td><b>Problems</b></td><td>Daftar masalah aktif, bisa filter severity</td><td>NOC — layar utama</td></tr>
<tr><td><b>Graph</b></td><td>Grafik time-series satu/beberapa metrik</td><td>Engineer — analisis</td></tr>
<tr><td><b>Gauge</b></td><td>Jarum seperti speedometer (CPU sekarang)</td><td>NOC — sekilas</td></tr>
<tr><td><b>Top hosts</b></td><td>"5 host dengan CPU tertinggi"</td><td>NOC — prioritas</td></tr>
<tr><td><b>Geomap</b></td><td>Peta lokasi host dengan status warna</td><td>Manajemen — cabang mana down</td></tr>
<tr><td><b>Host availability</b></td><td>Ringkasan hijau/merah per grup</td><td>NOC wall display</td></tr>
<tr><td><b>SLA report</b></td><td>Progress target availability</td><td>Manajemen</td></tr>
</table></div>
<h3>Prinsip Desain Dashboard NOC</h3>
<ul>
<li><b>5 detik rule:</b> dalam 5 detik memandang, operator tahu "ada masalah atau tidak". Masalah = merah mencolok; normal = tenang.</li>
<li><b>Satu dashboard satu tujuan:</b> "Network Overview" berbeda dengan "Troubleshoot Router X". Jangan campur.</li>
<li><b>Kiosk mode:</b> dashboard untuk layar dinding TV dijalankan fullscreen auto-refresh tanpa perlu login terus (slideshow antar dashboard).</li>
<li><b>Hierarki:</b> ringkasan di atas (apakah ada masalah?), detail di bawah (grafik apa yang bermasalah?).</li>
</ul>
<pre>Contoh layout "NOC Network Overview" (TV dinding):
+--------------------------------+------------------+
| PROBLEMS (severity >= High)    | HOST AVAILABILITY|
| daftar merah jika ada          | hijau/merah grup |
+--------------------------------+------------------+
| WAN TRAFFIC (graph 24 jam)     | TOP 5 CPU        |
+--------------------------------+------------------+
| GEOMAP cabang (untuk multi-site)                |
+-------------------------------------------------+</pre>`,
      terms: [
        ['Widget', 'Komponen tampilan dalam dashboard: grafik, gauge, daftar masalah, peta.'],
        ['Kiosk mode', 'Tampilan dashboard fullscreen auto-refresh untuk layar dinding.'],
        ['Geomap', 'Widget peta geografis dengan status host berwarna.'],
      ],
      scenario: 'Ruang NOC memasang TV 55 inci menampilkan dashboard "Network Overview" mode kiosk. Operator shift malam melihat kotak merah "R2-Surabaya unreachable" dalam 5 detik tanpa membuka laptop — langsung telepon cabang. Inilah bedanya dashboard yang didesain untuk dilihat vs sekadar "ada grafik".',
      bestPractices: 'Buat 3 dashboard standar: (1) NOC Overview — status, (2) Capacity — tren traffic/CPU untuk planning, (3) Executive — availability/SLA untuk manajemen. Jangan satu dashboard untuk semua.',
      security: 'Dashboard kiosk untuk TV dinding sebaiknya memakai akun guest read-only khusus — bukan akun admin yang tertinggal login di browser TV.',
      challenge: 'Sketsa di kertas layout dashboard "NOC Overview" untuk lab-mu: widget apa saja, di posisi mana, dan mengapa? Terapkan 5-detik rule.',
      interviewQ: 'Q: "Apa prinsip utama mendesain dashboard NOC?" — A: 5-detik rule (operator langsung tahu ada masalah atau tidak), satu dashboard satu tujuan, hierarki ringkasan-ke-detail, dan kiosk mode untuk wall display.',
      quiz: [
        {
          q: 'Apa itu "5 detik rule" dalam desain dashboard NOC?',
          options: [
            'Dashboard harus loading dalam 5 detik',
            'Dalam 5 detik memandang, operator tahu ada masalah atau tidak',
            'Alert harus dibaca dalam 5 detik',
            'Grafik hanya menampilkan 5 detik data',
          ],
          answer: 1,
          explain: 'Dashboard NOC harus komunikatif sekilas: merah = masalah, tenang = normal.',
        },
        {
          q: 'Widget "Top hosts" berguna untuk…',
          options: [
            'Melihat host dengan metrik tertinggi — menentukan prioritas perhatian',
            'Menghapus host',
            'Mengganti password',
            'Menghitung jumlah kabel',
          ],
          answer: 0,
          explain: 'Top hosts mengurutkan host bermetrik tertinggi (CPU/traffic) — fokus ke yang paling butuh perhatian.',
        },
        {
          q: 'Untuk TV dinding NOC, praktik yang benar adalah…',
          options: [
            'Login dengan akun admin dan biarkan',
            'Akun guest read-only khusus + kiosk mode fullscreen auto-refresh',
            'Matikan TV-nya',
            'Tampilkan spreadsheet',
          ],
          answer: 1,
          explain: 'Akun least-privilege (guest) + kiosk mode = aman dan selalu tampil tanpa interaksi.',
        },
      ],
    },
    {
      id: '23.21',
      title: 'Zabbix Troubleshooting',
      body: `<p>Zabbix sendiri bisa bermasalah — dan saat "si pemantau" sakit, kamu buta. Sub-bab ini adalah <b>metodologi troubleshooting Zabbix</b>: gejala umum, cara mendiagnosis, dan solusinya. Prinsipnya sama dengan troubleshooting jaringan: <b>tentukan domain masalahnya dulu</b> (server? database? device? jaringan di antaranya?).</p>
<h3>Masalah Umum & Solusi</h3>
<div class="tblwrap"><table>
<tr><th>Gejala</th><th>Kemungkinan Penyebab</th><th>Cara Diagnosis & Solusi</th></tr>
<tr><td>Item status <b>"Not supported"</b></td><td>OID salah / SNMP ditolak / agent key tidak dikenal</td><td>Klik item → error message-nya jelas; test dengan snmpget/snmpwalk manual dari server Zabbix</td></tr>
<tr><td><b>Queue menumpuk</b>, data telat</td><td>Poller kurang / interval terlalu agresif / device lambat merespons</td><td>Administration → Queue; tambah StartPollers; naikkan interval; cek SNMP timeout</td></tr>
<tr><td><b>"No data"</b> tiba-tiba untuk banyak host</td><td>Database penuh / housekeeper macet / server overload</td><td>Cek disk DB, status housekeeper, log zabbix_server</td></tr>
<tr><td>Trigger <b>false positive</b></td><td>Ambang terlalu ketat / tanpa rata-rata waktu</td><td>Tambah fungsi avg/min; atur hysteresis</td></tr>
<tr><td>SNMP <b>timeout</b> sporadis</td><td>CPU device tinggi / firewall rate-limit UDP / link lossy</td><td>Naikkan timeout SNMP (3→5 dtk); cek CPU device; cek packet loss</td></tr>
<tr><td>Frontend <b>lambat</b></td><td>Database besar tanpa TimescaleDB / PHP resource kurang</td><td>Migrasi TimescaleDB; tune database; cek slow query</td></tr>
<tr><td>Alert <b>tidak terkirim</b></td><td>Action salah kondisi / media type salah kredensial</td><td>Alerts → test media type; cek action log (Reports → Action log)</td></tr>
</table></div>
<h3>Senjata Diagnosis</h3>
<pre># 1. Naikkan level log proses tertentu TANPA restart (ALASAN: tanpa downtime):
zabbix_server -R log_level_increase=poller
# Expected output: (tidak ada output); cek /var/log/zabbix/zabbix_server.log jadi lebih detail

# 2. Runtime control: lihat statistik internal
zabbix_server -R diaginfo
# Expected output: ringkasan cache, queue, proses — ditempel ke tiket troubleshooting

# 3. Test konektivitas dari SISI SERVER (pastikan masalah bukan di jaringan):
snmpget -v2c -c public-lab 192.168.99.1 1.3.6.1.2.1.1.1.0
# Jika ini gagal juga → masalah di device/jaringan, BUKAN di Zabbix</pre>
<h3>Metodologi: "Bagi Dua" (Divide and Conquer)</h3>
<ol>
<li><b>Apakah SEMUA host bermasalah?</b> Ya → masalah di server/database (sisi Zabbix). Tidak → lanjut.</li>
<li><b>Apakah SEMUA item satu host bermasalah?</b> Ya → masalah di host/jaringan ke host itu. Tidak → masalah di item spesifik (OID salah?).</li>
<li><b>Test manual dari server:</b> snmpget/ping manual. Gagal juga = bukan salah Zabbix.</li>
<li><b>Cek log:</b> zabbix_server.log memberi pesan error yang spesifik — baca sebelum menebak.</li>
</ol>
<div class="callout"><div class="t">Deliberate Failure (Latihan)</div><p style="margin:4px 0 0">Matikan SNMP di MikroTik lab (<code>/snmp set enabled=no</code>), tunggu 5 menit, amati: item SNMP jadi "Not supported"/"No data", trigger berbunyi. Lalu nyalakan lagi dan verifikasi recovery. Inilah simulasi insiden yang aman — Part 24.11 melatih ini penuh.</p></div>`,
      terms: [
        ['Not supported', 'Status item yang gagal — Zabbix menampilkan pesan error penyebabnya.'],
        ['Divide and conquer', 'Metodologi: bagi domain masalah jadi dua sampai ketemu sumbernya.'],
        ['diaginfo', 'Perintah runtime Zabbix untuk melihat statistik internal server.'],
        ['Action log', 'Catatan semua alert yang coba dikirim Zabbix (Reports → Action log).'],
      ],
      scenario: 'Semua item SNMP merah "timeout" untuk 20 host, tapi ping OK. Divide and conquer: semua host = satu pola → bukan device satu per satu. Ternyata firewall baru di depan Zabbix me-rate-limit UDP 161. Solusi: whitelist IP Zabbix di firewall — semua item hijau kembali dalam 5 menit.',
      bestPractices: 'Dokumentasikan setiap insiden Zabbix (gejala → diagnosis → solusi) di runbook tim — insiden monitoring yang sama tidak boleh didiagnosis dari nol dua kali.',
      security: 'Log zabbix_server bisa berisi community string / kredensial — batasi akses baca log hanya untuk admin monitoring.',
      challenge: 'Buat "runbook 1 halaman" untuk 3 skenario: (1) satu item Not supported, (2) queue menumpuk, (3) alert tidak terkirim. Tiap skenario: gejala → 3 langkah diagnosis → solusi.',
      interviewQ: 'Q: "Semua item SNMP timeout tapi ping OK — langkah diagnosis-mu?" — A: Semua host = pola sistemik → cek dari sisi server: test snmpget manual, cek firewall/rate-limit UDP 161 antara Zabbix dan device, cek CPU device dan SNMP timeout setting; ping OK membuktikan Layer 3 hidup, jadi fokus ke UDP/SNMP.',
      quiz: [
        {
          q: 'Item berstatus "Not supported". Langkah pertama yang benar?',
          options: [
            'Restart semua router',
            'Klik item dan baca pesan error-nya, lalu test manual (snmpget/snmpwalk) dari server Zabbix',
            'Hapus Zabbix dan install ulang',
            'Abaikan saja',
          ],
          answer: 1,
          explain: 'Pesan error item biasanya spesifik; test manual memisahkan masalah Zabbix vs device/jaringan.',
        },
        {
          q: 'Semua host tiba-tiba "No data". Domain masalah yang paling dicurigai?',
          options: [
            'Semua router rusak bersamaan',
            'Sisi Zabbix: database penuh, housekeeper macet, atau server overload',
            'Kabel LAN putus satu',
            'User menghapus dashboard',
          ],
          answer: 1,
          explain: 'Pola "semua host" = masalah terpusat di server/database, bukan di device individual.',
        },
        {
          q: 'Perintah zabbix_server -R log_level_increase=poller berguna untuk…',
          options: [
            'Me-restart server',
            'Menaikkan detail log proses poller TANPA restart (tanpa downtime)',
            'Menghapus log lama',
            'Menambah poller baru',
          ],
          answer: 1,
          explain: 'Runtime control mengubah level log on-the-fly — diagnosis tanpa mengganggu monitoring berjalan.',
        },
      ],
    },
  ],
};
