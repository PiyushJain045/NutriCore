
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-fit-purple-softer/30 to-white">
      <Header />
      
      <main className="pb-20">
        <div className={`${isMobile ? 'max-w-md' : 'max-w-4xl'} mx-auto px-4 py-6`}>
          {!isLoggedIn && (
            <Button className="w-full mb-6 bg-fit-purple hover:bg-fit-purple-dark" asChild>
              <Link to="/auth">
                <UserPlus className="mr-2 h-5 w-5" />
                Create Your Fitness Profile - Register Now
              </Link>
            </Button>
          )}
        </div>
        
        <ImageCarousel />
        <ActivitySummary />
        <QuickStart />
        
        <div className={`${isMobile ? 'max-w-md' : 'max-w-4xl'} mx-auto px-4 py-4`}>
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
