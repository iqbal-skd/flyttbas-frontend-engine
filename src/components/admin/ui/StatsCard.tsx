/**
 * StatsCard - Reusable statistics card
 */

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

export function StatsCard({
  value,
  label,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className={`p-1.5 sm:p-2 rounded-lg ${iconBgColor} w-fit`}>
            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {trend && (
              <p
                className={`text-xs mt-1 ${
                  trend.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.positive ? "+" : ""}
                {trend.value}% {trend.label}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
