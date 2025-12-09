import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AskTheDataChatbot } from "@/components/chatbot/AskTheDataChatbot";
import { DaatEngineProvider } from "@/lib/daat-engine/context";
import Index from "./pages/Index";
import History from "./pages/History";
import Analysis from "./pages/Analysis";
import AnalysisReport from "./pages/AnalysisReport";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DaatEngineProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/analysis" element={<Analysis />} />
                      <Route path="/report" element={<AnalysisReport />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </MainLayout>
                  <AskTheDataChatbot />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </DaatEngineProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
