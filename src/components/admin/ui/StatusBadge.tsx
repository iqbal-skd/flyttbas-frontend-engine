/**
 * StatusBadge - Reusable status badge component
 * Displays status with appropriate color coding
 */

import { Badge } from "@/components/ui/badge";
import {
  QUOTE_STATUS_CONFIG,
  OFFER_STATUS_CONFIG,
  JOB_STATUS_CONFIG,
  PARTNER_STATUS_CONFIG,
} from "../constants";
import type { QuoteStatus, OfferStatus, JobStatus, PartnerStatus } from "../types";

type StatusType = "quote" | "offer" | "job" | "partner";

interface StatusBadgeProps {
  status: string | null;
  type: StatusType;
  className?: string;
}

const STATUS_CONFIGS = {
  quote: QUOTE_STATUS_CONFIG,
  offer: OFFER_STATUS_CONFIG,
  job: JOB_STATUS_CONFIG,
  partner: PARTNER_STATUS_CONFIG,
} as const;

export function AdminStatusBadge({ status, type, className = "" }: StatusBadgeProps) {
  if (!status) return null;

  const config = STATUS_CONFIGS[type];
  const statusConfig = config[status as keyof typeof config] as { label: string; color: string } | undefined;

  if (!statusConfig) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge className={`${statusConfig.color} ${className}`}>
      {statusConfig.label}
    </Badge>
  );
}
