import { Shield, Star, CheckCircle2 } from "lucide-react";

export const TrustSignalsFooter = () => {
  return (
    <div
      className="grid sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg"
      role="region"
      aria-label="Förtroendesignaler"
    >
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium text-sm">Verifierade partners</p>
          <p className="text-xs text-muted-foreground">
            Alla har licens & försäkring
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Star className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium text-sm">Riktiga omdömen</p>
          <p className="text-xs text-muted-foreground">Från verifierade kunder</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CheckCircle2
          className="h-8 w-8 text-primary shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium text-sm">Ingen förpliktelse</p>
          <p className="text-xs text-muted-foreground">Gratis att jämföra</p>
        </div>
      </div>
    </div>
  );
};
