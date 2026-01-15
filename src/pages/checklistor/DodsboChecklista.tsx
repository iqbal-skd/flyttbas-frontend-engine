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

const DodsboChecklista = () => {
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
      title: "Praktiska åtgärder först",
      description: "Det viktigaste att ordna de första veckorna",
      items: [
        { id: "1-1", text: "Anmäl dödsfallet till Skatteverket (sker ofta automatiskt via begravningsbyrå)" },
        { id: "1-2", text: "Kontakta begravningsbyrå för planering" },
        { id: "1-3", text: "Säg upp eventuella abonnemang (el, internet, tidningar)" },
        { id: "1-4", text: "Meddela hyresvärd eller bostadsrättsförening" },
        { id: "1-5", text: "Ordna eftersändning av post till dödsbodelägare" },
        { id: "1-6", text: "Kontakta försäkringsbolag angående hemförsäkring" },
        { id: "1-7", text: "Kontrollera om det finns ett testamente" },
      ],
    },
    {
      title: "Bouppteckning",
      description: "Ska vara klar inom 3 månader efter dödsfallet",
      items: [
        { id: "2-1", text: "Utse en förrättningsman för bouppteckningen" },
        { id: "2-2", text: "Samla alla ekonomiska uppgifter (bankkonton, skulder, tillgångar)" },
        { id: "2-3", text: "Inventera lösöre och värdesaker i bostaden" },
        { id: "2-4", text: "Kontakta alla dödsbodelägare" },
        { id: "2-5", text: "Genomför bouppteckningsförrättning" },
        { id: "2-6", text: "Skicka in bouppteckningen till Skatteverket" },
      ],
    },
    {
      title: "Sortering och värdering",
      description: "Gå igenom bostadens innehåll",
      items: [
        { id: "3-1", text: "Gör en första genomgång av bostaden" },
        { id: "3-2", text: "Sortera: behålla, sälja, donera, återvinna, kasta" },
        { id: "3-3", text: "Låt värdera antikviteter eller konstföremål om sådana finns" },
        { id: "3-4", text: "Fotografera värdefulla föremål för dokumentation" },
        { id: "3-5", text: "Fördela personliga ägodelar mellan dödsbodelägare" },
        { id: "3-6", text: "Kontakta auktionsfirma om du vill sälja via auktion" },
      ],
    },
    {
      title: "Tömning av bostaden",
      description: "När sorteringen är klar",
      items: [
        { id: "4-1", text: "Begär offerter från dödsbo-firmor eller flyttfirmor" },
        { id: "4-2", text: "Boka bortforsling av grovsopor och möbler" },
        { id: "4-3", text: "Kontakta välgörenhetsorganisation för donationer" },
        { id: "4-4", text: "Ordna transport av saker som ska sparas" },
        { id: "4-5", text: "Se till att bostaden städas efter tömning" },
        { id: "4-6", text: "Kontrollera att förråd och källare är tömda" },
        { id: "4-7", text: "Avläs mätarställning på el, vatten om tillämpligt" },
      ],
    },
    {
      title: "Avslut och överlämning",
      items: [
        { id: "5-1", text: "Genomför slutstädning av bostaden" },
        { id: "5-2", text: "Återlämna nycklar till hyresvärd eller mäklare" },
        { id: "5-3", text: "Avsluta hyresavtal eller påbörja försäljning av bostad" },
        { id: "5-4", text: "Säkerställ att alla räkningar är betalda" },
        { id: "5-5", text: "Genomför arvskifte mellan dödsbodelägare" },
        { id: "5-6", text: "Avsluta dödsboets bankkonto efter skifte" },
      ],
    },
  ];

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Dödsbo checklista | Komplett guide | Flyttbas</title>
        <meta name="description" content="Komplett checklista för dödsbo. Praktisk guide för hantering av dödsbo – från bouppteckning till tömning och städning." />
        <link rel="canonical" href="https://flyttbas.se/checklistor/dodsbo-checklista" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Checklista</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Dödsbo checklista
              </h1>
              <p className="text-lg text-white/90">
                En praktisk checklista för dig som ska hantera ett dödsbo. Guiden hjälper dig genom alla steg – från praktiska åtgärder direkt efter dödsfallet till tömning och överlämning av bostaden.
              </p>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <section className="py-6 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800 m-0">
                <strong>Viktigt:</strong> Bouppteckningen ska vara klar och inskickad till Skatteverket inom 3 månader efter dödsfallet.
                Om du behöver mer tid kan du ansöka om anstånd hos Skatteverket.
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

        {/* Tips Section */}
        <section className="py-12 md:py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Bra att veta om dödsbon</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <ul>
                  <li>Dödsboet är en juridisk person fram till arvskiftet</li>
                  <li>Alla dödsbodelägare måste vara överens om beslut</li>
                  <li>Du kan anlita en jurist eller begravningsbyrå för hjälp med bouppteckningen</li>
                  <li>Många dödsbo-firmor erbjuder helhetslösningar (tömning, städning, värdering)</li>
                  <li>Spara alltid kvitton på kostnader – dessa kan dras från dödsboet</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* RUT Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">RUT-avdrag för dödsbo</h2>
              <p className="text-muted-foreground mb-4">
                Privatpersoner som ärver kan i vissa fall använda RUT-avdrag för städning och bortforsling av dödsboet.
                Kontrollera med Skatteverket vilka regler som gäller för din situation.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Behöver du hjälp med dödsboet?
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
                <Link to="/checklistor/magasinering-checklista" className="text-primary hover:underline">Magasinering checklista</Link>
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

export default DodsboChecklista;
