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
      const apiKey = "648ed12df9444c98a8f7276b13dc3555";
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=health OR fitness OR wellness&language=en&sortBy=publishedAt&pageSize=3&apiKey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        const newNewsItems = data.articles.map((article: any, index: number) => {
          let category = "Health";
          if (article.title.toLowerCase().includes("fitness") || article.content?.toLowerCase().includes("fitness")) {
            category = "Fitness";
          } else if (article.title.toLowerCase().includes("nutrition") || article.content?.toLowerCase().includes("nutrition")) {
            category = "Nutrition";
          } else if (article.title.toLowerCase().includes("wellness") || article.content?.toLowerCase().includes("wellness")) {
            category = "Wellness";
          }
          
          const publishDate = new Date(article.publishedAt);
          const formattedDate = publishDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
          
          const wordCount = article.content ? article.content.split(' ').length : 150;
          const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";
          
          return {
            id: index + 1,
            title: article.title,
            category: category,
            summary: article.description || "No description available",
            date: formattedDate,
            readTime: readTime,
            trending: Math.random() > 0.7,
            url: article.url
          };
        });
        
        setNewsItems(newNewsItems);
        toast({
          title: "News Updated",
          description: "Latest health and wellness news has been loaded.",
        });
      } else {
        throw new Error('No articles found');
      }
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
