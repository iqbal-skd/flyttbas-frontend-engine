import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Star,
  Users,
  Shield,
  Award,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { formatCurrency } from "@/lib/dashboard-utils";
import type { Partner, Review } from "@/types/customer-dashboard";

interface OfferCardProps {
  id: string;
  totalPrice: number;
  priceBeforeRut?: number | null;
  estimatedHours: number;
  teamSize: number;
  timeWindow: string;
  status: string;
  terms?: string | null;
  distanceKm?: number | null;
  partner: Partner | null;
  reviews?: Review[];
  onApprove?: () => void;
  approveDisabled?: boolean;
}

export const OfferCard = ({
  totalPrice,
  priceBeforeRut,
  estimatedHours,
  teamSize,
  timeWindow,
  status,
  terms,
  distanceKm,
  partner,
  reviews = [],
  onApprove,
  approveDisabled = false,
}: OfferCardProps) => {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const isPending = status === "pending";
  const isSponsored = partner?.is_sponsored;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isSponsored ? 'ring-2 ring-primary shadow-lg' : ''
      } ${isRejected ? 'opacity-60' : ''}`}
    >
      {/* Sponsored Banner */}
      {isSponsored && (
        <div className="bg-primary text-primary-foreground text-xs font-medium px-4 py-1.5 text-center">
          <Award className="h-3 w-3 inline mr-1" aria-hidden="true" />
          Sponsrad partner - Topprankad
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Partner Info Section */}
          <div className="flex-1">
            {/* Header with Avatar */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                  isSponsored ? 'bg-primary/20' : 'bg-primary/10'
                }`}
                aria-hidden="true"
              >
                <Truck className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg truncate">{partner?.company_name}</h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  {partner?.average_rating != null && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                      <span>{partner.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({partner.total_reviews ?? 0} omdömen)
                      </span>
                    </span>
                  )}
                  {partner?.completed_jobs != null && partner.completed_jobs > 0 && (
                    <span>{partner.completed_jobs} genomförda jobb</span>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {partner?.f_tax_certificate && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 border-green-200 text-green-700"
                    >
                      <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                      F-skatt
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                  >
                    <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
                    Försäkrad
                  </Badge>
                </div>
              </div>
            </div>

            {/* Offer Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Tidsfönster</p>
                <p className="font-medium">{timeWindow}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Uppskattad tid</p>
                <p className="font-medium">{estimatedHours} timmar</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {teamSize} pers
                </p>
              </div>
              {distanceKm != null && (
                <div>
                  <p className="text-xs text-muted-foreground">Avstånd</p>
                  <p className="font-medium">{distanceKm} km</p>
                </div>
              )}
            </div>

            {/* Terms */}
            {terms && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm">
                  <MessageSquare className="h-4 w-4 inline mr-1 text-muted-foreground" aria-hidden="true" />
                  {terms}
                </p>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Senaste omdömen
                </p>
                {reviews.slice(0, 1).map((review) => (
                  <div
                    key={review.id}
                    className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="flex items-center gap-0.5 mb-1" aria-label={`${review.rating} av 5 stjärnor`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-yellow-800">"{review.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price & Action Section */}
          <div className="lg:text-right lg:min-w-[180px]">
            <div className="p-4 bg-primary/5 rounded-lg mb-4">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(totalPrice)} kr
              </p>
              <p className="text-sm text-muted-foreground">efter RUT-avdrag</p>
              {priceBeforeRut != null && (
                <p className="text-xs text-muted-foreground mt-1">
                  ({formatCurrency(priceBeforeRut)} kr före)
                </p>
              )}
            </div>

            {isApproved && (
              <Badge className="bg-green-600 text-white hover:bg-green-600 w-full justify-center py-2">
                <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />
                Godkänd
              </Badge>
            )}

            {isRejected && (
              <Badge variant="outline" className="w-full justify-center py-2 text-muted-foreground">
                Avböjd
              </Badge>
            )}

            {isPending && onApprove && (
              <Button
                className="w-full"
                size="lg"
                onClick={onApprove}
                disabled={approveDisabled}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
                Godkänn offert
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
