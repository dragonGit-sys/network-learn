# Network Engineer Virtual Lab — Next.js

Port Next.js (App Router + TypeScript) dari web artifact **Network Engineer
Virtual Lab**: platform belajar networking dari nol sampai enterprise network
virtual (GNS3, MikroTik CHR, FortiGate, VLAN, fiber optic, Zabbix, Grafana,
network automation). Berbahasa Indonesia, mobile-responsive, dan **offline-first**.

Progress belajar (quiz lulus, jawaban, posisi terakhir) tersimpan di
**PostgreSQL lokal** — bukan cloud — sehingga aplikasi tetap jalan penuh saat
offline.

## Prasyarat

- **Node.js 20+** (disarankan LTS terbaru)
- **PostgreSQL lokal**, pilih salah satu:
  - **Opsi A (termudah):** Docker + Docker Compose — database jalan dalam
    container, tanpa install Postgres di sistem.
  - **Opsi B:** PostgreSQL terinstall langsung di laptop (via installer
    EDB / `apt` / `brew` / dsb).

## Install (butuh internet SEKALI)

```bash
npm install
```

Perintah ini mengunduh dependency + meng-generate Prisma Client
(`postinstall` otomatis menjalankan `prisma generate`).

## Setup database lokal

1. **Jalankan PostgreSQL lokal.**

   Opsi A — Docker (file `docker-compose.yml` sudah disediakan):

   ```bash
   docker compose up -d
   ```

   Opsi B — PostgreSQL terinstall manual: pastikan service-nya berjalan,
   lalu buat database:

   ```sql
   CREATE DATABASE network_lab;
   ```

2. **Isi `.env`** (salin dari contoh, sesuaikan bila perlu):

   ```bash
   cp .env.example .env
   ```

   Isi default menunjuk ke instance lokal:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/network_lab"
   ```

   > Jangan arahkan ke cloud DB (Supabase/Neon/dll) — syarat project ini
   > adalah offline-first.

3. **Buat tabel** (sekali saja):

   ```bash
   npx prisma migrate deploy
   # atau: npm run db:push
   ```

## Jalankan offline

Setelah langkah di atas selesai, internet tidak lagi dibutuhkan:

```bash
npm run dev
```

Buka http://localhost:3000 — selesai. Untuk mode production lokal:

```bash
npm run build && npm start
```

> Catatan: bila database sedang tidak jalan, aplikasi tetap bisa dibuka —
> progress otomatis memakai mode cadangan (tersimpan di browser) dengan
> indikator peringatan di sidebar.

## Struktur project

```
app/
  page.tsx              # Beranda: hero, metode belajar, CTA
  kurikulum/page.tsx    # Roadmap 39 part dalam 7 fase (Part 02–39 terkunci)
  part-01/page.tsx      # Viewer interaktif Part 01 (client component)
  api/progress/route.ts # API progress: GET / POST / DELETE
components/
  TopNav.tsx            # Navigasi atas
  PhaseBar.tsx          # Bar 7 fase
  Footer.tsx            # Footer
lib/
  data.ts               # Konten kurikulum (diekstrak faithful dari artifact)
  prisma.ts             # Singleton Prisma Client
  progress.ts           # Tipe + validasi progress
prisma/
  schema.prisma         # Schema: SubbabProgress + AppMeta
  migrations/           # Migrasi SQL (di-commit ke repo)
docker-compose.yml      # PostgreSQL lokal opsional
```

## API progress

| Method | Endpoint       | Fungsi                              |
| ------ | -------------- | ----------------------------------- |
| GET    | `/api/progress`| Muat progress dari database         |
| POST   | `/api/progress`| Simpan `{ passed, answers, current }`|
| DELETE | `/api/progress`| Reset seluruh progress              |

Semua akses storage dibungkus try/catch dan data yang dimuat divalidasi
terhadap struktur quiz sebelum dipakai.

## Push ke GitHub (nanti)

```bash
git remote add origin <url-repo-kamu>
git branch -M main
git push -u origin main
```

Jangan commit file `.env` (sudah di-`.gitignore`) — di server/VPS lain, buat
`.env` sendiri menunjuk ke database lokal di sana.
