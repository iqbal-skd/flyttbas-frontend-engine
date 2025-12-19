import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "./types";

interface WizardProgressProps {
  currentStep: number;
}

export const WizardProgress = ({ currentStep }: WizardProgressProps) => {
  return (
    <nav 
      aria-label="Formulärframsteg" 
      className="flex items-center justify-between mb-6"
      role="navigation"
    >
      <ol className="flex items-center justify-between w-full" role="list">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <li 
              key={step.id} 
              className="flex items-center flex-1"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    isCompleted && "bg-accent text-accent-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {isCompleted ? <Check className="h-4 w-4" aria-hidden="true" /> : step.id}
                </div>
                <span 
                  className={cn(
                    "text-xs mt-1.5 text-center max-w-[70px] sm:max-w-none leading-tight",
                    isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                  <span className="sr-only">
                    {isCompleted ? " (slutfört)" : isCurrent ? " (aktuellt steg)" : ""}
                  </span>
                </span>
              </div>
              
              {/* Connector line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-1.5 sm:mx-2 transition-all duration-300",
                    currentStep > step.id ? "bg-accent" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
