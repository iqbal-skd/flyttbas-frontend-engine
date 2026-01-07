import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Home, 
  Ruler, 
  Package, 
  Clock, 
  User, 
  Mail, 
  Phone 
} from "lucide-react";

interface HeavyItem {
  name: string;
  quantity: number;
}

interface JobDetailsCardProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  fromAddress: string;
  toAddress: string;
  moveDate: string;
  moveStartTime?: string | null;
  dwellingType: string;
  areaM2: number;
  rooms?: number | null;
  stairsFrom?: number | null;
  stairsTo?: number | null;
  elevatorFrom?: boolean;
  elevatorTo?: boolean;
  heavyItems?: HeavyItem[] | string[] | null;
  packingHours?: number | null;
  assemblyHours?: number | null;
  notes?: string | null;
  showCustomerContact?: boolean;
}

export const JobDetailsCard = ({
  customerName,
  customerEmail,
  customerPhone,
  fromAddress,
  toAddress,
  moveDate,
  moveStartTime,
  dwellingType,
  areaM2,
  rooms,
  stairsFrom,
  stairsTo,
  elevatorFrom,
  elevatorTo,
  heavyItems,
  packingHours,
  assemblyHours,
  notes,
  showCustomerContact = false,
}: JobDetailsCardProps) => {
  const formatHeavyItems = (items: HeavyItem[] | string[] | null | undefined) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    // Handle both object array and string array formats
    if (typeof items[0] === 'string') {
      return (items as string[]).join(", ");
    }
    
    return (items as HeavyItem[])
      .filter((item) => item.quantity > 0)
      .map((item) => `${item.name}: ${item.quantity}`)
      .join(", ");
  };

  const heavyItemsText = formatHeavyItems(heavyItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Jobbdetaljer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        {showCustomerContact && (
          <div className="p-4 bg-primary/5 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Kunduppgifter
            </h4>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{customerName}</p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${customerEmail}`} className="text-primary hover:underline">
                  {customerEmail}
                </a>
              </p>
              {customerPhone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${customerPhone}`} className="text-primary hover:underline">
                    {customerPhone}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Move Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Från</p>
              <p className="font-medium">{fromAddress}</p>
              {elevatorFrom ? (
                <p className="text-sm text-muted-foreground">Hiss finns</p>
              ) : (stairsFrom !== null && stairsFrom !== undefined && stairsFrom > 0) ? (
                <p className="text-sm text-muted-foreground">{stairsFrom} trappor</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Till</p>
              <p className="font-medium">{toAddress}</p>
              {elevatorTo ? (
                <p className="text-sm text-muted-foreground">Hiss finns</p>
              ) : (stairsTo !== null && stairsTo !== undefined && stairsTo > 0) ? (
                <p className="text-sm text-muted-foreground">{stairsTo} trappor</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Datum</p>
              <p className="text-sm font-medium">
                {new Date(moveDate).toLocaleDateString("sv-SE")}
              </p>
            </div>
          </div>

          {moveStartTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Starttid</p>
                <p className="text-sm font-medium">{moveStartTime}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Bostad</p>
              <p className="text-sm font-medium">{dwellingType}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Storlek</p>
              <p className="text-sm font-medium">
                {areaM2} m² {rooms && `• ${rooms} rum`}
              </p>
            </div>
          </div>
        </div>

        {/* Additional services */}
        {((packingHours && packingHours > 0) || (assemblyHours && assemblyHours > 0)) && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Tilläggstjänster</p>
            <div className="flex gap-4 text-sm">
              {packingHours && packingHours > 0 && (
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Packning: Ja
                </span>
              )}
              {assemblyHours && assemblyHours > 0 && (
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Montering: Ja
                </span>
              )}
            </div>
          </div>
        )}

        {/* Heavy items */}
        {heavyItemsText && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1">Tunga föremål</p>
            <p className="text-sm text-muted-foreground">{heavyItemsText}</p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-1">Anteckningar</p>
            <p className="text-sm text-muted-foreground">{notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
