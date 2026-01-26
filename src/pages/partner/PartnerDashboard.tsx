import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DashboardLayout,
  DashboardHeader,
  LoadingSpinner,
  EmptyState,
  StatusBadge,
  JobDetailsCard,
} from "@/components/dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Send,
  MapPin,
  Calendar,
  AlertCircle,
  Package,
  Home,
  Building,
  Weight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  User,
  Mail,
  Phone,
  Truck,
  Car,
  ExternalLink,
  Route,
  MessageSquare,
} from "lucide-react";

interface Partner {
  id: string;
  company_name: string;
  status: string;
  status_reason: string | null;
  average_rating: number;
  total_reviews: number;
  completed_jobs: number;
  max_drive_distance_km: number | null;
  service_postal_codes: string[] | null;
}

interface QuoteRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  from_address: string;
  from_postal_code: string;
  from_lat: number | null;
  from_lng: number | null;
  to_address: string;
  to_postal_code: string;
  to_lat: number | null;
  to_lng: number | null;
  move_date: string;
  move_start_time: string | null;
  flexible_days: number | null;
  area_m2: number;
  rooms: number | null;
  dwelling_type: string;
  stairs_from: number | null;
  stairs_to: number | null;
  elevator_from_size: string | null;
  elevator_to_size: string | null;
  carry_from_m: number | null;
  carry_to_m: number | null;
  parking_restrictions: boolean | null;
  home_visit_requested: boolean | null;
  heavy_items: any;
  packing_hours: number | null;
  assembly_hours: number | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  quote_request_id: string;
  total_price: number;
  status: string;
  job_status: string | null;
  job_status_updated_at: string | null;
  job_notes: string | null;
  estimated_hours: number;
  team_size: number;
  time_window: string;
  created_at: string;
  quote_requests: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    contact_preference: string | null;
    from_address: string;
    from_postal_code: string;
    from_lat: number | null;
    from_lng: number | null;
    to_address: string;
    to_postal_code: string;
    to_lat: number | null;
    to_lng: number | null;
    move_date: string;
    move_start_time: string | null;
    flexible_days: number | null;
    dwelling_type: string;
    area_m2: number;
    rooms: number | null;
    stairs_from: number | null;
    stairs_to: number | null;
    elevator_from_size: string | null;
    elevator_to_size: string | null;
    carry_from_m: number | null;
    carry_to_m: number | null;
    parking_restrictions: boolean | null;
    home_visit_requested: boolean | null;
    heavy_items: any;
    packing_hours: number | null;
    assembly_hours: number | null;
    notes: string | null;
  } | null;
}

const jobStatusLabels: Record<string, string> = {
  confirmed: "Bekräftad",
  scheduled: "Schemalagd",
  in_progress: "Pågående",
  completed: "Genomförd",
  cancelled: "Avbokad",
};

const jobStatusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
};

