import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Home, ChevronRight } from "lucide-react";
import { getDaysUntilMove, formatDaysUntilMove, formatDateSwedish, getDwellingTypeLabel } from "@/lib/dashboard-utils";

interface QuoteCardProps {
  id: string;
  moveDate: string;
  status: string;
  fromAddress: string;
  fromPostalCode: string;
  toAddress: string;
  toPostalCode: string;
  dwellingType: string;
  areaM2: number;
  rooms?: number | null;
  offerCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const QuoteCard = ({
  moveDate,
  status,
  fromAddress,
  fromPostalCode,
  toAddress,
  toPostalCode,
  dwellingType,
  areaM2,
  rooms,
  offerCount = 0,
  isSelected = false,
  onClick,
}: QuoteCardProps) => {
  const daysUntil = getDaysUntilMove(moveDate);
  const isApproved = status === 'offer_approved';
  const isPast = daysUntil < 0;

  const getHeaderStyle = () => {
    if (isApproved) return 'bg-green-100';
    if (offerCount > 0) return 'bg-blue-100';
    return 'bg-amber-50';
  };

  const getBadgeStyle = () => {
    if (isApproved) return 'bg-green-600 text-white hover:bg-green-600';
    if (offerCount > 0) return 'bg-blue-600 text-white hover:bg-blue-600';
    return 'bg-amber-500 text-white hover:bg-amber-500';
  };

  const getStatusText = () => {
    if (isApproved) return 'Godkänd';
    if (offerCount > 0) return `${offerCount} offert${offerCount !== 1 ? 'er' : ''}`;
    return 'Väntande';
  };

  return (
    <Card
      className={`cursor-pointer overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${isPast ? 'opacity-60' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Status Header */}
      <div className={`px-4 py-2 ${getHeaderStyle()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-semibold text-sm">
              {formatDateSwedish(moveDate)}
            </span>
          </div>
          <Badge className={`text-xs ${getBadgeStyle()}`}>
            {getStatusText()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Route Visualization */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex flex-col items-center" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <div className="w-0.5 h-6 bg-gradient-to-b from-blue-300 to-green-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" title={fromAddress || fromPostalCode}>
              {fromAddress || fromPostalCode}
            </p>
            <p className="text-sm truncate text-muted-foreground" title={toAddress || toPostalCode}>
              {toAddress || toPostalCode}
            </p>
          </div>
        </div>

        {/* Property Info & Countdown */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Home className="h-3 w-3" aria-hidden="true" />
            <span>
              {getDwellingTypeLabel(dwellingType)} • {areaM2} m²
              {rooms && ` • ${rooms} rum`}
            </span>
          </span>
          {!isPast && (
            <span
              className={`font-medium ${daysUntil <= 7 ? 'text-amber-600' : ''}`}
              aria-label={`${daysUntil} dagar kvar till flytt`}
            >
              {formatDaysUntilMove(daysUntil)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end mt-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
};
