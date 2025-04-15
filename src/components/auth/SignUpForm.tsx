
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const SignUpForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userAgreement, setUserAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isLongEnough = password.length >= 8;
  
  const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
  const doPasswordsMatch = password === confirmPassword;

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
    
    if (!isPasswordValid) {
      toast.error("Password does not meet the requirements");
      return;
    }
    
    if (!doPasswordsMatch) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      await signUp(email, password);
      toast.success("Check your email for the confirmation link!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        
        {password && (
          <div className="mt-2 space-y-1 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className={`flex items-center ${hasUpper ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${hasUpper ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Uppercase letter</span>
              </div>
              <div className={`flex items-center ${hasLower ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${hasLower ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Lowercase letter</span>
              </div>
              <div className={`flex items-center ${hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${hasNumber ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Number</span>
              </div>
              <div className={`flex items-center ${hasSpecial ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${hasSpecial ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Special character</span>
              </div>
              <div className={`flex items-center ${isLongEnough ? 'text-green-500' : 'text-gray-400'}`}>
                <div className={`h-1.5 w-1.5 rounded-full mr-1.5 ${isLongEnough ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>8+ characters</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`bg-sphere-card-dark border-gray-800 pr-10 ${
              confirmPassword && !doPasswordsMatch ? "border-red-500" : ""
            }`}
          />
          <button 
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword && !doPasswordsMatch && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
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
        disabled={loading || !userAgreement || !isPasswordValid || !doPasswordsMatch}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUpForm;
