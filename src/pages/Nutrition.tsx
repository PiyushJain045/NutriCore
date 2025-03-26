
import { ArrowLeft, Apple, PieChart, Search, Plus, Brain, Utensils } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleProgress } from '@/components/CircleProgress';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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

const meals = [
  {
    id: 1,
    type: "Breakfast",
    time: "8:30 AM",
    items: [
      { name: "Oatmeal with Berries", calories: 320, protein: 12, carbs: 58, fat: 6 },
      { name: "Greek Yogurt", calories: 150, protein: 17, carbs: 6, fat: 4 }
    ],
    totalCalories: 470
  },
  {
    id: 2,
    type: "Lunch",
    time: "12:45 PM",
    items: [
      { name: "Grilled Chicken Salad", calories: 380, protein: 35, carbs: 18, fat: 16 },
      { name: "Whole Grain Bread", calories: 120, protein: 4, carbs: 22, fat: 2 }
    ],
    totalCalories: 500
  },
  {
    id: 3,
    type: "Snack",
    time: "3:30 PM",
    items: [
      { name: "Protein Shake", calories: 180, protein: 25, carbs: 10, fat: 3 },
      { name: "Apple", calories: 95, protein: 0, carbs: 25, fat: 0 }
    ],
    totalCalories: 275
  }
];

const MealCard = ({ meal }: { meal: typeof meals[0] }) => {
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

  const nutritionSummary = {
    calories: { consumed: 1245, goal: 2000 },
    protein: { consumed: 89, goal: 150 },
    carbs: { consumed: 140, goal: 200 },
    fat: { consumed: 42, goal: 65 }
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
          <Input placeholder="Search for food..." className="pl-10 bg-fit-card border-none h-12" />
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
                <span className="text-xs text-fit-muted ml-auto">{Math.round((nutritionSummary.protein.consumed / nutritionSummary.calories.consumed * 4) * 100)}%</span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-xs text-fit-primary">Carbs</span>
                <span className="text-xs text-fit-muted ml-auto">{Math.round((nutritionSummary.carbs.consumed / nutritionSummary.calories.consumed * 4) * 100)}%</span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-fit-primary">Fat</span>
                <span className="text-xs text-fit-muted ml-auto">{Math.round((nutritionSummary.fat.consumed / nutritionSummary.calories.consumed * 9) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-sm font-medium text-fit-muted">Today's Meals</h2>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      className="relative overflow-hidden font-bold text-white shadow-lg transition-all duration-300 
                                transform hover:scale-105 active:scale-95"
                      style={{
                        background: "linear-gradient(45deg, #0EA5E9, #10B981)",
                        padding: "0.625rem 1.25rem",
                        borderRadius: "0.75rem"
                      }}
                      asChild
                    >
                      <Link to="/food-tracking" className="flex items-center">
                        <Utensils className="h-5 w-5 mr-1" />
                        <span className="mr-1">Smart Add Meal</span>
                        <Brain className="h-4 w-4 text-white/80" />
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
        
        {meals.map(meal => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </main>

      <Navigation />
    </div>
  );
};

export default Nutrition;
