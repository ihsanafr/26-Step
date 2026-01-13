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
              class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tasks & Targets</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Manage your daily tasks and achieve your goals</p>
            </div>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleTheme"
            class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800"
            title="Toggle theme"
          >
            <svg
              v-if="!isDarkMode"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Tabs -->
      <div class="mb-6">
        <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <button
            @click="activeTab = 'tasks'"
            :class="[
              'flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out',
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-sm scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            ]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Tasks</span>
          </button>
          <button
            @click="activeTab = 'targets'"
            :class="[
              'flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out',
              activeTab === 'targets'
                ? 'bg-blue-600 text-white shadow-sm scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            ]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Targets</span>
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-in-out',
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-sm scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            ]"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categories</span>
          </button>
        </div>
      </div>

      <!-- Summary Dashboard -->
      <div v-if="activeTab === 'tasks'" class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Tasks -->
        <div class="group relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 transition-all hover:shadow-lg hover:scale-105 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Total Tasks</span>
            <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-blue-900 dark:text-blue-300">{{ tasks.length }}</p>
          <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">{{ completedTasks }} completed</p>
        </div>

        <!-- In Progress -->
        <div class="group relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 transition-all hover:shadow-lg hover:scale-105 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">In Progress</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-purple-900 dark:text-purple-300">{{ inProgressTasks }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">{{ completionRate }}% completion rate</p>
        </div>

        <!-- High Priority -->
        <div class="group relative overflow-hidden rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5 transition-all hover:shadow-lg hover:scale-105 dark:border-red-900/50 dark:from-red-900/20 dark:to-red-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-red-700 dark:text-red-400">High Priority</span>
            <div class="rounded-lg bg-red-200 p-2 dark:bg-red-900/50">
              <svg class="h-5 w-5 text-red-700 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-red-900 dark:text-red-300">{{ highPriorityTasks }}</p>
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">urgent tasks</p>
        </div>

        <!-- Today's Tasks -->
        <div class="group relative overflow-hidden rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 transition-all hover:shadow-lg hover:scale-105 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Today</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-3xl font-bold text-green-900 dark:text-green-300">{{ todayTasks }}</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">due today</p>
        </div>
      </div>

      <!-- View Mode Selector -->
      <div v-if="activeTab === 'tasks'" class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <button
            @click="taskViewMode = 'grid'"
            :class="[
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              taskViewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
            title="Grid View"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="taskViewMode = 'list'"
            :class="[
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              taskViewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
            title="List View"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            @click="taskViewMode = 'kanban'"
            :class="[
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              taskViewMode === 'kanban'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
            title="Kanban View"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tasks Tab -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'tasks'" :key="'tasks-tab'" style="will-change: transform, opacity;">
        <!-- Action Bar -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <!-- Search & Filters -->
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="taskSearchQuery"
                type="text"
                placeholder="Search tasks..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <!-- Filters -->
            <div class="flex gap-2">
              <select
                v-model="taskStatusFilter"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                v-model="taskPriorityFilter"
                class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <button
                @click="showQuickActions = !showQuickActions"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                Quick Actions
              </button>
              <div
                v-if="showQuickActions"
                class="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  @click="openTaskTemplateModal"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  📋 Use Template
                </button>
                <button
                  @click="bulkComplete"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  ✅ Complete Selected
                </button>
                <button
                  @click="bulkDelete"
                  class="block w-full px-4 py-2 text-left text-sm text-red-600 transition-all hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                >
                  🗑️ Delete Selected
                </button>
              </div>
            </div>
            <button
              @click="openTaskModal()"
              class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="mb-4 flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            v-model="taskSortBy"
            class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="created">Date Created</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button
            @click="taskSortOrder = taskSortOrder === 'asc' ? 'desc' : 'asc'"
            class="rounded-lg border border-gray-300 bg-white p-1.5 text-gray-600 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="taskSortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Tasks List -->
        <div v-if="loadingTasks">
          <SkeletonLoader type="card" :count="3" />
        </div>

        <div v-else-if="tasks.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No tasks found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No tasks match your filters</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          <button
            @click="taskSearchQuery = ''; taskStatusFilter = ''; taskPriorityFilter = ''"
            class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>

        <!-- Grid View -->
        <div v-if="taskViewMode === 'grid' && filteredTasks.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-800"
            :class="{ 'ring-2 ring-blue-500': selectedTasks.includes(task.id) }"
          >
            <!-- Checkbox for selection -->
            <div class="absolute left-4 top-4">
              <input
                type="checkbox"
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
              />
            </div>

            <!-- Priority Indicator -->
            <div
              v-if="task.priority"
              :class="[
                'absolute top-0 left-0 h-1 w-full',
                task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              ]"
            ></div>

            <!-- Task Header -->
            <div class="mb-3 flex items-start justify-between pl-6">
              <div class="flex-1">
                <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
                <p v-if="task.category" class="text-xs text-gray-500 dark:text-gray-400">{{ task.category }}</p>
              </div>

              <!-- Actions Menu -->
              <div class="relative">
                <button
                  @click="toggleTaskMenu(task.id)"
                  class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="openTaskMenuId === task.id"
                  class="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <button
                    @click="openTaskModal(task); toggleTaskMenu(null)"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-all hover:bg-gray-100 active:scale-95 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTask(task.id); toggleTaskMenu(null)"
                    class="block w-full px-4 py-2 text-left text-sm text-red-600 transition-all hover:bg-gray-100 active:scale-95 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Description -->
            <p v-if="task.description" class="mb-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ task.description }}
            </p>

            <!-- Progress Bar -->
            <div v-if="task.progress !== null && task.progress !== undefined" class="mb-3">
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="text-gray-600 dark:text-gray-400">Progress</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ task.progress }}%</span>
              </div>
              <div class="relative h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  :class="[
                    'h-full transition-all duration-500 ease-out',
                    task.progress === 100
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : task.progress >= 75
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : task.progress >= 50
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  ]"
                  :style="{ width: `${task.progress}%` }"
                ></div>
                <!-- Animated shimmer effect -->
                <div
                  v-if="task.progress > 0 && task.progress < 100"
                  class="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                ></div>
              </div>
            </div>

            <!-- Achievement Badge -->
            <div v-if="task.status === 'completed'" class="mb-3 flex items-center gap-2">
              <div class="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1">
                <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-xs font-semibold text-white">Completed!</span>
              </div>
              <span v-if="task.completed_at" class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(task.completed_at) }}
              </span>
            </div>

            <!-- Task Footer -->
            <div class="flex items-center justify-between">
              <!-- Status Badge -->
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : task.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ formatStatus(task.status) }}
              </span>

              <!-- Due Date -->
              <span
                v-if="task.due_date"
                :class="[
                  'flex items-center gap-1 text-xs',
                  isOverdue(task.due_date) && task.status !== 'completed'
                    ? 'font-semibold text-red-600 dark:text-red-400'
                    : isDueToday(task.due_date) && task.status !== 'completed'
                    ? 'font-semibold text-orange-600 dark:text-orange-400'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(task.due_date) }}
                <span v-if="isOverdue(task.due_date) && task.status !== 'completed'" class="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  OVERDUE
                </span>
                <span v-else-if="isDueToday(task.due_date) && task.status !== 'completed'" class="ml-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  TODAY
                </span>
              </span>
            </div>

            <!-- Quick Actions -->
            <div class="mt-3 flex gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <button
                v-if="task.status !== 'completed'"
                @click="updateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')"
                :class="[
                  'flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95',
                  task.status === 'pending'
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700'
                ]"
              >
                <span class="flex items-center justify-center gap-1">
                  <svg v-if="task.status === 'in_progress'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ task.status === 'pending' ? 'Start' : 'Complete' }}
                </span>
              </button>
              <button
                v-else
                @click="updateTaskStatus(task.id, 'pending')"
                class="flex-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Reopen
              </button>
              <button
                @click="openTaskModal(task)"
                class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-if="taskViewMode === 'list'">
          <div v-if="filteredTasks.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No tasks to display</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ tasks.length === 0 ? 'Get started by creating a new task' : 'Try adjusting your search or filters' }}
            </p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] dark:border-gray-800 dark:bg-gray-800"
              :class="{ 'ring-2 ring-blue-500': selectedTasks.includes(task.id) }"
            >
              <!-- Checkbox -->
              <input
                type="checkbox"
                :checked="selectedTasks.includes(task.id)"
                @change="toggleTaskSelection(task.id)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
              />

              <!-- Priority Indicator -->
              <div
                v-if="task.priority"
                :class="[
                  'h-full w-1 rounded-full',
                  task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                ]"
              ></div>

              <!-- Task Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="mb-1 text-base font-semibold text-gray-900 dark:text-white">{{ task.title }}</h3>
                    <p v-if="task.description" class="mb-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {{ task.description }}
                    </p>
                    <div class="flex items-center gap-3">
                      <span
                        v-if="task.category"
                        class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {{ task.category }}
                      </span>
                      <span
                        :class="[
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        ]"
                      >
                        {{ formatStatus(task.status) }}
                      </span>
                      <span
                        v-if="task.due_date"
                        :class="[
                          'flex items-center gap-1 text-xs',
                          isOverdue(task.due_date) && task.status !== 'completed'
                            ? 'font-semibold text-red-600 dark:text-red-400'
                            : isDueToday(task.due_date) && task.status !== 'completed'
                            ? 'font-semibold text-orange-600 dark:text-orange-400'
                            : 'text-gray-500 dark:text-gray-400'
                        ]"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(task.due_date) }}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Progress Bar -->
                <div v-if="task.progress !== null && task.progress !== undefined" class="mt-2">
                  <div class="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      :class="[
                        'h-full transition-all duration-500 ease-out',
                        task.progress === 100
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : task.progress >= 75
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : task.progress >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      ]"
                      :style="{ width: `${task.progress}%` }"
                    ></div>
                  </div>
                  <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ task.progress }}%</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  v-if="task.status !== 'completed'"
                  @click="updateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')"
                  :class="[
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95',
                    task.status === 'pending'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm hover:from-green-600 hover:to-green-700'
                  ]"
                >
                  {{ task.status === 'pending' ? 'Start' : 'Complete' }}
                </button>
                <button
                  @click="openTaskModal(task)"
                  class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanban View -->
        <div v-if="taskViewMode === 'kanban'">
          <div v-if="filteredTasks.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No tasks to display</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ tasks.length === 0 ? 'Get started by creating a new task' : 'Try adjusting your search or filters' }}
            </p>
          </div>
          <div v-else class="pb-4">
            <div class="grid grid-cols-3 gap-4">
            <!-- Pending Column -->
            <div 
              class="flex flex-col"
              @dragover.prevent="draggedOverColumn = 'pending'"
              @dragleave.prevent="draggedOverColumn = null"
              @drop.prevent="handleDrop($event, 'pending')"
              :class="{ 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2 transition-colors': draggedOverColumn === 'pending' && draggedTask }"
            >
              <div class="mb-3 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Pending</h3>
                <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {{ getTasksByStatus('pending').length }}
                </span>
              </div>
              <div class="space-y-3 min-h-[200px]">
                <div
                  v-for="task in getTasksByStatus('pending')"
                  :key="task.id"
                  draggable="true"
                  @dragstart="handleDragStart($event, task)"
                  @dragend="handleDragEnd"
                  class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-move dark:border-gray-800 dark:bg-gray-800"
                  :class="{ 
                    'ring-2 ring-blue-500': selectedTasks.includes(task.id)
                  }"
                >
                  <div class="mb-2 flex items-start justify-between">
                    <input
                      type="checkbox"
                      :checked="selectedTasks.includes(task.id)"
                      @change="toggleTaskSelection(task.id)"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                    />
                    <div
                      v-if="task.priority"
                      :class="[
                        'h-1 w-full rounded-full',
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      ]"
                    ></div>
                  </div>
                  <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">{{ task.title }}</h4>
                  <p v-if="task.description" class="mb-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ task.description }}
                  </p>
                  <div class="mt-2 flex items-center justify-between">
                    <span
                      v-if="task.category"
                      class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {{ task.category }}
                    </span>
                    <button
                      @click="updateTaskStatus(task.id, 'in_progress')"
                      class="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 transition-all hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- In Progress Column -->
            <div 
              class="flex flex-col"
              @dragover.prevent="draggedOverColumn = 'in_progress'"
              @dragleave.prevent="draggedOverColumn = null"
              @drop.prevent="handleDrop($event, 'in_progress')"
              :class="{ 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2 transition-colors': draggedOverColumn === 'in_progress' && draggedTask }"
            >
              <div class="mb-3 flex items-center justify-between rounded-lg bg-blue-100 px-4 py-2 dark:bg-blue-900/30">
                <h3 class="font-semibold text-blue-700 dark:text-blue-400">In Progress</h3>
                <span class="rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                  {{ getTasksByStatus('in_progress').length }}
                </span>
              </div>
              <div class="space-y-3 min-h-[200px]">
                <div
                  v-for="task in getTasksByStatus('in_progress')"
                  :key="task.id"
                  draggable="true"
                  @dragstart="handleDragStart($event, task)"
                  @dragend="handleDragEnd"
                  class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-move dark:border-gray-800 dark:bg-gray-800"
                  :class="{ 
                    'ring-2 ring-blue-500': selectedTasks.includes(task.id)
                  }"
                >
                  <div class="mb-2 flex items-start justify-between">
                    <input
                      type="checkbox"
                      :checked="selectedTasks.includes(task.id)"
                      @change="toggleTaskSelection(task.id)"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                    />
                    <div
                      v-if="task.priority"
                      :class="[
                        'h-1 w-full rounded-full',
                        task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      ]"
                    ></div>
                  </div>
                  <h4 class="mb-1 font-semibold text-gray-900 dark:text-white">{{ task.title }}</h4>
                  <p v-if="task.description" class="mb-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ task.description }}
                  </p>
                  <div v-if="task.progress !== null && task.progress !== undefined" class="mb-2">
                    <div class="relative h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        :style="{ width: `${task.progress}%` }"
                      ></div>
                    </div>
                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ task.progress }}%</div>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <span
                      v-if="task.category"
                      class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {{ task.category }}
                    </span>
                    <button
                      @click="updateTaskStatus(task.id, 'completed')"
                      class="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700 transition-all hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Completed Column -->
            <div 
              class="flex flex-col"
              @dragover.prevent="draggedOverColumn = 'completed'"
              @dragleave.prevent="draggedOverColumn = null"
              @drop.prevent="handleDrop($event, 'completed')"
              :class="{ 'bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-2 transition-colors': draggedOverColumn === 'completed' && draggedTask }"
            >
              <div class="mb-3 flex items-center justify-between rounded-lg bg-green-100 px-4 py-2 dark:bg-green-900/30">
                <h3 class="font-semibold text-green-700 dark:text-green-400">Completed</h3>
                <span class="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-400">
                  {{ getTasksByStatus('completed').length }}
                </span>
              </div>
              <div class="space-y-3 min-h-[200px]">
                <div
                  v-for="task in getTasksByStatus('completed')"
                  :key="task.id"
                  draggable="true"
                  @dragstart="handleDragStart($event, task)"
                  @dragend="handleDragEnd"
                  class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-move dark:border-gray-800 dark:bg-gray-800 opacity-75"
                  :class="{ 
                    'ring-2 ring-blue-500': selectedTasks.includes(task.id)
                  }"
                >
                  <div class="mb-2 flex items-start justify-between">
                    <input
                      type="checkbox"
                      :checked="selectedTasks.includes(task.id)"
                      @change="toggleTaskSelection(task.id)"
                      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                    />
                  </div>
                  <h4 class="mb-1 font-semibold text-gray-900 line-through dark:text-white">{{ task.title }}</h4>
                  <p v-if="task.description" class="mb-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 line-through">
                    {{ task.description }}
                  </p>
                  <div class="mt-2 flex items-center justify-between">
                    <span
                      v-if="task.category"
                      class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {{ task.category }}
                    </span>
                    <button
                      @click="updateTaskStatus(task.id, 'pending')"
                      class="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>
      </Transition>

      <!-- Targets Tab -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'targets'" :key="'targets-tab'" style="will-change: transform, opacity;">
        <!-- Targets Summary -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Total Targets</span>
              <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
                <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-blue-900 dark:text-blue-300">{{ targets.length }}</p>
            <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">{{ completedTargets }} achieved</p>
          </div>

          <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-green-700 dark:text-green-400">In Progress</span>
              <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
                <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-green-900 dark:text-green-300">{{ inProgressTargets }}</p>
            <p class="mt-1 text-xs text-green-600 dark:text-green-400">active targets</p>
          </div>

          <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-sm font-medium text-purple-700 dark:text-purple-400">Avg Progress</span>
              <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
                <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-purple-900 dark:text-purple-300">{{ averageProgress }}%</p>
            <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">completion rate</p>
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
                v-model="targetSearchQuery"
                type="text"
                placeholder="Search targets..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            @click="openTargetModal()"
            class="ml-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Target
          </button>
        </div>

        <!-- Targets List -->
        <div v-if="targets.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No targets found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first target to track your progress</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2">
          <div
            v-for="target in filteredTargets"
            :key="target.id"
            class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-800"
          >
            <!-- Achievement Badge -->
            <div v-if="getProgressPercentage(target) >= 100" class="absolute right-4 top-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg">
                <svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div class="mb-4 flex items-start justify-between">
              <div class="flex-1">
                <h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">{{ target.title }}</h3>
                <p v-if="target.description" class="text-sm text-gray-600 dark:text-gray-400">{{ target.description }}</p>
              </div>
              <button
                @click="openTargetModal(target)"
                class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <!-- Progress -->
            <div class="mb-4">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Progress</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ target.current_value }} / {{ target.target_value }}
                </span>
              </div>
              <div class="relative h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  :class="[
                    'h-full transition-all duration-500 ease-out',
                    getProgressPercentage(target) >= 100 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : getProgressPercentage(target) >= 75
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : getProgressPercentage(target) >= 50
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  ]"
                  :style="{ width: `${Math.min(getProgressPercentage(target), 100)}%` }"
                ></div>
                <!-- Progress indicator dots -->
                <div class="absolute inset-0 flex items-center">
                  <div
                    v-for="i in 4"
                    :key="i"
                    class="h-full flex-1 border-r border-white/30 last:border-r-0"
                  ></div>
                </div>
              </div>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ Math.round(getProgressPercentage(target)) }}% completed
                </span>
                <span v-if="target.end_date" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ getDaysRemaining(target) }} days left
                </span>
              </div>
            </div>

            <!-- Quick Update -->
            <div class="mb-4 flex items-center gap-2">
              <button
                @click="quickUpdateTarget(target, -1)"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <input
                v-model.number="targetUpdateValues[target.id]"
                type="number"
                :placeholder="target.current_value"
                class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                @keyup.enter="updateTargetValue(target)"
              />
              <button
                @click="quickUpdateTarget(target, 1)"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                @click="updateTargetValue(target)"
                class="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-95"
              >
                Update
              </button>
            </div>

            <!-- Period -->
            <div v-if="target.start_date || target.end_date" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span v-if="target.start_date">{{ formatDate(target.start_date) }}</span>
              <span v-if="target.start_date && target.end_date"> - </span>
              <span v-if="target.end_date">{{ formatDate(target.end_date) }}</span>
            </div>
          </div>
        </div>
        </div>
      </Transition>

      <!-- Categories Tab -->
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'categories'" :key="'categories-tab'" style="will-change: transform, opacity;">
        <!-- Action Bar -->
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Task Categories</h2>
          <button
            @click="openCategoryModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        <!-- Categories List -->
        <div v-if="categories.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No categories found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first category</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900/30">
                  {{ category.icon || '📦' }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
                  <p v-if="category.description" class="mt-1 text-xs text-gray-600 dark:text-gray-400">{{ category.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="openCategoryModal(category)"
                  class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-blue-600 active:scale-95 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="!category.isDefault"
                  @click="deleteCategory(category)"
                  class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-red-600 active:scale-95 dark:hover:bg-gray-700 dark:hover:text-red-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="category.isDefault" class="mt-3">
              <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Default
              </span>
            </div>
          </div>
        </div>
        </div>
      </Transition>
    </main>

    <!-- Task Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showTaskModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeTaskModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300" @click="closeTaskModal"></div>
          <Transition name="modal-scale">
            <div
              v-if="showTaskModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingTask ? 'Edit Task' : 'Create New Task' }}
              </h2>

              <form @submit.prevent="saveTask" class="space-y-4">
                <!-- Title -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    v-model="taskForm.title"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Enter task title"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="taskForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Enter task description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Category -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      v-model="taskForm.category"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select category</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                        {{ cat.icon }} {{ cat.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Priority -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        @click="taskForm.priority = 'low'"
                        :class="[
                          'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95',
                          taskForm.priority === 'low'
                            ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                        ]"
                      >
                        Low
                      </button>
                      <button
                        type="button"
                        @click="taskForm.priority = 'medium'"
                        :class="[
                          'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95',
                          taskForm.priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                        ]"
                      >
                        Medium
                      </button>
                      <button
                        type="button"
                        @click="taskForm.priority = 'high'"
                        :class="[
                          'rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all active:scale-95',
                          taskForm.priority === 'high'
                            ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                        ]"
                      >
                        High
                      </button>
                    </div>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                      v-model="taskForm.status"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <!-- Due Date -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                    <div class="flex gap-2">
                      <input
                        v-model="taskForm.due_date"
                        type="date"
                        class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        @click="taskForm.due_date = new Date().toISOString().split('T')[0]"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        title="Set to today"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        @click="taskForm.due_date = new Date(Date.now() + 86400000).toISOString().split('T')[0]"
                        class="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        title="Set to tomorrow"
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Progress -->
                <div>
                  <div class="mb-2 flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </label>
                    <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {{ taskForm.progress || 0 }}%
                    </span>
                  </div>
                  <div class="relative">
                    <input
                      v-model.number="taskForm.progress"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      class="w-full h-2 rounded-lg appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-600"
                    />
                    <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div class="mt-2 flex gap-2">
                    <button
                      type="button"
                      @click="taskForm.progress = 0"
                      class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      @click="taskForm.progress = 25"
                      class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      @click="taskForm.progress = 50"
                      class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      @click="taskForm.progress = 100"
                      class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      100%
                    </button>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeTaskModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingTask"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingTask">Saving...</span>
                    <span v-else>{{ editingTask ? 'Update' : 'Create' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Target Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showTargetModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeTargetModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300" @click="closeTargetModal"></div>
          <Transition name="modal-scale">
            <div
              v-if="showTargetModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingTarget ? 'Edit Target' : 'Create New Target' }}
              </h2>

              <form @submit.prevent="saveTarget" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input
                    v-model="targetForm.title"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Enter target title"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="targetForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Enter target description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Value *</label>
                    <input
                      v-model.number="targetForm.target_value"
                      type="number"
                      required
                      min="1"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Value</label>
                    <input
                      v-model.number="targetForm.current_value"
                      type="number"
                      min="0"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                    <input
                      v-model="targetForm.start_date"
                      type="date"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input
                      v-model="targetForm.end_date"
                      type="date"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeTargetModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {{ editingTarget ? 'Update' : 'Create' }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Task Template Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showTaskTemplateModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="showTaskTemplateModal = false"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300" @click="showTaskTemplateModal = false"></div>
          <Transition name="modal-scale">
            <div
              v-if="showTaskTemplateModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Task Templates</h2>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="template in taskTemplates"
                  :key="template.name"
                  @click="applyTemplate(template)"
                  class="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-900/20"
                >
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ template.title }}</h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ template.description }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {{ template.category }}
                    </span>
                    <span
                      :class="[
                        'rounded-full px-2 py-0.5 text-xs',
                        template.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        template.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      ]"
                    >
                      {{ template.priority }}
                    </span>
                  </div>
                </button>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  @click="showTaskTemplateModal = false"
                  class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Category Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showCategoryModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeCategoryModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300" @click="closeCategoryModal"></div>
          <Transition name="modal-scale">
            <div
              v-if="showCategoryModal"
              class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingCategory ? 'Edit Category' : 'Add Category' }}
              </h2>

              <form @submit.prevent="saveCategory" class="space-y-4">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                  <input
                    v-model="categoryForm.name"
                    type="text"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="categoryForm.description"
                    rows="2"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon (Emoji)</label>
                    <div class="flex gap-2">
                      <input
                        v-model="categoryForm.icon"
                        type="text"
                        maxlength="2"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="📦"
                      />
                      <div class="flex flex-wrap gap-1">
                        <button
                          v-for="icon in popularIcons"
                          :key="icon"
                          type="button"
                          @click="categoryForm.icon = icon"
                          class="rounded-lg p-1.5 text-xl transition-all hover:bg-gray-100 active:scale-95 dark:hover:bg-gray-700"
                          :class="{ 'bg-blue-100 dark:bg-blue-900/30': categoryForm.icon === icon }"
                        >
                          {{ icon }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="color in categoryColors"
                        :key="color.value"
                        type="button"
                        @click="categoryForm.color = color.value"
                        :class="[
                          'h-10 w-10 rounded-lg border-2 transition-all active:scale-95',
                          color.bgClass,
                          categoryForm.color === color.value ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : 'border-gray-300 dark:border-gray-700'
                        ]"
                        :title="color.name"
                      ></button>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeCategoryModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {{ editingCategory ? 'Update' : 'Create' }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Click outside to close dropdown -->
    <div v-if="openTaskMenuId || showQuickActions" class="fixed inset-0 z-0" @click="openTaskMenuId = null; showQuickActions = false"></div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :show="showDialog"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :cancel-text="dialogConfig.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @update:show="showDialog = $event"
    />

    <!-- Pomodoro Timer -->
    <PomodoroTimer :tasks="tasks" @task-complete="handlePomodoroComplete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { useTheme } from '@/composables/useTheme'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import PomodoroTimer from '@/components/PomodoroTimer.vue'

const toast = useToast()
const { showDialog, dialogConfig, confirm, handleConfirm, handleCancel } = useConfirm()

// Theme
const { isDarkMode, toggleTheme } = useTheme()

// State
const activeTab = ref('tasks')
const tasks = ref([])
const targets = ref([])
const categories = ref([])
const loadingTasks = ref(false)
const savingTask = ref(false)
const taskViewMode = ref('grid') // 'grid', 'list', 'kanban'

// Filters
const taskSearchQuery = ref('')
const taskStatusFilter = ref('')
const taskPriorityFilter = ref('')
const targetSearchQuery = ref('')
const taskSortBy = ref('created')
const taskSortOrder = ref('desc')
const selectedTasks = ref([])
const showQuickActions = ref(false)
const targetUpdateValues = ref({})

// Drag & Drop state
const draggedTask = ref(null)
const draggedOverColumn = ref(null)

// Modals
const showTaskModal = ref(false)
const showTargetModal = ref(false)
const showCategoryModal = ref(false)
const showTaskTemplateModal = ref(false)
const editingTask = ref(null)
const editingTarget = ref(null)
const editingCategory = ref(null)
const openTaskMenuId = ref(null)

// Forms
const taskForm = ref({
  title: '',
  description: '',
  category: '',
  priority: '',
  status: 'pending',
  due_date: '',
  progress: 0
})

const targetForm = ref({
  title: '',
  description: '',
  target_value: '',
  current_value: 0,
  start_date: '',
  end_date: ''
})

const categoryForm = ref({
  name: '',
  description: '',
  icon: '📦',
  color: 'blue'
})

const categoryColors = [
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-500' },
  { name: 'Green', value: 'green', bgClass: 'bg-green-500' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-500' },
  { name: 'Orange', value: 'orange', bgClass: 'bg-orange-500' },
  { name: 'Red', value: 'red', bgClass: 'bg-red-500' },
  { name: 'Pink', value: 'pink', bgClass: 'bg-pink-500' }
]

const popularIcons = ['📦', '💼', '🏠', '🎯', '📚', '💡', '🎨', '🏃', '🧘', '🍔', '✈️', '🎮']

const taskTemplates = [
  { name: 'Daily Standup', title: 'Daily Standup', category: 'Work', priority: 'medium', description: 'Review yesterday, plan today' },
  { name: 'Code Review', title: 'Code Review', category: 'Work', priority: 'high', description: 'Review pull requests' },
  { name: 'Exercise', title: 'Exercise', category: 'Health', priority: 'medium', description: '30 minutes workout' },
  { name: 'Read Book', title: 'Read Book', category: 'Learning', priority: 'low', description: 'Read for 30 minutes' },
  { name: 'Meal Prep', title: 'Meal Prep', category: 'Personal', priority: 'medium', description: 'Prepare meals for the week' }
]

// Computed
const filteredTasks = computed(() => {
  // Ensure tasks array exists and is valid
  if (!tasks.value || !Array.isArray(tasks.value)) {
    return []
  }
  
  // If empty, return empty array
  if (tasks.value.length === 0) {
    return []
  }
  
  // Create a copy to avoid mutating original array
  let filtered = [...tasks.value]

  // Search filter
  if (taskSearchQuery.value) {
    const query = taskSearchQuery.value.toLowerCase()
    filtered = filtered.filter(task =>
      (task.title && task.title.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.category && task.category.toLowerCase().includes(query))
    )
  }

  // Status filter
  if (taskStatusFilter.value) {
    filtered = filtered.filter(task => task.status === taskStatusFilter.value)
  }

  // Priority filter
  if (taskPriorityFilter.value) {
    filtered = filtered.filter(task => task.priority === taskPriorityFilter.value)
  }

  // Sorting
  filtered.sort((a, b) => {
    let aValue, bValue
    
    switch (taskSortBy.value) {
      case 'due_date':
        aValue = a.due_date ? new Date(a.due_date).getTime() : 0
        bValue = b.due_date ? new Date(b.due_date).getTime() : 0
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1, '': 0 }
        aValue = priorityOrder[a.priority || ''] || 0
        bValue = priorityOrder[b.priority || ''] || 0
        break
      case 'title':
        aValue = (a.title || '').toLowerCase()
        bValue = (b.title || '').toLowerCase()
        break
      case 'status':
        const statusOrder = { completed: 3, in_progress: 2, pending: 1 }
        aValue = statusOrder[a.status || 'pending'] || 0
        bValue = statusOrder[b.status || 'pending'] || 0
        break
      default: // created
        aValue = new Date(a.created_at || 0).getTime()
        bValue = new Date(b.created_at || 0).getTime()
    }

    if (typeof aValue === 'string') {
      return taskSortOrder.value === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    return taskSortOrder.value === 'asc' 
      ? aValue - bValue
      : bValue - aValue
  })

  return filtered
})

const filteredTargets = computed(() => {
  // Ensure targets array exists and is valid
  if (!targets.value || !Array.isArray(targets.value)) {
    return []
  }
  
  // If empty, return empty array
  if (targets.value.length === 0) {
    return []
  }
  
  // Create a copy to avoid mutating original array
  let filtered = [...targets.value]
  
  if (!targetSearchQuery.value) return filtered

  const query = targetSearchQuery.value.toLowerCase()
  return filtered.filter(target =>
    (target.title && target.title.toLowerCase().includes(query)) ||
    (target.description && target.description.toLowerCase().includes(query))
  )
})

// Summary Statistics
const completedTasks = computed(() => {
  return tasks.value.filter(t => t.status === 'completed').length
})

const inProgressTasks = computed(() => {
  return tasks.value.filter(t => t.status === 'in_progress').length
})

const highPriorityTasks = computed(() => {
  return tasks.value.filter(t => t.priority === 'high' && t.status !== 'completed').length
})

const todayTasks = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return tasks.value.filter(t => t.due_date === today && t.status !== 'completed').length
})

