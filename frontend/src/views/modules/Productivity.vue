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
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Productivity & Time</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Track your time and manage your schedule</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Summary Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Time Today -->
        <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Today's Time</span>
            <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">{{ formatDuration(summary.todayMinutes) }}</p>
          <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">{{ summary.todayCount }} activities</p>
        </div>

        <!-- Total Time This Week -->
        <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">This Week</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ formatDuration(summary.weekMinutes) }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">Weekly total</p>
        </div>

        <!-- Upcoming Schedules -->
        <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Upcoming</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ summary.upcomingSchedules }}</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">Schedules today</p>
        </div>

        <!-- Productivity Score -->
        <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 dark:border-orange-900/50 dark:from-orange-900/20 dark:to-orange-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-orange-700 dark:text-orange-400">Productivity</span>
            <div class="rounded-lg bg-orange-200 p-2 dark:bg-orange-900/50">
              <svg class="h-5 w-5 text-orange-700 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-orange-900 dark:text-orange-300">{{ summary.productivityScore }}%</p>
          <p class="mt-1 text-xs text-orange-600 dark:text-orange-400">This week</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex gap-6">
          <button
            @click="activeTab = 'tracking'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'tracking'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Time Tracking
          </button>
          <button
            @click="activeTab = 'schedules'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'schedules'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Schedules
          </button>
          <button
            @click="activeTab = 'pomodoro'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'pomodoro'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Pomodoro
          </button>
        </div>
      </div>

      <!-- Time Tracking Tab -->
      <div v-show="activeTab === 'tracking'">
        <!-- Timer Section -->
        <div class="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Active Timer</h2>
            <div v-if="isTimerRunning" class="flex items-center gap-2">
              <div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
              <span class="text-sm text-red-600 dark:text-red-400">Running</span>
            </div>
          </div>

          <div v-if="!isTimerRunning" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Activity *</label>
                <input
                  v-model="timerForm.activity"
                  type="text"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  placeholder="Working on project..."
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  v-model="timerForm.category"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                v-model="timerForm.description"
                rows="2"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                placeholder="Optional description"
              ></textarea>
            </div>
            <button
              @click="startTimer"
              class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Start Timer
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="text-center">
              <div class="mb-4 text-5xl font-bold text-gray-900 dark:text-white">{{ formatTimerTime(timerSeconds) }}</div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ timerForm.activity }} - {{ timerForm.category }}</p>
            </div>
            <div class="flex gap-3">
              <button
                @click="pauseTimer"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {{ isTimerPaused ? 'Resume' : 'Pause' }}
              </button>
              <button
                @click="stopTimer"
                class="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Stop & Save
              </button>
            </div>
          </div>
        </div>

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
                v-model="trackingSearchQuery"
                type="text"
                placeholder="Search activities..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
            <select
              v-model="trackingCategoryFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Exercise">Exercise</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            @click="openTrackingModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Manual Entry
          </button>
        </div>

        <!-- Time Tracking List -->
        <div v-if="loadingTracking" class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="filteredTrackings.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No time tracking found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Start tracking your time</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="tracking in filteredTrackings"
            :key="tracking.id"
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-center gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ tracking.activity }}</h3>
                  <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ tracking.category }}
                  </span>
                </div>
                <p v-if="tracking.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ tracking.description }}</p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">{{ formatDate(tracking.date) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatDuration(tracking.duration_minutes) }}</p>
              <button
                @click="openTrackingModal(tracking)"
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

      <!-- Schedules Tab -->
      <div v-show="activeTab === 'schedules'">
        <!-- Action Bar -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="scheduleSearchQuery"
                type="text"
                placeholder="Search schedules..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>
          <button
            @click="openScheduleModal()"
            class="ml-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Schedule
          </button>
        </div>

        <!-- Schedules List -->
        <div v-if="schedules.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No schedules found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first schedule</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="schedule in filteredSchedules"
            :key="schedule.id"
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ schedule.title }}</h3>
                  <span
                    v-if="schedule.is_completed"
                    class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Completed
                  </span>
                </div>
                <p v-if="schedule.description" class="mb-3 text-sm text-gray-600 dark:text-gray-400">{{ schedule.description }}</p>
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div class="flex items-center gap-1.5">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDateTime(schedule.start_time) }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatDateTime(schedule.end_time) }}</span>
                  </div>
                  <div v-if="schedule.location" class="flex items-center gap-1.5">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{{ schedule.location }}</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="!schedule.is_completed"
                  @click="toggleScheduleComplete(schedule)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700 dark:hover:text-green-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click="openScheduleModal(schedule)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
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

      <!-- Pomodoro Tab -->
      <div v-show="activeTab === 'pomodoro'">
        <div class="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-800">
          <div class="text-center">
            <h2 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h2>
            <p class="mb-8 text-sm text-gray-600 dark:text-gray-400">Focus for 25 minutes, then take a 5-minute break</p>
            
            <!-- Timer Display -->
            <div class="mb-8">
              <div class="mb-4 text-7xl font-bold text-gray-900 dark:text-white">{{ formatTimerTime(pomodoroSeconds) }}</div>
              <div class="mb-4">
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-sm font-medium',
                    pomodoroMode === 'work'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  ]"
                >
                  {{ pomodoroMode === 'work' ? 'Focus Time' : 'Break Time' }}
                </span>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Session {{ pomodoroSession }} of 4
              </div>
            </div>

            <!-- Controls -->
            <div class="flex justify-center gap-3">
              <button
                v-if="!isPomodoroRunning"
                @click="startPomodoro"
                class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Start
              </button>
              <button
                v-else
                @click="pausePomodoro"
                class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {{ isPomodoroPaused ? 'Resume' : 'Pause' }}
              </button>
              <button
                v-if="isPomodoroRunning || isPomodoroPaused"
                @click="resetPomodoro"
                class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Reset
              </button>
            </div>

            <!-- Settings -->
            <div class="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h3 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Settings</h3>
              <div class="grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Work Duration (minutes)</label>
                  <input
                    v-model.number="pomodoroSettings.workMinutes"
                    type="number"
                    min="1"
                    max="60"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Break Duration (minutes)</label>
                  <input
                    v-model.number="pomodoroSettings.breakMinutes"
                    type="number"
                    min="1"
                    max="30"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Time Tracking Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showTrackingModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeTrackingModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeTrackingModal"></div>
          <Transition name="scale">
            <div
              v-if="showTrackingModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingTracking ? 'Edit Time Tracking' : 'Add Time Tracking' }}
              </h2>

              <form @submit.prevent="saveTracking" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Activity *</label>
                    <input
                      v-model="trackingForm.activity"
                      type="text"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Working on project..."
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                    <select
                      v-model="trackingForm.category"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      <option value="Work">Work</option>
                      <option value="Study">Study</option>
                      <option value="Exercise">Exercise</option>
                      <option value="Personal">Personal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes) *</label>
                    <input
                      v-model.number="trackingForm.duration_minutes"
                      type="number"
                      min="1"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                    <input
                      v-model="trackingForm.date"
                      type="date"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="trackingForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeTrackingModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingTracking"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingTracking">Saving...</span>
                    <span v-else>{{ editingTracking ? 'Update' : 'Add' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Schedule Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showScheduleModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeScheduleModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeScheduleModal"></div>
          <Transition name="scale">
            <div
              v-if="showScheduleModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingSchedule ? 'Edit Schedule' : 'Add Schedule' }}
              </h2>

              <form @submit.prevent="saveSchedule" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    v-model="scheduleForm.title"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Meeting, Appointment, etc."
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="scheduleForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time *</label>
                    <input
                      v-model="scheduleForm.start_time"
                      type="datetime-local"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Time *</label>
                    <input
                      v-model="scheduleForm.end_time"
                      type="datetime-local"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input
                    v-model="scheduleForm.location"
                    type="text"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Office, Online, etc."
                  />
                </div>

                <div class="flex items-center gap-2">
                  <input
                    v-model="scheduleForm.is_completed"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                  />
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</label>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeScheduleModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingSchedule"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingSchedule">Saving...</span>
                    <span v-else>{{ editingSchedule ? 'Update' : 'Add' }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'

// State
const activeTab = ref('tracking')
const timeTrackings = ref([])
const schedules = ref([])
const loadingTracking = ref(false)
const savingTracking = ref(false)
const savingSchedule = ref(false)

// Filters
const trackingSearchQuery = ref('')
const trackingCategoryFilter = ref('')
const scheduleSearchQuery = ref('')

// Timer State
const isTimerRunning = ref(false)
const isTimerPaused = ref(false)
const timerSeconds = ref(0)
const timerInterval = ref(null)
const timerStartTime = ref(null)
const timerPausedSeconds = ref(0)

const timerForm = ref({
  activity: '',
  category: '',
  description: ''
})

// Pomodoro State
const isPomodoroRunning = ref(false)
const isPomodoroPaused = ref(false)
const pomodoroSeconds = ref(25 * 60) // 25 minutes default
const pomodoroMode = ref('work') // 'work' or 'break'
const pomodoroSession = ref(1)
const pomodoroInterval = ref(null)
const pomodoroSettings = ref({
  workMinutes: 25,
  breakMinutes: 5
})

// Modals
const showTrackingModal = ref(false)
const showScheduleModal = ref(false)
const editingTracking = ref(null)
const editingSchedule = ref(null)

// Forms
const trackingForm = ref({
  activity: '',
  category: '',
  duration_minutes: 60,
  date: new Date().toISOString().split('T')[0],
  description: ''
})

const scheduleForm = ref({
  title: '',
  description: '',
  start_time: '',
  end_time: '',
  location: '',
  is_completed: false
})

// Computed Summary
const summary = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayTrackings = timeTrackings.value.filter(t => t.date === today)
  const todayMinutes = todayTrackings.reduce((sum, t) => sum + (t.duration_minutes || 0), 0)

  // This week (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekTrackings = timeTrackings.value.filter(t => new Date(t.date) >= weekAgo)
  const weekMinutes = weekTrackings.reduce((sum, t) => sum + (t.duration_minutes || 0), 0)

  // Upcoming schedules today
  const todaySchedules = schedules.value.filter(s => {
    const scheduleDate = new Date(s.start_time).toISOString().split('T')[0]
    return scheduleDate === today && !s.is_completed
  })

  // Productivity score (based on consistency)
  const avgDailyMinutes = weekMinutes / 7
  const productivityScore = Math.min(100, Math.round((todayMinutes / Math.max(avgDailyMinutes, 1)) * 100))

  return {
    todayMinutes,
    todayCount: todayTrackings.length,
    weekMinutes,
    upcomingSchedules: todaySchedules.length,
    productivityScore
  }
})

// Computed Filters
const filteredTrackings = computed(() => {
  let filtered = timeTrackings.value

  if (trackingSearchQuery.value) {
    const query = trackingSearchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.activity?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    )
  }

  if (trackingCategoryFilter.value) {
    filtered = filtered.filter(t => t.category === trackingCategoryFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredSchedules = computed(() => {
  if (!scheduleSearchQuery.value) return schedules.value.sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
  const query = scheduleSearchQuery.value.toLowerCase()
  return schedules.value.filter(s =>
    s.title?.toLowerCase().includes(query) ||
    s.description?.toLowerCase().includes(query) ||
    s.location?.toLowerCase().includes(query)
  ).sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
})

// Methods
const fetchTimeTrackings = async () => {
  loadingTracking.value = true
  try {
    const response = await api.get('/time-trackings')
    timeTrackings.value = response.data
  } catch (error) {
    console.error('Error fetching time trackings:', error)
  } finally {
    loadingTracking.value = false
  }
}

const fetchSchedules = async () => {
  try {
    const response = await api.get('/schedules')
    schedules.value = response.data
  } catch (error) {
    console.error('Error fetching schedules:', error)
  }
}

// Timer Functions
const startTimer = () => {
  if (!timerForm.value.activity || !timerForm.value.category) {
    alert('Please fill in activity and category')
    return
  }
  isTimerRunning.value = true
  isTimerPaused.value = false
  timerStartTime.value = Date.now()
  timerPausedSeconds.value = 0
  timerInterval.value = setInterval(() => {
    if (!isTimerPaused.value) {
      timerSeconds.value = Math.floor((Date.now() - timerStartTime.value) / 1000) + timerPausedSeconds.value
    }
  }, 1000)
}

const pauseTimer = () => {
  if (isTimerPaused.value) {
    isTimerPaused.value = false
    timerStartTime.value = Date.now() - (timerPausedSeconds.value * 1000)
  } else {
    isTimerPaused.value = true
    timerPausedSeconds.value = timerSeconds.value
  }
}

const stopTimer = async () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  const minutes = Math.floor(timerSeconds.value / 60)
  if (minutes > 0) {
    try {
      await api.post('/time-trackings', {
        activity: timerForm.value.activity,
        category: timerForm.value.category,
        duration_minutes: minutes,
        date: new Date().toISOString().split('T')[0],
        description: timerForm.value.description
      })
      await fetchTimeTrackings()
    } catch (error) {
      console.error('Error saving time tracking:', error)
      alert('Error saving time tracking')
    }
  }

  isTimerRunning.value = false
  isTimerPaused.value = false
  timerSeconds.value = 0
  timerPausedSeconds.value = 0
  timerForm.value = {
    activity: '',
    category: '',
    description: ''
  }
}

// Pomodoro Functions
const startPomodoro = () => {
  isPomodoroRunning.value = true
  isPomodoroPaused.value = false
  pomodoroInterval.value = setInterval(() => {
    if (!isPomodoroPaused.value) {
      pomodoroSeconds.value--
      if (pomodoroSeconds.value <= 0) {
        handlePomodoroComplete()
      }
    }
  }, 1000)
}

const pausePomodoro = () => {
  isPomodoroPaused.value = !isPomodoroPaused.value
}

const resetPomodoro = () => {
  if (pomodoroInterval.value) {
    clearInterval(pomodoroInterval.value)
    pomodoroInterval.value = null
  }
  isPomodoroRunning.value = false
  isPomodoroPaused.value = false
  pomodoroSeconds.value = pomodoroMode.value === 'work' 
    ? pomodoroSettings.value.workMinutes * 60 
    : pomodoroSettings.value.breakMinutes * 60
}

const handlePomodoroComplete = () => {
  if (pomodoroInterval.value) {
    clearInterval(pomodoroInterval.value)
    pomodoroInterval.value = null
  }

  if (pomodoroMode.value === 'work') {
    pomodoroMode.value = 'break'
    pomodoroSeconds.value = pomodoroSettings.value.breakMinutes * 60
    if (pomodoroSession.value < 4) {
      alert('Great work! Time for a break.')
      startPomodoro()
    } else {
      alert('Congratulations! You completed 4 Pomodoro sessions!')
      pomodoroSession.value = 1
      pomodoroMode.value = 'work'
      pomodoroSeconds.value = pomodoroSettings.value.workMinutes * 60
      isPomodoroRunning.value = false
    }
  } else {
    pomodoroMode.value = 'work'
    pomodoroSession.value++
    pomodoroSeconds.value = pomodoroSettings.value.workMinutes * 60
    alert('Break time is over! Ready for the next session?')
    startPomodoro()
  }
}

// Tracking Modal
const openTrackingModal = (tracking = null) => {
  editingTracking.value = tracking
  if (tracking) {
    trackingForm.value = {
      activity: tracking.activity || '',
      category: tracking.category || '',
      duration_minutes: tracking.duration_minutes || 60,
      date: tracking.date || new Date().toISOString().split('T')[0],
      description: tracking.description || ''
    }
  } else {
    trackingForm.value = {
      activity: '',
      category: '',
      duration_minutes: 60,
      date: new Date().toISOString().split('T')[0],
      description: ''
    }
  }
  showTrackingModal.value = true
}

const closeTrackingModal = () => {
  showTrackingModal.value = false
  editingTracking.value = null
}

const saveTracking = async () => {
  savingTracking.value = true
  try {
    if (editingTracking.value) {
      await api.put(`/time-trackings/${editingTracking.value.id}`, trackingForm.value)
    } else {
      await api.post('/time-trackings', trackingForm.value)
    }
    closeTrackingModal()
    await fetchTimeTrackings()
  } catch (error) {
    console.error('Error saving time tracking:', error)
    alert(error.response?.data?.message || 'Error saving time tracking')
  } finally {
    savingTracking.value = false
  }
}

// Schedule Modal
const openScheduleModal = (schedule = null) => {
  editingSchedule.value = schedule
  if (schedule) {
    const startTime = new Date(schedule.start_time)
    const endTime = new Date(schedule.end_time)
    scheduleForm.value = {
      title: schedule.title || '',
      description: schedule.description || '',
      start_time: formatDateTimeLocal(startTime),
      end_time: formatDateTimeLocal(endTime),
      location: schedule.location || '',
      is_completed: schedule.is_completed || false
    }
  } else {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    scheduleForm.value = {
      title: '',
      description: '',
      start_time: formatDateTimeLocal(now),
      end_time: formatDateTimeLocal(oneHourLater),
      location: '',
      is_completed: false
    }
  }
  showScheduleModal.value = true
}

const closeScheduleModal = () => {
  showScheduleModal.value = false
  editingSchedule.value = null
}

const saveSchedule = async () => {
  savingSchedule.value = true
  try {
    const payload = {
      ...scheduleForm.value,
      start_time: new Date(scheduleForm.value.start_time).toISOString(),
      end_time: new Date(scheduleForm.value.end_time).toISOString()
    }
    
    if (editingSchedule.value) {
      await api.put(`/schedules/${editingSchedule.value.id}`, payload)
    } else {
      await api.post('/schedules', payload)
    }
    closeScheduleModal()
    await fetchSchedules()
  } catch (error) {
    console.error('Error saving schedule:', error)
    alert(error.response?.data?.message || 'Error saving schedule')
  } finally {
    savingSchedule.value = false
  }
}

const toggleScheduleComplete = async (schedule) => {
  try {
    await api.put(`/schedules/${schedule.id}`, {
      is_completed: !schedule.is_completed
    })
    await fetchSchedules()
  } catch (error) {
    console.error('Error updating schedule:', error)
  }
}

// Format Functions
const formatDuration = (minutes) => {
  if (!minutes) return '0m'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

const formatTimerTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const formatDateTimeLocal = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Lifecycle
onMounted(() => {
  fetchTimeTrackings()
  fetchSchedules()
  pomodoroSeconds.value = pomodoroSettings.value.workMinutes * 60
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  if (pomodoroInterval.value) {
    clearInterval(pomodoroInterval.value)
  }
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
</style>
