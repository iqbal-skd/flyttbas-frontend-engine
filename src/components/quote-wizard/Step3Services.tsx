import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Wrench, Home } from "lucide-react";
import type { StepProps } from "./types";

export const Step3Services = ({ formData, setFormData }: StepProps) => {
  return (
    <div className="space-y-5">
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-sm">
        <p className="text-accent-foreground font-medium">
          💡 RUT-avdrag gäller för packning och montering – du får upp till 50% tillbaka!
        </p>
      </div>

      {/* Packing */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Package className="h-5 w-5" />
        <h3 className="font-semibold">Packning (RUT-berättigat)</h3>
      </div>
      
      <div>
        <Label htmlFor="packing_hours">Antal packningstimmar</Label>
        <Input
          id="packing_hours"
          type="number"
          min="0"
          step="0.5"
          placeholder="0"
          value={formData.packing_hours}
          onChange={(e) => setFormData({ ...formData, packing_hours: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Vi hjälper dig att packa och skydda dina ägodelar. Timpris per person enligt offert.
        </p>
      </div>

      {/* Assembly */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Wrench className="h-5 w-5" />
        <h3 className="font-semibold">Montering (RUT-berättigat)</h3>
      </div>
      
      <div>
        <Label htmlFor="assembly_hours">Antal monteringstimmar</Label>
        <Input
          id="assembly_hours"
          type="number"
          min="0"
          step="0.5"
          placeholder="0"
          value={formData.assembly_hours}
          onChange={(e) => setFormData({ ...formData, assembly_hours: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Demontering och montering av möbler, sängar, skåp m.m.
        </p>
      </div>

      {/* Home visit */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Home className="h-5 w-5" />
        <h3 className="font-semibold">Hembesök</h3>
      </div>
      
      <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg">
        <Checkbox
          id="home_visit_requested"
          checked={formData.home_visit_requested}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, home_visit_requested: checked as boolean })
          }
        />
        <div>
          <Label 
            htmlFor="home_visit_requested" 
            className="text-sm font-medium cursor-pointer"
          >
            Ja, jag vill ha ett kostnadsfritt hembesök
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Rekommenderas för större flytt (&gt;100 m²) för exakt prisuppskattning.
          </p>
        </div>
      </div>
    </div>
  );
};
