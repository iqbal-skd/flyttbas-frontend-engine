import { z } from "zod";

export const formSchema = z.object({
  from_address: z.string().trim().max(200).optional(),
  from_postal_code: z.string().trim().max(10).optional(),
  from_lat: z.number().optional(),
  from_lng: z.number().optional(),
  to_address: z.string().trim().max(200).optional(),
  to_postal_code: z.string().trim().max(10).optional(),
  to_lat: z.number().optional(),
  to_lng: z.number().optional(),
  area_m2: z.string().optional(),
  rooms: z.string().optional(),
  dwelling_type: z.string().optional(),
  date: z.string().optional(),
  flexible_time: z.boolean().optional(),
  flexible_days: z.enum(['1', '2', '3']).optional(),
  elevator_from: z.boolean().optional(),
  elevator_from_size: z.enum(['small', 'big']).optional(),
  elevator_to: z.boolean().optional(),
  elevator_to_size: z.enum(['small', 'big']).optional(),
  stairs_from: z.string().optional(),
  stairs_to: z.string().optional(),
  parking_restrictions: z.boolean().optional(),
  heavy_items: z.array(z.string()).optional(),
  packing_help: z.boolean().optional(),
  assembly_help: z.boolean().optional(),
  customer_name: z.string().trim().min(2, "Namn krävs").max(100),
  customer_phone: z.string().trim()
    .optional()
    .refine(
      (val) => !val || /^\+46[0-9]{7,12}$/.test(val.replace(/\s/g, '')),
      { message: "Ange telefonnummer i format +46XXXXXXXXX" }
    ),
  customer_email: z.string().trim()
    .min(1, "E-postadress krävs")
    .email({ message: "Ange en giltig e-postadress" })
    .max(255, "E-postadressen är för lång"),
  contact_preference: z.enum(['email', 'phone', 'both']).default('email'),
  home_visit_requested: z.boolean().optional(),
  gdpr_consent: z.boolean().refine(val => val === true, "Du måste godkänna GDPR"),
  notes: z.string().trim().max(1000).optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const initialFormData: FormData = {
  from_address: "",
  from_postal_code: "",
  from_lat: undefined,
  from_lng: undefined,
  to_address: "",
  to_postal_code: "",
  to_lat: undefined,
  to_lng: undefined,
  area_m2: "",
  rooms: "",
  dwelling_type: "",
  date: "",
  flexible_time: true,
  flexible_days: undefined,
  elevator_from: false,
  elevator_from_size: undefined,
  elevator_to: false,
  elevator_to_size: undefined,
  stairs_from: "",
  stairs_to: "",
  parking_restrictions: false,
  heavy_items: [],
  packing_help: false,
  assembly_help: false,
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  contact_preference: "email",
  home_visit_requested: false,
  gdpr_consent: false,
  notes: "",
};

export interface StepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

export const WIZARD_STEPS = [
  { id: 1, title: "Bostad", description: "Adresser & storlek" },
  { id: 2, title: "Detaljer", description: "Hiss & trappor" },
  { id: 3, title: "Tjänster", description: "Packning & montering" },
  { id: 4, title: "Kontakt", description: "Dina uppgifter" },
] as const;
