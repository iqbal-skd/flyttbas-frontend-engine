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

const FlyttstadningChecklista = () => {
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
      title: "Inför flyttstädning",
      items: [
        { id: "1-1", text: "Boka flyttstäd i god tid" },
        { id: "1-2", text: "Kontrollera vad som ingår i offerten" },
        { id: "1-3", text: "Töm bostaden helt" },
        { id: "1-4", text: "Frosta av kyl och frys" },
      ],
    },
    {
      title: "Kök",
      items: [
        { id: "2-1", text: "Rengör ugn, spis och fläkt" },
        { id: "2-2", text: "Rengör kyl och frys" },
        { id: "2-3", text: "Torka skåp, lådor och kakel" },
      ],
    },
    {
      title: "Badrum",
      items: [
        { id: "3-1", text: "Rengör kakel och fogar" },
        { id: "3-2", text: "Avkalka dusch och kranar" },
        { id: "3-3", text: "Rengör golvbrunn" },
      ],
    },
  ];

  const totalItems = sections.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = checkedItems.size;
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Flyttstädning – komplett checklista | Flyttbas</title>
        <meta name="description" content="Komplett checklista för flyttstädning. Säkerställ att flyttstädningen uppfyller vanliga krav från hyresvärdar och köpare." />
        <link rel="canonical" href="https://flyttbas.se/checklistor/flyttstadning-checklista" />
      </Helmet>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-white/70 mb-2">Checklista</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Flyttstädning – komplett checklista
              </h1>
              <p className="text-lg text-white/90 mb-6">
                Denna checklista hjälper dig säkerställa att flyttstädningen uppfyller vanliga krav från hyresvärdar och köpare.
              </p>
              <Button size="lg" variant="hero" asChild>
                <a href="/flyttstadning-checklista.pdf" download>
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
              Behöver du hjälp med flyttstädningen?
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
                <Link to="/checklistor/flytt-checklista" className="text-primary hover:underline">Flyttchecklista</Link>
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

export default FlyttstadningChecklista;
