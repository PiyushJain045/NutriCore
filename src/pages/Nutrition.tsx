
import { useState } from 'react';
import { ArrowLeft, ChevronRight, Apple, Pizza, Coffee, PanelRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Progress } from '@/components/ui/progress';

const Nutrition = () => {
  const navigate = useNavigate();
  
  const nutritionSummary = {
    calories: {
      consumed: 1650,
      goal: 2200
    },
    macros: {
      protein: {
        consumed: 75,
        goal: 110,
        unit: 'g'
      },
      carbs: {
        consumed: 190,
        goal: 250,
        unit: 'g'
      },
      fat: {
        consumed: 55,
        goal: 70,
        unit: 'g'
      }
    }
  };
  
  const todaysMeals = [
    {
      id: 1,
      type: 'breakfast',
      time: '7:30 AM',
      items: [
        { name: 'Oatmeal with blueberries', calories: 320 },
        { name: 'Greek yogurt', calories: 150 },
        { name: 'Black coffee', calories: 5 }
      ],
      totalCalories: 475
    },
    {
      id: 2,
      type: 'lunch',
      time: '12:15 PM',
      items: [
        { name: 'Grilled chicken salad', calories: 350 },
        { name: 'Whole grain bread', calories: 120 },
        { name: 'Apple', calories: 80 }
      ],
      totalCalories: 550
    },
    {
      id: 3,
      type: 'snack',
      time: '3:30 PM',
      items: [
        { name: 'Mixed nuts', calories: 180 },
        { name: 'Protein shake', calories: 150 }
      ],
      totalCalories: 330
    },
    {
      id: 4,
      type: 'dinner',
      time: '7:00 PM',
      items: [
        { name: 'Grilled salmon', calories: 220 },
        { name: 'Steamed vegetables', calories: 75 }
      ],
      totalCalories: 295
    }
  ];
  
  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="h-5 w-5 text-blue-500" />;
      case 'lunch':
        return <Apple className="h-5 w-5 text-green-500" />;
      case 'dinner':
        return <PanelRight className="h-5 w-5 text-purple-500" />;
      case 'snack':
        return <Pizza className="h-5 w-5 text-amber-500" />;
      default:
        return <Apple className="h-5 w-5 text-fit-accent" />;
    }
  };
  
  const calculatePercentage = (consumed: number, goal: number) => {
    return Math.min(100, Math.round((consumed / goal) * 100));
  };
  
  const caloriesPercentage = calculatePercentage(
    nutritionSummary.calories.consumed,
    nutritionSummary.calories.goal
  );
  
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
        <div className="fit-card p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-medium text-fit-primary">Daily Intake</h2>
              <p className="text-xs text-fit-muted mt-0.5">Today, June 10</p>
            </div>
            <span className="text-lg font-semibold text-fit-primary">
              {nutritionSummary.calories.consumed} / {nutritionSummary.calories.goal} cal
            </span>
          </div>
          
          <div className="mb-5">
            <Progress value={caloriesPercentage} className="h-2" />
            <p className="text-xs text-fit-muted mt-1 text-right">
              {nutritionSummary.calories.goal - nutritionSummary.calories.consumed} calories remaining
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(nutritionSummary.macros).map(([key, macro]) => (
              <div key={key} className="text-center p-2 bg-fit-secondary/5 rounded-lg">
                <h3 className="text-xs text-fit-muted capitalize mb-1">{key}</h3>
                <p className="font-medium text-fit-primary">
                  {macro.consumed}/{macro.goal}{macro.unit}
                </p>
                <Progress 
                  value={calculatePercentage(macro.consumed, macro.goal)} 
                  className="h-1 mt-1"
                  indicatorColor={
                    key === "protein" ? "bg-green-500" : 
                    key === "carbs" ? "bg-amber-500" : "bg-purple-500"
                  }
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-fit-muted">Today's Meals</h2>
          <button
            onClick={() => navigate('/food-tracking')}
            className="text-xs font-medium text-fit-accent flex items-center"
          >
            Track Food <Plus className="h-3 w-3 ml-1" />
          </button>
        </div>
        
        {todaysMeals.map((meal) => (
          <div 
            key={meal.id} 
            className="fit-card p-4 mb-3"
            onClick={() => navigate('/food-tracking')}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-fit-secondary/10 flex items-center justify-center mr-3">
                  {getMealIcon(meal.type)}
                </div>
                <div>
                  <h3 className="font-medium text-fit-primary capitalize">{meal.type}</h3>
                  <span className="text-xs text-fit-muted">{meal.time}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">{meal.totalCalories} cal</span>
                <ChevronRight className="h-4 w-4 text-fit-muted" />
              </div>
            </div>
            
            <div className="pl-11 text-sm">
              {meal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-t border-border/10 first:border-0">
                  <span className="text-fit-primary">{item.name}</span>
                  <span className="text-fit-muted">{item.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      
      <Navigation />
    </div>
  );
};

export default Nutrition;