const completionRate = computed(() => {
  if (tasks.value.length === 0) return 0
  return Math.round((completedTasks.value / tasks.value.length) * 100)
})

// Kanban helpers
const getTasksByStatus = (status) => {
  return filteredTasks.value.filter(t => t.status === status)
}

// Methods
const fetchTasks = async (showLoading = true) => {
  // Only show loading skeleton on initial load, not on updates
  if (showLoading) {
    loadingTasks.value = true
  }
  try {
    const response = await api.get('/tasks')
    // Ensure we always have an array
    if (response.data && Array.isArray(response.data)) {
      tasks.value = response.data
    } else {
      tasks.value = []
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
    // Keep existing data on error, don't clear it
    if (!tasks.value || tasks.value.length === 0) {
      tasks.value = []
    }
    if (showLoading) {
      toast.error('Error loading tasks')
    }
  } finally {
    if (showLoading) {
      loadingTasks.value = false
    }
  }
}

const fetchTargets = async () => {
  try {
    const response = await api.get('/targets')
    // Ensure we always have an array
    if (response.data && Array.isArray(response.data)) {
      targets.value = response.data
    } else {
      targets.value = []
    }
  } catch (error) {
    console.error('Error fetching targets:', error)
    // Keep existing data on error, don't clear it
    if (!targets.value || targets.value.length === 0) {
      targets.value = []
    }
    toast.error('Error loading targets')
  }
}

const openTaskModal = (task = null) => {
  editingTask.value = task
  if (task) {
    taskForm.value = {
      title: task.title || '',
      description: task.description || '',
      category: task.category || '',
      priority: task.priority || '',
      status: task.status || 'pending',
      due_date: task.due_date || '',
      progress: task.progress || 0
    }
  } else {
    taskForm.value = {
      title: '',
      description: '',
      category: '',
      priority: '',
      status: 'pending',
      due_date: '',
      progress: 0
    }
  }
  showTaskModal.value = true
  openTaskMenuId.value = null
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
}

const saveTask = async () => {
  savingTask.value = true
  try {
    if (editingTask.value) {
      await api.put(`/tasks/${editingTask.value.id}`, taskForm.value)
      toast.success('Task updated successfully!')
    } else {
      await api.post('/tasks', taskForm.value)
      toast.success('Task created successfully!')
    }
    await fetchTasks(false) // Don't show loading when creating/updating
    closeTaskModal()
  } catch (error) {
    console.error('Error saving task:', error)
    toast.error(error.response?.data?.message || 'Error saving task')
  } finally {
    savingTask.value = false
  }
}

const updateTaskStatus = async (taskId, newStatus) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return

  // Optimistic update - create a copy to avoid reactivity issues
  const oldStatus = task.status
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  
  if (taskIndex > -1) {
    tasks.value[taskIndex] = { ...tasks.value[taskIndex], status: newStatus }
  }

  try {
    await api.put(`/tasks/${taskId}`, { status: newStatus })
    // Silent success - no toast notification to avoid interruption
    // Don't call fetchTasks() to avoid showing loading skeleton
  } catch (error) {
    console.error('Error updating task status:', error)
    // Revert on error
    if (taskIndex > -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], status: oldStatus }
    }
    toast.error('Failed to update task status')
  }
}

