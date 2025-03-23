
import Header from "@/components/Header";
import ImageCarousel from "@/components/ImageCarousel";
import ActivitySummary from "@/components/ActivitySummary";
import QuickStart from "@/components/QuickStart";
import MotivationalBanner from "@/components/MotivationalBanner";
import WorkoutSection from "@/components/WorkoutSection";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-fit-purple-softer/30 to-white">
      <Header userName="Alex" />
      
      <main className="pb-20">
        <ImageCarousel />
        <ActivitySummary />
        <QuickStart />
        <MotivationalBanner />
        <WorkoutSection />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
