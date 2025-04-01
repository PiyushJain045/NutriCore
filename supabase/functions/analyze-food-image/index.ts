
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = "AIzaSyDg6IVHTgIP4niqC__Acbo7MRidUiqT85w";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error("Image file is required");
    }

    // Convert image to base64
    const imageBytes = await imageFile.arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageBytes)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    // Create request for Gemini API
    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this food image and provide the following details as a JSON object with these exact keys: name, servingSize, calories, protein, carbs, fat, mealType (one of: Breakfast, Lunch, Dinner, Snack). The values for protein, carbs, and fat should be numbers in grams. Calories should be a number. All nutritional values should be realistic estimates for the food shown."
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image
              }
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.2,
        max_output_tokens: 1024
      }
    };

    console.log("Sending request to Gemini API");
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No text in the response from Gemini");
    }
    
    console.log("Gemini response:", responseText);
    
    // Try to extract JSON from the response
    let foodData;
    try {
      // Find JSON in the response (it might be surrounded by markdown code blocks or other text)
      const jsonMatch = responseText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                        responseText.match(/\{[\s\S]*?\}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      foodData = JSON.parse(jsonStr);
      
      // Ensure all required fields are present
      const requiredFields = ['name', 'servingSize', 'calories', 'protein', 'carbs', 'fat', 'mealType'];
      const missingFields = requiredFields.filter(field => foodData[field] === undefined);
      
      if (missingFields.length > 0) {
        console.warn(`Missing fields in Gemini response: ${missingFields.join(', ')}`);
        
        // Apply reasonable defaults for missing fields
        if (!foodData.name) foodData.name = "Unknown Food";
        if (!foodData.servingSize) foodData.servingSize = "1 serving";
        if (!foodData.calories) foodData.calories = 200;
        if (!foodData.protein) foodData.protein = 5;
        if (!foodData.carbs) foodData.carbs = 20;
        if (!foodData.fat) foodData.fat = 10;
        if (!foodData.mealType) foodData.mealType = "Snack";
      }
      
      // Normalize the values
      foodData.calories = parseInt(foodData.calories);
      foodData.protein = parseFloat(foodData.protein);
      foodData.carbs = parseFloat(foodData.carbs);
      foodData.fat = parseFloat(foodData.fat);
      
      // Ensure mealType is one of the allowed values
      const allowedMealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
      if (!allowedMealTypes.includes(foodData.mealType)) {
        foodData.mealType = "Snack";
      }
      
    } catch (error) {
      console.error("Error parsing JSON from Gemini response:", error);
      throw new Error("Failed to parse food data from Gemini response");
    }

    return new Response(JSON.stringify(foodData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error in analyze-food-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
