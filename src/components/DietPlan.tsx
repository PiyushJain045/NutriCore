
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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
  const [dietPlan, setDietPlan] = useState<DietPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDietPlan = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching diet plan for user:", user.id);
        const { data, error } = await supabase
          .from('diet_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching diet plan:', error);
          setLoading(false);
          return;
        }

        if (data) {
          console.log("Diet plan found:", data);
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
        } else {
          console.log("No diet plan found for user");
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
            <p className="font-semibold text-purple-600">{meal.calories}</p>
            <p className="text-xs text-gray-500">calories</p>
          </div>
          <div>
            <p className="font-semibold text-purple-600">{meal.protein}g</p>
            <p className="text-xs text-gray-500">protein</p>
          </div>
          <div>
            <p className="font-semibold text-purple-600">{meal.carbs}g</p>
            <p className="text-xs text-gray-500">carbs</p>
          </div>
          <div>
            <p className="font-semibold text-purple-600">{meal.fat}g</p>
            <p className="text-xs text-gray-500">fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="py-6">
        <Card>
          <CardContent className="flex flex-col items-center py-8 gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <div>
              <h3 className="text-lg font-medium mb-2">No Diet Plan Found</h3>
              <p className="text-gray-500 mb-6">You don't have a personalized diet plan yet.</p>
              <Button onClick={onGeneratePlan} className="w-full">Generate Diet Plan</Button>
            </div>
          </CardContent>
        </Card>
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

      <div className="mt-6 flex justify-center">
        <Button onClick={onGeneratePlan} variant="outline">
          Regenerate Diet Plan
        </Button>
      </div>
    </div>
  );
};

export default DietPlan;
