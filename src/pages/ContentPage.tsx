
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, CalendarCheck, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Task, taskService } from "@/services/taskService";
import TaskList from "@/components/tasks/TaskList";
import SocialShare from "@/components/tasks/SocialShare";
import RewardsCard from "@/components/tasks/RewardsCard";

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
        const [daily, weekly, social, userCompleted] = await Promise.all([
          taskService.getTasksByType('daily'),
          taskService.getTasksByType('weekly'),
          taskService.getTasksByType('social'),
          taskService.getUserCompletedTasks(user.id)
        ]);
        
        setDailyTasks(daily);
        setWeeklyTasks(weekly);
        setSocialTasks(social);
        
        // Mark completed tasks
        const completedIds = new Set(userCompleted.map(ut => ut.task_id));
        setCompletedTaskIds(completedIds);
        
        // Get user points
        const points = await taskService.getUserPoints(user.id);
        setUserPoints(points);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [user]);

  const handleTaskCompletion = async (taskId: string) => {
    if (!user) {
      toast.error("Please login to complete tasks");
      return;
    }
    
    const success = await taskService.completeTask(user.id, taskId);
    if (success) {
      setCompletedTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });
      
      const points = await taskService.getUserPoints(user.id);
      setUserPoints(points);
    }
  };

  const handleClaimRewards = async () => {
    if (!user) {
      toast.error("Please login to claim rewards");
      return;
    }
    
    setClaimingRewards(true);
    await taskService.claimRewards(user.id);
    setClaimingRewards(false);
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
            <TaskList 
              tasks={dailyTasks} 
              completedTaskIds={completedTaskIds}
              onTaskComplete={handleTaskCompletion}
            />
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
            <TaskList 
              tasks={weeklyTasks} 
              completedTaskIds={completedTaskIds}
              onTaskComplete={handleTaskCompletion}
            />
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
          <TaskList 
            tasks={socialTasks} 
            completedTaskIds={completedTaskIds}
            onTaskComplete={handleTaskCompletion}
          />
          <SocialShare />
        </CardContent>
      </Card>
      
      {/* Rewards */}
      <RewardsCard 
        userPoints={userPoints}
        claimingRewards={claimingRewards}
        onClaimRewards={handleClaimRewards}
      />
    </div>
  );
};

export default ContentPage;
