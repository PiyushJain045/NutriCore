
import { CircleProgress } from '@/components/CircleProgress';
import { Activity, Flame, Timer } from 'lucide-react';

const ActivitySummary = () => {
  return (
    <section className="px-6 py-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <h2 className="text-sm font-medium text-fit-muted mb-3">Today's Activity</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="fit-card p-4 flex flex-col items-center">
          <div className="relative mb-2 h-14 w-14 flex items-center justify-center">
            <CircleProgress value={65} maxValue={100} className="text-fit-accent" />
            <Activity className="h-5 w-5 text-fit-primary absolute" />
          </div>
          <span className="font-semibold text-fit-primary text-lg">7,842</span>
          <span className="text-xs text-fit-muted">Steps</span>
        </div>
        
        <div className="fit-card p-4 flex flex-col items-center">
          <div className="relative mb-2 h-14 w-14 flex items-center justify-center">
            <CircleProgress value={42} maxValue={100} className="text-[#FF6B6B]" />
            <Flame className="h-5 w-5 text-fit-primary absolute" />
          </div>
          <span className="font-semibold text-fit-primary text-lg">427</span>
          <span className="text-xs text-fit-muted">Calories</span>
        </div>
        
        <div className="fit-card p-4 flex flex-col items-center">
          <div className="relative mb-2 h-14 w-14 flex items-center justify-center">
            <CircleProgress value={28} maxValue={100} className="text-[#4D96FF]" />
            <Timer className="h-5 w-5 text-fit-primary absolute" />
          </div>
          <span className="font-semibold text-fit-primary text-lg">32</span>
          <span className="text-xs text-fit-muted">Minutes</span>
        </div>
      </div>
    </section>
  );
};

export default ActivitySummary;
