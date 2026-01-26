import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ScrollText,
  Search,
  X,
  Filter,
  Calendar,
  User,
  Building2,
  FileText,
  Send,
  Star,
  DollarSign,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";

interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  old_data: unknown;
  new_data: unknown;
  ip_address: string | null;
  created_at: string;
}

const ACTION_LABELS: Record<string, string> = {
  INSERT: "Skapad",
  UPDATE: "Uppdaterad",
  DELETE: "Raderad",
  LOGIN: "Inloggning",
  LOGOUT: "Utloggning",
  STATUS_CHANGE: "Statusändring",
  APPROVAL: "Godkännande",
  REJECTION: "Avslag",
};

const ENTITY_ICONS: Record<string, React.ElementType> = {
  partners: Building2,
  quote_requests: FileText,
  offers: Send,
  reviews: Star,
  commission_fees: DollarSign,
  profiles: User,
};

const ENTITY_LABELS: Record<string, string> = {
  partners: "Partner",
  quote_requests: "Förfrågan",
  offers: "Offert",
  reviews: "Omdöme",
  commission_fees: "Provision",
  profiles: "Profil",
};

const AdminAudit = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const pageSize = 50;

  const fetchLogs = useCallback(async () => {
    try {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (entityFilter !== "all") {
        query = query.eq("entity_type", entityFilter);
      }

      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setLogs(data || []);
      setHasMore((data || []).length === pageSize);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, entityFilter, actionFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.entity_type.toLowerCase().includes(query) ||
      log.entity_id?.toLowerCase().includes(query) ||
      log.user_id?.toLowerCase().includes(query)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "INSERT":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "LOGIN":
      case "LOGOUT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openLogDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setSheetOpen(true);
  };

  const renderDataDiff = (oldData: unknown, newData: unknown) => {
    const oldObj = (oldData && typeof oldData === 'object' ? oldData : {}) as Record<string, unknown>;
    const newObj = (newData && typeof newData === 'object' ? newData : {}) as Record<string, unknown>;
    if (!Object.keys(oldObj).length && !Object.keys(newObj).length) return null;

    const allKeys = new Set([
      ...Object.keys(oldObj),
      ...Object.keys(newObj),
    ]);

    const changes: { key: string; old: unknown; new: unknown }[] = [];
    allKeys.forEach(key => {
      const oldVal = oldObj[key];
      const newVal = newObj[key];
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes.push({ key, old: oldVal, new: newVal });
      }
    });

    if (changes.length === 0) return null;

    return (
      <div className="space-y-2">
        {changes.map(change => (
          <div key={change.key} className="p-2 bg-muted/50 rounded text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">
              {change.key}
            </p>
            <div className="flex items-center gap-2">
              {change.old !== undefined && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs line-through">
                  {typeof change.old === "object" ? JSON.stringify(change.old) : String(change.old || "-")}
                </span>
              )}
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              {change.new !== undefined && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  {typeof change.new === "object" ? JSON.stringify(change.new) : String(change.new || "-")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Aktivitetslogg">
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök i loggar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alla typer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla typer</SelectItem>
                <SelectItem value="partners">Partners</SelectItem>
                <SelectItem value="quote_requests">Förfrågningar</SelectItem>
                <SelectItem value="offers">Offerter</SelectItem>
                <SelectItem value="reviews">Omdömen</SelectItem>
                <SelectItem value="commission_fees">Provisioner</SelectItem>
                <SelectItem value="profiles">Profiler</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(0); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Alla åtgärder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla åtgärder</SelectItem>
                <SelectItem value="INSERT">Skapade</SelectItem>
                <SelectItem value="UPDATE">Uppdaterade</SelectItem>
                <SelectItem value="DELETE">Raderade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Aktivitetslogg
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner fullScreen={false} />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {logs.length === 0 ? "Ingen aktivitet loggad" : "Inga loggar matchar sökningen"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {filteredLogs.map((log) => {
                  const Icon = ENTITY_ICONS[log.entity_type] || FileText;
                  return (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => openLogDetail(log)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getActionBadgeColor(log.action)}>
                                {ACTION_LABELS[log.action.toUpperCase()] || log.action}
                              </Badge>
                              <span className="text-sm font-medium">
                                {ENTITY_LABELS[log.entity_type] || log.entity_type}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(log.created_at)}
                              </span>
                              {log.entity_id && (
                                <span className="font-mono">
                                  ID: {log.entity_id.slice(0, 8)}...
                                </span>
                              )}
                              {log.user_id && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {log.user_id.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Föregående
                </Button>
                <span className="text-sm text-muted-foreground">
                  Sida {page + 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!hasMore}
                >
                  Nästa
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Loggdetaljer</SheetTitle>
            <SheetDescription>
              Fullständig information om händelsen
            </SheetDescription>
          </SheetHeader>

          {selectedLog && (
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getActionBadgeColor(selectedLog.action)}>
                    {ACTION_LABELS[selectedLog.action.toUpperCase()] || selectedLog.action}
                  </Badge>
                  <span className="font-medium">
                    {ENTITY_LABELS[selectedLog.entity_type] || selectedLog.entity_type}
                  </span>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tidpunkt:</span>
                    <span>{formatDate(selectedLog.created_at)}</span>
                  </div>

                  {selectedLog.entity_id && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">Entitet ID:</span>
                      <span className="font-mono text-xs break-all">{selectedLog.entity_id}</span>
                    </div>
                  )}

                  {selectedLog.user_id && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">Användare ID:</span>
                      <span className="font-mono text-xs break-all">{selectedLog.user_id}</span>
                    </div>
                  )}

                  {selectedLog.ip_address && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">IP-adress:</span>
                      <span className="font-mono">{selectedLog.ip_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Changes */}
              {(selectedLog.old_data || selectedLog.new_data) && (
                <div>
                  <h4 className="font-semibold mb-3">Dataändringar</h4>
                  {renderDataDiff(selectedLog.old_data, selectedLog.new_data)}
                </div>
              )}

              {/* Raw Data */}
              <div>
                <h4 className="font-semibold mb-3">Rådata</h4>
                <div className="space-y-3">
                  {selectedLog.old_data && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Före:</p>
                      <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(selectedLog.old_data, null, 2)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.new_data && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Efter:</p>
                      <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                        {JSON.stringify(selectedLog.new_data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default AdminAudit;
