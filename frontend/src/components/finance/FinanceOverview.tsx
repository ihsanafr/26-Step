import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Skeleton } from "../common/Skeleton";
import Button from "../ui/button/Button";
import { DollarLineIcon, FileIcon, GridIcon } from "../../icons";
import { financialTransactionsService, FinancialTransaction } from "../../services/financialTransactionsService";
import { budgetsService, Budget } from "../../services/budgetsService";
import { formatIndonesianDate } from "../../utils/date";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FinanceOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [t, b] = await Promise.all([
          financialTransactionsService.getAll(),
          budgetsService.getAll(),
        ]);
        setTransactions(t);
        setBudgets(b);
      } catch (error) {
        console.error("Error loading finance overview:", error);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 6), [transactions]);
  const activeBudgets = useMemo(() => budgets.filter((b) => b.is_active).slice(0, 4), [budgets]);

  const stats = [
    {
      label: "Total Income",
      value: formatCurrency(totals.income),
      icon: DollarLineIcon,
      gradientFrom: "from-emerald-50",
      gradientTo: "to-emerald-100",
      borderColor: "border-emerald-200 dark:border-gray-700",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      darkGradientFrom: "dark:from-emerald-500/10",
      darkGradientTo: "dark:to-emerald-500/5",
    },
    {
      label: "Total Expense",
      value: formatCurrency(totals.expense),
      icon: DollarLineIcon,
      gradientFrom: "from-rose-50",
      gradientTo: "to-rose-100",
      borderColor: "border-rose-200 dark:border-gray-700",
      iconBg: "bg-rose-100 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      darkGradientFrom: "dark:from-rose-500/10",
      darkGradientTo: "dark:to-rose-500/5",
    },
    {
      label: "Balance",
      value: formatCurrency(totals.balance),
      icon: GridIcon,
      gradientFrom: "from-indigo-50",
      gradientTo: "to-indigo-100",
      borderColor: "border-indigo-200 dark:border-gray-700",
      iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      darkGradientFrom: "dark:from-indigo-500/10",
      darkGradientTo: "dark:to-indigo-500/5",
    },
    {
      label: "Active Budgets",
      value: activeBudgets.length,
      icon: FileIcon,
      gradientFrom: "from-amber-50",
      gradientTo: "to-amber-100",
      borderColor: "border-amber-200 dark:border-gray-700",
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      darkGradientFrom: "dark:from-amber-500/10",
      darkGradientTo: "dark:to-amber-500/5",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Personal Finance</h1>
          <p className="mb-6 text-lg text-emerald-50 md:text-xl">
            Manage your income, expenses, and budget efficiently
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/finance/transactions")}
              variant="outline"
              className="!bg-white !text-emerald-600 !ring-transparent hover:!bg-emerald-50"
            >
              <DollarLineIcon className="mr-2 h-5 w-5" />
              Catat Transaksi
            </Button>
            <Button
              onClick={() => navigate("/finance/budget")}
              className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <FileIcon className="mr-2 h-5 w-5" />
              Kelola Budget
            </Button>
            <Button
              onClick={() => navigate("/finance/categories")}
              className="bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <GridIcon className="mr-2 h-5 w-5" />
              Kategori
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} ${stat.darkGradientFrom} ${stat.darkGradientTo} p-6 shadow-theme-xs`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg ${stat.iconBg} p-2`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaksi Terbaru</h2>
              <button
                onClick={() => navigate("/finance/transactions")}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Lihat semua →
              </button>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No transactions yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-gray-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {t.description || t.category || "Transaction"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.category || "Uncategorized"} • {formatIndonesianDate(t.date)}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(Number(t.amount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Budgets */}
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Budgets</h2>
              <button
                onClick={() => navigate("/finance/budget")}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Manage →
              </button>
            </div>
            {activeBudgets.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No active budgets
              </div>
            ) : (
              <div className="space-y-4">
                {activeBudgets.map((b) => {
                  const percent = Math.min(100, Math.round(b.percentage ?? 0));
                  return (
                    <div key={b.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {b.category}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{percent}%</div>
                      </div>
                      <div className="mb-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(b.spent || 0)} / {formatCurrency(b.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
