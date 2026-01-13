<script setup>
import { RouterView } from 'vue-router'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import Toast from './components/Toast.vue'
</script>

<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
      <Toast />
    </SidebarProvider>
  </ThemeProvider>
</template>
