<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/dashboard"
              class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Journal & Notes</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Reflect on your experiences and quick notes</p>
            </div>
          </div>
          <button
            @click="activeTab === 'journals' ? openJournalModal() : openNoteModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ activeTab === 'journals' ? 'New Entry' : 'New Note' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Summary Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Journal Entries</span>
            <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">{{ journals.length }}</p>
          <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">{{ thisMonthEntries }} this month</p>
        </div>

        <div class="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 dark:border-cyan-900/50 dark:from-cyan-900/20 dark:to-cyan-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-cyan-700 dark:text-cyan-400">Notes</span>
            <div class="rounded-lg bg-cyan-200 p-2 dark:bg-cyan-900/50">
              <svg class="h-5 w-5 text-cyan-700 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-cyan-900 dark:text-cyan-300">{{ notes.length }}</p>
          <p class="mt-1 text-xs text-cyan-600 dark:text-cyan-400">{{ summary.pinnedNotes }} pinned</p>
        </div>

        <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Streak</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ currentStreak }}</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">days in a row</p>
        </div>

        <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">This Week</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ thisWeekEntries + thisWeekNotes }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">total entries</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex gap-6">
          <button
            @click="activeTab = 'journals'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'journals'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Journal Entries
          </button>
          <button
            @click="activeTab = 'notes'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Notes
          </button>
        </div>
      </div>

      <!-- Journal Entries Tab -->
      <div v-show="activeTab === 'journals'">
        <!-- Filters -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative flex-1 max-w-md">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="journalSearchQuery"
              type="text"
              placeholder="Search journals..."
              class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <select
            v-model="moodFilter"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Moods</option>
            <option v-for="mood in moods" :key="mood" :value="mood">{{ mood }}</option>
          </select>
          <select
            v-model="dateFilter"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <!-- Journals List -->
        <div v-if="loadingJournals" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredJournals.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No journal entries found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Start writing your first journal entry</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="journal in filteredJournals"
            :key="journal.id"
            class="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ journal.title }}</h3>
                  <span v-if="journal.is_private" class="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    Private
                  </span>
                  <span v-if="journal.mood" class="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {{ journal.mood }}
                  </span>
                </div>
                <p class="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{{ journal.content }}</p>
                <div class="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(journal.date) }}
                  </span>
                  <span v-if="journal.weather" class="flex items-center gap-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    {{ journal.weather }}
                  </span>
                  <span v-if="journal.location" class="flex items-center gap-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ journal.location }}
                  </span>
                </div>
                <div v-if="journal.tags && journal.tags.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in journal.tags"
                    :key="tag"
                    class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <div class="ml-4 flex items-center gap-2">
                <button
                  @click="openJournalModal(journal)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteJournal(journal)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Tab -->
      <div v-show="activeTab === 'notes'">
        <!-- Filters -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative flex-1 max-w-md">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="noteSearchQuery"
              type="text"
              placeholder="Search notes..."
              class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <select
            v-model="noteCategoryFilter"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            <option v-for="cat in noteCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select
            v-model="noteFilterPinned"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Notes</option>
            <option value="pinned">Pinned Only</option>
            <option value="unpinned">Unpinned Only</option>
          </select>
        </div>

        <!-- Notes List -->
        <div v-if="loadingNotes" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredNotes.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No notes found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first note</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <!-- Pin Icon -->
            <button
              @click="toggleNotePin(note)"
              class="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-yellow-600 dark:hover:bg-gray-700 dark:hover:text-yellow-400"
            >
              <svg v-if="note.is_pinned" class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019l-4.323 1.723a1 1 0 01-1.008-.243l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 0l1.299 1.299 3.684-1.23-4.323-1.723a1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4V3a1 1 0 011-1z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <div @click="openNoteModal(note)" class="cursor-pointer">
              <div class="mb-2 flex items-center gap-2">
                <h3 class="flex-1 font-semibold text-gray-900 dark:text-white">{{ note.title }}</h3>
                <span v-if="note.category" class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {{ note.category }}
                </span>
              </div>
              <p class="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{{ note.content }}</p>
              <div v-if="note.tags && note.tags.length > 0" class="mb-3 flex flex-wrap gap-1">
                <span
                  v-for="tag in note.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                >
                  #{{ tag }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(note.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Journal Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showJournalModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeJournalModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeJournalModal"></div>
          <Transition name="scale">
            <div
              v-if="showJournalModal"
              class="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingJournal ? 'Edit Journal Entry' : 'New Journal Entry' }}
              </h2>

              <form @submit.prevent="saveJournal" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                    <input
                      v-model="journalForm.title"
                      type="text"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Journal entry title"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                    <input
                      v-model="journalForm.date"
                      type="date"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Content *</label>
                  <textarea
                    v-model="journalForm.content"
                    rows="10"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Mood</label>
                    <select
                      v-model="journalForm.mood"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select mood</option>
                      <option v-for="mood in moods" :key="mood" :value="mood">{{ mood }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Weather</label>
                    <input
                      v-model="journalForm.weather"
                      type="text"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Sunny, Rainy, etc."
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <input
                      v-model="journalForm.location"
                      type="text"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Where are you?"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
                  <input
                    v-model="journalForm.tagsInput"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <input
                    v-model="journalForm.is_private"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                  />
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Make this entry private</label>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeJournalModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingJournal"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingJournal">Saving...</span>
                    <span v-else>{{ editingJournal ? 'Update' : 'Create' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Note Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showNoteModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeNoteModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeNoteModal"></div>
          <Transition name="scale">
            <div
              v-if="showNoteModal"
              class="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingNote ? 'Edit Note' : 'Add Note' }}
              </h2>

              <form @submit.prevent="saveNote" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                    <input
                      v-model="noteForm.title"
                      type="text"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Note title"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <input
                      v-model="noteForm.category"
                      type="text"
                      list="note-categories-list"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Work, Personal, etc."
                    />
                    <datalist id="note-categories-list">
                      <option v-for="cat in noteCategories" :key="cat" :value="cat"></option>
                    </datalist>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Content *</label>
                  <textarea
                    v-model="noteForm.content"
                    rows="10"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Write your note here..."
                  ></textarea>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
                  <input
                    v-model="noteForm.tagsInput"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <input
                    v-model="noteForm.is_pinned"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                  />
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Pin this note</label>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeNoteModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingNote"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingNote">Saving...</span>
                    <span v-else>{{ editingNote ? 'Update' : 'Add' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

// Tab state
const activeTab = ref('journals')

// Journal state
const journals = ref([])
const loadingJournals = ref(false)
const savingJournal = ref(false)
const showJournalModal = ref(false)
const editingJournal = ref(null)

const journalSearchQuery = ref('')
const moodFilter = ref('')
const dateFilter = ref('all')

const moods = ref(['Happy', 'Sad', 'Excited', 'Calm', 'Anxious', 'Grateful', 'Tired', 'Energetic', 'Reflective', 'Content'])

const journalForm = ref({
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  mood: '',
  weather: '',
  location: '',
  tagsInput: '',
  is_private: false
})

// Notes state
const notes = ref([])
const loadingNotes = ref(false)
const savingNote = ref(false)
const showNoteModal = ref(false)
const editingNote = ref(null)

const noteSearchQuery = ref('')
const noteCategoryFilter = ref('')
const noteFilterPinned = ref('all')

const noteCategories = ref(['Work', 'Personal', 'Study', 'Ideas', 'Shopping', 'Other'])

const noteForm = ref({
  title: '',
  content: '',
  category: '',
  tagsInput: '',
  is_pinned: false
})

// Computed
const summary = computed(() => {
  return {
    pinnedNotes: notes.value.filter(n => n.is_pinned).length
  }
})

const thisMonthEntries = computed(() => {
  const now = new Date()
  return journals.value.filter(j => {
    const journalDate = new Date(j.date)
    return journalDate.getMonth() === now.getMonth() && journalDate.getFullYear() === now.getFullYear()
  }).length
})

const thisWeekEntries = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return journals.value.filter(j => {
    const journalDate = new Date(j.date)
    return journalDate >= weekAgo
  }).length
})

const thisWeekNotes = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return notes.value.filter(n => {
    const noteDate = new Date(n.created_at)
    return noteDate >= weekAgo
  }).length
})

const currentStreak = computed(() => {
  if (journals.value.length === 0) return 0
  
  const sortedDates = journals.value
    .map(j => new Date(j.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a))
  
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedDates.length; i++) {
    const journalDate = new Date(sortedDates[i])
    journalDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate - journalDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === streak) {
      streak++
    } else if (diffDays > streak) {
      break
    }
  }
  
  return streak
})

