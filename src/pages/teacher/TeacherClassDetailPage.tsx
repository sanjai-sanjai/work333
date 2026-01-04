import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function TeacherClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });

  useEffect(() => {
    if (id && user?.id) {
      loadClassData();
    }
  }, [id, user?.id]);

  const loadClassData = async () => {
    try {
      const { data: classData, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .eq('teacher_id', user?.id)
        .single();

      if (error) {
        console.error('Class not found:', error);
        setCurrentClass(null);
      } else {
        setCurrentClass(classData);
      }

      // Load students from localStorage for now
      const savedStudents = JSON.parse(localStorage.getItem('classStudents') || '{}');
      const classStudents = savedStudents[id] || [];
      setStudents(classStudents);
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async () => {
    if (!newStudent.name.trim()) {
      toast.error("Please enter student name");
      return;
    }

    try {
      const studentId = `student_${Date.now()}`;
      
      const student = {
        id: studentId,
        name: newStudent.name.trim(),
        email: newStudent.email.trim(),
        progress: Math.floor(Math.random() * 100), // Random progress for demo
        coins: Math.floor(Math.random() * 200),
        lastActive: 'Just added',
        avatar: newStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };

      // Save to localStorage for now
      const savedStudents = JSON.parse(localStorage.getItem('classStudents') || '{}');
      const updatedStudents = {
        ...savedStudents,
        [id]: [...(savedStudents[id] || []), student]
      };
      localStorage.setItem('classStudents', JSON.stringify(updatedStudents));

      setStudents([...students, student]);
      setNewStudent({ name: "", email: "" });
      setShowAddStudent(false);
      toast.success(`${student.name} added to class!`);
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student. Please try again.');
    }
  };

  if (loading) {
    return (
      <AppLayout role="teacher" title="Loading...">
        <div className="px-4 py-6">
          <p>Loading class details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!currentClass) {
    return (
      <AppLayout role="teacher" title="Class Not Found">
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">Class Not Found</h3>
            <p className="text-muted-foreground mb-6">The class you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/teacher/classes')}>
              Back to Classes
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout role="teacher" title={currentClass.name}>
      <div className="px-4 py-6">
        <div className="mb-4">
          <h2 className="font-heading text-2xl font-bold">{currentClass.name}</h2>
          <p className="text-muted-foreground">Grade {currentClass.grade} • {currentClass.academic_year}</p>
        </div>

        <div className="mb-6">
          <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Student to {currentClass.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Enter student name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentEmail">Email (Optional)</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    placeholder="Enter student email"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={addStudent} className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddStudent(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Students ({students.length})</h3>
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary text-sm">
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email || 'No email provided'}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{student.progress || 0}% progress</span>
                    <span>•</span>
                    <span>{student.coins || 0} coins</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Students Yet</h3>
              <p className="text-muted-foreground">Click "Add Student" above to enroll students in this class.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}