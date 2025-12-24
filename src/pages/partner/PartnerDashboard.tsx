import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Send,
  MapPin,
  Calendar,
  Star,
  LogOut,
  AlertCircle,
  Settings,
  Ruler,
  Package,
  Home,
  Building,
  Weight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  X,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Partner {
  id: string;
  company_name: string;
  status: string;
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
  to_address: string;
  to_postal_code: string;
  move_date: string;
  move_start_time: string | null;
  area_m2: number;
  rooms: number | null;
  dwelling_type: string;
  stairs_from: number;
  stairs_to: number;
  carry_from_m: number | null;
  carry_to_m: number | null;
  heavy_items: any;
  packing_hours: number;
  assembly_hours: number;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  quote_request_id: string;
  total_price: number;
  status: string;
  created_at: string;
  quote_requests: {
    customer_name: string;
    customer_email: string;
    from_address: string;
    to_address: string;
    move_date: string;
  } | null;
}

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
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(50);

  // Get IDs of quotes the partner has already made offers on
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
      setMaxDistance(partnerData.max_drive_distance_km || 50);
      if (partnerData.status === 'approved') {
        const { data: quotesData } = await supabase
          .from('quote_requests')
          .select('*')
          .in('status', ['pending', 'offers_received'])
          .order('created_at', { ascending: false });

        if (quotesData) {
          setQuotes(quotesData);
        }

        const { data: offersData } = await supabase
          .from('offers')
          .select('*, quote_requests(customer_name, customer_email, from_address, to_address, move_date)')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false });

        if (offersData) {
          setMyOffers(offersData);
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
      const { data: offerData, error } = await supabase.from('offers').insert({
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

      // Send email notification to customer
      try {
        const { data, error: fnError } = await supabase.functions.invoke('send-offer-notification', {
          body: {
            customerEmail: selectedQuote.customer_email,
            customerName: selectedQuote.customer_name,
            partnerName: partner.company_name,
            offerPrice: totalPrice,
            moveDate: selectedQuote.move_date,
            quoteId: selectedQuote.id,
          }
        });
        
        if (fnError) {
          console.error("Failed to send notification email:", fnError);
        } else {
          console.log("Notification email sent:", data);
        }
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

  const handleUpdateProximity = async (newDistance: number) => {
    if (!partner) return;
    
    setUpdatingSettings(true);
    try {
      const { error } = await supabase
        .from('partners')
        .update({ max_drive_distance_km: newDistance })
        .eq('id', partner.id);

      if (error) throw error;

      setPartner({ ...partner, max_drive_distance_km: newDistance });
      toast({
        title: "Inställningar uppdaterade",
        description: `Ditt serviceområde är nu ${newDistance} km`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte uppdatera inställningar.",
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  const isOfferApproved = (quoteId: string) => {
    const offer = myOffers.find(o => o.quote_request_id === quoteId);
    return offer?.status === 'approved';
  };

  const formatHeavyItems = (items: any) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return items.filter((item: any) => item.quantity > 0).map((item: any) => `${item.name}: ${item.quantity}`).join(', ');
  };

  if (loading || !rolesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <>
        <Helmet>
          <title>Partner Dashboard | Flyttbas</title>
        </Helmet>
        <Header />
        <main className="min-h-screen bg-secondary/30 py-8">
          <div className="container mx-auto px-4 text-center">
            <Card className="max-w-md mx-auto">
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
        </main>
        <Footer />
      </>
    );
  }

  const statusMessages: Record<string, { message: string; variant: 'default' | 'destructive' | 'outline' }> = {
    pending: { message: "Din ansökan granskas. Vi återkommer inom 1-2 arbetsdagar.", variant: "outline" },
    more_info_requested: { message: "Vi behöver mer information. Kolla din e-post.", variant: "destructive" },
    rejected: { message: "Din ansökan har avslagits. Kontakta oss för mer information.", variant: "destructive" },
    suspended: { message: "Ditt konto är tillfälligt avstängt.", variant: "destructive" },
  };

  return (
    <>
      <Helmet>
        <title>Partner Dashboard | Flyttbas</title>
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">{partner.company_name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {partner.average_rating.toFixed(1)} ({partner.total_reviews} omdömen)
                </span>
                <span>{partner.completed_jobs} genomförda jobb</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logga ut
            </Button>
          </div>

          {partner.status !== 'approved' && statusMessages[partner.status] && (
            <div className="mb-8">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-800">{statusMessages[partner.status].message}</p>
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
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Inställningar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Nya förfrågningar</h2>
                    <Badge variant="secondary">{quotes.length} aktiva</Badge>
                  </div>
                  
                  {quotes.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Inga nya förfrågningar just nu</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {quotes.map((quote) => {
                        const hasOffer = quotesWithOffers.has(quote.id);
                        
                        return (
                          <Card 
                            key={quote.id} 
                            className={`relative transition-all hover:shadow-lg ${hasOffer ? 'opacity-70 border-green-200 bg-green-50/30' : 'border-border'}`}
                          >
                            {hasOffer && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-green-600 text-white">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Offert skickad
                                </Badge>
                              </div>
                            )}
                            
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium text-foreground">
                                  {new Date(quote.move_date).toLocaleDateString('sv-SE', { 
                                    weekday: 'short', 
                                    day: 'numeric', 
                                    month: 'short' 
                                  })}
                                </span>
                                {quote.move_start_time && (
                                  <span className="text-muted-foreground">
                                    kl {quote.move_start_time}
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <div className="text-sm">
                                    <p className="font-medium">{quote.from_postal_code}</p>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <ArrowRight className="h-3 w-3" />
                                      <span>{quote.to_postal_code}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">{quote.dwelling_type}</Badge>
                                <Badge variant="secondary">{quote.area_m2} m²</Badge>
                                {quote.rooms && <Badge variant="secondary">{quote.rooms} rum</Badge>}
                              </div>
                              
                              {/* Quick info pills */}
                              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-4">
                                {(quote.stairs_from > 0 || quote.stairs_to > 0) && (
                                  <span className="bg-muted px-2 py-0.5 rounded">
                                    {quote.stairs_from + quote.stairs_to} tr
                                  </span>
                                )}
                                {quote.packing_hours > 0 && (
                                  <span className="bg-muted px-2 py-0.5 rounded">
                                    Packning
                                  </span>
                                )}
                                {quote.assembly_hours > 0 && (
                                  <span className="bg-muted px-2 py-0.5 rounded">
                                    Montering
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
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
                                    className="flex-1"
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
                <Card>
                  <CardHeader>
                    <CardTitle>Mina offerter</CardTitle>
                    <CardDescription>Offerter du har skickat (kan inte ändras)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myOffers.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Du har inte skickat några offerter ännu
                        </p>
                      ) : (
                        myOffers.map((offer) => {
                          const showCustomerDetails = offer.status === 'approved';
                          
                          return (
                            <div key={offer.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  {showCustomerDetails ? (
                                    <>
                                      <p className="font-medium">{offer.quote_requests?.customer_name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {offer.quote_requests?.customer_email}
                                      </p>
                                    </>
                                  ) : (
                                    <p className="font-medium text-muted-foreground italic">
                                      Kunduppgifter visas efter godkännande
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {offer.quote_requests?.from_address} → {offer.quote_requests?.to_address}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {offer.quote_requests?.move_date && new Date(offer.quote_requests.move_date).toLocaleDateString('sv-SE')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">{offer.total_price.toLocaleString('sv-SE')} kr</p>
                                  <Badge className={
                                    offer.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }>
                                    {offer.status === 'pending' ? 'Väntar' : 
                                     offer.status === 'approved' ? 'Godkänd' : 
                                     offer.status === 'rejected' ? 'Avvisad' : offer.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Serviceområde
                    </CardTitle>
                    <CardDescription>
                      Ange hur långt du är villig att köra för uppdrag.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Max körsträcka</Label>
                        <span className="text-lg font-semibold text-primary">{maxDistance} km</span>
                      </div>
                      <Slider
                        value={[maxDistance]}
                        onValueChange={(value) => setMaxDistance(value[0])}
                        min={10}
                        max={200}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10 km</span>
                        <span>100 km</span>
                        <span>200 km</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleUpdateProximity(maxDistance)}
                      disabled={updatingSettings || maxDistance === partner.max_drive_distance_km}
                      className="w-full"
                    >
                      {updatingSettings ? "Sparar..." : "Spara inställningar"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      {/* Detail View Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Förfrågningsdetaljer
            </DialogTitle>
            {viewingQuote && (
              <DialogDescription>
                Flytt den {new Date(viewingQuote.move_date).toLocaleDateString('sv-SE')}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {viewingQuote && (
            <div className="space-y-4 mt-4">
              {/* Addresses */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresser
                </h4>
                <div className="text-sm space-y-1 pl-6">
                  <p><span className="text-muted-foreground">Från:</span> {viewingQuote.from_address}, {viewingQuote.from_postal_code}</p>
                  <p><span className="text-muted-foreground">Till:</span> {viewingQuote.to_address}, {viewingQuote.to_postal_code}</p>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Bostadsdetaljer
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm pl-6">
                  <p><span className="text-muted-foreground">Typ:</span> {viewingQuote.dwelling_type}</p>
                  <p><span className="text-muted-foreground">Yta:</span> {viewingQuote.area_m2} m²</p>
                  {viewingQuote.rooms && <p><span className="text-muted-foreground">Rum:</span> {viewingQuote.rooms}</p>}
                </div>
              </div>

              {/* Stairs & Carry Distance */}
              {(viewingQuote.stairs_from > 0 || viewingQuote.stairs_to > 0 || viewingQuote.carry_from_m || viewingQuote.carry_to_m) && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Trappor & Bäravstånd
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm pl-6">
                    {viewingQuote.stairs_from > 0 && <p><span className="text-muted-foreground">Trappor (från):</span> {viewingQuote.stairs_from} tr</p>}
                    {viewingQuote.stairs_to > 0 && <p><span className="text-muted-foreground">Trappor (till):</span> {viewingQuote.stairs_to} tr</p>}
                    {viewingQuote.carry_from_m && viewingQuote.carry_from_m > 0 && <p><span className="text-muted-foreground">Bäravstånd (från):</span> {viewingQuote.carry_from_m} m</p>}
                    {viewingQuote.carry_to_m && viewingQuote.carry_to_m > 0 && <p><span className="text-muted-foreground">Bäravstånd (till):</span> {viewingQuote.carry_to_m} m</p>}
                  </div>
                </div>
              )}

              {/* Heavy Items */}
              {formatHeavyItems(viewingQuote.heavy_items) && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Tunga föremål
                  </h4>
                  <p className="text-sm pl-6">{formatHeavyItems(viewingQuote.heavy_items)}</p>
                </div>
              )}

              {/* Services */}
              {(viewingQuote.packing_hours > 0 || viewingQuote.assembly_hours > 0) && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Tilläggstjänster
                  </h4>
                  <div className="text-sm pl-6 space-y-1">
                    {viewingQuote.packing_hours > 0 && <p>Packning: {viewingQuote.packing_hours} timmar</p>}
                    {viewingQuote.assembly_hours > 0 && <p>Montering/Demontering: {viewingQuote.assembly_hours} timmar</p>}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingQuote.notes && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Kundanteckning</h4>
                  <p className="text-sm pl-6 italic text-muted-foreground">{viewingQuote.notes}</p>
                </div>
              )}

              {/* Action Button */}
              {!quotesWithOffers.has(viewingQuote.id) && (
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    setDetailDialogOpen(false);
                    handleOpenOfferForm(viewingQuote);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Lämna offert på detta jobb
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

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
      
      <Footer />
    </>
  );
};

export default PartnerDashboard;