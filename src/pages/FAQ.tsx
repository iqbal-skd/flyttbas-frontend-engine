import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Om Flyttbas",
      questions: [
        {
          q: "Vad är Flyttbas?",
          a: "Flyttbas är en marknadsplats där du enkelt kan jämföra offerter från verifierade flyttfirmor i Stockholm. Vi gör det enkelt att hitta rätt firma till rätt pris."
        },
        {
          q: "Kostar det något att använda Flyttbas?",
          a: "Nej, det är helt gratis för dig som kund. Vi tar en liten avgift från flyttfirmorna när de får ett uppdrag via oss."
        },
        {
          q: "Hur väljer ni ut era partners?",
          a: "Alla våra partners är verifierade. Vi kontrollerar F-skattesedel, försäkringar, att de följer Bohag 2010 och samlar in kundomdömen."
        },
        {
          q: "Hur snabbt får jag offerter?",
          a: "Vanligtvis får du offerter inom 2 timmar under kontorstid. De flesta kunder får 3-5 offerter att jämföra."
        }
      ]
    },
    {
      category: "Bokning & Priser",
      questions: [
        {
          q: "Hur bokar jag en flytt?",
          a: "Fyll i vårt formulär med uppgifter om din flytt. Du får sedan offerter från verifierade flyttfirmor som du kan jämföra innan du väljer."
        },
        {
          q: "Kan jag få ett bindande pris?",
          a: "Ja, de flesta firmor erbjuder fast pris efter ett hembesök eller när de har all information om flytten."
        },
        {
          q: "Vad kostar en flytt?",
          a: "Priset varierar beroende på storlek, avstånd och tjänster. Genom att jämföra offerter kan du hitta bästa priset. Efter RUT-avdrag börjar priserna från ca 995 kr/timme."
        }
      ]
    },
    {
      category: "RUT-avdrag",
      questions: [
        {
          q: "Hur fungerar RUT-avdraget?",
          a: "RUT-avdraget ger 50% rabatt på arbetskostnaden upp till 75 000 kr per person och år. Alla våra partners hanterar papperarbetet automatiskt."
        },
        {
          q: "Vad ingår i RUT-avdraget?",
          a: "RUT-avdraget gäller för arbetskostnaden, alltså själva flyttjobbet. Material och transport ingår inte i avdraget."
        },
        {
          q: "Måste jag göra något för att få RUT-avdrag?",
          a: "Nej, flyttfirman sköter allt. Du betalar det rabatterade priset direkt och de rapporterar till Skatteverket."
        }
      ]
    },
    {
      category: "Trygghet & Garanti",
      questions: [
        {
          q: "Är mina saker försäkrade under flytten?",
          a: "Ja, alla våra verifierade partners har ansvarsförsäkring som täcker eventuella skador under flytten."
        },
        {
          q: "Vad händer om något går sönder?",
          a: "Anmäl skadan till flyttfirman så snart som möjligt. De hanterar ärendet via sin försäkring. Som extra trygghet erbjuder vi kundskydd vid alla bokningar via Flyttbas."
        },
        {
          q: "Vad innebär kundskyddet?",
          a: "Kundskyddet betyder att vi hjälper dig om något skulle gå fel med din bokning. Vi medlar och ser till att du får den service du betalat för."
        }
      ]
    },
    {
      category: "Praktiskt",
      questions: [
        {
          q: "Kan flyttfirmorna hjälpa till med packning?",
          a: "Ja, de flesta av våra partners erbjuder packning och uppackning som tilläggstjänst."
        },
        {
          q: "Vad ska jag tänka på inför flytten?",
          a: "Se till att parkeringstillstånd är ordnat, hiss är bokad om det finns, och att värdesaker är markerade. Den firma du väljer skickar en checklista."
        },
        {
          q: "Hur lång tid tar en flytt?",
          a: "Det beror på storleken. En 2:a tar vanligtvis 4-5 timmar, medan en större villa kan ta 8-10 timmar. Du får tidsuppskattning i offerten."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Vanliga Frågor om Flyttbas – Så Fungerar Marknadsplatsen</title>
        <meta name="description" content="Vanliga frågor om Flyttbas. Hur fungerar jämförelsen? Är det gratis? Hur väljs firmor ut? Få svar på dina frågor här!" />
        <link rel="canonical" href="https://flyttbas.se/faq" />
        <meta property="og:title" content="FAQ – Vanliga frågor om Flyttbas" />
        <meta property="og:description" content="Svar på vanliga frågor om hur Flyttbas fungerar, priser och trygghet." />
        <meta property="og:url" content="https://flyttbas.se/faq" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Vad är Flyttbas?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Flyttbas är en marknadsplats där du enkelt kan jämföra offerter från verifierade flyttfirmor i Stockholm."
                }
              },
              {
                "@type": "Question",
                "name": "Kostar det något att använda Flyttbas?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nej, det är helt gratis för dig som kund. Vi tar en liten avgift från flyttfirmorna när de får ett uppdrag via oss."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Vanliga frågor
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Här hittar du svar på de vanligaste frågorna om Flyttbas och hur det fungerar.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((category, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-bold mb-6 text-navy">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, qIndex) => (
                      <AccordionItem key={qIndex} value={`${index}-${qIndex}`} className="border rounded-lg px-6">
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium text-foreground">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-navy">Fick du inte svar på din fråga?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kontakta oss så hjälper vi dig gärna!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/kontakt">Kontakta oss</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+46701234567">Ring oss</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default FAQ;
