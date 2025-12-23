import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Mail, Phone, Shield, CheckCircle } from "lucide-react";
import type { StepProps } from "./types";

export const Step4Quote = ({ formData, setFormData, errors }: StepProps) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Steg 4: Dina kontaktuppgifter</legend>

      {/* Contact Fields */}
      <div className="flex items-center gap-2 text-primary mb-4">
        <User className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Dina kontaktuppgifter</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="customer_name" className="text-sm font-medium">
            Namn *
          </Label>
          <Input
            id="customer_name"
            placeholder="Ditt namn"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className={`mt-1.5 ${errors.customer_name ? "border-destructive" : ""}`}
            autoComplete="name"
            aria-invalid={errors.customer_name ? "true" : "false"}
          />
          {errors.customer_name && (
            <p className="text-xs text-destructive mt-1" role="alert">{errors.customer_name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customer_email" className="text-sm font-medium">
              E-post *
            </Label>
            <Input
              id="customer_email"
              type="email"
              inputMode="email"
              placeholder="din@email.se"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className={`mt-1.5 ${errors.customer_email ? "border-destructive" : ""}`}
              autoComplete="email"
              aria-invalid={errors.customer_email ? "true" : "false"}
            />
            {errors.customer_email && (
              <p className="text-xs text-destructive mt-1" role="alert">{errors.customer_email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="customer_phone" className="text-sm font-medium">
              Telefon
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              inputMode="tel"
              placeholder="+46701234567"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              className="mt-1.5"
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* Contact Preference */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium">Hur vill du bli kontaktad?</Label>
        <RadioGroup
          value={formData.contact_preference}
          onValueChange={(value: 'email' | 'phone' | 'both') => 
            setFormData({ ...formData, contact_preference: value })
          }
          className="flex flex-col gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="contact_email_only" />
            <Label htmlFor="contact_email_only" className="flex items-center gap-2 font-normal cursor-pointer">
              <Mail className="h-4 w-4" />
              Endast e-post
              <span className="text-xs text-muted-foreground">(ditt nummer delas inte)</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="contact_phone_only" />
            <Label htmlFor="contact_phone_only" className="flex items-center gap-2 font-normal cursor-pointer">
              <Phone className="h-4 w-4" />
              Telefon
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="contact_both" />
            <Label htmlFor="contact_both" className="font-normal cursor-pointer">
              Båda
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes" className="text-sm font-medium">
          Övriga kommentarer
        </Label>
        <Textarea
          id="notes"
          placeholder="Beskriv något särskilt om flytten (valfritt)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1.5"
          rows={3}
        />
      </div>

      {/* GDPR */}
      <div className="flex items-start gap-3 mt-4">
        <Checkbox
          id="gdpr_consent"
          checked={formData.gdpr_consent}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, gdpr_consent: checked as boolean })
          }
          className={errors.gdpr_consent ? "border-destructive" : ""}
          aria-invalid={errors.gdpr_consent ? "true" : "false"}
        />
        <Label 
          htmlFor="gdpr_consent" 
          className="text-xs text-muted-foreground font-normal cursor-pointer leading-relaxed"
        >
          Jag godkänner att Flyttbas behandlar mina personuppgifter enligt GDPR för att matcha mig med lämpliga flyttfirmor *
        </Label>
      </div>
      {errors.gdpr_consent && (
        <p className="text-xs text-destructive" role="alert">{errors.gdpr_consent}</p>
      )}

      {/* Trust signals */}
      <div className="bg-secondary/50 p-4 rounded-lg mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">Så fungerar det</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            Din förfrågan skickas till verifierade flyttfirmor i ditt område
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            Du får 3-4 offerter att jämföra – helt gratis och utan förpliktelse
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            Väljer du e-post delas inte ditt telefonnummer med flyttfirmorna
          </li>
        </ul>
      </div>
    </fieldset>
  );
};
