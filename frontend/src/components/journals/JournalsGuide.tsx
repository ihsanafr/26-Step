import PageMeta from "../common/PageMeta";
import { GridIcon, FileIcon, PlusIcon, CalenderIcon, ListIcon, InfoIcon, ShootingStarIcon } from "../../icons";

export default function JournalsGuide() {
  return (
    <>
      <PageMeta title="Journals & Notes Guide - 26-step" description="How to use the Journals & Notes module" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">Panduan Journals & Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panduan lengkap untuk menggunakan modul Journals & Notes. Modul ini membantu Anda mencatat refleksi harian, ide-ide cepat, dan mengorganisir catatan penting.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gambaran Umum</h2>
          </div>
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            Modul Journals & Notes terdiri dari dua fitur utama: <strong className="text-gray-900 dark:text-white">Journal Entries</strong> untuk refleksi mendalam dan <strong className="text-gray-900 dark:text-white">Notes</strong> untuk catatan cepat. Gunakan Calendar untuk melihat dan mengakses entri berdasarkan tanggal.
          </p>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-500/10 dark:border-blue-500/30">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-blue-700 dark:text-blue-400">💡 Recommended Flow:</strong> Gunakan <strong>Notes</strong> untuk menangkap ide cepat sepanjang hari, lalu tulis <strong>Journal Entry</strong> untuk refleksi mendalam di akhir hari. Gunakan <strong>Calendar</strong> untuk review dan menemukan entri dengan cepat.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <GridIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Dashboard</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Dashboard menampilkan ringkasan dan akses cepat:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Statistik:</strong> Total Entries, Total Words, Writing Streak, dan Total Notes</li>
              <li><strong className="text-gray-900 dark:text-white">Quick Insights:</strong> Average Words/Entry, Longest Entry, Most Active Day, Top Categories, Top Weather</li>
              <li><strong className="text-gray-900 dark:text-white">Pinned Notes:</strong> Catatan yang di-pin dengan indikator warna dan border kiri</li>
              <li><strong className="text-gray-900 dark:text-white">Recent Notes:</strong> Catatan non-pinned terbaru</li>
              <li><strong className="text-gray-900 dark:text-white">Calendar Grid:</strong> Kalender yang menampilkan indikator untuk hari-hari yang memiliki journal atau note</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <FileIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Journal Entries</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Journal Entry</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <PlusIcon className="h-4 w-4" /> New Entry
                </span> (membuka full page editor)</li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Title:</strong> Judul entry (opsional, default: tanggal)</li>
                    <li><strong>Content:</strong> Isi journal entry (wajib)</li>
                    <li><strong>Mood:</strong> Pilih mood untuk tracking emosi (Happy, Sad, Anxious, Excited, Calm, Angry, Tired, Confused)</li>
                    <li><strong>Weather:</strong> Pilih kondisi cuaca (Sunny, Cloudy, Rainy, Stormy, Snowy, Windy)</li>
                    <li><strong>Category:</strong> Pilih atau buat kategori untuk mengorganisir entries</li>
                    <li><strong>Private Entry:</strong> Centang untuk membuat entry private (hanya Anda yang bisa melihat)</li>
                    <li><strong>Date:</strong> Tanggal entry (default: hari ini)</li>
                  </ul>
                </li>
                <li>Klik <strong>Save Entry</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Journal Entries</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>View:</strong> Klik pada entry untuk melihat detail lengkap</li>
                <li><strong>Edit:</strong> Klik ikon edit pada entry untuk mengubah</li>
                <li><strong>Delete:</strong> Klik ikon delete dan konfirmasi untuk menghapus</li>
                <li><strong>Search:</strong> Gunakan search bar untuk mencari entry berdasarkan title atau content</li>
                <li><strong>Filter:</strong> Filter berdasarkan privacy (All/Public/Private), mood, weather, atau category</li>
                <li><strong>View Modes:</strong> Toggle antara List View dan Grid View</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <CalenderIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Calendar</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Calendar membantu Anda melihat dan mengakses entries berdasarkan tanggal:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Indikator:</strong> Setiap hari yang memiliki journal atau note akan menampilkan badge dengan jumlah</li>
              <li><strong className="text-gray-900 dark:text-white">View Detail:</strong> Klik pada tanggal untuk melihat daftar lengkap journal entries dan notes pada hari tersebut</li>
              <li><strong className="text-gray-900 dark:text-white">Create Entry:</strong> Gunakan tombol "Add for this date" di modal detail untuk membuat entry dengan tanggal yang dipilih</li>
              <li><strong className="text-gray-900 dark:text-white">Navigation:</strong> Gunakan navigasi bulan (← Prev / Next →) untuk melihat bulan lain</li>
              <li><strong className="text-gray-900 dark:text-white">Format Tanggal:</strong> Semua tanggal ditampilkan dalam format Indonesia (tanggal-bulan-tahun, contoh: 20 Januari 2026)</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-500/20">
              <ListIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Notes</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Note</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <PlusIcon className="h-4 w-4" /> New Note
                </span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Title:</strong> Judul note (wajib)</li>
                    <li><strong>Content:</strong> Isi note (opsional)</li>
                    <li><strong>Category:</strong> Pilih atau buat kategori untuk mengorganisir notes</li>
                    <li><strong>Color:</strong> Pilih warna untuk indikator visual (border kiri pada card/list view)</li>
                    <li><strong>Pin Note:</strong> Centang untuk pin note (akan muncul di bagian atas dan dashboard)</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Note</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Notes</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>View:</strong> Klik pada note card untuk melihat detail dalam modal</li>
                <li><strong>Edit:</strong> Klik ikon edit pada note untuk mengubah</li>
                <li><strong>Delete:</strong> Klik ikon delete dan konfirmasi untuk menghapus</li>
                <li><strong>Pin/Unpin:</strong> Edit note dan toggle "Pin Note" untuk pin/unpin. Notifikasi akan muncul di kanan atas saat pin/unpin</li>
                <li><strong>Search:</strong> Gunakan search bar untuk mencari note berdasarkan title atau content</li>
                <li><strong>Filter:</strong> Filter berdasarkan category atau pinned status</li>
                <li><strong>View Modes:</strong> Toggle antara Card View (grid) dan List View (tabel). Keduanya menampilkan color indicator sebagai border kiri</li>
                <li><strong>Pagination:</strong> Navigasi halaman untuk melihat notes lebih banyak. Dapat mengatur jumlah items per halaman</li>
              </ul>
            </div>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 dark:bg-yellow-500/10 dark:border-yellow-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-yellow-700 dark:text-yellow-400">💡 Tips:</strong> Gunakan kategori untuk mengelompokkan notes (Work, Ideas, Personal). Pin notes penting (<ShootingStarIcon className="inline h-4 w-4" />) agar tetap di atas dan mudah diakses.
              </p>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-500/10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tips & Best Practices</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Write Regularly:</strong> Buat kebiasaan menulis journal setiap hari, bahkan jika hanya beberapa kalimat</li>
            <li><strong>Be Honest:</strong> Journal adalah ruang pribadi untuk refleksi jujur. Gunakan private entry untuk hal sensitif</li>
            <li><strong>Use Categories:</strong> Kategorikan entries dan notes untuk memudahkan pencarian dan review</li>
            <li><strong>Track Mood & Weather:</strong> Tracking mood dan weather membantu melihat pola dan konteks emosi Anda</li>
            <li><strong>Quick Capture:</strong> Gunakan Notes untuk menangkap ide cepat, lalu kembangkan menjadi Journal Entry jika perlu</li>
            <li><strong>Review Calendar:</strong> Gunakan calendar untuk melihat pola menulis dan menemukan entries lama dengan mudah</li>
            <li><strong>Pin Important:</strong> Pin notes penting agar selalu mudah diakses dari dashboard</li>
            <li><strong>Use Color Indicators:</strong> Gunakan warna berbeda untuk notes agar mudah dibedakan secara visual</li>
          </ul>
        </section>
      </div>
    </>
  );
}


