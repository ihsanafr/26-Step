/**
 * Formats a numeric amount into a currency string (IDR).
 * 
 * @param amount - The numeric amount to format
 * @param compact - Whether to use compact notation (e.g., "1 jt" instead of "1.000.000")
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, compact = false): string {
    if (amount === undefined || amount === null || isNaN(amount)) return "Rp 0";

    const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
        notation: compact ? "compact" : "standard",
    });

    // Standardize the output to "Rp X"
    let formatted = formatter.format(amount);

    // Some browsers return "IDR" instead of "Rp" or have different spacing
    formatted = formatted.replace("IDR", "Rp").replace("Rp", "Rp ");

    // Remove multiple spaces and non-breaking spaces
    return formatted.replace(/\s+/g, " ").trim();
}
