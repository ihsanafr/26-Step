import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PageMeta from "../components/common/PageMeta";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const EyeOpenIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
    </svg>
  );

  const EyeOffIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3l18 18M10.73 10.73A2.999 2.999 0 0012 15a3 3 0 002.27-5.27M9.88 5.09A9.955 9.955 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.964 9.964 0 01-3.332 4.543M6.228 6.228A9.957 9.957 0 002.458 12c1.274 4.057 5.064 7 9.542 7 1.51 0 2.95-.334 4.242-.934"
      />
    </svg>
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Login - 26-step"
        description="Masuk ke akun 26-step Anda"
      />
      <div className={`relative min-h-screen transition-colors duration-300 ${
        isDark 
          ? "bg-gray-900" 
          : "bg-gray-50"
      }`}>
        <div className="relative flex min-h-screen flex-col justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Side - Form */}
              <div className="flex flex-col justify-center">
                <div className={`w-full max-w-md mx-auto transition-all duration-700 ease-out ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  <Link
                    to="/"
                    className={`inline-flex items-center mb-8 text-sm transition-colors ${
                      isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M12.5 15L7.5 10L12.5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Kembali ke beranda
                  </Link>

                  <div className={`rounded-2xl border p-8 ${
                    isDark 
                      ? "border-gray-800 bg-gray-800/50" 
                      : "border-gray-200 bg-white"
                  }`}>
                    <div className="mb-8 text-center">
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${
                            isDark ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            <img src="/logo.svg" alt="26-step" className="h-10 w-10" />
                          </div>
                        </div>
                      </div>
                      <h1 className={`mb-2 text-3xl font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        26-step
                      </h1>
                      <p className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Masuk ke akun Anda
                      </p>
                    </div>

                    <form onSubmit={handleLogin}>
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-2">
                            Email <span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="email"
                            placeholder="nama@email.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`${
                              isDark 
                                ? "bg-gray-800 border-gray-700 focus:border-gray-600" 
                                : "bg-white border-gray-300 focus:border-gray-400"
                            }`}
                            required
                          />
                        </div>
                        <div>
                          <Label className="mb-2">
                            Password <span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={form.password}
                              onChange={(e) => setForm({ ...form, password: e.target.value })}
                              className={`${
                                isDark 
                                  ? "bg-gray-800 border-gray-700 focus:border-gray-600" 
                                  : "bg-white border-gray-300 focus:border-gray-400"
                              }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowPassword(!showPassword);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 transition-colors z-10 ${
                                isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                              }`}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              <span className="flex items-center justify-center">
                                {showPassword ? (
                                  <EyeOpenIcon className="h-5 w-5 shrink-0" />
                                ) : (
                                  <EyeOffIcon className="h-5 w-5 shrink-0" />
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                        {error && (
                          <div className={`rounded-lg border p-4 ${
                            isDark 
                              ? "border-red-900/50 bg-red-900/20" 
                              : "border-red-200 bg-red-50"
                          }`}>
                            <p className={`text-sm font-medium ${
                              isDark ? "text-red-400" : "text-red-600"
                            }`}>{error}</p>
                          </div>
                        )}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full rounded-lg px-5 py-3.5 text-sm font-medium transition-colors ${
                              isDark 
                                ? "bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500" 
                                : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:text-gray-300"
                            } ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                          >
                            {loading ? (
                              <span className="flex items-center justify-center">
                                <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                              </span>
                            ) : (
                              "Login"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="mt-6 text-center">
                      <p className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Belum punya akun?{" "}
                        <Link
                          to="/register"
                          className={`font-medium transition-colors ${
                            isDark 
                              ? "text-gray-300 hover:text-white" 
                              : "text-gray-900 hover:text-gray-700"
                          }`}
                        >
                          Daftar sekarang
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className={`hidden items-center justify-center rounded-2xl border lg:flex ${
                isDark 
                  ? "border-gray-800 bg-gray-800/50" 
                  : "border-gray-200 bg-white"
              }`}>
                <div className={`relative flex items-center justify-center p-12 w-full h-full min-h-[600px] transition-all duration-700 ease-out delay-200 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  <div className="flex flex-col items-center max-w-sm text-center">
                    <div className="mb-8">
                      <div className={`flex h-24 w-24 items-center justify-center rounded-xl ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}>
                        <img
                          src="/logo.svg"
                          alt="Logo"
                          className="h-14 w-14"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/logo.svg";
                          }}
                        />
                      </div>
                    </div>
                    <h2 className={`mb-4 text-3xl font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      Welcome Back!
                    </h2>
                    <p className={`text-base leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Manage your daily life more efficiently with 26-step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    </>
  );
}
