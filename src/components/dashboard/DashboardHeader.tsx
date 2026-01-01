import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onSignOut: () => void;
  children?: ReactNode;
}

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  onSignOut, 
  children 
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex gap-3">
        {children}
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Logga ut
        </Button>
      </div>
    </div>
  );
};
