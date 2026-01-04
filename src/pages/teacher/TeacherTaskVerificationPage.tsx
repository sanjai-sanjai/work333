import { AppLayout } from "@/components/navigation";
import { GameBadge } from "@/components/ui/game-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Image,
  ChevronRight,
  Clock,
  Eye,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

interface TaskSubmission {
  id: string;
  assignmentId: string;
  studentName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  screenshot: string | null;
  assignmentTitle?: string;
}

export default function TeacherTaskVerificationPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const savedSubmissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
    const savedAssignments = JSON.parse(localStorage.getItem('allAssignments') || '[]');
    
    // Add assignment titles to submissions
    const submissionsWithTitles = savedSubmissions.map((sub: TaskSubmission) => {
      const assignment = savedAssignments.find((a: any) => a.id === sub.assignmentId);
      return {
        ...sub,
        assignmentTitle: assignment?.title || 'Unknown Assignment'
      };
    });
    
    setSubmissions(submissionsWithTitles);
  };

  const handleApprove = async (submissionId: string) => {
    setIsProcessing(true);
    try {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: 'approved' as const } : sub
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('taskSubmissions', JSON.stringify(updatedSubmissions));
      toast.success("Task approved! Student will be notified.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setIsProcessing(true);
    try {
      const updatedSubmissions = submissions.map(sub => 
        sub.id === submissionId ? { ...sub, status: 'rejected' as const } : sub
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('taskSubmissions', JSON.stringify(updatedSubmissions));
      toast.success("Task rejected. Student will be notified.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewImage = (submission: TaskSubmission) => {
    setSelectedSubmission(submission);
    setShowImageModal(true);
  };

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const reviewedSubmissions = submissions.filter(sub => sub.status !== 'pending');

  return (
    <AppLayout role="teacher" title={t("teacher.taskVerification", { defaultValue: "Task Verification" })}>
      <div className="px-4 py-6">
        {/* Image Modal */}
        {selectedSubmission && showImageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedSubmission.assignmentTitle}</h3>
                    <p className="text-sm text-muted-foreground">by {selectedSubmission.studentName}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowImageModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                {selectedSubmission.screenshot && (
                  <img 
                    src={selectedSubmission.screenshot} 
                    alt="Student submission" 
                    className="w-full h-auto rounded-lg"
                  />
                )}
                <div className="flex gap-2 mt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedSubmission.id);
                      setShowImageModal(false);
                    }}
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      handleReject(selectedSubmission.id);
                      setShowImageModal(false);
                    }}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 slide-up">
          <h2 className="font-heading text-2xl font-bold">
            {t("teacher.taskVerification", { defaultValue: "Task Verification" })}
          </h2>
          <p className="text-muted-foreground">
            {t("teacher.reviewSubmissions", { defaultValue: "Review student submissions" })}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border-2 border-accent/30 bg-accent/10 p-3 text-center">
            <p className="font-heading text-2xl font-bold text-accent">{pendingSubmissions.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="font-heading text-2xl font-bold text-secondary">{reviewedSubmissions.filter(s => s.status === 'approved').length}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="font-heading text-2xl font-bold text-destructive">{reviewedSubmissions.filter(s => s.status === 'rejected').length}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="slide-up" style={{ animationDelay: "150ms" }}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="pending" className="flex-1">
              Pending ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex-1">
              Reviewed ({reviewedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary text-sm">
                      {submission.studentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{submission.studentName}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <GameBadge variant="primary" size="sm">
                    Assignment
                  </GameBadge>
                </div>

                {/* Task Info */}
                <div className="mb-3">
                  <p className="font-medium">{submission.assignmentTitle}</p>
                  <p className="text-sm text-muted-foreground">Screenshot submission</p>
                </div>

                {/* Screenshot Preview */}
                {submission.screenshot && (
                  <div className="mb-4">
                    <img 
                      src={submission.screenshot} 
                      alt="Student submission preview" 
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleViewImage(submission)}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewImage(submission)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Image
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(submission.id)}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90"
                    onClick={() => handleApprove(submission.id)}
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {pendingSubmissions.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <Check className="mx-auto mb-2 h-12 w-12 text-secondary" />
                <p className="font-heading font-semibold">All caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No pending submissions to review
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-3">
            {reviewedSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
              >
                <div>
                  <p className="font-medium">{submission.studentName}</p>
                  <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <GameBadge
                    variant={submission.status === "approved" ? "secondary" : "destructive"}
                    size="sm"
                  >
                    {submission.status}
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