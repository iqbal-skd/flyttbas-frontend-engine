import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

const Kontakt = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Tack för din förfrågan!",
      description: "Vi skickar din förfrågan till verifierade flyttfirmor.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-post",
      content: "info@flyttbas.se",
      link: "mailto:info@flyttbas.se"
    },
    {
      icon: MapPin,
      title: "Adress",
      content: "Industrivägen 10, 135 40 Tyresö",
      link: null
    },
    {
      icon: Clock,
      title: "Öppettider",
      content: "Mån-Fre 08-18",
      link: null
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Jämför Flyttofferter – Få Offerter från Verifierade Firmor | Flyttbas</title>
        <meta name="description" content="Få offerter från verifierade flyttfirmor i Stockholm. Fyll i formuläret och jämför priser. Gratis och utan förpliktelser." />
        <link rel="canonical" href="https://flyttbas.se/kontakt" />
        <meta property="og:title" content="Jämför Flyttofferter – Få offerter från verifierade firmor" />
        <meta property="og:description" content="Jämför offerter från verifierade flyttfirmor. Gratis och utan förpliktelser." />
        <meta property="og:url" content="https://flyttbas.se/kontakt" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy via-navy to-gray-blue text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Jämför offerter från flyttfirmor
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Fyll i formuläret och få offerter från verifierade partners. Helt gratis!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="bg-orange/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-orange" />
                  </div>
                  <h3 className="font-bold mb-2 text-navy">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      className="text-sm text-muted-foreground hover:text-orange whitespace-pre-line"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{info.content}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-navy">Beskriv din flytt</h2>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Namn *</Label>
                      <Input id="name" required placeholder="Ditt namn" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input id="phone" type="tel" required placeholder="+46 70 123 45 67" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-post *</Label>
                    <Input id="email" type="email" required placeholder="din@email.se" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="from">Från adress *</Label>
                      <Input id="from" required placeholder="Nuvarande adress" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">Till adress *</Label>
                      <Input id="to" required placeholder="Ny adress" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="area">Boendestorlek (m²)</Label>
                      <Input id="area" type="number" placeholder="85" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Önskat datum</Label>
                      <Input id="date" type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Berätta mer om din flytt. T.ex. antal rum, våning, hiss, specialönskemål..."
                      rows={5}
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      id="gdpr" 
                      required 
                      className="mt-1"
                    />
                    <Label htmlFor="gdpr" className="text-sm text-muted-foreground font-normal">
                      Jag godkänner att Flyttbas delar mina uppgifter med verifierade flyttfirmor enligt GDPR *
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Skickar..." : "Få offerter från flyttfirmor"}
                  </Button>

                  <p className="text-sm text-center text-muted-foreground">
                    Du får vanligtvis 3-5 offerter från verifierade flyttfirmor
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-light-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-navy">Hur det fungerar</h2>
              <p className="text-muted-foreground">
                När du skickar in din förfrågan matchar vi dig med våra verifierade partners. 
                De skickar sina bästa offerter direkt till dig. Du väljer sedan den firma som passar dig bäst – 
                helt utan förpliktelser.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default Kontakt;
