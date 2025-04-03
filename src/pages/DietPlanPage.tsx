
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import DietPlan from '@/components/DietPlan';

const DietPlanPage = () => {
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
        <h1 className="text-xl font-semibold text-fit-primary">Diet Plan</h1>
      </header>

      <main className="pb-20 px-6">
        <DietPlan />
      </main>

      <Navigation />
    </div>
  );
};

export default DietPlanPage;
