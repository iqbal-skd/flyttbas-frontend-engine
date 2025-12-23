import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Star,
  Save,
  Truck,
} from "lucide-react";

type OfferStatus = "pending" | "approved" | "rejected" | "expired" | "withdrawn";

interface Offer {
  id: string;
  quote_request_id: string;
  partner_id: string;
  available_date: string;
  time_window: string;
  estimated_hours: number;
  team_size: number;
  price_before_rut: number;
  rut_deduction: number | null;
  total_price: number;
  terms: string | null;
  valid_until: string;
  status: OfferStatus | null;
  distance_km: number | null;
  drive_time_minutes: number | null;
  ranking_score: number | null;
  created_at: string;
  updated_at: string;
}

interface Partner {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  average_rating: number | null;
  total_reviews: number | null;
  completed_jobs: number | null;
}

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  from_address: string;
  to_address: string;
  move_date: string;
}

interface OfferDetailDialogProps {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function OfferDetailDialog({
  offer,
  open,
  onOpenChange,
  onUpdate,
}: OfferDetailDialogProps) {
  const { toast } = useToast();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [formData, setFormData] = useState({
    available_date: "",
    time_window: "",
    estimated_hours: 0,
    team_size: 0,
    price_before_rut: 0,
    rut_deduction: 0,
    total_price: 0,
    terms: "",
    valid_until: "",
    distance_km: 0,
    drive_time_minutes: 0,
    ranking_score: 0,
  });
  const [status, setStatus] = useState<OfferStatus>("pending");

  useEffect(() => {
    if (offer) {
      setFormData({
        available_date: offer.available_date,
        time_window: offer.time_window,
        estimated_hours: offer.estimated_hours,
        team_size: offer.team_size,
        price_before_rut: offer.price_before_rut,
        rut_deduction: offer.rut_deduction || 0,
        total_price: offer.total_price,
        terms: offer.terms || "",
        valid_until: offer.valid_until?.split("T")[0] || "",
        distance_km: offer.distance_km || 0,
        drive_time_minutes: offer.drive_time_minutes || 0,
        ranking_score: offer.ranking_score || 0,
      });
      setStatus((offer.status as OfferStatus) || "pending");
      fetchRelatedData();
    }
  }, [offer]);

  const fetchRelatedData = async () => {
    if (!offer) return;

    // Fetch partner details
    const { data: partnerData } = await supabase
      .from("partners")
      .select("id, company_name, contact_name, contact_email, contact_phone, average_rating, total_reviews, completed_jobs")
      .eq("id", offer.partner_id)
      .single();

    if (partnerData) {
      setPartner(partnerData);
    }

    // Fetch quote request details
    const { data: quoteData } = await supabase
      .from("quote_requests")
      .select("id, customer_name, customer_email, from_address, to_address, move_date")
      .eq("id", offer.quote_request_id)
      .single();

    if (quoteData) {
      setQuoteRequest(quoteData);
    }
  };

  const handleSave = async () => {
    if (!offer) return;

    const { error } = await supabase
      .from("offers")
      .update({
        available_date: formData.available_date,
        time_window: formData.time_window,
        estimated_hours: formData.estimated_hours,
        team_size: formData.team_size,
        price_before_rut: formData.price_before_rut,
        rut_deduction: formData.rut_deduction,
        total_price: formData.total_price,
        terms: formData.terms || null,
        valid_until: formData.valid_until,
        distance_km: formData.distance_km,
        drive_time_minutes: formData.drive_time_minutes,
        ranking_score: formData.ranking_score,
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", offer.id);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringar: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sparat",
        description: "Offertendetaljer har uppdaterats",
      });
      onUpdate();
      onOpenChange(false);
    }
  };

