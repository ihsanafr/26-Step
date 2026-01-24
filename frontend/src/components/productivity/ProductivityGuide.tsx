import PageMeta from "../common/PageMeta";
import { GridIcon, TimeIcon, FileIcon, CalenderIcon, InfoIcon, CheckCircleIcon, PlusIcon } from "../../icons";

export default function ProductivityGuide() {
  return (
    <>
      <PageMeta title="Panduan Productivity & Time - 26-step" description="Panduan pengguna untuk modul Productivity & Time" />

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
            Modul Productivity & Time membantu Anda meningkatkan produktivitas dengan 3 fitur utama: <strong className="text-gray-900 dark:text-white">Pomodoro Timer</strong> untuk fokus,{" "}
            <strong className="text-gray-900 dark:text-white">Time Tracking</strong> untuk pencatatan waktu, dan{" "}
            <strong className="text-gray-900 dark:text-white">Schedule</strong> untuk perencanaan jadwal. Dengan kombinasi ketiganya, Anda dapat mengoptimalkan waktu dan produktivitas.
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
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Dashboard menampilkan ringkasan produktivitas dan insight:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Time Today:</strong> Total waktu yang di-track hari ini</li>
              <li><strong className="text-gray-900 dark:text-white">Time This Week:</strong> Total waktu yang di-track minggu ini</li>
              <li><strong className="text-gray-900 dark:text-white">Today's Schedule:</strong> Agenda yang akan datang hari ini</li>
              <li><strong className="text-gray-900 dark:text-white">Recent Time Logs:</strong> Beberapa time logs terbaru untuk monitoring cepat</li>
              <li><strong className="text-gray-900 dark:text-white">Quick Stats:</strong> Statistik produktivitas seperti average session time, total sessions, dll</li>
            </ul>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-brand-100 p-2 dark:bg-brand-500/20">
              <TimeIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Pomodoro (Fokus)</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Menggunakan Pomodoro Timer</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Atur <strong className="text-gray-900 dark:text-white">Activity</strong> (nama aktivitas) dan <strong className="text-gray-900 dark:text-white">Category</strong> (kategori aktivitas)</li>
                <li>Pilih durasi timer (default: 25 menit untuk Pomodoro, bisa diubah)</li>
                <li>Klik <strong className="text-gray-900 dark:text-white">Start</strong> untuk memulai fokus</li>
                <li>Timer akan berjalan dan menampilkan countdown</li>
                <li>Saat timer selesai, session otomatis tersimpan ke <strong className="text-gray-900 dark:text-white">Reports</strong> sebagai time log</li>
                <li>Anda bisa pause, resume, atau stop timer kapan saja</li>
              </ol>
            </div>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 dark:bg-yellow-500/10 dark:border-yellow-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-yellow-700 dark:text-yellow-400">💡 Tips:</strong> Gunakan Category yang konsisten (mis. Focus/Study/Work) agar laporan lebih rapi dan analisis lebih akurat. Kombinasikan dengan Schedule untuk time blocking yang efektif.
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
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Time Logs</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>View Logs:</strong> Lihat semua time logs dengan detail activity, category, duration, dan timestamp</li>
                <li><strong>Search:</strong> Gunakan search bar untuk mencari logs berdasarkan activity atau category</li>
                <li><strong>Filter:</strong> Filter berdasarkan category atau range tanggal untuk analisis lebih spesifik</li>
                <li><strong>Add Manual Entry:</strong> Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> Add Entry</span> untuk menambahkan time log manual (jika lupa start timer)</li>
                <li><strong>Edit:</strong> Klik tombol opsi (⋯) → Edit untuk mengubah activity, category, duration, atau timestamp</li>
                <li><strong>Delete:</strong> Klik tombol opsi (⋯) → Delete untuk menghapus log</li>
                <li><strong>Analytics:</strong> Lihat statistik seperti total time, average session, most active category, dll</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <CalenderIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Schedule</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Schedule</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 w-4" /> New Schedule</span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Title:</strong> Nama/judul schedule (wajib)</li>
                    <li><strong>Description:</strong> Deskripsi tambahan (opsional)</li>
                    <li><strong>Start Time:</strong> Waktu mulai schedule</li>
                    <li><strong>End Time:</strong> Waktu selesai schedule</li>
                    <li><strong>Date:</strong> Tanggal schedule (default: hari ini)</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Schedule</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Schedule</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Mark Complete:</strong> Toggle checklist untuk menandai schedule selesai</li>
                <li><strong>Edit:</strong> Klik tombol opsi (⋯) → Edit untuk mengubah detail schedule</li>
                <li><strong>Delete:</strong> Klik tombol opsi (⋯) → Delete untuk menghapus schedule</li>
                <li><strong>View Calendar:</strong> Lihat semua schedule dalam format calendar untuk overview yang lebih baik</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-500/10 dark:border-blue-500/30">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="text-blue-700 dark:text-blue-400">💡 Best Practice:</strong> Gunakan Schedule untuk "mengunci waktu" fokus Anda — buat time block untuk aktivitas penting, lalu jalankan Pomodoro Timer pada time block tersebut untuk tracking yang lebih akurat.
                </p>
              </div>
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
            <li><strong>Time Blocking:</strong> Buat schedule terlebih dahulu untuk merencanakan hari Anda, lalu gunakan Pomodoro untuk fokus pada setiap time block</li>
            <li><strong>Consistent Categories:</strong> Gunakan kategori yang konsisten untuk time logs agar analisis lebih akurat</li>
            <li><strong>Regular Tracking:</strong> Track waktu secara rutin untuk memahami bagaimana Anda menghabiskan waktu</li>
            <li><strong>Review Reports:</strong> Review time logs secara berkala untuk melihat pola dan mengoptimalkan produktivitas</li>
            <li><strong>Pomodoro Technique:</strong> Gunakan teknik Pomodoro klasik: 25 menit fokus, 5 menit istirahat, ulangi 4 kali lalu istirahat panjang</li>
            <li><strong>Schedule First:</strong> Rencanakan hari Anda dengan Schedule, lalu execute dengan Pomodoro Timer</li>
            <li><strong>Track Everything:</strong> Track semua aktivitas penting untuk mendapatkan insight yang lebih lengkap</li>
          </ul>
        </section>
      </div>
    </>
  );
}

