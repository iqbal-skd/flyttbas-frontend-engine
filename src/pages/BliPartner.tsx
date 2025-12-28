import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  MapPin,
  AlertCircle
} from "lucide-react";
import { z } from "zod";

const partnerSchema = z.object({
  company_name: z.string().min(2, "Företagsnamn krävs"),
  org_number: z.string().regex(/^\d{6}-?\d{4}$/, "Ange giltigt organisationsnummer (XXXXXX-XXXX)"),
  contact_name: z.string().min(2, "Kontaktperson krävs"),
  contact_email: z.string().email("Ange giltig e-postadress"),
  contact_phone: z.string().min(8, "Ange giltigt telefonnummer"),
  address: z.string().min(5, "Ange företagets adress"),
  password: z.string().min(8, "Lösenord måste vara minst 8 tecken"),
  confirm_password: z.string().min(8, "Bekräfta lösenord"),
  traffic_license_number: z.string().optional(),
  f_tax_certificate: z.boolean(),
  insurance_company: z.string().optional(),
  gdpr_consent: z.boolean().refine(val => val === true, "Du måste godkänna villkoren"),
}).refine(data => data.password === data.confirm_password, {
  message: "Lösenorden matchar inte",
  path: ["confirm_password"],
});

type PartnerFormData = {
  company_name: string;
  org_number: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  address_lat?: number;
  address_lng?: number;
  password: string;
  confirm_password: string;
  traffic_license_number: string;
  f_tax_certificate: boolean;
  insurance_company: string;
  gdpr_consent: boolean;
};

