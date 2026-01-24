import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { feedbackService } from "../../services/feedbackService";
import Label from "../form/Label";
import Input from "../form/input/InputField";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [success, setSuccess] = useState(false);
    const closeTimeoutRef = React.useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setIsVisible(false);
            requestAnimationFrame(() => setIsVisible(true));
            setFeedbackForm({
                name: user?.name || "",
                email: user?.email || "",
                subject: "",
                message: "",
            });
            setError(null);
            setValidationErrors({});
            setSuccess(false);
        } else {
            setIsVisible(false);
            if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = window.setTimeout(() => {
                setIsMounted(false);
            }, 200);
        }
    }, [user, isOpen]);

    const requestClose = () => {
        setIsVisible(false);
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = window.setTimeout(() => {
            onClose();
            setIsMounted(false);
        }, 200);
    };

    if (!isOpen && !isMounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackForm.name || !feedbackForm.email) {
            setError("Session data missing. Please try refreshing the page.");
            return;
        }

        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            await feedbackService.submit(feedbackForm);
            setSuccess(true);
            setFeedbackForm(prev => ({ ...prev, subject: "", message: "" }));
            setTimeout(() => {
                setSuccess(false);
                requestClose();
            }, 3000);
        } catch (err: any) {
            const data = err.response?.data;
            setError(data?.message || err.message || "Failed to send feedback.");
            if (data?.errors) {
                setValidationErrors(data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            onClick={requestClose}
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
            }}
        >
            <div
                className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Give Feedback</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Submitting as <span className="font-semibold text-blue-600 dark:text-blue-400">{feedbackForm.name || user?.name || "User"}</span>
                        </p>
                    </div>
                    <button
                        onClick={requestClose}
                        className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</Label>
                        <Input
                            type="text"
                            placeholder="What's this about?"
                            value={feedbackForm.subject}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                            required
                            className="w-full"
                            error={!!validationErrors.subject}
                            hint={validationErrors.subject?.[0]}
                        />
                    </div>

                    <div>
                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Message</Label>
                        <textarea
                            rows={5}
                            placeholder="Share your ideas, report bugs, or just say hi!"
                            value={feedbackForm.message}
                            onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                            required
                            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${validationErrors.message
                                ? "border-red-500 bg-red-50/10"
                                : "border-gray-200 bg-white text-gray-900 focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                                }`}
                        />
                        {validationErrors.message && (
                            <p className="mt-1.5 text-xs text-red-500">{validationErrors.message[0]}</p>
                        )}
                    </div>

                    {error && !Object.keys(validationErrors).length && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/20">
                            <p className="text-center text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900/30 dark:bg-green-900/20">
                            <p className="text-center text-xs font-medium text-green-600 dark:text-green-400">Thank you! Your feedback has been sent.</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={requestClose}
                            className="flex-1 rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="flex-[2] rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : "Send Feedback"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
