import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { EyeIcon, EyeCloseIcon } from "../icons";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PageMeta from "../components/common/PageMeta";
import GridShape from "../components/common/GridShape";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Registrasi gagal";
      if (typeof errorMessage === "object" && errorMessage.email) {
        setError(Array.isArray(errorMessage.email) ? errorMessage.email[0] : errorMessage.email);
      } else if (typeof errorMessage === "string") {
        setError(errorMessage);
      } else {
        setError("Registrasi gagal. Periksa data yang Anda masukkan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Register - 26-step"
        description="Buat akun baru 26-step"
      />
      <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="w-full max-w-md pt-10 mx-auto">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
              <div>
                <div className="mb-5 sm:mb-8">
                  <div className="mb-4 flex justify-center">
                    <img src="/logo.svg" alt="26-step" className="h-16 w-16" />
                  </div>
                  <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                    <span className="bg-gradient-to-r from-brand-500 to-blue-500 bg-clip-text text-transparent">
                      26-step
                    </span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">Buat akun baru Anda</p>
                </div>
                <form onSubmit={handleRegister}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Nama Lengkap <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Nama Anda"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 8 karakter"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          required
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>
                        Konfirmasi Password <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Ulangi password"
                          value={form.password_confirmation}
                          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                          required
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    {error && (
                      <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10">
                        <p className="text-sm font-medium text-error-600 dark:text-error-400">{error}</p>
                      </div>
                    )}
                    <div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                          </span>
                        ) : (
                          "Daftar"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-brand-600 transition-colors duration-200 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Masuk di sini
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
            <div className="relative flex items-center justify-center z-1">
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link to="/" className="block mb-4">
                  <img
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.svg";
                    }}
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Manage your daily life more efficiently
                </p>
              </div>
            </div>
          </div>
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    </>
  );
}

