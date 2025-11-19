import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/assets/flyttbas-logo.svg";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Hem", href: "/" },
    { name: "Privatflytt", href: "/privatflytt" },
    { name: "Kontorsflytt", href: "/kontorsflytt" },
    { name: "Priser", href: "/priser" },
    { name: "Case", href: "/case" },
    { name: "FAQ", href: "/faq" },
    { name: "Kontakt", href: "/kontakt" },
  ];

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
              <a href="tel:+46701234567" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Ring oss
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/kontakt">Få offert</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                <a href="tel:+46701234567" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  Ring oss
                </a>
              </Button>
              <Button size="sm" className="w-full" asChild>
                <Link to="/kontakt">Få offert</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
