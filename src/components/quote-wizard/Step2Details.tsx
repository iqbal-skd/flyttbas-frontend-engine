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
    <div className="space-y-5">
      {/* Stairs */}
      <div className="flex items-center gap-2 text-primary mb-4">
        <Building className="h-5 w-5" />
        <h3 className="font-semibold">Trappor utan hiss</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stairs_from">Våningar (från-adress)</Label>
          <Input
            id="stairs_from"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stairs_from}
            onChange={(e) => setFormData({ ...formData, stairs_from: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Antal våningar utan hiss</p>
        </div>
        <div>
          <Label htmlFor="stairs_to">Våningar (till-adress)</Label>
          <Input
            id="stairs_to"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stairs_to}
            onChange={(e) => setFormData({ ...formData, stairs_to: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Antal våningar utan hiss</p>
        </div>
      </div>

      {/* Carry distance */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Footprints className="h-5 w-5" />
        <h3 className="font-semibold">Bärväg till fordon</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carry_from_m">Meter (från-adress)</Label>
          <Input
            id="carry_from_m"
            type="number"
            min="0"
            placeholder="35"
            value={formData.carry_from_m}
            onChange={(e) => setFormData({ ...formData, carry_from_m: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Första 35 m ingår</p>
        </div>
        <div>
          <Label htmlFor="carry_to_m">Meter (till-adress)</Label>
          <Input
            id="carry_to_m"
            type="number"
            min="0"
            placeholder="35"
            value={formData.carry_to_m}
            onChange={(e) => setFormData({ ...formData, carry_to_m: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Första 35 m ingår</p>
        </div>
      </div>

      {/* Parking */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Car className="h-5 w-5" />
        <h3 className="font-semibold">Parkeringsmöjligheter</h3>
      </div>
      
      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
        <Checkbox
          id="parking_restrictions"
          checked={formData.parking_restrictions}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, parking_restrictions: checked as boolean })
          }
        />
        <Label htmlFor="parking_restrictions" className="text-sm font-normal cursor-pointer">
          Svår parkering (begränsade parkeringsmöjligheter vid någon adress)
        </Label>
      </div>

      {/* Heavy items */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Weight className="h-5 w-5" />
        <h3 className="font-semibold">Tunga föremål</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_piano"
            checked={formData.heavy_items?.includes('piano')}
            onCheckedChange={(checked) => handleHeavyItemChange('piano', checked as boolean)}
          />
          <Label htmlFor="heavy_piano" className="text-sm font-normal cursor-pointer flex-1">
            Piano <span className="text-muted-foreground">(+1 995 kr)</span>
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_flygel"
            checked={formData.heavy_items?.includes('flygel')}
            onCheckedChange={(checked) => handleHeavyItemChange('flygel', checked as boolean)}
          />
          <Label htmlFor="heavy_flygel" className="text-sm font-normal cursor-pointer flex-1">
            Flygel <span className="text-muted-foreground">(+3 995 kr)</span>
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
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
    </div>
  );
};
