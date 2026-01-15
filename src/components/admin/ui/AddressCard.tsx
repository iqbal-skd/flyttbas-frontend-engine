/**
 * AddressCard - Reusable address display with map links
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { getGoogleMapsUrl } from "../utils";
import { ELEVATOR_SIZE_LABELS } from "../constants";

interface AddressCardProps {
  title: string;
  address?: string;
  postalCode?: string;
  lat?: number | null;
  lng?: number | null;
  stairs?: number | null;
  elevatorSize?: string | null;
  carryDistance?: number | null;
}

export function AddressCard({
  title,
  address,
  postalCode,
  lat,
  lng,
  stairs,
  elevatorSize,
  carryDistance,
}: AddressCardProps) {
  const hasCoordinates = lat && lng;

  // If no address info, don't render
  if (!address && !postalCode) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {address && <p className="font-medium">{address}</p>}
            {postalCode && <p className="text-muted-foreground">{postalCode}</p>}
            <div className="flex flex-wrap gap-1 mt-2">
              {(stairs ?? 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  {stairs} trappor
                </Badge>
              )}
              {elevatorSize && elevatorSize !== "none" && (
                <Badge variant="outline" className="text-xs">
                  {ELEVATOR_SIZE_LABELS[elevatorSize] || elevatorSize}
                </Badge>
              )}
              {(carryDistance ?? 0) > 0 && (
                <Badge variant="outline" className="text-xs">
                  {carryDistance} m bärväg
                </Badge>
              )}
            </div>
          </div>
          {hasCoordinates && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 shrink-0"
              asChild
              aria-label="Öppna i Google Maps"
            >
              <a
                href={getGoogleMapsUrl(lat!, lng!)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
