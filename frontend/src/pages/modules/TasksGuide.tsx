import React from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  GridIcon,
  ListIcon,
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashBinIcon,
  InfoIcon,
  TagIcon,
  TargetIcon,
  EyeIcon,
} from "../../icons";

export default function TasksGuide() {
  return (
    <>
      <PageMeta
        title="Panduan Tasks & Targets - 26-step"
        description="Panduan pengguna untuk modul Tasks & Targets"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Panduan Tasks & Targets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panduan lengkap untuk menggunakan modul Tasks & Targets.
        </p>
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <GridIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gambaran Umum</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Modul Tasks & Targets membantu Anda mengelola tugas harian dan mencapai target yang telah ditetapkan. 
            Modul ini terdiri dari Dashboard, Target & Goals, Kategori, dan Daftar Tugas.
          </p>
        </section>

        {/* Step 1: Dashboard */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <InfoIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Dashboard</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Dashboard menampilkan ringkasan statistik dan insight penting:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Statistik Tugas:</strong> Total, Completed, In Progress, Pending, dan Completion Rate</li>
              <li><strong className="text-gray-900 dark:text-white">Statistik Target:</strong> Total, Active, Completed, Paused, dan Average Progress</li>
              <li><strong className="text-gray-900 dark:text-white">Quick Insights:</strong> Overdue Tasks, Upcoming (7 days), High Priority, Active Targets</li>
              <li><strong className="text-gray-900 dark:text-white">Sections:</strong> Upcoming Tasks, Overdue Tasks, Tasks by Priority, Active Targets & Goals</li>
            </ul>
          </div>
        </section>

        {/* Step 2: Target & Goals */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <TargetIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Target & Goals</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Target</h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> New Target</span></li>
                <li>Isi formulir: Judul, Deskripsi, Nilai Target, Periode (Daily/Weekly/Monthly/Yearly), Status, dan Tanggal</li>
                <li>Klik <strong>Create Target</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Detail Target</h3>
              <p className="mb-2 text-gray-600 dark:text-gray-400">
                Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><EyeIcon className="w-4 h-4" /> View</span> atau judul target untuk melihat:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li>Informasi lengkap target dan progress bar</li>
                <li>Daftar semua tugas terkait</li>
                <li>Tombol untuk menambahkan tugas baru langsung ke target</li>
                <li>Kemampuan mengedit dan menghapus tugas dari halaman detail</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Fitur Lainnya</h3>
              <ul className="ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>Pencarian:</strong> Cari target berdasarkan judul atau deskripsi</li>
                <li><strong>Filter Status:</strong> Filter berdasarkan status (All Status, Active, Paused, Completed)</li>
                <li><strong>Progress Bar:</strong> Warna berubah berdasarkan progress (Merah &lt;50%, Kuning 50-75%, Biru 75-99%, Hijau ≥100%)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3: Categories */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
              <TagIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Kategori (Opsional)</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Kategori membantu mengorganisir tugas. Modul menyediakan 6 kategori default:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>💼 Pekerjaan (Work), 🏠 Pribadi (Personal), 💪 Kesehatan (Health), 📚 Pembelajaran (Learning), 🛒 Belanja (Shopping), 👨‍👩‍👧‍👦 Keluarga (Family)</li>
            </ul>
            <p className="mt-2">Anda juga dapat membuat kategori kustom dengan ikon emoji dan warna unik.</p>
          </div>
        </section>

        {/* Step 4: Tasks */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <ListIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Daftar Tugas</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Tugas</h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> New Task</span></li>
                <li>Isi formulir: Judul, Deskripsi, Kategori, Prioritas, Status, <strong>Target</strong> (pilih target terkait), Tanggal Jatuh Tempo, dan Progress</li>
                <li>Klik <strong>Create Task</strong></li>
              </ol>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Tugas</h3>
              <ul className="ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>Edit:</strong> Klik ikon <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"><PencilIcon className="w-4 h-4" /></span> pada tugas</li>
                <li><strong>Delete:</strong> Klik ikon <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-sm text-red-700 dark:bg-red-500/20 dark:text-red-400"><TrashBinIcon className="w-4 h-4" /></span> dan konfirmasi</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Tampilan</h3>
              <p className="mb-2 text-gray-600 dark:text-gray-400">Terdapat 3 mode tampilan:</p>
              <ul className="ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>List View:</strong> Tampilan daftar vertikal dengan detail lengkap</li>
                <li><strong>Grid View:</strong> Tampilan kartu dalam grid 2-3 kolom</li>
                <li><strong>Kanban View:</strong> Papan Kanban dengan 4 kolom status (To Do, On Progress, On Hold, Finish). Drag & drop untuk mengubah status</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Filter & Pencarian</h3>
              <ul className="ml-6 list-disc space-y-1 text-gray-600 dark:text-gray-400">
                <li><strong>Pencarian:</strong> Cari tugas berdasarkan judul atau deskripsi</li>
                <li><strong>Filter Status:</strong> Filter berdasarkan status (All, To Do, On Progress, On Hold, Finish)</li>
                <li><strong>Filter Kategori:</strong> Filter berdasarkan kategori</li>
              </ul>
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
            <li>Buat target terlebih dahulu, kemudian hubungkan tugas dengan target untuk tracking yang lebih terorganisir</li>
            <li>Gunakan kategori untuk mengelompokkan tugas yang serupa</li>
            <li>Tetapkan prioritas untuk membantu menentukan urutan pengerjaan</li>
            <li>Perbarui progress dan status tugas secara berkala</li>
            <li>Gunakan tanggal jatuh tempo untuk mengingatkan deadline penting</li>
            <li>Manfaatkan Kanban view untuk visualisasi yang lebih baik dan drag & drop yang mudah</li>
            <li>Tinjau dashboard secara berkala untuk melihat insight dan tetap on track</li>
            <li>Gunakan Quick Insights untuk melihat tugas yang perlu perhatian segera</li>
          </ul>
        </section>
      </div>
    </>
  );
}
