import PageMeta from "../common/PageMeta";
import { DollarLineIcon, FileIcon, GridIcon, InfoIcon, CheckCircleIcon, PlusIcon } from "../../icons";

export default function FinanceGuide() {
  return (
    <>
      <PageMeta title="Panduan Personal Finance - Lifesync" description="Panduan pengguna untuk modul Personal Finance" />

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
            Modul Personal Finance membantu Anda mencatat pemasukan & pengeluaran, mengatur budget, dan merapikan
            kategori transaksi.
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
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Melihat ringkasan pemasukan, pengeluaran, dan saldo.</li>
            <li>Melihat transaksi terbaru dan budget aktif.</li>
          </ul>
        </section>

        {/* Step 2 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/20">
              <DollarLineIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Transaksi</h2>
          </div>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              Tambahkan transaksi dengan tombol{" "}
              <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                <PlusIcon className="h-4 w-4" /> Tambah Transaksi
              </span>.
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Pilih tipe: income atau expense.</li>
              <li>Isi jumlah, kategori, deskripsi, dan tanggal.</li>
              <li>Edit / Hapus transaksi lewat tombol aksi di daftar.</li>
            </ul>
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
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Buat budget untuk kategori tertentu dengan periode yang jelas.</li>
            <li>Progress budget akan terisi otomatis dari transaksi expense.</li>
            <li>Kelola budget aktif dari daftar Budget.</li>
          </ul>
        </section>

        {/* Step 4 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-500/20">
              <GridIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Kategori</h2>
          </div>
          <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
            <li>Gunakan kategori agar laporan rapi dan mudah dibaca.</li>
            <li>Anda bisa membuat, mengedit, dan menghapus kategori transaksi.</li>
          </ul>
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
            <li>Catat transaksi setiap hari agar data tidak menumpuk.</li>
            <li>Gunakan kategori yang konsisten (mis. Makan, Transport, Tagihan).</li>
            <li>Review budget mingguan untuk kontrol pengeluaran.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
