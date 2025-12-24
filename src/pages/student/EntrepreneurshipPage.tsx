import { SubjectLayout } from "@/components/student/SubjectLayout";
import { GameMissionCard } from "@/components/student/GameMissionCard";
import { EntrepreneurshipActiveLearning } from "@/components/active-learning/EntrepreneurshipActiveLearning";
import { Lightbulb, Store, Users, BarChart3, Megaphone, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const entrepreneurMissions = [
  {
    title: "Business Idea Generator",
    description: "Discover what problems you can solve in your village",
    icon: Lightbulb,
    reward: 90,
    difficulty: "easy" as const,
    status: "available" as const,
    path: "/student/entrepreneurship/builder",
  },
  {
    title: "Mini Market Simulation",
    description: "Run your own virtual shop and learn business basics",
    icon: Store,
    reward: 120,
    difficulty: "medium" as const,
    status: "locked" as const,
  },
  {
    title: "Customer Service",
    description: "Learn how to communicate with customers effectively",
    icon: Users,
    reward: 80,
    difficulty: "easy" as const,
    status: "locked" as const,
  },
  {
    title: "Profit Calculator",
    description: "Understand costs, pricing, and making profits",
    icon: BarChart3,
    reward: 100,
    difficulty: "medium" as const,
    status: "locked" as const,
  },
  {
    title: "Marketing Magic",
    description: "Learn how to promote products and attract customers",
    icon: Megaphone,
    reward: 130,
    difficulty: "hard" as const,
    status: "locked" as const,
  },
];

export default function EntrepreneurshipPage() {
  const navigate = useNavigate();

  return (
    <SubjectLayout
      title="Entrepreneurship"
      icon={Lightbulb}
      iconColor="text-accent"
      progress={0}
      totalLessons={8}
      completedLessons={0}
      xpEarned={0}
    >
      <div className="slide-up" style={{ animationDelay: "150ms" }}>
        <EntrepreneurshipActiveLearning />
      </div>

      <div className="slide-up" style={{ animationDelay: "200ms" }}>
        <div className="mb-4 rounded-xl border border-accent/30 bg-accent/10 p-4">
          <p className="text-sm text-accent-foreground">
            🔒 Complete 50% of Financial Literacy to unlock this subject!
          </p>
        </div>
        <h3 className="mb-4 font-heading font-semibold">Missions & Games</h3>
        <div className="space-y-3">
          {entrepreneurMissions.map((mission, index) => (
            <div
              key={mission.title}
              className="slide-up"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <GameMissionCard
                {...mission}
                onClick={() => mission.path && navigate(mission.path)}
              />
            </div>
          ))}
        </div>
        </div>
      </SubjectLayout>
    );
  }
