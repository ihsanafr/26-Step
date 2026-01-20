import React, { useState, useRef, useEffect } from "react";
import { CalenderIcon } from "../../../icons";

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  hint?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  name,
  value = "",
  onChange,
  className = "",
  min,
  max,
  disabled = false,
  placeholder = "DD-MM-YYYY",
  error = false,
  success = false,
  hint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value + "T00:00:00") : null
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      // Convert from backend format (YYYY-MM-DD) to display format (DD-MM-YYYY)
      const parsed = parseDate(value);
      if (parsed) {
        setDisplayValue(formatDateDisplay(parsed));
        setSelectedDate(parsed);
      } else {
        // If value is already in DD-MM-YYYY format
        setDisplayValue(value);
        const parsedDate = parseDate(value);
        setSelectedDate(parsedDate);
      }
    } else {
      setDisplayValue("");
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Format untuk display (DD-MM-YYYY)
  const formatDateDisplay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  // Format untuk backend (YYYY-MM-DD)
  const formatDateBackend = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | null => {
    // Try parsing DD-MM-YYYY first (primary format)
    const ddMMyyyyFormat = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const ddMMyyyyMatch = dateString.match(ddMMyyyyFormat);
    if (ddMMyyyyMatch) {
      const [, day, month, year] = ddMMyyyyMatch;
      const parsed = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    // Try parsing DD/MM/YYYY
    const ddMMyyyySlashFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const ddMMyyyySlashMatch = dateString.match(ddMMyyyySlashFormat);
    if (ddMMyyyySlashMatch) {
      const [, day, month, year] = ddMMyyyySlashMatch;
      const parsed = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    // Try parsing YYYY-MM-DD (for backward compatibility)
    const yyyyMMddFormat = /^(\d{4})-(\d{2})-(\d{2})$/;
    const yyyyMMddMatch = dateString.match(yyyyMMddFormat);
    if (yyyyMMddMatch) {
      const [, year, month, day] = yyyyMMddMatch;
      const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow completely free typing - just update display value
    setDisplayValue(inputValue);

    // Try to parse silently in background for calendar sync
    if (inputValue.length >= 8) {
      const parsed = parseDate(inputValue);
      if (parsed) {
        setSelectedDate(parsed);
        setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
        
        // Convert to backend format and call onChange
        const backendFormat = formatDateBackend(parsed);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: backendFormat,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    } else if (inputValue === "") {
      setSelectedDate(null);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    }
    // For incomplete input, allow free typing without calling onChange
  };

  const handleBlur = () => {
    // Validate and format on blur
    if (displayValue && displayValue.trim().length > 0) {
      const parsed = parseDate(displayValue);
      if (parsed) {
        const displayFormatted = formatDateDisplay(parsed);
        const backendFormatted = formatDateBackend(parsed);
        setDisplayValue(displayFormatted);
        setSelectedDate(parsed);
        setCurrentMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
        
        if (inputRef.current) {
          const syntheticEvent = {
            target: {
              ...inputRef.current,
              value: backendFormatted,
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange?.(syntheticEvent);
        }
      } else {
        // Invalid date, reset to last valid value or empty
        if (value) {
          const parsed = parseDate(value);
          if (parsed) {
            setDisplayValue(formatDateDisplay(parsed));
          } else {
            setDisplayValue(value);
          }
        } else {
          setDisplayValue("");
        }
      }
    } else {
      // Empty input, clear everything
      setDisplayValue("");
      setSelectedDate(null);
      if (inputRef.current) {
        const syntheticEvent = {
          target: {
            ...inputRef.current,
            value: "",
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }
  };

  const handleDateSelect = (date: Date) => {
    const displayFormatted = formatDateDisplay(date);
    const backendFormatted = formatDateBackend(date);
    setDisplayValue(displayFormatted);
    setSelectedDate(date);
    setIsOpen(false);

    if (inputRef.current) {
      const syntheticEvent = {
        target: {
          ...inputRef.current,
          value: backendFormatted,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDisabled = (date: Date): boolean => {
    if (min) {
      const minDate = new Date(min + "T00:00:00");
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max + "T00:00:00");
      if (date > maxDate) return true;
    }
    return false;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    handleDateSelect(today);
  };

  const days = getDaysInMonth(currentMonth);
  const monthLabel = currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" });

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-10 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClasses}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <CalenderIcon className="h-5 w-5" />
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4">
            {/* Calendar Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateMonth("prev")}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{monthLabel}</h3>
                <button
                  type="button"
                  onClick={goToToday}
                  className="rounded-lg px-2 py-1 text-xs text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/20"
                >
                  Today
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigateMonth("next")}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
              {days.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="p-2" />;
                }

                const dayDisabled = isDisabled(day);
                const dayIsToday = isToday(day);
                const dayIsSelected = isSelected(day);

                return (
                  <button
                    key={day.getTime()}
                    type="button"
                    onClick={() => !dayDisabled && handleDateSelect(day)}
                    disabled={dayDisabled}
                    className={`p-2 text-sm rounded-lg transition-colors ${
                      dayDisabled
                        ? "text-gray-300 cursor-not-allowed dark:text-gray-700"
                        : dayIsSelected
                        ? "bg-brand-500 text-white font-semibold"
                        : dayIsToday
                        ? "bg-brand-100 text-brand-700 font-semibold dark:bg-brand-500/20 dark:text-brand-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : success ? "text-success-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default DatePicker;
