import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Send,
  Users,
  Star,
  DollarSign,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  stats?: {
    pendingPartners?: number;
    pendingQuotes?: number;
    pendingOffers?: number;
  };
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar = ({ stats, mobileOpen, onMobileClose }: AdminSidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      items: [
        {
          label: "Översikt",
          href: "/admin",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Hantera",
      items: [
        {
          label: "Partners",
          href: "/admin/partners",
          icon: Building2,
          badge: stats?.pendingPartners,
        },
        {
          label: "Förfrågningar",
          href: "/admin/quotes",
          icon: FileText,
          badge: stats?.pendingQuotes,
        },
        {
          label: "Offerter & Jobb",
          href: "/admin/offers",
          icon: Send,
          badge: stats?.pendingOffers,
        },
        {
          label: "Kunder",
          href: "/admin/customers",
          icon: Users,
        },
        {
          label: "Omdömen",
          href: "/admin/reviews",
          icon: Star,
        },
      ],
    },
    {
      title: "Ekonomi",
      items: [
        {
          label: "Fakturering",
          href: "/admin/billing",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Insikter",
      items: [
        {
          label: "Analys",
          href: "/admin/analytics",
          icon: BarChart3,
        },
        {
          label: "Aktivitetslogg",
          href: "/admin/audit",
          icon: ScrollText,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Användare",
          href: "/admin/users",
          icon: UserCog,
        },
        {
          label: "Inställningar",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          // Mobile: hidden by default, shown when mobileOpen
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-semibold">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="py-2">
            {group.title && !collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    "hover:bg-secondary",
                    active && "bg-primary/10 text-primary font-medium",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                  onClick={onMobileClose}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge != null && item.badge > 0 && (
                    <span className="absolute right-1 top-1 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
    </>
  );
};
