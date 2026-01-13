<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Back Button & Title -->
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
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Storage</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Manage your files and links</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Summary Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Total Files -->
        <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Total Files</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ summary.totalFiles }}</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">{{ formatFileSize(summary.totalFileSize) }}</p>
        </div>

        <!-- Total Links -->
        <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">Total Links</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ summary.totalLinks }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">{{ summary.favoriteLinks }} favorites</p>
        </div>

        <!-- Storage Used -->
        <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 dark:border-orange-900/50 dark:from-orange-900/20 dark:to-orange-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-orange-700 dark:text-orange-400">Storage Used</span>
            <div class="rounded-lg bg-orange-200 p-2 dark:bg-orange-900/50">
              <svg class="h-5 w-5 text-orange-700 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-orange-900 dark:text-orange-300">{{ formatFileSize(summary.totalFileSize) }}</p>
          <p class="mt-1 text-xs text-orange-600 dark:text-orange-400">Total storage</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex gap-6">
          <button
            @click="activeTab = 'files'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'files'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Files
          </button>
          <button
            @click="activeTab = 'links'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'links'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Links
          </button>
        </div>
      </div>

      <!-- Files Tab -->
      <div v-show="activeTab === 'files'">
        <!-- Action Bar -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div class="relative flex-1 max-w-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="fileSearchQuery"
                type="text"
                placeholder="Search files..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <select
              v-model="fileCategoryFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              <option v-for="cat in fileCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="flex gap-2">
            <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload File
              <input type="file" @change="handleFileUpload" class="hidden" multiple />
            </label>
          </div>
        </div>

        <!-- Files List -->
        <div v-if="loadingFiles" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredFiles.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No files found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload your first file</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="file in filteredFiles"
            :key="file.id"
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ file.original_name || file.name }}</h3>
                  <span v-if="file.category" class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ file.category }}
                  </span>
                </div>
                <p v-if="file.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ file.description }}</p>
                <div class="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                  <span>{{ formatFileSize(file.size) }}</span>
                  <span>•</span>
                  <span>{{ file.mime_type }}</span>
                  <span>•</span>
                  <span>{{ formatDate(file.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="downloadFile(file)"
                class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                @click="openFileModal(file)"
                class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Links Tab -->
      <div v-show="activeTab === 'links'">
        <!-- Action Bar -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <div class="relative flex-1 max-w-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="linkSearchQuery"
                type="text"
                placeholder="Search links..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <select
              v-model="linkCategoryFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              <option v-for="cat in linkCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <select
              v-model="linkFilterFavorite"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Links</option>
              <option value="favorite">Favorites Only</option>
            </select>
          </div>
          <button
            @click="openLinkModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>

        <!-- Links List -->
        <div v-if="loadingLinks" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredLinks.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No links found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Add your first link</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2">
          <div
            v-for="link in filteredLinks"
            :key="link.id"
            class="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <!-- Favorite Icon -->
            <button
              @click="toggleLinkFavorite(link)"
              class="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-yellow-600 dark:hover:bg-gray-700 dark:hover:text-yellow-400"
            >
              <svg v-if="link.is_favorite" class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            <div>
              <div class="mb-2 flex items-center gap-2">
                <h3 class="flex-1 font-semibold text-gray-900 dark:text-white">{{ link.title }}</h3>
                <span v-if="link.category" class="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  {{ link.category }}
                </span>
              </div>
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mb-2 block truncate text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {{ link.url }}
              </a>
              <p v-if="link.description" class="mb-3 text-sm text-gray-600 dark:text-gray-400">{{ link.description }}</p>
              <div v-if="link.tags && link.tags.length > 0" class="mb-3 flex flex-wrap gap-1">
                <span
                  v-for="tag in link.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                >
                  #{{ tag }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(link.created_at) }}</p>
                <button
                  @click="openLinkModal(link)"
                  class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- File Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showFileModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeFileModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeFileModal"></div>
          <Transition name="scale">
            <div
              v-if="showFileModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingFile ? 'Edit File' : 'File Details' }}
              </h2>

              <form @submit.prevent="saveFile" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    v-model="fileForm.name"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="File name"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <input
                    v-model="fileForm.category"
                    type="text"
                    list="file-categories-list"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Work, Personal, etc."
                  />
                  <datalist id="file-categories-list">
                    <option v-for="cat in fileCategories" :key="cat" :value="cat"></option>
                  </datalist>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="fileForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div v-if="editingFile" class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div class="mb-1"><strong>Original Name:</strong> {{ editingFile.original_name }}</div>
                    <div class="mb-1"><strong>Size:</strong> {{ formatFileSize(editingFile.size) }}</div>
                    <div class="mb-1"><strong>Type:</strong> {{ editingFile.mime_type }}</div>
                    <div><strong>Uploaded:</strong> {{ formatDate(editingFile.created_at) }}</div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeFileModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    v-if="editingFile"
                    type="submit"
                    :disabled="savingFile"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingFile">Saving...</span>
                    <span v-else>Update</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Link Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLinkModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeLinkModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeLinkModal"></div>
          <Transition name="scale">
            <div
              v-if="showLinkModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingLink ? 'Edit Link' : 'Add Link' }}
              </h2>

              <form @submit.prevent="saveLink" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    v-model="linkForm.title"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Link title"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">URL *</label>
                  <input
                    v-model="linkForm.url"
                    type="url"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <input
                      v-model="linkForm.category"
                      type="text"
                      list="link-categories-list"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Work, Personal, etc."
                    />
                    <datalist id="link-categories-list">
                      <option v-for="cat in linkCategories" :key="cat" :value="cat"></option>
                    </datalist>
                  </div>
                  <div class="flex items-end">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="linkForm.is_favorite"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                      />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Favorite</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="linkForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
                  <input
                    v-model="linkForm.tagsInput"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeLinkModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingLink"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingLink">Saving...</span>
                    <span v-else>{{ editingLink ? 'Update' : 'Add' }}</span>
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

// State
const activeTab = ref('files')
const files = ref([])
const links = ref([])
const loadingFiles = ref(false)
const loadingLinks = ref(false)
const savingFile = ref(false)
const savingLink = ref(false)

// Filters
const fileSearchQuery = ref('')
const fileCategoryFilter = ref('')
const linkSearchQuery = ref('')
const linkCategoryFilter = ref('')
const linkFilterFavorite = ref('all')

// Categories
const fileCategories = ref(['Work', 'Personal', 'Documents', 'Images', 'Videos', 'Other'])
const linkCategories = ref(['Work', 'Personal', 'Learning', 'Entertainment', 'Tools', 'Other'])

// Modals
const showFileModal = ref(false)
const showLinkModal = ref(false)
const editingFile = ref(null)
const editingLink = ref(null)

// Forms
const fileForm = ref({
  name: '',
  category: '',
  description: ''
})

const linkForm = ref({
  title: '',
  url: '',
  description: '',
  category: '',
  tagsInput: '',
  is_favorite: false
})

// Computed Summary
const summary = computed(() => {
  const totalFileSize = files.value.reduce((sum, f) => sum + (f.size || 0), 0)
  const favoriteLinks = links.value.filter(l => l.is_favorite).length

  return {
    totalFiles: files.value.length,
    totalFileSize,
    totalLinks: links.value.length,
    favoriteLinks
  }
})

// Computed Filters
const filteredFiles = computed(() => {
  let filtered = files.value

  if (fileSearchQuery.value) {
    const query = fileSearchQuery.value.toLowerCase()
    filtered = filtered.filter(f =>
      f.name?.toLowerCase().includes(query) ||
      f.original_name?.toLowerCase().includes(query) ||
      f.description?.toLowerCase().includes(query)
    )
  }

  if (fileCategoryFilter.value) {
    filtered = filtered.filter(f => f.category === fileCategoryFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const filteredLinks = computed(() => {
  let filtered = links.value

  if (linkSearchQuery.value) {
    const query = linkSearchQuery.value.toLowerCase()
    filtered = filtered.filter(l =>
      l.title?.toLowerCase().includes(query) ||
      l.url?.toLowerCase().includes(query) ||
      l.description?.toLowerCase().includes(query) ||
      l.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (linkCategoryFilter.value) {
    filtered = filtered.filter(l => l.category === linkCategoryFilter.value)
  }

  if (linkFilterFavorite.value === 'favorite') {
    filtered = filtered.filter(l => l.is_favorite)
  }

  // Sort: favorites first, then by date
  return filtered.sort((a, b) => {
    if (a.is_favorite !== b.is_favorite) return b.is_favorite - a.is_favorite
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

// Methods
const fetchFiles = async () => {
  loadingFiles.value = true
  try {
    const response = await api.get('/files')
    files.value = response.data
  } catch (error) {
    console.error('Error fetching files:', error)
  } finally {
    loadingFiles.value = false
  }
}

const fetchLinks = async () => {
  loadingLinks.value = true
  try {
    const response = await api.get('/links')
    links.value = response.data
  } catch (error) {
    console.error('Error fetching links:', error)
  } finally {
    loadingLinks.value = false
  }
}

// File Methods
const handleFileUpload = async (event) => {
  const selectedFiles = event.target.files
  if (!selectedFiles || selectedFiles.length === 0) return

  try {
    const formData = new FormData()
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files[]', selectedFiles[i])
    }
    await api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    await fetchFiles()
    event.target.value = '' // Reset input
  } catch (error) {
    console.error('Error uploading files:', error)
    alert('Error uploading files')
  }
}

const openFileModal = (file = null) => {
  editingFile.value = file
  if (file) {
    fileForm.value = {
      name: file.name || '',
      category: file.category || '',
      description: file.description || ''
    }
  } else {
    fileForm.value = {
      name: '',
      category: '',
      description: ''
    }
  }
  showFileModal.value = true
}

const closeFileModal = () => {
  showFileModal.value = false
  editingFile.value = null
}

const saveFile = async () => {
  savingFile.value = true
  try {
    await api.put(`/files/${editingFile.value.id}`, {
      name: fileForm.value.name,
      category: fileForm.value.category || null,
      description: fileForm.value.description || null
    })
    closeFileModal()
    await fetchFiles()
  } catch (error) {
    console.error('Error saving file:', error)
    alert(error.response?.data?.message || 'Error saving file')
  } finally {
    savingFile.value = false
  }
}

const downloadFile = async (file) => {
  try {
    // TODO: Implement when backend is ready
    // const response = await api.get(`/files/${file.id}/download`, {
    //   responseType: 'blob'
    // })
    // const url = window.URL.createObjectURL(new Blob([response.data]))
    // const link = document.createElement('a')
    // link.href = url
    // link.setAttribute('download', file.original_name)
    // document.body.appendChild(link)
    // link.click()
    // link.remove()
    alert('Download feature coming soon!')
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Error downloading file')
  }
}

// Link Methods
const openLinkModal = (link = null) => {
  editingLink.value = link
  if (link) {
    linkForm.value = {
      title: link.title || '',
      url: link.url || '',
      description: link.description || '',
      category: link.category || '',
      tagsInput: link.tags ? link.tags.join(', ') : '',
      is_favorite: link.is_favorite || false
    }
  } else {
    linkForm.value = {
      title: '',
      url: '',
      description: '',
      category: '',
      tagsInput: '',
      is_favorite: false
    }
  }
  showLinkModal.value = true
}

const closeLinkModal = () => {
  showLinkModal.value = false
  editingLink.value = null
}

const saveLink = async () => {
  savingLink.value = true
  try {
    const tags = linkForm.value.tagsInput
      ? linkForm.value.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    if (editingLink.value) {
      await api.put(`/links/${editingLink.value.id}`, {
        title: linkForm.value.title,
        url: linkForm.value.url,
        description: linkForm.value.description || null,
        category: linkForm.value.category || null,
        tags: tags,
        is_favorite: linkForm.value.is_favorite
      })
    } else {
      await api.post('/links', {
        title: linkForm.value.title,
        url: linkForm.value.url,
        description: linkForm.value.description || null,
        category: linkForm.value.category || null,
        tags: tags,
        is_favorite: linkForm.value.is_favorite
      })
    }
    closeLinkModal()
    await fetchLinks()
  } catch (error) {
    console.error('Error saving link:', error)
    alert(error.response?.data?.message || 'Error saving link')
  } finally {
    savingLink.value = false
  }
}

const toggleLinkFavorite = async (link) => {
  try {
    await api.put(`/links/${link.id}`, {
      is_favorite: !link.is_favorite
    })
    await fetchLinks()
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

// Format Functions
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Lifecycle
onMounted(() => {
  fetchFiles()
  fetchLinks()
})
</script>

<style scoped>
/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Animation */
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
