
import { Helmet } from "react-helmet";
import RegistrationForm from "@/components/RegistrationForm";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const Registration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-fit-purple-softer/30 to-white">
      <Helmet>
        <title>Register | Fitness App</title>
      </Helmet>
      
      <Header userName="Guest" />
      
      <main className="fit-container py-6">
        <h1 className="text-2xl font-bold text-fit-primary mb-6">Create Your Account</h1>
        <p className="text-muted-foreground mb-8">
          Complete your profile to get personalized workout and nutrition recommendations.
        </p>
        
        <RegistrationForm />
      </main>
      
      <Navigation />
    </div>
  );
};

export default Registration;
