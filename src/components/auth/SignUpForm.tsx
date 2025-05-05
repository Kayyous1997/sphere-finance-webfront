
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Key, UserCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpResult, useAuth } from "@/contexts/AuthContext";

// Define form schema with validation
const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormSchema = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onSuccess?: () => void;
  referralCode?: string | null;
}

const SignUpForm = ({ onSuccess, referralCode }: SignUpFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (values: FormSchema) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fixed TypeScript error by using the imported SignUpResult type
      const result = await signUp(values.email, values.password);
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data?.user?.id) {
        // Handle referral code if present
        if (referralCode) {
          console.log(`Applying referral code: ${referralCode}`);
          try {
            // Import dynamically to avoid circular dependency
            const { miningService } = await import("@/services/miningService");
            await miningService.applyReferralCode(result.data.user.id, referralCode);
          } catch (referralError) {
            console.error("Error applying referral code:", referralError);
            // Continue with sign up even if referral application fails
          }
        }

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      console.error("Sign up error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-9"
                    placeholder="your.email@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <UserCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-9"
                    placeholder="Choose a username"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-9"
                    placeholder="Create a password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-9"
                    placeholder="Confirm your password"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border dark:border-red-800 border-red-200 rounded-md p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-sphere-green text-black hover:bg-green-400"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
