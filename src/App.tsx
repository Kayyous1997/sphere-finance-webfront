
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { miningService } from "@/services/miningService";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MiningPage from "./pages/MiningPage";
import WalletConnect from "./pages/WalletConnect";
import ProfilePage from "./pages/ProfilePage";
import ContentPage from "./pages/ContentPage";

const queryClient = new QueryClient();

// Component to handle referral codes from URL
const ReferralHandler = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReferral = async () => {
      // Check for referral code in URL
      const searchParams = new URLSearchParams(location.search);
      const referralCode = searchParams.get('ref');
      
      if (referralCode && user) {
        // Apply referral code and remove from URL
        await miningService.applyReferralCode(user.id, referralCode);
        
        // Clear the referral code from URL
        navigate(location.pathname, { replace: true });
      }
    };
    
    handleReferral();
  }, [location, user, navigate]);

  return null;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mining" element={<MiningPage />} />
      <Route path="/connect" element={<WalletConnect />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/content" element={<ContentPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="sphere-theme-preference">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ReferralHandler />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
