import { useState } from "react";
import { ArrowLeft, Search, Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  servingSize: string;
}

interface FoodEntryFormProps {
  onBack: () => void;
  initialData?: Partial<FoodItem>;
}

// Dummy food database for search functionality
const foodDatabase = [
  { id: "1", name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 medium" },
  { id: "2", name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 medium" },
  { id: "3", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
  { id: "4", name: "Salmon", calories: 206, protein: 22, carbs: 0, fat: 13, servingSize: "100g" },
  { id: "5", name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup cooked" },
  { id: "6", name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: "100g" },
];

// Mock food estimation model
const estimateNutrition = (name: string, servingSize: string): { calories: number; protein: number; carbs: number; fat: number } => {
  const defaultValues = {
    calories: 150,
    protein: 5,
    carbs: 15,
    fat: 8
  };
  
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('fish')) {
    return { calories: 200, protein: 25, carbs: 0, fat: 10 };
  }
  
  if (lowerName.includes('salad') || lowerName.includes('vegetable') || lowerName.includes('veg')) {
    return { calories: 50, protein: 2, carbs: 8, fat: 1 };
  }
  
  if (lowerName.includes('fruit') || lowerName.includes('apple') || lowerName.includes('banana')) {
    return { calories: 90, protein: 1, carbs: 22, fat: 0 };
  }
  
  if (lowerName.includes('rice') || lowerName.includes('pasta') || lowerName.includes('bread')) {
    return { calories: 180, protein: 4, carbs: 35, fat: 2 };
  }
  
  if (lowerName.includes('cheese') || lowerName.includes('yogurt') || lowerName.includes('milk')) {
    return { calories: 120, protein: 7, carbs: 9, fat: 7 };
  }
  
  let multiplier = 1;
  const sizeMatch = servingSize.match(/\d+/);
  
  if (sizeMatch) {
    const numValue = parseInt(sizeMatch[0], 10);
    if (numValue > 0) {
      if (servingSize.includes('g') || servingSize.includes('gram')) {
        multiplier = numValue / 100;
      } else if (servingSize.includes('oz')) {
        multiplier = numValue / 3.5;
      } else if (servingSize.includes('cup')) {
        multiplier = numValue * 1.5;
      }
    }
  }
  
  return {
    calories: Math.round(defaultValues.calories * multiplier),
    protein: Math.round(defaultValues.protein * multiplier),
    carbs: Math.round(defaultValues.carbs * multiplier),
    fat: Math.round(defaultValues.fat * multiplier)
  };
};

const FoodEntryForm = ({ onBack, initialData }: FoodEntryFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof foodDatabase>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [customFood, setCustomFood] = useState({
    name: initialData?.name || "",
    calories: initialData?.calories || 0,
    protein: initialData?.protein || 0,
    carbs: initialData?.carbs || 0,
    fat: initialData?.fat || 0,
    quantity: initialData?.quantity || 1,
    servingSize: initialData?.servingSize || "",
  });
  const [isCustomEntry, setIsCustomEntry] = useState(!!initialData?.name);
  const [useAutomaticCalculation, setUseAutomaticCalculation] = useState(true);

  const handleSearch = () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const selectFood = (food: typeof foodDatabase[0]) => {
    const newFood: FoodItem = {
      ...food,
      id: Date.now().toString(),
      quantity: 1
    };
    setSelectedFoods([...selectedFoods, newFood]);
    setSearchTerm("");
    setSearchResults([]);
  };

  const updateFoodQuantity = (id: string, quantity: number) => {
    setSelectedFoods(
      selectedFoods.map(food => 
        food.id === id ? { ...food, quantity } : food
      )
    );
  };

  const removeFood = (id: string) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== id));
  };

  const handleCustomFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomFood({
      ...customFood,
      [name]: name === "name" || name === "servingSize" ? value : Number(value),
    });
    
    if (useAutomaticCalculation && (name === "name" || name === "servingSize")) {
      if (customFood.name && customFood.servingSize) {
        const estimatedValues = estimateNutrition(customFood.name, customFood.servingSize);
        setCustomFood(prev => ({
          ...prev,
          calories: estimatedValues.calories,
          protein: estimatedValues.protein,
          carbs: estimatedValues.carbs,
          fat: estimatedValues.fat,
        }));
      }
    }
  };

  const calculateNutrition = () => {
    if (!customFood.name || !customFood.servingSize) {
      toast.error("Please enter food name and serving size");
      return;
    }
    
    const estimatedValues = estimateNutrition(customFood.name, customFood.servingSize);
    setCustomFood(prev => ({
      ...prev,
      calories: estimatedValues.calories,
      protein: estimatedValues.protein,
      carbs: estimatedValues.carbs,
      fat: estimatedValues.fat,
    }));
    
    toast.success("Nutrition values estimated");
  };

  const addCustomFood = () => {
    if (!customFood.name) {
      toast.error("Please enter a food name");
      return;
    }
    
    if (!customFood.servingSize) {
      toast.error("Please enter a serving size");
      return;
    }
    
    const newFood: FoodItem = {
      ...customFood,
      id: Date.now().toString(),
    };
    
    setSelectedFoods([...selectedFoods, newFood]);
    
    setCustomFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      quantity: 1,
      servingSize: "",
    });
    
    setIsCustomEntry(false);
    toast.success("Food added successfully!");
  };

  const saveFoodEntry = () => {
    if (selectedFoods.length === 0) {
      toast.error("Please add at least one food item");
      return;
    }

    console.log("Saving food entry:", selectedFoods);
    
    toast.success("Food entry saved successfully!");
    
    const currentDate = new Date().toISOString().split('T')[0];
    const existingEntries = JSON.parse(localStorage.getItem('foodEntries') || '{}');
    
    existingEntries[currentDate] = [
      ...(existingEntries[currentDate] || []),
      ...selectedFoods
    ];
    
    localStorage.setItem('foodEntries', JSON.stringify(existingEntries));
    
    setTimeout(() => {
      window.location.href = '/nutrition';
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-fit-muted" />
              <Input
                placeholder="Search for a food..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button 
                className="absolute right-0 top-0 bg-fit-purple hover:bg-fit-purple-dark" 
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-white rounded-md border border-gray-200 shadow-sm max-h-60 overflow-y-auto">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => selectFood(food)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.servingSize}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{food.calories} cal</p>
                        <p className="text-xs text-gray-500">
                          P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <h3 className="font-medium">Selected Foods</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-fit-purple"
                onClick={() => setIsCustomEntry(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Food
              </Button>
            </div>

            {selectedFoods.length > 0 ? (
              <div className="space-y-2">
                {selectedFoods.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.servingSize}</p>
                      <p className="text-xs text-gray-500">
                        P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateFoodQuantity(food.id, Math.max(1, food.quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{food.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateFoodQuantity(food.id, food.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-medium">{food.calories * food.quantity} cal</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFood(food.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between font-medium">
                    <span>Total Calories</span>
                    <span>
                      {selectedFoods.reduce(
                        (total, food) => total + food.calories * food.quantity,
                        0
                      )}{" "}
                      cal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No foods added yet. Search for a food or add a custom entry.
              </div>
            )}

            {isCustomEntry && (
              <Card className="mt-4 border-fit-purple border-2">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Add Custom Food</h3>
                  
                  <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-fit-purple" />
                      <span className="text-sm font-medium">Auto-calculate nutrition values</span>
                    </div>
                    <Switch 
                      checked={useAutomaticCalculation} 
                      onCheckedChange={setUseAutomaticCalculation}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="food-name">Food Name</Label>
                      <Input
                        id="food-name"
                        name="name"
                        value={customFood.name}
                        onChange={handleCustomFoodChange}
                        placeholder="e.g., Homemade Salad"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serving-size">Serving Size</Label>
                      <Input
                        id="serving-size"
                        name="servingSize"
                        value={customFood.servingSize}
                        onChange={handleCustomFoodChange}
                        placeholder="e.g., 1 cup, 100g"
                      />
                    </div>
                    
                    {!useAutomaticCalculation ? (
                      <>
                        <div>
                          <Label htmlFor="calories">Calories</Label>
                          <Input
                            id="calories"
                            name="calories"
                            type="number"
                            value={customFood.calories}
                            onChange={handleCustomFoodChange}
                            min="0"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                              id="protein"
                              name="protein"
                              type="number"
                              value={customFood.protein}
                              onChange={handleCustomFoodChange}
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                              id="carbs"
                              name="carbs"
                              type="number"
                              value={customFood.carbs}
                              onChange={handleCustomFoodChange}
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="fat">Fat (g)</Label>
                            <Input
                              id="fat"
                              name="fat"
                              type="number"
                              value={customFood.fat}
                              onChange={handleCustomFoodChange}
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-3 border rounded-md bg-gray-50">
                          <p className="text-sm font-medium mb-2">Estimated Nutrition Values:</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-600">Calories:</p>
                              <p className="font-medium">{customFood.calories} cal</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Protein:</p>
                              <p className="font-medium">{customFood.protein}g</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Carbs:</p>
                              <p className="font-medium">{customFood.carbs}g</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Fat:</p>
                              <p className="font-medium">{customFood.fat}g</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-fit-purple border-fit-purple"
                            onClick={calculateNutrition}
                          >
                            <Calculator className="h-4 w-4 mr-1" />
                            Recalculate
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCustomEntry(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={addCustomFood}
                        className="bg-fit-purple hover:bg-fit-purple-dark"
                      >
                        Add Food
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                className="bg-fit-purple hover:bg-fit-purple-dark"
                onClick={saveFoodEntry}
                disabled={selectedFoods.length === 0}
              >
                Save Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodEntryForm;
