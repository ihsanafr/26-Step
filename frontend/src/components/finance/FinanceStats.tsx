import React from "react";
import { GridIcon, PlusIcon, TimeIcon } from "../../icons";
import { formatCurrency } from "../../utils/currency";

interface FinanceStatsProps {
    grandBalance: number;
    thisMonthIncome: number;
    thisMonthExpense: number;
    loading?: boolean;
}

/**
 * FinanceStats displays the hero balance card and smaller metrics.
 * Refined for a cleaner, more focused look.
 */
export const FinanceStats: React.FC<FinanceStatsProps> = ({
    grandBalance,
    thisMonthIncome,
    thisMonthExpense,
}) => {
    return (
        <div className="space-y-4">
            {/* Active Balance Card - White Background, Icon on Left */}
            <div className="group rounded-2xl border border-indigo-100 bg-white p-6 shadow-theme-xs transition-all hover:border-indigo-200 dark:border-indigo-500/10 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <GridIcon className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                Active Balance
                            </p>
                            <span className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                                Accumulated Total
                            </span>
                        </div>
                        <p className="mt-1 truncate text-2xl font-black text-gray-900 dark:text-white sm:text-3xl">
                            {formatCurrency(grandBalance, false)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sub Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Income Card */}
                <div className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-theme-xs transition-all hover:border-emerald-200 dark:border-emerald-500/10 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <PlusIcon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    Income
                                </p>
                                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                                    Bulan ini
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(thisMonthIncome, false)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="group rounded-2xl border border-rose-100 bg-white p-5 shadow-theme-xs transition-all hover:border-rose-200 dark:border-rose-500/10 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                            <TimeIcon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    Expense
                                </p>
                                <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 uppercase">
                                    Bulan ini
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(thisMonthExpense, false)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
