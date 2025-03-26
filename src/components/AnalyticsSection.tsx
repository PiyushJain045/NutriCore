
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { BarChart } from "lucide-react";

const mockData = [
  { date: "Mon", weight: 75, calories: 2100, protein: 120, fat: 70 },
  { date: "Tue", weight: 74.8, calories: 2050, protein: 125, fat: 65 },
  { date: "Wed", weight: 74.5, calories: 1950, protein: 130, fat: 60 },
  { date: "Thu", weight: 74.3, calories: 2000, protein: 135, fat: 55 },
  { date: "Fri", weight: 74.1, calories: 2200, protein: 140, fat: 68 },
  { date: "Sat", weight: 73.9, calories: 2300, protein: 145, fat: 72 },
  { date: "Sun", weight: 73.7, calories: 2150, protein: 142, fat: 67 },
];

const config = {
  weight: { label: "Weight (kg)", color: "#8B5CF6" },
  calories: { label: "Calories", color: "#F97316" },
  protein: { label: "Protein (g)", color: "#10B981" },
  fat: { label: "Fat (g)", color: "#6366F1" },
};

const AnalyticsSection = () => {
  const [activeMetric, setActiveMetric] = React.useState<"weight" | "calories" | "protein" | "fat">("weight");

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-fit-purple">Your Progress Stats</h2>
        <Button variant="outline" size="sm">
          View All Stats
        </Button>
      </div>
      
      <Card className="bg-white shadow-sm border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {(Object.keys(config) as Array<keyof typeof config>).map((key) => (
              <Button
                key={key}
                variant={activeMetric === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveMetric(key)}
                className="text-xs px-3 py-1 h-auto"
              >
                {config[key].label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ChartContainer config={config}>
              <LineChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={config[activeMetric].color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AnalyticsSection;
