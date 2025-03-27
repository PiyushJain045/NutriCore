
import { Home, Dumbbell, Apple, Users, User, Watch } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const isMobile = useIsMobile();

  const handleNavigation = (path: string) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-80 border-t border-border/40 px-2 sm:px-6 py-2 z-50">
      <div className={`${isMobile ? 'max-w-md mx-auto' : 'max-w-4xl mx-auto'}`}>
        <div className={`flex justify-between items-center ${!isMobile && 'px-8'}`}>
          <button 
            onClick={() => handleNavigation('/')}
            className={`nav-item ${activeTab === '/' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <Home className="nav-icon" />
            <span className="text-xs sm:text-sm">Home</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/workouts')}
            className={`nav-item ${activeTab === '/workouts' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <Dumbbell className="nav-icon" />
            <span className="text-xs sm:text-sm">Workouts</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/nutrition')}
            className={`nav-item ${activeTab === '/nutrition' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <Apple className="nav-icon" />
            <span className="text-xs sm:text-sm">Nutrition</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/smartwatch')}
            className={`nav-item ${activeTab === '/smartwatch' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <Watch className="nav-icon" />
            <span className="text-xs sm:text-sm">Devices</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/community')}
            className={`nav-item ${activeTab === '/community' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <Users className="nav-icon" />
            <span className="text-xs sm:text-sm">Social</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/profile')}
            className={`nav-item ${activeTab === '/profile' ? 'active' : 'text-fit-muted'} ${!isMobile && 'hover:bg-slate-100 px-5 py-2'}`}
          >
            <User className="nav-icon" />
            <span className="text-xs sm:text-sm">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
