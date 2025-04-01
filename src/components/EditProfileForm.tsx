
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tables } from "@/integrations/supabase/types";

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
import { DialogFooter } from "@/components/ui/dialog";

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

interface EditProfileFormProps {
  userProfile: Tables<'user_profiles'> | null;
  onClose: () => void;
}

const EditProfileForm = ({ userProfile, onClose }: EditProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile?.name || "",
      age: userProfile?.age || undefined,
      gender: (userProfile?.gender as any) || undefined,
      height: userProfile?.height || undefined,
      weight: userProfile?.weight || undefined,
      activityLevel: (userProfile?.activity_level as any) || undefined,
      region: userProfile?.region || "",
      medicalConditions: userProfile?.medical_conditions || "",
      dietaryPreferences: userProfile?.dietary_preferences || "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        age: userProfile.age || undefined,
        gender: (userProfile.gender as any) || undefined,
        height: userProfile.height || undefined,
        weight: userProfile.weight || undefined,
        activityLevel: (userProfile.activity_level as any) || undefined,
        region: userProfile.region || "",
        medicalConditions: userProfile.medical_conditions || "",
        dietaryPreferences: userProfile.dietary_preferences || "",
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: FormData) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your profile",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update the profile in the user_profiles table
      const { error } = await supabase.from('user_profiles').update({
        name: data.name,
        age: data.age,
        gender: data.gender,
        region: data.region,
        height: data.height,
        weight: data.weight,
        activity_level: data.activityLevel,
        medical_conditions: data.medicalConditions || null,
        dietary_preferences: data.dietaryPreferences || null,
      }).eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      toast({
        title: "Profile updated successfully!",
        description: "Your profile has been updated.",
      });
      
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Profile update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={field.value || ""}
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
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="prefer-not-to-say" />
                      </FormControl>
                      <FormLabel className="font-normal">
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                    value={field.value || ""}
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
                    value={field.value || ""}
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
                <Select onValueChange={field.onChange} value={field.value}>
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

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditProfileForm;
