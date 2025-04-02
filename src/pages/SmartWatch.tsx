
import { useState } from 'react';
import { ArrowLeft, Plus, Smartphone, BarChart2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

const SmartWatch = () => {
  const navigate = useNavigate();
  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 1,
      name: "Fitbit Sense",
      type: "smartwatch",
      battery: 75,
      connected: true,
      lastSync: "Today, 09:30 AM"
    },
    {
      id: 2,
      name: "Mi Smart Scale",
      type: "scale",
      battery: 90,
      connected: true,
      lastSync: "Yesterday, 07:15 PM"
    }
  ]);

  const DeviceCard = ({ device }: { device: typeof connectedDevices[0] }) => {
    const [isConnected, setIsConnected] = useState(device.connected);
    
    const handleToggleConnection = () => {
      setIsConnected(!isConnected);
      
      // Update the device in the list
      setConnectedDevices(prevDevices => 
        prevDevices.map(d => 
          d.id === device.id ? { ...d, connected: !isConnected } : d
        )
      );
    };
    
    return (
      <div className="fit-card p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-fit-secondary/10 flex items-center justify-center mr-3">
              {device.type === "smartwatch" ? (
                <Watch className="h-5 w-5 text-fit-accent" />
              ) : (
                <BarChart2 className="h-5 w-5 text-fit-accent" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-fit-primary">{device.name}</h3>
              <span className="text-xs text-fit-muted">Last sync: {device.lastSync}</span>
            </div>
          </div>
          <Switch 
            checked={isConnected} 
            onCheckedChange={handleToggleConnection}
          />
        </div>
        
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-fit-muted">Battery</span>
          <span className={device.battery > 20 ? "text-fit-primary" : "text-red-500"}>
            {device.battery}%
          </span>
        </div>
        <Progress value={device.battery} className="h-1.5" />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-fit-background">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-fit-primary" />
        </button>
        <h1 className="text-xl font-semibold text-fit-primary">Devices</h1>
      </header>
      
      <main className="pb-20 px-6">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-fit-muted mb-3">Connected Devices</h2>
          {connectedDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
        
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="w-full border-dashed border-2 h-14 bg-transparent"
          >
            <Plus className="h-5 w-5 mr-2" />
            Connect a new device
          </Button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-medium text-fit-muted mb-3">Health Data Access</h2>
          <div className="fit-card p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-fit-primary">Heart Rate</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-fit-primary mr-3" />
                <span className="text-fit-primary">Activity Tracking</span>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-fit-primary mr-3" />
                <span className="text-fit-primary">Weight Tracking</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

import { Watch } from 'lucide-react';

export default SmartWatch;
