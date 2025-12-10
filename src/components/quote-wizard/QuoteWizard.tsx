import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calculator, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { calcQuote, type QuoteInput, type QuoteResult } from "@/lib/quoteCalculator";
import { FormData, initialFormData, WIZARD_STEPS } from "./types";
import { WizardProgress } from "./WizardProgress";
import { Step1Property } from "./Step1Property";
import { Step2Details } from "./Step2Details";
import { Step3Services } from "./Step3Services";
import { Step4Quote } from "./Step4Quote";

export const QuoteWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);

  const buildQuoteInput = useCallback((): QuoteInput => {
    return {
      from_address: formData.from_address || undefined,
      to_address: formData.to_address || undefined,
      area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : undefined,
      rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
      dwelling_type: formData.dwelling_type as QuoteInput['dwelling_type'] || undefined,
      date: formData.date || undefined,
      start_time: formData.start_time || undefined,
      stairs_from: formData.stairs_from ? parseInt(formData.stairs_from) : undefined,
      stairs_to: formData.stairs_to ? parseInt(formData.stairs_to) : undefined,
      carry_from_m: formData.carry_from_m ? parseInt(formData.carry_from_m) : undefined,
      carry_to_m: formData.carry_to_m ? parseInt(formData.carry_to_m) : undefined,
      parking_restrictions: formData.parking_restrictions || false,
      heavy_items: (formData.heavy_items || []) as QuoteInput['heavy_items'],
      packing_hours: formData.packing_hours ? parseFloat(formData.packing_hours) : undefined,
      assembly_hours: formData.assembly_hours ? parseFloat(formData.assembly_hours) : undefined,
      rut_eligible: true,
      customer_name: formData.customer_name || undefined,
      customer_phone: formData.customer_phone !== '+46' ? formData.customer_phone : undefined,
      customer_email: formData.customer_email || undefined,
      home_visit_requested: formData.home_visit_requested || false,
      gdpr_consent: formData.gdpr_consent || false,
    };
  }, [formData]);

  const calculateQuote = useCallback(() => {
    const input = buildQuoteInput();
    const result = calcQuote(input);
    setQuoteResult(result);
    console.log('[QuoteWizard] Quote calculated:', JSON.stringify(result, null, 2));
    return result;
  }, [buildQuoteInput]);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      // Calculate quote when moving to final step
      if (currentStep === WIZARD_STEPS.length - 1) {
        calculateQuote();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setErrors({});
    
    // Validate email if provided
    if (formData.customer_email && formData.customer_email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customer_email)) {
        setErrors({ customer_email: "Ange giltig e-postadress" });
        return;
      }
    }
    
    // Check GDPR consent
    if (!formData.gdpr_consent) {
      setErrors({ gdpr_consent: "Du måste godkänna GDPR för att skicka förfrågan" });
      return;
    }
    
    const result = quoteResult || calculateQuote();
    
    // Log for future backend integration
    console.log('[QuoteWizard] Lead submission:', JSON.stringify({
      quote: result,
      customer: {
        name: formData.customer_name,
        phone: formData.customer_phone,
        email: formData.customer_email,
        home_visit_requested: formData.home_visit_requested,
        gdpr_consent: formData.gdpr_consent,
      },
      submitted_at: new Date().toISOString(),
    }, null, 2));

    toast({
      title: "Tack! Vi ringer dig inom 15 min (08–20).",
      description: `Fastpris: ${result.move_total.toLocaleString('sv-SE')} kr${result.requires_home_visit ? ' (hembesök rekommenderas)' : ''}`,
      duration: 10000,
    });

    // Reset form
    setFormData(initialFormData);
    setCurrentStep(1);
    setQuoteResult(null);
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
        return <Step4Quote {...stepProps} quoteResult={quoteResult} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === WIZARD_STEPS.length;

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-accent" />
          <CardTitle>Få Fastpris Direkt</CardTitle>
        </div>
        <CardDescription>
          Fyll i det du vet – vi räknar ut ett pris och listar alla antaganden
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WizardProgress currentStep={currentStep} />
        
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Tillbaka
          </Button>
          
          {isLastStep ? (
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Skicka förfrågan
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Nästa
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
