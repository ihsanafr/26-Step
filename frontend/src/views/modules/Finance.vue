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
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Personal Finance</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Track your income, expenses, and savings</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Summary Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Income -->
        <div class="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5 dark:border-green-900/50 dark:from-green-900/20 dark:to-green-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-green-700 dark:text-green-400">Total Income</span>
            <div class="rounded-lg bg-green-200 p-2 dark:bg-green-900/50">
              <svg class="h-5 w-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ formatCurrency(summary.totalIncome) }}</p>
          <p class="mt-1 text-xs text-green-600 dark:text-green-400">{{ summary.incomeCount }} transactions</p>
        </div>

        <!-- Total Expense -->
        <div class="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5 dark:border-red-900/50 dark:from-red-900/20 dark:to-red-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-red-700 dark:text-red-400">Total Expense</span>
            <div class="rounded-lg bg-red-200 p-2 dark:bg-red-900/50">
              <svg class="h-5 w-5 text-red-700 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-red-900 dark:text-red-300">{{ formatCurrency(summary.totalExpense) }}</p>
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">{{ summary.expenseCount }} transactions</p>
        </div>

        <!-- Balance -->
        <div class="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:border-blue-900/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-blue-700 dark:text-blue-400">Balance</span>
            <div class="rounded-lg bg-blue-200 p-2 dark:bg-blue-900/50">
              <svg class="h-5 w-5 text-blue-700 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p :class="['text-2xl font-bold', summary.balance >= 0 ? 'text-blue-900 dark:text-blue-300' : 'text-red-900 dark:text-red-300']">
            {{ formatCurrency(summary.balance) }}
          </p>
          <p class="mt-1 text-xs text-blue-600 dark:text-blue-400">Net amount</p>
        </div>

        <!-- Total Savings -->
        <div class="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 dark:border-purple-900/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm font-medium text-purple-700 dark:text-purple-400">Total Savings</span>
            <div class="rounded-lg bg-purple-200 p-2 dark:bg-purple-900/50">
              <svg class="h-5 w-5 text-purple-700 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ formatCurrency(summary.totalSavings) }}</p>
          <p class="mt-1 text-xs text-purple-600 dark:text-purple-400">{{ savings.length }} savings goals</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex gap-6">
          <button
            @click="activeTab = 'transactions'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Transactions
          </button>
          <button
            @click="activeTab = 'budgets'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'budgets'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Budgets
          </button>
          <button
            @click="activeTab = 'savings'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'savings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Savings
          </button>
          <button
            @click="activeTab = 'categories'"
            :class="[
              'pb-4 px-1 text-sm font-medium transition-colors border-b-2',
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            Categories
          </button>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-show="activeTab === 'transactions'">
        <!-- Action Bar -->
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <!-- Filters -->
          <div class="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="transactionSearchQuery"
                type="text"
                placeholder="Search transactions..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <!-- Type Filter -->
            <select
              v-model="transactionTypeFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="transactionCategoryFilter"
              class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              <option v-for="catName in categoryNames" :key="catName" :value="catName">
                {{ getCategoryByName(catName)?.emoji }} {{ catName }}
              </option>
            </select>
          </div>

          <!-- Add Transaction Button -->
          <button
            @click="openTransactionModal()"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </button>
        </div>

        <!-- Transactions List -->
        <div v-if="loadingTransactions">
          <SkeletonLoader type="list" :count="5" />
        </div>

        <div v-else-if="filteredTransactions.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No transactions found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Start tracking your income and expenses</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-center gap-4">
              <!-- Type Icon -->
              <div
                :class="[
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                ]"
              >
                <svg
                  :class="[
                    'h-6 w-6',
                    transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="transaction.type === 'income'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </div>

              <!-- Transaction Info -->
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span v-if="getCategoryByName(transaction.category)?.emoji" class="text-lg">
                    {{ getCategoryByName(transaction.category)?.emoji }}
                  </span>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ transaction.category || 'Uncategorized' }}</h3>
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    ]"
                  >
                    {{ transaction.type === 'income' ? 'Income' : 'Expense' }}
                  </span>
                </div>
                <p v-if="transaction.description" class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ transaction.description }}</p>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">{{ formatDate(transaction.date) }}</p>
              </div>
            </div>

            <!-- Amount & Actions -->
            <div class="flex items-center gap-4">
              <p
                :class="[
                  'text-lg font-bold',
                  transaction.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                ]"
              >
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
              </p>
              <div class="relative">
                <button
                  @click="toggleTransactionMenu(transaction.id)"
                  class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="openTransactionMenuId === transaction.id"
                  class="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <button
                    @click="openTransactionModal(transaction)"
                    class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTransaction(transaction.id)"
                    class="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budgets Tab -->
      <div v-show="activeTab === 'budgets'">
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
                v-model="budgetSearchQuery"
                type="text"
                placeholder="Search budgets..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            @click="openBudgetModal()"
            class="ml-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Budget
          </button>
        </div>

        <!-- Budgets List -->
        <div v-if="budgets.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No budgets found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create a budget to track your spending</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="budget in filteredBudgets"
            :key="budget.id"
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="mb-4 flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ budget.category }}</h3>
                  <span
                    v-if="budget.is_active"
                    class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Active
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Inactive
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatPeriod(budget.period) }}</p>
              </div>
              <button
                @click="openBudgetModal(budget)"
                class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <!-- Budget Amount -->
            <div class="mb-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(budget.amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Budget limit</p>
            </div>

            <!-- Period Dates -->
            <div v-if="budget.start_date" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(budget.start_date) }}</span>
              <span v-if="budget.end_date"> - {{ formatDate(budget.end_date) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Savings Tab -->
      <div v-show="activeTab === 'savings'">
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
                v-model="savingSearchQuery"
                type="text"
                placeholder="Search savings..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            @click="openSavingModal()"
            class="ml-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Savings Goal
          </button>
        </div>

        <!-- Savings List -->
        <div v-if="loadingSavings">
          <SkeletonLoader type="card" :count="3" />
        </div>

        <div v-else-if="filteredSavings.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No savings goals found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first savings goal</p>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2">
          <div
            v-for="saving in filteredSavings"
            :key="saving.id"
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="mb-4 flex items-start justify-between">
              <div class="flex-1">
                <div class="mb-1 flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ saving.name }}</h3>
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      saving.type === 'investment'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    ]"
                  >
                    {{ saving.type === 'investment' ? 'Investment' : 'Savings' }}
                  </span>
                </div>
                <p v-if="saving.description" class="text-sm text-gray-600 dark:text-gray-400">{{ saving.description }}</p>
              </div>
              <button
                @click="openSavingModal(saving)"
                class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>

            <!-- Progress -->
            <div v-if="saving.target_amount" class="mb-4">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Progress</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(saving.current_amount) }} / {{ formatCurrency(saving.target_amount) }}
                </span>
              </div>
              <div class="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  :class="[
                    'h-full transition-all duration-300',
                    getSavingProgress(saving) >= 100 ? 'bg-green-500' : 'bg-blue-600'
                  ]"
                  :style="{ width: `${Math.min(getSavingProgress(saving), 100)}%` }"
                ></div>
              </div>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ Math.round(getSavingProgress(saving)) }}% completed
              </div>
            </div>

            <!-- Amount Display (if no target) -->
            <div v-else class="mb-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(saving.current_amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Current amount</p>
            </div>

            <!-- Target Date -->
            <div v-if="saving.target_date" class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Target: {{ formatDate(saving.target_date) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-show="activeTab === 'categories'">
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
                v-model="categorySearchQuery"
                type="text"
                placeholder="Search categories..."
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            v-if="!editingCategory"
            @click="openCategoryForm()"
            class="ml-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        <!-- Category Form -->
        <div v-if="editingCategory !== null" class="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
          <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingCategory ? 'Edit Category' : 'Add Category' }}
          </h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Emoji -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Emoji *</label>
                <div class="relative">
                  <input
                    v-model="categoryForm.emoji"
                    type="text"
                    required
                    maxlength="2"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="📦"
                  />
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button
                    v-for="emoji in popularEmojis"
                    :key="emoji"
                    type="button"
                    @click="categoryForm.emoji = emoji"
                    class="rounded-lg p-2 text-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    :class="{ 'bg-blue-100 dark:bg-blue-900/30': categoryForm.emoji === emoji }"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <!-- Name -->
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
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeCategoryForm"
                class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                {{ editingCategory ? 'Update' : 'Add' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Categories List -->
        <div v-if="filteredCategories.length === 0" class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <h3 class="mt-4 text-sm font-semibold text-gray-900 dark:text-white">No categories found</h3>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your first category</p>
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl dark:bg-gray-700">
                  {{ category.emoji || '📦' }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ category.name }}</h3>
                  <p v-if="category.isDefault" class="text-xs text-gray-500 dark:text-gray-400">Default category</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="openCategoryForm(category)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="!category.isDefault"
                  @click="deleteCategory(category)"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Transaction Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showTransactionModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeTransactionModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeTransactionModal"></div>
          <Transition name="scale">
            <div
              v-if="showTransactionModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingTransaction ? 'Edit Transaction' : 'Add Transaction' }}
              </h2>

              <form @submit.prevent="saveTransaction" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Type -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                    <select
                      v-model="transactionForm.type"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <!-- Amount -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount *</label>
                    <div class="relative">
                      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        :value="formatNumberInput(transactionForm.amount)"
                        @input="transactionForm.amount = parseNumber($event.target.value)"
                        type="text"
                        required
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <!-- Category -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                  <select
                    v-model="transactionForm.category"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    <option v-for="catName in categoryNames" :key="catName" :value="catName">
                      {{ getCategoryByName(catName)?.emoji }} {{ catName }}
                    </option>
                  </select>
                </div>

                <!-- Description -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="transactionForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <!-- Date -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                  <input
                    v-model="transactionForm.date"
                    type="date"
                    required
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeTransactionModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingTransaction"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingTransaction">Saving...</span>
                    <span v-else>{{ editingTransaction ? 'Update' : 'Add' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Budget Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showBudgetModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeBudgetModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeBudgetModal"></div>
          <Transition name="scale">
            <div
              v-if="showBudgetModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingBudget ? 'Edit Budget' : 'Add Budget' }}
              </h2>

              <form @submit.prevent="saveBudget" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Category -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                    <select
                      v-model="budgetForm.category"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      <option v-for="catName in categoryNames" :key="catName" :value="catName">
                        {{ getCategoryByName(catName)?.emoji }} {{ catName }}
                      </option>
                    </select>
                  </div>

                  <!-- Amount -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount *</label>
                    <div class="relative">
                      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        :value="formatNumberInput(budgetForm.amount)"
                        @input="budgetForm.amount = parseNumber($event.target.value)"
                        type="text"
                        required
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <!-- Period -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Period *</label>
                    <select
                      v-model="budgetForm.period"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <!-- Is Active -->
                  <div class="flex items-end">
                    <label class="flex items-center gap-2">
                      <input
                        v-model="budgetForm.is_active"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                      />
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>

                  <!-- Start Date -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                    <input
                      v-model="budgetForm.start_date"
                      type="date"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <!-- End Date -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                    <input
                      v-model="budgetForm.end_date"
                      type="date"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeBudgetModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {{ editingBudget ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Saving Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showSavingModal"
          class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          @click.self="closeSavingModal"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="closeSavingModal"></div>
          <Transition name="scale">
            <div
              v-if="showSavingModal"
              class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 md:p-8"
              @click.stop
            >
              <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {{ editingSaving ? 'Edit Savings Goal' : 'Add Savings Goal' }}
              </h2>

              <form @submit.prevent="saveSaving" class="space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                    <input
                      v-model="savingForm.name"
                      type="text"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      placeholder="Emergency Fund, Vacation, etc."
                    />
                  </div>

                  <!-- Type -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                    <select
                      v-model="savingForm.type"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="savings">Savings</option>
                      <option value="investment">Investment</option>
                    </select>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="savingForm.description"
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Optional description"
                  ></textarea>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <!-- Target Amount -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount</label>
                    <div class="relative">
                      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        :value="formatNumberInput(savingForm.target_amount)"
                        @input="savingForm.target_amount = parseNumber($event.target.value)"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <!-- Current Amount -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Amount</label>
                    <div class="relative">
                      <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        :value="formatNumberInput(savingForm.current_amount)"
                        @input="savingForm.current_amount = parseNumber($event.target.value)"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <!-- Target Date -->
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</label>
                    <input
                      v-model="savingForm.target_date"
                      type="date"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="closeSavingModal"
                    class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="savingSaving"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-gray-800"
                  >
                    <span v-if="savingSaving">Saving...</span>
                    <span v-else>{{ editingSaving ? 'Update' : 'Add' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Click outside to close dropdown -->
    <div v-if="openTransactionMenuId" class="fixed inset-0 z-0" @click="openTransactionMenuId = null"></div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const toast = useToast()
const { showDialog, dialogConfig, confirm, handleConfirm, handleCancel } = useConfirm()

// State
const activeTab = ref('transactions')
const transactions = ref([])
const budgets = ref([])
const savings = ref([])
const loadingTransactions = ref(false)
const loadingSavings = ref(false)
const savingTransaction = ref(false)
const savingSaving = ref(false)

// Filters
const transactionSearchQuery = ref('')
const transactionTypeFilter = ref('')
const transactionCategoryFilter = ref('')
const budgetSearchQuery = ref('')
const savingSearchQuery = ref('')
const categorySearchQuery = ref('')

// Modals
const showTransactionModal = ref(false)
const showBudgetModal = ref(false)
const showSavingModal = ref(false)
const editingTransaction = ref(null)
const editingBudget = ref(null)
const editingSaving = ref(null)
const openTransactionMenuId = ref(null)

// Categories with default categories (with emoji)
const defaultCategories = [
  { id: '1', name: 'Food', emoji: '🍔', isDefault: true },
  { id: '2', name: 'Transportation', emoji: '🚗', isDefault: true },
  { id: '3', name: 'Shopping', emoji: '🛍️', isDefault: true },
  { id: '4', name: 'Entertainment', emoji: '🎬', isDefault: true },
  { id: '5', name: 'Bills', emoji: '📄', isDefault: true },
  { id: '6', name: 'Healthcare', emoji: '🏥', isDefault: true },
  { id: '7', name: 'Education', emoji: '📚', isDefault: true },
  { id: '8', name: 'Salary', emoji: '💰', isDefault: true },
  { id: '9', name: 'Freelance', emoji: '💼', isDefault: true },
  { id: '10', name: 'Investment', emoji: '📈', isDefault: true },
  { id: '11', name: 'Other', emoji: '📦', isDefault: true }
]

// Load categories from localStorage or use defaults
const loadCategories = () => {
  const stored = localStorage.getItem('finance_categories')
  if (stored) {
    return JSON.parse(stored)
  }
  return defaultCategories
}

const categories = ref(loadCategories())

// Save categories to localStorage
const saveCategories = () => {
  localStorage.setItem('finance_categories', JSON.stringify(categories.value))
}

// Computed category names (sorted by name)
const categoryNames = computed(() => {
  return [...categories.value].sort((a, b) => a.name.localeCompare(b.name)).map(cat => cat.name)
})

// Get category by name
const getCategoryByName = (name) => {
  return categories.value.find(cat => cat.name === name)
}

// Category form state
const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  emoji: '📦'
})

// Popular emojis for categories
const popularEmojis = ['🍔', '🚗', '🛍️', '🎬', '📄', '🏥', '📚', '💰', '💼', '📈', '📦', '🍕', '☕', '🏠', '👕', '🎮', '✈️', '🏋️', '🎨', '🎵', '📱', '💻', '🐾', '🌮', '🍜']

// Category CRUD functions
const openCategoryForm = (category = null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = { name: category.name, emoji: category.emoji || '📦' }
  } else {
    categoryForm.value = { name: '', emoji: '📦' }
  }
}

const closeCategoryForm = () => {
  editingCategory.value = null
  categoryForm.value = { name: '', emoji: '📦' }
}

const saveCategory = () => {
  if (!categoryForm.value.name.trim()) return

  if (editingCategory.value) {
    // Update existing category
    const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index].name = categoryForm.value.name.trim()
      categories.value[index].emoji = categoryForm.value.emoji || '📦'
    }
  } else {
    // Add new category
    const newId = Date.now().toString()
    categories.value.push({
      id: newId,
      name: categoryForm.value.name.trim(),
      emoji: categoryForm.value.emoji || '📦',
      isDefault: false
    })
  }
  saveCategories()
  closeCategoryForm()
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
    categories.value = categories.value.filter(cat => cat.id !== category.id)
    saveCategories()
    toast.success('Category deleted successfully')
  }
}

// Forms
const transactionForm = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

const budgetForm = ref({
  category: '',
  amount: '',
  period: 'monthly',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  is_active: true
})

const savingForm = ref({
  name: '',
  description: '',
  target_amount: '',
  current_amount: 0,
  type: 'savings',
  target_date: ''
})

// Computed Summary
const summary = computed(() => {
  const incomeTransactions = transactions.value.filter(t => t.type === 'income')
  const expenseTransactions = transactions.value.filter(t => t.type === 'expense')
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
  const totalSavings = savings.value.reduce((sum, s) => sum + parseFloat(s.current_amount || 0), 0)
  
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    totalSavings,
    incomeCount: incomeTransactions.length,
    expenseCount: expenseTransactions.length
  }
})

