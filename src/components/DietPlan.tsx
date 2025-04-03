
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Droplets, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type NutrientInfo = {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type HydrationInfo = {
  amount: number;
  schedule: string;
};

type DietPlanData = {
  id?: string;
  breakfast: NutrientInfo;
  lunch: NutrientInfo;
  snacks: NutrientInfo;
  dinner: NutrientInfo;
  hydration: HydrationInfo;
  special_note?: string | null;
  created_at?: string;
  updated_at?: string;
};

const DietPlan = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlanData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDietPlan = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching diet plan:', error);
        throw error;
      }
      
      if (data) {
        setDietPlan(data as DietPlanData);
      }
    } catch (error) {
      console.error('Error in fetchDietPlan:', error);
      toast({
        title: "Could not load diet plan",
        description: "There was an error loading your diet plan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDietPlan = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate a diet plan.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setGenerating(true);
      toast({
        title: "Generating diet plan",
        description: "Our AI nutritionist is creating your personalized diet plan. This may take a moment...",
      });
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-diet-plan', {
        body: { userId: user.id }
      });
      
      if (functionError) {
        console.error('Error invoking generate-diet-plan function:', functionError);
        throw new Error(functionError.message || 'Failed to generate diet plan');
      }
      
      toast({
        title: "Diet plan created!",
        description: "Your personalized diet plan is ready.",
      });
      
      // Refresh the diet plan data
      await fetchDietPlan();
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Failed to generate diet plan",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, [user]);

  // Function to render a meal card
  const renderMealCard = (title: string, meal: NutrientInfo, icon: React.ReactNode) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {icon}
            <CardTitle className="text-lg ml-2">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-fit-purple/10 text-fit-purple border-fit-purple/20">
            {meal.calories} calories
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{meal.meal}</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-blue-100 rounded-md">
            <span className="block font-semibold">Protein</span>
            <span>{meal.protein}g</span>
          </div>
          <div className="text-center p-2 bg-amber-100 rounded-md">
            <span className="block font-semibold">Carbs</span>
            <span>{meal.carbs}g</span>
          </div>
          <div className="text-center p-2 bg-green-100 rounded-md">
            <span className="block font-semibold">Fat</span>
            <span>{meal.fat}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-16 w-16 mx-auto mb-4 text-fit-muted" />
        <h2 className="text-xl font-bold mb-2">No Diet Plan Found</h2>
        <p className="text-fit-muted mb-6">You don't have a personalized diet plan yet.</p>
        <Button 
          onClick={generateDietPlan} 
          disabled={generating}
          className="bg-fit-purple hover:bg-fit-purple-dark"
        >
          {generating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Utensils className="h-4 w-4 mr-2" />
              Generate Diet Plan
            </>
          )}
        </Button>
      </div>
    );
  }

  const totalCalories = dietPlan.breakfast.calories + dietPlan.lunch.calories + 
                        dietPlan.snacks.calories + dietPlan.dinner.calories;
  const totalProtein = dietPlan.breakfast.protein + dietPlan.lunch.protein + 
                       dietPlan.snacks.protein + dietPlan.dinner.protein;
  const totalCarbs = dietPlan.breakfast.carbs + dietPlan.lunch.carbs + 
                     dietPlan.snacks.carbs + dietPlan.dinner.carbs;
  const totalFat = dietPlan.breakfast.fat + dietPlan.lunch.fat + 
                   dietPlan.snacks.fat + dietPlan.dinner.fat;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-fit-purple">Your Diet Plan</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateDietPlan} 
          disabled={generating}
          className="text-fit-purple"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Regenerate Plan'}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Daily Nutrition Summary</CardTitle>
          <CardDescription>
            Total calories: <span className="font-semibold">{totalCalories}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-100 rounded-md">
              <span className="block font-semibold">Protein</span>
              <span className="text-lg">{totalProtein}g</span>
            </div>
            <div className="text-center p-3 bg-amber-100 rounded-md">
              <span className="block font-semibold">Carbs</span>
              <span className="text-lg">{totalCarbs}g</span>
            </div>
            <div className="text-center p-3 bg-green-100 rounded-md">
              <span className="block font-semibold">Fat</span>
              <span className="text-lg">{totalFat}g</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {renderMealCard("Breakfast", dietPlan.breakfast, <Utensils className="h-5 w-5 text-fit-purple" />)}
        {renderMealCard("Lunch", dietPlan.lunch, <Utensils className="h-5 w-5 text-fit-purple" />)}
        {renderMealCard("Snacks", dietPlan.snacks, <Utensils className="h-5 w-5 text-fit-purple" />)}
        {renderMealCard("Dinner", dietPlan.dinner, <Utensils className="h-5 w-5 text-fit-purple" />)}
      </div>

      <Card className="mt-6 bg-blue-50">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle className="text-lg">Hydration Plan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Daily water intake:</span>
            <span>{dietPlan.hydration.amount} liters</span>
          </div>
          <p className="text-sm">{dietPlan.hydration.schedule}</p>
        </CardContent>
      </Card>

      {dietPlan.special_note && (
        <Card className="mt-4 bg-amber-50">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-lg">Special Note</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{dietPlan.special_note}</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-xs text-center text-fit-muted">
        <p>Last updated: {new Date(dietPlan.updated_at || dietPlan.created_at || '').toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DietPlan;
