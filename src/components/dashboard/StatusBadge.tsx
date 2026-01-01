import { Badge } from "@/components/ui/badge";

// Status color mappings
const statusColors: Record<string, string> = {
  // Quote statuses
  pending: "bg-yellow-100 text-yellow-800",
  offers_received: "bg-blue-100 text-blue-800",
  offer_approved: "bg-green-100 text-green-800",
  completed: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
  // Partner statuses
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  more_info_requested: "bg-blue-100 text-blue-800",
  suspended: "bg-gray-100 text-gray-800",
  // Job statuses
  confirmed: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  withdrawn: "bg-gray-100 text-gray-800",
};

// Status label mappings (Swedish)
const statusLabels: Record<string, string> = {
  // Quote statuses
  pending: "Väntande",
  offers_received: "Offerter mottagna",
  offer_approved: "Offert godkänd",
  completed: "Genomförd",
  cancelled: "Avbokad",
  expired: "Utgången",
  // Partner statuses
  approved: "Godkänd",
  rejected: "Avvisad",
  more_info_requested: "Begärt mer info",
  suspended: "Avstängd",
  // Job statuses
  confirmed: "Bekräftad",
  scheduled: "Schemalagd",
  in_progress: "Pågående",
  withdrawn: "Återkallad",
};

interface StatusBadgeProps {
  status: string | null;
  customLabels?: Record<string, string>;
  customColors?: Record<string, string>;
}

export const StatusBadge = ({ 
  status, 
  customLabels, 
  customColors 
}: StatusBadgeProps) => {
  const safeStatus = status || "pending";
  const labels = customLabels || statusLabels;
  const colors = customColors || statusColors;

  return (
    <Badge className={colors[safeStatus] || "bg-gray-100 text-gray-800"}>
      {labels[safeStatus] || safeStatus}
    </Badge>
  );
};

export { statusColors, statusLabels };