// Drag & Drop handlers
const handleDragStart = (event, task) => {
  draggedTask.value = task
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id }))
  
  // Create a custom drag image
  const dragImage = event.target.cloneNode(true)
  dragImage.style.width = event.target.offsetWidth + 'px'
  dragImage.style.opacity = '0.8'
  dragImage.style.transform = 'rotate(3deg)'
  dragImage.style.pointerEvents = 'none'
  document.body.appendChild(dragImage)
  event.dataTransfer.setDragImage(dragImage, event.offsetX, event.offsetY)
  
  // Remove the drag image after a short delay
  setTimeout(() => {
    document.body.removeChild(dragImage)
  }, 0)
  
  // Add visual feedback to original element
  if (event.target) {
    event.target.style.opacity = '0.3'
    event.target.style.transform = 'scale(0.95)'
    event.target.style.transition = 'all 0.2s ease'
  }
}

const handleDragEnd = (event) => {
  // Reset visual feedback
  if (event.target) {
    event.target.style.opacity = ''
    event.target.style.transform = ''
    event.target.style.transition = ''
  }
  draggedOverColumn.value = null
  // Reset after a short delay to allow drop to complete
  setTimeout(() => {
    draggedTask.value = null
  }, 100)
}

const handleDrop = async (event, newStatus) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedTask.value) return
  
  // Don't update if dropped in the same column
  if (draggedTask.value.status === newStatus) {
    draggedOverColumn.value = null
    return
  }
  
  // Update task status without showing loading
  const taskId = draggedTask.value.id
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return

  // Optimistic update - update immediately without showing loading
  const oldStatus = task.status
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  
  if (taskIndex > -1) {
    tasks.value[taskIndex] = { ...tasks.value[taskIndex], status: newStatus }
  }

  draggedOverColumn.value = null
  
  // Update in background without blocking UI
  try {
    await api.put(`/tasks/${taskId}`, { status: newStatus })
    // Silent success - no toast notification for drag & drop
  } catch (error) {
    console.error('Error updating task status:', error)
    // Revert on error
    if (taskIndex > -1) {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], status: oldStatus }
    }
    toast.error('Failed to update task status')
  }
}

