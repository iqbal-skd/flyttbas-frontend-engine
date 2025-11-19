import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Building2, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Case = () => {
  const cases = [
    {
      title: "Familjeflytt i Södermalm",
      type: "Privatflytt",
      icon: Home,
      area: "85 m²",
      time: "6 timmar",
      team: "3 flyttare",
      description: "En familj på fyra personer skulle flytta från en 3:a i Södermalm till ett radhus i Nacka. Vi hanterade allt från packning till uppackning.",
      result: "Flytten genomfördes smidigt på en dag. 0 skador. Familjen kunde börja packa upp samma kväll.",
      quote: "Fantastiskt professionella! De hanterade våra saker som sina egna."
    },
    {
      title: "Kontorsflytt Tech-startup",
      type: "Kontorsflytt",
      icon: Building2,
      area: "200 m²",
      time: "12 timmar",
      team: "5 flyttare",
      description: "Ett snabbväxande tech-företag behövde flytta från Kungsholmen till större lokaler i Hammarby Sjöstad. Kritiskt att minimera stilleståndstid.",
      result: "Flytten genomfördes över en helg. IT-utrustning och servrar hanterades med extra försiktighet. Kontoret var fullt operativt på måndagsmorgonen.",
      quote: "De fixade allt över helgen så att vi kunde arbeta som vanligt på måndag. Imponerande!"
    },
    {
      title: "Seniorboende flytt",
      type: "Privatflytt",
      icon: Home,
      area: "65 m²",
      time: "5 timmar",
      team: "2 flyttare",
      description: "En senior skulle flytta från villa till lägenhet och behövde extra omtänksam hantering av möbler och minnessaker.",
      result: "Vi tog extra tid att placera möblerna precis där de skulle stå. Allt hanterades varsamt och med respekt.",
      quote: "Så omtänksamma och hjälpsamma. Jag kände mig trygg genom hela processen."
    },
    {
      title: "Expressflytt i centrala Stockholm",
      type: "Privatflytt",
      icon: Clock,
      area: "55 m²",
      time: "4 timmar",
      team: "3 flyttare",
      description: "En kund fick ett snabbt jobberbjudande i en annan stad och behövde flytta inom 48 timmar.",
      result: "Vi mobiliserade teamet och genomförde flytten dagen efter kontakt. Allt packades och flyttades säkert till Göteborg.",
      quote: "Jag visste inte att en flytt kunde gå så fort. De räddade min situation!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Våra genomförda flyttar
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Läs om hur vi har hjälpt våra kunder med smidiga och trygga flyttar.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-orange mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Genomförda flyttar</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">99%</div>
                <div className="text-sm text-muted-foreground">Nöjda kunder</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">0</div>
                <div className="text-sm text-muted-foreground">Skador senaste året</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange mb-2">5.0</div>
                <div className="text-sm text-muted-foreground">Genomsnittligt betyg</div>
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
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-navy">Utmaningen</h4>
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
            <h2 className="text-3xl font-bold mb-4">Vill du bli vårt nästa case?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Låt oss göra din flytt lika smidig och lyckad som dessa.
            </p>
            <Button size="lg" asChild className="bg-orange hover:bg-orange/90">
              <Link to="/kontakt">Få offert</Link>
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
