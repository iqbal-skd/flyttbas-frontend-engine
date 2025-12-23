import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Ban,
  RotateCcw,
  Save,
  Building2,
  Phone,
  Mail,
  User,
  FileText,
  Shield,
  MapPin,
  Calendar,
} from "lucide-react";

interface Partner {
  id: string;
  company_name: string;
  org_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  traffic_license_number: string | null;
  traffic_license_valid_until: string | null;
  f_tax_certificate: boolean | null;
  insurance_company: string | null;
  insurance_policy_number: string | null;
  insurance_valid_until: string | null;
  max_drive_distance_km: number | null;
  service_postal_codes: string[] | null;
  status: string | null;
  status_reason: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  completed_jobs: number | null;
  is_sponsored: boolean | null;
  sponsored_until: string | null;
  created_at: string;
  updated_at: string;
}

interface PartnerDetailDialogProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  userId?: string;
}

export const PartnerDetailDialog = ({
  partner,
  open,
  onOpenChange,
  onUpdate,
  userId,
}: PartnerDetailDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  
  const [formData, setFormData] = useState<Partial<Partner>>({});

  const handleEdit = () => {
    if (partner) {
      setFormData({ ...partner });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!partner) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("partners")
      .update({
        company_name: formData.company_name,
        org_number: formData.org_number,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        traffic_license_number: formData.traffic_license_number,
        traffic_license_valid_until: formData.traffic_license_valid_until,
        f_tax_certificate: formData.f_tax_certificate,
        insurance_company: formData.insurance_company,
        insurance_policy_number: formData.insurance_policy_number,
        insurance_valid_until: formData.insurance_valid_until,
        max_drive_distance_km: formData.max_drive_distance_km,
        service_postal_codes: formData.service_postal_codes,
        is_sponsored: formData.is_sponsored,
        sponsored_until: formData.sponsored_until,
        updated_at: new Date().toISOString(),
      })
      .eq("id", partner.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte spara ändringarna.",
      });
    } else {
      toast({
        title: "Sparad",
        description: "Partnerinformationen har uppdaterats.",
      });
      setIsEditing(false);
      onUpdate();
    }
  };

  const updateStatus = async (
    newStatus: "pending" | "approved" | "rejected" | "more_info_requested" | "suspended",
    reason?: string
  ) => {
    if (!partner) return;

    const { error } = await supabase
      .from("partners")
      .update({
        status: newStatus,
        status_reason: reason || null,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", partner.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte uppdatera status.",
      });
    } else {
      const statusLabels: Record<string, string> = {
        pending: "väntande",
        approved: "godkänd",
        rejected: "avvisad",
        more_info_requested: "begärt mer info",
        suspended: "avstängd",
      };
      toast({
        title: "Status uppdaterad",
        description: `Partner har markerats som ${statusLabels[newStatus]}.`,
      });
      setStatusReason("");
      onUpdate();
      onOpenChange(false);
    }
  };

  if (!partner) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    more_info_requested: "bg-blue-100 text-blue-800",
    suspended: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Väntande",
    approved: "Godkänd",
    rejected: "Avvisad",
    more_info_requested: "Begärt mer info",
    suspended: "Avstängd",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">{partner.company_name}</DialogTitle>
              <Badge className={statusColors[partner.status || "pending"]}>
                {statusLabels[partner.status || "pending"]}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            Org.nr: {partner.org_number} | Registrerad: {new Date(partner.created_at).toLocaleDateString("sv-SE")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Actions */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Statusåtgärder
            </h4>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {partner.status !== "approved" && (
                  <Button size="sm" onClick={() => updateStatus("approved")}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Godkänn
                  </Button>
                )}
                {partner.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => updateStatus("rejected", statusReason)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Avvisa
                  </Button>
                )}
                {partner.status !== "more_info_requested" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus("more_info_requested", statusReason)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Begär mer info
                  </Button>
                )}
                {partner.status !== "suspended" && partner.status === "approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-600 hover:text-orange-700"
                    onClick={() => updateStatus("suspended", statusReason)}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Stäng av
                  </Button>
                )}
                {(partner.status === "rejected" || partner.status === "suspended") && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus("pending")}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Återställ till väntande
                  </Button>
                )}
              </div>
              <div>
                <Label htmlFor="statusReason" className="text-sm text-muted-foreground">
                  Anledning (valfritt)
                </Label>
                <Textarea
                  id="statusReason"
                  placeholder="Ange anledning för statusändring..."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              {partner.status_reason && (
                <p className="text-sm text-muted-foreground">
                  <strong>Senaste anledning:</strong> {partner.status_reason}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Company Info */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Företagsinformation
              </h4>
              {!isEditing ? (
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  Redigera
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Avbryt
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Sparar..." : "Spara"}
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Företagsnamn</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name || ""}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="org_number">Org.nummer</Label>
                  <Input
                    id="org_number"
                    value={formData.org_number || ""}
                    onChange={(e) => setFormData({ ...formData, org_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_name">Kontaktperson</Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name || ""}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_email">E-post</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email || ""}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Telefon</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone || ""}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="max_drive_distance_km">Max körningssträcka (km)</Label>
                  <Input
                    id="max_drive_distance_km"
                    type="number"
                    value={formData.max_drive_distance_km || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, max_drive_distance_km: parseInt(e.target.value) || null })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.company_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Org.nr: {partner.org_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{partner.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Max {partner.max_drive_distance_km || 50} km</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Licenses & Insurance */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tillstånd & Försäkring
            </h4>
            {isEditing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="traffic_license_number">Trafiktillståndsnummer</Label>
                  <Input
                    id="traffic_license_number"
                    value={formData.traffic_license_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, traffic_license_number: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="traffic_license_valid_until">Giltigt t.o.m.</Label>
                  <Input
                    id="traffic_license_valid_until"
                    type="date"
                    value={formData.traffic_license_valid_until || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, traffic_license_valid_until: e.target.value || null })
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="f_tax_certificate"
                    checked={formData.f_tax_certificate || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, f_tax_certificate: checked })
                    }
                  />
                  <Label htmlFor="f_tax_certificate">F-skattsedel</Label>
                </div>
                <div>
                  <Label htmlFor="insurance_company">Försäkringsbolag</Label>
                  <Input
                    id="insurance_company"
                    value={formData.insurance_company || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, insurance_company: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_policy_number">Försäkringsnummer</Label>
                  <Input
                    id="insurance_policy_number"
                    value={formData.insurance_policy_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, insurance_policy_number: e.target.value || null })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_valid_until">Försäkring giltig t.o.m.</Label>
                  <Input
                    id="insurance_valid_until"
                    type="date"
                    value={formData.insurance_valid_until || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, insurance_valid_until: e.target.value || null })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  {partner.f_tax_certificate && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      F-skatt ✓
                    </Badge>
                  )}
                  {partner.traffic_license_number && (
                    <Badge variant="outline">
                      Trafiktillstånd: {partner.traffic_license_number}
                      {partner.traffic_license_valid_until &&
                        ` (giltig t.o.m. ${new Date(partner.traffic_license_valid_until).toLocaleDateString("sv-SE")})`}
                    </Badge>
                  )}
                  {partner.insurance_company && (
                    <Badge variant="outline">
                      Försäkring: {partner.insurance_company}
                      {partner.insurance_policy_number && ` (${partner.insurance_policy_number})`}
                    </Badge>
                  )}
                </div>
                {!partner.f_tax_certificate &&
                  !partner.traffic_license_number &&
                  !partner.insurance_company && (
                    <p className="text-muted-foreground">Inga tillstånd registrerade</p>
                  )}
              </div>
            )}
          </div>

          <Separator />

          {/* Sponsorship */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Sponsring
            </h4>
            {isEditing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_sponsored"
                    checked={formData.is_sponsored || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_sponsored: checked })
                    }
                  />
                  <Label htmlFor="is_sponsored">Sponsrad partner</Label>
                </div>
                <div>
                  <Label htmlFor="sponsored_until">Sponsrad t.o.m.</Label>
                  <Input
                    id="sponsored_until"
                    type="datetime-local"
                    value={formData.sponsored_until?.slice(0, 16) || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sponsored_until: e.target.value || null })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm">
                {partner.is_sponsored ? (
                  <Badge className="bg-purple-100 text-purple-800">
                    Sponsrad{" "}
                    {partner.sponsored_until &&
                      `t.o.m. ${new Date(partner.sponsored_until).toLocaleDateString("sv-SE")}`}
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">Ej sponsrad</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Stats */}
          <div>
            <h4 className="font-medium mb-3">Statistik</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-2xl font-bold">{partner.completed_jobs || 0}</p>
                <p className="text-xs text-muted-foreground">Utförda jobb</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-2xl font-bold">{partner.average_rating?.toFixed(1) || "–"}</p>
                <p className="text-xs text-muted-foreground">Snittbetyg</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-2xl font-bold">{partner.total_reviews || 0}</p>
                <p className="text-xs text-muted-foreground">Omdömen</p>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          {partner.service_postal_codes && partner.service_postal_codes.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Serviceområden (postnummer)
                </h4>
                <div className="flex flex-wrap gap-1">
                  {partner.service_postal_codes.map((code) => (
                    <Badge key={code} variant="secondary" className="text-xs">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
