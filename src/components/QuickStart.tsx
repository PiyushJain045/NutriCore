
import { Play, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuickStart = () => {
  return (
    <section className="px-6 py-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-fit-muted">Quick Start</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto text-xs font-medium text-fit-accent hover:text-fit-accent/80 hover:bg-transparent"
        >
          See All
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="fit-card p-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-xl bg-[#4EAF83]/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-[#4EAF83]" />
            </div>
            <div>
              <h3 className="font-medium text-fit-primary">Start Workout</h3>
              <p className="text-xs text-fit-muted">Continue your training</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-fit-card hover:bg-fit-secondary/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="fit-card p-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-xl bg-[#A0D2EB]/10 flex items-center justify-center">
              <BarChart className="h-5 w-5 text-[#A0D2EB]" />
            </div>
            <div>
              <h3 className="font-medium text-fit-primary">Weekly Progress</h3>
              <p className="text-xs text-fit-muted">View your stats</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-fit-card hover:bg-fit-secondary/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

import { ChevronRight } from 'lucide-react';

export default QuickStart;
