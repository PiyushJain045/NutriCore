
import { useState, useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName = "Alex" }: HeaderProps) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <header className="px-6 pt-12 pb-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12 border-2 border-fit-secondary shadow-sm">
          <AvatarImage src="/placeholder.svg" alt={userName} />
          <AvatarFallback className="bg-fit-secondary text-white">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-fit-muted text-sm">{greeting}</p>
          <h1 className="text-xl font-semibold text-fit-primary flex items-center">
            {userName}
            <ChevronDown className="ml-1 h-4 w-4 text-fit-muted" />
          </h1>
        </div>
      </div>
      <button 
        className="relative p-2 rounded-full bg-fit-card text-fit-primary hover:bg-fit-secondary/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-fit-accent rounded-full"></span>
      </button>
    </header>
  );
};

export default Header;
