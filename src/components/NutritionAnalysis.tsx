
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

interface FoodEntry {
  id: string;
  name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  date: string;
}

interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const NutritionAnalysis = () => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const fetchFoodEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log("Fetching food entries for user:", user.id, "on date:", selectedDate);
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', selectedDate)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Food entries fetched:", data?.length || 0, "entries");
      setFoodEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching food entries:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodEntries();
  }, [user, selectedDate]);

  const calculateTotalsByMealType = () => {
    const mealTotals: Record<string, NutrientTotals> = {};
    
    foodEntries.forEach(entry => {
      if (!mealTotals[entry.meal_type]) {
        mealTotals[entry.meal_type] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      
      mealTotals[entry.meal_type].calories += entry.calories;
      mealTotals[entry.meal_type].protein += entry.protein;
      mealTotals[entry.meal_type].carbs += entry.carbs;
      mealTotals[entry.meal_type].fat += entry.fat;
    });
    
    return Object.entries(mealTotals).map(([meal_type, nutrients]) => ({
      name: meal_type,
      ...nutrients
    }));
  };

  const calculateMacroDistribution = () => {
    const totals = foodEntries.reduce(
      (acc, entry) => {
        acc.protein += entry.protein;
        acc.carbs += entry.carbs;
        acc.fat += entry.fat;
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );
    
    const total = totals.protein + totals.carbs + totals.fat;
    
    if (total === 0) return [];
    
    return [
      { name: 'Protein', value: totals.protein },
      { name: 'Carbs', value: totals.carbs },
      { name: 'Fat', value: totals.fat }
    ];
  };

  const calculateDailyTotals = () => {
    return foodEntries.reduce(
      (acc, entry) => {
        acc.calories += entry.calories;
        acc.protein += entry.protein;
        acc.carbs += entry.carbs;
        acc.fat += entry.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-fit-purple" />
      </div>
    );
  }

  const dailyTotals = calculateDailyTotals();
  const mealTypeData = calculateTotalsByMealType();
  const macroDistribution = calculateMacroDistribution();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nutrition Analysis</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {foodEntries.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-8 w-8 text-amber-500" />
              <p className="text-gray-500">No food entries found for this date.</p>
              <p className="text-sm text-gray-400">Try selecting a different date or add food entries in the Food Tracking page.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Totals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-fit-accent">{dailyTotals.calories}</p>
                  <p className="text-sm text-gray-500">Calories</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-fit-accent">{dailyTotals.protein}g</p>
                  <p className="text-sm text-gray-500">Protein</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-fit-accent">{dailyTotals.carbs}g</p>
                  <p className="text-sm text-gray-500">Carbs</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-fit-accent">{dailyTotals.fat}g</p>
                  <p className="text-sm text-gray-500">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Macro Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}g`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calories by Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mealTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calories" fill="#8884d8" name="Calories" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nutrients by Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mealTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="protein" fill="#8884d8" name="Protein (g)" />
                    <Bar dataKey="carbs" fill="#82ca9d" name="Carbs (g)" />
                    <Bar dataKey="fat" fill="#ffc658" name="Fat (g)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NutritionAnalysis;
