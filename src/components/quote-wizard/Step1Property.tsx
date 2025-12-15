import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, Calendar } from "lucide-react";
import type { StepProps } from "./types";

export const Step1Property = ({ formData, setFormData }: StepProps) => {
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
          <Input
            id="from_address"
            placeholder="Ex: Södermalm, Stockholm"
            value={formData.from_address}
            onChange={(e) => setFormData({ ...formData, from_address: e.target.value })}
            className="mt-1.5"
            autoComplete="address-line1"
          />
        </div>
        <div>
          <Label htmlFor="to_address" className="text-sm font-medium">
            Till adress
          </Label>
          <Input
            id="to_address"
            placeholder="Ex: Vasastan, Stockholm"
            value={formData.to_address}
            onChange={(e) => setFormData({ ...formData, to_address: e.target.value })}
            className="mt-1.5"
            autoComplete="address-line1"
          />
        </div>
      </div>

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

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-primary mt-6 mb-4">
        <Calendar className="h-5 w-5" aria-hidden="true" />
        <h3 className="font-semibold text-base sm:text-lg">När vill du flytta?</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="start_time" className="text-sm font-medium">
            Starttid
          </Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>
    </fieldset>
  );
};
