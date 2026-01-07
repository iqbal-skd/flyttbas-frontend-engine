import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, Car, Weight } from "lucide-react";
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
      <legend className="sr-only">Steg 2: Hiss, trappor och tunga föremål</legend>
      
      {/* Elevator - From address */}
      <div className="flex items-center gap-2 text-primary mb-4">
        <Building className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Hiss & Trappor (från-adress)</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="elevator_from"
            checked={formData.elevator_from}
            onCheckedChange={(checked) => 
              setFormData({ 
                ...formData, 
                elevator_from: checked as boolean,
                elevator_from_size: checked ? formData.elevator_from_size : undefined,
                stairs_from: checked ? "" : formData.stairs_from 
              })
            }
          />
          <Label 
            htmlFor="elevator_from" 
            className="text-sm font-normal cursor-pointer leading-relaxed"
          >
            Det finns hiss
          </Label>
        </div>

        {formData.elevator_from && (
          <div className="pl-6 space-y-2">
            <Label className="text-sm font-medium">Hissstorlek</Label>
            <RadioGroup
              value={formData.elevator_from_size || ""}
              onValueChange={(value) => setFormData({ ...formData, elevator_from_size: value as 'small' | 'big' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="elevator_from_small" />
                <Label htmlFor="elevator_from_small" className="font-normal cursor-pointer">Liten hiss</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="big" id="elevator_from_big" />
                <Label htmlFor="elevator_from_big" className="font-normal cursor-pointer">Stor hiss</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {!formData.elevator_from && (
          <div>
            <Label htmlFor="stairs_from" className="text-sm font-medium">
              Antal våningar utan hiss
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
            />
          </div>
        )}
      </div>

      {/* Elevator - To address */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Building className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Hiss & Trappor (till-adress)</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="elevator_to"
            checked={formData.elevator_to}
            onCheckedChange={(checked) => 
              setFormData({ 
                ...formData, 
                elevator_to: checked as boolean,
                elevator_to_size: checked ? formData.elevator_to_size : undefined,
                stairs_to: checked ? "" : formData.stairs_to 
              })
            }
          />
          <Label 
            htmlFor="elevator_to" 
            className="text-sm font-normal cursor-pointer leading-relaxed"
          >
            Det finns hiss
          </Label>
        </div>

        {formData.elevator_to && (
          <div className="pl-6 space-y-2">
            <Label className="text-sm font-medium">Hissstorlek</Label>
            <RadioGroup
              value={formData.elevator_to_size || ""}
              onValueChange={(value) => setFormData({ ...formData, elevator_to_size: value as 'small' | 'big' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="elevator_to_small" />
                <Label htmlFor="elevator_to_small" className="font-normal cursor-pointer">Liten hiss</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="big" id="elevator_to_big" />
                <Label htmlFor="elevator_to_big" className="font-normal cursor-pointer">Stor hiss</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {!formData.elevator_to && (
          <div>
            <Label htmlFor="stairs_to" className="text-sm font-medium">
              Antal våningar utan hiss
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
            />
          </div>
        )}
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
            Piano
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_flygel"
            checked={formData.heavy_items?.includes('flygel')}
            onCheckedChange={(checked) => handleHeavyItemChange('flygel', checked as boolean)}
          />
          <Label htmlFor="heavy_flygel" className="text-sm font-normal cursor-pointer flex-1">
            Flygel
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="heavy_safe"
            checked={formData.heavy_items?.includes('safe150')}
            onCheckedChange={(checked) => handleHeavyItemChange('safe150', checked as boolean)}
          />
          <Label htmlFor="heavy_safe" className="text-sm font-normal cursor-pointer flex-1">
            Kassaskåp &gt;150 kg
          </Label>
        </div>
      </div>
    </fieldset>
  );
};
