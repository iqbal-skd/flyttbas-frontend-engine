import { Link } from "react-router-dom";
import { Menu, X, Truck, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/flyttbas-logo.svg";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, isPartner } = useAuth();

  const navigation = [
    { name: "Hem", href: "/" },
    { name: "Privatflytt", href: "/privatflytt" },
    { name: "Kontorsflytt", href: "/kontorsflytt" },
    { name: "Priser", href: "/priser" },
    { name: "FAQ", href: "/faq" },
    { name: "Kontakt", href: "/kontakt" },
  ];

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isPartner) return "/partner";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Flyttbas" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/bli-partner" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Bli Partner
              </Link>
            </Button>
            {user ? (
              <>
                <Button size="sm" asChild>
                  <Link to={getDashboardLink()} className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    {isAdmin ? 'Admin' : isPartner ? 'Dashboard' : 'Mitt konto'}
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Logga in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/#quote-wizard">Jämför Offerter</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Stäng meny" : "Öppna meny"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link 
                  to="/bli-partner" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Truck className="h-4 w-4" />
                  Bli Partner
                </Link>
              </Button>
              {user ? (
                <Button size="sm" className="w-full" asChild>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isAdmin ? 'Admin Dashboard' : isPartner ? 'Partner Dashboard' : 'Mitt konto'}
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      Logga in
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/#quote-wizard" onClick={() => setMobileMenuOpen(false)}>
                      Jämför Offerter
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
