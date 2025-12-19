import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { QuoteWizard } from "@/components/quote-wizard";
import { Card } from "@/components/ui/card";
import { Check, Info } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Priser = () => {
  const priceExamples = [
    {
      title: "1:a - 40 m²",
      hours: "3-4 timmar",
      team: "2 flyttare",
      price: "2 995 - 3 980 kr",
      details: "Efter RUT-avdrag"
    },
    {
      title: "2:a - 60 m²",
      hours: "4-5 timmar",
      team: "2 flyttare",
      price: "3 980 - 4 975 kr",
      details: "Efter RUT-avdrag"
    },
    {
      title: "3:a - 80 m²",
      hours: "5-6 timmar",
      team: "3 flyttare",
      price: "6 475 - 7 770 kr",
      details: "Efter RUT-avdrag"
    },
    {
      title: "Villa - 120 m²",
      hours: "7-9 timmar",
      team: "3 flyttare",
      price: "9 065 - 11 655 kr",
      details: "Efter RUT-avdrag"
    }
  ];

  const included = [
    "Offerter från verifierade flyttfirmor",
    "Alla firmor är försäkrade",
    "Jämför priser och omdömen",
    "Kundskydd vid bokningar",
    "RUT-avdrag hanteras automatiskt",
    "100% gratis att använda"
  ];

  const addons = [
    { name: "Packning", price: "Från 295 kr/tim" },
    { name: "Uppackning", price: "Från 295 kr/tim" },
    { name: "Montering/demontering", price: "Ofta inkluderat" },
    { name: "Flyttstädning", price: "Från 2 495 kr" },
    { name: "Magasinering", price: "Från 995 kr/mån" },
    { name: "Pianoflytt", price: "Från 2 495 kr" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Jämför Priser Flyttfirmor Stockholm 2024 – Hitta Bästa Priset</title>
        <meta name="description" content="Jämför priser från verifierade flyttfirmor i Stockholm. Se prisexempel och hitta bästa erbjudandet. RUT-avdrag 50%. Gratis att använda!" />
        <link rel="canonical" href="https://flyttbas.se/priser" />
        <meta property="og:title" content="Jämför priser från flyttfirmor i Stockholm" />
        <meta property="og:description" content="Se prisexempel och jämför offerter. Hitta bästa priset för din flytt." />
        <meta property="og:url" content="https://flyttbas.se/priser" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Jämför priser från flyttfirmor
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Se vad en flytt brukar kosta och jämför offerter för att hitta bästa priset.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Quote Form */}
        <section className="py-12 md:py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-6 md:mb-8 text-navy">Få offerter från flyttfirmor</h2>
              <QuoteWizard />
            </div>
          </div>
        </section>

        {/* Price Examples */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-navy">Typiska priser för flytt</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Priserna varierar mellan firmor. Jämför offerter för att hitta bästa erbjudandet för just din flytt.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {priceExamples.map((example, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-navy">{example.title}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">Tid: {example.hours}</p>
                    <p className="text-sm text-muted-foreground">Team: {example.team}</p>
                  </div>
                  <p className="text-2xl font-bold text-orange mb-2">{example.price}</p>
                  <p className="text-xs text-muted-foreground">{example.details}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vad ingår när du använder Flyttbas?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {included.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-orange flex-shrink-0 mt-1" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-navy">Vanliga tilläggstjänster</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {addons.map((addon, index) => (
                <Card key={index} className="p-4 flex justify-between items-center">
                  <span className="font-medium text-foreground">{addon.name}</span>
                  <span className="text-orange font-semibold">{addon.price}</span>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* RUT Info */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4 items-start bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-navy">Om RUT-avdrag</h3>
                  <p className="text-muted-foreground mb-3">
                    RUT-avdraget ger dig 50% rabatt på arbetskostnaden, upp till ett maxbelopp per år. 
                    Alla våra verifierade partners hanterar RUT-avdraget automatiskt.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Maxbelopp:</strong> 75 000 kr per person och år (vilket motsvarar 150 000 kr i arbetskostnad)
                  </p>
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

export default Priser;
