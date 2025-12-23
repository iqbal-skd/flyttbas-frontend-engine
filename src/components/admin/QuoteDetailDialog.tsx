import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
  Clock,
  Save,
  Trash2,
  Plus,
  Building2,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  MessageSquare,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Database } from "@/integrations/supabase/types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];
type OfferStatus = Database["public"]["Enums"]["offer_status"];

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  from_address: string;
  from_postal_code: string;
  to_address: string;
  to_postal_code: string;
  move_date: string;
  move_start_time: string | null;
  dwelling_type: string;
  area_m2: number;
  rooms: number | null;
  stairs_from: number | null;
  stairs_to: number | null;
  carry_from_m: number | null;
  carry_to_m: number | null;
  packing_hours: number | null;
  assembly_hours: number | null;
  heavy_items: unknown;
  notes: string | null;
  parking_restrictions: boolean | null;
  home_visit_requested: boolean | null;
  contact_preference: string | null;
  status: string | null;
  created_at: string;
  updated_at?: string;
  expires_at?: string | null;
  customer_id?: string | null;
}

interface Offer {
  id: string;
  partner_id: string;
  quote_request_id: string;
  available_date: string;
  time_window: string;
  estimated_hours: number;
  team_size: number;
  price_before_rut: number;
  rut_deduction: number | null;
  total_price: number;
  terms: string | null;
  status: OfferStatus | null;
  valid_until: string;
  created_at: string;
  partner?: {
    company_name: string;
    contact_email: string;
    contact_phone: string;
  };
}

interface Partner {
  id: string;
  company_name: string;
  status: string | null;
}

