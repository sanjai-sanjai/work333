import { AppLayout } from "@/components/navigation";
import { GameBadge } from "@/components/ui/game-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskDetailModal } from "@/components/teacher/TaskDetailModal";
import { RejectionReasonModal } from "@/components/teacher/RejectionReasonModal";
import {
  Check,
  X,
  Image,
  ChevronRight,
  Clock,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Task {
  id: string;
  student: string;
  avatar: string;
  task: string;
  type: "village" | "academic" | "skill";
  submittedAt: string;
  coins: number;
  hasPhoto: boolean;
  hasAudio: boolean;
}

const pendingTasks: Task[] = [
  {
    id: "1",
    student: "Priya Sharma",
    avatar: "PS",
    task: "Check home electrical safety",
    type: "village",
    submittedAt: "10 min ago",
    coins: 50,
    hasPhoto: true,
    hasAudio: true,
  },
  {
    id: "2",
    student: "Amit Kumar",
    avatar: "AK",
    task: "Create family monthly budget",
    type: "skill",
    submittedAt: "1 hour ago",
    coins: 40,
    hasPhoto: true,
    hasAudio: false,
  },
  {
    id: "3",
    student: "Ravi Patel",
    avatar: "RP",
    task: "Physics Chapter 5 Quiz",
    type: "academic",
    submittedAt: "2 hours ago",
    coins: 30,
    hasPhoto: false,
    hasAudio: false,
  },
  {
    id: "4",
    student: "Meera Singh",
    avatar: "MS",
    task: "Help with water conservation",
    type: "village",
    submittedAt: "3 hours ago",
    coins: 60,
    hasPhoto: true,
    hasAudio: true,
  },
];

const reviewedTasks = [
  { id: "5", student: "Sunita Devi", task: "Chemistry Lab Report", status: "approved", reviewedAt: "1 day ago" },
  { id: "6", student: "Vikram Rao", task: "Village cleanup participation", status: "approved", reviewedAt: "1 day ago" },
  { id: "7", student: "Neha Gupta", task: "Math practice problems", status: "rejected", reviewedAt: "2 days ago" },
];

export default function TeacherTaskVerificationPage() {
  const [tasks, setTasks] = useState(pendingTasks);

  const handleApprove = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleReject = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "village":
        return "secondary";
      case "academic":
        return "primary";
      case "skill":
        return "accent";
      default:
        return "outline";
    }
  };

  return (
    <AppLayout role="teacher" title="Task Verification">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="font-heading text-2xl font-bold">Task Verification</h2>
          <p className="text-muted-foreground">Review student submissions</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border-2 border-accent/30 bg-accent/10 p-3 text-center">
            <p className="font-heading text-2xl font-bold text-accent">{tasks.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="font-heading text-2xl font-bold text-secondary">24</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="font-heading text-2xl font-bold text-destructive">3</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="slide-up" style={{ animationDelay: "150ms" }}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="pending" className="flex-1">
              Pending ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex-1">
              Reviewed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary text-sm">
                      {task.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{task.student}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.submittedAt}
                      </p>
                    </div>
                  </div>
                  <GameBadge variant={getTypeColor(task.type)} size="sm">
                    {task.type}
                  </GameBadge>
                </div>

                {/* Task Info */}
                <div className="mb-3">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-accent">+{task.coins} PlayCoins</p>
                </div>

                {/* Attachments */}
                <div className="mb-4 flex gap-2">
                  {task.hasPhoto && (
                    <Button variant="outline" size="sm" className="gap-1">
                      <Image className="h-4 w-4" />
                      View Photo
                    </Button>
                  )}
                  {task.hasAudio && (
                    <Button variant="outline" size="sm" className="gap-1">
                      <Mic className="h-4 w-4" />
                      Play Audio
                    </Button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleReject(task.id)}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="flex-1 gap-1 bg-secondary hover:bg-secondary/90"
                    onClick={() => handleApprove(task.id)}
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <Check className="mx-auto mb-2 h-12 w-12 text-secondary" />
                <p className="font-heading font-semibold">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending tasks to review
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-3">
            {reviewedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
              >
                <div>
                  <p className="font-medium">{task.student}</p>
                  <p className="text-sm text-muted-foreground">{task.task}</p>
                </div>
                <div className="flex items-center gap-2">
                  <GameBadge
                    variant={task.status === "approved" ? "secondary" : "accent"}
                    size="sm"
                  >
                    {task.status}
                  </GameBadge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
