# Deployment Guide - Frontend di Vercel

## Konfigurasi Environment Variable

Agar frontend dapat terhubung ke backend API yang di-deploy di cPanel, Anda perlu mengatur environment variable di Vercel.

### Langkah-langkah:

1. **Login ke Vercel Dashboard**
   - Buka https://vercel.com
   - Login ke akun Anda

2. **Pilih Project**
   - Klik pada project `26-step` (atau nama project Anda)

3. **Buka Settings**
   - Klik tab **Settings** di bagian atas

4. **Environment Variables**
   - Scroll ke bagian **Environment Variables**
   - Klik **Add New**

5. **Tambahkan Variable**
   - **Name**: `VITE_API_URL`
   - **Value**: URL backend API Anda di cPanel (contoh: `https://yourdomain.com/api` atau `https://api.yourdomain.com/api`)
   - **Environment**: Pilih **Production**, **Preview**, dan **Development** (atau minimal **Production**)

6. **Save**
   - Klik **Save**

7. **Redeploy**
   - Setelah menyimpan, Vercel akan otomatis melakukan redeploy
   - Atau Anda bisa klik **Deployments** → Pilih deployment terbaru → **Redeploy**

### Contoh Value:

```
# Jika backend di subdomain
https://api.yourdomain.com/api

# Jika backend di path
https://yourdomain.com/api

# Pastikan menggunakan HTTPS dan path /api di akhir
```

### Catatan Penting:

- ✅ Pastikan backend API sudah dapat diakses dari internet (bukan localhost)
- ✅ Pastikan backend sudah mengizinkan CORS dari domain Vercel Anda
- ✅ Setelah set environment variable, tunggu deployment selesai
- ✅ Cek di browser console apakah masih ada error `ERR_CONNECTION_REFUSED`

### Troubleshooting:

Jika masih error setelah set environment variable:
1. Pastikan value sudah benar (dengan `/api` di akhir)
2. Cek apakah backend dapat diakses langsung di browser
3. Cek CORS settings di backend Laravel
4. Clear cache browser dan coba lagi
