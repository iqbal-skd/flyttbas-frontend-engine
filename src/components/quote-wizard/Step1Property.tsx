import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Home, Calendar, Route } from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import type { StepProps } from "./types";

export const Step1Property = ({ formData, setFormData }: StepProps) => {
  const { calculateDistance, isCalculating, result } = useDistanceCalculation();

  // Calculate distance when both addresses are set
  useEffect(() => {
    if (formData.from_address && formData.to_address && 
        formData.from_address.length > 5 && formData.to_address.length > 5) {
      const timer = setTimeout(() => {
        calculateDistance(formData.from_address || '', formData.to_address || '');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.from_address, formData.to_address, calculateDistance]);

  const handleFromAddressChange = (address: string, postalCode?: string, location?: { lat: number; lng: number }) => {
    setFormData({ 
      ...formData, 
      from_address: address,
      from_postal_code: postalCode || formData.from_postal_code,
      from_lat: location?.lat,
      from_lng: location?.lng,
    });
  };

  const handleToAddressChange = (address: string, postalCode?: string, location?: { lat: number; lng: number }) => {
    setFormData({ 
      ...formData, 
      to_address: address,
      to_postal_code: postalCode || formData.to_postal_code 
    });
  };

  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Steg 1: Adress och bostadsinformation</legend>
      
      <div className="flex items-center gap-2 text-primary mb-4">
        <MapPin className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Var ska du flytta?</h3>
      </div>
      
      {/* Address Fields */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="from_address" className="text-sm font-medium">
            Från adress
          </Label>
          <AddressAutocomplete
            id="from_address"
            value={formData.from_address || ''}
            onChange={handleFromAddressChange}
            placeholder="Sök adress, t.ex. Södermalm, Stockholm"
            className="mt-1.5"
          />
          {formData.from_postal_code && (
            <p className="text-xs text-muted-foreground mt-1">
              Postnummer: {formData.from_postal_code}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="to_address" className="text-sm font-medium">
            Till adress
          </Label>
          <AddressAutocomplete
            id="to_address"
            value={formData.to_address || ''}
            onChange={handleToAddressChange}
            placeholder="Sök adress, t.ex. Vasastan, Stockholm"
            className="mt-1.5"
          />
          {formData.to_postal_code && (
            <p className="text-xs text-muted-foreground mt-1">
              Postnummer: {formData.to_postal_code}
            </p>
          )}
        </div>
      </div>

      {/* Distance Display */}
      {(result || isCalculating) && (
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border">
          <Route className="h-4 w-4 text-primary" />
          {isCalculating ? (
            <span className="text-sm text-muted-foreground">Beräknar avstånd...</span>
          ) : result?.distance_km ? (
            <span className="text-sm">
              <span className="font-medium">{result.distance_text}</span>
              <span className="text-muted-foreground"> • ca {result.duration_text}</span>
            </span>
          ) : result?.error ? (
            <span className="text-sm text-muted-foreground">{result.error}</span>
          ) : null}
        </div>
      )}

      {/* Dwelling info */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Home className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">Berätta om din bostad</h3>
      </div>
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="dwelling_type" className="text-sm font-medium">
            Bostadstyp
          </Label>
          <Select
            value={formData.dwelling_type}
            onValueChange={(value) => setFormData({ ...formData, dwelling_type: value })}
          >
            <SelectTrigger id="dwelling_type" className="mt-1.5">
              <SelectValue placeholder="Välj typ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lagenhet">Lägenhet</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="radhus">Radhus</SelectItem>
              <SelectItem value="student">Studentlägenhet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="area_m2" className="text-sm font-medium">
              Boarea (m²)
            </Label>
            <Input
              id="area_m2"
              type="number"
              inputMode="numeric"
              placeholder="Ex: 65"
              value={formData.area_m2}
              onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
              className="mt-1.5"
              min="0"
              aria-describedby="area-hint"
            />
            <p id="area-hint" className="sr-only">Ange antingen boarea eller antal rum</p>
          </div>
          <div>
            <Label htmlFor="rooms" className="text-sm font-medium">
              Eller antal rum
            </Label>
            <Select
              value={formData.rooms}
              onValueChange={(value) => setFormData({ ...formData, rooms: value })}
            >
              <SelectTrigger id="rooms" className="mt-1.5">
                <SelectValue placeholder="Välj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 rum</SelectItem>
                <SelectItem value="2">2 rum</SelectItem>
                <SelectItem value="3">3 rum</SelectItem>
                <SelectItem value="4">4+ rum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Calendar className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">När vill du flytta?</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="date" className="text-sm font-medium">
            Önskat datum
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1.5"
          />
        </div>
        
        <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="flexible_time"
            checked={formData.flexible_time}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, flexible_time: checked as boolean })
            }
          />
          <Label 
            htmlFor="flexible_time" 
            className="text-sm font-normal cursor-pointer leading-relaxed"
          >
            Flexibel starttid (flyttfirman föreslår tid)
          </Label>
        </div>
      </div>
    </fieldset>
  );
};
