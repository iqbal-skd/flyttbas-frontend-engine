import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "./AdminSidebar";
import { LoadingSpinner } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface AdminStats {
  pendingPartners: number;
  pendingQuotes: number;
  pendingOffers: number;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, isAdmin, loading, signOut, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    pendingPartners: 0,
    pendingQuotes: 0,
    pendingOffers: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && rolesLoaded && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, rolesLoaded, navigate]);

  useEffect(() => {
    if (rolesLoaded && isAdmin) {
      fetchStats();
    }
  }, [isAdmin, rolesLoaded]);

  const fetchStats = async () => {
    const [partnersRes, quotesRes, offersRes] = await Promise.all([
      supabase
        .from("partners")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("offers")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    setStats({
      pendingPartners: partnersRes.count || 0,
      pendingQuotes: quotesRes.count || 0,
      pendingOffers: offersRes.count || 0,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !rolesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner fullScreen={false} />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <AdminSidebar stats={stats} />

      {/* Main Content */}
      <div className={cn("transition-all duration-300 ml-64")}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {title && <h1 className="text-xl font-semibold">{title}</h1>}
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {(stats.pendingPartners > 0 || stats.pendingQuotes > 0) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2">
                  <p className="font-medium mb-2">Notifieringar</p>
                  {stats.pendingPartners > 0 && (
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-sm mb-2">
                      {stats.pendingPartners} partners väntar på granskning
                    </div>
                  )}
                  {stats.pendingQuotes > 0 && (
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-800 text-sm mb-2">
                      {stats.pendingQuotes} nya förfrågningar
                    </div>
                  )}
                  {stats.pendingPartners === 0 && stats.pendingQuotes === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Inga nya notifieringar
                    </p>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm">
                    {user?.email?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logga ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
