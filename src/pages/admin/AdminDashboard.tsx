import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PartnerDetailSheet } from "@/components/admin/PartnerDetailSheet";
import { QuoteDetailSheet } from "@/components/admin/QuoteDetailSheet";
import { OfferDetailSheet } from "@/components/admin/OfferDetailSheet";
import { Tables } from "@/integrations/supabase/types";
import {
  LoadingSpinner,
  StatusBadge,
} from "@/components/dashboard";
import {
  Building2,
  FileText,
  DollarSign,
  Eye,
  Send,
  Search,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Calendar,
} from "lucide-react";

type Partner = Tables<"partners">;

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
  elevator_from_size: string | null;
  elevator_to_size: string | null;
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
type JobStatus = "confirmed" | "scheduled" | "in_progress" | "completed" | "cancelled";

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
  job_status: JobStatus | null;
  job_status_updated_at: string | null;
  job_notes: string | null;
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

interface QuoteOfferCount {
  quote_request_id: string;
  count: number;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial status filter from URL query parameter
  const initialStatusFilter = searchParams.get("status") || "all";

  const [partners, setPartners] = useState<Partner[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [fees, setFees] = useState<CommissionFee[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [quoteOfferCounts, setQuoteOfferCounts] = useState<Record<string, number>>({});
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerSheetOpen, setPartnerSheetOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quoteSheetOpen, setQuoteSheetOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [offerSheetOpen, setOfferSheetOpen] = useState(false);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState("");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>(initialStatusFilter);

  // Determine current section from route
  const currentSection = location.pathname.split("/").pop() || "partners";

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

  const quoteCounts = {
    all: quotes.length,
    pending: quotes.filter(q => q.status === "pending").length,
    offers_received: quotes.filter(q => q.status === "offers_received").length,
    offer_approved: quotes.filter(q => q.status === "offer_approved").length,
    completed: quotes.filter(q => q.status === "completed").length,
    cancelled: quotes.filter(q => q.status === "cancelled").length,
    expired: quotes.filter(q => q.status === "expired").length,
  };

  // Calculate quotes with upcoming moves (next 7 days)
  const urgentQuotes = quotes.filter(q => {
    const daysUntil = Math.ceil((new Date(q.move_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7 && q.status !== "completed" && q.status !== "cancelled";
  }).length;

  // Calculate quotes from this month
  const thisMonthQuotes = quotes.filter(q => {
    const quoteDate = new Date(q.created_at);
    const now = new Date();
    return quoteDate.getMonth() === now.getMonth() && quoteDate.getFullYear() === now.getFullYear();
  }).length;

  useEffect(() => {
    if (!loading && rolesLoaded && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, rolesLoaded, navigate]);

  // Sync URL search params with quote status filter
  useEffect(() => {
    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl && statusFromUrl !== quoteStatusFilter) {
      setQuoteStatusFilter(statusFromUrl);
    }
  }, [searchParams]);

  // Clear URL params when filter changes to "all"
  const handleQuoteStatusFilterChange = (status: string) => {
    setQuoteStatusFilter(status);
    if (status === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams, { replace: true });
  };

  useEffect(() => {
    if (rolesLoaded && isAdmin) {
      fetchData();
    }
  }, [isAdmin, rolesLoaded, currentSection]);

  const fetchData = async () => {
    // Fetch based on current section to reduce unnecessary queries
    if (currentSection === "partners") {
      const { data: partnersData } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      if (partnersData) setPartners(partnersData);
    }

    if (currentSection === "quotes") {
      const { data: quotesData } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (quotesData) setQuotes(quotesData);

      // Fetch offer counts for each quote
      const { data: offerCountsData } = await supabase
        .from('offers')
        .select('quote_request_id');

      if (offerCountsData) {
        const counts: Record<string, number> = {};
        offerCountsData.forEach((offer) => {
          counts[offer.quote_request_id] = (counts[offer.quote_request_id] || 0) + 1;
        });
        setQuoteOfferCounts(counts);
      }
    }

    if (currentSection === "offers") {
      const { data: offersData } = await supabase
        .from('offers')
        .select('*, partners(company_name), quote_requests(customer_name, from_address, to_address)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (offersData) setOffers(offersData);
    }

    if (currentSection === "billing") {
      const { data: feesData } = await supabase
        .from('commission_fees')
        .select('*, partners(company_name)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (feesData) setFees(feesData);
    }
  };

  const openPartnerDetail = (partner: Partner) => {
    setSelectedPartner(partner);
    setPartnerSheetOpen(true);
  };

  const openQuoteDetail = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setQuoteSheetOpen(true);
  };

  const openOfferDetail = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferSheetOpen(true);
  };

  // Handle opening offer detail from within quote sheet
  const handleViewOfferFromQuote = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferSheetOpen(true);
  };

  // Calculate days until move
  const getDaysUntilMove = (moveDate: string) => {
    return Math.ceil((new Date(moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  // Get urgency badge
  const getUrgencyBadge = (moveDate: string) => {
    const days = getDaysUntilMove(moveDate);
    if (days < 0) {
      return <Badge className="bg-gray-100 text-gray-600 text-xs">Passerad</Badge>;
    }
    if (days <= 3) {
      return <Badge className="bg-red-100 text-red-700 text-xs">{days}d kvar</Badge>;
    }
    if (days <= 7) {
      return <Badge className="bg-amber-100 text-amber-700 text-xs">{days}d kvar</Badge>;
    }
    if (days <= 14) {
      return <Badge className="bg-yellow-100 text-yellow-700 text-xs">{days}d kvar</Badge>;
    }
    return <Badge variant="outline" className="text-xs">{days}d kvar</Badge>;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return null;
  }

  // Get page title based on section
  const getPageTitle = () => {
    switch (currentSection) {
      case "partners": return "Partners";
      case "quotes": return "Förfrågningar";
      case "offers": return "Offerter";
      case "billing": return "Fakturering";
      case "settings": return "Inställningar";
      default: return "Admin";
    }
  };

  // Render Partners Section
  const renderPartners = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Partneransökningar
        </CardTitle>
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
                      <StatusBadge status={partner.status} />
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
  );

  // Render Quotes Section
  const renderQuotes = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quotes.length}</p>
                <p className="text-xs text-muted-foreground">Totalt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quoteCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Väntande</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{urgentQuotes}</p>
                <p className="text-xs text-muted-foreground">Brådskande</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quoteCounts.offer_approved}</p>
                <p className="text-xs text-muted-foreground">Godkända</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Quotes Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Flyttförfrågningar
          </CardTitle>
          <CardDescription>Alla inkomna förfrågningar</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="space-y-4 mb-6">
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

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "Alla", count: quoteCounts.all },
                { key: "pending", label: "Väntande", count: quoteCounts.pending, color: "bg-yellow-500" },
                { key: "offers_received", label: "Offerter mottagna", count: quoteCounts.offers_received, color: "bg-blue-500" },
                { key: "offer_approved", label: "Offert godkänd", count: quoteCounts.offer_approved, color: "bg-green-500" },
                { key: "completed", label: "Genomförd", count: quoteCounts.completed, color: "bg-green-700" },
                { key: "cancelled", label: "Avbruten", count: quoteCounts.cancelled, color: "bg-red-500" },
                { key: "expired", label: "Utgången", count: quoteCounts.expired, color: "bg-gray-500" },
              ].map((filter) => (
                <Button
                  key={filter.key}
                  size="sm"
                  variant={quoteStatusFilter === filter.key ? "default" : "outline"}
                  onClick={() => handleQuoteStatusFilterChange(filter.key)}
                  className="h-8"
                >
                  {filter.color && <span className={`w-2 h-2 rounded-full ${filter.color} mr-2`} />}
                  {filter.label} ({filter.count})
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuotes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {quotes.length === 0
                  ? "Inga förfrågningar ännu"
                  : "Inga förfrågningar matchar din sökning"}
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Visar {filteredQuotes.length} av {quotes.length} förfrågningar
                </p>
                {filteredQuotes.map((quote) => {
                  const offerCount = quoteOfferCounts[quote.id] || 0;
                  return (
                    <div
                      key={quote.id}
                      className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => openQuoteDetail(quote)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Header Row */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold truncate">{quote.customer_name}</h3>
                            <StatusBadge status={quote.status} />
                            {getUrgencyBadge(quote.move_date)}
                            {offerCount > 0 && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {offerCount} {offerCount === 1 ? "offert" : "offerter"}
                              </Badge>
                            )}
                          </div>

                          {/* Contact Info */}
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                            <span className="truncate">{quote.customer_email}</span>
                            {quote.customer_phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {quote.customer_phone}
                              </span>
                            )}
                          </div>

                          {/* Addresses */}
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{quote.from_postal_code}</span> {quote.from_address.split(',')[0]} → <span className="font-medium">{quote.to_postal_code}</span> {quote.to_address.split(',')[0]}
                          </p>

                          {/* Move Date and Details */}
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(quote.move_date).toLocaleDateString('sv-SE')}
                            </Badge>
                            <Badge variant="outline">{quote.dwelling_type}</Badge>
                            <Badge variant="outline">{quote.area_m2} m²</Badge>
                            {quote.rooms && (
                              <Badge variant="outline">{quote.rooms} rum</Badge>
                            )}
                            {quote.home_visit_requested && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">Hembesök</Badge>
                            )}
                          </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
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
                  );
                })}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Offers Section
  const renderOffers = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Inkomna offerter
        </CardTitle>
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
                      <StatusBadge status={offer.status} />
                      {offer.job_status && (
                        <Badge variant="secondary">{offer.job_status}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Kund: {offer.quote_requests?.customer_name || 'Okänd'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {offer.quote_requests?.from_address} → {offer.quote_requests?.to_address}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className="bg-green-100 text-green-700">{offer.total_price.toLocaleString('sv-SE')} kr</Badge>
                      <Badge variant="outline">{offer.team_size} pers</Badge>
                      <Badge variant="outline">{offer.estimated_hours} tim</Badge>
                      <Badge variant="secondary">
                        {new Date(offer.available_date).toLocaleDateString('sv-SE')}
                      </Badge>
                      {offer.distance_km && (
                        <Badge variant="outline">{offer.distance_km.toFixed(1)} km</Badge>
                      )}
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
  );

  // Render Billing Section
  const renderBilling = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Provisioner
        </CardTitle>
        <CardDescription>Provision på ordervärde före RUT</CardDescription>
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
  );

  // Render Settings Section
  const renderSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Inställningar</CardTitle>
        <CardDescription>Systemkonfiguration</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Inställningar kommer snart...
        </p>
      </CardContent>
    </Card>
  );

  // Render content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case "partners": return renderPartners();
      case "quotes": return renderQuotes();
      case "offers": return renderOffers();
      case "billing": return renderBilling();
      case "settings": return renderSettings();
      default: return renderPartners();
    }
  };

  return (
    <AdminLayout title={getPageTitle()}>
      {renderContent()}

      <PartnerDetailSheet
        partner={selectedPartner}
        open={partnerSheetOpen}
        onOpenChange={setPartnerSheetOpen}
        onUpdate={fetchData}
        userId={user?.id}
      />

      <QuoteDetailSheet
        quote={selectedQuote}
        open={quoteSheetOpen}
        onOpenChange={setQuoteSheetOpen}
        onUpdate={fetchData}
        onViewOffer={handleViewOfferFromQuote}
      />

      <OfferDetailSheet
        offer={selectedOffer}
        open={offerSheetOpen}
        onOpenChange={setOfferSheetOpen}
        onUpdate={fetchData}
      />
    </AdminLayout>
  );
};

export default AdminDashboard;
