
import { useState } from "react";
import { ArrowLeft, Play, Pause, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircleProgress } from "@/components/CircleProgress";
import Navigation from "@/components/Navigation";

const exerciseSteps = [
  {
    name: "Warm Up",
    duration: "5 min",
    completed: true
  },
  {
    name: "Jumping Jacks",
    reps: "20 reps",
    sets: "3 sets",
    completed: true
  },
  {
    name: "Push-ups",
    reps: "15 reps",
    sets: "3 sets",
    active: true
  },
  {
    name: "Squats",
    reps: "20 reps",
    sets: "3 sets"
  },
  {
    name: "Plank",
    duration: "30 sec",
    sets: "3 sets"
  },
  {
    name: "Cool Down",
    duration: "5 min"
  }
];

const WorkoutDetail = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="min-h-screen bg-fit-background">
      <header className="pt-14 px-6 pb-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Full Body HIIT</h1>
        </div>
        <p className="text-fit-muted text-sm mt-1">30 min • Medium</p>
      </header>
      
      <main className="pb-20 px-6">
        <div className="mb-8 fit-card p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Current Exercise</h2>
              <p className="text-fit-muted text-sm">Set 2 of 3</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full h-14 w-14 ${isPlaying ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-fit-card p-3 rounded-xl">
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80" 
                alt="Push-up demonstration" 
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">Push-ups</h3>
              <p className="text-fit-muted text-sm">15 reps • 3 sets</p>
              <p className="text-xs mt-2 text-fit-accent">Keep your back straight</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-fit-muted">Progress</span>
              <span className="font-medium">8/15</span>
            </div>
            <Progress value={55} className="h-2 bg-gray-100" />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Workout Progress</h2>
            <CircleProgress value={50} maxValue={100} className="text-fit-accent" />
          </div>
          
          <div className="space-y-3">
            {exerciseSteps.map((step, index) => (
              <div key={index} className="fit-card p-4 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100 text-green-500' : 
                    step.active ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? '✓' : (index + 1)}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.name}</h3>
                    <p className="text-xs text-fit-muted">
                      {step.reps ? `${step.reps} • ` : ''}
                      {step.duration ? `${step.duration} • ` : ''}
                      {step.sets}
                    </p>
                  </div>
                </div>
                {!step.completed && !step.active && (
                  <Button variant="ghost" size="sm" className="text-fit-muted p-0 h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default WorkoutDetail;
