import { useState, useEffect } from "react";
import { AppLayout } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { toast } from "sonner";
import {
  Flame,
  Home,
  BookOpen,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Target,
  Zap,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayCoins } from "@/hooks/use-playcoins";
import { useNavigate } from "react-router-dom";

interface ImpactContributor {
  user_id: string;
  profile?: {
    full_name: string;
    village?: string;
    school?: string;
  };
  total_xp?: number;
  current_level?: number;
  contribution_score?: number;
  day_streak?: number;
  village_tasks_completed?: number;
}

const getImpactTitle = (rank: number, xp: number, streak: number): string => {
  if (streak >= 30) return "🔥 Consistency Champion";
  if (xp >= 5000) return "📚 Knowledge Builder";
  if (rank <= 3) return "🌟 Community Star";
  if (streak >= 14) return "🌱 Consistent Learner";
  return "🛠 Problem Solver";
};

const getAvatarColor = (index: number): string => {
  const colors = [
    "bg-gradient-to-br from-primary to-primary/60",
    "bg-gradient-to-br from-secondary to-secondary/60",
    "bg-gradient-to-br from-accent to-accent/60",
    "bg-gradient-to-br from-destructive to-destructive/60",
    "bg-gradient-to-br from-badge to-badge/60",
    "bg-gradient-to-br from-pink-500 to-pink-600",
  ];
  return colors[index % colors.length];
};

const getAvatarInitial = (name: string): string => {
  return name.split(" ")[0].charAt(0).toUpperCase() || "?";
};

