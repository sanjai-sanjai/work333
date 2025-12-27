/**
 * TEACHER STUDENT PROGRESS PAGE
 * Card-based student progress monitoring
 * Shows learning streaks, subject progress, strengths and support needed
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/navigation";
import { StudentCard } from "@/components/teacher/StudentCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Target,
  AlertCircle,
  BookOpen,
  Gift,
  Zap,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  learningStreak: number;
  lastActive: string;
  subjects: {
    name: string;
    progress: number;
    color: string;
  }[];
  strengthAreas: string[];
  supportNeeded: string[];
  completedTasks: number;
  earnedCoins: number;
}

const students: Student[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "PS",
    class: "Grade 9A",
    learningStreak: 12,
    lastActive: "5 min ago",
    subjects: [
      { name: "Physics", progress: 85, color: "bg-primary" },
      { name: "Chemistry", progress: 78, color: "bg-secondary" },
      { name: "Biology", progress: 72, color: "bg-accent" },
      { name: "Math", progress: 92, color: "bg-badge" },
      { name: "English", progress: 88, color: "bg-primary" },
      { name: "History", progress: 75, color: "bg-secondary" },
      { name: "Geography", progress: 68, color: "bg-accent" },
      { name: "IT", progress: 95, color: "bg-badge" },
    ],
    strengthAreas: ["Mathematical thinking", "Problem solving", "Technology"],
    supportNeeded: ["Chemistry concepts", "Writing clarity"],
    completedTasks: 24,
    earnedCoins: 2450,
  },
  {
    id: "2",
    name: "Amit Kumar",
    avatar: "AK",
    class: "Grade 9B",
    learningStreak: 8,
    lastActive: "2 hours ago",
    subjects: [
      { name: "Physics", progress: 65, color: "bg-primary" },
      { name: "Chemistry", progress: 72, color: "bg-secondary" },
      { name: "Biology", progress: 55, color: "bg-accent" },
      { name: "Math", progress: 78, color: "bg-badge" },
      { name: "English", progress: 70, color: "bg-primary" },
      { name: "History", progress: 82, color: "bg-secondary" },
      { name: "Geography", progress: 60, color: "bg-accent" },
      { name: "IT", progress: 75, color: "bg-badge" },
    ],
    strengthAreas: ["History", "Communication"],
    supportNeeded: ["Biology", "Physics", "Practical Sciences"],
    completedTasks: 18,
    earnedCoins: 2100,
  },
  {
    id: "3",
    name: "Ravi Patel",
    avatar: "RP",
    class: "Grade 9A",
    learningStreak: 5,
    lastActive: "1 day ago",
    subjects: [
      { name: "Physics", progress: 45, color: "bg-primary" },
      { name: "Chemistry", progress: 50, color: "bg-secondary" },
      { name: "Biology", progress: 42, color: "bg-accent" },
      { name: "Math", progress: 65, color: "bg-badge" },
      { name: "English", progress: 55, color: "bg-primary" },
      { name: "History", progress: 58, color: "bg-secondary" },
      { name: "Geography", progress: 48, color: "bg-accent" },
      { name: "IT", progress: 60, color: "bg-badge" },
    ],
    strengthAreas: ["Mathematics", "Logical thinking"],
    supportNeeded: [
      "Science concepts",
      "Reading comprehension",
      "Consistency",
    ],
    completedTasks: 10,
    earnedCoins: 1200,
  },
  {
    id: "4",
    name: "Meera Singh",
    avatar: "MS",
    class: "Grade 9B",
    learningStreak: 15,
    lastActive: "15 min ago",
    subjects: [
      { name: "Physics", progress: 88, color: "bg-primary" },
      { name: "Chemistry", progress: 85, color: "bg-secondary" },
      { name: "Biology", progress: 90, color: "bg-accent" },
      { name: "Math", progress: 92, color: "bg-badge" },
      { name: "English", progress: 94, color: "bg-primary" },
      { name: "History", progress: 86, color: "bg-secondary" },
      { name: "Geography", progress: 88, color: "bg-accent" },
      { name: "IT", progress: 91, color: "bg-badge" },
    ],
    strengthAreas: ["All subjects", "Consistent effort", "Leadership"],
    supportNeeded: [],
    completedTasks: 32,
    earnedCoins: 3200,
  },
];

export default function TeacherStudentProgressPage() {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "streak" | "progress">("name");

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const sortedStudents = [...students].sort((a, b) => {
    switch (sortBy) {
      case "streak":
        return b.learningStreak - a.learningStreak;
      case "progress":
        const avgA = a.subjects.reduce((sum, s) => sum + s.progress, 0) / a.subjects.length;
        const avgB = b.subjects.reduce((sum, s) => sum + s.progress, 0) / b.subjects.length;
        return avgB - avgA;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const needsSupport = students.filter((s) => {
    const avg = s.subjects.reduce((sum, sub) => sum + sub.progress, 0) / s.subjects.length;
    return avg < 60;
  });

  return (
    <AppLayout role="teacher" title={t("teacher.studentProgress", { defaultValue: "Student Progress" })}>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="slide-up space-y-2">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t("teacher.studentProgress", { defaultValue: "Student Progress" })}
          </h2>
          <p className="text-muted-foreground">
            {t("teacher.monitorLearning", {
              defaultValue: "Monitor learning and provide support where needed",
            })}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="slide-up grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ animationDelay: "50ms" }}>
          <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("teacher.totalStudents", { defaultValue: "Total Students" })}
                </p>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {students.length}
                </p>
              </div>
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {t("teacher.needsSupport", { defaultValue: "Need Support" })}
                </p>
                <p className="text-3xl font-heading font-bold text-destructive">
                  {needsSupport.length}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
          </Card>
        </div>

        {/* Sort Buttons */}
        <div className="slide-up flex gap-2" style={{ animationDelay: "100ms" }}>
          {[
            { value: "name", label: t("teacher.byName", { defaultValue: "By Name" }) },
            { value: "streak", label: t("teacher.byStreak", { defaultValue: "By Streak" }) },
            { value: "progress", label: t("teacher.byProgress", { defaultValue: "By Progress" }) },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as typeof sortBy)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Students Grid */}
        <div
          className="slide-up grid grid-cols-1 md:grid-cols-2 gap-4"
          style={{ animationDelay: "150ms" }}
        >
          {sortedStudents.map((student) => (
            <StudentCard
              key={student.id}
              {...student}
              onClick={() => handleViewStudent(student)}
            />
          ))}
        </div>

        {/* Detail Modal */}
        {selectedStudent && (
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 font-heading font-bold text-primary text-lg">
                      {selectedStudent.avatar}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">
                        {selectedStudent.name}
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        {selectedStudent.class}
                      </DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="progress" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="progress">
                    {t("teacher.progress", { defaultValue: "Progress" })}
                  </TabsTrigger>
                  <TabsTrigger value="strengths">
                    {t("teacher.strengths", { defaultValue: "Strengths" })}
                  </TabsTrigger>
                  <TabsTrigger value="support">
                    {t("teacher.support", { defaultValue: "Support" })}
                  </TabsTrigger>
                  <TabsTrigger value="activity">
                    {t("teacher.activity", { defaultValue: "Activity" })}
                  </TabsTrigger>
                </TabsList>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-4">
                  <div className="space-y-3">
                    {selectedStudent.subjects.map((subject) => (
                      <div key={subject.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{subject.name}</span>
                          <span className="font-bold text-primary">
                            {subject.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Strengths Tab */}
                <TabsContent value="strengths" className="space-y-3">
                  {selectedStudent.strengthAreas.length > 0 ? (
                    selectedStudent.strengthAreas.map((area, index) => (
                      <Card
                        key={index}
                        className="border-secondary/30 bg-secondary/5 p-4 backdrop-blur-sm flex items-start gap-3"
                      >
                        <Zap className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{area}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("teacher.studentShows", {
                              defaultValue: "Student demonstrates strong skills here",
                            })}
                          </p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("teacher.noStrengths", {
                        defaultValue: "Continue encouraging all areas",
                      })}
                    </p>
                  )}
                </TabsContent>

                {/* Support Needed Tab */}
                <TabsContent value="support" className="space-y-3">
                  {selectedStudent.supportNeeded.length > 0 ? (
                    selectedStudent.supportNeeded.map((area, index) => (
                      <Card
                        key={index}
                        className="border-accent/30 bg-accent/5 p-4 backdrop-blur-sm flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{area}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t("teacher.provideSupportHint", {
                              defaultValue: "Consider providing extra support in this area",
                            })}
                          </p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-secondary text-sm font-medium">
                      ✓ {t("teacher.noSupportNeeded", {
                        defaultValue: "Student is progressing well in all areas",
                      })}
                    </p>
                  )}
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-3">
                  <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {t("teacher.completedTasks", {
                            defaultValue: "Completed Tasks",
                          })}
                        </span>
                        <span className="text-2xl font-heading font-bold text-primary">
                          {selectedStudent.completedTasks}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(
                              (selectedStudent.completedTasks / 40) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {t("teacher.earnedCoins", {
                            defaultValue: "Earned EduCoins",
                          })}
                        </span>
                        <span className="text-2xl font-heading font-bold text-accent">
                          {selectedStudent.earnedCoins}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-border/50 bg-card/40 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t("teacher.lastActive", { defaultValue: "Last Active" })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {selectedStudent.lastActive}
                      </span>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
