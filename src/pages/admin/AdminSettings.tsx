import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Percent,
  Save,
  Info,
  Loader2,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";
import { useCommissionSettings } from "@/hooks/use-commission-settings";
import { COMMISSION } from "@/lib/constants";

const AdminSettings = () => {
  const { systemRate, loading, updateSystemRate } = useCommissionSettings();
  const [saving, setSaving] = useState(false);
  const [tempSystemRate, setTempSystemRate] = useState<string | null>(null);

  // Use tempSystemRate if user is editing, otherwise use systemRate from hook
  const displayRate = tempSystemRate ?? systemRate.toString();

  const handleSaveSystemRate = async () => {
    const rate = parseFloat(displayRate);
    if (isNaN(rate)) return;

    setSaving(true);
    const success = await updateSystemRate(rate);
    if (success) {
      setTempSystemRate(null); // Reset to use hook value
    }
    setSaving(false);
  };

  const hasChanges = tempSystemRate !== null && parseFloat(tempSystemRate) !== systemRate;

  if (loading) {
    return (
      <AdminLayout title="Inställningar">
        <div className="py-12 flex justify-center">
          <LoadingSpinner fullScreen={false} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Inställningar">
      <div className="space-y-6 max-w-2xl">
        {/* Info Banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Om provisionsinställningar</p>
                <p className="text-sm text-blue-700 mt-1">
                  Systemsatsen gäller för alla partners som standard. Du kan sätta en anpassad
                  provisionssats för enskilda partners direkt på partnersidan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Commission Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Systemprovisionssats
            </CardTitle>
            <CardDescription>
              Standardprovisionssats som gäller för alla partners om ingen anpassad sats är satt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="systemRate">Provisionssats</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="systemRate"
                    type="number"
                    min={COMMISSION.MIN_RATE}
                    max={COMMISSION.MAX_RATE}
                    step="0.1"
                    value={displayRate}
                    onChange={(e) => setTempSystemRate(e.target.value)}
                    className="w-28"
                  />
                  <span className="text-muted-foreground text-lg">%</span>
                </div>
              </div>
              <Button onClick={handleSaveSystemRate} disabled={saving || !hasChanges}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? "Sparar..." : "Spara"}
              </Button>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Nuvarande systemsats: <strong className="text-foreground">{systemRate}%</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Provisionen beräknas på ordervärdet före RUT-avdrag.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commission Calculation Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Så fungerar provisionsberäkningen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
              <li>När en offert godkänns av kunden skapas en provisionspost automatiskt</li>
              <li>
                Provisionen beräknas som:{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                  ordervärde × provisionssats / 100
                </code>
              </li>
              <li>Om partnern har en anpassad sats används den, annars systemstandarden</li>
              <li>Beräkningen baseras på priset före RUT-avdrag</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
