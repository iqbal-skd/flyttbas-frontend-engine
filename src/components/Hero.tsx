import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Star, Users } from "lucide-react";
import { QuoteWizard } from "./quote-wizard";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy to-gray-blue text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
              <Star className="h-4 w-4 text-orange" />
              <span>Sveriges ledande flyttmarknadsplats</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Jämför Flyttfirmor & Spara Pengar
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Få 3-4 offerter från verifierade flyttfirmor i ditt område. Gratis, snabbt och utan förpliktelse.
            </p>
            
            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {[
                "Jämför priser från flera flyttfirmor",
                "Alla partners är försäkrade & licensierade",
                "RUT-avdrag – spara upp till 50%",
                "Gratis – ingen kostnad för dig",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" className="bg-orange hover:bg-orange/90 text-white" asChild>
                <a href="#quote-wizard">
                  Jämför offerter gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="hero" asChild>
                <Link to="/bli-partner">
                  <Users className="mr-2 h-5 w-5" />
                  Är du flyttfirma?
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange" />
                <span className="text-sm text-white/70">Verifierade partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-orange" />
                <span className="text-sm text-white/70">4.8 snittbetyg</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange" />
                <span className="text-sm text-white/70">2000+ nöjda kunder</span>
              </div>
            </div>
          </div>

          {/* Quick Quote Form */}
          <div>
            <QuoteWizard />
          </div>
        </div>
      </div>
    </section>
  );
};
