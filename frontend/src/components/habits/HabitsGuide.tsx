import React from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  GridIcon,
  ListIcon,
  CheckCircleIcon,
  PlusIcon,
  TimeIcon,
  InfoIcon,
} from "../../icons";

export default function HabitsGuide() {
  return (
    <>
      <PageMeta
        title="Panduan Habits & Streaks - 26-step"
        description="Panduan pengguna untuk modul Habits & Streaks"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Panduan Habits & Streaks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Panduan lengkap untuk menggunakan modul Habits & Streaks.
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
            Modul Habits & Streaks membantu Anda membangun kebiasaan positif dan menjaga konsistensi. 
            Modul ini terdiri dari Dashboard, Habit List, dan Streaks. Dengan tracking harian, Anda dapat 
            membangun streak yang panjang dan mencapai tujuan jangka panjang.
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
            <p>Dashboard menampilkan ringkasan statistik dan kalender streak gabungan:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">Statistik Habit:</strong> Active Habits, Today&apos;s Progress, Average Streak, dan Longest Streak</li>
              <li><strong className="text-gray-900 dark:text-white">Kalender Streak:</strong> Satu kalender yang menampilkan jumlah habits yang completed pada setiap tanggal</li>
              <li><strong className="text-gray-900 dark:text-white">Detail Tanggal:</strong> Klik kotak tanggal untuk melihat daftar habits apa saja yang completed pada hari itu</li>
            </ul>
          </div>
        </section>

        {/* Step 2: Create Habit */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-500/20">
              <PlusIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Membuat Habit Baru</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Langkah-langkah:</h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                <li>Klik tombol <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"><PlusIcon className="w-4 h-4" /> New Habit</span></li>
                <li>Isi formulir:
                  <ul className="ml-4 mt-1 list-disc space-y-1">
                    <li><strong>Habit Name:</strong> Nama habit (contoh: &quot;Olahraga Pagi&quot;, &quot;Baca 30 Menit&quot;)</li>
                    <li><strong>Description:</strong> Deskripsi tambahan (opsional)</li>
                    <li><strong>Icon:</strong> Pilih emoji dari 12 pilihan preset, atau gunakan <strong>Custom Icon</strong> untuk memasukkan emoji/teks sendiri (maks 2 karakter)</li>
                    <li><strong>Color:</strong> Pilih warna dari 7 pilihan preset, atau gunakan <strong>Custom Color</strong> dengan color picker untuk memilih warna bebas (format hex: #RRGGBB)</li>
                    <li><strong>Target Days:</strong> Target hari konsistensi (opsional)</li>
                    <li><strong>Start Date:</strong> Tanggal mulai (default: hari ini)</li>
                  </ul>
                </li>
                <li>Klik <strong>Create Habit</strong></li>
              </ol>
            </div>
          </div>
        </section>

        {/* Step 3: Daily Tracking */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-500/20">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">3. Tracking Harian</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Cara Mark Complete:</h3>
              <ol className="ml-6 list-decimal space-y-2 text-gray-600 dark:text-gray-400">
                <li>Buka <strong>Habit List</strong></li>
                <li>Klik tombol <strong>&quot;Mark Complete for Today&quot;</strong> pada habit card</li>
                <li>Button akan berubah hijau dengan text <strong>&quot;Completed Today! 🎉&quot;</strong></li>
                <li><strong>Current Streak</strong> akan otomatis bertambah!</li>
              </ol>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Completion Calendar:</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
                <li>Setiap habit memiliki <strong>Completion Calendar</strong> sendiri yang menampilkan tanggal-tanggal completion</li>
                <li>Klik pada tanggal di calendar untuk toggle completion (jika habit aktif dan memiliki onDateClick)</li>
                <li>Tanggal yang completed akan ditandai dengan background orange dan icon flame 🔥</li>
                <li>Gunakan navigasi bulan (← Prev / Next →) untuk melihat bulan lain</li>
              </ul>
            </div>
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 dark:bg-yellow-500/10 dark:border-yellow-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-yellow-700 dark:text-yellow-400">💡 Tips:</strong> Lakukan tracking setiap hari 
                pada waktu yang sama untuk membangun rutinitas yang konsisten!
              </p>
            </div>
          </div>
        </section>

        {/* Step 4: Streaks */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-500/20">
              <TimeIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Streaks</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Memahami Streaks:</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong className="text-gray-900 dark:text-white">Current Streak:</strong> Jumlah hari berturut-turut Anda menyelesaikan habit. Akan reset ke 0 jika melewatkan 1 hari</li>
                <li><strong className="text-gray-900 dark:text-white">Longest Streak:</strong> Rekor streak terpanjang yang pernah Anda capai. Tidak akan reset meskipun current streak kembali ke 0</li>
                <li><strong className="text-gray-900 dark:text-white">Kalender Streak:</strong> Kalender gabungan yang menampilkan jumlah habits yang completed pada setiap tanggal. Klik tanggal untuk melihat detail habits yang completed</li>
                <li><strong className="text-gray-900 dark:text-white">Habit Detail Calendar:</strong> Setiap habit memiliki calendar sendiri di halaman detail untuk melihat completion history</li>
              </ul>
            </div>
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 dark:bg-red-500/10 dark:border-red-500/30">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong className="text-red-700 dark:text-red-400">⚠️ Perhatian:</strong> Jika Anda melewatkan satu hari, 
                <strong> Current Streak akan kembali ke 0</strong>, tapi Longest Streak tetap tersimpan sebagai rekor Anda!
              </p>
            </div>
          </div>
        </section>

        {/* Step 5: Manage Habits */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/20">
              <ListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Mengelola Habits</h2>
          </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <ul className="ml-6 list-disc space-y-1">
              <li><strong className="text-gray-900 dark:text-white">View Detail:</strong> Klik tombol <strong>Options</strong> (⋯) → <strong>View</strong> atau klik langsung pada habit card untuk melihat detail lengkap</li>
              <li><strong className="text-gray-900 dark:text-white">Edit:</strong> Klik tombol <strong>Options</strong> (⋯) → <strong>Edit</strong> untuk mengubah nama, deskripsi, icon, color, target days, atau start date</li>
              <li><strong className="text-gray-900 dark:text-white">Delete:</strong> Klik tombol <strong>Options</strong> (⋯) → <strong>Delete</strong> dan konfirmasi untuk menghapus habit (perhatian: data streak akan hilang)</li>
              <li><strong className="text-gray-900 dark:text-white">Archive:</strong> Edit habit dan uncheck &quot;Active habit&quot; untuk archive tanpa menghapus data. Habit yang di-archive tidak akan muncul di dashboard</li>
              <li><strong className="text-gray-900 dark:text-white">Search:</strong> Gunakan kolom search di bagian atas untuk mencari habit berdasarkan nama atau deskripsi</li>
              <li><strong className="text-gray-900 dark:text-white">View Modes:</strong> Toggle antara <strong>Grid View</strong> (kartu) dan <strong>List View</strong> (daftar) untuk preferensi tampilan</li>
            </ul>
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
            <li>Mulai dari kecil - Jangan langsung membuat terlalu banyak habit. Mulai dengan 2-3 habit yang paling penting</li>
            <li>Be Specific - Buat habit yang spesifik dan terukur. Contoh: &quot;Baca 30 menit&quot; lebih baik dari &quot;Baca buku&quot;</li>
            <li>Konsistensi &gt; Perfection - Lebih baik melakukan habit 10 menit setiap hari, daripada 2 jam sekali seminggu</li>
            <li>Track Every Day - Jadikan tracking habit sebagai rutinitas harian. Pilih waktu yang sama setiap hari untuk check-in</li>
            <li>Celebrate Milestones - Rayakan achievement Anda! Ketika mencapai streak 7, 30, atau 100 hari, beri reward pada diri sendiri</li>
            <li>Don&apos;t Break the Chain - Visual dari streak yang panjang akan memotivasi Anda untuk terus konsisten</li>
            <li>Gunakan kalender tracking untuk melihat pola dan konsistensi Anda secara visual</li>
          </ul>
        </section>
      </div>
    </>
  );
}
