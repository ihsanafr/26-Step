<template>
  <div class="fixed bottom-6 right-6 z-40">
    <Transition name="slide-up">
      <div
        v-if="isOpen"
        class="w-80 rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-800"
      >
        <!-- Header -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h3>
          <button
            @click="closeTimer"
            class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Timer Display -->
        <div class="mb-6 text-center">
          <div class="relative mx-auto mb-4 h-48 w-48">
            <svg class="h-48 w-48 -rotate-90 transform">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                :class="isRunning ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                class="transition-all duration-1000"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ formattedTime }}</div>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ currentMode === 'work' ? 'Focus Time' : 'Break Time' }}</div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="mb-4 flex items-center justify-center gap-2">
          <button
            v-for="mode in modes"
            :key="mode.value"
            @click="setMode(mode.value)"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              currentMode === mode.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            {{ mode.label }}
          </button>
        </div>

        <div class="flex items-center justify-center gap-3">
          <button
            @click="toggleTimer"
            class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
          >
            <svg v-if="!isRunning" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ isRunning ? 'Pause' : 'Start' }}
          </button>
          <button
            @click="resetTimer"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>

        <!-- Task Selection -->
        <div v-if="tasks && tasks.length > 0" class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Working on:</label>
          <select
            v-model="selectedTaskId"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          >
            <option value="">No task selected</option>
            <option v-for="task in activeTasks" :key="task.id" :value="task.id">
              {{ task.title }}
            </option>
          </select>
        </div>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <button
      v-if="!isOpen"
      @click="openTimer"
      class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-110 active:scale-95"
      title="Open Pomodoro Timer"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['task-complete'])

const isOpen = ref(false)
const isRunning = ref(false)
const currentMode = ref('work') // 'work' or 'break'
const timeLeft = ref(25 * 60) // 25 minutes in seconds
const selectedTaskId = ref('')

const modes = [
  { value: 'work', label: 'Work', duration: 25 },
  { value: 'short', label: 'Short Break', duration: 5 },
  { value: 'long', label: 'Long Break', duration: 15 }
]

let timerInterval = null

const circumference = 2 * Math.PI * 88
const progressOffset = computed(() => {
  const total = currentMode.value === 'work' ? 25 * 60 : currentMode.value === 'short' ? 5 * 60 : 15 * 60
  const progress = timeLeft.value / total
  return circumference * (1 - progress)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const activeTasks = computed(() => {
  return props.tasks.filter(t => t.status !== 'completed')
})

const openTimer = () => {
  isOpen.value = true
}

const closeTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  isOpen.value = false
}

const setMode = (mode) => {
  currentMode.value = mode
  const modeConfig = modes.find(m => m.value === mode)
  timeLeft.value = modeConfig.duration * 60
  if (isRunning.value) {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }
}

const toggleTimer = () => {
  if (isRunning.value) {
    // Pause
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  } else {
    // Start
    isRunning.value = true
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // Timer completed
        handleTimerComplete()
      }
    }, 1000)
  }
}

const resetTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  const modeConfig = modes.find(m => m.value === currentMode.value)
  timeLeft.value = modeConfig.duration * 60
}

const handleTimerComplete = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  // Play notification sound (if browser allows)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Complete!', {
      body: currentMode.value === 'work' ? 'Time for a break!' : 'Break time is over!',
      icon: '/favicon.ico'
    })
  }

  // Auto-switch mode
  if (currentMode.value === 'work') {
    currentMode.value = 'short'
    timeLeft.value = 5 * 60
  } else {
    currentMode.value = 'work'
    timeLeft.value = 25 * 60
  }

  // If task is selected, mark progress
  if (selectedTaskId.value) {
    emit('task-complete', selectedTaskId.value)
  }
}

onMounted(() => {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-leave-active {
  transition: all 0.2s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>

