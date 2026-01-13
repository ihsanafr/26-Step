<template>
  <slot></slot>
</template>

<script setup>
import { ref, provide, watch, computed } from 'vue'

// Initialize theme immediately from localStorage
const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme || 'light'

// Apply theme immediately to document
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const theme = ref(initialTheme)
const isDarkMode = computed(() => theme.value === 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Watch theme changes and update localStorage and DOM
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

