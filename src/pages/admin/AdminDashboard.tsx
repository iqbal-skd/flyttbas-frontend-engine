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
import {
  Building2,
  FileText,
  DollarSign,
  Clock,
  LogOut,
  Eye,
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

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [fees, setFees] = useState<CommissionFee[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    pendingPartners: 0,
    activePartners: 0,
    pendingQuotes: 0,
    totalFees: 0,
  });

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
                  <div className="space-y-4">
                    {quotes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Inga förfrågningar ännu</p>
                    ) : (
                      quotes.map((quote) => (
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
      
      <Footer />
    </>
  );
};

export default AdminDashboard;
