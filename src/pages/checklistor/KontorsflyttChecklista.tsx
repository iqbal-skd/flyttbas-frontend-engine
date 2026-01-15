import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Square, CheckSquare } from "lucide-react";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  title: string;
  timeframe: string;
  items: ChecklistItem[];
}

const KontorsflyttChecklista = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const sections: ChecklistSection[] = [
    {
      title: "Planering och förberedelser",
      timeframe: "3-6 månader innan",
      items: [
        { id: "1-1", text: "Tillsätt en projektgrupp med ansvariga från varje avdelning" },
        { id: "1-2", text: "Upprätta budget för flytten inklusive oförutsedda kostnader" },
        { id: "1-3", text: "Inventera nuvarande kontorsmöbler och utrustning" },
        { id: "1-4", text: "Besluta vad som ska med, säljas, doneras eller kastas" },
        { id: "1-5", text: "Begär offerter från flera flyttfirmor med erfarenhet av kontorsflytt" },
        { id: "1-6", text: "Kontrollera att flyttfirman har rätt försäkringar" },
        { id: "1-7", text: "Planera IT-flytt och kontakta leverantörer (internet, telefoni)" },
        { id: "1-8", text: "Informera hyresvärden om utflyttsdatum" },
      ],
    },
    {
      title: "Kommunikation och logistik",
      timeframe: "1-2 månader innan",
      items: [
        { id: "2-1", text: "Informera alla anställda om flyttdatum och plan" },
        { id: "2-2", text: "Skapa en planlösning för det nya kontoret" },
        { id: "2-3", text: "Tilldela arbetsplatser och märk upp var saker ska" },
        { id: "2-4", text: "Beställ flyttkartonger och emballage" },
        { id: "2-5", text: "Ordna parkeringstillstånd för flyttbil vid båda adresserna" },
        { id: "2-6", text: "Boka hiss (om tillämpligt) vid båda kontoren" },
        { id: "2-7", text: "Meddela kunder, leverantörer och samarbetspartners om adressändring" },
        { id: "2-8", text: "Uppdatera adress hos Bolagsverket och andra register" },
      ],
    },
    {
      title: "Packning och förberedelse",
      timeframe: "2-4 veckor innan",
      items: [
        { id: "3-1", text: "Börja packa arkivmaterial och sällan använda saker" },
        { id: "3-2", text: "Märk alla kartonger tydligt med avdelning och innehåll" },
        { id: "3-3", text: "Dokumentera hur IT-utrustning är kopplad" },
        { id: "3-4", text: "Ta backup på alla datorer och servrar" },
        { id: "3-5", text: "Rensa ut onödiga dokument och filer" },
        { id: "3-6", text: "Avsluta eller flytta prenumerationer och abonnemang" },
        { id: "3-7", text: "Ordna med eftersändning av post" },
        { id: "3-8", text: "Säkerställ att nya lokalen är redo (nycklar, larm, städat)" },
      ],
    },
    {
      title: "Sista veckan och flyttdagen",
      timeframe: "Veckan före och flyttdagen",
      items: [
        { id: "4-1", text: "Packa de sista sakerna, lämna bara det nödvändigaste framme" },
        { id: "4-2", text: "Stäng av och koppla ur IT-utrustning enligt plan" },
        { id: "4-3", text: "Ha ansvariga på plats vid både gamla och nya kontoret" },
        { id: "4-4", text: "Kontrollera att allt kommer med och att inget glöms" },
        { id: "4-5", text: "Dokumentera eventuella skador på inventarier" },
        { id: "4-6", text: "Se till att IT-installationen fungerar i nya lokalen" },
        { id: "4-7", text: "Gör en rundvandring i gamla lokalen före överlämnande" },
        { id: "4-8", text: "Återlämna nycklar och passerkort till gamla kontoret" },
      ],
    },
    {
      title: "Efter flytten",
      timeframe: "Veckan efter",
      items: [
        { id: "5-1", text: "Packa upp och installera alla arbetsplatser" },
        { id: "5-2", text: "Verifiera att telefoni och IT fungerar korrekt" },
        { id: "5-3", text: "Samla in feedback från medarbetare" },
        { id: "5-4", text: "Uppdatera visitkort, hemsida och sociala medier med ny adress" },
        { id: "5-5", text: "Skicka ut adressändring till resterande kontakter" },
        { id: "5-6", text: "Utvärdera flyttprocessen och dokumentera lärdomar" },
      ],
    },
  ];

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Kontorsflytt checklista | Komplett guide | Flyttbas</title>
        <meta name="description" content="Komplett checklista för kontorsflytt. Planera företagets flytt steg för steg – från 6 månader innan till efter flytten." />
        <link rel="canonical" href="https://flyttbas.se/checklistor/kontorsflytt-checklista" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Checklista</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Kontorsflytt checklista
              </h1>
              <p className="text-lg text-white/90">
                Komplett checklista för att planera och genomföra en kontorsflytt. Använd listan för att säkerställa att inget glöms – från planering till inflyttning.
              </p>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="py-6 bg-secondary sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Din framgång</span>
                <span className="text-sm text-muted-foreground">{completedItems} av {totalItems} ({progress}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Checklist Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-12">
                  <div className="flex items-baseline gap-3 mb-4">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    <span className="text-sm text-muted-foreground">({section.timeframe})</span>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left ${
                          checkedItems.has(item.id)
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {checkedItems.has(item.id) ? (
                          <CheckSquare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={checkedItems.has(item.id) ? "line-through text-muted-foreground" : ""}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Tips för en lyckad kontorsflytt</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <ul>
                  <li>Boka flyttfirma i god tid – kontorsflytt kräver ofta specialkompetens</li>
                  <li>Planera IT-flytten separat med experter</li>
                  <li>Kommunicera tydligt med alla medarbetare genom hela processen</li>
                  <li>Ha en backup-plan om något går fel</li>
                  <li>Dokumentera allt – det underlättar utvärdering och framtida flyttar</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Behöver du hjälp med kontorsflytten?
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
                <Link to="/kontorsflytt" className="text-primary hover:underline">Kontorsflytt</Link>
                <Link to="/guider/vad-kostar-en-flytt" className="text-primary hover:underline">Vad kostar en flytt?</Link>
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

export default KontorsflyttChecklista;
