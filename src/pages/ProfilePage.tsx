
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Coins, Award, TrendingUp, 
  Wallet, Clock, Settings, Shield 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  username: string | null;
  wallet_address: string | null;
  mining_rewards: number | null;
  total_shares: number | null;
  hashrate: number | null;
  created_at: string;
}

interface MiningSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  rewards_earned: number;
  shares_accepted: number;
  status: 'active' | 'completed' | 'terminated';
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<MiningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/");
      return;
    }

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
        // Fetch recent mining sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from("mining_sessions")
          .select("id, started_at, ended_at, rewards_earned, shares_accepted, status")
          .eq("user_id", user.id)
          .order("started_at", { ascending: false })
          .limit(5);

        if (sessionsError) throw sessionsError;

        setProfile(profileData as UserProfile);
        setSessions(sessionsData as MiningSession[]);
      } catch (error: any) {
        toast({
          title: "Error fetching profile data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, toast]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // If user is not loaded or loading data, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-xl">Loading profile data...</div>
      </div>
    );
  }

  // Fallback wallet address display
  const displayWalletAddress = profile?.wallet_address 
    ? `${profile.wallet_address.substring(0, 6)}...${profile.wallet_address.substring(profile.wallet_address.length - 4)}`
    : "Not connected";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-400">View and manage your earnings and account details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-sphere-card-dark border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4 bg-sphere-green text-black">
                <AvatarFallback className="text-3xl">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">
                {profile?.username || user?.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-gray-400 mt-1">{user?.email}</p>
              
              <div className="flex items-center mt-2 text-gray-400 text-sm">
                <Clock className="h-4 w-4 mr-1" /> 
                Joined {profile ? formatDate(profile.created_at) : "Recently"}
              </div>
            </div>

            <Separator className="my-4 bg-gray-800" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-400" />
                  <span>Username</span>
                </div>
                <span className="font-medium">
                  {profile?.username || user?.email?.split("@")[0] || "Not set"}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-green-500" />
                  <span>Wallet</span>
                </div>
                <span className="font-medium">{displayWalletAddress}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  <span>Account Type</span>
                </div>
                <span className="font-medium">Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <Card className="md:col-span-2 bg-sphere-card-dark border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mining Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <Coins className="h-5 w-5 mr-2 text-sphere-green" />
                  <h3 className="text-sm font-medium text-gray-400">Total Rewards</h3>
                </div>
                <p className="text-2xl font-bold">{profile?.mining_rewards?.toFixed(4) || "0.0000"}</p>
                <p className="text-xs text-gray-500 mt-1">SPHERE tokens</p>
              </div>
              
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-400">Total Shares</h3>
                </div>
                <p className="text-2xl font-bold">{profile?.total_shares || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Accepted shares</p>
              </div>
              
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-400">Current Hashrate</h3>
                </div>
                <p className="text-2xl font-bold">{profile?.hashrate?.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-500 mt-1">MH/s</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Recent Mining Sessions</h3>
            
            {sessions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Rewards</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => {
                      // Calculate duration
                      const startDate = new Date(session.started_at);
                      const endDate = session.ended_at ? new Date(session.ended_at) : new Date();
                      const durationMs = endDate.getTime() - startDate.getTime();
                      const hours = Math.floor(durationMs / (1000 * 60 * 60));
                      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                      
                      return (
                        <TableRow key={session.id}>
                          <TableCell>{formatDate(session.started_at)}</TableCell>
                          <TableCell>{`${hours}h ${minutes}m`}</TableCell>
                          <TableCell>{session.shares_accepted}</TableCell>
                          <TableCell>{session.rewards_earned.toFixed(4)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              session.status === 'active' 
                                ? 'bg-green-900/30 text-green-400' 
                                : session.status === 'completed'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-sphere-darker rounded-xl border border-gray-800">
                <p className="text-gray-400">No mining sessions found</p>
                <p className="text-sm text-gray-500 mt-2">Start mining to earn rewards</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
