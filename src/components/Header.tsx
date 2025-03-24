
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterButton from "./RegisterButton";

interface HeaderProps {
  userName: string;
}

const Header = ({ userName }: HeaderProps) => {
  const isLoggedIn = userName !== "Guest";

  return (
    <header className="bg-white shadow-sm py-4 px-4 sticky top-0 z-30">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-fit-purple">
            Fit<span className="text-fit-accent">Hub</span>
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
                  {userName.charAt(0)}
                </div>
              </Link>
            </>
          ) : (
            <RegisterButton />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
