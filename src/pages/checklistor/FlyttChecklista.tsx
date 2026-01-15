import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Square, CheckSquare, Download } from "lucide-react";
import { useState } from "react";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

const FlyttChecklista = () => {
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
      title: "6–8 veckor före flytt",
      items: [
        { id: "1-1", text: "Bestäm flyttdatum" },
        { id: "1-2", text: "Gör en inventering av bohaget" },
        { id: "1-3", text: "Sortera bort det som inte ska med" },
        { id: "1-4", text: "Jämför flyttfirmor och begär offerter" },
        { id: "1-5", text: "Kontrollera vad som ingår i offerten" },
      ],
    },
    {
      title: "3–4 veckor före flytt",
      items: [
        { id: "2-1", text: "Boka flyttfirma" },
        { id: "2-2", text: "Boka flyttstädning eller planera egen städning" },
        { id: "2-3", text: "Ordna flyttkartonger och packmaterial" },
        { id: "2-4", text: "Anmäl adressändring" },
        { id: "2-5", text: "Meddela el, bredband och försäkringsbolag" },
      ],
    },
    {
      title: "1–2 veckor före flytt",
      items: [
        { id: "3-1", text: "Börja packa saker som inte används dagligen" },
        { id: "3-2", text: "Märk kartonger tydligt" },
        { id: "3-3", text: "Planera parkering och tillgänglighet" },
        { id: "3-4", text: "Boka hiss om det behövs" },
      ],
    },
    {
      title: "Flyttdagen",
      items: [
        { id: "4-1", text: "Var tillgänglig under flytten" },
        { id: "4-2", text: "Gå igenom uppdraget innan start" },
        { id: "4-3", text: "Kontrollera att allt lastas korrekt" },
      ],
    },
    {
      title: "Efter flytten",
      items: [
        { id: "5-1", text: "Kontrollera att allt kommit fram" },
        { id: "5-2", text: "Packa upp det viktigaste först" },
        { id: "5-3", text: "Gå igenom flyttstädningen" },
        { id: "5-4", text: "Uppdatera adress hos viktiga aktörer" },
      ],
    },
  ];

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Komplett flyttchecklista – steg för steg | Flyttbas</title>
        <meta name="description" content="Komplett flyttchecklista som hjälper dig planera din flytt från första förberedelse till inflytt. Minska stress och undvik missar." />
        <link rel="canonical" href="https://flyttbas.se/checklistor/flytt-checklista" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Checklista</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Komplett flyttchecklista – steg för steg
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Den här checklistan hjälper dig att planera din flytt från första förberedelse till inflytt. Checklistan är framtagen av Flyttbas för att minska stress, undvika missar och göra det enklare att jämföra flyttofferter på rätt sätt.
              </p>
              <Button size="lg" variant="hero" asChild>
                <a href="/flytt-checklista.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Ladda ner som PDF
                </a>
              </Button>
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
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
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

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Redo att boka din flytt?
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
                <Link to="/checklistor/flyttstadning-checklista" className="text-primary hover:underline">Flyttstädning checklista</Link>
                <Link to="/guider/vad-kostar-en-flytt" className="text-primary hover:underline">Vad kostar en flytt?</Link>
                <Link to="/guider/jamfor-flyttfirmor" className="text-primary hover:underline">Jämför flyttfirmor</Link>
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

export default FlyttChecklista;
