import PageMeta from "../common/PageMeta";
import { FolderIcon, FileIcon, InfoIcon, PlusIcon, SearchIcon } from "../../icons";

// Simple Link Icon Component
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export default function StorageGuide() {
  return (
    <>
      <PageMeta title="Storage Guide - 26-step" description="How to use the Storage module" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Panduan Storage</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panduan lengkap untuk menggunakan modul Storage. Modul ini membantu Anda mengorganisir dan mengelola semua aset digital: file, folder, link penting, dan catatan cepat - semuanya dalam satu tempat.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
              <InfoIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gambaran Umum</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Modul Storage terdiri dari 3 fitur utama: <strong className="text-gray-900 dark:text-white">Files</strong> untuk mengelola dokumen dan folder, <strong className="text-gray-900 dark:text-white">Links</strong> untuk menyimpan link penting, dan <strong className="text-gray-900 dark:text-white">Notes</strong> untuk catatan cepat. Semua terorganisir dengan sistem kategori dan pencarian yang powerful.
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Files Management</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Upload & Organize Files</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> Upload Dokumen</span></li>
                <li>Pilih file dari komputer (bisa multiple files sekaligus)</li>
                <li>Isi informasi:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>File Name:</strong> Nama file (bisa diubah dari nama asli)</li>
                    <li><strong>Category:</strong> Pilih atau buat kategori untuk mengorganisir</li>
                    <li><strong>Description:</strong> Deskripsi file (opsional)</li>
                    <li><strong>Folder:</strong> Pilih folder tujuan (opsional, bisa buat folder baru)</li>
                  </ul>
                </li>
                <li>Klik <strong>Upload</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Files & Folders</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Create Folders:</strong> Klik tombol "New Folder" untuk membuat folder. Maksimal 3 level kedalaman untuk menjaga organisasi</li>
                <li><strong>View Modes:</strong> Toggle antara Grid View (kartu) dan List View (daftar) untuk preferensi tampilan</li>
                <li><strong>Preview:</strong> Klik pada file untuk preview (jika didukung format)</li>
                <li><strong>Edit:</strong> Klik tombol opsi (⋯) → Edit untuk mengubah nama, kategori, deskripsi, atau folder</li>
                <li><strong>Download:</strong> Klik tombol opsi (⋯) → Download untuk mengunduh file. Notifikasi konfirmasi akan muncul</li>
                <li><strong>Delete:</strong> Klik tombol opsi (⋯) → Delete untuk menghapus file. Tindakan ini tidak dapat dibatalkan</li>
                <li><strong>Navigate Folders:</strong> Klik pada folder untuk masuk, gunakan breadcrumb untuk kembali</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Search & Filter</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Search:</strong> Gunakan search bar untuk mencari file berdasarkan nama</li>
                <li><strong>Filter Type:</strong> Filter berdasarkan tipe file (All, Document, Image, Video, Audio, Other)</li>
                <li><strong>Filter Category:</strong> Filter berdasarkan kategori untuk menemukan file terkait</li>
                <li><strong>Sort:</strong> Urutkan berdasarkan nama, tanggal upload, atau ukuran</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <LinkIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Links Management</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Link</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> New Link</span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Title:</strong> Judul/nama link (wajib)</li>
                    <li><strong>URL:</strong> Alamat website (wajib, format: https://...)</li>
                    <li><strong>Description:</strong> Deskripsi link (opsional)</li>
                    <li><strong>Category:</strong> Pilih atau buat kategori untuk mengorganisir</li>
                    <li><strong>Tags:</strong> Tambahkan tags untuk pencarian yang lebih mudah (opsional)</li>
                    <li><strong>Favorite:</strong> Centang untuk menandai sebagai favorite</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Link</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Links</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Open Link:</strong> Klik pada link card untuk membuka di tab baru</li>
                <li><strong>Edit:</strong> Klik ikon edit untuk mengubah detail link</li>
                <li><strong>Delete:</strong> Klik ikon delete dan konfirmasi untuk menghapus</li>
                <li><strong>Toggle Favorite:</strong> Klik ikon bintang untuk menandai/unmark favorite. Favorite links akan muncul di bagian atas</li>
                <li><strong>Search:</strong> Gunakan search bar untuk mencari link berdasarkan title, URL, atau description</li>
                <li><strong>Filter:</strong> Filter berdasarkan category atau favorite status</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <FileIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Notes</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Notes di Storage module berbeda dengan Notes di Journals module. Notes di Storage lebih sederhana dan fokus pada catatan cepat:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Create Note:</strong> Klik tombol "New Note" untuk membuat catatan cepat</li>
              <li><strong>Pin Notes:</strong> Pin notes penting agar tetap di atas dan mudah diakses</li>
              <li><strong>Categories:</strong> Organisir notes dengan kategori untuk manajemen yang lebih baik</li>
              <li><strong>Search:</strong> Cari notes berdasarkan title atau content</li>
              <li><strong>Edit/Delete:</strong> Kelola notes dengan mudah melalui tombol edit dan delete</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <SearchIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Tips & Best Practices</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Descriptive Names:</strong> Gunakan nama file yang deskriptif untuk memudahkan pencarian</li>
            <li><strong>Folder Organization:</strong> Buat folder berdasarkan project atau kategori untuk organisasi yang lebih baik</li>
            <li><strong>Regular Cleanup:</strong> Review dan hapus file yang tidak diperlukan secara berkala untuk menghemat storage space</li>
            <li><strong>Consistent Categories:</strong> Gunakan kategori yang konsisten untuk membuat filtering lebih efektif</li>
            <li><strong>Favorite Links:</strong> Tandai link penting sebagai favorite untuk akses cepat</li>
            <li><strong>Preview Before Download:</strong> Preview file sebelum download untuk memastikan file yang benar</li>
            <li><strong>Use Tags:</strong> Manfaatkan tags pada links untuk pencarian yang lebih fleksibel</li>
            <li><strong>Backup Important Files:</strong> Pastikan file penting selalu tersimpan dengan aman</li>
            <li><strong>Organize by Project:</strong> Organisir file berdasarkan project untuk workflow yang lebih efisien</li>
          </ul>
        </section>
      </div>
    </>
  );
}
