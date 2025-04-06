
import { Bell, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, signOut } = useAuth();
  const userName = user ? user.email?.split('@')[0] || "User" : "Guest";
  const isLoggedIn = !!user;

  return (
    <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-30">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-fit-purple">
            Nutri<span className="text-fit-accent">Core</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-fit-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <Link 
                to="/profile" 
                className="flex items-center gap-1"
              >
                <div className="w-8 h-8 rounded-full bg-fit-purple-softer flex items-center justify-center text-fit-purple-text font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={signOut}
                title="Sign out"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </Button>
            </>
          ) : (
            <Button asChild variant="secondary">
              <Link to="/auth">Login / Register</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
