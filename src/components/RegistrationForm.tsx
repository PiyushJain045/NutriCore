import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z
    .number({ 
      required_error: "Age is required",
      invalid_type_error: "Age must be a number" 
    })
    .min(16, { message: "You must be at least 16 years old" })
    .max(120, { message: "Age must be less than 120" }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender option",
  }),
  height: z
    .number({ 
      required_error: "Height is required",
      invalid_type_error: "Height must be a number" 
    })
    .min(50, { message: "Height must be at least 50 cm" })
    .max(250, { message: "Height must be less than 250 cm" }),
  weight: z
    .number({ 
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number" 
    })
    .min(20, { message: "Weight must be at least 20 kg" })
    .max(300, { message: "Weight must be less than 300 kg" }),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very-active"], {
    required_error: "Please select your activity level",
  }),
  medicalConditions: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  region: z.string().min(1, { message: "Please select your region" }),
});

const activityLevelDescriptions = {
  sedentary: "Little to no exercise",
  light: "Light exercise 1-3 days/week",
  moderate: "Moderate exercise 3-5 days/week",
  active: "Active exercise 6-7 days/week",
  "very-active": "Very active & intense exercise daily"
};

const regions = [
  "Africa", 
  "Asia", 
  "Australia/Oceania", 
  "Europe", 
  "North America", 
  "South America"
];

type FormData = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      medicalConditions: "",
      dietaryPreferences: "",
    },
  });

  async function onSubmit(data: FormData) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a profile",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store the profile in the user_profiles table
      const { error } = await supabase.from('user_profiles').insert({
        name: data.name,
        age: data.age,
        gender: data.gender,
        region: data.region,
        height: data.height,
        weight: data.weight,
        activity_level: data.activityLevel,
        medical_conditions: data.medicalConditions || null,
        dietary_preferences: data.dietaryPreferences || null,
        user_id: user.id
      });
      
      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "Registration successful!",
        description: "Your profile has been created.",
      });
      
      setIsSubmitting(false);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="bg-white/90 shadow-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter your age" 
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" id="male" />
                          </FormControl>
                          <FormLabel htmlFor="male" className="font-normal cursor-pointer">
                            Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" id="female" />
                          </FormControl>
                          <FormLabel htmlFor="female" className="font-normal cursor-pointer">
                            Female
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" id="other" />
                          </FormControl>
                          <FormLabel htmlFor="other" className="font-normal cursor-pointer">
                            Other
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                          </FormControl>
                          <FormLabel htmlFor="prefer-not-to-say" className="font-normal cursor-pointer">
                            Prefer not to say
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region/Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter height in cm" 
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter weight in kg" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? undefined : parseInt(value, 10));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(activityLevelDescriptions).map(([key, description]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex flex-col">
                              <span className="font-medium capitalize">{key.replace('-', ' ')}</span>
                              <span className="text-xs text-muted-foreground">{description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Conditions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any medical conditions or health issues"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This helps us provide safer exercise recommendations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any dietary preferences or restrictions"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    For example: vegetarian, vegan, gluten-free, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
