import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calculator } from "lucide-react";
import { z } from "zod";

// Validation schema
const formSchema = z.object({
  from: z.string().trim().min(1, { message: "Fyll i från adress" }).max(200),
  to: z.string().trim().min(1, { message: "Fyll i till adress" }).max(200),
  dwellingType: z.string().min(1, { message: "Välj bostadstyp" }),
  area: z.string().min(1, { message: "Fyll i boarea" }),
  date: z.string().min(1, { message: "Välj önskat datum" }),
  name: z.string().trim().min(1, { message: "Fyll i ditt namn" }).max(100),
  phone: z.string().trim().regex(/^\+46\d{9,10}$/, { message: "Ange giltigt telefonnummer (+46)" }),
  email: z.string().trim().email({ message: "Ange giltig e-postadress" }).max(255),
  homeVisit: z.boolean(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "Du måste godkänna GDPR",
  }),
});

export const QuickQuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    dwellingType: "",
    area: "",
    date: "",
    name: "",
    phone: "+46",
    email: "",
    homeVisit: false,
    gdprConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateEstimate = (areaNum: number): number => {
    // Backend pricing rules from spec:
    // Time model based on area: 5/7/8/9 hours
    // 2 movers: 695 kr/h after RUT
    // 3 movers: 945 kr/h after RUT
    // Minimum 3 hours, Drive out: 500 kr
    
    let hours = 5;
    let hourlyRate = 695; // 2 movers default
    let movers = 2;
    
    if (areaNum <= 40) {
      hours = 5;
      movers = 2;
      hourlyRate = 695;
    } else if (areaNum <= 60) {
      hours = 7;
      movers = 2;
      hourlyRate = 695;
    } else if (areaNum <= 80) {
      hours = 8;
      movers = 3;
      hourlyRate = 945;
    } else {
      hours = 9;
      movers = 3;
      hourlyRate = 945;
    }
    
    // Ensure minimum 3 hours
    hours = Math.max(hours, 3);
    
    const driveOut = 500;
    const laborCost = hourlyRate * hours;
    const totalCost = laborCost + driveOut;
    
    // Round to nearest 50 kr
    return Math.round(totalCost / 50) * 50;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const validation = formSchema.safeParse(formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    const areaNum = parseInt(formData.area) || 0;
    const estimate = calculateEstimate(areaNum);

    toast({
      title: "Tack! Vi ringer dig inom 15 min (08–20).",
      description: `Fastpris-estimat: ${estimate.toLocaleString('sv-SE')} kr efter RUT (preliminärt). Vill du låsa priset? Koppla till kundsupport eller boka hembesök.`,
      duration: 10000,
    });
    
    // Reset form
    setFormData({
      from: "",
      to: "",
      dwellingType: "",
      area: "",
      date: "",
      name: "",
      phone: "+46",
      email: "",
      homeVisit: false,
      gdprConsent: false,
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
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">Från adress *</Label>
              <Input
                id="from"
                placeholder="Ex: Södermalm, Stockholm"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className={errors.from ? "border-red-500" : ""}
              />
              {errors.from && <p className="text-xs text-red-500 mt-1">{errors.from}</p>}
            </div>

            <div>
              <Label htmlFor="to">Till adress *</Label>
              <Input
                id="to"
                placeholder="Ex: Vasastan, Stockholm"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className={errors.to ? "border-red-500" : ""}
              />
              {errors.to && <p className="text-xs text-red-500 mt-1">{errors.to}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dwellingType">Bostadstyp *</Label>
              <Select
                value={formData.dwellingType}
                onValueChange={(value) => setFormData({ ...formData, dwellingType: value })}
              >
                <SelectTrigger id="dwellingType" className={errors.dwellingType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Välj bostadstyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagenhet">Lägenhet</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="radhus">Radhus</SelectItem>
                  <SelectItem value="student">Studentlägenhet</SelectItem>
                </SelectContent>
              </Select>
              {errors.dwellingType && <p className="text-xs text-red-500 mt-1">{errors.dwellingType}</p>}
            </div>

            <div>
              <Label htmlFor="area">Boarea (m²) *</Label>
              <Input
                id="area"
                type="number"
                placeholder="Ex: 65"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="date">Önskat datum *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Namn *</Label>
              <Input
                id="name"
                placeholder="Ditt namn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+46701234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="flex items-start gap-3 p-3 bg-light-bg rounded-lg">
            <Checkbox
              id="homeVisit"
              checked={formData.homeVisit}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, homeVisit: checked as boolean })
              }
            />
            <Label 
              htmlFor="homeVisit" 
              className="text-sm font-normal cursor-pointer"
            >
              Större flytt? Jag vill ha hembesök.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="gdprConsent"
              checked={formData.gdprConsent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, gdprConsent: checked as boolean })
              }
              className={errors.gdprConsent ? "border-red-500" : ""}
            />
            <Label 
              htmlFor="gdprConsent" 
              className="text-xs text-muted-foreground font-normal cursor-pointer"
            >
              Jag godkänner att Flyttbas behandlar mina personuppgifter enligt GDPR *
            </Label>
          </div>
          {errors.gdprConsent && <p className="text-xs text-red-500">{errors.gdprConsent}</p>}

          <Button type="submit" className="w-full" size="lg">
            Få fastpris-estimat
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ingen bindningstid. Gratis prisförslag. Vi ringer inom 15 min (08–20).
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
