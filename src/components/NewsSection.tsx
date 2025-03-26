
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowUp, Heart } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "5 Recovery Techniques for Better Muscle Growth",
    category: "Fitness",
    summary: "New research confirms that strategic recovery days can boost muscle development by up to 30%.",
    date: "May 15, 2024",
    readTime: "4 min read",
    trending: true,
  },
  {
    id: 2,
    title: "Mediterranean Diet Linked to Improved Cognitive Function",
    category: "Nutrition",
    summary: "A 10-year study found that those following a Mediterranean diet showed significantly better brain health.",
    date: "May 12, 2024",
    readTime: "5 min read",
    trending: false,
  },
  {
    id: 3,
    title: "From Zero to Marathon: Sarah's Inspiring Journey",
    category: "Success Story",
    summary: "How one woman overcame chronic illness to complete her first marathon at age 52.",
    date: "May 10, 2024",
    readTime: "7 min read",
    trending: true,
  },
  {
    id: 4,
    title: "New Study Reveals the Perfect Protein Timing",
    category: "Nutrition",
    summary: "Scientists discover the optimal window for protein consumption to maximize muscle synthesis.",
    date: "May 8, 2024",
    readTime: "3 min read", 
    trending: false,
  },
];

const NewsSection = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-fit-purple" />
          <h2 className="text-xl font-bold text-fit-purple">Health & Wellness News</h2>
        </div>
      </div>
      
      <div className="space-y-4">
        {newsItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2 bg-fit-purple/10 text-fit-purple border-fit-purple/20">
                    {item.category}
                  </Badge>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
                {item.trending && (
                  <Badge className="bg-fit-purple/10 text-fit-purple border-fit-purple/20 flex items-center gap-1">
                    <ArrowUp className="h-3 w-3" /> Trending
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm mt-2">{item.summary}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 pb-4 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {item.date} · {item.readTime}
              </div>
              <button className="text-fit-purple flex items-center gap-1 text-xs hover:underline">
                <Heart className="h-3 w-3" /> Save Article
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
