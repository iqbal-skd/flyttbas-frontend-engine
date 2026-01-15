import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Home,
  ExternalLink,
  Package,
  Weight,
  AlertCircle,
  MessageSquare,
  Route,
} from "lucide-react";
import {
  getDaysUntilMove,
  openGoogleMaps,
  formatHeavyItems,
  calculateDistance,
  getDwellingTypeLabel,
} from "@/lib/dashboard-utils";
import type { QuoteRequest } from "@/types/customer-dashboard";

interface QuoteDetailHeaderProps {
  quote: QuoteRequest;
}

export const QuoteDetailHeader = ({ quote }: QuoteDetailHeaderProps) => {
  const daysUntil = getDaysUntilMove(quote.move_date);
  const isApproved = quote.status === 'offer_approved';
  const distance = calculateDistance(
    quote.from_lat,
    quote.from_lng,
    quote.to_lat,
    quote.to_lng
  );
  const heavyItemsText = formatHeavyItems(quote.heavy_items);

  return (
    <Card className="overflow-hidden">
      {/* Header Banner */}
      <div
        className={`px-6 py-4 ${
          isApproved
            ? 'bg-gradient-to-r from-green-100 to-green-50'
            : 'bg-gradient-to-r from-primary/10 to-primary/5'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">
              Flytt{' '}
              {new Date(quote.move_date).toLocaleDateString('sv-SE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h2>
            {quote.move_start_time && (
              <p className="text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4 inline mr-1" aria-hidden="true" />
                Önskad starttid: {quote.move_start_time}
              </p>
            )}
          </div>
          {daysUntil >= 0 && (
            <Badge
              variant="outline"
              className="text-lg px-3 py-1 shrink-0 self-start"
            >
              {daysUntil} {daysUntil === 1 ? 'dag' : 'dagar'} kvar
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Addresses */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors text-left w-full"
            onClick={() => openGoogleMaps(quote.from_address, quote.from_postal_code)}
            aria-label={`Öppna ${quote.from_address} i Google Maps`}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-blue-700 font-bold text-sm">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Från
                </p>
                <p className="font-medium truncate">{quote.from_address}</p>
                <p className="text-sm text-muted-foreground">
                  {quote.from_postal_code}
                </p>
                {(quote.stairs_from != null || quote.elevator_from_size) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {quote.elevator_from_size
                      ? '✓ Hiss'
                      : `${quote.stairs_from || 0} tr`}
                  </p>
                )}
              </div>
              <ExternalLink
                className="h-4 w-4 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
            </div>
          </button>

          <button
            type="button"
            className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors text-left w-full"
            onClick={() => openGoogleMaps(quote.to_address, quote.to_postal_code)}
            aria-label={`Öppna ${quote.to_address} i Google Maps`}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="text-green-700 font-bold text-sm">B</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Till
                </p>
                <p className="font-medium truncate">{quote.to_address}</p>
                <p className="text-sm text-muted-foreground">
                  {quote.to_postal_code}
                </p>
                {(quote.stairs_to != null || quote.elevator_to_size) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {quote.elevator_to_size
                      ? '✓ Hiss'
                      : `${quote.stairs_to || 0} tr`}
                  </p>
                )}
              </div>
              <ExternalLink
                className="h-4 w-4 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>

        {/* Property Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-primary/5 rounded-lg mb-4">
          <div className="text-center">
            <Home className="h-5 w-5 mx-auto text-primary mb-1" aria-hidden="true" />
            <p className="font-semibold">{getDwellingTypeLabel(quote.dwelling_type)}</p>
            <p className="text-xs text-muted-foreground">Typ</p>
          </div>
          <div className="text-center border-l border-border">
            <p className="text-xl font-bold text-primary">{quote.area_m2}</p>
            <p className="text-xs text-muted-foreground">m²</p>
          </div>
          <div className="text-center border-l border-border">
            <p className="text-xl font-bold text-primary">{quote.rooms ?? '-'}</p>
            <p className="text-xs text-muted-foreground">rum</p>
          </div>
          <div className="text-center border-l border-border">
            <Route className="h-5 w-5 mx-auto text-primary mb-1" aria-hidden="true" />
            <p className="font-semibold">{distance ? `${distance} km` : '-'}</p>
            <p className="text-xs text-muted-foreground">avstånd</p>
          </div>
        </div>

        {/* Services & Special Info Badges */}
        <div className="flex flex-wrap gap-2">
          {quote.packing_hours != null && quote.packing_hours > 0 && (
            <Badge
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-700"
            >
              <Package className="h-3 w-3 mr-1" aria-hidden="true" />
              Packning
            </Badge>
          )}
          {quote.assembly_hours != null && quote.assembly_hours > 0 && (
            <Badge
              variant="outline"
              className="bg-purple-50 border-purple-200 text-purple-700"
            >
              <Package className="h-3 w-3 mr-1" aria-hidden="true" />
              Montering
            </Badge>
          )}
          {heavyItemsText && (
            <Badge
              variant="outline"
              className="bg-red-50 border-red-200 text-red-700"
            >
              <Weight className="h-3 w-3 mr-1" aria-hidden="true" />
              {heavyItemsText}
            </Badge>
          )}
          {quote.parking_restrictions && (
            <Badge
              variant="outline"
              className="bg-amber-50 border-amber-200 text-amber-700"
            >
              <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
              Begränsad parkering
            </Badge>
          )}
        </div>

        {/* Customer Notes */}
        {quote.notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <MessageSquare className="h-4 w-4 inline mr-1" aria-hidden="true" />
              "{quote.notes}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
