<template>
  <header
    class="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b"
  >
    <div class="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
      <div
        class="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
      >
        <button
          @click="handleToggle"
          class="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
        >
          <svg
            v-if="isMobileOpen"
            class="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
              fill=""
            />
          </svg>
          <svg
            v-else
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center">
            <img :src="logoUrl" alt="26-step" class="h-10 w-10" />
          </div>
          <div class="text-xl font-bold text-gray-800 dark:text-white">
            26-step
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0"
      >
        <div class="flex items-center gap-2 2xsm:gap-3">
          <button
            @click="toggleTheme"
            class="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
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
                d="M10 3.33333C6.32666 3.33333 3.33334 6.32666 3.33334 10C3.33334 13.6733 6.32666 16.6667 10 16.6667C13.6733 16.6667 16.6667 13.6733 16.6667 10C16.6667 9.14166 16.475 8.32499 16.125 7.59166C15.9417 7.20833 15.4833 7.11666 15.1 7.3C14.7167 7.48333 14.625 7.94166 14.8083 8.325C15.05 8.83333 15.1667 9.4 15.1667 10C15.1667 12.875 12.875 15.1667 10 15.1667C7.12501 15.1667 4.83334 12.875 4.83334 10C4.83334 7.125 7.12501 4.83333 10 4.83333C10.6 4.83333 11.1667 4.95 11.675 5.19166C12.0583 5.375 12.5167 5.28333 12.7 4.9C12.8833 4.51666 12.7917 4.05833 12.4083 3.875C11.675 3.52499 10.8583 3.33333 10 3.33333Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.50001 17.5H4.16668C3.72465 17.5 3.30073 17.3244 2.98815 17.0118C2.67558 16.6993 2.50001 16.2754 2.50001 15.8333V4.16667C2.50001 3.72464 2.67558 3.30072 2.98815 2.98814C3.30073 2.67557 3.72465 2.5 4.16668 2.5H7.50001M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.50001"
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import logoUrl from '@/assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()
const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar()
const { isDarkMode, toggleTheme } = useTheme()

const handleToggle = () => {
  if (window.innerWidth >= 1024) {
    toggleSidebar()
  } else {
    toggleMobileSidebar()
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

