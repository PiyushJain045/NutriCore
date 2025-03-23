
import { ArrowLeft, Trophy, MessageCircle, Users, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const friends = [
  {
    id: 1,
    name: "Emma Wilson",
    avatar: "",
    steps: 12543,
    streak: 14,
    lastActivity: "Full Body HIIT",
    isOnline: true
  },
  {
    id: 2,
    name: "Ryan Chen",
    avatar: "",
    steps: 9872,
    streak: 7,
    lastActivity: "Morning Run",
    isOnline: true
  },
  {
    id: 3,
    name: "Sarah Johnson",
    avatar: "",
    steps: 8954,
    streak: 21,
    lastActivity: "Yoga Flow",
    isOnline: false
  },
  {
    id: 4,
    name: "Michael Brown",
    avatar: "",
    steps: 7621,
    streak: 5,
    lastActivity: "Weight Training",
    isOnline: false
  }
];

const challenges = [
  {
    id: 1,
    title: "10K Steps Challenge",
    participants: 234,
    daysLeft: 5,
    progress: 70
  },
  {
    id: 2,
    title: "30 Day Yoga Journey",
    participants: 156,
    daysLeft: 18,
    progress: 40
  },
  {
    id: 3,
    title: "Summer Fitness Sprint",
    participants: 312,
    daysLeft: 12,
    progress: 55
  }
];

const achievements = [
  {
    id: 1,
    title: "Early Bird",
    description: "Complete 5 workouts before 8 AM",
    icon: <Award className="h-6 w-6 text-amber-500" />,
    progress: 3,
    total: 5
  },
  {
    id: 2,
    title: "Consistency King",
    description: "Workout 3 times a week for a month",
    icon: <Trophy className="h-6 w-6 text-indigo-500" />,
    progress: 9,
    total: 12
  },
  {
    id: 3,
    title: "Strength Master",
    description: "Complete 20 strength training sessions",
    icon: <Award className="h-6 w-6 text-emerald-500" />,
    progress: 14,
    total: 20
  }
];

const FriendCard = ({ friend }: { friend: typeof friends[0] }) => {
  return (
    <div className="fit-card p-4 mb-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {friend.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-fit-accent border-2 border-white"></span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-fit-primary flex items-center">
            {friend.name}
            {friend.streak >= 7 && (
              <Badge variant="outline" className="ml-2 px-1.5 py-0 h-4 text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                {friend.streak} 🔥
              </Badge>
            )}
          </h3>
          <p className="text-xs text-fit-muted">{friend.lastActivity}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-fit-primary">{friend.steps.toLocaleString()}</span>
        <p className="text-xs text-fit-muted">steps today</p>
      </div>
    </div>
  );
};

const ChallengeCard = ({ challenge }: { challenge: typeof challenges[0] }) => {
  return (
    <div className="fit-card p-4 mb-3">
      <h3 className="font-medium text-fit-primary mb-1">{challenge.title}</h3>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-fit-muted">{challenge.participants} participants</span>
        <span className="text-xs text-fit-muted">{challenge.daysLeft} days left</span>
      </div>
      <div className="h-1.5 bg-fit-secondary/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-fit-accent rounded-full"
          style={{ width: `${challenge.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const AchievementCard = ({ achievement }: { achievement: typeof achievements[0] }) => {
  const isCompleted = achievement.progress >= achievement.total;
  
  return (
    <div className={`fit-card p-4 mb-3 ${isCompleted ? 'border-amber-500/30' : ''}`}>
      <div className="flex items-start">
        <div className={`p-3 rounded-xl ${isCompleted ? 'bg-amber-500/10' : 'bg-fit-secondary/30'} mr-3`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-fit-primary mb-0.5">{achievement.title}</h3>
          <p className="text-xs text-fit-muted mb-2">{achievement.description}</p>
          <div className="flex justify-between items-center">
            <div className="h-1.5 bg-fit-secondary/30 rounded-full overflow-hidden flex-1 mr-3">
              <div 
                className={`h-full rounded-full ${isCompleted ? 'bg-amber-500' : 'bg-fit-accent'}`}
                style={{ width: `${Math.min(100, (achievement.progress / achievement.total) * 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-fit-primary">
              {achievement.progress}/{achievement.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Community = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-fit-background">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-fit-primary" />
        </button>
        <h1 className="text-xl font-semibold text-fit-primary">Community</h1>
      </header>

      <main className="pb-20 px-6">
        <Tabs defaultValue="leaderboard" className="animate-fade-in">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="leaderboard" className="flex items-center">
              <Trophy className="h-4 w-4 mr-1.5" />
              <span>Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center">
              <Users className="h-4 w-4 mr-1.5" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center">
              <Award className="h-4 w-4 mr-1.5" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard" className="animate-slide-up">
            <h2 className="text-sm font-medium text-fit-muted mb-3">Friends Activity</h2>
            {friends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </TabsContent>
          
          <TabsContent value="challenges" className="animate-slide-up">
            <h2 className="text-sm font-medium text-fit-muted mb-3">Active Challenges</h2>
            {challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </TabsContent>
          
          <TabsContent value="achievements" className="animate-slide-up">
            <h2 className="text-sm font-medium text-fit-muted mb-3">Your Achievements</h2>
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Community;
