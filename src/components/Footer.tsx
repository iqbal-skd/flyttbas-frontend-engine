import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/flyttbas-logo-white.svg";

export const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Flyttbas" className="h-8 w-auto mb-4" />
            <p className="text-sm text-white/80">
              Flyttbas är en jämförelsetjänst för flytt och flyttstäd där du jämför offerter från verifierade flyttfirmor.
            </p>
          </div>

          {/* Tjänster */}
          <div>
            <h3 className="font-semibold mb-4">Hitta Flyttfirma</h3>
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
                  Kundcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Guider & Checklistor */}
          <div>
            <h3 className="font-semibold mb-4">Guider & Checklistor</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/guider/vad-kostar-en-flytt" className="text-white/80 hover:text-white transition-colors">
                  Vad kostar en flytt?
                </Link>
              </li>
              <li>
                <Link to="/guider/jamfor-flyttfirmor" className="text-white/80 hover:text-white transition-colors">
                  Jämför flyttfirmor
                </Link>
              </li>
              <li>
                <Link to="/guider/fast-pris-vs-timpris" className="text-white/80 hover:text-white transition-colors">
                  Fast pris vs timpris
                </Link>
              </li>
              <li>
                <Link to="/checklistor/flytt-checklista" className="text-white/80 hover:text-white transition-colors">
                  Flyttchecklista
                </Link>
              </li>
              <li>
                <Link to="/checklistor/flyttstadning-checklista" className="text-white/80 hover:text-white transition-colors">
                  Flyttstädning checklista
                </Link>
              </li>
              <li>
                <Link to="/checklistor/kontorsflytt-checklista" className="text-white/80 hover:text-white transition-colors">
                  Kontorsflytt checklista
                </Link>
              </li>
              <li>
                <Link to="/checklistor/dodsbo-checklista" className="text-white/80 hover:text-white transition-colors">
                  Dödsbo checklista
                </Link>
              </li>
              <li>
                <Link to="/checklistor/magasinering-checklista" className="text-white/80 hover:text-white transition-colors">
                  Magasinering checklista
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/om-oss" className="text-white/80 hover:text-white transition-colors">
                  Om Flyttbas
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                  Vanliga frågor
                </Link>
              </li>
              <li>
                <Link to="/blogg" className="text-white/80 hover:text-white transition-colors">
                  Blogg
                </Link>
              </li>
              <li>
                <Link to="/bli-partner" className="text-white/80 hover:text-white transition-colors">
                  Bli partner
                </Link>
              </li>
              <li>
                <Link to="/allmanna-villkor" className="text-white/80 hover:text-white transition-colors">
                  Allmänna villkor
                </Link>
              </li>
              <li>
                <Link to="/integritetspolicy" className="text-white/80 hover:text-white transition-colors">
                  Integritetspolicy
                </Link>
              </li>
              <li>
                <Link to="/cookiepolicy" className="text-white/80 hover:text-white transition-colors">
                  Cookiepolicy
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@flyttbas.se" className="text-white/80 hover:text-white transition-colors">
                  info@flyttbas.se
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-white/80">Industrivägen 10, 135 40 Tyresö</span>
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
