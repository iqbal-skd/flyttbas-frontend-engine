import { Hero } from "@/components/Hero";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { ChatLauncher } from "@/components/ChatLauncher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Building2, Package, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const services = [
    {
      icon: Home,
      title: "Privatflytt",
      description: "Smidig och säker flytt av ditt hem. Från 1:a till villa.",
      href: "/privatflytt",
    },
    {
      icon: Building2,
      title: "Kontorsflytt",
      description: "Professionell kontorsflytt med minimal driftstörning.",
      href: "/kontorsflytt",
    },
    {
      icon: Package,
      title: "Packning & Montering",
      description: "Vi packar, bär och monterar. Du kan slappna av.",
      href: "/priser",
    },
  ];

  const stats = [
    { value: "2500+", label: "Nöjda kunder" },
    { value: "0", label: "Skador 2024" },
    { value: "4.9", label: "Betyg Google" },
    { value: "< 24h", label: "Svarstid" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
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

        {/* Services Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Våra Tjänster
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Oavsett om du flyttar hem eller kontor, vi har lösningen för dig
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
                          Läs mer <ArrowRight className="ml-2 h-4 w-4" />
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
        <section className="py-16 md:py-24 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Varför Välja Flyttbas?
              </h2>
              <p className="text-lg text-muted-foreground">
                Vi gör skillnad genom att alltid sätta kunden först
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Professionella och erfarna flyttare",
                "Försäkring som täcker all egendom",
                "Flexibla tider – även helger",
                "Miljövänliga förpackningar",
                "RUT-avdrag direkt på fakturan",
                "Transparent prissättning",
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
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="h-6 w-6 fill-orange text-orange" />
                <span className="text-2xl font-bold">4.9/5</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
                Vad Säger Våra Kunder?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Anna Svensson",
                  text: "Otroligt professionella! Flytten gick smidigt och inget gick sönder. Rekommenderar varmt!",
                  rating: 5,
                },
                {
                  name: "Erik Johansson",
                  text: "Snabb offert, tydlig kommunikation och bra pris. Kommer definitivt använda dem igen.",
                  rating: 5,
                },
                {
                  name: "Maria Andersson",
                  text: "Fantastisk service från början till slut. Killarna var både snabba och försiktiga.",
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
              Redo Att Boka Din Flytt?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Få en kostnadsfri offert idag och låt oss göra din flytt enkel och stressfri
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-orange hover:bg-orange/90" asChild>
                <Link to="/kontakt">
                  Få offert nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href="tel:+46701234567">Ring: 070-123 45 67</a>
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
