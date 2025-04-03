
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Define the types for the diet plan data
export interface NutrientInfo {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface HydrationInfo {
  total_liters: number;
  reminder_times: string[];
}

export interface DietPlanData {
  breakfast: NutrientInfo;
  lunch: NutrientInfo;
  snacks: NutrientInfo;
  dinner: NutrientInfo;
  hydration: HydrationInfo;
  special_note: string;
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface DietPlanProps {
  onGeneratePlan: () => void;
}

const DietPlan: React.FC<DietPlanProps> = ({ onGeneratePlan }) => {
  const [dietPlan, setDietPlan] = React.useState<DietPlanData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchDietPlan = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching diet plan:', error);
          setLoading(false);
          return;
        }

        if (data) {
          // Convert from database schema to component schema
          const planData: DietPlanData = {
            breakfast: data.breakfast as unknown as NutrientInfo,
            lunch: data.lunch as unknown as NutrientInfo,
            snacks: data.snacks as unknown as NutrientInfo,
            dinner: data.dinner as unknown as NutrientInfo,
            hydration: data.hydration as unknown as HydrationInfo,
            special_note: data.special_note,
            id: data.id,
            user_id: data.user_id,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          
          setDietPlan(planData);
        }
      } catch (error) {
        console.error('Error in diet plan fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlan();
  }, [user]);

  const renderMealCard = (meal: NutrientInfo, title: string) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium mb-1">{meal.meal}</p>
        <div className="grid grid-cols-4 gap-2 text-sm mt-2">
          <div>
            <p className="font-semibold text-fit-accent">{meal.calories}</p>
            <p className="text-xs text-gray-500">calories</p>
          </div>
          <div>
            <p className="font-semibold text-fit-accent">{meal.protein}g</p>
            <p className="text-xs text-gray-500">protein</p>
          </div>
          <div>
            <p className="font-semibold text-fit-accent">{meal.carbs}g</p>
            <p className="text-xs text-gray-500">carbs</p>
          </div>
          <div>
            <p className="font-semibold text-fit-accent">{meal.fat}g</p>
            <p className="text-xs text-gray-500">fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-fit-purple" />
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="py-6 text-center">
        <p className="mb-4">You don't have a diet plan yet.</p>
        <Button onClick={onGeneratePlan}>Generate Diet Plan</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderMealCard(dietPlan.breakfast, "Breakfast")}
      {renderMealCard(dietPlan.lunch, "Lunch")}
      {renderMealCard(dietPlan.snacks, "Snacks")}
      {renderMealCard(dietPlan.dinner, "Dinner")}

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Hydration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{dietPlan.hydration.total_liters} liters per day</p>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Reminder times:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {dietPlan.hydration.reminder_times.map((time, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {time}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {dietPlan.special_note && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Special Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{dietPlan.special_note}</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex justify-center">
        <Button onClick={onGeneratePlan} variant="outline">
          Regenerate Diet Plan
        </Button>
      </div>
    </div>
  );
};

export default DietPlan;
