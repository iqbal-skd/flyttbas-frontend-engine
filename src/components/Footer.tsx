import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/flyttbas-logo-white.svg";

export const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src={logo} alt="Flyttbas" className="h-8 w-auto mb-4" />
            <p className="text-sm text-white/80">
              Professionell flytthjälp i Stockholm med garanterat 0 skador och RUT-avdrag.
            </p>
          </div>

          {/* Tjänster */}
          <div>
            <h3 className="font-semibold mb-4">Tjänster</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privatflytt" className="text-white/80 hover:text-white transition-colors">
                  Privatflytt
                </Link>
              </li>
              <li>
                <Link to="/kontorsflytt" className="text-white/80 hover:text-white transition-colors">
                  Kontorsflytt
                </Link>
              </li>
              <li>
                <Link to="/priser" className="text-white/80 hover:text-white transition-colors">
                  Priser
                </Link>
              </li>
              <li>
                <Link to="/case" className="text-white/80 hover:text-white transition-colors">
                  Case
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om" className="text-white/80 hover:text-white transition-colors">
                  Om oss
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blogg" className="text-white/80 hover:text-white transition-colors">
                  Blogg
                </Link>
              </li>
              <li>
                <Link to="/juridik" className="text-white/80 hover:text-white transition-colors">
                  Juridik & Villkor
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+46701234567" className="text-white/80 hover:text-white transition-colors">
                  070-123 45 67
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@flyttbas.se" className="text-white/80 hover:text-white transition-colors">
                  info@flyttbas.se
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Stockholm, Sverige</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Flyttbas. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};
