
import { Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const workouts = [
  {
    id: 1,
    title: "Full Body HIIT",
    duration: "30 min",
    level: "Medium",
    color: "#4EAF83"
  },
  {
    id: 2,
    title: "Yoga Flow",
    duration: "45 min",
    level: "Easy",
    color: "#A0D2EB"
  },
  {
    id: 3,
    title: "Strength Training",
    duration: "50 min",
    level: "Hard",
    color: "#FF6B6B"
  }
];

const WorkoutSection = () => {
  return (
    <section className="px-6 py-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-fit-muted">Recommended Workouts</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto text-xs font-medium text-fit-accent hover:text-fit-accent/80 hover:bg-transparent"
        >
          See All
        </Button>
      </div>
      
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div key={workout.id} className="fit-card p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div 
                className="h-12 w-12 rounded-xl flex items-center justify-center" 
                style={{ backgroundColor: `${workout.color}10` }}
              >
                <Dumbbell className="h-5 w-5" style={{ color: workout.color }} />
              </div>
              <div>
                <h3 className="font-medium text-fit-primary">{workout.title}</h3>
                <p className="text-xs text-fit-muted">{workout.duration} • {workout.level}</p>
              </div>
            </div>
            <Button 
              className="rounded-xl text-xs h-8 px-3"
              style={{ backgroundColor: `${workout.color}`, color: "white" }}
            >
              Start
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkoutSection;
