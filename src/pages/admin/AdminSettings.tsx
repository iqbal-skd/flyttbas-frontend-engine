import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings,
  Percent,
  Save,
  Info,
  Loader2,
  Banknote,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";
import { useCommissionSettings } from "@/hooks/use-commission-settings";
import { COMMISSION, type CommissionType } from "@/lib/constants";

const AdminSettings = () => {
  const { systemRate, systemType, loading, updateSystemSettings } = useCommissionSettings();
  const [saving, setSaving] = useState(false);
  const [tempRate, setTempRate] = useState<string>("");
  const [tempType, setTempType] = useState<CommissionType>("percentage");

  // Sync temp values when systemRate/systemType loads
  useEffect(() => {
    if (!loading) {
      setTempRate(systemRate.toString());
      setTempType(systemType);
    }
  }, [loading, systemRate, systemType]);

  const handleSave = async () => {
    const rate = parseFloat(tempRate);
    if (isNaN(rate)) return;

    setSaving(true);
    await updateSystemSettings(rate, tempType);
    setSaving(false);
  };

  const hasChanges = 
    parseFloat(tempRate) !== systemRate || 
    tempType !== systemType;

  const maxValue = tempType === "fixed" ? COMMISSION.MAX_FIXED : COMMISSION.MAX_RATE;

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
                  Systemprovisionen gäller för alla partners som standard. Du kan sätta en anpassad
                  provision för enskilda partners direkt på partnersidan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Commission Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tempType === "fixed" ? (
                <Banknote className="h-5 w-5" />
              ) : (
                <Percent className="h-5 w-5" />
              )}
              Systemprovision
            </CardTitle>
            <CardDescription>
              Standardprovision som gäller för alla partners om ingen anpassad provision är satt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Commission Type Selection */}
            <div className="space-y-3">
              <Label>Provisionstyp</Label>
              <RadioGroup
                value={tempType}
                onValueChange={(value) => setTempType(value as CommissionType)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="type-percentage" />
                  <Label htmlFor="type-percentage" className="font-normal cursor-pointer">
                    {COMMISSION.TYPE_LABELS.percentage}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="type-fixed" />
                  <Label htmlFor="type-fixed" className="font-normal cursor-pointer">
                    {COMMISSION.TYPE_LABELS.fixed}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rate/Amount Input */}
            <div className="flex items-end gap-4">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="systemRate">
                  {tempType === "fixed" ? "Belopp" : "Provisionssats"}
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="systemRate"
                    type="number"
                    min={COMMISSION.MIN_RATE}
                    max={maxValue}
                    step={tempType === "fixed" ? "1" : "0.1"}
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-32"
                  />
                  <span className="text-muted-foreground text-lg">
                    {tempType === "fixed" ? "SEK" : "%"}
                  </span>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
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
                Nuvarande systemprovision:{" "}
                <strong className="text-foreground">
                  {systemRate}{systemType === "fixed" ? " SEK" : "%"}
                </strong>
                {" "}({COMMISSION.TYPE_LABELS[systemType]})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {systemType === "fixed" 
                  ? "Fast belopp per godkänd offert."
                  : "Provisionen beräknas på ordervärdet före RUT-avdrag."}
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
                <strong>Procentprovision:</strong>{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                  ordervärde × provisionssats / 100
                </code>
              </li>
              <li>
                <strong>Fast belopp:</strong> Det fasta beloppet används oavsett ordervärde
              </li>
              <li>Om partnern har en anpassad provision (sats och/eller typ) används den, annars systemstandarden</li>
              <li>Procentberäkning baseras på priset före RUT-avdrag</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
