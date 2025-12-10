import { z } from "zod";

export const formSchema = z.object({
  from_address: z.string().trim().max(200).optional(),
  to_address: z.string().trim().max(200).optional(),
  area_m2: z.string().optional(),
  rooms: z.string().optional(),
  dwelling_type: z.string().optional(),
  date: z.string().optional(),
  start_time: z.string().optional(),
  stairs_from: z.string().optional(),
  stairs_to: z.string().optional(),
  carry_from_m: z.string().optional(),
  carry_to_m: z.string().optional(),
  parking_restrictions: z.boolean().optional(),
  heavy_items: z.array(z.string()).optional(),
  packing_hours: z.string().optional(),
  assembly_hours: z.string().optional(),
  customer_name: z.string().trim().max(100).optional(),
  customer_phone: z.string().trim().optional(),
  customer_email: z.string().trim().email({ message: "Ange giltig e-postadress" }).max(255).optional().or(z.literal('')),
  home_visit_requested: z.boolean().optional(),
  gdpr_consent: z.boolean().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const initialFormData: FormData = {
  from_address: "",
  to_address: "",
  area_m2: "",
  rooms: "",
  dwelling_type: "",
  date: "",
  start_time: "",
  stairs_from: "",
  stairs_to: "",
  carry_from_m: "",
  carry_to_m: "",
  parking_restrictions: false,
  heavy_items: [],
  packing_hours: "",
  assembly_hours: "",
  customer_name: "",
  customer_phone: "+46",
  customer_email: "",
  home_visit_requested: false,
  gdpr_consent: false,
};

export interface StepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

export const WIZARD_STEPS = [
  { id: 1, title: "Bostad", description: "Adresser & storlek" },
  { id: 2, title: "Detaljer", description: "Trappor & bärväg" },
  { id: 3, title: "Tjänster", description: "Packning & montering" },
  { id: 4, title: "Offert", description: "Pris & kontakt" },
] as const;
