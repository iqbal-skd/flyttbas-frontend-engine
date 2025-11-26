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
      category: "Bokning & Offert",
      questions: [
        {
          q: "Hur bokar jag en flytt?",
          a: "Du kan boka genom att fylla i vårt offertformulär på hemsidan, ringa oss direkt, eller chatta med oss. Vi återkommer vanligtvis inom 2 timmar med en offert."
        },
        {
          q: "Hur snabbt kan ni genomföra en flytt?",
          a: "I normala fall kan vi genomföra en flytt inom 3-5 dagar från bokning. För akuta flyttar kan vi ofta hjälpa till redan nästa dag."
        },
        {
          q: "Vad kostar en flytt?",
          a: "Priset beror på flera faktorer: storlek på bostaden, avstånd, tillgänglighet, och extra tjänster. Efter RUT-avdrag börjar priserna från ca 995 kr/timme för en mindre flytt med 2 personer."
        },
        {
          q: "Kan jag få ett bindande pris?",
          a: "Ja, efter ett hembesök kan vi ge ett fast pris för hela flyttjobbet. Detta rekommenderas särskilt för större flyttar."
        }
      ]
    },
    {
      category: "RUT-avdrag",
      questions: [
        {
          q: "Hur fungerar RUT-avdraget?",
          a: "RUT-avdraget ger 50% rabatt på arbetskostnaden upp till 75 000 kr per person och år. Vi hanterar alla papper och rapporterar direkt till Skatteverket."
        },
        {
          q: "Vad ingår i RUT-avdraget?",
          a: "RUT-avdraget gäller för arbetskostnaden, alltså själva flyttjobbet. Material och transport ingår inte i avdraget."
        },
        {
          q: "Måste jag göra något för att få RUT-avdrag?",
          a: "Nej, vi sköter allt. Du betalar det rabatterade priset direkt och vi rapporterar till Skatteverket."
        }
      ]
    },
    {
      category: "Försäkring",
      questions: [
        {
          q: "Är mina saker försäkrade under flytten?",
          a: "Ja, alla våra flyttar är försäkrade genom vår ansvarsförsäkring. Vi täcker eventuella skador som uppstår under flytten."
        },
        {
          q: "Vad händer om något går sönder?",
          a: "I det osannolika fall att något skulle skadas under flytten, anmäler du detta till oss så snart som möjligt. Vi hanterar ärendet via vår försäkring."
        },
        {
          q: "Behöver jag egen hemförsäkring?",
          a: "Vi rekommenderar alltid att du har en egen hemförsäkring, men vår ansvarsförsäkring täcker skador som uppstår genom vår hantering."
        }
      ]
    },
    {
      category: "Praktiskt",
      questions: [
        {
          q: "Måste jag packa själv?",
          a: "Nej, vi erbjuder både packning och uppackning som tilläggstjänst. Du kan också välja att packa en del själv och låta oss hjälpa till med resten."
        },
        {
          q: "Vad ska jag tänka på inför flytten?",
          a: "Se till att parkeringstillstånd är ordnat, hiss är bokad om det finns, och att värdesaker är markerade. Vi skickar en checklista när du bokar."
        },
        {
          q: "Kan ni hjälpa till med möbelmontering?",
          a: "Ja, montering och demontering av möbler ingår i våra flyttjänster."
        },
        {
          q: "Hur lång tid tar en flytt?",
          a: "Det beror på storleken. En 2:a tar vanligtvis 4-5 timmar, medan en större villa kan ta 8-10 timmar. Vi ger en tidsuppskattning i offerten."
        }
      ]
    },
    {
      category: "Extra tjänster",
      questions: [
        {
          q: "Erbjuder ni flyttstädning?",
          a: "Ja, vi kan ordna flyttstädning av både gamla och nya bostaden. Detta bokas som en tilläggstjänst."
        },
        {
          q: "Kan ni magasinera mina saker?",
          a: "Ja, vi erbjuder både kort- och långtidsmagasinering i våra säkra lokaler."
        },
        {
          q: "Kan ni flytta ett piano?",
          a: "Ja, vi har specialutbildad personal för pianoflytt och annan tung utrustning."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>FAQ Flytt Stockholm – Vanliga Frågor om Flyttjänster</title>
        <meta name="description" content="Vanliga frågor om flytt i Stockholm. RUT-avdrag, försäkring, priser, packning och mer. Få svar på dina flyttfrågor här!" />
        <link rel="canonical" href="https://flyttbas.se/faq" />
        <meta property="og:title" content="FAQ – Vanliga frågor om flyttjänster" />
        <meta property="og:description" content="Svar på vanliga frågor om flytt, RUT-avdrag, försäkring och priser." />
        <meta property="og:url" content="https://flyttbas.se/faq" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Hur fungerar RUT-avdraget?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "RUT-avdraget ger 50% rabatt på arbetskostnaden upp till 75 000 kr per person och år. Vi hanterar alla papper och rapporterar direkt till Skatteverket."
                }
              },
              {
                "@type": "Question",
                "name": "Är mina saker försäkrade under flytten?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ja, alla våra flyttar är försäkrade genom vår ansvarsförsäkring. Vi täcker eventuella skador som uppstår under flytten."
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
                Vanliga frågor om flytt
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Här hittar du svar på de vanligaste frågorna om våra flyttjänster.
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
