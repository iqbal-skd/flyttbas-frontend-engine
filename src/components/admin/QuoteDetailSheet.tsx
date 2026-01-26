/**
 * QuoteDetailSheet - Professional side sheet for quote details
 * Uses shared components, hooks, and utilities for consistency
 */

import { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  Package,
  Truck,
  MessageSquare,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Star,
  DollarSign,
  Eye,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// Import shared modules
import type { QuoteRequest, OfferWithPartner, QuoteStatus, OfferStatus } from "./types";
import { QUOTE_STATUS_CONFIG, OFFER_STATUS_CONFIG } from "./constants";
import { formatDate, formatDateTime, formatCurrency, getDaysUntil } from "./utils";
import { useQuoteOffers, useAvailablePartners } from "./hooks";
import {
  AdminStatusBadge,
  UrgencyBadge,
  ContactCard,
  AddressCard,
  ConfirmDialog,
  StatsCard,
  LoadingButton,
} from "./ui";

interface QuoteDetailSheetProps {
  quote: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  onViewOffer?: (offer: OfferWithPartner) => void;
}

export const QuoteDetailSheet = ({
  quote,
  open,
  onOpenChange,
  onUpdate,
  onViewOffer,
}: QuoteDetailSheetProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<QuoteRequest>>({});
  const [expandedOffers, setExpandedOffers] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  // Confirm dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; offerId: string | null }>({
    open: false,
    offerId: null,
  });

  // Use custom hooks
  const {
    offers,
    loading: offersLoading,
    updateOfferStatus,
    deleteOffer,
    addPartnerToQuote,
    refetch: refetchOffers,
  } = useQuoteOffers({ quoteId: quote?.id || null, enabled: open && !!quote });

  const existingPartnerIds = useMemo(
    () => offers.map((o) => o.partner_id),
    [offers]
  );

  const { partners: availablePartners } = useAvailablePartners({
    enabled: open && !!quote,
    excludePartnerIds: existingPartnerIds,
  });

  // Reset form when quote changes
  useEffect(() => {
    if (quote && open) {
      setFormData({ ...quote });
      setIsEditing(false);
      setExpandedOffers(new Set());
    }
  }, [quote, open]);

  // Computed values
  const daysUntilMove = quote ? getDaysUntil(quote.move_date) : 0;
  const quoteAge = quote
    ? Math.ceil((Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleSaveQuote = async () => {
    if (!quote) return;
    setIsSaving(true);

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
        flexible_days: formData.flexible_days,
        dwelling_type: formData.dwelling_type,
        area_m2: formData.area_m2,
        rooms: formData.rooms,
        stairs_from: formData.stairs_from,
        stairs_to: formData.stairs_to,
        elevator_from_size: formData.elevator_from_size,
        elevator_to_size: formData.elevator_to_size,
        packing_hours: formData.packing_hours,
        assembly_hours: formData.assembly_hours,
        notes: formData.notes,
        parking_restrictions: formData.parking_restrictions,
        home_visit_requested: formData.home_visit_requested,
        contact_preference: formData.contact_preference,
        status: formData.status as "pending" | "offers_received" | "offer_approved" | "completed" | "cancelled" | "expired",
        updated_at: new Date().toISOString(),
      })
      .eq("id", quote.id);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte spara ändringar",
        variant: "destructive",
      });
    } else {
      toast({ title: "Sparat", description: "Förfrågan har uppdaterats" });
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    if (!quote) return;

    const { error } = await supabase
      .from("quote_requests")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", quote.id);

    if (!error) {
      setFormData((prev) => ({ ...prev, status: newStatus }));
      toast({
        title: "Status uppdaterad",
        description: `Status ändrad till ${QUOTE_STATUS_CONFIG[newStatus].label}`,
      });
      onUpdate();
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, status: OfferStatus) => {
    const success = await updateOfferStatus(offerId, status);
    if (success) onUpdate();
  };

  const handleDeleteOffer = async () => {
    if (!deleteConfirm.offerId) return;
    const success = await deleteOffer(deleteConfirm.offerId);
    if (success) onUpdate();
    setDeleteConfirm({ open: false, offerId: null });
  };

  const handleAddPartner = async () => {
    if (!quote || !selectedPartnerId) return;
    const success = await addPartnerToQuote(selectedPartnerId, { move_date: quote.move_date });
    if (success) {
      setSelectedPartnerId("");
      onUpdate();
    }
  };

  const toggleOfferExpanded = (offerId: string) => {
    setExpandedOffers((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      return next;
    });
  };

  if (!quote) return null;

  const currentStatus = (formData.status || quote.status || "pending") as QuoteStatus;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col h-full">
          <SheetHeader className="p-6 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <SheetTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 shrink-0" />
                  <span className="truncate">{quote.customer_name}</span>
                </SheetTitle>
                <SheetDescription className="mt-1">
                  Förfrågan skapad {formatDate(quote.created_at)}
                </SheetDescription>
              </div>
              <AdminStatusBadge status={currentStatus} type="quote" />
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview">Översikt</TabsTrigger>
                <TabsTrigger value="details">Detaljer</TabsTrigger>
                <TabsTrigger value="offers">Offerter ({offers.length})</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4 pb-6">
                {/* Urgency Warning */}
                {quote.move_date && <UrgencyBadge date={quote.move_date} />}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatsCard
                    value={daysUntilMove < 0 ? "Passerad" : daysUntilMove}
                    label={daysUntilMove < 0 ? "" : "dagar kvar"}
                    icon={Calendar}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                  />
                  <StatsCard
                    value={offers.length}
                    label="Offerter"
                    icon={FileText}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                  />
                  <StatsCard
                    value={quote.area_m2}
                    label="m²"
                    icon={Home}
                    iconColor="text-purple-600"
                    iconBgColor="bg-purple-100"
                  />
                  <StatsCard
                    value={quoteAge}
                    label="dagar sedan"
                    icon={Clock}
                    iconColor="text-gray-600"
                    iconBgColor="bg-gray-100"
                  />
                </div>

                {/* Status Change */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={currentStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(QUOTE_STATUS_CONFIG).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Customer Contact */}
                <ContactCard
                  name={quote.customer_name}
                  email={quote.customer_email}
                  phone={quote.customer_phone}
                  preference={quote.contact_preference}
                  title="Kontaktuppgifter"
                />

                {/* Addresses */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <AddressCard
                    title="Från"
                    address={quote.from_address}
                    postalCode={quote.from_postal_code}
                    lat={quote.from_lat}
                    lng={quote.from_lng}
                    stairs={quote.stairs_from}
                    elevatorSize={quote.elevator_from_size}
                  />
                  <AddressCard
                    title="Till"
                    address={quote.to_address}
                    postalCode={quote.to_postal_code}
                    lat={quote.to_lat}
                    lng={quote.to_lng}
                    stairs={quote.stairs_to}
                    elevatorSize={quote.elevator_to_size}
                  />
                </div>

                {/* Move Details Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Flyttinformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Flyttdatum</p>
                        <p className="font-medium">{formatDate(quote.move_date)}</p>
                      </div>
                      {quote.move_start_time && (
                        <div>
                          <p className="text-xs text-muted-foreground">Starttid</p>
                          <p className="font-medium">
                            {quote.move_start_time}
                            {quote.flexible_days && (
                              <span className="text-muted-foreground ml-1">(±{quote.flexible_days} {quote.flexible_days === 1 ? 'dag' : 'dagar'})</span>
                            )}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Bostadstyp</p>
                        <p className="font-medium">{quote.dwelling_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Area</p>
                        <p className="font-medium">{quote.area_m2} m²</p>
                      </div>
                      {quote.rooms && (
                        <div>
                          <p className="text-xs text-muted-foreground">Rum</p>
                          <p className="font-medium">{quote.rooms}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {quote.parking_restrictions && (
                        <Badge variant="outline" className="bg-yellow-50">
                          Parkeringsrestriktioner
                        </Badge>
                      )}
                      {quote.home_visit_requested && (
                        <Badge variant="outline" className="bg-blue-50">
                          Hembesök önskas
                        </Badge>
                      )}
                      {(quote.packing_hours || 0) > 0 && (
                        <Badge variant="secondary">Packning: Ja</Badge>
                      )}
                      {(quote.assembly_hours || 0) > 0 && (
                        <Badge variant="secondary">Montering: Ja</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Heavy Items */}
                {quote.heavy_items && Array.isArray(quote.heavy_items) && quote.heavy_items.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Tunga föremål
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {quote.heavy_items.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {quote.notes && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Anteckningar från kund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{quote.notes}</p>
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
                          setFormData({ ...quote });
                          setIsEditing(false);
                        }}
                      >
                        Avbryt
                      </Button>
                      <LoadingButton
                        size="sm"
                        onClick={handleSaveQuote}
                        loading={isSaving}
                        loadingText="Sparar..."
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Spara
                      </LoadingButton>
                    </div>
                  )}
                </div>

                {/* Form sections (Customer, Addresses, Move Details, etc.) */}
                <CustomerInfoSection
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  quote={quote}
                />
                <AddressesSection
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  quote={quote}
                />
                <MoveDetailsSection
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  quote={quote}
                />
                <ServicesSection
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  quote={quote}
                />
                <NotesSection
                  formData={formData}
                  setFormData={setFormData}
                  isEditing={isEditing}
                  quote={quote}
                />
                <MetadataSection quote={quote} />
              </TabsContent>

              {/* Offers Tab */}
              <TabsContent value="offers" className="mt-4 space-y-4 pb-6">
                {/* Add Partner */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Lägg till partner
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Välj partner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePartners.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id}>
                              {partner.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddPartner} disabled={!selectedPartnerId}>
                        <Plus className="h-4 w-4 mr-1" />
                        Lägg till
                      </Button>
                    </div>
                    {availablePartners.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Alla godkända partners har redan offerter på denna förfrågan
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Offers List */}
                <OffersList
                  offers={offers}
                  expandedOffers={expandedOffers}
                  toggleOfferExpanded={toggleOfferExpanded}
                  onUpdateStatus={handleUpdateOfferStatus}
                  onDelete={(offerId) => setDeleteConfirm({ open: true, offerId })}
                  onViewOffer={onViewOffer}
                />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, offerId: open ? deleteConfirm.offerId : null })}
        onConfirm={handleDeleteOffer}
        title="Ta bort offert"
        description="Är du säker på att du vill ta bort denna offert? Åtgärden kan inte ångras."
        confirmLabel="Ta bort"
        variant="danger"
      />
    </>
  );
};

