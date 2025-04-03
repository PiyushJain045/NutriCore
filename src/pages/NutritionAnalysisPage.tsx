
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NutritionAnalysis from '@/components/NutritionAnalysis';
import FoodEntriesList from '@/components/FoodEntriesList';

const NutritionAnalysisPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Nutrition Analysis</h1>
      </header>

      <main className="pb-20 px-6 space-y-8">
        <NutritionAnalysis />
        <FoodEntriesList />
      </main>

      <Navigation />
    </div>
  );
};

export default NutritionAnalysisPage;
