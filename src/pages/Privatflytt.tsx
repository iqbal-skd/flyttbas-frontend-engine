import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Home, Package, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Privatflytt = () => {
  const services = [
    "Professionell packning av bohag",
    "Säker transport av möbler",
    "Montering och demontering",
    "Flyttstädning tillgänglig",
    "Försäkring ingår",
    "RUT-avdrag upp till 50%"
  ];

  const packages = [
    {
      title: "Baspaket",
      price: "Från 995 kr/tim",
      features: [
        "2 erfarna flyttare",
        "Flyttbil med utrustning",
        "Grundläggande packmaterial",
        "Försäkring ingår"
      ]
    },
    {
      title: "Standardpaket",
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
      title: "Premiumpaket",
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
        <title>Privatflytt Stockholm – Från 995 kr/tim | RUT-avdrag 50%</title>
        <meta name="description" content="Professionell privatflytt i Stockholm. Från lägenhet till villa. Inkl. packning, transport & montering. RUT-avdrag direkt. Boka idag!" />
        <link rel="canonical" href="https://flyttbas.se/privatflytt" />
        <meta property="og:title" content="Privatflytt Stockholm – Professionell flyttjänst" />
        <meta property="og:description" content="Smidig och säker privatflytt i Stockholm. Från 995 kr/tim med RUT-avdrag." />
        <meta property="og:url" content="https://flyttbas.se/privatflytt" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Privatflytt i Stockholm
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Vi hjälper dig med en smidig och trygg flytt av ditt hem. Från lägenhet till villa – vi hanterar allt professionellt.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
                  <Link to="/kontakt">Få offert</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <a href="tel:+46701234567">Ring oss</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vad ingår i privatflytt?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-orange flex-shrink-0 mt-1" />
                  <span className="text-foreground">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-navy">Våra paket för privatflytt</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Välj det paket som passar din flytt bäst. Alla priser är efter RUT-avdrag.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <Card key={index} className={`p-6 relative ${pkg.popular ? 'border-orange border-2' : ''}`}>
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                      Populärast
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
                    <Link to="/kontakt">Välj paket</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Så fungerar det</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Home, title: "1. Offert", desc: "Berätta om din flytt och få ett prisförslag direkt" },
                { icon: Package, title: "2. Bokning", desc: "Välj datum och bekräfta din bokning" },
                { icon: Truck, title: "3. Packning", desc: "Vi packar och förbereder allt för flytten" },
                { icon: Check, title: "4. Flytt", desc: "Vi flyttar ditt bohag säkert till nya hemmet" }
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
            <h2 className="text-3xl font-bold mb-4">Redo att flytta?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Få en kostnadsfri offert idag och låt oss göra din flytt enkel och smidig.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Få offert nu</Link>
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
