# Setup Vercel Environment Variable - SOLUSI MASALAH CONNECTION REFUSED

## Masalah
Frontend masih mencoba connect ke `localhost:8000` karena environment variable belum di-set di Vercel.

## Solusi

### Langkah 1: Login ke Vercel Dashboard
1. Buka https://vercel.com
2. Login ke akun Anda

### Langkah 2: Pilih Project
1. Klik pada project **26-step** (atau nama project Anda)

### Langkah 3: Buka Settings
1. Klik tab **Settings** di bagian atas halaman

### Langkah 4: Tambahkan Environment Variable
1. Scroll ke bagian **Environment Variables**
2. Klik tombol **Add New** atau **Add**

### Langkah 5: Isi Environment Variable
**Name:**
```
VITE_API_URL
```

**Value:**
```
https://26-step.ihsanafr.my.id/api
```

**PENTING:** 
- Pastikan ada `/api` di akhir URL
- Gunakan `https://` (bukan `http://`)
- Jangan ada spasi di awal atau akhir

**Environment:**
- ✅ Centang **Production**
- ✅ Centang **Preview** (opsional, tapi disarankan)
- ❌ **Development** tidak perlu (untuk local development)

### Langkah 6: Save
1. Klik **Save**

### Langkah 7: Redeploy
Setelah menyimpan environment variable, Vercel akan **otomatis melakukan redeploy**. 

**Atau manual redeploy:**
1. Klik tab **Deployments**
2. Klik **...** (three dots) pada deployment terbaru
3. Pilih **Redeploy**
4. Tunggu sampai deployment selesai (biasanya 1-2 menit)

### Langkah 8: Verifikasi
1. Buka aplikasi di `https://26-step.vercel.app`
2. Buka **Developer Tools** (F12)
3. Buka tab **Console**
4. Cek apakah masih ada error `ERR_CONNECTION_REFUSED` ke `localhost:8000`
5. Jika sudah tidak ada error, coba login

## Troubleshooting

### Masih Error?
1. **Pastikan URL benar:**
   - ✅ `https://26-step.ihsanafr.my.id/api`
   - ❌ `https://26-step.ihsanafr.my.id` (tanpa /api)
   - ❌ `http://26-step.ihsanafr.my.id/api` (pakai http)

2. **Pastikan sudah redeploy:**
   - Environment variable hanya aktif setelah deployment baru
   - Cek di tab Deployments apakah ada deployment baru setelah Anda set variable

3. **Clear browser cache:**
   - Tekan `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
   - Atau buka Incognito/Private window

4. **Cek Network tab:**
   - Buka Developer Tools → Network tab
   - Coba login
   - Lihat request ke API, seharusnya URL-nya adalah `https://26-step.ihsanafr.my.id/api/login`
   - Bukan `localhost:8000/api/login`

5. **Cek apakah backend bisa diakses:**
   - Buka browser, akses: `https://26-step.ihsanafr.my.id/api`
   - Seharusnya muncul response JSON atau error message (bukan connection refused)

### Cek Environment Variable di Vercel
1. Settings → Environment Variables
2. Pastikan `VITE_API_URL` ada di list
3. Pastikan value-nya: `https://26-step.ihsanafr.my.id/api`
4. Pastikan Production sudah di-centang

## Screenshot Reference

Setelah set environment variable dengan benar, di Console seharusnya:
- ✅ Request ke: `https://26-step.ihsanafr.my.id/api/login`
- ❌ TIDAK ada request ke: `localhost:8000/api/login`

## Catatan Penting

1. **Vite Environment Variables:**
   - Harus dimulai dengan `VITE_` agar bisa diakses di frontend
   - Setelah di-set di Vercel, harus **redeploy** agar aktif

2. **Build Time vs Runtime:**
   - Vite environment variables di-inject saat **build time**
   - Jadi harus rebuild/redeploy setelah set environment variable

3. **Multiple Environments:**
   - Production: untuk domain utama
   - Preview: untuk preview deployments (pull requests)
   - Development: untuk local development (tidak perlu set di Vercel)

---

**Setelah mengikuti langkah-langkah di atas, aplikasi seharusnya sudah bisa terhubung ke backend API.**
