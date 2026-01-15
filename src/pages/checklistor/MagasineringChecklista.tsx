import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Square, CheckSquare, Info } from "lucide-react";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  title: string;
  description?: string;
  items: ChecklistItem[];
}

const MagasineringChecklista = () => {
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
      title: "Innan du magasinerar",
      description: "Förberedelser och val av förråd",
      items: [
        { id: "1-1", text: "Bestäm hur länge du behöver magasinera" },
        { id: "1-2", text: "Uppskatta hur mycket utrymme du behöver (i kubikmeter eller kvm)" },
        { id: "1-3", text: "Jämför priser mellan olika magasineringsalternativ" },
        { id: "1-4", text: "Kontrollera att förrådet är torrt, säkert och försäkrat" },
        { id: "1-5", text: "Fråga om det finns klimatkontroll (viktigt för känsliga saker)" },
        { id: "1-6", text: "Kontrollera tillgänglighet – kan du hämta saker när du vill?" },
        { id: "1-7", text: "Läs igenom avtal och uppsägningstider" },
      ],
    },
    {
      title: "Packning och skydd",
      description: "Så förbereder du dina saker för förvaring",
      items: [
        { id: "2-1", text: "Rengör alla föremål innan förvaring" },
        { id: "2-2", text: "Demontera möbler som kan plockas isär" },
        { id: "2-3", text: "Använd flyttkartonger – undvik plastpåsar för textil" },
        { id: "2-4", text: "Slå in ömtåliga saker i bubbelplast eller mjukt material" },
        { id: "2-5", text: "Skydda stoppade möbler med filtar eller skynken" },
        { id: "2-6", text: "Töm kylskåp och frys helt och lämna dörrarna öppna" },
        { id: "2-7", text: "Skruva av ben från soffor och bord för att spara plats" },
        { id: "2-8", text: "Fota värdefulla föremål innan förvaring" },
      ],
    },
    {
      title: "Speciella föremål",
      description: "Extra hänsyn för känsliga saker",
      items: [
        { id: "3-1", text: "Elektronik: Förvara i originalförpackning om möjligt, annars i kartong" },
        { id: "3-2", text: "Kläder: Tvätta innan, använd garderobskartonger eller textilpåsar" },
        { id: "3-3", text: "Böcker och papper: Packa platt i små kartonger (blir tungt)" },
        { id: "3-4", text: "Tavlor och speglar: Stående, skyddade med hörnskydd" },
        { id: "3-5", text: "Madrasser: Använd madrasskydd och förvara liggande eller stående" },
        { id: "3-6", text: "Vitvaror: Rengör och torka ordentligt, lämna dörrar öppna" },
      ],
    },
    {
      title: "Märkning och dokumentation",
      description: "Gör det enkelt att hitta saker",
      items: [
        { id: "4-1", text: "Märk alla kartonger tydligt med innehåll" },
        { id: "4-2", text: "Gör en inventarielista över allt som magasineras" },
        { id: "4-3", text: "Numrera kartonger och hänvisa till listan" },
        { id: "4-4", text: "Ta foton av kartongernas innehåll" },
        { id: "4-5", text: "Skapa en planritning över hur förrådet är packat" },
      ],
    },
    {
      title: "I förrådet",
      description: "Hur du packar förrådet smart",
      items: [
        { id: "5-1", text: "Placera tunga saker längst ner och längst in" },
        { id: "5-2", text: "Lägg saker du kan behöva hämta närmast dörren" },
        { id: "5-3", text: "Stapla kartonger med de tyngsta längst ner" },
        { id: "5-4", text: "Lämna gångvägar om du har mycket saker" },
        { id: "5-5", text: "Använd höjden – stapla stabilt så högt som möjligt" },
        { id: "5-6", text: "Placera möbler så de tar minst plats" },
        { id: "5-7", text: "Lägg pallar eller plast på golvet om det är betonggolv" },
      ],
    },
    {
      title: "Försäkring och säkerhet",
      items: [
        { id: "6-1", text: "Kontrollera om din hemförsäkring täcker magasinerade saker" },
        { id: "6-2", text: "Teckna tilläggsförsäkring om det behövs" },
        { id: "6-3", text: "Spara kvitton och dokumentation på värdefulla föremål" },
        { id: "6-4", text: "Använd ett godkänt lås på förrådet" },
        { id: "6-5", text: "Dela inte tillgångskod med obehöriga" },
      ],
    },
  ];

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Magasinering checklista | Komplett guide | Flyttbas</title>
        <meta name="description" content="Komplett checklista för magasinering. Lär dig packa, skydda och förvara dina saker rätt – för korttid eller långtidsförvaring." />
        <link rel="canonical" href="https://flyttbas.se/checklistor/magasinering-checklista" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Checklista</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Magasinering checklista
              </h1>
              <p className="text-lg text-white/90">
                Komplett checklista för dig som ska magasinera. Lär dig förbereda, packa och förvara dina saker på rätt sätt – oavsett om det är för en kort eller lång period.
              </p>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="py-6 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 m-0">
                <strong>Tips:</strong> Många flyttfirmor erbjuder magasinering som tilläggstjänst. Det kan vara smidigare att boka allt på samma ställe.
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
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                    {section.description && (
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    )}
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

        {/* What Not to Store Section */}
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Saker du inte bör magasinera</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <ul>
                  <li>Brandfarliga vätskor och gasflaskor</li>
                  <li>Färskvaror och livsmedel</li>
                  <li>Levande växter och djur</li>
                  <li>Värdehandlingar och pass</li>
                  <li>Oregistrerade vapen och ammunition</li>
                  <li>Narkotika och olagliga substanser</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Storage Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Olika typer av magasinering</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Eget förråd (self-storage)</h3>
                  <p className="text-sm text-muted-foreground">
                    Du hyr ett låsbart utrymme och sköter packning och hämtning själv. Flexibelt och ofta billigare.
                  </p>
                </div>
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Fullservicemagasinering</h3>
                  <p className="text-sm text-muted-foreground">
                    Flyttfirman hämtar, förvarar och levererar tillbaka dina saker. Smidigast men ofta dyrare.
                  </p>
                </div>
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Containerförvaring</h3>
                  <p className="text-sm text-muted-foreground">
                    En container ställs ut vid din bostad, du packar själv, och containern hämtas för förvaring.
                  </p>
                </div>
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Klimatstyrt förråd</h3>
                  <p className="text-sm text-muted-foreground">
                    Temperatur- och fuktkontrollerat. Nödvändigt för känsliga föremål som konst, vin eller elektronik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Behöver du hjälp med flytt och magasinering?
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
                <Link to="/checklistor/dodsbo-checklista" className="text-primary hover:underline">Dödsbo checklista</Link>
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

export default MagasineringChecklista;
