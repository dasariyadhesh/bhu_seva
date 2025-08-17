
"use client";

import { Header } from "@/components/header";
import { CategoryCard } from "@/components/dashboard/category-card";
import { DonorBoard } from "@/components/dashboard/donor-board";
import { Icons } from "@/components/icons";
import { AiReporter } from "@/components/dashboard/ai-reporter";
import { BankStatement } from "@/components/dashboard/bank-statement";
import { Button } from "@/components/ui/button";
import React from "react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { VisionStatement } from "@/components/dashboard/vision-statement";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { MainCategory } from "@/lib/donations";

const otherSections = [
    { id: "vision", title: "Our Vision & Contact" },
];

const iconMap: { [key: string]: React.ReactNode } = {
  Temple: <Icons.Temple className="size-8 text-primary" />,
  Donate: <Icons.Donate className="size-8 text-primary" />,
  Sprout: <Icons.Sprout className="size-8 text-primary" />,
  Users: <Icons.Users className="size-8 text-primary" />,
};

export default function DashboardPage() {
  const { user, mainCategories } = useAuth();
  const [selectedId, setSelectedId] = React.useState(mainCategories[0].id);
  const isMobile = useIsMobile();
  
  const allSections = [...mainCategories, ...otherSections];

  const selectedCategory = mainCategories.find(c => c.id === selectedId);
  const selectedItem = allSections.find(item => item.id === selectedId);
  
  const getIcon = (category: MainCategory) => {
    return category.icon ? iconMap[category.icon] : null;
  }

  const renderContent = () => {
      if (selectedCategory) {
          return (
             <div id={selectedCategory.id} className="scroll-mt-32">
              <CategoryCard 
                title={selectedCategory.title}
                description={selectedCategory.description}
                icon={getIcon(selectedCategory)}
                images={selectedCategory.images}
                detailsComponent={selectedCategory.detailsComponent}
              />
          </div>
          )
      }
      switch(selectedId) {
          case 'vision':
              return <div id="vision" className="scroll-mt-32"><VisionStatement /></div>;
          default:
              return null;
      }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="sticky top-16 z-30 flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap rounded-b-lg border-b bg-muted/80 p-2 backdrop-blur-sm md:gap-4">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>{selectedItem?.title || "Menu"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {allSections.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => setSelectedId(item.id)}>
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            allSections.map((item) => (
              <Button 
                  key={item.id} 
                  variant="ghost" 
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                      "flex-none rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-background/50",
                      selectedId === item.id && "bg-background text-primary shadow-sm"
                  )}
              >
                  {item.title}
              </Button>
            ))
          )}
        </div>

        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8 md:pt-10">
          {renderContent()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div id="donors" className="scroll-mt-20">
              <DonorBoard />
            </div>
            <BankStatement />
          </div>
          
          {user?.role === 'admin' && (
            <div className="pt-8">
              <AiReporter />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
