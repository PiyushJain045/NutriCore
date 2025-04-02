
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-fit-primary">Smartwatch Integration</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {connectionStatus === "disconnected" && (
                <Card className="purple-card mb-6 animate-fade-in">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Bluetooth className="text-fit-purple-dark h-5 w-5 sm:h-6 sm:w-6" />
                      Connect Your Smartwatch
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Sync your health data in real-time for better insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/80 rounded-lg">
                        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-fit-purple mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Heart Rate</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/80 rounded-lg">
                        <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-fit-purple mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Activity</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/80 rounded-lg">
                        <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-fit-purple mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Sleep</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white/80 rounded-lg">
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-fit-purple mb-1 sm:mb-2" />
                        <span className="text-xs sm:text-sm font-medium text-center">Steps</span>
                      </div>
                    </div>

                    <Alert className="bg-white/70 mb-4 text-sm sm:text-base">
                      <Bluetooth className="h-4 w-4" />
                      <AlertTitle>Ready to connect</AlertTitle>
                      <AlertDescription className="text-xs sm:text-sm">
                        Make sure your smartwatch is nearby and Bluetooth is enabled on your device.
                      </AlertDescription>
                    </Alert>
                    <Button className="w-full" onClick={handleConnectClick}>
                      <Bluetooth className="mr-2 h-4 w-4" />
                      Start Scanning
                    </Button>
                  </CardContent>
                </Card>
              )}

              {connectionStatus === "connecting" && (
                <Card className="purple-card mb-6 animate-fade-in">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Searching for Devices</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Please make sure your smartwatch is powered on and in pairing mode
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-4 sm:py-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-fit-purple-light border-t-transparent animate-spin mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base text-fit-purple-text">Looking for nearby devices...</p>
                  </CardContent>
                </Card>
              )}

              {connectionStatus === "connected" && (
                <Card className="purple-card mb-6 animate-fade-in">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Link className="text-fit-accent h-5 w-5 sm:h-6 sm:w-6" />
                      Device Connected
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      {selectedDevice ? supportedDevices.find(d => d.id === selectedDevice)?.name : "Your device"} is now connected and syncing data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Heart className="text-fit-purple h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-sm sm:text-base">Heart Rate Monitoring</span>
                        </div>
                        <Switch 
                          checked={syncPreferences.heartRate}
                          onCheckedChange={() => handleSyncPreferenceChange("heartRate")}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="text-fit-purple h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-sm sm:text-base">Step Counting</span>
                        </div>
                        <Switch 
                          checked={syncPreferences.steps}
                          onCheckedChange={() => handleSyncPreferenceChange("steps")}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Moon className="text-fit-purple h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-sm sm:text-base">Sleep Tracking</span>
                        </div>
                        <Switch 
                          checked={syncPreferences.sleep}
                          onCheckedChange={() => handleSyncPreferenceChange("sleep")}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Activity className="text-fit-purple h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-sm sm:text-base">Activity Monitoring</span>
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
              
              <Card className="fit-card">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="font-medium mb-1 text-sm sm:text-base">Can't find your device?</h3>
                      <p className="text-xs sm:text-sm text-fit-muted">Make sure Bluetooth is enabled and your device is in pairing mode. Try restarting both your phone and smartwatch.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-sm sm:text-base">Data not syncing?</h3>
                      <p className="text-xs sm:text-sm text-fit-muted">Ensure your smartwatch has the latest firmware installed and check app permissions on your phone.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-sm sm:text-base">Connection keeps dropping?</h3>
                      <p className="text-xs sm:text-sm text-fit-muted">Try keeping your devices within 30 feet of each other and avoid interference from other electronic devices.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-fit-primary">Supported Devices</h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {supportedDevices.map((device) => (
                  <Card key={device.id} className="fit-card hover:border-fit-purple-light">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg">{device.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
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
                        className="w-full text-xs sm:text-sm"
                        onClick={() => handleDeviceSelect(device.id)}
                      >
                        <Smartphone className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Select Device
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Connect {selectedDevice && supportedDevices.find(d => d.id === selectedDevice)?.name}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Follow these steps to pair your device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="pairing-code" className="text-sm sm:text-base">Pairing Code (if required)</Label>
              <Input id="pairing-code" placeholder="Enter the code displayed on your device" className="text-sm sm:text-base" />
            </div>
            <ol className="list-decimal pl-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>Enable Bluetooth on your smartphone</li>
              <li>Open the companion app for your smartwatch</li>
              <li>Put your smartwatch in pairing mode</li>
              <li>Select your device from the list when it appears</li>
              <li>Confirm the pairing code if prompted</li>
            </ol>
          </div>
          <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="w-full sm:w-auto text-sm">Cancel</Button>
            <Button onClick={() => {
              setOpenDialog(false);
              handleConnectClick();
            }} className="w-full sm:w-auto text-sm">
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
