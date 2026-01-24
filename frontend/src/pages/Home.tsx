import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import PageMeta from "../components/common/PageMeta";

// Component wrapper for scroll animation
const SectionWithAnimation = ({ children }: { children: React.ReactNode }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    setMounted(true);
  }, [isAuthenticated, navigate]);

  const modules = [
    {
      title: "Tasks & Targets",
      description: "Manage your daily tasks and targets easily. Monitor your progress and achieve your goals.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      bg: "from-blue-500 to-blue-600",
      iconBg: "from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20",
      cardBg: "bg-blue-500/10 dark:bg-blue-500/20",
      cardBorder: "border-blue-500/30 dark:border-blue-500/40",
      cardHover: "hover:bg-blue-500/20 dark:hover:bg-blue-500/30 hover:border-blue-500/50 dark:hover:border-blue-500/60",
      iconColor: "text-blue-600 dark:text-blue-400",
      path: "/tasks",
    },
    {
      title: "Personal Finance",
      description: "Track your income, expenses, and budget. Manage your savings better.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "from-green-500 to-green-600",
      iconBg: "from-green-100 to-green-200 dark:from-green-500/20 dark:to-green-600/20",
      cardBg: "bg-green-500/10 dark:bg-green-500/20",
      cardBorder: "border-green-500/30 dark:border-green-500/40",
      cardHover: "hover:bg-green-500/20 dark:hover:bg-green-500/30 hover:border-green-500/50 dark:hover:border-green-500/60",
      iconColor: "text-green-600 dark:text-green-400",
      path: "/finance",
    },
    {
      title: "Productivity & Time",
      description: "Manage time efficiently. Use Pomodoro timer and daily schedule for maximum productivity.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "from-purple-500 to-purple-600",
      iconBg: "from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20",
      cardBg: "bg-purple-500/10 dark:bg-purple-500/20",
      cardBorder: "border-purple-500/30 dark:border-purple-500/40",
      cardHover: "hover:bg-purple-500/20 dark:hover:bg-purple-500/30 hover:border-purple-500/50 dark:hover:border-purple-500/60",
      iconColor: "text-purple-600 dark:text-purple-400",
      path: "/productivity",
    },
    {
      title: "Habits & Streaks",
      description: "Build good habits and maintain your streaks. Monitor consistency and achieve long-term goals.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      bg: "from-orange-500 to-orange-600",
      iconBg: "from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20",
      cardBg: "bg-orange-500/10 dark:bg-orange-500/20",
      cardBorder: "border-orange-500/30 dark:border-orange-500/40",
      cardHover: "hover:bg-orange-500/20 dark:hover:bg-orange-500/30 hover:border-orange-500/50 dark:hover:border-orange-500/60",
      iconColor: "text-orange-600 dark:text-orange-400",
      path: "/habits",
    },
    {
      title: "Storage",
      description: "Store notes, images, files, and important links. Organize all your documents in one place.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 5.25 4h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5A2.25 2.25 0 0 1 21.75 9v.776" />
        </svg>
      ),
      bg: "from-indigo-500 to-indigo-600",
      iconBg: "from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/20",
      cardBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      cardBorder: "border-indigo-500/30 dark:border-indigo-500/40",
      cardHover: "hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 hover:border-indigo-500/50 dark:hover:border-indigo-500/60",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      path: "/storage",
    },
    {
      title: "Journal & Notes",
      description: "Reflect on your experiences and quick notes. Keep track of your thoughts and ideas.",
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bg: "from-pink-500 to-pink-600",
      iconBg: "from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-600/20",
      cardBg: "bg-pink-500/10 dark:bg-pink-500/20",
      cardBorder: "border-pink-500/30 dark:border-pink-500/40",
      cardHover: "hover:bg-pink-500/20 dark:hover:bg-pink-500/30 hover:border-pink-500/50 dark:hover:border-pink-500/60",
      iconColor: "text-pink-600 dark:text-pink-400",
      path: "/journals",
    },
  ];

  const isDark = theme === "dark";

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${isDark
      ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900"
      : "bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50"
      }`}>
      <PageMeta
        title="26-step - All-in-One Life Management Platform"
        description="A personal management platform that helps you organize tasks, finances, habits, and daily life more efficiently and productively."
      />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl animate-pulse ${isDark ? "bg-blue-500/15" : "bg-blue-400/10"
          }`}></div>
        <div className={`absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl animate-pulse ${isDark ? "bg-purple-500/15" : "bg-purple-400/10"
          }`} style={{ animationDelay: "1s" }}></div>
        <div className={`absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${isDark ? "bg-indigo-500/10" : "bg-indigo-400/8"
          }`}></div>
        <div className={`absolute top-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl ${isDark ? "bg-purple-600/10" : "bg-purple-300/8"
          }`} style={{ animationDelay: "2s" }}></div>
        <div className={`absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-blue-600/10" : "bg-blue-300/8"
          }`} style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className={`absolute inset-0 ${isDark
        ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
        : "bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]"
        } bg-[size:24px_24px]`}></div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              {/* Outer box with blue-purple gradient */}
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 blur-sm"></div>
              {/* Inner box with logo - blue-purple gradient */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow-lg">
                <img src="/logo.svg" alt="26-step" className="h-6 w-6" />
              </div>
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>26-step</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${isDark
                ? "text-gray-300 hover:bg-white/10 hover:text-white"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-brand-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-brand-600 hover:to-blue-600 hover:shadow-xl"
            >
              Register
            </Link>
            <div className="ml-1">
              <ThemeTogglerTwo />
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 md:py-20 lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className={`mb-10 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className={`group mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300 hover:scale-105 ${isDark
              ? "border-white/10 bg-white/5 text-white"
              : "border-gray-200 bg-gray-50 text-gray-700"
              }`}>
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
              ✨ All-in-One Life Management Platform
            </div>

            <h1 className={`relative mb-6 text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl ${isDark ? "text-white" : "text-gray-900"}`}>
              A smarter way to manage
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-brand-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  your life in 2026
                </span>
                {/* Decorative Underline */}
                <svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 450 12" fill="none" preserveAspectRatio="none">
                  <path d="M4 10C70 3 225 3 446 10" stroke="url(#paint0_linear_hero)" strokeWidth="6" strokeLinecap="round" strokeDasharray="450" strokeDashoffset="0" />
                  <defs>
                    <linearGradient id="paint0_linear_hero" x1="4" y1="6" x2="446" y2="6" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#465fff" />
                      <stop offset="0.5" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className={`mx-auto max-w-2xl text-base leading-relaxed md:text-lg lg:text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              A personal management platform that helps you organize tasks, finances, habits, and daily life more efficiently and productively.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col items-center justify-center gap-5 sm:flex-row transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 via-blue-500 to-purple-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(70,95,255,0.5)] focus:outline-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
            <Link
              to="/login"
              className={`inline-flex items-center justify-center rounded-xl border-2 px-7 py-3.5 text-sm font-bold backdrop-blur-md transition-all duration-300 hover:shadow-lg ${isDark
                ? "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
                : "border-gray-200 bg-white/80 text-gray-700 hover:border-brand-500 hover:bg-white"
                }`}
            >
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Modules List */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-14">
        <SectionWithAnimation>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className={`mb-2.5 text-2xl font-bold md:text-3xl ${isDark ? "text-white" : "text-gray-900"
                }`}>
                Our <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">Modules</span>
              </h2>
              <p className={`mx-auto max-w-2xl text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                Explore all the powerful features designed to help you manage your life better
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link
                    to={module.path}
                    className={`group relative block h-full overflow-hidden rounded-xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${module.cardBg} ${module.cardBorder} ${module.cardHover}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`relative shrink-0 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${module.iconBg} shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${module.iconColor}`}>
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`relative mb-2 text-lg font-bold ${isDark ? "text-white" : "text-gray-900"
                          }`}>{module.title}</h3>
                        <p className={`relative text-xs leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"
                          }`}>{module.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Section 3: Author Card */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-14">
        <SectionWithAnimation>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className={`mb-2 text-2xl font-bold md:text-3xl ${isDark ? "text-white" : "text-gray-900"}`}>
                About <span className="text-brand-500">Creator</span>
              </h2>
              <div className={`mx-auto h-1 w-12 rounded-full bg-brand-500/20`}>
                <div className="h-full w-1/2 rounded-full bg-brand-500"></div>
              </div>
            </div>

            <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isDark
              ? "border-white/10 bg-white/5"
              : "border-gray-200 bg-white shadow-sm hover:shadow-md"
              }`}>
              <div className="flex flex-col items-center p-6 md:flex-row md:items-start md:p-10 md:gap-10">
                {/* Profile Picture */}
                <div className="relative mb-6 shrink-0 md:mb-0">
                  <div className={`absolute -inset-2 rounded-full opacity-20 blur-sm bg-brand-500`}></div>
                  <div className={`relative h-32 w-32 overflow-hidden rounded-full border-2 md:h-40 md:w-40 ${isDark ? "border-white/20" : "border-white shadow-sm"
                    }`}>
                    <img
                      src="/images/user/user-01.jpg"
                      alt="Author"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Ihsan+Ahmad+Fakhriansyah&background=465fff&color=fff&size=160";
                      }}
                    />
                  </div>
                  {/* Status dot */}
                  <div className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white p-1 shadow-sm dark:bg-slate-900">
                    <div className="h-full w-full rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className={`mb-1 text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Ihsan Ahmad Fakhriansyah</h3>
                  <p className={`mb-4 text-sm font-medium text-brand-500`}>Full Stack Web Development Student</p>
                  <p className={`mb-6 text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"
                    }`}>
                    A passionate full-stack web development student with strong interests in frontend and backend development, focused on building user-centered web applications and innovative solutions.
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 md:justify-start">
                    <a
                      href="https://github.com/ihsanafr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:scale-110 ${isDark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-500 shadow-sm"}`}
                      title="GitHub"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ihsan-ahmad-fakhriansyah-44b47924b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:scale-110 ${isDark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-500 shadow-sm"}`}
                      title="LinkedIn"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <a
                      href="https://ihsanafr.my.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:scale-110 ${isDark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-500 shadow-sm"}`}
                      title="Website"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Section 4: Feedback Form */}
      <section className="relative z-10 container mx-auto px-4 py-10 md:py-14">
        <SectionWithAnimation>
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className={`mb-2 text-2xl font-bold md:text-3xl ${isDark ? "text-white" : "text-gray-900"}`}>
                Feedback & <span className="text-brand-500">Suggestions</span>
              </h2>
              <p className={`mx-auto max-w-2xl text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Your feedback helps us grow. Please share your thoughts below.
              </p>
            </div>

            <div className={`overflow-hidden rounded-2xl border ${isDark
              ? "border-white/10 bg-white/5"
              : "border-gray-200 bg-white shadow-sm"
              }`}>
              <div className="p-8 md:p-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
                <h3 className={`mb-4 text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  We Value Your Feedback
                </h3>
                <p className={`mx-auto mb-8 max-w-lg text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  To provide a more personalized experience and help us track your suggestions effectively, feedback submission is now available exclusively through your personal dashboard.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 hover:scale-105"
                  >
                    Login to Give Feedback
                  </Link>
                  <Link
                    to="/register"
                    className={`inline-flex items-center justify-center rounded-xl border-2 px-8 py-3.5 text-sm font-bold transition-all ${isDark
                      ? "border-white/10 text-white hover:bg-white/5"
                      : "border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-500"
                      }`}
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white/80"
        } backdrop-blur-sm`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Outer box with blue-purple gradient */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 blur-sm"></div>
                {/* Inner box with logo - blue-purple gradient */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow-lg">
                  <img src="/logo.svg" alt="26-step" className="h-6 w-6" />
                </div>
              </div>
              <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                © 2026 26-step. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className={`text-sm transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-sm transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
