import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Privatflytt from "./pages/Privatflytt";
import Kontorsflytt from "./pages/Kontorsflytt";
import Priser from "./pages/Priser";
import Case from "./pages/Case";
import FAQ from "./pages/FAQ";
import Kontakt from "./pages/Kontakt";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* To be implemented */}
          <Route path="/om" element={<Index />} />
          <Route path="/blogg" element={<Index />} />
          <Route path="/juridik" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
