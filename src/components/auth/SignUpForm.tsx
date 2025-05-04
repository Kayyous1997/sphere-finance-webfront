import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";

interface SignUpFormProps {
  onSuccess?: () => void;
  prefilledEmail?: string;
  prefilledWalletAddress?: string;
  walletVerified?: boolean;
}

// Import these types from the AuthContext to prevent duplication
import { SignUpResponseData, SignUpResult } from "@/contexts/AuthContext";

const SignUpForm = ({ 
  onSuccess,
  prefilledEmail = "",
  prefilledWalletAddress = "",
  walletVerified = false
}: SignUpFormProps) => {
  // Use the imported type for signUp
  const { signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [manualReferralCode, setManualReferralCode] = useState("");
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userAgreement, setUserAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Set email if provided
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }

    // Extract referral code from URL
    const searchParams = new URLSearchParams(location.search);
    const ref = searchParams.get('ref');
    if (ref) {
      console.log("Found referral code in URL:", ref);
      setReferralCode(ref);
      setManualReferralCode(ref);
      // Don't navigate away - just store the ref code
    }
  }, [prefilledEmail, location]);

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const isLongEnough = password.length >= 8;
  
  const isPasswordValid = hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough;
  const doPasswordsMatch = password === confirmPassword;

  // Determine which referral code to use (from URL or manually entered)
  const effectiveReferralCode = referralCode || (manualReferralCode.trim() !== "" ? manualReferralCode : null);

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

    // Check if email is already linked to a different wallet
    if (prefilledWalletAddress) {
      try {
        const { data: existingUser, error: userError } = await supabase
          .from('profiles')
          .select('wallet_address')
          .eq('email', email)
          .single();
        
        if (existingUser && existingUser.wallet_address !== prefilledWalletAddress) {
          toast.error("This email is already linked to a different wallet address");
          return;
        }
      } catch (error) {
        // Ignore if user doesn't exist yet
      }
    }
    
    try {
      setLoading(true);
      
      // Breaking the type recursion by using a type assertion
      const response = await signUp(email, password);
      
      if (response.error) throw response.error;
      
      // Process referral if a referral code was provided
      if (effectiveReferralCode && response.data?.user) {
        console.log(`Processing referral code ${effectiveReferralCode} for new user ${response.data.user.id}`);
        
        try {
          const { data: referrerData, error: referrerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', effectiveReferralCode)
            .single();
          
          if (referrerError) {
            console.error("Referrer lookup error:", referrerError);
          } else if (referrerData) {
            console.log("Found referrer:", referrerData.id);
            
            // Add referral record first
            const { data: referralData, error: referralError } = await supabase
              .from('referrals')
              .insert({
                referrer_id: referrerData.id,
                referred_id: response.data.user.id,
                points_awarded: false
              })
              .select();
              
            if (referralError) {
              console.error("Referral creation error:", referralError);
            } else {
              console.log("Referral record created:", referralData);
            }
            
            // Update user profile with referrer
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ referred_by: referrerData.id })
              .eq('id', response.data.user.id);
              
            if (profileError) {
              console.error("Profile update error:", profileError);
            } else {
              console.log("Profile updated with referrer ID");
            }
          }
        } catch (err) {
          console.error("Referral processing error:", err);
        }
      }
      
      // Update wallet info if provided
      if (response.data?.user && prefilledWalletAddress) {
        await supabase
          .from('profiles')
          .update({ 
            wallet_address: prefilledWalletAddress,
            wallet_verified: walletVerified 
          })
          .eq('id', response.data.user.id);
      }
      
      toast.success("Check your email for the confirmation link!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(String(error));
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
          disabled={!!prefilledEmail}
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
      
      {/* Add referral code input */}
      <div>
        <Label htmlFor="referralCode">Referral Code (Optional)</Label>
        <Input
          id="referralCode"
          type="text"
          placeholder="Enter referral code"
          value={manualReferralCode}
          onChange={(e) => setManualReferralCode(e.target.value)}
          className="bg-sphere-card-dark border-gray-800"
        />
        {referralCode && (
          <p className="text-green-500 text-xs mt-1">Referral code from URL applied: {referralCode}</p>
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