// Computed Filters
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Search filter
  if (transactionSearchQuery.value) {
    const query = transactionSearchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.category?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    )
  }

  // Type filter
  if (transactionTypeFilter.value) {
    filtered = filtered.filter(t => t.type === transactionTypeFilter.value)
  }

  // Category filter
  if (transactionCategoryFilter.value) {
    filtered = filtered.filter(t => t.category === transactionCategoryFilter.value)
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredBudgets = computed(() => {
  if (!budgetSearchQuery.value) return budgets.value
  const query = budgetSearchQuery.value.toLowerCase()
  return budgets.value.filter(b => b.category?.toLowerCase().includes(query))
})

const filteredSavings = computed(() => {
  if (!savingSearchQuery.value) return savings.value
  const query = savingSearchQuery.value.toLowerCase()
  return savings.value.filter(s => 
    s.name?.toLowerCase().includes(query) ||
    s.description?.toLowerCase().includes(query)
  )
})

const filteredCategories = computed(() => {
  if (!categorySearchQuery.value) return [...categories.value].sort((a, b) => a.name.localeCompare(b.name))
  const query = categorySearchQuery.value.toLowerCase()
  return categories.value.filter(cat => 
    cat.name?.toLowerCase().includes(query) ||
    cat.emoji?.includes(query)
  ).sort((a, b) => a.name.localeCompare(b.name))
})

// Methods
const fetchTransactions = async () => {
  loadingTransactions.value = true
  try {
    const response = await api.get('/financial-transactions')
    transactions.value = response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
  } finally {
    loadingTransactions.value = false
  }
}

const fetchBudgets = async () => {
  try {
    const response = await api.get('/budgets')
    budgets.value = response.data
  } catch (error) {
    console.error('Error fetching budgets:', error)
  }
}

const fetchSavings = async () => {
  loadingSavings.value = true
  try {
    const response = await api.get('/savings')
    savings.value = response.data
  } catch (error) {
    console.error('Error fetching savings:', error)
  } finally {
    loadingSavings.value = false
  }
}

const openTransactionModal = (transaction = null) => {
  editingTransaction.value = transaction
  if (transaction) {
    transactionForm.value = {
      type: transaction.type || 'expense',
      amount: transaction.amount || '',
      category: transaction.category || '',
      description: transaction.description || '',
      date: transaction.date || new Date().toISOString().split('T')[0]
    }
  } else {
    transactionForm.value = {
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    }
  }
  showTransactionModal.value = true
  openTransactionMenuId.value = null
}

const closeTransactionModal = () => {
  showTransactionModal.value = false
  editingTransaction.value = null
}

const saveTransaction = async () => {
  savingTransaction.value = true
  try {
    const amount = parseNumber(transactionForm.value.amount)
    const payload = {
      ...transactionForm.value,
      amount: amount
    }
    
    if (editingTransaction.value) {
      await api.put(`/financial-transactions/${editingTransaction.value.id}`, payload)
    } else {
      await api.post('/financial-transactions', payload)
    }
    await fetchTransactions()
    closeTransactionModal()
  } catch (error) {
    console.error('Error saving transaction:', error)
    alert(error.response?.data?.message || 'Error saving transaction')
  } finally {
    savingTransaction.value = false
  }
}

const deleteTransaction = async (id) => {
  const confirmed = await confirm({
    title: 'Delete Transaction',
    message: 'Are you sure you want to delete this transaction? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  })

  if (!confirmed) return

  // Optimistic update
  const transactionIndex = transactions.value.findIndex(t => t.id === id)
  const deletedTransaction = transactions.value[transactionIndex]
  if (transactionIndex > -1) {
    transactions.value.splice(transactionIndex, 1)
  }

  try {
    await api.delete(`/financial-transactions/${id}`)
    toast.success('Transaction deleted successfully')
    openTransactionMenuId.value = null
  } catch (error) {
    console.error('Error deleting transaction:', error)
    // Revert on error
    if (transactionIndex > -1) {
      transactions.value.splice(transactionIndex, 0, deletedTransaction)
    }
    toast.error(error.response?.data?.message || 'Error deleting transaction')
  }
}

const toggleTransactionMenu = (id) => {
  openTransactionMenuId.value = openTransactionMenuId.value === id ? null : id
}

const openBudgetModal = (budget = null) => {
  editingBudget.value = budget
  if (budget) {
    budgetForm.value = {
      category: budget.category || '',
      amount: budget.amount || '',
      period: budget.period || 'monthly',
      start_date: budget.start_date || '',
      end_date: budget.end_date || '',
      is_active: budget.is_active !== undefined ? budget.is_active : true
    }
  } else {
    budgetForm.value = {
      category: '',
      amount: '',
      period: 'monthly',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      is_active: true
    }
  }
  showBudgetModal.value = true
}

const closeBudgetModal = () => {
  showBudgetModal.value = false
  editingBudget.value = null
}

const saveBudget = async () => {
  try {
    const amount = parseNumber(budgetForm.value.amount)
    const payload = {
      ...budgetForm.value,
      amount: amount
    }
    
    if (editingBudget.value) {
      await api.put(`/budgets/${editingBudget.value.id}`, payload)
      toast.success('Budget updated successfully!')
    } else {
      await api.post('/budgets', payload)
      toast.success('Budget created successfully!')
    }
    await fetchBudgets()
    closeBudgetModal()
  } catch (error) {
    console.error('Error saving budget:', error)
    toast.error(error.response?.data?.message || 'Error saving budget')
  }
}

const openSavingModal = (saving = null) => {
  editingSaving.value = saving
  if (saving) {
    savingForm.value = {
      name: saving.name || '',
      description: saving.description || '',
      target_amount: saving.target_amount || '',
      current_amount: saving.current_amount || 0,
      type: saving.type || 'savings',
      target_date: saving.target_date || ''
    }
  } else {
    savingForm.value = {
      name: '',
      description: '',
      target_amount: '',
      current_amount: 0,
      type: 'savings',
      target_date: ''
    }
  }
  showSavingModal.value = true
}

const closeSavingModal = () => {
  showSavingModal.value = false
  editingSaving.value = null
}

const saveSaving = async () => {
  savingSaving.value = true
  try {
    const targetAmount = parseNumber(savingForm.value.target_amount)
    const currentAmount = parseNumber(savingForm.value.current_amount)
    const payload = {
      ...savingForm.value,
      target_amount: targetAmount,
      current_amount: currentAmount
    }
    
    if (editingSaving.value) {
      await api.put(`/savings/${editingSaving.value.id}`, payload)
      toast.success('Savings goal updated successfully!')
    } else {
      await api.post('/savings', payload)
      toast.success('Savings goal created successfully!')
    }
    await fetchSavings()
    closeSavingModal()
  } catch (error) {
    console.error('Error saving saving:', error)
    toast.error(error.response?.data?.message || 'Error saving savings goal')
  } finally {
    savingSaving.value = false
  }
}

const getSavingProgress = (saving) => {
  if (!saving.target_amount || saving.target_amount === 0) return 0
  return (saving.current_amount / saving.target_amount) * 100
}

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format number input (200000 -> 200.000)
const formatNumberInput = (value) => {
  if (!value && value !== 0) return ''
  const num = typeof value === 'string' ? parseNumber(value) : value
  if (isNaN(num)) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Parse formatted number (200.000 -> 200000)
const parseNumber = (value) => {
  if (!value) return ''
  const num = value.toString().replace(/\./g, '')
  const parsed = parseInt(num, 10)
  return isNaN(parsed) ? '' : parsed
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatPeriod = (period) => {
  const periodMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  }
  return periodMap[period] || period
}

// Lifecycle
onMounted(() => {
  fetchTransactions()
  fetchBudgets()
  fetchSavings()
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
