/**
 * Format date to Indonesian format: "13 Januari 2026"
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
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return "";
  }
}

