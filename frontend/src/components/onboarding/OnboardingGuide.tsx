import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/button/Button";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector untuk elemen yang akan di-highlight
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Selamat Datang di 26-step! 🎉",
    description: "Kami akan memandu Anda melalui fitur-fitur utama aplikasi. Mari kita mulai!",
    position: "center",
  },
  {
    id: "modules",
    title: "Modul Aplikasi",
    description: "Aplikasi ini memiliki 6 modul utama yang membantu Anda mengelola kehidupan sehari-hari: Tasks & Targets, Personal Finance, Productivity & Time, Habits & Streaks, Storage, dan Journal & Notes. Klik pada kartu modul untuk menjelajahinya.",
    target: "[data-onboarding='modules']",
    position: "bottom",
  },
  {
    id: "calendar",
    title: "Activity Calendar",
    description: "Kalender ini menampilkan semua aktivitas Anda dari berbagai modul. Klik pada tanggal untuk melihat detail aktivitas pada hari tersebut. Indikator warna menunjukkan jenis aktivitas yang berbeda.",
    target: "[data-onboarding='calendar']",
    position: "top",
  },
  {
    id: "profile",
    title: "Profile & Settings",
    description: "Akses profil Anda melalui menu dropdown di header. Di sana Anda dapat mengubah nama, email, password, dan avatar. Juga tersedia pengaturan tema (dark/light mode).",
    target: "[data-onboarding='profile']",
    position: "bottom", // Changed to bottom to avoid cutoff on desktop
  },
  {
    id: "complete",
    title: "Selesai! 🎊",
    description: "Anda sudah mengenal dasar-dasar aplikasi. Mulai jelajahi modul-modul yang tersedia dan kelola kehidupan Anda dengan lebih efisien. Selamat menggunakan 26-step!",
    position: "center",
  },
];

interface OnboardingGuideProps {
  onComplete: () => void;
}

