
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import DietPlan from '@/components/DietPlan';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DietPlanPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!user) {
      toast.error("Please sign in to generate a diet plan.");
      return;
    }

    try {
      setIsGenerating(true);
      
      console.log("Generating diet plan for user:", user.id);
      
      // Call the edge function to generate a diet plan
      const { data: functionData, error: functionError } = await supabase.functions
        .invoke('generate-diet-plan', {
          body: { userId: user.id }
        });
      
      if (functionError) {
        console.error("Function error:", functionError);
        throw new Error(functionError.message || 'Failed to invoke function');
      }
      
      if (!functionData) {
        throw new Error('No response from diet plan generator');
      }
      
      console.log("Diet plan generated successfully:", functionData);
      
      toast.success("Your diet plan has been generated!");
      
      // Force refresh the component to show the new plan
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error('Error generating diet plan:', error);
      toast.error(error.message || "Failed to generate diet plan");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Diet Plan</h1>
      </header>

      <main className="pb-20 px-6">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-gray-600">Generating your personalized diet plan...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        ) : (
          <DietPlan onGeneratePlan={handleGeneratePlan} />
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default DietPlanPage;
