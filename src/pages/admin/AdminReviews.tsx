import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Building2,
  Calendar,
  Filter,
  Eye,
  EyeOff,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  partner_id: string;
  customer_id: string | null;
  offer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  partner_name?: string;
  customer_email?: string;
  is_hidden?: boolean;
  is_flagged?: boolean;
}

interface RatingStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

const AdminReviews = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [stats, setStats] = useState<RatingStats>({
    total: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const fetchReviews = useCallback(async () => {
    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          partners(company_name),
          profiles:customer_id(email)
        `);

      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (sortBy === "highest") {
        query = query.order("rating", { ascending: false });
      } else if (sortBy === "lowest") {
        query = query.order("rating", { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedReviews = (data || []).map(r => ({
        ...r,
        partner_name: (r.partners as any)?.company_name,
        customer_email: (r.profiles as any)?.email,
      }));

      setReviews(formattedReviews);

      // Calculate stats
      const total = formattedReviews.length;
      const sum = formattedReviews.reduce((acc, r) => acc + r.rating, 0);
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      formattedReviews.forEach(r => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });

      setStats({
        total,
        average: total > 0 ? sum / total : 0,
        distribution,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = reviews.filter(review => {
    if (ratingFilter === "all") return true;
    if (ratingFilter === "positive") return review.rating >= 4;
    if (ratingFilter === "neutral") return review.rating === 3;
    if (ratingFilter === "negative") return review.rating <= 2;
    return review.rating === parseInt(ratingFilter);
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating === 3) return "text-amber-600";
    return "text-red-600";
  };

  const positivePercentage = stats.total > 0
    ? ((stats.distribution[4] + stats.distribution[5]) / stats.total) * 100
    : 0;

  return (
    <AdminLayout title="Omdömen">
      {/* Stats Header */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Totalt omdömen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.average.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Snittbetyg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Star className="h-5 w-5 text-green-600 fill-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{positivePercentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Positiva (4-5 stjärnor)</p>
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
                <p className="text-2xl font-bold">
                  {stats.distribution[1] + stats.distribution[2]}
                </p>
                <p className="text-xs text-muted-foreground">Negativa (1-2 stjärnor)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Betygsfördelning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="w-16 text-sm text-muted-foreground text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Alla betyg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla betyg</SelectItem>
                <SelectItem value="positive">Positiva (4-5)</SelectItem>
                <SelectItem value="neutral">Neutrala (3)</SelectItem>
                <SelectItem value="negative">Negativa (1-2)</SelectItem>
                <SelectItem value="5">5 stjärnor</SelectItem>
                <SelectItem value="4">4 stjärnor</SelectItem>
                <SelectItem value="3">3 stjärnor</SelectItem>
                <SelectItem value="2">2 stjärnor</SelectItem>
                <SelectItem value="1">1 stjärna</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sortering" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Nyast först</SelectItem>
                <SelectItem value="oldest">Äldst först</SelectItem>
                <SelectItem value="highest">Högst betyg</SelectItem>
                <SelectItem value="lowest">Lägst betyg</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground ml-auto">
              Visar {filteredReviews.length} av {stats.total} omdömen
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Omdömen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner fullScreen={false} />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {reviews.length === 0 ? "Inga omdömen ännu" : "Inga omdömen matchar filtret"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`border rounded-lg p-4 ${
                    review.rating <= 2 ? "border-red-200 bg-red-50/50" : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`font-semibold ${getRatingColor(review.rating)}`}>
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      {review.comment ? (
                        <p className="text-sm mb-3">"{review.comment}"</p>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-3 italic">
                          Inget kommentar
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {review.partner_name || "Okänd partner"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(review.created_at)}
                        </span>
                        {review.customer_email && (
                          <span>av {review.customer_email}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {review.rating <= 2 && (
                        <Badge variant="outline" className="border-red-300 text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Lågt betyg
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
    </AdminLayout>
  );
};

export default AdminReviews;
