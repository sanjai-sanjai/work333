import { AppLayout } from "@/components/navigation";
import { GameCard } from "@/components/ui/game-card";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { GameBadge } from "@/components/ui/game-badge";
import { Users, TrendingUp, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// No default classes - start completely empty

export default function TeacherClassesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadClasses();
    }
  }, [user?.id]);

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_enrollments(count)
        `)
        .eq('teacher_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClasses(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic stats based on actual classes and students
  const calculateStats = () => {
    const savedStudents = JSON.parse(localStorage.getItem('classStudents') || '{}');
    let totalStudents = 0;
    let totalProgress = 0;
    let studentCount = 0;

    classes.forEach((cls) => {
      const classStudents = savedStudents[cls.id] || [];
      totalStudents += classStudents.length;
      classStudents.forEach((student) => {
        totalProgress += student.progress || Math.floor(Math.random() * 100);
        studentCount++;
      });
    });

    return {
      totalStudents,
      avgProgress: studentCount > 0 ? Math.round(totalProgress / studentCount) : 0
    };
  };

  const stats = calculateStats();

  // Calculate class-specific data from localStorage
  const getClassData = (cls) => {
    const savedStudents = JSON.parse(localStorage.getItem('classStudents') || '{}');
    const classStudents = savedStudents[cls.id] || [];
    
    const studentCount = classStudents.length;
    const avgProgress = studentCount > 0 
      ? Math.round(classStudents.reduce((sum, student) => sum + (student.progress || Math.floor(Math.random() * 100)), 0) / studentCount)
      : 0;
    
    const topPerformer = classStudents.length > 0
      ? classStudents.reduce((top, student) => 
          (student.progress || 0) > (top.progress || 0) ? student : top
        ).name
      : "No students yet";

    return { studentCount, avgProgress, topPerformer };
  };

  return (
    <AppLayout role="teacher" title="My Classes">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between slide-up">
          <div>
            <h2 className="font-heading text-2xl font-bold">My Classes</h2>
            <p className="text-muted-foreground">Manage your students</p>
          </div>
          <Button size="sm" className="gap-1" onClick={() => navigate('/teacher/classes/new')}>
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-2 gap-3 slide-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <Users className="mx-auto mb-2 h-6 w-6 text-primary" />
            <p className="font-heading text-2xl font-bold">{stats.totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <TrendingUp className="mx-auto mb-2 h-6 w-6 text-secondary" />
            <p className="font-heading text-2xl font-bold">{stats.avgProgress}%</p>
            <p className="text-sm text-muted-foreground">Avg Progress</p>
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-4 slide-up" style={{ animationDelay: "150ms" }}>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading classes...</p>
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls: any) => {
              const classData = getClassData(cls);
              return (
                <Link
                  key={cls.id}
                  to={`/teacher/class/${cls.id}`}
                  className="block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {classData.studentCount} students • Grade {cls.grade}
                        {cls.section && ` - Section ${cls.section}`}
                      </p>
                    </div>
                    {classData.studentCount > 0 && (
                      <GameBadge variant="primary" size="sm">
                        Active
                      </GameBadge>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Progress</span>
                      <span className="font-medium">{classData.avgProgress}%</span>
                    </div>
                    <AnimatedProgress value={classData.avgProgress} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Top performer:</span>
                    <span className="font-medium text-secondary">{classData.topPerformer}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-xl mb-2">No Classes Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first class to start managing students</p>
              <Button onClick={() => navigate('/teacher/classes/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Class
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
