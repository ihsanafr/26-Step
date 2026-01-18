import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import api from "../services/api";
import { PencilIcon } from "../icons";
import { UserIcon } from "../icons";

export default function Profile() {
  const { user, fetchUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (user.avatar) {
        // If avatar is a relative path, make it absolute
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}${user.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");
      setSuccess("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setAvatarPreview(user?.avatar || null);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      setError("Please select an image file first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");
      
      // Create FormData and append file
      const formData = new FormData();
      formData.append("avatar", selectedFile, selectedFile.name);

      // Log for debugging
      console.log("Uploading avatar:", {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        formDataKeys: Array.from(formData.keys()),
      });

      // Verify FormData has the file
      const avatarFile = formData.get("avatar");
      if (!avatarFile || !(avatarFile instanceof File)) {
        setError("Failed to prepare file for upload");
        setUploading(false);
        return;
      }

      console.log("FormData verified, file:", {
        name: avatarFile.name,
        size: avatarFile.size,
        type: avatarFile.type,
      });

      // Use fetch to avoid axios interceptor forcing JSON content-type
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      const token = localStorage.getItem("token");
      const uploadResponse = await fetch(`${baseUrl}/user/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const responseData = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        throw { response: { data: responseData, status: uploadResponse.status } };
      }

      console.log("Upload response:", responseData);

      // Update avatar preview with the new URL
      let newAvatarUrl = null;
      if (responseData.avatar_url) {
        newAvatarUrl = responseData.avatar_url;
      } else if (responseData.user?.avatar) {
        const avatar = responseData.user.avatar;
        newAvatarUrl = avatar.startsWith("http")
          ? avatar
          : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000"}${avatar}`;
      }
      if (newAvatarUrl) {
        setAvatarPreview(newAvatarUrl);
      }

      setSuccess("Profile picture updated successfully!");
      await fetchUser();
      setSelectedFile(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      
      let errorMessage = "Failed to upload profile picture. Please try again.";
      
      if (err.response?.data) {
        // Check for validation errors first
        if (err.response.data.errors && err.response.data.errors.avatar) {
          const avatarErrors = err.response.data.errors.avatar;
          errorMessage = Array.isArray(avatarErrors) ? avatarErrors[0] : avatarErrors;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.avatar && Array.isArray(err.response.data.avatar)) {
          errorMessage = err.response.data.avatar[0];
        } else if (typeof err.response.data.avatar === 'string') {
          errorMessage = err.response.data.avatar;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData: any = {
        name: formData.name,
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match");
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setError("Password must be at least 8 characters");
          setLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          setError("Current password is required to change password");
          setLoading(false);
          return;
        }
        updateData.current_password = formData.currentPassword;
        updateData.password = formData.newPassword;
        updateData.password_confirmation = formData.confirmPassword;
      }

      await api.put("/user/profile", updateData);
      setSuccess("Profile updated successfully!");
      await fetchUser();
      
      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Profile - 26-step" description="Manage your profile settings" />
      
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <UserIcon className="w-8 h-8 fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-500/20">
              <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Profile Picture
            </h2>
          </div>
          
          <div className="flex flex-col items-center gap-8 sm:flex-row">
            <div className="relative group">
              <div className="relative w-40 h-40 overflow-hidden rounded-2xl border-4 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 group-hover:border-brand-400 dark:group-hover:border-brand-500">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default if image fails to load
                      console.error('Failed to load avatar image:', avatarPreview);
                      setAvatarPreview(null);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-white text-5xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 bg-brand-500 text-white rounded-full shadow-xl hover:bg-brand-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-500/30"
                aria-label="Change profile picture"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Upload New Picture
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upload a new profile picture. Supported formats: JPG, PNG, or GIF. Maximum file size: 5MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-500/20">
                        <svg className="w-5 h-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleUploadAvatar}
                      disabled={uploading}
                      className="w-full sm:w-auto"
                    >
                      {uploading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        "Upload Picture"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="md:col-span-2">
                <Label>
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900 cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-theme-sm dark:border-gray-800 dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Change Password
              </h2>
            </div>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              Leave password fields blank if you don't want to change your password
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowCurrentPassword(!showCurrentPassword);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors z-10"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    <span className="flex items-center justify-center">
                      {showCurrentPassword ? (
                        <EyeOpenIcon className="h-5 w-5 shrink-0" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5 shrink-0" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password (min. 8 characters)"
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowNewPassword(!showNewPassword);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors z-10"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    <span className="flex items-center justify-center">
                      {showNewPassword ? (
                        <EyeOpenIcon className="h-5 w-5 shrink-0" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5 shrink-0" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="pr-12"
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors z-10"
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
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="rounded-xl border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-500/10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-error-600 dark:text-error-400">
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-800 dark:bg-success-500/10 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-success-600 dark:text-success-400">
                  {success}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none sm:min-w-[200px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="flex-1 sm:flex-none sm:min-w-[200px]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
