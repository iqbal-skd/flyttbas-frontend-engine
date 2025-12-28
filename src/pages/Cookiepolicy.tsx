import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Cookiepolicy = () => {
  // Load Cookiebot declaration script
  useEffect(() => {
    const container = document.getElementById("CookieDeclaration");
    if (container && !container.hasChildNodes()) {
      const script = document.createElement("script");
      script.id = "CookieDeclaration";
      script.src = "https://consent.cookiebot.com/uc.js";
      script.setAttribute("data-cbid", "00000000-0000-0000-0000-000000000000"); // Replace with actual Cookiebot ID
      script.setAttribute("data-culture", "sv");
      script.type = "text/javascript";
      script.async = true;
      container.appendChild(script);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookiepolicy | Flyttbas</title>
        <meta name="description" content="Information om hur Flyttbas använder cookies och liknande tekniker på webbplatsen." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <article className="prose prose-lg max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Cookiepolicy – Flyttbas
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Version:</strong> 2025-12-25
            </p>

            <p className="text-foreground/90 mb-8">
              Vi använder cookies och liknande tekniker (t.ex. pixlar) på flyttbas.se för att säkerställa att webbplatsen fungerar, för att analysera användning och för att möjliggöra marknadsföring.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">1. Samtycke och hantering (Cookiebot)</h2>
            <p className="text-foreground/90 mb-2">Vi använder <strong>Cookiebot</strong> för att:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>inhämta och lagra ditt samtycke,</li>
              <li>ge dig möjlighet att acceptera/avvisa cookies per kategori,</li>
              <li>låta dig ändra ditt samtycke när som helst.</li>
            </ul>
            <p className="text-foreground/90 mt-4">
              Du kan när som helst ändra eller återkalla ditt samtycke via cookie-inställningarna (länk/ikon på webbplatsen).
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">2. Kategorier av cookies</h2>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Nödvändiga</h3>
            <p className="text-foreground/90">
              Behövs för att webbplatsen ska fungera (t.ex. säkerhet, lastbalansering, samtyckeslagring).
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Preferenser</h3>
            <p className="text-foreground/90">
              Kommer ihåg val du gör (t.ex. språk/inställningar).
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Statistik (Analytics)</h3>
            <p className="text-foreground/90">
              Hjälper oss förstå hur webbplatsen används (t.ex. Google Analytics). Aktiveras endast efter samtycke.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Marknadsföring</h3>
            <p className="text-foreground/90">
              Används för att mäta kampanjer och visa mer relevant marknadsföring (t.ex. Meta Pixel). Aktiveras endast efter samtycke.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">3. Tjänster vi använder (exempel)</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Google Analytics</strong> (statistik) – aktiveras först efter samtycke i kategorin "Statistik".</li>
              <li><strong>Meta Pixel</strong> (marknadsföring/mätning) – aktiveras först efter samtycke i kategorin "Marknadsföring".</li>
              <li><strong>Cookiebot</strong> (samtycke) – används för att hantera dina cookie-val.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">4. Cookie-deklaration</h2>
            <p className="text-foreground/90 mb-4">
              Nedan visas en automatiskt uppdaterad lista över cookies, leverantörer och lagringstid:
            </p>
            
            {/* Cookiebot Declaration Container */}
            <div id="CookieDeclaration" className="bg-muted/50 p-6 rounded-lg min-h-[200px]">
              <p className="text-muted-foreground text-sm">
                Cookie-deklarationen laddas här. Om den inte visas, kontrollera att JavaScript är aktiverat i din webbläsare.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">5. Kontakt</h2>
            <p className="text-foreground/90">
              Frågor om cookies: <strong>info@flyttbas.se</strong>
            </p>
          </article>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Cookiepolicy;
