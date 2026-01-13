<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Title -->
      <div class="mb-8 text-center">
        <div class="mb-4 flex justify-center">
          <img :src="logoUrl" alt="26-step" class="h-16 w-16" />
        </div>
        <h1 class="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
          <span class="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">
            26-step
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-400">Buat akun baru Anda</p>
      </div>

      <!-- Register Form -->
      <div class="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-theme-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/80">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Lengkap
            </label>
            <input
              type="text"
              v-model="form.name"
              required
              placeholder="Nama Anda"
              class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-500"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              v-model="form.email"
              required
              placeholder="nama@email.com"
              class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-500"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              v-model="form.password"
              required
              placeholder="Minimal 8 karakter"
              class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-500"
            />
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Konfirmasi Password
            </label>
            <input
              type="password"
              v-model="form.password_confirmation"
              required
              placeholder="Ulangi password"
              class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-500"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
            <p class="text-sm font-medium text-error-600 dark:text-error-400">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-theme-sm transition-all duration-300 hover:bg-brand-600 hover:shadow-theme-md focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="!loading">Daftar</span>
            <span v-else class="flex items-center justify-center">
              <svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?
            <router-link
              to="/login"
              class="font-semibold text-brand-600 transition-colors duration-200 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Masuk di sini
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoUrl from '@/assets/logo.svg'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(form.value)
    router.push('/dashboard')
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Registrasi gagal'
    if (typeof errorMessage === 'object' && errorMessage.email) {
      error.value = Array.isArray(errorMessage.email) ? errorMessage.email[0] : errorMessage.email
    } else if (typeof errorMessage === 'string') {
      error.value = errorMessage
    } else {
      error.value = 'Registrasi gagal. Periksa data yang Anda masukkan.'
    }
  } finally {
    loading.value = false
  }
}
</script>

