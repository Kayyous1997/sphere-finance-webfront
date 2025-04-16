
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import WalletFirstSignUp from "@/components/auth/WalletFirstSignUp";
import LoginForm from "@/components/auth/LoginForm";
import AuthHero from "@/components/auth/AuthHero";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const AuthPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/mining");
    }
    
    // Check URL params for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-sphere-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-3/5 order-2 md:order-1">
            <AuthHero />
          </div>
          
          <div className="w-full md:w-2/5 order-1 md:order-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="bg-sphere-card border-gray-800">
                  <CardContent className="pt-6">
                    <LoginForm onSuccess={() => navigate("/mining")} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup">
                <WalletFirstSignUp />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
