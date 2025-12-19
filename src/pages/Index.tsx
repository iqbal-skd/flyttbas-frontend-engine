import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { ChatLauncher } from "@/components/ChatLauncher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Building2, Package, ArrowRight, Star, Shield, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const services = [
    {
      icon: Home,
      title: "Privatflytt",
      description: "Hitta erfarna flyttfirmor för din hemflytt. Från lägenhet till villa.",
      href: "/privatflytt",
    },
    {
      icon: Building2,
      title: "Kontorsflytt",
      description: "Specialiserade partners för företagsflytt med minimal driftstörning.",
      href: "/kontorsflytt",
    },
    {
      icon: Package,
      title: "Packning & Montering",
      description: "Lägg till packning och montering – våra partners fixar allt.",
      href: "/priser",
    },
  ];

  const stats = [
    { value: "150+", label: "Verifierade flyttfirmor" },
    { value: "12 000+", label: "Genomförda flyttar" },
    { value: "4.8", label: "Snittbetyg" },
    { value: "< 2h", label: "Tid till offerter" },
  ];

  const howItWorks = [
    {
      icon: Zap,
      title: "1. Beskriv din flytt",
      description: "Fyll i formuläret med datum, storlek och önskemål",
    },
    {
      icon: Users,
      title: "2. Få offerter",
      description: "Upp till 5 verifierade flyttfirmor skickar sina bästa priser",
    },
    {
      icon: Shield,
      title: "3. Jämför & välj",
      description: "Se betyg, omdömen och priser – välj den som passar dig",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Flyttbas – Jämför Flyttfirmor i Stockholm | Hitta Bästa Priset</title>
        <meta name="description" content="Jämför offerter från verifierade flyttfirmor i Stockholm. Hitta bästa priset på din flytt med upp till 50% RUT-avdrag. Gratis och utan förpliktelser." />
        <link rel="canonical" href="https://flyttbas.se/" />
        <meta property="og:title" content="Flyttbas – Jämför Flyttfirmor i Stockholm" />
        <meta property="og:description" content="Jämför offerter från verifierade flyttfirmor. Hitta bästa priset med RUT-avdrag." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flyttbas.se/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Flyttbas",
            "description": "Marknadsplats för flyttjänster i Stockholm",
            "url": "https://flyttbas.se",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://flyttbas.se/sok?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="flex-grow">
        <Hero />

        {/* Stats Section */}
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-navy mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Så fungerar Flyttbas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hitta rätt flyttfirma på några minuter – helt gratis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {howItWorks.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="text-center">
                    <div className="h-16 w-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Hitta Flyttfirma för Din Typ av Flytt
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Oavsett om du flyttar hem eller kontor – vi matchar dig med rätt partners
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="h-12 w-12 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <Link to={service.href}>
                          Hitta flyttfirma <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Varför Använda Flyttbas?
              </h2>
              <p className="text-lg text-muted-foreground">
                Vi gör det enkelt att hitta pålitliga flyttfirmor
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Endast verifierade och försäkrade firmor",
                "Jämför flera offerter på ett ställe",
                "Läs riktiga omdömen från kunder",
                "Kundskydd vid alla bokningar",
                "RUT-avdrag hanteras automatiskt",
                "100% gratis för dig som kund",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Teaser */}
        <section className="py-16 md:py-24 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 fill-orange text-orange" />
                <span className="text-2xl font-bold">4.8/5</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Vad Säger Kunderna?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Anna Svensson",
                  text: "Fick 4 offerter inom 2 timmar. Valde den med bäst omdömen och flytten gick perfekt!",
                  rating: 5,
                },
                {
                  name: "Erik Johansson",
                  text: "Så smidigt att jämföra priser. Sparade tusenlappar och hittade en fantastisk flyttfirma.",
                  rating: 5,
                },
                {
                  name: "Maria Andersson",
                  text: "Tryggt att alla firmor är verifierade. Valde baserat på recensioner och blev supernöjd.",
                  rating: 5,
                },
              ].map((review) => (
                <Card key={review.name}>
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mb-4">{review.text}</p>
                    <p className="text-sm font-medium text-navy">{review.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Redo Att Hitta Din Flyttfirma?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Få offerter från flera verifierade flyttfirmor – helt gratis och utan förpliktelser
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-orange hover:bg-orange/90" asChild>
                <Link to="/kontakt">
                  Jämför offerter nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="hero" asChild>
                <Link to="/faq">Läs mer om hur det fungerar</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
      <ChatLauncher />
    </div>
  );
};

export default Index;
