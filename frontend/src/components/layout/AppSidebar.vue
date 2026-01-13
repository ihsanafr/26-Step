<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && setIsHovered(true)"
    @mouseleave="setIsHovered(false)"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/dashboard" class="text-xl font-bold text-gray-800 dark:text-white">
        <span v-if="isExpanded || isHovered || isMobileOpen">26-step</span>
        <span v-else>26</span>
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <ul class="flex flex-col gap-4">
            <li v-for="item in menuItems" :key="item.name">
              <router-link
                :to="item.path"
                :class="[
                  'menu-item group',
                  {
                    'menu-item-active': isActive(item.path),
                    'menu-item-inactive': !isActive(item.path),
                  },
                ]"
              >
                <span
                  :class="[
                    isActive(item.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      :d="item.iconPath"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span
                  v-if="isExpanded || isHovered || isMobileOpen"
                  class="menu-item-text"
                  >{{ item.name }}</span
                >
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    iconPath:
      'M2.5 10L9.16667 3.33333L15.8333 3.33333L17.5 10L15.8333 16.6667L9.16667 16.6667L2.5 10Z',
  },
  {
    name: 'Tugas & Target',
    path: '/tasks',
    iconPath:
      'M10 2.5L2.5 7.5V17.5L10 22.5L17.5 17.5V7.5L10 2.5Z M10 10V17.5 M6.66667 13.3333H13.3333',
  },
  {
    name: 'Keuangan',
    path: '/finance',
    iconPath: 'M2.5 5L10 2.5L17.5 5V15L10 17.5L2.5 15V5Z M10 5V17.5 M5 10H15',
  },
  {
    name: 'Produktivitas',
    path: '/productivity',
    iconPath: 'M2.5 10H17.5M10 2.5V17.5',
  },
  {
    name: 'Kebiasaan',
    path: '/habits',
    iconPath:
      'M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5Z',
  },
  {
    name: 'Penyimpanan',
    path: '/storage',
    iconPath: 'M2.5 5H17.5V15H2.5V5Z M7.5 2.5V5 M12.5 2.5V5',
  },
  {
    name: 'Resep',
    path: '/recipes',
    iconPath:
      'M10 2.5L15 7.5V17.5H5V7.5L10 2.5Z M10 2.5V10 M5 10H15 M5 17.5H15',
  },
]

const isActive = (path) => {
  return route.path === path
}
</script>

