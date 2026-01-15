/**
 * Shared constants for admin components
 * Centralized configuration to ensure consistency
 */

import type { QuoteStatus, OfferStatus, JobStatus, PartnerStatus } from "./types";

// Quote status configuration
export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string }> = {
  pending: { label: "Väntande", color: "bg-yellow-100 text-yellow-800" },
  offers_received: { label: "Offerter mottagna", color: "bg-blue-100 text-blue-800" },
  offer_approved: { label: "Offert godkänd", color: "bg-green-100 text-green-800" },
  completed: { label: "Genomförd", color: "bg-green-200 text-green-900" },
  cancelled: { label: "Avbruten", color: "bg-red-100 text-red-800" },
  expired: { label: "Utgången", color: "bg-gray-100 text-gray-800" },
};

// Offer status configuration
export const OFFER_STATUS_CONFIG: Record<OfferStatus, { label: string; color: string }> = {
  pending: { label: "Väntande", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Godkänd", color: "bg-green-100 text-green-800" },
  rejected: { label: "Avvisad", color: "bg-red-100 text-red-800" },
  expired: { label: "Utgången", color: "bg-gray-100 text-gray-800" },
  withdrawn: { label: "Återkallad", color: "bg-orange-100 text-orange-800" },
};

// Job status configuration
export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string }> = {
  confirmed: { label: "Bekräftad", color: "bg-green-100 text-green-800" },
  scheduled: { label: "Schemalagd", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "Pågående", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Genomförd", color: "bg-green-200 text-green-900" },
  cancelled: { label: "Avbokad", color: "bg-red-100 text-red-800" },
};

// Partner status configuration
export const PARTNER_STATUS_CONFIG: Record<NonNullable<PartnerStatus>, { label: string; color: string }> = {
  pending: { label: "Väntande", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Godkänd", color: "bg-green-100 text-green-800" },
  rejected: { label: "Avvisad", color: "bg-red-100 text-red-800" },
  more_info_requested: { label: "Begärt mer info", color: "bg-blue-100 text-blue-800" },
  suspended: { label: "Avstängd", color: "bg-gray-100 text-gray-800" },
};

// Elevator size labels
export const ELEVATOR_SIZE_LABELS: Record<string, string> = {
  small: "Liten hiss",
  big: "Stor hiss",
  none: "Ingen hiss",
};

// Contact preference labels
export const CONTACT_PREFERENCE_LABELS: Record<string, string> = {
  email: "E-post",
  phone: "Telefon",
  both: "Båda",
};

// Urgency thresholds (in days)
export const URGENCY_THRESHOLDS = {
  critical: 3,
  warning: 7,
  notice: 14,
} as const;

// Get urgency level based on days until move
export function getUrgencyLevel(daysUntilMove: number): "critical" | "warning" | "notice" | "normal" | "passed" {
  if (daysUntilMove < 0) return "passed";
  if (daysUntilMove <= URGENCY_THRESHOLDS.critical) return "critical";
  if (daysUntilMove <= URGENCY_THRESHOLDS.warning) return "warning";
  if (daysUntilMove <= URGENCY_THRESHOLDS.notice) return "notice";
  return "normal";
}

// Urgency colors for badges
export const URGENCY_COLORS: Record<ReturnType<typeof getUrgencyLevel>, string> = {
  passed: "bg-gray-100 text-gray-600",
  critical: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  notice: "bg-yellow-100 text-yellow-700",
  normal: "bg-gray-100 text-gray-600",
};
