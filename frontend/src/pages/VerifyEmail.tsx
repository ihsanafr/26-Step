import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import PageMeta from "../components/common/PageMeta";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    // Get email from URL params or localStorage
    const emailParam = searchParams.get("email");
    const storedEmail = localStorage.getItem("pending_verification_email");
    setEmail(emailParam || storedEmail || "");
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");
    
    if (token && emailParam) {
      handleVerifyWithToken(token, emailParam);
    }
  }, [searchParams]);

  const handleVerifyWithToken = async (token: string, emailParam: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use POST instead of GET to avoid JSON response page
      const response = await api.post("/verify-email", {
        token,
        email: emailParam,
      });

      if (response.data.email_verified) {
        setSuccess("Email verified successfully! Redirecting to login...");
        localStorage.removeItem("pending_verification_email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Email address is required");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/verify-email", {
        code,
        email,
      });

      if (response.data.email_verified) {
        setSuccess("Email verified successfully! Redirecting to login...");
        localStorage.removeItem("pending_verification_email");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/resend-verification-email", { email });
      setSuccess("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Verify Email - 26-step"
        description="Verify your email address to complete registration"
      />
      <div className={`relative min-h-screen transition-colors duration-300 ${
        isDark 
          ? "bg-gray-900" 
          : "bg-gray-50"
      }`}>
        <div className="relative flex min-h-screen flex-col justify-center p-4 sm:p-6 lg:p-8">
          <div className="relative z-10 mx-auto w-full max-w-md">
            <div className={`w-full transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className={`rounded-2xl border p-8 ${
                isDark 
                  ? "border-gray-800 bg-gray-800/50" 
                  : "border-gray-200 bg-white"
              }`}>
                <div className="mb-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${
                      isDark ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20" : "bg-gradient-to-br from-blue-100 to-purple-100"
                    }`}>
                      <div className={`absolute inset-0 rounded-full ${
                        isDark ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30" : "bg-gradient-to-br from-blue-200 to-purple-200"
                      } blur-xl`}></div>
                      <svg
                        className={`relative h-10 w-10 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h1 className={`mb-3 text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}>
                    Verify Your Email
                  </h1>
                  <p className={`text-base leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {email ? (
                      <>
                        We've sent a verification code to <span className="font-semibold text-brand-500">{email}</span>
                      </>
                    ) : (
                      "Enter the verification code sent to your email"
                    )}
                  </p>
                </div>

                <form onSubmit={handleVerify}>
                  <div className="space-y-5">
                    {email && (
                      <div>
                        <Label className="mb-2">Email Address</Label>
                        <Input
                          type="email"
                          value={email}
                          disabled
                          className={`${
                            isDark 
                              ? "bg-gray-800/50 border-gray-700 text-gray-400" 
                              : "bg-gray-50 border-gray-300 text-gray-500"
                          }`}
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label className="mb-2">
                        Verification Code <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setCode(value);
                          setError("");
                        }}
                        maxLength={6}
                        className={`text-center text-2xl tracking-widest font-mono ${
                          isDark 
                            ? "bg-gray-800 border-gray-700 focus:border-gray-600" 
                            : "bg-white border-gray-300 focus:border-gray-400"
                        }`}
                        required
                      />
                      <p className={`mt-1.5 text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Enter the 6-digit code from your email
                      </p>
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

                    {success && (
                      <div className={`rounded-lg border p-4 ${
                        isDark 
                          ? "border-green-900/50 bg-green-900/20" 
                          : "border-green-200 bg-green-50"
                      }`}>
                        <p className={`text-sm font-medium ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}>{success}</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full"
                        variant="primary"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="mr-2 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          "Verify Email"
                        )}
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className={`text-center text-sm mb-4 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Didn't receive the code?
                      </p>
                      <Button
                        type="button"
                        onClick={handleResend}
                        disabled={resending || !email}
                        className="w-full"
                        variant="outline"
                      >
                        {resending ? "Sending..." : "Resend Verification Email"}
                      </Button>
                    </div>
                  </div>
                </form>
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
