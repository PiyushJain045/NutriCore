import { useState, useRef } from 'react';
import { ArrowLeft, Camera, FileText, Search, PlusCircle, X, Upload, Utensils, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import FoodEntryForm from '@/components/FoodEntryForm';

const FoodTracking = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showToolDescription, setShowToolDescription] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const activateCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(imageDataUrl);
    
    // Stop camera stream
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Food analysis complete!");
      // Here we would normally pass the result to the form
      setShowManualEntry(true);
    }, 2000);
    
    // In a real implementation, you would call your AI service here
    // const response = await fetch('your-ai-endpoint', {
    //   method: 'POST',
    //   body: JSON.stringify({ image: selectedImage }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // setAnalysisResult(data);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-fit-background">
      <header className="px-6 pt-12 pb-4 flex items-center">
        <button 
          onClick={() => navigate('/nutrition')}
          className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-fit-card hover:bg-fit-secondary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-fit-primary" />
        </button>
        <h1 className="text-xl font-semibold text-fit-primary">Add Food</h1>
      </header>

      <main className="pb-20 px-6">
        {showToolDescription ? (
          <Card className="overflow-hidden border-2 border-emerald-700/20 shadow-lg animate-fade-in mb-6">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-emerald-700/10 mr-4">
                  <Brain className="h-8 w-8 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-800">Smart Meal Tracking</h2>
                  <p className="text-sm text-gray-500">AI-powered nutrition analysis</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                Our AI-powered food tracking makes nutrition logging effortless. Simply take a photo of your meal or enter 
                basic information, and our advanced system will automatically calculate all your macros and nutrition data.
              </p>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="flex items-start">
                  <div className="p-1.5 rounded-full bg-emerald-100 mr-3 mt-0.5">
                    <div className="h-4 w-4 text-emerald-700">✓</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time-Saving:</span> No need to search through extensive food databases
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="p-1.5 rounded-full bg-emerald-100 mr-3 mt-0.5">
                    <div className="h-4 w-4 text-emerald-700">✓</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Accurate:</span> Precise macro and calorie calculations
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="p-1.5 rounded-full bg-emerald-100 mr-3 mt-0.5">
                    <div className="h-4 w-4 text-emerald-700">✓</div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Effortless:</span> Just snap a photo or enter basic details
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowToolDescription(false)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : isCameraActive ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={takePicture}
                className="bg-fit-purple hover:bg-fit-purple-dark"
              >
                Take Photo
              </Button>
              <Button 
                variant="outline" 
                onClick={stopCamera}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : !showManualEntry ? (
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 border-fit-purple/20 shadow-lg">
              <CardContent className="p-4">
                <div className="text-center py-4">
                  <h2 className="text-lg font-bold mb-2 text-fit-primary">How Would You Like to Add Your Food?</h2>
                  <p className="text-sm text-gray-500 mb-6">Choose the most convenient method for you</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Button 
                      onClick={activateCamera}
                      variant="outline" 
                      className="w-full h-full p-6 border-2 border-fit-purple/30 hover:border-fit-purple hover:bg-fit-purple/10 transition-all group"
                    >
                      <div className="flex flex-col items-center">
                        <Camera className="h-10 w-10 text-fit-purple mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-semibold text-fit-primary group-hover:text-fit-purple">Take a Photo</p>
                        <p className="text-xs text-gray-500 mt-1">Snap your meal</p>
                      </div>
                    </Button>
                    
                    <Button 
                      onClick={triggerFileInput}
                      variant="outline" 
                      className="w-full h-full p-6 border-2 border-fit-purple/30 hover:border-fit-purple hover:bg-fit-purple/10 transition-all group"
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-fit-purple mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-semibold text-fit-primary group-hover:text-fit-purple">Upload Image</p>
                        <p className="text-xs text-gray-500 mt-1">From your device</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full h-full p-6 border-2 border-fit-purple/30 hover:border-fit-purple hover:bg-fit-purple/10 transition-all group"
                      onClick={() => setShowManualEntry(true)}
                    >
                      <div className="flex flex-col items-center">
                        <FileText className="h-10 w-10 text-fit-purple mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-semibold text-fit-primary group-hover:text-fit-purple">Manual Entry</p>
                        <p className="text-xs text-gray-500 mt-1">Enter details</p>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      className="bg-fit-purple hover:bg-fit-purple-dark text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all"
                      size="lg"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Quick Add Food
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedImage && (
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img 
                      src={selectedImage} 
                      alt="Food" 
                      className="w-full h-auto rounded-lg object-cover" 
                    />
                    <div className="mt-4 flex justify-center">
                      <Button 
                        className="bg-fit-purple hover:bg-fit-purple-dark"
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Food"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <FoodEntryForm 
            onBack={() => setShowManualEntry(false)} 
            initialData={selectedImage ? { name: "", servingSize: "" } : undefined}
          />
        )}
          
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
      </main>

      <Navigation />
    </div>
  );
};

export default FoodTracking;
