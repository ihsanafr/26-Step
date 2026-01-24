import PageMeta from "../common/PageMeta";
import { DollarLineIcon, FileIcon, GridIcon, InfoIcon, CheckCircleIcon, PlusIcon } from "../../icons";

export default function FinanceGuide() {
  return (
    <>
      <PageMeta title="Panduan Personal Finance - 26-step" description="Panduan pengguna untuk modul Personal Finance" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Panduan Personal Finance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Alur singkat untuk mencatat transaksi, mengatur budget, dan mengelola kategori.
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
            Modul Personal Finance membantu Anda mencatat pemasukan & pengeluaran, mengatur budget, mengelola savings, dan merapikan
            kategori transaksi. Dengan fitur laporan dan analisis, Anda dapat memahami pola pengeluaran dan mengoptimalkan keuangan Anda.
          </p>
        </section>

        {/* Step 1 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-500/20">
              <GridIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Dashboard</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Dashboard menampilkan ringkasan keuangan dan insight penting:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Statistik Keuangan:</strong> Total Income, Total Expense, Balance, dan Savings</li>
              <li><strong className="text-gray-900 dark:text-white">Budget Overview:</strong> Daftar budget aktif dengan progress bar dan status</li>
              <li><strong className="text-gray-900 dark:text-white">Recent Transactions:</strong> Transaksi terbaru untuk monitoring cepat</li>
              <li><strong className="text-gray-900 dark:text-white">Quick Insights:</strong> Expense by Category, Monthly Trends, dan Budget Alerts</li>
            </ul>
          </div>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <DollarLineIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Transaksi</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Transaksi</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <PlusIcon className="h-4 w-4" /> Tambah Transaksi
                </span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Type:</strong> Pilih Income (pemasukan) atau Expense (pengeluaran)</li>
                    <li><strong>Amount:</strong> Masukkan jumlah uang (hanya angka)</li>
                    <li><strong>Category:</strong> Pilih kategori yang sesuai, atau buat kategori baru</li>
                    <li><strong>Description:</strong> Deskripsi transaksi (opsional)</li>
                    <li><strong>Date:</strong> Tanggal transaksi (default: hari ini)</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Transaction</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Mengelola Transaksi</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Edit:</strong> Klik ikon edit pada transaksi untuk mengubah detail</li>
                <li><strong>Delete:</strong> Klik ikon delete dan konfirmasi untuk menghapus transaksi</li>
                <li><strong>Filter:</strong> Gunakan filter berdasarkan type (All/Income/Expense), kategori, atau tanggal</li>
                <li><strong>Search:</strong> Cari transaksi berdasarkan deskripsi atau kategori</li>
                <li><strong>Pagination:</strong> Navigasi halaman untuk melihat transaksi lebih banyak</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-500/20">
              <FileIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Budget</h2>
          </div>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Membuat Budget</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  <PlusIcon className="h-4 w-4" /> New Budget
                </span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Name:</strong> Nama budget (contoh: "Budget Makanan Bulan Januari")</li>
                    <li><strong>Category:</strong> Pilih kategori yang akan di-budget</li>
                    <li><strong>Amount:</strong> Jumlah budget yang ditetapkan</li>
                    <li><strong>Period:</strong> Periode budget (Monthly, Weekly, atau Custom)</li>
                    <li><strong>Start Date & End Date:</strong> Tanggal mulai dan akhir budget</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Budget</strong></li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Memahami Budget</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li><strong>Progress Bar:</strong> Menampilkan persentase penggunaan budget. Warna berubah: Hijau (0-75%), Kuning (75-90%), Merah (90-100%)</li>
                <li><strong>Auto-tracking:</strong> Progress budget otomatis terisi dari transaksi expense dengan kategori yang sama</li>
                <li><strong>Status:</strong> Budget bisa Active, Paused, atau Completed</li>
                <li><strong>Edit/Delete:</strong> Klik ikon edit atau delete pada budget untuk mengelola</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
              <GridIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Kategori</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>Kategori membantu mengorganisir transaksi dan membuat laporan yang lebih rapi:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Default Categories:</strong> Modul menyediakan kategori default seperti Food, Transport, Bills, Shopping, dll</li>
              <li><strong>Create Category:</strong> Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                <PlusIcon className="h-4 w-4" /> New Category
              </span> untuk membuat kategori custom dengan nama dan warna</li>
              <li><strong>Edit/Delete:</strong> Klik ikon edit atau delete pada kategori untuk mengelola</li>
              <li><strong>Best Practice:</strong> Gunakan kategori yang konsisten untuk analisis yang lebih akurat</li>
            </ul>
          </div>
        </section>

        {/* Tips */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-500/10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-500/20">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Tips Cepat</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Catat Transaksi Rutin:</strong> Catat setiap transaksi setiap hari agar data tidak menumpuk dan laporan lebih akurat</li>
            <li><strong>Kategori Konsisten:</strong> Gunakan kategori yang konsisten (mis. Makan, Transport, Tagihan) untuk analisis yang lebih baik</li>
            <li><strong>Review Budget:</strong> Review budget secara berkala (mingguan/bulanan) untuk kontrol pengeluaran dan adjust jika perlu</li>
            <li><strong>Monitor Dashboard:</strong> Pantau dashboard secara rutin untuk melihat tren pengeluaran dan pemasukan</li>
            <li><strong>Set Realistic Budget:</strong> Tetapkan budget yang realistis berdasarkan pengeluaran historis Anda</li>
            <li><strong>Use Savings:</strong> Manfaatkan fitur Savings untuk menabung dan mencapai tujuan keuangan</li>
            <li><strong>Analyze Trends:</strong> Gunakan laporan dan insight untuk memahami pola pengeluaran dan mengoptimalkan keuangan</li>
          </ul>
        </section>
      </div>
    </>
  );
}
