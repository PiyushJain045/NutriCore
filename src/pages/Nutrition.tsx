import { useState, useEffect } from 'react';
import { ArrowLeft, Apple, PieChart, Search, Plus, Brain, Utensils, Salad } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleProgress } from '@/components/CircleProgress';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { supabase } from '@/integrations/supabase/client';

interface NutritionSummaryProps {
  calories: { consumed: number; goal: number };
  protein: { consumed: number; goal: number };
  carbs: { consumed: number; goal: number };
  fat: { consumed: number; goal: number };
}

const NutritionSummary = ({ calories, protein, carbs, fat }: NutritionSummaryProps) => {
  return (
    <div className="fit-card p-4 mb-6 animate-fade-in">
      <h2 className="font-semibold text-fit-primary mb-4">Today's Nutrition</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-fit-primary">Calories</span>
          <span className="text-sm text-fit-primary font-medium">
            {calories.consumed} / {calories.goal}
          </span>
        </div>
        <div className="h-2 bg-fit-secondary/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-fit-accent rounded-full"
            style={{ width: `${Math.min(100, (calories.consumed / calories.goal) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-1 h-12 w-12 flex items-center justify-center">
            <CircleProgress value={protein.consumed} maxValue={protein.goal} className="text-blue-500" />
            <span className="text-xs font-medium absolute">{Math.round((protein.consumed / protein.goal) * 100)}%</span>
          </div>
          <span className="text-xs text-fit-muted">Protein</span>
          <span className="text-xs text-fit-primary font-medium">{protein.consumed}g</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-1 h-12 w-12 flex items-center justify-center">
            <CircleProgress value={carbs.consumed} maxValue={carbs.goal} className="text-amber-500" />
            <span className="text-xs font-medium absolute">{Math.round((carbs.consumed / carbs.goal) * 100)}%</span>
          </div>
          <span className="text-xs text-fit-muted">Carbs</span>
          <span className="text-xs text-fit-primary font-medium">{carbs.consumed}g</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-1 h-12 w-12 flex items-center justify-center">
            <CircleProgress value={fat.consumed} maxValue={fat.goal} className="text-green-500" />
            <span className="text-xs font-medium absolute">{Math.round((fat.consumed / fat.goal) * 100)}%</span>
          </div>
          <span className="text-xs text-fit-muted">Fat</span>
          <span className="text-xs text-fit-primary font-medium">{fat.consumed}g</span>
        </div>
      </div>
    </div>
  );
};

interface MealData {
  id: string;
  type: string;
  time: string;
  items: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
}

interface FoodEntry {
  id: string;
  name: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: string;
  date: string;
  created_at: string;
}

const MealCard = ({ meal }: { meal: MealData }) => {
  return (
    <div className="fit-card p-4 mb-3 animate-slide-up" style={{ animationDelay: `${meal.id * 100}ms` }}>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-medium text-fit-primary">{meal.type}</h3>
          <p className="text-xs text-fit-muted">{meal.time}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-fit-primary">{meal.totalCalories}</span>
          <p className="text-xs text-fit-muted">calories</p>
        </div>
      </div>
      
      <div className="border-t border-border/30 pt-2 mt-2">
        {meal.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-1.5">
            <span className="text-sm text-fit-primary">{item.name}</span>
            <span className="text-xs text-fit-muted">{item.calories} cal</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Nutrition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: { consumed: 0, goal: 2000 },
    protein: { consumed: 0, goal: 150 },
    carbs: { consumed: 0, goal: 200 },
    fat: { consumed: 0, goal: 65 }
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        setLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        
        const { data: foodEntries, error } = await supabase
          .from('food_entries')
          .select('*')
          .eq('date', today)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching food entries:', error);
          return;
        }
        
        if (!foodEntries || foodEntries.length === 0) {
          setLoading(false);
          return;
        }
        
        const mealTypes: { [key: string]: MealData } = {};
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        
        foodEntries.forEach((entry: FoodEntry) => {
          const mealType = entry.meal_type || 'Snack';
          
          if (!mealTypes[mealType]) {
            mealTypes[mealType] = {
              id: mealType.toLowerCase().replace(/\s+/g, '-'),
              type: mealType,
              time: formatTime(entry.created_at),
              items: [],
              totalCalories: 0
            };
          }
          
          mealTypes[mealType].items.push({
            name: entry.name,
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat
          });
          
          mealTypes[mealType].totalCalories += entry.calories;
          totalCalories += entry.calories;
          totalProtein += entry.protein;
          totalCarbs += entry.carbs;
          totalFat += entry.fat;
        });
        
        setNutritionSummary({
          calories: { consumed: Math.round(totalCalories), goal: 2000 },
          protein: { consumed: Math.round(totalProtein), goal: 150 },
          carbs: { consumed: Math.round(totalCarbs), goal: 200 },
          fat: { consumed: Math.round(totalFat), goal: 65 }
        });
        
        const mealArray = Object.values(mealTypes);
        setMeals(mealArray);
        
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchFoodEntries:', error);
        setLoading(false);
      }
    };
    
    fetchFoodEntries();
  }, []);
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <h1 className="text-xl font-semibold text-fit-primary">Nutrition</h1>
      </header>

      <main className="pb-20 px-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fit-muted" />
          <Input 
            placeholder="Search for food..." 
            className="pl-10 bg-fit-card border-none h-12" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-6 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="relative flex-1 overflow-hidden font-bold text-white shadow-lg transition-all duration-300 
                            transform hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(45deg, #0f766e, #059669)",
                    padding: "0.625rem 1.25rem",
                    borderRadius: "0.75rem"
                  }}
                  asChild
                >
                  <Link to="/diet-plan" className="flex items-center justify-center">
                    <Salad className="h-5 w-5 mr-2" />
                    <span>AI Diet Plan</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get a personalized diet plan based on your profile!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      className="relative flex-1 overflow-hidden font-bold text-white shadow-lg transition-all duration-300 
                                transform hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(45deg, #0f766e, #059669)",
                        padding: "0.625rem 1.25rem",
                        borderRadius: "0.75rem"
                      }}
                      asChild
                    >
                      <Link to="/food-tracking" className="flex items-center justify-center">
                        <Utensils className="h-5 w-5 mr-2" />
                        <span>Track Food</span>
                        <Brain className="h-4 w-4 text-white/80 ml-1" />
                      </Link>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-3 w-56 text-center">
                    <div className="text-sm font-medium">AI-Powered Meal Tracking!</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Just add your food name and serving size, our AI will calculate all your macros automatically.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </TooltipTrigger>
              <TooltipContent>
                <p>Let AI track your nutrition!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <NutritionSummary {...nutritionSummary} />
        
        <div className="fit-card p-4 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-fit-primary mb-3">Macronutrient Breakdown</h2>
          
          <div className="flex items-center">
            <div className="relative h-24 w-24 flex items-center justify-center">
              <PieChart className="h-full w-full text-fit-muted" />
            </div>
            
            <div className="flex-1 ml-4">
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-fit-primary">Protein</span>
                <span className="text-xs text-fit-muted ml-auto">
                  {nutritionSummary.calories.consumed ? 
                    Math.round((nutritionSummary.protein.consumed / nutritionSummary.calories.consumed * 4) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-xs text-fit-primary">Carbs</span>
                <span className="text-xs text-fit-muted ml-auto">
                  {nutritionSummary.calories.consumed ? 
                    Math.round((nutritionSummary.carbs.consumed / nutritionSummary.calories.consumed * 4) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-fit-primary">Fat</span>
                <span className="text-xs text-fit-muted ml-auto">
                  {nutritionSummary.calories.consumed ? 
                    Math.round((nutritionSummary.fat.consumed / nutritionSummary.calories.consumed * 9) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-sm font-medium text-fit-muted">Today's Meals</h2>
        </div>
        
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-fit-purple align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-fit-muted">Loading your nutrition data...</p>
          </div>
        ) : meals.length > 0 ? (
          meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))
        ) : (
          <div className="fit-card p-8 text-center animate-fade-in">
            <Utensils className="h-10 w-10 text-fit-muted mx-auto mb-3" />
            <h3 className="text-lg font-medium text-fit-primary mb-2">No meals added yet</h3>
            <p className="text-fit-muted mb-4">Start tracking your nutrition by adding your meals.</p>
            <Button 
              className="bg-fit-purple hover:bg-fit-purple-dark"
              onClick={() => navigate('/food-tracking')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Meal
            </Button>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Nutrition;
