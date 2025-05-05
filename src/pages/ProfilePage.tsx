
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Coins, Award, TrendingUp, 
  Wallet, Clock, Settings, Shield, UserCircle, RefreshCw,
  Timer, Check, XCircle, Flame
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { miningService } from "@/services/miningService";
import ReferralSystem from "@/components/mining/ReferralSystem";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  username: string | null;
  wallet_address: string | null;
  mining_rewards: number | null;
  total_shares: number | null;
  hashrate: number | null;
  created_at: string;
  referral_code: string | null;
}

interface MiningSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  rewards_earned: number;
  shares_accepted: number;
  shares_rejected: number;
  status: 'active' | 'completed' | 'terminated';
}

interface MiningStats {
  totalHashrate: number;
  totalShares: number;
  totalRewards: number;
  activeSessionId: string | null;
  sessionDuration: string | null;
  efficiency: number;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<MiningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCount, setReferralCount] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [miningStats, setMiningStats] = useState<MiningStats>({
    totalHashrate: 0,
    totalShares: 0,
    totalRewards: 0,
    activeSessionId: null,
    sessionDuration: null,
    efficiency: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/");
      return;
    }

    fetchProfileData();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;
    
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
        .select("id, started_at, ended_at, rewards_earned, shares_accepted, shares_rejected, status")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(5);

      if (sessionsError) throw sessionsError;

      // Get active session if any
      const activeSession = sessionsData?.find(session => session.status === 'active');
      
      // Get total mining stats - combine both offline and online mining data
      const combinedStats = await miningService.getTotalMiningStats(user.id);
      
      // Calculate mining stats including active session data
      let totalMiningStats = {
        totalHashrate: profileData?.hashrate || combinedStats.combinedHashrate || 0,
        totalShares: profileData?.total_shares || combinedStats.combinedShares || 0,
        totalRewards: profileData?.mining_rewards || combinedStats.combinedRewards || 0,
        activeSessionId: activeSession?.id || null,
        sessionDuration: null,
        efficiency: 0
      };

      // Calculate session duration if there's an active session
      if (activeSession) {
        const startDate = new Date(activeSession.started_at);
        const now = new Date();
        const durationMs = now.getTime() - startDate.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        totalMiningStats.sessionDuration = `${hours}h ${minutes}m`;
        
        // Calculate share efficiency (accepted / total shares)
        const totalSessionShares = (activeSession.shares_accepted || 0) + (activeSession.shares_rejected || 0);
        totalMiningStats.efficiency = totalSessionShares > 0 ? 
          (activeSession.shares_accepted / totalSessionShares) * 100 : 0;
      }

      // Fetch referral data
      try {
        const referralData = await miningService.getUserReferrals(user.id);
        setReferralCount(referralData.count || 0);
        setTotalBonus(referralData.totalBonus || 0);
      } catch (referralError) {
        console.error("Error fetching referral data:", referralError);
      }

      setProfile(profileData as UserProfile);
      setSessions(sessionsData as MiningSession[]);
      setMiningStats(totalMiningStats);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProfileData();
    setIsRefreshing(false);
    toast({
      title: "Profile refreshed",
      description: "Your profile data has been updated",
    });
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format number helper with thousands separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // If user is not loaded or loading data, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 md:col-span-2" />
        </div>
      </div>
    );
  }

  // Fallback wallet address display
  const displayWalletAddress = profile?.wallet_address 
    ? `${profile.wallet_address.substring(0, 6)}...${profile.wallet_address.substring(profile.wallet_address.length - 4)}`
    : "Not connected";

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">View and manage your earnings and account details</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 bg-sphere-card-dark border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4 bg-sphere-green text-black">
                {profile?.username ? (
                  <AvatarFallback className="text-3xl">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                ) : (
                  <AvatarFallback className="text-3xl">
                    <UserCircle className="h-16 w-16" />
                  </AvatarFallback>
                )}
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
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-amber-500" />
                  <span>Referral Bonus</span>
                </div>
                <span className="font-medium text-sphere-green">+{totalBonus}%</span>
              </div>
              
              {miningStats.activeSessionId && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-blue-500" />
                    <span>Mining Session</span>
                  </div>
                  <span className="font-medium text-sphere-green">Active ({miningStats.sessionDuration})</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <Card className="md:col-span-2 bg-sphere-card-dark border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mining Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <Coins className="h-5 w-5 mr-2 text-sphere-green" />
                  <h3 className="text-sm font-medium text-gray-400">Total Rewards</h3>
                </div>
                <p className="text-2xl font-bold">{miningStats.totalRewards.toFixed(4) || "0.0000"}</p>
                <p className="text-xs text-gray-500 mt-1">SPHERE tokens</p>
              </div>
              
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-400">Total Shares</h3>
                </div>
                <p className="text-2xl font-bold">{formatNumber(miningStats.totalShares || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Accepted shares</p>
              </div>
              
              <div className="bg-sphere-darker p-4 rounded-xl border border-gray-800">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium text-gray-400">Current Hashrate</h3>
                </div>
                <p className="text-2xl font-bold">{miningStats.totalHashrate.toFixed(2) || "0.00"}</p>
                <p className="text-xs text-gray-500 mt-1">MH/s</p>
              </div>
            </div>

            {miningStats.activeSessionId && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Share Efficiency</h3>
                  <span className="text-xs text-gray-500">{miningStats.efficiency.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={miningStats.efficiency} 
                  className="h-2 bg-gray-700" 
                  indicatorClassName={`${
                    miningStats.efficiency > 90 ? 'bg-sphere-green' :
                    miningStats.efficiency > 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Check className="h-3 w-3 mr-1 text-sphere-green" />
                    Accepted
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                    Rejected
                  </div>
                </div>
              </div>
            )}

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
                          <TableCell>{formatNumber(session.shares_accepted)}</TableCell>
                          <TableCell>{session.rewards_earned.toFixed(4)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs flex items-center w-fit ${
                              session.status === 'active' 
                                ? 'bg-green-900/30 text-green-400' 
                                : session.status === 'completed'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {session.status === 'active' && <Flame className="h-3 w-3 mr-1" />}
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

      {/* Referral System */}
      {user && (
        <div className="mt-6">
          <ReferralSystem 
            userId={user.id} 
            referralCode={profile?.referral_code || ""} 
            referralCount={referralCount}
            totalBonus={totalBonus}
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
