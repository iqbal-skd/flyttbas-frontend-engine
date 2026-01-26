// System-wide constants and configuration

export type CommissionType = "percentage" | "fixed";

export const COMMISSION = {
  DEFAULT_RATE: 7,
  DEFAULT_TYPE: "percentage" as CommissionType,
  MIN_RATE: 0,
  MAX_RATE: 100,
  MAX_FIXED: 50000, // Max fixed amount in SEK
  SETTINGS_KEY: "commission_rate",
  TYPE_LABELS: {
    percentage: "Procent (%)",
    fixed: "Fast belopp (SEK)",
  } as Record<CommissionType, string>,
} as const;

export const PARTNER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  MORE_INFO_REQUESTED: "more_info_requested",
  SUSPENDED: "suspended",
} as const;

export const PARTNER_STATUS_LABELS: Record<string, string> = {
  pending: "Väntande",
  approved: "Godkänd",
  rejected: "Avvisad",
  more_info_requested: "Begärt mer info",
  suspended: "Avstängd",
};

export const PARTNER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  more_info_requested: "bg-blue-100 text-blue-800",
  suspended: "bg-gray-100 text-gray-800",
};

export const OFFER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXPIRED: "expired",
  WITHDRAWN: "withdrawn",
} as const;

export const JOB_STATUS = {
  CONFIRMED: "confirmed",
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  PARTNER: "partner",
  CUSTOMER: "customer",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
} as const;
