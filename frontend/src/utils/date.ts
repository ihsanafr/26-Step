/**
 * Format date to YYYY-MM-DD using local timezone (not UTC)
 * This ensures dates match the user's local calendar day
 */
export function formatLocalDate(date: Date | string | null | undefined): string {
  if (!date) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  
  try {
    let dateObj: Date;
    if (typeof date === "string") {
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // Parse as local date to avoid timezone conversion
        const [y, m, d] = date.split("-").map(Number);
        dateObj = new Date(y, m - 1, d);
      } else {
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    
    // Use local timezone components, not UTC
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  } catch (e) {
    return "";
  }
}

/**
 * Format date to English format: "13 January 2026"
 */
export function formatEnglishDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  
  try {
    let date: Date;
    if (typeof dateStr === "string") {
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        date = new Date(dateStr + "T00:00:00");
      } else {
        date = new Date(dateStr);
      }
    } else {
      date = dateStr;
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return "";
  }
}

/**
 * Format date to Indonesian format: "20 januari 2026"
 */
export function formatIndonesianDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  
  try {
    let date: Date;
    if (typeof dateStr === "string") {
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        date = new Date(dateStr + "T00:00:00");
      } else {
        date = new Date(dateStr);
      }
    } else {
      date = dateStr;
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    
    const months = [
      "januari",
      "februari",
      "maret",
      "april",
      "mei",
      "juni",
      "juli",
      "agustus",
      "september",
      "oktober",
      "november",
      "desember",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return "";
  }
}
