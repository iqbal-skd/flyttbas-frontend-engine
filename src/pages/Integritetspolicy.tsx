import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Integritetspolicy = () => {
  return (
    <>
      <Helmet>
        <title>Integritetspolicy | Flyttbas</title>
        <meta name="description" content="Läs om hur Flyttbas behandlar dina personuppgifter i enlighet med GDPR och dataskyddslagstiftning." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <article className="prose prose-lg max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Integritetspolicy – Flyttbas
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Version:</strong> 2025-12-25
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">1. Personuppgiftsansvarig</h2>
            <div className="text-foreground/90 space-y-1 mb-6">
              <p><strong>Flyttbas AB</strong></p>
              <p>Org.nr: <strong>[FYLL I ORG.NR]</strong></p>
              <p>Adress: <strong>Industrivägen 10, 135 40 Tyresö</strong></p>
              <p>E-post: <strong>info@flyttbas.se</strong></p>
              <p>Telefon: <strong>08-770 10 01</strong></p>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">2. Vilka personuppgifter vi behandlar</h2>
            <p className="text-foreground/90 mb-2">Vi kan behandla följande uppgifter beroende på hur du använder tjänsten:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Kontaktuppgifter:</strong> namn, e-post, telefonnummer, adress/postnummer/ort</li>
              <li><strong>Uppdragsuppgifter:</strong> information om efterfrågad tjänst, beskrivning av uppdrag, datum, meddelanden</li>
              <li><strong>Bilder/underlag</strong> som du laddar upp (om relevant)</li>
              <li><strong>Konto- och inloggningsuppgifter</strong> (om konto finns)</li>
              <li><strong>Tekniska uppgifter:</strong> IP-adress, enhetsinformation, cookie-ID och användningsdata (se <Link to="/cookiepolicy" className="text-accent hover:underline">Cookiepolicy</Link>)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">3. Varför vi behandlar personuppgifter (ändamål och laglig grund)</h2>
            <p className="text-foreground/90 mb-4">Vi behandlar personuppgifter för följande ändamål:</p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">A) Lämna en uppdragsförfrågan / matchning med utförare</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> information om tjänst/uppdrag, beskrivning, namn, e-post, telefonnummer, postnummer, ev. bilder.</li>
              <li><strong>Ändamål:</strong> hantera din förfrågan och dela relevanta uppgifter med matchade utförare så att de kan svara.</li>
              <li><strong>Laglig grund:</strong> avtal (nödvändigt för att tillhandahålla tjänsten).</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">B) Bokning (om bokningsflöde finns)</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> bokad tjänst, namn, e-post, telefon, adress/postnummer.</li>
              <li><strong>Ändamål:</strong> administrera bokningen och kommunikation kopplad till den.</li>
              <li><strong>Laglig grund:</strong> avtal.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">C) Kundtjänst och ärendehantering</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> namn, kontaktuppgifter, innehåll i ärende, meddelanden/chatt, kontouppgifter.</li>
              <li><strong>Ändamål:</strong> hantera frågor, tvister och support.</li>
              <li><strong>Laglig grund:</strong> berättigat intresse av att ge kundservice och hantera ärenden.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">D) Företagskund-konto (utförare) och administration</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> företagsnamn, organisationsnummer (eller personnummer för enskild firma), kontaktuppgifter, postnummer/ort, svarade förfrågningar, omdömen, certifikat (om uppladdat).</li>
              <li><strong>Ändamål:</strong> skapa och administrera konto, möjliggöra matchning och kommunikation.</li>
              <li><strong>Laglig grund:</strong> avtal och/eller berättigat intresse.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">E) Marknadsföring (nyhetsbrev, kampanjer m.m.)</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> namn, e-post, samt ev. segmentdata (t.ex. kategori/region för senaste förfrågan).</li>
              <li><strong>Ändamål:</strong> skicka relevant information och erbjudanden.</li>
              <li><strong>Laglig grund:</strong> berättigat intresse eller samtycke (beroende på kanal och kontext). Du kan alltid invända/avregistrera dig.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">F) Webbplatsanalys och marknadsföringsmätning (cookies/pixlar)</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90 mb-4">
              <li><strong>Uppgifter:</strong> tekniska uppgifter (t.ex. IP, cookie-ID, sidvisningar, händelser).</li>
              <li><strong>Ändamål:</strong> statistik, förbättring av webbplatsen, mätning och marknadsföring (t.ex. Google Analytics, Meta Pixel).</li>
              <li><strong>Laglig grund:</strong> samtycke via Cookiebot för icke-nödvändiga cookies/tekniker.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">4. Mottagare – vilka vi delar uppgifter med</h2>
            <p className="text-foreground/90 mb-2">Vi kan dela personuppgifter med:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Utförare/företagskunder</strong> (för att de ska kunna svara på din förfrågan).</li>
              <li><strong>Leverantörer (personuppgiftsbiträden)</strong> som hjälper oss att driva tjänsten, t.ex.:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>HubSpot</strong> (CRM, kundkommunikation och marknadsföring)</li>
                  <li><strong>Google</strong> (Google Analytics – statistik, efter samtycke)</li>
                  <li><strong>Meta</strong> (Meta Pixel – marknadsföring/mätning, efter samtycke)</li>
                  <li><strong>Cookiebot</strong> (samtyckeshantering)</li>
                  <li>Webbhotell/IT-drift/backup och e-postleverantörer</li>
                </ul>
              </li>
            </ul>
            <p className="text-foreground/90 mt-4">Vi kan även lämna ut uppgifter om det krävs enligt lag eller myndighetsbeslut.</p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">5. Överföring till tredje land (utanför EU/EES)</h2>
            <p className="text-foreground/90">
              Vissa leverantörer (t.ex. HubSpot, Google och Meta) kan behandla uppgifter utanför EU/EES. I sådana fall säkerställer vi att överföring sker med lämpliga skyddsåtgärder, t.ex. EU-kommissionens standardavtalsklausuler (SCC) och/eller andra tillåtna mekanismer.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">6. Lagringstid</h2>
            <p className="text-foreground/90 mb-2">Vi sparar personuppgifter så länge det behövs för ändamålet:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li><strong>Förfrågningar och ärenden:</strong> så länge de behövs för hantering och uppföljning, och därefter en begränsad tid för att hantera tvist/krav.</li>
              <li><strong>Kontouppgifter:</strong> så länge kontot är aktivt och en tid därefter.</li>
              <li><strong>Marknadsföring:</strong> tills du avregistrerar dig eller invänder.</li>
              <li><strong>Uppgifter som krävs för bokföring/avtal:</strong> så länge som krävs enligt lag.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">7. Dina rättigheter</h2>
            <p className="text-foreground/90 mb-2">Du har rätt att:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/90">
              <li>begära tillgång till dina personuppgifter,</li>
              <li>få felaktiga uppgifter rättade,</li>
              <li>begära radering (i vissa fall),</li>
              <li>begära begränsning eller invända mot behandling (t.ex. direktmarknadsföring),</li>
              <li>få ut uppgifter (dataportabilitet) när det är tillämpligt,</li>
              <li>återkalla samtycke (t.ex. för cookies) när som helst.</li>
            </ul>
            <p className="text-foreground/90 mt-4">Kontakta oss på <strong>info@flyttbas.se</strong></p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">8. Klagomål</h2>
            <p className="text-foreground/90">
              Om du anser att vi hanterar personuppgifter felaktigt kan du kontakta oss. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-10 mb-4">9. Cookies och liknande tekniker</h2>
            <p className="text-foreground/90">
              Vi använder cookies och liknande tekniker. Läs mer i vår <Link to="/cookiepolicy" className="text-accent hover:underline font-medium">Cookiepolicy</Link>.
            </p>
          </article>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Integritetspolicy;