const deleteTask = async (taskId) => {
  const confirmed = await confirm({
    title: 'Delete Task',
    message: 'Are you sure you want to delete this task? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })

  if (!confirmed) return

  // Optimistic update
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  const deletedTask = tasks.value[taskIndex]
  if (taskIndex > -1) {
    tasks.value.splice(taskIndex, 1)
  }

  try {
    await api.delete(`/tasks/${taskId}`)
    toast.success('Task deleted successfully')
    openTaskMenuId.value = null
  } catch (error) {
    console.error('Error deleting task:', error)
    // Revert on error
    if (taskIndex > -1) {
      tasks.value.splice(taskIndex, 0, deletedTask)
    }
    toast.error(error.response?.data?.message || 'Error deleting task')
  }
}

const toggleTaskMenu = (taskId) => {
  openTaskMenuId.value = openTaskMenuId.value === taskId ? null : taskId
}

const openTargetModal = (target = null) => {
  editingTarget.value = target
  if (target) {
    targetForm.value = {
      title: target.title || '',
      description: target.description || '',
      target_value: target.target_value || '',
      current_value: target.current_value || 0,
      start_date: target.start_date || '',
      end_date: target.end_date || ''
    }
  } else {
    targetForm.value = {
      title: '',
      description: '',
      target_value: '',
      current_value: 0,
      start_date: '',
      end_date: ''
    }
  }
  showTargetModal.value = true
}

const closeTargetModal = () => {
  showTargetModal.value = false
  editingTarget.value = null
}

const saveTarget = async () => {
  try {
    if (editingTarget.value) {
      await api.put(`/targets/${editingTarget.value.id}`, targetForm.value)
      toast.success('Target updated successfully!')
    } else {
      await api.post('/targets', targetForm.value)
      toast.success('Target created successfully!')
    }
    await fetchTargets()
    closeTargetModal()
  } catch (error) {
    console.error('Error saving target:', error)
    toast.error(error.response?.data?.message || 'Error saving target')
  }
}

const getProgressPercentage = (target) => {
  if (!target.target_value || target.target_value === 0) return 0
  return (target.current_value / target.target_value) * 100
}

const completedTargets = computed(() => {
  return targets.value.filter(t => getProgressPercentage(t) >= 100).length
})

const inProgressTargets = computed(() => {
  return targets.value.filter(t => {
    const progress = getProgressPercentage(t)
    return progress > 0 && progress < 100
  }).length
})

const averageProgress = computed(() => {
  if (targets.value.length === 0) return 0
  const total = targets.value.reduce((sum, t) => sum + getProgressPercentage(t), 0)
  return Math.round(total / targets.value.length)
})

const getDaysRemaining = (target) => {
  if (!target.end_date) return null
  const today = new Date()
  const endDate = new Date(target.end_date)
  const diffTime = endDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

const quickUpdateTarget = async (target, change) => {
  const newValue = Math.max(0, (target.current_value || 0) + change)
  try {
    await api.put(`/targets/${target.id}`, { current_value: newValue })
    await fetchTargets()
    toast.success('Target updated!')
  } catch (error) {
    console.error('Error updating target:', error)
    toast.error('Error updating target')
  }
}

const updateTargetValue = async (target) => {
  const newValue = parseInt(targetUpdateValues.value[target.id]) || target.current_value
  if (newValue < 0) {
    toast.warning('Value cannot be negative')
    return
  }
  try {
    await api.put(`/targets/${target.id}`, { current_value: newValue })
    targetUpdateValues.value[target.id] = ''
    await fetchTargets()
    toast.success('Target updated!')
  } catch (error) {
    console.error('Error updating target:', error)
    toast.error('Error updating target')
  }
}

const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  }
  return statusMap[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isOverdue = (dateString) => {
  if (!dateString) return false
  const dueDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

const isDueToday = (dateString) => {
  if (!dateString) return false
  const dueDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate.getTime() === today.getTime()
}

// Category Methods
const fetchCategories = () => {
  // Load from localStorage or use default
  if (typeof window === 'undefined') return
  
  try {
    const saved = localStorage.getItem('taskCategories')
    if (saved) {
      categories.value = JSON.parse(saved)
    } else {
      initializeDefaultCategories()
    }
  } catch (e) {
    console.error('Error loading categories:', e)
    initializeDefaultCategories()
  }
}

const initializeDefaultCategories = () => {
  categories.value = [
    { id: 1, name: 'Work', description: 'Work related tasks', icon: '💼', color: 'blue', isDefault: true },
    { id: 2, name: 'Personal', description: 'Personal tasks', icon: '🏠', color: 'green', isDefault: true },
    { id: 3, name: 'Health', description: 'Health and fitness', icon: '🏃', color: 'red', isDefault: true },
    { id: 4, name: 'Learning', description: 'Learning and education', icon: '📚', color: 'purple', isDefault: true }
  ]
  saveCategories()
}

const saveCategories = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('taskCategories', JSON.stringify(categories.value))
  } catch (e) {
    console.error('Error saving categories:', e)
  }
}

const openCategoryModal = (category = null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = {
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '📦',
      color: category.color || 'blue'
    }
  } else {
    categoryForm.value = {
      name: '',
      description: '',
      icon: '📦',
      color: 'blue'
    }
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
}

const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    toast.error('Category name is required')
    return
  }

  if (editingCategory.value) {
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
    if (index > -1) {
      categories.value[index] = {
        ...categories.value[index],
        ...categoryForm.value
      }
    }
    toast.success('Category updated successfully!')
  } else {
    const maxId = categories.value.length > 0 
      ? Math.max(...categories.value.map(c => c.id), 0) 
      : 0
    const newId = maxId + 1
    categories.value.push({
      id: newId,
      ...categoryForm.value,
      isDefault: false
    })
    toast.success('Category created successfully!')
  }
  saveCategories()
  closeCategoryModal()
}

