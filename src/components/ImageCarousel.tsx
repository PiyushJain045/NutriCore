
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000",
    alt: "Modern gym with various workout equipment",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1574689211272-bc14e289e223?q=80&w=1000",
    alt: "Healthy meal preparation with fresh vegetables and protein",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1000", 
    alt: "Person stretching in a bright gym space",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1532465614-6cc8d45f647f?q=80&w=1000",
    alt: "Colorful healthy breakfast bowl with fruits and nuts",
  }
];

const ImageCarousel = () => {
  return (
    <section className="px-6 py-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="p-1">
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-white/80" />
        <CarouselNext className="right-2 bg-white/80" />
      </Carousel>
    </section>
  );
};

export default ImageCarousel;
