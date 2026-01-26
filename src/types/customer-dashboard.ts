// Types for Customer Dashboard

export interface QuoteRequest {
  id: string;
  from_address: string;
  from_postal_code: string;
  from_lat: number | null;
  from_lng: number | null;
  to_address: string;
  to_postal_code: string;
  to_lat: number | null;
  to_lng: number | null;
  move_date: string;
  move_start_time: string | null;
  flexible_days: number | null;
  dwelling_type: string;
  area_m2: number;
  rooms: number | null;
  stairs_from: number | null;
  stairs_to: number | null;
  elevator_from_size: string | null;
  elevator_to_size: string | null;
  heavy_items: string[] | null;
  packing_hours: number | null;
  assembly_hours: number | null;
  parking_restrictions: boolean | null;
  notes: string | null;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
}

export interface Partner {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  average_rating: number | null;
  total_reviews: number | null;
  completed_jobs: number | null;
  is_sponsored: boolean | null;
  f_tax_certificate: boolean | null;
}

export interface Offer {
  id: string;
  quote_request_id: string;
  total_price: number;
  price_before_rut: number | null;
  estimated_hours: number;
  team_size: number;
  time_window: string;
  status: string;
  terms: string | null;
  distance_km: number | null;
  job_status: string | null;
  job_status_updated_at: string | null;
  job_notes: string | null;
  created_at: string;
  partners: Partner | null;
}

export interface Review {
  id: string;
  partner_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type JobStatus = 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  confirmed: 'Bekräftad',
  scheduled: 'Schemalagd',
  in_progress: 'Pågående',
  completed: 'Genomförd',
  cancelled: 'Avbokad',
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  confirmed: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
};

export const JOB_STATUS_ORDER: JobStatus[] = ['confirmed', 'scheduled', 'in_progress', 'completed'];

export const HEAVY_ITEM_LABELS: Record<string, string> = {
  piano: 'Piano',
  flygel: 'Flygel',
  safe150: 'Kassaskåp >150 kg',
};
