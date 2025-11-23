import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { QuickQuoteForm } from "./QuickQuoteForm";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-navy via-navy to-gray-blue text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Professionell Flytthjälp i Stockholm
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Få fastpris direkt, garanterat 0 skador och upp till 50% RUT-avdrag. 
              Vi gör din flytt smidig och stressfri.
            </p>
            
            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {[
                "Fastpris – inga dolda kostnader",
                "RUT-avdrag upp till 50%",
                "Garanterat 0 skador",
                "Försäkring inkluderad",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange flex-shrink-0" />
                  <span className="text-white/90">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" className="bg-orange hover:bg-orange/90 text-white">
                Få offert nu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="hero">
                Ring oss: 070-123 45 67
              </Button>
            </div>
          </div>

          {/* Quick Quote Form */}
          <div>
            <QuickQuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
};
