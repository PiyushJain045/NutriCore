
import Header from "@/components/Header";
import ImageCarousel from "@/components/ImageCarousel";
import ActivitySummary from "@/components/ActivitySummary";
import QuickStart from "@/components/QuickStart";
import MotivationalBanner from "@/components/MotivationalBanner";
import WorkoutSection from "@/components/WorkoutSection";
import Navigation from "@/components/Navigation";
import AnalyticsSection from "@/components/AnalyticsSection";
import NewsSection from "@/components/NewsSection";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-fit-purple-softer/30 to-white">
      <Header userName="Guest" />
      
      <main className="pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Button className="w-full mb-6 bg-fit-purple hover:bg-fit-purple-dark" asChild>
            <Link to="/register">
              <UserPlus className="mr-2 h-5 w-5" />
              Create Your Fitness Profile - Register Now
            </Link>
          </Button>
        </div>
        
        <ImageCarousel />
        <ActivitySummary />
        <QuickStart />
        
        <div className="max-w-md mx-auto px-4 py-4">
          <AnalyticsSection />
          <MotivationalBanner />
          <WorkoutSection />
          <NewsSection />
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
