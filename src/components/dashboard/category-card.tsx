
"use client"

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
import { Button } from "../ui/button";
import { DonationDialog } from "./donation-dialog";
import React from "react";
import { useAuth } from "@/context/auth-context";
import Autoplay from "embla-carousel-autoplay"
import { ImageProps as TImageProps } from "@/lib/donations";
import { cn } from "@/lib/utils";


interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  images: TImageProps[];
  detailsComponent?: string;
}

const AnnadhanamMenu = () => {
    const { annadhanamMenu } = useAuth();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [donationAmount, setDonationAmount] = React.useState(0);
    const [purpose, setPurpose] = React.useState("");

    const handleDonate = (amount: number, purpose: string) => {
        setDonationAmount(amount);
        setPurpose(purpose);
        setDialogOpen(true);
    }
    
    return (
        <div className="space-y-3">
            <h4 className="font-semibold text-foreground/90">Donation Menu</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {annadhanamMenu.map(item => (
              <Card key={item.id} className="p-3 flex flex-col">
                  <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button size="sm" className="mt-2 w-full" onClick={() => handleDonate(item.amount, `Annadhanam - ${item.title}`)}>Donate Rs.{item.amount}</Button>
              </Card>
            ))}
            </div>
            <DonationDialog open={dialogOpen} onOpenChange={setDialogOpen} amount={donationAmount} purpose={purpose} />
        </div>
    )
}

const ArulneriNeeds = () => {
    const { arulneriNeeds } = useAuth();
    const [dialogOpen, setDialogOpen] = React.useState(false);

    return (
    <div className="space-y-3">
     <h4 className="font-semibold text-foreground/90">Current Needs</h4>
     <ul className="list-disc list-inside text-muted-foreground space-y-1">
        {arulneriNeeds.map(need => (
          <li key={need.id}>{need.name}</li>
        ))}
     </ul>
     <Button size="sm" className="mt-4 w-full" onClick={() => setDialogOpen(true)}>Contribute to Needs</Button>
     <DonationDialog open={dialogOpen} onOpenChange={setDialogOpen} amount={0} purpose="Arulneri Thavachchalai Needs" />
  </div>
    )
}


const SaplingMenu = () => {
    const { saplingMenu } = useAuth();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [donationAmount, setDonationAmount] = React.useState(0);
    const [purpose, setPurpose] = React.useState("");

    const handleDonate = (amount: number, purpose: string) => {
        setDonationAmount(amount);
        setPurpose(purpose);
        setDialogOpen(true);
    }

    return (
    <div className="space-y-3">
     <h4 className="font-semibold text-foreground/90">Sapling Menu</h4>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {saplingMenu.map(item => (
            <Card key={item.id} className="p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <Button size="sm" className="mt-2 w-full" onClick={() => handleDonate(item.amount, item.title)}>Sponsor for Rs.{item.amount}</Button>
            </Card>
        ))}
     </div>
     <DonationDialog open={dialogOpen} onOpenChange={setDialogOpen} amount={donationAmount} purpose={purpose} />
  </div>
    )
}

const detailsMap: { [key: string]: React.ComponentType } = {
  AnnadhanamMenu,
  ArulneriNeeds,
  SaplingMenu
};

export function CategoryCard({ title, description, icon, images, detailsComponent }: CategoryCardProps) {
  const DetailsComponent = detailsComponent ? detailsMap[detailsComponent] : null;
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden shadow-md transition-shadow hover:shadow-lg">
      <Carousel 
        className="w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={`${title}-${image.id || index}`}>
              <div className="w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={600}
                  className="object-cover w-full h-auto"
                  data-ai-hint={image.hint}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="flex flex-col justify-between p-6 flex-grow">
          <div>
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">{icon}</div>
                <div className="flex-1">
                <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                </div>
            </div>
            <CardDescription className="text-base text-foreground/80">{description}</CardDescription>
          </div>
          {DetailsComponent && (
              <div className="mt-6 pt-6 border-t">
                  <DetailsComponent />
              </div>
          )}
      </div>
    </Card>
  );
}
