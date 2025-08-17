
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"
import React from "react";
import { useAuth } from "@/context/auth-context";

export function Gallery() {
  const { galleryImages } = useAuth();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Card className="shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Gallery</CardTitle>
        <CardDescription className="text-lg">
          A glimpse into our activities and impact.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {galleryImages.map((image) => (
              <CarouselItem key={image.id}>
                <div className="overflow-hidden rounded-lg aspect-video relative">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    className="object-cover"
                    data-ai-hint={image.hint}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
