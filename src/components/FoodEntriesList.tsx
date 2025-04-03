
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

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

const FoodEntriesList = () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-fit-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Food Entries</h2>
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
              <p className="text-center text-gray-500">No food entries for this date.</p>
              <p className="text-sm text-gray-400">Try selecting a different date or add food entries in the Food Tracking page.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Food</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Serving</TableHead>
                    <TableHead>Calories</TableHead>
                    <TableHead>Protein</TableHead>
                    <TableHead>Carbs</TableHead>
                    <TableHead>Fat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell>{entry.meal_type}</TableCell>
                      <TableCell>{entry.serving_size}</TableCell>
                      <TableCell>{entry.calories}</TableCell>
                      <TableCell>{entry.protein}g</TableCell>
                      <TableCell>{entry.carbs}g</TableCell>
                      <TableCell>{entry.fat}g</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodEntriesList;
