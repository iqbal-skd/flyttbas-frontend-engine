import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { 
  Building2, 
  FileCheck, 
  CheckCircle,
  Loader2,
  MapPin
} from "lucide-react";
import { z } from "zod";

const partnerSchema = z.object({
  company_name: z.string().min(2, "Företagsnamn krävs"),
  org_number: z.string().regex(/^\d{6}-?\d{4}$/, "Ange giltigt organisationsnummer (XXXXXX-XXXX)"),
  contact_name: z.string().min(2, "Kontaktperson krävs"),
  contact_email: z.string().email("Ange giltig e-postadress"),
  contact_phone: z.string().min(8, "Ange giltigt telefonnummer"),
  address: z.string().min(5, "Ange företagets adress"),
  traffic_license_number: z.string().optional(),
  f_tax_certificate: z.boolean(),
  insurance_company: z.string().optional(),
  gdpr_consent: z.boolean().refine(val => val === true, "Du måste godkänna villkoren"),
});

type PartnerFormData = z.infer<typeof partnerSchema> & {
  address_lat?: number;
  address_lng?: number;
};

const BliPartner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'form' | 'success' | 'already_partner'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingPartner, setCheckingPartner] = useState(true);
  
  const [formData, setFormData] = useState<PartnerFormData>({
    company_name: "",
    org_number: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    address_lat: undefined,
    address_lng: undefined,
    traffic_license_number: "",
    f_tax_certificate: false,
    insurance_company: "",
    gdpr_consent: false,
  });

  // Check if user is already a partner (only if logged in)
  useEffect(() => {
    const checkExistingPartner = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCheckingPartner(false);
        return;
      }
      
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingPartner) {
        if (existingPartner.status === 'approved') {
          navigate('/partner');
        } else {
          setStep('already_partner');
        }
      } else {
        // Pre-fill email if user is logged in
        setFormData(prev => ({
          ...prev,
          contact_email: user.email || "",
        }));
      }
      setCheckingPartner(false);
    };
    
    checkExistingPartner();
  }, [navigate]);

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

    setSubmitting(true);

    try {
      // First, check if a user exists with this email or create a placeholder
      let userId: string;
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        userId = currentUser.id;
      } else {
        // Sign up the user with magic link - this creates the user account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.contact_email,
          password: crypto.randomUUID(), // Random password, they'll use magic link
          options: {
            emailRedirectTo: `${window.location.origin}/partner`,
            data: {
              full_name: formData.contact_name,
            }
          }
        });
        
        if (signUpError) {
          // User might already exist
          if (signUpError.message.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "E-post redan registrerad",
              description: "Denna e-postadress är redan registrerad. Logga in först eller använd en annan e-post.",
            });
            setSubmitting(false);
            return;
          }
          throw signUpError;
        }
        
        if (!signUpData.user) {
          throw new Error("Kunde inte skapa användarkonto");
        }
        
        userId = signUpData.user.id;
      }

      // Insert partner application
      const { error: partnerError } = await supabase.from('partners').insert({
        user_id: userId,
        company_name: formData.company_name,
        org_number: formData.org_number,
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        address: formData.address,
        address_lat: formData.address_lat || null,
        address_lng: formData.address_lng || null,
        traffic_license_number: formData.traffic_license_number || null,
        f_tax_certificate: formData.f_tax_certificate,
        insurance_company: formData.insurance_company || null,
        status: 'pending',
      });

      if (partnerError) throw partnerError;

      // Add partner role
      await supabase.from('user_roles').insert({
        user_id: userId,
        role: 'partner',
      });

      // Send confirmation email with magic link
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            type: 'partner_application',
            email: formData.contact_email,
            name: formData.contact_name,
            companyName: formData.company_name,
          }
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the whole process if email fails
      }

      setStep('success');
      toast({
        title: "Ansökan skickad!",
        description: "Vi har skickat ett bekräftelsemail med en länk för att skapa ditt konto.",
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

  if (checkingPartner) {
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
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Bli partner hos Flyttbas
              </h1>
              <p className="text-muted-foreground mb-4">
                Fyll i formuläret nedan så granskar vi din ansökan inom 1-2 arbetsdagar.
              </p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        {step === 'form' && (
          <section className="py-8 sm:py-12">
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
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Företagets adress</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ange adressen där ert företag är baserat. Detta används för att matcha er med jobb i närheten.
                      </p>
                      <div>
                        <Label htmlFor="address">Adress *</Label>
                        <AddressAutocomplete
                          id="address"
                          value={formData.address}
                          onChange={(address, _postalCode, location) => {
                            setFormData({ 
                              ...formData, 
                              address,
                              address_lat: location?.lat,
                              address_lng: location?.lng,
                            });
                          }}
                          placeholder="Sök företagets adress..."
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                      </div>
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
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Skickar...
                        </>
                      ) : (
                        "Skicka ansökan"
                      )}
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
              <p className="text-muted-foreground mb-4">
                Vi har skickat ett bekräftelsemail till <strong>{formData.contact_email}</strong> med en länk för att skapa ditt konto.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Vi granskar din ansökan och återkommer inom 1-2 arbetsdagar.
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
