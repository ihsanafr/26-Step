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
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Habits & Streak</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Build good habits and track your streaks</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Summary Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Habits -->
        <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Total Habits</span>
            <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">{{ summary.totalHabits }}</p>
          <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">{{ summary.activeHabits }} active</p>
        </div>

        <!-- Active Streaks -->
        <div class="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 dark:border-orange-900/50 dark:from-orange-900/20 dark:to-orange-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-orange-700 dark:text-orange-400">Active Streaks</span>
            <div class="rounded-lg bg-orange-200 p-2 dark:bg-orange-900/50">
              <svg class="h-5 w-5 text-orange-700 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-orange-900 dark:text-orange-300">{{ summary.activeStreaks }}</p>
          <p class="mt-1 text-xs text-orange-600 dark:text-orange-400">Habits in progress</p>
        </div>

        <!-- Completion Rate -->
        <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Today's Completion</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ summary.todayCompletion }}%</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">{{ summary.todayCompleted }}/{{ summary.todayTotal }}</p>
        </div>

        <!-- Longest Streak -->
        <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">Longest Streak</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ summary.longestStreak }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">Days record</p>
        </div>
      </div>

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
              v-model="searchQuery"
              type="text"
              placeholder="Search habits..."
              class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <select
            v-model="filterStatus"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Habits</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <button
            @click="openHabitModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
        </div>
      </div>

      <!-- Habits List -->
      <div v-if="loadingHabits" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <div v-else-if="filteredHabits.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No habits found</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first habit to start tracking</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="habit in filteredHabits"
          :key="habit.id"
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
        >
          <!-- Habit Header -->
          <div class="mb-4 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl',
                  getHabitColorClass(habit.color)
                ]"
              >
                {{ habit.icon || '🔥' }}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ habit.name }}</h3>
                <p v-if="habit.description" class="mt-1 text-xs text-gray-600 dark:text-gray-400">{{ habit.description }}</p>
              </div>
            </div>
            <button
              @click="openHabitModal(habit)"
              class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          <!-- Streak Info -->
          <div class="mb-4 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Current Streak</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ habit.current_streak || 0 }} days 🔥</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Longest Streak</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ habit.longest_streak || 0 }} days</span>
            </div>
            <div v-if="habit.target_days" class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Target</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ habit.target_days }} days</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="habit.target_days" class="mb-4">
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="text-gray-500 dark:text-gray-400">Progress</span>
              <span class="text-gray-500 dark:text-gray-400">{{ Math.round((habit.current_streak / habit.target_days) * 100) }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                :class="getHabitColorClass(habit.color, 'bg')"
                class="h-full transition-all duration-300"
                :style="{ width: `${Math.min((habit.current_streak / habit.target_days) * 100, 100)}%` }"
              ></div>
            </div>
          </div>

          <!-- Quick Check-in -->
          <div class="mb-4">
            <button
              @click="toggleHabitToday(habit)"
              :class="[
                'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
                isHabitCompletedToday(habit)
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              ]"
            >
              <span v-if="isHabitCompletedToday(habit)">✓ Completed Today</span>
              <span v-else>Mark as Done</span>
            </button>
          </div>

          <!-- Calendar View -->
          <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Last 7 Days</div>
            <div class="flex gap-1">
              <div
                v-for="(day, index) in getLast7Days()"
                :key="index"
                :class="[
                  'h-8 flex-1 rounded',
                  isHabitCompletedOnDate(habit, day)
                    ? getHabitColorClass(habit.color, 'bg')
                    : 'bg-gray-100 dark:bg-gray-700'
                ]"
                :title="formatDate(day)"
              ></div>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="mt-4 flex items-center justify-between">
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-xs font-medium',
                habit.is_active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              ]"
            >
              {{ habit.is_active ? 'Active' : 'Inactive' }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Started {{ formatDate(habit.start_date) }}</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Habit Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showHabitModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeHabitModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeHabitModal"></div>
          <Transition name="scale">
            <div
              v-if="showHabitModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingHabit ? 'Edit Habit' : 'Add Habit' }}
              </h2>

              <form @submit.prevent="saveHabit" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                    <input
                      v-model="habitForm.name"
                      type="text"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Exercise, Reading, etc."
                    />
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Days</label>
                    <input
                      v-model.number="habitForm.target_days"
                      type="number"
                      min="1"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="habitForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon (Emoji)</label>
                    <div class="flex gap-2">
                      <input
                        v-model="habitForm.icon"
                        type="text"
                        maxlength="2"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="🔥"
                      />
                      <div class="flex flex-wrap gap-1">
                        <button
                          v-for="emoji in popularIcons"
                          :key="emoji"
                          type="button"
                          @click="habitForm.icon = emoji"
                          class="rounded-lg p-1.5 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                          :class="{ 'bg-blue-100 dark:bg-blue-900/30': habitForm.icon === emoji }"
                        >
                          {{ emoji }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="color in habitColors"
                        :key="color.value"
                        type="button"
                        @click="habitForm.color = color.value"
                        :class="[
                          'h-10 w-10 rounded-lg border-2 transition-all',
                          color.bgClass,
                          habitForm.color === color.value ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : 'border-gray-300 dark:border-gray-700'
                        ]"
                        :title="color.name"
                      ></button>
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                    <input
                      v-model="habitForm.start_date"
                      type="date"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div class="flex items-end">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="habitForm.is_active"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                      />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeHabitModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingHabit"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingHabit">Saving...</span>
                    <span v-else>{{ editingHabit ? 'Update' : 'Add' }}</span>
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
const habits = ref([])
const habitLogs = ref([])
const loadingHabits = ref(false)
const savingHabit = ref(false)

// Filters
const searchQuery = ref('')
const filterStatus = ref('all')

// Modals
const showHabitModal = ref(false)
const editingHabit = ref(null)

// Form
const habitForm = ref({
  name: '',
  description: '',
  target_days: null,
  start_date: new Date().toISOString().split('T')[0],
  is_active: true,
  color: 'blue',
  icon: '🔥'
})

// Habit Colors
const habitColors = [
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-500' },
  { name: 'Green', value: 'green', bgClass: 'bg-green-500' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', bgClass: 'bg-orange-500' },
  { name: 'Red', value: 'red', bgClass: 'bg-red-500' },
  { name: 'Pink', value: 'pink', bgClass: 'bg-pink-500' },
  { name: 'Yellow', value: 'yellow', bgClass: 'bg-yellow-500' },
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-500' }
]

// Popular Icons
const popularIcons = ['🔥', '💪', '📚', '🏃', '🧘', '💧', '🌱', '🎯', '⭐', '✨', '🌟', '💫']

// Computed Summary
const summary = computed(() => {
  const activeHabits = habits.value.filter(h => h.is_active)
  const today = new Date().toISOString().split('T')[0]
  
  const todayTotal = activeHabits.length
  const todayCompleted = activeHabits.filter(h => isHabitCompletedToday(h)).length
  const todayCompletion = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0

  const activeStreaks = activeHabits.filter(h => (h.current_streak || 0) > 0).length
  const longestStreak = Math.max(...habits.value.map(h => h.longest_streak || 0), 0)

  return {
    totalHabits: habits.value.length,
    activeHabits: activeHabits.length,
    activeStreaks,
    todayCompletion,
    todayCompleted,
    todayTotal,
    longestStreak
  }
})

// Computed Filters
const filteredHabits = computed(() => {
  let filtered = habits.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(h =>
      h.name?.toLowerCase().includes(query) ||
      h.description?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (filterStatus.value === 'active') {
    filtered = filtered.filter(h => h.is_active)
  } else if (filterStatus.value === 'inactive') {
    filtered = filtered.filter(h => !h.is_active)
  }

  return filtered.sort((a, b) => {
    // Sort by active status first, then by current streak
    if (a.is_active !== b.is_active) return b.is_active - a.is_active
    return (b.current_streak || 0) - (a.current_streak || 0)
  })
})

// Methods
const fetchHabits = async () => {
  loadingHabits.value = true
  try {
    const response = await api.get('/habits')
    habits.value = response.data
    await fetchHabitLogs()
  } catch (error) {
    console.error('Error fetching habits:', error)
  } finally {
    loadingHabits.value = false
  }
}

const fetchHabitLogs = async (habitId = null) => {
  try {
    if (habitId) {
      const response = await api.get(`/habits/${habitId}/logs`)
      return response.data
    } else {
      // Fetch all logs for all habits
      const allLogs = []
      for (const habit of habits.value) {
        const response = await api.get(`/habits/${habit.id}/logs`)
        allLogs.push(...response.data)
      }
      habitLogs.value = allLogs
    }
  } catch (error) {
    console.error('Error fetching habit logs:', error)
  }
}

const openHabitModal = (habit = null) => {
  editingHabit.value = habit
  if (habit) {
    habitForm.value = {
      name: habit.name || '',
      description: habit.description || '',
      target_days: habit.target_days || null,
      start_date: habit.start_date || new Date().toISOString().split('T')[0],
      is_active: habit.is_active !== undefined ? habit.is_active : true,
      color: habit.color || 'blue',
      icon: habit.icon || '🔥'
    }
  } else {
    habitForm.value = {
      name: '',
      description: '',
      target_days: null,
      start_date: new Date().toISOString().split('T')[0],
      is_active: true,
      color: 'blue',
      icon: '🔥'
    }
  }
  showHabitModal.value = true
}

const closeHabitModal = () => {
  showHabitModal.value = false
  editingHabit.value = null
}

const saveHabit = async () => {
  savingHabit.value = true
  try {
    if (editingHabit.value) {
      await api.put(`/habits/${editingHabit.value.id}`, habitForm.value)
    } else {
      await api.post('/habits', habitForm.value)
    }
    closeHabitModal()
    await fetchHabits()
  } catch (error) {
    console.error('Error saving habit:', error)
    alert(error.response?.data?.message || 'Error saving habit')
  } finally {
    savingHabit.value = false
  }
}

const toggleHabitToday = async (habit) => {
  const today = new Date().toISOString().split('T')[0]
  const isCompleted = isHabitCompletedToday(habit)

  try {
    if (isCompleted) {
      // Find and delete log
      const log = habitLogs.value.find(l => l.habit_id === habit.id && l.date === today)
      if (log) {
        await api.delete(`/habits/${habit.id}/logs/${log.id}`)
      }
    } else {
      // Create log
      await api.post(`/habits/${habit.id}/logs`, {
        date: today,
        completed: true
      })
    }
    await fetchHabitLogs()
    await fetchHabits()
  } catch (error) {
    console.error('Error toggling habit:', error)
    alert('Error updating habit')
  }
}

const updateHabitStreak = async (habit) => {
  try {
    // TODO: Calculate streak based on logs
    // const logs = habitLogs.value.filter(l => l.habit_id === habit.id && l.completed)
    // // Sort by date and calculate current streak
    // // Update habit.current_streak and habit.longest_streak
    // await api.put(`/habits/${habit.id}`, {
    //   current_streak: calculatedStreak,
    //   longest_streak: Math.max(habit.longest_streak, calculatedStreak)
    // })
  } catch (error) {
    console.error('Error updating streak:', error)
  }
}

const isHabitCompletedToday = (habit) => {
  const today = new Date().toISOString().split('T')[0]
  return habitLogs.value.some(log => 
    log.habit_id === habit.id && 
    log.date === today && 
    log.completed
  )
}

const isHabitCompletedOnDate = (habit, date) => {
  const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
  return habitLogs.value.some(log => 
    log.habit_id === habit.id && 
    log.date === dateStr && 
    log.completed
  )
}

const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date)
  }
  return days
}

const getHabitColorClass = (color, type = 'bg') => {
  const colorMap = {
    blue: type === 'bg' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-blue-500',
    green: type === 'bg' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-500',
    purple: type === 'bg' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-purple-500',
    orange: type === 'bg' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-orange-500',
    red: type === 'bg' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-red-500',
    pink: type === 'bg' ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-pink-500',
    yellow: type === 'bg' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-yellow-500',
    indigo: type === 'bg' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-indigo-500'
  }
  return colorMap[color] || colorMap.blue
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = dateString instanceof Date ? dateString : new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Lifecycle
onMounted(() => {
  fetchHabits()
  fetchHabitLogs()
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
