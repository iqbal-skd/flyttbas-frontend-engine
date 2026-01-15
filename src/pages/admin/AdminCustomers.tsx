import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Users,
  Search,
  X,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
  Star,
  ChevronRight,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";

interface Customer {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

interface CustomerDetail extends Customer {
  quotes: {
    id: string;
    status: string;
    move_date: string;
    from_address: string;
    to_address: string;
    created_at: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    partner_name?: string;
  }[];
  stats: {
    totalQuotes: number;
    completedMoves: number;
    totalValue: number;
    reviewsGiven: number;
  };
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchCustomers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomerDetail = async (customer: Customer) => {
    setLoadingDetail(true);
    setSheetOpen(true);

    try {
      // Fetch quotes
      const { data: quotes } = await supabase
        .from("quote_requests")
        .select("id, status, move_date, from_address, to_address, created_at")
        .or(`customer_id.eq.${customer.user_id},customer_email.eq.${customer.email}`)
        .order("created_at", { ascending: false });

      // Fetch reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          partners(company_name)
        `)
        .eq("customer_id", customer.user_id)
        .order("created_at", { ascending: false });

      // Calculate stats
      const completedQuotes = (quotes || []).filter(q => q.status === "completed");

      // Get total value from completed offers
      let totalValue = 0;
      if (completedQuotes.length > 0) {
        const { data: offers } = await supabase
          .from("offers")
          .select("total_price")
          .in("quote_request_id", completedQuotes.map(q => q.id))
          .eq("status", "approved");

        totalValue = (offers || []).reduce((sum, o) => sum + o.total_price, 0);
      }

      setSelectedCustomer({
        ...customer,
        quotes: quotes || [],
        reviews: (reviews || []).map(r => ({
          ...r,
          partner_name: (r.partners as any)?.company_name,
        })),
        stats: {
          totalQuotes: quotes?.length || 0,
          completedMoves: completedQuotes.length,
          totalValue,
          reviewsGiven: reviews?.length || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching customer detail:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      customer.email.toLowerCase().includes(query) ||
      customer.full_name?.toLowerCase().includes(query) ||
      customer.phone?.includes(query)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "offer_approved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout title="Kunder">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-muted-foreground">
            {customers.length} registrerade kunder
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök på namn, e-post eller telefon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kunder
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner fullScreen={false} />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? "Inga kunder matchar sökningen" : "Inga kunder ännu"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => fetchCustomerDetail(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {customer.full_name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {customer.full_name || "Namn ej angivet"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Medlem sedan {formatDate(customer.created_at)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Kundprofil</SheetTitle>
            <SheetDescription>
              Detaljerad information om kunden
            </SheetDescription>
          </SheetHeader>

          {loadingDetail ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner fullScreen={false} />
            </div>
          ) : selectedCustomer ? (
            <div className="mt-6 space-y-6">
              {/* Customer Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {selectedCustomer.full_name?.charAt(0) || selectedCustomer.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedCustomer.full_name || "Namn ej angivet"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Medlem sedan {formatDate(selectedCustomer.created_at)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedCustomer.email}
                    </a>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedCustomer.phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedCustomer.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <FileText className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedCustomer.stats.totalQuotes}</p>
                  <p className="text-xs text-muted-foreground">Förfrågningar</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedCustomer.stats.completedMoves}</p>
                  <p className="text-xs text-muted-foreground">Genomförda</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {selectedCustomer.stats.totalValue.toLocaleString("sv-SE")}
                  </p>
                  <p className="text-xs text-muted-foreground">Totalt värde (kr)</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedCustomer.stats.reviewsGiven}</p>
                  <p className="text-xs text-muted-foreground">Omdömen</p>
                </div>
              </div>

              {/* Quotes */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Förfrågningar ({selectedCustomer.quotes.length})
                </h4>
                {selectedCustomer.quotes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Inga förfrågningar</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.quotes.slice(0, 5).map((quote) => (
                      <div
                        key={quote.id}
                        className="p-3 border rounded-lg text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">
                              {quote.from_address} → {quote.to_address}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Flytt: {formatDate(quote.move_date)}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status === "completed" && "Genomförd"}
                            {quote.status === "offer_approved" && "Godkänd"}
                            {quote.status === "pending" && "Väntande"}
                            {quote.status === "offers_received" && "Offerter"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {selectedCustomer.quotes.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{selectedCustomer.quotes.length - 5} fler förfrågningar
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Reviews */}
              {selectedCustomer.reviews.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Omdömen ({selectedCustomer.reviews.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedCustomer.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-3 border rounded-lg text-sm"
                      >
                        <div className="flex items-center gap-1 mb-1">
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
                          <span className="ml-2 text-xs text-muted-foreground">
                            till {review.partner_name}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminCustomers;
