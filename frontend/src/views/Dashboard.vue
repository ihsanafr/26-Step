<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center">
              <img :src="logoUrl" alt="26-step" class="h-10 w-10" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">26-step</h2>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Toggle theme"
            >
              <svg
                v-if="!isDarkMode"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.33333V1.66666M10 18.3333V16.6667M16.6667 10H18.3334M1.66669 10H3.33335M15.7742 4.22583L17.0167 2.98333M2.98335 17.0167L4.22585 15.7742M15.7742 15.7742L17.0167 17.0167M2.98335 2.98333L4.22585 4.22583M14.1667 10C14.1667 12.3012 12.3012 14.1667 10 14.1667C7.69882 14.1667 5.83335 12.3012 5.83335 10C5.83335 7.69882 7.69882 5.83333 10 5.83333C12.3012 5.83333 14.1667 7.69882 14.1667 10Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.33333C6.32499 3.33333 3.33333 6.32499 3.33333 10C3.33333 13.675 6.32499 16.6667 10 16.6667C13.675 16.6667 16.6667 13.675 16.6667 10C16.6667 9.62499 16.6333 9.25833 16.5833 8.89999C16.3917 9.32499 16.0833 9.68333 15.7 9.94166C15.3167 10.2 14.875 10.3417 14.4167 10.35C13.9583 10.3583 13.5083 10.2417 13.1167 10.0083C12.725 9.77499 12.4083 9.43333 12.2 9.025C11.9917 8.61666 11.9 8.15833 11.9333 7.69999C11.9667 7.24166 12.125 6.79999 12.3917 6.42499C12.6583 6.04999 13.025 5.75833 13.4417 5.58333C13.15 4.73333 12.6417 3.96666 11.9667 3.35833C11.2917 2.74999 10.475 2.31666 9.59166 2.09999C8.70833 1.88333 7.78333 1.89166 6.89999 2.12499C6.01666 2.35833 5.20833 2.80833 4.54999 3.43333C3.89166 4.05833 3.40833 4.84166 3.14999 5.70833C2.89166 6.57499 2.86666 7.49166 3.07499 8.37499C3.28333 9.25833 3.71666 10.075 4.32499 10.75C4.93333 11.425 5.69999 11.9333 6.54999 12.225C6.90833 12.275 7.27499 12.3083 7.64999 12.3083H10"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Logout Button -->
            <button
              @click="showLogoutModal = true"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 md:py-12">
      <div class="mb-8">
        <h1 class="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Welcome to 26-step
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Manage your daily life more efficiently
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="module in modules"
          :key="module.path"
          :to="module.path"
          class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-theme-lg dark:border-gray-800 dark:bg-gray-800"
        >
          <!-- Gradient Background -->
          <div
            :class="[
              'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              module.gradient
            ]"
          ></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <!-- Icon -->
            <div
              :class="[
                'mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110',
                module.iconBg
              ]"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="module.iconColor"
              >
                <path
                  :d="module.iconPath"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            
            <!-- Title -->
            <h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
              {{ module.title }}
            </h2>
            
            <!-- Description -->
            <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {{ module.description }}
            </p>
            
            <!-- Arrow Icon -->
            <div class="flex items-center text-sm font-medium" :class="module.textColor">
              <span>Start</span>
              <svg
                class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </router-link>
      </div>
    </main>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLogoutModal"
          class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto"
          @click.self="showLogoutModal = false"
        >
          <!-- Backdrop -->
          <div
            class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
            aria-hidden="true"
            @click="showLogoutModal = false"
          ></div>

          <!-- Modal Content -->
          <Transition name="scale">
            <div
              v-if="showLogoutModal"
              class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
            >
        <!-- Icon -->
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
          <svg
            class="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="mb-2 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Confirm Logout
        </h3>

        <!-- Message -->
        <p class="mb-6 text-center text-gray-600 dark:text-gray-400">
          Are you sure you want to logout? You will need to login again to access the dashboard.
        </p>

        <!-- Buttons -->
        <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            @click="showLogoutModal = false"
            class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto"
          >
            Cancel
          </button>
          <button
            @click="confirmLogout"
            class="flex w-full items-center justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 sm:w-auto"
          >
            Yes, Logout
          </button>
        </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const { isDarkMode, toggleTheme } = useTheme()

const showLogoutModal = ref(false)

const confirmLogout = async () => {
  showLogoutModal.value = false
  await authStore.logout()
  router.push('/')
}

const modules = [
  {
    title: 'Tasks & Targets',
    path: '/tasks',
    description: 'Manage daily tasks and achieve your targets',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-600 dark:text-blue-400',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
  },
  {
    title: 'Personal Finance',
    path: '/finance',
    description: 'Manage finances, budgets, and savings',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-500/20 dark:to-emerald-600/20',
    iconBg: 'bg-green-100 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-600 dark:text-green-400',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Productivity & Time',
    path: '/productivity',
    description: 'Time tracking and increase productivity',
    gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-600/20',
    iconBg: 'bg-purple-100 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    textColor: 'text-purple-600 dark:text-purple-400',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Habits & Streaks',
    path: '/habits',
    description: 'Build good habits and maintain streaks',
    gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/20 dark:to-orange-600/20',
    iconBg: 'bg-orange-100 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    textColor: 'text-orange-600 dark:text-orange-400',
    iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
  },
  {
    title: 'Storage',
    path: '/storage',
    description: 'Files and important links',
    gradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-600/20',
    iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    iconPath: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h12a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'
  },
  {
    title: 'Journal & Notes',
    path: '/journals',
    description: 'Reflect on your experiences and quick notes',
    gradient: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-500/20 dark:to-pink-600/20',
    iconBg: 'bg-pink-100 dark:bg-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
    textColor: 'text-pink-600 dark:text-pink-400',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
]
</script>

<style scoped>
/* Fade Animation for Backdrop */
.fade-enter-active {
  transition: opacity 0.25s ease;
}

.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Animation for Modal Content */
.scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-leave-active {
  transition: all 0.2s ease-in;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>

