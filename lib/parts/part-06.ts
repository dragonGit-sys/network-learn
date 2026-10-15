// Part 06 — Network Cabling.
// Fase 1: Fundamental. Bahasa Indonesia, istilah industri tetap Inggris.
// Part materi murni: tanpa hands-on sub-bab, tanpa project.
import type { Part } from './types';

export const part06: Part = {
  id: '06',
  number: 'PART 06',
  title: 'Network Cabling',
  phaseId: 'fase-1',
  description: 'Kabel tembaga: jenis, kategori, konektor, standar wiring, dan praktik instalasi.',
  repoFolder: 'part-06-network-cabling',
  objectives: [
    'Membedakan jenis kabel twisted pair (UTP, STP, FTP, SFTP) dan kapan masing-masing dipakai.',
    'Membedakan kategori kabel (Cat5e, Cat6, Cat6A) berdasarkan kecepatan dan frekuensi.',
    'Membaca standar wiring T568A/T568B serta membedakan straight-through vs crossover.',
    'Menjelaskan komponen instalasi: RJ45, patch cord, keystone, dan patch panel.',
  ],
  prerequisites: 'Part 05 — IPv6. Part 01 — konsep Layer 1 (physical) dan Ethernet dasar (Part 03).',
  subbabs: [
    {
      id: '6.1',
      title: 'UTP',
      body: `<p><b>UTP</b> (<i>Unshielded Twisted Pair</i>) adalah <b>kabel jaringan paling umum di dunia</b>: 4 pasang kabel tembaga yang <b>dipilin</b> (<i>twisted</i>), <b>tanpa pelindung</b> (<i>unshielded</i>) logam. Ia bekerja di <b>Layer 1</b> dan menjadi media standar LAN kantor.</p>
<h3>Mengapa Dipilin? (Fisika Cerdas)</h3>
<p>Dua kabel yang dipilin membawa sinyal <b>berlawanan arah</b> (<i>differential signaling</i>): gangguan elektromagnetik dari luar mengenai keduanya <b>sama besar</b>, sehingga saat penerima mengurangkan keduanya, <b>gangguan saling meniadakan</b> (<i>cancellation</i>). Makin rapat pilinan (<i>twists per inch</i>), makin baik penolakannya — inilah alasan kabel kategori tinggi dipilin lebih rapat.</p>
<h3>Struktur</h3>
<pre>UTP Cable:
  ┌─ Jaket luar (PVC / LSZH)
  │   ┌─ Pasang 1: putih-biru / biru       } dipilin
  │   ├─ Pasang 2: putih-oranye / oranye    } dipilin
  │   ├─ Pasang 3: putih-hijau / hijau      } dipilin
  │   └─ Pasang 4: putih-coklat / coklat    } dipilin
  │       (tanpa foil/shield — "unshielded")
  └─ 4 pasang = 8 kabel</pre>
<h3>Kapan UTP Cukup?</h3>
<p><b>Hampir selalu</b> di perkantoran normal: murah, fleksibel, mudah dipasang. UTP gagal hanya di lingkungan dengan <b>gangguan elektromagnetik ekstrem</b> (pabrik, dekat kabel listrik tegangan tinggi, rumah sakit dengan alat berat) — di sanalah kabel berpelindung (6.2–6.4) dibutuhkan.</p>
<div class="callout blue"><div class="t">Aturan Jarak Emas</div><p style="margin:4px 0 0">Panjang maksimum satu <b>channel</b> UTP: <b>100 meter</b> (90 m kabel permanen + 10 m patch cord). Lebih dari itu sinyal melemah (attenuation) dan Ethernet tidak menjamin kecepatan. Di atas 100 m: tambah switch repeater — atau pindah ke fiber (Part 07).</p></div>`,
      terms: [
        ['UTP', 'Unshielded Twisted Pair — kabel 4 pasang pilin tanpa pelindung; standar LAN.'],
        ['Twisted pair', 'Dua kabel dipilin agar gangguan elektromagnetik saling meniadakan.'],
        ['Attenuation', 'Pelemahan sinyal sepanjang kabel — alasan batas 100 meter.'],
        ['Channel', 'Total jalur: kabel permanen (90 m) + patch cord (10 m) = maks 100 m.'],
      ],
      diagram: `<pre>         MENGAPA DIPILIN? (cancellation)

   Gangguan luar mengenai kedua kabel SAMA:
   Kabel A: sinyal(+) + noise(+)     ─┐
   Kabel B: sinyal(−) + noise(+)      ─┤ penerima: (A−B)
                                      ─┘ = sinyal − (−sinyal) + (noise−noise)
                                         = 2×sinyal + 0  ✓ noise HILANG!</pre>`,
      scenario: 'Kantor memasang kabel UTP sejajar kabel listrik 3-phase dalam satu tray tanpa sekat — hasilnya: error/collision misterius di siang hari (saat mesin pabrik sebelah menyala). Solusi: pisahkan minimal 30 cm dari kabel listrik atau ganti ke STP. Pelajaran: instalasi fisik menentukan kualitas Layer 1.',
      bestPractices: 'Jangan tarik UTP sejajar kabel listrik; jaga radius tekuk (min 4x diameter kabel); jangan menarik terlalu kencang — pilinan yang rusak = proteksi hilang.',
      security: 'UTP memancarkan sinyal elektromagnetik yang (dengan alat khusus) bisa disadap dari jarak dekat — untuk data sangat sensitif, gunakan STP/fiber atau enkripsi.',
      challenge: 'Ukur kabel terpanjang di rumah/kantormu (perkiraan). Masih di bawah 100 m? Di mana titik yang paling berisiko melebihi batas?',
      interviewQ: 'Q: "Mengapa kabel UTP dipilin?" — A: Untuk electromagnetic interference cancellation: dua kabel membawa sinyal berlawanan, gangguan luar mengenai keduanya sama besar sehingga saling meniadakan saat penerima mengurangkan keduanya. Makin rapat pilinan, makin baik penolakannya.',
      quiz: [
        { q: 'UTP bekerja di layer OSI…', options: ['Layer 2', 'Layer 1 — Physical', 'Layer 3', 'Layer 7'], answer: 1, explain: 'Kabel = media fisik: sinyal listrik di Layer 1.' },
        { q: 'Fungsi pilinan (twist) pada kabel adalah…', options: ['Agar terlihat rapi', 'Menjadikan gangguan elektromagnetik saling meniadakan (cancellation)', 'Mempercepat data', 'Menambah kekuatan tarik'], answer: 1, explain: 'Differential signaling + twist = noise yang sama di kedua kabel saling menghapus.' },
        { q: 'Panjang maksimum satu channel UTP adalah…', options: ['50 meter', '100 meter (90 m permanen + 10 m patch)', '500 meter', 'Tidak terbatas'], answer: 1, explain: 'Batas Ethernet: attenuation membuat sinyal tidak terjamin di atas 100 m.' },
      ],
    },
    {
      id: '6.2',
      title: 'STP Cable',
      body: `<p><b>STP</b> (<i>Shielded Twisted Pair</i>) adalah kabel twisted pair yang <b>setiap pasangnya dibungkus pelindung logam</b> (<i>shield</i> — anyaman/foil) plus kadang shield keseluruhan. Ia adalah "UTP berbaju zirah".</p>
<h3>Struktur vs UTP</h3>
<pre>STP Cable:
  ┌─ Jaket luar
  │   ┌─ Shield keseluruhan (braid/foil)
  │   │   ┌─ Pasang 1 + shield sendiri ─┐
  │   │   ├─ Pasang 2 + shield sendiri ─┤ tiap pasang
  │   │   ├─ Pasang 3 + shield sendiri ─┤ TERLINDUNGI
  │   │   └─ Pasang 4 + shield sendiri ─┘
  │   └─ Kabel drain (grounding!) ──────── WAJIB di-ground</pre>
<h3>Kapan Dibutuhkan?</h3>
<div class="tblwrap"><table>
<tr><th>Lingkungan</th><th>Pilihan</th><th>Alasan</th></tr>
<tr><td>Kantor normal</td><td>UTP</td><td>Murah, cukup, mudah</td></tr>
<tr><td>Pabrik / dekat mesin berat</td><td>STP</td><td>EMI ekstrem dari motor/transformator</td></tr>
<tr><td>Rumah sakit (MRI, dsb)</td><td>STP</td><td>Peralatan medis sensitif + emisi</td></tr>
<tr><td>Outdoor / dekat kabel HV</td><td>STP</td><td>Gangguan + proteksi tambahan</td></tr>
</table></div>
<h3>Jebakan: Grounding!</h3>
<p>Shield yang <b>tidak di-ground dengan benar</b> berubah menjadi <b>antena</b> — menangkap gangguan BUKAN membuangnya, hasilnya lebih buruk dari UTP! Aturan: <b>ground di SATU ujung saja</b> (biasanya sisi patch panel) untuk menghindari <i>ground loop</i>. <b>Alasan memilih UTP secara default:</b> STP mahal, kaku, sulit dipasang, dan salah grounding = bencana. Jangan pakai STP "biar aman" tanpa kebutuhan EMI nyata.</p>`,
      terms: [
        ['STP', 'Shielded Twisted Pair — tiap pasang + keseluruhan berpelindung logam; butuh grounding.'],
        ['Shield', 'Lapisan logam (braid/foil) penangkal interferensi elektromagnetik.'],
        ['Ground loop', 'Arus liar akibat grounding di dua titik berbeda potensial — merusak sinyal.'],
        ['EMI', 'Electromagnetic Interference — gangguan dari medan elektromagnetik luar.'],
      ],
      scenario: 'Pabrik mengganti semua UTP ke STP "agar lebih bagus" — tapi teknisi tidak meng-ground shield. Hasilnya: error justru naik (shield jadi antena). Setelah di-ground satu ujung dengan benar, error hilang total. Pelajaran mahal: STP tanpa grounding = lebih buruk dari UTP.',
      bestPractices: 'Default = UTP. Naik ke STP hanya jika survei EMI membuktikan perlu — dan pastikan kontraktor paham grounding satu ujung.',
      security: 'Shield juga mengurangi emisi sinyal keluar (TEMPEST) — nilai tambah untuk ruangan sensitif (keuangan, militer).',
      challenge: 'Sebutkan 3 lokasi di gedung kantormu yang (tidak) butuh STP, beserta alasannya masing-masing.',
      interviewQ: 'Q: "Kapan memakai STP dan apa syaratnya?" — A: Di lingkungan EMI ekstrem (pabrik, RS, dekat kabel HV). Syarat mutlak: shield di-ground dengan benar di SATU ujung — tanpa grounding, shield menjadi antena dan lebih buruk dari UTP.',
      quiz: [
        { q: 'Perbedaan utama STP dan UTP adalah…', options: ['Jumlah pasang kabel', 'STP punya pelindung logam (shield) per pasang + keseluruhan', 'Warna jaket', 'Kecepatan pasti'], answer: 1, explain: 'Shield = pembeda; UTP mengandalkan pilinan saja.' },
        { q: 'Shield STP yang tidak di-ground dengan benar akan…', options: ['Baik-baik saja', 'Berfungsi sebagai antena — menangkap gangguan, lebih buruk dari UTP', 'Mempercepat data', 'Menghemat listrik'], answer: 1, explain: 'Shield mengambang = antena; wajib ground satu ujung.' },
        { q: 'Grounding STP yang benar adalah…', options: ['Di kedua ujung', 'Di SATU ujung saja (hindari ground loop)', 'Tidak perlu', 'Ke kabel listrik'], answer: 1, explain: 'Satu ujung: membuang noise tanpa menciptakan loop arus.' },
      ],
    },
    {
      id: '6.3',
      title: 'FTP',
      body: `<p><b>FTP</b> (<i>Foiled Twisted Pair</i>) — awas, bukan <i>File Transfer Protocol</i>! Dalam konteks kabel, FTP adalah twisted pair yang <b>keseluruhan 4 pasangnya dibungkus satu foil</b> (tanpa shield per pasang seperti STP).</p>
<h3>Posisi di Keluarga Kabel</h3>
<pre>Proteksi naik →
UTP  →  FTP  →  SFTP  →  STP
(tanpa   (foil    (foil+     (shield per
 shield)  global)  braid)     pasang)</pre>
<p>FTP adalah <b>jalan tengah</b>: lebih tahan EMI dari UTP, lebih murah & fleksibel dari STP/SFTP. Foil global + kabel drain tetap butuh <b>grounding</b> (satu ujung) — aturan yang sama dengan STP.</p>
<h3>Kapan Memilih FTP?</h3>
<ul>
<li>Lingkungan dengan EMI <b>sedang</b> (dekat kabel listrik biasa, bukan mesin berat).</li>
<li>Budget terbatas tapi ingin proteksi lebih dari UTP.</li>
<li>Instalasi 10GBASE-T di Cat6A: banyak kabel Cat6A memakai konstruksi FTP/SFTP untuk menahan <i>alien crosstalk</i> (gangguan dari kabel tetangga di tray yang padat).</li>
</ul>
<div class="callout"><div class="t">FTP vs STP: Jangan Tertukar</div><p style="margin:4px 0 0"><b>FTP</b> = <b>F</b>oiled (satu foil untuk semua pasang). <b>STP</b> = <b>S</b>hielded (shield per pasang + global). Di dokumen penawaran, selalu verifikasi konstruksi yang dimaksud — singkatan mirip, harga dan performa beda.</p></div>`,
      terms: [
        ['FTP (kabel)', 'Foiled Twisted Pair — satu foil pembungkus 4 pasang; jalan tengah UTP–STP.'],
        ['Alien crosstalk', 'Gangguan dari kabel tetangga di tray padat — masalah di instalasi 10G.'],
      ],
      scenario: 'Gedung kantor dengan tray kabel padat (ratusan kabel) upgrade ke 10 Gbps. UTP Cat6A gagal mencapai 10G stabil karena alien crosstalk antar-kabel; ganti ke FTP Cat6A — masalah hilang. Di tray padat berkecepatan tinggi, foil global membuat perbedaan nyata.',
      bestPractices: 'Untuk instalasi 10GBASE-T di tray padat, pertimbangkan FTP/SFTP Cat6A sejak awal — retrofit kabel terpasang = biaya 3x lipat.',
      security: 'Sama seperti STP: foil mengurangi emisi sinyal — nilai tambah kecil untuk keamanan fisik.',
      challenge: 'Jelaskan kepada teman: urutkan UTP, FTP, SFTP, STP dari termurah ke termahal, dan sebutkan satu kalimat kapan masing-masing dipilih.',
      interviewQ: 'Q: "Apa beda FTP dan STP pada kabel?" — A: FTP (Foiled Twisted Pair) = satu foil membungkus keseluruhan 4 pasang. STP (Shielded) = tiap pasang punya shield sendiri plus shield global. FTP lebih murah/fleksibel untuk EMI sedang; STP untuk EMI ekstrem. Keduanya butuh grounding.',
      quiz: [
        { q: 'FTP pada konteks kabel artinya…', options: ['File Transfer Protocol', 'Foiled Twisted Pair — satu foil untuk 4 pasang', 'Fiber To Premises', 'Fast Twisted Pair'], answer: 1, explain: 'Konteks menentukan: di kabel, FTP = Foiled Twisted Pair.' },
        { q: 'FTP cocok untuk lingkungan…', options: ['EMI ekstrem pabrik', 'EMI sedang — jalan tengah antara UTP dan STP', 'Bawah laut', 'Tanpa gangguan sama sekali'], answer: 1, explain: 'FTP = proteksi menengah, harga menengah.' },
        { q: 'Alien crosstalk adalah…', options: ['Gangguan dari alien', 'Gangguan dari kabel tetangga di tray yang padat', 'Virus kabel', 'Salah wiring'], answer: 1, explain: 'Khas instalasi 10G padat; diatasi foil/shield (FTP/SFTP).' },
      ],
    },
    {
      id: '6.4',
      title: 'SFTP',
      body: `<p><b>SFTP</b> (<i>Shielded Foiled Twisted Pair</i>, kadang ditulis <b>SF/UTP</b>) menggabungkan keduanya: <b>foil per pasang + braid (anyaman) global</b> — proteksi tertinggi di keluarga tembaga sebelum pindah ke fiber.</p>
<h3>Konstruksi</h3>
<pre>SFTP:
  Jaket → Braid global (anyaman logam) → Foil per pasang → 4 pasang pilin
  = dua lapis proteksi (foil + braid)</pre>
<h3>Kapan SFTP Dibutuhkan?</h3>
<ul>
<li><b>10GBASE-T</b> di lingkungan EMI berat / tray sangat padat.</li>
<li>Data center dengan kepadatan kabel ekstrem.</li>
<li>Area yang butuh <b>emisi minimum</b> (keamanan TEMPEST).</li>
</ul>
<h3>Harga yang Dibayar</h3>
<p>Mahal, <b>kaku</b> (sulit ditekuk di ruang sempit), konektor & patch panel harus <b>shielded</b> juga (rantai proteksi putus di satu titik = sia-sia), dan grounding wajib sempurna. <b>Aturan praktis:</b> jika SFTP terasa "berlebihan", mungkin memang berlebihan — pertimbangkan <b>fiber</b> (Part 07) yang kebal EMI total dan seringkali lebih murah untuk jarak jauh.</p>
<div class="callout blue"><div class="t">Rantai Terlemah</div><p style="margin:4px 0 0">Kabel SFTP + konektor RJ45 <b>unshielded</b> = uang terbuang: proteksi bocor di konektor. Seluruh rantai (kabel, konektor, patch panel) harus shielded dan ter-ground — atau turunkan saja ke UTP/FTP.</p></div>`,
      terms: [
        ['SFTP', 'Shielded Foiled Twisted Pair — foil per pasang + braid global; proteksi tembaga tertinggi.'],
        ['Braid', 'Anyaman logam pelindung (lebih kuat dari foil, kurang fleksibel).'],
      ],
      scenario: 'Data center membangun zona 10G baru di ruang dengan ratusan kabel daya. Konsultan merekomendasikan SFTP Cat6A end-to-end (termasuk patch panel shielded + grounding). Hasil: zero error di 10 Gbps penuh. Mahal di awal, tapi downtime data center jauh lebih mahal.',
      bestPractices: 'Untuk SFTP: pastikan SEMUA komponen shielded (kabel, RJ45, keystone, patch panel) + grounding satu ujung. Audit rantai, bukan cuma kabel.',
      security: 'SFTP = emisi elektromagnetik minimum — pilihan untuk area yang memproses data klasifikasi tinggi.',
      challenge: 'Bandingkan total cost: SFTP Cat6A end-to-end vs fiber OM3 + transceiver untuk link 300 m. Kapan fiber menang? (Petunjuk: Part 07.)',
      interviewQ: 'Q: "Apa itu SFTP dan kapan dipakai?" — A: Shielded Foiled Twisted Pair: foil per pasang + braid global — proteksi EMI tertinggi di tembaga. Dipakai untuk 10GBASE-T di lingkungan EMI berat/tray padat atau kebutuhan emisi minimum. Syarat: seluruh rantai shielded + grounding benar; jika berlebihan, pertimbangkan fiber.',
      quiz: [
        { q: 'Konstruksi SFTP adalah…', options: ['Tanpa pelindung', 'Foil per pasang + braid global', 'Satu foil global saja', 'Serat kaca'], answer: 1, explain: 'SFTP = Shielded + Foiled: dua lapis proteksi.' },
        { q: 'Kelemahan utama SFTP adalah…', options: ['Terlalu murah', 'Mahal, kaku, dan seluruh rantai harus shielded + grounding sempurna', 'Tidak ada standar', 'Hanya untuk telepon'], answer: 1, explain: 'Proteksi maksimal = biaya & kompleksitas maksimal; rantai terlemah menentukan.' },
        { q: 'Jika kebutuhan EMI ekstrem tapi budget terbatas untuk jarak jauh, alternatif yang patut dipertimbangkan adalah…', options: ['Kabel lebih panjang', 'Fiber optic — kebal EMI total', 'Tanpa kabel', 'Wi-Fi saja'], answer: 1, explain: 'Fiber tidak menghantar listrik = kebal EMI; sering lebih ekonomis untuk jarak jauh.' },
      ],
    },
    {
      id: '6.5',
      title: 'Cat5e',
      body: `<p><b>Cat5e</b> (<i>Category 5 enhanced</i>) adalah <b>standar minimum modern</b> untuk kabel jaringan: mendukung <b>Gigabit Ethernet (1 Gbps)</b> hingga 100 meter pada frekuensi <b>100 MHz</b>.</p>
<h3>Spesifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Cat5e</th></tr>
<tr><td>Bandwidth frekuensi</td><td>100 MHz</td></tr>
<tr><td>Kecepatan maks</td><td>1 Gbps (1000BASE-T) @ 100 m</td></tr>
<tr><td>Konstruksi</td><td>UTP, 4 pasang</td></tr>
<tr><td>Status</td><td>Standar minimum; masih sangat umum terpasang</td></tr>
</table></div>
<h3>Cat5e vs Cat5 (Tanpa "e")</h3>
<p>Cat5 asli hanya terjamin 100 Mbps — "e" (<i>enhanced</i>) memperketat spesifikasi crosstalk sehingga <b>1 Gbps</b> terjamin. <b>Jangan beli Cat5 polos</b> di 2026 — tidak diproduksi resmi lagi dan tidak cukup untuk Gigabit.</p>
<h3>Kapan Cat5e Cukup?</h3>
<ul>
<li>Klien biasa (PC, printer, CCTV, AP) — 1 Gbps masih longgar untuk kebutuhan ini.</li>
<li>Budget terbatas dengan kebutuhan ≤1 Gbps.</li>
</ul>
<p><b>Kapan naik ke Cat6/6A?</b> Uplink antar-switch, koneksi server, dan instalasi baru yang ingin <b>future-proof 10 Gbps</b> — biaya kabel hanya ~20–30% lebih mahal, tapi ganti kabel terpasang = 10x lipat. <b>Aturan:</b> untuk instalasi <i>baru</i> di 2026, default = <b>Cat6</b> (selisih harga kecil, masa pakai 10+ tahun).</p>`,
      terms: [
        ['Cat5e', 'Category 5 enhanced — 1 Gbps @ 100 m, 100 MHz; standar minimum modern.'],
        ['Crosstalk', 'Gangguan antar-pasang dalam satu kabel — yang diperketat di Cat5e.'],
        ['Future-proof', 'Membangun untuk kebutuhan masa depan, bukan hanya hari ini.'],
      ],
      scenario: 'Gedung baru dipasang Cat5e "untuk hemat" tahun 2024. Tahun 2026 butuh 10 Gbps ke ruang server — kabel harus dibongkar total (biaya 10x selisih Cat6). Penghematan semu: Rp 5 juta di kabel menjadi Rp 50 juta di retrofit. Inilah alasan konsultan selalu bertanya "butuh apa 10 tahun ke depan?"',
      bestPractices: 'Instalasi baru 2026: minimal Cat6. Cat5e hanya untuk perbaikan/penambahan pada instalasi lama yang sudah Cat5e.',
      security: 'Kategori kabel tidak berkaitan langsung dengan keamanan — tapi kabel yang tidak memenuhi spesifikasi menyebabkan error yang bisa disalahartikan sebagai serangan (false alarm).',
      challenge: 'Cek kabel di sekitarmu: adakah tulisan "CAT5E" / "CAT6" di jaketnya? Catat kategorinya — cocokkan dengan kecepatan link yang ternegosiasi.',
      interviewQ: 'Q: "Apa beda Cat5 dan Cat5e?" — A: Cat5 hanya terjamin 100 Mbps; Cat5e (enhanced) memperketat spesifikasi crosstalk sehingga 1 Gbps @ 100 m terjamin pada 100 MHz. Cat5 polos sudah usang — standar minimum modern adalah Cat5e.',
      quiz: [
        { q: 'Spesifikasi Cat5e adalah…', options: ['100 Mbps @ 100 MHz', '1 Gbps @ 100 m, 100 MHz', '10 Gbps @ 100 m', '10 Mbps'], answer: 1, explain: 'Cat5e = Gigabit Ethernet standar, 100 MHz.' },
        { q: 'Untuk instalasi BARU di 2026, rekomendasi default adalah…', options: ['Cat5 polos', 'Cat5e', 'Cat6 (selisih harga kecil, future-proof 10 Gbps)', 'Kabel telepon'], answer: 2, explain: 'Biaya kabel kecil dibanding biaya retrofit; Cat6 memberi masa pakai 10+ tahun.' },
        { q: 'Huruf "e" pada Cat5e artinya…', options: ['Economic', 'Enhanced — spesifikasi crosstalk diperketat untuk 1 Gbps', 'External', 'Ethernet'], answer: 1, explain: 'Enhanced: penyempurnaan dari Cat5 agar Gigabit terjamin.' },
      ],
    },
    {
      id: '6.6',
      title: 'Cat6',
      body: `<p><b>Cat6</b> (<i>Category 6</i>) adalah penerus Cat5e: frekuensi <b>250 MHz</b>, mendukung <b>1 Gbps @ 100 m</b> dan <b>10 Gbps @ 55 m</b>. Ciri fisik khasnya: ada <b>separator plastik</b> (<i>spline</i>) berbentuk plus di tengah yang memisahkan 4 pasang.</p>
<h3>Spesifikasi vs Cat5e</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Cat5e</th><th>Cat6</th></tr>
<tr><td>Frekuensi</td><td>100 MHz</td><td>250 MHz</td></tr>
<tr><td>1 Gbps</td><td>100 m ✓</td><td>100 m ✓</td></tr>
<tr><td>10 Gbps</td><td>Tidak</td><td>55 m (terbatas!)</td></tr>
<tr><td>Ciri fisik</td><td>—</td><td>Spline pemisah antar-pasang</td></tr>
<tr><td>Harga</td><td>Dasar</td><td>~20–30% lebih mahal</td></tr>
</table></div>
<h3>Batasan 55 Meter untuk 10G</h3>
<p>Cat6 hanya menjamin 10GBASE-T sampai <b>55 m</b> (di lingkungan alien crosstalk rendah). <b>Alasan:</b> pada frekuensi 10G, gangguan dari kabel tetangga (alien crosstalk) terlalu besar melewati 55 m. Butuh 10G penuh 100 m? Naik ke <b>Cat6A</b> (6.7).</p>
<h3>Kapan Cat6 Pilihan Tepat?</h3>
<ul>
<li><b>Instalasi baru standar 2026:</b> 1 Gbps terjamin 100 m + opsi 10G jarak pendek — future-proof dengan harga wajar.</li>
<li>Horizontal cabling kantor (umumnya &lt;55 m ke ruang server tetap dapat 10G).</li>
</ul>
<div class="callout"><div class="t">Jangan Terkecoh "Cat6 Murah"</div><p style="margin:4px 0 0">Kabel "Cat6" tanpa merek jelas sering gagal uji sertifikasi (fluke test). Minta <b>hasil uji sertifikasi</b> (bukan cuma "connectivity test") dari kontraktor — kabel yang gagal spesifikasi = 10G yang tidak pernah tercapai.</p></div>`,
      terms: [
        ['Cat6', 'Category 6 — 250 MHz; 1 Gbps @ 100 m, 10 Gbps @ 55 m; ada spline.'],
        ['Spline', 'Separator plastik antar-pasang di Cat6 untuk menekan crosstalk.'],
        ['Sertifikasi kabel', 'Pengujian dengan alat (Fluke) bahwa kabel memenuhi spesifikasi kategori.'],
      ],
      scenario: 'Kantor memasang Cat6 ke semua meja (jarak terjauh 40 m ke patch panel). Tiga tahun kemudian upgrade switch ke 10G — semua link langsung 10 Gbps tanpa ganti kabel. Investasi 25% di awal menghemat 100% biaya retrofit. Inilah definisi future-proof yang benar.',
      bestPractices: 'Selalu minta test report sertifikasi (Fluke DSX) per titik — bukan sekadar "nyambung". Simpan sebagai bukti serah terima.',
      security: 'Kabel yang tidak memenuhi spesifikasi (palsu) menyebabkan error intermiten yang bisa disalahartikan sebagai serangan — beli dari distributor resmi dan simpan hasil sertifikasi.',
      challenge: 'Ukur jarak terjauh dari mejamu ke patch panel/switch terdekat (perkiraan). Jika di bawah 55 m, kabel Cat6-mu 10G-ready!',
      interviewQ: 'Q: "Apa beda Cat5e dan Cat6?" — A: Cat6: 250 MHz (vs 100 MHz), mendukung 10 Gbps sampai 55 m (Cat5e tidak), punya spline pemisah antar-pasang. Keduanya 1 Gbps @ 100 m. Untuk instalasi baru, Cat6 adalah default yang future-proof.',
      quiz: [
        { q: 'Cat6 mendukung 10 Gbps hingga jarak…', options: ['100 m', '55 m', '10 m', '1000 m'], answer: 1, explain: 'Batas 10GBASE-T di Cat6 = 55 m (alien crosstalk); butuh Cat6A untuk 100 m.' },
        { q: 'Ciri fisik khas kabel Cat6 adalah…', options: ['Warna biru', 'Spline plastik pemisah antar-pasang', 'Lebih tipis', 'Tanpa jaket'], answer: 1, explain: 'Spline berbentuk plus menekan crosstalk antar-pasang.' },
        { q: 'Bukti kabel terpasang memenuhi spesifikasi adalah…', options: ['Lampu switch menyala', 'Hasil uji sertifikasi (Fluke test) per titik', 'Kata kontraktor', 'Bisa ping'], answer: 1, explain: '"Nyambung" ≠ memenuhi spesifikasi; sertifikasi menguji parameter frekuensi.' },
      ],
    },
    {
      id: '6.7',
      title: 'Cat6A',
      body: `<p><b>Cat6A</b> (<i>Category 6 Augmented</i>) adalah <b>"Cat6 yang disempurnakan"</b>: frekuensi <b>500 MHz</b>, mendukung <b>10 Gbps penuh @ 100 m</b> — tanpa batasan 55 m seperti Cat6.</p>
<h3>Spesifikasi</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Cat6</th><th>Cat6A</th></tr>
<tr><td>Frekuensi</td><td>250 MHz</td><td>500 MHz</td></tr>
<tr><td>10 Gbps</td><td>55 m</td><td><b>100 m</b> ✓</td></tr>
<tr><td>Diameter</td><td>Standar</td><td><b>Lebih besar</b> (shield/spline ekstra)</td></tr>
<tr><td>Harga</td><td>Dasar+</td><td>~50–100% di atas Cat6</td></tr>
</table></div>
<h3>Konsekuensi Fisik: Lebih Besar & Kaku</h3>
<p>Cat6A (terutama FTP/SFTP) <b>jauh lebih tebal</b> — tray kabel dan conduit harus dihitung ulang; radius tekuk lebih besar; terminasi lebih sulit. <b>Alasan:</b> proteksi alien crosstalk butuh material lebih. Rencanakan jalur kabel sejak desain gedung, bukan setelah tembok jadi.</p>
<h3>Kapan Cat6A Wajib?</h3>
<ul>
<li><b>Data center & ruang server:</b> 10G adalah standar, jarak bisa 100 m.</li>
<li><b>Backbone antar-lantai</b> yang direncanakan 10G.</li>
<li>Instalasi yang harus tahan 10+ tahun tanpa retrofit.</li>
</ul>
<p><b>Kapan tidak perlu?</b> Meja user biasa (1 Gbps cukup untuk 10 tahun ke depan) — Cat6 sudah memadai. Jangan over-engineering: uangnya lebih baik untuk switch yang bagus.</p>
<div class="callout blue"><div class="t">Cat6A vs Fiber untuk 10G</div><p style="margin:4px 0 0">Untuk link 10G &gt;55 m, pilihannya Cat6A <b>atau</b> fiber OM3/OM4 + SFP+ (Part 07). Fiber: kebal EMI, lebih tipis, jarak jauh — tapi butuh transceiver. Tembaga: colok langsung ke port RJ45 10GBASE-T. Hitung total cost (kabel + port + daya) sebelum memutuskan.</p></div>`,
      terms: [
        ['Cat6A', 'Category 6 Augmented — 500 MHz; 10 Gbps @ 100 m penuh.'],
      ],
      scenario: 'Universitas membangun backbone antar-gedung fakultas (jarak 80 m). Pilihan: Cat6A atau fiber OM3. Perhitungan: Cat6A lebih murah kabelnya, tapi switch 10GBASE-T lebih mahal & boros daya dibanding SFP+. Keputusan akhir: fiber — total cost 5 tahun lebih murah + siap 40G. Pelajaran: hitung TCO, bukan harga kabel.',
      bestPractices: 'Untuk backbone 10G: bandingkan Cat6A vs fiber (TCO 5 tahun) sebelum tarik kabel. Untuk horizontal user: Cat6 cukup.',
      security: 'Kabel Cat6A yang tebal dan sulit di-trace memudahkan penyadap menyembunyikan tap fisik — kerapian instalasi + dokumentasi jalur adalah kontrol keamanan fisik.',
      challenge: 'Cari harga: 1 roll Cat6A vs 1 roll fiber OM3 4-core + 2 transceiver SFP+. Mana lebih murah untuk 80 m? (Riset online 10 menit.)',
      interviewQ: 'Q: "Kapan memilih Cat6A dibanding Cat6?" — A: Saat butuh 10 Gbps penuh hingga 100 m (Cat6 hanya 55 m): data center, backbone antar-lantai, instalasi 10+ tahun. Harganya: lebih mahal, lebih tebal/kaku (rencanakan tray), dan untuk jarak jauh bandingkan dengan opsi fiber.',
      quiz: [
        { q: 'Keunggulan utama Cat6A atas Cat6 adalah…', options: ['Lebih murah', '10 Gbps penuh @ 100 m (vs 55 m)', 'Lebih tipis', 'Tanpa batas jarak'], answer: 1, explain: '500 MHz + proteksi alien crosstalk = 10G full 100 m.' },
        { q: 'Konsekuensi fisik Cat6A adalah…', options: ['Sama persis dengan Cat5e', 'Lebih tebal & kaku — tray/conduit harus direncanakan', 'Bisa ditekuk tajam', 'Tanpa jaket'], answer: 1, explain: 'Material proteksi ekstra = diameter besar; rencanakan jalur sejak desain.' },
        { q: 'Untuk link 10G jarak 80 m, alternatif Cat6A yang patut dihitung adalah…', options: ['Cat5e', 'Fiber OM3/OM4 + SFP+ (bandingkan TCO)', 'Kabel telepon', 'Wi-Fi'], answer: 1, explain: 'Fiber kebal EMI & siap 40G; hitung total cost 5 tahun.' },
      ],
    },
    {
      id: '6.8',
      title: 'RJ45',
      body: `<p><b>RJ45</b> adalah konektor <b>8P8C</b> (<i>8 Position 8 Contact</i>) — "colokan" standar kabel jaringan. Delapan pin emas kecil yang menusuk 8 kabel UTP dan mengantarnya ke port switch/NIC.</p>
<h3>Anatomi</h3>
<pre> Tampak depan (kabel masuk dari belakang, klip di bawah):
 ┌─────────────────────────┐
 │ 1 2 3 4 5 6 7 8         │ ← 8 pin emas
 │ □ □ □ □ □ □ □ □         │    (menusuk kabel)
 └─────────────────────────┘
 Klip plastik pengunci di sisi bawah

Pin 1 = paling kiri saat klip di bawah & kabel masuk dari belakang</pre>
<h3>Jenis RJ45</h3>
<div class="tblwrap"><table>
<tr><th>Jenis</th><th>Ciri</th><th>Kapan Dipakai</th></tr>
<tr><td><b>Unshielded</b></td><td>Plastik biasa</td><td>UTP standar</td></tr>
<tr><td><b>Shielded</b></td><td>Bodi logam</td><td>STP/FTP/SFTP — rantai proteksi</td></tr>
<tr><td><b>Pass-through</b></td><td>Kabel tembus ke depan (lalu dipotong)</td><td>Pemula — mudah verifikasi urutan warna</td></tr>
<tr><td><b>Cat6/6A rated</b></td><td>Lebih besar, staggered</td><td>Kabel Cat6/6A (diameter besar)</td></tr>
</table></div>
<h3>Kesalahan Krimping Klasik</h3>
<ul>
<li><b>Urutan warna salah</b> → tidak konek / crosstalk (pakai standar 6.9/6.10!).</li>
<li><b>Jaket tidak masuk konektor</b> → kabel mudah lepas, strain relief hilang.</li>
<li><b>Pilinan dibuka terlalu panjang</b> (&gt;13 mm) → crosstalk naik, Gigabit gagal.</li>
<li><b>Pin tidak menusuk sempurna</b> → kontak intermiten ("kadang konek kadang tidak").</li>
</ul>
<div class="callout"><div class="t">Aturan 13 mm</div><p style="margin:4px 0 0">Buka pilinan <b>maksimal 13 mm</b> (setengah inci) sebelum pin. Pilinan adalah proteksi — setiap milimeter yang dibuka adalah proteksi yang hilang. Inilah beda krimping "asal nyambung" vs "sesuai standar".</p></div>`,
      terms: [
        ['RJ45', 'Konektor 8P8C standar kabel jaringan; 8 pin emas.'],
        ['8P8C', '8 Position 8 Contact — spesifikasi teknis konektor RJ45.'],
        ['Krimping', 'Proses memasang konektor RJ45 ke kabel dengan tang krimping.'],
        ['Strain relief', 'Mekanisme penahan tarikan agar kabel tidak lepas dari konektor.'],
      ],
      scenario: 'Satu titik "kadang konek kadang tidak" — diganti switch port, diganti NIC, tidak sembuh. Ternyata krimping RJ45-nya: jaket tidak masuk konektor + pilinan dibuka 3 cm. Tarikan kecil = kontak lepas. Krimping ulang sesuai standar: sembuh permanen. 80% masalah "intermiten" di titik baru = kualitas terminasi.',
      bestPractices: 'Selalu uji tiap krimping dengan cable tester (wiremap) — 30 detik yang mencegah kunjungan ulang. Untuk instalasi kritis: sertifikasi Fluke.',
      security: 'Krimping yang buruk menyebabkan kontak intermiten — gangguan yang bisa disalahartikan sebagai DoS. Standar krimping yang konsisten mengurangi false alarm.',
      challenge: 'Jika punya tang krimping: krimping satu kabel, lalu uji dengan tester. Catat: berapa kali percobaan sampai wiremap 8 pin benar semua?',
      interviewQ: 'Q: "Sebutkan 3 kesalahan krimping RJ45 yang umum." — A: (1) Urutan warna tidak sesuai standar T568A/B; (2) jaket tidak masuk konektor (strain relief hilang); (3) pilinan dibuka terlalu panjang (>13 mm) sehingga crosstalk naik dan Gigabit gagal.',
      quiz: [
        { q: 'RJ45 secara teknis disebut…', options: ['6P4C', '8P8C (8 position 8 contact)', '4P4C', '10P10C'], answer: 1, explain: '8 posisi, 8 kontak emas.' },
        { q: 'Aturan membuka pilinan saat krimping adalah maksimal…', options: ['50 mm', '13 mm (setengah inci)', '100 mm', 'Bebas'], answer: 1, explain: 'Pilinan = proteksi; dibuka berlebihan = crosstalk naik.' },
        { q: 'Untuk kabel STP/FTP, konektor yang dipakai harus…', options: ['Unshielded biasa', 'Shielded (bodi logam) — rantai proteksi tidak boleh putus', 'Pass-through saja', 'Bebas'], answer: 1, explain: 'Satu komponen unshielded = proteksi bocor di titik itu.' },
      ],
    },
    {
      id: '6.9',
      title: 'T568A',
      body: `<p><b>T568A</b> adalah salah satu dari dua <b>standar urutan warna</b> kabel di konektor RJ45 (standar <b>TIA/EIA-568</b>). Ia mengatur: kabel warna apa di pin berapa — agar seluruh dunia mengkrimping <b>sama</b>.</p>
<h3>Urutan Warna T568A (Pin 1 → 8)</h3>
<pre>Pin:  1           2        3           4     5           6        7            8
Warna: PUTIH-HIJAU HIJAU  PUTIH-ORANYE BIRU PUTIH-BIRU ORANYE  PUTIH-COKLAT COKLAT
       └─ pasang 3 ─┘     └─ pasang 2 ─┘     └──── pasang 1 ────┘└─ pasang 2 ─┘└── pasang 4 ──┘
                    (pin 3&6 = satu pasang pilin!)</pre>
<h3>Posisi Pin Kritis</h3>
<ul>
<li><b>Pin 1-2</b> = pasang transmit (TX), <b>pin 3-6</b> = pasang receive (RX) — untuk 10/100 Mbps.</li>
<li><b>Gigabit memakai SEMUA 4 pasang</b> (8 pin) — alasan krimping harus sempurna untuk 1 Gbps.</li>
<li>Perhatikan: <b>pin 3 & 6 adalah satu pasang pilin</b> (bukan 3-4!) — inilah yang membuat urutan warna tidak "berurutan logis" dan wajib dihafal/diikuti diagram.</li>
</ul>
<h3>Kapan T568A Dipakai?</h3>
<p>T568A adalah <b>standar resmi pemerintah AS</b> dan direkomendasikan untuk <b>instalasi baru</b> oleh TIA. Praktisnya: <b>pilih SALAH SATU dan konsisten</b> — yang penting kedua ujung sama (straight-through) atau mengikuti pola crossover yang benar.</p>`,
      terms: [
        ['T568A', 'Standar urutan warna RJ45 (TIA/EIA-568); pin 1 = putih-hijau.'],
        ['TIA/EIA-568', 'Standar pengkabelan gedung komersial.'],
      ],
      diagram: `<pre>         T568A: URUTAN WARNA PIN 1→8

   1: Putih-Hijau   ┐
   2: Hijau         ┘ pasang TX
   3: Putih-Oranye  ┐
   6: Oranye        ┘ pasang RX  ← pin 3&6 sepasang!
   4: Biru          ┐
   5: Putih-Biru    ┘ pasang
   7: Putih-Coklat  ┐
   8: Coklat        ┘ pasang

   Hafalkan: HIJAU dulu (A = "Awal" = hijau)... atau pakai diagram.</pre>`,
      scenario: 'Kontraktor mengkrimping ujung A dengan T568A dan ujung B dengan T568B tanpa sadar — jadinya kabel crossover tak disengaja. Beruntung switch modern punya Auto-MDIX (6.12) sehingga tetap jalan — tapi di device lama, link mati total. Standar ganda tanpa komunikasi = jebakan.',
      bestPractices: 'Tetapkan SATU standar (A atau B) untuk seluruh site, tulis di dokumen instalasi, dan verifikasi dengan wiremap tester.',
      security: 'Tidak ada risiko dari standar A itu sendiri — risikonya adalah campuran A/B tanpa dokumentasi. Tetapkan dan umumkan satu standar site.',
      challenge: 'Tulis urutan T568A dari ingatan 3x tanpa melihat. Lalu bandingkan — pin mana yang paling sering salah?',
      interviewQ: 'Q: "Apa itu T568A?" — A: Salah satu standar urutan warna RJ45 (TIA/EIA-568): pin 1 putih-hijau, 2 hijau, 3 putih-oranye, 6 oranye, dst. Direkomendasikan TIA untuk instalasi baru; yang kritis adalah konsistensi di seluruh instalasi.',
      quiz: [
        { q: 'Pin 1 pada T568A adalah…', options: ['Putih-Oranye', 'Putih-Hijau', 'Biru', 'Coklat'], answer: 1, explain: 'T568A dimulai dengan pasangan hijau: pin 1 putih-hijau.' },
        { q: 'Pada 10/100 Mbps, pasangan receive (RX) ada di pin…', options: ['1-2', '3-6', '4-5', '7-8'], answer: 1, explain: 'Pin 3&6 = satu pasang pilin untuk RX; 1&2 untuk TX.' },
        { q: 'Untuk Gigabit Ethernet, syarat krimping adalah…', options: ['Cukup 4 pin', 'Semua 8 pin sempurna — Gigabit memakai 4 pasang', 'Bebas urutan', 'Hanya pin ganjil'], answer: 1, explain: '1000BASE-T memakai semua 4 pasang secara bidirectional.' },
      ],
    },
    {
      id: '6.10',
      title: 'T568B',
      body: `<p><b>T568B</b> adalah standar urutan warna kedua (TIA/EIA-568) — <b>identik dengan T568A kecuali pasangan oranye dan hijau ditukar</b>. Inilah standar yang <b>paling umum dipakai di lapangan</b> (de facto).</p>
<h3>Urutan Warna T568B (Pin 1 → 8)</h3>
<pre>Pin:  1           2         3          4     5           6       7            8
Warna: PUTIH-ORANYE ORANYE PUTIH-HIJAU BIRU PUTIH-BIRU HIJAU  PUTIH-COKLAT COKLAT
       └─ pasang 2 ─┘      └─ pasang 3 ─┘    └──── pasang 1 ────┘└─ pasang 3 ──┘└── pasang 4 ──┘</pre>
<h3>T568A vs T568B: Perbandingan</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>T568A</th><th>T568B</th></tr>
<tr><td>Pin 1-2</td><td>Putih-Hijau / Hijau</td><td>Putih-Oranye / Oranye</td></tr>
<tr><td>Pin 3-6</td><td>Putih-Oranye / Oranye</td><td>Putih-Hijau / Hijau</td></tr>
<tr><td>Pin 4-5, 7-8</td><td colspan="2">SAMA (biru & coklat)</td></tr>
<tr><td>Pemakaian</td><td>Standar resmi TIA, proyek pemerintah AS</td><td><b>De facto umum</b> di lapangan/komersial</td></tr>
<tr><td>Kompatibilitas</td><td colspan="2">Sama baik — asal KONSISTEN di kedua ujung</td></tr>
</table></div>
<h3>Aturan Emas</h3>
<p><b>Tidak ada yang "lebih benar"</b> — yang ada hanya <b>konsisten</b>. Satu site = satu standar. Jika mewarisi instalasi lama, ikuti standar yang sudah ada (cek satu kabel yang benar dengan tester) — jangan campur.</p>
<div class="callout blue"><div class="t">Mengapa Dua Standar?</div><p style="margin:4px 0 0">Sejarah: T568B lahir dari praktik AT&T yang sudah terlanjur luas; T568A dipilih TIA agar kompatibel dengan kabel telepon lama (pasang biru di tengah). Keduanya dipertahankan — dan perbedaan inilah yang memungkinkan kabel <b>crossover</b> (6.12): A di satu ujung, B di ujung lain!</p></div>`,
      terms: [
        ['T568B', 'Standar urutan warna RJ45; pin 1 = putih-oranye; paling umum di lapangan.'],
      ],
      scenario: 'Teknisi baru mengkrimping perbaikan dengan T568A di site yang semuanya T568B. Hasilnya kabel crossover tak sengaja — beruntung Auto-MDIX menyelamatkan. Sejak itu, SOP site: "STANDAR SITE INI: T568B — tertulis di pintu ruang server". Satu kalimat mencegah pengulangan.',
      bestPractices: 'Tempel standar site (A/B) di ruang server & dokumen. Verifikasi tiap terminasi dengan wiremap tester.',
      security: 'Campuran standar A/B tanpa dokumentasi menciptakan kabel crossover tak disengaja — dokumentasikan standar site agar tidak ada "kabel misterius".',
      challenge: 'Tanpa melihat: tulis T568B, lalu tulis T568A di bawahnya. Lingkari yang berbeda — seharusnya hanya pin 1-2 dan 3-6.',
      interviewQ: 'Q: "Apa beda T568A dan T568B, dan mana yang harus dipakai?" — A: Hanya pasangan oranye dan hijau yang ditukar (pin 1-2 ↔ 3-6); sisanya sama. Tidak ada yang lebih benar — pilih satu dan konsisten satu site. T568B paling umum di lapangan; T568A standar resmi TIA.',
      quiz: [
        { q: 'Pin 1 pada T568B adalah…', options: ['Putih-Hijau', 'Putih-Oranye', 'Biru', 'Putih-Biru'], answer: 1, explain: 'T568B dimulai pasangan oranye: pin 1 putih-oranye.' },
        { q: 'Perbedaan T568A dan T568B terletak pada…', options: ['Semua pin', 'Pasangan oranye ↔ hijau ditukar (pin 1-2 dan 3-6)', 'Hanya pin 7-8', 'Warna jaket'], answer: 1, explain: 'Hanya dua pasang itu yang bertukar; biru & coklat sama.' },
        { q: 'Aturan terpenting dalam memilih standar wiring adalah…', options: ['Selalu pakai A', 'Konsisten satu standar dalam satu site', 'Campur agar fleksibel', 'Ikut warna kesukaan'], answer: 1, explain: 'Konsistensi > pilihan; campur = crossover tak disengaja.' },
      ],
    },
    {
      id: '6.11',
      title: 'Straight Through',
      body: `<p><b>Straight-through</b> adalah kabel dengan <b>urutan warna SAMA di kedua ujung</b> (mis. T568B–T568B). Pin 1 ketemu pin 1, pin 2 ketemu pin 2 — "lurus" tanpa silang. Ini adalah <b>kabel standar</b> untuk hampir semua koneksi modern.</p>
<h3>Kapan Dipakai?</h3>
<div class="tblwrap"><table>
<tr><th>Koneksi</th><th>Kabel</th></tr>
<tr><td>PC → Switch</td><td>Straight-through ✓</td></tr>
<tr><td>Switch → Router</td><td>Straight-through ✓</td></tr>
<tr><td>AP → Switch</td><td>Straight-through ✓</td></tr>
<tr><td>PC → PC (modern)</td><td>Straight-through ✓ (Auto-MDIX)</td></tr>
</table></div>
<p><b>Aturan sederhana modern:</b> <b>device berbeda jenis</b> (PC/endpoint → switch) = straight-through. Untuk device sejenis, lihat 6.12 — tapi ingat Auto-MDIX membuat perbedaan ini makin tidak relevan.</p>
<h3>Mengapa Dulu Perlu Dibedakan?</h3>
<p>Port Ethernet punya pin <b>TX</b> (kirim) dan <b>RX</b> (terima). Agar komunikasi jalan, <b>TX satu pihak harus ketemu RX pihak lain</b>. Switch (dulu: hub) dirancang "terbalik" dari PC — sehingga kabel lurus sudah menyilangkan TX↔RX secara alami. Dua PC (sama-sama "tidak terbalik") butuh kabel yang menyilang di tengah: crossover.</p>
<div class="callout blue"><div class="t">Praktik 2026</div><p style="margin:4px 0 0">Buat <b>semua</b> kabel patch sebagai straight-through T568B — kecuali ada alasan khusus. Stok satu jenis = tidak ada salah ambil. Auto-MDIX menangani sisanya.</p></div>`,
      terms: [
        ['Straight-through', 'Kabel dengan urutan warna sama di kedua ujung; standar koneksi modern.'],
        ['TX/RX', 'Transmit/Receive — pin kirim dan terima di port Ethernet.'],
      ],
      scenario: 'Gudang kabel kantor punya 3 kardus: straight, crossover, dan "tidak jelas". Teknisi selalu salah ambil saat darurat. Solusi: buang/beri label jelas, standarkan semua straight-through + pastikan device Auto-MDIX. Masalah logistik kecil yang menghemat 15 menit di setiap insiden.',
      bestPractices: 'Standarkan satu jenis kabel patch (straight-through T568B) untuk seluruh site. Labeli yang khusus (crossover/console) dengan warna berbeda.',
      security: 'Standarisasi satu jenis kabel memudahkan audit fisik: kabel yang tidak sesuai standar langsung terlihat mencurigakan.',
      challenge: 'Periksa kabel patch di sekitarmu: bisakah kamu memastikan ia straight-through tanpa tester? (Petunjuk: sejajarkan kedua konektor, bandingkan urutan warna.)',
      interviewQ: 'Q: "Kapan memakai kabel straight-through?" — A: Untuk koneksi device berbeda jenis (PC/endpoint ke switch, switch ke router) — urutan warna sama di kedua ujung (mis. T568B–T568B). Di era Auto-MDIX, ini menjadi default untuk hampir semua koneksi.',
      quiz: [
        { q: 'Kabel straight-through artinya…', options: ['Urutan warna sama di kedua ujung', 'Urutan warna disilang', 'Hanya 4 kabel', 'Tanpa konektor'], answer: 0, explain: 'Pin 1→1, 2→2, dst. — "lurus".' },
        { q: 'Koneksi PC ke switch memakai…', options: ['Crossover', 'Straight-through', 'Kabel console', 'Fiber'], answer: 1, explain: 'Device berbeda jenis = straight-through (standar).' },
        { q: 'Mengapa TX harus bertemu RX?', options: ['Agar hemat daya', 'Agar kiriman satu pihak diterima pihak lain — komunikasi dua arah', 'Syarat warna', 'Agar cepat'], answer: 1, explain: 'Prinsip dasar: transmit satu sisi = receive sisi lain.' },
      ],
    },
    {
      id: '6.12',
      title: 'Crossover',
      body: `<p><b>Crossover</b> adalah kabel dengan <b>standar BERBEDA di tiap ujung</b> (T568A di satu ujung, T568B di ujung lain) — sehingga pasangan TX/RX <b>bersilang</b> di tengah kabel: pin 1↔3, pin 2↔6.</p>
<h3>Yang Disilang</h3>
<pre>Ujung A (T568A)          Ujung B (T568B)
  1 (TX+) ─────────╲───▶ 3 (RX+)
  2 (TX-) ─────────╲───▶ 6 (RX-)
  3 (RX+) ─────────╱───▶ 1 (TX+)
  6 (RX-) ─────────╱───▶ 2 (TX-)
  (4,5,7,8 lurus — untuk Gigabit, semua pasang disilang)</pre>
<h3>Kapan Dibutuhkan? (Dulu vs Sekarang)</h3>
<div class="tblwrap"><table>
<tr><th>Koneksi</th><th>Dulu</th><th>Sekarang (Auto-MDIX)</th></tr>
<tr><td>PC → PC</td><td>Crossover wajib</td><td>Straight OK</td></tr>
<tr><td>Switch → Switch</td><td>Crossover wajib</td><td>Straight OK</td></tr>
<tr><td>Router → PC (tanpa switch)</td><td>Crossover</td><td>Straight OK</td></tr>
</table></div>
<p><b>Auto-MDIX</b> (<i>Automatic Medium-Dependent Interface Crossover</i>): port modern <b>mendeteksi otomatis</b> dan membalik TX/RX secara elektronik jika perlu. Hasilnya: <b>jenis kabel tidak lagi penting</b> untuk sebagian besar device 2005+. <b>Alasan tetap dipelajari:</b> device legacy/industrial tanpa Auto-MDIX masih ada — dan interview masih menanyakannya!</p>
<div class="callout"><div class="t">Jangan Buang Pengetahuan Ini</div><p style="margin:4px 0 0">Meski Auto-MDIX membuat crossover jarang dibutuhkan, memahami <i>mengapa</i> ia ada (TX harus ketemu RX) adalah pemahaman Layer 1 yang membedakan engineer dari "tukang colok". Dan di perangkat embedded/IoT murah, Auto-MDIX kadang tidak ada.</p></div>`,
      terms: [
        ['Crossover', 'Kabel dengan T568A di satu ujung & T568B di ujung lain; TX/RX bersilang.'],
        ['Auto-MDIX', 'Fitur port modern yang otomatis membalik TX/RX — jenis kabel jadi tidak penting.'],
      ],
      scenario: 'Menghubungkan dua switch lama (2003) di gudang arsip — link tidak nyala dengan straight-through. Teknisi senior langsung tahu: tidak ada Auto-MDIX → butuh crossover. Satu kabel crossover di tas menyelesaikan dalam 2 menit. Pengetahuan "usang" yang menyelamatkan di tempat yang usang.',
      bestPractices: 'Simpan 1–2 kabel crossover berlabel jelas di tas toolkit — untuk device legacy. Sisanya standarkan straight-through.',
      security: 'Kabel crossover tak berlabel bisa disalahgunakan untuk menghubungkan dua segmen yang seharusnya terpisah — beri label warna khusus dan batasi jumlahnya.',
      challenge: 'Jelaskan mengapa Gigabit crossover menyilang SEMUA 4 pasang, bukan cuma 1-3/2-6. (Petunjuk: 1000BASE-T memakai semua pasang bidirectional.)',
      interviewQ: 'Q: "Apa itu kabel crossover dan kapan dibutuhkan?" — A: Kabel dengan T568A di satu ujung dan T568B di ujung lain sehingga TX/RX bersilang (1↔3, 2↔6). Dibutuhkan untuk device sejenis (PC-PC, switch-switch) di era sebelum Auto-MDIX; kini jarang karena port modern otomatis membalik.',
      quiz: [
        { q: 'Kabel crossover dibuat dengan…', options: ['T568B di kedua ujung', 'T568A di satu ujung dan T568B di ujung lain', 'Warna acak', 'Hanya 2 kabel'], answer: 1, explain: 'Beda standar = pasangan TX/RX bersilang.' },
        { q: 'Fungsi Auto-MDIX adalah…', options: ['Mempercepat kabel', 'Otomatis membalik TX/RX secara elektronik sehingga jenis kabel tidak penting', 'Mengganti switch', 'Mengenkripsi data'], answer: 1, explain: 'Port modern adaptif — straight vs crossover tidak lagi masalah.' },
        { q: 'Pada crossover 10/100 Mbps, pin yang bersilang adalah…', options: ['1↔2 dan 3↔6', '1↔3 dan 2↔6', '4↔5 dan 7↔8', 'Semua acak'], answer: 1, explain: 'TX (1,2) bertemu RX (3,6) di seberang.' },
      ],
    },
    {
      id: '6.13',
      title: 'Patch Cord',
      body: `<p><b>Patch cord</b> (<i>patch cable</i>) adalah kabel <b>pendek fleksibel</b> (umumnya 0,5–5 m) untuk menghubungkan: PC ke wall socket, atau patch panel ke switch. Bedanya dengan kabel instalasi: <b>stranded</b> (serabut), bukan solid.</p>
<h3>Stranded vs Solid</h3>
<div class="tblwrap"><table>
<tr><th>Aspek</th><th>Stranded (patch cord)</th><th>Solid (instalasi)</th></tr>
<tr><td>Konstruksi</td><td>Banyak serabut tipis</td><td>Satu kawat pejal per konduktor</td></tr>
<tr><td>Fleksibilitas</td><td><b>Tinggi</b> — tahan ditekuk berulang</td><td>Rendah — patah jika sering ditekuk</td></tr>
<tr><td>Performa</td><td>Sedikit lebih tinggi attenuation</td><td><b>Lebih baik</b> untuk jarak jauh</td></tr>
<tr><td>Pemakaian</td><td>Patch cord (bergerak)</td><td>Di dalam tembok/tray (diam)</td></tr>
</table></div>
<h3>Aturan Patch Cord</h3>
<ul>
<li><b>Jangan pakai patch cord sebagai kabel permanen</b> di tray/tembok — attenuation lebih tinggi + tidak dirancang untuk itu.</li>
<li><b>Jangan pakai kabel solid sebagai patch cord</b> — patah di dalam setelah sering ditekuk ("intermiten misterius").</li>
<li><b>Kode warna:</b> biru = user, kuning = uplink, merah = server/management, dll. — sesuaikan standar site. <b>Alasan:</b> identifikasi visual 5 detik saat darurat.</li>
<li>Panjang secukupnya — kabel 5 m untuk jarak 50 cm = sarang kabel (<i>spaghetti</i>) yang menyulitkan tracing.</li>
</ul>
<div class="callout blue"><div class="t">Musuh: Kabel "Spaghetti"</div><p style="margin:4px 0 0">Rak tanpa manajemen kabel = troubleshooting 30 menit untuk cabut 1 kabel. Gunakan <b>cable manager</b> horizontal/vertikal + panjang patch cord yang pas. Kerapian rak adalah <b>fitur operasional</b>, bukan estetika.</p></div>`,
      terms: [
        ['Patch cord', 'Kabel pendek fleksibel (stranded) untuk koneksi akhir: PC–socket, panel–switch.'],
        ['Stranded', 'Konduktor serabut — fleksibel, untuk kabel yang sering bergerak.'],
        ['Solid', 'Konduktor pejal — performa lebih baik, untuk instalasi permanen yang diam.'],
      ],
      scenario: 'Ruang server dengan 200 patch cord 3 m untuk jarak 30 cm — teknisi butuh 45 menit hanya untuk menemukan kabel yang benar saat insiden. Setelah penataan ulang (panjang pas + kode warna + label), waktu temuan menjadi 2 menit. MTTR turun drastis tanpa beli satu alat pun.',
      bestPractices: 'Stok patch cord berbagai panjang (0,5/1/2/3 m) + kode warna site. Labeli kedua ujung setiap kabel penting.',
      security: 'Kabel yang tidak terkelola memudahkan "penyadap" menyelipkan tap tanpa terlihat — kerapian = auditabilitas fisik.',
      challenge: 'Foto rak/area kabel di tempatmu. Nilai 1–10 kerapihannya. Apa 3 perbaikan termurah yang bisa dilakukan?',
      interviewQ: 'Q: "Apa beda kabel stranded dan solid, kapan masing-masing dipakai?" — A: Stranded (serabut): fleksibel, untuk patch cord yang sering bergerak/ditekuk. Solid (pejal): performa lebih baik untuk jarak jauh, untuk instalasi permanen di tembok/tray — tapi patah jika sering ditekuk. Jangan tertukar pemakaiannya.',
      quiz: [
        { q: 'Patch cord memakai konduktor stranded karena…', options: ['Lebih murah', 'Fleksibel & tahan ditekuk berulang', 'Lebih cepat', 'Tanpa alasan'], answer: 1, explain: 'Patch cord bergerak/ditekuk — stranded tidak patah seperti solid.' },
        { q: 'Praktik yang SALAH adalah…', options: ['Kode warna per fungsi', 'Memakai kabel solid sebagai patch cord harian', 'Panjang secukupnya', 'Label kedua ujung'], answer: 1, explain: 'Solid patah jika sering ditekuk → intermiten misterius.' },
        { q: 'Tujuan cable manager di rak adalah…', options: ['Estetika semata', 'Fitur operasional: tracing cepat & MTTR rendah', 'Pendinginan', 'Keamanan listrik'], answer: 1, explain: 'Kerapian = menemukan kabel dalam 2 menit bukan 45 menit.' },
      ],
    },
    {
      id: '6.14',
      title: 'Keystone',
      body: `<p><b>Keystone jack</b> adalah <b>modul konektor betina</b> kecil yang dipasang di <b>wall plate</b> (stop kontak jaringan di dinding) atau patch panel — tempat patch cord dicolokkan. Ia adalah "stop kontak"-nya jaringan.</p>
<h3>Cara Kerja: Punch Down</h3>
<pre>Keystone jack (tampak belakang):
  ┌─ 8 slot IDC dengan kode warna A/B ─┐
  │  Kabel solid dari tembok ditekan    │
  │  masuk dengan punch-down tool →     │
  │  pisau logam menusuk isolasi kabel  │
  │  = kontak listrik tanpa kupas!      │
  └─────────────────────────────────────┘
  Depan: port RJ45 betina → colok patch cord</pre>
<p><b>Mengapa punch-down, bukan krimping?</b> Koneksi IDC (<i>insulation displacement</i>) lebih andal untuk kabel solid permanen: kontak gas-tight, tahan puluhan tahun, dan bisa di-re-terminate. Krimping untuk patch cord (stranded); punch-down untuk instalasi (solid) — <b>pasangan yang tepat</b>.</p>
<h3>Tips Instalasi</h3>
<ul>
<li>Ikuti <b>kode warna A/B</b> yang tercetak di jack — samakan dengan standar site.</li>
<li>Jaga pilinan sampai <b>dekat titik terminasi</b> (aturan 13 mm berlaku juga!).</li>
<li>Pakai keystone <b>sesuai kategori</b> kabel (Cat6 jack untuk kabel Cat6) — jack murah = bottleneck performa.</li>
<li>Labeli wall plate sesuai nomor di patch panel (<i>port mapping</i>).</li>
</ul>`,
      terms: [
        ['Keystone jack', 'Modul konektor RJ45 betina untuk wall plate/patch panel.'],
        ['Punch-down', 'Teknik terminasi: kabel ditekan ke pisau IDC tanpa dikupas.'],
        ['IDC', 'Insulation Displacement Contact — kontak yang menusuk isolasi kabel.'],
        ['Wall plate', 'Pelat dinding tempat keystone jack dipasang (stop kontak jaringan).'],
      ],
      scenario: 'Kantor baru: 100 titik wall plate. Kontraktor memakai keystone Cat5e untuk kabel Cat6 "agar hemat" — hasil uji sertifikasi: semua titik gagal Cat6. Ganti 100 keystone = 2 hari kerja + biaya. Pelajaran: rantai kategori harus utuh — kabel, jack, patch cord, panel.',
      bestPractices: 'Samakan kategori SEMUA komponen (kabel = jack = patch cord = panel). Satu komponen di bawah = seluruh channel turun kelas.',
      security: 'Wall plate tanpa label di ruang publik = port anonim yang bisa dipakai siapa saja — labeli dan matikan port tak terpakai di switch.',
      challenge: 'Cari wall plate jaringan terdekat. Apakah ada label nomornya? Bisakah kamu melacaknya ke patch panel? Jika tidak — itulah utang dokumentasi.',
      interviewQ: 'Q: "Apa itu keystone jack dan mengapa memakai punch-down?" — A: Modul konektor RJ45 betina di wall plate/patch panel. Terminasi dengan punch-down (pisau IDC menusuk isolasi) — lebih andal & tahan lama untuk kabel solid permanen dibanding krimping, yang diperuntukkan patch cord stranded.',
      quiz: [
        { q: 'Keystone jack dipasang di…', options: ['Ujung patch cord', 'Wall plate / patch panel sebagai konektor betina', 'Dalam switch', 'Di kabel fiber'], answer: 1, explain: 'Ia adalah "stop kontak" jaringan di dinding/panel.' },
        { q: 'Teknik terminasi keystone adalah…', options: ['Krimping', 'Punch-down (pisau IDC menusuk isolasi)', 'Solder', 'Lem'], answer: 1, explain: 'IDC = kontak gas-tight yang andal untuk kabel solid permanen.' },
        { q: 'Memakai keystone Cat5e pada kabel Cat6 berakibat…', options: ['Tidak masalah', 'Seluruh channel turun ke spesifikasi komponen terendah (Cat5e)', 'Lebih cepat', 'Lebih murah aman'], answer: 1, explain: 'Rantai kategori: yang terlemah menentukan.' },
      ],
    },
    {
      id: '6.15',
      title: 'Patch Panel',
      body: `<p><b>Patch panel</b> adalah <b>panel 19-inch berisi 24/48 port keystone</b> di rak server — tempat <b>semua kabel dari tembok bermuara</b>. Ia adalah "terminal bus" jaringan: kabel permanen masuk dari belakang (punch-down), patch cord keluar dari depan ke switch.</p>
<h3>Alur Kabel Lengkap (End-to-End)</h3>
<pre>[PC] ─patch cord─▶ [Wall plate/keystone] ═kabel solid di tembok═▶
[Patch panel (punch-down belakang)] ─patch cord─▶ [Switch]</pre>
<h3>Mengapa Tidak Langsung ke Switch?</h3>
<ul>
<li><b>Fleksibilitas:</b> pindah user antar-switch/VLAN = pindah patch cord 30 detik, tanpa tarik kabel tembok.</li>
<li><b>Perlindungan:</b> colok-cabut terjadi di patch cord murah — bukan di kabel tembok mahal & port switch.</li>
<li><b>Dokumentasi:</b> panel bernomor = peta jelas "port 17 = ruang 3A".</li>
<li><b>Kerapian & serviceability:</b> rak tertata, tracing cepat.</li>
</ul>
<h3>Standar Penomoran & Label</h3>
<p>Ikuti <b>TIA-606</b> (standar administrasi infrastruktur): setiap port panel, wall plate, dan kabel <b>berlabel unik dan terdokumentasi</b> — mis. <code>PP1-17 → R3A-WP02</code> (patch panel 1 port 17 ke ruang 3A wall plate 2). <b>Alasan:</b> tanpa label, 48 kabel identik = tebak-tebakan; dengan label, teknisi baru pun bisa bekerja.</p>
<div class="callout blue"><div class="t">Menutup Part 06</div><p style="margin:4px 0 0">Kamu kini memahami seluruh rantai Layer 1 tembaga: <b>kabel (UTP/STP/FTP/SFTP) → kategori (5e/6/6A) → konektor (RJ45) → standar (T568A/B) → patch cord → keystone → patch panel</b>. Rantai ini adalah fondasi fisik semua yang dibangun di Part 08+. Selanjutnya: Part 07 — Fiber Optic, media untuk jarak jauh & kecepatan tinggi.</p></div>`,
      terms: [
        ['Patch panel', 'Panel 24/48 port di rak; muara kabel tembok (punch-down) ke switch (patch cord).'],
        ['TIA-606', 'Standar administrasi & pelabelan infrastruktur telekomunikasi.'],
        ['Port mapping', 'Dokumentasi pemetaan port panel ↔ lokasi wall plate.'],
      ],
      diagram: `<pre>        ALUR KABEL LENGKAP (horizontal cabling)

   [PC] -stranded- [Keystone] ═solid 90m═ [Patch Panel] -stranded- [Switch]
         patch cord  wall plate   di tembok   punch-down   patch cord
         (bergerak)              (diam)       (fleksibel)  (fleksibel)

   Aturan: yang bergerak = stranded · yang diam = solid</pre>`,
      scenario: 'Audit site baru: 48 port patch panel tanpa label sama sekali. Untuk memindahkan satu user, teknisi harus tone-and-probe 48 kabel (2 jam). Setelah pelabelan TIA-606 + dokumentasi port mapping, pekerjaan yang sama = 5 menit. Label murah mengalahkan alat mahal.',
      bestPractices: 'Labeli KEDUA ujung setiap kabel + dokumentasikan port mapping di spreadsheet/Git. Standar TIA-606 bukan birokrasi — ia penghemat waktu.',
      security: 'Port patch panel yang tidak terpakai: cabut patch cord-nya dan matikan port di switch — port "terbuka" yang terhubung ke ruangan kosong = pintu masuk fisik.',
      challenge: 'Buat skema penomoran TIA-606 sederhana untuk 12 titik di rumah/kantormu. Tulis format labelnya + contoh 3 titik.',
      interviewQ: 'Q: "Mengapa memakai patch panel, tidak langsung kabel tembok ke switch?" — A: Fleksibilitas (pindah port 30 detik), perlindungan (colok-cabut di patch cord murah), dokumentasi (panel bernomor = peta jelas), dan kerapian/serviceability rak.',
      quiz: [
        { q: 'Fungsi utama patch panel adalah…', options: ['Pengganti switch', 'Titik terminasi terpusat kabel tembok → fleksibel di-patch ke switch', 'Penguat sinyal', 'Router kecil'], answer: 1, explain: 'Muara kabel permanen; fleksibilitas via patch cord.' },
        { q: 'Standar pelabelan infrastruktur telekomunikasi adalah…', options: ['TIA-606', 'IEEE 802.3', 'RFC 1918', 'ISO 9001'], answer: 0, explain: 'TIA-606 = administrasi & pelabelan infrastruktur.' },
        { q: 'Port patch panel tak terpakai yang tetap terhubung sebaiknya…', options: ['Dibiarkan', 'Dicabut patch cord-nya & port dimatikan di switch (keamanan fisik)', 'Diberi kabel panjang', 'Dijadikan cadangan tanpa catat'], answer: 1, explain: 'Port terbuka ke ruang kosong = pintu masuk; matikan & dokumentasikan.' },
      ],
    },
  ],
};
