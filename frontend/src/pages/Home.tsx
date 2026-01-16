import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";
import { feedbackService } from "../services/feedbackService";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

// Component wrapper for scroll animation
const SectionWithAnimation = ({ children }: { children: React.ReactNode }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
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
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackError("");
    setFeedbackSuccess(false);

    try {
      await feedbackService.submit(feedbackForm);
      setFeedbackSuccess(true);
      setFeedbackForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => {
        setFeedbackSuccess(false);
      }, 5000);
    } catch (err: any) {
      setFeedbackError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengirim saran. Silakan coba lagi."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900" 
        : "bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50"
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl animate-pulse ${
          isDark ? "bg-blue-500/15" : "bg-blue-400/10"
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl animate-pulse ${
          isDark ? "bg-purple-500/15" : "bg-purple-400/10"
        }`} style={{ animationDelay: "1s" }}></div>
        <div className={`absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          isDark ? "bg-indigo-500/10" : "bg-indigo-400/8"
        }`}></div>
        <div className={`absolute top-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl ${
          isDark ? "bg-purple-600/10" : "bg-purple-300/8"
        }`} style={{ animationDelay: "2s" }}></div>
        <div className={`absolute bottom-1/4 left-1/4 h-72 w-72 rounded-full blur-3xl ${
          isDark ? "bg-blue-600/10" : "bg-blue-300/8"
        }`} style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className={`absolute inset-0 ${
        isDark 
          ? "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"
          : "bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]"
      } bg-[size:24px_24px]`}></div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Outer box with blue-purple gradient */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-500/30 blur-sm"></div>
              {/* Inner box with logo - blue-purple gradient */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow-lg">
                <img src="/logo.svg" alt="26-step" className="h-8 w-8" />
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>26-step</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isDark 
                  ? "text-gray-300 hover:bg-white/10 hover:text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-brand-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-brand-600 hover:to-blue-600 hover:shadow-xl"
            >
              Register
            </Link>
            <div className="ml-2">
              <ThemeTogglerTwo />
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-12 md:py-20 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className={`mb-12 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className={`mb-6 inline-block rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm ${
              isDark ? "bg-white/10 text-white" : "bg-gray-900/10 text-gray-700"
            }`}>
              ✨ All-in-One Life Management Platform
            </div>
            <h1 className={`mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Manage Your Life
              </span>
              <br />
              <span className={isDark ? "text-white" : "text-gray-900"}>Better</span>
            </h1>
            <p className={`mx-auto max-w-2xl text-lg leading-relaxed md:text-xl lg:text-2xl ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              A personal management platform that helps you organize tasks, finances, habits, and daily life more efficiently and productively.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 via-blue-500 to-purple-500 px-8 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(70,95,255,0.5)] focus:outline-none focus:ring-4 focus:ring-brand-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
            <Link
              to="/login"
              className={`inline-flex items-center justify-center rounded-xl border-2 px-8 py-4 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                isDark 
                  ? "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10" 
                  : "border-gray-300 bg-white/80 text-gray-700 hover:border-brand-500 hover:bg-white"
              }`}
            >
              Already Have Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Modules List */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <SectionWithAnimation>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className={`mb-4 text-4xl font-bold md:text-5xl ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Our <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">Modules</span>
              </h2>
              <p className={`mx-auto max-w-2xl text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Explore all the powerful features designed to help you manage your life better
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => (
                <Link
                  key={index}
                  to={module.path}
                  className={`group relative overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl ${module.cardBg} ${module.cardBorder} ${module.cardHover} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`relative shrink-0 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${module.iconBg} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${module.iconColor}`}>
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`relative mb-3 text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>{module.title}</h3>
                      <p className={`relative text-sm leading-relaxed ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>{module.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Section 3: Author Card */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <SectionWithAnimation>
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className={`mb-4 text-4xl font-bold md:text-5xl ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                About <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">Creator</span>
              </h2>
              <p className={`mx-auto max-w-2xl text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Meet the developer behind this platform
              </p>
            </div>

            <div className={`rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl md:p-12 ${
              isDark 
                ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10" 
                : "border-gray-200 bg-white/80 hover:border-brand-300 hover:bg-white hover:shadow-xl"
            }`}>
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
                {/* Text Content - Left */}
                <div className="flex-1 text-left">
                  <h3 className={`mb-2 text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>Developer Name</h3>
                  <p className={`mb-6 text-lg ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>Full Stack Developer</p>
                  <p className={`text-base leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Passionate about creating tools that help people manage their lives better. 
                    This platform is built with modern technologies to provide the best user experience.
                  </p>
                </div>
                
                {/* Profile Picture - Right */}
                <div className="shrink-0">
                  <div className={`h-48 w-48 overflow-hidden rounded-full border-4 md:h-56 md:w-56 ${
                    isDark ? "border-white/20" : "border-gray-200"
                  }`}>
                    <img
                      src="/images/user/user-01.jpg"
                      alt="Author"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Developer&background=465fff&color=fff&size=224";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Section 4: Feedback Form */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <SectionWithAnimation>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className={`mb-4 text-4xl font-bold md:text-5xl ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Saran & <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">Masukan</span>
              </h2>
              <p className={`mx-auto max-w-2xl text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Kami menghargai setiap saran dan masukan Anda untuk meningkatkan platform ini
              </p>
            </div>

            <div className={`rounded-2xl border p-8 backdrop-blur-sm md:p-12 ${
              isDark 
                ? "border-white/10 bg-white/5" 
                : "border-gray-200 bg-white/80 shadow-xl"
            }`}>
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label>
                    Nama <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Nama Anda"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>
                  Subjek <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Subjek saran atau masukan"
                  value={feedbackForm.subject}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>
                  Pesan <span className="text-error-500">*</span>
                </Label>
                <textarea
                  rows={6}
                  placeholder="Tuliskan saran dan masukan Anda di sini..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  required
                  className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-brand-500"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-brand-500"
                  }`}
                />
              </div>
              {feedbackError && (
                <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
                  <p className="text-sm font-medium text-error-600 dark:text-error-400">{feedbackError}</p>
                </div>
              )}
              {feedbackSuccess && (
                <div className="rounded-lg border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-500/10">
                  <p className="text-sm font-medium text-success-600 dark:text-success-400">
                    Terima kasih! Saran dan masukan Anda telah berhasil dikirim.
                  </p>
                </div>
              )}
              <div>
                <Button type="submit" className="w-full" disabled={feedbackLoading}>
                  {feedbackLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengirim...
                    </span>
                  ) : (
                    "Kirim Saran & Masukan"
                  )}
                </Button>
              </div>
              </form>
            </div>
          </div>
        </SectionWithAnimation>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white/80"
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
              <p className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                © 2024 26-step. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className={`text-sm transition-colors ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-sm transition-colors ${
                  isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
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
