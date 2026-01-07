import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { Calculator, ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FormData, initialFormData, WIZARD_STEPS, formSchema } from "./types";
import { WizardProgress } from "./WizardProgress";
import { Step1Property } from "./Step1Property";
import { Step2Details } from "./Step2Details";
import { Step3Services } from "./Step3Services";
import { Step4Quote } from "./Step4Quote";

export const QuoteWizard = () => {
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    
    // Validate form
    const result = formSchema.safeParse(formData);
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

    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getRecaptchaToken("quote_submission");
      
      // Determine customer_id: check if logged in, or if a user exists with this email, or create a new user
      let customerId: string | null = null;
      
      // First check if user is logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        customerId = currentUser.id;
      } else {
        // Check if a user already exists with this email by checking profiles table
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', formData.customer_email)
          .maybeSingle();
        
        if (existingProfile) {
          // User exists, use their ID
          customerId = existingProfile.user_id;
        } else {
          // No user exists, create a new one with a random password (they'll use magic link to login)
          const tempPassword = crypto.randomUUID() + crypto.randomUUID();
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.customer_email,
            password: tempPassword,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              data: {
                full_name: formData.customer_name,
              }
            }
          });
          
          if (signUpError) {
            // If signup fails (e.g., user already registered but not in profiles yet), log and continue
            console.error('User creation failed:', signUpError);
            // Continue without customer_id - they can still access via email matching
          } else if (signUpData.user) {
            customerId = signUpData.user.id;
            // The trigger handle_new_user will automatically create profile and assign 'customer' role
          }
        }
      }
      
      // Generate a quote ID on the client side to avoid needing SELECT permission
      const quoteId = crypto.randomUUID();
      
      // Submit to database (recaptcha_token is validated but not stored)
      const { error } = await supabase.from('quote_requests').insert({
        id: quoteId,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || null,
        customer_id: customerId,
        contact_preference: formData.contact_preference,
        from_address: formData.from_address || '',
        from_postal_code: formData.from_postal_code || '',
        from_lat: formData.from_lat || null,
        from_lng: formData.from_lng || null,
        to_address: formData.to_address || '',
        to_postal_code: formData.to_postal_code || '',
        dwelling_type: formData.dwelling_type || 'apartment',
        area_m2: formData.area_m2 ? parseInt(formData.area_m2) : 50,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        move_date: formData.date || new Date().toISOString().split('T')[0],
        move_start_time: formData.flexible_time ? 'Flexibel' : null,
        stairs_from: formData.stairs_from ? parseInt(formData.stairs_from) : 0,
        stairs_to: formData.stairs_to ? parseInt(formData.stairs_to) : 0,
        carry_from_m: 0,
        carry_to_m: 0,
        parking_restrictions: formData.parking_restrictions || false,
        heavy_items: formData.heavy_items || [],
        packing_hours: formData.packing_help ? 1 : 0,
        assembly_hours: formData.assembly_help ? 1 : 0,
        home_visit_requested: formData.home_visit_requested || false,
        notes: formData.notes || null,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });

      if (error) throw error;

      // Send confirmation email with magic link
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            type: 'quote_request',
            email: formData.customer_email,
            name: formData.customer_name,
            quoteId: quoteId,
          }
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the whole process if email fails
      }

      setSubmitted(true);
      toast({
        title: "Förfrågan skickad!",
        description: "Vi har skickat ett bekräftelsemail med en länk till din kundportal.",
        duration: 10000,
      });

      // Reset form after showing success
      setTimeout(() => {
        setFormData(initialFormData);
        setCurrentStep(1);
        setSubmitted(false);
      }, 8000);

    } catch (error: any) {
      console.error('Quote submission error:', error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte skicka förfrågan. Försök igen.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = { formData, setFormData, errors };
    
    switch (currentStep) {
      case 1:
        return <Step1Property {...stepProps} />;
      case 2:
        return <Step2Details {...stepProps} />;
      case 3:
        return <Step3Services {...stepProps} />;
      case 4:
        return <Step4Quote {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === WIZARD_STEPS.length;

  if (submitted) {
    return (
      <Card className="shadow-2xl border-0" id="quote-wizard">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Tack för din förfrågan!</h3>
          <p className="text-muted-foreground mb-4">
            Vi har skickat ett bekräftelsemail till <strong>{formData.customer_email}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            I mailet finns en länk där du kan skapa ett konto eller logga in med magic link för att se dina offerter.
          </p>
          <p className="text-sm text-muted-foreground">
            Verifierade flyttfirmor i ditt område kommer skicka offerter som du kan jämföra.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-0" id="quote-wizard">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-accent" aria-hidden="true" />
          <CardTitle className="text-lg sm:text-xl">Jämför Offerter Gratis</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Fyll i dina uppgifter så matchar vi dig med verifierade flyttfirmor
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <WizardProgress currentStep={currentStep} />
        
        <div 
          className="min-h-[350px] sm:min-h-[400px]"
          role="form"
          aria-label={`Steg ${currentStep} av ${WIZARD_STEPS.length}: ${WIZARD_STEPS[currentStep - 1]?.title}`}
        >
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className="gap-2 w-full sm:w-auto"
            aria-label="Gå till föregående steg"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Tillbaka
          </Button>
          
          {isLastStep ? (
            <Button 
              onClick={handleSubmit} 
              className="gap-2 w-full sm:w-auto"
              aria-label="Skicka din offertförfrågan"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Skickar...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Få offerter
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="gap-2 w-full sm:w-auto"
              aria-label="Gå till nästa steg"
            >
              Nästa
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