const BliPartner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  
  const [step, setStep] = useState<'form' | 'success' | 'already_partner'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkingPartner, setCheckingPartner] = useState(true);
  const [existingPartnerId, setExistingPartnerId] = useState<string | null>(null);
  const [existingPartnerStatus, setExistingPartnerStatus] = useState<string | null>(null);
  const [statusReason, setStatusReason] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PartnerFormData>({
    company_name: "",
    org_number: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    address_lat: undefined,
    address_lng: undefined,
    password: "",
    confirm_password: "",
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
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingPartner) {
        if (existingPartner.status === 'approved') {
          navigate('/partner');
        } else if (isEditMode && existingPartner.status === 'more_info_requested') {
          // Allow editing if status is more_info_requested
          setExistingPartnerId(existingPartner.id);
          setExistingPartnerStatus(existingPartner.status);
          setStatusReason(existingPartner.status_reason);
          setFormData({
            company_name: existingPartner.company_name || "",
            org_number: existingPartner.org_number || "",
            contact_name: existingPartner.contact_name || "",
            contact_email: existingPartner.contact_email || "",
            contact_phone: existingPartner.contact_phone || "",
            address: existingPartner.address || "",
            address_lat: existingPartner.address_lat || undefined,
            address_lng: existingPartner.address_lng || undefined,
            password: "",
            confirm_password: "",
            traffic_license_number: existingPartner.traffic_license_number || "",
            f_tax_certificate: existingPartner.f_tax_certificate || false,
            insurance_company: existingPartner.insurance_company || "",
            gdpr_consent: true,
          });
          setStep('form');
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
  }, [navigate, isEditMode]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // For edit mode, we don't require password fields
    const schemaToUse = isEditMode && existingPartnerId 
      ? partnerSchema.omit({ password: true, confirm_password: true }).extend({
          password: z.string().optional(),
          confirm_password: z.string().optional(),
        })
      : partnerSchema;
    
    const result = schemaToUse.safeParse(formData);
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
      // If editing an existing partner
      if (isEditMode && existingPartnerId) {
        const { error: updateError } = await supabase
          .from('partners')
          .update({
            company_name: formData.company_name,
            org_number: formData.org_number,
            contact_name: formData.contact_name,
            contact_phone: formData.contact_phone,
            address: formData.address,
            address_lat: formData.address_lat || null,
            address_lng: formData.address_lng || null,
            traffic_license_number: formData.traffic_license_number || null,
            f_tax_certificate: formData.f_tax_certificate,
            insurance_company: formData.insurance_company || null,
            status: 'pending', // Reset to pending for review
            status_reason: null, // Clear the old reason
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPartnerId);

        if (updateError) throw updateError;

        setStep('success');
        toast({
          title: "Ansökan uppdaterad!",
          description: "Vi har tagit emot dina uppdaterade uppgifter och kommer granska dem inom 1-2 arbetsdagar.",
        });
        return;
      }

      // First, check if a partner already exists with this email
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id')
        .eq('contact_email', formData.contact_email)
        .maybeSingle();
      
      if (existingPartner) {
        toast({
          variant: "destructive",
          title: "E-post redan använd",
          description: "Denna e-postadress används redan av en annan partner. Använd en annan e-postadress.",
        });
        setSubmitting(false);
        return;
      }
      
      // Determine userId: check if logged in, or if user exists with this email, or create new user
      let userId: string;
      let isNewUser = false;
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        // User is logged in, use their ID
        userId = currentUser.id;
      } else {
        // Check if a user already exists with this email by checking profiles table
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', formData.contact_email)
          .maybeSingle();
        
        if (existingProfile) {
          // User exists but is not logged in - they need to log in first for security
          toast({
            variant: "destructive",
            title: "E-post redan registrerad",
            description: "Denna e-postadress är redan registrerad. Vänligen logga in först för att bli partner.",
          });
          setSubmitting(false);
          return;
        }
        
        // No user exists, create a new one with their chosen password
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.contact_email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/partner`,
            data: {
              full_name: formData.contact_name,
            }
          }
        });
        
        if (signUpError) {
          // Handle edge case where user exists in auth but not profiles
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
        isNewUser = true;
      }

      // For new users, update role to 'partner' immediately (before trigger creates 'customer')
      // For existing users, also ensure they have partner role
      const { error: roleError } = await supabase.rpc('set_partner_role', {
        target_user_id: userId
      });
      
      if (roleError) {
        console.error('Failed to set partner role:', roleError);
        // For new users, this is critical - throw error
        if (isNewUser) {
          throw new Error("Kunde inte sätta partnerroll. Försök igen.");
        }
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
        <title>Bli Partner | Flyttbas - Jämför Flyttfirmor</title>
        <meta name="description" content="Anslut ditt flyttföretag till Flyttbas och få fler kunder. Vi matchar dig med flyttjobb i ditt område." />
      </Helmet>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                {isEditMode ? "Uppdatera din ansökan" : "Bli partner hos Flyttbas"}
              </h1>
              <p className="text-muted-foreground mb-4">
                {isEditMode 
                  ? "Uppdatera dina uppgifter nedan så granskar vi dem igen inom 1-2 arbetsdagar."
                  : "Fyll i formuläret nedan så granskar vi din ansökan inom 1-2 arbetsdagar."}
              </p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        {step === 'form' && (
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card>
                {isEditMode && statusReason && (
                  <div className="bg-amber-50 border-b border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-amber-900">Meddelande från administratören:</p>
                        <p className="text-amber-800 mt-1">{statusReason}</p>
                      </div>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" />
                    <CardTitle>{isEditMode ? "Uppdatera företagsuppgifter" : "Företagsuppgifter"}</CardTitle>
                  </div>
                  <CardDescription>
                    {isEditMode ? "Ändra dina uppgifter nedan" : "Fyll i uppgifter om ditt flyttföretag"}
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
                        disabled={isEditMode}
                      />
                      {errors.contact_email && <p className="text-xs text-destructive mt-1">{errors.contact_email}</p>}
                    </div>

                    {!isEditMode && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">Lösenord *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={errors.password ? "border-destructive" : ""}
                            placeholder="Minst 8 tecken"
                          />
                          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                        </div>
                        <div>
                          <Label htmlFor="confirm_password">Bekräfta lösenord *</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                            className={errors.confirm_password ? "border-destructive" : ""}
                          />
                          {errors.confirm_password && <p className="text-xs text-destructive mt-1">{errors.confirm_password}</p>}
                        </div>
                      </div>
                    )}

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
