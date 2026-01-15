import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Truck,
  Star,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  JOB_STATUS_ORDER,
  type JobStatus,
  type Partner,
} from "@/types/customer-dashboard";

interface JobProgressCardProps {
  jobStatus: JobStatus | string | null;
  jobStatusUpdatedAt: string | null;
  jobNotes: string | null;
  partner: Partner;
  daysUntilMove: number;
}

export const JobProgressCard = ({
  jobStatus,
  jobStatusUpdatedAt,
  jobNotes,
  partner,
  daysUntilMove,
}: JobProgressCardProps) => {
  const currentStatus = (jobStatus as JobStatus) || 'confirmed';
  const currentIndex = JOB_STATUS_ORDER.indexOf(currentStatus);

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-800">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          Ditt bokade jobb
        </h3>

        {/* Status Timeline */}
        <nav aria-label="Jobbstatus" className="mb-6">
          <ol className="flex items-center justify-between mb-2">
            {JOB_STATUS_ORDER.map((status, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <li key={status} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isActive ? (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < JOB_STATUS_ORDER.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 transition-colors ${
                        isActive && index < currentIndex
                          ? 'bg-green-600'
                          : 'bg-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex justify-between text-xs text-muted-foreground">
            {JOB_STATUS_ORDER.map((status) => (
              <span key={status}>{JOB_STATUS_LABELS[status]}</span>
            ))}
          </div>
        </nav>

        {/* Current Status */}
        <div className="p-4 bg-white rounded-lg border border-green-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nuvarande status</p>
              <p className="font-semibold text-lg">
                {JOB_STATUS_LABELS[currentStatus]}
              </p>
            </div>
            <Badge className={JOB_STATUS_COLORS[currentStatus]}>
              {JOB_STATUS_LABELS[currentStatus]}
            </Badge>
          </div>
          {jobStatusUpdatedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Uppdaterad:{' '}
              {new Date(jobStatusUpdatedAt).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>

        {/* Partner Message */}
        {jobNotes && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
            <p className="text-sm font-medium text-blue-800 mb-1">
              <MessageSquare className="h-4 w-4 inline mr-1" aria-hidden="true" />
              Meddelande från {partner.company_name}:
            </p>
            <p className="text-sm text-blue-700">"{jobNotes}"</p>
          </div>
        )}

        {/* Partner Contact */}
        <div className="p-4 bg-white rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <Truck className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="font-semibold">{partner.company_name}</p>
              {partner.average_rating != null && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star
                    className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    aria-hidden="true"
                  />
                  {partner.average_rating.toFixed(1)} ({partner.total_reviews ?? 0}{' '}
                  omdömen)
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`tel:${partner.contact_phone}`}
              className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Phone className="h-5 w-5 text-green-700" aria-hidden="true" />
              <div>
                <p className="text-xs text-green-600">Ring</p>
                <p className="font-medium text-green-800">
                  {partner.contact_phone}
                </p>
              </div>
            </a>
            <a
              href={`mailto:${partner.contact_email}`}
              className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Mail className="h-5 w-5 text-green-700" aria-hidden="true" />
              <div>
                <p className="text-xs text-green-600">E-post</p>
                <p className="font-medium text-green-800 truncate">
                  {partner.contact_email}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Days Until Move */}
        {daysUntilMove >= 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Flyttdagen om{' '}
            <span className="font-semibold text-green-700">
              {daysUntilMove} {daysUntilMove === 1 ? 'dag' : 'dagar'}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
