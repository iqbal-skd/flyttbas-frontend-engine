export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      commission_fees: {
        Row: {
          created_at: string
          credit_note_amount: number | null
          credit_note_number: string | null
          credit_note_reason: string | null
          fee_amount: number
          fee_percentage: number | null
          id: string
          invoice_generated_at: string | null
          invoice_number: string | null
          invoice_paid_at: string | null
          offer_id: string
          order_value: number
          partner_id: string
        }
        Insert: {
          created_at?: string
          credit_note_amount?: number | null
          credit_note_number?: string | null
          credit_note_reason?: string | null
          fee_amount: number
          fee_percentage?: number | null
          id?: string
          invoice_generated_at?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          offer_id: string
          order_value: number
          partner_id: string
        }
        Update: {
          created_at?: string
          credit_note_amount?: number | null
          credit_note_number?: string | null
          credit_note_reason?: string | null
          fee_amount?: number
          fee_percentage?: number | null
          id?: string
          invoice_generated_at?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          offer_id?: string
          order_value?: number
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_fees_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_fees_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          available_date: string
          created_at: string
          distance_km: number | null
          drive_time_minutes: number | null
          estimated_hours: number
          id: string
          job_notes: string | null
          job_status: Database["public"]["Enums"]["job_status"] | null
          job_status_updated_at: string | null
          partner_id: string
          price_before_rut: number
          quote_request_id: string
          ranking_score: number | null
          rut_deduction: number | null
          status: Database["public"]["Enums"]["offer_status"] | null
          team_size: number
          terms: string | null
          time_window: string
          total_price: number
          updated_at: string
          valid_until: string
        }
        Insert: {
          available_date: string
          created_at?: string
          distance_km?: number | null
          drive_time_minutes?: number | null
          estimated_hours: number
          id?: string
          job_notes?: string | null
          job_status?: Database["public"]["Enums"]["job_status"] | null
          job_status_updated_at?: string | null
          partner_id: string
          price_before_rut: number
          quote_request_id: string
          ranking_score?: number | null
          rut_deduction?: number | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          team_size: number
          terms?: string | null
          time_window: string
          total_price: number
          updated_at?: string
          valid_until: string
        }
        Update: {
          available_date?: string
          created_at?: string
          distance_km?: number | null
          drive_time_minutes?: number | null
          estimated_hours?: number
          id?: string
          job_notes?: string | null
          job_status?: Database["public"]["Enums"]["job_status"] | null
          job_status_updated_at?: string | null
          partner_id?: string
          price_before_rut?: number
          quote_request_id?: string
          ranking_score?: number | null
          rut_deduction?: number | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          team_size?: number
          terms?: string | null
          time_window?: string
          total_price?: number
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          address_lat: number | null
          address_lng: number | null
          average_rating: number | null
          commission_rate_override: number | null
          company_name: string
          completed_jobs: number | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          f_tax_certificate: boolean | null
          id: string
          insurance_company: string | null
          insurance_policy_number: string | null
          insurance_valid_until: string | null
          is_sponsored: boolean | null
          max_drive_distance_km: number | null
          org_number: string
          reviewed_at: string | null
          reviewed_by: string | null
          service_postal_codes: string[] | null
          sponsored_until: string | null
          status: Database["public"]["Enums"]["partner_status"] | null
          status_reason: string | null
          total_reviews: number | null
          traffic_license_number: string | null
          traffic_license_valid_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          address_lat?: number | null
          address_lng?: number | null
          average_rating?: number | null
          commission_rate_override?: number | null
          company_name: string
          completed_jobs?: number | null
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          f_tax_certificate?: boolean | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_valid_until?: string | null
          is_sponsored?: boolean | null
          max_drive_distance_km?: number | null
          org_number: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_postal_codes?: string[] | null
          sponsored_until?: string | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          status_reason?: string | null
          total_reviews?: number | null
          traffic_license_number?: string | null
          traffic_license_valid_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          address_lat?: number | null
          address_lng?: number | null
          average_rating?: number | null
          commission_rate_override?: number | null
          company_name?: string
          completed_jobs?: number | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          f_tax_certificate?: boolean | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          insurance_valid_until?: string | null
          is_sponsored?: boolean | null
          max_drive_distance_km?: number | null
          org_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          service_postal_codes?: string[] | null
          sponsored_until?: string | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          status_reason?: string | null
          total_reviews?: number | null
          traffic_license_number?: string | null
          traffic_license_valid_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          contact_preference: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_preference?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_preference?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          area_m2: number
          assembly_hours: number | null
          carry_from_m: number | null
          carry_to_m: number | null
          contact_preference: string | null
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          dwelling_type: string
          elevator_from_size: string | null
          elevator_to_size: string | null
          expires_at: string | null
          from_address: string
          from_lat: number | null
          from_lng: number | null
          from_postal_code: string
          heavy_items: Json | null
          home_visit_requested: boolean | null
          id: string
          move_date: string
          move_start_time: string | null
          notes: string | null
          packing_hours: number | null
          parking_restrictions: boolean | null
          rooms: number | null
          stairs_from: number | null
          stairs_to: number | null
          status: Database["public"]["Enums"]["quote_status"] | null
          to_address: string
          to_postal_code: string
          updated_at: string
        }
        Insert: {
          area_m2: number
          assembly_hours?: number | null
          carry_from_m?: number | null
          carry_to_m?: number | null
          contact_preference?: string | null
          created_at?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          dwelling_type: string
          elevator_from_size?: string | null
          elevator_to_size?: string | null
          expires_at?: string | null
          from_address: string
          from_lat?: number | null
          from_lng?: number | null
          from_postal_code: string
          heavy_items?: Json | null
          home_visit_requested?: boolean | null
          id?: string
          move_date: string
          move_start_time?: string | null
          notes?: string | null
          packing_hours?: number | null
          parking_restrictions?: boolean | null
          rooms?: number | null
          stairs_from?: number | null
          stairs_to?: number | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          to_address: string
          to_postal_code: string
          updated_at?: string
        }
        Update: {
          area_m2?: number
          assembly_hours?: number | null
          carry_from_m?: number | null
          carry_to_m?: number | null
          contact_preference?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          dwelling_type?: string
          elevator_from_size?: string | null
          elevator_to_size?: string | null
          expires_at?: string | null
          from_address?: string
          from_lat?: number | null
          from_lng?: number | null
          from_postal_code?: string
          heavy_items?: Json | null
          home_visit_requested?: boolean | null
          id?: string
          move_date?: string
          move_start_time?: string | null
          notes?: string | null
          packing_hours?: number | null
          parking_restrictions?: boolean | null
          rooms?: number | null
          stairs_from?: number | null
          stairs_to?: number | null
          status?: Database["public"]["Enums"]["quote_status"] | null
          to_address?: string
          to_postal_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          id: string
          offer_id: string
          partner_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          offer_id: string
          partner_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          offer_id?: string
          partner_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: true
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      customer_owns_quote: {
        Args: { _quote_request_id: string; _user_id: string }
        Returns: boolean
      }
      get_partner_commission_rate: {
        Args: { partner_uuid: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      haversine_distance: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      is_approved_partner: { Args: { _user_id: string }; Returns: boolean }
      partner_has_approved_offer_for_quote: {
        Args: { _quote_request_id: string; _user_id: string }
        Returns: boolean
      }
      promote_to_admin: { Args: { target_email: string }; Returns: undefined }
      promote_to_partner: { Args: { target_email: string }; Returns: undefined }
      set_partner_role: { Args: { target_user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "partner" | "customer"
      job_status:
        | "confirmed"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      offer_status:
        | "pending"
        | "approved"
        | "rejected"
        | "expired"
        | "withdrawn"
      partner_status:
        | "pending"
        | "approved"
        | "rejected"
        | "more_info_requested"
        | "suspended"
      quote_status:
        | "pending"
        | "offers_received"
        | "offer_approved"
        | "completed"
        | "cancelled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partner", "customer"],
      job_status: [
        "confirmed",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      offer_status: ["pending", "approved", "rejected", "expired", "withdrawn"],
      partner_status: [
        "pending",
        "approved",
        "rejected",
        "more_info_requested",
        "suspended",
      ],
      quote_status: [
        "pending",
        "offers_received",
        "offer_approved",
        "completed",
        "cancelled",
        "expired",
      ],
    },
  },
} as const
