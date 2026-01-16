import { Link } from "react-router";
import PageMeta from "../components/common/PageMeta";

const modules = [
  {
    title: "Tasks & Targets",
    path: "/tasks",
    description: "Manage daily tasks and achieve your targets",
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-600 dark:text-blue-400",
    iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    title: "Personal Finance",
    path: "/finance",
    description: "Manage finances, budgets, and savings",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-500/20 dark:to-emerald-600/20",
    iconBg: "bg-green-100 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-600 dark:text-green-400",
    iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Productivity & Time",
    path: "/productivity",
    description: "Time tracking and increase productivity",
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-600/20",
    iconBg: "bg-purple-100 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    textColor: "text-purple-600 dark:text-purple-400",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Habits & Streaks",
    path: "/habits",
    description: "Build good habits and maintain streaks",
    gradient: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/20 dark:to-orange-600/20",
    iconBg: "bg-orange-100 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    textColor: "text-orange-600 dark:text-orange-400",
    iconPath: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  },
  {
    title: "Storage",
    path: "/storage",
    description: "Files and important links",
    gradient: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/20 dark:to-indigo-600/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    textColor: "text-indigo-600 dark:text-indigo-400",
    iconPath: "M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 5.25 4h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5A2.25 2.25 0 0 1 21.75 9v.776",
  },
  {
    title: "Journal & Notes",
    path: "/journals",
    description: "Reflect on your experiences and quick notes",
    gradient: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-500/20 dark:to-pink-600/20",
    iconBg: "bg-pink-100 dark:bg-pink-500/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    textColor: "text-pink-600 dark:text-pink-400",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
];

export default function Dashboard() {
  return (
    <>
      <PageMeta
        title="Dashboard - 26-step"
        description="Welcome to 26-step dashboard"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
          Welcome to 26-step
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your daily life more efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-theme-lg dark:border-gray-800 dark:bg-gray-800"
          >
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${module.gradient}`}
            ></div>

            <div className="relative z-10">
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${module.iconBg}`}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={module.iconColor}
                >
                  <path
                    d={module.iconPath}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                {module.title}
              </h2>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>

              <div className={`flex items-center text-sm font-medium ${module.textColor}`}>
                <span>Start</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