const deleteCategory = async (category) => {
  if (category.isDefault) {
    toast.warning('Default categories cannot be deleted')
    return
  }

  const confirmed = await confirm({
    title: 'Delete Category',
    message: `Are you sure you want to delete category "${category.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })

  if (confirmed) {
    categories.value = categories.value.filter(c => c.id !== category.id)
    saveCategories()
    toast.success('Category deleted successfully')
  }
}

const handlePomodoroComplete = async (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task && task.status !== 'completed') {
    // Update task progress
    const newProgress = Math.min((task.progress || 0) + 25, 100)
    await updateTaskStatus(taskId, newProgress === 100 ? 'completed' : 'in_progress')
    if (newProgress < 100) {
      await api.put(`/tasks/${taskId}`, { progress: newProgress })
      toast.success(`Great work! Task progress: ${newProgress}%`)
    }
  }
}

const toggleTaskSelection = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const bulkComplete = async () => {
  if (selectedTasks.value.length === 0) {
    toast.warning('Please select tasks to complete')
    return
  }

  const confirmed = await confirm({
    title: 'Complete Tasks',
    message: `Are you sure you want to mark ${selectedTasks.value.length} task(s) as completed?`,
    confirmText: 'Complete',
    cancelText: 'Cancel'
  })

  if (confirmed) {
    try {
      await Promise.all(
        selectedTasks.value.map(taskId => 
          api.put(`/tasks/${taskId}`, { status: 'completed', progress: 100 })
        )
      )
      toast.success(`${selectedTasks.value.length} task(s) completed!`)
      selectedTasks.value = []
      await fetchTasks(false) // Don't show loading for bulk operations
    } catch (error) {
      console.error('Error completing tasks:', error)
      toast.error('Error completing tasks')
    }
  }
}

const bulkDelete = async () => {
  if (selectedTasks.value.length === 0) {
    toast.warning('Please select tasks to delete')
    return
  }

  const confirmed = await confirm({
    title: 'Delete Tasks',
    message: `Are you sure you want to delete ${selectedTasks.value.length} task(s)? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })

  if (confirmed) {
    try {
      await Promise.all(
        selectedTasks.value.map(taskId => api.delete(`/tasks/${taskId}`))
      )
      toast.success(`${selectedTasks.value.length} task(s) deleted!`)
      selectedTasks.value = []
      await fetchTasks(false) // Don't show loading for bulk operations
    } catch (error) {
      console.error('Error deleting tasks:', error)
      toast.error('Error deleting tasks')
    }
  }
}

