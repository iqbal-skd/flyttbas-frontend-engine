import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { QuoteWizard } from "@/components/quote-wizard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
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

const Priser = () => {
  const isMobile = useIsMobile();

  // Pricing configuration
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

  const scrollToQuoteForm = () => {
    const quoteSection = document.getElementById('quote-form');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Jämför Priser Flyttfirmor Stockholm 2024 – Hitta Bästa Priset</title>
        <meta name="description" content="Jämför priser från verifierade flyttfirmor i Stockholm. Se prisexempel och hitta bästa erbjudandet. RUT-avdrag 50%. Gratis att använda!" />
        <link rel="canonical" href="https://flyttbas.se/priser" />
        <meta property="og:title" content="Jämför priser från flyttfirmor i Stockholm" />
        <meta property="og:description" content="Se prisexempel och jämför offerter. Hitta bästa priset för din flytt." />
        <meta property="og:url" content="https://flyttbas.se/priser" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Jämför priser från flyttfirmor
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Se vad en flytt brukar kosta och jämför offerter för att hitta bästa priset.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="py-16 md:py-20 bg-light-bg">
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
                      onClick={scrollToQuoteForm}
                      variant={pkg.featured ? "default" : "outline"}
                      className={`w-full ${
                        pkg.featured 
                          ? 'bg-navy hover:bg-navy/90 text-white' 
                          : 'border-navy text-navy hover:bg-navy hover:text-white'
                      }`}
                    >
                      Jämför offerter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Quote Form */}
        <section id="quote-form" className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 md:mb-8 text-navy">
                Få offerter från flyttfirmor
              </h2>
              <QuoteWizard />
            </div>
          </div>
        </section>

        {/* RUT Info */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4 items-start bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-navy">Om RUT-avdrag</h3>
                  <p className="text-muted-foreground mb-3">
                    RUT-avdraget ger dig 50% rabatt på arbetskostnaden, upp till ett maxbelopp per år. 
                    Alla våra verifierade partners hanterar RUT-avdraget automatiskt.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Maxbelopp:</strong> 75 000 kr per person och år (vilket motsvarar 150 000 kr i arbetskostnad)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Priser;
