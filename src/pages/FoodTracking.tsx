
import { useState } from 'react';
import { ArrowLeft, Camera, FileText, Search, PlusCircle, X } from 'lucide-react';
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
        {!showManualEntry ? (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="text-center py-4">
                  <h2 className="text-lg font-medium mb-2">How would you like to add your food?</h2>
                  <p className="text-sm text-gray-500 mb-6">Take a photo or enter details manually</p>

                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <div className="flex-1">
                      <Label htmlFor="food-image" className="cursor-pointer w-full">
                        <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                          <Camera className="h-10 w-10 text-fit-purple mb-2" />
                          <p className="font-medium text-fit-primary">Take a Photo</p>
                          <p className="text-xs text-gray-500 mt-1">Upload an image of your food</p>
                        </div>
                      </Label>
                      <Input 
                        id="food-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full h-full p-6 border-2 border-dashed"
                        onClick={() => setShowManualEntry(true)}
                      >
                        <div className="flex flex-col items-center">
                          <FileText className="h-10 w-10 text-fit-purple mb-2" />
                          <p className="font-medium text-fit-primary">Manual Entry</p>
                          <p className="text-xs text-gray-500 mt-1">Enter food details yourself</p>
                        </div>
                      </Button>
                    </div>
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
          <FoodEntryForm onBack={() => setShowManualEntry(false)} />
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default FoodTracking;
