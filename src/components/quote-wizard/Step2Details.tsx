import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, Footprints, Car, Weight } from "lucide-react";
import type { StepProps } from "./types";

export const Step2Details = ({ formData, setFormData }: StepProps) => {
  const handleHeavyItemChange = (item: string, checked: boolean) => {
    const current = formData.heavy_items || [];
    if (checked) {
      setFormData({ ...formData, heavy_items: [...current, item] });
    } else {
      setFormData({ ...formData, heavy_items: current.filter(i => i !== item) });
    }
  };

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Steg 2: Trappor, bärväg och tunga föremål</legend>
      
      {/* Stairs */}
      <div className="flex items-center gap-2 text-primary mb-4">
        <Building className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Trappor utan hiss</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stairs_from" className="text-sm font-medium">
            Våningar (från-adress)
          </Label>
          <Input
            id="stairs_from"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={formData.stairs_from}
            onChange={(e) => setFormData({ ...formData, stairs_from: e.target.value })}
            className="mt-1.5"
            aria-describedby="stairs-from-hint"
          />
          <p id="stairs-from-hint" className="text-xs text-muted-foreground mt-1">
            Antal våningar utan hiss
          </p>
        </div>
        <div>
          <Label htmlFor="stairs_to" className="text-sm font-medium">
            Våningar (till-adress)
          </Label>
          <Input
            id="stairs_to"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={formData.stairs_to}
            onChange={(e) => setFormData({ ...formData, stairs_to: e.target.value })}
            className="mt-1.5"
            aria-describedby="stairs-to-hint"
          />
          <p id="stairs-to-hint" className="text-xs text-muted-foreground mt-1">
            Antal våningar utan hiss
          </p>
        </div>
      </div>

      {/* Carry distance */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Footprints className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Bärväg till fordon</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carry_from_m" className="text-sm font-medium">
            Meter (från-adress)
          </Label>
          <Input
            id="carry_from_m"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="35"
            value={formData.carry_from_m}
            onChange={(e) => setFormData({ ...formData, carry_from_m: e.target.value })}
            className="mt-1.5"
            aria-describedby="carry-from-hint"
          />
          <p id="carry-from-hint" className="text-xs text-muted-foreground mt-1">
            Första 35 m ingår
          </p>
        </div>
        <div>
          <Label htmlFor="carry_to_m" className="text-sm font-medium">
            Meter (till-adress)
          </Label>
          <Input
            id="carry_to_m"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="35"
            value={formData.carry_to_m}
            onChange={(e) => setFormData({ ...formData, carry_to_m: e.target.value })}
            className="mt-1.5"
            aria-describedby="carry-to-hint"
          />
          <p id="carry-to-hint" className="text-xs text-muted-foreground mt-1">
            Första 35 m ingår
          </p>
        </div>
      </div>

      {/* Parking */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Car className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Parkeringsmöjligheter</h3>
      </div>
      
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
        <Checkbox
          id="parking_restrictions"
          checked={formData.parking_restrictions}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, parking_restrictions: checked as boolean })
          }
          aria-describedby="parking-desc"
        />
        <Label 
          htmlFor="parking_restrictions" 
          className="text-sm font-normal cursor-pointer leading-relaxed"
          id="parking-desc"
        >
          Svår parkering (begränsade parkeringsmöjligheter vid någon adress)
        </Label>
      </div>

      {/* Heavy items */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Weight className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Tunga föremål</h3>
      </div>
      
      <div 
        className="space-y-3"
        role="group"
        aria-label="Välj tunga föremål som ska flyttas"
      >
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_piano"
            checked={formData.heavy_items?.includes('piano')}
            onCheckedChange={(checked) => handleHeavyItemChange('piano', checked as boolean)}
          />
          <Label htmlFor="heavy_piano" className="text-sm font-normal cursor-pointer flex-1">
            Piano <span className="text-muted-foreground">(+1 995 kr)</span>
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_flygel"
            checked={formData.heavy_items?.includes('flygel')}
            onCheckedChange={(checked) => handleHeavyItemChange('flygel', checked as boolean)}
          />
          <Label htmlFor="heavy_flygel" className="text-sm font-normal cursor-pointer flex-1">
            Flygel <span className="text-muted-foreground">(+3 995 kr)</span>
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_safe"
            checked={formData.heavy_items?.includes('safe150')}
            onCheckedChange={(checked) => handleHeavyItemChange('safe150', checked as boolean)}
          />
          <Label htmlFor="heavy_safe" className="text-sm font-normal cursor-pointer flex-1">
            Kassaskåp &gt;150 kg <span className="text-muted-foreground">(+2 995 kr)</span>
          </Label>
        </div>
      </div>
    </fieldset>
  );
};
