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
    "alvsjo": {
      name: "Älvsjö",
      displayName: "Älvsjö",
      intro: "Behöver du hjälp med flytt i Älvsjö? Flyttbas är ditt lokala flyttföretag med lång erfarenhet av att hjälpa privatpersoner och företag i området. Vi känner till Älvsjös gator, parkeringsmöjligheter och vilka bostadsområden som kräver extra omsorg.",
      highlights: [
        "Lokalkännedom i Älvsjö och omnejd",
        "Snabb respons – ofta samma dag",
        "RUT-avdrag 50% på arbetskostnad",
        "Försäkrade och erfarna flyttare"
      ],
      miniCase: {
        area: "65 m²",
        team: "2 flyttare",
        hours: "4 timmar",
        damages: "0 skador",
        description: "Lägenhetsflytt från Älvsjö centrum till Stuvsta. Inklusive packning av känsliga föremål och montering av möbler."
      },
      priceExample: {
        title: "Prisexempel för lägenhet i Älvsjö",
        size: "2:a på 60 m²",
        price: "3 980 kr",
        details: "Pris efter RUT-avdrag. Inklusive 2 flyttare, lastbil och grundläggande packmaterial."
      },
      faq: [
        {
          question: "Hur snabbt kan ni komma till Älvsjö?",
          answer: "Vi har regelbundet uppdrag i Älvsjö och kan ofta hjälpa till redan samma vecka. Kontakta oss för aktuell tillgänglighet."
        },
        {
          question: "Vilka bostadsområden i Älvsjö täcker ni?",
          answer: "Vi täcker hela Älvsjö inklusive Älvsjö centrum, Herrängen, Örby slott och angränsande områden."
        },
        {
          question: "Finns det parkeringsmöjligheter för flyttbilen?",
          answer: "Ja, de flesta områden i Älvsjö har bra parkeringsmöjligheter. Vi hjälper till att ordna flyttillstånd om det behövs."
        },
        {
          question: "Vad ingår i priset för flytt i Älvsjö?",
          answer: "I priset ingår erfarna flyttare, lastbil med utrustning, grundläggande packmaterial, försäkring och RUT-avdrag på arbetskostnaden."
        }
      ],
      nearby: [
        { name: "Årsta", slug: "arsta" },
        { name: "Bandhagen", slug: "bandhagen" },
        { name: "Enskede", slug: "enskede" },
        { name: "Hägersten", slug: "hagersten" }
      ]
    },
    "arsta": {
      name: "Årsta",
      displayName: "Årsta",
      intro: "Flyttbas är ditt pålitliga flyttföretag i Årsta. Vi har hjälpt hundratals hushåll och företag i området med professionella flyttjänster. Med vår lokalkännedom och erfarenhet garanterar vi en smidig flytt till fast pris.",
      highlights: [
        "Specialiserade på Årsta och Söderort",
        "Transparenta priser med RUT-avdrag",
        "Fullständig försäkring enligt Bohag 2010",
        "Flexibla tider även kvällar och helger"
      ],
      miniCase: {
        area: "78 m²",
        team: "3 flyttare",
        hours: "5 timmar",
        damages: "0 skador",
        description: "Villaflytt i Årsta med packning av vardagsrum och tunga möbler. Professionell hantering av antika möbler."
      },
      priceExample: {
        title: "Prisexempel för boende i Årsta",
        size: "3:a på 75 m²",
        price: "8 060 kr",
        details: "Efter RUT-avdrag. Inkluderar 3 flyttare, lastbil, packmaterial och montering."
      },
      faq: [
        {
          question: "Täcker ni hela Årsta?",
          answer: "Ja, vi täcker hela Årsta inklusive Årsta centrum, Årsta havsbad, Årstadal och Årstaberg."
        },
        {
          question: "Kan ni hjälpa till med packning?",
          answer: "Absolut! Vi erbjuder professionell packhjälp till 695 kr/h (347,50 kr efter RUT). Vi packar allt från porslin till tavlor."
        },
        {
          question: "Hur lång tid tar en flytt i Årsta?",
          answer: "Det beror på storleken på bostaden och hur mycket som ska flyttas. En vanlig 2:a tar ca 4-5 timmar, en 3:a 6-7 timmar."
        },
        {
          question: "Vad händer om något går sönder?",
          answer: "Vi har full ansvarsförsäkring som täcker eventuella skador. Vi följer Bohag 2010 och dokumenterar noggrant."
        }
      ],
      nearby: [
        { name: "Älvsjö", slug: "alvsjo" },
        { name: "Johanneshov", slug: "johanneshov" },
        { name: "Enskede", slug: "enskede" },
        { name: "Hammarbyhöjden", slug: "hammarbyhojen" }
      ]
    }
  };

  const area = areas[slug || "alvsjo"] || areas["alvsjo"];

  return (
    <div className="min-h-screen flex flex-col">
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
