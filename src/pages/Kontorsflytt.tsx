import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Building2, Clock, Shield, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Kontorsflytt = () => {
  const features = [
    "Specialiserade på kontors- och företagsflytt",
    "Flytt utanför kontorstid möjlig",
    "Professionell IT-hantering",
    "Möbeldemontering och montering",
    "Projektledning vid större flyttar",
    "Fullständig försäkring"
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Minimal störning",
      desc: "Partners som flyttar kvällar och helger för att minimera driftstörning"
    },
    {
      icon: Shield,
      title: "Säker hantering",
      desc: "Specialutbildade team för IT-utrustning och känslig kontorsutrustning"
    },
    {
      icon: Building2,
      title: "Erfarenhet",
      desc: "Våra partners har genomfört hundratals kontorsflytt i Stockholm"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Hitta Flyttfirma för Kontorsflytt Stockholm – Jämför Offerter</title>
        <meta name="description" content="Jämför offerter från verifierade flyttfirmor för kontorsflytt i Stockholm. Minimal driftsstörning, IT-flytt och projektledning. Gratis att använda!" />
        <link rel="canonical" href="https://flyttbas.se/kontorsflytt" />
        <meta property="og:title" content="Hitta Flyttfirma för Kontorsflytt Stockholm" />
        <meta property="og:description" content="Jämför offerter för professionell kontorsflytt. Verifierade partners med erfarenhet." />
        <meta property="og:url" content="https://flyttbas.se/kontorsflytt" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hitta Flyttfirma för Kontorsflytt
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Jämför offerter från verifierade partners som specialiserar sig på kontorsflytt. Vi matchar er med erfarna firmor som minimerar driftstörningar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
                  <Link to="/kontakt">Jämför offerter</Link>
                </Button>
                <Button size="lg" variant="hero" asChild>
                  <Link to="/faq">Hur det fungerar</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vad våra partners erbjuder</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-orange flex-shrink-0 mt-1" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Varför jämföra på Flyttbas?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="bg-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-orange" />
                  </div>
                  <h3 className="font-bold mb-2 text-navy">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Så fungerar det</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                { step: "1", title: "Beskriv er flytt", desc: "Fyll i formuläret med uppgifter om ert kontor och flytten" },
                { step: "2", title: "Få offerter", desc: "Verifierade partners skickar sina bästa erbjudanden" },
                { step: "3", title: "Jämför och välj", desc: "Läs omdömen, jämför priser och välj den firma som passar er" },
                { step: "4", title: "Platsbesök", desc: "Den valda firman gör ett platsbesök för exakt offert" },
                { step: "5", title: "Flytten genomförs", desc: "Er nya partner genomför flytten enligt plan" }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="bg-orange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-navy">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Planerar ni en kontorsflytt?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Jämför offerter från verifierade partners – helt gratis och utan förpliktelser.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Jämför offerter</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Kontorsflytt;
