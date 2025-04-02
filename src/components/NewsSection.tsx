import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowUp, Heart, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const initialNewsItem = {
  id: 1,
  title: "5 Recovery Techniques for Better Muscle Growth",
  category: "Fitness",
  summary: "New research confirms that strategic recovery days can boost muscle development by up to 30%.",
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  readTime: "4 min read",
  trending: true,
};

const NewsSection = () => {
  const isMobile = useIsMobile();
  const [newsItems, setNewsItems] = useState([initialNewsItem]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshNews = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockNewsData = [
        initialNewsItem,
        {
          id: 2,
          title: "New Study: Mediterranean Diet Benefits Mental Health",
          category: "Nutrition",
          summary: "Researchers found that following a Mediterranean diet for 6 months improved mood and reduced anxiety symptoms.",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: "5 min read",
          trending: false,
        },
        {
          id: 3,
          title: "Wearable Tech Revolutionizing Fitness Tracking",
          category: "Technology",
          summary: "The latest generation of fitness wearables can now track stress levels and provide personalized recovery recommendations.",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: "3 min read",
          trending: true,
        }
      ];
      
      setNewsItems(mockNewsData);
      toast({
        title: "News refreshed",
        description: "Latest health and wellness articles loaded",
      });
    } catch (error) {
      console.error("Error refreshing news:", error);
      toast({
        title: "Failed to refresh news",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-fit-purple" />
          <h2 className="text-xl font-bold text-fit-purple">Health & Wellness News</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshNews}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}`}>
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
