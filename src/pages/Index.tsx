
import Header from "@/components/Header";
import ActivitySummary from "@/components/ActivitySummary";
import QuickStart from "@/components/QuickStart";
import MotivationalBanner from "@/components/MotivationalBanner";
import WorkoutSection from "@/components/WorkoutSection";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-fit-background">
      <Header userName="Alex" />
      
      <main className="pb-20">
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
