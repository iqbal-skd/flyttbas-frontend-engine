import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Building2, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Kontorsflytt = () => {
  const features = [
    "Flytt utanför kontorstid",
    "Professionell IT-flytt",
    "Möbeldemontering och montering",
    "Märkning och inventering",
    "Projektledning ingår",
    "Fullständig försäkring"
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Minimal störning",
      desc: "Vi flyttar på kvällar/helger för att inte störa verksamheten"
    },
    {
      icon: Shield,
      title: "Säker hantering",
      desc: "Specialutbildade i IT-utrustning och känslig kontorsutrustning"
    },
    {
      icon: Building2,
      title: "Erfarna projektledare",
      desc: "Dedikerad projektledare för större kontorsflytt"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Kontorsflytt Stockholm – Minimal störning | Professionell</title>
        <meta name="description" content="Kontorsflytt i Stockholm med minimal driftsstörning. Flyttar kvällar & helger. IT-flytt, möbler & projektledning. Få offert idag!" />
        <link rel="canonical" href="https://flyttbas.se/kontorsflytt" />
        <meta property="og:title" content="Kontorsflytt Stockholm – Professionell kontorsflytt" />
        <meta property="og:description" content="Professionell kontorsflytt med minimal störning. Vi flyttar på kvällar och helger." />
        <meta property="og:url" content="https://flyttbas.se/kontorsflytt" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Kontorsflytt i Stockholm
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Professionell kontorsflytt med minimal störning av er verksamhet. Vi hanterar allt från små startups till stora kontor.
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

        {/* Features Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vad ingår i kontorsflytt?</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Varför välja oss för kontorsflytt?</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vår process</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                { step: "1", title: "Platsbesök & offert", desc: "Vi besöker er nuvarande och nya lokal för att ge en exakt offert" },
                { step: "2", title: "Planering", desc: "Vi skapar en detaljerad plan med tidslinje och ansvariga" },
                { step: "3", title: "Märkning & packning", desc: "All utrustning märks och packas systematiskt" },
                { step: "4", title: "Flytt & installation", desc: "Vi flyttar och installerar allt på den nya lokalen" },
                { step: "5", title: "Uppföljning", desc: "Vi säkerställer att allt fungerar och ni är nöjda" }
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
              Kontakta oss för ett kostnadsfritt platsbesök och offert.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Boka platsbesök</Link>
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
