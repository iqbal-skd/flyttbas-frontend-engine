import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCommissionSettings } from "@/hooks/use-commission-settings";
import { COMMISSION, type CommissionType } from "@/lib/constants";
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
  Star,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Copy,
  Percent,
  Banknote,
} from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Partner = Tables<"partners">;

interface PartnerOffer {
  id: string;
  total_price: number;
  status: string | null;
  job_status: string | null;
  created_at: string;
  quote_requests: {
    customer_name: string;
    from_address: string;
    to_address: string;
    move_date: string;
  } | null;
}

interface PartnerReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

interface PartnerCommission {
  id: string;
  order_value: number;
  fee_amount: number;
  fee_percentage: number | null;
  invoice_number: string | null;
  invoice_paid_at: string | null;
  created_at: string;
}

interface PartnerDetailSheetProps {
  partner: Partner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  userId?: string;
}

export const PartnerDetailSheet = ({
  partner,
  open,
  onOpenChange,
  onUpdate,
  userId,
}: PartnerDetailSheetProps) => {
  const { toast } = useToast();
  const { systemRate, systemType, updatePartnerSettings, getPartnerRate } = useCommissionSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [statusReason, setStatusReason] = useState("");
  const [formData, setFormData] = useState<Partial<Partner>>({});
  const [offers, setOffers] = useState<PartnerOffer[]>([]);
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [commissions, setCommissions] = useState<PartnerCommission[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Local state for commission settings input
  const [customCommissionRate, setCustomCommissionRate] = useState<number | null>(null);
  const [customCommissionType, setCustomCommissionType] = useState<CommissionType | null>(null);
  const [savingCommission, setSavingCommission] = useState(false);

  // Calculate effective commission using the hook
  const effectiveCommission = partner
    ? getPartnerRate(partner.id, customCommissionRate, customCommissionType)
    : { rate: systemRate, type: systemType };

  useEffect(() => {
    if (partner && open) {
      fetchPartnerData();
      // Set the local custom settings from partner data
      setCustomCommissionRate(partner.commission_rate_override ?? null);
      setCustomCommissionType((partner.commission_type_override as CommissionType) ?? null);
    }
  }, [partner, open]);

  const handleSaveCommissionSettings = async () => {
    if (!partner) return;

    setSavingCommission(true);
    const success = await updatePartnerSettings(partner.id, customCommissionRate, customCommissionType);
    if (success) {
      onUpdate();
    }
    setSavingCommission(false);
  };

  const handleResetCommissionSettings = async () => {
    if (!partner) return;

    setSavingCommission(true);
    const success = await updatePartnerSettings(partner.id, null, null);
    if (success) {
      setCustomCommissionRate(null);
      setCustomCommissionType(null);
      onUpdate();
    }
    setSavingCommission(false);
  };

  const fetchPartnerData = async () => {
    if (!partner) return;
    setLoadingData(true);

    try {
      // Fetch offers
      const { data: offersData } = await supabase
        .from("offers")
        .select(`
          id, total_price, status, job_status, created_at,
          quote_requests(customer_name, from_address, to_address, move_date)
        `)
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (offersData) setOffers(offersData as PartnerOffer[]);

      // Fetch reviews (without trying to join on profiles since customer_id relationship doesn't exist)
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, customer_id")
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (reviewsData) {
        // Map to expected format with placeholder profile data
        const mappedReviews = reviewsData.map(r => ({
          ...r,
          profiles: { full_name: "Kund", email: "" }
        }));
        setReviews(mappedReviews as PartnerReview[]);
      }

      // Fetch commissions
      const { data: commissionsData } = await supabase
        .from("commission_fees")
        .select("id, order_value, fee_amount, fee_percentage, invoice_number, invoice_paid_at, created_at")
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (commissionsData) setCommissions(commissionsData);
    } catch (error) {
      console.error("Error fetching partner data:", error);
    } finally {
      setLoadingData(false);
    }
  };

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
        address: formData.address,
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
      return;
    }

    // Send notification emails based on status change
    if (newStatus === "approved" || newStatus === "more_info_requested") {
      try {
        const emailType = newStatus === "approved" ? "partner_approved" : "partner_more_info";
        await supabase.functions.invoke("send-confirmation-email", {
          body: {
            type: emailType,
            email: partner.contact_email,
            name: partner.contact_name,
            companyName: partner.company_name,
            statusReason: reason,
          },
        });
      } catch (emailErr) {
        console.error("Error sending notification email:", emailErr);
      }
    }

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
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopierad", description: "Kopierad till urklipp" });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Calculate statistics
  const totalRevenue = commissions.reduce((sum, c) => sum + c.order_value, 0);
  const totalCommission = commissions.reduce((sum, c) => sum + c.fee_amount, 0);
  const approvedOffers = offers.filter(o => o.status === "approved").length;
  const completedJobs = offers.filter(o => o.job_status === "completed").length;

  // Check for expiring documents
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const warnings: string[] = [];
  if (partner.traffic_license_valid_until) {
    const expiryDate = new Date(partner.traffic_license_valid_until);
    if (expiryDate < today) warnings.push("Trafiktillstånd har gått ut!");
    else if (expiryDate < thirtyDaysFromNow) warnings.push("Trafiktillstånd går ut snart");
  }
  if (partner.insurance_valid_until) {
    const expiryDate = new Date(partner.insurance_valid_until);
    if (expiryDate < today) warnings.push("Försäkring har gått ut!");
    else if (expiryDate < thirtyDaysFromNow) warnings.push("Försäkring går ut snart");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {partner.company_name}
              </SheetTitle>
              <SheetDescription className="mt-1">
                Org.nr: {partner.org_number}
              </SheetDescription>
            </div>
            <Badge className={statusColors[partner.status || "pending"]}>
              {statusLabels[partner.status || "pending"]}
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview">Översikt</TabsTrigger>
              <TabsTrigger value="details">Detaljer</TabsTrigger>
              <TabsTrigger value="activity">Aktivitet</TabsTrigger>
              <TabsTrigger value="finance">Ekonomi</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Warnings */}
              {warnings.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Varningar</p>
                        <ul className="text-sm text-amber-700 mt-1">
                          {warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{partner.completed_jobs || 0}</p>
                    <p className="text-xs text-muted-foreground">Jobb</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">
                      {partner.average_rating ? partner.average_rating.toFixed(1) : "–"}
                    </p>
                    <p className="text-xs text-muted-foreground">Betyg</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{partner.total_reviews || 0}</p>
                    <p className="text-xs text-muted-foreground">Omdömen</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString("sv-SE")}</p>
                    <p className="text-xs text-muted-foreground">Omsättning (kr)</p>
                  </CardContent>
                </Card>
              </div>

              {/* Status Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Statusåtgärder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
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
                        Återställ
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Anledning (valfritt)</Label>
                    <Textarea
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
                </CardContent>
              </Card>

              {/* Contact Info Quick View */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Kontaktuppgifter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{partner.contact_name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => copyToClipboard(partner.contact_name)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${partner.contact_email}`} className="text-primary hover:underline">
                        {partner.contact_email}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => copyToClipboard(partner.contact_email)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${partner.contact_phone}`} className="text-primary hover:underline">
                        {partner.contact_phone}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => copyToClipboard(partner.contact_phone)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {partner.address && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{partner.address}</span>
                      </div>
                      {partner.address_lat && partner.address_lng && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          asChild
                        >
                          <a
                            href={`https://maps.google.com/?q=${partner.address_lat},${partner.address_lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              {reviews.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Senaste omdömen
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-b last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Edit Toggle */}
              <div className="flex justify-end">
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

              {/* Company Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Företagsinformation
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <Label htmlFor="address">Adress</Label>
                        <Input
                          id="address"
                          value={formData.address || ""}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                      <div>
                        <p className="text-xs text-muted-foreground">Företagsnamn</p>
                        <p className="font-medium">{partner.company_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Organisationsnummer</p>
                        <p className="font-medium">{partner.org_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Kontaktperson</p>
                        <p className="font-medium">{partner.contact_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">E-post</p>
                        <p className="font-medium">{partner.contact_email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Telefon</p>
                        <p className="font-medium">{partner.contact_phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Adress</p>
                        <p className="font-medium">{partner.address || "Ej angiven"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Max körningssträcka</p>
                        <p className="font-medium">{partner.max_drive_distance_km || 50} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Koordinater</p>
                        <p className="font-medium">
                          {partner.address_lat && partner.address_lng
                            ? `${partner.address_lat.toFixed(4)}, ${partner.address_lng.toFixed(4)}`
                            : "Ej angivna"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Licenses & Insurance */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Tillstånd & Försäkring
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">F-skattsedel</p>
                          <p className="font-medium">
                            {partner.f_tax_certificate ? (
                              <Badge className="bg-green-100 text-green-800">Ja</Badge>
                            ) : (
                              <Badge variant="outline">Nej</Badge>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Trafiktillstånd</p>
                          <p className="font-medium">{partner.traffic_license_number || "Ej angivet"}</p>
                          {partner.traffic_license_valid_until && (
                            <p className="text-xs text-muted-foreground">
                              Giltig t.o.m. {formatDate(partner.traffic_license_valid_until)}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Försäkringsbolag</p>
                          <p className="font-medium">{partner.insurance_company || "Ej angivet"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Försäkringsnummer</p>
                          <p className="font-medium">{partner.insurance_policy_number || "Ej angivet"}</p>
                          {partner.insurance_valid_until && (
                            <p className="text-xs text-muted-foreground">
                              Giltig t.o.m. {formatDate(partner.insurance_valid_until)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sponsorship */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Sponsring
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                        <div>
                          <Badge className="bg-purple-100 text-purple-800">Sponsrad</Badge>
                          {partner.sponsored_until && (
                            <p className="text-muted-foreground mt-1">
                              t.o.m. {formatDateTime(partner.sponsored_until)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Ej sponsrad</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Areas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Serviceområden (postnummer)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {partner.service_postal_codes && partner.service_postal_codes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {partner.service_postal_codes.map((code) => (
                        <Badge key={code} variant="secondary" className="text-xs">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Inga specifika områden angivna</p>
                  )}
                </CardContent>
              </Card>

              {/* System Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Systeminformation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Partner ID</p>
                      <p className="font-mono text-xs">{partner.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User ID</p>
                      <p className="font-mono text-xs">{partner.user_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Registrerad</p>
                      <p className="font-medium">{formatDateTime(partner.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Senast uppdaterad</p>
                      <p className="font-medium">{formatDateTime(partner.updated_at)}</p>
                    </div>
                    {partner.reviewed_at && (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">Granskad</p>
                          <p className="font-medium">{formatDateTime(partner.reviewed_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Granskad av</p>
                          <p className="font-mono text-xs">{partner.reviewed_by || "–"}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-4 space-y-4">
              {/* Recent Offers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Senaste offerter ({offers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p className="text-sm text-muted-foreground">Laddar...</p>
                  ) : offers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Inga offerter ännu</p>
                  ) : (
                    <div className="space-y-3">
                      {offers.map((offer) => (
                        <div key={offer.id} className="border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">
                                {offer.quote_requests?.customer_name || "Okänd kund"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {offer.quote_requests?.from_address} → {offer.quote_requests?.to_address}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Flyttdatum: {offer.quote_requests?.move_date
                                  ? formatDate(offer.quote_requests.move_date)
                                  : "–"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{offer.total_price.toLocaleString("sv-SE")} kr</p>
                              <div className="flex gap-1 justify-end mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {offer.status || "pending"}
                                </Badge>
                                {offer.job_status && (
                                  <Badge variant="secondary" className="text-xs">
                                    {offer.job_status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* All Reviews */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Alla omdömen ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p className="text-sm text-muted-foreground">Laddar...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Inga omdömen ännu</p>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm">{review.comment}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            – {review.profiles?.full_name || review.profiles?.email || "Anonym"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Finance Tab */}
            <TabsContent value="finance" className="mt-4 space-y-4">
              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">Total omsättning</span>
                    </div>
                    <p className="text-2xl font-bold">{totalRevenue.toLocaleString("sv-SE")} kr</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Total provision</span>
                    </div>
                    <p className="text-2xl font-bold">{totalCommission.toLocaleString("sv-SE")} kr</p>
                  </CardContent>
                </Card>
              </div>

              {/* Commission Rate Override */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Provisionssats för denna partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Effektiv provision</p>
                      <p className="text-xs text-muted-foreground">
                        {(customCommissionRate !== null || customCommissionType !== null) ? "Anpassad" : "Systemstandard"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {effectiveCommission.rate}{effectiveCommission.type === "fixed" ? " SEK" : "%"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {COMMISSION.TYPE_LABELS[effectiveCommission.type]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Systemets standard: {systemRate}{systemType === "fixed" ? " SEK" : "%"} ({COMMISSION.TYPE_LABELS[systemType]})
                      </Label>
                    </div>

                    {/* Commission Type Selection */}
                    <div>
                      <Label className="text-sm">Anpassad provisionstyp</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant={customCommissionType === null ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCustomCommissionType(null)}
                          className="flex-1"
                        >
                          Standard
                        </Button>
                        <Button
                          type="button"
                          variant={customCommissionType === "percentage" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCustomCommissionType("percentage")}
                          className="flex-1"
                        >
                          <Percent className="h-3 w-3 mr-1" />
                          Procent
                        </Button>
                        <Button
                          type="button"
                          variant={customCommissionType === "fixed" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCustomCommissionType("fixed")}
                          className="flex-1"
                        >
                          <Banknote className="h-3 w-3 mr-1" />
                          Fast
                        </Button>
                      </div>
                    </div>

                    {/* Commission Rate Input */}
                    <div>
                      <Label htmlFor="customRate" className="text-sm">
                        Anpassat belopp/sats
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="customRate"
                          type="number"
                          min={COMMISSION.MIN_RATE}
                          max={(customCommissionType ?? effectiveCommission.type) === "fixed" ? COMMISSION.MAX_FIXED : COMMISSION.MAX_RATE}
                          step={(customCommissionType ?? effectiveCommission.type) === "fixed" ? "1" : "0.1"}
                          placeholder={`Standard: ${systemRate}`}
                          value={customCommissionRate ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomCommissionRate(val === "" ? null : parseFloat(val));
                          }}
                          className="w-28"
                        />
                        <span className="text-muted-foreground">
                          {(customCommissionType ?? effectiveCommission.type) === "fixed" ? "SEK" : "%"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveCommissionSettings}
                        disabled={savingCommission}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {savingCommission ? "Sparar..." : "Spara"}
                      </Button>

                      {(customCommissionRate !== null || customCommissionType !== null) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetCommissionSettings}
                          disabled={savingCommission}
                          className="text-muted-foreground"
                        >
                          Återställ till standard
                        </Button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      Anpassa provision för denna partner. Lämna tomt för systemstandard.
                      Procentprovision beräknas på ordervärdet före RUT-avdrag.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Commission History */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Provisionshistorik ({commissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p className="text-sm text-muted-foreground">Laddar...</p>
                  ) : commissions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Inga provisioner ännu</p>
                  ) : (
                    <div className="space-y-3">
                      {commissions.map((commission) => (
                        <div key={commission.id} className="border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm">
                                Ordervärde: {commission.order_value.toLocaleString("sv-SE")} kr
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(commission.created_at)}
                                {commission.fee_percentage && ` • ${commission.fee_percentage}%`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">
                                {commission.fee_amount.toLocaleString("sv-SE")} kr
                              </p>
                              {commission.invoice_number ? (
                                <Badge variant="outline" className="text-xs">
                                  {commission.invoice_number}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Ej fakturerad
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
