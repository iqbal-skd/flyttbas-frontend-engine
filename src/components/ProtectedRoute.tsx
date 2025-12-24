import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldX } from 'lucide-react';

type RequiredRole = 'admin' | 'partner' | 'customer';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: RequiredRole;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { user, loading, roles, isAdmin, isPartner } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role access
  if (requiredRole && user) {
    let hasAccess = false;

    switch (requiredRole) {
      case 'admin':
        hasAccess = isAdmin;
        break;
      case 'partner':
        hasAccess = isPartner || isAdmin; // Admins can access partner pages
        break;
      case 'customer':
        hasAccess = roles.includes('customer') || isAdmin; // Admins can access customer pages
        break;
    }

    if (!hasAccess) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Åtkomst nekad
            </h1>
            <p className="text-muted-foreground mb-6">
              Du har inte behörighet att visa denna sida. Kontakta support om du tror att detta är ett fel.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Gå till startsidan
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
