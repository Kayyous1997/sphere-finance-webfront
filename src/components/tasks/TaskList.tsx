
import { Task } from "@/services/taskService";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskListProps {
  tasks: Task[];
  completedTaskIds: Set<string>;
  onTaskComplete: (taskId: string) => void;
}

const TaskList = ({ tasks, completedTaskIds, onTaskComplete }: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center space-x-3 bg-sphere-card-dark p-3 rounded-md">
          <Checkbox 
            id={task.id} 
            checked={completedTaskIds.has(task.id)}
            onCheckedChange={() => onTaskComplete(task.id)}
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
  );
};

export default TaskList;
