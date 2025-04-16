
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userAgreement, setUserAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!userAgreement) {
      toast.error("You must agree to the terms and conditions");
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      if (onSuccess) onSuccess();
      // Redirect to mining dashboard after successful login
      navigate("/mining");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setResetting(true);
      const { error } = await resetPassword(resetEmail);
      
      if (error) throw error;
      
      toast.success("Password reset instructions sent to your email");
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-sphere-card-dark border-gray-800"
          />
        </div>
        
        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-sphere-card-dark border-gray-800 pr-10"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sphere-green hover:underline text-sm mt-1"
          >
            Forgot password?
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="agreement" 
            checked={userAgreement} 
            onCheckedChange={(checked) => setUserAgreement(checked === true)}
          />
          <label
            htmlFor="agreement"
            className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the <a href="#" className="text-sphere-green hover:underline">Terms of Service</a> and <a href="#" className="text-sphere-green hover:underline">Privacy Policy</a>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !userAgreement}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="bg-sphere-card border-gray-800">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="Your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="bg-sphere-card-dark border-gray-800 mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleResetPassword} 
              disabled={resetting}
              className="w-full"
            >
              {resetting ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
