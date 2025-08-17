
"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Gallery } from "@/components/dashboard/gallery";
import { useAuth } from "@/context/auth-context";

const mainCategories = [
  {
    title: "Arulneri Thavachchalai",
    description: "Fostering spiritual growth and mindfulness.",
    icon: <Icons.Temple className="size-8 text-primary" />,
  },
  {
    title: "Bhuseva Nithya Annadhanam",
    description: "Providing daily nutritious meals to those in need.",
    icon: <Icons.Donate className="size-8 text-primary" />,
  },
  {
    title: "Saplings Distributions",
    description: "Promoting environmental stewardship.",
    icon: <Icons.Sprout className="size-8 text-primary" />,
  },
   {
    title: "Other Social Needs",
    description: "Addressing various community needs.",
    icon: <Icons.Users className="size-8 text-primary" />,
  },
];

export default function HomePage() {
  const { recentActivities, upcomingEvents } = useAuth();
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-cover bg-center text-white" style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}} data-ai-hint="charity event">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold">Serving Humanity, Nurturing Nature</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">Join Bhu Seva Public Charitable Trust in our mission to create a compassionate and self-reliant society through service, health, education, and spirituality.</p>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <Gallery />
            </div>
        </section>

        {/* Categories Section */}
        <section id="services" className="py-12 md:py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Our Core Services</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Annadhanam, Arogyam, Arivu & Aanmeegam</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mainCategories.map(category => (
                        <Card key={category.title} className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex justify-center mb-4">{category.icon}</div>
                            <h3 className="text-xl font-bold font-headline">{category.title}</h3>
                            <p className="mt-2 text-muted-foreground">{category.description}</p>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg">Explore Our Work</Button>
                    </Link>
                </div>
            </div>
        </section>

        {/* Recent Activities Section */}
        <section id="activities" className="py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Recent Activities</h2>
                    <p className="mt-2 text-lg text-muted-foreground">See the impact we're making together.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentActivities.map(activity => (
                        <Card key={activity.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                            <div className="relative aspect-video w-full">
                                <Image src={activity.image} alt={activity.title} layout="fill" className="object-cover" data-ai-hint={activity.hint} />
                            </div>
                            <CardContent className="p-6 flex-grow">
                                <h3 className="text-xl font-bold font-headline">{activity.title}</h3>
                                <p className="mt-2 text-muted-foreground">{activity.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="py-12 md:py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Upcoming Events</h2>
                    <p className="mt-2 text-lg text-muted-foreground">Join us in our upcoming initiatives.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {upcomingEvents.map(event => (
                        <Card key={event.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="p-0">
                                <Badge className="mb-2 w-fit">{event.date}</Badge>
                                <CardTitle className="font-headline">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-2">
                                <p className="text-muted-foreground">{event.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Mission Statement Section */}
        <section className="py-12 md:py-20 bg-primary/10">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Serving Humanity, Nurturing Nature</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Join Bhu Seva Public Charitable Trust in our mission to create a compassionate and self-reliant society through service, health, education, and spirituality.
                </p>
            </div>
        </section>

      </main>
      <footer className="bg-foreground text-background">
          <div className="container mx-auto py-6 px-4 text-center">
              <p>&copy; 2025 Bhu Seva Public Charitable Trust. All Rights Reserved.</p>
              <p className="text-sm mt-2">Developed by Yadhesh DG</p>
          </div>
      </footer>
    </div>
  );
}
