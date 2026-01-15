/**
 * Shared utility functions for admin components
 */

/**
 * Format a date string to Swedish locale
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("sv-SE");
}

/**
 * Format a date string to Swedish locale with time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate days until a given date
 */
export function getDaysUntil(date: string | Date): number {
  return Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Calculate days since a given date
 */
export function getDaysSince(date: string | Date): number {
  return Math.ceil(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Format currency in Swedish format
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("sv-SE")} kr`;
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

/**
 * Format duration in minutes to human-readable
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} tim`;
  }
  return `${hours} tim ${remainingMinutes} min`;
}

/**
 * Truncate address to first part (before comma)
 */
export function truncateAddress(address: string): string {
  return address.split(",")[0];
}

/**
 * Generate Google Maps URL from coordinates
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

/**
 * Generate mailto link
 */
export function getMailtoUrl(email: string): string {
  return `mailto:${email}`;
}

/**
 * Generate tel link
 */
export function getTelUrl(phone: string): string {
  return `tel:${phone}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Check if a date is in the past
 */
export function isPast(date: string | Date): boolean {
  return new Date(date) < new Date();
}

/**
 * Check if a date is within the current month
 */
export function isThisMonth(date: string | Date): boolean {
  const d = new Date(date);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}
