import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Home, Package, Truck, Shield, Star, Users, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const Privatflytt = () => {
  const isMobile = useIsMobile();

  const benefits = [
    "Jämför offerter från flera flyttfirmor",
    "Alla partners är verifierade och försäkrade",
    "Läs riktiga omdömen från tidigare kunder",
    "RUT-avdrag hanteras automatiskt",
    "Kundskydd vid alla bokningar",
    "100% gratis att använda"
  ];

  // Pricing configuration - same as Priser page
  const BUDGET_FROM = 495;
  const STANDARD_ADD = 200;
  const PREMIUM_ADD = 400;

  const packages = [
    {
      title: "Budgetflytt",
      price: BUDGET_FROM,
      description: "För dig som vill hålla nere kostnaden och packar själv.",
      features: [
        "2 erfarna flyttare",
        "Flyttbil + standardutrustning",
        "Lastning & lossning",
        "Försäkring ingår",
      ],
      featured: false,
    },
    {
      title: "Standardflytt",
      price: BUDGET_FROM + STANDARD_ADD,
      description: "Balanserad nivå – extra hjälp för en smidig och trygg flytt.",
      features: [
        "3 erfarna flyttare",
        "Större flyttbil",
        "Montering/demontering (grund)",
        "Mer packmaterial",
        "Försäkring ingår",
      ],
      featured: true,
      badge: "Mest valt",
    },
    {
      title: "Premium – Flytt + Flyttstäd",
      price: BUDGET_FROM + PREMIUM_ADD,
      description: "Helhetslösning – maximal avlastning med flyttstädning i samma bokning.",
      features: [
        "4 erfarna flyttare",
        "1–2 flyttbilar vid behov",
        "Full packning + montering/demontering",
        "Flyttstädning (helhetslösning)",
        "Försäkring ingår",
      ],
      featured: false,
    },
  ];

  const tooltipContent = {
    title: "Om pris, RUT-avdrag & tidsåtgång",
    text: "Priserna visas efter RUT-avdrag och är från-priser. Slutpris kan variera beroende på volym, våning/hiss, bärväg, avstånd, parkering, datum och tillval. Exakt pris och vad som ingår visas i offerten. Exempel på tidsåtgång vid flytt inom samma stad: 2 rok ca 3–5 h • 3 rok ca 5–7 h.",
  };

  const InfoTooltip = () => {
    if (isMobile) {
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <button
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 p-2 touch-manipulation"
              aria-label="Mer information om priser"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{tooltipContent.title}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <p className="text-muted-foreground">{tooltipContent.text}</p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Stäng</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="inline-flex items-center justify-center hover:text-foreground transition-colors"
            aria-label="Mer information om priser"
          >
            <Info className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h4 className="font-semibold mb-2">{tooltipContent.title}</h4>
          <p className="text-sm text-muted-foreground">{tooltipContent.text}</p>
        </PopoverContent>
      </Popover>
    );
  };

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
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Populära paket hos våra partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Våra verifierade flyttfirmor erbjuder paket för privatflytt. Priserna varierar – jämför offerter och hitta rätt flyttfirma för din flytt.
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Exempel på tidsåtgång vid flytt inom samma stad: 2 rok ca 3–5 h • 3 rok ca 5–7 h. Tiden påverkas av volym, våning/hiss, bärväg, avstånd och parkering.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`relative p-6 lg:p-8 flex flex-col ${
                    pkg.featured
                      ? 'border-2 border-orange shadow-lg ring-1 ring-orange/20'
                      : 'border border-border'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-orange text-white text-sm font-medium px-4 py-1 rounded-full">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className={pkg.badge ? 'mt-2' : ''}>
                    <h3 className="text-xl font-bold text-navy mb-2">{pkg.title}</h3>

                    <div className="mb-2">
                      <span className="text-3xl font-bold text-orange">
                        Från {pkg.price} kr/tim
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <span>Efter RUT-avdrag • från-pris</span>
                      <InfoTooltip />
                    </div>

                    <p className="text-muted-foreground text-sm mb-6">
                      {pkg.description}
                    </p>

                    <ul className="space-y-3 mb-6 flex-grow">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-orange flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={pkg.featured ? "default" : "outline"}
                      className={`w-full ${
                        pkg.featured
                          ? 'bg-navy hover:bg-navy/90 text-white'
                          : 'border-navy text-navy hover:bg-navy hover:text-white'
                      }`}
                      asChild
                    >
                      <Link to="/kontakt">Jämför offerter</Link>
                    </Button>
                  </div>
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
