import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const JamforFlyttfirmor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Så jämför du flyttfirmor rätt | Guide | Flyttbas</title>
        <meta name="description" content="Att jämföra flyttfirmor handlar inte bara om pris. Lär dig jämföra totalpris, villkor och innehåll på rätt sätt." />
        <link rel="canonical" href="https://flyttbas.se/guider/jamfor-flyttfirmor" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Guide</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Så jämför du flyttfirmor rätt
              </h1>
              <p className="text-lg text-white/90">
                Att jämföra flyttfirmor handlar inte bara om pris. Två offerter kan se lika ut – men skilja sig i vad som ingår, villkor, ansvar och tillägg. Här är en enkel metod för att jämföra på ett rättvist sätt och undvika oväntade kostnader.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">

              {/* Section 1 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">1. Jämför alltid totalpris – inte bara timpris</h2>
              <p>
                Timpris kan låta lågt, men totalpriset påverkas av antal flyttare, minimitid, restid och eventuella tillägg. Be alltid om en offert där det tydligt framgår hur priset räknas.
              </p>
              <p className="font-medium">Kontrollera:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>timpris och antal flyttare</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>minimitid</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>om restid ingår eller debiteras separat</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>eventuella startavgifter</span>
                </li>
              </ul>

              {/* Section 2 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">2. Säkerställ att offerterna bygger på samma underlag</h2>
              <p>
                En offert blir bara jämförbar om företagen fått samma information. Var tydlig med bostadens storlek, våningsplan, hiss, bäravstånd och om något är tungt eller känsligt.
              </p>
              <p className="font-medium">Se till att detta finns med:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>adress/område och eventuella stopp</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>våningar, hiss och bäravstånd</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>boarea eller antal rum</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>önskat datum och tidsfönster</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>tillägg: packning, montering, städ, magasinering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>tunga lyft: piano, kassaskåp, stora vitvaror</span>
                </li>
              </ul>

              {/* Section 3 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">3. Kontrollera vad som ingår – och vad som inte ingår</h2>
              <p>
                En flytt kan inkludera olika saker beroende på företag. Det som saknas i offerten kan komma som tillägg.
              </p>
              <p className="font-medium">Vanliga skillnader mellan offerter:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>skyddsmaterial (filtar, plast, spännband)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>emballage och flyttkartonger</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>montering/demontering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>bära i trappor eller lång bärväg</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>extra stopp eller väntetid</span>
                </li>
              </ul>

              {/* Section 4 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">4. Läs villkoren – särskilt för tillägg och ändringar</h2>
              <p>
                Villkor avgör vad som händer om något ändras: datum, volym eller åtkomst. Seriösa företag är tydliga här.
              </p>
              <p className="font-medium">Kontrollera villkor för:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>ändring eller avbokning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>förseningar och väntetid</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>extra kostnader vid avvikande volym</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>betalningsvillkor</span>
                </li>
              </ul>

              {/* Section 5 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">5. Ansvar och försäkring – be om tydlighet</h2>
              <p>
                Fråga vad som gäller om något skadas och hur skador hanteras. Det ska vara enkelt att förstå innan du bokar.
              </p>
              <p className="font-medium">Fråga alltid:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>vad försäkringen täcker</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>om det finns självrisk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>hur en skada rapporteras</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>vem som ansvarar vid egen packning</span>
                </li>
              </ul>

              {/* Section 6 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">6. Välj inte billigast – välj tydligast</h2>
              <p>
                Den bästa offerten är ofta den som är mest transparent: tydlig omfattning, tydliga villkor och rimligt totalpris. Då minskar risken för missförstånd och tillägg.
              </p>

              {/* Summary */}
              <div className="bg-secondary p-6 rounded-lg mt-12">
                <h2 className="text-xl font-bold mb-3">Sammanfattning</h2>
                <p className="text-muted-foreground">
                  En bra jämförelse bygger på samma underlag, totalpris, tydligt innehåll och tydliga villkor. När du jämför på rätt sätt blir det enklare att välja en flyttfirma som passar din flytt – utan överraskningar.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Vill du jämföra totalpris och villkor på samma underlag?
            </p>
            <Button size="lg" asChild>
              <Link to="/#quote-wizard">
                Jämför offerter gratis
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
                <Link to="/faq" className="text-primary hover:underline">Vanliga frågor</Link>
                <Link to="/checklistor/flytt-checklista" className="text-primary hover:underline">Flyttchecklista</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JamforFlyttfirmor;
