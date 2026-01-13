# Habitify - Platform Manajemen Pribadi

Platform web untuk mengelola berbagai aspek kehidupan sehari-hari dengan tujuan meningkatkan produktivitas, konsistensi, dan keseimbangan hidup.

## Teknologi

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: Vue.js 3 + Vite
- **Database**: SQLite (default) - Lihat [DATABASE_INFO.md](DATABASE_INFO.md) untuk informasi lengkap
- **Authentication**: Laravel Sanctum

## Fitur

### Modul 1: Dashboard Manajemen Tugas & Target
- Manajemen tugas harian, mingguan, dan bulanan
- Tracking progres tugas
- Target bulanan/tahunan
- Filter berdasarkan kategori

### Modul 2: Dashboard Manajemen Keuangan Pribadi
- Tracking pemasukan dan pengeluaran
- Manajemen anggaran
- Tracking tabungan dan investasi
- Laporan keuangan

### Modul 3: Dashboard Produktivitas & Waktu
- Tracking waktu aktivitas
- Penjadwalan kegiatan
- Timer Pomodoro
- Visualisasi distribusi waktu

### Modul 4: Dashboard Manajemen Kebiasaan & Streak
- Tracking kebiasaan
- Streak counter
- Target kebiasaan
- Visualisasi streak

### Modul 5: Dashboard Penyimpanan (Notes, Files, Links)
- Manajemen catatan
- Upload dan penyimpanan file
- Manajemen link/bookmark
- Kategori dan pencarian

### Modul 6: Dashboard Resep Makanan
- Manajemen resep
- Bahan-bahan resep
- Daftar belanja
- Resep favorit

## Instalasi

### Backend (Laravel)

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy file .env:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Setup database di `.env` (sudah dikonfigurasi untuk MySQL):

**MySQL (Default - Sudah dikonfigurasi):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=habitify
DB_USERNAME=root
DB_PASSWORD=
```

**Langkah selanjutnya untuk MySQL:**
1. Pastikan MySQL service sudah running (XAMPP/WAMP/MySQL Server)
2. Buat database MySQL:
   ```sql
   CREATE DATABASE habitify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Update `DB_PASSWORD` di `.env` jika MySQL Anda menggunakan password
4. Jalankan migrations: `php artisan migrate`

> **Note**: Lihat file [SETUP_MYSQL.md](SETUP_MYSQL.md) untuk panduan lengkap setup MySQL

6. Jalankan migrations:
```bash
php artisan migrate
```

7. Jalankan server development:
```bash
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### Frontend (Vue.js)

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy file .env:
```bash
cp .env.example .env
```

4. Pastikan `VITE_API_URL` di `.env` mengarah ke backend API:
```env
VITE_API_URL=http://localhost:8000/api
```

5. Jalankan server development:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Struktur Proyek

```
Lifesync/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/             # Vue.js Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   ├── services/
│   │   └── router/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (protected)
- `GET /api/user` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks/{id}` - Get task (protected)
- `PUT /api/tasks/{id}` - Update task (protected)
- `DELETE /api/tasks/{id}` - Delete task (protected)

### Targets
- `GET /api/targets` - Get all targets (protected)
- `POST /api/targets` - Create target (protected)
- `GET /api/targets/{id}` - Get target (protected)
- `PUT /api/targets/{id}` - Update target (protected)
- `DELETE /api/targets/{id}` - Delete target (protected)

### Financial Transactions
- `GET /api/financial-transactions` - Get all transactions (protected)
- `POST /api/financial-transactions` - Create transaction (protected)
- `GET /api/financial-transactions/{id}` - Get transaction (protected)
- `PUT /api/financial-transactions/{id}` - Update transaction (protected)
- `DELETE /api/financial-transactions/{id}` - Delete transaction (protected)

### Budgets
- `GET /api/budgets` - Get all budgets (protected)
- `POST /api/budgets` - Create budget (protected)
- `GET /api/budgets/{id}` - Get budget (protected)
- `PUT /api/budgets/{id}` - Update budget (protected)
- `DELETE /api/budgets/{id}` - Delete budget (protected)

### Savings
- `GET /api/savings` - Get all savings (protected)
- `POST /api/savings` - Create saving (protected)
- `GET /api/savings/{id}` - Get saving (protected)
- `PUT /api/savings/{id}` - Update saving (protected)
- `DELETE /api/savings/{id}` - Delete saving (protected)

### Time Trackings
- `GET /api/time-trackings` - Get all time trackings (protected)
- `POST /api/time-trackings` - Create time tracking (protected)
- `GET /api/time-trackings/{id}` - Get time tracking (protected)
- `PUT /api/time-trackings/{id}` - Update time tracking (protected)
- `DELETE /api/time-trackings/{id}` - Delete time tracking (protected)

### Schedules
- `GET /api/schedules` - Get all schedules (protected)
- `POST /api/schedules` - Create schedule (protected)
- `GET /api/schedules/{id}` - Get schedule (protected)
- `PUT /api/schedules/{id}` - Update schedule (protected)
- `DELETE /api/schedules/{id}` - Delete schedule (protected)

### Habits
- `GET /api/habits` - Get all habits (protected)
- `POST /api/habits` - Create habit (protected)
- `GET /api/habits/{id}` - Get habit (protected)
- `PUT /api/habits/{id}` - Update habit (protected)
- `DELETE /api/habits/{id}` - Delete habit (protected)

### Habit Logs
- `GET /api/habits/{habit}/logs` - Get habit logs (protected)
- `POST /api/habits/{habit}/logs` - Create habit log (protected)
- `GET /api/habits/{habit}/logs/{log}` - Get habit log (protected)
- `PUT /api/habits/{habit}/logs/{log}` - Update habit log (protected)
- `DELETE /api/habits/{habit}/logs/{log}` - Delete habit log (protected)

### Notes
- `GET /api/notes` - Get all notes (protected)
- `POST /api/notes` - Create note (protected)
- `GET /api/notes/{id}` - Get note (protected)
- `PUT /api/notes/{id}` - Update note (protected)
- `DELETE /api/notes/{id}` - Delete note (protected)

### Files
- `GET /api/files` - Get all files (protected)
- `POST /api/files/upload` - Upload file (protected)
- `GET /api/files/{id}` - Get file (protected)
- `DELETE /api/files/{id}` - Delete file (protected)

### Links
- `GET /api/links` - Get all links (protected)
- `POST /api/links` - Create link (protected)
- `GET /api/links/{id}` - Get link (protected)
- `PUT /api/links/{id}` - Update link (protected)
- `DELETE /api/links/{id}` - Delete link (protected)

### Recipes
- `GET /api/recipes` - Get all recipes (protected)
- `POST /api/recipes` - Create recipe (protected)
- `GET /api/recipes/{id}` - Get recipe (protected)
- `PUT /api/recipes/{id}` - Update recipe (protected)
- `DELETE /api/recipes/{id}` - Delete recipe (protected)

## Development

### Menjalankan Backend
```bash
cd backend
php artisan serve
```

### Menjalankan Frontend
```bash
cd frontend
npm run dev
```

### Build Production
```bash
cd frontend
npm run build
```

## Catatan

- Pastikan backend API sudah berjalan sebelum menjalankan frontend
- Semua endpoint API (kecuali register dan login) memerlukan authentication token
- Token akan disimpan di localStorage dan dikirim sebagai Bearer token di header Authorization
- CORS sudah dikonfigurasi untuk mengizinkan request dari frontend

## License

MIT

