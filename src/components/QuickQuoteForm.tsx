import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calculator } from "lucide-react";

export const QuickQuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    dwellingType: "",
    area: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple estimation calculation
    const areaNum = parseInt(formData.area) || 0;
    const baseHours = Math.ceil(areaNum / 25) + 2; // Rough estimate
    const hourlyRate = 650; // After RUT
    const driveOut = 500;
    const estimate = Math.round((baseHours * hourlyRate + driveOut) / 50) * 50;

    toast({
      title: "Preliminärt fastpris",
      description: `Ca ${estimate.toLocaleString('sv-SE')} kr efter RUT. Vi kontaktar dig för exakt pris!`,
    });
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-accent" />
          <CardTitle>Få Fastpris Direkt</CardTitle>
        </div>
        <CardDescription>
          Fyll i uppgifterna så får du ett preliminärt pris på 30 sekunder
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="from">Från adress</Label>
            <Input
              id="from"
              placeholder="Ex: Södermalm, Stockholm"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="to">Till adress</Label>
            <Input
              id="to"
              placeholder="Ex: Vasastan, Stockholm"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="dwellingType">Bostadstyp</Label>
            <Select
              value={formData.dwellingType}
              onValueChange={(value) => setFormData({ ...formData, dwellingType: value })}
              required
            >
              <SelectTrigger id="dwellingType">
                <SelectValue placeholder="Välj bostadstyp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagenhet">Lägenhet</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="radhus">Radhus</SelectItem>
                <SelectItem value="student">Studentlägenhet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="area">Boarea (m²)</Label>
            <Input
              id="area"
              type="number"
              placeholder="Ex: 65"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Beräkna pris
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ingen bindningstid. Gratis prisförslag.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
