import { useEffect, useMemo, useState } from "react";
import Button from "../ui/button/Button";
import AlertModal from "../common/AlertModal";
import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import DatePicker from "../form/input/DatePicker";
import { categoriesService, Category } from "../../services/categoriesService";
import {
  financialTransactionsService,
  FinancialTransaction,
} from "../../services/financialTransactionsService";
import { formatIndonesianDate } from "../../utils/date";
import { FinanceStats } from "./FinanceStats";
import { PlusIcon, PencilIcon, TrashBinIcon, EyeIcon, DollarLineIcon } from "../../icons";

import { formatCurrency } from "../../utils/currency";

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
  type: "expense" as "income" | "expense",
  amount: "",
  category: "",
  description: "",
  notes: "",
  date: "",
};

export default function TransactionsList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editing, setEditing] = useState<FinancialTransaction | null>(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; item: FinancialTransaction | null }>({
    open: false,
    item: null,
  });
  const [deleting, setDeleting] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState<{ open: boolean; item: FinancialTransaction | null }>({
    open: false,
    item: null,
  });
  const [isClosingView, setIsClosingView] = useState(false);

  const getTodayYmd = () => new Date().toISOString().slice(0, 10);

  const load = async () => {
    try {
      setLoading(true);
      const [transactions, cats] = await Promise.all([
        financialTransactionsService.getAll(),
        categoriesService.getAll(),
      ]);
      setItems(transactions);
      setCategories(cats);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setForm({ ...initialForm, date: getTodayYmd() });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.date) {
      setError("Please fill in the amount and transaction date");
      return;
    }
    const payload = {
      type: form.type,
      amount: parseRupiahInput(form.amount),
      category: form.category || null,
      description: form.description + (form.notes ? `\n\nNotes:\n${form.notes}` : ""),
      date: form.date,
    };
    try {
      setSaving(true);
      setError(null);
      if (editing) {
        await financialTransactionsService.update(editing.id, payload);
      } else {
        await financialTransactionsService.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: FinancialTransaction) => {
    setEditing(item);
    setForm({
      type: item.type,
      amount: formatRupiahInput(String(Math.floor(Number(item.amount)))),
      category: item.category || "",
      description: (item.description || "").split("\n\nNotes:\n")[0],
      notes: (item.description || "").split("\n\nNotes:\n")[1] || "",
      date: item.date?.slice(0, 10) || "",
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;
    try {
      setDeleting(true);
      await financialTransactionsService.delete(deleteModal.item.id);
      setDeleteModal({ open: false, item: null });
      await load();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  const processedCategories = useMemo(() => {
    const seen = new Set<string>();
    return categories.filter((c) => {
      const lowerName = c.name.toLowerCase();
      if (seen.has(lowerName)) return false;
      seen.add(lowerName);
      return true;
    });
  }, [categories]);

  const totals = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const grandIncome = items
      .filter((i) => i.type === "income")
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);
    const grandExpense = items
      .filter((i) => i.type === "expense")
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const thisMonthTransactions = items.filter((t) => {
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
      grandBalance: grandIncome - grandExpense,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthNet: thisMonthIncome - thisMonthExpense,
    };
  }, [items]);



  const filteredItems = useMemo(() => {
    let filtered = items;
    if (typeFilter !== "all") {
      filtered = filtered.filter((i) => i.type === typeFilter);
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((i) => i.category === categoryFilter);
    }
    if (dateFrom) {
      filtered = filtered.filter((i) => i.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((i) => i.date <= dateTo);
    }
    return filtered;
  }, [items, typeFilter, categoryFilter, dateFrom, dateTo]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, categoryFilter, dateFrom, dateTo, items]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header - Consistent with Budget/Categories */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
            <DollarLineIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track and manage your daily income and expenses</p>
          </div>
        </div>
      </div>

      <FinanceStats
        grandBalance={totals.grandBalance}
        thisMonthIncome={totals.thisMonthIncome}
        thisMonthExpense={totals.thisMonthExpense}
      />

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Categories</option>
            {processedCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <DatePicker
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <DatePicker
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <div className="ml-auto">
            <Button
              onClick={() => {
                setShowForm(true);
                setForm((prev) => ({ ...prev, date: prev.date || getTodayYmd() }));
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">Loading transactions...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">No transactions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">DATE</th>
                  <th className="px-6 py-4 text-left font-semibold">DESCRIPTION</th>
                  <th className="px-6 py-4 text-left font-semibold">CATEGORY</th>
                  <th className="px-6 py-4 text-left font-semibold">TYPE</th>
                  <th className="px-6 py-4 text-right font-semibold">AMOUNT</th>
                  <th className="px-6 py-4 text-center font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 dark:border-gray-700 ${idx % 2 === 0 ? "bg-gray-50/40 dark:bg-gray-900/30" : "bg-transparent"
                      }`}
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatIndonesianDate(item.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <div className="max-w-[200px] truncate" title={item.description || ""}>
                        {item.description ? item.description.split("\n\nNotes:\n")[0] : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.type === "income"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                          }`}
                      >
                        {item.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"
                        }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(Number(item.amount), Number(item.amount) >= 10000000)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setViewModal({ open: true, item })}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, item })}
                          className="text-rose-600 hover:text-rose-700"
                          title="Delete"
                        >
                          <TrashBinIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50 dark:border-gray-700"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"
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
            className={`flex w-full max-w-2xl flex-col max-h-[90vh] rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900/95 ${isClosing ? "animate-out fade-out zoom-out-95" : "animate-in fade-in zoom-in-95"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 shrink-0 dark:border-gray-700 md:px-6 md:py-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white md:text-xl">
                {editing ? "Edit Transaction" : "Add New Transaction"}
              </h2>
              <button
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
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

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar-minimal">
              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type *</label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, type: "income" }))}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all sm:p-5 ${form.type === "income"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/70"
                        }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-2xl text-emerald-500 dark:text-emerald-400 sm:h-12 sm:w-12">
                        +
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">Income</div>
                      <div className="hidden text-[10px] text-gray-500 dark:text-gray-400 sm:block">Money received</div>
                      {form.type === "income" && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white sm:right-3 sm:top-3 sm:h-6 sm:w-6">
                          ✓
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, type: "expense" }))}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all sm:p-5 ${form.type === "expense"
                        ? "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20 dark:bg-rose-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/70"
                        }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-2xl text-rose-500 dark:text-rose-400 sm:h-12 sm:w-12">
                        –
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">Expense</div>
                      <div className="hidden text-[10px] text-gray-500 dark:text-gray-400 sm:block">Money spent</div>
                      {form.type === "expense" && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white sm:right-3 sm:top-3 sm:h-6 sm:w-6">
                          ✓
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {processedCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {(cat.icon || "📁") + " " + cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (Rp) *</label>
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
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
                    <DatePicker
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description *</label>
                      <span className="text-[10px] text-gray-400">
                        {form.description.trim() === "" ? 0 : form.description.trim().split(/\s+/).length}/30 words
                      </span>
                    </div>
                    <input
                      value={form.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        const words = val.trim().split(/\s+/).filter(Boolean);
                        if (words.length <= 30) {
                          setForm((prev) => ({ ...prev, description: val }));
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Enter description"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Notes (Optional)</label>
                    <span className="text-[10px] text-gray-400">{form.notes.length}/200</span>
                  </div>
                  <textarea
                    value={form.notes}
                    maxLength={200}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="h-28 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-700 md:px-6 md:py-4">
              <button
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
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
                className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/30 hover:bg-purple-700 disabled:opacity-60"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Saving..." : editing ? "Update" : "Create"}
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
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
      />

      <AlertModal
        isOpen={!!error}
        onClose={() => setError(null)}
        title="Error"
        message={error || ""}
        type="error"
      />

      {/* View Details Modal */}
      {viewModal.open && viewModal.item && (
        <div
          className={`fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200 ${isClosingView ? "opacity-0" : "opacity-100"
            }`}
          onClick={() => {
            setIsClosingView(true);
            setTimeout(() => {
              setIsClosingView(false);
              setViewModal({ open: false, item: null });
            }, 200);
          }}
        >
          <div
            className={`w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900 ${isClosingView ? "animate-out fade-out zoom-out-95" : "animate-in fade-in zoom-in-95"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 text-white ${viewModal.item.type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Transaction Details</span>
                <button
                  onClick={() => {
                    setIsClosingView(true);
                    setTimeout(() => {
                      setIsClosingView(false);
                      setViewModal({ open: false, item: null });
                    }, 200);
                  }}
                  className="hover:rotate-90 transition-transform"
                >✕</button>
              </div>
              <h3 className="mt-4 text-3xl font-black">{formatCurrency(Number(viewModal.item.amount))}</h3>
              <p className="mt-1 text-white/80">{viewModal.item.category || 'Uncategorized'}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</label>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatIndonesianDate(viewModal.item.date)}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Type</label>
                  <p className={`font-semibold ${viewModal.item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {viewModal.item.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {(viewModal.item.description || "").split("\n\nNotes:\n")[0] || "-"}
                </p>
              </div>

              {(viewModal.item.description || "").includes("\n\nNotes:\n") && (
                <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Notes</label>
                  <div className="mt-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
                    {(viewModal.item.description || "").split("\n\nNotes:\n")[1]}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30 text-center">
              <button
                onClick={() => {
                  setIsClosingView(true);
                  setTimeout(() => {
                    setIsClosingView(false);
                    setViewModal({ open: false, item: null });
                  }, 200);
                }}
                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
