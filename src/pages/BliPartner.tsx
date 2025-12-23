import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Building2, 
  FileCheck, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Star
} from "lucide-react";
import { z } from "zod";

const partnerSchema = z.object({
  company_name: z.string().min(2, "Företagsnamn krävs"),
  org_number: z.string().regex(/^\d{6}-?\d{4}$/, "Ange giltigt organisationsnummer (XXXXXX-XXXX)"),
  contact_name: z.string().min(2, "Kontaktperson krävs"),
  contact_email: z.string().email("Ange giltig e-postadress"),
  contact_phone: z.string().min(8, "Ange giltigt telefonnummer"),
  traffic_license_number: z.string().optional(),
  f_tax_certificate: z.boolean(),
  insurance_company: z.string().optional(),
  gdpr_consent: z.boolean().refine(val => val === true, "Du måste godkänna villkoren"),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const BliPartner = () => {
  const { user, loading: authLoading, signInWithMagicLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'info' | 'auth' | 'form' | 'success' | 'already_partner'>('info');
  const [email, setEmail] = useState("");
  const [authSent, setAuthSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingPartner, setCheckingPartner] = useState(false);
  
  const [formData, setFormData] = useState<PartnerFormData>({
    company_name: "",
    org_number: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    traffic_license_number: "",
    f_tax_certificate: false,
    insurance_company: "",
    gdpr_consent: false,
  });

  // Check if user is already a partner
  useEffect(() => {
    const checkExistingPartner = async () => {
      if (!user) return;
      
      setCheckingPartner(true);
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingPartner) {
        if (existingPartner.status === 'approved') {
          // Redirect to partner dashboard
          navigate('/partner');
        } else {
          setStep('already_partner');
        }
      } else if (step === 'auth') {
        setStep('form');
        setFormData(prev => ({
          ...prev,
          contact_email: user.email || "",
        }));
      }
      setCheckingPartner(false);
    };
    
    checkExistingPartner();
  }, [user, step, navigate]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await signInWithMagicLink(email);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte skicka inloggningslänk. Försök igen.",
      });
    } else {
      setAuthSent(true);
      toast({
        title: "Länk skickad!",
        description: "Kolla din inkorg för inloggningslänken.",
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = partnerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Du måste vara inloggad för att registrera dig.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('partners').insert({
        user_id: user.id,
        company_name: formData.company_name,
        org_number: formData.org_number,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        traffic_license_number: formData.traffic_license_number || null,
        f_tax_certificate: formData.f_tax_certificate,
        insurance_company: formData.insurance_company || null,
        status: 'pending',
      });

      if (error) throw error;

      // Add partner role
      await supabase.from('user_roles').insert({
        user_id: user.id,
        role: 'partner',
      });

      setStep('success');
      toast({
        title: "Ansökan skickad!",
        description: "Vi granskar din ansökan och återkommer inom 1-2 arbetsdagar.",
      });
    } catch (error: any) {
      console.error('Partner registration error:', error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Något gick fel. Försök igen.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Fler kunder",
      description: "Få tillgång till kvalificerade flyttförfrågningar i ditt område",
    },
    {
      icon: TrendingUp,
      title: "Öka omsättningen",
      description: "Fyll luckor i schemat med matchade jobb",
    },
    {
      icon: Star,
      title: "Bygg rykte",
      description: "Samla omdömen och bygg ditt varumärke",
    },
    {
      icon: Shield,
      title: "Trygg plattform",
      description: "Vi hanterar betalningar och kundservice",
    },
  ];

  if (authLoading || checkingPartner) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Bli Partner | Flyttbas - Sveriges Flyttmarknadsplats</title>
        <meta name="description" content="Anslut ditt flyttföretag till Flyttbas och få fler kunder. Vi matchar dig med flyttjobb i ditt område." />
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Väx ditt flyttföretag med Flyttbas
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Anslut dig till Sveriges ledande marknadsplats för flyttjänster. 
                Vi matchar dig med kvalificerade kunder i ditt område – du betalar endast vid genomfört jobb.
              </p>
              
              {step === 'info' && (
                <Button size="lg" onClick={() => user ? setStep('form') : setStep('auth')}>
                  Ansök om partnerskap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Benefits */}
        {step === 'info' && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-center mb-12">Fördelar med Flyttbas</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                    <benefit.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Så fungerar det</h3>
                <div className="flex flex-col sm:flex-row justify-center gap-8 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                    <span>Registrera dig</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                    <span>Vi granskar & godkänner</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                    <span>Börja ge offerter</span>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-accent/10 rounded-lg max-w-xl mx-auto">
                  <p className="text-sm text-muted-foreground mb-2">Avgift</p>
                  <p className="text-2xl font-bold">7% av ordervärdet före RUT</p>
                  <p className="text-sm text-muted-foreground mt-2">Endast vid genomfört jobb. Ingen startavgift eller månadsavgift.</p>
                </div>

                <Button size="lg" className="mt-8" onClick={() => user ? setStep('form') : setStep('auth')}>
                  Kom igång nu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Auth Step */}
        {step === 'auth' && !authSent && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle>Skapa konto</CardTitle>
                  <CardDescription>
                    Ange din e-post så skickar vi en inloggningslänk
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="email">E-postadress</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="foretag@email.se"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Skicka inloggningslänk
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {step === 'auth' && authSent && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-md">
              <Card>
                <CardHeader className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <CardTitle>Kolla din e-post</CardTitle>
                  <CardDescription>
                    Vi har skickat en inloggningslänk till {email}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        )}

        {/* Registration Form */}
        {step === 'form' && user && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <CardTitle>Företagsuppgifter</CardTitle>
                  </div>
                  <CardDescription>
                    Fyll i uppgifter om ditt flyttföretag
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company_name">Företagsnamn *</Label>
                        <Input
                          id="company_name"
                          value={formData.company_name}
                          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                          className={errors.company_name ? "border-destructive" : ""}
                        />
                        {errors.company_name && <p className="text-xs text-destructive mt-1">{errors.company_name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="org_number">Organisationsnummer *</Label>
                        <Input
                          id="org_number"
                          placeholder="XXXXXX-XXXX"
                          value={formData.org_number}
                          onChange={(e) => setFormData({ ...formData, org_number: e.target.value })}
                          className={errors.org_number ? "border-destructive" : ""}
                        />
                        {errors.org_number && <p className="text-xs text-destructive mt-1">{errors.org_number}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact_name">Kontaktperson *</Label>
                        <Input
                          id="contact_name"
                          value={formData.contact_name}
                          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                          className={errors.contact_name ? "border-destructive" : ""}
                        />
                        {errors.contact_name && <p className="text-xs text-destructive mt-1">{errors.contact_name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Telefon *</Label>
                        <Input
                          id="contact_phone"
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                          className={errors.contact_phone ? "border-destructive" : ""}
                        />
                        {errors.contact_phone && <p className="text-xs text-destructive mt-1">{errors.contact_phone}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact_email">E-postadress *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        className={errors.contact_email ? "border-destructive" : ""}
                      />
                      {errors.contact_email && <p className="text-xs text-destructive mt-1">{errors.contact_email}</p>}
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileCheck className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Licenser & Försäkringar</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        För att bli godkänd partner krävs giltigt trafiktillstånd, F-skattesedel och ansvarsförsäkring.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="traffic_license">Trafiktillståndsnummer</Label>
                          <Input
                            id="traffic_license"
                            value={formData.traffic_license_number}
                            onChange={(e) => setFormData({ ...formData, traffic_license_number: e.target.value })}
                            placeholder="Kan lämnas senare"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="f_tax"
                            checked={formData.f_tax_certificate}
                            onCheckedChange={(checked) => setFormData({ ...formData, f_tax_certificate: checked as boolean })}
                          />
                          <Label htmlFor="f_tax" className="font-normal cursor-pointer">
                            Mitt företag har F-skattesedel
                          </Label>
                        </div>

                        <div>
                          <Label htmlFor="insurance">Försäkringsbolag</Label>
                          <Input
                            id="insurance"
                            value={formData.insurance_company}
                            onChange={(e) => setFormData({ ...formData, insurance_company: e.target.value })}
                            placeholder="T.ex. If, Trygg-Hansa"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="gdpr"
                          checked={formData.gdpr_consent}
                          onCheckedChange={(checked) => setFormData({ ...formData, gdpr_consent: checked as boolean })}
                          className={errors.gdpr_consent ? "border-destructive" : ""}
                        />
                        <Label htmlFor="gdpr" className="font-normal cursor-pointer text-sm">
                          Jag godkänner Flyttbas partnervillkor och att mina uppgifter behandlas enligt GDPR. 
                          Jag förstår att en provision på 7% av ordervärdet före RUT debiteras vid genomförda jobb. *
                        </Label>
                      </div>
                      {errors.gdpr_consent && <p className="text-xs text-destructive mt-1">{errors.gdpr_consent}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Skickar..." : "Skicka ansökan"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Already Partner */}
        {step === 'already_partner' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-md text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Du har redan en ansökan</h2>
              <p className="text-muted-foreground mb-8">
                Din ansökan är under granskning. Vi återkommer inom 1-2 arbetsdagar via e-post.
              </p>
              <Button onClick={() => navigate("/")}>
                Tillbaka till startsidan
              </Button>
            </div>
          </section>
        )}

        {/* Success */}
        {step === 'success' && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-md text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Tack för din ansökan!</h2>
              <p className="text-muted-foreground mb-8">
                Vi granskar din ansökan och återkommer inom 1-2 arbetsdagar via e-post.
              </p>
              <Button onClick={() => navigate("/")}>
                Tillbaka till startsidan
              </Button>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default BliPartner;
