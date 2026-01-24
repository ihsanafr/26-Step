import { useEffect, useMemo, useState, useRef } from "react";
import AlertModal from "../common/AlertModal";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import DatePicker from "../form/input/DatePicker";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { budgetsService, Budget } from "../../services/budgetsService";
import { categoriesService, Category } from "../../services/categoriesService";
import { formatCurrency } from "../../utils/currency";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon, TrashBinIcon, GridIcon, MoreDotIcon, PlusIcon } from "../../icons";

function formatRupiahInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseRupiahInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

const PRESET_COLORS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Cyan", value: "#06b6d4" },
];

const initialForm = {
  category: "",
  amount: "",
  period: "monthly",
  start_date: "",
  end_date: "",
  is_active: true,
  color: "#4f46e5",
};

export default function BudgetsList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: Budget | null }>({
    open: false,
    item: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Menu click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const getTodayYmd = () => new Date().toISOString().slice(0, 10);

  const addMonths = (dateStr: string, months: number) => {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().slice(0, 10);
  };

  const computeEndDate = (start: string, period: string) => {
    if (!start) return "";
    if (period === "weekly") {
      const d = new Date(start);
      d.setDate(d.getDate() + 7);
      return d.toISOString().slice(0, 10);
    }
    if (period === "yearly") return addMonths(start, 12);
    return addMonths(start, 1);
  };

  const resetForm = () => {
    const today = getTodayYmd();
    setForm({
      ...initialForm,
      start_date: today,
      end_date: computeEndDate(today, "monthly"),
    });
    setEndDateTouched(false);
    setEditing(null);
    setShowForm(false);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    // Small delay to allow DOM mounting before starting animation
    setTimeout(() => setIsMounted(true), 10);
  };

  const handleCloseForm = () => {
    setIsClosing(true);
    setIsMounted(false);
    setTimeout(() => {
      setIsClosing(false);
      setShowForm(false);
      resetForm();
    }, 300);
  };

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.start_date || !form.end_date) {
      setError("Please fill in all required fields");
      return;
    }
    const payload = {
      category: form.category,
      amount: parseRupiahInput(form.amount),
      period: form.period,
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      color: form.color,
    };
    try {
      setSaving(true);
      setError(null);
      if (editing) {
        await budgetsService.update(editing.id, payload);
      } else {
        await budgetsService.create(payload);
      }
      handleCloseForm();
      await load();
    } catch (err) {
      console.error("Error saving budget:", err);
      setError("Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Budget) => {
    setEditing(item);
    setForm({
      category: item.category,
      amount: formatRupiahInput(String(Math.floor(Number(item.amount)))),
      period: item.period || "monthly",
      start_date: item.start_date?.slice(0, 10) || "",
      end_date: item.end_date?.slice(0, 10) || "",
      is_active: item.is_active,
      color: item.color || "#4f46e5",
    });
    handleOpenForm();
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
      setError("Failed to delete budget");
    } finally {
      setDeleting(false);
    }
  };

  const totalBudget = useMemo(
    () => items.reduce((sum, b) => sum + Number(b.amount || 0), 0),
    [items]
  );

  const processedCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter((c) => {
      const lowerName = c.name.toLowerCase();
      if (seen.has(lowerName)) return false;
      seen.add(lowerName);
      return true;
    });
  }, [categories]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage]);

  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Header - Target Goals Style */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
              <GridIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Budgets</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Total Pooled Budget: <span className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(totalBudget)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition-all hover:bg-brand-700 shadow-theme-xs shadow-brand-500/20"
          >
            <PlusIcon className="h-5 w-5" />
            Create Budget
          </button>
        </div>
      </div>

      {/* Grid - Target Goals Style */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-56 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/50" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-gray-500">No budgets tracked yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item, index) => {
              const percent = Math.min(100, Math.round(item.percentage ?? 0));
              const themeColor = item.color || "#4f46e5";

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50/50 to-white p-6 shadow-theme-xs transition-all duration-300 hover:shadow-theme-md hover:scale-[1.01] dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-800/30"
                >
                  {/* Menu Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
                    >
                      <MoreDotIcon className="w-5 h-5 focus:outline-none" />
                    </button>
                    {openMenuId === item.id && (
                      <div
                        ref={(el) => { menuRefs.current[item.id] = el; }}
                        className="absolute right-0 top-10 z-50 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-theme-md dark:border-gray-700 dark:bg-gray-800"
                      >
                        <button
                          onClick={() => { setOpenMenuId(null); handleEdit(item); }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => { setOpenMenuId(null); setDeleteModal({ open: true, item }); }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4 pr-10">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm shadow-theme-xs"
                      style={{ backgroundColor: themeColor }}
                    >
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">{item.category}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.period || 'monthly'} context</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {item.period || 'monthly'}
                    </span>
                    <span className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${item.is_active
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="mt-6 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Limit</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-auto pt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span style={{ color: themeColor }}>
                        {formatCurrency(item.spent || 0, false)} / {formatCurrency(item.amount, false)} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900/50">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{ width: `${percent}%`, backgroundColor: themeColor }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-gray-400">
                      <span>{formatIndonesianDateShort(item.start_date)}</span>
                      <span>{formatIndonesianDateShort(item.end_date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${currentPage === p
                      ? "bg-brand-600 text-white"
                      : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-theme-xs disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form Modal - Target Goals Style */}
      {showForm && (
        <div
          className={`fixed inset-0 z-[100000] flex items-start justify-center bg-black/40 p-4 pt-12 backdrop-blur-[2px] transition-all duration-300 overflow-y-auto ${isMounted && !isClosing ? "opacity-100" : "opacity-0 invisible"
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) handleCloseForm();
          }}
        >
          <div
            className={`w-full max-w-2xl my-8 rounded-2xl border border-gray-100 bg-white shadow-theme-xl dark:border-gray-800 dark:bg-gray-800 transition-all duration-300 ease-out ${isMounted && !isClosing ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-8"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Budget Configuration" : "Create New Budget Entry"}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <div className="relative mt-1.5">
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select category...</option>
                      {processedCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="amount">Budget Limit (Rp) *</Label>
                  <div className="relative mt-1.5 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs dark:border-gray-700 dark:bg-gray-900">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                    <input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      value={form.amount}
                      onChange={(e) => setForm((prev) => ({ ...prev, amount: formatRupiahInput(e.target.value) }))}
                      className="ml-6 w-full bg-transparent font-black text-gray-900 outline-none dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Color Selection */}
              <div>
                <Label>Budget Theme Color</Label>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, color: c.value }))}
                      className={`h-9 w-9 rounded-lg transition-all ${form.color === c.value ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-800 scale-110" : "hover:scale-110 opacity-60 hover:opacity-100"
                        }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-1 pr-3 dark:border-gray-700">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                      className="h-7 w-12 cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Custom</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="period">Cycle Period *</Label>
                  <div className="relative mt-1.5">
                    <select
                      id="period"
                      value={form.period}
                      onChange={(e) => {
                        const nextPeriod = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          period: nextPeriod,
                          end_date: endDateTouched ? prev.end_date : computeEndDate(prev.start_date, nextPeriod),
                        }));
                      }}
                      className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm shadow-theme-xs outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-8">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active_check"
                      checked={form.is_active}
                      onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <Label htmlFor="is_active_check" className="!mb-0">Active Status</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <div className="mt-1.5">
                    <DatePicker
                      id="start_date"
                      value={form.start_date}
                      onChange={(e) => {
                        const nextStart = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          start_date: nextStart,
                          end_date: endDateTouched ? prev.end_date : computeEndDate(nextStart, prev.period),
                        }));
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="end_date">End Date *</Label>
                  <div className="mt-1.5">
                    <DatePicker
                      id="end_date"
                      value={form.end_date}
                      onChange={(e) => {
                        setEndDateTouched(true);
                        setForm((prev) => ({ ...prev, end_date: e.target.value }));
                      }}
                      min={form.start_date}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 p-6 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleCloseForm} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : editing ? "Update Budget" : "Create Budget"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Common Modals */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Budget"
        message="Are you sure you want to remove this spending limit?"
      />

      <AlertModal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Configuration Error"
        message={error || ""}
        type="error"
      />
    </div>
  );
}

// Add a helper for short date format
function formatIndonesianDateShort(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}
