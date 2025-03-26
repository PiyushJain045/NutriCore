
import { useState } from 'react';
import { ArrowLeft, ChevronRight, PlayCircle, Camera, Video, Info } from 'lucide-react';
import { CircleProgress } from '@/components/CircleProgress';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackablePosesList from '@/components/TrackablePosesList';

const workoutCategories = [
  { id: 'all', name: 'All' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'strength', name: 'Strength' },
  { id: 'yoga', name: 'Yoga' },
  { id: 'hiit', name: 'HIIT' },
];

const workouts = [
  {
    id: 1,
    title: "Full Body HIIT",
    category: "hiit",
    duration: "30 min",
    calories: "320",
    level: "Medium",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Morning Yoga Flow",
    category: "yoga",
    duration: "45 min",
    calories: "180",
    level: "Easy",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Upper Body Strength",
    category: "strength",
    duration: "50 min",
    calories: "380",
    level: "Hard",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Cardio Blast",
    category: "cardio",
    duration: "25 min",
    calories: "290",
    level: "Medium",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=300&auto=format&fit=crop"
  }
];

const WorkoutCard = ({ workout }: { workout: typeof workouts[0] }) => {
  return (
    <div className="fit-card overflow-hidden mb-3">
      <div className="relative h-36 w-full">
        <img 
          src={workout.image} 
          alt={workout.title} 
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white font-medium">{workout.title}</h3>
          <p className="text-white/80 text-xs">
            {workout.duration} • {workout.calories} cal • {workout.level}
          </p>
        </div>
        <Button 
          size="icon"
          className="absolute right-3 bottom-3 bg-white/20 hover:bg-white/30 text-white h-8 w-8 rounded-full"
        >
          <PlayCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

const Workouts = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showTrackablePoses, setShowTrackablePoses] = useState(false);

  const filteredWorkouts = activeCategory === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.category === activeCategory);

  return (
    <div className="min-h-screen bg-fit-background">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-fit-primary" />
        </button>
        <h1 className="text-xl font-semibold text-fit-primary">Workouts</h1>
      </header>

      <main className="pb-20 px-6">
        <div className="mb-6 animate-fade-in">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-auto p-1 bg-fit-card w-full overflow-x-auto flex no-scrollbar">
              {workoutCategories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="text-xs py-1.5 flex-shrink-0"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="fit-card p-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-fit-accent/10 flex items-center justify-center">
              <Camera className="h-16 w-16 text-fit-accent/30" />
            </div>
            <div className="max-w-[70%]">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-fit-accent/10 text-fit-accent inline-block mb-2">
                New Feature
              </span>
              <h2 className="text-lg font-semibold text-fit-primary mb-1">AI Position Tracking</h2>
              <p className="text-xs text-fit-muted mb-2">
                Get real-time feedback on your form with our new camera-based tracking.
              </p>
              <Button 
                size="sm" 
                className="h-8 text-xs bg-fit-accent hover:bg-fit-accent/90"
                onClick={() => setShowTrackablePoses(true)}
              >
                Try Now
              </Button>
            </div>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-medium text-fit-muted mb-3">
            {activeCategory === 'all' ? 'All Workouts' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Workouts`}
          </h2>
          {filteredWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </main>

      {showTrackablePoses && (
        <TrackablePosesList onClose={() => setShowTrackablePoses(false)} />
      )}

      <Navigation />
    </div>
  );
};

export default Workouts;
