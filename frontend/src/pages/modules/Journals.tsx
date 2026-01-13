import PageMeta from "../../components/common/PageMeta";

export default function Journals() {
  return (
    <>
      <PageMeta
        title="Journal & Notes - 26-step"
        description="Reflect on your experiences and quick notes"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Journal & Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reflect on your experiences and quick notes
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          Journals module content will be migrated here. This is a placeholder page.
        </p>
      </div>
    </>
  );
}