interface QuoteDetailDialogProps {
  quote: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const QuoteDetailDialog = ({
  quote,
  open,
  onOpenChange,
  onUpdate,
}: QuoteDetailDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [availablePartners, setAvailablePartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [formData, setFormData] = useState<Partial<QuoteRequest>>({});

  useEffect(() => {
    if (quote) {
      setFormData({ ...quote });
      fetchOffers();
      fetchAvailablePartners();
    }
  }, [quote]);

  const fetchOffers = async () => {
    if (!quote) return;

    const { data, error } = await supabase
      .from("offers")
      .select("*, partner:partners(company_name, contact_email, contact_phone)")
      .eq("quote_request_id", quote.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOffers(data as unknown as Offer[]);
    }
  };

  const fetchAvailablePartners = async () => {
    const { data } = await supabase
      .from("partners")
      .select("id, company_name, status")
      .eq("status", "approved")
      .order("company_name");

    if (data) {
      setAvailablePartners(data);
    }
  };

  const handleSaveQuote = async () => {
    if (!quote) return;
    setLoading(true);

    const { error } = await supabase
      .from("quote_requests")
      .update({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        from_address: formData.from_address,
        from_postal_code: formData.from_postal_code,
        to_address: formData.to_address,
        to_postal_code: formData.to_postal_code,
        move_date: formData.move_date,
        move_start_time: formData.move_start_time,
        dwelling_type: formData.dwelling_type,
        area_m2: formData.area_m2,
        rooms: formData.rooms,
        stairs_from: formData.stairs_from,
        stairs_to: formData.stairs_to,
        carry_from_m: formData.carry_from_m,
        carry_to_m: formData.carry_to_m,
        packing_hours: formData.packing_hours,
        assembly_hours: formData.assembly_hours,
        notes: formData.notes,
        parking_restrictions: formData.parking_restrictions,
        status: formData.status as QuoteStatus,
      })
      .eq("id", quote.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringar",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sparat", description: "Förfrågan har uppdaterats" });
      onUpdate();
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, status: OfferStatus) => {
    const { error } = await supabase
      .from("offers")
      .update({ status })
      .eq("id", offerId);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera offert",
        variant: "destructive",
      });
    } else {
      toast({ title: "Uppdaterat", description: `Offert ${status === 'approved' ? 'godkänd' : 'avvisad'}` });
      fetchOffers();
      onUpdate();
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna offert?")) return;

    const { error } = await supabase.from("offers").delete().eq("id", offerId);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort offert",
        variant: "destructive",
      });
    } else {
      toast({ title: "Borttaget", description: "Offerten har tagits bort" });
      fetchOffers();
      onUpdate();
    }
  };

  const handleAddPartnerToQuote = async () => {
    if (!quote || !selectedPartnerId) return;

    // Create a placeholder offer for the partner
    const { error } = await supabase.from("offers").insert({
      quote_request_id: quote.id,
      partner_id: selectedPartnerId,
      available_date: quote.move_date,
      time_window: "08:00-17:00",
      estimated_hours: 4,
      team_size: 2,
      price_before_rut: 0,
      total_price: 0,
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
    });

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte lägga till partner",
        variant: "destructive",
      });
    } else {
      toast({ title: "Tillagt", description: "Partner har lagts till på förfrågan" });
      setSelectedPartnerId("");
      fetchOffers();
      onUpdate();
    }
  };

  if (!quote) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    offers_received: "bg-blue-100 text-blue-800",
    offer_approved: "bg-green-100 text-green-800",
    completed: "bg-green-200 text-green-900",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Väntande",
    offers_received: "Offerter mottagna",
    offer_approved: "Offert godkänd",
    completed: "Genomförd",
    cancelled: "Avbruten",
    expired: "Utgången",
  };

  const offerStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    withdrawn: "bg-gray-100 text-gray-800",
  };

  const offerStatusLabels: Record<string, string> = {
    pending: "Väntande",
    approved: "Godkänd",
    rejected: "Avvisad",
    expired: "Utgången",
    withdrawn: "Återkallad",
  };

  // Filter out partners that already have offers on this quote
  const partnersWithOffers = offers.map((o) => o.partner_id);
  const filteredPartners = availablePartners.filter(
    (p) => !partnersWithOffers.includes(p.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Förfrågan: {quote.customer_name}
            <Badge className={statusColors[quote.status || "pending"]}>
              {statusLabels[quote.status || "pending"]}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detaljer</TabsTrigger>
            <TabsTrigger value="offers">
              Offerter ({offers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Customer Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Kundinformation
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Namn</Label>
                  <Input
                    value={formData.customer_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>E-post</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      value={formData.customer_email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Telefon</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      value={formData.customer_phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, customer_phone: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Kontaktpreferens</Label>
                  <Select
                    value={formData.contact_preference || "email"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, contact_preference: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-post</SelectItem>
                      <SelectItem value="phone">Telefon</SelectItem>
                      <SelectItem value="both">Båda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresser
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Från-adress</Label>
                  <Input
                    value={formData.from_address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, from_address: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Postnummer"
                    value={formData.from_postal_code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, from_postal_code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Till-adress</Label>
                  <Input
                    value={formData.to_address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, to_address: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Postnummer"
                    value={formData.to_postal_code || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, to_postal_code: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Move Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Home className="h-4 w-4" />
                Flyttdetaljer
              </h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <Label>Flyttdatum</Label>
                  <Input
                    type="date"
                    value={formData.move_date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, move_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Starttid</Label>
                  <Input
                    value={formData.move_start_time || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, move_start_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Bostadstyp</Label>
                  <Input
                    value={formData.dwelling_type || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dwelling_type: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Area (m²)</Label>
                  <Input
                    type="number"
                    value={formData.area_m2 || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, area_m2: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <Label>Rum</Label>
                  <Input
                    type="number"
                    value={formData.rooms || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Trappor (från)</Label>
                  <Input
                    type="number"
                    value={formData.stairs_from || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, stairs_from: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Trappor (till)</Label>
                  <Input
                    type="number"
                    value={formData.stairs_to || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, stairs_to: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status || "pending"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as QuoteStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Väntande</SelectItem>
                      <SelectItem value="offers_received">Offerter mottagna</SelectItem>
                      <SelectItem value="offer_approved">Offert godkänd</SelectItem>
                      <SelectItem value="completed">Genomförd</SelectItem>
                      <SelectItem value="cancelled">Avbruten</SelectItem>
                      <SelectItem value="expired">Utgången</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Carry Distances */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Bärvägar & Parkering
              </h3>
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <Label>Bärväg från (meter)</Label>
                  <Input
                    type="number"
                    value={formData.carry_from_m || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, carry_from_m: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Bärväg till (meter)</Label>
                  <Input
                    type="number"
                    value={formData.carry_to_m || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, carry_to_m: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="parking_restrictions"
                      checked={formData.parking_restrictions || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, parking_restrictions: checked as boolean })
                      }
                    />
                    <Label htmlFor="parking_restrictions">Parkeringsrestriktioner</Label>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="home_visit"
                      checked={formData.home_visit_requested || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, home_visit_requested: checked as boolean })
                      }
                    />
                    <Label htmlFor="home_visit">Hembesök önskas</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Tilläggstjänster
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Packningstimmar</Label>
                  <Input
                    type="number"
                    value={formData.packing_hours || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, packing_hours: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Monteringstimmar</Label>
                  <Input
                    type="number"
                    value={formData.assembly_hours || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, assembly_hours: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Heavy Items */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4" />
                Tunga föremål
              </h3>
              <div className="bg-secondary/30 rounded-lg p-4">
                {formData.heavy_items && Array.isArray(formData.heavy_items) && (formData.heavy_items as string[]).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData.heavy_items as string[]).map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Inga tunga föremål angivna</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Anteckningar från kund
              </h3>
              <Textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Kundens anteckningar..."
              />
            </div>

            {/* Metadata */}
            <div className="bg-secondary/20 rounded-lg p-4 text-sm text-muted-foreground">
              <div className="grid sm:grid-cols-2 gap-2">
                <p>Skapad: {new Date(quote.created_at).toLocaleString('sv-SE')}</p>
                {quote.updated_at && (
                  <p>Uppdaterad: {new Date(quote.updated_at).toLocaleString('sv-SE')}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveQuote} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Sparar..." : "Spara ändringar"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6 mt-4">
            {/* Add Partner */}
            <div className="bg-secondary/30 rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Lägg till partner på förfrågan
              </h4>
              <div className="flex gap-2">
                <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Välj partner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPartners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddPartnerToQuote}
                  disabled={!selectedPartnerId}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Lägg till
                </Button>
              </div>
              {filteredPartners.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Alla godkända partners har redan offerter på denna förfrågan
                </p>
              )}
            </div>

            {/* Offers List */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Inkomna offerter ({offers.length})
              </h4>

              {offers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Inga offerter ännu
                </p>
              ) : (
                offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold">
                            {offer.partner?.company_name || "Okänd partner"}
                          </h5>
                          <Badge className={offerStatusColors[offer.status || "pending"]}>
                            {offerStatusLabels[offer.status || "pending"]}
                          </Badge>
                        </div>
                        {offer.partner && (
                          <p className="text-sm text-muted-foreground">
                            {offer.partner.contact_email} | {offer.partner.contact_phone}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {offer.total_price.toLocaleString("sv-SE")} kr
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ({offer.price_before_rut.toLocaleString("sv-SE")} kr före RUT)
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(offer.available_date).toLocaleDateString("sv-SE")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{offer.time_window}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Team:</span>{" "}
                        {offer.team_size} personer
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tid:</span>{" "}
                        {offer.estimated_hours} timmar
                      </div>
                    </div>

                    {offer.terms && (
                      <p className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
                        <span className="font-medium">Villkor:</span> {offer.terms}
                      </p>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      {offer.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleUpdateOfferStatus(offer.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Godkänn
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleUpdateOfferStatus(offer.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Avvisa
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Ta bort
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
