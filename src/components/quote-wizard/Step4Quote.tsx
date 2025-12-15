import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Receipt, User } from "lucide-react";
import type { StepProps } from "./types";
import type { QuoteResult } from "@/lib/quoteCalculator";

interface Step4QuoteProps extends StepProps {
  quoteResult: QuoteResult | null;
}

export const Step4Quote = ({ formData, setFormData, errors, quoteResult }: Step4QuoteProps) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Steg 4: Din offert och kontaktuppgifter</legend>
      
      {/* Quote Display */}
      {quoteResult && (
        <>
          <div className="flex items-center gap-2 text-primary mb-4">
            <Receipt className="h-5 w-5" aria-hidden="true" />
            <h3 className="font-semibold text-base sm:text-lg">Din offert</h3>
          </div>
          
          <div 
            className="bg-secondary p-4 rounded-lg space-y-3"
            role="region"
            aria-label="Prissammanställning"
          >
            <div className="text-xl sm:text-2xl font-bold text-primary">
              FASTPRIS FLYTT: {quoteResult.move_total.toLocaleString('sv-SE')} kr
            </div>
            
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>– Arbete {quoteResult.move_breakdown.team} personer × {quoteResult.move_breakdown.labor_hours} h à {quoteResult.move_breakdown.hourly} kr = {quoteResult.move_breakdown.labor_cost.toLocaleString('sv-SE')} kr</p>
              <p>– Framkörning = {quoteResult.move_breakdown.drive_out} kr</p>
              {quoteResult.move_breakdown.heavy_items.map((item, idx) => (
                <p key={idx}>– {item.item} = {item.price.toLocaleString('sv-SE')} kr</p>
              ))}
              {quoteResult.move_breakdown.evening_weekend_uplift > 0 && (
                <p>– Kväll/helgtillägg = {quoteResult.move_breakdown.evening_weekend_uplift.toLocaleString('sv-SE')} kr</p>
              )}
            </div>
            
            <div className="border-t border-border pt-3">
              <p className="font-medium text-sm mb-2">Så har vi räknat:</p>
              <ul className="text-xs text-muted-foreground space-y-1" aria-label="Antaganden för prisberäkning">
                {quoteResult.assumptions.map((assumption, idx) => (
                  <li key={idx}>• {assumption}</li>
                ))}
              </ul>
            </div>
            
            {quoteResult.requires_home_visit && (
              <div 
                className="bg-accent/10 text-foreground p-3 rounded-md text-sm border border-accent/20"
                role="alert"
              >
                <strong>Rekommendation:</strong> För större flytt rekommenderar vi hembesök för exakt pris.
              </div>
            )}
          </div>
        </>
      )}

      {/* Contact Fields */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <User className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Dina kontaktuppgifter</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="customer_name" className="text-sm font-medium">
            Namn
          </Label>
          <Input
            id="customer_name"
            placeholder="Ditt namn"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="mt-1.5"
            autoComplete="name"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div>
            <Label htmlFor="customer_email" className="text-sm font-medium">
              E-post
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
              aria-describedby={errors.customer_email ? "email-error" : undefined}
            />
            {errors.customer_email && (
              <p id="email-error" className="text-xs text-destructive mt-1" role="alert">
                {errors.customer_email}
              </p>
            )}
          </div>
        </div>
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
          aria-describedby={errors.gdpr_consent ? "gdpr-error" : "gdpr-label"}
        />
        <Label 
          htmlFor="gdpr_consent" 
          id="gdpr-label"
          className="text-xs text-muted-foreground font-normal cursor-pointer leading-relaxed"
        >
          Jag godkänner att Flyttbas behandlar mina personuppgifter enligt GDPR *
        </Label>
      </div>
      {errors.gdpr_consent && (
        <p id="gdpr-error" className="text-xs text-destructive" role="alert">
          {errors.gdpr_consent}
        </p>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        Ingen bindningstid. Gratis prisförslag. Vi ringer inom 15 min (08–20).
      </p>
    </fieldset>
  );
};