const filteredJournals = computed(() => {
  let filtered = journals.value

  if (journalSearchQuery.value) {
    const query = journalSearchQuery.value.toLowerCase()
    filtered = filtered.filter(j =>
      j.title?.toLowerCase().includes(query) ||
      j.content?.toLowerCase().includes(query) ||
      j.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (moodFilter.value) {
    filtered = filtered.filter(j => j.mood === moodFilter.value)
  }

  if (dateFilter.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(j => {
      const journalDate = new Date(j.date)
      switch (dateFilter.value) {
        case 'today':
          return journalDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return journalDate >= weekAgo
        case 'month':
          return journalDate.getMonth() === now.getMonth() && journalDate.getFullYear() === now.getFullYear()
        case 'year':
          return journalDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredNotes = computed(() => {
  let filtered = notes.value

  if (noteSearchQuery.value) {
    const query = noteSearchQuery.value.toLowerCase()
    filtered = filtered.filter(n =>
      n.title?.toLowerCase().includes(query) ||
      n.content?.toLowerCase().includes(query) ||
      n.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (noteCategoryFilter.value) {
    filtered = filtered.filter(n => n.category === noteCategoryFilter.value)
  }

  if (noteFilterPinned.value === 'pinned') {
    filtered = filtered.filter(n => n.is_pinned)
  } else if (noteFilterPinned.value === 'unpinned') {
    filtered = filtered.filter(n => !n.is_pinned)
  }

  // Sort: pinned first, then by date
  return filtered.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

// Journal methods
const fetchJournals = async () => {
  loadingJournals.value = true
  try {
    const response = await api.get('/journals')
    journals.value = response.data
  } catch (error) {
    console.error('Error fetching journals:', error)
  } finally {
    loadingJournals.value = false
  }
}

const openJournalModal = (journal = null) => {
  editingJournal.value = journal
  if (journal) {
    journalForm.value = {
      title: journal.title || '',
      content: journal.content || '',
      date: journal.date || new Date().toISOString().split('T')[0],
      mood: journal.mood || '',
      weather: journal.weather || '',
      location: journal.location || '',
      tagsInput: journal.tags ? journal.tags.join(', ') : '',
      is_private: journal.is_private || false
    }
  } else {
    journalForm.value = {
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      mood: '',
      weather: '',
      location: '',
      tagsInput: '',
      is_private: false
    }
  }
  showJournalModal.value = true
}

const closeJournalModal = () => {
  showJournalModal.value = false
  editingJournal.value = null
}

const saveJournal = async () => {
  savingJournal.value = true
  try {
    const tags = journalForm.value.tagsInput
      ? journalForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    if (editingJournal.value) {
      await api.put(`/journals/${editingJournal.value.id}`, {
        title: journalForm.value.title,
        content: journalForm.value.content,
        date: journalForm.value.date,
        mood: journalForm.value.mood || null,
        weather: journalForm.value.weather || null,
        location: journalForm.value.location || null,
        tags: tags,
        is_private: journalForm.value.is_private
      })
    } else {
      await api.post('/journals', {
        title: journalForm.value.title,
        content: journalForm.value.content,
        date: journalForm.value.date,
        mood: journalForm.value.mood || null,
        weather: journalForm.value.weather || null,
        location: journalForm.value.location || null,
        tags: tags,
        is_private: journalForm.value.is_private
      })
    }
    closeJournalModal()
    await fetchJournals()
  } catch (error) {
    console.error('Error saving journal:', error)
    alert(error.response?.data?.message || 'Error saving journal')
  } finally {
    savingJournal.value = false
  }
}

const deleteJournal = async (journal) => {
  if (!confirm('Are you sure you want to delete this journal entry?')) return
  
  try {
    await api.delete(`/journals/${journal.id}`)
    await fetchJournals()
  } catch (error) {
    console.error('Error deleting journal:', error)
    alert('Error deleting journal')
  }
}

// Notes methods
const fetchNotes = async () => {
  loadingNotes.value = true
  try {
    const response = await api.get('/notes')
    notes.value = response.data
  } catch (error) {
    console.error('Error fetching notes:', error)
  } finally {
    loadingNotes.value = false
  }
}

const openNoteModal = (note = null) => {
  editingNote.value = note
  if (note) {
    noteForm.value = {
      title: note.title || '',
      content: note.content || '',
      category: note.category || '',
      tagsInput: note.tags ? note.tags.join(', ') : '',
      is_pinned: note.is_pinned || false
    }
  } else {
    noteForm.value = {
      title: '',
      content: '',
      category: '',
      tagsInput: '',
      is_pinned: false
    }
  }
  showNoteModal.value = true
}

const closeNoteModal = () => {
  showNoteModal.value = false
  editingNote.value = null
}

const saveNote = async () => {
  savingNote.value = true
  try {
    const tags = noteForm.value.tagsInput
      ? noteForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    if (editingNote.value) {
      await api.put(`/notes/${editingNote.value.id}`, {
        title: noteForm.value.title,
        content: noteForm.value.content,
        category: noteForm.value.category || null,
        tags: tags,
        is_pinned: noteForm.value.is_pinned
      })
    } else {
      await api.post('/notes', {
        title: noteForm.value.title,
        content: noteForm.value.content,
        category: noteForm.value.category || null,
        tags: tags,
        is_pinned: noteForm.value.is_pinned
      })
    }
    closeNoteModal()
    await fetchNotes()
  } catch (error) {
    console.error('Error saving note:', error)
    alert(error.response?.data?.message || 'Error saving note')
  } finally {
    savingNote.value = false
  }
}

const toggleNotePin = async (note) => {
  try {
    await api.put(`/notes/${note.id}`, {
      is_pinned: !note.is_pinned
    })
    await fetchNotes()
  } catch (error) {
    console.error('Error toggling pin:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  fetchJournals()
  fetchNotes()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-leave-active {
  transition: all 0.2s ease-in;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
