import { useEffect, useState } from "react";
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
  FileText,
  Send,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  Star,
  LogOut,
  AlertCircle,
  Settings,
  Ruler,
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
  heavy_items: any;
  packing_hours: number;
  assembly_hours: number;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  quote_requests: {
    customer_name: string;
    from_address: string;
    to_address: string;
    move_date: string;
  } | null;
}

const PartnerDashboard = () => {
  const { user, isPartner, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
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
  useEffect(() => {
    if (!loading && (!user || !isPartner)) {
      navigate("/bli-partner");
    }
  }, [user, isPartner, loading, navigate]);

  useEffect(() => {
    if (user && isPartner) {
      fetchPartnerData();
    }
  }, [user, isPartner]);

  const fetchPartnerData = async () => {
    // Fetch partner info
    const { data: partnerData } = await supabase
      .from('partners')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (partnerData) {
      setPartner(partnerData);
      setMaxDistance(partnerData.max_drive_distance_km || 50);
      if (partnerData.status === 'approved') {
        // Fetch available quotes
        const { data: quotesData } = await supabase
          .from('quote_requests')
          .select('*')
          .in('status', ['pending', 'offers_received'])
          .order('created_at', { ascending: false });

        if (quotesData) {
          setQuotes(quotesData);
        }

        // Fetch my offers
        const { data: offersData } = await supabase
          .from('offers')
          .select('*, quote_requests(customer_name, from_address, to_address, move_date)')
          .eq('partner_id', partnerData.id)
          .order('created_at', { ascending: false });

        if (offersData) {
          setMyOffers(offersData);
        }
      }
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote || !partner) return;

    setSubmitting(true);

    const totalPrice = parseInt(offerForm.total_price);
    const rutDeduction = Math.min(Math.floor(totalPrice * 0.5), 75000); // Max 50% up to 75000 SEK
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
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

      if (error) throw error;

      // Update quote status
      await supabase
        .from('quote_requests')
        .update({ status: 'offers_received' })
        .eq('id', selectedQuote.id);

      toast({
        title: "Offert skickad!",
        description: "Kunden kommer meddelas om din offert.",
      });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!partner) {
    return null;
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
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Job List */}
                  <div className="space-y-4">
                    <h2 className="font-semibold">Nya förfrågningar</h2>
                    {quotes.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          Inga nya förfrågningar just nu
                        </CardContent>
                      </Card>
                    ) : (
                      quotes.map((quote) => (
                        <Card 
                          key={quote.id} 
                          className={`cursor-pointer transition-shadow hover:shadow-md ${selectedQuote?.id === quote.id ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {new Date(quote.move_date).toLocaleDateString('sv-SE')}
                                  </span>
                                  {quote.move_start_time && (
                                    <span className="text-sm text-muted-foreground">
                                      kl {quote.move_start_time}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline">{quote.dwelling_type}</Badge>
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p>{quote.from_address}</p>
                                  <p className="text-muted-foreground">→ {quote.to_address}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3 text-xs">
                              <Badge variant="secondary">{quote.area_m2} m²</Badge>
                              {quote.rooms && <Badge variant="secondary">{quote.rooms} rum</Badge>}
                              {quote.stairs_from > 0 && <Badge variant="secondary">{quote.stairs_from} tr (från)</Badge>}
                              {quote.stairs_to > 0 && <Badge variant="secondary">{quote.stairs_to} tr (till)</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Offer Form */}
                  <div>
                    {selectedQuote ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Lämna offert</CardTitle>
                          <CardDescription>
                            Flytt {new Date(selectedQuote.move_date).toLocaleDateString('sv-SE')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleSubmitOffer} className="space-y-4">
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

                            <Button type="submit" className="w-full" disabled={submitting}>
                              {submitting ? "Skickar..." : "Skicka offert"}
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Välj ett jobb till vänster för att lämna offert</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="offers">
                <Card>
                  <CardHeader>
                    <CardTitle>Mina offerter</CardTitle>
                    <CardDescription>Offerter du har skickat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myOffers.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Du har inte skickat några offerter ännu
                        </p>
                      ) : (
                        myOffers.map((offer) => (
                          <div key={offer.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{offer.quote_requests?.customer_name}</p>
                                <p className="text-sm text-muted-foreground">
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
                        ))
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
                      Ange hur långt du är villig att köra för uppdrag. Du ser bara förfrågningar inom ditt serviceområde.
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

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Aktuellt serviceområde</h4>
                      <p className="text-sm text-muted-foreground">
                        Du ser förfrågningar inom <span className="font-medium">{partner.max_drive_distance_km || 50} km</span> från din registrerade adress.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PartnerDashboard;
