import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { Truck, Star, Users, Phone, Mail } from "lucide-react";

interface PartnerInfo {
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  average_rating: number;
  total_reviews: number;
}

interface OfferCardProps {
  id: string;
  totalPrice: number;
  priceBeforeRut?: number;
  estimatedHours: number;
  teamSize: number;
  timeWindow: string;
  status: string;
  partner: PartnerInfo | null;
  showContactInfo?: boolean;
  onApprove?: () => void;
  approveDisabled?: boolean;
}

export const OfferCard = ({
  totalPrice,
  estimatedHours,
  teamSize,
  timeWindow,
  status,
  partner,
  showContactInfo = false,
  onApprove,
  approveDisabled = false,
}: OfferCardProps) => {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <div
      className={`border rounded-lg p-4 ${
        isApproved
          ? "border-green-500 bg-green-50"
          : isRejected
          ? "border-gray-300 bg-gray-50 opacity-60"
          : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold">{partner?.company_name}</h4>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-orange text-orange" />
                <span>
                  {partner?.average_rating?.toFixed(1) || "N/A"} (
                  {partner?.total_reviews || 0} omdömen)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm mt-3">
            <div>
              <p className="text-muted-foreground">Tidsfönster</p>
              <p className="font-medium">{timeWindow}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Uppsk. tid</p>
              <p className="font-medium">{estimatedHours}h</p>
            </div>
            <div>
              <p className="text-muted-foreground">Team</p>
              <p className="font-medium flex items-center gap-1">
                <Users className="h-4 w-4" />
                {teamSize} pers
              </p>
            </div>
          </div>

          {/* Contact info when approved */}
          {showContactInfo && isApproved && partner && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Kontaktuppgifter till {partner.company_name}
              </h4>
              <div className="space-y-2 text-sm">
                {partner.contact_name && (
                  <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">Kontaktperson:</span>
                    <span className="font-medium">{partner.contact_name}</span>
                  </p>
                )}
                {partner.contact_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${partner.contact_email}`}
                      className="text-primary hover:underline"
                    >
                      {partner.contact_email}
                    </a>
                  </p>
                )}
                {partner.contact_phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${partner.contact_phone}`}
                      className="text-primary hover:underline"
                    >
                      {partner.contact_phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            {totalPrice.toLocaleString("sv-SE")} kr
          </p>
          <p className="text-xs text-muted-foreground">efter RUT-avdrag</p>

          {isApproved ? (
            <StatusBadge status="approved" />
          ) : isRejected ? (
            <StatusBadge status="rejected" />
          ) : onApprove ? (
            <Button
              className="mt-2"
              onClick={onApprove}
              disabled={approveDisabled}
            >
              Godkänn offert
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
