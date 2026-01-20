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
import { PlusIcon, PencilIcon, TrashBinIcon } from "../../icons";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
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
  type: "expense" as "income" | "expense",
  amount: "",
  category: "",
  description: "",
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
      description: form.description || null,
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
      amount: String(item.amount),
      category: item.category || "",
      description: item.description || "",
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

  const totalIncome = useMemo(
    () => items.filter((i) => i.type === "income").reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [items]
  );
  const totalExpense = useMemo(
    () => items.filter((i) => i.type === "expense").reduce((sum, i) => sum + Number(i.amount || 0), 0),
    [items]
  );

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
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
        <h1 className="mb-2 text-4xl font-bold">Transactions</h1>
        <p className="text-white/90">Track your income and expenses</p>
      </div>

      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Home <span className="mx-2">›</span> Finance Tools <span className="mx-2">›</span>{" "}
        <span className="font-semibold text-gray-900 dark:text-white">Transactions</span>
      </div>

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
            {categories.map((cat) => (
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
                    className={`border-b border-gray-100 dark:border-gray-700 ${
                      idx % 2 === 0 ? "bg-gray-50/40 dark:bg-gray-900/30" : "bg-transparent"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatIndonesianDate(item.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {item.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                        }`}
                      >
                        {item.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        item.type === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(Number(item.amount))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
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
            className={`w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900/95 dark:text-white ${
              isClosing ? "animate-out fade-out zoom-out-95" : "animate-in fade-in zoom-in-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editing ? "Edit Transaction" : "Add New Transaction"}
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

            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Type *</label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: "income" }))}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-left transition-all ${
                      form.type === "income"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/70"
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/20 text-3xl text-emerald-500 dark:text-emerald-400">
                      +
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Income</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Money received</div>
                    {form.type === "income" && (
                      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                        ✓
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: "expense" }))}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-left transition-all ${
                      form.type === "expense"
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-500/10"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/70"
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600/20 text-3xl text-rose-500 dark:text-rose-400">
                      –
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">Expense</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Money spent</div>
                    {form.type === "expense" && (
                      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white">
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
                    {categories.map((cat) => (
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
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter description"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Additional notes..."
                />
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
                {saving ? "Saving..." : editing ? "Update Transaction" : "Create Transaction"}
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
    </div>
  );
}
