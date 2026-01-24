import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Skeleton } from "../common/Skeleton";
import Button from "../ui/button/Button";
import { DollarLineIcon, FileIcon, GridIcon } from "../../icons";
import { FinanceStats } from "./FinanceStats";
import DatePicker from "../form/input/DatePicker";
import { financialTransactionsService, FinancialTransaction } from "../../services/financialTransactionsService";
import { budgetsService, Budget } from "../../services/budgetsService";
import { formatIndonesianDate } from "../../utils/date";
import Chart from "react-apexcharts";
import { formatCurrency } from "../../utils/currency";

export default function FinanceOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Default range: last 7 days
  const [chartFrom, setChartFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [chartTo, setChartTo] = useState(() => new Date().toISOString().slice(0, 10));

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
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const thisMonthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const thisMonthIncome = thisMonthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const thisMonthExpense = thisMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      grandIncome: income,
      grandExpense: expense,
      grandBalance: income - expense,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthNet: thisMonthIncome - thisMonthExpense,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => transactions.slice(0, 6), [transactions]);
  const activeBudgets = useMemo(() => budgets.filter((b) => b.is_active).slice(0, 4), [budgets]);



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

      <FinanceStats
        grandBalance={totals.grandBalance}
        thisMonthIncome={totals.thisMonthIncome}
        thisMonthExpense={totals.thisMonthExpense}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income vs Expense Area Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Income vs Expense</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Transaction trend</p>
            </div>
            <div className="flex items-center gap-2">
              <DatePicker
                value={chartFrom}
                onChange={(e) => setChartFrom(e.target.value)}
                className="!py-1 !text-xs"
              />
              <span className="text-gray-400">to</span>
              <DatePicker
                value={chartTo}
                onChange={(e) => setChartTo(e.target.value)}
                className="!py-1 !text-xs"
              />
            </div>
          </div>
          <div className="h-[300px] w-full">
            <Chart
              options={{
                chart: {
                  id: "finance-trend",
                  toolbar: { show: false },
                  background: "transparent",
                },
                xaxis: {
                  categories: (() => {
                    const days = [];
                    const start = new Date(chartFrom);
                    const end = new Date(chartTo);
                    const curr = new Date(start);
                    while (curr <= end) {
                      days.push(curr.getDate() + " " + curr.toLocaleString("default", { month: "short" }));
                      curr.setDate(curr.getDate() + 1);
                    }
                    return days;
                  })(),
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { style: { colors: "#64748b", fontSize: "11px" } },
                },
                yaxis: {
                  labels: {
                    style: { colors: "#64748b" },
                    formatter: (val) => formatCurrency(val, true),
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                colors: ["#10b981", "#ef4444"],
                stroke: { curve: "smooth", width: 3, lineCap: "round" },
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    type: "vertical",
                    opacityFrom: 0.4,
                    opacityTo: 0,
                    stops: [0, 100],
                  },
                },
                legend: { position: "bottom", labels: { colors: "#64748b" } },
                grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
                markers: {
                  size: 0,
                  hover: { size: 6 },
                },
                tooltip: {
                  theme: "light",
                  y: { formatter: (val) => formatCurrency(Number(val)) },
                },
              }}
              series={[
                {
                  name: "Income",
                  data: (() => {
                    const data = [];
                    const start = new Date(chartFrom);
                    const end = new Date(chartTo);
                    const curr = new Date(start);
                    while (curr <= end) {
                      const ymd = curr.toISOString().slice(0, 10);
                      const daily = transactions
                        .filter((t) => t.date.slice(0, 10) === ymd && t.type === "income")
                        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                      data.push(daily);
                      curr.setDate(curr.getDate() + 1);
                    }
                    return data;
                  })(),
                },
                {
                  name: "Expense",
                  data: (() => {
                    const data = [];
                    const start = new Date(chartFrom);
                    const end = new Date(chartTo);
                    const curr = new Date(start);
                    while (curr <= end) {
                      const ymd = curr.toISOString().slice(0, 10);
                      const daily = transactions
                        .filter((t) => t.date.slice(0, 10) === ymd && t.type === "expense")
                        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
                      data.push(daily);
                      curr.setDate(curr.getDate() + 1);
                    }
                    return data;
                  })(),
                },
              ]}
              type="area"
              height="100%"
            />
          </div>
        </div>

        {/* Expense by Category Pie Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Expense by Category</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Top categories</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {(() => {
              const categoryMap = new Map<string, number>();
              const now = new Date();
              const currentMonth = now.getMonth();
              const currentYear = now.getFullYear();

              const thisMonthExpenses = transactions.filter((t) => {
                const d = new Date(t.date);
                return t.type === "expense" && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
              });

              thisMonthExpenses.forEach((t) => {
                const cat = t.category || "Uncategorized";
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(t.amount || 0));
              });

              const sortedCats = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
              const labels = sortedCats.map(c => c[0]);
              const values = sortedCats.map(c => c[1]);

              if (values.length === 0) {
                return (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    No expense data this month
                  </div>
                );
              }

              return (
                <Chart
                  options={{
                    labels,
                    colors: ["#3b82f6", "#ef4444", "#a855f7", "#f59e0b", "#10b981"],
                    legend: { position: "bottom", labels: { colors: "#64748b" } },
                    stroke: { show: false },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val: number) {
                        return val.toFixed(0) + "%";
                      },
                    },
                    tooltip: {
                      y: {
                        formatter: (val) => formatCurrency(val),
                      },
                    },
                  }}
                  series={values}
                  type="pie"
                  height="100%"
                />
              );
            })()}
          </div>
        </div>
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
                      {formatCurrency(Number(t.amount || 0), Number(t.amount || 0) >= 10000000)}
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
