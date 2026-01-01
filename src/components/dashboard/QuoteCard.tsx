import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

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
  isSelected = false,
  onClick,
}: QuoteCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {new Date(moveDate).toLocaleDateString("sv-SE")}
            </span>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="truncate">{fromAddress || fromPostalCode}</p>
              <p className="truncate">→ {toAddress || toPostalCode}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>
            {dwellingType} • {areaM2} m²
          </span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};
