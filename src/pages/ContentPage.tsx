
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  CalendarCheck, 
  Share2, 
  Instagram, 
  Twitter,
  Facebook, 
  Youtube,
  Check,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Task, UserTask, taskService } from "@/services/taskService";

const ContentPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([]);
  const [socialTasks, setSocialTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [userPoints, setUserPoints] = useState(0);
  const [claimingRewards, setClaimingRewards] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to access tasks");
      return;
    }
    
    const loadTasks = async () => {
      try {
        setLoading(true);
        
        // Load all tasks
        const [daily, weekly, social, userCompleted] = await Promise.all([
          taskService.getTasksByType('daily'),
          taskService.getTasksByType('weekly'),
          taskService.getTasksByType('social'),
          taskService.getUserCompletedTasks(user.id),
          taskService.getUserPoints(user.id).then(setUserPoints)
        ]);
        
        setDailyTasks(daily);
        setWeeklyTasks(weekly);
        setSocialTasks(social);
        
        // Mark completed tasks
        const completedIds = new Set(userCompleted.map(ut => ut.task_id));
        setCompletedTaskIds(completedIds);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [user]);

  const toggleTaskCompletion = async (taskId: string) => {
    if (!user) {
      toast.error("Please login to complete tasks");
      return;
    }
    
    // If task is already completed, do nothing
    if (completedTaskIds.has(taskId)) {
      return;
    }
    
    const success = await taskService.completeTask(user.id, taskId);
    if (success) {
      // Update local state
      setCompletedTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });
      
      // Update points
      const points = await taskService.getUserPoints(user.id);
      setUserPoints(points);
    }
  };

  const claimRewards = async () => {
    if (!user) {
      toast.error("Please login to claim rewards");
      return;
    }
    
    setClaimingRewards(true);
    await taskService.claimRewards(user.id);
    setClaimingRewards(false);
  };

  const shareSocial = (platform: string) => {
    toast.success(`Opening ${platform} share dialog...`);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tasks & Activities</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Tasks */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-sphere-green p-2 rounded-md">
                <CalendarDays className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-2xl font-bold">Daily Tasks</h2>
            </div>
            
            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 bg-sphere-card-dark p-3 rounded-md">
                  <Checkbox 
                    id={task.id} 
                    checked={completedTaskIds.has(task.id)}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className={completedTaskIds.has(task.id) ? "bg-sphere-green border-sphere-green" : ""}
                    disabled={completedTaskIds.has(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      completedTaskIds.has(task.id) ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="ml-auto bg-sphere-green bg-opacity-20 text-sphere-green text-xs px-2 py-1 rounded-full">
                    +{task.points} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Tasks */}
        <Card className="card-gradient">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-sphere-green p-2 rounded-md">
                <CalendarCheck className="h-5 w-5 text-black" />
              </div>
              <h2 className="text-2xl font-bold">Weekly Tasks</h2>
            </div>
            
            <div className="space-y-4">
              {weeklyTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 bg-sphere-card-dark p-3 rounded-md">
                  <Checkbox 
                    id={task.id} 
                    checked={completedTaskIds.has(task.id)}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className={completedTaskIds.has(task.id) ? "bg-sphere-green border-sphere-green" : ""}
                    disabled={completedTaskIds.has(task.id)}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      completedTaskIds.has(task.id) ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    {task.title}
                  </label>
                  <div className="ml-auto bg-sphere-green bg-opacity-20 text-sphere-green text-xs px-2 py-1 rounded-full">
                    +{task.points} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Social Tasks */}
      <Card className="card-gradient mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-sphere-green p-2 rounded-md">
              <Share2 className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-2xl font-bold">Social Tasks</h2>
          </div>
          
          <div className="space-y-4">
            {socialTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 bg-sphere-card-dark p-3 rounded-md">
                <Checkbox 
                  id={task.id} 
                  checked={completedTaskIds.has(task.id)}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className={completedTaskIds.has(task.id) ? "bg-sphere-green border-sphere-green" : ""}
                  disabled={completedTaskIds.has(task.id)}
                />
                <label
                  htmlFor={task.id}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    completedTaskIds.has(task.id) ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {task.title}
                </label>
                <div className="ml-auto bg-sphere-green bg-opacity-20 text-sphere-green text-xs px-2 py-1 rounded-full">
                  +{task.points} pts
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-sphere-card-dark rounded-md">
            <h3 className="text-lg font-medium mb-4">Share on Social Media</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="bg-[#1DA1F2] bg-opacity-10 border-[#1DA1F2] hover:bg-[#1DA1F2] hover:bg-opacity-20"
                onClick={() => shareSocial('Twitter')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#E4405F] bg-opacity-10 border-[#E4405F] hover:bg-[#E4405F] hover:bg-opacity-20"
                onClick={() => shareSocial('Instagram')}
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#1877F2] bg-opacity-10 border-[#1877F2] hover:bg-[#1877F2] hover:bg-opacity-20"
                onClick={() => shareSocial('Facebook')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#FF0000] bg-opacity-10 border-[#FF0000] hover:bg-[#FF0000] hover:bg-opacity-20"
                onClick={() => shareSocial('YouTube')}
              >
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Claim Rewards */}
      <Card className="card-gradient">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">Your Points: {userPoints}</h2>
              <p className="text-gray-400 text-sm">Complete tasks to earn more points</p>
            </div>
            <Button 
              className="bg-sphere-green text-black hover:bg-green-400"
              onClick={claimRewards}
              disabled={claimingRewards}
            >
              {claimingRewards ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPage;
