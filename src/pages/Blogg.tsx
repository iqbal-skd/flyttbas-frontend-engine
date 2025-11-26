import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const Blogg = () => {
  const categories = [
    "Alla artiklar",
    "Flytttips",
    "Packning",
    "Tunga lyft",
    "Priser & RUT",
    "Kontorsflytt",
    "Stockholm",
    "Magasinering",
    "Flyttstäd"
  ];

  const blogPosts = [
    {
      slug: "checklista-for-flytt",
      title: "Komplett checklista för flytt 2024 – Allt du behöver tänka på",
      excerpt: "En steg-för-steg guide som hjälper dig planera din flytt från början till slut. Inklusive tips om RUT-avdrag och hur du sparar tid och pengar.",
      category: "Flytttips",
      date: "2024-01-15",
      readTime: "8 min",
      image: "/placeholder.svg"
    },
    {
      slug: "packa-for-flytt-guide",
      title: "Packa smart inför flytten – Proffsens bästa tips",
      excerpt: "Lär dig hur proffsen packar effektivt och säkert. Från rätt material till packningsordning – allt du behöver veta.",
      category: "Packning",
      date: "2024-01-10",
      readTime: "6 min",
      image: "/placeholder.svg"
    },
    {
      slug: "rut-avdrag-flytt",
      title: "RUT-avdrag vid flytt – Så här fungerar det 2024",
      excerpt: "Få 50% rabatt på arbetskostnaden med RUT-avdrag. Vi förklarar reglerna, maxbelopp och hur du ansöker.",
      category: "Priser & RUT",
      date: "2024-01-08",
      readTime: "5 min",
      image: "/placeholder.svg"
    },
    {
      slug: "flytta-piano-sakert",
      title: "Guide: Flytta piano säkert – Vad du behöver veta",
      excerpt: "Piano är känsliga och tunga. Här är vår kompletta guide för att flytta ditt piano utan skador.",
      category: "Tunga lyft",
      date: "2024-01-05",
      readTime: "7 min",
      image: "/placeholder.svg"
    },
    {
      slug: "kontorsflytt-planering",
      title: "Kontorsflytt utan stress – Komplett planeringsguide",
      excerpt: "Planera en smidig kontorsflytt med minimal driftsstörning. Tips för IT-utrustning, möbler och kommunikation med personalen.",
      category: "Kontorsflytt",
      date: "2024-01-03",
      readTime: "10 min",
      image: "/placeholder.svg"
    },
    {
      slug: "flyttstadning-tips",
      title: "Flyttstädning i Stockholm – Krav och tips för godkänd städning",
      excerpt: "Vad krävs för en godkänd flyttstädning? Checklista och tips för att få tillbaka hela depositionen.",
      category: "Flyttstäd",
      date: "2023-12-28",
      readTime: "6 min",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Blogg – Flyttips & Guider Stockholm 2024 | Flyttbas</title>
        <meta name="description" content="Expertråd om flytt, packning, RUT-avdrag och flyttstädning. Läs våra guider och gör din flytt i Stockholm enklare och billigare." />
        <link rel="canonical" href="https://flyttbas.se/blogg" />
        <meta property="og:title" content="Blogg – Flyttips och guider för din flytt" />
        <meta property="og:description" content="Expertråd om flytt, packning och RUT-avdrag. Gör din flytt enklare." />
        <meta property="og:url" content="https://flyttbas.se/blogg" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Blogg – Tips & guider för din flytt
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Expertråd om flytt, packning, RUT-avdrag och allt däremellan. 
                Läs våra guider och gör din flytt enklare.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-light-bg border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogPosts.map((post, index) => (
                <Link to={`/blogg/${post.slug}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <img 
                        src={post.image} 
                        alt={`${post.title} - illustration om ${post.category.toLowerCase()}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="bg-orange/10 text-orange px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-navy line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('sv-SE', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        <ArrowRight className="h-5 w-5 text-orange" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-navy via-navy to-gray-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Behöver du hjälp med din flytt?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Vi erbjuder professionell flytthjälp i hela Stockholm med transparenta priser och RUT-avdrag.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/kontakt">Få offert</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/priser">Se priser</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Blogg;