const openTaskTemplateModal = () => {
  showTaskTemplateModal.value = true
  showQuickActions.value = false
}

const applyTemplate = (template) => {
  taskForm.value = {
    title: template.title,
    description: template.description,
    category: template.category,
    priority: template.priority,
    status: 'pending',
    due_date: '',
    progress: 0
  }
  showTaskTemplateModal.value = false
  showTaskModal.value = true
}

// Watch for tab changes to ensure data is loaded
watch(activeTab, async (newTab, oldTab) => {
  // Always fetch data when switching tabs (skip initial mount)
  if (oldTab === undefined) return
  
  if (newTab === 'tasks') {
    await fetchTasks()
    await nextTick() // Ensure DOM is updated
  } else if (newTab === 'targets') {
    await fetchTargets()
    await nextTick() // Ensure DOM is updated
  } else if (newTab === 'categories') {
    fetchCategories()
    await nextTick() // Ensure DOM is updated
  }
})

// Watch for view mode changes - data should persist, just ensure it's loaded
watch(taskViewMode, () => {
  // Data persists, but refresh if empty
  if (activeTab.value === 'tasks' && (!tasks.value || tasks.value.length === 0)) {
    fetchTasks()
  }
})

// Lifecycle
onMounted(async () => {
  try {
    // Load all data on mount
    await Promise.all([
      fetchTasks(),
      fetchTargets(),
      fetchCategories()
    ])
  } catch (error) {
    console.error('Error initializing Tasks component:', error)
  }
})
</script>

<style scoped>
/* Modal Fade Animation - Smooth */
.modal-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal Scale Animation - Smooth */
.modal-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(5px);
}

/* List Animation */
.list-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

.list-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Tab Transition */
.tab-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.tab-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.tab-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
