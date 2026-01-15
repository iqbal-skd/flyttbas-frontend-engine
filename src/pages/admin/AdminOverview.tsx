import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  FileText,
  Send,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";
import type { AdminDashboardStats, AttentionItem, ActivityItem } from "@/types/admin";

const AdminOverview = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    pendingPartners: 0,
    activePartners: 0,
    suspendedPartners: 0,
    pendingQuotes: 0,
    quotesToday: 0,
    quotesThisWeek: 0,
    pendingOffers: 0,
    activeJobs: 0,
    completedJobsThisMonth: 0,
    totalCustomers: 0,
    totalReviews: 0,
    averageRating: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [funnelData, setFunnelData] = useState({
    newQuotes: 0,
    withOffers: 0,
    offerApproved: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
      const today = new Date().toISOString().split('T')[0];

      // Fetch all stats in parallel
      const [
        partnersRes,
        quotesRes,
        quotesTodayRes,
        quotesWeekRes,
        offersRes,
        activeJobsRes,
        completedJobsRes,
        customersRes,
        reviewsRes,
        avgRatingRes,
        revenueThisMonthRes,
        revenueLastMonthRes,
        totalRevenueRes,
        // Funnel data
        funnelPendingRes,
        funnelOffersRes,
        funnelApprovedRes,
        funnelCompletedRes,
      ] = await Promise.all([
        // Partners
        supabase.from("partners").select("status"),
        // Quotes
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", startOfWeek),
        // Offers
        supabase.from("offers").select("id", { count: "exact", head: true }).eq("status", "pending"),
        // Jobs
        supabase.from("offers").select("id", { count: "exact", head: true }).in("job_status", ["confirmed", "scheduled", "in_progress"]),
        supabase.from("offers").select("id", { count: "exact", head: true }).eq("job_status", "completed").gte("job_status_updated_at", startOfMonth),
        // Customers
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        // Reviews
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("average_rating").not("average_rating", "is", null),
        // Revenue
        supabase.from("commission_fees").select("fee_amount").gte("created_at", startOfMonth),
        supabase.from("commission_fees").select("fee_amount").gte("created_at", startOfLastMonth).lte("created_at", endOfLastMonth),
        supabase.from("commission_fees").select("fee_amount"),
        // Funnel (last 30 days)
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "offers_received").gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "offer_approved").gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "completed").gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      // Calculate partner stats
      const partnerData = partnersRes.data || [];
      const pendingPartners = partnerData.filter(p => p.status === "pending").length;
      const activePartners = partnerData.filter(p => p.status === "approved").length;
      const suspendedPartners = partnerData.filter(p => p.status === "suspended").length;

      // Calculate average rating
      const ratings = avgRatingRes.data || [];
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, p) => sum + (p.average_rating || 0), 0) / ratings.length
        : 0;

      // Calculate revenue
      const revenueThisMonth = (revenueThisMonthRes.data || []).reduce((sum, f) => sum + f.fee_amount, 0);
      const revenueLastMonth = (revenueLastMonthRes.data || []).reduce((sum, f) => sum + f.fee_amount, 0);
      const totalRevenue = (totalRevenueRes.data || []).reduce((sum, f) => sum + f.fee_amount, 0);

      // Calculate conversion rate
      const totalQuotes = funnelPendingRes.count || 0;
      const completedQuotes = funnelCompletedRes.count || 0;
      const conversionRate = totalQuotes > 0 ? (completedQuotes / totalQuotes) * 100 : 0;

      setStats({
        pendingPartners,
        activePartners,
        suspendedPartners,
        pendingQuotes: quotesRes.count || 0,
        quotesToday: quotesTodayRes.count || 0,
        quotesThisWeek: quotesWeekRes.count || 0,
        pendingOffers: offersRes.count || 0,
        activeJobs: activeJobsRes.count || 0,
        completedJobsThisMonth: completedJobsRes.count || 0,
        totalCustomers: customersRes.count || 0,
        totalReviews: reviewsRes.count || 0,
        averageRating: avgRating,
        revenueThisMonth,
        revenueLastMonth,
        totalRevenue,
        conversionRate,
      });

      setFunnelData({
        newQuotes: funnelPendingRes.count || 0,
        withOffers: funnelOffersRes.count || 0,
        offerApproved: funnelApprovedRes.count || 0,
        completed: funnelCompletedRes.count || 0,
      });

      // Fetch attention items
      await fetchAttentionItems();

      // Fetch recent activity
      await fetchRecentActivity();

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAttentionItems = async () => {
    const items: AttentionItem[] = [];
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Partners pending > 48h
    const { data: oldPartners } = await supabase
      .from("partners")
      .select("id, company_name, created_at")
      .eq("status", "pending")
      .lt("created_at", twoDaysAgo);

    oldPartners?.forEach(p => {
      items.push({
        id: `partner-${p.id}`,
        type: "partner",
        severity: "warning",
        title: `Partner väntar på granskning`,
        description: `${p.company_name} har väntat i mer än 48 timmar`,
        entityId: p.id,
        timestamp: p.created_at,
        actionLabel: "Granska",
        actionHref: `/admin/partners?id=${p.id}`,
      });
    });

    // Quotes expiring soon
    const { data: expiringQuotes } = await supabase
      .from("quote_requests")
      .select("id, customer_name, expires_at")
      .eq("status", "pending")
      .lt("expires_at", tomorrow)
      .not("expires_at", "is", null);

    expiringQuotes?.forEach(q => {
      items.push({
        id: `quote-${q.id}`,
        type: "quote",
        severity: "urgent",
        title: `Förfrågan löper ut snart`,
        description: `${q.customer_name}'s förfrågan löper ut inom 24 timmar`,
        entityId: q.id,
        timestamp: q.expires_at!,
        actionLabel: "Visa",
        actionHref: `/admin/quotes?id=${q.id}`,
      });
    });

    // Jobs stuck in progress > 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: stuckJobs } = await supabase
      .from("offers")
      .select("id, job_status_updated_at, partners(company_name)")
      .eq("job_status", "in_progress")
      .lt("job_status_updated_at", sevenDaysAgo);

    stuckJobs?.forEach(j => {
      items.push({
        id: `job-${j.id}`,
        type: "job",
        severity: "warning",
        title: `Jobb fastnat i "pågående"`,
        description: `${(j.partners as any)?.company_name || 'Partner'}'s jobb har varit pågående i mer än 7 dagar`,
        entityId: j.id,
        timestamp: j.job_status_updated_at!,
        actionLabel: "Hantera",
        actionHref: `/admin/offers?id=${j.id}`,
      });
    });

    setAttentionItems(items.slice(0, 5));
  };

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setRecentActivity(
        data.map(log => ({
          id: log.id,
          type: log.action,
          action: log.action,
          entityType: log.entity_type,
          entityId: log.entity_id,
          userId: log.user_id,
          timestamp: log.created_at,
          details: log.new_data as Record<string, unknown> | undefined,
        }))
      );
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("sv-SE").format(amount);
  };

  const revenueChange = stats.revenueLastMonth > 0
    ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100
    : 0;

  return (
    <AdminLayout title="Översikt">
      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingPartners}</p>
                <p className="text-xs text-muted-foreground">Väntande partners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activePartners}</p>
                <p className="text-xs text-muted-foreground">Aktiva partners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.quotesToday}</p>
                <p className="text-xs text-muted-foreground">Förfrågningar idag</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Send className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeJobs}</p>
                <p className="text-xs text-muted-foreground">Aktiva jobb</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</p>
                <p className="text-xs text-muted-foreground">Intäkt denna månad</p>
              </div>
            </div>
            {revenueChange !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(revenueChange).toFixed(0)}% vs förra månaden
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Snittbetyg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Konverteringstratt (30 dagar)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Nya förfrågningar", value: funnelData.newQuotes, color: "bg-blue-500" },
                  { label: "Fått offerter", value: funnelData.withOffers, color: "bg-cyan-500" },
                  { label: "Offert godkänd", value: funnelData.offerApproved, color: "bg-green-500" },
                  { label: "Genomförda", value: funnelData.completed, color: "bg-emerald-500" },
                ].map((stage, index) => {
                  const percentage = funnelData.newQuotes > 0
                    ? (stage.value / funnelData.newQuotes) * 100
                    : 0;
                  return (
                    <div key={stage.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{stage.label}</span>
                        <span className="font-medium">
                          {stage.value}
                          {index > 0 && funnelData.newQuotes > 0 && (
                            <span className="text-muted-foreground ml-1">
                              ({percentage.toFixed(0)}%)
                            </span>
                          )}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Konverteringsgrad:{" "}
                  <span className="font-semibold text-foreground">
                    {stats.conversionRate.toFixed(1)}%
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Denna vecka</h3>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Förfrågningar</span>
                    <span className="font-medium">{stats.quotesThisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Genomförda jobb</span>
                    <span className="font-medium">{stats.completedJobsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nya omdömen</span>
                    <span className="font-medium">{stats.totalReviews}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Totalt</h3>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kunder</span>
                    <span className="font-medium">{stats.totalCustomers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Partners</span>
                    <span className="font-medium">{stats.activePartners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total intäkt</span>
                    <span className="font-medium">{formatCurrency(stats.totalRevenue)} kr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Attention Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Kräver uppmärksamhet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attentionItems.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Allt ser bra ut!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attentionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border ${
                        item.severity === "urgent"
                          ? "border-red-200 bg-red-50"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-medium ${
                            item.severity === "urgent" ? "text-red-800" : "text-amber-800"
                          }`}>
                            {item.title}
                          </p>
                          <p className={`text-xs ${
                            item.severity === "urgent" ? "text-red-600" : "text-amber-600"
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        {item.actionHref && (
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="shrink-0 h-7"
                          >
                            <Link to={item.actionHref}>
                              {item.actionLabel}
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Senaste aktivitet</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin/audit">
                    Visa alla
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Ingen aktivitet registrerad
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          <span className="font-medium">{activity.action}</span>
                          {activity.entityType && (
                            <span className="text-muted-foreground">
                              {" "}på {activity.entityType}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString("sv-SE", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Snabblänkar</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm" className="justify-start">
                <Link to="/admin/partners">
                  <Building2 className="h-4 w-4 mr-2" />
                  Partners
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="justify-start">
                <Link to="/admin/quotes">
                  <FileText className="h-4 w-4 mr-2" />
                  Förfrågningar
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="justify-start">
                <Link to="/admin/customers">
                  <Users className="h-4 w-4 mr-2" />
                  Kunder
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="justify-start">
                <Link to="/admin/reviews">
                  <Star className="h-4 w-4 mr-2" />
                  Omdömen
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
