
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { UserManagement } from "./user-management";
import { DonationManagement } from "./donation-management";
import { useToast } from "@/hooks/use-toast";
import { MenuItem, NeedItem, RecentActivity, UpcomingEvent, MainCategory, ImageProps } from "@/lib/donations";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

const contentTabs = ["Categories", "Home Page Gallery", "Recent Activities", "Upcoming Events"];

export function AdminDashboard() {
  const { 
    user, 
    loading,
    logo,
    updateLogo,
    qrCodeImage,
    updateQrCodeImage,
    annadhanamMenu, updateAnnadhanamMenu,
    saplingMenu, updateSaplingMenu,
    arulneriNeeds, updateArulneriNeeds,
    recentActivities, updateRecentActivities,
    upcomingEvents, updateUpcomingEvents,
    mainCategories, updateMainCategories,
    galleryImages, updateGalleryImages,
  } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [localLogo, setLocalLogo] = React.useState<string | null>(null);
  const [localQrCodeImage, setLocalQrCodeImage] = React.useState<string | null>(null);
  const [localAnnadhanamMenu, setLocalAnnadhanamMenu] = React.useState<MenuItem[]>([]);
  const [localSaplingMenu, setLocalSaplingMenu] = React.useState<MenuItem[]>([]);
  const [localArulneriNeeds, setLocalArulneriNeeds] = React.useState<NeedItem[]>([]);
  const [localRecentActivities, setLocalRecentActivities] = React.useState<RecentActivity[]>([]);
  const [localUpcomingEvents, setLocalUpcomingEvents] = React.useState<UpcomingEvent[]>([]);
  const [localMainCategories, setLocalMainCategories] = React.useState<MainCategory[]>([]);
  const [localGalleryImages, setLocalGalleryImages] = React.useState<ImageProps[]>([]);
  const [newNeed, setNewNeed] = React.useState("");

  useEffect(() => {
    setLocalLogo(logo);
    setLocalQrCodeImage(qrCodeImage);
    setLocalAnnadhanamMenu(annadhanamMenu);
    setLocalSaplingMenu(saplingMenu);
    setLocalArulneriNeeds(arulneriNeeds);
    setLocalRecentActivities(recentActivities);
    setLocalUpcomingEvents(upcomingEvents);
    setLocalMainCategories(JSON.parse(JSON.stringify(mainCategories))); // Deep copy
    setLocalGalleryImages(JSON.parse(JSON.stringify(galleryImages))); // Deep copy
  }, [logo, qrCodeImage, annadhanamMenu, saplingMenu, arulneriNeeds, recentActivities, upcomingEvents, mainCategories, galleryImages]);

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'admin' && user.role !== 'editor'))) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return <div>Loading...</div>;
  }
  
  const canEdit = user.role === 'admin' || user.role === 'editor';
  const isAdmin = user.role === 'admin';

  // Generic handler for local state updates
  const handleItemChange = <T extends { id: string }>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    field: keyof T,
    value: string | number | string[]
  ) => {
    setState(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };
  
  const handleRemoveItem = <T extends { id: string }>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    id: string
  ) => {
    setState(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = <T,>(
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    newItem: T
  ) => {
     setState(prev => [...prev, newItem]);
  }
  
  const handleAddMenuItem = (menuType: 'annadhanam' | 'sapling') => {
    const setter = menuType === 'annadhanam' ? setLocalAnnadhanamMenu : setLocalSaplingMenu;
    const newItem: MenuItem = { id: Date.now().toString(), title: '', description: '', amount: 0 };
    setter(prev => [...prev, newItem]);
  };

  const handleAddActivity = () => {
    const newActivity: RecentActivity = { id: Date.now().toString(), title: '', description: '', image: 'https://placehold.co/600x400.png', hint: '' };
    setLocalRecentActivities(prev => [...prev, newActivity]);
  };
  
  const handleAddEvent = () => {
    const newEvent: UpcomingEvent = { id: Date.now().toString(), title: '', date: '', description: '' };
    setLocalUpcomingEvents(prev => [...prev, newEvent]);
  };

  const handleNeedChange = (id: string, value: string) => {
    setLocalArulneriNeeds(prev => prev.map(item => item.id === id ? { ...item, name: value } : item));
  };

  const handleRemoveNeed = (id: string) => {
    setLocalArulneriNeeds(prev => prev.filter(item => item.id !== id));
  };
  
  const handleAddNeed = () => {
    if (newNeed.trim()) {
      const newNeedItem: NeedItem = { id: Date.now().toString(), name: newNeed.trim() };
      setLocalArulneriNeeds(prev => [...prev, newNeedItem]);
      setNewNeed("");
    }
  };
  
  const handleCategoryChange = (id: string, field: keyof MainCategory, value: any) => {
      setLocalMainCategories(prev => prev.map(cat => cat.id === id ? { ...cat, [field]: value } : cat));
  }
  
  const handleImageChange = (setState: React.Dispatch<React.SetStateAction<ImageProps[]>>, id: string, field: keyof ImageProps, value: string) => {
    setState(prev => prev.map(img => img.id === id ? { ...img, [field]: value } : img));
  };
  
  const handleCategoryImageChange = (categoryId: string, imageId: string, field: keyof ImageProps, value: string) => {
      setLocalMainCategories(prev => prev.map(cat => {
          if (cat.id === categoryId) {
              const newImages = cat.images.map(img => img.id === imageId ? { ...img, [field]: value } : img);
              return { ...cat, images: newImages };
          }
          return cat;
      }));
  };
  
  const handleImageUpload = (setState: React.Dispatch<React.SetStateAction<ImageProps[]>>, id: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              handleImageChange(setState, id, 'src', base64String);
          };
          reader.readAsDataURL(file);
      }
  }

  const handleRecentActivityImageUpload = (activityId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleItemChange(setLocalRecentActivities, activityId, 'image', base64String);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCategoryImageUpload = (categoryId: string, imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              handleCategoryImageChange(categoryId, imageId, 'src', base64String);
          };
          reader.readAsDataURL(file);
      }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              setLocalLogo(base64String);
          };
          reader.readAsDataURL(file);
      }
  }

  const handleQrCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              setLocalQrCodeImage(base64String);
          };
          reader.readAsDataURL(file);
      }
  }

  const handleSaveChanges = () => {
    if(localLogo) updateLogo(localLogo);
    if(localQrCodeImage) updateQrCodeImage(localQrCodeImage);
    updateAnnadhanamMenu(localAnnadhanamMenu);
    updateSaplingMenu(localSaplingMenu);
    updateArulneriNeeds(localArulneriNeeds);
    updateRecentActivities(localRecentActivities);
    updateUpcomingEvents(localUpcomingEvents);
    updateMainCategories(localMainCategories);
    updateGalleryImages(localGalleryImages);
    toast({
      title: "Changes Saved",
      description: "Your updates have been successfully saved.",
    });
  };

  const renderGalleryManager = (
    images: ImageProps[],
    onImageChange: (id: string, field: keyof ImageProps, value: string) => void,
    onImageUpload: (id: string, event: React.ChangeEvent<HTMLInputElement>) => void,
    onRemove: (id: string) => void,
    onAdd: () => void,
  ) => (
      <div className="space-y-4 pt-6 mt-6 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Image Gallery</Label>
            <Button onClick={onAdd} disabled={!canEdit}>Add Image</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image, index) => (
                  <Card key={image.id || index} className="p-4 space-y-2 relative">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={() => onRemove(image.id)} disabled={!canEdit}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                       <div className="aspect-video w-full bg-muted rounded-md mb-2 overflow-hidden">
                          <Image src={image.src} alt={image.alt} width={600} height={400} className="w-full h-full object-cover" />
                       </div>
                       <div className="space-y-1">
                          <Label>Image URL</Label>
                          <div className="flex gap-2">
                            <Input id={`img-src-${image.id}`} value={image.src} onChange={e => onImageChange(image.id, 'src', e.target.value)} disabled={!canEdit} />
                            <Button asChild variant="outline" size="icon" disabled={!canEdit}>
                                <Label htmlFor={`img-upload-${image.id}`} className="cursor-pointer">
                                    <Upload className="h-4 w-4" />
                                    <input id={`img-upload-${image.id}`} type="file" accept="image/*" className="sr-only" onChange={(e) => onImageUpload(image.id, e)} />
                                </Label>
                            </Button>
                          </div>
                           <p className="text-xs text-muted-foreground pt-1">Paste URL or upload an image.</p>
                      </div>

                      <div className="space-y-1">
                          <Label htmlFor={`img-alt-${image.id}`}>Alt Text (for accessibility)</Label>
                          <Input id={`img-alt-${image.id}`} value={image.alt} onChange={e => onImageChange(image.id, 'alt', e.target.value)} disabled={!canEdit} />
                      </div>
                      <div className="space-y-1">
                          <Label htmlFor={`img-hint-${image.id}`}>AI Hint (for image search)</Label>
                          <Input id={`img-hint-${image.id}`} value={image.hint} onChange={e => onImageChange(image.id, 'hint', e.target.value)} disabled={!canEdit} />
                      </div>
                  </Card>
              ))}
          </div>
      </div>
  );
  
  const renderCategoryContent = (category: MainCategory) => {
    let content;
    switch(category.id) {
      case 'arulneri-thavachchalai':
        content = (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Current Needs</Label>
            <div className="space-y-2">
              {localArulneriNeeds.map(need => (
                <div key={need.id} className="flex items-center gap-2">
                  <Input 
                    value={need.name}
                    onChange={e => handleNeedChange(need.id, e.target.value)}
                    className="flex-grow"
                    disabled={!canEdit}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveNeed(need.id)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input 
                value={newNeed}
                onChange={e => setNewNeed(e.target.value)}
                placeholder="Add new need..."
                disabled={!canEdit}
              />
              <Button onClick={handleAddNeed} disabled={!canEdit}>Add Need</Button>
            </div>
          </div>
        );
        break;
      case 'bhuseva-nithya-annadhanam':
        content = (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Donation Menu</Label>
                <Button onClick={() => handleAddMenuItem('annadhanam')} disabled={!canEdit}>Add Item</Button>
            </div>
            {localAnnadhanamMenu.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                 <Input 
                  value={item.title}
                  onChange={e => handleItemChange(setLocalAnnadhanamMenu, item.id, 'title', e.target.value)}
                  placeholder="Item Title"
                  disabled={!canEdit}
                />
                 <Input 
                  value={item.description}
                  onChange={e => handleItemChange(setLocalAnnadhanamMenu, item.id, 'description', e.target.value)}
                  placeholder="Description"
                  disabled={!canEdit}
                />
                 <Input 
                  type="number"
                  value={item.amount}
                  onChange={e => handleItemChange(setLocalAnnadhanamMenu, item.id, 'amount', Number(e.target.value))}
                  placeholder="Amount"
                  className="w-32"
                  disabled={!canEdit}
                />
                 <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(setLocalAnnadhanamMenu, item.id)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        );
        break;
      case 'saplings-distributions':
        content = (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Sapling Menu</Label>
                <Button onClick={() => handleAddMenuItem('sapling')} disabled={!canEdit}>Add Item</Button>
            </div>
            {localSaplingMenu.map(item => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-4 items-center">
                 <Input 
                  value={item.title}
                  onChange={e => handleItemChange(setLocalSaplingMenu, item.id, 'title', e.target.value)}
                  placeholder="Sapling Type"
                  disabled={!canEdit}
                />
                 <Input 
                  value={item.description}
                  onChange={e => handleItemChange(setLocalSaplingMenu, item.id, 'description', e.target.value)}
                  placeholder="Description"
                  disabled={!canEdit}
                />
                 <Input 
                  type="number"
                  value={item.amount}
                  onChange={e => handleItemChange(setLocalSaplingMenu, item.id, 'amount', Number(e.target.value))}
                  placeholder="Amount"
                  className="w-32"
                  disabled={!canEdit}
                />
                 <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(setLocalSaplingMenu, item.id)} disabled={!canEdit}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        );
        break;
      default:
        content = null;
    }
    
    return (
        <div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={category.description} 
                onChange={(e) => handleCategoryChange(category.id, 'description', e.target.value)}
                placeholder="Enter the description..." 
                disabled={!canEdit}
              />
            </div>
            {content}
            {renderGalleryManager(
                category.images,
                (imageId, field, value) => handleCategoryImageChange(category.id, imageId, field, value),
                (imageId, event) => handleCategoryImageUpload(category.id, imageId, event),
                (imageId) => {
                    const updatedImages = category.images.filter(img => img.id !== imageId);
                    handleCategoryChange(category.id, 'images', updatedImages);
                },
                () => handleCategoryChange(category.id, 'images', [...category.images, { id: Date.now().toString(), src: 'https://placehold.co/1200x800.png', alt: 'New Image', hint: '' }])
            )}
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-headline">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your organization's content here. Your role is: <span className="font-semibold capitalize">{user.role}</span>
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-4">
            <Card className="p-4 space-y-2">
                <Label>Update Logo</Label>
                {localLogo && <Image src={localLogo} alt="Logo Preview" width={64} height={64} className="rounded-md bg-muted p-1" />}
                <Button asChild variant="outline" size="sm">
                  <Label>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                    <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                  </Label>
                </Button>
            </Card>
            <Card className="p-4 space-y-2">
                <Label>Payment QR Code</Label>
                {localQrCodeImage ? 
                  <Image src={localQrCodeImage} alt="QR Code Preview" width={64} height={64} className="rounded-md bg-muted p-1" />
                  : <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No QR</div>
                }
                <Button asChild variant="outline" size="sm">
                  <Label>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload QR
                    <input type="file" accept="image/*" className="sr-only" onChange={handleQrCodeUpload} />
                  </Label>
                </Button>
            </Card>
          </div>
        )}
      </div>

      <Tabs defaultValue="content-management">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
          <TabsTrigger value="content-management">Content Management</TabsTrigger>
          {isAdmin && <TabsTrigger value="donations">Donations</TabsTrigger>}
          {isAdmin && <TabsTrigger value="user-management">User Management</TabsTrigger>}
        </TabsList>
        <TabsContent value="content-management">
            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
                  {contentTabs.map((tab) => (
                    <TabsTrigger key={tab} value={tab.toLowerCase().replace(/ /g, "-")}>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="categories">
                  <Tabs defaultValue="arulneri-thavachchalai" className="w-full pt-2">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
                      {localMainCategories.map((cat) => (
                        <TabsTrigger key={cat.id} value={cat.id}>
                          {cat.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {localMainCategories.map((category) => (
                      <TabsContent key={category.id} value={category.id}>
                        <Card>
                          <CardHeader>
                            <CardTitle>{category.title}</CardTitle>
                            <CardDescription>Manage content for this category.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {renderCategoryContent(category)}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
                <TabsContent value="home-page-gallery">
                  <Card>
                    <CardHeader>
                        <CardTitle>Home Page Gallery</CardTitle>
                        <CardDescription>Manage the main image gallery on the home page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderGalleryManager(
                        localGalleryImages,
                        (id, field, value) => handleImageChange(setLocalGalleryImages, id, field, value),
                        (id, event) => handleImageUpload(setLocalGalleryImages, id, event),
                        (id) => handleRemoveItem(setLocalGalleryImages, id),
                        () => handleAddItem<ImageProps>(setLocalGalleryImages, { id: Date.now().toString(), src: 'https://placehold.co/1200x800.png', alt: 'New Image', hint: '' })
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="recent-activities">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Recent Activities</CardTitle>
                                    <CardDescription>Manage the 'Recent Activities' section on the home page.</CardDescription>
                                </div>
                                <Button onClick={handleAddActivity} disabled={!canEdit}>Add Activity</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {localRecentActivities.map(activity => (
                                <div key={activity.id} className="p-4 border rounded-lg space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input value={activity.title} onChange={e => handleItemChange(setLocalRecentActivities, activity.id, 'title', e.target.value)} placeholder="Activity Title" disabled={!canEdit} />
                                            <div className="space-y-1">
                                                <Label>Description</Label>
                                                <Textarea value={activity.description} onChange={e => handleItemChange(setLocalRecentActivities, activity.id, 'description', e.target.value)} placeholder="Activity Description" disabled={!canEdit} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Image Hint (for AI)</Label>
                                                <Input value={activity.hint} onChange={e => handleItemChange(setLocalRecentActivities, activity.id, 'hint', e.target.value)} placeholder="e.g. food charity" disabled={!canEdit} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Image</Label>
                                            <div className="aspect-video w-full bg-muted rounded-md mb-2 overflow-hidden">
                                                <Image src={activity.image} alt={activity.title} width={600} height={400} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex gap-2">
                                                <Input 
                                                  value={activity.image} 
                                                  onChange={e => handleItemChange(setLocalRecentActivities, activity.id, 'image', e.target.value)} 
                                                  placeholder="https://placehold.co/..." 
                                                  disabled={!canEdit} 
                                                />
                                                <Button asChild variant="outline" size="icon" disabled={!canEdit}>
                                                    <Label htmlFor={`activity-img-upload-${activity.id}`} className="cursor-pointer">
                                                        <Upload className="h-4 w-4" />
                                                        <input id={`activity-img-upload-${activity.id}`} type="file" accept="image/*" className="sr-only" onChange={(e) => handleRecentActivityImageUpload(activity.id, e)} />
                                                    </Label>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(setLocalRecentActivities, activity.id)} disabled={!canEdit}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="upcoming-events">
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Upcoming Events</CardTitle>
                                    <CardDescription>Manage the 'Upcoming Events' section on the home page.</CardDescription>
                                </div>
                                <Button onClick={handleAddEvent} disabled={!canEdit}>Add Event</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {localUpcomingEvents.map(event => (
                                <div key={event.id} className="p-4 border rounded-lg space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Title</Label>
                                            <Input value={event.title} onChange={e => handleItemChange(setLocalUpcomingEvents, event.id, 'title', e.target.value)} placeholder="Event Title" disabled={!canEdit} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Date</Label>
                                            <Input value={event.date} onChange={e => handleItemChange(setLocalUpcomingEvents, event.id, 'date', e.target.value)} placeholder="e.g. August 15, 2024" disabled={!canEdit} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Description</Label>
                                        <Textarea value={event.description} onChange={e => handleItemChange(setLocalUpcomingEvents, event.id, 'description', e.target.value)} placeholder="Event Description" disabled={!canEdit} />
                                    </div>
                                     <div className="flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(setLocalUpcomingEvents, event.id)} disabled={!canEdit}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </TabsContent>
         {isAdmin && (
          <TabsContent value="donations">
             <DonationManagement />
          </TabsContent>
        )}
        {isAdmin && (
          <TabsContent value="user-management">
             <UserManagement />
          </TabsContent>
        )}
      </Tabs>
      
      {canEdit && (
        <div className="flex justify-end mt-8">
          <Button size="lg" onClick={handleSaveChanges}>Save All Changes</Button>
        </div>
      )}
    </div>
  );
}

    