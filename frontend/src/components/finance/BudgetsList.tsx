import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import AlertModal from "../common/AlertModal";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import DatePicker from "../form/input/DatePicker";
import { budgetsService, Budget } from "../../services/budgetsService";
import { categoriesService, Category } from "../../services/categoriesService";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRupiahInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseRupiahInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

const initialForm = {
  category: "",
  amount: "",
  period: "monthly",
  start_date: "",
  end_date: "",
  is_active: true,
};

export default function BudgetsList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Budget | null }>({
    open: false,
    item: null,
  });
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [budgets, cats] = await Promise.all([
        budgetsService.getAll(),
        categoriesService.getAll(),
      ]);
      setItems(budgets);
      setCategories(cats);
    } catch (err) {
      console.error("Error loading budgets:", err);
      setError("Gagal memuat budget");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const getTodayYmd = () => new Date().toISOString().slice(0, 10);

  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  const addMonths = (dateStr: string, months: number) => {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  };

  const computeEndDate = (start: string, period: string) => {
    if (!start) return "";
    if (period === "weekly") return addDays(start, 7);
    if (period === "yearly") return addMonths(start, 12);
    if (period === "monthly") return addMonths(start, 1);
    return addMonths(start, 1);
  };

  const resetForm = () => {
    const today = getTodayYmd();
    setForm({
      ...initialForm,
      start_date: today,
      end_date: computeEndDate(today, initialForm.period || "monthly"),
    });
    setEndDateTouched(false);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.start_date || !form.end_date) {
      setError("Mohon lengkapi kategori, jumlah, dan periode");
      return;
    }
    const payload = {
      category: form.category,
      amount: parseRupiahInput(form.amount),
      period: form.period,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
    };
    try {
      setSaving(true);
      setError(null);
      if (editing) {
        await budgetsService.update(editing.id, payload);
      } else {
        await budgetsService.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Gagal menyimpan budget");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Budget) => {
    setEditing(item);
    setForm({
      category: item.category,
      amount: String(item.amount),
      period: item.period || "monthly",
      start_date: item.start_date?.slice(0, 10) || "",
      end_date: item.end_date?.slice(0, 10) || "",
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await budgetsService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } catch (err) {
      console.error("Error deleting budget:", err);
      setError("Gagal menghapus budget");
    } finally {
      setDeleting(false);
    }
  };

  const totalBudget = useMemo(
    () => items.reduce((sum, b) => sum + Number(b.amount || 0), 0),
    [items]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Atur budget bulanan Anda untuk kontrol pengeluaran
            </p>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setForm((prev) => {
                const start = prev.start_date || getTodayYmd();
                const period = prev.period || "monthly";
                return {
                  ...prev,
                  start_date: start,
                  end_date: prev.end_date || computeEndDate(start, period),
                };
              });
              setEndDateTouched(false);
            }}
          >
            Create Budget
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <p className="text-sm text-amber-600 dark:text-amber-400">Total Budget</p>
        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(totalBudget)}</p>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">Memuat budget...</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">Belum ada budget</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const percent = Math.min(100, Math.round(item.percentage ?? 0));
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 p-4 transition-all hover:border-amber-300 hover:bg-amber-50 dark:border-gray-700 dark:hover:border-amber-700 dark:hover:bg-amber-950/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{item.category}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.period || "custom"} • {item.start_date} → {item.end_date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{percent}%</div>
                    </div>
                  </div>
                  <div className="mb-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatCurrency(item.spent || 0)} spent</span>
                    <span>{formatCurrency(item.remaining || item.amount)} remaining</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, item })}
                      className="rounded-md border border-rose-200 px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/20"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsClosing(true);
              setTimeout(() => {
                setIsClosing(false);
                resetForm();
              }, 200);
            }
          }}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
              isClosing ? "animate-out fade-out zoom-out-95" : "animate-in fade-in zoom-in-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Budget" : "Create New Budget"}
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsClosing(false);
                    resetForm();
                  }, 200);
                }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {(cat.icon || "📁") + " " + cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Budget Amount (Rp) *</label>
                  <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-800">
                    <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, amount: formatRupiahInput(e.target.value) }))
                      }
                      className="w-full bg-transparent text-sm text-gray-900 outline-none dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Period</label>
                  <select
                    value={form.period || "monthly"}
                    onChange={(e) => {
                      const nextPeriod = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        period: nextPeriod,
                        end_date: endDateTouched ? prev.end_date : computeEndDate(prev.start_date, nextPeriod),
                      }));
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
                  <DatePicker
                    value={form.start_date}
                    onChange={(e) => {
                      const nextStart = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        start_date: nextStart,
                        end_date: endDateTouched ? prev.end_date : computeEndDate(nextStart, prev.period || "monthly"),
                      }));
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date *</label>
                  <DatePicker
                    value={form.end_date}
                    onChange={(e) => {
                      setEndDateTouched(true);
                      setForm((prev) => ({ ...prev, end_date: e.target.value }));
                    }}
                    min={form.start_date}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-700/40 dark:bg-blue-900/30 dark:text-blue-200">
                <div className="mb-1 font-semibold">Budget Tips</div>
                Set a realistic budget amount based on your spending history. You'll be notified when you're close to or exceed your budget limit.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setIsClosing(false);
                    resetForm();
                  }, 200);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update Budget" : "Create Budget"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Hapus Budget"
        message="Apakah Anda yakin ingin menghapus budget ini?"
      />

      <AlertModal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Terjadi Kesalahan"
        message={error || ""}
        type="error"
      />
    </div>
  );
}
