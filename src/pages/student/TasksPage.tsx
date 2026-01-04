import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import {
  BookOpen,
  Clock,
  Coins,
  TrendingUp,
} from "lucide-react";
import { usePlayCoins } from "@/hooks/use-playcoins";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function TasksPage() {
  const { t } = useTranslation();
  const { wallet } = usePlayCoins();
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  // Load assignments from Supabase
  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      // Check localStorage first
      const storedAssignments = localStorage.getItem('assignments');
      console.log('Raw localStorage assignments:', storedAssignments);
      
      if (storedAssignments) {
        const parsed = JSON.parse(storedAssignments);
        console.log('Parsed assignments:', parsed);
        setAssignments(parsed.filter((a: any) => a.is_active !== false));
        setLoadingAssignments(false);
        return;
      }
      
      // Try Supabase if no localStorage data
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Supabase error:', error);
        setAssignments([]);
      } else {
        console.log('Supabase assignments:', data);
        setAssignments(data || []);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  return (
    <AppLayout role="student" playCoins={wallet?.balance || 0} title="Tasks">
      <div className="px-4 py-6 pb-24 space-y-6">
        {/* HEADER */}
        <div className="slide-up space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">Your Tasks</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete assignments from your teachers to earn rewards
            </p>
          </div>
        </div>

        {/* DEBUG BUTTONS */}
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              const stored = localStorage.getItem('assignments');
              console.log('Manual check - localStorage assignments:', stored);
              if (stored) {
                const parsed = JSON.parse(stored);
                console.log('Parsed:', parsed);
                setAssignments(parsed);
              }
            }}
            variant="outline"
            size="sm"
          >
            Check localStorage
          </Button>
          
          <Button 
            onClick={() => {
              const testAssignment = {
                id: 'test_123',
                title: 'Test Assignment',
                description: 'This is a test',
                subject: 'mathematics',
                teacher_id: 'test_teacher',
                is_active: true,
                created_at: new Date().toISOString()
              };
              
              const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
              assignments.push(testAssignment);
              localStorage.setItem('assignments', JSON.stringify(assignments));
              
              console.log('Test assignment saved');
              loadAssignments();
            }}
            variant="outline"
            size="sm"
          >
            Add Test Assignment
          </Button>
        </div>

        {/* ASSIGNMENTS FROM TEACHERS */}
        <div className="slide-up space-y-3" style={{ animationDelay: "75ms" }}>
          <p className="text-sm font-medium text-foreground px-1">Teacher Assignments</p>
          <div className="space-y-3">
            {loadingAssignments ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading assignments...</p>
              </div>
            ) : assignments.length > 0 ? (
              assignments.map((assignment: any, index: number) => (
                <Card key={assignment.id} className="glass-card border border-border p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {assignment.subject}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            30 min
                          </span>
                          {assignment.due_date && (
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                          <Coins className="h-4 w-4" />
                          50
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                          <TrendingUp className="h-4 w-4" />
                          100 XP
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => {
                        const submission = {
                          id: `submission_${Date.now()}`,
                          assignmentId: assignment.id,
                          studentName: 'Current Student',
                          submittedAt: new Date().toISOString(),
                          status: 'pending',
                          screenshot: null
                        };
                        
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              submission.screenshot = reader.result as string;
                              
                              const submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
                              submissions.push(submission);
                              localStorage.setItem('taskSubmissions', JSON.stringify(submissions));
                              
                              toast.success('Screenshot uploaded successfully! Your teacher will review it.');
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                    >
                      Upload Screenshot
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="glass-card border border-border rounded-lg p-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">No assignments yet</p>
                <p className="text-sm text-muted-foreground">Your teachers haven't created any assignments yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
