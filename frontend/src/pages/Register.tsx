import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import PageMeta from "../components/common/PageMeta";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";
import { useTheme } from "../context/ThemeContext";
import { validateEmail, validatePassword, validateName } from "../utils/validation";

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
  const [mounted, setMounted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false, password: false, password_confirmation: false });
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; requirements: any } | null>(null);
  const { register, isAuthenticated } = useAuth();
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
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, name: value });
    setError("");

    if (touched.name) {
      const validation = validateName(value);
      setNameError(validation.valid ? null : validation.message || null);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, email: value });
    setError("");

    if (touched.email) {
      const validation = validateEmail(value);
      setEmailError(validation.valid ? null : validation.message || null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, password: value });
    setError("");

    const validation = validatePassword(value);
    setPasswordStrength(validation);

    if (touched.password) {
      setPasswordError(validation.valid ? null : validation.message || null);
    }

    // Re-validate confirm password if it's already been touched
    if (touched.password_confirmation && form.password_confirmation) {
      if (value !== form.password_confirmation) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, password_confirmation: value });
    setError("");

    if (touched.password_confirmation) {
      if (value !== form.password) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTouched({ name: true, email: true, password: true, password_confirmation: true });

    // Validate all fields
    const nameValidation = validateName(form.name);
    const emailValidation = validateEmail(form.email);
    const passwordValidation = validatePassword(form.password);

    let hasError = false;

    if (!nameValidation.valid) {
      setNameError(nameValidation.message || null);
      hasError = true;
    }

    if (!emailValidation.valid) {
      setEmailError(emailValidation.message || null);
      hasError = true;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || null);
      hasError = true;
    }

    if (form.password !== form.password_confirmation) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const response = await register(form);
      // Store email for verification page
      if (response && response.user) {
        localStorage.setItem("pending_verification_email", response.user.email);
        navigate(`/verify-email?email=${encodeURIComponent(response.user.email)}`);
      } else {
        navigate("/verify-email");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      if (typeof errorMessage === "object" && errorMessage.email) {
        setError(Array.isArray(errorMessage.email) ? errorMessage.email[0] : errorMessage.email);
        setEmailError(Array.isArray(errorMessage.email) ? errorMessage.email[0] : errorMessage.email);
      } else if (typeof errorMessage === "string") {
        setError(errorMessage);
      } else {
        setError("Registration failed. Please check your input data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Register - 26-step"
        description="Create a new 26-step account"
      />
      <div className={`relative min-h-screen transition-colors duration-300 ${isDark
        ? "bg-gray-900"
        : "bg-gray-50"
        }`}>
        <div className="relative flex min-h-screen flex-col justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Side - Form */}
              <div className="flex flex-col justify-center">
                <div className={`w-full max-w-md mx-auto transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}>
                  <Link
                    to="/"
                    className={`inline-flex items-center mb-8 text-sm transition-colors ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"
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
                    Back to homepage
                  </Link>

                  <div className={`rounded-2xl border p-8 ${isDark
                    ? "border-gray-800 bg-gray-800/50"
                    : "border-gray-200 bg-white"
                    }`}>
                    <div className="mb-8 text-center">
                      <div className="mb-6 flex justify-center">
                        <div className="relative">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"
                            }`}>
                            <img src="/logo.svg" alt="26-step" className="h-10 w-10" />
                          </div>
                        </div>
                      </div>
                      <h1 className={`mb-2 text-3xl font-semibold ${isDark ? "text-white" : "text-gray-900"
                        }`}>
                        26-step
                      </h1>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}>
                        Create your new account
                      </p>
                    </div>

                    <form onSubmit={handleRegister}>
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-2">
                            Full Name <span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            placeholder="Your name"
                            value={form.name}
                            onChange={handleNameChange}
                            onBlur={() => {
                              setTouched({ ...touched, name: true });
                              const validation = validateName(form.name);
                              setNameError(validation.valid ? null : validation.message || null);
                            }}
                            className={`${isDark
                              ? "bg-gray-800 border-gray-700 focus:border-gray-600"
                              : "bg-white border-gray-300 focus:border-gray-400"
                              } ${nameError && touched.name
                                ? isDark
                                  ? "border-red-500 focus:border-red-400"
                                  : "border-red-500 focus:border-red-400"
                                : ""
                              }`}
                            required
                          />
                          {nameError && touched.name && (
                            <p className={`mt-1.5 text-xs ${isDark ? "text-red-400" : "text-red-600"
                              }`}>
                              {nameError}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="mb-2">
                            Email <span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="email"
                            placeholder="nama@email.com"
                            value={form.email}
                            onChange={handleEmailChange}
                            onBlur={() => {
                              setTouched({ ...touched, email: true });
                              const validation = validateEmail(form.email);
                              setEmailError(validation.valid ? null : validation.message || null);
                            }}
                            className={`${isDark
                              ? "bg-gray-800 border-gray-700 focus:border-gray-600"
                              : "bg-white border-gray-300 focus:border-gray-400"
                              } ${emailError && touched.email
                                ? isDark
                                  ? "border-red-500 focus:border-red-400"
                                  : "border-red-500 focus:border-red-400"
                                : ""
                              }`}
                            required
                          />
                          {emailError && touched.email && (
                            <p className={`mt-1.5 text-xs ${isDark ? "text-red-400" : "text-red-600"
                              }`}>
                              {emailError}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="mb-2">
                            Password <span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Minimum 8 characters"
                              value={form.password}
                              onChange={handlePasswordChange}
                              onBlur={() => {
                                setTouched({ ...touched, password: true });
                                const validation = validatePassword(form.password);
                                setPasswordError(validation.valid ? null : validation.message || null);
                              }}
                              className={`${isDark
                                ? "bg-gray-800 border-gray-700 focus:border-gray-600"
                                : "bg-white border-gray-300 focus:border-gray-400"
                                } ${passwordError && touched.password
                                  ? isDark
                                    ? "border-red-500 focus:border-red-400"
                                    : "border-red-500 focus:border-red-400"
                                  : ""
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
                              className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 transition-colors z-10 ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
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
                          {passwordError && touched.password && (
                            <p className={`mt-1.5 text-xs ${isDark ? "text-red-400" : "text-red-600"
                              }`}>
                              {passwordError}
                            </p>
                          )}
                          {passwordStrength && form.password && (
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                                  <div
                                    className={`h-full transition-all duration-300 ${passwordStrength.strength === 'weak'
                                      ? 'bg-red-500 w-1/3'
                                      : passwordStrength.strength === 'medium'
                                        ? 'bg-yellow-500 w-2/3'
                                        : 'bg-green-500 w-full'
                                      }`}
                                  />
                                </div>
                                <span className={`text-xs font-medium ${passwordStrength.strength === 'weak'
                                  ? isDark ? 'text-red-400' : 'text-red-600'
                                  : passwordStrength.strength === 'medium'
                                    ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                                    : isDark ? 'text-green-400' : 'text-green-600'
                                  }`}>
                                  {passwordStrength.strength === 'weak' ? 'Weak' : passwordStrength.strength === 'medium' ? 'Medium' : 'Strong'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className={`flex items-center gap-1.5 ${passwordStrength.requirements.minLength
                                  ? isDark ? 'text-green-400' : 'text-green-600'
                                  : isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                  <span>{passwordStrength.requirements.minLength ? '✓' : '○'}</span>
                                  <span>8+ characters</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength.requirements.hasUpperCase
                                  ? isDark ? 'text-green-400' : 'text-green-600'
                                  : isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                  <span>{passwordStrength.requirements.hasUpperCase ? '✓' : '○'}</span>
                                  <span>Uppercase</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength.requirements.hasLowerCase
                                  ? isDark ? 'text-green-400' : 'text-green-600'
                                  : isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                  <span>{passwordStrength.requirements.hasLowerCase ? '✓' : '○'}</span>
                                  <span>Lowercase</span>
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength.requirements.hasNumber
                                  ? isDark ? 'text-green-400' : 'text-green-600'
                                  : isDark ? 'text-gray-500' : 'text-gray-400'
                                  }`}>
                                  <span>{passwordStrength.requirements.hasNumber ? '✓' : '○'}</span>
                                  <span>Number</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label className="mb-2">
                            Konfirmasi Password <span className="text-error-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Ulangi password"
                              value={form.password_confirmation}
                              onChange={handleConfirmPasswordChange}
                              onBlur={() => {
                                setTouched({ ...touched, password_confirmation: true });
                                if (form.password_confirmation !== form.password) {
                                  setConfirmPasswordError("Passwords do not match");
                                } else {
                                  setConfirmPasswordError(null);
                                }
                              }}
                              className={`${isDark
                                ? "bg-gray-800 border-gray-700 focus:border-gray-600"
                                : "bg-white border-gray-300 focus:border-gray-400"
                                } ${confirmPasswordError && touched.password_confirmation
                                  ? isDark
                                    ? "border-red-500 focus:border-red-400"
                                    : "border-red-500 focus:border-red-400"
                                  : ""
                                }`}
                              required
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirmPassword(!showConfirmPassword);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                              }}
                              className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 transition-colors z-10 ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                                }`}
                              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                              <span className="flex items-center justify-center">
                                {showConfirmPassword ? (
                                  <EyeOpenIcon className="h-5 w-5 shrink-0" />
                                ) : (
                                  <EyeOffIcon className="h-5 w-5 shrink-0" />
                                )}
                              </span>
                            </button>
                          </div>
                          {confirmPasswordError && touched.password_confirmation && (
                            <p className={`mt-1.5 text-xs ${isDark ? "text-red-400" : "text-red-600"
                              }`}>
                              {confirmPasswordError}
                            </p>
                          )}
                        </div>
                        {error && (
                          <div className={`rounded-lg border p-4 ${isDark
                            ? "border-red-900/50 bg-red-900/20"
                            : "border-red-200 bg-red-50"
                            }`}>
                            <p className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"
                              }`}>{error}</p>
                          </div>
                        )}
                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={loading || emailError !== null || nameError !== null || passwordError !== null || confirmPasswordError !== null}
                            className={`group relative w-full overflow-hidden rounded-xl px-5 py-4 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${loading || emailError !== null || nameError !== null || passwordError !== null || confirmPasswordError !== null
                              ? "bg-gray-400"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              }`}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {loading ? (
                                <>
                                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Memproses...
                                </>
                              ) : (
                                "Daftar"
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>

                    <div className="mt-6 text-center">
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"
                        }`}>
                        Sudah punya akun?{" "}
                        <Link
                          to="/login"
                          className={`font-medium transition-colors ${isDark
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-900 hover:text-gray-700"
                            }`}
                        >
                          Login here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className={`hidden items-center justify-center rounded-2xl border lg:flex ${isDark
                ? "border-gray-800 bg-gray-800/50"
                : "border-gray-200 bg-white"
                }`}>
                <div className={`relative flex items-center justify-center p-12 w-full h-full min-h-[600px] transition-all duration-700 ease-out delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}>
                  <div className="flex flex-col items-center max-w-sm text-center">
                    <div className="mb-8">
                      <div className={`flex h-24 w-24 items-center justify-center rounded-xl ${isDark ? "bg-gray-700" : "bg-gray-100"
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
                    <h2 className={`mb-4 text-3xl font-semibold ${isDark ? "text-white" : "text-gray-900"
                      }`}>
                      Join Us Today!
                    </h2>
                    <p className={`text-base leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                      Start managing your life more efficiently with 26-step
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
