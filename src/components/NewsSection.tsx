
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowUp, Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const fallbackNewsItem = {
  id: 1,
  title: "5 Recovery Techniques for Better Muscle Growth",
  category: "Fitness",
  summary: "New research confirms that strategic recovery days can boost muscle development by up to 30%.",
  date: "May 15, 2024",
  readTime: "4 min read",
  trending: true,
  url: "https://example.com/article1"
};

// Mock data for news items
const mockNewsData = [
  {
    id: 1,
    title: "5 Recovery Techniques for Better Muscle Growth",
    category: "Fitness",
    summary: "New research confirms that strategic recovery days can boost muscle development by up to 30%.",
    date: "May 15, 2024",
    readTime: "4 min read",
    trending: true,
    url: "https://www.healthline.com/health/fitness/recovery-techniques"
  },
  {
    id: 2,
    title: "Mediterranean Diet Linked to Reduced Risk of Heart Disease",
    category: "Nutrition",
    summary: "A large-scale study shows that following a Mediterranean diet can reduce the risk of cardiovascular issues by up to 25%.",
    date: "May 12, 2024",
    readTime: "6 min read",
    trending: false,
    url: "https://www.medicalnewstoday.com/articles/mediterranean-diet-benefits"
  },
  {
    id: 3,
    title: "Mindfulness Meditation Shown to Improve Sleep Quality",
    category: "Wellness",
    summary: "Researchers discover that just 10 minutes of daily mindfulness practice can significantly improve sleep patterns and reduce insomnia.",
    date: "May 14, 2024",
    readTime: "5 min read",
    trending: true,
    url: "https://www.sleepfoundation.org/mental-health/mindfulness-meditation-for-sleep"
  }
];

type NewsItem = {
  id: number;
  title: string;
  category: string;
  summary: string;
  date: string;
  readTime: string;
  trending: boolean;
  url: string;
};

const NewsSection = () => {
  const isMobile = useIsMobile();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([fallbackNewsItem]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly reorder mock data to simulate "fresh" news
      const randomizedNews = [...mockNewsData].sort(() => Math.random() - 0.5);
      setNewsItems(randomizedNews);
      
      toast({
        title: "News Updated",
        description: "Latest health and wellness news has been loaded.",
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Failed to load news",
        description: "Using fallback news items. Please try again later.",
        variant: "destructive",
      });
      
      setNewsItems([fallbackNewsItem]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
          onClick={fetchNews} 
          disabled={isLoading}
          className="text-fit-purple"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
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
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-fit-purple flex items-center gap-1 text-xs hover:underline"
                >
                  <Heart className="h-3 w-3" /> Read Article
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsSection;
