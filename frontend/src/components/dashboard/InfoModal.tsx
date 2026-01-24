import React, { useState, useEffect } from "react";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "about" | "privacy" | "terms";
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const closeTimeoutRef = React.useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setIsVisible(false);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
            if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = window.setTimeout(() => {
                setIsMounted(false);
            }, 200);
        }
    }, [isOpen]);

    const requestClose = () => {
        setIsVisible(false);
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = window.setTimeout(() => {
            onClose();
            setIsMounted(false);
        }, 200);
    };

    if (!isOpen && !isMounted) return null;

    const content = {
        about: {
            title: "About 26-step",
            subtitle: "General Information",
            description: "26-step is a comprehensive personal management system designed to help you streamline your daily life. Our mission is to provide intuitive tools for productivity, finance tracking, habit building, and mental clarity.",
            details: [
                "Tasks & Targets: Manage daily tasks and achieve your long-term goals.",
                "Personal Finance: Keep a clear view of your income, expenses, and budget.",
                "Productivity & Time: Track your time and maintain focus with Pomodoro tools.",
                "Habits & Streaks: Build lasting routines and maintain consistency.",
                "Storage: A secure place for your notes, links, and documents.",
                "Journal & Notes: Reflect on your day and keep your thoughts organized."
            ]
        },
        privacy: {
            title: "Privacy Policy",
            subtitle: "Privacy & Security",
            description: "Your privacy is our top priority. We believe in transparency and data ownership. We ensure your information remains yours and is protected.",
            details: [
                "Data Collection: We only collect information necessary to provide our services, such as your email for account management.",
                "Data Security: Your data is encrypted and stored securely using industry-standard protocols.",
                "No Third-Party Sharing: We never sell your personal information to third parties.",
                "Account Deletion: You have the right to delete your account and all associated data at any time."
            ]
        },
        terms: {
            title: "Terms of Service",
            subtitle: "Legal Agreement",
            description: "By using 26-step, you agree to these terms. Please read them carefully to understand your rights and responsibilities.",
            details: [
                "Responsible Use: You agree to use the platform for lawful purposes and not to interfere with its operation.",
                "Account Responsibility: You are responsible for maintaining the security of your account credentials.",
                "Service Availability: While we strive for 24/7 uptime, we do not guarantee uninterrupted service.",
                "Content Ownership: You retain full ownership of the data you input into our system."
            ]
        },
    };

    const currentContent = content[type as keyof typeof content] || content.about;

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
                className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {currentContent.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {currentContent.subtitle}
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

                <div className="space-y-6">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {currentContent.description}
                    </p>

                    <div className={`rounded-xl p-4 border transition-all ${type === 'about' ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800/50 dark:bg-blue-500/10' :
                        type === 'privacy' ? 'border-purple-200 bg-purple-50/50 dark:border-purple-800/50 dark:bg-purple-500/10' :
                            'border-indigo-200 bg-indigo-50/50 dark:border-indigo-800/50 dark:bg-indigo-500/10'
                        }`}>
                        <ul className="space-y-4">
                            {currentContent.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${type === 'about' ? 'bg-blue-500' :
                                        type === 'privacy' ? 'bg-purple-500' :
                                            'bg-indigo-500'
                                        }`}></div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {detail}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={requestClose}
                        className={`rounded-xl px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 ${type === 'about' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' :
                            type === 'privacy' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' :
                                'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                            }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
