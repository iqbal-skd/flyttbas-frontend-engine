import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Case = () => {
  const cases = [
    {
      title: "Familjeflytt via Flyttbas",
      type: "Privatflytt",
      icon: Home,
      area: "85 m²",
      time: "6 timmar",
      team: "3 flyttare",
      firm: "Stockholms Flyttexpress",
      description: "En familj i Södermalm jämförde 4 offerter via Flyttbas och valde en firma baserat på bäst omdömen och konkurrenskraftigt pris.",
      result: "Flytten genomfördes smidigt på en dag. 0 skador. Familjen sparade 2 500 kr jämfört med första offerten de fick.",
      quote: "Så smidigt att jämföra! Vi hittade en fantastisk firma vi aldrig hade hittat annars."
    },
    {
      title: "Tech-startup hittade rätt partner",
      type: "Kontorsflytt",
      icon: Building2,
      area: "200 m²",
      time: "12 timmar",
      team: "5 flyttare",
      firm: "Business Move AB",
      description: "Ett snabbväxande tech-företag behövde flytta på kort varsel. Via Flyttbas fick de 3 offerter från specialiserade kontorsfirmor.",
      result: "Flytten genomfördes över en helg med noll driftstörningar. IT-utrustning hanterades med extra försiktighet.",
      quote: "Vi fick snabbt kontakt med firmor som verkligen förstod våra behov. Imponerande!"
    },
    {
      title: "Seniorboende – trygg flytt",
      type: "Privatflytt",
      icon: Home,
      area: "65 m²",
      time: "5 timmar",
      team: "2 flyttare",
      firm: "Omsorgsfullt Flytt",
      description: "En senior skulle flytta till mindre boende. Via Flyttbas hittade hon en firma med extra bra omdömen för försiktig hantering.",
      result: "Firman tog extra tid att placera möblerna precis rätt. Allt hanterades varsamt och med respekt.",
      quote: "Jag läste omdömena och valde en firma som verkade omtänksam. Det stämde perfekt!"
    },
    {
      title: "Expressflytt löst på 24h",
      type: "Privatflytt",
      icon: Clock,
      area: "55 m²",
      time: "4 timmar",
      team: "3 flyttare",
      firm: "Snabbflytt Stockholm",
      description: "En kund behövde flytta akut inom 48 timmar. Via Flyttbas fick han 5 offerter samma dag, varav 3 kunde genomföra flytten nästa dag.",
      result: "Allt packades och flyttades säkert. Kunden sparade timmar av letande efter lediga firmor.",
      quote: "Hade aldrig hunnit ringa runt till alla firmor själv. Flyttbas räddade min situation!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Kundcase – Så Hittade De Rätt Flyttfirma | Flyttbas</title>
        <meta name="description" content="Läs hur våra kunder hittat rätt flyttfirma via Flyttbas. Verkliga exempel på hur jämförelse sparar tid och pengar." />
        <link rel="canonical" href="https://flyttbas.se/case" />
        <meta property="og:title" content="Kundcase – Så hittade de rätt flyttfirma" />
        <meta property="og:description" content="Läs verkliga kundberättelser om att hitta rätt flyttfirma via Flyttbas." />
        <meta property="og:url" content="https://flyttbas.se/case" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Så hittade de rätt flyttfirma
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Läs hur våra kunder använt Flyttbas för att jämföra offerter och hitta perfekta partnern för sin flytt.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-orange mb-2">12 000+</div>
                <div className="text-sm text-muted-foreground">Genomförda flyttar</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Nöjda kunder</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Verifierade partners</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">4.8</div>
                <div className="text-sm text-muted-foreground">Snittbetyg</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cases Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-12 max-w-4xl mx-auto">
              {cases.map((caseItem, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-orange/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <caseItem.icon className="h-6 w-6 text-orange" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-navy">{caseItem.title}</h3>
                        <span className="px-3 py-1 bg-orange/10 text-orange text-sm font-medium rounded-full">
                          {caseItem.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>{caseItem.area}</span>
                        <span>•</span>
                        <span>{caseItem.time}</span>
                        <span>•</span>
                        <span>{caseItem.team}</span>
                        <span>•</span>
                        <span className="text-orange">{caseItem.firm}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-navy">Situationen</h4>
                      <p className="text-muted-foreground">{caseItem.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 text-navy">Resultatet</h4>
                      <p className="text-muted-foreground">{caseItem.result}</p>
                    </div>
                    
                    <div className="bg-light-bg p-4 rounded-lg border-l-4 border-orange">
                      <p className="italic text-foreground">"{caseItem.quote}"</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Redo att hitta din flyttfirma?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Jämför offerter från verifierade partners – helt gratis och utan förpliktelser.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Jämför offerter nu</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Case;
