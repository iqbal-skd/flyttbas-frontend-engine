import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FileText,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  LogOut,
  Plus,
  ChevronRight,
  Users,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuoteRequest {
  id: string;
  from_address: string;
  from_postal_code: string;
  to_address: string;
  to_postal_code: string;
  move_date: string;
  dwelling_type: string;
  area_m2: number;
  status: string;
  created_at: string;
}

interface Offer {
  id: string;
  total_price: number;
  price_before_rut: number;
  estimated_hours: number;
  team_size: number;
  time_window: string;
  status: string;
  created_at: string;
  partners: {
    company_name: string;
    average_rating: number;
    total_reviews: number;
  } | null;
}

const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profile?.email) {
        const { data: quotesData, error } = await supabase
          .from('quote_requests')
          .select('*')
          .or(`customer_id.eq.${user?.id},customer_email.eq.${profile.email}`)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setQuotes(quotesData || []);

        if (quotesData && quotesData.length > 0) {
          setSelectedQuote(quotesData[0]);
          fetchOffers(quotesData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchOffers = async (quoteId: string) => {
    const { data: offersData } = await supabase
      .from('offers')
      .select('*, partners(company_name, average_rating, total_reviews)')
      .eq('quote_request_id', quoteId)
      .order('created_at', { ascending: false });

    if (offersData) {
      setOffers(offersData);
    }
  };

  const handleSelectQuote = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    fetchOffers(quote.id);
  };

  const handleApproveOffer = async (offerId: string) => {
    try {
      await supabase
        .from('offers')
        .update({ status: 'approved' })
        .eq('id', offerId);

      // Reject other offers
      if (selectedQuote) {
        await supabase
          .from('offers')
          .update({ status: 'rejected' })
          .eq('quote_request_id', selectedQuote.id)
          .neq('id', offerId);

        await supabase
          .from('quote_requests')
          .update({ status: 'offer_approved' })
          .eq('id', selectedQuote.id);
      }

      toast({
        title: "Offert godkänd!",
        description: "Flyttfirman kommer kontakta dig inom kort.",
      });

      fetchQuotes();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte godkänna offerten.",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingData) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    );
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Väntar på offerter', color: 'bg-yellow-100 text-yellow-800' },
    offers_received: { label: 'Offerter mottagna', color: 'bg-blue-100 text-blue-800' },
    offer_approved: { label: 'Offert godkänd', color: 'bg-green-100 text-green-800' },
    completed: { label: 'Genomförd', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Avbokad', color: 'bg-gray-100 text-gray-800' },
    expired: { label: 'Utgången', color: 'bg-gray-100 text-gray-800' },
  };

  return (
    <>
      <Helmet>
        <title>Mina Förfrågningar | Flyttbas</title>
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Mina Förfrågningar</h1>
              <p className="text-muted-foreground">Hantera dina flyttförfrågningar och offerter</p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/#quote-wizard">
                  <Plus className="h-4 w-4 mr-2" />
                  Ny förfrågan
                </Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logga ut
              </Button>
            </div>
          </div>

          {quotes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">Inga förfrågningar ännu</h2>
                <p className="text-muted-foreground mb-6">
                  Skapa din första flyttförfrågan och få offerter från verifierade flyttfirmor.
                </p>
                <Button asChild>
                  <Link to="/#quote-wizard">
                    Jämför offerter gratis
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quote List */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Dina förfrågningar ({quotes.length})
                </h2>
                {quotes.map((quote) => (
                  <Card 
                    key={quote.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedQuote?.id === quote.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectQuote(quote)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {new Date(quote.move_date).toLocaleDateString('sv-SE')}
                          </span>
                        </div>
                        <Badge className={statusLabels[quote.status]?.color || ''}>
                          {statusLabels[quote.status]?.label || quote.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="truncate">{quote.from_address || quote.from_postal_code}</p>
                            <p className="truncate">→ {quote.to_address || quote.to_postal_code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>{quote.dwelling_type} • {quote.area_m2} m²</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Offers Panel */}
              <div className="lg:col-span-2">
                {selectedQuote && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Flytt {new Date(selectedQuote.move_date).toLocaleDateString('sv-SE')}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {selectedQuote.from_address || selectedQuote.from_postal_code} → {selectedQuote.to_address || selectedQuote.to_postal_code}
                          </CardDescription>
                        </div>
                        <Badge className={statusLabels[selectedQuote.status]?.color || ''}>
                          {statusLabels[selectedQuote.status]?.label || selectedQuote.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Offerter ({offers.length})
                      </h3>

                      {offers.length === 0 ? (
                        <div className="text-center py-8 bg-secondary/50 rounded-lg">
                          <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                          <p className="font-medium">Väntar på offerter</p>
                          <p className="text-sm text-muted-foreground">
                            Våra partners granskar din förfrågan. Du får besked via e-post.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {offers.map((offer) => (
                            <div 
                              key={offer.id} 
                              className={`border rounded-lg p-4 ${
                                offer.status === 'approved' ? 'border-green-500 bg-green-50' : ''
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                      <Truck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{offer.partners?.company_name}</h4>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 fill-orange text-orange" />
                                        <span>
                                          {offer.partners?.average_rating.toFixed(1)} ({offer.partners?.total_reviews} omdömen)
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                                    <div>
                                      <p className="text-muted-foreground">Tidsfönster</p>
                                      <p className="font-medium">{offer.time_window}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Uppsk. tid</p>
                                      <p className="font-medium">{offer.estimated_hours}h</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground">Team</p>
                                      <p className="font-medium flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {offer.team_size} pers
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <p className="text-2xl font-bold text-primary">
                                    {offer.total_price.toLocaleString('sv-SE')} kr
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Efter RUT: ~{Math.ceil(offer.total_price * 0.5).toLocaleString('sv-SE')} kr
                                  </p>
                                  
                                  {offer.status === 'pending' && selectedQuote.status !== 'offer_approved' && (
                                    <Button 
                                      className="mt-3"
                                      onClick={() => handleApproveOffer(offer.id)}
                                    >
                                      Godkänn offert
                                    </Button>
                                  )}
                                  
                                  {offer.status === 'approved' && (
                                    <Badge className="bg-green-100 text-green-800 mt-3">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Godkänd
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
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default CustomerDashboard;
