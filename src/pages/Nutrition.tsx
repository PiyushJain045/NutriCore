
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Apple, UtensilsCrossed, Scale } from 'lucide-react';

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Nutrition</h1>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Apple className="w-5 h-5 mr-2 text-fit-accent" />
                Food Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                Log your daily meals and track your calorie intake.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/food-tracking" className="flex justify-between items-center">
                  Track Food
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <UtensilsCrossed className="w-5 h-5 mr-2 text-fit-accent" />
                Diet Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                Get a personalized diet plan based on your fitness goals.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/diet-plan" className="flex justify-between items-center">
                  View Diet Plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Scale className="w-5 h-5 mr-2 text-fit-accent" />
                Nutrition Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                Analyze your diet for nutritional balance and recommendations.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/nutrition-analysis" className="flex justify-between items-center">
                  Analyze Diet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Nutrition;
