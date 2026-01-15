import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Skeleton } from "../common/Skeleton";
import Button from "../ui/button/Button";
import { DollarLineIcon, FileIcon, GridIcon } from "../../icons";
import { financialTransactionsService, FinancialTransaction } from "../../services/financialTransactionsService";
import { budgetsService, Budget } from "../../services/budgetsService";
import { formatIndonesianDate } from "../../utils/date";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
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
      color: "from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Total Expense",
      value: formatCurrency(totals.expense),
      icon: DollarLineIcon,
      color: "from-rose-500 to-rose-600",
      borderColor: "border-rose-200 dark:border-rose-800",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      textColor: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Balance",
      value: formatCurrency(totals.balance),
      icon: GridIcon,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Active Budgets",
      value: activeBudgets.length,
      icon: FileIcon,
      color: "from-amber-500 to-amber-600",
      borderColor: "border-amber-200 dark:border-amber-800",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      textColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Personal Finance</h1>
          <p className="mb-6 text-lg text-emerald-100 md:text-xl">
            Kelola pemasukan, pengeluaran, dan budget kamu dengan rapi
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl border-2 ${stat.borderColor} ${stat.bgColor} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
              <div className="relative z-10">
                <div className={`mb-3 inline-flex rounded-xl ${stat.bgColor} p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
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
                Belum ada transaksi
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
                        {t.description || t.category || "Transaksi"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t.category || "Tanpa kategori"} • {formatIndonesianDate(t.date)}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Aktif</h2>
              <button
                onClick={() => navigate("/finance/budget")}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Kelola →
              </button>
            </div>
            {activeBudgets.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Belum ada budget aktif
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
