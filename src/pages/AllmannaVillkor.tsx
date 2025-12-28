import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const AllmannaVillkor = () => {
  return (
    <>
      <Helmet>
        <title>Allmänna villkor | Flyttbas</title>
        <meta name="description" content="Läs Flyttbas allmänna villkor för användning av vår jämförelsetjänst för flytt och flyttstäd." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <article className="prose prose-lg max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Allmänna villkor – Flyttbas
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Version:</strong> 2025-12-25
            </p>
            
            <p className="text-foreground/90">
              Dessa allmänna villkor ("Villkoren") gäller mellan <strong>Flyttbas AB</strong> ("Flyttbas", "vi", "oss") och dig som använder Flyttbas plattform/tjänst ("Tjänsten"), oavsett om du är (i) privatkund/beställare ("Kund/Användare") eller (ii) ett företag som erbjuder tjänster via Tjänsten ("Företagskund/Utförare"). Genom att använda Tjänsten godkänner du Villkoren.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">1. Parter och definitioner</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li><strong>Flyttbas:</strong> Flyttbas AB, org.nr. <strong>[FYLL I ORG.NR]</strong>.</li>
              <li><strong>Beställare/Användare:</strong> Den som skickar en förfrågan, kommunicerar med Utförare eller på annat sätt använder Tjänsten.</li>
              <li><strong>Företagskund/Utförare:</strong> Företag som kan ta emot och svara på förfrågningar och/eller ingå avtal om Uppdrag med Beställare via Tjänsten.</li>
              <li><strong>Uppdrag:</strong> Den tjänst (t.ex. flytt/transport) som Beställaren efterfrågar och som en Utförare kan åta sig.</li>
              <li><strong>Avtal om Uppdrag:</strong> Avtal mellan Beställaren och Utföraren avseende Uppdraget.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">2. Tjänsten</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Flyttbas tillhandahåller en digital plattform som bland annat kan möjliggöra förfrågningar, matchning, kommunikation och omdömen.</li>
              <li>Flyttbas kan komma att ändra och uppdatera Tjänsten från tid till annan.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">3. Flyttbas roll – förmedling</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Flyttbas är en <strong>förmedlingstjänst</strong> som syftar till att sammanföra Beställare och Utförare.</li>
              <li>Flyttbas är <strong>inte part</strong> i Avtalet om Uppdrag mellan Beställaren och Utföraren, om inte annat uttryckligen anges i det enskilda fallet.</li>
              <li>Utföraren ansvarar för Uppdraget och för att Uppdraget utförs i enlighet med Avtalet om Uppdrag och tillämplig lag.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">4. Konto, behörighet och säkerhet</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Vissa funktioner kan kräva ett konto. Du ansvarar för att de uppgifter du lämnar är korrekta och uppdaterade.</li>
              <li>Du ansvarar för att skydda dina inloggningsuppgifter och för aktivitet som sker via ditt konto.</li>
              <li>Flyttbas kan spärra eller avsluta ett konto vid misstanke om missbruk, bedrägeri, olaglig aktivitet eller väsentligt brott mot Villkoren.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">5. Förfrågningar, offerter och kommunikation</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>När Beställaren skickar en förfrågan kan relevant information delas med matchade Utförare för att de ska kunna svara/lämna offert.</li>
              <li>Flyttbas garanterar inte att Beställaren får svar/offert eller att Utföraren får ett uppdrag.</li>
              <li>Kommunikation kan ske via Tjänsten och/eller utanför Tjänsten (t.ex. telefon/e-post). Flyttbas ansvarar inte för parternas kommunikation eller överenskommelser.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">6. Avtal om Uppdrag (mellan Beställare och Utförare)</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Ett Avtal om Uppdrag uppstår först när Beställaren och Utföraren har kommit överens om villkoren för Uppdraget.</li>
              <li>Flyttbas ansvarar inte för ingående, tolkning, fullgörelse av Avtalet om Uppdrag eller för parternas agerande i samband med Uppdraget.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">7. Beställarens ansvar</h2>
            <p className="text-foreground/90 mb-2">Beställaren ansvarar för att:</p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>lämna korrekta och fullständiga uppgifter om Uppdraget (omfattning, datum, adresser, tillgänglighet, särskilda risker m.m.),</li>
              <li>vara tillgänglig för kontakt och ge rimliga förutsättningar för Utföraren att utföra Uppdraget,</li>
              <li>personligen bedöma och kontrollera offerten, villkoren och vald Utförare innan Avtal om Uppdrag ingås.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">8. Utförarens ansvar (Företagskund)</h2>
            <p className="text-foreground/90 mb-2">Utföraren ansvarar för att:</p>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>lämna korrekta uppgifter om pris, villkor och eventuella tilläggsavgifter,</li>
              <li>inneha erforderliga tillstånd, behörigheter och försäkringar,</li>
              <li>följa tillämplig lagstiftning och branschkrav,</li>
              <li>utföra Uppdraget fackmannamässigt och i enlighet med Avtalet om Uppdrag.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">9. Betalning, abonnemang och fakturering</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Om Flyttbas tar betalt av Företagskunder (t.ex. abonnemang/leadavgifter) regleras detta genom separat avtal, prislista och/eller faktura.</li>
              <li>Betalningsvillkor och eventuella påminnelse- eller inkassokostnader framgår av avtalet och/eller fakturan.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">10. Omdömen och användargenererat innehåll</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Omdömen ska vara sakliga, relevanta och grundade på faktisk erfarenhet.</li>
              <li>Det är förbjudet att publicera innehåll som är olagligt, kränkande, vilseledande, integritetskränkande eller gör intrång i andras rättigheter.</li>
              <li>Flyttbas kan ta bort, dölja eller begränsa innehåll som strider mot Villkoren eller lag.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">11. Rapportering av olagligt innehåll och missbruk</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Rapportera misstänkt olagligt innehåll eller missbruk genom att kontakta <strong>info@flyttbas.se</strong> och ange ämnesraden: <strong>"Anmälan olagligt innehåll"</strong>.</li>
              <li>Ange vad anmälan gäller och var i Tjänsten innehållet finns (t.ex. länk, skärmbild, användarnamn).</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">12. Personuppgifter</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Flyttbas behandlar personuppgifter i enlighet med tillämplig dataskyddslagstiftning och i enlighet med Flyttbas <strong>Integritetspolicy</strong>.</li>
              <li>För information om vilka uppgifter som behandlas, ändamål, rättslig grund, lagringstid och dina rättigheter, se Integritetspolicyn.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">13. Ansvar och ansvarsfriskrivning</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Flyttbas är endast en förmedlingstjänst och inte part i Avtalet om Uppdrag. Flyttbas ansvarar därför inte för skador, förluster, fel, förseningar, brister i utförande, kostnader eller andra anspråk som uppstår i samband med eller till följd av Uppdraget. Eventuella anspråk ska riktas mot den Utförare som åtog sig eller utförde Uppdraget.</li>
              <li>Flyttbas ansvarar inte för uppgifter, innehåll eller agerande från användare eller Utförare, utöver vad som följer av tvingande lag.</li>
              <li>Inget i Villkoren begränsar ansvar i den utsträckning sådan begränsning inte är tillåten enligt tvingande lag.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">14. Avstängning och avslutande</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Flyttbas kan stänga av eller avsluta konton som bryter mot Villkoren, missbrukar Tjänsten eller där det finns misstanke om bedrägeri/olaglig aktivitet.</li>
              <li>Du kan avsluta ditt konto genom att kontakta <strong>info@flyttbas.se</strong> eller via kontoinställningar (om tillgängligt). Viss information kan behöva sparas på grund av lag eller berättigat intresse (t.ex. tvister eller bokföring).</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">15. Ändringar av Villkoren</h2>
            <p className="text-foreground/90">
              Flyttbas kan komma att uppdatera Villkoren. Den senaste versionen publiceras på Tjänsten. Fortsatt användning efter att uppdaterade villkor trätt i kraft innebär att du godkänner dem.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">16. Tillämplig lag och tvister</h2>
            <ol className="list-decimal pl-6 space-y-2 text-foreground/90">
              <li>Villkoren ska tolkas i enlighet med svensk lag.</li>
              <li>Tvister ska i första hand lösas genom dialog med Flyttbas.</li>
              <li>Om en tvist kvarstår avgörs den av svensk allmän domstol, om inte tvingande regler anger annat.</li>
            </ol>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">17. Kontakt</h2>
            <div className="text-foreground/90 space-y-1">
              <p><strong>Flyttbas AB</strong></p>
              <p>Org.nr.: <strong>[FYLL I ORG.NR]</strong></p>
              <p>Adress: <strong>Industrivägen 10, 135 40 Tyresö</strong></p>
              <p>E-post: <strong>info@flyttbas.se</strong></p>
              <p>Telefon: <strong>08-770 10 01</strong></p>
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AllmannaVillkor;
