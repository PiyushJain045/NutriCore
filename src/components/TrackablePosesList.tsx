
import React, { useState } from 'react';
import { X, ChevronRight, Camera, Dumbbell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PoseDetection from './PoseDetection';

interface PoseCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  poses: {
    id: string;
    name: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
}

const poseCategories: PoseCategory[] = [
  {
    id: 'yoga',
    name: 'Yoga Poses',
    icon: Activity,
    poses: [
      { id: 'y1', name: 'Downward Dog', difficulty: 'beginner' },
      { id: 'y2', name: 'Warrior I', difficulty: 'beginner' },
      { id: 'y3', name: 'Warrior II', difficulty: 'intermediate' },
      { id: 'y4', name: 'Tree Pose', difficulty: 'beginner' },
      { id: 'y5', name: 'Chair Pose', difficulty: 'intermediate' },
      { id: 'y6', name: 'Crow Pose', difficulty: 'advanced' },
    ]
  },
  {
    id: 'strength',
    name: 'Strength Exercises',
    icon: Dumbbell,
    poses: [
      { id: 's1', name: 'Squat', difficulty: 'beginner' },
      { id: 's2', name: 'Plank', difficulty: 'beginner' },
      { id: 's3', name: 'Push-up', difficulty: 'intermediate' },
      { id: 's4', name: 'Deadlift', difficulty: 'intermediate' },
      { id: 's5', name: 'Lunge', difficulty: 'beginner' },
      { id: 's6', name: 'Burpee', difficulty: 'advanced' },
    ]
  },
  {
    id: 'cardio',
    name: 'Cardio Exercises',
    icon: Activity,
    poses: [
      { id: 'c1', name: 'Jumping Jack', difficulty: 'beginner' },
      { id: 'c2', name: 'High Knees', difficulty: 'beginner' },
      { id: 'c3', name: 'Mountain Climber', difficulty: 'intermediate' },
      { id: 'c4', name: 'Jump Squat', difficulty: 'intermediate' },
      { id: 'c5', name: 'Burpee', difficulty: 'advanced' },
    ]
  },
];

interface TrackablePosesListProps {
  onClose: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700';
    case 'intermediate':
      return 'bg-blue-100 text-blue-700';
    case 'advanced':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const TrackablePosesList: React.FC<TrackablePosesListProps> = ({ onClose }) => {
  const [selectedPose, setSelectedPose] = useState<string | null>(null);

  const handlePoseClick = (poseName: string) => {
    setSelectedPose(poseName);
  };

  const handlePoseClose = () => {
    setSelectedPose(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-x-0 top-0 bottom-0 z-50 h-full">
        <div className="flex h-full flex-col bg-white shadow-lg animate-in slide-in-from-bottom rounded-t-xl">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Trackable Exercises</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-fit-muted">
              Select an exercise to track your form with AI
            </p>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-4">
              {poseCategories.map((category) => (
                <Collapsible key={category.id} defaultOpen className="rounded-lg border border-border/40 overflow-hidden">
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-fit-card/80">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-fit-accent/10 flex items-center justify-center">
                        <category.icon className="h-4 w-4 text-fit-accent" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-fit-muted" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 space-y-2">
                      {category.poses.map((pose) => (
                        <div 
                          key={pose.id} 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-fit-card/80 cursor-pointer"
                          onClick={() => handlePoseClick(pose.name)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-fit-card flex items-center justify-center">
                              <Camera className="h-5 w-5 text-fit-muted" />
                            </div>
                            <div>
                              <h3 className="font-medium">{pose.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs inline-block mt-1 ${getDifficultyColor(pose.difficulty)}`}>
                                {pose.difficulty.charAt(0).toUpperCase() + pose.difficulty.slice(1)}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedPose && (
        <PoseDetection poseName={selectedPose} onClose={handlePoseClose} />
      )}
    </div>
  );
};

export default TrackablePosesList;
