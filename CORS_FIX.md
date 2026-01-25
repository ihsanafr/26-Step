# Solusi CORS Error - Backend Laravel

## Masalah
Error CORS: "The 'Access-Control-Allow-Origin' header contains the invalid value ''"

## Penyebab
Backend Laravel tidak mengirim header CORS dengan benar, atau middleware CORS tidak terpasang dengan benar.

## Solusi yang Sudah Diterapkan

### 1. Update CORS Configuration (`backend/config/cors.php`)
- Menambahkan domain Vercel secara spesifik
- Menambahkan pattern untuk preview deployments
- Mengaktifkan `supports_credentials`
- Menambah `max_age` untuk cache preflight requests

### 2. Update .htaccess (`backend/public/.htaccess`)
- Menambahkan CORS headers di level Apache
- Handle preflight OPTIONS requests
- Set headers yang diperlukan untuk CORS

### 3. Update Bootstrap (`backend/bootstrap/app.php`)
- Memastikan HandleCors middleware terpasang di API routes

## Langkah Deploy ke cPanel

Setelah melakukan perubahan di atas:

1. **Upload file yang diubah ke cPanel:**
   - `backend/config/cors.php`
   - `backend/public/.htaccess`
   - `backend/bootstrap/app.php`

2. **Clear Laravel cache (jika ada SSH access):**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

3. **Atau via cPanel File Manager:**
   - Hapus file di `backend/bootstrap/cache/config.php` (jika ada)
   - Hapus file di `backend/storage/framework/cache/data/*` (jika ada)

4. **Test CORS:**
   - Buka browser
   - Akses: `https://26-step.ihsanafr.my.id/api`
   - Buka Developer Tools → Network tab
   - Cek response headers, seharusnya ada:
     - `Access-Control-Allow-Origin: https://26-step.vercel.app`
     - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`
     - `Access-Control-Allow-Headers: Content-Type, Authorization, ...`

## Verifikasi

Setelah deploy, test dari frontend:
1. Buka `https://26-step.vercel.app`
2. Buka Developer Tools → Console
3. Coba login
4. Seharusnya tidak ada lagi error CORS

## Troubleshooting

### Masih Error CORS?

1. **Cek apakah .htaccess sudah ter-upload:**
   - File harus ada di `public/.htaccess`
   - Pastikan tidak ada syntax error

2. **Cek apakah mod_headers enabled di Apache:**
   - Jika tidak, bagian CORS di .htaccess tidak akan bekerja
   - Tapi Laravel CORS middleware seharusnya tetap bekerja

3. **Test dengan curl:**
   ```bash
   curl -H "Origin: https://26-step.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://26-step.ihsanafr.my.id/api/login \
        -v
   ```
   
   Seharusnya response header mengandung:
   ```
   Access-Control-Allow-Origin: https://26-step.vercel.app
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
   ```

4. **Jika masih error, coba allow semua origin sementara:**
   - Di `config/cors.php`, ubah `allowed_origins` kembali ke `['*']`
   - Test apakah berfungsi
   - Jika berfungsi, berarti masalah di pattern matching
   - Kemudian perbaiki pattern-nya

## Catatan

- Perubahan di `.htaccess` hanya bekerja jika server Apache mendukung `mod_headers`
- Laravel CORS middleware adalah solusi utama, `.htaccess` adalah backup
- Pastikan file `.htaccess` tidak di-overwrite saat deploy
