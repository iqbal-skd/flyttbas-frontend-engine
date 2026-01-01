import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  suffix?: string;
}

export const StatCard = ({ 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  label, 
  value,
  suffix 
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString('sv-SE') : value}
              {suffix && ` ${suffix}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