const PartnerDashboard = () => {
  const { user, isPartner, loading, rolesLoaded, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [viewingQuote, setViewingQuote] = useState<QuoteRequest | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    total_price: "",
    estimated_hours: "",
    team_size: "2",
    time_window: "08:00-12:00",
    terms: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedApprovedOffer, setSelectedApprovedOffer] = useState<Offer | null>(null);
  const [jobDetailDialogOpen, setJobDetailDialogOpen] = useState(false);
  const [updatingJobStatus, setUpdatingJobStatus] = useState(false);
  const [jobStatusNote, setJobStatusNote] = useState("");

  const quotesWithOffers = new Set(myOffers.map(o => o.quote_request_id));

  useEffect(() => {
    if (!loading && rolesLoaded && (!user || !isPartner)) {
      navigate("/bli-partner");
    }
  }, [user, isPartner, loading, rolesLoaded, navigate]);

  useEffect(() => {
    if (user && rolesLoaded && isPartner) {
      fetchPartnerData();
    }
  }, [user, isPartner, rolesLoaded]);

  const fetchPartnerData = async () => {
    const { data: partnerData } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (partnerData) {
      setPartner(partnerData);
      if (partnerData.status === 'approved') {
        const { data: quotesData } = await supabase
          .from('quote_requests')
          .select('*')
          .in('status', ['pending', 'offers_received'])
          .order('created_at', { ascending: false });

        if (quotesData) {
          setQuotes(quotesData as unknown as QuoteRequest[]);
        }

        const { data: offersData } = await supabase
          .from('offers')
          .select('*, quote_requests(*)')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false });

        if (offersData) {
          setMyOffers(offersData as unknown as Offer[]);
        }
      }
    }
  };

  const handleViewDetails = (quote: QuoteRequest) => {
    setViewingQuote(quote);
    setDetailDialogOpen(true);
  };

  const handleOpenOfferForm = (quote: QuoteRequest) => {
    if (quotesWithOffers.has(quote.id)) {
      toast({
        variant: "destructive",
        title: "Offert redan skickad",
        description: "Du har redan lämnat en offert på denna förfrågan.",
      });
      return;
    }
    setSelectedQuote(quote);
    setOfferDialogOpen(true);
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote || !partner) return;

    if (quotesWithOffers.has(selectedQuote.id)) {
      toast({
        variant: "destructive",
        title: "Offert redan skickad",
        description: "Du har redan lämnat en offert på denna förfrågan.",
      });
      return;
    }

    setSubmitting(true);

    const totalPrice = parseInt(offerForm.total_price);
    const rutDeduction = Math.min(Math.floor(totalPrice * 0.5), 75000);
    const priceBeforeRut = totalPrice;

    try {
      const { error } = await supabase.from('offers').insert({
        quote_request_id: selectedQuote.id,
        partner_id: partner.id,
        total_price: totalPrice,
        price_before_rut: priceBeforeRut,
        rut_deduction: rutDeduction,
        estimated_hours: parseInt(offerForm.estimated_hours),
        team_size: parseInt(offerForm.team_size),
        available_date: selectedQuote.move_date,
        time_window: offerForm.time_window,
        terms: offerForm.terms || null,
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }).select().single();

      if (error) throw error;

      await supabase
        .from('quote_requests')
        .update({ status: 'offers_received' })
        .eq('id', selectedQuote.id);

      try {
        await supabase.functions.invoke('send-offer-notification', {
          body: {
            customerEmail: selectedQuote.customer_email,
            customerName: selectedQuote.customer_name,
            partnerName: partner.company_name,
            offerPrice: totalPrice,
            moveDate: selectedQuote.move_date,
            quoteId: selectedQuote.id,
          }
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }

      toast({
        title: "Offert skickad!",
        description: "Kunden har meddelats om din offert.",
      });

      setOfferDialogOpen(false);
      setSelectedQuote(null);
      setOfferForm({
        total_price: "",
        estimated_hours: "",
        team_size: "2",
        time_window: "08:00-12:00",
        terms: "",
      });
      fetchPartnerData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte skicka offert.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const formatHeavyItems = (items: any) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    // Map item keys to readable Swedish names
    const itemLabels: Record<string, string> = {
      'piano': 'Piano',
      'flygel': 'Flygel',
      'safe150': 'Kassaskåp >150 kg',
    };
    
    // Handle both string array format and object array format
    return items
      .filter((item: any) => {
        if (typeof item === 'string') return true;
        return item.quantity > 0;
      })
      .map((item: any) => {
        if (typeof item === 'string') {
          return itemLabels[item] || item;
        }
        return `${item.name}: ${item.quantity}`;
      })
      .join(', ');
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number | null,
    lng1: number | null,
    lat2: number | null,
    lng2: number | null
  ): number | null => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;

    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Round to 1 decimal
  };

  // Open Google Maps with directions
  const openGoogleMapsDirections = (
    fromLat: number | null,
    fromLng: number | null,
    toLat: number | null,
    toLng: number | null,
    fromAddress?: string,
    toAddress?: string
  ) => {
    let url: string;
    if (fromLat && fromLng && toLat && toLng) {
      // Use coordinates if available
      url = `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`;
    } else if (fromAddress && toAddress) {
      // Fallback to addresses
      url = `https://www.google.com/maps/dir/${encodeURIComponent(fromAddress)}/${encodeURIComponent(toAddress)}`;
    } else {
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Open single location in Google Maps
  const openGoogleMapsLocation = (
    lat: number | null,
    lng: number | null,
    address?: string
  ) => {
    let url: string;
    if (lat && lng) {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (address) {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    } else {
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenJobDetails = (offer: Offer) => {
    setSelectedApprovedOffer(offer);
    setJobStatusNote(offer.job_notes || "");
    setJobDetailDialogOpen(true);
  };

  const handleUpdateJobStatus = async (newStatus: string) => {
    if (!selectedApprovedOffer || !partner) return;
    
    setUpdatingJobStatus(true);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          job_status: newStatus as any,
          job_status_updated_at: new Date().toISOString(),
          job_notes: jobStatusNote || null
        })
        .eq('id', selectedApprovedOffer.id);

      if (error) throw error;

      if (selectedApprovedOffer.quote_requests) {
        try {
          await supabase.functions.invoke('send-job-status-notification', {
            body: {
              customerEmail: selectedApprovedOffer.quote_requests.customer_email,
              customerName: selectedApprovedOffer.quote_requests.customer_name,
              companyName: partner.company_name,
              newStatus: newStatus,
              moveDate: selectedApprovedOffer.quote_requests.move_date,
              fromAddress: selectedApprovedOffer.quote_requests.from_address,
              toAddress: selectedApprovedOffer.quote_requests.to_address,
              jobNotes: jobStatusNote || undefined,
            }
          });
        } catch (emailError) {
          console.error("Failed to send job status notification:", emailError);
        }
      }

      toast({
        title: "Status uppdaterad",
        description: `Jobbstatus har ändrats till ${jobStatusLabels[newStatus]}`,
      });

      fetchPartnerData();
      setJobDetailDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte uppdatera status.",
      });
    } finally {
      setUpdatingJobStatus(false);
    }
  };

  if (loading || !rolesLoaded) {
    return <LoadingSpinner />;
  }

  if (!partner) {
    return (
      <DashboardLayout title="Partner Dashboard">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Ingen partnerregistrering hittad</CardTitle>
              <CardDescription>
                Du har partnerrättigheter men ingen registrerad partnerprofil. Vänligen registrera dig som partner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/bli-partner")} className="w-full">
                Registrera dig som partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const statusMessages: Record<string, { message: string; variant: 'default' | 'destructive' | 'outline' }> = {
    pending: { message: "Din ansökan granskas. Vi återkommer inom 1-2 arbetsdagar.", variant: "outline" },
    more_info_requested: { message: "Vi behöver mer information. Kolla din e-post.", variant: "destructive" },
    rejected: { message: "Din ansökan har avslagits. Kontakta oss för mer information.", variant: "destructive" },
    suspended: { message: "Ditt konto är tillfälligt avstängt.", variant: "destructive" },
  };

  return (
    <DashboardLayout title="Partner Dashboard">
      <DashboardHeader
        title={partner.company_name}
        subtitle={`★ ${partner.average_rating.toFixed(1)} (${partner.total_reviews} omdömen) • ${partner.completed_jobs} genomförda jobb`}
        onSignOut={handleSignOut}
      />

      {partner.status !== 'approved' && statusMessages[partner.status] && (
        <div className="mb-8 space-y-4">
          <Card className={partner.status === 'more_info_requested' ? 'border-blue-200 bg-blue-50' : 'border-yellow-200 bg-yellow-50'}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 mt-0.5 ${partner.status === 'more_info_requested' ? 'text-blue-600' : 'text-yellow-600'}`} />
                <div className="flex-1">
                  <p className={partner.status === 'more_info_requested' ? 'text-blue-800' : 'text-yellow-800'}>
                    {statusMessages[partner.status].message}
                  </p>
                  {partner.status === 'more_info_requested' && partner.status_reason && (
                    <div className="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">Meddelande från administratören:</p>
                      <p className="text-blue-800">{partner.status_reason}</p>
                    </div>
                  )}
                  {partner.status === 'more_info_requested' && (
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/bli-partner?edit=true')}
                    >
                      Uppdatera din ansökan
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {partner.status === 'approved' && (
        <Tabs defaultValue="jobs">
          <TabsList className="mb-4">
            <TabsTrigger value="jobs" className="gap-2">
              <FileText className="h-4 w-4" />
              Tillgängliga jobb
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-2">
              <Send className="h-4 w-4" />
              Mina offerter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Nya förfrågningar</h2>
                <Badge variant="secondary">{quotes.length} aktiva</Badge>
              </div>
              
              {quotes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Inga nya förfrågningar just nu"
                  description="Nya jobb visas här när kunder skickar in förfrågningar som matchar ditt serviceområde."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {quotes.map((quote) => {
                    const hasOffer = quotesWithOffers.has(quote.id);
                    const distance = calculateDistance(
                      quote.from_lat,
                      quote.from_lng,
                      quote.to_lat,
                      quote.to_lng
                    );
                    const hasHeavyItems = quote.heavy_items && Array.isArray(quote.heavy_items) && quote.heavy_items.length > 0;
                    const totalStairs = (quote.stairs_from || 0) + (quote.stairs_to || 0);
                    const hasElevator = quote.elevator_from_size || quote.elevator_to_size;

                    return (
                      <Card
                        key={quote.id}
                        className={`relative overflow-hidden transition-all hover:shadow-lg ${hasOffer ? 'border-green-300 bg-green-50/50' : 'border-border hover:border-primary/30'}`}
                      >
                        {/* Date Header Banner */}
                        <div className={`px-4 py-3 ${hasOffer ? 'bg-green-100' : 'bg-gradient-to-r from-primary/10 to-primary/5'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-semibold text-foreground">
                                {new Date(quote.move_date).toLocaleDateString('sv-SE', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            {hasOffer ? (
                              <Badge className="bg-green-600 text-white text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Offert skickad
                              </Badge>
                            ) : quote.move_start_time && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {quote.move_start_time}
                                {quote.flexible_days && ` (±${quote.flexible_days}d)`}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-4">
                          {/* Route Section */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-200" />
                                <div className="w-0.5 h-6 bg-gradient-to-b from-blue-300 to-green-300" />
                                <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-200" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div>
                                  <p className="text-sm font-medium truncate" title={quote.from_address}>
                                    {quote.from_address}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{quote.from_postal_code}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium truncate" title={quote.to_address}>
                                    {quote.to_address}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{quote.to_postal_code}</p>
                                </div>
                              </div>
                              {distance && (
                                <div className="text-right">
                                  <p className="text-lg font-bold text-primary">{distance}</p>
                                  <p className="text-xs text-muted-foreground">km</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Property Info Grid */}
                          <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50">
                            <div className="text-center">
                              <Home className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                              <p className="text-sm font-semibold capitalize">{quote.dwelling_type}</p>
                            </div>
                            <div className="text-center border-x border-border/50">
                              <p className="text-lg font-bold text-primary">{quote.area_m2}</p>
                              <p className="text-xs text-muted-foreground">m²</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-primary">{quote.rooms || '-'}</p>
                              <p className="text-xs text-muted-foreground">rum</p>
                            </div>
                          </div>

                          {/* Quick Info Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {totalStairs > 0 && (
                              <Badge variant="outline" className="text-xs gap-1 bg-amber-50 border-amber-200 text-amber-700">
                                <Building className="h-3 w-3" />
                                {totalStairs} tr
                              </Badge>
                            )}
                            {hasElevator && (
                              <Badge variant="outline" className="text-xs gap-1 bg-green-50 border-green-200 text-green-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Hiss
                              </Badge>
                            )}
                            {quote.packing_hours > 0 && (
                              <Badge variant="outline" className="text-xs gap-1 bg-blue-50 border-blue-200 text-blue-700">
                                <Package className="h-3 w-3" />
                                Packning
                              </Badge>
                            )}
                            {quote.assembly_hours > 0 && (
                              <Badge variant="outline" className="text-xs gap-1 bg-purple-50 border-purple-200 text-purple-700">
                                <Package className="h-3 w-3" />
                                Montering
                              </Badge>
                            )}
                            {hasHeavyItems && (
                              <Badge variant="outline" className="text-xs gap-1 bg-red-50 border-red-200 text-red-700">
                                <Weight className="h-3 w-3" />
                                Tungt
                              </Badge>
                            )}
                            {quote.parking_restrictions && (
                              <Badge variant="outline" className="text-xs gap-1 bg-orange-50 border-orange-200 text-orange-700">
                                <Car className="h-3 w-3" />
                                Svår P
                              </Badge>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleViewDetails(quote)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detaljer
                            </Button>
                            {!hasOffer && (
                              <Button
                                size="sm"
                                className="flex-1 bg-primary hover:bg-primary/90"
                                onClick={() => handleOpenOfferForm(quote)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Offerera
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="offers">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Mina offerter</h2>
                <div className="flex gap-2">
                  <Badge variant="secondary">{myOffers.filter(o => o.status === 'pending').length} väntande</Badge>
                  <Badge className="bg-green-100 text-green-800">{myOffers.filter(o => o.status === 'approved').length} godkända</Badge>
                </div>
              </div>

              {myOffers.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="Du har inte skickat några offerter ännu"
                  description="Gå till 'Tillgängliga jobb' för att lämna offerter på nya förfrågningar."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {myOffers.map((offer) => {
                    const isApproved = offer.status === 'approved';
                    const isPending = offer.status === 'pending';
                    const isRejected = offer.status === 'rejected';
                    const quoteRequest = offer.quote_requests;
                    const distance = quoteRequest ? calculateDistance(
                      quoteRequest.from_lat,
                      quoteRequest.from_lng,
                      quoteRequest.to_lat,
                      quoteRequest.to_lng
                    ) : null;

                    return (
                      <Card
                        key={offer.id}
                        className={`relative overflow-hidden transition-all hover:shadow-lg ${
                          isApproved ? 'border-green-300 bg-gradient-to-br from-green-50 to-white' :
                          isRejected ? 'border-red-200 bg-red-50/30 opacity-75' :
                          'border-border hover:border-primary/30'
                        }`}
                      >
                        {/* Status Header Banner */}
                        <div className={`px-4 py-3 ${
                          isApproved ? 'bg-green-100' :
                          isRejected ? 'bg-red-100' :
                          'bg-gradient-to-r from-amber-50 to-orange-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {quoteRequest?.move_date && new Date(quoteRequest.move_date).toLocaleDateString('sv-SE', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            <StatusBadge status={offer.status} />
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-4">
                          {/* Price and Job Status Row */}
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Din offert</p>
                              <p className="text-2xl font-bold text-primary">{offer.total_price.toLocaleString('sv-SE')} kr</p>
                              <p className="text-xs text-muted-foreground">
                                {offer.estimated_hours}h • {offer.team_size} pers • {offer.time_window}
                              </p>
                            </div>
                            {isApproved && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Jobbstatus</p>
                                <Badge className={`${jobStatusColors[offer.job_status || 'confirmed'] || 'bg-gray-100 text-gray-800'}`}>
                                  {jobStatusLabels[offer.job_status || 'confirmed'] || 'Bekräftad'}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Customer Info (only for approved) */}
                          {isApproved && quoteRequest && (
                            <div className="bg-white rounded-lg p-3 border border-green-200 space-y-2">
                              <p className="text-xs font-semibold text-green-800 uppercase tracking-wide">Kund</p>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5 text-green-600" />
                                  <span className="font-medium">{quoteRequest.customer_name}</span>
                                </div>
                                <a href={`tel:${quoteRequest.customer_phone}`} className="flex items-center gap-1.5 text-green-700 hover:text-green-900">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>{quoteRequest.customer_phone}</span>
                                </a>
                                <a href={`mailto:${quoteRequest.customer_email}`} className="flex items-center gap-1.5 text-green-700 hover:text-green-900">
                                  <Mail className="h-3.5 w-3.5" />
                                  <span className="truncate max-w-[150px]">{quoteRequest.customer_email}</span>
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Route Section */}
                          {quoteRequest && (
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col items-center pt-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-green-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm truncate" title={quoteRequest.from_address}>
                                  {quoteRequest.from_address}, {quoteRequest.from_postal_code}
                                </p>
                                <p className="text-sm truncate" title={quoteRequest.to_address}>
                                  {quoteRequest.to_address}, {quoteRequest.to_postal_code}
                                </p>
                              </div>
                              {distance && (
                                <div className="text-right shrink-0">
                                  <p className="text-lg font-bold text-primary">{distance}</p>
                                  <p className="text-xs text-muted-foreground">km</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Property Quick Info */}
                          {quoteRequest && (
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className="text-xs capitalize">
                                <Home className="h-3 w-3 mr-1" />
                                {quoteRequest.dwelling_type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {quoteRequest.area_m2} m²
                              </Badge>
                              {quoteRequest.rooms && (
                                <Badge variant="secondary" className="text-xs">
                                  {quoteRequest.rooms} rum
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Pending Info */}
                          {isPending && (
                            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <p className="text-xs text-amber-800">Väntar på kundens beslut</p>
                            </div>
                          )}

                          {/* Action Button */}
                          {isApproved && (
                            <Button
                              onClick={() => handleOpenJobDetails(offer)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Hantera jobb
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      )}

      {/* Detail View Sheet - Slide-out panel for better UX */}
      <Sheet open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-bold">Förfrågningsdetaljer</SheetTitle>
            {viewingQuote && (
              <SheetDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Flytt den {new Date(viewingQuote.move_date).toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </SheetDescription>
            )}
          </SheetHeader>

          {viewingQuote && (
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-6">

                {/* Quick Overview Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{viewingQuote.area_m2}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Kvadratmeter</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{viewingQuote.rooms || '-'}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Rum</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary capitalize">{viewingQuote.dwelling_type}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Bostadstyp</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {calculateDistance(
                          viewingQuote.from_lat,
                          viewingQuote.from_lng,
                          viewingQuote.to_lat,
                          viewingQuote.to_lng
                        ) || '-'}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">km avstånd</p>
                    </div>
                  </div>
                </div>

                {/* Date and Time Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Clock className="h-4 w-4" />
                    Datum & Tid
                  </h3>
                  <Card className="border-0 shadow-sm bg-card/50">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Flyttdatum</span>
                        <span className="font-medium">
                          {new Date(viewingQuote.move_date).toLocaleDateString('sv-SE', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>
                      {viewingQuote.move_start_time && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Önskad starttid</span>
                          <span className="font-medium">
                            {viewingQuote.move_start_time}
                            {viewingQuote.flexible_days && (
                              <span className="text-muted-foreground ml-1">(±{viewingQuote.flexible_days} {viewingQuote.flexible_days === 1 ? 'dag' : 'dagar'})</span>
                            )}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Addresses Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <MapPin className="h-4 w-4" />
                    Adresser
                  </h3>
                  <div className="space-y-3">
                    {/* From Address */}
                    <Card
                      className="border-0 shadow-sm bg-card/50 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => openGoogleMapsLocation(
                        viewingQuote.from_lat,
                        viewingQuote.from_lng,
                        `${viewingQuote.from_address}, ${viewingQuote.from_postal_code}`
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-700 font-bold text-sm">A</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Från</p>
                            <p className="font-medium">{viewingQuote.from_address}</p>
                            <p className="text-sm text-muted-foreground">{viewingQuote.from_postal_code}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Distance indicator with directions button */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openGoogleMapsDirections(
                          viewingQuote.from_lat,
                          viewingQuote.from_lng,
                          viewingQuote.to_lat,
                          viewingQuote.to_lng,
                          `${viewingQuote.from_address}, ${viewingQuote.from_postal_code}`,
                          `${viewingQuote.to_address}, ${viewingQuote.to_postal_code}`
                        )}
                      >
                        <Route className="h-4 w-4" />
                        {calculateDistance(
                          viewingQuote.from_lat,
                          viewingQuote.from_lng,
                          viewingQuote.to_lat,
                          viewingQuote.to_lng
                        ) ? (
                          <span>
                            {calculateDistance(
                              viewingQuote.from_lat,
                              viewingQuote.from_lng,
                              viewingQuote.to_lat,
                              viewingQuote.to_lng
                            )} km
                          </span>
                        ) : (
                          <span>Visa rutt</span>
                        )}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    {/* To Address */}
                    <Card
                      className="border-0 shadow-sm bg-card/50 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => openGoogleMapsLocation(
                        viewingQuote.to_lat,
                        viewingQuote.to_lng,
                        `${viewingQuote.to_address}, ${viewingQuote.to_postal_code}`
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <span className="text-green-700 font-bold text-sm">B</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Till</p>
                            <p className="font-medium">{viewingQuote.to_address}</p>
                            <p className="text-sm text-muted-foreground">{viewingQuote.to_postal_code}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Access Details Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Building className="h-4 w-4" />
                    Tillgänglighet
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* From Location Access */}
                    <Card className="border-0 shadow-sm bg-card/50">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Från-adress</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {viewingQuote.elevator_from_size ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">
                                  {viewingQuote.elevator_from_size === 'big' || viewingQuote.elevator_from_size === 'large' ? 'Stor hiss' : 'Liten hiss'}
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">Ingen hiss</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{viewingQuote.stairs_from || 0} våningar</span>
                          </div>
                          {viewingQuote.carry_from_m && viewingQuote.carry_from_m > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Bäravstånd: {viewingQuote.carry_from_m} m
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* To Location Access */}
                    <Card className="border-0 shadow-sm bg-card/50">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Till-adress</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {viewingQuote.elevator_to_size ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">
                                  {viewingQuote.elevator_to_size === 'big' || viewingQuote.elevator_to_size === 'large' ? 'Stor hiss' : 'Liten hiss'}
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span className="text-sm">Ingen hiss</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{viewingQuote.stairs_to || 0} våningar</span>
                          </div>
                          {viewingQuote.carry_to_m && viewingQuote.carry_to_m > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Bäravstånd: {viewingQuote.carry_to_m} m
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Parking Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Car className="h-4 w-4" />
                    Parkering
                  </h3>
                  <Card className={`border-0 shadow-sm ${viewingQuote.parking_restrictions ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {viewingQuote.parking_restrictions ? (
                          <>
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="font-medium text-amber-800">Begränsad parkering</p>
                              <p className="text-sm text-amber-700">Planera extra tid för parkering</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-800">Bra parkeringsmöjligheter</p>
                              <p className="text-sm text-green-700">Inga problem angivna</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Heavy Items Section */}
                {formatHeavyItems(viewingQuote.heavy_items) && (
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      <Weight className="h-4 w-4" />
                      Tunga föremål
                    </h3>
                    <Card className="border-0 shadow-sm bg-amber-50 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">Extra utrustning kan krävas</p>
                            <p className="text-sm text-amber-700 mt-1">{formatHeavyItems(viewingQuote.heavy_items)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Additional Services Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Package className="h-4 w-4" />
                    Tilläggstjänster
                  </h3>
                  <Card className="border-0 shadow-sm bg-card/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Packning</span>
                        {viewingQuote.packing_hours > 0 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Önskas</Badge>
                        ) : (
                          <Badge variant="secondary">Nej</Badge>
                        )}
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Montering/Demontering</span>
                        {viewingQuote.assembly_hours > 0 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Önskas</Badge>
                        ) : (
                          <Badge variant="secondary">Nej</Badge>
                        )}
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hembesök</span>
                        {viewingQuote.home_visit_requested ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Önskas</Badge>
                        ) : (
                          <Badge variant="secondary">Nej</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">
                        Tilläggstjänster är RUT-berättigade
                      </p>
                    </CardContent>
                  </Card>
                </section>

                {/* Customer Notes Section */}
                {viewingQuote.notes && (
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      <FileText className="h-4 w-4" />
                      Kundanteckning
                    </h3>
                    <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-blue-800 italic">"{viewingQuote.notes}"</p>
                      </CardContent>
                    </Card>
                  </section>
                )}
              </div>

              {/* Sticky Footer with Action Button */}
              {!quotesWithOffers.has(viewingQuote.id) && (
                <SheetFooter className="pt-4 mt-4 border-t">
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      handleOpenOfferForm(viewingQuote);
                    }}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Lämna offert på detta jobb
                  </Button>
                </SheetFooter>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Offer Form Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lämna offert</DialogTitle>
            {selectedQuote && (
              <DialogDescription>
                Flytt {new Date(selectedQuote.move_date).toLocaleDateString('sv-SE')} • {selectedQuote.from_postal_code} → {selectedQuote.to_postal_code}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <form onSubmit={handleSubmitOffer} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="total_price">Totalpris (kr) *</Label>
              <Input
                id="total_price"
                type="number"
                value={offerForm.total_price}
                onChange={(e) => setOfferForm({ ...offerForm, total_price: e.target.value })}
                placeholder="Ex: 8500"
                required
              />
              {offerForm.total_price && (
                <p className="text-xs text-muted-foreground mt-1">
                  Efter RUT: ca {Math.ceil(parseInt(offerForm.total_price) * 0.5).toLocaleString('sv-SE')} kr
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_hours">Uppskattad tid (h) *</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  value={offerForm.estimated_hours}
                  onChange={(e) => setOfferForm({ ...offerForm, estimated_hours: e.target.value })}
                  placeholder="Ex: 4"
                  required
                />
              </div>
              <div>
                <Label htmlFor="team_size">Antal personer *</Label>
                <Input
                  id="team_size"
                  type="number"
                  min="1"
                  max="10"
                  value={offerForm.team_size}
                  onChange={(e) => setOfferForm({ ...offerForm, team_size: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time_window">Tidsfönster *</Label>
              <Input
                id="time_window"
                value={offerForm.time_window}
                onChange={(e) => setOfferForm({ ...offerForm, time_window: e.target.value })}
                placeholder="Ex: 08:00-12:00"
                required
              />
            </div>

            <div>
              <Label htmlFor="terms">Villkor / Kommentar</Label>
              <Textarea
                id="terms"
                value={offerForm.terms}
                onChange={(e) => setOfferForm({ ...offerForm, terms: e.target.value })}
                placeholder="T.ex. inkluderar emballage, körtillägg, etc."
                rows={3}
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm text-amber-800">
              <Clock className="h-4 w-4 inline mr-2" />
              Offerten kan inte ändras efter att den skickats.
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Skickar..." : "Skicka offert"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Management Sheet - Slide-out panel for approved offers */}
      <Sheet open={jobDetailDialogOpen} onOpenChange={setJobDetailDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600" />
              Jobbhantering
            </SheetTitle>
            {selectedApprovedOffer?.quote_requests && (
              <SheetDescription className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                {new Date(selectedApprovedOffer.quote_requests.move_date).toLocaleDateString('sv-SE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </SheetDescription>
            )}
          </SheetHeader>

          {selectedApprovedOffer?.quote_requests && (
            <div className="flex flex-col h-[calc(100vh-12rem)]">
              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-6">

                {/* Current Status Banner */}
                <div className={`rounded-xl p-4 ${
                  selectedApprovedOffer.job_status === 'completed' ? 'bg-green-100 border border-green-200' :
                  selectedApprovedOffer.job_status === 'cancelled' ? 'bg-red-100 border border-red-200' :
                  selectedApprovedOffer.job_status === 'in_progress' ? 'bg-yellow-100 border border-yellow-200' :
                  'bg-blue-100 border border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide font-medium opacity-70">Nuvarande status</p>
                      <p className="text-xl font-bold">
                        {jobStatusLabels[selectedApprovedOffer.job_status || 'confirmed'] || 'Bekräftad'}
                      </p>
                    </div>
                    <Badge className={`${jobStatusColors[selectedApprovedOffer.job_status || 'confirmed'] || 'bg-gray-100 text-gray-800'} text-sm px-3 py-1`}>
                      {selectedApprovedOffer.job_status === 'completed' ? <CheckCircle2 className="h-4 w-4 mr-1" /> :
                       selectedApprovedOffer.job_status === 'in_progress' ? <Truck className="h-4 w-4 mr-1" /> :
                       <Clock className="h-4 w-4 mr-1" />}
                      {jobStatusLabels[selectedApprovedOffer.job_status || 'confirmed']}
                    </Badge>
                  </div>
                </div>

                {/* Customer Contact Card */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <User className="h-4 w-4" />
                    Kundkontakt
                  </h3>
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-white border-green-200">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{selectedApprovedOffer.quote_requests.customer_name}</p>
                          <p className="text-sm text-muted-foreground">Kund</p>
                        </div>
                      </div>
                      
                      {/* Contact Preference Badge */}
                      {selectedApprovedOffer.quote_requests.contact_preference && (
                        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <MessageSquare className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            Föredrar kontakt via:{" "}
                            {selectedApprovedOffer.quote_requests.contact_preference === 'email' && 'Endast e-post'}
                            {selectedApprovedOffer.quote_requests.contact_preference === 'phone' && 'Telefon'}
                            {selectedApprovedOffer.quote_requests.contact_preference === 'both' && 'Både telefon och e-post'}
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${selectedApprovedOffer.quote_requests.customer_phone}`}
                          className={`flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-green-50 transition-colors ${
                            selectedApprovedOffer.quote_requests.contact_preference === 'email' ? 'opacity-50' : ''
                          }`}
                        >
                          <Phone className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Ring</p>
                            <p className="font-medium text-sm">{selectedApprovedOffer.quote_requests.customer_phone || 'Ej angivet'}</p>
                          </div>
                        </a>
                        <a
                          href={`mailto:${selectedApprovedOffer.quote_requests.customer_email}`}
                          className="flex items-center gap-2 p-3 bg-white rounded-lg border hover:bg-green-50 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">E-post</p>
                            <p className="font-medium text-sm truncate">{selectedApprovedOffer.quote_requests.customer_email}</p>
                          </div>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Your Offer Summary */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <FileText className="h-4 w-4" />
                    Din offert
                  </h3>
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{selectedApprovedOffer.total_price.toLocaleString('sv-SE')}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Kronor</p>
                        </div>
                        <div className="border-x border-border/50">
                          <p className="text-2xl font-bold text-primary">{selectedApprovedOffer.estimated_hours}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Timmar</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{selectedApprovedOffer.team_size}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Personer</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">Tidsfönster: <span className="font-medium text-foreground">{selectedApprovedOffer.time_window}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Addresses with Google Maps */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <MapPin className="h-4 w-4" />
                    Adresser
                  </h3>
                  <div className="space-y-3">
                    <Card
                      className="border-0 shadow-sm bg-card/50 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => openGoogleMapsLocation(
                        selectedApprovedOffer.quote_requests?.from_lat || null,
                        selectedApprovedOffer.quote_requests?.from_lng || null,
                        `${selectedApprovedOffer.quote_requests?.from_address}, ${selectedApprovedOffer.quote_requests?.from_postal_code}`
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-700 font-bold text-sm">A</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Från</p>
                            <p className="font-medium">{selectedApprovedOffer.quote_requests?.from_address}</p>
                            <p className="text-sm text-muted-foreground">{selectedApprovedOffer.quote_requests?.from_postal_code}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Distance Button */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openGoogleMapsDirections(
                          selectedApprovedOffer.quote_requests?.from_lat || null,
                          selectedApprovedOffer.quote_requests?.from_lng || null,
                          selectedApprovedOffer.quote_requests?.to_lat || null,
                          selectedApprovedOffer.quote_requests?.to_lng || null,
                          `${selectedApprovedOffer.quote_requests?.from_address}, ${selectedApprovedOffer.quote_requests?.from_postal_code}`,
                          `${selectedApprovedOffer.quote_requests?.to_address}, ${selectedApprovedOffer.quote_requests?.to_postal_code}`
                        )}
                      >
                        <Route className="h-4 w-4" />
                        {(() => {
                          const dist = calculateDistance(
                            selectedApprovedOffer.quote_requests?.from_lat || null,
                            selectedApprovedOffer.quote_requests?.from_lng || null,
                            selectedApprovedOffer.quote_requests?.to_lat || null,
                            selectedApprovedOffer.quote_requests?.to_lng || null
                          );
                          return dist ? <span>{dist} km</span> : <span>Visa rutt</span>;
                        })()}
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <div className="h-px flex-1 bg-border" />
                    </div>

                    <Card
                      className="border-0 shadow-sm bg-card/50 cursor-pointer hover:bg-card/80 transition-colors"
                      onClick={() => openGoogleMapsLocation(
                        selectedApprovedOffer.quote_requests?.to_lat || null,
                        selectedApprovedOffer.quote_requests?.to_lng || null,
                        `${selectedApprovedOffer.quote_requests?.to_address}, ${selectedApprovedOffer.quote_requests?.to_postal_code}`
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <span className="text-green-700 font-bold text-sm">B</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Till</p>
                            <p className="font-medium">{selectedApprovedOffer.quote_requests?.to_address}</p>
                            <p className="text-sm text-muted-foreground">{selectedApprovedOffer.quote_requests?.to_postal_code}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Property Details */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Home className="h-4 w-4" />
                    Fastighetsdetaljer
                  </h3>
                  <Card className="border-0 shadow-sm bg-card/50">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div>
                          <p className="text-lg font-bold capitalize">{selectedApprovedOffer.quote_requests?.dwelling_type}</p>
                          <p className="text-xs text-muted-foreground">Typ</p>
                        </div>
                        <div className="border-x border-border/50">
                          <p className="text-lg font-bold">{selectedApprovedOffer.quote_requests?.area_m2} m²</p>
                          <p className="text-xs text-muted-foreground">Yta</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{selectedApprovedOffer.quote_requests?.rooms || '-'}</p>
                          <p className="text-xs text-muted-foreground">Rum</p>
                        </div>
                      </div>

                      {/* Access Info */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Från-adress</p>
                          <div className="flex items-center gap-2">
                            {selectedApprovedOffer.quote_requests?.elevator_from_size ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">Hiss</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Ingen hiss</Badge>
                            )}
                            <span className="text-sm">{selectedApprovedOffer.quote_requests?.stairs_from || 0} tr</span>
                          </div>
                        </div>
                        <div className="p-2 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Till-adress</p>
                          <div className="flex items-center gap-2">
                            {selectedApprovedOffer.quote_requests?.elevator_to_size ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">Hiss</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Ingen hiss</Badge>
                            )}
                            <span className="text-sm">{selectedApprovedOffer.quote_requests?.stairs_to || 0} tr</span>
                          </div>
                        </div>
                      </div>

                      {/* Special Requirements */}
                      {(formatHeavyItems(selectedApprovedOffer.quote_requests.heavy_items) ||
                        selectedApprovedOffer.quote_requests.packing_hours ||
                        selectedApprovedOffer.quote_requests.assembly_hours) && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-1.5">
                          {formatHeavyItems(selectedApprovedOffer.quote_requests.heavy_items) && (
                            <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
                              <Weight className="h-3 w-3 mr-1" />
                              {formatHeavyItems(selectedApprovedOffer.quote_requests.heavy_items)}
                            </Badge>
                          )}
                          {selectedApprovedOffer.quote_requests.packing_hours && selectedApprovedOffer.quote_requests.packing_hours > 0 && (
                            <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                              <Package className="h-3 w-3 mr-1" />
                              Packning
                            </Badge>
                          )}
                          {selectedApprovedOffer.quote_requests.assembly_hours && selectedApprovedOffer.quote_requests.assembly_hours > 0 && (
                            <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                              <Package className="h-3 w-3 mr-1" />
                              Montering
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Customer Notes */}
                {selectedApprovedOffer.quote_requests?.notes && (
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      <FileText className="h-4 w-4" />
                      Kundanteckning
                    </h3>
                    <Card className="border-0 shadow-sm bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm text-blue-800 italic">"{selectedApprovedOffer.quote_requests?.notes}"</p>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Status Update Section */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    <Truck className="h-4 w-4" />
                    Uppdatera status
                  </h3>
                  <Card className="border-0 shadow-sm bg-card/50">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label className="text-sm">Meddelande till kunden (valfritt)</Label>
                        <Textarea
                          value={jobStatusNote}
                          onChange={(e) => setJobStatusNote(e.target.value)}
                          placeholder="T.ex. vi kommer kl 09:00, kontakta oss vid frågor..."
                          rows={2}
                          className="mt-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(jobStatusLabels).map(([status, label]) => {
                          const isCurrentStatus = selectedApprovedOffer.job_status === status;
                          const statusColors: Record<string, string> = {
                            confirmed: 'hover:bg-green-50 hover:border-green-300',
                            scheduled: 'hover:bg-blue-50 hover:border-blue-300',
                            in_progress: 'hover:bg-yellow-50 hover:border-yellow-300',
                            completed: 'hover:bg-green-50 hover:border-green-300',
                            cancelled: 'hover:bg-red-50 hover:border-red-300',
                          };

                          return (
                            <Button
                              key={status}
                              variant={isCurrentStatus ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleUpdateJobStatus(status)}
                              disabled={updatingJobStatus || isCurrentStatus}
                              className={`${!isCurrentStatus ? statusColors[status] : ''} transition-colors`}
                            >
                              {updatingJobStatus ? "..." : label}
                              {isCurrentStatus && <CheckCircle2 className="h-3 w-3 ml-1" />}
                            </Button>
                          );
                        })}
                      </div>

                      <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
                        <Mail className="h-3 w-3 inline mr-1" />
                        Kunden får ett e-postmeddelande när du ändrar status
                      </p>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default PartnerDashboard;
