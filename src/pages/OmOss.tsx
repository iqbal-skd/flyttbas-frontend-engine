import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Scale, Users } from "lucide-react";

const OmOss = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Om Flyttbas | Oberoende jämförelseplattform för flytt</title>
        <meta name="description" content="Flyttbas är en oberoende jämförelseplattform som matchar privatpersoner och företag med verifierade flyttfirmor i hela Sverige." />
        <link rel="canonical" href="https://flyttbas.se/om-oss" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Om Flyttbas
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Flyttbas är en oberoende jämförelseplattform som matchar privatpersoner och företag med verifierade flyttfirmor i hela Sverige.
              </p>
            </div>
          </div>
        </section>

        {/* Positioning Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Vad är Flyttbas?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Flyttbas är en oberoende jämförelseplattform för flytt och flyttstäd.
                </p>
                <p>
                  Vi standardiserar flyttförfrågningar så att användare kan jämföra pris, villkor och vad som ingår på samma underlag – innan de väljer flyttfirma.
                </p>
                <p>
                  Vi hjälper användare att jämföra offerter baserat på pris, villkor och innehåll på ett strukturerat och jämförbart sätt.
                </p>
                <p className="font-medium text-foreground">
                  Flyttbas utför inga flyttar och är inte en leadlista.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-foreground">
                Så fungerar Flyttbas
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scale className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Oberoende jämförelse</h3>
                  <p className="text-muted-foreground">
                    Vi standardiserar förfrågningar så att offerter blir jämförbara.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Verifierade partners</h3>
                  <p className="text-muted-foreground">
                    Vi samarbetar endast med seriösa flyttfirmor som uppfyller våra krav.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Direkt avtal</h3>
                  <p className="text-muted-foreground">
                    Avtal ingås alltid direkt mellan dig och vald utförare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsibility Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                Ansvar & villkor
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  Flyttbas tillhandahåller en jämförelsetjänst för flytt- och städtjänster.
                </p>
                <p>
                  Avtal ingås alltid direkt mellan användaren och vald utförare.
                </p>
                <p>
                  Flyttbas ansvarar för jämförelsen och presentationen av offerter, men inte för prissättning, utförande eller resultat av tjänsten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Redo att jämföra flyttfirmor?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Beskriv din flytt och jämför offerter på samma underlag.
            </p>
            <Button size="lg" asChild>
              <Link to="/#quote-wizard">
                Jämför offerter gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OmOss;
