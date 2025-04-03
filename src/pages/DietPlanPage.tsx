
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import DietPlan from '@/components/DietPlan';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DietPlanPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate a diet plan.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Call the edge function to generate a diet plan
      const response = await fetch('/api/generate-diet-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate diet plan');
      }

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: "Your diet plan has been generated.",
      });
      
      // Force refresh the component to show the new plan
      window.location.reload();
    } catch (error: any) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate diet plan",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-fit-purple" />
            <p>Generating your personalized diet plan...</p>
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
