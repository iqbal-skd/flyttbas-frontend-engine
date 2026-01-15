import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";

const VadKostarEnFlytt = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Vad kostar en flytt? | Guide | Flyttbas</title>
        <meta name="description" content="Läs om vad som påverkar kostnaden för en flytt och hur du kan få ett rättvisande pris. Timpris, fast pris, tillägg och RUT-avdrag." />
        <link rel="canonical" href="https://flyttbas.se/guider/vad-kostar-en-flytt" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Guide</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Vad kostar en flytt?
              </h1>
              <p className="text-lg text-white/90">
                Priset på en flytt varierar beroende på storlek, avstånd och vad som ska ingå. Här förklarar vi vad som påverkar kostnaden och hur du får en rättvisande offert.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">

              {/* Section 1 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">1. Vad påverkar priset på en flytt?</h2>
              <p>
                En flytts kostnad bestäms av flera faktorer. Ju fler detaljer du anger i förväg, desto mer exakt blir din offert.
              </p>
              <p className="font-medium">De viktigaste faktorerna:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bostadens storlek (antal rum, kvm)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Avstånd mellan adresserna</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Våningsplan och om det finns hiss</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bäravstånd till lastplats</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Tilläggstjänster: packning, montering, städ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Tunga eller ömtåliga saker (piano, kassaskåp)</span>
                </li>
              </ul>

              {/* Section 2 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">2. Timpris vs fast pris</h2>
              <p>
                Flyttfirmor erbjuder ofta antingen timpris eller fast pris. Vilken modell som passar bäst beror på din flytt.
              </p>

              <div className="bg-secondary p-6 rounded-lg my-6">
                <h3 className="text-lg font-semibold mb-3">Timpris</h3>
                <p className="text-muted-foreground mb-3">
                  Du betalar för den tid flytten faktiskt tar. Priset baseras på antal flyttare och timpris per person eller team.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Passar bäst för:</strong> Mindre flyttar, där du själv packat och förberett allt.
                </p>
              </div>

              <div className="bg-secondary p-6 rounded-lg my-6">
                <h3 className="text-lg font-semibold mb-3">Fast pris</h3>
                <p className="text-muted-foreground mb-3">
                  Flyttfirman ger ett fast pris baserat på en uppskattning eller hembesök. Priset gäller oavsett hur lång tid flytten tar.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Passar bäst för:</strong> Större flyttar, när du vill ha full kostnadskontroll.
                </p>
              </div>

              <p>
                <Link to="/guider/fast-pris-vs-timpris" className="text-primary hover:underline">
                  Läs mer om skillnaden mellan fast pris och timpris →
                </Link>
              </p>

              {/* Section 3 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">3. Vanliga tillägg och extrakostnader</h2>
              <p>
                Utöver grundpriset kan det tillkomma kostnader för tjänster som inte ingår i basofferten.
              </p>
              <p className="font-medium">Exempel på tillägg:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Packning och emballage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Montering och demontering av möbler</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pianoflytt eller tunga lyft</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Flyttstädning av gammal bostad</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Magasinering (korttid eller långtid)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Extra stopp längs vägen</span>
                </li>
              </ul>

              {/* Section 4 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">4. RUT-avdrag – spara upp till 50%</h2>
              <p>
                Privatpersoner kan använda RUT-avdrag för flyttjänster. Det innebär att du får dra av 50% av arbetskostnaden (ej material) upp till ett maxbelopp per år.
              </p>
              <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-lg my-4">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground m-0">
                  RUT-avdraget gäller för arbetskostnaden vid flytt, packning och flyttstädning. Maxbelopp 2024 är 75 000 kr per person och år. Flyttfirman drar av RUT direkt på fakturan.
                </p>
              </div>

              {/* Section 5 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">5. Hur får jag ett rättvisande pris?</h2>
              <p>
                För att få en exakt offert som går att jämföra behöver du ange så detaljerad information som möjligt.
              </p>
              <p className="font-medium">Tips för att få bättre offerter:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ange exakt antal rum och ungefärlig boarea</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Beskriv våningsplan och hissituationen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lista tunga eller speciella föremål</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ange om du vill ha packning, montering eller städ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Var tydlig med önskat datum och flexibilitet</span>
                </li>
              </ul>

              {/* Summary */}
              <div className="bg-secondary p-6 rounded-lg mt-12">
                <h2 className="text-xl font-bold mb-3">Sammanfattning</h2>
                <p className="text-muted-foreground">
                  Kostnaden för en flytt beror på storlek, avstånd, våningsplan och tilläggstjänster. Genom att ange detaljerad information får du bättre och mer jämförbara offerter. Kom ihåg att du kan spara upp till 50% med RUT-avdraget.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Vill du veta vad din flytt kostar?
            </p>
            <Button size="lg" asChild>
              <Link to="/#quote-wizard">
                Få offerter gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Relaterade sidor</h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/priser" className="text-primary hover:underline">Priser</Link>
                <Link to="/guider/jamfor-flyttfirmor" className="text-primary hover:underline">Jämför flyttfirmor</Link>
                <Link to="/guider/fast-pris-vs-timpris" className="text-primary hover:underline">Fast pris vs timpris</Link>
                <Link to="/faq" className="text-primary hover:underline">Vanliga frågor</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default VadKostarEnFlytt;
