
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
  Check
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  points: number;
}

const ContentPage = () => {
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    { id: "daily-1", title: "Complete 1 hour of mining", completed: false, points: 5 },
    { id: "daily-2", title: "Check in to the app", completed: false, points: 2 },
    { id: "daily-3", title: "Visit the learn section", completed: false, points: 3 },
    { id: "daily-4", title: "Read one article", completed: false, points: 4 },
    { id: "daily-5", title: "View your mining stats", completed: false, points: 1 }
  ]);

  const [weeklyTasks, setWeeklyTasks] = useState<Task[]>([
    { id: "weekly-1", title: "Complete all daily tasks for 5 days", completed: false, points: 15 },
    { id: "weekly-2", title: "Refer a friend", completed: false, points: 25 },
    { id: "weekly-3", title: "Mine for at least 10 hours total", completed: false, points: 20 },
    { id: "weekly-4", title: "Participate in a community discussion", completed: false, points: 10 }
  ]);

  const [socialTasks, setSocialTasks] = useState<Task[]>([
    { id: "social-1", title: "Share your mining progress on Twitter", completed: false, points: 8 },
    { id: "social-2", title: "Follow our official Instagram", completed: false, points: 5 },
    { id: "social-3", title: "Join our Discord community", completed: false, points: 7 },
    { id: "social-4", title: "Subscribe to our YouTube channel", completed: false, points: 6 }
  ]);

  const toggleTaskCompletion = (taskId: string, taskType: 'daily' | 'weekly' | 'social') => {
    let updater: Function;
    let tasks: Task[];

    if (taskType === 'daily') {
      updater = setDailyTasks;
      tasks = [...dailyTasks];
    } else if (taskType === 'weekly') {
      updater = setWeeklyTasks;
      tasks = [...weeklyTasks];
    } else {
      updater = setSocialTasks;
      tasks = [...socialTasks];
    }

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      const newCompletedState = !tasks[taskIndex].completed;
      tasks[taskIndex] = { ...tasks[taskIndex], completed: newCompletedState };
      updater(tasks);

      if (newCompletedState) {
        toast.success(`Task completed! +${tasks[taskIndex].points} points`);
      }
    }
  };

  const claimRewards = () => {
    const totalPoints = [
      ...dailyTasks.filter(t => t.completed), 
      ...weeklyTasks.filter(t => t.completed), 
      ...socialTasks.filter(t => t.completed)
    ].reduce((sum, task) => sum + task.points, 0);
    
    if (totalPoints > 0) {
      toast.success(`Claimed ${totalPoints} points!`);
    } else {
      toast.error("No completed tasks to claim rewards from.");
    }
  };

  const shareSocial = (platform: string) => {
    toast.success(`Opening ${platform} share dialog...`);
  };

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
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id, 'daily')}
                    className={task.completed ? "bg-sphere-green border-sphere-green" : ""}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      task.completed ? "line-through text-gray-500" : "text-white"
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
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id, 'weekly')}
                    className={task.completed ? "bg-sphere-green border-sphere-green" : ""}
                  />
                  <label
                    htmlFor={task.id}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                      task.completed ? "line-through text-gray-500" : "text-white"
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
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id, 'social')}
                  className={task.completed ? "bg-sphere-green border-sphere-green" : ""}
                />
                <label
                  htmlFor={task.id}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    task.completed ? "line-through text-gray-500" : "text-white"
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
              <h2 className="text-xl font-bold mb-1">Ready to Claim</h2>
              <p className="text-gray-400 text-sm">Complete tasks to earn rewards</p>
            </div>
            <Button 
              className="bg-sphere-green text-black hover:bg-green-400"
              onClick={claimRewards}
            >
              <Check className="mr-2 h-4 w-4" />
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPage;