// Sub-components for form sections
interface SectionProps {
  formData: Partial<QuoteRequest>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<QuoteRequest>>>;
  isEditing: boolean;
  quote: QuoteRequest;
}

function CustomerInfoSection({ formData, setFormData, isEditing, quote }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Kundinformation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Namn</Label>
              <Input
                value={formData.customer_name || ""}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
            </div>
            <div>
              <Label>E-post</Label>
              <Input
                type="email"
                value={formData.customer_email || ""}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input
                value={formData.customer_phone || ""}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Kontaktpreferens</Label>
              <Select
                value={formData.contact_preference || "email"}
                onValueChange={(value) =>
                  setFormData({ ...formData, contact_preference: value as "email" | "phone" | "both" })
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
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Namn</p>
              <p className="font-medium">{quote.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">E-post</p>
              <p className="font-medium">{quote.customer_email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Telefon</p>
              <p className="font-medium">{quote.customer_phone || "–"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kontaktpreferens</p>
              <p className="font-medium">
                {quote.contact_preference === "email"
                  ? "E-post"
                  : quote.contact_preference === "phone"
                  ? "Telefon"
                  : quote.contact_preference === "both"
                  ? "Båda"
                  : "–"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddressesSection({ formData, setFormData, isEditing, quote }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresser
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground">FRÅN-ADRESS</Label>
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="sm:col-span-2">
                  <Label>Adress</Label>
                  <Input
                    value={formData.from_address || ""}
                    onChange={(e) => setFormData({ ...formData, from_address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Postnummer</Label>
                  <Input
                    value={formData.from_postal_code || ""}
                    onChange={(e) => setFormData({ ...formData, from_postal_code: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Trappor</Label>
                  <Input
                    type="number"
                    value={formData.stairs_from || ""}
                    onChange={(e) => setFormData({ ...formData, stairs_from: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Hiss</Label>
                  <Select
                    value={formData.elevator_from_size || "none"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, elevator_from_size: value === "none" ? null : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ingen hiss</SelectItem>
                      <SelectItem value="small">Liten hiss</SelectItem>
                      <SelectItem value="big">Stor hiss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <Label className="text-xs font-medium text-muted-foreground">TILL-ADRESS</Label>
              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="sm:col-span-2">
                  <Label>Adress</Label>
                  <Input
                    value={formData.to_address || ""}
                    onChange={(e) => setFormData({ ...formData, to_address: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Postnummer</Label>
                  <Input
                    value={formData.to_postal_code || ""}
                    onChange={(e) => setFormData({ ...formData, to_postal_code: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Trappor</Label>
                  <Input
                    type="number"
                    value={formData.stairs_to || ""}
                    onChange={(e) => setFormData({ ...formData, stairs_to: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Hiss</Label>
                  <Select
                    value={formData.elevator_to_size || "none"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, elevator_to_size: value === "none" ? null : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ingen hiss</SelectItem>
                      <SelectItem value="small">Liten hiss</SelectItem>
                      <SelectItem value="big">Stor hiss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Från</p>
              <p className="font-medium">{quote.from_address}, {quote.from_postal_code}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-muted-foreground">Trappor: {quote.stairs_from || 0}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  Hiss: {quote.elevator_from_size ? (quote.elevator_from_size === "small" ? "Liten" : "Stor") : "Ingen"}
                </span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Till</p>
              <p className="font-medium">{quote.to_address}, {quote.to_postal_code}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-muted-foreground">Trappor: {quote.stairs_to || 0}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  Hiss: {quote.elevator_to_size ? (quote.elevator_to_size === "small" ? "Liten" : "Stor") : "Ingen"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MoveDetailsSection({ formData, setFormData, isEditing, quote }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Home className="h-4 w-4" />
          Flyttdetaljer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Flyttdatum</Label>
              <Input
                type="date"
                value={formData.move_date || ""}
                onChange={(e) => setFormData({ ...formData, move_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Starttid</Label>
              <Input
                value={formData.move_start_time || ""}
                onChange={(e) => setFormData({ ...formData, move_start_time: e.target.value })}
                placeholder="t.ex. 08:00"
              />
            </div>
            <div>
              <Label>Bostadstyp</Label>
              <Input
                value={formData.dwelling_type || ""}
                onChange={(e) => setFormData({ ...formData, dwelling_type: e.target.value })}
              />
            </div>
            <div>
              <Label>Area (m²)</Label>
              <Input
                type="number"
                value={formData.area_m2 || ""}
                onChange={(e) => setFormData({ ...formData, area_m2: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Rum</Label>
              <Input
                type="number"
                value={formData.rooms || ""}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Flyttdatum</p>
              <p className="font-medium">{formatDate(quote.move_date)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Starttid</p>
              <p className="font-medium">{quote.move_start_time || "–"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bostadstyp</p>
              <p className="font-medium">{quote.dwelling_type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Area</p>
              <p className="font-medium">{quote.area_m2} m²</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rum</p>
              <p className="font-medium">{quote.rooms || "–"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServicesSection({ formData, setFormData, isEditing, quote }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Package className="h-4 w-4" />
          Tjänster & Logistik
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="packing_service"
                  checked={(formData.packing_hours || 0) > 0}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, packing_hours: checked ? 1 : 0 })
                  }
                />
                <Label htmlFor="packing_service">Packning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="assembly_service"
                  checked={(formData.assembly_hours || 0) > 0}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, assembly_hours: checked ? 1 : 0 })
                  }
                />
                <Label htmlFor="assembly_service">Montering</Label>
              </div>
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
        ) : (
          <div className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Packning</p>
                <p className="font-medium">{(quote.packing_hours || 0) > 0 ? "Ja" : "Nej"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Montering</p>
                <p className="font-medium">{(quote.assembly_hours || 0) > 0 ? "Ja" : "Nej"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {quote.parking_restrictions && <Badge variant="outline">Parkeringsrestriktioner</Badge>}
              {quote.home_visit_requested && <Badge variant="outline">Hembesök önskas</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotesSection({ formData, setFormData, isEditing, quote }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Anteckningar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Anteckningar från kund..."
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{quote.notes || "Inga anteckningar"}</p>
        )}
      </CardContent>
    </Card>
  );
}

function MetadataSection({ quote }: { quote: QuoteRequest }) {
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
            <p className="text-xs text-muted-foreground">Förfrågan ID</p>
            <p className="font-mono text-xs">{quote.id}</p>
          </div>
          {quote.customer_id && (
            <div>
              <p className="text-xs text-muted-foreground">Kund ID</p>
              <p className="font-mono text-xs">{quote.customer_id}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Skapad</p>
            <p className="font-medium">{formatDateTime(quote.created_at)}</p>
          </div>
          {quote.updated_at && (
            <div>
              <p className="text-xs text-muted-foreground">Uppdaterad</p>
              <p className="font-medium">{formatDateTime(quote.updated_at)}</p>
            </div>
          )}
          {quote.expires_at && (
            <div>
              <p className="text-xs text-muted-foreground">Går ut</p>
              <p className="font-medium">{formatDateTime(quote.expires_at)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Offers List Component
interface OffersListProps {
  offers: OfferWithPartner[];
  expandedOffers: Set<string>;
  toggleOfferExpanded: (offerId: string) => void;
  onUpdateStatus: (offerId: string, status: OfferStatus) => void;
  onDelete: (offerId: string) => void;
  onViewOffer?: (offer: OfferWithPartner) => void;
}

function OffersList({
  offers,
  expandedOffers,
  toggleOfferExpanded,
  onUpdateStatus,
  onDelete,
  onViewOffer,
}: OffersListProps) {
  if (offers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Inga offerter ännu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2 text-sm">
        <Truck className="h-4 w-4" />
        Inkomna offerter ({offers.length})
      </h4>

      {offers.map((offer) => (
        <Card key={offer.id} className="overflow-hidden">
          <Collapsible
            open={expandedOffers.has(offer.id)}
            onOpenChange={() => toggleOfferExpanded(offer.id)}
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold">
                      {offer.partner?.company_name || "Okänd partner"}
                    </h5>
                    <AdminStatusBadge status={offer.status || "pending"} type="offer" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {offer.partner?.average_rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {offer.partner.average_rating.toFixed(1)}
                        {offer.partner.total_reviews && <span>({offer.partner.total_reviews})</span>}
                      </span>
                    )}
                    {offer.partner?.completed_jobs && (
                      <span>{offer.partner.completed_jobs} jobb</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(offer.total_price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(offer.price_before_rut)} före RUT
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>{formatDate(offer.available_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{offer.time_window}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span>{offer.team_size} pers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{offer.estimated_hours} tim</span>
                </div>
              </div>

              {/* Expand Button */}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground">
                  {expandedOffers.has(offer.id) ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Dölj detaljer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Visa detaljer
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="px-4 pb-4 pt-0 space-y-3 border-t bg-muted/30">
                {/* Contact Info */}
                {offer.partner && (
                  <div className="grid sm:grid-cols-2 gap-2 pt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={`mailto:${offer.partner.contact_email}`}
                        className="text-primary hover:underline"
                      >
                        {offer.partner.contact_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <a
                        href={`tel:${offer.partner.contact_phone}`}
                        className="text-primary hover:underline"
                      >
                        {offer.partner.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Logistics */}
                {(offer.distance_km || offer.drive_time_minutes || offer.ranking_score) && (
                  <div className="flex flex-wrap gap-2">
                    {offer.distance_km && (
                      <Badge variant="outline">{offer.distance_km.toFixed(1)} km</Badge>
                    )}
                    {offer.drive_time_minutes && (
                      <Badge variant="outline">{offer.drive_time_minutes} min körning</Badge>
                    )}
                    {offer.ranking_score && (
                      <Badge variant="outline">Ranking: {offer.ranking_score.toFixed(2)}</Badge>
                    )}
                  </div>
                )}

                {/* RUT Deduction */}
                {(offer.rut_deduction || 0) > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">RUT-avdrag: </span>
                    <span className="font-medium">{formatCurrency(offer.rut_deduction || 0)}</span>
                  </div>
                )}

                {/* Terms */}
                {offer.terms && (
                  <div className="text-sm bg-background p-2 rounded border">
                    <span className="text-muted-foreground">Villkor: </span>
                    {offer.terms}
                  </div>
                )}

                {/* Valid Until */}
                <div className="text-xs text-muted-foreground">
                  Giltig t.o.m. {formatDate(offer.valid_until)}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {offer.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onUpdateStatus(offer.id, "approved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Godkänn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => onUpdateStatus(offer.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Avvisa
                      </Button>
                    </>
                  )}
                  {onViewOffer && (
                    <Button size="sm" variant="outline" onClick={() => onViewOffer(offer)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Visa detaljer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 ml-auto"
                    onClick={() => onDelete(offer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Ta bort
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
