import PageMeta from "../common/PageMeta";
import { GridIcon, TimeIcon, FileIcon, CalenderIcon, InfoIcon, CheckCircleIcon, PlusIcon } from "../../icons";

export default function ProductivityGuide() {
  return (
    <>
      <PageMeta title="Panduan Productivity & Time - Lifesync" description="Panduan pengguna untuk modul Productivity & Time" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Panduan Productivity & Time
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Alur singkat untuk menggunakan fitur fokus (Pomodoro), pencatatan waktu (Reports), dan perencanaan (Schedule).
        </p>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <InfoIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Gambaran Umum</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Modul ini membantu Anda meningkatkan produktivitas dengan 3 hal: <strong className="text-gray-900 dark:text-white">fokus</strong>,{" "}
            <strong className="text-gray-900 dark:text-white">pencatatan waktu</strong>, dan{" "}
            <strong className="text-gray-900 dark:text-white">jadwal</strong>.
          </p>
        </section>

        {/* Step 1 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <GridIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Dashboard</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Melihat ringkasan waktu hari ini dan minggu ini.</li>
            <li>Melihat agenda yang akan datang hari ini.</li>
            <li>Melihat beberapa time logs terbaru.</li>
          </ul>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-brand-100 p-2 dark:bg-brand-500/20">
              <TimeIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Pomodoro (Fokus)</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Gunakan timer untuk fokus, dan session akan tersimpan ke time logs.</p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                Atur <strong className="text-gray-900 dark:text-white">Activity</strong> dan{" "}
                <strong className="text-gray-900 dark:text-white">Category</strong>.
              </li>
              <li>
                Klik <strong className="text-gray-900 dark:text-white">Start</strong> untuk memulai fokus.
              </li>
              <li>
                Saat selesai, focus session otomatis masuk ke <strong className="text-gray-900 dark:text-white">Reports</strong>.
              </li>
            </ul>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 dark:bg-yellow-500/10 dark:border-yellow-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-yellow-700 dark:text-yellow-400">Tips:</strong> gunakan Category yang konsisten (mis. Focus/Study/Work) agar laporan lebih rapi.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <FileIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Reports (Time Logs)</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Gunakan search + filter category + range tanggal.</li>
            <li>Tambah entry manual dengan tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> Add Entry</span>.</li>
            <li>Edit / Delete entry via tombol opsi (⋯).</li>
          </ul>
        </section>

        {/* Step 4 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <CalenderIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Schedule</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Buat time block sederhana (start & end time).</li>
            <li>Tandai selesai dengan toggle checklist.</li>
            <li>Edit / Delete via tombol opsi (⋯).</li>
          </ul>
          <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-500/10 dark:border-blue-500/30">
            <div className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Gunakan Schedule untuk “mengunci waktu” fokus Anda — lalu jalankan Pomodoro pada time block tersebut.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

