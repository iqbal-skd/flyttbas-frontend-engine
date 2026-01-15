/**
 * UrgencyBadge - Shows urgency based on days until event
 */

import { Badge } from "@/components/ui/badge";
import { getDaysUntil } from "../utils";
import { getUrgencyLevel, URGENCY_COLORS } from "../constants";

interface UrgencyBadgeProps {
  date: string;
  className?: string;
}

export function UrgencyBadge({ date, className = "" }: UrgencyBadgeProps) {
  const days = getDaysUntil(date);
  const level = getUrgencyLevel(days);
  const color = URGENCY_COLORS[level];

  if (level === "passed") {
    return (
      <Badge className={`${color} text-xs ${className}`}>
        Passerad
      </Badge>
    );
  }

  return (
    <Badge className={`${color} text-xs ${className}`}>
      {days}d kvar
    </Badge>
  );
}
