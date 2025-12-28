import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { Search, ArrowRight, ChevronDown, ChevronUp, MapPin } from "lucide-react";

type FAQItem = {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  microCta?: { text: string; link: string };
  relatedQuestions?: { text: string; id: string }[];
};

type FAQCategory = {
  id: string;
  title: string;
  filterTag: string;
  questions: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    id: "kom-igang",
    title: "Kom igång med Flyttbas",
    filterTag: "Privatflytt",
    questions: [
      {
        id: "vad-ar-flyttbas",
        question: "Vad är Flyttbas?",
        answer: "Flyttbas är en jämförelsetjänst för flytt och flyttstäd där du jämför offerter från verifierade flyttfirmor och bokar den lösning som passar dig bäst. Du beskriver din flytt eller flyttstädning, får prisförslag och väljer i lugn och ro.",
        microCta: { text: "Jämför offerter gratis", link: "/#quote-wizard" }
      },
      {
        id: "kostar-det-nagot",
        question: "Kostar det något att använda Flyttbas?",
        answer: "Nej. Det är helt gratis att använda Flyttbas. Du betalar inget för att skicka en förfrågan eller jämföra offerter. Du väljer själv om – och vilken – flyttfirma du vill boka."
      },
      {
        id: "hur-valjer-ni-partners",
        question: "Hur väljer ni ut era partners?",
        answer: "Vi samarbetar med flyttfirmor som uppfyller våra krav på seriös verksamhet och kvalitet. Det innebär bland annat att företagen ska vara försäkrade och ha ordning på sina företagsuppgifter. Vi följer även upp kundomdömen och samarbetar endast med partners som håller en hög nivå över tid."
      },
      {
        id: "hur-bokar-jag",
        question: "Hur bokar jag en flytt via Flyttbas?",
        answer: (
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-2">
              <li>Fyll i en kostnadsfri förfrågan om flytt och/eller flyttstädning</li>
              <li>Ta emot offerter från flera verifierade flyttfirmor</li>
              <li>Jämför pris, innehåll och omdömen</li>
              <li>Välj och boka den flyttfirma som passar dig bäst</li>
            </ol>
          </div>
        ),
        microCta: { text: "Jämför offerter gratis", link: "/#quote-wizard" }
      }
    ]
  },
  {
    id: "pris-offert",
    title: "Pris, offert och fast pris",
    filterTag: "Pris & fast pris",
    questions: [
      {
        id: "vad-kostar-flytt",
        question: "Vad kostar en flytt?",
        answer: "Priset beror på hur mycket som ska flyttas, avstånd, våning/hiss, bärväg, parkering samt vilka tillägg du väljer (t.ex. packning, montering eller magasinering). På Flyttbas kan du jämföra flera offerter och se exakt vad som ingår innan du bokar.",
        microCta: { text: "Jämför offerter och se prisförslag", link: "/#quote-wizard" }
      },
      {
        id: "fast-pris",
        question: "Kan jag få ett fast pris (bindande pris)?",
        answer: "Ja. Många flyttfirmor kan erbjuda fast pris, vilket innebär ett bindande pris baserat på de uppgifter du lämnar. Priset gäller så länge förutsättningarna för flytten är desamma. I vissa fall kan flyttfirman behöva kompletterande information innan fast pris bekräftas.",
        microCta: { text: "Jämför offerter och fråga efter fast pris", link: "/#quote-wizard" }
      },
      {
        id: "jamfora-offert",
        question: "Vad ska jag jämföra i en offert?",
        answer: (
          <div className="space-y-3">
            <p>Jämför alltid:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Totalpris och vad som ingår</li>
              <li>Eventuella tillägg (t.ex. packning, montering, bärhjälp)</li>
              <li>Försäkring och villkor</li>
              <li>Datum/tidsfönster och upplägg (antal flyttare, bil, bärväg)</li>
              <li>Omdömen och tidigare kunders erfarenheter</li>
            </ul>
          </div>
        )
      },
      {
        id: "hur-lang-tid",
        question: "Hur lång tid tar en flytt?",
        answer: (
          <div className="space-y-3">
            <p>Tidsåtgången varierar beroende på volym, hiss/våning, bärväg, parkering och avstånd. Som exempel vid flytt inom samma stad:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>2 rok: ca 3–5 timmar</li>
              <li>3 rok: ca 5–7 timmar</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "rut-avdrag",
    title: "RUT-avdrag (privatflytt)",
    filterTag: "RUT-avdrag",
    questions: [
      {
        id: "hur-fungerar-rut",
        question: "Hur fungerar RUT-avdraget vid flytt?",
        answer: "RUT-avdrag innebär att du som privatperson kan få 50 % avdrag på arbetskostnaden för vissa flyttjänster. Avdraget görs vanligtvis direkt på fakturan, och flyttfirman hanterar ansökan. Du behöver normalt bara lämna ditt personnummer vid bokning."
      },
      {
        id: "vad-ingar-rut",
        question: "Vad ingår i RUT-avdraget?",
        answer: "RUT gäller för arbetsmoment som till exempel packning, bärhjälp, lastning och lossning samt flyttarbete mellan bostäder. Kostnader för material, flyttbil, resor och eventuella utlägg omfattas normalt inte."
      },
      {
        id: "maste-jag-gora-rut",
        question: "Måste jag göra något för att få RUT-avdrag?",
        answer: "Nej. Flyttfirman sköter vanligtvis RUT-avdraget åt dig. Det du behöver säkerställa är att du har rätt till avdrag och att du lämnar korrekta uppgifter vid bokning.",
        microCta: { text: "Jämför offerter och se pris efter RUT", link: "/#quote-wizard" }
      }
    ]
  },
  {
    id: "flyttstadning",
    title: "Flyttstädning",
    filterTag: "Flyttstäd",
    questions: [
      {
        id: "boka-flyttstadning",
        question: "Kan jag boka flyttstädning via Flyttbas?",
        answer: "Ja. Du kan inkludera flyttstädning i din förfrågan och få offerter som antingen gäller enbart flyttstäd eller en helhetslösning med både flytt och flyttstäd.",
        microCta: { text: "Lägg till flyttstäd och jämför offerter", link: "/#quote-wizard" }
      },
      {
        id: "vad-ingar-flyttstadning",
        question: "Vad ingår i flyttstädning?",
        answer: "Vad som ingår kan variera, men en flyttstädning omfattar normalt en grundlig städning av bostaden inför överlämning. I offerten ska det framgå vad som ingår och eventuella tillägg (t.ex. fönster, ugn, balkong, förråd)."
      },
      {
        id: "helhetslosning",
        question: "Kan jag få en helhetslösning med flytt + flyttstäd?",
        answer: "Ja. Många flyttfirmor erbjuder paket där både flytt och flyttstäd ingår, vilket gör att du slipper samordna flera leverantörer. Exakt upplägg framgår i offerten.",
        microCta: { text: "Jämför offerter för flytt + flyttstäd", link: "/#quote-wizard" }
      }
    ]
  },
  {
    id: "trygghet",
    title: "Trygghet, försäkring och kundskydd",
    filterTag: "Trygghet",
    questions: [
      {
        id: "forsakring",
        question: "Är mina saker försäkrade under flytten?",
        answer: "Våra partners ska ha ansvarsförsäkring. Exakt försäkringsvillkor kan variera mellan företag, så kontrollera alltid vad som gäller i offerten innan du bokar."
      },
      {
        id: "gar-sonder",
        question: "Vad händer om något går sönder?",
        answer: "Om något skadas bör du dokumentera med bilder och kontakta flyttfirman så snart som möjligt. Hur ärendet hanteras beror på försäkring och villkor. Offerten och avtalet ska beskriva hur reklamation går till."
      },
      {
        id: "kundskydd",
        question: "Vad innebär kundskyddet?",
        answer: "Kundskydd innebär att du bokar via en plattform som arbetar med verifierade flyttfirmor och att du har tydliga villkor för bokning och offertinnehåll. Om du behöver hjälp med hur du ska gå vidare kan du även kontakta Flyttbas för vägledning.",
        microCta: { text: "Jämför offerter från verifierade flyttfirmor", link: "/#quote-wizard" }
      }
    ]
  },
  {
    id: "kontorsflytt",
    title: "Kontorsflytt / Företagsflytt",
    filterTag: "Kontorsflytt",
    questions: [
      {
        id: "foretag-anvanda",
        question: "Kan företag använda Flyttbas för kontorsflytt?",
        answer: (
          <span>
            Ja. Flyttbas kan användas av företag som behöver kontorsflytt, företagsflytt eller verksamhetsflytt. Du får offerter från flyttfirmor med erfarenhet av att flytta kontor och verksamheter. 
            Läs mer på vår <Link to="/kontorsflytt" className="text-accent hover:underline">sida om kontorsflytt</Link>.
          </span>
        ),
        microCta: { text: "Jämför offerter för kontorsflytt", link: "/kontorsflytt" }
      },
      {
        id: "vad-ingar-kontorsflytt",
        question: "Vad ingår i en kontorsflytt?",
        answer: (
          <div className="space-y-3">
            <p>Det varierar, men kan omfatta:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Flytt av kontorsmöbler och utrustning</li>
              <li>Demontering/montering av arbetsplatser</li>
              <li>Packning av arkiv och känslig utrustning</li>
              <li>Magasinering eller bortforsling</li>
              <li>Flyttstädning av lokaler</li>
            </ul>
            <p>Exakt innehåll framgår i offerten.</p>
          </div>
        )
      },
      {
        id: "kvar-helger",
        question: "Kan kontorsflytten ske kvällar eller helger?",
        answer: "Ofta ja. Många flyttfirmor erbjuder flytt utanför kontorstid för att minska driftstopp. Detta specificeras i offerten."
      },
      {
        id: "rut-foretag",
        question: "Gäller RUT-avdrag för företag?",
        answer: "Nej. RUT gäller för privatpersoner. Företagsflytt prissätts utan RUT, men är normalt en avdragsgill kostnad i verksamheten."
      }
    ]
  }
];

const cityData = [
  { name: "Stockholm", tip: "Parkering och lastzon kan påverka tidsåtgången, särskilt i innerstan." },
  { name: "Göteborg", tip: "Trånga gator och begränsad lastning kan kräva extra planering." },
  { name: "Malmö", tip: "Kontrollera lastmöjligheter och bärväg i god tid." },
  { name: "Uppsala", tip: "Tänk på parkering och bärväg, särskilt nära centrum." },
  { name: "Västerås", tip: "Planera lastplats och bärväg för en smidigare flytt." },
  { name: "Örebro", tip: "Säkerställ parkering nära porten för att minska bärtiden." },
  { name: "Jönköping", tip: "Höjdskillnader och parkering kan påverka upplägg och tid." },
  { name: "Gävle", tip: "Planera bärväg och parkering för att undvika onödiga moment." },
  { name: "Norrköping", tip: "Kontrollera lastzon/parkering och eventuella portkoder i förväg." }
];

const filterTags = ["Privatflytt", "Flyttstäd", "Pris & fast pris", "RUT-avdrag", "Trygghet", "Kontorsflytt", "Storstäder"];

const FAQ = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [allExpanded, setAllExpanded] = useState(false);

  // Handle anchor on page load
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const allQuestionIds = faqData.flatMap(cat => cat.questions.map(q => q.id));
      if (allQuestionIds.includes(hash)) {
        setOpenItems([hash]);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  // Filter and search logic
  const filteredCategories = useMemo(() => {
    let categories = faqData;

    // Filter by tag
    if (activeFilter && activeFilter !== "Storstäder") {
      categories = categories.filter(cat => cat.filterTag === activeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      categories = categories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          q.question.toLowerCase().includes(query) || 
          (typeof q.answer === "string" && q.answer.toLowerCase().includes(query))
        )
      })).filter(cat => cat.questions.length > 0);
    }

    return categories;
  }, [activeFilter, searchQuery]);

  const handleAccordionChange = (value: string) => {
    setOpenItems(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      return [...prev, value];
    });
    // Update URL hash
    navigate(`/faq#${value}`, { replace: true });
  };

  const toggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      const allIds = filteredCategories.flatMap(cat => cat.questions.map(q => q.id));
      setOpenItems(allIds);
    }
    setAllExpanded(!allExpanded);
  };

  // Generate JSON-LD for FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.flatMap(cat => 
      cat.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": typeof q.answer === "string" ? q.answer : q.question // Fallback for JSX answers
        }
      }))
    )
  };

  const MicroCta = ({ text, link }: { text: string; link: string }) => (
    <Link 
      to={link} 
      className="inline-flex items-center gap-1 text-accent hover:text-accent/80 font-medium mt-4 group"
    >
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      {text}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Vanliga frågor om flyttfirma, flyttstäd, RUT-avdrag och kontorsflytt | Flyttbas</title>
        <meta name="description" content="Svar på vanliga frågor om att jämföra flyttfirmor, boka flyttstädning, förstå RUT-avdrag och flytta kontor. Tips för flytt i Stockholm, Göteborg, Malmö och fler städer." />
        <link rel="canonical" href="https://flyttbas.se/faq" />
        <meta property="og:title" content="Vanliga frågor om flyttfirma, flyttstäd, RUT-avdrag och kontorsflytt | Flyttbas" />
        <meta property="og:description" content="Svar på vanliga frågor om att jämföra flyttfirmor, boka flyttstädning, förstå RUT-avdrag och flytta kontor." />
        <meta property="og:url" content="https://flyttbas.se/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Vanliga frågor om Flyttbas, flyttfirma, flyttstäd och kontorsflytt
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-3xl">
                Här hittar du svar på vanliga frågor om att jämföra flyttfirmor, boka flyttstädning, förstå RUT-avdrag och flytta kontor. Du kan också läsa tips för flytt i storstäder som Stockholm, Göteborg och Malmö.
              </p>
              
              {/* Search */}
              <div className="relative max-w-xl mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Sök i vanliga frågor…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-foreground bg-white border-0 shadow-lg"
                />
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 md:gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                {filterTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={activeFilter === tag ? "default" : "secondary"}
                    className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-all ${
                      activeFilter === tag 
                        ? "bg-accent text-white hover:bg-accent/90" 
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                    onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Top micro-CTA */}
              <div className="mt-6">
                <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-white">
                  <Link to="/#quote-wizard">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Jämför offerter gratis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Expand/Collapse all */}
              <div className="flex justify-end mb-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Stäng alla
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Visa alla
                    </>
                  )}
                </Button>
              </div>

              {/* FAQ Categories */}
              {activeFilter !== "Storstäder" && filteredCategories.length > 0 ? (
                <div className="space-y-12">
                  {filteredCategories.map((category) => (
                    <div key={category.id}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                        {category.title}
                      </h2>
                      <Accordion 
                        type="multiple" 
                        value={openItems}
                        className="space-y-3"
                      >
                        {category.questions.map((item) => (
                          <AccordionItem 
                            key={item.id} 
                            value={item.id} 
                            id={item.id}
                            className="border rounded-lg px-6 bg-card shadow-sm"
                          >
                            <AccordionTrigger 
                              className="text-left hover:no-underline py-5"
                              onClick={() => handleAccordionChange(item.id)}
                            >
                              <h3 className="font-semibold text-foreground text-base md:text-lg pr-4">
                                {item.question}
                              </h3>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-5">
                              <div className="prose prose-sm max-w-none">
                                {item.answer}
                              </div>
                              {item.microCta && (
                                <MicroCta text={item.microCta.text} link={item.microCta.link} />
                              )}
                              {item.relatedQuestions && item.relatedQuestions.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                  <p className="text-sm font-medium text-foreground mb-2">Relaterade frågor:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.relatedQuestions.map(rq => (
                                      <Link 
                                        key={rq.id} 
                                        to={`/faq#${rq.id}`} 
                                        className="text-sm text-accent hover:underline"
                                      >
                                        {rq.text}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              ) : activeFilter !== "Storstäder" && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Inga frågor matchar din sökning.</p>
                  <Button 
                    variant="link" 
                    onClick={() => { setSearchQuery(""); setActiveFilter(null); }}
                    className="mt-2"
                  >
                    Rensa filter
                  </Button>
                </div>
              )}

              {/* City Module - Always show if Storstäder filter or no filter */}
              {(activeFilter === "Storstäder" || !activeFilter) && !searchQuery && (
                <div className={activeFilter === "Storstäder" ? "" : "mt-16"}>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    Flytt i storstäder (lokala tips)
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Att flytta i storstäder kan påverka tidsåtgång och upplägg. Planera särskilt för parkering/lastzon, bärväg och tillgång till hiss.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cityData.map(city => (
                      <div 
                        key={city.name}
                        className="p-5 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-foreground mb-1">{city.name}</h3>
                            <p className="text-sm text-muted-foreground">{city.tip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Hittade du inte svar på din fråga?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Kontakta oss så hjälper vi dig gärna.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                <Link to="/#quote-wizard">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Jämför offerter gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/kontakt">Kontakta oss</Link>
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
