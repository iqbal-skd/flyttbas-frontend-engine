import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "./types";

interface WizardProgressProps {
  currentStep: number;
}

export const WizardProgress = ({ currentStep }: WizardProgressProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  isCompleted && "bg-accent text-accent-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={cn(
                "text-xs mt-1 hidden sm:block",
                isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            
            {/* Connector line */}
            {index < WIZARD_STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-all duration-300",
                currentStep > step.id ? "bg-accent" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};
