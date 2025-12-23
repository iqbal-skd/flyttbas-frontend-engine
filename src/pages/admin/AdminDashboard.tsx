import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PartnerDetailDialog } from "@/components/admin/PartnerDetailDialog";
import { QuoteDetailDialog } from "@/components/admin/QuoteDetailDialog";
import { OfferDetailDialog } from "@/components/admin/OfferDetailDialog";
import { Input } from "@/components/ui/input";
import {
  Building2,
  FileText,
  DollarSign,
  Clock,
  LogOut,
  Eye,
  Send,
  Search,
  X,
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
}

interface CommissionFee {
  id: string;
  order_value: number;
  fee_amount: number;
  invoice_number: string | null;
  created_at: string;
  partners: {
    company_name: string;
  } | null;
}

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
  partners?: {
    company_name: string;
  } | null;
  quote_requests?: {
    customer_name: string;
    from_address: string;
    to_address: string;
  } | null;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [fees, setFees] = useState<CommissionFee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState("");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    pendingPartners: 0,
    activePartners: 0,
    pendingQuotes: 0,
    totalFees: 0,
    pendingOffers: 0,
  });

  // Filter quotes based on search and status
  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = quoteSearchQuery === "" || 
      quote.customer_name.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.customer_email.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.from_address.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.to_address.toLowerCase().includes(quoteSearchQuery.toLowerCase()) ||
      quote.from_postal_code.includes(quoteSearchQuery) ||
      quote.to_postal_code.includes(quoteSearchQuery);
    
    const matchesStatus = quoteStatusFilter === "all" || quote.status === quoteStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get counts per status for filter badges
  const quoteCounts = {
    all: quotes.length,
    pending: quotes.filter(q => q.status === "pending").length,
    offers_received: quotes.filter(q => q.status === "offers_received").length,
    offer_approved: quotes.filter(q => q.status === "offer_approved").length,
    completed: quotes.filter(q => q.status === "completed").length,
    cancelled: quotes.filter(q => q.status === "cancelled").length,
    expired: quotes.filter(q => q.status === "expired").length,
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    // Fetch partners
    const { data: partnersData } = await supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (partnersData) {
      setPartners(partnersData);
      setStats(prev => ({
        ...prev,
        pendingPartners: partnersData.filter(p => p.status === 'pending').length,
        activePartners: partnersData.filter(p => p.status === 'approved').length,
      }));
    }

    // Fetch quotes
    const { data: quotesData } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (quotesData) {
      setQuotes(quotesData);
      setStats(prev => ({
        ...prev,
        pendingQuotes: quotesData.filter(q => q.status === 'pending').length,
      }));
    }

    // Fetch offers with partner and quote info
    const { data: offersData } = await supabase
      .from('offers')
      .select('*, partners(company_name), quote_requests(customer_name, from_address, to_address)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (offersData) {
      setOffers(offersData);
      setStats(prev => ({
        ...prev,
        pendingOffers: offersData.filter(o => o.status === 'pending').length,
      }));
    }

    // Fetch fees
    const { data: feesData } = await supabase
      .from('commission_fees')
      .select('*, partners(company_name)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (feesData) {
      setFees(feesData);
      setStats(prev => ({
        ...prev,
        totalFees: feesData.reduce((sum, f) => sum + f.fee_amount, 0),
      }));
    }
  };

  const openPartnerDetail = (partner: Partner) => {
    setSelectedPartner(partner);
    setPartnerDialogOpen(true);
  };

  const openQuoteDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setQuoteDialogOpen(true);
  };

  const openOfferDetail = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    more_info_requested: "bg-blue-100 text-blue-800",
    suspended: "bg-gray-100 text-gray-800",
    offers_received: "bg-blue-100 text-blue-800",
    offer_approved: "bg-green-100 text-green-800",
    completed: "bg-green-200 text-green-900",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Väntande",
    approved: "Godkänd",
    rejected: "Avvisad",
    more_info_requested: "Begärt mer info",
    suspended: "Avstängd",
    offers_received: "Offerter mottagna",
    offer_approved: "Offert godkänd",
    completed: "Genomförd",
    cancelled: "Avbruten",
    expired: "Utgången",
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Flyttbas</title>
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Hantera partners, offerter och provisioner</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logga ut
            </Button>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Väntande partners</p>
                    <p className="text-2xl font-bold">{stats.pendingPartners}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aktiva partners</p>
                    <p className="text-2xl font-bold">{stats.activePartners}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nya förfrågningar</p>
                    <p className="text-2xl font-bold">{stats.pendingQuotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total provision</p>
                    <p className="text-2xl font-bold">{stats.totalFees.toLocaleString('sv-SE')} kr</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="partners">
            <TabsList className="mb-4">
              <TabsTrigger value="partners" className="gap-2">
                <Building2 className="h-4 w-4" />
                Partners
              </TabsTrigger>
              <TabsTrigger value="quotes" className="gap-2">
                <FileText className="h-4 w-4" />
                Förfrågningar
              </TabsTrigger>
              <TabsTrigger value="offers" className="gap-2">
                <Send className="h-4 w-4" />
                Inkomna offerter ({offers.length})
              </TabsTrigger>
              <TabsTrigger value="fees" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Provisioner
              </TabsTrigger>
            </TabsList>

            <TabsContent value="partners">
              <Card>
                <CardHeader>
                  <CardTitle>Partneransökningar</CardTitle>
                  <CardDescription>Granska och godkänn flyttföretag</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partners.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Inga partners ännu</p>
                    ) : (
                      partners.map((partner) => (
                        <div
                          key={partner.id}
                          className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => openPartnerDetail(partner)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{partner.company_name}</h3>
                                <Badge className={statusColors[partner.status || "pending"]}>
                                  {statusLabels[partner.status || "pending"]}
                                </Badge>
                                {partner.is_sponsored && (
                                  <Badge className="bg-purple-100 text-purple-800">Sponsrad</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Org.nr: {partner.org_number} | Kontakt: {partner.contact_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {partner.contact_email} | {partner.contact_phone}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {partner.traffic_license_number && (
                                  <Badge variant="outline">Trafiktillstånd ✓</Badge>
                                )}
                                {partner.f_tax_certificate && (
                                  <Badge variant="outline" className="bg-green-50">F-skatt ✓</Badge>
                                )}
                                {partner.insurance_company && (
                                  <Badge variant="outline">Försäkring ✓</Badge>
                                )}
                                {(partner.completed_jobs || 0) > 0 && (
                                  <Badge variant="secondary">{partner.completed_jobs} jobb</Badge>
                                )}
                                {partner.average_rating && (
                                  <Badge variant="secondary">★ {partner.average_rating.toFixed(1)}</Badge>
                                )}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPartnerDetail(partner);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Detaljer
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Flyttförfrågningar</CardTitle>
                  <CardDescription>Alla inkomna förfrågningar</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter Controls */}
                  <div className="space-y-4 mb-6">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Sök på kundnamn, e-post, adress eller postnummer..."
                        value={quoteSearchQuery}
                        onChange={(e) => setQuoteSearchQuery(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {quoteSearchQuery && (
                        <button
                          onClick={() => setQuoteSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "all" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("all")}
                        className="h-8"
                      >
                        Alla ({quoteCounts.all})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "pending" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("pending")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                        Väntande ({quoteCounts.pending})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "offers_received" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("offers_received")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        Offerter mottagna ({quoteCounts.offers_received})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "offer_approved" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("offer_approved")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        Offert godkänd ({quoteCounts.offer_approved})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "completed" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("completed")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-green-700 mr-2" />
                        Genomförd ({quoteCounts.completed})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "cancelled" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("cancelled")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                        Avbruten ({quoteCounts.cancelled})
                      </Button>
                      <Button
                        size="sm"
                        variant={quoteStatusFilter === "expired" ? "default" : "outline"}
                        onClick={() => setQuoteStatusFilter("expired")}
                        className="h-8"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                        Utgången ({quoteCounts.expired})
                      </Button>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    {filteredQuotes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        {quotes.length === 0 
                          ? "Inga förfrågningar ännu" 
                          : "Inga förfrågningar matchar din sökning"}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Visar {filteredQuotes.length} av {quotes.length} förfrågningar
                        </p>
                        {filteredQuotes.map((quote) => (
                          <div
                            key={quote.id}
                            className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                            onClick={() => openQuoteDetail(quote)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium">{quote.customer_name}</h3>
                                  <Badge className={statusColors[quote.status || "pending"]}>
                                    {statusLabels[quote.status || "pending"] || quote.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {quote.from_address} → {quote.to_address}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Flyttdatum: {new Date(quote.move_date).toLocaleDateString('sv-SE')}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline">{quote.dwelling_type}</Badge>
                                  <Badge variant="outline">{quote.area_m2} m²</Badge>
                                  {quote.rooms && (
                                    <Badge variant="outline">{quote.rooms} rum</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(quote.created_at).toLocaleDateString('sv-SE')}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openQuoteDetail(quote);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detaljer
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers">
              <Card>
                <CardHeader>
                  <CardTitle>Inkomna offerter</CardTitle>
                  <CardDescription>Alla offerter från partners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Inga offerter ännu</p>
                    ) : (
                      offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => openOfferDetail(offer)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{offer.partners?.company_name || 'Okänd partner'}</h3>
                                <Badge className={statusColors[offer.status || "pending"]}>
                                  {statusLabels[offer.status || "pending"]}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Kund: {offer.quote_requests?.customer_name || 'Okänd'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {offer.quote_requests?.from_address} → {offer.quote_requests?.to_address}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">{offer.total_price.toLocaleString('sv-SE')} kr</Badge>
                                <Badge variant="outline">{offer.team_size} pers</Badge>
                                <Badge variant="outline">{offer.estimated_hours} tim</Badge>
                                <Badge variant="secondary">
                                  {new Date(offer.available_date).toLocaleDateString('sv-SE')}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {new Date(offer.created_at).toLocaleDateString('sv-SE')}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOfferDetail(offer);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detaljer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees">
              <Card>
                <CardHeader>
                  <CardTitle>Provisioner</CardTitle>
                  <CardDescription>7% av ordervärde före RUT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fees.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Inga provisioner ännu</p>
                    ) : (
                      fees.map((fee) => (
                        <div key={fee.id} className="border rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{fee.partners?.company_name || 'Okänd partner'}</p>
                            <p className="text-sm text-muted-foreground">
                              Ordervärde: {fee.order_value.toLocaleString('sv-SE')} kr
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{fee.fee_amount.toLocaleString('sv-SE')} kr</p>
                            <p className="text-xs text-muted-foreground">
                              {fee.invoice_number || 'Ej fakturerad'}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <PartnerDetailDialog
        partner={selectedPartner}
        open={partnerDialogOpen}
        onOpenChange={setPartnerDialogOpen}
        onUpdate={fetchData}
        userId={user?.id}
      />

      <QuoteDetailDialog
        quote={selectedQuote}
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        onUpdate={fetchData}
      />

      <OfferDetailDialog
        offer={selectedOffer}
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
        onUpdate={fetchData}
      />
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
