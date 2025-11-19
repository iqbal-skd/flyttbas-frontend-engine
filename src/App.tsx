import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
          {/* Placeholder routes - to be implemented */}
          <Route path="/privatflytt" element={<Index />} />
          <Route path="/kontorsflytt" element={<Index />} />
          <Route path="/priser" element={<Index />} />
          <Route path="/kontakt" element={<Index />} />
          <Route path="/case" element={<Index />} />
          <Route path="/faq" element={<Index />} />
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
