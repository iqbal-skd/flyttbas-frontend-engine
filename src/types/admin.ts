// Types for Admin Dashboard

export interface AdminDashboardStats {
  pendingPartners: number;
  activePartners: number;
  suspendedPartners: number;
  pendingQuotes: number;
  quotesToday: number;
  quotesThisWeek: number;
  pendingOffers: number;
  activeJobs: number;
  completedJobsThisMonth: number;
  totalCustomers: number;
  totalReviews: number;
  averageRating: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalRevenue: number;
  conversionRate: number;
}

export interface AttentionItem {
  id: string;
  type: 'partner' | 'quote' | 'job' | 'review';
  severity: 'warning' | 'urgent';
  title: string;
  description: string;
  entityId: string;
  timestamp: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userId: string | null;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface QuoteFunnelData {
  newQuotes: number;
  withOffers: number;
  offerApproved: number;
  completed: number;
  reviewGiven: number;
}

export interface PartnerSummary {
  id: string;
  company_name: string;
  status: string;
  average_rating: number | null;
  total_reviews: number | null;
  completed_jobs: number | null;
  is_sponsored: boolean | null;
  created_at: string;
}

export interface QuoteSummary {
  id: string;
  customer_name: string;
  customer_email: string;
  from_address: string;
  from_postal_code: string;
  to_address: string;
  to_postal_code: string;
  move_date: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  offer_count?: number;
}

export interface CustomerSummary {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  quote_count?: number;
  completed_moves?: number;
  total_value?: number;
}

export interface ReviewSummary {
  id: string;
  partner_id: string;
  partner_name?: string;
  customer_id: string | null;
  customer_name?: string;
  offer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  is_flagged?: boolean;
  is_hidden?: boolean;
}

export interface BillingSummary {
  id: string;
  partner_id: string;
  partner_name?: string;
  offer_id: string;
  order_value: number;
  fee_amount: number;
  fee_percentage: number | null;
  invoice_number: string | null;
  invoice_generated_at: string | null;
  invoice_paid_at: string | null;
  created_at: string;
}

export type PartnerStatus = 'pending' | 'approved' | 'rejected' | 'more_info_requested' | 'suspended';
export type QuoteStatus = 'pending' | 'offers_received' | 'offer_approved' | 'completed' | 'cancelled' | 'expired';
export type OfferStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'withdrawn';
export type JobStatus = 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export const PARTNER_STATUS_CONFIG: Record<PartnerStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Väntande', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  approved: { label: 'Godkänd', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: 'Nekad', color: 'text-red-700', bgColor: 'bg-red-100' },
  more_info_requested: { label: 'Mer info begärd', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  suspended: { label: 'Avstängd', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export const QUOTE_STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Väntande', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  offers_received: { label: 'Offerter mottagna', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  offer_approved: { label: 'Offert godkänd', color: 'text-green-700', bgColor: 'bg-green-100' },
  completed: { label: 'Genomförd', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  cancelled: { label: 'Avbruten', color: 'text-red-700', bgColor: 'bg-red-100' },
  expired: { label: 'Utgången', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  confirmed: { label: 'Bekräftad', color: 'text-green-700', bgColor: 'bg-green-100' },
  scheduled: { label: 'Schemalagd', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  in_progress: { label: 'Pågående', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  completed: { label: 'Genomförd', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  cancelled: { label: 'Avbokad', color: 'text-red-700', bgColor: 'bg-red-100' },
};
