import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  Shield,
  Building2,
  User,
  Mail,
  Calendar,
  Search,
  X,
  Crown,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { LoadingSpinner } from "@/components/dashboard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
  partner_name?: string;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  partner: "Partner",
  customer: "Kund",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  partner: "bg-blue-100 text-blue-800",
  customer: "bg-gray-100 text-gray-800",
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  admin: Crown,
  partner: Building2,
  customer: User,
};

const AdminUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Add user dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<string>("admin");
  const [addingUser, setAddingUser] = useState(false);

  // Remove role dialog
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{ userId: string; email: string; role: string } | null>(null);
  const [removingRole, setRemovingRole] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Fetch partners for partner names
      const { data: partners, error: partnersError } = await supabase
        .from("partners")
        .select("user_id, company_name");

      if (partnersError) throw partnersError;

      // Create a map of user_id to roles
      const rolesMap: Record<string, string[]> = {};
      roles?.forEach((r) => {
        if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
        rolesMap[r.user_id].push(r.role);
      });

      // Create a map of user_id to partner name
      const partnerMap: Record<string, string> = {};
      partners?.forEach((p) => {
        partnerMap[p.user_id] = p.company_name;
      });

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        id: profile.user_id,
        email: profile.email,
        full_name: profile.full_name,
        created_at: profile.created_at,
        roles: rolesMap[profile.user_id] || ["customer"],
        partner_name: partnerMap[profile.user_id],
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte hämta användare.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.partner_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roles.includes(roleFilter);

    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
    if (!newUserEmail) return;

    setAddingUser(true);
    try {
      // Use the promote_to_admin or promote_to_partner function
      if (newUserRole === "admin") {
        const { error } = await supabase.rpc("promote_to_admin", {
          target_email: newUserEmail,
        });
        if (error) throw error;
      } else if (newUserRole === "partner") {
        const { error } = await supabase.rpc("promote_to_partner", {
          target_email: newUserEmail,
        });
        if (error) throw error;
      }

      toast({
        title: "Användare uppdaterad",
        description: `${newUserEmail} har nu rollen ${ROLE_LABELS[newUserRole]}.`,
      });
      setAddDialogOpen(false);
      setNewUserEmail("");
      setNewUserRole("admin");
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte lägga till rollen.",
      });
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveRole = async () => {
    if (!userToRemove) return;

    setRemovingRole(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userToRemove.userId)
        .eq("role", userToRemove.role);

      if (error) throw error;

      toast({
        title: "Roll borttagen",
        description: `${ROLE_LABELS[userToRemove.role]}-rollen har tagits bort från ${userToRemove.email}.`,
      });
      setRemoveDialogOpen(false);
      setUserToRemove(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error removing role:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: error.message || "Kunde inte ta bort rollen.",
      });
    } finally {
      setRemovingRole(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Count by role
  const adminCount = users.filter((u) => u.roles.includes("admin")).length;
  const partnerCount = users.filter((u) => u.roles.includes("partner")).length;
  const customerCount = users.filter((u) => !u.roles.includes("admin") && !u.roles.includes("partner")).length;

  return (
    <AdminLayout title="Användare">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">Totalt användare</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Crown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{adminCount}</p>
                <p className="text-xs text-muted-foreground">Administratörer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{partnerCount}</p>
                <p className="text-xs text-muted-foreground">Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customerCount}</p>
                <p className="text-xs text-muted-foreground">Kunder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions & Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök på e-post, namn eller företag..."
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

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alla roller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla roller</SelectItem>
                <SelectItem value="admin">Administratörer</SelectItem>
                <SelectItem value="partner">Partners</SelectItem>
                <SelectItem value="customer">Kunder</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Lägg till roll
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till användarroll</DialogTitle>
                  <DialogDescription>
                    Tilldela en roll till en befintlig användare via deras e-postadress.
                    Användaren måste redan ha ett konto i systemet.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="email">E-postadress</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="användare@exempel.se"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Roll</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-red-600" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="partner">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-600" />
                            Partner
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={handleAddUser} disabled={!newUserEmail || addingUser}>
                    {addingUser ? "Lägger till..." : "Lägg till roll"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Användare
          </CardTitle>
          <CardDescription>
            Hantera användarroller och behörigheter
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner fullScreen={false} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {users.length === 0
                  ? "Inga användare hittades"
                  : "Inga användare matchar sökningen"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{user.full_name || user.email}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">Du</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.partner_name && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-3 w-3" />
                            {user.partner_name}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3" />
                          Registrerad {formatDate(user.created_at)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {user.roles.map((role) => {
                          const RoleIcon = ROLE_ICONS[role] || User;
                          return (
                            <div key={role} className="flex items-center gap-1">
                              <Badge className={ROLE_COLORS[role]}>
                                <RoleIcon className="h-3 w-3 mr-1" />
                                {ROLE_LABELS[role]}
                              </Badge>
                              {role !== "customer" && !isCurrentUser && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setUserToRemove({
                                      userId: user.id,
                                      email: user.email,
                                      role,
                                    });
                                    setRemoveDialogOpen(true);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remove Role Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Ta bort roll
            </AlertDialogTitle>
            <AlertDialogDescription>
              Är du säker på att du vill ta bort{" "}
              <strong>{userToRemove && ROLE_LABELS[userToRemove.role]}</strong>-rollen
              från <strong>{userToRemove?.email}</strong>?
              <br /><br />
              Användaren kommer förlora alla behörigheter kopplade till denna roll.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToRemove(null)}>
              Avbryt
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveRole}
              className="bg-red-600 hover:bg-red-700"
              disabled={removingRole}
            >
              {removingRole ? "Tar bort..." : "Ta bort roll"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
