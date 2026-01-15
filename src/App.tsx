import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageViewTracker } from "@/components/PageViewTracker";
import { RecaptchaProvider } from "@/components/RecaptchaProvider";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import Index from "./pages/Index";
import Privatflytt from "./pages/Privatflytt";
import Kontorsflytt from "./pages/Kontorsflytt";
import Priser from "./pages/Priser";
import Case from "./pages/Case";
import FAQ from "./pages/FAQ";
import Kontakt from "./pages/Kontakt";
import Blogg from "./pages/Blogg";
import BlogPost from "./pages/BlogPost";
import LocalArea from "./pages/LocalArea";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import BliPartner from "./pages/BliPartner";
import MinaOfferter from "./pages/MinaOfferter";
import CustomerDashboard from "./pages/CustomerDashboard";
import SetupPassword from "./pages/SetupPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import AllmannaVillkor from "./pages/AllmannaVillkor";
import Integritetspolicy from "./pages/Integritetspolicy";
import Cookiepolicy from "./pages/Cookiepolicy";
import OmOss from "./pages/OmOss";
// Guides
import JamforFlyttfirmor from "./pages/guider/JamforFlyttfirmor";
import VadKostarEnFlytt from "./pages/guider/VadKostarEnFlytt";
import FastPrisVsTimpris from "./pages/guider/FastPrisVsTimpris";
// Checklists
import FlyttChecklista from "./pages/checklistor/FlyttChecklista";
import FlyttstadningChecklista from "./pages/checklistor/FlyttstadningChecklista";
import KontorsflyttChecklista from "./pages/checklistor/KontorsflyttChecklista";
import DodsboChecklista from "./pages/checklistor/DodsboChecklista";
import MagasineringChecklista from "./pages/checklistor/MagasineringChecklista";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <RecaptchaProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <ThirdPartyScripts />
            <PageViewTracker />
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </RecaptchaProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
