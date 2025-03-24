import { useState } from "react";
import { Activity, Bluetooth, Clock, Heart, Smartphone, Moon, Link, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const supportedDevices = [
  { id: 1, name: "FitBit Sense 2", compatibility: "High", metrics: ["Steps", "Heart Rate", "Sleep", "Activity"] },
  { id: 2, name: "Apple Watch Series 8", compatibility: "High", metrics: ["Steps", "Heart Rate", "Sleep", "Activity", "ECG"] },
  { id: 3, name: "Samsung Galaxy Watch 5", compatibility: "High", metrics: ["Steps", "Heart Rate", "Sleep", "Activity", "Blood Oxygen"] },
  { id: 4, name: "Garmin Venu 2", compatibility: "Medium", metrics: ["Steps", "Heart Rate", "Sleep", "Activity"] },
  { id: 5, name: "Xiaomi Mi Band 7", compatibility: "Medium", metrics: ["Steps", "Heart Rate", "Sleep"] },
];

const SmartWatch = () => {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [syncPreferences, setSyncPreferences] = useState({
    heartRate: true,
    steps: true,
    sleep: true,
    activity: true,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const handleConnectClick = () => {
    setConnectionStatus("connecting");
    
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setConnectionStatus("connected");
        toast({
          title: "Connection Successful",
          description: `Your ${selectedDevice ? supportedDevices.find(d => d.id === selectedDevice)?.name : "device"} is now connected!`,
          variant: "default",
        });
      } else {
        setConnectionStatus("disconnected");
        toast({
          title: "Connection Failed",
          description: "Please make sure your device is nearby with Bluetooth enabled.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus("disconnected");
    setSelectedDevice(null);
    toast({
      title: "Device Disconnected",
      description: "Your smartwatch has been disconnected.",
    });
  };

  const handleDeviceSelect = (deviceId: number) => {
    setSelectedDevice(deviceId);
    setOpenDialog(true);
  };

  const handleSyncPreferenceChange = (key: keyof typeof syncPreferences) => {
    setSyncPreferences({
      ...syncPreferences,
      [key]: !syncPreferences[key],
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-fit-accent";
      case "connecting": return "text-fit-purple-light";
      default: return "text-fit-muted";
    }
  };

  return (
    <div className="min-h-screen purple-gradient">
      <Header userName="Alex" />
      
      <main className="pb-20">
        <div className="fit-container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-fit-primary">Smartwatch Integration</h1>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                connectionStatus === "connected" ? "bg-fit-accent animate-pulse-soft" : 
                connectionStatus === "connecting" ? "bg-fit-purple-light animate-pulse-soft" : 
                "bg-fit-muted"
              }`}></span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {connectionStatus === "connected" ? "Connected" : 
                 connectionStatus === "connecting" ? "Connecting..." : 
                 "Disconnected"}
              </span>
            </div>
          </div>

          {connectionStatus === "disconnected" && (
            <Card className="purple-card mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bluetooth className="text-fit-purple-dark" />
                  Connect Your Smartwatch
                </CardTitle>
                <CardDescription>
                  Sync your health data in real-time for better insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-lg">
                    <Heart className="w-8 h-8 text-fit-purple mb-2" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-lg">
                    <Activity className="w-8 h-8 text-fit-purple mb-2" />
                    <span className="text-sm font-medium">Activity</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-lg">
                    <Moon className="w-8 h-8 text-fit-purple mb-2" />
                    <span className="text-sm font-medium">Sleep</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/80 rounded-lg">
                    <Clock className="w-8 h-8 text-fit-purple mb-2" />
                    <span className="text-sm font-medium">Steps</span>
                  </div>
                </div>

                <Alert className="bg-white/70 mb-4">
                  <Bluetooth className="h-4 w-4" />
                  <AlertTitle>Ready to connect</AlertTitle>
                  <AlertDescription>
                    Make sure your smartwatch is nearby and Bluetooth is enabled on your device.
                  </AlertDescription>
                </Alert>
                <Button className="w-full" onClick={handleConnectClick}>
                  <Bluetooth className="mr-2" />
                  Start Scanning
                </Button>
              </CardContent>
            </Card>
          )}

          {connectionStatus === "connecting" && (
            <Card className="purple-card mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Searching for Devices</CardTitle>
                <CardDescription>
                  Please make sure your smartwatch is powered on and in pairing mode
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="w-12 h-12 rounded-full border-4 border-fit-purple-light border-t-transparent animate-spin mb-4"></div>
                <p className="text-fit-purple-text">Looking for nearby devices...</p>
              </CardContent>
            </Card>
          )}

          {connectionStatus === "connected" && (
            <Card className="purple-card mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="text-fit-accent" />
                  Device Connected
                </CardTitle>
                <CardDescription>
                  {selectedDevice ? supportedDevices.find(d => d.id === selectedDevice)?.name : "Your device"} is now connected and syncing data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="text-fit-purple" />
                      <span>Heart Rate Monitoring</span>
                    </div>
                    <Switch 
                      checked={syncPreferences.heartRate}
                      onCheckedChange={() => handleSyncPreferenceChange("heartRate")}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="text-fit-purple" />
                      <span>Step Counting</span>
                    </div>
                    <Switch 
                      checked={syncPreferences.steps}
                      onCheckedChange={() => handleSyncPreferenceChange("steps")}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Moon className="text-fit-purple" />
                      <span>Sleep Tracking</span>
                    </div>
                    <Switch 
                      checked={syncPreferences.sleep}
                      onCheckedChange={() => handleSyncPreferenceChange("sleep")}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="text-fit-purple" />
                      <span>Activity Monitoring</span>
                    </div>
                    <Switch 
                      checked={syncPreferences.activity}
                      onCheckedChange={() => handleSyncPreferenceChange("activity")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                  <WifiOff className="mr-2 h-4 w-4" />
                  Disconnect Device
                </Button>
              </CardFooter>
            </Card>
          )}

          <h2 className="text-xl font-semibold mb-4 text-fit-primary">Supported Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {supportedDevices.map((device) => (
              <Card key={device.id} className="fit-card hover:border-fit-purple-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <CardDescription>
                    Compatibility: <span className={`font-medium ${
                      device.compatibility === "High" ? "text-fit-accent" : "text-fit-purple-light"
                    }`}>{device.compatibility}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1">
                    {device.metrics.map((metric) => (
                      <span key={metric} className="bg-fit-purple-softer text-fit-purple-text px-2 py-1 rounded-full text-xs">
                        {metric}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDeviceSelect(device.id)}
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Select Device
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="fit-card">
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Can't find your device?</h3>
                  <p className="text-sm text-fit-muted">Make sure Bluetooth is enabled and your device is in pairing mode. Try restarting both your phone and smartwatch.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Data not syncing?</h3>
                  <p className="text-sm text-fit-muted">Ensure your smartwatch has the latest firmware installed and check app permissions on your phone.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Connection keeps dropping?</h3>
                  <p className="text-sm text-fit-muted">Try keeping your devices within 30 feet of each other and avoid interference from other electronic devices.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedDevice && supportedDevices.find(d => d.id === selectedDevice)?.name}</DialogTitle>
            <DialogDescription>
              Follow these steps to pair your device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pairing-code">Pairing Code (if required)</Label>
              <Input id="pairing-code" placeholder="Enter the code displayed on your device" />
            </div>
            <ol className="list-decimal pl-4 space-y-2 text-sm">
              <li>Enable Bluetooth on your smartphone</li>
              <li>Open the companion app for your smartwatch</li>
              <li>Put your smartwatch in pairing mode</li>
              <li>Select your device from the list when it appears</li>
              <li>Confirm the pairing code if prompted</li>
            </ol>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setOpenDialog(false);
              handleConnectClick();
            }}>
              <Bluetooth className="mr-2 h-4 w-4" />
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

export default SmartWatch;
