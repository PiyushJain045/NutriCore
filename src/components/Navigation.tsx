
import { Home, Dumbbell, Apple, Users, User, Watch } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-80 border-t border-border/40 px-6 py-2 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => handleNavigation('/')}
            className={`nav-item ${activeTab === '/' ? 'active' : 'text-fit-muted'}`}
          >
            <Home className="nav-icon" />
            <span className="text-xs">Home</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/workouts')}
            className={`nav-item ${activeTab === '/workouts' ? 'active' : 'text-fit-muted'}`}
          >
            <Dumbbell className="nav-icon" />
            <span className="text-xs">Workouts</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/nutrition')}
            className={`nav-item ${activeTab === '/nutrition' ? 'active' : 'text-fit-muted'}`}
          >
            <Apple className="nav-icon" />
            <span className="text-xs">Nutrition</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/smartwatch')}
            className={`nav-item ${activeTab === '/smartwatch' ? 'active' : 'text-fit-muted'}`}
          >
            <Watch className="nav-icon" />
            <span className="text-xs">Devices</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/community')}
            className={`nav-item ${activeTab === '/community' ? 'active' : 'text-fit-muted'}`}
          >
            <Users className="nav-icon" />
            <span className="text-xs">Social</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/profile')}
            className={`nav-item ${activeTab === '/profile' ? 'active' : 'text-fit-muted'}`}
          >
            <User className="nav-icon" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
