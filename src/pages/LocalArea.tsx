import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { MapPin, Users, Clock, ShieldCheck, Check, Star } from "lucide-react";
import { QuickQuoteForm } from "@/components/QuickQuoteForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAreaBySlug } from "@/data/localAreas";
import { Helmet } from "react-helmet-async";

const LocalArea = () => {
  const { slug } = useParams();
  const area = getAreaBySlug(slug || "");

  // Fallback if area not found
  if (!area) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy mb-4">Område inte hittat</h1>
            <p className="text-muted-foreground mb-6">Det område du söker finns inte i vår databas.</p>
            <Button asChild>
              <Link to="/kontakt">Kontakta oss</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Flyttfirma {area.displayName} – Från {area.priceExample.price} | RUT-avdrag</title>
        <meta name="description" content={`${area.intro.substring(0, 155)}`} />
        <link rel="canonical" href={`https://flyttbas.se/flyttfirma/${slug}`} />
        <meta property="og:title" content={`Flyttfirma ${area.displayName} – Trygg flytt med RUT-avdrag`} />
        <meta property="og:description" content={area.intro} />
        <meta property="og:url" content={`https://flyttbas.se/flyttfirma/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `Flyttbas - Flyttfirma ${area.displayName}`,
            "description": area.intro,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": area.displayName,
              "addressRegion": "Stockholm",
              "addressCountry": "SE"
            },
            "areaServed": {
              "@type": "City",
              "name": area.displayName
            },
            "priceRange": area.priceExample.price,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127"
            }
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-orange" />
                <span className="text-orange font-medium">Lokal flyttfirma</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Flyttfirma i {area.displayName} – Trygg flytt med RUT-avdrag
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                {area.intro}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <a href="#offert">Få offert</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <a href="tel:+46701234567">Ring 070-123 45 67</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-12 bg-light-bg border-b">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {area.highlights.map((highlight: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-orange flex-shrink-0 mt-1" />
                  <span className="text-sm font-medium text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mini Case */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-navy mb-8 text-center">
                Senaste flytten i {area.displayName}
              </h2>
              <Card className="p-8 bg-gradient-to-br from-light-bg to-white">
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange mb-2">{area.miniCase.area}</div>
                    <div className="text-sm text-muted-foreground">Boarea</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-orange" />
                      <span className="text-3xl font-bold text-orange">{area.miniCase.team.split(' ')[0]}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Flyttare</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange" />
                      <span className="text-3xl font-bold text-orange">{area.miniCase.hours.split(' ')[0]}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Timmar</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-orange" />
                      <span className="text-3xl font-bold text-orange">{area.miniCase.damages.split(' ')[0]}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Skador</div>
                  </div>
                </div>
                <p className="text-center text-muted-foreground">{area.miniCase.description}</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Price Example */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-navy mb-8 text-center">
                {area.priceExample.title}
              </h2>
              <Card className="p-8 text-center">
                <div className="mb-4">
                  <div className="text-lg text-muted-foreground mb-2">{area.priceExample.size}</div>
                  <div className="text-5xl font-bold text-orange mb-2">{area.priceExample.price}</div>
                  <div className="text-sm text-muted-foreground">{area.priceExample.details}</div>
                </div>
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  <span className="ml-2 text-muted-foreground">(4.9/5 baserat på 127 recensioner)</span>
                </div>
                <Button asChild size="lg" className="w-full md:w-auto">
                  <a href="#offert">Få ditt pris</a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Quote Form */}
        <section id="offert" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-navy mb-4 text-center">
                Få fastpris för din flytt i {area.displayName}
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Fyll i formuläret så återkommer vi inom 15 minuter (08-20) med ett preliminärt fastpris.
              </p>
              <QuickQuoteForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-navy mb-8 text-center">
                Vanliga frågor om flytt i {area.displayName}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {area.faq.map((item: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-white">
                    <AccordionTrigger className="text-left font-semibold text-navy hover:text-orange">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Nearby Areas */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-navy mb-6 text-center">
                Jobb i närområdet
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {area.nearby.map((nearby: any, index: number) => (
                  <Link key={index} to={`/flyttfirma-${nearby.slug}`}>
                    <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                      <MapPin className="h-5 w-5 text-orange mx-auto mb-2" />
                      <div className="font-medium text-navy">{nearby.name}</div>
                    </Card>
                  </Link>
                ))}
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

export default LocalArea;
