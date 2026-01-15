import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const FastPrisVsTimpris = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Fast pris vs timpris vid flytt | Guide | Flyttbas</title>
        <meta name="description" content="Ska du välja fast pris eller timpris för din flytt? Läs om fördelar och nackdelar med båda alternativen och när respektive modell passar bäst." />
        <link rel="canonical" href="https://flyttbas.se/guider/fast-pris-vs-timpris" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Guide</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Fast pris vs timpris vid flytt
              </h1>
              <p className="text-lg text-white/90">
                När du bokar en flytt kan du oftast välja mellan fast pris och timpris. Här går vi igenom vad som skiljer alternativen åt och när respektive modell passar bäst.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">

              {/* Section 1 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">Vad innebär timpris?</h2>
              <p>
                Vid timpris betalar du för den tid flytten faktiskt tar. Priset beräknas utifrån antal arbetare och timkostnad per person eller team.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Fördelar med timpris</h3>
                  <ul className="space-y-2 m-0">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Du betalar bara för faktisk tid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Kan bli billigare vid snabb flytt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Flexibelt – du kan hjälpa till själv</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Enkelt att jämföra timpriser</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Nackdelar med timpris</h3>
                  <ul className="space-y-2 m-0">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Slutkostnaden blir okänd</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Risk för överraskningar om det tar längre tid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Du tar risken om något går fel</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                <strong>Timpris passar bäst för:</strong> Mindre flyttar, väl förberedd flytt där allt är packat, när du själv kan hjälpa till.
              </p>

              {/* Section 2 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">Vad innebär fast pris?</h2>
              <p>
                Vid fast pris ger flyttfirman ett pris för hela flytten baserat på en uppskattning av jobbet. Priset gäller oavsett hur lång tid flytten tar.
              </p>

              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">Fördelar med fast pris</h3>
                  <ul className="space-y-2 m-0">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Full kostnadskontroll</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Inga överraskningar på slutfakturan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Flyttfirman tar risken för förseningar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Lättare att budgetera</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Nackdelar med fast pris</h3>
                  <ul className="space-y-2 m-0">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Kan bli dyrare om flytten går snabbt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Kräver ofta hembesök eller detaljerad beskrivning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Tillägg kan tillkomma vid avvikelser</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                <strong>Fast pris passar bäst för:</strong> Större flyttar, när du vill ha trygghet, när det finns mycket att flytta eller osäkra faktorer.
              </p>

              {/* Section 3 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">Hur väljer jag rätt?</h2>
              <p>
                Valet beror på din situation och hur väl du kan uppskatta flyttens omfattning.
              </p>

              <div className="bg-secondary p-6 rounded-lg my-6">
                <h3 className="text-lg font-semibold mb-4">Välj timpris om:</h3>
                <ul className="space-y-2 m-0">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Du har en liten lägenhet (1-2 rum)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Allt är packat och klart</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Det finns hiss i båda bostäderna</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Du kan hjälpa till själv</span>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary p-6 rounded-lg my-6">
                <h3 className="text-lg font-semibold mb-4">Välj fast pris om:</h3>
                <ul className="space-y-2 m-0">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Du har en större bostad (3+ rum)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Det finns många trappor eller lång bärväg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Du vill ha full kostnadskontroll</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Du har tunga saker som piano eller kassaskåp</span>
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <h2 className="text-2xl font-bold mt-12 mb-4">Var tydlig oavsett prismodell</h2>
              <p>
                Oavsett om du väljer timpris eller fast pris är det viktigt att ge flyttfirman korrekt information. Då minimerar du risken för tillägg och missförstånd.
              </p>
              <p className="font-medium">Ange alltid:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Antal rum och ungefärlig boarea</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Våningsplan och hissituation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bäravstånd till lastplats</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Speciella föremål eller tunga lyft</span>
                </li>
              </ul>

              {/* Summary */}
              <div className="bg-secondary p-6 rounded-lg mt-12">
                <h2 className="text-xl font-bold mb-3">Sammanfattning</h2>
                <p className="text-muted-foreground">
                  Timpris ger flexibilitet men osäker slutkostnad. Fast pris ger trygghet och full kontroll över budgeten. Välj utifrån din flytt och hur väl du kan uppskatta omfattningen. Var alltid tydlig med informationen du ger – det gör offerten mer exakt.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Osäker på vad som passar dig? Jämför offerter med båda prismodellerna.
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
                <Link to="/guider/vad-kostar-en-flytt" className="text-primary hover:underline">Vad kostar en flytt?</Link>
                <Link to="/guider/jamfor-flyttfirmor" className="text-primary hover:underline">Jämför flyttfirmor</Link>
                <Link to="/priser" className="text-primary hover:underline">Priser</Link>
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

export default FastPrisVsTimpris;