  const handleStatusChange = async (newStatus: OfferStatus) => {
    if (!offer) return;

    const { error } = await supabase
      .from("offers")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", offer.id);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera status: " + error.message,
        variant: "destructive",
      });
    } else {
      setStatus(newStatus);
      toast({
        title: "Status uppdaterad",
        description: `Offertens status ändrad till ${statusLabels[newStatus]}`,
      });
      onUpdate();
    }
  };

  if (!offer) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    withdrawn: "bg-orange-100 text-orange-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Väntande",
    approved: "Godkänd",
    rejected: "Avvisad",
    expired: "Utgången",
    withdrawn: "Återkallad",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Offertdetaljer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Aktuell status:</span>
              <Badge className={statusColors[status]}>
                {statusLabels[status]}
              </Badge>
            </div>
            <Select value={status} onValueChange={(v) => handleStatusChange(v as OfferStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Väntande</SelectItem>
                <SelectItem value="approved">Godkänd</SelectItem>
                <SelectItem value="rejected">Avvisad</SelectItem>
                <SelectItem value="expired">Utgången</SelectItem>
                <SelectItem value="withdrawn">Återkallad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Partner Information */}
          {partner && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Partnerinformation
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Företagsnamn</p>
                  <p className="font-medium">{partner.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kontaktperson</p>
                  <p className="font-medium">{partner.contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-post</p>
                  <p className="font-medium">{partner.contact_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{partner.contact_phone}</p>
                </div>
                <div className="flex items-center gap-4 col-span-2">
                  {partner.average_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{partner.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({partner.total_reviews} omdömen)
                      </span>
                    </div>
                  )}
                  {partner.completed_jobs && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>{partner.completed_jobs} genomförda jobb</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quote Request Information */}
          {quoteRequest && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Kopplad förfrågan
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Kund</p>
                  <p className="font-medium">{quoteRequest.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-post</p>
                  <p className="font-medium">{quoteRequest.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Från</p>
                  <p className="font-medium">{quoteRequest.from_address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Till</p>
                  <p className="font-medium">{quoteRequest.to_address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Önskat flyttdatum</p>
                  <p className="font-medium">
                    {new Date(quoteRequest.move_date).toLocaleDateString("sv-SE")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Offer Details - Editable */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Offertdetaljer (redigerbar)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Tillgängligt datum
                </Label>
                <Input
                  type="date"
                  value={formData.available_date}
                  onChange={(e) =>
                    setFormData({ ...formData, available_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tidsfönster
                </Label>
                <Input
                  value={formData.time_window}
                  onChange={(e) =>
                    setFormData({ ...formData, time_window: e.target.value })
                  }
                  placeholder="t.ex. 08:00-12:00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Uppskattade timmar
                </Label>
                <Input
                  type="number"
                  value={formData.estimated_hours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_hours: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Antal i team
                </Label>
                <Input
                  type="number"
                  value={formData.team_size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      team_size: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <h4 className="font-medium">Prissättning</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Pris före RUT (kr)</Label>
                <Input
                  type="number"
                  value={formData.price_before_rut}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_before_rut: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>RUT-avdrag (kr)</Label>
                <Input
                  type="number"
                  value={formData.rut_deduction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rut_deduction: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Totalt pris (kr)</Label>
                <Input
                  type="number"
                  value={formData.total_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_price: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <Separator />

            <h4 className="font-medium">Logistik</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Avstånd (km)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      distance_km: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Körtid (minuter)</Label>
                <Input
                  type="number"
                  value={formData.drive_time_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      drive_time_minutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Ranking-poäng</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ranking_score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ranking_score: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Giltig till</Label>
              <Input
                type="date"
                value={formData.valid_until}
                onChange={(e) =>
                  setFormData({ ...formData, valid_until: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Villkor</Label>
              <Textarea
                value={formData.terms}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
                placeholder="Eventuella villkor för offerten..."
                rows={3}
              />
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground flex gap-4">
            <span>Skapad: {new Date(offer.created_at).toLocaleString("sv-SE")}</span>
            <span>Uppdaterad: {new Date(offer.updated_at).toLocaleString("sv-SE")}</span>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Spara ändringar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