export default function VillageImpactBoard() {
  const { leaderboard, isLoading } = useLeaderboard(15);
  const { user, profile } = useAuth();
  const { wallet } = usePlayCoins();
  const navigate = useNavigate();
  const [impactModeOn, setImpactModeOn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  // Calculate village stats
  const totalActiveLearners = Math.max(leaderboard.length, 0);
  const totalVillageXP = Math.max(leaderboard.reduce((sum, entry) => sum + (entry.total_xp || 0), 0), 0);
  const villageLevel = Math.max(Math.floor(totalVillageXP / 10000) + 1, 1);

  // Get current user from leaderboard
  const currentUserData = leaderboard.find((entry) => entry.user_id === user?.id) as ImpactContributor | undefined;
  const userStreak = Math.max(currentUserData?.day_streak || 0, 0);
  const userVillageTasks = Math.max(currentUserData?.village_tasks_completed || 0, 0);
  const userContributionScore = Math.max(currentUserData?.contribution_score || 0, 0);
  const userLevel = Math.max(currentUserData?.current_level || 0, 0);

  // Calculate contribution progress (0-100%)
  const contributionProgress = Math.min(Math.max((userContributionScore / 200) * 100, 0), 100);

  const handleStartLearning = () => {
    toast.success("Let's learn together! 📚", {
      description: "Navigate to village learning tasks",
    });
    // Navigate to tasks page with village filter
    navigate("/student/tasks?category=village");
  };

  const handleJoinChallenge = () => {
    setImpactModeOn(true);
    toast.success("You're now contributing to your village! 🎉", {
      description: "Your learning will help village growth",
    });
    // In a real app, this would navigate to challenge details
    // For now, we enable Impact Mode and show notification
  };

  return (
    <AppLayout role="student" playCoins={wallet?.balance || 0} title="Community Mission Hub">
      <div className="px-4 py-6 pb-24">
        {/* 1. INSPIRATION HEADER SECTION */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Card className="relative overflow-hidden rounded-3xl border-0 p-8">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-emerald-600/20 animate-gradient" />

            {/* Floating icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 left-4 text-3xl animate-float opacity-30">📘</div>
              <div className="absolute top-1/3 right-8 text-4xl animate-float opacity-30" style={{ animationDelay: "1s" }}>
                🌱
              </div>
              <div className="absolute bottom-6 left-1/4 text-3xl animate-float opacity-30" style={{ animationDelay: "2s" }}>
                🧠
              </div>
              <div className="absolute bottom-1/4 right-1/4 text-4xl animate-float opacity-30" style={{ animationDelay: "1.5s" }}>
                🏆
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                Your learning is shaping your village 🌍
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Every lesson you complete adds strength to your community
              </p>
              <p className="text-sm text-accent font-medium italic">
                Today, your effort can inspire others
              </p>
            </div>
          </Card>
        </div>

        {/* 2. IMPACT MODE CLARITY SECTION */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <Card className={`rounded-2xl p-5 border-2 transition-all ${
            impactModeOn
              ? "border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5"
              : "border-muted/30 bg-muted/5"
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-3 w-3 rounded-full transition-all ${
                      impactModeOn ? "bg-accent pulse" : "bg-muted-foreground/30"
                    }`}
                  />
                  <h3 className="font-heading font-bold text-foreground">
                    {impactModeOn ? "Impact Mode ON 🌱" : "Impact Mode OFF"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {impactModeOn
                    ? "Your learning contributes to village progress and helps community growth"
                    : "Your learning is private and does not affect village growth"}
                </p>
              </div>

              <Button
                variant={impactModeOn ? "default" : "outline"}
                size="sm"
                onClick={() => setImpactModeOn(!impactModeOn)}
                className="flex-shrink-0 gap-2"
              >
                {impactModeOn ? (
                  <>
                    <Eye className="h-4 w-4" />
                    On
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Off
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* 3. YOUR IMPACT & CONTRIBUTION SCORE */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <Card className="glass-card rounded-2xl p-6 border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-14 w-14 border-2 border-accent/50 flex-shrink-0">
                <AvatarFallback className="bg-accent/20 text-accent font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-foreground">{profile?.full_name || "You"}</h3>
                <p className="text-sm text-accent font-semibold">Village Contributor</p>
              </div>
            </div>

            {/* Contribution Score as Progress */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Village Contribution Score</p>
                  <p className="text-3xl font-bold text-accent">{Math.floor(userContributionScore)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Progress to next level</p>
                  <p className="text-xl font-bold text-primary">{Math.floor(contributionProgress)}%</p>
                </div>
              </div>
              <AnimatedProgress value={contributionProgress} variant="default" className="h-2.5" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete village learning tasks to increase your impact
              </p>
            </div>

            {/* Impact Breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-muted-foreground font-medium">Consistency</span>
                </div>
                <p className="font-bold text-foreground text-base">{Math.max(userStreak, 0)} days</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">Village Tasks</span>
                </div>
                <p className="font-bold text-foreground text-base">{Math.max(userVillageTasks, 0)}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="h-4 w-4 text-secondary" />
                  <span className="text-xs text-muted-foreground font-medium">Learning Level</span>
                </div>
                <p className="font-bold text-foreground text-base">{Math.max(userLevel, 0)}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground font-medium">Village Help</span>
                </div>
                <p className="font-bold text-foreground text-base">+{Math.max(Math.floor(userContributionScore / 10), 0)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. VILLAGE COMMUNITY STATS */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="glass-card rounded-2xl p-4 border border-primary/30">
              <p className="text-xs text-muted-foreground font-medium mb-1">Active Learners</p>
              <p className="font-heading text-3xl font-bold text-primary">{totalActiveLearners}</p>
              <p className="text-xs text-muted-foreground mt-1">in your village</p>
            </Card>
            <Card className="glass-card rounded-2xl p-4 border border-accent/30">
              <p className="text-xs text-muted-foreground font-medium mb-1">Village Level</p>
              <p className="font-heading text-3xl font-bold text-accent">{villageLevel}</p>
              <p className="text-xs text-muted-foreground mt-1">community strength</p>
            </Card>
          </div>

          <Card className="glass-card rounded-2xl p-4 border border-border/50">
            <div className="mb-2">
              <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1">
                <span>Village XP Progress</span>
                <span>{(totalVillageXP / 1000).toFixed(1)}k XP</span>
              </div>
              <AnimatedProgress
                value={Math.min(Math.max((totalVillageXP % 10000) / 100, 0), 100)}
                variant="default"
                className="h-2"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              When village reaches the next level, everyone gets bonus rewards! 🎁
            </p>
          </Card>
        </div>

        {/* 5. VILLAGE CONTRIBUTORS (Only when Impact Mode ON) */}
        {impactModeOn ? (
          <div
            className={`mb-6 transition-all duration-700 ${
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            <div className="mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">Village Impact Contributors</h3>
              <p className="text-sm text-muted-foreground">Learners making a difference in your village</p>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="glass-card p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-24 mb-1" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : leaderboard.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No contributors yet. Be the first!</p>
                </Card>
              ) : (
                leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user_id === user?.id;
                  const impactTitle = getImpactTitle(index + 1, entry.total_xp || 0, entry.day_streak || 0);

                  return (
                    <Card
                      key={entry.user_id}
                      className={`p-4 transition-all duration-700 ${
                        isCurrentUser ? "ring-2 ring-accent border-accent/40 bg-accent/5" : "glass-card border border-border/50"
                      } ${isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      style={{ transitionDelay: `${300 + index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 border-2 border-primary/30 flex-shrink-0">
                            <AvatarFallback className={`${getAvatarColor(index)} text-white font-bold`}>
                              {getAvatarInitial(entry.profile?.full_name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-heading font-bold truncate text-foreground">
                              {entry.profile?.full_name || "Anonymous"}
                              {isCurrentUser && <span className="text-accent ml-1">(You)</span>}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1.5 truncate">
                              {entry.profile?.village || entry.profile?.school || "Village Learner"}
                            </p>
                            <p className="text-sm font-semibold text-accent">{impactTitle}</p>
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <div className="relative h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${Math.max(
                                  (Math.max(entry.contribution_score || 0, 0) / 100) * 125.6,
                                  0
                                )} 125.6`}
                                className="text-primary transition-all duration-500"
                              />
                            </svg>
                            <span className="absolute font-bold text-sm text-primary">
                              {Math.min(Math.floor(Math.max(entry.contribution_score || 0, 0) / 10), 99)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Impact Mode OFF - Show Locked State */
          <div
            className={`mb-6 transition-all duration-700 ${
              isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            <Card className="glass-card rounded-2xl p-8 border border-muted/30 text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h4 className="font-heading font-bold text-foreground mb-2">Village Contributors Hidden</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Enable Impact Mode above to see contributors and start making a difference
              </p>
              <Button onClick={() => setImpactModeOn(true)} variant="default" className="gap-2">
                <Eye className="h-4 w-4" />
                Enable Impact Mode
              </Button>
            </Card>
          </div>
        )}

        {/* 6. WHY IT MATTERS CARD */}
        <div
          className={`mb-6 transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <Card className="glass-card rounded-2xl p-6 border border-secondary/30 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-secondary" />
              </div>
              <h4 className="font-heading font-bold text-foreground text-lg">Why Your Learning Matters 💡</h4>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                <span className="text-lg flex-shrink-0">📚</span>
                <div>
                  <p className="font-semibold text-foreground">More Learning</p>
                  <p className="text-xs text-muted-foreground">Every lesson strengthens your skills</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                <span className="text-lg flex-shrink-0">📈</span>
                <div>
                  <p className="font-semibold text-foreground">Higher Village Level</p>
                  <p className="text-xs text-muted-foreground">Community learns together and grows stronger</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                <span className="text-lg flex-shrink-0">🎁</span>
                <div>
                  <p className="font-semibold text-foreground">Better Challenges & Rewards</p>
                  <p className="text-xs text-muted-foreground">Higher levels unlock special challenges for everyone</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 7. ACTION CTAs */}
        <div
          className={`transition-all duration-700 ${
            isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Card className="glass-card rounded-2xl p-6 border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5">
            <div className="text-center mb-5">
              <p className="font-heading text-lg font-bold text-foreground mb-1">Your learning helps your village grow 🌾</p>
              <p className="text-sm text-muted-foreground">Choose how you want to contribute</p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleStartLearning}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 h-12"
              >
                <BookOpen className="h-5 w-5" />
                Start a Learning Task
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Button
                onClick={handleJoinChallenge}
                variant="outline"
                size="lg"
                className="w-full border-accent/50 hover:border-accent text-foreground font-bold gap-2 h-12"
              >
                <Target className="h-5 w-5" />
                Join Village Challenge
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              <CheckCircle2 className="h-3 w-3 inline mr-1" />
              Impact Mode must be ON for your learning to count toward village growth
            </p>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </AppLayout>
  );
}
