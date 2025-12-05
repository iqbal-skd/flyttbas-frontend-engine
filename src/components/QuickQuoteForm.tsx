import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { z } from "zod";
import { calcQuote, formatQuoteForUI, type QuoteInput, type QuoteResult } from "@/lib/quoteCalculator";

// Validation schema - minimal required fields for quote
const formSchema = z.object({
  from_address: z.string().trim().max(200).optional(),
  to_address: z.string().trim().max(200).optional(),
  area_m2: z.string().optional(),
  rooms: z.string().optional(),
  dwelling_type: z.string().optional(),
  date: z.string().optional(),
  start_time: z.string().optional(),
  stairs_from: z.string().optional(),
  stairs_to: z.string().optional(),
  carry_from_m: z.string().optional(),
  carry_to_m: z.string().optional(),
  parking_restrictions: z.boolean().optional(),
  heavy_items: z.array(z.string()).optional(),
  packing_hours: z.string().optional(),
  assembly_hours: z.string().optional(),
  customer_name: z.string().trim().max(100).optional(),
  customer_phone: z.string().trim().optional(),
  customer_email: z.string().trim().email({ message: "Ange giltig e-postadress" }).max(255).optional().or(z.literal('')),
  home_visit_requested: z.boolean().optional(),
  gdpr_consent: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const initialFormData: FormData = {
  from_address: "",
  to_address: "",
  area_m2: "",
  rooms: "",
  dwelling_type: "",
  date: "",
  start_time: "",
  stairs_from: "",
  stairs_to: "",
  carry_from_m: "",
  carry_to_m: "",
  parking_restrictions: false,
  heavy_items: [],
  packing_hours: "",
  assembly_hours: "",
  customer_name: "",
  customer_phone: "+46",
  customer_email: "",
  home_visit_requested: false,
  gdpr_consent: false,
};

export const QuickQuoteForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [showQuote, setShowQuote] = useState(false);

  const handleHeavyItemChange = (item: string, checked: boolean) => {
    const current = formData.heavy_items || [];
    if (checked) {
      setFormData({ ...formData, heavy_items: [...current, item] });
    } else {
      setFormData({ ...formData, heavy_items: current.filter(i => i !== item) });
    }
  };

  const buildQuoteInput = (): QuoteInput => {
    return {
      from_address: formData.from_address || undefined,
      to_address: formData.to_address || undefined,
      area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : undefined,
      rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
      dwelling_type: formData.dwelling_type as QuoteInput['dwelling_type'] || undefined,
      date: formData.date || undefined,
      start_time: formData.start_time || undefined,
      stairs_from: formData.stairs_from ? parseInt(formData.stairs_from) : undefined,
      stairs_to: formData.stairs_to ? parseInt(formData.stairs_to) : undefined,
      carry_from_m: formData.carry_from_m ? parseInt(formData.carry_from_m) : undefined,
      carry_to_m: formData.carry_to_m ? parseInt(formData.carry_to_m) : undefined,
      parking_restrictions: formData.parking_restrictions || false,
      heavy_items: (formData.heavy_items || []) as QuoteInput['heavy_items'],
      packing_hours: formData.packing_hours ? parseFloat(formData.packing_hours) : undefined,
      assembly_hours: formData.assembly_hours ? parseFloat(formData.assembly_hours) : undefined,
      rut_eligible: true, // Default for private customers
      customer_name: formData.customer_name || undefined,
      customer_phone: formData.customer_phone !== '+46' ? formData.customer_phone : undefined,
      customer_email: formData.customer_email || undefined,
      home_visit_requested: formData.home_visit_requested || false,
      gdpr_consent: formData.gdpr_consent || false,
    };
  };

  const handleCalculate = () => {
    const input = buildQuoteInput();
    const result = calcQuote(input);
    setQuoteResult(result);
    setShowQuote(true);
    
    // Log for future backend integration
    console.log('[QuoteCalculator] Quote generated:', JSON.stringify(result, null, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate email if provided
    if (formData.customer_email && formData.customer_email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customer_email)) {
        setErrors({ customer_email: "Ange giltig e-postadress" });
        return;
      }
    }
    
    // Check GDPR consent for lead submission
    if (!formData.gdpr_consent) {
      setErrors({ gdpr_consent: "Du måste godkänna GDPR för att skicka förfrågan" });
      return;
    }
    
    const input = buildQuoteInput();
    const result = calcQuote(input);
    setQuoteResult(result);
    setShowQuote(true);
    
    // This is where we'd send to backend/CRM in the future
    console.log('[QuoteCalculator] Lead submission:', JSON.stringify({
      quote: result,
      customer: {
        name: formData.customer_name,
        phone: formData.customer_phone,
        email: formData.customer_email,
        home_visit_requested: formData.home_visit_requested,
        gdpr_consent: formData.gdpr_consent,
      },
      submitted_at: new Date().toISOString(),
    }, null, 2));

    toast({
      title: "Tack! Vi ringer dig inom 15 min (08–20).",
      description: `Fastpris: ${result.move_total.toLocaleString('sv-SE')} kr${result.requires_home_visit ? ' (hembesök rekommenderas)' : ''}`,
      duration: 10000,
    });
  };

  const handleAdjust = () => {
    setShowQuote(false);
    setShowAdvanced(true);
  };

  const handleLockPrice = () => {
    if (!formData.gdpr_consent) {
      setErrors({ gdpr_consent: "Du måste godkänna GDPR för att låsa priset" });
      return;
    }
    
    toast({
      title: "Pris låst!",
      description: "Vi kontaktar dig för att bekräfta bokningen.",
      duration: 5000,
    });
    
    // Future: Send locked quote to backend
    console.log('[QuoteCalculator] Price locked:', JSON.stringify({
      quote: quoteResult,
      locked_at: new Date().toISOString(),
    }, null, 2));
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-accent" />
          <CardTitle>Få Fastpris Direkt</CardTitle>
        </div>
        <CardDescription>
          Fyll i det du vet – vi räknar ut ett pris och listar alla antaganden
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showQuote && quoteResult ? (
          <div className="space-y-4">
            {/* Quote Display */}
            <div className="bg-secondary p-4 rounded-lg space-y-3">
              <div className="text-2xl font-bold text-primary">
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
                <ul className="text-xs text-muted-foreground space-y-1">
                  {quoteResult.assumptions.map((assumption, idx) => (
                    <li key={idx}>• {assumption}</li>
                  ))}
                </ul>
              </div>
              
              {quoteResult.requires_home_visit && (
                <div className="bg-accent/10 text-accent-foreground p-3 rounded-md text-sm">
                  <strong>Rekommendation:</strong> För större flytt rekommenderar vi hembesök för exakt pris.
                </div>
              )}
            </div>
            
            {/* Follow-up Question */}
            <p className="text-sm text-center font-medium">
              Vill du justera något (m², trappor, bärväg) eller låsa priset?
            </p>
            
            {/* Contact fields for locking */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customer_name" className="text-sm">Namn</Label>
                  <Input
                    id="customer_name"
                    placeholder="Ditt namn"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone" className="text-sm">Telefon</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    placeholder="+46701234567"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customer_email" className="text-sm">E-post</Label>
                <Input
                  id="customer_email"
                  type="email"
                  placeholder="din@email.se"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className={`mt-1 ${errors.customer_email ? "border-destructive" : ""}`}
                />
                {errors.customer_email && <p className="text-xs text-destructive mt-1">{errors.customer_email}</p>}
              </div>
              
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gdpr_consent_lock"
                  checked={formData.gdpr_consent}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, gdpr_consent: checked as boolean })
                  }
                  className={errors.gdpr_consent ? "border-destructive" : ""}
                />
                <Label 
                  htmlFor="gdpr_consent_lock" 
                  className="text-xs text-muted-foreground font-normal cursor-pointer"
                >
                  Jag godkänner att Flyttbas behandlar mina personuppgifter enligt GDPR *
                </Label>
              </div>
              {errors.gdpr_consent && <p className="text-xs text-destructive">{errors.gdpr_consent}</p>}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleAdjust} className="flex-1">
                Justera uppgifter
              </Button>
              <Button onClick={handleLockPrice} className="flex-1">
                Låsa priset
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_address">Från adress</Label>
                <Input
                  id="from_address"
                  placeholder="Ex: Södermalm, Stockholm"
                  value={formData.from_address}
                  onChange={(e) => setFormData({ ...formData, from_address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="to_address">Till adress</Label>
                <Input
                  id="to_address"
                  placeholder="Ex: Vasastan, Stockholm"
                  value={formData.to_address}
                  onChange={(e) => setFormData({ ...formData, to_address: e.target.value })}
                />
              </div>
            </div>

            {/* Size Fields */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dwelling_type">Bostadstyp</Label>
                <Select
                  value={formData.dwelling_type}
                  onValueChange={(value) => setFormData({ ...formData, dwelling_type: value })}
                >
                  <SelectTrigger id="dwelling_type">
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
              <div>
                <Label htmlFor="area_m2">Boarea (m²)</Label>
                <Input
                  id="area_m2"
                  type="number"
                  placeholder="Ex: 65"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="rooms">Eller antal rum</Label>
                <Select
                  value={formData.rooms}
                  onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                >
                  <SelectTrigger id="rooms">
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

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Önskat datum</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="start_time">Starttid</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAdvanced ? "Dölj fler alternativ" : "Visa fler alternativ (trappor, bärväg, tunga föremål)"}
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                {/* Stairs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stairs_from">Våningar utan hiss (från)</Label>
                    <Input
                      id="stairs_from"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stairs_from}
                      onChange={(e) => setFormData({ ...formData, stairs_from: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stairs_to">Våningar utan hiss (till)</Label>
                    <Input
                      id="stairs_to"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stairs_to}
                      onChange={(e) => setFormData({ ...formData, stairs_to: e.target.value })}
                    />
                  </div>
                </div>

                {/* Carry distance */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carry_from_m">Bärväg i meter (från)</Label>
                    <Input
                      id="carry_from_m"
                      type="number"
                      min="0"
                      placeholder="35 (ingår)"
                      value={formData.carry_from_m}
                      onChange={(e) => setFormData({ ...formData, carry_from_m: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carry_to_m">Bärväg i meter (till)</Label>
                    <Input
                      id="carry_to_m"
                      type="number"
                      min="0"
                      placeholder="35 (ingår)"
                      value={formData.carry_to_m}
                      onChange={(e) => setFormData({ ...formData, carry_to_m: e.target.value })}
                    />
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="parking_restrictions"
                    checked={formData.parking_restrictions}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, parking_restrictions: checked as boolean })
                    }
                  />
                  <Label htmlFor="parking_restrictions" className="text-sm font-normal cursor-pointer">
                    Svår parkering (begränsade parkeringsmöjligheter)
                  </Label>
                </div>

                {/* Heavy items */}
                <div>
                  <Label className="mb-2 block">Tunga föremål (tillägg)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="heavy_piano"
                        checked={formData.heavy_items?.includes('piano')}
                        onCheckedChange={(checked) => handleHeavyItemChange('piano', checked as boolean)}
                      />
                      <Label htmlFor="heavy_piano" className="text-sm font-normal cursor-pointer">
                        Piano (+1 995 kr)
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="heavy_flygel"
                        checked={formData.heavy_items?.includes('flygel')}
                        onCheckedChange={(checked) => handleHeavyItemChange('flygel', checked as boolean)}
                      />
                      <Label htmlFor="heavy_flygel" className="text-sm font-normal cursor-pointer">
                        Flygel (+3 995 kr)
                      </Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="heavy_safe"
                        checked={formData.heavy_items?.includes('safe150')}
                        onCheckedChange={(checked) => handleHeavyItemChange('safe150', checked as boolean)}
                      />
                      <Label htmlFor="heavy_safe" className="text-sm font-normal cursor-pointer">
                        Kassaskåp &gt;150 kg (+2 995 kr)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Packing & Assembly */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="packing_hours">Packningstimmar (RUT)</Label>
                    <Input
                      id="packing_hours"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={formData.packing_hours}
                      onChange={(e) => setFormData({ ...formData, packing_hours: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="assembly_hours">Monteringstimmar (RUT)</Label>
                    <Input
                      id="assembly_hours"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={formData.assembly_hours}
                      onChange={(e) => setFormData({ ...formData, assembly_hours: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Calculate Button */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleCalculate}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Beräkna pris
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Eller skicka förfrågan</span>
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name_form">Namn</Label>
                <Input
                  id="customer_name_form"
                  placeholder="Ditt namn"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customer_phone_form">Telefon</Label>
                <Input
                  id="customer_phone_form"
                  type="tel"
                  placeholder="+46701234567"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customer_email_form">E-post</Label>
              <Input
                id="customer_email_form"
                type="email"
                placeholder="din@email.se"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className={errors.customer_email ? "border-destructive" : ""}
              />
              {errors.customer_email && <p className="text-xs text-destructive mt-1">{errors.customer_email}</p>}
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
              <Checkbox
                id="home_visit_requested"
                checked={formData.home_visit_requested}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, home_visit_requested: checked as boolean })
                }
              />
              <Label 
                htmlFor="home_visit_requested" 
                className="text-sm font-normal cursor-pointer"
              >
                Större flytt? Jag vill ha hembesök.
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="gdpr_consent"
                checked={formData.gdpr_consent}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, gdpr_consent: checked as boolean })
                }
                className={errors.gdpr_consent ? "border-destructive" : ""}
              />
              <Label 
                htmlFor="gdpr_consent" 
                className="text-xs text-muted-foreground font-normal cursor-pointer"
              >
                Jag godkänner att Flyttbas behandlar mina personuppgifter enligt GDPR *
              </Label>
            </div>
            {errors.gdpr_consent && <p className="text-xs text-destructive">{errors.gdpr_consent}</p>}

            <Button type="submit" className="w-full" size="lg">
              Skicka förfrågan & få pris
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Ingen bindningstid. Gratis prisförslag. Vi ringer inom 15 min (08–20).
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
