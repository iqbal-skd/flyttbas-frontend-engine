import { HEAVY_ITEM_LABELS } from '@/types/customer-dashboard';

/**
 * Calculate days until a given move date
 */
export function getDaysUntilMove(moveDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const move = new Date(moveDate);
  move.setHours(0, 0, 0, 0);
  const diffTime = move.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format days until move as a human-readable string
 */
export function formatDaysUntilMove(days: number): string {
  if (days < 0) return 'Passerad';
  if (days === 0) return 'Idag!';
  if (days === 1) return 'Imorgon';
  return `${days} dagar`;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers, rounded to 1 decimal
 */
export function calculateDistance(
  lat1: number | null,
  lng1: number | null,
  lat2: number | null,
  lng2: number | null
): number | null {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Open Google Maps with a search for the given address
 */
export function openGoogleMaps(address: string, postalCode?: string): void {
  const query = postalCode ? `${address}, ${postalCode}` : address;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open Google Maps with directions between two addresses
 */
export function openGoogleMapsDirections(
  fromAddress: string,
  fromPostalCode: string,
  toAddress: string,
  toPostalCode: string
): void {
  const origin = encodeURIComponent(`${fromAddress}, ${fromPostalCode}`);
  const destination = encodeURIComponent(`${toAddress}, ${toPostalCode}`);
  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Format heavy items array into a human-readable string
 */
export function formatHeavyItems(items: string[] | null): string | null {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  return items
    .map(item => HEAVY_ITEM_LABELS[item] || item)
    .join(', ');
}

/**
 * Format a date in Swedish locale
 */
export function formatDateSwedish(
  date: string,
  options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }
): string {
  return new Date(date).toLocaleDateString('sv-SE', options);
}

/**
 * Format currency in Swedish format
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('sv-SE');
}

/**
 * Get dwelling type display name
 */
export function getDwellingTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    lagenhet: 'Lägenhet',
    villa: 'Villa',
    radhus: 'Radhus',
    student: 'Studentlägenhet',
    apartment: 'Lägenhet',
  };
  return labels[type.toLowerCase()] || type;
}

/**
 * Truncate address for display, keeping the important parts
 */
export function truncateAddress(address: string, maxLength: number = 30): string {
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength - 3) + '...';
}
