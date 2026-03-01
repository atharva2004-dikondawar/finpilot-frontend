import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Financials from "./pages/Financials";
import StrategySimulator from "./pages/StrategySimulator";
import StrategyOptimizer from "./pages/StrategyOptimizer";
import RiskIntelligence from "./pages/RiskIntelligence";
import ExecutiveReport from "./pages/ExecutiveReport";
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
          <Route path="/financials" element={<Financials />} />
          <Route path="/simulator" element={<StrategySimulator />} />
          <Route path="/optimizer" element={<StrategyOptimizer />} />
          <Route path="/risk" element={<RiskIntelligence />} />
          <Route path="/report" element={<ExecutiveReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
