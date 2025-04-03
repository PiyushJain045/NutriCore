
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Watch, Activity, HeartPulse } from 'lucide-react';

const SmartWatch = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Smart Watch</h1>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Watch className="w-5 h-5 mr-2 text-fit-accent" />
                Connect Device
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                Pair your smartwatch to sync fitness data automatically.
              </p>
              <Button variant="outline" className="w-full flex justify-between items-center">
                Connect Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-fit-accent" />
                Activity Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                View your steps, distance, calories burned and more.
              </p>
              <Button variant="outline" className="w-full flex justify-between items-center">
                View Metrics
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <HeartPulse className="w-5 h-5 mr-2 text-fit-accent" />
                Health Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-3">
                Monitor your heart rate, sleep patterns and stress levels.
              </p>
              <Button variant="outline" className="w-full flex justify-between items-center">
                View Health Data
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default SmartWatch;
