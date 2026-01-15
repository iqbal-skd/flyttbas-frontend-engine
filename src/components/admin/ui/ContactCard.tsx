/**
 * ContactCard - Reusable contact information card
 * Displays contact info with copy-to-clipboard functionality
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard, getMailtoUrl, getTelUrl } from "../utils";
import { CONTACT_PREFERENCE_LABELS } from "../constants";

interface ContactCardProps {
  name?: string;
  email?: string;
  phone?: string | null;
  preference?: string | null;
  title?: string;
  showPreference?: boolean;
  showTitle?: boolean;
}

export function ContactCard({
  name,
  email,
  phone,
  preference,
  title = "Kontaktuppgifter",
  showPreference = true,
  showTitle = true,
}: ContactCardProps) {
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({ title: "Kopierad", description: `${label} kopierad till urklipp` });
    }
  };

  // If no contact info at all, don't render
  if (!name && !email && !phone) {
    return null;
  }

  const content = (
    <div className="space-y-2 text-sm">
      {/* Name */}
      {name && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => handleCopy(name, "Namn")}
            aria-label="Kopiera namn"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Email */}
      {email && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={getMailtoUrl(email)}
              className="text-primary hover:underline"
            >
              {email}
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => handleCopy(email, "E-post")}
            aria-label="Kopiera e-post"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a
              href={getTelUrl(phone)}
              className="text-primary hover:underline"
            >
              {phone}
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            onClick={() => handleCopy(phone, "Telefon")}
            aria-label="Kopiera telefon"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Contact Preference */}
      {showPreference && preference && (
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline">
            Föredrar: {CONTACT_PREFERENCE_LABELS[preference] || preference}
          </Badge>
        </div>
      )}
    </div>
  );

  // Return without card wrapper if showTitle is false
  if (!showTitle) {
    return content;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
