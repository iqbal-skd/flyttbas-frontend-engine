/**
 * OfferDetailSheet - Professional side sheet for offer details
 * Uses shared components, hooks, and utilities for consistency
 */

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Send,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// Import shared modules
import type { Offer, OfferStatus, JobStatus, PartnerDetails, QuoteSummary } from "./types";
import { OFFER_STATUS_CONFIG, JOB_STATUS_CONFIG } from "./constants";
import { formatDate, formatDateTime, formatCurrency, getDaysUntil } from "./utils";
import { useOfferDetails } from "./hooks";
import {
  AdminStatusBadge,
  ContactCard,
  StatsCard,
  LoadingButton,
} from "./ui";

interface OfferDetailSheetProps {
  offer: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const OfferDetailSheet = ({
  offer,
  open,
  onOpenChange,
  onUpdate,
}: OfferDetailSheetProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
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
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [jobNotes, setJobNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingJobStatus, setIsUpdatingJobStatus] = useState(false);

  // Use the hook for fetching related data
  const {
    partner,
    quote,
    loading: detailsLoading,
  } = useOfferDetails({
    offerId: offer?.id || null,
    enabled: open && !!offer,
  });

  // Reset form when offer changes
  useEffect(() => {
    if (offer && open) {
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
      setJobStatus(offer.job_status);
      setJobNotes(offer.job_notes || "");
      setIsEditing(false);
    }
  }, [offer, open]);

  const handleJobStatusChange = async (newJobStatus: JobStatus) => {
    if (!offer || !quote || !partner) return;

    setIsUpdatingJobStatus(true);

    const { error } = await supabase
      .from("offers")
      .update({
        job_status: newJobStatus,
        job_status_updated_at: new Date().toISOString(),
        job_notes: jobNotes || null,
      })
      .eq("id", offer.id);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera jobbstatus",
        variant: "destructive",
      });
      setIsUpdatingJobStatus(false);
      return;
    }

    // Send email notification
    try {
      await supabase.functions.invoke("send-job-status-notification", {
        body: {
          customerEmail: quote.customer_email,
          customerName: quote.customer_name,
          companyName: partner.company_name,
          newStatus: newJobStatus,
          moveDate: quote.move_date,
          fromAddress: quote.from_address,
          toAddress: quote.to_address,
          jobNotes: jobNotes || undefined,
        },
      });
    } catch (emailError) {
      console.error("Failed to send notification:", emailError);
    }

    setJobStatus(newJobStatus);
    setIsUpdatingJobStatus(false);
    toast({
      title: "Jobbstatus uppdaterad",
      description: "Kunden har notifierats via e-post",
    });
    onUpdate();
  };

  const handleSave = async () => {
    if (!offer) return;

    setIsSaving(true);

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

    setIsSaving(false);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringar: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sparat",
        description: "Offertdetaljer har uppdaterats",
      });
      setIsEditing(false);
      onUpdate();
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
        description: `Offertens status ändrad till ${OFFER_STATUS_CONFIG[newStatus].label}`,
      });
      onUpdate();
    }
  };

  if (!offer) return null;

  // Calculate days until available date
  const daysUntilAvailable = getDaysUntil(offer.available_date);

  // Check if offer is expired
  const isExpired = new Date(offer.valid_until) < new Date();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Offert
              </SheetTitle>
              <SheetDescription className="mt-1">
                {partner?.company_name || "Laddar..."}
              </SheetDescription>
            </div>
            <AdminStatusBadge status={status} type="offer" />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="overview">Översikt</TabsTrigger>
              <TabsTrigger value="details">Detaljer</TabsTrigger>
              <TabsTrigger value="job">Jobbstatus</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4 pb-6">
              {/* Warnings */}
              {isExpired && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Offert utgången</p>
                        <p className="text-sm text-amber-700">Giltighetstiden har passerat</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <StatsCard
                  value={formatCurrency(offer.total_price).replace(" kr", "")}
                  label="kr totalt"
                  icon={DollarSign}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-100"
                />
                <StatsCard
                  value={offer.team_size}
                  label="personer"
                  icon={Users}
                  iconColor="text-blue-600"
                  iconBgColor="bg-blue-100"
                />
                <StatsCard
                  value={offer.estimated_hours}
                  label="timmar"
                  icon={Clock}
                  iconColor="text-purple-600"
                  iconBgColor="bg-purple-100"
                />
                <StatsCard
                  value={daysUntilAvailable < 0 ? "Passerad" : daysUntilAvailable}
                  label={daysUntilAvailable < 0 ? "" : "dagar kvar"}
                  icon={Calendar}
                  iconColor="text-gray-600"
                  iconBgColor="bg-gray-100"
                />
              </div>

              {/* Status Change */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Offertstatus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={status} onValueChange={(v) => handleStatusChange(v as OfferStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OFFER_STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Partner Information */}
              {partner && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Partnerinformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Företagsnamn</p>
                        <p className="font-medium">{partner.company_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Kontaktperson</p>
                        <p className="font-medium">{partner.contact_name}</p>
                      </div>
                    </div>
                    <ContactCard
                      name=""
                      email={partner.contact_email}
                      phone={partner.contact_phone}
                      showTitle={false}
                    />
                    <div className="flex flex-wrap gap-3 pt-2">
                      {partner.average_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{partner.average_rating.toFixed(1)}</span>
                          <span className="text-muted-foreground text-sm">
                            ({partner.total_reviews || 0} omdömen)
                          </span>
                        </div>
                      )}
                      {partner.completed_jobs && (
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span>{partner.completed_jobs} genomförda jobb</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quote Request Summary */}
              {quote && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Kopplad förfrågan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Kund</p>
                        <p className="font-medium">{quote.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">E-post</p>
                        <p className="font-medium">{quote.customer_email}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Från</p>
                        <p className="font-medium">{quote.from_address}</p>
                        <p className="text-muted-foreground">{quote.from_postal_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Till</p>
                        <p className="font-medium">{quote.to_address}</p>
                        <p className="text-muted-foreground">{quote.to_postal_code}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Önskat flyttdatum</p>
                      <p className="font-medium">{formatDate(quote.move_date)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pricing Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Prissättning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pris före RUT</span>
                      <span className="font-medium">{formatCurrency(offer.price_before_rut)}</span>
                    </div>
                    {(offer.rut_deduction || 0) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>RUT-avdrag</span>
                        <span>-{formatCurrency(offer.rut_deduction || 0)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Totalt</span>
                      <span className="text-primary">{formatCurrency(offer.total_price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logistics */}
              {(offer.distance_km || offer.drive_time_minutes || offer.ranking_score) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Logistik
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {offer.distance_km && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{offer.distance_km.toFixed(1)} km</span>
                        </div>
                      )}
                      {offer.drive_time_minutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{offer.drive_time_minutes} min körning</span>
                        </div>
                      )}
                      {offer.ranking_score && (
                        <Badge variant="outline">Ranking: {offer.ranking_score.toFixed(2)}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Details Tab - Editable */}
            <TabsContent value="details" className="mt-4 space-y-4 pb-6">
              {/* Edit Toggle */}
              <div className="flex justify-end">
                {!isEditing ? (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    Redigera
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
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
                        }
                        setIsEditing(false);
                      }}
                    >
                      Avbryt
                    </Button>
                    <LoadingButton
                      size="sm"
                      onClick={handleSave}
                      loading={isSaving}
                      loadingText="Sparar..."
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Spara
                    </LoadingButton>
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <SchedulingSection
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                offer={offer}
              />

              {/* Team & Hours */}
              <TeamSection
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                offer={offer}
              />

              {/* Pricing */}
              <PricingSection
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                offer={offer}
              />

              {/* Logistics */}
              <LogisticsSection
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                offer={offer}
              />

              {/* Terms */}
              <TermsSection
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
                offer={offer}
              />

              {/* Metadata */}
              <MetadataSection offer={offer} />
            </TabsContent>

            {/* Job Status Tab */}
            <TabsContent value="job" className="mt-4 space-y-4 pb-6">
              {/* Only show if offer is approved */}
              {status !== "approved" ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Jobbstatus kan endast hanteras för godkända offerter.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Godkänn offerten först för att aktivera jobbspårning.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Current Job Status */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Aktuell jobbstatus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {jobStatus ? (
                        <Badge className={`${JOB_STATUS_CONFIG[jobStatus].color} text-base px-4 py-2`}>
                          {JOB_STATUS_CONFIG[jobStatus].label}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-base px-4 py-2">
                          Ej påbörjad
                        </Badge>
                      )}
                      {offer.job_status_updated_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Senast uppdaterad: {formatDateTime(offer.job_status_updated_at)}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Update Job Status */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Uppdatera jobbstatus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(Object.keys(JOB_STATUS_CONFIG) as JobStatus[]).map((js) => (
                          <Button
                            key={js}
                            variant={jobStatus === js ? "default" : "outline"}
                            size="sm"
                            className={jobStatus === js ? JOB_STATUS_CONFIG[js].color : ""}
                            onClick={() => handleJobStatusChange(js)}
                            disabled={isUpdatingJobStatus}
                          >
                            {JOB_STATUS_CONFIG[js].label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Notes */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Jobbanteckningar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        value={jobNotes}
                        onChange={(e) => setJobNotes(e.target.value)}
                        rows={4}
                        placeholder="Anteckningar om jobbet..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Anteckningar inkluderas i e-postmeddelanden till kunden vid statusuppdatering.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Email Notification Info */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Send className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">E-postnotifikation</p>
                          <p className="text-sm text-blue-700">
                            Kunden får automatiskt e-post när jobbstatus uppdateras.
                          </p>
                          {quote && (
                            <p className="text-sm text-blue-600 mt-1">
                              Skickas till: {quote.customer_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Sub-components for form sections
interface FormSectionProps {
  formData: {
    available_date: string;
    time_window: string;
    estimated_hours: number;
    team_size: number;
    price_before_rut: number;
    rut_deduction: number;
    total_price: number;
    terms: string;
    valid_until: string;
    distance_km: number;
    drive_time_minutes: number;
    ranking_score: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<FormSectionProps["formData"]>>;
  isEditing: boolean;
  offer: Offer;
}

function SchedulingSection({ formData, setFormData, isEditing, offer }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schemaläggning
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Tillgängligt datum</Label>
              <Input
                type="date"
                value={formData.available_date}
                onChange={(e) => setFormData({ ...formData, available_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Tidsfönster</Label>
              <Input
                value={formData.time_window}
                onChange={(e) => setFormData({ ...formData, time_window: e.target.value })}
                placeholder="t.ex. 08:00-12:00"
              />
            </div>
            <div>
              <Label>Giltig till</Label>
              <Input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Tillgängligt datum</p>
              <p className="font-medium">{formatDate(offer.available_date)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tidsfönster</p>
              <p className="font-medium">{offer.time_window}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Giltig till</p>
              <p className="font-medium">{formatDate(offer.valid_until)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamSection({ formData, setFormData, isEditing, offer }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team & Tid
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Antal i team</Label>
              <Input
                type="number"
                value={formData.team_size}
                onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Uppskattade timmar</Label>
              <Input
                type="number"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Antal i team</p>
              <p className="font-medium">{offer.team_size} personer</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Uppskattade timmar</p>
              <p className="font-medium">{offer.estimated_hours} timmar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PricingSection({ formData, setFormData, isEditing, offer }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Prissättning
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Pris före RUT (kr)</Label>
              <Input
                type="number"
                value={formData.price_before_rut}
                onChange={(e) =>
                  setFormData({ ...formData, price_before_rut: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>RUT-avdrag (kr)</Label>
              <Input
                type="number"
                value={formData.rut_deduction}
                onChange={(e) =>
                  setFormData({ ...formData, rut_deduction: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Totalt pris (kr)</Label>
              <Input
                type="number"
                value={formData.total_price}
                onChange={(e) =>
                  setFormData({ ...formData, total_price: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Pris före RUT</p>
              <p className="font-medium">{formatCurrency(offer.price_before_rut)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">RUT-avdrag</p>
              <p className="font-medium">{formatCurrency(offer.rut_deduction || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Totalt pris</p>
              <p className="font-medium text-primary">{formatCurrency(offer.total_price)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LogisticsSection({ formData, setFormData, isEditing, offer }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Logistik
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Avstånd (km)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.distance_km}
                onChange={(e) =>
                  setFormData({ ...formData, distance_km: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Körtid (minuter)</Label>
              <Input
                type="number"
                value={formData.drive_time_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, drive_time_minutes: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Ranking-poäng</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.ranking_score}
                onChange={(e) =>
                  setFormData({ ...formData, ranking_score: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Avstånd</p>
              <p className="font-medium">{(offer.distance_km || 0).toFixed(1)} km</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Körtid</p>
              <p className="font-medium">{offer.drive_time_minutes || 0} min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ranking-poäng</p>
              <p className="font-medium">{(offer.ranking_score || 0).toFixed(2)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TermsSection({ formData, setFormData, isEditing, offer }: FormSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Villkor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
            rows={4}
            placeholder="Eventuella villkor för offerten..."
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{offer.terms || "Inga villkor angivna"}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MetadataSection({ offer }: { offer: Offer }) {
  return (
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
            <p className="text-xs text-muted-foreground">Offert ID</p>
            <p className="font-mono text-xs">{offer.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Förfrågan ID</p>
            <p className="font-mono text-xs">{offer.quote_request_id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Skapad</p>
            <p className="font-medium">{formatDateTime(offer.created_at)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uppdaterad</p>
            <p className="font-medium">{formatDateTime(offer.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
