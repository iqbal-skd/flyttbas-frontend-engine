import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import PartnerDashboard from "./pages/partner/PartnerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
              
              {/* Auth & User Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/bli-partner" element={<BliPartner />} />
              <Route path="/mina-offerter" element={<MinaOfferter />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Partner Routes */}
              <Route path="/partner" element={<PartnerDashboard />} />
              
              {/* Legacy routes */}
              <Route path="/om" element={<Index />} />
              <Route path="/juridik" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
