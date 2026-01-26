/**
 * Shared types for admin components
 * Centralized type definitions to avoid duplication
 */

import type { Database } from "@/integrations/supabase/types";

// Database enum types
export type QuoteStatus = Database["public"]["Enums"]["quote_status"];
export type OfferStatus = Database["public"]["Enums"]["offer_status"];
export type PartnerStatus = Database["public"]["Enums"]["partner_status"];
export type JobStatus = "confirmed" | "scheduled" | "in_progress" | "completed" | "cancelled";

// Quote Request interface - matches database schema with flexible types for compatibility
export interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  from_address: string;
  from_postal_code: string;
  from_lat?: number | null;
  from_lng?: number | null;
  to_address: string;
  to_postal_code: string;
  to_lat?: number | null;
  to_lng?: number | null;
  move_date: string;
  move_start_time: string | null;
  dwelling_type: string;
  area_m2: number;
  rooms: number | null;
  stairs_from: number | null;
  stairs_to: number | null;
  elevator_from_size: string | null;
  elevator_to_size: string | null;
  packing_hours: number | null;
  assembly_hours: number | null;
  heavy_items: unknown;
  notes: string | null;
  parking_restrictions: boolean | null;
  home_visit_requested: boolean | null;
  contact_preference: string | null;
  status: string | null;
  created_at: string;
  updated_at?: string;
  expires_at?: string | null;
  customer_id?: string | null;
}

// Offer interface
export interface Offer {
  id: string;
  partner_id: string;
  quote_request_id: string;
  available_date: string;
  time_window: string;
  estimated_hours: number;
  team_size: number;
  price_before_rut: number;
  rut_deduction: number | null;
  total_price: number;
  terms: string | null;
  status: OfferStatus | null;
  valid_until: string;
  distance_km: number | null;
  drive_time_minutes: number | null;
  ranking_score: number | null;
  job_status: JobStatus | null;
  job_status_updated_at: string | null;
  job_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Offer with partner details (for list views)
export interface OfferWithPartner extends Offer {
  partner?: {
    company_name: string;
    contact_email: string;
    contact_phone: string;
    average_rating: number | null;
    total_reviews: number | null;
    completed_jobs: number | null;
  } | null;
}

// Partner summary for dropdowns
export interface PartnerSummary {
  id: string;
  company_name: string;
  status: PartnerStatus | null;
}

// Partner details for offer sheet
export interface PartnerDetails {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  average_rating: number | null;
  total_reviews: number | null;
  completed_jobs: number | null;
}

// Quote summary for offer sheet
export interface QuoteSummary {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  from_address: string;
  from_postal_code: string;
  to_address: string;
  to_postal_code: string;
  move_date: string;
}

// Contact info for display
export interface ContactInfo {
  name: string;
  email: string;
  phone?: string | null;
  preference?: "email" | "phone" | "both" | null;
}

// Address info for display
export interface AddressInfo {
  address: string;
  postalCode: string;
  lat?: number | null;
  lng?: number | null;
  stairs?: number | null;
  elevatorSize?: string | null;
}
