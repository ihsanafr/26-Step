import PageMeta from "../../components/common/PageMeta";

export default function Finance() {
  return (
    <>
      <PageMeta
        title="Personal Finance - 26-step"
        description="Manage your finances, budgets, and savings"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Personal Finance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your finances, budgets, and savings
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          Finance module content will be migrated here. This is a placeholder page.
        </p>
      </div>
    </>
  );
}

