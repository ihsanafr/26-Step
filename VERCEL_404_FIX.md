# Solusi Error 404 di Vercel - React Router

## Masalah
Setelah redeploy di Vercel, aplikasi tidak bisa dibuka dan muncul error **404: NOT_FOUND** ketika mengakses route seperti `/login`.

## Penyebab
Vercel tidak tahu bahwa ini adalah **Single Page Application (SPA)** yang menggunakan client-side routing. Ketika user mengakses `/login` langsung, Vercel mencari file `/login` yang tidak ada, sehingga return 404.

## Solusi

### File yang Dibutuhkan: `vercel.json`

Saya sudah membuat file `vercel.json` di folder `frontend/` yang akan:
- Redirect semua routes ke `index.html` agar React Router bisa handle routing
- Menambahkan security headers
- Optimize caching untuk static assets

### Langkah-langkah:

1. **File `vercel.json` sudah dibuat** di `frontend/vercel.json`

2. **Commit dan Push ke Git:**
   ```bash
   git add frontend/vercel.json
   git commit -m "Add vercel.json for SPA routing"
   git push
   ```

3. **Vercel akan otomatis redeploy** setelah push

4. **Atau manual redeploy di Vercel:**
   - Buka Vercel Dashboard
   - Pilih project
   - Klik **Deployments**
   - Klik **...** pada deployment terbaru
   - Pilih **Redeploy**

## Verifikasi

Setelah redeploy selesai:

1. **Test root path:**
   - Buka `https://26-step.vercel.app`
   - Seharusnya load dengan benar

2. **Test route langsung:**
   - Buka `https://26-step.vercel.app/login`
   - Seharusnya tidak ada error 404, halaman login muncul

3. **Test route lain:**
   - Buka `https://26-step.vercel.app/dashboard`
   - Seharusnya redirect ke login jika belum auth, atau load dashboard jika sudah auth

## Penjelasan `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- `rewrites`: Mengarahkan semua request ke `index.html`
- React Router akan handle routing di client-side
- Static assets (CSS, JS, images) tetap di-serve langsung karena lebih spesifik

## Troubleshooting

### Masih Error 404?

1. **Pastikan file `vercel.json` ada di root folder `frontend/`:**
   - Path: `frontend/vercel.json`
   - Bukan di root project

2. **Cek Build Output:**
   - Pastikan build menghasilkan folder `dist/` dengan `index.html` di dalamnya
   - Vercel harus dikonfigurasi untuk build dari folder `frontend/`

3. **Cek Vercel Project Settings:**
   - **Root Directory**: Harus `frontend` (jika project monorepo)
   - **Build Command**: `npm run build` atau `yarn build`
   - **Output Directory**: `dist`

4. **Clear Vercel Cache:**
   - Settings → General → Clear Build Cache
   - Redeploy

### Build Error?

1. **Cek Build Logs di Vercel:**
   - Buka deployment → View Function Logs
   - Cek apakah ada error saat build

2. **Test Build Lokal:**
   ```bash
   cd frontend
   npm run build
   ```
   - Pastikan build berhasil tanpa error

## Catatan Penting

- File `vercel.json` harus di root folder yang di-deploy (biasanya `frontend/`)
- Setelah menambahkan `vercel.json`, **harus redeploy** agar konfigurasi aktif
- Vercel akan otomatis detect `vercel.json` dan menggunakan konfigurasinya

---

**Setelah file `vercel.json` di-commit dan Vercel redeploy, aplikasi seharusnya sudah bisa diakses dengan benar.**
