
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Check API keys
    if (!GEMINI_API_KEY) {
      console.error("Missing Gemini API key");
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get user id from request
    const { userId } = await req.json();
    
    if (!userId) {
      console.error("Missing user ID in request");
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Processing diet plan request for user:", userId);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Fetch user profile data
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile', details: profileError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (!userProfile) {
      console.error("User profile not found");
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    console.log("User profile fetched:", userProfile.id);

    // Construct prompt for Gemini with user profile data
    const prompt = `
    You are a professional nutritionist. Based on the following user profile, create a detailed, personalized daily diet plan.
    
    User Profile:
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Weight: ${userProfile.weight} kg
    - Height: ${userProfile.height} cm
    - Activity Level: ${userProfile.activity_level}
    ${userProfile.dietary_preferences ? `- Dietary Preferences: ${userProfile.dietary_preferences}` : ''}
    ${userProfile.medical_conditions ? `- Medical Conditions: ${userProfile.medical_conditions}` : ''}
    
    **Output Requirements:**  
    - Provide a detailed meal plan for Breakfast, Lunch, Snacks, and Dinner.  
    - Include calories, protein, carbs, and fats for each meal.  
    - Suggest hydration intake (liters of water per day) with reminder times.  
    - Add a short note for the user regarding any special diet considerations.  
    - Format the response in JSON structure with the following format:
    
    {
      "breakfast": {
        "meal": "Detailed breakfast description",
        "calories": 000,
        "protein": 00,
        "carbs": 00,
        "fat": 00
      },
      "lunch": {
        "meal": "Detailed lunch description",
        "calories": 000,
        "protein": 00,
        "carbs": 00,
        "fat": 00
      },
      "snacks": {
        "meal": "Detailed snacks description",
        "calories": 000,
        "protein": 00,
        "carbs": 00,
        "fat": 00
      },
      "dinner": {
        "meal": "Detailed dinner description",
        "calories": 000,
        "protein": 00,
        "carbs": 00,
        "fat": 00
      },
      "hydration": {
        "total_liters": 0.0,
        "reminder_times": ["8:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"]
      },
      "special_note": "Any special considerations based on the user's profile"
    }
    
    Return only the JSON with no additional text before or after.
    `;

    console.log("Calling Gemini API");

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Error from Gemini API', details: errorData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log("Gemini response received");
    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content || !geminiData.candidates[0].content.parts || !geminiData.candidates[0].content.parts[0].text) {
      console.error("Invalid response format from Gemini:", geminiData);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Gemini API', details: geminiData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract and parse the JSON from Gemini response
    const geminiText = geminiData.candidates[0].content.parts[0].text;
    console.log("Raw Gemini response:", geminiText.substring(0, 100) + "...");
    
    let dietPlan;
    
    try {
      // Find and extract JSON content (handling cases where Gemini wraps JSON in markdown code blocks)
      const jsonMatch = geminiText.match(/```json\n([\s\S]*)\n```/) || geminiText.match(/```\n([\s\S]*)\n```/) || [null, geminiText];
      const jsonContent = jsonMatch[1] || geminiText;
      const cleanedContent = jsonContent.trim().replace(/\\n/g, "").replace(/^```json/, "").replace(/```$/, "");
      
      console.log("Attempting to parse JSON:", cleanedContent.substring(0, 100) + "...");
      dietPlan = JSON.parse(cleanedContent);
      
      // Ensure hydration has the correct structure
      if (typeof dietPlan.hydration === 'object' && !Array.isArray(dietPlan.hydration)) {
        if (!dietPlan.hydration.reminder_times && dietPlan.hydration.schedule) {
          // Convert schedule string to reminder_times array if needed
          const scheduleText = dietPlan.hydration.schedule;
          // Extract times from the schedule text using regex
          const timeRegex = /(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/g;
          const times = scheduleText.match(timeRegex) || ["8:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"];
          
          dietPlan.hydration = {
            ...dietPlan.hydration,
            total_liters: dietPlan.hydration.amount || dietPlan.hydration.total_liters || 2.5,
            reminder_times: times
          };
        }
      } else {
        // Create default hydration if missing or invalid
        dietPlan.hydration = {
          total_liters: 2.5,
          reminder_times: ["8:00 AM", "12:00 PM", "4:00 PM", "8:00 PM"]
        };
      }
      
      console.log("Diet plan parsed successfully");
    } catch (error) {
      console.error("JSON parsing error:", error, "Raw text:", geminiText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse diet plan from Gemini response', details: error.message, response: geminiText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log("Storing diet plan in database");
    
    // Store diet plan in database
    const { data: insertData, error: insertError } = await supabase
      .from('diet_plans')
      .upsert({
        user_id: userId,
        breakfast: dietPlan.breakfast,
        lunch: dietPlan.lunch,
        snacks: dietPlan.snacks,
        dinner: dietPlan.dinner,
        hydration: dietPlan.hydration,
        special_note: dietPlan.special_note
      })
      .select();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: 'Error storing diet plan', details: insertError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log("Diet plan stored successfully");
    
    return new Response(
      JSON.stringify({ success: true, dietPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
