import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

const BlogPost = () => {
  const { slug } = useParams();

  // This would normally come from CMS/API
  const post = {
    title: "Komplett checklista för flytt 2024 – Allt du behöver tänka på",
    category: "Flytttips",
    date: "2024-01-15",
    readTime: "8 min",
    image: "/placeholder.svg",
    content: [
      {
        type: "intro",
        text: "Att flytta till en ny bostad är en av livets större händelser. Med rätt planering och förberedelser kan du göra flytten betydligt enklare och mindre stressig. Här är vår kompletta checklista som guidar dig genom hela flyttprocessen."
      },
      {
        type: "heading",
        text: "8 veckor innan flytt"
      },
      {
        type: "checklist",
        items: [
          "Boka flyttfirma – Gör det tidigt för bästa pris och tillgänglighet",
          "Säg upp gammalt boende enligt uppsägningstid",
          "Beställ städning om det ingår i hyresavtalet",
          "Inventera dina saker – Bestäm vad som ska med och vad som ska säljas/skänkas",
          "Börja använda gamla lådor och förpackningsmaterial"
        ]
      },
      {
        type: "heading",
        text: "4 veckor innan flytt"
      },
      {
        type: "checklist",
        items: [
          "Adressändring på Skatteverket (gäller för alla i hushållet)",
          "Meddela arbetsgivare, Försäkringskassan och banken",
          "Boka av eventuella abonnemang (el, bredband, TV)",
          "Beställa om el, bredband och försäkringar till nya bostaden",
          "Skaffa packmaterial – Lådor, bubbelplast, tejp och flyttfilt"
        ]
      },
      {
        type: "cta",
        title: "Behöver du hjälp med din flytt?",
        text: "Vi på Flyttbas hjälper dig med allt från packning till transport. Få ett kostnadsfritt prisförslag idag!",
        buttonText: "Få offert",
        buttonLink: "/kontakt"
      },
      {
        type: "heading",
        text: "1 vecka innan flytt"
      },
      {
        type: "checklist",
        items: [
          "Börja packa saker du inte använder dagligen",
          "Märk alla lådor tydligt med innehåll och vilket rum de ska till",
          "Bekräfta tid med flyttfirman",
          "Håll isär viktig dokumentation och värdesaker",
          "Tömma och frysa av kyl och frys"
        ]
      },
      {
        type: "heading",
        text: "Flyttdagen"
      },
      {
        type: "checklist",
        items: [
          "Packa en väska med nödvändigheter för första dagen",
          "Ta slutbilder i gamla bostaden",
          "Stäng av vatten och el",
          "Lämna över nycklar till hyresvärd eller ny ägare",
          "Gör en sista genomgång av alla utrymmen"
        ]
      },
      {
        type: "heading",
        text: "Tips för smidig flytt"
      },
      {
        type: "paragraph",
        text: "En av de viktigaste sakerna för en lyckad flytt är att börja i god tid. Planera minst 8 veckor i förväg och dela upp arbetet i hanterbara delar. Använd RUT-avdrag för att sänka kostnaden – du kan få upp till 50% rabatt på arbetskostnaden."
      },
      {
        type: "paragraph",
        text: "Tänk också på att packa strategiskt. Packa tyngre saker i mindre lådor och lättare saker i större lådor. Detta gör det enklare att bära och minskar risken för att lådor går sönder. Märk alltid lådorna tydligt så att flyttarna vet var de ska placeras i den nya bostaden."
      },
      {
        type: "heading",
        text: "RUT-avdrag vid flytt"
      },
      {
        type: "paragraph",
        text: "Många glömmer bort att flytt kvalificerar för RUT-avdrag. Det innebär att du kan få 50% rabatt på arbetskostnaden, upp till ett maxbelopp på 75 000 kr per person och år. Flyttfirman hanterar vanligtvis detta automatiskt – du betalar bara den reducerade summan direkt."
      }
    ],
    faq: [
      {
        question: "Hur långt i förväg ska jag boka flyttfirma?",
        answer: "Vi rekommenderar att du bokar flyttfirma minst 4-6 veckor i förväg, särskilt under högsäsong (maj-september). Detta ger dig bättre valmöjligheter och ofta bättre priser."
      },
      {
        question: "Ingår RUT-avdrag automatiskt?",
        answer: "Ja, hos Flyttbas ingår RUT-avdrag automatiskt i alla våra priser. Du behöver bara uppge ditt personnummer så hanterar vi resten med Skatteverket."
      },
      {
        question: "Vad händer om något går sönder under flytten?",
        answer: "Vi har full ansvarsförsäkring som täcker eventuella skador. Vi följer Bohag 2010 och dokumenterar noggrant innan, under och efter flytten."
      },
      {
        question: "Kan jag få hjälp med packning?",
        answer: "Absolut! Vi erbjuder professionell packhjälp till 695 kr/h (347,50 kr efter RUT). Våra flyttare har erfarenhet av att packa allt från känslig porslin till stor möbler."
      }
    ],
    relatedPosts: [
      {
        slug: "packa-for-flytt-guide",
        title: "Packa smart inför flytten – Proffsens bästa tips",
        category: "Packning"
      },
      {
        slug: "rut-avdrag-flytt",
        title: "RUT-avdrag vid flytt – Så här fungerar det 2024",
        category: "Priser & RUT"
      },
      {
        slug: "flyttstadning-tips",
        title: "Flyttstädning i Stockholm – Krav och tips",
        category: "Flyttstäd"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.title} | Flyttbas Blogg</title>
        <meta name="description" content={post.content.find(c => c.type === 'intro')?.text?.substring(0, 160) || "Expertråd om flytt i Stockholm"} />
        <link rel="canonical" href={`https://flyttbas.se/blogg/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.find(c => c.type === 'intro')?.text?.substring(0, 160) || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://flyttbas.se/blogg/${slug}`} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:section" content={post.category} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "Flyttbas"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Flyttbas"
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://flyttbas.se/blogg/${slug}`
            }
          })}
        </script>
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/blogg" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Tillbaka till bloggen
              </Link>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="bg-orange px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('sv-SE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1 text-white/80">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold">
                {post.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-lg max-w-none">
                {post.content.map((block, index) => {
                  switch (block.type) {
                    case 'intro':
                      return (
                        <p key={index} className="text-xl text-muted-foreground leading-relaxed mb-8">
                          {block.text}
                        </p>
                      );
                    case 'heading':
                      return (
                        <h2 key={index} className="text-2xl md:text-3xl font-bold text-navy mt-12 mb-6">
                          {block.text}
                        </h2>
                      );
                    case 'paragraph':
                      return (
                        <p key={index} className="text-foreground leading-relaxed mb-6">
                          {block.text}
                        </p>
                      );
                    case 'checklist':
                      return (
                        <div key={index} className="space-y-3 mb-8">
                          {block.items?.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <Check className="h-5 w-5 text-orange flex-shrink-0 mt-1" />
                              <span className="text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      );
                    case 'cta':
                      return (
                        <Card key={index} className="p-8 my-12 bg-light-bg border-2 border-orange/20">
                          <h3 className="text-2xl font-bold text-navy mb-4">
                            {block.title}
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            {block.text}
                          </p>
                          <Button asChild size="lg">
                            <Link to={block.buttonLink || "/kontakt"}>
                              {block.buttonText}
                            </Link>
                          </Button>
                        </Card>
                      );
                    default:
                      return null;
                  }
                })}
              </article>

              {/* FAQ Section */}
              <div className="mt-16 pt-16 border-t">
                <h2 className="text-3xl font-bold text-navy mb-8">Vanliga frågor</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {post.faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                      <AccordionTrigger className="text-left font-semibold text-navy hover:text-orange">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Related Posts */}
              <div className="mt-16 pt-16 border-t">
                <h2 className="text-3xl font-bold text-navy mb-8">Läs även</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {post.relatedPosts.map((related, index) => (
                    <Link key={index} to={`/blogg/${related.slug}`}>
                      <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                        <span className="text-xs text-orange font-medium mb-2 block">
                          {related.category}
                        </span>
                        <h3 className="font-bold text-navy line-clamp-3">
                          {related.title}
                        </h3>
                      </Card>
                    </Link>
                  ))}
                </div>
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

export default BlogPost;