export default function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const currentStepData = onboardingSteps[currentStep];

  useEffect(() => {
    // Disable scroll when guide is visible
    if (isVisible) {
      // Save current scroll position
      const x = window.scrollX || window.pageXOffset;
      const y = window.scrollY || window.pageYOffset;
      setScrollPosition({ x, y });
      
      // Disable scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${y}px`;
      document.body.style.width = '100%';
    } else {
      // Re-enable scroll and restore position
      const savedY = scrollPosition.y;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedY);
    }

    return () => {
      // Cleanup: re-enable scroll when component unmounts
      const savedY = scrollPosition.y;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedY);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    // Delay untuk memastikan DOM sudah render
    setTimeout(() => {
      setIsVisible(true);
      // Update highlight after a short delay to ensure scroll is disabled
      setTimeout(() => {
        updateHighlight();
      }, 100);
    }, 300);
  }, []);

  useEffect(() => {
    // Update highlight when step changes
    if (isVisible) {
      // Small delay to ensure DOM is ready and scroll is disabled
      setTimeout(() => {
        updateHighlight();
      }, 200);
    }
  }, [currentStep, isVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        updateHighlight();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep, isVisible]);

  const updateHighlight = () => {
    const stepData = onboardingSteps[currentStep];
    if (!stepData.target) {
      setHighlightPosition(null);
      return;
    }

    // Wait a bit for DOM to be ready
    setTimeout(() => {
      const element = document.querySelector(stepData.target!);
      if (element) {
        // Scroll element into view first (before disabling scroll, we need to scroll)
        // But since scroll is disabled, we need to calculate and adjust
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Calculate if element is out of viewport
        const isOutOfView = rect.top < 0 || rect.bottom > viewportHeight || 
                           rect.left < 0 || rect.right > viewportWidth;
        
        if (isOutOfView) {
          // Calculate center position
          const centerY = rect.top + rect.height / 2 - viewportHeight / 2;
          const centerX = rect.left + rect.width / 2 - viewportWidth / 2;
          
          // Adjust body position to center the element
          const currentTop = parseInt(document.body.style.top || '0') || 0;
          const newTop = currentTop - centerY;
          document.body.style.top = `${newTop}px`;
          
          // Recalculate position after adjustment
          setTimeout(() => {
            const newRect = element.getBoundingClientRect();
            setHighlightPosition({
              top: newRect.top,
              left: newRect.left,
              width: newRect.width,
              height: newRect.height,
            });
          }, 50);
        } else {
          // Use getBoundingClientRect which gives viewport-relative position
          // Since scroll is disabled, we don't need to add scroll offsets
          setHighlightPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }
      } else {
        setHighlightPosition(null);
      }
    }, 150);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Fade out current step
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        // Fade in next step
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }, 200);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Fade out current step
      setIsVisible(false);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        // Fade in previous step
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }, 200);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const getTooltipPosition = () => {
    if (!highlightPosition || !currentStepData.target) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "fixed" as const,
      };
    }

    // Since scroll is disabled, highlightPosition is already in viewport coordinates
    const { top, left, width, height } = highlightPosition;
    const tooltipWidth = Math.min(400, window.innerWidth - 40);
    const tooltipHeight = 300;
    const spacing = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const safeMargin = 20;
    
    // Use viewport coordinates directly (no scroll offset needed)
    const viewportTop = top;
    const viewportLeft = left;

    let position: { top: string; left: string; transform: string; position: "fixed" | "absolute" };

    switch (currentStepData.position) {
      case "top":
        const topY = viewportTop - tooltipHeight - spacing;
        if (topY < safeMargin) {
          // If not enough space on top, show below
          position = {
            top: `${Math.min(viewportTop + height + spacing, viewportHeight - tooltipHeight - safeMargin)}px`,
            left: `${viewportLeft + width / 2}px`,
            transform: "translateX(-50%)",
            position: "fixed",
          };
        } else {
          position = {
            top: `${Math.max(topY, safeMargin)}px`,
            left: `${viewportLeft + width / 2}px`,
            transform: "translateX(-50%)",
            position: "fixed",
          };
        }
        break;
      case "bottom":
        const bottomY = viewportTop + height + spacing;
        if (bottomY + tooltipHeight > viewportHeight - safeMargin) {
          // If not enough space below, show above
          const topY = Math.max(viewportTop - tooltipHeight - spacing, safeMargin);
          position = {
            top: `${topY}px`,
            left: `${Math.max(safeMargin, Math.min(viewportLeft + width / 2, viewportWidth - tooltipWidth / 2 - safeMargin))}px`,
            transform: "translateX(-50%)",
            position: "fixed",
          };
        } else {
          // Show below, but ensure it's centered and within viewport
          const centerX = viewportLeft + width / 2;
          const finalLeft = Math.max(safeMargin + tooltipWidth / 2, Math.min(centerX, viewportWidth - tooltipWidth / 2 - safeMargin));
          position = {
            top: `${bottomY}px`,
            left: `${finalLeft}px`,
            transform: "translateX(-50%)",
            position: "fixed",
          };
        }
        break;
      case "left":
        const leftX = viewportLeft - tooltipWidth - spacing;
        if (leftX < safeMargin || viewportWidth < 768) {
          // If not enough space on left or mobile, show on right or center
          if (viewportWidth < 768) {
            position = {
              top: `${Math.min(viewportTop + height + spacing, viewportHeight - tooltipHeight - safeMargin)}px`,
              left: "50%",
              transform: "translateX(-50%)",
              position: "fixed",
            };
          } else {
            // Desktop: show on right side, but ensure it fits
            const rightX = viewportLeft + width + spacing;
            const maxRight = viewportWidth - tooltipWidth - safeMargin;
            const finalLeft = Math.min(rightX, maxRight);
            
            position = {
              top: `${Math.max(safeMargin, Math.min(viewportTop + height / 2, viewportHeight - tooltipHeight - safeMargin))}px`,
              left: `${finalLeft}px`,
              transform: "translateY(-50%)",
              position: "fixed",
            };
          }
        } else {
          // Enough space on left, but ensure it doesn't go off screen
          const finalLeftX = Math.max(safeMargin, leftX);
          position = {
            top: `${Math.max(safeMargin, Math.min(viewportTop + height / 2, viewportHeight - tooltipHeight - safeMargin))}px`,
            left: `${finalLeftX}px`,
            transform: "translateY(-50%)",
            position: "fixed",
          };
        }
        break;
      case "right":
        const rightX = viewportLeft + width + spacing;
        if (rightX + tooltipWidth > viewportWidth - safeMargin || viewportWidth < 768) {
          // If not enough space on right or mobile, show on left or center
          if (viewportWidth < 768) {
            position = {
              top: `${Math.min(viewportTop + height + spacing, viewportHeight - tooltipHeight - safeMargin)}px`,
              left: "50%",
              transform: "translateX(-50%)",
              position: "fixed",
            };
          } else {
            position = {
              top: `${Math.max(safeMargin, Math.min(viewportTop + height / 2, viewportHeight - tooltipHeight - safeMargin))}px`,
              left: `${viewportLeft - tooltipWidth - spacing}px`,
              transform: "translateY(-50%)",
              position: "fixed",
            };
          }
        } else {
          position = {
            top: `${Math.max(safeMargin, Math.min(viewportTop + height / 2, viewportHeight - tooltipHeight - safeMargin))}px`,
            left: `${rightX}px`,
            transform: "translateY(-50%)",
            position: "fixed",
          };
        }
        break;
      default:
        position = {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
        };
    }

    // Ensure tooltip stays within viewport - horizontal
    const tooltipLeft = parseInt(position.left);
    if (tooltipLeft < safeMargin) {
      position.left = `${safeMargin}px`;
      if (position.transform.includes("translateX")) {
        position.transform = position.transform.replace("translateX(-50%)", "");
      }
    } else if (tooltipLeft + tooltipWidth > viewportWidth - safeMargin) {
      position.left = `${viewportWidth - tooltipWidth - safeMargin}px`;
      if (position.transform.includes("translateX")) {
        position.transform = position.transform.replace("translateX(-50%)", "");
      }
    }
    
    // Ensure tooltip top stays within viewport - vertical
    const tooltipTop = parseInt(position.top);
    if (tooltipTop < safeMargin) {
      position.top = `${safeMargin}px`;
      if (position.transform.includes("translateY(-50%)")) {
        // If using translateY(-50%), adjust to top alignment
        position.transform = position.transform.replace("translateY(-50%)", "");
      }
    } else if (tooltipTop + tooltipHeight > viewportHeight - safeMargin) {
      position.top = `${viewportHeight - tooltipHeight - safeMargin}px`;
      if (position.transform.includes("translateY(-50%)")) {
        // If using translateY(-50%), adjust to bottom alignment
        position.transform = position.transform.replace("translateY(-50%)", "");
      }
    }

    return position;
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Background overlay with blur - split into sections to avoid blurring highlight area */}
      {highlightPosition ? (
        <>
          {/* Top overlay */}
          <div
            className="fixed backdrop-blur-md transition-opacity duration-300 z-[99999]"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: `${highlightPosition.top}px`,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.3)",
              opacity: isVisible ? 1 : 0,
            }}
          />
          {/* Left overlay */}
          <div
            className="fixed backdrop-blur-md transition-opacity duration-300 z-[99999]"
            style={{
              top: `${highlightPosition.top}px`,
              left: 0,
              width: `${highlightPosition.left}px`,
              height: `${highlightPosition.height}px`,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.3)",
              opacity: isVisible ? 1 : 0,
            }}
          />
          {/* Right overlay */}
          <div
            className="fixed backdrop-blur-md transition-opacity duration-300 z-[99999]"
            style={{
              top: `${highlightPosition.top}px`,
              left: `${highlightPosition.left + highlightPosition.width}px`,
              right: 0,
              height: `${highlightPosition.height}px`,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.3)",
              opacity: isVisible ? 1 : 0,
            }}
          />
          {/* Bottom overlay */}
          <div
            className="fixed backdrop-blur-md transition-opacity duration-300 z-[99999]"
            style={{
              top: `${highlightPosition.top + highlightPosition.height}px`,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.3)",
              opacity: isVisible ? 1 : 0,
            }}
          />
        </>
      ) : (
        <div
          className="fixed inset-0 z-[99999] transition-opacity duration-300 backdrop-blur-md"
          style={{
            backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.3)",
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}

      {/* Highlight area - no blur, just border and glow */}
      {highlightPosition && (
        <div
          className="fixed border-4 border-blue-500 rounded-lg pointer-events-none transition-all duration-500 ease-in-out z-[100000]"
          style={{
            top: `${highlightPosition.top}px`,
            left: `${highlightPosition.left}px`,
            width: `${highlightPosition.width}px`,
            height: `${highlightPosition.height}px`,
            boxShadow: `
              0 0 0 4px rgba(59, 130, 246, 0.8),
              0 0 30px rgba(59, 130, 246, 0.6)
            `,
          }}
        />
      )}

      {/* Tooltip container */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100001] pointer-events-none"
        onClick={(e) => {
          // Prevent closing on overlay click
          e.stopPropagation();
        }}
      >

        {/* Tooltip */}
        <div
          className="z-[100002] max-w-[calc(100vw-2rem)] sm:max-w-md mx-4 sm:mx-0 pointer-events-auto transition-all duration-500 ease-in-out"
          style={{
            ...getTooltipPosition(),
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? getTooltipPosition().transform 
              : `${getTooltipPosition().transform} scale(0.95)`,
          }}
        >
          <div
            className={`rounded-xl sm:rounded-2xl border p-4 sm:p-6 shadow-2xl w-full transition-all duration-300 ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
                <button
                  onClick={handleSkip}
                  className={`text-xs font-medium transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Skip Tour
                </button>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              {currentStepData.title}
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              {currentStepData.description}
            </p>

            {/* Action button (if exists) */}
            {currentStepData.action && (
              <div className="mb-4">
                <Button
                  onClick={() => {
                    currentStepData.action?.onClick();
                    handleNext();
                  }}
                  variant="primary"
                  className="w-full"
                >
                  {currentStepData.action.label}
                </Button>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex-1 text-xs sm:text-sm"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                variant="primary"
                className="flex-1 text-xs sm:text-sm"
                size="sm"
              >
                {currentStep === onboardingSteps.length - 1 ? "Selesai" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
