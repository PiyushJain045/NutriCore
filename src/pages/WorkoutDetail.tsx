
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Camera, BarChart3, CheckCircle, X } from 'lucide-react';
import { CircleProgress } from '@/components/CircleProgress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const positionFeedback = [
  "Keep your back straight",
  "Lower your knees slightly",
  "Great form!",
  "Extend your arms fully",
  "Breathe steadily"
];

const WorkoutDetail = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [calories, setCalories] = useState(0);
  const [reps, setReps] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    // Simulate workout progress
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            toast.success("Workout completed!");
            return 100;
          }
          return prev + 0.5;
        });
        
        setCalories(prev => prev + 0.3);
        
        if (Math.random() > 0.7) {
          setReps(prev => prev + 1);
        }
        
        if (Math.random() > 0.8) {
          const newFeedback = positionFeedback[Math.floor(Math.random() * positionFeedback.length)];
          setFeedback(newFeedback);
          
          if (newFeedback === "Great form!") {
            setAccuracy(prev => Math.min(100, prev + 5));
          } else {
            setAccuracy(prev => Math.max(60, prev - 2));
          }
          
          toast.info(newFeedback, {
            duration: 2000,
          });
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast.info("Workout started", {
        description: "Position monitoring active",
        icon: <Camera className="h-5 w-5 text-blue-500" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-fit-background flex flex-col">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-fit-primary" />
        </button>
        <h1 className="text-xl font-semibold text-fit-primary">Full Body HIIT</h1>
        <button 
          className="h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <X className="h-5 w-5 text-fit-primary" />
        </button>
      </header>

      <main className="flex-1 px-6 pb-8">
        <div className="fit-card p-4 mb-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-fit-muted">Current Exercise</p>
              <h2 className="font-semibold text-fit-primary">Jumping Jacks</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-fit-muted">Next</p>
              <h3 className="text-sm text-fit-primary">Push-ups</h3>
            </div>
          </div>
          
          <Progress value={progress} className="my-4 h-2 bg-fit-secondary/30" indicatorClassName="bg-fit-accent" />
          
          <div className="flex justify-between text-xs text-fit-muted">
            <span>00:{Math.floor(progress * 0.3).toString().padStart(2, '0')}</span>
            <span>00:30</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="fit-card p-4 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <BarChart3 className="h-5 w-5 text-fit-primary mb-1" />
            <span className="font-semibold text-fit-primary text-lg">{Math.floor(calories)}</span>
            <span className="text-xs text-fit-muted">Calories</span>
          </div>
          
          <div className="fit-card p-4 flex flex-col items-center justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CheckCircle className="h-5 w-5 text-fit-primary mb-1" />
            <span className="font-semibold text-fit-primary text-lg">{reps}</span>
            <span className="text-xs text-fit-muted">Reps</span>
          </div>
        </div>
        
        <div className="fit-card p-6 mb-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <CircleProgress 
                value={accuracy} 
                maxValue={100} 
                className={`text-fit-accent ${accuracy > 80 ? 'text-green-500' : accuracy > 60 ? 'text-amber-500' : 'text-red-500'}`} 
                radius={40}
                strokeWidth={4}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">{accuracy}%</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-fit-primary mb-1">Form Accuracy</h3>
              <p className="text-sm text-fit-muted">
                {feedback || "Maintain proper form for best results"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-52 bg-gray-100 fit-card overflow-hidden mb-6 flex items-center justify-center relative animate-slide-up" style={{ animationDelay: '400ms' }}>
          <Camera className="h-10 w-10 text-fit-muted" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-1 border-l border-dashed border-fit-accent/50"></div>
          </div>
          {isPlaying && (
            <div className="absolute left-1/2 top-1/2 h-44 w-20 -ml-10 -mt-24">
              <div className="absolute left-0 top-0 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft"></div>
              <div className="absolute right-0 top-5 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute left-3 top-14 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute right-2 top-24 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute left-0 bottom-8 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute right-1 bottom-0 h-3 w-3 rounded-full bg-fit-accent animate-pulse-soft" style={{ animationDelay: '0.1s' }}></div>
            </div>
          )}
          <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
            Position Monitoring {isPlaying ? 'Active' : 'Paused'}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-80 border-t border-border/40 p-6">
        <Button 
          onClick={togglePlayPause}
          className="w-full h-14 rounded-full bg-fit-accent hover:bg-fit-accent/90 text-white gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              <span>Pause Workout</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>{progress > 0 ? 'Resume Workout' : 'Start Workout'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDetail;
