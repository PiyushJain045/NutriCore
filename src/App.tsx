
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Registration from '@/pages/Registration';
import Profile from '@/pages/Profile';
import Workouts from '@/pages/Workouts';
import WorkoutDetail from '@/pages/WorkoutDetail';
import NotFound from '@/pages/NotFound';
import Community from '@/pages/Community';
import SmartWatch from '@/pages/SmartWatch';
import Nutrition from '@/pages/Nutrition';
import FoodTracking from '@/pages/FoodTracking';
import DietPlanPage from '@/pages/DietPlanPage';
import NutritionAnalysisPage from '@/pages/NutritionAnalysisPage';
import ProtectedRoute from '@/components/ProtectedRoute';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="/smartwatch" element={<SmartWatch />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/food-tracking" element={<ProtectedRoute><FoodTracking /></ProtectedRoute>} />
            <Route path="/diet-plan" element={<ProtectedRoute><DietPlanPage /></ProtectedRoute>} />
            <Route path="/nutrition-analysis" element={<ProtectedRoute><NutritionAnalysisPage /></ProtectedRoute>} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
