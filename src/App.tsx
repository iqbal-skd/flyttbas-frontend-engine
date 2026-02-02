import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import Index from "./pages/Index";

// Lazy-loaded pages
const Privatflytt = lazy(() => import("./pages/Privatflytt"));
const Kontorsflytt = lazy(() => import("./pages/Kontorsflytt"));
const Priser = lazy(() => import("./pages/Priser"));
const Case = lazy(() => import("./pages/Case"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Kontakt = lazy(() => import("./pages/Kontakt"));
const Blogg = lazy(() => import("./pages/Blogg"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const LocalArea = lazy(() => import("./pages/LocalArea"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const BliPartner = lazy(() => import("./pages/BliPartner"));
const MinaOfferter = lazy(() => import("./pages/MinaOfferter"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const SetupPassword = lazy(() => import("./pages/SetupPassword"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminAudit = lazy(() => import("./pages/admin/AdminAudit"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const PartnerDashboard = lazy(() => import("./pages/partner/PartnerDashboard"));
const AllmannaVillkor = lazy(() => import("./pages/AllmannaVillkor"));
const Integritetspolicy = lazy(() => import("./pages/Integritetspolicy"));
const Cookiepolicy = lazy(() => import("./pages/Cookiepolicy"));
const OmOss = lazy(() => import("./pages/OmOss"));
// Guides
const JamforFlyttfirmor = lazy(() => import("./pages/guider/JamforFlyttfirmor"));
const VadKostarEnFlytt = lazy(() => import("./pages/guider/VadKostarEnFlytt"));
const FastPrisVsTimpris = lazy(() => import("./pages/guider/FastPrisVsTimpris"));
// Checklists
const FlyttChecklista = lazy(() => import("./pages/checklistor/FlyttChecklista"));
const FlyttstadningChecklista = lazy(() => import("./pages/checklistor/FlyttstadningChecklista"));
const KontorsflyttChecklista = lazy(() => import("./pages/checklistor/KontorsflyttChecklista"));
const DodsboChecklista = lazy(() => import("./pages/checklistor/DodsboChecklista"));
const MagasineringChecklista = lazy(() => import("./pages/checklistor/MagasineringChecklista"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <ThirdPartyScripts />
          <PageViewTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privatflytt" element={<Privatflytt />} />
              <Route path="/kontorsflytt" element={<Kontorsflytt />} />
              <Route path="/priser" element={<Priser />} />
              <Route path="/case" element={<Case />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/blogg" element={<Blogg />} />
              <Route path="/blogg/:slug" element={<BlogPost />} />
              <Route path="/flyttfirma/:slug" element={<LocalArea />} />

              {/* Auth & Public Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/setup-password" element={<SetupPassword />} />
              <Route path="/bli-partner" element={<BliPartner />} />

              {/* Customer Routes - require authentication */}
              <Route path="/mina-offerter" element={
                <ProtectedRoute>
                  <MinaOfferter />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOverview />
                </ProtectedRoute>
              } />
              <Route path="/admin/partners" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/quotes" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/offers" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/customers" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCustomers />
                </ProtectedRoute>
              } />
              <Route path="/admin/reviews" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReviews />
                </ProtectedRoute>
              } />
              <Route path="/admin/billing" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOverview />
                </ProtectedRoute>
              } />
              <Route path="/admin/audit" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminAudit />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } />

              {/* Partner Routes */}
              <Route path="/partner" element={
                <ProtectedRoute requiredRole="partner">
                  <PartnerDashboard />
                </ProtectedRoute>
              } />

              {/* Legal */}
              <Route path="/allmanna-villkor" element={<AllmannaVillkor />} />
              <Route path="/integritetspolicy" element={<Integritetspolicy />} />
              <Route path="/cookiepolicy" element={<Cookiepolicy />} />

              {/* About */}
              <Route path="/om-oss" element={<OmOss />} />

              {/* Guides */}
              <Route path="/guider/jamfor-flyttfirmor" element={<JamforFlyttfirmor />} />
              <Route path="/guider/vad-kostar-en-flytt" element={<VadKostarEnFlytt />} />
              <Route path="/guider/fast-pris-vs-timpris" element={<FastPrisVsTimpris />} />

              {/* Checklists */}
              <Route path="/checklistor/flytt-checklista" element={<FlyttChecklista />} />
              <Route path="/checklistor/flyttstadning-checklista" element={<FlyttstadningChecklista />} />
              <Route path="/checklistor/kontorsflytt-checklista" element={<KontorsflyttChecklista />} />
              <Route path="/checklistor/dodsbo-checklista" element={<DodsboChecklista />} />
              <Route path="/checklistor/magasinering-checklista" element={<MagasineringChecklista />} />

              {/* Legacy routes */}
              <Route path="/om" element={<Index />} />
              <Route path="/juridik" element={<AllmannaVillkor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
