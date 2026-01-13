<template>
  <div class="animate-pulse">
    <div v-if="type === 'card'" class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="type === 'list'" class="space-y-3">
      <div v-for="i in count" :key="i" class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'table'" class="space-y-3">
      <div v-for="i in count" :key="i" class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
        <div class="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>

    <div v-else class="space-y-2">
      <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'card', 'list', 'table'].includes(value)
  },
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

