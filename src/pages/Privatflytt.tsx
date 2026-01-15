import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Home, Package, Truck, Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Privatflytt = () => {
  const benefits = [
    "Jämför offerter från flera flyttfirmor",
    "Alla partners är verifierade och försäkrade",
    "Läs riktiga omdömen från tidigare kunder",
    "RUT-avdrag hanteras automatiskt",
    "Kundskydd vid alla bokningar",
    "100% gratis att använda"
  ];

  const packages = [
    {
      title: "Budgetflytt",
      price: "Från 995 kr/tim",
      features: [
        "2 erfarna flyttare",
        "Flyttbil med utrustning",
        "Grundläggande packmaterial",
        "Försäkring ingår"
      ]
    },
    {
      title: "Standardflytt",
      price: "Från 1295 kr/tim",
      features: [
        "3 erfarna flyttare",
        "Större flyttbil",
        "Omfattande packmaterial",
        "Montering/demontering",
        "Försäkring ingår"
      ],
      popular: true
    },
    {
      title: "Premiumflytt",
      price: "Från 1595 kr/tim",
      features: [
        "4 erfarna flyttare",
        "Stor flyttbil",
        "Fullständig packning",
        "Montering/demontering",
        "Flyttstädning",
        "Försäkring ingår"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Hitta Flyttfirma för Privatflytt Stockholm – Jämför Offerter</title>
        <meta name="description" content="Jämför offerter från verifierade flyttfirmor för din privatflytt i Stockholm. Från lägenhet till villa. RUT-avdrag 50%. Gratis att använda!" />
        <link rel="canonical" href="https://flyttbas.se/privatflytt" />
        <meta property="og:title" content="Hitta Flyttfirma för Privatflytt Stockholm" />
        <meta property="og:description" content="Jämför offerter från verifierade flyttfirmor. Hitta bästa priset för din privatflytt." />
        <meta property="og:url" content="https://flyttbas.se/privatflytt" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hitta Flyttfirma för Din Privatflytt
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Jämför offerter från verifierade flyttfirmor i Stockholm. Vi matchar dig med erfarna partners som passar just din flytt.
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

        {/* Benefits Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Fördelar med att använda Flyttbas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-orange flex-shrink-0 mt-1" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-navy">Populära paket hos våra partners</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Våra verifierade flyttfirmor erbjuder olika paket. Priserna varierar – jämför för att hitta bästa erbjudandet.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <Card key={index} className={`p-6 relative ${pkg.popular ? 'border-orange border-2' : ''}`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mest valt
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-navy">{pkg.title}</h3>
                  <p className="text-2xl font-bold text-orange mb-6">{pkg.price}</p>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-orange flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"} asChild>
                    <Link to="/kontakt">Jämför priser</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Så hittar du rätt flyttfirma</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Home, title: "1. Beskriv flytten", desc: "Fyll i formuläret med datum, storlek och önskemål" },
                { icon: Users, title: "2. Få offerter", desc: "Verifierade flyttfirmor skickar sina bästa priser" },
                { icon: Star, title: "3. Jämför & välj", desc: "Läs omdömen och jämför priser innan du bestämmer dig" },
                { icon: Truck, title: "4. Flytta tryggt", desc: "Boka den firma du gillar bäst – med kundskydd" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-orange" />
                  </div>
                  <h3 className="font-bold mb-2 text-navy">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Redo att hitta din flyttfirma?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Jämför offerter från verifierade flyttfirmor – helt gratis och utan förpliktelser.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Jämför offerter nu</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Privatflytt;
