import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <img src="/logo.svg" alt="26-step" className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">26-step</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-brand-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Manage Your Life
              </span>
              <br />
              <span className="text-gray-800 dark:text-gray-200">Better</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl lg:text-2xl">
              A personal management platform that helps you organize tasks, finances, habits, and daily life more efficiently and productively.
            </p>
          </div>

          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-brand-600 hover:to-blue-600 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
            >
              Get Started Free
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 shadow-md transition-all duration-300 hover:border-brand-500 hover:bg-gray-50 hover:text-brand-600 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:bg-gray-700"
            >
              Already Have Account?
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Tasks & Targets",
                description: "Manage your daily tasks and targets easily. Monitor your progress and achieve your goals.",
                icon: (
                  <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                bg: "from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20",
              },
              {
                title: "Personal Finance",
                description: "Track your income, expenses, and budget. Manage your savings better.",
                icon: (
                  <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                bg: "from-green-100 to-green-200 dark:from-green-500/20 dark:to-green-600/20",
              },
              {
                title: "Productivity & Time",
                description: "Manage time efficiently. Use Pomodoro timer and daily schedule for maximum productivity.",
                icon: (
                  <svg className="h-7 w-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                bg: "from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20",
              },
              {
                title: "Habits & Streaks",
                description: "Build good habits and maintain your streaks. Monitor consistency and achieve long-term goals.",
                icon: (
                  <svg className="h-7 w-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                bg: "from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20",
              },
              {
                title: "Storage",
                description: "Store notes, images, files, and important links. Organize all your documents in one place.",
                icon: (
                  <svg className="h-7 w-7 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h12a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                ),
                bg: "from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/20",
              },
              {
                title: "Journal & Notes",
                description: "Reflect on your experiences and quick notes. Keep track of your thoughts and ideas.",
                icon: (
                  <svg className="h-7 w-7 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                bg: "from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-600/20",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white/90 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800/90"
              >
                <div className={`mx-auto mb-4 grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

